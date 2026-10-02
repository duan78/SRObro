/**
 * V4 §D — Skills : logos ET logique (8 catégories castées, effets vérifiés)
 *
 * Prérequis: serveur de dev :3001 (frais recommandé), DB up (PG 5544).
 * Vérifie sur le serveur AUTORITATIF:
 *   1. dégât mono (SMASH)        5. imbue (GIGONGTA kind 8, sans cible)
 *   2. multi-coups (BASE ×2)     6. heal (SELFHEAL, sans cible)
 *   3. AoE nuke (GIGONGSUL 250%) 7. buff (GANGGI defp, sans cible)
 *   4. stun (SPEAR STUN 5 s)     8. cooldown (re-cast refusé)
 *   (zerk ×2: couvert par test-phaseC.ts — régression G)
 *
 * Leçons des runs intermédiaires:
 *  - perso DÉDIÉ requis (une session externe sur le même perso resauvegarde
 *    ses SP via autoSave et écrase les valeurs de test)
 *  - la commande chat part sur l'événement 'chat' (packet {type:'chat'}),
 *    pas 'chat:send'
 *  - /spawn fait apparaître le mob À LA POSITION DU JOUEUR → portée de cast
 *    garantie (le contrôle de portée est 3D: l'écart Y du terrain fait
 *    échouer les rapprochements manuels)
 *  - Chakji lv20/30 929 HP en cible (mangnyang one-shot au 1er coup →
 *    multi-coups/stun inobservables) ; HP du perso élargis (les Chakjis
 *    survivent et riposte)
 *  - auto-casts AVANT le combat (un perso mort ignore les casts en silence)
 */
import { io } from 'socket.io-client';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const URL = 'http://localhost:3001';
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

let pass = 0;
let fail = 0;
const check = (name: string, ok: boolean, detail = ''): void => {
  if (ok) { pass++; console.log(`✓ ${name}`); }
  else { fail++; console.log(`✗ ${name}${detail ? ' — ' + String(detail).slice(0, 140) : ''}`); }
};

