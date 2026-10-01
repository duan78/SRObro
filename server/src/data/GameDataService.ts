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

  public loaded = false;
  public counts = { items: 0, characters: 0, monsters: 0, npcs: 0, skills: 0 };

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

      this.loaded = true;
      console.log(
        `[GameData] Chargé: ${this.counts.items} items, ${this.counts.monsters} monstres, ` +
        `${this.counts.npcs} NPC, ${this.counts.skills} skills`,
      );
    } catch (e) {
      console.warn('[GameData] Échec de chargement des données importées:', e);
    }
    return this.loaded;
  }

  /** Stats de monstre par code (ex: 'MOB_CH_MANGNYANG'), avec valeurs par défaut sûres. */
  getMonsterTemplate(code: string): {
    name: string; level: number; hp: number; maxHp: number;
    attackPower: { min: number; max: number };
    defense: number; magicalDefense: number; exp: number;
    bsrPath: string | null;
  } | null {
    const c = this.monstersByCode.get(code.toUpperCase());
    if (!c || c.level == null) return null;
    const hp = c.hp ?? 24;
    return {
      name: c.name ?? c.code,
      level: c.level,
      hp,
      maxHp: hp,
      attackPower: { min: c.phyAtkMin ?? 1, max: c.phyAtkMax ?? c.phyAtkMin ?? 1 },
      defense: c.phyDefense ?? 1,
      magicalDefense: c.magDefense ?? 1,
      exp: c.expReward ?? 0,
      bsrPath: c.bsrPath,
    };
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
