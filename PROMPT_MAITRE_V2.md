# PROMPT MAÎTRE V2 — SRObro : d'un MVP audité à « égal à Silkroad Online »

> Prompt autoportant, successeur de `PROMPT_MAITRE.md` (dont les 7 phases + audit 8/8 SONT
> TERMINÉS — voir `docs/audit/AUDIT_FINAL.md` et `Avancement.md`). Cette V2 amène le jeu de
> « jouable de bout en bout » à « **égal à Silkroad Online** » en s'appuyant sur :
> 1. **les données officielles extraites** pendant la campagne de recherche 2026-10
>    (DB serveur vSRO parsée + skilldata serveur parsé → CSV dans le dépôt) ;
> 2. **la base de connaissances vérifiée** `docs/SRO_KNOWLEDGE_BASE/` (~38 000 lignes sourcées,
>    22 rapports dans `ML_RESEARCH/`) : formules, taux, timers, coordonnées, systèmes ;
> 3. **le client officiel complet en local** `C:\Program Files (x86)\Silkroad`
>    (Data.pk2 3,2 Go, Map.pk2 1,3 Go, Media.pk2 927 Mo, **Music.pk2 et Particles.pk2 non
>    encore extraits**), via le pipeline d'assets existant ;
> 4. la **stack actuelle** : client BabylonJS 8 (Vite :3000) + serveur Node/TS autoritaire
>    (Socket.io :3001, Prisma/PostgreSQL hôte **5544**, Redis 6379 mdp `srobro123`).

---

## 0. ÉTAT DE DÉPART (vérifié — NE PAS REFAIRE)

### 0.1 Acquis V1 (chacun prouvé par l'audit filmé 8/8)
- Auth (bcrypt, tokens, 2 onglets = 2 comptes), création perso CH/EU, persistance complète.
- Combat autoritaire : ciblage proxy-picking, auto-attaque, **3 skills** (cooldown/MP),
  dégâts, mort/respawn, loot cliquable, XP/or, snapshots monde 20 Hz.
- Inventaire 45 slots + **21 529 items officiels** (prix col 26), icônes DDJ→PNG,
  équipement avec stats, boutique achat/vente, kit de départ.
- Courbe XP officielle (leveldata cumulée), masteries (modèle base), statPoints UI,
  18 quêtes seedées.
- Multi-joueurs : visibilité mutuelle, chat + /who /loc, loot propriétaire 30 s.
- Admin : rôle gm/admin, **22 commandes GM**, taux live Redis sans reboot (mesuré ×5),
  console web `/admin` (dashboard, navigateur 21 529 items + 7 825 monstres, KillLog).
- Minimap officielle (tuiles Media, ancre 69×71), mort animée, audio (1 piste Jangan),
  0 erreur console, 60 FPS, tsc 0/0.
- Monde : **Jangan uniquement** (terrain réel, 1 534 bâtiments au mètre près, 13 camps
  de monstres seedés).

### 0.2 Modules serveur DÉJÀ ÉCRITS mais NON intégrés au jeu réel (à auditer d'abord !)
Issus du commit MVP « gameplay systems » — le code existe, l'intégration données/UI/réseau
reste à faire (vérifier l'état réel avant d'écrire du neuf, ces modules datent d'avant
l'audit) : `server/src/alchemy/` (473 l.), `casting/` (232), `fortress/` (538), `guild/`
(826), `job/` (702), `mount/` (346), `pvp/` (735), `stall/` (594), `quest/` (795 + data),
`drop/` (290), `hotkey/` (260).

### 0.3 Les données officielles maintenant DISPONIBLES (le trésor de la campagne 2026-10)
**CSV extraits — `docs/SRO_KNOWLEDGE_BASE/ML_RESEARCH/data/` :**
| Fichier | Contenu | Usage SRObro |
|---|---|---|
| `monsters_vsro188.csv` | **7 157 monstres** (codename, niveau, HP, MP, EXP, atk min/max, parade, rareté, vitesses) — stats SERVEUR officielles | Remplacer TOUTE stat de monstre approximative ; EXP par mob enfin officielle |
| `uniques_vsro188.csv` | 830 uniques/rares (dont HP/EXP exacts : Tiger Girl 598 720 HP / 451 200 EXP, Roc 1,45 Md) | Boss du monde |
| `monsters_cap120.csv` | 1 442 monstres cap 120 (Jupiter : Jupiter 40,1 M, Baal 55,4 M HP) | Extension tardive |
| `skills_detail_CH.csv` / `skills_detail_EU.csv` | **6 909 skills par niveau** (3 272 CH / 3 637 EU) : % dégâts FIXE par série + part fixe, MP, HP, cooldowns (Prepare/Cast/Action/Reuse ms), portée, mastery+niveau requis, coût SP, armes | Moteur de skills générique complet |
| `skills_series.csv`, `skills_masteries.csv` | 566 séries / 14 maîtrises, structure des books | Arbres de skills |
| `zones_vsro188.csv` | 17 zones (agrégats niveaux/monstres) | Peuplement par zone |

**Base de connaissances — `docs/SRO_KNOWLEDGE_BASE/` (données VÉRIFIÉES, sourcées) :**
- Formules de combat complètes : `28_ADVANCED_MECHANICS.md` (dégâts, crit = 2×PHY+MAG,
  crit sur 14 séries seulement, AR/PR, balance, HP=20×lvl+STR×8+INT×2).
- Taux d'alchimie réels dépackés : `05_ALCHEMY_SYSTEM.md` (élixir seul 50/40/30/19/17/12,
  +Lucky Powder → 100/70/50/27/25/20, échec reset +0, dès +5 : 50 % destruction/50 % malus).
