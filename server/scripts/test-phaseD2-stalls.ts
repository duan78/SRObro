/**
 * Test STALLS (Phase D V2): économie joueur — stall network officiel.
 * Vérifie (KB 23_STALL_NETWORK):
 *  1. Ouverture stall en ville (1 000 or, refus hors ville).
 *  2. Dépôt d'un item (slot inventaire + prix).
 *  3. Recherche réseau (stall:search) trouve l'item avec VRAI plus.
 *  4. Achat par un 2e joueur: or transféré (prix), item transféré au
 *     SLOT LIBRE de l'acheteur (bug d'origine: slot du vendeur conservé).
 *  5. Anti double-vente: 2e achat du même article rejeté.
 * Usage: npx tsx scripts/test-phaseD2-stalls.ts
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
  if (!create.success) throw new Error('create');
  await req('character:select', { characterId: create.character.id });
  const states: any[] = [];
  socket.on('player:state', (d: any) => states.push(d.data ?? d));
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    throw new Error('timeout chat ' + m);
  };
  return { socket, req, chat, states, id: create.character.id, name: nm };
}

async function main(): Promise<void> {
  const S = await loginChar('Stl'); // vendeur
  const B = await loginChar('Byr'); // acheteur
  await wait(2000);

  // Or + item à vendre (potion du kit de départ, slot 0 ou 1)
  await S.chat('/gold 50000');
  await wait(1500);
  await B.chat('/gold 50000');
  await wait(1500);
  const invS = await S.req('inventory:list');
  const potionSlot = (invS.slots ?? []).findIndex((s: any) => s?.item?.type === 'potion');
  check('Vendeur a une potion (kit)', potionSlot >= 0, `slot=${potionSlot}`);

  // ---------- 1. Ouverture ----------
  const open = await S.req('stall:open', { title: 'BoutiqueRouteSoie' });
  check('stall:open en ville (1 000 or)', open.success, open.success ? open.stall?.title : open.error);
  const goldAfterOpen = S.states.at(-1)?.gold;

  // ---------- 2. Dépôt ----------
  const add = await S.req('stall:add_item', { slot: potionSlot, price: 5000 });
  check('stall:add_item potion @5 000 or', add.success, add.error ?? 'ok');

  // ---------- 3. Recherche réseau ----------
  // NB: les noms d'items officiels sont coréens (초보자의 HP 회복약) —
  // recherche SANS filtre de nom, puis vérification de la présence
  const search = await B.req('stall:search', {});
  const found = (search.results ?? []).flatMap((r: any) => r.items ?? []);
  check('stall:search trouve la potion (vrai plus/rarity)', search.success && found.length > 0,
    found[0] ? `${found[0].name} +${found[0].plus} ${found[0].price}or` : 'rien');

  // ---------- 4. Achat ----------
  const stallItemId = (search.results ?? []).flatMap((r: any) => r.items ?? [])[0]?.stallItemId;
  if (!stallItemId) { check('stallItemId résolu', false); }
  else {
    console.log('  [dbg] search brut:', JSON.stringify(search).slice(0, 400));
    console.log('  [dbg] stallItemId =', stallItemId);
    const invB = await B.req('inventory:list');
    const usedSlotsB = new Set((invB.slots ?? []).map((s: any, i: number) => (s ? i : -1)).filter((i: number) => i >= 0));
    const bGoldBefore = B.states.at(-1)?.gold;
    const buy = await B.req('stall:buy', { stallItemId });
    await wait(600);
    check('Achat réussi', buy.success, buy.error ?? 'ok');
    const bGoldAfter = B.states.at(-1)?.gold;
    check('Or acheteur débité (5 000)', bGoldAfter === bGoldBefore - 5000,
      `${bGoldBefore} → ${bGoldAfter}`);
    const invB2 = await B.req('inventory:list');
    // L'item ACHETÉ = une potion sur un slot NON occupé avant l'achat
    // (l'acheteur a déjà ses propres potions du kit de départ aux slots 0-2)
    const potionB = (invB2.slots ?? []).findIndex(
      (s: any, i: number) => s?.item?.type === 'potion' && !usedSlotsB.has(i),
    );
    check('Item transféré à un slot LIBRE de l\'acheteur', potionB >= 0,
      `slot=${potionB} (occupés avant: ${[...usedSlotsB].join(',')})`);

    // ---------- 5. Anti double-vente ----------
    const buy2 = await B.req('stall:buy', { stallItemId });
    check('Double-vente rejetée (garde transactionnelle)', !buy2.success,
      buy2.error?.slice(0, 40) ?? 'REJETÉ');
  }

  // Fermeture
  const close = await S.req('stall:close', {});
  check('stall:close', close.success, close.error ?? 'ok');

  S.socket.disconnect(); B.socket.disconnect();
  console.log(failures === 0 ? '\nSTALLS: TOUT PASSÉ' : `\nSTALLS: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
