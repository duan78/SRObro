// ============================================
// SRObro - PvP Combat Manager
// Handles player vs player combat logic
// ============================================

import { PrismaClient } from '@prisma/client';
import { PKManager } from './PKManager';

export interface PvPRequest {
  requesterId: string;
  targetId: string;
  requestedAt: Date;
  expiresAt: Date;
}

export interface PvPMatch {
  id: string;
  player1Id: string;
  player2Id: string;
  startedAt: Date;
  winnerId?: string;
  endedAt?: Date;
}

export interface PvPDeathResult {
  victimId: string;
  killerId: string;
  wasSelfDefense: boolean;
  pkPointsGained: number;
  droppedItems?: string[];
}

/**
 * PvPManager - Manages PvP combat
 *
 * Silkroad Online PvP Rules:
 * - Players can request PvP duel (mutual combat, no penalties)
 * - PK (Player Killing) gives PK points and murderer status
 * - Self-defense kills (victim attacked first) = no PK points
 * - Guards attack murderers on sight
 * - Job PvP (Trader/Thief/Hunter) has separate rules
 */
export class PvPManager {
  private prisma: PrismaClient;
  private pkManager: PKManager;

  // Active PvP requests (expires after 60 seconds)
  private pvpRequests: Map<string, PvPRequest> = new Map();

  // Active PvP matches
  private activeMatches: Map<string, PvPMatch> = new Map();

  // Track who initiated combat (for self-defense)
  private combatInitiators: Map<string, string> = new Map(); // victim -> attacker

  constructor(prisma: PrismaClient, pkManager: PKManager) {
    this.prisma = prisma;
    this.pkManager = pkManager;
  }

  /**
   * Request a PvP duel
   */
  async requestPvPDuel(requesterId: string, targetId: string): Promise<void> {
    // Check if either player is already in a match
    if (this.isInMatch(requesterId) || this.isInMatch(targetId)) {
      throw new Error('One or both players are already in a PvP match');
    }

    // Create request (expires in 60 seconds)
    const requestId = `${requesterId}_${targetId}`;
    const request: PvPRequest = {
      requesterId,
      targetId,
      requestedAt: new Date(),
      expiresAt: new Date(Date.now() + 60000) // 60 seconds
    };

    this.pvpRequests.set(requestId, request);

    // Auto-cleanup after expiration
    setTimeout(() => {
      this.pvpRequests.delete(requestId);
    }, 60000);
  }

  /**
   * Accept a PvP duel request
   */
  async acceptPvPDuel(requesterId: string, targetId: string): Promise<PvPMatch> {
    const requestId = `${requesterId}_${targetId}`;
    const request = this.pvpRequests.get(requestId);

    if (!request) {
      throw new Error('No PvP request found');
    }

    if (request.expiresAt < new Date()) {
      this.pvpRequests.delete(requestId);
      throw new Error('PvP request has expired');
    }

    // Create the match
    const match: PvPMatch = {
      id: `pvp_${Date.now()}_${requesterId}_${targetId}`,
      player1Id: requesterId,
      player2Id: targetId,
      startedAt: new Date()
    };

    this.activeMatches.set(match.id, match);
    this.pvpRequests.delete(requestId);

    return match;
  }

  /**
   * End a PvP match
   */
  async endPvPMatch(matchId: string, winnerId: string): Promise<void> {
    const match = this.activeMatches.get(matchId);
    if (!match) {
      throw new Error('Match not found');
    }

    match.winnerId = winnerId;
    match.endedAt = new Date();

    // Remove from active matches after a delay
    setTimeout(() => {
      this.activeMatches.delete(matchId);
    }, 5000);
  }

  /**
   * Handle player damage to another player (track for self-defense)
   */
  recordAttack(attackerId: string, victimId: string): void {
    this.combatInitiators.set(victimId, attackerId);
  }

  /**
   * Handle player death in PvP
   */
  async handlePvPDeath(
    victimId: string,
    killerId: string
  ): Promise<PvPDeathResult> {
    // Self-defense: le tueur s'est défendu si la VICTIME l'avait attaqué
    // en premier (la map donne, pour un joueur, qui l'a attaqué)
    const wasSelfDefense = this.combatInitiators.get(killerId) === victimId;

    // Nettoyage des traces de combat des deux côtés
    this.combatInitiators.delete(victimId);
    this.combatInitiators.delete(killerId);

    // Handle PK points
    const killResult = await this.pkManager.handlePlayerKill(
      killerId,
      victimId,
      wasSelfDefense
    );

    // Handle PK death (drop items if murderer) — c'est la VICTIME qui meurt
    // et droppe, pas le tueur (bug d'origine inversé)
    const deathResult = await this.pkManager.handlePKDeath(victimId);

    return {
      victimId,
      killerId,
      wasSelfDefense,
      pkPointsGained: killResult.pointsGained,
      droppedItems: deathResult.droppedItems
    };
  }

