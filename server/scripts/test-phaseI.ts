/**
 * Test PHASE I (Europe + Égypte + Job Temple + cap 120).
 * Vérifie (KB CITIES_04/05, 13_ZONES_OVERVIEW, 15_UNIQUE_BOSSES, 02/03):
 *  1. Perso européen spawn à Constantinople (ancre moteur 69370/15846).
 *  2. Stats officielles mobs EU: Movoi lv2 55 HP, Cerberus 693 072 HP.
 *  3. Cerberus unique persistant présent à son spawn officiel.
 *  4. Réseau officiel: gate Constantinople → Samarkand 5 000 or, arrivée
 *     à l'ancre Samarkand; Samarkand propose Constantinople + Hotan.
 *  5. Job Temple: refus sans costume de métier, entrée en hunter,
 *     paliers officiels Selket (57 722 800) → Neith (59 340 839),
 *     complétion + cooldown 3 h.
 *  6. Cap 120: /level 120 accepté, /level 121 refusé.
 * Usage: npx tsx scripts/test-phaseI.ts
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

  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = 'Cst' + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'european', gender: 'male' });
  await req('character:select', { characterId: create.character.id });
  await wait(2500);

  // ---------- 1. Départ EU à Constantinople ----------
  const loc1 = await chat('/loc');
  const cstOk = /69\s*3\d\d/.test(loc1) && /15\s*8\d\d/.test(loc1);
  check('Perso EU spawn à Constantinople (69370/15846)', cstOk, loc1.slice(0, 60));

  // ---------- 2. Stats officielles DB vSRO ----------
  // /mobinfo montre le monstre LE PLUS PROCHE: on spawn le mob exact sur place
  await chat('/spawn MOB_EU_MOVOI 1');
  await wait(1500);
  const movoi = await chat('/mobinfo');
  check('Movoi officiel (lv2, 55 HP)', movoi.includes('55') && /niv\. 2/.test(movoi), movoi.slice(0, 70));
  await chat('/kill'); // nettoyer le mob de test
  await wait(3400);

  // ---------- 3. Cerberus persistant à son spawn ----------
  await chat('/tp 68140 15007');
  await wait(2000);
  const cerbSpawn = spawns.find((s: any) => s.maxHp === 693072);
  check('Cerberus présent à son spawn (unique persistant)', !!cerbSpawn,
    cerbSpawn ? `lvl=${cerbSpawn.level} @(${Math.round(cerbSpawn.position?.x ?? 0)})` : 'non vu en snapshot');

  // ---------- 4. Réseau de Dimensional Gates ----------
  await chat('/gold 50000');
  await wait(1200);
  // /tp précis de la gate (départ EU = dessus)
  await chat('/tp 69368 15831');
  await wait(800);
  const list = await req('teleport:list', {});
  const gates: any[] = list.destinations ?? list.gates ?? list.data ?? [];
  const smkGate = gates.find((g: any) => g.name === 'Samarkand');
  check('Gate Constantinople → Samarkand (5 000 or)', !!smkGate && Number(smkGate.cost) === 5000,
    smkGate ? `cost=${smkGate.cost} req=${smkGate.requiredLevel}` : 'route absente');
  const use = await req('teleport:use', { teleportPointId: smkGate?.id });
  await wait(1500);
  const loc2 = await chat('/loc');
  const smkOk = /35\s*5\d\d/.test(loc2) && /29\s*7\d\d/.test(loc2);
  check('Téléport payé → arrivée Samarkand (35520/29760)', use.success && smkOk,
    `${(use.error ?? 'ok').slice(0, 30)} | ${loc2.slice(0, 50)}`);
  // Retour: la gate de Samarkand propose Constantinople
  await chat('/tp 35525 29766');
  await wait(800);
  const list2 = await req('teleport:list', {});
  const gates2: any[] = list2.destinations ?? list2.gates ?? list2.data ?? [];
  const names = gates2.map((g: any) => g.name).join(', ');
  check('Gate Samarkand → Constantinople + Hotan', names.includes('Constantinople') && names.includes('Hotan'), names);

  // ---------- 4b. Alexandria: marchands officiels 10D/11D (KB CITIES_04) ----------
  await chat('/tp 40257 -42275'); // Dimensional Gate (South) d'Alexandria
  await wait(1500);
  const shopAlex = await req('shop:list', {});
  const alexGoods: any[] = shopAlex.goods ?? [];
  const has11D = alexGoods.some((g: any) => Number(g.price) > 1000000);
  check('Alexandria vend le 10D/11D (Hemaka, KB CITIES_04)',
    shopAlex.success && (shopAlex.npcName ?? '').includes('Alexandria') && alexGoods.length >= 10 && has11D,
    `${shopAlex.npcName}: ${alexGoods.length} articles, max ${Math.max(0, ...alexGoods.map((g: any) => Number(g.price))).toLocaleString('fr')} or`);

  // ---------- 5. Job Temple ----------
  await chat('/level 100');
  await wait(1200);
  const noJob = await req('dungeon:enter', { kind: 'job_temple', tier: 'beginner' });
  check('Job Temple refusé sans costume de métier', !noJob.success, (noJob.error ?? '').slice(0, 60));
  const jobRes = await req('job:change', { job: 'hunter' });
  check('Costume de métier endossé (hunter)', jobRes.success, JSON.stringify(jobRes).slice(0, 40));
  // Entrée à l'entrée OFFICIELLE de la tombe (KB CITIES_04: (−11351,−3278) →
  // moteur (45549,−45278)) — désert isolé: aucun camp d'anneau à <100 m, les
  // /kill (150 m) ne peuvent cibler que les monstres du donjon.
  await chat('/tp 45549 -45278');
  await wait(3500); // laisser despawn les mobs lointains
  const enter = await req('dungeon:enter', { kind: 'job_temple', tier: 'beginner' });
  check('Job Temple ouvert (beginner, entrée Red Eggre)', enter.success, (enter.error ?? enter.note ?? '').slice(0, 70));
  await wait(2000);
  const selket = [...spawns].reverse().find((s: any) => s.maxHp === 57722800);
  check('Selket spawnée (57 722 800 HP officiels)', !!selket, selket ? `lvl=${selket.level}` : 'non vue');

  // Kills sur place: tout le donjon (6 trash r=18 + paliers à +30) est à
  // moins de 150 m — chaque /kill élimine le plus proche, stage après stage.
  await chat('/god');
  await wait(400);
  let guard = 0;
  while (!chats.some((c) => c.includes('Donjon terminé')) && guard < 14) {
    const killReply = await chat('/kill');
    console.log(`  [kill ${guard}] « ${killReply.slice(0, 40)} »`);
    await wait(3400); // despawn du cadavre (sinon /kill cible le cadavre)
    guard++;
  }
  const doneMsg = chats.find((c) => c.includes('Donjon terminé'));
  const neithSeen = spawns.some((s: any) => s.maxHp === 59340839);
  check('Palier 2 officiel: Neith (59 340 839 HP) après Selket', neithSeen, neithSeen ? 'vue' : 'non vue');
  check('Complétion Job Temple (récompense Seal of Nova 11D)', !!doneMsg, doneMsg?.slice(0, 60) ?? 'pas de message');
  const reenter = await req('dungeon:enter', { kind: 'job_temple', tier: 'beginner' });
  check('Re-entrée refusée (cooldown 3 h)', !reenter.success, (reenter.error ?? '').slice(0, 50));

  // ---------- 6. Cap 120 ----------
  const lv120 = await chat('/level 120');
  await wait(800);
  const lv121 = await chat('/level 121');
  check('Cap 120: /level 120 accepté, 121 refusé', !/Usage/.test(lv120) && /Usage/.test(lv121),
    `« ${lv120.slice(0, 30)} » / « ${lv121.slice(0, 30)} »`);

  socket.disconnect();
  console.log(failures === 0 ? '\nPHASE I: TOUT PASSÉ' : `\nPHASE I: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
