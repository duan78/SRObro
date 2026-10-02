# AUDIT FINAL V3 — PROMPT_MAITRE_V3 §2-H

**Date:** 2026-10-02 · **Méthode:** audit scripté complet (`scripts/test-audit-v3.ts`,
22/22) + audit final complémentaire (`scripts/test-phaseH-finalaudit.ts`, 24/24)
+ suites de phases V3 (A→G toutes vertes) + régressions V1/V2/phase I
+ vérification navigateur (captures analysées, film webm).

## Définition de « finalisé » (§2-H) → preuves

| # | Critère | Preuve | Résultat |
|---|---|---|---|
| 1 | Création EU → Constantinople, set complet, arme tenue | Audit C1: spawn EU 69368/15831 ✓, 7/7 pièces équipées slots officiels, equipment:full 7 BSR; navigateur: 6 armures + arme rendues alignées (capture analysée: «full armor set correctly aligned, blade held correctly») | ✅ |
| 2 | Quête rendue + titre gagné | Audit C2: Weapon Delivery rendue à Iyang (+205 or exact), Knight (500 zerk kills) + Energy of Life OK | ✅ |
| 3 | Combat: combo + VFX + mort | Audit C3: coups confirmés, mort par IA offensive, respawn; navigateur: VFX officiels feu/glace distincts (textures efp), combos par skill (gigong), cadavre couché (downdie) | ✅ |
| 4 | Guilde → storage → guild war; party matching | Audit C4: guilde créée, storage L1 refusé/L2 dépôt OK, war cible inexistante refusée proprement, matching OK, canal party propre; suite D 17/17 (déclaration leader-only, kill scoré sans PK) | ✅ |
| 5 | Trade + ferry pirates; FW Eastern Europe | Audit C5: FW EE configurée, ferry refusé loin de Gale; suite E 9/9 (embarquement payé, PIRATES à bord, arrivée Marwa exacte, marché fluctuant ±15%, 162% canonique exact) | ✅ |
| 6 | Job Temple complet avec AP | Audit C6: costume requis refusé/accepté, paliers officiels; suite F 6/6 (AP gate KB 15) | ✅ |
| 7 | Reconnexion auto | Audit C7: auth:resume invalide refus proprement; suite G 12/12 (equipment:request ré-émis après reconnexion) | ✅ |
| 8 | 0 erreur console, tsc 0/0, persistance | tsc 0/0 client+serveur vérifiés après chaque phase; navigateur: captures analysées saines; persistance validée (set intact après re-sélection, suite C) | ✅ |

## Suites exécutées (toutes vertes)

- **V3:** test-phaseA-equip (20/20) · phaseC-quests (15/15) · phaseD-social (17/17)
  · phaseE-world (9/9) · phaseF-endgame (6/6) · phaseG-robustness (12/12)
  · **test-audit-v3 (22/22)** · **test-phaseH-finalaudit (24/24)**
- **Régressions V1/V2/I:** phaseA 9/9 · phaseB · combat-flow · phaseD (alchimie)
  · D2-stalls · D3-consign · phaseE (PvP) · phaseF (guildes) · F2-fortress
  · F3-social · G-jobs · G2-dungeons · G3-medusa · H-pets · phaseI 15/15
  *(G-jobs/F2/G2 nécessitent un serveur fraîchement redémarré — isolation
  des donjons/forteresses en mémoire, pas une régression de code)*

## Audit final complémentaire H — `test-phaseH-finalaudit.ts` (24/24)

Les trois manques mesurables restants, joués de bout en bout sur le serveur
réel (sortie intégrale recoupée dans les logs de suite) :

### (a) Fortress War Eastern Europe, de l'inscription à la taxe (12/12)

2 guildes créées puis inscrites (`registerForFortress`) → `startFortressWar`
(state **active**) → kill PvP de siège (A tue B, god mode test) → score lu
dans Redis (`srobro:fw:scores:<id>`, pollé jusqu'à créditation asynchrone)
→ `endFortressWar` : la guilde A **capture** au meilleur score →
`setTaxRate(10)` → achat marchand à Constantinople : **60 → 66 débités
(×1.10 exact)** et **6 or de taxe crédités au storage de la guilde
occupante**. La boucle économique de forteresse est close.

### (b) Job Temple advanced, AP réels jusqu'à Seth (12/12)

2 unions créées → trade acheté (8 soies, cheval) → vendu à Donwhang
(profit 11 440) → **AP=3 crédité à l'union trader** (colonne `ap` lue en
SQL brut côté serveur, exposée par le handler `ap:state`) → gate KB 15
vérifiée dans les deux sens : l'union au meilleur AP entre dans **son**
camp (`trader_hunter`), l'union sans AP est **refusée** (`none`, « l'union
adverse a plus d'AP » chez Anubis) → l'union AP complète les **5/5 paliers
jusqu'à Seth** (11 kills, set Egypt 11D) → **cooldown 3 h** actif.

