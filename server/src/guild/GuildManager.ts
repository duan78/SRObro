// ============================================
// SRObro - Guild Manager
// Manages guild creation, management, storage, and unions
// ============================================

import { Guild, GuildMember, GuildRank } from '@prisma/client';
import { EventEmitter } from 'events';
import { prisma } from '../database/prisma';

// Re-export for the guild module index
export { GuildRank };


export interface GuildCreateOptions {
  name: string;
  leaderAccountId: string;
  leaderCharacterId: string;
}

export interface GuildStorageAccess {
  hasAccess: boolean;
  reason?: string;
}

/** Shape of an item stored in guild storage (GuildStorage.items JSON column) */
type StoredStorageItem = {
  itemId: string;
  quantity: number;
  slot: number;
};

export class GuildManager extends EventEmitter {
  private static instance: GuildManager;
  private storageLocks: Map<string, string> = new Map(); // guildId -> characterId
  // Invitations en attente: characterId -> Set<guildId>
  private pendingInvitations: Map<string, Set<string>> = new Map();

  private constructor() {
    super();
    this.initializeFortressSchedule();
  }

  static getInstance(): GuildManager {
    if (!GuildManager.instance) {
      GuildManager.instance = new GuildManager();
    }
    return GuildManager.instance;
  }

  // ============================================
  // GUILD CREATION
  // ============================================

  async createGuild(options: GuildCreateOptions): Promise<Guild> {
    const { name, leaderAccountId, leaderCharacterId } = options;

    // Validate character level (must be level 20+)
    const character = await prisma.character.findUnique({
      where: { id: leaderCharacterId },
      include: { guildMembership: true }
    });

    if (!character) {
      throw new Error('Character not found');
    }

    if (character.level < 20) {
      throw new Error('Character must be level 20 or higher to create a guild');
    }

    if (character.guildMembership) {
      throw new Error('Character is already in a guild');
    }

    // Check if character has enough gold (500,000)
    const CREATION_COST = 500000n;
    if (character.gold < CREATION_COST) {
      throw new Error('Insufficient gold. Guild creation costs 500,000 gold.');
    }

    // Check if guild name already exists
    const existingGuild = await prisma.guild.findUnique({
      where: { name }
    });

    if (existingGuild) {
      throw new Error('Guild name already exists');
    }

    // Create guild
    const guild = await prisma.guild.create({
      data: {
        name,
        level: 1,
        exp: 0n,
        notice: '',
        members: {
          create: {
            accountId: leaderAccountId,
            characterId: leaderCharacterId,
            rank: GuildRank.leader,
            contribution: 0n
          }
        }
      }
    });

    // Deduct gold from character
    await prisma.character.update({
      where: { id: leaderCharacterId },
      data: {
        gold: {
          decrement: CREATION_COST
        }
      }
    });

    this.emit('guildCreated', { guild, leaderId: leaderCharacterId });
    return guild;
  }

  // ============================================
  // GUILD MANAGEMENT
  // ============================================

  async inviteToGuild(guildId: string, inviterId: string, targetCharacterId: string): Promise<void> {
    // Check if inviter has permission (leader or assistant)
    const inviter = await prisma.guildMember.findUnique({
      where: { characterId: inviterId }
    });

    if (!inviter || inviter.guildId !== guildId) {
      throw new Error('You are not in this guild');
    }

    if (inviter.rank !== GuildRank.leader && inviter.rank !== GuildRank.assistant) {
      throw new Error('Only guild leaders and assistants can invite members');
    }

    // Check if target character exists and is not already in a guild
    const targetCharacter = await prisma.character.findUnique({
      where: { id: targetCharacterId },
      include: { guildMembership: true }
    });

    if (!targetCharacter) {
      throw new Error('Character not found');
    }

    if (targetCharacter.guildMembership) {
      throw new Error('Character is already in a guild');
    }

    // Enregistrer l'invitation: sans registre, acceptInvitation ne peut pas
    // vérifier qu'une invitation existe et n'importe qui rejoint (exploit).
    if (!this.pendingInvitations.has(targetCharacterId)) {
      this.pendingInvitations.set(targetCharacterId, new Set());
    }
    this.pendingInvitations.get(targetCharacterId)!.add(guildId);

    // Send invitation (stored in memory for now, could use Redis in production)
    this.emit('guildInvitation', {
      guildId,
      inviterId,
      targetCharacterId,
      guildName: (await prisma.guild.findUnique({ where: { id: guildId } }))?.name
    });
  }

