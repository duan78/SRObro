// ============================================
// SRObro - Job System Manager
// Handles Trader/Thief/Hunter triangle conflict
// ============================================

import { PrismaClient } from '@prisma/client';
import { TRADE_GOODS } from '../../../shared/src/constants';

export type JobType = 'trader' | 'thief' | 'hunter' | 'none';

export interface TransportConfig {
  type: 'one_star' | 'two_star' | 'three_star' | 'four_star' | 'five_star';
  hp: number;
  slots: number;
  cost: number;
  requiredLevel: number;
  requiredJobLevel: number;
}

export interface TradeGoodData {
  id: string;
  name: string;
  buyPrice: number;
  sellPrice: number;
  sourceZone: string;
  quantity: number;
}

export interface TransportData {
  id: string;
  characterId: string;
  transportType: string;
  starLevel: number;
  hp: number;
  maxHp: number;
  position: { x: number; y: number; z: number };
  zoneId: string;
  goods: TradeGoodData[];
  isActive: boolean;
}

// Transport configurations based on star level
const TRANSPORT_CONFIGS: Record<string, TransportConfig> = {
  one_star: { type: 'one_star', hp: 5000, slots: 9, cost: 100000, requiredLevel: 20, requiredJobLevel: 1 },
  two_star: { type: 'two_star', hp: 10000, slots: 18, cost: 500000, requiredLevel: 30, requiredJobLevel: 2 },
  three_star: { type: 'three_star', hp: 20000, slots: 27, cost: 1500000, requiredLevel: 40, requiredJobLevel: 3 },
  four_star: { type: 'four_star', hp: 40000, slots: 36, cost: 4000000, requiredLevel: 50, requiredJobLevel: 4 },
  five_star: { type: 'five_star', hp: 80000, slots: 45, cost: 10000000, requiredLevel: 60, requiredJobLevel: 5 },
};

/**
 * JobManager - Manages the Job Triangle Conflict System
 *
 * Three Jobs:
 * - TRADER: Buy goods, transport between cities, sell for profit
 * - THIEF: Attack traders, steal goods, sell at Thief Village
 * - HUNTER: Protect traders, attack thieves, earn rewards
 *
 * Transports (1-5 stars):
 * - More stars = more HP, more slots, higher level requirement
 * - Traders can have one transport at a time
 * - Transport death = goods lost
 */
export class JobManager {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Change character's job
   */
  async changeJob(
    characterId: string,
    newJob: JobType
  ): Promise<void> {
    // Check if character already has this job
    const existingJobState = await this.prisma.jobState.findUnique({
      where: { characterId }
    });

    if (existingJobState) {
      if (existingJobState.jobType === newJob) {
        throw new Error('Character already has this job');
      }

      // Check if character has active transport
      if (newJob !== 'trader') {
        const activeTransport = await this.prisma.transport.findFirst({
          where: {
            characterId,
            isActive: true
          }
        });

        if (activeTransport) {
          throw new Error('Cannot change job while transport is active');
        }
      }

      // Update job
      await this.prisma.jobState.update({
        where: { characterId },
        data: {
          jobType: newJob,
          level: 1,
          exp: BigInt(0),
          contribution: BigInt(0)
        }
      });
    } else {
      // Create new job state
      await this.prisma.jobState.create({
        data: {
          characterId,
          jobType: newJob,
          level: 1,
          exp: BigInt(0),
          contribution: BigInt(0)
        }
      });
    }
  }

  /**
   * Get job state for a character
   */
  async getJobState(characterId: string): Promise<{
    jobType: JobType;
    level: number;
    exp: number;
    contribution: number;
  } | null> {
    const jobState = await this.prisma.jobState.findUnique({
      where: { characterId }
    });

    if (!jobState) {
      return null;
    }

    return {
      jobType: jobState.jobType as JobType,
      level: jobState.level,
      exp: Number(jobState.exp),
      contribution: Number(jobState.contribution)
    };
  }

