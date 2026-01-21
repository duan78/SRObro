// ============================================
// SRObro - Game Monsters Data
// Comprehensive monster database for Silkroad Online
// ============================================

export interface GameMonster {
  id: string;
  name: string;
  level: number;
  hp: number;
  mp: number;
  attackPowerMin: number;
  attackPowerMax: number;
  defense: number;
  magicalDefense: number;
  exp: number;
  sp: number;
  aggroRange: number;
  attackRange: number;
  moveSpeed: number;
  attackSpeed: number; // milliseconds
  respawnTime: number; // seconds
  modelId: string;
  isUnique: boolean;
  zoneId: string;
  canChampion: boolean;
  canGiant: boolean;
}

export interface MonsterDrop {
  monsterId: string;
  itemId: string;
  chance: number; // 0-1
  quantityMin: number;
  quantityMax: number;
}

// ============================================
// JANGAN ZONE MONSTERS (Level 1-20)
// ============================================

export const JANGAN_MONSTERS: GameMonster[] = [
  // Level 1-5
  {
    id: 'monster_maiden_lv1',
    name: 'Maiden',
    level: 1,
    hp: 30,
    mp: 10,
    attackPowerMin: 2,
    attackPowerMax: 5,
    defense: 2,
    magicalDefense: 2,
    exp: 10,
    sp: 2,
    aggroRange: 10,
    attackRange: 2.5,
    moveSpeed: 2.5,
    attackSpeed: 2000,
    respawnTime: 10,
    modelId: 'monster_maiden',
    isUnique: false,
    zoneId: 'zone_jangan',
    canChampion: true,
    canGiant: false
  },
  {
    id: 'monster_yeoha_lv4',
    name: 'Yeoha',
    level: 4,
    hp: 80,
    mp: 20,
    attackPowerMin: 8,
    attackPowerMax: 15,
    defense: 8,
    magicalDefense: 8,
    exp: 50,
    sp: 10,
    aggroRange: 12,
    attackRange: 2.5,
    moveSpeed: 3.0,
    attackSpeed: 2000,
    respawnTime: 15,
    modelId: 'monster_yeoha',
    isUnique: false,
    zoneId: 'zone_jangan',
    canChampion: true,
    canGiant: false
  },
  {
    id: 'monster_spider_lv7',
    name: 'Spider',
    level: 7,
    hp: 150,
    mp: 30,
    attackPowerMin: 15,
    attackPowerMax: 25,
    defense: 15,
    magicalDefense: 15,
    exp: 150,
    sp: 30,
    aggroRange: 12,
    attackRange: 2.5,
    moveSpeed: 3.5,
    attackSpeed: 1800,
    respawnTime: 15,
    modelId: 'monster_spider',
    isUnique: false,
    zoneId: 'zone_jangan',
    canChampion: true,
    canGiant: false
  },
  {
    id: 'monster_bandit_lv10',
    name: 'Bandit',
    level: 10,
    hp: 280,
    mp: 50,
    attackPowerMin: 25,
    attackPowerMax: 40,
    defense: 25,
    magicalDefense: 20,
    exp: 400,
    sp: 80,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 3.0,
    attackSpeed: 2000,
    respawnTime: 20,
    modelId: 'monster_bandit',
    isUnique: false,
    zoneId: 'zone_jangan',
    canChampion: true,
    canGiant: true
  },
  {
    id: 'monster_ghost_lv15',
    name: 'Ghost',
    level: 15,
    hp: 550,
    mp: 80,
    attackPowerMin: 40,
    attackPowerMax: 65,
    defense: 40,
    magicalDefense: 35,
    exp: 1200,
    sp: 240,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 3.0,
    attackSpeed: 2200,
    respawnTime: 25,
    modelId: 'monster_ghost',
    isUnique: false,
    zoneId: 'zone_jangan',
    canChampion: true,
    canGiant: true
  },
  {
    id: 'monster_mangyang_lv20',
    name: 'Mangyang',
    level: 20,
    hp: 950,
    mp: 120,
    attackPowerMin: 60,
    attackPowerMax: 95,
    defense: 60,
    magicalDefense: 50,
    exp: 3500,
    sp: 700,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 3.0,
    attackSpeed: 2000,
    respawnTime: 30,
    modelId: 'monster_mangyang',
    isUnique: false,
    zoneId: 'zone_jangan',
    canChampion: true,
    canGiant: true
  },
];

