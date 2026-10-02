/**
 * SRObro - GameDataService
 * Source de vérité des données de jeu importées du client officiel.
 *
 * Charge les JSON produits par `scripts/import-textdata.ts` à partir des
 * tables textdata extraites de Media.pk2 (characterdata/itemdata/skilldata).
 * Fournit des lookups par id et par code name (ex: MOB_CH_MANGNYANG).
 */

import * as fs from 'fs';
import * as path from 'path';

export interface GameItem {
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
  name: string | null;
}

export interface GameCharacter {
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
  name: string | null;
}

export interface GameSkill {
  id: number;
  group: number;
  code: string;
  objName: string;
  name: string | null;
}

/** Stats de monstre issues de la DB SERVEUR officielle (extraction vSRO 2026-10). */
export interface OfficialMonster {
  code: string;
  stem: string;
  zone: string;
  level: number;
  hp: number;
  mp: number;
  exp: number;
  atkMin: number;
  atkMax: number;
  atkRating: number;
  magRating: number;
  parry: number;
  rarity: number; // 0 normal / 1 champion / 2 giant / 3 unique / 8 unique silencieux
  country: number;
  walkSpeed: number;
  runSpeed: number;
}

/** Skill avec valeurs par niveau issues du skilldata SERVEUR officiel (extraction 2026-10). */
export interface OfficialSkill {
  id: number;
  group: number;
  code: string;
  series: string;
  name: string;
  race: 'CH' | 'EU';
  masteryKey: string;
  masteryLabel: string;
  level: number;
  activity: number;
  chainNext: number;
  prepareMs: number;
  castMs: number;
  actionMs: number;
  cooldownMs: number;
  cooltimeMs: number;
  range: number;
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
  attKind: number; // 5 physique / 8 imbue / 10 magique
  attPct: number;  // % FIXE de la série
  attMin: number;  // part fixe (monte avec le niveau)
  attMax: number;
  duraMs: number;
  mcHits: number;
  crit: number;
  heal: number;
  defp: number;
  hrFlat: number; hrPct: number;
  erFlat: number; erPct: number;
  stDurMs: number;
}

/**
 * Service singleton chargé au démarrage du GameServer.
 * Les fichiers manquants ne sont pas fatals: le service fonctionne
 * simplement avec des maps vides (données seed de la DB en fallback).
 */
export class GameDataService {
  private static instance: GameDataService | null = null;

  public readonly itemsById = new Map<number, GameItem>();
  public readonly itemsByCode = new Map<string, GameItem>();
  public readonly charsById = new Map<number, GameCharacter>();
  public readonly charsByCode = new Map<string, GameCharacter>();
  public readonly monstersByCode = new Map<string, GameCharacter>();
  public readonly npcsByCode = new Map<string, GameCharacter>();
  public readonly skillsById = new Map<number, GameSkill>();
  public readonly skillsByCode = new Map<string, GameSkill>();

  // Données officielles extraites (DB serveur vSRO + skilldata serveur, 2026-10)
  public readonly officialMonstersByCode = new Map<string, OfficialMonster>();
  public readonly officialMonstersByStem = new Map<string, OfficialMonster>();
  public readonly officialSkillsByCode = new Map<string, OfficialSkill>();
  public readonly officialSkillsBySeries = new Map<string, OfficialSkill[]>();

  public loaded = false;
  public counts = { items: 0, characters: 0, monsters: 0, npcs: 0, skills: 0, officialMonsters: 0, officialSkills: 0 };

  static getInstance(): GameDataService {
    if (!GameDataService.instance) {
      GameDataService.instance = new GameDataService();
    }
    return GameDataService.instance;
  }

