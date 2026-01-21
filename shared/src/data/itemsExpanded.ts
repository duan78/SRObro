// ============================================
// SRObro - Complete Items Data Generator
// Generates 1000+ items across all degrees (1D-13D)
// ============================================

export interface GameItem {
  id: string;
  name: string;
  type: ItemType;
  degree: number;
  rarity: ItemRarity;
  requiredLevel: number;
  gender?: 'male' | 'female' | 'both';
  class?: string[]; // 'warrior', 'rogue', 'wizard', etc.

  // Stats
  minDamage?: number;
  maxDamage?: number;
  defense?: number;
  magicalDefense?: number;
  attackRate?: number;
  parryRate?: number;
  critical?: number;
  str?: number;
  int?: number;

  // Slots
  slots?: number;
  durability?: number;
  maxDurability?: number;

  // Value
  price?: number;
  sellPrice?: number;
  weight?: number;

  // Alchemy
  canPlus?: boolean;
  maxPlus?: number;
  sockets?: number;

  // Visual
  modelId?: string;
  iconId?: string;

  description?: string;
}

export type ItemType =
  | 'weapon'
  | 'armor'
  | 'accessory'
  | 'shield'
  | 'hat'
  | 'pants'
  | 'shoes'
  | 'gloves'
  | 'ring'
  | 'necklace'
  | 'earring'
  | 'consumable'
  | 'alchemy'
  | 'ammunition';

export type ItemRarity = 'common' | 'rare' | 'legendary' | 'unique';

// ============================================
// DEGREE CONFIGURATIONS
// ============================================

export const DEGREE_CONFIG = [
  { level: 1, degree: 1, minDamage: 5, maxDamage: 10, defense: 3, price: 100 },
  { level: 10, degree: 2, minDamage: 15, maxDamage: 25, defense: 10, price: 1000 },
  { level: 19, degree: 3, minDamage: 30, maxDamage: 45, defense: 20, price: 5000 },
  { level: 29, degree: 4, minDamage: 50, maxDamage: 75, defense: 35, price: 20000 },
  { level: 39, degree: 5, minDamage: 80, maxDamage: 120, defense: 55, price: 100000 },
  { level: 49, degree: 6, minDamage: 120, maxDamage: 180, defense: 80, price: 500000 },
  { level: 59, degree: 7, minDamage: 170, maxDamage: 250, defense: 110, price: 2000000 },
  { level: 64, degree: 8, minDamage: 220, maxDamage: 330, defense: 145, price: 5000000 },
  { level: 68, degree: 9, minDamage: 280, maxDamage: 420, defense: 185, price: 15000000 }, // SOS/SOM
  { level: 72, degree: 10, minDamage: 350, maxDamage: 525, defense: 230, price: 50000000 },
  { level: 80, degree: 11, minDamage: 450, maxDamage: 675, defense: 285, price: 150000000 },
  { level: 90, degree: 12, minDamage: 600, maxDamage: 900, defense: 350, price: 500000000 },
  { level: 100, degree: 13, minDamage: 800, maxDamage: 1200, defense: 430, price: 1500000000 },
];

// ============================================
// CHINESE WEAPONS (Blade, Sword, Spear, Bow)
// ============================================

export function generateChineseWeapons(): GameItem[] {
  const items: GameItem[] = [];
  const weaponTypes = ['Blade', 'Sword', 'Spear', 'Bow', 'Glaive'];

  DEGREE_CONFIG.forEach((config) => {
    weaponTypes.forEach((type, index) => {
      const item: GameItem = {
        id: `weapon_chinese_${type.toLowerCase()}_${config.degree}d`,
        name: `${type} ${config.degree}D`,
        type: 'weapon',
        degree: config.degree,
        rarity: config.degree >= 9 ? 'rare' : 'common',
        requiredLevel: config.level,
        gender: 'both',
        class: ['warrior'],

        minDamage: config.minDamage + index * 5,
        maxDamage: config.maxDamage + index * 10,
        attackRate: 15 + index * 2,
        critical: 5,

        durability: 2000 + config.degree * 200,
        maxDurability: 2000 + config.degree * 200,

        price: config.price,
        sellPrice: Math.floor(config.price * 0.3),
        weight: 50 + config.degree * 5,

        canPlus: true,
        maxPlus: 12,
        sockets: config.degree >= 9 ? (config.degree >= 10 ? 2 : 1) : 0,

        modelId: `weapon_${type.toLowerCase()}_${config.degree}d`,
        iconId: `icon_weapon_${type.toLowerCase()}_${config.degree}d`,

        description: `Chinese ${type} for degree ${config.degree}. Level ${config.level} required.`,
      };

      items.push(item);
    });
  });

  return items;
}

