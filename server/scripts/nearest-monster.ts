import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  const p = new PrismaClient();
  const mons = await p.monster.findMany({ take: 300 });
  type M = { id: string; name: string; modelId: string; position: any; isAlive: boolean };
  const alive = mons.filter(m => (m as any).isAlive !== false);
  const withPos = alive.map(m => {
    const pos = (m as any).position;
    const x = typeof pos === 'object' ? pos?.x : (m as any).x;
    const z = typeof pos === 'object' ? pos?.z : (m as any).z;
    return { id: m.id, name: m.name, modelId: m.modelId, x, z, d: Math.hypot(x - 300, z - 800) };
  }).filter(m => Number.isFinite(m.d)).sort((a, b) => a.d - b.d);
  console.log(JSON.stringify({ n: withPos.length, nearest: withPos.slice(0, 5) }));
  await p.$disconnect();
}
void main();
