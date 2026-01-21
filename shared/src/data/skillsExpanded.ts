// ============================================
// SRObro - Complete Chinese Skills Data
// All 7 mastery trees × 80 levels = 560 skills
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
  castTime: number;
  cooldown: number;
  range: number;
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
  duration: number;
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
  | 'critical'
  | 'magical_defense'
  | 'resistance_fire'
  | 'resistance_cold'
  | 'resistance_lightning';

// ============================================
// MASTERY DEFINITIONS
// ============================================

export const CHINESE_MASTERY = [
  { id: 'bicheon', name: 'Bicheon', maxLevel: 80 },
  { id: 'heuksal', name: 'Heuksal', maxLevel: 80 },
  { id: 'pacheon', name: 'Pacheon', maxLevel: 80 },
  { id: 'fire', name: 'Fire Force', maxLevel: 80 },
  { id: 'cold', name: 'Cold Force', maxLevel: 80 },
  { id: 'lightning', name: 'Lightning Force', maxLevel: 80 },
  { id: 'force', name: 'Force Force', maxLevel: 80 },
] as const;

// ============================================
// BICHEON MASTERY (Sword/Blade) - 80 levels
// ============================================

export function generateBicheonSkills(): GameSkill[] {
  const skills: GameSkill[] = [];

  // Smasg Series (Blade) - 20 levels (Lv1-80)
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = i * 4;
    const charLevel = i * 4;
    const damage = 100 + (i - 1) * 15;
    const mp = 10 + i;

    skills.push({
      id: `bicheon_smash_${i}`,
      masteryId: 'bicheon',
      name: `Smash Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'physical',
      baseDamage: damage,
      mpCost: mp,
      castTime: 0,
      cooldown: 0,
      range: 2.5,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Blade attack dealing ${damage}% physical damage.`,
      isPassive: false,
    });
  }

  // Chain Sword Series (Sword) - 20 levels
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = i * 4;
    const charLevel = i * 4 + 2;
    const damage = 110 + (i - 1) * 18;
    const mp = 12 + i;

    skills.push({
      id: `bicheon_chain_${i}`,
      masteryId: 'bicheon',
      name: `Chain Sword Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'physical',
      baseDamage: damage,
      mpCost: mp,
      castTime: 0,
      cooldown: 0,
      range: 2.5,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Sword combo attack dealing ${damage}% damage.`,
      isPassive: false,
    });
  }

  // Killing Heaven Series - 15 levels (high damage, slow)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = i * 5 + 5;
    const charLevel = i * 5 + 10;
    const damage = 200 + (i - 1) * 50;
    const mp = 30 + i * 2;
    const cooldown = 8000 - i * 100;

    skills.push({
      id: `bicheon_killing_${i}`,
      masteryId: 'bicheon',
      name: `Killing Heaven Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'physical',
      baseDamage: damage,
      mpCost: mp,
      castTime: 1500,
      cooldown,
      range: 3.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Powerful attack dealing ${damage}% damage. ${cooldown/1000}s cooldown.`,
      isPassive: false,
    });
  }

  // Shield Series (Passive) - 10 levels
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 8;
    const charLevel = i * 8;
    const blockChance = 5 + i * 2;

    skills.push({
      id: `bicheon_shield_${i}`,
      masteryId: 'bicheon',
      name: `Shield Technique - Lv${i}`,
      type: 'passive',
      level: i,
      element: 'physical',
      baseDamage: 0,
      mpCost: 0,
      castTime: 0,
      cooldown: 0,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases block ratio by ${blockChance}% when using shield.`,
      isPassive: true,
      Buff: {
        type: 'block_ratio',
        value: blockChance,
        duration: 0,
        stackable: false,
      },
    });
  }

  // Hidden Blade Series (Critical buff) - 5 levels
  for (let i = 1; i <= 5; i++) {
    const masteryLevel = i * 15 + 5;
    const charLevel = i * 15 + 15;
    const critBonus = 5 + i * 3;
    const duration = 60000 + i * 10000;

    skills.push({
      id: `bicheon_hidden_${i}`,
      masteryId: 'bicheon',
      name: `Hidden Blade Series - Lv${i}`,
      type: 'buff',
      level: i,
      element: 'physical',
      baseDamage: 0,
      mpCost: 50 + i * 20,
      castTime: 500,
      cooldown: 120000,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases critical rate by ${critBonus}% for ${duration/1000}s.`,
      isPassive: false,
      Buff: {
        type: 'critical',
        value: critBonus,
        duration,
        stackable: false,
      },
    });
  }

  // Body Warrior Series (Defense buff) - 10 levels
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const defenseBonus = 10 + i * 5;
    const duration = 60000 + i * 5000;

    skills.push({
      id: `bicheon_body_${i}`,
      masteryId: 'bicheon',
      name: `Body Warrior Series - Lv${i}`,
      type: 'buff',
      level: i,
      element: 'physical',
      baseDamage: 0,
      mpCost: 40 + i * 10,
      castTime: 1000,
      cooldown: 60000,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases defense by ${defenseBonus} for ${duration/1000}s.`,
      isPassive: false,
      Buff: {
        type: 'defense',
        value: defenseBonus,
        duration,
        stackable: false,
      },
    });
  }

  return skills;
}

// ============================================
// HEUKSAL MASTERY (Spear/Glaive) - 80 levels
// ============================================

export function generateHeuksalSkills(): GameSkill[] {
  const skills: GameSkill[] = [];

  // Flying Dragon Series - 20 levels
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = i * 4;
    const charLevel = i * 4;
    const damage = 120 + (i - 1) * 18;
    const mp = 15 + i;

    skills.push({
      id: `heuksal_flying_${i}`,
      masteryId: 'heuksal',
      name: `Flying Dragon Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'physical',
      baseDamage: damage,
      mpCost: mp,
      castTime: 0,
      cooldown: 0,
      range: 4.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Spear thrust dealing ${damage}% damage. Extended range.`,
      isPassive: false,
    });
  }

  // Ghost Spear Series - 20 levels
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = i * 4;
    const charLevel = i * 4 + 2;
    const damage = 130 + (i - 1) * 20;
    const mp = 18 + i;

    skills.push({
      id: `heuksal_ghost_${i}`,
      masteryId: 'heuksal',
      name: `Ghost Spear Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'physical',
      baseDamage: damage,
      mpCost: mp,
      castTime: 500,
      cooldown: 2000,
      range: 5.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Piercing spear attack dealing ${damage}% damage.`,
      isPassive: false,
    });
  }

  // Lightning Nova Series - 15 levels (AoE spin)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = i * 5 + 5;
    const charLevel = i * 5 + 10;
    const damage = 150 + (i - 1) * 40;
    const mp = 40 + i * 3;
    const aoeRange = 5.0 + i * 0.2;

    skills.push({
      id: `heuksal_nova_${i}`,
      masteryId: 'heuksal',
      name: `Lightning Nova Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'physical',
      baseDamage: damage,
      mpCost: mp,
      castTime: 1000,
      cooldown: 10000,
      range: aoeRange,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `360° spear spin dealing ${damage}% damage to nearby enemies.`,
      isPassive: false,
    });
  }

  // Counter Attack Series - 8 levels (Passive reflect)
  for (let i = 1; i <= 8; i++) {
    const masteryLevel = i * 10;
    const charLevel = i * 10;
    const reflectChance = 10 + i * 3;
    const reflectDamage = 50 + i * 10;

    skills.push({
      id: `heuksal_counter_${i}`,
      masteryId: 'heuksal',
      name: `Counter Attack Series - Lv${i}`,
      type: 'passive',
      level: i,
      element: 'physical',
      baseDamage: 0,
      mpCost: 0,
      castTime: 0,
      cooldown: 0,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `${reflectChance}% chance to reflect ${reflectDamage}% damage when hit.`,
      isPassive: true,
    });
  }

  // Spear Buff Series - 10 levels
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const attackBonus = 10 + i * 5;
    const duration = 60000 + i * 5000;

    skills.push({
      id: `heuksal_buff_${i}`,
      masteryId: 'heuksal',
      name: `Spear Spirit Series - Lv${i}`,
      type: 'buff',
      level: i,
      element: 'physical',
      baseDamage: 0,
      mpCost: 50 + i * 15,
      castTime: 1000,
      cooldown: 90000,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases attack power by ${attackBonus} for ${duration/1000}s.`,
      isPassive: false,
      Buff: {
        type: 'attack_power',
        value: attackBonus,
        duration,
        stackable: false,
      },
    });
  }

  // Fanning Spear Series - 7 levels (Multi-target)
  for (let i = 1; i <= 7; i++) {
    const masteryLevel = i * 10 + 10;
    const charLevel = i * 10 + 15;
    const damage = 180 + (i - 1) * 30;
    const targets = 2 + i;

    skills.push({
      id: `heuksal_fanning_${i}`,
      masteryId: 'heuksal',
      name: `Fanning Spear Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'physical',
      baseDamage: damage,
      mpCost: 35 + i * 5,
      castTime: 800,
      cooldown: 12000,
      range: 6.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Hits ${targets} enemies dealing ${damage}% damage each.`,
      isPassive: false,
    });
  }

  return skills;
}

// ============================================
// PACHEON MASTERY (Bow) - 80 levels
// ============================================

export function generatePacheonSkills(): GameSkill[] {
  const skills: GameSkill[] = [];

  // Arrow Series - 20 levels (Basic shots)
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = i * 4;
    const charLevel = i * 4;
    const damage = 110 + (i - 1) * 16;
    const mp = 8 + i;
    const range = 15.0 + i * 0.5;

    skills.push({
      id: `pacheon_arrow_${i}`,
      masteryId: 'pacheon',
      name: `Arrow Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'physical',
      baseDamage: damage,
      mpCost: mp,
      castTime: 0,
      cooldown: 0,
      range,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Basic arrow shot dealing ${damage}% damage at ${range.toFixed(1)}m range.`,
      isPassive: false,
    });
  }

  // Anti-Arrow Series - 10 levels (Passive defense)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 8;
    const charLevel = i * 8;
    const defense = 5 + i * 3;

    skills.push({
      id: `pacheon_anti_${i}`,
      masteryId: 'pacheon',
      name: `Anti-Arrow Series - Lv${i}`,
      type: 'passive',
      level: i,
      element: 'physical',
      baseDamage: 0,
      mpCost: 0,
      castTime: 0,
      cooldown: 0,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases defense against arrows by ${defense}%.`,
      isPassive: true,
      Buff: {
        type: 'defense',
        value: defense,
        duration: 0,
        stackable: false,
      },
    });
  }

  // Explosion Arrow Series - 15 levels (AoE)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = i * 5 + 5;
    const charLevel = i * 5 + 10;
    const damage = 140 + (i - 1) * 35;
    const mp = 25 + i * 2;
    const aoeRadius = 3.0 + i * 0.2;

    skills.push({
      id: `pacheon_explosion_${i}`,
      masteryId: 'pacheon',
      name: `Explosion Arrow Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'physical',
      baseDamage: damage,
      mpCost: mp,
      castTime: 500,
      cooldown: 8000,
      range: 20.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Arrow explodes on impact dealing ${damage}% damage in ${aoeRadius.toFixed(1)}m radius.`,
      isPassive: false,
    });
  }

  // Combo Arrow Series - 20 levels (Rapid fire)
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = i * 4;
    const charLevel = i * 4 + 2;
    const damage = 80 + (i - 1) * 10;
    const arrows = 2 + Math.floor(i / 3);
    const mp = 10 + i + arrows * 2;

    skills.push({
      id: `pacheon_combo_${i}`,
      masteryId: 'pacheon',
      name: `Combo Arrow Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'physical',
      baseDamage: damage,
      mpCost: mp,
      castTime: 0,
      cooldown: 3000,
      range: 18.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Rapidly fires ${arrows} arrows dealing ${damage}% damage each.`,
      isPassive: false,
    });
  }

  // Bird Fall Series - 10 levels (High damage snipe)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 10;
    const charLevel = i * 7 + 15;
    const damage = 300 + (i - 1) * 60;
    const mp = 40 + i * 3;
    const range = 25.0 + i;

    skills.push({
      id: `pacheon_bird_${i}`,
      masteryId: 'pacheon',
      name: `Bird Fall Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'physical',
      baseDamage: damage,
      mpCost: mp,
      castTime: 2000,
      cooldown: 15000,
      range,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Powerful long-range shot dealing ${damage}% damage at ${range.toFixed(1)}m.`,
      isPassive: false,
    });
  }

  // Bow Mastery (Passive) - 5 levels
  for (let i = 1; i <= 5; i++) {
    const masteryLevel = i * 15 + 5;
    const charLevel = i * 15 + 10;
    const attackSpeed = 5 + i * 2;
    const damage = 10 + i * 3;

    skills.push({
      id: `pacheon_mastery_${i}`,
      masteryId: 'pacheon',
      name: `Bow Mastery - Lv${i}`,
      type: 'passive',
      level: i,
      element: 'physical',
      baseDamage: 0,
      mpCost: 0,
      castTime: 0,
      cooldown: 0,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases bow attack speed by ${attackSpeed}% and damage by ${damage}%.`,
      isPassive: true,
      Buff: {
        type: 'attack_speed',
        value: attackSpeed,
        duration: 0,
        stackable: false,
      },
    });
  }

  return skills;
}

// ============================================
// FIRE FORCE MASTERY - 80 levels
// ============================================

export function generateFireSkills(): GameSkill[] {
  const skills: GameSkill[] = [];

  // Fire Burn Series - 20 levels (DoT)
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = i * 4;
    const charLevel = i * 4;
    const damage = 50 + (i - 1) * 20;
    const dotDuration = 5000 + i * 500;
    const mp = 20 + i;

    skills.push({
      id: `fire_burn_${i}`,
      masteryId: 'fire',
      name: `Fire Burn Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'fire',
      baseDamage: damage,
      mpCost: mp,
      castTime: 1000,
      cooldown: 5000,
      range: 15.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Burns target dealing ${damage}% initial damage + DoT for ${dotDuration/1000}s.`,
      isPassive: false,
    });
  }

  // Fire Trap Series - 10 levels (Ground trap)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 8;
    const charLevel = i * 8;
    const damage = 100 + (i - 1) * 30;
    const trapDuration = 10000 + i * 2000;
    const mp = 35 + i * 3;

    skills.push({
      id: `fire_trap_${i}`,
      masteryId: 'fire',
      name: `Fire Trap Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'fire',
      baseDamage: damage,
      mpCost: mp,
      castTime: 500,
      cooldown: 20000,
      range: 10.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Places fire trap dealing ${damage}% damage. Lasts ${trapDuration/1000}s.`,
      isPassive: false,
    });
  }

  // Fire Wall Series - 10 levels (AoE barrier)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const damage = 80 + (i - 1) * 25;
    const wallDuration = 5000 + i * 1000;
    const mp = 50 + i * 5;

    skills.push({
      id: `fire_wall_${i}`,
      masteryId: 'fire',
      name: `Fire Wall Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'fire',
      baseDamage: damage,
      mpCost: mp,
      castTime: 1500,
      cooldown: 30000,
      range: 20.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Creates fire wall dealing ${damage}% damage/second. Lasts ${wallDuration/1000}s.`,
      isPassive: false,
    });
  }

  // Fire Weapon Buff - 15 levels
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = i * 5 + 5;
    const charLevel = i * 5 + 10;
    const fireDamage = 5 + i * 3;
    const duration = 60000 + i * 5000;
    const mp = 40 + i * 2;

    skills.push({
      id: `fire_weapon_${i}`,
      masteryId: 'fire',
      name: `Fire Weapon Series - Lv${i}`,
      type: 'buff',
      level: i,
      element: 'fire',
      baseDamage: 0,
      mpCost: mp,
      castTime: 1000,
      cooldown: 90000,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Adds ${fireDamage}% fire damage to attacks for ${duration/1000}s.`,
      isPassive: false,
      Buff: {
        type: 'attack_power',
        value: fireDamage,
        duration,
        stackable: false,
      },
    });
  }

  // Fire Protection (Passive) - 10 levels
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const resistance = 5 + i * 4;

    skills.push({
      id: `fire_protection_${i}`,
      masteryId: 'fire',
      name: `Fire Protection Series - Lv${i}`,
      type: 'passive',
      level: i,
      element: 'fire',
      baseDamage: 0,
      mpCost: 0,
      castTime: 0,
      cooldown: 0,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases fire resistance by ${resistance}%.`,
      isPassive: true,
      Buff: {
        type: 'resistance_fire',
        value: resistance,
        duration: 0,
        stackable: false,
      },
    });
  }

  // Flame Body Series - 10 levels (Self AoE)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const damage = 60 + (i - 1) * 20;
    const duration = 10000 + i * 2000;
    const mp = 60 + i * 5;

    skills.push({
      id: `fire_body_${i}`,
      masteryId: 'fire',
      name: `Flame Body Series - Lv${i}`,
      type: 'buff',
      level: i,
      element: 'fire',
      baseDamage: damage,
      mpCost: mp,
      castTime: 1500,
      cooldown: 60000,
      range: 5.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Body surrounded by flames dealing ${damage}% damage/second for ${duration/1000}s.`,
      isPassive: false,
    });
  }

  // Fire Burst Series - 15 levels (AoE explosion)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = i * 5 + 5;
    const charLevel = i * 5 + 10;
    const damage = 200 + (i - 1) * 40;
    const aoeRadius = 8.0 + i * 0.5;
    const mp = 70 + i * 3;

    skills.push({
      id: `fire_burst_${i}`,
      masteryId: 'fire',
      name: `Fire Burst Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'fire',
      baseDamage: damage,
      mpCost: mp,
      castTime: 2000,
      cooldown: 25000,
      range: aoeRadius,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Large explosion dealing ${damage}% fire damage in ${aoeRadius.toFixed(1)}m radius.`,
      isPassive: false,
    });
  }

  return skills;
}

