# European Classes

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Système de Classes](#-système-de-classes)
- [Les 6 Classes Européennes](#-les-6-classes-européennes)
- [Warrior](#1-warrior)
- [Rogue](#2-rogue)
- [Wizard](#3-wizard)
- [Warlock](#4-warlock)
- [Bard](#5-bard)
- [Cleric](#6-cleric)
- [Système de Maîtrises](#️-système-de-maîtrises)
- [Rôles et Synergies en Party](#-rôles-et-synergies-en-party)
- [Builds Populaires](#-builds-populaires)
- [Chinois vs Européen](#-chinois-vs-européen)
- [🇰🇷 Contenu KSRO (2011-2026)](#-contenu-ksro-2011-2026)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Vue d'Ensemble

La race européenne (introduite avec **Legend I: Europe**, 2007) offre un système **basé sur des classes à rôles prédéfinis**, contrairement au système « sandbox » des Chinois. Un personnage EU combine **2 masteries de classe** librement choisies parmi 6.

### Points Clés
- ✅ **6 classes uniques** : Warrior, Rogue, Wizard, Warlock, Bard, Cleric
- ✅ **2 masteries combinables librement** (le « build » = la combinaison, ex: Wizard/Cleric)
- ✅ **Moins de SP requis** que les Chinois (gap/farming optionnel)
- ✅ **Synergie de classe** forte, conçu pour le jeu en party 8/8
- ✅ **Dégâts les plus élevés du jeu** (burst), mais fragilité et délai de potion de 15 s
- ✅ **Gameplay MMORPG classique** : tank / heal / DPS / support

### Philosophie
- Rôles définis (Tank, Healer, DPS, Support, Lurer)
- Les 2 masteries d'un personnage se complètent (ex: Wizard=Cleric pour le solo)
- Cooldowns longs, skills « livre 1 / livre 2 » (versions améliorées débloquées plus haut dans l'arbre)
- Plus accessible aux nouveaux joueurs, quasi injouable solo à haut niveau (pot delay)

### ⚠️ Correction importante (vs anciennes versions de ce doc)
- ❌ Les maîtrises EU ne sont **PAS fixes** par classe (le Rogue n'est pas obligé de prendre Bard, le Warrior n'est pas limité à Cleric...). **Toutes les combinaisons de 2 masteries sont possibles** : c'est le cœur du système EU.
- ❌ Le Warrior n'a **pas de lance 2H** : ses 3 armes sont l'épée 1H+bouclier, l'épée 2H et la **double hache** (dual axe).

### Différences Majeures vs Chinois

| Aspect | Chinois | Européen |
|--------|---------|----------|
| Classes | Aucune (7 masteries libres) | 6 classes, rôles définis |
| Total masteries | 3 × niveau du perso (330 au cap 110, 360 au cap 120) | **2 × niveau du perso** (220 au cap 110, 240 au cap 120) |
| Armes | 5 (glavie, lance, lame, épée, arc) | 9 (épée 1H, épée 2H, double hache, dague, arbalète, staff, dark staff, harpe, cleric rod) |
| Imbues élémentaires | Oui (fire/ice/lightning) | **Non** |
| Potions | Quasi pas de délai | **Délai de 15 secondes** |
| SP requis | Très élevés (farming/gap) | Plus faibles (gap optionnel) |
| Style de dégâts | Soutenu / DoT / imbues | **Burst** très élevé, cooldowns |
| Jeu solo | Excellent | Difficile (sauf builds hybrides), conçu pour party |
| PvP de masse | Correct | Excellent (stuns, roots, AoE coordonnées) |

Sources : [Guide Chinese vs Europe (Temptation)](https://silkroadtemptation.wordpress.com/2010/03/02/guide-chinese-vs-europe/), [MMORPG.com – Skill Farming](https://forums.mmorpg.com/discussion/234430/silkroad-online-skill-farming), [Fandom Wiki – Skills](https://silkroadonline.fandom.com/wiki/Skills)

> 📊 **Valeurs chiffrées ✅ (extraction skilldata 2026-10)** : **3 637 skills EU** décodés depuis `skilldata_5000.txt` (fichiers serveur vSRO 1.188 + extension cap 120, repo *joaoldematejr/server_files_sro*) — dégâts, MP, SP, durées et cooldowns **par niveau** disponibles dans [ML_RESEARCH/data/skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv) (47 colonnes). Loi structurante : **le % de dégâts est FIXE par série**, seule la part fixe min~max monte avec le niveau. Rapport : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md). Échantillons chiffrés dans les sections Warrior/Wizard/Bard/Cleric ci-dessous.

---

## 🏛️ Système de Classes

### Règles de Base

- Chaque personnage européen répartit ses niveaux de mastery dans **2 masteries au maximum** (en pratique : 2 masteries poussées haut, ou 2 + 1 tres basse, ex: Wiz 108 / Warrior 10 / Cleric 102 au cap 110).
- Chaque mastery correspond à **une classe complète** : attaques, buffs, passifs.
- La « classe » d'un perso EU se note **MainMastery/SubMastery** (ex: Rogue/Cleric).
- Chaque mastery contient des lignes de skills par **type d'arme** (Warrior/Rogue) ou par **élément/fonction** (Wizard, Warlock, Bard, Cleric).

### Progression

- Niveau max historique : 90 (2008) → 100 → 110 (Legend VIII) → 120 → 140 (versions récentes)
- **Plafond total de masteries = 2 × niveau du personnage** (220 au cap 110, 240 au cap 120)
- Chaque mastery individuelle est plafonnée au niveau du personnage
- Répartition typique : **110/110** (deux masteries au cap) ou **110/100 + 10 utilitaire**
- Les skills s'achètent avec des SP une fois le niveau de mastery requis atteint ; chaque ligne possède une version « livre 2 » débloquée plus haut dans l'arbre (ex: Moving March → Swing March, Healing Cycle → Healing Orbit, Root → Mesh Root)

### Avantages du Système Européen

✅ **Moins de SP farming :** ~760 000 SP pour maxer Wizard+Bard au cap 90 (loin des millions requis côté CH)
✅ **Rôle clair :** vous savez ce que vous jouez dès le début
✅ **Synergie :** les deux masteries se complètent (heal+nuke, buff+dps...)
✅ **Simple :** 2 masteries au lieu de 7 à équilibrer
✅ **Group-friendly :** chaque classe a une utilité évidente en party

### Inconvénients

❌ **Pot delay 15 s :** impossible de « pot-spam » pour survivre solo
❌ **Fragile :** moins de HP que les Chinois à équipement équivalent
❌ **Prévisible :** builds binaires, moins de créativité que le sandbox CH
❌ **Dépendant du groupe :** un Cleric ou un Bard seul farm très mal

---

## 🛡️ Les 6 Classes Européennes

### Vue d'Ensemble

| Classe | Rôle Principal | Armes | Stat principale | Difficulté | Nom ZH (TW officiel) |
|--------|----------------|-------|-----------------|------------|----------------------|
| **Warrior** | Tank / DPS melee / Party buffer | Épée 1H+bouclier, épée 2H, double hache | STR | ⭐⭐ | 聖戰士 |
| **Rogue** | Assassin / Burst DPS / Lurer | Dague, arbalète | STR | ⭐⭐⭐⭐ | 刺客 |
| **Wizard** | Nuker AoE magique | Staff | INT | ⭐⭐⭐ | 元素使 |
| **Warlock** | Debuffer / DoT / Contrôle | Dark staff (warlock rod) | INT | ⭐⭐⭐⭐⭐ | 魔元素使 |
| **Bard** | Buffer / Support mana | Harpe (robe uniquement) | INT/hybride | ⭐⭐ | 吟遊詩人 |
| **Cleric** | Healer / Buffs défensifs | Cleric rod + bouclier | INT/hybride | ⭐⭐ | 聖職者 |

Armures EU (mêmes 3 familles que CH) : **Heavy Armor** (STR), **Light Armor** (hybride, bonus pour Wiz/Cleric et Warrior), **Robe** (INT, Warlock/Bard). Le Bard ne porte que la robe (pas de bouclier avec la harpe).

> 🌏 **Noms ZH (service officiel taïwanais)** — classes ci-dessus (noms TW DiGeam, en chinois traditionnel) ; armes EU : 單手劍 (épée 1H), 雙手劍 (épée 2H), 雙斧 (double hache), 匕首 (dagues), 十字弓 (arbalète), 法杖 (staff), 術杖 (dark staff), 豎琴 (harpe), 牧杖 (clerical rod) ; armures : 重盔甲 (Heavy Armor), 轻铠甲 / TR 輕鎧甲 (Light Armor), 法袍 (Robe). Sources : [wiki Bahamut — 絲路Online 攻略百科](https://wiki2.gamer.com.tw/wiki.php?n=10948:洛克山) · [wiki officiel DiGeam](https://srowiki.digeam.com/), via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md). Aucun nom officiel FR/TR/DE : clients jamais localisés dans ces langues ([RESEARCH_FR](ML_RESEARCH/RESEARCH_FR.md) · [RESEARCH_TR](ML_RESEARCH/RESEARCH_TR.md) · [RESEARCH_DE](ML_RESEARCH/RESEARCH_DE.md)).

---

## 1. WARRIOR

### Rôle
**Tank, DPS melee et « buffer » de party.** Le Warrior est le pilier défensif du groupe : il tient l'aggro, protège les membres (fences, Pain Quota, Protect) et interrompt les casts ennemis. C'est aussi un burst melee redoutable en 2H.

### Les 3 lignes d'armes (mastery Warrior)

| Ligne | Arme | Style |
|-------|------|-------|
| **One-Handed** | Épée 1H + bouclier | Tank : blocage, aggros, knockback au bouclier |
| **Two-Handed** | Épée 2H | DPS melee : les plus gros dégâts PHY du jeu en coup simple |
| **Dual Axe** | Double hache | DPS hybride : stun, bleed, combos |

### Skills clés (noms iSRO)
- **Aggro/tank :** Taunting Target (3 cibles), Howling Shout (5 cibles), Sprint Assault (charge + chance knockback/stun — l'interrupteur clé, ex: contre l'Offering d'un Cleric)
- **1H :** Slash, Shield Trash (KB élevé, rapide), Shield Crush (KB avancé), Berserker → Daring Berserker
- **2H :** Bash, Turn Rising (rapide, chance knockdown), Charge Swing, Triple Swing (bonus vs cibles au sol), Maddening, **Dare Devil** (attaque la plus forte du Warrior)
- **Dual Axe :** Down Cross, Double Twist, Sudden Twist (stun + bleed), Axis Quiver, Dual/Deadly Counter, Crisis/Crucial Rush
- **Buffs self :** **Vital Increase** (+HP, −35% ATK — à annuler pour burst), **Iron Skin** (+DEF PHY, obligatoire), **Mana Skin** (+DEF MAG, obligatoire), Warcry (2H)
- **Buffs party (haut niveau) :** **Pain Quota** (partage les dégâts de 2 membres, 5 min), **Physical/Magical Fence** (transfert une partie des dégâts vers le Warrior), **Protect** (absorbe l'aggro de 2 joueurs), **Physical/Magical/Ultimate Screen** (+DEF massive 1 min, ne pas stack les trois)

> 📊 ✅ (extraction skilldata 2026-10) Échantillon Warrior — **Dare Devil** (2H, maîtrise 80→120, 11 niveaux) : **305 % + 702~858 → 305 % + 2 262~2 765**, **2 hits**, CD 5 s, MP 1 311→4 063, knockback [30, 50] + taunt. **Pain Quota** : durée **5 min confirmée** (`dura` 300 000 ms), CD 2 s, MP 17→256, maîtrise 20→100. **Iron Skin** : absorption **238 → 2 972**, 14 rangs (maîtrise 40→118), CD 2 min, SP 280→25 094. Source : [ML_RESEARCH/data/skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv).

### Builds
- **1H/Cleric** : le tank ultime (dungeons, Alexandria). Stats full STR, Light Armor.
- **2H/Cleric** : burst melee + survie, très fort en 1v1.
- **2H/Rogue** : dégâts PvP max, 5 armes à gérer (switch weapon).
- **Warrior/Warlock** : interruptions en série, populaire au-delà du cap 120.

### Playstyle
- **PvE :** tient les mobs sur lui, garde Pain Quota/fences actifs, pousse les mobs dans la zone de kill au bouclier.
- **PvP :** charge/interrupt (Sprint Assault), KB en série, très tanky ; faible face aux nukers INT non contrôlés.
- ⚠️ Ordre de switch d'arme : équiper **l'épée 1H AVANT le bouclier**, sinon tous les buffs party sont annulés.

⭐⭐⭐⭐ Recommandé pour : nouveaux joueurs, tanks, joueurs solo (2H).

---

## 2. ROGUE

### Rôle
**Assassin burst et lurer.** Dégâts critiques physiques les plus élevés du jeu en monocible, invisibilité (Stealth), et l'arbalète pour lurer/farm à distance.

### Les 2 lignes d'armes (mastery Rogue)

| Ligne | Arme | Style |
|-------|------|-------|
| **Dagger** | Dague | Melee : crits, stun, bleed, combos rapides |
| **Crossbow** | Arbalète | Distance : burst, knockdown, portée max du jeu |

### Skills clés (noms iSRO)
- **Dague :** Spinning (base), Wounds → **Mortal Wounds** (bonus vs cibles au sol + bleed), Scud (buff vitesse), Screw (chance stun), Combo Blow, **Butterfly Blow** (5 hits rapides, 20% chance Dull 20 s), **Prick** (attaque la plus forte, bleed + stun)
- **Arbalète :** Power Shot, Intense Shot, **Fast Shot → Rapid Shot** (portée max, CD court — l'outil de lure), Long Shot → **Distance Shot** (le plus fort), Blast Shot, **Hurricane Shot** (chance knockdown)
- **Buffs :** **Crossbow Extreme** / **Dagger Desperate** (sacrifie ~50% HP/DEF pour +dégâts PHY massifs)
- **Utilitaire :** **Stealth** (invisible aux autres joueurs, vitesse réduite — moins ralenti avec une dague), **Scorn → Gross Scorn** (taunt ~7 s, 1 à 3 cibles : interrupt, bloque buffs/rez ennemis)
- **Passifs :** Crossbow Attack +10% (rang 1 de la mastery), passifs dague

### Builds
- **Rogue/Cleric** : le plus populaire — burst + survie, excellent solo et 1v1.
- **Rogue/Bard** : vitesse + mana, farm/PT.
- **Rogue/Warlock** : stuns/interrupts en série, très fort au-delà du cap 120.
- **Rogue/Wizard** : rare, mobilité (Teleport, Invisible).

### Playstyle
- **PvE :** lurer à l'arbalète (Rapid Shot), tuer les géants au dague-crit ; un Rogue niveau 10 suffit pour le rôle de lurer en PT.
- **PvP :** ouvre en Stealth, burst Prick/Mortal Wounds, Dull sur Butterfly Blow ; détruit Wizards/Clerics, match serré vs Warrior.

⭐⭐⭐⭐⭐ Recommandé pour : PvP 1v1, joueurs expérimentés. ⚠️ Déconseillé aux débutants (squishy, dépend des crits).

---

## 3. WIZARD

### Rôle
**Nuker AoE magique — les plus gros dégâts du jeu**, mais le moins de HP. Le Wizard tue les packs de mobs avant qu'ils n'arrivent, et fait tomber les HP des géants en 2-3 nukes.

### Structure de la mastery : 4 lignes élémentaires + utilitaires

| Ligne | Nukes | Particularité |
|-------|-------|---------------|
| **Fire** | Fire Bolt, **Meteor**, Fire Blow → Salamander Blow, Fire Trap → Lava Trap | Mono-cible/burst, pièges, détection |
| **Cold** | Ice Bolt, **Frozen Spear**, **Snow Wind** → **Blizzard** | Frostbite/freeze, invisibilité, drain mana |
| **Lightning** | Lightning Bolt → Chain Lightning, Charged Wind → Charged Squall | Multi-cibles, knockback, fear, téléport |
| **Earth** | Ground Charge → Ground Rave, **Earth Shock → Earth Quake** | AoE autour de la cible, root, buffs défensifs |

### Skills clés (noms iSRO)
- **Meteor** : le plus gros nuke (jusqu'à 3 cibles très proches), CD 10 s, **partage son groupe de cooldown avec Fire Bolt** (Meteor d'abord → Fire Bolt 10 s ; Fire Bolt d'abord → Meteor 3 s)
- **Fire Blow/Salamander Blow** : multi-hits (7-9 coups), jusqu'à 3 cibles, animation ~9 s **annulable** (Detect, Earth Barrier) — cœur du burst PvP
- **Frozen Spear** : 3 hits, 20% frostbite par hit ; **Snow Wind/Blizzard** : AoE, 80% frostbite / 20% freeze
- **Charged Wind/Charged Squall** : 5 hits, 80% knockback par hit — repousse les mobs vers le centre du PT
- **Lightning Shock** : 80% chance Fear 20 s ; **Teleport → Aerial Teleport** : saute à la position du curseur
- **Root → Mesh Root** : immobilise 10 s (20% d'échec) ; **Ground Charge/Ground Rave** : AoE très courte portée autour du caster (rôle « Wall WIZ »)
- **Earth Barrier → Earth Fence** : +30% absorption DEF PHY (rang moyen), 20 s, CD 60 s — cycle permanent avec 3 Wizards
- **Buffs :** **Life Control** (+25% dégâts MAG, −50% HP) et **Life Turnover** (+25% supplémentaires, cumulables) ; **Invisible → Crystal Invisible** (invisibilité, version groupe) ; **Detect → Sprawl Detect** (révèle les stealth)
- **Passifs :** Natural Spirit (+10% MAG ATK/rang), Force Mental (+10% MP, +1 INT/rang), **Magic Bound** (+1 m de portée/rang — portée de base 18 m)

> 📊 ✅ (extraction skilldata 2026-10) Échantillon Wizard — **Fire Bolt** (maîtrise 4→120, **30 niveaux**) : **366 % + 32~39 → 366 % + 3 438~4 202** (le % ne bouge jamais) ; MP 37→**5 799** ; SP 2→**27 050** ; burn 28→260 ; CD 4 s. **Meteor** (maîtrise 60→116, 15 niveaux) : **439 % + 582~711 → 439 % + 3 076~3 760**, **2 hits**, **CD 10,5 s** (10 500 ms), MP 2 189→12 444. Source : [ML_RESEARCH/data/skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv).

### Builds
- **Wizard/Cleric** : le build polyvalent numéro 1 (Light Armor, soins, combo Offering+Teleport).
- **Wizard/Bard** : le farm party par excellence (mana + speed), très mauvais solo.
- **Wall WIZ** : Wizard/Cleric en Light Armor avec Pain Quota du Warrior — tank aux nukes de zone courte portée.

### Rotations documentées
- Lv 20 : Lightning Bolt → Earth Shock → Lightning Bolt → Snow Wind
- Lv 60 : Meteor → Lightning Bolt → Earth Shock → Snow Wind
- Lv 80 : Meteor → Chain Lightning → Earth Quake → Blizzard
- PvP : auto-attaque → clic sol → Frozen Spear → Charged Squall → Salamander Blow (animation cancel)

⭐⭐⭐⭐⭐ Recommandé pour : farm, PvE de groupe, burst. ⚠️ Faible en 1v1 non supporté.

---

## 4. WARLOCK

### Rôle
**Debuffer et DoT — le contrôle du champ de bataille.** Le Warlock affaiblit (défense/attaque/division), pose des DoT sur 3 cibles, dort/stun/fear, et se soigne en volant la vie. Peu de dégâts bruts directs, mais rend toute cible vulnérable.

### Structure de la mastery (grille en lignes/colonnes, traduction elitepvpers)
- **R1 :** passifs (dont nuke dmg up, réduction MP)
- **R2 : DoT mono-cible** — 4 types : burn (Combustion), poison (Venom), bleed (Decay), disease
- **R3 : DoT AoE 3 cibles** — Blaze → Dark Blaze (burn), Toxin → Toxin Invasion (poison), Decayed → Dark Decayed (bleed)
- **R4 : Débuffs « curse »** — série *Raze/Ravage* : Physical Raze (→ **Decay**, −DEF PHY), Medical/Magical Raze (→ **Weaken**, −défense), Combat Raze (→ **Impotent**, −ATK PHY/MAG), **Courage Raze (→ Division, +30% dégâts subis)** ; tous ~80% de réussite, 30 s, CD court ; versions Ravage = AoE 3 cibles
- **Autres curses confirmés** (noms d'états) : Dull (−puissance magique), Panic, Short Sight (−portée), Darkness (aveugle), Disease (soins réduits), Fear, Confuse, Bind
- **R5-6 : Contrôle** — Stun mono-cible 80%, stun AoE 3 cibles (Daze → Wrath Daze), **Slumber → Deep Slumber** (sommeil 1/3 cibles, brisé si attaqué), Curse Breath → Dark Breath
- **Sang :** **Vampire Touch → Vampire Kiss** (dégâts + vol de vie + Disease), Blood Flower → Death Flower, Bloody Trap → Death Trap
- **Buffs :** **Reflect → Advanced Reflect** (35% de chance de renvoyer à 135%, **ignore Pain Quota/fences**), Mirage, Phantasma, **Scream Mask** (buff 2 joueurs : chance de stun l'attaquant)
- **Cap 124+ :** nuke « défense ↓ dégâts ↑ » (style Life Turnover), **Aura of Blood** (+30% dégâts berserk au groupe)

### Builds
- **Warlock/Cleric** : le plus courant — solo fort, stuns + Offering en PvP.
- **Warlock/Wizard** : dégâts de zone de party, redoutable au cap 90.
- **Warlock/Warrior** : très fort au-delà du cap 124.
- **Warlock/Bard** : solo/farm (Noise, vitesse, soins).

### Playstyle
- **PvE :** poser Courage Raze (Division) sur les géants/PTG/Pandora, DoT AoE sur les packs ; les DoT accélèrent la jauge berserk.
- **PvP :** chaîne debuffs → stun/sleep → Vampire Kiss ; Reflect punit les bursts ; Scream Mask sur les carries.

⭐⭐⭐ Recommandé pour : joueurs expérimentés, PvP de groupe. ⚠️ Peu viable seul sans sub-mastery.

---

## 5. BARD

### Rôle
**Buffer et batterie de mana.** Le Bard maintient la party en vie « économiquement » : mana (Mana Cycle/Orbit), réduction d'aggro (Noise), défenses (tambours), vitesse (marches) et danses de dégâts. Sans Bard, une party EU tombe à court de MP.

### Structure de la mastery
- **Buffs de groupe** : Moving March → Swing March (vitesse), Hit March → Clout March (hit ratio)
- **Tambours :** **Guard Tambour** (+DEF PHY groupe) / **Mana Tambour** (+DEF MAG) — **non cumulables entre eux**, interrompus si le Bard prend des dégâts
- **Mana :** **Mana Cycle** (rend un montant fixe de MP chaque seconde pendant 16 s, cible unique), **Mana Orbit** (tout le groupe), Mana Switch, Mana Wind/Mana Breeze
- **Anti-aggro :** **Noise** (réduit l'aggro des monstres — à garder actif en permanence)
- **Cures :** Cure Melody (1 statut, 1 cible) → **Cure Music** (tout le groupe)
- **Attaques :** Horror Chord, Weird Chord, Booming Chord → Booming Wave, Tuning Noise → Tuning Sound (dégâts absolus), Discord Wave
- **Contrôle :** Holding/Patter Calmor, Temptation → Curious Temptation (charme un mob)
- **Danses (haut niveau) :** **Dance of Magic / Dance of Wizardry** (+dégâts magiques du groupe), Dance of Healing, danse warrior (PHY), danse rogue — interrompues si le Bard est touché ; **Awesome World** permet de danser seul (effet réduit de moitié)
- **Passifs :** Beautiful Life (danses), Bards Dream, passifs de base

> 📊 ✅ (extraction skilldata 2026-10) **Mana Orbit** est le **skill le plus cher du jeu en MP au lv1** : **15 896 MP** (jusqu'à 30 000 au dernier rang, maîtrise 90→120) — la « batterie de mana » se paie au prix fort. Source : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md §4.5](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md) · [ML_RESEARCH/data/skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv).

### Builds
- **Bard/Cleric** : support total (buffs + heals + rez), très demandé, très faible solo.
- **Wizard/Bard** : le farm en party.
- **Warrior/Bard, Rogue/Bard** : supports STR.

### Playstyle
- Maintenir Noise + marche + tambour en boucle ; Mana Cycle en priorité sur les Clerics, puis les DPS ; recaster les marches après chaque rez.
- ⚠️ Deux Bards dans la party : le 2e ne peut pas poser son tambour/danse tant que celui du 1er n'est pas annulé.

⭐⭐⭐⭐ Recommandé pour : joueurs sociaux/support. ⚠️ Déconseillé aux solo players.

---

## 6. CLERIC

### Role
**Healer principal et buffs défensifs.** Indispensable : c'est lui qui rend la party « immortelle » en PvE et qui dicte les trades en PvP (Offering). 2 Clerics par party en dessous du niveau 90.

### Structure de la mastery
- **HoT :** **Healing Cycle → Healing Orbit** (soin toutes les 3 s, **aucune aggro** — le soin de fond par excellence)
- **Heals directs :** Healing Division → Healing Favor, Group Healing → Group Healing Breath (8 membres), Group Recovery → Holy Group Recovery (soin instantané de zone, grosse aggro)
- **Buff de soin :** **Recovery Division → Holy Recovery Division** (300 s, soigne périodiquement le membre le plus bas — ~445 HP/s à haut rang — « must max », s'applique à la party via script)
- **Rez :** Resurrection (runes selon le rang)
- **Buffs défensifs :** **Bless Spell** (+DEF PHY/MAG « importante » au groupe), Body/Soul Blessing (DEF PHY/MAG, **30 min**)
- **Buffs de stats :** Force Blessing (+STR → HP/ATK PHY), Mental Blessing (+INT → MP/ATK MAG) + versions supérieures « Deity » (Force Deity, Mental Deity, Body Deity, Soul Deity)
- **Reflect :** Reverse → Grad Reverse, Group Reverse → Holy Group Reverse, Reverse Oblation/Immolation
- **Anti-curse :** **Holy Word → Holy Spell** (résistance aux statuts anormaux), Innocent → Integrity (cure)
- **Attaques :** Trial Cross → Justice Cross, **Overhealing → Glut Healing** (dégâts fixes, aggro), **Offering / Pure Offering** (**consomme 95% des HP du Cleric** — la plus grosse attaque du jeu, nécessite HP > 95%)

> 📊 ✅ (extraction skilldata 2026-10) **Healing Orbit** (maîtrise 80→116, 7 rangs) : soin **1 819 → 4 722** par cycle ; durée 16 s ; CD 10 s ; MP 5 822→15 111 ; SP 2 494→23 138. Source : [ML_RESEARCH/data/skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv).

### Builds
- **Cleric/Bard** : support complet (mana + heals + buffs).
- **Wizard/Cleric, Warrior/Cleric, Rogue/Cleric, Warlock/Cleric** : le Cleric est la sub-mastery la plus prisée du jeu.
- Stats : full INT (offense) à full STR (survie) ; robe (bonus heal) ou Light Armor (bonus buffs).

### Playstyle
- **PvE :** Recovery Division + Healing Orbit en fond, Group Healing/Recovery en burst ; STR buff sur warriors/lurers, INT buff sur les dealers, buffs DEF sur tous ; spammer les heals de groupe pour *prendre* l'aggro si besoin.
- **PvP :** Offering en finisher (after Teleport), Holy Spell contre les Warlocks, cures en priorité.

⭐⭐⭐⭐⭐ Recommandé pour : heals, social, toujours demandé. ⚠️ Farm solo très lent.

---

## ⚙️ Système de Maîtrises

### Règles Européennes

| Règle | Européen | Chinois |
|-------|----------|---------|
| Masteries disponibles | 6 (Warrior, Rogue, Wizard, Warlock, Bard, Cleric) | 7 (Bicheon, Heuksal, Pacheon, Cold, Lightning, Fire, Force) |
| Plafond total | **2 × niveau du perso** | 3 × niveau du perso |
| Cap 110 | 220 points de mastery | 330 |
| Cap 120 | 240 points de mastery | 360 |
| Combinaisons | Libres (n'importe quelles 2) | Libres (jusqu'à 3 maxées) |
| Imbues | Non | Oui |

### Points de Maîtrise
- Les niveaux de mastery s'achètent avec des **SP** (coût croissant par niveau).
- Un perso EU maxe typiquement **2 masteries à son niveau** (110/110) ou garde une 3e très basse pour l'utilitaire (ex: Wiz 108 / Warrior 10 / Cleric 102).
- Monter une mastery au-delà du niveau des monstres farmés ne donne plus de bonus de dégâts (règle des 5 niveaux, comme CH).

### SP et Farming
- **~760 000 SP** pour maxer Wizard+Bard au cap 90 ; bien moins que l'équivalent CH (qui exige des millions et du gap farming).
- Le gap/farming reste **utile mais optionnel** pour débloquer tous les livres de skills sans attendre.
- Ordre conseillé : main mastery d'abord (dégâts/rôle), sub ensuite (survie/support), passifs en dernier.
- 📊 ✅ (extraction skilldata 2026-10) **Réconciliation des ordres de grandeur** (fichiers serveur vSRO 1.188 + cap 120) : le coût SP cumulé pour apprendre **toutes les séries d'une maîtrise complète au cap 120** est **Warrior 4 204 688 SP** · Warlock 3 672 099 · Rogue 2 930 473 · Cleric 2 813 755 · Wizard 2 771 857 · Bard 2 575 210. Les ~760 k du guide (Wizard+Bard cap 90) correspondent à une **sélection de lignes**, pas à l'arbre complet — les deux chiffres sont cohérents. Source : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md §4.5](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md).

---

## 👥 Rôles et Synergies en Party

### Party 8/8 type (PvE Alexandria / Job Cave)

| Rôle | Classe | Tâches |
|------|--------|--------|
| Tank | Warrior 1H | Aggro, Pain Quota sur les Clerics, fences sur les lurers, Protect sur les Wizards |
| Healers | 2 × Cleric | Recovery Division + Healing Orbit en fond, Group Healing en burst, rez |
| Mana | 1-2 × Bard | Noise, tambours, marches, Mana Cycle (Clerics d'abord), danses |
| DPS | Wizards (3-4) | Nukes AoE sur les packs, Meteor/Earth Quake sur les géants |
| Debuffer | Warlock (optionnel) | Division sur les géants, DoT AoE, sleeps |
| Lurer | Rogue xbow / Wizard | Fast/Rapid Shot ou nukes à portée pour ramener les mobs |

### Synergies classiques
- **Wizard + Cleric** : le combo 1v1/solo n°1 (nukes + heals + Offering + Teleport).
- **Warrior/Cleric** : tank de dungeon quasi immortel.
- **Bard/Cleric** : double support, la colonne vertébrale des parties.
- **Warlock + Wizard** : Division (−30%... plutôt +30% dégâts subis) + nukes = burst de géants ; combo très fort au cap 90.
- **Rogue (xbow) + party** : le lurer par excellence dès le niveau 10 de mastery.
- **Wall WIZ** : Wizard/Cleric Light Armor + Pain Quota, farm au corps à corps (Ground Rave/Earth Quake).

---

## 🎮 Builds Populaires Européens

| Build | Usage | Points forts |
|-------|-------|--------------|
| **Wizard/Cleric** | Solo + party, le + joué | Burst + survie + Offering |
| **Warrior/Cleric (1H)** | Dungeon/Alexandria | Tank ultime, auto-suffisant |
| **Warrior/Cleric (2H)** | PvP 1v1 | Burst melee + heals |
| **Rogue/Cleric (dague)** | PvP assassin | Stealth burst, crits |
| **Rogue/Bard (xbow)** | Lurer + farm | Vitesse, portée |
| **Wizard/Bard** | Farm party AoE | Meilleur XP/h en groupe |
| **Warlock/Cleric** | PvP solo | Debuffs + stuns + Offering |
| **Bard/Cleric** | Support pur | Toujours recruté |
| Tri-build Wiz 108/War 10/Cleric 102 | Cap 110 optimisé | Polyvalence maximale |

---

## ⚖️ Chinois vs Européen

### Comparaison Complète

| Aspect | Chinois | Européen | Avantage |
|--------|---------|----------|----------|
| **Solo / farm solo** | No pot delay, imbues, snow shield | Pot delay 15 s, fragile | CH |
| **Dégâts bruts** | Soutenus / DoT | Burst le plus élevé (Meteor, Dare Devil, Offering) | EU |
| **Party 8/8** | Faible synergie | Rôles + buffs croisés (PQ, tambours, dances) | EU |
| **PvP de masse (FW/BA)** | Correct | Stuns/roots/AoE coordonnés, Reflect | EU |
| **PvP 1v1 équivalent** | Très fort (force/bicheon...) | Très fort (2H war, rogue, warlock) | Égal / skill |
| **SP requis** | Très élevés | Modérés | EU |
| **Simplicité** | 7 masteries à planifier | 2 masteries | EU |
| **Flexibilité de build** | Totale | Binaire (2 classes) | CH |
| **Early game** | Meilleure survie | Difficile (pot delay) | CH |
| **Late game cap 120+** | Solide | Domine en party/PvP organisé | EU |

### Règles Générales
- **Solo leveling** : Chinois (ou EU avec sub Cleric) plus confortable.
- **Vitesse de farm en party** : Européen (Wizard AoE + Bard mana + Cleric heals).
- **PvP :** en 1v1 tout se joue sur le skill et le matchup ; en groupe, l'EU l'emporte presque toujours (contrôle + burst coordonné).
- « Un bon joueur CH peut battre un EU moyen, et réciproquement » — le skill prime.

---

## 🇰🇷 Contenu KSRO (2011-2026)

> ⚠️ **Périmètre** : le service coréen (KSRO) n'a **jamais fermé** — caps 120 (22/06/2011, Legend XII) → 125 (05/2014) → 130 (27/05/2015) → **140** (27/03/2018, inchangé en 2026, serveur unique 초원길) — [ML_RESEARCH/RESEARCH_KO2_CHRONO.md](ML_RESEARCH/RESEARCH_KO2_CHRONO.md). Le plafond EU « 2 × niveau du perso » (240 au cap 120) n'est **pas re-publié au-delà** côté KR. Cette section ne modifie pas la fiche classique ci-dessus.

### Les 269 noms coréens officiels des skills EU

Le **calculateur de skills officiel** du site KSRO embarque la table complète `skillName["CODENAME"] = "nom coréen"` de race européenne : **269 skills EU** avec codename et nom KR officiels (plus `skillRank`, le nombre de niveaux par skill — jusqu'à 30 pour certains rangs de buff). Échantillon : WARRIOR_ONEHANDA_STRIKE_A **슬래쉬** (Slash) · WARRIOR_TWOHANDA_CHARGE_A **차지 스윙** (Charge Swing) · ROG_STEALTHA_HIDING_A **스텔스** (Stealth) · ROG_BOWA_POWER_A **파워 샷** (Power Shot) · WIZARD_FIREA_POINT_B **메테오** (Meteor) · WIZARD_EARTHA_AREA_B **어스 퀘이크** (Earth Quake) · WARLOCK_BLOODA_LIFEDRAIN_B **뱀파이어 키스** (Vampire Kiss) · WARLOCK_SOULA_MEZ_B **딥 슬럼버** (Deep Slumber) · CLERIC_REBIRTHA_SPECIAL_A **리버스 오블레이션-부활** (résurrection) · CLERIC_SAINTA_ABNORMAL_A **홀리 워드** (Holy Word).

- 💡 Les skills EU portent en Corée des **transcriptions anglo-coréennes** (파이어 볼트 = Fire Bolt), à l'exception des séries numérotées (코드 0-4 du Bard) — cohérent avec l'origine « anglaise » de la race EU.
- Source : https://krsilkroadcp.joymax.com/gamedata/skill/skillCalculator.asp — échantillon complet par classe et extraction : [ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md §4](ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md) · table côté base : section [🇰🇷 Contenu KSRO](SKILLS_DATABASE_EUROPEAN.md) de [SKILLS_DATABASE_EUROPEAN.md](SKILLS_DATABASE_EUROPEAN.md).

---

## ❓ FAQ

### Q: Quelle est la meilleure classe européenne?
**R:** Wizard pour le farm, Rogue/Cleric pour le PvP solo, Cleric pour être recruté partout, Warrior/Cleric pour tanker. Il n'y a pas de « meilleure » : tout dépend de main/sub.

### Q: Un Européen peut-il prendre plus de 2 masteries?
**R:** Oui techniquement (3+ réparties), mais le plafond total de 2 × niveau fait qu'on ne dépasse pas 2 masteries pleines. Les tri-builds gardent la 3e très basse (ex: 108/10/102).

### Q: Pourquoi je meurs tout le temps en solo avec mon EU?
**R:** Le délai de potion de 15 s. Les EU sont conçus pour jouer en party avec un Cleric ; en solo, privilégiez une sub Cleric (heals) ou Bard (Noise, vitesse).

### Q: Les Européens doivent-ils faire du SP farming / gap?
**R:** Beaucoup moins que les Chinois (~760k SP pour Wiz+Bard au cap 90). Un gap léger (2-4 niveaux) suffit si vous voulez tout débloquer en avance.

### Q: Quelle est la classe la plus facile pour débuter?
**R:** Warrior (2H puis 1H/Cleric) ou Cleric en party. Le Warlock est le plus difficile.

### Q: Bard "only" est-il viable?
**R:** Jouer Bard en sub purement utilitaire (Noise + marches + tambours) est courant sur les multicountes ; un perso principal Bard seul ne farm pas.

### Q: Puis-je reskill / changer de masteries?
**R:** Oui, via les items de reset (Item Mall / events selon le serveur).

### Q: Le Cleric fait-il des dégâts?
**R:** Oui : Offering consomme 95% des HP du Cleric mais est la plus grosse attaque du jeu — le fameux « Cleric bomb » en PvP.

### Q: C'est quoi les « livres » (book 1 / book 2) des skills EU?
**R:** Chaque ligne de skill a une version de base et une version améliorée débloquée plus haut dans la mastery (ex: Healing Cycle → Healing Orbit, Root → Mesh Root, Moving March → Swing March).

---

## 🔗 Resources

### Guides Détaillés
- [Silkroad Europe — Traductions complètes des 6 masteries (elitepvpers, 2008)](https://www.elitepvpers.com/forum/sro-guides-templates/87726-silkroad-europe-warrior-skills-translation.html) — [Warrior](https://www.elitepvpers.com/forum/sro-guides-templates/87726-silkroad-europe-warrior-skills-translation.html) / [Rogue](https://www.elitepvpers.com/forum/sro-guides-templates/87728-silkroad-europe-rogue-skills-translation.html) / [Wizard](https://www.elitepvpers.com/forum/sro-guides-templates/87730-silkroad-europe-wizard-skills-translation.html) / [Warlock](https://www.elitepvpers.com/forum/sro-guides-templates/87731-silkroad-europe-warlock-skills-translation.html) / [Bard](https://www.elitepvpers.com/forum/sro-guides-templates/87735-silkroad-europe-bard-skills-translation.html) / [Cleric](https://www.elitepvpers.com/forum/sro-guides-templates/87737-silkroad-europe-cleric-skills-translation.html)
- [The Full Wizard/Bard Guide (Silkroad Forums)](http://www.silkroadforums.com/viewtopic.php?f=5&t=100199) — le guide de référence Wizard/Bard
- [Guide Chinese vs Europe (Silkroad Temptation)](https://silkroadtemptation.wordpress.com/2010/03/02/guide-chinese-vs-europe/)

### Guides par classe (SRO Valkyria — beginner guides)
- [Warrior](http://srovalkyria.blog.fc2.com/blog-entry-42.html) / [Rogue](https://srovalkyria.blog.fc2.com/blog-entry-43.html) / [Wizard](https://srovalkyria.blog.fc2.com/blog-entry-44.html) / [Warlock](http://srovalkyria.blog.fc2.com/blog-entry-45.html) / [Bard](https://srovalkyria.blog.fc2.com/blog-entry-46.html) / [Cleric](http://srovalkyria.blog.fc2.com/blog-entry-47.html) / [Party Guide](http://srovalkyria.blog.fc2.com/blog-entry-2.html)

### Wikis et données
- [Silkroad Online Wiki (Fandom) – Skills](https://silkroadonline.fandom.com/wiki/Skills) / [Weapons](https://silkroadonline.fandom.com/wiki/Weapons)
- [StrategyWiki – Silkroad Online/Gameplay](https://strategywiki.org/wiki/Silkroad_Online/Gameplay)
- [Rev6 – Stat & SP Calculator](https://rev6.org/en/stat-sp-calculator) (règles mastery CH/EU)
- [PhBot AutoParty (GitHub) — listes de skills iSRO réels](https://github.com/Day4Date/PhBot-Plugins/blob/master/AutoParty.py)
- [eSRO skill_builder.cpp (GitHub) — effets/curses EU côté serveur](https://github.com/myildirimofficial/eSRO/blob/master/SOL/src/skill_builder.cpp)
- [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) — noms ZH (TW) officiels des 6 classes EU, armes et armures ([wiki Bahamut](https://wiki2.gamer.com.tw/wiki.php?n=10948:洛克山) · [DiGeam](https://srowiki.digeam.com/))

### Communauté
- [Silkroad Forums – European Section](http://www.silkroadforums.com/)
- [Reddit – r/silkroadonline](https://www.reddit.com/r/silkroadonline/) — [Full European Character Guide](https://www.reddit.com/r/silkroadonline/comments/1wfn2h6/for_anyone_new_or_returning_to_silkroad_i_put/)
- [Elitepvpers – SRO Guides & Templates](https://www.elitepvpers.com/forum/sro-guides-templates/)

---

*Dernière mise à jour: 2026-10-01 (révision majeure : noms de skills iSRO vérifiés, système de masteries corrigé, party builds, sources croisées ; enrichi des noms ZH/TW officiels des classes — recherche multilingue ML_RESEARCH ; ajout de la section 🇰🇷 Contenu KSRO 2011-2026 : calculateur officiel = 269 noms KR des skills EU — rapport ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md §4 ; ajout des **valeurs chiffrées par niveau** — extraction skilldata 2026-10, rapport ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md, CSV ML_RESEARCH/data/skills_detail_EU.csv)*
*Sources: elitepvpers (traductions 2008), silkroadforums, SRO Valkyria blog, Fandom Wiki, GitHub (PhBot, eSRO), silkroadtemptation, Rev6 ; noms ZH : wiki Bahamut + DiGeam (via ML_RESEARCH/RESEARCH_ZH.md) ; chiffres par niveau : skilldata_5000.txt (fichiers serveur vSRO 1.188 + cap 120, repo joaoldematejr/server_files_sro), noms croisés skills.txt (tarekwiz), colonnes RawRefSkill.cs (hnguyenaa), tags fourcc openroad — marqueur ✅ (extraction skilldata 2026-10)*
