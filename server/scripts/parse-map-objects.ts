/**
 * SRObro - Extraction des placements d'objets du monde (format MAPO exact)
 *
 * Enregistrement JMXVMAPO (28 octets, décodé empiriquement et validé):
 *   [u32 assetId][f32 x][f32 y][f32 z][u16 type=0xFFFF][f32 yaw radians]
 *   [u16 uid][u16 short0][u8 isBig][u8 isStruct]
 * suivi optionnellement d'extensions de 8 octets (échelle...).
 *
 * Sources: Map.pk2/object.ifo (AssetID→BSR) + Map.pk2/<X>/<Z>.o par région.
 * Sortie: client/public/assets/terrain/objects.json (positions au mètre près).
 *
 * Usage: npx tsx scripts/parse-map-objects.ts [xC zC half]
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');
const MAP_DIR = path.join(ROOT, 'assets/pk2_map');
const MANIFEST = path.resolve(ROOT, 'client/public/assets/manifest.json');
const OUT = path.join(ROOT, 'client/public/assets/terrain/objects.json');

const args = process.argv.slice(2).map(Number);
const [cx, cz, half] = args.length >= 3 ? args : [69, 71, 3]; // Jangan ville

interface Placement {
  id: number;
  bsr: string;
  x: number;
  y: number;
  z: number;
  yaw: number;
  struct: number;
}

function main(): void {
  // 1. Table AssetID -> BSR
  const assetToBsr = new Map<number, string>();
  for (const line of fs.readFileSync(path.join(MAP_DIR, 'object.ifo'), 'latin1').split(/\r?\n/)) {
    const m = line.match(/^\s*(\d+)\s+0x[0-9a-fA-F]+\s+"(.+)"\s*$/);
    if (m) assetToBsr.set(Number(m[1]), m[2].replace(/\\/g, '/'));
  }
  console.log(`object.ifo: ${assetToBsr.size} modèles référencés`);

  // 2. Manifest: stems disponibles
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const available = new Set(Object.keys(manifest.resources ?? {}));

  // 3. Parse exact des .o de la grille
  const objects: Placement[] = [];
  let filesRead = 0;
  for (let x = cx - half; x <= cx + half; x++) {
    for (let z = cz - half; z <= cz + half; z++) {
      const oPath = path.join(MAP_DIR, String(x), `${z}.o`);
      if (!fs.existsSync(oPath)) continue;
      const b = fs.readFileSync(oPath);
      filesRead++;
      parseFile(b, x, z, assetToBsr, available, objects, cx, cz);
    }
  }

  objects.sort((p, q) => (p.x ** 2 + p.z ** 2) - (q.x ** 2 + q.z ** 2));
  const limited = objects.slice(0, 3000);

  fs.mkdirSync(path.dirname(OUT), { recursive: true });
  fs.writeFileSync(OUT, JSON.stringify({ anchor: { x: cx, z: cz }, objects: limited }));
  const byStem = new Map<string, number>();
  for (const o of limited) byStem.set(o.bsr, (byStem.get(o.bsr) ?? 0) + 1);
  console.log(`${filesRead} fichiers .o lus, ${objects.length} placements valides (${limited.length} retenus)`);
  console.log('top modèles:', [...byStem.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([k, c]) => `${k}×${c}`).join(', '));
}

function parseFile(
  b: Buffer,
  rx: number,
  rz: number,
  assetToBsr: Map<number, string>,
  available: Set<string>,
  out: Placement[],
  cx: number,
  cz: number,
): void {
  let off = 16;
  while (off + 28 <= b.length) {
    const assetId = b.readUInt32LE(off);
    const px = b.readFloatLE(off + 4);
    const py = b.readFloatLE(off + 8);
    const pz = b.readFloatLE(off + 12);
    const type = b.readUInt16LE(off + 16);
    const yaw = b.readFloatLE(off + 18);
    const isStruct = b[off + 27];

    const valid = assetToBsr.has(assetId)
      && type === 0xFFFF
      && Number.isFinite(yaw) && Math.abs(yaw) <= 100
      && px > -10 && px < 1930 && pz > -10 && pz < 1930
      && py > -600 && py < 800;

    if (!valid) {
      off += 1;
      continue;
    }

    const bsrPath = assetToBsr.get(assetId) as string;
    const stem = path.posix.basename(bsrPath).replace(/\.bsr$/i, '').toLowerCase();
    if (available.has(stem)) {
      out.push({
        id: assetId,
        bsr: stem,
        x: Math.round(((rx - cx) * 1920 + px) * 100) / 100,
        y: Math.round(py * 100) / 100,
        z: Math.round(((rz - cz) * 1920 + pz) * 100) / 100,
        yaw: Math.round(yaw * 1000) / 1000,
        struct: isStruct,
      });
    }

    // Enregistrement suivant: +28, ou +8 par extension si le suivant
    // n'est pas directement valide (échelle et champs optionnels)
    if (nextIsValid(b, off + 28, assetToBsr)) {
      off += 28;
    } else {
      let next = off + 36;
      while (next <= b.length - 28 && !nextIsValid(b, next, assetToBsr) && next - off <= 68) {
        next += 8;
      }
      off = next - off <= 68 ? next : off + 28;
    }
  }
}

function nextIsValid(b: Buffer, off: number, assetToBsr: Map<number, string>): boolean {
  if (off + 28 > b.length) return true; // fin de fichier: avance standard
  const id = b.readUInt32LE(off);
  if (!assetToBsr.has(id)) return false;
  // Marqueur d'enregistrement: type = 0xFFFF à +16, yaw plausible à +18
  if (b.readUInt16LE(off + 16) !== 0xFFFF) return false;
  const yaw = b.readFloatLE(off + 18);
  if (!Number.isFinite(yaw) || Math.abs(yaw) > 100) return false;
  const px = b.readFloatLE(off + 4);
  const py = b.readFloatLE(off + 8);
  const pz = b.readFloatLE(off + 12);
  return px > -10 && px < 1930 && pz > -10 && pz < 1930 && py > -600 && py < 800;
}

void main; // (main appelé ci-dessous)
main();