  /**
   * Charge les JSON importés. Idempotent.
   */
  load(dataDir = path.resolve(__dirname, '../../data/game')): boolean {
    if (this.loaded) return true;

    const itemsFile = path.join(dataDir, 'items.json');
    const charsFile = path.join(dataDir, 'characters.json');
    const skillsFile = path.join(dataDir, 'skills.json');

    try {
      if (fs.existsSync(itemsFile)) {
        for (const it of JSON.parse(fs.readFileSync(itemsFile, 'utf8')) as GameItem[]) {
          this.itemsById.set(it.id, it);
          this.itemsByCode.set(it.code, it);
        }
        this.counts.items = this.itemsById.size;
      }
      if (fs.existsSync(charsFile)) {
        for (const c of JSON.parse(fs.readFileSync(charsFile, 'utf8')) as GameCharacter[]) {
          this.charsById.set(c.id, c);
          this.charsByCode.set(c.code, c);
          if (c.isMonster) this.monstersByCode.set(c.code, c);
          if (c.isNpc) this.npcsByCode.set(c.code, c);
        }
        this.counts.characters = this.charsById.size;
        this.counts.monsters = this.monstersByCode.size;
        this.counts.npcs = this.npcsByCode.size;
      }
      if (fs.existsSync(skillsFile)) {
        for (const s of JSON.parse(fs.readFileSync(skillsFile, 'utf8')) as GameSkill[]) {
          this.skillsById.set(s.id, s);
          this.skillsByCode.set(s.code, s);
        }
        this.counts.skills = this.skillsById.size;
      }

      // Données officielles extraites (2026-10): priorité sur characters/skills.json
      const officialMonstersFile = path.join(dataDir, 'monsters_official.json');
      if (fs.existsSync(officialMonstersFile)) {
        for (const m of JSON.parse(fs.readFileSync(officialMonstersFile, 'utf8')) as OfficialMonster[]) {
          this.officialMonstersByCode.set(m.code, m);
          this.officialMonstersByStem.set(m.stem, m);
        }
        this.counts.officialMonsters = this.officialMonstersByCode.size;
      }
      const officialSkillsFile = path.join(dataDir, 'skills_official.json');
      if (fs.existsSync(officialSkillsFile)) {
        for (const s of JSON.parse(fs.readFileSync(officialSkillsFile, 'utf8')) as OfficialSkill[]) {
          this.officialSkillsByCode.set(s.code, s);
          const list = this.officialSkillsBySeries.get(s.series);
          if (list) list.push(s);
          else this.officialSkillsBySeries.set(s.series, [s]);
        }
        this.counts.officialSkills = this.officialSkillsByCode.size;
      }

      this.loaded = true;
      console.log(
        `[GameData] Chargé: ${this.counts.items} items, ${this.counts.monsters} monstres, ` +
        `${this.counts.npcs} NPC, ${this.counts.skills} skills` +
        (this.counts.officialMonsters
          ? ` | OFFICIEL: ${this.counts.officialMonsters} monstres (DB serveur), ${this.counts.officialSkills} skills (skilldata serveur)`
          : ''),
      );
    } catch (e) {
      console.warn('[GameData] Échec de chargement des données importées:', e);
    }
    return this.loaded;
  }

  /** Stats de monstre par code (ex: 'MOB_CH_MANGNYANG'), avec valeurs par défaut sûres.
   *  Priorité aux stats OFFICIELLES (DB serveur vSRO, 2026-10) puis fallback client. */
  getMonsterTemplate(code: string): {
    name: string; level: number; hp: number; maxHp: number;
    mp: number; maxMp: number;
    attackPower: { min: number; max: number };
    defense: number; magicalDefense: number; exp: number;
    rarity: number; parry: number;
    bsrPath: string | null;
  } | null {
    const key = code.toUpperCase();
    const official = this.officialMonstersByCode.get(key) ?? this.officialMonstersByStem.get(code.toLowerCase());
    if (official) {
      // Défense: la DB serveur n'expose pas de colonne défense plate — courbe
      // documentée défense = 2 + niveau×2 (KB 28, session phase 3)
      const defCurve = 2 + official.level * 2;
      return {
        name: official.code,
        level: official.level,
        hp: official.hp || 24,
        maxHp: official.hp || 24,
        mp: official.mp,
        maxMp: official.mp,
        attackPower: { min: official.atkMin || 1, max: Math.max(official.atkMax, official.atkMin || 1) },
        defense: defCurve,
        magicalDefense: defCurve,
        exp: official.exp,
        rarity: official.rarity,
        parry: official.parry,
        bsrPath: null,
      };
    }
    const c = this.monstersByCode.get(key);
    if (!c || c.level == null) return null;
    const hp = c.hp ?? 24;
    return {
      name: c.name ?? c.code,
      level: c.level,
      hp,
      maxHp: hp,
      mp: 0,
      maxMp: 0,
      attackPower: { min: c.phyAtkMin ?? 1, max: c.phyAtkMax ?? c.phyAtkMin ?? 1 },
      defense: c.phyDefense ?? 1,
      magicalDefense: c.magDefense ?? 1,
      exp: c.expReward ?? 0,
      rarity: 0,
      parry: 0,
      bsrPath: c.bsrPath,
    };
  }

  /** Monstre officiel par code OU par stem (clé modelId serveur, ex: 'tigerwoman'). */
  getOfficialMonster(codeOrStem: string): OfficialMonster | null {
    return (
      this.officialMonstersByCode.get(codeOrStem.toUpperCase()) ??
      this.officialMonstersByStem.get(codeOrStem.toLowerCase()) ??
      null
    );
  }

  /** Skill officiel (valeurs skilldata serveur) par code, ex: 'SKILL_CH_SWORD_SMASH_A_01'. */
  getOfficialSkill(code: string): OfficialSkill | null {
    return this.officialSkillsByCode.get(code.toUpperCase()) ?? null;
  }

  /** Tous les niveaux d'une série officielle (ex: 'SKILL_CH_SWORD_SMASH_A'). */
  getOfficialSkillSeries(series: string): OfficialSkill[] {
    return this.officialSkillsBySeries.get(series.toUpperCase()) ?? [];
  }

  /** Item par code (ex: 'ITEM_ETC_HP_POTION_01'). */
  getItem(code: string): GameItem | null {
    return this.itemsByCode.get(code.toUpperCase()) ?? null;
  }

  /** Skill par code (ex: 'SKILL_CH_SPEAR_CHAIN_A_1'). */
  getSkill(code: string): GameSkill | null {
    return this.skillsByCode.get(code.toUpperCase()) ?? null;
  }
}
