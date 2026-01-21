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

export const STORY_QUESTS = [
  {
    name: 'The Rising Threat',
    type: QuestType.story,
    minLevel: 10,
    maxLevel: 20,
    prerequisite: [],
    repeatable: false,
    objectives: [
      {
        type: 'kill',
        targetId: 'unique_tiger_girl',
        targetName: 'Tiger Girl',
        count: 1
      }
    ],
    rewards: {
      exp: 50000,
      sp: 5000,
      gold: 100000,
      items: [
        { itemId: 'item_rare_ring_5d', quantity: 1 }
      ]
    },
    startsAt: ['npc_jangan_story'],
    endsAt: ['npc_jangan_story']
  }
];
