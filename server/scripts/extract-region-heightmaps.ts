/**
 * SRObro - Extraction des heightmaps + tilemaps de textures par région
 *
 * Les navmesh (Data.pk2/navmesh/nv_RRCC.nvm, RR=x hexa, CC=z hexa) portent:
 *  - un heightmap 97×97 f32 (spec JMXVNVM publique)
 *  - un tilemap 96×96 × 8 octets [CellID u32][Flag u16][TextureID u16]
 * Les TextureID référencent tile2d.ifo (index → fichier .ddj dans Map.pk2/tile2d).
 *
 * Sortie (client/public/assets/terrain/):
 *   <x>_<z>.f32    : heightmap 97*97 floats LE
 *   <x>_<z>.tiles  : TextureID u16 × 96*96 LE
 *   tile-index.json: { id: "c_grass_fld_03.ddj" }
 *   regions.json   : index des régions
 *
 * Usage: npx tsx scripts/extract-region-heightmaps.ts [xMin zMin xMax zMax]
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');
const NAV_DIR = path.join(ROOT, 'assets/pk2_data/navmesh');
const OUT_DIR = path.join(ROOT, 'client/public/assets/terrain');
const TILE2D_IFO = path.join(ROOT, 'assets/pk2_map/tile2d.ifo');

const args = process.argv.slice(2).map(Number);
const [xMin, zMin, xMax, zMax] = args.length >= 4 ? args : [66, 68, 72, 74]; // Jangan

const REG = 1920; // taille monde d'une région (96 tuiles × 20 unités)

function main(): void {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const index: Array<{ x: number; z: number; file: string; worldX: number; worldZ: number }> = [];

  // Index tile2d.ifo: id -> nom de fichier ddj
  const tileIndex: Record<number, string> = {};
  for (const line of fs.readFileSync(TILE2D_IFO, 'latin1').split(/\r?\n/)) {
    const m = line.match(/^\s*(\d+)\s+0x[0-9a-fA-F]+\s+"[^"]*"\s+"([^"]+)"/);
    if (m) tileIndex[Number(m[1])] = m[2];
  }
  fs.writeFileSync(path.join(OUT_DIR, 'tile-index.json'), JSON.stringify(tileIndex));
  console.log(`tile2d.ifo: ${Object.keys(tileIndex).length} textures indexées`);

  for (let x = xMin; x <= xMax; x++) {
    for (let z = zMin; z <= zMax; z++) {
      const hex = ((x << 8) | z).toString(16).padStart(4, '0');
      const nvPath = path.join(NAV_DIR, `nv_${hex}.nvm`);
      if (!fs.existsSync(nvPath)) continue;
      const b = fs.readFileSync(nvPath);
      // Layout de fin: [tilemap 73728][heightmap 37636][planemap 180]
      if (b.length < 73728 + 37636 + 180 + 12) continue;

      const hmOff = b.length - 180 - 37636;
      const heights = Buffer.alloc(37636);
      b.copy(heights, 0, hmOff, hmOff + 37636);

      // Tilemap juste avant le heightmap: TextureID = u16 à +6 de chaque tuile de 8 octets
      const tmOff = hmOff - 73728;
      const tiles = Buffer.alloc(96 * 96 * 2);
      for (let t = 0; t < 96 * 96; t++) {
        tiles.writeUInt16LE(b.readUInt16LE(tmOff + t * 8 + 6), t * 2);
      }

      const base = `${x}_${z}`;
      fs.writeFileSync(path.join(OUT_DIR, `${base}.f32`), heights);
      fs.writeFileSync(path.join(OUT_DIR, `${base}.tiles`), tiles);
      index.push({ x, z, file: `${base}.f32`, worldX: (x - 128) * REG, worldZ: (z - 128) * REG });
    }
  }

  fs.writeFileSync(path.join(OUT_DIR, 'regions.json'), JSON.stringify({
    regionSize: REG,
    heightmapSize: 97,
    regions: index,
  }, null, 1));
  console.log(`Régions extraites: ${index.length} (grille ${xMin}-${xMax} x ${zMin}-${zMax})`);
}

main();
