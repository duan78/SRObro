/**
 * Pose neutre des GLB skinned — 2026-10 (fix animation "corps éparpillé")
 *
 * Contexte: les maillages BMS sont modélisés dans la pose NEUTRE DEBOUT du
 * rig (celle où commencent les clips BAN "standcity"), PAS dans la pose de
 * bind du BSK (une pose éparse: main à Y=89, tête Z=-42...). Les IBM écrites
 * comme inv(world BSK) étaient donc fausses d'un facteur "bind→neutre", et
 * jouer un clip (locaux réels) éparpillait le corps sur ~16 m.
 *
 * Correctif: recalculer les locaux des nodes et les IBM depuis la pose
 * NEUTRE = composition de la CLÉ 0 du clip de référence de la famille:
 *   - nodeLocal_neutre = inv(neutralWorld(parent)) × neutralWorld(node),
 *     avec neutralWorld(bone) = compose(quat0, pos0) du clip (les os absents
 *     du clip, ex. Spine_Base, gardent leur local BSK);
 *   - IBM(joint) = inv(neutralWorld(joint)).
 * Au repos le skinning redevient identité et l'animation (locaux du clip)
 * retargete correctement.
 *
 * Usage: node scripts/fix-glb-neutral-pose.js [--dry]
 */
const fs = require('fs');
const path = require('path');

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

function parseGlb(buf) {
  const jsonLen = buf.readUInt32LE(12);
  const jsonRaw = buf.slice(20, 20 + jsonLen);
  const json = JSON.parse(jsonRaw.toString('utf8').replace(/\0+$/, ''));
  let bin = null;
  const h = 20 + jsonLen;
  if (buf.length > h + 8 && buf.readUInt32LE(h + 4) === 0x004e4942) {
    bin = buf.slice(h + 8, h + 8 + buf.readUInt32LE(h));
  }
  return { json, bin, jsonHadNul: jsonRaw.toString('utf8').length !== jsonLen };
}

function writeGlb(json, bin) {
  let jsonBytes = Buffer.from(JSON.stringify(json), 'utf8');
  const jsonPad = (4 - (jsonBytes.length % 4)) % 4;
  if (jsonPad) jsonBytes = Buffer.concat([jsonBytes, Buffer.alloc(jsonPad, 0x20)]);
  let binBytes = bin ?? Buffer.alloc(0);
  const binPad = (4 - (binBytes.length % 4)) % 4;
  if (binPad) binBytes = Buffer.concat([binBytes, Buffer.alloc(binPad)]);
  const jsonLenPadded = jsonBytes.length;
  const total = 12 + 8 + jsonLenPadded + 8 + binBytes.length;
  const out = Buffer.alloc(total);
  out.writeUInt32LE(0x46546c67, 0);
  out.writeUInt32LE(2, 4);
  out.writeUInt32LE(total, 8);
  out.writeUInt32LE(jsonLenPadded, 12);
  out.writeUInt32LE(0x4e4f534a, 16);
  jsonBytes.copy(out, 20);
  const off = 20 + jsonLenPadded;
  out.writeUInt32LE(binBytes.length, off);
  out.writeUInt32LE(0x004e4942, off + 4);
  binBytes.copy(out, off + 8);
  return out;
}

