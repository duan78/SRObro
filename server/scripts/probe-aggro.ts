/**
 * Sonde IA offensive: le monstre aggro-t-il et frappe-t-il le joueur ?
 * Usage: npx tsx scripts/probe-aggro.ts
 */
import { io } from 'socket.io-client';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main(): Promise<void> {
  const socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => socket.on('connect', r));
  const hb = setInterval(() => socket.emit('heartbeat', { t: Date.now() }), 5000);
  const req = (ev: string, data: any = {}, timeout = 20000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  const events: string[] = [];
  for (const ev of ['attack', 'aggro', 'entity:update', 'update', 'player:state']) {
    socket.on(ev, (d: any) => {
      const e = d?.data ?? d;
      const s = JSON.stringify(e);
      if (ev === 'player:state' ? /hp/.test(s) : true) events.push(ev + ': ' + s.slice(0, 130));
    });
  }
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    return '(pas de réponse)';
  };

  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = 'Agr' + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  await req('character:select', { characterId: create.character.id });
  await wait(2500);
  console.log('loc:', await chat('/loc'));
  // lieu isolé + bandit dessus
  await chat('/tp 2000 2000');
  await wait(2000);
  console.log('spawn bandit:', await chat('/spawn MOB_CH_BANDIT 2'));
  // rester immobile 30 s, écouter
  for (let i = 0; i < 15; i++) {
    await wait(2000);
    const states = events.filter((e) => e.startsWith('player:state'));
    const hpMatch = states.length ? states[states.length - 1].match(/"hp":\s*(\d+)/) : null;
    console.log(`  t=${(i + 1) * 2}s événements=${events.length} hp=${hpMatch ? hpMatch[1] : '?'}`);
    if (hpMatch && Number(hpMatch[1]) < 200) break;
  }
  const atks = events.filter((e) => e.startsWith('attack'));
  const aggro = events.filter((e) => e.startsWith('aggro') || e.startsWith('entity:update'));
  console.log('packets attack (reçus):', atks.length, '| updates/aggro:', aggro.length);
  console.log(atks.slice(0, 3).join('\n'));
  clearInterval(hb);
  socket.disconnect();
  process.exit(0);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
