# 🌏 Zones et Régions du Monde — Vue d'Ensemble

> 📍 **Vous êtes ici :** [Accueil](README.md) → [Zones Overview](13_ZONES_OVERVIEW.md)

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Système de Coordonnées](#-système-de-coordonnées)
- [Carte du Monde Officielle](#-carte-du-monde-officielle)
- [Régions Chinoises (Est)](#-régions-chinoises-est)
- [Régions du Milieu (Déserts et Montagnes)](#-régions-du-milieu-déserts-et-montagnes)
- [Régions Européennes (Ouest)](#-régions-européennes-ouest)
- [Égypte et Alexandrie](#-égypte-et-alexandrie)
- [Zones Spéciales](#-zones-spéciales)
- [Dungeons et Instances](#-dungeons-et-instances)
- [Téléporteurs et Transports](#-téléporteurs-et-transports)
- [Leveling Progression par Cap](#-leveling-progression-par-cap)
- [Évolution du Monde par Expansion](#-évolution-du-monde-par-expansion)
- [Safe Zones vs Danger Zones](#-safe-zones-vs-danger-zones)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🌏 Vue d'Ensemble

Le monde de Silkroad Online reproduit la **Route de la Soie historique (VIIe siècle)** : de la **Chine** (est) à l'**Europe** (ouest), en passant par l'**Asie centrale**, les **déserts du Taklamakan**, les **montagnes du Karakoram** et, plus tard, l'**Égypte** et l'**Arabie**.

### Points Clés
- ✅ **3 continents de contenu :** Chine (départ chinois), Europe (départ européen), Égypte/Arabie (end-game)
- ✅ **6 villes majeures classiques :** Jangan, Donwhang, Hotan (Chine) ; Constantinople (Europe), Samarkand (Asie centrale, mixte) ; Alexandria (Égypte, Legend V+)
- ✅ **1 ville cachée :** Thief Town (village des voleurs)
- ✅ **Villes additionnelles post-classiques :** Baghdad (Arabie, après le cap 120)
- ✅ **2 villes de départ :** Jangan (chinois) et Constantinople (européens) — chaque race commence sur son continent
- ✅ **Monde ouvert continu :** pas d'instances entre les zones, tout est relié par des routes, rivières (fersy) et portails
- ✅ **Région = grille :** le monde est découpé en secteurs de 192×192 unités identifiés par un `Region ID`

### 📐 Système de Coordonnées

Le client officiel utilise le format interne **`Region / X / Y / Z`**, converti en **PosX/PosY monde** :

```
PosX = ((Region & 0xFF) - 135) × 192 + X / 10
PosY = ((Region >> 8) - 92) × 192 + Y / 10
```

- **PosX croissant = vers l'Est** (Chine = valeurs positives, Europe = négatives)
- **PosY croissant = vers le Nord** (déserts du sud = valeurs proches de 0 ou négatives)
- Le monde couvre 256×256 secteurs ≈ **49 152 × 49 152 unités** (PosX de −25 920 à +23 040)

> ⚠️ **Important :** les anciennes versions de cette doc utilisaient des coordonnées inventées (ex. « Jangan 2000,1000 »). Toutes les coordonnées de cette documentation sont désormais issues du **client officiel** (converties depuis xSROMap / données _RefRegion). Ne pas mixer les deux systèmes.

---

## 🗺️ Carte du Monde Officielle

Disposition réelle des grandes zones (PosX approx., PosY approx.) :

```
        NORD (PosY +)
         │
         ├── Samarkand (−5 180, 2 890) ── Asie centrale
         │        │
 Constantinople              Taklamakan (désert, Lord Yarkan)
 (−10 680, 2 600)            (−1 600 à 0, 2 100-2 600)
   │        │                     │
   │     Asia Minor            Karakoram (Isyutaru)
   │     (−6 400, 1 900)       (−1 550, −100)
   │                              │
   └── Roc Mountain (Demon Shaitan, −4 600, −200)
                    │
 OUEST ═════════════╪═══════════════════════ EST
 (PosX −)           │                     (PosX +)
          Alexandria (−16 400, 0)     Hotan (115, 50)
          Égypte, Legend V+           Oasis Kingdom
                    │                     │
              Baghdad (−8 540, −730)  Donwhang (3 550, 2 090)
              Arabie (post-120)           │
                                        Jangan (6 460, 1 100)
                                           │
                              Tomb of Qin-Shi (7 200, 2 090)
                              Thief Town (9 130, 860) — caché
```

### Tableau Récapitulatif des Régions

| Région (nom client EN) | Ville / Hub | Plage de niveaux | Monstres typiques | Unique local |
|---|---|---|---|---|
| **China** | Jangan | 1-20 | Mangyang, Yeoha, Tigers, Bandits | Tiger Girl (18) |
| **Western China** | Donwhang | 20-35 | Earth Ghosts, Stone Ghosts, Penons¹ | — |
| **Oasis Kingdom** (Tarim Basin) | Hotan | 30-60 | Ongs, Huns, Golems, Sonars | Uruchi (40) |
| **Karakoram** | — (montagnes) | 45-60 | Yetis, Evil Yetis, Penon Fighters | Isyutaru (60) |
| **Taklamakan** | — (désert) | 60-80 | Niya Guards/Spies, Demons | Lord Yarkan (80) |
| **Roc Mountain (West Asia)** | — (Mt. Roc) | 75-90 | Roc minions, demons | Demon Shaitan (90) |
| **East Europe** | Constantinople | 1-20 (EU) | Wolves, Weasels, Bandits EU | Cerberus (24) |
| **Asia Minor** | — (avant-postes) | 20-30 | Bigbands, Sapchers | Captain Ivy (30) |
| **Central Asia** | Samarkand | 30-45 | Kokorus, Ongs, Huns, Golems | — |
| **Egypt / Alexandria** | Alexandria | 100-110+ | Uneg, Weneg, Uraeus, Dark Khepri | Medusa (105) |
| **Arabia / Baghdad** | Baghdad | 115-120+ | Slaves, Raiders (post-classique) | — |

¹ *Les Penons se rencontrent en réalité surtout dans le bassin de Tarim / Karakoram ; le Stone Cave de Donwhang est peuplé d'Earth Ghosts.*

---

## 🏯 Régions Chinoises (Est)

### CHINA — Jangan (Level 1-20)

**Ville : Jangan ≈ (6 460, 1 100)**

- Région de départ des personnages chinois
- Architecture chinoise traditionnelle, quartier des Gisaeng, temple bouddhiste
- Zone de chasse : Tiger Mountain (Tiger Girl), Bandit Stronghold (sud), rivières à ferry à l'ouest
- Safe zone complète en ville (gardes, pas de PvP)
- NPCs : voir [CITIES_01_JANGAN.md](./CITIES_01_JANGAN.md)

> 📍 **Spawns Tiger Girl (officiels) :** (4853, 94) · (4733, −34) · (4840, −123) · (5039, −28) · (4230, 201) · (4418, 599) · (4744, 414) · (5335, 360) · (5355, −224) · (4544, −303) · (4309, −151)

### WESTERN CHINA — Donwhang (Level 20-35)

**Ville : Donwhang ≈ (3 550, 2 050)**

- Deuxième ville chinoise, plus au nord, sur la route des caravanes
- Zone de chasse : Earth Ghosts, Earth Taoists, et le **Donwhang Stone Cave** (4 étages)
- Le **bassin de Tarim** commence au sud (désert, Ongs, Uruchi)
- Route commerciale Jangan ↔ Donwhang : la plus pratiquée par les traders débutants (1 étoile)

### OASIS KINGDOM — Hotan (Level 30-60)

**Ville : Hotan ≈ (115, 50)**

- Ville-oasis au sud du monde, carrefour désertique
- Sert **les deux races** (fournisseurs chinois ET européens présents en ville)
- Zones de chasse : **Tarim Basin** (Uruchi, Ongs, Huns, Black Robber Den), montagnes vers le Karakoram
- **Ong Habitat** : LE spot de SP farming chinois historique (Ongs ~niv. 33-34, farming en GAP 9)
- Fortress War : Hotan Fortress juste au nord de la ville

### KARAKORAM (Level 45-60)

- Chaîne de montagnes enneigées entre l'Oasis Kingdom et l'Asie centrale (≈ −1 550, −100)
- Yetis, Evil Yetis, Penon Fighters
- **Isyutaru** (60, ~4,3 M HP) : la « Reine des Glaces », spawns autour du centre du massif et des Ancient Remains
- Passage quasi obligé Hotan → Samarkand à pied

### TAKLAKAN (Level 60-80)

- Grand désert nord (≈ −900 à −1 600, 2 100-2 600), au sud-ouest de la route Samarkand
- Niya Remains (ruines), Black Robber Den, démons et Niya Guards
- **Lord Yarkan** (80, ~9,3 M HP) : spawns derrière les Niya Remains et autour
- Zone de trade à haut risque (thieves haut niveau)

### ROC MOUNTAIN / WEST ASIA (Level 75-90)

- Massif montagneux sud-ouest (≈ −4 600, −200), ajouté avec **Legend III** (cap 90)
- Entrée par la **Gate of Ruler** (−4 612, −1)
- Pics : Heart Peak, Claw Peak, Wing Peak
- **Demon Shaitan** (90, ~12,7 M HP) : le boss final du cap 90 classique
- Drops 9D / Seal of Moon-Star-Sun haut de gamme

---

## 🏛️ Régions Européennes (Ouest)

### EAST EUROPE — Constantinople (Level 1-20 EU)

**Ville : Constantinople ≈ (−10 680, 2 600)**

- Ville de départ des personnages européens (race ajoutée en Legend I)
- Architecture byzantine, église, port (Harbor Manager Georion)
- Zones de chasse : Desperado Hill, Forest of Dusk, Garden of Gods
- **Cerberus** (24, ~693 000 HP) : spawns à l'ouest/sud-ouest de la ville (X −12 490 à −11 330)
- Eastern Europe Fortress (Fortress War) au sud de la ville
- NPCs : voir [CITIES_05_CONSTANTINOPLE.md](./CITIES_05_CONSTANTINOPLE.md)

### ASIA MINOR (Level 20-30)

- Bande de terre entre Constantinople et Samarkand (≈ −6 400 à −7 600)
- Sous-zones : Cleopatra's Gate, Amphitheater, Haran's Tower
- **Captain Ivy** (30, ~1,1 M HP) : spawns X −7 590 à −6 390 / Y 1 230 à 2 745
- Avant-postes militaires (quest hubs) le long de la route

### CENTRAL ASIA — Samarkand (Level 30-45)

**Ville : Samarkand ≈ (−5 180, 2 890)**

- Ville d'architecture islamique/timouride, hub des deux races pour le mid-game
- Kokorus (31), Peritons (32), Blood Ongs (33), Ongs (34), Hun Archers (35), Golems (29-35)
- Relais commercial stratégique entre Europe et Chine (route Constantinople ↔ Samarkand ↔ Hotan)
- NPCs : voir [NPCS_COORDINATES.md](./NPCS_COORDINATES.md#-samarkand-npcs)

---

## 🐪 Égypte et Alexandrie

### EGYPT — Alexandria (Level 100-110+, Legend V)

**Ville double : Alexandria (South) ≈ (−16 600, −300) / Alexandria (North) ≈ (−16 200, 50)**

- **South** : quartier du marché (armes/armures/potions), écuries, stockage — première zone atteinte en venant du désert
- **North** : palais du gouverneur Senmute, unions de jobs, port avec phare
- Zones de chasse : Delta Area, Egypt Desert, Storm & Cloud Desert, Kings Valley
- **Job Temple** (dungeon PvPvE 105+) : entrée « Pharaoh Tomb » à (−11 351, −3 278), costume de job obligatoire
- **Medusa** (105) : unique de l'ère Legend V (dans le Temple)
- Accessible par téléporteur dès Jangan/Hotan ou par la voie maritime depuis l'Europe

### ARABIA — Baghdad (post-cap 120, hors périmètre classique)

**Ville : Baghdad ≈ (−8 540, −730)**

- Palais du Roi Shahryar et de la Reine Sheherazade (contes des 1001 nuits)
- Zones : Phantom Desert, Kirk Field, Kalia's Hideout (boss room)
- Contenu postérieur au cap 120 classique — à n'implémenter que si le serveur cible l'inclut

---

## 🏰 Zones Spéciales

| Zone | Accès | Particularité |
|---|---|---|
| **Thief Town** (9 130, 860) | Téléporteur au sol (2 485, 2 679), Soldier Kartino à Constantinople (−10 495, 2 473), ou via les Smugglers | Village caché des voleurs : Stolen Goods Dealer, Thief Associate, bandits |
| **Bandit Fortress** (5 400, 50) | Portes I-III au sud de Jangan | Forteresse Fortress War « thief », ajoutée Legend III+ |
| **Jangan / Hotan / Constantinople Fortresses** | Portes voir [MAP_COORDINATES_REFERENCE.md](./MAP_COORDINATES_REFERENCE.md) | Zones de Fortress War hebdomadaire |
| **Forgotten World** | Portails dédiés (Dimension Pillars) | Instances journalières : Flame Mountain, etc. (Legend VI) |
| **Temple of Jupiter** | Entrée (13 138, −972), continent Est | Dungeon cap 120 (Hall of Worship, Zealots Hideout) |
| **Arena / Survival Arena** | Arena Manager en ville | PvP en équipe, récompenses en Arena Coins |

---

## 🏰 Dungeons et Instances

| Dungeon | Entrée (monde) | Niveaux | Contenu |
|---|---|---|---|
| **Donwhang Stone Cave** (1F-4F) | Ouest de Donwhang | ~26-70 | Earth Ghosts, quêtes, 4 étages superposés (Z 0/115/230/345) |
| **Tomb of Qin-Shi Emperor** (B1-B6) | (7 200, 2 086) NE de Jangan | 71-100 | Tomb Soldiers/Warriors/Guards, Tomb General, ajouté Legend IV |
| **Job Temple / Temple + Sanctums** (Seth, Haroeris, Isis, Anubis, Blue Eye) | (−11 351, −3 278) | 105+ | PvPvE en costume de job, Medusa, drops Egypt/Nova |
| **Cave of Meditation** | Générée pendant les Fortress Wars | — | Donjon de siège |
| **Flame Mountain** (Forgotten World) | Portails FW | 100+ | Instance journalière à talismans (Legend VI) |
| **Temple of Jupiter** (Earth's/Yuno's/Jupiter's Rooms, Zealots Hideout) | (13 138, −972) | 110-120 | Boss Jupiter, cap 120 |
| **Kalia's Hideout** | Arabie | 120+ | Boss room Baghdad |

👉 Détail complet : [29_FORGOTTEN_WORLD.md](./29_FORGOTTEN_WORLD.md) · [15_UNIQUE_BOSSES.md](./15_UNIQUE_BOSSES.md)

---

## 🚪 Téléporteurs et Transports

### Réseau de Dimensional Gates (inter-villes)

Téléporteurs fixes en ville (~5 000 gold par trajet sur iSRO classique, tarif réduit ~10 gold avant le level 20) :

| Depuis | Destinations possibles |
|---|---|
| **Jangan** (6 461, 1 097) | Donwhang · Alexandria (South) · Alexandria (North) |
| **Donwhang** (3 552, 2 113) | Jangan · Hotan |
| **Hotan** (113, 49) | Donwhang · Samarkand · Alexandria (S) · Alexandria (N) · Baghdad |
| **Samarkand** (−5 184, 2 891) | Constantinople · Hotan |
| **Constantinople** (−10 682, 2 585) | Samarkand |
| **Alexandria (South)** (−16 643, −275) | Jangan · Hotan · Alexandria (N) · Baghdad |
| **Alexandria (North)** (−16 148, 76) | Jangan · Hotan · Alexandria (S) · Baghdad |
| **Baghdad** (−8 538, −707) | Hotan · Alexandria (S) · Alexandria (N) |

### Ferries (traversées de rivière, zone Jangan)

| Vendeur | Position | Liaison |
|---|---|---|
| Ferry Ticket Seller Doji | (5 028, 1 136) | ↔ Tayun (5 043, 1 664) |
| Ferry Ticket Seller Tayun | (5 043, 1 664) | ↔ Doji |
| Ferry Ticket Seller Chau | (4 449, 929) | ↔ Hageuk (4 124, 1 189) |
| Ferry Ticket Seller Hageuk | (4 124, 1 189) | ↔ Chau |

### Voie maritime Europe ↔ Égypte

| Escale | Position |
|---|---|
| Harbor Manager **Gale** (port européen) | (−11 424, 1 162) |
| Pirate Morgun / Blackbeard (escales-pièges) | (−8 700, 2 210 / 1 828) |
| Harbor Manager **Marwa** (port d'Alexandria) | (−16 542, 372) |

### Autres moyens
- **Return Scroll / Reverse Return Scroll** : rappel vers la ville de résurrection
- **Téléporteurs de garde en ville** (ex. Soldier Choiyoung/Jingyo/Hogang/Sangnam à Jangan) : navette rapide entre les portes
- **Mounts** (cheval/chameau/éléphant) : déplacement et transport de marchandises

---

## 📈 Leveling Progression par Cap

### Cap 90 (classique iSRO, Legend III)
```
1-20    China (Jangan, Tiger Mountain)          [chinois]
1-20    East Europe (Constantinople)            [européens]
20-35   Western China (Donwhang, Stone Cave)
20-30   Asia Minor (européens) · Captain Ivy
30-45   Central Asia (Samarkand)
30-60   Oasis Kingdom (Hotan, Tarim Basin) · Uruchi
45-60   Karakoram · Isyutaru
60-80   Taklamakan · Lord Yarkan
75-90   Roc Mountain · Demon Shaitan
```

### Cap 110 (Legend V — Heroes of Alexandria)
```
90-100  Egypt : Delta Area, déserts d'Alexandria
100-110 Quêtes Alexandria, Kings Valley
105+    Job Temple (costume de job requis)
```

### Cap 120 (Legend VI puis mises à jour Jupiter)
```
100+    Forgotten World (instances à talismans)
110-120 Temple of Jupiter (Hall of Worship, Zealots Hideout)
115+    Arabie / Baghdad (contenu tardif)
```

---

## 🕰️ Évolution du Monde par Expansion

| Expansion | Contenu géographique ajouté | Cap |
|---|---|---|
| **Lancement (2005-2006)** | Chine : Jangan, Donwhang, Hotan, Taklamakan, Karakoram | 60→80 |
| **Legend I — Europe (2007)** | Constantinople, East Europe, Asia Minor, races/classes EU | 80 |
| **Legend II — Fortress War (2008)** | Forteresses de Jangan/Hotan (+ Constantinople côté EU) | 80 |
| **Legend III — Roc Mountain** | Roc Mountain, équipement 9D | **90** |
| **Legend III+** | Bandit Fortress (forteresse des thieves) | 90 |
| **Legend IV (2009)** | Tomb of Qin-Shi Emperor (70-100), 10D, Medusa | 100 |
| **Legend V — Heroes of Alexandria (2010)** | Alexandria/Egypt, Job Temple | **110** |
| **Legend VI — Forgotten World (2011)** | Instances Forgotten World (Flame Mountain...) | 110→**120** |
| **Mises à jour Jupiter (2013+)** | Temple of Jupiter, 11D-13D | 120 |
| **Ère post-classique** | Baghdad/Arabie, Silkroad R | 120+ |

---

## ⚔️ Safe Zones vs Danger Zones

### Safe Zones
- **Villes** (Jangan, Donwhang, Hotan, Samarkand, Constantinople, Alexandria, Thief Town) : aucun PvP, gardes PNJ, aucun monstre
- **Avant-postes militaires** (Outposts) : zones protégées au cœur des régions de chasse

### Danger Zones
- **Toutes les zones de chasse ouvertes** : monstres agressifs
- **Routes commerciales** : voleurs PNJ générés selon la valeur du chargement, + voleurs joueurs
- **Job Temple** : PvPvE permanent entre jobs
- **Fortress War** (le jour du siège) : PvP de masse

### Règles PvP / PK
- Pas de PvP libre en monde ouvert : il faut être en costume de **job** (trader/hunter/thief) ou en guerre de guilde/forteresse
- Les **thieves** peuvent attaquer les **traders/hunters** et inversement
- Le meurtre de joueurs neutres (PK) entraîne un statut de **murderer** (perte d'XP, drop possible)

---

## ❓ FAQ

### Q: Quelle ville pour débuter ?
**R:** Jangan pour la race chinoise, Constantinople pour la race européenne. Les deux continents offrent une progression 1-20 équivalente.

### Q: Peut-on traverser tout le monde à pied ?
**R:** Oui, le monde est continu de la Chine à l'Europe. Comptez des heures à pied — d'où l'importance des Dimensional Gates, des mounts et des ferries.

### Q: Existe-t-il un bateau entre l'Europe et l'Égypte ?
**R:** Oui : voie maritime Harbor Manager **Gale** (Europe, −11 424/1 162) → escales pirates → Harbor Manager **Marwa** (Alexandria, −16 542/372). Des téléporteurs relient aussi directement les villes.

### Q: Où se trouve le village des voleurs ?
**R:** **Thief Town**, caché dans les montagnes à l'est (≈ 9 130/860). Accès par téléporteur au sol (2 485/2 679), via Soldier Kartino à Constantinople, ou via les Smugglers des villes.

### Q: Quelle différence entre Alexandria South et North ?
**R:** South = marché principal + services (armurier Hemaka, potions Titi, stockage, écuries). North = palais du gouverneur, unions de jobs, port/phare. Les deux sont reliées par téléporteur.

### Q: Le désert fait-il perdre des HP (chaleur) ?
**R:** Non, contrairement à une idée reçue : les déserts de SRO n'appliquent aucun débuff environnemental. Le danger vient des monstres agressifs et des thieves.

### Q: Quelles zones pour le cap 90 classique ?
**R:** Jangan → Donwhang → Hotan/Tarim → Karakoram → Taklamakan → Roc Mountain. L'Égypte (Alexandria) est du contenu cap 110 (Legend V).

---

## 🔗 Resources

### Cartes
- [xSROMap — Carte interactive officielle (coord. client)](https://jellybitz.github.io/xSROMap/)
- [Silkroad Online Wiki — Map (Fandom)](https://silkroadonline.fandom.com/wiki/Map)
- [Monster Areas — Guild Algarb](https://guildalgarb.wordpress.com/games/sro/maps/monster-areas/)
- [World Map Wiki — Just Silkroad](https://justsilkroad.online/worldmap)
- [SilkRoad NoObz — Maps](http://silknoobz.50webs.com/Maps.html)

### Données et guides
- [StrategyWiki — Silkroad Online/Locations](https://strategywiki.org/wiki/Silkroad_Online/Locations)
- [Rev6 — All Unique Spawn Points](https://rev6.org/en/post/silkroad-online-uniq-spawn-noktalari)
- [SRO Info — Unique spawn maps + coords](https://sroinfo.forumotion.com/t9-map-unique-spawn-map-cords)
- [Wikipedia — Silkroad Online (expansions)](https://en.wikipedia.org/wiki/Silkroad_Online)
- [Alexandria Dungeons — Guild Algarb](https://guildalgarb.wordpress.com/games/sro/maps/alexandria-dungeons/)

### Documentation interne liée
- [MAP_COORDINATES_REFERENCE.md](./MAP_COORDINATES_REFERENCE.md) — toutes les coordonnées officielles
- [NPCS_COORDINATES.md](./NPCS_COORDINATES.md) — NPCs par ville avec X/Y
- [15_UNIQUE_BOSSES.md](./15_UNIQUE_BOSSES.md) — uniques et spawns
- [25_LEVELING_GUIDE.md](./25_LEVELING_GUIDE.md) — parcours de leveling

---

*Dernière mise à jour : 2026-10-01*
*Sources : données client officielles extraites de xSROMap (697 NPCs, 161 téléporteurs), StrategyWiki, Rev6, SRO Info, Fandom Wiki, press releases Joymax*
*Système de coordonnées : PosX/PosY officiel (voir section Système de Coordonnées)*
