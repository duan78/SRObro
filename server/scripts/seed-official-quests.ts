/**
 * SRObro — seed-official-quests.ts (phase C V3)
 *
 * Quêtes OFFICIELLES de Jangan (~22) et Donwhang (~20 notables) depuis la KB
 * sourcée (16_QUEST_SYSTEM.md: niveaux, NPCs, objectifs, récompenses EXACTES,
 * repeat limits, chaînes de prérequis) + les PNJ de quête AUX COORDONNÉES
 * OFFICIELLES (CITIES_01/02 — conversion officiel→moteur par ville).
 *
 * Adaptations documentées:
 * - objectifs « collecte » (drops) → KILL du mob porteur [APPROX: drop
 *   chance remplacé par un compte de kills] ;
 * - cibles mappées aux monstres RÉELLEMENT présents du monde (Black Robber
 *   = bandits, Bigeyeghost = Eye Ghosts, Whitetiger = tigers, Gyo = weasels) ;
 * - « livraisons » → objectifs talk au PNJ destination.
 *
 * Usage: npx tsx scripts/seed-official-quests.ts
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// officiel → moteur (ancres par ville, cf. seed-world*.ts)
const O2E = {
  jangan: (x: number, y: number) => ({ x: Math.round(x - 6460), z: Math.round(y - 590) }),
  donwhang: (x: number, y: number) => ({ x: Math.round(x - 3552), z: Math.round(y - 590) }),
};

interface NpcDef { id: string; name: string; city: 'jangan' | 'donwhang'; pos: [number, number]; }

const NPCS: NpcDef[] = [
  // ---- Jangan (coordonnées officielles CITIES_01) ----
  { id: 'npc_q_sonhyeon', name: 'General Sonhyeon', city: 'jangan', pos: [6203, 1182] },
  { id: 'npc_q_hwangno', name: 'Village Chief Hwangno', city: 'jangan', pos: [6613, 1103] },
  { id: 'npc_q_yangyun', name: 'Herbalist Yangyun', city: 'jangan', pos: [6494, 1101] },
  { id: 'npc_q_jinjin', name: 'Grocery Trader Jinjin', city: 'jangan', pos: [6502, 1068] },
  { id: 'npc_q_iyang', name: 'Soldier Iyang', city: 'jangan', pos: [6667, 1147] },
  { id: 'npc_q_sangnam', name: 'Soldier Sangnam', city: 'jangan', pos: [6667, 1137] },
  { id: 'npc_q_jodaesan', name: 'Specialty Trader Jodaesan', city: 'jangan', pos: [6512, 1008] },
  { id: 'npc_q_flora', name: 'Adventurer Flora', city: 'jangan', pos: [6503, 986] },
  { id: 'npc_q_cheolhyeon', name: 'Blacksmith Cheolhyeon', city: 'jangan', pos: [6369, 1101] },
  { id: 'npc_q_juho', name: 'Soldier Juho', city: 'jangan', pos: [6293, 1304] },
  { id: 'npc_q_leebaik', name: 'Guild Manager Leebaik', city: 'jangan', pos: [6247, 1209] },
  { id: 'npc_q_myosoryeong', name: 'Exorcist Myosoryeong', city: 'jangan', pos: [5774, 1234] },
  { id: 'npc_q_jeonghye', name: 'Buddhist Priest Jeonghye', city: 'jangan', pos: [6594, 1250] },
  { id: 'npc_q_machun', name: 'Stable-Keeper Machun', city: 'jangan', pos: [6369, 1005] },
  { id: 'npc_q_gwaki', name: 'Hunter Gwaki', city: 'jangan', pos: [6304, 1192] },
  // ---- Donwhang (CITIES_02) ----
  { id: 'npc_q_bori', name: 'Herbalist Bori', city: 'donwhang', pos: [3516, 2033] },
  { id: 'npc_q_agol', name: 'Blacksmith Agol', city: 'donwhang', pos: [3576, 2042] },
  { id: 'npc_q_yeosun', name: 'Grocery Trader Yeosun', city: 'donwhang', pos: [3512, 1994] },
  { id: 'npc_q_leegak', name: 'Elder Leegak', city: 'donwhang', pos: [3495, 2076] },
  { id: 'npc_q_makgo', name: 'Stable-Keeper Makgo', city: 'donwhang', pos: [3598, 2085] },
  { id: 'npc_q_irina', name: 'Storage-Keeper Irina', city: 'donwhang', pos: [3582, 1990] },
  { id: 'npc_q_haraho', name: 'Hunter Associate Haraho', city: 'donwhang', pos: [3516, 2176] },
  { id: 'npc_q_manho', name: 'Soldier Manho', city: 'donwhang', pos: [3568, 2114] },
  { id: 'npc_q_dooil', name: 'Soldier Dooil', city: 'donwhang', pos: [3468, 2103] },
];

type Obj = { type: 'kill' | 'talk'; targetId?: string; targetName?: string; count: number };

interface QuestDef {
  id: string; name: string; lv: number; type: 'tutorial' | 'collection' | 'hunting' | 'delivery' | 'story' | 'chain';
  npc: string; endNpc?: string; objectives: Obj[];
  rewards: { exp: number; sp?: number; gold?: number };
  repeat?: number; prereq?: string; desc?: string;
}

const Q: QuestDef[] = [
  // ================= JANGAN (KB 16, §Jangan Lv 1-18) =================
  {
    id: 'q_jg_tutorial', name: 'Chinese Tutorial', lv: 1, type: 'tutorial', npc: 'npc_q_sonhyeon',
    objectives: [{ type: 'kill', targetName: 'Mangnyang', count: 30 }],
    rewards: { exp: 350, gold: 500 }, desc: 'Le général veut voir vos talents: 30 Mangyangs.',
  },
  {
    id: 'q_jg_weapon_delivery', name: 'Weapon Delivery', lv: 1, type: 'delivery', npc: 'npc_q_cheolhyeon',
    objectives: [{ type: 'talk', targetId: 'npc_q_iyang', count: 1 }],
    rewards: { exp: 225, gold: 205 }, desc: 'Récupérer le livret du garde Iyang.',
  },
  {
    id: 'q_jg_vanished_child', name: 'Vanished Child', lv: 3, type: 'collection', npc: 'npc_q_hwangno',
    objectives: [{ type: 'kill', targetName: 'Bigeyeghost', count: 15 }],
    rewards: { exp: 375, gold: 475 }, desc: 'Chercher des traces de l\'enfant disparu (Eye Ghosts).',
  },
  {
    id: 'q_jg_weasel', name: 'Battle with Weasel', lv: 3, type: 'hunting', npc: 'npc_q_iyang',
    objectives: [{ type: 'kill', targetName: 'Gyo', count: 40 }],
    rewards: { exp: 1900, gold: 1000 }, desc: '40 Weasels pour le soldat Iyang.',
  },
  {
    id: 'q_jg_invexpand1', name: 'Inventory Expansion 1', lv: 5, type: 'collection', npc: 'npc_q_jinjin',
    objectives: [{ type: 'kill', targetName: 'Mangnyang', count: 10 }],
    rewards: { exp: 1200 }, desc: 'Pailles de Mangyangs contre +10 slots.',
  },
  {
    id: 'q_jg_yangyun_anxiety', name: 'Yangyun Anxiety', lv: 5, type: 'hunting', npc: 'npc_q_yangyun',
    objectives: [{ type: 'kill', targetName: 'Waterghost', count: 50 }],
    rewards: { exp: 3800 }, desc: '50 Water Ghosts/Slaves inquiètent Yangyun.',
  },
  {
    id: 'q_jg_wg_poison', name: 'Water Ghost Poison', lv: 6, type: 'collection', npc: 'npc_q_yangyun',
    objectives: [{ type: 'kill', targetName: 'Waterghost', count: 20 }],
    rewards: { exp: 6600, sp: 4000 }, prereq: 'q_jg_yangyun_anxiety',
  },
  {
    id: 'q_jg_stone_ghost', name: 'Sweeping Stone Ghost', lv: 7, type: 'hunting', npc: 'npc_q_sangnam',
    objectives: [{ type: 'kill', targetName: 'Stoneghost', count: 40 }],
    rewards: { exp: 4500, gold: 2000 },
  },
  {
    id: 'q_jg_tomb_stones', name: 'Cleaning Tomb Stones', lv: 7, type: 'collection', npc: 'npc_q_jeonghye',
    objectives: [{ type: 'kill', targetName: 'Tombstone', count: 20 }],
    rewards: { exp: 10500, gold: 3800 },
  },
  {
    id: 'q_jg_tree_spirit', name: 'Tree Spirit', lv: 8, type: 'collection', npc: 'npc_q_myosoryeong',
    objectives: [{ type: 'kill', targetName: 'Yeoha', count: 30 }],
    rewards: { exp: 9800 }, desc: 'Sang noir des Yeohas pour l\'exorciste.',
  },
  {
    id: 'q_jg_adv_stone', name: "Adventurer's Stone", lv: 9, type: 'collection', npc: 'npc_q_flora',
    objectives: [{ type: 'kill', targetName: 'Stoneghost', count: 20 }],
    rewards: { exp: 5000, gold: 3500 }, prereq: 'q_jg_stone_ghost',
  },
  {
    id: 'q_jg_purification', name: 'Purification Ground', lv: 10, type: 'delivery', npc: 'npc_q_myosoryeong',
    endNpc: 'npc_q_jeonghye',
    objectives: [{ type: 'talk', targetId: 'npc_q_jeonghye', count: 1 }],
    rewards: { exp: 12700, sp: 4500, gold: 4000 }, prereq: 'q_jg_tree_spirit',
  },
  {
    id: 'q_jg_bandit_archer', name: 'Sweeping Bandit Archer', lv: 10, type: 'hunting', npc: 'npc_q_juho',
    objectives: [{ type: 'kill', targetName: 'Blackrobberarcher', count: 50 }],
    rewards: { exp: 9500 },
  },
  {
    id: 'q_jg_bandit_map', name: 'Bandit Operation Map', lv: 11, type: 'collection', npc: 'npc_q_juho',
    objectives: [{ type: 'kill', targetName: 'Blackrobberarcher', count: 20 }],
    rewards: { exp: 28200, sp: 10000, gold: 8000 }, prereq: 'q_jg_bandit_archer',
  },
  {
    id: 'q_jg_sweep_bandit', name: 'Sweeping Bandit', lv: 13, type: 'hunting', npc: 'npc_q_leebaik',
    objectives: [{ type: 'kill', targetName: 'Blackrobber', count: 50 }],
    rewards: { exp: 14500 },
  },
  {
    id: 'q_jg_tiger_tooth', name: 'Tiger Grinding Tooth', lv: 13, type: 'collection', npc: 'npc_q_jodaesan',
    objectives: [{ type: 'kill', targetName: 'Whitetiger', count: 10 }],
    rewards: { exp: 15300, sp: 5000, gold: 4400 },
  },
  {
    id: 'q_jg_tiger_comp', name: 'Tiger Hunting Competition', lv: 13, type: 'hunting', npc: 'npc_q_sonhyeon',
    objectives: [{ type: 'kill', targetName: 'Whitetiger', count: 30 }],
    rewards: { exp: 15800, sp: 4300 }, repeat: 3,
  },
  {
    id: 'q_jg_cheolhyeon_anger', name: "Cheolhyeon's Anger", lv: 15, type: 'hunting', npc: 'npc_q_cheolhyeon',
    objectives: [{ type: 'kill', targetName: 'Blackrobberarcher', count: 200 }],
    rewards: { exp: 26500, sp: 10000 },
  },
  {
    id: 'q_jg_stolen_sword', name: 'Stolen Sword', lv: 16, type: 'collection', npc: 'npc_q_gwaki',
    objectives: [{ type: 'kill', targetName: 'Blackrobber', count: 25 }],
    rewards: { exp: 18800, sp: 3600, gold: 5000 },
  },
  {
    id: 'q_jg_white_tigers', name: 'Hunting White Tigers', lv: 16, type: 'hunting', npc: 'npc_q_machun',
    objectives: [{ type: 'kill', targetName: 'Whitetiger', count: 40 }],
    rewards: { exp: 12500, gold: 4300 },
  },
  {
    id: 'q_jg_herb_delivery', name: 'Herb Delivery', lv: 17, type: 'delivery', npc: 'npc_q_yangyun',
    objectives: [{ type: 'talk', targetId: 'npc_q_jodaesan', count: 1 }],
    rewards: { exp: 14400, sp: 3600, gold: 3800 },
  },
  {
    id: 'q_jg_yangyun_request', name: "Yangyun's Request", lv: 17, type: 'delivery', npc: 'npc_q_yangyun',
    objectives: [{ type: 'talk', targetId: 'npc_q_jinjin', count: 1 }],
    rewards: { exp: 18800, sp: 4500 }, prereq: 'q_jg_herb_delivery',
  },
  {
    id: 'q_jg_black_tiger', name: 'Black Tiger Talon', lv: 17, type: 'collection', npc: 'npc_q_flora',
    objectives: [{ type: 'kill', targetName: 'Whitetiger', count: 60 }],
    rewards: { exp: 60000, sp: 15000, gold: 15700 },
  },
  {
    id: 'q_jg_tiger_skin', name: 'White Tiger Skin', lv: 18, type: 'collection', npc: 'npc_q_jodaesan',
    objectives: [{ type: 'kill', targetName: 'Whitetiger', count: 100 }],
    rewards: { exp: 84600, sp: 20000 }, repeat: 2,
  },
  // ================= DONWHANG (KB 16, §Donwhang Lv 19-40) =================
  {
    id: 'q_dw_bug_eggs', name: 'Ghost Bug Eggs', lv: 19, type: 'collection', npc: 'npc_q_bori',
    objectives: [{ type: 'kill', targetName: 'Earthghost', count: 10 }],
    rewards: { exp: 14800, sp: 3800 },
  },
  {
    id: 'q_dw_folk_remedy', name: 'Folk Remedy', lv: 19, type: 'collection', npc: 'npc_q_bori',
    objectives: [{ type: 'kill', targetName: 'Chakji', count: 100 }],
    rewards: { exp: 112000, sp: 25000, gold: 28500 },
  },
  {
    id: 'q_dw_chakji_hunt', name: 'Chakji Hunting', lv: 19, type: 'hunting', npc: 'npc_q_yeosun',
    objectives: [{ type: 'kill', targetName: 'Strong_chakji', count: 300 }],
    rewards: { exp: 141000, sp: 30000 },
  },
  {
    id: 'q_dw_leegak_secret', name: "Leegak's Secret", lv: 21, type: 'collection', npc: 'npc_q_leegak',
    objectives: [{ type: 'kill', targetName: 'Earthghost', count: 150 }],
    rewards: { exp: 150000, sp: 30000, gold: 37000 },
  },
  {
    id: 'q_dw_peace_maker', name: 'Peace Maker', lv: 22, type: 'collection', npc: 'npc_q_leegak',
    objectives: [{ type: 'kill', targetName: 'Blackrobber', count: 100 }],
    rewards: { exp: 132000, sp: 25000 },
  },
  {
    id: 'q_dw_memorial_horse', name: 'Memorial Service for Horse', lv: 23, type: 'collection', npc: 'npc_q_makgo',
    objectives: [{ type: 'kill', targetName: 'Strong_earthghost', count: 50 }],
    rewards: { exp: 158000, sp: 25000, gold: 35000 },
  },
  {
    id: 'q_dw_trickery', name: 'Trickery', lv: 23, type: 'collection', npc: 'npc_q_manho',
    objectives: [{ type: 'kill', targetName: 'Yeoha', count: 200 }],
    rewards: { exp: 211000, sp: 40000 },
  },
  {
    id: 'q_dw_flying_man', name: 'Flying Man Over Running Man', lv: 24, type: 'collection', npc: 'npc_q_manho',
    objectives: [{ type: 'kill', targetName: 'Yeoha', count: 200 }],
    rewards: { exp: 237000, sp: 40000 }, prereq: 'q_dw_trickery',
  },
  {
    id: 'q_dw_big_win', name: 'A Big Win', lv: 26, type: 'collection', npc: 'npc_q_yeosun',
    objectives: [{ type: 'kill', targetName: 'Gunpowderghost', count: 200 }],
    rewards: { exp: 133000, sp: 20000, gold: 34500 }, repeat: 3,
  },
  {
    id: 'q_dw_earth_ghost', name: 'Earth Ghost Hunting', lv: 27, type: 'hunting', npc: 'npc_q_makgo',
    objectives: [{ type: 'kill', targetName: 'Earthghost', count: 500 }],
    rewards: { exp: 178000, sp: 25000 },
  },
  {
    id: 'q_dw_charm', name: "Earth Taoist's Charm", lv: 28, type: 'collection', npc: 'npc_q_irina',
    objectives: [{ type: 'kill', targetName: 'Strong_earthghost', count: 15 }],
    rewards: { exp: 20000, sp: 4000 },
  },
  {
    id: 'q_dw_bad_charm', name: 'Bad Charm', lv: 29, type: 'collection', npc: 'npc_q_irina',
    objectives: [{ type: 'kill', targetName: 'Strong_earthghost', count: 100 }],
    rewards: { exp: 169000, sp: 30000 }, prereq: 'q_dw_charm', repeat: 2,
  },
  {
    id: 'q_dw_birthday', name: 'Birthday Present Material', lv: 32, type: 'collection', npc: 'npc_q_bori',
    objectives: [{ type: 'kill', targetName: 'Chakji', count: 200 }],
    rewards: { exp: 371000, sp: 40000 }, repeat: 2,
  },
  {
    id: 'q_dw_lost_ring', name: 'Lost Ring', lv: 33, type: 'collection', npc: 'npc_q_manho',
    objectives: [{ type: 'kill', targetName: 'Yeowa', count: 30 }],
    rewards: { exp: 121000, sp: 125000 },
  },
  {
    id: 'q_dw_ancient_elf', name: 'Ancient Elf', lv: 33, type: 'hunting', npc: 'npc_q_dooil',
    objectives: [{ type: 'kill', targetName: 'Yeowa', count: 300 }],
    rewards: { exp: 487000 }, repeat: 3,
  },
  {
    id: 'q_dw_leegak_jewel', name: "Leegeuk's Jewel", lv: 34, type: 'collection', npc: 'npc_q_leegak',
    objectives: [{ type: 'kill', targetName: 'Blackrobber', count: 200 }],
    rewards: { gold: 250000, exp: 250000 },
  },
  {
    id: 'q_dw_yeowa_scale', name: "Yeowa's Scale", lv: 35, type: 'collection', npc: 'npc_q_leegak',
    objectives: [{ type: 'kill', targetName: 'Yeowa', count: 300 }],
    rewards: { exp: 322000, gold: 55000 }, repeat: 5,
  },
  {
    id: 'q_dw_hidden_jewel', name: 'Hidden Jewel', lv: 36, type: 'collection', npc: 'npc_q_haraho',
    objectives: [{ type: 'kill', targetName: 'Blackrobberarcher', count: 100 }],
    rewards: { exp: 537000, sp: 50000, gold: 94000 }, repeat: 5,
  },
  {
    id: 'q_dw_bow', name: "Black Robber Bowsman's Bow", lv: 37, type: 'collection', npc: 'npc_q_haraho',
    objectives: [{ type: 'kill', targetName: 'Blackrobberarcher', count: 200 }],
    rewards: { exp: 592000, sp: 50000, gold: 96500 }, repeat: 3,
  },
  {
    id: 'q_dw_armor_mat', name: 'Looking for Armor Materials', lv: 38, type: 'collection', npc: 'npc_q_agol',
    objectives: [{ type: 'kill', targetName: 'Gunpowderghost', count: 20 }],
    rewards: { exp: 75000, gold: 13500 },
  },
  {
    id: 'q_dw_dead_ravine', name: 'Dead Ravine', lv: 39, type: 'hunting', npc: 'npc_q_agol',
    objectives: [{ type: 'kill', targetName: 'Bigeyeghost', count: 20 }],
    rewards: { exp: 62000, gold: 6000 },
  },
  {
    id: 'q_dw_paddle', name: 'Delivering Paddle', lv: 40, type: 'delivery', npc: 'npc_q_agol',
    objectives: [{ type: 'talk', targetId: 'npc_q_bori', count: 1 }],
    rewards: { exp: 221500, sp: 50000 },
  },
];

async function main(): Promise<void> {
  // 1. PNJ de quête aux coordonnées officielles
  for (const n of NPCS) {
    const p = O2E[n.city](n.pos[0], n.pos[1]);
    const data = {
      name: n.name, npcType: 'quest' as never, modelId: 'guard',
      zoneId: n.city === 'jangan' ? 'zone_jangan' : 'zone_donwhang',
      positionX: p.x, positionY: 0, positionZ: p.z,
      dialogue: `${n.name} vous salue.`,
    };
    await prisma.nPC.upsert({ where: { id: n.id }, update: data, create: { id: n.id, ...data } });
  }
  console.log(`${NPCS.length} PNJ de quête officiels positionnés`);

  // 2. Quêtes officielles
  for (const q of Q) {
    const data = {
      name: q.name,
      description: q.desc ?? `${q.objectives.map((o) => `${o.type === 'kill' ? 'Vaincre' : 'Parler à'} ${o.targetName ?? o.targetId} ×${o.count}`).join(', ')}.`,
      type: q.type as never,
      minLevel: q.lv,
      prerequisite: q.prereq ? [q.prereq] : [],
      objectives: q.objectives as never,
      rewards: { exp: q.rewards.exp, sp: q.rewards.sp ?? 0, gold: q.rewards.gold ?? 0, items: [] } as never,
      startsAt: [q.npc],
      endsAt: [q.endNpc ?? q.npc],
      // repeatable = répétable au-delà de la 1re fois (repeat − 1)
      repeatable: (q.repeat ?? 1) > 1,
      repeatCooldownHrs: 12,
      isDaily: false,
    };
    // id = uuid dans le schéma: utiliser un uuid déterministe par nom
    const { randomUUID } = await import('crypto');
    const existing = await prisma.quest.findFirst({ where: { name: q.name } });
    const id = existing?.id ?? randomUUID();
    await prisma.quest.upsert({ where: { id }, update: data, create: { id, ...data } });
  }
  console.log(`${Q.length} quêtes officielles seedées (Jangan + Donwhang)`);

  const total = await prisma.quest.count();
  console.log(`Total quêtes en base: ${total}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
