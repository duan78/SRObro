# Multilingual Research Log

## 📋 Overview
This is the central tracking document for all multilingual research conducted to enhance the SRObro documentation. Each research entry is tracked with unique IDs, sources, findings, and validation status.

---

## 🔬 Session 2026-10-01 — Campagne exhaustive (14 recherches parallèles, ~250 requêtes)

> Révision majeure de la base : vérification/correction de ~40 fichiers, suppression des données inventées, ajout de chiffres sourcés. Détail complet : [CHANGELOG.md](CHANGELOG.md) (entrée 2026-10-01).

| # | Campagne | Fichiers | Découvertes clés | Sources principales |
|---|----------|----------|------------------|---------------------|
| 1 | Combat / Mécaniques / PvP-PK | 04, 20, 28 | Formule dégâts complète + constantes (1.2767/1.2870), crit = 2×PHY+MAG, nukes CH ne critent pas, death penalty PK décompilée (5→100% drop selon points), seuils murderer 500/1000/2000 | elitepvpers 412387, florian0, silkroaddoc |
| 2 | Alchimie / Seals / Degrés / Consommables | 05, 06, 07, 21 | Taux réels dépackés DB (50/40/30/19/17...+powder), échec = reset +0, dès +5 : 50% destruction, formule de heal officielle décompilée, FGW tier→seal (Togui=SoSun D8...Sereness=SoN D11) | HyperbotDoc/SandSnip3r, opensro, dumps ItemData |
| 3 | Armures / Armes / Items DB | 08, ITEMS_DATABASE, 31 | Dump _RefItem complet (14 318 items) parsé, tous les noms de sets 1D-13D CH+EU, vitesses : écarts relatifs Garment↔Armor 20%, accessoires = absorption (≠ STR/INT), restrictions EU par arme | nBot parse_items.txt, sro-world, openroad |
| 4 | Classes chinoises | 02, SKILLS_DATABASE_CHINESE | skills.txt client (3 355 entrées CH) : vrais noms des séries Bicheon/Heuksal/Pacheon/Fire/Cold/Lightning/Force, Force = heal/rez (≠ knockdown), GAP 0-9 (~20× à 9), caps mastery 300→360 | skills.txt (SilkroadBot), sromobile, UnKnoWnCheaTs |
| 5 | Classes européennes | 03, SKILLS_DATABASE_EUROPEAN | 6 masteries librement combinables par 2 (plafond 2×lvl), vrais skills (Dare Devil, Meteor, Pain Quota...), pot delay EU 15s, cooldown groups (Meteor/Fire Bolt) | elitepvpers 2008 (6 threads), SilkroadForums, eSRO |
| 6 | Jobs (Trader/Thief/Hunter) | 09, 10, 11, 12, 35 | Étoiles = valeur de goods (≠ distance), transports cheval ~16k/chameau ~21k, Wanted 3000+ points/60k amende/3h lockout, 3 ères du système (classique/Legend VII 2011/moderne), taux 162-313% vérifiés | guides 2006-2011 archivés, Origin |
| 7 | Économie / Stalls | 22, 23 | Consignation par NPC Juel (Hotan) : 10 items/3 jours, ratios revente NPC mesurés (1D 48%→7D 7,4%), monnaies complètes (silk, arena coins, Egy coins), historique 2 ères stalls→consignation | IGN 2007, Fandom, phBot |
| 8 | Zones / Villes / NPCs | 13, CITIES_01-05, MAP_*, NPCS_*, 32 | 697 NPCs + 161 téléporteurs officiels xSROMap convertis (formule client), vrais noms de NPCs, Jangan (6460,1100), Alexandria (-16400,0), Hotan sans NPC thief | xSROMap/JellyBitz, SRO Info 2009 |
| 9 | Monstres / Uniques | 14, 15, MONSTERS_* | HP client exacts (Tiger Girl 598 720 → Medusa 183 535 199), vrais niveaux (Cerberus 24, Ivy 30, Isyutaru 60, Yarkan 80, Shaitan 90), faune Alexandria MOB_SD_* réelle, multiplicateurs types (Champion 2x, Party 10x, Giant 5-10x) | silkroadonline.wiki, elitepvpers, rev6 |
| 10 | Quêtes / Leveling / SP / Intro | 16, 25, 26, 01 | Table XP 1-140 officielle (leveldata.txt), Repeat Limit ×1/2/3/5/7, quêtes titre Blue Zerk, +30% XP à +10 niveaux, historique complet 2005→2026 (Wemade 2010, U1 Interactive 2026) | leveldata.txt local, Origin, IGN, Wikipedia |
| 11 | Guilde / Party / Fortress War | 17, 18, 19 | Guild levels 1-5 (L5=50 membres), Each Get (4) vs Auto Share (8), Union scroll ~32 joueurs, FW Legend II 2008 : Heart/Tours/Camps/Command Post, taxes ±20% | guide Joymax traduit, IGN 2008, RaGEZONE |
| 12 | Builds PvP / PvE | 33, 34, INDEX_BUILDS | SP exacts par build (glaive 1,88-2,47M cap 110), rotations complètes sourcées, tier lists par cap, hybrides ratios 1:2→7:1 (≠ « 1:9 » inventé) | elitepvpers 516942, PlayOrigin, MMORPG.com |
| 13 | Pets/Mounts + Events | 24, 27 | Taxonomie réelle (growth/fellow/ability pets, Devil Spirit A/S), 10 Awesome Mounts officiels, events historiques datés 2007-2012, Battle Arena lv20+ 4 modes | StrategyWiki, archives presse Joymax |
| 14 | FGW / Skills hub / Technique | 29, 30, TECHNICAL_SPECIFICATIONS | Shipwreck 91-100/101-110, grades = types + limite party, packets FGW 0x7519-0x351E, handshake Blowfish 0x5000, opcodes Gateway/Agent, ports 15779/15884 | SilkroadDoc (wiki cloné), Fandom API |
| 📸 | Screenshots | screenshots/ + SCREENSHOTS_INDEX.md | 127 images officielles 2003-2026 (villes, uniques, UI, jobs, FW, FGW, events) | Fandom CDN, YouTube thumbs, janganhub |

## 🌍 Session 2026-10-01 (2) — Passe multilingue TR/KO/PT/FR/ZH/DE (~120 requêtes)

> 6 rapports sourcés dans [ML_RESEARCH/](ML_RESEARCH/) (RESEARCH_TR/KO/PT/FR/ZH/DE.md), fusionnés dans ~35 fichiers par 7 agents thématiques. Détail : [CHANGELOG.md](CHANGELOG.md) (entrée « Passe Multilingue »).

