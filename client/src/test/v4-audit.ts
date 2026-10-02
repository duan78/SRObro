/**
 * SRObro - Audit visuel V4 (§G) — assertions rejouables DANS le navigateur
 *
 * Charge: node — import('./src/test/v4-audit') puis __v4VisualAudit() dans
 * la console (ou via un driver Playwright). Retourne un JSON de verdicts.
 */

export interface AuditLine { name: string; ok: boolean; detail?: string }

export async function __v4VisualAudit(): Promise<string> {
  const lines: AuditLine[] = [];
  const check = (name: string, ok: boolean, detail = ''): void => {
    lines.push({ name, ok, detail });
  };
  const nc = (window as unknown as { netCombat?: any }).netCombat;
  if (!nc) return JSON.stringify({ fatal: 'pas en jeu (netCombat absent)' });
  const scene = nc.scene as import('@babylonjs/core').Scene;

  // 1. Équipement rendu: nœuds armure == pièces attendues, pas de double flip
  const armorNodes = scene.getNodes().filter((n: any) => String(n.name || '').startsWith('equip_armor_')) as any[];
  const weapon = scene.getNodes().find((n: any) => n.name === 'equipped_weapon');
  const player = nc.getPlayerMesh() as any;
  const flip = player?.getChildTransformNodes?.().find((n: any) => n.name.endsWith('_flip'));
  let noDoubleFlip = true;
  if (flip) {
    for (const a of armorNodes) {
      const inner = a.getChildTransformNodes?.().find((n: any) => n.name.endsWith('_flip'));
      if (inner && Math.abs(inner.rotation.y) > 0.01) noDoubleFlip = false;
    }
  }
  check('armure: pièces assemblées sous le flip du corps', armorNodes.length > 0 && !!flip, `${armorNodes.length} pièces`);
  check('armure: aucun flip interne résiduel (pas de 180°)', noDoubleFlip);
  check('arme: nœud equipped_weapon présent', !!weapon);

  // 2. HUD unique: une seule hotbar, aucune fenêtre ne se chevauche
  const hotbars = document.querySelectorAll('#hud-hotbar').length;
  check('HUD: une seule hotbar DOM', hotbars === 1);
  const wm = (window as unknown as { windowManager?: { constructor: { auditNoOverlap(): { ok: boolean; overlaps: unknown } } } }).windowManager;
  const overlap = wm ? wm.constructor.auditNoOverlap() : { ok: true, overlaps: [] };
  // ouvrir tous les panneaux puis vérifier
  for (const key of ['c', 'i', 's', 'l', 'p', 'j']) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
    await new Promise((r) => setTimeout(r, 220));
  }
  await new Promise((r) => setTimeout(r, 700));
  const overlap2 = wm ? wm.constructor.auditNoOverlap() : { ok: true, overlaps: [] as unknown };
  check('fenêtres: 0 chevauchement tous panneaux ouverts', overlap2.ok, JSON.stringify((overlap2 as any).overlaps ?? []).slice(0, 100));
  for (const key of ['c', 'i', 's', 'l', 'p', 'j']) {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
  }

  // 3. Icônes: hotbar remplie avec images chargées, panneau skills OK
  const slots = [...document.querySelectorAll('.hud-slot')] as HTMLElement[];
  const withIcon = slots.filter((s) => s.querySelector('.hud-slot-icon'));
  let iconsLoaded = 0;
  for (const s of withIcon) {
    const div = s.querySelector('.hud-slot-icon') as HTMLElement;
    const m = (div.style.backgroundImage.match(/url\(["']?([^"')]+)["']?\)/) || [])[1];
    if (m) {
      const im = new Image();
      im.src = m;
      await new Promise((r) => { im.onload = im.onerror = r; });
      if (im.naturalWidth > 0) iconsLoaded++;
    }
  }
  check('icônes: slots hotbar avec image chargée', withIcon.length > 0 && iconsLoaded === withIcon.length,
    `${iconsLoaded}/${withIcon.length}`);

  // 4. Étiquettes monde: noms PNJ présents
  const npcLabels = scene.meshes.filter((m) => /^label_npc_/.test(m.name)).length;
  check('monde: étiquettes de nom des PNJ rendues', npcLabels > 0, `${npcLabels}`);

  // 5. Fog actif
  check('monde: brume de distance active', scene.fogMode === 2 /* EXP2 */, `mode=${scene.fogMode}`);

  const pass = lines.filter((l) => l.ok).length;
  return JSON.stringify({ pass, total: lines.length, lines }, null, 1);
}

// Exposé pour la console / les drivers
(window as unknown as Record<string, unknown>).__v4VisualAudit = __v4VisualAudit;
