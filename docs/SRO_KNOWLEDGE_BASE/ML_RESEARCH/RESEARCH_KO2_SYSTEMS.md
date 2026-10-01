# 🎮 Rapport de recherche KO-2 — Systèmes, skills et events du KSRO tardif (2012-2026)

> **Mission** : documenter en coréen les SYSTÈMES, SKILLS et EVENTS du service coréen de Silkroad Online (KSRO, toujours actif en 2026, opéré par Wemade Max/Joymax, serveur unique 초원길), au-delà de l'iSRO classique.
> **Date de la recherche** : 2026-10-01 · ~18 requêtes web (KO + EN) + **scraping direct du site officiel** `krsilkroadcp.joymax.com` (pages EUC-KR décodées via curl+iconv/perl) : ~100 notices officielles 2022-2026 dépouillées, 64 pages officielles de skills CH, calculateur de skills EU complet, item mall officiel, 5 notices d'événement/système intégrales.
> **Règle d'or respectée** : chaque donnée porte son URL. Rien d'inventé. Les sources vSRO/serveurs privés et mobiles sont marquées comme telles.
> **Complément** du rapport [`RESEARCH_KO.md`](RESEARCH_KO.md) (sourçage 2003-2012) — les ancres events 2026 y sont confirmées et développées ici.

---

## 📑 Sommaire