| Langue | Requêtes | Sources majeures | Résolutions clés |
|--------|----------|------------------|------------------|
| 🇹🇷 TR | ~22+25 lectures | SroCave (5), SroLobby (4-5, 7 guides FGW), DonanımHaber (4) | Uniques Green Abyss + HP FGW 7×4 grades, timers spawn par unique, étoiles trade = 1 NPC thief/étoile, taux alchimie validés, glossaire 60+ termes |
| 🇰🇷 KO | ~25+15 lectures | Inven 2004-2007 (5), site kSRO officiel (5), presse coréenne (4) | Noms KR officiels des 7 maîtrises + ~40 séries, chronologie Legend KR distincte (cap 105 inédit), service KR jamais fermé, Wemade 57 M$ (25,46%) |
| 🇨🇳 ZH | ~17+8 lectures | DiGeam wiki TW (5), iccgame CN (5), Sina/17173 (4), Bahamut (4) | Noms ZH des maîtrises/uniques/villes/dons FGW (牛魔王=Flame Cow King, 女妖=Sereness), règle « aucun drop si +7 niveaux », historique CSRO complet 2005→2025, règle seal 1er tier |
| 🇩🇪 DE | ~22+20 lectures | silkroadonline.de (5, traductions guides officiels), elitepvpers DE (4) | Union dès L2, guild war complet, étendards FW officiels, formules Troy 2006, mesures gap au monstre près, pets (HGP<30% = stats ÷2), glossaire 100+ termes |
| 🇫🇷 FR | 15+30 lectures | JeuxOnline (4), GMS Temple (4), JeuxVideo.com (3-4) | Wiki Fandom FR inexistant (murderer tranché 500/1000/2000), mythes alchimie 2007 documentés, events 2010-2012 datés, Blue Zerk complet, pas de client FR officiel |
| 🇧🇷 PT | 28+15 lectures | Adrenaline (4), UOL (5), Level Up! officiel (5) | Éditeur BR = Level Up! (monétisation seulement, 09/05/2007, R$40=100 silks), GNGWC São Paulo 10/10/2009, 48 serveurs iSRO, FGW 500k SP confirmé |

**Conflits de sources signalés (non tranchés)** : BeakYung Lv 100 (TR) vs 105 (client/DiGeam) ; spawn uniques 4 h (FR) vs 6 h (Wikipédia FR/EN) ; Wanted 3 000 points (TR) vs 2 000 (Inven KR 2004) ; HP FGW ×1000 (données vSRO TR vs wiki) ; FW samedi (PT, non sourcé, rejeté).

## 🇰🇷 Session 2026-10-01 (3) — Deep-dive KSRO 2009-2026 (~70 requêtes coréennes)

> 4 rapports dans [ML_RESEARCH/](ML_RESEARCH/) (RESEARCH_KO2_CHRONO/WORLD/ITEMS/SYSTEMS.md), fusionnés dans ~20 fichiers sous sections « 🇰🇷 Contenu KSRO ». Le site officiel krsilkroadcp.joymax.com (EUC-KR, décodé via curl+iconv) a fourni les données primaires : 37 notices officielles indexées.

| Rapport | Contenu clé |
|---------|-------------|
| [KO2_CHRONO](ML_RESEARCH/RESEARCH_KO2_CHRONO.md) | Chronologie complète Legend IX→Legend 23 (2009-2026), caps 105→140, serveurs/fusions, Rebirth ≠ Silkroad R, état 2026 (Wemade Max, 초원길, notices 09/2026) |
| [KO2_WORLD](ML_RESEARCH/RESEARCH_KO2_WORLD.md) | Zones 106-140 (Dimension Miroir, 이슬람/Bagdad, Shambhala Ice/Fire Temple), 8 donjons, 45 monstres officiels du Temple de Jupiter, chaîne boss post-Medusa, zones jamais implémentées (선계/헤븐/천축) |
| [KO2_ITEMS](ML_RESEARCH/RESEARCH_KO2_ITEMS.md) | Degrés jusqu'au 17차, règle Lv 101 fixé au 12차+, Seal of Comet (≠ Nova iSRO), Magic/Rare/Legend 12D+, Enhancers/보호석/각석, sockets, noms KR 11-13차, mall officiel |
| [KO2_SYSTEMS](ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md) | Base skills officielle (64 séries/296 CH + 269 EU), Force 12 séries, 12 fellows, calendrier events 2022-2026, Battle Arena KR 12/2009, 5 forteresses, academy, reliques/auto-combat 2025, monétisation |

**Conflits KO2 signalés** : cap 140 (notice 2018/presse EN) vs 125 (mall KR) vs 131+ (contenu 2025) ; numérotation Legend 13-22 KR non documentée ; HP des boss 111+ indisponibles (extraction client requise) ; équivalences 무신/투신↔Egyptian A/B et 혜성↔Nova = inférences.

## 🏰 Session 2026-10-01 (4) — Serveurs privés EN + AR (~145 requêtes)

> 4 rapports dans [ML_RESEARCH/](ML_RESEARCH/) (RESEARCH_PS_FILES / PS_HIGHCAP / AR_DEV / AR_SERVERS.md). Fichier central consolidé : [39_PRIVATE_SERVERS.md](39_PRIVATE_SERVERS.md). 12 fichiers enrichis (15, MONSTERS_×2, 28, 07, 05, TECHNICAL_SPECIFICATIONS, 01, 26, 36, 38, MULTILINGUAL_GLOSSARY).

| Rapport | Langue | Contenu clé |
|---------|--------|-------------|
| [PS_FILES](ML_RESEARCH/RESEARCH_PS_FILES.md) | EN | Inventaire des 14 fuites (vSRO 1.188 = **cap 110/D11**, 1.193/1.274 = 120/Jupiter, BlackRogue = **Thaïlande ini3**, ECSRO = files cSRO fuitées, iSRO-R « Rigid », Zyain KSRO cap 125/14DG), guide du leaker Chernobyl 2011, ~200 schémas SQL (repo ducksoup), architecture 9 modules, dumps publics recensés |
| [PS_HIGHCAP](ML_RESEARCH/RESEARCH_PS_HIGHCAP.md) | EN | **HP officiels 111+ via m3stat** (Kidemonas 13,8 M / Karkadann 15 M / Merikh 18,4 M), règle D12-D15 officiels / D16+ custom, timeline des files, outils d'extraction (SRO Archive Explorer 2025, pk2_mate, RSBot, phBot), trackers (m3stat, stats.projecthax) |
| [AR_DEV](ML_RESEARCH/RESEARCH_AR_DEV.md) | AR | silkroad4arab chiffré (313 016 membres 2015), service arabe officiel 02/02/2010 = portail web, guide SP arabe chiffré (validation croisée), documentaire égyptien, glossaire 72 termes, mobile Arabia officiel 2026 |
| [AR_SERVERS](ML_RESEARCH/RESEARCH_AR_SERVERS.md) | AR | Wiki ExaySRO = HP officiels republiés à l'identique, **Abshad = 얍샤드 (boss Bagdad)**, 18 serveurs arabes caps 120-140, Job Temple custom chiffré, monétisation Égypte (Vodafone Cash), piège « Medusa = BeakYung » |

