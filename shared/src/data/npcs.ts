// ============================================
// SRObro - Game NPCs Data
// Comprehensive NPC database for Silkroad Online
// ============================================

export interface GameNPC {
  id: string;
  name: string;
  npcType: NPCType;
  zoneId: string;
  position: { x: number; y: number; z: number };
  rotation: number;
  modelId: string;
  dialogue?: string[];
  shopItems?: string[]; // Item IDs sold by this NPC
  services?: string[];
  requiredLevel?: number;
}

export type NPCType =
  | 'shop'
  | 'storage'
  | 'stable'
  | 'quest'
  | 'teleport'
  | 'exchange'
  | 'guild'
  | 'union'
  | 'job';

// ============================================
// JANGAN ZONE NPCs
// ============================================

export const JANGAN_NPCS: GameNPC[] = [
  // Weapon Traders
  {
    id: 'npc_jangan_weapon_chinese',
    name: 'Weapon Trader (Chinese)',
    npcType: 'shop',
    zoneId: 'zone_jangan',
    position: { x: 100, y: 0, z: 150 },
    rotation: 0,
    modelId: 'npc_weapon_trader',
    shopItems: [
      'weapon_blade_1d',
      'weapon_sword_1d',
      'weapon_spear_1d',
      'weapon_bow_1d',
      'arrow_normal'
    ]
  },
  {
    id: 'npc_jangan_weapon_5d',
    name: 'Weapon Trader (5D)',
    npcType: 'shop',
    zoneId: 'zone_jangan',
    position: { x: 110, y: 0, z: 155 },
    rotation: 0,
    modelId: 'npc_weapon_trader',
    shopItems: [
      'weapon_blade_5d',
      'weapon_sword_5d',
      'weapon_spear_5d',
      'weapon_bow_5d'
    ]
  },

  // Armor Traders
  {
    id: 'npc_jangan_armor_chinese',
    name: 'Armor Trader (Chinese)',
    npcType: 'shop',
    zoneId: 'zone_jangan',
    position: { x: 120, y: 0, z: 160 },
    rotation: 0,
    modelId: 'npc_armor_trader',
    shopItems: [
      'chest_protector_1d_male',
      'chest_garment_1d_male',
      'chest_armor_1d_male'
    ]
  },
  {
    id: 'npc_jangan_armor_5d',
    name: 'Armor Trader (5D)',
    npcType: 'shop',
    zoneId: 'zone_jangan',
    position: { x: 125, y: 0, z: 165 },
    rotation: 0,
    modelId: 'npc_armor_trader',
    shopItems: [
      'chest_protector_5d_male',
      'chest_garment_5d_male',
      'chest_armor_5d_male'
    ]
  },

  // Potion Trader
  {
    id: 'npc_jangan_potion',
    name: 'Potion Trader',
    npcType: 'shop',
    zoneId: 'zone_jangan',
    position: { x: 90, y: 0, z: 140 },
    rotation: 0,
    modelId: 'npc_potion_trader',
    shopItems: [
      'potion_hp_10',
      'potion_mp_10',
      'potion_vigor',
      'scroll_return_jangan'
    ]
  },

  // Accessory Trader
  {
    id: 'npc_jangan_accessory',
    name: 'Accessory Trader',
    npcType: 'shop',
    zoneId: 'zone_jangan',
    position: { x: 95, y: 0, z: 145 },
    rotation: 0,
    modelId: 'npc_accessory_trader',
    shopItems: [
      'ring_1d',
      'necklace_1d',
      'earring_1d'
    ]
  },

  // Storage NPC
  {
    id: 'npc_jangan_storage',
    name: 'Storage Keeper',
    npcType: 'storage',
    zoneId: 'zone_jangan',
    position: { x: 85, y: 0, z: 135 },
    rotation: 0,
    modelId: 'npc_storage',
    services: ['storage_deposit', 'storage_withdraw']
  },

  // Stable NPC
  {
    id: 'npc_jangan_stable',
    name: 'Stable Keeper',
    npcType: 'stable',
    zoneId: 'zone_jangan',
    position: { x: 80, y: 0, z: 130 },
    rotation: 0,
    modelId: 'npc_stable',
    services: ['mount_buy', 'mount_sell', 'mount_repair']
  },

  // Teleport NPC
  {
    id: 'npc_jangan_teleport',
    name: 'Teleport',
    npcType: 'teleport',
    zoneId: 'zone_jangan',
    position: { x: 105, y: 0, z: 115 },
    rotation: 0,
    modelId: 'npc_teleport',
    dialogue: [
      'Greetings traveler.',
      'Where would you like to go?'
    ],
    services: ['teleport_donwhang', 'teleport_hotan']
  },

  // Guild Manager
  {
    id: 'npc_jangan_guild',
    name: 'Guild Manager',
    npcType: 'guild',
    zoneId: 'zone_jangan',
    position: { x: 115, y: 0, z: 120 },
    rotation: 0,
    modelId: 'npc_guild_manager',
    dialogue: [
      'Welcome to the Guild Association.',
      'Would you like to create or manage a guild?'
    ],
    services: ['guild_create', 'guild_join', 'guild_manage'],
    requiredLevel: 20
  },

  // Job Association (Trader/Thief/Hunter)
  {
    id: 'npc_jangan_trader_assoc',
    name: 'Trader Association',
    npcType: 'job',
    zoneId: 'zone_jangan',
    position: { x: 130, y: 0, z: 170 },
    rotation: 0,
    modelId: 'npc_trader_assoc',
    dialogue: [
      'Welcome to the Trader Association.',
      'Transport goods between cities to earn profit!'
    ],
    services: ['job_join_trader', 'transport_buy', 'goods_buy']
  },
  {
    id: 'npc_jangan_thief_assoc',
    name: 'Thief Association',
    npcType: 'job',
    zoneId: 'zone_jangan',
    position: { x: 200, y: 0, z: 200 },
    rotation: 0,
    modelId: 'npc_thief_assoc',
    dialogue: [
      'Welcome to the Thief Association.',
      'Attack traders and steal their goods!'
    ],
    services: ['job_join_thief', 'stolen_goods_sell']
  },
  {
    id: 'npc_jangan_hunter_assoc',
    name: 'Hunter Association',
    npcType: 'job',
    zoneId: 'zone_jangan',
    position: { x: 135, y: 0, z: 175 },
    rotation: 0,
    modelId: 'npc_hunter_assoc',
    dialogue: [
      'Welcome to the Hunter Association.',
      'Protect traders from thieves!'
    ],
    services: ['job_join_hunter', 'hunter_rewards']
  },

  // Quest NPCs
  {
    id: 'npc_jangan_quest_tutorial',
    name: 'Gate Guard',
    npcType: 'quest',
    zoneId: 'zone_jangan',
    position: { x: 75, y: 0, z: 125 },
    rotation: 0,
    modelId: 'npc_guard',
    dialogue: [
      'Welcome to Jangan!',
      'Please complete the tutorial quests.'
    ],
    services: ['quest_accept_tutorial', 'quest_complete_tutorial']
  },
];

