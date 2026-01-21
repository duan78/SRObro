// ============================================
// SRObro - Game Items Data
// Comprehensive item database for Silkroad Online
// ============================================

export interface GameItem {
  id: string;
  name: string;
  type: ItemType;
  subType?: string;
  rarity: ItemRarity;
  requiredLevel: number;
  requiredStr?: number;
  requiredInt?: number;
  bonusStr?: number;
  bonusInt?: number;
  attackPowerMin?: number;
  attackPowerMax?: number;
  magicalAttackMin?: number;
  magicalAttackMax?: number;
  defense?: number;
  magicalDefense?: number;
  durability?: number;
  maxDurability?: number;
  price: number;
  stackable: boolean;
  maxStack?: number;
  iconId?: string;
  modelId?: string;
  degree: number; // 1D to 13D
  gender?: 'male' | 'female' | 'both';
  race?: 'chinese' | 'european' | 'both';
}

export type ItemType =
  | 'weapon'
  | 'shield'
  | 'helmet'
  | 'chest'
  | 'shoulder'
  | 'legs'
  | 'boots'
  | 'ring'
  | 'necklace'
  | 'earring'
  | 'potion'
  | 'skill'
  | 'material'
  | 'quest'
  | 'amm'
  | 'arrow'
  | 'bolt'
  | 'general';

export type ItemRarity = 'common' | 'rare' | 'legendary' | 'unique';

// ============================================
// WEAPONS - CHINESE
// ============================================

