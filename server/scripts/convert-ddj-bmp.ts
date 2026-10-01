/**
 * SRObro - Conversion des DDJ "non-DXT" (DDS RGB non compressé) en BMP
 *
 * Le convertisseur Rust (crate image) ne décode que les DDS compressés DXT.
 * Les textures officielles en RGB brut (minimap des villes notamment) sont
 * converties ici en BMP 24 bits, format que Babylon charge nativement.
 *
 * Usage: npx tsx scripts/convert-ddj-bmp.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');
const SOURCES: Array<[string, string]> = [
  // [dossier ddj source, dossier sortie]
  [path.join(ROOT, 'assets/pk2_media/minimap'), path.join(ROOT, 'client/public/assets/textures/minimap')],
];

/** Lit le masque d'un canal pour déterminer son décalage en bits. */
function maskShift(mask: number): number {
  let s = 0;
  while (mask !== 0 && (mask & 1) === 0) { s++; mask >>= 1; }
  return s;
}

function convertDdjToBmp(ddj: Buffer): Buffer | null {
  if (ddj.length < 24 || ddj.toString('latin1', 0, 7) !== 'JMXVDDJ') return null;
  const dds = ddj.subarray(20);
  if (dds.length < 128 || dds.toString('latin1', 0, 4) !== 'DDS ') return null;
  const height = dds.readUInt32LE(12);
  const width = dds.readUInt32LE(16);
  const pflags = dds.readUInt32LE(80);
  const fourcc = dds.toString('latin1', 84, 88).replace(/[\x00\s]/g, '');
  if (fourcc.length > 0) return null; // DXT: géré par le convertisseur Rust
  if ((pflags & 0x40) === 0) return null; // pas DDPF_RGB

  const bitCount = dds.readUInt32LE(88);
  const rMask = dds.readUInt32LE(92);
  const gMask = dds.readUInt32LE(96);
  const bMask = dds.readUInt32LE(100);
  const [rS, gS, bS] = [maskShift(rMask), maskShift(gMask), maskShift(bMask)];

  const src = dds.subarray(128);
  const srcStride = Math.ceil((width * bitCount) / 8 / 4) * 4; // aligné 4
  if (src.length < srcStride * height) return null;

  // BMP 24 bits, lignes inversées et alignées 4
  const rowSize = (width * 3 + 3) & ~3;
  const imgSize = rowSize * height;
  const bmp = Buffer.alloc(54 + imgSize);
  bmp.write('BM', 0);
  bmp.writeUInt32LE(54 + imgSize, 2);
  bmp.writeUInt32LE(54, 10);
  bmp.writeUInt32LE(40, 14);
  bmp.writeInt32LE(width, 18);
  bmp.writeInt32LE(height, 22);
  bmp.writeUInt16LE(1, 26);
  bmp.writeUInt16LE(24, 28);
  bmp.writeUInt32LE(0, 30);
  bmp.writeUInt32LE(imgSize, 34);

  for (let y = 0; y < height; y++) {
    const srcRow = src.subarray(y * srcStride, (y + 1) * srcStride);
    const dstRow = 54 + (height - 1 - y) * rowSize;
    for (let x = 0; x < width; x++) {
      let r = 0, g = 0, b = 0;
      if (bitCount === 32 || bitCount === 24) {
        const o = x * (bitCount / 8);
        const px = bitCount === 32 ? srcRow.readUInt32LE(o) : srcRow.readUIntLE(o, 3);
        r = (px >>> rS) & 0xff;
        g = (px >>> gS) & 0xff;
        b = (px >>> bS) & 0xff;
      } else if (bitCount === 16) {
        const px = srcRow.readUInt16LE(x * 2);
        r = ((px >>> rS) & 0x1f) * 255 / 31;
        g = ((px >>> gS) & 0x3f) * 255 / 63;
        b = ((px >>> bS) & 0x1f) * 255 / 31;
      } else {
        return null;
      }
      bmp[dstRow + x * 3] = Math.round(b);
      bmp[dstRow + x * 3 + 1] = Math.round(g);
      bmp[dstRow + x * 3 + 2] = Math.round(r);
    }
  }
  return bmp;
}

let ok = 0;
let skipped = 0;
let failed = 0;
for (const [srcDir, outDir] of SOURCES) {
  const files = fs.readdirSync(srcDir).filter((f) => f.toLowerCase().endsWith('.ddj'));
  for (const f of files) {
    const outPath = path.join(outDir, f.replace(/\.ddj$/i, '.bmp'));
    if (fs.existsSync(outPath)) { skipped++; continue; }
    if (fs.existsSync(path.join(outDir, f.replace(/\.ddj$/i, '.png')))) { skipped++; continue; } // déjà en PNG (DXT ok)
    try {
      const bmp = convertDdjToBmp(fs.readFileSync(path.join(srcDir, f)));
      if (bmp) {
        fs.mkdirSync(outDir, { recursive: true });
        fs.writeFileSync(outPath, bmp);
        ok++;
      } else {
        failed++;
      }
    } catch {
      failed++;
    }
  }
}
console.log(`DDJ→BMP: ${ok} convertis, ${skipped} déjà présents (PNG), ${failed} non convertibles`);
