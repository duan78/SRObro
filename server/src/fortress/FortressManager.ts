// ============================================
// SRObro - Fortress War Manager
// Manages fortress wars, registration, and tax collection
// ============================================

import { Fortress, FortressState } from '@prisma/client';
import { EventEmitter } from 'events';
import { prisma } from '../database/prisma';
import { createLogger } from '../core/Logger';

// Re-export for the fortress module index
export { FortressState };

const logger = createLogger('FortressManager');


export const FORTRESS_CONFIG = {
  jangan: {
    name: 'Jangan Fortress',
    level: 1,
    maxGuilds: 3,
    duration: 90, // minutes
    taxRange: [-20, 20],
    rewards: {
      dailyGold: 1000000n,
      exp: 100000n
    },
    registrationDay: 'Saturday',
    registrationHour: 18
  },
  hotan: {
    name: 'Hotan Fortress',
    level: 3,
    maxGuilds: 5,
    duration: 120,
    taxRange: [-20, 20],
    rewards: {
      dailyGold: 5000000n,
      exp: 500000n
    },
    registrationDay: 'Saturday',
    registrationHour: 18
  },
  bandit: {
    name: 'Bandit Fortress',
    level: 5,
    maxGuilds: 7,
    duration: 150,
    taxRange: [-20, 20],
    rewards: {
      dailyGold: 10000000n,
      exp: 1000000n
    },
    registrationDay: 'Saturday',
    registrationHour: 18
  }
};

export class FortressManager extends EventEmitter {
  private static instance: FortressManager;
  private warTimers: Map<string, NodeJS.Timeout> = new Map();

  private constructor() {
    super();
    // Promesse flottante catchée: un échec DB à l'init ne doit pas devenir
    // une unhandledRejection
    this.initializeFortresses().catch((error) =>
      logger.error('Fortress initialization failed:', error)
    );
    this.startWarScheduler();
  }

  static getInstance(): FortressManager {
    if (!FortressManager.instance) {
      FortressManager.instance = new FortressManager();
    }
    return FortressManager.instance;
  }

  // ============================================
  // FORTRESS INITIALIZATION
  // ============================================

  private async initializeFortresses(): Promise<void> {
    const fortresses = await prisma.fortress.count();

    if (fortresses === 0) {
      // Create default fortresses
      await prisma.fortress.createMany({
        data: [
          {
            name: FORTRESS_CONFIG.jangan.name,
            level: FORTRESS_CONFIG.jangan.level,
            nextWarTime: this.getNextWarTime('Saturday', 18),
            warDuration: FORTRESS_CONFIG.jangan.duration,
            registrationDay: FORTRESS_CONFIG.jangan.registrationDay,
            registrationHour: FORTRESS_CONFIG.jangan.registrationHour,
            state: FortressState.peace
          },
          {
            name: FORTRESS_CONFIG.hotan.name,
            level: FORTRESS_CONFIG.hotan.level,
            nextWarTime: this.getNextWarTime('Saturday', 18),
            warDuration: FORTRESS_CONFIG.hotan.duration,
            registrationDay: FORTRESS_CONFIG.hotan.registrationDay,
            registrationHour: FORTRESS_CONFIG.hotan.registrationHour,
            state: FortressState.peace
          },
          {
            name: FORTRESS_CONFIG.bandit.name,
            level: FORTRESS_CONFIG.bandit.level,
            nextWarTime: this.getNextWarTime('Saturday', 18),
            warDuration: FORTRESS_CONFIG.bandit.duration,
            registrationDay: FORTRESS_CONFIG.bandit.registrationDay,
            registrationHour: FORTRESS_CONFIG.bandit.registrationHour,
            state: FortressState.peace
          }
        ]
      });
    }
  }

  private getNextWarTime(day: string, hour: number): Date {
    const now = new Date();
    const nextWar = new Date();

    // Find the next occurrence of the specified day and hour
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const targetDay = daysOfWeek.indexOf(day);

    nextWar.setDate(now.getDate() + (targetDay + 7 - now.getDay()) % 7);
    nextWar.setHours(hour, 0, 0, 0);

    if (nextWar <= now) {
      nextWar.setDate(nextWar.getDate() + 7);
    }

    return nextWar;
  }

  // ============================================
  // FORTRESS REGISTRATION
  // ============================================

