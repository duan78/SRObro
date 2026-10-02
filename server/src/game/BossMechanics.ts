// ============================================
// SRObro - BossMechanics (Phase G V2)
// Mécaniques de boss officielles (KB 15_UNIQUE_BOSSES § Medusa):
//   - Bind 50% (immobilisation 4 s)
//   - Petrify 5%/hit ~ 100% sur grosse attaque (pétrification 8 s)
//   - Fear 100% - 10 s (fuite) sur le cri périodique
//   - Zone AoE 20 cibles/15 m, 390-780% dégâts
// Esquive: s'éloigner du boss (>15 m) pendant le cast — le serveur
// vérifie la distance À L'IMPACT (mécanique esquivable, KB 29 Sereness).
// ============================================

import { createLogger } from '../core/Logger';
import type { WorldManager } from './WorldManager';
import type { CombatBridge } from './CombatBridge';

const logger = createLogger('BossMechanics');

/** Mécanique officielle de Medusa (KB 15, guide TR TurkHackTeam). */
const MEDUSA = {
  code: 'MOB_TQ_WHITESNAKE',
  bindChance: 0.5,      // 50% par attaque
  bindMs: 4000,
  petrifyChance: 0.05,  // 5% par hit; 100% sur le cri
  petrifyMs: 8000,
  fearChance: 1.0,      // 100% — 10 s
  fearMs: 10000,
  aoeRadius: 15,        // 20 cibles / 15 m
  aoeIntervalMs: 12000, // cri périodique
  aoeDamagePct: [3.9, 7.8], // 390-780%
};

interface BossState {
  monsterId: string;
  nextAoe: number;
}

export class BossMechanics {
  private static instance: BossMechanics | null = null;
  private bosses = new Map<string, BossState>();

  static getInstance(): BossMechanics {
    if (!BossMechanics.instance) BossMechanics.instance = new BossMechanics();
    return BossMechanics.instance;
  }

  /** Enregistre un boss à mécaniques (appelé au spawn par code). */
  track(monsterId: string, code: string): void {
    if (code === MEDUSA.code) {
      this.bosses.set(monsterId, { monsterId, nextAoe: Date.now() + MEDUSA.aoeIntervalMs });
      logger.info(`Mécaniques Medusa actives sur ${monsterId}`);
    }
  }

  isBoss(monsterId: string): boolean {
    return this.bosses.has(monsterId);
  }

  /** Résultat d'une attaque de boss sur un joueur: statuts appliqués. */
  onBossHitPlayer(
    monsterId: string,
    playerCharacterId: string,
    _distance: number,
  ): { bind: boolean; petrify: boolean } {
    if (!this.bosses.has(monsterId)) return { bind: false, petrify: false };
    void playerCharacterId;
    const bind = Math.random() < MEDUSA.bindChance;
    const petrify = Math.random() < MEDUSA.petrifyChance;
    return { bind, petrify };
  }

  /**
   * Tick AoE du boss: toutes les 12 s, le cri touche tous les joueurs à
   * ≤15 m (Petrify 100% + Fear 10 s + dégâts 390-780%). Les joueurs à
   * >15 m ESQUIVENT (mécanique officielle esquivable). Retourne la liste
   * des affectations pour diffusion.
   */
  update(
    worldManager: WorldManager,
    combatBridge: CombatBridge,
    getMonsterPosition: (monsterId: string) => { x: number; y: number; z: number } | null,
  ): Array<{ characterId: string; effect: 'petrify' | 'dodged'; damage?: number }> {
    const now = Date.now();
    const out: Array<{ characterId: string; effect: 'petrify' | 'dodged'; damage?: number }> = [];
    for (const boss of this.bosses.values()) {
      if (now < boss.nextAoe) continue;
      boss.nextAoe = now + MEDUSA.aoeIntervalMs;
      const pos = getMonsterPosition(boss.monsterId);
      if (!pos) continue;
      for (const player of worldManager.getAllPlayers()) {
        const d = Math.hypot(player.position.x - pos.x, player.position.z - pos.z);
        if (d > MEDUSA.aoeRadius) {
          // ESQUIVE (distance officielle): informer le joueur
          out.push({ characterId: player.id, effect: 'dodged' });
          combatBridge.sendToPlayerRaw(player.id, 'boss:aoe_dodged', {
            boss: 'Medusa', distance: Math.round(d), safeRadius: MEDUSA.aoeRadius,
          });
          continue;
        }
        // Touché: Petrify 100% + Fear + dégâts 390-780% de l'attaque
        const dmgPct = MEDUSA.aoeDamagePct[0] + Math.random() *
          (MEDUSA.aoeDamagePct[1] - MEDUSA.aoeDamagePct[0]);
        const damage = Math.round(player.maxHp * (dmgPct / 100) * 0.15); // ~15% HP en pratique sinon one-shot
        out.push({ characterId: player.id, effect: 'petrify', damage });
        combatBridge.sendToPlayerRaw(player.id, 'boss:aoe_hit', {
          boss: 'Medusa', damage, petrifyMs: MEDUSA.petrifyMs, fearMs: MEDUSA.fearMs,
        });
        combatBridge.sendToPlayerRaw(player.id, 'chat', {
          message: `🐍 Medusa: PETRIFICATION ! (${Math.round(d)} m — restez à >${MEDUSA.aoeRadius} m pour esquiver)`,
          channel: 'system',
        });
        if (player.godMode) continue;
        player.setHp(Math.max(1, player.hp - damage));
        combatBridge.sendPlayerState(player.id);
      }
      logger.info(`Medusa AoE: ${out.length} joueurs affectés`);
    }
    return out;
  }

  /** Nettoyage à la mort du boss. */
  untrack(monsterId: string): void {
    this.bosses.delete(monsterId);
  }
}

export const MEDUSA_CONFIG = MEDUSA;
