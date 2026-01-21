// ============================================
// GAME CONFIGURATION
// ============================================

export const GAME_CONFIG = {
  MAX_LEVEL: 120,
  MAX_SKILL_POINTS: 500,

  // Experience curve
  EXP_CURVE: {
    BASE: 100,
    MULTIPLIER: 1.15,
  },

  // Chinese masteries
  CHINESE_MASTERY_MAX_LEVEL: 80,
  TOTAL_CHINESE_MASTERY_LEVELS: 560, // 7 masteries * 80

  // European masteries
  EUROPEAN_MASTERY_MAX_LEVEL: 60,

  // Stat points per level
  STAT_POINTS_PER_LEVEL: 3,

  // HP/MP formulas
  HP_PER_STR: 20,
  HP_BASE: 200,
  MP_PER_INT: 15,
  MP_BASE: 100,

  // Movement
  WALK_SPEED: 3.0,
  RUN_SPEED: 5.0,
  ROTATION_SPEED: 0.1,
} as const;

// ============================================
// CHINESE MASTERY TREES
// ============================================

export const CHINESE_MASTERY_TREES = {
  BICHEON: {
    id: 'mastery_bicheon',
    name: 'Bicheon',
    nameKr: '비검',
    maxLevel: 80,
    skills: [
      'smash_series',
      'blade_chain_series',
      'sword_chain_series',
      'blocking_series',
      'killing_wind_series',
      'sword_force_series',
      'body_debuff_series',
      'chain_sword_soul_series',
    ],
  },
  HEUKSAL: {
    id: 'mastery_heuksal',
    name: 'Heuksal',
    nameKr: '창법',
    maxLevel: 80,
    skills: [
      'flying_dragons_series',
      'ghost_spear_series',
      'lightning_series',
      'counter_attack_series',
      'spear_defense_series',
      'dragon_down_series',
      'spirit_series',
    ],
  },
  PACHEON: {
    id: 'mastery_pacheon',
    name: 'Pacheon',
    nameKr: '궁술',
    maxLevel: 80,
    skills: [
      'arrow_series',
      'anti_arrow_series',
      'explosion_series',
      'strong_bow_series',
      'combo_arrow_series',
      'bird_fall_series',
    ],
  },
  FIRE: {
    id: 'mastery_fire',
    name: 'Fire Force',
    nameKr: '화염',
    maxLevel: 80,
    skills: [
      'fire_burn_series',
      'fire_trap_series',
      'fire_wall_series',
      'fire_wave_series',
      'fire_thruster_series',
      'buff_series',
    ],
  },
  COLD: {
    id: 'mastery_cold',
    name: 'Cold Force',
    nameKr: '빙하',
    maxLevel: 80,
    skills: [
      'frost_wall_series',
      'ice_bolt_series',
      'snow_storm_series',
      'freeze_series',
      'cold_armor_series',
      'debuff_series',
    ],
  },
  LIGHTNING: {
    id: 'mastery_lightning',
    name: 'Lightning Force',
    nameKr: '전격',
    maxLevel: 80,
    skills: [
      'lightning_series',
      'thunder_series',
      'wind_series',
      'lightning_storm_series',
      'speed_series',
      'paralyze_series',
    ],
  },
  FORCE: {
    id: 'mastery_force',
    name: 'Force Force',
    nameKr: '신력',
    maxLevel: 80,
    skills: [
      'heal_series',
      'mana_cycle_series',
      'resurrection_series',
      'divine_force_series',
      'curse_series',
      'buff_series',
    ],
  },
} as const;

// ============================================
// EUROPEAN MASTERY TREES
// ============================================

export const EUROPEAN_MASTERY_TREES = {
  WARRIOR: {
    id: 'mastery_warrior',
    name: 'Warrior',
    maxLevel: 60,
    skills: ['twohand', 'onehand', 'defense'],
  },
  ROGUE: {
    id: 'mastery_rogue',
    name: 'Rogue',
    maxLevel: 60,
    skills: ['crossbow', 'dart', 'stealth'],
  },
  WIZARD: {
    id: 'mastery_wizard',
    name: 'Wizard',
    maxLevel: 60,
    skills: ['earth', 'fire', 'ice', 'lightning'],
  },
  WARLOCK: {
    id: 'mastery_warlock',
    name: 'Warlock',
    maxLevel: 60,
    skills: ['dot', 'debuff', 'curse'],
  },
  CLERIC: {
    id: 'mastery_cleric',
    name: 'Cleric',
    maxLevel: 60,
    skills: ['heal', 'buff', 'prot'],
  },
  BARD: {
    id: 'mastery_bard',
    name: 'Bard',
    maxLevel: 60,
    skills: ['buff', 'mana', 'speed'],
  },
} as const;

