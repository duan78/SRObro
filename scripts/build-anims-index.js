/**
 * Index des clips d'animation: client/public/assets/anims/index.json
 * Map "nomfichier" (sans .json) → chemin complet, pour toutes les régions
 * (mob/china, mob/oasis, npc/*, cos/*, ...). Sert de fallback de résolution
 * quand le chemin direct attendu n'existe pas (stem ≠ nom de dossier,
 * région autre que china).
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'client/public/assets/anims';
const index = {};
const normIndex = new Map(); // nom normalisé (sans _ ni -) → [noms réels]
let n = 0;

const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.json') && f.name !== 'index.json') {
      const key = f.name.replace(/\.json$/, '');
      const url = '/assets/anims/' + path.relative(ROOT, p).split(path.sep).join('/');
      // en cas de doublon exact, garder la première (ordre régions fixes)
      if (!index[key]) { index[key] = url; n++; }
      const nk = key.replace(/[_\-]/g, '');
      if (!normIndex.has(nk)) normIndex.set(nk, key);
    }
  }
};
walk(ROOT);
fs.writeFileSync(path.join(ROOT, 'index.json'), JSON.stringify(index, null, 0));
console.log(n + ' clips indexés → index.json');
