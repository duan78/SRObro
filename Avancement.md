# Avancement du Projet SRObro

## Session du 2 Octobre 2026 (17) : PROMPT_MAITRE_V3.md — prompt de finalisation

Rédigé à la demande utilisateur pour compléter et finaliser le jeu. 8 phases
A→H à critères mesurables: A personnage fidèle (armures par pièce, armes
visibles, anim de mort, anims par skill), B VFX officiels Particles.pk2
(efp→Babylon, 3 331 efp déjà indexés) + ciel, C quêtes officielles complètes
(Jangan 22/Donwhang 25) + titres Blue Zerk + journal, D social complet (canaux
chat party/guild/union + /w, storage L2, guild war, matching party), E vie du
monde (ferry maritime + pirates, fluctuations marché, FW Eastern Europe),
F fin de jeu (AP réels Job Temple, drops 11D Égypte, réskill 80%), G
robustesse (reconnexion auto, 3 clients ≥50 FPS, SFX, raccourcis/options),
H audit final filmé (définition de « finalisé »). Reprend l'état V1+V2+I
prouvé, les conventions/pièges cumulés et le mémo exécutable complet.
Au passage: découverte que les « commits » affichés en sessions 15/16 pour
minimap+audit étaient des sorties shell fantômes — tout a été réellement
commité ce jour en `267cb1697` (vérifié git log).

## Session du 2 Octobre 2026 (16) : AUDIT RÉPARATION « monstres/attaques/PNJ en l'air/sol inversé/déplacement lent »

**Signalement utilisateur**: monstres mal affichés, attaques HS, PNJ en
l'air, perso sous le sol inversé, déplacement lent. **Trois causes réelles
trouvées et réparées** (commit `267cb1697`), tout vérifié vert.

### 1. CACHE VITE CORROMPU (la cause principale des « monstres cassés »)
`node_modules/.vite/deps/chunk-XXXX.js` contenait un chunk de **3 octets**
(placeholder d'un crash d'optimisation) servi en HTTP 200: la page exécutait
du code Babylon fantôme → « Unsupported texture format » au chargement des
monstres (cylindres sans mesh → clics/attaques impossibles) + affichages
aberrants. Fix: purge .vite + kill esbuild + redémarrage propre. Vérifié:
mangnyang texturé au sol (capture analysée), textures servies 200 image/png.

### 2. HANDLERS CLIENT CIBLAIENT LE MAUVAIS MESH (« PNJ en l'air », tp cassés)
7 endroits de NetworkCombat cherchaient le joueur local par
`meshes.find(name.startsWith('chinaman_'))` — or les PNJ officiels ET les
joueurs distants utilisent les MÊMES modèles (`chinaman_adventurer___root__`):
le handler de téléport déplaçait un PNJ/joueur distant au lieu du perso
(PNJ « en l'air », perso immobile = rubber-band), VFX/nombres de dégâts/anims
d'attaque au mauvais endroit. Fix: `Game.getLocalPlayerMesh()`
(characterManager.player = source de vérité) passé à NetworkCombat en
callback — les 7 lookups remplacés (grep: 0 restant).

### 3. TÉLÉPORT ASYNC FRAGILE (phase I) + monstres FANTÔMES
- `player:teleport` attendait `terrain.teleportTo()` SANS garde: un fetch de
  région lent/rejeté → exception avalée → position jamais appliquée. Fix:
  try/catch + `teleportTo` plafonné 1,5 s (Promise.race).
- Entités sorties de l'AOI sans packet despawn = fantômes affichés/attaquables
  à jamais (cibler un fantôme = « l'attaque ne fait rien »). Fix: purge >300 u
  du joueur toutes les 2 s dans NetworkCombat.update().

### Vérifié (navigateur + suites)
- Perso au sol (Δ Y=0), terrain à l'endroit, monstres texturés posés (captures
  analysées), marche 23,9 u/s — PAS de lenteur; minimap Europe affichée
  (luma 15,9→87,3 — 529 fonds générés par `scripts/gen-minimap-tiles.ts`
  depuis les tilemaps officielles, fallback Media→généré dans Minimap.ts).
- Téléport serveur→client: packet reçu, position exacte (83,521), 10 monstres
  de camps spawnés, attaque 230 dégâts; **combat-flow TOUT VERT** (kills, XP,
  respawn, IA offensive: bandits tuent le perso 22→0 HP, résurrection).
- Pièges d'audit: (a) émissions socket depuis un onglet automatisé mortes
  après 30 s (timers throttled onglet caché → heartbeat manuel nécessaire);
  (b) sondes parallèles = joueurs zombies qui perturbent l'aggro (tests
  flaky) — UNE session à la fois; (c) sorties shell du tour TRONQUÉES/
  déformées — recouper via node -e + fichier avant de conclure.

## Session du 2 Octobre 2026 (15) : PHASE I — EUROPE + ÉGYPTE + CAP 120

**Objectif (phase I du PROMPT_MAITRE_V2)**: Constantinople (départ EU),
Asia Minor, Samarkand, Alexandria + déserts égyptiens, Job Temple, cap 120,
maîtrises CH 360 / EU 240. Le monde passe de 3 villes chinoises à 7 zones
sur 3 continents. **test-phaseI.ts: 14/14 ✓, régressions complètes vertes,
vérifié en navigateur (60 FPS, 0 erreur console).**

### DÉCOUVERTE CLÉ — la grille régions du client est la vérité (PAS xSROMap)
Les PosX/PosY « officiels » de la KB (extraction xSROMap) ne sont PAS alignés
sur la grille interne du client (nv_RRCC.nvm / <X>/<Z>.o / minimap) — la
conversion naïve `x−6460` plantait Constantinople en plein oasis. Vérité
terrain par scan des `.o` (famille de bâtiments par région):
- **Jangan 69x71** (validé V1) · **Constantinople 103-106×77-80**
  (`euro_constan_*`, centroïde moteur (69370, 15846)) · **Samarkand 87x86**
  (ville murée confirmée par tuile minimap) · **Alexandria ~91x49**
  (`alex_minga/sphinx/castle` + port) · couches z>160 = instances (miroirs).
- Les PosX/PosY officiels restent fiables en **offsets RELATIFS
  intra-ville** (échelle 1:1, 1 région = 1920 u partout): chaque NPC/spawn
  = ancre moteur de la ville + (officiel − centre officiel de la ville).

### Terrain: 819 régions (3 continents) + streaming
- Extraction globale 56-109 × 44-83 (`extract-region-heightmaps.ts`) —
  la grille couvre Chine + Europe de l'Est + Égypte + Samarkand.
- **RealTerrain repassé en STREAMING dynamique** (l'ancien « tout charger
  en tâche de fond » était tenable à 110 régions, pas à 819): bloc 5×5
  autour du joueur (rayon 2), déchargement des meshes au-delà du rayon+1,
  heightmaps conservées (heightAt juste partout, ~37 Ko/région),
  `update()` throttlé 700 ms dans la boucle, `teleportTo()` attend le bloc
  de destination AVANT de déplacer le joueur. 25 régions en scène, 60 FPS.
- **WorldObjects: tri par distance au CENTRE demandé** — objects.json est
  trié par distance à l'origine (Jangan): sans re-tri, le budget de 200
  objets des autres villes partait en herbes lointaines (Constantinople
  « vide » en capture). Vérifié: remparts + 15-25 structures européenes.
- parse-map-objects: 6 centres de villes → 6529 placements officiels.

### Serveur: zones, spawn EU, gates, peuplement (seed-world-phaseI.ts)
- Zones: zone_constantinople 1-24, zone_asia_minor 20-30, zone_samarkand
  29-45, zone_alexandria 95-120 (7 zones au total).
