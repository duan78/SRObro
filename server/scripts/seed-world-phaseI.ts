/**
 * SRObro — seed-world-phaseI.ts (Phase I du PROMPT_MAITRE_V2: Europe + Égypte)
 *
 * Étend le monde au-delà du cap 90 chinois avec des données OFFICIELLES:
 *  - Constantinople (départ EU 1-24), Asia Minor (20-30), Samarkand (29-45),
 *    Alexandria + déserts égyptiens (95-120).
 *  - NPCs officiels (KB CITIES_04/05 + NPCS_COORDINATES.md) placés par offsets
 *    RELATIFS officiels autour de l'ancre moteur de chaque ville.
 *  - Réseau de Dimensional Gates officiel (KB MAP_COORDINATES_REFERENCE.md):
 *    Constantinople↔Samarkand, Samarkand↔Hotan, Jangan/Hotan↔Alexandria S/N.
 *  - Anneaux de monstres MOB_EU/MOB_AM/MOB_CA/MOB_SD (DB vSRO officielle).
 *  - Uniques: Cerberus (693 072 HP) et Captain Ivy — timers 6 h.
 *
 * ANCRAGE (découverte clé phase I): la grille régions du CLIENT est la vérité
 * (nv_RRCC.nvm / <X>/<Z>.o / minimap). Les PosX/PosY « officiels » xSROMap ne
 * sont PAS alignés sur cette grille: ils sont utilisés uniquement en offsets
 * RELATIFS intra-ville (échelle 1:1, 1 région = 1920 unités partout).
 *   Constantinople: bâtiments euro_constan_* → régions 103-106×77-80
 *   Samarkand: ville murée (minimap + samarkand_street_*) → région 87x86
 *   Alexandria: palais minga/sphinx → régions 90-92×48-51
 *
 * Usage: npx tsx scripts/seed-world-phaseI.ts
 */
import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface OfficialMonster {
  code: string; stem: string; zone: string; level: number; hp: number; mp: number;
  exp: number; atkMin: number; atkMax: number; atkRating: number; magRating: number;
  parry: number; rarity: number; country: number; walkSpeed: number; runSpeed: number;
}

const OFFICIAL_FILE = path.resolve(__dirname, '../data/game/monsters_official.json');

/**
 * Ancres moteur des villes phase I (grille client réelle, cf. en-tête).
 * officialCenter = centre PosX/PosY officiel xSROMap correspondant.
 */
const CITY = {
  constantinople: {
    zone: 'zone_constantinople', engine: { x: 69370, z: 15846 },
    official: { x: -10680, y: 2600 },
  },
  asia_minor: {
    zone: 'zone_asia_minor', engine: { x: 33600, z: 27840 },
    official: { x: -6990, y: 1987 }, // centre des spawns officiels Ivy (KB)
  },
  samarkand: {
    zone: 'zone_samarkand', engine: { x: 35520, z: 29760 },
    official: { x: -5180, y: 2890 },
  },
  alexandria: {
    zone: 'zone_alexandria', engine: { x: 40300, z: -42300 },
    official: { x: -16600, y: -300 }, // Alexandria South (KB CITIES_04)
  },
} as const;

/** Position officielle (relative au centre officiel de la ville) → moteur. */
function rel(
  city: keyof typeof CITY,
  posX: number,
  posY: number,
): { x: number; z: number } {
  const c = CITY[city];
  return {
    x: Math.round(c.engine.x + (posX - c.official.x)),
    z: Math.round(c.engine.z + (posY - c.official.y)),
  };
}

/** NPCs officiels par ville — KB CITIES_05 (Constantinople), CITIES_04
 *  (Alexandria S/N), NPCS_COORDINATES.md (Samarkand). */