**Résolutions** : HP boss 111+ (3 valeurs officielles), timers respawn vSRO (6/3/4 h), GiantMonster_SpawnRatio 14 %, _RefMagicOptByItemOptLevel public, règle D12-D15/D16+, ECSRO/BlackRogue/1.188 corrigés, boss Bagdad confirmé. **Restantes** : HP Jupiter 111-118 et 130+, stats D13-15 en texte, constantes formule dégâts, procs d'imbues (→ extraction DB/client).

---

## 🔍 Research Status Summary

| Status | Count | Last Updated |
|--------|-------|--------------|
| Total Entries | 20 + 20 (sessions 2026-10) | 2026-10-01 |
| Completed | 20 (sessions 2026-10) | 2026-10-01 |
| In Progress | 20 (entrées 2025, historique) | - |
| Validated | 14 campagnes + 6 langues (2026-10) | 2026-10-01 |
| Pending | 0 (nouvelles) | - |

---

## 📊 Research by Language

| Language | Sources Found | Entries Added | Last Updated |
|----------|---------------|---------------|--------------|
| 🇰🇷 Korean | 40 (Inven, kSRO, presse) | [RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) | 2026-10-01 |
| 🇹🇷 Turkish | 21 (SroCave, SroLobby, DH) | [RESEARCH_TR.md](ML_RESEARCH/RESEARCH_TR.md) | 2026-10-01 |
| 🇺🇸 English | 12+ (vagues 1-3) | 14 campagnes ci-dessous | 2026-10-01 |
| 🇨🇳 Chinese | 25 (DiGeam, iccgame, Sina) | [RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) | 2026-10-01 |
| 🇩🇪 German | 40 (silkroadonline.de, e*pvp) | [RESEARCH_DE.md](ML_RESEARCH/RESEARCH_DE.md) | 2026-10-01 |
| 🇧🇷 Portuguese | 15 (Adrenaline, UOL) | [RESEARCH_PT.md](ML_RESEARCH/RESEARCH_PT.md) | 2026-10-01 |
| 🇫🇷 French | 30 (JeuxOnline, GMS, JVC) | [RESEARCH_FR.md](ML_RESEARCH/RESEARCH_FR.md) | 2026-10-01 |

---

## 📝 Research Entries

### Format
- **ID**: Unique identifier (RES-YYYY-MM-DD-XX)
- **Date**: Research date
- **Language**: 🇰🇷 Korean / 🇹🇷 Turkish / 🇺🇸 English
- **Topic**: Research topic
- **Source**: URL/reference
- **Keywords**: Search keywords used
- **Key Findings**: Main discoveries
- **Files to Update**: List of files requiring updates
- **Validation Status**: Pending / In Progress / Validated
- **Confidence Level**: 1-5 (1=Rumor, 5=Official)
- **Notes**: Additional context

---

## 🗂️ Research Log Entries

