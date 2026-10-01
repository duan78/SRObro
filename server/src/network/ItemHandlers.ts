// ============================================
// SRObro - Item Handlers (phase 3)
// Inventaire 45 slots, usage potions, équipement (stats officielles),
// boutiques NPC (achat/vente aux prix officiels). Serveur autoritaire.
// ============================================

import type { Socket } from 'socket.io';
import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';
import type { ClientManager } from './ClientManager';
import type { WorldManager } from '../game/WorldManager';

const logger = createLogger('ItemHandlers');

const INVENTORY_SIZE = 45;
const POTION_COOLDOWN_MS = 2000;

// Kit de départ des nouveaux personnages
const STARTER_KIT: Array<{ code: string; qty: number; equip?: boolean }> = [
  { code: 'ITEM_ETC_HP_POTION_01', qty: 10 },
  { code: 'ITEM_ETC_MP_POTION_01', qty: 5 },
  { code: 'ITEM_CH_BLADE_01_A', qty: 1 },
];

export class ItemHandlers {
  private clientManager: ClientManager;
  private worldManager: WorldManager | null = null;
  private lastPotionUse: Map<string, number> = new Map();

  constructor(clientManager: ClientManager) {
    this.clientManager = clientManager;
  }

  setWorldManager(worldManager: WorldManager): void {
    this.worldManager = worldManager;
  }

  registerHandlers(socket: Socket): void {
    socket.on('inventory:list', (_d, ack) => this.handleList(socket, ack));
    socket.on('inventory:use', (d, ack) => this.handleUse(socket, d, ack));
    socket.on('inventory:equip', (d, ack) => this.handleEquip(socket, d, ack));
    socket.on('inventory:unequip', (d, ack) => this.handleUnequip(socket, d, ack));
    socket.on('shop:list', (d, ack) => this.handleShopList(socket, d, ack));
    socket.on('shop:buy', (d, ack) => this.handleShopBuy(socket, d, ack));
    socket.on('shop:sell', (d, ack) => this.handleShopSell(socket, d, ack));
  }

  private session(socket: Socket): { characterId: string } | null {
    const client = this.clientManager.getClient(socket.id);
    if (!client || !client.getIsAuthenticated() || !client.getCharacterId()) return null;
    return { characterId: client.getCharacterId()! };
  }

  // ============================================
  // KIT DE DÉPART (appelé à la création de personnage)
  // ============================================

  static async giveStarterKit(characterId: string): Promise<void> {
    try {
      let slot = 0;
      for (const kit of STARTER_KIT) {
        const found = await prisma.item.findFirst({
          where: { description: { contains: `code=${kit.code}` }, price: { gt: 0 } },
        });
        if (!found) {
          logger.warn(`Kit de départ: item introuvable ${kit.code}`);
          continue;
        }
        await prisma.inventoryItem.create({
          data: { characterId, itemId: found.id, slot: slot++, quantity: kit.qty },
        });
      }
      logger.info(`Kit de départ donné à ${characterId}`);
    } catch (e) {
      logger.error('Erreur kit de départ:', e);
    }
  }

  // ============================================
  // INVENTAIRE
  // ============================================

