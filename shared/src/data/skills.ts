// ============================================
// SRObro - Game Skills Data
// Comprehensive skill database for Silkroad Online
// ============================================

export interface GameSkill {
  id: string;
  masteryId: string;
  name: string;
  type: SkillType;
  level: number;
  element?: Element;
  baseDamage: number;
  mpCost: number;
  castTime: number; // milliseconds
  cooldown: number; // milliseconds
  range: number; // meters
  requiredLevel: number;
  requiredMasteryLevel: number;
  iconId?: string;
  description?: string;
  isPassive: boolean;
  Buff?: SkillBuff;
}

export interface SkillBuff {
  type: BuffType;
  value: number;
  duration: number; // milliseconds
  stackable: boolean;
}

export type SkillType = 'passive' | 'active' | 'buff';
export type Element = 'physical' | 'fire' | 'cold' | 'lightning' | 'force';
export type BuffType =
  | 'attack_power'
  | 'defense'
  | 'attack_speed'
  | 'move_speed'
  | 'hp'
  | 'mp'
  | 'str'
  | 'int'
  | 'parry_ratio'
  | 'block_ratio'
  | 'critical';

// ============================================
// CHINESE MASTERY - BICHEON (Sword/Blade)
// ============================================

export const BICHEON_SKILLS: GameSkill[] = [
  // Smasg Series (Blade attacks)
  {
    id: 'skill_smash_1',
    masteryId: 'mastery_bicheon',
    name: 'Smash Series - Lv1',
    type: 'active',
    level: 1,
    element: 'physical',
    baseDamage: 100,
    mpCost: 10,
    castTime: 0,
    cooldown: 0,
    range: 2.5,
    requiredLevel: 1,
    requiredMasteryLevel: 1,
    description: 'Basic blade attack that deals 100% damage.',
    isPassive: false
  },
  {
    id: 'skill_smash_2',
    masteryId: 'mastery_bicheon',
    name: 'Smash Series - Lv2',
    type: 'active',
    level: 2,
    element: 'physical',
    baseDamage: 120,
    mpCost: 12,
    castTime: 0,
    cooldown: 0,
    range: 2.5,
    requiredLevel: 4,
    requiredMasteryLevel: 3,
    description: 'Improved blade attack that deals 120% damage.',
    isPassive: false
  },
  {
    id: 'skill_smash_3',
    masteryId: 'mastery_bicheon',
    name: 'Smash Series - Lv3',
    type: 'active',
    level: 3,
    element: 'physical',
    baseDamage: 145,
    mpCost: 15,
    castTime: 0,
    cooldown: 0,
    range: 2.5,
    requiredLevel: 7,
    requiredMasteryLevel: 5,
    description: 'Advanced blade attack that deals 145% damage.',
    isPassive: false
  },

  // Chain Sword Series (Sword attacks)
  {
    id: 'skill_chain_sword_1',
    masteryId: 'mastery_bicheon',
    name: 'Chain Sword Series - Lv1',
    type: 'active',
    level: 1,
    element: 'physical',
    baseDamage: 110,
    mpCost: 12,
    castTime: 0,
    cooldown: 0,
    range: 2.5,
    requiredLevel: 5,
    requiredMasteryLevel: 3,
    description: 'Quick sword attack combo.',
    isPassive: false
  },
  {
    id: 'skill_chain_sword_2',
    masteryId: 'mastery_bicheon',
    name: 'Chain Sword Series - Lv2',
    type: 'active',
    level: 2,
    element: 'physical',
    baseDamage: 135,
    mpCost: 16,
    castTime: 0,
    cooldown: 0,
    range: 2.5,
    requiredLevel: 10,
    requiredMasteryLevel: 7,
    description: 'Improved sword combo attack.',
    isPassive: false
  },

  // Killing Heaven Series (High damage attacks)
  {
    id: 'skill_killing_heaven_1',
    masteryId: 'mastery_bicheon',
    name: 'Killing Heaven Series - Lv1',
    type: 'active',
    level: 1,
    element: 'physical',
    baseDamage: 200,
    mpCost: 30,
    castTime: 1500,
    cooldown: 8000,
    range: 3.0,
    requiredLevel: 15,
    requiredMasteryLevel: 11,
    description: 'Powerful attack that deals 200% damage. Slow cast.',
    isPassive: false
  },

  // Shield Passive (Blocking)
  {
    id: 'skill_shield_passive',
    masteryId: 'mastery_bicheon',
    name: 'Shield Technique',
    type: 'passive',
    level: 1,
    element: 'physical',
    baseDamage: 0,
    mpCost: 0,
    castTime: 0,
    cooldown: 0,
    range: 0,
    requiredLevel: 5,
    requiredMasteryLevel: 3,
    description: 'Increases block ratio by 5% when using shield.',
    isPassive: true,
    Buff: {
      type: 'block_ratio',
      value: 5,
      duration: 0,
      stackable: false
    }
  },
  {
    id: 'skill_shield_passive_2',
    masteryId: 'mastery_bicheon',
    name: 'Shield Technique - Advanced',
    type: 'passive',
    level: 2,
    element: 'physical',
    baseDamage: 0,
    mpCost: 0,
    castTime: 0,
    cooldown: 0,
    range: 0,
    requiredLevel: 15,
    requiredMasteryLevel: 11,
    description: 'Increases block ratio by 10% when using shield.',
    isPassive: true,
    Buff: {
      type: 'block_ratio',
      value: 10,
      duration: 0,
      stackable: false
    }
  },

  // Body Buff (Defense buff)
  {
    id: 'skill_body_buff',
    masteryId: 'mastery_bicheon',
    name: 'Body Buff - Smashing',
    type: 'buff',
    level: 1,
    element: 'physical',
    baseDamage: 0,
    mpCost: 50,
    castTime: 0,
    cooldown: 60000,
    range: 0,
    requiredLevel: 20,
    requiredMasteryLevel: 15,
    description: 'Increases physical defense by 20% for 10 minutes.',
    isPassive: false,
    Buff: {
      type: 'defense',
      value: 20,
      duration: 600000,
      stackable: false
    }
  },
];

