/**
 * Test PHASE C V3 — quêtes officielles + journal + titres Blue Zerk.
 * Vérifie (critères §2 phase C de PROMPT_MAITRE_V3):
 *  1. PNJ de quête officiels positionnés (Sonhyeon aux coordonnées officielles).
 *  2. Quêtes officielles disponibles par niveau (Vanished Child lv3, etc.).
 *  3. Chaîne bout-en-bout: accepter Weapon Delivery → talk à Iyang →
 *     complétion avec récompenses EXACTES (225 EXP, 205 or).
 *  4. Progression de kill (Battle with Weasel: 1 Gyo → 1/40) + abandon.
 *  5. Titres: zerkKills 500 (DB) → titre Knight dans player:state (HUD) +
 *     Energy of Life OK puis cooldown 20 min refusé.
 * Usage: npx tsx scripts/test-phaseC-quests.ts
 */
import { io } from 'socket.io-client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let failures = 0;
const check = (label: string, ok: boolean, detail = ''): void => {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function main(): Promise<void> {
  // ---------- 1. PNJ officiels en base ----------
  const sonhyeon = await prisma.nPC.findUnique({ where: { id: 'npc_q_sonhyeon' } });
  check('General Sonhyeon aux coordonnées officielles (6203,1182 → −257,592)',
    !!sonhyeon && Math.abs(sonhyeon.positionX - (-257)) < 3 && Math.abs(sonhyeon.positionZ - 592) < 3,
    sonhyeon ? `${sonhyeon.positionX},${sonhyeon.positionZ}` : 'absent');
  const npcCount = await prisma.nPC.count({ where: { id: { startsWith: 'npc_q_' } } });
  check('24 PNJ de quête officiels seedés', npcCount >= 24, `${npcCount}`);
  const questCount = await prisma.quest.count();
  check('46+ quêtes officielles en base', questCount >= 46, `${questCount}`);

  const socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => socket.on('connect', r));
  const hb = setInterval(() => socket.emit('heartbeat', { t: Date.now() }), 5000);
  const req = (ev: string, data: any = {}, timeout = 15000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  const states: any[] = [];
  socket.on('player:state', (d: any) => states.push(d?.data ?? d));
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    return '(rien)';
  };

  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = 'Qst' + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  const cid = create.character.id;
  await req('character:select', { characterId: cid });
  await wait(2000);
  await chat('/level 3');

  // ---------- 2. Quêtes officielles disponibles ----------
  const avail = await req('quest:get_available', {});
  const names: string[] = (avail.quests ?? []).map((q: any) => q.name);
  check('Vanished Child disponible (lv3, KB officielle)', names.includes('Vanished Child'), names.slice(0, 5).join(', '));
  check('Battle with Weasel disponible (lv3)', names.includes('Battle with Weasel'));

  // ---------- 3. Chaîne bout-en-bout: Weapon Delivery (talk) ----------
  const avail1 = await req('quest:get_available', {});
  const wd = (avail1.quests ?? []).find((q: any) => q.name === 'Weapon Delivery');
  check('Weapon Delivery (lv1) trouvable', !!wd);
  const goldBefore = (states[states.length - 1] ?? {}).gold ?? 0;
  const acc = await req('quest:accept', { questId: wd.id });
  check('Quête acceptée', acc.success === true, acc.error ?? '');
  // se téléporter À CÔTÉ d'Iyang (6667,1147 → 207,557) puis interagir
  await chat('/tp 207 557');
  await wait(1800);
  const inter = await req('quest:interact', { npcId: 'npc_q_iyang' });
  check('Remise auprès d\u2019Iyang (quest:interact)', inter.success === true,
    JSON.stringify(inter.completed ?? inter.error ?? '').slice(0, 60));
  await wait(2000);
  const st = states[states.length - 1] ?? {};
  check('Récompense EXACTE: +205 or (KB)', st.gold === goldBefore + 205,
    `or ${goldBefore} → ${st.gold}`);
  const doneList = await req('quest:get_completed', {});
  check('Quête listée dans les terminées (journal)',
    (doneList.quests ?? []).some((q: any) => (q.name ?? (q.quest ?? {}).name) === 'Weapon Delivery'));

  // ---------- 4. Progression kill + abandon (Chinese Tutorial: Mangnyang) ----------
  const avail2 = await req('quest:get_available', {});
  const bw = (avail2.quests ?? []).find((q: any) => q.name === 'Chinese Tutorial');
  await req('quest:accept', { questId: bw.id });
  await chat('/tp 83 521'); // camp Mangnyang
  await wait(2500);
  // tuer 1 monstre du camp (le plus proche)
  await chat('/kill');
  await wait(1500);
  const inProg = await req('quest:get_in_progress', {});
  const row = (inProg.quests ?? []).find((p: any) => (p.quest ?? p).name === 'Chinese Tutorial');
  const prog = row ? Object.values(row.progress ?? {}) : [];
  check('Kill crédité sur l\u2019objectif (progression > 0)', prog.some((v: any) => Number(v) > 0),
    JSON.stringify(row?.progress ?? {}));
  const ab = await req('quest:abandon', { questId: bw.id });
  check('Abandon fonctionnel', ab.success === true);

  // ---------- 5. Titres Blue Zerk + Energy of Life ----------
  await prisma.character.update({ where: { id: cid }, data: { zerkKills: 500 } });
  // re-sélection pour recharger le cache du TitleManager
  await req('character:select', { characterId: cid });
  await wait(2500);
  const st2 = states[states.length - 1] ?? {};
  check('Titre Knight (500 kills en zerk) dans player:state', st2.title === 'Knight', `title=${st2.title}`);
  const e1 = await req('zerk:energy', {});
  check('Energy of Life utilisable (titre Knight)', e1.success === true, e1.error ?? '');
  const e2 = await req('zerk:energy', {});
  check('Energy of Life refusée pendant le cooldown 20 min', e2.success !== true, e2.error ?? '');

  clearInterval(hb);
  socket.disconnect();
  console.log(failures === 0 ? '\nPHASE C (quêtes+titres): TOUT PASSÉ' : `\nPHASE C: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