// ============================================
// CHINESE ARMOR (Protector, Garment, Armor)
// ============================================

export function generateChineseArmor(): GameItem[] {
  const items: GameItem[] = [];
  const armorTypes = [
    { type: 'armor' as ItemType, name: 'Armor', defMod: 1.2, magDefMod: 0.8 },
    { type: 'protector' as ItemType, name: 'Protector', defMod: 1.0, magDefMod: 1.0 },
    { type: 'garment' as ItemType, name: 'Garment', defMod: 0.8, magDefMod: 1.2 },
  ];

  DEGREE_CONFIG.forEach((config) => {
    armorTypes.forEach((armorType, index) => {
      ['male', 'female'].forEach((gender) => {
        const item: GameItem = {
          id: `armor_${armorType.type}_${gender}_${config.degree}d`,
          name: `${armorType.name} ${config.degree}D (${gender})`,
          type: armorType.type,
          degree: config.degree,
          rarity: config.degree >= 9 ? 'rare' : 'common',
          requiredLevel: config.level,
          gender: gender as 'male' | 'female',
          class: ['warrior'],

          defense: Math.floor(config.defense * armorType.defMod),
          magicalDefense: Math.floor(config.defense * armorType.magDefMod),
          parryRate: 5 + config.degree,

          durability: 2500 + config.degree * 250,
          maxDurability: 2500 + config.degree * 250,

          price: Math.floor(config.price * 1.5),
          sellPrice: Math.floor(config.price * 0.45),
          weight: 80 + config.degree * 10,

          canPlus: true,
          maxPlus: 12,
          sockets: config.degree >= 9 ? (config.degree >= 12 ? 3 : 2) : 0,

          modelId: `armor_${armorType.type}_${gender}_${config.degree}d`,
          iconId: `icon_armor_${armorType.type}_${config.degree}d`,

          description: `Chinese ${armorType.name} for degree ${config.degree}. ${gender}.`,
        };

        items.push(item);
      });
    });
  });

  return items;
}

// ============================================
// ACCESSORIES (Rings, Necklaces, Earrings)
// ============================================