// ============================================
// DONWHANG ZONE MONSTERS (Level 19-40)
// ============================================

export const DONWHANG_MONSTERS: GameMonster[] = [
  {
    id: 'monster_earth_ghost_lv22',
    name: 'Earth Ghost',
    level: 22,
    hp: 1200,
    mp: 150,
    attackPowerMin: 75,
    attackPowerMax: 115,
    defense: 70,
    magicalDefense: 60,
    exp: 5000,
    sp: 1000,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 3.0,
    attackSpeed: 2000,
    respawnTime: 30,
    modelId: 'monster_earth_ghost',
    isUnique: false,
    zoneId: 'zone_donwhang',
    canChampion: true,
    canGiant: true
  },
  {
    id: 'monster_water_ghost_lv25',
    name: 'Water Ghost',
    level: 25,
    hp: 1600,
    mp: 180,
    attackPowerMin: 90,
    attackPowerMax: 140,
    defense: 85,
    magicalDefense: 75,
    exp: 8000,
    sp: 1600,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 3.5,
    attackSpeed: 2200,
    respawnTime: 35,
    modelId: 'monster_water_ghost',
    isUnique: false,
    zoneId: 'zone_donwhang',
    canChampion: true,
    canGiant: true
  },
  {
    id: 'monster_giant_spider_lv28',
    name: 'Giant Spider',
    level: 28,
    hp: 2100,
    mp: 220,
    attackPowerMin: 110,
    attackPowerMax: 170,
    defense: 100,
    magicalDefense: 90,
    exp: 12000,
    sp: 2400,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 3.0,
    attackSpeed: 2000,
    respawnTime: 35,
    modelId: 'monster_giant_spider',
    isUnique: false,
    zoneId: 'zone_donwhang',
    canChampion: true,
    canGiant: true
  },
  {
    id: 'monster_scorpion_lv32',
    name: 'Scorpion',
    level: 32,
    hp: 3000,
    mp: 280,
    attackPowerMin: 140,
    attackPowerMax: 215,
    defense: 130,
    magicalDefense: 115,
    exp: 20000,
    sp: 4000,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 3.0,
    attackSpeed: 2100,
    respawnTime: 40,
    modelId: 'monster_scorpion',
    isUnique: false,
    zoneId: 'zone_donwhang',
    canChampion: true,
    canGiant: true
  },
  {
    id: 'monster_tiger_lv36',
    name: 'Tiger',
    level: 36,
    hp: 4200,
    mp: 350,
    attackPowerMin: 175,
    attackPowerMax: 270,
    defense: 165,
    magicalDefense: 145,
    exp: 32000,
    sp: 6400,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 3.5,
    attackSpeed: 1900,
    respawnTime: 45,
    modelId: 'monster_tiger',
    isUnique: false,
    zoneId: 'zone_donwhang',
    canChampion: true,
    canGiant: true
  },
  {
    id: 'monster_bandit_archer_lv40',
    name: 'Bandit Archer',
    level: 40,
    hp: 5800,
    mp: 450,
    attackPowerMin: 220,
    attackPowerMax: 340,
    defense: 210,
    magicalDefense: 185,
    exp: 50000,
    sp: 10000,
    aggroRange: 18,
    attackRange: 15,
    moveSpeed: 3.0,
    attackSpeed: 1800,
    respawnTime: 50,
    modelId: 'monster_bandit_archer',
    isUnique: false,
    zoneId: 'zone_donwhang',
    canChampion: true,
    canGiant: true
  },
];

// ============================================
// HOTAN ZONE MONSTERS (Level 40-60)
// ============================================

