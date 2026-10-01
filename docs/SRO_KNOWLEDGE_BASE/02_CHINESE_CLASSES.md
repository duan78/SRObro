# Chinese Classes and Masteries

> ⚠️ **Révision majeure (2026-10)** : ce document a été réécrit à partir de données vérifiées (fichier `skills.txt` extrait du client via le dépôt GitHub *SilkroadBot*, notes officielles *Silkroad Origin Mobile*, guides historiques UnKnoWnCheaTs / SilkroadForums). Les anciens noms de skills inventés (« Fire Burst », « Mana Shield », « Thunder Walk », « Body Double »…) ont été remplacés par les **vrais noms iSRO**. Les chiffres non vérifiables sont signalés comme incertains.

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Système de Maîtrises](#-système-de-maîtrises)
- [Maîtrises d'Armes](#-maîtrises-darmes)
- [Maîtrises de Force (Éléments)](#-maîtrises-de-force-éléments)
- [Imbues Élémentaires](#-imbues-élémentaires)
- [Système de Mastery Points](#-système-de-mastery-points)
- [SP Farming et GAP](#-sp-farming-et-gap)
- [Builds Classiques](#-builds-classiques)
- [Cooldowns, Combos et Zerk](#-cooldowns-combos-et-zerk)
- [Résumé des Arbres de Skills](#-résumé-des-arbres-de-skills)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Vue d'Ensemble

La race chinoise (CH) **n'a pas de classes prédéfinies** : elle repose sur 7 maîtrises que l'on combine librement. Le personnage CH est pensé pour le **solo** (self-buffs, heal, résurrection accessibles via Force), par opposition aux Européens orientés groupe.

### Points Clés
- ✅ **7 maîtrises** : 3 d'armes + 4 de force (Cold, Lightning, Fire, Force)
- ✅ Chaque maîtrise est plafonnée au **niveau du personnage** (max 120)
- ✅ **Plafond total de maîtrises** : 300 (classique) → 330 (cap 110) → **360** (cap 120, update Legend 8 de 2011) — soit 3 maîtrises complètes
- ✅ **SP farming (GAP)** quasi indispensable pour « full farm » un build
- ✅ Hybrides STR/INT possibles (rapports 1:8, 2:1, etc.)
- ✅ Système d'**imbue** (enchantement élémentaire de l'arme) unique à la race CH

### Armes chinoises et stats
| Arme | Main | Stat dominante | Notes |
|---|---|---|---|
| Sword (épée) | 1M + bouclier | Magique/INT | Attaques rapides, permet bouclier |
| Blade (sabre) | 1M + bouclier | Physique/STR | Coups lents et forts, permet bouclier |
| Spear (lance) | 2M | Magique/INT | Arme 2M « mentale », critique élevé |
| Glaive (hallebarde) | 2M | Physique/STR | Plus haute attaque physique du jeu CH |
| Bow (arc) | 2M | Mixte | Consomme des flèches, portée |

> Les deux armes d'une même maîtrise partagent le même arbre (Bicheon = sword + blade, Heuksal = spear + glaive).

---

## ⚙️ Système de Maîtrises

### Les 7 Maîtrises Chinoises

| # | Maîtrise | ID client | Type | Focus |
|---|---|---|---|---|
| 1 | **Bicheon** | 257 | Arme | Sword/Blade — chaînes rapides, knockdown, bouclier |
| 2 | **Heuksal** | 258 | Arme | Spear/Glaive — dégâts physiques bruts, stun, spin AoE |
| 3 | **Pacheon** | 259 | Arme | Bow — distance, critiques, volées de flèches |
| 4 | **Cold** (Ice) | SKILL_CH_COLD_* | Force | Défense physique, ralentissements, gel |
| 5 | **Lightning** | SKILL_CH_LIGHTNING_* | Force | Vitesse, % attaque magique, parry, nukes rapides |
| 6 | **Fire** | SKILL_CH_FIRE_* | Force | Nukes les plus durs, burn, ATK PHY / DEF MAG |
| 7 | **Force** | SKILL_CH_WATER_* (276) | Force | Heal, cure, résurrection, debuffs, MP |

> 📝 Dans le fichier `skills.txt` analysé, les 3 éléments partagent le tag de groupe « 277 » et Force utilise « 276 » (Water) — quirk de l'extraction ; les véritables IDs de mastery côté serveur sont 257–259 (armes) et 273–276 (Cold/Lightning/Fire/Force). Les préfixes de codename (`SKILL_CH_COLD_`, etc.) sont le moyen le plus fiable d'identifier les éléments, identique sur tous les clients (KSRO/iSRO/vSRO).

### Règles de Base
- **+1 point de maîtrise par niveau** de personnage (investi dans la maîtrise de votre choix).
- **Une maîtrise ne peut pas dépasser votre niveau de personnage.**
- **Cap total** (somme toutes maîtrises confondues) : 300 à l'origine, 330 au cap 110, **360 au cap 120** (3 masteries à 120).
- En pratique on monte **2 à 3 maîtrises** (le SP est le facteur limitant, pas le cap).
- Les **livres de skills** d'une série se débloquent tous les ~20-22 niveaux de maîtrise (ex. Bicheon Smash : 5 → 27 → 49 → 71 → 93/96 → 120), et chaque livre se re-up de **+2 niveaux de maîtrise par palier** (9-10 niveaux standard, jusqu'à 22 sur les livres « étendus » des versions tardives).

---

## 🗡️ Maîtrises d'Armes

### 1. BICHEON (Sword / Blade)

**Armes :** Sword (rapide, magique) ou Blade (lent, physique) — bouclier possible (1M).

**Caractéristiques :**
- ✅ Attaques fluides, bon DPS soutenu
- ✅ **Meilleur ratio de parry/block** (passif Shield Protection + bouclier)
- ✅ Chaîne complète de **knockdown → stab** (Hidden Blade → Killing Heaven Blade)
- ✅ Deux attaques à distance pour lurer (Blade Force, Sword Dance)
- ❌ Dégâts unitaires plus faibles que la glaive
- ❌ Build le **plus coûteux en SP** (~200k SP au cap 80)

**Séries clés :**
| Série (nom officiel) | Rôle |
|---|---|
| Smashing Sword Series | Coups simples lourds (Strike/Stab/Crosswise Smash) |
| Chain Sword Attack Series | Chaînes multi-hits (Illusion → Blood → Billow → Ascension → Heaven → Lightning → Thousand Army → Heavenly Chain) |
| Hidden Blade Series | **Knockdown** (Blood/Soul/Demon/Ocean/Sky Blade Force) |
| Killing Heaven Blade Series | **Stab sur cible au sol** (Flower Bloom/Bud Blade, Asura Cut Blade…) — le finisher du KD |
| Shield Technique Series | Posture défensive avec bouclier (Castle/Mountain/Ironwall Shield) |
| Blade Force Series | Attaques à **distance** pour lurer (Soul/Evil/Devil Cut Blade) |
| Sword Dance Series | AoE de zone (Snake/Petal/Typhoon Sword Dance) |
| Shield Protection Series (passif) | Block ratio |

**Playstyle :** melee 1v1 redoutable (cycle « 5 stabs » : KD → stabs Killing Heaven), tanky avec bouclier + Ice. Très fort en PvP avec imbue Lightning (shock = parry down).

### 2. HEUKSAL (Spear / Glaive)

**Armes :** Spear (2M, magique — arme des nukers hybrides) ou Glaive (2M, physique — plus forte arme PHY CH).

**Caractéristiques :**
- ✅ **Dégâts physiques les plus élevés** (glaive full STR)
- ✅ Le seul arbre CH avec un vrai **stun** (Soul Departs Spear Series)
- ✅ Spin AoE permanent (Bloody Fan Storm etc.) = excellent farm
- ✅ Passif HP (Cheolsam Force)
- ❌ Pas de bouclier (2M), attaquants lents
- ❌ Builds full PHY n'utilisent **pas d'imbue** (stats physiques pures)

**Séries clés :**
| Série | Rôle |
|---|---|
| Heuksal Spear Series (front) | Enchaînements frontaux (Dancing Demon → Spirit Crash → Death Bringer Spear) |
| Soul Departs Spear Series | **Stun** (Soul Spear - Move/Truth/Soul/Emperor…) — « le meilleur stun du jeu CH » |
| Ghost Spear Attack Series | AoE tournoyante autour de soi (Ghost Spear - Petal → Sea God) |
| Chain Spear Attack Series | Chaînes multi-hits (Tiger → Nachal → Shura → Pluto → Dragon → Phoenix → Heaven) |
| Flying Dragon Spear Series | Lancer de lance à distance (Flying Dragon - Flow → Sky) |
| Storm Series (SPIN) | Transforme l'attaque de base en **tourbillon AoE** (Bloody Fan/Wolf/Snake Storm…) — à maxer absolument |
| Série Pierce | Coups perforants simples (Wolf Bite, Waning Moon, Yuhon Spear…) |
| Cheolsam Force (passif) | **+ HP maximum** |

**Playstyle :** boucher/tueur PvE (spin + Ghost Spear), burst PvP (stun Soul Spear → Ghost Spear). Le glaive full STR est le farmeur par excellence.

### 3. PACHEON (Bow)

**Armes :** Bow (flèches). Builds STR (crit) ou INT (nuker distance) tous deux viables.

**Caractéristiques :**
- ✅ **Portée** (la plus grande du jeu CH, encore étendue par les Soul Arrow)
- ✅ Fortes chances de **critique** (Anti Devil Bow Series)
- ✅ Kiting (Wind Walk de Lightning)
- ❌ Faible en mêlée — dépend des cooldowns
- ❌ Consomme des flèches

**Séries clés :**
| Série | Rôle |
|---|---|
| Anti Devil Bow Series | Tirs **critiques** mono-cible (Missile → … → Moon light) |
| Arrow Combo Attack Series | Volées multi-flèches (2 → 7 Arrow Combo) |
| Autumn Wind Arrow Series | Flèches **perforantes** (traversent plusieurs cibles en ligne) |
| Explosion Arrow Series | Flèches **explosives AoE** (Berserker/Demon/Devil/Celestial Beast/Pitch Black Arrow) |
| Strong Bow Series | Tirs chargés lourds (Spirit → Destruction) |
| Mind Bow Series | Attaque **omnidirectionnelle 360°** (3-6 cibles) — salvatrice en mêlée |
| Soul Arrow Series | **Buff de portée** (Demon/Bloody/Dragon/Phoenix Soul Arrow) — quasi obligatoire |
| Hawk Summon Series | Invocations de faucons (White/Black/Blue/Lightning/Ice/Fire Hawk) |
| Mind Concentration (passif) | **Attack rating (précision)** |

**Playstyle :** DPS à distance, chasse d'uniques (Isyutaru etc.), très bon avec imbue Fire (burn) pour finir les cibles en kiting.

---

## 🔮 Maîtrises de Force (Éléments)

### 4. COLD (Ice) — 🧊

**Focus :** défense physique et crowd control. L'imbue la plus faible en dégâts mais le contrôle le plus fort.

**Effets clés :**
- **Frostbite** (~40% de chance via l'imbue) : réduit vitesse d'attaque ET de déplacement
- **Freezing** (~20% de chance) : **immobilise complètement** la cible — le CC le plus puissant en PvP CH
- Buffs : **Frost Guard Series** (+ DEF physique, permanente), murs (Frost Wall) qui absorbent ET bloquent le passage, **Snow Shield** (boucle les dégâts sur le MP), AoE de gel (Frost Nova)
- Passif : **Cold Armor** (+27 DEF PHY au max — modeste)

**Nukes :** Snow Storm Series — dégâts les plus faibles des 3 éléments mais forte AoE + gel (Ice shot 4 s, Ice rain/Double/Multi Shot 10 s de cooldown).

### 5. LIGHTNING — ⚡

**Focus :** vitesse, amplification magique, parry. L'élément « qualité de vie » : quasi tous les builds CH y prennent au moins quelques points.

**Effets clés :**
- **Piercing Force Series** : buff **% attaque magique** (+5% au début, >10% aux derniers livres) — indispensable aux nukers
- **Wind Walk Series** : buffs de vitesse ; **Ghost Walk = téléportation** courte, Grass Walk = +vitesse (≈ +50% au max)
- **Concentration Series** : buff de **parry ratio** (durée 300 s)
- Imbue Lightning : dégâts intermédiaires, status **shock** qui **réduit le parry ratio** de la cible + dégâts de splash
- Passif : **Heaven's Force** (+ parry ratio)

**Nukes :** Lion Shout Series (petits nukes rapides, cd 3-4 s, avec des **groupes de cooldown liés**) et Thunderbolt Force Series (Wolf's → God's Thunderbolt, cd 6 s).

### 6. FIRE — 🔥

**Focus :** dégâts. L'imbue la plus forte et les nukes les plus durs (Flame Wave Series).

**Effets clés :**
- Imbue Fire : status **Burn** (DoT) — 25% de probabilité au niveau 1 du premier livre (durée ~6 s), probabilité/durée/effet croissent avec le niveau du skill
- **Flame Body Series** : buff **% attaque physique** — le buff offensif des builds STR (à ne pas confondre avec Piercing Force de Lightning, qui augmente l'attaque magique)
- **Fire Protection Series** : buff **défense magique** — réponse CH aux nukers
- **Fire Shield Series** : buff qui **réduit les mauvais statuts** (burn/shock/freeze…) — ~50% de réduction au max (76 unités d'effet)
- Fire Wall Series : mur de feu (absorbe + bloque, comme le Frost Wall)
- Fire Combustion (Firefly/Light, Vision/Sunrise) : récupération de MP (cd 180 s)
- Passif : **Flame Devil Force** (+ attaque physique)

**Nukes :** Flame Wave Series — Arrow (cd 4 s), Burning (6 s), **Wide** (10 s, la référence), Bomb (4 s), HellFire, Disintegrate, God. « Dégâts élevés, petite AoE » vs Snow Storm « dégâts moindres, grosse AoE ».

### 7. FORCE — 💪 (Série « Water » dans le client : `SKILL_CH_WATER_*`)

**Focus :** soutien — heal, cure, résurrection, debuffs. Le « prêtre » chinois, jouable en hybrid.

**Effets clés :**
- **Self Heal Series** : heal de soi (Self Breathe/Force/Wounds/Vital Heal)
- **Heal Series** : heal d'une cible (Medical Hand → Ghost/Taoist/Mysterious/Full Hand)
- **Force Cure Series** : dissipe les statuts (Poison/Body/Condition/Vital/Meditation/overall) — **seul moyen de cleaner Freeze/Burn** (les pilules universelles ne les retirent pas)
- **Rebirth Art Series** : **résurrection** (Soul/Ghost/Spirit/Return/Godly Rebirth Art) avec % d'XP rendu croissant
- **Harmony Therapy Series** : HoT/Régén de groupe (cd 300 s)
- **Vital Spot Attack Series** : debuffs — Muscle (ATK PHY −), Spirit (ATK MAG −), puis Body=Mind=Zero=Brain appliquent **Decay/Weaken/Impotent/Division** (probabilité 100% → 80% sur Origin Mobile)
- **Vital Flow Series** (Move/Strength/Intellect/Circulate) : récupération HP/MP
- **Cure Therapy Series** : cure de zone (Pure/Protection/Clarity)
- Passif : **Force Increasing** (+ MP maximum)

**Playstyle :** support en party (job party, FW), ou second masterie d'un hybride. Aucun dégât direct — à coupler avec une arme.

---

## 🔮 Imbues Élémentaires

Les trois éléments offensifs offrent une **imbue** (série `*_GIGONGTA`) : un buff d'arme qui ajoute des dégâts magiques à vos attaques normales et peut appliquer un statut.

| Imbue (série) | Dégâts ajoutés | Statut | Notes |
|---|---|---|---|
| Fire Force (River → God Fire Force) | **Les plus élevés** | **Burn** (DoT ~6 s, 25% au lv1 du livre 1) | Meilleur DPS PvE (le burn finit les mobs) |
| Thunder Force (Thunder Tiger → God Force) | Intermédiaires | **Shock** (réduit le **parry ratio** de la cible) + splash | Aimé des bladers (parry déjà élevé) |
| Cold Force (Ice River → Ice Final Force) | Les plus faibles | **Frostbite** (~40%, ralentit) + **Freeze** (~20%, immobilise) | Contrôle maximal PvP |

**Règles :**
- ⚠️ **Une seule imbue active à la fois** — elles ne se cumulent pas.
- La probabilité, la durée et la puissance du statut **augmentent avec le niveau du skill**.
- Les imbues se réactivent sur cooldown (6 s → 21 s selon le livre) : c'est un toggle.
- Les statuts (burn/freeze) **ne sont pas dissipés par les pilules universelles** — il faut Force Cure ; les pilules small/medium/large soignent ~33/50/76 unités d'effet.
- Le **STUN** n'est pas un « effet » mais un état : aucune pilule ne le retire.
- **Fire Shield Series** (buff Fire) réduit la durée/l'ampleur des statuts subis (~50% au max).

---

## 📊 Système de Mastery Points

### Conversion et coûts
- Tuer un monstre donne de l'XP **et** du SP-exp (skill exp) : **400 skill exp = 1 SP** (constante, toutes versions).
- Le coût SP d'un niveau de skill ≈ valeur de la table au **(niveau de maîtrise requis + 1)**. Exemple : Wind Walk lv1 (maîtrise 12) coûte ~15 SP ; monter une maîtrise de 11 → 12 coûte ~12 SP.
- Les montées deviennent très vite exponentielles : les gros livres (maîtrise 70+) coûtent des centaines/milliers de SP par niveau.

### Caps de maîtrise
| Époque / cap de niveau | Cap total masteries | Équivalent |
|---|---|---|
| Classique (≤ cap 70/80/90) | **300** | 3 maîtrises à ~90-100 |
| Cap 100 | 300 | 3 × 100 |
| Cap 110 | **330** | 3 × 110 |
| Cap 120 (Legend 8, 2011 → actuel) | **360** | 3 × 120 |

Chaque maîtrise individuellement est toujours plafonnée **au niveau du personnage**.

### Progression typique
- **Niveau 1-30 :** 1 maîtrise d'arme + 1 élément léger (Lightning pour la vitesse), GAP 0-5.
- **Niveau 30-60 :** 2-3 maîtrises actives, GAP de farm choisi (voir ci-dessous).
- **Niveau 60+ :** spécialisation ; le 3ᵉ élément complet seulement si le SP suit.
- **Reskill :** quête « Skill Resuscitation » (dès le lvl 20, cœurs maudits de Grocies/etc. : 10 cœurs → 1 potion, rembourse **80% du SP dépensé**).

---

## 🔄 SP Farming et GAP

### Le GAP
**GAP = niveau du personnage − niveau de maîtrise le plus élevé** (0 à 9). Plus le GAP est grand, plus la part de skill exp augmente au détriment de l'XP.

**Ratio XP/SP cumulé par monstre selon le GAP (guide UnKnoWnCheaTs) :**

| GAP | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 |
|---|---|---|---|---|---|---|---|---|---|---|
| XP relatif | 19,4 | 15,9 | 13,0 | 10,4 | 8,3 | 6,5 | 4,9 | 3,5 | 2,2 | 1,0 |
| SP relatif | 1,0 | 1,2 | 1,5 | 1,9 | 2,3 | 3,0 | 4,0 | 5,6 | 8,9 | **19,4** |

→ À GAP 9 on gagne **~20× plus de SP par point d'XP** qu'à GAP 0.

**SP cumulé selon le GAP (niveau du perso) :**

| Niveau | GAP 0 | GAP 5 | GAP 9 |
|---|---|---|---|
| 30 | 3 911 | 11 660 | 75 074 |
| 45 | 6 672 | 19 855 | 128 041 |
| 60 | 9 884 | 29 436 | 189 675 |

### Zones et méthodes classiques (iSRO)
- **1-20 :** Jangan environs, GAP 0-2, montée normale.
- **20-40 :** Bandit Stronghold / Yeohwa, GAP 4-5.
- **40-60 :** Penon/Niya (Taklamakan plus tard), GAP 7-9, full garment (économie de MP), potions MP.
- **60+ :** farm ciblé au GAP max supportable (Roc Mountain, Jangan Cave…).
- Le SP-exp ne dépend pas des dégâts : tuer vite ET beaucoup > tout. Party de farm OK.

### Combien de SP ? (estimations communautaires au cap 80)
| Build | SP « fully farmed » |
|---|---|
| Pure STR **Glaive** (Heuksal+Fire+Lightning) | ~**80 000** |
| Pure STR **Bow** (Pacheon+Fire+Lightning) | ~**90-100 000** |
| Pure STR **Blader** (Bicheon+Lightning+Fire) | ~**200 000** (séries nombreuses) |
| Build 3 maîtrises complet vers lvl 60 | ~92 000 (exemple guide UC) |

> Au cap 120 actuel, un build « full farmed » se compte en **centaines de milliers de SP** (les valeurs exactes dépendent des skills choisis).

---

## 🎮 Builds Classiques

### 1. Pure STR Glaive — « Glaiver » 🔥
**Masteries :** Heuksal + Fire + Lightning (variante : Force au lieu de Lightning)
- Full STR, armure **armor** (max DEF physique) — les HP du passif Cheolsam compensent un peu le côté « glass cannon ».
- **Pas d'imbue** : dégâts 100% physiques, on compte sur KD/stab et le spin.
- Burst : Soul Spear (stun) → Ghost Spear → chaînes ; farm : Bloody Fan Storm (spin) → tout agro → Ghost Spear AoE.
- Buffs : Flame Body (ATK PHY), Fire Protection (DEF MAG), Grass Walk, Cheolsam (HP).
- ~80k SP au cap 80. Le meilleur farmeur solo CH.

### 2. Pure STR Bow 🔥
**Masteries :** Pacheon + Fire + Lightning
- Critiques Anti Devil + imbue **Fire** (burn pendant le kiting) + Soul Arrow (portée).
- Excellent sur les uniques et le jobbing ; faible si coincé en mêlée (Mind Bow 360° = plan B).
- ~90-100k SP au cap 80.

### 3. Pure STR Blader ⚔️
**Masteries :** Bicheon + Lightning (+ Fire ou Cold)
- Imbue **Lightning** (shock = parry down → profite au 1v1).
- Cycle signature : **Hidden Blade (KD) → Killing Heaven Blade (stabs)** ×5 (« 5 stabs »).
- Bouclier + Shield Technique + Cold (Frost Guard/Freeze) = tank PvP.
- ~200k SP au cap 80 : le build le plus cher.

### 4. Pure INT Nuker — Sword/Spear/Bow 📈
**Masteries :** arme (souvent Heuksal spear ou Bicheon sword+shield) + **Fire + Lightning** (+ Cold défensif)
- DPS magique pur : **Flame Wave** (Fire, le plus fort) et/ou **Wolf's Thunderbolt** (Lightning), **Snow Storm** (Cold, AoE).
- Buffs : Piercing Force (+% ATK MAG), Concentration (parry), Grass Walk, Fire Protection.
- Défense : Snow Shield (Cold, absorbe avec le MP), murs Fire/Frost, bouclier si sword.
- « Les plus gros dégâts du jeu, la plus faible défense ». Variante bow nuker = kitabilit é maximale.

### 5. Hybrides (1:8, 2:1, 7:1…) ⚖️
- **Hybrid spear nuker 1:8** (8 INT : 1 STR) : nukes + quelques HP/parry ; Fire > Lightning en dégâts même buffé, Lightning gardé pour Ghost Walk/Piercing Force.
- **Hybrid STR glaive/blader 7:1** : dégâts physiques + nukes de finish + MP confortable.
- Les hybrides utilisent les DEUX familles de dégâts : imbue + nuke + coups PHY.

### 6. Force Hybrid / Support 💚
**Masteries :** arme + Force + (Cold ou Fire)
- Heal, rez (Rebirth Art), cures (Force Cure), debuffs Vital Spot (Decay/Weaken/Impotent/Division).
- Puissant en Fortress War / job party et pour farmer en économisant les potions.

---

## ⏱️ Cooldowns, Combos et Zerk

### Groupes / linkages de cooldown (données officielles Origin Mobile)
- **Lion Shout Series (Lightning)** : Shock/Earth/Execution partagent un même groupe de CD ; Heaven/Power un autre (empêche de spammer tous les livres) — CD 3-4 s par livre.
- **Sword Dance Series** : CD 8 s (réduit à 6 s sur Origin Mobile).
- **Mind Bow Series** : CD 8 s (6 s ajusté), attaque 360° sur 3-6 cibles.
- Les livres d'une même série d'attaque partagent souvent le cooldown du plus long : on « cycle » les séries plutôt qu'on ne les spamme.
- Cooldowns de base (client) : smash 3 s, chaînes 8 s, nukes 4-10 s, murs 10 s (Cold) / 5 s (Fire), Shield Technique 60 s, Storm (spin) 60 s, gros buffs 180 s (Snow Shield, Fire Combustion, Bicheon Force), Harmony Therapy 300 s.

### Combos célèbres
- **« 5 stabs » blader** : Hidden Blade (KD) → 4× Killing Heaven Blade (stabs sur cible au sol) — répéter en achetant du temps (Snow Shield, murs).
- **Stun-lock glaive** : Soul Spear - Move (stun) → Ghost Spear → Chain Spear.
- **Kiting nuker/bow** : nuke → Ghost Walk (téléport) → nuke ; walls pour couper la poursuite (les murs **bloquent physiquement le passage**).

### Zerk (Berserk / Fury)
- La jauge de fureur se remplit en **attaquant/tuant** (orbes) ; pleine (4 orbes) → **mode Berserk** : dégâts et vitesse accrus, durée limitée.
- **Blue Zerk** (mode ultime) : quêtes CH niveau **95** (« Captain », Jangan : Sonhyeon, Miaoryeong, cloche des Stone Ghosts, capture de Niya General aux pièges, tuer le Lost Spirit **en zerk actif**) puis niveau **100** (« General »). Titre jaune affiché devant le nom + potion de récupération de zerk.

---

## 📜 Résumé des Arbres de Skills

> Liste exhaustive (livres, niveaux de maîtrise, temps) → voir **[SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md)**.

| Maîtrise | Séries principales | Passif |
|---|---|---|
| **Bicheon** | Smashing Sword, Chain Sword Attack, Hidden Blade (KD), Killing Heaven Blade (stab), Shield Technique, Blade Force, Sword Dance, Bicheon Force (tardive) | Shield Protection (block) |
| **Heuksal** | Heuksal Spear (front), Soul Departs Spear (stun), Ghost Spear Attack (AoE), Chain Spear Attack, Flying Dragon Spear, Storm/spin, Pierce | Cheolsam Force (HP) |
| **Pacheon** | Anti Devil Bow (crit), Arrow Combo, Autumn Wind (perfo), Explosion Arrow (AoE), Strong Bow, Mind Bow (360°), Soul Arrow (portée), Hawk Summon | Mind Concentration (précision) |
| **Cold** | Cold Force (imbue), Frost Guard (DEF), Cold Wave (gel à distance), Frost Wall, Frost Nova (AoE gel), Snow Storm (nuke), Snow Shield (MP absorb) | Cold Armor (DEF) |
| **Lightning** | Thunder Force (imbue), Piercing Force (% ATK MAG), Wind Walk (vitesse/téléport), Lion Shout (mini-nuke), Concentration (parry), Thunderbolt Force (nuke) | Heaven's Force (parry) |
| **Fire** | Fire Force (imbue burn), Fire Shield (anti-statut), Flame Body (% ATK PHY), Fire Protection (DEF MAG), Fire Wall, Flame Wave (nuke), Fire Combustion (MP) | Flame Devil Force (ATK PHY) |
| **Force** | Self Heal, Heal, Force Cure, Rebirth Art (rez), Harmony Therapy, Vital Spot (debuffs), Vital Flow, Cure Therapy | Force Increasing (MP) |

---

## ❓ FAQ

**Q : Combien de maîtrises puis-je monter ?**
R : Toutes peuvent recevoir des points, mais le cap total (300/330/360 selon l'époque) et le SP limitent en pratique à **2-3 maîtrises complètes** (3 × 120 = 360 au cap actuel).

**Q : Quel est le meilleur élément ?**
R : Fire = dégâts, Cold = défense/contrôle, Lightning = vitesse et % magique. La plupart des builds prennent Fire ou Cold en principal + Lightning en utilitaire.

**Q : Les imbues se cumulent-elles ?**
R : Non, **une seule active** (toggle). Fire = DPS, Ice = contrôle, Lightning = anti-parry.

**Q : SP farming obligatoire ?**
R : Pour un build complet, oui : à GAP 0 vous gagnerez ~20× moins de SP qu'à GAP 9. Un glaive full farm demande ~80k SP dès le cap 80.

**Q : Un pure STR peut-il nuker ?**
R : Mal — les nukes scalent sur l'attaque magique (INT). Les hybrides (7:1, 2:1) mélangent les deux avec succès.

**Q : Comment retirer un Burn/Freeze ?**
R : Pilules élémentaires/pilules universelles NE suffisent PAS pour freeze/burn : il faut le **Force Cure** chinois (ou attendre). Pilules small/medium/large = ~33/50/76 unités d'effet.

**Q : Comment refaire mon build ?**
R : Quête Skill Resuscitation (lvl 20+, cœurs maudits → potion) : rembourse 80% du SP.

**Q : Différences de noms KSRO/iSRO ?**
R : Les noms affichés varient peu ; l'identifiant fiable et universel est le **codename** (`SKILL_CH_FIRE_GIGONGSUL_A_01`…) identique sur tous les clients — c'est ce que SRObro doit utiliser en interne.

---

## 🔗 Resources

### Données de référence (client / officiel)
- [tarekwiz/SilkroadBot — skills.txt (GitHub)](https://github.com/tarekwiz/SilkroadBot/blob/master/Silkroad%20Fusion/bin/Debug/Data/skills.txt) — extraction client : codenames, noms iSRO, cast/cd, niveaux requis (source principale des tableaux)
- [Silkroad Origin Mobile — Class Balance Adjustments](https://sromobile.com/en/news/updates/class-balance-adjustments) — noms de séries officiels, puissances de skills, linkages de cooldown
- [DummkopfOfHachtenduden (DaxterSoul)/SilkroadDoc (GitHub)](https://github.com/DummkopfOfHachtenduden/SilkroadDoc) — documentation formats de fichiers/packets (skilldata)
- [Ex-o/Silkroad-Database-Documentation (GitHub)](https://github.com/Ex-o/Silkroad-Database-Documentation) — structure de la BDD (_RefSkill & co)
- [JellyBitz/SR_Db2Media (GitHub)](https://github.com/JellyBitz/SR_Db2Media) — extraction BDD → client (skilldata)

### Guides mécaniques
- [UnKnoWnCheaTs — Complete Guide to Skill Points](https://unknowncheats.me/wiki/Silkroad:Complete_Guide_to_Skill_Points) — SP, GAP, caps mastery, quête reskill
- [UnKnoWnCheaTs — SRO General Tips and Stats](https://www.unknowncheats.me/forum/silkroad/38774-sro-tips-stats.html) — stats, imbues, statuts, pilules
- [UnKnoWnCheaTs — Building Blade Guide](https://www.unknowncheats.me/wiki/Silkroad:Building_Blade_Guide) — détail des séries Bicheon/Cold/Lightning
- [SilkroadForums — PURE STR BUILD](http://www.silkroadforums.com/viewtopic.php?f=5&t=82222) — builds STR glaive/bow/blader, SP, combos KD-stab
- [SilkroadForums — Blade or Glaive?](http://www.silkroadforums.com/viewtopic.php?f=4&t=24506) — SP blader vs glaiver

### Wiki / vue d'ensemble
- [Silkroad Online Wiki (Fandom) — Skills](https://silkroadonline.fandom.com/wiki/Skills) — gap, 400 skill exp = 1 SP, cap 360
- [StrategyWiki — Silkroad Online/Gameplay](https://strategywiki.org/wiki/Silkroad_Online/Gameplay) — système de masteries/séries
- [IGN — Chinese classes](https://ign.com/wikis/silkroad-online/Chinese_classes) — rôles des forces, nukers
- [NomadicGamer — Legend 8 (mastery 330→360)](https://nomadicgamer.wordpress.com/2011/08/02/silkroad-online-introduces-legend-8-mysterious-temple-of-jupiter)

### Communauté
- [elitepvpers — SRO Guides & Templates](https://www.elitepvpers.com/forum/sro-guides-templates/) (BlackStar Pure INT, STR bow guides…)
- [r/silkroadonline](https://www.reddit.com/r/silkroadonline/)
- [Silkroad Forums](http://www.silkroadforums.com/)
- [FGWGame — Quête Blue Zerk CH lvl 95](https://fgwgame.com/guides/silkroad-online-ch-level-95-captain-quest-for-blue-zerk)

---

*Dernière mise à jour : 2026-10-01*
*Sources : skills.txt client (GitHub SilkroadBot), notes officielles Silkroad Origin Mobile, UnKnoWnCheaTs wiki/forums, SilkroadForums, Fandom Wiki, StrategyWiki, IGN, elitepvpers, Reddit. Chiffres marqués « ~ » = estimations communautaires ; les valeurs par niveau (dégâts min/max, MP, SP exact par palier) restent à extraire de `skilldata_5000`/`_RefSkill`.*
