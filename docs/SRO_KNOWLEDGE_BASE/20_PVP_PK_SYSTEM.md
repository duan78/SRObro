# PvP and PK System

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [PvP Consensuel vs PK](#-pvp-consensuel-vs-pk)
- [Murderer System](#-murderer-system)
- [PK Penalties (données techniques)](#-pk-penalties-données-techniques)
- [Décrément des Murder Points](#-décrément-des-murder-points)
- [PvP Capes](#-pvp-capes)
- [Arena](#-arena)
- [Capture the Flag (CTF)](#-capture-the-flag-ctf)
- [Job PvP (Thief / Hunter / Trader)](#-job-pvp-thief--hunter--trader)
- [Fortress War](#-fortress-war)
- [Strategies PvP par Classe](#-strategies-pvp-par-classe)
- [Tips pour Réussir en PvP](#-tips-pour-réussir-en-pvp)
- [Différences Classic vs Silkroad-R](#-différences-classic-vs-silkroad-r)
- [FAQ](#-faq)
- [Findings Recherche Multilingue (2026-10)](#-findings-recherche-multilingue-2026-10)
- [Resources](#-resources)

---

## ⚔️ Vue d'Ensemble

Le système **PvP (Player vs Player)** et **PK (Player Killing)** de Silkroad Online permet aux joueurs de s'affronter, avec des conséquences réelles pour les comportements « criminels » (murderer).

### Points Clés
- ✅ **PvP consensuel :** capes, duels, job suits, arène, CTF, Fortress War — aucune pénalité
- ✅ **PK (Player Killing) :** tuer des joueurs innocents → murder points
- ✅ **Murderer System :** statut visuel (nom), drop d'items à la mort, perte d'EXP accrue
- ✅ **Guards** attaquent les murderers en ville
- ✅ **Décrément :** les murder points diminuent en tuant des monstres
- ✅ **Arène & CTF :** PvP organisé avec récompenses

---

## 🤝 PvP Consensuel vs PK

### PvP Consensuel

**Conditions (aucune pénalité) :**
- **Capes PvP** : les deux joueurs portent une cape de couleurs différentes (voir [PvP Capes](#-pvp-capes))
- **Job suits** : joueurs en tenues de job opposées (Thief vs Hunter/Trader)
- **Arena / CTF / Fortress War** : zones/events dédiés
- **Duel** (party/invitation selon version)
- **Serveurs PvP dédiés** (ex: « Sky City » chez certains éditeurs) : PvP libre sans pénalité

### PK (Player Killing)

**Définition :** tuer un joueur qui n'a **pas** activé de PvP (pas de cape, pas de job suit, pas en event).

**Conséquences :**
- Gains de **murder/penalty points** (voir ci-dessous)
- Statut **Murderer** visible (nom)
- À la mort : **chance de dropper des items**, perte d'EXP accrue

**Cas particuliers (pas de PK) :**
- Self-defense : si un joueur vous attaque en premier (flag), le tuer ne compte pas
- Tuer un **murderer** : aucun murder point (au contraire, chassé légitimement)

---

## 👿 Murderer System

### Comment devient-on Murderer

Chaque kill non-consensuel ajoute des **murder points** (PK penalty points). Les seuils (sources communautaires, voir divergences) :

| Murder Points | Statut | Nom affiché | Pénalités |
|---------------|--------|-------------|-----------|
| 1 - 499 | Léger | nom légèrement coloré | drop faible possible |
| **500+** | **Murderer Level 1** | rouge clair | drop items possible, guards hostiles |
| **1000+** | **Murderer Level 2** | rouge | drop fort, EXP loss accru |
| **2000+** | **Murderer Level 3** | rouge foncé + icône | drop massif, débuffs |

> ✅ **Résolu (recherche FR, 2026-10)** : la divergence « wiki FR 300/500/1000 vs wiki EN 500/1000/2000 » est tranchée en faveur de **500/1000/2000**. Le wiki Fandom FR de Silkroad **n'existe pas** — vérifié 3 voies : `silkroad.fandom.com/fr/api.php` → 404, `silkroadonline.fandom.com/fr/api.php` → 404, aucune version linguistique FR listée sur le wiki EN et aucun snapshot Wayback. La mention « wiki FR via flux » était une **source fantôme** ; aucune source FR réelle (JeuxOnline, GMS Temple, JeuxVideo.com, Wikipédia FR) ne soutient les seuils 300/500/1000. Les seuils ci-dessus sont retenus **sans réserve**.
> Source 🇫🇷 : rapport [ML_RESEARCH/RESEARCH_FR.md](ML_RESEARCH/RESEARCH_FR.md) §Incertitudes résolues (constat négatif vérifié, confiance 5/5).

### Apparence du Murderer

- **Nom rouge** (de plus en plus foncé selon le niveau)
- **Icône de crâne/bandeau** au-dess de la tête (haut niveau)
- Visible par tous — c'est une cible légitime : **tuer un murderer ne donne pas de murder points**

### Conséquences en jeu

- **Guards de ville** : attaquent à vue les murderers (impossible d'utiliser les NPCs en toute sécurité)
- **Perte d'EXP à la mort** : ~**2%** de base, **plus élevée en murderer** (selon statut)
- **Drop d'items à la mort** : voir section suivante (données techniques)

### 📜 Règles PK officielles TW (DiGeam 絲路紀元 — page officielle)

Source 🇨🇳 (chinois traditionnel) : **https://sro.digeam.com/post_1113-1** (site officiel du service TW/HK/MO opéré par DiGeam), via rapport [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) :

**Activation et restrictions :**
- PK possible dès **Lv 20+** (sous Lv 19 : ne peut ni PK ni être victime)
- Activation en maintenant la touche **Alt**
- PK **interdit** en équipe / guilde / ville
- Attaquer les **pets, invocations ou transports** d'un joueur = PK

**Les 3 états (noms officiels TW) :**

| État | Nom TW | Signification | Règle |
|---|---|---|---|
| ⚪ Blanc | 一般人 | neutre | état par défaut |
| 🟣 Violet | 加害者 | agresseur | persiste durant le combat (si la cible riposte, pas de pénalité pour elle) |
| 🔴 Rouge | 杀人者 | meurtrier | **attaquer un rouge n'entraîne aucune pénalité** |

**Pénalités de l'état rouge (liste officielle) :**
1. Impossible d'**ouvrir un stall**
2. Impossible d'utiliser le **retour en ville**, les portails, les transports et les montures
3. **En ville : 2% de dégâts toutes les 4 secondes + régénération stoppée**
4. À la mort : perte d'EXP **et** de SP supplémentaire + **chance de drop d'équipement**
5. **Scroll de résurrection : XP réduit de moitié**

**Points de crime (恶人值) :**
- Tuer un joueur neutre en rapporte ; **tuer des monstres les réduit** ; **à zéro, l'état rouge disparaît** ; une valeur trop élevée impose un état PK forcé (formulation officielle ambiguë)
- ⚠️ Les valeurs « 500 de base, +50 par niveau d'écart » ne circulent que via des sources **mobiles** (gfpao, remake 2024-2025) — **exclues** de la KB PC conformément aux recommandations du rapport ZH

**Anecdote officielle 🇨🇳 :** un **classement des joueurs rouges** (红名排行榜) existait sur le service CN et a été purgé à la suite d'une exploitation (source : https://silkroad.iccgame.com/content-669-66645.html, iccgame officiel).

---

## ⚖️ PK Penalties (données techniques)

### Drop d'items à la mort — décompilation serveur (florian0, 2016)

Le serveur exécute : `rand() % 101 <= DeathPenaltyRate(player)` — le taux est comparé à un jet 0-100 :

| PK Penalty Points | Chance de drop à la mort |
|-------------------|--------------------------|
| **0 (joueur normal)** | **5%** |
| **> 0** (au moins 1 kill) | **30%** |
| **≥ 4 000** | **50%** |
| **≥ 15 000** | **70%** |
| **≥ 30 000** | **100%** |

> ℹ️ Ces `pk_penalty_point` sont la valeur **interne** du serveur (1 kill ≈ quelques centaines/milliers de points selon le niveau de la victime et le contexte — correspondance exacte non documentée). L'ordre de grandeur : quelques kills = déjà 30% de risque.

### Ce qui peut tomber

**Si PK Penalty Status actif (>0 points) :**
- Un **slot d'équipement aléatoire 0-12** est tiré (`rand % 13`)
- **Slots protégés** (re-rulés vers 0-5) : arme (6), bouclier/munitions (7), inconnu (8)
- **Slots droppables** : casque (0), torse (1), épaules (2), gants (3), jambes (4), bottes (5), boucle d'oreille (9), collier (10), anneau G (11), anneau D (12)

**Si pas de penalty points (ou rien de droppable) :**
- Un **item d'inventaire aléatoire** peut tomber (index tiré au hasard)

**Jamais droppables :**
- Items de **quête/event**
- Items **Item Mall** (cash shop)
- Items flaggés non-droppables dans RefObjCommon

### Perte d'EXP

- Mort normale : **~2% d'EXP**
- Mort en murderer : perte accrue (dé-level possible)
- ✅ Témoignage d'époque 🇩🇪 (2006) : mort en murderer = **−6% d'EXP** — guide SP farming Radon, https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/1454-guide-sp-farming-was-wie-wann (via [ML_RESEARCH/RESEARCH_DE.md](ML_RESEARCH/RESEARCH_DE.md))
- Le **de-level** par mort en murderer existe (retours communautaires multiples)

---

## 🔻 Décrément des Murder Points

**Comment redevenir normal (wiki EN + communauté) :**
- Tuer des **monstres de niveau proche/supérieur** au votre réduit les murder points
- Ordre de grandeur communautaire : **−1 à −5 points par monstre** selon le niveau du monstre vs le vôtre (haut niveau = plus de réduction)
- Décroissance passive par le temps : très lente/non confirmée sur iSRO classic (les FAQ anciennes mentionnaient « attendre », sans chiffre officiel)
- Sur certaines versions : possibilité de payer une amende (NPC) — variable par serveur

> ✅ **Corroboration ZH (officiel TW, 2026-10)** : la page officielle DiGeam confirme que **tuer des monstres réduit les points de crime** (恶人值) et que **l'état rouge disparaît à zéro** (https://sro.digeam.com/post_1113-1).

**Murder count vs PK penalty points :** le `murder count` (nombre de kills) affiché et les `pk_penalty_points` internes peuvent différer (le second pondère par contexte : niveau de la victime, job flags...).

---

## 🧣 PvP Capes

### Fonctionnement

- Achetées auprès du **Cape Merchant** dans les villes
- En portant une cape, vous pouvez attaquer (et être attaqué par) **toute cape de couleur différente**
- **Même couleur = aucune attaque possible** (protection)
- **Pas de murder points** : combat 100% consensuel
- Retirer la cape en combat : impossible/interdit (déséquipement)

### Les 4 couleurs (prix indicatifs iSRO)

| Couleur | Prix (or) | Note |
|---------|-----------|------|
| **White (Blanche)** | ~5 000 | la plus courante |
| **Orange** | ~1 500-2 000 | |
| **Red (Rouge)** | ~2 000 | |
| **Black (Noire)** | ~1 000 | |

> Organisation type : chaque « armée » de PvP porte une couleur convenue — les couleurs définissent les équipes open-world.

### Sky City (serveurs PvP dédiés)

Sur les serveurs dédiés PvP (ex: Sky City de l'édition occidentale), le port de la cape est **obligatoire** pour toute la map (PvP libre sans pénalité).

---

## 🏟️ Arena

### Arena (zones libres)

- NPC d'accès dans les villes principales
- PvP **sans pénalités** (pas de drop, pas d'EXP loss, pas de murder points)
- Formats : libre (FFF), zones de duel

### Arena League (event, données fandom)

- **Entrée : Arena Coin** (10 points par entrée selon version)
- Récompenses journalières connectées **14 jours consécutifs** (bonus majeurs au terme)
- Classements et récompenses de fin de saison

---

## 🚩 Capture the Flag (CTF)

### Règles (iSRO classique, données croisées fandom + officiel)

| Paramètre | Valeur |
|-----------|--------|
| **Horaires** | Jeudi & Dimanche, 21:00-22:00 |
| **Inscription** | 20:15 → 20:55 (avant le match) |
| **Conditions** | Guilde niveau 1+, joueur **niveau 30+** |
| **Durée du match** | 20 minutes |
| **Objectif** | Capturer le drapeau ennemi et le ramener à sa base |
| **Port du drapeau** | Le porteur tient le drapeau **60 secondes** pour valider |
| **Cooldown du drapeau** | 15 secondes après une capture |
| **Points** | +5 points par capture d'équipe |
| **Minimum de joueurs** | 8+ joueurs inscrits (privés : événement annulé sinon) |

### Récompenses (iSRO classique)

- **Luck Stone (pierre de chance)** — alchimie
- **Elegance/Virtue stones**
- **Elixir disposants** (dispersers)
- Sur serveurs privés : monnaies event, Magic Pop cards, etc.

### Notes de jeu

- Les kills en CTF ne donnent **aucun murder point**
- Les potions/pills sont utilisables (selon règles d'event)
- Le porteur de drapeau est ralenti — l'escorte est essentielle

---

## 💼 Job PvP (Thief / Hunter / Trader)

### Principe

- Le port d'un **job suit** (acheté ~500 000 or + niveau de job requis) active le PvP de job
- **Thief** vs **Hunter/Trader** : attaques libres et réciproques, **sans murder points**
- Seule l'équipe adverse visible via les tenues

### Spécificités

- **Thieves** : attaquent les caravanes, volent le loot des traders morts
- **Hunters** : protègent les traders, tuent les thieves (récompenses de job XP/points)
- **Traders** : transportent des marchandises (PvE défensif + risque PvP)
- Job XP et job points gagnés sur les kills
- Les pénalités de drop à la mort s'appliquent aussi aux jobs (job flag = facteur aggravant dans le code de death penalty, cf. florian0)

### 🧹 Système « Wanted » des Thieves (données multilingues)

| Donnée | Valeur | Source |
|---|---|---|
| État **현상범** (recherché) | au-delà de **2 000 penalty points** → marqueur « wanted » + **changement de métier bloqué** | 🇰🇷 Inven — présentation officielle open beta (20/12/2004) : https://www.inven.co.kr/webzine/news/?news=2285 |
| **Arrange Point (Wanted)** | seuil **≥ 3 000 points** → marqueur rouge, **attaquable même sans costume** ; se purge en payant l'amende à la Hunter Guild ou en se laissant tuer (perte d'EXP) | 🇹🇷 SroMax — guide Thief : https://www.sromax.com/konular/silkroad-online-thief-olmak-hirsiz-jobu-rehberi.294 |

> ⚠️ Divergence 2 000 (KR 2004) vs 3 000 (TR moderne) : époques et services différents — à trancher avec le client cible.

---

## 🏰 Fortress War

- PvP de guilde massif (structuré : sièges, tanks, canons, guardians)
- Attribution par **enchères** (bid) des guildes
- Détails complets : voir [19_FORTRESS_WAR.md](19_FORTRESS_WAR.md)
- Aucun murder point (zone d'event dédiée)

---

## 🎯 Strategies PvP par Classe

### Chinese Builds

#### STR Blader / Glavier (Sword/Blade, Spear/Glaive)
**Vs INT :**
- Fermer la distance rapidement (speed passif lightning)
- KD → stabs (×2 dégâts au sol) avant qu'il ne nuke
**Vs STR :**
- Trade de coups, potions, meilleurs crits/gear
**Key :** rester au contact, enchaîner les KD/stabs avec animation cancelling

#### INT Nuker (Sword/Spear + nukes, ou pure)
**Vs STR :**
- **Kite** absolu : freeze (Cold imbue), frostbite, movement speed
- Nuke depuis la max distance
**Vs INT :**
- Duel de burst : le premier qui nuke en premier
**Key :** gérer la distance, Snow Shield (absorbe 50% des dégâts en MP), Universal Pills

#### Bow (Pacheon)
**Vs tous :**
- Kite à 10-15 m, Strong Bow + crit
- Knockback pour interrompre les casts EU
**Key :** le kiting le plus propre du jeu

### European Classes

#### Warrior
- Tanky, burst avec KD chain (Will Turn → stabs)
- Faible vs : Wizards (kite), Rogues (stealth burst)
**Key :** encaisser et chain-CC

#### Rogue (Daggers / X-Bow)
- **Stealth** (Sneak : invisible) → ouvertures en burst
- Sneak Attack : gros dégâts, uniquement depuis la furtivité (l'attaque rompt le stealth)
- Prick : dot + réduction de heal
**Key :** burst depuis l'ombre, reset, recommencer

#### Wizard
- Gros nukes AoE à distance (Meteor, Blizzard)
- Faible si focus — dépend des CC alliés
**Key :** range + AoE + kiting

#### Warlock (le roi du 1v1 organique)
- **Débuffs en chaîne** : Physical/Magical Raze (−défenses), Combat Raze (Impotent : −dégâts infligés), Medical Raze (Division : +dégâts subis)
- **DoT** : Burn/Poison/Decay/Combustion
- **Hard CC** : Fear (fuite incontrôlée), Sleep (break au dégât), Stun
- **Anti-heal** : Disease (bloque les soins), Zombie (potions = dégâts), Panic (bloque les consommables)
**Key :** empiler les débuffs, laisser mourir à petit feu

#### Bard
- Support : buffs de vitesse/MP, swich
- En 1v1 : sous-dominant, mais intuable avec le bon cycle

#### Cleric
- Heals, cures (dispel des débuffs), Reverse (résurrection)
- En 1v1 : stalemate — intuable mais peu de dégâts
- **En groupe : la classe qui décide les fights**

---

## 💡 Tips pour Réussir en PvP

### General Tips

1. **Pill le bon grade :** Universal Pill 1/2/3 selon le status (freeze/frostbite = 1 ; burn/poison/decay = 2 ; curses warlock = 3)
2. **Buffs complets** avant tout fight (attack %, defense, speed, parry ratio)
3. **Animation cancelling :** +30-70% de DPS effectif (voir [04_COMBAT_SYSTEM.md](04_COMBAT_SYSTEM.md#-animation-cancelling))
4. **Positionnement :** ligne de vue, terrain, ne pas se faire surround
5. **Connaître l'ennemi :** STR vs INT, CD de ses skills, ses cures
6. **Gear :** +crit (PHY builds), absorb HP/MP, parry ratio, block (bouclier 15-20%+)

### Class-Specific Tips

**Melee (STR) :**
- Fermer le gap, KD → stabs, rester collé
- Block avec bouclier vs melee

**Ranged (INT/Bow) :**
- Kite, slows (Cold), knockback (Bow)
- Snow Shield pour survivre au switch

**Stealth (Rogue) :**
- Ouvrir du stealth, reset si le burst échoue

**Warlock :**
- Toujours ouvrir par les Razes (−défenses) avant les DoT
- Garder Fear/Stun pour interrompre les heals

---

## 🔄 Différences Classic vs Silkroad-R

| Aspect | Classic iSRO | Silkroad-R |
|--------|--------------|------------|
| **PK penalties** | Sévères (murderer complet) | Assouplis |
| **Murderer state** | Drop items possible dès 1 kill (30%) | Réduit |
| **PvP events** | Arena, CTF, Fortress | Identiques + variants |
| **Job PvP** | Identique | Identique |

> Le système murderer complet (avec les taux de drop du serveur) caractérise l'expérience classic ; Silkroad-R (2012) l'a adouci pour élargir l'audience. Les serveurs privés « classic » restauraient souvent les taux durs.

---

## ❓ FAQ

### Q: Le PK est-il autorisé ?
**R:** Oui, mais chaque kill non-consensuel ajoute des murder points → dès le premier kill vous avez **30% de risque de dropper un item** à votre prochaine mort (données serveur).

### Q: Peut-on jouer en murderer ?
**R:** Difficile : guards hostiles en ville, drop à la mort, chasse des autres joueurs (vous tuer ne les pénalise pas).

### Q: Comment retirer les murder points ?
**R:** Tuer des monstres de votre niveau ou plus (−1 à −5 points/monstre environ). C'est long.

### Q: Les murderers peuvent-ils redevenir normaux ?
**R:** Oui, en farmant des monstres (voir ci-dessus). Le statut tombe quand les points repassent sous les seuils.

### Q: Le PK en job compte-t-il ?
**R:** Non : Thief vs Hunter/Trader en tenue = PvP consensuel, zéro murder point.

### Q: Tuer un murderer me pénalise-t-il ?
**R:** Non, c'est même encouragé (chasse aux murderers).

### Q: Qu'est-ce qui ne peut JAMAIS tomber à la mort ?
**R:** Les items de quête/event, les items Item Mall (cash), et l'arme/bouclier/munitions équipés (slots protégés dans le code de drop — seules les autres pièces d'équipement et l'inventaire sont exposés, en statut PK penalty).

### Q: Quel build pour débuter en PvP ?
**R:** Rogue (stealth burst) ou Warlock (débuffs) pour l'impact rapide ; Blader STR pour le gameplay melee technique.

---

## 🔗 Resources

### Documentation technique
- [florian0 — Silkroad Online Death Penalty Item Drops (reverse engineering du code de drop)](https://florian0.wordpress.com/2016/10/05/silkroad-online-death-penalty-item-drops)
- [SilkroadDoc (DummkopfOfHachtenduden/DaxterSoul)](https://github.com/DummkopfOfHachtenduden/SilkroadDoc)

### Wikis
- [Silkroad Wiki (fandom) — Murderer](https://silkroad.fandom.com/wiki/Murderer)
- [Silkroad Wiki (fandom) — PvP Cape](https://silkroad.fandom.com/wiki/PvP_Cape)
- [Silkroad Wiki (fandom) — Capture the Flag](https://silkroad.fandom.com/wiki/Capture_the_Flag)
- [StrategyWiki — Silkroad Online/Gameplay](https://strategywiki.org/wiki/Silkroad_Online/Gameplay)

### Guides communauté
- [Silkroad Forums — How To PK](http://www.silkroadforums.com/viewtopic.php?f=5&t=1125)
- [Silkroad Forums — PvP cape/army tutorial](http://www.silkroadforums.com/viewtopic.php?f=5&t=4759)
- [Silkroad Forums — Equipped item drops](http://www.silkroadforums.com/viewtopic.php?f=29&t=13245)
- [Elitepvpers — Silkroad Online Comprehensive Guide (capes)](https://www.elitepvpers.com/forum/sro-guides-templates/169313-silkroad-online-comprehensive-guide.html)
- [PlayOrigin — CTF Event Guide](https://forum.playorigin.com/showthread.php?47-Capture-The-Flag-(C-T-F-)-Origin-Guide)
- [Silkroad Forever (officiel) — Guide CTF](https://www.silkroadforever.com/en-us/m/guideShow.html?f=Fortress&t=1)

### Sources officielles & multilingues (2026-10)
- [DiGeam — Système PK officiel TW](https://sro.digeam.com/post_1113-1) 🇨🇳 (chinois traditionnel)
- [iccgame — purge du classement des joueurs rouges (CN officiel)](https://silkroad.iccgame.com/content-669-66645.html) 🇨🇳
- [Inven — présentation open beta KR 2004 (jobs, wanted 현상범)](https://www.inven.co.kr/webzine/news/?news=2285) 🇰🇷
- [SroMax — guide Thief (Arrange Point / Wanted)](https://www.sromax.com/konular/silkroad-online-thief-olmak-hirsiz-jobu-rehberi.294) 🇹🇷
- [silkroadonline.de — SP-Farming (mort murderer −6% XP)](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/1454-guide-sp-farming-was-wie-wann) 🇩🇪
- Rapports [ML_RESEARCH/](ML_RESEARCH/) — RESEARCH_FR / DE / TR / ZH / KO / PT (2026-10)

---

## 🌍 Findings Recherche Multilingue (2026-10)

| Sujet | Trouvaille | Source (langue) | Confiance |
|---|---|---|---|
| **Seuils murderer** | Divergence 300/500/1000 vs 500/1000/2000 **résolue** : le wiki FR n'existe pas (source fantôme, API 404) → seuils EN retenus sans réserve | [ML_RESEARCH/RESEARCH_FR.md](ML_RESEARCH/RESEARCH_FR.md) 🇫🇷 | 5/5 |
| **Règles PK officielles** | Lv 20+ requis, états blanc/violet/rouge (一般人/加害者/杀人者), 2% dégâts/4 s en ville pour les rouges, drop d'équipement + perte SP à la mort, scroll de résurrection ÷2 | sro.digeam.com/post_1113-1 (officiel TW) 🇨🇳 | 5/5 |
| **Décrément** | Tuer des monstres réduit les points de crime (恶人值) ; état rouge disparaît à zéro | sro.digeam.com/post_1113-1 (officiel TW) 🇨🇳 | 5/5 |
| **Perte d'EXP murderer** | −6% d'EXP à la mort en murderer (témoignage 2006) | silkroadonline.de (guide Radon) 🇩🇪 | 3/5 |
| **Wanted thief** | > 2 000 penalty points (KR 2004, job change bloqué) / ≥ 3 000 Arrange Points (TR, attaquable sans costume) | Inven 🇰🇷 + SroMax 🇹🇷 | 4/5 |
| **Drops en guild war** | 2 témoignages de perte d'items **équipés** en guild war (cleric rod +8, shield +7), contesté par le guideur — consensus du thread : drop possible en GW, PAS en job ni FW → « rapporté, contesté » | silkroadonline.de (guide SeToY 2009) 🇩🇪 | 2/5 |
| **Classement des rouges** | Un classement des joueurs rouges a existé sur le service CN, purgé après exploitation | silkroad.iccgame.com (officiel CN) 🇨🇳 | 4/5 |

Rapports complets : [ML_RESEARCH/](ML_RESEARCH/) (RESEARCH_FR / DE / TR / ZH / KO / PT, 2026-10). La recherche PT n'a pas produit de donnée PK/PvP exploitable pour ce fichier.

---

## 📚 Voir aussi

### Systèmes de Combat
- [Hub Combat](HUB_COMBAT.md) - Centralise combat et PvP
- [Système de Combat](04_COMBAT_SYSTEM.md) - Formules, status effects, KD/stab
- [Fortress War](19_FORTRESS_WAR.md) - PvP massif guilde
- [Mécaniques Avancées](28_ADVANCED_MECHANICS.md) - Formules détaillées

### Classes et Builds
- [Hub Classes](HUB_CLASSES.md) - Centralise informations classes
- [Classes Chinoises](02_CHINESE_CLASSES.md) - Builds PvP CH
- [Classes Européennes](03_EUROPEAN_CLASSES.md) - Stratégies PvP EU
- [Builds PvP](33_PVP_BUILDS.md) - Optimisation PvP avancée

### Systèmes Connexes
- [Job System](09_JOB_SYSTEM_OVERVIEW.md) - Job wars (Thief vs Hunter)
- [Parties](18_PARTY_SYSTEM.md) - PvP en groupe
- [Système de Guilde](17_GUILD_SYSTEM.md) - Guild wars

### Équipement pour PvP
- [Seal Equipment](06_SEAL_EQUIPMENT.md) - Gear endgame PvP
- [Item Degrees](07_ITEM_DEGREES.md) - Progression gear
- [Armor Types](08_ARMOR_TYPES.md) - Choix armures PvP
- [Alchemy System](05_ALCHEMY_SYSTEM.md) - Blues PvP (absorb, crit, block)

### Guides Associés
- [Arènes et Tournois](27_EVENTS.md) - Events PvP
- [Stratégies Jobs](35_JOB_STRATEGIES.md) - PvP job-based
- [Builds PvE](34_PVE_BUILDS.md) - Comparison PvP vs PvE

---

*Dernière mise à jour : 2026-10-01*
*Sources : florian0 (RE serveur), silkroad.fandom.com, strategywiki.org, silkroadforums.com, elitepvpers.com, playorigin.com, silkroadforever.com, sro.digeam.com (ZH officiel), silkroad.iccgame.com (ZH officiel), silkroadonline.de (DE), inven.co.kr (KO), sromax.com (TR) — rapports ML_RESEARCH (2026-10)*