export const HOTAN_MONSTERS: GameMonster[] = [
  {
    id: 'monster_sand_worm_lv45',
    name: 'Sand Worm',
    level: 45,
    hp: 8000,
    mp: 600,
    attackPowerMin: 280,
    attackPowerMax: 430,
    defense: 280,
    magicalDefense: 250,
    exp: 80000,
    sp: 16000,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 3.0,
    attackSpeed: 2000,
    respawnTime: 50,
    modelId: 'monster_sand_worm',
    isUnique: false,
    zoneId: 'zone_hotan',
    canChampion: true,
    canGiant: true
  },
  {
    id: 'monster_desert_wolf_lv50',
    name: 'Desert Wolf',
    level: 50,
    hp: 11500,
    mp: 800,
    attackPowerMin: 350,
    attackPowerMax: 540,
    defense: 360,
    magicalDefense: 320,
    exp: 130000,
    sp: 26000,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 4.0,
    attackSpeed: 1800,
    respawnTime: 55,
    modelId: 'monster_desert_wolf',
    isUnique: false,
    zoneId: 'zone_hotan',
    canChampion: true,
    canGiant: true
  },
  {
    id: 'monster_ghoul_lv55',
    name: 'Ghoul',
    level: 55,
    hp: 16000,
    mp: 1000,
    attackPowerMin: 430,
    attackPowerMax: 660,
    defense: 450,
    magicalDefense: 400,
    exp: 200000,
    sp: 40000,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 3.0,
    attackSpeed: 1900,
    respawnTime: 60,
    modelId: 'monster_ghoul',
    isUnique: false,
    zoneId: 'zone_hotan',
    canChampion: true,
    canGiant: true
  },
  {
    id: 'monster_demony_lv60',
    name: 'Demony',
    level: 60,
    hp: 22000,
    mp: 1300,
    attackPowerMin: 520,
    attackPowerMax: 800,
    defense: 560,
    magicalDefense: 500,
    exp: 300000,
    sp: 60000,
    aggroRange: 15,
    attackRange: 2.5,
    moveSpeed: 3.0,
    attackSpeed: 2000,
    respawnTime: 60,
    modelId: 'monster_demony',
    isUnique: false,
    zoneId: 'zone_hotan',
    canChampion: true,
    canGiant: true
  },
];

// ============================================
// UNIQUE MONSTERS (Boss spawns with timers)
// ============================================

export const UNIQUE_MONSTERS: GameMonster[] = [
  // Low-level Uniques
  {
    id: 'unique_cerberus',
    name: 'Cerberus',
    level: 35,
    hp: 150000,
    mp: 5000,
    attackPowerMin: 400,
    attackPowerMax: 600,
    defense: 300,
    magicalDefense: 250,
    exp: 500000,
    sp: 100000,
    aggroRange: 25,
    attackRange: 3.0,
    moveSpeed: 4.0,
    attackSpeed: 1500,
    respawnTime: 14400, // 4 hours
    modelId: 'unique_cerberus',
    isUnique: true,
    zoneId: 'zone_jangan',
    canChampion: false,
    canGiant: false
  },
  {
    id: 'unique_tiger_girl',
    name: 'Tiger Girl',
    level: 40,
    hp: 200000,
    mp: 6000,
    attackPowerMin: 500,
    attackPowerMax: 750,
    defense: 400,
    magicalDefense: 350,
    exp: 800000,
    sp: 160000,
    aggroRange: 25,
    attackRange: 3.0,
    moveSpeed: 4.5,
    attackSpeed: 1400,
    respawnTime: 21600, // 6 hours
    modelId: 'unique_tiger_girl',
    isUnique: true,
    zoneId: 'zone_donwhang',
    canChampion: false,
    canGiant: false
  },
  // Mid-level Uniques
  {
    id: 'unique_captain_icu',
    name: 'Captain Icu',
    level: 70,
    hp: 800000,
    mp: 15000,
    attackPowerMin: 800,
    attackPowerMax: 1200,
    defense: 700,
    magicalDefense: 600,
    exp: 3000000,
    sp: 600000,
    aggroRange: 30,
    attackRange: 3.5,
    moveSpeed: 4.0,
    attackSpeed: 1600,
    respawnTime: 28800, // 8 hours
    modelId: 'unique_captain_icu',
    isUnique: true,
    zoneId: 'zone_hotan',
    canChampion: false,
    canGiant: false
  },
  {
    id: 'unique_isyutaru',
    name: 'Isyutaru',
    level: 80,
    hp: 1200000,
    mp: 20000,
    attackPowerMin: 1000,
    attackPowerMax: 1500,
    defense: 900,
    magicalDefense: 800,
    exp: 5000000,
    sp: 1000000,
    aggroRange: 30,
    attackRange: 4.0,
    moveSpeed: 4.0,
    attackSpeed: 1500,
    respawnTime: 36000, // 10 hours
    modelId: 'unique_isyutaru',
    isUnique: true,
    zoneId: 'zone_hotan',
    canChampion: false,
    canGiant: false
  },
  // High-level Uniques
  {
    id: 'unique_lord_yarkan',
    name: 'Lord Yarkan',
    level: 95,
    hp: 2500000,
    mp: 35000,
    attackPowerMin: 1400,
    attackPowerMax: 2100,
    defense: 1300,
    magicalDefense: 1200,
    exp: 12000000,
    sp: 2400000,
    aggroRange: 35,
    attackRange: 4.5,
    moveSpeed: 4.5,
    attackSpeed: 1400,
    respawnTime: 43200, // 12 hours
    modelId: 'unique_lord_yarkan',
    isUnique: true,
    zoneId: 'zone_hotan',
    canChampion: false,
    canGiant: false
  },
  {
    id: 'unique_shaitan',
    name: 'Shaitan',
    level: 105,
    hp: 5000000,
    mp: 50000,
    attackPowerMin: 1800,
    attackPowerMax: 2700,
    defense: 1800,
    magicalDefense: 1600,
    exp: 25000000,
    sp: 5000000,
    aggroRange: 40,
    attackRange: 5.0,
    moveSpeed: 5.0,
    attackSpeed: 1300,
    respawnTime: 86400, // 24 hours
    modelId: 'unique_shaitan',
    isUnique: true,
    zoneId: 'zone_hotan',
    canChampion: false,
    canGiant: false
  },
];

