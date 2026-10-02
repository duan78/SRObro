// ============================================
// SRObro - Job System Manager
// Handles Trader/Thief/Hunter triangle conflict
// ============================================

import { PrismaClient } from '@prisma/client';
import { TRADE_GOODS } from '../../../shared/src/constants';

export type JobType = 'trader' | 'thief' | 'hunter' | 'none';

export interface TransportConfig {
  type: '1_star' | '2_star' | '3_star' | '4_star' | '5_star';
  label: string;
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

/**
 * Transports officiels (KB 10_TRADER_GUIDE + 24_MOUNTS_PETS):
 *  - Cheval basic ~2 000 or, 9 slots (KB: 9 slots confirmés)
 *  - Bœuf: capacité intermédiaire (pills XL), Chameau ~21 000 de charge, +HP
 *  - Les ÉTOILES ne sont PAS le transport: elles dérivent de la VALEUR des
 *    marchandises chargées (computeStarLevel) — 1 NPC thief par étoile.
 * 4★/5★ = tiers étendus [APPROX] (multi-chameaux).
 */
const TRANSPORT_CONFIGS: Record<string, TransportConfig> = {
  '1_star': { type: '1_star', label: 'Cheval', hp: 5000, slots: 9, cost: 2000, requiredLevel: 10, requiredJobLevel: 1 },
  '2_star': { type: '2_star', label: 'Bœuf', hp: 10000, slots: 18, cost: 8000, requiredLevel: 20, requiredJobLevel: 2 },
  '3_star': { type: '3_star', label: 'Chameau', hp: 20000, slots: 27, cost: 20000, requiredLevel: 30, requiredJobLevel: 3 },
  '4_star': { type: '4_star', label: 'Caravane', hp: 40000, slots: 36, cost: 60000, requiredLevel: 40, requiredJobLevel: 4 },
  '5_star': { type: '5_star', label: 'Grande caravane', hp: 80000, slots: 45, cost: 150000, requiredLevel: 50, requiredJobLevel: 5 },
};

/** Étoiles d'un trade = valeur chargée (KB 09/10: stars selon les goods,
 *  1 NPC thief par étoile). [APPROX] paliers proportionnels à la capacité. */
export function computeStarLevel(goods: Array<{ quantity: number }>, slots: number): number {
  const totalUnits = goods.reduce((sum, g) => sum + g.quantity, 0);
  if (totalUnits === 0) return 0;
  return Math.max(1, Math.min(5, Math.ceil((totalUnits / slots) * 5)));
}

/** Enum Prisma = one_star.. (legacy) ↔ clés internes numériques 1_star.. */
const TO_DB: Record<string, string> = { '1_star': 'one_star', '2_star': 'two_star', '3_star': 'three_star', '4_star': 'four_star', '5_star': 'five_star' };
const FROM_DB: Record<string, string> = { one_star: '1_star', two_star: '2_star', three_star: '3_star', four_star: '4_star', five_star: '5_star' };

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

