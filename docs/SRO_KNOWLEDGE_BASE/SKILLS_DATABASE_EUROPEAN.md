# Skills Database - European Classes

## 📋 Table des Matières
- [Notes de Structure des Skills EU](#-notes-de-structure-des-skills-eu)
- [Warrior Skills](#️-warrior-skills)
- [Rogue Skills](#️-rogue-skills)
- [Wizard Skills](#-wizard-skills)
- [Warlock Skills](#-warlock-skills)
- [Bard Skills](#-bard-skills)
- [Cleric Skills](#⛪-cleric-skills)
- [🇰🇷 Contenu KSRO (2011-2026)](#-contenu-ksro-2011-2026)
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
5. **Noms ZH (TW officiel)** — les 6 masteries EU ont des noms chinois officiels côté service taïwanais (DiGeam) : Warrior **聖戰士** · Rogue **刺客** · Wizard **元素使** · Warlock **魔元素使** · Bard **吟遊詩人** · Cleric **聖職者**. Armes : 單手劍 (épée 1H), 雙手劍 (épée 2H), 雙斧 (double hache), 匕首 (dagues), 十字弓 (arbalète), 法杖 (staff), 術杖 (dark staff), 豎琴 (harpe), 牧杖 (clerical rod) ; armures : 重盔甲 (Heavy Armor), 轻铠甲 / TR 輕鎧甲 (Light Armor), 法袍 (Robe). Sources : [wiki Bahamut](https://wiki2.gamer.com.tw/wiki.php?n=10948:洛克山) + [DiGeam](https://srowiki.digeam.com/), via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) (recherche ZH 2026-10). Aucun nom officiel FR/TR/DE des skills EU : le client n'a jamais été localisé dans ces langues ([RESEARCH_FR](ML_RESEARCH/RESEARCH_FR.md) · [RESEARCH_TR](ML_RESEARCH/RESEARCH_TR.md) · [RESEARCH_DE](ML_RESEARCH/RESEARCH_DE.md)).
6. **Valeurs chiffrées par niveau ✅ (extraction skilldata 2026-10)** : **3 637 skills EU** décodés depuis `skilldata_5000.txt` (fichiers serveur vSRO 1.188 + extension cap 120, repo [joaoldematejr/server_files_sro](https://github.com/joaoldematejr/server_files_sro)) — 47 colonnes par niveau (dégâts %/min/max, MP/HP, SP, timers ms, portée, armes, statuts) dans [ML_RESEARCH/data/skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv). Loi structurante : **le % de dégâts est FIXE par série**, seule la part fixe min~max monte avec le niveau. Rapport : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md). ⚠️ Certaines séries (ex. Fire Blow) ont **plusieurs lignes par niveau** (segments de combo A2…A7 à MP = 0, chaînés par `Basic_ChainCode`) : filtrer sur `mp_cost > 0` selon l'usage.

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
| **Maddening** | Attaque | Frappe lourde | ✅ skilldata : 487 % fixe, +172 (lv1) → +665 (lv9), MP 377→1 097 ; knockback [50, 30] + taunt |
| **Dare Devil** | Attaque ultime | **La plus forte attaque du Warrior** | ✅ skilldata 2026-10 : **305 % + 702~858 → 305 % + 2 262~2 765** (maîtrise 80→120, 11 rangs), **2 hits**, CD 5 s, MP 1 311→4 063, knockback [30, 50] + taunt |

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
| **Iron Skin** | Self | **+DEF physique** | « MUST have » (tous guides) · ✅ skilldata : absorption **238 → 2 972** (14 rangs, maîtrise 40→118), CD 2 min, MP 77→842 |
| **Mana Skin** | Self | **+DEF magique** | « MUST have » (tous guides) |
| Warcry | Self (2H) | Buff offensif 2H | Réservé à la ligne deux-mains |
| **Pain Quota** | 2 membres | **Partage les dégâts des 2 cibles sur toute la party** | **5 min** (300 000 ms `dura`) — le buff party n°1 ; à poser sur les 2 Clerics · ✅ skilldata : CD 2 s, MP 17→256, maîtrise 20→100 |
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
| **Fire Bolt** | Nuke | Mono-cible, bon pour le solo | ✅ skilldata 2026-10 : **366 % + 32~39 → 366 % + 3 438~4 202** (maîtrise 4→120, **30 rangs**), MP 37→**5 799**, SP 2→**27 050**, burn 28→260, CD 4 s. Partage son **groupe de cooldown** avec Meteor |
| **Meteor** | Nuke ultime | **Le plus gros nuke du Wizard, jusqu'à 3 cibles très proches** | ✅ skilldata : **439 % + 582~711 → 439 % + 3 076~3 760** (maîtrise 60→116, 15 rangs), **2 hits**, **CD 10,5 s** (10 500 ms), MP 2 189→12 444 ; ordre de cast change le CD partagé (Meteor→Fire Bolt 10 s ; Fire Bolt→Meteor 3 s) |
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
| **Mana Orbit** | Régénère le MP de toute la party | ✅ skilldata : **15 896 → 30 000 MP** (maîtrise 90→120) — le skill le plus cher du jeu en MP au lv1 |
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
| **Healing Cycle → Healing Orbit** | HoT | Soin **toutes les 3 secondes** | **N'attire AUCUNE aggro** — soin de fond principal · ✅ skilldata 2026-10 : Healing Orbit **1 819 → 4 722** par cycle (maîtrise 80→116, 7 rangs), durée 16 s, CD 10 s, MP 5 822→15 111 |
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

---

## 🇰🇷 Contenu KSRO (2011-2026)

> **Noms coréens officiels (269 skills)** — le **calculateur de skills officiel** du site KSRO (https://krsilkroadcp.joymax.com/gamedata/skill/skillCalculator.asp) embarque la table complète `skillName["CODENAME"] = "nom coréen"` de la race européenne : **269 skills** codename ↔ nom KR, exploitable pour un extract complet (il inclut aussi `skillRank`, le nombre de niveaux par skill, jusqu'à 30 pour certains rangs de buff). Rapport : [ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md §4](ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md). Caps KR : 120 (2011) → 125/130 (2014/2015) → 140 (2018, inchangé 2026) — le plafond EU « 2 × niveau » n'est pas re-publié au-delà de 240.

Échantillon représentatif par classe (extrait de la table officielle, codename → nom KR) :

| Classe | Codename → nom KR officiel |
|---|---|
| Warrior | WARRIOR_ONEHANDA_STRIKE_A **슬래쉬** · WARRIOR_ONEHANDA_CRITICAL_A **버서커** · WARRIOR_TWOHANDA_CHARGE_A **차지 스윙** · WARRIOR_DUALA_WHIRLWIND_B **크루셜 러쉬** · WARRIOR_FRENZYA_TOUNT_AREA_A **하울링 샤우트** |
| Rogue | ROG_STEALTHA_HIDING_A **스텔스** · ROG_BOWA_POWER_A **파워 샷** · ROG_DAGGERA_CHAIN_A **스피닝** · ROG_POISONA_FIELD_B **베인 트랩** · ROG_TRANSFORMA_MASK_A **몬스터 마스크** |
| Wizard | WIZARD_COLDA_POINT_A **아이스 볼트** · WIZARD_FIREA_POINT_B **메테오** · WIZARD_PSYCHICA_LIGHT_B **체인라이트닝** · WIZARD_EARTHA_AREA_B **어스 퀘이크** · WIZARD_SPIRITP_FIRE_A **파이어 스피릿** |
| Warlock | WARLOCK_DOTA_POISON_B **톡신 인베이젼** · WARLOCK_BLOODA_LIFEDRAIN_B **뱀파이어 키스** · WARLOCK_SOULA_MEZ_B **딥 슬럼버** · WARLOCK_RAZEA_STR_B **컴뱃 레비지** |
| Bard | BARD_BATTLAA_DAMAGE_B **위어드 코드 3** · BARD_DANCEA_WARRIOR_B **댄싱 오브 파이트** · BARD_RECOVERA_MANATRANS_B **마나 브리즈 6** · BARD_SPEEDUPA_MSPEED_B **스윙 마치** |
| Cleric | CLERIC_HEALA_GROUP_B **그룹 힐링 브리즈** · CLERIC_REBIRTHA_SPECIAL_A **리버스 오블레이션-부활** · CLERIC_BLESSA_STR_A **포스 블레싱** · CLERIC_SAINTA_ABNORMAL_A **홀리 워드** |

- 💡 Les skills EU portent en Corée des **transcriptions anglo-coréennes** (파이어 볼트 = Fire Bolt), à l'exception des séries numérotées (코드 0-4 du Bard) — cohérent avec l'origine « anglaise » de la race EU.
- ⚠️ Les codenames ci-dessus sont la **clé universelle** (identique KSRO/iSRO/vSRO) : la table officielle KR offre la couche display coréenne manquante pour les 6 masteries EU (cf. noms ZH côté TW, section Notes de structure).

---

## ⏱️ Cooldowns et Animations Notoires

| Skill/Phénomène | Valeur documentée | Source |
|-----------------|-------------------|--------|
| **Meteor** | CD **10,5 s** (10 500 ms) ; **groupe de cooldown partagé avec Fire Bolt** (FB→Meteor : 3 s ; Meteor→FB : 10 s) | Silkroad Forums + ✅ skilldata 2026-10 |
| **Earth Barrier / Earth Fence** | 20 s de durée, **CD 60 s** → cycle permanent avec 3 Wizards | Silkroad Forums |
| **Fire Blow / Salamander Blow** | Animation ~9 s, **7-9 hits**, annulable par Detect / Earth Barrier | Silkroad Forums + SRO Valkyria |
| **Délai de potion EU** | **15 s** entre chaque potion | Silkroad Temptation |
| **Pain Quota** | Durée **5 min** — ✅ **confirmée** par skilldata (300 000 ms), CD 2 s | SRO Valkyria + ✅ skilldata 2026-10 |
| **Screens (Physical/Magical/Ultimate)** | Durée **1 min**, non stackables | SRO Valkyria |
| **Raze/Ravage (Warlock)** | ~80% de chance, 30 s, CD court | SRO Valkyria + forums |
| **Reflect Warlock** | 35% de chance, ratio 135%, **ignore la distribution de dégâts** | SRO Valkyria |
| **Healing Cycle/Orbit** | Tick **3 s**, zéro aggro | elitepvpers (Bard/Cleric) |
| **Recovery Division** | **300 s**, tick périodique | silkroadalani + elitepvpers |
| **Scorn (taunt Rogue)** | ~**7 s** | SRO Valkyria |
| **Butterfly Blow Dull** | 20% × 20 s | silkroad4arab |
| **Life Control** | +25% MAG / **−50% HP** (LTO +25% cumulé) | Silkroad Forums |

**Règle générale EU :** gros burst ⇒ long cooldown et/ou longue animation ; d'où l'importance des **rotations** et du **weapon switch** (ex: Warrior qui swap 1H↔2H, Rogue dague↔arbalète).

> 📊 ✅ (extraction skilldata 2026-10) Statistiques client (6 909 skills joueurs CH+EU) : cooldown le plus fréquent **4 s** (955 skills castables), puis 10 s, 5 s, 8 s, 3 s ; portées codées : **150** = nukes distance (1 645 skills), **100** = mi-portée EU, **50** = AoE mêlée. La colonne `Action_CoolTime` (2ᵉ timer, 0 sur la plupart) est présente mais non interprétée — candidate naturelle pour les **groupes de CD partagés** (Meteor↔Fire Bolt, Lion Shout), à confirmer. Source : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md).

---

## 📊 Progression SP

- **~760 000 SP** pour maxer une combinaison **Wizard + Bard au cap 90** (guide Wizard/Bard, silkroadforums).
- Extrapolation communautaire : **~1,2-1,5 M SP** pour 2 masteries complètes au cap 110-120 (vs plusieurs millions côté chinois — d'où le « no SP farming requis » côté EU, le gap restant **optionnel**).
- ✅ (extraction skilldata 2026-10) **Ordres de grandeur réconciliés** : le coût SP cumulé pour apprendre **toutes les séries d'une maîtrise complète au cap 120** (fichiers serveur vSRO 1.188 + extension 120) est **Warrior 4 204 688 SP** · Warlock 3 672 099 · Rogue 2 930 473 · Cleric 2 813 755 · Wizard 2 771 857 · Bard 2 575 210 — les ~760 k du guide (cap 90, sélection de lignes) et ces totaux (cap 120, arbre complet) sont cohérents entre eux. Le `req_sp` exact de chaque rang est dans [ML_RESEARCH/data/skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv). Source : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md §4.5](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md).
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
| Chiffres exacts de dégâts et coûts MP par rang | ✅ **Résolu (extraction skilldata 2026-10)** : 3 637 skills EU décodés (47 colonnes par rang) — [ML_RESEARCH/data/skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv) ; % fixe par série, seule la part fixe min~max monte. Limites résiduelles : tags imbriqués non décodés (Pain Quota, DoT Warlock, invocations — bruts dans `params_raw`) et sémantique exacte des `att` kinds 6/9 à confirmer en jeu. Les valeurs iSRO officielles post-2010 (format `Param1..12`) restent hors périmètre |
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
- [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) — noms ZH (TW) officiels des 6 masteries EU, armes et armures ([wiki Bahamut](https://wiki2.gamer.com.tw/wiki.php?n=10948:洛克山) · [DiGeam](https://srowiki.digeam.com/))

### Valeurs chiffrées par niveau (extraction skilldata 2026-10)
- [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md) — décodage complet de `skilldata_5000.txt` (vSRO 1.188 + cap 120) : colonnes, tags fourcc, loi « % fixe par série », stats cooldowns/portées
- [ML_RESEARCH/data/skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv) — 3 637 lignes (un rang = une ligne), 47 colonnes décodées + `params_raw` (⚠️ segments de combo type Fire Blow : filtrer `mp_cost > 0`)
- [ML_RESEARCH/data/skills_series.csv](ML_RESEARCH/data/skills_series.csv) · [ML_RESEARCH/data/skills_masteries.csv](ML_RESEARCH/data/skills_masteries.csv) — vues par série et par maîtrise
- Sources primaires : [joaoldematejr/server_files_sro](https://github.com/joaoldematejr/server_files_sro) (`SMC/SR_GameRefData/skilldata_*.txt`) · [tarekwiz/SilkroadBot — skills.txt](https://github.com/tarekwiz/SilkroadBot) (noms) · [hnguyenaa/MySilkroad — RawRefSkill.cs](https://github.com/hnguyenaa/MySilkroad) (colonnes) · [ferdoran/openroad](https://github.com/ferdoran/openroad) (tags fourcc)

---

*Dernière mise à jour: 2026-10-01 (révision majeure : remplacement des noms/chiffres non sourcés par les noms iSRO vérifiés et les valeurs documentées ; enrichi des noms ZH/TW officiels des masteries — recherche multilingue ML_RESEARCH ; voir section Incertitudes pour les limites ; ajout de la section 🇰🇷 Contenu KSRO 2011-2026 : calculateur officiel = table codename → 269 noms KR — rapport ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md §4 ; ajout des **valeurs chiffrées par rang** (Dare Devil, Meteor, Fire Bolt, Pain Quota, Healing Orbit, Mana Orbit, SP cap 120) — extraction skilldata 2026-10, rapport ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md, CSV ML_RESEARCH/data/skills_detail_EU.csv)*
*Sources: elitepvpers (traductions 2008), silkroadforums, SRO Valkyria, PhBot Plugins (GitHub), eSRO (GitHub), Fandom Wiki, silkroad4arab, silkroadalani ; noms ZH : wiki Bahamut + DiGeam (via ML_RESEARCH/RESEARCH_ZH.md) ; chiffres par rang : skilldata_5000.txt (fichiers serveur vSRO 1.188 + cap 120, repo joaoldematejr/server_files_sro), noms croisés skills.txt (tarekwiz), colonnes RawRefSkill.cs (hnguyenaa), tags fourcc openroad — valeurs vérifiées marquées ✅ skilldata 2026-10*
