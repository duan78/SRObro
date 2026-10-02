/**
 * Bind correct des GLB skinnés depuis la T-pose BSK — 2026-10
 * (fix "bras en l'air / T-pose au rendu malgré des os corrects")
 *
 * Fait historique (mesuré): les maillages BMS sont modélisés dans la pose de
 * BIND du BSK — une T-pose (man_arm_upper: vertices X ±5, Y ~14.5 constant,
 * hauteur d'épaule) — et les ABSOLUES du BSK collent 1:1 aux ancres du
 * maillage dans le repère GLB (L UpperArm (1.49, 14.87), L Hand (6.96,
 * 14.93), pelvis 9.87, foot 1.26; quaternions xyzw, os pointant +X,
 * convention Bip01/3ds Max). L'ancienne lecture "BSK éparpillé (main Y=89)"
 * était un artefact d'ordre de matrices.
 *
 * Les patches "pose neutre" précédents avaient posé locals = clé 0 du clip
 * et IBM = inv(neutralWorld): au repos le skinning était identité → c'est le
 * MAILLAGE BRUT (T-pose) qui s'affichait, et l'idle (≈ neutre) ne le
 * pliait presque pas. D'où le perso bras en l'air alors que les os CPU
 * étaient bien bras baissés.
 *
 * Correctif: pour chaque node os, local = inv(world BSK parent) × world BSK,
 * et IBM(joint) = inv(world BSK). Au repos le rendu = maillage brut = T-pose
 * (standard glTF), et chaque clip BAN (locaux) retargete la T-pose vers sa
 * pose (idle = bras baissés).
 *
 * Usage: node scripts/fix-glb-tpose-bind.js [--dry] [--selftest]
 */
const fs = require('fs');
const path = require('path');

// ---------- math (colonne-major, mêmes conventions que les autres scripts) ----------
const mul = (a, b) => {
  const o = new Array(16).fill(0);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++)
    o[i * 4 + j] += a[k * 4 + j] * b[i * 4 + k];
  return o;
};
const IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const quatToMat = (x, y, z, w) => {
  const m = new Array(16).fill(0);
  m[0] = 1 - 2 * (y * y + z * z); m[1] = 2 * (x * y + z * w); m[2] = 2 * (x * z - y * w);
  m[4] = 2 * (x * y - z * w); m[5] = 1 - 2 * (x * x + z * z); m[6] = 2 * (y * z + x * w);
  m[8] = 2 * (x * z + y * w); m[9] = 2 * (y * z - x * w); m[10] = 1 - 2 * (x * x + y * y);
  m[15] = 1;
  return m;
};
const rigidInv = (m) => {
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
const compose = (q, p) => {
  const m = quatToMat(q[0], q[1], q[2], q[3]);
  m[12] = p[0]; m[13] = p[1]; m[14] = p[2];
  return m;
};
const applyV = (m, v) => [
  m[0] * v[0] + m[4] * v[1] + m[8] * v[2] + m[12],
  m[1] * v[0] + m[5] * v[1] + m[9] * v[2] + m[13],
  m[2] * v[0] + m[6] * v[1] + m[10] * v[2] + m[14],
];

// ---------- BSK ----------
function parseBsk(file) {
  const f = fs.openSync(file, 'r');
  try {
    const head = Buffer.alloc(16);
    fs.readSync(f, head, 0, 16, 0);
    if (head.toString('utf8', 0, 7) !== 'JMXVBSK') return null;
    let pos = 12; // 7 sig + 5 skip
    const rd = (n) => { const b = Buffer.alloc(n); fs.readSync(f, b, 0, n, pos); pos += n; return b; };
    const rInt = () => rd(4).readInt32LE(0);
    const rStr = () => { const n = rInt(); return n > 0 ? rd(n).toString('latin1') : ''; };
    const count = rInt();
    const bones = new Map();
    for (let i = 0; i < count; i++) {
      rd(1);
      const name = rStr(); const parent = rStr();
      rd(28);
      const rotB = rd(16); const posB = rd(12);
      const quat = [rotB.readFloatLE(0), rotB.readFloatLE(4), rotB.readFloatLE(8), rotB.readFloatLE(12)];
      const p = [posB.readFloatLE(0), posB.readFloatLE(4), posB.readFloatLE(8)];
      rd(28);
      const cc = rInt();
      for (let c = 0; c < cc; c++) rStr();
      bones.set(name, { parent, quat, pos: p });
    }
    return bones;
  } catch (e) {
    return null;
  } finally {
    fs.closeSync(f);
  }
}

// registre de tous les BSK
const PK2 = 'assets/pk2_data/prim';
const registry = [];
{
  const walk = (dir) => {
    let entries;
    try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }
    for (const e of entries) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name.toLowerCase().endsWith('.bsk')) {
        const bones = parseBsk(p);
        if (bones && bones.size > 0) registry.push({ file: p, stem: e.name.replace(/\.bsk$/i, ''), bones });
      }
    }
  };
  walk(PK2);
}

