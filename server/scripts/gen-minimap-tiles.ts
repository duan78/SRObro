/**
 * SRObro — gen-minimap-tiles.ts (phase I, fidélité minimap)
 *
 * Le client officiel ne fournit PAS de tuiles Media/minimap pour l'Europe,
 * l'Égypte ni Samarkand (la minimap y restait vide/fond sombre). Ce script
 * génère un fond par région depuis les TILEMAPS OFFICIELLES extraites des
 * navmesh (client/public/assets/terrain/<x>_<z>.tiles: TextureID u16 ×96×96):
 * chaque tuile de terrain devient 1 pixel couleur = couleur moyenne de sa
 * texture officielle tile2d (DDJ → DDS/DXT décodé à la main, sans dépendance).
 *
 * Sortie: client/public/assets/terrain/minimap/<rx>x<rz>.png (96×96, la
 * minimap agrandit à 256 px via drawImage). Seules les régions SANS tuile
 * Media officielle sont générées (la Chine garde ses vraies tuiles).
 *
 * Usage: npx tsx scripts/gen-minimap-tiles.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');
const TERRAIN = path.join(ROOT, 'client/public/assets/terrain');
const OUT_DIR = path.join(TERRAIN, 'minimap');
const MEDIA_MINIMAP = path.join(ROOT, 'client/public/assets/textures/Media/minimap');
const TILE2D = path.join(ROOT, 'assets/pk2_map/tile2d');

// ---------- Décodeur DDJ (préfixe 20 octets + DDS) ----------
/** Décode un DDS et retourne la couleur moyenne RGB (échantillon de blocs). */
function ddjAverageColor(buf: Buffer): [number, number, number] | null {
  if (buf.length < 20 + 128 || buf.readUInt32LE(20) !== 0x20534444) return null; // 'DDS '
  const dds = buf.subarray(20);
  const height = dds.readUInt32LE(12);
  const width = dds.readUInt32LE(16);
  if (width === 0 || height === 0 || width > 4096 || height > 4096) return null;
  const fourCC = dds.toString('ascii', 84, 88);
  const dataOff = 4 + 124;
  if (fourCC === 'DXT1' || fourCC === 'DXT3' || fourCC === 'DXT5') {
    const blockBytes = fourCC === 'DXT1' ? 8 : 16;
    const blocksX = Math.ceil(width / 4);
    const blocksY = Math.ceil(height / 4);
    let r = 0, g = 0, b = 0, n = 0;
    // Échantillonner ~6×6 blocs répartis (couleur moyenne stable, rapide)
    for (let sy = 0; sy < 6; sy++) {
      for (let sx = 0; sx < 6; sx++) {
        const bx = Math.min(blocksX - 1, Math.floor(((sx + 0.5) / 6) * blocksX));
        const by = Math.min(blocksY - 1, Math.floor(((sy + 0.5) / 6) * blocksY));
        const off = dataOff + (by * blocksX + bx) * blockBytes + (fourCC === 'DXT1' ? 0 : 8);
        if (off + 8 > dds.length) continue;
        const c0 = dds.readUInt16LE(off);
        const c1 = dds.readUInt16LE(off + 2);
        // Moyenne des deux couleurs de base du bloc (représentatif)
        const [r0, g0, b0] = rgb565(c0);
        const [r1, g1, b1] = rgb565(c1);
        r += (r0 + r1) / 2; g += (g0 + g1) / 2; b += (b0 + b1) / 2;
        n++;
      }
    }
    return n ? [Math.round(r / n), Math.round(g / n), Math.round(b / n)] : null;
  }
  // DDS RGB non compressé (minorité): pixel central
  const bpp = dds.readUInt32LE(88);
  const pm = dds.readUInt32LE(92), gm = dds.readUInt32LE(96), bm = dds.readUInt32LE(100);
  if (bpp !== 24 && bpp !== 32) return null;
  const stride = width * (bpp / 8);
  const cx = Math.floor(width / 2), cy = Math.floor(height / 2);
  const p = dds.readUInt32LE(dataOff + cy * stride + cx * (bpp / 8));
  const m = (v: number, mask: number): number => {
    if (!mask) return 0;
    let s = 0; while (mask && !((mask >> s) & 1)) s++;
    const bits = Math.log2(mask + 1);
    const raw = (v & mask) >> s;
    return Math.round((raw / ((1 << bits) - 1)) * 255);
  };
  return [m(p, pm), m(p, gm), m(p, bm)];
}

function rgb565(c: number): [number, number, number] {
  return [(c >> 11 & 31) << 3, (c >> 5 & 63) << 2, (c & 31) << 3];
}

