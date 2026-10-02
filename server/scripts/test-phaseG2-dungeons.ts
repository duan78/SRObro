/**
 * Test DONJONS (Phase G V2): FGW Togui + Qin-Shi B6.
 * Vérifie (KB 29_FORGOTTEN_WORLD + 15_UNIQUE_BOSSES):
 *  1. dungeon:enter FGW a1: spawn trash + Elder Earth Ghost (1,27 M HP).
 *  2. Kills → talismans crédités (dungeon:talisman, 8 = collection).
 *  3. Boss mort + 8 talismans → complétion + cooldown 3 h (re-entrée refusée).
 *  4. dungeon:enter qinshi_b6: Medusa (MOB_TQ_WHITESNAKE, 183 535 199 HP).
 * Usage: npx tsx scripts/test-phaseG2-dungeons.ts
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
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  const talismans: any[] = [];
  socket.on('dungeon:talisman', (d: any) => talismans.push(d.data ?? d));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    throw new Error('timeout chat ' + m);
  };

  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = 'Dgn' + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  await req('character:select', { characterId: create.character.id });
  await wait(2000);
  await chat('/level 45'); // tranche a1 (35-50)
  await wait(1200);
  await chat('/gold 50000');
  await wait(1500);

  // ---------- 1. Entrée FGW ----------
  const enter = await req('dungeon:enter', { kind: 'fgw_togui', tier: 'a1' });
  check('FGW a1 ouverte (Elder officiel)', enter.success && enter.bossCode === 'MOB_GOD_TOGUI_TOGUIELDER_A1',
    enter.success ? `${enter.trashCount} trash + ${enter.bossCode}` : enter.error);
  await wait(1500);
  const elderSpawn = [...spawns].reverse().find((s: any) => s.maxHp === 1275761);
  check('Elder Earth Ghost spawné (1 275 761 HP officiels)', !!elderSpawn,
    elderSpawn ? `lvl=${elderSpawn.level}` : 'non vu');

  // ---------- 2. Talismans ----------
  // Kills GM pour créditer les 8 talismans: se placer SUR chaque monstre du
  // donjon avant /kill (le /kill cible le plus proche — les mobs d'anneau
  // extérieurs seraient sinon tués à la place)
  await chat('/god');
  await wait(500);
  const dgSpawns = spawns.slice(-8); // 7 trash + boss du donjon
  let talismanCount = 0;
  for (const m of dgSpawns) {
    if (talismans.length >= 8) break;
    await chat(`/tp ${Math.round(m.position.x)} ${Math.round(m.position.z)}`);
    await wait(600);
    const killReply = await chat('/kill');
    // Le corps despawn en 3 s: attendre pour que le /kill suivant ne
    // cible pas le cadavre (réponse « éliminé » sans effet)
    await wait(3400);
    talismanCount = talismans.length;
    console.log(`  [kill] ${m.name} hp=${m.maxHp} → « ${killReply.slice(0, 40)} » talismans=${talismanCount}`);
  }
  check('8 talismans crédités (collection FGW)', talismans.length >= 8,
    `${talismans.length}/8`);

  // ---------- 3. Complétion + cooldown ----------
  const completedMsg = chats.some((c) => c.includes('Donjon terminé'));
  check('Complétion annoncée (récompense D8 SoS)', completedMsg,
    chats.find((c) => c.includes('Donjon terminé'))?.slice(0, 60) ?? 'pas de message');
  const reenter = await req('dungeon:enter', { kind: 'fgw_togui', tier: 'a1' });
  check('Re-entrée refusée (cooldown 3 h officiel)', !reenter.success, reenter.error?.slice(0, 50));

  // ---------- 4. Qin-Shi B6 ----------
  // Cooldown par kind: qinshi_b6 indépendant
  const qs = await req('dungeon:enter', { kind: 'qinshi_b6', tier: 'b6' });
  check('Qin-Shi B6 ouverte (Medusa)', qs.success && qs.bossCode === 'MOB_TQ_WHITESNAKE',
    qs.success ? qs.bossCode : qs.error);
  await wait(1500);
  const medusa = [...spawns].reverse().find((s: any) => s.maxHp === 183535199);
  check('Medusa spawnée (183 535 199 HP officiels)', !!medusa,
    medusa ? `lvl=${medusa.level}` : 'non vue');

  socket.disconnect();
  console.log(failures === 0 ? '\nDONJONS: TOUT PASSÉ' : `\nDONJONS: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
