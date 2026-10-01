// ============================================
// SRObro - Tutorial Quests
// Beginner quests to guide new players
// ============================================

import { QuestType } from '@prisma/client';

export const TUTORIAL_QUESTS = [
  {
    name: 'Welcome to Silkroad',
    type: QuestType.tutorial,
    minLevel: 1,
    maxLevel: 5,
    prerequisite: [],
    objectives: [
      {
        type: 'talk',
        targetId: 'npc_jangan_guard',
        targetName: 'General SONHEYON',
        count: 1
      }
    ],
    rewards: {
      exp: 100,
      sp: 10,
      gold: 500,
      items: []
    },
    startsAt: ['npc_jangan_start'],
    endsAt: ['npc_jangan_guard'],
    repeatable: false
  },

  {
    name: 'First Steps',
    type: QuestType.tutorial,
    minLevel: 1,
    maxLevel: 5,
    prerequisite: ['tutorial_01'],
    objectives: [
      {
        type: 'kill',
        targetId: 'mob_yeoha',
        targetName: 'Yeoha',
        count: 5
      }
    ],
    rewards: {
      exp: 500,
      sp: 50,
      gold: 1000,
      items: [
        { itemId: 'item_hp_potion_lv1', quantity: 10 }
      ]
    },
    startsAt: ['npc_jangan_guard'],
    endsAt: ['npc_jangan_guard'],
    repeatable: false
  },

  {
    name: 'Equip Your Weapon',
    type: QuestType.tutorial,
    minLevel: 1,
    maxLevel: 5,
    prerequisite: ['tutorial_02'],
    objectives: [
      {
        type: 'talk',
        targetId: 'npc_jangan_weapon',
        targetName: 'Weapon Trader',
        count: 1
      }
    ],
    rewards: {
      exp: 200,
      sp: 20,
      gold: 0,
      items: [
        { itemId: 'weapon_training_blade', quantity: 1 }
      ]
    },
    startsAt: ['npc_jangan_guard'],
    endsAt: ['npc_jangan_weapon'],
    repeatable: false
  },

  {
    name: 'Combat Training',
    type: QuestType.tutorial,
    minLevel: 2,
    maxLevel: 10,
    prerequisite: ['tutorial_03'],
    objectives: [
      {
        type: 'kill',
        targetId: 'mob_mangyang',
        targetName: 'Mangyang',
        count: 10
      }
    ],
    rewards: {
      exp: 1000,
      sp: 100,
      gold: 2000,
      items: []
    },
    startsAt: ['npc_jangan_guard'],
    endsAt: ['npc_jangan_guard'],
    repeatable: false
  },

  {
    name: 'Level Up Challenge',
    type: QuestType.tutorial,
    minLevel: 1,
    maxLevel: 10,
    prerequisite: ['tutorial_04'],
    objectives: [
      {
        type: 'explore',
        targetId: 'zone_jangan',
        targetName: 'Reach Level 5',
        count: 5
      }
    ],
    rewards: {
      exp: 2000,
      sp: 200,
      gold: 5000,
      items: [
        { itemId: 'item_return_scroll', quantity: 5 }
      ]
    },
    startsAt: ['npc_jangan_guard'],
    endsAt: ['npc_jangan_guard'],
    repeatable: false
  }
];
