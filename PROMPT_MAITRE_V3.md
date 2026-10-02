# PROMPT MAÎTRE V3 — SRObro : la finalisation (« complet, poli, fidèle, robuste »)

> Prompt autoportant, successeur de `PROMPT_MAITRE.md` (V1 : 7 phases, audit 8/8) et
> `PROMPT_MAITRE_V2.md` (V2 : phases A-H, audit filmé 8/8 ; phase I Europe/Égypte/cap 120
> livrée). Cette V3 amène le jeu de « **tout le contenu livré** » à « **finalisé** » :
> personnage visuellement fidèle, VFX officiels, quêtes/titres, social complet, vie du
> monde, robustesse multi-clients — et un audit filmé de bout en bout qui définit le
> « terminé ».

---

## 0. ÉTAT DE DÉPART (vérifié au 02/10 soir — NE PAS REFAIRE)

### 0.1 Acquis (chacun prouvé par suites vertes / audits filmés)
- **V1** (`docs/audit/AUDIT_FINAL.md`) : auth bcrypt multi-onglets, combat autoritaire,
  inventaire 45 slots + **21 529 items officiels** (prix col 26), courbe XP officielle
  (leveldata cumulée), multi-joueurs, 22 commandes GM + console `/admin` (dashboard,
  navigateur items/monstres, KillLog), minimap officielle, 0 erreur console, 60 FPS.
- **V2** (`docs/audit/AUDIT_FINAL_V2.md`, session filmée 8/8) : données officielles vSRO
  (monstres HP/EXP exacts, 6 909 skills skilldata), monde chinois 3 villes + téléporteurs
  payants + **5 uniques aux timers officiels avec annonce**, apprentissage skills par SP
  + zerk ×2 mesuré + imbues, alchimie aux taux DB réels (destruction ≥+5 constatée),
  PvP/PK self-defense, guildes + union + party Auto Share (+3 %/membre mesuré),
  stalls + consignation Juel, triangle jobs complet (étoiles, embuscades NPC, vente
  162 % EXACTE, vol + recel), Fortress War au score + taxes appliquées, FGW Togui +
  Qin-Shi B6 Medusa (mécaniques esquivables), loup de croissance, montures, playlist
  47 pistes par zone, combos d'attaque officiels par famille d'arme + réactions hit.
- **Phase I** (commits `fd6572878`, `0298b2455`, `267cb1697`) : **7 zones sur 3
  continents** — Constantinople (départ EU corrigé, NPC officiels, bâtiments
  `euro_constan_*`), Asia Minor (Captain Ivy), Samarkand, Alexandria S/N + déserts
  égyptiens (60 espèces 100-110), **16 Dimensional Gates officielles** (5 000 or) +
  gates internes d'Égypte, **Job Temple** (paliers officiels Selket→Neith→Anubis→
  Haroeris→Seth→Apis+Eris, costume de métier + niveau 100, cooldown 3 h), Cerberus
  693 072 HP persistant, **cap 120 unifié** (courbe officielle côté client, maîtrises
  totales CH 3×niveau / EU 2×niveau), **degrés 10D/11D achetables** (Hemaka, degrés
  dans les codes `ITEM_*_10/11_*`), terrain **819 régions en streaming 5×5** autour du
  joueur, minimap Europe/Égypte (529 fonds générés des tilemaps officielles, fallback
  Media→généré), `test-phaseI.ts` 15/15 + 17 suites vertes.
- **Réparations 02/10 soir** (`267cb1697`) : cache Vite corrompu purgé (chunk 3 octets
  servi en 200 → « Unsupported texture format »), **7 handlers client ciblaient un
  PNJ/joueur distant au lieu du perso** (résolu par `Game.getLocalPlayerMesh()`),
  téléport plafonné 1,5 s, purge des monstres fantômes >300 u, tri WorldObjects par
  distance au centre demandé, IA offensive confirmée (combat-flow TOUT VERT : bandits
  tuent le joueur, résurrection).

