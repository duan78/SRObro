// ============================================
// SRObro - GuildWarManager (phase D V3)
// Guerre de guilde officielle (KB 17): hostilité DÉCLARÉE par le leader →
// PvP entre membres SANS murder (pas de PK points), score en kills,
// fin négociée (capitulation) ou expiration.
// ============================================
import { createLogger } from '../core/Logger';
import { prisma } from '../database/prisma';

const logger = createLogger('GuildWar');

export interface ActiveWar {
  id: string;
  attackerId: string; // guildId déclarant
  defenderId: string;
  scores: Record<string, number>; // guildId → kills
  startedAt: number;
  endsAt: number;
}

/** Durée par défaut d'une guerre déclarée (KB 17: guerres temporaires). */
export const GUILD_WAR_DURATION_MS = 30 * 60 * 1000;

export class GuildWarManager {
  private static instance: GuildWarManager | null = null;
  private wars = new Map<string, ActiveWar>(); // id
  private guildWar = new Map<string, string>(); // guildId → warId

  static getInstance(): GuildWarManager {
    if (!GuildWarManager.instance) GuildWarManager.instance = new GuildWarManager();
    return GuildWarManager.instance;
  }

  /** Déclarer une hostilité (leader de la guilde attaquante uniquement). */
  async declareWar(attackerGuildId: string, defenderGuildId: string, declaredByCharacterId: string): Promise<ActiveWar> {
    if (attackerGuildId === defenderGuildId) throw new Error('Impossible de se déclarer la guerre à soi-même');
    const member = await prisma.guildMember.findUnique({ where: { characterId: declaredByCharacterId } });
    if (!member || member.guildId !== attackerGuildId || member.rank !== 'leader') {
      throw new Error('Seul le leader peut déclarer une guerre');
    }
    if (this.guildWar.has(attackerGuildId) || this.guildWar.has(defenderGuildId)) {
      throw new Error('Une des guildes est déjà en guerre');
    }
    const defender = await prisma.guild.findUnique({ where: { id: defenderGuildId } });
    if (!defender) throw new Error('Guilde cible introuvable');

    const war: ActiveWar = {
      id: `war_${Date.now().toString(36)}`,
      attackerId: attackerGuildId,
      defenderId: defenderGuildId,
      scores: { [attackerGuildId]: 0, [defenderGuildId]: 0 },
      startedAt: Date.now(),
      endsAt: Date.now() + GUILD_WAR_DURATION_MS,
    };
    this.wars.set(war.id, war);
    this.guildWar.set(attackerGuildId, war.id);
    this.guildWar.set(defenderGuildId, war.id);
    logger.info(`Guerre déclarée ${attackerGuildId} → ${defenderGuildId} par ${declaredByCharacterId}`);
    return war;
  }

  /** Les deux guildes sont-elles EN GUERRE entre elles ? (PvP sans murder) */
  atWar(guildA: string | null | undefined, guildB: string | null | undefined): boolean {
    if (!guildA || !guildB) return false;
    const warId = this.guildWar.get(guildA);
    if (!warId) return false;
    const war = this.wars.get(warId);
    if (!war || Date.now() > war.endsAt) return false;
    return this.guildWar.get(guildB) === warId;
  }

  /** Kill comptabilisé (appelé par le PvP sur mort joueur). */
  recordKill(killerGuildId: string, victimGuildId: string): { scores: Record<string, number>; ended?: boolean } | null {
    const warId = this.guildWar.get(killerGuildId);
    if (!warId) return null;
    const war = this.wars.get(warId);
    if (!war || Date.now() > war.endsAt) return null;
    if (!this.atWar(killerGuildId, victimGuildId)) return null;
    war.scores[killerGuildId] = (war.scores[killerGuildId] ?? 0) + 1;
    // Fin automatique: 10 kills d'avance OU expiration traitée au check
    const [a, b] = [war.scores[war.attackerId] ?? 0, war.scores[war.defenderId] ?? 0];
    if (Math.abs(a - b) >= 10) {
      this.endWar(war.id, a > b ? war.attackerId : war.defenderId);
      return { scores: war.scores, ended: true };
    }
    return { scores: war.scores };
  }

  /** Capitulation (leader de l'une des guildes) ou expiration. */
  endWar(warId: string, winnerId: string | null): void {
    const war = this.wars.get(warId);
    if (!war) return;
    this.wars.delete(warId);
    this.guildWar.delete(war.attackerId);
    this.guildWar.delete(war.defenderId);
    logger.info(`Guerre ${warId} terminée — vainqueur: ${winnerId ?? 'aucun (expiration)'} — scores ${JSON.stringify(war.scores)}`);
  }

  state(): Array<{ id: string; attackerId: string; defenderId: string; scores: Record<string, number>; endsAt: number }> {
    // Purger les guerres expirées au passage
    for (const w of [...this.wars.values()]) {
      if (Date.now() > w.endsAt) this.endWar(w.id, null);
    }
    return [...this.wars.values()];
  }

  warOfGuild(guildId: string): ActiveWar | null {
    const warId = this.guildWar.get(guildId);
    return warId ? this.wars.get(warId) ?? null : null;
  }
}

export const globalGuildWarManager = GuildWarManager.getInstance();