export const CHINESE_WEAPONS: GameItem[] = [
  // 1D Weapons (Level 1-9)
  {
    id: 'weapon_blade_1d',
    name: 'Training Blade',
    type: 'weapon',
    subType: 'blade',
    rarity: 'common',
    requiredLevel: 1,
    attackPowerMin: 5,
    attackPowerMax: 10,
    durability: 20,
    maxDurability: 20,
    price: 100,
    stackable: false,
    degree: 1,
    race: 'chinese'
  },
  {
    id: 'weapon_sword_1d',
    name: 'Training Sword',
    type: 'weapon',
    subType: 'sword',
    rarity: 'common',
    requiredLevel: 1,
    attackPowerMin: 4,
    attackPowerMax: 9,
    durability: 20,
    maxDurability: 20,
    price: 100,
    stackable: false,
    degree: 1,
    race: 'chinese'
  },
  {
    id: 'weapon_spear_1d',
    name: 'Training Spear',
    type: 'weapon',
    subType: 'spear',
    rarity: 'common',
    requiredLevel: 1,
    attackPowerMin: 6,
    attackPowerMax: 12,
    durability: 25,
    maxDurability: 25,
    price: 150,
    stackable: false,
    degree: 1,
    race: 'chinese'
  },
  {
    id: 'weapon_bow_1d',
    name: 'Training Bow',
    type: 'weapon',
    subType: 'bow',
    rarity: 'common',
    requiredLevel: 1,
    attackPowerMin: 3,
    attackPowerMax: 8,
    durability: 30,
    maxDurability: 30,
    price: 120,
    stackable: false,
    degree: 1,
    race: 'chinese'
  },

  // 5D Weapons (Level 40-48)
  {
    id: 'weapon_blade_5d',
    name: 'Steel Blade',
    type: 'weapon',
    subType: 'blade',
    rarity: 'common',
    requiredLevel: 40,
    attackPowerMin: 85,
    attackPowerMax: 120,
    durability: 35,
    maxDurability: 35,
    price: 50000,
    stackable: false,
    degree: 5,
    race: 'chinese'
  },
  {
    id: 'weapon_sword_5d',
    name: 'Steel Sword',
    type: 'weapon',
    subType: 'sword',
    rarity: 'common',
    requiredLevel: 40,
    attackPowerMin: 80,
    attackPowerMax: 115,
    durability: 35,
    maxDurability: 35,
    price: 50000,
    stackable: false,
    degree: 5,
    race: 'chinese'
  },
  {
    id: 'weapon_spear_5d',
    name: 'Fine Spear',
    type: 'weapon',
    subType: 'spear',
    rarity: 'common',
    requiredLevel: 40,
    attackPowerMin: 95,
    attackPowerMax: 135,
    durability: 40,
    maxDurability: 40,
    price: 60000,
    stackable: false,
    degree: 5,
    race: 'chinese'
  },
  {
    id: 'weapon_bow_5d',
    name: 'Composite Bow',
    type: 'weapon',
    subType: 'bow',
    rarity: 'common',
    requiredLevel: 40,
    attackPowerMin: 75,
    attackPowerMax: 110,
    durability: 45,
    maxDurability: 45,
    price: 55000,
    stackable: false,
    degree: 5,
    race: 'chinese'
  },

  // 9D Weapons (Level 64-71)
  {
    id: 'weapon_blade_9d',
    name: 'SOS Blade',
    type: 'weapon',
    subType: 'blade',
    rarity: 'rare',
    requiredLevel: 64,
    attackPowerMin: 145,
    attackPowerMax: 195,
    durability: 40,
    maxDurability: 40,
    price: 500000,
    stackable: false,
    degree: 9,
    race: 'chinese'
  },
  {
    id: 'weapon_sword_9d',
    name: 'SOS Sword',
    type: 'weapon',
    subType: 'sword',
    rarity: 'rare',
    requiredLevel: 64,
    attackPowerMin: 140,
    attackPowerMax: 190,
    durability: 40,
    maxDurability: 40,
    price: 500000,
    stackable: false,
    degree: 9,
    race: 'chinese'
  },
  {
    id: 'weapon_spear_9d',
    name: 'SOS Spear',
    type: 'weapon',
    subType: 'spear',
    rarity: 'rare',
    requiredLevel: 64,
    attackPowerMin: 160,
    attackPowerMax: 215,
    durability: 45,
    maxDurability: 45,
    price: 600000,
    stackable: false,
    degree: 9,
    race: 'chinese'
  },
  {
    id: 'weapon_bow_9d',
    name: 'SOS Bow',
    type: 'weapon',
    subType: 'bow',
    rarity: 'rare',
    requiredLevel: 64,
    attackPowerMin: 130,
    attackPowerMax: 180,
    durability: 50,
    maxDurability: 50,
    price: 550000,
    stackable: false,
    degree: 9,
    race: 'chinese'
  },
  {
    id: 'weapon_blade_9d_sosun',
    name: 'SOSUN Blade',
    type: 'weapon',
    subType: 'blade',
    rarity: 'legendary',
    requiredLevel: 68,
    attackPowerMin: 165,
    attackPowerMax: 220,
    durability: 40,
    maxDurability: 40,
    price: 2000000,
    stackable: false,
    degree: 9,
    race: 'chinese'
  },
  {
    id: 'weapon_spear_9d_sosun',
    name: 'SOSUN Spear',
    type: 'weapon',
    subType: 'spear',
    rarity: 'legendary',
    requiredLevel: 68,
    attackPowerMin: 180,
    attackPowerMax: 240,
    durability: 45,
    maxDurability: 45,
    price: 2500000,
    stackable: false,
    degree: 9,
    race: 'chinese'
  },

  // 11D Weapons (Level 90-98)
  {
    id: 'weapon_blade_11d',
    name: 'Moon Blade',
    type: 'weapon',
    subType: 'blade',
    rarity: 'rare',
    requiredLevel: 90,
    attackPowerMin: 210,
    attackPowerMax: 280,
    durability: 45,
    maxDurability: 45,
    price: 5000000,
    stackable: false,
    degree: 11,
    race: 'chinese'
  },
  {
    id: 'weapon_sword_11d',
    name: 'Moon Sword',
    type: 'weapon',
    subType: 'sword',
    rarity: 'rare',
    requiredLevel: 90,
    attackPowerMin: 205,
    attackPowerMax: 275,
    durability: 45,
    maxDurability: 45,
    price: 5000000,
    stackable: false,
    degree: 11,
    race: 'chinese'
  },
  {
    id: 'weapon_spear_11d',
    name: 'Moon Spear',
    type: 'weapon',
    subType: 'spear',
    rarity: 'rare',
    requiredLevel: 90,
    attackPowerMin: 230,
    attackPowerMax: 305,
    durability: 50,
    maxDurability: 50,
    price: 6000000,
    stackable: false,
    degree: 11,
    race: 'chinese'
  },
  {
    id: 'weapon_bow_11d',
    name: 'Moon Bow',
    type: 'weapon',
    subType: 'bow',
    rarity: 'rare',
    requiredLevel: 90,
    attackPowerMin: 190,
    attackPowerMax: 260,
    durability: 55,
    maxDurability: 55,
    price: 5500000,
    stackable: false,
    degree: 11,
    race: 'chinese'
  },

  // 13D Weapons (Level 100-110)
  {
    id: 'weapon_blade_13d',
    name: 'Legendary Blade',
    type: 'weapon',
    subType: 'blade',
    rarity: 'legendary',
    requiredLevel: 100,
    attackPowerMin: 280,
    attackPowerMax: 370,
    durability: 50,
    maxDurability: 50,
    price: 50000000,
    stackable: false,
    degree: 13,
    race: 'chinese'
  },
  {
    id: 'weapon_sword_13d',
    name: 'Legendary Sword',
    type: 'weapon',
    subType: 'sword',
    rarity: 'legendary',
    requiredLevel: 100,
    attackPowerMin: 275,
    attackPowerMax: 365,
    durability: 50,
    maxDurability: 50,
    price: 50000000,
    stackable: false,
    degree: 13,
    race: 'chinese'
  },
  {
    id: 'weapon_spear_13d',
    name: 'Legendary Spear',
    type: 'weapon',
    subType: 'spear',
    rarity: 'legendary',
    requiredLevel: 100,
    attackPowerMin: 305,
    attackPowerMax: 405,
    durability: 55,
    maxDurability: 55,
    price: 60000000,
    stackable: false,
    degree: 13,
    race: 'chinese'
  },
  {
    id: 'weapon_bow_13d',
    name: 'Legendary Bow',
    type: 'weapon',
    subType: 'bow',
    rarity: 'legendary',
    requiredLevel: 100,
    attackPowerMin: 255,
    attackPowerMax: 345,
    durability: 60,
    maxDurability: 60,
    price: 55000000,
    stackable: false,
    degree: 13,
    race: 'chinese'
  },
];