### 0.2 Stack & données (inchangées)
- Client **BabylonJS 8** (Vite :3000) + serveur **Node/TS autoritaire** (Socket.io :3001,
  Prisma/PostgreSQL hôte **5544**, Redis 6379 mdp `srobro123`).
- Client officiel extrait dans `assets/pk2_{data,map,media,music,particles}` (source
  `C:\Program Files (x86)\Silkroad`) ; 86 926 GLB + 28 728 textures dans
  `client/public/assets` (gitignorés — régénérables, cf. §4).
- CSV officiels dans `docs/SRO_KNOWLEDGE_BASE/ML_RESEARCH/data/` (monstres vSRO 188 +
  cap 120, uniques, skills CH/EU par niveau, séries, maîtrises, zones).
- Base de connaissances sourcée ~38 000 lignes (`docs/SRO_KNOWLEDGE_BASE/`).

### 0.3 Conventions & pièges (CUMULÉS — chaque violation a coûté des heures)
Reprendre **INTÉGRALEMENT §0.4 et §0.5 de `PROMPT_MAITRE_V2.md`**, PLUS :
- **Joueur local = `Game.getLocalPlayerMesh()`** — JAMAIS `meshes.find(name
  .startsWith('chinaman_'))` : les PNJ et joueurs distants partagent les mêmes modèles
  officiels (vécu : PNJ téléportés « en l'air », VFX/dégâts au mauvais endroit).
- **Grille régions client = vérité** (fichiers nv_/`.o`/minimap). Les PosX/PosY xSROMap
  de la KB ne sont fiables qu'en **offsets RELATIFS intra-ville** (échelle 1:1).
  Ancres : Jangan 69x71=(0,510), Constantinople 103-106×77-80=(69370,15846),
  Samarkand 87x86=(35520,29760), Alexandria ~91x49=(40300,−42300).
- **Vite** : après toute écriture de script exterle ou crash → purger
  `node_modules/.vite` + `taskkill /IM esbuild.exe` + redémarrer, sinon chunks
  corrompus servis en HTTP 200 (symptôme : erreurs absurdes type « Unsupported texture
  format » alors que les sources sont saines).
- **Tests automatisés navigateur** : onglet en arrière-plan = timers throttlés → poser
  un heartbeat manuel (émettre `heartbeat` toutes les ~5 s) sinon la socket meurt en
  30 s ; **une seule session de test à la fois** (les sockets zombies perturbent l'aggro
  et rendent les suites flaky).
- **Sorties shell tronquées/déformées** : toujours recouper un résultat inattendu via
  `node -e` + fichier tampon avant de conclure.
- `/mobinfo` n'a **pas d'argument** (affiche le plus proche : spawner le mob exact
  d'abord) ; tester les combats GM en point **isolé** (les camps d'anneaux interfèrent
  avec `/kill` 150 m) ; plafond **12 persos/compte** → purger les persos de test
  (garder Au2iix0j/Audiiwws/CstBrws01) dès qu'une suite échoue à `create`.
- Le « done » se prouve : mesures/pixels/captures analysées, suites vertes, `tsc 0/0`
  client+serveur+shared, un commit par phase (message français), `Avancement.md` mis à
  jour (session N+1).

---

## 1. OBJECTIF FINAL

Un joueur vit l'expérience Silkroad **complète et finalisée** : son personnage
s'habille visuellement **pièce par pièce** (armures/armes officielles par degré),
lance ses skills avec les **VFX officiels** de Particles.pk2, meurt avec l'anim
officielle, enchaîne les **quêtes officielles** de Jangan à Alexandria avec journal et
**titres** (Blue Zerk), discute sur les **canaux party/guilde/union**, fait ses
**guerre de guilde** et son **storage**, prend le **ferry maritime** escorté par les
pirates, monte ses **AP** pour le Job Temple — et tout tient : 3 clients simultanés,
60 FPS en ville ET en RvR, reconnexion automatique, 0 erreur console sur 30 minutes.

---

## 2. PHASES V3 (ordre imposé ; critères d'acceptation mesurables)

### PHASE A — Le personnage visuellement fidèle (armures, armes, mort)
1. **Armures par pièce** : à l'équipement, remplacer le modèle par les parties
   officielles du set (degré itemdata → chemins `man_*`/`woman_*` CH, `eu_*` EU par
   pièce chest/legs/shoulder/helmet) ; modèle « sous-vêtements » par défaut ; fallback
   teinte par rareté si le GLB manque (marqué [APPROX]).
2. **Armes visibles par famille** (sword/blade/glaive/spear/bow CH, 1H/2H/staff/harp/
   crossbow/dagger EU) attachées à la main (os `Bip01 R Hand` des squelettes officiels)
   et remplacées à l'équipement.
3. **Anim de mort du perso** (clip `die01` + affaissement + bandeau), respawn en ville.
4. **Anims par skill précis** : mapping skilldata→clip (chaîne `skill_ch_sword_*`,
   nukes EU, heals) en priorité sur le combo par famille (fallback existant conservé).
- **Critères** : équiper un set complet 8D change TOUTES les pièces visibles (captures
  avant/après analysées) ; l'arme tenue correspond à l'équipée (CH + EU) ; mort filmée ;
  un nuke feu joue le clip officiel du skill (pas le combo générique).

### PHASE B — VFX officiels (Particles.pk2) + ciel
1. Décoder le format `.efp` (particules SRO : émetteurs/couleurs/textures —
   **3 331 efp indexés + 999 textures déjà converties** via
   `scripts/index-efp-textures.js` → `efp-textures.json`).
2. Convertisseur `efp → systèmes de particules Babylon` (émetteur, vitesses, couleurs,
   blend additif), mapping skill→efp par élément/famille (le `SkillEffectManager`
   actuel, procédural, devient le fallback).
3. Ciel : skybox officiel (textures Media `sky_*`) ou dégradé par zone — au choix,
   documenté.
- **Critères** : Meteor (Wiz EU) affiche un VFX riche diffus conforme à l'esprit du
  client officiel ; feu/glace/foudre/heal visuellement distincts ; un
  `scene.getEngine()._releaseTexture` surveillé : 0 fuite après 100 casts.

### PHASE C — Quêtes officielles complètes + titres
1. Importer les lignes officielles : **Jangan ~22, Donwhang ~25**
   (`16_QUEST_SYSTEM.md` : NPCs, prérequis, récompenses, repeat ×1/2/3/5/7) puis
   Hotan/Samarkand/Constantinople si données disponibles (KB sourcée uniquement —
   sinon `[APPROX]`).
2. **Journal de quêtes complet** (actives/terminées, suivi d'objectifs au HUD, rendu
   au PNJ, abandon) ; l'existant (18 seedées, QuestPanel) sert de socle.
3. **Chaîne de titres « Blue Zerk »** (kills en zerk, Energy of Life 1/20 min —
   KB 16) jusqu'où le cap le permet ; titre affiché au-dessus du nom.
- **Critères** : suite scriptée : 5 quêtes Jangan rendues avec récompenses EXACTES ;
  le journal reflète l'état (capture) ; un titre gagné visible en jeu.

### PHASE D — Social complet
1. **Canaux chat** : party/guild/union + chuchotement `/w`, couleurs officielles,
   historique déroulant (le chat général existe).
2. **Guildes** : **storage dès L2** (dépôt/retrait avec droits officier), emblème
   (image simple), **guild war** (hostilité déclarée → PvP sans murder, score, fin
   négociée), pénalité de dissolution 3 jours (KB 17).
3. **Party** : **matching window** (recherche par niveau Four Square, auto-invite),
  distribution du loot **à tour de rôle** officielle (KB 18).
- **Critères** : 2 onglets → `/w` livré ; storage : dépôt puis retrait refusé au
  membre sans droit ; guild war 5 min avec score HUD ; le matching crée une party de
  2 « inconnus » (sockets séparés).

### PHASE E — Vie du monde & trade final
1. **Ferry maritime officiel** : Gale (−11 424, 1 162) → Marwa (Alexandria N) avec
   escales-pièges pirates (Morgun, Blackbeard — KB MAP_COORDINATES §ferries) : bateau
   visible, embarquement payant, **event pirates pendant la traversée**.
2. **Fluctuation du marché des spécialités** : prix d'achat/vente variables par ville
   et par session (bornes KB), pas fixes — le multiplicateur de route 162 % reste la
   référence.
3. **Eastern Europe Fortress** (FW) en plus des 3 existantes (même moteur :
   inscription, siège au score, taxes).
- **Critères** : traversée filmée avec combat de pirates ; deux runs de trade à
  quelques minutes d'écart donnent des prix de vente différents ; FW Eastern Europe
  jouée 10 min compresses avec taxe appliquée.

### PHASE F — Fin de jeu & économie
1. **AP réels du Job Temple** (KB 15:458-462) : quêtes job répétables → AP d'union,
   gating **Anubis/Haroeris/Seth** par « l'union au plus haut AP entre » (règle
   officielle), spawns 2×/jour optionnels.
