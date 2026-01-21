// ============================================
// SRObro - System Network Handlers
// Socket.IO handlers for guild, quest, fortress, mount systems
// ============================================

import type { Socket } from 'socket.io';
import { createLogger } from '../core/Logger';
import { GuildManager } from '../guild/GuildManager';
import { QuestManager } from '../quest/QuestManager';
import { FortressManager } from '../fortress/FortressManager';
import { MountManager } from '../mount/MountManager';

const logger = createLogger('SystemHandlers');

export class SystemHandlers {
  private guildManager: GuildManager;
  private questManager: QuestManager;
  private fortressManager: FortressManager;
  private mountManager: MountManager;

  constructor() {
    this.guildManager = GuildManager.getInstance();
    this.questManager = QuestManager.getInstance();
    this.fortressManager = FortressManager.getInstance();
    this.mountManager = MountManager.getInstance();
  }

  /**
   * Register all system handlers
   */
  registerHandlers(socket: Socket): void {
    // Guild handlers
    socket.on('guild:create', (data) => this.handleGuildCreate(socket, data));
    socket.on('guild:invite', (data) => this.handleGuildInvite(socket, data));
    socket.on('guild:accept_invite', (data) => this.handleGuildAcceptInvite(socket, data));
    socket.on('guild:kick', (data) => this.handleGuildKick(socket, data));
    socket.on('guild:promote', (data) => this.handleGuildPromote(socket, data));
    socket.on('guild:demote', (data) => this.handleGuildDemote(socket, data));
    socket.on('guild:leave', (data) => this.handleGuildLeave(socket, data));
    socket.on('guild:get_info', (data) => this.handleGuildGetInfo(socket, data));
    socket.on('guild:get_members', (data) => this.handleGuildGetMembers(socket, data));
    socket.on('guild:get_storage', (data) => this.handleGuildGetStorage(socket, data));
    socket.on('guild:deposit_storage', (data) => this.handleGuildDepositStorage(socket, data));
    socket.on('guild:withdraw_storage', (data) => this.handleGuildWithdrawStorage(socket, data));
    socket.on('guild:update_notice', (data) => this.handleGuildUpdateNotice(socket, data));
    socket.on('guild:create_union', (data) => this.handleGuildCreateUnion(socket, data));
    socket.on('guild:leave_union', (data) => this.handleGuildLeaveUnion(socket, data));

    // Quest handlers
    socket.on('quest:get_available', (data) => this.handleQuestGetAvailable(socket, data));
    socket.on('quest:get_in_progress', (data) => this.handleQuestGetInProgress(socket, data));
    socket.on('quest:get_completed', (data) => this.handleQuestGetCompleted(socket, data));
    socket.on('quest:accept', (data) => this.handleQuestAccept(socket, data));
    socket.on('quest:abandon', (data) => this.handleQuestAbandon(socket, data));
    socket.on('quest:complete', (data) => this.handleQuestComplete(socket, data));
    socket.on('quest:update_objective', (data) => this.handleQuestUpdateObjective(socket, data));

    // Fortress handlers
    socket.on('fortress:get_list', (data) => this.handleFortressGetList(socket, data));
    socket.on('fortress:get_details', (data) => this.handleFortressGetDetails(socket, data));
    socket.on('fortress:get_registrations', (data) => this.handleFortressGetRegistrations(socket, data));
    socket.on('fortress:register', (data) => this.handleFortressRegister(socket, data));
    socket.on('fortress:unregister', (data) => this.handleFortressUnregister(socket, data));
    socket.on('fortress:get_tax', (data) => this.handleFortressGetTax(socket, data));
    socket.on('fortress:collect_tax', (data) => this.handleFortressCollectTax(socket, data));

    // Mount handlers
    socket.on('mount:get', (data) => this.handleMountGet(socket, data));
    socket.on('mount:purchase', (data) => this.handleMountPurchase(socket, data));
    socket.on('mount:summon', (data) => this.handleMountSummon(socket, data));
    socket.on('mount:dismiss', (data) => this.handleMountDismiss(socket, data));
    socket.on('mount:feed', (data) => this.handleMountFeed(socket, data));
    socket.on('mount:get_inventory', (data) => this.handleMountGetInventory(socket, data));
    socket.on('mount:deposit_item', (data) => this.handleMountDepositItem(socket, data));
    socket.on('mount:withdraw_item', (data) => this.handleMountWithdrawItem(socket, data));
  }

