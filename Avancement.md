# Avancement du Projet SRObro

## Session du 1er Octobre 2026 (8/8) : AUDIT & CONSOLIDATION DES FONDATIONS

Audit complet (4 sous-systèmes en parallèle) puis corrections par priorité.
**Vérifié en jeu après corrections : 60 FPS stables (2559 meshes, 40 anims),
zéro erreur console serveur, caméra alignée à 0° sur le perso, terrain texturé
(variance 32), spawn Jangan, tsc 0 erreur client ET serveur, build Vite OK.**

### Serveur — logique et câblage (le monde était FIGÉ)
- **Boucle de tick démarrée** : `gameLoop.start()` dans `initialize()` (aucune
  boucle ne tournait !). Double mécanisme supprimé (GameLoop + setInterval) ;
  tick à 20 Hz protégé par try/catch (un crash de tick ne tue plus le process).
- **SpawnManager câblé** : `globalSpawnManager.initialize()+start()` au boot
  (26 points de spawn chargés), `WorldManager.monsterEntities` partage sa map.
  Résurrection interne des monstres supprimée (le SpawnManager est l'unique
  propriétaire: mort → despawn 3 s → nouveau spawn si joueurs à 100 m).
- **Combat réellement effectif** : les HP calculés par CombatManager sont
  réécrits sur les entités (`setHp`) — avant, les monstres ne perdaient
  jamais de HP. Validations d'attaque ajoutées : cible vivante, portée
  (max(attackRange×3, 15 m)), anti-spam 400 ms.
- **Unités de temps normalisées** (le tick fournit des SECONDES) : régénération
  HP/MP avec accumulateurs fractionnaires (était ÷1000 + floor → toujours 0),
  vitesse des monstres `moveSpeed × dt` (était ÷1000 → quasi immobiles).
- **Grille spatiale corrigée** : séparateur de cellule `,` au lieu de `-`
  (les coordonnées négatives produisaient "-1--2" → mauvaise cellule →
  AOI/aggro faux sur la moitié du monde).
- **Déconnexion complète** : sauvegarde + retrait du monde, hotkeys et casts
  purgés, autosave stoppé (`destroy()`), `isOnline: false`.