// squelettes humanoids par convention de nommage (proportions distinctes)
const CHAR = 'assets/pk2_data/prim/skel/char';
const HUMANOID = [
  [/^(man_|chinaman_(?!hwan))/, path.join(CHAR, 'china', 'chinaman_skel.bsk')],
  [/^(woman_|chinawoman_(?!hwan))/, path.join(CHAR, 'china', 'chinawoman_skel.bsk')],
  [/^europeman/, path.join(CHAR, 'europe', 'europeman_skel.bsk')],
  [/^europewoman/, path.join(CHAR, 'europe', 'europewoman_skel.bsk')],
];
const byFile = new Map(registry.map(r => [r.file, r]));

function resolveBsk(stem, boneNames) {
  // 1) BSK homonyme exact, puis stems élagués (mangnyang_part2 → mangnyang)
  let s = stem;
  for (let i = 0; i < 4 && s; i++) {
    const lower = s.toLowerCase();
    const exact = registry.find(r => r.stem.toLowerCase() === lower);
    if (exact) return exact;
    const idx = s.lastIndexOf('_');
    if (idx <= 0) break;
    s = s.slice(0, idx);
  }
  // 2) familles humanaines
  for (const [re, file] of HUMANOID) if (re.test(stem)) {
    const hit = byFile.get(file);
    if (hit) return hit;
  }
  // 3) BSK le plus petit dont l'ensemble d'os contient tous les nodes
  const cands = registry.filter(r => boneNames.every(n => r.bones.has(n)));
  if (!cands.length) return null;
  cands.sort((a, b) => a.bones.size - b.bones.size);
  if (cands.length > 1 && cands[1].bones.size === cands[0].bones.size) return { ...cands[0], ambiguous: cands[1].file };
  return cands[0];
}

// ---------- GLB ----------
function parseGlb(buf) {
  const jsonLen = buf.readUInt32LE(12);
  const jsonRaw = buf.slice(20, 20 + jsonLen);
  const json = JSON.parse(jsonRaw.toString('utf8').replace(/\0+$/, ''));
  let bin = null;
  const h = 20 + jsonLen;
  if (buf.length > h + 8 && buf.readUInt32LE(h + 4) === 0x004e4942) {
    bin = buf.slice(h + 8, h + 8 + buf.readUInt32LE(h));
  }
  return { json, bin };
}

function writeGlb(json, bin) {
  let jsonBytes = Buffer.from(JSON.stringify(json), 'utf8');
  const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
  if (jsonPad) jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc(jsonPad, 0x20)]);
  let binBytes = bin ?? Buffer.alloc(0);
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