  async acceptInvitation(guildId: string, characterId: string, accountId?: string | null): Promise<GuildMember> {
    // L'invitation doit exister (émise par un membre autorisé via inviteToGuild)
    if (!this.pendingInvitations.get(characterId)?.has(guildId)) {
      throw new Error('No pending invitation for this guild');
    }

    // Check if character is already in a guild
    const existingMembership = await prisma.guildMember.findUnique({
      where: { characterId }
    });

    if (existingMembership) {
      throw new Error('Character is already in a guild');
    }

    // Check if guild is full
    const guild = await prisma.guild.findUnique({
      where: { id: guildId },
      include: { members: true }
    });

    if (!guild) {
      throw new Error('Guild not found');
    }

    const maxMembers = 40 + (guild.level * 10); // Level 1: 40, Level 5: 90
    if (guild.members.length >= maxMembers) {
      throw new Error('Guild is full');
    }

    // Add member to guild
    const member = await prisma.guildMember.create({
      data: {
        guildId,
        accountId: accountId ?? characterId,
        characterId,
        rank: GuildRank.member, // New members start as "member"
        contribution: 0n
      }
    });

    // Consommer l'invitation
    this.pendingInvitations.get(characterId)?.delete(guildId);
    if (this.pendingInvitations.get(characterId)?.size === 0) {
      this.pendingInvitations.delete(characterId);
    }

    this.emit('guildMemberJoined', { guildId, member });
    return member;
  }

  async leaveGuild(characterId: string): Promise<void> {
    const member = await prisma.guildMember.findUnique({
      where: { characterId },
      include: { guild: true }
    });

    if (!member) {
      throw new Error('You are not in a guild');
    }

    if (member.rank === GuildRank.leader) {
      throw new Error('Guild leaders cannot leave. Disband the guild or transfer leadership first.');
    }

    await prisma.guildMember.delete({
      where: { characterId }
    });

    this.emit('guildMemberLeft', { guildId: member.guildId, characterId });
  }

  async kickMember(guildId: string, kickerId: string, targetCharacterId: string): Promise<void> {
    // Check if kicker has permission
    const kicker = await prisma.guildMember.findUnique({
      where: { characterId: kickerId }
    });

    if (!kicker || kicker.guildId !== guildId) {
      throw new Error('You are not in this guild');
    }

    const rankPriority = {
      [GuildRank.leader]: 4,
      [GuildRank.assistant]: 3,
      [GuildRank.senior]: 2,
      [GuildRank.member]: 1,
      [GuildRank.junior]: 0
    };

    const targetMember = await prisma.guildMember.findUnique({
      where: { characterId: targetCharacterId },
      include: { guild: true }
    });

    if (!targetMember || targetMember.guildId !== guildId) {
      throw new Error('Target is not in this guild');
    }

    if (rankPriority[kicker.rank] <= rankPriority[targetMember.rank]) {
      throw new Error('You can only kick members with lower rank than you');
    }

    await prisma.guildMember.delete({
      where: { characterId: targetCharacterId }
    });

    this.emit('guildMemberKicked', { guildId, targetCharacterId });
  }

  async promoteMember(guildId: string, promoterId: string, targetCharacterId: string): Promise<GuildMember> {
    const promoter = await prisma.guildMember.findUnique({
      where: { characterId: promoterId }
    });

    if (!promoter || promoter.guildId !== guildId || promoter.rank !== GuildRank.leader) {
      throw new Error('Only guild leaders can promote members');
    }

    const targetMember = await prisma.guildMember.findUnique({
      where: { characterId: targetCharacterId }
    });

    if (!targetMember || targetMember.guildId !== guildId) {
      throw new Error('Target is not in this guild');
    }

    const rankProgression: GuildRank[] = [GuildRank.junior, GuildRank.member, GuildRank.senior, GuildRank.assistant];
    const currentRankIndex = rankProgression.indexOf(targetMember.rank);

    if (currentRankIndex >= rankProgression.length - 1) {
      throw new Error('Member is already at the highest promotable rank');
    }

    const newRank = rankProgression[currentRankIndex + 1];
    const updatedMember = await prisma.guildMember.update({
      where: { characterId: targetCharacterId },
      data: { rank: newRank }
    });

    this.emit('guildMemberPromoted', { guildId, targetCharacterId, newRank });
    return updatedMember;
  }

