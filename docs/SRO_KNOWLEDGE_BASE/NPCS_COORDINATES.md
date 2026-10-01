# 📇 Base de Données des Coordonnées NPCs

> 📍 **Vous êtes ici :** [Accueil](README.md) → [NPCs Coordinates](NPCS_COORDINATES.md)

## 📋 Table des Matières
- [Introduction](#-introduction)
- [Format des Données](#-format-des-données)
- [Jangan NPCs](#-jangan-npcs)
- [Donwhang NPCs](#-donwhang-npcs)
- [Hotan NPCs](#-hotan-npcs)
- [Samarkand NPCs](#-samarkand-npcs)
- [Constantinople NPCs](#-constantinople-npcs)
- [Alexandria NPCs](#-alexandria-npcs)
- [Thief Town NPCs](#-thief-town-npcs)
- [Baghdad NPCs (post-classique)](#-baghdad-npcs-post-classique)
- [Job NPCs par Ville](#-job-npcs-par-ville)
- [Unique Boss Spawn Locations](#-unique-boss-spawn-locations)
- [NPCs Récurrents (présents dans plusieurs villes)](#-npcs-récurrents-présents-dans-plusieurs-villes)
- [Notes de Développement](#-notes-de-développement)
- [FAQ](#-faq)

---

## 📚 Introduction

Cette documentation fournit la **base de données des NPCs de Silkroad Online avec leurs coordonnées officielles** (PosX/PosY), extraite du client via xSROMap (697 NPCs référencés ; les villes ci-dessous couvrent les ~320 NPCs urbains utiles).

**Sources Primaires :**
- **Client officiel** — extraction xSROMap v1.4 (https://jellybitz.github.io/xSROMap/, dépôt JellyBitz/xSROMap, fichier `assets/js/main.js`)
- Documentation SRObro
- Forums communautaires (SRO Lobby, Silkroad Secrets)

> ⚠️ **Refonte 2026-10 :** les noms génériques inventés (« Weapon Trader So ») et les coordonnées estimées des versions précédentes ont été remplacés par les **noms et positions réels du client**. Ne pas mixer avec l'ancien système.

---

## 📐 Format des Données

### Système de coordonnées
```
PosX = ((Region & 0xFF) - 135) × 192 + X / 10   → croissant vers l'EST
PosY = ((Region >> 8) - 92) × 192 + Y / 10      → croissant vers le NORD
```
Voir [MAP_COORDINATES_REFERENCE.md](MAP_COORDINATES_REFERENCE.md) pour le détail complet.

### Structure standard (SRObro)

```json
{
  "npc_id": "JANGAN_BLACKSMITH_CHULSAN",
  "name": "Blacksmith Chulsan",
  "city": "Jangan",
  "position": { "posX": 6369, "posY": 1101 },
  "region": 25000,
  "function": "WEAPON_TRADER",
  "services": ["SELL_WEAPONS", "SELL_ARMOR", "REPAIR"],
  "race": "CHINESE"
}
```

### Types de fonctions

| Function | Description |
|----------|-------------|
| `WEAPON_TRADER` / `BLACKSMITH` | Armes + réparation |
| `ARMOR_TRADER` / `PROTECTOR_TRADER` | Armures |
| `POTION_TRADER` / `MEDICINE_SUPPLIER` / `GROCERY_TRADER` | Consommables |
| `ACCESSORY_TRADER` / `VALUABLES_DEALER` | Accessoires |
| `SPECIALTY_TRADER` / `GOODS_SUPPLIER` | Specialty goods / matériaux |
| `STORAGE_KEEPER` | Entrepôt |
| `STABLE_MASTER` / `STABLE_KEEPER` | Montures |
| `GUILD_MANAGER` | Guildes |
| `MERCHANT_ASSOCIATE` / `TRADER_UNION` | Union Trader |
| `HUNTER_ASSOCIATE` / `HUNTER_UNION` | Union Hunter |
| `SMUGGLER` / `THIEF_UNION` | Union Thief |
| `QUEST_NPC` | Quêtes |
| `GUARD` / `SOLDIER` | Gardes |
| `HARBOR_MANAGER` / `FERRY_TICKET` | Transports |
| `ARENA_MANAGER` / `EVENT_NPC` / `GACHA` | Divers |

---

## 🏯 Jangan NPCs

**Ville :** China · **Centre :** ≈ (6 460, 1 100) · **Emprise :** 6 170-6 670 × 960-1 310 · **55 NPCs recensés**

### Commerçants

| NPC | PosX | PosY | Fonction |
|-----|------|------|----------|
| Blacksmith Chulsan | 6 369 | 1 101 | Armes/armures 1D-3D, réparation |
| Protector Trader Mrs Jang | 6 369 | 1 069 | Armures |
| Grocery Trader Jinjin | 6 502 | 1 068 | Potions, consommables |
| Herbalist Yangyun | 6 494 | 1 101 | Herbes |
| Specialty Trader Jodaesan | 6 512 | 1 008 | Specialty goods |
| China Goods Supplier Ye-Ryeong | 6 459 | 1 072 | Marchandises |
| China Medicine Supplier Dae-Pyeong | 6 457 | 1 074 | Potions |
| China Valuables Dealer Ryoe-A | 6 461 | 1 070 | Accessoires |
| Trader Yusun | 6 493 | 1 017 | Trade |
| Islam Merchant Ishyak | 6 503 | 1 018 | Marchand ambulant |
| Consignment Merchant Juel | 6 512 | 1 002 | Consignation |

### Services et jobs

| NPC | PosX | PosY | Fonction |
|-----|------|------|----------|
| Storage-Keeper Sansan / Wangu | 6 434 | 1 059 | Entrepôt |
| Stable-Keeper Machun | 6 369 | 1 005 | Écurie |
| Guild Manager Leebaek | 6 247 | 1 209 | Guildes |
| Merchant Associate Hwajung | 6 512 | 996 | **Trader** |
| Hunter Associate Gwakwi | 6 304 | 1 192 | **Hunter** |
| Smuggler Chao | 6 283 | 1 089 | **Thief** (caché, quartier Gisaeng) |
| Daily Quest Manager Wei Yan | 6 408 | 1 071 | Quêtes journalières |
| Village Chief Hwangno | 6 613 | 1 103 | Quêtes |
| General Sonhyeon | 6 203 | 1 182 | Quêtes militaires |
| Exorcist Miaoryeong | 5 774 | 1 234 | Quêtes |
| Jangan Fortress Clerk | 6 493 | 1 264 | Fortress War |
| Arena Manager / Survival Arena Manager | 6 422 | 1 043-1 045 | Arènes |
| Adventurer Flora | 6 503 | 986 | Guide |

### Gardes téléporteurs

| NPC | PosX | PosY |
|-----|------|------|
| Soldier Choiyoung [Teleport] | 6 437 | 1 150 |
| Soldier Jingyo [Teleport] | 6 429 | 963 |
| Soldier Hogang [Teleport] | 6 177 | 1 155 |
| Solder Sangnam [Teleport] | 6 667 | 1 137 |
| Soldier Dangsam / Jowi / Iyang / Fengil | 6 177-6 667 | 963-1 150 |

### Temple, Gisaeng et événements

| NPC | PosX | PosY |
|-----|------|------|
| Buddhist Priest Kushyan | 6 597 | 1 166 |
| Buddhist Priest Jeonghye | 6 594 | 1 250 |
| Juho | 6 293 | 1 304 |
| Gisaeng So-Ok / Yumi / Juyeong / Ahjin / Mihyang / Juju | 6 209-6 294 | 997-1 079 |
| Casino Guardian Huhoan | 6 579 | 1 036 |
| Lottery Seller Wangwon | 6 551 | 1 051 |
| Ticket Seller Gyoun | 6 546 | 1 051 |
| WalYoung | 6 614 | 1 067 |
| Bagger Sochil | 6 283 | 1 014 |
| Magic POP / Guide Gori | 6 497 / 6 434 | 1 079 / 1 033 |
| Event So-Ok / Homeless Genie / Mysterious Priest / Carnival Jooa / Premium Qing Yu | 6 426-6 446 | 1 036-1 055 |

---

## 🏛️ Donwhang NPCs

**Ville :** Western China · **Centre :** ≈ (3 550, 2 050) · **Emprise :** 3 470-3 630 × 1 950-2 290 · **47 NPCs recensés**

### Commerçants

| NPC | PosX | PosY | Fonction |
|-----|------|------|----------|
| Blacksmith Agol | 3 576 | 2 042 | Armes/armures 3D-5D |
| Protector Trader Yeolah | 3 576 | 2 010 | Armures |
| Grocery Trader Yeosun | 3 512 | 1 994 | Consommables |
| Herbalist Bori | 3 516 | 2 033 | Herbes |
| Specialty Shop Elder Leegak | 3 495 | 2 076 | Specialty goods |
| Donwhang Goods Supplier Ye-Rang | 3 535 | 2 098 | Marchandises |
| China Medicine Supplier Dae-Pyeong | 3 538 | 2 095 | Potions |
| China Valuables Dealer Ryoe-Won | 3 533 | 2 101 | Accessoires |
| Trader Sunwha | 3 514 | 1 959 | Trade |

### Services et jobs

| NPC | PosX | PosY | Fonction |
|-----|------|------|----------|
| Storage-Keeper Irina / Paedo | 3 582 | 1 990 | Entrepôt |
| Stable-Keeper Makgo | 3 598 | 2 085 | Écurie |
| Guild Manager Ryukang | 3 591 | 1 965 | Guildes |
| Merchant Associate Leegeuk | 3 501 | 2 076 | **Trader** |
| Hunter Associate Haraho | 3 516 | 2 176 | **Hunter** |
| Smuggler Chungho | 3 616 | 2 007 | **Thief** (caché) |
| Daily Quest Manager Bai Man | 3 570 | 2 098 | Quêtes journalières |
| Baekako / Honmusa | 3 492 / 3 502 | 1 967 | Quêtes |
| Arena Manager | 3 549 | 2 090 | Arène |

### Temple, gardes et événements

| NPC | PosX | PosY |
|-----|------|------|
| Buddhist Priest Hyeon / Bupgong / Fa | 3 520-3 596 | 2 238-2 291 |
| Soldier Baeksong / Dooil / Manho / Moho / Hahun | 3 468-3 628 | 1 947-2 116 |
| Magic POP / Guide Gori | 3 510 / 3 572 | 2 073 / 2 059 |
| Event So-Ok / Homeless Genie / Mysterious Priest / Carnival Jooa / Premium Qing Yu | 3 525-3 562 | 2 066-2 091 |

### Avant-postes environnants

| NPC | PosX | PosY |
|-----|------|------|
| Outpost Commander Ru Long Hu + gardes (Tarim) | ~131 | 1 318-1 331 |
| Outpost Commander Dao Zhi Fong + gardes (ouest) | 2 545-2 550 | 2 098-2 109 |
| Outpost Commander Bai Qi Long + gardes (est) | 3 944-3 954 | 2 051-2 062 |

---

## 🏜️ Hotan NPCs

**Ville :** Oasis Kingdom · **Centre :** ≈ (115, 50) · **Emprise :** 15-320 × 0-470 · **32 NPCs recensés**

| NPC | PosX | PosY | Fonction |
|-----|------|------|----------|
| Blacksmith Soboi | 50 | 77 | Armes/armures 5D-8D |
| Protector Trader Gonishya | 58 | 19 | Armures |
| Potion Merchant Manina | 83 | 109 | Potions |
| Specialty Trader Sanmok | 152 | 90 | Specialty goods |
| Hotan Goods Supplier Sarha | 164 | 17 | Marchandises |
| China Medicine Supplier Dae-Pyeong | 168 | 39 | Potions CH |
| Europe Medicine Supplier Shadi | 168 | 34 | Potions EU |
| China Valuables Dealer Ryoe-Ju | 181 | 13 | Accessoires CH |
| Europe Valuables Dealer David | 178 | 16 | Accessoires EU |
| Consignment Merchant Juel | 149 | 97 | Consignation |
| Trader Sabonue | 149 | 1 | Trade |
| Storage-Keeper Auisan | 113 | 61 | Entrepôt |
| Merchant Associate Asaman | 157 | 84 | **Trader** |
| Hunter Associate Ahmok | 225 | 155 | **Hunter** |
| *(aucun NPC thief — voir Thief Town / autres villes)* | — | — | — |
| Guild Manager Musai | 115 | 443 | Guildes |
| Daily Quest Manager Dasra | 167 | 56 | Quêtes journalières |
| Hotan Fortress Clerk | 15 | 465 | Fortress War |
| Nephrite Refiner Pahap | 230 | 450 | Raffinage (spécialité) |
| Soldier Pao / Tuolan | 109 / 120 | 353 |
| Soldier Baoman / Makhan | 317 | 43-53 |
| Arena Manager / Arena Item Manager | 124 | 47-51 |
| Survival Arena Manager | 121 | 56 |
| Magic POP / Guide Gori | 165 / 100 | 78 / 49 |
| Event So-Ok / Homeless Genie / Mysterious Priest / Carnival Jooa / Premium Qing Yu | 105-122 | 37-58 |

---

## 🌏 Samarkand NPCs

**Ville :** Central Asia · **Centre :** ≈ (−5 180, 2 890) · **Emprise :** −5 370 à −5 000 × 2 700-3 010 · **34 NPCs recensés**

| NPC | PosX | PosY | Fonction |
|-----|------|------|----------|
| Weapon Trader Tricia | −5 200 | 2 961 | Armes EU/CH 5D-8D |
| Protector Trader Aryoan | −5 246 | 2 916 | Armures |
| Grocery Trader Saha | −5 212 | 2 834 | Consommables |
| Specialty Trader Toson | −5 100 | 2 870 | Specialty goods |
| Samarkand Goods Supplier Julia | −5 212 | 2 908 | Marchandises |
| Europe Medicine Supplier Shadi | −5 214 | 2 902 | Potions EU |
| Europe Valuables Dealer Sid | −5 211 | 2 911 | Accessoires EU |
| Storage-Keeper Saesa | −5 128 | 2 801 | Entrepôt |
| Stable-Keeper Hoyun | −5 115 | 2 905 | Écurie |
| Merchant Associate Karen | −5 117 | 2 870 | **Trader** |
| Trader Samanda | −5 228 | 2 854 | Trade |
| Hunter Associate Shahad | −5 143 | 3 008 | **Hunter** |
| Smuggler Barus | −5 234 | 2 734 | **Thief** (caché) |
| Guild Manager Hapsa | −5 170 | 2 971 | Guildes |
| Daily Quest Manager Senlaf | −5 160 | 2 914 | Quêtes journalières |
| Nun Martel | −5 233 | 2 873 | Couvent |
| Soldier Dohwa / Tapai | −5 190 / −5 176 | 2 710 |
| Soldier Paje / Jooha | −5 001 | 2 884-2 898 |
| Soldier Ahu / Asahap | −5 364 | 2 886-2 899 |
| Arena Manager | −5 149 | 2 885 | Arène |
| Magic POP / Guide Gori | −5 093 / −5 125 | 2 871 / 2 829 |
| Event So-Ok / Homeless Genie / Mysterious Priest / Carnival Jooa / Premium Qing Yu | −5 155 à −5 192 | 2 854-2 873 |

### Avant-postes de Central Asia / Asia Minor (quest hubs)

| Outpost (Commander) | PosX | PosY |
|---------------------|------|------|
| Galia (Central Asia) | −8 479 | 2 094-2 103 |
| Ethan (Asia Minor) | −3 402 | 2 090-2 105 |
| Haviel | −6 660 | 1 762-1 767 |
| Gavin | −4 784 | 2 167-2 173 |
| Austin | −7 219 | 2 561-2 564 |
| Dick | −11 601 | 1 836-1 840 |
| Albert | −10 736 | 3 370-3 374 |
| Amanda | −12 560 | 3 220-3 224 |

---

## 🏰 Constantinople NPCs

**Ville :** East Europe · **Centre :** ≈ (−10 680, 2 600) · **Emprise :** −11 170 à −10 380 × 2 330-2 940 · **48 NPCs recensés**

### Commerçants et services

| NPC | PosX | PosY | Fonction |
|-----|------|------|----------|
| Weapon Trader Balbardo | −10 674 | 2 649 | Armes 1D-8D EU |
| Protector Trader Jatomo | −10 753 | 2 604 | Armures EU |
| Grocery Trader Bajel | −10 682 | 2 521 | Consommables |
| Specialty Trader Tina | −10 717 | 2 519 | Specialty goods |
| Europe Medicine Supplier Shadi | −10 702 | 2 605 | Potions |
| Europe Goods Supplier Ohara | −10 703 | 2 600 | Marchandises |
| Europe Valuables Dealer Zephyd | −10 705 | 2 598 | Accessoires |
| Consignment Merchant Juel | −10 750 | 2 522 | Consignation |
| Stable-Keeper Treno | −10 765 | 2 533 | Écurie |
| Trader Anna | −10 766 | 2 624 | Trade |
| Inn Master Sikeulro | −10 617 | 2 581 | Auberge |
| Harbor Manager Georion | −10 408 | 2 503 | Port |
| Guild Manager Gilt | −10 552 | 2 329 | Guildes |
| Daily Quest Manager Asshur | −10 662 | 2 568 | Quêtes journalières |
| Steward Yupitel | −10 880 | 2 617 | Administration |
| Consul Rialto | −10 863 | 2 787 | Consul |
| Eastern Europe Fortress Clerk | −10 778 | 2 793 | Fortress War |
| Arena Manager / Survival Arena Manager | −10 709 / −10 704 | 2 585 / 2 573 | Arènes |
| Guide Riise / Raffy / Lipria | −10 696 / −10 971 / −10 617 | 2 610 / 2 629 / 2 921 | Guides |
| Adventurer Demetri | −10 617 | 2 554 | Quêtes |

### Jobs, militaires et religion

| NPC | PosX | PosY | Fonction |
|-----|------|------|----------|
| Merchant Associate Tana | −10 735 | 2 513 | **Trader** |
| Hunter Associate Adria | −10 835 | 2 703 | **Hunter** |
| Smuggler Raul | −10 969 | 2 543 | **Thief** (caché au sud) |
| Association Boss Kapros | −10 832 | 2 405 | Association |
| Association Boss Uvetino | −10 885 | 2 352 | Association |
| General Ratchel | −10 830 | 2 468 | Militaire |
| Soldier Kartino | −10 495 | 2 473 | Garde → **téléporte à Thief Town** |
| Soldier Maximus | −10 480 | 2 484 | Garde |
| Soldier Alex / Takia | −11 005 | 2 637-2 651 | Gardes |
| Soldier Vesaros / Kasius | −10 740 à −10 749 | 2 664-2 674 | Gardes |
| Soldier Riedo / Kotomo | −10 614 à −10 637 | 2 936 | Gardes (North Gate) |
| Clergy Gabriel | −10 387 | 2 776 | Église |
| Nun Retaldi | −10 618 | 2 636 | Couvent |
| Mysterious Priest | −10 681 | 2 611 | Quêtes |
| Sunset Witch / Boy Yongso (faubourg nord) | −10 376 / −10 392 | 3 231 / 3 220 | Quêtes |

### Événements

| NPC | PosX | PosY |
|-----|------|------|
| Magic POP / Guide Gori | −10 708 / −10 654 | 2 519 / 2 585 |
| Event So-Ok / Homeless Genie / Carnival Jooa / Premium Qing Yu | −10 670 à −10 683 | 2 560-2 611 |

---

## 🺺 Alexandria NPCs

**Ville :** Egypt (South ≈ (−16 600, −300) / North ≈ (−16 200, 50)) · **Emprise :** −16 760 à −15 995 × −480-440 · **46 NPCs recensés**

### Alexandria (South) — marché

| NPC | PosX | PosY | Fonction |
|-----|------|------|----------|
| Weapon Trader Hemaka | −16 739 | −277 | Armes 10D+ |
| Armor Trader Sharon | −16 723 | −296 | Armures 10D+ |
| Grocery Trader Melit | −16 579 | −279 | Consommables |
| Potion Merchant Titi | −16 624 | −358 | Potions |
| Storage Keepeer Khamererne | −16 478 | −304 | Entrepôt |
| Stable Master Nefret | −16 425 | −220 | Écurie |
| Specialty Trader Wasdi | −16 593 | 0 | Specialty goods |
| Trader Dena | −16 662 | −360 | Trade |
| Doctor Renenutet | −16 724 | −386 | Quêtes médicales |
| Librarian Ahha | −16 431 | −84 | Quêtes |
| Finance Officer Maneto | −16 447 | −75 | Quêtes de taxes |
| Arena Manager | −16 626 | −289 | Arène |
| Magic POP / Guide Gori | −16 568 / −16 625 | −271 / −258 | Gacha |
| Event So-Ok / Homeless Genie / Mysterious Priest / Carnival Jooa / Premium Qing Yu | −16 593 à −16 660 | −291 à −257 | Événements |

### Alexandria (North) — palais, jobs, port

| NPC | PosX | PosY | Fonction |
|-----|------|------|----------|
| Governor Senmute | −16 762 | −154 | Gouverneur (quêtes principales) |
| Palace Guard Mushari / Sesilrum | −16 752 / −16 741 | −175 / −164 | Palais |
| Guild Manager Sennefer | −16 640 | −45 | Guildes |
| Guild Manager Elia | −16 109 | −47 | Guildes |
| Trader Union President Naunakt | −16 624 | 11 | **Trader** |
| Hunter Union President Narmer | −16 625 | −94 | **Hunter** |
| Hunter Union Item Exchange manager Bakara | −16 590 | −31 | Récompenses hunter |
| Thief Union President Tausert | −16 092 | −7 | **Thief** |
| Thief Union Item Exchange manager Luresia | −16 150 | −70 | Récompenses thief |
| Weapon Trader Chunmoo | −16 255 | −19 | Armes (2e marché) |
| Armor Trader Viviana | −16 256 | 9 | Armures (2e marché) |
| Grocery Trader Kapra | −16 197 | 53 | Consommables (2e marché) |
| Potion Merchant Thiara | −16 237 | 35 | Potions (2e marché) |
| Storage Keeper Asagon | −16 082 | 24 | Entrepôt (2e) |
| Smuggler Seek | −16 105 | 66 | Thief (accès direct) |
| Harbor Manager Marwa | −16 542 | 371 | Port (voie maritime) |
| Lighthouse Keeper Snefru | −16 675 | 431 | Phare, quêtes |
| Egyptian Sailor 1 / 2 (×4) | −16 440 à −16 710 | 246-440 | Équipage |
| Egyptian Soldier Mobefe / Turian | −16 445 / −16 465 | −456 / −476 | Garnison |
| Egyptian Soldier Aptaru / Kamori | −15 995 / −16 010 | 76 / 99 | Garnison |

---

## 🗡️ Thief Town NPCs

**Position :** ≈ (9 130, 860) — vallée cachée à l'est · **Accès :** téléporteur au sol (2 485, 2 679), Soldier Kartino (Constantinople), Smugglers

| NPC | PosX | PosY | Fonction |
|-----|------|------|----------|
| Windy Phantom Thief | 9 088 | 808 | PNJ thief |
| Thief Associate | 9 122 | 824 | Union Thief |
| Tiger Bandit Band | 9 138 | 857 | PNJ thief |
| Black Robber Band | 9 149 | 875 | PNJ thief |
| Stolen Goods Dealer | 9 119 | 891 | **Revente des marchandises volées** |
| Vicious Desperado | 9 166 | 906 | PNJ thief |

---

## 🕌 Baghdad NPCs (post-classique)

**Ville :** Arabia · **Centre :** ≈ (−8 540, −730) · **Emprise :** −8 810 à −8 210 × −1 100 à −440 · **54 NPCs recensés** · *Contenu postérieur au cap 120 classique*

| Catégorie | NPCs principaux (PosX, PosY) |
|-----------|------------------------------|
| **Palais** | King Shahryar (−8 508, −741) · Queen Sheherazade (−8 503, −755) · Palace Guard Alim / Azim · Ministers Abshad / Mahmud |
| **Commerçants** | Fruit Trader Syukri (−8 760, −915) · Oil Merchant Khaled (−8 787, −836) · Spice Trader Malak (−8 760, −814) · Potion Trader Abubark (−8 789, −793) · Grocery Trader Warda (−8 729, −673) · Specialty Abutalip (−8 778, −640) · Trade merchant Shadia (−8 555, −489) · Repairer Uthman (−8 481, −447) |
| **Jobs** | Merchant Association Head Hassan (−8 679, −760) · Hunter Association Head Sami (−8 556, −519) · Thief Association Head Obad (−8 358, −822) · Smuggler Dubai (−8 363, −860) |
| **Services** | Storage Keeper Abdullah (−8 491, −984) · Guild Manager Nuur (−8 445, −979) · Stable Keeper Ali (−8 611, −494) · Village Old Man Kerim (−8 605, −1 001) |
| **Garnison** | ~20 guards (Harun, Hindshind, Aziz, Bari, Basit, Patah, Imanun, Kaupun, Jaffar, Hajib, Moharet, Duban, Djaman, Ka'ish, Mutaqa...) |
| **Village** | Village Man Yamain / Itzak / Phuad · Village Woman Nazima / Sa'adatun / Zvaida |
| **Événements** | Magic POP, Event So-Ok, Homeless Genie, Mysterious Priest, Carnival Jooa, Premium Qing Yu, Survival Arena (≈ −8 470 à −8 510, −1 010 à −982) |

---

## 💼 Job NPCs par Ville

### Tableau récapitulatif (noms officiels + positions)

| Ville | Trader | Hunter | Thief |
|-------|--------|--------|-------|
| **Jangan** | Merchant Associate Hwajung (6 512, 996) | Hunter Associate Gwakwi (6 304, 1 192) | Smuggler Chao (6 283, 1 089) |
| **Donwhang** | Merchant Associate Leegeuk (3 501, 2 076) | Hunter Associate Haraho (3 516, 2 176) | Smuggler Chungho (3 616, 2 007) |
| **Hotan** | Merchant Associate Asaman (157, 84) | Hunter Associate Ahmok (225, 155) | — (aucun) |
| **Samarkand** | Merchant Associate Karen (−5 117, 2 870) | Hunter Associate Shahad (−5 143, 3 008) | Smuggler Barus (−5 234, 2 734) |
| **Constantinople** | Merchant Associate Tana (−10 735, 2 513) | Hunter Associate Adria (−10 835, 2 703) | Smuggler Raul (−10 969, 2 543) |
| **Alexandria (N)** | Trader Union President Naunakt (−16 624, 11) | Hunter Union President Narmer (−16 625, −94) | Thief Union President Tausert (−16 092, −7) |
| **Baghdad** | Merchant Association Head Hassan (−8 679, −760) | Hunter Association Head Sami (−8 556, −519) | Thief Association Head Obad (−8 358, −822) |
| **Thief Town** | — | — | Thief Associate (9 122, 824) + Stolen Goods Dealer (9 119, 891) |

> Particularités : **Hotan** n'a pas de NPC thief ; **Alexandria** utilise le schéma « President + Item Exchange manager » ; les Smugglers sont les intermédiaires thief des villes classiques.

---

## 👹 Unique Boss Spawn Locations

### Les 7 uniques classiques (cap 90)

| Unique | Niv. | HP | Zone | Zone de spawn (min/max) |
|--------|------|----|------|-------------------------|
| **Tiger Girl** | 18 | 598 720 | China — Tiger Mountain | X 4 230-5 355 · Y −303-599 (11 points) |
| **Cerberus** | 24 | 693 072 | East Europe — autour de Constantinople | X −12 488 à −11 332 · Y 1 297-2 225 (13 points) |
| **Captain Ivy** | 30 | 1 094 835 | Asia Minor | X −7 587 à −6 390 · Y 1 229-2 745 (8 points) |
| **Uruchi** | 40 | 1 779 528 | Oasis Kingdom — Tarim Basin | X 2 041-3 170 · Y −367-840 (11 points) |
| **Isyutaru** | 60 | 4 324 612 | Karakoram | X −2 206 à −860 · Y −1 044-462 (11 points) |
| **Lord Yarkan** | 80 | 9 353 045 | Taklamakan — Niya Remains | X −1 563 à 50 · Y 1 858-2 555 (10 points) |
| **Demon Shaitan** | 90 | 12 732 060 | Roc Mountain | X −4 917 à −4 179 · Y −519-215 (6 points) |

> La liste détaillée point par point figure dans [MAP_COORDINATES_REFERENCE.md](MAP_COORDINATES_REFERENCE.md#-zones-de-chasse-et-uniques).

### Uniques ultérieurs

| Unique | Niv. | Zone |
|--------|------|------|
| Medusa | 105 | Égypte (ère Legend V, contenu du Temple) |
| Tomb General | ~90+ | Tomb of Qin-Shi Emperor |
| Boss du Temple of Jupiter | 110-120 | Hall of Worship / Zealots Hideout |

---

## 🔁 NPCs Récurrents (présents dans plusieurs villes)

Le client duplique un socle commun de NPCs dans chaque ville :

| NPC | Rôle | Présent à |
|-----|------|-----------|
| **China Medicine Supplier Dae-Pyeong** | Potions CH | Jangan, Donwhang, Hotan |
| **Europe Medicine Supplier Shadi** | Potions EU | Hotan, Samarkand, Constantinople |
| **Consignment Merchant Juel** | Consignation | Jangan, Donwhang, Hotan, Constantinople |
| **Magic POP + Guide Gori** | Gacha | toutes les villes |
| **Event So-Ok** | Événements | toutes les villes |
| **Homeless Genie** | Téléportations utilitaires | toutes les villes |
| **Mysterious Priest** | Quêtes | toutes les villes |
| **Carnival Manager Jooa** | Carnaval | toutes les villes |
| **Premium Service Manager Qing Yu** | Item mall | toutes les villes |
| **Arena Manager (+ Item Manager)** | Arène | Jangan, Donwhang, Hotan, Samarkand, Constantinople, Alexandria |
| **Fournisseurs (Goods/Valuables) « China/Europe »** | Équipement par race | villes CH ou EU |

---

## 📝 Notes de Développement

### Pour SRObro Browser Clone

```javascript
// Fichier: data/npcs.json — exemple au format officiel converti
{
  "id": "JANGAN_BLACKSMITH_CHULSAN",
  "name": "Blacksmith Chulsan",
  "city": "Jangan",
  "region": 25000,
  "position": { "posX": 6369, "posY": 1101 },
  "function": "WEAPON_TRADER",
  "services": ["SELL_WEAPONS_1D_3D", "REPAIR"]
}
```

### Chargement par chunks (streaming)

```javascript
class NPCStreaming {
  constructor(chunkSize = 960) {  // 5 secteurs = 960 unités
    this.loaded = new Set();
  }
  chunkOf(posX, posY) {
    return Math.floor(posX / this.chunkSize) + '_' + Math.floor(posY / this.chunkSize);
  }
  update(player) {
    const key = this.chunkOf(player.posX, player.posY);
    if (!this.loaded.has(key)) { this.loadChunk(key); this.loaded.add(key); }
  }
}
```

### Interaction

```javascript
const INTERACTION_RANGE = 15; // unités jeu
function nearestNPC(player, npcs, filter) {
  return npcs
    .filter(n => !filter || filter(n))
    .map(n => ({ n, d: Math.hypot(n.posX - player.posX, n.posY - player.posY) }))
    .sort((a, b) => a.d - b.d)
    .find(x => x.d <= INTERACTION_RANGE)?.n;
}
```

### Méthodes de collecte des coordonnées
1. **xSROMap** — double-clic = PosX/PosY/Region ; source : dépôt GitHub JellyBitz/xSROMap (`main.js` contient les 697 NPCs + 161 TPs)
2. **Client / PK2** — tables `_RefNpc` / `_RefRegion` des bases d'émulateurs
3. **Validation croisée** — forums (SRO Info 2009 pour les spawns d'uniques, SRO Lobby pour les listes de NPCs)

---

## 📊 Statistiques

### Résumé par ville (données client)

| Ville | NPCs recensés | Commerçants | Jobs (T/H/Th) | Gardes | Événements+divers |
|-------|---------------|-------------|----------------|--------|-------------------|
| Jangan | 55 | 11 | 3 | 8 | 33 |
| Donwhang | 47 | 9 | 3 | 5 | 30 |
| Hotan | 32 | 10 | 2 | 4 | 18 |
| Samarkand | 34 | 8 | 3 | 6 | 22 |
| Constantinople | 48 | 10 | 3 | 9 | 26 |
| Alexandria (S+N) | 46 | 11 | 3 | 6 | 26 |
| Thief Town | 6 | 1 | 1 | 0 | 5 |
| Baghdad (post-classique) | 54 | 8 | 3 | ~20 | 23 |
| **Total urbain** | **~322** | — | — | — | — |

*(La base complète xSROMap référence 697 NPCs, incluant avant-postes, zones de chasse, donjons et événements.)*

---

## ❓ FAQ

**Q: D'où viennent ces coordonnées ?**
R: Extraction directe du **client officiel** via le projet xSROMap (formule de conversion PosX/PosY documentée dans [MAP_COORDINATES_REFERENCE.md](MAP_COORDINATES_REFERENCE.md)).

**Q: Pourquoi Storage-Keeper apparaît deux fois à Jangan/Donwhang ?**
R: Le client place deux NPCs (Sansan/Wangu, Irina/Paedo) au même endroit — c'est un doublon officiel, pas une erreur.

**Q: Hotan n'a vraiment pas de thief ?**
R: Confirmé : aucune union thief dans les données client de Hotan. Les thieves utilisent Donwhang, Samarkand ou Thief Town.

**Q: Les positions sont-elles exactes au pixel près ?**
R: Oui pour les NPCs listés (extraction client). Les ranges « ≈ » ne sont utilisés que pour les résumés de zones.

---

## 🎯 Prochaines Étapes

1. Extraire les **spawns de monstres** (Nests) au même format
2. Documenter les **shops** (inventaires par NPC)
3. Intégrer les **téléporteurs** dans le graphe de navigation (voir MAP_COORDINATES_REFERENCE.md)
4. Étendre aux NPCs des **avant-postes** et zones de chasse (base 697)

---

*Dernière mise à jour : 2026-10-01*

*Sources : client officiel via xSROMap v1.4 (JellyBitz), SRO Info (2009), SRO Lobby, Silkroad Secrets, SRObro Project*
