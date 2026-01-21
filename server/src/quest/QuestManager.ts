// ============================================
// SRObro - Quest Manager
// Manages quest system, objectives, and rewards
// ============================================

import { PrismaClient, Quest, QuestProgress, QuestStatus, QuestType } from '@prisma/client';
import { EventEmitter } from 'events';

const prisma = new PrismaClient();

export interface QuestObjective {
  type: 'kill' | 'collect' | 'talk' | 'delivery' | 'explore';
  targetId: string;
  targetName: string;
  count: number;
  currentCount?: number;
}

export class QuestManager extends EventEmitter {
  private static instance: QuestManager;

  private constructor() {
    super();
  }

  static getInstance(): QuestManager {
    if (!QuestManager.instance) {
      QuestManager.instance = new QuestManager();
    }
    return QuestManager.instance;
  }

  // ============================================
  // QUEST MANAGEMENT
  // ============================================

  async createQuest(data: {
    name: string;
    type: QuestType;
    minLevel: number;
    maxLevel?: number;
    prerequisite?: string[];
    objectives: QuestObjective[];
    rewards: any;
    startsAt: string[];
    endsAt: string[];
    repeatable?: boolean;
    repeatCooldownHrs?: number;
    isDaily?: boolean;
  }): Promise<Quest> {
    return await prisma.quest.create({
      data: {
        name: data.name,
        type: data.type,
        minLevel: data.minLevel,
        maxLevel: data.maxLevel,
        prerequisite: data.prerequisite as any,
        objectives: data.objectives as any,
        rewards: data.rewards as any,
        startsAt: data.startsAt,
        endsAt: data.endsAt,
        repeatable: data.repeatable,
        repeatCooldownHrs: data.repeatCooldownHrs,
        isDaily: data.isDaily || false
      }
    });
  }

  async getQuestById(questId: string): Promise<Quest | null> {
    return await prisma.quest.findUnique({
      where: { id: questId }
    });
  }

  async getQuestsByLevel(minLevel: number, maxLevel: number): Promise<Quest[]> {
    return await prisma.quest.findMany({
      where: {
        minLevel: { lte: minLevel },
        OR: [
          { maxLevel: null },
          { maxLevel: { gte: minLevel } }
        ]
      },
      orderBy: { minLevel: 'asc' }
    });
  }

  async getQuestsByType(type: QuestType): Promise<Quest[]> {
    return await prisma.quest.findMany({
      where: { type }
    });
  }

  async getAvailableQuests(characterId: string): Promise<Quest[]> {
    const character = await prisma.character.findUnique({
      where: { id: characterId },
      include: {
        questProgress: {
          include: { quest: true }
        }
      }
    });

    if (!character) {
      return [];
    }

    const completedQuestIds = character.questProgress
      .filter(qp => qp.status === QuestStatus.completed)
      .map(qp => qp.questId);

    const inProgressQuestIds = character.questProgress
      .filter(qp => qp.status === QuestStatus.in_progress)
      .map(qp => qp.questId);

    const allQuests = await prisma.quest.findMany({
      where: {
        minLevel: { lte: character.level },
        OR: [
          { maxLevel: null },
          { maxLevel: { gte: character.level } }
        ]
      }
    });

    return allQuests.filter(quest => {
      // Filter out already completed (unless repeatable)
      if (completedQuestIds.includes(quest.id) && !quest.repeatable) {
        return false;
      }

      // Filter out already in progress
      if (inProgressQuestIds.includes(quest.id)) {
        return false;
      }

      // Check prerequisites
      if (quest.prerequisite && Array.isArray(quest.prerequisite)) {
        const hasAllPrerequisites = quest.prerequisite.every(prereqId =>
          completedQuestIds.includes(prereqId)
        );
        if (!hasAllPrerequisites) {
          return false;
        }
      }

      // Check repeat cooldown
      if (quest.repeatable && completedQuestIds.includes(quest.id)) {
        const progress = character.questProgress.find(qp => qp.questId === quest.id);
        if (progress && progress.canRepeatAt) {
          if (new Date() < progress.canRepeatAt) {
            return false;
          }
        }
      }

      return true;
    });
  }