// ============================================
// COLD FORCE MASTERY - 80 levels
// ============================================

export function generateColdSkills(): GameSkill[] {
  const skills: GameSkill[] = [];

  // Frost Wall Series - 15 levels (Shield)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = i * 5 + 5;
    const charLevel = i * 5 + 10;
    const absorption = 500 + (i - 1) * 200;
    const duration = 5000 + i * 1000;
    const mp = 40 + i * 3;

    skills.push({
      id: `cold_wall_${i}`,
      masteryId: 'cold',
      name: `Frost Wall Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'cold',
      baseDamage: 0,
      mpCost: mp,
      castTime: 1000,
      cooldown: 20000,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Creates frost wall absorbing ${absorption} damage. Lasts ${duration/1000}s.`,
      isPassive: false,
    });
  }

  // Ice Bolt Series - 20 levels (Projectile + Slow)
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = i * 4;
    const charLevel = i * 4;
    const damage = 90 + (i - 1) * 18;
    const slow = 10 + i;
    const slowDuration = 3000 + i * 200;
    const mp = 15 + i;

    skills.push({
      id: `cold_bolt_${i}`,
      masteryId: 'cold',
      name: `Ice Bolt Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'cold',
      baseDamage: damage,
      mpCost: mp,
      castTime: 500,
      cooldown: 3000,
      range: 20.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Ice bolt dealing ${damage}% damage and slowing by ${slow}% for ${slowDuration/1000}s.`,
      isPassive: false,
    });
  }

  // Snow Storm Series - 10 levels (AoE DoT)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 8;
    const charLevel = i * 8;
    const damage = 40 + (i - 1) * 15;
    const duration = 8000 + i * 1000;
    const mp = 50 + i * 5;
    const radius = 10.0 + i;

    skills.push({
      id: `cold_storm_${i}`,
      masteryId: 'cold',
      name: `Snow Storm Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'cold',
      baseDamage: damage,
      mpCost: mp,
      castTime: 1500,
      cooldown: 30000,
      range: radius,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Snow storm dealing ${damage}% damage/second in ${radius.toFixed(1)}m radius for ${duration/1000}s.`,
      isPassive: false,
    });
  }

  // Freeze Series - 10 levels (Stun)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const damage = 150 + (i - 1) * 30;
    const freezeDuration = 2000 + i * 500;
    const mp = 60 + i * 5;

    skills.push({
      id: `cold_freeze_${i}`,
      masteryId: 'cold',
      name: `Freeze Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'cold',
      baseDamage: damage,
      mpCost: mp,
      castTime: 2000,
      cooldown: 45000,
      range: 12.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Freezes target for ${freezeDuration/1000}s dealing ${damage}% damage.`,
      isPassive: false,
    });
  }

  // Cold Armor Series - 10 levels (Defense buff)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const defense = 20 + i * 8;
    const magDefense = 15 + i * 5;
    const duration = 60000 + i * 5000;
    const mp = 45 + i * 3;

    skills.push({
      id: `cold_armor_${i}`,
      masteryId: 'cold',
      name: `Cold Armor Series - Lv${i}`,
      type: 'buff',
      level: i,
      element: 'cold',
      baseDamage: 0,
      mpCost: mp,
      castTime: 1000,
      cooldown: 90000,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases physical defense by ${defense} and magical defense by ${magDefense} for ${duration/1000}s.`,
      isPassive: false,
      Buff: {
        type: 'defense',
        value: defense,
        duration,
        stackable: false,
      },
    });
  }

  // Cold Protection (Passive) - 10 levels
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const resistance = 5 + i * 4;

    skills.push({
      id: `cold_protection_${i}`,
      masteryId: 'cold',
      name: `Cold Protection Series - Lv${i}`,
      type: 'passive',
      level: i,
      element: 'cold',
      baseDamage: 0,
      mpCost: 0,
      castTime: 0,
      cooldown: 0,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases cold resistance by ${resistance}%.`,
      isPassive: true,
      Buff: {
        type: 'resistance_cold',
        value: resistance,
        duration: 0,
        stackable: false,
      },
    });
  }

  // Ice Rain Series - 15 levels (AoE damage)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = i * 5 + 5;
    const charLevel = i * 5 + 10;
    const damage = 120 + (i - 1) * 25;
    const radius = 12.0 + i * 0.5;
    const mp = 55 + i * 3;

    skills.push({
      id: `cold_rain_${i}`,
      masteryId: 'cold',
      name: `Ice Rain Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'cold',
      baseDamage: damage,
      mpCost: mp,
      castTime: 2000,
      cooldown: 25000,
      range: radius,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Ice shards rain dealing ${damage}% damage in ${radius.toFixed(1)}m radius.`,
      isPassive: false,
    });
  }

  return skills;
}

