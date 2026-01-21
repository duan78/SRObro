// ============================================
// SRObro - Client System Network Handlers
// Handles guild, quest, fortress, mount events from server
// ============================================

import type { Socket } from 'socket.io-client';

export class ClientSystemHandlers {
  constructor(private socket: Socket) {}

  /**
   * Register all system event handlers
   */
  registerHandlers(): void {
    this.registerGuildHandlers();
    this.registerQuestHandlers();
    this.registerFortressHandlers();
    this.registerMountHandlers();
    this.registerErrorHandler();
  }

  private registerGuildHandlers(): void {
    // Guild creation
    this.socket.on('guild:created', (data) => {
      console.log('[Guild] Created:', data);
      // Trigger UI update
    });

    this.socket.on('guild:invited', (data) => {
      console.log('[Guild] Invite sent:', data);
      // Show invite notification
    });

    this.socket.on('guild:joined', (data) => {
      console.log('[Guild] Joined:', data);
      // Update UI
    });

    this.socket.on('guild:kicked', (data) => {
      console.log('[Guild] Kicked:', data);
      // Update UI
    });

    this.socket.on('guild:promoted', (data) => {
      console.log('[Guild] Promoted:', data);
      // Update UI
    });

    this.socket.on('guild:demoted', (data) => {
      console.log('[Guild] Demoted:', data);
      // Update UI
    });

    this.socket.on('guild:left', (data) => {
      console.log('[Guild] Left:', data);
      // Update UI
    });

    this.socket.on('guild:info', (data) => {
      console.log('[Guild] Info received:', data);
      // Update guild panel
    });

    this.socket.on('guild:members', (data) => {
      console.log('[Guild] Members received:', data);
      // Update guild member list
    });

    this.socket.on('guild:storage', (data) => {
      console.log('[Guild] Storage received:', data);
      // Update guild storage
    });

    this.socket.on('guild:deposited', (data) => {
      console.log('[Guild] Deposited:', data);
      // Update inventory
    });

    this.socket.on('guild:withdrawn', (data) => {
      console.log('[Guild] Withdrawn:', data);
      // Update inventory
    });

    this.socket.on('guild:notice_updated', (data) => {
      console.log('[Guild] Notice updated:', data);
      // Update guild notice
    });

    this.socket.on('guild:union_created', (data) => {
      console.log('[Guild] Union created:', data);
      // Update UI
    });

    this.socket.on('guild:union_left', (data) => {
      console.log('[Guild] Union left:', data);
      // Update UI
    });
  }

  private registerQuestHandlers(): void {
    this.socket.on('quest:available_list', (data) => {
      console.log('[Quest] Available quests:', data);
      // Update quest panel
    });

    this.socket.on('quest:in_progress_list', (data) => {
      console.log('[Quest] In progress quests:', data);
      // Update quest panel
    });

    this.socket.on('quest:completed_list', (data) => {
      console.log('[Quest] Completed quests:', data);
      // Update quest panel
    });

    this.socket.on('quest:accepted', (data) => {
      console.log('[Quest] Accepted:', data);
      // Update quest tracker
    });

    this.socket.on('quest:abandoned', (data) => {
      console.log('[Quest] Abandoned:', data);
      // Update quest tracker
    });

    this.socket.on('quest:completed', (data) => {
      console.log('[Quest] Completed:', data);
      // Show rewards
    });

    this.socket.on('quest:objective_updated', (data) => {
      console.log('[Quest] Objective updated:', data);
      // Update quest progress
    });
  }

  private registerFortressHandlers(): void {
    this.socket.on('fortress:list', (data) => {
      console.log('[Fortress] List received:', data);
      // Update fortress panel
    });

    this.socket.on('fortress:details', (data) => {
      console.log('[Fortress] Details received:', data);
      // Update fortress details
    });

    this.socket.on('fortress:registrations', (data) => {
      console.log('[Fortress] Registrations received:', data);
      // Update registration list
    });

    this.socket.on('fortress:registered', (data) => {
      console.log('[Fortress] Registered:', data);
      // Update UI
    });

    this.socket.on('fortress:unregistered', (data) => {
      console.log('[Fortress] Unregistered:', data);
      // Update UI
    });

    this.socket.on('fortress:tax', (data) => {
      console.log('[Fortress] Tax info received:', data);
      // Update tax display
    });

    this.socket.on('fortress:tax_collected', (data) => {
      console.log('[Fortress] Tax collected:', data);
      // Show notification
    });
  }

  private registerMountHandlers(): void {
    this.socket.on('mount:info', (data) => {
      console.log('[Mount] Info received:', data);
      // Update mount UI
    });

    this.socket.on('mount:purchased', (data) => {
      console.log('[Mount] Purchased:', data);
      // Show notification
    });

    this.socket.on('mount:summoned', (data) => {
      console.log('[Mount] Summoned:', data);
      // Update character state
    });

    this.socket.on('mount:dismissed', (data) => {
      console.log('[Mount] Dismissed:', data);
      // Update character state
    });

    this.socket.on('mount:fed', (data) => {
      console.log('[Mount] Fed:', data);
      // Update mount UI
    });

    this.socket.on('mount:inventory', (data) => {
      console.log('[Mount] Inventory received:', data);
      // Update mount inventory UI
    });

    this.socket.on('mount:item_deposited', (data) => {
      console.log('[Mount] Item deposited:', data);
      // Update inventory
    });

    this.socket.on('mount:item_withdrawn', (data) => {
      console.log('[Mount] Item withdrawn:', data);
      // Update inventory
    });
  }