// ============================================
// ARMOR - CHINESE
// ============================================

export const CHINESE_ARMOR: GameItem[] = [
  // Protector (Physical Defense)
  {
    id: 'chest_protector_1d_male',
    name: 'Training Protector',
    type: 'chest',
    subType: 'protector',
    rarity: 'common',
    requiredLevel: 1,
    defense: 5,
    durability: 30,
    maxDurability: 30,
    price: 200,
    stackable: false,
    degree: 1,
    gender: 'male',
    race: 'chinese'
  },
  {
    id: 'chest_protector_5d_male',
    name: 'Steel Protector',
    type: 'chest',
    subType: 'protector',
    rarity: 'common',
    requiredLevel: 40,
    defense: 85,
    durability: 45,
    maxDurability: 45,
    price: 80000,
    stackable: false,
    degree: 5,
    gender: 'male',
    race: 'chinese'
  },
  {
    id: 'chest_protector_9d_male',
    name: 'SOS Protector',
    type: 'chest',
    subType: 'protector',
    rarity: 'rare',
    requiredLevel: 64,
    defense: 145,
    durability: 50,
    maxDurability: 50,
    price: 800000,
    stackable: false,
    degree: 9,
    gender: 'male',
    race: 'chinese'
  },
  {
    id: 'chest_protector_11d_male',
    name: 'Moon Protector',
    type: 'chest',
    subType: 'protector',
    rarity: 'rare',
    requiredLevel: 90,
    defense: 210,
    durability: 55,
    maxDurability: 55,
    price: 8000000,
    stackable: false,
    degree: 11,
    gender: 'male',
    race: 'chinese'
  },

  // Garment (MP Efficiency)
  {
    id: 'chest_garment_1d_male',
    name: 'Training Garment',
    type: 'chest',
    subType: 'garment',
    rarity: 'common',
    requiredLevel: 1,
    defense: 2,
    magicalDefense: 5,
    durability: 30,
    maxDurability: 30,
    price: 200,
    stackable: false,
    degree: 1,
    gender: 'male',
    race: 'chinese'
  },
  {
    id: 'chest_garment_5d_male',
    name: 'Steel Garment',
    type: 'chest',
    subType: 'garment',
    rarity: 'common',
    requiredLevel: 40,
    defense: 35,
    magicalDefense: 75,
    durability: 45,
    maxDurability: 45,
    price: 80000,
    stackable: false,
    degree: 5,
    gender: 'male',
    race: 'chinese'
  },

  // Armor (Balanced)
  {
    id: 'chest_armor_1d_male',
    name: 'Training Armor',
    type: 'chest',
    subType: 'armor',
    rarity: 'common',
    requiredLevel: 1,
    defense: 4,
    magicalDefense: 2,
    durability: 30,
    maxDurability: 30,
    price: 200,
    stackable: false,
    degree: 1,
    gender: 'male',
    race: 'chinese'
  },
  {
    id: 'chest_armor_5d_male',
    name: 'Steel Armor',
    type: 'chest',
    subType: 'armor',
    rarity: 'common',
    requiredLevel: 40,
    defense: 70,
    magicalDefense: 30,
    durability: 45,
    maxDurability: 45,
    price: 80000,
    stackable: false,
    degree: 5,
    gender: 'male',
    race: 'chinese'
  },
];