- Degrés/sets/armes avec noms+IDs réels : `07_ITEM_DEGREES.md`, `ITEMS_DATABASE.md`,
  `08_ARMOR_TYPES.md` ; blues : `05` (structure _RefMagicOpt) ; SOS/SOM/SOSun : `06`.
- Jobs/trade : `09`→`12`, `35` (étoiles = valeur goods, 1 NPC thief/étoile, cheval 16 k /
  chameau 21 k, Thief Town via Gisaeng Yumi, wanted 3 000+, taux 162 % Jangan→Donwhang).
- Guildes 1-5 (GP=SP, L5=50 membres, union dès L2) : `17` ; party Each Get 4 / Auto Share 8,
  +3 %/membre : `18` ; Fortress War (vendredi 20 h, cœur/tours/étendards, taxes ±20 %) : `19`.
- PvP/PK (murderer 500/1000/2000, drop 5→100 % selon points, capes) : `20`.
- Uniques + spawns + timers (Tab_RefNest : 6 h classique, Uruchi 3 h, Medusa 4 h ;
  Medusa spawns 04/10/16/22, mécaniques chiffrées) : `15`, `MONSTERS_SPAWN_LOCATIONS.md`.
- Zones/villes/NPCs : 697 NPCs + 161 téléporteurs xSROMap avec formule de conversion
  `PosX=((Region&0xFF)−135)×192+X/10` : `13`, `NPCS_COORDINATES.md`, `CITIES_*.md`,
  `MAP_COORDINATES_REFERENCE.md`.
- Quêtes (Jangan ~22, Donwhang ~25, repeat limits, Blue Zerk) : `16` ; XP/gap : `25`/`26`
  (GAP ±10 %/niveau, gap 9 = 10 % XP/190 % SP, 400 SXP = 1 SP).
- FGW/Qin-Shi/Job Temple : `29`, `15` ; pets/mounts (loup 1 M, HGP, 12 fellows) : `24` ;
  consommables (heals par palier, formule pulses 1 s) : `21`.
- Technique (opcodes, handshake 0x5000, architecture, server.cfg, commandes GM officielles) :
  `TECHNICAL_SPECIFICATIONS.md`, `39_PRIVATE_SERVERS.md`.
- **Règle absolue : toute donnée de jeu doit venir de ces sources ou du client local.
  JAMAIS réintroduire un chiffre non sourcé.**

### 0.4 Conventions & pièges établis (RESPECTER — chaque violation a coûté des heures)
Reprendre intégralement §0.2 et §0.3 de `PROMPT_MAITRE.md`, PLUS :
- **Packets S2C enveloppés** `{type,timestamp,data}` → champs à `packet.data.X` ; les
  handlers legacy doivent déballeur (`data?.data ?? data`).
- **`broadcastToNearbyClients` EXCLUT la source** → renvoyer ses propres packets à l'attaquant.
- **Express 4 n'attrape pas les promesses rejetées async** → wrapper `aw()` + `Number()`
  avant `res.json` (BigInt `Item.price` !).
