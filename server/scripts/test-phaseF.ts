/**
 * Test PHASE F (V2): guildes — invitation LIVRÉE au client cible + acceptation.
 * Vérifie:
 *  1. Création de guilde (500k or, KB 17_GUILD_SYSTEM).
 *  2. guild:invite → le CIBLE reçoit 'guild:invited' (relay Phase F).
 *  3. guild:accept_invite → membre ajouté (GuildMember en base).
 * Usage: npx tsx scripts/test-phaseF.ts
 */
import { io } from 'socket.io-client';

let failures = 0;
const check = (label: string, ok: boolean, detail = ''): void => {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function loginChar(label: string): Promise<any> {
  const socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => socket.on('connect', r));
  socket.emit('heartbeat', { t: Date.now() });
  const req = (ev: string, data: any = {}, timeout = 20000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = label + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  await req('character:select', { characterId: create.character.id });
  const invited: any[] = [];
  socket.on('guild:invited', (d: any) => invited.push(d.data ?? d));
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  return { socket, req, invited, chats, id: create.character.id, name: nm };
}

async function main(): Promise<void> {
  const A = await loginChar('GldA'); // fondateur
  const B = await loginChar('GldB'); // invité
  await wait(2000);

  // Or officiel (500 000 — coût de création KB)
  // NB: deux /commandes GM d'affilée = deux saveToDatabase concurrents qui
  // se marchent dessus (last-write-wins) — sérialiser avec des délais
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/level 25', channel: 'general' } });
  await wait(1500);
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/gold 600000', channel: 'general' } });
  await wait(2000);

  const gname = 'LesRoutiers' + Date.now().toString(36).slice(-4);
  const createdEv: any[] = [];
  A.socket.on('guild:created', (g: any) => createdEv.push(g));
  A.socket.emit('guild:create', { name: gname });
  for (let i = 0; i < 30 && createdEv.length === 0; i++) await wait(400);
  const created = createdEv[0];
  check('Guilde créée (coût 500k)', !!created?.id, JSON.stringify(created ?? {}).slice(0, 80));

  // Pas d'ack sur guild:invite: événement-driven
  A.socket.emit('guild:invite', { guildId: created?.id, targetCharacterId: B.id });
  for (let i = 0; i < 20 && B.invited.length === 0; i++) await wait(400);
  check('Invitation reçue par la CIBLE (relay Phase F)', B.invited.length > 0,
    JSON.stringify(B.invited[0] ?? {}).slice(0, 80));

  const joined: any[] = [];
  B.socket.on('guild:joined', (g: any) => joined.push(g.data ?? g));
  if (B.invited.length) {
    B.socket.emit('guild:accept_invite', { guildId: B.invited[0].guildId });
    for (let i = 0; i < 20 && joined.length === 0; i++) await wait(400);
    check('Acceptation → membre ajouté', joined.length > 0, JSON.stringify(joined[0] ?? {}).slice(0, 60));
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const member = await prisma.guildMember.findFirst({
      where: { characterId: B.id },
      include: { guild: true },
    });
    check('GuildMember en base (guilde correcte)', !!member && member.guild.name === gname,
      member ? member.guild.name : 'absent');
    await prisma.$disconnect();
  }

  A.socket.disconnect(); B.socket.disconnect();
  console.log(failures === 0 ? '\nPHASE F: TOUT PASSÉ' : `\nPHASE F: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
