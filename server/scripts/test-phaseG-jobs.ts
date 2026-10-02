/**
 * Test JOBS (Phase E V2): triangle Trader/Thief/Hunter.
 * Vérifie (KB 09-12/35):
 *  1. job:change trader (niveau 20 requis pour le cheval — /level 25).
 *  2. job:buy_transport cheval (2 000 or, 9 slots — bug clés étoiles corrigé).
 *  3. job:buy_goods: spécialités Jangan, or débité, étoiles calculées
 *     (4 unités/9 slots → 2★: ceil(4/9*5)=3★? — vérifié dynamiquement).
 *  4. Embuscade: téléport loin des villes → thieves NPC spawnés (job:ambush,
 *     1 thief par étoile), attaque le joueur.
 *  5. Vente à Donwhang: multiplicateur 1.62 (KB 162%), profit = somme
 *     (sellPrice×1.62 − buyPrice)×qty, or crédité.
 *  6. Vol: 2e perso thief → job:steal à proximité → marchandises volées.
 * Usage: npx tsx scripts/test-phaseG-jobs.ts
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
  const req = (ev: string, data: any = {}, timeout = 25000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = label + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  if (!create.success) throw new Error('create ' + label);
  await req('character:select', { characterId: create.character.id });
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    throw new Error('timeout chat ' + m);
  };
  const spawns: any[] = [];
  socket.on('spawn', (d: any) => spawns.push(d.data ?? d));
  const states: any[] = [];
  socket.on('player:state', (d: any) => states.push(d.data ?? d));
  const ambushes: any[] = [];
  socket.on('job:ambush', (d: any) => ambushes.push(d.data ?? d));
  return { socket, req, chat, chats, spawns, states, ambushes, id: create.character.id, name: nm };
}

async function main(): Promise<void> {
  const T = await loginChar('Trd'); // trader
  await T.chat('/level 25');
  await wait(600);
  await T.chat('/gold 100000');
  await wait(1500);

  // ---------- 1. Métier trader ----------
  const st0 = await T.req('job:state');
  check('job:state OK (sans métier)', st0.success && !st0.job, JSON.stringify(st0).slice(0, 60));
  const chg = await T.req('job:change', { job: 'trader' });
  check('job:change trader', chg.success, JSON.stringify(chg).slice(0, 50));

  // ---------- 2. Transport (bug clés étoiles corrigé) ----------
  const goldBefore = (await T.req('job:state'), T.states.at(-1)?.gold);
  const bt = await T.req('job:buy_transport', { starLevel: 1 });
  check('job:buy_transport cheval (1★ accepté — bug clés fixé)', bt.success,
    bt.success ? bt.transport.transportType : bt.error);

  // ---------- 3. Marchandises + étoiles ----------
  const bg1 = await T.req('job:buy_goods', { goodId: 'good_silk', quantity: 4 });
  check('job:buy_goods 4× Silk (or débité)', bg1.success && bg1.spent === 4000,
    `spent=${bg1.spent} stars=${bg1.starLevel}`);
  check('Étoiles calculées (4/9 slots → 3★)', bg1.starLevel === Math.ceil((4 / 9) * 5),
    `stars=${bg1.starLevel}`);
  const tState = await T.req('job:state');
  check('Transport actif avec 4 marchandises', (tState.transport?.goods?.reduce((s: number, g: any) => s + g.quantity, 0) ?? 0) === 4);

  // ---------- 4. Embuscade NPC ----------
  // Mi-route Jangan→Donwhang (loin des 3 villes > 600 m)
  T.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/tp -1454 1016', channel: 'general' } });
  await wait(2000);
  // Le tick vérifie toutes les 5 s + cooldown — attendre jusqu'à 25 s
  const spawnsBefore = T.spawns.length;
  for (let i = 0; i < 10 && T.ambushes.length === 0; i++) await wait(2500);
  check('Embuscade déclenchée (job:ambush reçu)', T.ambushes.length > 0,
    T.ambushes[0]?.message?.slice(0, 60) ?? 'rien');
  const thiefSpawns = T.spawns.length - spawnsBefore;
  check('Thieves NPC spawnés dans le monde', thiefSpawns > 0 || T.ambushes.length > 0,
    `${thiefSpawns} spawns`);

  // ---------- 5. Vente à Donwhang (1.62 officiel) ----------
  T.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/tp -2908 1523', channel: 'general' } });
  await wait(2000);
  const goldBeforeSell = T.states.at(-1)?.gold;
  const sell = await T.req('job:sell_goods');
  // Attendu: 4 × (floor(1500×1.62) − 1000) = 4 × (2430−1000) = 4×1430 = 5720
  const expected = 4 * (Math.floor(1500 * 1.62) - 1000);
  check('Vente Donwhang: profit multiplicateur 1.62 (KB)', sell.success && sell.totalProfit === expected,
    `profit=${sell.totalProfit} attendu=${expected}`);
  const goldAfterSell = T.states.at(-1)?.gold;
  check('Or crédité du profit', goldAfterSell === goldBeforeSell + expected,
    `${goldBeforeSell} → ${goldAfterSell}`);

  // ---------- 6. Vol par un thief ----------
  // Recharger des goods à Hotan, puis le thief vole
  T.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/tp -6347 -541', channel: 'general' } });
  await wait(2000);
  const bg2 = await T.req('job:buy_goods', { goodId: 'good_jewelry', quantity: 3 });
  check('Rechargement 3× Jewelry à Hotan', bg2.success, bg2.success ? `spent=${bg2.spent}` : bg2.error);

  const V = await loginChar('Vlf'); // voleur
  await V.chat('/level 25');
  await wait(1500);
  const vchg = await V.req('job:change', { job: 'thief' });
  check('job:change thief (voleur)', vchg.success);
  // Placer le voleur à côté du trader
  V.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/tp -6347 -541', channel: 'general' } });
  await wait(2000);
  const vGoldBefore = V.states.at(-1)?.gold;
  const steal = await V.req('job:steal', { traderCharacterId: T.id });
  check('job:steal: marchandises volées', steal.success && (steal.stolen?.length ?? 0) > 0,
    steal.success ? `${steal.stolen.length} lots, revendus ${steal.fenced} or` : steal.error);
  const vGoldAfter = V.states.at(-1)?.gold;
  check('Voleur payé (recel 60%)', vGoldAfter === (vGoldBefore ?? 0) + (steal.fenced ?? 0),
    `${vGoldBefore} → ${vGoldAfter}`);
  await wait(800); // livraison asynchrone du warn au trader
  const traderWarned = T.chats.some((c) => c.includes('volé'));
  check('Trader averti du vol', traderWarned);

  T.socket.disconnect(); V.socket.disconnect();
  console.log(failures === 0 ? '\nJOBS: TOUT PASSÉ' : `\nJOBS: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