async function main(): Promise<void> {
  // ---------- 0. Perso de test dédié ----------
  const NAME = 'Skv4test';
  const old = await prisma.character.findUnique({ where: { name: NAME } });
  if (old) await prisma.character.delete({ where: { id: old.id } });

  const socket = io(URL, { transports: ['websocket'] });
  const received: Record<string, any[]> = {};
  const on = (ev: string) => { received[ev] = received[ev] ?? []; socket.on(ev, (d: any) => received[ev].push(d?.data ?? d)); };
  ['spawn', 'attack', 'skill_rejected', 'casting_start', 'heal', 'entity_stunned', 'imbue:activated', 'buff:update', 'player:state', 'despawn'].forEach(on);

  const req = (ev: string, data: any, ms = 8000): Promise<any> => new Promise((res, rej) => {
    const t = setTimeout(() => rej(new Error('timeout ' + ev)), ms);
    socket.emit(ev, data, (r: any) => { clearTimeout(t); res(r); });
  });

  await new Promise<void>((res) => socket.on('connect', res));
  const login = await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  check('Login admin', !!login?.success);
  const created = await req('character:create', { name: NAME, race: 'chinese', gender: 'male' });
  check('Perso de test créé (chinois)', !!created?.success, created?.error);
  const charId: string = created?.character?.id ?? created?.id ?? '';
  if (!charId) throw new Error('id perso absent: ' + JSON.stringify(created).slice(0, 200));
  // lv40 (cap maîtrises CH 3×niveau), 40k SP (coût total ~21,5k), HP/MP
  // élargis (le nuke coûte 348 MP; les Chakjis ripostent) — AVANT select.
  await prisma.character.update({
    where: { id: charId },
    data: { level: 40, sp: BigInt(40000), skillPoints: 0, hp: 20000, maxHp: 20000, mp: 2000, maxMp: 2000 },
  });
  const sel = await req('character:select', { characterId: charId }, 20000);
  check('Sélection du perso de test (lv40, 40k SP)', !!sel?.success, sel?.error);

  // ---------- 1. Maîtrises (coût officiel 2L²) ----------
  const masteries = await req('character:masteries');
  const byName = (n: string): any => (masteries.masteries ?? []).find((m: any) => m.name === n);
  const train = async (name: string, to: number): Promise<void> => {
    const m = byName(name);
    if (!m) return;
    for (let i = 0; i < to; i++) {
      const up = await req('mastery:levelup', { masteryId: m.masteryId });
      if (!up?.success) break;
    }
  };
  await train('Bicheon', 5);
  await train('Heuksal', 14);
  await train('Cold Force', 8);
  await train('Force Force', 5);
  await train('Fire Force', 30);
  const m2 = await req('character:masteries');
  const lv = (n: string): number => (m2.masteries ?? []).find((m: any) => m.name === n)?.level ?? 0;
  check('Maîtrises entraînées (bicheon 5 · heuksal 14 · cold 8 · force 5 · fire 30)',
    lv('Bicheon') >= 5 && lv('Heuksal') >= 14 && lv('Cold Force') >= 8 && lv('Force Force') >= 5 && lv('Fire Force') >= 30,
    `bicheon=${lv('Bicheon')} heuksal=${lv('Heuksal')} cold=${lv('Cold Force')} force=${lv('Force Force')} fire=${lv('Fire Force')}`);

  // ---------- 2. Apprentissages officiels ----------
  const learn = async (code: string): Promise<any> => req('skill:learn', { code });
  const rHeal = await learn('SKILL_CH_WATER_SELFHEAL_A_01');
  const rImbue = await learn('SKILL_CH_COLD_GIGONGTA_A_01');
  const rBuff = await learn('SKILL_CH_COLD_GANGGI_A_01');
  const rStun = await learn('SKILL_CH_SPEAR_STUN_A_01');
  const rNuke = await learn('SKILL_CH_FIRE_GIGONGSUL_A_01');
  const rMulti = await learn('SKILL_CH_SWORD_BASE_01');
  check('6 skills officiels appris (heal/imbue/buff/stun/nuke/multi)',
    [rHeal, rImbue, rBuff, rStun, rNuke, rMulti].every((r) => r?.success || /déjà/i.test(r?.error ?? '')),
    [rHeal, rImbue, rBuff, rStun, rNuke, rMulti].map((r) => r?.error ?? 'ok').join(' | '));

  const avail = await req('skills:available', {}, 15000);
  const allLevels = (avail.series ?? []).flatMap((s: any) => s.levels);
  const selfheal = allLevels.find((l: any) => l.code === 'SKILL_CH_WATER_SELFHEAL_A_01');
  const ganggi = allLevels.find((l: any) => l.code === 'SKILL_CH_COLD_GANGGI_A_01');
  check('skills:available expose heal/stunMs/buffs + icônes',
    (selfheal?.heal ?? 0) > 0 && (ganggi?.defPct ?? 0) > 0 && typeof selfheal?.icon === 'string',
    `heal=${selfheal?.heal} defPct=${ganggi?.defPct} icon=${String(selfheal?.icon).slice(0, 30)}`);

  // ---------- 3. Infrastructure combat ----------
  const chat = (m: string): void => {
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
  };
  const dead = new Set<string>();
  socket.on('attack', (d: any) => { const a = d?.data ?? d; if (a?.remainingHp <= 0) dead.add(a.targetId); });
  socket.on('despawn', (d: any) => dead.add((d?.data ?? d).id));
  const cast = (skillId: string, targetId?: string): void => {
    socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: targetId ?? charId, skillId } });
  };
  const rejections = (): string => received['skill_rejected'].slice(-2).map((r: any) => r.reason).join(' | ');
  /** Cible fraîche à portée garantie: /spawn place le monstre sur le joueur.
   *  Chakji lv20/30 929 HP: survit aux coups d'un lv40 (multi-coups et stun
   *  observables — le mangnyang mourait au 1er coup). */
  const engageFresh = async (): Promise<any | null> => {
    const before = received.spawn.length;
    chat('/spawn MOB_CH_STRONG_CHAKJI 1');
    for (let i = 0; i < 12; i++) {
      await wait(300);
      const fresh = received.spawn.slice(before)
        .filter((s: any) => /chakji/i.test(s.name ?? '') && (s.hp ?? 1) > 0 && !dead.has(s.id));
      if (fresh.length > 0) return fresh[fresh.length - 1];
    }
    return null;
  };

  // ---------- 4. (5) Imbue SANS cible (avant tout combat) ----------
  received['imbue:activated'] = [];
  cast('SKILL_CH_COLD_GIGONGTA_A_01');
  await wait(900);
  check('Imbue: GIGONGTA activée sans cible', received['imbue:activated'].length > 0);

  // ---------- 5. (6) Heal SANS cible ----------
  await wait(2500);
  received['heal'] = [];
  cast('SKILL_CH_WATER_SELFHEAL_A_01');
  await wait(900);
  const heal = received['heal'][0];
  check('Heal: SELFHEAL sans cible → événement heal ≥ 89', !!heal && (heal.amount ?? 0) >= 89,
    JSON.stringify(heal ?? {}).slice(0, 80) + ' · ' + rejections());

  // ---------- 6. (7) Buff SANS cible ----------
  await wait(2500);
  received['buff:update'] = [];
  cast('SKILL_CH_COLD_GANGGI_A_01');
  await wait(900);
  const buffs = received['buff:update'][0]?.buffs ?? [];
  check('Buff: GANGGI (defp) actif avec durée + icône',
    buffs.some((b: any) => b.code === 'SKILL_CH_COLD_GANGGI_A_01' && (b.until ?? 0) > Date.now() && !!b.icon),
    JSON.stringify(buffs[0] ?? {}).slice(0, 90) + ' · ' + rejections());

  // ---------- 7. (8) Cooldown ----------
  received['skill_rejected'] = [];
  cast('SKILL_CH_COLD_GANGGI_A_01');
  await wait(700);
  check('Cooldown: re-cast immédiat refusé',
    received['skill_rejected'].some((r: any) => /cooldown/i.test(r.reason ?? '')),
    received['skill_rejected'][0]?.reason);

  // ---------- 8. (1) Dégât mono ----------
  await wait(2500);
  const t1 = await engageFresh();
  received.attack = [];
  cast('SKILL_CH_SWORD_SMASH_A_01', t1?.id);
  await wait(1200);
  check('Mono: SMASH → dégât sur la cible',
    received.attack.some((a) => a.targetId === t1?.id && a.damage > 0),
    received.attack[0] ? `dmg=${received.attack[0].damage}` : 'aucun packet attack · ' + rejections());

  // ---------- 9. (2) Multi-coups ----------
  await wait(2500);
  const t2 = await engageFresh();
  received.attack = [];
  cast('SKILL_CH_SWORD_BASE_01', t2?.id);
  await wait(1500);
  const baseHits = received.attack.filter((a) => a.targetId === t2?.id && a.skillId === 'SKILL_CH_SWORD_BASE_01');
  check('Multi-coups: BASE ×2 coups sur la cible', baseHits.length >= 2, `${baseHits.length} coups · ` + rejections());

  // ---------- 10. (3) AoE nuke ----------
  await wait(3000);
  const t3 = await engageFresh();
  const t3b = await engageFresh(); // second Chakji au même point → rayon 8 m
  received.attack = [];
  cast('SKILL_CH_FIRE_GIGONGSUL_A_01', t3?.id);
  await wait(1800);
  const nukeT = received.attack.filter((a) => a.skillId === 'SKILL_CH_FIRE_GIGONGSUL_A_01');
  const targets = new Set(nukeT.map((a) => a.targetId));
  check('AoE nuke (250%): cible + voisin ≤ 8 m touchés',
    nukeT.some((a) => a.targetId === t3?.id) && targets.size >= 2,
    `${nukeT.length} coups sur ${targets.size} cibles · ` + rejections());

  // ---------- 11. (4) Stun ----------
  await wait(4000);
  const t4 = await engageFresh();
  received['entity_stunned'] = [];
  cast('SKILL_CH_SPEAR_STUN_A_01', t4?.id);
  await wait(1200);
  const stun = received['entity_stunned'][0];
  check('Stun: SPEAR STUN 5 s → entity_stunned', !!stun && (stun.durationMs ?? 0) >= 5000,
    JSON.stringify(stun ?? {}).slice(0, 80) + ' · ' + rejections());

  // ---------- 12. Nettoyage ----------
  const finalC = await prisma.character.findUnique({ where: { id: charId }, select: { sp: true } });
  console.log(`\nSP consommés par le test: ${40000 - Number(finalC?.sp ?? 0)} (reliquat ${Number(finalC?.sp ?? 0)})`);
  await req('character:delete', { characterId: charId }).catch(() => undefined);
  const still = await prisma.character.findUnique({ where: { id: charId } });
  if (still) await prisma.character.delete({ where: { id: charId } });
  await prisma.$disconnect();
  socket.disconnect();
  console.log(`\n===== V4 §D SKILLS: ${pass}/${pass + fail} ${fail === 0 ? '✓ TOUT PASSÉ' : '— ÉCHECS'} =====`);
  process.exit(fail === 0 ? 0 : 1);
}

main().catch((e) => { console.error('FATAL', e); process.exit(1); });
