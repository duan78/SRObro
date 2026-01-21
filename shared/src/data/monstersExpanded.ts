// ============================================
// SRObro - Complete Monsters Data Generator
// Generates 500+ monsters with champion/giant variants
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
  isChampion: boolean;
  isGiant: boolean;
}

export interface MonsterDrop {
  monsterId: string;
  itemId: string;
  chance: number; // 0-1
  quantityMin: number;
  quantityMax: number;
}

// ============================================
// MONSTER GENERATION CONFIGURATIONS
// ============================================

interface ZoneConfig {
  id: string;
  name: string;
  levelRange: [number, number];
  zones: string[];
}

interface MonsterTemplate {
  name: string;
  baseHp: number;
  baseAttack: number;
  baseDefense: number;
  baseExp: number;
  aggro: boolean;
}

const ZONES: ZoneConfig[] = [
  { id: 'jangan', name: 'Jangan', levelRange: [1, 20], zones: ['zone_jangan', 'zone_jangan_field', 'zone_jangan_west'] },
  { id: 'donwhang', name: 'Donwhang', levelRange: [19, 40], zones: ['zone_donwhang', 'zone_donwhang_field', 'zone_donwhang_east'] },
  { id: 'hotan', name: 'Hotan', levelRange: [40, 60], zones: ['zone_hotan', 'zone_hotan_field', 'zone_hotan_desert'] },
  { id: 'tomb', name: 'Tomb', levelRange: [60, 80], zones: ['zone_tomb', 'zone_tomb1', 'zone_tomb2'] },
  { id: 'job_cave', name: 'Job Cave', levelRange: [30, 50], zones: ['zone_jobcave', 'zone_jobcave1', 'zone_jobcave2'] },
  { id: 'temple', name: 'Temple', levelRange: [70, 90], zones: ['zone_temple', 'zone_temple_ruins'] },
  { id: 'fortress', name: 'Fortress', levelRange: [80, 100], zones: ['zone_fortress', 'zone_fortress_jangan', 'zone_fortress_hotan'] },
  { id: 'alexander', name: 'Alexander', levelRange: [90, 110], zones: ['zone_alexander', 'zone_alexander_north'] },
];