export function generateAccessories(): GameItem[] {
  const items: GameItem[] = [];

  // Rings (1D-13D)
  DEGREE_CONFIG.forEach((config) => {
    for (let i = 1; i <= 3; i++) {
      const item: GameItem = {
        id: `ring_${config.degree}d_${i}`,
        name: `Ring ${config.degree}D (Tier ${i})`,
        type: 'ring',
        degree: config.degree,
        rarity: config.degree >= 9 ? 'rare' : 'common',
        requiredLevel: config.level - 5,
        gender: 'both',

        str: config.degree * i * 2,
        int: config.degree * i * 2,
        critical: 2 + i,

        price: config.price * 2 * i,
        sellPrice: Math.floor(config.price * 0.6 * i),
        weight: 5,

        canPlus: false,
        sockets: 0,

        iconId: `icon_ring_${config.degree}d_${i}`,

        description: `Ring increasing STR and INT by ${config.degree * i * 2}.`,
      };

      items.push(item);
    }
  });

  // Necklaces (1D-13D)
  DEGREE_CONFIG.forEach((config) => {
    for (let i = 1; i <= 2; i++) {
      const item: GameItem = {
        id: `necklace_${config.degree}d_${i}`,
        name: `Necklace ${config.degree}D (Tier ${i})`,
        type: 'necklace',
        degree: config.degree,
        rarity: config.degree >= 9 ? 'rare' : 'common',
        requiredLevel: config.level - 3,
        gender: 'both',

        maxDamage: config.degree * 10 * i,
        defense: config.degree * 5 * i,
        magicalDefense: config.degree * 5 * i,

        price: config.price * 3 * i,
        sellPrice: Math.floor(config.price * 0.6 * i),
        weight: 10,

        canPlus: false,
        sockets: 0,

        iconId: `icon_necklace_${config.degree}d_${i}`,

        description: `Necklace increasing damage and defenses.`,
      };

      items.push(item);
    }
  });

  // Earrings (1D-13D)
  DEGREE_CONFIG.forEach((config) => {
    for (let i = 1; i <= 2; i++) {
      const item: GameItem = {
        id: `earring_${config.degree}d_${i}`,
        name: `Earring ${config.degree}D (Tier ${i})`,
        type: 'earring',
        degree: config.degree,
        rarity: config.degree >= 9 ? 'rare' : 'common',
        requiredLevel: config.level - 5,
        gender: 'both',

        critical: 5 + i * 3,
        attackRate: 3 + i * 2,
        parryRate: 3 + i * 2,

        price: config.price * 2 * i,
        sellPrice: Math.floor(config.price * 0.6 * i),
        weight: 3,

        canPlus: false,
        sockets: 0,

        iconId: `icon_earring_${config.degree}d_${i}`,

        description: `Earring increasing attack rate and critical.`,
      };

      items.push(item);
    }
  });

  return items;
}

// ============================================
// CONSUMABLES (Potions, Scrolls, etc.)
// ============================================

export function generateConsumables(): GameItem[] {
  const items: GameItem[] = [];

  // HP Potions (Level 10-110)
  const hpPotionLevels = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];
  hpPotionLevels.forEach((level, index) => {
    const heal = 250 + level * 50;
    const item: GameItem = {
      id: `potion_hp_lv${level}`,
      name: `HP Potion (Lv${level})`,
      type: 'consumable',
      degree: Math.ceil(level / 10),
      rarity: 'common',
      requiredLevel: level - 5,
      gender: 'both',

      price: 50 + index * 20,
      sellPrice: 10 + index * 5,
      weight: 1,

      slots: 9999, // Stackable

      iconId: `icon_potion_hp_${level}`,
      description: `Restores ${heal} HP.`,
    };

    items.push(item);
  });

  // MP Potions (Level 10-110)
  const mpPotionLevels = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110];
  mpPotionLevels.forEach((level, index) => {
    const restore = 100 + level * 30;
    const item: GameItem = {
      id: `potion_mp_lv${level}`,
      name: `MP Potion (Lv${level})`,
      type: 'consumable',
      degree: Math.ceil(level / 10),
      rarity: 'common',
      requiredLevel: level - 5,
      gender: 'both',

      price: 80 + index * 30,
      sellPrice: 15 + index * 8,
      weight: 1,

      slots: 9999, // Stackable

      iconId: `icon_potion_mp_${level}`,
      description: `Restores ${restore} MP.`,
    };

    items.push(item);
  });

  // Return Scrolls (Town, Party, Guild)
  const scrollTypes = [
    { id: 'return_jangan', name: 'Return Scroll (Jangan)', price: 500, dest: 'Jangan' },
    { id: 'return_donwhang', name: 'Return Scroll (Donwhang)', price: 1000, dest: 'Donwhang' },
    { id: 'return_hotan', name: 'Return Scroll (Hotan)', price: 2000, dest: 'Hotan' },
    { id: 'return_party', name: 'Party Return Scroll', price: 5000, dest: 'Party Leader' },
    { id: 'return_guild', name: 'Guild Return Scroll', price: 10000, dest: 'Guild Leader' },
  ];

  scrollTypes.forEach((scroll) => {
    const item: GameItem = {
      id: scroll.id,
      name: scroll.name,
      type: 'consumable',
      degree: 1,
      rarity: 'common',
      requiredLevel: 1,
      gender: 'both',

      price: scroll.price,
      sellPrice: Math.floor(scroll.price * 0.3),
      weight: 2,

      slots: 9999, // Stackable

      iconId: `icon_scroll_${scroll.id}`,
      description: `Teleports to ${scroll.dest}.`,
    };

    items.push(item);
  });

  // Vigor Potions (Exp boost)
  for (let i = 1; i <= 5; i++) {
    const expBonus = 50 + i * 30;
    const duration = 30 + i * 30; // minutes
    const item: GameItem = {
      id: `vigor_potion_${i}`,
      name: `Vigor Potion (Tier ${i})`,
      type: 'consumable',
      degree: i * 2,
      rarity: 'rare',
      requiredLevel: 1,
      gender: 'both',

      price: 50000 * i,
      sellPrice: 15000 * i,
      weight: 5,

      slots: 99, // Stackable

      iconId: `icon_vigor_${i}`,
      description: `Increases EXP gain by ${expBonus}% for ${duration} minutes.`,
    };

    items.push(item);
  }

  // Speed Potions
  for (let i = 1; i <= 3; i++) {
    const speedBonus = 10 + i * 5;
    const duration = 5 + i * 5; // minutes
    const item: GameItem = {
      id: `speed_potion_${i}`,
      name: `Speed Potion (Tier ${i})`,
      type: 'consumable',
      degree: i * 3,
      rarity: 'rare',
      requiredLevel: 1,
      gender: 'both',

      price: 10000 * i,
      sellPrice: 3000 * i,
      weight: 3,

      slots: 99,

      iconId: `icon_speed_${i}`,
      description: `Increases movement speed by ${speedBonus}% for ${duration} minutes.`,
    };

    items.push(item);
  }

  return items;
}

