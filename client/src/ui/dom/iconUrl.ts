/**
 * SRObro - Icônes officielles (V4 §C)
 *
 * Les données officielles référencent les icônes DDJ du client
 * (`skill\china\sword_smash_a.ddj`, `item\etc\cure_all_01.ddj`).
 * Elles sont extraites en PNG sous /assets/icons/<chemin>.png.
 * 4 icônes de skills EU (« base » passives) n'existent pas même dans le
 * client officiel → repli sur l'icône par défaut officielle.
 */

export const DEFAULT_ICON = '/assets/icons/icon_default.png';

/** Chemin DDJ officiel → URL PNG servi par Vite (null si absent). */
export function iconUrl(iconPath?: string | null): string | null {
  if (!iconPath) return null;
  const rel = String(iconPath).replace(/\\/g, '/').replace(/\.ddj$/i, '');
  if (!/^[\w\-/.]+$/.test(rel)) return null;
  return `/assets/icons/${rel}.png`;
}

/** URL sûre pour un <img>: repli automatique sur l'icône par défaut. */
export function iconImgSrc(iconPath?: string | null): string {
  return iconUrl(iconPath) ?? DEFAULT_ICON;
}