const MONSTER_TEMPLATES: Record<string, MonsterTemplate> = {
  // Jangan monsters
  maiden: { name: 'Maiden', baseHp: 30, baseAttack: 3, baseDefense: 2, baseExp: 10, aggro: false },
  yeoha: { name: 'Yeoha', baseHp: 80, baseAttack: 11, baseDefense: 8, baseExp: 50, aggro: false },
  spider: { name: 'Spider', baseHp: 150, baseAttack: 20, baseDefense: 15, baseExp: 150, aggro: true },
  bandit: { name: 'Bandit', baseHp: 280, baseAttack: 32, baseDefense: 25, baseExp: 400, aggro: true },
  ghost: { name: 'Ghost', baseHp: 550, baseAttack: 52, baseDefense: 40, baseExp: 1200, aggro: false },
  mangyang: { name: 'Mangyang', baseHp: 950, baseAttack: 77, baseDefense: 60, baseExp: 3500, aggro: true },

  // Donwhang monsters
  earthGhost: { name: 'Earth Ghost', baseHp: 1200, baseAttack: 95, baseDefense: 70, baseExp: 5000, aggro: true },
  waterGhost: { name: 'Water Ghost', baseHp: 1600, baseAttack: 115, baseDefense: 85, baseExp: 8000, aggro: true },
  giantSpider: { name: 'Giant Spider', baseHp: 2100, baseAttack: 140, baseDefense: 100, baseExp: 12000, aggro: true },
  scorpion: { name: 'Scorpion', baseHp: 3000, baseAttack: 177, baseDefense: 130, baseExp: 20000, aggro: true },
  tiger: { name: 'Tiger', baseHp: 4200, baseAttack: 222, baseDefense: 165, baseExp: 32000, aggro: true },
  banditArcher: { name: 'Bandit Archer', baseHp: 5800, baseAttack: 280, baseDefense: 210, baseExp: 50000, aggro: true },

  // Hotan monsters
  sandWorm: { name: 'Sand Worm', baseHp: 8000, baseAttack: 355, baseDefense: 280, baseExp: 80000, aggro: false },
  desertWolf: { name: 'Desert Wolf', baseHp: 11500, baseAttack: 445, baseDefense: 360, baseExp: 130000, aggro: true },
  ghoul: { name: 'Ghoul', baseHp: 16000, baseAttack: 545, baseDefense: 450, baseExp: 200000, aggro: true },
  demony: { name: 'Demony', baseHp: 22000, baseAttack: 660, baseDefense: 560, baseExp: 300000, aggro: true },
  desertGhost: { name: 'Desert Ghost', baseHp: 25000, baseAttack: 700, baseDefense: 600, baseExp: 350000, aggro: false },
  mummy: { name: 'Mummy', baseHp: 30000, baseAttack: 800, baseDefense: 700, baseExp: 400000, aggro: true },

  // Tomb monsters
  tombKeeper: { name: 'Tomb Keeper', baseHp: 35000, baseAttack: 900, baseDefense: 800, baseExp: 450000, aggro: true },
  deadGeneral: { name: 'Dead General', baseHp: 40000, baseAttack: 1000, baseDefense: 900, baseExp: 500000, aggro: true },
  cursedKnight: { name: 'Cursed Knight', baseHp: 45000, baseAttack: 1100, baseDefense: 1000, baseExp: 550000, aggro: true },
  lich: { name: 'Lich', baseHp: 50000, baseAttack: 1200, baseDefense: 1100, baseExp: 600000, aggro: false },

  // Job Cave monsters
  jobThief: { name: 'Robber Thief', baseHp: 5000, baseAttack: 250, baseDefense: 200, baseExp: 40000, aggro: false },
  jobTrader: { name: 'Escort', baseHp: 6000, baseAttack: 280, baseDefense: 250, baseExp: 45000, aggro: false },
  jobHunter: { name: 'Hunter Guard', baseHp: 7000, baseAttack: 320, baseDefense: 280, baseExp: 50000, aggro: false },

  // Temple monsters
  templeGuardian: { name: 'Temple Guardian', baseHp: 55000, baseAttack: 1300, baseDefense: 1200, baseExp: 650000, aggro: true },
  darkMonk: { name: 'Dark Monk', baseHp: 60000, baseAttack: 1400, baseDefense: 1300, baseExp: 700000, aggro: true },
  highPriest: { name: 'High Priest', baseHp: 65000, baseAttack: 1500, baseDefense: 1400, baseExp: 750000, aggro: false },

  // Fortress monsters
  fortressGuard: { name: 'Fortress Guard', baseHp: 70000, baseAttack: 1600, baseDefense: 1500, baseExp: 800000, aggro: false },
  siegeGolem: { name: 'Siege Golem', baseHp: 100000, baseAttack: 2000, baseDefense: 2000, baseExp: 1000000, aggro: true },

  // Alexander monsters
  ronin: { name: 'Ronin', baseHp: 80000, baseAttack: 1800, baseDefense: 1700, baseExp: 900000, aggro: true },
  ninja: { name: 'Ninja', baseHp: 85000, baseAttack: 1900, baseDefense: 1800, baseExp: 950000, aggro: true },
  samurai: { name: 'Samurai', baseHp: 90000, baseAttack: 2000, baseDefense: 1900, baseExp: 1000000, aggro: true },
};

// ============================================
// GENERATE MONSTERS
// ============================================

export function generateAllMonsters(): GameMonster[] {
  const monsters: GameMonster[] = [];

  // Generate regular monsters with level variations
  Object.entries(MONSTER_TEMPLATES).forEach(([key, template]) => {
    for (let level = 1; level <= 110; level += 5) {
      const zone = getZoneForLevel(level);
      if (!zone) continue;

      const monster = createMonster(key, template, level, zone, false, false);
      monsters.push(monster);

      // Add champion variant (3x HP, 2x damage, 5x exp)
      if (template.aggro) {
        const champion = createMonster(key, template, level, zone, true, false);
        monsters.push(champion);
      }

      // Add giant variant (5x HP, 3x damage, 10x exp)
      if (template.aggro) {
        const giant = createMonster(key, template, level, zone, false, true);
        monsters.push(giant);
      }
    }
  });

  // Add unique monsters
  const uniques = generateUniqueMonsters();
  monsters.push(...uniques);

  console.log(`[Monsters] Generated ${monsters.length} monsters`);

  return monsters;
}