  private registerErrorHandler(): void {
    this.socket.on('error', (data) => {
      console.error('[Server Error]:', data.message);
      // Show error notification to user
    });
  }

  // ============================================
  // GUILD API METHODS
  // ============================================

  createGuild(characterId: string, name: string): void {
    this.socket.emit('guild:create', { characterId, name });
  }

  inviteMember(guildId: string, targetCharacterId: string): void {
    this.socket.emit('guild:invite', { guildId, targetCharacterId });
  }

  acceptGuildInvite(guildId: string, characterId: string): void {
    this.socket.emit('guild:accept_invite', { guildId, characterId });
  }

  kickMember(guildId: string, characterId: string): void {
    this.socket.emit('guild:kick', { guildId, characterId });
  }

  promoteMember(guildId: string, characterId: string, newRank: string): void {
    this.socket.emit('guild:promote', { guildId, characterId, newRank });
  }

  demoteMember(guildId: string, characterId: string, newRank: string): void {
    this.socket.emit('guild:demote', { guildId, characterId, newRank });
  }

  leaveGuild(guildId: string, characterId: string): void {
    this.socket.emit('guild:leave', { guildId, characterId });
  }

  getGuildInfo(guildId: string): void {
    this.socket.emit('guild:get_info', { guildId });
  }

  getGuildMembers(guildId: string): void {
    this.socket.emit('guild:get_members', { guildId });
  }

  getGuildStorage(guildId: string): void {
    this.socket.emit('guild:get_storage', { guildId });
  }

  depositToStorage(guildId: string, itemId: string, quantity: number): void {
    this.socket.emit('guild:deposit_storage', { guildId, itemId, quantity });
  }

  withdrawFromStorage(guildId: string, itemId: string, quantity: number): void {
    this.socket.emit('guild:withdraw_storage', { guildId, itemId, quantity });
  }

  updateGuildNotice(guildId: string, notice: string): void {
    this.socket.emit('guild:update_notice', { guildId, notice });
  }

  createUnion(guildId: string, unionName: string): void {
    this.socket.emit('guild:create_union', { guildId, unionName });
  }

  leaveUnion(guildId: string): void {
    this.socket.emit('guild:leave_union', { guildId });
  }

  // ============================================
  // QUEST API METHODS
  // ============================================

  getAvailableQuests(characterId: string): void {
    this.socket.emit('quest:get_available', { characterId });
  }

  getInProgressQuests(characterId: string): void {
    this.socket.emit('quest:get_in_progress', { characterId });
  }

  getCompletedQuests(characterId: string): void {
    this.socket.emit('quest:get_completed', { characterId });
  }

  acceptQuest(characterId: string, questId: string): void {
    this.socket.emit('quest:accept', { characterId, questId });
  }

  abandonQuest(characterId: string, questId: string): void {
    this.socket.emit('quest:abandon', { characterId, questId });
  }

  completeQuest(characterId: string, questId: string): void {
    this.socket.emit('quest:complete', { characterId, questId });
  }

  updateQuestObjective(characterId: string, questId: string, objectiveIndex: number, count: number): void {
    this.socket.emit('quest:update_objective', { characterId, questId, objectiveIndex, count });
  }

  // ============================================
  // FORTRESS API METHODS
  // ============================================

  getFortressList(): void {
    this.socket.emit('fortress:get_list', {});
  }

  getFortressDetails(fortressId: string): void {
    this.socket.emit('fortress:get_details', { fortressId });
  }

  getFortressRegistrations(fortressId: string): void {
    this.socket.emit('fortress:get_registrations', { fortressId });
  }

  registerForFortress(fortressId: string, guildId: string): void {
    this.socket.emit('fortress:register', { fortressId, guildId });
  }

  unregisterFromFortress(fortressId: string, guildId: string): void {
    this.socket.emit('fortress:unregister', { fortressId, guildId });
  }

  getFortressTax(fortressId: string): void {
    this.socket.emit('fortress:get_tax', { fortressId });
  }

  collectFortressTax(fortressId: string, guildId: string): void {
    this.socket.emit('fortress:collect_tax', { fortressId, guildId });
  }

  // ============================================
  // MOUNT API METHODS
  // ============================================

  getMount(characterId: string): void {
    this.socket.emit('mount:get', { characterId });
  }

  purchaseMount(characterId: string, mountType: string): void {
    this.socket.emit('mount:purchase', { characterId, mountType });
  }

  summonMount(characterId: string): void {
    this.socket.emit('mount:summon', { characterId });
  }

  dismissMount(characterId: string): void {
    this.socket.emit('mount:dismiss', { characterId });
  }

  feedMount(characterId: string, foodItemId: string): void {
    this.socket.emit('mount:feed', { characterId, foodItemId });
  }

  getMountInventory(characterId: string): void {
    this.socket.emit('mount:get_inventory', { characterId });
  }

  depositMountItem(characterId: string, itemId: string, quantity: number): void {
    this.socket.emit('mount:deposit_item', { characterId, itemId, quantity });
  }

  withdrawMountItem(characterId: string, mountInventoryId: string): void {
    this.socket.emit('mount:withdraw_item', { characterId, mountInventoryId });
  }
}

export default ClientSystemHandlers;
