/**
 * SRObro - Service d'animations officielles (.ban convertis en JSON)
 *
 * Les clips proviennent de ban2json (ban-re): { duration, bones: [{ name,
 * times[], rotations[], positions?[] }] } — quaternions xyzw, temps en
 * secondes. ⚠️ Comme le BSK, les transformations sont ABSOLUES (repère du
 * squelette officiel): play() les convertit en LOCAL hiérarchique via
 * inv(absParent) × absChild avant de créer les AnimationGroups.
 *
 * Cible les os par nom exact ou suffixe (les squelettes embarqués dans les
 * GLB: Bip01, Bip01 Pelvis... — préfixés à l'instantiation).
 */

import { Animation } from '@babylonjs/core/Animations/animation';
import { Animatable, AnimationGroup } from '@babylonjs/core/Animations';
import type { Scene, Skeleton } from '@babylonjs/core';
import { Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector';

export interface BanClip {
  file: string;
  duration: number;
  bones: Array<{
    name: string;
    times: number[];
    rotations: number[];
    positions?: number[];
  }>;
}

const clipCache = new Map<string, BanClip | null>();

export class AnimationService {
  /** Squelettes déjà déliés de leurs transform nodes (re-liage différé géré). */
  private static readonly UNLINKED = new WeakSet<Skeleton>();
  /** Index des clips (anims/index.json): nomfichier → chemin réel. */
  private static clipIndex: Promise<Map<string, string>> | null = null;

  /**
   * Charge l'index des clips une seule fois (les clips vivent dans des
   * sous-dossiers par région: mob/china, mob/oasis, npc/*, cos/*... alors
   * que les stems des modèles ne reflètent pas la région).
   */
  private static loadIndex(): Promise<Map<string, string>> {
    if (!AnimationService.clipIndex) {
      AnimationService.clipIndex = fetch('/assets/anims/index.json')
        .then((r) => (r.ok ? r.json() : {}))
        .then((idx: Record<string, string>) => new Map(Object.entries(idx)))
        .catch(() => new Map());
    }
    return AnimationService.clipIndex;
  }

  /**
   * Alias de stems: modelId serveur → famille de clips réelle
   * (ex. familier "wolf" → clips "p_wolf_01_*").
   */
  private static readonly CLIP_ALIASES: Record<string, string> = {
    wolf: 'p_wolf_01',
    pet_wolf: 'p_wolf_01',
  };

  /**
   * Nom de clip → chemin réel, via l'index, avec normalisation des
   * séparateurs (bigeyeghost_walk ↔ bigeye_ghost_walk) et alias de stems.
   */
  static async resolveClip(name: string): Promise<string | null> {
    const idx = await AnimationService.loadIndex();
    if (idx.size === 0) return null;
    const candidates = [name];
    // alias sur le stem (tout sauf le dernier segment _action)
    const li = name.lastIndexOf('_');
    if (li > 0) {
      const stem = name.slice(0, li);
      const action = name.slice(li + 1);
      const alias = AnimationService.CLIP_ALIASES[stem] ?? AnimationService.CLIP_ALIASES[stem.replace(/[_\-]$/, '')];
      if (alias) candidates.push(`${alias}_${action}`);
    }
    for (const cand of candidates) {
      if (idx.has(cand)) return idx.get(cand)!;
    }
    const norms = candidates.map((c) => c.replace(/[_\-]/g, ''));
    for (const [k, v] of idx) {
      const kn = k.replace(/[_\-]/g, '');
      if (norms.includes(kn)) return v;
    }
    return null;
  }

  /** Charge (et met en cache) un clip BAN converti. */
  static async loadClip(path: string): Promise<BanClip | null> {
    if (clipCache.has(path)) return clipCache.get(path) ?? null;
    const load = async (url: string): Promise<BanClip | null> => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return (await res.json()) as BanClip;
      } catch {
        return null;
      }
    };
    let clip = await load(path);
    if (!clip) {
      // Fallback: résolution par index (région/stem différent du chemin attendu)
      const resolved = await AnimationService.resolveClip(path.split('/').pop()?.replace(/\.json$/, '') ?? '');
      if (resolved) clip = await load(resolved);
    }
    clipCache.set(path, clip);
    return clip;
  }

  /**
   * Construit et démarre un AnimationGroup sur le squelette.
   * @param name nom du groupe
   * @param skeleton squelette cible (os appariés par nom)
   * @param clip clip BAN converti
   * @param loop boucler (cycles walk/idle)
   */
  static play(
    scene: Scene,
    name: string,
    skeleton: Skeleton,
    clip: BanClip,
    loop: boolean,
    speed = 1.0,
  ): AnimationGroup | null {
    // Les bones chargés depuis glTF sont liés à des transform nodes
    // (linkTransformNode) qui réécrasent leurs matrices locales à chaque
    // frame: les animations ciblant les propriétés du bone (position/
    // rotationQuaternion) resteraient invisibles (pose figée, bug oct. 2026).
    // On délie les os animés pour que le bone soit la seule source de vérité
    // de sa pose. ⚠️ le chargeur glTF diffère ses linkTransformNode au
    // PREMIER RENDER (_postSceneLoadActions): un déliage trop tôt serait
    // annulé juste après → on re-délie au frame suivant (une seule fois par
    // squelette, les actions différées étant consommées au premier render).
    const unlinkAll = (): void => {
      for (const b of skeleton.bones) {
        if (b.linkTransformNode) {
          try { b.linkTransformNode(null); } catch { /* déjà délié */ }
        }
      }
    };
    if (!AnimationService.UNLINKED.has(skeleton)) {
      AnimationService.UNLINKED.add(skeleton);
      scene.onAfterRenderObservable.addOnce(unlinkAll);
    }
    unlinkAll();
    const group = new AnimationGroup(name, scene);

    // Convention BAN (validée par simulation skinning complète, oct. 2026):
    // les quaternions/positions du clip sont LOCAUX au parent, et la clé 0
    // décrit la pose NEUTRE debout — celle dans laquelle les maillages BMS
    // sont modélisés (les GLB sont re-patchés en ce sens par
    // scripts/fix-glb-neutral-pose.js: node locals et IBM recalculés depuis
    // cette pose neutre). Application DIRECTE des valeurs, aucune conversion.
    for (const boneClip of clip.bones) {
      // Les instances de modèles préfixent les noms de nodes/oses
      // (`chinaman_adventurer_Bip01`): correspondance exacte ou par suffixe.
      const clipName = boneClip.name;
      const bone = skeleton.bones.find(
        (b) => b.name === clipName || b.name.endsWith('_' + clipName),
      );
      if (!bone) continue;

      const kfCount = Math.min(boneClip.times.length, boneClip.rotations.length / 4);
      if (kfCount === 0) continue;

      const rotKeys: Array<{ frame: number; value: Quaternion }> = [];
      const posKeys: Array<{ frame: number; value: Vector3 }> = [];
      const hasPos = !!boneClip.positions && boneClip.positions.length >= kfCount * 3;
      const r = boneClip.rotations;
      const p = boneClip.positions;
      for (let i = 0; i < kfCount; i++) {
        const frame = boneClip.times[i] * 30; // times en SECONDES → frames à 30 fps
        rotKeys.push({ frame, value: new Quaternion(r[i * 4], r[i * 4 + 1], r[i * 4 + 2], r[i * 4 + 3]) });
        if (hasPos) {
          posKeys.push({ frame, value: new Vector3(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]) });
        }
      }

      // ⚠️ framePerSecond doit valoir 30: les frames sont numérotées
      // time×30. Avec 1 (ancienne valeur), un clip de 1,2 s durait 36 s
      // → membres figés, corps qui glisse (bug « téléportation », oct. 2026).
      const rotAnim = new Animation(`${name}_${boneClip.name}_rot`, 'rotationQuaternion', 30,
        Animation.ANIMATIONTYPE_QUATERNION, Animation.ANIMATIONLOOPMODE_CYCLE);
      rotAnim.setKeys(rotKeys);
      group.addTargetedAnimation(rotAnim, bone);

      if (hasPos) {
        const posAnim = new Animation(`${name}_${boneClip.name}_pos`, 'position', 30,
          Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
        posAnim.setKeys(posKeys);
        group.addTargetedAnimation(posAnim, bone);
      }
    }

    if (group.targetedAnimations.length === 0) {
      group.dispose();
      return null;
    }
    group.speedRatio = speed;
    group.play(loop);
    return group;
  }

  /**
   * Charge un clip et le joue sur tous les squelettes fournis (les parties
   * d'un modèle ont chacune leur instance de squelette, animées en syntonie).
   */
  static async loadAndPlay(
    scene: Scene,
    skeletons: import('@babylonjs/core').Skeleton[],
    clipPath: string,
    loop: boolean,
    speed = 1.0,
  ): Promise<import('@babylonjs/core').AnimationGroup[]> {
    const clip = await AnimationService.loadClip(clipPath);
    if (!clip) return [];
    const groups: import('@babylonjs/core').AnimationGroup[] = [];
    for (const sk of skeletons) {
      const g = AnimationService.play(scene, `${clip.file}_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`, sk, clip, loop, speed);
      if (g) groups.push(g);
    }
    return groups;
  }

  /** Chemin du clip pour un monstre (mob/<catégorie>/<modèle>_<action>). */
  static monsterClip(stem: string, action: 'walk' | 'run' | 'attack01' | 'die' | 'damage01' | 'stand01'): string {
    return `/assets/anims/mob/china/${stem}_${action}.json`;
  }

  /**
   * Chemin du clip pour un personnage chinois (homme ou femme). Le fallback
   * d'index de loadClip rattrape les écarts de nommage éventuels.
   */
  static playerClip(action: 'walkforward' | 'runforward' | 'standcity', female = false): string {
    const race = female ? 'chinawoman' : 'chinaman';
    return `/assets/anims/char/china/${female ? 'woman' : 'man'}/${race}_fighter_${action}.json`;
  }

  /**
   * Clip d'attaque du perso: SRO n'a pas d'« attack01 » générique, les coups
   * sont les CHAÎNES DE COMBO par famille d'arme (skill_ch_sword_chain_a..h,
   * spear_chain_a..g, bow_*). Épée/lame → sword, lance/hallebarde → spear.
   */
  static attackClip(family: 'sword' | 'spear' | 'bow', comboIndex: number, female = false): string {
    const letter = String.fromCharCode(97 + (comboIndex % 3)); // a, b, c
    return `/assets/anims/char/china/${female ? 'woman' : 'man'}/skill_ch_${family}_chain_${letter}.json`;
  }

  /** Réaction aux dégâts du perso (coup dur / coup normal). */
  static hitClip(hard: boolean, female = false): string {
    const race = female ? 'chinawoman' : 'chinaman';
    return `/assets/anims/char/china/${female ? 'woman' : 'man'}/${race}_a_${hard ? 'behardhit' : 'benormalhit'}.json`;
  }
}
