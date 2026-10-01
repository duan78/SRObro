# Consumables

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Mécanique de soin (formule officielle)](#-mécanique-de-soin-formule-officielle)
- [Potions HP](#-potions-hp)
- [Potions MP](#-potions-mp)
- [Vigor Potions (HP + MP)](#-vigor-potions-hp--mp)
- [Grains et Herbs](#-grains-et-herbs)
- [Pills : Universal et Purification](#-pills--universal-et-purification)
- [Potions Item Mall](#-potions-item-mall)
- [Scrolls](#-scrolls)
- [Drugs de vitesse (Alchimie)](#-drugs-de-vitesse-alchimie)
- [Consommables de Pets](#-consommables-de-pets)
- [Divers (munitions, tickets)](#-divers-munitions-tickets)
- [Usage Stratégique](#-usage-stratégique)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Vue d'Ensemble

Les **consommables** restaurent les jauges, soignent les états négatifs, téléportent ou buffent temporairement. Ils sont achetés auprès des **Grocery Stores / Grocery Owner** de chaque ville (potions, pills, powders, rondos), droppés, ou obtenus via l'**Item Mall** (silk).

### Points Clés
- ✅ **Potions HP/MP :** soin en **pulses d'1 seconde** (pas instantané), valeur qui **augmente avec le niveau/les stats**
- ✅ **Vigor Potions :** soignent HP **et** MP en même temps
- ✅ **Universal Pills :** retirent un état négatif ; **Purification Pills :** version puissante
- ✅ **Return Scrolls :** téléportation en ville (et variantes)
- ✅ **Drugs de vitesse :** fabriquées en alchimie (tablettes saphir)
- ✅ **Auto-Potion :** le jeu permet de régler un seuil de % HP/MP pour l'usage automatique

### Noms exacts (client / données vSRO)
HP: `ITEM_ETC_HP_POTION_01..06` · MP: `ITEM_ETC_MP_POTION_01..06` · Vigor: `ITEM_ETC_ALL_POTION_01..05` + `ALL_SPOTION_01` · Universal Pill: `ITEM_ETC_CURE_ALL_01..05` · Purification Pill: `ITEM_ETC_CURE_RANDOM_01..04`

---

## 🧮 Mécanique de soin (formule officielle)

La logique décompilée du serveur (`CGItemExpendable_CalculateRecoveryAmount`) distingue deux modes selon les paramètres de l'item :

1. **Valeur absolue** (Param HP/MP non nul) :
```
soin = (STR/416 + 1) × 1.02^(niveau_perso − 1) × param_item   (arrondi tronqué)
```
→ une même potion soigne **davantage sur un perso haut niveau / avec des stats élevés** (HP scale sur STR, MP sur INT).

2. **Pourcentage** (Param % non nul) : `soin = max_HP × %`.

Le montant total est appliqué en **pulses d'1 seconde** (file de régénération) — les potions ne sont pas instantanées. Les reductions de régénération (débuffs) s'appliquent pulse par pulse ; l'état **Zombie** inverse l'effet des items de soin.

**Cooldowns :** les items partagent des groupes de cooldown (« countdown link ») : potons rapides d'une part, grains/vigors d'autre part (d'après la doc officielle mobile : potions ~1 s, grains ~15 s — valeurs PC non publiées).

---

## 🧪 Potions HP

| Item (nom client) | Codename | Où l'obtenir |
|-------------------|----------|--------------|
| **HP recovery herb** | `ITEM_ETC_HP_POTION_01` | Drop monstres, quêtes |
| **HP recovery potion (small)** | `ITEM_ETC_HP_POTION_02` | Grocery (toutes villes) |
| **HP recovery potion (medium)** | `ITEM_ETC_HP_POTION_03` | Grocery (Donwhang+) |
| **HP recovery potion (large)** | `ITEM_ETC_HP_POTION_04` | Grocery (Hotan+) |
| **HP recovery potion (X-large)** | `ITEM_ETC_HP_POTION_05` | Item mall / events |
| **HP recovery potion (XXL)** | `ITEM_ETC_HP_POTION_06` | Item mall / events |

- Valeur de soin : selon la formule ci-dessus (param de base × croissance de niveau) — les valeurs exactes par palier sont dans `itemdata` (non publié).
- Prix NPC : quelques dizaines à centaines de gold (très bon marché).

## 🔵 Potions MP

Mêmes paliers que HP (herb / small / medium / large / XL / XXL, `ITEM_ETC_MP_POTION_01..06`). Les builds INT en consomment massivement (nukers, SP farming).

---

## 💜 Vigor Potions (HP + MP)

| Item | Codename | Notes |
|------|----------|-------|
| **Vigor recovery herb** | `ITEM_ETC_ALL_POTION_01` | Drop |
| **Vigor recovery potion (small)** | `ITEM_ETC_ALL_POTION_02` | Grocery |
| **Vigor recovery potion (medium)** | `ITEM_ETC_ALL_POTION_03` | Grocery |
| **Vigor recovery potion (large)** | `ITEM_ETC_ALL_POTION_04` | Grocery |
| **Vigor recovery potion (X-large)** | `ITEM_ETC_ALL_POTION_05` | Grocery tardif / mall |
| **Vigor recovery grain (small)** | `ITEM_ETC_ALL_SPOTION_01` | Version « grain » |

- Restaurent **HP et MP simultanément** — le consommable de référence en PvP.
- Valeurs d'émulateur (DarkEmu, à titre indicatif) : 120 / 220 / 370 / 570 / 820 HP+MP de l'herb au X-large.
- En usage auto, régler le seuil Vigor vers 45–60% et HP vers 75% (conseil communautaire anti-delay).

---

## 🌾 Grains et Herbs

- **Herbs (HP/MP/Vigor herb) :** versions « droppables » de bas palier, données par beaucoup de quêtes débutantes (ex. 28–50 potions en récompense).
- **Grains (`*_SPOTION_01`, « recovery grain ») :** versions à **pourcentage** (≈ 25% HP ou MP selon les émulateurs) avec un **cooldown plus long** (~15 s) que les potions — gros soin ponctuel.
- Les herbs/matériaux droppés servent aussi de **matières premières d'alchimie** (Void Rondo → éléments).

---

## 💊 Pills : Universal et Purification

### Universal Pills (`ITEM_ETC_CURE_ALL_01..05`)
- **Universal Pill (small / medium / large)** et **Special Universal Pill (small / medium)**.
- **Retire un état négatif** (poison, burn, frostbite, electric shock, zombie…) — pas de soin HP/MP.
- Se place dans la barre d'auto-pill : indispensable en PvP/contre les uniques.

### Purification Pills (`ITEM_ETC_CURE_RANDOM_01..04`)
- **Purification Pill (small / medium / large / X-large)**.
- Version plus puissante (nettoyage élargi des états négatifs), **cooldown plus long** (références communautaires : ~20–30 s ; l'item de référence des threads cooldown est `ITEM_ETC_CURE_RANDOM_04`).
- « Special Universal Pill » et Purification se complètent : les premières en spam, la seconde en secours.

> Les valeurs de cooldown exactes par palier vivent dans la DB/itemdata et ne sont pas publiées ; les chiffres ci-dessus sont les consensus communautaires.

---

## 🛒 Potions Item Mall

Série « instantanée » à valeur fixe (noms client explicites) :

| Item | Codename |
|------|----------|
| **HP+430 potion** / **MP+430 potion** | `ITEM_MALL_HP_INC_430_POTION` / `ITEM_MALL_MP_INC_430_POTION` |
| **HP+800 / MP+800** | `ITEM_MALL_HP_INC_800_POTION` … |
| **HP+1300 / MP+1300** | `ITEM_MALL_HP_INC_1300_POTION` … |
| **HP+1900 / MP+1900** | `ITEM_MALL_HP_INC_1900_POTION` … |
| **HP+2800 / MP+2800** | `ITEM_MALL_HP_INC_2800_POTION` … |
| **HP+4100 / MP+4100** | `ITEM_MALL_HP_INC_4100_POTION` … |

- Paliers adaptés à la tranche de niveau du personnage (430 → 4100).
- Le mall vend aussi des **bags** (« HP/MP Recovery potion (small…X-large) bag ») et l'**Auto Potion Ticket**.

---

## 📜 Scrolls

### Return Scrolls (téléportation)
| Scroll | Codename | Effet |
|--------|----------|-------|
| **Return Scroll** | `ITEM_ETC_SCROLL_RETURN_01` | Téléporte à la ville la plus proche (~30 gold au NPC) |
| **Bandit Den Return Scroll** | `ITEM_ETC_SCROLL_RETURN_THIEFDEN_01` | Retour au repaire des thieves |
| **Special Return Scroll** | `ITEM_ETC_SCROLL_RETURN_02` | Version améliorée |
| **Instant Return Scroll** | `ITEM_ETC_SCROLL_RETURN_03` / `ITEM_MALL_RETURN_SCROLL_HIGH_SPEED` | Cast instantané (mall) |
| **Reverse Return Scroll** | `ITEM_MALL_REVERSE_RETURN_SCROLL` | Retour au point de départ précédent |
| **Friend Return Scroll** | `ITEM_MALL_FRIEND_RETURN_SCROLL` | Rejoindre un ami |
| Party Recall/Summon Scrolls | `ITEM_ETC_E060526_SUMMON_PARTY_SCROLL_A`… | Invocation de groupe |

### Scrolls de combat (item mall / events)
| Scroll | Effet |
|--------|-------|
| **20% damage increase scroll** | +20% dégâts (durée limitée) |
| **20% damage absorption scroll** | −20% dégâts subis |
| **60% / 100% resurrection scroll** | Résurrection avec 60/100% d'XP conservés |
| **Skill edit potion** | Réinitialise les skills |

### Scrolls d'event (historiques, famille `E051123…`)
**Dodging Scroll** (esquive), **Hit Scroll** (précision), **Moving Speed Scroll** (vitesse), **Trigger Scroll**, **500 HP increase Scroll**, **500 MP increase Scroll**.

> ⚠️ Il n'existe pas de « berserker scroll » dans les données PC classiques — ce nom vient d'autres jeux/PS.

---

## 🌪️ Drugs de vitesse (Alchimie)

Fabriquées via les **tablettes Saphir** + éléments (voir [05_ALCHEMY_SYSTEM.md](05_ALCHEMY_SYSTEM.md)) :

| Drug | Tablette (degré) | Notes |
|------|------------------|-------|
| **Drug of breeze** | Sapphire tablet of breeze (2nd) | Palier bas |
| **Drug of wind** | Sapphire tablet of wind (5th) | La plus utilisée au leveling (ex. guide « fastest leveller » : drug of wind jusqu'au lvl 52) ; parfois vendue en ville |
| **Drug of gales** | Sapphire tablet of gales (8th) | Palier haut |
| **Drug of typhoon** | Sapphire tablet of typoon (11th) | La plus puissante ; très recherchée (ex. ~500k gold/heure sur certaines époques) ; vendue aussi par certains NPC |

- Effet : augmentation temporaire de la **vitesse de déplacement** (valeurs % et durées exactes non publiées ; les PS affichent souvent « Drug of Typhoon 100% »).
- Se stack avec les buffs de vitesse (lightning walk, bard…).

---

## 🐺 Consommables de Pets

| Item | Codename | Usage |
|------|----------|-------|
| **HGP recovery potion** | `ITEM_COS_P_HGP_POTION_01` | Nourrit le pet (faim/HGP) |
| **Recovery kit (small/large)** | `ITEM_ETC_COS_HP_POTION_01..03` | Soigne le pet d'attaque |
| **Abnormal state recovery potion (small/medium)** | `ITEM_COS_P_CURE_ALL_01/02` | Soigne les états négatifs du pet |
| **Grass of life** | `ITEM_COS_P_REVIVAL` | Ressuscite un pet mort |
| **Clock of reincarnation** | `ITEM_COS_P_EXTENSION` | Prolonge la durée de vie du pet |
| **Grey wolf summon scroll** | `ITEM_COS_P_FLUTE` | Invoque le loup d'attaque |

---

## 🎒 Divers (munitions, tickets)

- **Arrow / Bolt** (`ITEM_ETC_AMMO_ARROW_01`, `ITEM_ETC_AMMO_BOLT_01`) : munitions d'arc/arbalète, vendues en piles.
- **Auto Potion Ticket** (`ITEM_MALL_AUTO_POTION_TICKET`) : active le système d'auto-potion.
- **Monster summon scroll** (events) : invoque des monstres d'event.
- **Mercenary scrolls** (guild) : soldats de forteresse (Bicheon/Heuksal/…).
- **Quête SP** : `Resuscitation potion`, `Purification seed`, etc. (items de quête à ne pas consommer).

> ℹ️ Les « transform pills » ne figurent pas dans les données PC classiques (elles existent sur les versions mobiles/tardives).

---

## 🎯 Usage Stratégique

### Pour Grinding
- 100–500 HP potions + 200–1000 MP potions (builds INT)
- 10–20 Return Scrolls
- Universal Pills + Purification (selon zones à débuffs)
- Drug of wind pour les déplacements

### Pour PvP
- Vigor potions en priorité (HP+MP) — réglage auto ~45–60%
- HP potions en auto à ~75%
- Special Universal Pills / Purification pour purger
- Scrolls +20% dégâts / +20% absorption si disponibles

### Pour SP Farming
- Masses de MP potions, garment (économie de MP)
- Vigor pour limiter les allers-retours

---

## ❓ FAQ

### Q: Les potions ont-elles un cooldown ?
**R:** Oui, par groupes partagés (« countdown link ») : potions rapides vs grains/fortes. Sur le client classique, le soin s'applique en pulses d'1 s — d'où l'intérêt de boire AVANT d'être bas (delay de soin).

### Q: Pourquoi une potion soigne-t-elle plus à haut niveau ?
**R:** Formule officielle : `(STR/416+1) × 1.02^(niveau−1) × param` — le soin scale avec le niveau et STR (HP) / INT (MP).

### Q: Universal Pill ou Purification Pill ?
**R:** Universal (small/large) en usage courant/automatique ; Purification pour les gros nettoyages (cooldown plus long).

### Q: Que fait l'état Zombie ?
**R:** Il inverse/annule les soins d'items (le serveur réévalue chaque pulse) — purgez-le avant de pot.

### Q: Les buff scrolls stackent-ils avec les buffs de classe ?
**R:** Oui en général (scroll + buff de classe). Les +20% damage/absorption du mall sont des consommables de combat majeurs en PvP.

### Q: Où acheter les potions ?
**R:** Grocery Store / Grocery Owner de chaque ville (Jangan, Donwhang, Hotan, Constantinople, Samarkand, Alexandria) ; paliers supérieurs débloqués dans les villes tardives ; série instantanée à l'item mall.

---

## 🔗 Resources

### Données et mécanique
- [opensro — potionrecovery.go / potionamount.go (formule officielle décompilée)](https://github.com/opensro-dev/opensro/tree/main/apps/server/internal/game/action)
- [ItemData vSRO — codenames et noms clients](https://github.com/aloneanqel1453/ClientLibGUII/blob/master/source/libs/ClientLib/src/ItemDataGenerated.h)
- [dewsro-control — ConsumableCodenames (familles complètes)](https://github.com/Dewwta/dewsro-control/blob/main/VSRO_CONTROL_API/VSRO/Tools/ConsumableCodenames.cs)
- [DarkEmu — Potions.cs (valeurs vigor d'émulateur)](https://github.com/CarlosX/DarkEmu/blob/master/src/Game/_Todo/Public/Potions.cs)
- [Elitepvpers — Potion Delay](https://www.elitepvpers.com/forum/silkroad-online/251592-potion-delay.html)
- [Elitepvpers — Pills Cooldown Time](https://www.elitepvpers.com/forum/sro-pserver-questions-answers/4965998-pills-cooldown-time-about.html)
- [Elitepvpers — About the Purification Pill Cooldown](https://www.elitepvpers.com/forum/sro-private-server/3923645-about-purification-pill-cooldown.html)

### Guides
- [Silkroad Online FAQ (Neoseeker)](https://www.neoseeker.com/silkroad-online/faqs/139049-walkthrough.html)
- [GameFAQs — Guide Sintaku](https://gamefaqs.gamespot.com/pc/930711-silkroad-online/faqs/44908)
- [Elitepvpers — Guide From A to Z](https://www.elitepvpers.com/forum/sro-guides-templates/117616-silkroad-online-guide-z.html)
- [Elitepvpers — How to be the fastest leveller (drug of wind)](https://www.elitepvpers.com/forum/sro-guides-templates/116389-guide-how-fastest-leveller.html)
- [Tablets et drugs de vitesse (TR)](https://forum.donanimhaber.com/tabletler-ve-islevleri--13403834)

---

## 📚 Voir aussi

- [Alchimie](05_ALCHEMY_SYSTEM.md) - Lucky Powders, rondos, drugs de vitesse
- [Item Degrees](07_ITEM_DEGREES.md) - Degrés et sets
- [Economie et Or](22_ECONOMY_GOLD.md) - Coûts des consommables
- [Stall Network](23_STALL_NETWORK.md) - Achat/vente de consommables

---

*Dernière mise à jour: 2026-10-01*
*Sources: opensro (formule décompilée), ItemData vSRO (codenames), dewsro-control, DarkEmu, elitepvpers, Neoseeker/GameFAQs, DonanımHaber*
