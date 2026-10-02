/**
 * Indexe les références de textures (.ddj) embarquées dans les fichiers .efp
 * de Particles.pk2 — les .efp (JMXVEFF) contiennent les chemins en clair.
 * Sortie: assets/pk2_particles/efp-textures.json { "chemin/efp": ["tex.ddj"] }
 */
const fs = require('fs');
const path = require('path');

const ROOT = 'assets/pk2_particles';
const idx = {};
let withTex = 0;

const walk = (dir) => {
  for (const f of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, f.name);
    if (f.isDirectory()) walk(p);
    else if (f.name.endsWith('.efp')) {
      const rel = path.relative(ROOT, p).split(path.sep).join('/').replace(/\.efp$/, '');
      const buf = fs.readFileSync(p);
      const s = buf.toString('latin1');
      const refs = [...s.matchAll(/[a-z0-9_\-]+(?:[\/\\][a-z0-9_\-]+)*\.ddj/gi)]
        .map((m) => m[0].split(/[\/\\]/).pop().toLowerCase());
      const uniq = [...new Set(refs)];
      if (uniq.length) withTex++;
      idx[rel] = uniq;
    }
  }
};

walk(ROOT);
fs.writeFileSync(path.join(ROOT, 'efp-textures.json'), JSON.stringify(idx, null, 1));
console.log('efp indexés:', Object.keys(idx).length, '| avec textures:', withTex);

// Aperçus par famille
for (const k of ['skill/china/cold_bingpan_ice', 'skill/china/sword_damage_divide_a', 'skill/china/bow_area_bomb_a']) {
  if (idx[k]) console.log(' ', k, '→', idx[k].slice(0, 4).join(', '));
}
const fams = {};
for (const k of Object.keys(idx)) {
  const fam = k.split('/')[1] ?? '?';
  fams[fam] = (fams[fam] ?? 0) + 1;
}
console.log('familles:', JSON.stringify(fams));
