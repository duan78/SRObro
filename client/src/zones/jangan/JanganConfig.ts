// ============================================
// SRObro - Jangan Zone Configuration
// Level 1-20 zone
// ============================================

import type { Position, SpawnPoint, MonsterSpawn } from '@srobro/shared';

export interface JanganZoneConfig {
  id: string;
  name: string;
  levelRange: { min: number; max: number };
  playerSpawnPoint: Position;
  monsterSpawns: MonsterSpawnConfig[];
  zoneBoundaries: ZoneBoundaries;
}

export interface MonsterSpawnConfig {
  monsterId: string;
  position: Position;
  rotation: number;
  maxCount: number;
  respawnTime: number; // seconds
  levelRange: [number, number];
}

export interface ZoneBoundaries {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

// Jangan zone configuration
export const JANGAN_CONFIG: JanganZoneConfig = {
  id: 'jangan',
  name: 'Jangan',
  levelRange: { min: 1, max: 20 },

  // Player spawn point (near city entrance)
  playerSpawnPoint: {
    x: 1000,
    y: 0,
    z: 1000,
  },

  // Zone boundaries (for collision and respawn)
  zoneBoundaries: {
    minX: 0,
    maxX: 2000,
    minZ: 0,
    maxZ: 2000,
  },

  // Monster spawn areas
  monsterSpawns: [
    // Level 1-5: Young Yaks (tutorial mobs near spawn)
    {
      monsterId: 'monster_maiden_lv1',
      position: { x: 1050, y: 0, z: 1050 },
      rotation: 0,
      maxCount: 10,
      respawnTime: 30,
      levelRange: [1, 5],
    },
    {
      monsterId: 'monster_maiden_lv1',
      position: { x: 950, y: 0, z: 1050 },
      rotation: 0,
      maxCount: 10,
      respawnTime: 30,
      levelRange: [1, 5],
    },
    {
      monsterId: 'monster_yeoha_lv4',
      position: { x: 1100, y: 0, z: 1000 },
      rotation: 0,
      maxCount: 8,
      respawnTime: 45,
      levelRange: [3, 6],
    },

    // Level 5-10: Wolves and Spiders (further from city)
    {
      monsterId: 'monster_yeoha_lv4',
      position: { x: 1200, y: 0, z: 1200 },
      rotation: 0,
      maxCount: 12,
      respawnTime: 40,
      levelRange: [5, 10],
    },
    {
      monsterId: 'monster_spider_lv7',
      position: { x: 800, y: 0, z: 1200 },
      rotation: 0,
      maxCount: 10,
      respawnTime: 50,
      levelRange: [7, 10],
    },
    {
      monsterId: 'monster_spider_lv7',
      position: { x: 1200, y: 0, z: 800 },
      rotation: 0,
      maxCount: 10,
      respawnTime: 50,
      levelRange: [7, 10],
    },

    // Level 10-15: Bandits (around city perimeter)
    {
      monsterId: 'monster_bandit_lv10',
      position: { x: 1300, y: 0, z: 1300 },
      rotation: 0,
      maxCount: 8,
      respawnTime: 60,
      levelRange: [10, 15],
    },
    {
      monsterId: 'monster_bandit_lv10',
      position: { x: 700, y: 0, z: 1300 },
      rotation: 0,
      maxCount: 8,
      respawnTime: 60,
      levelRange: [10, 15],
    },
    {
      monsterId: 'monster_bandit_lv10',
      position: { x: 1300, y: 0, z: 700 },
      rotation: 0,
      maxCount: 8,
      respawnTime: 60,
      levelRange: [10, 15],
    },
    {
      monsterId: 'monster_bandit_lv10',
      position: { x: 700, y: 0, z: 700 },
      rotation: 0,
      maxCount: 8,
      respawnTime: 60,
      levelRange: [10, 15],
    },

    // Level 15-20: Ghosts and stronger mobs (deeper areas)
    {
      monsterId: 'monster_ghost_lv15',
      position: { x: 1500, y: 0, z: 1500 },
      rotation: 0,
      maxCount: 6,
      respawnTime: 90,
      levelRange: [15, 20],
    },
    {
      monsterId: 'monster_ghost_lv15',
      position: { x: 500, y: 0, z: 1500 },
      rotation: 0,
      maxCount: 6,
      respawnTime: 90,
      levelRange: [15, 20],
    },
    {
      monsterId: 'monster_ghost_lv15',
      position: { x: 1500, y: 0, z: 500 },
      rotation: 0,
      maxCount: 6,
      respawnTime: 90,
      levelRange: [15, 20],
    },
    {
      monsterId: 'monster_ghost_lv15',
      position: { x: 500, y: 0, z: 500 },
      rotation: 0,
      maxCount: 6,
      respawnTime: 90,
      levelRange: [15, 20],
    },
  ],
};

// Helper function to get spawn point for new players
export function getJanganSpawnPoint(): Position {
  return { ...JANGAN_CONFIG.playerSpawnPoint };
}

// Helper function to get monster spawns for level range
export function getMonsterSpawnsForLevel(minLevel: number, maxLevel: number): MonsterSpawnConfig[] {
  return JANGAN_CONFIG.monsterSpawns.filter(spawn => {
    const [min, max] = spawn.levelRange;
    return !(max < minLevel || min > maxLevel);
  });
}

// Helper function to check if position is within zone boundaries
export function isWithinZoneBoundaries(position: Position): boolean {
  const { minX, maxX, minZ, maxZ } = JANGAN_CONFIG.zoneBoundaries;
  return position.x >= minX && position.x <= maxX &&
         position.z >= minZ && position.z <= maxZ;
}