// ============================================
// ALL MONSTERS COMBINED
// ============================================

export const ALL_MONSTERS: GameMonster[] = [
  ...JANGAN_MONSTERS,
  ...DONWHANG_MONSTERS,
  ...HOTAN_MONSTERS,
  ...UNIQUE_MONSTERS,
];

// ============================================
// MONSTER DROPS
// ============================================

export const MONSTER_DROPS: MonsterDrop[] = [
  // Maiden drops
  {
    monsterId: 'monster_maiden_lv1',
    itemId: 'potion_hp_10',
    chance: 0.3,
    quantityMin: 1,
    quantityMax: 2
  },
  // Yeoha drops
  {
    monsterId: 'monster_yeoha_lv4',
    itemId: 'potion_hp_10',
    chance: 0.4,
    quantityMin: 1,
    quantityMax: 3
  },
  {
    monsterId: 'monster_yeoha_lv4',
    itemId: 'potion_mp_10',
    chance: 0.2,
    quantityMin: 1,
    quantityMax: 2
  },
  // Bandit drops
  {
    monsterId: 'monster_bandit_lv10',
    itemId: 'weapon_blade_1d',
    chance: 0.01,
    quantityMin: 1,
    quantityMax: 1
  },
  {
    monsterId: 'monster_bandit_lv10',
    itemId: 'potion_hp_50',
    chance: 0.5,
    quantityMin: 1,
    quantityMax: 3
  },
  // Unique monster drops (better rates)
  {
    monsterId: 'unique_tiger_girl',
    itemId: 'weapon_sword_5d',
    chance: 0.1,
    quantityMin: 1,
    quantityMax: 1
  },
  {
    monsterId: 'unique_tiger_girl',
    itemId: 'ring_5d',
    chance: 0.2,
    quantityMin: 1,
    quantityMax: 1
  },
  {
    monsterId: 'unique_tiger_girl',
    itemId: 'elixir_weapon',
    chance: 0.5,
    quantityMin: 1,
    quantityMax: 3
  },
  // Shaitan drops
  {
    monsterId: 'unique_shaitan',
    itemId: 'weapon_blade_13d',
    chance: 0.05,
    quantityMin: 1,
    quantityMax: 1
  },
  {
    monsterId: 'unique_shaitan',
    itemId: 'ring_9d',
    chance: 0.3,
    quantityMin: 1,
    quantityMax: 1
  },
  {
    monsterId: 'unique_shaitan',
    itemId: 'lucky_powder_a',
    chance: 1.0,
    quantityMin: 10,
    quantityMax: 20
  },
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getMonstersByZone(zoneId: string): GameMonster[] {
  return ALL_MONSTERS.filter(monster => monster.zoneId === zoneId);
}

export function getMonstersByLevel(minLevel: number, maxLevel: number): GameMonster[] {
  return ALL_MONSTERS.filter(monster =>
    monster.level >= minLevel && monster.level <= maxLevel
  );
}

export function getUniqueMonsters(): GameMonster[] {
  return ALL_MONSTERS.filter(monster => monster.isUnique);
}

export function getMonsterById(id: string): GameMonster | undefined {
  return ALL_MONSTERS.find(monster => monster.id === id);
}

export function getDropsForMonster(monsterId: string): MonsterDrop[] {
  return MONSTER_DROPS.filter(drop => drop.monsterId === monsterId);
}
