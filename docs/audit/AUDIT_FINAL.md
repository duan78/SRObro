# AUDIT FINAL — SRObro 100 % (§5 du PROMPT_MAITRE)

**Date**: 1er octobre 2026 (nuit) · **Commits**: b98bffe (P1) · 9880ae1 (P2) · 59514d7 (P3)
· 41360d1 (P4) · 7a7ff6e1c (P5) · 66ae4fc48 (P6) · 18bb28633 (P7)

Démonstration exécutée en conditions réelles: serveur Node :3001 (PostgreSQL
Docker :5544, Redis :6379), client Vite :3000, deux onglets navigateur
simultanés, film `docs/audit/demo_gameplay.webm` (22,5 s, 1280×720) + captures
d'écran + mesures programmées.

---

## Les 8 critères du §5

### 1. Création compte + personnage → spawn, déplacement, caméra ✅
- Compte `demoaudit` créé depuis l'écran d'auth (mode « Créer un compte »),
  personnage **Demoaudit** (Chine, masculin) créé via « Créer et jouer ».
- Spawn en ville à (0, 500), HUD complet, 29 monstres en zone.
- Déplacement **au clic** mesuré: (0,500) → (3.5,500) → (7,506) → (9.5,551.6)
  soit >50 m de marche réelle filmée; **orbite caméra** au drag souris.

### 2. Combat: 3 skills + mort + loot + respawn ✅
- Skills **1/2/3** (Taillade & co) utilisés en combat (touches réelles filmées),
  dégâts serveur autoritaires, nombres de dégâts flottants, anims
  attack01/damage01/die, étiquette flottante « MOB_CH_MANGNYANG Lv. 1 »
  (capture `critere2_label_cible_monstre.png`).
- Kills répétés (+54 XP chacun, XP officielle), **loot** au sol cliquable:
  « Ramassé: 초보자의 HP 회복약(소) » (potion officielle, drop 25 %).
- **Mort**: HP 0 (aggro d'un monstre GM officiel niv. 90), écran de mort,
  **résurrection en ville**: « Résurrection réussie », HP 240/240, retour (0,500).

### 3. Niveau 2 + stats réparties ✅
- « Niveau 2 atteint ! » après kills (162 XP cumulés), **3 points de stats**.
- Panneau personnage (C): **+1 STR** (20→21, points 3→2) — le chat confirme
  l'effet: « +1 STR — attaque 35~45 » (bonus floor(str/10) serveur).

### 4. Boutique: achat potion + usage + équipement arme ✅
- Boutique (B) aux **prix officiels**: potions 1 or, lames 21-22 atk.
- Achat ×10 potions: « Acheté pour 10 or » (or 10 027 → 10 017).
- **Usage**: potion bue en combat (inventaire 10 → 9 vérifié en base, heal 50).
- **Équipement**: « ITEM_CH_BLADE_01_A équipée » — table Equipment (atk 21-22)
  + mesh `blade_01` visible sur le personnage.

### 5. Deux clients simultanés ✅
- Onglet A (Demoaudit) + onglet B (Visiteuse, compte distinct via sessionStorage).
- **Visibilité mutuelle**: chacun voit l'autre (spawn_player croisés, modèles
  officiels, annonces « X est en ligne »).
- **Chat** transmis: « Visiteuse: Salut Demoaudit ! Je te vois ! » reçu chez Demoaudit.
- **Mob partagé**: les deux clients ciblent le MÊME monstre (id identique
  `aabd2dd9…a58426xde`, HP 24/24 synchro). Verrouillage de loot prouvé par
  `test-phase5.ts` (10/10).

### 6. GM: /admin + commandes + sanctions ✅
- Compte owner **arnaud → admin** (rôle en base, affiché « Compte: arnaud (admin) »).
- **Commandes en jeu** (Kaiser): `/announce` (📢 reçu par l'autre onglet),
  `/rates exp 5` puis kill mesuré **+270 XP = 54×5 SANS REBOOT**, `/item`,
  `/whereis Demoaudit: X=0 Z=500`, `/speed 2`, `/kill`, `/spawn MOB_CH_MANGNYANG`,
  `/tp`, `/god`, `/invisible`, `/freeze`, `/ban` (login refusé « Compte banni »),
  `/unban`, `/kick`, `/gm promote` — 31/31 tests scriptés (`test-phase6.ts`).
- **Console web /admin** (capture `critere6_console_admin.png`): dashboard
  temps réel (joueurs + flags GM, 29 monstres vivants, 63 comptes, 21 529
  items), **éditeur de taux live** (exp ×3 appliqué et vérifié depuis la
  console, reset ×1), navigateur des 21 529 items et des 7 825 monstres
  officiels, KillLog avec noms, sanctions ban/kick, téléporteur.

### 7. 60 FPS, zéro erreur console ✅
- **60 FPS** mesurés (comptage rAF sur 5 s) en ville, deux clients ouverts.
- **1 seul avertissement** en 15 min 23 s de session (923 s): « Resource ID not
  not found in manifest: strong_mangnyang » — fallback proxy ASSUMÉ pour un
  monstre GM niv. 90 hors manifest, sans impact. **Zéro console.error**.

### 8. tsc 0 erreur + persistance après relance ✅
- `tsc --noEmit`: **0 erreur serveur, 0 erreur client**.
- **Relance du serveur** (kill + restart): Kaiser intact (niv. 4, 10 020 or,
  27 SP, HP 260, position 23.4/471.4), taux Redis rechargés (exp=1 après reset),
  monstres repeuplés au premier passage.

---

## Santé générale (§0.3)
- `curl /health` → `{"status":"ok"}` (IPv4 :3001).
- Vérifications navigateur MESURÉES (FPS rAF, état sockets, base PostgreSQL).
- Boucle de jeu: tick serveur 20 Hz, 60 FPS client, reconnexion auto
  (reconnexion infinie + ré-auth + filet 12 s).

## Artéfacts
- `docs/audit/demo_gameplay.webm` — film 22,5 s 720p (marche, caméra, ciblage,
  skills 1-3, mort du monstre, loot, orbite).
- `docs/audit/critere2_label_cible_monstre.png` — étiquette cible + minimap
  officielle + HUD.
- `docs/audit/critere6_console_admin.png` — console /admin temps réel.
- Tests scriptés: `test-auth-flow` 12/12, `test-combat-flow` 13/13,
  `test-phase4` 18/18, `test-phase5` 10/10, `test-phase6` 31/31.

## Suites connues (non bloquantes)
- Certains monstres GM (codes hors manifest client) s'affichent en proxy cube
  (warn unique) — les 13 seedés + codes courants ont leurs modèles.
- Le chat n'a pas de canaux party/guild; l'API socket C2S est encore
  partiellement typée côté client (0 erreur tsc néanmoins).
- Musique: une seule piste (jangan_town) — playlist par zone à brancher.