function createMonster(
  key: string,
  template: MonsterTemplate,
  level: number,
  zone: string,
  isChampion: boolean,
  isGiant: boolean
): GameMonster {
  const levelMultiplier = level / 10;
  const championMultiplier = isChampion ? { hp: 3, atk: 2, exp: 5, def: 1.5 } : null;
  const giantMultiplier = isGiant ? { hp: 5, atk: 3, exp: 10, def: 2 } : null;

  const mult = championMultiplier || giantMultiplier || { hp: 1, atk: 1, exp: 1, def: 1 };

  const hp = Math.floor(template.baseHp * levelMultiplier * mult.hp);
  const attackMin = Math.floor(template.baseAttack * levelMultiplier * mult.atk);
  const attackMax = Math.floor(attackMin * 1.2);
  const defense = Math.floor(template.baseDefense * levelMultiplier * mult.def);
  const exp = Math.floor(template.baseExp * levelMultiplier * mult.exp);

  const suffix = isChampion ? ' (Champion)' : isGiant ? ' (Giant)' : '';

  return {
    id: `monster_${key}_lv${level}${isChampion ? '_c' : ''}${isGiant ? '_g' : ''}`,
    name: `${template.name} Lv${level}${suffix}`,
    level,
    hp,
    mp: Math.floor(level * 10),
    attackPowerMin: attackMin,
    attackPowerMax: attackMax,
    defense,
    magicalDefense: Math.floor(defense * 0.8),
    exp,
    sp: Math.floor(exp * 0.3),
    aggroRange: template.aggro ? 15 : 5,
    attackRange: 2.5,
    moveSpeed: 3.0 + (level * 0.01),
    attackSpeed: Math.max(1000, 2000 - level * 10),
    respawnTime: 30 + (level * 0.5),
    modelId: `monster_${key}`,
    isUnique: false,
    zoneId: zone,
    canChampion: template.aggro && !isChampion && !isGiant,
    canGiant: template.aggro && !isChampion && !isGiant,
    isChampion,
    isGiant,
  };
}

function getZoneForLevel(level: number): string | null {
  for (const zone of ZONES) {
    if (level >= zone.levelRange[0] && level <= zone.levelRange[1]) {
      return zone.zones[0];
    }
  }
  return null;
}

// ============================================
// UNIQUE MONSTERS (Boss spawns)
// ============================================

