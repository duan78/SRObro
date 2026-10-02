/**
 * SRObro — regen-equipment-glbs.ts (phase A V3: armures/armes visibles)
 *
 * Les BMS d'armures sont skinnés au rig du PORTEUR (chinaman_skel…) mais
 * leurs BSR ne référencent aucun squelette → les anciens GLB étaient
 * STATIQUES et leurs stems COLLaient entre catégories (un seul
 * heavy_02_ba.glb pour 4 variantes race/genre). Ce script:
 *   1. convertit chaque catégorie (jmx_converter, désormais capable de
 *      résoudre le squelette du porteur + le BMT de set pour les items);
 *   2. renomme avec un stem préfixé unique: ch_man_/ch_woman_/eu_man_/
 *      eu_woman_ (armures), ch_/eu_ (armes);
 *   3. applique AUX ARMURES le patch «joints étendus aux ancêtres» +
 *      «pose neutre» (clé 0 de chinaman/chinawoman_fighter_standcity) —
 *      même bind que les corps, sinon «bras en l'air» garanti;
 *   4. ajoute les entrées au manifest client (glbs + textures du set);
 *   5. bump le stamp anti-cache.
 *
 * Usage: npx tsx scripts/regen-equipment-glbs.ts [--skip-convert]
 */
import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');
const GLB_DIR = path.join(ROOT, 'client/public/assets/glb_blender');
const MANIFEST = path.join(ROOT, 'client/public/assets/manifest.json');
const STAGE = path.join(ROOT, '.tmp_eqstage');
const CONV = path.join(ROOT, 'tools/rust-jmx-converter/target/release/jmx_converter.exe');
const MESH_ROOT = path.join(ROOT, 'assets/pk2_data/prim/mesh/item');
const TEX_ROOT = path.join(ROOT, 'client/public/assets/textures/prim/mtrl/item');

const CATEGORIES: Array<{ key: string; src: string; prefix: string; skinned: 'man' | 'woman' | null }> = [
  { key: 'ch_man', src: 'china/man_item', prefix: 'ch_man_', skinned: 'man' },
  { key: 'ch_woman', src: 'china/woman_item', prefix: 'ch_woman_', skinned: 'woman' },
  { key: 'eu_man', src: 'europe/man_item', prefix: 'eu_man_', skinned: 'man' },
  { key: 'eu_woman', src: 'europe/woman_item', prefix: 'eu_woman_', skinned: 'woman' },
  { key: 'ch_weapon', src: 'china/weapon', prefix: 'ch_', skinned: null },
  { key: 'eu_weapon', src: 'europe/weapon', prefix: 'eu_', skinned: null },
];

// ---------- Math glTF (column-major, reprise de fix-glb-*.js) ----------
const mul = (a: number[], b: number[]): number[] => {
  const o = new Array(16).fill(0);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++)
    o[i * 4 + j] += a[k * 4 + j] * b[i * 4 + k];
  return o;
};
const IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const quatToMat = (x: number, y: number, z: number, w: number): number[] => {
  const m = new Array(16).fill(0);
  m[0] = 1 - 2 * (y * y + z * z); m[1] = 2 * (x * y + z * w); m[2] = 2 * (x * z - y * w);
  m[4] = 2 * (x * y - z * w); m[5] = 1 - 2 * (x * x + z * z); m[6] = 2 * (y * z + x * w);
  m[8] = 2 * (x * z + y * w); m[9] = 2 * (y * z - x * w); m[10] = 1 - 2 * (x * x + y * y);
  m[15] = 1;
  return m;
};
const rigidInv = (m: number[]): number[] => {
  const o = new Array(16).fill(0);
  o[0] = m[0]; o[4] = m[1]; o[8] = m[2];
  o[1] = m[4]; o[5] = m[5]; o[9] = m[6];
  o[2] = m[8]; o[6] = m[9]; o[10] = m[10];
  const t = [m[12], m[13], m[14]];
  o[12] = -(t[0] * o[0] + t[1] * o[4] + t[2] * o[8]);
  o[13] = -(t[0] * o[1] + t[1] * o[5] + t[2] * o[9]);
  o[14] = -(t[0] * o[2] + t[1] * o[6] + t[2] * o[10]);
  o[15] = 1;
  return o;
};
const compose = (q: number[], p: number[]): number[] => {
  const m = quatToMat(q[0], q[1], q[2], q[3]);
  m[12] = p[0]; m[13] = p[1]; m[14] = p[2];
  return m;
};