  private async handleList(socket: Socket, ack?: (r: any) => void): Promise<void> {
    try {
      const s = this.session(socket);
      if (!s) { this.ack(ack, { success: false, error: 'Non authentifié' }); return; }

      const rows = await prisma.inventoryItem.findMany({
        where: { characterId: s.characterId },
        include: { item: true },
        orderBy: { slot: 'asc' },
      });
      const equipment = await prisma.equipment.findUnique({ where: { characterId: s.characterId } });

      const slots = new Array(INVENTORY_SIZE).fill(null);
      for (const row of rows) {
        slots[row.slot] = {
          slot: row.slot,
          quantity: row.quantity,
          plus: row.plus,
          item: serializeItem(row.item),
        };
      }
      this.ack(ack, {
        success: true,
        size: INVENTORY_SIZE,
        slots,
        equipment: equipment ? this.serializeEquipment(equipment) : {},
      });
    } catch (e: any) {
      logger.error('inventory:list error:', e);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  private async handleUse(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const s = this.session(socket);
      if (!s) { this.ack(ack, { success: false, error: 'Non authentifié' }); return; }
      const player = this.worldManager?.getPlayer(s.characterId);
      if (!player) { this.ack(ack, { success: false, error: 'Joueur hors ligne' }); return; }

      const slot = Number(data?.slot);
      const row = await prisma.inventoryItem.findFirst({
        where: { characterId: s.characterId, slot },
        include: { item: true },
      });
      if (!row) { this.ack(ack, { success: false, error: 'Emplacement vide' }); return; }

      if (row.item.type !== 'potion') {
        this.ack(ack, { success: false, error: 'Objet non consommable' });
        return;
      }

      const now = Date.now();
      const last = this.lastPotionUse.get(s.characterId) ?? 0;
      if (now - last < POTION_COOLDOWN_MS) {
        this.ack(ack, { success: false, error: 'Cooldown de potion' });
        return;
      }
      this.lastPotionUse.set(s.characterId, now);

      const amount = Number((row.item.description || '').match(/restore=(\d+)/)?.[1] ?? 50);
      if (row.item.subType === 'mp') {
        player.setMp(Math.min(player.maxMp, player.mp + amount));
      } else {
        player.setHp(Math.min(player.maxHp, player.hp + amount));
      }

      // Décrément / suppression
      if (row.quantity > 1) {
        await prisma.inventoryItem.update({ where: { id: row.id }, data: { quantity: row.quantity - 1 } });
      } else {
        await prisma.inventoryItem.delete({ where: { id: row.id } });
      }

      // Notifier l'état à jour (HUD)
      this.worldManager?.combatBridge?.sendPlayerState(s.characterId);
      this.ack(ack, { success: true, effect: { kind: row.item.subType === 'mp' ? 'mp' : 'hp', amount } });
    } catch (e: any) {
      logger.error('inventory:use error:', e);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  // ============================================
  // ÉQUIPEMENT
  // ============================================

  private async handleEquip(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const s = this.session(socket);
      if (!s) { this.ack(ack, { success: false, error: 'Non authentifié' }); return; }
      const player = this.worldManager?.getPlayer(s.characterId);
      if (!player) { this.ack(ack, { success: false, error: 'Joueur hors ligne' }); return; }

      const slot = Number(data?.slot);
      const row = await prisma.inventoryItem.findFirst({
        where: { characterId: s.characterId, slot },
        include: { item: true },
      });
      if (!row || row.quantity < 1) { this.ack(ack, { success: false, error: 'Emplacement vide' }); return; }

      const equipSlot = itemTypeToEquipSlot(row.item.type);
      if (!equipSlot) { this.ack(ack, { success: false, error: 'Objet non équipable' }); return; }

      if (row.item.requiredLevel > player.level) {
        this.ack(ack, { success: false, error: `Niveau ${row.item.requiredLevel} requis` });
        return;
      }

      // Upser l'équipement
      const equipment = await prisma.equipment.upsert({
        where: { characterId: s.characterId },
        create: { characterId: s.characterId },
        update: {},
      });
      const previousItemId = (equipment as any)[equipSlot] as string | null;
      await prisma.equipment.update({
        where: { characterId: s.characterId },
        data: { [equipSlot]: row.item.id },
      });

      // Retirer de l'inventaire; l'ancien item retourne en inventaire
      await prisma.inventoryItem.delete({ where: { id: row.id } });
      if (previousItemId) {
        const freeSlot = await this.findFreeSlot(s.characterId);
        if (freeSlot !== null) {
          await prisma.inventoryItem.create({
            data: { characterId: s.characterId, itemId: previousItemId, slot: freeSlot, quantity: 1 },
          });
        }
      }

      // Appliquer les stats si c'est une arme
      if (equipSlot === 'weapon') {
        player.applyWeaponStats({
          attackMin: row.item.attackPowerMin,
          attackMax: row.item.attackPowerMax,
        });
        // Visuel de l'arme: notifié au client (slot GLB par bsr)
        this.worldManager?.combatBridge?.sendToPlayerRaw(s.characterId, 'equipment:weapon', {
          itemCode: row.item.modelId,
          iconPath: row.item.iconId,
          name: row.item.name,
        });
      }

      this.ack(ack, { success: true, slot: equipSlot, item: serializeItem(row.item) });
    } catch (e: any) {
      logger.error('inventory:equip error:', e);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  private async handleUnequip(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const s = this.session(socket);
      if (!s) { this.ack(ack, { success: false, error: 'Non authentifié' }); return; }
      const player = this.worldManager?.getPlayer(s.characterId);
      const equipSlot = String(data?.slot ?? 'weapon');

      const equipment = await prisma.equipment.findUnique({ where: { characterId: s.characterId } });
      const itemId = equipment ? (equipment as any)[equipSlot] : null;
      if (!itemId) { this.ack(ack, { success: false, error: 'Rien à déséquiper' }); return; }

      const freeSlot = await this.findFreeSlot(s.characterId);
      if (freeSlot === null) { this.ack(ack, { success: false, error: 'Inventaire plein' }); return; }

      await prisma.inventoryItem.create({
        data: { characterId: s.characterId, itemId, slot: freeSlot, quantity: 1 },
      });
      await prisma.equipment.update({ where: { characterId: s.characterId }, data: { [equipSlot]: null } });

      if (equipSlot === 'weapon') {
        player?.applyWeaponStats(null);
        this.worldManager?.combatBridge?.sendToPlayerRaw(s.characterId, 'equipment:weapon', null);
      }
      this.ack(ack, { success: true });
    } catch (e: any) {
      logger.error('inventory:unequip error:', e);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  // ============================================
  // BOUTIQUES NPC
  // ============================================

  private async handleShopList(socket: Socket, _data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const s = this.session(socket);
      if (!s) { this.ack(ack, { success: false, error: 'Non authentifié' }); return; }

      // Boutique générique de Jangan: potions de base + lames degré 1-2 +
      // équipement léger — construite depuis les items officiels (phase 3;
      // le mapping NPC→tab fin viendra avec les refshop du client).
      const paid = { price: { gt: 0 } };
      const [hpPot, mpPot, blades, clothes] = await Promise.all([
        prisma.item.findFirst({ where: { type: 'potion', subType: 'hp', ...paid }, orderBy: { price: 'asc' } }),
        prisma.item.findFirst({ where: { type: 'potion', subType: 'mp', ...paid }, orderBy: { price: 'asc' } }),
        prisma.item.findMany({ where: { type: 'weapon', subType: 'blade', requiredLevel: { lte: 9 }, ...paid }, orderBy: { price: 'asc' }, take: 2 }),
        prisma.item.findMany({ where: { type: 'chest', requiredLevel: { lte: 9 }, ...paid }, orderBy: { price: 'asc' }, take: 2 }),
      ]);

      const goods = [hpPot, mpPot, ...blades, ...clothes].filter(Boolean).map((i: any) => serializeItem(i));
      this.ack(ack, { success: true, npcName: 'Marchand de Jangan', goods });
    } catch (e: any) {
      logger.error('shop:list error:', e);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  private async handleShopBuy(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const s = this.session(socket);
      if (!s) { this.ack(ack, { success: false, error: 'Non authentifié' }); return; }
      const player = this.worldManager?.getPlayer(s.characterId);
      if (!player) { this.ack(ack, { success: false, error: 'Joueur hors ligne' }); return; }

      const qty = Math.max(1, Math.min(99, Number(data?.qty ?? 1)));
      const item = await prisma.item.findUnique({ where: { id: String(data?.itemId) } });
      if (!item) { this.ack(ack, { success: false, error: 'Article inconnu' }); return; }

      const total = Number(item.price) * qty;
      if (player.gold < total) {
        this.ack(ack, { success: false, error: `Or insuffisant (${total} requis)` });
        return;
      }

      const freeSlot = await this.findFreeSlot(s.characterId);
      if (freeSlot === null) { this.ack(ack, { success: false, error: 'Inventaire plein' }); return; }

      // Empilage si un stack identique existe
      if (item.stackable) {
        const existing = await prisma.inventoryItem.findFirst({
          where: { characterId: s.characterId, itemId: item.id },
        });
        if (existing) {
          await prisma.inventoryItem.update({
            where: { id: existing.id },
            data: { quantity: Math.min(item.maxStack, existing.quantity + qty) },
          });
          player.addGold(-total);
          this.worldManager?.combatBridge?.sendPlayerState(s.characterId);
          this.ack(ack, { success: true, spent: total });
          return;
        }
      }

      await prisma.inventoryItem.create({
        data: { characterId: s.characterId, itemId: item.id, slot: freeSlot, quantity: qty },
      });
      player.addGold(-total);
      this.worldManager?.combatBridge?.sendPlayerState(s.characterId);
      this.ack(ack, { success: true, spent: total });
    } catch (e: any) {
      logger.error('shop:buy error:', e);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  private async handleShopSell(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    try {
      const s = this.session(socket);
      if (!s) { this.ack(ack, { success: false, error: 'Non authentifié' }); return; }
      const player = this.worldManager?.getPlayer(s.characterId);
      if (!player) { this.ack(ack, { success: false, error: 'Joueur hors ligne' }); return; }

      const slot = Number(data?.slot);
      const qtyWanted = Math.max(1, Number(data?.qty ?? 1));
      const row = await prisma.inventoryItem.findFirst({
        where: { characterId: s.characterId, slot },
        include: { item: true },
      });
      if (!row) { this.ack(ack, { success: false, error: 'Emplacement vide' }); return; }

      const qty = Math.min(qtyWanted, row.quantity);
      const gain = Math.floor(Number(row.item.price) / 3) * qty; // revente au tiers (convention MMO)

      if (row.quantity - qty <= 0) {
        await prisma.inventoryItem.delete({ where: { id: row.id } });
      } else {
        await prisma.inventoryItem.update({ where: { id: row.id }, data: { quantity: row.quantity - qty } });
      }
      player.addGold(gain);
      this.worldManager?.combatBridge?.sendPlayerState(s.characterId);
      this.ack(ack, { success: true, gained: gain });
    } catch (e: any) {
      logger.error('shop:sell error:', e);
      this.ack(ack, { success: false, error: 'Erreur serveur' });
    }
  }

  // ============================================
  // HELPERS
  // ============================================

  private async findFreeSlot(characterId: string): Promise<number | null> {
    const taken = await prisma.inventoryItem.findMany({
      where: { characterId },
      select: { slot: true },
    });
    const used = new Set(taken.map((t) => t.slot));
    for (let i = 0; i < INVENTORY_SIZE; i++) {
      if (!used.has(i)) return i;
    }
    return null;
  }

  private serializeEquipment(e: { weapon: string | null; [k: string]: any }): Record<string, string | null> {
    const out: Record<string, string | null> = {};
    for (const key of ['weapon', 'shield', 'helmet', 'chest', 'shoulder', 'legs', 'boots', 'ring1', 'ring2', 'necklace', 'earring1', 'earring2']) {
      out[key] = e[key] ?? null;
    }
    return out;
  }

  private ack(ack: ((r: any) => void) | undefined, response: any): void {
    if (typeof ack === 'function') ack(response);
  }
}

// ============================================
// HELPERS module
// ============================================

function serializeItem(item: any): Record<string, unknown> {
  return {
    id: item.id,
    name: item.name,
    type: item.type,
    subType: item.subType,
    requiredLevel: item.requiredLevel,
    attackPowerMin: item.attackPowerMin,
    attackPowerMax: item.attackPowerMax,
    price: Number(item.price),
    stackable: item.stackable,
    maxStack: item.maxStack,
    iconPath: item.iconId,
    modelId: item.modelId,
    restore: Number((item.description || '').match(/restore=(\d+)/)?.[1] ?? 0),
  };
}

function itemTypeToEquipSlot(type: string): string | null {
  switch (type) {
    case 'weapon': return 'weapon';
    case 'shield': return 'shield';
    case 'helmet': return 'helmet';
    case 'chest': return 'chest';
    case 'shoulder': return 'shoulder';
    case 'legs': return 'legs';
    case 'boots': return 'boots';
    case 'ring': return 'ring1';
    case 'necklace': return 'necklace';
    case 'earring': return 'earring1';
    default: return null;
  }
}

export default ItemHandlers;
