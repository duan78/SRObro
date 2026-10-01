# PROMPT MAÎTRE — SRObro : amener le clone Silkroad à 100 %

> Prompt autoportant à donner à un agent/développeur pour terminer le jeu de bout en bout,
> en se basant au maximum sur les fichiers locaux (client officiel Silkroad + pipeline
> d'assets déjà construit) et des recherches complémentaires ciblées si besoin.
> Objectif final : **jeu jouable de bout en bout (connexion → création → aventure →
> combat → progression) + suite Admin complète (GameMaster, mods, tweaks)**.

---

## 0. CONTEXTE DU DÉPÔT (état réel, vérifié en session)

### 0.1 Ce qui existe et fonctionne (NE PAS REFAIRE)
- **Client** BabylonJS 8 (Vite, `http://localhost:3000`) : rendu 3D du vrai Jangan,
  terrain réel texturé (heightmaps + tuiles officielles), 1 534 meshes de bâtiments
  placés au mètre près, monstres/perso officiels skinés-animés, skybox, HUD DOM,
  caméra 3e personne (clic droit orbite, molette zoom 1,5→150 m, drag bas = plongée),
  click-to-move avec bascule walk/idle des animations officielles. 60 FPS vérifié.
- **Serveur** Node/TS autoritaire (`:3001`, Socket.io) : 0 erreur TS, Prisma + Postgres
  (port hôte **5544**) + Redis Docker, 13 monstres officiels seedés (stats réelles),
  GameDataService chargé au boot : **21 529 items, 7 825 monstres, 612 NPC, 36 008 skills**
  (importés du client officiel). Mode single-player actif côté client
  (`client/src/main.ts` : `network.connect()` commenté ~ligne 83).
- **Pipeline d'assets complet** (tout est en local, ~5 Go) :
  - `assets/pk2_media|pk2_data|pk2_map/` : extractions brutes des PK2 du vrai client
    (`C:\Program Files (x86)\Silkroad`), via `tools/veykril-pk2/target/release/pk2_mate.exe`
    (MIT) : `pk2_mate extract --archive <pk2> --out <dir>`.
  - `tools/rust-jmx-converter` (code du projet) : `.bms`→GLB **avec skins glTF**
    (squelettes résolus via `prim/skel/`, `chinaman_skel.bsk` pour les persos),
    `--mode ddj` → PNG ; répare l'alignement de chunk JSON et les counts JOINTS_0.
  - `ban-re` : parseur BAN (spec JMXVBAN) + `ban2json` → **4 304 animations JSON**
    dans `client/public/assets/anims/` (chemins conservés).
  - `server/scripts/` : `import-textdata.ts` (tables officielles → JSON),
    `generate-asset-manifest.ts` (BSR→GLB+textures), `extract-region-heightmaps.ts`
    (NVM → relief + tilemaps de textures), `parse-map-objects.ts` (placements MAPO
    au mètre près), `convert-ddj-bmp.ts`, `seed-real-monsters.ts`.
- **Recherche déjà faite** (voir `RECHERCHE.md`) : émulateurs open-source
  (OpenSRO Go, Skrillax Rust — **AGPL : référence de comportement uniquement,
  JAMAIS copier leur code**), doc protocole/formats (SilkroadDoc wiki,
  srodevs-docs de JellyBitz), tous les formats binaires nécessaires sont décodés.

### 0.2 Conventions établies (RESPECTER — chaque violation a déjà coûté des heures)
- **Monde ancré** : `RealTerrain.ANCHOR = {x:69, z:71}` (Jangan ville). Région = 1920 m,
  tuile = 20 m. Spawn joueur via `JanganZone.getSafeSpawnPoint()` (évite bâtiments 25 m
  et coutures de régions ±10 m). Le perso fait 1,80 m après `normalizePlayerScale`.
- **Formats** : textdata = TSV **UTF-16LE** (loaders listeant les fichiers de patch,
  clé `SN_` en 3ᵉ colonne de textdata_object) ; DDJ = 20 octets d'en-tête + DDS ;
  BAN = header/temps/os/keyframes 28 octets (quat xyzw + vec3) ; MAPO = enregistrement
  28 octets `[u32 assetId][f32 xyz][u16 0xFFFF][f32 yaw rad][u16 uid][u16][u8][u8]`
  + extensions de 8 octets ; NVM heightmap à `taille−37816`, TextureID tuile à
  `tilemap+6` (u16, index → `Map.pk2/tile2d.ifo`).
- **Couleurs Babylon** : `rgba(r,g,b,a)` **sans espaces** (le parseur rejette en silence).
- **GLB** : la longueur du chunk JSON doit INCLURE le padding 4 octets (Babylon ne
  réaligne pas) ; counts JOINTS_0/WEIGHTS_0 = nb de sommets (pas ×4).
- **Chargement modèles** : `AssetLoader.loadGameObject(bsrStem)` → multi-parties skinées
  + textures par partie (manifest `resources[stem].glbs/textures`), tolérant aux parties
  cassées. Animations : `BanAnimationService.loadAndPlay(scene, skeletons, clipPath,
  loop, speed)` avec `monsterClip(stem, action)` / `playerClip(action)`.
- **Ports/processus** : Postgres hôte **5544** (un PG local occupe 5432/5433),
  Redis 6379 (mdp `srobro123`), serveur 3001, client 3000.
  Démarrage : `docker compose up -d postgres redis` puis `cd server && npm run dev`
  et `cd client && npm run dev`. `server/.env` existe.

### 0.3 Méthode de vérification imposée (le « done » se prouve)
Chaque fonctionnalité se valide par : (1) santé serveur `curl localhost:3001/health`,
(2) état DOM/3D dans le navigateur via l'automatisation browser (captures +
échantillonnage de pixels — ex. variance de couleurs pour prouver un texturage,
angle caméra↔perso pour le centrage, deltas de quaternions pour une animation),
(3) 60 FPS maintenu (`engine.getFps()`), (4) `npx tsc --noEmit` vert sur server.
**Interdiction de déclarer terminé sans preuve mesurée.**

