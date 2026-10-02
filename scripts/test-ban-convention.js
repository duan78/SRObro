/**
 * Expérience décisive: quelle est la convention des clips BAN ?
 * Simule le skinning complet (boneWorld × IBM × sommets) d'une partie GLB
 * avec plusieurs conventions d'application de la clé 0 du clip:
 *   A) clip = LOCAUX hiérarchiques (application directe)
 *   B) clip = ABSOLUS → local = inv(absParent) × abs
 *   C) clip = ABSOLUS appliqués en lieu et place des locaux (ancien code)
 * La bbox la plus proche de la pose de bind (humanéoïde ~15-20 u) gagne.
 */
const fs = require('fs');

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
  // rotation transposée (column-major: [i*4+j] ↔ [j*4+i])
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

// --- chargement GLB ---
function loadGlb(file) {
  const buf = fs.readFileSync(file);
  const jsonLen = buf.readUInt32LE(12);
  const json = JSON.parse(buf.slice(20, 20 + jsonLen).toString('utf8'));
  const bin = buf.slice(20 + jsonLen + 8);
  return { json, bin };
}

// --- expérience ---
const GLB = process.argv[2] ?? 'client/public/assets/glb_blender/man_torso_upper.glb';
const CLIP = process.argv[3] ?? 'client/public/assets/anims/char/china/man/chinaman_fighter_standcity.json';
const { json, bin } = loadGlb(GLB);
const clip = JSON.parse(fs.readFileSync(CLIP, 'utf8'));
const clipByName = new Map(clip.bones.map(b => [b.name, b]));

const nodes = json.nodes;
const parent = new Array(nodes.length).fill(-1);
nodes.forEach((n, i) => (n.children || []).forEach(c => { parent[c] = i; }));

// rest local par node
const restLocal = nodes.map(n => n.matrix ? Array.from(n.matrix) : IDENT.slice());
// world de repos
const restWorld = new Array(nodes.length);
const worldOf = (i) => {
  if (restWorld[i]) return restWorld[i];
  restWorld[i] = parent[i] === -1 ? restLocal[i] : mul(worldOf(parent[i]), restLocal[i]);
  return restWorld[i];
};

// skin
const skin = json.skins[0];
const ibmAcc = json.accessors[skin.inverseBindMatrices];
const ibmBV = json.bufferViews[ibmAcc.bufferView];
const ibm = new Float32Array(bin.buffer, bin.byteOffset + (ibmBV.byteOffset || 0), ibmAcc.count * 16);

// vertex data (POSITION + JOINTS_0 + WEIGHTS_0)
const prim = json.meshes[0].primitives[0];
const readAccessor = (acc, Type) => {
  const a = json.accessors[acc];
  const bv = json.bufferViews[a.bufferView];
  return new Type(bin.buffer, bin.byteOffset + (bv.byteOffset || 0) + (a.byteOffset || 0), a.count * (a.type === 'VEC3' ? 3 : a.type === 'VEC4' ? 4 : 1));
};
const positions = readAccessor(prim.attributes.POSITION, Float32Array);
const joints = readAccessor(prim.attributes.JOINTS_0, Uint16Array);
const weights = readAccessor(prim.attributes.WEIGHTS_0, Float32Array);
const nVerts = positions.length / 3;

// appliquer une convention: clipLocal(nodeIndex) -> matrice locale animée
function skinnedBbox(localOverride) {
  // recomposer les worlds avec les locaux animés
  const animWorld = new Array(nodes.length);
  const animWorldOf = (i) => {
    if (animWorld[i]) return animWorld[i];
    const local = localOverride.get(i) ?? restLocal[i];
    animWorld[i] = parent[i] === -1 ? local : mul(animWorldOf(parent[i]), local);
    return animWorld[i];
  };
  // index joint Babylon-like: joints dans l'ordre du skin
  let minY = Infinity, maxY = -Infinity, minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (let v = 0; v < nVerts; v++) {
    let px = 0, py = 0, pz = 0;
    for (let wi = 0; wi < 4; wi++) {
      const w = weights[v * 4 + wi];
      if (w === 0) continue;
      const jointNode = skin.joints[joints[v * 4 + wi]];
      const boneM = mul(animWorldOf(jointNode), Array.from(ibm.slice(joints[v * 4 + wi] * 16, joints[v * 4 + wi] * 16 + 16)));
      const vx = positions[v * 3], vy = positions[v * 3 + 1], vz = positions[v * 3 + 2];
      px += w * (boneM[0] * vx + boneM[4] * vy + boneM[8] * vz + boneM[12]);
      py += w * (boneM[1] * vx + boneM[5] * vy + boneM[9] * vz + boneM[13]);
      pz += w * (boneM[2] * vx + boneM[6] * vy + boneM[10] * vz + boneM[14]);
    }
    minY = Math.min(minY, py); maxY = Math.max(maxY, py);
    minX = Math.min(minX, px); maxX = Math.max(maxX, px);
    minZ = Math.min(minZ, pz); maxZ = Math.max(maxZ, pz);
  }
  return { y: [minY, maxY], x: [minX, maxX], z: [minZ, maxZ] };
}

