/**
 * SRObro - Asset Mapping Configuration
 * Maps game entities to their GLB model files
 */

export interface AssetMapping {
  modelPath: string;
  scale?: number;
  offset?: { x: number; y: number; z: number };
}

/**
 * Player character models (with skinning data from Blender)
 * Assets are in /public/assets/ folder
 */
export const PLAYER_CHARACTERS: Record<string, AssetMapping> = {
  'CH_M_01': {
    modelPath: './assets/avatar_m_nasrun.glb',
    scale: 1,
  },
  'CH_M_02': {
    modelPath: './assets/avatar_m_nasrun02.glb',
    scale: 1,
  },
  'CH_M_03': {
    modelPath: './assets/avatar_m_nasrun03.glb',
    scale: 1,
  },
  'CH_F_01': {
    modelPath: './assets/avatar_w_nasrun.glb',
    scale: 1,
  },
  'CH_F_02': {
    modelPath: './assets/avatar_w_nasrun02.glb',
    scale: 1,
  },
  'CH_F_03': {
    modelPath: './assets/avatar_w_nasrun03_part1.glb',
    scale: 1,
  },
};

/**
 * Monster models for Jangan area (levels 1-20)
 * Assets are in /public/assets/ folder
 * Mappings include all monsters from JanganConfig
 */
export const MONSTERS: Record<string, AssetMapping> = {
  // ============================================
  // Level 1-5: Starter Mobs
  // ============================================

  // Maiden (tutorial mob) - uses Mangnyang model
  'monster_maiden_lv1': {
    modelPath: './assets/mangnyang_part1.glb',
    scale: 0.8,
  },
  'maiden': {
    modelPath: './assets/mangnyang_part1.glb',
    scale: 0.8,
  },

  // Mangnyang (Wild Dog)
  'mangnyang': {
    modelPath: './assets/mangnyang_part1.glb',
    scale: 1,
  },
  'mangnyang_lv1': {
    modelPath: './assets/mangnyang_part1.glb',
    scale: 0.8,
  },
  'mangnyang_lv2': {
    modelPath: './assets/mangnyang_part1.glb',
    scale: 0.9,
  },
  'mob_mangnyang': {
    modelPath: './assets/mangnyang_part1.glb',
    scale: 1,
  },

  // ============================================
  // Level 3-8: Yeoha (Fox)
  // ============================================

  'yeoha': {
    modelPath: './assets/yeoha_part1.glb',
    scale: 1,
  },
  'monster_yeoha_lv4': {
    modelPath: './assets/yeoha_part1.glb',
    scale: 1,
  },
  'yeoha_lv4': {
    modelPath: './assets/yeoha_part1.glb',
    scale: 1,
  },

  // ============================================
  // Level 5-10: Bandits
  // ============================================

  'bandit': {
    modelPath: './assets/mangnyang_part1.glb', // Fallback
    scale: 1.2,
  },
  'bandit_archer': {
    modelPath: './assets/mangnyang_part1.glb', // Fallback
    scale: 1.2,
  },
  'monster_bandit_lv10': {
    modelPath: './assets/mangnyang_part1.glb', // Fallback
    scale: 1.3,
  },

  // ============================================
  // Level 7-10: Spiders (use Yeoha model)
  // ============================================

  'spider': {
    modelPath: './assets/yeoha_part1.glb', // Fallback
    scale: 0.9,
  },
  'monster_spider_lv7': {
    modelPath: './assets/yeoha_part1.glb', // Fallback
    scale: 0.9,
  },

  // ============================================
  // Level 8-15: Tigers
  // ============================================

  'tiger': {
    modelPath: './assets/tiger_part1.glb',
    scale: 1.5,
  },
  'tiger_lv10': {
    modelPath: './assets/bluetiger_part1.glb',
    scale: 1.6,
  },
  'mob_tiger': {
    modelPath: './assets/tiger_part1.glb',
    scale: 1.5,
  },

  // ============================================
  // Level 10-20: Ghosts
  // ============================================

  'ghost': {
    modelPath: './assets/mangnyang_part1.glb', // Fallback
    scale: 1.2,
  },
  'monster_ghost_lv15': {
    modelPath: './assets/mangnyang_part1.glb', // Fallback
    scale: 1.4,
  },

  // ============================================
  // Other Monsters
  // ============================================

  // Chakji (Crabs)
  'chakji': {
    modelPath: './assets/mangnyang_part1.glb', // Fallback
    scale: 1.3,
  },

  // Earth Ghost
  'earth_ghost': {
    modelPath: './assets/mangnyang_part1.glb', // Fallback
    scale: 1.4,
  },
};

