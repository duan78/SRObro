// ============================================
// SRObro - DungeonManager (Phase G V2 + Phase I)
// Donjons instanciés officiels: FGW Togui (35-70, grades 1★-4★),
// Qin-Shi Tomb B6 (105, Medusa 183 535 199 HP) et Job Temple / Pharaoh
// Tomb (Égypte, 100+: Selket→Neith→Anubis→Haroeris→Seth→Apis/Eris).
// Données: docs/SRO_KNOWLEDGE_BASE/29_FORGOTTEN_WORLD.md + 15_UNIQUE_BOSSES.md
// + CITIES_04_ALEXANDRIA.md §Job Temple.
// - FGW: instance 2 h, cooldown 3 h, grades = type de monstres + limite
//   party 4/4/8/8, talismans (8 par collection, récompenses D8 Sun→D11 Nova)
// - Qin-Shi B6: 4 uniques 95 ×4 puis Medusa (BeakYung/MOB_TQ_WHITESNAKE)
// - Job Temple: entrée niveau 100+ en costume de métier (KB CITIES_04:236),
//   ordre imposé Haroeris avant Seth (KB 15:463), 3 difficultés, HP DB vSRO.
// ============================================

import { createLogger } from '../core/Logger';
import { globalSpawnManager } from '../ai/SpawnManager';
import { ensureMonsterInDb } from '../admin/bestiary';

const logger = createLogger('DungeonManager');

/** FGW Togui: tranches de niveaux officielles (KB 29). */
const TOGUI_TIERS: Record<string, { min: number; max: number; elder: string; trash: string[] }> = {
  a1: { min: 35, max: 50, elder: 'MOB_GOD_TOGUI_TOGUIELDER_A1', trash: ['MOB_GOD_TOGUI_TOGUI_A1', 'MOB_GOD_TOGUI_TOGUICRAZY_A1'] },
  a2: { min: 51, max: 60, elder: 'MOB_GOD_TOGUI_TOGUIELDER_A2', trash: ['MOB_GOD_TOGUI_TOGUIMAGIC_A2', 'MOB_GOD_TOGUI_TOGUISTRONG_A2'] },
  b1: { min: 61, max: 70, elder: 'MOB_GOD_TOGUI_TOGUIELDER_B1', trash: ['MOB_GOD_TOGUI_TOGUIBOOM_B1', 'MOB_GOD_TOGUI_TOGUI_B1'] },
};

/**
 * Job Temple (Pharaoh Tomb) — difficultés et paliers officiels (KB 15:438-463).
 * Chaque palier se débloque à la mort du précédent; Seth exige Haroeris mort
 * («You must kill Haroeris before you can move onto Seth»).
 * HP officiels DB vSRO: Selket 57,7M · Neith 59,3M · Anubis 94M ·
 * Haroeris 244,9M · Seth 236,4M · Apis 21,1M (conditionnel Isis+Anubis) ·
 * Eris 87,8M.
 */
const JOB_TEMPLE_TIERS: Record<string, {
  minLevel: number;
  stages: string[][];
  trash: string[];
  reward: string;
}> = {
  beginner: {
    minLevel: 100,
    stages: [['MOB_SD_SELKIS'], ['MOB_SD_NEITH']],
    trash: ['MOB_SD_UNEG', 'MOB_SD_WENEG', 'MOB_SD_DARKSCOUT'],
    reward: 'Seal of Nova 11D (KB CITIES_04:241)',
  },
  intermediate: {
    minLevel: 100,
    stages: [['MOB_SD_SELKIS'], ['MOB_SD_NEITH'], ['MOB_SD_ANUBIS']],
    trash: ['MOB_SD_UNEG', 'MOB_SD_WENEG', 'MOB_SD_DARKKHEPRI', 'MOB_SD_BLOODHYENA'],
    reward: 'Seal of Nova 11D + pierre Immortal (KB CITIES_04:241)',
  },
  advanced: {
    minLevel: 100,
    stages: [
      ['MOB_SD_SELKIS'], ['MOB_SD_NEITH'], ['MOB_SD_ANUBIS'],
      ['MOB_SD_HAROERIS'], ['MOB_SD_SETH'], ['MOB_SD_APIS', 'MOB_SD_ERIS'],
    ],
    trash: ['MOB_SD_UNEG', 'MOB_SD_WENEG', 'MOB_SD_DARKKHEPRI', 'MOB_SD_BLOODHYENA', 'MOB_SD_URAUES'],
    reward: 'Set Egypt 11D + Gold/Silver Coin du temple (KB CITIES_04:241)',
  },
};

/** Talismans officiels FGW (KB 29: 8 par collection, raretés). */
const FGW_TALISMANS = [
  'Talisman de Force', 'Talisman de Sagesse', 'Talisman de Courage',
  'Talisman de Vigueur', 'Talisman d\'Esprit', 'Talisman de Noblesse',
  'Talisman de Vitesse', 'Talisman de Fortune',
];

