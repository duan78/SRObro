/**
 * Version des assets (anti-cache).
 *
 * Les GLB/textures sont RE-PATCHÉS par des scripts pendant le développement
 * (skins, pose neutre...). Même avec Cache-Control: no-cache côté Vite, les
 * entrées DÉJÀ stockées par le navigateur (cache heuristique d'avant l'en-tête)
 * peuvent resservir des versions périmées — symptôme: personnage figé bras en
 * l'air avec d'anciens fichiers (bug oct. 2026). Les scripts de patch écrivent
 * /assets/version.txt; on l'append en query string à chaque URL d'asset: un
 * fichier re-patché change d'URL → rechargement garanti.
 */
let stamp = '0';
let initialized = false;

export const AssetVersion = {
  /** Charge le stamp une seule fois (avant tout chargement d'asset). */
  async init(): Promise<void> {
    if (initialized) return;
    initialized = true;
    try {
      const res = await fetch('/assets/version.txt', { cache: 'no-cache' });
      if (res.ok) {
        stamp = (await res.text()).trim() || '0';
      }
    } catch {
      // hors-ligne / fichier absent: stamp neutre
    }
  },

  /** Ajoute ?v=<stamp> si l'URL est un asset local sans query. */
  withVersion(url: string): string {
    if (!url.startsWith('/assets/') || url.includes('?')) return url;
    return `${url}?v=${stamp}`;
  },

  get value(): string {
    return stamp;
  },
};
