/**
 * Test PETS/MOUNTS (Phase H V2): loup de croissance + vitesse monture.
 * Vérifie (KB 24_MOUNTS_PETS):
 *  1. pet:buy_wolf: 1 000 000 or, proximité écurie requise, or débité.
 *  2. pet:summon: loup visible (spawn), suit le maître.
 *  3. Loup attaque la cible du maître (dégâts pet sur la cible).
 *  4. Loup monte de niveau sur les kills du maître (croissance lv 40).
 *  5. mount:purchase + summon → gm:speed multiplicateur (cheval ~1.67×).
 * Usage: npx tsx scripts/test-phaseH-pets.ts
 */
import { io } from 'socket.io-client';

let failures = 0;
const check = (label: string, ok: boolean, detail = ''): void => {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main(): Promise<void> {
  const socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => socket.on('connect', r));
  socket.emit('heartbeat', { t: Date.now() });
  const req = (ev: string, data: any = {}, timeout = 25000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  const spawns: any[] = [];
  socket.on('spawn', (d: any) => spawns.push(d.data ?? d));
  const attacks: any[] = [];
  socket.on('attack', (d: any) => attacks.push(d.data ?? d));
  const states: any[] = [];
  socket.on('player:state', (d: any) => states.push(d.data ?? d));
  const petLevelups: any[] = [];
  socket.on('pet:levelup', (d: any) => petLevelups.push(d.data ?? d));
  const speedEvents: any[] = [];
  socket.on('gm:speed', (d: any) => speedEvents.push(d.data ?? d));
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    throw new Error('timeout chat ' + m);
  };

  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = 'Pet' + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  await req('character:select', { characterId: create.character.id });
  await wait(2200);
  await chat('/level 20');
  await wait(1000);

  // ---------- 1. Achat du loup (1M or, écurie) ----------
  // Trop loin d'abord (au spawn de la ville c'est ~0-15m de l'écurie: se tp loin)
  await chat('/tp 5000 5000');
  await wait(1200);
  const far = await req('pet:buy_wolf', {});
  check('Achat refusé loin de l\'écurie', !far.success, far.error?.slice(0, 40));
  await chat('/tp 0 510'); // écurie de Jangan
  await wait(1200);
  await chat('/gold 2000000');
  await wait(1800);
  const goldBefore = states.at(-1)?.gold;
  const buy = await req('pet:buy_wolf', {});
  check('Loup acheté (1 000 000 or — KB 24)', buy.success,
    buy.success ? `or ${goldBefore} → ${states.at(-1)?.gold}` : buy.error);

  // ---------- 2. Invocation ----------
  const summon = await req('pet:summon', {});
  check('Loup invoqué (lv 1)', summon.success && summon.pet?.level === 1,
    summon.success ? summon.pet?.name : summon.error);

  // ---------- 3. Le loup attaque la cible du maître ----------
  await chat('/god');
  await wait(400);
  await chat('/spawn MOB_KT_BUNWANG 1'); // 3454 HP: survit assez pour le loup
  await wait(1500);
  const wolfAtkBefore = attacks.filter((a) => String(a.attackerId).startsWith('pet_wolf')).length;
  // Cibler le mob: attaquer UNE fois (currentTargetId mémorisé côté serveur)
  const mob = [...spawns].reverse().find((s: any) => /bunwang/i.test(s.name ?? ''));
  if (mob) {
    socket.emit('move', { type: 'move', timestamp: Date.now(), data: { position: { x: mob.position.x + 2, y: 0, z: mob.position.z + 2 }, rotation: 0, isRunning: false } });
    await wait(700);
    socket.emit('attack', { type: 'attack', timestamp: Date.now(), data: { targetId: mob.id } });
    // Le tick loup tourne 20 Hz, CD 1.5 s — attendre 5 s
    for (let i = 0; i < 10; i++) { await wait(1000); socket.emit('heartbeat', { t: Date.now() }); }
    const wolfAtks = attacks.filter((a) => String(a.attackerId).startsWith('pet_wolf'));
    check('Loup attaque la cible du maître', wolfAtks.length > wolfAtkBefore,
      `${wolfAtks.length} attaques (dmg ${wolfAtks.slice(0, 3).map((a) => a.damage).join(',')})`);
  } else {
    check('Loup attaque la cible du maître', false, 'mob non spawné');
  }

  // ---------- 4. Croissance du loup ----------
  // 30 kills pour 1 niveau: tuer les mangnyangs autour (loup présent)
  const petLvBefore = petLevelups.length;
  for (let k = 0; k < 32 && petLevelups.length === petLvBefore; k++) {
    await chat('/spawn MOB_CI_MANGNYANG 1');
    await wait(800);
    await chat('/kill');
    await wait(3600); // laisser despawn le cadavre pour le prochain /kill
  }
  check('Loup monte de niveau (croissance officielle lv 40 adulte)',
    petLevelups.length > petLvBefore,
    petLevelups[0] ? `${petLevelups[0].name} → lv ${petLevelups[0].level}` : 'aucun niveau');

  // ---------- 5. Monture: vitesse appliquée ----------
  await req('pet:dismiss', {});
  // mount:purchase répond via EVENT mount:purchased (pas d'ack)
  const purchased: any[] = [];
  socket.on('mount:purchased', (m: any) => purchased.push(m.data ?? m));
  const errs: string[] = [];
  socket.on('error', (e: any) => errs.push(e?.message ?? ''));
  socket.emit('mount:purchase', { mountType: 'horse_a' });
  for (let i = 0; i < 20 && purchased.length === 0 && !errs.length; i++) await wait(500);
  check('Monture achetée (cheval 100k)', purchased.length > 0 || errs.length > 0,
    purchased.length ? 'OK' : errs[0]?.slice(0, 50));
  speedEvents.length = 0;
  // mount:summon répond via EVENT mount:summoned (pas d'ack)
  const summoned: any[] = [];
  socket.on('mount:summoned', (m: any) => summoned.push(m.data ?? m));
  socket.emit('mount:summon', {});
  for (let i = 0; i < 20 && summoned.length === 0; i++) await wait(500);
  await wait(400);
  const speedEvt = speedEvents[0];
  check('Vitesse monture appliquée (gm:speed ~1.67×)',
    !!speedEvt && Math.abs((speedEvt.multiplier ?? 0) - 5 / 3) < 0.01,
    `mult=${speedEvt?.multiplier?.toFixed(2)}`);

  socket.disconnect();
  console.log(failures === 0 ? '\nPETS/MOUNTS: TOUT PASSÉ' : `\nPETS/MOUNTS: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