// ============================================
// ITEM RARITY
// ============================================

export const ITEM_RARITY_COLORS = {
  common: 0xFFFFFFFF, // White
  rare: 0xFF00FF00, // Green
  legendary: 0xFF0070DD, // Blue
  unique: 0xFFFF8000, // Orange
} as const;

// ============================================
// EQUIPMENT SLOTS
// ============================================

export const EQUIPMENT_SLOTS = [
  'weapon',
  'shield',
  'helmet',
  'chest',
  'shoulder',
  'legs',
  'boots',
  'ring1',
  'ring2',
  'necklace',
  'earring1',
  'earring2',
] as const;

// ============================================
// JOB SYSTEM CONSTANTS
// ============================================

export const JOB_SYSTEM = {
  TRADER: {
    name: 'Trader',
    STAR_LEVELS: ['one_star', 'two_star', 'three_star', 'four_star', 'five_star'],
    MAX_STAR_POINTS: 5,
    TRANSPORT_HP: {
      one_star: 5000,
      two_star: 10000,
      three_star: 20000,
      four_star: 40000,
      five_star: 80000,
    },
  },
  THIEF: {
    name: 'Thief',
    MAX_LEVEL: 5,
  },
  HUNTER: {
    name: 'Hunter',
    MAX_LEVEL: 5,
  },
} as const;

// ============================================
// TRADE GOODS
// ============================================

export const TRADE_GOODS = {
  JANGAN: [
    { id: 'good_silk', name: 'Silk', buyPrice: 1000, sellPrice: 1500 },
    { id: 'good_potions', name: 'Potions', buyPrice: 500, sellPrice: 800 },
    { id: 'good_trinkets', name: 'Trinkets', buyPrice: 800, sellPrice: 1200 },
  ],
  DONWHANG: [
    { id: 'good_spices', name: 'Spices', buyPrice: 1200, sellPrice: 1800 },
    { id: 'good_fabric', name: 'Fabric', buyPrice: 900, sellPrice: 1400 },
  ],
  HOTAN: [
    { id: 'good_jewelry', name: 'Jewelry', buyPrice: 2000, sellPrice: 3000 },
    { id: 'good_medicine', name: 'Medicine', buyPrice: 1500, sellPrice: 2200 },
  ],
} as const;

// ============================================
// ZONES
// ============================================

export const ZONES = {
  JANGAN: {
    id: 'zone_jangan',
    name: 'Jangan',
    levelRange: { min: 1, max: 20 },
    position: { x: 0, y: 0, z: 0 },
  },
  DONWHANG: {
    id: 'zone_donwhang',
    name: 'Donwhang',
    levelRange: { min: 20, max: 40 },
    position: { x: 1000, y: 0, z: 1000 },
  },
  HOTAN: {
    id: 'zone_hotan',
    name: 'Hotan',
    levelRange: { min: 40, max: 60 },
    position: { x: 2000, y: 0, z: 2000 },
  },
  CONSTANTINOPLE: {
    id: 'zone_constantinople',
    name: 'Constantinople',
    levelRange: { min: 1, max: 20 },
    position: { x: -1000, y: 0, z: 0 },
  },
  THIEF_VILLAGE: {
    id: 'zone_thief_village',
    name: 'Thief Village',
    levelRange: { min: 30, max: 50 },
    position: { x: 0, y: 0, z: -1000 },
  },
} as const;

// ============================================
// NETWORK CONSTANTS
// ============================================

export const NETWORK_CONFIG = {
  TICK_RATE: 20, // Server tick rate in Hz
  UPDATE_INTERVAL: 50, // Milliseconds between updates
  CONNECT_TIMEOUT: 10000, // 10 seconds
  HEARTBEAT_INTERVAL: 30000, // 30 seconds
  MAX_PACKET_SIZE: 1024 * 1024, // 1MB
  RECONNECT_DELAY: 5000, // 5 seconds
} as const;