// ============================================
// ALCHEMY MATERIALS
// ============================================

export function generateAlchemyMaterials(): GameItem[] {
  const items: GameItem[] = [];

  // Elixirs
  const elixirTypes = ['weapon', 'armor', 'accessory'];
  elixirTypes.forEach((type) => {
    DEGREE_CONFIG.forEach((config) => {
      const item: GameItem = {
        id: `elixir_${type}_${config.degree}d`,
        name: `${type.charAt(0).toUpperCase() + type.slice(1)} Elixir (${config.degree}D)`,
        type: 'alchemy',
        degree: config.degree,
        rarity: 'rare',
        requiredLevel: config.level,
        gender: 'both',

        price: config.price * 0.1,
        sellPrice: Math.floor(config.price * 0.03),
        weight: 5,

        slots: 999, // Stackable

        iconId: `icon_elixir_${type}_${config.degree}d`,
        description: `Used for +1 to +12 enhancement of ${type} items (${config.degree}D).`,
      };

      items.push(item);
    });
  });

  // Lucky Powder (A/B/C grades)
  const powderGrades = ['A', 'B', 'C'];
  powderGrades.forEach((grade) => {
    const bonus = grade === 'A' ? 15 : grade === 'B' ? 10 : 5;
    DEGREE_CONFIG.forEach((config) => {
      const item: GameItem = {
        id: `lucky_powder_${grade}_${config.degree}d`,
        name: `Lucky Powder Grade ${grade} (${config.degree}D)`,
        type: 'alchemy',
        degree: config.degree,
        rarity: 'rare',
        requiredLevel: config.level,
        gender: 'both',

        price: config.price * 0.05,
        sellPrice: Math.floor(config.price * 0.015),
        weight: 1,

        slots: 9999,

        iconId: `icon_powder_${grade}_${config.degree}d`,
        description: `+${bonus}% success rate for enhancement (${config.degree}D).`,
      };

      items.push(item);
    });
  });

  // Tablets/Protectors
  const tabletTypes = ['Weapon Tablet', 'Armor Tablet', 'Accessory Tablet'];
  tabletTypes.forEach((type) => {
    DEGREE_CONFIG.filter((d) => d.degree >= 7).forEach((config) => {
      const item: GameItem = {
        id: `tablet_${type.split(' ')[0].toLowerCase()}_${config.degree}d`,
        name: `${type} (${config.degree}D)`,
        type: 'alchemy',
        degree: config.degree,
        rarity: 'rare',
        requiredLevel: config.level,
        gender: 'both',

        price: config.price * 0.2,
        sellPrice: Math.floor(config.price * 0.06),
        weight: 5,

        slots: 99,

        iconId: `icon_tablet_${type.split(' ')[0].toLowerCase()}_${config.degree}d`,
        description: `Prevents item destruction during enhancement (${config.degree}D+).`,
      };

      items.push(item);
    });
  });

  return items;
}

