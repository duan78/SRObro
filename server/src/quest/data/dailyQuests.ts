// ============================================
// SRObro - Daily Quests
// Repeatable daily quests
// ============================================

import { QuestType } from '@prisma/client';

export const DAILY_QUESTS = [
  {
    name: 'Daily Monster Hunt',
    type: QuestType.daily,
    minLevel: 10,
    maxLevel: 120,
    repeatable: true,
    repeatCooldownHrs: 24,
    isDaily: true,
    prerequisite: [],
    objectives: [
      {
        type: 'kill',
        targetId: 'mob_mangyang',
        targetName: 'Any Monster',
        count: 50
      }
    ],
    rewards: {
      exp: 5000,
      sp: 500,
      gold: 10000,
      items: []
    },
    startsAt: ['npc_jangan_daily'],
    endsAt: ['npc_jangan_daily']
  },

  {
    name: 'Daily Collection',
    type: QuestType.daily,
    minLevel: 10,
    maxLevel: 120,
    repeatable: true,
    repeatCooldownHrs: 24,
    isDaily: true,
    prerequisite: [],
    objectives: [
      {
        type: 'collect',
        targetId: 'item_herb',
        targetName: 'Herb',
        count: 20
      }
    ],
    rewards: {
      exp: 3000,
      sp: 300,
      gold: 5000,
      items: []
    },
    startsAt: ['npc_jangan_daily'],
    endsAt: ['npc_jangan_daily']
  }
];