/** Patch un GLB: locals + IBM depuis les absolues BSK (vraie T-pose). */
function patchTpose(glbPath, bsk, dry) {
  const buf = fs.readFileSync(glbPath);
  const { json, bin } = parseGlb(buf);
  const skin = json.skins?.[0];
  if (!skin || !bin) return { status: 'pas-de-skin' };
  const nodes = json.nodes;
  const parent = new Array(nodes.length).fill(-1);
  nodes.forEach((n, i) => (n.children || []).forEach(c => { parent[c] = i; }));

  const joints = skin.joints;
  const boneNames = joints.map(j => nodes[j].name).filter(Boolean);
  const matched = boneNames.filter(n => bsk.bones.has(n)).length;
  if (matched === 0) return { status: 'aucun-os-BSK' };
  if (matched < joints.length) return { status: `partiel:${matched}/${joints.length}` };

  // Os dégénérés du BSK (abs ≈ identité, ex. Spine_Base du rig chinois):
  // dans l'arbre GLB ils vivent sous leur parent avec un local correct —
  // leur bind = bind(parent) × local actuel, et on ne touche pas leur local.
  const isDegenerate = (b) =>
    b.pos.every(v => Math.abs(v) < 1e-4) &&
    Math.abs(b.quat[3] - 1) < 1e-4 && b.quat.slice(0, 3).every(v => Math.abs(v) < 1e-4);
  const restLocal = nodes.map(n => (n.matrix ? Array.from(n.matrix) : IDENT.slice()));

  // monde bind par node (récursif, parents d'abord)
  const bind = new Array(nodes.length).fill(null);
  const bindOf = (i) => {
    if (bind[i]) return bind[i];
    const b = nodes[i].name ? bsk.bones.get(nodes[i].name) : undefined;
    if (b && !isDegenerate(b)) {
      bind[i] = compose(b.quat, b.pos); // absolue BSK = T-pose
    } else {
      bind[i] = parent[i] >= 0 ? mul(bindOf(parent[i]), restLocal[i]) : restLocal[i];
    }
    return bind[i];
  };
  joints.forEach(bindOf);

  // nouveaux locaux: inv(bind parent) × bind — pour TOUS les joints d'abord
  const newLocal = new Array(nodes.length).fill(null);
  for (const j of joints) {
    const b = nodes[j].name ? bsk.bones.get(nodes[j].name) : undefined;
    newLocal[j] = (b && !isDegenerate(b))
      ? mul(rigidInv(parent[j] >= 0 ? bindOf(parent[j]) : IDENT), bind[j])
      : restLocal[j];
  }
  // validation (APRÈS affectation complète): recomposer le monde depuis les
  // nouveaux locaux doit redonner le bind (repos = identité)
  let maxDev = 0;
  const composed = new Array(nodes.length).fill(null);
  const compOf = (i) => {
    if (composed[i]) return composed[i];
    composed[i] = parent[i] >= 0 ? mul(compOf(parent[i]), newLocal[i] ?? restLocal[i]) : (newLocal[i] ?? restLocal[i]);
    return composed[i];
  };
  for (const j of joints) {
    const w = compOf(j);
    maxDev = Math.max(maxDev, ...w.map((v, i) => Math.abs(v - bind[j][i])));
  }
  if (maxDev > 0.01) return { status: `hiérarchie-incohérente:${maxDev.toFixed(3)}` };

  if (dry) return { status: 'OK-dry', joints: joints.length };

  for (const j of joints) nodes[j].matrix = newLocal[j];

  // IBM = inv(bind) par joint, ajoutés en fin de buffer
  const nJ = joints.length;
  const newIbm = new Float32Array(nJ * 16);
  for (let k = 0; k < nJ; k++) {
    const inv = rigidInv(bind[joints[k]]);
    for (let e = 0; e < 16; e++) newIbm[k * 16 + e] = inv[e];
  }
  const ibmAcc = json.accessors[skin.inverseBindMatrices];
  const ibmBV = json.bufferViews[ibmAcc.bufferView];
  const ibmBytes = Buffer.from(newIbm.buffer, newIbm.byteOffset, newIbm.byteLength);
  const newBin = Buffer.concat([bin, ibmBytes]);
  ibmBV.byteOffset = bin.length;
  ibmBV.byteLength = ibmBytes.length;
  ibmAcc.count = nJ;
  json.buffers[0].byteLength = newBin.length;

  fs.writeFileSync(glbPath, writeGlb(json, newBin));
  return { status: 'patché', joints: nJ };
}