// ============================================
// ACCESSORIES
// ============================================

export const ACCESSORIES: GameItem[] = [
  // Rings
  {
    id: 'ring_1d',
    name: 'Copper Ring',
    type: 'ring',
    rarity: 'common',
    requiredLevel: 1,
    bonusStr: 1,
    price: 500,
    stackable: false,
    degree: 1
  },
  {
    id: 'ring_5d',
    name: 'Steel Ring',
    type: 'ring',
    rarity: 'common',
    requiredLevel: 40,
    bonusStr: 3,
    bonusInt: 2,
    price: 50000,
    stackable: false,
    degree: 5
  },
  {
    id: 'ring_9d',
    name: 'SOS Ring',
    type: 'ring',
    rarity: 'rare',
    requiredLevel: 64,
    bonusStr: 6,
    bonusInt: 4,
    price: 600000,
    stackable: false,
    degree: 9
  },

  // Necklaces
  {
    id: 'necklace_1d',
    name: 'Copper Necklace',
    type: 'necklace',
    rarity: 'common',
    requiredLevel: 1,
    bonusInt: 1,
    price: 800,
    stackable: false,
    degree: 1
  },
  {
    id: 'necklace_5d',
    name: 'Steel Necklace',
    type: 'necklace',
    rarity: 'common',
    requiredLevel: 40,
    bonusInt: 4,
    price: 80000,
    stackable: false,
    degree: 5
  },

  // Earrings
  {
    id: 'earring_1d',
    name: 'Copper Earring',
    type: 'earring',
    rarity: 'common',
    requiredLevel: 1,
    magicalDefense: 2,
    price: 600,
    stackable: false,
    degree: 1
  },
  {
    id: 'earring_5d',
    name: 'Steel Earring',
    type: 'earring',
    rarity: 'common',
    requiredLevel: 40,
    magicalDefense: 15,
    price: 70000,
    stackable: false,
    degree: 5
  },
];

// ============================================
// CONSUMABLES
// ============================================

export const CONSUMABLES: GameItem[] = [
  // HP Potions
  {
    id: 'potion_hp_10',
    name: 'HP Potion (Lv10)',
    type: 'potion',
    rarity: 'common',
    requiredLevel: 1,
    price: 50,
    stackable: true,
    maxStack: 5000,
    degree: 1
  },
  {
    id: 'potion_hp_50',
    name: 'HP Potion (Lv50)',
    type: 'potion',
    rarity: 'common',
    requiredLevel: 1,
    price: 200,
    stackable: true,
    maxStack: 5000,
    degree: 5
  },
  {
    id: 'potion_hp_80',
    name: 'HP Potion (Lv80)',
    type: 'potion',
    rarity: 'common',
    requiredLevel: 1,
    price: 800,
    stackable: true,
    maxStack: 5000,
    degree: 9
  },

  // MP Potions
  {
    id: 'potion_mp_10',
    name: 'MP Potion (Lv10)',
    type: 'potion',
    rarity: 'common',
    requiredLevel: 1,
    price: 50,
    stackable: true,
    maxStack: 5000,
    degree: 1
  },
  {
    id: 'potion_mp_50',
    name: 'MP Potion (Lv50)',
    type: 'potion',
    rarity: 'common',
    requiredLevel: 1,
    price: 200,
    stackable: true,
    maxStack: 5000,
    degree: 5
  },

  // Return Scrolls
  {
    id: 'scroll_return_jangan',
    name: 'Return Scroll (Jangan)',
    type: 'general',
    rarity: 'common',
    requiredLevel: 1,
    price: 1000,
    stackable: true,
    maxStack: 5000,
    degree: 1
  },
  {
    id: 'scroll_return_donwhang',
    name: 'Return Scroll (Donwhang)',
    type: 'general',
    rarity: 'common',
    requiredLevel: 1,
    price: 2000,
    stackable: true,
    maxStack: 5000,
    degree: 1
  },

  // Vigor Potions
  {
    id: 'potion_vigor',
    name: 'Vigor Potion',
    type: 'potion',
    rarity: 'common',
    requiredLevel: 1,
    price: 500,
    stackable: true,
    maxStack: 5000,
    degree: 1
  },
];

