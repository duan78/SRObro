# 🏯 Jangan — Guide Complet de la Ville

> 📍 **Vous êtes ici :** [Accueil](README.md) → [Villes](CITIES_01_JANGAN.md)

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Carte et Quartiers](#-carte-et-quartiers)
- [NPCs Officiels avec Coordonnées](#-npcs-officiels-avec-coordonnées)
- [Services](#-services)
- [Téléportation depuis Jangan](#-téléportation-depuis-jangan)
- [Quartier des Gisaeng et Jeux](#-quartier-des-gisaeng-et-jeux)
- [Zones Environnantes](#-zones-environnantes)
- [Fortress War : Jangan Fortress](#-fortress-war--jangan-fortress)
- [Routes Commerciales](#-routes-commerciales)
- [Tips](#-tips)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🏯 Vue d'Ensemble

**Jangan** est la ville de départ des personnages **chinois** et la première ville du jeu (2005). C'est le hub des niveaux 1-20 et le point de départ de la Route de la Soie côté est.

| Attribut | Valeur |
|----------|--------|
| **Région** | China |
| **Nom chinois (officiel)** | **长安** (Cháng'ān — la Chang'an historique) · coréen : 장안 |
| **Position (officielle)** | ≈ X **6 460**, Y **1 100** (PosX/PosY monde) |
| **Niveaux** | 1-20 (ville de départ chinoise) |
| **Architecture** | Chinoise impériale, toits rouges, temple bouddhiste |
| **Safe zone** | ✅ Oui (gardes en ville) |
| **Fonction économique** | Achat de specialty goods, départ des caravanes vers Donwhang |

> ⚠️ Les coordonnées utilisées ici sont les **PosX/PosY officiels du client** (cf. [MAP_COORDINATES_REFERENCE.md](MAP_COORDINATES_REFERENCE.md)). Les anciennes valeurs « X 2000, Y 1000 » de cette doc étaient erronées.

---

## 🗺️ Carte et Quartiers

```
                NORD (PosY +)
     ┌─────────────────────────────────────┐
     │  Temple bouddhiste (Priests)        │
     │  Jangan Fortress Clerk (6 493,1264) │
     │                                     │
     │  OUEST          CENTRE          EST │
     │  Stable         Grande place     South Gate
     │  Blacksmith      Marché         (soldiers
     │  (6 369,1101)   (Storage,       téléporteurs)
     │  Protector      Grocery,
     │  Trader         Herbalist)
     │  Gisaeng district (ouest, 6 220-6 290)
     │  Smuggler Chao (ruelle, 6 283,1089) │
     │                                     │
     │  Guild/Hunter NPCs (sud-ouest)      │
     │  Village Chief Hwangno (6 613,1103) │
     └─────────────────────────────────────┘
                SUD (PosY −)
        → vers Donwhang (route + ferries)
```

### Quartiers clés
- **Grande place centrale** (≈ 6 440-6 510, 1 030-1 080) : storage, grocery, herbaliste, fournisseurs, Magic POP, arena managers
- **Quartier commercial ouest** (≈ 6 370, 1 070-1 100) : forgeron Chulsan, Protector Trader Mrs Jang, écurie
- **Quartier des Gisaeng** (≈ 6 220-6 290, 1 000-1 080) : maisons de thé, casino, contrebandier
- **Zone temples/guildes** (≈ 6 200-6 300, 1 180-1 310) : General Sonhyeon, Hunter Associate, Guild Manager, Buddhist Priests
- **Portes gardées** : 4 soldiers [Teleport] autour de la ville

---

## 👤 NPCs Officiels avec Coordonnées

> Source : données client officielles (extraction xSROMap). Les noms génériques des anciennes versions (« Weapon Trader So », etc.) sont remplacés par les noms réels du client.

### 🛠️ Commerçants

| NPC | Position (X, Y) | Fonction |
|-----|-----------------|----------|
| **Blacksmith Chulsan** | (6 369, 1 101) | Armes/armures 1D-3D, réparation |
| **Protector Trader Mrs Jang** | (6 369, 1 069) | Armures 1D-3D |
| **Grocery Trader Jinjin** | (6 502, 1 068) | Potions, consommables |
| **Herbalist Yangyun** | (6 494, 1 101) | Herbes, médicaments |
| **Specialty Trader Jodaesan** | (6 512, 1 008) | Specialty goods (trade) |
| **China Goods Supplier Ye-Ryeong** | (6 459, 1 072) | Marchandises générales |
| **China Medicine Supplier Dae-Pyeong** | (6 457, 1 074) | Potions/meds |
| **China Valuables Dealer Ryoe-A** | (6 461, 1 070) | Accessoires |
| **Trader Yusun** | (6 493, 1 017) | Union des traders |
| **Islam Merchant Ishyak** | (6 503, 1 018) | Marchand ambulant |
| **Consignment Merchant Juel** | (6 512, 1 002) | Vente/consignation entre joueurs |

### 📦 Services

| NPC | Position (X, Y) | Fonction |
|-----|-----------------|----------|
| **Storage-Keeper Sansan / Wangu** | (6 434, 1 059) | Entrepôt |
| **Stable-Keeper Machun** | (6 369, 1 005) | Montures, nourriture, réparation |
| **Guild Manager Leebaek** | (6 247, 1 209) | Création/gestion de guilde |
| **Daily Quest Manager Wei Yan** | (6 408, 1 071) | Quêtes journalières |
| **Village Chief Hwangno** | (6 613, 1 103) | Chef du village, quêtes |
| **General Sonhyeon** | (6 203, 1 182) | Militaire, quêtes |
| **Exorcist Miaoryeong** | (5 774, 1 234) | Quêtes (chasse aux esprits) |
| **Jangan Fortress Clerk** | (6 493, 1 264) | Inscriptions Fortress War |

### ⚔️ Jobs

| NPC | Position (X, Y) | Fonction |
|-----|-----------------|----------|
| **Merchant Associate Hwajung** | (6 512, 996) | Union Trader (devenir trader) |
| **Hunter Associate Gwakwi** | (6 304, 1 192) | Union Hunter (devenir hunter) |
| **Smuggler Chao** | (6 283, 1 089) | Thief (ruelle du quartier Gisaeng) |

> 🕵️ Comme dans toutes les villes, le NPC thief est **dissimulé** — à Jangan il se trouve dans une ruelle du quartier des Gisaeng.

### 🚪 Gardes téléporteurs (navettes inter-portes)

| NPC | Position (X, Y) | Liaisons |
|-----|-----------------|----------|
| **Soldier Choiyoung [Teleport]** | (6 437, 1 150) | ↔ Sangnam, Jingyo, Hogang |
| **Soldier Jingyo [Teleport]** | (6 429, 963) | ↔ Choiyoung, Sangnam, Hogang |
| **Soldier Hogang [Teleport]** | (6 177, 1 155) | ↔ Choiyoung, Sangnam, Jingyo |
| **Solder Sangnam [Teleport]** | (6 667, 1 137) | ↔ Choiyoung, Jingyo, Hogang |

Autres gardes : Soldier Dangsam (6 440, 963), Soldier Jowi (6 177, 1 145), Soldier Iyang (6 667, 1 147), Soldier Fengil (6 430, 1 150).

### 🎪 NPCs d'événements / divers

| NPC | Position (X, Y) | Fonction |
|-----|-----------------|----------|
| **Arena Manager / Survival Arena Manager** | (6 422, 1 043-1 045) | Arène PvP |
| **Magic POP / Magic POP Guide Gori** | (6 497, 1 079) / (6 434, 1 033) | Gacha |
| **Event So-Ok** | (6 446, 1 045) | Événements |
| **Homeless Genie** | (6 426, 1 036) | Quête (téléportations) |
| **Mysterious Priest** | (6 443, 1 055) | Quêtes |
| **Carnival Manager Jooa** | (6 446, 1 048) | Carnaval |
| **Premium Service Manager Qing Yu** | (6 443, 1 037) | Item Mall / premium |
| **Adventurer Flora** | (6 503, 986) | Guide |

### ⛩️ Temple bouddhiste

| NPC | Position (X, Y) |
|-----|-----------------|
| **Buddhist Priest Kushyan** | (6 597, 1 166) |
| **Buddhist Priest Jeonghye** | (6 594, 1 250) |
| **Juho** | (6 293, 1 304) |

---

## 🛒 Services

### Réparation
- **Blacksmith Chulsan** : armes/armures, coût proportionnel à la valeur et à l'usure

### Stockage
- **Storage-Keeper Sansan/Wangu** : entrepôt partagé entre personnages du compte

### Écurie
- **Stable-Keeper Machun** : montures (chevaux), carottes/fourrage, réparation des montures

---

## 🚪 Téléportation depuis Jangan

### Dimensional Gate (grande porte dimensionnelle)
- **Position :** (6 461, 1 097) — au centre de la ville
- **Destinations :** Donwhang · Alexandria (South) · Alexandria (North)
- **Coût :** ~5 000 gold par trajet (≈ 10 gold avant le level 20) sur iSRO classique — variable selon serveur

### Ferries (traversées de rivière à l'ouest/sud-ouest)
| Vendeur | Position | Liaison |
|---------|----------|---------|
| Ferry Ticket Seller **Doji** | (5 028, 1 136) | ↔ Tayun |
| Ferry Ticket Seller **Tayun** | (5 043, 1 664) | ↔ Doji |
| Ferry Ticket Seller **Chau** | (4 449, 929) | ↔ Hageuk |
| Ferry Ticket Seller **Hageuk** | (4 124, 1 189) | ↔ Chau |

### Return Scroll
- Rappel instantané au point de résurrection (à définir auprès du « Residence » en ville)

---

## 🎎 Quartier des Gisaeng et Jeux

Le quartier ouest de Jangan (unique en son genre) accueille :

| NPC | Position (X, Y) | Rôle |
|-----|-----------------|------|
| **Gisaeng So-Ok** | (6 234, 1 022) | Animatrice |
| **Gisaeng Yumi** | (6 209, 997) | Animatrice |
| **Gisaeng Juyeong** | (6 294, 1 057) | Animatrice |
| **Gisaeng Ahjin** | (6 223, 1 063) | Animatrice |
| **Gisaeng Mihyang** | (6 221, 1 065) | Animatrice |
| **Gisaeng Juju** | (6 285, 1 079) | Animatrice |
| **Casino Guardian Huhoan** | (6 579, 1 036) | Mini-jeux |
| **Lottery Seller Wangwon** | (6 551, 1 051) | Loterie |
| **Ticket Seller Gyoun** | (6 546, 1 051) | Billets |
| **WalYoung** | (6 614, 1 067) | Divers |
| **Bagger Sochil** | (6 283, 1 014) | Quête (portage) |

---

## 🐯 Zones Environnantes

### Tiger Mountain (sud-ouest, niveaux 1-20)
- Mangyangs, Yeohas, Small/Big-Eye Ghosts, Tigers
- **Tiger Girl (unique, niv. 18, 598 720 HP)** — 11 points de spawn officiels :
  `4853/94 · 4733/−34 · 4840/−123 · 5039/−28 · 4230/201 · 4418/599 · 4744/414 · 5335/360 · 5355/−224 · 4544/−303 · 4309/−151`
  - Noms officiels : ZH **虎女** (hǔnǚ) sur la 虎穴山 (« mont du repaire aux tigres ») · KR **호녀** sur la 호혈산 — ✅ recherche ZH/KO 2026-10
  - Fenêtre de respawn TR : **~210-390 min** après la mort (✅ recherche TR 2026-10) ; inflige l'état **Zombie** → prévoir des Pill

### Bandit Stronghold (sud)
- Bandits, Bandit Archers — bon spot de farming bas niveau

### Route de Donwhang (ouest → nord-ouest)
- Traversée des rivières par **ferry** (Doji↔Tayun, Chau↔Hageuk)
- Earth Ghosts en approche de Donwhang

### Tomb of Qin-Shi Emperor (nord-est)
- Entrée du donjon 70-100 : **(7 200, 2 086)** — voir [14_MONSTER_GUIDE.md](14_MONSTER_GUIDE.md)
- Noms officiels : ZH **秦始皇陵** (mausolée de Qin Shi Huang) · KR **진시황릉** (Legend Ⅶ KR, test 08/08/2007 — ~19 mois avant l'iSRO) — ✅ recherche ZH/KO 2026-10

---

## 🏰 Fortress War : Jangan Fortress

| Élément | Donnée |
|---------|--------|
| **Portes d'accès (I-III)** | (6 159, 54) · (6 348, 50) · (6 609, 52) — au sud de la ville |
| **Intérieur du fort** | zone dédiée (≈ −12 560, −4 751 en coordonnées d'instance) |
| **Clerk** | Jangan Fortress Clerk (6 493, 1 264) |
| **Cycle** | hebdomadaire (créneau serveur) |
| **Bénéfices** | taxes sur les transactions de Jangan, buffs de guilde, prestige |

> En Fortress War : **Gate of Charge / Gate of Glory / Gate of Resurrection** gèrent les flux attaquants/défenseurs ; la **Gate of Resurrection** ramène à Jangan.

---

## 🐪 Routes Commerciales

### Jangan → Donwhang (route « 1 étoile » débutante)
- **Distance :** ≈ 3 500 unités (route + ferry)
- **Danger :** faible-moyen (thieves PNJ de bas niveau, quelques joueurs)
- **Profit :** modéré — la route d'apprentissage du trade

### Jangan → Hotan (grande traversée)
- Via Donwhang ou directement par les fermes et le bassin de Tarim
- Danger croissant (Earth Ghosts, Uruchi possible dans le Tarim)

---

## 💡 Tips

**Nouveaux joueurs :**
1. Suivez la chaîne de quêtes des guides (Adventurer Flora, Village Chief Hwangno)
2. Achetez l'équipement 1D-2D chez Blacksmith Chulsan / Mrs Jang
3. Mettez votre point de résurrence à Jangan avant d'explorer
4. Le raccourci vers Donwhang passe par les ferries (-ticket peu cher)

**Traders :**
- Achetez vos specialty goods chez **Specialty Trader Jodaesan**
- Partez par la porte ouest, traversez en ferry, evitez les bottlenecks
- 1 étoile = pas de vol de marchandise par les thieves joueurs (règle classique : les thieves PNJ attaquent dès 1 étoile, les joueurs à partir de 2+ selon serveur)

**Hunters / Thieves :**
- Hunter Associate Gwakwi au sud-ouest ; Smuggler Chao caché dans le quartier Gisaeng
- Les caravanes sortant de Jangan sont les cibles les plus faciles du jeu — terrain d'entraînement des thieves

---

## ❓ FAQ

**Q: Où est le NPC pour devenir thief à Jangan ?**
R: **Smuggler Chao** (6 283, 1 089), dans une ruelle du quartier des Gisaeng (ouest de la ville).

**Q: Comment aller à Donwhang ?**
R: Dimensional Gate au centre-ville (6 461, 1 097) ou à pied par la porte ouest + ferry (Doji↔Tayun).

**Q: Où acheter un cheval ?**
R: **Stable-Keeper Machun** (6 369, 1 005).

**Q: Où se trouve Tiger Girl ?**
R: Tiger Mountain, au sud-ouest de la ville — points de spawn listés plus haut, le plus fréquenté étant ≈ (4 853, 94).

**Q: Pourquoi les noms de NPCs ont-ils changé dans cette doc ?**
R: Les versions précédentes utilisaient des noms inventés. Cette version utilise les **noms officiels du client** (Blacksmith Chulsan, Grocery Trader Jinjin, etc.).

---

## 🔗 Resources

- [xSROMap — carte interactive](https://jellybitz.github.io/xSROMap/)
- [StrategyWiki — Silkroad Online/Locations](https://strategywiki.org/wiki/Silkroad_Online/Locations)
- [Fandom Wiki — Town](https://silkroadonline.fandom.com/wiki/Town)
- Docs internes : [NPCS_COORDINATES.md](NPCS_COORDINATES.md) · [MAP_COORDINATES_REFERENCE.md](MAP_COORDINATES_REFERENCE.md) · [13_ZONES_OVERVIEW.md](13_ZONES_OVERVIEW.md)

---

*Dernière mise à jour : 2026-10-01*
*Sources : données client officielles (xSROMap), StrategyWiki, Fandom Wiki*
*Fusion multilingue 2026-10 : [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) (nom ZH 长安, zones 虎穴山/秦始皇陵) · [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) (noms KR) · [ML_RESEARCH/RESEARCH_TR.md](ML_RESEARCH/RESEARCH_TR.md) (timer Tiger Girl)*