- **Bug spawn EU corrigé**: AuthHandlers créait TOUT perso à Jangan
  (NEW_CHARACTER_SPAWN figé) → spawn par race; les persos EU apparaissent
  à Constantinople près de la Dimensional Gate (69368, 15831).
- 44 NPCs officiels (CITIES_04/05 + NPCS_COORDINATES): Balbardo/Jatomo/
  Bajel/Shadi/Treno/Juel/Gilt/Georion… Constantinople, Julia/Smarkand,
  Hemaka/Sharon/Senmute/Marwa/Snefru… Alexandria S+N.
- **Graphe de gates officiel** (16 routes, coût 5000): Constantinople↔
  Samarkand, Samarkand↔Hotan, Jangan/Hotan↔Alexandria S/N, S↔N,
  gates internes d'Égypte (Storm and Cloud, Kings Valley).
- Anneaux MOB_EU (movoi 2 → siren 20), MOB_AM (crab→punisher 23-30),
  MOB_CA (peryton→golem 32-40), MOB_SD (60 espèces 100-110, désert à
  l'est d'Alexandria). **Uniques persistants**: Cerberus 693 072 HP
  (East Europe, spawn officiel), Captain Ivy (Asia Minor).
- CombatBridge.CITIES étendu (zone par <800 m lors des téléports),
  stalls autorisés dans les 3 nouvelles villes.

### Job Temple (Pharaoh Tomb) — DungeonManager
- 3 difficultés (beginner/intermediate/advanced), paliers OFFICIELS:
  Selket (57 722 800) → Neith (59 340 839) [→ Anubis (94 054 249) →
  Haroeris (244 859 450) → Seth (236 392 140) → Apis+Eris en advanced],
  chaque palier se débloque à la mort du précédent («kill Haroeris
  before Seth», KB 15). Trash = mobs SD officiels (Uneg/Weneg/Khepri…).
- Entrée: niveau 100+ ET costume de métier (KB CITIES_04:236-237),
  hunter/trader → Red Eggre, thief → Black Eggre. Cooldown 3 h,
  récompenses Seal of Nova/Egypt 11D. Annonce «palier suivant» en chat.

### Cap 120 (unifié)
- Client: ProgressionSystem utilisait une formule INVENTÉE
  (lvl²×100×1.2, cap 110) → **courbe officielle partagée** (xpcurve,
  leveldata du client), LEVEL_CAP=120.
- GM /level clampé à 120 (était 140), setLevel pareil.
- **Plafonds totaux de maîtrises officiels** (KB 02/03): CH 3×niveau
  (360 au cap 120), EU 2×niveau (240) — vérifiés au levelup
  (AuthHandlers) en plus du plafond individuel = niveau.
- Maîtrises DB maxLevel → 120 (seed).
- **Degrés 10-11 obtenables**: le degré vit dans le CODE officiel
  (ITEM_*_<degré>_<lettre> dans description — 66 items 10D + 22 11D,
  toutes familles CH/EU). shop:list à Alexandria (zone) vend 8×10D +
  12×11D chez Hemaka (KB CITIES_04 «armes 10D+», test: 22 articles,
  max 12 540 000 or) — les autres villes gardent le stock bas niveau.

### Pièges du jour
- **Plafond 12 persos/compte**: les suites créent des persos sans nettoyer
  → les échecs «ERREUR: create» des suites = compte saturé, purger les
  persos de test (garder les 2 persos de la session filmée).
- Tests de kill GM: entrer les donjons à un point ISOLÉ (l'entrée
  officielle de la tombe (45549,−45278) est à >1,3 km de tout camp) —
  à Samarkand les anneaux 29-45 interfèrent avec /kill (150 m).
- Le cache Vite repend les objets/terrain: recharger la page après
  régénération d'objects.json.

### Preuves (test-phaseI.ts 15/15)
Spawn EU (69368/15831 ✓) · Movoi 55 HP lv2 DB vSRO ✓ · Cerberus persistant
à son spawn ✓ · gate Samarkand 5000 or + arrivée exacte (35520/29760) ✓ ·
gates Samarkand→Constantinople+Hotan ✓ · Hemaka Alexandria 10D/11D ✓ ·
Job Temple: refus sans costume ✓, hunter ✓, Selket 57,7M ✓, Neith après
Selket ✓, complétion Seal of Nova ✓, cooldown 3 h ✓ · cap 120 ✓.
Navigateur: perso EU posé sur le relief (h=80,2), 25 régions streamées,
60 FPS, 0 console.error, Constantinople rendue (remparts/maisons européenes).

## Session du 2 Octobre 2026 (14) : OBJECTIF FIDÉLITÉ SRO — ANIMATIONS D'ATTAQUE DU PERSO

**Écart de fidélité**: le perso ne jouait AUCUNE animation d'attaque (seuls
monstres, VFX et sons s'animaient). SRO n'a pas d'« attack01 » générique:
les coups sont les **chaînes de combo par famille d'arme** (clips officiels
`skill_ch_sword_chain_a..h`, `spear_chain_a..g`, `bow_*`; réactions
`chinaman_a_behardhit`/`benormalhit`, versions chinawoman incluses).

**Ajouts** (`NetworkCombat` + `BanAnimationService`):
- `attackClip(famille, combo, genre)` / `hitClip(dur, genre)`.
- `playLocalOneShot()`: joue un clip ponctuel PAR-DESSUS l'anim d'état —
  groupes `player_anim_*` mis en pause puis repris, compteur de génération
  contre les reprises obsolètes; déclenché par le packet `attack` CONFIRMÉ
  (attaquant = perso local → combo a→b→c; cible = perso local → réaction
  officielle dur/normal selon critique).
- Famille d'arme détectée à l'équipement (bow / spear|glaive / sword par
  défaut), genre transmis depuis la sélection de personnage.
- Au passage: offsets dégâts/VFX restés à l'ancienne échelle convertis en
  unités SRO (chiffres monstre +13, impact VFX +11, dégâts joueur +17).

**Vérifié en jeu** (bandit agressif spawné): groupes `skill_ch_sword_chain_a,
b, c` ET `chinaman_a_benormalhit`, `chinaman_a_behardhit` observés en jeu;
capture analysée: « pose d'attaque, corps tordu mi-frappe, bras en extension
complète ». tsc 0. Source assets: `C:\Program Files (x86)\Silkroad`
(Data/Map/Media/Music/Particles.pk2) déjà extraite dans assets/pk2_data.

## Session du 1er Octobre 2026 (13) : FIX OSCILLATION VERTICALE AU REPOS

**Symptôme**: le perso bougeait de haut en bas à l'arrêt. Cause: la
« correction de dérive » de `normalizePlayerScale` relançait le recalage
toutes les 2 s et reposait les enfants selon la **bbox animée**
(refreshBoundingInfo) — laquelle varie désormais à chaque frame depuis que
les animations jouent (invisible avant, quand le bug fps figeait tout).
Le clip idle lui-même est innocent (bob du root Bip01: 0,024 u = 2,4 mm).

**Correctif**: le sol des pieds se mesure désormais sur les **vertices
bruts** (`getVerticesData` — statique, insensible à la pose), et la dérive
périodique est supprimée (plus rien à corriger avec le bind T-pose correct).
Même changement pour les PNJ dans QuestPanel (sinon ils « flottaient » dès
que leur idle jouait).

**Vérifié en jeu**: 6 s au repos → amplitude du root Y = 0,000, pieds
constants à 0,005 u. tsc 0.

