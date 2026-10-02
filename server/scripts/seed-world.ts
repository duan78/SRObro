/**
 * SRObro — seed-world.ts (Phase B du PROMPT_MAITRE_V2)
 * Peuple le monde chinois complet (cap 90) avec des données OFFICIELLES:
 *  - Zones: plages de niveaux (docs/SRO_KNOWLEDGE_BASE/13_ZONES_OVERVIEW.md)
 *  - NPCs fonctionnels de Donwhang et Hotan (noms officiels KB CITIES_02/03)
 *  - Réseau de téléporteurs (coûts/niveaux, KB MAP_COORDINATES_REFERENCE)
 *  - Anneaux de monstres par ville depuis monsters_official.json (DB vSRO)
 *  - Les 5 uniques de Chine avec points de spawn officiels, timers Tab_RefNest
 *    (TG 6 h, Uruchi 3 h, Isyutaru/Yarkan/Shaitan 6 h) et flag persistent.
 *
 * Conversion coordonnées: officiel (xSROMap PosX/PosY) → moteur:
 *   engineX = PosX − 6460 ; engineZ = PosY − 590  (Jangan 6460/1100 ↔ 0/510)
 *
 * Usage: npx tsx scripts/seed-world.ts
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

/** officiel → moteur */
const toEngine = (posX: number, posY: number): { x: number; z: number } => ({
  x: Math.round(posX - 6460),
  z: Math.round(posY - 590),
});

const CITY = {
  jangan: { zone: 'zone_jangan', engine: { x: 0, z: 510 } },
  donwhang: { zone: 'zone_donwhang', engine: toEngine(3552, 2113) },   // (−2908, 1523)
  hotan: { zone: 'zone_hotan', engine: toEngine(113, 49) },            // (−6347, −541)
};

/** NPCs fonctionnels par ville — noms officiels KB (CITIES_01/02/03). */
function cityNpcs(cityKey: keyof typeof CITY, names: { potion: string; weapon: string; stable: string }) {
  const c = CITY[cityKey];
  const defs = [
    { suffix: 'gatekeeper', name: 'Gatekeeper', modelId: 'npc_teleport', type: 'teleport', dx: 5, dz: -5 },
    { suffix: 'potion', name: names.potion, modelId: 'npc_potion', type: 'shop', dx: 15, dz: 8 },
    { suffix: 'weapon', name: names.weapon, modelId: 'npc_weapon', type: 'shop', dx: -14, dz: 10 },
    { suffix: 'stable', name: names.stable, modelId: 'npc_stable', type: 'stable', dx: -20, dz: -8 },
    { suffix: 'storage', name: 'Storage', modelId: 'npc_storage', type: 'storage', dx: 22, dz: -4 },
    { suffix: 'guard', name: 'Garde', modelId: 'guard', type: 'quest', dx: 0, dz: -14 },
  ];
  return defs.map((d) => ({
    id: `npc_${cityKey}_${d.suffix}`,
    name: d.name,
    npcType: d.type,
    modelId: d.modelId,
    zoneId: c.zone,
    positionX: c.engine.x + d.dx,
    positionY: 0,
    positionZ: c.engine.z + d.dz,
    dialogue: `${d.name} de ${cityKey === 'jangan' ? 'Jangan' : cityKey === 'donwhang' ? 'Donwhang' : 'Hotan'} vous salue.`,
  }));
}

/** Anneaux de spawn: [niveau min, niveau max, rayon min, rayon max, mobs max/spawn] */
const RINGS: Array<[number, number, number, number, number]> = [
  [1, 8, 60, 130, 5],
  [9, 16, 140, 230, 5],
  [17, 25, 250, 350, 4],
  [26, 35, 370, 470, 4],
  [36, 50, 490, 620, 4],
  [51, 70, 650, 800, 3],
  [71, 90, 830, 1000, 3],
];

