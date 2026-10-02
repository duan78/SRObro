/**
 * SRObro — import-official-csv.ts
 * Importe les données OFFICIELLES extraites pendant la campagne 2026-10
 * (docs/SRO_KNOWLEDGE_BASE/ML_RESEARCH/data/) vers server/data/game/ :
 *
 *  - monsters_vsro188.csv + uniques_vsro188.csv → monsters_official.json
 *    (stats SERVEUR officielles : HP/MP/EXP/atk/parry — extraction binaire
 *     du backup vSRO SRO_VT_SHARD.bak, repo joaodematejr/private_server)
 *  - skills_detail_CH.csv + skills_detail_EU.csv + skills_series.csv
 *    → skills_official.json (valeurs par niveau depuis skilldata_5000.txt
 *     serveur : % dégâts fixe par série, MP, cooldowns ms, portées)
 *
 * Source des données : docs/SRO_KNOWLEDGE_BASE/ML_RESEARCH/RESEARCH_VSRO_DB_MONSTERS.md
 * et RESEARCH_SKILLDATA_EXTRACT.md (méthodologie et validation).
 */

import * as fs from 'fs';
import * as path from 'path';

const KB_DATA = path.resolve(__dirname, '../../docs/SRO_KNOWLEDGE_BASE/ML_RESEARCH/data');
const OUT_DIR = path.resolve(__dirname, '../data/game');

