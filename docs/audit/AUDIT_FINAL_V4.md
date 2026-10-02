# AUDIT FINAL V4 — PROMPT_MAITRE_V4

**Date:** 2026-10-02/03 · **Méthode:** captures analysées image par image +
audit visuel rejouable dans le navigateur (`client/src/test/v4-audit.ts`,
8/8 × 2 passages) + suites scriptées serveur (test-v4-skills 14/14,
régressions V1/V2/V3 complètes) + mesures de performance instrumentées.

Contexte: la V3 avait livré la profondeur gameplay (audit 22/22 + 24/24);
la V4 attaque ce qui sautait aux yeux en 10 secondes de jeu: armure
tordue/à l'envers, UI empilée illisible, icônes de skills absentes — puis
la fidélité fine et l'optimisation.

## §3 — Définition de « finalisé V4 » → preuves

| # | Critère | Preuve | Résultat |
|---|---|---|---|
| 1 | Perso équipé: 0 pièce tordue/inversée/doublée, arme en main, idle complet | Cause racine: **double flip π** (chaque pièce skinnée embarquait son `_flip` interne empilé sous le `_flip` du corps — AssetLoader.ts:413 × NetworkCombat.ts:650). Fix: flip interne neutralisé. Captures 3 angles (`phaseA_front/profil/dos.jpg`) analysées: «visière vers la caméra, plastron devant, épaulières symétriques, lame tenue diagonale le long du bras, 0 fantôme, idle naturel». Arme orientée par quaternion aligné poignet→doigts (axe −Z des GLB mesuré). Audit visuel: 6 pièces + arme sous le flip, aucun flip résiduel. Équipement auto au login fiable (chemin « flip manquant → réessai », 60 s) | ✅ |
| 2 | UI: 0 chevauchement tous panneaux ouverts, une seule hotbar | Couche Babylon-GUI (UIManager) neutralisée — HUD DOM unique. WindowManager: zones d'écran (gauche/milieu/droite), **exclusivité par zone** (comportement SRO officiel), cascade anti-collision clampée, hauteurs max + scroll, drag par titre, z-order au clic, Échap ferme le dessus. Script DOM `WindowManager.auditNoOverlap()` en jeu: 6 raccourcis ouverts → **0 chevauchement** (rects: quest @12,150 · job @322,150 · party @992,262). Capture analysée: «one single row hotbar, chat clean, no duplicates». Fix observateur (subtree) vérifié par double passage de l'audit (réouvertures) | ✅ |
| 3 | Icônes: 556/556 skills + items/buffs câblées, 0 slot vide non justifié | `iconUrl` câble les chemins DDJ officiels → PNG servis. **6 895/6 899 skills** avec icône réellement servie (capture Bicheon: 56/56 chargées, 55 officielles + 1 défaut légitime — série BASE sans icône chez Joymax). Items: **21 217/21 529** (98,6 %) + 38 DDJ re-extraites du Media.pk2 (repli common/ pour les incohérences Joymax). Sans asset officiel (repli fidèle icon_default): 4 passives EU «base», 174 articles mall Premium, 18 capes D12 — **inexistants même dans le client officiel**. Hotbar: icône par slot vérifiée chargée (3/3). Panneau skills: onglets maîtrise + séries iconisés | ✅ |
| 4 | Skills: 8+ catégories castées avec effets/états vérifiés | **test-v4-skills.ts 14/14**: mono (SMASH), multi-coups (BASE ×2 coups), AoE nuke (GIGONGSUL 250 %: cible + voisin ≤ 8 m), stun (SPEAR STUN 5 s → `entity_stunned`, IA monstre gelée), imbue (GIGONGTA sans cible), heal (SELFHEAL ≥ 89, scaling maîtrise), buff (GANGGI defp, durée + icône), cooldown (re-cast refusé). Zerk ×2 couvert par test-phaseC («Dégâts zerk ≈ ×2», re-passé au vert). Maîtrises officielles 2L² (bicheon 5, heuksal 14, cold 8, force 5, fire 30 — 21 568 SP consommés), buffs appliqués dans la formule officielle (def/parade cible, toucher attaquant) | ✅ |
| 5 | Monde: PNJ/monstres alignés et nommés, quêtes marquées, fog/ciel par continent | 87 noms de PNJ dorés au-dessus des têtes (téléporteurs bleus), monstres «Nom Lv.X» (uniques orange), marqueurs de quête officiels **« ! » orange** (disponible) / **« ? » bleu** (en cours) via `quest:markers` (startsAt/endsAt × état joueur) — capture analysée: «golden name labels above multiple NPC heads», «large orange exclamation mark floats above one NPC». Brume EXP2 couleur ciel (mode vérifié en scène). PNJ/monstres partagent le chemin de chargement du perso (fix flip générique) | ✅ |
| 6 | Perf: ≥ 60 FPS avec 3 clients + UI complète, Δ mémoire < 5 % | **103 FPS avec 3 clients** (9,69 ms/frame — critère 60 dépassé de 72 %), 112 FPS seul. Churn 3 téléportations + 450 frames: meshes/groupes/matériaux/textures **0,0 %**, heap **+1,8 %**. Détails: `mesures_perf_v4.md` | ✅ |
| 7 | Régressions V1/V2/V3 vertes + tsc 0/0 | **audit-v3 22/22 ✓ · phaseH-finalaudit 24/24 ✓ · phaseA-equip ✓ · phaseC (zerk ×2) ✓ · phaseC-quests ✓ · phaseD-social TOUT PASSÉ (après serveur frais — la seule exécution avec 3 échecs était une pollution d'état inter-suites, re-passée seule au vert) · phaseE-world ✓ · phaseG-robustesse TOUT PASSÉ · v4-skills 14/14**. tsc client 0 erreur · tsc serveur 0 erreur (après rebuild shared) | ✅ |
| 8 | Reconnexion < 10 s après kill serveur (avec UI V4) | Couvert dans phaseH-finalaudit (c): serveur tué brutalement → reconnexion complète **0,1 s** après le retour du health (indisponibilité totale 3 s) — re-passé au vert avec la UI V4 | ✅ |

## Phases livrées (une = un commit)

| Phase | Commit | Contenu |
|---|---|---|
| A — Rendu perso fidèle | `d938a9cce` | double flip π corrigé, arme orientée quaternion, équipement auto fiable (60 s de réessais), captures 3 angles |
| B — HUD unique DOM | `ef165b615` | couche GUI retirée, WindowManager (zones/exclusivité/anti-collision/drag/Échap), hotbar cliquable + cooldown radial |
| C — Icônes officielles | `e653e4245` | iconUrl, SkillPanel iconisé (maîtrises + séries), hotbar, +38 DDJ extraites, couverture mesurée |
| D — Skills logos+logique | `62a146716` | heal/buff/stun/AoE serveur + formule, casts sans cible, barre d'incantation + barre de buffs, test 14/14 |
| E — Fidélité monde | `2fe5ab8a3` | FloatingLabel (noms PNJ/monstres), marqueurs !/?, brume de distance |
| F+G — Perf + audit visuel | `1b1e06d3f` | mesures (103 FPS/3 clients, churn 0 %), `__v4VisualAudit` 8/8 ×2, fix observateur subtree |

## Films et captures

`docs/audit/v4/`: phaseA_front/profil/dos.jpg (armure alignée 3 angles),
phaseC_skills_icons.jpg (panneau skills iconisé), phaseD_cast_buffs.jpg
(barre de cast + buffs), phaseE_marqueurs.jpg (noms + « ! »), mesures_perf_v4.md.

## Écarts assumés (documentés dans le code)

- Buffs: durée 60 s [APPROX — durées officielles hors skilldata extrait]
- AoE nuke: rayon 8 m [APPROX — mécanique officielle des nukes CH]
- Scaling heal: 1 + maîtrise × 4 % [APPROX]
- 196 icônes référencées sans asset dans le client officiel → icon_default
 (comportement fidèle: le client officiel affiche aussi son placeholder)