- [1. Index des sources](#1-️-index-des-sources)
- [2. Caps de niveau / masteries tardifs (120→140)](#2-📏-caps-de-niveau--masteries-tardifs-120140)
- [3. Skills CH tardifs — la base officielle coréenne (54 séries, 296 skills)](#3-🥋-skills-ch-tardifs--la-base-officielle-coréenne-54-séries-296-skills)
- [4. Skills EU — noms coréens officiels (269 skills)](#4-⚔️-skills-eu--noms-coréens-officiels-269-skills)
- [5. Systèmes nouveaux 2023-2025 : Reliques (유물) et combat auto (자동 전투)](#5-🌟-systèmes-nouveaux-2023-2025--reliques-유물-et-combat-auto-자동-전투)
- [6. 순환 성장 (reset de skills officiel)](#6-🔄-순환-성장-reset-de-skills-officiel)
- [7. Academy system (아카데미) et honor buffs (명예)](#7-🎓-academy-system-아카데미-et-honor-buffs-명예)
- [8. Battle Arena (배틀 아레나) et CTF](#8-🏟️-battle-arena-배틀-아레나-et-ctf)
- [9. Fellow pets (펠로우즈), devil spirits, invocation](#9-🐺-fellow-pets-펠로우즈-devil-spirits-invocation)
- [10. Job system tardif (job temple, coins, egy items)](#10-💼-job-system-tardif-job-temple-coins-egy-items)
- [11. Guildes / unions / forteresses tardives](#11-🏰-guildes--unions--forteresses-tardives)
- [12. Équipement tardif 15차-17차 (contexte systèmes)](#12-🛡️-équipement-tardif-15차17차-contexte-systèmes)
- [13. Events 2020-2026 — calendrier officiel complet](#13-🎉-events-2020-2026--calendrier-officiel-complet)
- [14. Monétisation actuelle (item mall officiel)](#14-💳-monétisation-actuelle-item-mall-offiel)
- [15. Glossaire coréen → français (systèmes tardifs)](#15-🇰🇷-glossaire-coréen--français-systèmes-tardifs)
- [16. Incertitudes non résolues](#16-⚠️-incertitudes-non-résolues)
- [17. Recommandations pour SRObro](#17-💡-recommandations-pour-srobro)

---

## 1️⃣ 📚 Index des sources

Fiabilité : **5** = officiel KSRO vérifié (site Joymax/Wemade Max décodé EUC-KR) · 4 = presse KR établie · 3 = communauté concordante · 2 = forum EN / serveur privé (miroir de systèmes officiels) · 1 = non vérifiable.

| # | Source | URL | Type | Fiab. |
|---|--------|-----|------|-------|
| A1 | **Site officiel KSRO — liste notices nouvelles** (notices 26.09.08 → 2022, 5 pages dépouillées à la main) | https://krsilkroadcp.joymax.com/news/news_list.asp (+ `?Page=2..5`) | Officiel | **5** |
| A2 | **Notice officielle — 유물 시스템 업데이트** (10/06/2025) : reliques, slot x3, lv 131+, 파멸의 원소 | https://krsilkroadcp.joymax.com/news/news_view.asp?sID=1&Page=2&Num=5043&List_Ref=1583 | Officiel | **5** |
| A3 | **Notice officielle — 자동 전투 시스템 업데이트** (14/04/2025) : auto-potion/skill/hunt, touches A et T | https://krsilkroadcp.joymax.com/news/news_view.asp?sID=1&Page=3&Num=5036&List_Ref=1577 | Officiel | **5** |
| A4 | **Notice officielle — 2026 풍선불기 축제** (08/09/2026) : mécanique complète + récompenses 15-17차 | https://krsilkroadcp.joymax.com/news/news_view.asp?sID=1&Page=1&Num=5138&List_Ref=1620 | Officiel | **5** |
| A5 | **Notice officielle — 2026 유령 사냥 이벤트** (11/08/2026) : cimetière, 2 équipes 8-40 j., pièces 수행자/병사/장군 | https://krsilkroadcp.joymax.com/news/news_view.asp?sID=1&Page=1&Num=5116&List_Ref=1611 | Officiel | **5** |
| A6 | **Notice officielle — 2026 세 개의 달 이벤트** (12/05/2026) : NPC 소옥, 마정석, fragments de lune, 속성석 15-17차 | https://krsilkroadcp.joymax.com/news/news_view.asp?sID=1&Page=1&Num=5104&List_Ref=1606 | Officiel | **5** |
| A7 | **Notice officielle — 2026년 병오년 신년 이벤트** (13/01/2026) : 복주머니, nourritures coréennes buffantes | https://krsilkroadcp.joymax.com/news/news_view.asp?sID=1&Page=2&Num=5087&List_Ref=1598 | Officiel | **5** |
| A8 | **Pages skills CH officielles** — 64 pages de séries (Bicheon x10, Heuksal x9, Pacheon x10, Cold x8, Lightning x7, Fire x8, Force x12) | https://krsilkroadcp.joymax.com/gamedata/skill/asiaskill.asp?Mastery=1&Category=1 (Cat. 1-3 = armes CH ; Mastery=2, Cat. 1-4 = 기공) → iframes `iframe_skill/Weapon_*_N.html`, `Force_*_N.html` | Officiel | **5** |
| A9 | **Calculateur de skills officiel (EU)** — 269 noms de skills EU codename↔KR | https://krsilkroadcp.joymax.com/gamedata/skill/skillCalculator.asp | Officiel | **5** |
| A10 | **Item mall officiel** — catégorie PREMIUM (골드타임 프리미엄 250필, changements de nom 250필) | https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?Shoptype1=PREMIUM&Shoptype2=PREMIUM | Officiel | **5** |
| A11 | **Item mall officiel** — CONSUME/SPECIAL (스킬회수약, Silver/Gold Time, resets 121~125, 실크로드 상자…) | https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?shoptype1=CONSUME&Shoptype2=SPECIAL | Officiel | **5** |
| A12 | **Item mall officiel** — PET/GROWTH : 12 fellows à 55필 | https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?Shoptype1=PET&Shoptype2=GROWTH | Officiel | **5** |
| A13 | **Page officielle 순환 성장** (reset de skills : 80 % des SP, 저주받은 심장 x10) | https://krsilkroadcp.joymax.com/gamesystem/etc/etc_cyclegrowth.asp | Officiel | **5** |
| A14 | **Page officielle 요새 (forteresse)** — 5 forteresses, taxe 20 %, siège bimensuel (données affichées datées 2017) | https://krsilkroadcp.joymax.com/gamesystem/rank/fortressState.asp | Officiel | **5** (contenu stale) |
| A15 | **Page events officielle (archive)** — 4 events 2014-2015 (liste figée) | https://krsilkroadcp.joymax.com/news/event_list.asp?sID=1 | Officiel | **5** |
| A16 | Notice officielle « 09/21 요새전 이후 발생한 문제 » (10/2024) — la guerre de forteresse tourne encore en 2024 | via A1 Page=3 (Num=5010) | Officiel | **5** |
| B1 | **GG게임** — « 배틀 아레나 » PVP (02/12/2009) : 4 modes, 64 joueurs, 14h/23h, 11차 sets | https://www.ggemguide.com/news_view.htm?uid=134213 | Presse KR | 4 |
| B2 | **namu.wiki « 실크로드 온라인 »** (403 direct — snippets moteur) : Legend 23 = 16-17차, upgrade 12→15차 ; cap mastery 330 (ancien) ; academy 교수/연수생 | https://namu.wiki/w/실크로드%20온라인 | Wiki KR | 3-4 (indirect) |
| B3 | **Miroir namu (onul.works)** (403) — snippet academy : « 교수(Guardian)… 연수생(Apprentice)… 졸업하면 연수생은 경험치 보너스, 교수는 속성 강화 보상 » | https://wiki.onul.works/w/실크로드_온라인 | Miroir | 3 |
| B4 | **Naver blog rkdwnsdud7** — coût réel d'une 15차 +15 (centaines de €, 인챈트 보호 cash) | https://blog.naver.com/rkdwnsdud7/221801990285 | Communauté | 3 |
| B5 | **아이템베이 (ItemBay)** — RMT actif serveur 초원길 : « 17차 레전드활 +7 » 6 M₩, « 17차 매직+5강 » 1,45 M₩ (163 annonces) | https://www.itembay.com (listing « 실크로드 초원길 » via recherche) | Marché RMT | 3 |
| B6 | **YouTube « KSRO »** — vidéo chasse officielle Wemade Max du 26.05.12 (« 이제 사냥이… ») | https://www.youtube.com/watch?v=TBafs8QuPYQ | Vidéo KR | 3 |
| B7 | **YouTube « KSRO Lv 111 15차 레전드 무기 강화 도전기 »** | https://www.youtube.com/watch?v=lZEoDZbS6Ho | Vidéo KR | 3 |
| C1 | **Fandom wiki (EN, iSRO)** — « current cap is 120, so you only have 360 total mastery levels » ; SP = 1 pt / 400 skill EXP | https://silkroadonline.fandom.com/wiki/Skills | Wiki EN | 3 (iSRO) |
| C2 | **Fdherg's blog** — Academy Guide (100k gold, 5→8 apprentis, lv60+) | https://fdherg.wordpress.com/2010/06/14/silkroad-online-academy-guide | Blog EN | 3 |
| C3 | **international-sro forum** — Academy (8 membres, guardian lv60+) | https://international-sro.forumotion.com/t800-academy | Forum EN | 2 |
| C4 | **Silkroad Forums — [Guide] Guardian Update** (honor ranks 1-50) | http://www.silkroadforums.com/viewtopic.php?f=5&t=46359 | Forum EN | 2 |
| C5 | **Origin Online forum — Honor Rank System** (diplômation = 50 % de l'XP du lv41 ; honor buff) | https://forum.playorigin.com/archive/index.php/t-3650.html | Forum EN | 2 |
| C6 | **Elitepvpers — fellow pet system** (évolution via Stable NPC + Potion of Evolution) | https://www.elitepvpers.com/forum/sro-guides-templates/1802274-guide-fellow-pet-system.html | Forum EN | 2-3 |
| C7 | **Silkroad Forums — Devil Spirit S-Grade** (+5 % HP/MP, +1 block ratio) | http://www.silkroadforums.com/viewtopic.php?f=2&t=118765 | Forum EN | 2-3 |
| C8 | **Seidenkraft — Devil Spirit Upgrade Tutorial** (+3~+5 : 25 % dmg/15 % speed ; +6 : 30 %) | https://seidenkraftblog.wordpress.com/2012/09/17/devil-spirit-upgrade-tutorial | Blog EN | 3 |
| C9 | **GamesIndustry.biz — Magic Pop** (coupon rouge → Devil Spirit S) | https://www.gamesindustry.biz/silkroad-online-magic-pop-card-game-launched | Presse EN | 4 |
| C10 | **Elitepvpers — info Legend 23** (D16/D17, 파멸의 성전/비밀의 무덤, « 파멸과 비밀 ») | https://www.elitepvpers.com/forum/silkroad-online/5137882-information-degree-16-degree-17-new-areas-coming-silkroad-online-legend-23-a.html | Forum EN | 2-3 |
| C11 | **YouTube Legend 23 Upper Secret Tomb** + **Temple of Destruction/Philotes** | https://www.youtube.com/watch?v=7hIGv7wd1rg · https://www.youtube.com/watch?v=AV7KW9tQQk0 | Vidéo | 3 |
| C12 | **ExaySRO wiki — Job Temple uniques** (coins or/argent/fer/cuivre + 12D) — **serveur privé, miroir** | https://wiki.exaysro.com/ · https://forum.exaysro.com/showthread.php?tid=3875 | Privé | 2 |
| C13 | **Reddit — coins & échange Jangan/Constantinople** — communauté | https://www.reddit.com/r/MMORPG/comments/j0nrsc/ | Forum EN | 2 |
| C14 | **Legion SRO guide (Scribd)** — Holy Water Temple : 5 uniques × 10 Arena Coins — **privé** | https://www.scribd.com/document/909870731/ | Privé | 2 |
| C15 | **MMORPG.com — Updated Fellow System** (rework fellows) | https://forums.mmorpg.com/discussion/335076/ | Forum EN | 2 |

> ⚠️ **Méthode** : le site officiel encode ses pages en **EUC-KR**, ce qui casse les fetchers classiques (mojibake). Toutes les données A1-A16 ont été extraites par `curl | iconv -f EUC-KR` / décodage perl `Encode` — titres et contenus cités **mot pour mot**. namu.wiki et son miroir restent bloqués (403) : snippets moteur uniquement (B2/B3).
> ⚠️ **Marquage mobile** : Silkroad Origin Mobile et Silkroad Again (실크로드 어게인) sont **d'autres jeux** (mobile) — hors périmètre de ce rapport, cités seulement pour ne pas les confondre.

---

## 2️⃣ 📏 Caps de niveau / masteries tardifs (120→140)

**Preuves officielles KSRO (2025-2026) :**

| Indice | Valeur | Source |
|---|---|---|
| Reset de stats vendu par tranches | **« 스탯 회수 (121~125) »** — donc cap ≥ 125 à l'époque de la rédaction de la page | A11 |
| Recette de craft des reliques | **« 131레벨 이상 캐릭터 레시피 자동 획득 »** + **« 착용 레벨 제한 131 »** — cap ≥ 131 en juin 2025 | A2 |
| Skills CH documentés | derniers livres à **mastery Lv 120**, et un cas à **Lv 122/124** (기담요결 박/제, 기혈대법) | A8 |
| iSRO (référence croisée) | cap 120 ⇒ **360 niveaux de mastery au total** (répartition libre) | C1 |

- **Lecture** : le service coréen a dépassé le cap 120. L'item mall atteste un palier **121-125** (cap intermédiaire ~125), puis la maj reliques de 2025 suppose des personnages **131+**. Le cap final est vraisemblablement **140** (comme iSRO, cf. ancres S36 de `RESEARCH_KO.md` : « Lv.140 Shambhala Shore »), mais **aucune page coréenne n'énonce « cap 140 » noir sur blanc** — à confirmer (cf. §16).
- **Cap total de mastery** : la version ancienne de namu.wiki disait « 마스터리 레벨 총합은 330으로 제한 » (B2, cf. rapport KO §2.5) ; le wiki EN dit 360 au cap 120 (C1). Pour le KSRO cap 125-140, **le total actuel (360 ? 420 ?) n'est publié nulle part** — non résolu.
- **SP** : aucune table coréenne tardive. Le seul chiffre officiel récent : le calculateur/descriptions EN « 1 SP par 400 skill EXP » (C1). Coûts SP des nouveaux rangs 96-124 : introuvables en ligne (extraction client `skilldata*.txt` reste la voie, cf. recommandations).

---

## 3️⃣ 🥋 Skills CH tardifs — la base officielle coréenne (64 séries, 296 skills)

**Source primaire A8** : le site officiel KSRO héberge une **base de skills complète** (pages EUC-KR, icônes incluses) : 64 pages de séries couvrant les 7 masteries CH. C'est la **liste officielle en service coréen actuel** — elle dépasse largement l'époque 90 de la base actuelle SRObro : chaque série possède désormais **5 à 7 livres**, les derniers à mastery 96-124.

### 3.1 Bicheon 비천검법 (10 séries)

| Série (계열) | Livres (mastery Lv → nom KR) |
|---|---|
| 필살검 (Smashing) | 5 비천일검 · 27 비천일섬 · 49 비천월아검 · 71 비천적성검 · 96 비천쌍린검 · **120 비천 절멸검** |
| 연환검 (Chain Sword) | 7 일식 환영 · 29 이식 혈벽/혈량 · 51 삼식 승천/패천 · 73 사식 벽류 · 100 오식 천군 · **120 육식 파천** |
| 방패술 (Shield) | 10 강성 · 32 태산 · 54 철벽 · 76 거성 · 98 철성 · **105 태양 방패술** |
| 검기 (Sword Ki — nuke épée) | 14 유혈검기 · 36 유혼 · 58 유귀 · 80 유마 · 102 유신 · **120 유황검기** |
| 비검 (Hidden Blade) | 19 비검개화 · 41 비검화망 · 63 비검무적 · 85 비검격류 · **112 비검천추** |
| 천살 (down attack) | 19 천살참혼결 · 45 참마결 · 68 잠귀결 · 90 수라결 · 110 참해결 · **120 천살잠룡결** |
| 이기어검 (Vol d'épée par le Ki) | 31 혈사 · 54 낙화 · 76 돌풍 · 98 난비 · **120 이기어검 만천** |
| 비천신공 (buff transformation) | 20 빙염 · 40 풍운 · 60 백귀 · 80 산해 · 100 건곤 · **120 일월 비천신공** |
| 강화술 (passif) | 10 호신강화 |
| 천산신갑 (passif armure) | 80 천산신갑 |

### 3.2 Heuksal 흑살창법 (9 séries)

| Série | Livres |
|---|---|
| 멸절결 (Pierce) | 5 낭아창 · 27 잔월창 · 49 유혼창 · 71 뇌응창 · 96 천운창 · **120 수라창** |
| 선풍창 (Storm) | 7 혈선풍 · 29 혈랑풍 · 51 혈사풍 · 73 혈마풍 · 98 혈망풍 · **105 혈섬풍** |
| 흑살창 (Front AoE) | 10 귀선창 · 32 파옥섬 · 54 쇄혼창 · 76 무풍아 · 98 사지창 · **116 천제창** |
| 이혼창 (stun) | 14 동 · 36 진 · 58 혼 · 80 제 · 102 격 · **120 벽** |
| 창귀술 (Round AoE) | 19 낙화 · 41 태자 · 63 신군 · 85 흑운 · 106 만암 · **120 용왕** |
| 파륨창 (Chain) | 24 비호 · 47 나찰/수라 · 69 명왕/교룡 · 91 주작 · **116 태상** |
| 비룡강하 (Flying Dragon) | 31 류 · 54 비 · 76 휘 · 98 섬 · **120 천** |
| 철삼공 (passif HP) | 10 철삼공 |
| 불멸패왕갑 (passif armure) | 80 불멸패왕갑 |

### 3.3 Pacheon 파천신궁 (10 séries)

| Série | Livres |
|---|---|
| 항마궁술 (tir de base) | 5 탄 · 27 파 · 49 쇄 · 71 격 · 96 멸 · 109 태 · **120 달** |
| 벽력전 (multi-flèches) | 7 이연시 · 29 삼연시 · 51 사연시 · 73 오연시 · 94 연봉시 · **116 연사황** |
| 매 소환 (invocation d'oiseaux) | 10 백매 · 32 흑매 · 54 청매 · 76 뇌조 · 104 한조 · **120 화조 소환** |
| 추풍섬 (Strong Bow) | 14 화류전 · 36 사령전 · 58 철혈전 · 80 채홍전 · 102 천마전 · **120 창룡전** |
| 파천 귀혼시 (AoE) | 19 귀혼시 · 41 혈영시 · 63 잠룡시 · 85 봉황시 · **112 건곤시** |
| 폭멸전 (explosion) | 25 투신 · 47 광마 · 69 마수 · 91 천괴 · **116 지옥** |
| 강궁시 (buff tir) | 31 심 · 54 광 · 76 저 · 98 의 · **120 추** |
| 어화심궁 (série tardive) | 25 비화 · 50 호접 · 75 순목 · **100 침뢰** |
| 심원대법 (passif MP) | 10 심원대법 |
| 용린갑 (passif armure) | 80 용린갑 |

### 3.4 기공 — Cold 한빙면공 (8 séries)

| Série | Livres |
|---|---|
| 빙기공타 (imbue) | 5 빙하결 · 25 빙옥결 · 45 빙해결 · 65 빙운결 · 98 빙기결 · **120 빙극결** |
| 빙혼강기 (Frost Guard) | 8 빙혼지공 · 28 빙혼신위 · 48 빙혼강기 · 68 빙혼강체 · **102 빙혼결기** |
| 빙공파 (Cold Wave) | 12 포박 · 32 결박 · 52 강박 · 72 밀박 · **106 혼박** |
| 빙벽 (Frost Wall) | 17 수정빙벽 · 37 천설 · 57 극한 · 77 만년 · **111 창극빙벽** |
| 한빙광야결 (Frost Nova) | 23 전풍 · 43 광림 · 63 한풍 · 83 빙야 · **114 극풍** |
| 설풍지결 (Snow Storm) | 30 일결 · 50 이결 · 70 삼결 · 90 사결 · **118 오결 빙폭** |
| **섭설지혼** (nouvelle série !) | 20 어 · 40 이 · 60 동 · 80 경 · 100 속 · **120 절** |
| 한빙지공 (passif MP) | 10 한빙지공 |

### 3.5 기공 — Lightning 풍뢰비공 (7 séries)

| Série | Livres |
|---|---|
| 뇌기공타 (imbue) | 5 뇌호결 · 25 뇌전결 · 45 뇌왕결 · 65 뇌룡결 · 98 뇌봉결 · **120 뇌참결** |
| 관통섬공 (Piercing Force) | 8 필 · 28 섬 · 48 쾌 · 68 기 · **102 극 관통섬공** |
| 경공 (Wind Walk) | 12 초상비 류 · 32 귀영신보 환영 · 52 초상비 쾌 · 72 귀영신보 비영 · **106 초상비 급** |
| 사자후 (Lion Shout) | 17 진명 · 37 낭천 · 57 광야 · 77 파공 · 98 참살 · **120 멸천 사자후** |
| 정신집중술 (Concentration) | 23 일성 · 43 이성 · 63 삼성 · 83 사성 · **114 오성** |
| 뇌전격 (nuke foudre) | 30 십랑결 · 50 백호결 · 70 천마결 · 90 만학결 · **116 현무결** |
| 뇌천지공 (passif MP) | 10 뇌천지공 |

### 3.6 기공 — Fire 화령신공 (8 séries)

| Série | Livres |
|---|---|
| 화기공타 (imbue) | 5 화류결 · 25 화극결 · 45 화독결 · 65 화혼결 · 98 화운결 · **120 화양결** |
| 화염 방패술 (Fire Shield) | 8 화조 · 28 염화 · 48 화왕 · **68 불사황** |
| 화염체 (Flame Body) | 12 지 · 32 강 · 52 극 · 72 고 · **106 일위** |
| 화염강기 (Fire Protection) | 17 화염지공 · 37 화염신위 · 57 화염강기 · 77 화염방후 · **110 화염무결** |
| 염화벽공 (Fire Wall) | 23 고탑 · 43 거산 · 63 요새 · 83 옹성 · **103 금강** |
| 폭염파 (Flame Wave) | 30 화시 · 43 열화 · 56 광폭 · 70 화탄 · 83 열섬 · 96 염광 · **118 멸탄 폭염파** |
| 발화술 (série tardive !) | 30 린 · 30 개운발화 · 80 경 · **100 일출발화** |
| 화마지공 (passif MP) | 10 화마지공 일성 |

### 3.7 기공 — Force 기혈대법 (12 séries ! l'arbre a explosé)

| Série | Livres |
|---|---|
| 내가 호흡법 (buff HP/MP) | 5 호흡법 · 25 기료술 · 45 요상술 · 65 원기술 · 98 기흡법 · **120 명상술** |
| 추궁과혈 (soins) | 8 제독 · 28 요체 · 48 내성 · 68 원기 · 88 정좌 · **108 결극** |
| 반해진경 (série tardive) | 30 순 · 60 결 · **90 청** |
| 제황신의경 (grand soin) | 12 의수 · 32 귀수 · 52 신수 · 72 묘수 · 94 만수 · **116 건수** |
| 부활심결 (résurrection) | 17 귀령술 · 37 귀명술 · 57 귀혼술 · **77 귀환술** |
| 치료술 (heal groupal) | 23 조화 · 43 동화 · 63 일체 · 83 본원 · **116 초월치료술** |
| 점혈대법 (série tardive) | 30 속 · 50 집 · 60 체 · 70 사 · 80 무 · 90 지 · **110 절** |
| 기혈신공 (passif) | 10 기혈신공 |
| **기담요결** (au-delà de 120 !) | **122 박 · 124 제** |
| 생사경 (série tardive) | 40 유혼술 · **90 강령술** |
| 활극천의경 (série tardive) | 40 청령기 · **90 건곤기** |
| 활인심결 (série tardive) | 10 동 · 20 정 · 60 패 · **70 순** |

> 💡 **Lecture SRObro** : le Force (기혈대법), arbre de 4-5 séries à l'époque classique, en compte **12** sur le service coréen actuel — dont des soins de zone (치료술), une vraie résurrection (부활심결) et des séries 121-124 (기담요결). Les passifs armure par mastery (천산신갑/불멸패왕갑/용린갑, mastery 80) et les transformations 비천신공 (jusqu'à 일월) sont également post-classiques. **Mapping codename client ↔ ces noms KR = travail restant** (les noms iSRO type « Bacchania » etc. ne correspondent pas mot à mot).

---

## 4️⃣ ⚔️ Skills EU — noms coréens officiels (269 skills)

**Source A9** : le calculateur officiel embarque la table `skillName["CODENAME"] = "nom coréen"` complète de la race européenne. Extraits représentatifs (tableau complet extractible) :

| Classe | Codename → nom KR (échantillon) |
|---|---|
| Warrior | WARRIOR_ONEHANDA_STRIKE_A **슬래쉬** · WARRIOR_ONEHANDA_CRITICAL_A **버서커** · WARRIOR_TWOHANDA_CHARGE_A **차지 스윙** · WARRIOR_DUALA_WHIRLWIND_B **크루셜 러쉬** · WARRIOR_FRENZYA_TOUNT_AREA_A **하울링 샤우트** |
| Rogue | ROG_STEALTHA_HIDING_A **스텔스** · ROG_BOWA_POWER_A **파워 샷** · ROG_DAGGERA_CHAIN_A **스피닝** · ROG_POISONA_FIELD_B **베인 트랩** · ROG_TRANSFORMA_MASK_A **몬스터 마스크** |
| Wizard | WIZARD_COLDA_POINT_A **아이스 볼트** · WIZARD_FIREA_POINT_B **메테오** · WIZARD_PSYCHICA_LIGHT_B **체인라이트닝** · WIZARD_EARTHA_AREA_B **어스 퀘이크** · WIZARD_SPIRITP_FIRE_A **파이어 스피릿** |
| Warlock | WARLOCK_DOTA_POISON_B **톡신 인베이젼** · WARLOCK_BLOODA_LIFEDRAIN_B **뱀파이어 키스** · WARLOCK_SOULA_MEZ_B **딥 슬럼버** · WARLOCK_RAZEA_STR_B **컴뱃 레비지** |
| Bard | BARD_BATTLAA_DAMAGE_B **위어드 코드 3** · BARD_DANCEA_WARRIOR_B **댄싱 오브 파이트** · BARD_RECOVERA_MANATRANS_B **마나 브리즈 6** · BARD_SPEEDUPA_MSPEED_B **스윙 마치** |
| Cleric | CLERIC_HEALA_GROUP_B **그룹 힐링 브리즈** · CLERIC_REBIRTHA_SPECIAL_A **리버스 오블레이션-부활** · CLERIC_BLESSA_STR_A **포스 블레싱** · CLERIC_SAINTA_ABNORMAL_A **홀리 워드** |

> 💡 Les skills EU portent en Corée des **transcriptions anglo-coréennes** (파이어 볼트 = Fire Bolt), à l'exception des séries numérotées (코드 0-4 du Bard). Le calculateur inclut aussi les niveaux max par skill (`skillRank`, jusqu'à 30 pour certains rangs de buff) — exploitable pour un extract complet.

---

## 5️⃣ 🌟 Systèmes nouveaux 2023-2025 : Reliques (유물) et combat auto (자동 전투)

### 5.1 Système de reliques (유물 시스템) — maj du 10/06/2025 (A2)

- **3 emplacements d'équipement dédiés** ajoutés à la fenêtre de personnage (유물 전용 슬롯 3칸).
- **Craft** : via l'onglet 제작 (fabrication), recette **유물 제작 레시피** — recette **auto-apprise au niveau 131+**. Fabrique **1 relique aléatoire parmi 18 types**.
- **Matériau** : **파멸의 원소** (« Élément de Ruine »), obtenu en tuant les monstres de **파멸의 성전** (Temple de la Destruction, zone Legend 23) ou en ouvrant la **실크로드 상자** (coffre de l'item mall, A11).
- **Port** : niveau **131 requis**.
- **Renforcement** : onglet alchimie (touche **Y**) → onglet 강화, consomme des 파멸의 원소. Paliers **+5 / +10 / +15 ⇒ « 옵션의 수치가 크게 증가 »** (saut massif de valeur d'options).
- **Risque** : échec ⇒ **la relique ET le matériau sont détruits**.
- **Exclusions explicites** (documente par ricochet la monétisation) : les reliques ne bénéficient **ni** du **프리미엄 골드타임** (premium gold time), **ni** de l'option avatar **행운** (chance), **ni** du buff serveur **« 강화확률 증가 10 % »** (probabilité de renforcement +10 %).
- Probabilités affichées via la page 정보 ou in-game (clic droit sur le 파멸의 원소).

### 5.2 Système de combat automatique (자동 전투 시스템) — maj du 15/04/2025 (A3)

- Objectif officiel : « 다소 지루할 수 있는 사냥 플레이의 도움을 위한 » — assister la chasse répétitive (concession au QoL moderne).
- Trois modules : **[자동 물약]** auto-potion (existant), **[자동 스킬]** auto-skill (on enregistre skills d'attaque/buffs avec l'arme ou le bouclier), **[자동 사냥]** auto-hunt (options configurables, lancé sur place).
- Accès : fenêtre d'actions (touche **A**) → clic droit sur l'icône auto-récupération, ou icône sous la minimappe (touche **T**) ; ON/OFF par icône.
- **Interdit en ville** pour auto-skill et auto-hunt.
- Complément 10/2025 : notice « 자동사냥 타기팅 지연 현상 개선 » (amélioration du ciblage de l'auto-chasse, A1 Page=2) — le système est toujours itéré.

> 💡 Autre système 2023 attesté : **통합우편함** (boîte mail intégrée, notice 2023, A1 Page=5).

---

## 6️⃣ 🔄 순환 성장 (reset de skills officiel)

Source A13 (page officielle « 기타 — 순환 성장 시스템 ») :

- **Accès** : quête auprès du **marchand de potions** de chaque ville, dès le **niveau 20** ; usages **illimités** (횟수 제약 없음).
- **Procédure** : parler au PNJ → « 스킬을 회수한다 » (récupérer un skill) → chasser **10 × 저주받은 심장** (Cœurs Maudits) → échanger contre **1 × 재생의 물약** (Potion de Régénération) → reset consomme la potion + de l'or.
- **Règles** : le reset suit l'ordre inverse d'apprentissage ; permet de basculer p. ex. de 검(épée) vers 활(arc). **80 % seulement des SP investis sont rendus.**
- Variante payante : **스킬회수약** (A11) — 15 silk les 5 : baisse d'un niveau de skill **ou de mastery** avec **100 % des SP rendus**.

---

## 7️⃣ 🎓 Academy system (아카데미) et honor buffs (명예)

**Nomenclature coréenne** (B3, miroir namu) : 아카데미 = academy ; le mentor est **교수** (litt. « professeur » = Guardian) ; les élèves sont **연수생** (stagiaires = Apprentices) ; la sortie est **졸업** (diplômation) — « 연수생이 졸업하면 연수생은 경험치 보너스를, 교수는 속성 강화 보상 » (l'apprenti reçoit un bonus d'XP, le professeur une récompense de renforcement d'attributs).

**Mécanique détaillée** (sources EN concordantes C2-C5, système global identique — chiffres d'époque 2010) :

| Élément | Valeur |
|---|---|
| Création | **100 000 pièces d'or**, par un joueur **niveau 60+** (le 교수) ; une seule académie par professeur |
| Effectif | **8 membres** max (dont le guardian ; les sources divergent sur 5 vs 8 apprentis) |
| Apprentis | niveaux **1 à 40** ; XP bonifiée en compagnie du professeur |
| Diplômation | l'apprenti reçoit **50 % de l'XP nécessaire pour atteindre le niveau 41** |
| Honor (명예) | le professeur gagne des **honor points** selon la note laissée par l'apprenti → **classement d'honneur 1 à 50** |
| Honor buff | buff d'attributs du professeur, croissant avec le rang d'honneur (farmer les diplômes = farm d'honor buff) |

> ⚠️ Aucune page officielle KSRO dédiée à l'academy n'a été trouvée (le système date de ~2009-2010 et les guides officiels actuels ne le couvrent pas) — les chiffres C2-C5 datent de l'époque et peuvent avoir été retouchés depuis. Le terme **명예 (honneur)** n'apparaît côté coréen que via l'academy ; pas de « honor point shop » séparé trouvé.

---

## 8️⃣ 🏟️ Battle Arena (배틀 아레나) et CTF

**Lancement coréen** (B1, GG게임 02/12/2009) :

- Contenu PVP d'équipe (« 팀 배틀 컨텐츠 ») ; **4 modes de matchmaking** : **랜덤 (aléatoire), 파티 (groupe), 길드 (guilde), 직업 (métier/job)**.
- Jusqu'à **64 participants** selon le mode ; inscription auprès du **PNJ Battle Arena** dans chaque village.
- **2 sessions/jour à 14h et 23h, de 20 minutes** ; événement de lancement récompensé en **sets 11차** et **인장 10차** (sceaux 10D) + bons Caribbean Bay.
- **Toujours actif en 2026** : la notice de l'event 유령 사냥 précise « 이벤트 기간 동안 **배틀 아레나 스케줄은 진행되지 않습니다** » (le calendrier de la Battle Arena est suspendu pendant l'événement) — preuve d'un emploi du temps récurrent d'arène (A5).
- **Monnaies d'arène coréennes** : l'event 유령 사냥 vend ses talismans contre **1 000 or OU 1 × 수행자의 주화 + 1 × 병사의 주화 + 1 × 장군의 주화** (« pièces du disciple / du soldat / du général », A5) — trio de pièces de récompense PVP, correspondant aux médailles d'arène (trainee/soldier/general).
- **CTF (깃발 뺏기)** : aucun document coréen officiel trouvé. Le mode existe dans les clients (références « Arena/CTF regions » côté code, et « So-Ok CTF » communautaire — C12/C13). À traiter comme **système global iSRO non documenté côté KR** (§16).
- **Arena Coins (아레나 코인)** : échange auprès de PNJ à **Jangan/Constantinople** (C13, communauté) ; farm documenté : Holy Water Temple (5 uniques/run × 10 AC, C14 — privé), uniques du Job Temple (C12 — privé). *Sources privées = miroirs du système officiel, à fiabilité 2.*

---

## 9️⃣ 🐺 Fellow pets (펠로우즈), devil spirits, invocation

### 9.1 Fellows — liste officielle coréenne (A12)

12 **펠로우즈** en vente à **55 silk** chacun, utilisables dès le **niveau 1**, **non-invocables simultanément** :

블러드 아머 다이노 (Blood Armor Dino) · 에이션트 트라브 베어 (Ancient Trab Bear) · 옐로우 스파클 오트리슈 (Yellow Sparkle Ostrich) · 루비노 피닉스 (Rubino Phoenix) · 라바 로어 하운드 (Lava Roar Hound) · 하프문 재규어 (Halfmoon Jaguar) · 실버 백 (Silverback) · 다크 그리핀 (Dark Griffin) · 크록스 (Crocs) · 나이트 팽 (Night Fang) · 골드 혼 (Gold Horn) · 소울 테일 (Soul Tail)

**Mécaniques** (C6/C15, communauté — le fellow est un système global post-2011) : le fellow **combat la cible désignée** et peut servir de **monture** ; les growth pets classiques **évoluent en fellows** auprès du **PNJ de l'écurie (Stable NPC)** avec une **Potion of Evolution (진화의 물약)** ; le fellow gagne des niveaux et des **buffs propres** (construction de buffs, transfert de niveau entre fellows documentés en vidéo).

### 9.2 Devil Spirits (데빌 스피릿)

| Grade | Obtention | Effets (base) | Sources |
|---|---|---|---|
| **B** | en jeu (Forgotten World/talismans) | identique au grade A | C7/C8, communauté |
| **A** | item mall (silk) | skill actif : **+20 % dégâts phys./mag., +10 % vitesse** (usage périodique ~20-30 min, durée ~10 min) | C8 |
| **S** | donjon (Dimension Hole) / **Magic Pop** coupon rouge (C9) | **+5 % HP/MP mini, +1 block ratio** (C7) ; renforcable **jusqu'à +15** (C12, privé) ; blues type « dégâts vs uniques +10 % » | C7/C9/C12 |
| Upgrade | alchimie (Elixir of Devil Spirit + poudres) | **chaque + : +1 % HP/MP** ; **+3~+5 ⇒ skill 25 % dégâts/15 % vitesse** ; **+6+ ⇒ 30 % dégâts** | C8 |

> Le **Magic Pop** (매직팝) coréen s'appelle **요술팡** : la **팡카드** (« carte Fang », 10 silk, A11) s'y insère — même gacha que la carte Magic Pop iSRO (C9). Grille de récompenses complète non publiée en ligne (§16).

### 9.3 Invocations CH tardives

La mastery Pacheon documente une série d'**invocation d'oiseaux** (매 소환 : 백매/흑매/청매/뇌조/한조/화조, A8 §3.3) — vérifier côté client si ce sont de vraies invocations ou des tirs à effet (série « Hawk » iSRO).

---

## 🔟 💼 Job system tardif (job temple, coins, egy items)

- **Rien d'officiel coréen trouvé** sur une refonte du job system post-Legend VII KR : les pages officielles guide (`Basic_TradeJobConflicts.asp`) sont vides (JS) et aucune notice 2022-2026 ne mentionne de revamp trader/hunter/thief (A1). Les bases restent celles de `RESEARCH_KO.md` (Trade System 2 de 2006, 현상범 > 2 000 penalty points).
- **Job Temple (잡템플)** : documenté uniquement par des serveurs privés (C12) — donjon « le plus important » où les **uniques droppent des pièces or/argent/fer/cuivre** + items 12D garantis ; il fournit les **Special/Advanced items** (egy). Système hérité de l'officiel global (iSRO l'a eu en Legend IX+), mais **aucune source KR officielle ne le décrit** — marqué miroir.
- **Job coins/arena coins** : échange PNJ Jangan/Constantinople (C13) ; utilisation coréenne attestée indirectement : les pièces 수행자/병사/장군의 주화 servent de monnaie d'event (A5).
- **Tickets de job (잡 티켓)** : craft via recettes, documenté en vidéo communautaire (C13 réf.) — non vérifié officiel.

---

## 1️⃣1️⃣ 🏰 Guildes / unions / forteresses tardives

- **Page officielle des forteresses** (A14) : le sélecteur liste **5 forteresses** — **장안 (Jangan), 비잔틴 (Byzance), 로도스 (Rhodes), 황하 (Fleuve Jaune), 베니스 (Venise)** ; affichage « **현재 세율은 20 %** » (taxe de guilde propriétaire = 20 %) et cycles de siège **bimensuels** (ex. affiché : 07/02 → 21/02, bataille à 20h). ⚠️ Les données affichées datent de **février 2017** (page non maintenue), mais la **Fortress War tourne toujours** : notice d'incident « 09/21 요새전 이후… » en octobre 2024 (A16) et « 게임 버프 관련 비정상 현상 » en mars 2026 (A1).
- Pas de nouvelle forteresse trouvée dans les notices 2022-2026 ; pas de changement guilde/union documenté côté officiel (les items 길드명 변경권 existent à l'item mall, A10).
- **Union de serveurs/communauté** : boîte mail intégrée (통합우편함, 2023, A1) ; service « 명의 변경 » de comptes de personnes décédées (고인 계정 명의 변경 서비스, 02/2026, A1) — particularité du service coréen moderne.

---

## 1️⃣2️⃣ 🛡️ Équipement tardif 15차-17차 (contexte systèmes)

- **Legend 23 « 파멸과 비밀 »** (~16/05/2023 coréen, cf. `RESEARCH_KO.md` §2.3) : ajoute **16차 et 17차** ; auparavant, les degrés montaient par **upgrade de renforcement** (12→13→14→15차 à +N donné) (B2, namu snippet : « 과거에는 12-13-14-15차 장비를 일정 강화 수치에 도달하면 상위 차수로 업그레이드하는 방식 »).
- Zones associées : **파멸의 성전** (Temple of Destruction, boss **필레테스/Philotes**) et **비밀의 무덤** (Secret Tomb, étages haut/bas) (C10/C11).
- **Économie réelle** (B5, ItemBay, serveur 초원길, 10/2026) : « 17차 레전드활 +7 속성풀작 » ≈ **6 000 000 ₩**, « 17차 매직 +5강 셋 » ≈ **1 450 000 ₩**, 163 annonces actives — le RMT bat son plein sur le D17.
- Coût d'enhancement (B4, témoignage) : monter une arme **15차 à +15** coûte « des centaines » d'euros même avec les protections cash (무기파괴/인챈트 보호 캐쉬아이템).
- Consommables liés (A11/A6/A7) : **인핸서 15/16/17차** (arme/armure/accessoire/bouclier — matériaux d'advance alchemy par degré) et **속성석 15/16/17차** en 10 variantes (육체/생명/정신/영혼/회피/용기/투지/철학/사색/도전).

---

## 1️⃣3️⃣ 🎉 Events 2020-2026 — calendrier officiel complet

**Source A1** (100+ titres officiels 2022-2026 dépouillés). Le service coréen fonctionne sur un **cycle annuel d'events récurrents** :

| Période | Event (nom KR officiel) | Mécanique / récompenses marquantes |
|---|---|---|
| Janvier | **신년 이벤트** (2023 계묘년 · 2024 갑진년 · 2025 을사년 · 2026 병오년) | drop de **복주머니** (pochette de nouvel an) sur tous les monstres ; nourritures buffantes : **떡국** (XP+30 %), **전통주** (sxp+30 %), 수정과/만두 (+20 %), 식혜/약식 (+10 %) ; 16-17차 인핸서 (A7 : 13/01→10/02/2026) |
| Février | **돌아온 알리바바와 40인의 도적** (« Le retour d'Ali Baba et les 40 voleurs ») + tirage | event récurrent 2023-2026 avec **당첨자 발표** (tirage au sort) (A1) |
| Mars-avril | **부활절 이벤트** (Pâques, 2026) · **실크로드 Thanks** (spring thanks, 2023-2026) | (A1) |
| Avril-mai | **세 개의 달** (« Les Trois Lunes », 2022-2026) | NPC **소옥 (So-Ok)** ; collecte de **마정석** (pierres magiques) ×10 dans une **수정 항아리** (jarre de cristal) ; fragments **붉은 달/검은 달** échangeables : 인핸서 15-17차, **속성석 15-17차** (10 types), 팡카드, 판도라의 상자, 스킬포인트 스크롤 (A6 : 12/05→16/06/2026) |
| Juin-août | **무더운 여름 신나는 아이스크림 이벤트** (ice cream, 2023-2026) · **더위 타파** (2022) · **경험치 보상 이벤트** (XP compensation serveur) | (A1) |
| Août-septembre | **유령 사냥** (« Chasse aux fantômes », 2026 ; variantes 할로윈 2022-2025) | **donjon cimetière (공동묘지)**, inscription So-Ok, achat de **퇴마 부적** (talisman exorciste : 100 = 1 000 or ou 1 pièce each 수행자/병사/장군), **2 équipes de 8 à 40 joueurs**, **10 minutes** de chasse, victoire = **유령 호리병 ×10** (nul 3, défaite 1), 20 gourdes = coffre ; chance d'obtenir un **유령 펫 (pet fantôme)** ; BA suspendue pendant l'event (A5 : 11/08→08/09/2026) |
| Septembre-octobre | **풍선불기 축제** (« Festival du gonflage de ballons », 2022-2026) | **2 ballons/heure** (10 dernières minutes de chaque heure, 4 types aléatoires : 무지개 10 pts, 보물상자 8, UFO 6, 왕포션 4) + **유니콘** via 10 **고무조각** ; clic droit pour **gonfler par 6 étapes** — succès = reward du palier, éclate = palier 1 ; **uniquement à 장안 et 콘스탄티노플** ; paliers 4-6 : 인핸서 15-16-17차, 10 % dmg 주문서, herbes (마향초/환영초/생명초/활력초/비설초), 판도라의 상자, **스킬포인트 스크롤** (A4 : 08/09→13/10/2026) |
| Octobre | **할로윈 이벤트** (오싹오싹, 2022-2025 ; 2022 écourté — **deuil national** Itaewon : « 국가 애도 기간에 따른 조기 종료 ») | (A1 Page=5) |
| Décembre | **겨울 이벤트 « 다시 돌아온 겨울공주에게 맞… »** (« Le retour de la Princesse d'hiver », 2022-2025) | (A1) |
| Ponctuels | 황금 증표 수집 (2023), 강화는 지금이 기회~ (enhancement chance, 2023), 스크린샷/GM events, XP +30 % serveur lors d'incidents | (A1) |

> 💡 **Calendrier type KSRO** (modèle stable) : 신년(janv) → 알리바바(févr) → Pâques/Thanks(mars-avr) → 세 개의 달(avr-mai) → ice cream(été) → 유령 사냥/할로윈(automne) → 풍선불기(sept-oct) → 겨울공주(déc). Récompenses transverses récurrentes : **인핸서 15-17차**, **판도라의 상자**, **스킬포인트 스크롤** (SP scroll !), **두루마리** (rouleaux STR/INT/AGI), **슈퍼스크롤** (hit/dodge/speed 100 %), **몬스터 소환 주문서**, pandores et coffres.
> Les events 2014-2015 archivés (A15) montrent que la page dédiée `event_list.asp` a été abandonnée au profit des notices de news.

---

## 1️⃣4️⃣ 💳 Monétisation actuelle (item mall officiel)

**Devise** : silk (필). **Paiements** : Pmang (피망) / pièces Happy Money / cartes livres / Danal mobile (notices A1). Plafond de recharge revu en 2023 (아이템몰 충전한도 및 이용약관 변경, A1 Page=5).

| Produit | Prix | Détail officiel |
|---|---|---|
| **프리미엄 골드타임 4주** | **250필** | 3 h/j **XP+sxp +100 %** ; 1×/j résurrection 100 % ; 3×/j retour arrière & retour instantané ; **+5 % dégâts et absorption** ; +5 % hit/dodge ; **+5 % proba. d'enhancement** ; **+5 % succès alchimie** ; stall avatar ; **quêtes premium** (A10) |
| 골드 타임 1일 / 4주 | 10필 / 92필 | 3 h/j XP+sxp +100 % |
| 실버 타임 1일 / 4주 | 7필 / 65필 | 3 h/j XP+sxp +50 % |
| 스킬 골드 타임 1일 / 4주 | 6필 / 55필 | sxp +100 % (cumulable avec gold/silver) |
| 스킬 실버 타임 1일 / 4주 | 4필 / 39필 | sxp +50 % |
| 스킬회수약 ×5 | 15필 | reset 1 niveau de skill/mastery, **100 % SP** |
| 스탯 회수 1-100 / 101-120 / **121-125** | 299 / 399 / **499필** | reset des stats de la tranche |
| 스킬 완전 초기화 (idem tranches) | 299 / 399 / 499필 | reset SP + masteries |
| 캐릭터 외형 변경 | 50필 | apparence |
| 캐릭터명 / 길드명 / 직업가명 변경권 | 250필 chacun | via PNJ **청옥** (prestataire premium) |
| **실크로드 상자** | 15필 | random : **15-17차 장비**, 15-17차 인핸서, **비밀의 열쇠**, **파멸의 원소**, scrolls résurrection, boosters XP 100 % 1 h, 20 % dmg/absorption — **lv 101+** (A11) |
| 팡카드 (Magic Pop 요술팡) | 10필 | carte du gacha 요술팡 |
| 지니의 램프 | 14필 | échange aléatoire avec le **노숙자 지니** (génie SDF) |
| Fellow (펠로우) ×12 | 55필 | cf. §9.1 |

Autres catégories officielles : ARCHEMY/ASTRAL (alchimie), AVATAR/BOOTH, CONSUME/POTION/SCROLL/COMMUNITY/ETC. Buff serveur payant « 강화확률 증가 10 % » attesté par la notice reliques (A2).

---

## 1️⃣5️⃣ 🇰🇷 Glossaire coréen → français (systèmes tardifs)

| Coréen | Romanisation | Français |
|---|---|---|
| 유물 | yumul | relique (équipement 2025, 3 slots) |
| 파멸의 원소 | pamal-ui wonso | Élément de Ruine (matériau relique) |
| 파멸의 성전 | pamal-ui seongjeon | Temple de la Destruction (zone Legend 23) |
| 비밀의 무덤 | bimil-ui mudeom | Tombe Secrète (donjon Legend 23, haut/bas) |
| 인핸서 (15/16/17차) | enhaenseo | enhancer d'advance alchemy par degré |
| 속성석 | sokseongseok | pierre d'attribut (10 variantes) |
| 비밀의 열쇠 | bimil-ui yeolsoe | Clé du Secret (coffre mall) |
| 순환 성장 | sunhwan seongjang | « croissance cyclique » = reset de skills (80 % SP) |
| 재생의 물약 | jaesaeng-ui mul Yak | Potion de Régénération (reset) |
| 저주받은 심장 | jeojubaegin simjang | Cœur maudit (10 par potion) |
| 자동 전투 / 자동 사냥 | jadong jeontu / jadong sanyang | combat auto / chasse auto (2025) |
| 펠로우즈 | fellow | fellows (pets combat/monture) |
| 진화의 물약 | jinhwa-ui mulyak | Potion d'Évolution (growth → fellow) |
| 데빌 스피릿 | devil spirit | esprit démoniaque (grades A/B/S) |
| 요술팡 / 팡카드 | yosulpang / pang kadeu | Magic Pop KR / carte Fang |
| 지니의 램프 / 노숙자 지니 | genie lamp | Lampe du génie / génie SDF |
| 아카데미 / 교수 / 연수생 / 졸업 | academy / gyosu / yeonsusaeng / joleop | académie / professeur (Guardian) / stagiaire (Apprentice) / diplômation |
| 명예 점수 / 명예 버프 | myeong-ui | honor points / honor buff |
| 배틀 아레나 | battle arena | Battle Arena (4 modes, 64 j.) |
| 수행자의/병사의/장군의 주화 | juhua | pièce du disciple/soldat/général (arène) |
| 아레나 코인 | arena coin | arena coins (échange Jangan/Constantinople) |
| 요새전 | yosaeyejeon | guerre de forteresse (taxe 20 %, bimensuelle) |
| 풍선불기 축제 | pungseon bulgi chukje | Festival du gonflage de ballons |
| 유령 사냥 / 유령 호리병 / 퇴마 부적 | ghost hunt | chasse aux fantômes / gourde / talisman exorciste |
| 세 개의 달 | se gae-ui dal | Les Trois Lunes (event) |
| 마정석 / 수정 항아리 | magic stone / jar | pierre magique / jarre de cristal |
| 복주머니 | bokjumeoni | pochette porte-bonheur (nouvel an) |
| 떡국 / 전통주 / 수정과 / 만두 / 식혜 / 약식 | — | buff-foods du nouvel an (XP/sxp +10-30 %) |
| 돌아온 알리바바와 40인의 도적 | — | Le retour d'Ali Baba et les 40 voleurs |
| 겨울공주 | winter princess | Princesse d'hiver (event déc.) |
| 두루마리 (완력/지능/민첩) | durumari | rouleau (STR/INT/AGI) |
| 슈퍼스크롤 (명중/회피/이동속도 100 %) | superscroll | super scrolls hit/dodge/vitesse |
| 스킬포인트 스크롤 | SP scroll | scroll de points de skill |
| 판도라의 상자 | Pandora box | boîte de Pandore |
| 몬스터 소환 주문서 (파티용) | — | scroll d'invocation de monstres (groupe) |
| 골드 타임 / 실버 타임 / 프리미엄 골드타임 | — | services premium XP (3 h/j) |
| 스킬회수약 | — | potion de reset skill (100 % SP) |
| 항아리/노점/위탁판매 | — | jarre / stall / vente consignée |
| 청옥 | Cheongok | PNJ prestataire premium |
| 소옥 | So-Ok | PNJ d'events (So-Ok) |
| 통합우편함 | — | boîte mail intégrée (2023) |
| 고인 계정 명의 변경 | — | transfert de compte de défunt (2026) |

---

## 1️⃣6️⃣ ⚠️ Incertitudes non résolues

1. **Cap exact actuel du KSRO** : preuves ≥ 131 (reliques A2) ; palier item mall 121-125 (A11) ; **« 140 » jamais énoncé côté coréen**. iSRO = 140 (Facebook, S36 du rapport KO). À trancher par client/patchnotes.
2. **Cap total de mastery actuel** (330/360/420 ?) : aucune source KR/EN fiable au-delà du cap 120 iSRO (360, C1).
3. **Coûts SP des livres 96-124** et **valeurs chiffrées des skills tardifs** : le site officiel ne donne que noms+niveaux ; extraction `skilldata_5000.txt`/`_RefSkill` du client restante.
4. **CTF coréen** : zéro doc officielle KR (modes, scores, récompenses). Existe via client/privés seulement.
5. **Calendrier Battle Arena 2026** (horaires, modes ouverts, ladder) : prouvé actif (A5) mais planning non publié en ligne.
6. **Honor system** : valeurs d'honor points par note, table exacte du honor buff — uniquement forums EN 2010 (C4/C5) ; jamais re-documenté côté KR.
7. **Job temple / items egy côté KSRO** : uniquement mirrors privés (C12) ; date d'introduction en Corée inconnue.
8. **Guilde/union tardives** : aucune refonte trouvée dans les notices 2022-2026 ; fort possible qu'il n'y en ait aucune depuis Legend VII.
9. **요술팡 (Magic Pop KR)** : contenu exact de la table de récompenses (hors Devil S, C9) introuvable.
10. **Fellow pets tardifs** : mécanique précise d'évolution/transfert de niveau = vidéos EN (C6) ; pas de page guide officielle KR.
11. **Mapping codename ↔ nouveaux noms KR** : les 296 skills CH officiels (A8) ne portent pas de codenames — croisement avec `skilldata` à faire (les séries 121-124, passifs 80, transformations 비천신공 sont certainement les skills « Skail/ultimes » des maj 120-140 iSRO).
12. **Serveur unique 초원길** : aucun second serveur rouvert 2023-2026 (notices) — confirmé indirectement.

---

## 1️⃣7️⃣ 💡 Recommandations pour SRObro

1. **Créer `SKILLS_DATABASE_LATE_KR.md`** à partir de la base officielle A8 (296 skills CH, tables du §3) + A9 (269 EU) : c'est la source primaire la plus propre jamais trouvée pour les noms KR tardifs — url par série : `krsilkroadcp.joymax.com/gamedata/skill/iframe_skill/<Mastery>_<N>.html`.
2. **Mettre à jour les caps** (`02_CHINESE_CLASSES.md`, `25_LEVELING_GUIDE.md`) : paliers coréens 121-125 puis 131+ (reliques) ; marquer « 140 (iSRO, à confirmer KR) ».
3. **Nouveaux systèmes à documenter** dans la base : 유물/reliques (§5.1), 자동 전투 (§5.2), 순환 성장 (§6) — trois pages officielles citables.
4. **Events** : recopier le calendrier récurrent §13 dans `27_EVENTS.md` avec les 4 events 2026 détaillés (풍선불기/유령 사냥/세 개의 달/병오년 신년) — chaque mécanique est sourcée officiellement.
5. **Monétisation** : ajouter une section « KSRO 2026 » à `22_ECONOMY_GOLD.md` avec la grille §14 (officielle) — et la distinction 필(silk)/골드.
6. **Marquage** : étiqueter C6/C12/C13/C14 comme « miroirs privés » dans `36_USEFUL_LINKS.md` ; ne jamais citer ItemBay (B5) comme source de mécanique (RMT only, mais bon indicateur d'économie D17).
7. **Fichier technique** : réutiliser la méthode `curl | iconv -f EUC-KR` pour tout futur scraping du site officiel (les fetchers standard échouent en mojibake).

---

*Rapport généré le 2026-10-01. Sources officielles KSRO décodées EUC-KR le même jour (le site est lisible mais son encodage casse les outils génériques). namu.wiki et wiki.onul.works inaccessibles (403) — snippets moteur uniquement. Aucune donnée vSRO/privée ou mobile n'est présentée comme officielle.*
