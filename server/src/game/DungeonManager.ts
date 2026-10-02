// ============================================
// SRObro - DungeonManager (Phase G V2)
// Donjons instanciés officiels: FGW Togui (35-70, grades 1★-4★) et
// Qin-Shi Tomb B6 (105, Medusa 183 535 199 HP).
// Données: docs/SRO_KNOWLEDGE_BASE/29_FORGOTTEN_WORLD.md + 15_UNIQUE_BOSSES.md
// - FGW: instance 2 h, cooldown 3 h, grades = type de monstres + limite
//   party 4/4/8/8, talismans (8 par collection, récompenses D8 Sun→D11 Nova)
// - Qin-Shi B6: 4 uniques 95 ×4 puis Medusa (BeakYung/MOB_TQ_WHITESNAKE)
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

/** Talismans officiels FGW (KB 29: 8 par collection, raretés). */
const FGW_TALISMANS = [
  'Talisman de Force', 'Talisman de Sagesse', 'Talisman de Courage',
  'Talisman de Vigueur', 'Talisman d\'Esprit', 'Talisman de Noblesse',
  'Talisman de Vitesse', 'Talisman de Fortune',
];

interface ActiveDungeon {
  id: string;
  kind: 'fgw_togui' | 'qinshi_b6';
  tier: string;
  characterId: string;
  center: { x: number; y: number; z: number };
  spawnedMonsterIds: Set<string>;
  enteredAt: number;
  talismans: string[];
  completed: boolean;
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
  async enter(characterId: string, kind: 'fgw_togui' | 'qinshi_b6', tier: string, center: { x: number; y?: number; z: number }): Promise<{ id: string; trashCount: number; bossCode: string; note: string }> {
    const cd = this.cooldowns.get(characterId + ':' + kind) ?? 0;
    if (Date.now() < cd) {
      throw new Error(`Donjon en cooldown (${Math.ceil((cd - Date.now()) / 60000)} min restantes)`);
    }
    if (kind === 'fgw_togui' && !TOGUI_TIERS[tier]) {
      throw new Error('Tranche FGW invalide (a1|a2|b1)');
    }

    const id = `dg_${kind}_${Date.now().toString(36)}`;
    const conf = kind === 'fgw_togui' ? TOGUI_TIERS[tier] : null;
    const bossCode = kind === 'fgw_togui' ? conf!.elder : 'MOB_TQ_WHITESNAKE';
    const dungeon: ActiveDungeon = {
      id, kind, tier, characterId,
      center: { x: center.x, y: center.y ?? 0, z: center.z },
      spawnedMonsterIds: new Set(),
      enteredAt: Date.now(),
      talismans: [],
      completed: false,
    };
    this.active.set(id, dungeon);

    // Peuplement: trash (B) + boss unique (Elder/Medusa) autour du centre
    const pos = { x: center.x, y: center.y ?? 0, z: center.z };
    // 7 trash + boss = 8 kills → 8 talismans (collection complète, KB 29)
    const trashCodes = conf?.trash ?? [];
    let trashSpawned = 0;
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

    logger.info(`Donjon ${id} ouvert par ${characterId} (${kind}/${tier}) — ${trashSpawned} trash + boss ${bossCode}`);
    return {
      id, trashCount: trashSpawned, bossCode,
      note: kind === 'fgw_togui'
        ? `FGW Togui ${tier.toUpperCase()} (${conf!.min}-${conf!.max}): tuez l'Elder Earth Ghost (${conf!.elder})`
        : 'Qin-Shi B6: Medusa 183,5M HP — pétrification 100%, party 8 recommandée',
    };
  }

  /** Mort d'un monstre: crédite talismans/complétion au donjon propriétaire. */
  async onMonsterKilled(monsterId: string, _killerId: string): Promise<{ talisman?: string; completed?: boolean; reward?: string } | null> {
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
      return null;
    }
    return null;
  }

  /** État d'un donjon (HUD/test). */
  getState(id: string): { talismans: string[]; remaining: number; kind: string } | null {
    const dg = this.active.get(id);
    if (!dg) return null;
    return { talismans: [...dg.talismans], remaining: dg.spawnedMonsterIds.size, kind: dg.kind };
  }
}

export const DUNGEON_TIERS = TOGUI_TIERS;
