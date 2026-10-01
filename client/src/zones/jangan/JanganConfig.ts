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
// Monde centré sur l'origine: le sol 2000x2000 de JanganZone s'étend de
// -1000 à +1000. Les monsterId correspondent aux vrais monstres importés
// du client officiel (server/data/game/characters.json) et seedés en base
// avec le préfixe `mob_` (le stem BSR sert de modelId).
export const JANGAN_CONFIG: JanganZoneConfig = {
  id: 'jangan',
  name: 'Jangan',
  levelRange: { min: 1, max: 20 },

  // Player spawn point (centre de la ville réelle, anneau des bâtiments cj_*)
  playerSpawnPoint: {
    x: 0,
    y: 0,
    z: 500,
  },

  // Zone boundaries (for collision and respawn)
  zoneBoundaries: {
    minX: -1000,
    maxX: 1000,
    minZ: -1000,
    maxZ: 1000,
  },

  // Monster spawn areas
  monsterSpawns: [
    // Level 1-5: Mangnyang (tutorial mobs near spawn)
    {
      monsterId: 'mob_mangnyang',
      position: { x: 50, y: 0, z: 550 },
      rotation: 0,
      maxCount: 10,
      respawnTime: 30,
      levelRange: [1, 5],
    },
    {
      monsterId: 'mob_mangnyang',
      position: { x: -50, y: 0, z: 550 },
      rotation: 0,
      maxCount: 10,
      respawnTime: 30,
      levelRange: [1, 5],
    },
    {
      monsterId: 'mob_bigeyeghost',
      position: { x: 100, y: 0, z: 500 },
      rotation: 0,
      maxCount: 8,
      respawnTime: 45,
      levelRange: [3, 6],
    },

    // Level 5-10: Gyo et Waterghost
    {
      monsterId: 'mob_gyo',
      position: { x: 200, y: 0, z: 700 },
      rotation: 0,
      maxCount: 12,
      respawnTime: 40,
      levelRange: [5, 10],
    },
    {
      monsterId: 'mob_waterghost',
      position: { x: -200, y: 0, z: 700 },
      rotation: 0,
      maxCount: 10,
      respawnTime: 50,
      levelRange: [7, 10],
    },
    {
      monsterId: 'mob_stoneghost',
      position: { x: 200, y: 0, z: 300 },
      rotation: 0,
      maxCount: 10,
      respawnTime: 50,
      levelRange: [7, 10],
    },

    // Level 10-15: Yeoha et tigres (plus loin du spawn)
    {
      monsterId: 'mob_yeoha',
      position: { x: 300, y: 0, z: 800 },
      rotation: 0,
      maxCount: 8,
      respawnTime: 60,
      levelRange: [10, 15],
    },
    {
      monsterId: 'mob_banditarcher',
      position: { x: -300, y: 0, z: 800 },
      rotation: 0,
      maxCount: 8,
      respawnTime: 60,
      levelRange: [10, 15],
    },
    {
      monsterId: 'mob_tiger',
      position: { x: 300, y: 0, z: 200 },
      rotation: 0,
      maxCount: 8,
      respawnTime: 60,
      levelRange: [10, 15],
    },

    // Level 15-20: Bandits (zones profondes)
    {
      monsterId: 'mob_bandit',
      position: { x: 500, y: 0, z: 1000 },
      rotation: 0,
      maxCount: 6,
      respawnTime: 90,
      levelRange: [15, 20],
    },
    {
      monsterId: 'mob_bandit',
      position: { x: -500, y: 0, z: 1000 },
      rotation: 0,
      maxCount: 6,
      respawnTime: 90,
      levelRange: [15, 20],
    },
    {
      monsterId: 'mob_bandit',
      position: { x: 500, y: 0, z: 0 },
      rotation: 0,
      maxCount: 6,
      respawnTime: 90,
      levelRange: [15, 20],
    },
    {
      monsterId: 'mob_bandit',
      position: { x: -500, y: 0, z: 0 },
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
