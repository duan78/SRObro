# 🗺️ Rapport de recherche — Contenu MONDE haut-niveau du KSRO (zones, villes, donjons, uniques 100-140)

> **Mission** : documenter le contenu monde post-110 du service coréen de Silkroad Online (KSRO, jamais fermé) — nouvelles régions, villes, donjons, monstres et uniques du cap 120 au cap 140 — à partir de sources coréennes, complétées par le wiki officiel TW DiGeam (miroir du contenu récent d'origine KR) et les annonces officielles iSRO.
> **Date de la recherche** : 2026-10-01 · ~28 requêtes coréennes + ~10 EN/ZH croisées · **extraction directe des tables officielles du site krsilkroadcp.joymax.com** (gamedata/monstres, encodage EUC-KR décodé) · ~15 pages du wiki DiGeam.
> **Règle d'or respectée** : chaque donnée est accompagnée de son URL. Aucune donnée inventée. Les données issues de serveurs privés (vSRO) sont explicitement marquées ⚠️ PS.

---

## 📑 Sommaire

- [1. Index des sources](#1-index-des-sources)
- [2. La carte du monde coréenne : régions et paliers de niveau](#2-la-carte-du-monde-coréenne-régions-et-paliers-de-niveau)
- [3. Chronologie du contenu haut-niveau (2009 → 2023)](#3-chronologie-du-contenu-haut-niveau-2009--2023)
- [4. Zones post-110 (régions, accès, géographie)](#4-zones-post-110-régions-accès-géographie)
- [5. Villes nouvelles : Bagdad](#5-villes-nouvelles-bagdad)
- [6. Donjons 100-140 (structure, niveaux, mécaniques, récompenses)](#6-donjons-100-140-structure-niveaux-mécaniques-récompenses)
- [7. Uniques et boss 100-140 (tableau maître)](#7-uniques-et-boss-100-140-tableau-maître)
- [8. Monstres du Temple de Jupiter — table officielle coréenne (111-116)](#8-monstres-du-temple-de-jupiter--table-officielle-coréenne-111-116)
- [9. Gardiens du Qin-Shi Tomb — noms officiels coréens croisés](#9-gardiens-du-qin-shi-tomb--noms-officiels-coréens-croisés)
- [10. Égypte / Job Temple — données officielles coréennes (100-110)](#10-égypte--job-temple--données-officielles-coréennes-100-110)
- [11. Spots de leveling 110-140](#11-spots-de-leveling-110-140)
- [12. Forteresses (Fortress War) au cap 140](#12-forteresses-fortress-war-au-cap-140)
- [13. Glossaire coréen → français (lieux, donjons, boss)](#13-glossaire-coréen--français-lieux-donjons-boss)
- [14. Incertitudes et lacunes](#14-incertitudes-et-lacunes)
- [15. Recommandations pour SRObro](#15-recommandations-pour-srobro)

---

## 1️⃣ Index des sources

Fiabilité : 5 = officiel (Joymax/Wemade/DiGeam opérateur) · 4 = presse établie / wiki de référence · 3 = communauté concordante · 2 = forum/serveur privé · 1 = non vérifiable.

| # | Source | URL | Type | Fiabilité |
|---|--------|-----|------|-----------|
| S1 | **Site officiel kSRO — gamedata monstres, iframe Temple de Jupiter** (45 monstres lv 111-116, noms/types officiels KR) | https://krsilkroadcp.joymax.com/gamedata/Monster/iframe_monster/Europe_Monster_Jupiter.html | Officiel KR | **5** |
| S2 | **Site officiel kSRO — gamedata monstres par région** (iframes décodées : Égypte, Chine, Asie Mineure, etc.) | ex. https://krsilkroadcp.joymax.com/gamedata/Monster/iframe_monster/Egypt_Monster_Dungeon.html · `Egypt_Monster_Field.html` · `China_Monster_Dungeon.html` · `Taklamakan_Monster_Field.html` · `OasisEmpire_Monster_Field.html` | Officiel KR | **5** |
| S3 | **Site officiel kSRO — AreaNpc Égypte** (description régions, Job Temple 105+, Tombe du Pharaon 100+) | https://krsilkroadcp.joymax.com/gamedata/AreaNpc/iframe_AreaNpc/Egypt_Area.html | Officiel KR | **5** |
| S4 | **Site officiel kSRO — AreaNpc 유피테르 신전** (NPCs de la zone : 조사단/병사 실종, 바알 신도…) | https://krsilkroadcp.joymax.com/gamedata/AreaNpc/iframe_AreaNpc/Europe_Jupiter.html | Officiel KR | **5** |
| S5 | **Site officiel kSRO — board « 업데이트 » (83 pages d'archives, 2009→2026)** | https://krsilkroadcp.joymax.com/news/news_list.asp?sID=2 (pagination `&Page=1..83`) | Officiel KR | **5** |
| S6 | **Annonce officielle kSRO « 얍샤드 대장군 아바타 » — 2013-07-04** (contenu arabe actif en Corée) | https://krsilkroadcp.joymax.com/news/news_view.asp?sID=2&Page=22&Num=4322&List_Ref=1501 | Officiel KR | **5** |
| S7 | **GameMeca — Legend 12 « Heroes of Jupiter » (2011-06-22)** : cap 110→120, donjon 유피테르 신전, 1er donjon solo | https://www.gamemeca.com/view.php?gid=95887 | Presse KR | 4 |
| S8 | **NewsWire — même communiqué Legend 12** | https://www.newswire.co.kr/newsRead.php?no=553291 | Communiqué | 4 |
| S9 | **Bande-annonce officielle KR « Legend XII 유피테르 신전의 영웅들 »** | https://www.youtube.com/watch?v=DlFjFO9WYxA | Vidéo officielle | 4 |
| S10 | **GameAbout (2007-02-09) — 유피테르 신전 comme terrain de chasse ouest** (monstres 브론테스/폴리페모스/셀레네의 사자/세이렌) | http://www.gameabout.com/news/articleView.html?idxno=7840 | Presse KR | 4 |
| S11 | **namu.wiki « 실크로드 온라인 »** (403 direct — utilisé via extraits moteur) : régions + niveaux, 이슬람 121~130, 선계/헤븐/천축 미구현 | https://namu.wiki/w/실크로드%20온라인 | Wiki KR | 4 (indirect) |
| S12 | **en.namu.wiki** (miroir EN du même article) | https://en.namu.wiki/w/%EC%8B%A4%ED%81%AC%EB%A1%9C%EB%93%9C%20%EC%98%A8%EB%9D%BC%EC%9D%B8 | Wiki KR | 3 |
| S13 | **Wiki officiel DiGeam (TW) — 鏡之次元** (Dimension Miroir : lore Jupiter/Baal, accès 106+) | https://srowiki.digeam.com/%E9%8F%A1%E4%B9%8B%E6%AC%A1%E5%85%83/ | Opérateur TW | **5** |
| S14 | **Wiki DiGeam — 敬拜的殿堂** (Hall of Worship : 106/111/113, boss 朱庇特/柳諾/帝厄斯) | https://srowiki.digeam.com/%E6%95%AC%E6%8B%9C%E7%9A%84%E6%AE%BF%E5%A0%82/ | Opérateur TW | **5** |
| S15 | **Wiki DiGeam — 狂信徒的藏身處** (Zealots Hideout : 106/116/118, boss 巴比里恩/巴爾/吉爾其厄斯) | https://srowiki.digeam.com/%E7%8B%82%E4%BF%A1%E5%BE%92%E7%9A%84%E8%97%8F%E8%BA%AB%E8%99%95/ | Opérateur TW | **5** |
| S16 | **Wiki DiGeam — 巴格達(地下城)** (donjon Bagdad 121+) | https://srowiki.digeam.com/%E5%B7%B4%E6%A0%BC%E9%81%94%E5%9C%B0%E4%B8%8B%E5%9F%8E/ | Opérateur TW | **5** |
| S17 | **Wiki DiGeam — 凱麗亞的藏身處** (repaire de Kailia 121+) | https://srowiki.digeam.com/%E5%87%B1%E9%BA%97%E4%BA%9E%E7%9A%84%E8%97%8D%E8%BA%AB%E8%99%95/ | Opérateur TW | **5** |
| S18 | **Wiki DiGeam — 次元沙漠** (Désert dimensionnel 91+, NPC 哈辛) | https://srowiki.digeam.com/%E6%AC%A1%E5%85%83%E6%B2%99%E6%BC%A0/ | Opérateur TW | **5** |
| S19 | **Wiki DiGeam — 古墓副本** (Tombe ancienne 125+, clé, sets 16-17) | https://srowiki.digeam.com/%E5%8F%A4%E5%A2%93%E5%89%AF%E6%9C%AC/ | Opérateur TW | **5** |
| S20 | **Wiki DiGeam — 破滅聖殿** (Temple de la Ruine 125+, boss final 覺醒死亡駭骨) | https://srowiki.digeam.com/%E7%A0%B4%E6%BB%85%E8%81%96%E6%AE%BF/ | Opérateur TW | **5** |
| S21 | **Wiki DiGeam — 香巴拉** (Shambhala : 寒冰獄/火焰獄) | https://srowiki.digeam.com/%E9%A6%99%E5%B7%B4%E6%8B%89/ | Opérateur TW | **5** |
| S22 | **Wiki DiGeam — 神秘boss密室副本** (chambre des boss 121-130, 12-15套) | https://srowiki.digeam.com/%E7%A5%9E%E7%A7%98boss%E5%AF%86%E5%AE%A4%E5%89%AF%E6%9C%AC/ | Opérateur TW | **5** |
| S23 | **Wiki DiGeam — 地圖介紹/秦始皇陵** (structure B1-B6 du Qin-Shi Tomb) | https://srowiki.digeam.com/%E5%9C%B0%E5%9C%96%E4%BB%8B%E7%B4%B9%E7%8E%A9%E6%B3%95%E8%AA%AA%E6%98%8E | Opérateur TW | **5** |
| S24 | **Wiki DiGeam — 16套裝備** (set 16, page ajoutée 2024-08-06) | https://srowiki.digeam.com/16%E5%A5%97%E8%A3%9D%E5%82%99 | Opérateur TW | **5** |
| S25 | **Facebook officiel Silkroad (iSRO) — « New City: Baghdad »** (ville d'Arabie, Tigre) | https://www.facebook.com/officialsilkroad/photos/new-city-baghdad-baghdad-is-the-center-and-the-main-city-of-arabiait-is-characte/10152657798903549 | Officiel iSRO | **5** |
| S26 | **Facebook officiel Silkroad — Lv.140 (serveurs Hebe/Kali)** : Shambhala Shore, NPC Mortifying Monk (Taklamakan), Ice Temple 131-135, Fire Temple 136-140 | https://www.facebook.com/officialsilkroad/posts/1502299075272015 · https://www.facebook.com/officialsilkroad/photos/10157292937778549 | Officiel iSRO | **5** |
| S27 | **Facebook officiel Silkroad — Lv.130 (Rhea/Nyx/Tyche)** : nouvelle carte « Arabian Shore », skills 130, nouvelles quêtes | https://www.facebook.com/officialsilkroad/photos/10158125904163549 · https://www.facebook.com/officialsilkroad/photos/10158496279418549 · https://www.facebook.com/officialsilkroad/photos/10158730548568549 | Officiel iSRO | **5** |
| S28 | **SroLobby — Legend 23 Update (2023-07-17)** : Temple of Destruction + Secret Tomb, D16/17, Ultimate items, accès NPC Hotan/Baghdad | https://www.srolobby.com/konular/silkroad-online-legend-23-update.3038 | Communauté | 3 |
| S29 | **elitepvpers — Legend 23 : D16/17 et nouvelles zones** | https://www.elitepvpers.com/forum/silkroad-online/5137882-information-degree-16-degree-17-new-areas-coming-silkroad-online-legend-23-a.html | Forum EN | 2 |
| S30 | **elitepvpers — 140 cap update (global)** | https://www.elitepvpers.com/forum/silkroad-online/4454105-140-cap-update-silkroad-global.html | Forum EN | 2 |
| S31 | **YouTube gameplay (officiel-dérivé, client officiel)** : Jupiter Temple 111 (https://www.youtube.com/watch?v=v7yj8Hp15Wg), 113 (https://www.youtube.com/watch?v=133UrP4w8_A), Zealot 116 (https://www.youtube.com/watch?v=znI1tyCWjKM), **Zealots Hideout 118 — uniques « Zielkiaxe, Babilion, Baal »** (https://www.youtube.com/watch?v=hmpGhkEAucU), « 130 Cap – Zielkiaxe Dungeon (116Lv) » (https://www.youtube.com/watch?v=WIodGt7ald8), Yuno Unique (https://www.youtube.com/watch?v=_nqWzV0fxDI), Jupiter Unique (https://www.youtube.com/watch?v=zcB39bQ7CF4), SilkRoadR Shambhala Ice/Fire Temple CAP 140 (https://www.youtube.com/watch?v=qNCoqxx4KdE), Lower Secret Tomb – Legend XXII (https://www.youtube.com/watch?v=xy_5RQrZdl8) | YouTube | 3 |
| S32 | **Seidenkraft blog (2012-09-13) — quête « The Secret of The Mirror Dimension » (Jupiter Temple)** | https://seidenkraftblog.wordpress.com/2012/09/13/the-secret-of-the-mirror-dimension-jupiter-temple-quest | Blog joueur | 3 |
| S33 | **NomadicGamer (2011-08-02) — Legend 8 Mysterious Temple of Jupiter (iSRO)** | https://nomadicgamer.wordpress.com/2011/08/02/silkroad-online-introduces-legend-8-mysterious-temple-of-jupiter | Blog/presse | 3 |
| S34 | **Vidéos KR de joueurs KSRO — Bagdad** : « 실크로드 온라인 바그다드 앞에서~ » (https://www.youtube.com/watch?v=86Ovrrzh-RU), « Baghdad Dungeon 소환서 파티 사냥 » (https://www.youtube.com/watch?v=nqnq4dWYvso), « Baghdad unique mob » (https://www.youtube.com/watch?v=2nQb1x5yFiE), « Baghdad boss mob kill » (https://www.youtube.com/watch?v=BeA0LyG9NF8) | YouTube KR | 3 |
| S35 | **GameDonga — 호탄 요새 (Forteresse de Hotan, NPC 요새 사무관)** | https://game.donga.com/46984 | Presse KR | 4 |
| S36 | **ThisIsGame — 요새전 (Fortress War), 장안 요새** | https://www.thisisgame.com/articles/4896 | Presse KR | 4 |
| S37 | **Board officiel kSRO, Page 55 — « 비적단 요새 업데이트 예정 안내 »** (forteresse des bandits) | https://krsilkroadcp.joymax.com/news/news_list.asp?sID=2&Page=55 | Officiel KR | **5** |
| S38 | **YouTube — KSRO 2024 Fortress War (serveur 초원길 actif)** | https://www.youtube.com/watch?v=yZYW_nJlgUA | YouTube KR | 3 |
| S39 | ⚠️ **PS** — Extraloob « vsro Shambhala Ice Temple 140 lv map files » (fichiers carte pour privés) | https://www.extraloob.com/threads/vsro-shambhala-ice-temple-140-lv-new-map-310112 | vSRO | 2 |
| S40 | ⚠️ **PS** — RaGEZONE « Baghdad All Mobs & Skills (original work) » (403 au fetch — données issues des fichiers) | https://forum.ragezone.com/threads/baghdad-all-mobs-all-skill-original-work.902505 | vSRO | 2 |
| S41 | ⚠️ **PS** — Vidéos serveur ARGES « Arabia Coast » (reprise de noms officiels par un privé) | https://www.youtube.com/watch?v=yg5nM_OG1s4 · https://www.youtube.com/watch?v=Z78ILVKBxCw | PS | 2 |
| S42 | **Rev6 — cartes des points de spawn des uniques** | https://rev6.org/en/post/silkroad-online-uniq-spawn-noktalari | Communauté | 3 |
| S43 | **Reddit/elitepvpers — « Hebe » = nouveau serveur iSRO (2025-10-28)** | https://www.reddit.com/r/silkroadonline/comments/1oi5tqe/official_server_hebe_worth_a_shot/ · https://www.elitepvpers.com/forum/silkroad-online/5325950-silkroad-online-new-server-hebe.html | Forum EN | 2 |

---

## 2️⃣ 🌏 La carte du monde coréenne : régions et paliers de niveau

### 2.1 Liste namu.wiki (extraits moteur — S11) et site officiel (S1-S4)

| Région (KR) | Romanisation | Palier | Ville principale | Source |
|---|---|---|---|---|
| 중국 (당나라) | Chine (Tang) | 0~24 | 장안 (Jangan) | S11 |
| 동유럽 (동로마 제국) | Europe de l'Est (Byzance) | 1~24 | 콘스탄티노플 (Constantinople) | S11 |
| 소아시아 | Asie Mineure | 21~30 | — | S11 |
| 서역 | Régions de l'Ouest | 21~30 | — | S11 |
| 중앙아시아 | Asie centrale | 31~40 | — | S11 |
| 오아시스 왕국 | Royaume de l'Oasis | 31~60 | — (우르치 40, 이슈타르 60 : S2) | S11+S2 |
| 타클라마칸 | Taklamakan | 61~80 | — (로드 야르칸 80 : S2) | S11+S2 |
| 서아시아 | Asie de l'Ouest | 71~107 | — (samarcande/유피테르 : S10) | S11 |
| 이집트 | Égypte | 100~110 | 알렉산드리아 (Alexandrie) | S11+S3 |
| **이슬람** | **Islam (région arabe/Bagdad)** | **121~130** | **바그다드 (Bagdad)** | S11+S25 |
| 선계 / 헤븐 / 천축 | Monde des immortels / Ciel / Tianzhu | **미구현 (jamais implémentés)** | — | S11 |

> ⚠️ La liste namu **ne couvre pas** le 111-120 (거울 차원/유피테르 신전, cf. §4.1) ni le 131-140 (샴발라/Shambhala, cf. §4.4) — zones instanciées/dimensionnelles plutôt que « régions » de la carte principale. Le miroir namu EN (S12) précise en outre que les NPC voleurs/chasseurs post-Égypte ressemblent aux Chinois mais appartiennent à la **région arabe**.

### 2.2 Zones officielles du site kSRO (section 지역 & NPC)

Le site officiel (S1-S4) découpe le monde en : 중국 / 서부중국 / 중앙아시아 / 타클라마칸 / 오아시스왕국(아라비아) / 동유럽 / 소아시아 / 서아시아 / 남유럽 / 북아프리카 / 이집트 / 중동 / 서아시아… + une catégorie **LostWorld** (donjons dimensionnels — iframe « 토귀마을 », le village des Earth Ghosts du Forgotten World). **La gamedata officielle s'arrête au Temple de Jupiter (2011)** : aucun monstre 121+ n'y figure — le post-120 doit être documenté via DiGeam (TW) et les annonces iSRO.

---

## 3️⃣ 🗓️ Chronologie du contenu haut-niveau (2009 → 2023)

| Date | Événement (KR d'abord, iSRO ensuite) | Source |
|---|---|---|
| 2007-02-09 | 유피테르 신전 existe déjà comme **terrain de chasse ouest** (avant l'Europe ? cf. S10 qui le décrit vers Samarcand) avec 브론테스/폴리페모스/셀레네의 사자/세이렌 | S10 |
| 2009-09-09 | **Legend IX « 알렉산드리아의 영웅 »** (cap 105) — Égypte, Job Temple, Tombe du Pharaon | S5 (board P42 : Legend IX 알림, 2009) + RESEARCH_KO S14 |
| 2011-06-22 | **Legend 12 « Heroes of Jupiter » (KR)** — cap **110→120**, skills 120, **donjon instancié 유피테르 신전** (« 실크로드 최초 솔로 플레이가 가능한 던전 », difficulté ajustée solo/groupe) | S7, S8, S9 |
| 2011-08-02 | iSRO : **Legend VIII « Mysterious Temple of Jupiter »** (même contenu, ~6 semaines après la Corée) | S33 |
| ~2012-09 | Quêtes « Mirror Dimension » actives côté international (« The Secret of the Mirror Dimension ») | S32 |
| **2013-07-04** | Preuve d'activité arabe en Corée : avatar officiel **« 얍샤드 대장군 »** sur kSRO (l'ère Bagdad bat son plein côté KR) ; daily quest « 지니의 램프 » (Aladdin) au même moment (board P22) | S6, S5 |
| ~2014 (iSRO) | Annonce « **New City: Baghdad** — center and main city of Arabia », traversée par le **Tigre** (티그리스) | S25 |
| 2015-05-18 (iSRO Rhea, puis Tyche 05-24, Nyx 12-21) | **Cap 130** : nouvelle carte **« Arabian Shore »**, monstres et quêtes nouveaux, skills 130 | S27 |
| 2016-03-27 (iSRO global, puis par serveur : Eris 06-22…) | **Cap 140** : zone **« Shambhala Shore »** (NPC *Mortifying Monk* au Taklamakan), donjons **Ice Temple (131-135)** et **Fire Temple (136-140)** | S26, S30 |
| ~2022 | « Legend XXII » : **Lower Secret Tomb** documenté en vidéo | S31 |
| **2023-05-16** | **« Legend 23 »** (numérotation KR) : **파멸의 성전** (Temple of Destruction/Crusade of Ruin) + **비밀의 무덤** (Secret Tomb), degrés **16/17**, items **Ultimate** — critiqué comme recyclage (namu, RESEARCH_KO S29) | S28, S29, RESEARCH_KO |
| 2024-08-06 | Page « 16套裝備 » ajoutée au wiki TW (sets 16 documentés pour le service courant) | S24 |

> 💡 **Correction importante par rapport à RESEARCH_KO.md (S36)** : les mentions « Lv.120 Hebe 21/04, Arges 27/08 » et « Lv.140 … (Hebe only) » des posts Facebook officiels désignent des **serveurs iSRO** (Hebe, Kali, Rhea, Tyche, Nyx, Eris, Arges…) — **pas des uniques**. « Hebe » est un serveur ouvert le 2025-10-28 (S43). Les caps y ont été déployés serveur par serveur.

---

## 4️⃣ 🏞️ Zones post-110 (régions, accès, géographie)

### 4.1 거울 차원 (Dimension Miroir / 鏡之次元 / Mirror Dimension) — 106+ (monstres 111-116)

- **Nom coréen officiel** : 거울 차원 (attesté dans le lore officiel des monstres : « 차원의 틈새를 지키고 있으며 허락없이 거울 차원의 세계로 넘어온 이들을 처단 » — S1).
- **Accès** : portail situé **hors de la ville** (_TW : 「在城市外尋找鏡之次元傳送門」_) ; **niveau 106+** requis (S13). Le personnage est téléporté en haut de la carte et doit marcher jusqu'à la pierre de téléportation du Temple de Jupiter (S13).
- **Lore officiel (croisé KR/TW)** : Jupiter créa une copie du monde dans une fissure dimensionnelle ; les dieux l'abandonnèrent, le chef démoniaque **바알 (Baal)** en prit le contrôle ; le sorcier **바빌리온 (Babilion, TW 巴比里恩)** y fonda le culte de Baal et transforma ses fidèles en sujets d'expérimentation (S13). Le lore officiel KR cite aussi la **슬픔의 숲** (Forêt de la Tristesse) gardée par les 광신도 (S1).
- **Drops** : les monstres ne lâchent **pas de 12套 « normaux »** — uniquement des 12套 de rareté 史詩/傳奇/神器 (épique/légendaire/divin) ; le jeu n'a jamais eu de 12D « normal » (S13).
- **Monstres** : cf. §8 (45 monstres officiels lv 111-116 : statues-gardiennes, lions, griffons, minotaures, cultistes de Baal).

### 4.2 유피테르 신전 (Temple de Jupiter / 朱庇特神殿) — donjons 106-118

Voir §6.1 : c'est le **donjon** au cœur de la Dimension Miroir. Historique à deux étages : terrain de chasse ouvert dès 2007 (S10), puis donjon instancié en 2011 (Legend 12 KR, S7).

### 4.3 아라비아 / 이슬람 지역 + 바그다드 (région arabe, « Arabian Shore ») — 121-130

- **Nom régional coréen** : namu.wiki classe la zone **« 이슬람 » 121~130** (S11) ; le site FB officiel la décrit comme **Arabia**, avec **Bagdad** pour « centre et ville principale » (S25). Nom iSRO du patch cap 130 : **« Arabian Shore »** (S27). ⚠️ « Arabia Coast » (vidéos ARGES) est une appellation de serveur privé (S41).
- **Géographie** : cité arabe traversée par le **fleuve Tigre** (티그리스), architecture et culture arabes (S25). Région de désert/champs 121-130 (monstres non documentés côté officiel KR — la gamedata s'arrête en 2011).
- **Accès** : route commerciale ouest (post-Constantinople/Égypte) ; les donjons de l'ère Legend 23+ s'ouvrent via des **NPC à Hotan (화전 왕궁) et à Bagdad** (S20, S28).
- **Preuves d'activité côté KR** : avatar « 얍샤드 대장군 » (2013-07-04, S6) ; quête journalière « 지니의 램프 » (lampe du génie, S5 board P22) ; vidéos de joueurs KSRO à Bagdad et dans son donjon (2020-2021, S34).
- **Drops de zone** (CN/TW) : mobs de Bagdad → **12套「蒼穹」** et pièces 12 étoilées (RESEARCH_ZH, 九游) ; donjons 121+ → **13套** (S16, S17).

### 4.4 샴발라 / Shambhala Shore (香巴拉) — 131-140

- **Noms** : iSRO EN officiel **« Shambhala Shore »** (S26) ; TW **香巴拉**, divisé en **寒冰獄** (Prison/Enfer de Glace = Ice Temple) et **火焰獄** (Prison/Enfer de Feu = Fire Temple) (S21). **Nom coréen exact introuvable** dans les sources accessibles (translittération probable 샴발라 — non sourcée, cf. §14).
- **Accès** : NPC **« Mortifying Monk »** situé au **Taklamakan** (S26) — soit la même logique de portail dimensionnel que la Dimension Miroir.
- **Contenu** : nouvelle carte + nouveaux monstres (S26) ; deux donjons-temples : **Ice Temple 131-135**, **Fire Temple 136-140** (S26 ; vidéo SilkRoadR Ice/Fire CAP 140 : S31). Le Fire Temple fournit la **clé secrète** du Secret Tomb (S19, S28).
- ⚠️ **PS** : fichiers carte « Shambhala Ice Temple 140 lv » diffusés pour vSRO (S39) — preuve que le contenu existe dans les données du client, mais dump privé.

### 4.5 次元沙漠 (Désert dimensionnel) — 91+

- Zone de chasse d'accès **lv 91+**, entrée par le NPC **哈辛 (Hashin)** ; c'est le « reflet miroir de la 風暴沙漠 (désert de la Tempête) » peuplé de monstres (S18). Nom coréen exact inconnu (probable 차원 사막 — non sourcé).
- Intérêt : offre une zone de farm alternative 91+ aux personnages haut niveau (miroir low du contenu 100+).

### 4.6 Zones annoncées jamais sortées

namu.wiki liste **선계 (monde des immortels), 헤븐 (Heaven), 천축 (Tianzhu/Inde) : 미구현** — régions fantômes de la carte (S11). Les zones fantasy citées en 2004 (타클라마칸, 곤륜산, 히말라야, 천축국 — RESEARCH_KO S2) n'ont donc jamais toutes vu le jour.

---

## 5️⃣ 🏰 Villes nouvelles : Bagdad

| Élément | Donnée | Source |
|---|---|---|
| Nom KR | 바그다드 (attesté dès 2004 dans la liste des villes du lore : RESEARCH_KO S2) | RESEARCH_KO S2 |
| Statut | « Centre et ville principale de l'Arabie », **nouvelle ville** ajoutée à la carte (~2013-2014) | S25 |
| Géographie | Le **Tigre** coule au centre de la ville ; décor arabe | S25 |
| Rôle end-game | Point d'accès des donjons 121+ (地下城, repaire de Kailia) et, avec **Hotan (화전 왕궁)**, des contenus Legend 22/23 (Secret Tomb, Temple of Destruction via NPC 古代的預言家/預言家) | S16, S17, S20, S28 |
| Job Temple à Bagdad ? | **Non vérifié** — le Job Temple (神殿) officiel reste en Égypte (폭풍과 구름의 사막, S3). Aucune source trouvée pour un temple de métier à Bagdad | — |
| Vidéos KR | PvP aux portes ouest, chasse d'uniques et donjon « 소환서 » (scrolls d'invocation) | S34 |

---

## 6️⃣ 🏰 Donjons 100-140 (structure, niveaux, mécaniques, récompenses)

### 6.1 Tableau maître des donjons haut-niveau

| Donjon (KR si connu / TW / EN) | Niveaux d'entrée | Groupe / entrées / timer | Boss | Drops | Source |
|---|---|---|---|---|---|
| **신전 (Job Temple / 神殿)** | **105+** (tenue de métier obligatoire ; interdit avec monture/équipement de duel libre) | PVP + chasse simultanés | Uniques égyptiens 103-110 (cf. §7) | pièces monétaires échangeables contre sets | S3 (officiel KR) |
| **파라오의 무덤 (Tombe du Pharaon / 法老王陵墓)** | **100+** | 1 groupe de 2-8 ; **2 entrées/24 h** (3 difficultés) ; instance **2 h max** (téléport forcé à l'entrée au bout) ; accès difficulté moyenne = quête 폭주의 심장(5) | uniques par difficulté | pièces monétaires → sets | S3 (officiel KR) |
| **유피테르 신전 — 경배의 전당 (Hall of Worship / 敬拜的殿堂)** | **초급 106 (solo)** · **중급 111 (groupe)** · **상급 113 (groupe)** | 3 entrées/jour/difficulté ; **2 h** ; progression zone par zone (nettoyer chaque zone) ; le mode 초급 est un mode farm sans boss (respawn continu) | **朱庇特 (Jupiter) / 柳諾 (Yuno) / 帝厄斯 (Deus)** | **12套** épique/légendaire/divin | S14, S31 (vidéos 111/113) |
| **유피테르 신전 — 광신도의 은신처 (Zealots Hideout / 狂信徒的藏身處)** | **초급 106 (solo)** · **중급 116 (groupe)** · **상급 118 (groupe)** | 3 entrées/jour ; **2 h** ; mêmes règles de nettoyage | **바빌리온 (Babilion / 巴比里恩) / 바알 (Baal / 巴爾) / 吉爾其厄斯 (EN : Zielkiaxe)** | **12套** épique/légendaire/divin | S1 (nom KR officiel), S15, S31 (uniques EN « Zielkiaxe, Babilion, Baal ») |
| **바그다드 지하 (Bagdad Underground / 巴格達地下城)** | **121+** | **groupe obligatoire** ; **3 entrées/jour** ; **50 min max** ; progression **antihoraire**, zone par zone | **巨大魔神 (Grand Démon)** et **沙勒軍大將軍** (Général en chef de l'armée 萬眾復仇軍 « armée de la vengeance ») | **13套** épique/légendaire/divin (chance faible) | S16 |
| **카일리아의 은신처 (Repaire de Kailia / 凱麗亞的藏身處)** | **121+** | groupe ; **3 entrées/jour** ; **50 min** ; nettoyage zone par zone | **盜賊頭目凱麗亞** (chef bandite Kailia) | **13套** (chance faible) | S17 |
| **神密Boss密室 (Chambre des boss mystérieux / 神秘boss密室副本)** | boss **121-130** | **2-8 joueurs** ; session **30 min** ; jusqu'à **10 boss invoqués** (pierre de sceau) ; ticket d'entrée (boutique/événement) ; sortie par 異次元移動石 après avoir tout tué | boss réinvocables (non nommés) | sets **12-15** (armes/armures/accessoires, 3 raretés) | S22 |
| **破滅聖殿 (Temple de la Ruine / 파멸의 성전, EN Crusade of Ruin / Temple of Destruction)** | **125+** | Donjon de type **field** (non instancié) ; accès NPC **古代的預言家** à 和闐王宮 (palais de Hotan) **et à Bagdad** | tuer les **3 types de boss** → boss final **覺醒死亡駭骨** (« Squelette de Mort Éveillé ») ; jamais plus d'1 final simultané ; **disparaît après 3 h** s'il n'est pas tué | équipements **lv 17+** dont **Ultimate items**, matériaux rares | S20, S28 |
| **古墓 / 비밀의 무덤 (Secret Tomb / 古墓啟示錄)** | **125+** | **1-8 joueurs** (tous doivent avoir la clé) ; **30 min** ; **3 vagues** de monstres → boss ; pas de réentrée en solo ; **1 clé secrète par entrée** (obtenue au **火焰獄/Fire Temple de Shambhala**) | BOSS final (non nommé sur la page) | sets **16 et 17** (+ matériaux 15-17) | S19, S28, S31 (vidéo Legend XXII) |
| **Ice Temple (寒冰獄)** | **131-135** | donjon de Shambhala Shore | — (non documentés) | — | S26, S21 |
| **Fire Temple (火焰獄)** | **136-140** | donjon de Shambhala Shore ; **source de la clé du Secret Tomb** | — (non documentés) | — | S26, S19 |

### 6.2 Règles transverses documentées

- **Règle des 7 niveaux** (anti-carry) : *aucun drop* si le personnage dépasse le monstre de **7 niveaux ou plus** — confirmée pour la chambre des boss 121-130 (S22) et le FGW (RESEARCH_ZH).
- Les donjons Jupiter **초급 (106)** sont des **modes d'entraînement solo** : respawn continu, **aucun boss** (S14, S15) — c'est le « premier donjon solo du jeu » annoncé par Legend 12 (S7).
- Timer global d'instance Jupiter : 2 h ; Bagdad/Kailia : 50 min ; Secret Tomb/chambre des boss : 30 min (S14-S17, S19, S22).

---

## 7️⃣ 👹 Uniques et boss 100-140 (tableau maître)

> Lecture : Medusa/백사 백령 (105) restait le sommet en 2009-2010 ; voici tout ce qui est venu après, par vagues : Job Temple (103-110), Jupiter (111-118, donjons), Bagdad (121+), Temple de la Ruine (125+), Shambhala (131-140). **Aucune valeur de HP n'est publiée** pour ces boss sur aucune des sources consultées (officielles KR/TW comprises) — cf. §14.

| Boss (KR / TW / EN) | Niveau | Lieu | Type | Mécaniques / notes | Source |
|---|---|---|---|---|---|
| **하로에리스 (Haroeris)** | 109 | 신전 (Job Temple, Égypte) | unique de donjon | attaque magique (données officielles KR) | S2 |
| **아누비스 (Anubis / 阿努比斯)** | 107 | Job Temple | unique | « maître des enfers » (lore TW) | S2, RESEARCH_ZH |
| **이시스 (Isis / 伊希斯)** | 108 | Job Temple | unique | magique | S2 |
| **네이트 (Neith / 奈特)** | 106 | Job Temple | unique | physique | S2 |
| **셀키스 (Selket / 赛尔基斯)** | 105 | Job Temple | unique | physique | S2 |
| **세이트 (Seth), 소페두, 페트베, 이무테스, 에리스…** | 110 | Job Temple | élites/uniques secondaires | liste officielle KR du donjon | S2 |
| **백사 백령 (Medusa)** | 105 | 진시황릉 B6 | unique mondial | pétrification 100 % (cf. base) | S2, S23 |
| **朱庇特 (Jupiter)** | ~111-113 (non publié) | 경배의 전당 중급/상급 | boss de donjon | boss éponyme du temple | S14, S31 |
| **柳諾 (Yuno)** | non publié | 경배의 전당 | boss de donjon | documenté par vidéos de chasse | S14, S31 |
| **帝厄斯 (Deus)** | non publié | 경배의 전당 | boss de donjon | — | S14 |
| **바알 (Baal / 巴爾)** | ~116-118 (non publié) | 광신도의 은신처 중급/상급 | boss de donjon | chef démoniaque de la Dimension Miroir ; nom KR officiel (lore S1) | S1, S15, S31 |
| **바빌리온 (Babilion / 巴比里恩)** | non publié | 광신도의 은신처 | boss de donjon | sorcier fondateur du culte de Baal (lore officiel KR S1) | S1, S15, S31 |
| **吉爾其厄斯 (EN Zielkiaxe)** | non publié | 광신도의 은신처 | boss de donjon | orthographe KR non trouvée | S15, S31 |
| **얍샤드 대장군 ?** (Yapshad) | non publié | 바그다드 (champ/donjon ?) | unique probable | avatar officiel KR « 얍샤드 대장군 » (2013-07-04) + film KR « Baghdad boss mob » annoté 얍샤드 — **statut d'unique à confirmer** | S6, S34 |
| **巨大魔神 (Grand Démon)** | non publié | 바그다드 지하 | boss de donjon | — | S16 |
| **沙勒軍大將軍** | non publié | 바그다드 지하 | super-boss | mène « l'armée de la vengeance » 萬眾復仇軍 | S16 |
| **盜賊頭目凱麗亞 (Kailia)** | non publié | 카일리아의 은신처 | boss de donjon | cheffe bandite ; KR probable 카일리아 (non sourcé) | S17 |
| **覺醒死亡駭骨 (Squelette de Mort Éveillé)** | non publié | 파멸의 성전 | **raid boss final** | apparaît après les 3 boss ; disparaît en 3 h ; raid multi-groupes | S20, S28 |
| Boss du Fire/Ice Temple (Shambhala) | 131-140 | Shambhala | non documentés | aucune source consultée ne les nomme | S26 |
| Uniques d'event | — | divers | — | variantes d'event (변종洛克 etc., cf. RESEARCH_ZH) ; rien de nommé côté KR pour 120+ | RESEARCH_ZH |

> ⚠️ **Données vSRO/privés** : les fichiers diffusés par la communauté privée (RaGEZone S40, Extraloob S39) contiennent les stats complètes (HP/XP) des mobs Bagdad/Shambhala — **non consultables ici** (403) et à traiter comme extraction de client, pas comme publication officielle.

---

## 8️⃣ 🦁 Monstres du Temple de Jupiter — table officielle coréenne (111-116)

Source : **table officielle du site kSRO** (S1, EUC-KR décodé) — 45 monstres, colonnes : nom / Lv / type de défense / agressivité / type d'attaque. Tous 선공 (agressifs). Sélection complète par familles :

| Famille | Monstres (KR — Lv) |
|---|---|
| Statues-gardiennes du temple | 신전 수호병 111 · 신전 수호 기사 111 · 신전 경계병 111 · 신전 감시자 112 · 신전 파수병 112 · 신전 문지기 113 · 영혼 파괴자 112 · 영혼 감시자 113 · 영혼 절단자 113 · 불멸의 문지기 114 · 불멸의 감시자 115 · 불멸의 수호병 115 |
| Lions (석상 사자) | 어린 신전 사자 111 · 니케의 사자 111 · 아폴로의 사자 112 · 신전 사자 113 · 전투 사자 113 · 광포한 신전 사자 113 · 포효의 전투 사자 113 · 아세라의 사자 113 · 아낫의 사자 114 |
| Minotaures | 미노타우르스 113 · 고난의 미노타우르스 115 · 절망의 미노타우르스 115 · 파멸의 감시자 117 · 파멸의 절단자 118 |
| Griffons | 그리핀 수호자 112 (마법방어형) · 그리핀 정복자 112 · 그리핀 113 · 불멸의 그리핀 수호자 114 · 불멸의 그리핀 정복자 114 · 불의 수호자 114 · 물의 수호자 114 · 복수의 강철 발톱 114 · 경계의 강철 발톱 114 · 영혼의 수호자 115 · 보호의 강철 발톱 115 · 불멸의 그리핀 115 · 불멸의 뾰족부리 115 (chef de meute) |
| Cultistes de Baal (광신도) | 바알 광신도 116 (마법) · 바알 추종자 116 · 잔혹한 광신도 116 · 바알 선지자 116 · 광폭한 광신도 116 — « gardiens de la 슬픔의 숲, disciples de 바빌리온 » |

Lore clé (officiel) : les statues ont été **corrompues par le sortilège de 바빌리온** (« 바빌리온의 주술로 인해 악마의 성전을 지키는 하수인이 된 지금도… ») ; les 광신도 de 116 gardent la **슬픔의 숲** (Forêt de la Tristesse, zone extérieure). Les NPC de la zone (S4) racontent l'**expédition disparue** (실종 조사단/병사 : 에이브릴, 엘리아, 더스턴…) et les **바알 신도** repentis (디바 부교주…) — jusqu'au 병사 페르난도 « perdu dans le **광신도의 은신처** » : le nom coréen officiel du Zealots Hideout est donc attesté deux fois (S1+S4).

---

## 9️⃣ 🐉 Gardiens du Qin-Shi Tomb — noms officiels coréens croisés

La table officielle KR (S2, China_Monster_Dungeon) **confirme mot pour mot** les gardiens B5 documentés côté TW (RESEARCH_ZH) :

| Coréen officiel (Lv) | TW (RESEARCH_ZH) | Rôle |
|---|---|---|
| 현무 전욱 (98) | 玄武颛顼 | Tortue Noire / Zhuanxu |
| 주작 염제 (98) | 朱雀炎帝 | Phénix Vermillon / Yandi |
| 백호 소호 (99) | 白虎小昊 | Tigre Blanc / Xiaohao |
| 청룡 태호 (99) | 青龙太皥 | Dragon Azur / Taihao |
| 염화객 신무 (100) | 炎火客神武 | pré-fossatile central |
| 흑사 소소 (100) | — | élite B5-B6 |
| 사린천 (99) | — | élite |
| **백사 백령 (105)** | 白蛇白靈 | boss final B6 (« Medusa ») |

Structure officielle TW du tombeau (S23) : entrée **70+**, B1→B4 à pied/retour, **B5 accessible par créneaux de 10 min (11:00 / 17:00 / 21 :00)**, téléport aléatoire vers B6 après les 4 Rois Célestes + 炎火客神武 ; B6 = chambre du Serpent Blanc.

---

## 🔟 🐫 Égypte / Job Temple — données officielles coréennes (100-110)

**Description régionale officielle** (S3) : l'Égypte est au bout de la « route maritime » ; autour d'**Alexandrie** (Pharos, bibliothèque, temple d'Isis, Sérapéum) s'étendent le **델타필드** (Delta), le **왕가의 계곡** (Vallée des Rois, donjon 파라오의 무덤), la **폭풍과 구름의 사막** (désert des Tempêtes et Nuages, dominé par **세이트/Seth**, donjon 신전) et la **잊혀진 평원** (Plaine oubliée, repaire des pilleurs).

**Monstres de terrain (100-110)** — extraits officiels (S2) : 우네그 100 · 샌드 레이더 100 · 웨네그 101 · 타텐 101 · 다크 케프리 101 · 테넨 102 · 윈드 스파이더 102 · 데저트 버그 102 · 카멜 스파이더 103 · 다크 샌드맨 103 · 블러드 하이에나 104 · 우레우스 104 · 아케르 105 · 메헨 105 · 실러켄스 107 · 아크니쉬 107 · 실러켄 108 · 샌드웜 108 · 아케루 109 · 데빌웜 110.

**Monstres du donjon 신전 + 파라오의 무덤 (103-110)** — extraits officiels (S2) : 아피스 103 · 셀키온 105 · **셀키스 105** · 데빌 샌드맨 105 · 히케 106 · **네이트 106** · 공포/복수의 사제 106 · **하르사페스 107** · 하르메스 107 · **아누비스 107** · 징벌/수호/권능/치유의 사제 108 · **이시스 108** · 케이사스 버서커 108 · 질풍/화염의 사제 109 · 셉투 109 · **하로에리스 109** · 에리스 109 · 이무테스 110 · 탐욕/파괴의 망령 110 · 소페두 110 · 페트베 110 · **세이트 110**.

---

## 1️⃣1️⃣ 📈 Spots de leveling 110-140

**Aucun guide coréen moderne de leveling 110-140 n'a été trouvé** (le web KR actif sur kSRO est réduit à quelques chaînes YouTube — S34, S38). Les spots reconstructibles à partir des données officielles/TW :

| Palier | Zone / spot | Notes | Source |
|---|---|---|---|
| 91-100+ | **次元沙漠** (Désert dimensionnel, 91+) | farm alternatif en miroir du désert des Tempêtes | S18 |
| 100-105 | Égypte : 폭풍과 구름의 사막 / 델타 / 잊혀진 평원 | mobs 100-110 (S2) ; Job Temple 105+ pour les sets | S3, S2 |
| 106-110 | **거울 차원** (Dimension Miroir) terrain | mobs 111-116 ; drops 12套 raretés | S1, S13 |
| 106-113 | **경배의 전당 초급** (mode farm solo, respawn continu) | conçu pour l'entraînement — « 실크로드 최초 솔로 던전 » | S7, S14 |
| 111-118 | 경배의 전당 중급/상급 (111/113) puis 광신도의 은신처 중급/상급 (116/118) | en groupe ; boss 12套 | S14, S15 |
| 121-130 | **바그다드** champs + donjons (3×50 min/jour) ; chambre des boss 121-130 (30 min) ; désert arabe | 13套 ; vidéos KR de chasse party à Bagdad | S16, S22, S34 |
| 125+ | **파멸의 성전** (field) + 비밀의 무덤 | raid boss ; sets 16-17 | S20, S28 |
| 131-135 | **Ice Temple** (Shambhala) | accès NPC Mortifying Monk (Taklamakan) | S26 |
| 136-140 | **Fire Temple** (Shambhala) | source de la clé du Secret Tomb | S26, S19 |

---

## 1️⃣2️⃣ 🏰 Forteresses (Fortress War) au cap 140

| Forteresse | Preuve | Source |
|---|---|---|
| **장안 요새** (Jangan) | présentée lors de l'introduction du système 요새전 (« 도시 쟁탈전 ») | S36 |
| **호탄 요새** (Hotan) | NPC 요새 사무관 au palais de Hotan | S35 |
| **비적단 요새** (Bandit/Sud) | annonce officielle kSRO « 비적단 요새 업데이트 예정 안내 » | S37 |
| Forteresse à Bagdad ? | **Aucune source trouvée** — non vérifié | — |
| Activité 2024 | vidéo d'une Fortress War sur le serveur KR 초원길 | S38 |

---

## 1️⃣3️⃣ 📚 Glossaire coréen → français (lieux, donjons, boss)

| Coréen | Romanisation | Français / équivalent |
|---|---|---|
| 거울 차원 | geoul chawon | Dimension Miroir (TW 鏡之次元, EN Mirror Dimension) |
| 유피테르 신전 | Yupiteol sinjeon | Temple de Jupiter (zone + donjon) |
| 경배의 전당 | gyeongbae ui jeondang | Hall de Vénération/Worship (donjon Jupiter A) — *reconstruction sémantique TW→KR non officielle* |
| 광신도의 은신처 | gwangsindo ui eunsincheo | Repaire des Fanatiques / Zealots Hideout (donjon Jupiter B) — **attesté officiellement** (S1, S4) |
| 슬픔의 숲 | seulpeum ui sup | Forêt de la Tristesse (zone des cultistes, Dimension Miroir) |
| 바알 / 바알교 | Baal | Baal / culte de Baal |
| 바빌리온 | Babilion | sorcier Barbrion (TW 巴比里恩, EN Babilion) |
| 신전 | sinjeon | le Temple = Job Temple (Égypte) |
| 폭풍과 구름의 사막 | pokpung-gwa guleum ui samak | désert des Tempêtes et Nuages |
| 왕가의 계곡 / 델타필드 / 잊혀진 평원 | — | Vallée des Rois / champ du Delta / Plaine oubliée |
| 파라오의 무덤 | Parao ui mudeom | Tombe du Pharaon |
| 이슬람 지역 | Islam jiyeok | région islamique/arabe (121-130, namu) |
| 바그다드 | Baghdad | Bagdad (ville) |
| 바그다드 지하(城) | — | Bagdad souterrain (donjon, TW 巴格達地下城) |
| (카일리아의 은신처 ?) | Kailia | Repaire de Kailia (TW 凱麗亞的藏身處) — KR non sourcé |
| (파멸의 성전) | pammeol ui seongjeon | Temple de la Destruction/Ruine (Legend 23 ; TW 破滅聖殿 ; EN Crusade of Ruin) — **nom KR attesté via namu/RESEARCH_KO S29** |
| (비밀의 무덤) | bimil ui mudeom | Tombe secrète / Secret Tomb (TW 古墓副本/啟示錄) — **nom KR attesté via Legend 23 KR (RESEARCH_KO)** |
| (차원 사막 ?) | — | Désert dimensionnel (TW 次元沙漠) — KR non sourcé |
| (샴발라 ?) | — | Shambhala Shore (EN officiel S26 ; TW 香巴拉 : 寒冰獄 Ice / 火焰獄 Fire) — KR non sourcé |
| 얍샤드 대장군 | Yapsyad daejanggun | « Grand Général Yapshad » (avatar officiel 2013 ; boss probable de Bagdad) |
| 광신도 | gwangsin | fanatique/sectateur (type de mob) |
| 선전 수호병/사자/그리핀/미노타우르스 | — | gardes du temple / lions / griffons / minotaures (Jupiter) |
| 현무 전욱 · 백호 소호 · 청룡 태호 · 주작 염제 · 염화객 신무 | — | 4 gardiens B5 + pré-boss (Qin-Shi) |
| 셀키스 · 네이트 · 아누비스 · 이시스 · 하로에리스 · 세이트 | — | uniques du Job Temple |
| 비적단 요새 | — | forteresse des Bandits |
| 미구현 | miguyeon | non implémenté (선계/헤븐/천축) |

---

## 1️⃣4️⃣ ⚠️ Incertitudes et lacunes

1. **HP des boss post-110** : introuvables partout (site officiel KR = noms/niveaux/types seulement ; DiGeam = conditions d'entrée sans stats ; aucun wiki communautaire ne les publie). Les stats complètes n'existent que dans les fichiers client/serveur (vSRO — S39/S40) → extraction `characterdata.txt`/`_RefObjChar` reste LA voie.
2. **Noms coréens des zones 121+** : 이슬람 (région, namu S11) est le seul nom régional KR sourcé pour 121-130 ; **샴발라, 카일리아, 차원 사막, 경배의 전당 n'ont pas de source coréenne directe** (translittérations probables marquées comme telles au §13). Namu.wiki reste bloqué (403) — accès direct ou archive requis pour aller plus loin.
3. **Niveaux exacts des boss Jupiter/Bagdad/Shambhala** : non publiés (seuls les niveaux d'entrée des donjons le sont : 106/111/113/116/118/121/125/131-140).
4. **Statut exact de « 얍샤드 »** : l'avatar officiel (S6) prouve le personnage dans le lore KR 2013 ; le rattachement à un unique précis de Bagdad (champ vs donjon) reste à confirmer sur client.
5. **Dates KSRO précises** : Bagdad (~2013, déduit de S6) et Shambhala (post-2015, déduit de iSRO S26) n'ont pas de date de patch coréenne publiée ; le board officiel kSRO 2013-2020 n'a Gardé que des annonces d'items/maintenance.
6. **Monstres de terrain de Bagdad et de Shambhala** : aucune liste officielle (la gamedata kSRO s'arrête au Jupiter 2011) ; DiGeam ne publie pas non plus leurs tables de monstres (sections vides/imagées).
7. **Types champion/giant/party au cap 140** : aucune source officielle consultée ne distingue ces types (la table officielle ne code que 일반형/물리방어형/마법방어형 + 선공/비선공) — à extraire du client.
8. **Mapping TW→KR des noms de boss** (朱庇特/柳諾/帝厄斯/吉爾其厄斯/凱麗亞) : les orthographes coréennes exactes (유피테르? 유노? 데우스? …) ne sont attestées nulle part — marquées « non sourcé ».
9. **Forteresse de Bagdad** : aucune preuve d'existence.
10. **Années exactes des caps iSRO** (Rhea 05/18 = 2015 ? Tyche, Nyx, Eris, Hebe/Kali) : les posts FB officiels citent jour/mois sans année dans les extraits — années déduites, à confirmer sur les posts complets.

---

## 1️⃣5️⃣ 💡 Recommandations pour SRObro

1. **Étendre `13_ZONES_OVERVIEW.md`** avec les 4 grandes zones post-110 : 거울 차원 (106+, EN Mirror Dimension), région arabe/이슬람 + 바그다드 (121-130, EN Arabian Shore), Shambhala Shore (131-140, Ice/Fire Temple), 次元沙漠 (91+, dimensionnel) — en gardant TW (DiGeam) comme couche display faute de sources KR complètes.
2. **Créer une section « donjons 120+ »** dans `29_FORGOTTEN_WORLD.md` ou un fichier dédié : Bagdad Underground, Kailia, chambre des boss 121-130, Temple de la Ruine (파멸의 성전), Secret Tomb (비밀의 무덤) avec timers (50 min / 30 min / despawn 3 h) et règle des 7 niveaux.
3. **Ajouter aux uniques** (`15_UNIQUE_BOSSES.md`) : la chaîne post-Medusa — Job Temple (103-110, liste officielle KR §10) → Jupiter/Yuno/Deus/Baal/Babilion/Zielkiaxe → Boss Bagdad (얍샤드?, Grand Démon, Général, Kailia) → Squelette de Mort Éveillé (raid, 2023). Sans HP (lacune documentée).
4. **Corriger RESEARCH_KO.md (S36)** : « Hebe/Arges/Kali/Rhea… » = serveurs iSRO, pas des uniques ; les caps 130/140 y ont été déployés serveur par serveur.
5. **Importer la table officielle des 45 monstres du Temple de Jupiter** (noms KR + niveaux, §8) dans `MONSTERS_DATABASE.md` — c'est une donnée officielle de fiabilité 5.
6. **Dater le panier KR** : Legend 12 KR (2011-06-22) précède iSRO Legend VIII (2011-08-02) de 6 semaines — le motif « la Corée reçoit en premier » se confirme pour le post-110 ; l'utiliser pour ordonner la timeline.
7. **Ne pas importer** les noms/stats vSRO (RaGEzone/Extraloob) sans les marquer ⚠️ PS ; en revanche, planifier l'extraction des fichiers client pour HP/niveaux des boss 121-140 (seule voie restante).

---

## 📎 Annexe — pièces officielles kSRO citées (dump EUC-KR décodé, 2026-10-01)

- Monstres Jupiter (45) : https://krsilkroadcp.joymax.com/gamedata/Monster/iframe_monster/Europe_Monster_Jupiter.html
- Monstres Égypte terrain/donjon : https://krsilkroadcp.joymax.com/gamedata/Monster/iframe_monster/Egypt_Monster_Field.html · `Egypt_Monster_Dungeon.html`
- Monstres donjon Qin-Shi (gardiens 98-105) : https://krsilkroadcp.joymax.com/gamedata/Monster/iframe_monster/China_Monster_Dungeon.html
- Régions/NPC Égypte (Job Temple 105+, Pharaon 100+) : https://krsilkroadcp.joymax.com/gamedata/AreaNpc/iframe_AreaNpc/Egypt_Area.html
- NPC zone Jupiter (expédition disparue, cultistes) : https://krsilkroadcp.joymax.com/gamedata/AreaNpc/iframe_AreaNpc/Europe_Jupiter.html
- Avatar 얍샤드 대장군 (2013-07-04) : https://krsilkroadcp.joymax.com/news/news_view.asp?sID=2&Page=22&Num=4322&List_Ref=1501
- Board 업데이트 (83 pages, 2009→2026) : https://krsilkroadcp.joymax.com/news/news_list.asp?sID=2

*Rapport généré le 2026-10-01 — recherches WebSearch KO/EN/ZH + extraction directe du site officiel coréen (curl/iconv EUC-KR) + wiki officiel DiGeam (TW). Toutes les URLs citées ont été consultées ou renvoyées par le moteur au 2026-10-01. namu.wiki (403) n'est exploité que via extraits moteur. Aucune donnée inventée ; les translittérations non sourcées sont signalées.*