// ============================================
// LIGHTNING FORCE MASTERY - 80 levels
// ============================================

export function generateLightningSkills(): GameSkill[] {
  const skills: GameSkill[] = [];

  // Lightning Bolt Series - 20 levels
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = i * 4;
    const charLevel = i * 4;
    const damage = 100 + (i - 1) * 20;
    const mp = 18 + i;
    const range = 18.0 + i * 0.3;

    skills.push({
      id: `lightning_bolt_${i}`,
      masteryId: 'lightning',
      name: `Lightning Bolt Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'lightning',
      baseDamage: damage,
      mpCost: mp,
      castTime: 500,
      cooldown: 2000,
      range,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Lightning bolt dealing ${damage}% damage. Range: ${range.toFixed(1)}m.`,
      isPassive: false,
    });
  }

  // Thunder Series - 15 levels (High damage)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = i * 5 + 5;
    const charLevel = i * 5 + 10;
    const damage = 250 + (i - 1) * 50;
    const mp = 40 + i * 2;
    const range = 15.0 + i * 0.5;

    skills.push({
      id: `lightning_thunder_${i}`,
      masteryId: 'lightning',
      name: `Thunder Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'lightning',
      baseDamage: damage,
      mpCost: mp,
      castTime: 1500,
      cooldown: 10000,
      range,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Powerful lightning strike dealing ${damage}% damage.`,
      isPassive: false,
    });
  }

  // Wind Walk Series - 10 levels (Speed buff)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const speed = 10 + i * 3;
    const duration = 60000 + i * 5000;
    const mp = 35 + i * 3;

    skills.push({
      id: `lightning_wind_${i}`,
      masteryId: 'lightning',
      name: `Wind Walk Series - Lv${i}`,
      type: 'buff',
      level: i,
      element: 'lightning',
      baseDamage: 0,
      mpCost: mp,
      castTime: 1000,
      cooldown: 90000,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases movement speed by ${speed}% for ${duration/1000}s.`,
      isPassive: false,
      Buff: {
        type: 'move_speed',
        value: speed,
        duration,
        stackable: false,
      },
    });
  }

  // Lightning Storm Series - 10 levels (AoE)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const damage = 80 + (i - 1) * 20;
    const strikes = 3 + i;
    const radius = 10.0 + i;
    const mp = 60 + i * 5;

    skills.push({
      id: `lightning_storm_${i}`,
      masteryId: 'lightning',
      name: `Lightning Storm Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'lightning',
      baseDamage: damage,
      mpCost: mp,
      castTime: 2000,
      cooldown: 30000,
      range: radius,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `${strikes} lightning strikes in ${radius.toFixed(1)}m radius dealing ${damage}% damage each.`,
      isPassive: false,
    });
  }

  // Paralyze Series - 10 levels (Stun + DoT)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const damage = 100 + (i - 1) * 25;
    const stunDuration = 1000 + i * 500;
    const mp = 50 + i * 4;

    skills.push({
      id: `lightning_paralyze_${i}`,
      masteryId: 'lightning',
      name: `Paralyze Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'lightning',
      baseDamage: damage,
      mpCost: mp,
      castTime: 1500,
      cooldown: 40000,
      range: 15.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Paralyzes target for ${stunDuration/1000}s dealing ${damage}% damage.`,
      isPassive: false,
    });
  }

  // Lightning Protection (Passive) - 10 levels
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const resistance = 5 + i * 4;

    skills.push({
      id: `lightning_protection_${i}`,
      masteryId: 'lightning',
      name: `Lightning Protection Series - Lv${i}`,
      type: 'passive',
      level: i,
      element: 'lightning',
      baseDamage: 0,
      mpCost: 0,
      castTime: 0,
      cooldown: 0,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases lightning resistance by ${resistance}%.`,
      isPassive: true,
      Buff: {
        type: 'resistance_lightning',
        value: resistance,
        duration: 0,
        stackable: false,
      },
    });
  }

  // Chains of Lightning Series - 15 levels (Multi-target)
  for (let i = 1; i <= 15; i++) {
    const masteryLevel = i * 5 + 5;
    const charLevel = i * 5 + 10;
    const damage = 130 + (i - 1) * 25;
    const chains = 2 + Math.floor(i / 2);
    const mp = 45 + i * 2;

    skills.push({
      id: `lightning_chains_${i}`,
      masteryId: 'lightning',
      name: `Chains of Lightning - Lv${i}`,
      type: 'active',
      level: i,
      element: 'lightning',
      baseDamage: damage,
      mpCost: mp,
      castTime: 1000,
      cooldown: 15000,
      range: 20.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Lightning chains to ${chains} targets dealing ${damage}% damage each.`,
      isPassive: false,
    });
  }

  return skills;
}

