// ============================================
// SRObro - Story Quests
// Main storyline quests
// ============================================

import { QuestType } from '@prisma/client';

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