interface GlbParts { json: any; bin: Buffer }
function parseGlb(buf: Buffer): GlbParts {
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8').replace(/\0+$/, ''));
  const h = 20 + jsonLen;
  let bin = Buffer.alloc(0);
  if (buf.length > h + 8 && buf.readUInt32LE(h + 4) === 0x004e4942) {
    bin = buf.slice(h + 8, h + 8 + buf.readUInt32LE(h));
  }
  return { json, bin };
}
function writeGlb(json: any, bin: Buffer): Buffer {
  let jsonBytes = Buffer.from(JSON.stringify(json), 'utf8');
  const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
  if (jsonPad) jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc(jsonPad, 0x20)]);
  let binBytes = bin;
  const binPad = (4 - (binBytes.length % 4)) % 4;
  if (binPad) binBytes = Buffer.concat([binBytes, Buffer.alloc(binPad)]);
  const total = 12 + 8 + jsonBytes.length + 8 + binBytes.length;
  const out = Buffer.alloc(total);
  out.writeUInt32LE(0x46546c67, 0);
  out.writeUInt32LE(2, 4);
  out.writeUInt32LE(total, 8);
  out.writeUInt32LE(jsonBytes.length, 12);
  out.writeUInt32LE(0x4e4f534a, 16);
  jsonBytes.copy(out, 20);
  const off = 20 + jsonBytes.length;
  out.writeUInt32LE(binBytes.length, off);
  out.writeUInt32LE(0x004e4942, off + 4);
  binBytes.copy(out, off + 8);
  return out;
}

/** Patch armure: joints étendus aux ancêtres + pose neutre (clé 0 du clip). */
function patchArmorGlb(glbPath: string, clipPath: string): string {
  const { json, bin } = parseGlb(fs.readFileSync(glbPath));
  const skin = json.skins?.[0];
  if (!skin) return 'sans skin';
  const clip = JSON.parse(fs.readFileSync(clipPath, 'utf8'));
  const key0 = new Map<string, { q: number[]; p: number[] }>();
  for (const bc of clip.bones) {
    if (bc.rotations.length >= 4) {
      key0.set(bc.name, {
        q: bc.rotations.slice(0, 4),
        p: bc.positions && bc.positions.length >= 3 ? bc.positions.slice(0, 3) : [0, 0, 0],
      });
    }
  }
  const nodes = json.nodes;
  const parent = new Array(nodes.length).fill(-1);
  nodes.forEach((n: any, i: number) => (n.children || []).forEach((c: number) => { parent[c] = i; }));

  // 1) étendre les joints aux ancêtres (ordre ancien préservé → JOINTS_0 valides)
  const jointSet = new Set<number>(skin.joints);
  for (const j of [...skin.joints]) {
    let p = parent[j];
    while (p !== -1 && !jointSet.has(p)) { jointSet.add(p); p = parent[p]; }
  }
  skin.joints = [...jointSet];
  // racine commune = le premier ancêtre sans parent parmi les joints
  const root = skin.joints.find((j: number) => parent[j] === -1);
  if (root !== undefined) skin.skeleton = root;

  // 2) pose neutre: locals depuis clé 0 du clip (sinon local BSK), IBM = inv(world)
  const restLocal = nodes.map((n: any) => (n.matrix ? Array.from(n.matrix) : IDENT.slice()));
  const neutralLocal = nodes.map((n: any, i: number) => {
    const k = n.name ? key0.get(n.name) : undefined;
    return k ? compose(k.q, k.p) : restLocal[i];
  });
  const neutralWorld = new Array<number | null>(nodes.length).fill(null);
  const worldOf = (i: number): number[] => {
    if (neutralWorld[i]) return neutralWorld[i] as number[];
    const w = parent[i] === -1 ? neutralLocal[i] : mul(worldOf(parent[i]), neutralLocal[i]);
    neutralWorld[i] = w;
    return w;
  };
  nodes.forEach((n: any, i: number) => { if (n.name && /^Bip|^Spine/.test(n.name)) worldOf(i); });

  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i].name || nodes[i].name === 'mesh' || parent[i] === -1) {
      if (nodes[i].matrix && neutralLocal[i] !== restLocal[i]) nodes[i].matrix = neutralLocal[i];
      continue;
    }
    nodes[i].matrix = mul(rigidInv(worldOf(parent[i])), worldOf(i));
  }

  const ibmAcc = json.accessors[skin.inverseBindMatrices];
  const ibmBV = json.bufferViews[ibmAcc.bufferView];
  const nJoints = skin.joints.length;
  const newIbm = new Float32Array(nJoints * 16);
  for (let k = 0; k < nJoints; k++) {
    const invM = rigidInv(worldOf(skin.joints[k]));
    for (let e = 0; e < 16; e++) newIbm[k * 16 + e] = invM[e];
  }
  const ibmBytes = Buffer.from(newIbm.buffer, newIbm.byteOffset, newIbm.byteLength);
  const newBin = Buffer.concat([bin, ibmBytes]);
  ibmBV.byteOffset = bin.length;
  ibmBV.byteLength = ibmBytes.length;
  ibmAcc.count = nJoints;
  json.buffers[0].byteLength = newBin.length;
  fs.writeFileSync(glbPath, writeGlb(json, newBin));
  return `patché (${nJoints} joints, clip ${path.basename(clipPath)})`;
}