async function main(): Promise<void> {
  const official: OfficialMonster[] = JSON.parse(fs.readFileSync(OFFICIAL_FILE, 'utf8'));
  console.log(`${official.length} monstres officiels chargés`);

  // ---------- 1. Zones ----------
  const zoneData = [
    { id: 'zone_jangan', name: 'Jangan', levelMin: 1, levelMax: 35 },
    { id: 'zone_donwhang', name: 'Donwhang', levelMin: 20, levelMax: 55 },
    { id: 'zone_hotan', name: 'Hotan', levelMin: 40, levelMax: 90 },
  ];
  for (const z of zoneData) {
    await prisma.zone.upsert({ where: { id: z.id }, update: z, create: z });
  }
  console.log(`Zones: ${zoneData.map((z) => `${z.name} ${z.levelMin}-${z.levelMax}`).join(', ')}`);

  // ---------- 2. NPCs Donwhang/Hotan (Jangan déjà seedé) ----------
  const npcRows = [
    ...cityNpcs('donwhang', { potion: 'Grocery Yeosun', weapon: 'Blacksmith Agol', stable: 'Stable Keeper' }),
    ...cityNpcs('hotan', { potion: 'Grocery Trader Jinjin', weapon: 'Blacksmith Soboi', stable: 'Stable Keeper' }),
  ];
  for (const npc of npcRows) {
    await prisma.nPC.upsert({
      where: { id: npc.id },
      update: npc,
      create: npc,
    });
  }
  console.log(`${npcRows.length} NPCs créés (Donwhang + Hotan)`);

  // ---------- 3. Téléporteurs (coûts KB ~500-5000 gold, niveaux indicatifs) ----------
  await prisma.teleportPoint.deleteMany();
  const tpRows = [
    // Jangan
    { name: 'Donwhang', zoneId: 'zone_jangan', from: { x: CITY.jangan.engine.x + 5, z: CITY.jangan.engine.z - 5 }, dest: 'zone_donwhang', destPos: CITY.donwhang.engine, cost: 500, req: 10 },
    { name: 'Hotan', zoneId: 'zone_jangan', from: { x: CITY.jangan.engine.x + 5, z: CITY.jangan.engine.z - 5 }, dest: 'zone_hotan', destPos: CITY.hotan.engine, cost: 2000, req: 30 },
    // Donwhang
    { name: 'Jangan', zoneId: 'zone_donwhang', from: { x: CITY.donwhang.engine.x + 5, z: CITY.donwhang.engine.z - 5 }, dest: 'zone_jangan', destPos: CITY.jangan.engine, cost: 500, req: 1 },
    { name: 'Hotan', zoneId: 'zone_donwhang', from: { x: CITY.donwhang.engine.x + 5, z: CITY.donwhang.engine.z - 5 }, dest: 'zone_hotan', destPos: CITY.hotan.engine, cost: 1000, req: 30 },
    // Hotan
    { name: 'Donwhang', zoneId: 'zone_hotan', from: { x: CITY.hotan.engine.x + 5, z: CITY.hotan.engine.z - 5 }, dest: 'zone_donwhang', destPos: CITY.donwhang.engine, cost: 1000, req: 1 },
    { name: 'Jangan', zoneId: 'zone_hotan', from: { x: CITY.hotan.engine.x + 5, z: CITY.hotan.engine.z - 5 }, dest: 'zone_jangan', destPos: CITY.jangan.engine, cost: 2000, req: 1 },
  ];
  for (const t of tpRows) {
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
  console.log(`${tpRows.length} téléporteurs officiels (Jangan ↔ Donwhang ↔ Hotan)`);

  // ---------- 4. Population par anneaux (monstres officiels) ----------
  // Les 13 spawns seedés de Jangan (rings MVP) restent; on AJOUTE les anneaux
  // manquants + les deux autres villes. Filtres: rarity normale, CH.
  const zoneFilters: Array<{ city: keyof typeof CITY; labels: RegExp; maxLevel: number }> = [
    { city: 'jangan', labels: /jangan|chine|tutorielle/i, maxLevel: 35 },
    { city: 'donwhang', labels: /donwhang|oasis|tarim/i, maxLevel: 55 },
    { city: 'hotan', labels: /karakoram|taklamakan|roc|oasis|hotan/i, maxLevel: 90 },
  ];

  // Nettoyer les anciens spawns d'anneaux (garder uniques créés plus bas)
  await prisma.monsterSpawn.deleteMany({ where: { persistent: false } });

  let spawnsCreated = 0;
  const usedStems = new Map<string, string>(); // stem → monsterId
  const prettyName = (stem: string): string =>
    stem.charAt(0).toUpperCase() + stem.slice(1); // 'yeoha' → 'Yeoha' (héritage quêtes)
  const ensureMonster = async (m: OfficialMonster, isUnique = false, label?: string): Promise<string> => {
    const existing = usedStems.get(m.stem);
    if (existing) return existing;
    const row = await prisma.monster.upsert({
      where: { id: `mon_${m.stem}` },
      update: { level: m.level, hp: m.hp, exp: BigInt(m.exp), isUnique, name: label ?? prettyName(m.stem) },
      create: {
        id: `mon_${m.stem}`,
        // Nom affichable = stem capitalisé ('Yeoha', 'Mangnyang') — compatible
        // avec le matching des quêtes (monster_yeoha / targetName 'Yeoha')
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

  for (const zf of zoneFilters) {
    const pool = official.filter(
      (m) => m.rarity === 0 && m.level >= 1 && m.level <= zf.maxLevel && zf.labels.test(m.zone),
    );
    for (const [lvMin, lvMax, rMin, rMax, count] of RINGS) {
      if (lvMin > zf.maxLevel) break;
      const band = pool.filter((m) => m.level >= lvMin && m.level <= lvMax);
      if (band.length === 0) continue;
      // Jusqu'à 5 espèces par anneau, réparties sur 3 points de spawn.
      // Tri: niveau puis code le plus COURT d'abord (variantes 'plain' avant
      // _STRONG_/_CHAMP) — garantit Yeoha/Mangnyang plutôt que les clones.
      const sorted = [...new Map(band.map((m) => [m.stem, m])).values()]
        .sort((a, b) => a.level - b.level || a.code.length - b.code.length);
      const picks = sorted.slice(0, 5);
      const c = CITY[zf.city].engine;
      for (let s = 0; s < 3; s++) {
        const m = picks[s % picks.length];
        const monsterId = await ensureMonster(m);
        const angle = (s / 3) * Math.PI * 2 + lvMin * 0.13;
        const radius = rMin + ((rMax - rMin) * (s + 1)) / 3;
        await prisma.monsterSpawn.create({
          data: {
            monsterId, zoneId: CITY[zf.city].zone,
            positionX: c.x + Math.cos(angle) * radius,
            positionY: 0,
            positionZ: c.z + Math.sin(angle) * radius,
            maxCount: count, respawnTime: 20, patrolRange: 25,
          },
        });
        spawnsCreated++;
      }
    }
  }
  console.log(`${spawnsCreated} points de spawn créés (anneaux officiels 3 villes)`);

  // ---------- 5. Uniques de Chine (points officiels, timers Tab_RefNest) ----------
  // KB 15_UNIQUE_BOSSES + MAP_COORDINATES_REFERENCE: TG 6h, Uruchi 3h, autres 6h.
  const UNIQUES: Array<{ code: string; pos: [number, number]; zone: string; timerH: number; label: string }> = [
    { code: 'MOB_CH_TIGERWOMAN', pos: [4853, 94], zone: 'zone_jangan', timerH: 6, label: 'Tiger Girl' },
    { code: 'MOB_OA_URUCHI', pos: [2698, 120], zone: 'zone_donwhang', timerH: 3, label: 'Uruchi' },
    { code: 'MOB_KK_ISYUTARU', pos: [-1552, -94], zone: 'zone_hotan', timerH: 6, label: 'Isyutaru' },
    { code: 'MOB_TK_BONELORD', pos: [-1559, 2550], zone: 'zone_hotan', timerH: 6, label: 'Lord Yarkan' },
    { code: 'MOB_RM_TAHOMET', pos: [-4509, -468], zone: 'zone_hotan', timerH: 6, label: 'Demon Shaitan' },
  ];
  for (const u of UNIQUES) {
    const m = official.find((o) => o.code === u.code);
    if (!m) { console.warn(`  ⚠ ${u.code} introuvable dans les données officielles`); continue; }
    const monsterId = await ensureMonster(m, true, u.label);
    const e = toEngine(u.pos[0], u.pos[1]);
    await prisma.monsterSpawn.create({
      data: {
        monsterId, zoneId: u.zone,
        positionX: e.x, positionY: 0, positionZ: e.z,
        maxCount: 1, respawnTime: u.timerH * 3600, patrolRange: 60,
        persistent: true,
      },
    });
    console.log(`  ⭐ ${u.label} (${u.code}) lvl ${m.level} — ${m.hp.toLocaleString('fr')} HP, respawn ${u.timerH} h @ (${e.x}, ${e.z})`);
  }

  const totals = await prisma.monsterSpawn.count();
  console.log(`\nTerminé: ${totals} points de spawn au total en base.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