- **Timeout inactivité 30 s** → heartbeat < 30 s partout (client + scripts de test).
- **Restart serveur = mort des entités** → purge client au `connected` + ré-auth auto.
- **Meshes GLTF skinées se pickent en bind pose** → proxy invisible par entité.
- **Anims par transition d'état uniquement** (sinon fetch ×45/s → 9 FPS).
- **Minimap** : tuile `{rx}x{rz}.webp`, rx=69+floor(x/1920), rz=71+floor(z/1920).
- **tsx watch ne voit pas les écritures de scripts externes** → restart serveur à la main
  après tout patch programmatique.
- Un test qui sélectionne le perso d'un onglet resté ouvert = ping-pong auth:kicked →
  **perso dédié aux tests** (jamais le perso d'un onglet actif).

### 0.5 Méthode de vérification imposée (le « done » se prouve)
Inchangée : santé `curl localhost:3001/health`, preuves navigateur mesurées (captures,
pixels, deltas), **60 FPS**, `npx tsc --noEmit` 0/0 serveur, un commit par phase (fr).
**Interdiction de déclarer terminé sans preuve mesurée.**

---

## 1. OBJECTIF FINAL

Un joueur vit l'expérience Silkroad complète **dans le monde classique (Chine, cap 90)** :
il parcourt Jangan→Donwhang→Hotan→Karakoram→Taklamakan→Roc Mountain à pied ou en téléporteur
officiel, croise la vraie faune (des milliers de mobs aux stats serveur exactes) et les 7
uniques au timer officiel, monte ses 7 maîtrises CH (ou 2 maîtrises EU) avec les vrais skills
chiffrés, s'équipe d'items avec blues, fait de l'alchimie aux vrais taux, du trade sous
étoiles avec vols de thieves, monte sa guilde, fait du party 8, du PvP à capes, des stalls,
des donjons FGW/Qin-Shi avec mécaniques de boss, monte son loup, et tout persiste.
**Le contenu post-cap 90 (Europe/Égypte 110-120, KSRO 12D+) est HORS PÉRIMÈTRE V2**
(phase optionnelle I à la toute fin si tout le reste est validé).

---

## 2. PHASES V2 (ordre imposé ; critères d'acceptation mesurables)

### PHASE A — Injecter les données officielles (le socle de tout)
1. **Étape 0 obligatoire : audit des modules §0.2** — pour chacun (alchemy, guild, job,
   stall, pvp, fortress, mount, quest, drop, hotkey, casting) : lire, documenter l'état
   (implémentation/réseau/UI/données), décider garder-réécrire. Rendu : tableau dans
   `Avancement.md` avant toute écriture.
2. **Monstres** : importer `monsters_vsro188.csv` + `uniques_vsro188.csv` dans
   `GameDataService`/Prisma (remplacer stats approximatives). Chaque mob du monde = HP/MP/
   EXP/atk/parry/rareté exacts du CSV. Vérif : Mangnyang et Bunwang identiques au CSV,
   EXP affichée = colonne EXP.
3. **Skills** : importer `skills_detail_CH/EU.csv` + `skills_series.csv`. Moteur générique :
   dégâts = %fixe(arme/skill base) + part fixe (montée par niveau) — cf. découverte
   « % FIXE par série » ; cooldowns Prepare/Cast/Reuse réels en ms ; MP ; portée ; armes
   requises ; groupes de cooldown (ex. Meteor↔Fire Bolt 3 s/10 s via colonne de groupe).
4. **Formules de combat** : brancher `28_ADVANCED_MECHANICS.md` (dégâts phy/mag complets,
   AR/PR jets, crit = 2×PHY+MAG uniquement si la série a le tag crit — 14 séries, aucun
   nuke/imbue, absorb, balance).
5. **GAP/SP** : implémenter gap 0-9 (±10 %/niveau, ×19,4 SP à gap 9 — tables `26_SP_FARMING.md`),
   400 SXP = 1 SP, malus/bonus d'écart de niveau monstre (`25_LEVELING_GUIDE.md`, +30 % à +10 lv).
- **Critères** : un GM `/mobinfo MOB_CH_TIGERWOMAN` affiche 598 720 HP / 451 200 EXP du CSV ;
  un Strike Smash lvl 1 inflige exactement la formule (capture des deux chiffres comparés) ;
  tuer un mob à gap 9 rend ~1,9× SP mesuré.

### PHASE B — Le monde chinois complet (cap 90)
1. **Étendre le pipeline terrain** aux régions manquantes : scripts existants paramétrés
   par région (`extract-region-heightmaps.ts`, `parse-map-objects.ts` — la grille Jangan
   63-77 est faite, généraliser). Couvrir : Plaine de Chine (Jangan→Donwhang), route de la
   soie, Oasis (Hotan), Karakoram, Taklamakan, Roc Mountain. S'appuyer sur `13_ZONES_OVERVIEW.md`
   (régions + niveaux) et `MAP_COORDINATES_REFERENCE.md` (8 Dimensional Gates, ferries).
2. **Streaming de régions** : chargement/déchargement dynamique autour du joueur (rayon 2
   régions), LOD/octree pour tenir 60 FPS hors ville ; transitions sans couture.
3. **Téléporteurs officiels** : les 161 téléporteurs de `NPCS_COORDINATES.md` avec coûts,
   niveaux requis et destinations réels (réseau Jangan↔Donwhang↔Hotan + gates).
4. **Villes** : Donwhang puis Hotan complètes (bâtiments MAPO + NPCs aux coordonnées xSROMap
   — noms officiels dans `CITIES_02/03` : Blacksmith Agol, Grocery Yeosun, Stable...).
5. **Peuplement** : spawn par zone selon `14_MONSTER_GUIDE.md` + `MONSTERS_SPAWN_LOCATIONS.md`
   (spots réels : bandits 10-17, Penons 26-28, Ongs 33-34 Karakoram, Niyas 62-80 Taklamakan,
   etc.), densités croissantes, respawn 15-30 s (mobs).
6. **Les 7 uniques classiques** : Tiger Girl (20), Cerberus (24), Captain Ivy (30), Uruchi (40),
   Isyutaru (60), Lord Yarkan (80), Demon Shaitan (90) — HP/EXP du CSV, spawns documentés,
   timers 6 h (Uruchi 3 h), **annonce serveur au spawn** (comportement officiel), drops SoX.
- **Critères** : trajet à pied Jangan→Donwhang filmé sans trou de terrain ni chute FPS > 10 s ;
  téléport payé et facturé ; Tiger Girl spawn avec annonce, tuée par GM, respawn au timer.

### PHASE C — Classes et skills COMPLETS
1. **7 maîtrises CH** : apprentissage chez les NPCs maîtres (coûts SP par niveau du CSV),
   arbres complets par série (les vrais noms iSRO — `SKILLS_DATABASE_CHINESE.md`), réskill
   80 % (quête), plafond mastery = niveau (cap 300).
2. **Séries emblématiques câlées** : Bicheon KD→stabs (Hidden Blade→Killing Heaven Blade ×2
   au sol), Heuksal Soul Departs (stun), Pacheon Anti Devil (crit +20), imbues Fire/Cold/
   Lightning (dégâts % de la skill, proc status 32→65 %, effet = 2×niveau−1, 6 s), nukes
   (PreparingTime 1 000 ms visible, pas de crit), buffs/passifs (Flame Body, Snow Shield...),
   Force (heal, rez, cure) — valeurs du CSV uniquement.
3. **Berserker** : 5 orbs (~1/3 mobs), ×2 dégâts, blue zerk (titres) optionnel.
4. **6 maîtrises EU** (si EU jouable dès la V2 : oui) : 2 maîtrises max, plafond 2×lvl,
   Wizard/Cleric/Warrior/Rogue/Bard/Warlock avec les 3 637 skills EU du CSV (Meteor 439 %
   2 hits CD 10,5 s, Pain Quota 5 min, Healing Orbit 1 819→4 722...), pot delay EU 15 s.
5. **UI skills** : fenêtre des maîtrises (livres par série), apprentissage, glisser-déposer
   barres F1-F8, tooltips complets (MP/CD/dégâts).
- **Critères** : un blader apprend Bicheon 1-30, enchaîne KD→2 stabs sur un Ong (dégâts du
  CSV) ; un Wiz/Cleric duo : Meteor + heal de zone fonctionnels en party.

### PHASE D — Équipement, alchimie, économie réelle
1. **Alchimie** (taux DB `05_ALCHEMY_SYSTEM.md`) : enhancement +0→+12 (50/40/30/19/17/12,
   +Lucky Powder par degré → 100/70/50/27/25/20), échec = reset +0, dès +5 : 50 %
   destruction / 50 % malus durabilité, Immortal/Astral/Steady, élixirs par degré, pierre
   d'assimilation (tablets + éléments → blues), advanced elixirs +1/+2 garantis.
2. **Blues par degré** (structure `_RefMagicOptByItemOptLevel`, schémas `39_PRIVATE_SERVERS.md`
   §Tables ; plages : générer à défaut d'après `05`/`08`, marqué non-officiel) : str/int/
   lucky/steady/immortal/astral/crit%...
3. **Seal of Star/Moon/Sun** : drops rares (SOS=+5 lv équivalent...), rareté par couleur de
   mob (verts −6 lv = meilleur taux SoX — `22_ECONOMY_GOLD.md`).
4. **Durabilité/réparation**, malus, coûts NPC (ratios de revente par degré documentés).
5. **Stalls joueurs** : ouverture partout en ville, 10 items, frais 1 % plafonnés 100 k,
   recherche réseau (stall network window) ; **consignation** NPC Juel (Hotan) 3 jours.
6. **Drops** : tables par monstre (fallback équilibré + drops documentés `14`/`15` : uniques →
   SoX/élixirs/pierres ; Gold = EXP×1,3 constaté serveur).
- **Critères** : 100 essais GM +0→+1 = ~100 %, +4→+5 ≈ 27 % avec powder (±10 pts), reset
  constaté ; destruction à +5 observée ; un SOS dropé puis vendu au stall d'un 2ᵉ joueur.

### PHASE E — Le triangle des jobs (trade complet)
1. **Trader** : marchandises spécialités par ville (noms réels `10_TRADER_GUIDE.md`), achat
   NPC, transport cheval (~16 k charge) / chameau (~21 k, +HP), étoiles selon valeur (1 NPC
   thief par étoile en embuscade), revente : profit de référence 162 % Jangan→Donwhang,
   fluctuation du marché, goods au sol si transport tué.
2. **Thief** : inscription Thief Town (téléport Gisaeng Yumi ~2 k), scroll Bandit Den,
   vol pas-à-pas (tuer trader → transport → loot → vendre au den), job suit 10 k/1 M,
   arrange points ≥ 3 000 = Wanted (amende, drop), purge par mort/amende Hunter Guild.
3. **Hunter** : contrat, XP directe au kill des NPC thieves, part de la vente versée à la
   banque de l'union (hebdo), suit.
4. **Rangs 1-7** par job (XP job, titres), changement de métier = 7 jours sans profession.
- **Critères** : trade 2★ Jangan→Donwhang complet filmé avec embuscade d'un NPC thief ;
  un 2ᵉ joueur en thief vole le chargement et le revend ; le hunter est payé.

### PHASE F — Social : guildes, partys, PvP
1. **Guildes** (`17_GUILD_SYSTEM.md`) : création 500 k, niveaux 1-5 (GP = SP gagnés,
   L2=20/3 M → L5=50 membres), storage dès L2, union dès L2 (8 guildes), emblème, droits
   officer, pénalité 3 jours, guild war (hostilité déclarée, PvP sans murder).
2. **Party** (`18_PARTY_SYSTEM.md`) : Each Get (4, sans distance) vs Auto Share (8, distance,
   bonus ~+3 %/membre), distribution à tour de rôle du loot, matching window, PLvL moyenne
   ≤ niveau mob = double EXP/SP.
3. **PvP/PK** (`20_PVP_PK_SYSTEM.md`) : capes 4 couleurs, duels, murderer (500/1000/2000
   points, −1 à −5/monstre ≥ niveau), drops à la mort 5→100 % (table florian0), EXP loss,
   statut visible, immunité 1★ < 40 en job.
4. **Fortress War simplifiée mais réelle** (`19_FORTRESS_WAR.md`) : Jangan Fortress, créneau
   hebdo programmable (défaut vendredi 20 h, 2 h), inscription guilde, portes→tours→cœur,
   3 étendards (+10 % dmg / +10 % absorb / +5 % HP-MP), occupation + taxes sur les
   NPC/stalls/téléports de la zone (−20 %→+20 %).
- **Critères** : guilde créée, montée L2 (GP visibles), union de 2 guildes ; party 8 Auto
  Share en farm avec bonus mesuré ; PK 3 joueurs → murderer, mort → item droppé (roll ≤30 %) ;
  FW jouée 15 min compresses avec prise du cœur et taxe appliquée à un achat NPC.

### PHASE G — Donjons, uniques de fin, quêtes
1. **FGW** (`29_FORGOTTEN_WORLD.md`) : 4 tranches Togui 35-70 (la cible cap 90), entrée par
   Dimension Hole, talismans (raretés), grades 1★-4★ (types de mobs + limite party 4/8),
   Elder Earth Ghost (adds 15 % HP), récompenses par collection (D8 Sun...), timers
   (instance 2 h, cooldown 3 h, Recall Tower).
2. **Qin-Shi Tomb B1-B6** (`15_UNIQUE_BOSSES.md` §Medusa) : accès par paliers, 4 gardiens B5
   (HP du CSV), **Medusa/BeakYung** : 183 535 199 HP, attaques 12,6-14 k, 20 cibles/15 m,
   Bind 50 %/Petrify/Fear 100 %-10 s, spawns 04/10/16/22 + Sarin Gate, drops 11D+.
   → un boss de raid « vrai » : party 8 obligatoire, mécaniques actives esquivables.
3. **Quêtes officielles** : lignes Jangan (~22, `16_QUEST_SYSTEM.md` avec NPCs/préreches/
   récompenses) + Donwhang (~25), repeat limits (×1/2/3/5/7), journal de quêtes UI, chaîne
   titre « Blue Zerk » (kills en zerk, Energy of Life 1/20 min) jusqu'où le cap le permet.
4. **Events système** : scheduler serveur (events rate XP/SP/drop configurables `/admin`,
   monstres d'event, NPC So-OK d'échange) — le moteur d'events, pas les events historiques.
- **Critères** : FGW 1★ Togui complété par une party 4 avec talismans remis au NPC ;
  Medusa engagée (première phase + un gardien tué) avec Petrify esquivée ; 5 quêtes Jangan
  rendues avec récompenses exactes ; un event rate ×2 activé live et mesuré.

### PHASE H — Pets/mounts, UI « Silkroad », audio, perf (finitions)
1. **Mounts/pets** (`24_MOUNTS_PETS.md`) : cheval basic (2× vitesse, 9 slots, soins HGP,
   stats ÷2 sous 30 % de faim), loup growth (achat 1 M Stable, lv 1→40, combat), pet
   ramasseur (inventaire propre, 28 jours), Grass of Life 50 k (rez).
2. **UI complète façon SRO** : fenêtre perso (stats/masteries), fenêtre skills, journal
   quêtes, fenêtre party (invites, kick), échange joueur-joueur, carte du monde (M) avec
   téléports découverts, options (audio/gamma), raccourcis A (inventaire) S (perso)...
   (`hotkey/` serveur existe).
3. **Audio complet** : extraire `Music.pk2` (72 Mo) → playlist par zone (Jangan/Donwhang/
   Hotan/combat), SFX coups/skills/level-up/trade depuis `assets/pk2_data/prim/snd`.
4. **Particles.pk2** (175 Mo, non extrait) : effets de skills principaux (nukes, heals,
   imbues) — convertir si le format (efp/particle) est décodable, sinon fallback Babylon.
5. **Perf/stabilité** : streaming B, LOD, culling ; 60 FPS en ville ET en RvR 8 joueurs ;
  reconnexion auto ; zéro console.error sur 15 min filmées avec 3 clients.
- **Critères** : loup acheté, nourri, monte du niveau en combattant aux côtés du joueur ;
  playlist change en changeant de zone ; 3 clients + FW locale sans chute < 50 FPS.

### PHASE I (OPTIONNELLE, seulement si 0-9 tout vert) — Extension cap 110/120
Europe (Constantinople + races EU hors Chine), Égypte (Alexandria, `CITIES_04`), Job Temple
(AP + 7 uniques HP du CSV), cap 110-120, degrés 10-11 (données `07` §KSRO). Le contenu
KSRO 12D+ (Jupiter/Bagdad) reste hors scope — données disponibles dans `ML_RESEARCH/` si
un jour nécessaire.

---

## 3. RÈGLES D'INGÉNIERIE (non négociables — reprises + nouvelles)
1. **Données officielles d'abord** : CSV `ML_RESEARCH/data/` > client local extrait >
   base de connaissances sourcée > équilibrage maison marqué `[APPROX]`. **Jamais de
   chiffre inventé** ; toute approximation doit être tracée `[APPROX]` en commentaire.
2. **Serveur autoritaire** (inchangé) ; tolérance aux pannes (inchangé) ; TS vert (inchangé).
3. **Ne jamais committer les assets** (gitignorés) ni les PK2 ; licence : jamais copier de
   code AGPL (opensro/skrillax = lecture de comportement uniquement).
4. **Un commit par phase** (message français impératif), pas de régression des 8 critères
   de l'audit V1 (re-tester après chaque phase : les 8 points de `docs/audit/AUDIT_FINAL.md`).
5. **Périmètre gardé** : cap 90 monde classique. Toute idée hors scope → noter dans
   `Avancement.md` § Backlog, ne pas implémenter.
6. Si une donnée officielle fait défaut : chercher dans `ML_RESEARCH/` et la KB D'ABORD,
   puis recherche web ciblée, EN DERNIEUX équilibrage marqué `[APPROX]`.

---

## 4. MÉMO EXÉCUTABLE (commandes & entrées)

```bash
# Démarrage (inchangé)
docker compose up -d postgres redis
cd server && npm run dev      # :3001 (PG 5544, .env présent)
cd client && npm run dev      # :3000

# Nouvelles données à importer (PHASE A)
# CSV: docs/SRO_KNOWLEDGE_BASE/ML_RESEARCH/data/*.csv  (monstres/skills/uniques/zones)
npx tsx scripts/import-official-csv.ts        # à créer (parse CSV → Prisma/GameDataService)

# Pipeline assets (inchangé, sources assets/pk2_* ; PK2 source = C:\Program Files (x86)\Silkroad)
tools/veykril-pk2/target/release/pk2_mate.exe extract --archive "C:\Program Files (x86)\Silkroad\Music.pk2" --out assets/pk2_music   # PHASE H (nouveau)
tools/veykril-pk2/target/release/pk2_mate.exe extract --archive "C:\Program Files (x86)\Silkroad\Particles.pk2" --out assets/pk2_particles
tools/rust-jmx-converter/target/release/jmx_converter.exe --input <in> --output <out> [--mode ddj]
npx tsx scripts/extract-region-heightmaps.ts <rmin> <rmax> <rmin2> <rmax2>   # PHASE B : généraliser
npx tsx scripts/parse-map-objects.ts <rx> <rz> <rayon>                      # PHASE B : villes suivantes
```

**Entrées code** : voir §4 de `PROMPT_MAITRE.md` (toujours valables) + `server/src/{alchemy,
guild,job,stall,pvp,fortress,mount,quest,drop,casting,hotkey}/` (modules à auditer/intégrer),
`shared/src` (constantes maîtrises), `server/data/game/*.json` (21 529 items / 7 825 mobs /
36 008 skills actuels — à mettre à jour depuis les CSV où plus précis).

---

## 5. DÉFINITION DE « ÉGAL À SILKROAD ONLINE » (audit final V2, filmé)

Le V2 est terminé quand TOUT ceci est démontré en une session filmée :
1. **Voyage** : Jangan → Donwhang → Hotan (à pied + téléport payant), zones sauvages
   peuplées (Ongs/Niyas vérifiés `/mobinfo`), sans chute de FPS ni trou de terrain.
2. **Unique** : Tiger Girl annonce son spawn, est tuée (HP exact du CSV), respawn au timer.
3. **Classe** : un perso CH complet (une maîtrise d'arme + un élément + imbue) et un duo
   EU (Wiz+Cleric) joués avec skills aux valeurs du CSV (dégâts/CD/MP affichés et justes).
4. **Économie** : +5 d'alchimie avec destruction constatée, SOS dropé, stall acheté,
   repair/durabilité, consignation.
5. **Trade** : un run 2★ complet Jangan→Donwhang avec embuscade + un vol de thief réussi
   par un 2ᵉ compte + paie du hunter.
6. **Social** : guilde L2 + union, party 8 Auto Share (bonus mesuré), PK→murderer→drop,
   Fortress War locale gagnée avec taxe appliquée.
7. **Donjons** : FGW 1★ complété (party 4, talismans), Medusa engagée avec mécaniques
   (Bind/Petrify esquivés), 5 quêtes officielles rendues.
8. **Confort** : loup qui combat, playlist par zone, UI complète (perso/skills/quetes/
   party/exchange/carte), 3 clients simultanés sans erreur console, 60 FPS ville,
   `tsc` 0/0, persistance après relance.

En cas de blocage : `Avancement.md` (sessions 1-8, chaque piège documenté), puis la KB
(`docs/SRO_KNOWLEDGE_BASE/`), puis `ML_RESEARCH/` (rapports sourcés), enfin recherche web.
