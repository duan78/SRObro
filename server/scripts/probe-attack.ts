/**
 * Sonde de diagnostic combat — attaque bout-en-bout avec acks.
 * Usage: npx tsx scripts/probe-attack.ts
 */
import { io } from 'socket.io-client';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main(): Promise<void> {
  const socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => socket.on('connect', r));
  socket.emit('heartbeat', { t: Date.now() });
  const req = (ev: string, data: any = {}, timeout = 20000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  const events: string[] = [];
  socket.on('attack', (d: any) => events.push('attack: ' + JSON.stringify(d?.data ?? d).slice(0, 160)));
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    throw new Error('timeout chat ' + m);
  };

  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = 'Prb' + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  await req('character:select', { characterId: create.character.id });
  await wait(2000);
  console.log('loc:', await chat('/loc'));
  await chat('/tp 60 510');
  await wait(2500);
  const snap: any = await req('world:snapshot', {}, 8000).catch(() => null);
  const ents = snap?.entities ?? [];
  const monsters = ents.filter((e: any) => (e.entityType ?? e.type) === 'monster');
  console.log('monstres au snapshot:', monsters.length);
  if (!monsters.length) { console.log('AUCUN MONSTRE'); socket.disconnect(); process.exit(1); }
  const target = monsters[0];
  const dist = Math.hypot(target.position.x - 60, target.position.z - 510);
  console.log('cible:', target.name, 'lv', target.level, 'hp', target.hp, 'dist', dist.toFixed(0));
  const sel: any = await req('combat:select', { targetId: target.id });
  console.log('combat:select →', JSON.stringify(sel).slice(0, 120));
  const atk: any = await req('combat:attack', { targetId: target.id });
  console.log('combat:attack →', JSON.stringify(atk).slice(0, 120));
  await wait(7000);
  console.log('--- packets attack reçus ---');
  for (const e of events.slice(0, 10)) console.log(' ', e);
  console.log(events.length > 0 ? 'SONDE: ATTAQUES OK' : 'SONDE: AUCUNE ATTAQUE REÇUE');
  socket.disconnect();
  process.exit(events.length > 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
