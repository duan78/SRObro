/**
 * Patch des GLB skinned SRObro (glb_blender) — 2026-10
 *
 * Problème: l'exporteur ne déclare comme joints du skin QUE les os référencés
 * par les poids de la partie. Les os ancêtres intermédiaires (Bip01, Pelvis…)
 * restent des nodes non-joints. Le chargeur glTF de Babylon crée bien des
 * bones pour ces ancêtres, mais leur matrice de bind passe par la branche
 * `boneIndex === -1` de _updateBoneMatrices → leur transform propre est
 * PERDU (identité) → toute la chaîne compose faux → perso enterré/soulevé.
 *
 * Correctif (skin glTF standard):
 *   1. joints = ancien joints (ordre préservé, les indices JOINTS_0 des
 *      sommets restent valides) + tous les ancêtres manquants;
 *   2. inverseBindMatrices réécrites = inv(world(node)) pour chaque joint;
 *   3. skins[0].skeleton = racine commune de la hiérarchie (ex. Bip01).
 *
 * Validation: au repos, world(joint) × IBM doit être l'identité (≤ 0.01).
 * Usage: node scripts/fix-glb-skins.js [fichier.glb | dossier] [--dry]
 */
const fs = require('fs');
const path = require('path');

// --- Math glTF (tableaux column-major) ---
const mul = (a, b) => {
  const o = new Array(16).fill(0);
  for (let i = 0; i < 4; i++)
    for (let j = 0; j < 4; j++)
      for (let k = 0; k < 4; k++) o[i * 4 + j] += a[k * 4 + j] * b[i * 4 + k];
  return o;
};
const IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
const inv = (m) => {
  const a = m, o = new Array(16);
  o[0] = a[5] * a[10] * a[15] - a[5] * a[11] * a[14] - a[9] * a[6] * a[15] + a[9] * a[7] * a[14] + a[13] * a[6] * a[11] - a[13] * a[7] * a[10];
  o[4] = -a[4] * a[10] * a[15] + a[4] * a[11] * a[14] + a[8] * a[6] * a[15] - a[8] * a[7] * a[14] - a[12] * a[6] * a[11] + a[12] * a[7] * a[10];
  o[8] = a[4] * a[9] * a[15] - a[4] * a[11] * a[13] - a[8] * a[5] * a[15] + a[8] * a[7] * a[13] + a[12] * a[5] * a[11] - a[12] * a[7] * a[9];
  o[12] = -a[4] * a[9] * a[14] + a[4] * a[10] * a[13] + a[8] * a[5] * a[14] - a[8] * a[6] * a[13] - a[12] * a[5] * a[10] + a[12] * a[6] * a[9];
  o[1] = -a[1] * a[10] * a[15] + a[1] * a[11] * a[14] + a[9] * a[2] * a[15] - a[9] * a[3] * a[14] - a[13] * a[2] * a[11] + a[13] * a[3] * a[10];
  o[5] = a[0] * a[10] * a[15] - a[0] * a[11] * a[14] - a[8] * a[2] * a[15] + a[8] * a[3] * a[14] + a[12] * a[2] * a[11] - a[12] * a[3] * a[10];
  o[9] = -a[0] * a[9] * a[15] + a[0] * a[11] * a[13] + a[8] * a[1] * a[15] - a[8] * a[3] * a[13] - a[12] * a[1] * a[11] + a[12] * a[3] * a[9];
  o[13] = a[0] * a[9] * a[14] - a[0] * a[10] * a[13] - a[8] * a[1] * a[14] + a[8] * a[2] * a[13] + a[12] * a[1] * a[10] - a[12] * a[2] * a[9];
  o[2] = a[1] * a[6] * a[15] - a[1] * a[7] * a[14] - a[5] * a[2] * a[15] + a[5] * a[3] * a[14] + a[13] * a[2] * a[7] - a[13] * a[3] * a[6];
  o[6] = -a[0] * a[6] * a[15] + a[0] * a[7] * a[14] + a[4] * a[2] * a[15] - a[4] * a[3] * a[14] - a[12] * a[2] * a[7] + a[12] * a[3] * a[6];
  o[10] = a[0] * a[5] * a[15] - a[0] * a[7] * a[13] - a[4] * a[1] * a[15] + a[4] * a[3] * a[13] + a[12] * a[1] * a[7] - a[12] * a[3] * a[5];
  o[14] = -a[0] * a[5] * a[14] + a[0] * a[6] * a[13] + a[4] * a[1] * a[14] - a[4] * a[2] * a[13] - a[12] * a[1] * a[6] + a[12] * a[2] * a[5];
  o[3] = -a[1] * a[6] * a[11] + a[1] * a[7] * a[10] + a[5] * a[2] * a[11] - a[5] * a[3] * a[10] - a[9] * a[2] * a[7] + a[9] * a[3] * a[6];
  o[7] = a[0] * a[6] * a[11] - a[0] * a[7] * a[10] - a[4] * a[2] * a[11] + a[4] * a[3] * a[10] + a[8] * a[2] * a[7] - a[8] * a[3] * a[6];
  o[11] = -a[0] * a[5] * a[11] + a[0] * a[7] * a[9] + a[4] * a[1] * a[11] - a[4] * a[3] * a[9] - a[8] * a[1] * a[7] + a[8] * a[3] * a[5];
  o[15] = a[0] * a[5] * a[10] - a[0] * a[6] * a[9] - a[4] * a[1] * a[10] + a[4] * a[2] * a[9] + a[8] * a[1] * a[6] - a[8] * a[2] * a[5];
  const det = a[0] * o[0] + a[1] * o[4] + a[2] * o[8] + a[3] * o[12];
  if (Math.abs(det) < 1e-12) return null;
  for (let i = 0; i < 16; i++) o[i] /= det;
  return o;
};