function npcDefs(): Array<{
  id: string; name: string; npcType: string; modelId: string;
  zoneId: string; x: number; z: number; dialogue: string;
}> {
  const rows: Array<{ suffix: string; name: string; npcType: string; modelId: string; posX: number; posY: number }> = [
    // ---- Constantinople (CITIES_05:81-149) ----
    { suffix: 'gate', name: 'Dimensional Gate', npcType: 'teleport', modelId: 'npc_teleport', posX: -10682, posY: 2585 },
    { suffix: 'weapon', name: 'Weapon Trader Balbardo', npcType: 'shop', modelId: 'npc_weapon', posX: -10674, posY: 2649 },
    { suffix: 'protector', name: 'Protector Trader Jatomo', npcType: 'shop', modelId: 'npc_weapon', posX: -10753, posY: 2604 },
    { suffix: 'grocery', name: 'Grocery Trader Bajel', npcType: 'shop', modelId: 'npc_potion', posX: -10682, posY: 2521 },
    { suffix: 'potion', name: 'Medicine Supplier Shadi', npcType: 'shop', modelId: 'npc_potion', posX: -10702, posY: 2605 },
    { suffix: 'valuables', name: 'Valuables Dealer Zephyd', npcType: 'shop', modelId: 'npc_potion', posX: -10705, posY: 2598 },
    { suffix: 'stable', name: 'Stable-Keeper Treno', npcType: 'stable', modelId: 'npc_stable', posX: -10765, posY: 2533 },
    { suffix: 'consignment', name: 'Consignment Merchant Juel', npcType: 'shop', modelId: 'npc_potion', posX: -10750, posY: 2522 },
    { suffix: 'guild', name: 'Guild Manager Gilt', npcType: 'quest', modelId: 'guard', posX: -10552, posY: 2329 },
    { suffix: 'inn', name: 'Inn Master Sikeulro', npcType: 'storage', modelId: 'npc_storage', posX: -10617, posY: 2581 },
    { suffix: 'harbor', name: 'Harbor Manager Georion', npcType: 'quest', modelId: 'guard', posX: -10408, posY: 2503 },
    { suffix: 'guide', name: 'Guide Lipria', npcType: 'quest', modelId: 'guard', posX: -10617, posY: 2921 },
    { suffix: 'adventurer', name: 'Adventurer Demetri', npcType: 'quest', modelId: 'guard', posX: -10617, posY: 2554 },
    { suffix: 'guard', name: 'Soldier Kartino', npcType: 'quest', modelId: 'guard', posX: -10495, posY: 2473 },
    { suffix: 'clergy', name: 'Clergy Gabriel', npcType: 'quest', modelId: 'guard', posX: -10387, posY: 2776 },
    { suffix: 'hunter_union', name: 'Hunter Associate Adria', npcType: 'quest', modelId: 'guard', posX: -10835, posY: 2703 },
    { suffix: 'merchant_union', name: 'Merchant Associate Tana', npcType: 'quest', modelId: 'guard', posX: -10735, posY: 2513 },
    { suffix: 'smuggler', name: 'Smuggler Raul', npcType: 'quest', modelId: 'guard', posX: -10969, posY: 2543 },
    // ---- Samarkand (NPCS_COORDINATES.md:236-260) ----
    { suffix: 'gate', name: 'Dimensional Gate', npcType: 'teleport', modelId: 'npc_teleport', posX: -5184, posY: 2891 },
    { suffix: 'goods', name: 'Goods Supplier Julia', npcType: 'shop', modelId: 'npc_potion', posX: -5212, posY: 2908 },
    { suffix: 'merchant_union', name: 'Merchant Associate Karen', npcType: 'quest', modelId: 'guard', posX: -5117, posY: 2870 },
    { suffix: 'hunter_union', name: 'Hunter Associate Shahad', npcType: 'quest', modelId: 'guard', posX: -5143, posY: 3008 },
    { suffix: 'smuggler', name: 'Smuggler Barus', npcType: 'quest', modelId: 'guard', posX: -5234, posY: 2734 },
    // ---- Alexandria South — marché (CITIES_04:77-92) ----
    { suffix: 'gate_s', name: 'Dimensional Gate (South)', npcType: 'teleport', modelId: 'npc_teleport', posX: -16643, posY: -275 },
    { suffix: 'weapon_s', name: 'Weapon Trader Hemaka', npcType: 'shop', modelId: 'npc_weapon', posX: -16739, posY: -277 },
    { suffix: 'armor_s', name: 'Armor Trader Sharon', npcType: 'shop', modelId: 'npc_weapon', posX: -16723, posY: -296 },
    { suffix: 'grocery_s', name: 'Grocery Trader Melit', npcType: 'shop', modelId: 'npc_potion', posX: -16579, posY: -279 },
    { suffix: 'potion_s', name: 'Potion Merchant Titi', npcType: 'shop', modelId: 'npc_potion', posX: -16624, posY: -358 },
    { suffix: 'storage_s', name: 'Storage Keeper Khamererne', npcType: 'storage', modelId: 'npc_storage', posX: -16478, posY: -304 },
    { suffix: 'stable_s', name: 'Stable Master Nefret', npcType: 'stable', modelId: 'npc_stable', posX: -16425, posY: -220 },
    { suffix: 'specialty_s', name: 'Specialty Trader Wasdi', npcType: 'shop', modelId: 'npc_potion', posX: -16593, posY: 0 },
    // ---- Alexandria North — palais/jobs/port (CITIES_04:96-121) ----
    { suffix: 'gate_n', name: 'Dimensional Gate (North)', npcType: 'teleport', modelId: 'npc_teleport', posX: -16148, posY: 76 },
    { suffix: 'governor', name: 'Governor Senmute', npcType: 'quest', modelId: 'guard', posX: -16762, posY: -154 },
    { suffix: 'guild_n', name: 'Guild Manager Sennefer', npcType: 'quest', modelId: 'guard', posX: -16640, posY: -45 },
    { suffix: 'trader_union', name: 'Trader Union President Naunakt', npcType: 'quest', modelId: 'guard', posX: -16624, posY: 11 },
    { suffix: 'hunter_union_n', name: 'Hunter Union President Narmer', npcType: 'quest', modelId: 'guard', posX: -16625, posY: -94 },
    { suffix: 'thief_union', name: 'Thief Union President Tausert', npcType: 'quest', modelId: 'guard', posX: -16092, posY: -7 },
    { suffix: 'weapon_n', name: 'Weapon Trader Chunmoo', npcType: 'shop', modelId: 'npc_weapon', posX: -16255, posY: -19 },
    { suffix: 'armor_n', name: 'Armor Trader Viviana', npcType: 'shop', modelId: 'npc_weapon', posX: -16256, posY: 9 },
    { suffix: 'grocery_n', name: 'Grocery Trader Kapra', npcType: 'shop', modelId: 'npc_potion', posX: -16197, posY: 53 },
    { suffix: 'potion_n', name: 'Potion Merchant Thiara', npcType: 'shop', modelId: 'npc_potion', posX: -16237, posY: 35 },
    { suffix: 'storage_n', name: 'Storage Keeper Asagon', npcType: 'storage', modelId: 'npc_storage', posX: -16082, posY: 24 },
    { suffix: 'harbor_n', name: 'Harbor Manager Marwa', npcType: 'quest', modelId: 'guard', posX: -16542, posY: 371 },
    { suffix: 'lighthouse', name: 'Lighthouse Keeper Snefru', npcType: 'quest', modelId: 'guard', posX: -16675, posY: 431 },
  ];

  return rows.map((r, i) => {
    const isAlex = r.suffix.endsWith('_s') || r.suffix.endsWith('_n');
    const isSmk = r.posX > -6000 && r.posX < -4500;
    const city: keyof typeof CITY = isAlex ? 'alexandria' : isSmk ? 'samarkand' : 'constantinople';
    const prefix = city === 'alexandria' ? 'alex' : city === 'samarkand' ? 'smk' : 'cst';
    const p = rel(city, r.posX, r.posY);
    return {
      id: `npc_${prefix}_${r.suffix}_${i}`,
      name: r.name,
      npcType: r.npcType,
      modelId: r.modelId,
      zoneId: CITY[city].zone,
      x: p.x,
      z: p.z,
      dialogue: `${r.name} vous salue.`,
    };
  });
}

