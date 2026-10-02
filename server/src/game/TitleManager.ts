// ============================================
// SRObro - TitleManager (phase C V3: titres «Blue Zerk»)
// Chaîne officielle lv95 adaptée: le titre se gagne par KILLS EN ÉTAT DE
// ZERK (mécanique officielle de «Piece of Spirit») — paliers [APPROX]
// documentés (la chaîne complète 8 quêtes à arènes/pièges est hors moteur).
// Energy of Life (KB 16 §titres): remplit la jauge zerk, 1×/20 min, dès
// le titre Knight.
// ============================================
import { createLogger } from '../core/Logger';
import { prisma } from '../database/prisma';

const logger = createLogger('TitleManager');

/** Paliers officiels de la chaîne de titres (Knight→Count). */
export const TITLE_TIERS: Array<{ kills: number; title: string }> = [
  { kills: 500, title: 'Knight' },
  { kills: 2000, title: 'Baronet' },
  { kills: 5000, title: 'Baron' },
  { kills: 10000, title: 'Count' },
];

export const ENERGY_OF_LIFE_COOLDOWN_MS = 20 * 60 * 1000;

export interface ZerkKillInfo {
  characterId: string;
  playerName: string;
  /** Le joueur était-il en zerk ACTIF au moment du kill ? */
  wasZerk: boolean;
}

export class TitleManager {
  private static instance: TitleManager | null = null;
  /** Cache characterId → {zerkKills, title} (flush périodique). */
  private cache = new Map<string, { zerkKills: number; title: string | null }>();
  private dirty = new Set<string>();

  static getInstance(): TitleManager {
    if (!TitleManager.instance) TitleManager.instance = new TitleManager();
    return TitleManager.instance;
  }

  private tierFor(kills: number): string | null {
    let t: string | null = null;
    for (const tier of TITLE_TIERS) if (kills >= tier.kills) t = tier.title;
    return t;
  }

  /** Lecture synchrone du cache (pour player:state sans await). */
  snapshot(characterId: string): { zerkKills: number; title: string | null } | undefined {
    return this.cache.get(characterId);
  }

  async load(characterId: string): Promise<{ zerkKills: number; title: string | null }> {
    // Toujours relire la base (appelé au join + par onMonsterKilled): le
    // cache ne fait qu'éviter l'aller-retour pendant les rafales de kills —
    // mais un court-circuit cacherait une mise à jour externe (tests, admin).
    const row = await prisma.character.findUnique({
      where: { id: characterId },
      select: { zerkKills: true, title: true },
    });
    const cached = this.cache.get(characterId);
    const zerkKills = Math.max(row?.zerkKills ?? 0, cached?.zerkKills ?? 0);
    // Dériver le titre des kills si la ligne ne l'a pas encore (paliers
    // officiels Knight→Count).
    const v = {
      zerkKills,
      title: row?.title ?? this.tierFor(zerkKills) ?? cached?.title ?? null,
    };
    this.cache.set(characterId, v);
    return v;
  }

  /** Kill comptabilisé (appelé par CombatBridge à chaque mort de monstre). */
  async onMonsterKilled(info: ZerkKillInfo): Promise<{ newTitle: string | null } | null> {
    if (!info.wasZerk) return null;
    const v = await this.load(info.characterId);
    v.zerkKills += 1;
    const tier = this.tierFor(v.zerkKills);
    let newTitle: string | null = null;
    if (tier && tier !== v.title) {
      v.title = tier;
      newTitle = tier;
      logger.info(`${info.playerName} obtient le titre ${tier} (${v.zerkKills} kills en zerk)`);
    }
    this.cache.set(info.characterId, v);
    this.dirty.add(info.characterId);
    if (this.dirty.size >= 10) void this.flush();
    return newTitle ? { newTitle } : null;
  }

  /** Energy of Life: 1×/20 min, dès Knight. Retourne le cooldown restant. */
  async useEnergyOfLife(characterId: string): Promise<{ ok: boolean; remainingMs?: number; orbs: number }> {
    const v = await this.load(characterId);
    if (!v.title) return { ok: false, orbs: 0 };
    const row = await prisma.character.findUnique({
      where: { id: characterId },
      select: { energyOfLifeAt: true },
    });
    const last = row?.energyOfLifeAt ? Number(row.energyOfLifeAt) : 0;
    const now = Date.now();
    const remaining = last + ENERGY_OF_LIFE_COOLDOWN_MS - now;
    if (remaining > 0) return { ok: false, remainingMs: remaining, orbs: 0 };
    await prisma.character.update({
      where: { id: characterId },
      data: { energyOfLifeAt: BigInt(now) },
    });
    return { ok: true, orbs: 5 };
  }

  async flush(): Promise<void> {
    const ids = [...this.dirty];
    this.dirty.clear();
    for (const id of ids) {
      const v = this.cache.get(id);
      if (!v) continue;
      try {
        await prisma.character.update({
          where: { id },
          data: { zerkKills: v.zerkKills, title: v.title },
        });
      } catch { /* retiré entre-temps */ }
    }
  }
}

export const globalTitleManager = TitleManager.getInstance();
