// ============================================
// SRObro - MatchingManager (phase D V3)
// Matching window officielle (KB 18 «Four Square»): recherche de groupe par
// tranche de niveau, auto-invite du chef de groupe qui matche.
// ============================================
import { createLogger } from '../core/Logger';

const logger = createLogger('Matching');

interface Seeker {
  characterId: string;
  name: string;
  level: number;
  mode: 'each_get' | 'auto_share';
  at: number;
}

/** Tolérance de niveau du matching Four Square (±10 niveaux). */
export const MATCH_LEVEL_RANGE = 10;
export const SEEK_EXPIRY_MS = 5 * 60 * 1000;

export class MatchingManager {
  private static instance: MatchingManager | null = null;
  private seekers = new Map<string, Seeker>();

  static getInstance(): MatchingManager {
    if (!MatchingManager.instance) MatchingManager.instance = new MatchingManager();
    return MatchingManager.instance;
  }

  /** S'inscrire dans la file de recherche. */
  seek(characterId: string, name: string, level: number, mode: 'each_get' | 'auto_share' = 'auto_share'): Seeker[] {
    this.purge();
    this.seekers.set(characterId, { characterId, name, level, mode, at: Date.now() });
    logger.info(`${name} (lv${level}) cherche un groupe (${mode})`);
    return this.list(characterId);
  }

  /** Se désinscrire. */
  cancel(characterId: string): void {
    this.seekers.delete(characterId);
  }

  /** Candidats compatibles (±10 niveaux), soi exclu. */
  list(excludeCharacterId?: string): Seeker[] {
    this.purge();
    return [...this.seekers.values()].filter((s) => s.characterId !== excludeCharacterId);
  }

  private purge(): void {
    const now = Date.now();
    for (const [id, s] of this.seekers) {
      if (now - s.at > SEEK_EXPIRY_MS) this.seekers.delete(id);
    }
  }
}

export const globalMatchingManager = MatchingManager.getInstance();