interface ActiveDungeon {
  id: string;
  kind: 'fgw_togui' | 'qinshi_b6' | 'job_temple';
  tier: string;
  characterId: string;
  center: { x: number; y: number; z: number };
  spawnedMonsterIds: Set<string>;
  enteredAt: number;
  talismans: string[];
  completed: boolean;
  /** Job Temple: index du palier courant (les suivants se débloquent). */
  stage?: number;
}

export class DungeonManager {
  private static instance: DungeonManager | null = null;
  private active = new Map<string, ActiveDungeon>();
  private cooldowns = new Map<string, number>(); // characterId → ts de fin
  private readonly COOLDOWN_MS = 3 * 3600 * 1000; // FGW officiel: 3 h

  static getInstance(): DungeonManager {
    if (!DungeonManager.instance) DungeonManager.instance = new DungeonManager();
    return DungeonManager.instance;
  }

  /** Ouvre un donjon pour un personnage (retourne l'id d'instance). */
  async enter(
    characterId: string,
    kind: 'fgw_togui' | 'qinshi_b6' | 'job_temple',
    tier: string,
    center: { x: number; y?: number; z: number },
    opts?: { level?: number; jobType?: string | null },
  ): Promise<{ id: string; trashCount: number; bossCode: string; note: string }> {
    const cd = this.cooldowns.get(characterId + ':' + kind) ?? 0;
    if (Date.now() < cd) {
      throw new Error(`Donjon en cooldown (${Math.ceil((cd - Date.now()) / 60000)} min restantes)`);
    }
    if (kind === 'fgw_togui' && !TOGUI_TIERS[tier]) {
      throw new Error('Tranche FGW invalide (a1|a2|b1)');
    }
    if (kind === 'job_temple') {
      const jt = JOB_TEMPLE_TIERS[tier];
      if (!jt) throw new Error('Difficulté Job Temple invalide (beginner|intermediate|advanced)');
      // Entrée officielle: niveau 100+ et costume de métier obligatoire
      // (KB CITIES_04:236-237 «you cannot enter without wearing it»)
      if ((opts?.level ?? 0) < jt.minLevel) {
        throw new Error(`Job Temple: niveau ${jt.minLevel} requis`);
      }
      if (!opts?.jobType || opts.jobType === 'none') {
        throw new Error('Job Temple: costume de métier obligatoire (Trader/Hunter ou Thief)');
      }
    }

    const id = `dg_${kind}_${Date.now().toString(36)}`;
    const conf = kind === 'fgw_togui' ? TOGUI_TIERS[tier] : null;
    const bossCode = kind === 'fgw_togui'
      ? conf!.elder
      : kind === 'qinshi_b6'
        ? 'MOB_TQ_WHITESNAKE'
        : JOB_TEMPLE_TIERS[tier].stages[0][0];
    const dungeon: ActiveDungeon = {
      id, kind, tier, characterId,
      center: { x: center.x, y: center.y ?? 0, z: center.z },
      spawnedMonsterIds: new Set(),
      enteredAt: Date.now(),
      talismans: [],
      completed: false,
      stage: 0,
    };
    this.active.set(id, dungeon);

    const pos = { x: center.x, y: center.y ?? 0, z: center.z };
    let trashSpawned = 0;
    let note: string;

    if (kind === 'job_temple') {
      const jt = JOB_TEMPLE_TIERS[tier];
      // Trash du temple (spot de farm SP officiel, KB 15:467) autour du centre
      for (let i = 0; i < 6; i++) {
        const code = jt.trash[i % jt.trash.length];
        const monsterRow = await ensureMonsterInDb(code).catch(() => null);
        if (!monsterRow) continue;
        const angle = (i / 6) * Math.PI * 2;
        const m = await globalSpawnManager.spawnMonsterAt(monsterRow.id, {
          x: pos.x + Math.cos(angle) * 18, y: pos.y, z: pos.z + Math.sin(angle) * 18,
        });
        if (m) { dungeon.spawnedMonsterIds.add(m.id); trashSpawned++; }
      }
      // Premier palier (Selket)
      await this.spawnJobTempleStage(dungeon);
      const first = jt.stages[0][0];
      note = `Job Temple (${tier}) — entrée ${opts?.jobType === 'thief' ? 'Black Eggre (Thief)' : 'Red Eggre (Hunter/Trader)'}: ${jt.stages.length} paliers, ${first === 'MOB_SD_SELKIS' ? 'Selket 57,7M HP' : first} d'abord`;
    } else {
      // Peuplement: trash (B) + boss unique (Elder/Medusa) autour du centre
      // 7 trash + boss = 8 kills → 8 talismans (collection complète, KB 29)
      const trashCodes = conf?.trash ?? [];
      for (let i = 0; i < 7 && trashCodes.length > 0; i++) {
        const code = trashCodes[i % trashCodes.length];
        const monsterRow = await ensureMonsterInDb(code).catch(() => null);
        if (!monsterRow) continue; // trash non référencé: passer (le boss suffit)
        const angle = (i / 7) * Math.PI * 2;
        const m = await globalSpawnManager.spawnMonsterAt(monsterRow.id, {
          x: pos.x + Math.cos(angle) * 15, y: pos.y, z: pos.z + Math.sin(angle) * 15,
        });
        if (m) { dungeon.spawnedMonsterIds.add(m.id); trashSpawned++; }
      }
      const bossRow = await ensureMonsterInDb(bossCode);
      if (!bossRow) throw new Error('Boss du donjon introuvable: ' + bossCode);
      const boss = await globalSpawnManager.spawnMonsterAt(bossRow.id, { x: pos.x + 30, y: pos.y, z: pos.z });
      if (boss) dungeon.spawnedMonsterIds.add(boss.id);
      note = kind === 'fgw_togui'
        ? `FGW Togui ${tier.toUpperCase()} (${conf!.min}-${conf!.max}): tuez l'Elder Earth Ghost (${conf!.elder})`
        : 'Qin-Shi B6: Medusa 183,5M HP — pétrification 100%, party 8 recommandée';
    }

    logger.info(`Donjon ${id} ouvert par ${characterId} (${kind}/${tier}) — ${trashSpawned} trash, palier initial ${dungeon.stage}`);
    return { id, trashCount: trashSpawned, bossCode, note };
  }