// ============================================
// CHINESE MASTERY - HEUKSAL (Spear/Glaive)
// ============================================

export const HEUKSAL_SKILLS: GameSkill[] = [
  // Flying Dragon Series
  {
    id: 'skill_flying_dragon_1',
    masteryId: 'mastery_heuksal',
    name: 'Flying Dragon Series - Lv1',
    type: 'active',
    level: 1,
    element: 'physical',
    baseDamage: 110,
    mpCost: 11,
    castTime: 0,
    cooldown: 0,
    range: 3.0,
    requiredLevel: 1,
    requiredMasteryLevel: 1,
    description: 'Basic spear thrust attack. 110% damage.',
    isPassive: false
  },
  {
    id: 'skill_flying_dragon_2',
    masteryId: 'mastery_heuksal',
    name: 'Flying Dragon Series - Lv2',
    type: 'active',
    level: 2,
    element: 'physical',
    baseDamage: 135,
    mpCost: 14,
    castTime: 0,
    cooldown: 0,
    range: 3.0,
    requiredLevel: 5,
    requiredMasteryLevel: 3,
    description: 'Improved spear thrust. 135% damage.',
    isPassive: false
  },

  // Ghost Spear Series (Piercing attacks)
  {
    id: 'skill_ghost_spear_1',
    masteryId: 'mastery_heuksal',
    name: 'Ghost Spear Series - Lv1',
    type: 'active',
    level: 1,
    element: 'physical',
    baseDamage: 150,
    mpCost: 20,
    castTime: 1000,
    cooldown: 5000,
    range: 4.0,
    requiredLevel: 10,
    requiredMasteryLevel: 7,
    description: 'Powerful piercing attack. 150% damage, longer range.',
    isPassive: false
  },

  // Lightning Series (AoE attacks)
  {
    id: 'skill_lightning_nova_1',
    masteryId: 'mastery_heuksal',
    name: 'Lightning Nova - Lv1',
    type: 'active',
    level: 1,
    element: 'physical',
    baseDamage: 120,
    mpCost: 35,
    castTime: 1500,
    cooldown: 10000,
    range: 5.0,
    requiredLevel: 20,
    requiredMasteryLevel: 15,
    description: 'Spin attack hitting all nearby enemies. 120% damage each.',
    isPassive: false
  },

  // Counter Attack (Passive)
  {
    id: 'skill_counter_attack',
    masteryId: 'mastery_heuksal',
    name: 'Counter Attack',
    type: 'passive',
    level: 1,
    element: 'physical',
    baseDamage: 0,
    mpCost: 0,
    castTime: 0,
    cooldown: 0,
    range: 0,
    requiredLevel: 15,
    requiredMasteryLevel: 11,
    description: '10% chance to reflect 30% damage when hit.',
    isPassive: true
  },
];

