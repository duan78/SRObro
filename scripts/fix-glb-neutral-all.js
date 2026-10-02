/**
 * Extension du patch de pose neutre à TOUS les GLB skinned dont le stem
 * correspond à une famille de clips (monstres toutes régions, NPC,
 * familiers cos). Utilise la même logique que fix-glb-neutral-pose.js:
 * node locals + IBM recalculés depuis la clé 0 du clip de référence
 * (walk > run > stand01 > premier clip trouvé).
 *
 * Usage: node scripts/fix-glb-neutral-all.js [--dry]
 */
const fs = require('fs');
const path = require('path');

// Réutiliser les fonctions du script principal
const main = fs.readFileSync(path.join(__dirname, 'fix-glb-neutral-pose.js'), 'utf8');
const fnBody = main.slice(0, main.indexOf('--- CLI'));
eval(fnBody.replace(/^\/\*\*[\s\S]*?\*\/\n/, ''));

const ANIMS = 'client/public/assets/anims';
const GLB_DIR = 'client/public/assets/glb_blender';

// index nomfichier → chemin (régions confondues)
const clipIndex = new Map();
const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.json') && f.name !== 'index.json') {
      const key = f.name.replace(/\.json$/, '');
      if (!clipIndex.has(key)) clipIndex.set(key, p);
    }
  }
};
walk(ANIMS);

// catégorie de clip à considérer (monstres/NPC/familiers; char déjà fait)
const CATEGORIES = ['mob', 'npc', 'cos', 'avatar'];

// familles (stems) disponibles par catégorie, normalisées
const norm = (s) => s.replace(/[_\-]/g, '').toLowerCase();
const families = new Map(); // stem normalisé → clip de référence (chemin)
for (const [name, p] of clipIndex) {
  const cat = path.relative(ANIMS, p).split(path.sep)[0];
  if (!CATEGORIES.includes(cat)) continue;
  const m = name.match(/^(.*)_(walk|run|stand01|stand02)$/);
  const stem = m ? m[1] : null;
  if (!stem) continue;
  const n = norm(stem);
  const priority = (f) => (f.endsWith(`_${path.sep ? '' : ''}walk.json`) || f.includes(`${stem}_walk.json`) ? 0 :
    f.includes(`${stem}_run.json`) ? 1 : f.includes('stand01') ? 2 : 3);
  const existing = families.get(n);
  if (!existing || priority(p) < priority(existing)) families.set(n, p);
}

// matcher un GLB → clip de référence (avec repli: retirer le dernier
// segment du stem — ex. blackrobberarcher_archer → blackrobberarcher)
const resolveFamily = (glbStem) => {
  let s = glbStem;
  for (let i = 0; i < 3 && s; i++) {
    const n = norm(s);
    if (families.has(n)) return families.get(n);
    const idx = s.lastIndexOf('_');
    if (idx <= 0) break;
    s = s.slice(0, idx);
  }
  return null;
};

/** Le GLB est-il DÉJÀ en pose neutre pour ce clip? (idempotence) */
const isAlreadyNeutral = (glbPath, clipPath) => {
  const buf = fs.readFileSync(glbPath);
  const jl = buf.readUInt32LE(12);
  const json = JSON.parse(buf.slice(20, 20 + jl).toString('utf8').replace(/\0+$/, ''));
  if (!json.skins?.length) return false;
  const skin = json.skins[0];
  const acc = json.accessors[skin.inverseBindMatrices];
  const bv = json.bufferViews[acc.bufferView];
  if (acc.count !== skin.joints.length) return false;
  const clip = JSON.parse(fs.readFileSync(clipPath, 'utf8'));
  const key0 = new Map();
  for (const bc of clip.bones) {
    if (bc.rotations.length >= 4) key0.set(bc.name, [bc.rotations.slice(0, 4), bc.positions?.slice(0, 3) ?? [0, 0, 0]]);
  }
  const nodes = json.nodes;
  const parent = new Array(nodes.length).fill(-1);
  nodes.forEach((n, i) => (n.children || []).forEach((c) => { parent[c] = i; }));
  const restLocal = nodes.map((n) => (n.matrix ? Array.from(n.matrix) : IDENT.slice()));
  const neutralLocal = nodes.map((n, i) => {
    const k = n.name ? key0.get(n.name) : undefined;
    return k ? composeL(k[0], k[1]) : restLocal[i];
  });
  const nw = new Array(nodes.length);
  const wOf = (i) => {
    if (nw[i]) return nw[i];
    nw[i] = parent[i] === -1 ? neutralLocal[i] : mulL(wOf(parent[i]), neutralLocal[i]);
    return nw[i];
  };
  const h = 20 + jl;
  const bin = buf.slice(h + 8, h + 8 + buf.readUInt32LE(h));
  const ibm = new Float32Array(bin.buffer, bin.byteOffset + (bv.byteOffset || 0), acc.count * 16);
  let maxDev = 0;
  skin.joints.forEach((j, k) => {
    const rest = mulL(wOf(j), Array.from(ibm.slice(k * 16, k * 16 + 16)));
    maxDev = Math.max(maxDev, ...rest.map((v, i2) => Math.abs(v - IDENT[i2])));
  });
  return maxDev < 0.01;
};