  async demoteMember(guildId: string, demoterId: string, targetCharacterId: string): Promise<GuildMember> {
    const demoter = await prisma.guildMember.findUnique({
      where: { characterId: demoterId }
    });

    if (!demoter || demoter.guildId !== guildId || demoter.rank !== GuildRank.leader) {
      throw new Error('Only guild leaders can demote members');
    }

    const targetMember = await prisma.guildMember.findUnique({
      where: { characterId: targetCharacterId }
    });

    if (!targetMember || targetMember.guildId !== guildId) {
      throw new Error('Target is not in this guild');
    }

    if (targetMember.rank === GuildRank.junior) {
      throw new Error('Member is already at the lowest rank');
    }

    const rankProgression: GuildRank[] = [GuildRank.junior, GuildRank.member, GuildRank.senior, GuildRank.assistant];
    const currentRankIndex = rankProgression.indexOf(targetMember.rank);

    const newRank = rankProgression[currentRankIndex - 1];
    const updatedMember = await prisma.guildMember.update({
      where: { characterId: targetCharacterId },
      data: { rank: newRank }
    });

    this.emit('guildMemberDemoted', { guildId, targetCharacterId, newRank });
    return updatedMember;
  }

  async updateNotice(guildId: string, characterId: string, notice: string): Promise<Guild> {
    const member = await prisma.guildMember.findUnique({
      where: { characterId }
    });

    if (!member || member.guildId !== guildId) {
      throw new Error('You are not in this guild');
    }

    if (member.rank !== GuildRank.leader && member.rank !== GuildRank.assistant) {
      throw new Error('Only guild leaders and assistants can update the notice');
    }

    const guild = await prisma.guild.update({
      where: { id: guildId },
      data: { notice: notice.substring(0, 200) } // Max 200 characters
    });

    this.emit('guildNoticeUpdated', { guildId, notice });
    return guild;
  }

  async addGuildExp(guildId: string, exp: bigint): Promise<Guild> {
    const guild = await prisma.guild.findUnique({
      where: { id: guildId }
    });

    if (!guild) {
      throw new Error('Guild not found');
    }

    const newExp = guild.exp + exp;
    let newLevel = guild.level;

    // Level up thresholds: Level 1 -> 2: 1M exp, Level 2 -> 3: 2M exp, etc.
    const expThreshold = BigInt(guild.level * 1000000);
    if (newExp >= expThreshold && guild.level < 5) {
      newLevel = guild.level + 1;
    }

    const updatedGuild = await prisma.guild.update({
      where: { id: guildId },
      data: {
        exp: newExp,
        level: newLevel
      }
    });

    if (newLevel > guild.level) {
      this.emit('guildLevelUp', { guildId, newLevel });
    }

    return updatedGuild;
  }

  async disbandGuild(guildId: string, characterId: string): Promise<void> {
    const member = await prisma.guildMember.findUnique({
      where: { characterId }
    });

    if (!member || member.guildId !== guildId || member.rank !== GuildRank.leader) {
      throw new Error('Only guild leaders can disband a guild');
    }

    // Delete all guild members (cascade will handle it)
    await prisma.guild.delete({
      where: { id: guildId }
    });

    this.emit('guildDisbanded', { guildId });
  }

  // ============================================
  // GUILD STORAGE
  // ============================================

  async getGuildStorage(guildId: string): Promise<any> {
    const storage = await prisma.guildStorage.findUnique({
      where: { guildId }
    });

    if (!storage) {
      // Create storage for guild
      return await prisma.guildStorage.create({
        data: { guildId, gold: 0n, items: [] }
      });
    }

    return storage;
  }

  async accessGuildStorage(guildId: string, characterId: string): Promise<GuildStorageAccess> {
    const member = await prisma.guildMember.findUnique({
      where: { characterId }
    });

    if (!member || member.guildId !== guildId) {
      return { hasAccess: false, reason: 'You are not in this guild' };
    }

    // Check if storage is locked by another character
    const lockedBy = this.storageLocks.get(guildId);
    if (lockedBy && lockedBy !== characterId) {
      return { hasAccess: false, reason: 'Storage is being accessed by another player' };
    }

    return { hasAccess: true };
  }

  async lockGuildStorage(guildId: string, characterId: string): Promise<void> {
    const access = await this.accessGuildStorage(guildId, characterId);
    if (!access.hasAccess) {
      throw new Error(access.reason);
    }

    this.storageLocks.set(guildId, characterId);

    // Update last access time
    await prisma.guildStorage.update({
      where: { guildId },
      data: { lastAccess: new Date() }
    });
  }

