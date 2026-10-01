// ============================================
// SRObro - Taux de jeu serveur
// Multiplicateurs appliqués aux récompenses et comportements mondiaux.
// Overridables à chaud via Redis (console /admin, phase 6) — sans reboot.
// ============================================

export interface RateConfig {
  exp: number;
  sp: number;
  gold: number;
  drop: number;
  aggroEnabled: boolean;
  respawnMultiplier: number;
  maintenanceMode: boolean;
  motd: string;
}

export const rates: RateConfig = {
  exp: 1,
  sp: 1,
  gold: 1,
  drop: 1,
  aggroEnabled: true,
  respawnMultiplier: 1,
  maintenanceMode: false,
  motd: 'Bienvenue sur SRObro !',
};