---

## 1. OBJECTIF FONCTIONNEL FINAL

Un joueur ouvre `localhost:3000`, crée un compte puis un personnage ( Chine/Europe,
homme/femme, nom), apparaît à Jangan, se déplace (clic), cible et combat les vrais
monstres avec les vrais skills (données officielles), gagne XP/SP/or/loot, s'équipe,
achète/vend aux NPC, monte de niveau (courbes officielles), et tout persiste en base.
Les erreurs ne crashent jamais la boucle de rendu. Un **GameMaster** dispose d'une
suite d'administration complète. Mode multi-joueurs fonctionnel (plusieurs clients
se voient et interagissent).

---

## 2. PHASES DE TRAVAIL (dans l'ordre ; chaque phase a ses critères d'acceptation)

### PHASE 1 — Authentification & création de personnage (bout en bout)
1. Réactiver le mode réseau : dé-commenter `network.connect()` dans `main.ts` ;
   vérifier le handshake Socket.io (`NetworkManager` ↔ `server/network/ClientManager`
   + `SystemHandlers`). Compléter les handlers manquants côté serveur (login,
   register, character list, create, select) avec Prisma (modèles `Account`,
   `Session`, `Character` déjà en schema).
2. **Écran de connexion** (DOM overlay, même style que `DomHud`) : compte/mot de passe
   (hash bcrypt), liste des persos, **création** : race CH/EU, genre, nom unique,
   apparence par défaut (`chinaman_adventurer` / `chinawoman_adventurer`).
3. Persistance : position, stats, inventaire, or sauvegardés (upsert périodique + à
   la déconnexion). Respawn au dernier point de liaison.
- **Critères** : 2 comptes créés via l'UI ; re-login → perso retrouvé à sa position ;
   `Character` en base cohérent ; messages d'erreur UI propres (pas d'alert natif).

### PHASE 2 — Boucle de combat complète (le cœur)
1. **Ciblage** : clic sur un monstre → cible encadrée (hud `showTarget` existe),
   portées réelles, déciblage (Échap / clic sol).