  // ============================================
  // GUILD HANDLERS
  // ============================================

  private async handleGuildCreate(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId, name } = data;
      const guild = await this.guildManager.createGuild({
        name,
        leaderAccountId: socket.data.accountId,
        leaderCharacterId: characterId
      });
      socket.emit('guild:created', guild);
      logger.info(`Guild created: ${name} by ${socket.data.accountId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
      logger.error('Guild create error:', error);
    }
  }

  private async handleGuildInvite(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId, characterId, targetCharacterId } = data;
      await this.guildManager.inviteToGuild(guildId, characterId, targetCharacterId);
      socket.emit('guild:invited', { guildId, targetCharacterId });
      logger.info(`Guild invite sent: ${guildId} -> ${targetCharacterId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildAcceptInvite(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId, characterId } = data;
      await this.guildManager.acceptInvitation(guildId, characterId, socket.data.accountId);
      socket.emit('guild:joined', { guildId });
      logger.info(`Character ${characterId} joined guild ${guildId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildKick(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId, kickerId, characterId } = data;
      await this.guildManager.kickMember(guildId, kickerId, characterId);
      socket.emit('guild:kicked', { guildId, characterId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildPromote(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId, characterId, newRank } = data;
      await this.guildManager.promoteMember(guildId, characterId, newRank);
      socket.emit('guild:promoted', { guildId, characterId, newRank });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildDemote(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId, characterId, newRank } = data;
      await this.guildManager.demoteMember(guildId, characterId, newRank);
      socket.emit('guild:demoted', { guildId, characterId, newRank });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildLeave(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId, characterId } = data;
      await this.guildManager.leaveGuild(guildId, characterId);
      socket.emit('guild:left', { guildId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildGetInfo(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId } = data;
      const guild = await this.guildManager.getGuild(guildId);
      socket.emit('guild:info', guild);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildGetMembers(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId } = data;
      const members = await this.guildManager.getGuildMembers(guildId);
      socket.emit('guild:members', members);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildGetStorage(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId } = data;
      const storage = await this.guildManager.getGuildStorage(guildId);
      socket.emit('guild:storage', storage);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildDepositStorage(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId, itemId, quantity } = data;
      await this.guildManager.depositToStorage(guildId, itemId, quantity);
      socket.emit('guild:deposited', { guildId, itemId, quantity });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildWithdrawStorage(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId, itemId, quantity } = data;
      await this.guildManager.withdrawFromStorage(guildId, itemId, quantity);
      socket.emit('guild:withdrawn', { guildId, itemId, quantity });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildUpdateNotice(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId, notice } = data;
      await this.guildManager.updateNotice(guildId, notice);
      socket.emit('guild:notice_updated', { guildId, notice });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildCreateUnion(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId, unionName } = data;
      const union = await this.guildManager.createUnion(guildId, unionName);
      socket.emit('guild:union_created', union);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildLeaveUnion(socket: Socket, data: any): Promise<void> {
    try {
      const { guildId } = data;
      await this.guildManager.leaveUnion(guildId);
      socket.emit('guild:union_left', { guildId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  // ============================================
  // QUEST HANDLERS
  // ============================================

  private async handleQuestGetAvailable(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId } = data;
      const quests = await this.questManager.getAvailableQuests(characterId);
      socket.emit('quest:available_list', quests);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleQuestGetInProgress(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId } = data;
      const quests = await this.questManager.getQuestProgress(characterId);
      socket.emit('quest:in_progress_list', quests);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleQuestGetCompleted(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId } = data;
      const quests = await this.questManager.getCompletedQuests(characterId);
      socket.emit('quest:completed_list', quests);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleQuestAccept(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId, questId } = data;
      const progress = await this.questManager.acceptQuest(characterId, questId);
      socket.emit('quest:accepted', progress);
      logger.info(`Quest accepted: ${questId} by ${characterId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleQuestAbandon(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId, questId } = data;
      await this.questManager.abandonQuest(characterId, questId);
      socket.emit('quest:abandoned', { questId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleQuestComplete(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId, questId } = data;
      const rewards = await this.questManager.completeQuest(characterId, questId);
      socket.emit('quest:completed', { questId, rewards });
      logger.info(`Quest completed: ${questId} by ${characterId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleQuestUpdateObjective(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId, questId, objectiveIndex, count } = data;
      const progress = await this.questManager.updateObjective(characterId, questId, objectiveIndex, count);
      socket.emit('quest:objective_updated', progress);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  // ============================================
  // FORTRESS HANDLERS
  // ============================================

  private async handleFortressGetList(socket: Socket, data: any): Promise<void> {
    try {
      const fortresses = await this.fortressManager.getAllFortresses();
      socket.emit('fortress:list', fortresses);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressGetDetails(socket: Socket, data: any): Promise<void> {
    try {
      const { fortressId } = data;
      const fortress = await this.fortressManager.getFortress(fortressId);
      socket.emit('fortress:details', fortress);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressGetRegistrations(socket: Socket, data: any): Promise<void> {
    try {
      const { fortressId } = data;
      const registrations = await this.fortressManager.getRegistrations(fortressId);
      socket.emit('fortress:registrations', registrations);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressRegister(socket: Socket, data: any): Promise<void> {
    try {
      const { fortressId, guildId } = data;
      await this.fortressManager.registerForWar(fortressId, guildId);
      socket.emit('fortress:registered', { fortressId, guildId });
      logger.info(`Guild ${guildId} registered for fortress ${fortressId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressUnregister(socket: Socket, data: any): Promise<void> {
    try {
      const { fortressId, guildId } = data;
      await this.fortressManager.unregisterFromWar(fortressId, guildId);
      socket.emit('fortress:unregistered', { fortressId, guildId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressGetTax(socket: Socket, data: any): Promise<void> {
    try {
      const { fortressId } = data;
      const tax = await this.fortressManager.getTaxRevenue(fortressId);
      socket.emit('fortress:tax', tax);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressCollectTax(socket: Socket, data: any): Promise<void> {
    try {
      const { fortressId, guildId } = data;
      const revenue = await this.fortressManager.collectTax(fortressId, guildId);
      socket.emit('fortress:tax_collected', { fortressId, revenue });
      logger.info(`Tax collected for fortress ${fortressId}: ${revenue}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  // ============================================
  // MOUNT HANDLERS
  // ============================================

  private async handleMountGet(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId } = data;
      const mount = await this.mountManager.getMountByCharacter(characterId);
      socket.emit('mount:info', mount);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountPurchase(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId, mountType } = data;
      const mount = await this.mountManager.purchaseMount(characterId, mountType);
      socket.emit('mount:purchased', mount);
      logger.info(`Mount purchased: ${mountType} by ${characterId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountSummon(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId } = data;
      const mount = await this.mountManager.summonMount(characterId);
      socket.emit('mount:summoned', mount);
      logger.info(`Mount summoned by ${characterId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountDismiss(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId } = data;
      const mount = await this.mountManager.dismissMount(characterId);
      socket.emit('mount:dismissed', mount);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountFeed(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId, foodItemId } = data;
      const mount = await this.mountManager.feedMount(characterId, foodItemId);
      socket.emit('mount:fed', mount);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountGetInventory(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId } = data;
      const mount = await this.mountManager.getMountByCharacter(characterId);
      socket.emit('mount:inventory', mount?.inventory);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountDepositItem(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId, itemId, quantity } = data;
      await this.mountManager.depositItem(characterId, itemId, quantity);
      socket.emit('mount:item_deposited', { characterId, itemId, quantity });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountWithdrawItem(socket: Socket, data: any): Promise<void> {
    try {
      const { characterId, mountInventoryId } = data;
      await this.mountManager.withdrawItem(characterId, mountInventoryId);
      socket.emit('mount:item_withdrawn', { characterId, mountInventoryId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }
}

export default SystemHandlers;
