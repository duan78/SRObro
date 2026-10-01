/**
 * SRObro - Terrain réel depuis les données officielles (.nvm)
 *
 * Relief: heightmaps 97×97 extraits des navmesh officiels.
 * Textures: tilemaps 96×96 de tuiles (TextureID → tile2d.ifo → PNG converti).
 * Par région, les quads sont groupés par texture pour limiter les draw calls.
 * La région ancrée (Jangan ville) est centrée sur l'origine du monde.
 */

import { Mesh, VertexData, StandardMaterial, Color3, Texture } from '@babylonjs/core';
import type { Scene } from '@babylonjs/core';

export interface RegionIndexEntry {
  x: number;
  z: number;
  file: string;
  worldX: number;
  worldZ: number;
}

export class RealTerrain {
  private scene: Scene;
  private heights = new Map<string, Float32Array>(); // "x_z" -> 97*97
  private meshes: Mesh[] = [];
  private index: { regionSize: number; heightmapSize: number; regions: RegionIndexEntry[] } | null = null;
  private tileIndex: Record<string, string> | null = null;
  private texCache = new Map<string, Texture>();
  private matCache = new Map<string, StandardMaterial>();
  /** Région ancrée au centre du monde local (Jangan ville, zone la plus plate) */
  public static readonly ANCHOR = { x: 69, z: 71 };

  constructor(scene: Scene) {
    this.scene = scene;
  }

  async load(): Promise<boolean> {
    try {
      const res = await fetch('/assets/terrain/regions.json');
      if (!res.ok) return false;
      this.index = await res.json();
      const ti = await fetch('/assets/terrain/tile-index.json');
      if (ti.ok) this.tileIndex = await ti.json();
    } catch (e) {
      console.warn('[RealTerrain] index indisponible:', e);
      return false;
    }

    const size = this.index.regionSize;        // 1920
    const hm = this.index.heightmapSize;       // 97
    const step = size / (hm - 1);              // 20 unités entre samples

    let loaded = 0;
    let textured = 0;
    for (const region of this.index.regions) {
      try {
        const [hBuf, tBuf] = await Promise.all([
          (await fetch(`/assets/terrain/${region.file}`)).arrayBuffer(),
          (await fetch(`/assets/terrain/${region.file.replace('.f32', '.tiles')}`)).arrayBuffer(),
        ]);
        const heights = new Float32Array(hBuf);
        const tiles = new Uint16Array(tBuf);
        this.heights.set(`${region.x}_${region.z}`, heights);
        if (this.buildRegionMesh(region, heights, tiles, hm, step)) textured++;
        loaded++;
      } catch {
        // région illisible: ignorée
      }
    }
    console.log(`[RealTerrain] ${loaded} régions chargées, ${textured} texturées (ancre ${RealTerrain.ANCHOR.x}x${RealTerrain.ANCHOR.z})`);
    return loaded > 0;
  }