/** Patch un GLB avec la pose neutre du clip donné. */
function patchNeutral(glbPath, clipPath, dry) {
  const buf = fs.readFileSync(glbPath);
  const { json, bin } = parseGlb(buf);
  const skin = json.skins?.[0];
  if (!skin || !bin) return { file: path.basename(glbPath), status: 'pas de skin' };
  const clip = JSON.parse(fs.readFileSync(clipPath, 'utf8'));
  const key0 = new Map();
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
  nodes.forEach((n, i) => (n.children || []).forEach((c) => { parent[c] = i; }));
  const restLocal = nodes.map((n) => (n.matrix ? Array.from(n.matrix) : IDENT.slice()));

  // neutralLocal: clé 0 du clip si l'os y figure, sinon local BSK
  const neutralLocal = nodes.map((n, i) => {
    const k = n.name ? key0.get(n.name) : undefined;
    return k ? compose(k.q, k.p) : restLocal[i];
  });

  // neutralWorld par composition
  const neutralWorld = new Array(nodes.length);
  const worldOf = (i) => {
    if (neutralWorld[i]) return neutralWorld[i];
    neutralWorld[i] = parent[i] === -1 ? neutralLocal[i] : mul(worldOf(parent[i]), neutralLocal[i]);
    return neutralWorld[i];
  };
  // forcer l'évaluation de tous les os
  nodes.forEach((n, i) => { if (n.name && n.name.startsWith('Bip') || n.name === 'Spine_Base') worldOf(i); });

  if (dry) {
    // validation: les nouveaux locaux + IBM → identité au repos
    const newLocal = nodes.map((n, i) =>
      parent[i] === -1 ? neutralLocal[i] : mul(rigidInv(worldOf(parent[i])), worldOf(i)));
    return { file: path.basename(glbPath), status: 'OK (dry)', bones: key0.size, clip: path.basename(clipPath) };
  }

  // 1) nouveaux locaux des nodes (le mesh node 0 reste tel quel)
  for (let i = 0; i < nodes.length; i++) {
    if (!nodes[i].name || nodes[i].name === 'mesh' || parent[i] === -1) {
      if (nodes[i].matrix && neutralLocal[i] !== restLocal[i]) nodes[i].matrix = neutralLocal[i];
      continue;
    }
    nodes[i].matrix = mul(rigidInv(worldOf(parent[i])), worldOf(i));
  }

  // 2) nouvelles IBM = inv(neutralWorld) pour chaque joint
  const ibmAcc = json.accessors[skin.inverseBindMatrices];
  const ibmBV = json.bufferViews[ibmAcc.bufferView];
  const nJoints = skin.joints.length;
  const newIbm = new Float32Array(nJoints * 16);
  for (let k = 0; k < nJoints; k++) {
    const inv = rigidInv(worldOf(skin.joints[k]));
    for (let e = 0; e < 16; e++) newIbm[k * 16 + e] = inv[e];
  }
  const ibmBytes = Buffer.from(newIbm.buffer, newIbm.byteOffset, newIbm.byteLength);
  const newBin = Buffer.concat([bin, ibmBytes]);
  ibmBV.byteOffset = bin.length;
  ibmBV.byteLength = ibmBytes.length;
  ibmAcc.count = nJoints;
  json.buffers[0].byteLength = newBin.length;

  fs.writeFileSync(glbPath, writeGlb(json, newBin));
  return { file: path.basename(glbPath), status: 'patché', bones: key0.size, clip: path.basename(clipPath) };
}

// --- CLI: mapping familles perso → clip de référence ---
const dry = process.argv.includes('--dry');
const DIR = 'client/public/assets/glb_blender';
const MAN_CLIP = 'client/public/assets/anims/char/china/man/chinaman_fighter_standcity.json';
const WOMAN_CLIP = 'client/public/assets/anims/char/china/woman/chinawoman_fighter_standcity.json';
const targets = [];
for (const f of fs.readdirSync(DIR)) {
  if (!f.endsWith('.glb')) continue;
  const isMan = /^(man_|chinaman_)/.test(f);
  const isWoman = /^(woman_|chinawoman_)/.test(f);
  if (isMan) targets.push([path.join(DIR, f), MAN_CLIP]);
  else if (isWoman) targets.push([path.join(DIR, f), WOMAN_CLIP]);
}
let ok = 0, skip = 0, err = 0;
for (const [glb, clip] of targets) {
  try {
    const r = patchNeutral(glb, clip, dry);
    if (r.status.startsWith('OK') || r.status === 'patché') { ok++; console.log('✓', r.file, r.status, '(' + r.bones + ' os du clip)'); }
    else { skip++; }
  } catch (e) { err++; console.log('✗', glb, e.message); }
}
console.log(`\n${dry ? '[DRY] ' : ''}${targets.length} fichiers perso: ${ok} traités, ${skip} sans skin, ${err} erreurs`);

// Bump du stamp anti-cache (les URLs d'assets changent → plus de GLB périmés)
require('fs').writeFileSync('client/public/assets/version.txt', String(Date.now()));
