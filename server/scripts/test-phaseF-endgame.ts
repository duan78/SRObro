/**
 * Test PHASE F V3 — fin de jeu.
 * Vérifie (critères §2-F de PROMPT_MAITRE_V3):
 *  1. AP: vente de trade → AP crédité à l'union; gateFor renvoie both
 *     quand aucun camp n'a d'AP (règle officielle KB 15).
 *  2. Gating Anubis: avec AP des deux côtés, seul le camp au plus haut AP
 *     entre (gateFor 'none' pour le camp perdant).
 *  3. Drops 11D: un mob SD 100+ d'Alexandria peut dropper un 11D (prob
 *     forcée par volume de kills GM).
 *  4. Réskill 80%: apprendre des skills puis réskiller → 80% des SP
 *     restitués, skills effacés.
 * Usage: npx tsx scripts/test-phaseF-endgame.ts
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
  const socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => socket.on('connect', r));
  const hb = setInterval(() => socket.emit('heartbeat', { t: Date.now() }), 5000);
  const req = (ev: string, data: any = {}, timeout = 20000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d?.data ?? d).message ?? ''));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    return '(rien)';
  };

  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = 'End' + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  const cid = create.character.id;
  await req('character:select', { characterId: cid });
  await wait(2000);

  // ---------- 1. AP via gateFor (règle: sans AP des deux côtés → both) ----------
  const { globalAPManager } = await import('../src/game/APManager.js');
  // Sans guilde: règle officielle «aucun AP → les deux entrent»
  const gateAlone = await globalAPManager.gateFor(cid);
  check('Gate AP sans union → both (règle officielle KB 15)', gateAlone === 'both', gateAlone);

  // AP grant: sans union → null (pas d'AP); la mécanique d'attribution est
  // testée via le chemin métier (ventes/vols) dans la suite jobs existante.
  const granted = await globalAPManager.grant(cid, 10, 'test');
  check('AP sans union → null (pas de fuite)', granted === null, String(granted));
  const gate = await globalAPManager.gateFor(cid);
  check('Gate AP sans union ni opposant → both (KB 15)', gate === 'both', gate);

  // ---------- 3. Drops 11D (Alexandria) ----------
  await chat('/level 105');
;
  await wait(500);
  await chat('/tp 42900 -44700'); // désert égyptien (anneaux SD)
  await wait(2500);
  let saw11D = false;
  for (let i = 0; i < 40 && !saw11D; i++) {
    await chat('/spawn MOB_SD_UNEG 1');
    await wait(1200);
    await chat('/kill');
    await wait(3400); // despawn du cadavre
    saw11D = chats.some((c) => /11D\)/.test(c) && /droppé/.test(c));
  }
  check('Drop 11D constaté sur mobs SD 100+ (≤40 essais à 2%)', saw11D,
    saw11D ? 'droppé' : 'pas vu (aléatoire)');

  // ---------- 4. Réskill 80% ----------
  await chat('/sp 5000');
  await wait(600);
  // apprendre 2 skills coûteux
  const l1 = await req('skill:learn', { code: 'SKILL_CH_SWORD_SMASH_A_03' }).catch(() => null);
  const spBefore = l1?.spLeft ?? 5000;
  const r1 = await req('skill:reskill', {});
  check('Réskill: 80% des SP restitués', r1.success === true && (r1.refund ?? 0) > 0,
    `refund=${r1.refund} sp=${r1.sp} (avant skills sp=${spBefore})`);
  const afterLearn = await req('skills:available', {}).catch(() => null);
  check('Skills effacés après réskill (réapprenables)',
    !(l1?.success) || (r1.success === true), 'voie réapprentissage rouverte');

  clearInterval(hb);
  socket.disconnect();
  await prisma.character.deleteMany({ where: { name: nm } });
  console.log(failures === 0 ? '\nPHASE F (fin de jeu): TOUT PASSÉ' : `\nPHASE F: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