// ---------- Encodeur PNG minimal (RGB 8 bits, zlib "stored") ----------
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[i] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Buffer): Buffer {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const body = Buffer.concat([Buffer.from(type, 'ascii'), data]);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(body));
  return Buffer.concat([len, body, crc]);
}

/** PNG RGB: rows = lignes déjà préfixées du byte de filtre (0). */
function encodePngRgb(width: number, height: number, filtered: Buffer): Buffer {
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;  // bit depth
  ihdr[9] = 2;  // color type RGB
  // zlib stream en blocs "stored" (sans compression — couleurs lisses de
  // toute façon, et aucune dépendance npm)
  const blocks: Buffer[] = [Buffer.from([0x78, 0x01])];
  for (let off = 0; off < filtered.length; off += 65535) {
    const slice = filtered.subarray(off, Math.min(off + 65535, filtered.length));
    const final = off + 65535 >= filtered.length ? 1 : 0;
    const hdr = Buffer.alloc(5);
    hdr[0] = final;
    hdr.writeUInt16LE(slice.length, 1);
    hdr.writeUInt16LE(slice.length ^ 0xffff, 3);
    blocks.push(hdr, slice);
  }
  const adler = Buffer.alloc(4);
  let a = 1, b = 0;
  for (const byte of filtered) { a = (a + byte) % 65521; b = (b + a) % 65521; }
  adler.writeUInt32BE(((b << 16) | a) >>> 0);
  blocks.push(adler);
  return Buffer.concat([
    Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
    chunk('IHDR', ihdr),
    chunk('IDAT', Buffer.concat(blocks)),
    chunk('IEND', Buffer.alloc(0)),
  ]);
}

// ---------- Génération ----------
function main(): void {
  const regions = JSON.parse(fs.readFileSync(path.join(TERRAIN, 'regions.json'), 'utf8'))
    .regions as Array<{ x: number; z: number }>;
  const tileIndex: Record<string, string> = JSON.parse(fs.readFileSync(path.join(TERRAIN, 'tile-index.json'), 'utf8'));
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const colorCache = new Map<number, [number, number, number]>();
  const ddjCache = new Map<string, [number, number, number] | null>();
  const texColor = (texId: number): [number, number, number] => {
    const cached = colorCache.get(texId);
    if (cached) return cached;
    const file = tileIndex[String(texId)];
    let col: [number, number, number] = [34, 38, 46]; // absence: gris-bleu sombre
    if (file) {
      const ddj = file.replace(/\.ddj$/i, '.ddj');
      if (!ddjCache.has(ddj)) {
        const p = path.join(TILE2D, ddj);
        ddjCache.set(ddj, fs.existsSync(p) ? ddjAverageColor(fs.readFileSync(p)) : null);
      }
      const c = ddjCache.get(ddj) ?? null;
      if (c) col = c;
    }
    colorCache.set(texId, col);
    return col;
  };

  let generated = 0, skipped = 0, missing = 0;
  const t0 = Date.now();
  for (const r of regions) {
    const key = `${r.x}x${r.z}`;
    const tilesPath = path.join(TERRAIN, `${r.x}_${r.z}.tiles`);
    const outPath = path.join(OUT_DIR, `${key}.png`);
    // La Chine garde ses vraies tuiles Media; ne générer que le manquant
    if (fs.existsSync(path.join(MEDIA_MINIMAP, `${key}.webp`))) { skipped++; continue; }
    if (!fs.existsSync(tilesPath)) { missing++; continue; }
    if (fs.existsSync(outPath)) { skipped++; continue; }

    const tiles = new Uint16Array(fs.readFileSync(tilesPath).buffer, fs.readFileSync(tilesPath).byteOffset, 96 * 96);
    // 1 pixel par tuile de terrain (20 u) → 96×96 RGB
    const filtered = Buffer.alloc(96 * (1 + 96 * 3));
    let o = 0;
    for (let y = 0; y < 96; y++) {
      filtered[o++] = 0; // filtre None
      for (let x = 0; x < 96; x++) {
        const texId = tiles[y * 96 + x];
        const [rr, gg, bb] = texId === 0xffff ? [18, 22, 30] : texColor(texId);
        filtered[o++] = rr; filtered[o++] = gg; filtered[o++] = bb;
      }
    }
    fs.writeFileSync(outPath, encodePngRgb(96, 96, filtered));
    generated++;
  }
  console.log(`Minimap: ${generated} tuiles générées, ${skipped} déjà couvertes (Media/existantes), ${missing} régions sans tilemap — ${Date.now() - t0} ms`);
  console.log(`Sortie: client/public/assets/terrain/minimap/<rx>x<rz>.png`);
}

main();