/**
 * Jangan zone buildings and environment
 */
export const JANGAN_BUILDINGS: Record<string, AssetMapping> = {
  // Rich district buildings
  'cj_rich1_buil01': {
    modelPath: 'assets/glb_blender/prim/mesh/bldg/china/jangan06/rich01/cj_rich1_buil01_floor.glb',
    scale: 1,
  },
  'cj_rich1_wall': {
    modelPath: 'assets/glb_blender/prim/mesh/bldg/china/jangan06/rich01/cj_rich1_longwall.glb',
    scale: 1,
  },

  // Gates
  'cj_rich1_gate': {
    modelPath: 'assets/glb_blender/prim/mesh/bldg/china/jangan06/rich01/cj_rich1_door_roof.glb',
    scale: 1,
  },
};

/**
 * Environment props
 */
export const ENVIRONMENT_PROPS: Record<string, AssetMapping> = {
  // Trees
  'tree_pine': {
    modelPath: 'assets/glb Converted/prim/mesh/nature/europe/east eurpoe/garden/euro_grs_weed01.glb',
    scale: 2,
  },

  // Misc
  'campfire': {
    modelPath: 'assets/glb Converted/prim/mesh/item/etc/skill_campfire_01.glb',
    scale: 1,
  },
};

/**
 * Helper function to get asset path for monster
 */
export function getMonsterAssetPath(monsterId: string): AssetMapping | null {
  // Try exact match first
  if (MONSTERS[monsterId]) {
    return MONSTERS[monsterId];
  }

  // Try partial match
  for (const [key, value] of Object.entries(MONSTERS)) {
    if (monsterId.includes(key) || key.includes(monsterId)) {
      return value;
    }
  }

  // Fallback to generic mobs
  if (monsterId.includes('tiger') || monsterId.includes('mob_tiger')) {
    return MONSTERS['mob_tiger'];
  }
  if (monsterId.includes('mangnyang') || monsterId.includes('mob_mangnyang')) {
    return MONSTERS['mob_mangnyang'];
  }

  // Default fallback
  return MONSTERS['mangnyang'];
}

/**
 * Helper function to get player asset path
 */
export function getPlayerAssetPath(characterId: string): AssetMapping {
  const upperId = characterId.toUpperCase();

  // Chinese male
  if (upperId.includes('CH_M') || upperId.includes('CHINA') && upperId.includes('M')) {
    return PLAYER_CHARACTERS['CH_M_01'];
  }

  // Chinese female
  if (upperId.includes('CH_F') || upperId.includes('CHINA') && upperId.includes('F')) {
    return PLAYER_CHARACTERS['CH_F_01'];
  }

  // European male
  if (upperId.includes('EU_M') || upperId.includes('EURO') && upperId.includes('M')) {
    return PLAYER_CHARACTERS['CH_M_01']; // Fallback
  }

  // European female
  if (upperId.includes('EU_F') || upperId.includes('EURO') && upperId.includes('F')) {
    return PLAYER_CHARACTERS['CH_F_01']; // Fallback
  }

  // Default to Chinese male
  return PLAYER_CHARACTERS['CH_M_01'];
}