  async unlockGuildStorage(guildId: string, characterId: string): Promise<void> {
    const lockedBy = this.storageLocks.get(guildId);
    if (lockedBy === characterId) {
      this.storageLocks.delete(guildId);
    }
  }

  async depositGold(guildId: string, characterId: string, amount: bigint): Promise<void> {
    const access = await this.accessGuildStorage(guildId, characterId);
    if (!access.hasAccess) {
      throw new Error(access.reason);
    }

    // Deduct from character
    await prisma.$transaction([
      prisma.character.update({
        where: { id: characterId },
        data: { gold: { decrement: amount } }
      }),
      prisma.guildStorage.update({
        where: { guildId },
        data: { gold: { increment: amount } }
      })
    ]);

    this.emit('guildGoldDeposited', { guildId, characterId, amount });
  }

  async withdrawGold(guildId: string, characterId: string, amount: bigint): Promise<void> {
    const member = await prisma.guildMember.findUnique({
      where: { characterId }
    });

    if (!member || member.guildId !== guildId) {
      throw new Error('You are not in this guild');
    }

    if (member.rank !== GuildRank.leader && member.rank !== GuildRank.assistant) {
      throw new Error('Only guild leaders and assistants can withdraw gold');
    }

    const storage = await prisma.guildStorage.findUnique({
      where: { guildId }
    });

    if (!storage || storage.gold < amount) {
      throw new Error('Insufficient guild gold');
    }

    await prisma.$transaction([
      prisma.guildStorage.update({
        where: { guildId },
        data: { gold: { decrement: amount } }
      }),
      prisma.character.update({
        where: { id: characterId },
        data: { gold: { increment: amount } }
      })
    ]);

    this.emit('guildGoldWithdrawn', { guildId, characterId, amount });
  }

  /** Guilde du personnage (null si sans guilde) — utilisée pour dériver
   *  l'appartenance côté handlers réseau au lieu de truster un guildId client. */
  async getGuildIdForCharacter(characterId: string): Promise<string | null> {
    const membership = await prisma.guildMember.findUnique({
      where: { characterId },
      select: { guildId: true }
    });
    return membership?.guildId ?? null;
  }

  async depositToStorage(guildId: string, itemId: string, quantity: number, characterId?: string): Promise<void> {
    if (characterId) {
      // Seuls les membres peuvent déposer (sinon n'importe qui alimente/vide
      // le stock de n'importe quelle guilde)
      const membership = await prisma.guildMember.findUnique({
        where: { characterId }
      });
      if (!membership || membership.guildId !== guildId) {
        throw new Error('You are not in this guild');
      }
    }

    const storage = await this.getGuildStorage(guildId);

    const items: StoredStorageItem[] = Array.isArray(storage.items)
      ? [...(storage.items as StoredStorageItem[])]
      : [];

    const existing = items.find(i => i.itemId === itemId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      items.push({ itemId, quantity, slot: items.length });
    }

    await prisma.guildStorage.update({
      where: { guildId },
      data: { items, lastAccess: new Date() }
    });

    this.emit('guildItemDeposited', { guildId, itemId, quantity });
  }

  async withdrawFromStorage(guildId: string, itemId: string, quantity: number, characterId?: string): Promise<void> {
    if (characterId) {
      const membership = await prisma.guildMember.findUnique({
        where: { characterId }
      });
      if (!membership || membership.guildId !== guildId) {
        throw new Error('You are not in this guild');
      }
    }

    const storage = await this.getGuildStorage(guildId);

    const items: StoredStorageItem[] = Array.isArray(storage.items)
      ? [...(storage.items as StoredStorageItem[])]
      : [];

    const existing = items.find(i => i.itemId === itemId);
    if (!existing || existing.quantity < quantity) {
      throw new Error('Insufficient items in guild storage');
    }

    existing.quantity -= quantity;
    const remaining = items.filter(i => i.quantity > 0);

    await prisma.guildStorage.update({
      where: { guildId },
      data: { items: remaining, lastAccess: new Date() }
    });

    this.emit('guildItemWithdrawn', { guildId, itemId, quantity });
  }

  // ============================================
  // UNION SYSTEM
  // ============================================

