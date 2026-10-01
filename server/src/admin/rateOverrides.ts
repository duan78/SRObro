// ============================================
// SRObro - Taux live (phase 6)
// Les taux sont un singleton muté EN COURS D'EXÉCUTION (aucun reboot) et
// persistés dans Redis (clé srobro:rates) pour survivre aux redémarrages.
// ============================================

import type Redis from 'ioredis';
import { rates, type RateConfig } from '../config/rates';
import { createLogger } from '../core/Logger';

const logger = createLogger('Rates');
const REDIS_KEY = 'srobro:rates';

/** Applique une édition live: mutation immédiate + persistance Redis. */
export async function applyRateOverrides(redis: Redis, partial: Partial<RateConfig>): Promise<RateConfig> {
  Object.assign(rates, partial);
  try {
    await redis.set(REDIS_KEY, JSON.stringify(rates));
  } catch (e) {
    logger.warn('Persistance Redis des taux impossible (taux live actifs):', e);
  }
  logger.info(`Taux mis à jour: ${JSON.stringify(partial)}`);
  return { ...rates };
}

/** Au boot: recharge les overrides persistés (silencieux si absents). */
export async function loadRateOverrides(redis: Redis): Promise<void> {
  try {
    const raw = await redis.get(REDIS_KEY);
    if (raw) {
      Object.assign(rates, JSON.parse(raw));
      logger.info(`Taux chargés depuis Redis: exp=${rates.exp} sp=${rates.sp} gold=${rates.gold} drop=${rates.drop}`);
    }
  } catch (e) {
    logger.warn('Lecture Redis des taux impossible, valeurs par défaut:', e);
  }
}
