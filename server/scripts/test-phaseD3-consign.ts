/**
 * Test CONSIGNATION (Phase D V2): NPC Juel (KB 23).
 * Vérifie:
 *  1. consign:list: dépôt (10 max), item retiré de l'inventaire visible.
 *  2. consign:search: listings visibles avec prix/plus (achat à distance).
 *  3. consign:buy par un 2e joueur: or débité, item livré au slot libre,
 *     vendeur crédité (prix − commission 1%).
 *  4. Double-vente rejetée (garde transactionnelle).
 *  5. consign:cancel: retrait → retour inventaire.
 * Usage: npx tsx scripts/test-phaseD3-consign.ts
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
  const inv = async () => (await req('inventory:list')).slots ?? [];
  return { socket, req, chat, states, inv, id: create.character.id, name: nm };
}

async function main(): Promise<void> {
  const S = await loginChar('Csg'); // vendeur (Hotan)
  const B = await loginChar('Cbg'); // acheteur (à Jangan — achat à distance)
  await wait(2000);
  await S.chat('/gold 50000');
  await wait(1500);
  await B.chat('/gold 100000');
  await wait(1500);

  const potionSlot = (await S.inv()).findIndex((s: any) => s?.item?.type === 'potion');
  check('Vendeur a une potion', potionSlot >= 0, `slot=${potionSlot}`);

  // ---------- 1. Dépôt ----------
  const list = await S.req('consign:list', { slot: potionSlot, price: 8000 });
  check('Dépôt consignation @8 000', list.success, list.success ? `frais=${list.fee}` : list.error);
  const afterList = await S.inv();
  check('Item retiré de l\'inventaire visible', !afterList[potionSlot],
    afterList[potionSlot] ? 'encore là' : 'slot libéré ✓');

  // ---------- 2. Recherche (acheteur à Jangan — à distance) ----------
  const search = await B.req('consign:search', {});
  const listing = (search.listings ?? []).find((l: any) => l.price === 8000);
  check('Listing visible à distance', !!listing,
    listing ? `${listing.itemName} @${listing.price} par ${listing.sellerName}` : 'introuvable');

  if (listing) {
    // ---------- 3. Achat ----------
    const bGoldBefore = B.states.at(-1)?.gold;
    const buy = await B.req('consign:buy', { listingId: listing.id });
    check('Achat à distance réussi', buy.success, buy.success ? `${buy.itemName} → slot ${buy.slot}` : buy.error);
    const bGoldAfter = B.states.at(-1)?.gold;
    check('Acheteur débité (8 000)', bGoldAfter === bGoldBefore - 8000,
      `${bGoldBefore} → ${bGoldAfter}`);
    const bInv = await B.inv();
    check('Item livré au slot libre', !!bInv[buy.slot], `slot=${buy.slot}`);
    // Vendeur crédité prix − commission (1% plafonné 100k = 80)
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    const sellerChar = await prisma.character.findUnique({ where: { id: S.id } });
    check('Vendeur crédité prix − commission (7 920)', Number(sellerChar?.gold ?? 0) >= 50000 + 7920,
      `or vendeur=${Number(sellerChar?.gold ?? 0)}`);
    await prisma.$disconnect();

    // ---------- 4. Double-vente ----------
    const buy2 = await B.req('consign:buy', { listingId: listing.id });
    check('Double-vente rejetée', !buy2.success, buy2.error?.slice(0, 40));
  }

  // ---------- 5. Retrait ----------
  const potion2 = (await S.inv()).findIndex((s: any) => s?.item?.type === 'potion');
  if (potion2 >= 0) {
    const l2 = await S.req('consign:list', { slot: potion2, price: 5000 });
    if (l2.success) {
      const cancel = await S.req('consign:cancel', { listingId: l2.listingId });
      check('Retrait du listing', cancel.success, cancel.error ?? 'ok');
      const inv = await S.inv();
      const back = inv.findIndex((s: any, i: number) => s?.item?.type === 'potion' && i !== potion2);
      check('Item retourné à l\'inventaire', back >= 0, `slot=${back}`);
    }
  } else {
    check('Retrait (pas de potion pour tester)', false);
  }

  S.socket.disconnect(); B.socket.disconnect();
  console.log(failures === 0 ? '\nCONSIGNATION: TOUT PASSÉ' : `\nCONSIGNATION: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
