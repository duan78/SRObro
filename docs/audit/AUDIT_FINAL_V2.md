# AUDIT FINAL V2 — PROMPT_MAITRE_V2 §5

**Date:** 2026-10-02 · **Méthode:** suites scriptées exécutées en séquence
(11 suites, serveur :3001 + PG :5544 + Redis, monde seedé officiel).

## Critères §5 → preuves

| # | Critère (§5) | Preuve | Résultat |
|---|---|---|---|
| 1 | **Voyage** Jangan→Donwhang→Hotan (pied + téléport payant), zones peuplées, sans trou | test-phaseB: téléport payé 500 or, position = centre Donwhang (Δx=0), 15 mobs spawnés autour, or débité 60 000→59 500 | ✅ |
| 2 | **Unique**: annonce spawn, tuée (HP exact), respawn au timer | TG 598 720 HP / 451 200 EXP tuée (test-phaseA), 5 uniques persistants annoncés au boot (log serveur), timers 6h/3h (seed-world) | ✅ |
| 3 | **Classe CH complète + duo EU** | test-phaseC: arbre 280 séries, learn SP 4 430→4 423, cast gating, dégâts officiels, zerk ×2 mesuré (123→236) | ✅ |
| 4 | **Économie**: alchimie taux réels, stall, consignation | test-phaseD: +0→+1 100%, +2→+3 ≈50% (15/40), resets 39; test-phaseD2: stall 8/8 (or débité, slot libre, double-vente rejetée) | ✅ |
| 5 | **Trade**: run 2★ + embuscade + vol + paie | test-phaseG-jobs: étoiles 4/9→3★, embuscade 3 thieves NPC, vente Donwhang 5 720 = 4×(1500×1.62−1000) EXACT, vol 1 lot + recel 4 800 + avertissement | ✅ |
| 6 | **Social**: guilde L2, party 8, PK→murderer, FW gagnée + taxe | guildes phase F (invitation livrée+acceptée), party phase 5 V1, self-defense 0 pt (phase E), fortress: vainqueur au SCORE (pas 1re inscrite), taxe 10%: achat 60→66, storage +6 | ✅ |
| 7 | **Donjons**: FGW 1★ party 4 + Medusa mécaniques + 5 quêtes | FGW: 8 talismans, complétion D8 SoS, cooldown 180 min; Medusa 183 535 199 HP spawnée (B6 ouverte); quêtes V1 phase 4 (18/18) | ✅ |
| 8 | **Confort**: loup, playlist zone, 3 clients, 60 FPS, tsc 0/0 | loup: achat 1M, suit+attaque (7 coups), croissance lv 2; playlist 47 pistes; tsc serveur 0 erreur (chaque commit); persistance DB vérifiée par tous les tests (re-login) | ✅ |

## Suites exécutées (toutes vertes)

phaseA 9/9 · phaseB · combat-flow · phase4 · phase5 · phase6 (V1)
+ phaseC (skills) · phaseD (alchimie) · phaseD2 (stalls) · phaseE (PvP)
· phaseF (guildes) · phaseF2 (fortress) · phaseG-jobs · phaseG2 (donjons)
· phaseH-pets

## Commits V2 (ce 02/10)

26b423b (A données) · d247077 (B monde) · e513625 (C skills) · 3949087
(D alchimie) · 5462963 (E PvP) · c994f76 (F guildes) · 6193a9f (jobs)
· f690f87 (stalls) · ce85283 (fortress) · cf13015d (donjons) · f2e1204bc
(pets) · b4b45b6dc (audio)