2. **Drops 11D d'Égypte** : tables par mob SD (11D / Seal of Nova / Egypt A-B —
   KB 22/15), Gold = EXP×1,3 constaté.
3. **Réskill 80 %** (quête officielle), Immortal/Astral/Steady complets à l'alchimie,
  advanced elixirs +1/+2 garantis (KB 05).
- **Critères** : suite : AP gagné par quête job → l'union au meilleur AP entre chez
  Anubis, l'autre non ; un SoN droppé puis équipé à Alexandria ; réskill testé
  (80 % des SP restitués).

### PHASE G — Robustesse & confort
1. **Reconnexion auto** (coupure réseau/serveur → retour en jeu < 10 s, état
   préservé ; le purge client au `connected` existe, le re-auth auto aussi).
2. **Perf** : 3 clients + FW locale sans chute < 50 FPS (profiler : LOD props en
   ville, throttling des broadcasts, budget WorldObjects par distance déjà en place).
3. **SFX étendus** depuis `assets/pk2_data/prim/snd` (coups, crit, level-up, UI) +
   options volume/gamma persistées.
4. **Raccourcis officiels** (A inventaire, S perso, fenêtres existantes I/L/C/P/M/X/J)
   — le module serveur `hotkey/` existe ; options (audio/gamma) au menu.
