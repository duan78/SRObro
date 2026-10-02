// ============================================
// SRObro - System Network Handlers
// Socket.IO handlers for guild, quest, fortress, mount systems
//
// RÈGLE DE SÉCURITÉ: l'identité de l'ACTEUR (characterId/accountId) est
// TOUJOURS dérivée de la session authentifiée du socket (via
// ClientManager), jamais du payload client — sinon n'importe quel client
// peut agir au nom de n'importe quel personnage. Les IDs présents dans le
// payload ne désignent que des CIBLES (ex: membre à exclure).
// ============================================

import type { Socket } from 'socket.io';
import { createLogger } from '../core/Logger';
import { GuildManager } from '../guild/GuildManager';
import { QuestManager } from '../quest/QuestManager';
import { FortressManager } from '../fortress/FortressManager';
import { MountManager } from '../mount/MountManager';
import type { ClientManager } from './ClientManager';

const logger = createLogger('SystemHandlers');

interface SessionIdentity {
  characterId: string;
  accountId: string | null;
}

export class SystemHandlers {
  private guildManager: GuildManager;
  private questManager: QuestManager;
  private fortressManager: FortressManager;
  private mountManager: MountManager;
  private clientManager: ClientManager;

  constructor(clientManager: ClientManager) {
    this.clientManager = clientManager;
    this.guildManager = GuildManager.getInstance();
    this.questManager = QuestManager.getInstance();
    this.fortressManager = FortressManager.getInstance();
    this.mountManager = MountManager.getInstance();
  }

  /**
   * Résout l'identité authentifiée du socket (characterId sélectionné),
   * ou null si le client n'a pas chargé de personnage.
   */
  private getSession(socket: Socket): SessionIdentity | null {
    const client = this.clientManager.getClient(socket.id);
    if (!client || !client.getIsAuthenticated()) {
      return null;
    }
    const characterId = client.getCharacterId();
    if (!characterId) {
      return null;
    }
    return { characterId, accountId: client.getPlayerId() };
  }

