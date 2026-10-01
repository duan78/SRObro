# Leveling Guide

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Courbe d'XP Officielle (leveldata.txt)](#-courbe-dxp-officielle-leveldatatxt)
- [XP par Monstre selon l'Écart de Niveau](#-xp-par-monstre-selon-lécart-de-niveau)
- [Parties et Bonus d'EXP](#-parties-et-bonus-dexp)
- [Buffs d'EXP (Premium, Scrolls, Academy)](#-buffs-dexp-premium-scrolls-academy)
- [Pénalité de Mort](#-pénalité-de-mort)
- [Level 1-20: Jangan](#-level-1-20-jangan)
- [Level 20-40: Donwhang et Karakoram](#-level-20-40-donwhang-et-karakoram)
- [Level 40-60: Hotan](#-level-40-60-hotan)
- [Level 60-80: Taklamakan](#-level-60-80-taklamakan)
- [Level 70-100: Roc Mountain et Tombe de Qin-Shi](#-level-70-100-roc-mountain-et-tombe-de-qin-shi)
- [Level 90-120: Alexandrie et Job Temple](#-level-90-120-alexandrie-et-job-temple)
- [Power Leveling (PLvL)](#-power-leveling-plvl)
- [Questing vs Grinding](#-questing-vs-grinding)
- [Tips](#-tips)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 📈 Vue d'Ensemble

Le **leveling** dans Silkroad Online va du niveau 1 au cap de l'époque (90/110/120 selon la version, jusqu'à 140 en 2018). C'est un jeu de **grinding** : la courbe d'XP devient vertigineuse après le niveau 90.

### Points Clés
- ✅ **XP par monstre:** bonus maximal quand le monstre a ~9-10 niveaux de plus que vous
- ✅ **Party:** jusqu'à 8 joueurs en mode EXP auto-share, ~+3% EXP/SP par membre
- ✅ **Quêtes:** prépondérantes 1-60, complémentaires ensuite, « quest farming » illimité à Alexandrie (100+)
- ✅ **PLvL:** le power leveling par party à 8 est la méthode classique d'accélération
- ✅ **Temps réel:** 6-12+ mois pour le cap sur officiel 1x ; des milliards d'XP par niveau au-delà de 100

---

## 📊 Courbe d'XP Officielle (leveldata.txt)

> ✅ **Source de confiance maximale** : fichier `leveldata.txt` extrait du client officiel, présent dans ce dépôt : `assets/pk2_media/server_dep/silkroad/textdata/leveldata.txt` (colonne 2 = XP requise pour passer au niveau suivant).

| Niveau | XP pour le niveau suivant | XP cumulée totale |
|-------:|--------------------------:|------------------:|
| 1 | 118 | 118 |
| 5 | 2 938 | 6 464 |
| 10 | 23 500 | 75 790 |
| 15 | 72 027 | 329 100 |
| 20 | 158 223 | 926 791 |
| 25 | 369 518 | 2 286 397 |
| 30 | 817 843 | 5 349 110 |
| 35 | 1 547 561 | 11 459 316 |
| 40 | 2 838 466 | 22 781 169 |
| 45 | 5 135 145 | 43 250 156 |
| 50 | 9 250 434 | 80 354 865 |
| 55 | 15 888 036 | 145 376 916 |
| 60 | 26 033 499 | 253 350 695 |
| 65 | 43 996 797 | 431 608 854 |
| 70 | 74 122 183 | 739 268 907 |
| 75 | 97 915 971 | 1 184 488 559 |
| 80 | 122 089 981 | 1 747 314 912 |
| 85 | 153 600 751 | 2 450 934 602 |
| 90 | 200 532 065 | 3 349 478 648 |
| 95 | 447 534 128 | 4 937 526 567 |
| 100 | 1 251 354 682 | 9 310 191 858 |
| 105 | 2 352 865 342 | 18 714 072 184 |
| 110 | 3 909 314 772 | 34 939 576 562 |
| 115 | 7 266 675 603 | 63 853 404 257 |
| 120 | 13 635 374 713 | 118 117 605 097 |
| 125 | 14 935 196 590 | 189 670 517 124 |
| 130 | 31 468 927 009 | 292 591 147 198 |
| 135 | 3 519 948 937 298 | 6 101 014 691 314 |
| 140 | 578 982 029 973 906 | 1 023 699 689 565 472 |

### Lecture de la Courbe
- **1-30 :** rapide — les quêtes couvrent une grosse fraction de chaque niveau
- **30-60 :** grinding sérieux, ~500k à 26M XP par niveau
- **60-90 :** l'ère « classique » du farm en party (260M XP cumulées au lvl 90)
- **90-120 :** mur exponentiel — **9,3 milliards d'XP cumulées au lvl 100**, **118 milliards au lvl 120**
- **Au-delà de 130 :** murs intentionnels (Joymax a rendu les niveaux 135+ pratiquement inatteignables — 579 mille milliards d'XP pour 139→140)
- Repère communauté : à ~138M XP/heure (très bon rythme officiel boosté), le niveau 139 représente **~35 mois de grinding** — d'où l'importance des rates et scrolls

---

## 🎯 XP par Monstre selon l'Écart de Niveau

Mécanique documentée par Silkroad Origin (update « Adjusting The Mechanism To Receive Exp & Esp », sept. 2025), cohérente avec le comportement du client classique. **Deux règles à retenir :**

### Monstre PLUS FAIBLE que vous (pénalité)
| Écart (vous − monstre) | Malus EXP solo |
|:---:|:---:|
| 0 à 3 | 0% |
| 4 | −15% |
| 5 | −30% |
| 6 | −45% |
| 7 | −60% |
| 8 | −75% |
| 9 | −90% |
| 10+ | **−99% (quasi zéro)** |

### Monstre PLUS FORT que vous (bonus)
| Écart (monstre − vous) | Bonus EXP solo |
|:---:|:---:|
| 1 | +3% |
| 5 | +15% |
| **10** | **+30% (maximum)** |
| 15 | +15% |
| 20+ | 0% |

- Le bonus culmine à **+10 niveaux d'écart** puis redescend — c'est l'origine de la « règle des 5-10 niveaux » communautaire
- En party (mode partage de points actif, rayon ~200 m), les malus/bonus sont amplifiés (ex. écart +10 en party de 6 : +100%)
- ⚠️ Les monstres « gris » (10+ niveaux en dessous) ne donnent **plus rien** — ne restez jamais sur des mobs trop bas

---

## 👥 Parties et Bonus d'EXP

### Modes de distribution
| Mode | Fonctionnement | Particularités |
|------|----------------|----------------|
| **EXP Auto Share** | L'EXP/SP de chaque kill est **partagé** entre les membres | Seul mode permettant **8 joueurs** ; membres proches obligatoires ; meilleur bonus |
| **Free For All (Item Each)** | Chacun garde l'EXP de ses propres kills | Bonus moindre, pas de contrainte de distance |
| **Item Auto Share** | Le butin est réparti | Combinable avec auto-share |

### Bonus par membre
- **+3% EXP/SP par membre additionnel** (party de 4 = +9%) — source : threads silkroadforums/elitepvpers, confiance 4/5
- L'EXP auto-share répartit les kills de tous : c'est ce qui rend les « 8/8 parties » si efficaces

---

## 🧪 Buffs d'EXP (Premium, Scrolls, Academy)

Ces bonus **s'additionnent** :

| Buff | Effet | Source |
|------|-------|--------|
| **Premium (Plus)** | Bonus EXP/SP permanent pendant la durée | Item mall — quasi indispensable sur officiel |
| **Scrolls d'EXP** | +20% à +100%+ selon l'événement/serveur | Item mall, événements |
| **Academy (grantee)** | Le « filleul » d'une académie gagne un buff : ~10 points consommés par kill → **+10% XP par kill** ; jusqu'à ~+45% au lvl 40 selon les versions | Système d'académie (guide Fdherg 2010) |
| **Événements serveur** | Week-ends ×2/×3 XP, Express/Return scrolls | Officiels et privés |

> 💡 Sur iSRO, les scrolls d'EXP étaient si efficaces que les parties de leveling sérieuses les **exigeaient**.

---

## 💀 Pénalité de Mort

- **Perte d'EXP : ~2% de la barre de niveau** par mort (analyse du code client par florian0, 2016) — on peut **re-descendre de niveau** si la barre est basse
- **Perte d'items au sol :**
  | PK Penalty Points | Chance de drop d'un item |
  |---:|---:|
  | 0 | 5% |
  | 1-3 999 | 30% |
  | 4 000-14 999 | 50% |
  | 15 000-29 999 | 70% |
  | 30 000+ | 100% |
- Les items **équipés** ne peuvent tomber qu'avec des PK points (armes/boucliers exclus) ; les items de quête/event/item mall ne tombent jamais
- ⚠️ Pas d'item standard de « restauration d'XP » — la mort coûte cher à haut niveau (2% de 13,6 milliards au lvl 120 !)
- Les Scrolls of Skill/Stat Restore servent à la **respec**, pas à restaurer l'XP

---

## 🌱 Level 1-20: Jangan

### Zones et monstres (vérifiés)
| Niveau | Cible | Zone |
|-------:|-------|------|
| 1-5 | Mangyangs, Weasels, Small/Big Eye Ghosts | Abords de Jangan (portes Est/Sud) |
| 5-8 | Water Ghosts / Water Slaves (lvl 5-7) | Nord-Est de Jangan |
| 7-10 | Stone Ghosts, Broken Stone Ghosts, Yeohas | Ch'in Tomb / Jaeun Temple (ouest) |
| 10-13 | Bandit Archers / Bandits | Bijeokdan (camp militaire, château des bandits) |
| 13-17 | Tigers, Young Tigers, Champions, Bandit Bowmen | Plaines de Jangan |
| 15-18 | White Tigers, Black Tigers | Nord de Jangan / grotte de Jangan |

### Stratégie
- **Faites TOUTES les quêtes** (voir [16_QUEST_SYSTEM.md](16_QUEST_SYSTEM.md)) : ~22 quêtes = presque 2 niveaux gratuits + arme lv10 + cheval + 10 slots d'inventaire
- Le premier SP farming léger peut commencer vers le lvl 13-16 (GAP 5-9 sur les bandits) — voir [26_SP_FARMING.md](26_SP_FARMING.md)

---

## 🌿 Level 20-40: Donwhang et Karakoram

### Zones et monstres (vérifiés)
| Niveau | Cible | Zone |
|-------:|-------|------|
| 19-21 | Chakjis, Ghost Bugs, Hyungno Ghosts | Ferry de l'Ouest / abords de Donwhang |
| 21-25 | Hyungno Ghost Soldiers, Demon Horses | Plaines de Donwhang |
| 26-28 | **Penon Fighters/Soldiers/Warriors** | Penon Castle (route Donwhang→Hotan) |
| 27-30 | Earth Ghosts / Earth Taoists | Grotte de Donwhang (entrée) |
| 31-32 | **Sonars** | Karakoram (avant Samarkand) |
| 33-34 | **Ongs / Blood Ongs** | Habitat des Ongs, Karakoram (près de Samarkand) |
| 36-40 | Black Robbers (Archers, Bowmen) | Karakoram profond |

> 🏛️ **Samarkand** est la ville de la région du Karakoram, sur la route Donwhang→Hotan. Les **Ongs (lvl 33-34)** sont LE spot de SP farming classique du jeu.

### Stratégie
- Les quêtes de Donwhang (19-40) sont très rentables (112k-600k EXP chacune) — faites la chaîne de la flûte au lvl 35 (320k EXP / 187k sxp)
- **Période critique de SP farming** : GAP 9 sur les Ongs/Sonars (char lvl 16-32) — la majorité des personnages « full farmed » sont construits ici
- Les trades 1-2 étoiles Jangan↔Donwhang rapportent or + job XP

---

## 🌳 Level 40-60: Hotan

### Zones et monstres (vérifiés)
| Niveau | Cible | Zone |
|-------:|-------|------|
| 41-45 | Hyeongcheons, Red Scorpions | Région du ferry Tarim |
| 45-48 | Small Bunwangs / Bunwangs | Oasis Kingdom (autour de Hotan) |
| 46-50 | Ultra Blood Devils | Environs de Hotan |
| 48-50 | Golden/White Spiders | Sud de Hotan |
| 49-51 | **Mujigis** (agressifs la NUIT) | Plaines de Hotan |
| 51-53 | Ishades / Hashades | Roc Mountain (pied) |
| 53-55 | White Face/Big White Spiders | Sud profond |
| 59-60 | Yetis | Montagnes au nord de Hotan |

### Stratégie
- Quêtes Hotan (700k-2M EXP) : Bunwang Nephrite, Ultra Blood Devils, Mujigi (nuit!), Yeti Stick
- **SP farming GAP 9** possible sur les Bunwangs/Mujigis si votre stock de SP est insuffisant
- La grotte de Donwhang (niveaux profonds) et les instances FGW (Togui Village 35-70) offrent de l'XP et du SP en party
- Party 8/8 EXP auto-share = méthode standard à partir de ce palier

---

## 🌵 Level 60-80: Taklamakan

### Zones et monstres (vérifiés)
| Niveau | Cible | Zone |
|-------:|-------|------|
| 61-64 | Shakrams, Edimmus | Désert du Taklamakan (nord) |
| 62-66 | Niya Soldiers / Niya Guards | Ruines Niya |
| 68-70 | Demon/Devil Eyes | Désert profond |
| 71-74 | Niya Snipers / Niya Hunters | Ruines Niya (sud) |
| 77-79 | Niya Mages / Shamans | Ruines Niya |
| 78-80 | Niya Royal Guards / Generals | Cœur des ruines |

⚠️ Le Taklamakan n'a **pas de ville** — prenez potions, return scrolls et prévoyez un pet de transport. Les quêtes (1,9M-4,8M EXP) sont données par les NPCs des forts/oasis.

### Stratégie
- « Last chance » classique pour un gros SP farming avant les caps (GAP 9 sur les Niyas avec plvl)
- Les quêtes « Bet » de Mamoje/Soboi (65-71) sont originales : pari de 2h, récompenses massives
- Roc Mountain (Legend III) ouvre le 70-90 en parallèle (voir section suivante)

---

## ⛰️ Level 70-100: Roc Mountain et Tombe de Qin-Shi

### Zones et monstres (vérifiés)
| Niveau | Cible | Zone |
|-------:|-------|------|
| 74-78 | Wing Tribe (Attackers, Black Eagles...) | Roc Mountain |
| 76 | Goats | Roc Mountain (utiles pour la quête Branch of Life) |
| 80-90 | Yetis supérieurs, mobs Roc Mountain haut niveau | Roc Mountain profond |
| 70-100 | Mobs de la **Tombe de Qin-Shi** (dungeon, entrée 70+) | Ch'in Tomb (Legend IV, mars 2009) |
| 100-105 | Uniques : Medusa (105) | Tombe de Qin-Shi |

### Stratégie
- La Tombe de Qin-Shi est LE content 70-100 de l'époque Legend IV : mobs denses, bons drops 10D
- Bandit Fortress / Hotan Fortress (Legend II/IV+) pour les fortress wars hebdomadaires
- À partir de 95-100, direction Alexandrie

---

## 🏛️ Level 90-120: Alexandrie et Job Temple

### Zones et monstres (vérifiés)
| Niveau | Cible | Zone |
|-------:|-------|------|
| 95-100 | Mobs lvl ~100 d'Alexandrie (conseil communauté : y aller dès 95) | Plaines d'Alexandrie |
| 100-103 | Unegs, Wenegs, Tathen, Dark Khepri | Abords d'Alexandrie / port |
| 103-106 | Dark/Blood Sandmen, Camel Spiders, Blood Hyenas, Ure'uths, Mehens | Désert égyptien |
| 106-110 | Sand Bugs, Sand Stings, Sand Worms, Sylakens | Désert profond |
| 108-112 | Akerus, Devil Worms | Confins du désert |
| 100+ | Job Temple (bagdad, mobs de job) | Instance de job |
| 105+ | Holy Water Temple (Beginner → Advanced) | Instance de quête de titre |
| 110-120 | Temple de Jupiter | Instance (Legend VIII) |

### Stratégie — le « quest farming »
- Dès 100 : **Audience with the Viceroy** puis le hub de quêtes d'Alexandrie
- Dès 104 : la majorité des quêtes deviennent **illimitées** — combinez grinding + 300 kills par tour
- **Becoming a Deity (1)** (soldat Turian, porte Sud) : 300 Unegs → 2,8M EXP + 250 SP de base (×3 sur beaucoup de serveurs) — **répétable à l'infini**, c'est LE spot de farm EXP/SP post-100
- À 95+, engagez les **chaînes de titre/Blue Zerk** (Général Sonhyeon / Ratchel) — nécessaires pour le PvP endgame
- Tomb of Pharaoh (parties 100+) : silver coins + XP

### Temps de jeu réaliste (officiel ~1x boosté)
- 90→100 : plusieurs semaines ; 100→110 : plusieurs mois ; 110→120 : ~1 an de grind assidu (34,9 milliards d'XP cumulées rien que pour atteindre 110)

---

## 🚀 Power Leveling (PLvL)

**PLvL** = leveling accéléré par des joueurs de haut niveau en party EXP auto-share.

### Méthode classique « 8/8 + plvler » (vérifiée, guide Elitepvpers)
1. Un **plvler lvl 80+** (souvent Wizard/cleric) tue en masse
2. Les **farmers bas niveau** (gap 9 pour du SP, ou pas de gap pour du pur XP) restent **proches** (rayon de partage) et lèchent l'EXP
3. **Astuce clé :** si la **moyenne des niveaux de la party ≤ niveau du monstre**, les monstres « party » rapportent **le double d'EXP/SP** → on ajoute un niveau 1 inactif pour baisser la moyenne !
4. Spots historiques : **Ongs (33-34)** pour les farmers 16-32, puis Sonars, puis désert

### Points d'attention
- L'EXP leechée subit les règles d'écart de niveau (monstre trop haut = malus fort pour le leecher)
- Le PLvL à gap 9 = **la** méthode de SP farming classique (rendement ~1 000 SP/h, 3 000+/h avec tickets ST/PT sur les serveurs qui en ont)
- Sur officiels, le PLvL payant (gold/argent réel) a longtemps été un business

---

## ⚖️ Questing vs Grinding

### Questing
- ✅ Rentable 1-60 (les quêtes = gros % du niveau, voir l'échelle dans [16_QUEST_SYSTEM.md](16_QUEST_SYSTEM.md))
- ✅ Or, items, slots d'inventaire en bonus
- ❌ Voyage, prérequis, limites de répétition

### Grinding
- ✅ Domine à partir de 60 (party 8/8 auto-share sur spots denses)
- ✅ Choix du GAP → contrôle du ratio XP/SP
- ❌ Répétitif ; les mobs gris ne donnent plus rien

### Hybride recommandé
- **1-30 :** quêtes en priorité absolue
- **30-60 :** quêtes + SP farming sur Ongs/Sonars + party
- **60-100 :** party grinding (Taklamakan, Qin-Shi, Roc) + quêtes massives de zone
- **100-120 :** « quest farming » illimité d'Alexandrie + Job Temple + instances

---

## 💡 Tips

### Général
1. **Ciblez des mobs +5 à +10 niveaux** (bonus max) mais tuez vite — le rendement = kills/heure
2. **Party auto-share** dès que possible (+3%/membre, rayon de portée)
3. **Ne mourez pas** à haut niveau : −2% d'XP, ça devient énorme
4. **Buffs permanents** : speed (Lightning), imbue, potions — le downtime tue le rendement
5. **Montures/pets** : le transport d'items permet de farmer sans retour ville

### Par type de personnage
- **Nuker INT (CH) :** kite, nuke, ne laissez jamais les mobs au contact (garment)
- **Glaive STR (CH) :** spin AoE (Bloody Fan Storm), pull massif, pot-temps plein
- **Wizard (EU) :** AOE en party, le plus grand DPS de zone du jeu
- **Cleric/Bard (EU) :** indispensable en party 8/8 (heal / mana)

---

## ❓ FAQ

### Q: Combien de temps pour atteindre le cap ?
**R:** Dépend de l'époque et des rates. Officiel 1x boosté : plusieurs mois pour 90, ~1 an pour 110+, des années au-delà (118 milliards d'XP cumulées au lvl 120). Silkroad Origin : cap 120 rapporté en 3-4 mois. Privé ×30 : jours/semaines.

### Q: Le grinding est-il plus rapide que les quêtes ?
**R:** 1-60 : les quêtes rivalisent. 60+ : la party auto-share gagne nettement — sauf à Alexandrie (100+) où les quêtes illimitées redeviennent une machine à XP/SP.

### Q: Sur quoi repose le bonus d'XP des monstres ?
**R:** +3%/niveau d'écart au-dessus de vous, max **+30% à +10**, puis décroissant jusqu'à 0 à +20 ; en dessous de vous : malus dès −4, quasi zéro à −10. Ne farmez jamais des mobs gris.

### Q: Puis-je level sans SP farming ?
**R:** Oui pour l'XP, mais vous serez « skill-starved » (pas assez de SP pour vos masteries) — voir [26_SP_FARMING.md](26_SP_FARMING.md).

### Q: Le level cap est-il le même partout ?
**R:** Non : officiel historique 60→140 (2018) ; serveurs privés : 90, 110, 120 (le plus courant), 130-140 (fichiers récents).

### Q: Que se passe-t-il si je meurs ?
**R:** −2% d'XP (délével possible) + risque de dropper un item (5% sans PK points, jusqu'à 100% avec 30 000 PK points). Aucune restauration d'XP prévue.

---

## 🔗 Resources

### Données vérifiées
- **`assets/pk2_media/server_dep/silkroad/textdata/leveldata.txt`** — table d'XP officielle (dans ce dépôt)
- [Adjusting The Mechanism To Receive Exp & Esp — Silkroad Origin](https://sromobile.com/en/news/updates/adjusting-the-mechanism-to-receive-exp-esp) — formule écart de niveau
- [Silkroad Online Death Penalty & Item Drops — florian0](https://florian0.wordpress.com/2016/10/05/silkroad-online-death-penalty-item-drops/) — mécanique de mort

### Guides
- [How to farm SP (PLvL/Ongs) — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/2461754-guide-how-farm-sp-skillpoints.html) — méthode 8/8 + plvl
- [Complete Guide For Silkroad Starters — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/2407342-complete-guide-silkroad-starters.html)
- [Party Systems — Silkroad Forums](http://www.silkroadforums.com/viewtopic.php?f=7&t=19130)
- [Academy Guide — Fdherg](https://fdherg.wordpress.com/2010/06/14/silkroad-online-academy-guide/)
- [Quests lvl 100-110 — WantedGuild](https://wantedguild.forumotion.com/t6-quests-from-lvl-100-to-110)

### Cartes
- [xSROMap — carte interactive](https://jellybitz.github.io/xSROMap/)
- [Silkroad Monster Maps — silkroadforums](http://www.silkroadforums.com/viewtopic.php?t=197)

---

## 📚 Voir aussi

### Systèmes de Progression
- [SP Farming](26_SP_FARMING.md) - Optimiser les Skill Points
- [Système de Quêtes](16_QUEST_SYSTEM.md) - Gain d'EXP via quêtes
- [Mécaniques Avancées](28_ADVANCED_MECHANICS.md) - Détails techniques

### Guides de Zones
- [Zones Overview](13_ZONES_OVERVIEW.md) - Toutes les zones de leveling
- [Guide Monstres](14_MONSTER_GUIDE.md) - Mobs et spawns par level
- [Locations de Spawn](MONSTERS_SPAWN_LOCATIONS.md) - Coordonnées précises
- [Cartes](MAP_COORDINATES_REFERENCE.md) - Navigation

### Équipement et Builds
- [Hub Classes](HUB_CLASSES.md) - Centralise informations classes
- [Système de Combat](04_COMBAT_SYSTEM.md) - Optimiser le combat
- [Seal Equipment](06_SEAL_EQUIPMENT.md) - Gear progression
- [Builds PvE](34_PVE_BUILDS.md) - Optimiser le leveling

### Économie et Social
- [Économie et Or](22_ECONOMY_GOLD.md) - Gold farming pendant le leveling
- [Mounts et Pets](24_MOUNTS_PETS.md) - Transport pour leveling
- [Parties](18_PARTY_SYSTEM.md) - Leveling en groupe
- [Job System](09_JOB_SYSTEM_OVERVIEW.md) - EXP via jobs

---

*Dernière mise à jour: 2026-10-01*
*Sources: leveldata.txt (client officiel, ce dépôt), sromobile.com (formule EXP/écart), florian0 (death penalty), Elitepvpers (PLvL), WantedGuild (quêtes Alexandrie), silkroadforums (party system)*
