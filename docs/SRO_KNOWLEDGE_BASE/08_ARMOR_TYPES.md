# Armor Types

> 🛡️ Types d'armures de Silkroad Online — chinois (Armor / Protector / Garment) et européens (Heavy Armor / Light Armor / Robe).
> Données vérifiées croisant le dump d'items `_RefItem` (client v1.188+, 14 318 items), les fiches brutes sro-world.de.tl / silkroadkopat.tr.gg (stats par pièce issues du client), les wikis Fandom/StrategyWiki et les guides communautaires (elitepvpers, silkroadforums).

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Système de Degrés et Niveaux](#-système-de-degrés-et-niveaux)
- [Armor / Heavy (Chinois)](#-armor-heavy-chinois)
- [Protector (Chinois)](#-protector-chinois)
- [Garment (Chinois)](#-garment-chinois)
- [Armures Européennes (Heavy / Light / Robe)](#️-armures-européennes-heavy--light--robe)
- [Bonus de Set et Vitesse : la Vérité](#-bonus-de-set-et-vitesse--la-vérité)
- [Mix d'Armures](#-mix-darmures)
- [Noms des Sets Chinois par Degré (1D-13D)](#-noms-des-sets-chinois-par-degré-1d-13d)
- [Noms des Sets Européens par Degré (1D-13D)](#-noms-des-sets-européens-par-degré-1d-13d)
- [Comparaison Complète](#-comparaison-complète)
- [Quand Choisir Quelle Armor](#-quand-choisir-quelle-armor)
- [Armor et Classes](#-armor-et-classes)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Vue d'Ensemble

Il existe **6 lignes d'armure** dans Silkroad Online, **3 par race**, chacune en **6 pièces** (tête, épaules, torse, jambes, mains, pieds), déclinées par **degré (1D-13D)** et par **genre (M/F)** :

| Race | Lourde | Intermédiaire | Légère |
|------|--------|---------------|--------|
| **Chinoise** | **Armor** (heavy) | **Protector** (light) | **Garment** (clothes) |
| **Européenne** | **Heavy Armor** | **Light Armor** | **Robe / Cloth** |

Correspondance des codenames `_RefItem` :
| Type | Codename (exemple torse M) | TypeID3 |
|------|---------------------------|---------|
| CH Armor | `ITEM_CH_M_HEAVY_XX_BA_A` | 3 |
| CH Protector | `ITEM_CH_M_LIGHT_XX_BA_A` | 2 |
| CH Garment | `ITEM_CH_M_CLOTHES_XX_BA_A` | 1 |
| EU Heavy | `ITEM_EU_M_HEAVY_XX_BA_A` | 11 |
| EU Light | `ITEM_EU_M_LIGHT_XX_BA_A` | 10 |
| EU Robe | `ITEM_EU_M_CLOTHES_XX_BA_A` | 9 |

**Différences CH vs EU :**
- Un personnage **chinois** peut porter n'importe laquelle des 3 lignes, à tout moment, sans contrainte d'arme.
- Un personnage **européen** est **limité par son arme équipée** (IGN Guidebook #42 : « limited by the weapons used ») — voir [le détail](#️-armures-européennes-heavy--light--robe).
- Un personnage chinois ne peut pas porter d'armure européenne et inversement (champ `Country` de `_RefItem` : 0 = chinois, 1 = européen).
- Les armures M/F ne sont pas interchangeables (champ `Sex` : 0 = femme, 1 = homme, 2 = universel — armes/boucliers toujours universels).

### Points Clés par ligne

| Ligne | DEF PHY | DEF MAG | Vitesse (vs Garment) | Consommation MP |
|-------|---------|---------|----------------------|-----------------|
| **Armor / Heavy** | ⭐⭐⭐⭐⭐ | ⭐ | La plus lente (-20%) | Normale (la plus coûteuse en relatif) |
| **Protector / Light** | ⭐⭐⭐ | ⭐⭐⭐ | Intermédiaire (-10%) | Intermédiaire (-10%) |
| **Garment / Robe** | ⭐ | ⭐⭐⭐⭐⭐ | La plus rapide (référence) | La plus faible (-20%) |

> ⚠️ Les écarts de vitesse/MP sont des **effets de set** (voir la [section dédiée](#-bonus-de-set-et-vitesse--la-vérité)) — pas des bonus « par pièce ».

---

## 📐 Système de Degrés et Niveaux

Chaque degré existe en **3 tiers (A/B/C)** par pièce : le tier A est le « bas degré », le C le « haut degré ». Les niveaux ci-dessous sont ceux des pièces (vérifiés sur le dump d'items) :

| Degré | Niveaux des pièces (tiers A/B/C) | Niveaux des armes (tiers A/B/C) | Set CH (exemples) |
|-------|----------------------------------|----------------------------------|--------------------|
| **1D** | 1 / 8 / 10 | 1 / 3 / 5 | Copper, Cloth, Cotton |
| **2D** | 13 / 15 / 18 | 8 / 10 / 13 | Bronze, Quilting, Linen |
| **3D** | 21 / 23 / 26 | 16 / 18 / 21 | Scale, Iron, Silk |
| **4D** | 29 / 31 / 34 | 24 / 26 / 29 | Pure White, Steel, Holyword |
| **5D** | 37 / 40 / 43 | 32 / 35 / 38 | Hard Scale, Blood, Sasan |
| **6D** | 42 / 50 / 53 | 42 / 45 / 48 | Python, Cheonchuk, Soharin |
| **7D** | 57 / 61 / 65 | 52 / 56 / 60 | Jewel, Tiger Bone, Taesarin |
| **8D** | 69 / 73 / 77 | 64 / 68 / 72 | Pegasus, Deva, Devildom |
| **9D** | 81 / 85 / 90 | 76 / 80 / 85 | Twin Horn, Girin Horn, Sky Storm |
| **10D** | 92 / 96 / 100 | 90 / 94 / 98 | Black Beast, Witacheon, Taesang |
| **11D** | 101 (1 seul tier) | 101 (1 seul tier) | Drako (War God / Underworld / Sky God) |
| **12D** | 113 / 116 / 120 | 111 / 114 / 118 | Reo (+ upgrades Draco/Phoenix/Wing) |
| **13D** | 121 (Seal uniquement) | 121 (Seal uniquement) | Tempest, Procela, Breeze |

**Ordre des niveaux de pièces au sein d'un degré** (du plus bas au plus haut) : mains → épaules → pieds → tête → jambes → torse. Le torse (BA) porte donc le niveau le plus haut et la meilleure défense ; les gants (AA) le plus bas.

**Notes :**
- Le 11D n'a qu'un seul tier (A). Le 12D a un tier A de base (« Reo ») et des tiers B/C obtenus par **upgrade via Tessera** (ex : Bluish/Golden Draco Suit). Le 13D n'existe qu'en versions **Seal [RARE]** (SOS/SOM/SOSun).
- Les accessoires suivent des niveaux légèrement décalés par type (anneaux 1D = lv 1/3/5, colliers 1D = lv 1+, boucles 1D = lv 1/10/18 pour le tier A) — voir [ITEMS_DATABASE.md](ITEMS_DATABASE.md).
- L'ancien tableau « 1D = lv 1-9, 2D = lv 10-19… » était **incorrect** : les degrés se chevauchent réellement (ex. un « Strong Cotton Suit » 1D se porte au lv 10, tandis que le « Small Linen Suit » 2D commence aussi au lv 13 via les autres pièces).

---

## 🛡️ Armor (Heavy, Chinois)

### Caractéristiques

- **Défense physique** : la plus haute des 3 lignes (~+25% de DEF PHY vs Garment à pièce et degré égaux).
- **Défense magique** : la plus basse (~-25% vs Garment).
- **Vitesse / MP** : aucun bonus de set ; c'est la ligne la plus lente et la plus gourmande (voir [Bonus de Set](#-bonus-de-set-et-vitesse--la-vérité)).
- **Durabilité** : la plus haute (ex. torse 1D : 48 vs 44 protector / 39 garment ; torse 8D : 84).
- **Renfort physique (phys reinforce)** : le plus élevé des 3 (signature des colonnes 82/83 d'itemdata — openroad).

### Stats réelles par pièce (échelle du client, source sro-world.de.tl)

**Torse 1D « Copper Armor » (tiers A/B/C)** :

| Pièce (tier) | Niveau | DEF mêlée | DEF magique | Durabilité |
|---|---|---|---|---|
| Copper Armor (A) | 1 | 2.5 | 3.2 | 48 |
| Wrought Copper Armor (B) | 8 | 5.3 | 6.9 | 51 |
| Refining Copper Armor (C) | 10 | 6.2 | 8.1 | 52 |

**Torse 8D « Hades Pegasus Armor » (tier A, lv 69)** : 124.7 DEF mêlée / 163.3 DEF magique, durabilité 84.

> 📌 Toutes les pièces SRO ont une DEF magique brute **supérieure** à leur DEF physique (la défense magique « vaut moins » par point dans la formule de dégâts). Ce qui distingue les lignes, ce sont les **ratios** : Armor ≈ 44% PHY, Protector ≈ 37%, Garment ≈ 32% (mesuré sur les torses 1D).

### Pour qui ?
- **Chinese STR Warriors** (Blade+Sword, Glaive) et tanks. Full STR, mêlée, frontline.

---

## 🎖️ Protector (Light, Chinois)

### Caractéristiques

- **Défenses équilibrées** : DEF PHY intermédiaire (+10% vs Garment), DEF MAG intermédiaire (-14% vs Garment).
- **Bonus de set** : le compromis (vitesse intermédiaire, -10% MP — voir section Bonus).
- **Durabilité** : intermédiaire (torse 1D : 44).

### Stats réelles par pièce

**Torse 1D « Cloth Lamellar »** :

| Pièce (tier) | Niveau | DEF mêlée | DEF magique | Durabilité |
|---|---|---|---|---|
| Cloth Lamellar (A) | 1 | 2.2 | 3.7 | 44 |
| Tough Cloth Lamellar (B) | 8 | 4.8 | 8.1 | 47 |
| Strong Cloth Lamellar (C) | 10 | 5.7 | 9.5 | 48 |

### Pour qui ?
- **Builds hybrides STR/INT** (ratios 6:4, 7:3…), solo players, polyvalence PvE/PvP.

---

## 👕 Garment (Clothes, Chinois)

### Caractéristiques

- **Défense magique** : la plus haute (~+34% vs Armor à pièce égale).
- **Défense physique** : la plus basse — vulnérable aux dealers physiques.
- **Bonus de set** : le meilleur en vitesse et économie de MP (référence des autres lignes).
- **Durabilité** : la plus basse (torse 1D : 39) — réparation plus fréquente.

### Stats réelles par pièce

**Torse 1D « Cotton Suit »** :

| Pièce (tier) | Niveau | DEF mêlée | DEF magique | Durabilité |
|---|---|---|---|---|
| Cotton Suit (A) | 1 | 2.0 | 4.3 | 39 |
| Tough Cotton Suit (B) | 8 | 4.3 | 9.2 | 42 |
| Strong Cotton Suit (C) | 10 | 5.1 | 10.9 | 43 |

### Pour qui ?
- **Chinese INT Nukers** (Sword/Spear), SP farmers (économie de potions MP), kiters.

---

## 🏰️ Armures Européennes (Heavy / Light / Robe)

### Les 3 lignes

| Ligne | Codename | Focus | Exemple torse 7D (lv 57) |
|-------|----------|-------|--------------------------|
| **Heavy Armor** | `ITEM_EU_M_HEAVY_*` | Défense physique maximale | Gold Cuirassir Armor |
| **Light Armor** | `ITEM_EU_M_LIGHT_*` | Équilibrée | Dizzy Cuirassir Mail : 57.9 PHY / 92.7 MAG |
| **Robe / Cloth** | `ITEM_EU_M_CLOTHES_*` | Défense magique maximale | Blessing Robe : 52.1 PHY / 101.9 MAG |

Les bonus de set EU (vitesse/MP) **mirorent** les lignes chinoises : Robe = comme Garment, Light = comme Protector, Heavy = comme Armor (source : elitepvpers « About Set & Status » — Robe « +20% walking speed, 20% reduced MP », Light « 10% walking speed, 10% reduced MP, ratio PHY:MAG 6:4 »).

### ⚠️ Restrictions par arme (spécificité EU)

Contrairement aux chinois, l'armure équipable **dépend de l'arme portée** :

| Armes | Armures autorisées |
|-------|--------------------|
| Épée 1M, Épée 2M, Double hache (Warrior) | **Heavy + Light + Robe** |
| Dagues, Arbalète (Rogue) | **Light + Robe** (pas de Heavy) |
| Bâton 2M (Wizard), Harpe (Bard), Dark Staff (Warlock), Clerical Rod (Cleric) | **Robe** |

Consensus des guides : la Heavy est de fait réservée aux **Warriors** ; la Light est portée par presque tous les builds physiques ; les casters restent en Robe. Les Rods/Dark Staffs 1M permettent le bouclier (avec le focus arme 1M).

### Noms des pièces EU
- **Heavy** : Casque/Cabasset, Pouldron (épaule), Breast Armor (torse), Tasset (jambes), Gauntlet/Glove (mains), Solleret/Botte (pieds).
- **Light** : Cabasset, Alette (épaule), Cuirassir Mail (torse), Cuirassir Tasset, Glove, Bottes.
- **Robe** : Cap/Diadem, Himation (épaule), Robe, Under Robe (jambes), Mitten, Chaussures.

---

## 🎁 Bonus de Set et Vitesse : la Vérité

> 🕵️ **Point sensible documenté** : les sources se contredisent sur la formulation **absolue** des bonus (bonus du Garment vs pénalité de l'Armor), mais s'accordent parfaitement sur les **écarts relatifs**. Ce qui suit croise toutes les sources.

### Ce qui est certain (toutes sources confondues)

| Set complet (même type toutes pièces) | Écart de vitesse | Écart de conso MP |
|---------------------------------------|------------------|-------------------|
| **Garment / Robe** | référence (la plus rapide) | **-20%** |
| **Protector / Light** | **-10% vs Garment** | **-10%** (i.e. +10% vs Garment) |
| **Armor / Heavy** | **-20% vs Garment** | 0 (i.e. +20% vs Garment) |

- **Mix de types = AUCUN bonus** (consensus absolu : guides Casque/elitepvpers, silkroadforums « Armor Types and Facts », Tapatalk, UnKnoWnCheaTs).
- Le guide de référence vSRO ([Casque, elitepvpers 2019](https://www.elitepvpers.com/forum/sro-guides-templates/4634305-guide-armor-protector-garment.html), testé en jeu) mesure : Armor = -20% vitesse et +20% MP **relativement à Garment**, Protector pile au milieu.
- Le wiki Fandom exprime le gain en unités de vitesse du jeu : Garment « +6m », Protector « +5.5m » — écarts faibles en absolu mais hiérarchie identique.

### Les deux lectures absolues

1. **Lecture « bonus »** (guides classiques, Fandom, IGN) : full Garment = **+20% vitesse / -20% MP**, full Protector = **+10% / -10%**, full Armor = **aucun bonus** (0%). C'est la formulation la plus répandue.
2. **Lecture « pénalité »** (StrategyWiki — page Items) : « *being equipped with any armor will decrease a character's running speed by 20 percent, protector will decrease the running speed by 10 percent* » — c'est-à-dire **Armor -20%, Protector -10%, Garment 0%** (référence = personnage sans armure).

**Recommandation SRObro :** modéliser les **écarts relatifs** (±20% / ±10% entre Garment et Armor) et choisir la base « Garment = 0 » (lecture StrategyWiki, cohérente avec le ressenti en jeu : un full Armor court visiblement moins vite qu'un full Garment). Les deux lectures donnent les mêmes écarts entre sets.

### Rapports annexes (à confirmer)
- Le guide Casque rapporte aussi un effet « HP usage » : l'Armor serait « 20% plus efficace » que le Garment sur la consommation HP (skills/consommables basés HP). Non confirmé par d'autres sources — à traiter comme une rumeur de testeur.

### Effet sur les coûts de skills (calcul)

```
Skill à 1000 MP :
  Full Garment  : 800 MP  (-20%)
  Full Protector: 900 MP  (-10%)
  Full Armor/Mix: 1000 MP (0%)
```
Pour le **SP farming** chinois (spam de skills), le full Garment reste la référence communautaire : ~20% de potions MP économisées + mobilité pour kiter.

---

## 🔄 Mix d'Armures

- **Chinois** : on PEUT équiper des pièces de lignes différentes (ex. torse Armor + 5 pièces Protector). Résultat : **aucun bonus de set**, mais les défenses de base s'additionnent normalement. Les hybrides utilisent parfois un mix pour cibler un ratio DEF PHY/MAG précis.
- **Européen** : on peut mixer **entre les lignes autorisées par l'arme** (ex. un warrior peut mixer Heavy + Light). Les guides vSRO indiquent que le bonus de set EU s'active à partir de **4 pièces du même type** (le panneau « Set Item Option » du client affiche la progression) — à confirmer sur émulateur, le système CH exigeant lui la totalité des pièces du même type.
- **Races** : aucun mix possible entre armure chinoise et européenne.

---

## 📜 Noms des Sets Chinois par Degré (1D-13D)

> Noms officiels issus du dump `_RefItem` (tiers A/B/C = 3 sous-niveaux du degré). Le nom du « set » dans la communauté = nom du torse (BA). Pièces : Casque (HA), Shoulder (SA), Armor (BA), Hose (LA), Bracer (AA), Footgear (FA).

### Armor (Heavy)

| Degré | Tier A | Tier B | Tier C | Niveau (A/B/C) |
|-------|--------|--------|--------|-----------------|
| 1D | Copper Armor | Wrought Copper Armor | Refining Copper Armor | 1/8/10 |
| 2D | Infantry Bronze Armor | Lancer Bronze Armor | Cavalry Bronze Armor | 13/15/18 |
| 3D | Oh Scale Armor | Chok Scale Armor | Wi Scale Armor | 21/23/26 |
| 4D | Holy Pure White Armor | Glory Pure White Armor | Divine Pure White Armor | 29/31/34 |
| 5D | Iron Hard Scale Armor | Silver Hard Scale Armor | Gold Hard Scale Armor | 37/40/43 |
| 6D | Forest Python Armor | Woodland Python Armor | Jungle Python Armor | 47/50/53 |
| 7D | Crystal Jewel Armor | Topaz Jewel Armor | Spinel Jewel Armor | 57/61/65 |
| 8D | Hades Pegasus Armor | Heaven Pegasus Armor | Elysium Pegasus Armor | 69/73/77 |
| 9D | White Twin Horn Armor | Blue Twin Horn Armor | Black Twin Horn Armor | 81/85/90 |
| 10D | Black Beast Armor | Black Tiger Armor | Black Ghost Armor | 92/96/100 |
| 11D | Drako War God Armor | — | — | 101 |
| 12D | Reo Armor | Angel Wing Armor | Valkyrie Wing Armor | 113/116/120 |
| 13D | Tempest Armor *(Seal)* | — | — | 121 |

### Protector (Light)

| Degré | Tier A | Tier B | Tier C | Niveau |
|-------|--------|--------|--------|--------|
| 1D | Cloth Lamellar | Tough Cloth Lamellar | Strong Cloth Lamellar | 1/8/10 |
| 2D | Small Quilting Lamellar | Half Quilting Lamellar | Perfect Quilting Lamellar | 13/15/18 |
| 3D | Oh Iron Lamellar | Chok Iron Lamellar | Wi Iron Lamellar | 21/23/26 |
| 4D | Wood Steel Lamellar | Stone Steel Lamellar | Metal Steel Lamellar | 29/31/34 |
| 5D | Python Blood Lamellar | Python Horn Lamellar | Python Bone Lamellar | 37/40/43 |
| 6D | East Cheonchuk Lamellar | West Cheonchuk Lamellar | North Cheonchuk Lamellar | 47/50/53 |
| 7D | Wild Tiger Bone Lamellar | Brute Tiger Bone Lamellar | Evil Tiger Bone Lamellar | 57/61/65 |
| 8D | Crescent Deva Lamellar | Lunar Deva Lamellar | Moon Deva Lamellar | 69/73/77 |
| 9D | White Girin Horn Lamellar | Blue Girin Horn Lamellar | Black Girin Horn Lamellar | 81/85/90 |
| 10D | Holy Witacheon Lamellar | Glory Witacheon Lamellar | Divine Witacheon Lamellar | 92/96/100 |
| 11D | Drako Underworld Lamellar | — | — | 101 |
| 12D | Reo Lamellar | Silla Phoenix Lamellar | Goryeo Phoenix Lamellar | 113/116/120 |
| 13D | Procela Lamellar *(Seal)* | — | — | 121 |

### Garment (Clothes)

| Degré | Tier A | Tier B | Tier C | Niveau |
|-------|--------|--------|--------|--------|
| 1D | Cotton Suit | Tough Cotton Suit | Strong Cotton Suit | 1/8/10 |
| 2D | Small Linen Suit | Half Linen Suit | Complete Linen Suit | 13/15/18 |
| 3D | Sungdo Silk Suit | Jangan Silk Suit | Loyang Silk Suit | 21/23/26 |
| 4D | Shelter Holyword Suit | Guard Holyword Suit | Protect Holyword Suit | 29/31/34 |
| 5D | Oh Sasan Silk Suit | Chok Sasan Silk Suit | Wi Sasan Silk Suit | 37/40/43 |
| 6D | Blood Soharin Suit | Venom Soharin Suit | Devil Soharin Suit | 47/50/53 |
| 7D | Vicious Taesarin Suit | Brute Taesarin Suit | Cruel Taesarin Suit | 57/61/65 |
| 8D | Black Devildom Suit | Blaze Devildom Suit | Dark Devildom Suit | 69/73/77 |
| 9D | Mad Sky Storm Suit | Delightful Sky Storm Suit | Violent Sky Storm Suit | 81/85/90 |
| 10D | Prince Taesang Suit | Lord Taesang Suit | King Taesang Suit | 92/96/100 |
| 11D | Drako Sky God Suit | — | — | 101 |
| 12D | Reo Suit | Bluish Draco Suit | Golden Draco Suit | 113/116/120 |
| 13D | Breeze Suit *(Seal)* | — | — | 121 |

> Variantes féminines : noms identiques, codenames `ITEM_CH_W_*`. Set spécial **Locke** (lv 98, « 10.5 degree ») : Locke Armor/Protector/Garment, hors série (ajout tardif).

---

## 📜 Noms des Sets Européens par Degré (1D-13D)

> Les 3 tiers de chaque degré portent des noms de **constellations** (identiques pour Heavy/Light/Robe d'un même degré). Exemple de lecture : 7D Heavy tier B = « Crater Gold Cuirassir Armor ».

| Degré | Tiers (A/B/C) | Niveau | Heavy | Light | Robe |
|-------|---------------|--------|-------|-------|------|
| 1D | Sagittarius / Canes / Sagitta | 1/8/10 | Lorica Armor | Savage Mail | Cotton Robe |
| 2D | Pisces / Cygnus / Lacerta | 13/15/18 | Bronze Chain Armor | Light Chain Mail | Fabric Robe |
| 3D | Gemini / Andromeda / Aquila | 21/23/26 | Steel Armor | Iron Mail | Magic Robe |
| 4D | Aries / Canis / Corvus | 29/31/34 | Silver Scale Armor | White Mail | Runic Robe |
| 5D | Aquarius / Triangulum / Monoceros | 37/40/43 | Heavy Steel Armor | Hard Steel Mail | Protect Robe |
| 6D | Cancer / Cassiopeia / Ursa | 47/50/53 | Red Arquebus Armor | Crimson Arquebus Mail | Scarlet Robe |
| 7D | Libra / Crater / Vulpecula | 57/61/65 | Gold Cuirassir Armor | Dizzy Cuirassir Mail | Blessing Robe |
| 8D | Virgo / Auriga / Bootes | 69/73/77 | Winter Cuirass Armor | Polar Cuirass Mail | Runa Robe |
| 9D | Scorpio / Hydra / Lynx | 81/85/90 | Thunder Breast Armor | Gale Breast Mail | Blaze Robe |
| 10D | Taurus / Cetus / Lepus | 92/96/100 | Ox Composite Armor | Valor Composite Mail | Divine Robe |
| 11D | Capricorn | 101 | Drako War God Armor | Drako War God Mail | Drako War God Robe |
| 12D | Leo / Ophiuchus / Lyra | 113/116/120 | Heaven Fluted Armor | Angel Fluted Mail | Devotion Robe |
| 13D | — *(Seal)* | 121 | Tempest Plate Armor | Procela Mail | Breeze Robe |

**Stats réelles EU 7D** (torse, tier A, lv 57 — source silkroadkopat.tr.gg) :
| Pièce | Ligne | DEF mêlée | DEF magique | Durabilité |
|---|---|---|---|---|
| Libra Dizzy Cuirassir Mail | Light | 57.9 | 92.7 | 60 |
| Crater Dizzy Cuirassir Mail (B, lv 61) | Light | 66.7 | 106.7 | 62 |
| Libra Blessing Robe | Robe | 52.1 | 101.9 | 50 |
| Vulpecula Blessing Robe (C, lv 65) | Robe | 68.8 | 134.6 | 53 |

---

## ⚖️ Comparaison Complète

### Tableau comparatif

| Stat | Armor / Heavy | Protector / Light | Garment / Robe |
|------|---------------|-------------------|-----------------|
| **DEF PHY** | ⭐⭐⭐⭐⭐ (~+25% vs Garment) | ⭐⭐⭐ (~+10%) | ⭐ (référence) |
| **DEF MAG** | ⭐ (~-25%) | ⭐⭐⭐ (~-14%) | ⭐⭐⭐⭐⭐ (~+34% vs Armor) |
| **Vitesse** | ⭐⭐ (-20% vs Garment) | ⭐⭐⭐ (-10%) | ⭐⭐⭐⭐⭐ (référence) |
| **Conso MP** | ⭐⭐⭐ (0%) | ⭐⭐⭐⭐ (-10%) | ⭐⭐⭐⭐⭐ (-20%) |
| **Durabilité** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐ |
| **Survivabilité mêlée** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐ |
| **Survivabilité magique** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **SP Farming** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Kiting** | ⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### Scénarios

| Scénario | Meilleur choix | Pourquoi |
|----------|----------------|----------|
| PvE grinding (mobs PHY) | Armor > Protector > Garment | Encaisse les dégâts PHY, moins de potions HP |
| PvP vs Nuker INT | Garment > Protector > Armor | Résiste aux nukes |
| PvP vs Warrior STR | Armor > Protector > Garment | Tank les dégâts PHY |
| SP farming | **Garment** | -20% MP + mobilité |
| Fortress War frontline | Armor/Heavy | Survie en AOE |
| Fortress War backline | Garment/Robe | Nuker protégé vs magie |

---

## 🎯 Quand Choisir Quelle Armor?

### Choisissez ARMOR / HEAVY si :
- Build full STR, mêlée, tank (Warrior EU, STR chinois)
- Vous affrontez surtout des dealers physiques
- Vous jouez frontline (Fortress War, uniques tankés)

### Choisissez PROTECTOR / LIGHT si :
- Build hybride STR/INT
- Vous jouez solo / polyvalent
- Rogue EU (Light = son meilleur compromis, Heavy interdite)

### Choisissez GARMENT / ROBE si :
- Build full INT, nuker (Wizard, Warlock, Cleric, Bard, nukers chinois)
- SP farming (économie MP)
- Vous kitez beaucoup

---

## 👥 Armor et Classes

| Classe | Recommandation | Notes |
|--------|----------------|-------|
| CH STR (Blade/Sword, Glaive) | Armor ou Protector | Le bouclier se combine avec les armes 1M |
| CH INT (Sword/Spear nuker) | **Garment** | MAG DEF + MP + vitesse |
| CH Hybride | Protector (ou mix) | Ratio DEF équilibré |
| EU Warrior | Heavy (1M+shield) ou Light | Heavy réservée aux armes warrior |
| EU Rogue | **Light** (ou Robe pour xbow INT) | Heavy impossible avec dagues/xbow |
| EU Wizard | **Robe** | Bâton 2M = robe seulement |
| EU Warlock | Robe (+ shield avec dark staff 1M) | |
| EU Bard | Robe | Harpe = robe seulement |
| EU Cleric | Robe (+ shield avec cleric rod 1M) | |

---

## ❓ FAQ

### Q: Puis-je changer de type d'armure plus tard ?
**R:** Oui, à tout moment (achetez/équipez un autre set). Côté chinois il n'y a aucune restriction ; côté EU l'armure doit rester compatible avec l'arme équipée.

### Q: Le type d'armure affecte-t-il mes skills ?
**R:** Non, mais il affecte la **consommation MP** des skills (Garment -20%, Protector -10%) et la vitesse de déplacement via le set.

### Q: Puis-je mixer les types (ex. torse Armor + bottes Garment) ?
**R:** Oui pour un chinois (et entre lignes autorisées pour un EU), mais vous **perdez tout bonus de set**. Les défenses de base s'appliquent toujours.

### Q: « Garment = +20% vitesse » ou « Armor = -20% » : qui a raison ?
**R:** Les deux décrivent le même écart relatif (20% entre Garment et Armor). Les guides classiques formulent en bonus depuis Armor, StrategyWiki en pénalité depuis « sans armure ». Voir [Bonus de Set](#-bonus-de-set-et-vitesse--la-vérité).

### Q: Combien de pièces pour le bonus de set ?
**R:** Chinois : la totalité des pièces du même type (6/6). EU : les guides indiquent un seuil de 4 pièces du même type (bonus progressif affiché dans le panneau Set Item Option) — à confirmer sur émulateur.

### Q: Le bonus de vitesse s'applique-t-il sur une monture ?
**R:** Non, les modificateurs de vitesse d'armure ne s'appliquent pas monté (les vitesses de monture sont des valeurs séparées).

### Q: Pourquoi les DEF magiques brutes sont-elles plus hautes que les physiques sur toutes les pièces ?
**R:** Structure du jeu : la défense magique est moins efficace par point dans la formule de dégâts. La différence entre lignes se joue sur le **ratio** PHY/MAG (Armor ≈ 44/56, Protector ≈ 37/63, Garment ≈ 32/68 mesuré en 1D).

---

## 🔗 Resources

### Wikis
- [Silkroad Online Wiki (Fandom) — Armor (Equipment)](https://silkroadonline.fandom.com/wiki/Armor_(Equipment))
- [Fandom — Garment](https://silkroadonline.fandom.com/wiki/Garment) • [Fandom — Protector](https://silkroadonline.fandom.com/wiki/Protector) • [Fandom — Weapons](https://silkroadonline.fandom.com/wiki/Weapons) (crit rates de base, boucliers)
- [StrategyWiki — Silkroad Online/Items](https://strategywiki.org/wiki/Silkroad_Online/Items) (lecture « pénalités » de vitesse)
- [IGN — Silkroad Online Guidebook #42](https://www.ign.com/articles/2008/11/12/silkroad-online-guidebook-42) (armures EU « limited by weapons »)

### Guides et données communautaires
- [Elitepvpers — Armor, Protector or Garment? (Casque, 2019)](https://www.elitepvpers.com/forum/sro-guides-templates/4634305-guide-armor-protector-garment.html) — mesures relatives vitesse/MP
- [Elitepvpers — About Set & Status](https://www.elitepvpers.com/forum/sro-private-server/4171588-question-about-set-status.html) — bonus robe/light EU, ratio 6:4
- [sro-world.de.tl — Armor Chinese](https://sro-world.de.tl/Armor_Chinese.htm) (+ Garment/Protector/Shield/Accessory) — stats brutes par pièce 1D-8D
- [silkroadkopat.tr.gg — Light Armor / Robe EU](https://silkroadkopat.tr.gg/silkroad-light-armor.htm) — stats EU 7D-8D
- [guildalgarb — Chinese Armor/Garment/Protector](https://guildalgarb.wordpress.com/games/sro/clothes/chinese-armor) — noms des sets par degré
- [Elitepvpers — Why CH choose Garment / EU Light Armor](https://www.elitepvpers.com/forum/sro-private-server/4597410-why-ch-player-choose-garment-why-eu-players-choose-light-armor.html) — restrictions EU
- [openroad — docs formats itemdata](https://github.com/ferdoran/openroad/blob/main/docs/formats/textdata-itemdata.md) — colonnes itemdata (défenses, block rate, SetID)

### Données de référence (SRObro)
- Dump d'items `_RefItem` (14 318 items, CH+EU, 1D-13D) : voir [ITEMS_DATABASE.md](ITEMS_DATABASE.md#-données-refitem-ids--codenames)

---

## 📚 Voir aussi

### Systèmes d'Équipement
- [Seal Equipment](06_SEAL_EQUIPMENT.md) - SOS, SOM, SOSun
- [Item Degrees](07_ITEM_DEGREES.md) - Système 1D-13D
- [Alchimie](05_ALCHEMY_SYSTEM.md) - Enhancement +1 à +12

### Guides de Builds
- [PvE Builds](34_PVE_BUILDS.md) - Recommandations armor par build
- [Hub Classes](HUB_CLASSES.md) - Classes et leurs armor preferences

### Économie
- [Hub Économie](HUB_ECONOMIE.md) - Centralise économie et équipement
- [Economie et Or](22_ECONOMY_GOLD.md) - Coût et valeur des armures

### Bases de Données
- [Index des Items](31_ITEMS_DATABASE.md) - Hub central items
- [Items Database](ITEMS_DATABASE.md) - Base complète items (armes, boucliers, accessoires, blues)

---

*Dernière mise à jour: 2026-10-01*
*Sources: dump _RefItem client v1.188+ (14 318 items), sro-world.de.tl, silkroadkopat.tr.gg, guildalgarb, Fandom/StrategyWiki, elitepvpers (Casque), IGN Guidebook, openroad docs*