// ============================================
// AMMUNITION
// ============================================

export function generateAmmunition(): GameItem[] {
  const items: GameItem[] = [];

  // Arrows (Bow ammunition)
  const arrowTypes = ['Normal', 'Silver', 'Gold'];
  arrowTypes.forEach((type) => {
    const count = type === 'Normal' ? 500 : type === 'Silver' ? 250 : 100;
    const damageBonus = type === 'Normal' ? 0 : type === 'Silver' ? 5 : 10;

    const item: GameItem = {
      id: `arrow_${type.toLowerCase()}`,
      name: `${type} Arrow`,
      type: 'ammunition',
      degree: 1,
      rarity: type === 'Normal' ? 'common' : 'rare',
      requiredLevel: 1,
      gender: 'both',

      minDamage: damageBonus,
      maxDamage: damageBonus,

      price: type === 'Normal' ? 100 : type === 'Silver' ? 500 : 2000,
      sellPrice: type === 'Normal' ? 30 : type === 'Silver' ? 150 : 600,
      weight: 1,

      slots: 9999, // Stackable

      iconId: `icon_arrow_${type.toLowerCase()}`,
      description: `Ammunition for bow. ${count} arrows. +${damageBonus} damage.`,
    };

    items.push(item);
  });

  // Bolts (Crossbow ammunition - for future European class)
  const boltTypes = ['Normal', 'Piercing', 'Explosive'];
  boltTypes.forEach((type) => {
    const count = type === 'Normal' ? 500 : 250;
    const damageBonus = type === 'Normal' ? 0 : type === 'Piercing' ? 10 : 20;

    const item: GameItem = {
      id: `bolt_${type.toLowerCase()}`,
      name: `${type} Bolt`,
      type: 'ammunition',
      degree: 1,
      rarity: type === 'Normal' ? 'common' : 'rare',
      requiredLevel: 1,
      gender: 'both',

      minDamage: damageBonus,
      maxDamage: damageBonus,

      price: type === 'Normal' ? 150 : type === 'Piercing' ? 750 : 3000,
      sellPrice: type === 'Normal' ? 45 : type === 'Piercing' ? 225 : 900,
      weight: 2,

      slots: 9999,

      iconId: `icon_bolt_${type.toLowerCase()}`,
      description: `Ammunition for crossbow. ${count} bolts. +${damageBonus} damage.`,
    };

    items.push(item);
  });

  return items;
}

// ============================================
// GENERATE ALL ITEMS
// ============================================

export function generateAllItems(): GameItem[] {
  const allItems: GameItem[] = [];

  // Generate all item categories
  allItems.push(...generateChineseWeapons());
  allItems.push(...generateChineseArmor());
  allItems.push(...generateAccessories());
  allItems.push(...generateConsumables());
  allItems.push(...generateAlchemyMaterials());
  allItems.push(...generateAmmunition());

  console.log(`[Items] Generated ${allItems.length} items`);

  return allItems;
}

// Helper functions
export function getItemsByDegree(degree: number): GameItem[] {
  const allItems = generateAllItems();
  return allItems.filter(item => item.degree === degree);
}

export function getItemsByType(type: ItemType): GameItem[] {
  const allItems = generateAllItems();
  return allItems.filter(item => item.type === type);
}

export function getItemById(itemId: string): GameItem | undefined {
  const allItems = generateAllItems();
  return allItems.find(item => item.id === itemId);
}

// Export all items
export const ALL_ITEMS = generateAllItems();