// ============================================
// CHINESE MASTERY - PACHEON (Bow)
// ============================================

export const PACHEON_SKILLS: GameSkill[] = [
  // Arrow Series (Basic shots)
  {
    id: 'skill_arrow_1',
    masteryId: 'mastery_pacheon',
    name: 'Arrow Series - Lv1',
    type: 'active',
    level: 1,
    element: 'physical',
    baseDamage: 100,
    mpCost: 8,
    castTime: 500,
    cooldown: 0,
    range: 20.0,
    requiredLevel: 1,
    requiredMasteryLevel: 1,
    description: 'Basic arrow shot. 100% damage, 20m range.',
    isPassive: false
  },
  {
    id: 'skill_arrow_2',
    masteryId: 'mastery_pacheon',
    name: 'Arrow Series - Lv2',
    type: 'active',
    level: 2,
    element: 'physical',
    baseDamage: 125,
    mpCost: 11,
    castTime: 500,
    cooldown: 0,
    range: 22.0,
    requiredLevel: 5,
    requiredMasteryLevel: 3,
    description: 'Improved arrow shot. 125% damage, 22m range.',
    isPassive: false
  },

  // Anti-Arrow Series (Defense)
  {
    id: 'skill_anti_arrow_1',
    masteryId: 'mastery_pacheon',
    name: 'Anti-Arrow - Lv1',
    type: 'buff',
    level: 1,
    element: 'physical',
    baseDamage: 0,
    mpCost: 40,
    castTime: 0,
    cooldown: 30000,
    range: 0,
    requiredLevel: 15,
    requiredMasteryLevel: 11,
    description: 'Reduces arrow damage received by 30% for 5 minutes.',
    isPassive: false,
    Buff: {
      type: 'defense',
      value: 30,
      duration: 300000,
      stackable: false
    }
  },

  // Explosion Arrow Series (AoE)
  {
    id: 'skill_explosion_arrow_1',
    masteryId: 'mastery_pacheon',
    name: 'Explosion Arrow - Lv1',
    type: 'active',
    level: 1,
    element: 'physical',
    baseDamage: 180,
    mpCost: 50,
    castTime: 2000,
    cooldown: 15000,
    range: 18.0,
    requiredLevel: 20,
    requiredMasteryLevel: 15,
    description: 'Powerful exploding arrow. 180% damage with AoE.',
    isPassive: false
  },

  // Combo Arrow (Fast multiple shots)
  {
    id: 'skill_combo_arrow_1',
    masteryId: 'mastery_pacheon',
    name: 'Combo Arrow - Lv1',
    type: 'active',
    level: 1,
    element: 'physical',
    baseDamage: 80,
    mpCost: 15,
    castTime: 300,
    cooldown: 3000,
    range: 20.0,
    requiredLevel: 25,
    requiredMasteryLevel: 19,
    description: 'Rapid fire 3 arrows. 80% damage each.',
    isPassive: false
  },
];

// ============================================
// CHINESE MASTERY - FIRE FORCE
// ============================================

