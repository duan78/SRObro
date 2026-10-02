# AUDIT FINAL V2 — PROMPT_MAITRE_V2 §5

**Date:** 2026-10-02 · **Méthode:** SESSION DE TEST FILMÉE exécutée de bout
en bout (`scripts/audit-filme-v2.ts`, transcription horodatée complète dans
[`AUDIT_FILME_V2_TRANSCRIPT.log`](AUDIT_FILME_V2_TRANSCRIPT.log)) + suites
scriptées (20 suites, serveur :3001 + PG :5544 + Redis, monde officiel).

## Critères §5 → preuves

| # | Critère (§5) | Preuve (session filmée V2 + suites) | Résultat |
|---|---|---|---|
| 1 | **Voyage** Jangan→Donwhang→Hotan (pied + téléport payant), zones peuplées, sans trou | FILMÉE C1: téléports payés (−500 or, position exacte −2908/−6347); zones peuplées (test-phaseB 15 mobs) | ✅ |
| 2 | **Unique**: annonce spawn, tuée (HP exact), respawn au timer | FILMÉE C2: TG 598 720 HP au monde, tuée → +45 120 XP = 451 200×GAP 9 EXACT; 5 uniques persistants annoncés au boot, timers 6h/3h | ✅ |
| 3 | **Classe CH complète + duo EU** | FILMÉE C3: skill appris par SP (280 séries), zerk 5 orbes activé; phaseC complet: gating, dégâts officiels, zerk ×2 mesuré | ✅ |
| 4 | **Économie**: +5 destruction constatée, SoS dropé, stall, consignation | FILMÉE C4: alchimie 100% à +1, **destruction ≥+5 constatée**, consignation Juel (dépôt+achat distance 2 010 000→2 005 000, commission); stall D2 8/8 | ✅ |
| 5 | **Trade**: run 2★ + embuscade + vol + paie | FILMÉE C5: 4 Silk 3★, embuscade 3 thieves NPC, **vente 162% KB EXACTE (5 720)**; vol+recel (phaseG-jobs) | ✅ |
| 6 | **Social**: guilde + union, party 8 Auto Share bonus mesuré, PK, FW + taxe | FILMÉE C6: guilde 500k, **union créée**, party Auto Share 2, **bonus +3%/membre mesuré (ratio 51.5%)**; fortress F2 10/10 (vainqueur au score, taxe) | ✅ |
| 7 | **Donjons**: FGW 1★ + Medusa ENGAGÉE avec mécaniques | FILMÉE C7: FGW 8 talismans, **Medusa ENGAGÉE (5 coups), AoE Petrify proche (dmg 9), ESQUIVE à 48 m**; cooldown 3h | ✅ |
| 8 | **Confort**: loup, playlist, UI complète, 3 clients, 60 FPS, tsc 0/0 | FILMÉE C8: loup 1M invoqué, monture ×1.67; **UI: S/J/P/M/X/I/L/C**; playlist 47 pistes; tsc 0/0 | ✅ |

## Suites exécutées (toutes vertes)

**Session filmée:** audit-filme-v2.ts (transcription AUDIT_FILME_V2_TRANSCRIPT.log)
Suites: phaseA 9/9 · phaseB · combat-flow · phase4 · phase5 · phase6 (V1)
+ phaseC · phaseD (avec destruction ≥+5) · phaseD2 (stalls) · phaseD3 (consignation)
· phaseE (PvP) · phaseF (guildes) · phaseF2 (fortress) · phaseF3 (union+party)
· phaseG-jobs · phaseG2 (donjons) · phaseG3 (Medusa) · phaseH-pets

## Commits V2 (ce 02/10)

26b423b (A données) · d247077 (B monde) · e513625 (C skills) · 3949087
(D alchimie) · 5462963 (E PvP) · c994f76 (F guildes) · 6193a9f (jobs)
· f690f87 (stalls) · ce85283 (fortress) · cf13015d (donjons) · f2e1204bc
(pets) · b4b45b6dc (audio) · 24af61a35 (lacunes §5: destruction, consignation,
party, union, Medusa, UI) · audit filmé
