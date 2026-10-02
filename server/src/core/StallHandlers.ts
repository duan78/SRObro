// ============================================
// SRObro - StallHandlers (Phase D V2 — économie joueur)
// Stalls officiels: ouverture en ville (1 000 or), dépôt d'items,
// achat transactionnel (slot acheteur recalculé, anti double-vente),
// recherche réseau (stall network), frais 1% plafonnés 100k (KB 23).
// ============================================

import type { Socket } from 'socket.io';
import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';
import { StallManager } from '../stall/StallManager';
import { STALL_CONFIG } from '@srobro/shared';
import type { ClientManager } from '../network/ClientManager';
import type { WorldManager } from '../game/WorldManager';
import type { CombatBridge } from '../game/CombatBridge';

const logger = createLogger('StallHandlers');

/** Villes où un stall peut être ouvert (KB 23: partout en ville). */
const CITY_ZONES = new Set(['zone_jangan', 'zone_donwhang', 'zone_hotan']);

export class StallHandlers {
  private stallManager = StallManager.getInstance(prisma);
  private myStallId = new Map<string, string>(); // characterId → stallId

  constructor(
    private clientManager: ClientManager,
    private worldManager: WorldManager | null,
    private combatBridge: CombatBridge | null,
  ) {}

  register(socket: Socket): void {
    socket.on('stall:open', (data: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (characterId, player) => {
        const title = String((data as { title?: string })?.title ?? 'Marchand ambulant');
        if (!CITY_ZONES.has(player.zoneId)) {
          ack?.({ success: false, error: "Un stall ne peut être ouvert qu'en ville" });
          return;
        }
        // Miroir or de l'entité vers la base (gains en jeu vivent en mémoire)
        await prisma.character.update({ where: { id: characterId }, data: { gold: BigInt(player.gold) } });
        const stall = await this.stallManager.openStall(
          characterId, player.name, title, player.zoneId, player.position,
        );
        this.myStallId.set(characterId, stall.id);
        player.addGold(-STALL_CONFIG.OPEN_COST);
        this.combatBridge?.sendPlayerState(characterId);
        ack?.({ success: true, stall });
      });
    });

    socket.on('stall:add_item', (data: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (characterId, _player) => {
        const stallId = this.myStallId.get(characterId);
        if (!stallId) { ack?.({ success: false, error: 'Ouvrez un stall d\'abord (stall:open)' }); return; }
        const slot = Number((data as { slot?: number })?.slot ?? -1);
        const price = Number((data as { price?: number })?.price ?? 0);
        if (slot < 0 || price < 1) { ack?.({ success: false, error: 'Slot/prix invalide' }); return; }
        const inv = await prisma.inventoryItem.findFirst({ where: { characterId, slot } });
        if (!inv) { ack?.({ success: false, error: 'Slot vide' }); return; }
        await this.stallManager.addItemToStall(stallId, characterId, inv.id, price);
        ack?.({ success: true });
      });
    });

    socket.on('stall:search', (data: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (_characterId, _player) => {
        const q = (data ?? {}) as { itemName?: string; minPrice?: number; maxPrice?: number };
        const results = await this.stallManager.searchStalls(q);
        ack?.({ success: true, results });
      });
    });

    socket.on('stall:buy', (data: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (characterId, player) => {
        const stallItemId = String((data as { stallItemId?: string })?.stallItemId ?? '');
        await prisma.character.update({ where: { id: characterId }, data: { gold: BigInt(player.gold) } });
        // Résoudre le stall propriétaire de l'item (buyFromStall veut stallId)
        const si = await prisma.stallItem.findUnique({ where: { id: stallItemId } });
        if (!si) { ack?.({ success: false, error: 'Article introuvable' }); return; }
        await this.stallManager.buyFromStall(si.stallId, characterId, stallItemId);
        // Miroir base → entité (la transaction débite la base; l'entité en
        // mémoire doit suivre pour le HUD et les prochains coûts)
        player.addGold(-Number(si.price));
        this.combatBridge?.sendPlayerState(characterId);
        ack?.({ success: true });
      });
    });

    socket.on('stall:close', (_d: unknown, ack?: (r: unknown) => void) => {
      void this.withPlayer(socket, ack, async (characterId, _player) => {
        const stallId = this.myStallId.get(characterId);
        if (!stallId) { ack?.({ success: false, error: 'Aucun stall ouvert' }); return; }
        await this.stallManager.closeStall(stallId, characterId);
        this.myStallId.delete(characterId);
        ack?.({ success: true });
      });
    });
  }

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
      logger.warn('stall handler:', e);
      ack?.({ success: false, error: e instanceof Error ? e.message : 'Erreur' });
    }
  }
}