  /**
   * Create a transport for a trader
   */
  async createTransport(
    characterId: string,
    starLevel: number,
    position: { x: number; y: number; z: number },
    zoneId: string
  ): Promise<TransportData> {
    // Verify character is a trader
    const jobState = await this.prisma.jobState.findUnique({
      where: { characterId }
    });

    if (!jobState || jobState.jobType !== 'trader') {
      throw new Error('Only traders can create transports');
    }

    // Check if character already has an active transport
    const existingTransport = await this.prisma.transport.findFirst({
      where: {
        characterId,
        isActive: true
      }
    });

    if (existingTransport) {
      throw new Error('Character already has an active transport');
    }

    // Get transport config
    // (validated against TRANSPORT_CONFIGS below, so the template string maps to a valid star type)
    const transportType = `${starLevel}_star` as TransportConfig['type'];
    const config = TRANSPORT_CONFIGS[transportType];

    if (!config) {
      throw new Error('Invalid star level');
    }

    // Check level requirements
    const character = await this.prisma.character.findUnique({
      where: { id: characterId }
    });

    if (!character) {
      throw new Error('Character not found');
    }

    if (character.level < config.requiredLevel) {
      throw new Error(`Character must be level ${config.requiredLevel} to use this transport`);
    }

    if (jobState.level < config.requiredJobLevel) {
      throw new Error(`Job level ${config.requiredJobLevel} required`);
    }

    // Check character has enough gold
    if (Number(character.gold) < config.cost) {
      throw new Error(`Not enough gold (requires ${config.cost})`);
    }

    // Deduct gold and create transport
    await this.prisma.$transaction([
      // Deduct gold
      this.prisma.character.update({
        where: { id: characterId },
        data: { gold: { decrement: BigInt(config.cost) } }
      }),
      // Create transport
      this.prisma.transport.create({
        data: {
          characterId,
          transportType,
          starLevel,
          hp: config.hp,
          maxHp: config.hp,
          positionX: position.x,
          positionY: position.y,
          positionZ: position.z,
          zoneId,
          inventorySlots: JSON.stringify([]),
          isActive: true
        }
      })
    ]);

    return {
      id: characterId, // Will be set by DB
      characterId,
      transportType,
      starLevel,
      hp: config.hp,
      maxHp: config.hp,
      position,
      zoneId,
      goods: [],
      isActive: true
    };
  }

  /**
   * Add goods to transport
   */
  async addGoodsToTransport(
    characterId: string,
    itemId: string,
    sourceZone: string,
    quantity: number = 1
  ): Promise<void> {
    // Get transport
    const transport = await this.prisma.transport.findFirst({
      where: {
        characterId,
        isActive: true
      }
    });

    if (!transport) {
      throw new Error('No active transport found');
    }

    // Get transport config
    const config = TRANSPORT_CONFIGS[transport.transportType];
    const currentGoods = JSON.parse((transport.inventorySlots || '[]') as string) as TradeGoodData[];

    if (currentGoods.length >= config.slots) {
      throw new Error('Transport is full');
    }

    // Get item data
    const item = await this.prisma.item.findUnique({
      where: { id: itemId }
    });

    if (!item) {
      throw new Error('Item not found');
    }

    // Get trade good data for this zone
    const zoneGoods = this.getTradeGoodsForZone(sourceZone);
    const goodData = zoneGoods.find(g => g.id === `good_${item.name.toLowerCase().replace(/\s/g, '_')}`);

    if (!goodData) {
      throw new Error('Item cannot be traded');
    }

    // Add to transport
    currentGoods.push({
      id: itemId,
      name: item.name,
      buyPrice: goodData.buyPrice,
      sellPrice: goodData.sellPrice,
      sourceZone,
      quantity
    });

    await this.prisma.transport.update({
      where: { id: transport.id },
      data: {
        inventorySlots: JSON.stringify(currentGoods)
      }
    });
  }

  /**
   * Remove goods from transport (when sold or stolen)
   */
  async removeGoodsFromTransport(
    characterId: string,
    itemId: string,
    quantity: number = 1
  ): Promise<void> {
    const transport = await this.prisma.transport.findFirst({
      where: {
        characterId,
        isActive: true
      }
    });

    if (!transport) {
      throw new Error('No active transport found');
    }

    const currentGoods = JSON.parse((transport.inventorySlots || '[]') as string) as TradeGoodData[];
    const goodIndex = currentGoods.findIndex(g => g.id === itemId);

    if (goodIndex === -1) {
      throw new Error('Goods not found in transport');
    }

    const good = currentGoods[goodIndex];
    if (good.quantity < quantity) {
      throw new Error('Not enough goods');
    }

    if (good.quantity === quantity) {
      currentGoods.splice(goodIndex, 1);
    } else {
      good.quantity -= quantity;
    }

    await this.prisma.transport.update({
      where: { id: transport.id },
      data: {
        inventorySlots: JSON.stringify(currentGoods)
      }
    });
  }

