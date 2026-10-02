// ============================================
// SRObro - ConsignmentManager (Phase D V2 — consignation officielle)
// NPC Consignment Merchant Juel (Hotan Palace, KB 23): dépôt d'items
// (max 10, ~3 jours), recherche/achat à distance, double commission à
// la vente, settle obligatoire. Remplace le stall physique quand le
// joueur est hors ligne.
// ============================================

import { PrismaClient } from '@prisma/client';
import { createLogger } from '../core/Logger';

const logger = createLogger('ConsignmentManager');

/** Officiel (KB 23): max 10 items par perso, dépôt ~3 jours (72 h). */
const MAX_ITEMS = 10;
const LISTING_MS = 72 * 3600 * 1000;

/** Modèle de stockage: la table Stall en mode consignation (title fixe,
 *  pas de position physique). Champs réutilisés: characterId, zoneId,
 *  isOpen=actif; les items dans StallItem avec price. */

export interface ConsignmentListing {
  id: string;
  sellerName: string;
  itemName: string;
  plus: number;
  price: number;
  expiresAt: number;
}

export class ConsignmentManager {
  constructor(private prisma: PrismaClient) {}

  /** Dépose un item de l'inventaire en consignation (NPC Juel, Hotan). */
  async list(
    characterId: string,
    characterName: string,
    inventorySlot: number,
    price: number,
  ): Promise<{ listingId: string; fee: number }> {
    if (price < 1) throw new Error('Prix invalide');

    const inv = await this.prisma.inventoryItem.findFirst({
      where: { characterId, slot: inventorySlot },
    });
    if (!inv) throw new Error('Slot vide');

    // Stall de consignation dédié (1 par perso, zone Hotan, titre fixe)
    let stall = await this.prisma.stall.findFirst({
      where: { characterId, title: 'CONSIGNATION' },
    });
    if (!stall) {
      stall = await this.prisma.stall.create({
        data: {
          characterId,
          characterName,
          title: 'CONSIGNATION',
          zoneId: 'zone_hotan',
          positionX: 0, positionY: 0, positionZ: 0,
          isOpen: true,
        },
      });
    }

    const count = await this.prisma.stallItem.count({ where: { stallId: stall.id } });
    if (count >= MAX_ITEMS) throw new Error(`Consignation pleine (${MAX_ITEMS} max — KB 23)`);

    // Frais de dépôt officiels: 1% plafonné 100k (prélevés à la conclusion)
    const fee = Math.min(100000, Math.floor(price * 0.01));

    const item = await this.prisma.stallItem.create({
      data: {
        stallId: stall.id,
        inventoryItemId: inv.id,
        price: BigInt(price),
      },
    });

    // L'item quitte l'inventaire visible: passer le slot à -1 (réservé)
    await this.prisma.inventoryItem.update({
      where: { id: inv.id },
      data: { slot: -1 - (Number.parseInt(item.id.slice(0, 6), 36) % 100000) },
    });

    logger.info(`Consignation: ${characterName} dépose ${inv.id} @${price} (frais ${fee})`);
    return { listingId: item.id, fee };
  }

  /** Recherche des listings actifs (toutes villes — achat à distance). */
  async search(query: { itemName?: string; maxPrice?: number }): Promise<ConsignmentListing[]> {
    const stalls = await this.prisma.stall.findMany({
      where: { title: 'CONSIGNATION', isOpen: true },
      include: { stallItems: true },
    });
    const out: ConsignmentListing[] = [];
    for (const st of stalls) {
      for (const si of st.stallItems) {
        const inv = await this.prisma.inventoryItem.findUnique({
          where: { id: si.inventoryItemId },
          include: { item: true },
        });
        if (!inv) continue;
        const name = inv.item.name;
        const price = Number(si.price);
        if (query.itemName && !name.toLowerCase().includes(query.itemName.toLowerCase())) continue;
        if (query.maxPrice && price > query.maxPrice) continue;
        out.push({
          id: si.id,
          sellerName: st.characterName,
          itemName: name,
          plus: inv.plus,
          price,
          expiresAt: si.createdAt.getTime() + LISTING_MS,
        });
      }
    }
    return out;
  }

