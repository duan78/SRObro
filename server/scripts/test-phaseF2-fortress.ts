/**
 * Test FORTRESS WAR (Phase F V2): siège réel + taxes.
 * Vérifie (KB 19_FORTRESS_WAR):
 *  1. Guerre: inscription 2 guildes, startFortressWar, kill PvP de siège
 *     (killer guild A tue victim guild B) → points A=1.
 *  2. endFortressWar: vainqueur = MEILLEUR SCORE (pas première inscrite).
 *  3. Taxe: occupant fixe 10% (setTaxRate), achat boutique NPC à Jangan
 *     débité prix×1.10, recette vers le storage de guilde.
 * Usage: npx tsx scripts/test-phaseF2-fortress.ts
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

async function loginChar(label: string): Promise<any> {
  const socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => socket.on('connect', r));
  socket.emit('heartbeat', { t: Date.now() });
  const req = (ev: string, data: any = {}, timeout = 25000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = label + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  if (!create.success) throw new Error('create');
  await req('character:select', { characterId: create.character.id });
  const states: any[] = [];
  socket.on('player:state', (d: any) => states.push(d.data ?? d));
  const deaths: any[] = [];
  socket.on('player:death', (d: any) => deaths.push(d.data ?? d));
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    throw new Error('timeout chat ' + m);
  };
  return { socket, req, chat, chats, states, deaths, id: create.character.id, name: nm };
}

async function createGuild(char: any, gname: string): Promise<string> {
  await char.chat('/level 25');
  await wait(1200);
  await char.chat('/gold 600000');
  await wait(1800);
  const created: any[] = [];
  char.socket.on('guild:created', (g: any) => created.push(g));
  char.socket.emit('guild:create', { name: gname });
  for (let i = 0; i < 30 && created.length === 0; i++) await wait(400);
  if (!created[0]?.id) throw new Error('guild create ' + gname);
  return created[0].id;
}

async function main(): Promise<void> {
  const A = await loginChar('FwA'); // guild A (gagnera)
  const B = await loginChar('FwB'); // guild B (perdante, tuée)
  await wait(2000);

  const guildA = await createGuild(A, 'Guerriers' + Date.now().toString(36).slice(-4));
  const guildB = await createGuild(B, 'Envahisseurs' + Date.now().toString(36).slice(-4));
  check('2 guildes créées', !!guildA && !!guildB);

  // Passer les forteresses en état registration puis inscrire les 2 guildes
  const fortress = await prisma.fortress.findFirst({ where: { name: { contains: 'Jangan' } } });
  check('Forteresse de Jangan trouvée', !!fortress, fortress?.name);
  if (!fortress) process.exit(1);
  await prisma.fortress.update({
    where: { id: fortress.id },
    data: { state: 'registration', nextWarTime: new Date(Date.now() + 3600_000) },
  });
  const { FortressManager } = await import('../src/fortress/FortressManager.js');
  const fm = FortressManager.getInstance();
  // Guildes niveau 1 → forcer niveau 3 pour l'éligibilité (KB: niveau 3+)
  await prisma.guild.update({ where: { id: guildA }, data: { level: 3 } });
  await prisma.guild.update({ where: { id: guildB }, data: { level: 3 } });
  await fm.registerForFortress(fortress.id, guildB); // B inscrite EN PREMIER
  await fm.registerForFortress(fortress.id, guildA);
  check('2 guildes inscrites', true);

  // ---------- 1. Guerre + kill de siège ----------
  await fm.startFortressWar(fortress.id);
  check('Guerre ACTIVE (scores initialisés)', Object.keys(await fm.getWarScores(fortress.id)).length === 0);

  // A (guilde A) tue B (guilde B): god mode A, A cast sur B
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/god', channel: 'general' } });
  await wait(600);
  let bDead = false;
  for (let i = 0; i < 25 && !bDead; i++) {
    A.socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: B.id, skillId: 'SKILL_CH_SWORD_SMASH_A_01' } });
    await wait(800);
    bDead = B.deaths.length > 0;
  }
  check('B tué par A (PvP de siège)', bDead);
  await wait(1000);
  const scores = await fm.getWarScores(fortress.id);
  check('Score de siège: guilde A = 1 point', scores[guildA] === 1,
    JSON.stringify(scores));

  // ---------- 2. Vainqueur au MEILLEUR score ----------
  await fm.endFortressWar(fortress.id);
  const after = await prisma.fortress.findUnique({ where: { id: fortress.id } });
  check('Vainqueur = guilde A (score), PAS la première inscrite (B)',
    after?.ownerGuildId === guildA, after?.ownerGuildId === guildA ? 'capturée par A' : after?.ownerGuildId ?? 'personne');

  // ---------- 3. Taxe appliquée aux achats ----------
  await fm.setTaxRate(fortress.id, guildA, 10);
  check('Taxe fixée à 10% par l\'occupant', true);
  // A achète l'item le moins cher de la boutique de Jangan
  const shopItem = await prisma.item.findFirst({
    where: { price: { gte: 50, lt: 500 } },
    orderBy: { price: 'asc' },
  });
  const shopRes: any[] = [];
  A.socket.on('shop:list', (d: any) => shopRes.push(d.data ?? d));
  A.socket.emit('shop:list', {});
  await wait(800);
  // Achat via shop:buy (itemId du shopItem)
  const goldBefore = A.states.at(-1)?.gold;
  await prisma.character.update({ where: { id: A.id }, data: { gold: BigInt(A.states.at(-1)?.gold ?? goldBefore) } });
  const buy = await A.req('shop:buy', { itemId: shopItem?.id, qty: 1 });
  await wait(800);
  const base = Number(shopItem?.price ?? 0);
  const expectedTotal = base + Math.floor(base * 0.10);
  const goldAfter = A.states.at(-1)?.gold;
  check('Achat taxé: prix×1.10 débité', buy?.success && goldAfter === (goldBefore ?? 0) - expectedTotal,
    `${goldBefore} → ${goldAfter} (base ${base} + taxe ${expectedTotal - base})`);
  const storage = await prisma.guildStorage.findUnique({ where: { guildId: guildA } });
  check('Recette taxée vers le storage de guilde', !!storage && Number(storage.gold) >= expectedTotal - base,
    `storage=${Number(storage?.gold ?? 0)}`);

  A.socket.disconnect(); B.socket.disconnect();
  await prisma.$disconnect();
  console.log(failures === 0 ? '\nFORTRESS WAR: TOUT PASSÉ' : `\nFORTRESS WAR: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
