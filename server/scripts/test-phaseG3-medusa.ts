/**
 * Test MEDUSA ENGAGÉE (Phase G V2): mécaniques Bind/Petrify esquivées.
 * Vérifie (KB 15_UNIQUE_BOSSES § Medusa, guide TR):
 *  1. Medusa spawnée (183 535 199 HP) et ENGAGÉE (dégâts infligés).
 *  2. AoE périodique (12 s): joueur PROCHE ≤15 m touché (petrify + dégâts).
 *  3. Esquive: joueur LOIN >15 m reçoit boss:aoe_dodged (pas de dégâts).
 * Usage: npx tsx scripts/test-phaseG3-medusa.ts
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
  const req = (ev: string, data: any = {}, timeout = 30000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  const spawns: any[] = [];
  socket.on('spawn', (d: any) => spawns.push(d.data ?? d));
  const attacks: any[] = [];
  socket.on('attack', (d: any) => attacks.push(d.data ?? d));
  const aoeHits: any[] = [];
  socket.on('boss:aoe_hit', (d: any) => aoeHits.push(d.data ?? d));
  const aoeDodged: any[] = [];
  socket.on('boss:aoe_dodged', (d: any) => aoeDodged.push(d.data ?? d));
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    throw new Error('timeout chat ' + m);
  };

  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = 'Med' + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  await req('character:select', { characterId: create.character.id });
  await wait(2000);
  await chat('/level 40');
  await wait(1000);
  await chat('/gold 50000');
  await wait(1500);

  // Ouvrir Qin-Shi B6 et trouver Medusa
  const dg = await req('dungeon:enter', { kind: 'qinshi_b6', tier: 'b6' });
  check('Qin-Shi B6 ouverte', dg.success, dg.error);
  await wait(2000);
  const medusa = [...spawns].reverse().find((s: any) => s.maxHp === 183535199);
  check('Medusa spawnée (183 535 199 HP)', !!medusa, medusa ? `lvl=${medusa.level}` : 'non vue');
  if (!medusa) process.exit(1);

  // ---------- 1. ENGAGER Medusa (dégâts infligés) ----------
  await chat('/god'); // lv40 vs lv100: sans mode dieu le joueur meurt en 2 coups
  await wait(500);
  await chat('/tp ' + Math.round(medusa.position.x + 3) + ' ' + Math.round(medusa.position.z - 3));
  await wait(800);
  const attacksBefore = attacks.length;
  for (let i = 0; i < 8; i++) {
    socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: medusa.id, skillId: 'SKILL_CH_SWORD_SMASH_A_01' } });
    await wait(3200); // cooldown 3 s
  }
  const medusaHits = attacks.filter((a) => a.targetId === medusa.id && a.damage > 0);
  check('Medusa ENGAGÉE (dégâts infligés)', medusaHits.length > 0,
    `${medusaHits.length} coups portés (dmg total ${medusaHits.reduce((s, a) => s + a.damage, 0)})`);

  // ---------- 2. AoE: proche touché (petrify) ----------
  // Rester à ≤15 m: on est à ~4 m du tp. Attendre le cri (12 s max)
  aoeHits.length = 0; aoeDodged.length = 0;
  for (let i = 0; i < 10 && aoeHits.length === 0; i++) await wait(2000);
  check('Joueur PROCHE touché par l\'AoE (Petrify + dégâts)', aoeHits.length > 0,
    aoeHits[0] ? `dmg=${aoeHits[0].damage}, petrify=${aoeHits[0].petrifyMs} ms` : 'rien reçu');

  // ---------- 3. Esquive: loin >15 m ----------
  await chat('/tp ' + Math.round(medusa.position.x + 40) + ' ' + Math.round(medusa.position.z - 40));
  await wait(1000);
  aoeDodged.length = 0;
  for (let i = 0; i < 10 && aoeDodged.length === 0; i++) await wait(2000);
  check('ESQUIVE: joueur LOIN (>15 m) reçoit boss:aoe_dodged', aoeDodged.length > 0,
    aoeDodged[0] ? `distance=${aoeDodged[0].distance} m (safe >${aoeDodged[0].safeRadius})` : 'rien');

  socket.disconnect();
  console.log(failures === 0 ? '\nMEDUSA: TOUT PASSÉ' : `\nMEDUSA: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