2. **Attaques de base + skills** : brancher `SkillManager` serveur sur les vraies
   données (`GameDataService.skillsByCode`, skilldata importé) — cooldowns, coût MP,
   dégâts selon les formules documentées dans `docs/SRO_KNOWLEDGE_BASE/`
   (HUB_COMBAT : attaque/parry/critique). Client : barre de skills (F1-F10 déjà
   affichée) déclenchant les packets, barre d'incantation (`CastingBar` existe),
   retours visuels (DamageNumberManager existe).
3. **Anims de combat** : `monsterClip(stem,'attack01')` au déclenchement,
   `playerClip` équivalent — compléter la table d'états (idle/walk/run/attack/die)
   dans une machine à états simple côté client (`BanAnimationService`).
4. **Mort & résurrection** : monstre mort → `die` + fade + loot au sol + respawn
   (SpawnManager existe) ; joueur mort → écran de résurrection (ville / sur place
   avec pénalité), timers réels.
5. **Loot** : `DropManager` + table `MonsterDrop` remplie depuis les données
   officielles (fichier `refpackageitem*`/drop data dans textdata si présent, sinon
   fallback équilibré) ; ramassage au clic, or auto.
- **Critères** : tuer un Mangnyang de bout en bout → dégâts affichés, exp/or gagnés
  (HUD), loot visible et ramassable, mob respawn après 15 s, MP décrémentés, skill
  en cooldown (UI grisée), aucune exception dans le render loop.

### PHASE 3 — Inventaire, équipement, items réels
1. Inventaire 45 slots (`InventoryPanel` Babylon existe — le remplacer par un panneau
   DOM cohérent avec le HUD si le GUI Babylon résiste, cf. historique rgba/ADT).
2. Items de `items.json` (21 529) : icônes = `iconPath` ddj → convertir le dossier
   `assets/pk2_media/icon` en PNG (mode ddj) et servir dans `/assets/icons/`.
3. Usage : potions HP/MP (effets réels), scrolls ; équipement : armes/armures avec
   stats réelles appliquées au combat (`EquipmentSystem` existe), visuel de l'arme
   sur le perso (slot GLB par item via manifest `resources[stem]`).
4. **NPC marchands** : 612 NPC officiels ; mapper les marchands de Jangan (shop tab
   en base déjà seedée) avec stock réel et prix (`price` des items).
- **Critères** : acheter 10 potions, les utiliser en combat (HP monte), équiper une
  lame → dégâts augmentés (chiffres prouvés), or dépensé persisté.

### PHASE 4 — Progression officielle
1. XP/SP par niveau = courbes officielles (`docs/SRO_KNOWLEDGE_BASE` + skilldata) ;
   répartition stats (STR/INT) et **masteries** CH/EU (modèle `CharacterMastery`
   en base, constantes `CHINESE_MASTERY_TREES` dans shared).
2. Level-up : effet visuel + points à répartir (UI DOM), montée de stats effective
   sur les formules de combat.
3. Quêtes tutorielles déjà seedées : les câbler (donner/rendre via NPC cible,
   récompenses).
- **Critères** : passage niveau 1→2 avec le bonus SP correct (comparer à la table
  officielle), répartition de points visible sur les dégâts.

### PHASE 5 — Multi-joueurs
1. Broadcast des positions (interpolation déjà présente : `EntityInterpolation`,
   `ClientPrediction`) ; les autres joueurs visibles avec leurs modèles/anims.