  /**
   * Sell goods at destination
   */
  async sellGoods(
    characterId: string,
    destinationZone: string
  ): Promise<{
    totalProfit: number;
    jobExp: number;
    soldItems: Array<{ name: string; quantity: number; profit: number }>;
  }> {
    const transport = await this.prisma.transport.findFirst({
      where: {
        characterId,
        isActive: true
      }
    });

    if (!transport) {
      throw new Error('No active transport found');
    }

    const goods = JSON.parse((transport.inventorySlots || '[]') as string) as TradeGoodData[];

    if (goods.length === 0) {
      throw new Error('No goods to sell');
    }

    let totalProfit = 0;
    const soldItems: Array<{ name: string; quantity: number; profit: number }> = [];

    for (const good of goods) {
      // Calculate profit based on destination
      const multiplier = this.getProfitMultiplier(good.sourceZone, destinationZone);
      const sellPrice = Math.floor(good.sellPrice * multiplier);
      const profit = (sellPrice - good.buyPrice) * good.quantity;

      totalProfit += profit;
      soldItems.push({
        name: good.name,
        quantity: good.quantity,
        profit
      });
    }

    // Add gold to character
    await this.prisma.character.update({
      where: { id: characterId },
      data: {
        gold: { increment: BigInt(totalProfit) }
      }
    });

    // Add job exp
    const jobExp = Math.floor(totalProfit / 100);
    await this.addJobExp(characterId, jobExp);

    // Clear transport goods
    await this.prisma.transport.update({
      where: { id: transport.id },
      data: {
        inventorySlots: JSON.stringify([])
      }
    });

    return {
      totalProfit,
      jobExp,
      soldItems
    };
  }

  /**
   * Steal goods from trader (thief action)
   */
  async stealGoods(
    thiefCharacterId: string,
    traderCharacterId: string
  ): Promise<Array<{
    itemId: string;
    name: string;
    quantity: number;
    value: number
  }>> {
    // Verify thief is actually a thief
    const thiefJobState = await this.prisma.jobState.findUnique({
      where: { characterId: thiefCharacterId }
    });

    if (!thiefJobState || thiefJobState.jobType !== 'thief') {
      throw new Error('Only thieves can steal goods');
    }

    // Get trader's transport
    const transport = await this.prisma.transport.findFirst({
      where: {
        characterId: traderCharacterId,
        isActive: true
      }
    });

    if (!transport) {
      throw new Error('Trader has no active transport');
    }

    const goods = JSON.parse((transport.inventorySlots || '[]') as string) as TradeGoodData[];

    if (goods.length === 0) {
      throw new Error('No goods to steal');
    }

    // Thieves get 30% of goods
    const stolenGoods: Array<{ itemId: string; name: string; quantity: number; value: number }> = [];
    const stealPercentage = 0.3;
    const goodsToSteal = Math.ceil(goods.length * stealPercentage);

    // Shuffle goods and select random ones
    const shuffled = [...goods].sort(() => Math.random() - 0.5);

    for (let i = 0; i < Math.min(goodsToSteal, shuffled.length); i++) {
      const good = shuffled[i];
      const stealQuantity = Math.ceil(good.quantity * 0.5); // Steal 50% of each good

      stolenGoods.push({
        itemId: good.id,
        name: good.name,
        quantity: stealQuantity,
        value: good.buyPrice * stealQuantity
      });

      // Remove stolen goods from transport
      await this.removeGoodsFromTransport(traderCharacterId, good.id, stealQuantity);
    }

    // Add job exp to thief
    const stolenValue = stolenGoods.reduce((sum, g) => sum + g.value, 0);
    await this.addJobExp(thiefCharacterId, Math.floor(stolenValue / 50));

    return stolenGoods;
  }