  async getQuestProgress(characterId: string): Promise<any[]> {
    const progressList = await prisma.questProgress.findMany({
      where: { characterId },
      include: { quest: true },
      orderBy: { startedAt: 'desc' }
    });

    return progressList.map(progress => ({
      ...progress,
      objectives: (progress.quest as any).objectives.map((obj: any, index: number) => ({
        ...obj,
        currentCount: (progress.progress as any)[index] || 0
      }))
    }));
  }

  // ============================================
  // QUEST ACTIONS
  // ============================================

  async acceptQuest(characterId: string, questId: string): Promise<QuestProgress> {
    const quest = await prisma.quest.findUnique({
      where: { id: questId }
    });

    if (!quest) {
      throw new Error('Quest not found');
    }

    const character = await prisma.character.findUnique({
      where: { id: characterId }
    });

    if (!character) {
      throw new Error('Character not found');
    }

    if (character.level < quest.minLevel) {
      throw new Error('Character level is too low for this quest');
    }

    if (quest.maxLevel && character.level > quest.maxLevel) {
      throw new Error('Character level is too high for this quest');
    }

    // Check if already accepted
    const existingProgress = await prisma.questProgress.findUnique({
      where: {
        characterId_questId: {
          characterId,
          questId
        }
      }
    });

    if (existingProgress) {
      if (existingProgress.status === QuestStatus.in_progress) {
        throw new Error('Quest is already in progress');
      }

      // If completed but repeatable, reset progress
      if (existingProgress.status === QuestStatus.completed && quest.repeatable) {
        const canRepeatAt = new Date(existingProgress.completedAt!);
        canRepeatAt.setHours(canRepeatAt.getHours() + (quest.repeatCooldownHrs || 24));

        if (new Date() >= canRepeatAt) {
          return await prisma.questProgress.update({
            where: { id: existingProgress.id },
            data: {
              status: QuestStatus.in_progress,
              progress: {},
              startedAt: new Date(),
              completedAt: null,
              canRepeatAt: null
            }
          });
        }
      }

      throw new Error('Quest already completed');
    }

    // Check prerequisites
    if (quest.prerequisite && Array.isArray(quest.prerequisite)) {
      const completedQuests = await prisma.questProgress.count({
        where: {
          characterId,
          questId: { in: quest.prerequisite },
          status: QuestStatus.completed
        }
      });

      if (completedQuests < quest.prerequisite.length) {
        throw new Error('You have not completed the prerequisite quests');
      }
    }

    // Initialize progress for all objectives
    const initialProgress: any = {};
    (quest.objectives as any).forEach((_: any, index: number) => {
      initialProgress[index] = 0;
    });

    const progress = await prisma.questProgress.create({
      data: {
        characterId,
        questId,
        status: QuestStatus.in_progress,
        progress: initialProgress,
        startedAt: new Date()
      }
    });

    this.emit('questAccepted', { characterId, questId });
    return progress;
  }

  async updateQuestProgress(
    characterId: string,
    questId: string,
    objectiveIndex: number,
    increment: number = 1
  ): Promise<QuestProgress | null> {
    const progress = await prisma.questProgress.findUnique({
      where: {
        characterId_questId: {
          characterId,
          questId
        }
      },
      include: { quest: true }
    });

    if (!progress || progress.status !== QuestStatus.in_progress) {
      return null;
    }

    const objectives = (progress.quest as any).objectives as QuestObjective[];
    if (objectiveIndex < 0 || objectiveIndex >= objectives.length) {
      throw new Error('Invalid objective index');
    }

    const currentProgress = (progress.progress as any)[objectiveIndex] || 0;
    const newProgress = currentProgress + increment;

    const updatedProgressData: any = {
      ...progress.progress,
      [objectiveIndex]: newProgress
    };

    // Check if all objectives are complete
    const allComplete = objectives.every((obj, index) => {
      const required = obj.count;
      const current = updatedProgressData[index] || 0;
      return current >= required;
    });

    const updatedProgress = await prisma.questProgress.update({
      where: { id: progress.id },
      data: { progress: updatedProgressData }
    });

    if (allComplete) {
      await this.completeQuest(progress.id);
    }

    return updatedProgress;
  }

