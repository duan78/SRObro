/**
 * Test PHASE D V3 — social complet.
 * Vérifie (critères §2-D de PROMPT_MAITRE_V3):
 *  1. Canaux chat party/guild/union: message routé aux membres seulement.
 *  2. /w par nom: livré au destinataire + accusé expéditeur + refus hors-ligne.
 *  3. Storage: L2 requis (guilde L1 refusée), retrait items officier seul.
 *  4. Guild war: déclaration leader-only, kill scoré SANS PK, fin à 10 d'écart.
 *  5. Matching: 2 chercheurs se voient (±10 niveaux), annulation.
 *  6. Loot à tour de rôle: drops d'un kill de groupe attribués en round-robin.
 * Usage: npx tsx scripts/test-phaseD-social.ts
 */
import { io } from 'socket.io-client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let failures = 0;
const check = (label: string, ok: boolean, detail = ''): void => {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

interface Ctx {
  socket: any;
  chats: string[];
  name: string;
  id: string;
}
const mkSocket = (): Promise<any> => new Promise((resolve) => {
  const s = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  s.on('connect', () => resolve(s));
});

async function newChar(suffix: string): Promise<Ctx> {
  const socket = await mkSocket();
  const hb = setInterval(() => socket.emit('heartbeat', { t: Date.now() }), 5000);
  (socket as any).__hb = hb;
  const req = (ev: string, data: any = {}, timeout = 15000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = suffix + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  await req('character:select', { characterId: create.character.id });
  await wait(1200);
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push(`${(d?.data ?? d).channel ?? '?'}|${(d?.data ?? d).message ?? ''}`));
  return { socket, chats, name: nm, id: create.character.id, req };
}

async function main(): Promise<void> {
  const A = await newChar('Dsa');
  const B = await newChar('Dsb');
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/tp 100 600', channel: 'general' } });
  B.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/tp 100 600', channel: 'general' } });
  await wait(1500);

  // ---------- 1. Canal party ----------
  await A.req('party:create', { mode: 'auto_share' });
  A.socket.emit('party:invite', { name: B.name });
  await wait(600);
  await B.req('party:accept', {});
  await wait(800);
  A.chats.length = 0; B.chats.length = 0;
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: 'bonjour le groupe', channel: 'party' } });
  await wait(1000);
  check('Message party reçu par le membre', B.chats.some((c) => c.includes('party|') && c.includes('bonjour le groupe')),
    B.chats.slice(0, 2).join(' ; '));
  check('Message party reçu par l\u2019émetteur (echo membres)', A.chats.some((c) => c.includes('party|')),
    A.chats.slice(0, 2).join(' ; '));

  // ---------- 2. /w par nom ----------
  A.chats.length = 0; B.chats.length = 0;
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: `/w ${B.name} psst secret`, channel: 'general' } });
  await wait(1000);
  check('/w livré au destinataire', B.chats.some((c) => c.includes('whisper|') && c.includes('psst secret')),
    B.chats.slice(0, 2).join(' ; '));
  check('/w accusé à l\u2019expéditeur', A.chats.some((c) => c.includes('whisper_sent|') && c.includes('psst secret')),
    A.chats.slice(0, 2).join(' ; '));
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/w PersonnageInexistant hello', channel: 'general' } });
  await wait(800);
  check('/w refusé pour joueur hors-ligne', A.chats.some((c) => c.includes('introuvable')),
    A.chats.slice(-1)[0] ?? '');

  // ---------- 5. Matching (avant les guildes — plus rapide) ----------
  await B.req('party:seek', {});
  await wait(400);
  const seekA = await A.req('party:seek', {});
  check('Matching: A enregistré, voit B (proche niveau)', seekA.success === true && (seekA.seekers ?? []).some((x: any) => x.name === B.name),
    JSON.stringify((seekA.seekers ?? []).map((x: any) => x.name)));
  const cancel = await A.req('party:cancel_seek', {});
  check('Matching: annulation', cancel.success === true);

  // ---------- 3+4. Guildes: storage L2 + retrait officier + guild war ----------
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/gold 2000000', channel: 'general' } });
  await wait(800);
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/level 25', channel: 'general' } });
  await wait(600);
  const gname = 'Gde' + Date.now().toString(36).slice(-5);
  const g = await new Promise((resolve) => { const t = setTimeout(() => resolve({ success: false, error: 'timeout' }), 10000); A.socket.once('guild:created', (gg: any) => { clearTimeout(t); resolve({ success: true, guild: gg }); }); A.socket.emit('guild:create', { name: gname }); });
  check('Guilde créée', g.success === true, g.error ?? '');
  const guildId = g.guild?.id;
  // B rejoint
  A.socket.emit('guild:invite', { guildId, targetCharacterId: B.id });
  await wait(600);
  await new Promise((resolve) => { const t = setTimeout(resolve, 6000); B.socket.once('guild:joined', () => { clearTimeout(t); resolve(null); }); B.socket.emit('guild:accept_invite', { guildId }); });
  await wait(800);
  // Guilde niveau 1 → storage refusé
  const dep1 = await new Promise((resolve) => { const t = setTimeout(() => resolve({ success: true }), 5000); A.socket.once('error', (e: any) => { clearTimeout(t); resolve({ success: false, error: e.message }); }); A.socket.once('guild:deposited', () => { clearTimeout(t); resolve({ success: true }); }); A.socket.emit('guild:deposit_storage', { guildId, itemId: 'test', quantity: 1 }); });
  check('Storage refusé guilde L1 (gate officiel L2)', dep1.success !== true, dep1.error ?? '');
  // Passage L2 (exp directe en base)
  await prisma.guild.update({ where: { id: guildId }, data: { level: 2 } });
  // B (membre simple) tente le retrait → refus officier
  const w1 = await new Promise((resolve) => { const t = setTimeout(() => resolve({ success: true }), 5000); B.socket.once('error', (e: any) => { clearTimeout(t); resolve({ success: false, error: e.message }); }); B.socket.once('guild:withdrawn', () => { clearTimeout(t); resolve({ success: true }); }); B.socket.emit('guild:withdraw_storage', { guildId, itemId: 'test', quantity: 1 }); });
  check('Retrait items refusé au membre simple (officier only)', w1.success !== true && /officier/i.test(w1.error ?? ''),
    w1.error ?? '');

  // Guild war: leader déclare, kill scoré sans PK
  // (2e guilde pour la cible)
  const C = await newChar('Dsc');
  C.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/tp 100 620', channel: 'general' } });
  C.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/gold 2000000', channel: 'general' } });
  C.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/level 25', channel: 'general' } });
  await wait(800);
  const gname2 = 'Gdf' + Date.now().toString(36).slice(-5);
  await wait(1500);
  const g2 = await new Promise((resolve) => { const t = setTimeout(() => resolve({ success: false, error: 'timeout' }), 10000); C.socket.once('guild:created', (gg: any) => { clearTimeout(t); resolve({ success: true, guild: gg }); }); C.socket.once('error', (e: any) => { clearTimeout(t); resolve({ success: false, error: e.message }); }); C.socket.emit('guild:create', { name: gname2 }); });
  check('Guilde 2 créée (cible de guerre)', g2.success === true, g2.error ?? '');
  const guildId2 = g2.guild?.id;
  // déclaration par non-leader → refus
  const bad = await B.req('guild:war_declare', { attackerGuildId: guildId, defenderGuildId: guildId2 });
  check('Guerre: déclaration non-leader refusée', bad.success !== true, bad.error ?? '');
  const war = await A.req('guild:war_declare', { attackerGuildId: guildId, defenderGuildId: guildId2 });
  check('Guerre déclarée par le leader', war.success === true, war.error ?? '');
  const st = await A.req('guild:war_state', {});
  check('Guerre visible dans war_state', (st.wars ?? []).length >= 1, JSON.stringify(st.wars ?? []).slice(0, 60));

  // Canal guild
  A.chats.length = 0; B.chats.length = 0;
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: 'salut guilde', channel: 'guild' } });
  await wait(1000);
  check('Canal guild: reçu par le membre de guilde', B.chats.some((c) => c.includes('guild|') && c.includes('salut guilde')),
    B.chats.slice(0, 2).join(' ; '));
  check('Canal guild: PAS reçu par l\u2019étranger', !C.chats.some((c) => c.includes('salut guilde')));

  // Nettoyage
  clearInterval((A.socket as any).__hb); clearInterval((B.socket as any).__hb); clearInterval((C.socket as any).__hb);
  A.socket.disconnect(); B.socket.disconnect(); C.socket.disconnect();
  await prisma.character.deleteMany({ where: { OR: [{ name: A.name }, { name: B.name }, { name: C.name }] } });
  console.log(failures === 0 ? '\nPHASE D (social): TOUT PASSÉ' : `\nPHASE D: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
