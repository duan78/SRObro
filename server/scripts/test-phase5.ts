/**
 * Test PHASE 5: multi-joueurs — deux clients Socket.io simultanés.
 * Vérifie: visibilité mutuelle (spawn_player/update), chat transmis,
 * /who, mob partagé sans duplication de loot.
 * Usage: npx tsx scripts/test-phase5.ts
 */
import { io } from 'socket.io-client';

interface Client {
  socket: any;
  name: string;
  charId: string;
  spawnsPlayers: any[];
  updates: any[];
  chats: any[];
}

function makeClient(): Client {
  return { socket: null as any, name: '', charId: '', spawnsPlayers: [], updates: [], chats: [] };
}

async function login(c: Client, suffix: string): Promise<void> {
  c.socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => c.socket.on('connect', r));
  c.socket.emit('heartbeat', { t: Date.now() });
  const req = (ev: string, data: any = {}, timeout = 15000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      c.socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  (c.socket as any).req = req;
  await req('auth:register', { username: 'mp_' + suffix, password: 'test1234' });
  await req('auth:login', { username: 'mp_' + suffix, password: 'test1234' });
  const charName = 'Mp' + suffix.replace(/[^a-z0-9]/g, '').slice(-7) + (suffix[0] === 'a' ? 'A' : 'B');
  const create = await req('character:create', { name: charName, race: 'chinese', gender: 'male' });
  if (!create.success || !create.character) {
    throw new Error('create failed: ' + JSON.stringify(create).slice(0, 120));
  }
  // Les listeners AVANT la sélection: syncPlayerVisibility émet pendant
  // character:select (sinon le spawn_player est perdu par le test).
  c.socket.on('spawn_player', (d: any) => c.spawnsPlayers.push(d));
  const sel = await req('character:select', { characterId: create.character.id });
  if (!sel.success) throw new Error('select failed');
  c.name = sel.character.name;
  c.charId = create.character.id;
  c.socket.on('update', (d: any) => c.updates.push(d.data ?? d));
  c.socket.on('chat', (d: any) => c.chats.push(d.data ?? d));
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

let failures = 0;
const check = (label: string, ok: boolean, detail = ''): void => {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};

async function main(): Promise<void> {
  const suffix = Date.now().toString(36);
  const A = makeClient();
  const B = makeClient();
  await login(A, 'a' + suffix);
  await login(B, 'b' + suffix);
  console.log(`A=${A.name}, B=${B.name}`);
  setInterval(() => {
    for (const c of [A, B]) if (c.socket.connected) c.socket.emit('heartbeat', { t: Date.now() });
  }, 8000);

  // 1. Visibilité mutuelle
  await wait(1200);
  check('B voit A (spawn_player)', B.spawnsPlayers.some((p) => p.name === A.name),
    B.spawnsPlayers.map((p) => p.name).join(',') || 'rien');
  check('A voit B (spawn_player)', A.spawnsPlayers.some((p) => p.name === B.name),
    A.spawnsPlayers.map((p) => p.name).join(',') || 'rien');

  // 2. Déplacement: A bouge → B reçoit l'update
  A.socket.emit('move', { type: 'move', timestamp: Date.now(), data: { position: { x: 10, y: 0, z: 505 }, rotation: 1, isRunning: true } });
  await wait(1500);
  const aUpdatesOnB = B.updates.filter((u) => u.id === A.charId);
  check('B reçoit les déplacements de A', aUpdatesOnB.length > 0, `${aUpdatesOnB.length} updates`);

  // 3. Chat: A parle → B reçoit
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: 'Bonjour depuis A !', channel: 'general' } });
  await wait(1200);
  check('Chat transmis A → B', B.chats.some((c) => String(c.message).includes('Bonjour depuis A')),
    B.chats.map((c) => c.message).slice(-2).join(' | ') || 'rien');

  // 4. /who et /loc
  B.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/who', channel: 'general' } });
  await wait(1000);
  const who = B.chats.find((c) => String(c.message).includes('En ligne'));
  check('/who fonctionne', !!who, who?.message ?? 'rien');
  A.socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: '/loc', channel: 'general' } });
  await wait(1000);
  const loc = A.chats.find((c) => String(c.message).startsWith('Position'));
  check('/loc fonctionne', !!loc, loc?.message ?? 'rien');

  // 5. Mob partagé: A et B attaquent le même Mangnyang; un seul set de loot,
  //    le drop appartient au tueur (30 s) → B ne peut pas le ramasser.
  await wait(2500);
  const spawns: any[] = await new Promise((resolve) => {
    const seen: any[] = [];
    const h = (d: any) => seen.push(d.data ?? d);
    A.socket.on('spawn', h);
    A.socket.emit('world:snapshot', {});
    setTimeout(() => { A.socket.off('spawn', h); resolve(seen.filter((x) => x.entityType === 'monster' && x.name === 'Mangnyang')); }, 3000);
  });
  check('Mangnyangs présents', spawns.length > 0, `${spawns.length}`);
  if (spawns.length) {
    const target = spawns[0];
    // A et B se placent à côté
    for (const [c, dx] of [[A, 2], [B, -2]] as Array<[Client, number]>) {
      c.socket.emit('move', {
        type: 'move', timestamp: Date.now(),
        data: { position: { x: target.position.x + dx, y: 0, z: target.position.z + 2 }, rotation: 0, isRunning: false },
      });
    }
    await wait(900);
    const drops: any[] = [];
    A.socket.on('drop_item', (d: any) => drops.push(d.data ?? d));
    B.socket.on('drop_item', (d: any) => drops.push(d.data ?? d));
    // Les deux attaquent les mobs ensemble jusqu'à obtenir un drop (25%/kill)
    for (const m of spawns.slice(0, 10)) {
      for (let i = 0; i < 14 && drops.length === 0; i++) {
        A.socket.emit('attack', { type: 'attack', timestamp: Date.now(), data: { targetId: m.id } });
        B.socket.emit('attack', { type: 'attack', timestamp: Date.now(), data: { targetId: m.id } });
        await wait(480);
      }
      if (drops.length > 0) break;
      A.socket.emit('move', { type: 'move', timestamp: Date.now(), data: { position: { x: m.position.x + 2, y: 0, z: m.position.z + 2 }, rotation: 0, isRunning: false } });
      B.socket.emit('move', { type: 'move', timestamp: Date.now(), data: { position: { x: m.position.x - 2, y: 0, z: m.position.z + 2 }, rotation: 0, isRunning: false } });
      await wait(700);
    }
    check('Mob partagé: loot généré (un set par mob)', drops.length > 0 && drops.length <= 6, `${drops.length} drops`);

    // B tente de ramasser le drop de A (propriétaire 30 s) → refus.
    // Le pickup répond par ÉVÉNEMENTS (pickup_success/failed), pas par ack.
    if (drops.length) {
      const bResults: any[] = [];
      const aResults: any[] = [];
      B.socket.on('pickup_failed', (d: any) => bResults.push(d.data ?? d));
      B.socket.on('pickup_success', (d: any) => bResults.push({ ok: true, ...(d.data ?? d) }));
      A.socket.on('pickup_success', (d: any) => aResults.push(d.data ?? d));
      A.socket.on('pickup_failed', (d: any) => aResults.push({ failed: true, ...(d.data ?? d) }));
      B.socket.emit('pickup_item', { droppedItemId: drops[0].droppedItemId, timestamp: Date.now() });
      await wait(1500);
      check('Loot propriétaire: B ne ramasse pas le drop de A', bResults.length > 0 && !bResults[0].ok,
        String(bResults[0]?.message ?? JSON.stringify(bResults[0] ?? {})).slice(0, 60));
      A.socket.emit('pickup_item', { droppedItemId: drops[0].droppedItemId, timestamp: Date.now() });
      await wait(1500);
      check('A ramasse son drop', aResults.length > 0 && !aResults[0].failed);
    } else {
      check('Loot générée', false, 'aucun drop (chance 25%)');
    }
  }

  console.log(failures === 0 ? '\nTOUS LES TESTS PHASE 5 PASSENT' : `\n${failures} ÉCHEC(S)`);
  A.socket.disconnect();
  B.socket.disconnect();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
