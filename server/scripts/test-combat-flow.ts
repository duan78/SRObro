/**
 * Test de bout en bout de la boucle de combat (PHASE 2).
 * Usage: npx tsx scripts/test-combat-flow.ts
 *
 * Vérifie: spawn packets reçus, dégâts infligés, mort du monstre,
 * XP/or gagnés, respawn du mob, skill avec cooldown/MP, mort joueur + résurrection.
 */
import { io } from 'socket.io-client';

const URL = 'http://127.0.0.1:3001';
const socket = io(URL, { transports: ['websocket'] });

const req = <T = any>(event: string, data: any = {}, timeout = 15000): Promise<T> =>
  new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout ${event}`)), timeout);
    socket.emit(event, data, (res: T) => { clearTimeout(t); resolve(res); });
  });

let failures = 0;
const check = (label: string, ok: boolean, detail = ''): void => {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};

// Collecte des packets S2C intéressants
const received: Record<string, any[]> = {};
const track = (event: string) => {
  received[event] = received[event] ?? [];
  socket.on(event, (data: any) => received[event].push(data));
};
for (const ev of ['spawn', 'despawn', 'update', 'attack', 'xp_gain', 'sp_gain', 'level_up',
  'player:state', 'player:death', 'player:respawned', 'drop_item', 'skill_rejected',
  'pickup_success', 'casting_start']) {
  track(ev);
}

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

// Heartbeat comme le vrai client: sans packets, le timeout d'inactivité
// serveur (30 s) déconnecte le socket pendant les longues attentes.
setInterval(() => {
  if (socket.connected) socket.emit('heartbeat', { t: Date.now() });
}, 8000);

async function main(): Promise<void> {
  await new Promise<void>((resolve) => socket.on('connect', resolve));
  console.log('Connecté');

  const suffix = Date.now().toString(36);
  // Compte admin (arnaud): le test d'IA offensive GM-spawn des Bandits —
  // les permissions joueur/GM sont couvertes par test-phase6.
  const login = await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  if (!login.success) throw new Error('login admin requis pour ce test');
  const create = await req<{ success: boolean; character?: { id: string } }>('character:create', {
    name: 'War' + suffix.slice(-6), race: 'chinese', gender: 'male',
  });
  const sel = await req<{ success: boolean; character?: any }>('character:select', {
    characterId: create.character!.id,
  });
  check('Perso créé et sélectionné', sel.success, `hp=${sel.character?.hp}/${sel.character?.maxHp}`);

  // 1. Monstres: le SpawnManager peuple dans les ~2 s suivant l'arrivée
  // d'un joueur (check 1 s + latence réseau)
  const spawnDeadline = Date.now() + 6000;
  while (Date.now() < spawnDeadline && (received.spawn ?? []).length === 0) {
    await wait(400);
  }
  const monsters = (received.spawn ?? []).filter((s: any) => s.entityType === 'monster' || s.data?.entityType === 'monster');
  const spawnsNorm = (received.spawn ?? []).map((s: any) => (s.type ? s : s));
  console.log(`  spawn packets: ${(received.spawn ?? []).length}, monstres: ${monsters.length || (received.spawn ?? []).length}`);
  check('Monstres reçus au spawn', (received.spawn ?? []).length > 0);

  // Prendre le monstre le plus proche
  const allSpawns = (received.spawn ?? []).map((s: any) => (s.data ?? s));
  const mobList = allSpawns.filter((s: any) => s.entityType === 'monster');
  if (mobList.length === 0) {
    console.log('AUCUN MONSTRE — les spawn points serveur sont trop loin du point (0,500) ?');
  }
  let spawnCountPreKill = 0; // pris AVANT le kill (race respawn, cf. §4)
  let target = mobList[0];
  if (target) {
    console.log(`  Cible: ${target.name} lvl ${target.level} hp ${target.hp}/${target.maxHp} à (${target.position.x.toFixed(0)},${target.position.z.toFixed(0)})`);

    // Se téléporter à côté du monstre (move packet)
    socket.emit('move', {
      type: 'move', timestamp: Date.now(),
      data: { position: { x: target.position.x + 2, y: 0, z: target.position.z + 2 }, rotation: 0, isRunning: false },
    });
    await wait(900);

    // 1b. Skill sur cible VIVANTE (MP + dégâts), puis re-cast immédiat (cooldown)
    {
      const skillCode = 'SKILL_CH_SWORD_SMASH_A_01';
      const states0 = (received['player:state'] ?? []).map((st: any) => (st.data ?? st)).length;
      socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: target.id, skillId: skillCode } });
      await wait(800);
      socket.emit('cast_skill', { type: 'cast_skill', timestamp: Date.now(), data: { targetId: target.id, skillId: skillCode } });
      await wait(800);
      check('Skill rejeté en cooldown', (received.skill_rejected ?? []).some((r: any) => (r.data ?? r).reason === 'Cooldown'),
        (received.skill_rejected ?? []).map((r: any) => (r.data ?? r).reason).join(','));
      const states = (received['player:state'] ?? []).map((st: any) => (st.data ?? st));
      const mpList = states.map((st: any) => st.mp);
      check('MP décrémentés par le skill', mpList.some((mp: number, i: number) => i >= 0 && mp < 100),
        'mp: ' + mpList.slice(-4).join('/'));
      void states0;
    }

    // 2. Attaques de base jusqu'à la mort (max 60 coups)
    const xpBefore = (received['player:state'] ?? []).length;
    // Compteur AVANT le kill: le respawn du slot libéré doit survenir dans
    // les ~40 s (respawnTime anneau = 20 s) — le prendre avant évite la race
    // si le respawn arrive plus vite que la lecture post-kill.
    spawnCountPreKill = (received.spawn ?? []).length;
    let killed = false;
    for (let i = 0; i < 60 && !killed; i++) {
      socket.emit('attack', {
        type: 'attack', timestamp: Date.now(), data: { targetId: target.id },
      });
      await wait(500);
      const atk = received.attack ?? [];
      const lastHits = atk.filter((a: any) => (a.data ?? a).targetId === target.id);
      if (lastHits.length > 0 && i === 0) {
        const d = (lastHits[0].data ?? lastHits[0]);
        check('Dégâts reçus du serveur', d.damage > 0, `dmg=${d.damage} crit=${d.isCritical}`);
      }
      // mort = despawn OU plus de dégâts possibles
      if ((received.xp_gain ?? []).length > 0) { killed = true; await wait(600); }
    }
    check('Monstre tué (XP gagnée)', (received.xp_gain ?? []).length > 0,
      `xp_gain=${(received.xp_gain ?? []).map((x: any) => (x.data ?? x).amount).join(',')}`);
    check('Or/état mis à jour', (() => {
      const states = (received['player:state'] ?? []).map((s: any) => (s.data ?? s));
      return !!states.find((s: any) => s.exp > 0 && s.gold > 10000);
    })(), 'état avec exp>0 et or>10000 reçu après le kill');
  }

  // (skill testé en 1b, avant la mort de la cible)

  // 4. Respawn du mob: le slot libéré par le kill doit se repeupler
  // (respawnTime anneau 20 s — fenêtre 40 s)
  const spawnCountBefore = spawnCountPreKill ?? (received.spawn ?? []).length;
  await wait(40000);
  check('Respawn de monstre', (received.spawn ?? []).length > spawnCountBefore,
    `${spawnCountBefore} → ${(received.spawn ?? []).length}`);

  // 5. Mort du joueur: GM-spawn des Bandits (MOB_CH_BANDIT lv16, agressifs —
  // les mobs tutoriels officiels sont passifs) autour du perso et attendre
  console.log('  Spawn de Bandits agressifs + attente de mort joueur (max 60 s)...');
  socket.emit('chat', {
    type: 'chat', timestamp: Date.now(),
    data: { message: '/spawn MOB_CH_BANDIT 4', channel: 'general' },
  });
  const deathDeadline = Date.now() + 60000;
  let lastReport = 0;
  while (Date.now() < deathDeadline && (received['player:death'] ?? []).length === 0) {
    await wait(2000);
    const states = (received['player:state'] ?? []).map((s: any) => (s.data ?? s));
    const last = states[states.length - 1];
    const banditSpawns = (received.spawn ?? []).filter((sp: any) => /bandit/i.test((sp.data ?? sp).name ?? '')).length;
    if (Date.now() - lastReport > 10000) {
      lastReport = Date.now();
      console.log(`    [diag] states=${states.length} hp=${last ? last.hp + '/' + last.maxHp : '?'} banditsSpawnes=${banditSpawns} updates=${(received.update ?? []).length}`);
    }
    if (last && last.hp < last.maxHp * 0.5) {
      console.log(`    HP joueur: ${last.hp}/${last.maxHp} (aggro actif)`);
    }
  }
  const playerDied = (received['player:death'] ?? []).length > 0;
  check('Joueur tué par les monstres (IA offensive)', playerDied);
  if (playerDied) {
    const d = (received['player:death'][0].data ?? received['player:death'][0]);
    console.log(`    tué par: ${d.killerName}`);
    socket.emit('player:respawn', { mode: 'town' });
    await wait(1500);
    check('Résurrection en ville', (received['player:respawned'] ?? []).length > 0);
  }

  console.log(failures === 0 ? '\nTOUS LES TESTS PASSENT' : `\n${failures} ÉCHEC(S)`);
  socket.disconnect();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('ERREUR TEST:', e.message);
  process.exit(1);
});