// ============================================
// COMBAT CONSTANTS
// ============================================

export const COMBAT_CONFIG = {
  AUTO_ATTACK_DELAY: 2000, // 2 seconds
  GCD: 1500, // Global cooldown in milliseconds
  RESPAWN_TIME: 10, // 10 seconds for regular monsters
  UNIQUE_RESPAWN_TIME: 3600, // 1 hour for unique monsters
  AGGRO_RANGE: 15, // 15 meters
  COMBAT_RANGE: 3, // 3 meters for melee attacks
  SPELL_CAST_RANGE: 15, // 15 meters for ranged attacks
} as const;

// ============================================
// PARTY CONFIG
// ============================================

export const PARTY_CONFIG = {
  MAX_MEMBERS: 8,
  EXP_SHARE_BONUS: 0.2, // 20% bonus exp for party
  EXP_SHARE_RANGE: 30, // 30 meters
} as const;

// ============================================
// GUILD CONFIG
// ============================================

export const GUILD_CONFIG = {
  MAX_MEMBERS: 40,
  MAX_NAME_LENGTH: 20,
  MIN_NAME_LENGTH: 3,
  CREATE_COST: 500000, // 500k gold
  LEVEL_CAP: 5,
} as const;

// ============================================
// INVENTORY CONFIG
// ============================================

export const INVENTORY_CONFIG = {
  MAX_SLOTS: 45, // 5 rows of 9
  MAX_GOLD: 1000000000, // 1 billion gold
} as const;

// ============================================
// ALCHEMY CONFIG
// ============================================

export const ALCHEMY_CONFIG = {
  MAX_PLUS: 12,
  CRITICAL_CHANCE: 0.05, // 5%

  // Lucky Powder bonuses
  LUCKY_POWDER: {
    'C': 0.05,  // +5%
    'B': 0.10,  // +10%
    'A': 0.15   // +15%
  },

  // Destruction threshold (above +6 can destroy)
  DESTRUCTION_THRESHOLD: 6,

  // Destruction rate multiplier when failed without protector
  DESTRUCTION_MULTIPLIER: 0.5,
} as const;

// ============================================
// PK/PVP CONFIG
// ============================================

export const PK_CONFIG = {
  // Point thresholds for each murderer level
  THRESHOLDS: {
    NORMAL: 0,          // White name
    MURDERER_1: 100,    // Blue name
    MURDERER_2: 500,    // Purple name
    MURDERER_3: 1000,   // Red name
    MURDERER_4: 2000    // Dark red name
  },

  // Penalties per level
  PENALTIES: {
    0: { teleportBlock: false, npcBlock: false, dropRate: 0 },
    1: { teleportBlock: false, npcBlock: false, dropRate: 0.05 },
    2: { teleportBlock: true, npcBlock: true, dropRate: 0.10 },
    3: { teleportBlock: true, npcBlock: true, dropRate: 0.25 },
    4: { teleportBlock: true, npcBlock: true, dropRate: 0.50 }
  },

  // Point decay per hour
  POINT_DECAY_PER_HOUR: 10,

  // Points gained for killing a player
  POINTS_PER_PK: 50,

  // Points gained in self-defense (if opponent attacks first)
  POINTS_SELF_DEFENSE: 0,
} as const;

// ============================================
// STALL CONFIG
// ============================================

export const STALL_CONFIG = {
  MAX_ITEMS: 15,
  MAX_TITLE_LENGTH: 32,
  MIN_TITLE_LENGTH: 3,
  OPEN_COST: 1000, // Gold cost to open stall
} as const;

// ============================================
// SKILL TREE NAMES
// ============================================

export const SKILL_TREE_NAMES = {
  CHINESE: {
    BICHEON: 'Sword/Blade',
    HEUKSAL: 'Spear/Glaive',
    PACHEON: 'Bow',
    FIRE: 'Fire Force',
    COLD: 'Cold Force (Ice)',
    LIGHTNING: 'Lightning Force',
    FORCE: 'Force Force',
  },
  EUROPEAN: {
    WARRIOR: 'Warrior',
    ROGUE: 'Rogue',
    WIZARD: 'Wizard',
    WARLOCK: 'Warlock',
    CLERIC: 'Cleric',
    BARD: 'Bard',
  },
} as const;