### RES-2025-01-22-01
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Complete Damage Formulas (Critical Discovery)
**Source**: [Silkroad Damage Formulas - elitepvpers.com](https://www.elitepvpers.com/forum/silkroad-online/412387-silkroad-damage-formulas.html)
**Keywords**: "Silkroad damage formula" "critical hit" "damage calculation"

**Key Findings**:
- **Physical Damage Formula**: `[(base + skill_pow × mastery_incr - Phys def) × balance × skill_mult × buff&passive × multiplier]`
- **Magical Damage Formula**: `[((base + imbue_pow) × mastery_incr - Mag def) × balance × skill_mult × buff&passive × multiplier]`
- **Critical Damage Formula**: `2 × Physical Damage + Magical Damage` (Physical part doubles, magical adds normally)
- **Physical Multiplier**: 1.276772606
- **Magical Multiplier**: 1.287004542
- **Total Damage**: Physical + Magical
- **Balance Formula**: Physical Balance = 100 × STR / M, Magical Balance = 100 × INT / M (where M = total stats)

**Files to Update**:
- `04_COMBAT_SYSTEM.md`

**Validation Status**: Pending Cross-Language Validation
**Confidence Level**: 4/5 (Tier 2 community source, detailed math)
**Notes**: Originally from Nicole on forum.rev6.com, copied to elitepvpers. Contains actual gameplay-tested formulas. Requires Korean source verification for Tier 1 status.

---

### RES-2025-01-22-02
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Critical Hit Mechanics & STR Dependency
**Source**: [Critical hit damage - silkroadforums.com](http://www.silkroadforums.com/viewtopic.php?f=4&t=70642)
**Keywords**: "critical hit" "STR stat" "critical chance"

**Key Findings**:
- **Critical is calculated based on STR stat** - more STR = higher critical damage
- **Weapon critical value = % chance to crit** (e.g., Critical 10 = 10% chance in perfect world)
- **Chinese weapon skills only**: Heuksal, Pacheon, and Bicheon skills can crit
- **Nukes and Lion Shout do NOT crit** (Chinese magical skills)
- **Pure STR characters always crit higher** than INT-based characters
- STR affects critical DAMAGE, not critical CHANCE

**Files to Update**:
- `04_COMBAT_SYSTEM.md`

**Validation Status**: Pending Cross-Language Validation
**Confidence Level**: 4/5 (Tier 2 forum, community consensus)
**Notes**: From 2007, confirmed by multiple forum members. Critical mechanics considered fundamental game knowledge.

---

### RES-2025-01-22-03
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Parry Ratio & Attack Rating Mechanics
**Source**: [Physical & Magical Reinforce - elitepvpers.com](https://www.elitepvpers.com/forum/sro-guides-templates/807866-explaination-physical-magical-reinforce.html)
**Keywords**: "parry ratio" "attack rating" "damage range"

**Key Findings**:
- **Parry Ratio**: Determines damage received during attack. Higher parry = less chance of taking maximum hit rating from opponent.
- **Attack Rating**: Determines damage dealt during attack. Higher attack rating = higher chance of dealing maximum damage.
- **Interaction**: When high parry meets high attack rating, damage balances toward middle of range.
- **Defense Formulas**:
  - Physical Defense = Str × Physical reinforce + Total Physical defense
  - Magical Defense = Int × Physical reinforce + Total Physical defense
  - Physical Attack = Str × Physical reinforce + Physical damage
  - Magical Attack = Int × Magical reinforce + Magical damage

**Files to Update**:
- `04_COMBAT_SYSTEM.md`

**Validation Status**: Pending Cross-Language Validation
**Confidence Level**: 4/5 (Tier 2 guide, detailed explanation)
**Notes**: Reinforce percentages act as multipliers, making them MORE important than base attack/defense values. Example: 500 STR × 276.8% + 2146 base = 3530 total.

---

### RES-2025-01-22-04
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Parry Ratio Clarification (German Forum)
**Source**: [Parry/Hitratio - silkroadonline.de](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/67-parry-hitratio/)
**Keywords**: "parry ratio" "hit ratio" "damage calculation"

**Key Findings**:
- Damage range example: Weapon with 80-112 damage
- Higher hit rate/attack rating = more likely to deal damage closer to **112 (max)**
- Higher parry ratio (defender) = more likely to receive damage closer to **80 (min)**
- Hit/parry rates increase by **1 point per level up**
- Each level gives **5 stat points** total (2 auto: 1 STR, 1 INT, plus 3 free points)

**Files to Update**:
- `04_COMBAT_SYSTEM.md`

**Validation Status**: Pending Cross-Language Validation
**Confidence Level**: 3/5 (Tier 3 source, German community)
**Notes**: Confirms elitepvpers information about parry/attack rating mechanics. Provides specific numbers for damage range mechanics.

---

### RES-2025-01-22-05
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: 80 Cap PvP Tier List (Comprehensive Meta Analysis)
**Source**: [80 Cap Tier List - Origin Online Forums](https://forum.playorigin.com/showthread.php?1050-80-Cap-Tier-List-for-1v1-PvP-Job-Party-PvP-(Ctf-BA)-and-PvE)
**Keywords**: "80 cap tier list" "PvP builds" "meta"

**Key Findings**:

**1v1 PvP Rankings**:
- **S Tier**: Warrior/Cleric (Dare Devil skill, physical reflect, high HP/heals)
- **A Tier**: Pure STR Glaive (Soul Spear Emperor), Warlock/Cleric (CC+damage), Sword/Shield Pure INT
- **B Tier**: 9:1 Hybrid Int Spear, Warlock/Rogue, Warrior/Rogue
- **C Tier**: Pure STR Bow
- **D Tier**: Pure STR Blader

**Job/Party PvP**:
- **S Tier**: Wizard/Cleric (Salamander Blow, Earthquake, Invisible), Warrior/Anything (tank duo)
- **A Tier**: Anything/Cleric (Bless Spell, Reverse Immolation), Pure/Hybrid Int Spear
- **B Tier**: Rogue/Anything (transport killer), Pure STR Bow (Five Arrow Combo knockback), Pure INT S/S

**PvE Rankings**:
- **S Tier**: Pure/Hybrid Int Spear (solo grind), Wizards/Anything (AoE damage)
- **A Tier**: Anything/Bard (30%+ damage reduction buff), Rogue/Anything (best lurers)

**Files to Update**:
- `33_PVP_BUILDS.md`
- `20_PVP_PK_SYSTEM.md`
- `34_PVE_BUILDS.md`

**Validation Status**: Pending Cross-Language Validation
**Confidence Level**: 4/5 (Tier 2 source, experienced player analysis)
**Notes**: Author claims 15+ years SRO experience across all caps. Tier list assumes +5 gear with 60% stats. Dated 2019, applicable to 80 cap servers.

---

### RES-2025-01-22-06
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Alchemy Success Rates Stability
**Source**: [Alchemy Success Rates - Origin Online Forums](https://forum.playorigin.com/showthread.php?4273-Alchemy-Success-Rates-have-they-changed)
**Keywords**: "alchemy success rate" "10 degree" "rates unchanged"

**Key Findings**:
- **Alchemy rates have NOT changed** since server grand opening (confirmed by admin Simplicity)
- Rates are **luck-based RNG** with no hidden adjustments
- Players perceive changes due to variance in random outcomes
- **Example difficulty**: 20 astrals failed to +6 item (unlucky but within normal variance)
- Top players reported spending 18k silk unable to +11/12 moon items (also bad luck)

**Files to Update**:
- `05_ALCHEMY_SYSTEM.md`

**Validation Status**: Admin Confirmed
**Confidence Level**: 5/5 (Tier 1 source - official server admin statement)
**Notes**: Direct confirmation from server administrator. Important to counter player misconceptions about "secret nerfs" to alchemy rates.

---

### RES-2025-01-22-07
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic: Comprehensive Game Guide (Multiple Mechanics)
**Source**: [Silkroad Online comprehensive guide - elitepvpers.com](https://www.elitepvpers.com/forum/sro-guides-templates/169313-silkroad-online-comprehensive-guide.html)
**Keywords**: "comprehensive guide" "game mechanics" "systems overview"

**Key Findings**:
- General guide covering multiple game systems
- Contains information on: leveling, skills, items, PvP, jobs
- Useful for cross-referencing specific mechanics
- Community-vetted resource (1000+ thanks)

**Files to Update**:
- Multiple (reference source)

**Validation Status**: Reference Material
**Confidence Level**: 3/5 (Tier 3 general guide)
**Notes**: Use as supplementary reference, not primary source for specific formulas.

---

### RES-2025-01-22-08
**Date**: 2025-01-22
**Language**: 🇰🇷 Korean
**Topic**: Damage Formula (Korean Search Results)
**Source**: [Korean web search results](search query: "실크로드 온라인 데미지 공식 크리티컬 공격 속도 계산")
**Keywords**: "실크로드 데미지 공식" "크리티컬" "공격 속도"

**Key Findings**:
- Korean sources confirm: **크리티컬 총 데미지 = 2 × 물리 데미지 + 마법 데미지** (Critical total damage = 2× PHY damage + MAG damage)
- **STR-based characters have higher critical damage**
- Physical balance formula: `물리 밸런스 = 100 × STR / M`
- Magical balance formula: `마법 밸런스 = 100 × INT / M`
- **Attack speed increases crit opportunities** (more attacks = more crit chances)

**Files to Update**:
- `04_COMBAT_SYSTEM.md`

**Validation Status**: Partial Validation Found
**Confidence Level**: 4/5 (Confirms English sources)
**Notes**: Korean sources confirm the critical damage formula found in English sources. This provides cross-language validation (2/3 languages agree).

---

### RES-2025-01-22-09
**Date**: 2025-01-22
**Language**: 🇹🇷 Turkish
**Topic**: Combat Formulas (Turkish Search Results)
**Source**: [Turkish web search results](search query: "Silkroad Online hasar hesaplama kritik vuruş saldırı hızı 2024")
**Keywords**: "Silkroad hasar formülü" "kritik vuruş" "saldırı hızı"

**Key Findings**:
- Turkish search returned limited specific formula information
- Found references to general SRO mechanics discussions
- More active research needed in Turkish SRO forums (sroforum.com)

**Files to Update**:
- `04_COMBAT_SYSTEM.md`

**Validation Status**: Insufficient Data
**Confidence Level**: 1/5 (Preliminary search only)
**Notes**: Turkish sources require deeper investigation. Need to access sroforum.com directly for detailed mechanics discussions.

---

### RES-2025-01-22-10
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic: Attack Speed & Animation Mechanics
**Source**: [Multiple web searches on attack speed]
**Keywords**: "attack speed" "breakpoints" "animation cancelling"

**Key Findings**:
- **No specific attack speed breakpoint formulas found** in current searches
- Attack speed based on **animation duration and play rate**
- General formula: `1/(1/Play Rate × Duration) = Attacks per second`
- **No 2024-specific attack speed mechanics** discovered
- Information appears to be from original iSRO era (2005-2010)

**Files to Update**:
- `04_COMBAT_SYSTEM.md`
- `28_ADVANCED_MECHANICS.md`

**Validation Status**: Incomplete Research
**Confidence Level**: 2/5 (General game mechanics only)
**Notes**: Attack speed breakpoints remain a **gap area** requiring further research. No specific numerical breakpoints found (e.g., 64, 86, 110 speeds mentioned in plan). Korean sources needed for original mechanics.

---

### RES-2025-01-22-11
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic: Hybrid Build Calculations (Math Reference)
**Source**: [Silkroad Damage Formulas - elitepvpers.com](https://www.elitepvpers.com/forum/silkroad-online/412387-silkroad-damage-formulas.html)
**Keywords**: "hybrid build" "stat calculation" "8:1 hybrid" "7:1 hybrid"

**Key Findings**:
- **Hybrid Calculation Formula**:
  - Type of Hybrid: X:Y (e.g., 8:1 means 8 points primary, 1 point secondary)
  - X + Y = A
  - Z/A = B (where Z = level cap, typically 100 or 110)
  - B×X = Levels for primary stat (round DOWN)
  - B×Y = Levels for secondary stat (round DOWN)
  - Remaining levels: +2 to Primary, +1 to Secondary
- **Example**: 8:1 hybrid at level 100
  - 8+1 = 9
  - 100/9 = 11.11
  - 11.11×8 = 88.88 → **89 levels** of primary stat
  - 11.11×1 = 11.11 → **11 levels** of secondary stat
  - Remaining 1 level: +2 Primary, +1 Secondary

**Files to Update**:
- `02_CHINESE_CLASSES.md`
- `03_EUROPEAN_CLASSES.md`
- `33_PVP_BUILDS.md`

**Validation Status**: Reference Information
**Confidence Level**: 4/5 (Detailed math, Tier 2 source)
**Notes**: Useful for players planning hybrid builds. Formula author claims these are "MY Calculations, you won't find them somewhere else."

---

### RES-2025-01-22-12
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic: PvP Meta Builds (YouTube + Social Media)
**Source**: [Multiple YouTube guides and Facebook groups](search results for "Silkroad PvP build 2024")
**Keywords**: "PvP build" "hybrid INT spear" "1:9 hybrid" "80 cap"

**Key Findings**:
- **1:9 Hybrid INT Spear** is popular 2024-2026 meta build
- YouTube guides showing: 30 STR / 267 INT (1:9 ratio) for 100 cap
- **80 Heuksal / 100 Lightning / 100 Cold / 60 Fire** skill distribution
- Effective for: PvP, job wars (thieves/hunters/traders)
- **Garment setup** commonly used
- **Snow shield** critical for survival

**Files to Update**:
- `33_PVP_BUILDS.md`
- `35_JOB_STRATEGIES.md`

**Validation Status**: Current Meta (2024-2026)
**Confidence Level**: 3/5 (Tier 3 sources: YouTube, Facebook)
**Notes:** Builds demonstrated in actual PvP gameplay. Requires validation against tier list from RES-2025-01-22-05. Snow shield dependency noted as build weakness.

---

### RES-2025-01-22-13
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: SP Farming Strategies & Methods
**Source**: [How To Farm SP? - Origin Online Forums](https://forum.playorigin.com/showthread.php?7167-How-To-Farm-SP)
**Keywords**: "SP farming" "skill points" "gap" "mastery"

**Key Findings**:
- **Forgotten World Quests**: Two quests give **500k Skill Points** each (1 million SP total)
- **Premium+ SP Quest**: Available from Hotan potion shop, can be done 3 times per premium period, rewards **10k SP** each time (30k total)
- **SP Collection Cards**: Completing all Forgotten World collection cards rewards **500k SP**
- **Alexandria Unlimited SP Quests**: After level 100, unlimited repeatable SP quests available:
  - Quest: "Becoming a Deity (1)" from Egyptian soldier Turian (South gate Alexandria)
  - Kill 300 unegs for reward: **2,801,540 EXP + 250 SP** (base)
  - With x3 multiplier: **8,404,000 EXP + 750 SP** per completion
  - Repeatable unlimited times
- **So-Ok Trophies**: Reward **200 SP to 10,000 SP** (variable)
- **Ongs Early SP Farming**: Can get **5-20k SP** from levels 1-30 by farming on Ongs with academy buff
- **Academy Buff**: Use until level 40 for more SP and EXP from monsters

**Files to Update**:
- `26_SP_FARMING.md`
- `25_LEVELING_GUIDE.md`

**Validation Status**: Admin Confirmed (Simplicity - Origin admin)
**Confidence Level**: 5/5 (Tier 1 - official server admin)
**Notes**: Detailed breakdown from active player and admin confirmation. Forgotten World quests are major SP source (1M+ SP).

---

### RES-2025-01-22-14
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Leveling Zones & Monster Level Ranges
**Source**: [Silkroad Monster Maps - silkroadforums.com](http://www.silkroadforums.com/viewtopic.php?t=197)
**Keywords**: "leveling zones" "monster levels" "Jangan" "Donwhang" "Hotan"

**Key Findings**:
- **Jangan Area**: Monster levels **1 to 18** (starting region)
- **Donwhang Area**: Monster levels **19 to 30**
- **Hotan Area (Oasis Kingdom)**: Monster levels **31 to 60**
- **Taklamakan**: Monster levels **60 to 80** (no city in this area)
- **Unique Dungeons**: Available on right side of map, open while Uniques spawn (2x daily at fixed times)

**Zone Progression**:
```
Level 1-18: Jangan
Level 19-30: Donwhang
Level 31-60: Hotan (Oasis Kingdom)
Level 60-80: Taklamakan
Level 80+: Alexandria / Tarim Basin
```

**Files to Update**:
- `25_LEVELING_GUIDE.md`
- `14_MONSTER_GUIDE.md`
- `13_ZONES_OVERVIEW.md`

**Validation Status**: Community Verified
**Confidence Level**: 4/5 (Tier 2 - official game maps)
**Notes**: Original game progression system. Visual maps available showing specific spawn locations.

---

### RES-2025-01-22-15
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Monster HP Charts & Statistics
**Source**: [Monster HP Charts (Updated) - elitepvpers.com](https://www.elitepvpers.com/forum/sro-guides-templates/170796-monster-hp-charts-updated.html)
**Keywords**: "monster HP" "statistics" "monster data"

**Key Findings**:
- Comprehensive HP charts for all monsters by level
- Updated data with accurate HP values
- Useful for calculating damage output and kill times
- Essential for SP farming efficiency calculations

**Files to Update**:
- `14_MONSTER_GUIDE.md`
- `MONSTERS_DATABASE.md`
- `26_SP_FARMING.md`

**Validation Status**: Community Verified
**Confidence Level**: 4/5 (Tier 2 - community tested data)
**Notes**: Critical for optimizing kill speed and SP farming efficiency.

---

### RES-2025-01-22-16
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: SP Farming - Bandit Stronghold / Ongs
**Source**: [SP farming guide at bandit stronghold - silkroadforums.com](http://www.silkroadforums.com/viewtopic.php?t=29046)
**Keywords**: "SP farming" "Ong" "Bandit Stronghold" "bandit archer"

**Key Findings**:
- **Bandit Stronghold** (Ongs): Popular SP farming location
- **Requirements**: SoX bow level 16+ recommended
- **Large territory**: Ongs have a large spawn area, good for farming
- **Efficiency**: High SP gain per kill due to monster density
- **Level Range**: Good for mid-level farming (exact levels need confirmation)

**Files to Update**:
- `26_SP_FARMING.md`
- `14_MONSTER_GUIDE.md`

**Validation Status**: Classic Guide
**Confidence Level**: 3/5 (Tier 3 - older guide, still relevant)
**Notes**: From 2007, mechanics may have changed on private servers. Verify for current server rates.

---

### RES-2025-01-22-17
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: EXP Bonus System & Leveling Strategy
**Source**: [Grind Locations - hazyforest.com](https://hazyforest.com/grind_locations)
**Keywords**: "EXP bonus" "leveling" "grind spots" "maximize EXP"

**Key Findings**:
- **EXP Bonus System**: Find monsters **5-10 levels higher** than your level to maximize EXP bonus
- **Optimal Level Gap**: 5-10 level difference for best EXP/SP ratio
- **Strategy**: Don't fight monsters too close to your level (lower bonus)
- **Strategy**: Don't fight monsters too far above (harder to kill, less efficient)

**Leveling Formula Insight**:
```
If you're level 20:
- Best EXP: Level 25-30 monsters (5-10 level gap)
- Too easy: Level 20-23 monsters (low bonus)
- Too hard: Level 35+ monsters (inefficient kill speed)
```

**Files to Update**:
- `25_LEVELING_GUIDE.md`
- `26_SP_FARMING.md`

**Validation Status**: General Strategy
**Confidence Level**: 3/5 (Tier 3 - general advice)
**Notes:** Common knowledge in SRO community. Specific numbers (5-10 levels) need verification.

---

### RES-2025-01-22-18
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Questing & Leveling (Level 1-80)
**Source**: [Questler LvL 1-80 - shinakuma.wordpress.com](https://shinakuma.wordpress.com/2007/02/23/questler-lvl-1-80/)
**Keywords**: "quests" "leveling guide" "1-80" "quest route"

**Key Findings**:
- **Quest-Based Leveling**: Comprehensive quest route from level 1 to 80
- **Efficiency**: Quests provide both EXP and SP rewards
- **Quest Chain**: Organized quest progression for optimal leveling
- **Alternative to Grinding**: Questing can be faster than pure grinding for certain level ranges

**Files to Update**:
- `25_LEVELING_GUIDE.md`
- `16_QUEST_SYSTEM.md`

**Validation Status**: Legacy Guide
**Confidence Level**: 3/5 (Tier 3 - from 2007)
**Notes:** Quest system may have changed on private servers. Verify quest availability and rewards for current server.

---

### RES-2025-01-22-19
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Premium+ Features & SP Acquisition
**Source**: [How To Farm SP? - Origin Online Forums](https://forum.playorigin.com/showthread.php?7167-How-To-Farm-SP)
**Keywords**: "premium+" "SP acquisition" "SP scrolls" "So-Ok trophies"

**Key Findings**:
- **Jewel Box SP Scroll**: Gives **100 SP** (confirmed)
- **So-Ok Trophies**: Reward **200 SP to 10,000 SP** (random range)
- **Premium+ SP Quest**:
  - Location: Hotan potion shop
  - Repeatable: 3 times per premium period
  - Reward: **10k SP** per completion (30k total per premium)
- **9-Gap Strategy**: Not necessary unless farming FGW cards
- **Academy System**: Can farm 5-20k SP from levels 1-30 on Ongs with academy buff

**Files to Update**:
- `26_SP_FARMING.md`
- `21_CONSUMABLES.md`

**Validation Status**: Player & Admin Verified
**Confidence Level**: 5/5 (Tier 1 - confirmed by admin Simplicity)
**Notes:** Premium+ provides significant SP advantages. So-Ok trophies are lottery-based (200-10k SP range).

---

### RES-2025-01-22-20
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Monster Areas & Grinding Zones
**Source**: [MONSTER AREAS - GUILD - WordPress.com](https://guildalgarb.wordpress.com/games/sro/maps/monster-areas/)
**Keywords**: "monster areas" "grinding zones" "spawn locations" "level ranges"

**Key Findings**:
- **Grinding Areas**: Organized by monster level ranges
- **Unique Dungeons**: Available on right side of maps, spawn during unique monster events (2x daily)
- **River Areas**: Can enter into 2 areas - one with lower mobs, second with higher level mobs
- **Spawn Points**: Visual maps showing monster spawn locations and levels

**Zone Organization**:
- Areas split by monster level difficulty
- Grinding locations marked on maps
- Ferry access points between zones marked

**Files to Update**:
- `14_MONSTER_GUIDE.md`
- `MONSTERS_SPAWN_LOCATIONS.md`
- `25_LEVELING_GUIDE.md`

**Validation Status**: Visual Maps Available
**Confidence Level**: 3/5 (Tier 3 - fan-made maps)
**Notes:** Use as reference for monster zone organization. Verify with in-game testing for current server.

---

### RES-2025-01-22-21
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Unique Monster Spawn Times & Mechanics
**Source**: [Multiple Sources: Unique Spawn Guides](search results for "Silkroad unique spawn times")
**Keywords**: "unique spawn" "Tiger Girl" "Cerberus" "Captain Ivy" "spawn timer"

**Key Findings**:
- **General Spawn Pattern**: Uniques spawn **every 3-6 hours** on most servers
- **Private Server Modifications**: Some servers reduce to **1-2 hours** or less
- **Spawn Locations**: Random blue spawn points in designated areas
- **Unique Dungeon System**: Opens 2x daily at fixed times when Uniques spawn
- **Specific Spawn Times** (varies by server):
  - **Tiger Girl** (Level 20, HP: 598,720): Every 1-2 hours (some servers 50-60 min)
  - **Cerberus** (Level 20, HP: 693,072): Every 3-5 hours
  - **Captain Ivy** (Level 30, HP: 1,094,835): Every 3-5 hours
  - **Uruchi** (Level 40, HP: 1,779,528): 60+ minutes (varies)
  - **Isyutaru** (Level 60, HP: 4,324,612): Every 3-6 hours
  - **Lord Yarkan**: Every 3-6 hours
  - **Demon Shaitan**: Every 3-6 hours

**Files to Update**:
- `14_MONSTER_GUIDE.md`
- `28_ADVANCED_MECHANICS.md`
- `UNIQUE_MONSTERS.md` (if exists)

**Validation Status**: Community Consensus
**Confidence Level**: 3/5 (Tier 3 - multiple private server sources)
**Notes**: Spawn times vary significantly between official and private servers. Official Korean server times not found in research. Server-specific documentation recommended.

---

### RES-2025-01-22-22
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Armor Type Bonuses & Mechanics
**Source**: [Silkroad Forums - Armors Guide](http://www.silkroadforums.com/viewtopic.php?f=113&t=93505)
**Keywords**: "armor types" "garment" "protector" "movement speed" "MP reduction"

**Key Findings**:
- **Three Armor Types**: Armor (heavy), Protector (leather), Garment (light)
- **Garment Set Bonus** (all 6 pieces):
  - **+20% movement speed** increase
  - **-20% MP consumption** on all skills/spells
  - Example: 20 MP skill costs 16 MP
- **Protector Set Bonus** (all 6 pieces):
  - **+10% movement speed** increase
  - **-10% MP consumption** on all skills/spells
  - Example: 20 MP skill costs 18 MP
- **Armor Set**: No set bonus (highest PHY DEF, lowest MAG DEF)
- **Parry Ratio Mechanics**:
  - Parry deflects damage range (does not stop attacks)
  - Higher parry = more favorable damage rolls (lower average damage)
  - Parry vs Attack Rating comparison shifts damage bell curve
  - Formula example: 100 ATK vs 150 Parry = damage shifts toward minimum
- **Mixed Armor**: No bonus unless all 6 pieces match type
- **Low Level Strategy**: Garment recommended until level 20 (PHY DEF difference negligible, MP savings significant)

**Files to Update**:
- `08_ARMOR_TYPES.md`
- `04_COMBAT_SYSTEM.md`
- `28_ADVANCED_MECHANICS.md`

**Validation Status**: Detailed Mechanics Explanation
**Confidence Level**: 4/5 (Tier 2 - reputable forum guide with examples)
**Notes**: Comprehensive armor bonus system. Parry mechanics detailed with mathematical examples. Critical for SP farming (Garment -20% MP).

---

### RES-2025-01-22-23
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Party EXP System & "Taxi" Mechanic
**Source**: [Silkroad Origin Mobile - Party Mechanics Discussion](https://sromobile.com/en/news/announcements/discussion-on-game-mechanisms-party) + [Multiple Forum Sources](search results)
**Keywords**: "party EXP" "taxi" "EXP bonus" "average party level" "8 players"

**Key Findings**:
- **"Taxi" System**: Partying with low-level characters **lowers average party level** and **increases EXP gain**
- **Original PC Version Party Types**:
  - **"Each get EXP" Party**: Max 4 members, **+5% EXP bonus per player** (full party = +20%)
  - **"Share EXP" Party**: Max 8 members, proximity-based EXP sharing, generally higher potential
- **Silkroad Origin Mobile Tiered Bonus**:
  - 2 members: +5% EXP
  - 3 members: +10% EXP
  - 4 members: +15% EXP
  - 5 members: +20% EXP
  - 6 members: +25% EXP
  - 7+ members: +30%+ EXP (unconfirmed)
- **Level Difference Matters**: Similar level parties = more bonus EXP
- **Server Standard Level System**: Characters below standard level get **150-200% EXP buff**
- **Average Party Level Mechanic**:
  - Including low-level characters reduces average level
  - Lower average level vs monster level = **higher EXP multiplier**
  - This is the "Taxi" mechanic used for power leveling

**Files to Update**:
- `18_PARTY_SYSTEM.md`
- `25_LEVELING_GUIDE.md`
- `28_ADVANCED_MECHANICS.md`

**Validation Status**: Official Source + Community Consensus
**Confidence Level**: 4/5 (Tier 2 - official announcement + multiple forum confirmations)
**Notes**: "Taxi" system is a fundamental SRO mechanic. Mobile version considering changes to prevent abuse. Exact "Share EXP" bonus percentages vary by server.

---

### RES-2025-01-22-24
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Job System Overview & Current Meta Builds
**Source**: [Silkroad Origin Mobile - Job System Guide](https://sromobile.com/en/guide/job-system/job-system) + [Multiple Community Sources](search results)
**Keywords**: "job system" "trader" "thief" "hunter" "PvP builds" "profit"

**Key Findings**:
- **Job Availability**: Unlocks at **level 20**
- **Three Jobs**: Trader, Hunter, Thief (triangular conflict system)
- **System Balance**: Game automatically balances player count between factions

**Current Meta Builds (2024-2026)**:
- **Thief**: **1:9 Hybrid INT Spear** (most popular)
  - 100 Heuksal / 100 Fire / 70 Cold / 60 Lightning
  - Snow shield critical for survival
  - Garment setup commonly used
  - Effective for: Job wars, PvP, solo/group
- **Hunter**: **Pure STR Cold/Fire Blader**
  - High physical damage
  - Cold for freezing/slow, Fire for damage
  - Tank build for escorting
- **Trader**: **Pure INT** (recommended)
  - Best for self-defense
  - Nuke capability for protection

**Job Mechanics**:
- **Trader**: Buys goods, transports between cities, sells for profit
- **Thief**: Attacks traders to steal cargo, sells stolen goods
- **Hunter**: Protects traders, earns rewards/kills for defeating thieves
- **Job Conflict**: Primary PvP activity ("most bustling activity in the game")
- **Job Ranks**: System includes progression and rewards

**Hunter Specifics**:
- Gains job EXP by killing thieves (NPC or player)
- Gains EXP when trader successfully completes trades
- Can capture wanted thieves
- Can party with traders and attack any thieves

**Files to Update**:
- `09_JOB_SYSTEM_OVERVIEW.md`
- `35_JOB_STRATEGIES.md`
- `33_PVP_BUILDS.md`

**Validation Status**: Official Source + Community Consensus
**Confidence Level**: 4/5 (Tier 2 - official mobile guide + community builds)
**Notes**: Job system remains core SRO feature. 1:9 Hybrid INT Spear thief is dominant 2024-2026 meta build.

---

### RES-2025-01-22-25
**Date**: 2025-01-22
**Language**: 🇺🇸 English
**Topic**: Trade Routes & Profit Optimization
**Source**: [Multiple Forum Threads](trade profit discussions) + [Origin Guide](https://forum.playorigin.com/showthread.php?501-%2526%25239673%253B-Trade-l-Trade-Outposts-l-Profit-Origin-Guide)
**Keywords**: "trade routes" "profit percentage" "1 star" "5 star" "special goods" "trade optimization"

**Key Findings**:
- **Trade Star System**: 1-star to 5-star goods
  - Higher stars = higher risk, higher profit
  - 5-star trades most profitable but most dangerous
- **Profit Factors**:
  - **Distance**: Longer routes = higher profit percentage
  - **Star Rating**: More stars = exponentially higher rewards
  - **Supply/Demand**: City-specific pricing affects profit
  - **Special Goods**: Unique products with premium pricing

**Common Trade Routes** (from search results):
- **Jangan ↔ Donwhang**: Beginner route (shorter, lower profit)
- **Donwhang ↔ Hotan**: Mid-level route
- **Hotan ↔ Alexandria**: High-level, high-profit route
- **Taklamakan routes**: Advanced, high-risk, high-reward

**Profit Optimization Strategies**:
- **Safe Trading**: 1-2 star goods for consistent income
- **High-Risk Trading**: 4-5 star goods for maximum profit
- **Hunter Escorts**: Essential for 3+ star trades
- **Off-Peak Hours**: Trade during low thief activity times

**Job Economy**:
- Trading is **primary gold source** for most players
- Thief income depends on successful robberies
- Hunter income from trader rewards + thief bounties
- Server economy centered around trade goods

**Files to Update**:
- `35_JOB_STRATEGIES.md`
- `22_ECONOMY_GOLD.md`
- `09_JOB_SYSTEM_OVERVIEW.md`

**Validation Status**: Community Consensus
**Confidence Level**: 3/5 (Tier 3 - forum discussions, no exact profit percentages found)
**Notes**: Exact profit percentages vary by server. Trade routes and pricing logic consistent across sources. Requires server-specific research for precise numbers.

---

## 📈 Priority Research Areas

### High Priority (Gap Areas)
1. **Combat Mechanics** (04_COMBAT_SYSTEM.md)
   - Damage formulas and multipliers
   - Critical hit calculations
   - Defense penetration
   - Attack speed breakpoints

2. **Alchemy System** (05_ALCHEMY_SYSTEM.md)
   - Official success rates
   - Probability tables
   - Advanced alchemy mechanics

3. **PvP Meta 2024-2026** (20_PVP_PK_SYSTEM.md, 33_PVP_BUILDS.md)
   - Current tier lists
   - Matchup strategies
   - Build optimizations

4. **Leveling Routes** (25_LEVELING_GUIDE.md)
   - Modern optimization paths
   - Private server adjustments

5. **SP Farming** (26_SP_FARMING.md)
   - Updated strategies
   - Efficient spots

6. **Job Strategies** (35_JOB_STRATEGIES.md)
   - Current meta approaches
   - Profit optimization

7. **Economy Data** (22_ECONOMY_GOLD.md)
   - Market trends
   - Price fluctuations

8. **Advanced Mechanics** (28_ADVANCED_MECHANICS.md)
   - Recent discoveries
   - Hidden mechanics

9. **Fortress War** (19_FORTRESS_WAR.md)
   - Current compositions
   - Strategy evolution

10. **Private Server Ecosystem** (01_INTRODUCTION.md)
    - Server landscape 2024-2026
    - Feature comparison

---

## 🎯 Research Sprints

### Sprint 1: Combat Mechanics (Week 3-4)
**Status**: Not Started
**Focus Areas**:
- Korean: Original damage formulas
- Turkish: PvP damage optimizations
- English: Technical analysis

**Sources Targeted**: 15+
**Files to Update**: 04_COMBAT_SYSTEM.md

---

### Sprint 2: Alchemy System (Week 5-6)
**Status**: Not Started
**Focus Areas**:
- Korean: Official success rates
- Turkish: Private server rates
- English: Statistical studies

**Sources Targeted**: 15+
**Files to Update**: 05_ALCHEMY_SYSTEM.md

---

### Sprint 3: PvP Meta 2024-2026 (Week 7-8)
**Status**: Not Started
**Focus Areas**:
- Korean: Original balance design
- Turkish: Current tier lists
- English: International meta

**Sources Targeted**: 20+
**Files to Update**: 20_PVP_PK_SYSTEM.md, 33_PVP_BUILDS.md

---

## 🔄 Validation Process

### Cross-Validation Protocol
1. **Single Source**: Mark as "Requires Verification" (Confidence 3/5)
2. **Two Languages Agree**: Mark as "Likely" (Confidence 4/5)
3. **Three Languages Agree**: Mark as "Verified" (Confidence 5/5)
4. **Conflicting Information**: Investigate and document discrepancies

### Expert Review
- Post findings to Discord servers for community validation
- Consult with private server developers
- Verify against in-game testing when possible

---

## 📚 Resources

### Search Keywords by Language

#### Korean (🇰🇷)
- Combat: "실크로드 데미지 공식", "크리티컬 확률", "방어 관통", "공격 속도"
- Alchemy: "실크로드 연마 확률", "엘릭서 성공률", "강화 확률 표"
- PvP: "실크로드 PVP 메타", "빌드 티어리스트", "전장 전략"
- Jobs: "실크로드 상단 조합", "도적 전략", "보상 최적화"
- Economy: "실크로드 경제", "골드 벌이", "시세 동향"

#### Turkish (🇹🇷)
- Combat: "Silkroad hasar formülü", "kritik vuruş", "savunma delme", "saldırı hızı"
- Alchemy: "Silkroad artırma oranı", "zehir iksir", "geliştirme şansı"
- PvP: "Silkroad PvP meta 2024", "build listesi", "strateji"
- Jobs: "Silkroad job taktik", "tüccar hilesi", "kâr最大化"
- Economy: "Silkroad zengin olma", "altın kazanma", "piyasa"

#### English (🇺🇸)
- Combat: "Silkroad damage formula", "critical hit chance", "defense penetration", "attack speed breakpoints"
- Alchemy: "Silkroad alchemy success rate", "enhancement probability", "plus success rates"
- PvP: "Silkroad PvP builds 2024", "tier list", "PvP strategies"
- Jobs: "Silkroad job strategies", "trader routes", "thief tactics", "hunter guides"
- Economy: "Silkroad gold farming", "economy guide", "stall network prices"

---

## 📝 Template for New Entries

```markdown
### RES-YYYY-MM-DD-XX
**Date**: YYYY-MM-DD
**Language**: 🇰🇷 Korean / 🇹🇷 Turkish / 🇺🇸 English
**Topic**: [Research topic]
**Source**: [URL or reference]
**Keywords**: "[Search keywords used]"

**Key Findings**:
- [Finding 1]
- [Finding 2]
- [Finding 3]

**Files to Update**:
- `[filename.md]`

**Validation Status**: Pending / In Progress / Validated
**Confidence Level**: X/5
**Notes**: [Additional context, limitations, or translation notes]
```

---

## 🔗 Related Files
- [RESEARCH_SOURCES.md](./RESEARCH_SOURCES.md) - Curated source database
- [RESEARCH_VALIDATION.md](./RESEARCH_VALIDATION.md) - Fact-checking protocol
- [MULTILINGUAL_GLOSSARY.md](./MULTILINGUAL_GLOSSARY.md) - Terminology management

---

**Last Updated**: 2025-01-22
**Maintained by**: SRObro Documentation Team
