/**
 * SRObro - Database Seed Script
 * Populates the database with initial game data
 */

import { PrismaClient } from '@prisma/client';
import { CHINESE_MASTERY_TREES, EUROPEAN_MASTERY_TREES } from '@srobro/shared';

const prisma = new PrismaClient();

/**
 * Main seed function
 */
async function main() {
  console.log('🌱 Starting database seed...');

  // Clean existing data
  await cleanDatabase();

  // Seed in order
  await seedZones();
  await seedMasteries();
  await seedItems();
  await seedMonsters();
  await seedNPCs();
  await seedShops();
  await seedMonsterSpawns();
  await seedTeleportPoints();

  // Seed new systems
  await seedFortresses();
  await seedQuests();

  console.log('✅ Database seed completed!');
}

/**
 * Clean existing data
 */
async function cleanDatabase() {
  console.log('🧹 Cleaning database...');

  await prisma.chatMessage.deleteMany();
  await prisma.jobState.deleteMany();
  await prisma.guildMember.deleteMany();
  await prisma.guild.deleteMany();
  await prisma.partyMember.deleteMany();
  await prisma.party.deleteMany();
  await prisma.statusEffect.deleteMany();
  await prisma.killLog.deleteMany();
  await prisma.shopItem.deleteMany();
  await prisma.nPC.deleteMany();
  await prisma.monsterDrop.deleteMany();
  await prisma.monsterSpawn.deleteMany();
  await prisma.monster.deleteMany();
  await prisma.equipment.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.characterSkill.deleteMany();
  await prisma.characterMastery.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.character.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.item.deleteMany();
  await prisma.mastery.deleteMany();
  await prisma.teleportPoint.deleteMany();
  await prisma.zone.deleteMany();

  // Priority 1: Clean new models
  await prisma.hotkeyBinding.deleteMany();
  await prisma.droppedItem.deleteMany();
  await prisma.characterSettings.deleteMany();

  console.log('✅ Database cleaned');
}

/**
 * Seed Zones
 */
async function seedZones() {
  console.log('🗺️  Seeding zones...');

  const zones = [
    {
      id: 'zone_jangan',
      name: 'Jangan',
      levelMin: 1,
      levelMax: 20,
      width: 2000.0,
      height: 2000.0,
    },
    {
      id: 'zone_donwhang',
      name: 'Donwhang',
      levelMin: 20,
      levelMax: 40,
      width: 2000.0,
      height: 2000.0,
    },
    {
      id: 'zone_hotan',
      name: 'Hotan',
      levelMin: 40,
      levelMax: 60,
      width: 2000.0,
      height: 2000.0,
    },
  ];

  for (const zone of zones) {
    await prisma.zone.upsert({
      where: { id: zone.id },
      update: {},
      create: zone,
    });
  }

  console.log(`✅ Seeded ${zones.length} zones`);
}

/**
 * Seed Masteries
 */
async function seedMasteries() {
  console.log('📚 Seeding masteries...');

  // Chinese masteries
  for (const [key, mastery] of Object.entries(CHINESE_MASTERY_TREES)) {
    await prisma.mastery.upsert({
      where: { name: mastery.name },
      update: {},
      create: {
        name: mastery.name,
        tree: key as any,
        maxLevel: mastery.maxLevel,
        description: `${mastery.nameKr} (${mastery.name})`,
      },
    });
  }

  // European masteries
  for (const [key, mastery] of Object.entries(EUROPEAN_MASTERY_TREES)) {
    await prisma.mastery.upsert({
      where: { name: mastery.name },
      update: {},
      create: {
        name: mastery.name,
        tree: key as any,
        maxLevel: mastery.maxLevel,
        description: mastery.name,
      },
    });
  }

  console.log('✅ Seeded masteries');
}

/**
 * Seed Items
 */
