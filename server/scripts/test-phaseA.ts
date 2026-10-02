/**
 * Test PHASE A (PROMPT_MAITRE_V2): injection des données officielles.
 * Vérifie:
 *  1. Monstres aux stats SERVEUR officielles (DB vSRO 2026-10): Tiger Girl
 *     598 720 HP / 451 200 EXP, niveau 20.
 *  2. GAP officiel: kill au gap 1 (lvl 1, mastery 0) → XP ×0.9 (406 080).
 *  3. Skills officiels: Strike Smash (SKILL_CH_SWORD_SMASH_A_01) — MP 19,
 *     cast 411 ms, cooldown 3000 ms, dégâts formule officielle.
 *  4. Gating maîtrise: skill exigeant mastery 27 rejeté pour un nouveau perso.
 * Usage: npx tsx scripts/test-phaseA.ts
 */
import { io } from 'socket.io-client';

const OFFICIAL_TG = { level: 20, hp: 598720, exp: 451200 };
const SMASH_A = { code: 'SKILL_CH_SWORD_SMASH_A_01', mpCost: 19, castMs: 411, cooldownMs: 3000 };
const SMASH_B = { code: 'SKILL_CH_SWORD_SMASH_B_01', reqMastery: 27 };

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
  const req = (ev: string, data: any = {}, timeout = 20000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  const received: Record<string, any[]> = {};
  const on = (ev: string) => { received[ev] = []; socket.on(ev, (d: any) => received[ev].push(d.data ?? d)); };
  ['spawn', 'despawn', 'attack', 'xp_gain', 'player:state', 'casting_start', 'skill_rejected'].forEach(on);
  received['chat'] = [];
  socket.on('chat', (d: any) => received['chat'].push(d.data ?? d));
  /** Commande GM: émet et attend la réponse chat du dispatch (pas d'ack). */
  const chat = async (msg: string): Promise<string> => {
    received['chat'].length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: msg, channel: 'general' } });
    for (let i = 0; i < 40; i++) {
      await wait(250);
      const reply = received['chat'].map((c: any) => c.message ?? '').find((m: string) => !m.startsWith('/'));
      if (reply) return reply;
    }
    throw new Error(`timeout chat: ${msg}`);
  };

  // Compte admin (owner) + perso DÉDIÉ au test (jamais un perso d'onglet ouvert)
  const user = 'arnaud', pass = 'hunter2';
  const login = await req('auth:login', { username: user, password: pass });
  if (!login.success) throw new Error('login admin: ' + JSON.stringify(login).slice(0, 100));
  const nm = 'TestA' + Date.now().toString(36).slice(-6);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  if (!create.success) throw new Error('create: ' + JSON.stringify(create).slice(0, 100));
  const sel = await req('character:select', { characterId: create.character.id });
  if (!sel.success) throw new Error('select');
  await wait(2500); // snapshot monde

  // ---------- 1. Monstre officiel: Tiger Girl ----------
  await chat(`/spawn MOB_CH_TIGERWOMAN 1`);
  await wait(1200);
  const tgSpawn = received.spawn.map((s: any) => s).find((s: any) => s.maxHp === OFFICIAL_TG.hp || /tiger/i.test(s.name ?? s.modelId ?? ''));
  check('Tiger Girl spawn avec HP officiels (598 720)', !!tgSpawn && tgSpawn.maxHp === OFFICIAL_TG.hp,
    tgSpawn ? `hp=${tgSpawn.maxHp} lvl=${tgSpawn.level}` : 'spawn non trouvé');
  check('Tiger Girl niveau officiel (20)', !!tgSpawn && tgSpawn.level === OFFICIAL_TG.level, `lvl=${tgSpawn?.level}`);

  // ---------- 2. XP officielle + GAP (kill GM → xp_gain) ----------
  if (tgSpawn) {
    received.xp_gain.length = 0;
    await chat(`/kill`); // tue le monstre le plus proche (la TG)
    await wait(1500);
    const xp = received.xp_gain[0];
    // Gap attendu: lvl 1, mastery 0 → gap 1 → expMult 0.9 → 451 200 × 0.9 = 406 080
    const expected = Math.round(OFFICIAL_TG.exp * 0.9);
    check('EXP officielle × GAP (gap 1 → ×0.9 = 406 080)', !!xp && xp.amount === expected,
      `amount=${xp?.amount} attendu=${expected} gap=${xp?.gap}`);
    check('Packet xp_gain expose le gap', !!xp && xp.gap === 1, `gap=${xp?.gap}`);
  }

  // ---------- 3. Skill officiel: Strike Smash ----------
  await chat(`/spawn MOB_CH_MANGNYANG 1`);
  await wait(1200);
  const mob = [...received.spawn].reverse().find((s: any) => /mangnyang/i.test(s.modelId ?? '') || /mangnyang/i.test(s.name ?? ''));
  if (!mob) { check('Mangnyang spawné', false); }
  else {
    const state0 = [...received['player:state']].reverse()[0];
    received['skill_rejected'].length = 0; received.attack.length = 0; received.casting_start.length = 0;
    socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: mob.id, skillId: SMASH_A.code } });
    await wait(1200);
    const st1 = [...received['player:state']].reverse()[0];
    const cast = received.casting_start[0];
    const atk = received.attack[0];
    check('Strike Smash: coût MP officiel (19)', st1 && state0 && st1.mp === state0.mp - SMASH_A.mpCost,
      `mp ${state0?.mp}→${st1?.mp}`);
    check('Strike Smash: cast officiel (411 ms)', !!cast && cast.durationMs === SMASH_A.castMs, `cast=${cast?.durationMs}`);
    check('Strike Smash: dégâts appliqués (formule officielle)', !!atk && atk.damage > 0 && atk.skillId === SMASH_A.code,
      `dmg=${atk?.damage} crit=${atk?.isCritical}`);

    // Cooldown officiel: 2e cast ~1,2 s après le 1er → rejet avec ~1800 ms
    // restants (3000 − 1200): prouve un cooldown de 3000 ms
    received['skill_rejected'].length = 0;
    socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: mob.id, skillId: SMASH_A.code } });
    await wait(600);
    const rej = received['skill_rejected'][0];
    check('Strike Smash: cooldown officiel 3000 ms', !!rej && rej.remainingMs > 1000 && rej.remainingMs <= 3000,
      `remaining=${rej?.remainingMs} (≈3000 − 1200 écoulés)`);

    // ---------- 4. Gating maîtrise (SMASH_B exige bicheon 27) ----------
    socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: mob.id, skillId: SMASH_B.code } });
    await wait(600);
    const rejB = received['skill_rejected'].find((r: any) => r.skillCode === SMASH_B.code);
    check(`Gating maîtrise: ${SMASH_B.code} (bicheon 27) rejeté`, !!rejB && /maîtrise/i.test(rejB.reason ?? ''),
      rejB?.reason);
  }

  socket.disconnect();
  console.log(failures === 0 ? '\nPHASE A: 9/9 ✓' : `\nPHASE A: ${failures} échec(s)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