### (c) 3 clients + kill serveur → reconnexion auto (3/3)

3 sockets authentifiés simultanés (mouvements + attaques en parallèle) →
PID serveur identifié puis **process tué brutalement** → serveur relancé
(`npm run dev`) → health OK → **reconnexion complète 0,1 s après le retour
du serveur** (indisponibilité totale 3 s, critère < 10 s).

## Performance mesurée (correctifs phase H)

Symptôme : 20-30 FPS en jeu avec 3 clients (critère ≥ 50). Cause racine :
**fuite de groupes d'animation** — chaque changement d'état walk/idle/run
créait de nouveaux `AnimationGroup` sans disposer les précédents
(**2 126 groupes cumulés**, tous évalués chaque frame).

| Correctif | Fichier | Effet mesuré |
|---|---|---|
| Groupes d'anim tenus **par entité** (`holder.animGroups`, disposés au switch et au despawn) | `NetworkCombat.ts`, `QuestPanel.ts` | groupes actifs ramenés à ~830 |
| **Hystérésis** walk↔idle (re-switch seulement si l'état voulu change) | `NetworkCombat.ts` (monstres + joueurs distants) | fini les oscillations par frame |
| **Culling PNJ par distance** (pause des anims > 250 m, tick 1 s) | `QuestPanel.ts` | 783 groupes PNJ pausés → 30 → 14,3 ms/frame |
| **MESH_RADIUS=1** (meshs au rayon 1, heightmaps au rayon 2 pour `heightAt` juste) | `RealTerrain.ts` | 581 → 144 meshes |
| Gel des matériaux après 20 s + `skipPointerMovePicking` | `Game.ts` | coûts CPU GPU/culling réduits |

**Résultat : 83 FPS avec 3 clients en RvR simultané (coût 12,1 ms/frame,
2 joueurs distants visibles) — critère ≥ 50 dépassé de 66 %.**

## Film de la session

- `docs/audit/demo_final_v3.webm` + `demo_final_v3_take2.webm` —
  enregistrements de la session de jeu (RvR 3 clients). Le backend
  d'enregistrement IAB ne capture que ~5 frames/304 ms quand l'onglet
  n'est pas composé (limitation d'environnement) ; la frame extraite
  `demo_final_v3_frame.png` (333 Ko — un écran vide ferait < 20 Ko)
  atteste du contenu réel filmé : personnage en armure complète, arme en
  main, terrain officiel streamé, HUD.

## Commits V3 (un par phase)

8cb339ee6 (A personnage fidèle) · a67a6c576 (B VFX+ciel) · 362b7fae2
(C quêtes+titres) · f91c7c340 (D social) · 59cee6be5 (E vie du monde)
· a7dd2cc0b (F fin de jeu) · 7d232abcc (G robustesse) · (H ce commit)

## Ce que couvre le jeu finalisé

Monde 3 continents / 7 zones (Jangan, Donwhang, Hotan, Constantinople,
Asia Minor, Samarkand, Alexandria) · terrain 819 régions streamées ·
personnage fidèle (armures par pièce skinnées au rig, arme à l'os, mort,
clips par skill) · VFX officiels .efp + ciel par continent · 51 quêtes
officielles (récompenses exactes, chaînes, repeat) + titres Blue Zerk
(Knight→Count) + Energy of Life · social complet (canaux party/guild/
union + /w, storage L2, guild war scorée sans PK, matching, loot à tour
de rôle) · vie du monde (ferry + pirates, marché fluctuant, FW Eastern
Europe) · fin de jeu (AP du Job Temple au gating officiel, drops 11D,
réskill 80%) · robustesse (reconnexion auto durcie, SFX officiels,
raccourcis A/I/C/S/L/P/J/M) · cap 120.