async function seedItems() {
  console.log('🎒 Seeding items...');

  // Potions
  const potions = [
    { id: 'item_hp_potion_s', name: 'HP Potion (Small)', type: 'potion', requiredLevel: 1, price: 50, stackable: true },
    { id: 'item_hp_potion_m', name: 'HP Potion (Medium)', type: 'potion', requiredLevel: 20, price: 200, stackable: true },
    { id: 'item_hp_potion_l', name: 'HP Potion (Large)', type: 'potion', requiredLevel: 40, price: 500, stackable: true },
    { id: 'item_mp_potion_s', name: 'MP Potion (Small)', type: 'potion', requiredLevel: 1, price: 50, stackable: true },
    { id: 'item_mp_potion_m', name: 'MP Potion (Medium)', type: 'potion', requiredLevel: 20, price: 200, stackable: true },
    { id: 'item_mp_potion_l', name: 'MP Potion (Large)', type: 'potion', requiredLevel: 40, price: 500, stackable: true },
    { id: 'item_return_scroll', name: 'Return Scroll', type: 'general', requiredLevel: 1, price: 1000, stackable: true },
  ];

  // Weapons (Chinese)
  const chineseWeapons = [
    {
      id: 'item_sword_1',
      name: 'Blade (Lv1)',
      type: 'weapon',
      subType: 'blade',
      requiredLevel: 1,
      requiredStr: 10,
      attackPowerMin: 15,
      attackPowerMax: 22,
      price: 100,
    },
    {
      id: 'item_sword_2',
      name: 'Sword (Lv1)',
      type: 'weapon',
      subType: 'sword',
      requiredLevel: 1,
      requiredStr: 10,
      attackPowerMin: 12,
      attackPowerMax: 18,
      defense: 5,
      price: 100,
    },
    {
      id: 'item_spear_1',
      name: 'Spear (Lv1)',
      type: 'weapon',
      subType: 'spear',
      requiredLevel: 1,
      requiredStr: 12,
      attackPowerMin: 18,
      attackPowerMax: 26,
      price: 150,
    },
  ];

  // Armor (Chinese)
  const armor = [
    {
      id: 'item_chest_cloth_1',
      name: 'Cloth Armor (Lv1)',
      type: 'chest',
      requiredLevel: 1,
      defense: 5,
      price: 100,
    },
    {
      id: 'item_helmet_cloth_1',
      name: 'Cloth Hood (Lv1)',
      type: 'helmet',
      requiredLevel: 1,
      defense: 2,
      price: 50,
    },
    {
      id: 'item_legs_cloth_1',
      name: 'Cloth Pants (Lv1)',
      type: 'legs',
      requiredLevel: 1,
      defense: 3,
      price: 75,
    },
  ];

  // Accessories
  const accessories = [
    {
      id: 'item_ring_1',
      name: 'Ring',
      type: 'ring',
      requiredLevel: 1,
      bonusStr: 2,
      price: 500,
    },
    {
      id: 'item_necklace_1',
      name: 'Necklace',
      type: 'necklace',
      requiredLevel: 1,
      bonusInt: 3,
      price: 1000,
    },
  ];

  const allItems = [...potions, ...chineseWeapons, ...armor, ...accessories];

  for (const item of allItems) {
    await prisma.item.upsert({
      where: { id: item.id },
      update: {},
      create: {
        ...item,
        rarity: 'common',
        durability: item.type === 'weapon' || item.type.startsWith('chest') || item.type.startsWith('helmet') || item.type.startsWith('legs') ? 50 : 0,
        maxDurability: item.type === 'weapon' || item.type.startsWith('chest') || item.type.startsWith('helmet') || item.type.startsWith('legs') ? 50 : 0,
        stackable: item.stackable || false,
        maxStack: item.stackable ? 999 : 1,
      } as any,
    });
  }

  console.log(`✅ Seeded ${allItems.length} items`);
}

/**
 * Seed Monsters
 */