// ============================================
// DONWHANG ZONE NPCs
// ============================================

export const DONWHANG_NPCS: GameNPC[] = [
  // Weapon Traders
  {
    id: 'npc_donwhang_weapon_5d',
    name: 'Weapon Trader (5D)',
    npcType: 'shop',
    zoneId: 'zone_donwhang',
    position: { x: 100, y: 0, z: 150 },
    rotation: 0,
    modelId: 'npc_weapon_trader',
    shopItems: [
      'weapon_blade_5d',
      'weapon_sword_5d',
      'weapon_spear_5d',
      'weapon_bow_5d'
    ]
  },
  {
    id: 'npc_donwhang_weapon_9d',
    name: 'Weapon Trader (9D)',
    npcType: 'shop',
    zoneId: 'zone_donwhang',
    position: { x: 110, y: 0, z: 155 },
    rotation: 0,
    modelId: 'npc_weapon_trader',
    shopItems: [
      'weapon_blade_9d',
      'weapon_sword_9d',
      'weapon_spear_9d',
      'weapon_bow_9d'
    ]
  },

  // Armor Traders
  {
    id: 'npc_donwhang_armor_5d',
    name: 'Armor Trader (5D)',
    npcType: 'shop',
    zoneId: 'zone_donwhang',
    position: { x: 120, y: 0, z: 160 },
    rotation: 0,
    modelId: 'npc_armor_trader',
    shopItems: [
      'chest_protector_5d_male',
      'chest_garment_5d_male',
      'chest_armor_5d_male'
    ]
  },
  {
    id: 'npc_donwhang_armor_9d',
    name: 'Armor Trader (9D)',
    npcType: 'shop',
    zoneId: 'zone_donwhang',
    position: { x: 125, y: 0, z: 165 },
    rotation: 0,
    modelId: 'npc_armor_trader',
    shopItems: [
      'chest_protector_9d_male',
      'chest_garment_9d_male',
      'chest_armor_9d_male'
    ]
  },

  // Potion Trader
  {
    id: 'npc_donwhang_potion',
    name: 'Potion Trader',
    npcType: 'shop',
    zoneId: 'zone_donwhang',
    position: { x: 90, y: 0, z: 140 },
    rotation: 0,
    modelId: 'npc_potion_trader',
    shopItems: [
      'potion_hp_50',
      'potion_mp_50',
      'potion_vigor',
      'scroll_return_donwhang'
    ]
  },

  // Accessory Trader
  {
    id: 'npc_donwhang_accessory',
    name: 'Accessory Trader',
    npcType: 'shop',
    zoneId: 'zone_donwhang',
    position: { x: 95, y: 0, z: 145 },
    rotation: 0,
    modelId: 'npc_accessory_trader',
    shopItems: [
      'ring_5d',
      'necklace_5d',
      'earring_5d'
    ]
  },

  // Storage NPC
  {
    id: 'npc_donwhang_storage',
    name: 'Storage Keeper',
    npcType: 'storage',
    zoneId: 'zone_donwhang',
    position: { x: 85, y: 0, z: 135 },
    rotation: 0,
    modelId: 'npc_storage',
    services: ['storage_deposit', 'storage_withdraw']
  },

  // Stable NPC
  {
    id: 'npc_donwhang_stable',
    name: 'Stable Keeper',
    npcType: 'stable',
    zoneId: 'zone_donwhang',
    position: { x: 80, y: 0, z: 130 },
    rotation: 0,
    modelId: 'npc_stable',
    services: ['mount_buy', 'mount_sell', 'mount_repair']
  },

  // Teleport NPC
  {
    id: 'npc_donwhang_teleport',
    name: 'Teleport',
    npcType: 'teleport',
    zoneId: 'zone_donwhang',
    position: { x: 105, y: 0, z: 115 },
    rotation: 0,
    modelId: 'npc_teleport',
    dialogue: [
      'Greetings traveler.',
      'Where would you like to go?'
    ],
    services: ['teleport_jangan', 'teleport_hotan']
  },

  // Guild Manager
  {
    id: 'npc_donwhang_guild',
    name: 'Guild Manager',
    npcType: 'guild',
    zoneId: 'zone_donwhang',
    position: { x: 115, y: 0, z: 120 },
    rotation: 0,
    modelId: 'npc_guild_manager',
    dialogue: [
      'Welcome to the Guild Association.',
      'Would you like to create or manage a guild?'
    ],
    services: ['guild_create', 'guild_join', 'guild_manage'],
    requiredLevel: 20
  },

  // Job Association
  {
    id: 'npc_donwhang_trader_assoc',
    name: 'Trader Association',
    npcType: 'job',
    zoneId: 'zone_donwhang',
    position: { x: 130, y: 0, z: 170 },
    rotation: 0,
    modelId: 'npc_trader_assoc',
    dialogue: [
      'Welcome to the Trader Association.',
      'Transport goods between cities to earn profit!'
    ],
    services: ['job_join_trader', 'transport_buy', 'goods_buy', 'goods_sell']
  },
  {
    id: 'npc_donwhang_hunter_assoc',
    name: 'Hunter Association',
    npcType: 'job',
    zoneId: 'zone_donwhang',
    position: { x: 135, y: 0, z: 175 },
    rotation: 0,
    modelId: 'npc_hunter_assoc',
    dialogue: [
      'Welcome to the Hunter Association.',
      'Protect traders from thieves!'
    ],
    services: ['job_join_hunter', 'hunter_rewards']
  },
];