  /**
   * Handle Job System PvP (different rules)
   */
  async handleJobPvPDeath(
    victimId: string,
    killerId: string,
    victimJob: string,
    killerJob: string
  ): Promise<{
    expGained: number;
    jobExpGained: number;
    specialRewards?: any;
  }> {
    // Job PvP rules:
    // - Trader vs Thief: Thief gets 30% of goods value
    // - Hunter vs Thief: Hunter gets XP bonus
    // - No PK points for job PvP

    let expGained = 0;
    let jobExpGained = 0;

    const victim = await this.prisma.character.findUnique({
      where: { id: victimId }
    });

    if (!victim) {
      throw new Error('Victim not found');
    }

    const baseExp = 1000 * victim.level;

    switch (killerJob) {
      case 'thief':
        if (victimJob === 'trader') {
          // Thief killing trader - get goods value
          expGained = baseExp * 2;
          jobExpGained = 500 * victim.level;
        }
        break;

      case 'hunter':
        if (victimJob === 'thief') {
          // Hunter killing thief - XP bonus
          expGained = baseExp * 3;
          jobExpGained = 800 * victim.level;
        }
        break;

      case 'trader':
        if (victimJob === 'thief') {
          // Trader killing thief - defense bonus
          expGained = baseExp * 1.5;
          jobExpGained = 300 * victim.level;
        }
        break;
    }

    // Award exp to killer
    if (expGained > 0) {
      await this.prisma.character.update({
        where: { id: killerId },
        data: {
          exp: { increment: BigInt(expGained) }
        }
      });
    }

    return {
      expGained,
      jobExpGained
    };
  }

  /**
   * Check if a player can attack another ( PvP checks)
   */
  async canAttack(attackerId: string, targetId: string): Promise<{
    canAttack: boolean;
    reason?: string;
  }> {
    // Get both characters
    const [attacker, target] = await Promise.all([
      this.prisma.character.findUnique({ where: { id: attackerId } }),
      this.prisma.character.findUnique({ where: { id: targetId } })
    ]);

    if (!attacker || !target) {
      return { canAttack: false, reason: 'Character not found' };
    }

    // Can't attack yourself
    if (attackerId === targetId) {
      return { canAttack: false, reason: 'Cannot attack yourself' };
    }

    // Check if in safe zone (town)
    // This would require zone checking - implement as needed
    // if (this.isInSafeZone(target)) {
    //   return { canAttack: false, reason: 'Target is in safe zone' };
    // }

    // Party members can't attack each other
    const partyMember = await this.prisma.partyMember.findFirst({
      where: {
        characterId: targetId,
        party: {
          members: {
            some: { characterId: attackerId }
          }
        }
      }
    });

    if (partyMember) {
      return { canAttack: false, reason: 'Cannot attack party member' };
    }

    // Guild members can't attack each other (unless guild war)
    const guildMember = await this.prisma.guildMember.findFirst({
      where: {
        characterId: targetId,
        guild: {
          members: {
            some: { characterId: attackerId }
          }
        }
      }
    });

    if (guildMember) {
      return { canAttack: false, reason: 'Cannot attack guild member' };
    }

    return { canAttack: true };
  }

  /**
   * Check if player is in an active PvP match
   */
  isInMatch(playerId: string): boolean {
    for (const match of this.activeMatches.values()) {
      if (match.player1Id === playerId || match.player2Id === playerId) {
        if (!match.endedAt) return true;
      }
    }
    return false;
  }

  /**
   * Get active PvP match for a player
   */
  getActiveMatch(playerId: string): PvPMatch | undefined {
    for (const match of this.activeMatches.values()) {
      if (match.player1Id === playerId || match.player2Id === playerId) {
        if (!match.endedAt) return match;
      }
    }
    return undefined;
  }

  /**
   * Get pending PvP requests for a player
   */
  getPendingRequests(playerId: string): PvPRequest[] {
    const requests: PvPRequest[] = [];

    for (const request of this.pvpRequests.values()) {
      if (request.targetId === playerId && request.expiresAt > new Date()) {
        requests.push(request);
      }
    }

    return requests;
  }

  /**
   * Cancel a PvP request
   */
  cancelRequest(requesterId: string, targetId: string): void {
    const requestId = `${requesterId}_${targetId}`;
    this.pvpRequests.delete(requestId);
  }

  /**
   * Forfeit a PvP match
   */
  forfeitMatch(playerId: string): void {
    const match = this.getActiveMatch(playerId);
    if (!match) {
      throw new Error('No active match found');
    }

    const winnerId = match.player1Id === playerId ? match.player2Id : match.player1Id;
    this.endPvPMatch(match.id, winnerId);
  }
}

/** Singleton serveur (Phase E V2: branché sur les morts PvP). */
import { prisma as prismaDefault } from '../database/prisma';
import { PKManager as PKManagerCtor } from './PKManager';

/** Singleton serveur (Phase E V2: branché sur les morts PvP). */
export const globalPvPManager = new PvPManager(prismaDefault, new PKManagerCtor(prismaDefault));