async function seedMonsters() {
  console.log('👾 Seeding monsters...');

  const monsters = [
    {
      id: 'monster_maiden',
      name: 'Maiden',
      level: 1,
      hp: 50,
      attackPowerMin: 5,
      attackPowerMax: 10,
      defense: 2,
      exp: 10,
      sp: 1,
      aggroRange: 10.0,
      modelId: 'monster_maiden',
    },
    {
      id: 'monster_yeoha',
      name: 'Yeoha',
      level: 4,
      hp: 100,
      attackPowerMin: 10,
      attackPowerMax: 18,
      defense: 5,
      exp: 30,
      sp: 3,
      aggroRange: 12.0,
      modelId: 'monster_yeoha',
    },
    {
      id: 'monster_spider',
      name: 'Spider',
      level: 7,
      hp: 180,
      attackPowerMin: 18,
      attackPowerMax: 28,
      defense: 8,
      exp: 60,
      sp: 6,
      aggroRange: 15.0,
      modelId: 'monster_spider',
    },
    {
      id: 'monster_bandit',
      name: 'Bandit',
      level: 10,
      hp: 300,
      attackPowerMin: 25,
      attackPowerMax: 40,
      defense: 12,
      exp: 120,
      sp: 12,
      aggroRange: 15.0,
      modelId: 'monster_bandit',
    },
    {
      id: 'monster_ghost',
      name: 'Ghost',
      level: 15,
      hp: 500,
      attackPowerMin: 35,
      attackPowerMax: 55,
      defense: 15,
      exp: 250,
      sp: 25,
      aggroRange: 18.0,
      modelId: 'monster_ghost',
    },
  ];

  for (const monster of monsters) {
    const created = await prisma.monster.upsert({
      where: { id: monster.id },
      update: {},
      create: monster,
    });

    // Add drops to monsters
    const drops: { itemId: string; chance: number; quantityMin: number; quantityMax: number }[] = [];

    // All monsters can drop potions
    drops.push({ itemId: 'item_hp_potion_s', chance: 0.3, quantityMin: 1, quantityMax: 3 });
    drops.push({ itemId: 'item_mp_potion_s', chance: 0.2, quantityMin: 1, quantityMax: 2 });

    // Higher level monsters drop better items
    if (monster.level >= 10) {
      drops.push({ itemId: 'item_hp_potion_m', chance: 0.2, quantityMin: 1, quantityMax: 2 });
    }

    // Bandits can drop equipment
    if (monster.id === 'monster_bandit') {
      drops.push({ itemId: 'item_sword_1', chance: 0.05, quantityMin: 1, quantityMax: 1 });
      drops.push({ itemId: 'item_spear_1', chance: 0.05, quantityMin: 1, quantityMax: 1 });
      drops.push({ itemId: 'item_ring_1', chance: 0.03, quantityMin: 1, quantityMax: 1 });
    }

    for (const drop of drops) {
      await prisma.monsterDrop.create({
        data: {
          monsterId: created.id,
          ...drop,
        },
      });
    }
  }

  console.log(`✅ Seeded ${monsters.length} monsters with drops`);
}

/**
 * Seed NPCs
 */
async function seedNPCs() {
  console.log('👤 Seeding NPCs...');

  const npcs = [
    {
      id: 'npc_potion_shop',
      name: 'Potion Shop',
      npcType: 'shop',
      zoneId: 'zone_jangan',
      positionX: 100.0,
      positionY: 0.0,
      positionZ: 100.0,
      modelId: 'npc_potion',
    },
    {
      id: 'npc_weapon_shop',
      name: 'Weapon Shop',
      npcType: 'shop',
      zoneId: 'zone_jangan',
      positionX: 120.0,
      positionY: 0.0,
      positionZ: 100.0,
      modelId: 'npc_weapon',
    },
    {
      id: 'npc_armor_shop',
      name: 'Armor Shop',
      npcType: 'shop',
      zoneId: 'zone_jangan',
      positionX: 140.0,
      positionY: 0.0,
      positionZ: 100.0,
      modelId: 'npc_armor',
    },
    {
      id: 'npc_stable',
      name: 'Stable',
      npcType: 'stable',
      zoneId: 'zone_jangan',
      positionX: 80.0,
      positionY: 0.0,
      positionZ: 80.0,
      modelId: 'npc_stable',
    },
    {
      id: 'npc_storage',
      name: 'Storage',
      npcType: 'storage',
      zoneId: 'zone_jangan',
      positionX: 90.0,
      positionY: 0.0,
      positionZ: 120.0,
      modelId: 'npc_storage',
    },
    {
      id: 'npc_teleport',
      name: 'Gatekeeper',
      npcType: 'teleport',
      zoneId: 'zone_jangan',
      positionX: 110.0,
      positionY: 0.0,
      positionZ: 120.0,
      modelId: 'npc_teleport',
    },
  ];

  for (const npc of npcs) {
    await prisma.nPC.upsert({
      where: { id: npc.id },
      update: {},
      create: npc,
    });
  }

  console.log(`✅ Seeded ${npcs.length} NPCs`);
}

/**
 * Seed Shops
 */