// ---------- Pipeline ----------
function main(): void {
  const skipConvert = process.argv.includes('--skip-convert');
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const resources = manifest.resources ?? (manifest.resources = {});

  const MAN_CLIP = path.join(ROOT, 'client/public/assets/anims/char/china/man/chinaman_fighter_standcity.json');
  const WOMAN_CLIP = path.join(ROOT, 'client/public/assets/anims/char/china/woman/chinawoman_fighter_standcity.json');

  if (!skipConvert) fs.rmSync(STAGE, { recursive: true, force: true });
  fs.mkdirSync(STAGE, { recursive: true });

  let added = 0, patched = 0, noSkin = 0, missingTex = 0;
  for (const cat of CATEGORIES) {
    const stageDir = path.join(STAGE, cat.key);
    if (!skipConvert) {
      execSync(`"${CONV}" -i "${path.join(MESH_ROOT, cat.src)}" -o "${stageDir}"`, { stdio: 'pipe' });
    }
    const texMapPath = path.join(stageDir, 'texture-map.json');
    const texMap: Record<string, string[]> = fs.existsSync(texMapPath)
      ? JSON.parse(fs.readFileSync(texMapPath, 'utf8')) : {};
    const mtrlDir = cat.src; // ex. china/man_item (identique sous mtrl/)

    for (const f of fs.readdirSync(stageDir)) {
      if (!f.endsWith('.glb')) continue;
      const origStem = f.replace(/\.glb$/, '');
      const newStem = cat.prefix + origStem;
      const src = path.join(stageDir, f);
      const dst = path.join(GLB_DIR, newStem + '.glb');

      // Patch pose neutre pour les armures (skinnées au rig du perso)
      if (cat.skinned) {
        try {
          const r = patchArmorGlb(src, cat.skinned === 'man' ? MAN_CLIP : WOMAN_CLIP);
          if (r === 'sans skin') noSkin++; else patched++;
        } catch (e) {
          console.warn(`  ⚠ patch ${newStem}: ${(e as Error).message}`);
        }
      }
      fs.copyFileSync(src, dst);

      // Manifest: textures résolues en PNG (mtrl de la catégorie). Pour les
      // armures, ne garder QUE la texture de la pièce (le BMT de set liste
      // les 6 pièces — la 1re serait celle d'une autre pièce).
      const ddjs = texMap[origStem.toLowerCase()] ?? [];
      const own = ddjs.filter((d: string) => d.replace(/\.ddj$/i, '') === origStem);
      const picked = own.length > 0 ? own : ddjs;
      const textures: string[] = [];
      for (const ddj of picked) {
        const png = `prim/mtrl/item/${mtrlDir}/${ddj.replace(/\.ddj$/i, '.png')}`;
        if (fs.existsSync(path.join(ROOT, 'client/public/assets/textures', png))) textures.push(png);
        else missingTex++;
      }
      resources[newStem] = {
        meshes: [`prim/mesh/item/${cat.src}/${origStem}.bms`],
        glbs: [`glb_blender/${newStem}.glb`],
        textures,
      };
      added++;
    }
    console.log(`  ${cat.key}: ${added} cumulés`);
  }

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest));
  fs.writeFileSync(path.join(ROOT, 'client/public/assets/version.txt'), String(Date.now()));
  console.log(`\nTerminé: ${added} GLB équipement (${patched} armures patchées pose neutre, ` +
    `${noSkin} sans skin, ${missingTex} textures non résolues) + manifest + stamp`);
}

main();
