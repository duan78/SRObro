// ============================================
// SRObro - Mount Manager
// Manages mount (horse) system with inventory and feeding
// ============================================

import { Mount, MountInventory, Prisma } from '@prisma/client';
import { EventEmitter } from 'events';
import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';

const logger = createLogger('MountManager');


const MOUNT_TYPES = {
  horse_a: { name: 'Horse', baseSpeed: 5, baseHp: 100, level: 1 },
  horse_b: { name: 'White Horse', baseSpeed: 7, baseHp: 150, level: 20 },
  horse_c: { name: 'Combat Horse', baseSpeed: 6, baseHp: 200, level: 30 }
};

export class MountManager extends EventEmitter {
  private static instance: MountManager;

  private constructor() {
    super();
    this.startHungerSystem();
  }

  static getInstance(): MountManager {
    if (!MountManager.instance) {
      MountManager.instance = new MountManager();
    }
    return MountManager.instance;
  }

  // ============================================
  // MOUNT PURCHASE
  // ============================================

  async purchaseMount(characterId: string, mountType: string): Promise<Mount> {
    const character = await prisma.character.findUnique({
      where: { id: characterId }
    });

    if (!character) {
      throw new Error('Character not found');
    }

    // Check if character already has a mount
    const existingMount = await prisma.mount.findUnique({
      where: { characterId }
    });

    if (existingMount) {
      throw new Error('Character already has a mount');
    }

    if (character.level < 10) {
      throw new Error('Character must be level 10 or higher to own a mount');
    }

    // Cost varies by mount type
    const mountPrices: Record<string, bigint> = {
      horse_a: 100000n,      // 100k gold
      horse_b: 500000n,      // 500k gold
      horse_c: 1000000n     // 1M gold
    };

    const price = mountPrices[mountType] || 100000n;
    if (character.gold < price) {
      throw new Error(`Insufficient gold. Mount costs ${price} gold.`);
    }

    // Deduct gold
    await prisma.character.update({
      where: { id: characterId },
      data: { gold: { decrement: price } }
    });

    // Create mount
    const mount = await prisma.mount.create({
      data: {
        characterId,
        mountType,
        level: MOUNT_TYPES[mountType as keyof typeof MOUNT_TYPES].level,
        exp: 0n,
        hp: MOUNT_TYPES[mountType as keyof typeof MOUNT_TYPES].baseHp,
        maxHp: MOUNT_TYPES[mountType as keyof typeof MOUNT_TYPES].baseHp,
        hunger: 100,
        isActive: false
      }
    });

    this.emit('mountPurchased', { characterId, mountId: mount.id });
    return mount;
  }

  // ============================================
  // MOUNT ACTIONS
  // ============================================

  async summonMount(characterId: string): Promise<Mount> {
    const mount = await prisma.mount.findUnique({
      where: { characterId }
    });

    if (!mount) {
      throw new Error('Mount not found');
    }

    if (mount.hunger <= 0) {
      throw new Error('Mount is too hungry to summon. Please feed it.');
    }

    await prisma.mount.update({
      where: { id: mount.id },
      data: {
        isActive: true,
        summonedAt: new Date()
      }
    });

    this.emit('mountSummoned', { characterId, mountId: mount.id });
    return mount;
  }

  async dismissMount(characterId: string): Promise<Mount> {
    const mount = await prisma.mount.findUnique({
      where: { characterId }
    });

    if (!mount) {
      throw new Error('Mount not found');
    }

    await prisma.mount.update({
      where: { id: mount.id },
      data: {
        isActive: false,
        summonedAt: null
      }
    });

    this.emit('mountDismissed', { characterId, mountId: mount.id });
    return mount;
  }

  async feedMount(characterId: string, foodItemId: string): Promise<Mount> {
    const mount = await prisma.mount.findUnique({
      where: { characterId },
      include: { inventory: true }
    });

    if (!mount) {
      throw new Error('Mount not found');
    }

    // Simple feeding - different foods give different hunger
    const foodValues: Record<string, number> = {
      'item_herb': 10,
      'item_premium_herb': 20,
      'item_special_herb': 30
    };

    const hungerRestore = foodValues[foodItemId] || 10;

    const updatedMount = await prisma.mount.update({
      where: { id: mount.id },
      data: {
        hunger: Math.min(100, mount.hunger + hungerRestore),
        hp: Math.min(mount.maxHp, mount.hp + Math.floor(hungerRestore / 2))
      }
    });

    this.emit('mountFed', { characterId, mountId: mount.id, amount: hungerRestore });
    return updatedMount;
  }