  async completeQuest(progressId: string): Promise<QuestProgress> {
    const progress = await prisma.questProgress.findUnique({
      where: { id: progressId },
      include: { quest: true, character: true }
    });

    if (!progress) {
      throw new Error('Quest progress not found');
    }

    const quest = progress.quest as any;
    const character = progress.character;

    // Grant rewards
    if (quest.rewards.exp) {
      await prisma.character.update({
        where: { id: progress.characterId },
        data: { exp: { increment: BigInt(quest.rewards.exp) } }
      });
    }

    if (quest.rewards.sp) {
      await prisma.character.update({
        where: { id: progress.characterId },
        data: { sp: { increment: BigInt(quest.rewards.sp) } }
      });
    }

    if (quest.rewards.gold) {
      await prisma.character.update({
        where: { id: progress.characterId },
        data: { gold: { increment: BigInt(quest.rewards.gold) } }
      });
    }

    // Grant items (simplified - would need inventory management)
    if (quest.rewards.items && Array.isArray(quest.rewards.items)) {
      // TODO: Add items to inventory
    }

    // Set repeat time if applicable
    let canRepeatAt: Date | null = null;
    if (quest.repeatable && quest.repeatCooldownHrs) {
      canRepeatAt = new Date();
      canRepeatAt.setHours(canRepeatAt.getHours() + quest.repeatCooldownHrs);
    }

    const updatedProgress = await prisma.questProgress.update({
      where: { id: progressId },
      data: {
        status: QuestStatus.completed,
        completedAt: new Date(),
        canRepeatAt
      }
    });

    this.emit('questCompleted', {
      characterId: progress.characterId,
      questId: progress.questId,
      rewards: quest.rewards
    });

    return updatedProgress;
  }

  async abandonQuest(characterId: string, questId: string): Promise<void> {
    const progress = await prisma.questProgress.findUnique({
      where: {
        characterId_questId: {
          characterId,
          questId
        }
      }
    });

    if (!progress) {
      throw new Error('Quest not found');
    }

    if (progress.status !== QuestStatus.in_progress) {
      throw new Error('Can only abandon in-progress quests');
    }

    await prisma.questProgress.delete({
      where: { id: progress.id }
    });

    this.emit('questAbandoned', { characterId, questId });
  }

  // ============================================
  // QUEST TRACKING (Game Loop Integration)
  // ============================================

  async onMonsterKill(characterId: string, monsterId: string): Promise<void> {
    // Get all in-progress quests for this character
    const progressList = await prisma.questProgress.findMany({
      where: {
        characterId,
        status: QuestStatus.in_progress
      },
      include: { quest: true }
    });

    for (const progress of progressList) {
      const quest = progress.quest as any;
      const objectives = quest.objectives as QuestObjective[];

      objectives.forEach((obj, index) => {
        if (obj.type === 'kill' && obj.targetId === monsterId) {
          const current = (progress.progress as any)[index] || 0;
          if (current < obj.count) {
            this.updateQuestProgress(characterId, quest.id, index, 1);
          }
        }
      });
    }
  }

  async onItemPickup(characterId: string, itemId: string): Promise<void> {
    const progressList = await prisma.questProgress.findMany({
      where: {
        characterId,
        status: QuestStatus.in_progress
      },
      include: { quest: true }
    });

    for (const progress of progressList) {
      const quest = progress.quest as any;
      const objectives = quest.objectives as QuestObjective[];

      objectives.forEach((obj, index) => {
        if (obj.type === 'collect' && obj.targetId === itemId) {
          const current = (progress.progress as any)[index] || 0;
          if (current < obj.count) {
            this.updateQuestProgress(characterId, quest.id, index, 1);
          }
        }
      });
    }
  }

  async onNPCInteract(characterId: string, npcId: string): Promise<any[]> {
    // Get quests that start or end at this NPC
    const availableQuests = await this.getAvailableQuests(characterId);
    const progressList = await this.getQuestProgress(characterId);

    const startableQuests = availableQuests.filter(q => q.startsAt.includes(npcId));
    const completableQuests = progressList.filter(p =>
      p.quest.endsAt.includes(npcId) &&
      p.status === QuestStatus.in_progress
    );

    return {
      startable: startableQuests,
      completable: completableQuests
    };
  }
}

export default QuestManager;
