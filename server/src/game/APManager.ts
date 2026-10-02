// ============================================
// SRObro - APManager (phase F V3)
// AP (Activity Points) officiels du Job Temple (KB 15:458-462): gagnés par
// les ACTIVITÉS de métier (quêtes job répétables / ventes / vols), portés
// par l'UNION. Gating officiel: «l'union avec le plus d'AP entre chez
// Anubis/Haroeris/Seth; si aucun des deux camps n'a d'AP → les deux entrent».
// ============================================
import { createLogger } from '../core/Logger';
import { prisma } from '../database/prisma';

const logger = createLogger('AP');

export class APManager {
  private static instance: APManager | null = null;
  private cache = new Map<string, number>(); // unionId → AP
  private dirty = new Set<string>();

  static getInstance(): APManager {
    if (!APManager.instance) APManager.instance = new APManager();
    return APManager.instance;
  }

  /** Union du personnage (via sa guilde), null si sans union. */
  async unionOf(characterId: string): Promise<{ unionId: string; camp: 'trader_hunter' | 'thief' } | null> {
    const gm = await prisma.guildMember.findUnique({ where: { characterId }, include: { guild: true } });
    if (!gm?.guild) return null;
    const um = await prisma.unionMember.findUnique({ where: { guildId: gm.guild.id } });
    if (!um) return null;
    // Camp officiel: thieves d'un côté, traders/hunters de l'autre
    const job = await prisma.jobState.findUnique({ where: { characterId } });
    const camp = job?.jobType === 'thief' ? 'thief' : 'trader_hunter';
    return { unionId: um.unionId, camp };
  }

  /** AP actuels d'une union (0 si inconnue) — cache d'abord, sinon SQL brut
   *  (la colonne ap est ajoutée dynamiquement, hors schéma Prisma). */
  async ap(unionId: string): Promise<number> {
    if (this.cache.has(unionId)) return this.cache.get(unionId)!;
    let v = 0;
    try {
      const rows: unknown = await prisma.$queryRawUnsafe(
        `SELECT ap FROM "Union" WHERE id = $1`, unionId);
      const r = Array.isArray(rows) ? (rows[0] as { ap?: number } | undefined) : undefined;
      v = Number(r?.ap ?? 0);
    } catch { /* colonne absente → 0 */ }
    this.cache.set(unionId, v);
    return v;
  }

  /** Créditer des AP à l'union du personnage (activités de métier). */
  async grant(characterId: string, amount: number, reason: string): Promise<number | null> {
    const u = await this.unionOf(characterId);
    if (!u) return null;
    const cur = await this.ap(u.unionId);
    const next = cur + Math.max(1, Math.round(amount));
    this.cache.set(u.unionId, next);
    this.dirty.add(u.unionId);
    logger.info(`+${amount} AP à l'union ${u.unionId} (${reason}) → ${next}`);
    if (this.dirty.size >= 5) void this.flush();
    return next;
  }

  /**
   * Gating officiel d'entrée du Job Temple (KB 15): renvoie le camp
   * autorisé chez Anubis/Haroeris/Seth — l'union au PLUS HAUT AP entre;
   * 'both' si aucun des deux camps n'a d'AP (aucune restriction).
   */
  async gateFor(characterId: string): Promise<'both' | 'trader_hunter' | 'thief' | 'none'> {
    const mine = await this.unionOf(characterId);
    if (!mine) return 'both'; // sans union: règle du «aucun AP» — les deux entrent
    // AP des unions ADVERSES (via le camp du premier membre de chaque guilde)
    const myAp = await this.ap(mine.unionId);
    const allMembers = await prisma.unionMember.findMany().catch(() => []);
    const unionIds = [...new Set(allMembers.map((m) => m.unionId).filter((id) => id !== mine.unionId))];
    let opposingAp = 0;
    for (const uid of unionIds) {
      // camp de l'union: via le premier membre trouvé
      const members = allMembers.filter((m) => m.unionId === uid);
      for (const m of members) {
        const gm = await prisma.guildMember.findFirst({ where: { guildId: m.guildId } }).catch(() => null);
        if (!gm) continue;
        const job = await prisma.jobState.findUnique({ where: { characterId: gm.characterId } }).catch(() => null);
        const theirCamp = job?.jobType === 'thief' ? 'thief' : 'trader_hunter';
        if (theirCamp !== mine.camp) {
          opposingAp = Math.max(opposingAp, await this.ap(uid));
          break;
        }
      }
    }
    if (myAp === 0 && opposingAp === 0) return 'both'; // règle officielle
    if (myAp >= opposingAp) return mine.camp;
    return 'none'; // le camp adverse a plus d'AP: entrée refusée
  }

  async flush(): Promise<void> {
    const ids = [...this.dirty];
    this.dirty.clear();
    for (const id of ids) {
      const v = this.cache.get(id);
      if (v === undefined) continue;
      try {
        await prisma.$executeRawUnsafe(
          `UPDATE "Union" SET ap = $1 WHERE id = $2`, v, id,
        );
      } catch {
        // colonne absente (première exécution): l'ajouter
        try {
          await prisma.$executeRawUnsafe(`ALTER TABLE "Union" ADD COLUMN IF NOT EXISTS ap INTEGER NOT NULL DEFAULT 0`);
          await prisma.$executeRawUnsafe(`UPDATE "Union" SET ap = $1 WHERE id = $2`, v, id);
        } catch { /* silencieux */ }
      }
    }
  }
}

export const globalAPManager = APManager.getInstance();