function parseGlb(buf) {
  if (buf.readUInt32LE(0) !== 0x46546c67) throw new Error('magic GLB absent');
  const jsonLen = buf.readUInt32LE(12);
  const jsonType = buf.readUInt32LE(16);
  if (jsonType !== 0x4e4f534a) throw new Error('chunk 1 non JSON');
  // tolérer un padding NUL (bug d'une première passe du patch): la spec glTF
  // exige des ESPACES, JSON.parse rejette les \0
  const jsonRaw = buf.slice(20, 20 + jsonLen);
  const jsonText = jsonRaw.toString('utf8').replace(/\0+$/, '');
  const jsonHadNulPadding = jsonText.length !== jsonRaw.length;
  const json = JSON.parse(jsonText);
  let bin = null, binChunkHeader = 20 + jsonLen;
  if (buf.length > binChunkHeader + 8 && buf.readUInt32LE(binChunkHeader + 4) === 0x004e4942) {
    const binLen = buf.readUInt32LE(binChunkHeader);
    bin = buf.slice(binChunkHeader + 8, binChunkHeader + 8 + binLen);
  }
  return { json, bin, binChunkHeader, jsonHadNulPadding };
}

function writeGlb(json, bin) {
  let jsonBytes = Buffer.from(JSON.stringify(json), 'utf8');
  const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
  const jsonLenPadded = jsonBytes.length + jsonPad;
  // padding du chunk JSON avec des ESPACES (spec glTF) — jamais des \0
  if (jsonPad) jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc(jsonPad, 0x20)]);
  let binBytes = bin ?? Buffer.alloc(0);
  const binPad = (4 - (binBytes.length % 4)) % 4;
  const binLenPadded = binBytes.length + binPad;
  if (binPad) binBytes = Buffer.concat([binBytes, Buffer.alloc(binPad)]);
  const total = 12 + 8 + jsonLenPadded + 8 + binLenPadded;
  const out = Buffer.alloc(total);
  out.writeUInt32LE(0x46546c67, 0);
  out.writeUInt32LE(2, 4);
  out.writeUInt32LE(total, 8);
  out.writeUInt32LE(jsonLenPadded, 12);
  out.writeUInt32LE(0x4e4f534a, 16);
  jsonBytes.copy(out, 20);
  const binOff = 20 + jsonLenPadded;
  out.writeUInt32LE(binLenPadded, binOff);
  out.writeUInt32LE(0x004e4942, binOff + 4);
  binBytes.copy(out, binOff + 8);
  return out;
}