async function seedShops() {
  console.log('🏪 Seeding shops...');

  // Potion shop items
  const potionShopItems = [
    'item_hp_potion_s',
    'item_hp_potion_m',
    'item_mp_potion_s',
    'item_mp_potion_m',
    'item_return_scroll',
  ];

  for (const itemId of potionShopItems) {
    await prisma.shopItem.create({
      data: {
        npcId: 'npc_potion_shop',
        itemId,
      },
    });
  }

  // Weapon shop items
  const weaponShopItems = ['item_sword_1', 'item_sword_2', 'item_spear_1'];

  for (const itemId of weaponShopItems) {
    await prisma.shopItem.create({
      data: {
        npcId: 'npc_weapon_shop',
        itemId,
      },
    });
  }

  // Armor shop items
  const armorShopItems = ['item_chest_cloth_1', 'item_helmet_cloth_1', 'item_legs_cloth_1'];

  for (const itemId of armorShopItems) {
    await prisma.shopItem.create({
      data: {
        npcId: 'npc_armor_shop',
        itemId,
      },
    });
  }

  console.log('✅ Seeded shop items');
}

/**
 * Seed Monster Spawns
 */
async function seedMonsterSpawns() {
  console.log('📍 Seeding monster spawns...');

  const spawns = [
    // Maiden spawns (around Jangan)
    {
      monsterId: 'monster_maiden',
      zoneId: 'zone_jangan',
      positionX: 200,
      positionY: 0,
      positionZ: 200,
      maxCount: 20,
      respawnTime: 10,
      patrolRange: 30.0,
    },
    {
      monsterId: 'monster_maiden',
      zoneId: 'zone_jangan',
      positionX: 300,
      positionY: 0,
      positionZ: 400,
      maxCount: 15,
      respawnTime: 10,
      patrolRange: 30.0,
    },
    // Yeoha spawns
    {
      monsterId: 'monster_yeoha',
      zoneId: 'zone_jangan',
      positionX: 500,
      positionY: 0,
      positionZ: 500,
      maxCount: 15,
      respawnTime: 15,
      patrolRange: 40.0,
    },
    // Spider spawns
    {
      monsterId: 'monster_spider',
      zoneId: 'zone_jangan',
      positionX: 700,
      positionY: 0,
      positionZ: 700,
      maxCount: 10,
      respawnTime: 20,
      patrolRange: 50.0,
    },
    // Bandit spawns
    {
      monsterId: 'monster_bandit',
      zoneId: 'zone_jangan',
      positionX: 900,
      positionY: 0,
      positionZ: 900,
      maxCount: 8,
      respawnTime: 30,
      patrolRange: 60.0,
    },
    // Ghost spawns
    {
      monsterId: 'monster_ghost',
      zoneId: 'zone_jangan',
      positionX: 1200,
      positionY: 0,
      positionZ: 1200,
      maxCount: 5,
      respawnTime: 45,
      patrolRange: 80.0,
    },
  ];

  for (const spawn of spawns) {
    await prisma.monsterSpawn.create({
      data: spawn,
    });
  }

  console.log(`✅ Seeded ${spawns.length} monster spawn points`);
}

/**
 * Seed Teleport Points
 */
async function seedTeleportPoints() {
  console.log('🌀 Seeding teleport points...');

  const teleportPoints = [
    // Jangan to Donwhang
    {
      zoneId: 'zone_jangan',
      name: 'Donwhang',
      positionX: 110.0,
      positionY: 0.0,
      positionZ: 120.0,
      destinationZoneId: 'zone_donwhang',
      destinationPositionX: 1000.0,
      destinationPositionY: 0.0,
      destinationPositionZ: 1000.0,
      cost: 5000,
      requiredLevel: 20,
    },
    // Donwhang to Jangan
    {
      zoneId: 'zone_donwhang',
      name: 'Jangan',
      positionX: 1000.0,
      positionY: 0.0,
      positionZ: 1000.0,
      destinationZoneId: 'zone_jangan',
      destinationPositionX: 110.0,
      destinationPositionY: 0.0,
      destinationPositionZ: 120.0,
      cost: 5000,
      requiredLevel: 1,
    },
    // Donwhang to Hotan
    {
      zoneId: 'zone_donwhang',
      name: 'Hotan',
      positionX: 1050.0,
      positionY: 0.0,
      positionZ: 1050.0,
      destinationZoneId: 'zone_hotan',
      destinationPositionX: 1000.0,
      destinationPositionY: 0.0,
      destinationPositionZ: 1000.0,
      cost: 10000,
      requiredLevel: 40,
    },
    // Hotan to Donwhang
    {
      zoneId: 'zone_hotan',
      name: 'Donwhang',
      positionX: 1000.0,
      positionY: 0.0,
      positionZ: 1000.0,
      destinationZoneId: 'zone_donwhang',
      destinationPositionX: 1050.0,
      destinationPositionY: 0.0,
      destinationPositionZ: 1050.0,
      cost: 10000,
      requiredLevel: 20,
    },
  ];

  for (const tp of teleportPoints) {
    await prisma.teleportPoint.create({
      data: tp,
    });
  }

  console.log(`✅ Seeded ${teleportPoints.length} teleport points`);
}