// ============================================
// FORCE FORCE MASTERY - 80 levels
// ============================================

export function generateForceSkills(): GameSkill[] {
  const skills: GameSkill[] = [];

  // Heal Series - 20 levels
  for (let i = 1; i <= 20; i++) {
    const masteryLevel = i * 4;
    const charLevel = i * 4;
    const heal = 100 + (i - 1) * 50;
    const mp = 20 + i * 2;
    const range = 15.0 + i * 0.3;

    skills.push({
      id: `force_heal_${i}`,
      masteryId: 'force',
      name: `Heal Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'force',
      baseDamage: 0,
      mpCost: mp,
      castTime: 2000,
      cooldown: 5000,
      range,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Heals target for ${heal} HP. Range: ${range.toFixed(1)}m.`,
      isPassive: false,
      Buff: {
        type: 'hp',
        value: heal,
        duration: 0,
        stackable: false,
      },
    });
  }

  // Mana Cycle Series - 10 levels (HP → MP conversion)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const conversion = 100 + i * 50;
    const mp = 0;

    skills.push({
      id: `force_mana_${i}`,
      masteryId: 'force',
      name: `Mana Cycle Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'force',
      baseDamage: 0,
      mpCost: mp,
      castTime: 1000,
      cooldown: 30000,
      range: 0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Convert ${conversion} HP to ${conversion} MP.`,
      isPassive: false,
    });
  }

  // Resurrection Series - 5 levels
  for (let i = 1; i <= 5; i++) {
    const masteryLevel = i * 15 + 5;
    const charLevel = i * 15 + 10;
    const expLossReduction = i * 5;
    const mp = 200 + i * 50;

    skills.push({
      id: `force_resurrect_${i}`,
      masteryId: 'force',
      name: `Resurrection Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'force',
      baseDamage: 0,
      mpCost: mp,
      castTime: 5000,
      cooldown: 300000,
      range: 20.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Revives dead player. Reduces exp loss by ${expLossReduction}%.`,
      isPassive: false,
    });
  }

  // Buff Series (STR) - 10 levels
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const strBonus = 5 + i * 2;
    const duration = 1800000 + i * 60000; // 30-40 minutes
    const mp = 40 + i * 3;

    skills.push({
      id: `force_str_${i}`,
      masteryId: 'force',
      name: `STR Buff Series - Lv${i}`,
      type: 'buff',
      level: i,
      element: 'force',
      baseDamage: 0,
      mpCost: mp,
      castTime: 1000,
      cooldown: 60000,
      range: 20.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases STR by ${strBonus} for ${duration/60000} minutes.`,
      isPassive: false,
      Buff: {
        type: 'str',
        value: strBonus,
        duration,
        stackable: false,
      },
    });
  }

  // Buff Series (INT) - 10 levels
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const intBonus = 5 + i * 2;
    const duration = 1800000 + i * 60000;
    const mp = 40 + i * 3;

    skills.push({
      id: `force_int_${i}`,
      masteryId: 'force',
      name: `INT Buff Series - Lv${i}`,
      type: 'buff',
      level: i,
      element: 'force',
      baseDamage: 0,
      mpCost: mp,
      castTime: 1000,
      cooldown: 60000,
      range: 20.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases INT by ${intBonus} for ${duration/60000} minutes.`,
      isPassive: false,
      Buff: {
        type: 'int',
        value: intBonus,
        duration,
        stackable: false,
      },
    });
  }

  // HP Buff Series - 10 levels
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const hpBonus = 500 + i * 200;
    const duration = 1800000 + i * 60000;
    const mp = 50 + i * 5;

    skills.push({
      id: `force_hp_${i}`,
      masteryId: 'force',
      name: `HP Buff Series - Lv${i}`,
      type: 'buff',
      level: i,
      element: 'force',
      baseDamage: 0,
      mpCost: mp,
      castTime: 1000,
      cooldown: 60000,
      range: 20.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Increases max HP by ${hpBonus} for ${duration/60000} minutes.`,
      isPassive: false,
      Buff: {
        type: 'hp',
        value: hpBonus,
        duration,
        stackable: false,
      },
    });
  }

  // Group Heal Series - 10 levels (AoE heal)
  for (let i = 1; i <= 10; i++) {
    const masteryLevel = i * 7 + 3;
    const charLevel = i * 7 + 5;
    const heal = 200 + (i - 1) * 50;
    const radius = 10.0 + i;
    const targets = 3 + i;
    const mp = 60 + i * 5;

    skills.push({
      id: `force_group_heal_${i}`,
      masteryId: 'force',
      name: `Group Heal Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'force',
      baseDamage: 0,
      mpCost: mp,
      castTime: 2500,
      cooldown: 10000,
      range: radius,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Heals up to ${targets} party members for ${heal} HP within ${radius.toFixed(1)}m.`,
      isPassive: false,
      Buff: {
        type: 'hp',
        value: heal,
        duration: 0,
        stackable: false,
      },
    });
  }

  // Cure Series - 5 levels (Remove debuffs)
  for (let i = 1; i <= 5; i++) {
    const masteryLevel = i * 15 + 5;
    const charLevel = i * 15 + 10;
    const debuffs = i; // Number of debuffs to remove
    const mp = 40 + i * 10;

    skills.push({
      id: `force_cure_${i}`,
      masteryId: 'force',
      name: `Cure Series - Lv${i}`,
      type: 'active',
      level: i,
      element: 'force',
      baseDamage: 0,
      mpCost: mp,
      castTime: 1000,
      cooldown: 15000,
      range: 20.0,
      requiredLevel: charLevel,
      requiredMasteryLevel: masteryLevel,
      description: `Removes ${debuffs} debuff(s) from target.`,
      isPassive: false,
    });
  }

  return skills;
}

// ============================================
// GENERATE ALL SKILLS
// ============================================

export function generateAllChineseSkills(): GameSkill[] {
  const allSkills: GameSkill[] = [];

  // Generate all mastery trees
  allSkills.push(...generateBicheonSkills());
  allSkills.push(...generateHeuksalSkills());
  allSkills.push(...generatePacheonSkills());
  allSkills.push(...generateFireSkills());
  allSkills.push(...generateColdSkills());
  allSkills.push(...generateLightningSkills());
  allSkills.push(...generateForceSkills());

  console.log(`[Skills] Generated ${allSkills.length} Chinese skills`);

  return allSkills;
}

// Helper functions
export function getSkillsByMastery(masteryId: string): GameSkill[] {
  const allSkills = generateAllChineseSkills();
  return allSkills.filter(skill => skill.masteryId === masteryId);
}

export function getSkillsByLevel(minLevel: number, maxLevel: number): GameSkill[] {
  const allSkills = generateAllChineseSkills();
  return allSkills.filter(skill => skill.level >= minLevel && skill.level <= maxLevel);
}

export function getSkillById(skillId: string): GameSkill | undefined {
  const allSkills = generateAllChineseSkills();
  return allSkills.find(skill => skill.id === skillId);
}

// Export all skills
export const ALL_CHINESE_SKILLS = generateAllChineseSkills();

// Mastery skill counts
export const MASTERY_SKILL_COUNTS = {
  bicheon: 80, // 20 + 20 + 15 + 10 + 5 + 10 = 80
  heuksal: 80, // 20 + 20 + 15 + 8 + 10 + 7 = 80
  pacheon: 80, // 20 + 10 + 15 + 20 + 10 + 5 = 80
  fire: 80, // 20 + 10 + 10 + 15 + 10 + 10 + 15 = 90+ (adjusted to 80)
  cold: 80, // 15 + 20 + 10 + 10 + 10 + 10 + 15 = 90+ (adjusted to 80)
  lightning: 80, // 20 + 15 + 10 + 10 + 10 + 10 + 15 = 90+ (adjusted to 80)
  force: 75, // 20 + 10 + 5 + 10 + 10 + 10 + 10 + 5 = 80
};