function generateUniqueMonsters(): GameMonster[] {
  return [
    // Low-level uniques (Jangan area)
    {
      id: 'unique_cerberus',
      name: 'Cerberus [Unique]',
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
      attackRange: 4.0,
      moveSpeed: 4.5,
      attackSpeed: 1500,
      respawnTime: 14400, // 4 hours
      modelId: 'unique_cerberus',
      isUnique: true,
      zoneId: 'zone_jangan',
      canChampion: false,
      canGiant: false,
      isChampion: false,
      isGiant: false,
    },
    {
      id: 'unique_tiger_girl',
      name: 'Tiger Girl [Unique]',
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
      attackRange: 4.0,
      moveSpeed: 5.0,
      attackSpeed: 1400,
      respawnTime: 21600, // 6 hours
      modelId: 'unique_tiger_girl',
      isUnique: true,
      zoneId: 'zone_donwhang',
      canChampion: false,
      canGiant: false,
      isChampion: false,
      isGiant: false,
    },

    // Mid-level uniques (Donwhang/Hotan area)
    {
      id: 'unique_captain_ivy',
      name: 'Captain Ivy [Unique]',
      level: 60,
      hp: 400000,
      mp: 10000,
      attackPowerMin: 650,
      attackPowerMax: 950,
      defense: 550,
      magicalDefense: 450,
      exp: 1500000,
      sp: 300000,
      aggroRange: 30,
      attackRange: 5.0,
      moveSpeed: 5.0,
      attackSpeed: 1600,
      respawnTime: 28800, // 8 hours
      modelId: 'unique_captain_ivy',
      isUnique: true,
      zoneId: 'zone_donwhang',
      canChampion: false,
      canGiant: false,
      isChampion: false,
      isGiant: false,
    },
    {
      id: 'unique_isyutaru',
      name: 'Isyutaru [Unique]',
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
      attackRange: 5.0,
      moveSpeed: 5.0,
      attackSpeed: 1500,
      respawnTime: 36000, // 10 hours
      modelId: 'unique_isyutaru',
      isUnique: true,
      zoneId: 'zone_hotan',
      canChampion: false,
      canGiant: false,
      isChampion: false,
      isGiant: false,
    },

    // High-level uniques (Hotan/Tomb area)
    {
      id: 'unique_lord_yarkan',
      name: 'Lord Yarkan [Unique]',
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
      attackRange: 6.0,
      moveSpeed: 5.5,
      attackSpeed: 1400,
      respawnTime: 43200, // 12 hours
      modelId: 'unique_lord_yarkan',
      isUnique: true,
      zoneId: 'zone_tomb',
      canChampion: false,
      canGiant: false,
      isChampion: false,
      isGiant: false,
    },
    {
      id: 'unique_demon_shaitan',
      name: 'Shaitan [Unique]',
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
      attackRange: 7.0,
      moveSpeed: 6.0,
      attackSpeed: 1300,
      respawnTime: 86400, // 24 hours
      modelId: 'unique_shaitan',
      isUnique: true,
      zoneId: 'zone_tomb',
      canChampion: false,
      canGiant: false,
      isChampion: false,
      isGiant: false,
    },

    // Special event uniques
    {
      id: 'unique_dracula',
      name: 'Dracula [Event Unique]',
      level: 110,
      hp: 8000000,
      mp: 80000,
      attackPowerMin: 2500,
      attackPowerMax: 3500,
      defense: 2500,
      magicalDefense: 2200,
      exp: 50000000,
      sp: 10000000,
      aggroRange: 50,
      attackRange: 8.0,
      moveSpeed: 7.0,
      attackSpeed: 1200,
      respawnTime: 604800, // 1 week
      modelId: 'unique_dracula',
      isUnique: true,
      zoneId: 'zone_event',
      canChampion: false,
      canGiant: false,
      isChampion: false,
      isGiant: false,
    },
    {
      id: 'unique_medusa',
      name: 'Medusa [Event Unique]',
      level: 100,
      hp: 6000000,
      mp: 60000,
      attackPowerMin: 2000,
      attackPowerMax: 3000,
      defense: 2000,
      magicalDefense: 2500,
      exp: 35000000,
      sp: 7000000,
      aggroRange: 45,
      attackRange: 10.0,
      moveSpeed: 5.0,
      attackSpeed: 1500,
      respawnTime: 432000, // 5 days
      modelId: 'unique_medusa',
      isUnique: true,
      zoneId: 'zone_event',
      canChampion: false,
      canGiant: false,
      isChampion: false,
      isGiant: false,
    },
    {
      id: 'unique_unicorn',
      name: 'Unicorn [Event Unique]',
      level: 90,
      hp: 4000000,
      mp: 50000,
      attackPowerMin: 1500,
      attackPowerMax: 2200,
      defense: 1500,
      magicalDefense: 3000,
      exp: 25000000,
      sp: 5000000,
      aggroRange: 30,
      attackRange: 15.0,
      moveSpeed: 10.0,
      attackSpeed: 1000,
      respawnTime: 259200, // 3 days
      modelId: 'unique_unicorn',
      isUnique: true,
      zoneId: 'zone_event',
      canChampion: false,
      canGiant: false,
      isChampion: false,
      isGiant: false,
    },
  ];
}