  /**
   * Construit la région en groupant les tuiles par TextureID: un mesh par
   * texture officielle, UV 0-1 par tuile (une texture couvre exactement 20×20).
   */
  private buildRegionMesh(
    region: RegionIndexEntry,
    heights: Float32Array,
    tiles: Uint16Array,
    hm: number,
    step: number,
  ): boolean {
    const size = this.index!.regionSize;
    const originX = (region.x - RealTerrain.ANCHOR.x) * size;
    const originZ = (region.z - RealTerrain.ANCHOR.z) * size;
    const quads = hm - 1; // 96
    const samp = (r: number, c: number): number => heights[r * hm + c];

    // Grouper les indices de tuiles par texture
    const byTexture = new Map<number, number[]>();
    for (let t = 0; t < tiles.length; t++) {
      const texId = tiles[t];
      if (texId === 0xFFFF) continue;
      if (!byTexture.has(texId)) byTexture.set(texId, []);
      byTexture.get(texId)!.push(t);
    }

    let built = false;
    for (const [texId, tileIdxs] of byTexture) {
      if (!this.tileIndex || !(String(texId) in this.tileIndex)) continue;
      const texFile = this.tileIndex![String(texId)];
      const mat = this.materialFor(texFile);
      if (!mat) continue;

      const positions: number[] = [];
      const uvs: number[] = [];
      const indices: number[] = [];
      for (const t of tileIdxs) {
        const r = Math.floor(t / quads);
        const c = t % quads;
        const i0 = positions.length / 3;
        // 4 coins de la tuile avec hauteurs réelles
        positions.push(
          originX + c * step, samp(r, c), originZ + r * step,
          originX + c * step, samp(r + 1, c), originZ + (r + 1) * step,
          originX + (c + 1) * step, samp(r + 1, c + 1), originZ + (r + 1) * step,
          originX + (c + 1) * step, samp(r, c + 1), originZ + r * step,
        );
        uvs.push(0, 0, 0, 1, 1, 1, 1, 0);
        indices.push(i0, i0 + 1, i0 + 2, i0, i0 + 2, i0 + 3);
      }
      if (positions.length === 0) continue;

      const vd = new VertexData();
      vd.positions = positions;
      vd.uvs = uvs;
      vd.indices = indices;
      const mesh = new Mesh(`terrain_${region.x}_${region.z}_t${texId}`, this.scene);
      vd.applyToMesh(mesh, false);
      mesh.material = mat;
      mesh.checkCollisions = true;
      mesh.receiveShadows = true;
      mesh.freezeWorldMatrix();
      this.meshes.push(mesh);
      built = true;
    }
    return built;
  }

  /** Matériau partagé par fichier de texture (cache scène). */
  private materialFor(texFile: string): StandardMaterial | null {
    if (this.matCache.has(texFile)) return this.matCache.get(texFile)!;
    const png = texFile.replace(/\.ddj$/i, '.png');
    const url = `/assets/textures/tile2d/${png}`;
    let tex: Texture;
    if (this.texCache.has(png)) {
      tex = this.texCache.get(png)!;
    } else {
      tex = new Texture(url, this.scene);
      tex.anisotropicFilteringLevel = 4;
      this.texCache.set(png, tex);
    }
    const mat = new StandardMaterial(`tile_${png}`, this.scene);
    mat.diffuseTexture = tex;
    mat.specularColor = new Color3(0.02, 0.02, 0.02);
    // Les heightmaps extraites peuvent donner un maillage miroir (ordre des
    // lignes inversé selon la version du script d'extraction) → winding des
    // triangles inversé → backface culling rendait le sol invisible.
    // Double-face: coût négligeable sur du terrain vue de dessus.
    mat.backFaceCulling = false;
    this.matCache.set(texFile, mat);
    return mat;
  }

  /** Hauteur du terrain à une position locale (interpolation bilinéaire). */
  heightAt(x: number, z: number): number {
    if (!this.index) return 0;
    const size = this.index.regionSize;
    const hm = this.index.heightmapSize;
    const step = size / (hm - 1);
    const gx = Math.floor(x / size) + RealTerrain.ANCHOR.x;
    const gz = Math.floor(z / size) + RealTerrain.ANCHOR.z;
    const heights = this.heights.get(`${gx}_${gz}`);
    if (!heights) return 0;
    const lx = (x - Math.floor(x / size) * size) / step;
    const lz = (z - Math.floor(z / size) * size) / step;
    const c0 = Math.max(0, Math.min(hm - 2, Math.floor(lx)));
    const r0 = Math.max(0, Math.min(hm - 2, Math.floor(lz)));
    const fx = Math.max(0, Math.min(1, lx - c0));
    const fz = Math.max(0, Math.min(1, lz - r0));
    const h = (r: number, c: number): number => heights[r * hm + c];
    return (
      h(r0, c0) * (1 - fx) * (1 - fz) + h(r0, c0 + 1) * fx * (1 - fz) +
      h(r0 + 1, c0) * (1 - fx) * fz + h(r0 + 1, c0 + 1) * fx * fz
    );
  }

  dispose(): void {
    for (const m of this.meshes) m.dispose();
    this.meshes = [];
    this.heights.clear();
  }
}
