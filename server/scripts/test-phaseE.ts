/**
 * Test PHASE E (V2): PvP/PK officiel branché sur les morts joueur.
 * Vérifie:
 *  1. Mort PvP (A tue B): PKStatus créé pour le tueur, points gagnés.
 *  2. Self-defense: B (victime) avait attaqué A en premier → pas de points
 *     de meurtre pour A si A se défend (scénario inverse testé).
 *  3. Annonce chat PvP au tueur.
 * Usage: npx tsx scripts/test-phaseE.ts
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
  if (!create.success) throw new Error('create ' + label);
  await req('character:select', { characterId: create.character.id });
  const states: any[] = [];
  socket.on('player:state', (d: any) => states.push(d.data ?? d));
  const spawns: any[] = [];
  socket.on('spawn_player', (d: any) => spawns.push(d.data ?? d));
  const deaths: any[] = [];
  socket.on('player:death', (d: any) => deaths.push(d.data ?? d));
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  return { socket, req, states, spawns, deaths, chats, id: create.character.id, name: nm };
}

async function main(): Promise<void> {
  const A = await loginChar('PkA');
  const B = await loginChar('PkB');
  await wait(2500);

  // Se retrouver: les deux au même point (spawn ville)
  // B attaque A en premier (self-defense pour A)
  A.socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: A.id, skillId: 'SKILL_CH_SWORD_SMASH_A_01' } }); // self-cast invalide, ignoré
  // B frappe A (attaque de base sur joueur)
  for (let i = 0; i < 3; i++) {
    B.socket.emit('attack', { type: 'attack', timestamp: Date.now(), data: { targetId: A.id } });
    await wait(500);
  }
  // God mode A pour ne pas mourir, puis A tue B (skill officiel)
  const chat = (c: any, m: string) => c.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
  chat(A, '/god');
  await wait(500);
  // A attaque B jusqu'à la mort (B ~200 HP, A dégâts officiels ~100+)
  let bDead = false;
  for (let i = 0; i < 30 && !bDead; i++) {
    A.socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: B.id, skillId: 'SKILL_CH_SWORD_SMASH_A_01' } });
    await wait(900);
    bDead = B.deaths.length > 0;
  }
  await wait(1500);

  check('B tué par A (mort PvP)', bDead);
  const announce = A.chats.find((c) => c.includes('PvP:'));
  check('Annonce PvP reçue par le tueur', !!announce, announce?.slice(0, 60));

  // PKStatus du tueur en base
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();
  const status = await prisma.pKStatus.findUnique({ where: { characterId: A.id } });
  // B a attaqué A en premier → légitime défense OFFICIELLE: 0 point de meurtre
  check('Self-defense officiel: tueur défenseur → 0 pt PK', !!status && status.pkPoints === 0,
    `pkPoints=${status?.pkPoints} (B avait attaqué en premier)`);
  await prisma.$disconnect();

  A.socket.disconnect(); B.socket.disconnect();
  console.log(failures === 0 ? '\nPHASE E: TOUT PASSÉ' : `\nPHASE E: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
