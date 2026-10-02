/**
 * Test PHASE 6: suite Admin — commandes chat GM + console web /admin.
 * Se connecte avec le compte admin 'arnaud' (promu admin) et vérifie:
 * commandes GM (~15), refus pour un joueur lambda, taux live sans reboot
 * (avant/après mesuré sur un gain d'XP), ban/unban, HTTP /admin (overview,
 * items, monstres officiels, killlog, actions).
 * Usage: npx tsx scripts/test-phase6.ts
 */
import { io } from 'socket.io-client';

interface C {
  socket: any;
  name: string;
  charId: string;
  chats: any[];
  states: any[];
  spawns: any[];
  despawns: string[];
  rawEvents: Map<string, any[]>;
}

function makeClient(): C {
  return { socket: null, name: '', charId: '', chats: [], states: [], spawns: [], despawns: [], rawEvents: new Map() };
}

async function login(c: C, username: string, password: string): Promise<void> {
  c.socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => c.socket.on('connect', r));
  c.socket.emit('heartbeat', { t: Date.now() });
  const req = (ev: string, data: any = {}, timeout = 20000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      c.socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  (c.socket as any).req = req;
  const login = await req('auth:login', { username, password });
  if (!login.success) throw new Error(`login ${username}: ${login.error}`);
  c.socket.on('chat', (d: any) => c.chats.push(d.data ?? d));
  c.socket.on('player:state', (d: any) => c.states.push(d.data ?? d));
  c.socket.on('spawn', (d: any) => c.spawns.push(d.data ?? d));
  const raw = (ev: string) => {
    if (!c.rawEvents.has(ev)) { c.rawEvents.set(ev, []); c.socket.on(ev, (d: any) => c.rawEvents.get(ev)!.push(d)); }
  };
  raw('player:teleport'); raw('gm:speed'); raw('despawn_player'); raw('spawn_player'); raw('drop_item');
  // Perso DÉDIÉ: ne pas voler Kaiser à l'onglet navigateur resté ouvert
  // (sinon ping-pong d'auth:kicked entre le tab auto-reconnect et ce test).
  const gmName = 'Maitre' + Date.now().toString(36).slice(-6);
  const create = await req('character:create', { name: gmName, race: 'chinese', gender: 'male' });
  if (!create.success || !create.character) throw new Error('create GM char: ' + JSON.stringify(create).slice(0, 120));
  const sel = await req('character:select', { characterId: create.character.id });
  if (!sel.success) throw new Error('select failed');
  c.name = sel.character.name;
  c.charId = create.character.id;
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
const last = <T>(arr: T[]): T => arr[arr.length - 1];

let failures = 0;
const check = (label: string, ok: boolean, detail = ''): void => {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};

async function http(path: string, opts: any = {}): Promise<{ status: number; body: any }> {
  const r = await fetch('http://127.0.0.1:3001' + path, opts);
  return { status: r.status, body: await r.json().catch(() => null) };
}
const basic = { Authorization: 'Basic ' + Buffer.from('arnaud:hunter2').toString('base64') };

async function main(): Promise<void> {
  const GM = makeClient();
  await login(GM, 'arnaud', 'hunter2'); // promu admin pour la phase 6
  console.log(`GM = ${GM.name} (compte arnaud/admin)`);

  // Joueur lambda pour vérifier les refus
  const P = makeClient();
  const suffix = Date.now().toString(36);
  P.socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => P.socket.on('connect', r));
  P.socket.emit('heartbeat', { t: Date.now() });
  {
    const req = (ev: string, data: any = {}): Promise<any> =>
      new Promise((resolve) => P.socket.emit(ev, data, (res: any) => resolve(res)));
    (P.socket as any).req = req;
    await req('auth:register', { username: 'lambda_' + suffix, password: 'test1234' });
    await req('auth:login', { username: 'lambda_' + suffix, password: 'test1234' });
    const create = await req('character:create', { name: 'Lambda' + suffix.slice(-5), race: 'chinese', gender: 'male' });
    P.socket.on('chat', (d: any) => P.chats.push(d.data ?? d));
    P.socket.on('player:state', (d: any) => P.states.push(d.data ?? d));
    await req('character:select', { characterId: create.character.id });
    P.name = create.character.name;
    P.charId = create.character.id;
  }
  console.log(`Joueur = ${P.name} (compte lambda, role player)`);
  const hb = setInterval(() => {
    for (const c of [GM, P]) if (c.socket.connected) c.socket.emit('heartbeat', { t: Date.now() });
  }, 8000);

  const gmCmd = async (msg: string): Promise<string> => {
    GM.chats.length = 0;
    GM.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: msg, channel: 'general' } });
    await wait(1200);
    return GM.chats.map((c) => c.message).join(' | ');
  };

  // --- 1. Refus rôle: lambda tente /level ---
  P.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/level 99', channel: 'general' } });
  await wait(1000);
  check('Refus: /level réservé aux GM', P.chats.some((c) => String(c.message).includes('réservée')),
    P.chats.map((c) => c.message).slice(-1).join('') || 'rien');

  // --- 2. /help ---
  const help = await gmCmd('/help');
  check('/help liste les commandes GM', help.includes('/tp') && help.includes('/rates'), help.slice(0, 80));

  // --- 3. /level + points de stats ---
  const lvlBefore = last(GM.states)?.level ?? 1;
  const lvlMsg = await gmCmd('/level 6');
  await wait(600);
  const st = last(GM.states);
  check('/level 6 appliqué (state serveur)', st?.level === 6, `avant=${lvlBefore} après=${st?.level} | ${lvlMsg.slice(0, 60)}`);

  // --- 4. /gold + /sp ---
  const goldBefore = st.gold;
  await gmCmd('/gold 5000'); await wait(500);
  await gmCmd('/sp 120'); await wait(600);
  const st2 = last(GM.states);
  check('/gold +5000', st2.gold === goldBefore + 5000, `${goldBefore} → ${st2.gold}`);
  check('/sp 120', Number(st2.sp) >= 120, `sp=${st2.sp}`);

  // --- 5. /item potion ---
  const itemMsg = await gmCmd('/item ITEM_ETC_HP_POTION_01 5');
  check('/item donne la potion', itemMsg.includes('ajouté'), itemMsg.slice(0, 80));

  // --- 6. /iteminfo ---
  const infoMsg = await gmCmd('/iteminfo ITEM_ETC_HP_POTION_01');
  check('/iteminfo prix officiel 60', infoMsg.includes('60'), infoMsg.slice(0, 90));

  // --- 7. /spawn monstre officiel (création à la volée) ---
  const spawnMsg = await gmCmd('/spawn MOB_CH_MANGNYANG 2');
  await wait(2000);
  check('/spawn MOB_CH_MANGNYANG (bestiaire officiel)', spawnMsg.includes('apparu'), spawnMsg.slice(0, 90));

  // --- 8. /mobinfo + /kill (KillLog + loot + XP) ---
  const mobinfo = await gmCmd('/mobinfo');
  check('/mobinfo décrit le monstre proche', /HP \d+\/\d+/.test(mobinfo), mobinfo.slice(0, 100));
  const expBefore = Number(last(GM.states).exp);
  const killMsg = await gmCmd('/kill');
  await wait(1500);
  const st3 = last(GM.states);
  check('/kill exécute le pipeline de mort (XP créditée)', killMsg.includes('éliminé') && Number(st3.exp) > expBefore,
    `exp ${expBefore} → ${st3.exp}`);

  // --- 9. /tp coordonnées ---
  const tpEvents = GM.rawEvents.get('player:teleport')!;
  await gmCmd('/tp 300 700'); await wait(800);
  check('/tp envoie le recalage client', tpEvents.some((e) => e?.position?.x === 300 && e?.position?.z === 700),
    `${tpEvents.length} événements`);

  // --- 10. /whereis + /tp vers joueur ---
  const whereis = await gmCmd('/whereis ' + P.name);
  check('/whereis localise un joueur', whereis.includes('X='), whereis.slice(0, 90));

  // --- 11. /speed ---
  const speedEvents = GM.rawEvents.get('gm:speed')!;
  await gmCmd('/speed 2.5'); await wait(600);
  check('/speed 2.5 notifiée au client', speedEvents.some((e) => e?.multiplier === 2.5), `${speedEvents.length} événements`);
  await gmCmd('/speed 1');

  // --- 12. /god /invisible /freeze toggles ---
  await gmCmd('/god'); await gmCmd('/invisible'); await gmCmd('/freeze');
  const ov1 = await http('/admin/api/overview', { headers: basic });
  const me = ov1.body.players.find((p: any) => p.name === GM.name);
  check('/god /invisible /freeze actifs (flags visibles)', me?.flags?.god === true && me.flags.invisible === true && me.flags.frozen === true,
    JSON.stringify(me?.flags));
  await gmCmd('/god'); await gmCmd('/invisible'); await gmCmd('/freeze'); // reset

  // --- 13. /rates live SANS REBOOT: XP mesuré avant/après ---
  await gmCmd('/rates exp 5');
  const r5 = await http('/admin/api/rates', { headers: basic });
  check('/rates exp 5 (live)', r5.body.exp === 5, `exp=${r5.body.exp}`);
  await gmCmd('/spawn MOB_CH_MANGNYANG 1'); await wait(1500);
  const expA = Number(last(GM.states).exp);
  await gmCmd('/kill'); await wait(1500);
  const gainX5 = Number(last(GM.states).exp) - expA;
  await gmCmd('/rates exp 1');
  await gmCmd('/spawn MOB_CH_MANGNYANG 1'); await wait(1500);
  const expB = Number(last(GM.states).exp);
  await gmCmd('/kill'); await wait(1500);
  const gainX1 = Number(last(GM.states).exp) - expB;
  // NB: le GAP officiel (±10%/niveau d'écart perso↔maîtrise) module l'XP de
  // chaque kill → le ratio n'est pas exactement 5 si le perso a levelé entre
  // les deux mesures. L'assertion clé = le taux live est appliqué sans reboot.
  const ratio = gainX1 > 0 ? gainX5 / gainX1 : 0;
  check('Taux XP appliqué sans reboot (×5 vs ×1)', ratio >= 4.0 && ratio <= 6.0, `×5=+${gainX5} ×1=+${gainX1} ratio=${ratio.toFixed(2)}`);

  // --- 14. /announce diffusé au joueur lambda ---
  await gmCmd('/announce Maintenance dans 10 minutes !');
  await wait(1000);
  check('/annonce reçue par tous', P.chats.some((c) => String(c.message).includes('Maintenance')),
    P.chats.map((c) => c.message).slice(-1).join('') || 'rien');

  // --- 15. /gm promote + refus ban admin ---
  const promo = await gmCmd('/gm promote lambda_' + suffix);
  check('/gm promote → gm', promo.includes('maintenant gm'), promo.slice(0, 80));
  const banAdmin = await gmCmd('/ban arnaud');
  check('/ban admin refusé', banAdmin.toLowerCase().includes('impossible'), banAdmin.slice(0, 80));
  await gmCmd('/gm demote lambda_' + suffix);

  // --- 16. /ban + login refusé + /unban ---
  await gmCmd('/ban lambda_' + suffix + ' triche-test');
  await wait(1500); // le ban KICK le socket lambda → nouvelle connexion pour tester le login
  const banSocket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => banSocket.on('connect', r));
  const refused = await new Promise<any>((resolve) => {
    const t = setTimeout(() => resolve({ success: false, error: 'timeout' }), 8000);
    banSocket.emit('auth:login', { username: 'lambda_' + suffix, password: 'test1234' }, (res: any) => {
      clearTimeout(t); resolve(res);
    });
  });
  banSocket.disconnect();
  check('/ban: login refusé', refused.success === false && String(refused.error).includes('banni'),
    refused.error ?? JSON.stringify(refused).slice(0, 60));
  const unbanMsg = await gmCmd('/unban lambda_' + suffix);
  check('/unban', unbanMsg.includes('débanni'), unbanMsg.slice(0, 60));

  // --- 17. /kick: re-login lambda puis kick par le GM ---
  const reSocket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => reSocket.on('connect', r));
  await new Promise((resolve) => reSocket.emit('auth:login', { username: 'lambda_' + suffix, password: 'test1234' }, resolve));
  await new Promise((resolve) => reSocket.emit('character:select', { characterId: P.charId }, resolve));
  P.socket = reSocket; // le kick doit déconnecter CE socket
  await wait(800);
  const kickMsg = await gmCmd('/kick ' + P.name);
  await wait(1200);
  check('/kick déconnecte le joueur', kickMsg.includes('déconnecté') && !reSocket.connected, kickMsg.slice(0, 60));

  // --- 18. Console HTTP: auth ---
  const noAuth = await http('/admin');
  check('Console /admin: 401 sans identifiants', noAuth.status === 401, `status=${noAuth.status}`);
  const badAuth = await http('/admin/api/overview', { headers: { Authorization: 'Basic ' + Buffer.from('lambda_x:wrong').toString('base64') } });
  check('Console /admin: 401 avec mauvais compte', badAuth.status === 401);

  // --- 19. Console HTTP: pages clés ---
  const items = await http('/admin/api/items?search=ITEM_CH_BLADE_01_A&limit=10', { headers: basic });
  check('Navigateur items (21 529)', items.body.total >= 1 && items.body.items[0]?.code === 'ITEM_CH_BLADE_01_A',
    `total=${items.body.total} prix=${items.body.items[0]?.price}`);
  const mobs = await http('/admin/api/monsters?search=MANGNYANG&limit=10', { headers: basic });
  check('Navigateur monstres officiels (7 825)', mobs.body.total >= 2 && mobs.body.monsters.some((m: any) => m.code === 'MOB_CH_MANGNYANG'),
    `total=${mobs.body.total}`);
  const killlog = await http('/admin/api/killlog?limit=5', { headers: basic });
  check('KillLog alimenté (victimName monstre)', killlog.body.logs.length > 0 && killlog.body.logs[0]?.victim,
    killlog.body.logs[0] ? `${killlog.body.logs[0].killer} → ${killlog.body.logs[0].victim}` : 'vide');
  const consoleHtml = await fetch('http://127.0.0.1:3001/admin', { headers: basic });
  const html = await consoleHtml.text();
  check('Page console HTML servie', consoleHtml.status === 200 && html.includes('Console Admin'));

  // --- 20. Console HTTP: action giveItem + rates POST live ---
  const ov2 = await http('/admin/api/overview', { headers: basic });
  const gmId = ov2.body.players.find((p: any) => p.name === GM.name)?.id;
  const give = await http('/admin/api/action', {
    method: 'POST', headers: { ...basic, 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'giveItem', playerId: gmId, code: 'ITEM_ETC_HP_POTION_01', qty: 3 }),
  });
  check('Console: giveItem au joueur en ligne', give.body.success === true, give.body.error ?? '');
  const ratePost = await http('/admin/api/rates', {
    method: 'POST', headers: { ...basic, 'Content-Type': 'application/json' },
    body: JSON.stringify({ exp: 2, gold: 3 }),
  });
  const rateGet = await http('/admin/api/rates', { headers: basic });
  check('Console: taux POST live (exp 2, gold 3) persistés Redis', ratePost.body.success && rateGet.body.exp === 2 && rateGet.body.gold === 3,
    `exp=${rateGet.body.exp} gold=${rateGet.body.gold}`);
  // Reset propre
  await http('/admin/api/rates', {
    method: 'POST', headers: { ...basic, 'Content-Type': 'application/json' },
    body: JSON.stringify({ exp: 1, gold: 1, sp: 1, drop: 1 }),
  });

  clearInterval(hb);
  GM.socket.disconnect(); P.socket.disconnect();
  console.log(failures === 0 ? '\n=== PHASE 6: TOUT PASSÉ ===' : `\n=== PHASE 6: ${failures} ÉCHEC(S) ===`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('FATAL:', e); process.exit(1); });