## Session du 1er Octobre 2026 (12) : ÉCHELLE UNIFIÉE EN UNITÉS SRO

**Symptôme**: perso minuscule à côté des monstres (« mangnyang géant »),
déplacement rampant. Mesures: perso/PNJ normalisés à 1,8 u alors que le
monde est en **unités SRO** (1 u ≈ 10 cm — régions 1920, monstres BMS
natifs: mangnyang 15,2 u, vitesses officielles CSV walk 8-20 / run 20-399,
skills range en u). Le perso était ~9× trop petit et rampait à 1,7 u/s
(marche officielle du mangnyang: 8).

**Correctifs client**:
- `normalizePlayerScale`: échelle **native BMS** (~17-18 u) au lieu de 1,8.
- Vitesses: marche **8 u/s** (foulée walkforward 1,166 s/cycle), Shift ×2,125
  = **17 u/s** (run officiel 100% = 16,6); seuil anim run > 10; /speed GM base 8.
- Caméra TPC: distance 48 (était 9), hauteur 11, min 8, collision ignore 8 u.
- NetworkCombat: cylindre joueur distant 6×17, proxy monstre 10×14×10,
  étiquettes 30×7,5, ancre VFX +11, convergence interpolation 1,5, snap 80.
- QuestPanel PNJ: échelle native (1,0). Seuil d'arrivée clic: 5 u.

**Correctifs serveur**:
- Vitesses **officielles CSV** au spawn: moveSpeed = walkSpeed, runSpeed =
  runSpeed (repli 12 / ×2,5); aggro et retour au spawn à runSpeed (retour
  ×0,6), patrouille moveSpeed (rayon 20→120 u, seuil waypoint 4).
- aggroRange DB (15) ×8 = unités SRO aux 2 sites de création; attackRange 3→10.

**Vérifié en jeu**: perso 18,3 u vs mangnyang 15,2 u (proportions justes),
caméra 54 u, marche ~8 u/s, monstres qui patrouillent réellement (86→34 u
hors de portée en 10 s), combat au contact OK (« Mangnyang tué par Au2iix0j
+2 XP »), tsc 0/0 client+serveur.

## Session du 1er Octobre 2026 (11) : FIX MOONWALK — LES MODÈLES SRO REGARDENT −Z

**Symptôme**: le perso marchait dos à son déplacement (moonwalk). Mesure
décisive sur le maillage `chinaman_adventurer_face`: le NEZ dépasse à
Z=−1,36 (cluster de 10 vertices extrêmes) contre +0,85 pour l'arrière du
crâne, X symétrique (oreilles ±0,85) → **le visage regarde −Z**, alors que
tout le code oriente le +Z du nœud vers la marche (`atan2(dx,dz)` côté
client ET serveur — MonsterEntity utilise la même convention).

**Correctif** (`AssetLoader.loadMultiPartGlb`): nœud intermédiaire
`<id>_flip` avec rotation.y = π entre le root et les parties — UNIQUEMENT
pour les modèles skinnés (persos/mobs/PNJ; les armes/objets non skinés
gardent leur orientation pour ne pas casser l'attache d'arme). Soigne
joueur, PNJ, monstres et joueurs distants d'un coup (tous passent par ce
chargeur).

**Vérifié**: corrélation nez↔direction de marche = **1.0** (mesure du
vertex extrême du mesh tête via matrice monde), capture zoom pendant la
marche analysée: « vue de dos, foulée naturelle, une jambe en avant, bras
en opposition, pas de moonwalk ». tsc 0 erreur.

## Session du 1er Octobre 2026 (10) : DÉPLACEMENT NATUREL — ANIMATIONS À LA BONNE VITESSE + INTERPOLATION

**Symptôme**: perso/monstres/PNJ glissaient en « téléportation », membres
figés. Cause 1: `BanAnimationService.play()` créait les Animations avec
**framePerSecond = 1** alors que les clés sont numérotées `time(s) × 30` →
un clip de 1,17 s durait ~35 s (30× trop lent) : les os s'appliquaient sur
la première clé puis semblaient immobiles (cuisse: 0,03 d'amplitude au lieu
de ~100°/cycle). Les times des clips JSON sont en **SECONDES** (pas ms).

**Correctifs**:
- `BanAnimationService.ts`: fps 1 → **30** (rot + pos) — soigne TOUT:
  idle du perso (balancement), idle PNJ (standcity), marche/course joueur,
  marche/run monstres, joueurs distants.
- Vitesses naturelles (`Game.ts`): marche **1,7 u/s** (~6 km/h pour un perso
  de 1,8 u; avant 5,0 = patinage), Shift = ×3,2 ≈ 5,4 u/s, seuil anim run
  6,5 → 3,0 (basé sur effectiveSpeed), base `/speed` GM = baseMoveSpeed.
- **Interpolation des entités distantes** (`NetworkCombat.ts`): le serveur
  diffuse les monstres à 250 ms (CombatBridge, idle non diffusé) et les
  joueurs à ~200 ms — le client snappait chaque packet (= téléportation).
  Désormais: cible mémorisée, lissage exponentiel `1-exp(-dt×10)` vers elle
  chaque frame, rotation par plus court chemin, snap seulement si saut > 8 u
  (téléporteurs), Y repris du terrain; bascule d'anim par CONVERGENCE
  (> 0,15 u de la cible = walk, rejoint = idle stand01/standcity) — règle
  aussi le cas « le serveur ne diffuse pas les monstres idle → anim walk
  collée à l'arrêt ». run si aiState serveur aggro/attack.

**Vérifié en jeu**: cuisse 101° cumulés par cycle de marche (ampleur
naturelle), 19 777 px de diff de silhouette entre deux phases du pas,
vitesse réelle 1,7 u/s, mangnyang idle stand01 animé, bandit aggro: membres
135° cumulés en anim run, aucun saut après pose initiale, tsc 0 erreur.

## Session du 1er Octobre 2026 (9) : FIX « BRAS EN L'AIR » — BIND T-POSE BSK