// ---------- CSV parsing (RFC4180 minimal, guillemets gérés) ----------
function parseCsv(file: string): Record<string, string>[] {
  const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const rows: string[][] = [];
  let cur: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < raw.length; i++) {
    const c = raw[i];
    if (inQuotes) {
      if (c === '"') {
        if (raw[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += c;
    } else if (c === '"') inQuotes = true;
    else if (c === ',') { cur.push(field); field = ''; }
    else if (c === '\n') { cur.push(field); rows.push(cur); cur = []; field = ''; }
    else if (c !== '\r') field += c;
  }
  if (field.length || cur.length) { cur.push(field); rows.push(cur); }
  const header = rows[0];
  return rows.slice(1).filter(r => r.length > 1).map(r => {
    const o: Record<string, string> = {};
    header.forEach((h, i) => { o[h] = r[i] ?? ''; });
    return o;
  });
}

const num = (v: string | undefined): number => {
  if (v === undefined || v === '') return 0;
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

// ---------- Monstres ----------
interface OfficialMonster {
  code: string;          // MOB_CH_MANGNYANG
  stem: string;          // mangnyang (clé modelId serveur)
  zone: string;
  level: number;
  hp: number;
  mp: number;
  exp: number;           // EXP officielle serveur (jamais publiée avant l'extraction)
  atkMin: number;
  atkMax: number;
  atkRating: number;    // par: attack rating physique du monstre
  magRating: number;    // mar: attack rating magique
  parry: number;        // er_parry: ratio de parade (position du jet adverse)
  rarity: number;       // 0 normal / 1 champion / 2 giant / 3 unique / 8 unique silencieux
  country: number;       // 3 CH / 2 EU
  walkSpeed: number;
  runSpeed: number;
}

function importMonsters(): number {
  const rows = [
    ...parseCsv(path.join(KB_DATA, 'monsters_vsro188.csv')),
    ...parseCsv(path.join(KB_DATA, 'monsters_cap120.csv')),
  ];
  const byCode = new Map<string, OfficialMonster>();
  for (const r of rows) {
    const code = r.codename ?? '';
    if (!code.startsWith('MOB_')) continue;
    // Lignes parasites des dumps (_CLON/_DROP) et véhicules exclus
    if (/_CLON|_DROP|AUTOMOB/.test(code)) continue;
    const service = num(r.service);
    if (service !== 1) continue;
    // 1ère passe seulement : monsters_vsro188 d'abord, cap120 en complément
    const level = num(r.level);
    if (level <= 0) continue;
    const stem = code.split('_').slice(2).join('_').toLowerCase();
    byCode.set(code, {
      code, stem,
      zone: r.zone ?? 'AUTRE',
      level,
      hp: num(r.max_hp),
      mp: num(r.max_mp),
      exp: num(r.exp_to_give),
      atkMin: num(r.atk_min),
      atkMax: num(r.atk_max),
      atkRating: num(r.par),
      magRating: num(r.mar),
      parry: num(r.er_parry),
      rarity: num(r.rarity),
      country: num(r.country),
      walkSpeed: num(r.speed_walk),
      runSpeed: num(r.speed_run),
    });
  }
  const list = [...byCode.values()];
  fs.writeFileSync(path.join(OUT_DIR, 'monsters_official.json'), JSON.stringify(list));
  const uniques = list.filter(m => m.rarity === 3 || m.rarity === 8).length;
  console.log(`[import-official-csv] ${list.length} monstres officiels (${uniques} uniques) → monsters_official.json`);
  return list.length;
}

// ---------- Skills ----------
interface OfficialSkill {
  id: number;
  group: number;          // group_id = groupe de cooldown partagé
  code: string;           // SKILL_CH_SWORD_SMASH_A_01
  series: string;         // SKILL_CH_SWORD_SMASH_A
  name: string;
  race: 'CH' | 'EU';
  masteryKey: string;     // bicheon|heuksal|... (clé partagée serveur)
  masteryLabel: string;
  level: number;
  activity: number;       // 0 passif / 1-2 actif
  chainNext: number;      // chain_next_id (combo)
  prepareMs: number;
  castMs: number;
  actionMs: number;
  cooldownMs: number;
  cooltimeMs: number;     // cooldown de groupe
  range: number;          // 0 = portée mêlée par défaut
  reqMasteryLv: number;
  reqSp: number;
  weapon1: string;
  weapon2: string;
  hpCost: number;
  mpCost: number;
  hpRatio: number;
  mpRatio: number;
  uiTab: number; uiPage: number; uiCol: number; uiRow: number;
  icon: string;
  tags: string[];
  attKind: number;        // 5 physique / 8 imbue magique / 10 magique
  attPct: number;         // % FIXE de la série (143 = ×1.43)
  attMin: number;         // part fixe qui monte avec le niveau
  attMax: number;
  duraMs: number;         // durée d'effet (imbues: 6000)
  mcHits: number;         // coups multiples
  crit: number;           // tag cr: seule une minorité de séries peut critiquer
  heal: number;
  defp: number;           // buff défense
  hrFlat: number; hrPct: number;   // attack rating
  erFlat: number; erPct: number;   // parry ratio
  stDurMs: number;        // durée des statuts
}

/** "Bicheon (Sword)" → bicheon ; "Warrior" → warrior ; map robuste. */
function masteryKey(label: string, race: string): string {
  const l = (label || '').toLowerCase();
  const first = l.split(/[\s(]/)[0];
  if (race === 'CH') {
    if (first === 'bicheon' || first === 'sword') return 'bicheon';
    if (first === 'heuksal' || first === 'spear') return 'heuksal';
    if (first === 'pacheon' || first === 'bow') return 'pacheon';
    if (l.includes('fire')) return 'fire';
    if (l.includes('cold')) return 'cold';
    if (l.includes('lightning')) return 'lightning';
    if (l.includes('force')) return 'force';
  }
  return first; // warrior/rogue/wizard/warlock/bard/cleric
}

function importSkills(): number {
  const files: Array<[string, 'CH' | 'EU']> = [
    ['skills_detail_CH.csv', 'CH'],
    ['skills_detail_EU.csv', 'EU'],
  ];
  const out: OfficialSkill[] = [];
  for (const [file, race] of files) {
    const rows = parseCsv(path.join(KB_DATA, file));
    for (const r of rows) {
      const code = r.codename ?? '';
      if (!code.startsWith('SKILL_')) continue;
      const masteryLabel = r.mastery ?? '';
      out.push({
        id: num(r.id),
        group: num(r.group_id),
        code,
        series: r.series ?? code,
        name: r.name ?? code,
        race,
        masteryKey: masteryKey(masteryLabel, race),
        masteryLabel,
        level: num(r.level),
        activity: num(r.activity),
        chainNext: num(r.chain_next_id),
        prepareMs: num(r.prepare_ms),
        castMs: num(r.cast_ms),
        actionMs: num(r.action_ms),
        cooldownMs: num(r.cooldown_ms),
        cooltimeMs: num(r.cooltime_ms),
        range: num(r.range),
        reqMasteryLv: num(r.req_mastery_lv),
        reqSp: num(r.req_sp),
        weapon1: r.weapon1 ?? '',
        weapon2: r.weapon2 ?? '',
        hpCost: num(r.hp_cost),
        mpCost: num(r.mp_cost),
        hpRatio: num(r.hp_ratio),
        mpRatio: num(r.mp_ratio),
        uiTab: num(r.ui_tab), uiPage: num(r.ui_page), uiCol: num(r.ui_col), uiRow: num(r.ui_row),
        icon: r.icon ?? '',
        tags: (r.tags ?? '').split(';').filter(Boolean),
        attKind: num(r.att_kind),
        attPct: num(r.att_pct),
        attMin: num(r.att_min),
        attMax: num(r.att_max),
        duraMs: num(r.dura_ms),
        mcHits: num(r.mc_hits) || 1,
        crit: num(r.cr),
        heal: num(r.heal),
        defp: num(r.defp),
        hrFlat: num(r.hr_flat), hrPct: num(r.hr_pct),
        erFlat: num(r.er_flat), erPct: num(r.er_pct),
        stDurMs: num(r.st_dur_ms),
      });
    }
  }
  fs.writeFileSync(path.join(OUT_DIR, 'skills_official.json'), JSON.stringify(out));
  const ch = out.filter(s => s.race === 'CH').length;
  console.log(`[import-official-csv] ${out.length} skills officiels (${ch} CH / ${out.length - ch} EU) → skills_official.json`);
  return out.length;
}

// ---------- Exécution ----------
const nbMonsters = importMonsters();
const nbSkills = importSkills();
if (nbMonsters === 0 || nbSkills === 0) {
  console.error('[import-official-csv] ÉCHEC: un import est vide');
  process.exit(1);
}
console.log('[import-official-csv] Terminé.');