// ============================================
// ALCHEMY MATERIALS
// ============================================

export const ALCHEMY_MATERIALS: GameItem[] = [
  // Elixirs
  {
    id: 'elixir_weapon',
    name: 'Weapon Elixir',
    type: 'material',
    rarity: 'common',
    requiredLevel: 1,
    price: 50000,
    stackable: true,
    maxStack: 999,
    degree: 1
  },
  {
    id: 'elixir_armor',
    name: 'Armor Elixir',
    type: 'material',
    rarity: 'common',
    requiredLevel: 1,
    price: 50000,
    stackable: true,
    maxStack: 999,
    degree: 1
  },
  {
    id: 'elixir_accessory',
    name: 'Accessory Elixir',
    type: 'material',
    rarity: 'common',
    requiredLevel: 1,
    price: 40000,
    stackable: true,
    maxStack: 999,
    degree: 1
  },

  // Lucky Powder
  {
    id: 'lucky_powder_c',
    name: 'Lucky Powder C',
    type: 'material',
    rarity: 'common',
    requiredLevel: 1,
    price: 30000,
    stackable: true,
    maxStack: 999,
    degree: 1
  },
  {
    id: 'lucky_powder_b',
    name: 'Lucky Powder B',
    type: 'material',
    rarity: 'common',
    requiredLevel: 1,
    price: 60000,
    stackable: true,
    maxStack: 999,
    degree: 1
  },
  {
    id: 'lucky_powder_a',
    name: 'Lucky Powder A',
    type: 'material',
    rarity: 'common',
    requiredLevel: 1,
    price: 100000,
    stackable: true,
    maxStack: 999,
    degree: 1
  },

  // Tablets (Protectors)
  {
    id: 'tablet_weapon',
    name: 'Weapon Tablet',
    type: 'material',
    rarity: 'rare',
    requiredLevel: 1,
    price: 200000,
    stackable: true,
    maxStack: 999,
    degree: 1
  },
  {
    id: 'tablet_armor',
    name: 'Armor Tablet',
    type: 'material',
    rarity: 'rare',
    requiredLevel: 1,
    price: 200000,
    stackable: true,
    maxStack: 999,
    degree: 1
  },
];

// ============================================
// AMMUNITION
// ============================================

export const AMMUNITION: GameItem[] = [
  {
    id: 'arrow_normal',
    name: 'Arrow',
    type: 'arrow',
    rarity: 'common',
    requiredLevel: 1,
    price: 10,
    stackable: true,
    maxStack: 10000,
    degree: 1
  },
  {
    id: 'bolt_normal',
    name: 'Bolt',
    type: 'bolt',
    rarity: 'common',
    requiredLevel: 1,
    price: 15,
    stackable: true,
    maxStack: 10000,
    degree: 1
  },
];

// ============================================
// ALL ITEMS COMBINED
// ============================================

export const ALL_ITEMS: GameItem[] = [
  ...CHINESE_WEAPONS,
  ...CHINESE_ARMOR,
  ...ACCESSORIES,
  ...CONSUMABLES,
  ...ALCHEMY_MATERIALS,
  ...AMMUNITION,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getItemsByType(type: ItemType): GameItem[] {
  return ALL_ITEMS.filter(item => item.type === type);
}

export function getItemsByDegree(degree: number): GameItem[] {
  return ALL_ITEMS.filter(item => item.degree === degree);
}

export function getItemsByLevel(minLevel: number, maxLevel: number): GameItem[] {
  return ALL_ITEMS.filter(item =>
    item.requiredLevel >= minLevel && item.requiredLevel <= maxLevel
  );
}

export function getItemById(id: string): GameItem | undefined {
  return ALL_ITEMS.find(item => item.id === id);
}
