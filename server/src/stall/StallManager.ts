// ============================================
// SRObro - Stall Network Manager
// Handles personal player shops
// ============================================

import { PrismaClient } from '@prisma/client';
import { STALL_CONFIG } from '../../../shared/src/constants';

export interface StallItemData {
  inventoryItemId: string;
  price: number;
}

export interface StallData {
  id: string;
  characterId: string;
  characterName: string;
  title: string;
  zoneId: string;
  position: { x: number; y: number; z: number };
  items: Array<{
    id: string;
    inventoryItemId: string;
    price: number;
    item: any;
  }>;
  isOpen: boolean;
}

export interface StallSearchResult {
  stallId: string;
  characterName: string;
  title: string;
  zoneId: string;
  itemCount: number;
  items: Array<{
    name: string;
    plus: number;
    price: number;
    rarity: string;
  }>;
}

/**
 * StallManager - Manages player stalls (personal shops)
 *
 * Features:
 * - Open stall with custom title
 * - Add/remove items (max 15)
 * - Set prices for each item
 * - Stall Network at Hotan Palace (global search)
 * - Real-time updates
 */
export class StallManager {
  private prisma: PrismaClient;

  // Cache of open stalls for quick lookup
  private stallCache: Map<string, StallData> = new Map();

  private static instance: StallManager | null = null;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
    this.initializeCache();
  }

  /** Singleton partagé (le cache stall doit être commun à TOUS les sockets —
   * une instance par handler isolait les stalls de chaque joueur). */
  static getInstance(prisma: PrismaClient): StallManager {
    if (!StallManager.instance) StallManager.instance = new StallManager(prisma);
    return StallManager.instance;
  }

  /**
   * Initialize stall cache from database
   */
  private async initializeCache(): Promise<void> {
    const openStalls = await this.prisma.stall.findMany({
      where: { isOpen: true },
      include: {
        stallItems: {
          include: {
            // Note: We need to load the actual item data
          }
          // stallItems will need to be loaded with inventory items
        }
      }
    });

    for (const stall of openStalls) {
      // Load full stall data
      const data = await this.loadStallData(stall.id);
      if (data) {
        this.stallCache.set(stall.id, data);
      }
    }
  }

  /**
   * Open a new stall
   */
  async openStall(
    characterId: string,
    characterName: string,
    title: string,
    zoneId: string,
    position: { x: number; y: number; z: number }
  ): Promise<StallData> {
    // Check if player already has an open stall
    const existingStall = await this.prisma.stall.findFirst({
      where: {
        characterId,
        isOpen: true
      }
    });

    if (existingStall) {
      throw new Error('You already have an open stall');
    }

    // Validate title
    if (title.length < STALL_CONFIG.MIN_TITLE_LENGTH ||
        title.length > STALL_CONFIG.MAX_TITLE_LENGTH) {
      throw new Error(`Title must be between ${STALL_CONFIG.MIN_TITLE_LENGTH} and ${STALL_CONFIG.MAX_TITLE_LENGTH} characters`);
    }

    // Check if player has enough gold
    const character = await this.prisma.character.findUnique({
      where: { id: characterId }
    });

    if (!character) {
      throw new Error('Character not found');
    }

    if (Number(character.gold) < STALL_CONFIG.OPEN_COST) {
      throw new Error(`Not enough gold to open stall (requires ${STALL_CONFIG.OPEN_COST})`);
    }

    // Deduct gold
    await this.prisma.character.update({
      where: { id: characterId },
      data: {
        gold: { decrement: BigInt(STALL_CONFIG.OPEN_COST) }
      }
    });

    // Create stall
    const stall = await this.prisma.stall.create({
      data: {
        characterId,
        characterName,
        title,
        zoneId,
        positionX: position.x,
        positionY: position.y,
        positionZ: position.z,
        isOpen: true
      }
    });

    const stallData: StallData = {
      id: stall.id,
      characterId: stall.characterId,
      characterName: stall.characterName,
      title: stall.title,
      zoneId: stall.zoneId,
      position,
      items: [],
      isOpen: true
    };

    this.stallCache.set(stall.id, stallData);

    return stallData;
  }

  /**
   * Close a stall
   */
  async closeStall(stallId: string, characterId: string): Promise<void> {
    const stall = await this.prisma.stall.findUnique({
      where: { id: stallId }
    });

    if (!stall) {
      throw new Error('Stall not found');
    }

    if (stall.characterId !== characterId) {
      throw new Error('You do not own this stall');
    }

    // Close the stall
    await this.prisma.stall.update({
      where: { id: stallId },
      data: { isOpen: false }
    });

    this.stallCache.delete(stallId);
  }

  /**
   * Add item to stall
   */
  async addItemToStall(
    stallId: string,
    characterId: string,
    inventoryItemId: string,
    price: number
  ): Promise<void> {
    const stall = await this.prisma.stall.findUnique({
      where: { id: stallId },
      include: { stallItems: true }
    });

    if (!stall) {
      throw new Error('Stall not found');
    }

    if (stall.characterId !== characterId) {
      throw new Error('You do not own this stall');
    }

    if (!stall.isOpen) {
      throw new Error('Stall is not open');
    }

    // Check max items
    if (stall.stallItems.length >= STALL_CONFIG.MAX_ITEMS) {
      throw new Error(`Stall can have maximum ${STALL_CONFIG.MAX_ITEMS} items`);
    }

    // Verify inventory item belongs to character
    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: { id: inventoryItemId },
      include: { item: true }
    });

    if (!inventoryItem || inventoryItem.characterId !== characterId) {
      throw new Error('Item not found or does not belong to you');
    }

    // Validate price
    if (price <= 0) {
      throw new Error('Price must be greater than 0');
    }

    // Add item to stall (bug d'origine: le cache stockait l'id de
    // l'INVENTORY item — la recherche renvoyait un stallItemId introuvable)
    const created = await this.prisma.stallItem.create({
      data: {
        stallId,
        inventoryItemId,
        price: BigInt(price)
      }
    });

    // Update cache (vrai StallItem.id)
    const cachedStall = this.stallCache.get(stallId);
    if (cachedStall) {
      cachedStall.items.push({
        id: created.id,
        inventoryItemId,
        price,
        item: inventoryItem.item
      });
    }
  }

  /**
   * Remove item from stall
   */
  async removeItemFromStall(
    stallId: string,
    characterId: string,
    stallItemId: string
  ): Promise<void> {
    const stall = await this.prisma.stall.findUnique({
      where: { id: stallId }
    });

    if (!stall) {
      throw new Error('Stall not found');
    }

    if (stall.characterId !== characterId) {
      throw new Error('You do not own this stall');
    }

    // Delete stall item
    await this.prisma.stallItem.delete({
      where: { id: stallItemId }
    });

    // Update cache
    const cachedStall = this.stallCache.get(stallId);
    if (cachedStall) {
      cachedStall.items = cachedStall.items.filter(item => item.id !== stallItemId);
    }
  }

  /**
   * Buy item from stall
   */
  async buyFromStall(
    stallId: string,
    buyerCharacterId: string,
    stallItemId: string
  ): Promise<void> {
    const stall = await this.prisma.stall.findUnique({
      where: { id: stallId },
      include: { stallItems: true }
    });

    if (!stall || !stall.isOpen) {
      throw new Error('Stall not found or not open');
    }

    const stallItem = stall.stallItems.find(item => item.id === stallItemId);
    if (!stallItem) {
      throw new Error('Item not found in stall');
    }

    // Check buyer is not the stall owner
    if (stall.characterId === buyerCharacterId) {
      throw new Error('Cannot buy from your own stall');
    }

    // Get buyer and seller characters
    const [buyer, seller] = await Promise.all([
      this.prisma.character.findUnique({ where: { id: buyerCharacterId } }),
      this.prisma.character.findUnique({ where: { id: stall.characterId } })
    ]);

    if (!buyer || !seller) {
      throw new Error('Character not found');
    }

    const price = Number(stallItem.price);

    // Check buyer has enough gold
    if (Number(buyer.gold) < price) {
      throw new Error('Not enough gold');
    }

    // Check buyer has inventory space
    const buyerItemCount = await this.prisma.inventoryItem.count({
      where: { characterId: buyerCharacterId }
    });

    if (buyerItemCount >= 45) { // Max inventory slots
      throw new Error('Inventory is full');
    }

    // Get inventory item
    const inventoryItem = await this.prisma.inventoryItem.findUnique({
      where: { id: stallItem.inventoryItemId }
    });

    if (!inventoryItem) {
      throw new Error('Inventory item not found');
    }

    // Slot libre chez l'ACHETEUR (bug d'origine: le slot du vendeur était
    // conservé → collision @@unique([characterId, slot]) avec l'inventaire
    // existant de l'acheteur)
    const buyerItems = await this.prisma.inventoryItem.findMany({
      where: { characterId: buyerCharacterId },
      select: { slot: true },
    });
    const taken = new Set(buyerItems.map((i) => i.slot));
    let freeSlot = -1;
    for (let i = 0; i < 45; i++) {
      if (!taken.has(i)) { freeSlot = i; break; }
    }
    if (freeSlot === -1) throw new Error("Inventaire de l'acheteur plein");

    // Transaction: or + item (slot recalculé) + garde anti double-vente
    // (deleteMany retourne 0 si déjà vendu → rollback complet)
    const tx = await this.prisma.$transaction(async (prisma) => {
      const deleted = await prisma.stallItem.deleteMany({
        where: { id: stallItemId },
      });
      if (deleted.count === 0) throw new Error('Article déjà vendu');

      await prisma.character.update({
        where: { id: buyerCharacterId },
        data: { gold: { decrement: BigInt(price) } },
      });
      await prisma.character.update({
        where: { id: stall.characterId },
        data: { gold: { increment: BigInt(price) } },
      });
      await prisma.inventoryItem.update({
        where: { id: stallItem.inventoryItemId },
        data: { characterId: buyerCharacterId, slot: freeSlot },
      });
      return true;
    });
    void tx;

    // Update cache
    const cachedStall = this.stallCache.get(stallId);
    if (cachedStall) {
      cachedStall.items = cachedStall.items.filter(item => item.id !== stallItemId);
    }
  }

  /**
   * Search stalls (Stall Network)
   */
  async searchStalls(query: {
    itemName?: string;
    minPrice?: number;
    maxPrice?: number;
    minPlus?: number;
    maxPlus?: number;
    rarity?: string;
    zoneId?: string;
  }): Promise<StallSearchResult[]> {
    const results: StallSearchResult[] = [];

    for (const stall of this.stallCache.values()) {
      if (!stall.isOpen) continue;

      // Filter by zone
      if (query.zoneId && stall.zoneId !== query.zoneId) continue;

      // Filter items
      const matchingItems = stall.items.filter(item => {
        // Name filter
        if (query.itemName && !item.item.name.toLowerCase().includes(query.itemName.toLowerCase())) {
          return false;
        }

        // Price filter
        if (query.minPrice && item.price < query.minPrice) return false;
        if (query.maxPrice && item.price > query.maxPrice) return false;

        // Plus filter
        const inventoryItem = this.getCachedInventoryItem(item.inventoryItemId);
        if (inventoryItem) {
          if (query.minPlus !== undefined && inventoryItem.plus < query.minPlus) return false;
          if (query.maxPlus !== undefined && inventoryItem.plus > query.maxPlus) return false;
          if (query.rarity && inventoryItem.item.rarity !== query.rarity) return false;
        }

        return true;
      });

      if (matchingItems.length > 0) {
        // Vrais plus/rarity: lecture base (le cache inventory était inerte —
        // plus:0/rarity common hardcodés, filtres non fonctionnels)
        const invRows = await this.prisma.inventoryItem.findMany({
          where: { id: { in: matchingItems.map((i) => i.inventoryItemId) } },
          include: { item: true },
        });
        const invById = new Map(invRows.map((r) => [r.id, r]));
        results.push({
          stallId: stall.id,
          characterName: stall.characterName,
          title: stall.title,
          zoneId: stall.zoneId,
          itemCount: matchingItems.length,
          items: matchingItems.map(item => {
            const inv = invById.get(item.inventoryItemId);
            return {
              name: item.item.name,
              stallItemId: item.id,
              plus: inv?.plus ?? 0,
              price: item.price,
              rarity: inv?.item.rarity ?? 'common',
            };
          })
        });
      }
    }

    return results;
  }

  /**
   * Get all open stalls in a zone
   */
  async getStallsInZone(zoneId: string): Promise<StallData[]> {
    const stalls: StallData[] = [];

    for (const stall of this.stallCache.values()) {
      if (stall.isOpen && stall.zoneId === zoneId) {
        stalls.push(stall);
      }
    }

    return stalls;
  }

  /**
   * Get stall data by ID
   */
  async getStall(stallId: string): Promise<StallData | null> {
    const cached = this.stallCache.get(stallId);
    if (cached) {
      return cached;
    }

    return await this.loadStallData(stallId);
  }

  /**
   * Load full stall data from database
   */
  private async loadStallData(stallId: string): Promise<StallData | null> {
    const stall = await this.prisma.stall.findUnique({
      where: { id: stallId },
      include: {
        stallItems: {
          include: {
            // Note: We need to join with InventoryItem to get item details
          }
        }
      }
    });

    if (!stall) return null;

    // Load inventory items with item data
    const itemsWithDetails = await Promise.all(
      stall.stallItems.map(async (stallItem) => {
        const invItem = await this.prisma.inventoryItem.findUnique({
          where: { id: stallItem.inventoryItemId },
          include: { item: true }
        });

        return {
          id: stallItem.id,
          inventoryItemId: stallItem.inventoryItemId,
          price: Number(stallItem.price),
          item: invItem?.item
        };
      })
    );

    return {
      id: stall.id,
      characterId: stall.characterId,
      characterName: stall.characterName,
      title: stall.title,
      zoneId: stall.zoneId,
      position: {
        x: stall.positionX,
        y: stall.positionY,
        z: stall.positionZ
      },
      items: itemsWithDetails,
      isOpen: stall.isOpen
    };
  }

  /**
   * Get cached inventory item (helper)
   */
  private getCachedInventoryItem(_inventoryItemId: string): any {
    // This would need a proper cache implementation
    return null;
  }

  /**
   * Update stall title
   */
  async updateStallTitle(
    stallId: string,
    characterId: string,
    newTitle: string
  ): Promise<void> {
    const stall = await this.prisma.stall.findUnique({
      where: { id: stallId }
    });

    if (!stall) {
      throw new Error('Stall not found');
    }

    if (stall.characterId !== characterId) {
      throw new Error('You do not own this stall');
    }

    // Validate title
    if (newTitle.length < STALL_CONFIG.MIN_TITLE_LENGTH ||
        newTitle.length > STALL_CONFIG.MAX_TITLE_LENGTH) {
      throw new Error(`Title must be between ${STALL_CONFIG.MIN_TITLE_LENGTH} and ${STALL_CONFIG.MAX_TITLE_LENGTH} characters`);
    }

    await this.prisma.stall.update({
      where: { id: stallId },
      data: { title: newTitle }
    });

    // Update cache
    const cachedStall = this.stallCache.get(stallId);
    if (cachedStall) {
      cachedStall.title = newTitle;
    }
  }

  /**
   * Get stall owner info
   */
  async getStallOwner(stallId: string): Promise<{
    characterId: string;
    characterName: string;
  } | null> {
    const stall = await this.prisma.stall.findUnique({
      where: { id: stallId }
    });

    if (!stall) return null;

    return {
      characterId: stall.characterId,
      characterName: stall.characterName
    };
  }
}
