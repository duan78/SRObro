// ============================================
// SRObro - Bestiaire officiel (phase 6)
// Les 7 825 monstres de characterdata (data/game/characters.json) servent
// de référentiel: recherche pour la console /admin et création À LA DEMANDE
// de lignes Monster en base (seed partiel de 13 monstres seulement).
// ============================================

import { readFileSync } from 'fs';
import { join } from 'path';
import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';

const logger = createLogger('Bestiaire');

export interface OfficialMonster {
  code: string;
  name: string;
  level: number;
  hp: number;
  expReward: number;
  phyAtkMin: number;
  phyAtkMax: number;
  phyDefense: number;
  magDefense: number;
}

let cache: OfficialMonster[] | null = null;

/** Monstres officiels (chargé une fois, ~6 Mo). */
export function getOfficialMonsters(): OfficialMonster[] {
  if (!cache) {
    type Raw = Record<string, unknown>;
    const raw = JSON.parse(
      readFileSync(join(__dirname, '../../data/game/characters.json'), 'utf8'),
    ) as Raw[];
    cache = raw
      .filter((c) => c.isMonster)
      .map((c) => ({
        code: String(c.code ?? ''),
        name: String(c.name ?? c.objName ?? c.code),
        level: Number(c.level ?? 1),
        hp: Number(c.hp ?? 100),
        expReward: Number(c.expReward ?? 0),
        phyAtkMin: Number(c.phyAtkMin ?? 1),
        phyAtkMax: Number(c.phyAtkMax ?? c.phyAtkMin ?? 1),
        phyDefense: Number(c.phyDefense ?? 0),
        magDefense: Number(c.magDefense ?? 0),
      }));
    logger.info(`Bestiaire officiel chargé: ${cache.length} monstres`);
  }
  return cache;
}

export function searchOfficialMonsters(search: string, page: number, limit: number): {
  total: number; page: number; limit: number; monsters: Array<OfficialMonster & { dbId?: string }>;
} {
  const all = getOfficialMonsters();
  const q = search.trim().toLowerCase();
  const hits = q
    ? all.filter((m) => m.code.toLowerCase().includes(q) || m.name.toLowerCase().includes(q))
    : all;
  return {
    total: hits.length,
    page,
    limit,
    monsters: hits.slice((page - 1) * limit, page * limit),
  };
}

/**
 * Trouve (ou crée) la ligne Monster en base pour un monstre officiel:
 * rend les 7 825 monstres officielles invocables (/spawn, console admin).
 */
export async function ensureMonsterInDb(codeOrName: string): Promise<{ id: string; name: string; level: number } | null> {
  // 1. Déjà en base: correspondance EXACTE d'abord (nom ou modelId insensible
  // à la casse), puis floue — évite de résoudre 'MOB_CH_BANDIT' vers les
  // variantes _CLON/_L2 parasites
  const exact = await prisma.monster.findFirst({
    where: {
      OR: [
        { name: { equals: codeOrName, mode: 'insensitive' } },
        { modelId: { equals: codeOrName, mode: 'insensitive' } },
        { id: { equals: codeOrName.startsWith('mon_') ? codeOrName : `mon_${codeOrName.toLowerCase()}` } },
      ],
    },
  });
  if (exact) return exact;
  const existing = await prisma.monster.findFirst({
    where: {
      OR: [
        { name: { contains: codeOrName, mode: 'insensitive' } },
        { modelId: { contains: codeOrName, mode: 'insensitive' } },
      ],
    },
  });
  if (existing) return existing;

  // 2. Référentiel officiel → création à la volée (codes exacts avant flous,
  //    jamais les clones _CLON)
  const q = codeOrName.toLowerCase();
  const candidates = getOfficialMonsters().filter(
    (m) => !m.code.endsWith('_CLON'),
  );
  const official =
    candidates.find((m) => m.code.toLowerCase() === q) ??
    candidates.find((m) => m.code.toLowerCase().includes(q)) ??
    candidates.find((m) => m.name.includes(codeOrName));

  if (official) {
    const created = await prisma.monster.create({
      data: {
        name: official.code, // code latin identique au référentiel (retrouvable)
        level: official.level,
        hp: official.hp,
        mp: 0,
        attackPowerMin: official.phyAtkMin,
        attackPowerMax: official.phyAtkMax,
        // Défense affichée par characterdata (armor) + formule serveur 2+lvl×2
        defense: Math.max(2 + official.level * 2, official.phyDefense),
        magicalDefense: official.magDefense,
        exp: BigInt(Math.round(official.expReward)),
        sp: BigInt(Math.round(official.expReward / 8)),
        aggroRange: 15,
        // MOB_CH_MANGNYANG → mangnyang (stem du manifest client quand il existe,
        // sinon le client affichera le proxy cube)
        modelId: official.code.toLowerCase().replace(/^mob_(ch|eu|rm)_/, ''),
      },
    });
    logger.info(`Monstre officiel créé en base: ${official.code} (niv. ${official.level})`);
    return created;
  }

  // 3. Référentiel DB SERVEUR vSRO (monsters_official.json, Phase A V2):
  // couvre les codes absents de characterdata (ex. MOB_CI_MANGNYANG) avec
  // les stats exactes (HP/EXP/atk officiels de la DB vSRO)
  {
    const { GameDataService } = await import('../data/GameDataService.js');
    const off = GameDataService.getInstance().getOfficialMonster(codeOrName);
    if (off) {
      const created = await prisma.monster.create({
        data: {
          name: off.code,
          level: off.level,
          hp: off.hp,
          mp: off.mp,
          attackPowerMin: off.atkMin,
          attackPowerMax: Math.max(off.atkMax, off.atkMin),
          defense: 2 + off.level * 2,
          magicalDefense: 2 + off.level * 2,
          exp: BigInt(off.exp),
          sp: BigInt(Math.max(1, Math.round(off.exp * 0.1))),
          aggroRange: off.stem === 'mangnyang' || off.stem === 'yeoha' ? 0 : 15,
          modelId: off.stem,
          isUnique: off.rarity === 3 || off.rarity === 8,
        },
      });
      logger.info(`Monstre officiel (DB serveur) créé: ${off.code} (niv. ${off.level})`);
      return created;
    }
  }
  return null;
}
