/**
 * SRObro - Chat Manager
 * Handles all chat channels, message validation, and filtering
 */

import { createLogger } from '../core/Logger';
import { EventEmitter } from 'events';

const logger = createLogger('ChatManager');

/**
 * Chat channel types
 */
export enum ChatChannel {
  GENERAL = 'general', // Zone-wide chat (white)
  WHISPER = 'whisper', // Private 1-1 chat (pink)
  SHOUT = 'shout',     // Zone-wide with cost (yellow)
  PARTY = 'party',     // Party chat (blue)
  GUILD = 'guild',     // Guild chat (green)
  GLOBAL = 'global',   // Server-wide (orange)
}

/**
 * Chat message data
 */
export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  channel: ChatChannel;
  message: string;
  targetId?: string; // For whispers
  timestamp: number;
}

/**
 * Chat result
 */
export interface ChatResult {
  success: boolean;
  reason?: string;
  cost?: number;
  messageId?: string;
}

/**
 * Profanity filter list
 */
const PROFANITY_LIST = [
  'fuck', 'shit', 'bitch', 'ass', 'damn', 'hell',
  'dick', 'pussy', 'cock', 'bastard', 'crap',
];

/**
 * Chat Manager options
 */
export interface ChatManagerOptions {
  maxLength: number; // Maximum message length
  shoutCost: number; // Gold cost for shout
  globalCooldown: number; // Milliseconds between messages
  whisperCooldown: number; // Milliseconds between whispers to same player
  enableProfanityFilter: boolean;
  enableChatLogging: boolean;
}

/**
 * Chat Manager class
 */
export class ChatManager extends EventEmitter {
  private options: Required<ChatManagerOptions>;
  private messageCooldowns: Map<string, number> = new Map();
  private whisperCooldowns: Map<string, Map<string, number>> = new Map();
  private messageCounter: number = 0;

  constructor(options?: Partial<ChatManagerOptions>) {
    super();
    this.options = {
      maxLength: 120,
      shoutCost: 1000,
      globalCooldown: 1000, // 1 second
      whisperCooldown: 5000, // 5 seconds
      enableProfanityFilter: true,
      enableChatLogging: true,
      ...options,
    };
  }

  /**
   * Send a chat message
   */
  async sendMessage(message: Partial<ChatMessage>): Promise<ChatResult> {
    // Validate message
    const validation = this.validateMessage(message);
    if (!validation.valid) {
      return {
        success: false,
        reason: validation.reason,
      };
    }

    const channel = message.channel!;
    const senderId = message.senderId!;
    const senderName = message.senderName!;
    const content = message.message!;

    // Check cooldowns
    const cooldownCheck = this.checkCooldowns(senderId, channel, message.targetId);
    if (!cooldownCheck.allowed) {
      return {
        success: false,
        reason: cooldownCheck.reason,
      };
    }

    // Check shout cost
    let cost = 0;
    if (channel === ChatChannel.SHOUT) {
      cost = this.options.shoutCost;
      // Note: The caller should verify the player has enough gold
    }

    // Apply profanity filter
    const filteredMessage = this.options.enableProfanityFilter
      ? this.filterProfanity(content)
      : content;

    // Create message
    const chatMessage: ChatMessage = {
      id: this.generateMessageId(),
      senderId,
      senderName,
      channel,
      message: filteredMessage,
      targetId: message.targetId,
      timestamp: Date.now(),
    };

    // Update cooldowns
    this.updateCooldowns(senderId, channel, message.targetId);

    // Log message if enabled
    if (this.options.enableChatLogging) {
      await this.logMessage(chatMessage);
    }

    logger.info(`Chat message: ${senderName} in ${channel}`, {
      messageId: chatMessage.id,
      message: filteredMessage,
      targetId: message.targetId,
    });

    // Emit message event
    this.emit('message', chatMessage);

    return {
      success: true,
      cost,
      messageId: chatMessage.id,
    };
  }

  /**
   * Validate a chat message
   */
  private validateMessage(message: Partial<ChatMessage>): { valid: boolean; reason?: string } {
    // Check required fields
    if (!message.senderId || !message.senderName || !message.channel || !message.message) {
      return { valid: false, reason: 'Missing required fields' };
    }

    // Check message length
    if (message.message.length > this.options.maxLength) {
      return { valid: false, reason: `Message too long (max ${this.options.maxLength} characters)` };
    }

    // Check message is not empty
    if (message.message.trim().length === 0) {
      return { valid: false, reason: 'Message cannot be empty' };
    }

    // Check channel is valid
    if (!Object.values(ChatChannel).includes(message.channel)) {
      return { valid: false, reason: 'Invalid chat channel' };
    }

    // Check whisper has target
    if (message.channel === ChatChannel.WHISPER && !message.targetId) {
      return { valid: false, reason: 'Whisper requires a target' };
    }

    // Check message doesn't contain only spaces
    if (message.message.trim().length === 0) {
      return { valid: false, reason: 'Message cannot be empty' };
    }

    return { valid: true };
  }

  /**
   * Check cooldowns for a message
   */
  private checkCooldowns(
    senderId: string,
    channel: ChatChannel,
    targetId?: string
  ): { allowed: boolean; reason?: string } {
    const now = Date.now();

    // Check global cooldown
    const lastMessage = this.messageCooldowns.get(senderId);
    if (lastMessage && now - lastMessage < this.options.globalCooldown) {
      const remaining = Math.ceil((this.options.globalCooldown - (now - lastMessage)) / 1000);
      return { allowed: false, reason: `Please wait ${remaining}s before sending another message` };
    }

    // Check whisper cooldown
    if (channel === ChatChannel.WHISPER && targetId) {
      let whisperMap = this.whisperCooldowns.get(senderId);
      if (!whisperMap) {
        whisperMap = new Map();
        this.whisperCooldowns.set(senderId, whisperMap);
      }

      const lastWhisper = whisperMap.get(targetId);
      if (lastWhisper && now - lastWhisper < this.options.whisperCooldown) {
        const remaining = Math.ceil((this.options.whisperCooldown - (now - lastWhisper)) / 1000);
        return { allowed: false, reason: `Please wait ${remaining}s before whispering this player again` };
      }
    }

    return { allowed: true };
  }