// ---------- auto-test géométrique: idle → bras baissés ----------
function selftest() {
  const glb = 'client/public/assets/glb_blender/man_arm_upper.glb';
  const bskFile = path.join(CHAR, 'china', path.join('chinaman_skel.bsk'));
  const bsk = byFile.get(bskFile);
  const { json, bin } = parseGlb(fs.readFileSync(glb));
  const prim = json.meshes[0].primitives[0];
  const rdAcc = (idx, n, size) => {
    const acc = json.accessors[idx];
    const bv = json.bufferViews[acc.bufferView];
    const off = (bv.byteOffset || 0) + (acc.byteOffset || 0);
    const out = [];
    const isFloat = acc.componentType === 5126;
    const bpe = isFloat ? 4 : (acc.componentType === 5123 ? 2 : 1);
    for (let i = 0; i < n; i++) {
      const row = [];
      for (let e = 0; e < size; e++) {
        const o = off + (i * size + e) * bpe;
        row.push(isFloat ? bin.readFloatLE(o) : (bpe === 2 ? bin.readUInt16LE(o) : bin.readUInt8(o)));
      }
      out.push(row);
    }
    return out;
  };
  const P = rdAcc(prim.attributes.POSITION, json.accessors[prim.attributes.POSITION].count, 3);
  const J = rdAcc(prim.attributes.JOINTS_0, P.length, 4).map(r => r.map(Math.round));
  const W = rdAcc(prim.attributes.WEIGHTS_0, P.length, 4);
  const skin = json.skins[0];

  // parent gltf
  const parent = new Array(json.nodes.length).fill(-1);
  json.nodes.forEach((n, i) => (n.children || []).forEach(c => { parent[c] = i; }));

  // monde bind (T-pose) par joint — même règle que patchTpose:
  // absolue BSK pour les os réels, bind parent × local pour les dégénérés
  const isDegen = (b) =>
    b.pos.every(v => Math.abs(v) < 1e-4) &&
    Math.abs(b.quat[3] - 1) < 1e-4 && b.quat.slice(0, 3).every(v => Math.abs(v) < 1e-4);
  const restL = json.nodes.map(n => (n.matrix ? Array.from(n.matrix) : IDENT.slice()));
  const bindArr = new Array(json.nodes.length).fill(null);
  const bindOfS = (i) => {
    if (bindArr[i]) return bindArr[i];
    const b = json.nodes[i].name ? bsk.bones.get(json.nodes[i].name) : undefined;
    if (b && !isDegen(b)) bindArr[i] = compose(b.quat, b.pos);
    else bindArr[i] = parent[i] >= 0 ? mul(bindOfS(parent[i]), restL[i]) : restL[i];
    return bindArr[i];
  };
  skin.joints.forEach(bindOfS);
  const bindW = skin.joints.map(j => bindArr[j]);
  // monde animé (idle clé 0) par joint: composer les locaux du clip
  const clip = JSON.parse(fs.readFileSync('client/public/assets/anims/char/china/man/chinaman_fighter_standcity.json', 'utf8'));
  const key0 = new Map();
  for (const bc of clip.bones) if (bc.rotations.length >= 4)
    key0.set(bc.name, { q: bc.rotations.slice(0, 4), p: bc.positions?.slice(0, 3) ?? [0, 0, 0] });
  const animWorld = new Array(json.nodes.length).fill(null);
  const restLocal = json.nodes.map(n => (n.matrix ? Array.from(n.matrix) : IDENT.slice()));
  const worldOf = (i) => {
    if (animWorld[i]) return animWorld[i];
    const nm = json.nodes[i].name;
    // os du clip: local clé 0; les autres gardent leur local actuel (Babylon)
    const local = (nm && key0.has(nm))
      ? compose(key0.get(nm).q, key0.get(nm).p)
      : restLocal[i];
    if (nm === undefined && !json.nodes[i].name) return IDENT;
    animWorld[i] = parent[i] >= 0 ? mul(worldOf(parent[i]), local) : local;
    return animWorld[i];
  };
  skin.joints.forEach(worldOf);
  // skinner
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  for (let v = 0; v < P.length; v++) {
    let x = 0, y = 0, z = 0, tw = 0;
    for (let s2 = 0; s2 < 4; s2++) {
      const w = W[v][s2];
      if (w < 1e-4) continue;
      const ji = J[v][s2];
      const m = mul(animWorld[skin.joints[ji]], rigidInv(bindW[ji]));
      const p2 = applyV(m, P[v]);
      x += p2[0] * w; y += p2[1] * w; z += p2[2] * w; tw += w;
    }
    x /= tw; y /= tw;
    minX = Math.min(minX, x); maxX = Math.max(maxX, x);
    minY = Math.min(minY, y); maxY = Math.max(maxY, y);
  }
  console.log(`[selftest] bras skinnés en idle: X ${minX.toFixed(2)}..${maxX.toFixed(2)} (largeur ${(maxX - minX).toFixed(2)}) Y ${minY.toFixed(2)}..${maxY.toFixed(2)}`);
  console.log(`[selftest] brut T-pose: X ±5.01 (largeur 10), Y 13.8..15.5 — attendu bras baissés: largeur ~5.4 (deux bras), Y descendant sous 12.5`);
  // le maillage contient les DEUX bras: repliés = largeur ~5.4 et le bas descend
  // sous l'épaule (T-pose: tout entre 13.8 et 15.5)
  const ok = (maxX - minX) < 6.8 && minY < 12.5 && maxY > 14;
  console.log(ok ? '[selftest] OK — le clip idle replie bien les bras vers le bas' : '[selftest] ÉCHEC — bras encore écartés');
  return ok;
}