export const FIRE_SKILLS: GameSkill[] = [
  // Fire Burn Series (DoT)
  {
    id: 'skill_fire_burn_1',
    masteryId: 'mastery_fire',
    name: 'Fire Burn - Lv1',
    type: 'active',
    level: 1,
    element: 'fire',
    baseDamage: 50,
    mpCost: 25,
    castTime: 2000,
    cooldown: 8000,
    range: 15.0,
    requiredLevel: 10,
    requiredMasteryLevel: 7,
    description: 'Burns target for 50 damage + 20 fire DoT over 10 seconds.',
    isPassive: false
  },

  // Fire Trap Series
  {
    id: 'skill_fire_trap_1',
    masteryId: 'mastery_fire',
    name: 'Fire Trap - Lv1',
    type: 'active',
    level: 1,
    element: 'fire',
    baseDamage: 150,
    mpCost: 60,
    castTime: 1500,
    cooldown: 20000,
    range: 5.0,
    requiredLevel: 20,
    requiredMasteryLevel: 15,
    description: 'Place a fire trap that explodes for 150 damage when stepped on.',
    isPassive: false
  },

  // Fire Wall Series (AoE)
  {
    id: 'skill_fire_wall_1',
    masteryId: 'mastery_fire',
    name: 'Fire Wall - Lv1',
    type: 'active',
    level: 1,
    element: 'fire',
    baseDamage: 100,
    mpCost: 80,
    castTime: 3000,
    cooldown: 25000,
    range: 10.0,
    requiredLevel: 30,
    requiredMasteryLevel: 22,
    description: 'Create a wall of fire dealing 100 damage per second for 5 seconds.',
    isPassive: false
  },

  // Fire Buffs
  {
    id: 'skill_fire_weapon_buff',
    masteryId: 'mastery_fire',
    name: 'Fire Force Weapon',
    type: 'buff',
    level: 1,
    element: 'fire',
    baseDamage: 0,
    mpCost: 70,
    castTime: 0,
    cooldown: 60000,
    range: 0,
    requiredLevel: 25,
    requiredMasteryLevel: 19,
    description: 'Adds 15 fire damage to weapon attacks for 10 minutes.',
    isPassive: false,
    Buff: {
      type: 'attack_power',
      value: 15,
      duration: 600000,
      stackable: false
    }
  },
];

// ============================================
// CHINESE MASTERY - COLD FORCE
// ============================================

export const COLD_SKILLS: GameSkill[] = [
  // Frost Wall Series (Defense)
  {
    id: 'skill_frost_wall_1',
    masteryId: 'mastery_cold',
    name: 'Frost Wall - Lv1',
    type: 'active',
    level: 1,
    element: 'cold',
    baseDamage: 0,
    mpCost: 50,
    castTime: 1000,
    cooldown: 30000,
    range: 0,
    requiredLevel: 10,
    requiredMasteryLevel: 7,
    description: 'Creates a barrier absorbing 500 physical damage for 10 seconds.',
    isPassive: false
  },

  // Ice Bolt Series
  {
    id: 'skill_ice_bolt_1',
    masteryId: 'mastery_cold',
    name: 'Ice Bolt - Lv1',
    type: 'active',
    level: 1,
    element: 'cold',
    baseDamage: 120,
    mpCost: 30,
    castTime: 1500,
    cooldown: 5000,
    range: 18.0,
    requiredLevel: 15,
    requiredMasteryLevel: 11,
    description: 'Shoot ice bolt dealing 120 damage and slowing movement by 20% for 5 seconds.',
    isPassive: false
  },

  // Snow Storm Series (AoE)
  {
    id: 'skill_snow_storm_1',
    masteryId: 'mastery_cold',
    name: 'Snow Storm - Lv1',
    type: 'active',
    level: 1,
    element: 'cold',
    baseDamage: 80,
    mpCost: 70,
    castTime: 2500,
    cooldown: 20000,
    range: 12.0,
    requiredLevel: 25,
    requiredMasteryLevel: 19,
    description: 'Creates snowstorm dealing 80 damage per second for 5 seconds in AoE.',
    isPassive: false
  },

  // Freeze Series
  {
    id: 'skill_freeze_1',
    masteryId: 'mastery_cold',
    name: 'Freeze - Lv1',
    type: 'active',
    level: 1,
    element: 'cold',
    baseDamage: 200,
    mpCost: 100,
    castTime: 2000,
    cooldown: 30000,
    range: 15.0,
    requiredLevel: 35,
    requiredMasteryLevel: 27,
    description: 'Freezes target for 5 seconds. Deals 200 damage on break.',
    isPassive: false
  },

  // Cold Armor Buff
  {
    id: 'skill_cold_armor',
    masteryId: 'mastery_cold',
    name: 'Cold Armor',
    type: 'buff',
    level: 1,
    element: 'cold',
    baseDamage: 0,
    mpCost: 60,
    castTime: 0,
    cooldown: 60000,
    range: 0,
    requiredLevel: 20,
    requiredMasteryLevel: 15,
    description: 'Increases magical defense by 25% for 10 minutes.',
    isPassive: false,
    Buff: {
      type: 'defense',
      value: 25,
      duration: 600000,
      stackable: false
    }
  },
];