// ============================================
// HOTAN ZONE NPCs
// ============================================

export const HOTAN_NPCS: GameNPC[] = [
  // Weapon Traders (High-level)
  {
    id: 'npc_hotan_weapon_9d',
    name: 'Weapon Trader (9D)',
    npcType: 'shop',
    zoneId: 'zone_hotan',
    position: { x: 100, y: 0, z: 150 },
    rotation: 0,
    modelId: 'npc_weapon_trader',
    shopItems: [
      'weapon_blade_9d',
      'weapon_sword_9d',
      'weapon_spear_9d',
      'weapon_bow_9d'
    ]
  },
  {
    id: 'npc_hotan_weapon_11d',
    name: 'Weapon Trader (11D)',
    npcType: 'shop',
    zoneId: 'zone_hotan',
    position: { x: 110, y: 0, z: 155 },
    rotation: 0,
    modelId: 'npc_weapon_trader',
    shopItems: [
      'weapon_blade_11d',
      'weapon_sword_11d',
      'weapon_spear_11d',
      'weapon_bow_11d'
    ]
  },

  // Armor Traders
  {
    id: 'npc_hotan_armor_9d',
    name: 'Armor Trader (9D)',
    npcType: 'shop',
    zoneId: 'zone_hotan',
    position: { x: 120, y: 0, z: 160 },
    rotation: 0,
    modelId: 'npc_armor_trader',
    shopItems: [
      'chest_protector_9d_male',
      'chest_garment_9d_male',
      'chest_armor_9d_male'
    ]
  },
  {
    id: 'npc_hotan_armor_11d',
    name: 'Armor Trader (11D)',
    npcType: 'shop',
    zoneId: 'zone_hotan',
    position: { x: 125, y: 0, z: 165 },
    rotation: 0,
    modelId: 'npc_armor_trader',
    shopItems: [
      'chest_protector_11d_male',
      'chest_garment_11d_male',
      'chest_armor_11d_male'
    ]
  },

  // Potion Trader
  {
    id: 'npc_hotan_potion',
    name: 'Potion Trader',
    npcType: 'shop',
    zoneId: 'zone_hotan',
    position: { x: 90, y: 0, z: 140 },
    rotation: 0,
    modelId: 'npc_potion_trader',
    shopItems: [
      'potion_hp_80',
      'potion_mp_50',
      'potion_vigor',
      'scroll_return_hotan'
    ]
  },

  // Accessory Trader
  {
    id: 'npc_hotan_accessory',
    name: 'Accessory Trader',
    npcType: 'shop',
    zoneId: 'zone_hotan',
    position: { x: 95, y: 0, z: 145 },
    rotation: 0,
    modelId: 'npc_accessory_trader',
    shopItems: [
      'ring_9d',
      'necklace_9d',
      'earring_9d'
    ]
  },

  // Alchemy Materials Trader
  {
    id: 'npc_hotan_alchemy',
    name: 'Alchemy Trader',
    npcType: 'shop',
    zoneId: 'zone_hotan',
    position: { x: 130, y: 0, z: 170 },
    rotation: 0,
    modelId: 'npc_alchemy_trader',
    shopItems: [
      'elixir_weapon',
      'elixir_armor',
      'elixir_accessory',
      'lucky_powder_c',
      'lucky_powder_b',
      'lucky_powder_a',
      'tablet_weapon',
      'tablet_armor'
    ]
  },

  // Stall Network (Hotan Palace)
  {
    id: 'npc_hotan_stall_network',
    name: 'Stall Network Manager',
    npcType: 'shop',
    zoneId: 'zone_hotan',
    position: { x: 200, y: 0, z: 200 },
    rotation: 0,
    modelId: 'npc_stall_network',
    dialogue: [
      'Welcome to the Stall Network!',
      'Search all player stalls in one place.'
    ],
    services: ['stall_network_search']
  },

  // Storage NPC
  {
    id: 'npc_hotan_storage',
    name: 'Storage Keeper',
    npcType: 'storage',
    zoneId: 'zone_hotan',
    position: { x: 85, y: 0, z: 135 },
    rotation: 0,
    modelId: 'npc_storage',
    services: ['storage_deposit', 'storage_withdraw']
  },

  // Stable NPC
  {
    id: 'npc_hotan_stable',
    name: 'Stable Keeper',
    npcType: 'stable',
    zoneId: 'zone_hotan',
    position: { x: 80, y: 0, z: 130 },
    rotation: 0,
    modelId: 'npc_stable',
    services: ['mount_buy', 'mount_sell', 'mount_repair']
  },

  // Teleport NPC
  {
    id: 'npc_hotan_teleport',
    name: 'Teleport',
    npcType: 'teleport',
    zoneId: 'zone_hotan',
    position: { x: 105, y: 0, z: 115 },
    rotation: 0,
    modelId: 'npc_teleport',
    dialogue: [
      'Greetings traveler.',
      'Where would you like to go?'
    ],
    services: ['teleport_jangan', 'teleport_donwhang']
  },

  // Guild Manager
  {
    id: 'npc_hotan_guild',
    name: 'Guild Manager',
    npcType: 'guild',
    zoneId: 'zone_hotan',
    position: { x: 115, y: 0, z: 120 },
    rotation: 0,
    modelId: 'npc_guild_manager',
    dialogue: [
      'Welcome to the Guild Association.',
      'Would you like to create or manage a guild?'
    ],
    services: ['guild_create', 'guild_join', 'guild_manage', 'guild_fortress'],
    requiredLevel: 20
  },

  // Job Association
  {
    id: 'npc_hotan_trader_assoc',
    name: 'Trader Association',
    npcType: 'job',
    zoneId: 'zone_hotan',
    position: { x: 135, y: 0, z: 175 },
    rotation: 0,
    modelId: 'npc_trader_assoc',
    dialogue: [
      'Welcome to the Trader Association.',
      'Transport goods between cities to earn profit!'
    ],
    services: ['job_join_trader', 'transport_buy', 'goods_buy', 'goods_sell']
  },
  {
    id: 'npc_hotan_hunter_assoc',
    name: 'Hunter Association',
    npcType: 'job',
    zoneId: 'zone_hotan',
    position: { x: 140, y: 0, z: 180 },
    rotation: 0,
    modelId: 'npc_hunter_assoc',
    dialogue: [
      'Welcome to the Hunter Association.',
      'Protect traders from thieves!'
    ],
    services: ['job_join_hunter', 'hunter_rewards']
  },
];

