import { io } from 'socket.io-client';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
async function main() {
  const old = await prisma.character.findUnique({ where: { name: 'DrpV4chk' } });
  if (old) await prisma.character.delete({ where: { id: old.id } });
  const sock = io('http://localhost:3001', { transports: ['websocket'] });
  const req = (ev: string, data: any, ms = 10000): Promise<any> => new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('timeout ' + ev)), ms);
    sock.emit(ev, data, (r: any) => { clearTimeout(t); res(r); });
  });
  const chats: string[] = [];
  sock.on('chat', (d: any) => chats.push(String((d?.data ?? d)?.message ?? '')));
  await new Promise<void>((r) => sock.on('connect', r));
  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const created = await req('character:create', { name: 'DrpV4chk', race: 'chinese', gender: 'male' });
  const id = created?.character?.id;
  await prisma.character.update({ where: { id }, data: { level: 105 } });
  await req('character:select', { characterId: id }, 20000);
  const chat = (m: string) => sock.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
  await chat('/tp 42900 -44700');
  await wait(2500);
  let drops = 0, kills = 0;
  for (let i = 0; i < 120; i++) {
    chat('/spawn MOB_SD_UNEG 1');
    await wait(900);
    chat('/kill');
    await wait(2600);
    kills++;
    if (chats.some(c => /droppé/.test(c))) { drops++; chats.length = 0; }
  }
  require('fs').writeFileSync('.tmp_drop.txt', `kills=${kills} drops=${drops} taux=${(drops / kills * 100).toFixed(1)}%`);
  await req('character:delete', { characterId: id }).catch(() => undefined);
  const still = await prisma.character.findUnique({ where: { id } });
  if (still) await prisma.character.delete({ where: { id } });
  await prisma.$disconnect();
  sock.disconnect();
  process.exit(0);
}
main().catch(e => { require('fs').writeFileSync('.tmp_drop.txt', 'FATAL ' + e.message); process.exit(1); });
