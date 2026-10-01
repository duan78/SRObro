# Skills Database - Chinese Masteries

> ⚠️ **Révision majeure (2026-10)** : base reconstruite à partir de données extraites du client (`skills.txt`, dépôt GitHub *tarekwiz/SilkroadBot*, données vSRO/iSRO cap 120) croisée avec les noms de séries officiels (Silkroad Origin Mobile) et les guides communautaires. Les listes précédentes contenaient des skills inventés ; tout est remplacé ci-dessous par les **vraies séries iSRO**.
>
> 🌏 **Enrichissement (recherche multilingue 2026-10)** : ajout des **noms originels coréens** (liste officielle open beta 2004, presse GameAbout 2005, guides KR) et **chinois** (wiki officiel TW DiGeam, archives CSRO Sina/17173 2005-2007) — voir la section [Noms originels des maîtrises (KR/ZH)](#-noms-originels-des-maîtrises-krzh) et les rapports [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) / [RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).
>
> 📊 **Valeurs chiffrées ✅ (extraction skilldata 2026-10)** : les **dégâts, MP, SP, cooldowns et probabilités par niveau** ont été extraits du vrai `skilldata_5000.txt` (fichiers serveur vSRO 1.188 + extension cap 120, repo *joaoldematejr/server_files_sro*) — **3 272 skills CH**, 47 colonnes par niveau, CSV : [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv). Loi clé : **% de dégâts FIXE par série, seule la part fixe min~max monte**. Section dédiée : [Valeurs chiffrées par niveau](#-valeurs-chiffrées-par-niveau-extraction-skilldata-2026-10) · rapport : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md).

## 📋 Table des Matières
- [Conventions et Sources](#-conventions-et-sources)
- [Noms originels des maîtrises (KR/ZH)](#-noms-originels-des-maîtrises-krzh)
- [Bicheon Mastery](#%EF%B8%8F-bicheon-mastery-swordblade)
- [Heuksal Mastery](#-heuksal-mastery-spearglaive)
- [Pacheon Mastery](#-pacheon-mastery-bow)
- [Cold Mastery](#%EF%B8%8F-cold-mastery-ice)
- [Lightning Mastery](#-lightning-mastery)
- [Fire Mastery](#-fire-mastery)
- [Force Mastery](#-force-mastery-water)
- [🇰🇷 Contenu KSRO (2011-2026)](#-contenu-ksro-2011-2026)
- [Valeurs chiffrées par niveau (extraction skilldata 2026-10)](#-valeurs-chiffrées-par-niveau-extraction-skilldata-2026-10)
- [Puissances de Skills (Origin Mobile)](#-puissances-de-skills-origin-mobile)
- [Statuts et Imbues](#-statuts-et-imbues)
- [Coûts SP et Progression](#-coûts-sp-et-progression)
- [Données Manquantes / Incertitudes](#-données-manquantes-incertitudes)
- [Resources](#-resources)

---

## 🔧 Conventions et Sources

| Colonne | Signification |
|---|---|
| **Série** | Nom officiel affiché (iSRO / Origin) — *italique* = nom communautaire quand le nom officiel exact n'est pas confirmé |
| **Codename** | Préfixe interne du client (`SKILL_CH_…`) — **identifiant universel** (identique KSRO/iSRO/vSRO), à utiliser par SRObro |
| **Maîtrise** | Niveau de maîtrise requis pour le **1ᵉʳ niveau du livre** (les niveaux suivants : +2 maîtrise par palier) |
| **Cast** | Temps d'incantation du lv1, en secondes (données client ; pour les chaînes multi-hits = valeur du 1ᵉʳ hit) |
| **CD** | Cooldown en secondes (données client) |
| **Niv.** | Nombre de niveaux d'upgrade du livre dans le fichier (9 standard ; >9 = livre « étendu » des versions cap 110/120) |

- 📄 Source principale : `skills.txt` (client) — `https://github.com/tarekwiz/SilkroadBot/blob/master/Silkroad Fusion/bin/Debug/Data/skills.txt`
- Chaque skill du client suit le pattern `<SERIE>_<LETTRE>_<N°hit>S?_<NIVEAU>` (ex. `SKILL_CH_SWORD_CHAIN_C_2S_04` = Billow Chain, hit 2, niveau 4).
- Skills « base » (attaque de base, pas de SP) : `SKILL_CH_SWORD_BASE_01` (ID 2), `SKILL_CH_SPEAR_BASE_01` (ID 40), `SKILL_CH_BOW_BASE_01` (ID 70).
- Plage d'IDs classiques des premiers livres : Bicheon 3-39, Heuksal 41-69, Pacheon 71-89, Cold 90-106, Lightning 107-123, Fire 124-142, Force 143-159. Les livres tardifs (cap 110/120) ont des IDs à 5 chiffres (18685+).
- 🌏 **Noms originels KR/ZH (recherche multilingue 2026-10)** : les colonnes « Nom KR » des tableaux ne sont fournies que lorsque le mapping série/livre est attesté par une source (presse KR 2004-2008, wiki officiel TW, archives CSRO) ; « — » = non documenté côté KR/ZH à ce jour. Le **codename reste la clé universelle**.

---

## 🌏 Noms originels des maîtrises (KR/ZH)

> ✅ **Résolu (recherche KO/ZH 2026-10)** — l'incertitude « noms KSRO introuvables » est levée : la liste coréenne officielle de l'open beta (Inven, 20/12/2004) donne les noms des 7 maîtrises, et les sources chinoises (wiki officiel TW DiGeam, archives CSRO Sina/17173 2005-2007) fournissent la couche sémantique chinoise d'origine.

| Maîtrise (iSRO) | Nom coréen officiel (2004) | Romanisation (sens) | Nom chinois | Pinyin |
|---|---|---|---|---|
| **Bicheon** (Sword/Blade) | **비천검법** | bicheon geombeop (« méthode de l'épée volante ») | **飞天剑法** (TR 飛天劍法) | fēitiān jiànfǎ |
| **Heuksal** (Spear/Glaive) | **흑살창법** | heuksal changbeop (« méthode de la lance noire meurtrière ») | **黑杀枪法** (TR 黑殺槍法) | hēishā qiāngfǎ |
| **Pacheon** (Bow) | **파천신궁** | pacheon singung (« arc divin qui fend le ciel ») | **破天神弓** / 破天弓法 | pòtiān shéngōng |
| **Cold** | **한빙면공** | hanbing myeongong (« art du froid glacial ») | 冰系 (« lignée de glace ») | bīngxì |
| **Lightning** | **풍뢰비공** | pungroe bigong (« art du vent et de la foudre ») | 雷系 (« lignée de foudre ») | léixì |
| **Fire** | **화령신공** | hwaryeong singong (« art sacré de l'esprit du feu ») | 火系 (« lignée de feu ») | huǒxì |
| **Force** | **기혈대법** | gihyeol daebeop (« grande loi du sang et du qi ») | 内功 / 内功心法 (TR 內功心法) | nèigōng xīnfǎ |

- Terminologie KR : les 3 maîtrises d'armes = **무공** (mugong, « arts martiaux »), les 4 forces = **기공술** (gigongsul, « arts de l'énergie ») ; les guides KR nomment les séries par **계열** (gyeyeol, « famille/série »). Les Coréens désignaient couramment les livres par leurs noms KR (ex. 동/진/혼 pour Soul Spear - Move/Truth/Soul).
- ⚠️ Reste non tranché côté KR : la famille « 지공 » (뇌천지공/한빙지공/화마지공 — passifs ? buffs MP ?) et le découpage du nuke feu (폭염파 vs 화마지공 selon les guides).
- Sources KR : [Inven — présentation open beta (20/12/2004)](https://www.inven.co.kr/webzine/news/?news=2285) (liste officielle), [GameAbout — 한빙면공 (26/01/2005)](http://www.gameabout.com/news/articleView.html?idxno=613), [GameAbout — 풍뢰비공 (27/01/2005)](http://www.gameabout.com/news/articleView.html?idxno=615), guides KR ([Tistory vivia2020](https://vivia2020.tistory.com/20), [Naver offspring_i](https://blog.naver.com/offspring_i/80043340729), [Naver dudulak](https://m.blog.naver.com/dudulak/40059395789), [café Daum silkhs](https://cafe.daum.net/silkhs/19RJ/6), snippets namu.wiki) — synthèse : [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md).
- Sources ZH : [wiki officiel TW DiGeam — 屬性氣功](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F) / [內功心法](https://srowiki.digeam.com/%E5%85%A7%E5%8A%9F%E5%BF%83%E6%B3%95), [archives CSRO Sina 2005-2007](http://games.sina.com.cn/o/z/slcs/), [17173 — 技能职业详解 (2005)](http://sro.17173.com/content/2005-10-28/n709_625435.html), [wiki Bahamut](https://wiki2.gamer.com.tw/wiki.php?n=10948:洛克山) — synthèse : [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).
- ⚠️ Les noms iSRO (Bicheon, Heuksal…) sont des translittérations des noms KR ; les noms ZH sont sémantiques. Le **codename client reste la clé universelle** (identique KSRO/iSRO/vSRO).

---

## ⚔️ Bicheon Mastery (Sword/Blade)

**Groupe :** 257 · **Base :** ID 2 `SKILL_CH_SWORD_BASE_01` · **Passif :** Shield Protection (block ratio, maîtrise 10)

### 1. Smashing Sword Series — `SKILL_CH_SWORD_SMASH_*` · KR : 필살검 계열
Coups simples lourds mono-cible. CD 3 s.

| Livre | Skill | Maîtrise | Cast | Niv. |
|---|---|---|---|---|
| A | Strike Smash | 5 | 1,0 s | 9 |
| B | Stab Smash | 27 | 1,1 s | 9 |
| C | Crosswise Smash | 49 | 0,5 s | 9 |
| D | Flying Stone Smash | 71 | 0,8 s | 12 |
| E | Twin Energy Smash | 96 | 0,2 s | 13 |
| F | Destruction Smash | 120 | 0,2 s | 1 |

> 📊 ✅ (extraction skilldata 2026-10) **Strike Smash** (livre A, 9 niveaux, maîtrise 5→21) : **143 % + 15~18 → 143 % + 47~57** ; MP 19→60 ; SP 2→62 ; cast 411 ms ; CD 3 s — le **% est fixe sur toute la série**, seule la part fixe monte. Source : [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv).

### 2. Chain Sword Attack Series — `SKILL_CH_SWORD_CHAIN_*` · KR : 연환검 계열
Chaînes multi-hits (3 à 5 hits). CD 8 s. Deux livres débloquent ensemble aux paliers 29/51/…

| Livre | Skill | Hits | Maîtrise |
|---|---|---|---|
| A | Illusion Chain | 3 | 7 |
| B | Blood Chain | 4 | 29 |
| C | Billow Chain | 5 | 29 |
| D | Ascension Chain | 4 | 51 |
| E | Heaven Chain | 5 | 51 |
| F | Lightning Chain | 5 | 73 |
| G | Thousand Army Chain | 5 | 100 |
| H | Heavenly Chain | 5 | 120 |

### 3. Shield Technique Series — `SKILL_CH_SWORD_SHIELD_*` (bouclier requis) · KR : 방패술 계열
Posture défensive : immobilise le lanceur, absorbe les dégâts. CD 60 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Castle Shield | 10 | 12 |
| B | Mountain Shield | 32 | 12 |
| C | Ironwall Shield | 54 | 12 |
| D | Giant Shield | 76 | 8 |
| E | Iron Castle Shield | 98 | 8 |
| F | Sun Guard Shield | 105 | 6 |

### 4. Blade Force Series — `SKILL_CH_SWORD_GEOMGI_*` (attaque à distance)
Vrais projectiles d'épée : sert à **lurer** (Soul Cut Blade faible, Evil Cut Blade bonne portée/dégâts). CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Soul Cut Blade | 14 | 9 |
| B | Evil Cut Blade | 36 | 9 |
| C | Devil Cut Blade | 58 | 9 |
| D | Demon Cut Blade | 80 | 9 |
| E | Ghost Cut Blade | 102 | 7 |
| F | Emperor Blade | 120 | 1 |

### 5. Hidden Blade Series — `SKILL_CH_SWORD_KNOCKDOWN_*` (knockdown) · KR : 비검 계열
Les skills de **KD** de l'épée. CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Blood Blade Force | 19 | 18 |
| B | Soul Blade Force | 41 | 18 |
| C | Demon Blade Force | 63 | 18 |
| D | Ocean Blade Force | 85 | 18 |
| E | Sky Blade Force | 112 | 5 |

### 6. Killing Heaven Blade Series — `SKILL_CH_SWORD_DOWNATTACK_*` (stabs au sol) · KR : 천살 계열
Ne s'utilise que sur une cible **à terre** : le finisher du cycle KD. CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Flower Bloom Blade | 19 | 10 |
| B | Flower Bud Blade | 45 | 9 |
| C | Dragon Sore Blade | 68 | 9 |
| D | Asura Cut Blade | 90 | 9 |
| E | Heavenly Blade | 110 | 5 |
| F | Mad Dragon Blade | 120 | 1 |

### 7. Sword Dance Series — `SKILL_CH_SWORD_SPECIAL_*` (AoE)
AoE de mêlée (l'un des 2 seuls AoE Bicheon). CD 8 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Snake Sword Dance | 31 | 18 |
| B | Petal Sword Dance | 54 | 18 |
| C | Typhoon Sword Dance | 76 | 18 |
| D | Chaotic Sword Dance | 98 | 12 |
| E | Heaven Sword Dance | 120 | 1 |

### 8. Bicheon Force Series — `SKILL_CH_SWORD_SHIELDPD_*` (ajout tardif)
Buffs lourds (CD 180 s) ajoutés avec les mises à jour de haut niveau. Cast 0,7 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Glacial Flame Bicheon Force | 20 | 6 |
| B | Storm Bicheon Force | 40 | 6 |
| C | Banshee Bicheon Force | 60 | 6 |
| D | Summit & Depth Bicheon Force | 80 | 6 |
| E | Celestial Ground Bicheon Force | 100 | 6 |
| F | Light Bearers Bicheon Force | 120 | 1 |

### 9. Passif — Shield Protection Series — `SKILL_CH_SWORD_PASSIVE_A` (maîtrise 10, 12 niveaux)
Augmente le **block ratio** (avec bouclier).

> 🌏 **Noms d'origine (Bicheon)** — KR : 필살검 (Smashing), 연환검 (Chain Sword), 방패술 (Shield Technique), 비검 (Hidden Blade), 천살 (Killing Heaven Blade) — snippets namu.wiki + café Daum (build 쌍비도방), via [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md). ZH (CSRO 2005) : 必杀剑系列 (« épée du coup certain », attaque mono-cible phare ≈ Smashing), 连环剑系列 (« épée enchaînée », combos multi-hits ≈ Chain Sword), 剑气系列 (« qi de l'épée », AoE), 盾术强化系列 (« renforcement du bouclier » ≈ Shield Technique), puis séries tardives 飞剑, 天杀决, 人剑合一 (« homme-épée unifiés »), 飞天剑 ; le combo documenté est 击倒 + 追击 (« knockdown + stab ») — [17173 (2005)](http://sro.17173.com/content/2005-10-28/n709_625435.html), via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

---

## 🗡️ Heuksal Mastery (Spear/Glaive)

**Groupe :** 258 · **Base :** ID 40 `SKILL_CH_SPEAR_BASE_01` · **Passif :** Cheolsam Force (HP max, maîtrise 10)

### 1. Série Pierce — `SKILL_CH_SPEAR_PIERCE_*` · KR : 멸절결 계열
Coups perforants simples. CD 4 s.

| Livre | Skill | Maîtrise | Niv. | Nom KR |
|---|---|---|---|---|
| A | Wolf Bite Spear | 5 | 9 | 낭아창 |
| B | Waning Moon Spear | 27 | 9 | 잔월창 |
| C | Yuhon Spear | 49 | 9 | 유혼창 |
| D | Lightning Bird Spear | 71 | 9 | — |
| E | Celestial Cloud Spear | 93 | 9 | — |
| F | Asura Spear | 116 | 3 | — |

### 2. Storm Series (spin) — `SKILL_CH_SPEAR_SPIN_*` · KR : 선풍창 계열
Transforme l'attaque de base en **tourbillon AoE** permanent — cœur du farm glaive (« Bloody Fan Storm : à maxer »). CD 60 s.

| Livre | Skill | Maîtrise | Niv. | Nom KR |
|---|---|---|---|---|
| A | Bloody Fan Storm | 7 | 12 | 혈선풍 |
| B | Bloody Wolf Storm | 29 | 12 | 혈랑풍 |
| C | Bloody Snake Storm | 51 | 12 | 혈사풍 |
| D | Bloody Demon Storm | 73 | 8 | — |
| E | Bloody Ghost Storm | 98 | 8 | — |
| F | Bloody Emperor Storm | 105 | 6 | — |

### 3. Heuksal Spear Series — `SKILL_CH_SPEAR_FRONTAREA_*` · KR : 흑살창 계열
Enchaînements frontaux (multi-cibles devant). CD 3 s.

| Livre | Skill | Maîtrise | Niv. | Nom KR |
|---|---|---|---|---|
| A | Dancing Demon Spear | 10 | 9 | 귀선창 * |
| B | Jade Breaking Spear | 32 | 9 | 파옥섬 |
| C | Spirit Crash Spear | 54 | 9 | 쇄혼창 |
| D | Windless Spear | 76 | 9 | — |
| E | Death Bringer Spear | 98 | 7 | — |
| F | Pitch Black Spear | 116 | 3 | — |

\* Position déduite de l'ordre des livres du guide KR (파옥섬 = Jade Breaking et 쇄혼창 = Spirit Crash y sont appariés explicitement).

### 4. Soul Departs Spear Series — `SKILL_CH_SPEAR_STUN_*` (stun !) · KR : 이혼창 계열
**Chance de stun** (« Soul Spear - Move : le meilleur stun du jeu, les bows le détestent »). CD 4 s. Les Coréens désignaient ces livres par leurs noms KR **동/진/혼** (Move/Truth/Soul).

| Livre | Skill | Maîtrise | Niv. | Nom KR |
|---|---|---|---|---|
| A | Soul Spear - Move | 14 | 9 | 동 |
| B | Soul Spear - Truth | 36 | 9 | 진 |
| C | Soul Spear - Soul | 58 | 9 | 혼 |
| D | Soul Spear - Emperor | 80 | 9 | — |
| E | Soul Spear - Destruction | 102 | 7 | — |
| F | Soul Spear - Emptiness | 120 | 1 | — |

> 📊 ✅ (extraction skilldata 2026-10) **Soul Spear - Move** : **250 % + 37~48 → + 90~115** (lv1→lv9) ; MP 92→222 ; SP 21→144 ; cast ~1,1 s ; la série porte le tag `st` (stun : durée/prob/niveau par niveau dans le CSV). **Ghost Spear - Prince** (ROUNDAREA_B) : knockback [35, 50]. Source : [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv).

### 5. Ghost Spear Attack Series — `SKILL_CH_SPEAR_ROUNDAREA_*` (AoE 360°) · KR : 창귀술 계열
Le grand AoE tournoyant de la lance. CD 5 s.

| Livre | Skill | Maîtrise | Niv. | Nom KR |
|---|---|---|---|---|
| A | Ghost Spear - Petal | 19 | 9 | 낙화 |
| B | Ghost Spear - Prince | 41 | 9 | 태자 |
| C | Ghost Spear - Mars | 63 | 9 | 신군 |
| D | Ghost Spear - Storm Cloud | 85 | 9 | — |
| E | Ghost Spear - Emperor | 106 | 5 | — |
| F | Ghost Spear - Sea God | 120 | 1 | — |

### 6. Chain Spear Attack Series — `SKILL_CH_SPEAR_CHAIN_*` · KR : 파륨창 계열
Chaînes multi-hits (3-5 hits). CD 8 s.

| Livre | Skill | Maîtrise | Niv. | Nom KR |
|---|---|---|---|---|
| A | Chain Spear - Tiger | 24 | 9 | 비호 |
| B | Chain Spear - Nachal | 47 | 9 | 나찰 |
| C | Chain Spear - Shura | 47 | 9 | 수라 |
| D | Chain Spear - Pluto | 69 | 9 | 명왕 |
| E | Chain Spear - Dragon | 69 | 22 | 교룡 |
| F | Chain Spear - Phoenix | 91 | 15 | — |
| G | Chain Spear - Heaven | 116 | 3 | — |

### 7. Flying Dragon Spear Series — `SKILL_CH_SPEAR_SHOOT_*` (distance) · KR : 비룡창 계열
Lancers de lance à distance. CD 8 s.

| Livre | Skill | Maîtrise | Niv. | Nom KR |
|---|---|---|---|---|
| A | Flying Dragon - Flow | 31 | 9 | 류 |
| B | Flying Dragon - Fly | 54 | 9 | 비 |
| C | Flying Dragon - Bless | 76 | 9 | — |
| D | Flying Dragon - Flash | 98 | 10 | — |
| E | Flying Dragon - Sky | 120 | 1 | — |

### 8. Passif — Cheolsam Force Series — `SKILL_CH_SPEAR_PASSIVE_A` (maîtrise 10, 12 niveaux) · KR : 철삼공
Augmente les **HP max** — considéré comme l'un des meilleurs passifs CH. Le nom KR **철삼공** (Cheolsam) est le mot-signe identique au codename client — confirmation directe côté guides KR.

> 🌏 **Noms ZH des séries Heuksal** (CSRO 2005-2007 / TW) : 离魂系列 (« âme qui quitte le corps » = Soul Departs, stun, « priorité absolue ») · 鬼枪术系列 (« art de la lance fantôme », AoE autour du lanceur = Ghost Spear) · 破轮枪系列 (« lance brise-roue », attaques liées/chain) · 血轮舞系列 (« danse de la roue de sang », série glaive) · 飞龙一枪 (« une lance du dragon volant », distance) · 黑杀强身术 (« art de fortifier le corps Heuksal », passif HP/attaque). ⚠️ La correspondance exacte Pierce↔破轮枪 / Storm↔鬼枪术 reste une inférence (confiance 4) ; notons la cohérence KR↔ZH : 鬼枪术 (« lance fantôme ») fait écho au KR 창귀술 (Ghost Spear), 血轮舞 (« danse de la roue de sang ») aux livres 혈선풍/혈랑풍/혈사풍 (Bloody Fan/Wolf/Snake Storm) et 飞龙一枪 au KR 비룡창 (Flying Dragon). Sources : [Sina — 黑杀枪法 (2007)](http://games.sina.com.cn/o/z/slcs/2007-08-09/1550265655.shtml), [17173 (2005)](http://sro.17173.com/content/2005-10-28/n709_625435.html), via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

---

## 🏹 Pacheon Mastery (Bow)

**Groupe :** 259 · **Base :** ID 70 `SKILL_CH_BOW_BASE_01` · **Passif :** Mind Concentration (attack rating, maîtrise 10)

### 1. Anti Devil Bow Series — `SKILL_CH_BOW_CRITICAL_*` (critique)
Tirs mono-cible à forte chance de **critical**. CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Anti Devil Bow - Missile | 5 | 9 |
| B | Anti Devil Bow - Wave | 27 | 9 |
| C | Anti Devil Bow - Steel | 49 | 9 |
| D | Anti Devil Bow - Strike | 71 | 9 |
| E | Anti Devil Bow - Annihilate | 90 | 9 |
| F | Anti Devil Bow - Demolition | 109 | 5 |
| G | Anti Devil Bow - Moon light | 120 | 1 |

> 📊 ✅ (extraction skilldata 2026-10) Le nom de code est vérifié : la série porte le **tag critique `cr` (+20 constant)** — **Anti Devil Bow - Missile** : 150 % + 13~18 → + 42~57 ; MP 21→68 ; SP 2→62 ; préparation 670 ms + tir 300 ms ; projectile (`flying_speed` 400) ; CD 4 s. Strong Bow C/D/E portent aussi `cr` (ex. **Strong Bow - Spirit** : 350 % + 70~95 → + 136~185, CD 8 s). Source : [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv).

### 2. Arrow Combo Attack Series — `SKILL_CH_BOW_CHAIN_*`
Volées simultanées de N flèches. CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | 2 Arrow Combo | 7 | 9 |
| B | 3 Arrow Combo | 29 | 9 |
| C | 4 Arrow Combo | 51 | 9 |
| D | 5 Arrow Combo | 73 | 9 |
| E | 6 Arrow Combo | 94 | 9 |
| F | 7 Arrow Combo | 116 | 3 |

### 3. Hawk Summon Series — `SKILL_CH_BOW_CALL_*`
Invocations de faucons. CD 1 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | White Hawk Summon | 10 | 12 |
| B | Black Hawk Summon | 32 | 12 |
| C | Blue Hawk Summon | 54 | 12 |
| D | Lightning Hawk Summon | 76 | 12 |
| E | Ice Hawk | 104 | 7 |
| F | Fire Hawk | 120 | 1 |

### 4. Autumn Wind Arrow Series — `SKILL_CH_BOW_PIERCE_*` (perforantes)
Flèches qui **traversent les cibles en ligne**. CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Autumn Wind - Flame | 14 | 9 |
| B | Autumn Wind - Snake | 36 | 9 |
| C | Autumn Wind - Blood | 58 | 9 |
| D | Autumn Wind - Red | 80 | 9 |
| E | Autumn Wind - Devil | 102 | 7 |
| F | Autumn Wind - Dragon | 120 | 1 |

### 5. Soul Arrow Series — `SKILL_CH_BOW_NORMAL_*` (portée)
Buff qui **augmente la portée** de l'arc (« must have » du bow ; au moins 1 niveau de Dragon Soul Arrow conseillé). CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Demon Soul Arrow | 19 | 5 |
| B | Bloody Soul Arrow | 41 | 5 |
| C | Dragon Soul Arrow | 63 | 5 |
| D | Phoenix Soul Arrow | 85 | 5 |
| E | Ice Hawk Soul Arrow | 112 | 3 |

### 6. Explosion Arrow Series — `SKILL_CH_BOW_AREA_*` (AoE)
Flèches explosives AoE. CD 8 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Berserker Arrow | 25 | 9 |
| B | Demon Arrow | 47 | 9 |
| C | Devil Arrow | 69 | 9 |
| D | Celestial Beast Arrow | 91 | 9 |
| E | Pitch Black Arrow | 116 | 3 |

### 7. Strong Bow Series — `SKILL_CH_BOW_POWER_*`
Tirs chargés à gros dégâts. CD 8 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Strong Bow - Spirit | 31 | 9 |
| B | Strong Bow - Vision | 54 | 9 |
| C | Strong Bow - Craft | 76 | 9 |
| D | Strong Bow - Will | 98 | 9 |
| E | Strong Bow - Destruction | 120 | 1 |

### 8. Mind Bow Series — `SKILL_CH_BOW_SPECIAL_*` (360°)
Attaque **omnidirectionnelle** touchant 3-6 cibles autour de soi — le plan B anti-mêlée. CD 8 s (6 s ajusté sur Origin).

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Mind Bow - Flower | 25 | 6 |
| B | Mind Bow - Butterfly | 50 | 6 |
| C | Mind Bow - Swift | 75 | 6 |
| D | Mind Bow - Lighting | 100 | 6 |

### 9. Passif — Mind Concentration — `SKILL_CH_BOW_PASSIVE_A` (maîtrise 10, 12 niveaux)
Augmente l'**attack rating** (précision) — utile surtout aux builds INT/hybrides.

> 🌏 **Noms ZH des séries Pacheon** (CSRO 2005 / TW) : 霹雳箭系列 (TR 霹靂箭, « flèches du tonnerre » — rafale jusqu'à 7 flèches = Arrow Combo) · 破天箭系列 (« flèche fend-ciel », +2 m de portée par palier = Soul Arrow) · 爆烈箭系列 (« flèche explosive » = Explosion Arrow) · 白鹰/黑鹰 (« faucon blanc / noir » = séries Hawk Summon) · 绝杀弓系列 (« arc de l'extermination », coup fatal + chance d'étourdissement) · 退魔弓术系列 (attaque de base : ATQ PHY 16-22 (50 %), 2 hits au lv1 — forum TW ; l'appariement exact avec Anti Devil Bow reste à confirmer) · 破天追魂 (série tardive TW). Lore officiel : l'arc suprême 绝杀弓 n'est accordé qu'aux disciples choisis par le maître. Sources : [Sina — 破天神弓 (29/04/2005)](http://games.sina.com.cn/o/z/slcs/2005-04-29/1115224411.shtml), [Bahamut](https://forum.gamer.com.tw/C.php?bsn=8441&snA=57683), via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

---

## ❄️ Cold Mastery (Ice)

**Groupe :** 277 (`SKILL_CH_COLD_*`) · **Passif :** Cold Armor (DEF PHY, maîtrise 10)

### 1. Cold Force Series (imbue) — `SKILL_CH_COLD_GIGONGTA_*` · KR : 빙기공타
Imbue glace : dégâts magiques ajoutés aux attaques + **Frostbite** (~40%) / **Freeze** (~20%).

| Livre | Skill | Maîtrise | CD | Niv. | Nom KR |
|---|---|---|---|---|---|
| A | Ice River Force | 5 | 6 s | 9 | 빙하결 |
| B | Ice Jade Force | 25 | 9 s | 9 | — |
| C | Ice Ocean Force | 45 | 12 s | 9 | — |
| D | Ice Cloud Force | 65 | 15 s | 15 | — |
| E | Ice Air Force | 98 | 18 s | 9 | — |
| F | Ice final Force | 120 | 21 s | 1 | — |

> 📊 ✅ (extraction skilldata 2026-10) **Ice River Force** (livre A) : **100 % + 14~21 → + 45~67** ; durée d'effet **6 s**, CD 6 s ; freeze **32 % → 65 %** et frostbite **32 % → 65 %** du lv1 au lv9 ; niveau d'effet = 2×niveau−1. Les « ~40 %/~20 % » communautaires = premiers niveaux. Source : [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv).

### 2. Frost Guard Series — `SKILL_CH_COLD_GANGGI_*` · KR : 빙 호신강기
Buff **défense physique** (quasi permanent). CD 2 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Weak Guard of Ice | 8 | 9 |
| B | Soft Guard of Ice | 28 | 9 |
| C | Power Guard of Ice | 48 | 9 |
| D | Might Guard of Ice | 68 | 15 |
| E | Final Guard of Ice | 102 | 10 |

### 3. Cold Wave Series — `SKILL_CH_COLD_GIGONGJANG_*` (gel à distance) · KR : 빙공파
Attaque magique qui **gèle à distance** (freeze). CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Cold wave - Arrest | 12 | 6 |
| B | Cold wave - Binding | 32 | 6 |
| C | Cold wave - Shackle | 52 | 6 |
| D | Cold Wave - Freeze | 72 | 10 |
| E | Cold Wave - Soul | 106 | 5 |

### 4. Frost Wall Series — `SKILL_CH_COLD_BINGBYEOK_*` · KR : 빙벽신공
Invoque un **mur** : absorbe les dégâts ET bloque le passage. CD 10 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Crystal Wall | 17 | 6 |
| B | Snow Wall | 37 | 6 |
| C | Extreme Wall | 57 | 6 |
| D | Iceberg Wall | 77 | 10 |
| E | Spikey Wall | 111 | 4 |

### 5. Frost Nova Series — `SKILL_CH_COLD_BINGPAN_*` (AoE gel) · KR : 한빙광야결
AoE de gel autour du lanceur (« Blizzard », attaque principale des Ice avec l'imbue). CD 6 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Frost Nova - Wind | 23 | 12 |
| B | Frost Nova - Woods | 43 | 12 |
| C | Frost Nova - Storm | 63 | 12 |
| D | Frost Nova - Ice Field | 83 | 12 |
| E | Frost Nova - destruction | 114 | 3 |

> 📊 ✅ (extraction skilldata 2026-10) **Frost Nova - Wind** (12 niveaux, maîtrise 23→56) : freeze **66 % → 132 %** et frostbite 66 % → 132 % ; MP 232→936 ; SP 80→623 ; cast ~1,1 s ; CD 6 s (l'effet imbriqué `tant` suit la courbe MP : 232→936). Source : [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv).

### 6. Snow Storm Series — `SKILL_CH_COLD_GIGONGSUL_*` (nuke) · KR : 설풍지결 (probable)
Le nuke Cold : dégâts les plus faibles des 3 éléments, mais **grosse AoE** + gel.

| Livre | Skill | Maîtrise | CD | Niv. |
|---|---|---|---|---|
| A | Snow Storm - Ice shot | 30 | 4 s | 18 |
| B | Snow Storm - Ice rain | 50 | 10 s | 18 |
| C | Snow Storm - Double Shot | 70 | 10 s | 22 |
| D | Snow Storm - Multi Shot | 90 | 10 s | 16 |
| E | Snow Storm - destruction | 118 | 10 s | 2 |

### 7. Snow Shield Series — `SKILL_CH_COLD_SHIELD_*`
Bouclier de mana : **les dégâts sont absorbés par le MP** (cd 180 s) — vital pour les nukers INT.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Snow Shield - Novice | 20 | 6 |
| B | Snow Shield - Adept | 40 | 6 |
| C | Snow Shield - Freeze | 60 | 6 |
| D | Snow Shield - Intensify | 80 | 6 |
| E | Snow Shield - Swift | 100 | 6 |
| F | Snow Shield _ Death | 120 | 1 |

### 8. Passif — Cold Armor Series — `SKILL_CH_COLD_PASSIVE_A` (maîtrise 10, 12 niveaux)
+ DEF physique permanente (~+27 DEF au max — modeste).

> 🌏 **Noms ZH (wiki officiel TW DiGeam)** : 冰气 (TR 冰氣, imbue glace, 4 niveaux) · 冰气护体 (défense corporelle ≈ Frost Guard) · 霜气弹 (projectile givrant ralentissant) · 冰壁术/冰墙 (mur de glace, DEF PHY ≈ Frost Wall) · 烈冰诀 (gel du sol à distance) · 暴雪 (blizzard AoE, 2 formes) · 摄雪支魂 · 玄冰护体 (passif DEF ≈ Cold Armor) · 冰缚 (« ligature de glace » = Freeze) · 冰峰/冰锋. Source : [DiGeam — 屬性氣功](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F), via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

---

## ⚡ Lightning Mastery

**Groupe :** 277 (`SKILL_CH_LIGHTNING_*`) · **Passif :** Heaven's Force (parry ratio, maîtrise 10)

### 1. Thunder Force Series (imbue) — `SKILL_CH_LIGHTNING_GIGONGTA_*` · KR : 뇌기공타
Imbue foudre : dégâts intermédiaires + **shock** (réduit le parry ratio de la cible) + splash.

| Livre | Skill | Maîtrise | CD | Niv. | Nom KR |
|---|---|---|---|---|---|
| A | Thunder Tiger Force | 5 | 6 s | 9 | 뇌전 백호결 (뇌호결) |
| B | Thunder Sky Force | 25 | 9 s | 9 | — |
| C | Thunder King Force | 45 | 12 s | 9 | — |
| D | Thunder Dragon Force | 65 | 15 s | 15 | — |
| E | Thunder Phoenix Force | 98 | 18 s | 9 | — |
| F | Thunder God Force | 120 | 21 s | 1 | — |

### 2. Piercing Force Series — `SKILL_CH_LIGHTNING_GWANTONG_*` · KR : 관통섬공
Buff **% attaque magique** (+5% au début, >10% aux hauts niveaux) — le buff nuker par excellence. CD 3 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Must - Piercing Force | 8 | 3 |
| B | Flow - Piercing Force | 28 | 3 |
| C | Speed - Piercing Force | 48 | 3 |
| D | Force - Piercing Force | 68 | 3 |
| E | God - Piercing Force | 102 | 3 |

### 3. Wind Walk Series — `SKILL_CH_LIGHTNING_GYEONGGONG_*` · KR : 풍뢰경공
Buffs de déplacement : Grass Walk = +vitesse (≈ +50%), **Ghost Walk = téléportation** courte. CD 2-5 s.

| Livre | Skill | Maîtrise | Niv. | Nom KR |
|---|---|---|---|---|
| A | Grass Walk - Flow | 12 | 12 | 초상비류 |
| B | Ghost Walk - phantom | 32 | 12 | 귀영신보 |
| C | Grass Walk - Speed | 52 | 12 | 초상비쾌 |
| D | Ghost Walk - Shadow | 72 | 8 | — |
| E | Ghost Walk - God | 92 | 8 | — |

### 4. Lion Shout Series — `SKILL_CH_LIGHTNING_CHUNDUNG_*` (mini-nuke) · KR : 사자후
Nukes rapides à petit cooldown — ⚠️ **linkages de CD** : Shock/Earth/Execution partagent un groupe, Heaven/Power un autre (officiel Origin). CD 4 s (3 s sur les derniers livres). Livres KR attestés (2005) : 진명 (3 cibles), 낭천 (5 cibles), 광야.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Shock Lion Shout | 17 | 9 |
| B | Heaven Lion Shout | 37 | 9 |
| C | Earth Lion Shout | 57 | 9 |
| D | Power Lion Shout | 77 | 9 |
| E | Execution Lion Shout | 98 | 9 |
| F | God Lion Shout | 120 | 1 |

### 5. Concentration Series — `SKILL_CH_LIGHTNING_JIPJUNG_*` · KR : 정신집중술
Buff **parry ratio** (longue durée). CD 4 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Concentration - 1st | 23 | 6 |
| B | Concentration - 2nd | 43 | 6 |
| C | Concentration - 3rd | 63 | 6 |
| D | Concentration - 4th | 83 | 9 |
| E | Concentration - 5th | 114 | 3 |

### 6. Thunderbolt Force Series — `SKILL_CH_LIGHTNING_STORM_*` (nuke) · KR : 뇌력공
Le nuke Lightning : dégâts intermédiaires, cast rapide. CD 6 s. (« 번개 발사 견제용 » — tir de foudre de harcèlement, GameAbout 2005 ; « 장풍 주력 » — nuke principal des builds INT, guide KR 올지검방.)

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Wolf's Thunderbolt | 30 | 9 |
| B | Tiger's Thunderbolt | 50 | 9 |
| C | Horse's Thunderbolt | 70 | 9 |
| D | Crane's Thunderbolt | 90 | 9 |
| E | God's Thunderbolt | 116 | 3 |

> 📊 ✅ (extraction skilldata 2026-10) **God's Thunderbolt** (maîtrise 116→120, 3 niveaux) : **300 % + 2 099~4 356** ; MP **13 388→14 972** ; SP 23 138→27 050 ; préparation 1 000 ms ; CD 6 s. Source : [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv).

### 7. Passif — Heaven's Force Series — `SKILL_CH_LIGHTNING_PASSIVE_A` (maîtrise 10, 12 niveaux) · KR : 뇌천지공 (probable)
+ **parry ratio** permanent. (« 공격력과 무관 » — sans lien avec l'attaque, guide KR ; mapping incertain, famille « 지공 » non départagée.)

> 🌏 **Noms ZH (wiki officiel TW DiGeam)** : 电刃 (TR 電刃, imbue foudre : réduit vitesse/esquive) · 雷息贯通 (« perforation du souffle de foudre » = buff pierce ≈ Piercing Force) · 奔雷步 (« pas du tonnerre », série 流影 ≈ Wind Walk) · 鬼影步 (« pas de l'ombre fantôme » = téléportation courte ≈ Ghost Walk) · 狮子吼 (TR 獅子吼, « rugissement du lion » = Lion Shout, interrupt) · 鸣禅 (super-agilité/esquive) · 狂雷系列 (« foudre furieuse », gros AoE) · 雷天闪 (passif esquive ≈ Heaven's Force). Source : [DiGeam — 屬性氣功](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F), via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

---

## 🔥 Fire Mastery

**Groupe :** 277 (`SKILL_CH_FIRE_*`) · **Passif :** Flame Devil Force (ATK PHY, maîtrise 10)

### 1. Fire Force Series (imbue) — `SKILL_CH_FIRE_GIGONGTA_*` · KR : 화기공타
L'imbue la plus forte : + gros dégâts magiques + **Burn** (DoT ~6 s ; probabilité 25% au lv1 du livre A, croît avec le niveau).

| Livre | Skill | Maîtrise | CD | Niv. | Nom KR |
|---|---|---|---|---|---|
| A | River Fire force | 5 | 6 s | 9 | 화류결 |
| B | Extreme Fire force | 25 | 9 s | 9 | 화극결 |
| C | Poison Fire force | 45 | 12 s | 9 | 화독결 |
| D | Soul Fire force | 65 | 15 s | 15 | 화혼결 |
| E | Cloud Fire force | 98 | 18 s | 9 | — |
| F | God Fire Force | 120 | 21 s | 1 | — |

### 2. Fire Shield Series — `SKILL_CH_FIRE_SHIELD_*` · KR : 화염 방패술
Buff **anti-statuts** : réduit durée/ampleur de Burn, Shock, Frostbite, Freeze… (~50% au max = −76 unités d'effet). Cast 2 s, CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Fire Shield - Phoenix | 8 | 6 |
| B | Fire Shield - Flower | 28 | 6 |
| C | Fire Shield - King | 48 | 6 |
| D | Fire Shield - Emperor | 68 | 6 |

### 3. Flame Body Series — `SKILL_CH_FIRE_GONGUP_*` · KR : 화염체
Buff **% attaque physique** (3 niveaux par livre). CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Flame body - Wisdom | 12 | 3 |
| B | Flame body - Power | 32 | 3 |
| C | Flame body - Extreme | 52 | 3 |
| D | Flame Body - Trial | 72 | 3 |
| E | Flame Body - God | 106 | 3 |

### 4. Fire Protection Series — `SKILL_CH_FIRE_GANGGI_*` · KR : 화 호신강기
Buff **défense magique** — la réponse aux nukers. CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Basic Fire protection | 17 | 9 |
| B | Divine Fire protection | 37 | 9 |
| C | Hard Fire protection | 57 | 9 |
| D | Earth Fire Protection | 77 | 15 |
| E | God Fire Protection | 110 | 6 |

### 5. Fire Wall Series — `SKILL_CH_FIRE_HWABYEOK_*` · KR : 염화벽공
Mur de feu : absorbe + bloque le passage (comme Frost Wall). CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Fire Wall - Tower | 23 | 6 |
| B | Fire Wall - Mountain | 43 | 6 |
| C | Fire Wall - Castle | 63 | 6 |
| D | Fire Wall - Fortress | 83 | 6 |
| E | Fire Wall - God | 103 | 6 |

### 6. Flame Wave Series — `SKILL_CH_FIRE_GIGONGSUL_*` (nuke) · KR : 폭염파 계열
**Le nuke le plus puissant du jeu CH** (« dégâts élevés, AoE réduite »).

| Livre | Skill | Maîtrise | CD | Niv. | Nom KR |
|---|---|---|---|---|---|
| A | Flame Wave - Arrow | 30 | 4 s | 18 | 화시폭염파 |
| B | Flame Wave - Burning | 43 | 6 s | 18 | — |
| C | Flame Wave - Wide | 56 | 10 s | 18 | 광폭폭염파 * |
| D | Flame Wave - Bomb | 70 | 4 s | 22 | 광폭폭염파 * |
| E | Flame Wave - HellFire | 83 | 6 s | 19 | 열화폭염파 |
| F | Flame Wave - Disintegrate | 96 | 10 s | 13 | — |
| G | Flame Wave - God | 118 | 4 s | 2 | — |

\* Les guides KR regroupent Wide et Bomb sous 광폭폭염파. Autre nomenclature KR rencontrée pour le nuke feu : **화마지공** (les guides KR mélangent les deux découpages — voir incertitudes).

> 📊 ✅ (extraction skilldata 2026-10) **Flame Wave - Arrow** (livre A, 18 niveaux, maîtrise 30→64) : **250 % + 123~205 → 250 % + 464~773** ; MP 348→1 310 ; SP 144→1 079 ; **préparation 1 000 ms + cast 500 ms** (la fameuse « longue incantation » = colonne `PreparingTime`, pas le cast) ; portée 150 ; CD 4 s. **Flame Wave - Disintegrate** : 9 541 MP au lv1 (parmi les plus chers du jeu). Source : [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv).

### 7. Fire Combustion Series — `SKILL_CH_FIRE_DESCRY_*` / `SKILL_CH_FIRE_DETECT_*`
Buffs de récupération de MP (CD 180 s), en deux lignes.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| DESCRY A | Fire Combustion - Firefly | 30 | 5 |
| DESCRY B | Fire Combustion - Light | 80 | 5 |
| DETECT A | Vision Fire Combustion | 30 | 7 |
| DETECT B | Sunrise combustion | 100 | 3 |

> ✅ **Résolu (recherche ZH 2026-10)** : le nom ZH **发火术** (fāhuǒshù, « art d'embrasement ») est documenté comme « **détecte les ennemis invisibles** » par le [wiki officiel TW DiGeam](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F) — c'est le skill Fire « detect/descry » (confiance 5). L'effet « détection des invisibles » de cette ligne est donc attesté officiellement côté TW ; la répartition exacte des deux lignes (MP vs détection) reste à trancher via `skilldata`.

### 8. Passif — Flame Devil Force Series — `SKILL_CH_FIRE_PASSIVE_A` (maîtrise 10, 12 niveaux)
+ **attaque physique** permanente.

> 🌏 **Noms ZH (wiki officiel TW DiGeam)** : 炎刃 (imbue feu, 4 niveaux) · 炎灵咒盾 (TR 炎靈咒盾, bouclier maudit anti-statut ≈ Fire Shield) · 火附体 (TR 火附體, « possession du feu », 3 couches, +ATQ PHY ≈ Flame Body) · 火灵护体 (membrane anti-magie ≈ Fire Protection) · 炎壁术/火墙 (mur de flamme, DEF MAG ≈ Fire Wall) · 暴焰波 (« onde de flammes violentes », gros nuke MAG ≈ Flame Wave) · 发火术 (détection des invisibles, ligne DETECT) · 暴焰魂 (passif ATK ≈ Flame Devil Force). Source : [DiGeam — 屬性氣功](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F), via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

---

## 💪 Force Mastery (« Water »)

**Groupe :** 276 (`SKILL_CH_WATER_*`) · **Passif :** Force Increasing (MP max, maîtrise 10) · Aucun dégât direct — soutien pur.

### 1. Self Heal Series — `SKILL_CH_WATER_SELFHEAL_*`
Auto-heal. CD 2,1 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Self Breathe Heal | 5 | 9 |
| B | Self Force Heal | 25 | 9 |
| C | Self Wounds Heal | 45 | 9 |
| D | Self Vital Heal | 65 | 15 |
| E | Self Breathing Heal | 98 | 9 |
| F | God Heal | 120 | 1 |

### 2. Force Cure Series — `SKILL_CH_WATER_CURE_*`
Dissipe les statuts (poison, burn, freeze, etc. — ce que les pilules universelles ne nettoient pas). CD 2,1 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Force Cure - Poison | 8 | 6 |
| B | Force Cure - Body | 28 | 6 |
| C | Force Cure - Condiion [sic] | 48 | 6 |
| D | Force Cure - Vital | 68 | 6 |
| E | Force Cure - Meditation | 88 | 6 |
| F | Force Cure - overall | 108 | 5 |

### 3. Heal Series — `SKILL_CH_WATER_HEAL_*`
Heal d'une cible (les « mains »). CD 3 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Heal - Medical Hand | 12 | 9 |
| B | Heal - Ghost Hand | 32 | 9 |
| C | Heal - Taoist Hand | 52 | 9 |
| D | Heal - Mysterious Hand | 72 | 9 |
| E | Heal - Full Hand | 94 | 9 |
| F | Heal - overall | 116 | 3 |

### 4. Rebirth Art Series (résurrection) — `SKILL_CH_WATER_RESURRECTION_*`
Ressuscite un joueur (% d'XP restitué croissant). CD 4-4,5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Soul Rebirth Art | 17 | 6 |
| B | Ghost Rebirth Art | 37 | 6 |
| C | Spirit Rebirth Art | 57 | 6 |
| D | Return Rebirth Art | 77 | 6 |
| E | Godly Rebirth Art | 102 | 4 |

### 5. Harmony Therapy Series — `SKILL_CH_WATER_HARMONY_*`
Soins/régénération prolongés (HoT) — CD 300 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Harmony Therapy | 23 | 6 |
| B | Adaptation Therapy | 43 | 6 |
| C | Whole Therapy | 63 | 6 |
| D | Source Therapy | 83 | 6 |
| E | Main Therapy | 116 | 3 |

### 6. Vital Spot Attack Series (debuffs) — `SKILL_CH_WATER_CANCEL_*`
Debuffs mono-cible : Muscle (−ATK PHY), Spirit (−ATK MAG), Body/**Decay**, Mind/**Weaken**, Zero/**Impotent**, Brain/**Division** (probabilité 100% sur les premiers livres, 80% sur Origin ajusté). CD 2 s (livres avancés 20 s).

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Vital Spot - Muscle | 30 | 12 |
| B | Vital Spot - Spirit | 50 | 10 |
| C | Vital Spot - Body | 60 | 7 |
| D | Vital Spot - Mind | 70 | 6 |
| E | Vital Spot - Zero | 80 | 5 |
| F | Vital Spot - Brain | 90 | 4 |
| G | Vital Spot - Faint | 110 | 2 |

### 7. Cure Therapy Series — `SKILL_CH_WATER_CUREAREA_*` (+ `ABNORMAL`)
Cure de zone. CD 30 s (Heaven : 60 s).

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| A | Cure Therapy - Pure | 30 | 3 |
| B | Cure Therapy - Protection | 60 | 3 |
| C | Cure Therapy - Clarity | 90 | 4 |
| ABNORMAL A | Cure Therapy - Heaven | 76 | 5 |

### 8. Vital Flow Series — `SKILL_CH_WATER_PHYSICAL_*` / `SKILL_CH_WATER_MAGICAL_*`
Récupération HP (Move/Strength) et MP (Intellect/Circulate). CD 5 s.

| Livre | Skill | Maîtrise | Niv. |
|---|---|---|---|
| PHYSICAL A | Vital Flow - Move | 30 | 8 |
| PHYSICAL B | Vital Flow - Strength | 80 | 7 |
| MAGICAL A | Vital Flow - Intellect | 40 | 8 |
| MAGICAL B | Vital Flow - Circulate | 90 | 6 |

### 9. Passif — Force Increasing Series — `SKILL_CH_WATER_PASSIVE_A` (maîtrise 10, 12 niveaux)
+ **MP maximum**.

> 🌏 **Noms ZH de la Force** (wiki officiel TW — [內功心法](https://srowiki.digeam.com/%E5%85%A7%E5%8A%9F%E5%BF%83%E6%B3%95)) : 内疗术 (auto-soin ≈ Self Heal) · 净化术 (« purification », soigne brûlure/gel/poison ≈ Force Cure) · 医疗术 (soin d'autrui ≈ Heal, 5e couche 万手) · 复活心诀 (résurrection ≈ Rebirth Art) · 内疗术气吸 (ajout du 10套/10D). Lore officiel TW : l'école interne est située à **气血谷** (« vallée du sang-qi ») au cœur des monts **秦岭** (Qinling) et se dit héritière du médecin légendaire **华佗** (Hua Tuo). Via [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

---

## 🇰🇷 Contenu KSRO (2011-2026)

> **Source primaire** : le site officiel KSRO héberge la **base de skills complète du service coréen courant** — **64 pages de séries** (Bicheon ×10, Heuksal ×9, Pacheon ×10, Cold ×8, Lightning ×7, Fire ×8, **Force ×12**) couvrant les 7 maîtrises, avec **noms KR officiels** et icônes. Séries actives : **5 à 7 livres** dont les derniers aux maîtrises **96-124** ; cas unique au-delà de 120 : **기담요결** (Force, 122/124). Accès : https://krsilkroadcp.joymax.com/gamedata/skill/asiaskill.asp?Mastery=1&Category=1 (armes CH, catégories 1-3 ; `Mastery=2` = 기공) → iframes `iframe_skill/Weapon_*_N.html` / `Force_*_N.html`. Table intégrale et lecture : [ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md §3](ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md).
>
> ⚠️ Les équivalents iSRO ne sont repris que lorsqu'ils sont déjà établis dans les sections classiques ci-dessus ; « — » = série **post-classique** (mapping codename restant à faire). **Coûts SP des rangs 96-124 : inconnus** — le site officiel ne publie que noms + maîtrises (extraction client requise, cf. rapport §16).

### Bicheon 비천검법 — 10 séries

| Série (계열) | Équivalent iSRO | Livres (maîtrise → nom KR) |
|---|---|---|
| 필살검 | Smashing Sword | 5 비천일검 · 27 비천일섬 · 49 비천월아검 · 71 비천적성검 · 96 비천쌍린검 · **120 비천 절멸검** |
| 연환검 | Chain Sword Attack | 7 일식 환영 · 29 이식 혈벽/혈량 · 51 삼식 승천/패천 · 73 사식 벽류 · 100 오식 천군 · **120 육식 파천** |
| 방패술 | Shield Technique | 10 강성 · 32 태산 · 54 철벽 · 76 거성 · 98 철성 · **105 태양 방패술** |
| 검기 | — (nuke d'épée) | 14 유혈검기 · 36 유혼 · 58 유귀 · 80 유마 · 102 유신 · **120 유황검기** |
| 비검 | Hidden Blade (KD) | 19 비검개화 · 41 비검화망 · 63 비검무적 · 85 비검격류 · **112 비검천추** |
| 천살 | Killing Heaven Blade (stabs au sol) | 19 천살참혼결 · 45 참마결 · 68 잠귀결 · 90 수라결 · 110 참해결 · **120 천살잠룡결** |
| 이기어검 | — (vol d'épée par le Ki) | 31 혈사 · 54 낙화 · 76 돌풍 · 98 난비 · **120 이기어검 만천** |
| 비천신공 | ≈ Bicheon Force (paliers 20-120 identiques ; 빙염/풍운/백귀/산해 ≈ Glacial Flame/Storm/Banshee/Summit & Depth — correspondance apparente, à confirmer) | 20 빙염 · 40 풍운 · 60 백귀 · 80 산해 · 100 건곤 · **120 일월 비천신공** |
| 강화술 | passif maîtrise 10 (≈ Shield Protection, à confirmer) | 10 호신강화 |
| 천산신갑 | — passif armure (maîtrise 80, post-classique) | 80 천산신갑 |

### Heuksal 흑살창법 — 9 séries

| Série | Équivalent iSRO | Livres |
|---|---|---|
| 멸절결 | Pierce | 5 낭아창 · 27 잔월창 · 49 유혼창 · 71 뇌응창 · 96 천운창 · **120 수라창** |
| 선풍창 | Storm (spin) | 7 혈선풍 · 29 혈랑풍 · 51 혈사풍 · 73 혈마풍 · 98 혈망풍 · **105 혈섬풍** |
| 흑살창 | Heuksal Spear (front) | 10 귀선창 · 32 파옥섬 · 54 쇄혼창 · 76 무풍아 · 98 사지창 · **116 천제창** |
| 이혼창 | Soul Departs (stun) | 14 동 · 36 진 · 58 혼 · 80 제 · 102 격 · **120 벽** |
| 창귀술 | Ghost Spear (AoE 360°) | 19 낙화 · 41 태자 · 63 신군 · 85 흑운 · 106 만암 · **120 용왕** |
| 파륨창 | Chain Spear | 24 비호 · 47 나찰/수라 · 69 명왕/교룡 · 91 주작 · **116 태상** |
| 비룡강하 | Flying Dragon Spear | 31 류 · 54 비 · 76 휘 · 98 섬 · **120 천** |
| 철삼공 | passif HP maîtrise 10 (= Cheolsam Force) | 10 철삼공 |
| 불멸패왕갑 | — passif armure (maîtrise 80, post-classique) | 80 불멸패왕갑 |

### Pacheon 파천신궁 — 10 séries

| Série | Équivalent iSRO | Livres |
|---|---|---|
| 항마궁술 | tir de base | 5 탄 · 27 파 · 49 쇄 · 71 격 · 96 멸 · 109 태 · **120 달** |
| 벽력전 | Arrow Combo | 7 이연시 · 29 삼연시 · 51 사연시 · 73 오연시 · 94 연봉시 · **116 연사황** |
| 매 소환 | Hawk Summon (les 6 oiseaux 백매/흑매/청매/뇌조/한조/화조 = White/Black/Blue/Lightning/Ice/Fire Hawk, paliers identiques) | 10 백매 · 32 흑매 · 54 청매 · 76 뇌조 · 104 한조 · **120 화조 소환** |
| 추풍섬 | Autumn Wind (perforantes) | 14 화류전 · 36 사령전 · 58 철혈전 · 80 채홍전 · 102 천마전 · **120 창룡전** |
| 파천 귀혼시 | — (AoE) | 19 귀혼시 · 41 혈영시 · 63 잠룡시 · 85 봉황시 · **112 건곤시** |
| 폭멸전 | Explosion Arrow | 25 투신 · 47 광마 · 69 마수 · 91 천괴 · **116 지옥** |
| 강궁시 | Strong Bow | 31 심 · 54 광 · 76 저 · 98 의 · **120 추** |
| 어화심궁 | — (série tardive) | 25 비화 · 50 호접 · 75 순목 · **100 침뢰** |
| 심원대법 | passif maîtrise 10 (décrit « passif MP » côté officiel — à recouper avec Mind Concentration) | 10 심원대법 |
| 용린갑 | — passif armure (maîtrise 80, post-classique) | 80 용린갑 |

### Cold 한빙면공 — 8 séries

| Série | Équivalent iSRO | Livres |
|---|---|---|
| 빙기공타 | Cold Force (imbue) | 5 빙하결 · 25 빙옥결 · 45 빙해결 · 65 빙운결 · 98 빙기결 · **120 빙극결** |
| 빙혼강기 | Frost Guard | 8 빙혼지공 · 28 빙혼신위 · 48 빙혼강기 · 68 빙혼강체 · **102 빙혼결기** |
| 빙공파 | Cold Wave | 12 포박 · 32 결박 · 52 강박 · 72 밀박 · **106 혼박** |
| 빙벽 | Frost Wall | 17 수정빙벽 · 37 천설 · 57 극한 · 77 만년 · **111 창극빙벽** |
| 한빙광야결 | Frost Nova | 23 전풍 · 43 광림 · 63 한풍 · 83 빙야 · **114 극풍** |
| 설풍지결 | Snow Storm (nuke) | 30 일결 · 50 이결 · 70 삼결 · 90 사결 · **118 오결 빙폭** |
| **섭설지혼** | — **nouvelle série** | 20 어 · 40 이 · 60 동 · 80 경 · 100 속 · **120 절** |
| 한빙지공 | passif maîtrise 10 (décrit « passif MP » côté officiel — à recouper avec Cold Armor) | 10 한빙지공 |

### Lightning 풍뢰비공 — 7 séries

| Série | Équivalent iSRO | Livres |
|---|---|---|
| 뇌기공타 | Thunder Force (imbue) | 5 뇌호결 · 25 뇌전결 · 45 뇌왕결 · 65 뇌룡결 · 98 뇌봉결 · **120 뇌참결** |
| 관통섬공 | Piercing Force | 8 필 · 28 섬 · 48 쾌 · 68 기 · **102 극 관통섬공** |
| 경공 | Wind Walk | 12 초상비 류 · 32 귀영신보 환영 · 52 초상비 쾌 · 72 귀영신보 비영 · **106 초상비 급** |
| 사자후 | Lion Shout | 17 진명 · 37 낭천 · 57 광야 · 77 파공 · 98 참살 · **120 멸천 사자후** |
| 정신집중술 | Concentration | 23 일성 · 43 이성 · 63 삼성 · 83 사성 · **114 오성** |
| 뇌전격 | Thunderbolt Force (nuke) | 30 십랑결 · 50 백호결 · 70 천마결 · 90 만학결 · **116 현무결** |
| 뇌천지공 | passif maîtrise 10 (décrit « passif MP » côté officiel — à recouper avec Heaven's Force) | 10 뇌천지공 |

### Fire 화령신공 — 8 séries

| Série | Équivalent iSRO | Livres |
|---|---|---|
| 화기공타 | Fire Force (imbue) | 5 화류결 · 25 화극결 · 45 화독결 · 65 화혼결 · 98 화운결 · **120 화양결** |
| 화염 방패술 | Fire Shield | 8 화조 · 28 염화 · 48 화왕 · **68 불사황** |
| 화염체 | Flame Body | 12 지 · 32 강 · 52 극 · 72 고 · **106 일위** |
| 화염강기 | Fire Protection | 17 화염지공 · 37 화염신위 · 57 화염강기 · 77 화염방후 · **110 화염무결** |
| 염화벽공 | Fire Wall | 23 고탑 · 43 거산 · 63 요새 · 83 옹성 · **103 금강** |
| 폭염파 | Flame Wave (nuke) | 30 화시 · 43 열화 · 56 광폭 · 70 화탄 · 83 열섬 · 96 염광 · **118 멸탄 폭염파** |
| **발화술** | — **nouvelle série** | 30 린 · 30 개운발화 · 80 경 · **100 일출발화** |
| 화마지공 | passif maîtrise 10 (décrit « passif MP » côté officiel — à recouper avec Flame Devil Force) | 10 화마지공 일성 |

### Force 기혈대법 — 12 séries (l'arbre a explosé)

| Série | Rôle (rapport) | Livres |
|---|---|---|
| 내가 호흡법 | buff HP/MP | 5 호흡법 · 25 기료술 · 45 요상술 · 65 원기술 · 98 기흡법 · **120 명상술** |
| 추궁과혈 | soins | 8 제독 · 28 요체 · 48 내성 · 68 원기 · 88 정좌 · **108 결극** |
| 반해진경 | série tardive | 30 순 · 60 결 · **90 청** |
| 제황신의경 | grand soin | 12 의수 · 32 귀수 · 52 신수 · 72 묘수 · 94 만수 · **116 건수** |
| 부활심결 | **résurrection** | 17 귀령술 · 37 귀명술 · 57 귀혼술 · **77 귀환술** |
| 치료술 | **soins de zone** | 23 조화 · 43 동화 · 63 일체 · 83 본원 · **116 초월치료술** |
| 점혈대법 | série tardive | 30 속 · 50 집 · 60 체 · 70 사 · 80 무 · 90 지 · **110 절** |
| 기혈신공 | passif (maîtrise 10) | 10 기혈신공 |
| **기담요결** | **au-delà du cap 120 !** | **122 박 · 124 제** |
| 생사경 | série tardive | 40 유혼술 · **90 강령술** |
| 활극천의경 | série tardive | 40 청령기 · **90 건곤기** |
| 활인심결 | série tardive | 10 동 · 20 정 · 60 패 · **70 순** |

> 💡 **Lecture SRObro** (rapport §3.7) : le Force (기혈대법), arbre de 4-5 séries à l'époque classique, en compte **12** sur le service coréen actuel — dont des soins de zone (치료술), une vraie résurrection (부활심결) et des séries 121-124 (기담요결). Les passifs armure par maîtrise d'arme (천산신갑/불멸패왕갑/용린갑, maîtrise 80) et les transformations 비천신공 (jusqu'à 일월) sont également post-classiques. **Mapping codename client ↔ ces noms KR = travail restant** (les noms iSRO tardifs ne correspondent pas mot à mot). Les intitulés « passif MP » du site officiel (한빙지공/뇌천지공/화마지공/심원대법) restent à recouper avec les passifs classiques via `skilldata`.

---

## 📊 Valeurs chiffrées par niveau (extraction skilldata 2026-10)

> ✅ **Extraction skilldata 2026-10** : 3 272 skills CH décodés depuis `skilldata_5000.txt` (fichiers serveur **vSRO 1.188 + extension cap 120**, repo [joaoldematejr/server_files_sro](https://github.com/joaoldematejr/server_files_sro) → `SMC/SR_GameRefData/`) ; noms croisés à 100 % avec `skills.txt` ([tarekwiz/SilkroadBot](https://github.com/tarekwiz/SilkroadBot)) ; colonnes nommées d'après `RawRefSkill.cs` ([hnguyenaa/MySilkroad](https://github.com/hnguyenaa/MySilkroad)) ; tags d'effets décodés via [ferdoran/openroad](https://github.com/ferdoran/openroad) + corrections mesurées. Rapport complet : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md).
>
> ⚠️ **Usage SRObro** : ne pas recopier les tables ici — **importer les CSV** [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv) (un niveau = une ligne, 47 colonnes : `att_pct/att_min/att_max`, `mp_cost`, `req_sp`, `prepare_ms/cast_ms/cooldown_ms`, `range`, `req_mastery_lv`, `weapon1/2`, `status`…) et [skills_series.csv](ML_RESEARCH/data/skills_series.csv) (une série = une ligne). Ci-dessous : la loi de progression + échantillons représentatifs seulement.

### 1. Le % de dégâts est FIXE par série
Sur toutes les séries d'attaque testées, `att_pct` ne change **jamais** avec le niveau — seule la fourchette fixe min~max progresse (facteur ×3-4 du lv1 au lv max), avec les coûts MP/SP :

| Série (maîtrise, niveaux) | % (fixe) | Part fixe lv1 → lv max | MP lv1 → max |
|---|---|---|---|
| Strike Smash (Bicheon 5→21, 9 lv) | 143 % | +15~18 → **+47~57** | 19→60 |
| Soul Spear - Move (Heuksal 14→30, 9 lv) | 250 % | +37~48 → **+90~115** | 92→222 |
| Strong Bow - Spirit (Pacheon 31→47, 9 lv) | 350 % | +70~95 → **+136~185** | 230→449 |
| Flame Wave - Arrow (Fire 30→64, 18 lv) | 250 % | +123~205 → **+464~773** | 348→1 310 |
| God's Thunderbolt (Lightning 116→120, 3 lv) | 300 % | +2 099~4 356 | 13 388→14 972 |

### 2. La « longue incantation » des nukes = `PreparingTime` (1 000 ms)
Colonne `Action_PreparingTime` = **1 000 ms sur les nukes CH** (Flame Wave : 1 000 ms de préparation **+** 500 ms de cast), distincte du cast (`Action_CastingTime`, ex. 411 ms Strike Smash), de l'animation (`Action_ActionDuration` = la valeur « cast » de skills.txt, vérifiée) et du cooldown (`Action_ReuseDelay`). Les timers par niveau sont dans le CSV : `prepare_ms`, `cast_ms`, `action_ms`, `cooldown_ms`, `cooltime_ms`.

### 3. Le critique n'existe que sur 14 séries du jeu entier
Tag `cr` présent uniquement sur : **Anti Devil Bow** (7 livres, **+20 constant**), **Strong Bow C/D/E**, **SWORD_DOWNATTACK_D/E** (Killing Heaven Blade D « Dragon Sore Blade » +5 / E « Asura Cut Blade » +10) et **1 passif Warrior EU**. **Aucun nuke** (Flame Wave, Frost Nova, Snow Storm, Lion Shout, Thunderbolt) **ni aucune imbue** ne porte `cr` — ✅ l'incertitude « les nukes CH ne critiquent pas » est tranchée : le critique ne vient jamais du skill nuke lui-même.

### 4. Imbues : le modèle économique complet
Durée **6 s** / CD **6 s** (recast permanent), dégâts magiques `att kind 8` à **100 % + part fixe** ; probabilité de statut **32 % (lv1) → 65 % (lv9)** ; **niveau d'effet = 2 × niveau du skill − 1** :

| Série (livre A, lv1 → lv9) | Dégâts ajoutés | Statut lv1 → lv9 | MP |
|---|---|---|---|
| **River Fire Force** (feu) | 100 % + 17~29 → + 55~92 | burn **32 % → 65 %** [25, niveau 1→17] | 52→166 |
| **Thunder Tiger Force** (foudre) | 100 % + 14~25 → + 44~81 | shock **32 % → 65 %** [20, 50] | 52→166 |
| **Ice River Force** (glace) | 100 % + 14~21 → + 45~67 | freeze + frostbite **32 % → 65 %** chacun | 52→166 |

Livres tardifs : **God Fire Force** (livre F, maîtrise 120) : 100 % + **1 769~2 949**, MP 5 361, CD 12 s ; **Ice final Force** : 100 % + 1 445~2 167.

### 5. SP cumulés pour tout apprendre (cap 120)
Coût SP total pour apprendre **toutes les séries d'une maîtrise** dans les fichiers serveur cap 120 : **Bicheon 2 751 184** · Heuksal 2 049 327 · Pacheon 1 783 462 · Fire 1 811 697 · Cold 1 883 926 · **Lightning 1 215 885** (la moins chère) · Force 1 482 143. → Réconcilie avec les ~80-200k SP « fully farmed » cap 80 : ces derniers sont des **builds avec sélection de séries**, pas l'arbre complet.

### 6. Structure des lignes (pour l'import)
`Basic_Activity` : **0 = passif · 1 = instant/toggle (imbues) · 2 = castable** · `Basic_ChainCode` : segment suivant d'un combo (0 = fin, continuations à MP = 0) · `Action_Range` : 150 = nukes distance, 50 = AoE mêlée, 0 = portée de l'arme (projectiles : `flying_speed` 400) · `ReqCommon_Mastery1/Level1` : maîtrise requise · `ReqLearn_SP` : coût SP · `Consume_MP/HP` : coûts par cast · `ReqCast_Weapon1/2` : armes requises (2 sword, 3 blade, 4 spear, 5 glaive, 6 bow ; 255 = libre). Côté EU : mêmes colonnes dans [skills_detail_EU.csv](ML_RESEARCH/data/skills_detail_EU.csv).

---

## 📊 Puissances de Skills (Origin Mobile)

Valeurs « Skill Power » officielles (Silkroad Origin Mobile, base iSRO — **valeurs relatives de dégâts**, retouchées par Joymax pour mobile ; à utiliser comme ordre de grandeur, pas comme données client) :

> 📊 ✅ (extraction skilldata 2026-10) Les **valeurs client réelles** sont désormais disponibles par niveau (% fixe + part fixe min~max, MP, SP) : voir [Valeurs chiffrées par niveau](#-valeurs-chiffrées-par-niveau-extraction-skilldata-2026-10) et les CSV — la table ci-dessous reste utile comme **proxy relatif** pour comparer les séries entre elles.

| Skill | Puissance | Skill | Puissance |
|---|---|---|---|
| Stab Smash | 160 | Ghost Spear - Mars | 414 |
| Crosswise Smash | 200 | Ghost Spear - Storm Cloud | 437 |
| Flying Stone Smash | 184 | Ghost Spear - Emperor | 427 |
| Twin Energy Smash | 216 | Ghost Spear - Sea God | 440 |
| Billow Chain | 340 | Chain Spear - Dragon | **516** |
| Ascension Chain | 304 | Chain Spear - Phoenix | 387 |
| Heaven Chain | **460** | Flying Dragon - Flash | 310 |
| Lightning Chain | 384 | Flying Dragon - Sky | 320 |
| Thousand Army Chain | **480** | Spirit Crash Spear | 281 |
| Demon Blade Force | 250 | Windless Spear | 289 |
| Ocean Blade Force | 250 | Death Bringer Spear | 295 |
| Asura Cut Blade | 200 | Soul Spear - Soul | 234 |
| Snake Sword Dance | 300 | Soul Spear - Emperor | 240 |
| Petal Sword Dance | 260 | Soul Spear - Emptiness | 245 |
| Typhoon Sword Dance | 278 | Anti Devil Bow - Strike | 100 |
| Chaotic Sword Dance | 284 | Anti Devil Bow - Annihilate | 110 |
| Mind Bow - Flower | 87 → 187 (buff ×2,1) | 4 Arrow Combo | 146 |
| Snow Storm - Double Shot | 250 | 6 Arrow Combo | 210-275 |
| Snow Storm - Multi Shot | 300 | Autumn Wind - Red | 158 |
| Shock Lion Shout | 92 | Autumn Wind - Devil | 164 |
| Heaven Lion Shout | 87 | Autumn Wind - Dragon | 170 |
| Wolf's Thunderbolt | 300 | Devil Arrow | 152-168 |
| Flame Wave - Wide | 300 | Celestial Beast Arrow | 165-174 |
| Flame Wave - Bomb | 263 | Strong Bow - Vision | 100 |
| Flame Wave - HellFire | 315 | Strong Bow - Craft | 110 |
| Flame Wave - Disintegrate | **330** | Strong Bow - Will | 120 |

> Lectures : les chaînes d'arme sont les skills les plus « puissants » en valeur brute (mais lentes, 8 s de CD) ; Flame Wave reste le meilleur nuke élémentaire ; Anti Devil/Strong Bow sont faibles en base mais jouent sur **critique/charge**.

---

## 🧪 Statuts et Imbues

| Statut | Source | Effet | Données |
|---|---|---|---|
| **Burn** | Imbue Fire, Flame Wave | DoT feu (ticks aléatoires, montent avec le niveau du skill) | 25% de prob. au lv1 livre A, ~6 s (70 unités) ; tick HP toutes les ~2 s d'après la communauté TR (SroCave, via [ML_RESEARCH/RESEARCH_TR.md](ML_RESEARCH/RESEARCH_TR.md)) · ✅ skilldata : burn **32 % → 65 %** par livre (lv1→lv9), niveau d'effet 2×niveau−1 |
| **Frostbite** | Imbue Cold | Réduit vitesse d'attaque ET de déplacement | ~40% de prob. · ✅ skilldata : **32 % → 65 %** par livre (lv1→lv9) |
| **Freezing** | Imbue Cold, Cold Wave, Frost Nova | Immobilise totalement | ~20% de prob. · ✅ skilldata : **32 % → 65 %** par livre ; Frost Nova - Wind : **66 % → 132 %** |
| **Shock** | Imbue Lightning | Réduit le **parry ratio** de la cible | ✅ skilldata : **32 % → 65 %** (lv1→lv9) [20, 50] |
| **Stun** | Soul Departs Spear (chance) | État (pas un « effet ») : **aucune pilule** ne le retire | % par niveau du skill |
| Decay / Weaken / Impotent / Division | Vital Spot (Force) | Debuffs nommés (−ATK PHY/MAG etc.) | 100% (80% ajusté Origin) |
| Poison / Zombie | Monstres | DoT / soins inversés | nettoyés par pilules ou Force Cure |

- **Pilules** : small/medium/large soignent ~33/50/76 unités d'effet. **Freeze et Burn résistent aux pilules universelles** → Force Cure.
- **Une seule imbue active** (toggle, CD = durée de réactivation 6→21 s selon le livre).

### ⚙️ Mécanique des imbues — multipliées par le % du skill (forum DE, 2006)

> Croisement recherche DE 2026-10 — [silkroadonline.de — Schadensberechnung (mai 2006)](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/4266-schadensberechnung), via [ML_RESEARCH/RESEARCH_DE.md](ML_RESEARCH/RESEARCH_DE.md).

- Le dégât d'imbue est **multiplié par le % de dégâts du skill** utilisé : un skill à 200 % double le bonus d'imbue, un combo à 68 %/coup le réduit proportionnellement.
- Tests chiffrés d'époque : Hidden Blade 200 → **400** avec Fire ; sans imbue 25-30 dégâts, avec 250-300.
- Le calcul serveur s'effectue à la **confirmation d'activation du skill** : un skill lancé une fraction de seconde avant l'activation de l'imbue n'en bénéficie pas (explication des « combos non imbueés »).

### 🧪 Chiffres officiels 2005 (GameAbout, tests en jeu) — recherche KO 2026-10

- Dégâts moyens lv1 : 화류결/River Fire = **21** · 뇌호결/Thunder Tiger = **17,5** · transfert splash (lightning) = **12,25** en moyenne → le splash accélère le farm de ~**20 %**.
- Cibles AoE : 사자후/Lion Shout livre 1 (진명) = **3 cibles**, livre 2 (낭천) = **5 cibles** ; 한빙광야결/Frost Nova : 전풍 = 3 cibles, 광림/광우 = 5 cibles.
- Scaling officiel 2005 : les skills d'attaque 기공 scalent sur l'**attaque magique**, les skills défensifs sur la **défense magique**, les skills de vitesse selon l'équipement porté.
- Sources : [GameAbout — 풍뢰비공 (27/01/2005)](http://www.gameabout.com/news/articleView.html?idxno=615) · [GameAbout — 한빙면공 (26/01/2005)](http://www.gameabout.com/news/articleView.html?idxno=613), via [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md).

---

## 💰 Coûts SP et Progression

- **400 skill exp = 1 SP** (constante).
- Coût SP d'un niveau de skill = valeur de la table au **(maîtrise requise + 1)**. Exemples : Wind Walk lv1 (maîtrise 12) ≈ 15 SP ; maîtrise 11→12 ≈ 12 SP ; les hauts livres coûtent des centaines à milliers de SP par niveau.
- Palier de déverrouillage d'un niveau de skill : **+2 niveaux de maîtrise** (ex. Strike Smash : lv1@5, lv2@7, lv3@9… lv9@21 ; un guide GameFAQs 2008 mentionne « Illusion Chain lvl 9 vers le niveau 61 », cohérent avec les paliers +2 des livres successifs de la série Chain).
- SP cumulé (guide UnKnoWnCheaTs) : lvl 30 → 3 911 SP (GAP 0) à 75 074 SP (GAP 9) ; lvl 60 → 9 884 à 189 675 SP.
- Estimations « fully farmed » cap 80 : glaive ~80k, bow ~90-100k, blader ~200k SP.
- ✅ (extraction skilldata 2026-10) **SP cumulés pour TOUT apprendre au cap 120** (fichiers serveur vSRO 1.188 + extension 120) : Bicheon **2 751 184** · Heuksal 2 049 327 · Pacheon 1 783 462 · Fire 1 811 697 · Cold 1 883 926 · Lightning 1 215 885 · Force 1 482 143 — les ~80-200k cap 80 correspondent à des builds avec **sélection de séries**. Le `req_sp` exact de chaque niveau est dans [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv). Source : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md §4.5](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md).
- Reskill : quête Skill Resuscitation (lvl 20+, 10 cœurs maudits → potion, **80% du SP remboursé**).

---

## ⚠️ Données Manquantes / Incertitudes

1. **Dégâts min/max exacts et coûts MP par niveau** : ✅ **Résolu (extraction skilldata 2026-10)** — extraits de `skilldata_5000.txt` (vSRO 1.188 + cap 120) vers [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv) (47 colonnes par niveau : `att_pct/att_min/att_max`, `mp_cost`, `req_sp`, timers ms, portée, armes, statuts). Les « Skill Power » Origin Mobile restent des proxys relatifs. Limite résiduelle : tags imbriqués non décodés (~4 800/6 909 lignes joueurs ont des valeurs brutes dans `params_raw`, souvent des ID d'effets visuels) ; sémantique exacte des `att` kinds 6/9 (EU) à confirmer en jeu.
2. **% exacts d'imbue par palier** : ✅ **Résolu (extraction skilldata 2026-10)** — probabilité **32 % (lv1) → 65 % (lv9)** par livre, niveau d'effet = 2×niveau−1 (burn lv9 = niveau d'effet 17) ; les anciennes valeurs (Burn 25 %, Frostbite ~40 %, Freeze ~20 %) correspondaient aux premiers niveaux. Courbe complète dans le CSV (`status` par niveau).
3. **SP exact par skill** : ✅ **Résolu (extraction skilldata 2026-10)** — `req_sp` par niveau dans le CSV ; totaux par maîtrise au cap 120 : Bicheon 2 751 184 · Heuksal 2 049 327 · Pacheon 1 783 462 · Fire 1 811 697 · Cold 1 883 926 · Lightning 1 215 885 · Force 1 482 143.
4. **Effets des séries tardives** — partiellement résolu : ✅ **Résolu (recherche ZH 2026-10)** pour la ligne Fire `DESCRY/DETECT` — **发火术** est documenté « détecte les ennemis invisibles » par le [wiki officiel TW DiGeam](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F) (confiance 5). Restent à confirmer : Bicheon Force `SHIELDPD`, Vital Flow, Cure Therapy - Heaven (rôles déduits des cooldowns/noms et de guides partiels — les données brutes sont dans le CSV `params_raw` pour aller plus loin).
5. **Noms de séries Pierce/Storm** : ✅ **Résolu (recherche KO/ZH 2026-10)** — côté KR : **멸절결 계열** (Pierce) et **선풍창 계열** (Storm), livres attestés 낭아창/잔월창/유혼창 et 혈선풍/혈랑풍/혈사풍 ([Tistory vivia2020](https://vivia2020.tistory.com/20), confiance 4) ; côté ZH : 破轮枪 / 鬼枪术 / 血轮舞 (correspondances exactes encore inférentielles, confiance 4 — cf. note de la section Heuksal).
6. **Noms KSRO** : ✅ **Résolu (recherche KO 2026-10)** — noms officiels 2004 des 7 maîtrises + ~30 séries/livres KR collectés (Inven 20/12/2004, GameAbout 2005, guides KR — confiance 5) : voir la section [Noms originels des maîtrises (KR/ZH)](#-noms-originels-des-maîtrises-krzh) et les colonnes « Nom KR ». Les **codenames restent la clé de référence** recommandée pour SRObro.
7. La colonne « Cast » des chaînes multi-hits : ✅ **Élucidé (extraction skilldata 2026-10)** — la valeur « cast » de `skills.txt` = colonne `Action_ActionDuration` (vérifié sur 4 skills témoins) ; le vrai cast est `Action_CastingTime` (ex. Strike Smash 411 ms, Meteor 1 334 ms), la préparation est `Action_PreparingTime` (**1 000 ms sur les nukes CH**). Les 5 timers par niveau (`prepare/cast/action/cooldown/cooltime` en ms) sont dans le CSV.
8. **Reste non décodé** (rapport §5) : tags imbriqués (`setv`/`lks2`/`tnt2` avec args fourcc — Pain Quota, invocations), colonnes 6/15/67-68, `att` kinds 6/9 (EU), et les skills du client iSRO post-2010 (format `Param1..Param12` différent, non couvert).

---

## 🔗 Resources

- [tarekwiz/SilkroadBot — skills.txt (données client, GitHub)](https://github.com/tarekwiz/SilkroadBot/blob/master/Silkroad%20Fusion/bin/Debug/Data/skills.txt) — source des séries/livres/maîtrises/CD
- [Silkroad Origin Mobile — Class Balance Adjustments](https://sromobile.com/en/news/updates/class-balance-adjustments) — noms de séries officiels + Skill Power + linkages CD
- [UnKnoWnCheaTs — Complete Guide to Skill Points](https://unknowncheats.me/wiki/Silkroad:Complete_Guide_to_Skill_Points) — mécanique SP/GAP/caps
- [UnKnoWnCheaTs — SRO General Tips and Stats](https://www.unknowncheats.me/forum/silkroad/38774-sro-tips-stats.html) — imbues/statuts/pilules
- [UnKnoWnCheaTs — Building Blade Guide](https://www.unknowncheats.me/wiki/Silkroad:Building_Blade_Guide) — rôles des séries Bicheon/Cold/Lightning
- [SilkroadForums — PURE STR BUILD](http://www.silkroadforums.com/viewtopic.php?f=5&t=82222) — priorités de skills, SP, combos
- [Silkroad Online Wiki (Fandom) — Skills](https://silkroadonline.fandom.com/wiki/Skills) — cap 360, gap
- [DaxterSoul (DummkopfOfHachtenduden) — SilkroadDoc](https://github.com/DummkopfOfHachtenduden/SilkroadDoc) — formats (skilldata/_RefSkill) pour extraire les chiffres manquants
- [Ex-o — Silkroad-Database-Documentation](https://github.com/Ex-o/Silkroad-Database-Documentation) / [JellyBitz — SR_Db2Media](https://github.com/JellyBitz/SR_Db2Media) — pipelines BDD→client

### Noms originels KR/ZH + mécaniques (recherche multilingue 2026-10)
- [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) — noms KR officiels 2004 + ~30 séries/livres KR + chiffres 2005 (synthèse Inven/GameAbout/guides KR, glossaire 60+ termes)
- [Inven — présentation open beta (20/12/2004)](https://www.inven.co.kr/webzine/news/?news=2285) · [GameAbout — 한빙면공](http://www.gameabout.com/news/articleView.html?idxno=613) · [GameAbout — 풍뢰비공](http://www.gameabout.com/news/articleView.html?idxno=615) · [Tistory vivia2020 — arbres KR](https://vivia2020.tistory.com/20) · [Naver — build 올지검방](https://blog.naver.com/offspring_i/80043340729)
- [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) — noms ZH officiels (wiki TW DiGeam, archives CSRO Sina/17173, wiki Bahamut)
- [DiGeam — 屬性氣功](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F) · [DiGeam — 內功心法](https://srowiki.digeam.com/%E5%85%A7%E5%8A%9F%E5%BF%83%E6%B3%95) · [17173 — 技能职业详解 (2005)](http://sro.17173.com/content/2005-10-28/n709_625435.html) · [Sina — 黑杀枪法 (2007)](http://games.sina.com.cn/o/z/slcs/2007-08-09/1550265655.shtml) · [Sina — 破天神弓 (2005)](http://games.sina.com.cn/o/z/slcs/2005-04-29/1115224411.shtml)
- [ML_RESEARCH/RESEARCH_DE.md](ML_RESEARCH/RESEARCH_DE.md) — mécanique des imbues ×% du skill ([silkroadonline.de — Schadensberechnung, 2006](https://www.silkroadonline.de/silkroadonline-allgemein/anleitungen-guides/4266-schadensberechnung))
- [ML_RESEARCH/RESEARCH_TR.md](ML_RESEARCH/RESEARCH_TR.md) — tick Burn ~2 s (SroCave)
- Simulateur officiel TW des skills CH : [sro.digeam.com/cal_china](https://sro.digeam.com/cal_china)

### Valeurs chiffrées par niveau (extraction skilldata 2026-10)
- [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md) — décodage complet de `skilldata_5000.txt` : 118 colonnes, tags fourcc (dont les tags de statut `kb/ko/bu/fb/fz/es/bl/sl/tnt2` et les corrections openroad `cr`=2, `heal`=4, `defp`=3), découvertes chiffrées
- [ML_RESEARCH/data/skills_detail_CH.csv](ML_RESEARCH/data/skills_detail_CH.csv) — 3 272 lignes (un niveau = une ligne), 47 colonnes décodées + `params_raw`
- [ML_RESEARCH/data/skills_series.csv](ML_RESEARCH/data/skills_series.csv) · [ML_RESEARCH/data/skills_masteries.csv](ML_RESEARCH/data/skills_masteries.csv) — vues par série et par maîtrise
- Sources primaires : [joaoldematejr/server_files_sro](https://github.com/joaoldematejr/server_files_sro) (`SMC/SR_GameRefData/skilldata_*.txt`, UTF-16LE, 8 shards) · [tarekwiz/SilkroadBot — skills.txt](https://github.com/tarekwiz/SilkroadBot) (noms EN) · [hnguyenaa/MySilkroad — RawRefSkill.cs](https://github.com/hnguyenaa/MySilkroad) (nommage des colonnes) · [ferdoran/openroad](https://github.com/ferdoran/openroad) (table des tags fourcc « corpus-verified v1.188 »)

---

*Dernière mise à jour : 2026-10-01 (enrichie le même jour des noms originels KR/ZH — recherche multilingue ML_RESEARCH ; ajout de la section 🇰🇷 Contenu KSRO 2011-2026 : base officielle 64 séries / 296 skills — rapport ML_RESEARCH/RESEARCH_KO2_SYSTEMS.md §3 ; ajout des **valeurs chiffrées par niveau** (loi % fixe, timers, imbues 32→65 %, critique 14 séries, SP cap 120) — extraction skilldata 2026-10, rapport ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md, CSV ML_RESEARCH/data/skills_detail_CH.csv)*
*Sources : skills.txt client (GitHub SilkroadBot), Silkroad Origin Mobile (officiel), UnKnoWnCheaTs, SilkroadForums, Fandom, StrategyWiki, elitepvpers, Reddit r/silkroadonline ; noms KR/ZH : Inven 2004, GameAbout 2005, guides KR, wiki TW DiGeam, archives CSRO Sina/17173, Bahamut ; chiffres par niveau : skilldata_5000.txt (fichiers serveur vSRO 1.188 + cap 120, repo joaoldematejr/server_files_sro), colonnes RawRefSkill.cs (hnguyenaa), tags fourcc openroad — valeurs vérifiées marquées ✅ (extraction skilldata 2026-10). Voir section « Données Manquantes » avant d'utiliser les autres chiffres comme références absolues.*