/**
 * Seed Fortresses
 */
async function seedFortresses() {
  console.log('🏰 Seeding fortresses...');

  const fortresses = [
    {
      id: 'fortress_jangan',
      name: 'Jangan Fortress',
      level: 1,
      taxRate: 0,
      nextWarTime: getNextSaturday6PM(),
      warDuration: 90,
      registrationDay: 'Saturday',
      registrationHour: 18,
      state: 'peace'
    },
    {
      id: 'fortress_hotan',
      name: 'Hotan Fortress',
      level: 3,
      taxRate: 0,
      nextWarTime: getNextSaturday6PM(),
      warDuration: 120,
      registrationDay: 'Saturday',
      registrationHour: 18,
      state: 'peace'
    },
    {
      id: 'fortress_bandit',
      name: 'Bandit Fortress',
      level: 5,
      taxRate: 0,
      nextWarTime: getNextSaturday6PM(),
      warDuration: 150,
      registrationDay: 'Saturday',
      registrationHour: 18,
      state: 'peace'
    }
  ];

  for (const fortress of fortresses) {
    await prisma.fortress.upsert({
      where: { id: fortress.id },
      update: {},
      create: fortress as any
    });
  }

  console.log(`✅ Seeded ${fortresses.length} fortresses`);
}

/**
 * Seed Quests
 */
async function seedQuests() {
  console.log('📜 Seeding quests...');

  // Tutorial quests
  const tutorialQuests = [
    {
      id: 'tutorial_welcome',
      name: 'Welcome to SRObro',
      description: 'Talk to the Guard to learn about the world.',
      type: 'tutorial',
      minLevel: 1,
      prerequisite: [],
      objectives: [
        { type: 'talk', targetId: 'npc_jangan_guard', targetName: 'Guard', count: 1 }
      ],
      rewards: {
        exp: 1000n,
        sp: 100n,
        gold: 5000n,
        items: []
      },
      startsAt: ['npc_jangan_guard'],
      endsAt: ['npc_jangan_guard'],
      canRepeat: false,
      timeLimit: null
    },
    {
      id: 'tutorial_first_steps',
      name: 'First Steps',
      description: 'Hunt 5 Yeoha to prove your strength.',
      type: 'tutorial',
      minLevel: 1,
      prerequisite: ['tutorial_welcome'],
      objectives: [
        { type: 'kill', targetId: 'monster_yeoha', targetName: 'Yeoha', count: 5 }
      ],
      rewards: {
        exp: 2000n,
        sp: 200n,
        gold: 10000n,
        items: []
      },
      startsAt: ['npc_jangan_guard'],
      endsAt: ['npc_jangan_guard'],
      canRepeat: false,
      timeLimit: null
    },
    {
      id: 'tutorial_equip_weapon',
      name: 'Equip Yourself',
      description: 'Equip a Training Blade to increase your attack power.',
      type: 'tutorial',
      minLevel: 1,
      prerequisite: ['tutorial_first_steps'],
      objectives: [
        { type: 'use', targetId: 'item_sword_1', targetName: 'Sword (Lv1)', count: 1 }
      ],
      rewards: {
        exp: 3000n,
        sp: 300n,
        gold: 15000n,
        items: []
      },
      startsAt: ['npc_jangan_guard'],
      endsAt: ['npc_jangan_guard'],
      canRepeat: false,
      timeLimit: null
    }
  ];

  // Daily quests
  const dailyQuests = [
    {
      id: 'daily_hunt_yeoha',
      name: 'Yeoha Extermination',
      description: 'Hunt 20 Yeoha to keep the roads safe.',
      type: 'daily',
      minLevel: 1,
      prerequisite: [],
      objectives: [
        { type: 'kill', targetId: 'monster_yeoha', targetName: 'Yeoha', count: 20 }
      ],
      rewards: {
        exp: 10000n,
        sp: 500n,
        gold: 50000n,
        items: []
      },
      startsAt: ['npc_jangan_guard'],
      endsAt: ['npc_jangan_guard'],
      canRepeat: true,
      repeatCooldown: 86400, // 24 hours
      timeLimit: 3600 // 1 hour
    }
  ];

  // Story quests
  const storyQuests = [
    {
      id: 'story_the_beginning',
      name: 'The Beginning',
      description: 'Your journey begins. Reach level 5 to continue.',
      type: 'story',
      minLevel: 1,
      prerequisite: [],
      objectives: [
        { type: 'reach', targetId: 'level_5', targetName: 'Level 5', count: 5 }
      ],
      rewards: {
        exp: 50000n,
        sp: 5000n,
        gold: 100000n,
        items: [
          { itemId: 'item_hp_potion_s', name: 'HP Potion (Small)', quantity: 50 }
        ]
      },
      startsAt: ['npc_jangan_guard'],
      endsAt: ['npc_jangan_guard'],
      canRepeat: false,
      timeLimit: null
    }
  ];

  // Insert all quests (normalize field names + BigInts for the Json columns)
  const slug = (name: string) =>
    'quest_' + name.toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
  const jsonSafe = (v: unknown): unknown =>
    typeof v === 'bigint' ? Number(v) : Array.isArray(v) ? v.map(jsonSafe)
      : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, jsonSafe(x)]))
      : v;

  for (const q of [...tutorialQuests, ...dailyQuests, ...storyQuests] as any[]) {
    await prisma.quest.upsert({
      where: { id: q.id ?? slug(q.name) },
      update: {},
      create: {
        id: q.id ?? slug(q.name),
        name: q.name,
        description: q.description ?? null,
        type: q.type,
        minLevel: q.minLevel,
        maxLevel: q.maxLevel ?? null,
        prerequisite: jsonSafe(q.prerequisite ?? []),
        objectives: jsonSafe(q.objectives),
        rewards: jsonSafe(q.rewards),
        startsAt: q.startsAt,
        endsAt: q.endsAt,
        repeatable: q.repeatable ?? q.canRepeat ?? false,
        repeatCooldownHrs: q.repeatCooldown != null ? Math.max(1, Math.round(q.repeatCooldown / 3600)) : null,
        timeLimitSec: q.timeLimit ?? null,
        isDaily: q.type === 'daily',
      },
    });
  }

  console.log(`✅ Seeded ${tutorialQuests.length + dailyQuests.length + storyQuests.length} quests`);
}