const dry = process.argv.includes('--dry');
const IDENT = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
// helpers locaux (les const du script évalué ne fuient pas du eval)
const mulL = (a, b) => {
  const o = new Array(16).fill(0);
  for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) for (let k = 0; k < 4; k++)
    o[i * 4 + j] += a[k * 4 + j] * b[i * 4 + k];
  return o;
};
const quatToMatL = (x, y, z, w) => {
  const m = new Array(16).fill(0);
  m[0] = 1 - 2 * (y * y + z * z); m[1] = 2 * (x * y + z * w); m[2] = 2 * (x * z - y * w);
  m[4] = 2 * (x * y - z * w); m[5] = 1 - 2 * (x * x + z * z); m[6] = 2 * (y * z + x * w);
  m[8] = 2 * (x * z + y * w); m[9] = 2 * (y * z - x * w); m[10] = 1 - 2 * (x * x + y * y);
  m[15] = 1;
  return m;
};
const composeL = (q, p) => {
  const m = quatToMatL(q[0], q[1], q[2], q[3]);
  m[12] = p[0]; m[13] = p[1]; m[14] = p[2];
  return m;
};
let ok = 0, skip = 0, err = 0, noClip = 0;
const results = [];
for (const f of fs.readdirSync(GLB_DIR)) {
  if (!f.endsWith('.glb')) continue;
  // ignorer les persos (déjà patchés par fix-glb-neutral-pose.js)
  if (/^(man_|chinaman_|woman_|chinawoman_)/.test(f)) continue;
  const buf = fs.readFileSync(path.join(GLB_DIR, f));
  const jl = buf.readUInt32LE(12);
  let json;
  try { json = JSON.parse(buf.slice(20, 20 + jl).toString('utf8').replace(/\0+$/, '')); } catch { err++; continue; }
  if (!json.skins?.length) { skip++; continue; }
  const stem = f.replace(/\.glb$/, '').replace(/_part\d+.*$/, '').replace(/_a(?!ttack)/, '');
  const clip = resolveFamily(stem);
  if (!clip) { noClip++; continue; }
  try {
    if (isAlreadyNeutral(path.join(GLB_DIR, f), clip)) { skip++; continue; }
    const r = patchNeutral(path.join(GLB_DIR, f), clip, dry);
    if (r.status === 'patché' || (dry && r.status.startsWith('OK'))) { ok++; results.push(f + ' ← ' + path.basename(clip)); }
    else skip++;
  } catch (e) { err++; console.log('✗', f, e.message.slice(0, 70)); }
}
console.log(`\n${dry ? '[DRY] ' : ''}${ok} GLB patchés (pose neutre), ${noClip} sans clip correspondant, ${skip} ignorés, ${err} erreurs`);
console.log('exemples:', results.slice(0, 8).join(' | '));

// Bump du stamp anti-cache (les URLs d'assets changent → plus de GLB périmés)
if (!dry) require('fs').writeFileSync('client/public/assets/version.txt', String(Date.now()));
