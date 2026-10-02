import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  const p = new PrismaClient();
  const mons = await p.monster.findMany({ take: 300 });
  // coordonnées moteur: x = PosX-6460, z = PosY-590 — mais en base ce sont déjà les coordonnées moteur
  const near = mons.filter(m => Math.hypot((m as any).x - 300, (m as any).z - 800) < 400).slice(0, 5);
  const sample = mons.slice(0, 3).map(m => ({ id: m.id, x: (m as any).x, z: (m as any).z, model: m.modelId }));
  console.log(JSON.stringify({ total: mons.length, near: near.length, sample }));
  await p.$disconnect();
}
void main();
