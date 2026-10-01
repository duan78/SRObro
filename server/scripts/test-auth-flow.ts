/**
 * Test de bout en bout du flux d'authentification (PHASE 1).
 * Usage: npx tsx scripts/test-auth-flow.ts
 */
import { io } from 'socket.io-client';

const URL = 'http://127.0.0.1:3001';
const socket = io(URL, { transports: ['websocket'] });

const req = <T = any>(event: string, data: any = {}, timeout = 10000): Promise<T> =>
  new Promise((resolve, reject) => {
    const t = setTimeout(() => reject(new Error(`timeout ${event}`)), timeout);
    socket.emit(event, data, (res: T) => {
      clearTimeout(t);
      resolve(res);
    });
  });

let failures = 0;
const check = (label: string, ok: boolean, detail = ''): void => {
  console.log(`${ok ? '✓' : '✗'} ${label}${detail ? ' — ' + detail : ''}`);
  if (!ok) failures++;
};

async function main(): Promise<void> {
  await new Promise<void>((resolve) => socket.on('connect', resolve));
  console.log('Connecté au serveur');

  const suffix = Date.now().toString(36);
  const username = 'testbot_' + suffix;
  const charName = 'Bot' + suffix.slice(-6);

  // 1. Register
  const reg = await req<{ success: boolean; error?: string }>('auth:register', { username, password: 'test1234' });
  check('Inscription compte', reg.success, reg.error ?? username);

  // 1b. Register doublon → erreur propre
  const reg2 = await req<{ success: boolean; error?: string }>('auth:register', { username, password: 'test1234' });
  check('Inscription doublon refusée', !reg2.success && !!reg2.error);

  // 2. Mauvais mot de passe
  const bad = await req<{ success: boolean; error?: string }>('auth:login', { username, password: 'WRONG' });
  check('Mauvais mot de passe refusé', !bad.success && !!bad.error);

  // 3. Login OK
  const login = await req<{ success: boolean; token?: string; account?: { username: string; role: string } }>('auth:login', { username, password: 'test1234' });
  check('Login', login.success && login.account?.username === username, login.account?.role ?? '');
  const token = login.token!;

  // 4. character:list (vide)
  const list0 = await req<{ success: boolean; characters?: any[] }>('character:list');
  check('Liste vide au départ', list0.success && list0.characters?.length === 0);

  // 5. character:create — nom invalide
  const badName = await req<{ success: boolean; error?: string }>('character:create', { name: 'x', race: 'chinese', gender: 'male' });
  check('Nom invalide refusé', !badName.success && !!badName.error);

  // 6. character:create — OK
  const create = await req<{ success: boolean; character?: { id: string; name: string } }>('character:create', { name: charName, race: 'chinese', gender: 'female' });
  check('Création personnage', create.success && create.character?.name === charName);
  const charId = create.character!.id;

  // 7. character:select
  const sel = await req<{ success: boolean; character?: any }>('character:select', { characterId: charId });
  check('Sélection personnage', sel.success && sel.character?.name === charName,
    `pos=(${sel.character?.position?.x},${sel.character?.position?.z}) hp=${sel.character?.hp}/${sel.character?.maxHp}`);

  // 8. move → serveur doit accepter (client authentifié)
  socket.emit('move', {
    type: 'move', timestamp: Date.now(),
    data: { position: { x: 42.5, y: 0, z: 512.25 }, rotation: 1.2, isRunning: true },
  });
  await new Promise((r) => setTimeout(r, 800));

  // 9. logout → sauvegarde
  const lo = await req<{ success: boolean }>('auth:logout');
  check('Logout', lo.success);
  await new Promise((r) => setTimeout(r, 1500)); // laisse la sauvegarde s'exécuter

  // 10. re-login avec token (resume)
  const resume = await req<{ success: boolean; account?: { username: string } }>('auth:resume', { token });
  check('Reprise de session (token)', resume.success && resume.account?.username === username);

  // 11. re-select → position persistée ?
  const sel2 = await req<{ success: boolean; character?: any }>('character:select', { characterId: charId });
  const p = sel2.character?.position;
  check('Position persistée après re-login', sel2.success && p && Math.abs(p.x - 42.5) < 1 && Math.abs(p.z - 512.25) < 1,
    `pos=(${p?.x?.toFixed(1)},${p?.z?.toFixed(1)})`);

  // 12. Sécurité: sélection d'un perso d'un autre compte (id bidon)
  const wrong = await req<{ success: boolean; error?: string }>('character:select', { characterId: '00000000-0000-0000-0000-000000000000' });
  check('Perso inconnu refusé', !wrong.success);

  console.log(failures === 0 ? '\nTOUS LES TESTS PASSENT' : `\n${failures} ÉCHEC(S)`);
  socket.disconnect();
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => {
  console.error('ERREUR TEST:', e.message);
  process.exit(1);
});
