# Forgotten World - Guide Complet

> ⚠️ **Révision majeure (2026-10)** : fichier reconstruit à partir du wikitext complet du wiki Fandom (Silkroad Online Wiki), des guides PlayOrigin (Togui Village / Flame Mountain), du tutorial Seidenkraft, du tutorial elitepvpers et des scripts communautaires ProjectHax. La version précédente contenait de **grosses erreurs sur les tranches de niveaux et les noms de donjons** (Green Abyss/Sea of Resentment mal placés, « Temple of Egypt » inexistant, Sereness présenté comme boss de tous les donjons) — tout est corrigé ci-dessous.

## 📋 Table des Matières
- [Introduction](#-introduction)
- [Conditions d'Entrée (Dimension Hole)](#-conditions-dentrée-dimension-hole)
- [Les 4 Donjons (noms et niveaux VÉRIFIÉS)](#-les-4-donjons-noms-et-niveaux-vérifiés)
- [Système de Difficulté (Grades 1★-4★)](#-système-de-difficulté-grades-1-4)
- [Structure d'une Instance](#-structure-dune-instance)
- [Boss, Uniques et Monstres](#-boss-uniques-et-monstres)
- [Tables HP des uniques par tranche et grade](#-tables-hp-des-uniques-par-tranche-et-grade-recherche-tr-2026-10)
- [Système de Talismans (Collections)](#-système-de-talismans-collections)
- [Quêtes du Forgotten World](#-quêtes-du-forgotten-world)
- [Récompenses](#-récompenses)
- [Stratégies de Groupe](#-stratégies-de-groupe)
- [Forgotten Coins (variante private servers)](#-forgotten-coins-variante-private-servers)
- [Donjons Liés (Job Temple, Qin-Shi Tomb, Holy Water Temple)](#-donjons-liés-job-temple-qin-shi-tomb-holy-water-temple)
- [Implémentation Technique](#-implémentation-technique)
- [FAQ](#-faq)
- [Incertitudes / Données Manquantes](#-incertitudes--données-manquantes)
- [Sources](#-sources)

---

## 🎯 Introduction

**Le Forgotten World (FW / FGW)** est le système de donjons instanciés introduit avec **Legend VI**. Chaque joueur (ou party) obtient **sa propre instance**. C'est la **seule source de talismans** du jeu, échangeables contre des armes scellées haut de gamme (jusqu'au degré 11 Seal of Nova).

### Points Clés (vérifiés)
- ✅ Joueurs de **niveau 35 à 110**
- ✅ **4 donjons** : Togui Village, Flame Mountain, Shipwreck – The Green Abyss, Shipwreck – The Sea of Resentment
- ✅ Accès via **Dimension Hole** obtenue en tuant des **Envies** (spawnées par un **Dimension Pillar**)
- ✅ **4 grades de difficulté** (1★-4★) : type de monstres, limite de party et taux de drop de talismans
- ✅ **Collections de 8 talismans** → arme scellée (SUN D8/D9, MOON D10, NOVA D11)
- ✅ La jauge **berserker est rechargée après chaque unique tué**

> 🇰🇷 **Note KSRO (recherche KO2 2026-10)** : en Corée, le Forgotten World est arrivé **5 mois plus tôt** — **Legend X « 잊혀진 세계 », 28/07/2010** (cap 110, avec la vente en consignation 위탁 판매), contre Legend VI le 20/12/2010 sur iSRO. Le patch coréen **Rebirth (27/06/2012)** a ensuite **retravaillé le 잊혀진 세계** (avec suppression des quêtes obsolètes et révision des positions de monstres — notices KR K20/K22). Le FGW n'est **pas** le système des donjons tardifs coréens (Jupiter 2011, Bagdad 2014, Shambhala 2018, Legend 23) : ceux-ci sont des donjons/donjons de champ séparés — voir le renvoi en fin de fiche. Sources : [ML_RESEARCH/RESEARCH_KO2_CHRONO.md](ML_RESEARCH/RESEARCH_KO2_CHRONO.md) · [RESEARCH_KO2_WORLD.md](ML_RESEARCH/RESEARCH_KO2_WORLD.md).

---

## 🔑 Conditions d'Entrée (Dimension Hole)

### Chaîne d'accès : Pillar → Envies → Hole

1. **Dimension Pillar** : pilier-cristal qui spawn **aléatoirement dans le monde** (hors villes), par paliers de niveau : **35-50, 51-60, 61-70, 71-80, 81-90**. ℹ️ Le palier 91-100 a été **retiré du spawn sur les serveurs officiels**. Il n'existe pas de carte statique : les piliers apparaissent dans les zones de chasse correspondant à leur palier.
2. Détruire le pilier fait spawner des monstres **Envy**. ⚠️ Les Envies en groupe font **très mal** — un build INT en dessous du level ~120 doit fuir (Seidenkraft).
3. Tuer les Envies peut dropper une **Dimension Hole** (ticket d'entrée). Les trous ont un **grade (1-4)** et un **niveau** — utilisables seulement si votre niveau correspond.
4. La Dimension Hole doit être activée **dans une ville** : clic droit → confirmation → un téléporteur **visible uniquement par vous** apparaît à côté.

### Timings et restrictions (wiki Fandom)

| Règle | Valeur |
|---|---|
| Durée de vie de l'item Dimension Hole | **24 h** (supprimé automatiquement) |
| Délai entre 2 activations de Dimension Hole | **30 minutes** |
| Timer de l'instance | **2 heures** pour tuer le boss (le donjon disparaît ensuite → retour au point de résurrection) |
| Délai de ré-entrée (tous donjons confondus) | **3 heures** après être entré — ✅ **confirmé par le wiki officiel ZH DiGeam** (pierre réutilisable après 30 min, chaque pierre expire en 24 h, reset possible via un ticket de boutique = le re-entry ticket) |
| Bypass du délai de ré-entrée | **Forgotten World re-entry ticket** (Item Mall) |
| Despawn du Dimension Pillar si vous quittez le donjon | **15 minutes** pour y retourner (sinon le trou disparaît) |
| Sortir réapprovisionner/réparer | Autorisé (retour sous 15 min via Dungeon Exit / Gap of Dimensions) |

### Aider les autres joueurs
Le **leader de party** entre avec sa propre Dimension Hole ; les autres membres (bon niveau) sont téléportés dans **la même instance** via le **Pillar of Party Member Recall**. On peut toujours rejoindre l'instance d'un autre joueur.

> ✅ **Confirmations croisées (recherche gameplay 2026-10)** : le guide Origin « The Forgotten World – Togui Village Instance » (~55 k vues) confirme **instance 2 h / cooldown de ré-entrée 3 h** et précise le **Recall Tower/Pillar** — le master peut rappeler des amis **depuis la ville uniquement, sans costume de job** ; le cristal bleu ne disparaît pas si l'invocateur TP en ville, mais **disparaît après ~15 min** ([guide Origin](https://forum.playorigin.com/showthread.php?73) · [archive intégrale](https://forum.playorigin.com/archive/index.php/t-73.html)).

---

## 🗺️ Les 4 Donjons (noms et niveaux VÉRIFIÉS)

| Donjon | Tranches de niveaux | Récompense Collection Book | NPC de quête |
|---|---|---|---|
| **Togui Village** | **35-50 / 51-60 / 61-70** (3 tranches) | Arme **Degré 8 Seal of Sun** | Merchant Associate **Asaman** (Hotan) |
| **Flame Mountain** | **71-80 / 81-90** (2 tranches) | Arme **Degré 9 Seal of Sun** | Hunter Associate **Ahmok** (Hotan) |
| **Shipwreck – The Green Abyss** | **91-100** | Arme **Degré 10 Seal of Moon** | Guild Manager **Musai** (Hotan) |
| **Shipwreck – The Sea of Resentment** | **101-110** | Arme **Degré 11 Seal of Nova A Power** | Governor **Senmut** (Alexandria, South Palace) |

> 🚫 **Corrections importantes par rapport à l'ancienne version de ce fichier** :
> - « Green Abyss (71-80) » et « Sea of Resentment (81-90) » étaient **faux** : ce sont les deux donjons **Shipwreck** (91-100 et 101-110).
> - « Flame Mountain (61-70) » était faux : Flame Mountain = **71-90**.
> - « Shipwreck Dimension (91-100) » et « Temple of Egypt (101-110) » **n'existent pas** sous ces noms. Les items « égyptiens » (Nova) viennent des drops rares de **Ghost Sereness** dans The Sea of Resentment.
> - « Togui's Tomb » (nom parfois cité) : le nom officiel du donjon est **Togui Village**.

### 🇨🇳 Noms chinois officiels (recherche ZH 2026-10)

> ✅ Le Forgotten World s'appelle **遗忘世界 / 異次元洞(窟)** (« monde oublié / grotte dimensionnelle ») — ⚠️ le nom « 千里之坟 » parfois cité **n'existe dans aucune source chinoise** (requête exacte : zéro résultat jeu). Sources officielles : [wiki DiGeam](https://srowiki.digeam.com/%E7%87%83%E7%87%92%E6%B7%B1%E6%B7%B5-%E7%81%B0%E5%B1%B1) + [silkroad.iccgame.com](https://silkroad.iccgame.com/content-667-49139.html).

| Donjon / élément (iSRO) | Nom chinois officiel | Notes |
|---|---|---|
| FGW (système) | 遗忘世界 / 異次元洞副本 | Entrée : pierre **异次元洞石** (Dimension Hole) lootée sur les **妒鬼** (« spectres de l'envie » = les **Envies** !) après destruction des **异次元柱** (Dimension Pillars) |
| Togui Village | **血灵地狱-土鬼村** (« Enfer de sang - village des démons de terre ») | Tranches 35-70 ; les sources ZH décrivent **6 difficultés** déterminées par le niveau de la pierre + taille du groupe ⚠️ variante CN/TW vs 4 grades iSRO |
| Flame Mountain | **燃烧深渊-火焰山** (« Abysse ardente - montagne de feu ») | 71-90, 4 zones ; séquence officielle des boss : **妒鬼 (Envy) → 熔天魔将 (Général démon fondant) → 红孩儿 (Enfant Rouge) → 牛魔王 (final)** |
| Flame Cow King | **牛魔王** (« Roi-Démon Bœuf ») | ✅ **Confirmé** — le folklore du *Voyage en Occident* est assumé dans le donjon |
| Shipwreck (les 2) | **永恒之海-船舶墓地** (« Mer éternelle - cimetière de navires ») + variante **冰海之心** (« cœur de la mer glacée ») | ZH : 91-100 en 4 niveaux ★-★★★★ et 100-110 en 2 niveaux ★-★★ ⚠️ répartition TW/CN à ne pas confondre avec les 4 grades iSRO |
| Ghost Sereness | **女妖** (« la sirène ») | Droppe **女妖私人的宝藏** (« le trésor privé de la sirène ») |
| Talismans | **收藏卡** (« cartes de collection ») | 8 cartes complètes = 1 arme scellée ; correspondance quasi 1:1 avec les noms iSRO (银项坠 Silver Pendant, 海洋之泪 Cobalt Emerald, 航海日志 Logbook, 情书 Love Letter, 女人的肖像 Portrait, 财宝箱 Jewelry Box, 钻石表 Diamond Watch, 人鱼的眼泪 Mermaid's Tears) |
| Faded Beads | **失去光泽的珠子** (« perle qui a perdu son éclat ») | SP aléatoires à l'usage |
| NPC de remise Green Abyss | **武萨伊** (Guild Manager **Musai**, Hotan) | Récompense **第十套月亮印章** (« D10 Seal of Moon ») — ✅ confirme la ligne « Green Abyss 91-100 → D10 SOM » |
| NPC de quête Sea of Resentment (TW) | **森姆特** (vice-roi **Senmut**) | Récompense **彗星武神武器** (arme Nova) |

---

## ⭐ Système de Difficulté (Grades 1★-4★)

La difficulté est portée par la **Dimension Hole elle-même** (grade affiché sur l'item). Contrairement à une croyance répandue :

- ❌ Les grades ne changent **pas** les HP/dégâts des uniques. ⚠️ **Conflit signalé (recherche TR 2026-10)** : les guides SroLobby donnent des **niveaux ET HP différents par grade** (ex. Flame Captain Lv73 en 1★ → Lv79 en 4★, HP ×6-7) — soit des variantes de monstres par grade, soit une spécificité vSRO ; le wiki Fandom (source de la règle « HP inchangés ») et la série TR divergent → **à trancher sur le client**.
- ✅ Les grades changent le **type de monstres**, la **limite de party** et le **taux de drop des talismans** (grade supérieur = bien meilleures chances).

| Grade | Type de monstres | Limite de party | Notes |
|---|---|---|---|
| **Grade 1 ★** | Normal (**General**) | **4 joueurs** | Faisable en petit groupe / haut niveau bien stuffé |
| **Grade 2 ★★** | Champion | **4 joueurs** | Solo possible pour un level 120 correctement équipé (Seidenkraft) |
| **Grade 3 ★★★** | **Elite** — ✅ Résolu (recherche TR 2026-10) | **8 joueurs** | Conçu pour party ; la disposition des boxes change |
| **Grade 4 ★★★★** | **Elite** — ✅ Résolu (recherche TR 2026-10) | **8 joueurs** | « Hardcore » : full party coordonnée, wipes faciles, meilleurs taux de talismans |

> ✅ **Types exacts par grade (guides TR SroLobby + SroMax)** : 1★ = mobs normaux type **General** (les **Envies = Champion**) ; 2★ = Champion/Elite ; **3★-4★ = Elite**. Party : 1-2★ = 4 joueurs, 3-4★ = 8 joueurs — résout l'ancien « ??? » du wiki Fandom.

**Règle d'accès aux grades 3-4** : uniquement au-dessus du **level 70** — les Envies de niveau < 71 ne droppent jamais de trou de grade supérieur à 2 (wiki Fandom).

> 🇨🇳 **Règle de drop officielle ZH (recherche ZH 2026-10)** : **aucun drop si le joueur dépasse les monstres de 7 niveaux ou plus** (règle anti-carry documentée par le wiki officiel DiGeam) — s'applique aux talismans/drops FGW ; à rapprocher de la règle des mobs « gris » du leveling.

---

## 🏰 Structure d'une Instance

Tous les donjons FGW suivent **le même schéma** (wiki Fandom + guides Origin) :

### Camps (rooms)
- Chaque zone (« camp ») contient des monstres normaux + des **mini-boss (uniques)**.
- **Tuer tous les monstres** d'un segment ouvre automatiquement la zone bloquée suivante.
- Après le clear d'un camp, une **Envy** y spawne ; **tuer l'Envy fait spawner de nombreux monstres d'un coup** → quitter vite le camp.
- Certains camps contiennent un **Dungeon Exit** et/ou un **Pillar of Party Member Recall**.

### Boss Camp
- Toujours le **dernier camp** du donjon : le **boss final** n'apparaît qu'après le clear complet de toutes les zones précédentes.

### Treasure Box Room
- Salle avec monstres + **Treasure Box** (coffre). Le coffre **n'est pas obligatoire** pour progresser, mais c'est la **source principale de talismans** et de Faded Beads.

### Gap of Dimensions
- Le clear de certains camps fait apparaître un téléporteur **« Gap of Dimensions »** au début du donjon : permet aux joueurs qui rentrent de sauter directement vers les camps éloignés.

### Astuce officielle (wiki)
> **Ne registrez PAS les talismans au fur et à mesure** : collectez les 8 avant de les enregistrer dans le Collection Book. La jauge **berserker se recharge à chaque unique tué**.

---

## 👹 Boss, Uniques et Monstres

⚠️ L'ancienne version présentait « Sereness Ghost » comme boss final de TOUS les donjons et inventait un « Elder Earth Ghost » mid-donjon universel + des phases/chiffres de HP. **Réalité vérifiée : chaque donjon a SES uniques.** ✅ Précision (recherche TR 2026-10) : **Ghost Serenes est le boss final des DEUX donjons Shipwreck** (Green Abyss 91-100 et Sea of Resentment 101-110) — mais pas de Togui Village ni de Flame Mountain.

### Togui Village (35-70)
| Unique | Rôle | Notes |
|---|---|---|
| **Togui General** | Unique de camp | Vu dans les runs 51-60 (timestamp ~16 min des vidéos) |
| **Togui Elder** | Unique de camp | Fin de run (~1 h 06 dans les vidéos complètes) |
| **Elder Earth Ghost** | Unique majeur | **Meilleure probabilité de drop de talismans** (guide Origin). À **15 % de son HP**, il spawn des **mini-uniques et monstres** → la party doit switch sur les adds |

### Flame Mountain (71-90)
| Unique | Rôle | Notes |
|---|---|---|
| **Flame Cow King** | Unique majeur | Droppe des talismans (avec les Treasure Boxes). Il **se renforce (~+15 %)** pendant le combat (guide Origin) |
| *Mini-uniques* | Camps | Répartis dans les 3 « Areas » du donjon |

### Shipwreck – The Green Abyss (91-100)

> ✅ **LES UNIQUES DU GREEN ABYSS ENFIN IDENTIFIÉS (recherche TR 2026-10)** — incertitude majeure n°1 de ce fichier, résolue par la série complète des 7 guides FGW turcs (SroLobby, auteur Burak Yoğun) :

| Unique | Rôle | Notes |
|--------|------|-------|
| **Ghost Beast** | Unique de camp (navires 1-2) | Spawn aussi hors des navires en 3-4★ |
| **Ghost Gultton** | Unique de camp (dernier navire) | Également invoqué par Serenes à bas HP |
| **Ghost Serenes** | **Boss final** | Invoque **2 Ghost Gultton** à bas HP ; en 3-4★ l'arène du boss contient **Serenes + Gultton + Beast ensemble** |

- Cartes : **1-2★ = « Inside of The Shipwreck »** ; **3-4★ = « Outside of The Shipwreck »** (Ghost Beast y spawne aussi hors des navires).
- HP par grade : voir [Tables HP des uniques](#-tables-hp-des-uniques-par-tranche-et-grade-recherche-tr-2026-10) ci-dessous.
- Il faut ouvrir environ la moitié des zones/boxes pour que la carte révèle les Treasure Box.

### Shipwreck – The Sea of Resentment (101-110)

> ✅ Uniques de camp identifiés côté TR (SroLobby) : **Ghost Beast** et **Ghost Gultton** (mêmes monstres que le Green Abyss, niveaux/HP supérieurs).

| Boss/monstre | Notes |
|---|---|
| **Ghost Sereness** (boss final) | **Seul après le clear complet.** Cast une **pétrification** (esquive en se déplaçant pendant le cast). Spawn des **adds à ~60 % et ~20 % de HP**. Les joueurs pétrifiés à bas HP peuvent mourir |
| **Ghost Beast / Ghost Gultton** (uniques de camp) | À bas HP du boss, Serenes invoque **2× Ghost Gultton + 2× Ghost Beast** (guide TR) |
| **Ghost Curse** (monstre) | Monstre cité par les scripts communautaires (ProjectHax) dans le donjon 1★ |
| Vindictive Spirit / Phantom (monstres) | Thème « esprits vengeurs » du donjon |

- Anecdote communautaire TR : un joueur a vu **2 Ghost Sereness simultanés** — réponse d'admin : « bug système, normalement un seul unique final ».

### Drops rares de Ghost Sereness (wiki Fandom)
- **Degré 11 Seal of Nova B Fight** (arme)
- **Degré 11 Seal of Nova A Protection** (bouclier)
- **Degré 11 Seal of Nova B Guard** (bouclier)

> ℹ️ Les items « égyptiens » (Nova A/B) de fin de jeu viennent donc de **Sea of Resentment**, pas d'un hypothétique « Temple of Egypt ».

### 📊 Tables HP des uniques par tranche et grade (recherche TR 2026-10)

> ✅ **Partiellement résolu (incertitude n°5)** : la série turque SroLobby (7 guides par tranche, auteur Burak Yoğun) publie les **niveaux ET HP des uniques pour les 7 tranches × 4 grades**. ⚠️ Les valeurs sont très probablement extraites de données **vSRO** : niveaux et structure conformes à l'officiel, mais **HP à recouper avec `_RefObjCommon`/`characterdata_5000.txt` avant implémentation**. Convention turque « 143.131K » = 143 131 000 HP.

**a) Togui Village 35-50** — [guide](https://www.srolobby.com/konular/silkroad-online-togui-village-35-50-forgotten-world-map-rehberi.2684)

| Boss | 1★ (Lv/HP) | 2★ (Lv/HP) |
|---|---|---|
| Togui General (camp 1) | 39 / 143 131 000 | 47 / 304 119 000 |
| Togui Captain (camp 2) | 39 / 143 131 000 | 47 / 304 119 000 |
| **Togui Elder** (final) | 39 / **1 275 761 000** | 47 / **2 702 114 000** |

- Elder invoque **2 Togui General** à bas HP ; **2 Treasure Box par carte** ; récompense : **D8 Seal of Sun**.

**b) Togui Village 51-60** — [guide](https://www.srolobby.com/konular/silkroad-online-togui-village-51-60-forgotten-world-map-rehberi.2688)

| Boss | 1★ | 2★ |
|---|---|---|
| General / Captain | Lv53 / 257 926 000 | Lv58 / 489 931 000 |
| **Togui Elder** | **2 287 684 000** | **4 339 138 000** |

- ⚠️ Témoignage joueur iSRO officiel : sur la tranche 51-60, **Puppet et Spell Paper ne dropaient jamais**.

**c) Togui Village 61-70** — [guide](https://www.srolobby.com/konular/silkroad-online-togui-village-61-70-forgotten-world-map-rehberi.2689)

| Boss | 1★ | 2★ |
|---|---|---|
| General / Captain | Lv63 / 407 745 000 | Lv68 / 754 812 000 |
| **Togui Elder** | **3 607 078 000** | **6 671 086 000** |

**d) Flame Mountain 71-80** — [guide](https://www.srolobby.com/konular/silkroad-online-flame-mountain-71-80-forgotten-world-map-rehberi.2691)

| Boss | 1★ | 2★ | 3★ | 4★ |
|---|---|---|---|---|
| Flame Captain | Lv73 / 471 374 000 | Lv76 / 778 953 000 | Lv76 / 2 077 209 000 | Lv79 / 3 142 325 000 |
| Flame Adjutant Honghaea | Lv73 / 615 183 000 | Lv76 / 1 017 408 000 | Lv76 / 2 713 089 000 | Lv79 / 4 107 290 000 |
| **Flame Cow King** | Lv73 / **4 713 740 000** | Lv76 / **7 789 534 000** | Lv76 / **10 386 045 000** | Lv79 / **15 235 513 000** |

- Cow King invoque **2 Flame Captain** à bas HP ; récompense : **D9 Seal of Sun** (set « The Burning Abyss »).

**e) Flame Mountain 81-90** — [guide](https://www.srolobby.com/konular/silkroad-online-flame-mountain-81-90-forgotten-world-map-rehberi.2700)

| Boss | 1★ | 4★ |
|---|---|---|
| Flame Captain | Lv83 / 667 505 000 | Lv89 / 4 411 228 000 |
| Flame Adjutant Honghaea | 873 457 000 | 5 779 128 000 |
| **Flame Cow King** | **6 675 049 000** | **21 387 770 000** |

**f) Shipwreck – The Green Abyss 91-100** — [guide](https://www.srolobby.com/konular/silkroad-online-shipwreck-91-100-forgotten-world-map-rehberi.2251)

| Monstre | 1★ (Lv93) | 2★ (Lv96) | 3★ (Lv99) | 4★ (Lv99) |
|---|---:|---:|---:|---:|
| Ghost Beast / Ghost Gultton | 1 130 727 000 | 1 981 689 000 | 5 284 504 000 | 8 399 751 000 |
| **Ghost Serenes** | **11 307 269 000** | **19 816 890 000** | **26 422 520 000** | **40 726 064 000** |

**g) Shipwreck – The Sea of Resentment 101-110** — [guide](https://www.srolobby.com/konular/silkroad-online-shipwreck-100-110-forgotten-world-map-rehberi.2257)

| Monstre | 1★ (Lv103) | 2★ (Lv106) | 3★ (Lv106) | 4★ (Lv109) |
|---|---:|---:|---:|---:|
| Ghost Beast / Ghost Gultton | 1 828 557 000 | 3 114 231 000 | 8 304 616 000 | 12 891 122 000 |
| **Ghost Serenes** | **18 285 574 000** | **31 142 310 000** | **41 523 079 000** | **62 502 412 000** |

- Amplitude totale documentée : de **143,1 M HP** (Togui General 1★ 35-50) à **62,5 milliards HP** (Ghost Serenes SoR 4★). Récompenses confirmées par les mêmes guides : Togui **D8 SUN**, Flame Mountain **D9 SUN**, Green Abyss **D10 MOON**, Sea of Resentment **D11 A Grade (Nova A)**.

---

## 🃏 Système de Talismans (Collections)

Chaque donjon possède **une collection de 8 talismans** (noms officiels iSRO, croisés Fandom + Algarb + ProjectHax). Les talismans sont **vendables/échangeables** (tradeables) et droppent par les **Treasure Boxes** et les **boss/uniques**.

### 1. The Phantom of the Crimson Blood — Togui Village (D8)
1. Red Tears
2. Western Scriptures
3. Togui Mask
4. Red Talisman
5. Puppet
6. Dull Kitchen Knife
7. Spell Paper
8. Elder Staff

### 2. The Burning Abyss — Flame Mountain (D9)
1. Fire Flower
2. Horned Cattle
3. Flame of Oblivion
4. Flame Paper
5. Hearthstone Flame
6. Enchantress Necklace
7. Honghaeah Armor
8. Fire Dragon Sword

### 3. The Green Abyss — Shipwreck, The Green Abyss (D10)
1. Silver Pendant
2. Cobalt Emerald
3. Logbook
4. Love Letter
5. Portrait of a Woman
6. Jewelry Box
7. Diamond Watch
8. Mermaid's Tears

### 4. The Sea of Resentment — Shipwreck, The Sea of Resentment (D11)
1. Broken Key
2. Large Tong
3. Phantom Harp
4. Evil's Heart
5. Vindictive Spirit's Bead
6. Hook Hand
7. Commander's Patch *(plus rare)*
8. Sereness's Tears *(plus rare)*

### 🇹🇷 Paliers de rareté des talismans par collection (recherche TR 2026-10)

> ✅ **Partiellement résolu (incertitude n°3)** : pas de multiplicateurs chiffrés, mais des **paliers de rareté officiels** par carte — 3 communs / 3 normaux / 2 rares — documentés par SroLobby + [vSRO.org (liste par difficulté D8-D11)](https://www.vsro.org/konular/forgetten-world-talisman-kart-listesi-8-9-10-11-dg-zorluk-derecesine-gore.7600). Confirme les marques « plus rare » de la collection D11 :

| Collection | Communs (« çok çıkar ») | Normaux | Rares (« nadir ») |
|---|---|---|---|
| Togui (D8) | Red Tears, Western Scriptures, Togui Mask | Red Talisman, Puppet, Dull Kitchen Knife | Spell Paper, Elder Staff |
| Flame Mountain (D9) | Fire Flower, Horned Cattle, Flame of Oblivion | Flame Paper, Hearthstone Flame, Enchantress Necklace | Honghaeah Armor, Fire Dragon Sword |
| Green Abyss (D10) | Silver Pendant, Cobalt Emerald, Logbook | Love Letter, Portrait of a Woman, Jewelry Box | Diamond Watch, Mermaid's Tears |
| Sea of Resentment (D11) | Broken Key, Large Tong, Phantom Harp | Evil's Heart, Vindictive Spirit's Bead, Hook Hand | Commander's Patch, Serenity's Tears |

### Compléter une collection
1. Loot les Treasure Boxes + tuer les uniques/boss (les taux montent avec le grade).
2. Astuce communauté : avoir un personnage avec **peu de talismans déjà collectés** augmente le taux de drop des boxes (Algarb).
3. **Enregistrer les 8 talismans** dans le Collection Book (clic droit) — la quête de collection se prend **AVANT d'entrer** (voir NPC par donjon dans le tableau ci-dessus) : D8 chez un marchand, D9/D10 « the general », D11 « Alex south, north from the porter » (Algarb).
4. Récompense : l'arme scellée correspondant au donjon (une fois par donjon par personnage).

---

## 📜 Quêtes du Forgotten World

| Type | Fréquence | Contenu |
|---|---|---|
| **Collection quest** | **1 fois par donjon par personnage** | Collecter + enregistrer les 8 talismans → arme scellée (sans plus, sans blues, valeurs basses) |
| **Série one-time** (~7 quêtes par tranche de niveau) | 1 fois | La plus longue, les plus grosses récompenses XP ; certaines donnent des items scellés |
| **Quêtes journalières** | Toutes les **24 h** | Petites tâches (kill ou collect), faisables en 1-2 sessions, plusieurs disponibles simultanément |

> ✅ **Ajout (recherche gameplay 2026-10)** : le guide Origin Togui documente par ailleurs une **quête de 500 000 SP** liée au village (donnée par **Asaman**, le NPC de quête D8 de Hotan) — la plus grosse récompense SP du donjon, corroborée par les runs vidéo PT-BR « Togui completo 500k SP » ([guide Origin](https://forum.playorigin.com/showthread.php?73) · [vidéo](https://www.youtube.com/watch?v=iCgAU8icRoU)).

---

## 🏆 Récompenses

### Par collection (une fois par personnage)
| Donjon | Récompense |
|---|---|
| Togui Village | **Arme D8 Seal of Sun** (+0, sans blues) |
| Flame Mountain | **Arme D9 Seal of Sun** (+0, sans blues) |
| Green Abyss | **Arme D10 Seal of Moon** (+0, sans blues) |
| Sea of Resentment | **Arme D11 Seal of Nova A Power** (+0, sans blues — pas de bouclier) |

### Items FGW
- **Talismen** : droppés par Treasure Boxes et boss ; **vendables**.
- **Faded Beads** : droppées par Treasure Boxes, mini-boss et boss. À l'usage : **200 à 20 000 SP aléatoires** (constats pratiques ~**14-20 k SP** — PrincessJane, ✅ recherche gameplay 2026-10). Vendables aussi.
- **Drops rares de Ghost Sereness** : armes D11 Nova B Fight, boucliers Nova A Protection / Nova B Guard.
- Le boss du dernier camp peut aussi dropper une **arme égyptienne B-grade** (D11, extrêmement rare — rapporté par Algarb).

> ✅ **Récompenses formalisées (recherche gameplay 2026-10)** : le cheminement documenté de bout en bout est **D8 Sun → D9 Sun → D10 Moon → D11 Nova** (Guild Algarb : « D8 Sun → D11 Nova » par donjon), et selon le récit détaillé PrincessJane (Sea of Resentment, 2011), la **collection complète s'échange contre une arme égyptienne degré A au choix**, tandis que **Ghost Sereness peut dropper une Egyptian Weapon Degré B** « meilleure qu'une Nova normale ou qu'une Egy A » — l'astuce du **collection book le moins rempli** (ouvrir les coffres avec le perso le moins avancé = meilleur taux) est confirmée par les deux guides ([Guild Algarb](https://guildalgarb.wordpress.com/games/sro/maps/forgotten-world) · [PrincessJane](https://princessjane25.wordpress.com/2011/03/18/legend-vi-forgotten-world-shipwreck-dimension-ii)).

> ❌ L'ancienne version listait des récompenses par étoile (SP fixes, Arena Coins, SOS/SOM par grade) : **non documentées sur officiel** — les grades n'influencent que le taux de talismans, pas la nature de l'arme.

---

## 👥 Stratégies de Groupe

### Composition (grades 3-4, 8 joueurs max)
- Grades 1-2 : **4 joueurs max** — un duo XP + support suffit à haut niveau.
- Grades 3-4 : full party 8/8 avec tank (Warrior), DPS (Wizard/Rogue/CH), support (Cleric obligatoire, Bard pour mana/vitesse), Warlock pour Division (+30 % dégâts subis) sur les uniques.

### Conseils vérifiés
- **Envies** : très agressives — un build INT fragile doit éviter de les tanker en meute.
- **Après le kill d'une Envy dans un camp** : sortir vite, beaucoup de monstres apparaissent d'un coup.
- **Elder Earth Ghost (Togui)** : garder les AoE/stuns pour la vague d'adds à 15 % HP.
- **Flame Cow King (Flame Mountain)** : burst soutenu, il se buffe (~+15 %) en combat.
- **Ghost Sereness (Sea of Resentment)** : watch le cast de pétrification → **se déplacer pendant le cast** ; prévoir les adds à 60 %/20 % ; Instant Resurrection Scroll pour ne pas perdre l'XP du boss.
- **Berserker** : la jauge se recharge à chaque unique — enchaîner les camps en zerk.
- **Réparation/réappro** : sortir par le Dungeon Exit et revenir sous 15 min (via Gap of Dimensions pour rejoindre le camp lointain).

---

## 💰 Forgotten Coins (variante private servers)

⚠️ Le système « Forgotten Coins » (shop NPC qui échange des coins contre talismans) **n'existe pas sur les serveurs officiels** — c'est une mécanique récurrente des **private servers** modernes pour supprimer le RNG. Le principe : les coffres/boss droppent des coins, un NPC permet d'acheter le talisman manquant (prix croissant avec la rareté). Pour SRObro : à traiter comme **option de design** (réduit la frustration), pas comme donné officielle. Les taux chiffrés de l'ancienne version de ce fichier (coins par coffre, etc.) étaient **inventés** et ont été retirés.

**Taux de drop chiffrés publiés par des privés — toujours [CUSTOM], jamais officiels** (✅ recherche gameplay 2026-10) :
- **ExaySRO** ([DG15 Crafting Guide](https://forum.exaysro.com/showthread.php?tid=4005)) : talismans FGW — Flame Mountain mobs **5 %**, « Envy Drop rate 100 % », Flame Captain 5 / Flame Adjutant Honghaeah 5, **Flame Cow King 10** ; Shipwreck mobs **10 %**, Envy 1, uniques intermédiaires 5-8, **Sereness 10** ; le **Fire Crystal** (composant DG15, 30 000 unités nécessaires) se farm dans le FGW et les events GM.
- **Devil's Garden** (donjon privé de Legends Online — [playlegends.online](https://playlegends.online/news-8.html)) : chaque monstre **100 %** de drop garanti en version party / **50 %** en version solo (2 pierres aléatoires + élixir + Jewel Box ; Devil Baal & Devil Shaitan : Immortelle 10D + 5 Faded Beads ; The Devil : Astrale 10D, SoM 10D 5-10 %) — exemple type du format « entrée payante en gold + drops garantis en % » des guides privés.

---

## 🏛️ Donjons Liés (Job Temple, Qin-Shi Tomb, Holy Water Temple)

### ⚔️ Job Temple (Job Cave — uniques égyptiens)
Donjon **PvP job** (Thieves vs Hunters/Traders, **tenue de job requise**) — structure en « Sanctums » avec accès conditionnés aux **AP (Auction/Activity Points)** gagnés via les quêtes de job :

| Uniques | Sanctums | Accès | Cycle |
|---|---|---|---|
| **Selket & Neith** | Sanctum of Restriction / Sanctum of Blue Eye | **Aucune AP requise** | 2×/jour (03:30 / 15:30 SST) |
| **Anubis & Isis** | Sanctum of Punishment / Sanctum of Atonement | L'**union** avec le plus d'AP | 2×/jour (09:30 / 21:30 SST) |
| **Haroeris & Seth** | Sanctum of Immorality / Sanctum of Dark | Union avec AP ; **Haroeris doit mourir avant Seth** | 2×/jour (12:30 / 00:30 SST) |

- **Sanctum of Audience** = hub central avec le NPC de quêtes AP (job suit requis pour entrer dans le temple).
- Avertissements in-game 10 et 5 minutes avant l'ouverture des salles.
- Drops (vSRO-type) : **coins Gold/Silver/Iron/Copper**, items 12D, Immortal/Astral stones (les niveaux exacts des uniques varient selon les serveurs : ~110-130).

### 🐍 Qin-Shi Tomb (Jangan Cave, B1-B6)
Le donjon « Medusa » — entrée à l'**est de Jangan** (Jangan Cave), monstres ~81+, 6 sous-sols (B1→B6) :

- **B4** : l'unique **BeakYung** (garde) tué → la **Sarin Gate** (centre B4) s'ouvre **10 minutes** → accès B5.
- **B5** (croix) — 4 uniques, un par direction :
  - Nord : **JeonUk The Black Tortoise** (lv 98)
  - Sud : **YumJae The Red Hawk** (lv 98, magique)
  - Ouest : **TaeHo The Blue Dragon** (lv 99)
  - Est : **SoHaow The White Tiger** (lv 99, physique, ~80 % stun — le plus dur)
  - Les 4 tués → **Shinmoo, The Man of Flames** (lv 100) au centre SW → drops d'équipement level 100 (10D).
  - 🇨🇳 **Noms ZH des gardiens B5 (recherche ZH 2026-10)** : **玄武颛顼** (Tortue Noire/Zhuanxu), **白虎小昊** (Tigre Blanc/Xiaohao), **青龙太皥** (Dragon Azur/Taihao), **朱雀炎帝** (Phénix Vermillon/Yandi) + le pré-boss central **炎火客神武** — protocole officiel TW : nettoyer les 4 mini-boss cardinaux → le pré-boss central apparaît → ouvre B6 (mapping exact ↔ noms EN ci-dessus probable, à confirmer sur le client ; sources [DiGeam](https://sro.digeam.com/intro/20200212) + [iccgame B5/B6](http://silkroad.iccgame.com/content-667-84551.html)).
- **B6** : 3 portails de cristal bleu → salle aléatoire parmi **Guardian Chamber** (vagues 92-99), **Man-Viper Chamber** (4 Snake Generals lv 95), **Black Viper Chamber** (**Soso The Black Viper**, lv 100). Au centre de B6, 4 cristaux verts téléportent vers B1-B4.
- **BeakYung The White Viper** alias **« Medusa »** : l'unique le plus haut niveau du donjon (**lv 105**, ~183,5 M HP), dégâts magiques, fear/poison/bind/**pétrification 1 min incurable** — les meilleurs drops 10D lv 100.

### 💧 Holy Water Temple (Alexandria South)
Donjon d'Alexandria à progression par quêtes (Pharaon/temple égyptien) :
- Progression : quête **Pharaoh Tomb Beginner** → **HWT Beginner** → **HWT Intermediate** (quêtes **Senior General** et **Baron**, chaîne « The Suspicious Sacrifice », ~lv 105) → **HWT Advanced**.
- Uniques communautaires documentés (vidéos/runs) : **Sphinx, Sekhmet, Nephthys, Horus**.
- Les runs typiques enchaînent ~5 uniques ; drops d'Arena Coins / scrolls selon serveur.
- Système de **titres** lié (voir guide titres Silkroad Latino : Knight-Captain → Chief General).

### 🇰🇷 Donjons KSRO tardifs (Jupiter / Bagdad / Shambhala / Legend 23) — renvoi

> ⚠️ Ces donjons **ne font PAS partie du système Forgotten World** (pas de Dimension Hole, pas de talismans) : ce sont des donjons instanciés et des donjons de champ séparés, ajoutés par le service coréen entre 2011 et 2023. Ils n'ont **pas leur place détaillée dans cette fiche** — documentation complète dans [13_ZONES_OVERVIEW.md — section « 🇰🇷 Contenu KSRO (2011-2026) »](./13_ZONES_OVERVIEW.md) (accès, paliers, timers, boss, drops) et [15_UNIQUE_BOSSES.md — section KSRO](./15_UNIQUE_BOSSES.md) (boss).

| Donjon (KR / EN) | Entrées | Ajout KR | Type |
|---|---|---|---|
| 경배의 전당 (Hall of Worship) | 106 solo / 111 / 113 | 22/06/2011 (Legend XII) | instance Jupiter (2 h) |
| 광신도의 은신처 (Zealots Hideout) | 106 solo / 116 / 118 | 22/06/2011 (Legend XII) | instance Jupiter (2 h) |
| 바그다드 지하 (Bagdad Underground) + 카일리아의 은신처 (Kailia) | 121+ | mai 2014 | instances (3×50 min/jour) |
| 파멸의 성전 (Temple of Destruction) | 125+ | ~16/05/2023 (Legend 23) | **donjon de champ** (entrées NPC Hotan/Bagdad, boss final despawn 3 h) |
| 비밀의 무덤 (Secret Tomb) | 125+ | ~16/05/2023 (Legend 23) | instance à étages (30 min, clé du Fire Temple de Shambhala) |
| Ice Temple / Fire Temple (Shambhala) | 131-135 / 136-140 | 27/03/2018 | donjons Shambhala (accès NPC Mortifying Monk au Taklamakan) |

Sources : [ML_RESEARCH/RESEARCH_KO2_WORLD.md](ML_RESEARCH/RESEARCH_KO2_WORLD.md) · [RESEARCH_KO2_CHRONO.md](ML_RESEARCH/RESEARCH_KO2_CHRONO.md) · wiki DiGeam.

> ✅ **Tables de quêtes Jupiter 111-117 (recherche gameplay 2026-10)** — les guides Seidenkraft documentent la totalité des quêtes du **Hall of Worship 111-115** ([lien](https://seidenkraftblog.wordpress.com/2012/09/13/the-hall-of-worship-jupiter-temple-quest)) et de la **Mirror Dimension 111-117** ([lien](https://seidenkraftblog.wordpress.com/2012/09/13/the-secret-of-the-mirror-dimension-jupiter-temple-quest)) : objectifs chiffrés (kills 150-500, collectes 40-500) cartographiant toutes les familles de mobs Jupiter. **Hors périmètre FGW** (pas de Dimension Hole ni talismans) → intégrées à [13_ZONES_OVERVIEW.md — section « 🎮 Précisions d'entrée et de gameplay »](./13_ZONES_OVERVIEW.md) avec les gates d'entrée du client v1.657.

---

## 🛠️ Implémentation Technique

> 📡 **Packets officiels FGW (vSRO 1.188, SilkroadDoc)** — le protocole client-serveur a des opcodes dédiés au Forgotten World :
>
> | Opcode C→S | Opcode S→C | Nom |
> |---|---|---|
> | 0x7519 | 0xB519 | AGENT_FGW_RECALL_LIST (liste des membres rappelables) |
> | 0x751A | 0xB51A | AGENT_FGW_RECALL_MEMBER |
> | — | 0x741A | AGENT_FGW_RECALL_REQUEST |
> | 0x751C | 0xB51C | AGENT_FGW_RECALL_RESPONSE |
> | 0x751D | 0xB51D | AGENT_FGW_EXIT |
> | — | 0x351E | AGENT_FGW_UPDATE |
>
> Le **Pillar of Party Member Recall** s'appuie sur cette famille de packets. Note mouvement : dans les donjons, le `RegionID` porte le flag `0x8000` (`IsDungeon`) et les coordonnées passent en **int32** au lieu de int16 (packet 0x7021).

### Modèle de données (SRObro)

```typescript
// Configuration d'un donjon FGW — calée sur les données officielles vérifiées
interface FGWDungeonConfig {
  id: string;                      // 'togui_village' | 'flame_mountain' | 'green_abyss' | 'sea_of_resentment'
  name: string;
  levelBrackets: [number, number][];  // ex. Togui: [[35,50],[51,60],[61,70]]
  reward: {
    degree: number;                // 8 | 9 | 10 | 11
    seal: 'SUN' | 'MOON' | 'NOVA_A_POWER';
  };
  questNpc: { name: string; town: string };
  talismanCollection: string[];    // 8 talismans exacts (listes ci-dessus)
  bosses: FGWBossConfig[];
  timeLimitSeconds: 7200;          // 2 h (officiel)
}

// Grades de difficulté — type de monstres + limite de party + multiplicateur de drop talisman
interface FGWGrade {
  grade: 1 | 2 | 3 | 4;
  monsterType: 'NORMAL' | 'CHAMPION' | 'ELITE';  // G1=General, G2=Champion, G3/G4=Elite — ✅ résolu (recherche TR 2026-10)
  maxPartySize: 4 | 8;            // 4 pour G1/G2, 8 pour G3/G4
  talismanDropMultiplier: number; // croissant ; à calibrer (officiel non chiffré — paliers qualitatifs 3/3/2 documentés)
  minEnvyLevel?: 71;              // grades 3-4 seulement si Envies lv 71+
}

// Timers officiels à respecter
const FGW_TIMERS = {
  HOLE_ITEM_EXPIRY:   24 * 3600,  // l'item disparaît après 24 h
  HOLE_SPAWN_COOLDOWN: 30 * 60,   // 30 min entre 2 activations
  DUNGEON_TIME_LIMIT:  2 * 3600,  // 2 h pour tuer le boss
  REENTRY_LOCK:        3 * 3600,  // 3 h avant toute nouvelle entrée
  EXIT_DESPAWN:        15 * 60,   // 15 min hors donjon avant despawn
} as const;
```

### Gestion d'instance (squelette)

```typescript
class FGWInstanceManager {
  // Entrée : le leader utilise sa Dimension Hole en ville → téléporteur visible par lui seul
  spawnDimensionHole(playerId: string, hole: { grade: number; bracket: [number, number] }) {
    if (this.recentHoleAt[playerId] > Date.now() - 30 * 60_000) throw new Error('HOLE_COOLDOWN');
    if (player.level < hole.bracket[0] || player.level > hole.bracket[1]) throw new Error('LEVEL_MISMATCH');
    // téléporteur personnel -> teleportPartyToInstance() au clic
  }

  // Clear d'un camp : ouvre la zone suivante, spawn l'Envy, puis la vague après kill d'Envy
  onCampCleared(instanceId: string, campId: number) {
    const inst = this.instances.get(instanceId)!;
    inst.openDoor(campId + 1);
    inst.spawnEnvy(campId);          // kill de l'Envy -> spawnMonsterWave(campId)
    if (inst.config.camps[campId].spawnsGapOfDimensions) inst.spawnGapOfDimensions();
    if (campId === inst.config.camps.length - 1) inst.spawnFinalBoss(); // boss camp = dernier
  }

  // Le boss final ne spawn qu'après le clear COMPLET ; unique tué -> berserker refill
  onUniqueKilled(instanceId: string, uniqueId: string) {
    const inst = this.instances.get(instanceId)!;
    inst.players.forEach(p => p.refillBerserkerGauge());
    if (inst.isFinalBoss(uniqueId)) this.completeInstance(instanceId);
  }
}
```

### Boss — mécaniques documentées (remplace l'ancienne IA « 3 phases » inventée)

```typescript
// Ghost Sereness (Sea of Resentment) — seules mécaniques documentées
const GHOST_SERENESS = {
  spawnCondition: 'ALL_CAMPS_CLEARED',        // n'apparaît qu'au clear complet
  mechanics: [
    { type: 'PETRIFY_CAST', telegraph: 'visible cast', counter: 'move during cast' },
    { type: 'ADD_WAVE', atHpPercent: 0.60 },  // vague d'adds à ~60 %
    { type: 'ADD_WAVE', atHpPercent: 0.20 },  // vague d'adds à ~20 %
  ],
  rareDrops: ['D11_NOVA_B_FIGHT_WEAPON', 'D11_NOVA_A_PROTECTION_SHIELD', 'D11_NOVA_B_GUARD_SHIELD'],
};

// Elder Earth Ghost (Togui Village)
const ELDER_EARTH_GHOST = {
  highestTalismanDropRate: true,              // meilleure source de talismans du donjon
  mechanics: [{ type: 'SPAWN_MINI_UNIQUES', atHpPercent: 0.15 }], // adds à 15 % HP
};

// Flame Cow King (Flame Mountain)
const FLAME_COW_KING = {
  dropsTalismans: true,
  mechanics: [{ type: 'SELF_ENRAGE', rampUpPercent: 15 }], // se renforce ~+15 % en combat
};
```

### Schéma Prisma (résumé)

```prisma
model FGWDungeon {
  id           String   @id
  name         String
  levelMin     Int
  levelMax     Int
  degree       Int      // 8-11
  rewardSeal   String   // SUN | MOON | NOVA_A_POWER
  timeLimit    Int      @default(7200)
  reentryLock  Int      @default(10800)
  camps        FGWCamp[]
  talismans    FGWTalisman[]
}

model FGWCamp {
  id           String   @id
  dungeonId    String
  order        Int
  hasTreasureBox Boolean @default(false)
  hasDungeonExit Boolean @default(false)
  hasRecallPillar Boolean @default(false)
  spawnsGap      Boolean @default(false)
}

model FGWTalisman {
  id           String   @id
  collectionId String
  name         String   // noms officiels (Red Tears, Fire Flower, ...)
  rarity       Int      @default(1)
  @@unique([collectionId, name])
}

model FGWInstance {
  id          String   @id @default(cuid())
  dungeonId   String
  grade       Int      // 1-4
  holeOwnerId String   // joueur qui a spawné la Dimension Hole
  startedAt   DateTime @default(now())
  expiresAt   DateTime // startedAt + 2 h
  completed   Boolean  @default(false)
}
```

---

## ❓ FAQ

**Q: Combien de donjons FGW existent-il ?**
R: **4** : Togui Village (35-70, en 3 tranches), Flame Mountain (71-90, 2 tranches), Shipwreck – The Green Abyss (91-100), Shipwreck – The Sea of Resentment (101-110).

**Q: Comment entre-t-on ?**
R: Détruire un **Dimension Pillar** (spawn aléatoire dans le monde par paliers 35-90) → tuer les **Envies** → loot d'une **Dimension Hole** (grade 1-4) → l'activer **en ville** (clic droit).

**Q: Quel est le vrai rôle des étoiles/grades ?**
R: Le grade change le **type de monstres** (Normal/Champion/plus), la **limite de party** (4 en grade 1-2, 8 en grade 3-4) et le **taux de drop des talismans**. Les HP/dégâts des uniques ne changent pas. Grades 3-4 seulement via des Envies niveau 71+.

**Q: Peut-on faire le FGW solo ?**
R: Grade 1 oui (selon niveau/stuff), grade 2 possible pour un haut niveau bien équipé, grades 3-4 non (conçus pour 8).

**Q: Les talismans sont-ils tradeables ?**
R: **Oui**, ils sont vendables/échangeables sur officiel (attention aux arnaques « talismans 9dg/10dg pour quête A-grade » — Seidenkraft).

**Q: Ghost Sereness est-elle le boss de tous les donjons ?**
R: **Non.** Ghost Serenes est le boss final des **deux donjons Shipwreck** — The Green Abyss (91-100) ET The Sea of Resentment (101-110), avec ses acolytes **Ghost Beast** et **Ghost Gultton** (✅ recherche TR 2026-10). Togui Village et Flame Mountain ont leurs propres uniques (Togui General/Elder, Elder Earth Ghost, Flame Cow King…).

**Q: Que donne la complétion d'une collection ?**
R: Une **arme scellée** du degré du donjon (D8/D9 SUN, D10 MOON, D11 Nova A Power), sans plus ni blues — **une fois par donjon par personnage**.

**Q: Que sont les Faded Beads ?**
R: Items droppés (coffres/mini-boss/boss) donnant **200 à 20 000 SP aléatoires** à l'usage, vendables.

**Q: Combien de temps entre deux donjons ?**
R: **3 heures** de délai de ré-entrée (tous donjons confondus), contournable avec le Forgotten World re-entry ticket de l'Item Mall.

**Q: Que se passe-t-il si le timer de 2 h expire ?**
R: Le boss doit être tué dans les 2 h, sinon le donjon disparaît et vous êtes téléporté à votre point de résurrection.

---

## ⚠️ Incertitudes / Données Manquantes

1. ~~**Uniques du Green Abyss (91-100)**~~ : ✅ **Résolu (recherche TR 2026-10)** — **Ghost Beast** (navires 1-2), **Ghost Gultton** (dernier navire), boss final **Ghost Serenes** (SroLobby, guide 91-100).
2. ~~**Type exact des monstres grades 3-4**~~ : ✅ **Résolu (recherche TR 2026-10)** — 3★-4★ = monstres **Elite** (1★ = General, Envies = Champion ; 2★ = Champion/Elite).
3. **Multiplicateurs exacts de drop de talismans par grade** : « plus élevé = mieux » est documenté, pas les chiffres — 🟡 **partiellement résolu** : paliers de rareté qualitatifs par collection documentés (3 communs / 3 normaux / 2 rares — SroLobby + vSRO.org).
4. **Timer d'instance** : 2 h (Fandom) ; un post ProjectHax mentionne aussi une fenêtre totale de ~5 h autour — retenir 2 h comme référence officielle. Le **délai de ré-entrée 3 h** est confirmé par le wiki officiel ZH (DiGeam).
5. **Niveaux/HP exacts des uniques FGW** : 🟡 **partiellement résolu (recherche TR 2026-10)** — tables complètes niveaux + HP pour les 7 tranches × 4 grades publiées par SroLobby (probablement données vSRO — **recouper `_RefObjCommon`/`characterdata_5000.txt` avant implémentation**). ⚠️ Conflit ouvert : le wiki Fandom affirme que les grades ne changent pas les HP des uniques, les tables TR montrent le contraire.
6. **Job Temple** : niveaux des uniques et loot exacts varient fortement selon les serveurs (données ici = eXay SRO/vSRO-type) ; cycles 12 h et conditions AP documentés.
7. **Holy Water Temple** : noms d'uniques issus de vidéos communautaires (Sphinx/Sekhmet/Nephthys/Horus) — croiser avec le client officiel avant implémentation.

---

## 🔗 Sources

### Wiki
- [Forgotten World — Silkroad Online Wiki (Fandom)](https://silkroadonline.fandom.com/wiki/Forgotten_World) — source principale (wikitext intégral : accès, grades, structure, quêtes, items, collections, récompenses)
- [Silkroad Online Wiki — Accueil](https://silkroadonline.fandom.com/wiki/Silkroad_Online_Wiki)

### Guides communautaires
- [The Forgotten World – Togui Village Instance (Origin Guides)](https://forum.playorigin.com/showthread.php?73-The-Forgotten-World-Togui-Village-Instance-Origin-Guide) — Elder Earth Ghost + adds à 15 % · quête 500 k SP · timers 2 h/3 h + Recall Tower (✅ confirmé recherche gameplay 2026-10 · [archive intégrale](https://forum.playorigin.com/archive/index.php/t-73.html))
- [The Forgotten World – Flame Mountain Instance (Origin Guides)](https://forum.playorigin.com/showthread.php?78-The-Forgotten-World-Flame-Mountain-Instance-Origin-Guide) — Flame Cow King, structure en 3 areas
- [The FGW Tutorial — Seidenkraft Blog](https://seidenkraftblog.wordpress.com/2012/09/14/the-fgw-tutorial/) — grades, envies, Ghost Sereness (pétrification, adds 60 %/20 %), récompenses Nova
- [Tutorial Forgotten World — Elitepvpers](http://www.elitepvpers.com/forum/sro-guides-templates/1147804-tutorial-forgotten-world.html)
- [Forgotten World (FGW) Community Scripts — ProjectHax](https://forum.projecthax.com/t/forgotten-world-fgw-community-scripts/22648) — noms des talismans, Ghost Curse, plugins xAutoDungeon/FGW Helper
- [Forgotten World — Guild Algarb](https://guildalgarb.wordpress.com/games/sro/maps/forgotten-world/) — talismans par donjon, NPC de quête SUN, grades
- [Legend VI: Forgotten World Shipwreck Dimension II — PrincessJane](https://princessjaneblog.wordpress.com/2011/03/18/legend-vi-forgotten-world-shipwreck-dimension-ii/) — Egy A au choix pour la collection / Egy B sur le boss, Faded Beads ~14-20 k SP (✅ recherche gameplay 2026-10)

### Taux privés [CUSTOM] (✅ recherche gameplay 2026-10)
- [ExaySRO — DG15 Crafting Guide](https://forum.exaysro.com/showthread.php?tid=4005) — taux de talismans chiffrés par mob/unique (Flame Cow King 10, Sereness 10…), Fire Crystal DG15
- [Legends Online — Devil's Garden](https://playlegends.online/news-8.html) — donjon privé 100 % party / 50 % solo, cooldowns 8 h

### Série turque complète des 7 guides FGW (SroLobby, Burak Yoğun — recherche TR 2026-10)
- [Togui Village 35-50](https://www.srolobby.com/konular/silkroad-online-togui-village-35-50-forgotten-world-map-rehberi.2684) · [51-60](https://www.srolobby.com/konular/silkroad-online-togui-village-51-60-forgotten-world-map-rehberi.2688) · [61-70](https://www.srolobby.com/konular/silkroad-online-togui-village-61-70-forgotten-world-map-rehberi.2689)
- [Flame Mountain 71-80](https://www.srolobby.com/konular/silkroad-online-flame-mountain-71-80-forgotten-world-map-rehberi.2691) · [81-90](https://www.srolobby.com/konular/silkroad-online-flame-mountain-81-90-forgotten-world-map-rehberi.2700)
- [Shipwreck 91-100 (Green Abyss)](https://www.srolobby.com/konular/silkroad-online-shipwreck-91-100-forgotten-world-map-rehberi.2251) — **uniques du Green Abyss identifiés + tables HP** · [100-110 (Sea of Resentment)](https://www.srolobby.com/konular/silkroad-online-shipwreck-100-110-forgotten-world-map-rehberi.2257)
- [FGW Talisman kart listesi D8-D11 — vSRO.org](https://www.vsro.org/konular/forgetten-world-talisman-kart-listesi-8-9-10-11-dg-zorluk-derecesine-gore.7600) — raretés par collection

### Sources chinoises officielles (recherche ZH 2026-10)
- [Wiki officiel DiGeam — 燃燒深淵-火焰山 (Flame Mountain)](https://srowiki.digeam.com/%E7%87%83%E7%87%92%E6%B7%B1%E6%B7%B5-%E7%81%B0%E5%B1%B1) — accès, cooldown 3 h, règle des 7 niveaux, séquence des boss
- [silkroad.iccgame.com — 船舶墓地通关宝典 (Shipwreck)](https://silkroad.iccgame.com/content-667-49139.html) — boss final 女妖, collections, NPC 武萨伊 (Musai), D10 Seal of Moon
- [silkroad.iccgame.com — B5/B6 秦陵](http://silkroad.iccgame.com/content-667-84551.html) — gardiens B5
- [LINE Today TW — Togui Village (6 difficultés)](https://today.line.me/tw/v3/article/o32zaq)

### Donjons liés
- [Job Temple Unique Guide — eXay SRO](https://forum.exaysro.com/showthread.php?tid=3875) — sanctums, cycles 12 h, AP, drops
- [Guide Tomb Qin-Shi Uniques — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/259810-guide-tomb-qin-shi-uniques.html) — B4-B6, BeakYung/Medusa, 183,5 M HP
- [Quests needed for Intermediate Water Temple — ProjectHax](https://forum.projecthax.com/t/quests-needed-for-intermediate-water-temple/19844) — progression HWT
- [Guide Titres — Silkroad Latino Wiki](https://wiki.silkroadlatino.com/en/faq/guia-titulos)
- [xSROMap — carte interactive](https://jellybitz.github.io/xSROMap/)

### 🇰🇷 Sources KSRO (recherche KO2 2026-10)
- [ML_RESEARCH/RESEARCH_KO2_CHRONO.md](ML_RESEARCH/RESEARCH_KO2_CHRONO.md) — Legend X KR 잊혀진 세계 28/07/2010 (cap 110), Rebirth 27/06/2012 (FGW retravaillé)
- [ML_RESEARCH/RESEARCH_KO2_WORLD.md](ML_RESEARCH/RESEARCH_KO2_WORLD.md) — donjons tardifs Jupiter/Bagdad/Shambhala/Legend 23 (renvoi)
- [GameMeca — Legend 10 잊혀진 세계 (28/07/2010)](https://www.gamemeca.com/view.php?gid=87353)

### Technique (packets FGW)
- [SilkroadDoc (DummkopfOfHachtenduden) — wiki GitHub](https://github.com/DummkopfOfHachtenduden/SilkroadDoc/wiki) — opcodes FGW 0x7519-0x351E, mouvement 0x7021 + flag donjon

### Vidéos
- [Togui Village 51-60 full run (Togui General 16:27, Togui Elder 1:06:15)](https://www.youtube.com/watch?v=Aag1Ggt6YQk)
- [Togui General Unique](https://www.youtube.com/watch?v=aFHzOBZHBO0)
- [Silkroad-R Tutorial #16: Forgotten World](https://www.youtube.com/watch?v=u9erjSYFnj8)
- [Forgotten World Explained (TRSRO)](https://www.youtube.com/watch?v=7CTJWdfrv8A)

---

*Dernière mise à jour : 2026-10-01*
*Révision majeure : noms de donjons/tranches corrigés (Fandom wikitext), grades re-documentés (types + party, pas d'HP scaling), boss par donjon vérifiés (Origin/Seidenkraft/YouTube), collections complétées (8 talismans chacune), section donjons liés ajoutée (Job Temple/Qin-Shi/HWT), packets FGW officiels ajoutés. Chiffres non sourcés de l'ancienne version supprimés — voir « Incertitudes ».*
*Enrichi par la recherche multilingue ML_RESEARCH 2026-10 : uniques du Green Abyss + tables HP 7 tranches × 4 grades + types Elite G3/G4 + raretés talismans (SroLobby/vSRO.org TR) ; noms ZH officiels, règle des 7 niveaux, cooldown 3 h confirmé (DiGeam/iccgame ZH) ; note 🇰🇷 KSRO (Legend X KR 28/07/2010, Rebirth 2012, renvoi donjons tardifs — rapports KO2).*
*Enrichi par [ML_RESEARCH/RESEARCH_PS_GAMEPLAY.md](ML_RESEARCH/RESEARCH_PS_GAMEPLAY.md) (✅ recherche gameplay 2026-10) : timers Origin confirmés (instance 2 h / cooldown 3 h / Recall Tower depuis la ville) · quête 500 k SP Togui (Asaman) · récompenses formalisées D8 Sun → D11 Nova + Egy A au choix / Egy B sur le boss final (PrincessJane) · renvoi des tables de quêtes Jupiter 111-117 vers 13_ZONES_OVERVIEW · taux FGW privés marqués [CUSTOM] (ExaySRO 5-10 %, Devil's Garden 100 %/50 %)*
