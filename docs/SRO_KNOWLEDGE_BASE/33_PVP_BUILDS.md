# Builds PvP - Guide Complet

> ⚠️ **Révision majeure (2026-10)** : ce document a été réécrit après recherche communautaire exhaustive (elitepvpers, SilkroadForums, PlayOrigin, GamersDecide, MMORPG.com, UnKnoWnCheaTs, Seidenkraft, ZsZC wiki, ExaySRO, Reddit). Les noms de skills inventés des anciennes versions (« Chain Crash », « Guard Buff », « Lunar Potion », « Fatal Storm », « Spear Nuke Series »…) ont été remplacés par les **vrais noms iSRO** (cohérents avec [02_CHINESE_CLASSES.md](02_CHINESE_CLASSES.md) et [03_EUROPEAN_CLASSES.md)). Les blocs de stats chiffrés invérifiables (HP/MP exacts par build) et les « sources » coréennes/turques 2024-2026 aux URLs introuvables ont été supprimés — seules des données sourcées sont conservées, les incertitudes sont signalées.

## 📋 Table des Matières
- [Introduction](#-introduction)
- [Mécaniques PvP à connaître](#-mécaniques-pvp-à-connaître)
- [Tier Lists PvP par Cap](#-tier-lists-pvp-par-cap)
- [Builds Européens](#-builds-européens)
- [Builds Chinois](#-builds-chinois)
- [Hybrides CH : Ratios et Builds](#-hybrides-ch--ratios-et-builds)
- [Rotations PvP Emblématiques](#-rotations-pvp-emblématiques)
- [Counters et Matchups](#-counters-et-matchups)
- [PvP de Groupe et Fortress War](#-pvp-de-groupe-et-fortress-war)
- [Gear et Équipement PvP](#-gear-et-équipement-pvp)
- [Erreurs Courantes en PvP](#-erreurs-courantes-en-pvp)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🎯 Introduction

Le **PvP (Player versus Player)** se pratique en 1v1 (duels, jobbing), en petit comité (Cave, Job Cave, events) et en masse (**Fortress War**, Battle Arena, CTF). Le « build » — race, stats, masteries, stuff — détermine le potentiel, mais le skill du joueur (animation cancel, switch d'armes, gestion des cooldowns) fait la différence à équipement égal.

### Les deux familles de builds
| | Chinois | Européen |
|---|---|---|
| **Principe** | 7 masteries libres (3 maxées max), stats STR/INT libres | 2 masteries de classe (2 × niveau max), stats liées à la classe |
| **Stats** | 3 points/niveau → full STR, full INT ou hybride | Full STR (Warrior/Rogue) ou full INT (Wiz/Warlock/Bard/Cleric) |
| **Soins** | Potions quasi sans délai, Force (heal/cure) en sub | **Délai de potion de 15 s** → dépendance Cleric/Bard |
| **Force en PvP** | 1v1 autonome, hybridation possible | Burst le plus élevé, contrôle de masse, synergy de party |
| **Faiblesse** | Moins de burst coordonné en groupe | Binaire, fragile solo, prévisible |

### Points clés pour choisir
- ✅ **1v1 solo/autonome** → Warrior/Cleric, Rogue/Cleric (EU) ; Blader/Glaive (CH)
- ✅ **PvP de masse (FW/BA/CTF)** → Wizard, Warlock, Bard + tanks EU
- ✅ **Jobbing/petits fights** → Force Bower, Ice Bow, Rogue (stealth), Warlock/Cleric
- ✅ **Débutant** → Warrior/Cleric (pardonnable) ; **vétéran** → Rogue, Warlock, Blader (skill ceiling élevé)

---

## ⚔️ Mécaniques PvP à connaître

### Attack Rating vs Parry Ratio
- **Attack rating** (précision) du joueur vs **parry ratio** de la cible : détermine la variance/réduction des dégâts. Un build qui ignore ces stats voit ses dégâts « parés » en partie.
- Les passifs CH y pourvoient : **Mind Concentration** (Pacheon, +attack rating), **Heaven's Force** (Lightning, +parry), **Shield Protection** (Bicheon, +block), **Cold Armor** (Cold, +DEF PHY).
- L'imbue **Lightning (Thunder Force)** applique **Shock**, qui **réduit le parry ratio** de la cible — d'où sa popularité chez les bladers.

### Knockdown et cibles au sol
- Certaines attaques ont une **chance de knockdown (KD)** : Hidden Blade Series (Bicheon), Ocean/Demon Blade Force (~50 %), Hurricane Shot (xbow Rogue), Turn Rising (Warrior 2H), Charged Squall (Wizard, knockback).
- Une cible au sol encaisse les **attaques « stab »/bonus vs sol** : Killing Heaven Blade (stabs), Mortal Wounds (Rogue), Triple Swing (Warrior). Le fameux cycle « **KD → stabs** » est né de cette règle.

### Statuts et contrôles
- **CH (imbues)** : Burn (Fire, DoT), Shock (Lightning, −parry), Frostbite/Freezing (Cold, ralentit/immobilise). Les pilules universelles ne retirent **pas** Burn/Freeze — seul **Force Cure** les dissipe.
- **EU (Warlock)** : Decay (−DEF PHY), Weaken (−défenses), Impotent (−ATK PHY/MAG), **Division (+30 % dégâts subis)**, Stun (~80 %), Slumber (sommeil, brisé si attaqué), Fear, Dull, Panic, Short Sight, Darkness, Bind. Voir [03_EUROPEAN_CLASSES.md](03_EUROPEAN_CLASSES.md#4-warlock).
- **Anti-CC** : Holy Word → **Holy Spell** (Cleric), Fire Shield Series (CH, ~50 % de réduction des statuts), Scream Mask/Reflect (Warlock).

### Délai de potion européen (15 s)
- Un EU ne peut pas « pot-spam » : la survie vient du **Cleric** (Healing Cycle/Orbit, Recovery Division, Group Healing) et des **buffs défensifs** (Iron/Mana Skin, Bless Spell, Screen).
- Le CH, sans délai de potion, est naturellement autonome — c'est LA différence structurelle entre les races en PvP.

### Divers
- **Zerk (Fury)** : jauge à 4 orbes → mode Berserk (dégâts/vitesse accrus). En PvP de groupe, se « refaire un zerk » sur les orbes proches est un art. Blue Zerk CH via quêtes 95/100.
- **Animation cancel** : l'animation de Fire Blow/Salamander Blow (Wizard) est **annulable** (Detect, Earth Barrier) ; le switch d'arme EU permet d'enchaîner plus vite. Techniquement essentiel à haut niveau.
- **Stealth vs Detect** : le Rogue (Stealth) est révélé par **Detect/Sprawl Detect** (Wizard) — matchup clé en group PvP.

---

## 🏆 Tier Lists PvP par Cap

### Cap 80 — Tier list détaillée (PlayOrigin, stuff +5 / 60 %)

> Source : [80 Cap Tier List for 1v1 PvP, Job, Party PvP (Ctf, BA) and PvE](https://forum.playorigin.com/showthread.php?1050-80-Cap-Tier-List-for-1v1-PvP-Job-Party-PvP-(Ctf-BA)-and-PvE) — la tier list communautaire la plus structurée trouvée. Elle suppose un stuff égal (+5, 60 % stats) : le classement vient donc du build, pas du wallet.

| Catégorie | Haut du classement | Notes du fil |
|---|---|---|
| **1v1 PvP** | **S : Warrior/Cleric** | « The bread and butter of european pure STR » — Dare Devil + Iron/Mana Skin + heals : quasi impossible à tuer en 1v1 |
| **1v1 PvP** | **S : Rogue/Cleric** | Plus gros burst PHY du jeu, ouvre en Stealth |
| **1v1 PvP** | **A (3e) : Warlock/Cleric** | Debuffs + stuns + sleep ; moins fort si l'adversaire a Holy Spell |
| **1v1 PvP** | **B : Warrior/Rogue, Warlock hybrides** | Manquent de sustain |
| **Jobbing / solo PK** | **S : Wizard/Bard, INT Spear Nuker** | Mobilité + burst/DoT, kite infini |
| **Party PvP (CTF/BA)** | **Warrior/Cleric, Wizard/Cleric, Warlock/Cleric** | Sustain + AoE + debuffs |
| **CH au cap 80** | Blader STR, Glaive STR, Bower | Solides en 1v1 ; le nuker INT domine le farm |

### Cap 90-110 — Consensus communautaire (elitepvpers, GamersDecide, Reddit)

> ⚠️ Il n'existe pas de tier list 110 « officielle » unique : le classement ci-dessous agrège les fils récurrents ([Best build for cap 110](https://www.elitepvpers.com/forum/silkroad-online/505150-best-build-cap-110-a.html), [Best build for 110/120 cap](https://www.elitepvpers.com/forum/silkroad-online/1785646-best-build-110-120-cap.html), [Top 10 GamersDecide](https://www.gamersdecide.com/articles/silkroad-best-builds), [guide Reddit returning players](https://www.reddit.com/r/silkroadonline/comments/1wfn2h6/for_anyone_new_or_returning_to_silkroad_i_put/)).

| Build | Race | Rang consensus | Pourquoi |
|---|---|---|---|
| **Warrior/Cleric** | EU | **S+ 1v1** | « Warrior still remains the best PvP char » (elitepvpers 110) — tank, heals, Dare Devil |
| **Rogue/Cleric (dagger)** | EU | **S 1v1** | Burst critique monstrueux, Stealth ; fragile si le burst passe pas |
| **Force Blader (Bicheon/Fire/Force)** | CH | **S 1v1** | #1 du top 10 GamersDecide ; debuffs Force + KD/stabs + bouclier |
| **Force Bower (Pacheon/Fire/Force)** | CH | **S jobbing** | « PvP god » pour le job war : debuffs, stun/KB, rez de ses thugs |
| **Glaive STR** | CH | **A 1v1** | Très tanky, très bon burst PHY ; #2 GamersDecide, star des guild wars CH |
| **Warlock/Cleric** | EU | **A 1v1** | Décroît un peu au 110 (résistances/statut plus faciles à gemmer) |
| **Wizard/Cleric** | EU | **A 1v1 / S group** | Le + joué du jeu ; énorme en masse, kite en 1v1 |
| **INT Spear Nuker / S-S Nuker** | CH | **B+ 1v1** | One-shot potentiel, mais meurt au moindre KD/crit |
| **Ice Bow STR** | CH | **A jobbing** | Cold = anti-nuker/warlock (Ice Wall, freeze), très pénible à tuer |
| **Blader Lightning (sans Force)** | CH | **A** | Le plus cher en SP mais redoutable avec Shield Technique + freeze |

### Cap 120+ — Méta des serveurs récents/vSRO

D'après les discussions et vidéos récentes ([120 Best Build](https://www.elitepvpers.com/forum/silkroad-online/1551381-120-best-build.html), vidéos [Dagger/Warrior & Dagger/Warlock 120 cap](https://www.youtube.com/watch?v=e3Myr3S46g4), [Warrior/Warlock 110](https://www.youtube.com/watch?v=cHVMNbLJq58)) :
- **Dagger/Warlock** et **Dagger/Warrior** : très populaires au 120 (crit + debuffs/interrupts).
- **Warrior/Warlock** : au-delà du cap 124, la ligne Warlock gagne un nuke « DEF ↓ / dégâts ↑ » — les builds à interrupts dominent.
- **Wizard/Cleric**, **STR Glaive**, **Blader 13D** restent des piliers ([guide blader 13DG iSRO](https://www.elitepvpers.com/forum/sro-guides-templates/2669448-guide-lv-120-13-dg-isro-full-str-blader.html)).
- ⚠️ *Incertitude : pas de tier list 120 formelle ; ces tendances viennent de fils et vidéos de serveurs privés.*

---

## 🇪🇺 Builds Européens

### 1. Warrior/Cleric — « Le Bread and Butter » 🛡️

**Le build 1v1 le plus cité de l'histoire du jeu.** Full STR, deux variantes :

| Variante | Armes | Usage |
|---|---|---|
| **2H/Cleric** | Épée 2H (+ switch 1H/bouclier) | Burst melee + survie → **PvP 1v1** |
| **1H/Cleric** | Épée 1H + bouclier | Tank ultime → dungeons, soutien FW |

**Stats** : tous les points en STR (3/niveau). **Armure** : Heavy Armor (tank) ou Light Armor (équilibré, recommandé par GamersDecide pour le MP/défenses mixtes).

**Skills clés (Warrior)** — voir [03_EUROPEAN_CLASSES.md](03_EUROPEAN_CLASSES.md#1-warrior) :
- **Sprint Assault** : charge + chance KB/stun — **l'outil d'interruption n°1** (casse l'Offering ennemi, les casts)
- **Turn Rising** (2H, chance KD) → **Triple Swing** (bonus vs cible au sol) → **Dare Devil** (l'attaque la plus forte du Warrior)
- **Shield Trash / Shield Crush** (1H, KB en série), Berserker → Daring Berserker
- Buffs : **Vital Increase** (+HP, −35 % ATK — à annuler pour burst), **Iron Skin** (+DEF PHY), **Mana Skin** (+DEF MAG) — les deux ~60 s, **obligatoires** avant tout fight
- Party : **Pain Quota**, Physical/Magical Fence, **Physical/Magical/Ultimate Screen**

**Skills clés (Cleric)** :
- **Healing Cycle → Healing Orbit** (HoT sans aggro), **Recovery Division** (soin périodique auto), Group Healing
- **Bless Spell** (+DEF PHY/MAG), Body/Soul Blessing, Force/Mental Blessing
- **Holy Word → Holy Spell** (anti-debuff, le contre aux Warlocks), **Offering/Pure Offering** (consomme 95 % des HP = la plus grosse attaque du jeu, en finisher)

**Rotation type (2H)** :
```
Pre-fight : Vital Increase + Iron Skin + Mana Skin + Bless Spell (+ Holy Spell si Warlock en face)
1. Sprint Assault (interrupt/KB)
2. Turn Rising (chance KD)
3. Triple Swing (bonus vs sol) → Dare Devil (finisher)
4. Healing Cycle / Recovery Division dès 70 % HP — jamais attendre
5. Offering en exécution si l'ennemi fuit à bas PV
```

### 2. Rogue/Cleric — Le Burst King 🗡️

**Le plus gros burst physique monocible du jeu.** Full STR, dagues (+ arbalète en switch pour lure/finish).

- **Armure** : Light/Heavy Armor selon serveur (le guide 90 cap de SilkroadForums privilégie la survie Cleric).
- **Ouvrir en Stealth** : le premier skill sorti d'invisibilité bénéficie de dégâts amplifiés (mécanique détaillée dans le [guide Rogue/Cleric 90 cap](http://www.silkroadforums.com/viewtopic.php?f=5&t=107616)).

**Skills clés (Rogue)** — voir [03_EUROPEAN_CLASSES.md](03_EUROPEAN_CLASSES.md#2-rogue) :
- Dague : **Prick** (la plus forte + bleed + stun), **Wounds → Mortal Wounds** (3 hits, **bonus vs cible au sol** + bleed), **Butterfly Blow** (5 hits, 20 % Dull), Screw (chance stun), Combo Blow, Spinning
- Arbalète : **Distance Shot** (la plus forte), **Hurricane Shot** (chance KD — setup le Mortal Wounds !), Rapid Shot
- Buffs : **Dagger Desperate** (−50 % HP/DEF → +dégâts PHY massifs, à jouer en burst window), Scud (vitesse)
- Utilitaire : **Stealth**, **Scorn → Gross Scorn** (taunt = interrupt + bloque les buffs/rez ennemis)

**Rotation type** :
```
1. Stealth → approche (moins ralenti avec une dague en main)
2. Prick en ouverture (dégâts amplifiés) OU Hurricane Shot (xbow) pour le KD
3. Si cible au sol → Mortal Wounds (bonus) → Butterfly Blow
4. Dagger Desperate si besoin de finir ; Cleric heals si le trade tourne mal
5. Si l'ennemi survit → re-Stealth, reset, recommencer
```

### 3. Wizard/Cleric — Le Polyvalent 🔮

**Le build le plus joué du jeu** (GamersDecide #10 : « the most common build »). Full INT, Light Armor (le Cleric débloque la Light sinon Robe seule).

**Skills clés (Wizard)** — voir [03_EUROPEAN_CLASSES.md](03_EUROPEAN_CLASSES.md#3-wizard) :
- Nukes : **Meteor** (le + gros, CD 10 s, groupe de CD partagé avec Fire Bolt), **Fire Blow → Salamander Blow** (7-9 hits, animation ~9 s **annulable**), **Frozen Spear** (frostbite), **Blizzard** (AoE), **Earth Shock → Earth Quake**, Chain Lightning
- Contrôle : **Root → Mesh Root** (immobilise 10 s), Charged Squall (knockback), **Lightning Shock** (80 % Fear)
- Survie/mobilité : **Earth Barrier → Earth Fence** (+30 % absorption DEF), **Teleport → Aerial Teleport**, Invisible → Crystal Invisible, **Detect** (révèle les Rogues)
- Buffs : **Life Control / Life Turnover** (+25 % MAG ATK chacun, cumulables, −50 % HP) — à activer en phase de burst uniquement

**Rotation PvP documentée** :
```
auto-attaque → clic sol (retarget) → Frozen Spear → Charged Squall (KB) → Salamander Blow (cancel animation)
Finisher Cleric : Teleport sur la cible → Offering
```

### 4. Warlock/Cleric — Le Debuffer 🧿

A-tier 1v1 (3e au cap 80 selon PlayOrigin). Full INT, Robe. Le gameplay : **rendre la cible vulnérable, puis la verrouiller**.

**Lock chain type** (d'après [Warlock/Cleric Guide](https://www.elitepvpers.com/forum/sro-guides-templates/258792-warlock-cleric-guide.html) et fils SilkroadForums) :
```
1. Courage Raze (Division : +30 % dégâts subis) + Combat Raze (Impotent : −ATK)
2. DoT AoE : Blaze/Dark Blaze (burn), Toxin/Toxin Invasion (poison), Decayed/Dark Decayed (bleed) — 3 cibles
3. Stun (80 %) ou Slumber → la cible ne peut pas se soigner
4. Vampire Touch → Vampire Kiss (dégâts + vol de vie + Disease)
5. Blood Flower → Death Flower / Bloody Trap → Death Trap en finisher
```
- **Reflect → Advanced Reflect** (35 % de renvoyer à 135 %, **ignore Pain Quota/fences**) — punit les bursts.
- **Scream Mask** sur les carries de la party (chance de stun l'attaquant).
- ⚠️ Contre : **Holy Spell** (Cleric) réduit énormément l'efficacité des curses — d'où le déclassement au fil des caps.

### 5. Wizard/Bard et Bard sub — Le Soutien de Masse 🎵

- **Wizard/Bard** : nukes + Noise (anti-aggro), Moving/Swing March (vitesse), **Guard/Mana Tambour** (+DEF PHY/MAG groupe), **Dance of Magic/Wizardry** (+dégâts MAG du groupe). Moins de sustain qu'avec Cleric → build de jobbing/farm, S-tier en mobilité (PlayOrigin).
- **Warrior/Bard** : tank + buffs de groupe, très demandé en FW (mais le Cleric reste la sub préférée des Warriors).
- ⚠️ Deux Bards dans la party : le 2e ne peut pas poser son tambour/danse tant que celui du 1er est actif.

### 6. Tri-builds et combos cap 120

- **Wiz 108 / Warrior 10 / Cleric 102** (cap 110) : le tri-build optimisé — Wizard complet + Earth Fence/Interrupts bas Warrior + tout le Cleric utile. Le plafond EU (2 × niveau) empêche 3 masteries pleines.
- **Dagger/Warlock, Dagger/Warrior** : stars du cap 120 (crit + debuffs ou + interrupts).
- **Warrior/Warlock** : interrupts en série + debuffs, popularisé au-delà du cap 124.
- **Wizard/Warlock** : burst + DoT/debuffs en party (fragile en open PvP vs Warlock/Cleric, cf. [débat elitepvpers](https://www.elitepvpers.com/forum/silkroad-online/301845-wizard-warlock.html)).

---

## 🇨🇳 Builds Chinois

> Rappel système : 3 points de stats/niveau (STR/INT), masteries plafonnées au niveau du perso, **cap total 300 (≤90) / 330 (110) / 360 (120)**. Le SP est la vraie limite : un build 3 masteries au cap 110 coûte **~1,9 à 2,5 millions de SP** (calculs détaillés ci-dessous, source [FULL STR GLAVIE GUIDE](https://www.elitepvpers.com/forum/sro-guides-templates/516942-guide-full-str-glavie-guide.html)).

### 1. Full STR Glaive — Le Tank à Dégâts 🔥

**Masteries** (3 variantes sourcées, SP totaux vérifiés sur le guide elitepvpers susmentionné) :

| Variante | Répartition | SP total | Idée |
|---|---|---|---|
| **Feu/Glace** | Heuksal 110 / Fire 110 / Cold 110 | **2 468 962** | Tanky : Frost Guard, Snow Shield fort, murs de glace |
| **Feu/Foudre** | Heuksal 110 / Fire 110 / Lightning 110 | **2 328 710** | La plus jouée : Grass Walk (vitesse), Concentration (parry), Ghost Walk (téléport) |
| **Éco.** | Heuksal 110 / Fire 110 / **Cold 20** (Snow Shield) / **Lightning 90** (buffs) | **1 875 821** | « Le meilleur des deux mondes » à budget SP réduit |
| **Force** (communauté) | Cap 100 : 100/100/80 Force/20 Cold — Cap 110 : 110/110/90 Force/20 Cold | — | Debuffs Vital Spot (Decay/Weaken/Impotent/Division) en plus |

**Pourquoi ça marche** :
- **Pas d'imbue** : dégâts 100 % physiques (stats pures), on compte sur les crits et les multi-hits.
- Le seul arbre CH avec un vrai **stun** : **Soul Departs Spear Series** (Soul Spear - Move/Truth/Soul/Emperor) → stun-lock : *Soul Spear (stun) → Ghost Spear (AoE) → Chain Spear*.
- Passif **Cheolsam Force** (+HP max) ; buff **Flame Body** (+ % ATK PHY) + passif **Flame Devil Force** ; **Fire Protection** (+DEF MAG, la réponse aux nukers).
- **Snow Shield** (Cold 20) : redirige ~20 % des dégâts sur le MP — ne draine pas trop le pool d'un STR (à plus haut rang il faudrait trop de MP).
- **Armor** (max HP/DEF PHY) ou **Protector** selon les guides ; garment déconseillé pour un STR melee.

**~80 000 SP** au cap 80 (estimation communautaire, KB 02) ; le meilleur farmeur solo CH en PvE.

### 2. Full STR Blader — Le Duelliste au Bouclier ⚔️

**Masteries** : Bicheon + Lightning (+ Fire ou Cold) — ou la variante **Force Blader** ci-dessous. **~200 000 SP au cap 80 : le build le plus cher du jeu CH.**

**Le cycle signature « 5 stabs »** :
```
Hidden Blade Series (KD ~50 %) → Killing Heaven Blade ×2-3 (stabs sur cible au sol, book 2+ = 2-3 stabs)
→ racheter du temps (Shield Technique, murs, Snow Shield) → recommencer
```

- **Imbue Lightning (Thunder Force)** : Shock (−parry ratio de la cible) — synergy avec le haut parry du blader.
- Variante tank : **Bicheon + Cold** (Frost Guard, Freezing via Cold Force imbue, bouclier + Shield Protection = block ratio).
- Détail complet des séries : [02_CHINESE_CLASSES.md](02_CHINESE_CLASSES.md#1-bicheon-swordblade) et le [Building Blade Guide (UnKnoWnCheaTs)](https://www.unknowncheats.me/wiki/Silkroad:Building_Blade_Guide).

#### La variante « Force Blader » (Bicheon/Fire/Force) — top 1 GamersDecide
Guide de référence : [Force Blader Guide on Apollo (Seidenkraft)](https://seidenkraftblog.wordpress.com/2012/09/19/force-blader-guide-on-apollo/) (cap 90 : Bicheon 90 / Fire 90 / Force 90 / Cold 30).

**Rotation de debuffs documentée** :
```
1. Flying Stone Smash (2 hits, 18 %/hit Bleed) en ouverture
2. Force debuffs : Division (Vital Spot Brain) puis Impotent (Vital Spot Zero)
3. Si échec → Lightning Chain (peut appliquer Bleed/Impotent/Division)
4. Une fois 2-3 debuffs posés : Summit/Depth Bicheon Force (+127 ATK PHY)
5. Ocean/Demon Blade Force (KD 50 %) → double stabs Dragon Sore / Asura Cut Blade (+5 crit)
```
- Outils défensifs : **Ironwall Shield** (+1210 DEF PHY, 15 s), **Fire Shield Emperor** (~78 % d'immunité aux statuts d'imbue), **Snow Shield Novice** (23 % → MP, synergie **Force Increasing** +2826 MP), Crystal Wall.
- **Gear cible du guide** : Protector +8 (60 % stats) minimum → +10 (80 %) ; blade +9/60 %/crit 10 minimum → Sun +10/SoM +12/+13 ; **bouclier block ratio 18 (=80 %) minimum, jamais moins**.

### 3. Full STR Bow — Le Kiter 🔥🏹

**Variantes sourcées** :
| Variante | Masteries | Source / usage |
|---|---|---|
| **Fire/Lightning** | Pacheon + Fire + Lightning | Le classique PvE-PvP polyvalent ([BEST Full STR Bow GUIDE](https://www.elitepvpers.com/forum/sro-guides-templates/306981-best-full-str-bow-guide.html)) |
| **Fire/Cold (crit)** | Pacheon 105 / Fire 105 / Cold 100 | Build crit du [wiki ZsZC](https://zszc.fandom.com/wiki/Pure_STR_Bower) — Cold = défense + freeze |
| **Force Bower** | Pacheon + Fire + Force | [Best Full STR Force Bower](https://www.elitepvpers.com/forum/sro-guides-templates/1000428-best-full-str-force-bower-build.html) — GamersDecide #3, « PvP god » du jobbing : debuffs + stun/KB + rez |
| **Ice Bow** | Pacheon + Cold (+Fire) | GamersDecide #4 : Ice Wall contre Warlocks, Cold imbue sur les cibles ressurectées |

**Pourquoi Fire est quasi obligatoire** (elitepvpers 306981) : **Flame Body** (+ % ATK PHY), l'**imbue la plus forte** (Burn pendant le kiting), **Fire Protection** (+DEF MAG contre les nukers).

**Skills clés** : **Anti Devil Bow Series** (tirs critiques), **Strong Bow** (chargé lourd), **Explosion Arrow** (AoE), **Arrow Combo** (2-7 flèches), **Mind Bow** (360°, le plan B anti-melee), **Soul Arrow** (buff de portée, quasi obligatoire), **Mind Concentration** (attack rating), **Hawk Summon**. **~90-100 k SP au cap 80.**

**Playstyle** : kite permanent (Grass Walk + imbue burn), crit One-shot sur cible faible, Mind Bow si coincé. Faiblesse : les cooldowns et la mêlée.

### 4. Nukers INT — Les Glass Cannons 📈

#### Pure INT Spear Nuker (Heuksal spear + Fire + Lightning)
- Arme : **spear** 2M (crit élevé, arme « mentale ») — dégâts magiques les plus élevés du jeu.
- Nukes : **Flame Wave Series** (Fire : Wide = la référence), **Thunderbolt Force** (Lightning : Wolf's → God's), buffs **Piercing Force** (+ % ATK MAG), **Concentration** (parry), **Grass Walk/Ghost Walk**.
- Défense : **Snow Shield** (Cold bas, absorbe via le gros pool MP d'un INT — c'est LÀ qu'il est fort), murs Fire/Frost.
- Guide classique : [FULL INT FIRE SPEAR NUKER (elitepvpers)](https://www.elitepvpers.com/forum/sro-guides-templates/467212-guide-full-int-fire-spear-nuker.html) et [BlackStar's Guide to Owning with a Pure INT](https://www.elitepvpers.com/forum/sro-guides-templates/136607-guide-blackstars-guide-owning-pure-int.html).

#### Sword/Shield Nuker (Bicheon + Lightning + Cold)
- Le nuker « tanky » : bouclier (block) + Snow Shield fort + **Cold Wave** en opener (ralentit à distance) puis nukes Lightning (Lion Shout rapides + Thunderbolt). Guide : [Nuker Build Sword/Shield — Serafelle (ExaySRO)](https://forum.exaysro.com/printthread.php?tid=1039).
- Rotation PvE/PvP du guide : *KD → stabs → combo → nuke Lightning*.

#### Bow Nuker (Pacheon + Lightning + Cold)
- Kitabilité maximale : nukes à distance + portée Soul Arrow + freeze. Excellent en jobbing.

---

## ⚖️ Hybrides CH : Ratios et Builds

Les hybrides CH misent **les deux familles de dégâts** (imbue/nuke + coups PHY). Le ratio stats détermine la « balance » magique/physique (données [Kerelious' Hybrid Spear/Nuker Build Guide, MMORPG.com](https://forums.mmorpg.com/discussion/152496/kerelious-hybrid-spear-nuker-build-guide)) :

| Ratio STR:INT | Balance magique | Lecture |
|---|---|---|
| 1:2 | ~66 % | Nuker un peu tanky |
| 2:1 | ~33 % | STR avec nukes de finish |
| 3:1 | ~75 % mag | Nuker hybride standard |
| **4:1** | **~80 % mag / ~70 % phy** | **Le ratio du guide Kerelious** — nukes quasi full + coups qui comptent |
| 1:1 | 50 % | « Équilibré » = médiocre partout (déconseillé) |

- **Hybrid spear 4:1** : Fire > Lightning en dégâts même buffé ; Lightning gardé pour Grass Walk/Ghost Walk + Piercing Force. SP nécessaires (guide) : ~**105 k à 42**, **170 k à 60**, **312 k à 72**, **389 k à 79** (build 3 masteries).
- **Hybrid STR glaive/blader 7:1** : dégâts PHY + nuke de finish + confort MP.
- ⚠️ **Correction vs ancienne version** : le prétendu « hybride 1:9 INT Spear, roi du méta 2024-2026 » n'est confirmé par **aucune** source trouvée (les ratios documentés sont 1:2/2:1/3:1/4:1/7:1). Il a été supprimé. L'idée sous-jacente (un peu de STR sur un nuker pour tenir un crit, avec Snow Shield) reste valable — c'est simplement l'hybride INT classique.

---

## 🎬 Rotations PvP Emblématiques

| Build | Rotation | Source |
|---|---|---|
| **Blader CH** | Hidden Blade (KD) → Killing Heaven Blade ×2-3 (stabs) → Shield Technique/murs → repeat (« 5 stabs ») | UnKnoWnCheaTs / KB 02 |
| **Force Blader** | Flying Stone Smash (Bleed) → Division → Impotent → Bicheon Force buff → Blade Force (KD) → double stab | Seidenkraft (Apollo) |
| **Glaive STR** | Soul Spear - Move (**stun**) → Ghost Spear (AoE) → Chain Spear → repeat (stun-lock) | KB 02 |
| **Bower STR** | Imbue Fire → Anti Devil Bow (crit) → kit (Grass Walk) → Strong Bow finisher | elitepvpers 306981 |
| **Rogue/Cleric EU** | Stealth → Prick (opening boosté) ou Hurricane Shot (KD) → Mortal Wounds (vs sol) → Butterfly Blow → reset Stealth | SilkroadForums 107616 |
| **Warlock/Cleric EU** | Division + Impotent → DoT AoE ×3 → Stun/Slumber → Vampire Kiss → Death Flower (« lock chain ») | elitepvpers 258792 |
| **Wizard/Cleric EU** | Life Control/Turnover → Meteor → clic sol retarget → Frozen Spear → Charged Squall (KB) → Salamander Blow (cancel) → Teleport + Offering (finisher) | KB 03 (rotations documentées) |
| **Warrior/Cleric EU** | Skins + Bless → Sprint Assault (interrupt) → Turn Rising (KD) → Triple Swing → Dare Devil → heals en boucle | elitepvpers 416987 |
| **Nuker S/S** | Cold Wave (slow) → Lion Shout/Thunderbolt → KD → stabs → nuke | Serafelle (ExaySRO) |

---

## 🔄 Counters et Matchups

> Synthèse des raisonnements récurrents dans les tier lists et fils cités. À stuff et skill égaux.

### Le « qui bat qui » (cap 80-110)
| Matchup | Avantage | Pourquoi |
|---|---|---|
| Warrior/Cleric vs Rogue/Cleric | **Warrior** | Les heals + skins encaissent le burst ; le rogue sans stealth reset est mort. Le rogue l'emporte seulement s'il enchaîne les openers parfaits |
| Rogue/Cleric vs Wizard/Cleric | **Rogue** | Burst trop rapide pour un INT au pot-delay ; Stealth évite le kite |
| Warrior/Cleric vs Warlock/Cleric | **Warlock** (si pas de Holy Spell) | Division/Impotent + DoT % → le tankiness se fait retourner ; avec Holy Spell, le Warrior reprend l'avantage |
| Wizard vs Rogue | **Rogue** en 1v1, **Wizard** en group | Detect révèle le Stealth en groupe ; en 1v1 le Wiz meurt avant |
| Glaive/Blader STR vs Nuker INT | **STR** | Un KD/crit = fin du nuker ; le nuker doit kiter parfaitement |
| Nuker INT vs Bower STR | **Nuker** (souvent) | Le bow depépend de ses CDs ; les nukes passent la DEF PHY faible du garment — matchup skill-dépendant |
| Ice Bow / Cold builds vs Warlock/Nuker | **Ice Bow** | Ice Wall bloque, freeze/interrupt, beaucoup de DEF |
| Force builds (CH) vs builds sans cure | **Force** | Decay/Weaken/Impotent/Division non purgeables par les pilules (Force Cure requis) |

### Logique de focus en PvP de groupe
1. **Focus les Clerics/Bards** d'abord (le sustain ennemi) — sauf si un Warlock est exposé.
2. **Le Warlock** est la 2e priorité : ses debuffs retournent les fights.
3. Les **Wizards** dès qu'ils sont rootés/séparés du tank.
4. Les **tanks (Warrior 1H)** en dernier : ils ne tuent personne seuls.
5. Côté défense : Pain Quota/fences sur les Clerics, Screen sur le focus, Holy Spell préventif, Scream Mask sur les carries.

---

## 🏰 PvP de Groupe et Fortress War

### Composition party 8/8 EU type (FW/BA/CTF)
```
2× Warrior (1H tank + fences/Pain Quota ; 2H burst)
2× Cleric (heals, Bless, Holy Spell, Reverse, Offering)
1× Bard (Noise, tambours, marches, dances — 1 seul, voir règle ci-dessus)
2-3× Wizard (Meteor/Earth Quake/Blizzard sur les packs, Root sur les poursuivants)
0-1× Warlock (Division/Impotent sur les focus, sleeps, Reflect sur les carries)
```

### Rôles CH en masse
- **Glaive STR** : front line, spin AoE dans les packs, stun-lock sur les cibles clés.
- **Bower STR** : kite périmétral, crit sur les Clerics/Wizards exposés.
- **Nuker INT** : AoE à distance derrière la front line.
- **Force hybrid / support** : heals, rez (Rebirth Art), Force Cure (dissipe Burn/Freeze que les pilules ne retirent pas !), debuffs Vital Spot.

### Particularités FW
- Objectifs structurels (tours/gates) + PvP : les builds burst (Wizard) accélèrent la destruction, les tanks tiennent les points.
- Le **Warlock** brille en défense de structure (AoE debuffs sur les assaillants packés).
- Voir [19_FORTRESS_WAR.md](19_FORTRESS_WAR.md).

---

## 🛡️ Gear et Équipement PvP

### Blues prioritaires (alchimie)
D'après [SilkroadForums — explication des blues](http://www.silkroadforums.com/viewtopic.php?f=29&t=39439) et le [guide complet elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/169313-silkroad-online-comprehensive-guide.html) :

| Blue | Effet | Notes |
|---|---|---|
| **Immortal** | L'item ne se détruit pas si l'enchant échoue (au-delà de +5) | Prérequis d'**Astral** |
| **Astral** | Récupère l'item (ou son niveau) si échec | Ne s'applique que sur un item déjà Immortal |
| **Steady** | Pas de perte de durabilité à l'échec | ⚠️ **Usages limités** (« Steady (2 times) ») — le blue disparaît une fois consommé |
| **Lucky** | + chance de réussite d'enchant | Idem, usages comptés |
| **Crit / Crit damage** | Armes STR surtout (rogue, glaive, bow, blader) | Ex. cible du guide Force Blader : blade **crit 10** minimum |
| **Block ratio (boucliers)** | Le blue défensif n°1 des builds bouclier | Guide Seidenkraft : **BR 18 (=80 %) minimum**, jamais moins |
| **Attack rating / Parry** | Variance des dégâts | Voir mécaniques plus haut |
| **Int/Str %, HP/MP %** | Stat blues classiques | Sur set + accessoirs |

### Degrés et Seal par cap
- Les caps correspondent aux degrés (voir [07_ITEM_DEGREES.md](07_ITEM_DEGREES.md)) : cap 90 ≈ 10D, cap 100 ≈ 10D/Egypt, cap 110 ≈ **11D + items Egypt (A/B)**, cap 120 ≈ **12D/13D**.
- **SoS < SoM < SoSun** (voir [06_SEAL_EQUIPMENT.md](06_SEAL_EQUIPMENT.md)) ; Nova (SoN) sur les caps tardifs.
- Repères du guide Force Blader (cap 90) : set +8/60 % minimum, objectif +10/80 % ; arme +9/60 % minimum, final **Sun +10 / SoM +12 / +13**.
- ⚠️ Les anciens blocs « +9 = +50 % dégâts, +11 = +80 %… » de ce doc étaient **inventés** — les vrais bonus d'enhance ne sont pas publiés par Joymax ; seul le consensus « +7 farm / +9-+10 PvP / +12+ BiS » est retenable.

### Choix d'armure par build (résumé)
| Build | Armure recommandée | Pourquoi |
|---|---|---|
| Warrior/Cleric | Heavy ou Light Armor | Tank vs mixte |
| Rogue/Cleric | Light/Heavy | Survie pendant le burst |
| Wizard/* | **Robe** (ou Light Armor via sub Cleric) | Vitesse/MP ; Light = défenses mixtes |
| Warlock/Cleric | Robe | MAG DEF, MP |
| Glaive/Blader STR | **Armor** (ou Protector) | HP/DEF PHY max |
| Bower STR | Garment ou Protector | Vitesse (kite) ; Ice Bow peut prendre plus tanky |
| Nukers INT | **Garment** | Vitesse +20 %, MP, MAG DEF |
| Force Blader | **Protector** (guide Apollo) | Compense la DEF, +10 % MP/speed |

### Avatars, pets et consommables utiles
- **Grab pet** : ramasse le loot automatiquement (indispensable en farm/jobbing) — voir [24_MOUNTS_PETS.md](24_MOUNTS_PETS.md).
- **Fellow pet / ability pet** : skills actifs/passifs, up en doublons.
- **Avatars** : cosmétiques (certains packs incluent des items) — aucun impact direct sur les stats de build.
- PvP : **Vigor potions/pills** (burst heal), **Universal pills** (statuts — sauf Burn/Freeze qui exigent Force Cure CH), potions d'anti-CC selon serveur.

---

## ⚠️ Erreurs Courantes en PvP

1. **Monter les skills au hasard / disperser les masteries** — l'erreur n°1 citée par tous les guides débutants ([Nostalgic.gg 2026](https://nostalgic.gg/en/blog/silkroad-online-beginners-guide-en)) : un build = 2-3 masteries focalisées.
2. **Voler/gaspiller l'alchimie sur du stuff temporaire** — immortal/astral/lucky se conservent pour le set final.
3. **Oublier les buffs défensifs** (Iron/Mana Skin, Bless Spell, Fire Protection, Frost Guard) avant un fight.
4. **Jouer l'EU sans pot-timing** : le délai de 15 s impose d'anticiper (heal à 70 %, pas à 10 %).
5. **Face-check un Rogue en Stealth** : bouger, AoE les buissons, Detect avec un Wizard.
6. **Ignorer les debuffs** : ne pas cure (Force Cure/Holy Spell/pills) contre Warlock/Force = mourir sur du % de dégâts.
7. **Chercher le one-shot nuker en 1v1** : les nukers vivent du kite ; en duel statique ils perdent.
8. **Négliger attack rating/parry** (Mind Concentration, Heaven's Force, gems) : des dégâts « parés » sur un paper build.
9. **SP farming tardif** : se retrouver cap 110 sans les SP des skills clés (Dare Devil, Holy Spell…) — planifier le GAP dès le début (voir [26_SP_FARMING.md](26_SP_FARMING.md)).
10. **Choisir son cap à l'envers** : cap 80 = CH only nostalgique ; cap 110+ = EU inclus ([Nostalgic.gg](https://nostalgic.gg/en/blog/silkroad-online-beginners-guide-en)).

---

## ❓ FAQ

**Q : Quel est le meilleur build PvP 1v1 ?**
R : Consensus massif : **Warrior/Cleric (2H)** — tanky, heals, gros burst (Dare Devil). Côté CH : **Force Blader** et **Glaive STR**. Mais tout se joue sur le matchup et le skill.

**Q : Pure INT ou pure STR pour le PvP ?**
R : STR = pardonnable (HP, DEF), INT = dégâts max mais glass cannon. Les hybrides CH (3:1, 4:1) sont le compromis documenté.

**Q : Le Rogue/Cleric est-il dur à jouer ?**
R : Oui — le plus haut skill ceiling : openers en Stealth, timings Dagger Desperate, resets. Très fort bien joué, lamentable mal joué.

**Q : Pourquoi mon EU meurt-il tout le temps en solo ?**
R : Le délai de potion de 15 s. Les EU sont pensés pour la party (Cleric/Bard) ; en solo, gardez la sub Cleric.

**Q : Warlock/Cleric vaut-il le coup à haut cap ?**
R : Fort jusqu'à ~100, puis décline car Holy Spell + gems anti-statut se généralisent ; il rebondit en group PvP et au cap 124+ (nuke DEF↓).

**Q : Le bower STR est-il viable en PvP ?**
R : Oui (top 10 GamersDecide ×2 variantes) : excellent en jobbing et kite ; faible en mêlée prolongée.

**Q : Il me manque des SP pour mon build 110, que faire ?**
R : GAP 9 au farming (Ongs/Niya), quête Skill Resuscitation (80 % remboursés), ou farm ciblé — voir [26_SP_FARMING.md](26_SP_FARMING.md).

**Q : Quels blues sur un bouclier PvP ?**
R : **Block ratio** d'abord (BR18+), puis Str/HP %, Immortal/Steady pour l'enchant.

---

## 🔗 Resources

### Tier lists et débats « best build »
- [80 Cap Tier List for 1v1 PvP, Job, Party PvP (Ctf, BA) and PvE — PlayOrigin Forum](https://forum.playorigin.com/showthread.php?1050-80-Cap-Tier-List-for-1v1-PvP-Job-Party-PvP-(Ctf-BA)-and-PvE) — la tier list structurée de référence (stuff égalisé)
- [Top 10 SilkRoad Best Builds — GamersDecide](https://www.gamersdecide.com/articles/silkroad-best-builds) — classement général 2021
- [Best build for cap 110 — Elitepvpers](https://www.elitepvpers.com/forum/silkroad-online/505150-best-build-cap-110-a.html) et [Best build for 110/120 cap](https://www.elitepvpers.com/forum/silkroad-online/1785646-best-build-110-120-cap.html)
- [120 Best Build — Elitepvpers](https://www.elitepvpers.com/forum/silkroad-online/1551381-120-best-build.html)
- [What is the best build in SRO — Elitepvpers (débat historique)](https://www.elitepvpers.com/forum/silkroad-online/117717-what-best-build-sro-3.html)
- [Full European Character Guide — r/silkroadonline](https://www.reddit.com/r/silkroadonline/comments/1wfn2h6/for_anyone_new_or_returning_to_silkroad_i_put/)

### Guides builds EU
- [Warrior/Cleric Cap 100 — skAz (Elitepvpers)](https://www.elitepvpers.com/forum/sro-guides-templates/416987-guide-warrior-cleric-cap100-skaz-aka-urmomzzz.html) et [Warrior/Cleric (Elitepvpers 298754)](https://www.elitepvpers.com/forum/sro-guides-templates/298754-guide-warrior-cleric.html)
- [Rogue/Cleric Guide 90 Cap — SilkroadForums](http://www.silkroadforums.com/viewtopic.php?f=5&t=107616) et [Rouge/Cleric Guide (Elitepvpers)](https://www.elitepvpers.com/forum/sro-guides-templates/1000471-rouge-cleric-guide.html)
- [Wizard/Cleric UPDATED Guide — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/667857-guide-wizard-cleric-updated-guide.html) et [Wizard/Cleric Guide (161976)](https://www.elitepvpers.com/forum/sro-guides-templates/161976-wizard-cleric-guide.html)
- [Warlock/Cleric Guide — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/258792-warlock-cleric-guide.html)
- [Warrior-Rogue Guide — Silkroad Aces](https://silkroadaces.board-directory.net/t8-warrior-rouge-guide)
- Traductions des 6 masteries EU (elitepvpers 2008) : [index dans 03_EUROPEAN_CLASSES.md](03_EUROPEAN_CLASSES.md#-resources)

### Guides builds CH
- [FULL STR GLAVIE GUIDE — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/516942-guide-full-str-glavie-guide.html) — SP exacts par variante, théorie attack rating
- [Best Full Str Glavie Build ?! — Elitepvpers](https://www.elitepvpers.com/forum/silkroad-online/194858-best-full-str-glavie-build.html)
- [Force Blader Guide on Apollo — Seidenkraft](https://seidenkraftblog.wordpress.com/2012/09/19/force-blader-guide-on-apollo/) — rotation de debuffs détaillée, gear cible
- [Perfect Ultimate Force Blader Build Cap 100 — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/289880-guide-perfect-ultimate-force-blader-build-cap-1oo.html)
- [BEST Full STR Bow GUIDE — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/306981-best-full-str-bow-guide.html) et [Best Full STR Force Bower Build](https://www.elitepvpers.com/forum/sro-guides-templates/1000428-best-full-str-force-bower-build.html)
- [Pure STR Bower — Wiki ZsZC (Fandom)](https://zszc.fandom.com/wiki/Pure_STR_Bower)
- [Kerelious' Hybrid Spear/Nuker Build Guide — MMORPG.com](https://forums.mmorpg.com/discussion/152496/kerelious-hybrid-spear-nuker-build-guide) — ratios et table SP
- [Building Blade Guide — UnKnoWnCheaTs](https://www.unknowncheats.me/wiki/Silkroad:Building_Blade_Guide)
- [Lv 120 (13DG) iSRO Full STR Blader — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/2669448-guide-lv-120-13-dg-isro-full-str-blader.html)
- [BlackStar's Pure INT Guide — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/136607-guide-blackstars-guide-owning-pure-int.html)

### Mécaniques et gear
- [Can anyone explain what all the blues mean ! — SilkroadForums](http://www.silkroadforums.com/viewtopic.php?f=29&t=39439)
- [Silkroad Online Comprehensive Guide — Elitepvpers](https://www.elitepvpers.com/forum/sro-guides-templates/169313-silkroad-online-comprehensive-guide.html)
- [Silkroad Online Beginner's Guide 2026 — Nostalgic.gg](https://nostalgic.gg/en/blog/silkroad-online-beginners-guide-en)
- Interne : [04_COMBAT_SYSTEM.md](04_COMBAT_SYSTEM.md), [28_ADVANCED_MECHANICS.md](28_ADVANCED_MECHANICS.md), [20_PVP_PK_SYSTEM.md](20_PVP_PK_SYSTEM.md)

---

*Dernière mise à jour : 2026-10-01 (révision majeure : noms de skills iSRO vérifiés, tier lists sourcées par cap, SP vérifiés, suppression des données fabriquées)*
*Sources : Elitepvpers, SilkroadForums, PlayOrigin, GamersDecide, MMORPG.com, UnKnoWnCheaTs, Seidenkraft, ZsZC Wiki, ExaySRO, Reddit r/silkroadonline. Incertitudes résiduelles signalées par ⚠️.*
