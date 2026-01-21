// ============================================
// SRObro - European Skills Data
// 6 mastery trees × 60 levels = 360 skills total
// ============================================

import { GameSkill } from '../../../shared/src/types';

// ============================================
// EUROPEAN SKILL DATA GENERATION
// ============================================

export interface EuropeanSkillConfig {
  masteryName: string;
  masteryTree: string;
  baseDamage: number;
  mpCost: number;
  castTime: number;
  cooldown: number;
  range: number;
}

function generateEuropeanSkills(): GameSkill[] {
  const skills: GameSkill[] = [];

  // ============================================
  // WARRIOR (2H, 1H+Shield, Defense)
  // ============================================

  // 2H Sword Series (20 levels)
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = Math.ceil(i / 20 * 60);
    const damage = 80 + (i - 1) * 12;

    skills.push({
      id: `warrior_2h_attack_${i}`,
      name: `2H Sword Attack - Lv${i}`,
      baseDamage: damage,
      mpCost: 25 + i,
      castTime: 800,
      cooldown: 3000 + (i * 100),
      range: 2.5,
      element: 'physical',
      type: 'active' as const,
      requiredLevel: i * 3,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_warrior_2h_${i}`,
      description: `Powerful 2H sword attack dealing ${damage} physical damage`
    });
  }

  // Shield Bash Series (15 levels)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = Math.ceil(i / 15 * 60);
    const damage = 50 + (i - 1) * 8;

    skills.push({
      id: `warrior_shield_bash_${i}`,
      name: `Shield Bash - Lv${i}`,
      baseDamage: damage,
      mpCost: 15 + i,
      castTime: 500,
      cooldown: 5000,
      range: 1.5,
      element: 'physical',
      type: 'active' as const,
      requiredLevel: i * 4,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_warrior_shield_${i}`,
      description: `Bash with shield dealing ${damage} physical damage and stuns`
    });
  }

  // Armor Mastery (Passive) - 10 levels
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = Math.ceil(i / 10 * 60);

    skills.push({
      id: `warrior_armor_mastery_${i}`,
      name: `Armor Mastery - Lv${i}`,
      baseDamage: 0,
      mpCost: 0,
      castTime: 0,
      cooldown: 0,
      range: 0,
      element: 'physical' as const,
      type: 'passive' as const,
      requiredLevel: i * 6,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_warrior_armor_${i}`,
      description: `Increases physical defense by ${i * 5}%`
    });
  }

  // ============================================
  // ROGUE (Dagger, Crossbow, Stealth, Poison)
  // ============================================

  // Dagger Attack Series (20 levels)
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = Math.ceil(i / 20 * 60);
    const damage = 40 + (i - 1) * 8;

    skills.push({
      id: `rogue_dagger_attack_${i}`,
      name: `Dagger Attack - Lv${i}`,
      baseDamage: damage,
      mpCost: 15 + i,
      castTime: 600,
      cooldown: 2000 + (i * 50),
      range: 1.5,
      element: 'physical',
      type: 'active' as const,
      requiredLevel: i * 3,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_rogue_dagger_${i}`,
      description: `Quick dagger attack dealing ${damage} physical damage`
    });
  }

  // Stealth Series (10 levels)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = Math.ceil(i / 10 * 60);
    const duration = 5 + i * 2; // seconds

    skills.push({
      id: `rogue_stealth_${i}`,
      name: `Stealth - Lv${i}`,
      baseDamage: 0,
      mpCost: 10 + i * 2,
      castTime: 500,
      cooldown: 30000 - (i * 1000),
      range: 0,
      element: 'physical' as const,
      type: 'buff' as const,
      requiredLevel: i * 6,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_rogue_stealth_${i}`,
      description: `Become invisible for ${duration} seconds. Breaking stealth on attack.`
    });
  }

  // Poison Series (15 levels)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = Math.ceil(i / 15 * 60);
    const damage = 5 + i * 3;

    skills.push({
      id: `rogue_poison_${i}`,
      name: `Poison - Lv${i}`,
      baseDamage: damage,
      mpCost: 20 + i,
      castTime: 800,
      cooldown: 10000,
      range: 3,
      element: 'force', // DoT
      type: 'active' as const,
      requiredLevel: i * 4,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_rogue_poison_${i}`,
      description: `Apply poison dealing ${damage * 5} damage over 10 seconds`
    });
  }

  // ============================================
  // WIZARD (Earth, Fire, Ice, Lightning)
  // ============================================

  // Fire Ball Series (20 levels)
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = Math.ceil(i / 20 * 60);
    const damage = 60 + (i - 1) * 15;

    skills.push({
      id: `wizard_fireball_${i}`,
      name: `Fire Ball - Lv${i}`,
      baseDamage: damage,
      mpCost: 30 + i * 2,
      castTime: 1000,
      cooldown: 4000 + i * 100,
      range: 15,
      element: 'fire',
      type: 'active' as const,
      requiredLevel: i * 3,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_wizard_fire_${i}`,
      description: `Hurl a fire ball dealing ${damage} fire damage to target`
    });
  }

  // Ice Bolt Series (20 levels)
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = Math.ceil(i / 20 * 60);
    const damage = 50 + (i - 1) * 12;

    skills.push({
      id: `wizard_icebolt_${i}`,
      name: `Ice Bolt - Lv${i}`,
      baseDamage: damage,
      mpCost: 25 + i * 2,
      castTime: 900,
      cooldown: 3500 + i * 100,
      range: 18,
      element: 'cold',
      type: 'active' as const,
      requiredLevel: i * 3,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_wizard_ice_${i}`,
      description: `Shoot ice bolt dealing ${damage} cold damage and slows target`
    });
  }

  // Lightning Bolt Series (20 levels)
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = Math.ceil(i / 20 * 60);
    const damage = 70 + (i - 1) * 14;

    skills.push({
      id: `wizard_lightning_${i}`,
      name: `Lightning Bolt - Lv${i}`,
      baseDamage: damage,
      mpCost: 35 + i * 2,
      castTime: 700,
      cooldown: 3000 + i * 100,
      range: 20,
      element: 'lightning',
      type: 'active' as const,
      requiredLevel: i * 3,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_wizard_lightning_${i}`,
      description: `Strike lightning dealing ${damage} lightning damage`
    });
  }

  // Earthquake Series (10 levels)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = Math.ceil(i / 10 * 60);
    const damage = 80 + (i - 1) * 20;

    skills.push({
      id: `wizard_earthquake_${i}`,
      name: `Earthquake - Lv${i}`,
      baseDamage: damage,
      mpCost: 50 + i * 3,
      castTime: 1500,
      cooldown: 15000,
      range: 5,
      element: 'physical',
      type: 'active' as const,
      requiredLevel: i * 6,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_wizard_earth_${i}`,
      description: `AoE earth quake dealing ${damage} physical damage in 5m radius`
    });
  }

  // ============================================
  // WARLOCK (DoT, Debuff, Curse)
  // ============================================

  // Life Drain Series (15 levels)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = Math.ceil(i / 15 * 60);
    const damage = 10 + i * 2;

    skills.push({
      id: `warlock_lifedrain_${i}`,
      name: `Life Drain - Lv${i}`,
      baseDamage: damage,
      mpCost: 30 + i * 2,
      castTime: 1000,
      cooldown: 8000,
      range: 10,
      element: 'force',
      type: 'active' as const,
      requiredLevel: i * 4,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_warlock_drain_${i}`,
      description: `Drain ${damage * 8} HP over 8 seconds and heal caster`
    });
  }

  // Curse Series (15 levels)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = Math.ceil(i / 15 * 60);

    skills.push({
      id: `warlock_curse_weak_${i}`,
      name: `Curse of Weakness - Lv${i}`,
      baseDamage: 0,
      mpCost: 25 + i * 2,
      castTime: 1200,
      cooldown: 12000,
      range: 12,
      element: 'force',
      type: 'debuff' as const,
      requiredLevel: i * 4,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_warlock_curse_${i}`,
      description: `Curse target reducing attack by ${i * 3}% for 30 seconds`
    });
  }

  // ============================================
  // CLERIC (Heal, Buff, Protection)
  // ============================================

  // Heal Series (20 levels)
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = Math.ceil(i / 20 * 60);
    const healAmount = 50 + (i - 1) * 30;

    skills.push({
      id: `cleric_heal_${i}`,
      name: `Heal - Lv${i}`,
      baseDamage: 0,
      mpCost: 20 + i,
      castTime: 1500,
      cooldown: 5000 + i * 100,
      range: 20,
      element: 'force',
      type: 'active' as const,
      requiredLevel: i * 3,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_cleric_heal_${i}`,
      description: `Restore ${healAmount} HP to target`
    });
  }

  // Group Heal Series (10 levels)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = Math.ceil(i / 10 * 60);
    const healAmount = 100 + (i - 1) * 50;

    skills.push({
      id: `cleric_groupheal_${i}`,
      name: `Group Heal - Lv${i}`,
      baseDamage: 0,
      mpCost: 30 + i * 2,
      castTime: 2000,
      cooldown: 10000 + i * 500,
      range: 15,
      element: 'force',
      type: 'active' as const,
      requiredLevel: i * 6,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_cleric_groupheal_${i}`,
      description: `Restore ${healAmount} HP to all party members in range`
    });
  }

  // Buff Series (STR/INT/HP)
  skills.push({
    id: 'cleric_buff_str_1',
    name: 'Blessing Spell',
    baseDamage: 0,
    mpCost: 50,
    castTime: 1000,
    cooldown: 600000, // 10 minutes
    range: 20,
    element: 'force',
    type: 'buff' as const,
    requiredLevel: 10,
    requiredMasteryLevel: 20,
    iconId: 'skill_cleric_buff_str',
    description: 'Increase STR by 10% for 10 minutes'
  });

  skills.push({
    id: 'cleric_buff_int_1',
    name: 'Mind Spell',
    baseDamage: 0,
    mpCost: 50,
    castTime: 1000,
    cooldown: 600000,
    range: 20,
    element: 'force',
    type: 'buff' as const,
    requiredLevel: 10,
    requiredMasteryLevel: 20,
    iconId: 'skill_cleric_buff_int',
    description: 'Increase INT by 10% for 10 minutes'
  });

  // Resurrection
  skills.push({
    id: 'cleric_resurrect_1',
    name: 'Resurrection',
    baseDamage: 0,
    mpCost: 200,
    castTime: 5000,
    cooldown: 300000, // 5 minutes
    range: 20,
    element: 'force',
    type: 'active' as const,
    requiredLevel: 20,
    requiredMasteryLevel: 40,
    iconId: 'skill_cleric_resurrect',
    description: 'Revive dead target with 50% HP and MP'
  });

  // ============================================
  // BARD (Buff, Mana, Speed, Attack Speed)
  // ============================================

  // Mana Cycle Series (10 levels)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = Math.ceil(i / 10 * 60);
    const manaRestore = 20 + i * 10;

    skills.push({
      id: `bard_manacycle_${i}`,
      name: `Mana Cycle - Lv${i}`,
      baseDamage: 0,
      mpCost: 10 + i,
      castTime: 500,
      cooldown: 30000,
      range: 20,
      element: 'force',
      type: 'active' as const,
      requiredLevel: i * 6,
      requiredMasteryLevel: masteryLevel,
      iconId: `skill_bard_manacycle_${i}`,
      description: `Restore ${manaRestore} MP per second for 10 seconds`
    });
  }

  // Movement Speed Buff
  skills.push({
    id: 'bard_speed_1',
    name: 'Moving March',
    baseDamage: 0,
    mpCost: 40,
    castTime: 1000,
    cooldown: 180000, // 3 minutes
    range: 15,
    element: 'lightning',
    type: 'buff' as const,
    requiredLevel: 15,
    requiredMasteryLevel: 25,
    iconId: 'skill_bard_speed',
    description: 'Increase movement speed by 20% for 3 minutes'
  });

  // Attack Speed Buff
  skills.push({
    id: ' bard_attackspeed_1',
    name: 'Attack Tempo',
    baseDamage: 0,
    mpCost: 40,
    castTime: 1000,
    cooldown: 180000,
    range: 15,
    element: 'fire',
    type: 'buff' as const,
    requiredLevel: 15,
    requiredMasteryLevel: 25,
    iconId: 'skill_bard_attackspeed',
    description: 'Increase attack speed by 15% for 3 minutes'
  });

  // HP Buff
  skills.push({
    id: 'bard_hp_buff_1',
    name: 'Vitality Hymn',
    baseDamage: 0,
    mpCost: 50,
    castTime: 1200,
    cooldown: 180000,
    range: 15,
    element: 'force',
    type: 'buff' as const,
    requiredLevel: 10,
    requiredMasteryLevel: 20,
    iconId: 'skill_bard_hp',
    description: 'Increase max HP by 15% for 3 minutes'
  });

  // ============================================
  // EUROPEAN ITEMS DATA
  // ============================================

  const EUROPEAN_ITEMS_DATA = [
    // 1D Weapons (Level 1-9)
    {
      id: 'weapon_euro_2h_sword_1d',
      name: 'Two-Handed Sword 1D',
      type: 'weapon',
      subType: '2h_sword',
      race: 'european',
      degree: 1,
      requiredLevel: 1,
      minDamage: 8,
      maxDamage: 12,
      attackSpeed: 1200,
      critical: 5,
      rarity: 'common'
    },
    {
      id: 'weapon_euro_1h_sword_1d',
      name: 'Sword 1D',
      type: 'weapon',
      subType: 'sword',
      race: 'european',
      degree: 1,
      requiredLevel: 1,
      minDamage: 6,
      maxDamage: 10,
      attackSpeed: 1000,
      critical: 3,
      rarity: 'common'
    },
    {
      id: 'weapon_euro_staff_1d',
      name: 'Staff 1D',
      type: 'weapon',
      subType: 'staff',
      race: 'european',
      degree: 1,
      requiredLevel: 1,
      minDamage: 3,
      maxDamage: 7,
      magicalAttackMin: 8,
      magicalAttackMax: 12,
      attackSpeed: 1500,
      critical: 2,
      rarity: 'common'
    },
    {
      id: 'weapon_euro_dagger_1d',
      name: 'Dagger 1D',
      type: 'weapon',
      subType: 'dagger',
      race: 'european',
      degree: 1,
      requiredLevel: 1,
      minDamage: 4,
      maxDamage: 8,
      attackSpeed: 800,
      critical: 10,
      rarity: 'common'
    },
    {
      id: 'weapon_euro_crossbow_1d',
      name: 'Crossbow 1D',
      type: 'weapon',
      subType: 'crossbow',
      race: 'european',
      degree: 1,
      requiredLevel: 1,
      minDamage: 5,
      maxDamage: 9,
      attackSpeed: 1200,
      critical: 5,
      rarity: 'common'
    },

    // 1D Armor
    {
      id: 'armor_ero_light_1d',
      name: 'Light Armor 1D',
      type: 'armor',
      subType: 'light',
      race: 'european',
      degree: 1,
      requiredLevel: 1,
      defense: 5,
      magicalDefense: 3,
      rarity: 'common'
    },
    {
      id: 'armor_ero_heavy_1d',
      name: 'Heavy Armor 1D',
      type: 'armor',
      subType: 'heavy',
      race: 'european',
      degree: 1,
      requiredLevel: 1,
      defense: 8,
      magicalDefense: 2,
      rarity: 'common'
    },
    {
      id: 'armor_ero_robe_1d',
      name: 'Robe 1D',
      type: 'armor',
      subType: 'robe',
      race: 'european',
      degree: 1,
      requiredLevel: 1,
      defense: 2,
      magicalDefense: 8,
      rarity: 'common'
    },

    // 1D Accessories
    {
      id: 'acc_euro_ring_1d',
      name: 'Ring 1D',
      type: 'ring',
      degree: 1,
      requiredLevel: 1,
      bonusStr: 1,
      bonusInt: 1,
      rarity: 'common'
    },
    {
      id: 'acc_euro_necklace_1d',
      name: 'Necklace 1D',
      type: 'necklace',
      degree: 1,
      requiredLevel: 1,
      bonusStr: 1,
      bonusInt: 1,
      rarity: 'common'
    }
  ];

  // Expand to 13D (would be generated in production)
  // for (let degree = 1; degree <= 13; degree++) {
  //   EUROPEAN_ITEMS.push(...);
  // }

  return skills;
}

// Export combined data
export const EUROPEAN_SKILLS = generateEuropeanSkills();

export default generateEuropeanSkills;
