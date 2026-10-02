/**
 * Test PHASE A V3 — équipement visuel (armures par pièce + arme).
 * Vérifie (critères §2 phase A de PROMPT_MAITRE_V3):
 *  1. /item set heavy_02 complet → chaque pièce équipe son SLOT officiel
 *     (helmet/chest/shoulder/legs/hands/boots déduits du suffixe BSR).
 *  2. equipment:full renvoyé à chaque équipement (slots + chemins BSR).
 *  3. equipment:request → renvoie l'apparence complète (login/re-ask).
 *  4. Déséquipement → slot null dans equipment:full.
 *  5. Persistance: re-sélection du perso → equipment:request → set intact.
 *  6. Femme: pièce femme (heavy_02.ba woman_item) → slot chest (prefix client).
 * Usage: npx tsx scripts/test-phaseA-equip.ts
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
  const hb = setInterval(() => socket.emit('heartbeat', { t: Date.now() }), 5000);
  const req = (ev: string, data: any = {}, timeout = 15000): Promise<any> =>
    new Promise((resolve, reject) => {
      const t = setTimeout(() => reject(new Error(`timeout ${ev}`)), timeout);
      socket.emit(ev, data, (res: any) => { clearTimeout(t); resolve(res); });
    });
  const eqPackets: Array<Record<string, any>> = [];
  socket.on('equipment:full', (d: any) => eqPackets.push(d?.data ?? d));
  const chats: string[] = [];
  socket.on('chat', (d: any) => chats.push((d.data ?? d).message ?? ''));
  const chat = async (m: string): Promise<string> => {
    chats.length = 0;
    socket.emit('chat', { type: 'chat', timestamp: Date.now(), data: { message: m, channel: 'general' } });
    for (let i = 0; i < 40; i++) { await wait(250); const r = chats.find((c) => !c.startsWith('/')); if (r) return r; }
    throw new Error('timeout chat ' + m);
  };

  await req('auth:login', { username: 'arnaud', password: 'hunter2' });
  const nm = 'EqA' + Date.now().toString(36).slice(-5);
  const create = await req('character:create', { name: nm, race: 'chinese', gender: 'male' });
  await req('character:select', { characterId: create.character.id });
  await wait(2000);
  await chat('/level 20');

  // ---------- 1-2. Équipement du set complet, slot par slot ----------
  const SET: Array<{ code: string; slot: string; piece: string }> = [
    { code: 'ITEM_CH_M_HEAVY_02_HA_A', slot: 'helmet', piece: 'heavy_02_ha' },
    { code: 'ITEM_CH_M_HEAVY_02_BA_A', slot: 'chest', piece: 'heavy_02_ba' },
    { code: 'ITEM_CH_M_HEAVY_02_SA_A', slot: 'shoulder', piece: 'heavy_02_sa' },
    { code: 'ITEM_CH_M_HEAVY_02_LA_A', slot: 'legs', piece: 'heavy_02_la' },
    { code: 'ITEM_CH_M_HEAVY_02_AA_A', slot: 'hands', piece: 'heavy_02_aa' },
    { code: 'ITEM_CH_M_HEAVY_02_FA_A', slot: 'boots', piece: 'heavy_02_fa' },
  ];
  const slotsByCode = new Map<string, number>();
  for (const s of SET) {
    const reply = await chat(`/item ${s.code} 1`);
    const m = reply.match(/slot (\d+)/);
    if (!m) { check(`item ${s.code} donné`, false, reply); continue; }
    slotsByCode.set(s.code, Number(m[1]));
  }
  check('Set complet donné (6 pièces)', slotsByCode.size === 6, `${slotsByCode.size}/6`);

  const eqP0 = eqPackets.length;
  for (const s of SET) {
    const slot = slotsByCode.get(s.code);
    if (slot === undefined) continue;
    const e = await req('inventory:equip', { slot });
    check(`${s.piece} → slot ${s.slot}`, e.success === true && e.slot === s.slot,
      e.success ? e.slot : (e.error ?? '').slice(0, 40));
  }
  // Arme
  const wReply = await chat('/item ITEM_CH_BLADE_02_A 1');
  const wSlot = Number((wReply.match(/slot (\d+)/) || [])[1] ?? -1);
  const wEq = await req('inventory:equip', { slot: wSlot });
  check('Arme → slot weapon', wEq.success === true && wEq.slot === 'weapon',
    wEq.success ? wEq.slot : (wEq.error ?? '').slice(0, 40));

  // equipment:full pendant les équipements
  await wait(1500);
  const last = eqPackets[eqPackets.length - 1] ?? {};
  const suffix = (v: any) => String(v?.itemCode ?? '').replace(/\\/g, '/').split('/').pop();
  for (const s of SET) {
    check(`equipment:full ${s.slot} = ${s.piece}.bsr`, suffix(last[s.slot]) === `${s.piece}.bsr`,
      suffix(last[s.slot]));
  }
  check('equipment:full weapon = blade_02.bsr', suffix(last.weapon) === 'blade_02.bsr', suffix(last.weapon));
  check('equipment:full émis à chaque équipement', eqPackets.length - eqP0 >= 7, `${eqPackets.length - eqP0} packets`);

  // ---------- 3. equipment:request ----------
  eqPackets.length = 0;
  const ask = await req('equipment:request', {});
  await wait(1200);
  check('equipment:request → equipment:full renvoyé', ask.success === true && eqPackets.length === 1,
    `ask=${ask.success} packets=${eqPackets.length}`);

  // ---------- 4. Déséquipement ----------
  const un = await req('inventory:unequip', { slot: 'helmet' });
  await wait(1200);
  const afterUn = eqPackets[eqPackets.length - 1] ?? {};
  check('Déséquipement helmet → null dans equipment:full', un.success === true && afterUn.helmet === null,
    JSON.stringify(afterUn.helmet));

  // ---------- 5. Persistance (re-sélection) ----------
  await req('character:select', { characterId: create.character.id });
  await wait(1500);
  eqPackets.length = 0;
  await req('equipment:request', {});
  await wait(1200);
  const persisted = eqPackets[eqPackets.length - 1] ?? {};
  const stillOn = ['chest', 'shoulder', 'legs', 'hands', 'boots', 'weapon'].every(
    (s) => suffix(persisted[s]) !== 'undefined',
  );
  check('Persistance: set intact après re-sélection', stillOn,
    ['chest', 'weapon'].map((s) => suffix(persisted[s])).join(', '));

  // ---------- 6. Femme → pièce femme → chest ----------
  const nm2 = 'EqW' + Date.now().toString(36).slice(-5);
  const c2 = await req('character:create', { name: nm2, race: 'chinese', gender: 'female' });
  await req('character:select', { characterId: c2.character.id });
  await wait(1500);
  await chat('/level 20');
  const wReply2 = await chat('/item ITEM_CH_W_HEAVY_02_BA_A 1');
  const wSlot2 = Number((wReply2.match(/slot (\d+)/) || [])[1] ?? -1);
  const wEq2 = await req('inventory:equip', { slot: wSlot2 });
  check('Femme: heavy_02_ba femme → slot chest', wEq2.success === true && wEq2.slot === 'chest',
    wEq2.success ? wEq2.slot : (wEq2.error ?? '').slice(0, 40));

  clearInterval(hb);
  socket.disconnect();
  console.log(failures === 0 ? '\nPHASE A (équipement): TOUT PASSÉ' : `\nPHASE A (équipement): ${failures} ÉCHEC(S)`);
  process.exit(failures === 0 ? 0 : 1);
}

main().catch((e) => { console.error('ERREUR:', e.message); process.exit(1); });