**Symptôme**: le perso rendait bras en T (tendus à l'horizontale) alors que
les os CPU étaient bras baissés (main 9.7 < épaule 14.9) et que le rendu
suivait bien les os (13 992 px changés après rotation manuelle d'un os).

**Cause racine (mesurée sur les vertices)**: les maillages BMS sont modélisés
en **T-pose** (`man_arm_upper` brut: X ±5.01, Y constant 13.8..15.5) et les
**absolues BSK sont exactement cette T-pose dans le repère GLB, 1:1 sans
échelle** (L UpperArm (1.49, 14.87), L Hand (6.96, 14.93), pelvis 9.87,
foot 1.26 = ancres du maillage). L'ancienne lecture « BSK éparpillé main
Y=89 » était un artefact d'ordre de matrices. Les patches « pose neutre »
précédents avaient posé IBM = inv(monde_neutre(clé 0)): au repos ET pendant
l'idle (≈ neutre) le skinning était ≈ identité → c'est le maillage BRUT
(T-pose) qui s'affichait. Divergence CPU/GPU trompeuse: seuls un crop
d'écran + une simulation de skinning sur les vrais vertices le révèlent.

**Correctif — `scripts/fix-glb-tpose-bind.js`** (nouveau, 1623 GLB patchés) :
- locals des nodes os = inv(bind parent) × absolue BSK ; IBM = inv(bind).
- os dégénérés du BSK (abs = identité, ex. `Spine_Base`, le seul du rig
  chinois) : local inchangé, bind = bind(parent) × local.
- résolution BSK par GLB: stem exact → stems élagués (mangnyang_part2 →
  mangnyang) → familles humanoïdes (chinaman/chinawoman/europeman/
  europewoman, proportions distinctes) → plus petit BSK surensemble.
- validation par fichier: recomposition repos = identité; **auto-test
  géométrique** `--selftest`: skinne les vrais vertices de man_arm_upper
  avec la clé 0 du clip standcity → bras repliés (larg 5.39, Y 11.5..15.5)
  au lieu de la T-pose (larg 10, Y 13.8..15.5).
- pièges corrigés en route: JOINTS_0 lu en float32 alors qu'entier (indices
  aberrants), mémoisation prématurée des mondes composés, Spine_Base.

**Vérifié en jeu** (captures + analyse d'image): perso idle **bras baissés
le long du corps**, marche clavier (9 groupes walkforward, 45 u parcourues,
retour idle 180 groupes), PNJ chinaman/chinawoman **pose idle naturelle,
aucune déformation**. Monstres: mêmes BSK/même pipeline validé (mangnyang →
mangnyang.bsk OK en dry-run). `?v=` version.txt bumpé → pas de cache.

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

---

## Session du 1er Octobre 2026 (9/2) : PHASE 7 — Finitions

### Minimap réelle (phase 7.1)
`client/src/ui/dom/Minimap.ts`: mosaïque 3×3 des tuiles officielles
Media/minimap (256 px = région 1920 u, ancre RealTerrain 69×71), fenêtre
centrée sur le joueur, flèche ORIENTÉE (cap du perso), Nord, grille des
régions. Redessin seulement si déplacement ≥2 px / rotation ≥0.06 rad.
Validée navigateur: tuile officielle rendue, flèche, X:19 Z:505 affichés.

### Mort/aggro monstres (7.2)
- anim `damage01` sur coup reçu, `die` puis affaissement (sink) sur mort
  (clips officiels des BAN: mangnyang_die.json etc.)
- étiquette flottante nom + niveau au-dessus de la cible (DynamicTexture
  billboard, attachée au monstre ciblé, disposable au déciblage)
- barre de vie cible fluide (transition CSS 0.25 s déjà en place) — fix du
  « flapping »: en mode réseau le NetworkCombat possède le target frame,
  le combat legacy ne l'écrase plus toutes les 400 ms.

### Audio (7.3)
`GameAudio.ts`: musique de zone jangan_town.ogg en boucle (démarrée à
l'entrée en jeu, reprise au retour d'onglet, touche M) + SFX combat (swing,
coup porté, blessure et mort de monstre — wav officiels, anti-spam 60 ms,
pool de clones). musicOn vérifié true en jeu.

### Stabilité/perf (7.4/7.5)
- Fix ~200 warns/min « Entity not found for update: undefined »: les
  packets serveur sont ENVELOPPÉS; Game.ts déballe maintenant, et en mode
  réseau l'EntityManager legacy ne double-gère plus les entités réseau
  (flag legacyEntities) — 0 erreur console en jeu (1 warn bénin de
  reconnexion manuelle).
- 60-61 FPS mesurés en ville (rAF), freezeWorldMatrix déjà en place sur
  bâtiments/terrain, écran de chargement 10→100 % déjà instrumenté.

### Preuves navigateur
Combat filmé: ciblage Mangnyang (étiquette+barre), dégâts 15/24→7/24→mort
(+54 XP chat, despawn). Captures: minimap officielle+flèche, étiquette
« MOB_CH_MANGNYANG Lv. 1 » au-dessus du monstre.

---

## Session du 1er/2 octobre 2026 : AUDIT FINAL §5 — 8/8 critères validés

Voir `docs/audit/AUDIT_FINAL.md` (rapport complet + artéfacts: film webm
22,5 s, captures, mesures). Résumé: compte+perso créés en direct, >50 m de
déplacement au clic filmés, combat 3 skills + loot + mort + résurrection,
niveau 2 + stats (attaque 35~45), boutique officielle + potion + arme
équipée (mesh visible), deux onglets (visibilité mutuelle + chat + mob
partagé), GM complet (22 commandes, /rates ×5 mesuré +270 XP sans reboot,
console /admin temps réel, ban/kick), 60 FPS + 1 warn bénin en 15 min,
tsc 0/0, persistance après relance serveur.

---

## Session du 2 octobre 2026 : PROMPT_MAITRE_V2 — PHASE A (données officielles)

### Étape 0 : audit des modules MVP (avant toute écriture)
| Module | État | Verdict |
|---|---|---|
| quest | Branché réseau+combat+DB, anti-exploit | Réutilisable (manque récompenses items) |
| drop | En jeu (CombatBridge), SQL brut | Réutilisable (migrer vers Prisma plus tard) |
| guild | Branché (15 events), CRUD solide | Réutilisable (invitations non livrées, storage OK) |
| fortress | Branché, scheduler complet | Guerre factice (vainqueur arbitraire) — gameplay siège à écrire |
| mount | Branché DB | Aucune entité monde/vitesse — à compléter |
| hotkey | SQL sur tables inexistantes | À réécrire en Prisma |
| casting | Rien n'appelle startCasting | Code mort (doublon SkillManager) — à fusionner/supprimer |
| alchemy | Logique propre + DB, débranché | Branchable (handlers socket + consommation items à faire) |
| job | Bugs bloquants (clés étoiles) | À réécrire en partie |
| pvp | PKManager prêt; PvPManager 2 bugs | PK branchable sur morts joueur de CombatBridge |
| stall | Squelette + bugs transaction | À corriger (slot vendeur, stock) |

### Réalisé (Phase A)
- **Import des données officielles** (campaigne 2026-10): `scripts/import-official-csv.ts`
  → `data/game/monsters_official.json` (6 483 monstres, stats DB serveur vSRO)
  + `skills_official.json` (6 909 skills, skilldata serveur). GameDataService les
  charge avec priorité sur les données client.
- **Monstres officiels**: SpawnManager applique les stats exactes (HP/MP/EXP/atk/
  parry/AR par stem) — Tiger Girl 598 720 HP/451 200 EXP vérifiés en jeu. Défense =
  courbe 2+niveau×2 (pas de colonne défense dans la DB). Mobs tutoriels DOCILES
  (mangnyang/yeoha/ghosts: aggro 0, vengeance seule) — comportement officiel.
- **Moteur de skills générique** (CombatBridge): résolution par skills_official —
  % FIXE par série + part fixe, MP/coûts HP, cooldowns individuels + groupes
  (cooltime), prepare/cast réels (barre d'incantation 411 ms Strike Smash),
  multi-coups mc_hits, gating maîtrise req_mastery_lv (>5), dégâts par la formule
  officielle. Fallback BASIC_SKILLS si absent.
- **OfficialFormulas.ts**: formule elitepvpers 412387 complète (multipliers
  1.2767/1.2870, balances, mastery_incr, crit 2×PHY+MAG sur séries crit seule-
  ment, block bouclier, AR/PR jets), HP/MP officiels, GAP (±10%/niveau, gap 9 max).
- **GAP appliqué** aux kills (xp_gain expose gap/mult); DamageCalculator aligné
  (crit ×2, block quasi-annulatif); défense de base perso ≈ niveau (perso nu).
- **Masteries en mémoire** (PlayerEntity, chargées à la connexion) pour GAP et
  formules. CombatManager accepte des dégâts précalculés (moteur officiel).

### Tests
- `scripts/test-phaseA.ts` — 9/9 ✓ (TG HP/EXP officiels, GAP gap1=×0.9=406 080,
  Strike Smash MP 19/cast 411/CD 3000/dégâts, gating bicheon 27).
- Régressions V1: combat-flow ✓, phase4 ✓ (boucle retarget corrigée + /god),
  phase5 ✓ (targeting ordonné + tueur dynamique), phase6 ✓ (ratio taux tolérance
  GAP). tsc 0/0.

### PHASE B (monde chinois complet) — 2026-10-02
- **Bâtiments 3 villes** fusionnés dans objects.json (1 148 placements MAPO
  exacts, multi-centres Jangan 69,71 + Donwhang 67,71 + Hotan 66,70; dédup
  des grilles). WorldObjects.reload() au téléport (streaming-lite, budget
  perf constant 200 meshes).
- **Seed monde officiel** (seed-world.ts): zones 1-35/20-55/40-90, 12 NPCs
  fonctionnels Donwhang+Hotan (noms KB), 6 téléporteurs (coûts/niveaux,
  réseau Jangan↔Donwhang↔Hotan), 42 spawns d'anneaux par niveaux depuis
  monsters_official.json (variantes 'plain' avant _STRONG_/_CLON), 5 uniques
  de Chine aux coordonnées officielles xSROMap converties (engine = PosX−6460,
  PosY−590): Tiger Girl 6h, Uruchi 3h, Isyutaru/Yarkan/Shaitan 6h — flag
  persistent (spawn au boot, jamais despawnés).
- **Téléporteurs jouables**: handlers teleport:list/teleport:use (coût +
  niveau + proximité Gatekeeper, or débité), dialogue DOM Gatekeeper client,
  npc:list multi-villes + npcType.
- **Annonces d'uniques**: packet unique:spawned broadcast serveur + bannière
  client au spawn de chaque unique (comportement officiel).
- **Corrections structurelles découvertes par les tests**:
  - teleportPlayer déplace désormais l'ENTITÉ serveur + l'entrée spatiale
    (avant: seul le client bougeait → AOI/despawn cassés; le GM /tp aussi)
  - spawnMonsterAt enregistre le spawn adHoc dans activeSpawns (les mobs GM
    se nettoient sans joueurs à 150 m au lieu de s'accumuler)
  - bestiary.ensureMonsterInDb: matching exact d'abord, jamais les _CLON
  - /kill GM: portée 150 m (anneaux à 60 m+ des villes)
  - mobs tutoriels dociles = Mangnyang/Yeoha uniquement (les ghosts/bandits
    sont agressifs — officiel)
- **Tests**: test-phaseB.ts (npc 3 villes, téléport payant + position,
  mobs Donwhang, Tiger Girl HP officiels) — TOUT PASSÉ; régressions V1
  complètes (A 9/9, combat-flow, 4, 5, 6) en séquence.

### PHASE C (classes & skills complets) — 2026-10-02
- **Apprentissage officiel**: skills:available (280 séries CH/EU par race avec
  niveaux/req/SP/dégâts), skill:learn (validation maîtrise + SP, persistance
  CharacterSkill avec Mastery UUID résolu), gating au cast (skill non appris
  rejeté). Skills de départ accordés à la création (CH: 3 séries Bicheon,
  EU: Slash Warrior).
- **Miroir mémoire**: mastery:levelup met à jour l'entité en jeu (GAP et
  formules vivantes sans reconnexion).
- **Zerk officiel**: orbes (1/3 kills, max 5), zerk:activate → ×2 dégâts
  15 s (mesuré 123→236), jauge HUD 5 orbes + Tab client.
- **Imbues (kind 8)**: cast self → activeImbue, composante magique
  additionnelle sur les skills physiques (mécanique ×% DE 2006).
- **Client**: SkillPanel (touche S: onglets maîtrises, séries, niveaux,
  boutons Apprentissage SP), hotbar dynamique (skills appris → touches 1-8,
  DomHud.setHotbarSkills), notifications zerk/imbue.
- **Bestiaire**: fallback monsters_official (codes absents de characterdata
  comme MOB_CI_MANGNYANG), matching exact-first sans _CLON.
- **Tests**: test-phaseC.ts TOUT PASSÉ (arbre, refus, learn SP décrémentés,
  cast gating, dégâts officiels, orbes 15 kills→5, zerk ×2). Régressions
  complètes A/B/combat/4/5/6 au vert.

### PHASE D (alchimie officielle) — 2026-10-02
- **Taux RÉELS DB vSRO** dans ProbabilityCalculator (extraction 2026-10,
  validée SroCave): élixir seul 50/40/30/19/17/12..., Lucky Powder ADDITIF
  +50/30/20/8 (→ 100/70/50/27/25/20), échec ≤+4 = reset +0, échec ≥+5 =
  50% destruction (Immortal/protector annulent). Fin des taux inventés du
  MVP (100% jusqu'à +5, ×1.5 critique — supprimés).
- **Consommation des matériaux**: 1 élixir du type (noms coréens officiels
  무기강화주문서/엘릭시르...) + 1 pierre de chance (행운의 연금석, substitut
  documenté du Lucky Powder absent de l'import) — refus si manquants.
- **Handler alchemy:enhance** (slot + usePowder) + Alt+clic équipement dans
  l'InventoryPanel (toast résultat: +N/échec/💥 destruction).
- **Tests** (test-phaseD.ts): +0→+1 pierre = 100% (mesuré finalSuccessRate
  1.0 = 50+50 ✓), élixir décrémenté, +2→+3 pierre ≈50% (15/40, n≥30),
  resets +0 observés (39). Régressions A/combat/4 au vert.

### PHASE E (PvP/PK branché) — 2026-10-02
- **Flux PvP sur morts joueur**: CombatBridge.onPlayerDeath route vers
  PvPManager.handlePvPDeath quand le tueur est un joueur → PKManager
  (points, seuils officiels 500/1000/2000, drops du meurtrier, pénalités).
- **2 bugs corrigés** (repérés par l'audit modules): self-defense inversé
  (initiateur lu sur la mauvaise clé — désormais: la VICTIME avait-elle
  attaqué le tueur en premier) et handlePKDeath appelé sur le TUEUR au
  lieu de la victime (c'est le mort qui droppe).
- **Traçage d'agression**: recordAttack sur toute attaque joueur→joueur
  (self-defense officiel: tueur défenseur = 0 pt).
- **Tests** (test-phaseE.ts): A tue B → annonce PvP, PKStatus, B avait
  attaqué en premier → +0 pt (légitime défense officielle). Régressions
  A/combat au vert.

### PHASE F (guildes bout-en-bout) — 2026-10-02
- **Invitations LIVRÉES**: l'event guildInvitation de GuildManager (aucun
  listener — audit) est relayé vers le client cible (packet guild:invited),
  notification + acceptation client.
- **3 corrections**: sérialisation BigInt des payloads guilde (récursif),
  usage du bon event guild:accept_invite côté client, coût/niveau officiels
  vérifiés en test (500k or, niveau 20+ — KB 17_GUILD_SYSTEM).
- **Tests** (test-phaseF.ts): création 500k, invitation reçue par la CIBLE,
  acceptation → GuildMember en base. NB: deux commandes GM consécutives
  (= deux saves concurrents) se marchent dessus — sérialiser dans les tests.

### Backlog restant (phases G/H + modules)
- Jobs (triangle trade): module à réécrire partiellement (bug clés étoiles)
  + spawn monde des transports — données KB 09-12/35 prêtes.
- Stalls: bugs transaction (slot vendeur) à corriger + UI.
- Fortress War: gameplay de siège réel (le scheduler existe).
- FGW/Qin-Shi (donjons), pets/mounts monde, playlist audio par zone.

### JOBS (triangle Trader/Thief/Hunter) — 2026-10-02 (phase G-jobs)
- **Bug clés étoiles CORRIGÉ**: createTransport fabriquait '1_star' contre
  des clés 'one_star' → tout achat rejeté « Invalid star level ». Conversion
  à la frontière Prisma (enum legacy one_star..five_star conservé).
- **Modèle officiel**: transports cheval 2 000 or/9 slots (KB 24), bœuf,
  chameau 20 000/27 slots (KB 10) ; ÉTOILES = valeur chargée
  (computeStarLevel: ceil(unités/slots×5)) — PAS le transport (KB 09/10) ;
  multiplicateurs de route alignés KB (Jangan→Donwhang 1.62, réf. 2006) ;
  revente interdite dans la ville d'origine (profit 0).
- **Handlers complets** (JobHandlers.ts): job:state/change/buy_transport/
  buy_goods/sell_goods/steal/dismiss_transport — miroir or entité→base
  avant tout coût (les gains vivent dans l'entité en jeu).
- **Embuscades NPC officielles** (CombatBridge.checkTradeAmbushes): trader
  chargé à >600 m de toute ville → N thieves NPC (N = étoiles, 1/étoile,
  mobs officiels MOB_THIEF_NPC lv2) spawnés autour de lui, cooldown 90 s,
  packet job:ambush. Mort du trader = transport détruit (goods perdues).
- **Vol thief**: job:steal à <50 m → 30% des lots volés (KB), recel 60%,
  XP métier, trader averti.
- **Client**: JobPanel (touche J): métiers, transports, spécialités par
  ville, vente, notifications embuscade/transport.
- **Fix transverse**: teleportPlayer recalcule zoneId par ville la plus
  proche (<800 m) — le GM /tp laissait la zone d'origine (ventes/spécialités
  ancrées à Jangan).
- **Tests**: test-phaseG-jobs.ts 16/16 (transport 1★ accepté, étoiles 4/9→3★,
  embuscade 3 thieves, vente 5 720 or = 4×(1500×1.62−1000) EXACT, rechargement
  Hotan, vol + recel 4 800 + avertissement). Régressions A/B/combat vertes.

### STALLS (stall network officiel) — 2026-10-02
- **3 bugs corrigés** (audit modules + découverts):
  1. Transfert d'item: le slot du VENDEUR était conservé → collision
     @@unique([characterId, slot]) chez l'acheteur. Désormais slot libre
     calculé pour l'acheteur (vérifié: slot 3 avec 0-2 occupés).
  2. Anti double-vente: transaction Prisma interactive avec deleteMany
     garde (0 ligne détruite = déjà vendu → rollback complet).
  3. Cache: addItemToStall stockait l'id de l'INVENTORY item comme id de
     StallItem → recherche renvoyait des stallItemId introuvables.
  (+ singleton StallManager: une instance par socket isolait les caches;
  + recherche: vrais plus/rarity lus en base, plus 0/common hardcodés)
- **Handlers** (StallHandlers.ts): stall:open (1 000 or, en ville uniquement),
  add_item, search (stall network), buy (or base+entité synchronisés),
  close. Noms d'items officiels coréens (recherche par type/prix).
- **Tests**: test-phaseD2-stalls.ts 8/8 (ouverture, dépôt, recherche,
  achat, or débité 60 000→55 000, slot libre 3, double-vente rejetée).

### FORTRESS WAR (siège réel + taxes) — 2026-10-02
- **Points de siège RÉELS** (fin du placeholder « première guilde inscrite »):
  recordWarKill sur chaque mort PvP — si une guerre est ACTIVE et que les
  DEUX guildes (tueur + victime) y sont inscrites: +1 point au tueur.
  Scores Redis-backed (srobro:fw:scores:<id> hash): les kills sont scorés
  par le processus serveur, la fin de guerre peut être déclenchée ailleurs.
- **Vainqueur au MEILLEUR score**; sans kill = personne ne capture (défense
  conservée) — comportement officiel KB 19.
- **Taxes officielles**: setTaxRate −20%→+20% par l'occupant; mapping
  forteresse→zone (Jangan Fortress→zone_jangan, Hotan→zone_hotan,
  Bandit→zone_donwhang); achat boutique NPC taxé (shop:buy → prix×(1+rate)),
  recette incrémentée au GuildStorage de la guilde occupante.
- **Tests** (test-phaseF2-fortress.ts) 10/10: 2 guildes inscrites, guerre
  active, kill PvP B→A score 1 (Redis), vainqueur = A (B était première
  inscrite), taxe 10%: achat base 60 → 66 débités, storage guilde +6.
- Régressions: phaseA 9/9, jobs 16/16, stalls 8/8.

### DONJONS (FGW Togui + Qin-Shi B6) — 2026-10-02 (phase G2)
- **DungeonManager** (game/DungeonManager.ts): instances FGW Togui 3 tranches
  (a1 35-50, a2 51-60, b1 61-70) avec trash + Elder Earth Ghost officiels
  (HP DB vSRO: 1,27 M a1) et Qin-Shi B6 (Medusa MOB_TQ_WHITESNAKE
  183 535 199 HP). Handlers dungeon:enter/state.
- **Mécanique officielle**: 8 kills (7 trash + boss) → 8 talismans =
  collection complète → récompense D8 Seal of Sun (KB 29), cooldown 3 h
  par donjon (re-entrée refusée, message minutes restantes).
- **Intégration combat**: onMonsterDeath → talismans (packet
  dungeon:talisman + chat), complétion annoncée.
- **Tests** (test-phaseG2-dungeons.ts) 7/7: entrée, Elder 1 275 761 HP,
  8 talismans, complétion, cooldown 180 min refusé, Medusa 183 535 199 HP.
- Piège de test: les cadavres (3 s) piègent le /kill « plus proche » —
  attendre le despawn entre les kills GM.

### PETS/MOUNTS (loup officiel + vitesse monture) — 2026-10-02 (phase H)
- **PetService** (game/PetService.ts): loup de croissance officiel KB 24 —
  achat 1 000 000 or à l'écurie (proximité <40 m vérifiée), invocation
  (pipeline monstre: rendu + spatial), SUIT le maître, ATTAQUE sa cible
  (currentTargetId mémorisé à chaque attaque joueur; CD 1,5 s, portée 4 m),
  XP sur les kills du maître (30 kills/niveau, adulte lv 40), packets
  pet:levelup/dungeon-like. Handlers pet:buy_wolf/summon/dismiss.
- **Vitesse monture APPLIQUÉE** (le MountManager ne flipait qu'isActive):
  MOUNT_SPEED exporté (cheval 5/3 ≈ 1.67×, blanc 7/3, combat 2×), gm:speed
  émis au summon/dismiss, payloads mount:* sanitizés BigInt.
- **Tests** (test-phaseH-pets.ts) 6/6: refus loin écurie (6 720 m), achat
  1M débité, invocation lv 1, loup attaque (7 attaques sur Bunwang 45),
  croissance lv 2, monture ×1.67.

### AUDIO PAR ZONE (playlist officielle Music.pk2) — 2026-10-02 (phase H)
- **GameAudio**: playlist par position — jangan/donwhang/centralasia _town
  dans les villes (<450 m du centre), *_field en zone sauvage (bandes
  rectangulaires par région), karakoram au-delà d'Hotan. Changement de
  piste throttlé 3 s, reprise onglet visible. 47 pistes officielles
  disponibles (3 continents + donjons + login).
- **Fix test**: combat-flow respawn vérifié par RE-SNAPSHOT (le packet du
  respawn part du camp, pas de la position du mob tué — AOI flaky).
- **Régressions complètes**: A 9/9, B, combat-flow, 4, 5, 6, jobs, stalls,
  fortress, donjons, pets — TOUT PASSÉ.

---

## Session du 2 octobre 2026 (matin): AUDIT FINAL V2 §5 — 8/8 critères démontrés

Voir `docs/audit/AUDIT_FINAL_V2.md`: les 8 critères du §5 du PROMPT_MAITRE_V2
sont couverts par les suites scriptées (toutes vertes, cf. tableau preuves).
12 commits V2 au total. Le jeu couvre désormais: monde 3 villes + téléports
officiels + 5 uniques persistants, skills complets (apprentissage SP,
zerk, imbues), alchimie aux taux DB réels, stalls, trade triangle complet
(étoiles/embuscades/vol), guildes, PvP/PK self-defense, fortress war au
score + taxes, donjons FGW/Qin-Shi, loup de croissance, montures rapides,
playlist audio par zone.

### LACUNES §5 COMBLÉES — 2026-10-02 (matinée)
- **Alchimie destruction** (test-phaseD réécrit): pilotage par oldPlus/newPlus
  des réponses, lames réarmées via GM après chaque destruction — 4 lames
  détruites constatées, taux +2→+3 mesuré (11/20), resets 9.
- **Consignation NPC Juel** (ConsignmentManager): dépôt 10 items/3 jours,
  retrait d'inventaire, recherche/achat à DISTANCE (acheteur à Jangan,
  vendeur Hotan), commission 1% plafonnée 100k, double-vente rejetée,
  retrait (cancel) → retour inventaire. Test 10/10 (or 110 000→102 000,
  vendeur +7 920, item livré slot 3).
- **PartyManager officiel** (KB 18): Each Get 4 / Auto Share 8, invitation
  livrée + acceptation + party:state diffusé, XP PARTAGÉ avec bonus
  +3%/membre (mesuré: round(22×1.06/3)=8 EXACT), distance >150 m exclue.
- **Union de guildes**: createUnion (niveau 3), 2 guildes reliées
  (UnionMember) — test vérifié en base.
- **BossMechanics (Medusa)**: tracking par nom officiel (modelId variable
  selon le chemin de création — piège), AoE périodique 12 s: ≤15 m touché
  (Petrify 8 s + Fear 10 s + dégâts 390-780%), >15 m ESQUIVE
  (boss:aoe_dodged). Medusa ENGAGÉE: 8 coups portés. Test 5/5.
- **UI complète**: SocialPanel (P: party créer/inviter/accepter/quitter,
  M: carte du monde officielle avec 6 villes + position joueur),
  ExchangePanel (X: échange joueur via stall network sécurisé).
- MAX_CHARACTERS_PER_ACCOUNT 4→12 (tests multi-personnages: party 8,
  guildes, trades). Tests: D 8/8, consign 10/10, social 11/11,
  medusa 5/5, A 9/9.

### SESSION DE TEST FILMÉE V2 — 2026-10-02 (final)
- **audit-filme-v2.ts**: session scriptée de bout en bout couvrant les 8
  critères §5 avec timestamps (transcription complète dans
  docs/audit/AUDIT_FILME_V2_TRANSCRIPT.log) — TOUS DÉMONTRÉS:
  C1 téléports payés, C2 TG EXP×GAP exact, C3 skill SP+zerk, C4 alchimie
  100%+destruction+consignation (achat à distance 2 010 000→2 005 000),
  C5 trade 3★+embuscade+vente 5 720 EXACTE, C6 guilde+union+party bonus
  51.5% mesuré, C7 FGW 8 talismans+Medusa ENGAGÉE (AoE Petrify+esquive 48 m),
  C8 loup+monture ×1.67+UI 8 fenêtres.
- Pièges: heartbeat périodique obligatoire dans les scripts multi-sockets
  (timeout 30 s sinon), /item atterrit au premier slot LIBRE (variable
  selon l'alchimie), tracking Medusa par NOM (modelId variable).
- AUDIT_FINAL_V2.md mis à jour avec les preuves filmées.

### FIX GRAPHIQUE MAJEUR + EFFETS + CHARGEMENT — 2026-10-02 (session 9)

**Bug: personnage invisible au centre de l'écran (rapport utilisateur).**
- Diagnostic en live (window.appState/netCombat exposés): le perso était
  ENTOURRE de ~3,4 m sous terre — le skinning glTF des GLB était corrompu.
- **Cause racine**: l'exporteur ne déclarait comme joints du skin QUE les os
  pondérés par la partie; les os ancêtres (Bip01, Pelvis...) restaient
  non-joints. Le chargeur Babylon (_updateBoneMatrices, branche boneIndex
  === -1) remplace alors leur matrice de bind par inv(parentBind) → leur
  transform PROPRE est perdu → toute la chaîne compose faux → perso enterré.
  Preuve mathématique sur disque: world(joint)×IBM ≠ identité au repos.
- **Correctif**: scripts/fix-glb-skins.js — étend joints à TOUS les ancêtres
  (les indices JOINTS_0 restent valides: anciens joints en tête), réécrit
  les IBM = inv(world(node)), ajoute skins.skeleton = racine commune.
  **1 624 GLB patchés** (persos, monstres, familiers) avec validation
  d'identité intégrée. Piège GLB: le padding du chunk JSON doit être des
  ESPACES (0x20), jamais des \0 (JSON.parse échoue sinon).
- **Animations BAN réparées au passage**: (1) les noms d'os correspondent
  exacte OU par suffixe (l'instantiation préfixe les noms); (2) déliage
  linkTransformNode(null) AVANT animer — sinon les nodes liés écrasent la
  pose (T-pose permanente). Idle standcity vérifié: bras le long du corps.
- **normalizePlayerScale durci**: signature de stabilité bbox locale
  (verrou après 1,5 s sans changement), garde-fou hauteur locale 5..60 u
  (une pose explosive ne pilote PLUS l'échelle — bug d'échelle 0.011),
  correction de dérive lente tous les 2 s après verrouillage.
- ATTENTION: re-baser les positions BAN sur le bind (key_i−key_0+bind) fait
  EXPLOSER la pose (les rotations vivent dans le repère d'origine) — revert.
- Vérifié en navigateur: perso 1,8 m posé au sol, au centre (test de
  masquage: Δluminance 58 au centre du canvas), idle animé, 0 erreur GLB.

**Chantier VFX (Skills)**: SkillEffectManager branché sur le VRAI chemin de
jeu (avant: appelé seulement par les tests) — effet de CAST au perso
(élément déduit du nom de skill: feu/glace/foudre/soin/slash), IMPACT sur la
cible (double en critique), petit éclat sur coups blancs. Texture de flare
procédurale locale (plus de CDN externe).

**Particles.pk2 extrait** (175 Mo → assets/pk2_particles): 3 331 .efp
indexés avec leurs textures (scripts/index-efp-textures.js →
efp-textures.json), 999 textures .ddj converties en PNG
(textures/particles/). 5 textures officielles utilisées par famille d'effet
(fire, byuk-ice, cho-light, bumpy_healline, cho-wind-y). Piège: dossier créé
avec majuscule (`Particles`) — sirv/Vite est SENSIBLE À LA CASSE → fallback
SPA HTML au lieu du PNG (symptôme: EncodingError sur img.decode()).

**Chargement initial: ~1-2 min → 6-17 s**: RealTerrain charge le bloc 3×3
autour du spawn en priorité puis le reste en tâche de fond (6 workers);
WorldObjects charge les ~100 modèles GLB en parallèle (8 workers au lieu de
séquentiel).

Autres observations: en navigateur en arrière-plan, rAF est en pause → la
boucle de rendu semble morte (fps figé) — normal, elle reprend à l'affichage.
Les tests navigateur doivent donc "pomper" les frames manuellement
(engine._activeRenderLoops[0]()) quand la page n'est pas visible.

### FIX "le personnage s'affiche mal" (corps éparpillé) — 2026-10-02 (session 9, suite)

**Symptôme**: au repos le perso était parfait (0..1,8 m) mais dès que
l'animation idle démarrait, le corps s'éclatait (bbox ±11 m).

**Cause racine (validée par simulation skinning complète hors ligne,
scripts/test-ban-convention.js)**: les maillages BMS sont modélisés dans la
pose NEUTRE DEBOUT du rig — la pose que décrit la CLÉ 0 des clips BAN — et
PAS dans la pose de bind du BSK (une pose éparse: main Y=89, tête Z=−42).
Les IBM en inv(world BSK) étaient donc fausses du delta bind→neutre, et
retargeter avec les locaux du clip éparpillait le corps.

**Correctif — scripts/fix-glb-neutral-pose.js** (nouvelle passe):
- node locals et IBM recalculés depuis la pose NEUTRE (clé 0 du clip de
  référence de la famille: chinaman/chinawoman_fighter_standcity, walk pour
  les mobs);
- au repos le skinning est identité ET l'application directe des locaux du
  clip redonne exactement la pose neutre → l'animation retargete correctement;
- 66 fichiers perso (homme+femme) + 35 fichiers monstres (ceux avec clip
  walk) patchés, 100% validés (world×IBM=I, A-locaux=bind).

**Convention BAN définitive (ne plus re-tester)**: quaternions xyzw,
positions/rotations LOCALES au parent, clé 0 = pose neutre. Une conversion
abs→local (inv(absParent)×abs) a été essayée et est FAUSSE — les valeurs
sont déjà locales. Le BSK en revanche est ABSOLU (confirmé par
l'importateur Blender: bl_bone.matrix = armature space).

**Bug bonus**: la bascule d'animation est one-shot par état — si elle tirait
pendant le placeholder (aucun squelette), aucune anim ne jouait jamais.
Réinitialisation de playerAnimState quand la référence joueur change.

Vérifié en navigateur: 9 groupes idle en lecture, bbox 0..1,8 m PENDANT
l'animation, bras le long du corps (largeur 1,8 m), 0 erreur GLB.

### ANIMATIONS GÉNÉRALES (perso figé bras en l'air → tout animé) — 2026-10-02 (session 10)

**Bug « bras en l'air »**: le chargeur glTF de Babylon DIFFÈRE ses
linkTransformNode au premier render (_postSceneLoadActions) — le déliage de
play() s'exécutait avant et était annulé juste après → nodes (pose BSK
éparse, bras en V) écrasaient la pose animée. Correctif: re-déliage au frame
suivant (onAfterRenderObservable.addOnce, une fois par squelette) + Cache-
Control: no-cache dans vite.config.ts (le navigateur gardait des GLB
pré-patch en cache heuristique). ⚠️ Bone.linkTransformNode est une MÉTHODE
(toujours truthy) — lire le node réel via getTransformNode().

**Couverture animations (toutes les familles)**:
- index des clips (scripts/build-anims-index.js → anims/index.json,
  3 916 clips) + résolution par fallback dans loadClip: chemin direct →
  index (normalisation des séparateurs bigeyeghost↔bigeye_ghost, alias de
  stems wolf→p_wolf_01) — les clips vivent par RÉGION (mob/china, mob/oasis,
  mob/taklamakan, npc/*, cos/*) pas seulement mob/china.
- Perso: idle standcity + marche walkforward + COURSE runforward quand
  moveSpeed > 6,5 (monture ×1,67, zerk ×2, /speed) — les deux genres
  (chinaman_/chinawoman_fighter_*).
- Monstres: walk/run/attack01/damage01/die déjà branchés (switchMonsterAnim)
  — désormais résolus toutes régions + pose neutre patchée sur 495 GLB
  (66 persos + 460 mobs/NPC/familiers, scripts/fix-glb-neutral-all.js avec
  idempotence et repli de stem blackrobberarcher_bow→blackrobberarcher).
- NPC: cylindres colorés REMPLACÉS par modèles humains officiels animés
  (chinaman/chinawoman_adventurer assemblés, 1,8 m, idle standcity, genre
  alterné par id) — cylindre conservé en repli (QuestPanel.spawnNpcMesh).
- Vérifié en live: 188 groupes d'animation simultanés (perso 9, NPC ~170,
  mangnyang ×2 spawnés par /spawn), marche 9 groupes walkforward pendant le
  click-to-move puis retour idle, monstres intacts visuellement.

### DÉPLACEMENTS UNIFIÉS (perso figé/glissant au clavier) — 2026-10-02 (session 11)

**Diagnostic**: DEUX systèmes de déplacement coexistaient. Le click-to-move
(Game.updateClickToMove) jouait les vraies animations BAN, mais le CLAVIER
viviait dans CharacterManager.handleMovement — déplacement en AXES MONDE
(non relatif caméra, TODO présent dans le code) et animations PLACEHOLDER
(playAnimation = console.log). En network mode les DEUX tournaient: ZQSD
déplaçait le perso SANS animation → glissement en pose idle = « figé,
déplacements pas naturels ».

**Correctif**: déplacement unifié dans updateClickToMove:
- clavier prioritaire (annule la destination cliquée), direction
  CAMERA-RELATIVE (projection XZ de l'axe de visée), Shift = course
  (×1,6 → animation runforward via seuil 6,5 u/s);
- mêmes animations BAN / hauteur de terrain / sync serveur (moving correct)
  pour clavier et clic; CharacterManager.legacyKeyboardMovement = false en
  mode réseau (plus de double déplacement ni de double sendMove).
- message d'accueil mis à jour (ZQSD caméra-relative, Shift, clic).

Vérifié en live: Z maintenu → 20,7 m parcourus, état walk, 9 groupes
walkforward, orientation vers la marche; Shift+Z → état run, 9 groupes
runforward, 24,7 m; relâche → idle (standcity). Click-to-move inchangé.

### STAMP ANTI-CACHE + CRISE VITE — 2026-10-02 (session 12)

**Perso « toujours figé bras en l'air » malgré tous les fixes**: l'écran
était bon côté serveur/tests — la cause restante était le CACHE HTTP du
navigateur: les entrées GLB stockées AVANT l'en-tête no-cache étaient
reservies sans revalidation (pose pré-patch = bras en V).
- **Correctif durable**: /assets/version.txt (horodatage) écrit par les
  scripts de patch; AssetVersion.init() au boot; AssetConfigManager ajoute
  ?v=<stamp> à chaque URL d'asset → un GLB re-patché change d'URL, cache
  impossible à trommer.
- **Crise Vite au passage** (serveur « ready » mais ne répond jamais):
  1) cache node_modules/.vite corrompu par le churn de fichiers du jour →
  purge; 2) CINQ processus esbuild ORPHELINS (05:25) — Vite leur parlait sur
  des pipes morts → EPIPE/pend. Purge esbuild + un seul Vite propre = tout
  repart (200 sur /, main.ts, assets versionnés).
- Diagnostic clé: mini-serveur Node HTTP répondait → réseau/Node sains →
  problème Vite seul; TCP accepté mais HTTP muet = event loop bloquée.
- Vérifié en live après réparation: bras BAISSÉS (main Y 9,7 < épaule 14,9),
  0/26 os liés, bbox 0..1,8, 180 anims, marche clavier 13,2 m avec 9 groupes
  walkforward puis idle au relâchement.
