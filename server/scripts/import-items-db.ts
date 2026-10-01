/**
 * Import du catalogue officiel d'items (items.json) vers la table Item.
 * Usage: npx tsx scripts/import-items-db.ts
 * Idempotent: upsert par code (colonne unique côté app — name est unique en
 * schéma, on suffixe les doublons).
 */
import * as fs from 'fs';
import * as path from 'path';
import { prisma } from '../src/database/prisma';

interface ItemRow {
  id: number;
  code: string;
  name: string | null;
  typeId1: number;
  typeId2: number;
  typeId3: number;
  price: number | null;
  maxStack: number | null;
  bsrPath: string | null;
  iconPath: string | null;
  attackMin?: number;
  attackMax?: number;
  attackRating?: number;
  restoreAmount?: number;
}

// Type officiel (t1=3, t2) → ItemType du schéma
function mapType(it: ItemRow): { type: string; subType: string | null } {
  if (it.typeId1 !== 3) return { type: 'general', subType: null };
  const code = it.code;
  if (it.typeId2 === 1) {
    if (/SHIELD/i.test(code)) return { type: 'shield', subType: 'shield' };
    if (/SWORD/i.test(code)) return { type: 'weapon', subType: 'sword' };
    if (/BLADE/i.test(code)) return { type: 'weapon', subType: 'blade' };
    if (/SPEAR/i.test(code)) return { type: 'weapon', subType: 'spear' };
    if (/TBLADE/i.test(code)) return { type: 'weapon', subType: 'glaive' };
    if (/BOW/i.test(code)) return { type: 'weapon', subType: 'bow' };
    if (/STAFF|WAND|HARP|DAGGER|CROSSBOW|HAMMER|AXE|SCEPTER/i.test(code)) {
      return { type: 'weapon', subType: 'eu' };
    }
    return { type: 'weapon', subType: null };
  }
  if (/POTION/i.test(code)) return { type: 'potion', subType: /MP_/i.test(code) ? 'mp' : 'hp' };
  // Degré d'équipement depuis le code (ITEM_CH_M_HEAVY_0 5 _A)
  if (/(?:^|_)(?:HEAVY|LIGHT|CLOTHES)_\d+/i.test(code)) {
    if (/_(?:B|A)_02|SHOULDER/i.test(code) && /02_/i.test(code)) return { type: 'shoulder', subType: 'armor' };
    return { type: 'chest', subType: 'armor' };
  }
  if (/RING/i.test(code)) return { type: 'ring', subType: null };
  if (/NECKLACE/i.test(code)) return { type: 'necklace', subType: null };
  if (/EARRING/i.test(code)) return { type: 'earring', subType: null };
  if (/HAT|HELMET|MASK/i.test(code)) return { type: 'helmet', subType: null };
  return { type: 'general', subType: null };
}

// Niveau requis depuis le suffixe de degré (_01_ = degré 1 = niveau 1, chaque
// degré suivant ≈ +8 niveaux — convention officielle d'équipement SRO)
function requiredLevel(code: string): number {
  const m = code.match(/_(\d{2})_[A-Z]?$/);
  if (!m) return 1;
  const deg = parseInt(m[1], 10);
  if (!Number.isFinite(deg) || deg < 1) return 1;
  return Math.max(1, (deg - 1) * 8 + 1);
}

async function main(): Promise<void> {
  const src = path.resolve(__dirname, '../data/game/items.json');
  const items: ItemRow[] = JSON.parse(fs.readFileSync(src, 'utf-8'));
  console.log(`${items.length} items à importer`);

  await prisma.item.deleteMany({ where: { OR: [{ modelId: { not: null } }] } });

  const seenNames = new Set<string>();
  const data: any[] = [];
  for (const it of items) {
    const { type, subType } = mapType(it);
    let name = it.name || it.code;
    if (seenNames.has(name)) name = `${name} (${it.id})`;
    seenNames.add(name);

    const isWeapon = type === 'weapon';
    const isPotion = type === 'potion';
    data.push({
      name,
      type,
      subType,
      rarity: 'common' as const,
      requiredLevel: isPotion ? 1 : requiredLevel(it.code),
      attackPowerMin: isWeapon ? (it.attackMin ?? 0) : 0,
      attackPowerMax: isWeapon ? (it.attackMax ?? 0) : 0,
      // Attaque magique: les armes EU/magiques utilisent la même colonne pour
      // l'instant (mapping fin = phase 4)
      price: BigInt(it.price ?? 0),
      // Les potions s'empilent (gameplay: au moins 50 par slot)
      maxStack: isPotion ? Math.max(it.maxStack ?? 1, 50) : (it.maxStack ?? 1),
      stackable: isPotion || (it.maxStack ?? 1) > 1,
      iconId: it.iconPath,
      modelId: it.bsrPath,
      description: `restore=${it.restoreAmount ?? 0};code=${it.code}`,
    });
  }

  // Insertion par lots
  const BATCH = 500;
  for (let i = 0; i < data.length; i += BATCH) {
    await prisma.item.createMany({ data: data.slice(i, i + BATCH), skipDuplicates: true });
  }
  const count = await prisma.item.count();
  console.log(`Items en base: ${count}`);
  // Vérif express
  const blade = await prisma.item.findFirst({ where: { name: { contains: 'Blade' } } });
  console.log('exemple:', blade?.name, blade?.attackPowerMin, '-', blade?.attackPowerMax);
  await prisma.$disconnect();
}

main().catch((e) => { console.error(e); process.exit(1); });
