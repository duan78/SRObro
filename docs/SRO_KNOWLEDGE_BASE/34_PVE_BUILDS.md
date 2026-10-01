# Builds PvE - Guide Complet

> ⚠️ **Révision majeure (2026-10)** : document réécrit après recherche communautaire (elitepvpers, SilkroadForums, PlayOrigin, GamersDecide, UnKnoWnCheaTs, ExaySRO, ZsZC wiki, IGN/MMORPG.com pour les donjons). Correction principale vs ancienne version : les rendements « 300-500 k SP/heure » étaient **absurdes** (le réel est ~1 000 SP/h en GAP 9 classique, jusqu'à 3 000+/h avec tickets — voir [26_SP_FARMING.md](26_SP_FARMING.md)) ; les noms de skills inventés (« Lunar Potion », « Meteor Shower », « Fire Force »…) sont remplacés par les vrais noms iSRO, cohérents avec [02_CHINESE_CLASSES.md](02_CHINESE_CLASSES.md) et [03_EUROPEAN_CLASSES.md](03_EUROPEAN_CLASSES.md).

## 📋 Table des Matières
- [Introduction](#-introduction)
- [Mécaniques PvE à connaître](#-mécaniques-pve-à-connaître)
- [Tier List PvE](#-tier-list-pve)
- [Builds Européens PvE](#-builds-européens-pve)
- [Builds Chinois PvE](#-builds-chinois-pve)
- [SP Farming : Builds et Rendements](#-sp-farming--builds-et-rendements)
- [Power Leveling (PLvL / Taxi)](#-power-leveling-plvl--taxi)
- [Builds par Donjon (FGW, Qin-Shi, Job Temple)](#-builds-par-donjon-fgw-qin-shi-job-temple)
- [Spots de Farming par Level](#-spots-de-farming-par-level)
- [Gear et Équipement PvE](#-gear-et-équipement-pve)
- [Gold Farming](#-gold-farming)
- [Erreurs Courantes en PvE](#-erreurs-courantes-en-pve)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Introduction

Le **PvE (Player versus Environment)** couvre le leveling, le SP farming, la chasse d'uniques et les donjons. Deux philosophies s'opposent :
- **Solo efficace** → le Chinois (pas de délai de potion, imbues, self-heal via Force) ou l'EU avec sub Cleric.
- **Vitesse pure en party 8/8** → l'Européen (Wizard AoE + Bard mana + Cleric heals) : le meilleur XP/heure du jeu.

### Points clés
- ✅ **AoE** : tuer des packs entiers > tuer un mob à la fois
- ✅ **Kill speed × volume** : le SP-exp ne dépend pas des dégâts, mais du nombre de kills
- ✅ **GAP** : l'écart niveau/masteries pilote le ratio XP→SP (GAP 9 = ~20× plus de SP par XP)
- ✅ **Mana** : un farmeur qui s'arrête pour pot est un farmeur lent (Bard/Mana Cycle, Garment, Force Combustion)
- ✅ **Noise (Bard)** : réduit l'aggro — le buff qui change tout en zone dense

---

## ⚙️ Mécaniques PvE à connaître

### XP, SP et GAP (résumé — détails dans [26_SP_FARMING.md](26_SP_FARMING.md))
- Chaque mob tué rapporte de l'XP **et** du skill-exp : **400 skill exp = 1 SP** (constante).
- **GAP = niveau du perso − mastery la plus haute** (0 à 9, plafond utile à 9) : à GAP 9 on gagne ~19-20× plus de SP par point d'XP qu'à GAP 0.
- SP cumulés (perso) : ~75 k au niveau 30 à GAP 9, ~190 k au niveau 60 à GAP 9.

### Règle des 5 niveaux
- Monter une mastery **au-delà du niveau des mobs farmés** n'apporte plus de bonus de dégâts → inutile de « sur-monter » les masteries pour PvE.

### Aggro et luring
- Le **Rogue xbow** (Fast/Rapid Shot, portée max) et le **Wizard** sont les lurers natifs ; le **Noise** du Bard réduit l'aggro de toute la party.
- Le **Warrior 1H** garde l'aggro (Taunting Target, Howling Shout) et la redistribue (Pain Quota, fences, Protect).

### Zerk (Berserk)
- La jauge se remplit en attaquant/tuant (orbes) → mode Berserk = boost temporaire. Les **DoT du Warlock accélèrent la jauge** → les « zerk farmers » alternent DoT et kills en chaîne.
- Farm « en zerk permanent » = technique classique des zones à respawn dense (Ongs, Niyas).

---

## 🏆 Tier List PvE

### Cap 80 (PlayOrigin — stuff égalisé +5/60 %)
| Rang | Build | Notes du fil |
|---|---|---|
| **S (farm/jobbing)** | **Wizard/Bard** | Meilleur XP/h en party, mobilité, Noise |
| **S (solo)** | **INT Spear Nuker** | Solo grinder par excellence, one-shot les mobs |
| **A** | Glaive STR (spin) | Tank AoE autonome, zerk farming |
| **A** | Wizard/Cleric | Polyvalent solo/party |
| **B** | Rogue/Bard (xbow), Bower STR | Rapides mais mono-cible |
| **B** | Warrior/Cleric | Tank incrusable mais lent en solo |

Source : [80 Cap Tier List (PlayOrigin)](https://forum.playorigin.com/showthread.php?1050-80-Cap-Tier-List-for-1v1-PvP-Job-Party-PvP-(Ctf-BA)-and-PvE).

### Consensus général (GamersDecide / Reddit)
- **Le + recommandé pour farm solo** : **sword nuker, Warlock/Bard, Wizard/Bard** (conclusions du [guide Reddit returning players](https://www.reddit.com/r/silkroadonline/comments/1wfn2h6/for_anyone_new_or_returning_to_silkroad_i_put/)).
- **Le + demandé en party** : Cleric, Bard, Wizard (AoE), Warrior (tank).
- **Meilleur unique hunter solo** : Bower STR (kite le boss), Glaive STR (le tank).

---

## 🇪🇺 Builds Européens PvE

### 1. Wizard/Bard — Le Roi du Farm en Party 👑

**Le build d'XP/heure par excellence** (farm 8/8, plvl, Alexandria). Full INT, Robe (ou Light si stuff hybride), staff + harpe.

**Outils Wizard** (détail : [03_EUROPEAN_CLASSES.md](03_EUROPEAN_CLASSES.md#3-wizard)) :
- **Meteor** (le + gros nuke, 3 cibles proches), **Earth Shock → Earth Quake** (AoE), **Blizzard / Snow Wind** (AoE + frostbite), **Chain Lightning**, **Charged Wind/Squall** (5 hits, 80 % knockback — **repousse les mobs vers le centre de la zone de kill**), Fire Blow/Salamander Blow (mono/burst).
- **Root/Mesh Root** pour les élites, **Earth Barrier/Fence** (absorption), passifs Natural Spirit (+ % MAG), Magic Bound (portée).

**Outils Bard** :
- **Mana Cycle → Mana Orbit** : la batterie de mana (rend MP en continu — cible unique puis groupe).
- **Noise** : réduit l'aggro — **à garder actif en permanence**.
- **Moving/Swing March** (vitesse), **Guard/Mana Tambour** (+DEF PHY/MAG), **Dance of Magic/Wizardry** (+dégâts MAG groupe), Cure Music, Temptation (charme).

**Boucle de farm type** :
```
1. Noise + marches + tambour actifs ; Mana Cycle sur les Wizards (puis Clerics)
2. Le lurer (Rogue xbow ou un Wizard) ramène le pack
3. Charged Squall repousse les mobs au centre → Meteor → Earth Quake → Blizzard
4. Dance of Wizardry pour les géants ; pickup au grab pet ; repeat
```
⚠️ Fragile en solo (pot delay) : c'est un build de party. Solo → prendre Cleric en sub.

### 2. Wizard/Cleric — Le Polyvalent Solo/Party 🔮

Mêmes nukes, mais **Light Armor + heals** : le meilleur compromis pour joueur solo qui veut aussi party. **C'est LE build de plvler** (voir [Power Leveling](#-power-leveling-plvl--taxi)) : un Wiz/Cleric 80+ peut tenir une party 8/8 d'Ongs à lui seul (nukes AoE + heals).

### 3. Warrior/Cleric 1H — Le Tank de Dungeon 🛡️

- **Taunting Target / Howling Shout** (aggro), **Pain Quota** sur les Clerics, **fences** sur les lurers, **Protect** sur les Wizards, Iron/Mana Skin.
- Indispensable à partir d'Alexandria/Job Temple : « le tank ultime, auto-suffisant ».
- En solo c'est **lent** (peu d'AoE vs Wizard) mais **incrurable** — bon pour farner les zones dangereuses.

### 4. Rogue — Le Lurer et le Chasseur 🏹

- **Rogue/Bard (xbow)** : vitesse + mana → lurer et farm ; le Rogue niveau 10 suffit déjà pour le rôle de lurer en party (Rapid Shot).
- **Rogue/Cleric (dague)** : burst sur les géants/uniques (Prick, Mortal Wounds) mais mono-cible — moyen en farm de masse.

### 5. Warlock en sub ou 2e mastery 🧿

- **Division (Courage Raze)** sur les géants/PTG : +30 % dégâts subis pour toute la party.
- DoT AoE sur les packs ( Blaze/Toxin/Decayed ) qui **remontent la jauge de zerk** du groupe.
- Warlock/Bard : cité parmi les meilleurs solos PvE par le guide Reddit.

### 6. Bard/Cleric — Le Support Total 🎵

Toujours recruté (buffs + heals + rez) mais **ne farm pas seul**. Multicompte typique : un Bard/Cleric suit le farmeur.

### 7. Tri-build Wiz 108 / Warrior 10 / Cleric 102 (cap 110)
Optimisé « tout-terrain » : nukes complets + utilitaire Warrior (Earth Fence via les 10 premiers rangs, interrupts) + Cleric entier. Voir [03_EUROPEAN_CLASSES.md](03_EUROPEAN_CLASSES.md#-builds-populaires-européens).

---

## 🇨🇳 Builds Chinois PvE

### 1. Full STR Glaive — Le Farmeur Autonome 🔥

**Le meilleur farmeur solo CH** (~80 k SP au cap 80 — le moins cher des builds CH) :
- **Spin permanent** : **Storm Series** (Bloody Fan Storm…) transforme l'attaque de base en tourbillon AoE → on agro 10-20 mobs et on les découpe.
- **Ghost Spear Attack Series** (AoE tournoyante), Chain Spear (multi-hits), Soul Departs Spear (stun) pour les élites.
- Passif **Cheolsam Force** (+HP) + **Flame Body** (+ % ATK PHY) + **Fire Protection** (+DEF MAG) ; variante Cold 20 pour **Snow Shield**.
- **Armor** : HP/DEF max pour tanker les packs.
- Variantes masteries et SP exacts : voir [33_PVP_BUILDS.md](33_PVP_BUILDS.md#1-full-str-glaive--le-tank-à-dégâts-) (les mêmes builds servent au PvE).

### 2. INT Nuker (Spear / S-S / Bow) — Le Tueur à Distance 📈

- **PvE le plus rapide en solo CH** : imbue Fire (Burn finit les mobs) + nukes **Flame Wave** (Fire) / **Thunderbolt Force** (Lightning) — 2-3 nukes par mob, jamais touché.
- **S/S nuker (Bicheon + Lightning + Cold)** : bouclier + Snow Shield = le nuker « safe » ; **Cold Wave** en opener (ralentit) puis nukes Lightning (guide [Serafelle/ExaySRO](https://forum.exaysro.com/printthread.php?tid=1039)).
- **Bow nuker** : portée max + Soul Arrow, kitabilité maximale.
- Faiblesse : le pool de mobs « géants » et les zones très denses où l'aggro multipliée tue un INT.

### 3. Full STR Bow — Le Kiter/Kite Farmer 🏹

- Anti Devil Bow (crit) + imbue Fire (burn pendant le kite) : excellent **unique hunter** et jobber ; plus lent en farm de masse. ~90-100 k SP au cap 80.
- Build leveling ZsZC : Pacheon 90 / Fire 90 / Lightning 90 ; build crit : Pacheon 105 / Fire 105 / Cold 100.

### 4. Hybrides et Force support ⚖️

- **Hybrid spear 4:1** (guide Kerelious) : nukes + coups PHY → très bon farmer solo polyvalent (SP : ~105 k à 42, ~170 k à 60, ~312 k à 72).
- **Force hybrid (arme + Force + Cold/Fire)** : heal/rez/cure en party (job parties, FW), économise les potions en farm — les Vital Spot (Decay/Weaken/Impotent/Division) accélèrent aussi les géants.

---

## 📚 SP Farming : Builds et Rendements

> Le guide complet (GAP, tableaux, spots, méthode PLvL) est dans **[26_SP_FARMING.md](26_SP_FARMING.md)** — cette section ne couvre que les **builds**.

### Les builds SP farmers de référence
| Build | Pourquoi c'est le bon build pour farmer | Référence |
|---|---|---|
| **Glaive STR (spin)** | Agro massif + AoE permanente + pas de pots HP grâce à l'armor ; tourne sans downtime | Elitepvpers 516942 |
| **Nuker INT (bow/spear)** | Kill rapide à distance : maximise les kills/h (le SP dépend du volume) | Reddit/Guides |
| **Wizard (party plvl)** | Le plvler type : AoE decimate une party 8/8 d'Ongs | Elitepvpers 2461754 |
| **Bow STR** | Farm à GAP 9 possible dès le niveau 5+ selon les joueurs | [Reddit 6j0klc](https://www.reddit.com/r/silkroadonline/comments/6j0klc/just_came_back_to_sro_got_some_questions_about_sp) |

### Rendements réels (corrigés)
- **~1 000 SP/h** en méthode classique (party 8/8 + plvler, GAP 9, Ongs) ; **3 000+ SP/h** avec tickets ST/PT sur les serveurs qui en proposent ; ~**10 k SP/jour** en session longue (KB 26).
- Le guide [Ultimate Ong Farming (Elitepvpers)](https://www.elitepvpers.com/forum/sro-guides-templates/2127736-silkroad-ulitmate-ong-farming-guide-updated-2012-a.html) revendique **50 k+ SP/jour** « si fait correctement » (haut de fourchette, à prendre avec prudence).
- Paliers utiles : viser **20-30 k SP** pendant la fenêtre 13-32 (bandits puis Ongs) ; ~**90-100 k SP** pour un build CH complet au cap 80 (glaive) ; **1,9-2,5 M** pour 3 masteries au cap 110 (elitepvpers 516942).

### La fenêtre classique (rappel KB 26)
| Niveaux | GAP | Spots |
|---|---|---|
| 1-13 | 0-5 | Quêtes, bandits léger |
| **13-32** | **9** | Bandits (13-17) puis **Ongs/Sonars (31-34, Karakoram)** — meilleur ratio du jeu |
| 32-45 | 5-9 | Sonars/Ongs, Bunwangs/Mujigis |
| 45-60 | 5-9 | Penon (26-28) / Niyas |
| 60-80 | 9 (+plvl) | **Niyas du Taklamakan** en 8/8 |

---

## 🚀 Power Leveling (PLvL / Taxi)

**Principe** : un haut niveau (le « plvler », typiquement **Wizard/Cleric 80+**) tue en masse pendant que la party « passengers » récolte l'XP partagée (party EXP auto-share).

- **Méthode 8/8 + Ongs** (guide [How to farm SP — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/2461754-guide-how-farm-sp-skillpoints.html)) : c'est LA méthode historique de SP farming.
- **Taxi payants** : spots « wings » (Jangan/Hotan), tarifs en gold selon serveur ; le plvl payant a longtemps été un business sur officiels.
- ⚠️ L'« afk complet » n'existe pas : il faut au moins rejoindre la party et rester à portée ; certains serveurs imposent une activité.

**Builds concernés** :
- **Plvler** : Wizard/Cleric (AoE + heals) de loin le plus efficace ; glaive STR spin possible.
- **Passenger** : n'importe quel build — c'est la phase idéale pour GAP 9 (monter les masteries après).

---

## 🏛️ Builds par Donjon (FGW, Qin-Shi, Job Temple)

### Forgotten World (FGW) — les 6 ailes
> Détails complets : [29_FORGOTTEN_WORLD.md](29_FORGOTTEN_WORLD.md). Chaque aile = tranche de niveau + collection de **8 talismans** → récompenses (armes FGW du degré correspondant).

| Aile | Niveaux | Degré | Party type |
|---|---|---|---|
| Togui Village | 51-60 | 8D | Party mixte 8, AoE utile |
| Flame Mountain | 61-70 | 9D | Party 8 + lurer |
| Green Abyss | 71-80 | 10D | Party 8 EU classique |
| Sea of Resentment | 81-90 | 11D | EU 8/8 (war/cler/wiz/bard) |
| Shipwreck Dimension | 91-100 | 12D | EU 8/8 + burst |
| Temple of Egypt | 101-110 | 13D | EU 8/8 opti + Warlock (Division) |

**Builds FGW** : la party EU standard (1 War 1H, 2 Clerics, 1 Bard, 3-4 Wizards, ± Warlock) ; côté CH, glaive STR (tank/AoE) + nukers + force hybrid (cure/rez — les statuts ne se pilulent pas). Le **Rogue xbow** lure efficacement les chambres.

### Qin-Shi Tomb (Jangan Cave) — le donjon 70+
> Uniques détaillés dans [15_UNIQUE_BOSSES.md](15_UNIQUE_BOSSES.md#-uniques-du-qin-shi-tomb-medusa).

- 6 étages (B1-B6), mobs 71+ jusqu'aux **Gardiens 98-99, Shinmoo/Soso 100**, boss final **BeakYung the White Viper « Medusa » (105, B6)**.
- **Tout aggro** (« everything attacks » — [MMORPG.com](https://www.mmorpg.com/general-articles/exploring-the-tomb-of-the-qin-shi-emperor-2000116769)) : party quasi obligatoire, guide [IGN Qin-Shi Guidebook](https://www.ign.com/articles/2009/04/07/the-qin-shi-tomb-silkroad-guidebook-58).
- **Builds** : party CH forte (glaive front + nukers + force) ou EU 8/8 ; le **stun/knockdown** aide beaucoup sur les serpents/généraux.

### Job Temple (Alexandrie sud) — le PvPvE 105+
> Uniques : Apis 103, Selket 105, Neith 106, Anubis 107, Isis 108, Haroeris 109, Seth 110 — accès selon les **Activity Points (AP)** de l'union de job, **costume de job obligatoire** ([15_UNIQUE_BOSSES.md](15_UNIQUE_BOSSES.md#-uniques-du-job-temple-alexandrie)).

- PvPvE : on farm les chambres en costume de job — les autres unions aussi. Prévoir du PvP.
- **Builds** : parties EU 8/8 optimisées (war/cler ×2/bard/wiz) OU parties CH de guild ; Warlock très utile (Division sur les uniques) ; les drops incluent items Egypt 11D.

### Roc Mountain / raids
- **Roc (100)** : HP ~1,45 milliard — **raid de guilde multi-parties** avec shot-caller ; Demon Shaitan (90) pour parties fortes.
- **Builds raid** : 2-3 parties + tanks dédiés + Clerics par party + un appel pour les rez.

---

## 🗺️ Spots de Farming par Level

> Tableau de synthèse aligné sur [25_LEVELING_GUIDE.md](25_LEVELING_GUIDE.md) et [26_SP_FARMING.md](26_SP_FARMING.md) — la version détaillée (coordonnées, mobs) y figure.

| Niveaux | Zone | Mobs clés | Build conseillé |
|---|---|---|---|
| 1-13 | Jangan ouest | Yeoha, Mangyang | Tout (quêtes) |
| 13-17 | Bandit Stronghold | Bandits 10-17 | Nuker, bow (GAP 9) |
| **16-32** | **Habitat des Ongs (Karakoram)** | **Ongs/Blood Ongs 33-34** | **Party plvl ou glaive spin** (SP farming) |
| 24-28 | Penon Castle | Penon Fighters | Party mixte |
| 31-32 | Plaines de Samarkand | Sonars | Suite des Ongs |
| 32-45 | Bunwangs/Mujigis | — | Nuker/glaive |
| 62-80 | **Ruines Niya (Taklamakan)** | Niya Soldiers→Royals | **Party 8/8 + plvl (SP)** |
| 70+ | Qin-Shi Tomb | Tomb mobs/uniques | Party 8 |
| 80-90 | Roc Mountain | Demons | Party forte |
| 90-100 | Alexandria ouest/est | Mobs Egypte | Wiz/Bard 8/8 |
| 100-110 | Egypt/FGW Temple/Job Temple | Egypt mobs | EU 8/8 opti |
| 105-110 | Job Temple | Uniques égyptiens | Guild PvPvE |

> ⚠️ Correction vs ancienne version : les « Ongs niveau 45-55 à Bandit Stronghold » étaient faux — les Ongs sont **niveaux 33-34 au Karakoram** et Bandit Stronghold héberge des bandits **10-17** (déjà corrigé dans KB 26).

---

## 🛡️ Gear et Équipement PvE

### Priorités par famille
| Famille | Priorités |
|---|---|
| **INT (nukers, Wizard)** | MAG ATK → MP (pool + regen) → MAG DEF → attack rating (pas de miss) → HP minimal |
| **STR (glaive, blader, warrior)** | PHY ATK → HP → PHY DEF → attack rating → crit (rogue/bow/blader) |
| **Support (Bard/Cleric)** | Survie (HP/DEF) → MP → rien d'autre : vous ne tuez pas |

### Armures (voir [08_ARMOR_TYPES.md](08_ARMOR_TYPES.md))
| Build | Armure | Pourquoi |
|---|---|---|
| Nuker INT / Wizard | **Garment** | +20 % vitesse (kite/farm), −20 % coût MP, MAG DEF |
| Glaive/Blader STR | **Armor** | HP/DEF PHY pour tanker les packs |
| Hybrides | Protector | Équilibré, −10 % MP |
| Warrior/Cleric | Heavy (ou Light) | Tank |
| Wizard/Cleric | Light Armor | Défenses mixtes en solo |

### Armes et degrés
- Un **SoS du bon degré suffit largement en PvE** (+3 à +5) ; le SoM/SoSun et les + élevés sont un confort PvP (voir [06_SEAL_EQUIPMENT.md](06_SEAL_EQUIPMENT.md), [07_ITEM_DEGREES.md](07_ITEM_DEGREES.md)).
- Exemples de gear de farm cité par les guides : spear 64 +5 avec blues (GameFAQs), protector +8/60 % pour du dungeon cap 90 (Seidenkraft).

### Outils de farm
- **Grab pet** : ramasse automatiquement — le premier achat rentable d'un farmeur ([24_MOUNTS_PETS.md](24_MOUNTS_PETS.md)).
- **Fellow pet** : bonus passifs/actifs selon le pet.
- **Potions MP en masse** (CH), **Mana Cycle** (Bard), **Fire Combustion** (CH Fire, MP sur cd 180 s) : le downtime mana est le vrai frein.
- **Avatars** : cosmétique uniquement.

---

## 💰 Gold Farming

1. **Farm de mobs + drops** : gold brut, éléments d'alchimie (eld/dis/elements à revendre), SOX revente.
2. **Uniques** : Tiger Girl, Uruchi, Isyutaru, Demon Shaitan… → SOX du degré correspondant ([15_UNIQUE_BOSSES.md](15_UNIQUE_BOSSES.md)).
3. **FGW** : talismans + récompenses de collection (armes FGW très valorisées).
4. **Job Temple** : coins/uniques → items Egypt.
5. **Job system** : trade runs (trader), thieving (vol), hunter (escorte) — voir [HUB_JOBS.md](HUB_JOBS.md).
6. **Stall network** : buy low/sell high (voir [23_STALL_NETWORK.md](23_STALL_NETWORK.md)).

---

## ⚠️ Erreurs Courantes en PvE

1. **Disperser les masteries** (l'erreur n°1 — [Nostalgic.gg](https://nostalgic.gg/en/blog/silkroad-online-beginners-guide-en)) : 2-3 masteries max, pas 5.
2. **Gasper l'alchimie sur du stuff temporaire** : immortal/lucky se gardent pour le set final.
3. **Farmer à GAP 0 puis manquer de SP au cap** : planifier le GAP dès le niveau 13 ([26_SP_FARMING.md](26_SP_FARMING.md)).
4. **Maxer tous les skills** : le wiki Fandom le déconseille formellement — monter les séries utiles, pas tout.
5. **Jouer l'EU en solo sans sub Cleric/Bard** : le pot delay 15 s rend le solo EU pénible.
6. **Négliger Noise/Mana Cycle en party** : sans mana, le Wizard n'est qu'un décor.
7. **Over-master pour PvE** : au-delà du niveau des mobs, la mastery n'apporte plus rien (règle des 5 niveaux).
8. **Aller au Qin-Shi/Job Temple sans party** : donjons pensés pour 8 joueurs.
9. **Ignorer le job system** : c'est une source de revenus ET de gameplay ([Nostalgic.gg](https://nostalgic.gg/en/blog/silkroad-online-beginners-guide-en)).

---

## ❓ FAQ

**Q : Quel est le meilleur build pour leveler solo ?**
R : **INT Nuker** (spear ou S/S) côté CH ; **Wizard/Cleric** côté EU. Pour le farm d'XP pur en party, rien ne bat **Wizard/Bard + party 8/8**.

**Q : Combien de SP faut-il prévoir ?**
R : ~20-30 k pendant la fenêtre Ongs ; ~80-100 k pour un build CH complet au cap 80 ; jusqu'à **1,9-2,5 M** pour 3 masteries au cap 110 (selon variante — [33_PVP_BUILDS.md](33_PVP_BUILDS.md#1-full-str-glaive--le-tank-à-dégâts-)).

**Q : GAP 9 ou GAP 0 ?**
R : GAP 9 pour stocker des SP (XP ralenti), GAP 0 pour rusher le niveau. Le compromis classique : GAP 9 aux paliers 13-32 et 60-80, GAP léger (0-5) entre.

**Q : Le Warrior/Cleric est-il bon pour farmer ?**
R : C'est le **plus safe et le plus lent**. Excellent en dungeon/job temple, moyen en XP/heure solo.

**Q : Quelle armure pour un nuker ?**
R : **Garment** (vitesse + MP + MAG DEF) — sauf le S/S nuker qui peut préférer Protector selon le stuff.

**Q : Peut-on SP farmer en party ?**
R : Oui — la méthode 8/8 + plvler est justement LA méthode de référence (le volume de kills compense le partage).

**Q : C'est quoi un « plvler » ?**
R : Le haut niveau (souvent Wizard/Cleric) qui tue pour la party — voir [Power Leveling](#-power-leveling-plvl--taxi).

**Q : Que faire à_stuff égal pour accélérer le farm ?**
R : Grab pet, potions MP en volume, Noise/Mana Cycle, tuer **vite et beaucoup** (le SP dépend des kills, pas des dégâts), zerk sur les orbes.

---

## 🔗 Resources

### Guides PvE et farm
- [80 Cap Tier List (PvE inclus) — PlayOrigin](https://forum.playorigin.com/showthread.php?1050-80-Cap-Tier-List-for-1v1-PvP-Job-Party-PvP-(Ctf-BA)-and-PvE)
- [Top 10 SilkRoad Best Builds — GamersDecide](https://www.gamersdecide.com/articles/silkroad-best-builds)
- [Full European Character Guide — Reddit r/silkroadonline](https://www.reddit.com/r/silkroadonline/comments/1wfn2h6/for_anyone_new_or_returning_to_silkroad_i_put/)
- [The Full Wizard/Bard Guide — SilkroadForums](http://www.silkroadforums.com/viewtopic.php?f=5&t=100199)
- [Nuker Build Sword/Shield — Serafelle (ExaySRO)](https://forum.exaysro.com/printthread.php?tid=1039)
- [Silkroad Online Beginner's Guide — Fandom Wiki](https://silkroadonline.fandom.com/wiki/Beginner%27s_Guide)
- [Silkroad Online Beginner's Guide 2026 — Nostalgic.gg](https://nostalgic.gg/en/blog/silkroad-online-beginners-guide-en)

### SP farming / PLvL
- [How to farm SP (Skill Points) — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/2461754-guide-how-farm-sp-skillpoints.html)
- [Silkroad Ultimate Ong Farming Guide — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/2127736-silkroad-ulitmate-ong-farming-guide-updated-2012-a.html)
- [Masteries and SP Farming — UnKnoWnCheaTs Wiki](https://www.unknowncheats.me/wiki/Silkroad:Masteries_and_SP_Farming)
- [Questions SP farming — Reddit](https://www.reddit.com/r/silkroadonline/comments/6j0klc/just_came_back_to_sro_got_some_questions_about_sp/)
- Interne : [26_SP_FARMING.md](26_SP_FARMING.md), [25_LEVELING_GUIDE.md](25_LEVELING_GUIDE.md)

### Donjons
- [Forgotten World — Fandom Wiki](https://silkroadonline.fandom.com/wiki/Forgotten_World) et interne [29_FORGOTTEN_WORLD.md](29_FORGOTTEN_WORLD.md)
- [The Qin Shi Tomb: Silkroad Guidebook #58 — IGN](https://www.ign.com/articles/2009/04/07/the-qin-shi-tomb-silkroad-guidebook-58)
- [Exploring the Tomb of the Qin-Shi Emperor — MMORPG.com](https://www.mmorpg.com/general-articles/exploring-the-tomb-of-the-qin-shi-emperor-2000116769)
- [Tomb Qin-Shi Uniques — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/259810-guide-tomb-qin-shi-uniques.html)
- [Job Temple Unique Guide — ExaySRO](https://forum.exaysro.com/showthread.php?tid=3875) et interne [15_UNIQUE_BOSSES.md](15_UNIQUE_BOSSES.md)
- [A complete guide to great partying — HX Community](http://hx-community.net/index.php?page=Thread&postID=8187) et [Party Guide — SRO Valkyria](http://srovalkyria.blog.fc2.com/blog-entry-2.html)

---

*Dernière mise à jour : 2026-10-01 (révision majeure : rendements SP réalistes, noms iSRO, donjons sourcés, suppression des données fabriquées)*
*Sources : Elitepvpers, SilkroadForums, PlayOrigin, GamersDecide, UnKnoWnCheaTs, ExaySRO, ZsZC Wiki, IGN, MMORPG.com, Fandom Wiki, Nostalgic.gg, Reddit r/silkroadonline.*
