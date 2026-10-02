/** Liste les modelId des monstres vivants (diagnostic animations). */
import { PrismaClient } from '@prisma/client';

async function main(): Promise<void> {
  const p = new PrismaClient();
  const mons = await p.monster.findMany({
    where: {},
    select: { modelId: true },
    take: 500,
  });
  const uniq = [...new Set(mons.map((m) => m.modelId))];
  console.log(JSON.stringify(uniq));
  await p.$disconnect();
}
void main();