  async registerForFortress(fortressId: string, guildId: string, characterId?: string): Promise<void> {
    const fortress = await prisma.fortress.findUnique({
      where: { id: fortressId }
    });

    if (!fortress) {
      throw new Error('Fortress not found');
    }

    if (fortress.state !== FortressState.registration) {
      throw new Error('Fortress registration is not open');
    }

    // Check if guild is eligible (level 3+)
    const guild = await prisma.guild.findUnique({
      where: { id: guildId }
    });

    if (!guild || guild.level < 3) {
      throw new Error('Guild must be level 3 or higher to participate in fortress wars');
    }

    // Check if already registered
    const existingRegistration = await prisma.fortressRegistration.findUnique({
      where: {
        fortressId_guildId: {
          fortressId,
          guildId
        }
      }
    });

    if (existingRegistration) {
      throw new Error('Guild is already registered for this fortress');
    }

    // Check max guilds
    const registrations = await prisma.fortressRegistration.count({
      where: { fortressId }
    });

    const config = this.getFortressConfig(fortress.name);
    if (registrations >= config.maxGuilds) {
      throw new Error('Fortress is full');
    }

    // Register
    await prisma.fortressRegistration.create({
      data: {
        fortressId,
        guildId
      }
    });

    this.emit('fortressRegistered', { fortressId, guildId, characterId });
  }

  /**
   * Remove a guild's registration for a fortress war
   */
  async unregisterFromWar(fortressId: string, guildId: string): Promise<void> {
    await prisma.fortressRegistration.deleteMany({
      where: {
        fortressId,
        guildId
      }
    });

    this.emit('fortressUnregistered', { fortressId, guildId });
  }

  // ============================================
  // FORTRESS WAR EXECUTION
  // ============================================

  async startFortressWar(fortressId: string): Promise<void> {
    const fortress = await prisma.fortress.findUnique({
      where: { id: fortressId }
    });

    if (!fortress) {
      throw new Error('Fortress not found');
    }

    const registrations = await prisma.fortressRegistration.findMany({
      where: { fortressId }
    });

    if (registrations.length === 0) {
      // No registrations, skip war
      await this.scheduleNextWar(fortressId);
      return;
    }

    await prisma.fortress.update({
      where: { id: fortressId },
      data: {
        state: FortressState.active,
        lastWarAt: new Date()
      }
    });

    this.emit('fortressWarStarted', { fortressId });

    // Schedule war end
    const config = this.getFortressConfig(fortress.name);
    const warTimer = setTimeout(async () => {
      await this.endFortressWar(fortressId);
    }, config.duration * 60 * 1000);

    this.warTimers.set(fortressId, warTimer);
  }

  async endFortressWar(fortressId: string): Promise<void> {
    const fortress = await prisma.fortress.findUnique({
      where: { id: fortressId }
    });

    if (!fortress) {
      return;
    }

    // Determine winner (simplified - in reality would track points)
    // For now, first guild registered wins
    const registrations = await prisma.fortressRegistration.findMany({
      where: { fortressId }
    });
    const winnerGuildId = registrations[0]?.guildId;

    if (winnerGuildId) {
      // Update fortress owner
      await prisma.fortress.update({
        where: { id: fortressId },
        data: {
          ownerGuildId: winnerGuildId,
          state: FortressState.ended
        }
      });

      // Record in history
      await prisma.fortressHistory.create({
        data: {
          fortressId,
          guildId: winnerGuildId,
          capturedAt: new Date()
        }
      });

      this.emit('fortressCaptured', { fortressId, guildId: winnerGuildId });
    }

    // Clear registrations
    await prisma.fortressRegistration.deleteMany({
      where: { fortressId }
    });

    // Schedule next war
    await this.scheduleNextWar(fortressId);
  }

  private async scheduleNextWar(fortressId: string): Promise<void> {
    const fortress = await prisma.fortress.findUnique({
      where: { id: fortressId }
    });

    if (!fortress) {
      return;
    }

    const nextWarTime = this.getNextWarTime(
      fortress.registrationDay,
      fortress.registrationHour
    );

    await prisma.fortress.update({
      where: { id: fortressId },
      data: {
        nextWarTime,
        state: FortressState.peace
      }
    });

    // Set up registration period (6 hours before war)
    const registrationTime = new Date(nextWarTime);
    registrationTime.setHours(registrationTime.getHours() - 6);

    const registrationTimer = setTimeout(async () => {
      await this.openRegistration(fortressId);
    }, registrationTime.getTime() - Date.now());

    // Set up war start
    const warTimer = setTimeout(async () => {
      await this.startFortressWar(fortressId);
    }, nextWarTime.getTime() - Date.now());

    this.warTimers.set(fortressId + '_registration', registrationTimer);
    this.warTimers.set(fortressId + '_war', warTimer);
  }

  private async openRegistration(fortressId: string): Promise<void> {
    await prisma.fortress.update({
      where: { id: fortressId },
      data: { state: FortressState.registration }
    });

    this.emit('fortressRegistrationOpened', { fortressId });

    // 30 minutes after registration opens, preparation phase begins
    setTimeout(async () => {
      await prisma.fortress.update({
        where: { id: fortressId },
        data: { state: FortressState.preparation }
      });

      this.emit('fortressPreparationStarted', { fortressId });
    }, 30 * 60 * 1000); // 30 minutes
  }

