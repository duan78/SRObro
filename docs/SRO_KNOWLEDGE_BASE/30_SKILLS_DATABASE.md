# Base de données Skills - Hub Central

> 📍 **Vous êtes ici :** [Accueil](README.md) → [Hub Classes](HUB_CLASSES.md) → [Skills Database](30_SKILLS_DATABASE.md)

> ⚠️ **Révision majeure (2026-10)** : ce hub a été resynchronisé avec [SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md) et [SKILLS_DATABASE_EUROPEAN.md](SKILLS_DATABASE_EUROPEAN.md), réécrits à partir des **vraies données iSRO** (fichier `skills.txt` du client, traductions elitepvpers, Silkroad Origin Mobile, PhBot). L'ancienne version du hub contenait des noms de skills **inventés** (« Flying Chain Series », « Two-Handed Warrior » comme classe…) — tout est corrigé ci-dessous.
>
> 🌏 **Enrichissement (recherche multilingue 2026-10)** : ajout des **noms originels KR/ZH** des maîtrises et séries CH (rapports [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) / [RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md)) — l'incertitude « noms KSRO introuvables » est levée : ✅ **Résolu (recherche KO/ZH 2026-10)**.
>
> 📊 **Valeurs chiffrées ✅ (extraction skilldata 2026-10)** : **6 909 skills joueurs (3 272 CH / 3 637 EU)** décodés depuis `skilldata_5000.txt` (fichiers serveur vSRO 1.188 + extension cap 120) — 47+ colonnes par niveau (dégâts %/min/max, MP/HP, SP, timers ms, portée, armes, statuts). CSV exploitables dans `ML_RESEARCH/data/` (`skills_detail_CH.csv`, `skills_detail_EU.csv`, `skills_series.csv`, `skills_masteries.csv`). Rapport : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md) · synthèse ci-dessous : [Loi de progression des dégâts](#-loi-de-progression-des-dégâts-extraction-skilldata-2026-10).

## 📋 Table des Matières
- [Introduction](#-introduction)
- [Skills Chinois (vue d'ensemble)](#-skills-chinois-vue-densemble)
- [Skills Européens (vue d'ensemble)](#-skills-européens-vue-densemble)
- [🇰🇷 Contenu KSRO (2011-2026)](#-contenu-ksro-2011-2026)
- [Arbres de Mastery](#-arbres-de-mastery)
- [Mécaniques de Skills](#-mécaniques-de-skills)
- [Recherche par Type](#-recherche-par-type)
- [Guide d'Optimisation / SP](#-guide-doptimisation--sp)
- [Implémentation Technique](#-implémentation-technique)
- [FAQ](#-faq)
- [Voir aussi](#-voir-aussi)

---

## 🎯 Introduction

Ce **hub centralise les bases de données skills** de Silkroad Online, classées par race puis par mastery. Les compétences sont identifiées par leurs **noms officiels iSRO** et, côté chinois, par leurs **codenames client** (`SKILL_CH_…`) qui servent de clé universelle (identique KSRO/iSRO/vSRO) — recommandation forte pour SRObro.

### Points Clés
- 🇨🇳 **Chinois :** 7 maîtrises (3 armes + 4 forces), organisées en **séries** de 5-8 **livres** (A→F/H)
- 🇪🇺 **Européens :** **6 maîtrises** (Warrior, Rogue, Wizard, Warlock, Bard, Cleric), grille de lignes avec **book 1 / book 2**
- 🔢 **400 skill exp = 1 SP** (constante universelle) · paliers de déverrouillage **+2 niveaux de maîtrise** par niveau de skill (CH)
- 🧬 **Identifiants** : les plages d'IDs classiques CH — Bicheon 3-39, Heuksal 41-69, Pacheon 71-89, Cold 90-106, Lightning 107-123, Fire 124-142, Force 143-159

---

## 🇨🇳 Skills Chinois (vue d'ensemble)

👉 **[SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md)** — base complète : séries, livres, maîtrises, cast, cooldowns, nombres de niveaux

### Structure d'une maîtrise
Chaque maîtrise = **séries** (lignes de progression), chaque série = **livres A→F/H** débloqués par paliers de maîtrise (5, 27, 49, 71, 96, 120…), chaque livre = 9+ niveaux d'upgrade (+2 maîtrise par niveau). Pattern des codenames : `<SERIE>_<LETTRE>_<N°hit>S?_<NIVEAU>` (ex. `SKILL_CH_SWORD_CHAIN_C_2S_04`).

### Les 7 maîtrises et leurs séries signatures

| Maîtrise | Codename | Séries principales | Passif (maîtrise 10) |
|---|---|---|---|
| ⚔️ **Bicheon** (Sword/Blade) | `SKILL_CH_SWORD_*` | Smashing Sword · Chain Sword Attack (3-5 hits) · Shield Technique · Blade Force (distance) · Hidden Blade (KD) · Killing Heaven Blade (cibles au sol) · Sword Dance (AoE) · Bicheon Force (buffs tardifs) | Shield Protection (block ratio) |
| 🗡️ **Heuksal** (Spear/Glaive) | `SKILL_CH_SPEAR_*` | Pierce · Storm/spin (tourbillon AoE permanent) · Heuksal Spear · **Soul Departs (stun — le meilleur du jeu)** · Ghost Spear (AoE 360°) · Chain Spear · Flying Dragon Spear (distance) | Cheolsam Force (HP max) |
| 🏹 **Pacheon** (Bow) | `SKILL_CH_BOW_*` | Anti Devil Bow (critique) · Arrow Combo (2-7 flèches) · Hawk Summon · Autumn Wind (perforantes) · **Soul Arrow (portée, must-have)** · Explosion Arrow (AoE) · Strong Bow (chargé) · Mind Bow (360°) | Mind Concentration (attack rating) |
| ❄️ **Cold** | `SKILL_CH_COLD_*` | Cold Force (imbue gel) · Frost Guard (DEF PHY) · Cold Wave (gel à distance) · Frost Wall · Frost Nova (AoE gel) · Snow Storm (nuke) · **Snow Shield (dégâts → MP)** | Cold Armor (DEF PHY) |
| ⚡ **Lightning** | `SKILL_CH_LIGHTNING_*` | Thunder Force (imbue shock) · Piercing Force (%ATK MAG) · Wind Walk / **Ghost Walk (téléport)** · Lion Shout (mini-nukes, groupes de CD liés) · Concentration (parry) · Thunderbolt Force (nuke) | Heaven's Force (parry ratio) |
| 🔥 **Fire** | `SKILL_CH_FIRE_*` | Fire Force (**imbue la plus forte** + Burn) · Fire Shield (anti-statuts) · Flame Body (%ATK PHY) · Fire Protection (DEF MAG) · Fire Wall · **Flame Wave (le nuke le plus puissant CH)** · Fire Combustion (MP) | Flame Devil Force (ATK PHY) |
| 💪 **Force** (« Water ») | `SKILL_CH_WATER_*` | Self Heal · Force Cure (dissipe statuts) · Heal (cible) · Rebirth Art (résurrection) · Harmony Therapy (HoT) · **Vital Spot (debuffs nommés : Decay/Weaken/Impotent/Division)** · Cure Therapy · Vital Flow | Force Increasing (MP max) |

Détails complets (tableaux livre par livre, cast/CD, puissances Origin Mobile) → [SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md)

### 🌏 Noms originels des maîtrises CH (KR/ZH)

| Maîtrise | Nom KR officiel (2004) | Nom ZH |
|---|---|---|
| Bicheon | **비천검법** (bicheon geombeop) | 飞天剑法 (fēitiān jiànfǎ) |
| Heuksal | **흑살창법** (heuksal changbeop) | 黑杀枪法 (hēishā qiāngfǎ) |
| Pacheon | **파천신궁** (pacheon singung) | 破天神弓 (pòtiān shéngōng) |
| Cold | **한빙면공** (hanbing myeongong) | 冰系 (bīngxì) |
| Lightning | **풍뢰비공** (pungroe bigong) | 雷系 (léixì) |
| Fire | **화령신공** (hwaryeong singong) | 火系 (huǒxì) |
| Force | **기혈대법** (gihyeol daebeop) | 内功心法 (nèigōng xīnfǎ) |

- ✅ **Résolu (recherche KO 2026-10)** : liste coréenne officielle de l'open beta ([Inven, 20/12/2004](https://www.inven.co.kr/webzine/news/?news=2285)) + noms ZH sémantiques d'origine ([wiki officiel TW DiGeam](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F), [archives CSRO Sina 2005-2007](http://games.sina.com.cn/o/z/slcs/)).
- Séries notables : 멸절결 = Pierce · 선풍창 = Storm/spin · 이혼창 동/진/혼 = Soul Spear Move/Truth/Soul · 폭염파 = Flame Wave · 사자후 = Lion Shout · 관통섬공 = Piercing Force · 풍뢰경공 = Wind Walk · 狮子吼 = Lion Shout (ZH) · 净化术 = Force Cure (ZH) · 暴焰波 = Flame Wave (ZH) · 发火术 = Fire DETECT (détection des invisibles, ZH). Tableaux complets → [SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md).
- ℹ️ **Localisations officielles** : coréen, chinois, japonais, anglais (INT), russe uniquement — **aucun client FR/TR/DE officiel n'a jamais existé** (vérifié [RESEARCH_FR](ML_RESEARCH/RESEARCH_FR.md) · [RESEARCH_TR](ML_RESEARCH/RESEARCH_TR.md) · [RESEARCH_DE](ML_RESEARCH/RESEARCH_DE.md)) : les communautés FR/TR/DE jouaient avec les noms anglais du client.

---

## 🇪🇺 Skills Européens (vue d'ensemble)

👉 **[SKILLS_DATABASE_EUROPEAN.md](SKILLS_DATABASE_EUROPEAN.md)** — base complète par mastery avec effets documentés et cooldowns notoires

### Structure d'une maîtrise
Grille de **lignes (R1, R2…)** débloquées par paliers de mastery ; chaque ligne possède un **book 1** (précoce) et un **book 2** amélioré (ex. `Moving March → Swing March`, `Blaze → Dark Blaze`, `Healing Cycle → Healing Orbit`). **2 masteries max** par personnage (total plafonné à 2 × niveau).

### ⚠️ Correction importante
L'ancienne version du hub listait « 8 classes européennes » dont **Two-Handed Warrior** et **Warlock/Rogue Hybrid** comme masteries séparées : **faux**. Les lignes 1H/2H/dual-axe sont des **lignes internes de la mastery Warrior**, et les « hybrides » sont juste des combinaisons de 2 masteries. Les maîtrises EU sont **6** : Warrior, Rogue, Wizard, Warlock, Bard, Cleric.

### Les 6 maîtrises et leurs skills signatures

| Maîtrise | Rôle | Skills clés (vérifiés) |
|---|---|---|
| 🛡️ **Warrior** | Tank / DPS melee / interrupteur | **Dare Devil** (plus grosse attaque), Bash, Turn Rising, Triple Swing, Sprint Assault (interrupt), Shield Trash/Crush, Taunting Target/Howling Shout (taunts), **Pain Quota** (partage dégâts, 5 min), Iron/Mana Skin, Vital Increase, Physical/Magical/Ultimate Screen |
| 🗡️ **Rogue** | Assassin burst / lurer | **Prick** (finisher dague), Mortal Wounds (bonus cibles au sol), Butterfly Blow (5 hits + Dull), Hurricane Shot (KD), **Rapid Shot** (lure), Distance Shot, Crossbow Extreme / Dagger Desperate (burst), Stealth, Scorn (taunt-interrupt) |
| 🔮 **Wizard** | Nuker AoE | **Meteor** (CD 10 s partagé avec Fire Bolt), Fire Blow → Salamander Blow (7-9 hits, animation ~9 s annulable), Blizzard (80 % frostbite), Earth Quake, Charged Squall (knockback), Root/Mesh Root, Earth Barrier/Fence (cycle 20 s/CD 60 s), **Life Control + Life Turnover** (+25 % MAG cumulés, −50 % HP), Teleport |
| 🎭 **Warlock** | Debuffer / DoT / contrôle | Séries **Raze → Ravage** (Decay/Weaken/Impotent/**Division +30 % dégâts subis**, ~80 %, 30 s), DoT Blaze/Toxin/Decayed (+ books 2 AoE), **Stun** (80 %), Slumber, Vampire Touch/Kiss (vol de vie + Disease), **Reflect** (35 % @135 %, ignore Pain Quota), Scream Mask |
| 🎵 **Bard** | Buffer / batterie de mana | **Moving March → Swing March**, Hit March, Guard Tambour (DEF PHY) / Mana Tambour (DEF MAG, non cumulables), **Mana Cycle** (MP fixe/s pendant 16 s), Mana Orbit, **Noise** (aggro −, permanent), Cure Music (cleanse party), Tuning Noise/Sound (dégâts absolus), danses (Dance of Magic…), Awesome World (danser seul, effet /2) |
| ⛪ **Cleric** | Healer / buffs défensifs | **Healing Cycle → Healing Orbit** (HoT tick 3 s, **zéro aggro**), Group Healing/Recovery, **Recovery Division** (HoT party 300 s), Bless Spell (DEF PHY+MAG), Body/Soul/Force/Mental Blessing (30 min), Holy Word/Spell (anti-curses), Resurrection, **Offering** (attaque la plus forte du jeu, consomme 95 % HP) |

Détails complets (buffs par portée, rotations, tips) → [SKILLS_DATABASE_EUROPEAN.md](SKILLS_DATABASE_EUROPEAN.md)

---

## 🇰🇷 Contenu KSRO (2011-2026)

> Le service coréen **n'a jamais fermé** (opérateur Wemade Max, ex-Joymax ; serveur unique 초원길 depuis 2012 ; cap 140 depuis 2018). Chaîne officielle des caps : 105 (2009) → 110 (2010) → 120 (2011) → 125 (2014) → 130 (2015) → **140 (2018, inchangé en 2026)** — [ML_RESEARCH/RESEARCH_KO2_CHRONO.md](ML_RESEARCH/RESEARCH_KO2_CHRONO.md). Les sections ci-dessus décrivent le jeu classique ; voici l'état documenté des skills côté KR tardif — rapport principal : [ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md](ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md).

### Les tables officielles KSRO (source primaire)

- 🇨🇳 **Skills CH** : le site officiel KSRO héberge la **base de skills complète** — **64 séries / 296 skills** avec **noms KR officiels**, séries actives de 5-7 livres jusqu'aux maîtrises **96-120**, et jusqu'à **122/124** (기담요결, Force). Répartition : Bicheon ×10 · Heuksal ×9 · Pacheon ×10 · Cold ×8 · Lightning ×7 · Fire ×8 · **Force ×12** (contre 4-5 séries classiques : l'arbre Force a explosé — soins de zone 치료술, vraie résurrection 부활심결, séries tardives 121+). Structure par maîtrise → section [🇰🇷 Contenu KSRO](SKILLS_DATABASE_CHINESE.md) de [SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md) · table intégrale → [RESEARCH_KO2_SYSTEMS.md §3](ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md) · accès : https://krsilkroadcp.joymax.com/gamedata/skill/asiaskill.asp?Mastery=1&Category=1
- 🇪🇺 **Skills EU** : le **calculateur officiel** embarque la table codename → nom KR (**269 skills**, + `skillRank` niveaux max par skill) → section [🇰🇷 Contenu KSRO](SKILLS_DATABASE_EUROPEAN.md) de [SKILLS_DATABASE_EUROPEAN.md](SKILLS_DATABASE_EUROPEAN.md) · https://krsilkroadcp.joymax.com/gamedata/skill/skillCalculator.asp
- Les notices officielles attestent des **skills étendus à 130 (2015) puis 140 (2018)** — les tables affichées du site s'arrêtent à 120 (+122/124) : les paliers 121-140 restent à extraire du client.

### Lacunes documentées & recommandation pour SRObro (rapport KO2 §16-17)

1. **Coûts SP des rangs 96-124 et valeurs chiffrées des skills tardifs** — 📊 ✅ **Partiellement résolu (extraction skilldata 2026-10)** : les fichiers serveur vSRO 1.188 + extension cap 120 couvrent les rangs jusqu'à **maîtrise 120** avec SP, MP, dégâts et timers par niveau ([ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv) / [skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv)). Restent hors périmètre : les rangs **121-124** spécifiques au service KSRO (ex. 기담요결 122/124).
2. **Mapping codename ↔ noms KR tardifs non réalisé** (les 296 skills officiels CH n'affichent pas de codenames ; les noms iSRO tardifs ne correspondent pas mot à mot) — croisement avec skilldata à faire.
3. **Cap total de mastery au-delà de 120 : non publié** (360 au cap 120 côté EN ; 330 sur l'ancien namu.wiki).
4. **Recommandation du rapport** : importer les tables officielles A8 (296 skills CH) + A9 (269 skills EU) dans une base dédiée (ex. `SKILLS_DATABASE_LATE_KR.md`) — **la source primaire la plus propre jamais trouvée pour les noms KR tardifs**. Méthode de scraping : `curl | iconv -f EUC-KR` (l'encodage EUC-KR du site officiel casse les fetchers standards).

### Systèmes 2025 associés (méta KSRO)

- **유물 — reliques** (maj du 10/06/2025) : **3 emplacements d'équipement dédiés** ; 18 reliques fabriquées (recette **auto-apprise au niveau 131+**) à partir de **파멸의 원소** (« Élément de Ruine », monstres de 파멸의 성전 / 실크로드 상자) ; renforcement alchimie avec sauts massifs à **+5/+10/+15**, **échec = relique ET matériau détruits**. Notice : https://krsilkroadcp.joymax.com/news/news_view.asp?sID=1&Page=2&Num=5043&List_Ref=1583
- **자동 전투 — combat automatique** (appliqué le 15/04/2025) : modules **auto-potion / auto-skill / auto-chasse** (fenêtre d'actions touche **A**, icône sous la minimappe touche **T**), **interdit en ville** ; encore itéré en 10/2025 (amélioration du ciblage). Notice : https://krsilkroadcp.joymax.com/news/news_view.asp?sID=1&Page=3&Num=5036&List_Ref=1577

---

## 🌳 Arbres de Mastery

### Chinois
- **Total mastery points : 300** au cap (3 × ~90-120 selon l'époque du cap) ; chaque mastery monte jusqu'au cap serveur (90/110/120).
- Les combos classiques limitent à **2-3 maîtrises effectives** (mastery ≤ niveau du perso).
- **Le GAP** (niveau perso − maîtrise la plus haute) gouverne le ratio XP/SP — voir [TECHNICAL_SPECIFICATIONS.md](TECHNICAL_SPECIFICATIONS.md#-formulas-and-calculations).

| Build type | Arme | Éléments | Style |
|---|---|---|---|
| Tank / Blader | Bicheon | Cold (+ Force) | Survie, block, KD |
| DPS PHY | Heuksal (glaive) | Fire + Lightning | Spin AoE, burst |
| Nuker INT | — (sword passive) | Lightning + Fire (nuke) | Burst magique |
| Kiter | Pacheon | Lightning + Cold | Distance, CC |
| Support | — | Force | Heals, cures, debuffs |

### Européens
- **2 masteries max** (total ≤ 2 × niveau : 220 au cap 110, 240 au cap 120).
- La seconde mastery est souvent un **sub rôle** : Cleric (survivie), Bard (mana), Warrior (tank sub)…

| Combo | Rôle | Note |
|---|---|---|
| Warrior + Cleric | Tank/Support | Le tank autarcique |
| Wizard + Bard | Nuker party | ~**760 000 SP** pour tout maxer au cap 90 (documenté) |
| Rogue + Cleric | Assassin PvP | Burst + self-heal |
| Warlock + Bard | Debuffer party | Curses + mana battery |

---

## ⚙️ Mécaniques de Skills

### Imbues (Chinois uniquement)
- **Une seule imbue active** à la fois (toggle). Le CD de réactivation croît avec le livre (6 → 21 s).
- Fire = dégâts max + **Burn** (DoT) · Cold = **Frostbite** (~40 %) + **Freeze** (~20 %) · Lightning = **Shock** (réduit le parry ratio) + splash.
- ⚙️ Mécanique documentée (forum DE, 2006) : le bonus d'imbue est **multiplié par le % de dégâts du skill** (200 % → ×2 ; combo 68 %/coup → proportionnel) et figé côté serveur **à la confirmation d'activation** — [silkroadonline.de — Schadensberechnung](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/4266-schadensberechnung), via [RESEARCH_DE](ML_RESEARCH/RESEARCH_DE.md).
- 🧪 Chiffres lv1 (officiels KR, 2005) : River Fire = 21 dégâts moyens · Thunder Tiger = 17,5 · splash Lightning = 12,25 (≈ +20 % de vitesse de farm) — [GameAbout](http://www.gameabout.com/news/articleView.html?idxno=615), via [RESEARCH_KO](ML_RESEARCH/RESEARCH_KO.md).
- 📊 ✅ (extraction skilldata 2026-10) Modèle complet sur un livre : **durée 6 s / CD 6 s** (recast permanent), dégâts `att kind 8` à **100 % + part fixe** (ex. River Fire 100 % + 17~29 → + 55~92 au lv9 ; God Fire Force lv120 : 100 % + 1 769~2 949, CD 12 s) ; probabilité de statut **32 % (lv1) → 65 % (lv9)** ; **niveau d'effet = 2 × niveau du skill − 1** (burn lv9 = niveau d'effet 17). Détail : [SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md).

### 📊 Loi de progression des dégâts (extraction skilldata 2026-10)

> ✅ **Découverte structurante** (6 909 skills joueurs, vSRO 1.188 + cap 120) : **le % de dégâts est FIXE par série** — seule la part fixe min~max monte avec le niveau (facteur ×3-4), avec le coût MP/SP. Exemples représentatifs :

| Série | % (fixe) | Part fixe lv1 → lv max | MP lv1 → max | Autres |
|---|---|---|---|---|
| Strike Smash (CH, Bicheon, 9 lv) | 143 % | +15~18 → **+47~57** | 19→60 | CD 3 s constant |
| Flame Wave - Arrow (CH, Fire, 18 lv) | 250 % | +123~205 → **+464~773** | 348→1 310 | préparation 1 000 ms + cast 500 ms, CD 4 s |
| Fire Bolt (EU, Wizard, 30 lv) | 366 % | +32~39 → **+3 438~4 202** | 37→**5 799** | SP 2→27 050, burn 28→260 |
| Meteor (EU, Wizard, 15 lv) | 439 % | +582~711 → **+3 076~3 760** | 2 189→12 444 | **2 hits**, CD 10,5 s |
| Dare Devil (EU, Warrior 2H, 11 lv) | 305 % | +702~858 → **+2 262~2 765** | 1 311→4 063 | 2 hits, CD 5 s, knockback + taunt |

**Corollaires vérifiés dans les données :**
- **La « longue incantation » des nukes CH = colonne `PreparingTime` (1 000 ms)**, distincte du cast (`CastingTime`, ex. 500 ms) et du cooldown (`ReuseDelay`).
- **Le critique (`cr`) n'existe que sur 14 séries du jeu entier** : Anti Devil Bow (+20 constant), Strong Bow C/D/E, 2 livres d'épée (Killing Heaven D/E) et 1 passif Warrior EU — **aucun nuke ni imbue** ne porte le tag (réponse définitive à « les nukes CH ne critiquent pas »).
- Cooldowns les plus fréquents : **4 s** (955 skills), puis 10 s, 5 s, 8 s, 3 s ; portées : **150** nukes distance (1 645 skills), 100 mi-portée EU, 50 AoE mêlée, 200 arcs.
- Buffs chiffrés : Pain Quota **5 min** (300 000 ms) ; Healing Orbit **1 819 → 4 722**/cycle (16 s, CD 10 s) ; Iron Skin 238→2 972 absorbés ; Frost Nova freeze **66 % → 132 %**.
- SP cumulés toutes séries au cap 120 : Bicheon **2,75 M** · Fire 1,81 M · Cold 1,88 M · Lightning 1,22 M · Warrior **4,2 M** · Wizard 2,77 M (détail par maîtrise dans les bases CH/EU).

Source : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md) (repo [joaoldematejr/server_files_sro](https://github.com/joaoldematejr/server_files_sro), noms via [skills.txt tarekwiz](https://github.com/tarekwiz/SilkroadBot), colonnes via [RawRefSkill.cs hnguyenaa](https://github.com/hnguyenaa/MySilkroad), tags via [openroad](https://github.com/ferdoran/openroad)) · CSV : [ML_RESEARCH/data/](ML_RESEARCH/data/).

### Statuts et pilules
| Statut | Source | Pilule universelle ? |
|---|---|---|
| Burn / Freeze | Imbues Fire/Cold, Flame Wave | ❌ → **Force Cure** |
| Frostbite / Shock | Imbues Cold/Lightning | ✅ (small/medium/large : ~33/50/76 unités) |
| Stun (état) | Soul Departs Spear, skills EU | ❌ incurable pendant la durée |
| Decay/Weaken/Impotent/Division | Vital Spot (Force), Raze/Ravage (Warlock) | Cure party (Cure Music, Recovery Division) |

### Cooldowns — règles structurelles
- **CH** : attaques 3-5 s · chaînes/AoE 8 s · murs 5-10 s · buffs lourds 180-300 s · postures 60 s.
- **EU** : gros burst ⇒ long CD **et/ou** longue animation (Salamander Blow ~9 s annulable ; Earth Barrier 20 s/CD 60 s → cycle à 3 Wizards ; Meteor CD 10 s **partagé** avec Fire Bolt, l'ordre de cast change le CD : Meteor→Fire Bolt = 10 s, Fire Bolt→Meteor = 3 s).
- **Délai de potion EU : 15 s** entre chaque potion (règle de compensation EU).

### Coûts et progression SP
- **400 skill exp = 1 SP** (constante).
- CH : coût SP d'un niveau = table au **(maîtrise requise + 1)** ; déverrouillage **+2 maîtrise** par niveau de skill ; ~80k-200k SP « fully farmed » cap 80 selon build.
- EU : **pas de farming SP requis** (gap optionnel) ; ~760 k SP pour Wizard+Bard cap 90 ; extrapolation ~1,2-1,5 M SP pour 2 masteries cap 110-120.
- Reskill CH : quête Skill Resuscitation (lvl 20+, **80 % du SP remboursé**).
- 👉 Guide détaillé : [26_SP_FARMING.md](26_SP_FARMING.md)

---

## 🔍 Recherche par Type

### Burst / Finishers
- **CH** : Heaven Chain / Thousand Army Chain (Bicheon), Chain Spear - Dragon, Flame Wave - Disintegrate, Strong Bow - Destruction
- **EU** : **Dare Devil** (Warrior), **Prick** (Rogue), **Meteor** (Wizard), **Offering** (Cleric — 95 % HP), Tuning Sound (Bard, dégâts absolus)

### AoE / Farm
- **CH** : Bloody Fan Storm (spin glaive), Ghost Spear (360°), Sword Dance, Explosion Arrow, Flame Wave - Wide, Frost Nova, Snow Storm
- **EU** : Earth Quake, Ground Rave, Blizzard, Charged Squall, Booming Wave, Curse Breath/Dark Breath

### Contrôle (CC)
- **Stun** : Soul Departs Spear (CH), Stun/Daze Warlock (80 %), Sudden Twist, Sprint Assault
- **KD/combo au sol** : Hidden Blade + Killing Heaven Blade (CH), Turn Rising/Triple Swing, Hurricane Shot + Mortal Wounds (Rogue)
- **Root/Immo** : Root → Mesh Root (20 % d'échec), Frostbite/Freeze
- **Sleep/Fear** : Slumber (Warlock), Lightning Shock (80 % Fear, 20 s)

### Debuffs nommés
- **CH (Force)** : Vital Spot — Muscle/Spirit/Body(Decay)/Mind(Weaken)/Zero(Impotent)/Brain(Division)
- **EU (Warlock)** : Physical/Medical/Combat/Courage Raze→Ravage (Decay/Weaken/Impotent/**Division**)

### Buffs / Soutien
- **Offensifs** : Piercing Force (%MAG), Flame Body (%PHY), Pain Quota, Warcry, Dance of Magic, Force/Mental Blessing
- **Défensifs** : Frost Guard, Fire Protection, Iron/Mana Skin, Screens (1 min), Earth Barrier (party), Bless Spell, Snow Shield (dégâts→MP)
- **Soins** : Healing Cycle/Orbit (tick 3 s, 0 aggro), Recovery Division (300 s), Group Recovery, Heal (Force), Harmony Therapy
- **Utilitaires** : Wind Walk/Ghost Walk, Teleport, Stealth/Invisible, Noise (aggro), Detect (anti-stealth)

---

## 🎯 Guide d'Optimisation / SP

1. **Priorités CH** : maxer 1-2 séries cœur (spin glaive / chaîne épée / nuke) + passifs utiles ; l'imbue d'élément dès son palier ; Soul Arrow minimum 1 niveau (bow).
2. **Priorités EU** : lignes de dégâts du main → book 1 des lignes clés du sub (heals/mana) → **books 2** (Meteor, Dare Devil, Recovery Division, Guard Tambour) → passifs en dernier.
3. **SP farming** : le GAP (0 → 9) multiplie le SP par ~9 au prix de l'XP — voir les tables vérifiées dans [TECHNICAL_SPECIFICATIONS.md](TECHNICAL_SPECIFICATIONS.md).
4. **Spots** : Jangan (débutant) → Donwhang (moyen) → Hotan (élevé) → Forgotten World / uniques (voir [29_FORGOTTEN_WORLD.md](29_FORGOTTEN_WORLD.md)).

---

## 💻 Implémentation Technique

### Clés d'identification (SRObro)

```typescript
// CH: le codename client est la clé universelle (identique KSRO/iSRO/vSRO)
interface SkillIdentity {
  codename: string;      // ex. "SKILL_CH_SWORD_CHAIN_C_2S_04" (série, livre, hit, niveau)
  seriesPrefix: string;  // ex. "SKILL_CH_SWORD_CHAIN_*"
  masteryGroup: number;  // 257 (Bicheon), 258 (Heuksal), 259 (Pacheon), 277 (Cold/Lightning/Fire), 276 (Force)
  book: 'A'|'B'|'C'|'D'|'E'|'F'|'G'|'H';
  level: number;         // niveau du skill (déverrouillage: +2 maîtrise par niveau)
  nameKo?: string;       // nom coréen officiel, ex. "멸절결" — couche display (recherche KO 2026-10)
  nameZh?: string;       // nom chinois, ex. "破轮枪系列" — couche display (recherche ZH 2026-10)
}

// EU: pas de codenames publics fiables -> clé = (mastery, ligne R, book 1|2)
interface EUSkillIdentity {
  mastery: 'warrior'|'rogue'|'wizard'|'warlock'|'bard'|'cleric';
  row: number;           // R1..R9
  book: 1 | 2;
  displayName: string;   // ex. "Meteor", "Healing Orbit"
}
```

### Schéma BDD (résumé)

```typescript
model Mastery {
  id          String   @id        // BICHEON, HEUKSAL... | WARRIOR, ROGUE...
  race        Race                // CHINESE | EUROPEAN
  maxLevel    Int                 // = cap serveur (90/110/120)
  skills      Skill[]
}

model Skill {
  id            String   @id      // codename client (CH) ou clé générée (EU)
  masteryId     String
  series        String?           // série/ligne (CH: CHAIN, EU: row)
  book          String?           // A-H (CH) | 1-2 (EU)
  level         Int               // niveau du skill
  masteryReq    Int               // maîtrise requise (paliers +2)
  castTime      Float?            // secondes (skills.txt)
  cooldown      Float?            // secondes (skills.txt)
  effectFlags   String[]          // burn/freeze/shock/stun/kd/...
  spCost        Int               // table à maîtrise+1
  nameKo        String?           // nom coréen officiel (couche display — recherche KO 2026-10)
  nameZh        String?           // nom chinois (couche display — recherche ZH 2026-10)
}
```

> 📡 ✅ **Fait (extraction skilldata 2026-10)** : les dégâts min/max et coûts MP/SP par niveau ont été extraits de `skilldata_5000.txt` (vSRO 1.188 + cap 120) vers [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv) / [skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv) — 47+ colonnes par niveau, directement importables par SRObro (méthodologie : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md)). Les « Skill Power » Origin Mobile restent des proxys relatifs.

### Format skilldata décodé (vSRO 1.188) — pour l'import SRObro

> ✅ (extraction skilldata 2026-10) Une ligne = **un niveau** d'un skill ; 118 colonnes = 69 fixes + flux de paramètres à tags **fourcc**. Noms officiels des colonnes fixes via `RawRefSkill.cs` (hnguyenaa/MySilkroad), tags via openroad + corrections mesurées sur le corpus.

| Champ (CSV) | Colonne skilldata | Signification |
|---|---|---|
| `activity` | `Basic_Activity` | **0 = passif, 1 = instant/toggle (imbues), 2 = castable** |
| `chain_next_id` | `Basic_ChainCode` | segment **suivant** d'un combo (0 = fin) ; les continuations ont MP = 0 (ex. Fire Blow A2…A7 — filtrer sur `mp_cost > 0`) |
| `prepare_ms` / `cast_ms` / `action_ms` / `cooldown_ms` / `cooltime_ms` | `Action_PreparingTime` / `CastingTime` / `ActionDuration` / `ReuseDelay` / `CoolTime` | timers en **ms** — préparation 1 000 ms sur les nukes CH, `CoolTime` (2ᵈ timer, 0 sur la plupart) non interprété |
| `att_kind` / `att_pct` / `att_min` / `att_max` | tag `att` (5 args) | kinds : **5** = physique % (armes), **8** = magique imbue, **10** = magique % (nukes, Fire Bolt), 6/9 = variantes EU |
| `range` | `Action_Range` | 150 nukes distance · 100 mi-portée EU · 50 AoE mêlée · 200 arcs · 0 = portée de l'arme |
| `req_mastery_lv` / `req_sp` | `ReqCommon_Mastery1` / `ReqLearn_SP` | maîtrise requise + **coût SP d'apprentissage** |
| `mp_cost` / `hp_cost` | `Consume_MP` / `Consume_HP` | coûts par cast (0 sur passifs et continuations de combo) |
| `weapon1/2` | `ReqCast_Weapon1/2` | codes armes (255 = libre) : 2 sword, 3 blade, 4 spear, 5 glaive, 6 bow, 12 crossbow, 13 dagger, 14 harp, 11/10 staff, 8 = 2H EU |
| `mc_hits`, `dura_ms`, `cr`, `heal`, `defp`, `status` | tags `mc`, `dura`, `cr`, `heal`, `defp`, … | hits d'un combo, durée d'effet ms, crit, soin, défense, statuts |

**Tags d'effets de statut décodés** (contribution originale du rapport) : `kb` knockback · `ko` knockdown · `bu` burn · `fb` frostbite · `fz` freeze · `es` shock/electrocution · `bl` bleed · `sl` sleep · `ds` drain de vie · `tnt2` taunt · `st` stun · `da` down attack. **Corrections openroad mesurées** : `cr` = **2** args (crit), `heal` = **4**, `defp` = **3**, `getv` = 0.

---

## ❓ FAQ

**Q: Combien de maîtrises peut-on monter ?**
R: Chinois : jusqu'à 3 efficacement (total 300 points au cap historique). Européens : **2 maximum** (total ≤ 2 × niveau). Les skills sont verrouillés par race.

**Q: Quelle est la clé de référence pour les skills CH ?**
R: Le **codename client** (`SKILL_CH_…`) : identique sur toutes les versions (KSRO/iSRO/vSRO), contrairement aux noms affichés qui varient. Les noms originels KR (비천검법, 멸절결…) et ZH (飞天剑法, 破轮枪系列…) sont désormais documentés (✅ recherche KO/ZH 2026-10) et servent de **couches d'affichage** — voir la section « Noms originels » ci-dessus.

**Q: Peut-on réinitialiser ses compétences ?**
R: Oui — quête **Skill Resuscitation** (CH, lvl 20+, rembourse **80 % du SP**) ; les nuances EU dépendent du serveur (l'ancien « NPC Skill Master à 100k gold » de ce hub n'était pas sourcé).

**Q: Pourquoi mes skills EU partagent-ils des cooldowns ?**
R: Certaines lignes EU ont des **groupes de CD partagés** (ex. Meteor ↔ Fire Bolt : l'ordre de cast détermine le CD restant). C'est un mécanisme officiel documenté, pas un bug.

**Q: Les skills « book 2 » EU remplacent-ils le book 1 ?**
R: Ce sont les rangs supérieurs de la même ligne (`Root → Mesh Root`, `Blaze → Dark Blaze`) — à apprendre à la place du book 1 une fois le palier atteint.

**Q: Où sont les chiffres exacts (dégâts/MP) ?**
R: ✅ **Extraction faite (skilldata 2026-10)** : 6 909 skills joueurs décodés (47+ colonnes par niveau) → [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv) / [skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv) ; rapport [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md). Loi clé : **% de dégâts fixe par série, seule la part fixe min~max monte avec le niveau**.

**Q: Meilleures compétences PvP ?**
R: Voir [33_PVP_BUILDS.md](33_PVP_BUILDS.md) ; les interrupts (Sprint Assault, Scorn, Soul Spear) et les debuffs nommés (Division) dominent le meta documenté.

---

## 🔗 Voir aussi

### Bases de Données
- [Skills Chinois — SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md) · [Skills Européens — SKILLS_DATABASE_EUROPEAN.md](SKILLS_DATABASE_EUROPEAN.md)

### Guides de Classes
- [Classes Chinoises](02_CHINESE_CLASSES.md) · [Classes Européennes](03_EUROPEAN_CLASSES.md) · [Hub Classes](HUB_CLASSES.md)

### Mécaniques & Builds
- [Système de Combat](04_COMBAT_SYSTEM.md) · [Mécaniques Avancées](28_ADVANCED_MECHANICS.md)
- [SP Farming](26_SP_FARMING.md) · [Builds PvP](33_PVP_BUILDS.md) · [Builds PvE](34_PVE_BUILDS.md) · [Index des Builds](INDEX_BUILDS.md)

### Technique
- [Technical Specifications](TECHNICAL_SPECIFICATIONS.md) — formules, protocole officiel, `_RefSkill`
- [Development Technical Guide](DEVELOPMENT_TECHNICAL_GUIDE.md) — architecture SRObro

---

**Dernière mise à jour : 2026-10-01 (enrichi des noms originels KR/ZH et de la mécanique des imbues — recherche multilingue ML_RESEARCH ; ajout de la section 🇰🇷 Contenu KSRO 2011-2026 : tables officielles 64 séries/296 skills CH + 269 skills EU, systèmes 2025 — rapports ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md et RESEARCH_KO2_CHRONO.md ; ajout des **valeurs chiffrées par niveau** (loi % fixe, imbues, critique, timers, format skilldata) — extraction skilldata 2026-10, rapport ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md, CSV ML_RESEARCH/data/)**
*Hub resynchronisé avec les bases CH/EU révisées (noms iSRO réels, codenames, structure séries/livres et book 1-2 ; correction : 6 maîtrises EU, pas 8 « classes »). Les listes de skills non sourcés de l'ancienne version ont été remplacées par les skills vérifiés des bases détaillées.*