  async createUnion(unionName: string, leaderGuildId: string, characterId: string): Promise<any> {
    // Check if character is guild leader
    const guild = await prisma.guild.findUnique({
      where: { id: leaderGuildId },
      include: { members: true }
    });

    if (!guild) {
      throw new Error('Guild not found');
    }

    const leader = guild.members.find(m => m.rank === GuildRank.leader && m.characterId === characterId);
    if (!leader) {
      throw new Error('Only guild leaders can create unions');
    }

    if (guild.level < 3) {
      throw new Error('Guild must be level 3 or higher to create a union');
    }

    // Check if guild is already in a union
    const existingUnionMember = await prisma.unionMember.findUnique({
      where: { guildId: leaderGuildId }
    });

    if (existingUnionMember) {
      throw new Error('Your guild is already in a union');
    }

    // Create union
    const union = await prisma.union.create({
      data: {
        name: unionName,
        leaderGuild: leaderGuildId,
        maxMembers: 8
      }
    });

    // Add leader guild to union
    await prisma.unionMember.create({
      data: {
        unionId: union.id,
        guildId: leaderGuildId
      }
    });

    this.emit('unionCreated', { union, leaderGuildId });
    return union;
  }

  async inviteToUnion(unionId: string, inviterGuildId: string, targetGuildId: string): Promise<void> {
    const union = await prisma.union.findUnique({
      where: { id: unionId }
    });

    if (!union || union.leaderGuild !== inviterGuildId) {
      throw new Error('Only union leaders can invite guilds');
    }

    const targetGuild = await prisma.guild.findUnique({
      where: { id: targetGuildId }
    });

    if (!targetGuild || targetGuild.level < 1) {
      throw new Error('Target guild not found or not eligible');
    }

    // Check if target guild is already in a union
    const existingUnionMember = await prisma.unionMember.findUnique({
      where: { guildId: targetGuildId }
    });

    if (existingUnionMember) {
      throw new Error('Target guild is already in a union');
    }

    this.emit('unionInvitation', {
      unionId,
      inviterGuildId,
      targetGuildId,
      unionName: union.name
    });
  }

  async acceptUnionInvitation(unionId: string, guildId: string): Promise<void> {
    const union = await prisma.union.findUnique({
      where: { id: unionId }
    });

    if (!union) {
      throw new Error('Union not found');
    }

    const memberCount = await prisma.unionMember.count({
      where: { unionId }
    });

    if (memberCount >= union.maxMembers) {
      throw new Error('Union is full');
    }

    await prisma.unionMember.create({
      data: {
        unionId,
        guildId
      }
    });

    this.emit('unionMemberJoined', { unionId, guildId });
  }

  async leaveUnion(guildId: string): Promise<void> {
    const unionMember = await prisma.unionMember.findUnique({
      where: { guildId }
    });

    if (!unionMember) {
      throw new Error('Your guild is not in a union');
    }

    const union = await prisma.union.findUnique({
      where: { id: unionMember.unionId }
    });

    if (union && union.leaderGuild === guildId) {
      throw new Error('Union leaders cannot leave. Disband the union or transfer leadership first.');
    }

    await prisma.unionMember.delete({
      where: { guildId }
    });

    this.emit('unionMemberLeft', { guildId });
  }

  // ============================================
  // UTILITY METHODS
  // ============================================

  async getGuildById(guildId: string): Promise<Guild | null> {
    return await prisma.guild.findUnique({
      where: { id: guildId },
      include: {
        members: {
          include: {
            character: {
              select: {
                id: true,
                name: true,
                level: true,
                str: true,
                int: true
              }
            }
          }
        }
      }
    });
  }

  async getGuildByName(guildName: string): Promise<Guild | null> {
    return await prisma.guild.findUnique({
      where: { name: guildName }
    });
  }

  async getGuildMembers(guildId: string): Promise<GuildMember[]> {
    return await prisma.guildMember.findMany({
      where: { guildId },
      include: {
        character: {
          select: {
            id: true,
            name: true,
            level: true,
            str: true,
            int: true,
            isOnline: true
          }
        }
      },
      orderBy: {
        rank: 'desc'
      }
    });
  }

  private initializeFortressSchedule(): void {
    // Schedule fortress wars
    // Jangan: Saturday 18:00 (6 PM)
    // Hotan: Saturday 18:00 (6 PM)
    // Bandit: Saturday 18:00 (6 PM)

    // This would typically use a cron job or similar scheduler
    // For now, we'll check periodically
    setInterval(() => {
      this.checkFortressWars();
    }, 60000); // Check every minute
  }

  private async checkFortressWars(): Promise<void> {
    // TODO: Implement fortress war scheduling
    // This would check if it's time for fortress registration/war
    // and update fortress states accordingly
  }
}

export default GuildManager;
