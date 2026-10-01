/**
 * SRObro - Générateur de manifest d'assets
 *
 * Reconstruit les sections `resources`, `monsters` et `npc` du manifest client
 * en croisant :
 *  - les fichiers .bsr extraits de Data.pk2 (assets/pk2_data, noms plats)
 *  - les modèles GLB skinés convertis (client/public/assets/glb_blender)
 *  - les données officielles importées (server/data/game/characters.json)
 *
 * Les références .bms sont extraites des .bsr par balayage binaire (les chemins
 * y sont stockés en chaînes ASCII), sans parser complet du format JMXVRES.
 *
 * Usage: npx tsx scripts/generate-asset-manifest.ts
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '../..');
const PK2_DATA = path.join(ROOT, 'assets/pk2_data');
const GLB_DIR = path.join(ROOT, 'client/public/assets/glb_blender');
const MANIFEST = path.join(ROOT, 'client/public/assets/manifest.json');
const CHARS_JSON = path.join(ROOT, 'server/data/game/characters.json');

interface ResourceEntry {
  meshes: string[];
  glbs: string[];
  /** Chemins de textures PNG converties (depuis les .bmt référencés par le .bsr) */
  textures?: string[];
}

function listFiles(dir: string, ext: string): string[] {
  const out: string[] = [];
  const stack = [dir];
  while (stack.length) {
    const d = stack.pop() as string;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(d, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      const p = path.join(d, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.name.toLowerCase().endsWith(ext)) out.push(p);
    }
  }
  return out;
}

/** Extrait les références de fichiers .bms/.bsk/.bmt d'un buffer .bsr. */
function extractRefs(buf: Buffer): string[] {
  const refs = new Set<string>();
  // Chaînes ASCII imprimables se terminant par .bms/.bsk/.bmt (chemins internes du pack)
  const re = /[\x20-\x7e]{3,120}\.(bms|bsk|bmt)/gi;
  const latin = buf.toString('latin1');
  let m: RegExpExecArray | null;
  while ((m = re.exec(latin)) !== null) {
    refs.add(m[0].replace(/^[^\w\\/]+/, ''));
  }
  return [...refs];
}

/**
 * Parse un fichier .bmt (JMXVBMT) et retourne les chemins de textures
 * référencés par ses matériaux (layout identique au parseur Rust du projet).
 */
function parseBmtTextures(buf: Buffer): string[] {
  if (buf.length < 16 || buf.toString('latin1', 0, 7) !== 'JMXVBMT') return [];
  const textures: string[] = [];
  let o = 12; // magic(7) + version(5)
  if (o + 4 > buf.length) return [];
  const count = buf.readUInt32LE(o); o += 4;
  const readStr = (): string => {
    if (o + 4 > buf.length) return '';
    const len = buf.readUInt32LE(o); o += 4;
    if (len === 0 || o + len > buf.length) return '';
    const s = buf.toString('latin1', o, o + len); o += len;
    return s;
  };
  for (let i = 0; i < count && o < buf.length; i++) {
    readStr();              // nom matériau
    o += 16 * 4;            // diffuse/ambient/specular/emissive (16 f32)
    if (o + 8 > buf.length) break;
    o += 4;                 // shininess (f32)
    const flags = buf.readUInt32LE(o); o += 4;
    if (flags & 0x100) {
      const tex = readStr();
      if (tex) textures.push(tex);
      o += 7;
    }
    if (flags & 0x2000) {
      readStr();            // normal map (non convertie pour l'instant)
      o += 4;
    }
  }
  return textures;
}