// ============================================
// CHINESE MASTERY - LIGHTNING FORCE
// ============================================

export const LIGHTNING_SKILLS: GameSkill[] = [
  // Lightning Series
  {
    id: 'skill_lightning_1',
    masteryId: 'mastery_lightning',
    name: 'Lightning - Lv1',
    type: 'active',
    level: 1,
    element: 'lightning',
    baseDamage: 130,
    mpCost: 35,
    castTime: 1000,
    cooldown: 4000,
    range: 16.0,
    requiredLevel: 10,
    requiredMasteryLevel: 7,
    description: 'Cast lightning bolt dealing 130 damage.',
    isPassive: false
  },

  // Thunder Series (High damage)
  {
    id: 'skill_thunder_1',
    masteryId: 'mastery_lightning',
    name: 'Thunder - Lv1',
    type: 'active',
    level: 1,
    element: 'lightning',
    baseDamage: 250,
    mpCost: 80,
    castTime: 2500,
    cooldown: 15000,
    range: 14.0,
    requiredLevel: 25,
    requiredMasteryLevel: 19,
    description: 'Powerful thunder strike dealing 250 damage.',
    isPassive: false
  },

  // Wind Walk Series (Speed buff)
  {
    id: 'skill_wind_walk_1',
    masteryId: 'mastery_lightning',
    name: 'Wind Walk - Lv1',
    type: 'buff',
    level: 1,
    element: 'lightning',
    baseDamage: 0,
    mpCost: 55,
    castTime: 0,
    cooldown: 60000,
    range: 0,
    requiredLevel: 15,
    requiredMasteryLevel: 11,
    description: 'Increases movement speed by 20% for 10 minutes.',
    isPassive: false,
    Buff: {
      type: 'move_speed',
      value: 20,
      duration: 600000,
      stackable: false
    }
  },

  // Lightning Storm (AoE)
  {
    id: 'skill_lightning_storm_1',
    masteryId: 'mastery_lightning',
    name: 'Lightning Storm - Lv1',
    type: 'active',
    level: 1,
    element: 'lightning',
    baseDamage: 150,
    mpCost: 100,
    castTime: 3000,
    cooldown: 30000,
    range: 15.0,
    requiredLevel: 40,
    requiredMasteryLevel: 30,
    description: 'Summons lightning storm dealing 150 damage per second for 5 seconds.',
    isPassive: false
  },

  // Paralyze Series
  {
    id: 'skill_paralyze_1',
    masteryId: 'mastery_lightning',
    name: 'Paralyze - Lv1',
    type: 'active',
    level: 1,
    element: 'lightning',
    baseDamage: 100,
    mpCost: 90,
    castTime: 2000,
    cooldown: 25000,
    range: 18.0,
    requiredLevel: 30,
    requiredMasteryLevel: 22,
    description: 'Paralyzes target for 3 seconds. 100 damage.',
    isPassive: false
  },
];

// ============================================
// CHINESE MASTERY - FORCE FORCE (Healing/Buffs)
// ============================================

