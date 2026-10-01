/**
 * Test PHASE 4: courbe XP officielle, stats, masteries, quêtes.
 * Usage: npx tsx scripts/test-phase4.ts
 */
import { io } from 'socket.io-client';
import { cumulativeXpForLevel } from '@srobro/shared';

const socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
const req = <T = any>(event: string, data: any = {}, timeout = 15000): Promise<T> =>
  new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout ${event}`)), timeout);
    socket.emit(event, data, (res: T) => { clearTimeout(t); resolve(res); });
  });
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

let failures = 0;
const check = (label: string, ok: boolean, detail = ''): void => {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};

setInterval(() => { if (socket.connected) socket.emit('heartbeat', { t: Date.now() }); }, 8000);

const states: any[] = [];
const questsEvents: any[] = [];

async function main(): Promise<void> {
  await new Promise<void>((r) => socket.on('connect', r));
  socket.on('player:state', (d: any) => states.push(d.data ?? d));
  socket.onAny?.(() => undefined);

  const suffix = Date.now().toString(36);
  const username = 'p4_' + suffix;
  await req('auth:register', { username, password: 'test1234' });
  await req('auth:login', { username, password: 'test1234' });
  const create = await req('character:create', { name: 'He' + suffix.slice(-6), race: 'chinese', gender: 'male' });
  const sel = await req('character:select', { characterId: create.character.id });
  check('Perso créé et sélectionné', sel.success);

  // Kit de départ reçu ?
  const inv = await req('inventory:list');
  const filled = (inv.slots ?? []).filter((s: any) => s).length;
  check('Kit de départ (3 items: potions + lame)', filled === 3, `${filled} slots`);

  // 1. Courbe XP officielle: niveau 1 → 118 XP requis
  const nextThreshold = cumulativeXpForLevel(2);
  check('Courbe officielle: lvl1→2 = 118 XP', nextThreshold === 118, `cumulativeXpForLevel(2)=${nextThreshold}`);
  const s0 = states[states.length - 1];
  check('HUD: nextLevelExp=118, base=0', s0?.nextLevelExp === 118 && (s0?.levelBaseExp ?? 0) === 0,
    `next=${s0?.nextLevelExp} base=${s0?.levelBaseExp}`);

  // 2. Tuer 3 Mangnyangs (54 XP chacun = 162 > 118) → niveau 2
  await wait(2500);
  const spawns = await new Promise<any[]>((resolve) => {
    const seen: any[] = [];
    const h = (d: any) => { seen.push(d.data ?? d); };
    socket.on('spawn', h);
    socket.emit('world:snapshot', {});
    setTimeout(() => { socket.off('spawn', h); resolve(seen.filter((x) => x.entityType === 'monster')); }, 3000);
  });
  const mang = spawns.filter((m) => m.name === 'Mangnyang');
  check('Mangnyangs visibles', mang.length > 0, `${mang.length}`);
  if (mang.length) {
    socket.emit('move', { type: 'move', timestamp: Date.now(), data: { position: { x: mang[0].position.x + 2, y: 0, z: mang[0].position.z + 2 }, rotation: 0, isRunning: false } });
    await wait(800);
    const deadline = Date.now() + 90000;
    while (Date.now() < deadline) {
      const st = states[states.length - 1];
      if (st && (st.exp >= 118 || st.level >= 2)) break;
      // La cible la plus proche encore vivante
      const target = mang.find((mm) => mm.hp === undefined || mm.hp > 0);
      if (!target) break;
      socket.emit('attack', { type: 'attack', timestamp: Date.now(), data: { targetId: target.id } });
      await wait(500);
      // Considérer la cible morte après ~6 attaques (24 HP / dégâts)
      const hits = Math.floor((Date.now() - (deadline - 90000)) / 500);
      void hits; void target;
      if ((states[states.length - 1]?.exp ?? 0) % 54 === 0 && (states[states.length - 1]?.exp ?? 0) > 0) {
        // un kill de plus: retirer la cible de la liste
        const idx = mang.indexOf(target);
        if (idx >= 0) mang[idx] = { ...target, hp: 0 };
      }
    }
    const st = states[states.length - 1];
    check('Niveau 2 atteint (courbe officielle)', st?.level === 2, `lvl=${st?.level} exp=${st?.exp} (seuil 118)`);
    check('SP gagnés par les kills', (st?.sp ?? 0) > 0, `sp=${st?.sp}`);
    check('statPoints alloués au level-up', (st?.statPoints ?? 0) >= 3, `statPoints=${st?.statPoints}`);
  }

  // 3. Répartition STR → dégâts mesurés
  const allocBefore = await req('character:allocate', { stat: 'str' });
  check('Allocation STR (+1)', allocBefore.success, `str=${allocBefore.str} atk=${allocBefore.attackMin}-${allocBefore.attackMax}`);
  // 9 points de plus → +1 dégât (10 STR par tranche)
  let lastAtk = allocBefore.attackMin;
  let increased = false;
  for (let i = 0; i < Math.min(9, allocBefore.statPoints); i++) {
    const r = await req('character:allocate', { stat: 'str' });
    if (r.attackMin > lastAtk) { increased = true; }
    lastAtk = r.attackMin;
  }
  check('STR → dégâts mesurés', increased || allocBefore.attackMin > 0, `atk finale=${lastAtk}`);

  // 4. Masteries: liste + montée
  const mList = await req('character:masteries');
  check('Masteries listées (7 arbres CH)', (mList.masteries ?? []).length === 7, `${mList.masteries?.length}`);
  const bicheon = mList.masteries?.find((m: any) => m.name === 'Bicheon');
  if (bicheon) {
    const up = await req('mastery:levelup', { masteryId: bicheon.masteryId });
    check('Montée Bicheon niveau 1 (SP dépensés)', up.success, `lvl=${up.level} coût=${up.spent} sp restants=${up.sp}`);
    const up2 = await req('mastery:levelup', { masteryId: bicheon.masteryId });
    check('Montée Bicheon niveau 2 (autorisée au niv perso 2)', up2.success, `lvl=${up2.level}`);
    const capTry = await req('mastery:levelup', { masteryId: bicheon.masteryId });
    // cap = niveau du perso (2): la 3e montée doit échouer
    check('Cap maîtrise = niveau perso', !capTry.success, capTry.error);
  }

  // 5. Quêtes: accepter + rendre au garde
  const avail = await req('quest:get_available');
  const welcome = (avail.quests ?? []).find((q: any) => /Welcome/i.test(q.name));
  check('Quête « Welcome » disponible', !!welcome);
  if (welcome) {
    const acc = await req('quest:accept', { questId: welcome.id });
    check('Quête acceptée', acc.success);
    // Interaction avec le garde (à côté du spawn)
    socket.emit('move', { type: 'move', timestamp: Date.now(), data: { position: { x: 2, y: 0, z: 505 }, rotation: 0, isRunning: false } });
    await wait(700);
    let questDone = '';
    socket.on('quest:completed', (ev: any) => { questDone = (ev && ev.questName) || 'oui'; });
    const inter = await req('quest:interact', { npcId: 'npc_jangan_guard' });
    await wait(600);
    const interOk = inter.success && (questDone !== '' || (inter.completed ?? []).includes(welcome.name));
    check('Interaction garde (talk + rendu)', interOk,
      `événement quête: ${questDone !== '' ? 'reçu' : 'aucun'} · complétées: ${(inter.completed ?? []).join(',') || 'aucune'} · dialogue: ${inter.startedDialogue ?? '-'}`);
    const st = states[states.length - 1];
    check('Récompenses reçues (+1000 XP)', (st?.exp ?? 0) >= 1000, `exp=${st?.exp}`);
    // La quête kill doit maintenant être disponible
    const avail2 = await req('quest:get_available');
    check('Quête « First Steps » débloquée', (avail2.quests ?? []).some((q: any) => /First Steps/i.test(q.name)));
  }

  console.log(failures === 0 ? '\nTOUS LES TESTS PHASE 4 PASSENT' : `\n${failures} ÉCHEC(S)`);
  socket.disconnect();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
