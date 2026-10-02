// ============================================
// SRObro - JobHandlers (Phase E V2 — triangle des jobs)
// Handlers Socket.io: job:state / job:change / job:buy_transport /
// job:buy_goods / job:sell_goods / job:steal / job:dismiss_transport.
// Embuscades NPC: voir CombatBridge (tick update, 1 thief par étoile).
// ============================================

import type { Socket } from 'socket.io';
import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';
import { JobManager, computeStarLevel } from '../job/JobManager';
import type { WorldManager } from '../game/WorldManager';
import type { ClientManager } from '../network/ClientManager';
import type { CombatBridge } from '../game/CombatBridge';

const logger = createLogger('JobHandlers');

/** Coût officiel des transports (miroir de TRANSPORT_CONFIGS). */
const TRANSPORT_COST: Record<number, number> = { 1: 2000, 2: 8000, 3: 20000, 4: 60000, 5: 150000 };

export class JobHandlers {
  private jobManager: JobManager;

  constructor(
    private clientManager: ClientManager,
    private worldManager: WorldManager | null,
    private combatBridge: CombatBridge | null,
  ) {
    this.jobManager = new JobManager(prisma);
  }

  register(socket: Socket): void {
    socket.on('job:state', (_d: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (characterId, player) => {
        const job = await this.jobManager.getJobState(characterId);
        const transport = await this.jobManager.getTransport(characterId);
        ack?.({
          success: true, job, transport,
          goodsForSale: this.jobManager.getTradeGoodsForZone(player.zoneId),
        });
      });
    });

    socket.on('job:change', (data: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (characterId, _player) => {
        const job = String((data as { job?: string })?.job ?? '');
        if (!['trader', 'thief', 'hunter'].includes(job)) {
          ack?.({ success: false, error: 'Métier invalide (trader|thief|hunter)' });
          return;
        }
        await this.jobManager.changeJob(characterId, job as never);
        ack?.({ success: true, job });
      });
    });

    socket.on('job:buy_transport', (data: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (characterId, player) => {
        const starLevel = Math.max(1, Math.min(5, Number((data as { starLevel?: number })?.starLevel ?? 1)));
        // Miroir or/niveau de l'entité vivante vers la base (les commandes GM
        // et gains en jeu vivent dans l'entité — sinon le coût est refusé)
        await prisma.character.update({
          where: { id: characterId },
          data: { gold: BigInt(player.gold), level: player.level },
        });
        const cost = TRANSPORT_COST[starLevel] ?? 2000;
        const t = await this.jobManager.createTransport(characterId, starLevel, player.position, player.zoneId);
        player.addGold(-cost);
        this.combatBridge?.sendPlayerState(characterId);
        this.combatBridge?.sendToPlayerRaw(characterId, 'job:transport', {
          active: true, starLevel, position: player.position,
        });
        ack?.({ success: true, transport: t });
      });
    });

    socket.on('job:buy_goods', (data: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (characterId, player) => {
        const goodId = String((data as { goodId?: string })?.goodId ?? '');
        const quantity = Math.max(1, Number((data as { quantity?: number })?.quantity ?? 1));
        await prisma.character.update({
          where: { id: characterId },
          data: { gold: BigInt(player.gold) },
        });
        const r = await this.jobManager.buyTradeGoods(characterId, goodId, quantity, player.zoneId);
        player.addGold(-r.spent);
        this.combatBridge?.sendPlayerState(characterId);
        this.combatBridge?.sendToPlayerRaw(characterId, 'chat', {
          message: `Marchandises chargées: ${r.spent.toLocaleString('fr')} or — trade ${'★'.repeat(r.starLevel)} (${r.starLevel} étoile${r.starLevel > 1 ? 's' : ''})`,
          channel: 'system',
        });
        ack?.({ success: true, ...r });
      });
    });

    socket.on('job:sell_goods', (_d: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (characterId, player) => {
        const r = await this.jobManager.sellGoods(characterId, player.zoneId);
        player.addGold(r.totalProfit);
        this.combatBridge?.sendPlayerState(characterId);
        this.combatBridge?.sendToPlayerRaw(characterId, 'chat', {
          message: `Trade livré ! Profit: ${r.totalProfit.toLocaleString('fr')} or (+${r.jobExp} XP métier)`,
          channel: 'system',
        });
        ack?.({ success: true, ...r });
      });
    });

    socket.on('job:steal', (data: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (characterId, player) => {
        const traderId = String((data as { traderCharacterId?: string })?.traderCharacterId ?? '');
        const trader = this.worldManager?.getPlayer(traderId);
        if (!trader) { ack?.({ success: false, error: 'Trader introuvable' }); return; }
        const d = Math.hypot(trader.position.x - player.position.x, trader.position.z - player.position.z);
        if (d > 50) { ack?.({ success: false, error: `Trop loin du trader (${Math.round(d)} m)` }); return; }
        const stolen = await this.jobManager.stealGoods(characterId, traderId);
        const fencedInput = stolen.map((g) => ({ name: g.name, buyPrice: g.value, quantity: g.quantity }));
        const fenced = await this.jobManager.fenceStolenGoods(characterId, fencedInput);
        player.addGold(fenced);
        this.combatBridge?.sendPlayerState(characterId);
        this.combatBridge?.sendToPlayerRaw(traderId, 'chat', {
          message: `⚠️ ${player.name} vous a volé ${stolen.length} marchandise(s) !`,
          channel: 'system',
        });
        ack?.({ success: true, stolen, fenced });
      });
    });

    socket.on('job:dismiss_transport', (_d: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (characterId, _player) => {
        await this.jobManager.destroyTransport(characterId);
        this.combatBridge?.sendToPlayerRaw(characterId, 'job:transport', { active: false });
        ack?.({ success: true });
      });
    });
  }

  /** Wrapper commun: auth + characterId + player vivant + erreurs propres. */
  private async withPlayer(
    socket: Socket,
    ack: ((r: unknown) => void) | undefined,
    fn: (characterId: string, player: NonNullable<ReturnType<WorldManager['getPlayer']>>) => Promise<void>,
  ): Promise<void> {
    try {
      const client = this.clientManager.getClient(socket.id);
      const characterId = client?.getCharacterId() ?? null;
      const player = characterId ? this.worldManager?.getPlayer(characterId) : null;
      if (!characterId || !player) {
        ack?.({ success: false, error: 'Non authentifié' });
        return;
      }
      await fn(characterId, player);
    } catch (e) {
      logger.warn('job handler:', e);
      ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' });
    }
  }
}

export { computeStarLevel };