const nodeByName = new Map(nodes.map((n, i) => [n.name, i]));

// A) locaux directs
const A = new Map();
// B) absolus convertis
const B = new Map();
// C) absolus en locaux
const C = new Map();
for (const bc of clip.bones) {
  const ni = nodeByName.get(bc.name);
  if (ni === undefined) continue;
  const q = bc.rotations.slice(0, 4);
  const p = (bc.positions && bc.positions.length >= 3) ? bc.positions.slice(0, 3) : [restLocal[ni][12], restLocal[ni][13], restLocal[ni][14]];
  const absM = compose(q, p);
  A.set(ni, absM);
  C.set(ni, absM);
  const parentNode = parent[ni];
  const parentClip = parentNode >= 0 ? clipByName.get(nodes[parentNode].name) : undefined;
  if (parentClip) {
    const pq = parentClip.rotations.slice(0, 4);
    const pp = (parentClip.positions && parentClip.positions.length >= 3) ? parentClip.positions.slice(0, 3) : [0, 0, 0];
    const parentAbs = compose(pq, pp);
    B.set(ni, mul(absM, rigidInv(parentAbs)));
  } else {
    B.set(ni, absM);
  }
}

console.log('Fichier:', GLB);
console.log('sommets:', nVerts, '| joints skin:', skin.joints.length, '| os clip:', clip.bones.length);
const fmt = (b) => `Y[${b.y[0].toFixed(1)}, ${b.y[1].toFixed(1)}] h=${(b.y[1] - b.y[0]).toFixed(1)} X[${b.x[0].toFixed(1)}, ${b.x[1].toFixed(1)}] Z[${b.z[0].toFixed(1)}, ${b.z[1].toFixed(1)}]`;
console.log('REPOS (bind)  :', fmt(skinnedBbox(new Map())));
console.log('A locaux      :', fmt(skinnedBbox(A)));
console.log('B abs→local   :', fmt(skinnedBbox(B)));
console.log('C abs en loc  :', fmt(skinnedBbox(C)));

// ---- variantes supplémentaires (canal, ordre quaternion, conjugaison) ----
function variant(opts) {
  const M = new Map();
  for (const bc of clip.bones) {
    const ni = nodeByName.get(bc.name);
    if (ni === undefined) continue;
    let q = bc.rotations.slice(0, 4);
    let p = (bc.positions && bc.positions.length >= 3) ? bc.positions.slice(0, 3) : null;
    if (opts.wxyz) q = [q[3], q[0], q[1], q[2]];
    if (opts.conj) q = [-q[0], -q[1], -q[2], q[3]];
    if (!opts.rot) q = null;
    if (!opts.pos) p = null;
    if (q === null && p === null) continue;
    const rest = restLocal[ni];
    const rq = q ?? null;
    const rp = p ?? [rest[12], rest[13], rest[14]];
    if (rq === null) {
      // rotation de repos: extraire la partie rotation du matrix (supposé rigide)
      const r = rest.slice();
      // remplacer la translation
      const m = r; m[12] = rp[0]; m[13] = rp[1]; m[14] = rp[2];
      M.set(ni, m);
    } else {
      M.set(ni, compose(rq, rp));
    }
  }
  return M;
}
console.log('F positions    :', fmt(skinnedBbox(variant({ rot: false, pos: true }))));
console.log('G rotations    :', fmt(skinnedBbox(variant({ rot: true, pos: false }))));
console.log('D wxyz loc     :', fmt(skinnedBbox(variant({ rot: true, pos: true, wxyz: true }))));
console.log('E conj loc     :', fmt(skinnedBbox(variant({ rot: true, pos: true, conj: true }))));
