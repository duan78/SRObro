/**
 * SRObro - Importateur des données textdata du client officiel
 *
 * Lit les fichiers TSV UTF-16LE extraits de Media.pk2
 * (assets/pk2_media/server_dep/silkroad/textdata/) et produit des JSON
 * exploitables par le serveur dans server/data/game/.
 *
 * Usage:
 *   npx tsx scripts/import-textdata.ts [--inspect item|char|skill|text] [--root <chemin extraction>]
 *
 * Les colonnes suivent la mise en page communautaire des tables
 * _RefObjCommon + _RefObjItem / _RefObjChar / _RefSkill (format textdata
 * client = fusion de ces tables serveur).
 */

import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Utilitaires lecture TSV UTF-16LE
// ---------------------------------------------------------------------------

const DEFAULT_ROOT = path.resolve(__dirname, '../../assets/pk2_media/server_dep/silkroad/textdata');

/** Index insensible à la casse des fichiers du dossier textdata. */
function buildFileIndex(root: string): Map<string, string> {
  const idx = new Map<string, string>();
  for (const f of fs.readdirSync(root)) idx.set(f.toLowerCase(), path.join(root, f));
  return idx;
}

/** Décode un fichier textdata en lignes de colonnes. */
function readTsv(file: string): string[][] {
  const raw = fs.readFileSync(file);
  let text = raw.toString('utf16le');
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1); // BOM
  return text
    .split(/\r?\n/)
    .filter((l) => l.length > 0 && !l.startsWith('//') && l.trim().length > 0)
    .map((l) => l.split('\t'));
}

/** Résout un nom de fichier avec fallback insensible à la casse. */
function resolveFile(idx: Map<string, string>, name: string): string | null {
  return idx.get(name.toLowerCase()) ?? null;
}

/** Lit un "loader" (fichier listant d'autres fichiers) et fusionne les lignes. */
function loadLoader(idx: Map<string, string>, loaderName: string): { rows: string[][]; files: string[] } {
  const loaderPath = resolveFile(idx, loaderName);
  if (!loaderPath) throw new Error(`Loader introuvable: ${loaderName}`);
  const rows: string[][] = [];
  const files: string[] = [];
  for (const line of readTsv(loaderPath)) {
    const name = line[0]?.trim();
    if (!name) continue;
    const p = resolveFile(idx, name);
    if (!p) {
      console.warn(`  ! fichier du loader manquant: ${name}`);
      continue;
    }
    files.push(name);
    rows.push(...readTsv(p));
  }
  return { rows, files };
}

// ---------------------------------------------------------------------------
// Mappings de colonnes (vérifiés empiriquement, indices 0-based)
// ---------------------------------------------------------------------------

/**
 * itemdata.txt — 160 colonnes, partie commune (_RefObjCommon) puis item.
 * Vérifié sur: ITEM_ETC_CURE_ALL_01, armes CH/EU, potions, flèches.
 */
const ITEM_COLS = {
  service: 0,
  id: 1,
  code: 2,
  objName: 3,
  nameStrId: 5,
  descStrId: 6,
  typeId1: 8,
  typeId2: 9,
  typeId3: 10,
  typeId4: 11,
  price: 13,
  maxStack: 26,
  bsrPath: 53,
  iconPath: 54,
};

/**
 * characterdata.txt — monstres, NPC et personnages (104 colonnes).
 * Colonnes vérifiées empiriquement sur des monstres de référence
 * (MOB_CH_MANGNYANG lvl 1 : exp 54, HP 24, attaque 7-10).
 */
const CHAR_COLS = {
  service: 0,
  id: 1,
  code: 2,
  objName: 3,
  nameStrId: 5,
  typeId1: 8,
  typeId2: 9,
  typeId3: 10,
  typeId4: 11,
  bsrPath: 52,
  level: 57,
  expReward: 59,
  phyAtkMin: 71,
  phyAtkMax: 72,
  magAtkMin: 73,
  magAtkMax: 74,
  phyDefense: 75,
  magDefense: 77,
  hp: 79,
  attackRating: 80,
};

/** skilldata.txt — compétences. */
const SKILL_COLS = {
  service: 0,
  id: 1,
  group: 2,
  code: 3,
  objName: 4,
};

// ---------------------------------------------------------------------------
// Extraction structurée
// ---------------------------------------------------------------------------