- **Critères** : `taskkill` du serveur pendant 3 clients → tous reviennent seuls en
  jeu < 10 s ; 15 min à 3 clients sans `console.error` ; les options survivent à un
  reload.

### PHASE H — AUDIT FINAL FILMÉ (définition de « finalisé »)
Session filmée UNIQUE démontrant bout en bout :
1. Création EU → Constantinople, équipement d'un set complet (visuel), arme tenue.
2. Quête rendue + titre gagné (journal à l'écran).
3. Combat : combo + VFX officiel + anim de mort du mob ET du perso (mort volontaire).
4. Guilde → storage → guild war ; party par matching.
5. Trade + ferry avec pirates ; FW Eastern Europe.
6. Job Temple complet avec AP (Anubis débloqué par l'union au meilleur AP).
7. 3 clients simultanés en RvR/FW : FPS ≥ 50, puis kill du serveur → reconnexion auto.
8. Confort : minimap/carte/musique par zone sur les 3 continents, options, 0 erreur
   console sur la session, `tsc 0/0`, persistance après relance.
+ Mise à jour `README.md` (prise en main) et `docs/INDEX.md`.

---

## 3. RÈGLES D'INGÉNIERIE (non négociables)
1. **Données officielles d'abord** : KB sourcée > CSV ML_RESEARCH > client local >
   recherche web ciblée > équilibrage marqué `[APPROX]`. **Jamais de chiffre inventé.**
2. **Serveur autoritaire** ; `tsc 0/0` client+serveur+shared ; **aucune régression**
   des suites existantes (17 suites V1/V2/I + combat-flow IA offensive) après chaque
   phase — les relancer.
3. **Assets jamais committés** (gitignorés) ; jamais copier de code AGPL
   (opensro/skrillax = lecture de comportement uniquement).
4. **Un commit par phase** (message français) + `Avancement.md` (session N+1 :
   livré/preuves/pièges).
5. **Périmètre gardé** : monde classique + Europe/Égypte cap 120. Le contenu KSRO 12D+
   (Jupiter/Baghdad) et tout ajout hors scope → `Avancement.md` § Backlog, pas
   d'implémentation.

---

## 4. MÉMO EXÉCUTABLE (commandes & entrées)

```bash
# Démarrage
docker compose up -d postgres redis
cd server && npm run dev      # :3001 (PG 5544, .env présent)
cd client && npm run dev      # :3000

# Après un crash/écriture externe: purge Vite OBLIGATOIRE (cf. §0.3)
rm -rf client/node_modules/.vite && taskkill //IM esbuild.exe //F 2>&1 | head -1

# Pipelines assets (sources assets/pk2_* ; PK2 = C:\Program Files (x86)\Silkroad)
npx tsx scripts/extract-region-heightmaps.ts 56 44 109 83   # terrain 819 régions
npx tsx scripts/parse-map-objects.ts                        # bâtiments 6 villes
npx tsx scripts/gen-minimap-tiles.ts                        # minimap manquante
tools/veykril-pk2/target/release/pk2_mate.exe extract --archive "C:\Program Files (x86)\Silkroad\<X>.pk2" --out assets/pk2_<x>

# Seeds monde
npx tsx scripts/seed-world.ts          # Chine (3 villes, 5 uniques)
npx tsx scripts/seed-world-phaseI.ts   # Europe/Égypte (4 zones, gates, Job Temple, 10D/11D)

# Tests (serveur :3001 + PG :5544 + Redis) — purger les persos de test si « create » échoue
npx tsx scripts/test-phaseI.ts ; npx tsx scripts/test-combat-flow.ts
# …17 suites: test-phase{A,B,C,D,D2,D3,E,F,F2,F3,G-jobs,G2,G3,H} + combat-flow + 4/5/6

# Comptes: arnaud/hunter2 = admin (GM). Persos à conserver: Au2iix0j, Audiiwws, CstBrws01.
```

**Entrées code clés** : `server/src/{game/CombatBridge,game/DungeonManager,ai/SpawnManager,
world/PlayerEntity,network/AuthHandlers,job/JobManager}.ts` · `client/src/{game/NetworkCombat,
core/Game (getLocalPlayerMesh),zones/jangan/{RealTerrain,WorldObjects},effects/SkillEffectManager,
systems/BanAnimationService}.ts` · `shared/src/{constants,xpcurve}.ts` ·
`server/data/game/*.json` (21 529 items / 6 483 monstres / 6 909 skills officiels).

---

## 5. DÉFINITION DE « FINALISÉ »

Le jeu est finalisé quand **toutes les phases A→H sont démontrées** (critères
mesurables ci-dessus, §2), l'audit filmé H couvrant chaque point sans exception, les
17 suites existantes + les nouvelles suites de phase au vert, `tsc 0/0` partout, et le
tout commité (un commit par phase) avec `Avancement.md` à jour.

En cas de blocage : `Avancement.md` (16 sessions, chaque piège documenté) → la KB
(`docs/SRO_KNOWLEDGE_BASE/`) → `ML_RESEARCH/` → recherche web ciblée.