  // ============================================
  // HUNGER SYSTEM
  // ============================================

  private startHungerSystem(): void {
    // Decrease mount hunger every minute
    setInterval(async () => {
      try {
        const mounts = await prisma.mount.findMany({
          where: { isActive: true }
        });

        for (const mount of mounts) {
          const newHunger = Math.max(0, mount.hunger - 1);

          await prisma.mount.update({
            where: { id: mount.id },
            data: {
              hunger: newHunger
            }
          });

          // Auto-dismount if hunger reaches 0
          if (newHunger === 0 && mount.isActive) {
            await this.dismissMount(mount.characterId);
          }
        }
      } catch (error) {
        logger.error('Mount hunger system error:', error);
      }
    }, 60000).unref?.(); // Every minute
  }

  // ============================================
  // MOUNT LEVELING
  // ============================================

  async addMountExp(mountId: string, exp: bigint): Promise<Mount> {
    const mount = await prisma.mount.findUnique({
      where: { id: mountId }
    });

    if (!mount) {
      throw new Error('Mount not found');
    }

    const newExp = mount.exp + exp;
    let newLevel = mount.level;

    // Level up thresholds
    const expThreshold = BigInt(mount.level * 100000);
    if (newExp >= expThreshold && mount.level < 35) {
      newLevel = mount.level + 1;

      // Increase stats on level up
      const config = MOUNT_TYPES[mount.mountType as keyof typeof MOUNT_TYPES];
      const hpIncrease = 10 + newLevel * 5;

      await prisma.mount.update({
        where: { id: mountId },
        data: {
          level: newLevel,
          exp: newExp,
          maxHp: config.baseHp + (newLevel * hpIncrease)
        }
      });

      this.emit('mountLevelUp', { mountId, newLevel });
    } else {
      await prisma.mount.update({
        where: { id: mountId },
        data: { exp: newExp }
      });
    }

    return await prisma.mount.findUnique({ where: { id: mountId } })!;
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  async getMountByCharacter(characterId: string): Promise<Prisma.MountGetPayload<{ include: { inventory: true } }> | null> {
    return await prisma.mount.findUnique({
      where: { characterId },
      include: { inventory: true }
    });
  }

  /**
   * Deposit an item into the mount's inventory
   */
  async depositItem(characterId: string, itemId: string, quantity: number = 1): Promise<MountInventory> {
    const mount = await prisma.mount.findUnique({
      where: { characterId }
    });

    if (!mount) {
      throw new Error('Mount not found');
    }

    const existingInventory = await prisma.mountInventory.findMany({
      where: { mountId: mount.id }
    });

    // Find first free slot
    const usedSlots = existingInventory.map(inv => inv.slot);
    let slot = 0;
    while (usedSlots.includes(slot)) {
      slot++;
    }

    return await prisma.mountInventory.create({
      data: {
        mountId: mount.id,
        itemId,
        slot,
        quantity
      }
    });
  }

  /**
   * Withdraw an item from the mount's inventory
   */
  async withdrawItem(characterId: string, mountInventoryId: string): Promise<void> {
    const mount = await prisma.mount.findUnique({
      where: { characterId }
    });

    if (!mount) {
      throw new Error('Mount not found');
    }

    const inventoryItem = await prisma.mountInventory.findUnique({
      where: { id: mountInventoryId }
    });

    if (!inventoryItem || inventoryItem.mountId !== mount.id) {
      throw new Error('Item not found in mount inventory');
    }

    await prisma.mountInventory.delete({
      where: { id: mountInventoryId }
    });

    this.emit('mountItemWithdrawn', { characterId, mountInventoryId });
  }

  async getMountSpeedBonus(characterId: string): Promise<number> {
    const mount = await this.getMountByCharacter(characterId);

    if (!mount || !mount.isActive) {
      return 0;
    }

    const config = MOUNT_TYPES[mount.mountType as keyof typeof MOUNT_TYPES];
    const speedBonus = config.baseSpeed + (mount.level * 0.1);

    return speedBonus;
  }
}

export default MountManager;
