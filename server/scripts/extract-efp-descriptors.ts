/**
 * SRObro — extract-efp-descriptors.ts (phase B V3: VFX officiels)
 *
 * Les .efp de Particles.pk2 (JMXVEFF 0011) sont des listes de blocs
 * propriétés: [u32 len][nom ASCII][blob de valeurs à typage implicite]
 * (NormalTimeLife, StaticEmit, LinkMode, DiffuseGraph, ScaleGraph, Program…).
 * Ce script extrait pour chaque efp de skill un DESCRITEUR visuel exploitable
 * côté client (Babylon) sans rejeu exact du moteur SRO:
 *   { life, emitRate, colors[], scales[], gravity?, textures[] }
 * Les textures viennent de l'index existant (efp-textures.json) déjà converti
 * en PNG (client/public/assets/textures/particles/).
 *
 * Sortie: client/public/assets/efp-descriptors.json — { "<efp key>": {...} }
 * Usage: npx tsx scripts/extract-efp-descriptors.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');
const PK2 = path.join(ROOT, 'assets/pk2_particles');
const OUT = path.join(ROOT, 'client/public/assets/efp-descriptors.json');

/** Découpe les blocs [len][nom][blob] d'un buffer efp. */
function parseBlocks(b: Buffer): Array<{ name: string; blob: Buffer }> {
  const blocks: Array<{ name: string; blob: Buffer }> = [];
  let i = 16; // magic JMXVEFF 0011 + u32
  const isName = (off: number): string | null => {
    if (off + 4 > b.length) return null;
    const len = b.readUInt32LE(off);
    if (len < 2 || len > 64 || off + 4 + len > b.length) return null;
    const s = b.toString('latin1', off + 4, off + 4 + len);
    return /^[A-Za-z][A-Za-z0-9_\- ]*$/.test(s) ? s : null;
  };
  // premier bloc: nom d'émetteur
  const emitter = isName(i);
  if (emitter) i += 4 + emitter.length;
  while (i + 4 < b.length) {
    const name = isName(i);
    if (!name) { i += 1; continue; }
    const start = i + 4 + name.length;
    // borne du blob: le prochain nom plausible (au moins 4 octets plus loin)
    let end = start;
    for (let j = start; j < Math.min(b.length - 4, start + 4096); j++) {
      if (j >= start + 4 && isName(j)) { end = j; break; }
    }
    if (end === start) end = b.length;
    blocks.push({ name, blob: b.subarray(start, end) });
    i = end;
  }
  return blocks;
}

/** Float plausibles (évite les denormals issus d'entiers mal alignés). */
const plaus = (v: number): boolean => Number.isFinite(v) && Math.abs(v) > 1e-4 && Math.abs(v) < 1e4;

/** Floats plausibles d'un blob (les deux alignements 0/2 pour les graphes). */
const floatsOf = (blob: Buffer, alignments: number[] = [0]): number[][] => {
  return alignments.map((align) => {
    const out: number[] = [];
    for (let o = align; o + 4 <= blob.length; o += 4) {
      const v = blob.readFloatLE(o);
      if (plaus(v)) out.push(v);
    }
    return out;
  });
};

/** Quadruplets RGBA plausibles (0..1, non noirs) — meilleure variante. */
const rgbaQuads = (blob: Buffer): number[][] => {
  const best: number[][] = [];
  for (const align of [0, 2, 4]) {
    const cols: number[][] = [];
    for (let o = align; o + 16 <= blob.length; o += 16) {
      const q = [0, 1, 2, 3].map((k) => blob.readFloatLE(o + k * 4));
      const [r, g, b, a] = q;
      if (r >= 0 && r <= 1 && g >= 0 && g <= 1 && b >= 0 && b <= 1 && a >= 0 && a <= 1
        && r + g + b > 0.02) cols.push(q);
    }
    if (cols.length > best.length) best.splice(0, best.length, ...cols);
  }
  return best;
};

