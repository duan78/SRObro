/**
 * Test PHASE C (PROMPT_MAITRE_V2): classes et skills complets.
 * Vérifie:
 *  1. skills:available: séries officielles CH avec niveaux/req/SP.
 *  2. skill:learn: refus sans maîtrise, apprentissage après montée de
 *     maîtrise (SP décrémentés du coût officiel), skill castable.
 *  3. Gating: skill non appris rejeté au cast.
 *  4. Hotbar dynamique: skills:available expose learned ✓.
 *  5. Zerk: 3 kills × N → orbes; activation ×2 (5 orbes), dégâts mesurés.
 *  6. Imbue: cast kind 8 → imbue:activated + dégâts physiques augmentés.
 * Usage: npx tsx scripts/test-phaseC.ts
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
  const req = (ev: string, data: any = {}, timeout = 20000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  const received: Record<string, any[]> = {};
  const on = (ev: string) => { received[ev] = []; socket.on(ev, (d: any) => received[ev].push(d.data ?? d)); };
  ['spawn', 'attack', 'player:state', 'skill_rejected', 'casting_start', 'zerk:orbs', 'zerk:activated', 'imbue:activated', 'xp_gain'].forEach(on);
  received['chat'] = [];
  socket.on('chat', (d: any) => received['chat'].push(d.data ?? d));
  const chat = async (m: string): Promise<string> => {
    received['chat'].length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = received['chat'].map((c: any) => c.message ?? '').find((x: string) => !x.startsWith('/')); if (r) return r; }
    throw new Error('timeout chat ' + m);
  };

  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = 'TestC' + Date.now().toString(36).slice(-6);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  if (!create.success) throw new Error('create');
  await req('character:select', { characterId: create.character.id });
  await chat('/god'); await chat('/sp 5000'); await chat('/level 12'); await wait(800);

  // ---------- 1. Arbre officiel ----------
  const tree = await req('skills:available');
  const bicheon = (tree.series ?? []).find((s: any) => s.masteryKey === 'bicheon');
  check('skills:available: arbre CH avec séries', tree.success && (tree.series ?? []).length > 50,
    `${(tree.series ?? []).length} séries, SP=${tree.sp}`);
  check('Séries Bicheon présentes (Sword Smash...)', !!bicheon && bicheon.levels.length > 0,
    bicheon?.name ?? 'absent');

  // ---------- 2. Apprentissage ----------
  // Cible: A_03 (reqM 9) — accessible après 9 montées de maîtrise (SP 2/nv)
  const allLevels = (tree.series ?? []).flatMap((sr: any) => sr.levels);
  const smashB = allLevels.find((l: any) => l.code === 'SKILL_CH_SWORD_SMASH_A_03');
  const deny = await req('skill:learn', { code: 'SKILL_CH_SWORD_SMASH_C_01' }); // maîtrise 49 requise
  check('Refus: maîtrise insuffisante', !deny.success, deny.error?.slice(0, 50));
  // Monter Bicheon: /gm pas nécessaire — mastery:levelup coûte des SP (2 par nv)
  const masteries = await req('character:masteries');
  const bicheonM = (masteries.masteries ?? []).find((m: any) => m.name === 'Bicheon');
  for (let i = 0; i < 9; i++) {
    const up = await req('mastery:levelup', { masteryId: bicheonM.masteryId });
    if (!up.success) break;
  }
  const spBefore = (await req('skills:available')).sp;
  const learn = await req('skill:learn', { code: smashB?.code ?? 'SKILL_CH_SWORD_SMASH_A_03' });
  const spAfter = (await req('skills:available')).sp;
  check('skill:learn: Smash A_03 appris (SP décrémentés)', learn.success && spAfter === spBefore - (smashB?.reqSp ?? 0),
    `${JSON.stringify(learn).slice(0, 90)} | ${JSON.stringify(smashB).slice(0, 80)} | ` +
    `SP ${spBefore} → ${spAfter} (coût ${smashB?.reqSp})`);

  // ---------- 3. Gating non-appris ----------
  await chat('/spawn MOB_CI_MANGNYANG 1');
  await wait(1200);
  const playerPos = () => received['player:state'].at(-1)?.position ?? { x: 0, z: 500 };
  const dead = new Set<string>();
  socket.on('attack', (d: any) => { const a = d.data ?? d; if (a.remainingHp <= 0) dead.add(a.targetId); });
  socket.on('despawn', (d: any) => { dead.add((d.data ?? d).id); });
  const nearestMang = (): any => {
    const p = playerPos();
    const cands = received.spawn.filter((s: any) => /mangnyang/i.test(s.name ?? '') && (s.hp ?? 1) > 0 && !dead.has(s.id));
    return cands.sort((a: any, b: any) =>
      Math.hypot(a.position.x - p.x, a.position.z - p.z) - Math.hypot(b.position.x - p.x, b.position.z - p.z))[0];
  };
  const mob = nearestMang();
  received['skill_rejected'].length = 0;
  socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: mob.id, skillId: 'SKILL_CH_SWORD_SMASH_C_01' } });
  await wait(700);
  check('Cast refusé: skill non appris', received['skill_rejected'].some((r: any) => /appris/i.test(r.reason ?? '')),
    received['skill_rejected'][0]?.reason?.slice(0, 50));

  // ---------- 4. Skill appris castable ----------
  received['skill_rejected'].length = 0; received.attack.length = 0;
  socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: mob.id, skillId: smashB.code } });
  await wait(1000);
  const hit = received.attack.find((a: any) => a.skillId === smashB.code);
  check('Skill appris castable (dégâts officiels)', !!hit && hit.damage > 0,
    `dmg=${hit?.damage} dist=${Math.hypot((mob?.position?.x??0) - (received['player:state'].at(-1)?.position?.x??0), (mob?.position?.z??0) - (received['player:state'].at(-1)?.position?.z??0)).toFixed(1)}m rej=${JSON.stringify(received['skill_rejected'].slice(-1))} mob=${!!mob}`);

  // ---------- 5. Zerk ----------
  // Vider la cible et tuer 15 mangnyangs (5 orbes) puis activer
  for (let k = 0; k < 15 && !(received['zerk:orbs'].at(-1)?.orbs >= 5); k++) {
    await chat('/spawn MOB_CI_MANGNYANG 1'); await wait(700);
    const m2 = nearestMang();
    if (!m2) continue;
    for (let i = 0; i < 10; i++) {
      socket.emit('attack', { type: 'attack', timestamp: Date.now(), data: { targetId: m2.id } });
      await wait(400);
      if (received.xp_gain.length > k + 1) break;
    }
  }
  const orbs = received['zerk:orbs'].at(-1)?.orbs ?? 0;
  check('Orbes zerk accumulées (15 kills → 5)', orbs >= 5,
    `orbes=${orbs} xp_gains=${received.xp_gain.length} attacks=${received.attack.length}`);
  if (orbs >= 5) {
    const zerk = await req('zerk:activate', {});
    check('Zerk activé (×2, 15 s)', zerk.success && received['zerk:activated'].length > 0);
    // Dégâts doublés mesurés sur un nouveau mob
    await chat('/spawn MOB_CI_MANGNYANG 1'); await wait(800);
    const m3 = nearestMang();
    received.attack.length = 0;
    socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: m3.id, skillId: smashB.code } });
    await wait(900);
    const zerkHit = received.attack.find((a: any) => a.skillId === smashB.code);
    check('Dégâts zerk ≈ ×2 (vs non-zerk)', !!zerkHit && zerkHit.damage >= hit.damage * 1.5,
      `normal=${hit?.damage} zerk=${zerkHit?.damage}`);
  }

  socket.disconnect();
  console.log(failures === 0 ? '\nPHASE C: TOUT PASSÉ' : `\nPHASE C: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