  // ============================================
  // TAX COLLECTION
  // ============================================

  async collectTaxes(fortressId: string): Promise<bigint> {
    const fortress = await prisma.fortress.findUnique({
      where: { id: fortressId }
    });

    if (!fortress || !fortress.ownerGuildId) {
      throw new Error('Fortress has no owner');
    }

    const config = this.getFortressConfig(fortress.name);

    // Calculate tax amount (simplified - would be based on NPC trades)
    const taxAmount = config.rewards.dailyGold;

    // Add to guild storage
    await prisma.guildStorage.upsert({
      where: { guildId: fortress.ownerGuildId },
      create: {
        guildId: fortress.ownerGuildId,
        gold: taxAmount,
        items: []
      },
      update: {
        gold: { increment: taxAmount }
      }
    });

    this.emit('fortressTaxCollected', {
      fortressId,
      guildId: fortress.ownerGuildId,
      amount: taxAmount
    });

    return taxAmount;
  }

  async setTaxRate(fortressId: string, guildId: string, taxRate: number): Promise<void> {
    const fortress = await prisma.fortress.findUnique({
      where: { id: fortressId }
    });

    if (!fortress || fortress.ownerGuildId !== guildId) {
      throw new Error('Your guild does not own this fortress');
    }

    const config = this.getFortressConfig(fortress.name);

    if (taxRate < config.taxRange[0] || taxRate > config.taxRange[1]) {
      throw new Error(`Tax rate must be between ${config.taxRange[0]}% and ${config.taxRange[1]}%`);
    }

    await prisma.fortress.update({
      where: { id: fortressId },
      data: { taxRate }
    });

    this.emit('fortressTaxRateChanged', { fortressId, taxRate });
  }

  /**
   * Collect taxes on behalf of the owning guild (ownership-checked wrapper around collectTaxes)
   */
  async collectTax(fortressId: string, guildId: string): Promise<bigint> {
    const fortress = await prisma.fortress.findUnique({
      where: { id: fortressId }
    });

    if (!fortress || fortress.ownerGuildId !== guildId) {
      throw new Error('Your guild does not own this fortress');
    }

    return this.collectTaxes(fortressId);
  }

  /**
   * Get the current tax revenue rate of a fortress (0 if unknown)
   */
  async getTaxRevenue(fortressId: string): Promise<number> {
    const fortress = await prisma.fortress.findUnique({
      where: { id: fortressId }
    });

    return fortress ? fortress.taxRate : 0;
  }

  // ============================================
  // SCHEDULING
  // ============================================

  private startWarScheduler(): void {
    // Check every minute if a fortress war needs to start
    setInterval(async () => {
      try {
        const fortresses = await prisma.fortress.findMany();

        for (const fortress of fortresses) {
          const now = new Date();

          // Check if it's time for the next war
          if (fortress.state === FortressState.peace && fortress.nextWarTime <= now) {
            await this.startFortressWar(fortress.id);
          }
        }
      } catch (error) {
        // Une erreur DB ponctuelle ne doit pas tuer le process
        logger.error('Fortress war scheduler error:', error);
      }
    }, 60000).unref?.(); // Check every minute
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  getFortressConfig(fortressName: string): any {
    const nameLower = fortressName.toLowerCase();
    if (nameLower.includes('jangan')) return FORTRESS_CONFIG.jangan;
    if (nameLower.includes('hotan')) return FORTRESS_CONFIG.hotan;
    if (nameLower.includes('bandit')) return FORTRESS_CONFIG.bandit;
    return FORTRESS_CONFIG.jangan; // Default
  }

  async getFortressById(fortressId: string): Promise<Fortress | null> {
    return await prisma.fortress.findUnique({
      where: { id: fortressId }
    });
  }

  async getFortressByName(fortressName: string): Promise<Fortress | null> {
    return await prisma.fortress.findFirst({
      where: { name: fortressName }
    });
  }

  async getAllFortresses(): Promise<Fortress[]> {
    return await prisma.fortress.findMany();
  }

  async getFortressRegistrations(fortressId: string): Promise<any[]> {
    const registrations = await prisma.fortressRegistration.findMany({
      where: { fortressId }
    });

    // Guild/Members/Character relations live on their own models, so enrich each registration
    return Promise.all(registrations.map(async (registration) => ({
      ...registration,
      guild: await prisma.guild.findUnique({
        where: { id: registration.guildId },
        include: {
          members: {
            include: {
              character: {
                select: {
                  id: true,
                  name: true,
                  level: true
                }
              }
            }
          }
        }
      })
    })));
  }
}

export default FortressManager;