2. Concurrence serveur : verrous sur les mobs (tag d'aggro), dégâts attribués,
   loot instancié par joueur, chat general/zone (ChatManager existe), commandes
   slash basiques côté joueur (/who, /loc).
- **Critères** : deux fenêtres navigateur, deux persos se voient bouger en temps
  réel, combat partagé sur un même mob sans duplication de loot, message de chat
  transmis.

### PHASE 6 — SUITE ADMIN (GameMaster, mods, tweaks) ← exigence explicite
1. **Rôle GM** : colonne `role` sur `Account` (player/gm/admin) ; commande
   `/gm <login> promote|demote` réservée au premier compte (owner).
2. **Commandes chat GM** (parser serveur, effets autoritaires) :
   `/teleport x z | /tp <joueur>`, `/spawn <mob_stem> [n]` (spawn immédiat via
   SpawnManager), `/item <code> [qty]` (dans l'inventaire), `/level <n>`,
   `/gold <n>`, `/sp <n>`, `/kill` (cible), `/revive`, `/speed <mult>`,
   `/invisible`, `/god`, `/freeze <joueur>`, `/kick`, `/ban <login> [raison]`,
   `/announce <msg>` (bandeau global), `/mobinfo`, `/iteminfo <code>` (recherche
   floue dans GameDataService), `/whereis <joueur>`.
3. **Console Admin web** (`/admin` servi par Express du serveur, protégé par role) :
   dashboard temps réel (joueurs en ligne, mobs actifs, TPS serveur, mémoire),
   éditeur de taux **live** (XP/sp/drop/gold multipliers stockés en config Redis,
   appliqués à la volée — pas de reboot), spawner interactif (clic carte → spawn),
   navigateur d'items/monsters (les 21 529/7 825 avec icônes et stats),
   téléporteur de joueur, gestion sanctions (ban/mute avec durée), logs de combat
   récents (table `KillLog`).
4. **Tweaks serveur** : fichier `server/config/rates.ts` + overrides Redis :
   rates XP/SP/gold/drop, aggro on/off, respawn multiplier, maintenance mode
   (kick all + refuse login avec message), motd.
5. **Outils de dev in-game** (F12 panel DOM) : show FPS/draw calls, wireframe,
   teleport bookmark, spawn Favoris, inspect entité (stats serveur réelles).
- **Critères** : démo scriptée — GM spawn un Bandit lvl 16, se donne une arme,
  le tue, announce un message, bannit un compte de test, change le rate XP à la
  volée (prochaise kill ×10 prouvé), tout depuis `/admin` ET les commandes chat.

### PHASE 7 — Finitions (le « 100% » perçu)
1. **Minimap réelle** : les PNG `assets/pk2_media/minimap→convertis` existent —
   fond de la MinimapPanel avec la tuile de la région courante + point joueur
   orienté (le HUD DOM l'accueille).
2. **Mort/aggro des monstres** : anim `damage01`, barre de vie cible fluide,
   nom+level au-dessus (linkWithMesh OK pour labels ADT ou DOM projeté).
3. Audio : sons de coups/ambiance depuis `assets/pk2_data/prim/snd` (wav) et
   musique `Music.pk2` (extraire + playlist zone). Optionnel mais valorisé.
4. Perf : LOD/`freezeWorldMatrix` sur bâtiments, octree scène si FPS < 50 en ville,
   culling anims hors champ. Écran de chargement avec progression réelle.
5. Stabilité : aucun `console.error` en jeu normal ; reconnexion auto Socket.io ;
   le serveur survit à 3 clients + GM simultanés.
- **Critères** : bande-son jouée en ville, minimap suit le joueur, 60 FPS en ville
  avec 2 clients, zéro erreur console sur 5 minutes de jeu filmé.

---

## 3. RÈGLES D'INGÉNIERIE (non négociables)

1. **Sources de vérité locales d'abord** : toute donnée de jeu (item/skill/mob/map/
   anim/texture) provient du client officiel extrait via les scripts existants.
   Recherches web uniquement pour : protocole (SilkroadDoc), formules manquantes,
   comportements (OpenSRO/Skrillax en lecture). **Ne jamais copier de code AGPL**
   dans ce dépôt MIT ; ne jamais committer les assets extraits (déjà gitignorés).
2. **Serveur autoritaire** : le client propose (clic, skill), le serveur décide
   (dégâts, loot, position corrigée). Aucune stat de combat calculée côté client.
3. **Tolérance aux pannes** : chaque chargement d'asset est résilient (pattern
   `loadMultiPartGlb` : une partie cassée n'annule pas la ressource) ; chaque
   handler Socket.io est try/catché avec log ; la boucle de rendu ne doit jamais
   lever (le moindre `material.X is not a function` a déjà tuu le rendu — cf.
   historique `box.material = box`).
4. **TypeScript vert** : `npx tsc --noEmit` côté serveur doit rester à 0 erreur ;
   côté client, nettoyer au fil de l'eau (126 erreurs historiques drift Babylon 8).
5. **Commits** : un commit par phase fonctionnelle, message français impératif.
6. **Pas de régression** : re-vérifier les 4 piliers déjà validés après chaque phase
   (perso visible/centré, click-to-move+anims, caméra orbite/zoom/plongée,
   terrain+ville officiels à 60 FPS).

---

## 4. INVENTAIRE DES COMMANDES & POINTS D'ENTRÉE (mémo exécutable)

```bash
# Démarrage
docker compose up -d postgres redis
cd server && npm run dev        # :3001 (env dans server/.env, PG sur 5544)
cd client && npm run dev        # :3000

# Pipelines d'assets (sources : assets/pk2_*)
tools/veykril-pk2/target/release/pk2_mate.exe extract --archive "<pk2>" --out <dir>
tools/rust-jmx-converter/target/release/jmx_converter.exe --input assets/pk2_data --output client/public/assets/glb_blender            # BMS→GLB skinés
tools/rust-jmx-converter/target/release/jmx_converter.exe --input <dossier_ddj> --output <out> --mode ddj                               # DDJ→PNG
ban-re/target/release/ban2json.exe --dir assets/pk2_data/prim/ani client/public/assets/anims                                          # BAN→JSON

# Données de jeu (server/)
npx tsx scripts/import-textdata.ts                    # tables officielles → data/game/*.json
npx tsx scripts/generate-asset-manifest.ts            # manifest ressources+textures
npx tsx scripts/extract-region-heightmaps.ts 63 65 75 77   # relief+tilemaps (grille Jangan)
npx tsx scripts/parse-map-objects.ts 69 71 3          # placements bâtiments
npx tsx scripts/seed-real-monsters.ts                 # 13 mobs officiels en base
```

**Points d'entrée client** : `Game.ts` (caméra/clic/normalisation), `JanganZone.ts`
(terrain/ville/spawn sûr), `RealTerrain.ts`, `WorldObjects.ts`, `AssetLoader.ts`
(`loadGameObject`/`loadMultiPartGlb`), `BanAnimationService.ts`, `DomHud.ts`,
`NetworkManager.ts`, `CharacterManager.ts`.
**Points d'entrée serveur** : `index.ts` (Express+Socket.io — y ajouter `/admin`),
`core/GameServer.ts` (boucle 20 Hz, GameDataService), `network/SystemHandlers.ts`
(y ajouter les handlers auth/skills/chat GM), `combat/`, `drop/`, `ai/SpawnManager.ts`,
`quest/`, `prisma/schema.prisma` (y ajouter `Account.role`, tables admin/log).
**Doc interne** : `RECHERCHE.md` (liens/protocole/formats), `Avancement.md`
(historique complet des 7 sessions), `docs/SRO_KNOWLEDGE_BASE/` (formules de jeu).

---

## 5. DÉFINITION DE « 100 % » (audit final exigé)

Le jeu est terminé quand TOUT ceci est démontré en une session de test filmée :
1. Création compte+perso → spawn Jangan, déplacement clic, caméra complète.
2. Combat : ciblage, 3 skills différents (cooldowns, MP), mort du mob, loot, respawn.
3. Montée niveau 2, stats réparties, effet mesuré sur dégâts.
4. Achat potion chez marchand, usage en combat, équipement d'une arme (visuel + stats).
5. Deux clients : joueurs mutuellement visibles, chat, mob partagé.
6. GM : `/admin` + commandes chat (spawn/item/teleport/ban/announce/rates live).
7. Perso toujours visible et centré, 60 FPS en ville, zéro erreur console.
8. `tsc --noEmit` serveur = 0 erreur ; données persistées après relance serveur.

En cas de blocage : consulter `Avancement.md` § sessions 1-7 (chaque piège connu
y est documenté avec sa solution), puis recherches ciblées SilkroadDoc/srodevs-docs.
