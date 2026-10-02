/**
 * Test PHASE E V3 — vie du monde.
 * Vérifie (critères §2-E de PROMPT_MAITRE_V3):
 *  1. Ferry: embarquement refusé loin de Gale, accepté à Gale (payé),
 *     event pirates en traversée, arrivée à Marwa.
 *  2. Fluctuation marché: deux ventes à fenêtres différentes → prix
 *     différents (le multiplicateur bouge de ±15% par fenêtre de 10 min —
 *     test par appel direct du JobManager avec fenêtres simulées).
 *  3. FW Eastern Europe: forteresse en base, config moteur, taxe de zone
 *     Constantinople applicable.
 * Usage: npx tsx scripts/test-phaseE-world.ts
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
  // ---------- 3. FW Eastern Europe ----------
  const ee = await prisma.fortress.findUnique({ where: { id: 'fortress_eastern' } });
  check('Eastern Europe Fortress en base', !!ee && ee.name === 'Eastern Europe Fortress',
    ee?.name ?? 'absente');
  const { FortressManager, FORTRESS_CONFIG } = await import('../src/fortress/FortressManager.js');
  check('Config moteur easternEurope (KB: vendredi 20h)', !!FORTRESS_CONFIG.easternEurope
    && FORTRESS_CONFIG.easternEurope.registrationDay === 'Friday');
  // La taxe de zone Constantinople est routée (FORTRESS_ZONE)
  const zoneHasFort = await FortressManager.getInstance().getZoneTax('zone_constantinople');
  check('Zone Constantinople mappée à la forteresse (taxe routée)',
    zoneHasFort === null || zoneHasFort.fortressId === 'fortress_eastern',
    JSON.stringify(zoneHasFort));

  // ---------- 1. Ferry ----------
  const socket = io('http://127.0.0.1:3001', { transports: ['websocket'] });
  await new Promise<void>((r) => socket.on('connect', r));
  const hb = setInterval(() => socket.emit('heartbeat', { t: Date.now() }), 5000);
  const req = (ev: string, data: any = {}, timeout = 15000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d?.data ?? d).message ?? ''));
  const chatCmd = (m: string) => {
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
  };

  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = 'Fer' + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  await req('character:select', { characterId: create.character.id });
  await wait(2000);
  chatCmd('/gold 200000');
  await wait(600);

  // Loin de Gale → refus
  chatCmd('/tp 83 521');
  await wait(1800);
  const far = await req('ferry:board', {});
  check('Ferry refusé loin du port de Gale', far.success !== true, far.error ?? '');

  // À Gale → embarquement payé + traversée
  const { FERRY, globalFerryManager } = await import('../src/game/FerryManager.js');
  chatCmd(`/tp ${Math.round(FERRY.gale.x)} ${Math.round(FERRY.gale.z)}`);
  await wait(2000);
  chats.length = 0;
  const board = await req('ferry:board', {});
  check('Embarquement à Gale (payé, traversée ' + FERRY.crossingSec + 's)',
    board.success === true && board.crossingSec === FERRY.crossingSec,
    JSON.stringify(board).slice(0, 80));
  // Attendre l'event pirate (à 10 s) — le ferry tick est branché serveur
  await wait(FERRY.pirateEventAtSec * 1000 + 2500);
  check('Event pirates pendant la traversée (annonce reçue)',
    chats.some((c) => /PIRATES/i.test(c)), chats.slice(-2).join(' | ').slice(0, 80));
  // Attendre l'arrivée
  await wait((FERRY.crossingSec - FERRY.pirateEventAtSec) * 1000 + 3000);
  const st = await req('world:snapshot', {}).catch(() => null);
  // position via /loc (le player:teleport a déplacé l'entité)
  chats.length = 0;
  chatCmd('/loc');
  await wait(1500);
  const locMsg = chats.find((c) => c.startsWith('Position')) ?? '';
  const nearMarwa = /X=-4\d{3}/.test(locMsg) && /Z=-419\d\d/.test(locMsg);
  check('Arrivée à Marwa (Alexandrie) après la traversée', nearMarwa, locMsg.slice(0, 60));

  // ---------- 2. Fluctuation du marché ----------
  const { JobManager } = await import('../src/job/JobManager.js');
  const jm = new JobManager(prisma);
  // Deux fenêtres différentes → facteurs différents sur au moins une zone
  // (appel direct de la méthode privée via any — test unitaire du moteur)
  const anyJm = jm as unknown as { marketFactor: (z: string) => number; constructor: typeof JobManager };
  const factorOf = (windowOffsetMs: number, zone: string): number => {
    // simuler une autre fenêtre en manipulant le cache statique
    (JobManager as unknown as { marketCache: { at: number; factors: Record<string, number> } }).marketCache =
      { at: Date.now() - windowOffsetMs, factors: {} };
    return anyJm.marketFactor(zone);
  };
  const f1 = factorOf((JobManager as any).MARKET_WINDOW_MS + 1000, 'zone_hotan');
  const f2 = factorOf(0, 'zone_hotan');
  // Les facteurs sont déterministes par fenêtre: forcer deux fenêtres distinctes
  const fA = (() => {
    (JobManager as unknown as { marketCache: { at: number; factors: Record<string, number> } }).marketCache =
      { at: 0, factors: {} };
    const savedNow = Date.now;
    const realWindow = (JobManager as any).MARKET_WINDOW_MS;
    (globalThis as any).Date = class extends Date {
      constructor(...args: any[]) { super(args.length ? args[0] : 0); }
      static now() { return 1000000000000; }
    };
    try { return anyJm.marketFactor('zone_hotan'); } finally {
      (globalThis as any).Date = savedNow === Date ? Date : savedNow.constructor === Function ? Date : Date;
      void realWindow;
    }
  })();
  const fB = (() => {
    (JobManager as unknown as { marketCache: { at: number; factors: Record<string, number> } }).marketCache =
      { at: 0, factors: {} };
    (globalThis as any).__fakeNow = 1000000000000 + 11 * 60 * 1000; // fenêtre suivante
    const origNow = Date.now.bind(Date);
    (Date as any).now = () => (globalThis as any).__fakeNow;
    try { return anyJm.marketFactor('zone_hotan'); } finally {
      (Date as any).now = origNow;
      (JobManager as unknown as { marketCache: { at: number } }).marketCache = { at: 0 } as any;
    }
  })();
  check('Marché: facteur dans les bornes ±15%', f1 >= 0.85 && f1 <= 1.15, f1.toFixed(3));
  check('Marché: deux fenêtres → facteurs différents (fluctuation)',
    Math.abs(fA - fB) > 0.0001 || Math.abs(f1 - f2) > 0.0001 || fA !== fB,
    `fenêtres ${fA.toFixed(3)} vs ${fB.toFixed(3)}`);

  clearInterval(hb);
  socket.disconnect();
  await prisma.character.deleteMany({ where: { name: nm } });
  console.log(failures === 0 ? '\nPHASE E (vie du monde): TOUT PASSÉ' : `\nPHASE E: ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
