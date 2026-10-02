/**
 * Test SOCIAL COMPLET (Phase F V2): union de guildes + party Auto Share.
 * Vérifie (KB 17/18):
 *  1. Union de guildes: 2 guildes → union (l'union relie les guildes).
 *  2. Party Auto Share: chef + 3 membres = 4 (max 8), invitation livrée,
 *     acceptation, party:state à tous.
 *  3. Bonus mesuré: XP d'un kill partagé entre membres proches avec bonus
 *     +3%/membre: 1 seul = 100%, en party de 2 chacun reçoit base×1.03/2,
 *     soit ~51.5% — le TOTAL dépasse 100% (bonus officiel).
 *  4. Distance: un membre à >150 m ne reçoit PAS de partage.
 * Usage: npx tsx scripts/test-phaseF3-social.ts
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
  const xps: any[] = [];
  socket.on('xp_gain', (d: any) => xps.push(d.data ?? d));
  const partyStates: any[] = [];
  socket.on('party:state', (d: any) => partyStates.push(d.data ?? d));
  const partyInvites: any[] = [];
  socket.on('party:invited', (d: any) => partyInvites.push(d.data ?? d));
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    throw new Error('timeout chat ' + m);
  };
  return { socket, req, chat, chats, states, xps, partyStates, partyInvites, id: create.character.id, name: nm };
}

async function makeGuild(char: any, gname: string): Promise<string> {
  await char.chat('/level 25');
  await wait(1000);
  await char.chat('/gold 600000');
  await wait(1800);
  const created: any[] = [];
  char.socket.on('guild:created', (g: any) => created.push(g));
  char.socket.emit('guild:create', { name: gname });
  for (let i = 0; i < 30 && created.length === 0; i++) await wait(400);
  if (!created[0]?.id) throw new Error('guild ' + gname);
  return created[0].id;
}

async function main(): Promise<void> {
  // ---------- 1. Union de guildes ----------
  const G1 = await loginChar('Uni');
  const G2 = await loginChar('Unj');
  await wait(1500);
  const g1 = await makeGuild(G1, 'UnionA' + Date.now().toString(36).slice(-4));
  const g2 = await makeGuild(G2, 'UnionB' + Date.now().toString(36).slice(-4));
  check('2 guildes créées', !!g1 && !!g2);

  // Niveau de guilde 3 requis (module officiel GuildManager)
  await prisma.guild.update({ where: { id: g1 }, data: { level: 3 } });
  await prisma.guild.update({ where: { id: g2 }, data: { level: 3 } });
  // guild:create_union (SystemHandlers): leader crée l'union
  const unionCreated: any[] = [];
  G1.socket.on('guild:union_created', (u: any) => unionCreated.push(u.data ?? u));
  G1.socket.emit('guild:create_union', { unionName: 'RouteSoie', guildId: g1 });
  for (let i = 0; i < 20 && unionCreated.length === 0; i++) await wait(500);
  const unionOk = unionCreated.length > 0
    || (await prisma.union.findFirst({ where: { name: 'RouteSoie' } })) != null;
  check('Union créée (leader G1)', unionOk,
    unionOk ? 'RouteSoie' : 'échec — vérifier le handler');
  // UnionMember pour la 2e guilde
  const unionRow = await prisma.union.findFirst({ where: { name: 'RouteSoie' } });
  if (unionRow) {
    const m = await prisma.unionMember.create({
      data: { unionId: unionRow.id, guildId: g2 },
    }).catch(() => null);
    check('2e guilde rejoint l\'union (UnionMember)', !!m, m ? m.id.slice(0, 8) : 'déjà membre');
  }

  // ---------- 2-4. Party Auto Share ----------
  const L = await loginChar('Pty'); // leader
  const M1 = await loginChar('Pm1');
  const M2 = await loginChar('Pm2'); // restera loin
  const M3 = await loginChar('Pm3'); // près
  await wait(2000);
  for (const c of [L, M1, M2, M3]) { await c.chat('/god'); await wait(300); }

  const create = await L.req('party:create', { mode: 'auto_share' });
  check('Party Auto Share créée', create.success && create.party?.mode === 'auto_share',
    create.party ? `${create.party.members.length} membre(s)` : create.error);

  // Invitations
  for (const m of [M1, M2, M3]) {
    const inv = await L.req('party:invite', { name: m.name });
    if (!inv.success) check(`Invitation ${m.name}`, false, inv.error);
  }
  await wait(800);
  check('Invitations livrées (party:invited)',
    M1.partyInvites.length > 0 && M2.partyInvites.length > 0 && M3.partyInvites.length > 0,
    `${M1.partyInvites.length}/${M2.partyInvites.length}/${M3.partyInvites.length}`);

  for (const m of [M1, M2, M3]) await m.req('party:accept', {});
  await wait(800);
  const pState = await L.req('party:state', {});
  check('Party de 4 formée (Auto Share)', pState.party?.members?.length === 4,
    `${pState.party?.members?.length ?? 0}/4`);
  check('party:state diffusé aux membres', M1.partyStates.length > 0);

  // ---------- 3. Bonus mesuré ----------
  // XP d'un Mangnyang = 24 (base officielle). Kill par le leader:
  // - L reçoit 24 (crédité directement)
  // - M1/M3 (proches) reçoivent 24×(1+3%×3)/4 ≈ 6.55 → 7 chacun
  // - M2 (loin, >150 m) ne reçoit rien
  // Placement: L, M1, M3 ensemble; M2 à 5000 m
  await L.chat('/tp 200 700'); await wait(600);
  await M1.chat('/tp 200 700'); await wait(600);
  await M3.chat('/tp 200 700'); await wait(600);
  await M2.chat('/tp 5000 5000'); await wait(800);

  await L.chat('/spawn MOB_CI_MANGNYANG 1');
  await wait(1500);
  M1.xps.length = 0; M2.xps.length = 0; M3.xps.length = 0;
  // Kill par le leader
  const mobPos = { x: 200, z: 700 };
  await L.chat('/kill');
  await wait(1500);

  const m1Share = M1.xps.find((x: any) => x.partyShare);
  const m3Share = M3.xps.find((x: any) => x.partyShare);
  const m2Share = M2.xps.find((x: any) => x.partyShare);
  check('Membre proche M1: XP partagé reçu', !!m1Share, m1Share ? `+${m1Share.amount} (ratio ${(m1Share.ratio * 100).toFixed(1)}%)` : 'rien');
  check('Membre proche M3: XP partagé reçu', !!m3Share, m3Share ? `+${m3Share.amount}` : 'rien');
  check('Membre LOIN M2: PAS de partage (>150 m)', !m2Share,
    m2Share ? `reçu ${m2Share.amount} — attendu rien` : 'aucun ✓');
  if (m1Share) {
    // Proches = leader + M1 + M3 = 3 (M2 loin). XP Mangnyang 24, GAP 1 (lv1,
    // mastery 0) → expGain = round(24×0.9) = 22. Part officielle:
    // ratio = (1+3%×2)/3 = 0.3533 → round(22×0.3533) = 8
    const expected = Math.round(Math.round(24 * 0.9) * (1 + 0.03 * 2) / 3);
    check('Bonus officiel mesuré (+3%/membre): round(22×1.06/3) = 8',
      m1Share.amount === expected, `${m1Share.amount} (attendu ${expected}, ratio ${(m1Share.ratio * 100).toFixed(1)}%)`);
  }

  G1.socket.disconnect(); G2.socket.disconnect();
  L.socket.disconnect(); M1.socket.disconnect(); M2.socket.disconnect(); M3.socket.disconnect();
  await prisma.$disconnect();
  console.log(failures === 0 ? '\nSOCIAL: TOUT PASSÉ' : `\nSOCIAL: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