function patchGlb(filePath, dry) {
  const buf = fs.readFileSync(filePath);
  const { json, bin, binChunkHeader, jsonHadNulPadding } = parseGlb(buf);
  if (!bin) return { file: path.basename(filePath), status: 'pas de chunk BIN' };
  const skin = json.skins?.[0];
  if (!skin) return { file: path.basename(filePath), status: 'pas de skin' };

  const nodes = json.nodes;
  const parent = new Array(nodes.length).fill(-1);
  nodes.forEach((n, i) => (n.children || []).forEach((c) => (parent[c] = i)));

  // world de chaque node (composition column-major, cache)
  const worldCache = new Array(nodes.length);
  const worldOf = (i) => {
    if (worldCache[i]) return worldCache[i];
    const n = nodes[i];
    const local = n.matrix ? Array.from(n.matrix) : IDENT.slice();
    worldCache[i] = parent[i] === -1 ? local : mul(worldOf(parent[i]), local);
    return worldCache[i];
  };

  // 1) étendre les joints avec tous les ancêtres manquants (ordre stable)
  const oldJoints = skin.joints.slice();
  const jointSet = new Set(oldJoints);
  const added = [];
  for (const j of oldJoints) {
    let p = parent[j];
    while (p !== -1) {
      if (!jointSet.has(p)) { jointSet.add(p); added.push(p); }
      p = parent[p];
    }
  }
  const newJoints = oldJoints.concat(added);

  // 2) racine commune (ancêtre le plus profond commun à tous les joints)
  const chainOf = (i) => { const c = []; let n = i; while (n !== -1) { c.unshift(n); n = parent[n]; } return c; };
  let common = chainOf(newJoints[0]);
  for (const j of newJoints.slice(1)) {
    const ch = chainOf(j);
    let k = 0;
    while (k < common.length && k < ch.length && common[k] === ch[k]) k++;
    common = common.slice(0, k);
  }
  const rootNode = common.length > 0 ? common[common.length - 1] : newJoints[0];

  // 3) nouvelles IBM pour TOUS les joints
  const ibmAcc = json.accessors[skin.inverseBindMatrices];
  const ibmBV = json.bufferViews[ibmAcc.bufferView];
  const oldIbm = new Float32Array(bin.buffer, bin.byteOffset + (ibmBV.byteOffset || 0) + (ibmAcc.byteOffset || 0), oldJoints.length * 16);
  const newIbm = new Float32Array(newJoints.length * 16);
  for (let k = 0; k < newJoints.length; k++) {
    const w = worldOf(newJoints[k]);
    const iv = inv(w);
    if (!iv) return { file: path.basename(filePath), status: 'ERR: world non inversible (node ' + newJoints[k] + ')' };
    for (let e = 0; e < 16; e++) newIbm[k * 16 + e] = iv[e];
  }

  // Validation identité AVANT écriture (nouvelles données)
  let maxDev = 0;
  newJoints.forEach((j, k) => {
    const rest = mul(worldOf(j), Array.from(newIbm.slice(k * 16, k * 16 + 16)));
    maxDev = Math.max(maxDev, ...rest.map((v, i2) => Math.abs(v - IDENT[i2])));
  });
  if (maxDev > 0.01) return { file: path.basename(filePath), status: 'ERR: identité ' + maxDev.toFixed(4) };

  // Idempotence: déjà patché (joints complets + racine) → réécriture
  // uniquement si le padding JSON est corrompu (NUL) à réparer
  const alreadyPatched = added.length === 0 && skin.skeleton !== undefined;
  if (dry) return { file: path.basename(filePath), status: 'OK (dry)', joints: oldJoints.length + '→' + newJoints.length, root: nodes[rootNode]?.name };
  if (alreadyPatched) {
    if (!jsonHadNulPadding) return { file: path.basename(filePath), status: 'déjà patché' };
    // réparation du padding uniquement, sans toucher au buffer
    fs.writeFileSync(filePath, writeGlb(json, bin));
    return { file: path.basename(filePath), status: 'padding réparé' };
  }

  // 4) réécriture: IBM appended au buffer, joints étendus, skeleton = racine
  const ibmBytes = Buffer.from(newIbm.buffer, newIbm.byteOffset, newIbm.byteLength);
  const alignedOldLen = bin.length; // le chunk BIN est déjà aligné 4 par writeGlb
  const newBin = Buffer.concat([bin, ibmBytes]);
  ibmBV.byteOffset = alignedOldLen;
  ibmBV.byteLength = ibmBytes.length;
  ibmAcc.count = newJoints.length;
  json.buffers[0].byteLength = newBin.length;
  skin.joints = newJoints;
  skin.skeleton = rootNode;

  const out = writeGlb(json, newBin);
  fs.writeFileSync(filePath, out);
  return { file: path.basename(filePath), status: 'patché', joints: oldJoints.length + '→' + newJoints.length, root: nodes[rootNode]?.name, added: added.length };
}

// --- CLI ---
const args = process.argv.slice(2);
const dry = args.includes('--dry');
const targets = args.filter((a) => !a.startsWith('--'));
let files = [];
for (const t of targets.length ? targets : ['client/public/assets/glb_blender']) {
  const st = fs.statSync(t);
  if (st.isDirectory()) files = files.concat(fs.readdirSync(t).filter((f) => f.endsWith('.glb')).map((f) => path.join(t, f)));
  else files.push(t);
}
let ok = 0, skipped = 0, errors = 0;
for (const f of files) {
  try {
    const r = patchGlb(f, dry);
    if (r.status?.startsWith('ERR')) { errors++; console.log('✗', r.file, r.status); }
    else if (r.status === 'patché' || r.status?.startsWith('OK')) { ok++; if (r.joints) console.log('✓', r.file, r.status, r.joints, 'racine:', r.root); }
    else skipped++;
  } catch (e) { errors++; console.log('✗', f, e.message); }
}
console.log(`\n${dry ? '[DRY] ' : ''}${files.length} fichiers: ${ok} patchés/validés, ${skipped} sans skin, ${errors} erreurs`);

// Bump du stamp anti-cache (les URLs d'assets changent → plus de GLB périmés)
require('fs').writeFileSync('client/public/assets/version.txt', String(Date.now()));