  /**
   * Hunter reward for killing thief
   */
  async hunterReward(
    hunterCharacterId: string,
    thiefCharacterId: string
  ): Promise<{
    expReward: number;
    goldReward: number;
    jobExpReward: number;
  }> {
    // Verify hunter is actually a hunter
    const hunterJobState = await this.prisma.jobState.findUnique({
      where: { characterId: hunterCharacterId }
    });

    if (!hunterJobState || hunterJobState.jobType !== 'hunter') {
      throw new Error('Only hunters get hunter rewards');
    }

    const thief = await this.prisma.character.findUnique({
      where: { id: thiefCharacterId }
    });

    if (!thief) {
      throw new Error('Thief not found');
    }

    // Calculate rewards
    const expReward = thief.level * 1000;
    const goldReward = thief.level * 500;
    const jobExpReward = thief.level * 50;

    // Grant rewards
    await this.prisma.character.update({
      where: { id: hunterCharacterId },
      data: {
        exp: { increment: BigInt(expReward) },
        gold: { increment: BigInt(goldReward) }
      }
    });

    await this.addJobExp(hunterCharacterId, jobExpReward);

    return {
      expReward,
      goldReward,
      jobExpReward
    };
  }

  /**
   * Add job experience
   */
  private async addJobExp(characterId: string, exp: number): Promise<void> {
    const jobState = await this.prisma.jobState.findUnique({
      where: { characterId }
    });

    if (!jobState) {
      return;
    }

    const newExp = Number(jobState.exp) + exp;
    const newLevel = this.calculateJobLevel(newExp);

    await this.prisma.jobState.update({
      where: { characterId },
      data: {
        exp: BigInt(newExp),
        level: newLevel
      }
    });
  }

  /**
   * Calculate job level from exp
   */
  private calculateJobLevel(exp: number): number {
    // Simple formula: each level requires 1000 * level exp
    let level = 1;
    let requiredExp = 0;

    while (level < 5) {
      requiredExp = level * 1000;
      if (exp < requiredExp) break;
      level++;
    }

    return Math.min(level, 5);
  }

  /**
   * Get profit multiplier for trade route
   */
  private getProfitMultiplier(sourceZone: string, destinationZone: string): number {
    // Different routes have different profit multipliers
    const routes: Record<string, Record<string, number>> = {
      'Jangan': {
        'Donwhang': 1.5,
        'Hotan': 2.0
      },
      'Donwhang': {
        'Jangan': 1.4,
        'Hotan': 1.6
      },
      'Hotan': {
        'Jangan': 2.2,
        'Donwhang': 1.7
      }
    };

    return routes[sourceZone]?.[destinationZone] || 1.0;
  }

  /**
   * Get trade goods available in a zone
   */
  getTradeGoodsForZone(zoneId: string): ReadonlyArray<{
    id: string;
    name: string;
    buyPrice: number;
    sellPrice: number;
  }> {
    const zoneMap: Record<string, keyof typeof TRADE_GOODS> = {
      'zone_jangan': 'JANGAN',
      'zone_donwhang': 'DONWHANG',
      'zone_hotan': 'HOTAN'
    };

    const zoneKey = zoneMap[zoneId];
    if (!zoneKey) {
      return [];
    }

    return TRADE_GOODS[zoneKey as keyof typeof TRADE_GOODS] || [];
  }

  /**
   * Destroy transport (when killed)
   */
  async destroyTransport(characterId: string): Promise<void> {
    const transport = await this.prisma.transport.findFirst({
      where: {
        characterId,
        isActive: true
      }
    });

    if (!transport) {
      return;
    }

    // Lose all goods
    await this.prisma.transport.update({
      where: { id: transport.id },
      data: {
        isActive: false,
        inventorySlots: JSON.stringify([])
      }
    });
  }

  /**
   * Get transport data
   */
  async getTransport(characterId: string): Promise<TransportData | null> {
    const transport = await this.prisma.transport.findFirst({
      where: {
        characterId,
        isActive: true
      }
    });

    if (!transport) {
      return null;
    }

    return {
      id: transport.id,
      characterId: transport.characterId,
      transportType: transport.transportType,
      starLevel: transport.starLevel,
      hp: transport.hp,
      maxHp: transport.maxHp,
      position: {
        x: transport.positionX,
        y: transport.positionY,
        z: transport.positionZ
      },
      zoneId: transport.zoneId,
      goods: JSON.parse((transport.inventorySlots || '[]') as string) as TradeGoodData[],
      isActive: transport.isActive
    };
  }
}