export const FORCE_SKILLS: GameSkill[] = [
  // Heal Series
  {
    id: 'skill_heal_1',
    masteryId: 'mastery_force',
    name: 'Heal - Lv1',
    type: 'active',
    level: 1,
    element: 'force',
    baseDamage: 0,
    mpCost: 40,
    castTime: 2000,
    cooldown: 5000,
    range: 15.0,
    requiredLevel: 5,
    requiredMasteryLevel: 3,
    description: 'Restores 200 HP to target.',
    isPassive: false
  },
  {
    id: 'skill_heal_2',
    masteryId: 'mastery_force',
    name: 'Heal - Lv2',
    type: 'active',
    level: 2,
    element: 'force',
    baseDamage: 0,
    mpCost: 60,
    castTime: 2000,
    cooldown: 5000,
    range: 15.0,
    requiredLevel: 15,
    requiredMasteryLevel: 11,
    description: 'Restores 400 HP to target.',
    isPassive: false
  },

  // Mana Cycle Series
  {
    id: 'skill_mana_cycle_1',
    masteryId: 'mastery_force',
    name: 'Mana Cycle - Lv1',
    type: 'active',
    level: 1,
    element: 'force',
    baseDamage: 0,
    mpCost: 50,
    castTime: 2500,
    cooldown: 10000,
    range: 0,
    requiredLevel: 10,
    requiredMasteryLevel: 7,
    description: 'Converts 200 HP to 400 MP.',
    isPassive: false
  },

  // Resurrection Series
  {
    id: 'skill_resurrection_1',
    masteryId: 'mastery_force',
    name: 'Resurrection - Lv1',
    type: 'active',
    level: 1,
    element: 'force',
    baseDamage: 0,
    mpCost: 200,
    castTime: 5000,
    cooldown: 300000,
    range: 20.0,
    requiredLevel: 30,
    requiredMasteryLevel: 22,
    description: 'Resurrects dead player with 50% HP/MP.',
    isPassive: false
  },

  // Force Buffs
  {
    id: 'skill_force_buff_hp',
    masteryId: 'mastery_force',
    name: 'Blessing Spell',
    type: 'buff',
    level: 1,
    element: 'force',
    baseDamage: 0,
    mpCost: 80,
    castTime: 0,
    cooldown: 60000,
    range: 0,
    requiredLevel: 20,
    requiredMasteryLevel: 15,
    description: 'Increases max HP by 500 for 10 minutes.',
    isPassive: false,
    Buff: {
      type: 'hp',
      value: 500,
      duration: 600000,
      stackable: false
    }
  },
  {
    id: 'skill_force_buff_str',
    masteryId: 'mastery_force',
    name: 'Strength Blessing',
    type: 'buff',
    level: 1,
    element: 'force',
    baseDamage: 0,
    mpCost: 70,
    castTime: 0,
    cooldown: 60000,
    range: 0,
    requiredLevel: 25,
    requiredMasteryLevel: 19,
    description: 'Increases STR by 10 for 10 minutes.',
    isPassive: false,
    Buff: {
      type: 'str',
      value: 10,
      duration: 600000,
      stackable: false
    }
  },
];

// ============================================
// ALL SKILLS COMBINED
// ============================================

export const ALL_SKILLS: GameSkill[] = [
  ...BICHEON_SKILLS,
  ...HEUKSAL_SKILLS,
  ...PACHEON_SKILLS,
  ...FIRE_SKILLS,
  ...COLD_SKILLS,
  ...LIGHTNING_SKILLS,
  ...FORCE_SKILLS,
];

// ============================================
// HELPER FUNCTIONS
// ============================================

export function getSkillsByMastery(masteryId: string): GameSkill[] {
  return ALL_SKILLS.filter(skill => skill.masteryId === masteryId);
}

export function getSkillsByType(type: SkillType): GameSkill[] {
  return ALL_SKILLS.filter(skill => skill.type === type);
}

export function getSkillsByElement(element: Element): GameSkill[] {
  return ALL_SKILLS.filter(skill => skill.element === element);
}

export function getSkillsByLevel(minLevel: number, maxLevel: number): GameSkill[] {
  return ALL_SKILLS.filter(skill =>
    skill.requiredLevel >= minLevel && skill.requiredLevel <= maxLevel
  );
}

export function getSkillById(id: string): GameSkill | undefined {
  return ALL_SKILLS.find(skill => skill.id === id);
}

export function getPassiveSkills(): GameSkill[] {
  return ALL_SKILLS.filter(skill => skill.isPassive);
}

export function getActiveSkills(): GameSkill[] {
  return ALL_SKILLS.filter(skill => !skill.isPassive);
}