/**
 * Helper: Get next Saturday 6PM
 */
function getNextSaturday6PM(): Date {
  const now = new Date();
  const dayOfWeek = now.getDay();
  const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;

  const nextSaturday = new Date(now);
  nextSaturday.setDate(now.getDate() + daysUntilSaturday);
  nextSaturday.setHours(18, 0, 0, 0);

  return nextSaturday;
}

/**
 * Helper: Create default CharacterSettings for a character
 */
export async function createDefaultCharacterSettings(characterId: string) {
  const existingSettings = await prisma.characterSettings.findUnique({
    where: { characterId }
  });

  if (existingSettings) {
    return existingSettings;
  }

  const settings = await prisma.characterSettings.create({
    data: {
      characterId,
      autoPickup: false,
      lootFilter: {
        common: true,
        rare: true,
        legendary: true,
        unique: true
      },
      minimapZoom: 5,
      uiScale: 1.0,
      showTooltips: true,
      tooltipDelay: 300
    }
  });

  console.log(`✅ Created default settings for character ${characterId}`);
  return settings;
}

/**
 * Helper: Create default hotkey bindings for a new character
 */
export async function createDefaultHotkeyBindings(characterId: string) {
  // Common HP potion ID (adjust based on your item IDs)
  const hpPotionId = 'item_hp_potion_s';

  // Basic attack skill ID (adjust based on your skill IDs)
  const basicAttackSkillId = 'skill_basic_attack';

  const defaultBindings = [
    // HP Potion on slot 1
    {
      characterId,
      slotType: 'ONE_NINE',
      slotIndex: 0,
      itemId: hpPotionId,
      skillId: null
    },
    // Basic attack on F1
    {
      characterId,
      slotType: 'F1_F8',
      slotIndex: 0,
      itemId: null,
      skillId: basicAttackSkillId
    }
  ];

  for (const binding of defaultBindings) {
    await prisma.hotkeyBinding.upsert({
      where: {
        characterId_slotType_slotIndex: {
          characterId: binding.characterId,
          slotType: binding.slotType,
          slotIndex: binding.slotIndex
        }
      },
      update: {},
      create: binding
    });
  }

  console.log(`✅ Created default hotkey bindings for character ${characterId}`);
}

/**
 * Run seed
 */
main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
