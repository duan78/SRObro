# Skills Database - European Classes

## 📋 Table des Matières
- [Notes de Structure des Skills EU](#-notes-de-structure-des-skills-eu)
- [Warrior Skills](#️-warrior-skills)
- [Rogue Skills](#️-rogue-skills)
- [Wizard Skills](#-wizard-skills)
- [Warlock Skills](#-warlock-skills)
- [Bard Skills](#-bard-skills)
- [Cleric Skills](#⛪-cleric-skills)
- [Cooldowns et Animations Notoires](#-cooldowns-et-animations-notoires)
- [Progression SP](#-progression-sp)
- [Incertitudes et Versions](#-incertitudes-et-versions)
- [Tips par Classe](#-tips-par-classe)

---

## ⚠️ Notes de Structure des Skills EU

Cette base remplace l'ancienne version (noms inventés, chiffres non sourcés). Les noms sont désormais les **noms iSRO officiels** (vérifiés croisés : traductions elitepvpers 2008, guides Silkroad Forums/SRO Valkyria, listes in-game PhBot, effets serveur eSRO).

1. **Organisation** : chaque mastery EU est une grille de lignes (R1, R2, R3...) débloquées par paliers de mastery ; chaque ligne possède un skill **book 1** (précoce) et un skill **book 2** amélioré (plus haut dans l'arbre). Ex: `Moving March → Swing March`, `Healing Cycle → Healing Orbit`, `Root → Mesh Root`, `Blaze → Dark Blaze`.
2. **Niveaux de skills** : chaque skill s'achète avec des SP une fois le palier de mastery atteint, et se monte sur plusieurs rangs (dégâts/effets croissants). Le mastery cap = niveau du perso.
3. **Coûts MP / dégâts exacts** : ils varient fortement selon le rang du skill, le cap du serveur (90→140) et la version (iSRO/vSRO/SilkroadR). Les chiffres donnés ici sont des **valeurs documentées à un rang donné** et des **règles structurelles** (durations, chances, ratios) qui restent stables.
4. **Deux masteries max** : total plafonné à 2 × niveau du perso (220 au cap 110, 240 au cap 120) — voir [03_EUROPEAN_CLASSES.md](03_EUROPEAN_CLASSES.md).

---

## 🛡️ Warrior Skills

**Stats :** full STR · **Armes :** épée 1H + bouclier, épée 2H, double hache · **Rôles :** tank, party buffer, interrupteur melee

### Ligne One-Handed (épée + bouclier)

| Skill | Type | Effet documenté | Notes |
|-------|------|-----------------|-------|
| **Slash** | Attaque | Coup de base 1H | Skill d'entrée de ligne |
| **Shield Trash** | Attaque bouclier | Knockback avec probabilité élevée | Plus rapide que Shield Crush — repousse les mobs dans la zone de kill |
| **Shield Crush** | Attaque bouclier | Knockback avancé | Rang supérieur de la ligne bouclier |
| **Berserker → Daring Berserker** | Attaque burst | Grosse frappe 1H, book 2 amélioré | Finisher 1H |
| Double Stab / Cunning Stab | Attaque | Frappes rapides 1H | Noms relevés dans les listes in-game (PhBot) — à confirmer en jeu |
| **Taunting Target** | Aggro | Force 3 cibles à vous cibler | Taunt mono/petit groupe |
| **Howling Shout** | Aggro | Aggro de zone sur 5 cibles | Taunt de pack |
| **Sprint Assault** | Charge | Ruée + chance knockback et/ou stun | **L'interrupteur clé** (casse l'Offering ennemi, les casts) |

### Ligne Two-Handed (épée 2H)

| Skill | Type | Effet documenté | Notes |
|-------|------|-----------------|-------|
| **Bash** | Attaque | Coup de base 2H | — |
| **Turn Rising** | Attaque | Attaque rapide, chance de knockdown | Ouvre les combos au sol |
| **Charge Swing** | Attaque | Frappe chargée | — |
| **Triple Swing** | Attaque | Dégâts bonus sur cibles **au sol** | Combo après knockdown |
| **Maddening** | Attaque | Frappe lourde | — |
| **Dare Devil** | Attaque ultime | **La plus forte attaque du Warrior** | Le burst signature 2H |

### Ligne Dual Axe

| Skill | Type | Effet documenté | Notes |
|-------|------|-----------------|-------|
| Down Cross | Attaque | Croisé de base | — |
| Double Twist | Attaque | Double frappe | — |
| **Sudden Twist** | Attaque | **Stun et/ou bleed** | Le contrôle de la ligne |
| Axis Quiver | Attaque | Frappe de zone hache | Orthographe exacte parfois « Axle Quiver » |
| Dual Counter → Deadly Counter | Attaque | Contres | — |
| Crisis Rush → Crucial Rush | Attaque | Rush offensive | « Crutial Rush » (typo PhBot) |

### Buffs Warrior

| Skill | Portée | Effet documenté | Durée/CD |
|-------|--------|-----------------|----------|
| **Vital Increase** | Self | +HP massif, **−35% ATK** | Annulable pour burst après avoir pris l'aggro |
| **Iron Skin** | Self | **+DEF physique** | « MUST have » (tous guides) |
| **Mana Skin** | Self | **+DEF magique** | « MUST have » (tous guides) |
| Warcry | Self (2H) | Buff offensif 2H | Réservé à la ligne deux-mains |
| **Pain Quota** | 2 membres | **Partage les dégâts des 2 cibles sur toute la party** | **5 min** — le buff party n°1 ; à poser sur les 2 Clerics |
| **Physical Fence** | 1 membre | Transfert d'un % des dégâts PHY de la cible vers vous | Ne pas max si trop dangereux |
| **Magical Fence** | 1 membre | Idem dégâts MAG | Sur lurers + wizard le plus bas |
| **Protect** | 2 membres | Absorbe l'aggro des cibles | Sur les 2 plus gros DPS |
| **Physical / Magical / Ultimate Screen** | Cible | **+DEF massive** | **1 min** — ne pas stack les trois ni les simultaner |

---

## 🗡️ Rogue Skills

**Stats :** full STR · **Armes :** dague, arbalète · **Rôles :** assassin burst, lurer

### Ligne Dagger

| Skill | Type | Effet documenté | Notes |
|-------|------|-----------------|-------|
| Spinning | Attaque | Coup de base tournant | — |
| Wounds → **Mortal Wounds** | Attaque | **Bonus dégâts sur cibles au sol** + bleed | Coeur du combo après knockdown |
| Scud | Buff | Vitesse de déplacement (dague équipée) | Trick : potion de vitesse → Scud → cancel → re-potion (stack) |
| Screw | Attaque | Chance de **stun** | — |
| Combo Blow | Attaque | Combo rapide | — |
| **Butterfly Blow** | Attaque | **5 hits rapides**, 20% chance **Dull 20 s** par usage | Séquence visuelle « papillon » |
| **Prick** | Attaque | **La plus forte attaque dague**, bleed et/ou stun | Finisher |

### Ligne Crossbow

| Skill | Type | Effet documenté | Notes |
|-------|------|-----------------|-------|
| Power Shot | Attaque | Tir de base | — |
| Intense Shot | Attaque | Tir renforcé | — |
| **Fast Shot → Rapid Shot** | Attaque | **Plus longue portée + CD court** | L'outil de lure par excellence |
| Long Shot → **Distance Shot** | Attaque | **La plus forte attaque arbalète** | Boostée par Crossbow Extreme |
| Blast Shot | Attaque | Tir explosif | — |
| **Hurricane Shot** | Attaque | Chance de **knockdown** | Combo knockdown → Mortal Wounds |

### Buffs et Utilitaire Rogue

| Skill | Effet documenté | Notes |
|-------|-----------------|-------|
| **Crossbow Extreme** | Sacrifie **~50% HP et DEF** pour +dégâts PHY drastiques | Le « GO » burst xbow |
| **Dagger Desperate** | Sacrifie DEF PHY/MAG pour +dégâts PHY | Version dague |
| **Stealth** | Invisible aux autres joueurs, vitesse réduite (moins ralenti avec dague) | Rompu par attaque ; certains guides décrivent une variante « Transparent » (immobile, visible de la party) |
| **Scorn → Gross Scorn** | Taunt ~7 s (1 → 3 cibles) : la cible ne peut viser personne d'autre | Interrupt de rez/buffs ennemis, protection de cast allié |
| Passif R1 | Crossbow Physical Attack +10% | Première case de la mastery |

---

## 🔮 Wizard Skills

**Stats :** full INT (hybride possible) · **Arme :** staff (2H) · **Portée de base : 18 m** (+1 m/rang du passif Magic Bound)

### Ligne Fire

| Skill | Type | Effet documenté | Notes |
|-------|------|-----------------|-------|
| **Fire Bolt** | Nuke | Mono-cible, bon pour le solo | Partage son **groupe de cooldown** avec Meteor |
| **Meteor** | Nuke ultime | **Le plus gros nuke du Wizard, jusqu'à 3 cibles très proches** | **CD 10 s** ; ordre de cast change le CD partagé (Meteor→Fire Bolt 10 s ; Fire Bolt→Meteor 3 s) |
| **Fire Blow → Salamander Blow** | Nuke multi-hits | **7-9 coups** sur 3 cibles (souvent derrière le caster) | Animation ~9 s **annulable** (Detect, Earth Barrier) — cœur du burst |
| Fire Trap → Lava Trap | Piège | Piège de feu à poser | Dégâts de zone à déclenchement |
| Detect → Sprawl Detect | Utilitaire | Révèle les invisibles | Anti-Stealth/Invisible |

### Ligne Cold

| Skill | Type | Effet documenté | Notes |
|-------|------|-----------------|-------|
| **Ice Bolt** | Nuke | Mono-cible + gel | — |
| **Frozen Spear** | Nuke | **3 hits, 20% frostbite par hit** | Contrôle doux mono-cible |
| **Snow Wind → Blizzard** | Nuke AoE | Jusqu'à 5 cibles, grande portée | **80% frostbite, 20% freeze** |
| Invisible → Crystal Invisible | Utilitaire | Invisibilité (version groupe au book 2), vitesse réduite | Escape, traverse les zones aggro |
| Mana Drain → Mana Drought | Utilitaire | Draine le MP de la cible | Outil anti-casters |

### Ligne Lightning

| Skill | Type | Effet documenté | Notes |
|-------|------|-----------------|-------|
| Lightning Bolt | Nuke | Jusqu'à 2 cibles | — |
| **Chain Lightning** | Nuke | Jusqu'à 3 cibles | Book 2 |
| **Lightning Shock** | Contrôle | **80% Fear pendant 20 s** | La cible fuit sans contrôle |
| **Charged Wind → Charged Squall** | Nuke AoE | **5 hits, 80% knockback par hit** | Repousse les packs vers le cleric (kiting de zone) |
| Charged Lightning / Lightning Impact | Nuke | Variantes de la ligne | — |
| **Teleport → Aerial Teleport** | Mobilité | Téléporte instantanément à la position du curseur | Repositionnement PvP/PvE |

### Ligne Earth

| Skill | Type | Effet documenté | Notes |
|-------|------|-----------------|-------|
| Ground Charge → **Ground Rave** | Nuke AoE | 5 cibles **autour du caster**, très courte portée | Base du rôle « Wall WIZ » |
| **Earth Shock → Earth Quake** | Nuke AoE | 5 cibles **autour de la cible**, longue portée | Le meilleur nuke de zone ciblée |
| **Root → Mesh Root** | Contrôle | Immobilise la cible 10 s | **20% d'échec** |
| **Earth Barrier → Earth Fence** | Buff party | **+30% absorption/défense PHY** (rang moyen) | **20 s / CD 60 s** — cycle permanent avec 3 Wizards |

### Buffs et Passifs Wizard

| Skill | Effet documenté | Notes |
|-------|-----------------|-------|
| **Life Control (LC)** | **+25% dégâts magiques, −50% HP** | Vulnérable aux dégâts absolus sous LC |
| **Life Turnover (LTO)** | **+25% dégâts magiques supplémentaires** | Cumulable avec LC pour le burst |
| **Natural Spirit** (passif) | +10% MAG ATK par rang | — |
| **Force Mental** (passif) | +10% MP, +1 INT par rang | — |
| **Magic Bound** (passif) | **+1 m de portée par rang** | Portée de base 18 m |

### Rotations de référence
- **Lv 20 :** Lightning Bolt → Earth Shock → Lightning Bolt → Snow Wind
- **Lv 60 :** Meteor → Lightning Bolt → Earth Shock → Snow Wind
- **Lv 80 :** Meteor → Chain Lightning → Earth Quake → Blizzard
- **Wall WIZ :** Ground Rave → Earth Quake → Ground Rave → Blizzard → Ground Rave
- **PvP :** auto → clic sol → Frozen Spear → Charged Squall → Salamander Blow (cancel animation)

---

## 🎭 Warlock Skills

**Stats :** full INT · **Arme :** dark staff (warlock rod) + bouclier · **Armure :** robe · **Rôle :** debuffer/DoT/contrôle

### DoT — book 1 (mono-cible) et book 2 (AoE 3 cibles)

| DoT (statut) | Book 1 | Book 2 (AoE) | Effet |
|--------------|--------|--------------|-------|
| **Burn** (Combustion) | R2C1 | **Blaze → Dark Blaze** | Dégâts feu périodiques |
| **Poison** (Venom) | R2C2 | **Toxin → Toxin Invasion** | Dégâts poison périodiques |
| **Bleed/Decay** (hémorragie) | R2C3 | **Decayed → Dark Decayed** | Dégâts physiques périodiques + synergy avec la réduc DEF |
| **Disease** | — | via **Vampire Touch/Kiss** | Réduit les soins reçus |

Les DoT **accélèrent la jauge berserk** du lanceur. Consensus communauté : Decay (Decayed) et Curse Breath dépassent Blaze/Toxin en utilité à haut niveau.

### Débuffs — série « Raze / Ravage » (~80% de réussite, 30 s, CD court)

| Skill (book 1 → book 2) | Statut infligé | Effet du statut |
|------------------------|----------------|-----------------|
| Physical Raze → Physical Ravage | **Decay** | −DEF physique |
| Medical Raze → Magical Ravage | **Weaken** | −défense |
| Combat Raze → Combat Ravage | **Impotent** | **−ATK physique ET magique** |
| **Courage Raze → Courage Ravage** | **Division** | **+30% dégâts subis** — le plus utile (géants, PTG, Pandora) |

Autres curses confirmés dans les données serveur (eSRO) et forums : **Dull** (−puissance magique, ~50% 30 s), Panic, **Short Sight** (−portée d'attaque), **Darkness** (vision), Disease (soins réduits), Fear, Confuse, Bind, Bleed.

### Contrôle

| Skill | Effet documenté | Notes |
|-------|-----------------|-------|
| **Stun** (mono) | **80% chance de stun** | La cible ne peut utiliser que des potions |
| **Daze → Wrath Daze** (AoE) | Stun jusqu'à 3 cibles | Noms PvP rapportés par le guide Valkyria |
| **Slumber → Deep Slumber** | Sommeil 1 → 3 cibles | Brisé si la cible est attaquée |
| Curse Breath → Dark Breath | Multi-curse de zone | — |

### Ligne « Sang »

| Skill | Effet | Notes |
|-------|-------|-------|
| **Vampire Touch → Vampire Kiss** | Dégâts + **vol de vie** + inflige Disease (augmente la réussite des debuffs) | Sustain signature du Warlock |
| Blood Flower → Death Flower | Nukes magiques | — |
| Bloody Trap → Death Trap | Pièges | — |

### Buffs Warlock

| Skill | Effet documenté | Notes |
|-------|-----------------|-------|
| **Reflect → Advanced Reflect** | **35% de chance de renvoyer les dégâts à 135%** | **Ignore Pain Quota / fences** — punit les bursts |
| Mirage / Phantasma | Utilitaires (illusions) | — |
| **Scream Mask** | Buff 2 alliés : chance de **stun l'attaquant** qui les touche | CD court, refresh constant ; n'affecte pas les dégâts absolus |
| Nuke « LTO-like » (cap 124+) | −DEF perso / +dégâts | Équivalent warlock du Life Turnover |
| **Aura of Blood** (cap 124+) | +30% dégâts berserk (self + party) | — |

---

## 🎵 Bard Skills

**Stats :** INT à STR · **Arme :** harpe (robe uniquement, pas de bouclier) · **Rôle :** buffer, batterie de mana

### Marches et Tambours

| Skill | Effet documenté | Notes |
|-------|-----------------|-------|
| **Moving March → Swing March** | +vitesse de déplacement du groupe | À recaster régulièrement (surtout lurers + après rez) |
| **Hit March → Clout March** | +hit ratio du groupe | Complète les marches |
| **Guard Tambour** | +DEF **physique** du groupe | **Non cumulable avec Mana Tambour** ; interrompu si le Bard prend des dégâts |
| **Mana Tambour** | +DEF **magique** du groupe | Idem — choisir selon les mobs |

### Mana et Anti-aggro

| Skill | Effet documenté | Notes |
|-------|-----------------|-------|
| **Mana Cycle** | Rend un montant **fixe de MP chaque seconde pendant 16 s** (cible unique) | Priorité : Clerics → DPS → soi |
| **Mana Orbit** | Régénère le MP de toute la party | Sans ciblage |
| **Noise** | Réduit l'aggro des monstres | **À garder actif en permanence** |
| Mana Switch | Gestion de mana de groupe | Utilisé en script party |
| Mana Wind → Mana Breeze | Variantes régén | — |

### Cures et Contrôle

| Skill | Effet | Notes |
|-------|-------|-------|
| Cure Melody | Cure 1 statut d'1 cible | — |
| **Cure Music** | Cure toute la party | Le cleanse de zone |
| Holding Calmor / Patter Calmor | Sommeil/contrôle | — |
| Temptation → Curious Temptation | Charme un monstre | — |

### Attaques (Bard « battle »)

| Skill | Effet | Notes |
|-------|-------|-------|
| Horror Chord / Weird Chord | Attaques de harpe | — |
| Booming Chord → **Booming Wave** | Attaque de zone | — |
| **Tuning Noise → Tuning Sound** | **Dégâts absolus** | Ignore les réductions |
| Discord Wave | Attaque de zone | — |

### Danses (haut niveau)

| Skill | Effet | Notes |
|-------|-------|-------|
| **Dance of Magic / Dance of Wizardry** | +dégâts **magiques** de la party | Interrompue si le Bard est touché |
| Dance of Healing | Soins de zone en dansant | Alternative PvP |
| Danse warrior / danse rogue | Buffs physiques respectifs | — |
| **Awesome World** | Permet de **danser seul** | **Effet réduit de moitié** |
| Passifs Beautiful Life / Bards Dream | Améliorent danses/mana | — |

⚠️ Deux Bards dans la même party : le 2e doit attendre l'annulation du tambour/danse du 1er.

---

## ⛪ Cleric Skills

**Stats :** full INT à full STR · **Arme :** cleric rod + bouclier · **Armure :** robe (bonus heal) ou light armor (bonus buffs) · **Rôle :** healer, buffs défensifs

### Soins

| Skill | Type | Effet documenté | Notes |
|-------|------|-----------------|-------|
| **Healing Cycle → Healing Orbit** | HoT | Soin **toutes les 3 secondes** | **N'attire AUCUNE aggro** — soin de fond principal |
| Healing Division → Healing Favor | Heal direct | Heal mono-cible, CD court | Bon pour *prendre* l'aggro |
| **Group Healing → Group Healing Breath** | Heal groupe | Jusqu'à 8 membres, cast plus long | — |
| **Group Recovery → Holy Group Recovery** | Heal burst | Soin instantané de zone | Grosse aggro, gros coût MP |
| **Recovery Division → Holy Recovery Division** | Buff HoT party | **300 s**, soigne périodiquement le membre le plus blessé — ~**445 HP/s** à haut rang | « Must max » ; posé en script sur toute la party |
| Overhealing → Glut Healing | Attaque | Dégâts fixes + aggro | Outil de tanking/aggro, pas de DPS |

### Résurrection

| Skill | Effet | Notes |
|-------|-------|-------|
| **Resurrection** | Résuscite un allié | Runes/XP loss selon rang et version |

### Buffs

| Skill | Effet documenté | Notes |
|-------|-----------------|-------|
| **Bless Spell** | **+DEF PHY et MAG du groupe** (fort) | Le buff défensif signature, posé en cycle |
| **Body Blessing / Body Deity** | +DEF physique | **30 min** |
| **Soul Blessing / Soul Deity** | +DEF magique | **30 min** |
| **Force Blessing / Force Deity** | **+STR** (→ HP + ATK PHY) | Sur warriors/lurers ; buff « limité » (1 par perso) |
| **Mental Blessing / Mental Deity** | **+INT** (→ MP + ATK MAG) | Sur les DPS INT |
| **Holy Word → Holy Spell** | Résistance aux **statuts anormaux** (curses Warlock...) | Contre-mesure clé |
| Innocent → Integrity | Cure un statut | — |
| **Reverse → Grad Reverse** (+ Group/Holy Group Reverse, Reverse Oblation/Immolation) | Renvoi de dégâts | Série reflect du Cleric |

### Attaques

| Skill | Effet documenté | Notes |
|-------|-------|-------|
| Trial Cross → Justice Cross | Nukes holy | — |
| **Offering / Pure Offering** | **La plus forte attaque du jeu — consomme 95% des HP du Cleric** (cast possible seulement si HP > 95%) | « Cleric bomb » — redoutable vs INT low-HP et LTO Wizards |

---

## ⏱️ Cooldowns et Animations Notoires

| Skill/Phénomène | Valeur documentée | Source |
|-----------------|-------------------|--------|
| **Meteor** | CD 10 s ; **groupe de cooldown partagé avec Fire Bolt** (FB→Meteor : 3 s ; Meteor→FB : 10 s) | Silkroad Forums (Wizard/Bard Guide) |
| **Earth Barrier / Earth Fence** | 20 s de durée, **CD 60 s** → cycle permanent avec 3 Wizards | Silkroad Forums |
| **Fire Blow / Salamander Blow** | Animation ~9 s, **7-9 hits**, annulable par Detect / Earth Barrier | Silkroad Forums + SRO Valkyria |
| **Délai de potion EU** | **15 s** entre chaque potion | Silkroad Temptation |
| **Pain Quota** | Durée **5 min** | SRO Valkyria |
| **Screens (Physical/Magical/Ultimate)** | Durée **1 min**, non stackables | SRO Valkyria |
| **Raze/Ravage (Warlock)** | ~80% de chance, 30 s, CD court | SRO Valkyria + forums |
| **Reflect Warlock** | 35% de chance, ratio 135%, **ignore la distribution de dégâts** | SRO Valkyria |
| **Healing Cycle/Orbit** | Tick **3 s**, zéro aggro | elitepvpers (Bard/Cleric) |
| **Recovery Division** | **300 s**, tick périodique | silkroadalani + elitepvpers |
| **Scorn (taunt Rogue)** | ~**7 s** | SRO Valkyria |
| **Butterfly Blow Dull** | 20% × 20 s | silkroad4arab |
| **Life Control** | +25% MAG / **−50% HP** (LTO +25% cumulé) | Silkroad Forums |

**Règle générale EU :** gros burst ⇒ long cooldown et/ou longue animation ; d'où l'importance des **rotations** et du **weapon switch** (ex: Warrior qui swap 1H↔2H, Rogue dague↔arbalète).

---

## 📊 Progression SP

- **~760 000 SP** pour maxer une combinaison **Wizard + Bard au cap 90** (guide Wizard/Bard, silkroadforums).
- Extrapolation communautaire : **~1,2-1,5 M SP** pour 2 masteries complètes au cap 110-120 (vs plusieurs millions côté chinois — d'où le « no SP farming requis » côté EU, le gap restant **optionnel**).
- Les paliers de mastery (achat des niveaux via SP) suivent une courbe croissante (ex: ~15 SP pour passer 13→14 dans les bas niveaux, bien plus haut ensuite — cf. [UnKnoWnCheaTs – Complete Guide to Skill Points](https://www.unknowncheats.me/wiki/Silkroad:Complete_Guide_to_Skill_Points)).

### Ordre d'apprentissage conseillé
1. **Main mastery** d'abord : lignes de dégâts/rôle + le book 1 de chaque ligne clé
2. **Sub mastery** : survie/support (Cleric heals, Bard mana...)
3. **Books 2** des skills clés (Meteor, Dare Devil, Guard Tambour, Recovery Division...)
4. **Passifs** en dernier (Natural Spirit, Magic Bound, Beautiful Life...)

---

## ❓ Incertitudes et Versions

| Point | Statut |
|-------|--------|
| Noms exacts des skills d'entrée (Slash, Bash, Spinning, Power Shot...) | Confirmés par listes in-game (PhBot) et guides |
| Double Stab / Cunning Stab (Warrior 1H), Axis Quiver | Présents dans les listes in-game ; orthographe/contenu exacts à vérifier en jeu |
| Chiffres exacts de dégâts et coûts MP par rang | Non publiés de façon fiable — dépendent du rang, du cap (90→140) et de la version (iSRO/vSRO/SilkroadR) ; non inventés ici |
| Paliers de mastery exacts de déblocage de chaque skill | Structure « book 1 tôt / book 2 plus haut » confirmée ; paliers précis variables selon le cap du serveur |
| « Transparent » (Rogue) / noms des curses mineurs Warlock (Slow/Dull/Stiffen) | Sources divergentes (guides turcs/japonais) — marqués comme incertains |
| Versions cap 121-140 (Aura of Blood, skills Rogue+) | Documentés par le guide SRO Valkyria ; noms exacts iSRO non croisés avec d'autres sources |

---

## 💡 Tips par Classe

**Warrior :**
- Iron Skin + Mana Skin = obligatoires sur tout build
- Vital Increase pour prendre l'aggro, **annulez-le** pour burst
- Pain Quota sur les 2 Clerics, fences sur les lurers, Protect sur les Wizards
- Équipez l'épée 1H **avant** le bouclier (sinon buffs party annulés)

**Rogue :**
- Combo knockdown (Hurricane Shot) → Mortal Wounds → Prick
- Crossbow Extreme seulement en situation de kill garanti (−50% HP/DEF)
- Rapid Shot = lure ; Scorn = interrupt de rez/buffs

**Wizard :**
- Ouvrez avec **Meteor avant Fire Bolt** pour maîtriser le cooldown partagé
- Earth Barrier entre deux nukes (annule l'animation de Fire Blow)
- LC+LTO pour le burst, mais vous êtes « one-shot » — gézrez la position (Teleport)

**Warlock :**
- Courage Raze (Division) sur chaque géant : +30% de dégâts pour toute la party
- Chaîne : debuff → stun/sleep → DoT AoE → Vampire Kiss
- Reflect punit les bursts et **ignore Pain Quota**

**Bard :**
- Noise actif en permanence ; Mana Cycle sur les Clerics d'abord
- Ne vous faites pas toucher : tambours et danses tombent sinon
- Deux Bards : coordonnez les tambours (annulation)

**Cleric :**
- Healing Orbit (zéro aggro) en fond + Group Healing en burst
- Recovery Division sur toute la party avant chaque pull
- Offering uniquement à HP > 95% — le finisher le plus dur du jeu

---

## 🔗 Resources (skills)

- **Traductions des 6 masteries EU (elitepvpers, structure grille R/C)** : [Warrior](https://www.elitepvpers.com/forum/sro-guides-templates/87726-silkroad-europe-warrior-skills-translation.html) · [Rogue](https://www.elitepvpers.com/forum/sro-guides-templates/87728-silkroad-europe-rogue-skills-translation.html) · [Wizard](https://www.elitepvpers.com/forum/sro-guides-templates/87730-silkroad-europe-wizard-skills-translation.html) · [Warlock](https://www.elitepvpers.com/forum/sro-guides-templates/87731-silkroad-europe-warlock-skills-translation.html) · [Bard](https://www.elitepvpers.com/forum/sro-guides-templates/87735-silkroad-europe-bard-skills-translation.html) · [Cleric](https://www.elitepvpers.com/forum/sro-guides-templates/87737-silkroad-europe-cleric-skills-translation.html)
- [The Full Wizard/Bard Guide (silkroadforums t=100199)](http://www.silkroadforums.com/viewtopic.php?f=5&t=100199) — cooldowns, groupes de CD, rotations
- [SRO Valkyria Beginner Guides (Warrior/Rogue/Wizard/Warlock/Bard/Cleric)](https://srovalkyria.blog.fc2.com/blog-category-1.html)
- [PhBot AutoParty.py — noms in-game des skills EU](https://github.com/Day4Date/PhBot-Plugins/blob/master/AutoParty.py)
- [eSRO skill_builder.cpp — effets/curses côté serveur](https://github.com/myildirimofficial/eSRO/blob/master/SOL/src/skill_builder.cpp)
- [Fandom Wiki – Skills](https://silkroadonline.fandom.com/wiki/Skills) · [Weapons](https://silkroadonline.fandom.com/wiki/Weapons)
- [Silkroad4Arab – explication des skills Rogue (Butterfly Blow/Dull)](https://www.silkroad4arab.com/vb/showthread.php?t=407416)
- [elitepvpers – Cleric heal skills (Healing Orbit/aggro)](https://www.elitepvpers.com/forum/silkroad-online/1289296-cleric-heal-skills.html)

---

*Dernière mise à jour: 2026-10-01 (révision majeure : remplacement des noms/chiffres non sourcés par les noms iSRO vérifiés et les valeurs documentées ; voir section Incertitudes pour les limites)*
*Sources: elitepvpers (traductions 2008), silkroadforums, SRO Valkyria, PhBot Plugins (GitHub), eSRO (GitHub), Fandom Wiki, silkroad4arab, silkroadalani*
