import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  const p = new PrismaClient();
  const npcs = await p.nPC.findMany({ take: 10 });
  console.log(JSON.stringify(npcs.map((n) => ({ id: n.id, name: n.name, type: (n as any).npcType ?? (n as any).type ?? '?', model: (n as any).modelId ?? (n as any).model ?? '?' }))));
  await p.$disconnect();
}
void main();