  /**
   * Update cooldowns after sending a message
   */
  private updateCooldowns(senderId: string, channel: ChatChannel, targetId?: string): void {
    const now = Date.now();

    // Update global cooldown
    this.messageCooldowns.set(senderId, now);

    // Update whisper cooldown
    if (channel === ChatChannel.WHISPER && targetId) {
      let whisperMap = this.whisperCooldowns.get(senderId);
      if (!whisperMap) {
        whisperMap = new Map();
        this.whisperCooldowns.set(senderId, whisperMap);
      }
      whisperMap.set(targetId, now);
    }
  }

  /**
   * Filter profanity from message
   */
  private filterProfanity(message: string): string {
    let filtered = message;

    for (const profanity of PROFANITY_LIST) {
      const regex = new RegExp(profanity, 'gi');
      filtered = filtered.replace(regex, '*'.repeat(profanity.length));
    }

    return filtered;
  }

  /**
   * Generate unique message ID
   */
  private generateMessageId(): string {
    return `msg_${Date.now()}_${this.messageCounter++}`;
  }

  /**
   * Log message to database
   */
  private async logMessage(message: ChatMessage): Promise<void> {
    try {
      // Log to database for moderation
      // This would use Prisma to save the message
      // For now, just log to console
      logger.debug(`Chat logged: ${message.senderName} - ${message.channel}: ${message.message}`);
    } catch (error) {
      logger.error('Failed to log chat message:', error);
    }
  }

  /**
   * Get chat channel display color (for client)
   */
  getChannelColor(channel: ChatChannel): string {
    switch (channel) {
      case ChatChannel.GENERAL:
        return '#FFFFFF'; // White
      case ChatChannel.WHISPER:
        return '#FF69B4'; // Pink
      case ChatChannel.SHOUT:
        return '#FFFF00'; // Yellow
      case ChatChannel.PARTY:
        return '#00BFFF'; // Blue
      case ChatChannel.GUILD:
        return '#00FF00'; // Green
      case ChatChannel.GLOBAL:
        return '#FFA500'; // Orange
      default:
        return '#FFFFFF';
    }
  }

  /**
   * Get channel range (who can see the message)
   */
  getChannelRange(channel: ChatChannel): 'zone' | 'server' | 'private' {
    switch (channel) {
      case ChatChannel.GENERAL:
      case ChatChannel.SHOUT:
        return 'zone';
      case ChatChannel.WHISPER:
        return 'private';
      case ChatChannel.GLOBAL:
        return 'server';
      case ChatChannel.PARTY:
      case ChatChannel.GUILD:
        return 'private';
      default:
        return 'zone';
    }
  }

  /**
   * Check if player can use channel
   */
  canUseChannel(channel: ChatChannel, playerLevel: number = 1): boolean {
    // All channels available to all players for now
    // Could add level restrictions later
    return true;
  }

  /**
   * Format message for client display
   */
  formatMessage(message: ChatMessage): string {
    const channel = message.channel;
    const sender = message.senderName;
    const content = message.message;

    switch (channel) {
      case ChatChannel.GENERAL:
        return `[General] ${sender}: ${content}`;
      case ChatChannel.WHISPER:
        return `[Whisper] ${sender} -> ${message.targetId || 'Unknown'}: ${content}`;
      case ChatChannel.SHOUT:
        return `[SHOUT] ${sender}: ${content}`;
      case ChatChannel.PARTY:
        return `[Party] ${sender}: ${content}`;
      case ChatChannel.GUILD:
        return `[Guild] ${sender}: ${content}`;
      case ChatChannel.GLOBAL:
        return `[Global] ${sender}: ${content}`;
      default:
        return `${sender}: ${content}`;
    }
  }

  /**
   * Clear all cooldowns (for admin use)
   */
  clearCooldowns(playerId?: string): void {
    if (playerId) {
      this.messageCooldowns.delete(playerId);
      this.whisperCooldowns.delete(playerId);
    } else {
      this.messageCooldowns.clear();
      this.whisperCooldowns.clear();
    }
  }

  /**
   * Get active message count (for debugging)
   */
  getActiveMessageCount(): number {
    return this.messageCounter;
  }

  /**
   * Get cooldown info for a player
   */
  getPlayerCooldownInfo(playerId: string): {
    globalCooldownRemaining: number;
    whisperTargets: string[];
  } {
    const now = Date.now();
    const lastMessage = this.messageCooldowns.get(playerId) || 0;
    const globalCooldownRemaining = Math.max(0, this.options.globalCooldown - (now - lastMessage));

    const whisperTargets: string[] = [];
    const whisperMap = this.whisperCooldowns.get(playerId);
    if (whisperMap) {
      for (const [targetId, lastWhisper] of whisperMap) {
        if (now - lastWhisper < this.options.whisperCooldown) {
          whisperTargets.push(targetId);
        }
      }
    }

    return {
      globalCooldownRemaining,
      whisperTargets,
    };
  }
}

/**
 * Global chat manager instance
 */
export const globalChatManager = new ChatManager();
