# Skills Database - Chinese Masteries

> ⚠️ **Révision majeure (2026-10)** : base reconstruite à partir de données extraites du client (`skills.txt`, dépôt GitHub *tarekwiz/SilkroadBot*, données vSRO/iSRO cap 120) croisée avec les noms de séries officiels (Silkroad Origin Mobile) et les guides communautaires. Les listes précédentes contenaient des skills inventés ; tout est remplacé ci-dessous par les **vraies séries iSRO**.
>
> 🌏 **Enrichissement (recherche multilingue 2026-10)** : ajout des **noms originels coréens** (liste officielle open beta 2004, presse GameAbout 2005, guides KR) et **chinois** (wiki officiel TW DiGeam, archives CSRO Sina/17173 2005-2007) — voir la section [Noms originels des maîtrises (KR/ZH)](#-noms-originels-des-maîtrises-krzh) et les rapports [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) / [RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md).

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

## 📊 Puissances de Skills (Origin Mobile)

Valeurs « Skill Power » officielles (Silkroad Origin Mobile, base iSRO — **valeurs relatives de dégâts**, retouchées par Joymax pour mobile ; à utiliser comme ordre de grandeur, pas comme données client) :

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
| **Burn** | Imbue Fire, Flame Wave | DoT feu (ticks aléatoires, montent avec le niveau du skill) | 25% de prob. au lv1 livre A, ~6 s (70 unités) ; tick HP toutes les ~2 s d'après la communauté TR (SroCave, via [ML_RESEARCH/RESEARCH_TR.md](ML_RESEARCH/RESEARCH_TR.md)) |
| **Frostbite** | Imbue Cold | Réduit vitesse d'attaque ET de déplacement | ~40% de prob. |
| **Freezing** | Imbue Cold, Cold Wave, Frost Nova | Immobilise totalement | ~20% de prob. |
| **Shock** | Imbue Lightning | Réduit le **parry ratio** de la cible | % variable par niveau |
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
- Reskill : quête Skill Resuscitation (lvl 20+, 10 cœurs maudits → potion, **80% du SP remboursé**).

---

## ⚠️ Données Manquantes / Incertitudes

1. **Dégâts min/max exacts et coûts MP par niveau** : non présents dans `skills.txt` (le fichier ne porte que cast/CD/niveaux). À extraire de `skilldata_5000.txt` ou de la table `_RefSkill` (colonnes `InitialMinDamage/InitialMaxDamage`, `ConsumeMP`, `DownBySP`…). Les « Skill Power » Origin Mobile ci-dessus sont des **proxy relatifs**, pas les valeurs client.
2. **% exacts d'imbue par palier** : seuls Burn 25%/lv1, Frostbite ~40%, Freeze ~20% sont documentés ; la courbe par niveau reste à extraire.
3. **SP exact par skill** : formule confirmée (table à maîtrise+1) mais la table complète n'est pas reproduite ici.
4. **Effets des séries tardives** — partiellement résolu : ✅ **Résolu (recherche ZH 2026-10)** pour la ligne Fire `DESCRY/DETECT` — **发火术** est documenté « détecte les ennemis invisibles » par le [wiki officiel TW DiGeam](https://srowiki.digeam.com/%E5%B1%AC%E6%80%A7%E6%B0%A3%E5%8A%9F) (confiance 5). Restent à confirmer : Bicheon Force `SHIELDPD`, Vital Flow, Cure Therapy - Heaven (rôles déduits des cooldowns/noms et de guides partiels — à valider via skilldata).
5. **Noms de séries Pierce/Storm** : ✅ **Résolu (recherche KO/ZH 2026-10)** — côté KR : **멸절결 계열** (Pierce) et **선풍창 계열** (Storm), livres attestés 낭아창/잔월창/유혼창 et 혈선풍/혈랑풍/혈사풍 ([Tistory vivia2020](https://vivia2020.tistory.com/20), confiance 4) ; côté ZH : 破轮枪 / 鬼枪术 / 血轮舞 (correspondances exactes encore inférentielles, confiance 4 — cf. note de la section Heuksal).
6. **Noms KSRO** : ✅ **Résolu (recherche KO 2026-10)** — noms officiels 2004 des 7 maîtrises + ~30 séries/livres KR collectés (Inven 20/12/2004, GameAbout 2005, guides KR — confiance 5) : voir la section [Noms originels des maîtrises (KR/ZH)](#-noms-originels-des-maîtrises-krzh) et les colonnes « Nom KR ». Les **codenames restent la clé de référence** recommandée pour SRObro.
7. La colonne « Cast » des chaînes multi-hits correspond à la valeur client du premier hit (interprétation probable : fenêtre de temps/animation) — à re-vérifier avec skilldata_5000 (colonnes `ActionPeriod`/`CastTime`).

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

---

*Dernière mise à jour : 2026-10-01 (enrichie le même jour des noms originels KR/ZH — recherche multilingue ML_RESEARCH)*
*Sources : skills.txt client (GitHub SilkroadBot), Silkroad Origin Mobile (officiel), UnKnoWnCheaTs, SilkroadForums, Fandom, StrategyWiki, elitepvpers, Reddit r/silkroadonline ; noms KR/ZH : Inven 2004, GameAbout 2005, guides KR, wiki TW DiGeam, archives CSRO Sina/17173, Bahamut. Voir section « Données Manquantes » avant d'utiliser les chiffres comme références absolues.*