function descriptorFor(file: string): Record<string, unknown> | null {
  const b = fs.readFileSync(file);
  if (b.length < 32 || b.toString('latin1', 0, 7) !== 'JMXVEFF') return null;
  const blocks = parseBlocks(b);
  const d: Record<string, unknown> = {};
  for (const { name, blob } of blocks) {
    if (name === 'NormalTimeLife') {
      // La vie est un ENTIER (1/10 s): «10» dans le hex = 1,0 s
      if (blob.length >= 4) {
        const u = blob.readUInt32LE(0);
        if (u > 0 && u < 36000) d.life = Math.round((u / 10) * 100) / 100;
      }
    } else if (name === 'StaticEmit') {
      const f = floatsOf(blob, [0, 4])[0];
      const rate = f.filter((v) => v > 0.5 && v < 10000).slice(-1)[0];
      if (rate) d.emit = Math.round(rate);
    } else if (name === 'Gravity') {
      const f = floatsOf(blob, [0, 4])[0];
      if (f.length) d.gravity = Math.round(f[0] * 100) / 100;
    } else if (name === 'DiffuseGraph') {
      const cols = rgbaQuads(blob);
      if (cols.length) d.colors = [cols[0], cols[cols.length - 1]];
    } else if (name === 'ScaleGraph') {
      const f = floatsOf(blob, [0, 4])[0].filter((v) => v > 0.01 && v < 500);
      if (f.length) {
        d.scales = [Math.min(...f), Math.max(...f)].map((v) => Math.round(v * 100) / 100);
      }
    } else if (name === 'Program' && blob.length >= 8) {
      const len = blob.readUInt32LE(0);
      if (len > 0 && len <= 64 && 4 + len <= blob.length) {
        const prog = blob.toString('latin1', 4, 4 + len);
        if (/add|alpha|alphaadd/i.test(prog)) d.blend = /add/i.test(prog) ? 1 : 0;
      }
    } else if (name === 'EmitShape') {
      const f = floatsOf(blob, [0, 4])[0];
      if (f.length >= 3) d.emitShape = f.slice(0, 3).map((v) => Math.round(v * 10) / 10);
    } else if (name === 'Velocity') {
      const f = floatsOf(blob, [0, 4])[0];
      if (f.length >= 3) d.velocity = f.slice(0, 3).map((v) => Math.round(v * 10) / 10);
    }
  }
  return Object.keys(d).length ? d : null;
}

function main(): void {
  const texIndex: Record<string, string[]> = JSON.parse(
    fs.readFileSync(path.join(PK2, 'efp-textures.json'), 'utf8'),
  );
  const texDir = path.join(ROOT, 'client/public/assets/textures/particles');
  const available = new Set(fs.readdirSync(texDir).map((f) => f.replace(/\.png$/i, '').toLowerCase()));

  const descriptors: Record<string, Record<string, unknown>> = {};
  let count = 0;
  const walk = (dir: string, rel: string) => {
    for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, f.name);
      if (f.isDirectory()) walk(p, rel ? rel + '/' + f.name : f.name);
      else if (f.name.endsWith('.efp')) {
        const key = rel ? rel + '/' + f.name.replace(/\.efp$/i, '') : f.name.replace(/\.efp$/i, '');
        try {
          const d = descriptorFor(p);
          if (!d) continue;
          // textures officielles de l'effet, réellement converties en PNG
          const ddjs = texIndex[key] ?? [];
          const pngs = ddjs
            .map((x: string) => x.replace(/\.ddj$/i, '').toLowerCase())
            .filter((x: string) => available.has(x));
          if (pngs.length) d.textures = pngs;
          descriptors[key] = d;
          count++;
        } catch { /* efp illisible: ignoré */ }
      }
    }
  };
  walk(path.join(PK2, 'skill'), 'skill');
  walk(path.join(PK2, 'hiteffect'), 'hiteffect');

  fs.writeFileSync(OUT, JSON.stringify(descriptors));
  const withTex = Object.values(descriptors).filter((d) => Array.isArray(d.textures) && (d.textures as string[]).length > 0).length;
  console.log(`${count} descripteurs efp → ${OUT.name} (${withTex} avec textures officielles)`);
}

main();