const num = (v: string | undefined): number | null => {
  if (v == null || v === '' || v === 'xxx' || v === 'NaN') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

interface ItemRow {
  id: number;
  code: string;
  objName: string;
  nameStrId: string;
  descStrId: string;
  typeId1: number; typeId2: number; typeId3: number; typeId4: number;
  price: number | null;
  maxStack: number | null;
  bsrPath: string | null;
  iconPath: string | null;
  /** Colonnes supplémentaires utiles (confirmées par inspection) */
  cols: { [k: string]: number | string | null };
}

interface CharRow {
  id: number;
  code: string;
  objName: string;
  nameStrId: string;
  typeId1: number; typeId2: number; typeId3: number; typeId4: number;
  isMonster: boolean;
  isNpc: boolean;
  bsrPath: string | null;
  level: number | null;
  expReward: number | null;
  phyAtkMin: number | null;
  phyAtkMax: number | null;
  magAtkMin: number | null;
  magAtkMax: number | null;
  phyDefense: number | null;
  magDefense: number | null;
  hp: number | null;
  attackRating: number | null;
}

interface SkillRow {
  id: number;
  group: number;
  code: string;
  objName: string;
  cols: { [k: string]: number | string | null };
}

function parseItems(rows: string[][]): Map<number, ItemRow> {
  const out = new Map<number, ItemRow>();
  // Les loaders successifs surchargent: on garde la dernière version de chaque ID.
  for (const r of rows) {
    const id = num(r[ITEM_COLS.id]);
    if (id == null) continue;
    out.set(id, {
      id,
      code: r[ITEM_COLS.code] ?? '',
      objName: r[ITEM_COLS.objName] ?? '',
      nameStrId: r[ITEM_COLS.nameStrId] ?? '',
      descStrId: r[ITEM_COLS.descStrId] ?? '',
      typeId1: num(r[ITEM_COLS.typeId1]) ?? 0,
      typeId2: num(r[ITEM_COLS.typeId2]) ?? 0,
      typeId3: num(r[ITEM_COLS.typeId3]) ?? 0,
      typeId4: num(r[ITEM_COLS.typeId4]) ?? 0,
      price: num(r[ITEM_COLS.price]),
      maxStack: num(r[ITEM_COLS.maxStack]),
      bsrPath: r[ITEM_COLS.bsrPath] && r[ITEM_COLS.bsrPath] !== 'xxx' ? r[ITEM_COLS.bsrPath] : null,
      iconPath: r[ITEM_COLS.iconPath] && r[ITEM_COLS.iconPath] !== 'xxx' ? r[ITEM_COLS.iconPath] : null,
      cols: {},
    });
  }
  return out;
}

function parseChars(rows: string[][]): Map<number, CharRow> {
  const out = new Map<number, CharRow>();
  for (const r of rows) {
    const id = num(r[CHAR_COLS.id]);
    if (id == null) continue;
    const t1 = num(r[CHAR_COLS.typeId1]) ?? 0;
    const t4 = num(r[CHAR_COLS.typeId4]) ?? 0;
    const code = r[CHAR_COLS.code] ?? '';
    // Layout vérifié: (1,1,2,1)=monstre, (1,1,2,2)=NPC
    const isMonster = t1 === 1 && t4 === 1;
    const isNpc = t1 === 1 && t4 === 2;
    const bsr = r[CHAR_COLS.bsrPath];
    out.set(id, {
      id,
      code,
      objName: r[CHAR_COLS.objName] ?? '',
      nameStrId: r[CHAR_COLS.nameStrId] ?? '',
      typeId1: t1,
      typeId2: num(r[CHAR_COLS.typeId2]) ?? 0,
      typeId3: num(r[CHAR_COLS.typeId3]) ?? 0,
      typeId4: t4,
      isMonster,
      isNpc: isNpc || (!isMonster && code.startsWith('NPC_')),
      bsrPath: bsr && bsr !== 'xxx' ? bsr : null,
      level: num(r[CHAR_COLS.level]),
      expReward: num(r[CHAR_COLS.expReward]),
      phyAtkMin: num(r[CHAR_COLS.phyAtkMin]),
      phyAtkMax: num(r[CHAR_COLS.phyAtkMax]),
      magAtkMin: num(r[CHAR_COLS.magAtkMin]),
      magAtkMax: num(r[CHAR_COLS.magAtkMax]),
      phyDefense: num(r[CHAR_COLS.phyDefense]),
      magDefense: num(r[CHAR_COLS.magDefense]),
      hp: num(r[CHAR_COLS.hp]),
      attackRating: num(r[CHAR_COLS.attackRating]),
    });
  }
  return out;
}

function parseSkills(rows: string[][]): Map<number, SkillRow> {
  const out = new Map<number, SkillRow>();
  for (const r of rows) {
    const id = num(r[SKILL_COLS.id]);
    if (id == null) continue;
    out.set(id, {
      id,
      group: num(r[SKILL_COLS.group]) ?? 0,
      code: r[SKILL_COLS.code] ?? '',
      objName: r[SKILL_COLS.objName] ?? '',
      cols: {},
    });
  }
  return out;
}

/** textdata_object: SN_ID -> texte affiché. Format: SN_ID \t 1 \t texte ? */
function parseObjectTexts(idx: Map<string, string>): Map<string, string> {
  const out = new Map<string, string>();
  const loaderPath = resolveFile(idx, 'textdata_object.txt');
  if (!loaderPath) return out;
  const files = readTsv(loaderPath).map((l) => l[0]?.trim()).filter(Boolean);
  const all = new Set<string>(files);
  // Certains SN_ ne sont pas listés dans le loader: on balaie tout textdata_object_*.txt
  for (const [lower, full] of idx) {
    if (lower.startsWith('textdata_object')) all.add(full);
  }
  for (const f of all) {
    const p = typeof f === 'string' && fs.existsSync(f) ? f : resolveFile(idx, path.basename(f));
    if (!p) continue;
    for (const cols of readTsv(p)) {
      // Format: <1> <id> SN_XXX <texte...> — la clé SN_ est repérée par son préfixe
      const snIdx = cols.findIndex((c, i) => i <= 3 && c && c.trim().startsWith('SN_'));
      if (snIdx < 0) continue;
      const key = cols[snIdx].trim();
      let val = '';
      for (let i = snIdx + 1; i < cols.length; i++) {
        const c = cols[i]?.trim();
        if (c && c !== 'xxx' && c !== '0') { val = c; break; }
      }
      if (val) out.set(key, val);
    }
  }
  return out;
}

// ---------------------------------------------------------------------------
// Mode inspection: affiche une ligne annotée pour vérifier les colonnes
// ---------------------------------------------------------------------------

function inspect(rows: string[][], needle: string, label: string): void {
  const row = rows.find((r) => r.some((c) => c.includes(needle)));
  if (!row) {
    console.log(`[inspect] aucune ligne contenant "${needle}" (${label})`);
    return;
  }
  console.log(`\n[inspect] ${label} — ligne contenant "${needle}" (${row.length} colonnes):`);
  row.forEach((v, i) => {
    if (v && v.trim() !== '') console.log(`  ${String(i).padStart(3)}: ${v}`);
  });
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const inspectMode = args.includes('--inspect') ? args[args.indexOf('--inspect') + 1] : null;
  const rootIdx = args.indexOf('--root');
  const root = rootIdx >= 0 ? path.resolve(args[rootIdx + 1]) : DEFAULT_ROOT;

  if (!fs.existsSync(root)) {
    console.error(`Dossier textdata introuvable: ${root}`);
    console.error('Lance d\'abord l\'extraction de Media.pk2 (voir tools/veykril-pk2).');
    process.exit(1);
  }
  const idx = buildFileIndex(root);
  console.log(`Dossier textdata: ${root} (${idx.size} fichiers)`);

  const { rows: itemRows, files: itemFiles } = loadLoader(idx, 'itemdata.txt');
  const { rows: charRows, files: charFiles } = loadLoader(idx, 'characterdata.txt');
  const { rows: skillRows, files: skillFiles } = loadLoader(idx, 'skilldata.txt');
  console.log(`Loaders: ${itemFiles.length} fichiers items (${itemRows.length} lignes), ` +
    `${charFiles.length} chars (${charRows.length} lignes), ${skillFiles.length} skills (${skillRows.length} lignes)`);

  if (inspectMode) {
    if (inspectMode === 'item') {
      inspect(itemRows, 'ITEM_CH_BLADE_01', 'arme CH');
      inspect(itemRows, 'ITEM_ETC_HP_POTION_01', 'potion HP');
    } else if (inspectMode === 'char') {
      inspect(charRows, 'MOB_CH_YEHA', 'monstre Yeoha');
      inspect(charRows, 'NPC_CH_SMITH', 'NPC forgeron');
    } else if (inspectMode === 'skill') {
      inspect(skillRows, 'SKILL_CH_SPEAR_CHAIN_A', 'skill chain');
    } else if (inspectMode === 'text') {
      const texts = parseObjectTexts(idx);
      console.log(`SN_ strings: ${texts.size}`);
      for (const [k, v] of [...texts].slice(0, 5)) console.log(`  ${k} = ${v}`);
    }
    return;
  }

  // Parse + fusion des textes
  const items = parseItems(itemRows);
  const chars = parseChars(charRows);
  const skills = parseSkills(skillRows);
  const texts = parseObjectTexts(idx);
  console.log(`Items: ${items.size}, Chars: ${chars.size} (dont ${[...chars.values()].filter(c => c.isMonster).length} monstres / ${[...chars.values()].filter(c => c.isNpc).length} NPC), Skills: ${skills.size}, Texts SN_: ${texts.size}`);

  // Enrichissement avec les noms affichables
  let named = 0;
  for (const it of items.values()) {
    (it as any).name = texts.get(it.nameStrId) ?? null;
    if ((it as any).name) named++;
  }
  for (const c of chars.values()) (c as any).name = texts.get(c.nameStrId) ?? null;
  for (const s of skills.values()) (s as any).name = texts.get(`SN_${s.code}`) ?? null;
  console.log(`Noms résolus via textdata_object: ${named}/${items.size} items`);

  // Écriture des JSON
  const outDir = path.resolve(__dirname, '../data/game');
  fs.mkdirSync(outDir, { recursive: true });
  const write = (name: string, data: unknown): void => {
    const p = path.join(outDir, name);
    fs.writeFileSync(p, JSON.stringify(data));
    console.log(`  écrit ${name} (${(fs.statSync(p).size / 1048576).toFixed(1)} Mo)`);
  };
  write('items.json', [...items.values()]);
  write('characters.json', [...chars.values()]);
  write('skills.json', [...skills.values()]);
  console.log('Import terminé.');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
