/**
 * SRObro - Seed des monstres réels du client officiel
 *
 * Remplace les monstres factices par les vraies données importées de
 * Media.pk2 (characterdata) : stats officielles + modèles BSR réels,
 * placés en anneaux de niveau autour de Jangan.
 *
 * Usage: npx tsx scripts/seed-real-monsters.ts
 */

import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface CharRow {
  id: number;
  code: string;
  name: string | null;
  objName: string;
  isMonster: boolean;
  bsrPath: string | null;
  level: number | null;
  expReward: number | null;
  phyAtkMin: number | null;
  phyAtkMax: number | null;
  magAtkMin: number | null;
  magAtkMax: number | null;
  phyDefense: number | null;
  magDefense: number | null;
  hp: number | null;
}

/** Anneaux de spawn: [niveau min, niveau max, rayon min, rayon max] */
const RINGS: Array<[number, number, number, number]> = [
  [1, 5, 35, 80],
  [6, 10, 90, 160],
  [11, 16, 170, 260],
  [17, 30, 270, 380],
];

async function main(): Promise<void> {
  const charsFile = path.resolve(__dirname, '../data/game/characters.json');
  if (!fs.existsSync(charsFile)) {
    throw new Error('characters.json manquant — lance d\'abord import-textdata.ts');
  }
  const chars: CharRow[] = JSON.parse(fs.readFileSync(charsFile, 'utf8'));

  // Monstres de base (sans clone _CLON) du continent chinois, niveaux 1-30
  const mobs = chars
    .filter((c) =>
      c.isMonster &&
      c.bsrPath &&
      c.level != null && c.level >= 1 && c.level <= 30 &&
      /^MOB_CH_[A-Z0-9_]+$/.test(c.code) &&
      !c.code.endsWith('_CLON') &&
      !c.code.includes('_CHAMP') &&
      c.hp != null && c.hp > 0,
    )
    .sort((a, b) => (a.level ?? 0) - (b.level ?? 0));

  console.log(`Candidats monstres CH niveaux 1-30: ${mobs.length}`);

  // Nettoyage des anciens monstres factices et spawns
  await prisma.monsterSpawn.deleteMany();
  await prisma.monster.deleteMany();
  console.log('Anciens monstres/spawns supprimés');

  let created = 0;
  let spawns = 0;
  const seenStems = new Set<string>();

  for (const m of mobs) {
    const stem = path.basename(m.bsrPath as string).replace(/\.bsr$/i, '').toLowerCase();
    // Plusieurs codes partagent le même modèle (variantes STRONG/CLON...):
    // la liste étant triée par niveau croissant, la variante de base gagne.
    if (seenStems.has(stem)) continue;
    seenStems.add(stem);
    const level = m.level ?? 1;
    const exp = m.expReward ?? Math.max(10, level * 54);
    const sp = Math.max(1, Math.round(exp / 6));
    const aggro = level >= 11 ? 18 : 12; // agressifs à partir des bandits
    const monster = await prisma.monster.create({
      data: {
        id: `mob_${stem}`,
        name: stem.replace(/(^|_)(\w)/g, (_, p1, p2) => (p1 ? ' ' : '') + p2.toUpperCase()),
        level,
        hp: m.hp ?? 50,
        mp: 50,
        attackPowerMin: m.phyAtkMin ?? 5,
        attackPowerMax: m.phyAtkMax ?? (m.phyAtkMin ?? 5) + 3,
        defense: m.phyDefense ?? 10,
        magicalDefense: m.magDefense ?? 10,
        exp: BigInt(exp),
        sp: BigInt(sp),
        aggroRange: aggro,
        attackRange: 2.5,
        moveSpeed: level >= 11 ? 4.5 : 3.5,
        attackSpeed: 1800,
        respawnTime: 15,
        modelId: stem,
      },
    });
    created++;

    // Deux points de spawn par monstre, répartis sur l'anneau correspondant
    const ring = RINGS.find(([lo, hi]) => level >= lo && level <= hi) ?? RINGS[RINGS.length - 1];
    for (let i = 0; i < 2; i++) {
      const angle = (created * 2.399 + i * Math.PI) % (Math.PI * 2); // angle d'or
      const [rMin, rMax] = [ring[2], ring[3]];
      const radius = rMin + ((created * 37) % (rMax - rMin));
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      await prisma.monsterSpawn.create({
        data: {
          monsterId: monster.id,
          zoneId: 'zone_jangan',
          positionX: x,
          positionY: 0,
          positionZ: z,
          rotation: -angle + Math.PI / 2,
          maxCount: level <= 10 ? 6 : 4,
          respawnTime: 15,
          patrolRange: 15 + (level % 5) * 3,
        },
      });
      spawns++;
    }
  }

  console.log(`✅ ${created} monstres réels créés, ${spawns} points de spawn`);
  const sample = await prisma.monster.findMany({ take: 5, orderBy: { level: 'asc' } });
  sample.forEach((s) => console.log(`  ${s.name} lvl ${s.level} hp ${s.hp} exp ${s.exp} model ${s.modelId}`));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