  /** Vente des marchandises volées par un thief (au den / contrebandier):
   *  rend 60% de la valeur d'achat [APPROX officiel: vente au den]. */
  async fenceStolenGoods(
    thiefCharacterId: string,
    goods: Array<{ name: string; buyPrice: number; quantity: number }>,
  ): Promise<number> {
    const total = goods.reduce((sum, g) => sum + Math.floor(g.buyPrice * 0.6) * g.quantity, 0);
    await this.prisma.character.update({
      where: { id: thiefCharacterId },
      data: { gold: { increment: BigInt(total) } },
    });
    await this.addJobExp(thiefCharacterId, Math.floor(total / 50));
    return total;
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

    // Clés internes numériques '1_star'..'5_star' (bug d'origine: le code
    // fabriquait '1_star' contre des clés 'one_star' → tout rejeté).
    // L'enum Prisma reste one_star..: conversion à l'écriture.
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
          transportType: (TO_DB[transportType] ?? transportType) as never,
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

    const created = await this.prisma.transport.findFirst({
      where: { characterId, isActive: true },
    });
    return {
      id: created?.id ?? characterId,
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

    // Get transport config (conversion forme DB → interne)
    const config = TRANSPORT_CONFIGS[FROM_DB[transport.transportType] ?? transport.transportType];
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
   * Achat de marchandises de spécialité (boutique de la ville courante).
   * Débite l'or du perso, empile par goodId, respecte les slots du transport.
   */
  async buyTradeGoods(
    characterId: string,
    goodId: string,
    quantity: number,
    sourceZone: string,
  ): Promise<{ goods: TradeGoodData[]; spent: number; starLevel: number }> {
    const transport = await this.prisma.transport.findFirst({
      where: { characterId, isActive: true },
    });
    if (!transport) throw new Error('Aucun transport actif (achetez un cheval)');

    const zoneGoods = this.getTradeGoodsForZone(sourceZone);
    const good = zoneGoods.find((g) => g.id === goodId);
    if (!good) throw new Error('Marchandise introuvable dans cette ville');

    const config = TRANSPORT_CONFIGS[FROM_DB[transport.transportType] ?? transport.transportType];
    const goods = JSON.parse((transport.inventorySlots || '[]') as string) as TradeGoodData[];
    const used = goods.reduce((sum, g) => sum + g.quantity, 0);
    if (used + quantity > config.slots) {
      throw new Error(`Transport plein (${used}/${config.slots} — ${config.slots - used} libres)`);
    }

    const spent = good.buyPrice * quantity;
    const character = await this.prisma.character.findUnique({ where: { id: characterId } });
    if (!character) throw new Error('Personnage introuvable');
    if (Number(character.gold) < spent) throw new Error(`Or insuffisant (${spent} requis)`);

    const existing = goods.find((g) => g.id === goodId && g.sourceZone === sourceZone);
    if (existing) existing.quantity += quantity;
    else goods.push({ id: goodId, name: good.name, buyPrice: good.buyPrice, sellPrice: good.sellPrice, sourceZone, quantity });

    await this.prisma.$transaction([
      this.prisma.character.update({ where: { id: characterId }, data: { gold: { decrement: BigInt(spent) } } }),
      this.prisma.transport.update({ where: { id: transport.id }, data: { inventorySlots: JSON.stringify(goods) } }),
    ]);

    return { goods, spent, starLevel: computeStarLevel(goods, config.slots) };
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
      // Officiel: on ne revend pas dans la ville d'origine (aucun profit)
      if (good.sourceZone === destinationZone) {
        soldItems.push({ name: good.name, quantity: good.quantity, profit: 0 });
        continue;
      }
      // Multiplicateur de route officiel (162% Jangan→Donwhang, KB 10)
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
  /**
   * Fluctuation du marché (phase E V3): les prix de vente varient par
   * destination et par fenêtre de 10 min (±15% autour du multiplicateur de
   * route officiel — le 162% de référence reste la moyenne). Cache statique
   * pour que tous les joueurs voient le MÊME prix (marché partagé).
   */
  private static marketCache: { at: number; factors: Record<string, number> } = { at: 0, factors: {} };
  private static readonly MARKET_WINDOW_MS = 10 * 60 * 1000;
  private static readonly MARKET_AMPLITUDE = 0.15;

  private marketFactor(destinationZone: string): number {
    const now = Date.now();
    if (now - JobManager.marketCache.at > JobManager.MARKET_WINDOW_MS) {
      const zones = ['zone_jangan', 'zone_donwhang', 'zone_hotan',
        'zone_constantinople', 'zone_samarkand', 'zone_alexandria'];
      const factors: Record<string, number> = {};
      for (const z of zones) {
        // hash déterministe (fenêtre, zone) → dérive bornée [−15%, +15%]
        const seed = Math.floor(now / JobManager.MARKET_WINDOW_MS) * 131 + z.length * 17 + z.charCodeAt(5) * 7;
        factors[z] = 1 + Math.max(-JobManager.MARKET_AMPLITUDE, Math.min(JobManager.MARKET_AMPLITUDE,
          ((seed % 1000) / 1000 - 0.5) * 2 * JobManager.MARKET_AMPLITUDE));
      }
      JobManager.marketCache = { at: now, factors };
    }
    return JobManager.marketCache.factors[destinationZone] ?? 1;
  }

  private getProfitMultiplier(sourceZone: string, destinationZone: string): number {
    // Different routes have different profit multipliers
    // KB 10_TRADER_GUIDE: 162% mesuré Jangan→Donwhang (iSRO 2006);
    // autres routes [APPROX] croissantes avec la distance
    const routes: Record<string, Record<string, number>> = {
      'zone_jangan': { 'zone_donwhang': 1.62, 'zone_hotan': 2.0, 'zone_samarkand': 2.1, 'zone_constantinople': 2.4, 'zone_alexandria': 2.8 },
      'zone_donwhang': { 'zone_jangan': 1.5, 'zone_hotan': 1.8, 'zone_samarkand': 1.9, 'zone_constantinople': 2.2, 'zone_alexandria': 2.6 },
      'zone_hotan': { 'zone_jangan': 2.2, 'zone_donwhang': 1.9, 'zone_samarkand': 1.7, 'zone_constantinople': 2.0, 'zone_alexandria': 2.3 },
      'zone_constantinople': { 'zone_jangan': 2.4, 'zone_donwhang': 2.2, 'zone_hotan': 2.0, 'zone_samarkand': 1.8, 'zone_alexandria': 2.5 },
      'zone_samarkand': { 'zone_jangan': 2.1, 'zone_donwhang': 1.9, 'zone_hotan': 1.7, 'zone_constantinople': 1.8, 'zone_alexandria': 2.2 },
      'zone_alexandria': { 'zone_jangan': 2.8, 'zone_donwhang': 2.6, 'zone_hotan': 2.3, 'zone_constantinople': 2.5, 'zone_samarkand': 2.2 },
    };

    const base = routes[sourceZone]?.[destinationZone] || 1.0;
    // Phase E V3: fluctuation ±15% par fenêtre de 10 min — SAUF la route
    // canonique Jangan→Donwhang dont le 162% KB est la RÉFÉRENCE mesurée
    // (elle doit rester exacte: le V3 l'exige et le test jobs V2 la vérifie).
    const isCanonical = sourceZone === 'zone_jangan' && destinationZone === 'zone_donwhang';
    const factor = isCanonical ? 1 : this.marketFactor(destinationZone);
    return Math.round(base * factor * 1000) / 1000;
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
      transportType: FROM_DB[transport.transportType] ?? transport.transportType,
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