  private requireSession(socket: Socket): SessionIdentity | null {
    const session = this.getSession(socket);
    if (!session) {
      socket.emit('error', { message: 'Not authenticated (no character selected)' });
    }
    return session;
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
    // NB: pas de 'quest:update_objective' — la progression des objectifs est
    // calculée par le serveur (events kill/pickup via QuestManager), jamais
    // déclarée par le client (exploit de compteur).
    socket.on('quest:get_available', (data, ack) => this.handleQuestGetAvailable(socket, data, ack));
    socket.on('quest:get_in_progress', (data, ack) => this.handleQuestGetInProgress(socket, data, ack));
    socket.on('quest:get_completed', (data, ack) => this.handleQuestGetCompleted(socket, data, ack));
    socket.on('quest:accept', (data, ack) => this.handleQuestAccept(socket, data, ack));
    socket.on('quest:abandon', (data, ack) => this.handleQuestAbandon(socket, data, ack));
    socket.on('quest:complete', (data, ack) => this.handleQuestComplete(socket, data, ack));

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
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { name } = data;
      const guild = await this.guildManager.createGuild({
        name,
        leaderAccountId: session.accountId ?? session.characterId,
        leaderCharacterId: session.characterId
      });
      // Sanitiser TOUS les BigInt (récursif) — sinon la sérialisation échoue
      const safeGuild = JSON.parse(JSON.stringify(guild, (_k, v: unknown) =>
        typeof v === 'bigint' ? Number(v) : v));
      socket.emit('guild:created', safeGuild);
      logger.info(`Guild created: ${name} by ${session.characterId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
      logger.error('Guild create error:', error);
    }
  }

  private async handleGuildInvite(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { guildId, targetCharacterId } = data;
      await this.guildManager.inviteToGuild(guildId, session.characterId, targetCharacterId);
      socket.emit('guild:invited', { guildId, targetCharacterId });
      logger.info(`Guild invite sent: ${guildId} -> ${targetCharacterId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildAcceptInvite(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { guildId } = data;
      await this.guildManager.acceptInvitation(guildId, session.characterId, session.accountId ?? undefined);
      socket.emit('guild:joined', { guildId });
      logger.info(`Character ${session.characterId} joined guild ${guildId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildKick(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { guildId, characterId } = data; // characterId = CIBLE (à exclure)
      await this.guildManager.kickMember(guildId, session.characterId, characterId);
      socket.emit('guild:kicked', { guildId, characterId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildPromote(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { guildId, characterId } = data; // characterId = CIBLE
      await this.guildManager.promoteMember(guildId, session.characterId, characterId);
      socket.emit('guild:promoted', { guildId, characterId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildDemote(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { guildId, characterId } = data; // characterId = CIBLE
      await this.guildManager.demoteMember(guildId, session.characterId, characterId);
      socket.emit('guild:demoted', { guildId, characterId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildLeave(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { guildId } = data;
      await this.guildManager.leaveGuild(session.characterId);
      socket.emit('guild:left', { guildId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildGetInfo(socket: Socket, data: any): Promise<void> {
    if (!this.requireSession(socket)) return;
    try {
      const { guildId } = data;
      const guild = await this.guildManager.getGuildById(guildId);
      socket.emit('guild:info', guild);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildGetMembers(socket: Socket, data: any): Promise<void> {
    if (!this.requireSession(socket)) return;
    try {
      const { guildId } = data;
      const members = await this.guildManager.getGuildMembers(guildId);
      socket.emit('guild:members', members);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildGetStorage(socket: Socket, data: any): Promise<void> {
    if (!this.requireSession(socket)) return;
    try {
      const { guildId } = data;
      const storage = await this.guildManager.getGuildStorage(guildId);
      socket.emit('guild:storage', storage);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildDepositStorage(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { guildId, itemId, quantity } = data;
      await this.guildManager.depositToStorage(guildId, session.characterId, itemId, quantity);
      socket.emit('guild:deposited', { guildId, itemId, quantity });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildWithdrawStorage(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { guildId, itemId, quantity } = data;
      await this.guildManager.withdrawFromStorage(guildId, session.characterId, itemId, quantity);
      socket.emit('guild:withdrawn', { guildId, itemId, quantity });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildUpdateNotice(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { guildId, notice } = data;
      await this.guildManager.updateNotice(guildId, session.characterId, notice);
      socket.emit('guild:notice_updated', { guildId, notice });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildCreateUnion(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { guildId, unionName } = data;
      const union = await this.guildManager.createUnion(unionName, guildId, session.characterId);
      socket.emit('guild:union_created', union);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleGuildLeaveUnion(socket: Socket, data: any): Promise<void> {
    if (!this.requireSession(socket)) return;
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

  private async handleQuestGetAvailable(socket: Socket, _data: any, ack?: (r: any) => void): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const quests = await this.questManager.getAvailableQuests(session.characterId);
      socket.emit('quest:available_list', quests);
      if (typeof ack === 'function') ack({ success: true, quests });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleQuestGetInProgress(socket: Socket, _data: any, ack?: (r: any) => void): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const quests = await this.questManager.getQuestProgress(session.characterId);
      socket.emit('quest:in_progress_list', quests);
      if (typeof ack === 'function') ack({ success: true, quests });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleQuestGetCompleted(socket: Socket, _data: any, ack?: (r: any) => void): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const quests = await this.questManager.getCompletedQuests(session.characterId);
      socket.emit('quest:completed_list', quests);
      if (typeof ack === 'function') ack({ success: true, quests });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleQuestAccept(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { questId } = data;
      const progress = await this.questManager.acceptQuest(session.characterId, questId);
      socket.emit('quest:accepted', progress);
      if (typeof ack === 'function') ack({ success: true, progress });
      logger.info(`Quest accepted: ${questId} by ${session.characterId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleQuestAbandon(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { questId } = data;
      await this.questManager.abandonQuest(session.characterId, questId);
      socket.emit('quest:abandoned', { questId });
      if (typeof ack === 'function') ack({ success: true });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
      if (typeof ack === 'function') ack({ success: false, error: error.message });
    }
  }

  private async handleQuestComplete(socket: Socket, data: any, ack?: (r: any) => void): Promise<void> {
    void ack;
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { questId } = data;
      // completeQuest vérifie côté serveur: statut in_progress + objectifs
      // remplis (les récompenses ne sont PAS distribuables à la demande)
      const rewards = await this.questManager.completeQuest(session.characterId, questId);
      socket.emit('quest:completed', { questId, rewards });
      logger.info(`Quest completed: ${questId} by ${session.characterId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  // ============================================
  // FORTRESS HANDLERS
  // ============================================

  private async handleFortressGetList(socket: Socket, _data: any): Promise<void> {
    if (!this.requireSession(socket)) return;
    try {
      const fortresses = await this.fortressManager.getAllFortresses();
      socket.emit('fortress:list', fortresses);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressGetDetails(socket: Socket, data: any): Promise<void> {
    if (!this.requireSession(socket)) return;
    try {
      const { fortressId } = data;
      const fortress = await this.fortressManager.getFortressById(fortressId);
      socket.emit('fortress:details', fortress);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressGetRegistrations(socket: Socket, data: any): Promise<void> {
    if (!this.requireSession(socket)) return;
    try {
      const { fortressId } = data;
      const registrations = await this.fortressManager.getFortressRegistrations(fortressId);
      socket.emit('fortress:registrations', registrations);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressRegister(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { fortressId } = data;
      // La guilde est celle du personnage authentifié — pas un guildId client
      const guildId = await this.guildManager.getGuildIdForCharacter(session.characterId);
      if (!guildId) {
        socket.emit('error', { message: 'Character has no guild' });
        return;
      }
      await this.fortressManager.registerForFortress(fortressId, guildId);
      socket.emit('fortress:registered', { fortressId, guildId });
      logger.info(`Guild ${guildId} registered for fortress ${fortressId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressUnregister(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { fortressId } = data;
      const guildId = await this.guildManager.getGuildIdForCharacter(session.characterId);
      if (!guildId) {
        socket.emit('error', { message: 'Character has no guild' });
        return;
      }
      await this.fortressManager.unregisterFromWar(fortressId, guildId);
      socket.emit('fortress:unregistered', { fortressId, guildId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressGetTax(socket: Socket, data: any): Promise<void> {
    if (!this.requireSession(socket)) return;
    try {
      const { fortressId } = data;
      const tax = await this.fortressManager.getTaxRevenue(fortressId);
      socket.emit('fortress:tax', tax);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleFortressCollectTax(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { fortressId } = data;
      const guildId = await this.guildManager.getGuildIdForCharacter(session.characterId);
      if (!guildId) {
        socket.emit('error', { message: 'Character has no guild' });
        return;
      }
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

  private async handleMountGet(socket: Socket, _data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const mount = await this.mountManager.getMountByCharacter(session.characterId);
      socket.emit('mount:info', mount);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountPurchase(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { mountType } = data;
      const mount = await this.mountManager.purchaseMount(session.characterId, mountType);
      const safeMount = JSON.parse(JSON.stringify(mount, (_k, v: unknown) => (typeof v === 'bigint' ? Number(v) : v)));
      socket.emit('mount:purchased', safeMount);
      logger.info(`Mount purchased: ${mountType} by ${session.characterId}`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountSummon(socket: Socket, _data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const mount = await this.mountManager.summonMount(session.characterId);
      // Vitesse OFFICIELLE appliquée (KB 24: cheval ~2× la marche — avant,
      // summon ne flipait qu'isActive en base sans effet monde)
      const { MOUNT_SPEED } = await import('../mount/MountManager.js');
      const mult = MOUNT_SPEED[mount.mountType] ?? 2;
      const safeMount = JSON.parse(JSON.stringify(mount, (_k, v: unknown) => (typeof v === 'bigint' ? Number(v) : v)));
      socket.emit('gm:speed', { multiplier: mult });
      socket.emit('mount:summoned', { ...safeMount, speedMultiplier: mult });
      logger.info(`Mount summoned by ${session.characterId} (vitesse ×${mult})`);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountDismiss(socket: Socket, _data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const mount = await this.mountManager.dismissMount(session.characterId);
      const safeMount = JSON.parse(JSON.stringify(mount, (_k, v: unknown) => (typeof v === 'bigint' ? Number(v) : v)));
      socket.emit('gm:speed', { multiplier: 1 });
      socket.emit('mount:dismissed', safeMount);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountFeed(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { foodItemId } = data;
      const mount = await this.mountManager.feedMount(session.characterId, foodItemId);
      socket.emit('mount:fed', mount);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountGetInventory(socket: Socket, _data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const mount = await this.mountManager.getMountByCharacter(session.characterId);
      socket.emit('mount:inventory', mount?.inventory);
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountDepositItem(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { itemId, quantity } = data;
      await this.mountManager.depositItem(session.characterId, itemId, quantity);
      socket.emit('mount:item_deposited', { characterId: session.characterId, itemId, quantity });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }

  private async handleMountWithdrawItem(socket: Socket, data: any): Promise<void> {
    const session = this.requireSession(socket);
    if (!session) return;
    try {
      const { mountInventoryId } = data;
      await this.mountManager.withdrawItem(session.characterId, mountInventoryId);
      socket.emit('mount:item_withdrawn', { characterId: session.characterId, mountInventoryId });
    } catch (error: any) {
      socket.emit('error', { message: error.message });
    }
  }
}

export default SystemHandlers;
