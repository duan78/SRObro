/**
 * SRObro - Objets du monde (bâtiments, murs, nature) officiels
 *
 * Instancie les placements extraits de Map.pk2 (server/scripts/parse-map-objects.ts)
 * sur le terrain réel, avec textures officielles via l'AssetLoader.
 * Pour la performance: budget d'objets + limite par modèle + instanciation
 * progressive autour du joueur.
 */

import type { Scene } from '@babylonjs/core';
import type { AssetLoader } from '../../core/AssetLoader';

interface Placement {
  id: number;
  bsr: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
}

type HeightSampler = (x: number, z: number) => number;

const MAX_TOTAL = 200;          // budget perf: objets instanciés
const MAX_PER_MODEL = 15;       // éviter les doublons massifs d'un même modèle
const LOAD_RADIUS = 2600;       // rayon de chargement initial autour du spawn
const EXCLUDE = /ferry|_box|_bottle|tombstone/i; // props de port sur-représentés

interface ObjectsFile {
  anchor: { x: number; z: number };
  objects: Placement[];
}

export class WorldObjects {
  /** Placements officiels (pour calculer des positions dégagées). */
  get allPlacements(): Placement[] {
    return this.placements;
  }
  private scene: Scene;
  private assetLoader: AssetLoader;
  private heightAt: HeightSampler | null = null;
  private roots: import('@babylonjs/core').TransformNode[] = [];
  private placements: Placement[] = [];
  private isLoaded = false;

  constructor(scene: Scene, assetLoader: AssetLoader, heightAt?: HeightSampler) {
    this.scene = scene;
    this.assetLoader = assetLoader;
    this.heightAt = heightAt ?? null;
  }

  async load(centerX = 0, centerZ = 0): Promise<number> {
    if (this.isLoaded) return this.roots.length;
    this.isLoaded = true;
    let data: ObjectsFile;
    try {
      const res = await fetch('/assets/terrain/objects.json');
      if (!res.ok) return 0;
      data = await res.json();
    } catch (e) {
      console.warn('[WorldObjects] objects.json indisponible:', e);
      return 0;
    }
    this.placements = data.objects ?? [];

    // Budget + proximité + limite par modèle
    const perModel = new Map<string, number>();
    const selected: Placement[] = [];
    for (const p of this.placements) {
      if (EXCLUDE.test(p.bsr)) continue;
      const dx = p.x - centerX;
      const dz = p.z - centerZ;
      if (dx * dx + dz * dz > LOAD_RADIUS * LOAD_RADIUS) continue;
      const n = perModel.get(p.bsr) ?? 0;
      if (n >= MAX_PER_MODEL) continue;
      perModel.set(p.bsr, n + 1);
      selected.push(p);
      if (selected.length >= MAX_TOTAL) break;
    }

    let loaded = 0;
    const byModel = new Map<string, Placement[]>();
    for (const p of selected) {
      if (!byModel.has(p.bsr)) byModel.set(p.bsr, []);
      byModel.get(p.bsr)!.push(p);
    }

    for (const [bsr, group] of byModel) {
      // loadGameObject met les containers GLB en cache (AssetLoader.loadGlb):
      // le premier placement d'un modèle paie le chargement, les suivants
      // instancient depuis le cache. Pas de "proto" pré-chargé — il serait
      // resté orphelin et visible à l'origine (0,0,0).
      for (const p of group) {
        try {
          const inst = await this.assetLoader.loadGameObject(bsr);
          if (!inst || !inst.root) continue;
          const groundY = this.heightAt ? this.heightAt(p.x, p.z) : p.y;
          inst.root.position.set(p.x, groundY, p.z);
          inst.root.rotation.y = p.yaw;
          // Bâtiments collisionnables: le rayon de la caméra les prend en
          // compte pour ne pas passer à travers (et le clic les ignore).
          for (const mesh of inst.root.getChildMeshes()) {
            mesh.isPickable = true;
            (mesh as import('@babylonjs/core').Mesh).checkCollisions = true;
            // Statique par nature: gèle la world matrix (sinon ~1500 meshes
            // réévaluent leur transform chaque frame).
            mesh.freezeWorldMatrix();
          }
          inst.root.freezeWorldMatrix();
          this.roots.push(inst.root as unknown as import('@babylonjs/core').TransformNode);
          loaded++;
        } catch {
          // placement isolé raté: on continue
        }
      }
    }

    console.log(`[WorldObjects] ${loaded}/${selected.length} objets officiels placés (${byModel.size} modèles)`);
    return loaded;
  }

  dispose(): void {
    for (const r of this.roots) r.dispose();
    this.roots = [];
  }
}