// ---------- CLI ----------
const dry = process.argv.includes('--dry');
if (process.argv.includes('--selftest')) {
  process.exit(selftest() ? 0 : 1);
}

const GLB_DIR = 'client/public/assets/glb_blender';
const stats = { patchés: 0, 'pas-de-skin': 0, skip: 0 };
const skipped = [];
const ambiguous = [];
for (const f of fs.readdirSync(GLB_DIR)) {
  if (!f.endsWith('.glb')) continue;
  const p = path.join(GLB_DIR, f);
  let buf;
  try { buf = fs.readFileSync(p); } catch { continue; }
  let json;
  try { json = JSON.parse(buf.slice(20, 20 + buf.readUInt32LE(12)).toString('utf8').replace(/\0+$/, '')); } catch { continue; }
  if (!json.skins?.length) { stats['pas-de-skin']++; continue; }
  const stem = f.replace(/\.glb$/, '');
  const boneNames = json.skins[0].joints.map(j => json.nodes[j].name).filter(Boolean);
  const bsk = resolveBsk(stem, boneNames);
  if (!bsk) { stats.skip++; skipped.push(`${f} (aucun BSK)`); continue; }
  if (bsk.ambiguous) ambiguous.push(`${f}: ${bsk.file} ~ ${bsk.ambiguous}`);
  const r = patchTpose(p, bsk, dry);
  stats[r.status.split(':')[0]] = (stats[r.status.split(':')[0]] || 0) + 1;
  if (r.status.startsWith('partiel') || r.status.startsWith('hiérarchie')) skipped.push(`${f}: ${r.status}`);
}
console.log(JSON.stringify(stats, null, 1));
if (skipped.length) console.log('ignorés:\n  ' + skipped.slice(0, 30).join('\n  '));
if (ambiguous.length) console.log('ambigus (plus petit BSK choisi):\n  ' + ambiguous.slice(0, 10).join('\n  '));
if (!dry) {
  fs.writeFileSync('client/public/assets/version.txt', String(Date.now()));
  console.log('version.txt bumpé');
}