// ============================================
// THIEF VILLAGE NPCs
// ============================================

export const THIEF_VILLAGE_NPCS: GameNPC[] = [
  // Thief-specific NPC for selling stolen goods
  {
    id: 'npc_thief_village_fencer',
    name: 'Thief Fencer',
    npcType: 'shop',
    zoneId: 'zone_thief_village',
    position: { x: 100, y: 0, z: 150 },
    rotation: 0,
    modelId: 'npc_thief_fencer',
    dialogue: [
      'Got any hot goods?',
      'I\'ll buy anything... no questions asked.'
    ],
    services: ['stolen_goods_sell']
  },
  {
    id: 'npc_thief_village_teleport',
    name: 'Thief Teleporter',
    npcType: 'teleport',
    zoneId: 'zone_thief_village',
    position: { x: 105, y: 0, z: 155 },
    rotation: 0,
    modelId: 'npc_teleport',
    dialogue: [
      'Want to go back to the mainland?',
      'Careful, guards might be watching.'
    ],
    services: ['teleport_jangan', 'teleport_donwhang']
  },
];

// ============================================
// ALL NPCs COMBINED
// ============================================

export const ALL_NPCS: GameNPC[] = [
  ...JANGAN_NPCS,
  ...DONWHANG_NPCS,
  ...HOTAN_NPCS,
  ...THIEF_VILLAGE_NPCS,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getNPCsByZone(zoneId: string): GameNPC[] {
  return ALL_NPCS.filter(npc => npc.zoneId === zoneId);
}

export function getNPCsByType(npcType: NPCType): GameNPC[] {
  return ALL_NPCS.filter(npc => npc.npcType === npcType);
}

export function getNPCById(id: string): GameNPC | undefined {
  return ALL_NPCS.find(npc => npc.id === id);
}

export function getShopNPCs(zoneId?: string): GameNPC[] {
  let npcs = ALL_NPCS.filter(npc => npc.npcType === 'shop');
  if (zoneId) {
    npcs = npcs.filter(npc => npc.zoneId === zoneId);
  }
  return npcs;
}

export function getQuestNPCs(zoneId?: string): GameNPC[] {
  let npcs = ALL_NPCS.filter(npc => npc.npcType === 'quest');
  if (zoneId) {
    npcs = npcs.filter(npc => npc.zoneId === zoneId);
  }
  return npcs;
}