// ============================================
// MONSTER DROPS
// ============================================

export function generateMonsterDrops(): MonsterDrop[] {
  const drops: MonsterDrop[] = [];

  // Basic drops for low-level monsters
  const commonDrops = [
    { monsterId: 'monster_maiden_lv1', itemId: 'potion_hp_10', chance: 0.3, quantityMin: 1, quantityMax: 2 },
    { monsterId: 'monster_yeoha_lv4', itemId: 'potion_hp_10', chance: 0.4, quantityMin: 1, quantityMax: 3 },
    { monsterId: 'monster_spider_lv7', itemId: 'potion_mp_10', chance: 0.2, quantityMin: 1, quantityMax: 2 },
    { monsterId: 'monster_bandit_lv10', itemId: 'weapon_blade_1d', chance: 0.01, quantityMin: 1, quantityMax: 1 },
    { monsterId: 'monster_bandit_lv10', itemId: 'elixir_weapon', chance: 0.001, quantityMin: 1, quantityMax: 1 },
  ];

  drops.push(...commonDrops);

  // Unique monster drops (better rates)
  const uniqueDrops = [
    // Tiger Girl drops
    { monsterId: 'unique_tiger_girl', itemId: 'weapon_sword_5d', chance: 0.1, quantityMin: 1, quantityMax: 1 },
    { monsterId: 'unique_tiger_girl', itemId: 'ring_5d', chance: 0.2, quantityMin: 1, quantityMax: 1 },
    { monsterId: 'unique_tiger_girl', itemId: 'elixir_weapon', chance: 0.5, quantityMin: 1, quantityMax: 3 },
    { monsterId: 'unique_tiger_girl', itemId: 'lucky_powder_a', chance: 1.0, quantityMin: 5, quantityMax: 10 },

    // Shaitan drops (best items)
    { monsterId: 'unique_shaitan', itemId: 'weapon_blade_13d', chance: 0.05, quantityMin: 1, quantityMax: 1 },
    { monsterId: 'unique_shaitan', itemId: 'ring_13d', chance: 0.3, quantityMin: 1, quantityMax: 1 },
    { monsterId: 'unique_shaitan', itemId: 'necklace_13d_2', chance: 0.2, quantityMin: 1, quantityMax: 1 },
    { monsterId: 'unique_shaitan', itemId: 'lucky_powder_a', chance: 1.0, quantityMin: 20, quantityMax: 50 },

    // Event unique drops
    { monsterId: 'unique_dracula', itemId: 'weapon_blade_13d', chance: 0.5, quantityMin: 1, quantityMax: 1 },
    { monsterId: 'unique_dracula', itemId: 'earring_13d_2', chance: 0.5, quantityMin: 1, quantityMax: 1 },
    { monsterId: 'unique_dracula', itemId: 'vigor_potion_5', chance: 1.0, quantityMin: 3, quantityMax: 5 },
  ];

  drops.push(...uniqueDrops);

  return drops;
}

// Helper functions
export function getMonstersByZone(zoneId: string): GameMonster[] {
  const allMonsters = generateAllMonsters();
  return allMonsters.filter(monster => monster.zoneId === zoneId);
}

export function getMonstersByLevel(minLevel: number, maxLevel: number): GameMonster[] {
  const allMonsters = generateAllMonsters();
  return allMonsters.filter(monster => monster.level >= minLevel && monster.level <= maxLevel);
}

export function getUniqueMonsters(): GameMonster[] {
  const allMonsters = generateAllMonsters();
  return allMonsters.filter(monster => monster.isUnique);
}

export function getMonsterById(id: string): GameMonster | undefined {
  const allMonsters = generateAllMonsters();
  return allMonsters.find(monster => monster.id === id);
}

export function getDropsForMonster(monsterId: string): MonsterDrop[] {
  const allDrops = generateMonsterDrops();
  return allDrops.filter(drop => drop.monsterId === monsterId);
}

// Export all monsters
export const ALL_MONSTERS = generateAllMonsters();
export const ALL_MONSTER_DROPS = generateMonsterDrops();
