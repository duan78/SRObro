# Unique Bosses

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Liste Officielle des Uniques](#-liste-officielle-des-uniques)
- [Noms Multilingues (ZH/KR)](#-noms-multilingues-des-uniques-zh--kr)
- [Uniques Classiques (Chine/Europe)](#-uniques-classiques-chineeurope)
- [Roc (Roc Mountain)](#-roc-roc-mountain)
- [Uniques du Qin-Shi Tomb (Medusa)](#-uniques-du-qin-shi-tomb-medusa)
- [Uniques du Job Temple (Alexandrie)](#-uniques-du-job-temple-alexandrie)
- [🇰🇷 Boss KSRO post-Medusa (2011-2023)](#️-boss-ksro-post-medusa-2011-2023)
- [Boss du Forgotten World (FGW)](#-boss-du-forgotten-world-fgw)
- [Variantes Event (Strong/Evil/GM)](#-variantes-event-strongevilgm)
- [Spawn Times](#-spawn-times)
- [Spawn Locations](#-spawn-locations)
- [Drop Lists](#-drop-lists)
- [Stratégies de Farm](#-stratégies-de-farm)
- [Unique Hunting Parties](#-unique-hunting-parties)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 👑 Vue d'Ensemble

Les **Uniques** sont les boss les plus puissants de Silkroad Online. Ils dropent des items rares (SOS, SOM, SOSun) et donnent une quantité massive d'EXP/SP.

### Points Clés
- ✅ **Meilleurs drops du jeu:** SOX items
- ✅ **Massive EXP/SP:** Un unique peut donner plusieurs levels
- ✅ **Long respawn:** 3-5 heures sur iSRO ; défauts vSRO **par unique** : **6 h** (TG/Cerberus/Ivy/Isyutaru/Yarkan/Shaitan), **3 h** (Uruchi), **4 h** (Medusa) — ✅ Résolu (recherche PS 2026-10), variable selon les serveurs
- ✅ **Full party required:** Généralement impossible solo au level approprié
- ✅ **Competition:** D'autres joueurs veulent aussi les tuer

### ⚠️ Note de fiabilité (recherche 2026)

Ce document a été corrigé à partir de **données extraites du client officiel** (tables `_RefObjCommon`/`characterdata`, publiées sur silkroadonline.wiki) et de guides communautaires anciens (elitepvpers, rev6, mmorpg.com, strategywiki). Les HP/levels ci-dessous sont **vérifiés** sauf mention contraire.

> ✅ **Validation croisée multilingue (recherche ML 2026-10)** : les HP/niveaux des 7 uniques classiques (Tiger Girl → Demon Shaitan) sont confirmés par **deux sources turques indépendantes** ([DonanımHaber](https://forum.donanimhaber.com/yaratiklarin-canlari-cin-avrupa-ve-unique--28889841) + [MMSRN](https://www.mmsrn.com/silkroad-online-tum-unique-isimleri-levelleri-ve-hpleri-kactir)), par le **guide FR « Les Uniques » (GMS Temple, 2010** — [source](https://forum.gmstemple.com/index.php?showtopic=8106)) et par les forums **allemands** ([StageTwo](https://www.stagetwo.eu/gaming/rollenspiele/153328-silkroad-uniques), elitepvpers) — valeurs strictement identiques aux données client. Rapports : [ML_RESEARCH/RESEARCH_TR.md](ML_RESEARCH/RESEARCH_TR.md) · [RESEARCH_FR.md](ML_RESEARCH/RESEARCH_FR.md) · [RESEARCH_DE.md](ML_RESEARCH/RESEARCH_DE.md)

> ❌ **Corrigé :** les anciennes versions de ce fichier listaient « Cerberus niveau 40 », « Captain Ivy 60 », « Isyutaru 80 », « Lady Lyn », « Beithy », « Bunny/Rooster/Monkey », « Spider Queen », « Sphinx/Osiris/Ra » comme uniques de terrain. **Lady Lyn, Beithy, Bunny, Rooster, Monkey, Spider Queen n'existent pas dans les données client iSRO** — ce sont des inventions ou des uniques de serveurs privés. Sphinx/Osiris/Neith/Isis/Serket/Seth existent mais sont les uniques du **Job Temple** (voir sections dédiées).

---

## 📜 Liste Officielle des Uniques

### 📊 Tableau Complet Vérifié (données client iSRO)

| # | Unique | Code client | ID | Level | HP | ATK | Gold | Carte |
|---|--------|-------------|-----|-------|-----|-----|------|-------|
| 1 | **Tiger Girl** | `MOB_CH_TIGERWOMAN` | 1954 | 20 | 598,720 | 42-51 | 586,560 | Chine (Jangan) |
| 2 | **Cerberus** | `MOB_EU_KERBEROS` | 5871 | 24 | 693,072 | 52-70 | 740,519 | Europe (Constantinople) |
| 3 | **Captain Ivy** | `MOB_AM_IVY` | 14778 | 30 | 1,094,835 | 115-184 | 1,050,440 | Asie Mineure |
| 4 | **Uruchi** | `MOB_OA_URUCHI` | 1982 | 40 | 1,779,528 | 124-149 | 1,711,056 | Asie Centrale (Tarim Basin) |
| 5 | **Isyutaru** | `MOB_KK_ISYUTARU` | 2002 | 60 | 4,324,612 | 274-329 | 3,572,738 | Karakoram |
| 6 | **Lord Yarkan** | `MOB_TK_BONELORD` | 3810 | 80 | 9,353,045 | 559-1047 | 6,452,763 | Taklamakan |
| 7 | **Demon Shaitan** | `MOB_RM_TAHOMET` | 3875 | 90 | 12,732,060 | 898-1528 | 8,671,974 | Roc Mountain |
| 8 | **Roc** | `MOB_RM_ROC` | 3877 | 100 | **1,451,891,045** | 2052-3283 | 1,157,701,880 | Roc Mountain |
| 9 | **BeakYung the White Viper** (« Medusa ») | `MOB_QT_*` | — | 105 | 183,535,199 | — | — | Qin-Shi Tomb B6 |
| 10 | **Apis** | `MOB_SD_APIS` | 32751 | 103 | 21,068,995 | 1775-2925 | 12,735,087 | Job Temple |
| 11 | **Selket** | `MOB_SD_SELKISID` | 32767 | 105 | 80,811,919 | 2907-4785 | 32,264,851 | Job Temple |
| 12 | **Neith** | `MOB_SD_NEITH` | 32768 | 106 | 83,077,174 | 2991-4923 | 33,232,797 | Job Temple |
| 13 | **Anubis** | `MOB_SD_ANUBIS` | 32769 | 107 | 150,486,799 | 3165-5210 | 52,885,013 | Job Temple |
| 14 | **Isis** | `MOB_SD_ISIS` | 32770 | 108 | 154,677,234 | 3256-5359 | 54,471,562 | Job Temple |
| 15 | **Haroeris** | `MOB_SD_HAROERIS` | 26681 | 109 | 440,747,010 | 3815-6277 | 99,204,245 | Job Temple |
| 16 | **Seth** | `MOB_SD_SETH` | 26683 | 110 | 425,505,853 | 4034-6637 | 101,035,947 | Job Temple |

**Sous-uniques du Qin-Shi Tomb** (voir section dédiée) : 4 Gardiens (98-99), Shinmoo (100), Soso the Black Viper (100), Snake Generals (95).

**Boss de donjons FGW** (voir section dédiée) : Togui General (bracket 35-50, version A1 = lvl 39), Ghost Sereness (bracket 91-100, version A1 = lvl 93) — le level des boss FGW dépend du bracket et du grade (A1-A4).

### ✅ HP officiels des boss 111+ (tracker m3stat) — Résolu (recherche PS 2026-10)

> ✅ **Résolu (recherche PS 2026-10)** : les HP des boss 111+ — la plus grosse lacune de ce document — sont désormais **mesurés sur les serveurs officiels iSRO** (Minerva, Palmyra…) par le tracker **M3 Stats**, qui collecte les données en jeu. Valeurs **[OFFICIEL-DÉRIVÉ]** (valeurs officielles, mesure tierce). Source : [m3stat.com/uniques](https://www.m3stat.com/uniques) · rapport : [ML_RESEARCH/RESEARCH_PS_HIGHCAP.md](ML_RESEARCH/RESEARCH_PS_HIGHCAP.md)

| Unique | Level | HP | Statut |
|---|---|---|---|
| **Kidemonas** (키데모나스) | **120** | **13 851 102** | ✅ officiel (Dimension Miroir — cf. section KSRO ci-dessous) |
| **Karkadann** | **123** | **15 023 129** | ✅ officiel (ère cap 120-125, uniques « 12-13D ») |
| **Merikh** | **125** | **18 372 504** | ✅ officiel (ère cap 125) |

- **Chaîne classique revalidée par la même source** : Tiger Girl 598 720 · Cerberus 693 072 · Captain Ivy 1 094 835 · Uruchi 1 779 528 · Isyutaru 4 324 612 · Lord Yarkan 9 353 045 · Demon Shaitan 12 732 060 · **Medusa/BeakYung 183 535 199** — **strictement identiques** aux données client du tableau ci-dessus (validation croisée supplémentaire, après TR/FR/DE/ZH/KO). Le tracker donne aussi **Roc = 1 451 891 045** (même ordre de grandeur atypique que le client — à recouper, possiblement version raid/événement).
- Cross-validation serveur privé : le wiki ExaySRO **republie à l'identique** les HP du client officiel (dont **Apis 21 068 995**) — seule sa ligne « boss custom » diffère (voir Abshad/Bagdad ci-dessous). Source : [wiki ExaySRO — Unique Locations](https://wiki.exaysro.com/books/guides/page/unique-locations) · [ML_RESEARCH/RESEARCH_AR_SERVERS.md](ML_RESEARCH/RESEARCH_AR_SERVERS.md)
- ⚠️ **Toujours manquants** : HP des boss Jupiter 111-118 (Jupiter/Yuno/Deus/Baal/Babilion/Zielkiaxe) et des boss 130+ (Benephika, Giant Overlord, Thief Boss Kalia) — le tracker s'arrête à Merikh 125 ; l'extraction `_RefObjChar`/`characterdata` des files vSRO 1.193+/BR120 reste la voie (cf. [ML_RESEARCH/RESEARCH_PS_FILES.md](ML_RESEARCH/RESEARCH_PS_FILES.md) §1).
- Exemple de HP custom à ne pas confondre avec l'officiel : InPanic (cap 120) affiche Medusa à **367 070 398 HP** — le **doublement** de la valeur officielle **[CUSTOM]** ([elitepvpers 1849004](https://www.elitepvpers.com/forum/sro-pserver-advertising/1849004-inpanic-silkroad-level-120-cap-privat-server-deutsch-english-6.html)).

### Codes de région dans les noms internes
| Préfixe | Région |
|---------|--------|
| `MOB_CH_` | Chine (Jangan → Donwhang → Hotan) |
| `MOB_EU_` | Europe (Constantinople) |
| `MOB_AM_` | Asie Mineure |
| `MOB_OA_` | Asie Centrale (Tarim Basin) |
| `MOB_KK_` | Karakoram |
| `MOB_TK_` | Taklamakan |
| `MOB_RM_` | Roc Mountain |
| `MOB_QT_` | Qin-Shi Tomb (donjon de Jangan) |
| `MOB_SD_` | Désert d'Alexandrie / Job Temple |
| `MOB_GOD_` | Forgotten World (donjons) |
| `MOB_EV_` | Événements |

---

## 🌐 Noms multilingues des uniques (ZH / KR)

> ✅ Résolu (recherche ZH 2026-10 + KO 2026-10) : noms chinois officiels (wiki TW DiGeam / sources CN) et coréens (presse KR d'époque) des uniques. Rapports : [ML_RESEARCH/RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) · [ML_RESEARCH/RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md)

| Unique (iSRO) | Chinois (officiel TW/CN) | Pinyin | Coréen (KSRO) | Zones citées côté ZH/KR |
|---|---|---|---|---|
| Tiger Girl | **虎女** — et non « 老虎女 » | hǔnǚ | **호녀** | 虎穴山 (mont du repaire aux tigres), 飞贼团山寨 (fort des bandits) ; KR : 호혈산 (« mont du sang-de-tigre ») |
| Cerberus | **克贝洛斯** / 贝克洛斯 | kèbèiluòsī | — | 神的庭院 (Garden of Gods), 无法者的山坡 (Desperado Hill), 黄昏的树林 (Forest of Dusk), 黎明的海岸 |
| Captain Ivy | **艾维船长** (TR 艾維船長) | àiwéi chuánzhǎng | — | 小亚细亚 (Asia Minor), 克利奥派特拉门 (Cleopatra's Gate), 邪恶之灵要塞 |
| Uruchi | **乌鲁齐** (TR 烏魯齊) — et non « 巫女 » | wūlǔqí | **우르치** | 塔里木盆地 (Tarim Basin), 死亡溪谷, 黑漠团巢穴 (Black Robber Den) ; KR : 타림분지 |
| Isyutaru | **冰神之女** (« Fille du dieu de glace ») | bīngshén zhī nǚ | **이슈타르** | 卡拉昆仑古代遗迹 (Ancient Remains), 绿洲 (oasis), 蜘蛛树林 (forêt aux araignées) ; KR : 카라코람 (lacs de glace) |
| Lord Yarkan | **路亚汗** | lùyàhàn | — | 塔克拉玛干 (Taklamakan), 尼雅遗址 (ruines de Niya) |
| Demon Shaitan | **撒旦** / 魔人撒旦 (« Satan ») | sādàn | — | 洛克山 (Roc Mountain), 心脏之峰 / 利爪之峰 / 翅膀之峰 (Heart/Claw/Wing Peak) |
| Roc | **洛克** (« roi des oiseaux ») | luòkè | **괴조로크** (King of the Roc) | 洛克山 ; donjon 洛克副本 (porte 支配者之门, lv 80-130, clé 血族钥匙) |
| BeakYung « Medusa » | **白蛇白灵** (TR 白蛇白靈) | báishé báilíng | **백령** (serpent blanc, légende 백사전설) | 秦始皇陵 B6 (Qin-Shi Tomb) |
| Selket / Neith / Anubis / Isis (Job Temple) | 赛尔基斯 / 奈特 / 阿努比斯 / 伊希斯 | — | — | 神殿 (Job Temple), 风暴沙漠 (Storm Desert) |

**Lore officiel ZH (nouveautés — recherche ZH 2026-10) :**
- **虎女 (Tiger Girl)** : esprit-tigresse régnant sur 虎穴山, tuée par le général 孙玄 (Sun Xuan) ; son âme posséda une jeune fille perdue. Elle apparaît les nuits de pleine lune montée sur un **tigre blanc géant**, inflige l'état **Zombie** et invoque 5-10 tigres blancs/noirs. Sources : [wiki DiGeam — boss](https://srowiki.digeam.com/boss%E6%80%AA%E7%89%A9%E4%BB%8B%E7%B4%B9) · [Sina 2014](http://games.sina.com.cn/o/n/2014-03-26/1126772919.shtml)
- **白蛇白灵 (BeakYung/Medusa)** : démon-serpent millénaire à forme humaine, emprisonné dans le mausolée de Qin Shi Huang après avoir été démasqué ; le lore TW le relie à la légende chinoise du **Serpent blanc** (白蛇传). **Compétences officielles** : 1) attaque magique AoE à distance, 2) 结界 (barrière) de ligature frontale, 3) **pétrification à 100 %** dans un rayon donné, 4) puissantes attaques. Sources : [DiGeam — ultimate boss](https://srowiki.digeam.com/%E7%B5%82%E6%A5%B5boss%E4%BB%8B%E7%B4%B9) · [iccgame B5/B6](http://silkroad.iccgame.com/content-667-84551.html)
- **洛克 (Roc)** : après sa mort apparaîtrait un boss 洛克心魔 (« démon intime du cœur de Roc ») plus fort que l'original (source dérivée mobile — lore non confirmé PC) ; variantes d'event 变种洛克 / 死亡骷髅洛克. Source : [iccgame — donjon Roc](https://silkroad.iccgame.com/content-667-58635.html)

**Mécanique originale des uniques (Corée, 2005)** — première description officielle ([GameMeca, 18/03/2005](https://www.gamemeca.com/view.php?gid=53792)) : spawn à un **endroit fixe**, respawn **aléatoire** après la mort, **annonce à tout le serveur** à l'apparition, XP répartie **par contribution**, items distribués **par ordre d'arrivée dans le groupe**. Les trois premiers uniques KR étaient **호녀** (Tiger Girl, 20+), **우르치** (Uruchi, 40+) et **이슈타르** (Isyutaru, 60+), respectivement dans 호혈산, 타림분지 et 카라코람.

> ⚠️ **Conflits non tranchés (sources ML)** : (1) la fiche boss du wiki DiGeam liste **Cerberus niveau 20** (vs **24** dans le client iSRO) ; (2) **Roc niveau 107** selon la presse KR ([괴조로크, Legend 8 KR — GameDonga](https://game.donga.com/39114)) et Wikipédia FR (« Roc 107, présentement invincible » — [source](https://fr.wikipedia.org/wiki/Silkroad_Online)), vs **100** dans les données client iSRO ; (3) niveau de BeakYung : voir section Qin-Shi Tomb.

---

## 🐯 Uniques Classiques (Chine/Europe)

### TIGER GIRL (Level 20) — le premier unique

```
ID: 1954 | Code: MOB_CH_TIGERWOMAN
HP: 598,720 | ATK: 42-51 | DEF phys: 18 | Gold: 586,560
```

**Carte:** Chine — zone de Jangan
**Zones de spawn:** Bandit Stronghold (Bijeokdan Mountain) et Tiger Mountain. Le point exact est aléatoire parmi plusieurs spots « bleus ».

**Mécanique:** AOE stun (roar). Cible classique des serveurs privés (spawn souvent réduit à 30-60 min).

**Stratégie:**
- Level 30+ en solo possible, 20+ en petite party
- Tank and spank, attention au stun AOE

---

### CERBERUS (Level 24)

```
ID: 5871 | Code: MOB_EU_KERBEROS
HP: 693,072 | ATK: 52-70 | DEF phys: 22 | Gold: 740,519
```

**Carte:** Europe — zone de Constantinople
**Zones de spawn:** Desperado Hill, Forest of Dusk, Garden of Gods

**Mécanique:** Attaques multiples (3 têtes). Monstres europe proches aggro.

**Stratégie:**
- Level 30+ recommandé, ranged pratique
- Après un crash serveur : spawn fixe à l'ouest de Desperado Hill

---

### CAPTAIN IVY (Level 30)

```
ID: 14778 | Code: MOB_AM_IVY
HP: 1,094,835 | ATK: 115-184 | DEF phys: 30 | Gold: 1,050,440
```

**Carte:** Asie Mineure
**Zones de spawn:** Amphitheater, Cleopatra's Gate, Haran's Tower

**Mécanique:** Attaques rapides de « pirate », forte ATK pour son level.

**Histoire (communauté TR, ✅ recherche TR 2026-10) :** Captain Ivy aurait d'abord été un **monstre de quête uniquement** sur iSRO, et un unique **uniquement sur kSRO**, avant d'être ajoutée officiellement comme unique (témoignage DonanımHaber — [RESEARCH_TR.md §2](ML_RESEARCH/RESEARCH_TR.md)).

**Stratégie:**
- Level 40+ en petit groupe, full party à level 30-35
- Après un crash serveur : spawn fixe à l'Amphitheater

---

### URUCHI (Level 40)

```
ID: 1982 | Code: MOB_OA_URUCHI
HP: 1,779,528 | ATK: 124-149 | DEF phys: 47 | Gold: 1,711,056
```

**Carte:** Asie Centrale — Tarim Basin (route Donwhang → Hotan)
**Zones de spawn:** large zone autour de la forteresse **Black Robber Den** et le long des routes du **Tarim Ferry**

**Mécanique:** Chef des Black Robbers. Bonne source de gold pour son level.

**Stratégie:**
- Level 50+ party (4-8 joueurs)
- Après un crash serveur : spawn fixe dans le Black Robber Den

---

### ISYUTARU (Level 60)

```
ID: 2002 | Code: MOB_KK_ISYUTARU
HP: 4,324,612 | ATK: 274-329 | DEF phys: 101 | Gold: 3,572,738
```

**Carte:** Karakoram (montagnes enneigées entre Hotan et Samarkand)
**Zones de spawn:** centre de la carte, zones de glace autour des **Ancient Remains**

**Mécanique:** Reine des glaces — attaques de froid/freeze. DEF élevée (101) pour son époque : le combat dure.

**Stratégie:**
- Full party 8 joueurs level 70+ recommandé
- 2 tanks + healer + DPS, attaques de feu privilégiées
- Après un crash serveur : spawn fixe sur la glace du Karakoram

---

### LORD YARKAN (Level 80)

```
ID: 3810 | Code: MOB_TK_BONELORD
HP: 9,353,045 | ATK: 559-1047 | DEF phys: 197 | Gold: 6,452,763
```

**Carte:** Taklamakan (désert, au-delà de Hotan)
**Zones de spawn:** ruines de **Niya Remains** et les zones de sable environnantes ; une « arène » de spawn existe dans le désert

**Mécanique:** Seigneur des os — multi-attaques, 9 skills répertoriés dans le client (3501-3509).

**Stratégie:**
- Full party 8 joueurs level 90+, coordination obligatoire
- Zarkan (= Yarkan) est très recherché pour ses drops 9D

---

### DEMON SHAITAN (Level 90)

```
ID: 3875 | Code: MOB_RM_TAHOMET
HP: 12,732,060 | ATK: 898-1528 | DEF phys: 268 | Gold: 8,671,974
```

**Carte:** Roc Mountain (chaîne de montagnes à l'ouest, accès par le Taklamakan)
**Zones de spawn:** **Heart Peak, Claw Peak, Wing Peak** (les 3 sommets)

**Mécanique:** Démon de feu — 10 skills répertoriés dans le client. Le plus dur des uniques « de terrain » classiques.

**Stratégie:**
- Full party 100+ avec tanks solides et heals continus
- Après un crash serveur : spawn fixe près de Claw Peak
- Beaucoup de potions — le fight est long

---

### 🗣️ Comportements rapportés par la communauté turque (Extraloob — ✅ recherche TR 2026-10)

| Unique | Particularités de combat rapportées |
|---|---|
| Tiger Girl | inflige **Zombie** (les potions réduisent les HP/MP) → prévoir des Pill |
| Cerberus | l'écran **s'assombrit** ; attaques Feu/Glace + **Fear** |
| Captain Ivy | **Stun / Knock-Down / Knock-Back** ; zone Cleopatra Gate |
| Uruchi | aucun statut particulier ; repérable via la touche V ; « le plus attendu » des uniques |
| Isyutaru | **Cold/Freeze** (Pill obligatoire) ; tuable **solo par un Wizard 62-68** (fire imbue + 1er skill cold) selon le guide |
| Lord Yarkan | « le père des uniques » ; spawn **entouré de tous les mobs 71+** alentour ; minimum 1 Cleric en party |
| Demon Shaitan | coups relativement faibles mais **élites dangereuses** autour ; entrer avec un Cleric |

Source : [Extraloob — Silkroad 1-100 unique bilgileri](https://www.extraloob.com/threads/silkroad-1-100-level-unique-hakkinda-bilgiler-234754) · [ML_RESEARCH/RESEARCH_TR.md](ML_RESEARCH/RESEARCH_TR.md)

---

## 🦅 Roc (Roc Mountain)

```
ID: 3877 | Code: MOB_RM_ROC
Level: 100 | HP: 1,451,891,045 (1.45 milliard!) | ATK: 2052-3283 | Gold: 1,157,701,880
```

**Le boss ultime de Roc Mountain.** L'oiseau géant (code `MOB_RM_ROC`, classé « party monster » dans le client). Son HP est ~100x celui de Demon Shaitan : c'est un raid de guilde, pas un unique de party 8.

**Stratégie:**
- Raid multi-parties, stuff SOSun minimum
- Mécanique de type « world boss » (long combat, respawn très espacé)

> ⚠️ Certains serveurs privés ne l'activent pas ou modifient son HP massivement.

---

## 🐍 Uniques du Qin-Shi Tomb (Medusa)

Le **Qin-Shi Tomb** (donjon « Jangan Cave », à l'est de Jangan) contient un système complet d'uniques, décrit en détail par le guide mmorpg.com (2009, iSRO) :

### Structure du donjon
| Étage | Levels des monstres | Particularité |
|-------|---------------------|---------------|
| B1-B2 | ~76-89 | Monstres terre/feu |
| B3 | ~90-95 | Tomb Snake Lady, Snake Generals (95) |
| B4 | ~96-99 | **Serin Gate** au centre (téléport vers B5) |
| B5 | 98-99 | Les 4 Gardiens |
| B6 | 92-99 | Chambres : Guardian / Man-Viper / Black Viper / White Viper |

### La Serin Gate (accès à B5/B6)
```
Ouverture: 4 fois par jour — 04h00, 10h00, 16h00, 22h00 (heure SRST)
Durée d'ouverture: 10 minutes
Position: centre du B4
```

### Les 4 Gardiens (B5, niveaux 98-99)
| Gardien | Animal | Position | Level | Nom ZH officiel (TW/CN) |
|---------|--------|----------|-------|--------------------------|
| JeonUk The Black Tortoise | Tortue noire | Nord | 98 | 玄武颛顼 (Xuánwǔ Zhuānxū) |
| YumJae The Red Hawk | Faucon rouge | Sud | 98 | 朱雀炎帝 (Zhūquè Yándì) — « Phénix vermillon » |
| TaeHo The Blue Dragon | Dragon bleu | Ouest | 99 | 青龙太皥 (Qīnglóng Tàihào) |
| SoHaow The White Tiger | Tigre blanc | Est | 99 (le plus dur) | 白虎小昊 (Báihǔ Xiǎohǎo) |

> ✅ **Résolu (recherche ZH 2026-10)** : les « 4 gardiens 98-99 » sont **nommés** dans les sources chinoises officielles — **玄武颛顼** (Tortue Noire/Zhuanxu), **白虎小昊** (Tigre Blanc/Xiaohao), **青龙太皥** (Dragon Azur/Taihao), **朱雀炎帝** (Phénix Vermillon/Yandi), plus un cinquième nom cité : **炎火客神武**. La correspondance exacte JeonUk↔玄武颛顼, TaeHo↔青龙太皥, SoHaow↔白虎小昊, YumJae↔朱雀炎帝 est **probable** (mêmes animaux cardinaux) mais non garantie mot pour mot. Protocole officiel TW : nettoyer les 4 mini-boss cardinaux → un **pré-boss central** apparaît (probablement Shinmoo) → ouvre l'accès au B6. Sources : [DiGeam](https://sro.digeam.com/intro/20200212) · [iccgame B5/B6](http://silkroad.iccgame.com/content-667-84551.html)

### SHINMOO, The Man of Flames (Level 100)
- Spawn dans le coin sud-ouest de la salle centrale du B5 **après la mort des 4 gardiens**
- Guerrier venu tuer Medusa — un des rares monstres à dropper du stuff level 100

### SOSO, The Black Viper (Level 100)
- Black Viper Chamber (B6) — drop du stuff 10D level 100
- **HP : 27 655 068** ; attaques physique **et** magique (✅ Résolu, recherche TR 2026-10 — [SroLobby — Qin-Shi Tomb B6](https://www.srolobby.com/konular/silkroad-online-qin-shi-tomb-b6-monsters-mob-hp-saldiri-tipleri.1780))

### BEAKYUNG THE WHITE VIPER « MEDUSA » (Level 105)
```
HP: 183,535,199 | Zone: White Viper Chamber (pièce nord du B6)
```
- Le boss final du tombeau, la « Snake Lady / Medusa » de la communauté
- **Structure B6 (recherche TR 2026-10)** : 4 salles, dont **2 avec uniques** — attaques physique et magique (SroLobby)
- ⚠️ **Conflit de niveau non tranché** : les sources TR (SroLobby + Extraloob) indiquent **Lv 100** ; le client iSRO (KB) et le wiki TW DiGeam indiquent **105**. Les HP sont identiques des deux côtés (183 535 199) — à trancher via le client
- **Accès rapporté (Extraloob)** : B5 = **5 uniques** à tuer, puis B6 = tuer **4 fois** l'unique 95 avant la salle Medusa — **divergent** du protocole « 4 gardiens + Shinmoo » du guide mmorpg.com (non tranché)
- **Skills officiels (TW DiGeam)** : AoE magique à distance, ligature frontale, **pétrification 100 %** en rayon, fortes attaques — voir la section [Noms multilingues](#-noms-multilingues-des-uniques-zh--kr)
- Sur iSRO son spawn est partiellement **codé en dur dans le GameServer** (source : guide elitepvpers « Fixing Medusa duplicated spawn »)
- Considérée comme le unique le plus difficile du jeu classique — top guilds uniquement

---

## 🏺 Uniques du Job Temple (Alexandrie)

Le **Job Temple** (donjon de job au sud d'Alexandrie, cap 120) contient 6+ uniques égyptiens. Accès selon l'**Activity Points (AP)** de votre union de job :

| Unique | Level | HP | Accès |
|--------|-------|-----|-------|
| **Apis** | 103 | 21,068,995 | Spawn conditionnel (après la mort d'Isis et Anubis) |
| **Selket** | 105 | 80,811,919 | Libre (aucun AP requis) |
| **Neith** | 106 | 83,077,174 | Libre (aucun AP requis) |
| **Anubis** | 107 | 150,486,799 | AP requis (zone Anubis/Isis) |
| **Isis** | 108 | 154,677,234 | AP requis (zone Anubis/Isis) |
| **Haroeris** | 109 | 440,747,010 | Zone profonde, haut AP d'union |
| **Seth** | 110 | 425,505,853 | Zone profonde, haut AP d'union |

**Monstres du temple (SD) :** Uneg (100), Weneg (101), Dark Khepri (101), Dark Scout (102), Blood Hyena (104).

**Drops signalés** (non vérifiés sur iSRO, confirmés sur serveurs type ExaySRO) : Immortal/Astral stones par les uniques, items de job, Iron Coins.

**Mécanique:** le temple est un PvP-job zone — tradez/portez la cape de job ; les unions se disputent les chambres.

> 🇰🇷 **Validation croisée (recherche KO2 2026-10)** : la table officielle coréenne du donjon 신전 (gamedata kSRO, EUC-KR décodée) liste les uniques **셀키스 105 · 네이트 106 · 아누비스 107 · 이시스 108 · 하로에리스 109 · 세이트 110** — niveaux **strictement identiques** aux données client iSRO ci-dessus (Selket 105, Neith 106, Anubis 107, Isis 108, Haroeris 109, Seth 110), plus Apis (아피스 103) et les élites secondaires 소페두/페트베/이무테스/에리스 (110). Source : [gamedata officielle kSRO — Egypt_Monster_Dungeon](https://krsilkroadcp.joymax.com/gamedata/Monster/iframe_monster/Egypt_Monster_Dungeon.html) · [ML_RESEARCH/RESEARCH_KO2_WORLD.md](ML_RESEARCH/RESEARCH_KO2_WORLD.md).

---

## 🇰🇷 Boss KSRO post-Medusa (2011-2023)

> ⚠️ **Périmètre** : chaîne de boss du **service coréen (KSRO, jamais fermé)** au-delà du contenu classique iSRO. **Ne pas fusionner avec les tableaux classiques ci-dessus** (les niveaux/HP classiques restent ceux du client iSRO). Rapport source : [ML_RESEARCH/RESEARCH_KO2_WORLD.md](ML_RESEARCH/RESEARCH_KO2_WORLD.md) · chronologie : [RESEARCH_KO2_CHRONO.md](ML_RESEARCH/RESEARCH_KO2_CHRONO.md).
>
> ⚠️ **HP indisponibles** : aucune source officielle (KR ou TW) ne publie les HP/niveaux de ces boss — le site officiel KR ne donne que noms/niveaux (pour les monstres) et conditions d'entrée (pour les donjons). ✅ **Partiellement résolu (recherche PS 2026-10)** : le tracker [m3stat](https://www.m3stat.com/uniques) (serveurs officiels iSRO) fournit désormais les HP de **Kidemonas 120 / Karkadann 123 / Merikh 125** (table ci-dessus) ; pour les boss Jupiter (111-118) et Bagdad/Shambhala (130+), l'**extraction du client** (`characterdata`/`_RefObjChar`) reste la seule voie.

### Chaîne chronologique post-Medusa

| Vague | Boss | Niveau | Lieu | Notes | Sources |
|---|---|---|---|---|---|
| **Job Temple** (2009, données officielles KR) | 셀키스/네이트/아누비스/이시스/하로에리스/세이트 (Selket, Neith, Anubis, Isis, Haroeris, Seth) | **105 → 110** | 신전 (Égypte) | identiques aux données iSRO (voir validation ci-dessus) | gamedata kSRO |
| **Temple de Jupiter** (Legend XII KR, 22/06/2011) | **Jupiter (朱庇特), Yuno (柳諾), Deus (帝厄斯)** | non publiés (~111-113, donjons 106/111/113) | 경배의 전당 (Hall of Worship) 중급/상급 | boss éponymes du temple ; documentés par vidéos de chasse | DiGeam S14, YouTube S31 |
| **Temple de Jupiter B** | **바알 (Baal), 바빌리온 (Babilion), Zielkiaxe (吉爾其厄斯)** | non publiés (~116-118, donjons 106/116/118) | 광신도의 은신처 (Zealots Hideout) | Baal = chef démoniaque de la Dimension Miroir ; Babilion = fondateur du culte (lore officiel KR) ; « Zielkiaxe » = orthographe EN, KR non trouvée | gamedata kSRO S1, DiGeam S15, YouTube S31 |
| **Unique de champ** (25/04/2012) | **키데모나스 (Kidemonas)** | **120** | 거울의 차원 (Dimension Miroir) | unique de champ ajouté par notice officielle KR (K24) — ✅ **HP officiel : 13 851 102** (tracker m3stat, recherche PS 2026-10) | board KR K24 · m3stat |
| **Bagdad** (mai 2014, cap 125) | **얍샤드 대장군** (Grand Général Yapshad) | non publié | 바그다드 (champ/donjon ?) | avatar officiel KR « 얍샤드 대장군 » (04/07/2013) + vidéos KR annotées 얍샤드 — ✅ **statut confirmé (recherche PS/AR 2026-10)** : présent dans les DB vSRO étendues sous le nom EN « **Abshad Force High General** » (ExaySRO) ; ⚠️ son **99 000 000 HP** chez ExaySRO = valeur **[CUSTOM serveur]**, pas officielle | board KR S6, YouTube S34 · [wiki ExaySRO](https://wiki.exaysro.com/books/guides/page/unique-locations) |
| **Bagdad souterrain** | **巨大魔神 (Grand Démon)** · **沙勒軍大將軍** (Général en chef, « armée de la vengeance » 萬眾復仇軍) | non publiés | 바그다드 지하 (121+) | super-boss du donjon (3×50 min/jour) | DiGeam S16 |
| **Repaire de Kailia** | **盜賊頭目凱麗亞 (Kailia, cheffe bandite)** | non publié | 카일리아의 은신처 (121+) | orthographe KR probable 카일리아 (non sourcée) | DiGeam S17 |
| **Raid Legend 23** (~16/05/2023) | **覺醒死亡駭骨 (« Squelette de Mort Éveillé »)** | non publié | 파멸의 성전 (Temple of Destruction, 125+) | apparaît après les 3 boss de raid ; **jamais plus d'1 final simultané** ; **disparaît au bout de 3 h** s'il n'est pas tué ; raid multi-groupes | DiGeam S20, srolobby S28 |
| **Shambhala** (27/03/2018) | boss des Ice/Fire Temple | 131-140 (niveaux de zone) | 샴발라 (accès NPC Mortifying Monk au Taklamakan) | **aucune source consultée ne les nomme** | Facebook iSRO S26 |

### ⚠️ Correction préventive : « Hebe / Arges / Kali / Rhea » ne sont PAS des uniques

> ✅ **Correction d'interprétation (recherche KO2 2026-10)** : les mentions « Lv.120 Hebe 21/04 », « Lv.130 Rhea/Nyx/Tyche », « Lv.140 Hebe/Kali/Arges… » des posts Facebook officiels iSRO désignent des **serveurs iSRO** (Hebe a été ouvert le 28/10/2025 ; Kali, Rhea, Tyche, Nyx, Eris, Arges… sont d'autres serveurs), **pas des boss**. Les caps 130/140 y ont été déployés **serveur par serveur**. Ces noms ne doivent jamais être ajoutés à une liste d'uniques. (Vérifié dans ce fichier : aucune occurrence erronée.) Source : [ML_RESEARCH/RESEARCH_KO2_WORLD.md §3](ML_RESEARCH/RESEARCH_KO2_WORLD.md) · [Reddit — serveur Hebe 2025](https://www.reddit.com/r/silkroadonline/comments/1oi5tqe/official_server_hebe_worth_a_shot/).

### 📏 Règles associées (donjons KSRO)

- **Timers** : instances Jupiter 2 h ; Bagdad/Kailia 3 entrées/jour de 50 min ; boss final du Temple of Destruction despawn 3 h.
- **Règle des 7 niveaux** : aucun drop si le joueur dépasse le monstre de 7 niveaux ou plus (anti-carry).
- Détail des donjons (accès, paliers 106/111/113/116/118/121/125, drops 12D→17D) : [13_ZONES_OVERVIEW.md — section KSRO](./13_ZONES_OVERVIEW.md).

---

## 🐉 Boss du Forgotten World (FGW)

Les donjons FGW (accessibles lvl 35-110 via les **Dimension Holes** ouverts par les **Envies** après destruction des **Dimension Pillars**) ont chacun un boss final. Code client : `MOB_GOD_*`.

### Donjons et brackets
| Donjon | Brackets de level | Boss | Nom chinois officiel (✅ recherche ZH 2026-10) |
|--------|-------------------|------|-----------------------------------------------|
| **Togui Village** | 35-50 / 51-60 / 61-70 | **Togui General** (A1 = lvl 39, HP 143,131) + Togui Elder | **血灵地狱-土鬼村** (« Enfer de sang - village des démons de terre ») |
| **Arab Flame Mountain** | 71-80 / 81-90 | Généraux de la montagne (noms exacts Ipne/Ipilla signalés par la communauté — *non vérifiés dans le client*) | **燃烧深渊-火焰山** (« Abysse ardente - montagne de feu ») ; séquence officielle TW : 妒鬼 → 熔天魔将 → 红孩儿 → **牛魔王** (= Flame Cow King, « Roi-Démon Bœuf » du Voyage en Occident) |
| **Green Abyss (Shipwreck)** | 91-100 | **Ghost Sereness** (A1 = lvl 93, HP 11,307,269, **Petrify!**) + uniques **Ghost Beast** (navires 1-2) et **Ghost Gultton** (dernier navire) | **永恒之海-船舶墓地** (« Mer éternelle - cimetière de navires ») ; boss final 女妖 (« la sirène ») |
| **Sea of Resentment (Shipwreck)** | 101-110 | **Ghost Sereness** version 101-110 (drops D11 Nova) | variante **冰海之心** (« cœur de la mer glacée ») |

> ✅ **Résolu (recherche ZH 2026-10)** : le nom chinois du système FGW est **遗忘世界 / 異次元洞** (« monde oublié / trou dimensionnel ») — le nom « 千里之坟 » parfois cité **n'existe pas** (requête exacte : zéro résultat jeu). Sources : [wiki DiGeam — Flame Mountain](https://srowiki.digeam.com/%E7%87%83%E7%87%92%E6%B7%B1%E6%B7%B5-%E7%81%B0%E5%B1%B1) · [iccgame — Shipwreck](https://silkroad.iccgame.com/content-667-49139.html)
>
> ✅ **Résolu (recherche TR 2026-10)** : noms des uniques du Green Abyss 91-100 — **Ghost Beast** (navires 1-2), **Ghost Gultton** (dernier navire), boss final **Ghost Serenes** (invoque 2 Gultton à bas HP ; en 3-4★ l'arène contient Serenes + Gultton + Beast). Source : [SroLobby — Shipwreck 91-100](https://www.srolobby.com/konular/silkroad-online-shipwreck-91-100-forgotten-world-map-rehberi.2251)

### Détails
- **Grades (✅ Résolu, recherche TR 2026-10)** : mobs 1★ = type **General**, les **Envies** = **Champion** ; 2★ = Champion/Elite ; 3★-4★ = monstres **Elite**. Party : 4 joueurs max en 1★-2★, **8 en 3★-4★** (série des 7 guides FGW turcs SroLobby)
- **Timer:** 2h dans le donjon, ré-entrée impossible pendant 3h ; les trous de dimension se rouvrent toutes les 30 min
- **Cooldown 3 h confirmé + règle des 7 niveaux (✅ recherche ZH 2026-10)** : pierre d'entrée (异次元洞石) réutilisable après 30 min, chaque pierre expire en 24 h ; **aucun drop si le joueur dépasse les monstres de 7 niveaux ou plus** (règle anti-carry officielle TW)
- **Ghost Sereness** : boss « Serenity Ghost » présent dans tous les donjons FGW, avec **pétrification** — clez/tuez les adds, purgez la pétrification
- **Récompenses de collection** (talisans → armes) :
  - Togui Village → arme **8D Seal of Sun**
  - Flame Mountain → arme **9D Seal of Sun**
  - Green Abyss → arme **10D Seal of Moon** (confirmé : récompense rendue à Hotan au Guild Manager **Musai** = 武萨伊, contre 第十套月亮印章 — [iccgame](https://silkroad.iccgame.com/content-667-49139.html))
  - Sea of Resentment → arme **11D Seal of Nova** (Power)
- Les talismans tombent dans les trésoreries et sur les boss ; les **Faded Beads** rapportent 200-20,000 SP
- ⚠️ **HP FGW divergents (non tranché)** : les guides TR (SroLobby) listent des HP **1000× supérieurs** aux valeurs client de la KB (ex. Togui General 1★ : 143 131 000 ; Ghost Serenes 1★ : 11 307 269 000) — probablement extraits de fichiers vSRO, à recouper avec `_RefObjCommon` ; niveaux et structure concordent en revanche

> 👉 Guide dédié : [29_FORGOTTEN_WORLD.md](./29_FORGOTTEN_WORLD.md)

---

## 🎭 Variantes Event (Strong/Evil/GM)

Les fichiers client contiennent des variantes d'uniques utilisées pour les events (souvent spawnées par GM) :

| Variante | Code client | Usage |
|----------|-------------|-------|
| **Strong Tiger Girl** | `MOB_CH_TIGERWOMAN_L2` | Event / serveur privé (boostée) |
| **Evil Tiger Girl** | `MOB_CH_TIGERWOMAN_L3` | Event / serveur privé (encore plus forte) |
| **GM's Tiger Girl / GM's Lord Yarkan** | IDs 7550-7564 | Tools GM |
| **Strong Ong** (lvl 34, HP 62,959 vs 2,099) | `MOB_OA_ONG` variant | Event monsters de zone |
| **MOB_EV_*** (ex. Young Bear `MOB_EV_BEAR_A_050`) | — | Events saisonniers |

**Attention :** « Cerberus Strong / Captain Ivy Strong » (ex-« Cerberus King ») cités dans d'anciens documents correspondent à ces variantes d'event, pas à des uniques officiels de terrain.

---

## ⏰ Spawn Times

### Règles vérifiées (iSRO / vSRO)

```
iSRO (officiel)      : spawn toutes les 3-5 heures à un point aléatoire ("blue spots")
vSRO (fichiers srv)  : timers par défaut PAR UNIQUE (Tab_RefNest) — voir tableau ✅ ci-dessous
StrategyWiki (2006)  : "spawn 1-2 fois par jour dans des zones spéciales" (ancien)
```

> ✅ **Résolu (recherche PS 2026-10) — timers de respawn par défaut de la vSRO** : les timers vivent dans **`Tab_RefNest.dwDelayTimeMin/Max`** (valeurs **en secondes**, résolues via `Tab_RefTactics.dwObjID`). Valeurs par défaut citées pour la vSRO (source : admin de serveur privé « aokaday » — fiabilité 3-4, à recouper par extraction d'une DB 1.188 propre) :
>
> | Unique | dwDelayTimeMin/Max | = défaut |
> |---|---|---|
> | Tiger Girl, Cerberus, Captain Ivy, Isyutaru, Lord Yarkan, Demon Shaitan | 3600×6 | **6 h** |
> | Uruchi | 3600×3 | **3 h** |
> | BeakYung « Medusa » | 3600×4 | **4 h** |
> | Evil Order (unique d'event) | 3600×2 | 2 h |
> | David / Jupiter (files BR) | 3600×4 | 4 h |
>
> Sources : [RaGEZONE — Dev: Unique Spawn Time](https://forum.ragezone.com/threads/dev-unique-spawn-time.820175) · [elitepvpers — How to change unique spawn time](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1773490-guide-how-change-unique-spawn-time.html) · rapport [ML_RESEARCH/RESEARCH_PS_FILES.md](ML_RESEARCH/RESEARCH_PS_FILES.md)
>
> 📌 **Affinement** : l'ancienne formulation « 4 h par défaut vSRO » est remplacée par les valeurs réelles par type d'unique (**6 h pour la plupart, 3 h Uruchi, 4 h Medusa/Jupiter**) ; l'unique re-spawn **à un point aléatoire** après un délai tiré entre min et max (d'où les fenêtres ressenties « 3-6 h » de l'iSRO).

- ⏱️ **Le timer démarre à la mort** de l'unique
- 🎲 **Le point de spawn est aléatoire** parmi plusieurs spots prédéfinis (points bleus des maps communautaires)
- 💥 **Après un crash/restart serveur**, les uniques repop aux **spots fixes** :
  - Tiger Girl → nord du Bandit Stronghold
  - Cerberus → ouest de Desperado Hill
  - Captain Ivy → Amphitheater
  - Uruchi → intérieur du Black Robber Den
  - Isyutaru → glace du Karakoram
  - Lord Yarkan → arène
  - Demon Shaitan → près de Claw Peak
- 🔗 Sur certains serveurs (ZsZC), Tiger Girl a une chance de spawn **après** la mort de Lord Yarkan ou Uruchi

### ⏱️ Timers par unique (communauté TR) — ✅ Résolu (recherche TR 2026-10)

Fenêtres de respawn rapportées **en minutes après la mort** ([Extraloob — guide uniques 1-100](https://www.extraloob.com/threads/silkroad-1-100-level-unique-hakkinda-bilgiler-234754)) :

| Unique | Fenêtre rapportée |
|---|---|
| Tiger Girl | **~210-390 min** (3h30 - 6h30) |
| Cerberus | **~200-400 min** |
| Captain Ivy | **~200-450 min** (parfois jusqu'à **700 min** !) |
| Uruchi | **~230-450 min** |

Règles génériques citées sur DonanımHaber ([thread « unique spawn saatleri »](https://forum.donanimhaber.com/unique-spawn-saatleri--14339078)) : « **3,5-5 h** » (rebellon) / « **minimum 2 h après le dernier kill, ensuite aléatoire** » (_aNaToLia_).

> ⚠️ **Conflit FR non tranché (recherche FR 2026-10)** : le guide FR « Les Uniques » (GMS Temple, 2010) décrit un spawn ressenti « **environ toutes les 4 heures** », tandis que [Wikipédia FR](https://fr.wikipedia.org/wiki/Silkroad_Online) indique « **environ toutes les 6 heures** » — aucune des deux n'est une donnée client. Les fenêtres TR ci-dessus (3h30 → 11h40 pour Ivy) englobent les deux estimations. Source : [RESEARCH_FR.md](ML_RESEARCH/RESEARCH_FR.md)
> ✅ **Partiellement résolu (recherche PS 2026-10)** : les défauts vSRO étant de **6 h pour la plupart des uniques** et de **4 h pour Medusa** (3 h Uruchi — tableau ci-dessus), les deux estimations FR correspondent vraisemblablement à des uniques différents — le conflit était un artefact de généralisation.

### Variations serveurs privés
- Low-rate (1x-5x) : souvent timers officiels
- Mid-rate : 1-4h
- High-rate (100x+) : 30-60 min, announcements globales
- Certains serveurs annoncent le spawn (« Unique [Tiger Girl] has spawned! »), d'autres non

### Timer spécial : Qin-Shi Tomb
- La **Serin Gate** (B4 → B5/B6) ouvre à heure **fixe** : 04h00 / 10h00 / 16h00 / 22h00, pendant 10 minutes seulement
- Medusa/BeakYung : spawn très espacé, partiellement hardcoded côté serveur

---

## 🗺️ Spawn Locations

### Résumé par carte (zones vérifiées rev6/elitepvpers)

| Unique | Carte | Zones de spawn |
|--------|-------|----------------|
| Tiger Girl | Chine | Bandit Stronghold (Bijeokdan Mtn), Tiger Mountain |
| Cerberus | Europe | Desperado Hill, Forest of Dusk, Garden of Gods |
| Captain Ivy | Asie Mineure | Amphitheater, Cleopatra's Gate, Haran's Tower |
| Uruchi | Tarim Basin | Black Robber Den, routes du Tarim Ferry |
| Isyutaru | Karakoram | centre de la carte (glace), Ancient Remains |
| Lord Yarkan | Taklamakan | Niya Remains + sables, arène |
| Demon Shaitan | Roc Mountain | Heart Peak, Claw Peak, Wing Peak |
| Roc | Roc Mountain | nid du Roc (non publié) |
| Medusa (BeakYung) | Qin-Shi Tomb | White Viper Chamber (nord du B6) |
| Job Temple uniques | Alexandrie sud | chambres du temple (instance de job) |

### Coordonnées précises (rapportées, non vérifiées)

> ⚠️ Les coordonnées exactes monde varient selon la version du client. Les valeurs ci-dessous proviennent de maps communautaires (xSROMap / SilkNoobz) — à valider avant implémentation :

- **Tiger Girl :** X ≈ 4853, Y ≈ 94 (Tiger Mountain) *(rapporté)*
- **Cerberus :** X ≈ -1552, Y ≈ -94 (Desperado Hill) *(rapporté)*
- **Captain Ivy :** X ≈ -6425, Y ≈ 2745 (Amphitheater) *(rapporté)*

**Outil recommandé :** [xSROMap](https://jellybitz.github.io/xSROMap/) — navigation par zones et coordonnées PosX/Y/Z.
Détails complets : [MONSTERS_SPAWN_LOCATIONS.md](./MONSTERS_SPAWN_LOCATIONS.md)

---

## 💎 Drop Lists

### ⚠️ Ce qui est vérifié vs ce qui ne l'est pas

**Vérifié :**
- Les tables de drop sont **côté serveur** (aucun dump public fiable pour iSRO)
- Le **gold yield** ci-dessus vient des données client (ex. Tiger Girl = 586,560)
- Uniques → équipement du degré correspondant à leur tranche de level (TG: 2D-3D … Shaitan: 9D, tomb: 10D, job temple: 11D+) *(consensus communautaire)*
- FGW : talismans (boss + trésoreries), armes de collection D8→D11, Faded Beads (SP)
- Job Temple : Immortal/Astral stones signalés sur les uniques *(serveurs privés, non vérifié iSRO)*

**Non vérifié (à ne pas présenter comme acquis) :**
- Les « taux » de SOS/SOM/SOSun par unique (variables par serveur)
- Les % de drop d'elixirs par unique

### Ordres de grandeur communautaires (serveurs type officiel)

| Type de drop | Chance rapportée |
|--------------|------------------|
| SOS (Seal of Star) | ~5-10% par kill d'unique |
| SOM (Seal of Moon) | ~1-3% |
| SOSun (Seal of Sun) | ~0.1-0.5% (légendaire) |

> Sur les serveurs boostés ces taux montent fortement (jusqu'à 30-50% SOS) — **toujours vérifier les rates de votre serveur**.

---

## ⚔️ Stratégies de Farm

### Preparation

**1. Gather Information:**
- Notez l'heure de mort de chaque unique (fenêtre de spawn = mort + 3-5h)
- Placez des scouts sur les différents spots possibles

**2. Assemble Party:**
- Full party 8 : 2 tanks (Warriors STR), 2 healers (Clerics), 4 DPS (Wizards/Nukers)
- Pour Roc/Medusa/Haroeris : raid multi-parties coordonné par guilde

**3. Stock Supplies:**
- HP/MP potions en grande quantité, res scrolls, speed scrolls, buffs

### Pendant le combat

- **Tanks:** tiennent l'aggro, skills défensifs
- **Healers:** spam heal, watch aggro, resurrection
- **DPS:** DPS soutenu, attention à l'aggro, pas de pull d'adds
- **Cas particuliers:** Ghost Sereness (purge pétrification), Isyutaru (résistance froid), Shaitan (résistance feu)

### Après le kill

- Le leader distribue, ou « free for all », ou roll — définissez AVANT le fight
- Les SOX se vendent très cher ([22_ECONOMY_GOLD.md](./22_ECONOMY_GOLD.md))

---

## 👥 Unique Hunting Parties

### Composition

**Standard (8 joueurs):**
- 2x Tanks (Warriors) — rotation d'aggro
- 2x Healers (Clerics)
- 4x DPS (Wizards, Rogues, Nukers)

**Minimum (4 joueurs):** 1 tank + 1 healer + 2 DPS — pour les uniques bas level uniquement

**Raid (Roc, Medusa, Haroeris/Seth):** 2-3 parties + shot-caller dédié

### Compétition

- **First hit / most damage** : la règle d'attribution dépend du serveur — renseignez-vous
- Le KS (kill stealing) est possible sur la plupart des serveurs anciens : le burst DPS peut « voler » le loot
- Camp les spots 30 min avant la fenêtre de spawn théorique

---

## ❓ FAQ

### Q: Quel est le vrai niveau de Tiger Girl ?
**R:** **20** (données client, ID 1954). Certaines anciennes pages disaient 18 : c'est une confusion avec d'anciennes versions.

### Q: « Lady Lyn » et « Beithy » existent-ils ?
**R:** **Pas dans les données client iSRO.** Ces noms (comme Bunny, Rooster, Monkey, Spider Queen) viennent d'inventions ou de serveurs privés. Les vrais « gros » uniques sont **Roc (100)**, **Medusa/BeakYung (105)** et les uniques du **Job Temple (103-110)**.

### Q: Les uniques spawn-ils à heure fixe ?
**R:** Non — X heures (3-5h sur iSRO) après leur mort, à un point aléatoire. Exceptions : la Serin Gate du Qin-Shi Tomb (heures fixes 04h/10h/16h/22h) et certains events.

### Q: Puis-je solo un unique ?
**R:** Tiger Girl/Cerberus/Ivy/Uruchi se solotent avec 10-20 levels de plus. Isyutaru, Yarkan, Shaitan nécessitent une party. Roc et Medusa = raids de guilde.

### Q: Pourquoi le HP de Roc est si énorme ?
**R:** 1.45 milliard — Roc est un « world boss / party monster » (code MOB_RM_ROC), pas un unique standard. Il est conçu pour des raids entiers.

### Q: Les drops sont-ils garantis ?
**R:** Non, c'est du RNG. Seul le gold est quasi garanti (montants ci-dessus issus du client).

### Q: Les uniques respawn-ils plus vite sur les serveurs privés ?
**R:** Généralement oui (30 min à 2h). Défauts vSRO : **6 h** (la plupart), **3 h** Uruchi, **4 h** Medusa (✅ recherche PS 2026-10).

---

## 🔗 Resources

### Données client / bases
- [Silkroad Online Database - Monsters](https://silkroadonline.wiki/monsters) — données extraites du client (IDs, HP, levels)
- [xSROMap](https://jellybitz.github.io/xSROMap/) — carte interactive (zones + coordonnées)

### Guides uniques
- [Elitepvpers - Guide Unique Spawns](https://www.elitepvpers.com/forum/sro-guides-templates/186742-guide-unique-spawns.html) — HP officiels + mécanique 3-5h
- [Elitepvpers - Unique Spawn Maps COMPLETE](https://www.elitepvpers.com/forum/silkroad-online/389926-silkroad-unique-spawn-maps-complete.html)
- [MMORPG.com - Unique Monsters Part 1](https://www.mmorpg.com/interviews/unique-monsters-part-one-2000116853) et [Part 2](https://www.mmorpg.com/guides/unique-monsters-part-two-2000116869) — Qin-Shi Tomb / Medusa en détail
- [Rev6 - Unique Spawn Points](https://rev6.org/en/post/silkroad-online-uniq-spawn-noktalari) — zones de spawn par unique
- [StrategyWiki - Silkroad Online/Bosses](https://strategywiki.org/wiki/Silkroad_Online/Bosses) — liste officielle des 7 uniques
- [ExaySRO Wiki - Unique Locations](https://wiki.exaysro.com/books/guides/page/unique-locations)
- [ExaySRO Forum - Job Temple Unique Guide](https://forum.exaysro.com/showthread.php?tid=3875)

### Forgotten World
- [Silkroad Online Wiki (Fandom) - Forgotten World](https://silkroadonline.fandom.com/wiki/Forgotten_World)
- [Guild Algarb - FGW Maps](https://guildalgarb.wordpress.com/games/sro/maps/forgotten-world)

### 🇰🇷 Boss KSRO post-classiques (recherche KO2 2026-10)
- [ML_RESEARCH/RESEARCH_KO2_WORLD.md](ML_RESEARCH/RESEARCH_KO2_WORLD.md) — rapport source (chaîne post-Medusa, Jupiter/Bagdad/Legend 23, correction Hebe/Kali/Rhea)
- [Gamedata officielle kSRO — monstres du Temple de Jupiter (45 mobs 111-116)](https://krsilkroadcp.joymax.com/gamedata/Monster/iframe_monster/Europe_Monster_Jupiter.html) · [monstres donjon Égypte (uniques KR)](https://krsilkroadcp.joymax.com/gamedata/Monster/iframe_monster/Egypt_Monster_Dungeon.html)
- Wiki officiel DiGeam (TW) : [敬拜的殿堂](https://srowiki.digeam.com/%E6%95%AC%E6%8B%9C%E7%9A%84%E6%AE%BF%E5%A0%82/) · [狂信徒的藏身處](https://srowiki.digeam.com/%E7%8B%82%E4%BF%A1%E5%BE%92%E7%9A%84%E8%97%8F%E8%BA%AB%E8%99%95/) · [破滅聖殿](https://srowiki.digeam.com/%E7%A0%B4%E6%BB%85%E8%81%96%E6%AE%BF/) (boss final 覺醒死亡駭骨)
- [Facebook officiel iSRO — Lv.140 Shambhala](https://www.facebook.com/officialsilkroad/posts/1502299075272015) · [Avatar 얍샤드 대장군 (board KR, 04/07/2013)](https://krsilkroadcp.joymax.com/news/news_view.asp?sID=2&Page=22&Num=4322&List_Ref=1501)

### ✅ Trackers officiels & fichiers serveur (recherche PS/AR 2026-10)
- [M3 Stats — Uniques](https://www.m3stat.com/uniques) — HP mesurés en jeu sur les serveurs officiels iSRO (Minerva, Palmyra…) : **Kidemonas 13 851 102 · Karkadann 15 023 129 · Merikh 18 372 504** + chaîne classique revalidée
- [stats.projecthax.com](https://stats.projecthax.com) — suivi live de 26 serveurs officiels (kills d'uniques, population)
- [RaGEZONE — Dev: Unique Spawn Time](https://forum.ragezone.com/threads/dev-unique-spawn-time.820175) — timers par défaut vSRO (Tab_RefNest) · [elitepvpers — How to change unique spawn time](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1773490-guide-how-change-unique-spawn-time.html)
- [Wiki ExaySRO — Unique Locations](https://wiki.exaysro.com/books/guides/page/unique-locations) — HP officiels republiés à l'identique + « Abshad Force High General » (99 M HP custom) = 얍샤드 대장군
- Rapports : [ML_RESEARCH/RESEARCH_PS_FILES.md](ML_RESEARCH/RESEARCH_PS_FILES.md) · [RESEARCH_PS_HIGHCAP.md](ML_RESEARCH/RESEARCH_PS_HIGHCAP.md) · [RESEARCH_AR_SERVERS.md](ML_RESEARCH/RESEARCH_AR_SERVERS.md) · [RESEARCH_AR_DEV.md](ML_RESEARCH/RESEARCH_AR_DEV.md) · voir [39_PRIVATE_SERVERS.md](39_PRIVATE_SERVERS.md)

---

*Dernière mise à jour: 2026-10-01 (recherche web exhaustive — données client vérifiées via silkroadonline.wiki, elitepvpers, rev6, mmorpg.com, strategywiki)*
*Fusion multilingue 2026-10 : rapports [ML_RESEARCH/RESEARCH_TR.md](ML_RESEARCH/RESEARCH_TR.md) · [RESEARCH_ZH.md](ML_RESEARCH/RESEARCH_ZH.md) · [RESEARCH_KO.md](ML_RESEARCH/RESEARCH_KO.md) · [RESEARCH_FR.md](ML_RESEARCH/RESEARCH_FR.md) · [RESEARCH_DE.md](ML_RESEARCH/RESEARCH_DE.md) (timers TR, noms ZH/KR, gardiens B5, skills Medusa, FGW) · rapports KO2 (section 🇰🇷 boss KSRO 2011-2023, validation Job Temple KR, correction Hebe/Kali/Rhea) · recherche PS/AR 2026-10 ([RESEARCH_PS_FILES.md](ML_RESEARCH/RESEARCH_PS_FILES.md), [RESEARCH_PS_HIGHCAP.md](ML_RESEARCH/RESEARCH_PS_HIGHCAP.md), [RESEARCH_AR_SERVERS.md](ML_RESEARCH/RESEARCH_AR_SERVERS.md), [RESEARCH_AR_DEV.md](ML_RESEARCH/RESEARCH_AR_DEV.md) : ✅ HP officiels 111+ via m3stat — Kidemonas 13 851 102 / Karkadann 15 023 129 / Merikh 18 372 504 ; ✅ timers vSRO par défaut 6 h/3 h/4 h (Tab_RefNest) ; ✅ confirmation 얍샤드 대장군 = « Abshad Force High General » de Bagdad)*
