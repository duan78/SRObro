# Items Database - Complete

> 📦 Base de données des items de Silkroad Online reconstruite à partir d'un **dump `_RefItem` de client v1.188+ (14 318 items, CH + EU, 1D-13D)**, des stats brutes par pièce (sro-world.de.tl, silkroadkopat.tr.gg), du wiki Fandom et des docs techniques (openroad / SilkroadDoc).
> Toutes les tables ci-dessous donnent : degré, niveaux des 3 tiers (A/B/C), noms officiels des tiers, et **ID `_RefItem` du tier A**.
> 🇰🇷 Le service coréen (jamais fermé, degrés jusqu'au 17차) n'est pas dans ce dump : ses noms officiels 11-13차 sont dans la section [🇰🇷 Noms officiels coréens 11-13차](#-noms-officiels-coréens-11-13차-service-ksro) ; les 14-17차 exigent une extraction client.

## 📋 Table des Matières
- [Structure _RefItem (TypeID, pays, IDs)](#-structure-refitem)
- [Armes Chinoises](#-armes-chinoises)
- [Caractéristiques de Combat des Armes](#-caractéristiques-de-combat-des-armes)
- [Noms Originels des Armes et Accessoires (ZH/KR)](#-noms-originels-des-armes-et-accessoires-zhkr)
- [🇰🇷 Noms officiels coréens 11-13차 (service KSRO)](#-noms-officiels-coréens-11-13차-service-ksro)
- [Armes Européennes](#-armes-européennes)
- [Boucliers](#-boucliers)
- [Accessoires (Anneaux / Colliers / Boucles)](#-accessoires)
- [Blues / Magic Options](#-blues--magic-options)
- [Matériaux d'Alchimie](#-matériaux-dalchimie)
- [Consommables](#-consommables)
- [Avatars et Devil Spirits](#-avatars-et-devil-spirits)
- [Prix et Économie](#-prix-et-économie)
- [Resources](#-resources)

---

## 🧬 Structure _RefItem

### Champs clés (itemdata.txt / `_RefObjCommon` + `_RefObjItem`)

| Champ | Col. | Valeurs / notes |
|-------|------|------------------|
| `ID` | 1 | ref_id — l'identifiant serveur (ex. Copper Sword = 71) |
| `CodeName` | 2 | `ITEM_CH_SWORD_01_A` ; suffixe `_RARE` = version Seal |
| `TypeID1-4` | 9-12 | `3/1/tid3/tid4` = équipement ; `3/3/*` = consommable |
| `Country` | 14 | 0 = chinois, 1 = européen |
| `Price` | 26 | prix d'achat NPC |
| `SellPrice` | 31 | prix de vente NPC (~35-50% du prix d'achat) |
| `ReqLevel1` | 33 | niveau requis |
| `Sex` | 58 | 0 = femme, 1 = homme, 2 = universel (armes/boucliers) |
| `ItemClass` | 61 | degré = `ceil(class/3)` (class 1-36) |
| `SetID` | 62 | 0 = pas de set ; 1-42 → `refsetitemgroup` (échelle des bonus de set) |
| `Range` | 94 | portée en unités monde (÷10 = « m » du tooltip) |

### TypeID3/TID4 (équipement)

| TypeID3 | Catégorie | TypeID4 |
|---------|-----------|---------|
| 1 | CH Garment (clothes) | pièce : 1 tête, 2 épaule, 3 torse, 4 jambes, 5 mains, 6 pieds |
| 2 | CH Protector (light) | idem |
| 3 | CH Armor (heavy) | idem |
| 4 | Bouclier CH | — |
| 5 | Accessoire CH | 1 boucle, 2 collier, 3 anneau |
| 6 | Arme CH | 2 sword, 3 blade, 4 spear, 5 glaive(tblade), 6 bow |
| 9 | EU Robe (clothes) | pièces idem |
| 10 | EU Light Armor | idem |
| 11 | EU Heavy Armor | idem |
| 12 | Accessoire EU | idem |
| 13 | Avatar | 1 chapeau, 2 habit, 3 attach/accessoire |
| 14 | Devil Spirit | — |

### Codenames — conventions
- Armes CH : `ITEM_CH_{SWORD|BLADE|SPEAR|TBLADE|BOW}_{degré}_{A|B|C}`
- Armes EU : `ITEM_EU_{SWORD|TSWORD|AXE|DAGGER|CROSSBOW|STAFF|DARKSTAFF|TSTAFF|HARP}_{degré}_{A|B|C}`
- Armures : `ITEM_{CH|EU}_{M|W}_{HEAVY|LIGHT|CLOTHES}_{degré}_{HA|SA|BA|LA|AA|FA}_{A|B|C}`
- Accessoires : `ITEM_{CH|EU}_{RING|NECKLACE|EARRING}_{degré}_{A|B|C}`
- Versions : `_DEF` (équipement de départ), `_BASIC` (basique), `_RARE` (Seal : SOS/SOM/SOSun — le niveau de Seal est un paramètre serveur, pas un codename), `_MALL` (item mall).
- **Comptage du dump** : 14 318 items, dont ~8 460 équipements, **5 232 versions Seal [RARE]**, 587 avatars, 26 devil spirits.

### Statistiques « blanches » (colonnes itemdata, source openroad)

Chaque stat est un couple (min, max) ; la valeur réelle d'une instance = `min + (max-min) × bits/31` (le `bits/31` du champ variance est le « pourcentage » affiché en tooltip).

| Stat | Colonnes arme | Colonnes armure/bouclier |
|------|---------------|---------------------------|
| Durabilité | 63/64 | 63/64 |
| Défense physique | — | 65/66 |
| Block rate (bouclier) | — | 74/75 |
| Attaque physique (min…max) | 95/96 … 97/98 | — |
| Attaque magique (min…max) | 100/101 … 102/103 | — |
| Attack rate (précision) | 113/114 | — |
| Critical | 116/117 | — |
| Renfort physique (÷10 = %) | 105/106 … 107/108 | 82/83 |
| Renfort magique (÷10 = %) | 109/110 … 111/112 | 84/85 |

---

## ⚔️ Armes Chinoises

> Toutes les armes chinoises possèdent **à la fois** une attaque physique et une attaque magique (le build STR ou INT détermine laquelle est exploitée). Portées : épées/lames 6 unités, spear/glaive 18, arc 180 (= 18 m affichées). Munitions : l'arc consomme des flèches.

#### Sword (1M, Bicheon)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Copper Sword | Short Copper Sword | Long Copper Sword | 71 |
| **2D** | 8/10/13 | Infantry Bronze Sword | Lancer Bronze Sword | Cavalry Bronze Sword | 74 |
| **3D** | 16/18/21 | Bloody Sharp Sword | Deadly Sharp Sword | Spiritual Sharp Sword | 77 |
| **4D** | 24/26/29 | Snake Frost Sword | Inexorable Frost Sword | Cruel Frost Sword | 80 |
| **5D** | 32/35/38 | Iron Lord's Sword | Silver Lord's Sword | Gold Lord's Sword | 83 |
| **6D** | 42/45/48 | Jade Gem Sword | Pearl Gem Sword | Onix Gem Sword | 86 |
| **7D** | 52/56/60 | Robust Guard Sword | Impregnable Guard Sword | Godly Guard Sword | 89 |
| **8D** | 64/68/72 | Flaming Devil Sword | Burning Devil Sword | Hellfire Devil Sword | 92 |
| **9D** | 76/80/85 | Genuine Master Sword | Authentic Master Sword | True Master Sword | 95 |
| **10D** | 90/94/98 | Oblivion Break Heaven Sword | Ancient Break Heaven Sword | Legendary Break Heaven Sword | 98 |
| **11D** | 101 | Reaper Ghost Sword | — | — | 101 |
| **12D** | 111/114/118 | Imperial Divine Sword | Hunwon's Divine Sword | Chwiu's Divine Sword | 104 |
| **13D** *(Seal)* | 121 | Blue Dragon Sword | — | — | 39002 |

#### Blade (1M, Bicheon)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Copper Blade | Short Copper Blade | Long Copper Blade | 107 |
| **2D** | 8/10/13 | Infantry Hand Blade | Lancer Hand Blade | Cavalry Hand Blade | 110 |
| **3D** | 16/18/21 | Mhong tribe Cutting Blade | Kang tribe Cutting Blade | Hun tribe Cutting Blade | 113 |
| **4D** | 24/26/29 | Iron General Blade | Silver General Blade | Gold General Blade | 116 |
| **5D** | 32/35/38 | Lunar Blade | Rune Lunar Blade | Holy Lunar Blade | 119 |
| **6D** | 42/45/48 | Python's Blade | Python's Freezing Blade | Python's Frozen Blade | 122 |
| **7D** | 52/56/60 | Phoenix Cornu Blade | Girin Cornu Blade | Dragon Cornu Blade | 125 |
| **8D** | 64/68/72 | Flaming Blaze Blade | Burning Blaze Blade | Hellfire Blaze Blade | 128 |
| **9D** | 76/80/85 | Mercury Astral Blade | Venus Astral Blade | Mars Astral Blade | 131 |
| **10D** | 90/94/98 | Brutal Giant Barbaric Sword | Savage Giant Barbaric Sword | Ferocious Giant Barbaric Sword | 134 |
| **11D** | 101 | Strom Adamantine Blade | — | — | 137 |
| **12D** | 111/114/118 | White Dragon Blade | Bluish Dragon Blade | Golden Dragon Blade | 140 |
| **13D** *(Seal)* | 121 | Cutting Dragon Blade | — | — | 39005 |

#### Spear (2M, Heuksal)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Crescent | Short Crescent | Long Crescent | 143 |
| **2D** | 8/10/13 | Infantry Long Pike | Lancer Long Pike | Cavalry Long Pike | 146 |
| **3D** | 16/18/21 | Vicious Snake Spear | Atrocious Snake Spear | Merciless Snake Spear | 149 |
| **4D** | 24/26/29 | Iron Lance | Silver Lance | Gold Lance | 152 |
| **5D** | 32/35/38 | Long Halbert | Double Halbert | Great Halbert | 155 |
| **6D** | 42/45/48 | Python's Tough Spear | Python's Hard Spear | Pyhon's Sturdy Spear | 158 |
| **7D** | 52/56/60 | Phoenix Horn Spear | Prodigy Horn Spear | Dragon Horn Spear | 161 |
| **8D** | 64/68/72 | Holy Iranggjingun Pike | Probound Iranggjingun Pike | Divine Iranggjingun Pike | 164 |
| **9D** | 76/80/85 | Evil Flame Spear | Heavy Flame Spear | True Flame Spear | 167 |
| **10D** | 90/94/98 | Devil Poison Horn Spear | Blood Poison Horn Spear | Venom Poison Horn Spear | 170 |
| **11D** | 101 | Reaper Soul Spear | — | — | 173 |
| **12D** | 111/114/118 | White Dragon Halbert | Bluish Dragon Halbert | Golden Dragon Halbert | 176 |
| **13D** *(Seal)* | 121 | Dragon Horn Halberd | — | — | 39008 |

#### Glaive (2M, Heuksal)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Glaive | Short Glaive | Long Glaive | 179 |
| **2D** | 8/10/13 | Bronze Glaive | Long Bronze Glaive | Double Bronze Glaive | 182 |
| **3D** | 16/18/21 | Merchant's Hook Glaive | Thief's Hook Glaive | Hunter's Hook Glaive | 185 |
| **4D** | 24/26/29 | Three Ring Lightning Glaive | Four Ring Lightning Glaive | Five Ring Lightning Glaive | 188 |
| **5D** | 32/35/38 | Cutting Glaive of Hades | Cutting Glaive of Heaven | Cutting Glaive of Elysium | 191 |
| **6D** | 42/45/48 | Blue Moon Glaive | Black Moon Glaive | Silver Moon Glaive | 194 |
| **7D** | 52/56/60 | Muhwang's Storm Glaive | Muhwang's Flame Glaive | Muhwang's Frozne Glaive | 197 |
| **8D** | 64/68/72 | Polearm | Long Polearm | Double Polearm | 200 |
| **9D** | 76/80/85 | Apostasy Demon Polearm | Ghost Demon Polearm | Esoteric Demon Polearm | 203 |
| **10D** | 90/94/98 | Devil Green Dragon Crescent Blade | Blood Green Dragon Crescent Blade | Venom Green Dragon Crescent Blade | 206 |
| **11D** | 101 | Horyeokbongin Polearm | — | — | 209 |
| **12D** | 111/114/118 | Bokhi Cryptic Polearm | Yeomje Cryptic Polearm | Chwiu Cryptic Polearm | 212 |
| **13D** *(Seal)* | 121 | Cutting Falls Glaive | — | — | 39011 |

#### Bow (Pacheon)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Copper Bow | Long Copper Bow | Double Copper Bow | 215 |
| **2D** | 8/10/13 | Infantry Bronz Bow | Hunter Bronz Bow | Archer Bronz Bow | 218 |
| **3D** | 16/18/21 | Strong Iron Bow | Powerful Iron Bow | Aamant Iron Bow | 221 |
| **4D** | 24/26/29 | Warrior's Horseman Bow | Warlord's Horseman Bow | Patriarch's Horseman Bow | 224 |
| **5D** | 32/35/38 | Shaman's Occult Bow | Conjurator's Occult Bow | Mage's Occult Bow | 227 |
| **6D** | 42/45/48 | Eagle Horn Bow | Buffalo Horn Bow | Python Horn Bow | 230 |
| **7D** | 52/56/60 | Vicious Snake Bow | Atrocious Snake Bow | Merciless Snake Bow | 233 |
| **8D** | 64/68/72 | Shiny Moon Bow | Blessed Moon Bow | Glorious Moon Bow | 236 |
| **9D** | 76/80/85 | High Clouds Sinnok Bow | Shining Clouds Sinnok Bow | Ocean Clouds Sinnok Bow | 239 |
| **10D** | 90/94/98 | Giant Ye's Divine Bow | Colossus Ye's Divine Bow | Titan Ye's Divine Bow | 242 |
| **11D** | 101 | Mirage Illusion Bow | — | — | 245 |
| **12D** | 111/114/118 | Rainstorm Poseidon Bow | Windstorm Poseidon Bow | Icestorm Poseidon Bow | 248 |
| **13D** *(Seal)* | 121 | Dragon Bow | — | — | 39014 |

### Stats réelles d'exemples (source sro-world.de.tl, échelle client)

| Arme | Lv | Atq PHY | Atq MAG | Durabilité | Précision (attack rate) |
|------|----|---------|---------|------------|--------------------------|
| Copper Sword (1D A) | 1 | 15~16 | 25~28 | 62 | 24 |
| Long Copper Sword (1D C) | 5 | 24~27 | 40~46 | 65 | 32 |
| Cavalry Bronze Sword (2D C) | 13 | 47~52 | 79~90 | 70 | 46 |
| Copper Blade (1D A) | 1 | 16~18 | 24~26 | 69 | 24 |
| Cavalry Hand Blade (2D C) | 13 | 49~56 | 75~83 | 77 | 46 |
| Hellfire Blaze Blade (8D C) | 72 | 626~719 | 942~1061 | 117 | 132 |
| Crescent (spear 1D A) | 1 | 15~18 | 26~32 | 42 | 24 |
| Copper Shield (1D A) | 1 | 2.0 | 3.2 | 46 | — |

> 📌 Même les armes STR (blade, glaive) ont une attaque magique brute plus élevée que leur attaque physique dans les données ; la différence sword/spear vs blade/glaive se joue sur les **specializations** et le ratio relatif entre les deux stats.

---

## 🎯 Caractéristiques de Combat des Armes

### Taux de critique de base (wiki Fandom — Weapons)

| Arme | Crit base | Crit max (blues) | Orientation |
|------|-----------|------------------|-------------|
| Sword | 3 | 15 | INT (Bicheon 1M) |
| Blade | 1 | ~13 | STR (Bicheon 1M) |
| Spear | 4 | 16 | INT (Heuksal 2M) |
| Glaive | 2 | 14 | STR (Heuksal 2M) |
| Bow | 2 | 14 | polyvalente (Pacheon) |
| Armes magiques EU (staff, rods, harp) | 2 (affiché) | — | ne font pas de critique |

### Portées (colonne Range, ÷10 = mètres affichés)

| Armes | Portée (unités monde) | Affichage |
|-------|-----------------------|-----------|
| Dagues | 3 | contact |
| Sword, Blade, Axe, Rods, Staff, Harp | 6 | mêlée |
| Spear, Glaive, Épée 2M | 18 | mêlée longue |
| Bow, Crossbow | 180 | 18 m (la plus longue portée) |

### Vitesses d'attaque
SRO n'expose pas de stat « vitesse d'attaque » par item : chaque type d'arme a sa propre animation. Repères communautaires : dagues EU les plus rapides, harpe la plus rapide des armes magiques, armes 2M les plus lentes. L'attack rating (« Accuracy ») monte avec les tiers (ex. sword 1D : 24 → 28 → 32).

---

## 🌐 Noms Originels des Armes et Accessoires (ZH/KR)

> Recherches multilingues 2026-10 (ZH : wiki Bahamut/TW ; KO : Inven 20/12/2004, TGDaily). Utile pour un affichage multilingue — les **codenames restent la clé unique**.

| Arme iSRO | Chinois | Coréen (2004) |
|-----------|---------|----------------|
| Sword | 剑 (TW 劍) jiàn | 한손검 |
| Blade | 刀 / 小刀 dāo | 한손도 |
| Spear | 枪 (TW 槍) qiāng | 창 |
| Glaive | 大刀 dàdāo | 대도 |
| Bow | 弓 gōng | 활 |
| Shield | 盾 dùn | — |

- Armes EU (noms TW) : 單手劍 (épée 1M), 雙手劍 (épée 2M), 雙斧 (double hache), 匕首 (dagues), 十字弓 (arbalète), 法杖 (bâton wizard), 術杖 (dark staff), 豎琴 (harpe), 牧杖 (clerical rod).
- Accessoires (ZH) : 戒指 jièzhi (anneau), 项链 xiàngliàn (collier), 耳环 ěrhuán (boucle d'oreille).
- Ordre physique → magique des 5 armes CN selon la communauté : **大刀 → 小刀 → 弓 → 剑 → 枪**.
- Noms d'items 10D attestés côté KR : **파천검** = la série « …Break Heaven Sword » (sword CH 10D, motif tigre du zodiaque) ; **다크모나크** = « Taurus Dark Monarch » (épée 1M EU 10D, motif Taureau).
- Sources : https://wiki2.gamer.com.tw/wiki.php?n=10948:洛克山 (Bahamut, TW) · https://www.inven.co.kr/webzine/news/?news=2285 (Inven, KO) · https://www.tgdaily.co.kr/news/articleView.html?idxno=127275 (TGDaily, KO).

---

## 🇰🇷 Noms officiels coréens 11-13차 (service KSRO)

> Rapport `ML_RESEARCH/RESEARCH_KO2_ITEMS.md` (2026-10-01, §5-§7) — extraction des **tables officielles du site KSRO** (`krsilkroadcp.joymax.com`, EUC-KR converti, fiabilité 5) : [armes CH](https://krsilkroadcp.joymax.com/gamedata/item/asia_item.asp) · [armes EU](https://krsilkroadcp.joymax.com/gamedata/item/europe_item.asp) · [sets](https://krsilkroadcp.joymax.com/gamedata/item/set_item.asp) · protecteurs/accessoires 12-13차 (iframes `Iframe_item/asia_protector…`, `europe_accessory…` — source K11 du rapport). ⚠️ Ces tables décrivent le **service coréen vivant** : **tous les items 11/12/13차 y sont Lv 101** (règle du niveau fixe 12차+, voir [07_ITEM_DEGREES.md](07_ITEM_DEGREES.md#-contenu-ksro-2011-2026--les-degrés-11차--17차)) — à ne pas confondre avec les niveaux 111-121 du dump iSRO/vSRO ci-dessus.

### Armes chinoises 11차 — 3 tiers, panthéon égyptien (toutes Lv 101)

Format : attaque physique ~ / attaque magique ~. Ordre de puissance vérifié : **normal < 무신 < 투신**.

| Type | 11차 normal | 11차 **무신** | 11차 **투신** |
|---|---|---|---|
| 한손검 (sword) | 혼령 추혼검 (1434~1616 / 2440~2804) | **아슈** — Shu, dieu de l'air (1754~1978 / 2986~3432) | **아조스** — Anubis (1857~2094 / 3161~3633) |
| 한손도 (blade) | 풍신 진천 금강도 | **몬트센** — Montu, dieu de la guerre | **수테크** — Set |
| 창 (spear) | 전사의 비전창 | **브레커스** | **라그니우스** — Selket |
| 대도 (glaive) | 호력 봉인도 | **세크메티아** — Sekhmet | **티폰** — Typhon/Haroeris |
| 활 (bow) | 황풍 비호대궁 | **누트리타** — Nut | **수낙트라** — Neith |
| 방패 (shield) | (normal) bloc 213.7 / 342.0 | **세드온(보호)** — Sed | **세이케스(수호)** — Selket |

> ⚠️ **Interprétation signalée** : 무신/투신 = équivalent **probable** des couches iSRO « 11D normal / Seal of Nova / Egyptian A-B » (dieux égyptiens + ordre de puissance + Job Temple) — inférence, pas un texte officiel. Les armes EU 11차 suivent le même schéma (무신 : Shu, Montu, Nut, Geb, Imutes, Ma'at, Isis, Sed, Bastet… ; 투신 : Anubis, Set, Selket, Sekhmet, Neith, Horus, Nephtys, Apepi…).

### Armes 12차 — thème DRAGON (« 청룡의 뼈 », « 용왕 », « 마왕석 ») — Lv 101

| Race | Type | Nom KR | Stats (phys / mag) |
|---|---|---|---|
| CH | 한손검 | **마신검** (épée-démon céleste, os de dragon bleu) | 1720~1939 / 3577~4112 |
| CH | 한손도 | **용비도** (« le dragon recrache une lame tous les 100 ans ») | 2236~2570 / 2752~3102 |
| CH | 창 | **황룡뇌극** (os du dragon jaune du Huang He) | 1795~2137 / 3761~4596 |
| CH | 대도 | **참장봉신비도** (os du 광룡 de 육합도인) | 2351~2873 / 2872~3419 |
| CH | 활 | **용왕장궁** (os du dragon des mers du palais du Dragon) | 1933~2369 / 3093~3790 |
| CH | 방패 | **룡 두갑 방패** (crâne du dragon des eaux) | bloc 284.9 / 455.8 |
| EU | 원핸드소드 | **세이튼스피리트** | 2564~3134 |
| EU | 투핸드소드 | **데모고르곤** | 2564~3134 |
| EU | 듀얼액스 | **데빌스레이닝** | 2564~3134 |
| EU | 대거 | **인페르노토쳐** | 2564~3134 |
| EU | 크로스보우 | **어비스 레인** | 2564~3134 |
| EU | 스태프 | **이블 소울 라이징** | 4103~5014 (mag) |
| EU | 워락로드 | **카오틱어비스** | 4103~5014 (mag) |
| EU | 클레릭로드 | **헤븐스셀베이션** | 4103~5014 (mag) |
| EU | 하프 | **데몬즈하울** | 4103~5014 (mag) |

### Armes 13차 — thème TEMPÊTE / dragon céleste (« 승천하는 용 ») — Lv 101

| Race | Type | Nom KR | Stats (phys / mag) |
|---|---|---|---|
| CH | 한손검 | **청룡검** (« le vent fait danser le dragon ») | 2275~2565 / 4733~5441 |
| CH | 한손도 | **참룡도** (« coupe même les dragons ») | 2958~3400 / 3641~4104 |
| CH | 창 | **용섬극** (dragon ascendant) | 2375~2827 / 4976~6082 |
| CH | 대도 | **폭참마도** | 3110~3801 / 3800~4524 |
| CH | 활 | **용마궁** (flèche sortie de la gueule du dragon) | 2558~3135 / 4092~5015 |
| EU | 원핸드소드 | **드래곤 페나** | 3393~4147 |
| EU | 투핸드소드 | **디스트로이어** | 3393~4147 |
| EU | 듀얼액스 | **그레이트 듀엘** | 3393~4147 |
| EU | 대거 | **드래곤 피어** (dent de dragon) | 3393~4147 |
| EU | 크로스보우 | **드래곤 브레스** | 3393~4147 |
| EU | 스태프 | **드래고닉 소울** | 5428~6635 (mag) |
| EU | 워락로드 | **어비스 타이푼** | 5428~6635 (mag) |
| EU | 하프 | **허리케인 랩소디** | 5428~6635 (mag) |

> Ordre de puissance vérifié : **11차 normal < 12차 normal < 11차 투신 (phys)** — le 12차 normal dépasse le 11차 normal en magie mais reste sous le tier 투신 en physique (ex. sword : 마신검 1720~1939 phys vs 아조스 1857~2094). Cohérent avec le constat iSRO « 12D plus fort que 11D normal, plus faible que certains EGY 11D ».

### Sets et bijoux 11-13차

**11차** (échangeables contre des **진은주화**, « pièces d'argent véritable » — monnaie dédiée ni achetable ni droppée) :

| Set | Cible | Thème officiel | Set effect officiel |
|---|---|---|---|
| **아주라이트** (Azurite) | CH 갑옷 + EU 중갑 (heavy) | « pierre sacrée de 폭풍의 사막 » | **파멸(2/6)** : 세트 강화 +1 · **파멸(4/6)** : 세트 강화 +1, 올저항 +10 · **파멸(6/6)** : 세트 강화 +2, 올저항 +10 |
| **케프타** (Khepri) | EU 경갑 (light) | carapace du scarabée Khepri | 파멸 2/4/6 (idem) |
| **아페피타** (Apepi/Apophis) | EU 로브 (robe) | peau du serpent Apepi | 파멸 2/4/6 (idem) |
| **텍타이트** (Tektite) | accessoires CH | « roche mère de l'univers » | (2/4) 세트 강화 +1 · (4/4) +2 |
| **아문** (Amun) | accessoires CH | Amun, dieu du ciel/créateur | (2/4) 세트 강화 +2 · (4/4) +4 |
| **플레나이트** | accessoires EU | « lucidité qui transperce le vrai » | (2/4) +1 · (4/4) +2 |
| **이시스** (Isis) | accessoires EU | bénédiction d'Isis | (2/4) +2 · (4/4) +4 |

*(세트 강화 = niveaux d'enhancement offerts par le set ; 올저항 +10 = +10 toutes résistances. Exemples : 아주라이트 아머 (EU heavy chest) 274.1/358.8, 케프타 메일 249.2/398.7, 아페피타 로브 224.3/438.6, 텍타이트/아문 반지 absorb 23.0/23.0.)*

**12차 (dragon) et 13차 (tempête)** — exemples de plastrons (pdef/mdef) :

| Race/type | 12차 | Exemple chest 12차 | 13차 | Exemple chest 13차 |
|---|---|---|---|---|
| CH 갑옷 (armor) | **룡위 보문** | 상갑 364.8 / 477.5 | **템페스트** | 상갑 482.0 / 631.0 |
| CH 호구 (protector) | **봉황룡** (dragon-phénix) | — | **프로셀라** (Procella, « vent impétueux ») | — |
| CH 도복 (garment) | **천 촉룡** (dragon du Shu) | 상의 298.5 / 636.7 | **브리즈** (Breeze) | 상의 394.4 / 841.4 |
| EU 중갑 (heavy) | **헤븐** (Heaven) | 플루티드아머 364.8 / 477.5 | **템페스트** | 아머 482 / 631 |
| EU 경갑 (light) | **엔젤** (Angel) | 플루티드메일 331.6 / 530.6 | **프로셀라** | 메일 438.2 / 701.2 |
| EU 로브 (robe) | **디보션** (Devotion) | 로브 298.5 / 583.7 | **브리즈** | 로브 394.4 / 771.3 |
| Bijoux CH | **여의주반지 / 여의주귀걸이** (perle du dragon ; 반지 absorb 25.3/25.3) | — | **폭풍석 반지/귀걸이** (« pierre de tempête ») | — |
| Bijoux EU | **드래곤링 / 드래곤이어링** | — | **블루 스톰 링/이어링** (Blue Storm) | — |

### ⚠️ 14-17차 : extraction client requise

- Les tables officielles KSRO s'arrêtent au **13차**. Au-delà, l'existence des degrés est prouvée par l'[item mall](https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?shoptype1=ARCHEMY&Shoptype2=ETC) (보호석 14→17차, 특수각석 11→14차) et l'[accueil officiel](https://krsilkroadcp.joymax.com/) (봉인구 16/17차, 32 실크) — **mais aucun nom/stat officiel des items 14-17차 n'est publié** : extraction du client requise.
- Les noms EN des sets 17차 qui circulent (CH **Platina/Orbis/Tonitrus**, armes « Tiger Divine Sword… », EU « Draco Cornu, Packers Ictus, Atrox Afer… », accessoires **Gold Lion/Holy Lord**) viennent d'un post [SroLobby](https://www.srolobby.com/konular/silkroad-online-silkroad-box-17-degree-item-drop-rates.4434) (fiabilité 3) — **non officiel**, à ne pas importer comme données KR.
- Taux de la Silkroad Box 17차 (armes Legend 0,0003 % / Rare 0,0009 % / Magic 0,003 %) : mêmes réserves — dérivés KR selon le post, non officiels.

### 🐾 Devil spirits tardifs (item mall KSRO 2026)

- **12 소환 스크롤** (devil spirits / growling) vendus au [mall PET/GROWTH](https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?Shoptype1=PET&Shoptype2=GROWTH), **55 실크 chacun** : **블러드 아머 다이노, 에이션트 트라브 베어, 옐로우 스파클 오트리슈, 루비노 피닉스, 라바 로어 하운드, 하프문 재규어, 실버 백, 다크 그리핀, 크록스, 나이트 팽, 골드 혼, 소울 테일**.
- Recoupement EN (fiabilité 2) : quête Devil Spirit liée au Roc lv 100 ; **+3~+5 change le devil skill** (+25 % dégâts / +15 % MS au +5) ; Devil vs Angel = mêmes stats, look différent. Voir aussi les grades A/S documentés plus haut.
- Le mall statique 2026 ne vend **aucun avatar d'apparence** (stands de stall uniquement) — les avatars passent par les box/événements (incertitude : aucune liste officielle KR d'avatars tardifs).

---

## ⚔️ Armes Européennes

> Les armes EU infligent **un seul type de dégâts** (physique pour warrior/rogue, magique pour wizard/warlock/cleric/bard — le harp fait du magique). Noms des 3 tiers = constellations par degré (voir [08_ARMOR_TYPES.md](08_ARMOR_TYPES.md#-noms-des-sets-européens-par-degré-1d-13d)).

#### Épée 1M (Warrior)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Sagittarius Long Sword | Canes Long Sword | Sagitta Long Sword | 10933 |
| **2D** | 8/10/13 | Pisces Gradius | Cygnus Gradius | Lacerta Gradius | 10936 |
| **3D** | 16/18/21 | Gemini Broad Sword | Andromeda Broad Sword | Aquila Broad Sword | 10939 |
| **4D** | 24/26/29 | Aries Flamberge | Canis Flamberge | Corvus Flamberge | 10942 |
| **5D** | 32/35/38 | Aquarius Misty Blade | Triangulum Misty Blade | Monoceros Misty Blade | 10945 |
| **6D** | 42/45/48 | Cancer Blaze Sword | Cassiopeia Blaze Sword | Ursa Blaze Sword | 10948 |
| **7D** | 52/56/60 | Libra Imperial Sword | Crater Imperial Sword | Vulpecula Imperial Sword | 10951 |
| **8D** | 64/68/72 | Virgo Dame Blade | Auriga Dame Blade | Bootes Dame Blade | 10954 |
| **9D** | 76/80/85 | Scorpio Katzbalger | Hydra Katzbalger | Lynx Katzbalger | 10957 |
| **10D** | 90/94/98 | Taurus Dark Monarch | Cetus Dark Monarch | Lepus Dark Monarch | 10960 |
| **11D** | 101 | Capricorn Grand Cross | — | — | 10963 |
| **12D** | 111/114/118 | Satan Spirit | Ophiuchus Satan Spirit | Lyra Satan Spirit | 10966 |
| **13D** *(Seal)* | 121 | Dragon Penna | — | — | 39140 |

#### Épée 2M (Warrior)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Sagittarius War Sword | Canes War Sword | Sagitta War Sword | 10969 |
| **2D** | 8/10/13 | Pisces Bronze Sword | Cygnus Bronze Sword | Lacerta Bronze Sword | 10972 |
| **3D** | 16/18/21 | Gemini Bastard Sword | Andromeda Bastard Sword | Aquila Bastard Sword | 10975 |
| **4D** | 24/26/29 | Aries Giant Sword | Canis Giant Sword | Corvus Giant Sword | 10978 |
| **5D** | 32/35/38 | Aquarius Great Sword | Triangulum Great Sword | Monoceros Great Sword | 10981 |
| **6D** | 42/45/48 | Cancer Claymore | Cassiopeia Claymore | Ursa Claymore | 10984 |
| **7D** | 52/56/60 | Libra Radiant Sword | Crater Radiant Sword | Vulpecula Radiant Sword | 10987 |
| **8D** | 64/68/72 | Virgo Knight's Creed | Auriga Knight's Creed | Bootes Knight's Creed | 10990 |
| **9D** | 76/80/85 | Scorpio Valor Phantom | Hydra Valor Phantom | Lynx Valor Phantom | 10993 |
| **10D** | 90/94/98 | Taurus Colossus Blade | Cetus Colossus Blade | Lepus Colossus Blade | 10996 |
| **11D** | 101 | Capricorn Saint Splendor | — | — | 10999 |
| **12D** | 111/114/118 | Demogorgon | Ophiuchus Demogorgon | Lyra Demogorgon | 11002 |
| **13D** *(Seal)* | 121 | Destroyer | — | — | 39143 |

#### Double hache (Warrior)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Sagittarius Small Axe | Canes Small Axe | Sagitta Small Axe | 11005 |
| **2D** | 8/10/13 | Pisces Bronze Axe | Cygnus Bronze Axe | Lacerta Bronze Axe | 11008 |
| **3D** | 16/18/21 | Gemini Rome Axe | Andromeda Rome Axe | Aquila Rome Axe | 11011 |
| **4D** | 24/26/29 | Aries Royal Guard | Canis Royal Guard | Corvus Royal Guard | 11014 |
| **5D** | 32/35/38 | Aquarius Crescent Axe | Triangulum Crescent Axe | Monoceros Crescent Axe | 11017 |
| **6D** | 42/45/48 | Cancer Berserker Axe | Cassiopeia Berserker Axe | Ursa Berserker Axe | 11020 |
| **7D** | 52/56/60 | Libra Soul Killer | Crater Soul Killer | Vulpecula Soul Killer | 11023 |
| **8D** | 64/68/72 | Virgo Wind'sVane | Auriga Wind'sVane | Bootes Wind'sVane | 11026 |
| **9D** | 76/80/85 | Scorpio Furious Beast | Hydra Furious Beast | Lynx Furious Beast | 11029 |
| **10D** | 90/94/98 | Taurus Hell Breath | Cetus Hell Breath | Lepus Hell Breath | 11032 |
| **11D** | 101 | Capricorn Ruined Hell | — | — | 11035 |
| **12D** | 111/114/118 | Devil's Reigning | Ophiuchus Devil's Reigning | Lyra Devil's Reigning | 11038 |
| **13D** *(Seal)* | 121 | Great Dual | — | — | 39146 |

#### Dagues (Rogue)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Sagittarius Dirk | Canes Dirk | Sagitta Dirk | 10897 |
| **2D** | 8/10/13 | Pisces Baselard | Cygnus Baselard | Lacerta Baselard | 10900 |
| **3D** | 16/18/21 | Gemini KidneyDagger | Andromeda KidneyDagger | Aquila KidneyDagger | 10903 |
| **4D** | 24/26/29 | Aries Dazzling Dagger | Canis Dazzling Dagger | Corvus Dazzling Dagger | 10906 |
| **5D** | 32/35/38 | Aquarius Double Haste | Triangulum Double Haste | Monoceros Double Haste | 10909 |
| **6D** | 42/45/48 | Cancer Viper Sting | Cassiopeia Viper Sting | Ursa Viper Sting | 10912 |
| **7D** | 52/56/60 | Libra Golden Glitter | Crater Golden Glitter | Vulpecula Golden Glitter | 10915 |
| **8D** | 64/68/72 | Virgo Wind Split | Auriga Wind Split | Bootes Wind Split | 10918 |
| **9D** | 76/80/85 | Scorpio Sudden Vanishing | Hydra Sudden Vanishing | Lynx Sudden Vanishing | 10921 |
| **10D** | 90/94/98 | Taurus Immortal Edge | Cetus Immortal Edge | Lepus Immortal Edge | 10924 |
| **11D** | 101 | Capricorn Justice | — | — | 10927 |
| **12D** | 111/114/118 | Inferno Torture | Ophiuchus Inferno Torture | Lyra Inferno Torture | 10930 |
| **13D** *(Seal)* | 121 | Dragon Fear | — | — | 39137 |

#### Arbalète (Rogue)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Sagittarius Copper CrossBow | Canes Copper CrossBow | Sagitta Copper CrossBow | 11041 |
| **2D** | 8/10/13 | Pisces Battle Crossbow | Cygnus Battle Crossbow | Lacerta Battle Crossbow | 11044 |
| **3D** | 16/18/21 | Gemini War Crossbow | Andromeda War Crossbow | Aquila War Crossbow | 11047 |
| **4D** | 24/26/29 | Aries Silver Crossbow | Canis Silver Crossbow | Corvus Silver Crossbow | 11050 |
| **5D** | 32/35/38 | Aquarius Ballesta | Triangulum Ballesta | Monoceros Ballesta | 11053 |
| **6D** | 42/45/48 | Cancer Jewal Crossbow | Cassiopeia Jewal Crossbow | Ursa Jewal Crossbow | 11056 |
| **7D** | 52/56/60 | Libra Imperial Bow | Crater Imperial Bow | Vulpecula Imperial Bow | 11059 |
| **8D** | 64/68/72 | Virgo Lunar Hunter | Auriga Lunar Hunter | Bootes Lunar Hunter | 11062 |
| **9D** | 76/80/85 | Scorpio Storm Spiral | Hydra Storm Spiral | Lynx Storm Spiral | 11065 |
| **10D** | 90/94/98 | Taurus Night Wings | Cetus Night Wings | Lepus Night Wings | 11068 |
| **11D** | 101 | Capricorn Luminous Relic | — | — | 11071 |
| **12D** | 111/114/118 | Abyss Rain | Ophiuchus Evi Arc | Lyra Evi Arc | 11074 |
| **13D** *(Seal)* | 121 | Dragon Breath | — | — | 39149 |

#### Bâton 2M (Wizard)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Sagittarius Copper Rod | Canes Copper Rod | Sagitta Copper Rod | 11185 |
| **2D** | 8/10/13 | Pisces Circle Stick | Cygnus Circle Stick | Lacerta Circle Stick | 11188 |
| **3D** | 16/18/21 | Gemini Flame Rod | Andromeda Flame Rod | Aquila Flame Rod | 11191 |
| **4D** | 24/26/29 | Aries Silver Rod | Canis Silver Rod | Corvus Silver Rod | 11194 |
| **5D** | 32/35/38 | Aquarius Noble Rod | Triangulum Noble Rod | Monoceros Noble Rod | 11197 |
| **6D** | 42/45/48 | Cancer Moonlight Orb | Cassiopeia Moonlight Orb | Ursa Moonlight Orb | 11200 |
| **7D** | 52/56/60 | Libra Shining Sun | Crater Shining Sun | Vulpecula Shining Sun | 11203 |
| **8D** | 64/68/72 | Virgo Lunar Bird | Auriga Lunar Bird | Bootes Lunar Bird | 11206 |
| **9D** | 76/80/85 | Scorpio Ancient Legacy | Hydra Ancient Legacy | Lynx Ancient Legacy | 11209 |
| **10D** | 90/94/98 | Taurus Ethereal Cane | Cetus Ethereal Cane | Lepus Ethereal Cane | 11212 |
| **11D** | 101 | Capricorn Sacred Wing | — | — | 11215 |
| **12D** | 111/114/118 | Heaven's Salvation | Ophiuchus Heaven's Salvation | Lyra Heaven's Salvation | 11218 |
| **13D** *(Seal)* | 121 | Dragon Celebrate | — | — | 39161 |

#### Dark Staff (Warlock)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Sagittarius ArcStick | Canes ArcStick | Sagitta ArcStick | 11077 |
| **2D** | 8/10/13 | Pisces ShadyStick | Cygnus ShadyStick | Lacerta ShadyStick | 11080 |
| **3D** | 16/18/21 | Gemini SpineRod | Andromeda SpineRod | Aquila SpineRod | 11083 |
| **4D** | 24/26/29 | Aries DismayRod | Canis DismayRod | Corvus DismayRod | 11086 |
| **5D** | 32/35/38 | Aquarius SwirlRod | Triangulum SwirlRod | Monoceros SwirlRod | 11089 |
| **6D** | 42/45/48 | Cancer RavenShadow | Cassiopeia RavenShadow | Ursa RavenShadow | 11092 |
| **7D** | 52/56/60 | Libra GoldenScourge | Crater GoldenScourge | Vulpecula GoldenScourge | 11095 |
| **8D** | 64/68/72 | Virgo NemesisTear | Auriga NemesisTear | Bootes NemesisTear | 11098 |
| **9D** | 76/80/85 | Scorpio Bloody Anathema | Hydra Bloody Anathema | Lynx Bloody Anathema | 11101 |
| **10D** | 90/94/98 | Taurus Disaster Cane | Cetus Disaster Cane | Lepus Disaster Cane | 11104 |
| **11D** | 101 | Capricorn DemonicLuster | — | — | 11107 |
| **12D** | 111/114/118 | ChaoticAbyss | Ophiuchus ChaoticAbyss | Lyra ChaoticAbyss | 11110 |
| **13D** *(Seal)* | 121 | Abyss Typoon | — | — | 39152 |

#### Clerical Rod (Cleric)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Sagittarius Long Staff | Canes Long Staff | Sagitta Long Staff | 11113 |
| **2D** | 8/10/13 | Pisces Bronze Staff | Cygnus Bronze Staff | Lacerta Bronze Staff | 11116 |
| **3D** | 16/18/21 | Gemini Soul Staff | Andromeda Soul Staff | Aquila Soul Staff | 11119 |
| **4D** | 24/26/29 | Aries Wing Staff | Canis Wing Staff | Corvus Wing Staff | 11122 |
| **5D** | 32/35/38 | Aquarius Mystic Staff | Triangulum Mystic Staff | Monoceros Mystic Staff | 11125 |
| **6D** | 42/45/48 | Cancer Blood Flare | Cassiopeia Blood Flare | Ursa Blood Flare | 11128 |
| **7D** | 52/56/60 | Libra Pentacle Ornament | Crater Pentacle Ornament | Vulpecula Pentacle Ornament | 11131 |
| **8D** | 64/68/72 | Virgo Elegant Staff | Auriga Elegant Staff | Bootes Elegant Staff | 11134 |
| **9D** | 76/80/85 | Scorpio Magician Glacier | Hydra Magician Glacier | Lynx Magician Glacier | 11137 |
| **10D** | 90/94/98 | Taurus Soul Fiend | Cetus Soul Fiend | Lepus Soul Fiend | 11140 |
| **11D** | 101 | Capricorn Gia Brain | — | — | 11143 |
| **12D** | 111/114/118 | Evil Soul Rising | Ophiuchus Arcane Hazard | Lyra Arcane Hazard | 11146 |
| **13D** *(Seal)* | 121 | Dragonet Soul | — | — | 39155 |

#### Harpe (Bard)

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Sagittarius TetraCalled | Canes TetraCalled | Sagitta TetraCalled | 11149 |
| **2D** | 8/10/13 | Pisces Bronze Kitara | Cygnus Bronze Kitara | Lacerta Bronze Kitara | 11152 |
| **3D** | 16/18/21 | Gemini Hamonia Blow | Andromeda Hamonia Blow | Aquila Hamonia Blow | 11155 |
| **4D** | 24/26/29 | Aries Silver Kitara | Canis Silver Kitara | Corvus Silver Kitara | 11158 |
| **5D** | 32/35/38 | Aquarius Hepta Forte | Triangulum Hepta Forte | Monoceros Hepta Forte | 11161 |
| **6D** | 42/45/48 | Cancer Melodious | Cassiopeia Melodious | Ursa Melodious | 11164 |
| **7D** | 52/56/60 | Libra GoldenKitara | Crater GoldenKitara | Vulpecula GoldenKitara | 11167 |
| **8D** | 64/68/72 | Virgo NonaCalled Muse | Auriga NonaCalled Muse | Bootes NonaCalled Muse | 11170 |
| **9D** | 76/80/85 | Scorpio CruelSuffering | Hydra CruelSuffering | Lynx CruelSuffering | 11173 |
| **10D** | 90/94/98 | Taurus Devil's Lure | Cetus Devil's Lure | Lepus Devil's Lure | 11176 |
| **11D** | 101 | Capricorn Seraphim Praise | — | — | 11179 |
| **12D** | 111/114/118 | Demon's Howl | Ophiuchus Hell Havoc | Lyra Hell Havoc | 11182 |
| **13D** *(Seal)* | 121 | Hurricane Rhapsody | — | — | 39158 |

---

## 🛡️ Boucliers

Utilisables uniquement avec une **arme 1M** : CH sword/blade ; EU épée 1M, dark staff (warlock), clerical rod. Le bouclier a un **block rate** au lieu d'un taux de critique : **base 10, max ~20** (vérifié sur `ITEM_CH_SHIELD_01`, colonnes 74/75 = 10~20), augmenté par les blues « Blocking Rate / Aegis ».

#### Boucliers chinois

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Copper Shield | Copper Round Shield | Copper Square Shield | 251 |
| **2D** | 8/10/13 | Bronze Shield | Bronze Round Shield | Bronze Square Shield | 254 |
| **3D** | 16/18/21 | Infantry Iron Shield | Lancer Iron Shield | Cavalry Iron Shield | 257 |
| **4D** | 24/26/29 | Loyalty Steel Shield | Honor Steel Shield | Hero Steel Shield | 260 |
| **5D** | 32/35/38 | Sterling Silver Shield | Noble Silver Shield | Sacred Silver Shield | 263 |
| **6D** | 42/45/48 | Robust Guard Shield | Impregnable Guard Shield | Godly Guard Shield | 266 |
| **7D** | 52/56/60 | Jecheonseong's Shield | Jecheonilseong's Shield | Jecheondaeseong's Shield | 269 |
| **8D** | 64/68/72 | Taegeuk Shield | Gungon Taegeuk Shield | Gamri Taegeuk Shield | 272 |
| **9D** | 76/80/85 | Flying Horse Scale Shield | Heavenly Horse Scale Shield | Divine Horse Scale Shield | 275 |
| **10D** | 90/94/98 | Tiger Bone Shield | Black Tiger Bone Shield | White Tiger Bone Shield | 278 |
| **11D** | 101 | Splinter Blade Shield | — | — | 281 |
| **12D** | 111/114/118 | White Dragon Shield | Blue Dragon Shield | Gold Dragon Shield | 284 |
| **13D** *(Seal)* | 121 | Blue Dragon Bone Shield | — | — | 39017 |

#### Boucliers européens

| Degré | Lv A/B/C | Tier A | Tier B | Tier C | ID (A) |
|-------|----------|--------|--------|--------|--------|
| **1D** | 1/3/5 | Sagittarius Copper Shield | Canes Copper Shield | Sagitta Copper Shield | 11545 |
| **2D** | 8/10/13 | Pisces Buckler | Cygnus Buckler | Lacerta Buckler | 11548 |
| **3D** | 16/18/21 | Gemini Tower Shield | Andromeda Tower Shield | Aquila Tower Shield | 11551 |
| **4D** | 24/26/29 | Aries Kite Shield | Canis Kite Shield | Corvus Kite Shield | 11554 |
| **5D** | 32/35/38 | Aquarius Treasure Shield | Triangulum Treasure Shield | Monoceros Treasure Shield | 11557 |
| **6D** | 42/45/48 | Cancer Scutum | Cassiopeia Scutum | Ursa Scutum | 11560 |
| **7D** | 52/56/60 | Libra Golden Skold | Crater Golden Skold | Vulpecula Golden Skold | 11563 |
| **8D** | 64/68/72 | Virgo Wing Gleam | Auriga Wing Gleam | Bootes Wing Gleam | 11566 |
| **9D** | 76/80/85 | Scorpio Demonic Skin | Hydra Demonic Skin | Lynx Demonic Skin | 11569 |
| **10D** | 90/94/98 | Taurus Guardian Aegis | Cetus Guardian Aegis | Lepus Guardian Aegis | 11572 |
| **11D** | 101 | Capricorn Heavenly Scutum | — | — | 11575 |
| **12D** | 111/114/118 | Absolute Preserve | Ophiuchus Absolute Preserve | Lyra Absolute Preserve | 11578 |
| **13D** *(Seal)* | 121 | Strom Kaiser | — | — | 39164 |

---

## 🛡️ Armures

Voir le fichier dédié **[08_ARMOR_TYPES.md](08_ARMOR_TYPES.md)** : noms des sets CH et EU degré par degré (3 tiers), stats DEF par pièce, bonus de set (vitesse/MP), restrictions EU par arme.

Repères d'IDs `_RefItem` (torso BA, tier A, personnage masculin) :
| Item | ID |
|------|-----|
| Copper Armor (CH heavy 1D) | 395 |
| Cloth Lamellar (CH protector 1D) | 647 |
| Cotton Suit (CH garment 1D) | 899 |
| Sagittarius Lorica Armor (EU heavy 1D) | 11743 |
| Sagittarius Savage Mail (EU light 1D) | 11995 |
| Sagittarius Cotton Robe (EU robe 1D) | 12247 |

---

## 💍 Accessoires

> ⚠️ **Correction importante** : les accessoires SRO n'ont **PAS** de stats de base STR/INT/HP. Leurs stats « blanches » sont une **absorption de dégâts** (melee/magical damage absorption, colonnes 71/72 d'itemdata) qui croît avec le degré. Les STR/INT/Lucky etc. viennent uniquement des **blues** (alchimie).
> Slots équipement : 2 anneaux + 1 collier + 2 boucles (5 pièces). Les niveaux sont décalés entre types (collier = plus haut).

### Chinois

| Degré | Anneau (lv) | Collier (lv) | Boucle (lv) |
|-------|-------------|--------------|-------------|
| **1D** | Ume Copper Ring (1) | Ume Copper Necklace (1) | Ume Copper Earring (1) |
| **2D** | Devildom Silver Ring (8) | Devildom Silver Necklace (12) | Devildom Silver Earring (10) |
| **3D** | Mercury Gold Ring (16) | Mercury Gold Necklace (20) | Mercury Gold Earring (18) |
| **4D** | Jadeite Ring (24) | Jadeite Necklace (28) | Jadeite Earring (26) |
| **5D** | Blue Quartz Ring (32) | Blue Quartz Necklace (36) | Blue Quartz Earring (34) |
| **6D** | Storm Platinum Ring (42) | Storm Platinum Necklace (46) | Storm Platinum Earring (44) |
| **7D** | Coast Pearl Ring (52) | Coast Pearl Necklace (56) | Coast Pearl Earring (54) |
| **8D** | Black Pearl Ring (64) | Black Pearl Necklace (68) | Black Pearl Earring (66) |
| **9D** | Hundred Nights Gem Ring (76) | Hundred Nights Gem Necklace (80) | Hundred Nights Gem Earring (78) |
| **10D** | Bright Tiger's Eye Ring (90) | Bright Tiger's Eye Necklace (92) | Bright Tiger's Eye Earring (91) |
| **11D** | Paradise Jewel Ring (101) | Paradise Jewel Necklace (101) | Paradise Jewel Earring (101) |
| **12D** | Blue Cintamani Ring (111) | Blue Cintamani Necklace (113) | Blue Cintamani Earring (112) |
| **13D** *(Seal)* | Strom Stone Ring (121) | Storm Stone Necklace (121) | Strom Stone Earring (121) |

Tiers A/B/C (ex 1D anneau : Ume / Peach / Pear Copper Ring ; 2D : Devildom / Hades / Inferno Silver Ring ; 3D : Mercury / Venus / Mars Gold Ring). ID `_RefItem` du tier A anneau : 1799 (1D), puis **+3 par degré et +1 par tier** (anneau 2D A = 1802, colliers/boucles sur d'autres plages).

### Européens

| Degré | Anneau (lv) | Collier (lv) | Boucle (lv) |
|-------|-------------|--------------|-------------|
| **1D** | Sagittarius Copper Ring (1) | Sagittarius Copper Necklace (1) | Sagittarius Copper Earring (1) |
| **2D** | Pisces Silver Ring (8) | Pisces Silver Necklace (12) | Pisces Silver Earring (10) |
| **3D** | Gemini Gold Ring (16) | Gemini Gold Necklace (20) | Gemini Gold Earring (18) |
| **4D** | Aries Corundum Ring (24) | Aries Corundum Necklace (28) | Aries Corundum Earring (26) |
| **5D** | Aquarius Quartz Ring (32) | Aquarius Quartz Necklace (36) | Aquarius Quartz Earring (34) |
| **6D** | Cancer Jade Ring (42) | Cancer Jade Necklace (46) | Cancer Jade Earring (44) |
| **7D** | Libra Pearl Ring (52) | Libra Pearl Necklace (56) | Libra Pearl Earring (54) |
| **8D** | Virgo Ruby Ring (64) | Virgo Ruby Necklace (68) | Virgo Ruby Earring (66) |
| **9D** | Scorpio Sapphire Ring (76) | Scorpio Sapphire Necklace (80) | Scorpio Sapphire Earring (78) |
| **10D** | Taurus Amber Ring (90) | Taurus Amber Necklace (92) | Taurus Amber Earring (91) |
| **11D** | Capricorn Heaven Ring (101) | Capricorn Heaven Necklace (101) | Capricorn Heaven Earring (101) |
| **12D** | Dragon Ring (111) | Dragon Necklace (113) | Dragon Earring (112) |
| **13D** *(Seal)* | Blue Storm Ring (121) | Blue Storm Necklace (121) | Blue Storm Earring (121) |

### Absorption de dégâts (exemples CH, sro-world.de.tl)

| Anneau | Lv | Absorption mêlée | Absorption magie |
|--------|----|------------------|------------------|
| Ume Copper Ring (1D A) | 1 | 0.2 | 0.2 |
| Pear Copper Ring (1D C) | 5 | 1.0 | 1.0 |
| Inferno Silver Ring (2D C) | 13 | 2.7 | 2.7 |
| Mars Gold Ring (3D C) | 21 | 4.3 | 4.3 |

---

## 🔵 Blues / Magic Options

> Les « blues » sont les options magiques des items, ajoutées par **alchimie** (tablet + elixir d'attribut) ou présentes au drop. Codenames serveur : `MATTR_*` (table `_RefMagicOpt` / fichier client `magicoption.txt`). Le niveau d'une option est encodé dans son ID (ex. `MATTR_INT` +1..+6 = ids 5-10) ; les plages dépendent du degré de l'item.

### Par emplacement

| Catégorie | Blues possibles |
|-----------|-----------------|
| **Armes** | Critical, Attack Rate (hit ratio), STR, INT, Durability %, Lucky, Steady, Immortal, Astral, Reinforcement, résistances, Ignore Block/Critical, HP/MP |
| **Armures** | Parry Rate, HP, MP, STR, INT, Durability %, Lucky, Steady, Immortal, Astral, résistances (Burn, Poison, Frostbite, EShock, Zombie, Stun, Disease, Sleep, Fear, Bleeding) |
| **Boucliers** | Blocking Rate, Critical Parry Ratio, Durability %, Lucky, Steady, Immortal, Astral, HP |
| **Accessoires** | STR, INT, HP, MP, Lucky, Steady, Immortal, Astral, Durability %, absorb HP/MP (vampirique), résistances |

### Glossaire des blues d'alchimie (fonctions)

| Blue | Effet |
|------|-------|
| **Lucky** | Augmente la chance de succès d'enchant (se stacke, ex. « Lucky (2 times) ») |
| **Steady** (SOLID) | Échec d'enchant : prévient la perte de durabilité |
| **Immortal** (ATHANASIA) | Échec d'enchant : prévient la destruction de l'item |
| **Astral** | Échec d'enchant : l'item redescend à +0 au lieu d'être détruit (rembourse les elixirs) |
| **Durability** | +% de durabilité max |
| **Attack Rate / Parry Rate** | +précision / +parade (réduit les dégâts subis haut de gamme) |
| **Critical** | +% de coups critiques (armes uniquement) |
| **Blocking Rate** | +block (boucliers) |
| **Résistances** | +% de résistance à un état (burn/poison/frostbite/eshock/zombie/stun/disease/sleep/fear/bleeding) |
| **Not Repairable** | Malus (item non réparable, consommable via alchimie) |
| **STR / INT** | +1..+7 (plage selon degré) |
| **HP / MP** | +30..+120 (plage selon degré) |

> Les avatars ont leurs propres blues (`MATTR_AVATAR_*`, `_SET`, `_3JOB`) : STR/INT/HP/MP/Attack Rate/Parry Rate/Lucky (le « full lucky avatar » donne ~+4% de chance en alchimie d'après Legion SRO).

---

## 🧪 Matériaux d'Alchimie

### Elixirs (enhancement +0 → +X)

| Item | Codename | Usage |
|------|----------|-------|
| Elixir (weapon) | `ITEM_ETC_ARCHEMY_REINFORCE_RECIPE_WEAPON_A` | +1 arme |
| Elixir (Shield) | `..._SHIELD_A` | +1 bouclier |
| Elixir (protector) | `..._ARMOR_A` | +1 armure |
| Elixir (accessory) | `..._ACCESSARY_A` | +1 accessoire |
| Intensifing Elixir ×4 | `..._B` | versions renforcées |
| **Advanced Elixir (lv 1-12)** | `ITEM_ETC_ARCHEMY_UPPER_REINFORCE_RECIPE_WE_A_{1-12}` | enchant avancé par degré (+2 etc.) |

### Lucky Powders

| Item | Codename |
|------|----------|
| Lucky Powder (1st-12th) | `ITEM_ETC_ARCHEMY_REINFORCE_PROB_UP_A_{01-12}` — augmente la chance de succès, un palier par degré |
| Lucky Magic Powder | `..._PROB_UP_B_{01-12}` |

### Tablets (alchimie d'attribut → blues)

17 familles × 12 niveaux (1 par degré) : `ITEM_ETC_ARCHEMY_MAGICTABLET_{TYPE}_{01-12}`
**Types** : STR, INT, DUR (master), HR (strikes), ER (parade), HP, MP, LUCK, SOLID (steady), ASTRAL, ATHANASIA (immortal), EVADE, BURN, POISON, FROSTBITE, ESHOCK, ZOMBIE.

### Magic Stones (sockets)

`ITEM_ETC_ARCHEMY_MAGICSTONE_{TYPE}_{01-13}` — mêmes familles que les tablets + spéciales : **Abyss** (destockage), **Ape** (« Assimilation Prevention », empêche l'écrasement d'un blue), Devil (retrait). Se posent dans les **slots de socket** des armes/armures (jusqu'à 3 sockets via Advance des items).

---

## 🧪 Consommables

### Potions (structure vérifiée)

| Série | Items | Stack |
|-------|-------|-------|
| HP | HP Recovery Herb → Potion (Small / Medium / Large / X-Large) → HP Recovery Grain (Small) | 250 |
| MP | MP Recovery Herb → Potion (Small → X-Large) → MP Recovery Grain | 250 |
| Vigor (HP+MP) | Vigor Recovery Herb → Potion (Small → X-Large) → Grain | 250 |
| Pets | Recovery kit (small/large) | 50 |

Prix NPC vérifiés (corpus openroad) : HP Potion (Small) = **60 gold** achat / 21 gold revente.

### Scrolls

| Item | Codename | ID |
|------|----------|-----|
| Beginner's Moving Speed Scroll | `ITEM_ETC_SPEED_UP_BASIC` | 24198 |
| Moving Speed Scroll (50%) | `ITEM_MALL_MOVE_SPEED_UP_50` | 9263 |
| Moving Speed Scroll (100%) | `ITEM_MALL_MOVE_SPEED_UP_100` | 9264 |
| Return / Reverse Return Scrolls | `ITEM_ETC_RETURN_SCROLL_*` | — |

### Munitions
Arrows (`3/3/4/1`) et bolts (`3/3/4/2`) — 8 items au total dans le corpus, l'unique consommable « équipé » (slot secondaire du bouclier).

---

## 🎭 Avatars et Devil Spirits

### Avatars (Item Mall)

- **587 items** `ITEM_MALL_AVATAR_{M|W}_*` dans le dump : habits (dress), chapeaux (hat) et attaches (attach) par genre.
- Séries représentatives : Knight, Arabia (desert), Pirate / PirateCrew, Saint Warrior, Fairy, Halloween, Fur (fourrure), Event Winter, Devil Wing Dress, Wind Spirit (Earthspirit)…
- Codename type : `ITEM_MALL_AVATAR_M_DEVIL_WING_DRESS` (TypeID3 = 13).
- Les avatars portent des blues propres (`MATTR_AVATAR_*`) : STR/INT/HP/MP/Attack Rate/Parry Rate/Lucky — d'où les avatars « full lucky » prisés pour l'alchimie.

### Devil Spirits (transformation)

- Codename interne : **NASRUN** (`ITEM_MALL_AVATAR_M_NASRUN`, TypeID3 = 14) — 26 items.
- **Grades** : A grade (normal, coloris standard/yellow/blue) et **S grade** (unique) — le S donne ~+5% HP/MP et +1 block ratio en plus du A (silkroadforums).
- Se **pluse** et se blute via des items dédiés (Sabakun's / Extension Gear, magic stones spéciales `ITEM_MALL_NASRUN_ARCHEMY_MAGICSTONE_*`).
- La transformation remplace le modèle du personnage (démo YouTube « Devil & Angel Spirits »).

---

## 💰 Prix et Économie

Prix NPC d'achat/vente (`Price` / `SellPrice` d'itemdata), vérifiés sur corpus v1.188 :
- Copper Sword (1D) : **890** gold achat / **427** revente (~48%).
- HP Potion (Small) : 60 / 21 (~35%).
- La revente NPC plafonne à ~35-50% selon le degré ; le prix d'achat croît avec le degré et la catégorie.

Les prix « marché » (stalls) dépendent du serveur et de la rareté (Seal, +X, blues) — voir [22_ECONOMY_GOLD.md](22_ECONOMY_GOLD.md). Les anciens tableaux de prix fixes de ce document (ex. « 13D = 1 000 000 000 gold ») étaient des **estimations non sourcées** et ont été retirés.

### Repères de marché TR modernes (RMT, 2024-2026 — recherche TR 2026-10)

- 1M gold ≈ **4,50–6,00 TL** selon le serveur (ex. Hebe ~4,50 TL/M) — vendeurs RMT turcs.
- Annonce type : « [LİDYA] 100M gold + 1 100 silk ≈ 4 900 TL » (SilkroadPazar).
- ⚠️ Ces montants sont des **taux RMT** (gold contre argent réel) sur les serveurs officiels TR encore actifs : ils situent l'échelle de valeur du gold, pas le prix d'un item. Les prix **historiques** d'items du marché TR (2006-2013) n'ont pas été retrouvés (forums d'époque inaccessibles, 403).
- Sources : https://www.klasgame.com/en/joymax/silkroad-online-joymax/silkroad-gold · https://www.kopazar.com/silkroad-online-gold · https://www.silkroadpazar.com

---

## 🔗 Resources

### Données de référence
- [Fandom — Weapons](https://silkroadonline.fandom.com/wiki/Weapons) (crit de base, boucliers, rôles des armes EU)
- [Fandom — Armor (Equipment)](https://silkroadonline.fandom.com/wiki/Armor_(Equipment)) (degrés, pièces)
- [sro-world.de.tl — Sword / Blade / Spear / Glaive / Bow / Shield / Armor / Protector / Garment / Accessory Chinese](https://sro-world.de.tl/Sword_Chinese.htm) (stats brutes par item, 1D-8D)
- [silkroadkopat.tr.gg](https://silkroadkopat.tr.gg/silkroad-armor-item.htm) (stats EU light/robe 7D-8D)
- [guildalgarb — clothes](https://guildalgarb.wordpress.com/games/sro/clothes/) (noms des sets par degré)

### Technique (émulateurs / formats)
- [openroad — textdata-itemdata.md](https://github.com/ferdoran/openroad/blob/main/docs/formats/textdata-itemdata.md) (colonnes itemdata + magicoption.txt, vérifié v1.188)
- [openroad — magicoption.rs](https://github.com/ferdoran/openroad/blob/main/client/src/assets/textdata/magicoption.rs) (mapping MATTR → noms affichés)
- [DummkopfOfHachtenduden/SilkroadDoc](https://github.com/DummkopfOfHachtenduden/SilkroadDoc/) (doc des formats PK2/DB)
- [opensro-dev/opensro](https://github.com/opensro-dev/opensro) (émulateur Go, magic options)
- Dump `_RefItem` utilisé : parse d'un export client (nBot `parse_items.txt`, 14 318 items)

### Guides alchimie / blues
- [Elitepvpers — The Way Items Work](https://www.elitepvpers.com/forum/sro-guides-templates/2545845-guide-way-items-work.html)
- [Elitepvpers — Alchemy Principals](https://www.elitepvpers.com/forum/sro-guides-templates/212591-guide-alchemy-principals.html)
- [Silkroad Forums — blues expliqués](http://www.silkroadforums.com/viewtopic.php?f=29&t=39439) (Immortal/Astral)

### Recherche multilingue (2026-10)
- [Bahamut 絲路Online 攻略百科 — noms ZH des armes/accessoires (TW)](https://wiki2.gamer.com.tw/wiki.php?n=10948:洛克山)
- [Inven — noms KR des armes, open beta 2004 (KO)](https://www.inven.co.kr/webzine/news/?news=2285)
- [TGDaily — items 10차 : 파천검 / 다크모나크 (KO)](https://www.tgdaily.co.kr/news/articleView.html?idxno=127275)
- [Klasgame — Silkroad Gold (marché RMT TR)](https://www.klasgame.com/en/joymax/silkroad-online-joymax/silkroad-gold)
- [Kopazar — Silkroad Online Gold (marché RMT TR)](https://www.kopazar.com/silkroad-online-gold)
- [SilkroadPazar — annonces items/gold TR](https://www.silkroadpazar.com)

### 🇰🇷 Officiel KSRO — tables d'items 11-13차 (recherche KO2 2026-10)
- [Armes CH 1차→13차 (stats complètes, 6 pages)](https://krsilkroadcp.joymax.com/gamedata/item/asia_item.asp) · [Armes EU 1차→13차 (9 pages)](https://krsilkroadcp.joymax.com/gamedata/item/europe_item.asp)
- [Sets 11차 + accessoires (effets 파멸 2/4/6)](https://krsilkroadcp.joymax.com/gamedata/item/set_item.asp) · [Système d'items : Lv 101 fixe 12차+, tiers 무신/투신](https://krsilkroadcp.joymax.com/gamedata/item/Iframe_item/itemsystem_1.html)
- [Item mall — devil spirits tardifs (PET/GROWTH, 55 실크)](https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?Shoptype1=PET&Shoptype2=GROWTH) · [Item mall — 보호석 12→17차 / 특수각석](https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?shoptype1=ARCHEMY&Shoptype2=ETC)
- [SroLobby — noms EN sets 17D + taux box (NON officiel)](https://www.srolobby.com/konular/silkroad-online-silkroad-box-17-degree-item-drop-rates.4434)
- Rapport : `ML_RESEARCH/RESEARCH_KO2_ITEMS.md` (§5-§7, §14-§15, §17)

---

## 📚 Voir aussi
- [08_ARMOR_TYPES.md](08_ARMOR_TYPES.md) — types d'armures, sets par degré, bonus
- [06_SEAL_EQUIPMENT.md](06_SEAL_EQUIPMENT.md) — SOS / SOM / SOSun (versions `_RARE`)
- [07_ITEM_DEGREES.md](07_ITEM_DEGREES.md) — système de degrés
- [05_ALCHEMY_SYSTEM.md](05_ALCHEMY_SYSTEM.md) — enhancement et taux
- [31_ITEMS_DATABASE.md](31_ITEMS_DATABASE.md) — hub items

---

*Dernière mise à jour: 2026-10-01*
*Sources: dump _RefItem client v1.188+ (14 318 items CH+EU 1D-13D), sro-world.de.tl, silkroadkopat.tr.gg, Fandom wiki, openroad (docs formats v1.188), SilkroadDoc, elitepvpers, Bahamut (ZH), Inven/TGDaily (KO), Klasgame/Kopazar/SilkroadPazar (marché TR) — rapports ML_RESEARCH 2026-10 ; tables officielles KSRO krsilkroadcp.joymax.com (noms KR 11-13차, tiers 무신/투신, sets 파멸, devil spirits 2026) — rapport ML_RESEARCH/RESEARCH_KO2 (2026-10)*