  /** Spawn le palier courant du Job Temple (uniques à 30-60 u du centre). */
  private async spawnJobTempleStage(dungeon: ActiveDungeon): Promise<void> {
    const jt = JOB_TEMPLE_TIERS[dungeon.tier];
    const stageIdx = dungeon.stage ?? 0;
    const codes = jt.stages[stageIdx] ?? [];
    for (let i = 0; i < codes.length; i++) {
      const row = await ensureMonsterInDb(codes[i]).catch(() => null);
      if (!row) { logger.warn(`Job Temple: ${codes[i]} introuvable en base`); continue; }
      const m = await globalSpawnManager.spawnMonsterAt(row.id, {
        x: dungeon.center.x + 30 + i * 12,
        y: dungeon.center.y,
        z: dungeon.center.z,
      });
      if (m) dungeon.spawnedMonsterIds.add(m.id);
    }
  }

  /** Mort d'un monstre: crédite talismans/paliers/complétion au donjon. */
  async onMonsterKilled(monsterId: string, _killerId: string): Promise<{ talisman?: string; completed?: boolean; reward?: string; note?: string } | null> {
    for (const dg of this.active.values()) {
      if (!dg.spawnedMonsterIds.has(monsterId)) continue;
      dg.spawnedMonsterIds.delete(monsterId);
      // FGW: chaque kill rapporte un talisman (8 pour la collection)
      if (dg.kind === 'fgw_togui' && dg.talismans.length < 8) {
        const t = FGW_TALISMANS[dg.talismans.length];
        dg.talismans.push(t);
        // Boss mort + 8 talismans = collection complète → récompense officielle
        if (dg.talismans.length === 8 && dg.spawnedMonsterIds.size === 0) {
          dg.completed = true;
          this.cooldowns.set(dg.characterId + ':' + dg.kind, Date.now() + this.COOLDOWN_MS);
          this.active.delete(dg.id);
          return { talisman: t, completed: true, reward: 'Collection complète: D8 Seal of Sun (KB 29)' };
        }
        return { talisman: t };
      }
      // Qin-Shi B6: Medusa morte = complétion
      if (dg.kind === 'qinshi_b6' && dg.spawnedMonsterIds.size === 0) {
        dg.completed = true;
        this.cooldowns.set(dg.characterId + ':' + dg.kind, Date.now() + this.COOLDOWN_MS);
        this.active.delete(dg.id);
        return { completed: true, reward: 'Medusa vaincue: drops 11D+ (KB 15)' };
      }
      // Job Temple: palier suivant quand le palier courant est éliminé
      if (dg.kind === 'job_temple' && dg.spawnedMonsterIds.size === 0) {
        const jt = JOB_TEMPLE_TIERS[dg.tier];
        const nextIdx = (dg.stage ?? 0) + 1;
        if (nextIdx < jt.stages.length) {
          dg.stage = nextIdx;
          await this.spawnJobTempleStage(dg);
          const next = jt.stages[nextIdx][0];
          return { note: `Palier suivant du Job Temple: ${next} (KB 15: ordre imposé)` };
        }
        dg.completed = true;
        this.cooldowns.set(dg.characterId + ':' + dg.kind, Date.now() + this.COOLDOWN_MS);
        this.active.delete(dg.id);
        return { completed: true, reward: jt.reward };
      }
      return null;
    }
    return null;
  }

  /** État d'un donjon (HUD/test). */
  getState(id: string): { talismans: string[]; remaining: number; kind: string; stage?: number } | null {
    const dg = this.active.get(id);
    if (!dg) return null;
    return { talismans: [...dg.talismans], remaining: dg.spawnedMonsterIds.size, kind: dg.kind, stage: dg.stage };
  }
}

export const DUNGEON_TIERS = TOGUI_TIERS;
export const JOB_TEMPLE = JOB_TEMPLE_TIERS;
