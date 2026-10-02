// ============================================
// SRObro - FerryManager (phase E V3)
// Voie maritime officielle (KB MAP_COORDINATES §ferries): Gale (Europe)
// → Marwa (Alexandria North), escales-pièges pirates (Morgun, Blackbeard).
// Embarquement payant → traversée (attente) → EVENT PIRATE (2 pirates
// officiels spawnés à bord) → arrivée.
// ============================================
import { createLogger } from '../core/Logger';
import { ensureMonsterInDb } from '../admin/bestiary';
import { globalSpawnManager } from '../ai/SpawnManager';

const logger = createLogger('Ferry');

/** Coordonnées officielles → moteur (Gale relatif Constantinople,
 *  Marwa relatif Alexandria — conversion grille client réelle). */
export const FERRY = {
  gale: { x: -5043, z: -1938 },   // (−11 424, 1 162) relatif Constantinople (69370,15846)
  marwa: { x: -4222, z: -41929 }, // Harbor Manager Marwa ≈ (−16 542, 371) relatif Alexandria (40300,−42300)
  cost: 20000,                    // [APPROX] tarif de traversée maritime
  crossingSec: 20,                // durée compressée de la traversée
  pirateEventAtSec: 10,
  pirateCodes: ['MOB_GOD_GHOST_PIRATE_A1', 'MOB_GOD_GHOST_PIRATE_B1'], // pirates officiels (données vSRO, lv 92/102)
};

interface Crossing {
  characterId: string;
  startedAt: number;
  piratesSpawned: boolean;
}

export class FerryManager {
  private static instance: FerryManager | null = null;
  private crossings = new Map<string, Crossing>();

  static getInstance(): FerryManager {
    if (!FerryManager.instance) FerryManager.instance = new FerryManager();
    return FerryManager.instance;
  }

  /** Le joueur est-il au port de Gale ? */
  atGale(pos: { x: number; z: number }): boolean {
    return Math.hypot(pos.x - FERRY.gale.x, pos.z - FERRY.gale.z) < 120;
  }

  /** Embarquer (appelé par le handler ferry:board — or déjà vérifié). */
  board(characterId: string): { crossingSec: number; cost: number } {
    this.crossings.set(characterId, { characterId, startedAt: Date.now(), piratesSpawned: false });
    logger.info(`Embarquement ${characterId} → traversée ${FERRY.crossingSec}s`);
    return { crossingSec: FERRY.crossingSec, cost: FERRY.cost };
  }

  /** Tick appelé par le serveur (1 Hz): évènements de traversée. */
  tick(notify: (characterId: string, message: string) => void): void {
    const now = Date.now();
    for (const [id, c] of this.crossings) {
      const elapsed = (now - c.startedAt) / 1000;
      if (!c.piratesSpawned && elapsed >= FERRY.pirateEventAtSec) {
        c.piratesSpawned = true;
        notify(id, '🏴‍☠️ PIRATES À BORD ! Repoussez-les pendant la traversée !');
        void (async () => {
          for (const code of FERRY.pirateCodes) {
            const row = await ensureMonsterInDb(code).catch(() => null);
            if (!row) continue;
            await globalSpawnManager.spawnMonsterAt(row.id, {
              x: FERRY.gale.x + (Math.random() - 0.5) * 40,
              y: 0,
              z: FERRY.gale.z + (Math.random() - 0.5) * 40,
            }).catch(() => null);
          }
        })();
      }
      if (elapsed >= FERRY.crossingSec) {
        this.crossings.delete(id);
      }
    }
  }

  /** Arrivée: position de débarquement à Marwa. */
  arrival(): { x: number; z: number } {
    return { x: FERRY.marwa.x, z: FERRY.marwa.z };
  }
}

export const globalFerryManager = FerryManager.getInstance();
