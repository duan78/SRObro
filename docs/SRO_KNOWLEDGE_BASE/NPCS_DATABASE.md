# 👤 NPCs Database — Référence Fonctionnelle

> 📍 **Vous êtes ici :** [Accueil](README.md) → [NPCs Database](NPCS_DATABASE.md)

## 📋 Table des Matières
- [Introduction](#-introduction)
- [NPCs par Ville (résumé)](#-npcs-par-ville-résumé)
- [Commerçants](#-commerçants)
- [Services](#-services)
- [Job NPCs](#-job-npcs)
- [Skill NPCs (entraîneurs)](#-skill-npcs-entraîneurs)
- [Quest NPCs](#-quest-npcs)
- [NPCs d'Événements et Systèmes](#-npcs-dévénements-et-systèmes)
- [NPCs de Transport](#-npcs-de-transport)
- [NPCs Récurrents](#-npcs-récurrents)
- [Système de Coordonnées](#-système-de-coordonnées)
- [FAQ](#-faq)

---

## 📚 Introduction

Cette base documente les **fonctions et services** de tous les types de NPCs de Silkroad Online, avec leurs **noms officiels** et leurs positions (PosX/PosY).

> 🗺️ Pour les tables complètes ville par ville avec toutes les coordonnées : **[NPCS_COORDINATES.md](NPCS_COORDINATES.md)** (fichier de référence).
> ⚠️ Refonte 2026-10 : les noms génériques (« Weapon Merchant », « Potion Master ») et prix inventés des versions précédentes ont été remplacés par les données du client officiel.

---

## 🏙️ NPCs par Ville (résumé)

| Ville | Niveaux | Armes | Armures | Potions | Specialty | Stockage | Écurie | Jobs (T/H/Th) |
|-------|---------|-------|--------|---------|-----------|----------|--------|----------------|
| **Jangan** | 1-20 | Blacksmith Chulsan | Protector Trader Mrs Jang | Grocery Jinjin + Dae-Pyeong | Specialty Trader Jodaesan | Sansan/Wangu | Machun | Hwajung / Gwakwi / Smuggler Chao |
| **Donwhang** | 20-35 | Blacksmith Agol | Protector Trader Yeolah | Grocery Yeosun + Dae-Pyeong | Specialty Shop Elder Leegak | Irina/Paedo | Makgo | Leegeuk / Haraho / Smuggler Chungho |
| **Hotan** | 30-60 | Blacksmith Soboi | Protector Trader Gonishya | Potion Merchant Manina (+Shadi EU) | Specialty Trader Sanmok | Auisan | — (via regions voisines) | Asaman / Ahmok / — |
| **Samarkand** | 30-45 | Weapon Trader Tricia | Protector Trader Aryoan | Grocery Saha (+Shadi EU) | Specialty Trader Toson | Saesa | Hoyun | Karen / Shahad / Smuggler Barus |
| **Constantinople** | 1-20 EU | Weapon Trader Balbardo | Protector Trader Jatomo | Europe Medicine Shadi | Specialty Trader Tina | (inn/auberge) | Treno | Tana / Adria / Smuggler Raul |
| **Alexandria (S)** | 100+ | Weapon Trader Hemaka | Armor Trader Sharon | Potion Merchant Titi | Specialty Trader Wasdi | Khamererne | Nefret | — |
| **Alexandria (N)** | 100+ | Weapon Trader Chunmoo | Armor Trader Viviana | Grocery Kapra / Potion Thiara | — | Asagon | — | Naunakt / Narmer / Tausert |
| **Thief Town** | 20+ | — | — | — | — | — | — | Thief Associate + Stolen Goods Dealer |
| **Baghdad** *(post-classique)* | 115+ | Repairer Uthman | — | Potion Trader Abubark | Specialty Abutalip | Abdullah | Ali | Hassan / Sami / Obad |

---

## 🛒 Commerçants

### Blacksmith / Weapon Trader
- **Fonction :** vente d'armes (+ souvent armures de base) et **réparation**
- **Réparation :** coût proportionnel à la valeur et à l'usure de l'item
- **Degrees par ville (approximatif, mondes classiques) :**
  - Jangan : 1D-3D · Donwhang : 3D-5D · Hotan : 5D-8D · Samarkand : 5D-8D · Constantinople : 1D-8D (EU) · Alexandria : 10D-11D+ (12D-13D cap 120)

### Protector Trader / Armor Trader
- **Fonction :** armures (Garment/Protector/Armour) et shields
- Mêmes plages de degrés que les armes par ville

### Grocery Trader / Potion Merchant / Medicine Supplier
- **Fonction :** potions HP/MP (Small → XXL), Universal Pills, Vigor Pills, Return Scrolls, Speed Scrolls
- **Spécificité race :** « China Medicine Supplier » (CH) vs « Europe Medicine Supplier » (EU) — les potions sont identiques, la distinction est cosmétique/commerciale

### Accessory / Valuables Dealer
- **Fonction :** anneaux, colliers, boucles d'oreilles
- « China Valuables Dealer » / « Europe Valuables Dealer » selon la race servie

### Specialty Trader / Goods Supplier
- **Fonction :** **specialty goods** (marchandises de trade) et matériaux
- Le prix d'achat des specialty goods dépend de la ville ; la revente rapporte selon la **distance** parcourue
- On en trouve aussi **hors des villes** (ravitaillement des caravanes) : ex. Specialty Trader Hounah (Tarim), Osaman (Karakoram), Payi (Taklamakan), Kaella/Hujaan (Égypte)

---

## 📦 Services

### Storage Keeper
- **Fonction :** entrepôt partagé entre les personnages du compte
- Présent dans toutes les villes (parfois en double : Sansan/Wangu à Jangan, Irina/Paedo à Donwhang — doublon officiel du client)
- Capacité étendue par pages (selon serveur)

### Stable Keeper / Stable Master
- **Fonction :** achat de montures (cheval), nourriture (carottes/fourrage), réparation des montures
- Les **transports de trade** (cheval de bât, chameau, éléphant — selon version/serveur) s'achètent auprès des unions/marchands de trade

### Guild Manager
- **Fonction :** création de guilde, gestion, union de guildes
- Jangan : Leebaek · Donwhang : Ryukang · Hotan : Musai · Samarkand : Hapsa · Constantinople : Gilt · Alexandria : Sennefer/Elia · Baghdad : Nuur

### Inn Master
- **Fonction :** repos/restauration (Constantinople : Sikeulro)

---

## 💼 Job NPCs

### Triangle des jobs

| Job | Type de NPC | Rôle |
|-----|---------|------|
| **Trader** | Merchant Associate / Trader Union President | Achète des specialty goods, les transporte, les vend au loin |
| **Hunter** | Hunter Associate / Hunter Union President | Escorte les caravanes, chasse les thieves (PNJ et joueurs) |
| **Thief** | Smuggler / Thief Union President / Thief Associate | Attaque les caravanes, vole les marchandises |

### Règles importantes
- **Niveau minimum :** généralement 20 pour rejoindre une union
- **Costume de job** requis pour participer au jeu de trade/PvP de job
- Le NPC thief est toujours **dissimulé** dans une ruelle à l'écart (Smuggler)
- **Hotan n'a pas de NPC thief** (particularité confirmée par les données client)
- Les marchandises volées se revendent au **Stolen Goods Dealer** de **Thief Town**

### Job Temple
- Alexandria : accès 105+ en costume de job (voir [CITIES_04_ALEXANDRIA.md](CITIES_04_ALEXANDRIA.md))

---

## 🎓 Skill NPCs (entraîneurs)

### Masteries chinoises (Jangan, Donwhang, Hotan...)
- Bicheon (sword/blade), Heuksal (spear/glaive), Pacheon (bow)
- Cold, Lightning, Fire, Force
- Dans les données client modernes, les « Trainers » urbains sont regroupés ; historiquement chaque ville chinoise forme toutes les masteries

### Classes européennes (Constantinople, Samarkand, Alexandria)
- Warrior, Rogue, Wizard, Warlock, Bard, Cleric
- Chaque personnage EU combine une classe principale + un support

👉 Détail des skills : [SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md) · [03_EUROPEAN_CLASSES.md](03_EUROPEAN_CLASSES.md)

---

## 📜 Quest NPCs

| Type | Exemples officiels |
|------|--------------------|
| **Guides de départ** | Guide Lipria (Constantinople), Adventurer Flora (Jangan), Guide Riise/Raffy |
| **Chefs de village / militaires** | Village Chief Hwangno (Jangan), General Sonhyeon (Jangan), General Ratchel (Constantinople) |
| **Daily Quests** | Daily Quest Manager Wei Yan (Jangan), Bai Man (Donwhang), Dasra (Hotan), Senlaf (Samarkand), Asshur (Constantinople) |
| **Quêtes de ville** | Baekako, Honmusa (Donwhang), Exorcist Miaoryeong (Jangan), Sunset Witch/Boy Yongso (faubourg de Constantinople) |
| **Quêtes d'Alexandria** | Governor Senmute (série « Overdriving Heart »), Finance Officer Maneto (taxes), Librarian Ahha, Doctor Renenutet, Lighthouse Keeper Snefru, Harbor Manager Marwa |
| **Avant-postes (zones)** | Outpost Commanders + Guards (Tarim, Asia Minor, Central Asia, Egypt) — hubs de quêtes de chasse |

👉 Détail : [16_QUEST_SYSTEM.md](16_QUEST_SYSTEM.md)

---

## 🎪 NPCs d'Événements et Systèmes

| NPC | Fonction | Présence |
|-----|----------|----------|
| **Magic POP** (+ Guide Gori) | Gacha (tickets → récompenses) | toutes les villes |
| **Event So-Ok** | Événements saisonniers | toutes les villes |
| **Homeless Genie** | Téléportations utilitaires (quête) | toutes les villes |
| **Mysterious Priest** | Quêtes spéciales | toutes les villes |
| **Carnival Manager Jooa** | Carnaval | toutes les villes |
| **Premium Service Manager Qing Yu** | Item mall / services premium | toutes les villes |
| **Arena Manager / Survival Arena Manager** | Arènes PvP (Arena Coins) | grandes villes |
| **Casino Guardian Huhoan / Lottery Seller Wangwon / Ticket Seller Gyoun** | Mini-jeux | Jangan |
| **Gisaengs** (So-Ok, Yumi, Juyeong, Ahjin, Mihyang, Juju) | Quartier des plaisirs (lore/quests) | Jangan |
| **Dimensional Gate** | Téléporteurs inter-villes | voir Transport |

---

## 🚢 NPCs de Transport

### Dimensional Gates (réseau inter-villes)
Voir le graphe complet : [MAP_COORDINATES_REFERENCE.md — Portails](MAP_COORDINATES_REFERENCE.md#-portails-et-téléporteurs)

| Gate | Position |
|------|----------|
| Jangan | (6 461, 1 097) |
| Donwhang | (3 552, 2 113) |
| Hotan | (113, 49) |
| Samarkand | (−5 184, 2 891) |
| Constantinople | (−10 682, 2 585) |
| Alexandria (South) | (−16 643, −275) |
| Alexandria (North) | (−16 148, 76) |
| Baghdad | (−8 538, −707) |

### Ferries et ports

| NPC | Position | Liaison |
|-----|----------|---------|
| Ferry Ticket Seller Doji ↔ Tayun | (5 028, 1 136) ↔ (5 043, 1 664) | rivière de Jangan (N-S) |
| Ferry Ticket Seller Chau ↔ Hageuk | (4 449, 929) ↔ (4 124, 1 189) | rivière de Jangan (E-O) |
| Harbor Manager Gale | (−11 424, 1 162) | port Europe (voie maritime) |
| Pirate Morgun / Blackbeard | (−8 700, 2 210 / 1 828) | escales pirates |
| Harbor Manager Marwa | (−16 542, 371) | port Alexandria |
| Harbor Manager Georion | (−10 408, 2 503) | port de Constantinople (origine historique) |

### Gardes téléporteurs
- **Jangan :** Soldier Choiyoung / Jingyo / Hogang / Sangnam (navettes inter-portes)
- **Constantinople :** Soldier Kartino → **Thief Town**

---

## 🔁 NPCs Récurrents

Un socle commun de NPCs apparaît dans (presque) toutes les villes — voir la table détaillée dans [NPCS_COORDINATES.md — NPCs Récurrents](NPCS_COORDINATES.md#-npcs-récurrents-présents-dans-plusieurs-villes) : Magic POP, Event So-Ok, Homeless Genie, Mysterious Priest, Carnival Jooa, Premium Qing Yu, Consignment Merchant Juel, Arena Managers, fournisseurs China/Europe.

---

## 📐 Système de Coordonnées

```
PosX = ((Region & 0xFF) - 135) × 192 + X / 10   → croissant vers l'EST
PosY = ((Region >> 8) - 92) × 192 + Y / 10      → croissant vers le NORD
```

| Ville | PosX centre | PosY centre |
|-------|-------------|-------------|
| Jangan | ≈ 6 460 | ≈ 1 100 |
| Donwhang | ≈ 3 550 | ≈ 2 050 |
| Hotan | ≈ 115 | ≈ 50 |
| Samarkand | ≈ −5 180 | ≈ 2 890 |
| Constantinople | ≈ −10 680 | ≈ 2 600 |
| Alexandria | ≈ −16 400 | ≈ 0 |
| Thief Town | ≈ 9 130 | ≈ 860 |
| Baghdad | ≈ −8 540 | ≈ −730 |

---

## 💡 Tips

**Organisation urbaine (pattern commun aux villes) :**
1. **Place centrale** : storage, grocery/potions, consignment
2. **Rangée commerciale** : blacksmith, protector trader, accessory
3. **Unions de jobs** : autour de la place (trader/hunter visibles, thief caché)
4. **Périphérie** : gardes, gates, téléporteurs

**Trouver un NPC :**
- Carte du monde (M) avec icônes NPCs
- Les coords PosX/PosY de cette base
- Les marqueurs xSROMap (recherche par nom)

---

## ❓ FAQ

**Q: Les prix des shops sont-ils documentés ici ?**
R: Non — les prix varient selon les caps/serveurs et les anciens tableaux de prix de cette doc étaient inventés. Seuls les degrees par ville (fiables) sont indiqués.

**Q: Où sont les entraîneurs de skills exactement ?**
R: Chaque ville de race forme ses masteries ; dans les données client, les trainers urbains sont regroupés sur la place (voir NPCS_COORDINATES.md). Les fortress « Trainer » ne forment pas de skills (garnison FW).

**Q: Pourquoi certains NPCs apparaissent-ils en double ?**
R: Doublons officiels du client (ex. Storage-Keeper Sansan/Wangu). À traiter comme un seul point de service.

**Q: Que fait le Homeless Genie ?**
R: NPC de quête récurrent qui propose des téléportations utilitaires une fois les quêtes accomplies.

---

## 🔗 Voir aussi

- **[NPCS_COORDINATES.md](NPCS_COORDINATES.md)** — toutes les coordonnées par ville ⭐
- **[32_NPCS_DATABASE.md](32_NPCS_DATABASE.md)** — hub NPCs
- [MAP_COORDINATES_REFERENCE.md](MAP_COORDINATES_REFERENCE.md) — coordonnées monde
- [09_JOB_SYSTEM_OVERVIEW.md](09_JOB_SYSTEM_OVERVIEW.md) — système de jobs
- [16_QUEST_SYSTEM.md](16_QUEST_SYSTEM.md) — quêtes

---

*Dernière mise à jour : 2026-10-01*
*Sources : client officiel via xSROMap (JellyBitz), SRO Lobby, Silkroad Secrets*
