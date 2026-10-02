import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  const p = new PrismaClient();
  const m = await p.monster.findFirst();
  console.log(JSON.stringify(m, (k, v) => typeof v === 'bigint' ? v.toString() : v).slice(0, 600));
  await p.$disconnect();
}
void main();