/** Anneaux [lvMin, lvMax, rMin, rMax, count] — adaptés par zone. */
const RINGS_EU: Array<[number, number, number, number, number]> = [
  [1, 8, 80, 160, 5],
  [9, 16, 200, 320, 5],
  [17, 24, 380, 520, 4],
];

async function main(): Promise<void> {
  const official: OfficialMonster[] = JSON.parse(fs.readFileSync(OFFICIAL_FILE, 'utf8'));
  console.log(`${official.length} monstres officiels chargés`);

  // ---------- 1. Zones ----------
  const zoneData = [
    { id: 'zone_constantinople', name: 'Constantinople', levelMin: 1, levelMax: 24 },
    { id: 'zone_asia_minor', name: 'Asia Minor', levelMin: 20, levelMax: 30 },
    { id: 'zone_samarkand', name: 'Samarkand', levelMin: 29, levelMax: 45 },
    { id: 'zone_alexandria', name: 'Alexandria', levelMin: 95, levelMax: 120 },
  ];
  for (const z of zoneData) {
    await prisma.zone.upsert({ where: { id: z.id }, update: z, create: z });
  }
  console.log(`Zones: ${zoneData.map((z) => `${z.name} ${z.levelMin}-${z.levelMax}`).join(', ')}`);

  // ---------- 2. NPCs officiels ----------
  const npcs = npcDefs();
  for (const n of npcs) {
    const data = {
      name: n.name, npcType: n.npcType as never, modelId: n.modelId,
      zoneId: n.zoneId, positionX: n.x, positionY: 0, positionZ: n.z,
      dialogue: n.dialogue,
    };
    await prisma.nPC.upsert({ where: { id: n.id }, update: data, create: { id: n.id, ...data } });
  }
  console.log(`${npcs.length} NPCs officiels créés (Constantinople 18, Samarkand 5, Alexandria 19)`);

  // ---------- 3. Téléporteurs (graphe officiel + gates d'Égypte) ----------
  // KB MAP_COORDINATES_REFERENCE.md:95-116 — coûts ~5000 (réduit ~10 sous lv20).
  const JANGAN = { x: 0, z: 510 };
  const HOTAN = { x: -6347, z: -541 };
  const tps: Array<{ name: string; zoneId: string; from: { x: number; z: number }; dest: string; destPos: { x: number; z: number }; cost: number; req: number }> = [
    // Constantinople → Samarkand (seule destination officielle de sa gate)
    { name: 'Samarkand', zoneId: 'zone_constantinople', from: rel('constantinople', -10682, 2585), dest: 'zone_samarkand', destPos: CITY.samarkand.engine, cost: 5000, req: 1 },
    // Samarkand → Constantinople + Hotan
    { name: 'Constantinople', zoneId: 'zone_samarkand', from: rel('samarkand', -5184, 2891), dest: 'zone_constantinople', destPos: CITY.constantinople.engine, cost: 5000, req: 1 },
    { name: 'Hotan', zoneId: 'zone_samarkand', from: rel('samarkand', -5184, 2891), dest: 'zone_hotan', destPos: HOTAN, cost: 5000, req: 30 },
    // Hotan → Samarkand + Alexandria S/N (officiel)
    { name: 'Samarkand', zoneId: 'zone_hotan', from: { x: HOTAN.x + 5, z: HOTAN.z - 5 }, dest: 'zone_samarkand', destPos: CITY.samarkand.engine, cost: 5000, req: 1 },
    { name: 'Alexandria (South)', zoneId: 'zone_hotan', from: { x: HOTAN.x + 5, z: HOTAN.z - 5 }, dest: 'zone_alexandria', destPos: rel('alexandria', -16643, -275), cost: 5000, req: 90 },
    { name: 'Alexandria (North)', zoneId: 'zone_hotan', from: { x: HOTAN.x + 5, z: HOTAN.z - 5 }, dest: 'zone_alexandria', destPos: rel('alexandria', -16148, 76), cost: 5000, req: 90 },
    // Jangan → Alexandria S/N (officiel)
    { name: 'Alexandria (South)', zoneId: 'zone_jangan', from: { x: JANGAN.x + 5, z: JANGAN.z - 5 }, dest: 'zone_alexandria', destPos: rel('alexandria', -16643, -275), cost: 5000, req: 90 },
    { name: 'Alexandria (North)', zoneId: 'zone_jangan', from: { x: JANGAN.x + 5, z: JANGAN.z - 5 }, dest: 'zone_alexandria', destPos: rel('alexandria', -16148, 76), cost: 5000, req: 90 },
    // Alexandria S/N → Jangan, Hotan, S↔N
    { name: 'Jangan', zoneId: 'zone_alexandria', from: rel('alexandria', -16643, -275), dest: 'zone_jangan', destPos: JANGAN, cost: 5000, req: 1 },
    { name: 'Hotan', zoneId: 'zone_alexandria', from: rel('alexandria', -16643, -275), dest: 'zone_hotan', destPos: HOTAN, cost: 5000, req: 1 },
    { name: 'Alexandria (North)', zoneId: 'zone_alexandria', from: rel('alexandria', -16643, -275), dest: 'zone_alexandria', destPos: rel('alexandria', -16148, 76), cost: 500, req: 1 },
    { name: 'Jangan', zoneId: 'zone_alexandria', from: rel('alexandria', -16148, 76), dest: 'zone_jangan', destPos: JANGAN, cost: 5000, req: 1 },
    { name: 'Hotan', zoneId: 'zone_alexandria', from: rel('alexandria', -16148, 76), dest: 'zone_hotan', destPos: HOTAN, cost: 5000, req: 1 },
    { name: 'Alexandria (South)', zoneId: 'zone_alexandria', from: rel('alexandria', -16148, 76), dest: 'zone_alexandria', destPos: rel('alexandria', -16643, -275), cost: 500, req: 1 },
    // Gates internes d'Égypte (KB CITIES_04:156-161)
    { name: 'Storm and Cloud Desert', zoneId: 'zone_alexandria', from: rel('alexandria', -15122, 126), dest: 'zone_alexandria', destPos: rel('alexandria', -14700, -250), cost: 0, req: 100 },
    { name: 'Kings Valley', zoneId: 'zone_alexandria', from: rel('alexandria', -15842, -1205), dest: 'zone_alexandria', destPos: rel('alexandria', -14950, -3266), cost: 0, req: 100 },
  ];
  // Idempotence: supprimer toute route phase I (zones nouvelles, destinations
  // nouvelles, gates d'Égypte) puis re-créer. Le réseau chinois d'origine
  // (Jangan↔Donwhang↔Hotan du seed-world.ts) est préservé.
  const PHASE_I_NAMES = ['Samarkand', 'Constantinople', 'Alexandria (South)', 'Alexandria (North)', 'Storm and Cloud Desert', 'Kings Valley'];
  await prisma.teleportPoint.deleteMany({
    where: {
      OR: [
        { zoneId: { in: ['zone_constantinople', 'zone_samarkand', 'zone_alexandria'] } },
        { destinationZoneId: { in: ['zone_constantinople', 'zone_samarkand', 'zone_alexandria'] } },
        { name: { in: PHASE_I_NAMES } },
      ],
    },
  });
  for (const t of tps) {
    await prisma.teleportPoint.create({
      data: {
        name: t.name, zoneId: t.zoneId,
        positionX: t.from.x, positionY: 0, positionZ: t.from.z,
        destinationZoneId: t.dest,
        destinationPositionX: t.destPos.x, destinationPositionY: 0, destinationPositionZ: t.destPos.z,
        cost: t.cost, requiredLevel: t.req,
      },
    });
  }
  console.log(`${tps.length} téléporteurs officiels phase I (Constantinople↔Samarkand, Hotan/Jangan↔Alexandria, gates Égypte)`);

  // ---------- 4. Anneaux de monstres ----------
  const usedStems = new Map<string, string>();
  const prettyName = (stem: string): string => stem.charAt(0).toUpperCase() + stem.slice(1);
  const ensureMonster = async (m: OfficialMonster, isUnique = false, label?: string): Promise<string> => {
    const existing = usedStems.get(m.stem);
    if (existing) return existing;
    const row = await prisma.monster.upsert({
      where: { id: `mon_${m.stem}` },
      update: { level: m.level, hp: m.hp, exp: BigInt(m.exp), isUnique, name: label ?? prettyName(m.stem) },
      create: {
        id: `mon_${m.stem}`,
        name: label ?? prettyName(m.stem),
        level: m.level, hp: m.hp, mp: m.mp,
        attackPowerMin: m.atkMin, attackPowerMax: Math.max(m.atkMax, m.atkMin),
        defense: 2 + m.level * 2, magicalDefense: 2 + m.level * 2,
        exp: BigInt(m.exp), sp: BigInt(Math.max(1, Math.round(m.exp * 0.1))),
        modelId: m.stem, isUnique,
      },
    });
    usedStems.set(m.stem, row.id);
    return row.id;
  };

  // Nettoyer les anciens spawns phase I (uniques + anneaux des 4 zones)
  await prisma.monsterSpawn.deleteMany({
    where: { zoneId: { in: ['zone_constantinople', 'zone_asia_minor', 'zone_samarkand', 'zone_alexandria'] } },
  });

  interface RingDef { city: keyof typeof CITY; pool: OfficialMonster[]; rings: Array<[number, number, number, number, number]> }
  const euPool = official.filter((m) => m.code.startsWith('MOB_EU_') && m.rarity === 0 && !/npc|npa/i.test(m.stem) && m.level <= 24);
  const amPool = official.filter((m) => m.code.startsWith('MOB_AM_') && m.rarity === 0 && !/npc|npa/i.test(m.stem));
  const caPool = official.filter((m) => m.code.startsWith('MOB_CA_') && m.rarity === 0 && !/npc|npa/i.test(m.stem));
  const sdPool = official.filter((m) => m.code.startsWith('MOB_SD_') && m.rarity === 0 && !/npc|npa|summon/i.test(m.stem) && m.level >= 100 && m.level <= 110 && !/_(2|3)$/.test(m.stem));

  const defs: RingDef[] = [
    { city: 'constantinople', pool: euPool, rings: RINGS_EU },
    { city: 'asia_minor', pool: amPool, rings: [[20, 25, 90, 180, 5], [26, 30, 220, 340, 4]] },
    { city: 'samarkand', pool: caPool, rings: [[29, 35, 100, 200, 5], [36, 45, 260, 420, 4]] },
    // Désert égyptien: anneaux larges à l'EST de la ville (Delta/déserts)
    { city: 'alexandria', pool: sdPool, rings: [[95, 103, 500, 1000, 4], [104, 110, 1100, 1800, 4]] },
  ];

  let spawnsCreated = 0;
  for (const d of defs) {
    const c = CITY[d.city].engine;
    // Les mobs d'Égypte peuplent le désert à l'est de la ville (gates Delta)
    const center = d.city === 'alexandria' ? { x: c.x + 2600, z: c.z - 1200 } : c;
    for (const [lvMin, lvMax, rMin, rMax, count] of d.rings) {
      const band = d.pool.filter((m) => m.level >= lvMin && m.level <= lvMax);
      if (band.length === 0) continue;
      const sorted = [...new Map(band.map((m) => [m.stem, m])).values()]
        .sort((a, b) => a.level - b.level || a.code.length - b.code.length);
      const picks = sorted.slice(0, 5);
      for (let s = 0; s < 3; s++) {
        const m = picks[s % picks.length];
        const monsterId = await ensureMonster(m);
        const angle = (s / 3) * Math.PI * 2 + lvMin * 0.13;
        const radius = rMin + ((rMax - rMin) * (s + 1)) / 3;
        await prisma.monsterSpawn.create({
          data: {
            monsterId, zoneId: CITY[d.city].zone,
            positionX: center.x + Math.cos(angle) * radius,
            positionY: 0,
            positionZ: center.z + Math.sin(angle) * radius,
            maxCount: count, respawnTime: 20, patrolRange: 25,
          },
        });
        spawnsCreated++;
      }
    }
    console.log(`  ${d.city}: ${d.pool.length} espèces disponibles (lv ${d.pool[0]?.level}-${d.pool[d.pool.length - 1]?.level})`);
  }
  console.log(`${spawnsCreated} points de spawn phase I créés`);

  // ---------- 5. Uniques Europe (KB 15_UNIQUE_BOSSES / CITIES_05:256) ----------
  const UNIQUES: Array<{ code: string; city: keyof typeof CITY; officialPos: [number, number]; timerH: number; label: string }> = [
    // Cerberus 24 — East Europe, spawns officiels X −12488..−11332 (centre −11910/1761)
    { code: 'MOB_EU_KERBEROS', city: 'constantinople', officialPos: [-11910, 1761], timerH: 6, label: 'Cerberus' },
    // Captain Ivy 30 — Asia Minor, spawns officiels X −7587..−6390 (centre −6989/1987)
    { code: 'MOB_AM_IVY_L3', city: 'asia_minor', officialPos: [-6989, 1987], timerH: 6, label: 'Captain Ivy' },
  ];
  for (const u of UNIQUES) {
    const m = official.find((o) => o.code === u.code);
    if (!m) { console.warn(`  ⚠ ${u.code} introuvable`); continue; }
    const monsterId = await ensureMonster(m, true, u.label);
    const p = rel(u.city, u.officialPos[0], u.officialPos[1]);
    await prisma.monsterSpawn.create({
      data: {
        monsterId, zoneId: CITY[u.city].zone,
        positionX: p.x, positionY: 0, positionZ: p.z,
        maxCount: 1, respawnTime: u.timerH * 3600, patrolRange: 60,
        persistent: true,
      },
    });
    console.log(`  ⭐ ${u.label} lvl ${m.level} — ${m.hp.toLocaleString('fr')} HP, respawn ${u.timerH} h @ (${p.x}, ${p.z}) [${CITY[u.city].zone}]`);
  }

  // ---------- 6. Cap 120: maîtrises jusqu'à 120 (KB 02/03) ----------
  // Plafond individuel = niveau du perso (géré au levelup); plafond total
  // CH 3×niveau (360) / EU 2×niveau (240) appliqué dans AuthHandlers.
  await prisma.mastery.updateMany({ data: { maxLevel: 120 } });
  console.log('Maîtrises: maxLevel → 120 (cap 120, phase I)');

  const totals = await prisma.monsterSpawn.count();
  const zonesTotal = await prisma.zone.count();
  console.log(`\nTerminé: ${zonesTotal} zones, ${totals} points de spawn au total en base.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