async function main(): Promise<void> {
  console.log('Scanning BSR files in', PK2_DATA);
  const bsrFiles = listFiles(PK2_DATA, '.bsr');
  console.log(`Found ${bsrFiles.length} .bsr files`);

  const glbSet = new Set(
    listFiles(GLB_DIR, '.glb').map((p) => path.basename(p).replace(/\.glb$/i, '').toLowerCase()),
  );
  console.log(`Found ${glbSet.size} GLB models`);

  // Index des PNG convertis (chemin relatif depuis assets/textures, minuscules)
  const TEX_DIR = path.resolve(ROOT, 'client/public/assets/textures');
  const pngIndex = new Map<string, string>();
  const pngByBasename = new Map<string, string>();
  for (const p of listFiles(TEX_DIR, '.png')) {
    const rel = path.relative(TEX_DIR, p).split(path.sep).join('/').toLowerCase();
    pngIndex.set(rel, rel);
    const base = rel.split('/').pop() as string;
    if (!pngByBasename.has(base)) pngByBasename.set(base, rel);
  }
  console.log(`Found ${pngIndex.size} PNG textures`);

  // Index des .bmt par stem minuscule (l'extraction pk2 garde l'arborescence)
  const bmtByStem = new Map<string, string>();
  for (const p of listFiles(PK2_DATA, '.bmt')) {
    const stem = path.basename(p).replace(/\.bmt$/i, '').toLowerCase();
    if (!bmtByStem.has(stem)) bmtByStem.set(stem, p);
  }

  // Index BSR stem -> entry (clés normalisées en minuscules: la casse varie
  // dans le pack officiel, ex. Mangnyang.bsr vs mob\china\mangnyang.bsr)
  const resources: Record<string, ResourceEntry> = {};
  let withGlbs = 0;
  let withTex = 0;
  for (const f of bsrFiles) {
    const stem = path.basename(f).replace(/\.bsr$/i, '').toLowerCase();
    let refs: string[];
    let buf: Buffer;
    try {
      buf = fs.readFileSync(f);
      refs = extractRefs(buf);
    } catch {
      continue;
    }
    const meshes = refs.filter((r) => r.toLowerCase().endsWith('.bms'));
    const glbs: string[] = [];
    for (const ref of meshes) {
      const mStem = path.basename(ref).replace(/\.bms$/i, '').toLowerCase();
      if (glbSet.has(mStem)) glbs.push(`glb_blender/${mStem}.glb`);
    }
    // Textures: parse des .bmt référencés par le BSR
    const textures: string[] = [];
    for (const ref of refs.filter((r) => r.toLowerCase().endsWith('.bmt'))) {
      const bmtStem = path.basename(ref).replace(/\.bmt$/i, '').toLowerCase();
      const bmtPath = bmtByStem.get(bmtStem);
      if (!bmtPath) continue;
      // Répertoire du pack du BSR (ex: prim\mtrl\mob\china) pour résoudre
      // les références de textures relatives
      const bsrDir = path.dirname(ref).split(/[\\/]/).join('/').toLowerCase();
      try {
        for (const ddj of parseBmtTextures(fs.readFileSync(bmtPath))) {
          const ddjNorm = ddj.split(/[\\/]/).join('/').replace(/\.ddj$/i, '.png').toLowerCase();
          // 1) chemin complet tel quel  2) relatif au dossier du BSR  3) relatif au dossier du BMT  4) stem global
          const bmtDir = path.relative(PK2_DATA, path.dirname(bmtPath)).split(path.sep).join('/').toLowerCase();
          const candidates = [
            ddjNorm,
            `${bsrDir}/${ddjNorm}`,
            `${bmtDir}/${ddjNorm}`,
          ];
          let resolved: string | undefined;
          for (const c of candidates) {
            resolved = pngIndex.get(c) ?? pngIndex.get(c.replace(/^\//, ''));
            if (resolved) break;
          }
          if (!resolved && !ddjNorm.includes('/')) {
            // fallback: unique PNG avec ce nom de fichier
            resolved = pngByBasename.get(ddjNorm);
          }
          if (resolved && !textures.includes(resolved)) textures.push(resolved);
        }
      } catch {
        // bmt illisible: on ignore ses textures
      }
    }
    if (glbs.length > 0) withGlbs++;
    if (textures.length > 0) withTex++;
    const prev = resources[stem];
    if (!prev || glbs.length > (prev.glbs?.length ?? 0)) {
      resources[stem] = { meshes, glbs, textures };
    } else if (textures.length > (prev.textures?.length ?? 0)) {
      prev.textures = textures;
    }
  }
  console.log(`Resources: ${Object.keys(resources).length}, avec GLB skiné: ${withGlbs}, avec textures: ${withTex}`);

  // Sections monstres/NPC depuis les données officielles
  interface CharRow {
    code: string; isMonster: boolean; isNpc: boolean; bsrPath: string | null; name: string | null;
  }
  const chars: CharRow[] = JSON.parse(fs.readFileSync(CHARS_JSON, 'utf8'));
  const monsters: Record<string, { model: string; parts: string[]; name: string | null }> = {};
  const npcs: Record<string, { model: string; parts: string[]; name: string | null }> = {};
  let mobOk = 0;
  let npcOk = 0;
  for (const c of chars) {
    if (!c.bsrPath) continue;
    const stem = path.basename(c.bsrPath).replace(/\.bsr$/i, '').toLowerCase();
    const entry = resources[stem];
    if (!entry || entry.glbs.length === 0) continue;
    // Nommer par le code officiel ET par le stem pour maximiser les chances de résolution
    const record = { model: entry.glbs[0], parts: entry.glbs, name: c.name };
    const target = c.isMonster ? monsters : npcs;
    target[stem] = record;
    target[c.code] = record;
    if (c.isMonster) mobOk++;
    else npcOk++;
  }
  console.log(`Monstres mappés: ${mobOk}, NPC mappés: ${npcOk}`);

  // Fusion avec le manifest existant
  const manifest = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
  const oldRes = manifest.resources ?? {};
  for (const [k, v] of Object.entries(oldRes)) {
    if (!resources[k]) resources[k] = v as ResourceEntry;
  }
  manifest.resources = resources;
  manifest.monsters = { ...(manifest.monsters ?? {}), ...monsters };
  manifest.npc = { ...(manifest.npc ?? {}), ...npcs };
  manifest.generation = {
    regeneratedAt: new Date().toISOString(),
    bsrCount: bsrFiles.length,
    glbCount: glbSet.size,
    monstersMapped: mobOk,
    npcsMapped: npcOk,
  };

  fs.writeFileSync(MANIFEST, JSON.stringify(manifest));
  console.log(`Manifest écrit: ${MANIFEST} (${(fs.statSync(MANIFEST).size / 1048576).toFixed(1)} Mo)`);
  // Échantillon de vérification
  const sample = resources['mangnyang'];
  console.log('Échantillon mangnyang:', JSON.stringify(sample));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