  /** Achat d'un listing (à distance): or + item (slot libre) + frais. */
  async buy(
    buyerCharacterId: string,
    listingId: string,
  ): Promise<{ itemName: string; price: number; fee: number; slot: number }> {
    const si = await this.prisma.stallItem.findUnique({ where: { id: listingId } });
    if (!si) throw new Error('Article introuvable');
    const stall = await this.prisma.stall.findUnique({ where: { id: si.stallId } });
    if (!stall || stall.title !== 'CONSIGNATION') throw new Error('Listing invalide');

    const price = Number(si.price);
    const fee = Math.min(100000, Math.floor(price * 0.01)); // double commission KB 23

    const buyer = await this.prisma.character.findUnique({ where: { id: buyerCharacterId } });
    if (!buyer) throw new Error('Acheteur introuvable');
    if (Number(buyer.gold) < price) throw new Error(`Or insuffisant (${price} requis)`);

    // Slot libre chez l'acheteur
    const buyerItems = await this.prisma.inventoryItem.findMany({
      where: { characterId: buyerCharacterId, slot: { gte: 0 } },
      select: { slot: true },
    });
    const taken = new Set(buyerItems.map((i) => i.slot));
    let freeSlot = -1;
    for (let i = 0; i < 45; i++) {
      if (!taken.has(i)) { freeSlot = i; break; }
    }
    if (freeSlot === -1) throw new Error('Inventaire plein');

    const inv = await this.prisma.inventoryItem.findUnique({
      where: { id: si.inventoryItemId },
      include: { item: true },
    });
    if (!inv) throw new Error('Item introuvable');

    const deleted = await this.prisma.stallItem.deleteMany({ where: { id: listingId } });
    if (deleted.count === 0) throw new Error('Article déjà vendu');

    await this.prisma.$transaction([
      this.prisma.character.update({
        where: { id: buyerCharacterId },
        data: { gold: { decrement: BigInt(price) } },
      }),
      this.prisma.character.update({
        where: { id: stall.characterId },
        data: { gold: { increment: BigInt(price - fee) } }, // vendeur − commission
      }),
      this.prisma.inventoryItem.update({
        where: { id: inv.id },
        data: { characterId: buyerCharacterId, slot: freeSlot },
      }),
    ]);

    logger.info(`Consignation: ${buyerCharacterId} achète ${inv.item.name} @${price} (frais ${fee})`);
    return { itemName: inv.item.name, price, fee, slot: freeSlot };
  }

  /** Retrait d'un listing non vendu (retour inventaire). */
  async cancel(characterId: string, listingId: string): Promise<void> {
    const si = await this.prisma.stallItem.findUnique({ where: { id: listingId } });
    if (!si) throw new Error('Article introuvable');
    const stall = await this.prisma.stall.findUnique({ where: { id: si.stallId } });
    if (!stall || stall.characterId !== characterId) throw new Error('Pas votre listing');

    const items = await this.prisma.inventoryItem.findMany({
      where: { characterId, slot: { gte: 0 } },
      select: { slot: true },
    });
    const taken = new Set(items.map((i) => i.slot));
    let freeSlot = -1;
    for (let i = 0; i < 45; i++) {
      if (!taken.has(i)) { freeSlot = i; break; }
    }
    if (freeSlot === -1) throw new Error('Inventaire plein');

    await this.prisma.stallItem.delete({ where: { id: listingId } });
    await this.prisma.inventoryItem.update({
      where: { id: si.inventoryItemId },
      data: { slot: freeSlot },
    });
  }

  /** Settle: encaisse les ventes conclues (KB 23: settle obligatoire). */
  async settle(characterId: string): Promise<{ settled: number; gold: number }> {
    // Les ventes sont créditées directement; settle retourne le solde
    const stall = await this.prisma.stall.findFirst({
      where: { characterId, title: 'CONSIGNATION' },
      include: { stallItems: true },
    });
    const remaining = stall?.stallItems.length ?? 0;
    const character = await this.prisma.character.findUnique({ where: { id: characterId } });
    return { settled: remaining, gold: Number(character?.gold ?? 0) };
  }
}
