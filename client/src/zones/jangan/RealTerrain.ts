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
  private meshesByRegion = new Map<string, import('@babylonjs/core').Mesh[]>();
  private index: { regionSize: number; heightmapSize: number; regions: RegionIndexEntry[] } | null = null;
  private tileIndex: Record<string, string> | null = null;
  private texCache = new Map<string, Texture>();
  private matCache = new Map<string, StandardMaterial>();
  /** Streaming: régions chargées autour du joueur (monde multi-continents). */
  private queue: Array<{ region: RegionIndexEntry; withMesh: boolean }> = [];
  private queued = new Set<string>();
  private pumping = false;
  private lastStreamAt = 0;
  private lastCenter: { x: number; z: number } | null = null;
  /** Région ancrée au centre du monde local (Jangan ville, zone la plus plate) */
  public static readonly ANCHOR = { x: 69, z: 71 };
  /** Rayon de streaming en régions (2 → bloc 5×5 autour du joueur). */
  public static readonly STREAM_RADIUS = 2;

  constructor(scene: Scene) {
    this.scene = scene;
  }

  /** Nombre de régions dont les meshes sont en scène (diagnostic). */
  get loadedRegionCount(): number {
    return this.meshesByRegion.size;
  }

  /**
   * Charge l'index puis le bloc de régions autour du point d'apparition
   * (attente synchrone du voisinage immédiat). Le reste du monde (819
   * régions, 3 continents) est streamé à la demande par update().
   */
  async load(centerX = 960, centerZ = 960): Promise<boolean> {
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
    const near = await this.streamTo(centerX, centerZ);
    console.log(`[RealTerrain] ${this.meshesByRegion.size} régions prêtes (ancre ${RealTerrain.ANCHOR.x}x${RealTerrain.ANCHOR.z}, streaming rayon ${RealTerrain.STREAM_RADIUS})`);
    return near > 0;
  }

  /** Streaming périodique appelé depuis la boucle de jeu (throttlé). */
  update(playerX: number, playerZ: number): void {
    const now = performance.now();
    if (now - this.lastStreamAt < 700) return;
    // Rien à faire si le joueur est resté dans la même région
    if (this.lastCenter) {
      const size = this.index?.regionSize ?? 1920;
      const dx = Math.abs(playerX - this.lastCenter.x);
      const dz = Math.abs(playerZ - this.lastCenter.z);
      if (dx < size * 0.5 && dz < size * 0.5) return;
    }
    this.lastStreamAt = now;
    void this.streamTo(playerX, playerZ);
  }

  /** Téléport lointain: bloc autour de la destination chargé AVANT de bouger.
   * Garde-fou 1,5 s: un serveur d'assets lent ne doit jamais retarder le
   * déplacement du joueur (le reste arrive en streaming via update()). */
  async teleportTo(x: number, z: number): Promise<void> {
    await Promise.race([
      this.streamTo(x, z).catch(() => undefined),
      new Promise((r) => setTimeout(r, 1500)),
    ]);
  }

  /**
   * Charge les régions dans le rayon de streaming autour d'une position
   * (sync=true: attendues avant retour; sinon en tâche de fond) et décharge
   * les meshes au-delà du rayon+1. Les heightmaps restent en mémoire
   * (heightAt doit rester juste partout, ~37 Ko/région).
   */
  private async streamTo(px: number, pz: number): Promise<number> {
    if (!this.index) return 0;
    const size = this.index.regionSize;
    const crx = RealTerrain.ANCHOR.x + Math.floor(px / size);
    const crz = RealTerrain.ANCHOR.z + Math.floor(pz / size);
    this.lastCenter = { x: px, z: pz };

    const inRadius = this.index.regions.filter((r) =>
      Math.max(Math.abs(r.x - crx), Math.abs(r.z - crz)) <= RealTerrain.STREAM_RADIUS);

    // Déchargement des régions sorties du rayon (meshes seuls)
    const keep = new Set(inRadius.map((r) => `${r.x}_${r.z}`));
    for (const [key, meshes] of this.meshesByRegion) {
      if (keep.has(key)) continue;
      for (const m of meshes) m.dispose();
      this.meshesByRegion.delete(key);
    }

    // Chargement synchrone du voisinage (retour rapide: rayon 1 d'abord)
    let loaded = 0;
    const sorted = [...inRadius].sort((a, b) =>
      (Math.max(Math.abs(a.x - crx), Math.abs(a.z - crz)) - Math.max(Math.abs(b.x - crx), Math.abs(b.z - crz))));
    for (const region of sorted) {
      if (Math.max(Math.abs(region.x - crx), Math.abs(region.z - crz)) > 1) break;
      if (await this.loadRegion(region)) loaded++;
    }
    // Rayon 2: heightmaps seules en file (meshes limités au rayon mesh)
    for (const region of sorted) {
      const key = `${region.x}_${region.z}`;
      if (this.meshesByRegion.has(key) || this.queued.has(key)) continue;
      const withMesh = Math.max(Math.abs(region.x - crx), Math.abs(region.z - crz)) <= RealTerrain.MESH_RADIUS;
      this.queued.add(key);
      this.queue.push({ region, withMesh });
    }
    this.pump();
    return loaded;
  }

  /** Pompe de la file de streaming (3 chargements parallèles max). */
  private pump(): void {
    if (this.pumping) return;
    this.pumping = true;
    void (async () => {
      let i = 0;
      const worker = async (): Promise<void> => {
        while (i < this.queue.length) {
          const item = this.queue[i++];
          await this.loadRegion(item.region, item.withMesh);
          this.queued.delete(`${item.region.x}_${item.region.z}`);
        }
      };
      await Promise.all(Array.from({ length: Math.min(3, this.queue.length) }, worker));
      this.queue.length = 0;
      this.pumping = false;
    })();
  }

  /** Charge une région (heightmap + tilemap → meshes par texture).
   *  MESH_RADIUS (perf H V3): les MESHES ne sont construits que dans le
   *  rayon 1 (3×3 régions, ~25 × ~8 = 200 meshes — au-delà les draw calls
   *  plombaient le frame: 581 meshes = 50 ms). Les HEIGHTMAPS du rayon 2
   *  continuent d'être chargées (heightAt juste partout). */
  private static readonly MESH_RADIUS = 1;

  private async loadRegion(region: RegionIndexEntry, withMesh = true): Promise<boolean> {
    const key = `${region.x}_${region.z}`;
    if (this.meshesByRegion.has(key)) return false;
    try {
      const [hBuf, tBuf] = await Promise.all([
        (await fetch(`/assets/terrain/${region.file}`)).arrayBuffer(),
        (await fetch(`/assets/terrain/${region.file.replace('.f32', '.tiles')}`)).arrayBuffer(),
      ]);
      const heights = new Float32Array(hBuf);
      const tiles = new Uint16Array(tBuf);
      this.heights.set(key, heights);
      const size = this.index!.regionSize;
      const hm = this.index!.heightmapSize;
      const step = size / (hm - 1);
      const meshes: import('@babylonjs/core').Mesh[] = [];
      if (withMesh && this.buildRegionMesh(region, heights, tiles, hm, step, meshes)) {
        this.meshesByRegion.set(key, meshes);
      } else {
        // Hors rayon mesh ou sans texture: marquée vide pour ne pas re-charger
        this.meshesByRegion.set(key, []);
      }
      return true;
    } catch {
      return false; // région illisible: ignorée
    }
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
    target: import('@babylonjs/core').Mesh[],
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
      target.push(mesh);
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
    for (const meshes of this.meshesByRegion.values()) {
      for (const m of meshes) m.dispose();
    }
    this.meshesByRegion.clear();
    this.heights.clear();
  }
}
