/**
 * SRObro - Service d'animations officielles (.ban convertis en JSON)
 *
 * Les clips proviennent de ban2json (ban-re): { duration, bones: [{ name,
 * times[], rotations[], positions?[] }] } — transformations locales par os,
 * quaternions xyzw, temps en secondes.
 *
 * Construit des AnimationGroups Babylon ciblant les os par nom (les squelettes
 * sont embarqués dans les GLB: Bip01, Bip01 Pelvis...).
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
  /** Charge (et met en cache) un clip BAN converti. */
  static async loadClip(path: string): Promise<BanClip | null> {
    if (clipCache.has(path)) return clipCache.get(path) ?? null;
    try {
      const res = await fetch(path);
      if (!res.ok) {
        clipCache.set(path, null);
        return null;
      }
      const clip = (await res.json()) as BanClip;
      clipCache.set(path, clip);
      return clip;
    } catch {
      clipCache.set(path, null);
      return null;
    }
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
    const group = new AnimationGroup(name, scene);
    for (const boneClip of clip.bones) {
      const bone = skeleton.bones.find((b) => b.name === boneClip.name);
      if (!bone) continue;

      const kfCount = Math.min(boneClip.times.length, boneClip.rotations.length / 4);
      if (kfCount === 0) continue;

      // Rotation (quaternion xyzw)
      const rotAnim = new Animation(`${name}_${boneClip.name}_rot`, 'rotationQuaternion', 1,
        Animation.ANIMATIONTYPE_QUATERNION, Animation.ANIMATIONLOOPMODE_CYCLE);
      const rotKeys: Array<{ frame: number; value: Quaternion }> = [];
      for (let i = 0; i < kfCount; i++) {
        const r = boneClip.rotations;
        rotKeys.push({
          frame: boneClip.times[i] * 30, // frames à 30 fps
          value: new Quaternion(r[i * 4], r[i * 4 + 1], r[i * 4 + 2], r[i * 4 + 3]),
        });
      }
      rotAnim.setKeys(rotKeys);
      group.addTargetedAnimation(rotAnim, bone);

      // Position (si présente: racine Bip01 pour la locomotion)
      if (boneClip.positions && boneClip.positions.length >= kfCount * 3) {
        const posAnim = new Animation(`${name}_${boneClip.name}_pos`, 'position', 1,
          Animation.ANIMATIONTYPE_VECTOR3, Animation.ANIMATIONLOOPMODE_CYCLE);
        const posKeys: Array<{ frame: number; value: Vector3 }> = [];
        const p = boneClip.positions;
        for (let i = 0; i < kfCount; i++) {
          posKeys.push({
            frame: boneClip.times[i] * 30,
            value: new Vector3(p[i * 3], p[i * 3 + 1], p[i * 3 + 2]),
          });
        }
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
  static monsterClip(stem: string, action: 'walk' | 'attack01' | 'die' | 'damage01'): string {
    return `/assets/anims/mob/china/${stem}_${action}.json`;
  }

  /** Chemin du clip pour le personnage masculin chinois. */
  static playerClip(action: 'walkforward' | 'runforward' | 'standcity'): string {
    return `/assets/anims/char/china/man/chinaman_fighter_${action}.json`;
  }
}
