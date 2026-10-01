# 🔎 Rapport de recherche KO2 — Items & alchimie du haut-niveau KSRO (11차 → 17차)

> **Mission** : documenter **en coréen** les ITEMS et l'ALCHIMIE du haut-niveau du service coréen de Silkroad Online (KSRO, jamais fermé) : degrés 12/13+, seals (노바/혜성), alchimie avancée, pierres, sets, bijoux, avatars, devil spirits, consommables.
> **Date de la recherche** : 2026-10-01 · ~25 requêtes coréennes + extraction systématique du **site officiel KSRO** (pages 게임가이드/아이템시스템/연금술/아이템몰 en EUC-KR, converties manuellement).
> **Règle d'or respectée** : chaque donnée porte son URL. Rien d'inventé. Les interprétations et les sources non-coréennes (EN/privées) sont signalées.
> **Fait marquant de méthode** : le site officiel `krsilkroadcp.joymax.com` expose des tables d'items **jusqu'au 13차** et un item mall **jusqu'au 17차** — c'est LA source primaire de ce rapport. namu.wiki et son miroir restent bloqués (403), utilisés uniquement via extraits de recherche.

---

## 📑 Sommaire

- [1. Index des sources](#1️⃣-index-des-sources)
- [2. Cartographie des degrés : jusqu'où va le KSRO ?](#2️⃣-cartographie-des-degrés--jusquoù-va-le-ksro-)
- [3. Le régime « 12차 이상 » : niveau 101 fixe, pénalités, skills d'item](#3️⃣-le-régime-12차-이상--niveau-101-fixe-pénalités-skills-ditem)
- [4. Hiérarchie des seals : 별/달/해의 인장 → 혜성의 인장 → 매직/레어/레전드](#4️⃣-hiérarchie-des-seals--별달해의-인장--혜성의-인장--매직레어레전드)
- [5. Les trois tiers du 11D : normal / 무신 / 투신 (panthéon égyptien)](#5️⃣-les-trois-tiers-du-11d--normal--무신--투신-panthéon-égyptien)
- [6. Armes 12차 et 13차 : noms coréens officiels + stats](#6️⃣-armes-12차-et-13차--noms-coréens-officiels--stats)
- [7. Sets & pièces d'armure 11D/12D/13D + bijoux de set](#7️⃣-sets--pièces-darmure-11d12d13d--bijoux-de-set)
- [8. Alchimie « classique » (≤ 11차) : taux, options, prix officiels](#8️⃣-alchimie-classique--11차--taux-options-prix-officiels)
- [9. Alchimie « avancée » (≥ 12차) : 인핸서 + 보호석, destruction à l'échec](#9️⃣-alchimie-avancée--12차--인핸서--보호석-destruction-à-léchec)
- [10. Montée de degré : 각석 / 특수각석 (11차→14차)](#10️⃣-montée-de-degré--각석--특수각석-11차14차)
- [11. 고급 강화 엘릭시르 A/B (+1/+2 garantis)](#1️⃣1️⃣-고급-강화-엘릭시르-ab-12-garantis)
- [12. Sockets : 소켓석 (3 emplacements max)](#1️⃣2️⃣-sockets--소켓석-3-emplacements-max)
- [13. 연금약 : les potions d'alchimie (미풍→태풍)](#1️⃣3️⃣-연금약--les-potions-dalchimie-미풍태풍)
- [14. Devil spirits tardifs, runes, consommables & item mall 2026](#1️⃣4️⃣-devil-spirits-tardifs-runes-consommables--item-mall-2026)
- [15. Drops 16-17차 : Silkroad Box & Legend 22/23](#1️⃣5️⃣-drops-16-17차--silkroad-box--legend-2223)
- [16. Glossaire coréen → français (items & alchimie)](#1️⃣6️⃣-glossaire-coréen--français-items--alchimie)
- [17. Incertitudes non résolues](#1️⃣7️⃣-incertitudes-non-résolues)
- [18. Recommandations pour SRObro](#1️⃣8️⃣-recommandations-pour-srobro)

---

## 1️⃣ Index des sources

Fiabilité : **5** = officiel KSRO vérifié (pages EUC-KR converties) · 4 = presse KR / wiki établi · 3 = communauté KR concordante · 2 = forum/vidéo étranger de recoupement · 1 = non vérifiable.

| # | Source | URL | Type | Fiabilité |
|---|--------|-----|------|-----------|
| K1 | **Site officiel KSRO — accueil + bannières item mall** (봉인구 16/17차 à 32 실크, news 26.09.17) | https://krsilkroadcp.joymax.com/ | Officiel | **5** |
| K2 | **Officiel — 시스템 d'items** (`itemsystem.asp` + iframes `_1/_2/_3.html` : grades, 12차+, skills d'item, sets) | https://krsilkroadcp.joymax.com/gamedata/item/itemsystem.asp · https://krsilkroadcp.joymax.com/gamedata/item/Iframe_item/itemsystem_1.html | Officiel | **5** |
| K3 | **Officiel — 연금술 (portail)** : 장비강화/마법속성/속성변경/고급연금술/분해/아이템업그레이드/소켓 | https://krsilkroadcp.joymax.com/gamesystem/alchemy/alchemy.asp | Officiel | **5** |
| K4 | **Officiel — 장비 강화 part 2 (≥12차 : 인핸서/보호석)** | https://krsilkroadcp.joymax.com/gamesystem/alchemy/iframe_alchemy/equipmentstrength_2.html (depuis /gamesystem/alchemy/equipmentstrength.asp) | Officiel | **5** |
| K5 | **Officiel — 아이템 업그레이드 (각석)** | https://krsilkroadcp.joymax.com/gamesystem/alchemy/itemupgrade.asp | Officiel | **5** |
| K6 | **Officiel — 연금약 (고급 연금술)** | https://krsilkroadcp.joymax.com/gamesystem/alchemy/medical.asp | Officiel | **5** |
| K7 | **Officiel — 소켓 (소켓석)** | https://krsilkroadcp.joymax.com/gamesystem/alchemy/sokect.asp | Officiel | **5** |
| K8 | **Officiel — armes CH 1차→13차** (6 pages : sword/blade/spear/glaive/bow/shield, stats complètes) | https://krsilkroadcp.joymax.com/gamedata/item/asia_item.asp · iframes `Iframe_item/asia_weapon_1.html` … `_6.html` | Officiel | **5** |
| K9 | **Officiel — armes EU 1차→13차** (9 pages : 1H/2H/dual/dagger/xbow/staff/warlock/cleric/harp) | https://krsilkroadcp.joymax.com/gamedata/item/europe_item.asp · iframes `Iframe_item/europe_weapon_1.html` … `_9.html` | Officiel | **5** |
| K10 | **Officiel — sets 11차** (armures EU/CH + accessoires, set effects) | https://krsilkroadcp.joymax.com/gamedata/item/set_item.asp · iframes `set_europe_protector_1..3.html`, `set_asia_protector_1..3.html`, `set_asia/europe_accessory_1..2.html` | Officiel | **5** |
| K11 | **Officiel — protecteurs & accessoires 12/13차** (stats par pièce) | `Iframe_item/asia_protector_1..3.html`, `europe_protector_1..3.html`, `asia_accessory_1..2.html`, `europe_accessory_1..2.html` (sous /gamedata/item/) | Officiel | **5** |
| K12 | **Officiel — items d'alchimie (고급 강화 엘릭시르 A/B)** | https://krsilkroadcp.joymax.com/gamedata/item/alchemy_item.asp · iframe `alchemy_item1_1.html` | Officiel | **5** |
| K13 | **Officiel — item mall ARCHEMY/ETC** (특수각석 11-13차, 보호석 12-17차, runes, prix en 실크) | https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?shoptype1=ARCHEMY&Shoptype2=ETC | Officiel | **5** |
| K14 | **Officiel — item mall ARCHEMY/ASTRAL & ATHANASIA** (아스트랄/불멸의 연금석 1차→11차 + prix) | https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?shoptype1=ARCHEMY&Shoptype2=ASTRAL · …`Shoptype2=ATHANASIA` | Officiel | **5** |
| K15 | **Officiel — item mall CONSUME/SPECIAL, PET/GROWTH, PREMIUM, AVATAR/BOOTH** (resets 121-125, devil spirits, premium) | https://krsilkroadcp.joymax.com/itemmall/itemlist.asp?shoptype1=CONSUME&Shoptype2=SPECIAL · …`shoptype1=PET&Shoptype2=GROWTH` · …`shoptype1=PREMIUM&Shoptype2=PREMIUM` · …`shoptype1=AVATAR&Shoptype2=BOOTH` | Officiel | **5** |
| K16 | **Officiel — consommables & divers** (HP/MP 약초, 귀환서, montures, 진은주화) | https://krsilkroadcp.joymax.com/gamedata/item/Consumption_item.asp (iframes `_1.._9.html`) · https://krsilkroadcp.joymax.com/gamedata/item/etc_item.asp (iframe `Etc_item_1.html`) | Officiel | **5** |
| K17 | **NewsWire — Legend 12 « Heroes of Jupiter »** (22/06/2011 : cap 120, 유피테르 신전, event 111Lv → 연금석 풀 세트) | https://www.newswire.co.kr/newsRead.php?no=553291 | Presse KR | **4** |
| K18 | **경향게임스 — sets 13차 offerts (comeback 초원길, 2012)** | https://www.khgames.co.kr/news/articleView.html?idxno=45796 | Presse KR | 4 |
| K19 | **namu.wiki « 실크로드 온라인 »** (403 direct — extraits) : Legend 23 = 16-17차 ; ancien système 12→13→14→15차 par upgrade | https://namu.wiki/w/실크로드%20온라인 | Wiki KR | 4 (indirect) |
| K20 | **wiki.onul.works (miroir namu, 403 — extrait)** : 파라오의 무덤 100+ party ; 신전 105+ en tenue de métier | https://wiki.onul.works/w/실크로드_온라인 | Miroir | 3 (indirect) |
| K21 | **Café Daum kkndfs — 팁 alchimie** (taux 70→10 %, 행운/견고/불멸, 흡수율, jobs +5 %/grade) | https://m.cafe.daum.net/kkndfs/3un1/6 | Communauté | 3 |
| K22 | **Café Daum silkroadvision — refonte 연금술 26/04/2006** (아스트랄 신규, 연금석/속성석 complets, 4대 원소, 론도) | https://m.cafe.daum.net/silkroadvision/4ljV/83 | Communauté (copie d'annonce) | 3-4 |
| K23 | **Café Daum silkrodecafe — guide 장비 강화** (règles échec +0/+4 vs +5+) | https://m.cafe.daum.net/silkrodecafe/ISbB/19 | Communauté | 3 |
| E1 | *(recoupement EN)* Blog princessjane25 — 12D upgrade iSRO (31/05/2011, conversion des grades) | https://princessjane25.wordpress.com/2011/06/21/writings-of-the-guru-event-simple-tutorial-in-upgrading-items-to-12degree | Blog EN | 2-3 |
| E2 | *(recoupement EN)* Srolobby — taux Silkroad Box 17D « référencés au KR officiel » + noms sets 17D | https://www.srolobby.com/konular/silkroad-online-silkroad-box-17-degree-item-drop-rates.4434 | Forum EN | 3 |
| E3 | *(recoupement EN)* YouTube — 12D~17D obtention/upgrade ; Legend XXII « Lower Secret Tomb » | https://www.youtube.com/watch?v=SUzQ3mvjYs0 · https://www.youtube.com/watch?v=xy_5RQrZdl8 | Vidéos | 2 |
| E4 | *(recoupement EN)* Elitepvpers — guides 11D→12D, advanced elixir facts | https://www.elitepvpers.com/forum/silkroad-online/1264143-guide-upgrading-11d-items-12d.html · https://www.elitepvpers.com/forum/sro-guides-templates/1362467-guide-advanced-elixir-facts.html (accessibles en extraits seulement, 403) | Forum EN | 2 |

> ⚠️ Pages officielles encodées en **EUC-KR** : les outils de fetch automatiques produisent du mojibake et des résumés parfois fautifs (ex. « 청마노 » halluciné par un résumé — le texte réel dit 청옥서판). Toutes les citations officielles ci-dessous ont été extraites en brut et converties manuellement (curl + iconv).

---

## 2️⃣ Cartographie des degrés : jusqu'où va le KSRO ?

**Réponse : 17차 (D17)** — mais avec deux « mondes » distincts :

| Degré | Statut KSRO | Preuve | Source |
|---|---|---|---|
| 1차-10차 | Ancien jeu (tables officielles complètes 1→10) | Tables armes/armures complètes | K8/K9 |
| 11차 | Socle du haut-niveau : **3 tiers par item** (normal/무신/투신), seal unifié **혜성의 인장** | Tables officielles + itemsystem_1 | K2/K8/K9 |
| **12차** | **Nouveau régime** : Lv 101 fixe, item skills, enhancement **인핸서**, upgrade depuis 11차+7 | Tables officielles + K4/K5 | K4/K5/K8/K9 |
| **13차** | Dernier degré détaillé dans les tables officielles (armes/armures/bijoux) ; sets offerts dès 03/2012 (comeback 초원길) | Tables officielles + presse | K8-K11, K18 |
| 14차 / 15차 | **Existants** (mall vend des 보호석 14차/15차) ; non détaillés dans la gamedata officielle | Item mall | K13 |
| 16차 / 17차 | **Existants** (보호석 16/17차 au mall ; 봉인구 16/17차 « 봉인 해제용 » 32 실크 en bannière) — introduits par **Legend 23** (05/2023) | Item mall + accueil + namu | K1/K13/K19 |
| 18차+ | **Aucune trace** côté officiel (aucun 보호석 au-delà de 17차 au mall) | — | K13 |

- **Chronologie des mises à jour concernées** : Legend 9 KR (09/09/2009, cap 105, Alexandrie, sets 11차 égyptisants — cf. RESEARCH_KO §2.3) → Legend 12 KR « Heroes of Jupiter » (**22/06/2011**, cap **120**, donjon 유피테르 신전 ; event « 도전 111레벨 » récompensé par **연금석 풀 세트**) (K17) → sets 13차 donnés au comeback de 초원길 (07/03/2012) (K18) → **Legend XXII** « 비밀의 무덤 » (Secret Tomb) (E3) → **Legend 23** (≈16/05/2023) : 파멸의 성전 + 비밀의 무덤 + **16-17차** (K19/E3).
- namu.wiki (extrait) : « 레전드23이 업데이트 되면서 16~17차 장비가 나왔는데 과거 실크로드는 12-13-14-15차 장비를 일정 강화 수치가 되면 업그레이드 할 수 있는 방식으로 [운영했다] » — avant Legend 23, on **montait** ses pièces 12→13→14→15차 par upgrade ; depuis Legend 23, les 16-17차 s'obtiennent autrement (drops/box — §15) (K19).
- **Cap de niveau actuel : 125** — prouvé indirectement par l'item mall qui vend « 스탯 회수 (121~125) » et « 스킬 완전 초기화 (121~ 125) » à 499 실크 (K15).

---

## 3️⃣ Le régime « 12차 이상 » : niveau 101 fixe, pénalités, skills d'item

Texte officiel (K2, itemsystem_1.html) :

- **« 12차 이상의 무기 아이템들은 착용 레벨이 101Lv로 고정 »** — toutes les armes 12차+ ont un **niveau d'équipement fixe à 101** (un perso 101 peut porter du 17차 en théorie).
- **« 아이템 숙련 패널티 »** : les stats de l'item reçoivent une **pénalité** fonction du niveau du perso et du **차수** porté (le tooltip affiche la pénalité). C'est le système qui remplace les anciens prérequis de niveau.
- **« 12차 이상의 무기는 스훌이 존재 »** : les armes 12차+ portent des **skills d'item** — un UI de skill dédié apparaît ; on les active par clic droit/quickslot. *(lire : 스킬)*
- Les tables d'armes 11-13차 confirment : **tous les items 11/12/13차 listés sont Lv 101** (K8-K11).

> 💡 Pour SRObro : c'est LA rupture structurelle du haut-niveau KSRO. Le concept « degré = tranche de niveaux (ex. 10D = 90/94/98) » **meurt au 11차** : à partir de là, degré ≠ niveau, et c'est la pénalité de maîtrise qui régule.

---

## 4️⃣ Hiérarchie des seals : 별/달/해의 인장 → 혜성의 인장 → 매직/레어/레전드

Texte officiel (K2, itemsystem_1.html) — c'est la réponse à la question centrale de la mission :

| Degrés | Grades officiels KR | Couleur du nom | Notes officielles |
|---|---|---|---|
| 1차-10차 | 일반 (blanc) / 강화아이템 (blanc, « (+N) ») / **매직** (bleu : 플러스/마이너스 속성) / **레어** (jaune) | blanc/bleu/jaune | « 레어아이템은 능력치에 따라 **별의 인장, 달의 인장, 해의 인장**으로 구분 » (Seal of Star/Moon/Sun), effet lumineux sur les armes |
| **11차+** | « **레어아이템은 11차부터 '혜성의 인장' 하나로 통일됩니다** » + « **일반아이템은 11차부터 1개의 등급으로 통일** » | — | Le seal **혜성의 인장** (« Sceau de la Comète ») **remplace** 별/달/해 ; les items normaux n'ont plus de tiers A/B/C |
| **12차+** | **매직 / 레어 / 레전드** (attesté par l'item mall qui vend des 보호석 « 매직/레어/레전드 » pour chaque degré 12→17차) | — | Nouvelle échelle de rareté à 3 niveaux (K13) |

**Réponses aux hypothèses de la mission** :

- **« Seal of Nova » (노바)** : le mot **노바 n'apparaît nulle part** dans les sources coréennes officielles ni communautaires trouvées (requêtes « 실크로드 노바 아이템 씰 », « "노바" 실크로드 아이템 인장 11차 » : aucun résultat KR — uniquement des contenus iSRO/privés EN-TR). **Interprétation (non KR)** : « Seal of Nova » est la dénomination **iSRO internationale** du rare unifié D11+, que le site officiel KR appelle **혜성의 인장** et le wiki TW **彗星** (comète — cf. RESEARCH_ZH : récompense FGW « 第十套月亮印章 » / « 彗星武神武器 »). Les trois désignent la même réalité : le rare « comète » qui remplace Star/Moon/Sun à partir du 11D.
- **« Aquila » (아퀼라)** : requête « 실크로드 아퀼라 » → **zéro résultat lié au jeu** côté coréen. Le nom n'existe pas dans l'écosystème KSRO. À traiter comme **invention de serveur privé ou confusion** (les sets 13차 KR utilisent bien des noms latins de vents — 템페스트/프로셀라(Tempest/Procella)/브리즈(Breeze) — mais « Aquila » n'est pas attesté). ⚠️ À ne PAS intégrer à la base sans preuve client.
- **이집트 A/B** : la nomenclature « Egyptian A/B » n'est pas utilisée telle quelle côté KR ; l'équivalent fonctionnel est la paire de tiers **무신/투신** du 11차 (§5) — équivalence probable, interprétation signalée.
- **Seal of Star/Moon/Sun « subsiste-t-elle » ?** : oui pour ≤10차 (drops FGW D10 SOM attestés côté TW/ZH ; le système 별/달/해 est décrit comme actif par la page officielle), **non à partir du 11차**.

---

## 5️⃣ Les trois tiers du 11D : normal / 무신 / 투신 (panthéon égyptien)

Tables officielles (K8/K9) — chaque type d'arme 11차 existe en **3 versions**, toutes Lv 101, avec des **noms de dieux égyptiens** pour les 2 supérieures :

| Type | 11차 normal | 11차 **(무신)** | 11차 **(투신)** |
|---|---|---|---|
| CH 한손검 (sword) | 혼령 추혼검 (1434~1616 / 2440~2804) | **아슈(무신)** d'après Shu, dieu de l'air (1754~1978 / 2986~3432) | **아조스(투신)** d'après Anubis (1857~2094 / 3161~3633) |
| CH 한손도 (blade) | 풍신 진천 금강도 | 몬트센(무신) — Montu, dieu de la guerre | 수테크(투신) — Set |
| CH 창 (spear) | 전사의 비전창 | 브레커스(무신) | 라그니우스(투신) — Selket |
| CH 대도 (glaive) | 호력 봉인도 | 세크메티아(무신) — Sekhmet | 티폰(투신) — Typhon/Haroeris |
| CH 활 (bow) | 황풍 비호대궁 | 누트리타(무신) — Nut | 수낙트라(투신) — Neith |
| CH 방패 (shield) | (normal) 213.7/342.0 | 세드온(**보호**) — Sed | 세이케스(**수호**) — Selket |
| EU (exemples) | — | Shu, Montu, Nut, Geb, Imutes, Ma'at, Isis, Sed, Bastet… | Anubis, Set, Selket, Sekhmet, Neith, Horus, Nephtys, Apepi… |

*(format : attaque physique ~ / attaque magique ~ ; ordre de puissance normal < 무신 < 투신 vérifié sur toutes les lignes — K8/K9)*

**Lecture** (interprétation signalée) : les trois niveaux 11차 correspondent très probablement aux couches iSRO « 11D normal / Seal of Nova / Legend (Egyptian A) » et au bestiaire du **Job Temple** (Selket, Neith, Anubis, Isis — cf. RESEARCH_ZH Trouvaille 3) et de la vallée du Nil (아주라이트/케프타/아페피 = Azurite/Khepri/Apepi, §7). Aucune page officielle KR lue ne dit **où** chaque tier s'obtient (voir incertitudes) ; l'association 무신/투신 ↔ « Egyptian A/B » d'iSRO est une inférence fondée sur les noms de dieux et l'ordre de puissance.

---

## 6️⃣ Armes 12차 et 13차 : noms coréens officiels + stats

Toutes **Lv 101** (K8/K9). Format : attaque physique ~ / magique ~ (les armes EU n'ont qu'une des deux).

### 🐉 12차 — thème **DRAGON** (« 청룡의 뼈 », « 용왕 », « 마왕석 »)

| Race | Type | Nom KR | Stats (phys / mag) |
|---|---|---|---|
| CH | 한손검 | **마신검** (épée-démon céleste, os de dragon bleu) | 1720~1939 / 3577~4112 |
| CH | 한손도 | **용비도** (le dragon recrache une lame tous les 100 ans) | 2236~2570 / 2752~3102 |
| CH | 창 | **황룡뇌극** (os du dragon jaune du Huang He) | 1795~2137 / 3761~4596 |
| CH | 대도 | **참장봉신비도** (os du 광룡 de 육합도인) | 2351~2873 / 2872~3419 |
| CH | 활 | **용왕장궁** (os du dragon des mers du palais du Dragon) | 1933~2369 / 3093~3790 |
| CH | 방패 | **룡 두갑 방패** (crâne du dragon des eaux) | bloc 284.9 / 455.8 |
| EU | 원핸드소드 | **세이튼스피리트** | 2564~3134 |
| EU | 투핸드소드 | **데모고르곤** | 2564~3134 |
| EU | 듀얼액스 | **데빌스레이닝** | 2564~3134 |
| EU | 대거 | **인페르노토쳐** | 2564~3134 |
| EU | 크로스보우 | **어비스 레인** | 2564~3134 |
| EU | 스태프 | **이블 소울 라이징** | 4103~5014 (mag) |
| EU | 워락로드 | **카오틱어비스** | 4103~5014 (mag) |
| EU | 클레릭로드 | **헤븐스셀베이션** | 4103~5014 (mag) |
| EU | 하프 | **데몬즈하울** | 4103~5014 (mag) |

### 🌪 13차 — thème **TEMPÊTE / DRAGON céleste** (« 승천하는 용 », « 드래곤 »)

| Race | Type | Nom KR | Stats (phys / mag) |
|---|---|---|---|
| CH | 한손검 | **청룡검** (le vent fait danser le dragon) | 2275~2565 / 4733~5441 |
| CH | 한손도 | **참룡도** (« coupe même les dragons ») | 2958~3400 / 3641~4104 |
| CH | 창 | **용섬극** (dragon ascendant) | 2375~2827 / 4976~6082 |
| CH | 대도 | **폭참마도** | 3110~3801 / 3800~4524 |
| CH | 활 | **용마궁** (flèche sortie de la gueule du dragon) | 2558~3135 / 4092~5015 |
| EU | 원핸드소드 | **드래곤 페나** | 3393~4147 |
| EU | 투핸드소드 | **디스트로이어** | 3393~4147 |
| EU | 듀얼액스 | **그레이트 듀엘** | 3393~4147 |
| EU | 대거 | **드래곤 피어** (dent de dragon) | 3393~4147 |
| EU | 크로스보우 | **드래곤 브레스** | 3393~4147 |
| EU | 스태프 | **드래고닉 소울** | 5428~6635 (mag) |
| EU | 워락로드 | **어비스 타이푼** | 5428~6635 (mag) |
| EU | 하프 | **허리케인 랩소디** | 5428~6635 (mag) |

> Ordre de puissance vérifié : 11차 normal < 12차 normal < 11차 투신 (phys) — le 12차 normal dépasse le 11차 normal en magie mais reste sous le tier 투신 en physique (ex. sword : 마신검 1720~1939 phys vs 아조스 1857~2094). Cohérent avec le constat iSRO « 12D plus fort que 11D normal, plus faible que certains EGY 11D » (E1/E4).

---

## 7️⃣ Sets & pièces d'armure 11D/12D/13D + bijoux de set

### Sets 11차 (Lv 101, échangeables contre des 진은주화 — K2/K10/K16)

| Set | Cible | Thème | Set effect officiel |
|---|---|---|---|
| **아주라이트** (Azurite) | CH 갑옷 + EU 중갑 (Heavy) | « pierre sacrée de 폭풍의 사막 » | **파멸(2/6)** : 세트 강화 +1 · **파멸(4/6)** : 세트 강화 +1, 올저항 +10 · **파멸(6/6)** : 세트 강화 +2, 올저항 +10 |
| **케프타** (Khepri) | EU 경갑 (Light) | carapace du scarabée Khepri | 파멸 2/4/6 (idem) |
| **아페피타** (Apepi/Apophis) | EU 로브 (Robe) | peau du serpent Apepi | 파멸 2/4/6 (idem) |
| (variante CH 호구/도복) | sets CH equivalents | — | 파멸 2/4/6 (idem) |
| **텍타이트** (Tektite) | accessoires CH | « roche mère de l'univers » | (2/4) 세트 강화 +1 · (4/4) +2 |
| **아문** (Amun) | accessoires CH | Amun, dieu du ciel/créateur | (2/4) 세트 강화 +2 · (4/4) +4 |
| **플레나이트** | accessoires EU | « lucidité qui transperce le vrai » | (2/4) +1 · (4/4) +2 |
| **이시스** (Isis) | accessoires EU | bénédiction d'Isis | (2/4) +2 · (4/4) +4 |

- « 세트 강화 : N 강화 » = **+N niveaux d'enhancement** offerts par le set ; « 올저항 증가 : 10 » = +10 toutes résistances.
- Exemples de pièces (K10) : 아주라이트 아멧/폴드론/아머 (EU heavy, chest 274.1/358.8), 케프타 메일 (249.2/398.7), 아페피타 로브 (224.3/438.6), 텍타이트 반지 (absorb 23.0/23.0) — CH acc 아문 반지 (23.0/23.0).
- **진은주화** (« pièces d'argent véritable ») : monnaie d'échange dédiée aux sets — « 일반 상점에서 구매나 몬스터가 드랍하지 않으며 주화를 이용해 교환할 수 있는 아이템 » (K2/K16).

### Sets 12차 — thème DRAGON (K11)

| Race/type | Nom du set | Exemple chest (pdef/mdef) |
|---|---|---|
| CH 갑옷 (Armor) | **룡위 보문** (투모/견갑/상갑/하갑/장갑/갑화) | 상갑 364.8 / 477.5 |
| CH 호구 (Protector) | **봉황룡** (dragon-phénix) | — |
| CH 도복 (Garment) | **천 촉룡** (dragon du Shu) | 상의 298.5 / 636.7 |
| EU 중갑 (Heavy) | **헤븐** (Heaven) | 플루티드아머 364.8 / 477.5 |
| EU 경갑 (Light) | **엔젤** (Angel) | 플루티드메일 331.6 / 530.6 |
| EU 로브 (Robe) | **디보션** (Devotion) | 로브 298.5 / 583.7 |
| Bijoux CH | **여의주반지 / 여의주귀걸이** (perle du dragon) | 반지 absorb 25.3 / 25.3 |
| Bijoux EU | **드래곤링 / 드래곤이어링** | — |

### Sets 13차 — thème TEMPÊTE (K11)

| Race/type | Nom du set | Exemple chest (pdef/mdef) |
|---|---|---|
| CH 갑옷 | **템페스트** (Tempest) | 상갑 482.0 / 631.0 |
| CH 호구 | **프로셀라** (Procella, « vent impétueux » en latin) | — |
| CH 도복 | **브리즈** (Breeze) | 상의 394.4 / 841.4 |
| EU 중갑 | **템페스트** | 아머 482 / 631 |
| EU 경갑 | **프로셀라** | 메일 438.2 / 701.2 |
| EU 로브 | **브리즈** | 로브 394.4 / 771.3 |
| Bijoux CH | **폭풍석 반지/귀걸이** (« pierre de tempête ») | — |
| Bijoux EU | **블루 스톰 링/이어링** (Blue Storm) | — |

> Les tables officielles s'arrêtent au 13차 ; les sets 14-17차 ne sont connus que par le mall/presse (noms EN des sets 17차 : Platina/Orbis/Tonitrus… — E2, §15).

---

## 8️⃣ Alchimie « classique » (≤ 11차) : taux, options, prix officiels

Système historique (portail officiel K3 + cafés K21/K22/K23) — utilisé pour les items **jusqu'au 11차** :

- **Procédure** : 연금술창 [Y] → onglet 속성강화 → item + **강화 엘릭시르** (4 types : 무기/방어구/방패/악세서리, drops de mobs) + **행운의 가루** (poudre de chance par 차수, marchand général).
- **Taux communautaires** (café kkndfs, avec 행운의 가루 ; fiabilité 3) : **+1 : 70 % · +2 : 60 % · +3 : 50 % · +4 : 40 % · +5 : 30 % · +6 : 20 % · +7 : 10 %** ; cumulés depuis +0 : 70/42/21/8,4/2,52/0,5/0,05 %.
- **Échecs** : +0~+4 → **reset à 0** ; +5 et plus → reset **toujours**, + possible **perte de durabilité max** ou **destruction** (K22/K23).
- **Options d'aide (보조 마법속성, 1 charge chacune)** — noms officiels :
  - **행운** (Lucky) : double la probabilité de succès ;
  - **견고** (Steady) : empêche la perte de durabilité max ;
  - **불멸** (Immortal) : empêche la destruction ;
  - **아스트랄** (Astral) : en cas d'échec à +4 ou plus, ramène à +4 (introduit 26/04/2006 ; n'est pas cumulable avec 불멸 ; charges ≤ charges 불멸).
- **Prix officiels du mall (2026)** — 아스트랄의 연금석 et 불멸의 연금석 vendus **par 차수 1→11** : 5/11/14/19/24/30/38/46/51/62/**70 실크** (K14). *(Plus d'astral/immortal au-delà du 11차 : le 12차+ a son propre système, §9.)*
- **마법 속성 부여 (연금석)** et **기본속성 변경 (속성석)** : noms officiels complets des pierres (완력/지혜/장인/명중/응징/간파/회피/체력/마력/안개/대기/불꽃/해독/재생… pour les 연금석 ; 용기/투지/철학/사색/도전/집중/육체/생명/정신/영혼/회피/비호/단련/기도… pour les 속성석), risque d'« 속성동화 » (une autre stat change aussi) sauf sur 행운/견고/불멸/아스트랄 (K22).
- **흡수율** (mécanique détaillée par K21, communautaire) : absorb 20 = soigne 20 PV à l'impact + réduit de 20 % les dégâts purs (1000 → 780 avec heal, 800 à PV pleins) ; accessoires = réduction **en %**, armures = réduction **fixe**.

---

## 9️⃣ Alchimie « avancée » (≥ 12차) : 인핸서 + 보호석, destruction à l'échec

**C'est LA réponse à « alchimie avancée »** — page officielle equipmentstrength_2.html (K4), texte intégral :

- **« 12차 이상 아이템만 강화가 가능하다 »** : le nouvel onglet 강화 ne concerne **que** les items 12차+.
- **인핸서 (Enhancer)** : 4 types (무기/방어구/방패/악세서리), **obtenus par la chasse** (« 인핸서는 사냥을 통해 획득할 수 있다 »).
- **Succès** : +1 (강화등급 +1).
- **Échec** : « 아이템과 사용한 인핸서 **모두 소멸된다** » — **l'item ET l'enhancer sont détruits** (fini le reset à 0 du système classique).
- **보호석 (Protection Stone)** : « 보호석을 사용할 경우 아이템이 소멸되지 않는 대신 **강화등급이 -1 하락한다** » — évite la destruction ; en cas d'échec l'item **perd 1 niveau** d'enhancement.
- Les 보호석 sont **spécifiques au degré (12→17차) ET à la rareté (매직/레어/레전드)** — prix mall 2026 (K13) : **매직 8 실크 · 레어 16 실크 · 레전드 32 실크** (identique pour chaque degré 12/13/14/15/16/17차).

**Conséquence structurelle** : au 12차+, l'échec coûte l'objet (ou -1 avec protection) — il n'existe **plus** d'option 행운/견고/불멸/아스트랄 (le mall n'en vend que jusqu'au 11차, K14). Le « +12/+13/+14/+15 » du haut-niveau se fait donc sur ce système à haut risque, complété par les 고급 강화 엘릭시르 (§11).

> ⚠️ Aucune **table de probabilités** officielle (classique ou avancée) n'est publiée côté KR — les % du §8 sont communautaires ; pour le 12차+, aucun % n'a été trouvé nulle part (voir §17). Confirmé aussi côté ZH (RESEARCH_ZH Trouvaille 6).

---

## 🔟 Montée de degré : 각석 / 특수각석 (11차→14차)

Page officielle itemupgrade.asp (K5) — onglet « 업그레이드 » de la fenêtre d'alchimie [Y] :

- **Condition** : « **11차 +7 강화 등급 이상 아이템만** 업그레이드가 가능하며, ‘옵 레벨 강화 주문서’ 사용한 경우에는 업그레이드가 되지 않는다 » (items avec scroll d'option-level exclus).
- **각석 (Awakening Stone)** : 4 types (무기/방어구/방패/악세서리), **droppés en chasse** ; taux < 100 %.
- **Succès** : l'item monte d'**un degré** (« 연금한 아이템 차수 +1 아이템으로 성장 »).
- **Échec** : « 장비는 소멸되지 않고, **각석만 소멸된다** » — l'objet survit, seule la pierre est perdue.
- **특수 각석 (Special Awakening Stone)** : « 100 % 확률로 업그레이드 ».
- **Héritage** : « 아이템이 가지고 있던 **속성/매직속성은 승계되지 않으며, 소켓석만 승계된다** » — les stats/blues ne sont PAS conservées, **seuls les socket stones le sont**. *(Détail officiel précieux : les blues se perdent en montant de degré.)*
- **Item mall (K13)** : **11차 특수각석 45 실크 · 12차 특수각석 50 실턄 · 13차 특수각석 55 실크** (par type 무기/방어구/악세서리/방패) — descriptions : « 11차 무기를 12차로 », « 12차 → 13차 », « 13차 → 14차 ». Le cycle upgrade 12→13→14차 est donc **toujours actif** en 2026 (confirmé par namu : avant Legend 23 on montait 12→15차, K19).
- **Conversion des grades à l'upgrade** *(source EN, recoupement — E1/E4, fiabilité 2-3)* : 11D normal +7+ → 12D **매직** (« SOS ») ; 11D rare (Nova/혜성) → 12D **레어** (« SOM ») ; 11D Legend → 12D **레전드** (« SOSun ») ; le + au-delà de +7 donnerait un bonus. Cohérent avec l'échelle 매직/레어/레전드 du mall KR.

---

## 1️⃣1️⃣ 고급 강화 엘릭시르 A/B (+1/+2 garantis)

Liste officielle (K12, alchemy_item1_1.html) :

- « **고급 강화 엘릭시르는 차수별로 존재합니다** » — les **Advanced Elixirs existent par degré**.
- **고급 강화 엘릭시르 A급** (arme/armure/bouclier/accessoire) : +1, « **100 %** 장비가 강화된다 ».
- **고급 강화 엘릭시르 B급** (idem 4 types) : **+2**, 100 %.
- Usage via la 연금상자 (boîte d'alchimie), onglet 조합.
- Recoupement EN (E4, Elitepvpers/ExaySRO, fiabilité 2) : usage **unique** par item, non retirable, difficulté d'obtention 장신구 > 방어구 > 방패 > 무기 ; des vidéos montrent des items poussés au-delà de +15 via élixirs successifs (+18→+22). **Aucun chiffre KR officiel sur le plafond.**

---

## 1️⃣2️⃣ Sockets : 소켓석 (3 emplacements max)

Page officielle sokect.asp (K7) — système postérieur au socket iSRO « classique » :

- **« 하나의 아이템의 최대 3개의 소켓까지 만들 수 있다 »** — 3 sockets max par item.
- Le type de 소켓석 détermine la pièce où elle peut être posée ; **pas 2 fois la même** 소켓석 sur un item.
- **소켓석 listées** (chacune porte **un skill propre**) : **신속** (회피율 +, durée limitée), **마력** (MP +), **회복** (auto-soin), **정신력** (chance que le prochain skill ne consomme pas de mana), **체력** (HP +), **집중** (명중률 +).
- « **소켓석 등급이 아이템 등급보다 낮은 경우에는 사용할 수 없다** » ; « 소켓석 등급이 높을수록 높은 능력치 » — le grade de la pierre doit être ≥ au grade de l'item, et monte avec le grade.
- Rappel : les 소켓석 sont **les seules choses héritées** lors d'une montée de degré (§10) — d'où leur importance au haut-niveau.

---

## 1️⃣3️⃣ 연금약 : les potions d'alchimie (미풍→태풍)

Page officielle medical.asp (K6) — le « 고급 연금술 » du menu correspond en réalité aux **연금약** (processing 가공) :

| 연금약 | Effet officiel |
|---|---|
| **미풍의 단약** | +25 % vitesse de déplacement, 30 min |
| **강풍의 단약** | +50 %, 30 min |
| **질풍의 단약** | +75 %, 30 min |
| **태풍의 단약** | +100 %, 30 min |

- Fabriquées à partir de **청옥서판/적옥서판** (tablettes droppées) + **4대 원소** (대지/불/물/바람의 원소), les éléments s'obtenant en désassemblant/détruisant objets et sous-produits (론도) — **« 속성석을 제작할 때에는 실패확률이 없다 »** (échec impossible) (K6 ; détail historique 2006 : K22).
- ⚠️ Le folklore web « 청마노/정수 (화신의 정수…) » apparu dans un résumé automatique est **erroné** (mojibake/hallucination du résumeur) — le texte officiel réel parle bien de 서판 et 원소.

---

## 1️⃣4️⃣ Devil spirits tardifs, runes, consommables & item mall 2026

### 🐾 Devil spirits (mall PET/GROWTH, 55 실크 chacun — K15)

**소환 스크롤** (growling/devil spirits) : **블러드 아머 다이노, 에이션트 트라브 베어, 옐로우 스파클 오트리슈, 루비노 피닉스, 라바 로어 하운드, 하프문 재규어, 실버 백, 다크 그리핀, 크록스, 나이트 팽, 골드 혼, 소울 테일** (12 « sorts » tardifs, tous à 55 실크).
Recoupement EN (E-source devil spirit, fiabilité 2) : quête Devil Spirit liée au Roc lv 100 ; +3~+5 change le devil skill (+25 % dégâts / +15 % MS au +5) ; Devil vs Angel = même stats, look différent.

### 🧿 Runes & items d'alchimie du mall (K13)

- **봉인된 매직룬 / 봉인된 강화룬** (« rune magique/d'enhancement scellée ») : 5 실크 (x1), 47 실크 (x11) — « 교환을 통해 특정 등급의 매직룬/강화룬으로 바뀐다 » ; utilisées pour des **options spéciales** que les 연금석 normales ne donnent pas (« 동일한 장비에 연금 옵션이 중복 적용 가능 », options spéciales à basse probabilité).
- **운명의 톱니바퀴(연금)** (« rouage du destin — alchimie ») : 6 실크 / 50 실크 les 10.
- **제거의 론도** 10 실크, **전표** 20 실크.

### 🧪 Consommables & services (K15/K16)

- **Time services** : 실버/골드 타임 서비스 (1 j : 7/10 실크 ; 4 sem. : 65/92 실크) et **스킬** 실버/골드 (XP/skill-XP boost).
- **Resets** : 스킬회수약 (5 pour 15 실크) ; 스탯 회수 & 스킬 완전 초기화 par tranches 1-100 (299), 101-120 (399), **121-125 (499 실크)** → **cap 125**.
- **Divers** : 캐릭터 외형 변경 (50), 캐릭터명/길드명/직업가명 변경권 (250), 프리미엄 골드타임 4주 (250), **팡카드** (10), **지니의 램프** (14), **실크로드 상자** (15 — cf. §15), 스탯 회수…
- **In-game (non mall)** : HP/MP/원기 회복 약초, remède universel d'états 3e niveau, **망자의 정수**, 귀환서 (normal/고급/도적마을), flèches/boults, montures basiques (건한마, 신영마, 오추마, 철갑교룡마, 타조, 페가수스, 궁기, 멧돼지, 스카라베), 생명의 풀/HGP 회복약 (pets) (K16).
- **AVATAR/BOOTH (mall)** : ne vend que des stands de stall (망량/대안귀/토귀 노점 20 실크, 토망대 30) — **aucun avatar d'apparence listé** dans le mall statique 2026 (les avatars passent par les box/événements ; aucune liste officielle KR trouvée).

---

## 1️⃣5️⃣ Drops 16-17차 : Silkroad Box & Legend 22/23

- **Legend XXII** : donjon **비밀의 무덤 « Lower Secret Tomb »** (E3, vidéo EN — fiabilité 2) ; **Legend 23** (≈16/05/2023) : zones **파멸의 성전** et **비밀의 무덤**, nouveaux uniques, et **items 16-17차** (K19 ; post elitepvpers reprenant l'annonce KR, inaccessible en direct).
- **Silkroad Box (실크로드 상자, 15 실털 au mall — K15)** : taux de drop des items **17차** publiés par Srolobby « référencés sur la version coréenne officielle » (E2, EN — fiabilité 3) :
  - Armes/armures 17차 : **Legend 0,0003 % · Rare 0,0009 % · Magic 0,003 %** (par item) ;
  - Accessoires 17차 : Legend 0,0027 % · Rare 0,0081 % · Magic 0,027 % (×9 par rapport aux armes).
  - Sets 17차 nommés (EN) : CH **Platina** (armor) / **Orbis** (protector) / **Tonitrus** (garment) ; EU Platina (heavy) / Orbis (light) / Tonitrus (robe) ; armes CH « Tiger… » (Tiger Divine Sword…), EU (Draco Cornu, Packers Ictus, Atrox Afer…) ; accessoires CH **Gold Lion**, EU **Holy Lord**. *(Noms EN du post — les noms KR officiels des sets 16-17차 restent à extraire du client.)*
- **봉인구** (« sphère/médaillon de scellement ») 16차/17차, 32 실크 pièce, « 봉인 해제용 » (déverrouillage) — vu sur l'accueil du site officiel (K1) ; mécanique exacte non documentée dans les pages statiques (probablement déscellement des items 16-17차, cf. incertitudes).

---

## 1️⃣6️⃣ Glossaire coréen → français (items & alchimie)

### Degrés & grades
| Coréen | Romanisation | Français / iSRO |
|---|---|---|
| 차수 | chasu | degré (d'item) ; 12차 = 12D |
| N차 장비 | | équipement de degré N |
| 혜성의 인장 | hyeseong-ui insang | **Seal of Comet** (rare unifié 11D+ ; = « Seal of Nova » iSRO) |
| 별의 인장 / 달의 인장 / 해의 인장 | | Seal of Star / Moon / Sun (≤10D) |
| 매직 / 레어 / 레전드 | | Magic / Rare / Legend (grades 12D+) |
| 무신 / 투신 | musin / tusin | « dieu martial / dieu du combat » — tiers 11D (noms de dieux égyptiens) |
| 봉인구 | bong-in-gu | médaillon de déscellement (16-17차) |
| 아이템 숙련 패널티 | | pénalité de maîtrise d'item (12D+) |

### Alchimie
| Coréen | Romanisation | Français / iSRO |
|---|---|---|
| 연금술 | yeongeumsul | alchimie |
| 강화 / 강화등급 | ganghwa | enhancement / niveau d'enhancement (+N) |
| 강화 엘릭시르 | | élixir d'enhancement (≤11D) |
| **인핸서** | inhaenseo | **Enhancer** (élixir d'enhancement 12D+) |
| 행운의 가루 | | poudre de chance (par degré) |
| 행운 / 견고 / 불멸 / 아스트랄 | | Lucky / Steady / Immortal / Astral (options d'aide ≤11D) |
| 보호석 | bohoseok | protection stone (12-17차, par rareté) |
| 연금석 / 속성석 | | pierre magique (blues) / pierre de stat |
| 속성동화 | | « assimilation » (une autre stat change aussi) |
| **각석 / 특수각석** | gakseok | **Awakening Stone / Special Awaken Stone** (montée de degré) |
| 고급 강화 엘릭시르 A/B급 | | Advanced Elixir A (+1) / B (+2), 100 % |
| 소켓 / 소켓석 | | socket / socket stone |
| 연금약 / 단약 | | potion d'alchimie (미풍/강풍/질풍/태풍의 단약) |
| 청옥서판 / 적옥서판 / 녹옥서판 | | tablette de jade bleu/rouge/vert (craft) |
| 4대 원소 | | 4 éléments (terre/feu/eau/vent) |
| 소멸의 론도 / 파괴의 론도 / 제거의 론도 | | Rondo d'annihilation / de destruction / de retrait |
| 옵 레벨 강화 주문서 | | scroll d'option-level (bloque l'upgrade) |
| 세트 강화 | | bonus de set : niveaux d'enhancement offerts |
| 진은주화 | jin-eun juhwa | pièces d'argent véritable (monnaie des sets) |
| 스탯 회수 / 스킬 완전 초기화 | | reset de stats / reset total de skills |

### Items & sets du haut-niveau (noms officiels)
| Coréen | Type | Équivalent/lecture |
|---|---|---|
| 마신검 / 용비도 / 황룡뇌극 / 참장봉신비도 / 용왕장궁 / 룡 두갑 방패 | armes 12차 CH | sword/blade/spear/glaive/bow/shield « dragon » |
| 청룡검 / 참룡도 / 용섬극 / 폭참마도 / 용마궁 | armes 13차 CH | armes « dragon céleste » |
| 세이튼스피리트, 데모고르곤, 데빌스레이닝, 인페르노토쳐, 어비스 레인, 이블 소울 라이징, 카오틱어비스, 헤븐스셀베이션, 데몬즈하울 | armes 12차 EU | thèmes démons/enfer |
| 드래곤 페나, 디스트로이어, 그레이트 듀엘, 드래곤 피어, 드래곤 브레스, 드래고닉 소울, 어비스 타이푼, 허리케인 랩소디 | armes 13차 EU | thèmes dragon/tempête |
| 룡위 보문 / 봉황룡 / 천 촉룡 | sets 12차 CH | armor/protector/garment « dragon » |
| 헤븐 / 엔젤 / 디보션 | sets 12차 EU | heavy/light/robe |
| 템페스트 / 프로셀라 / 브리즈 | sets 13차 | Tempest/Procella/Breeze |
| 여의주반지 / 드래곤링 / 폭풍석 / 블루 스톰 | bijoux 12-13차 | perle du dragon, dragon ring, pierre de tempête, blue storm |
| 아주라이트 / 케프타 / 아페피타 / 텍타이트 / 아문 / 플레나이트 / 이시스 | sets 11차 | Azurite, Khepri, Apepi, Tektite, Amun, Plenaite, Isis |
| 혼령 추혼검, 아슈, 아조스, 몬트센, 수테크, 라그니우스, 티폰, 누트리타, 수낙트라, 세드온, 세이케스 | armes 11차 (tiers) | panthéon égyptien (Shu, Anubis, Montu, Set, Selket, Typhon, Nut, Neith, Sed) |
| 신속/마력/회복/정신력/체력/집중의 소켓석 | sockets | célérité/mana/soin/esprit/PV/précision |
| 봉인된 매직룬 / 강화룬, 운명의 톱니바퀴 | mall | runes scellées magie/enhancement, rouage du destin |
| 망자의 정수 | consommable | essence des morts |
| 파멸 (2/6) | set effect | « Perdition » — bonus de set 11D |
| 신전 / 파라오의 무덤 / 유피테르 신전 / 비밀의 무덤 / 파멸의 성전 | donjons | Job Temple (105+, tenue de métier) / Tombe du Pharaon (100+ party) / Temple de Jupiter (Legend 12) / Secret Tomb / Temple de la Perdition (Legend 23) |

---

## 1️⃣7️⃣ Incertitudes non résolues

1. **Où s'obtiennent les items 12/13/14/15차** (quels donjons/mobs/quétes précis) : aucune page officielle KR lue ne documente les sources de drop 12차+ ; les tables s'arrêtent aux noms/stats. Pistes non vérifiées : Job Temple (신전, 105+), 파라오의 무덤, FGW 110+, donjons Jupiter (K17/K20).
2. **Noms/stats officiels KR des 14/15/16/17차** : seuls les noms EN (Srolobby, E2) et les 보호석/특수각석 du mall (jusqu'à 17차) existent publiquement ; extraction client requise.
3. **Taux officiels** : aucun % officiel pour l'enhancement (classique ET 12차+), l'upgrade 각석, les sockets, ni les box. Les 70→10 % du §8 sont communautaires (K21) ; pour le 12차+, aucun chiffre nulle part — **extraction client seule voie** (confirme RESEARCH_ZH).
4. **Plafond d'enhancement 12차+** : non documenté côté KR (les vidéos EN suggèrent +15+ via élixirs avancés, E3/E4 — non officiel).
5. **봉인구 16/17차** : vue sur l'accueil officiel (32 실크, « 봉인 해제용 ») mais mécanique exacte (déscellement d'items obtenus scellés dans les box ?) non documentée publiquement.
6. **Équivalence formelle 무신/투신 ↔ « Egyptian A/B »** iSRO : très probable (dieux égyptiens + Job Temple) mais inférence, pas un texte officiel.
7. **혜성의 인장 = « Seal of Nova »** : correspondance cross-services (KR officiel / iSRO EN / TW 彗星) logique et concordante, mais aucun document bilingue trouvé qui l'énonce.
8. **Prix marché (시세)** : aucune cotation coréenne trouvée pour les items 12차+ (le commerce se fait in-game ; pas de DB de prix publique).
9. **Avatars** : aucune liste officielle KR d'avatars tardifs (le mall statique n'en vend pas) — les listes existantes sont EN/TR (ExaySRO, Extraloob, fiabilité 2).
10. **Dates KR précises** : introduction du 13차 (avant 03/2012, puisqu'offert au comeback), du 14차/15차, et contenu exact des Legend 13-21 — non trouvées (numérotation KR à cartographier, cf. RESEARCH_KO §5).
11. **News officielles 2026** (« 26.08.19 신규 아이템 드롭 관련 안내 », « 확률형 아이템 안내 ») : listées sur le site mais les pages individuelles (news_view.asp) renvoient « denied » sans session navigateur — contenu non exploitable ici.

---

## 1️⃣8️⃣ Recommandations pour SRObro

1. **Mettre à jour `07_ITEM_DEGREES.md`** : ajouter 11차 (3 tiers, seal 혜성의 인장, Lv 101), 12차/13차 (thèmes dragon/tempête, Lv 101 fixe + pénalité), 14-17차 (existence via mall/Legend 23). Le degré n'est plus un intervalle de niveaux après 10D.
2. **Mettre à jour `05_ALCHEMY_SYSTEM.md`** avec la **bifurcation officielle** : ≤11차 (elixirs + poudre + 행운/견고/불멸/아스트랄, reset/destruction) vs **≥12차 (인핸서 : destruction de l'item à l'échec ; 보호석 par degré+rareté : -1)** — source officielle K4/K13.
3. **Ajouter l'upgrade de degré** (각석/특수각석, condition 11차+7, perte des blues, héritage des sockets, prix mall) et les **고급 강화 엘릭시르 A/B** — nouveaux systèmes à documenter avec les noms KR officiels.
4. **Corriger le vocabulaire seals** : « Seal of Nova » → nom iSRO ; côté KR le seal 11D+ officiel est **혜성의 인장 (Seal of Comet)** ; **« Aquila » : à bannir** de la base (aucune attestation).
5. **Intégrer les noms KR officiels** des armes/sets 11-13차 (§5-§7) et le glossaire §16 dans `MULTILINGUAL_GLOSSARY.md` / `ITEMS_DATABASE.md` (layer display KR).
6. **Ne pas importer** les taux des privés/box (E2) comme officiels ; les marquer « non officiel / dérivé KR ».
7. **Pistes d'extraction** : les tables officielles EUC-KR (K8-K12) sont moissonnables par script (fait ici) ; le client reste la source pour 14-17차 et tous les taux.

---

*Rapport généré le 2026-10-01 — recherche web coréenne (WebSearch KO) + extraction directe du site officiel KSRO (curl + conversion EUC-KR manuelle). namu.wiki/onul.works restant bloqués (403), leur contenu n'est utilisé qu'en extraits de moteur de recherche. Aucun autre fichier du dépôt n'a été modifié.*