- **Sécurité** : `SystemHandlers` dérive l'identité de la session authentifiée
  (plus aucun characterId/guildId d'acteur trusté du payload) ;
  `quest:update_objective` supprimé (progression serveur uniquement) ;
  `completeQuest` vérifie statut in_progress + objectifs remplis ;
  invitations de guilde enregistrées et vérifiées ; stockage de guilde
  réservé aux membres ; guildId dérivé du personnage pour les forteresses.
- **Prisma unique** : 4 `new PrismaClient()` locaux (guild/fortress/quest/
  mount) remplacés par le singleton `database/prisma` + `$disconnect()` au
  shutdown ; handlers `unhandledRejection`/`uncaughtException` ajoutés ;
  timers de fond try/catchés (+ `.unref()`) ; index clients par characterId
  (les diffusions AOI arrivaient dans le vide) ; `sendToClient` du
  WorldManager routé vers les sockets réels.
- Divers : multi-level-up (`while`), skillPoints/statPoints lus de la base,
  anti double-spawn (`isChecking`), réindexation spatiale des monstres en
  mouvement, SpatialManager mort (`game/`) et fichier `server/1` supprimés.

### Client — stabilité et performances
- **3 `require()` ESM supprimés** (CombatSystem, MonsterHealthBar,
  GLModelLoader) : la première attaque réussie tuait la render loop.
- **Render loop protégée** (try/catch + compteur, stop après 30 erreurs),
  race des animations walk/idle corrigée (token de génération).
- **`InputManager`** : blur corrigé (`this.keys` → `this.state`, TypeError à
  chaque Alt-Tab), dispose depuis `window` (les listeners fuyaient).
- **Caméra** : raycast de collision mémoïsé (seulement si orbite/zoom/cible
  ont bougé), prédicat réordonné (tests bon marché d'abord), zéro allocation
  par frame (vecteurs pré-alloués, LerpToRef), observateur/listeners retirés
  au dispose, far plane 12000 (skybox enfin visible).
- **Assets** : matériaux/textures partagés par URL (15 instances d'un bâtiment
  = 1 texture GPU au lieu de 15), chargements GLB en vol dédupliqués,
  `cloneMaterials=false` (finit les matériaux orphelins), aliasing
  `root.position`/`firstMesh.position` supprimé (bâtiments décalés en double),
  "proto" fantôme de WorldObjects éliminé, world matrices des bâtiments
  gelées (~1500 meshes), `dispose()` complet.
- **Tue-FPS éliminés** (trouvés en test réel : 60 → 3 FPS au premier clic) :
  warns console par frame de l'auto-attaque, scan des 2559 meshes par frame
  dans `getPlayerPosition` (cache), logs par frame (déplacement, keydown),
  warn réseau par frame (taire après le 1er, sendMove throttlé 10 Hz).
- **Zone procédurale doublon supprimée** (`worldManager.loadZone` superposait
  sol 2000² + 50 arbres + 30 rochers + skybox à JanganZone) ; monstres
  placeholders posés sur le relief (y=0 → heightAt) ; projection 3D→écran
  des dégâts corrigée (Matrix.Identity + viewport global) ; dispose de Game
  complet (caméra, boucle, ordre scène/systèmes).
- **TypeScript vert** : 110+ erreurs → **0** (`tsc --noEmit` client et
  serveur). Fichiers morts supprimés : SceneBuilder, Engine, TextureManager,
  AssetViewer, systems/AnimationManager, systems/MapLoader. Corrections de
  types dans UIManager, panels GUI (ComboBox inexistant, spacing numérique,
  buttonIndex, EntityType enum…).

---

## Session du 1er Octobre 2026 (7/7) : CAMÉRA JOUABLE (retours utilisateur)

- **Perso décentré corrigé**: la cible caméra est resynchronisée quand le
  modèle remplace le placeholder (la caméra suivait un noeud périmé).
  Vérifié: angle vue↔perso = **0,0°** (parfaitement centré).
- **Vue plongeante**: convention MMO (glisser BAS = caméra monte, HAUT = rasante),
  plage de pitch −0.25 → 1.52 rad. Vérifié: camY +11 m après drag bas.
- **Zoom permissif**: multiplicatif (×1.15/cran), bornes **1,5 → 150 m**.
- **Collision caméra intelligente**: les contacts < 0,9 m (rayon démarrant
  dans un mesh: couture de terrain, corps du perso) sont ignorés — finie la
  caméra écrasée à 1 m du crâne. Bâtiments rendus collisionnables.
- **Orbite fiabilisée**: événements pointer + capture du pointeur (le drag
  continue hors canvas).
- **Spawn**: évite les coutures de régions (±10 m) et les bâtiments (25 m).

---

## Session du 1er Octobre 2026 (6/6) : JOUABILITÉ — CAMÉRA, DÉPLACEMENT, VISIBILITÉ

- **Squelettes des personnages réparés** : `find_skeleton` résout désormais le
  squelette unique partagé (`prim/skel/char/china/chinaman_skel.bsk`, 39 os)
  pour toutes les parties `man_*`/`woman_*` → le perso complet est skiné.
- **Recalage du personnage** (`normalizePlayerScale`): échelle normalisée à
  **1,8 m exactement**, pieds posés au sol (l'origine du squelette SRO est en
  hauteur), réappliqué automatiquement quand le modèle remplace le placeholder.
  Vérifié: bbox [0.00, 1.80], 9/9 parties dans le frustum.
- **Caméra troisième personne orbitale** (`ThirdPersonCamera`) enfin branchée:
  **clic droit = rotation**, **molette = zoom** (4-60 m), suivi lissé du perso,
  visée à hauteur de tête. Vérifié: zoom 19→65 m, orbite latérale.
- **Click-to-move** (`Game.setupClickToMove`/`updateClickToMove`): clic gauche
  sur le terrain → le perso s'y rend (5 m/s), orienté vers sa direction, posé
  sur le relief, avec **bascule automatique walk/idle** des animations
  officielles (9 groupes en syntonie). Vérifié: cycle complet
  clic → marche animée → arrivée → idle.
- **Spawn sûr** (`getSafeSpawnPoint`): spirale de recherche autour du spawn
  configuré jusqu'à trouver une position sans bâtiment à 14 m (fini le mur).

---

## Session du 1er Octobre 2026 (5/5) : ANIMATIONS OFFICIELLES + SKYBOX

- **Parseur BAN réécrit** (`ban-re/src/parser.rs`) selon la spec JMXVBAN publique
  (header: nom, durée ms, fps, type cyclique ; table des temps ; os séquentiels ;
  keyframes 28 octets quat+vec3). Nouveau binaire **`ban2json`** :
  **4 304 animations officielles converties** en JSON (`client/public/assets/anims/`,
  chemins conservés: mob/china/mangnyang_walk.json, char/china/man/...).
- **Squelettes embarqués dans les GLB** : l'exporteur Rust écrit désormais les
  skins glTF complets depuis les .bsk (nodes hiérarchiques Bip01, matrices locales,
  inverse bind matrices, résolution du squelette partagé `prim/skel/` vs parties
  `_partN`) → **1 501 GLB skinés**.
- **AnimationService client** (`client/src/animation/BanAnimationService.ts`) :
  clips BAN → AnimationGroups Babylon (os appariés par nom), lecture bouclée.
  Monstres: cycle `walk` à l'apparition; personnage: `standcity` (attente).
  **Preuve en scène: 216 squelettes, 40 groupes en lecture, quaternions des os
  Bip01 Spine2/R UpperArm variant dans le temps** — le monde est vivant.
- **Skybox officiel** : textures `Map.pk2/skybox` converties (cloud1 PNG + BMP
  pour les non-DXT) → cube infini dans `setupEnvironment`.

---

## Session du 1er Octobre 2026 (4/4) : TEXTURES DE TERRAIN OFFICIELLES + MAPO EXACT

- **Index de textures** : `Map.pk2/tile2d.ifo` (719 entrées TextureID → fichier ddj)
  parsé → `tile-index.json` ; **752 textures de tuile converties en PNG** (0 échec).
- **Tilemaps NVM** : extraction du champ TextureID u16 de chaque tuile 96×96
  (8 octets/tuile: CellID+Flag+TextureID) → `<x>_<z>.tiles` pour les 110 régions.
  Validation: la région du spawn est pavée de `c_marble_jang_*` (marbre de Jangan ✓).
- **RealTerrain réécrit** : par région, les quads sont **groupés par texture** →
  1 325 meshes terrain, 107 matériaux de tuiles officielles, relief réel conservé
  (4 M vertex). Preuve par pixels: variance du sol ±50 (texturé) vs ±0-3 avant.
- **Format MAPO décodé exactement** (28 octets):
  `[u32 assetId][f32 xyz][u16 0xFFFF][f32 yaw radians][u16 uid][u16][u8][u8]`
  + extensions de 8 octets ; validation stricte (marqueur 0xFFFF + yaw plausible)
  → **864 placements au mètre près, 0 suspects** (ex: `cj_mili_horse01` à
  (362.95, -775.34) yaw -90° — positions décimales et orientations cardinales).

---

## Session du 1er Octobre 2026 (3/3) : BÂTIMENTS OFFICIELS DE JANGAN

- **Localisation de la vraie ville** : scan des 6 178 navmesh + corrélation avec les
  placements `.o` → Jangan = régions navmesh **69-70 × 69-73** (cœur plat à (69,71)).
  L'ancre monde est passée de (35,39) à **(69,71)**, 110 heightmaps ré-extraits.
- **Parseur MAPO** (`server/scripts/parse-map-objects.ts`) : table `object.ifo`
  (AssetID→BSR, 3 307 modèles) + scan glissant des enregistrements 24 octets des
  `Map.pk2/<X>/<Z>.o` → **1 466 placements** dans objects.json (bâtiments `cj_*`,
  temples, palais, camps, nature), filtrés sur les GLB disponibles.
- **WorldObjects** (`client/src/zones/jangan/WorldObjects.ts`) : instancie les
  bâtiments officiels avec textures (budget 200 objets, max 15/modèle, rayon 2 600 m,
  ferry exclu), **posés sur le relief** via `terrain.heightAt()`.
  → **1 534 meshes de bâtiments** en scène, 60 FPS.
- Spawn/caméra déplacés au centre-ville (0, 500), anneaux de monstres décalés en conséquence.
- **Limite connue** : la précision du parse glissant MAPO quantifie les positions aux
  coins de régions (±1920) — un parse exact du format (champs optionnels échelle/yaw)
  affinerait le placement rue par rue.

---

## Session du 1er Octobre 2026 (2/2) : VRAIS GRAPHISMES INTÉGRÉS

Monstres, personnage et terrain utilisent désormais **les graphismes officiels du client** :

### Textures (pipeline complet)
- `jmx_converter --mode ddj` : **14 627 DDJ → PNG** (crate image, DXT1/3/5).
- `scripts/convert-ddj-bmp.ts` : **193 DDS RGB non-compressés → BMP** (minimap des villes).
- Manifest régénéré avec **6 910 ressources texturées** (parseur BMT Node + résolution
  des références de textures relatives aux dossiers BSR/BMT).

### Modèles (2 bugs du convertisseur corrigés)
- **Accessor counts** JOINTS_0/WEIGHTS_0 : `weights.len()*4` → `weights.len()` (VEC4/sommet).
- **Alignement chunk JSON du GLB** : la longueur du chunk inclut désormais le padding
  (Babylon place le chunk binaire sans réaligner → RangeError avant le fix).
- **Personnage** : assemblage officiel `chinaman_adventurer` — 9 parties (visage, cheveux,
  bras, jambes, torse, bassin) chacune avec sa texture (`CharacterManager.loadCharacterModel`).
- **Monstres** : GLB skinés multi-parties + textures officielles par partie
  (`AssetLoader.loadMultiPartGlb`), 275 matériaux texturés vérifiés en scène.
- Chargement **résilient** : une partie illisible ne casse plus la ressource.

### Terrain réel (heightmaps officiels .nvm)
- `scripts/extract-region-heightmaps.ts` : heightmap 97×97 f32 par région depuis
  `Data.pk2/navmesh/nv_*.nvm` (offset: `taille - 37816`, spec JMXVNVM publique).
- **131 régions** autour de Jangan (grille 30-40 × 32-48), 4,8 M vertex,
  relief coloré par altitude, ville plate ancrée à l'origine (`RealTerrain.ANCHOR = 35x39`).
- `RealTerrain.heightAt()` place les monstres sur le relief.

### Corrections de la session (1/2 rappel)
- Crash rendu `box.material = box` (placeholder), touches bloquées (handler `blur`),
  monde recentré sur l'origine, HUD DOM overlay complet, rgba() sans espaces
  (parseur couleurs Babylon), 13 monstres officiels seedés en base.

### Reste à faire (graphismes)
- Bâtiments de la ville : les placements sont dans `Map.pk2/<region>/*.o` (MAPO binaire)
  + `objectstring.ifo` (textuel, 384 grandes structures).
- Textures de terrain par tuile (tilemap TextureID → Tile2D.ifo).
- Skybox, animations `.ban` sur les squelettes.

---

## Session du 1er Octobre 2026 (1/2) : remise en route complète

**Le jeu tourne de bout en bout sur cette machine** : serveur Node (port 3001) + client
BabylonJS (port 3000), base PostgreSQL/Redis Docker (port hôte **5544**), et rendu 3D
vérifié dans le navigateur (terrain + personnage + monstres NPC, état "niveau de test").

### ✅ Travaux terminés (session du jour)

#### 1. Infrastructure réparée (transfert de machine)
- **Dépendances** : `npm install` racine + client + server + shared.
- **Docker** : Postgres mappé sur **5544** (un PostgreSQL local occupe le 5432/5433) ;
  volume recréé ; `docker-compose.yml` mis à jour ; `server/.env` créé.
- **Prisma** : client régénéré, schéma poussé, **seed complet** (quêtes, forteresses,
  NPC, spawns, téléports). Bugs de seed corrigés (enum MasteryTree en casse, champs
  Quest manquants `description`/`timeLimitSec`, BigInt→Number pour les colonnes Json).
- **Serveur** : les 122 erreurs TypeScript corrigées (0 erreur). Bug runtime `sql.ts`
  corrigé (`query()` retourne désormais un vrai `{rows, rowCount}` ; `transaction()`
  donne un client query fonctionnel). Bug `createUnion` (variable inexistante) corrigé.

#### 2. Pipeline d'assets complet (le vrai client comme source)
- `tools/veykril-pk2` (MIT) cloné/compilé → extraction PK2 fonctionnelle :
  - **Media.pk2** → `assets/pk2_media` (29 292 fichiers)
  - **Data.pk2** → `assets/pk2_data` (64 861 fichiers, 18 725 meshes .bms)
  - **Map.pk2** → `assets/pk2_map` (19 587 fichiers par région)
- `tools/rust-jmx-converter` compilé → **17 312 GLB régénérés en 12 s** dans
  `client/public/assets/glb_blender` (le dossier avait été perdu, non versionné).
- `client/public/assets/` restauré depuis `assets.old_no_skinning` (99 055 fichiers,
  manifest.json + mappings.json inclus).

#### 3. Données de jeu officielles importées
- **`server/scripts/import-textdata.ts`** : parse les TSV UTF-16LE de Media.pk2,
  suit les loaders, résout les noms via `textdata_object_*.txt` (clé SN_ en col. 3).
- Colonnes **vérifiées empiriquement** (MANGNYANG lvl 1 : HP 24, exp 54, atk 7-10 ✓).
- Sortie `server/data/game/` : **21 529 items, 7 825 monstres, 612 NPC, 36 008 skills**.
- **`server/src/data/GameDataService.ts`** : chargé au boot du GameServer, lookups
  par id/code + `getMonsterTemplate()` prêt à nourrir MonsterEntity avec les vraies stats.

### 🚀 Pour démarrer
```bash
docker compose up -d postgres redis          # DB (Postgres sur le port hôte 5544)
cd server && npm run dev                     # serveur :3001
cd client && npm run dev                     # client :3000
```
Importer/rafraîchir les données : `cd server && npx tsx scripts/import-textdata.ts`

### 🛠️ Prochaines étapes (voir RECHERCHE.md §5 pour le détail)
1. **Brancher les vraies stats** : SpawnManager → GameDataService.getMonsterTemplate()
   pour remplacer les 5 types de monstres seedés par les vrais (code `MOB_*`, bsr réel).
2. **Spawns réels** : parser les `.ifo` de Map.pk2 (placements objets/NPC par région).
3. **Navmesh** : parser les `.nvm` de Data.pk2 (spec publique très bonne).
4. **Textures** : convertir les `.ddj` → DDS/PNG (le convertisseur Rust a déjà la crate `image`).
5. **Skills** : compléter le mapping des 118 colonnes de skilldata (cooldown, MP, effets).
6. **UI** : réactiver les panels (l'UI ne s'affiche pas encore au boot).
7. Mode MMO : dé-commenter `network.connect()` dans `client/src/main.ts:83`.

### ⚠️ Dettes signalées (à traiter)
- `GameServer` a une double boucle de tick (GameLoop + setInterval).
- Plusieurs `new PrismaClient()` éparpillés (forteresse/guilde/quest/mount).
- `SystemHandlers` fait confiance au `characterId` envoyé par le client.
- 126 erreurs TS côté **client** (drift BabylonJS 8) — non bloquantes sous Vite mais à nettoyer.

---

## Historique : État au 20 Janvier 2026

Le projet a été stabilisé et assaini. La structure monorepo est maintenant cohérente et
la majorité des erreurs de compilation bloquantes ont été résolues : migration Babylon.js 8,
types partagés en Enums, GameLoop restauré, ports client/serveur alignés.

---

## Session du 1er Octobre 2026 (3/2) : PHASE 1 — Authentification complète

**Le jeu est désormais réseau de bout en bout** (connexion Socket.io obligatoire,
mode hors-ligne explicite de repli).

### Serveur
- `AuthHandlers.ts` : register (bcrypt, 1er compte = admin), login (token session
  7 j en base, contrôle bannissement), resume par token, logout, character:
  list/create/select/delete (vérif appartenance, nom unique 3-12, max 4/compte).
- Schéma : `Account.role` (player/gm/admin), `Character.gender`.
- `Client` : auth compte (authenticateAccount/clearAuthentication) distincte du
  chargement de perso ; index ClientManager mis à jour (changement de perso).
- Bugs corrigés : double emballage des packets dans `GameServer.handlePacket`
  (packet.data.data → undefined), heartbeat 10 s (le timeout d'inactivité 30 s
  déconnectait le client pendant le chargement du monde).

### Client
- `AuthScreen.ts` : overlay DOM style Silkroad (login/inscription/liste persos/
  création race+genre/suppression, erreurs inline, reprise de session localStorage).
- `main.ts` : boot réseau → auth → `game.initialize(serverCharacter)` ; repli
  hors-ligne explicite.
- `Game.ts` : spawn à la position SERVEUR (dernière sauvegarde), modèle selon
  genre (chinawoman_adventurer pour F), envoi move throttlé 200 ms, HUD réel
  (nom/or), déconnexion réseau ne tue plus le rendu.

### Deux bugs de rendu majeurs trouvés et corrigés (non liés à l'auth)
1. **Terrain invisible** : les heightmaps régénérées (17h32) ont un ordre de
   lignes inversé → winding des triangles inversé → backface culling supprimait
   TOUT le sol. Preuve : tuile isolée rend en wireframe mais pas en solide.
   Fix : `backFaceCulling = false` sur les matériaux de tuile (RealTerrain).
2. **Clic-pour-bouger cassé** : `scene.cameraToUseForPointers` restait sur la
   FreeCamera de boot → les picks (clic, ciblage) atterrissaient près du spawn
   d'origine. Fix : assignée à la caméra 3e personne au start.
- Éclairage renforcé (textures DDJ converties sombres — gamma à corriger en
  phase 7).

### Preuves (§0.3)
- Script `test-auth-flow.ts` : 12/12 (inscription, doublons, mauvais mdp, token,
  position persistée 42.5/512.25 après re-login, sécurité cross-compte).
- Navigateur : compte « arnaud » créé via l'UI, perso « Kaiser » (CH/M), re-login
  → respawn exact (39.5, 499.1), marche 39 m cliquée → autosave 30 s → reload →
  respawn à la position marchée. 60 FPS, connecté, 0 erreur console.

---

## Session du 1er Octobre 2026 (4/2) : PHASE 2 — Boucle de combat complète

**Combat serveur-autoritaire de bout en bout** (script 13/13 + navigateur).

### Serveur
- `CombatBridge.ts` : colle SpawnManager (IA) ↔ CombatManager (dégâts) ↔ DropManager
  (loot) ↔ PlayerEntity (XP/or) ↔ réseau. Snapshot monde à la connexion ET à la
  demande (`world:snapshot` — le client charge le monde des minutes durant).
- Skills phase 2: 3 attaques (codes officiels skilldata, paramètres réalistes),
  cooldown/MP/anti-spam serveur + packets `skill_rejected` explicites.
- Récompenses: XP/SP/or (taux `config/rates.ts`, futurs overrides Redis phase 6),
  KillLog en base, loot depuis la table MonsterDrop.
- Mort joueur: écran de résurrection (ville gratuite / sur place −2% XP),
  packets player:death/respawned.
- Fixes critiques:
  - **Monde gelé**: `MonsterEntity.performAttack` crashait le tick quand la
    cible était une entité détruite → try-catch par monstre + libération
    d'aggro au logout du joueur.
  - **Spawn retardé**: premier cycle de spawn attendait un respawnTime complet
    → `lastSpawnCheck` échu au chargement + `forceCheckNearby(position)` à
    l'arrivée/déplacement (>60 m) d'un joueur.
  - Spawn points DB recâblés sur les anneaux client (ville (0,500), 13 camps).
- Broadcast `attack` enrichi de `remainingHp` (barres de vie client).

### Client
- `NetworkCombat.ts` : monstres serveur rendus avec les modèles officiels
  (multi-parties + anims BAN par état), **proxy de picking invisible** (les
  meshes skinées se pickent en bind pose — bug Babylon classique), ciblage clic,
  auto-attaque ~1/s, skills touches 1-3 avec cooldown local + messages chat,
  nombres de dégâts, HUD piloté par `player:state`, écran de mort DOM, loot au
  sol cliquable.
- Perf: anims chargées **par transition d'état** (pas par packet update —
  sinon fetch+groups ×45/s = 9 FPS). 60 FPS avec 28 monstres officiels.
- JanganZone: monstres locaux désactivés en mode réseau.

### Preuves
- `server/scripts/test-combat-flow.ts` **13/13**: spawns reçus, dégâts
  (26-34), kill Mangnyang +54 XP (valeur officielle), or +9-12, MP 100→95,
  cooldown rejeté, respawn 15 s, aggro bandits, mort joueur, résurrection.
- Navigateur: Kaiser cible un Mangnyang (clic réel), skill « Frappe », kill,
  chat « +54 XP », HUD 108 XP / 10011 or, mob respawn, 60 FPS.

---

## Session du 1er Octobre 2026 (5/2) : PHASE 3 — Inventaire, items, boutique

### Convertisseur d'icônes (fix majeur)
- Icônes SRO = DDS **non compressé 16/32 bpp** (A1R5G5B5, masques génériques)
  que la crate `image` ne décode pas → décodage manuel par masques dans
  `jmx_converter --mode ddj`. **7 893/7 893 icônes converties** (fiole HP
  vérifiée visuellement, alpha propre).

### Données items corrigées
- Colonnes itemdata vérifiées empiriquement: **prix = col 26** (potion 60,
  lame degré 1 = 890 or — la col 13 est une constante), types = cols 9-12,
  **attaque min/max = cols 95/96** (BLADE_01 21/22 → BLADE_10 1452/1542),
  restauration potions = col 57. items.json + import DB régénérés (21 529).
- Défense monstres : la valeur seedée (27 pour un lvl 1) annihilait les
  dégâts → courbe def = 2 + niveau×2 (Mangnyang 4, Bandit 34).

### Serveur
- `ItemHandlers.ts`: inventaire 45 slots (list/use/equip/unequip), potions
  (cooldown 2 s, effet réel HP/MP), équipement avec **stats officielles
  appliquées au combat** (PlayerEntity.applyWeaponStats), kit de départ
  (10 potions HP + 5 MP + lame), boutique (achat prix officiels, vente au
  tiers), MonsterDrop seedée (26 lignes potions).
- Arme équipée rechargée à la sélection de perso (stats persistées).
- Fix: l'attaquant reçoit maintenant SES packets d'attaque
  (broadcastToNearbyClients l'excluait — dégâts invisibles côté client).
- Fix: monstres fantômes après reconnexion — purge client au 'connected'.

### Client
- `InventoryPanel.ts`: panneau DOM 45 slots (touche I), **icônes officielles**,
  tooltips avec stats, clic = utiliser/équiper, Maj+clic = vendre, colonne
  équipement. Boutique (touche B): liste marchand, achat ×1/×10.
- Reconnexion Socket.io infinie + **ré-authentification automatique** (token
  + re-sélection du perso + re-snapshot monde) après redémarrage serveur.
- Visuel d'arme: GLB officiel attaché au perso sur équipement.
- Résurrection: téléportation du mesh client à la position de respawn.

### Preuves (navigateur)
- Achat 10 potions HP débutant (1 or) + lame BLADE_01_A_DEF: or 10 020 → 10 009.
- Inventaire: 3 slots remplis avec icônes, tooltip « Attaque 21 ~ 22 ».
- Équipement lame: colonne « Arme » + message chat.
- 32 attaques capturées (formule atk−def), kill Mangnyang +54 XP, or +11.
- Mort → écran de résurrection → ville: HP restaurés, « Résurrection réussie ».
- Reconnexion auto après restart serveur: session ré-authentifiée, monstres
  re-synchronisés, combat repris — Kaiser niveau 4 en fin de session.

---

## Session du 1er Octobre 2026 (6/2) : PHASE 4 — Progression officielle

### Courbe XP officielle (4a)
- `shared/src/xpcurve.ts`: table complète extraite de
  `leveldata.txt` (colonne 2, 150 niveaux — lvl 1→2 = 118 XP, seuils cumulés).
- `PlayerEntity.getExpNeededForLevel` + `CombatBridge.sendPlayerState`
  utilisent les seuils officiels (`levelBaseExp`/`nextLevelExp` cumulés);
  le HUD affiche la progression dans le niveau courant.

### Stats & masteries (4b, 4c)
- `character:allocate`: répartition STR/INT serveur-autoritaire (persistée);
  la STR ajoute +1 dégât par tranche de 10 à l'arme équipée
  (`PlayerEntity.recalculateAttackPower`) → effet mesurable immédiat.
- `character:masteries` / `mastery:levelup`: arbres CH (7) / EU (6) depuis la
  table Mastery, coût SP croissant (2n²), cap = niveau du perso, persistance
  CharacterMastery.
- Client `CharacterPanel.ts` (touche C): STR/INT + boutons +, attaque
  affichée, 7 maîtrises avec coûts SP et montée au clic.

### Quêtes (4d)
- Colle `CombatBridge.trackQuestKills` (objectifs kill auto-avancés) +
  `handleNpcInteract` (proximité 30 m, objectifs talk, rendu au PNJ,
  vérification anti-exploit du QuestManager conservée).
- `questCompleted` (event) → récompenses créditées à l'ENTITÉ vivante (le
  QuestManager n'écrivait qu'en base — l'autosave les aurait écrasées).
- NPC déplacés en ville (x −35..35, z 505-510) + `npc_jangan_guard` ajouté;
  rendus client (bornes cliquables), `npc:list`/`quest:interact`/acks sur les
  handlers quête.

### Preuves
- `scripts/test-phase4.ts` **18/18**: seuil 118 officiel, niveau 2 à 162 XP,
  SP 27, statPoints 3, STR 21 → atk 35→38 (mesuré), Bicheon 1-2 + cap,
  quête Welcome acceptée/rendue au garde (dialogue), +1000 XP → 1162,
  « First Steps » débloquée.
- Navigateur: 7 PNJ rendus, journal L (3 quêtes), panneau C (STR, 7
  maîtrises), 60 FPS.

---

## Session du 1er Octobre 2026 (7/2) : PHASE 5 — Multi-joueurs

### Visibilité mutuelle
- `syncPlayerVisibility` (CombatBridge): à chaque joueur qui rejoint, spawn_player
  croisé aux joueurs < 200 m; playerLeft → despawn. Le world:snapshot inclut
  maintenant AUSSI les joueurs proches (le client charge des minutes durant,
  les spawn initiaux seraient perdus).
- Client: rendu des joueurs distants (modèle officiel chinaman/chinawoman selon
  gender, anim walk sur update, annonce chat « X est en ligne »), purge à la
  reconnexion.

### Chat + commandes
- Entrée de saisie dans le HUD (Entrée ouvre/valide, Échap ferme), canal
  general diffusé en zone; commandes slash serveur **/who** (joueurs en ligne)
  et **/loc** (position) en réponse système privée.

### Loot concurrentiel
- Drops étiquetés propriétaire (tueur, 30 s): l'autre joueur reçoit
  « Item is owned by another player ». Fixes DropManager: convention de
  paramètres query() (tableau vs variadique), cast jsonb, id généré côté SQL
  (drop ET pickup) — le loot ne fonctionnait plus du tout.

### Sessions par onglet
- Token + characterId en **sessionStorage** (isolé par onglet): deux comptes
  jouables simultanément dans le même navigateur (le localStorage partagé
  faisait s'éjecter les onglets mutuellement).
- characterId persisté (ré-authentification après reconnexion fiable) et
  filet de sécurité: socket mort sans reconnexion → nouvelle connexion après
  12 s.

### Preuves
- `scripts/test-phase5.ts` **10/10** (deux sockets simultanés): visibilité
  croisée, updates de déplacement, chat A→B, /who, /loc, mob partagé (un seul
  set de loot), propriété du drop (B refusé, A ramasse).
- Navigateur (2 onglets): Kaiser et Visiteuse se voient (modèles officiels),
  position de Kaiser propagée en direct (0→19,4 vue identique au réel),
  « Visiteuse: Salut Kaiser ! » reçu chez Kaiser.

---

## Session du 1er Octobre 2026 (8/2) : PHASE 6 — Suite Admin

### Commandes chat GM (~22, rôle Account.role gm/admin requis)
`/help /tp(=/teleport) /spawn /item /iteminfo /level /gold /sp /kill /revive
/speed /invisible /god /freeze /kick /ban /unban /announce /mobinfo /whereis
/rates /gm promote|demote` — dispatché par WorldManager.handleChatPacket avant
les commandes joueur; refus « réservée aux GM » pour un compte lambda.
- **Effets réels**: god (aucun dégât IA), invisible (despawn + exclus du
  snapshot/ré-annonce), freeze (move packets ignorés), speed (multiplicateur
  propagé au client via gm:speed), level (points de stats + HP/MP recalculés),
  kill (pipeline complet: loot, XP, KillLog), tp (recalage client player:teleport).
- **Bestiaire officiel**: /spawn crée à la volée la ligne Monster depuis
  characterdata (7 825 monstres invocables, ex `/spawn MOB_CH_MANGNYANG 2`).

### Taux live sans reboot (Redis)
`/rates exp 5` ou console → mutation du singleton + persistance clé
`srobro:rates` (rechargée au boot). Mesuré: Mangnyang ×5 = +270 XP, ×1 = +54.

### Console web /admin (auth Basic compte gm/admin)
Dashboard temps réel (2 s: joueurs + flags GM, monstres vivants, uptime),
éditeur de taux live, annonce serveur, téléporteur, navigateur des 21 529
items (prix officiels, don au joueur en ligne) et des 7 825 monstres
officiels (invoquables), sanctions (ban/unban/kick), KillLog (fix schema:
victimId sans FK Character + victimName).

### Fixes incidentels
- Item.price BigInt → JSON.stringify explosait silencieusement (Express 4
  n'attrape pas les promesses rejetées: requêtes pendantes) → wrapper aw() +
  Number(price).
- Recherche items: noms officiels coréens → chercher aussi le code latin
  (description contains).
- Compte owner: le 1er compte créé était un bot de test → 'arnaud' promu admin.
- /help: rôle lu sur l'ACCOUNT id (pas le character id).

### Preuves
- `scripts/test-phase6.ts` **31/31**: refus rôle, 22 commandes, taux mesuré
  ×5 vs ×1 SANS reboot, ban→login refusé, unban, kick déconnecte, console
  HTTP (401/200, items/monstres/killlog, giveItem, taux POST Redis).
