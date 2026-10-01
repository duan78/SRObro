# 🔎 RESEARCH_AR_DEV — Recherche web arabophone sur Silkroad Online (الطريق الحريري / سيلكرود)

> 📅 **Campagne :** 2026-10-01 · ~50 requêtes WebSearch en arabe (+ quelques croisements EN) et ~15 WebFetch/webReader
> 🎯 **Objectif :** recenser l'écosystème communautaire et technique **arabe** de Silkroad Online : forums majeurs (silkroad4arab…), guides chiffrés (SP, alchimie, uniques), panorama des serveurs privés arabes 2010-2026, glossaire AR→FR, et trancher la question de la **localisation arabe officielle** (client PC vs site 2010 vs mobile 2024-2026).
> ⚖️ **Règle d'or respectée :** aucune donnée inventée — chaque chiffre/affirmation cite son URL. Les pages en arabe sont citées et traduites fidèlement ; les incertitudes sont signalées en §8.

---

## 📇 1. Index des sources arabophones (fiabilité 1-5)

| # | Source | Type | Fiabilité | Notes |
|---|--------|------|-----------|-------|
| A1 | [Wikipédia arabe — سيلكروود أونلاين](https://ar.wikipedia.org/wiki/%D8%B3%D9%8A%D9%84%D9%83%D8%B1%D9%88%D9%88%D8%AF_%D8%A3%D9%88%D9%86%D9%84%D8%A7%D9%8A%D9%86) | Encyclopédie communautaire | **4** | Riche (triangle des métiers, caps, Fortress War, Legend VII) ; réfs de 2006, aucune mention de localisation arabe |
| A2 | [silkroad4arab.com](https://www.silkroad4arab.com/vb) — « الموقع العربي الاول للعبة Silkroad Online » | Forum historique (vBulletin) | **5** (existence/stats) / **3-4** (contenu threads) | LE forum arabe SRO depuis ~2006-2007 ; stats vérifiées via Wayback (§2.2) |
| A3 | [s4a — الشرح الكامل عن الكيمياء (t=13226, 18/02/2008)](https://www.silkroad4arab.com/vb/showthread.php?t=13226) | Guide alchimie 2008 | **4** | Par « Amr Mando » (Le Caire, serveur Lepus) — plus vieil guide daté retrouvé |
| A4 | [s4a — Sp Farming اسراره و خفاياه (p=381592)](https://www.silkroad4arab.com/vb/showthread.php?p=381592) | Guide SP farming | **4** | Très chiffré (gap 0-9, méthode coréenne) — §4.1 |
| A5 | [s4a — شرح رموز و اختصارات الشات (t=514685, 2013)](https://silkroad4arab.com/vb/showthread.php?t=514685) | Glossaire communautaire | **4** | Base du glossaire §7 |
| A6 | [s4a — الشرح الكامل لـ Fortress war (t=584722)](https://www.silkroad4arab.com/vb/showthread.php?t=584722) | Guide Fortress War | **3** | 3 forteresses, rôles internes de guilde |
| A7 | [s4a — كل ما تريد معرفته عن Uniques (t=581292)](https://www.silkroad4arab.com/vb/showthread.php?t=581292) | Guide uniques | **3** | HP des 5 uniques classiques + respawn 24 h ; extraction bruitée → recoupé avec A20 |
| A8 | [s4a — Anoha-PVE Cap 130/140 (t=636665, GO 07/04)](https://www.silkroad4arab.com/vb/showthread.php?t=636665) | Présentation de serveur (par l'admin du forum) | **4** | Fiche serveur ultra-détaillée : routes trade, events quotidiens, uniques custom — §4.4/§5 |
| A9 | [s4a — احسن سيرفر سيلك رود (t=608366, 12/2016→2020)](https://www.silkroad4arab.com/vb/showthread.php?t=608366) | Fil de recommandations | **3** | Athena, Lyra, BlackRobber ; témoignages « شوية عرب + مصريين » |
| A10 | [s4a — sections dev : f=289 (création serveurs)](https://www.silkroad4arab.com/vb/forumdisplay.php?f=289), [f=183 (PK2 Edit)](https://www.silkroad4arab.com/vb/forumdisplay.php?f=183), [f=633 (Data Base)](https://www.silkroad4arab.com/vb/forumdisplay.php?f=633), [f=689 (ST-Filter)](https://www.silkroad4arab.com/vb/forumdisplay.php?f=689), [f=407 (programmation)](https://www.silkroad4arab.com/vb/forumdisplay.php?f=407) | Sections techniques | **4** | Cartographie du dev arabe (§3.1) |
| A11 | [s4a — شرح طريقة عمل سيرفر للمبتدئين (t=444580)](https://silkroad4arab.com/vb/showthread.php?t=444580) | Tuto création serveur | **3** | srGlobalService.ini / srNodeType.ini / srShard.ini, Cert, Smc, SQL Server |
| A12 | [ProBasha — probasha.com](https://probasha.com) + [forums](https://probasha.com/forums) | Forum dev arabe moderne (XenForo) | **4** | « أكبر موقع عربي لسيرفرات Silkroad الخاصة (vSRO et iSRO) » : 3 099 membres, 1 345 fils, 10 576 messages ; VPS/فلاتر à la vente |
| A13 | [ProBasha — شرح عمل سيرفر Silkroad كامل (thread 73)](https://probasha.com/threads/73) | Tuto création serveur | **4** | SR_GameServer/SR_ShardManager, AgentServer, machine.ini, port 15779, SQL 2014+ |
| A14 | [YouTube — Archer Tales, « القصة الكاملة لأعظم لعبة من جيل التسعينات » (06/02/2026, 19:52, 47 807 vues)](https://www.youtube.com/watch?v=OtZDIhMmxBE) | Documentaire égyptien (transcript intégral lu) | **3** | Mémoire orale ÉG : cybercafés, serveurs officiels Alexander/Gaia/Sparta, Egy Coin, folklore fuite vSRO — §2.1 |
| A15 | [YouTube — Silkroad بالعربي (@silkroadinarabic)](https://www.youtube.com/@silkroadinarabic) + [FB](https://www.facebook.com/silkroadinarabic) | Chaîne/page de guides arabes | **3** | Quêtes Inventory Expansion, Wheels, Thief Kalia ; alerte sonore bot→unique |
| A16 | [Google Play — Silkroad Origin Mobile Arabia (com.silkroad.arab, MAJ 02/08/2026)](https://play.google.com/store/apps/details?id=com.silkroad.arab&hl=ar) + [App Store EG (id 6783244528)](https://apps.apple.com/eg/app/silkroad-origin-mobile-arabia/id6783244528) + [sromarabia.com](https://sromarabia.com/home) + [wiki officiel arabe](https://sromarabia.com/wiki) | Officiel (mobile) | **5** | Localisation arabe OFFICIELLE complète, licence WeMade Max, PEGI 16 — §6.3 |
| A17 | [IGN — « Joymax Announces the Launch of Arabic Language Service » (22/01/2010)](https://www.ign.com/articles/2010/01/22/joymax-announces-the-launch-of-arabic-language-service-for-fantasy-mmorpg-silkroad-online) + [Engadget/Massively (03/02/2010)](https://www.engadget.com/2010-02-03-silkroad-online-celebrates-their-new-arabic-language-service-wit.html) + [GamesIndustry.biz (Turc puis AR/DE/ES)](https://www.gamesindustry.biz/silkroad-online-historical-online-rpg-launches-turkish-language-service-arabic-german-and-spanish-versions-to-follow) | Presse officielle 2010 | **5** | Service linguistique arabe lancé le **02/02/2010** — §6.1 |
| A18 | [ArabMMO — « دليل لعبة Silk Road : التسجيل والتحميل » (19/05/2010)](https://www.arabmmo.com/content/2010-05-18/20100518224914238.html) | Presse gaming arabe 2010 | **3** | Confirme le **site officiel en arabe** (joymax.com/silkroad) pour l'inscription — §6.1 |
| A19 | Wayback Machine — captures de silkroad4arab.com/vb : [30/01/2008](https://web.archive.org/web/20080101/http://www.silkroad4arab.com/vb/), [13/06/2012](https://web.archive.org/web/20120601/http://www.silkroad4arab.com/vb/), [29/12/2015](https://web.archive.org/web/20160101/http://www.silkroad4arab.com/vb/) | Archives | **4** | Croissance du forum + listes de sous-forums serveurs (attention encodage 2015) |
| A20 | [ExaySRO Wiki — Unique Locations](https://wiki.exaysro.com/books/guides/page/unique-locations) | Wiki d'un serveur à public arabe | **3** | HP uniques = données officielles iSRO ; serveur cap 130 « Reborn » ([starting guide](https://wiki.exaysro.com/books/guides/page/starting-guide)) |
| A21 | [GTop100 — Egypt](https://gtop100.com/Silkroad-Online/Country/Egypt) + [Gamehot — Egypt](https://gamehot.net/silkroad/country/EG) + [silkroad-servers.com](https://sro-servers.com) | Annuaires de serveurs | **2-3** | Egypt SRO cap 120, Legend-Sro cap 130 DG14, Saturn D11, QIAN Online (GO 27/02/2026), Classic Silkroad 110 D11 |
| A22 | [Reddit r/silkroadonline — « About private servers »](https://www.reddit.com/r/silkroadonline/comments/1kdopp1/about_private_servers) | Perception communautaire | **3** | « These servers are usually run by 'Egyptian' people… it's just the truth » — poids des Égyptiens dans le pserv |
| A23 | [TikTok/Facebook — Nasser Gaming (@nassergamertv)](https://www.tiktok.com/@nassergamertv/video/7536872205418827028) / [page FB](https://www.facebook.com/nassergameing) | Créateur de contenu arabe | **2** | « أقوى سيرفر عربي » ; couvre ERIOS (105, beta), SRO OLD (cap 140), Classic Story (105) |
| A24 | [Facebook — SromArabia](https://www.facebook.com/sromarabia) (officiel mobile AR), [Silkroad Origin Arab](https://www.facebook.com/SROOriginArab), [groupe Silkroad Online (Egypt)](https://www.facebook.com/groups/6856039677843208/), [groupe srooriginarab](https://www.facebook.com/groups/srooriginarab) | Communautés FB/Discord | **2-4** | Écosystème social actuel ; [Discord Silkroad Origin Arab](https://discord.com/invite/silkroad-origin-arab-1231622557560602664) autoproclamé « plus grande communauté arabe » |
| A25 | [A3lam KSA (14/07/2026) — partenariat saoudo-vietnamien GOSU × الامتياز العصرية](http://a3lam-ksa.net/90672-2) | Presse saoudienne | **3** | Lancement régional MENA de SRO Origin Mobile Arabia, événement à Djeddah — §6.3 |
| A26 | [SRO Times — site](https://www.srotimes.com) / [Discord (24 954 membres)](https://discord.com/invite/srotimes) / [FB](https://www.facebook.com/SroTimes110) | Serveur + communauté | **3** | Saison CAP 80 janvier 2026 ; se dit « السيرفر الوحيد اللي معاه Discord Partner » (seul serveur avec Discord Partner) |
| A27 | [Forum دلوcty (delwa2ty.yoo7.com) — guide alchimie](https://delwa2ty.yoo7.com/t1036-الشرح-الكامل-عن-الكيمياء-في-silkroad) | Petit forum égyptien | **2** | Copie/adaptation des guides s4a ; atteste la diffusion égyptienne |
| A28 | [s4a — أنواع البوس (p=2725443-46)](https://www.silkroad4arab.com/vb/showthread.php?p=2725846) | Fil humoristique égyptien | **2** | Jeu de mots sur « بوس/boss » — culture communautaire, pas donnée de jeu |
| A29 | [Elitepvpers — Elamidas-Earnest Innovation (10D, 35x)](https://www.elitepvpers.com/forum/sro-pserver-advertising/3390230-elamidas-earnest-innovation-10d-35x-auto-events-dungeons-long-term-jobbing.html) + [ex-Skalidor 2](https://www.elitepvpers.com/forum/sro-pserver-advertising/3005572-elamidas-beta-testing-skalidor-2-a-post29319111.html) | Annonces serveur | **3** | Elamidas = suite de Skalidor, équipe LastThief/Royalblade/Dizzie ; très populaire chez les Arabes (sous-forum s4a) |
| A30 | [RaGEZONE — « Silkroad Online Arabian »](https://forum.ragezone.com/threads/silkroad-online-arabian.1225475) | Thread dev | **2** | Existe mais 403 en fetch direct — contenu non vérifiable |

**Verdict écosystème :** contrairement au Brésil (RESEARCH_PT), le monde arabe possède **un forum-monument toujours en ligne** (silkroad4arab, ~200 k membres) **couvrant jeu ET dev**, relayé aujourd'hui par Facebook/TikTok/Discord et un forum dev moderne (ProBasha). Il n'existe en revanche **aucun wiki arabe dédié au jeu PC** (le seul wiki arabe officiel est celui du mobile, A16).

---

## 🌍 2. La communauté arabe SRO — histoire, géographie, taille

### 🇪🇬 2.1 Origines et mémoire (2006 → aujourd'hui)

- **Présence dès avril 2006** : un joueur posteur sur le groupe Origin ([FB](https://www.facebook.com/groups/srooriginm/posts/1123027985444864)) y partage son plus vieil screenshot, daté **14/04/2006**, face au géant Hyeongcheon — les Arabes jouaient donc sur iSRO dès le premier printemps du jeu.
- **L'ère des cybercafés (السايبرات)** : le documentaire égyptien Archer Tales (A14) raconte : *« كنا بنلعب في السايبرات لحد الصبح »* (« on jouait au cyber jusqu'au matin »), les files d'attente (*« بتقعد قدامها بالساعات من غير ما تكون لعبت فيها دقيقة »* — des heures devant l'écran sans jouer une minute) et l'arrivée du **DSL en 2007** (commentaires du même documentaire, [YouTube](https://www.youtube.com/watch?v=OtZDIhMmxBE)).
- **Serveurs officiels de rassemblement arabe** : la capture Wayback de janvier 2008 du forum cite les échanges de comptes sur **Eldorado, Red Sea, Oasis** (A19-2008) ; le documentaire cite **Alexander (الكسندر), Gaia (جايا), Sparta (سبارتا)** — *« العمرانية كلها وقتها كانت في السيرفر بتاع سبارتا »* (« tout le quartier d'Al-Omraniya était sur Sparta ») (A14). Les Arabes se regroupaient donc sur des serveurs iSRO à forte communauté, jamais localisés.
- **Fierté égyptienne** : l'ajout d'**Alexandrie** au jeu est vécu comme *« بلدك موجودة في لعبتك المفضلة »* (« ton pays est dans ton jeu préféré ») ; le documentaire détaille les **uniques égyptiens (Sphinx, Anubis)** qui droppent de l'**Egy Coin (الايجي كوين)** servant à acheter les armes **D11 « Egy A/B »** (A14).
- **Poids démographique** : un thread Reddit récent affirme que la majorité des serveurs privés actuels *« are usually run by 'Egyptian' people »* (A22) — l'Égypte est le centre de gravité ; le Maghreb est très discret en ligne (cf. §8), le Golfe apparaît via un serveur « United Arab Emirates Cap 140 » ([silkroad-servers.com](https://sro-servers.com/details/sedon)) et le partenariat saoudien de 2026 (A25).
- **La « mort » et la nostalgie** : même documentaire : *« اللعبة دلوقتي ماتت اكلينيكيا »* (« le jeu est aujourd'hui cliniquement mort ») mais reste *« الأسطورة اللي مش هتتكرر »* (« la légende qui ne se répétera pas ») (A14).

### 📊 2.2 silkroad4arab.com — le forum-monument (chiffres Wayback + actuels)

| Date | Membres | Sujets | Messages | Connectés (record) | Source |
|------|---------|--------|----------|--------------------|--------|
| 30/01/2008 | **9 251** | 91 795* | 11 660* | 58 en ligne | [Wayback 2008](https://web.archive.org/web/20080101/http://www.silkroad4arab.com/vb/) (A19) |
| 13/06/2012 | **241 806** | 101 186 | 2 975 391 | record 3 271 | [Wayback 2012](https://web.archive.org/web/20120601/http://www.silkroad4arab.com/vb/) (A19) |
| 29/12/2015 | **313 016** | 128 211** | 3 636 027** | **record 17 621 le 16/07/2014** | [Wayback 2015](https://web.archive.org/web/20160101/http://www.silkroad4arab.com/vb/) (A19) |
| 2026 (snippet indexé) | **199 025** | 407 969 | 3 645 747 | — | [silkroad4arab.com/vb](https://www.silkroad4arab.com/vb) via recherche (A2) |

\* colonnes possiblement inversées dans la capture 2008. \*\* capture 2015 en encodage corrompu — threads/posts inversés ici par cohérence avec 2012 et 2026.
Lecture : fondation ~2006/2007 (première capture Wayback : 24/05/2007 ; threads à IDs ~14 000 dès 2006-2007), boom 2008-2012 (×26 membres), pic ~2014-2015 (**17 621 connectés simultanés**), puis déclin/purge (199 k membres en 2026, forums quasi dormants — le forum « serveurs privés » n'est plus qu'un espace social avec une section Discord, [f=228](https://www.silkroad4arab.com/vb/forumdisplay.php?f=228)). L'activité arabe a migré vers **Facebook, TikTok et Discord** (A23, A24, A26).

Autres espaces : groupe FB « Silkroad Online (Egypt) » (A24), « Silkroad Origin Arab » (page + groupe + Discord, A24), page arabe de guides « Silkroad بالعربي » (A15), forums égyptiens mineurs (delwa2ty A27). Le forum **ProBasha** (A12) concentre aujourd'hui le dev arabe (3 099 membres mais 289 visiteurs en ligne).

---

## 🛠️ 3. Le développement côté arabe

### 🧩 3.1 Cartographie des sections dev de silkroad4arab (vBulletin)

| Section (trad.) | ID | Contenu observé |
|---|---|---|
| **Tutos & logiciels pour créer des serveurs privés** (شروحات وبرامج عمل السيرفرات الخاصة) | [f=289](https://www.silkroad4arab.com/vb/forumdisplay.php?f=289) | Tuto complet débutants : `srGlobalService.ini`, `srNodeType.ini`, `srShard.ini`, Cert, Smc, SQL Server ([t=444580](https://silkroad4arab.com/vb/showthread.php?t=444580)) |
| **PK2 Edit** | [f=183](https://www.silkroad4arab.com/vb/forumdisplay.php?f=183) | « شرح التعديل على الانشر » (modif de l'enhance), [bases PK2 (t=450541)](https://www.silkroad4arab.com/vb/showthread.php?t=450541) (DDS/BMP), [« أسهل Pk2 Editor » (t=546927)](https://www.silkroad4arab.com/vb/showthread.php?t=546927), [archive img](https://silkroad4arab.com/vb/archive/index.php/f-183.html) |
| **Data Base** (قسم خاص بالـ Data Base) | [f=633](https://www.silkroad4arab.com/vb/forumdisplay.php?f=633) | « data base egyptsro d13 cap 120 », [Release : قاعدة بيانات ProSro Full (t=636097)](https://www.silkroad4arab.com/vb/showthread.php?t=636097) |
| **ST-Filter** | [f=689](https://www.silkroad4arab.com/vb/forumdisplay.php?f=689) | [ST Filter v2.6.2 + GUI (t=637806)](https://silkroad4arab.com/vb/showthread.php?t=637806), [tuto d'installation SQL+DLL+GUI (t=638061)](https://www.silkroad4arab.com/vb/showthread.php?t=638061) — filtre proxy vSRO (protection + auto-events) |
| **Programmation** | [f=407](https://www.silkroad4arab.com/vb/forumdisplay.php?f=407) | « HTML من الألف إلى الياء », création de programmes pour Silkroad |
| Bots (fils dédiés) | — | SBot, mBot, PhBot, IBot, AgBot, StealthLite, SroKing, T-Bot… (Wayback 2012/2015, A19) |
| **Silkroad-R** | — | sous-forums Thebes / Gobi / Merv (Wayback 2015, A19) |

### 🔧 3.2 Le tuto arabe type « création de serveur » (ProBasha, 2020s)

Le guide de référence actuel ([probasha.com/threads/73](https://probasha.com/threads/73), A13) couvre, en arabe : installation **SQL Server 2014+**, ouverture du port **15779**, lancement de **SR_ShardManager puis SR_GameServer**, configuration de l'**AgentServer**, édition de **machine.ini** (mots de passe certification), re-génération de dépendances et lancement du **Smc** — le pipeline vSRO classique, entièrement documenté en arabe. Les vidéos arabes YouTube complètent ([serveur complet + site](https://www.youtube.com/watch?v=X4yxP4RmwmY) avec lien MEGA de fichiers, [CustomCertificationServer & co](https://www.youtube.com/watch?v=nCJSEb6oQjE), [erreurs C7 & DC iSRO](https://www.youtube.com/watch?v=KgE1d9GzrVQ), [serveur sans internet](https://www.youtube.com/watch?v=z8y34eHz_TY)). **ProBasha** vend en sus services **VPS Windows** et publie des **Database Releases** et **Website Releases** (sous-forums, A12) ainsi qu'une section « Protection & Exploit vSRO » (DDoS, anti-bot, patches, modification du code source) ([probasha.com/forums/24](https://probasha.com/forums/24)).

### 📜 3.3 Le folklore arabe de la fuite vSRO

Le documentaire Archer Tales (A14) donne la version communautaire égyptienne de l'origine des fichiers serveur : *« جويا ماكس قررت تسريح عدد كبير من المبرمجين والمطورين اللي عمرو اللعبة… مشوا بالملفات معاهم وقرروا ينتقموا من الشركة بطريقتهم — هم اللي بدأوا يسرّبوا ملفات اللعبة ويعملوا السيرفرات الخاصة »* (« Joymax, à son apogée, a licencié une partie des programmeurs qui avaient construit le jeu ; ceux-ci sont partis avec les fichiers et ont commencé à les fuiter par vengeance »). **Folklore à ne pas confondre avec la historiographie EN** (fuite vSRO 1.188 généralement datée ~2011-2012 dans les sources anglophones ; le guide ProBasha A13 situe lui-même la fuite en **2009**). Aucune source arabe ne prétend que la fuite est arabe — les Arabes sont des **diffuseurs et intégrateurs** (DB custom, filtres, traductions), pas les leakéurs d'origine.

### 🈚 3.4 Traductions / arabisation

- **Projet d'arabisation communautaire** : le fil [« موضوع تعريب silkroad — مشكلة وحل بسيط » (t=190071)](https://silkroad4arab.com/vb/showthread.php?t=190071) propose de faire traduire le jeu « par des frères arabes qui traduisent programmes et jeux » (lecture partielle via snippet ; fetch 403). Le fil [« طريقة الكتابة بالغة العربية داخل اللعبة » (p=1300922)](https://silkroad4arab.com/vb/showthread.php?p=1300922) explique comment **écrire en arabe dans le chat** du client — preuve indirecte que le client PC n'affichait pas nativement l'arabe (sinon pas besoin d'astuce).
- **Aucune itemdata/textdata arabe complète retrouvée** : les releases partagées (ProSro Full DB t=636097, « egyptsro d13 » f=633) sont des DB de jeu en anglais ; aucun pack « client arabe PC » indexé. Les traductions arabes massives n'existent que dans le **mobile officiel** (§6.3).
- **RaGEZONE** : un thread « Silkroad Online Arabian » existe (A30, 403) ; pas de release arabe majeure identifiée sur RaGEZONE lors de cette campagne.

---

## 🔢 4. Données chiffrées des guides arabes

### 📈 4.1 SP farming (guide A4 — le plus chiffré)

- **400 skill experience = 1 skill point** ; **plafond total des maîtrises = 300**.
- **Expérience d'un mob de niveau 16 (répartition EXP/SP selon le gap)** : gap 0 → **400 EXP + 100 SP = 500 total** ; gap 6 → **230 + 185 = 415** ; gap 9 (max) → **30 + 220 = 250**. *« Chaque point de gap convertit de l'EXP en SP »*.
- Passer niveau 16→17 demande **30 902 EXP**, soit ≈ **127 840 EXP totale** ; monter **une** maîtrise à 16 coûte **128 SP** ; une maîtrise au niveau **n** coûte **n²/2** SP.
- **Méthode coréenne** (CH) : arc + garment, spot « **Stronghold** » à l'est de Jangan (archers), de-level par morts répétées, ~**40 000 SP** ; **méthode européenne** : farmer jusqu'au **niveau 29 → ≈ 34 000 SP**.
- Recommandations du guide : **10-30 k SP** pour une maîtrise, **30-50 k** pour deux ; astuce Cold niveau 5 pour les INT (contrôle des mobs).
- *(Corroboration moderne, non arabe : Origin Online, quête lvl 100-101 « 300 monstres → 2 801 540 EXP + 250 SP », [forum.playorigin.com](https://forum.playorigin.com/showthread.php?7167-How-To-Farm-SP).)*

### ⚗️ 4.2 Alchimie (guides A3, A27 + [Advanced Elixir t=576620](https://www.silkroad4arab.com/vb/showthread.php?t=576620))

- **4 issues possibles d'un Fuse** (guide de 2008, trad. fidèle) : ① réussite → objet **+1** ; ② échec sans changement (**rare**) ; ③ échec → retour à **+0** ; ④ échec → **l'objet disparaît** (**rare**).
- **Éléments** : 4 types (terre/vent/feu/eau) ; **Destroyer Rondo** (boutique d'accessoires) pour détruire les objets en éléments ; **Void Rondo** pour transformer objets → tablettes ; **tablette + éléments → pierre d'attribut**. Exemple chiffré : tablette feu lvl 2 (76 unités requises) = terre lvl 3 ×**80** + eau lvl 1 ×**57** + feu lvl 3 ×**20** + vent lvl 1 ×**229**.
- **Advanced Elixir A = +1, B = +2, réussite 100 %**, impossible sur objet Bound (t=576620).

### 👹 4.3 Uniques (guides A7 + wiki A20 — valeurs iSRO confirmées)

- Définition (A7, trad.) : *« monstre très puissant programmé pour apparaître à heure et lieu précis ; niveau > 20 requis (15 ou 10 sur certains serveurs privés) »* ; **respawn toutes les 24 h, spawn unique** à **13 h 00** (A20).
- **HP (iSRO)** : **Tiger Girl 598 720 · Uruchi 1 779 528 · Isyutaru 4 324 612 · Lord Yarkan 23 572 242 · Demon Shaitan 67 225 920** (A7 recoupé avec A20 — identiques à la base SRObro). Le guide arabe note les **variantes serveurs privés** (ex. Origin : Uruchi 1 780 285, Isyutaru 4 326 347, Yarkan 24 297 547) et une ambiguïté sur le niveau de Tiger Girl (**18** sur beaucoup de privés vs **20** officiel).
- **Egy Coin** : monnaie dropée par les uniques égyptiens (Sphinx, Anubis) à Alexandrie, contre armes **D11 Egy A/B** (A14).

### 🏰 4.4 Fortress War, trade et événements (A6, A8, A1)

- **Fortress War** (A6, trad.) : **3 forteresses** — Jangan (جانجان), Hotan, Bandit (قلعة الحرامية) ; guilde occupante vs candidates ; rôles internes : chef de guilde, candidats, effectifs de défense, « quartier général », chef des opérations, commandant de bataille, **espion**, trésorier (6 unions max côté occupant) ; mini **guerre interne de guilde** incluse.
- Wikipédia arabe (A1) : job dès le **niveau 20**, adhésion **10 000 gold**, changement après **7 jours** (amende **10 M gold** post-Legend VII), FW unions de **8 guildes / jusqu'à 400 joueurs**, inscription **5 M gold** deux jours avant, **chaque jeudi 22 h 00**.
- **Trade sur serveur arabe type (Anoha, A8)** : run 5★ — achat **120 M gold** / revente **300 M** → **bénéfice 180 M par run** ; routes « special » ×4 (de Donwhang) et ×6 (de Jangan), 1 h/jour ; auto-equipment D1→D10, D11 or (Alexandrie), D12 SoS or, D13 sur mobs 121-125, D14 sur mobs 126-130 ; **Sky Temple** (4 temples A/B/C/D, mobs 126→130, drop 14D SoS/Moon/Sun) ; **Play Coin : 30 % de drop par mob** ; **silk gratuit 10/heure** ; **max +16 sans Adv** ; PC limit 8 ; Free Silk events quotidiens (2 h Battle Arena → 20 Honor Coins vainqueur / 10 perdant ; FW deux fois par semaine mardi + vendredi ; horaires événements de 14 h à 1 h du matin) ; système **Reborn** (reset niveau 1 + 300 CS) ; commandes custom `!lock/!unlock` contre le vol de compte.

### 💰 4.5 Économie & monétisation vécues par les Arabes

- **Silk (السيلك/الحرير)** acheté via « الشحن » (recharge) ; cartes **Magic Pop à 10 silks** la carte (loterie, [Elitepvpers](https://www.elitepvpers.com/forum/silkroad-online/302204-magic-pop-card.html) via requête AR) ; promos Joymax relayées sur le forum arabe (« achete une carte Magic Pop, reçois-en deux », [t=486441](https://www.silkroad4arab.com/vb/showthread.php?t=486441)).
- **Gold = « الروح »** (« l'âme ») ; élixirs surnommés *« المخدرات الرسمية للعبة »* (« la drogue officielle du jeu ») ; fermes de gold à **100 comptes bottés** revendues contre de l'argent réel (A14).
- **Section « scammers »** (قسم النصابين) et signalements d'arnaques dans les captures 2012 (« Report scammer… », A19) — risque permanent du commerce inter-joueurs arabe.

---

## 🗺️ 5. Panorama des serveurs privés arabes (2010-2026)

### 📋 5.1 Tableau des serveurs arabes ou à public arabe identifiés

| Serveur | Cap / Degré | Contenu / particularités | Période·Statut | Source |
|---------|-------------|--------------------------|----------------|--------|
| **Egypt SRO** | Cap 120 | Sous-forum dédié sur s4a ([f=632](https://www.silkroad4arab.com/vb/forumdisplay.php?f=632), accès inscrits) ; « avec Sbot » | ~2013-2016 · mort | A21, A2 |
| **Egyptsro** | D13, cap 120 | DB partagée sur s4a (« data base egyptsro d13 cap 120 », f=633) | ~2013-2019 · mort | A10 |
| **Perfection (PVP) Network, Ex.Silkroad R, Elite & Eroad, Dream World & Exotic** | — | Sous-forums dédiés visibles en 2012 | 2012 · morts | A19-2012 |
| **ArabianRoadOnline, ALEXNADER, Desert Sro, SilkRoad E 80 China, OldSro Cap 80, Valentus Cap 80, Eridanus Cap 90…** | 80-90+ | Parmi **~120 sous-forums serveurs** du forum en 2015 (liste Wayback, encodage incertain) | ~2010-2015 · morts | A19-2015 |
| **Elamidas Online** (ex-Skalidor 2) | 10D (35x) → aujourd'hui **cap 100 CH-only** | Équipe internationale (LastThief/Royalblade/Dizzie) ; énorme audience arabe (sous-forum s4a) ; « Ultimate Chinese Era » : Sun 9D contre or au NPC, 5 M gold + 100 k SP au départ | 2012→2020s · actif | A29, [sro.gg](https://sro.gg/en/server/elamidas-online-100-cap-only-ch-auto-events-dungeons-long-term-jobbing), [FB](https://www.facebook.com/groups/6856039677843208/posts/28173568222330378) |
| **Athena / Lyra** | — | « شوية عرب + مصريين » — recommandés aux Arabes sur iSRO-privés | 2016-2020 · cités | A9 |
| **BlackRobber.Online** | — | Recommandé sur s4a en 2020 | 2020 · cité | A9 |
| **Legend-Sro** | **Cap 130, DG14** | « nouvelles compétences, silk gratuit, auto-events » | ~2020s · annuaire | A21-GTop100 |
| **Saturn Chapter 2** | D11 | Liste Égypte GTop100 | 2020s · annuaire | A21 |
| **Egypt SRO (liste GTop100)** | Cap 120 | avec Sbot | 2020s · annuaire | A21 |
| **Anoha-PVE** | **Cap 130 (sous-forum « Anoha 140 PVE »)** | Mid rates, Reborn, FW Jangan, silk/h, GO 07/04 (cf. §4.4) ; sponsor actuel de s4a | 2020s · actif | A8 |
| **KingsRoad, Zenger Online, Destiny Online, Jade Online, Ignition Online, Oris Online, Era SRO, SROGO** | — | Sponsors actuels du forum s4a | 2020s-2026 · actifs | A2/A12 |
| **Venus Server** | **Cap 130, D14, CH-EU** | Quest jusqu'au lvl 130 | 2020s · vidéo | [YouTube](https://www.youtube.com/watch?v=VBHyDebspbc) |
| **Play SRO** | Cap 130, D14 | « سيرفر عربي » | 2020s · vidéo | [YouTube](https://www.youtube.com/watch?v=-04o6st61Dw) |
| **United Arab Emirates (Cap 140)** | **140** | « silk gratuit, PVE/PVP » — fiche annuaire | 2020s · annuaire | [silkroad-servers.com/details/sedon](https://sro-servers.com/details/sedon) |
| **Vaora Online** | **130-140** | Events et grosses récompenses (2026) | 2026 · vidéo | [YouTube](https://www.youtube.com/watch?v=wLGEN26hmLs) |
| **SRO OLD (Nasser Gaming)** | **140** | « أجواء اللفل العالي CH & EU », PvP, events quotidiens | 2025-2026 · actif | A23 |
| **ERIOS (Nasser Gaming)** | Cap 105 | Beta puis GO | 2025-2026 · actif | A23 |
| **Classic Silkroad (EG)** | Cap 110, D11 | Uniques inédits, « EGY A/B SHOPS », Arena Coins, FGW/HWT, low rate | 2026 · actif | A21-Gamehot |
| **QIAN Online** | — | « Return of the Ruler », GO **27/02/2026** (Égypte) | 2026 · actif | A21-Gamehot |
| **Red Sea Online** | Cap 110 | **2 000 joueurs en ligne en 9 jours** (autodéclaré) ; nom hérité du serveur officiel Red Sea | 2025-2026 · actif | [redsea-mvp.online](https://www.redsea-mvp.online/), [FB](https://www.facebook.com/RedSeaCAP110) |
| **Silkroad Serapis** | — | Nom égyptien (Sérapis) | 2020s · actif | [silkroadserapis.com](https://www.silkroadserapis.com) |
| **SRO Times** | **Saison CAP 80 (janv. 2026)** | « السيرفر الوحيد اللي معاه Discord Partner » ; Discord 24 954 membres ; commerce IRL encadré | 2026 · actif | A26 |
| **ExaySRO** | Cap 130 + Reborn (+10 stats/reborn) | Wiki bilingue AR/EN ; uniques à Shambhala, carte PK | 2020s · actif | A20 |
| **OASIS 2005 MACRO** | **Cap 50 CH-only** | Nostalgie 2005 | 2025 · FB | [FB group](https://www.facebook.com/groups/309626292717577/posts/2570208319992685) |

**Lecture des caps** : l'écosystème arabe couvre tout le spectre — **nostalgie cap 50/80 CH-only** (OASIS, SRO Times), **mid caps 100-110 D10/D11** (Elamidas, Classic Silkroad, Red Sea) et **high caps 130/140 D14+** (Anoha 140, Legend-Sro 130, Venus 130 D14, UAE 140, Vaora 140, SRO OLD 140). La question « cap 130-140 arabe » est donc **confirmée par au moins 6 serveurs identifiables** (avec sources ci-dessus).

### 🧭 5.2 Écosystème annuaire/communautaire actuel

- Annuaires avec filtre pays Égypte : [GTop100](https://gtop100.com/Silkroad-Online/Country/Egypt), [Gamehot](https://gamehot.net/silkroad/country/EG), [sro-servers.com](https://sro-servers.com), [sro.gg](https://sro.gg/en).
- **Discord** : [Silkroad Origin Arab](https://discord.com/invite/silkroad-origin-arab-1231622557560602664) (« plus grande communauté arabe » du mobile), [SromArabia](https://discord.gg/BnHSw72ygA), [SRO Times](https://discord.com/invite/srotimes) (24 954 membres), annuaire [DISBOARD tag sro](https://disboard.org/servers/tag/sro).
- **Créateurs de contenu arabes** : Nasser Gaming (A23), Silkroad بالعربي (A15), Sro Origin Arab ([YouTube](https://www.youtube.com/channel/UCq0un33EQAtUpyikeIJ8YEA)), chaînes documentaires (Archer Tales A14), TikTokers (ex. [@tarekbosbo](https://www.tiktok.com/@tarekbosbo/video/7666250988549852432) — guides Magic Pop).

---

## 🌐 6. La localisation arabe officielle — LA question tranchée

### 🖥️ 6.1 PC (2010) : un « service linguistique arabe » officiel a bien existé

- **22/01/2010 — annonce IGN** : *« Joymax Announces the Launch of Arabic Language Service for fantasy MMORPG Silkroad Online »* — service arabe en ligne le **02/02/2010**, via [joymax.com/silkroad](https://www.joymax.com/silkroad) ; c'est la **2e de 4 extensions multilingues** (après le turc ; l'espagnol suit en avril, l'allemand en mai 2010) ; événement communautaire 19/01→02/02/2010 avec lots **« collier/boucles 10th Seal of Moon »** ou **10 000 skill points** ; le jeu est alors servi dans **200 pays** (A17-IGN).
- **03/02/2010 — Engadget/Massively** : **deux événements mondiaux en jeu** célèbrent le service arabe (A17).
- **mai 2010 — ArabMMO** (presse arabe) confirme l'usage : *« هذا الموقع باللغة العربية من السهل علي التسجيل »* (« ce site est en arabe, l'inscription est facile ») — l'article de presse arabe décrit l'**inscription et le portail en arabe** (A18).
- **Nuance importante (incertitude §8)** : tout ce qui est documenté concerne le **site/portail** ; **aucune source retrouvée ne prouve que le client PC lui-même (textdata.txt) ait été traduit en arabe** — et les fils du forum sur « écrire l'arabe dans le jeu » (§3.4) suggèrent l'inverse. Formulation prudente retenue : **service web officiel arabe = oui (2010) ; client PC arabe = non documenté / improbable**.

### 📱 6.2 Rappel chronologique du mobile officiel

- Version globale SEA de Silkroad Origin Mobile : **03/07/2024** ([annonce officielle](https://sromobile.com/en/news/news/official-release-date-announcement)).

### 📲 6.3 Silkroad Origin Mobile Arabia (2024-2026) : la VRAIE localisation arabe officielle

- **Identité** : « سيلكرود أوريجن موبايل أرابيا » — version mobile **officiellement licenciée par WeMade Max (ex-Joymax)**, développée par **GOSU ONLINE CORPORATION** (Hanoï, Vietnam) « spécifiquement pour la communauté arabe » (A16-Google Play).
- **Localisation complète** : l'App Store arabe la présente comme la version licenciée de WeMade Max (ex-JOYMAX) ; la fiche Google Play revendique une localisation totale — interface, graphismes, icônes, événements, vie communautaire — et un habillage culturel arabe (« courage, fraternité, hospitalité ») ; **PEGI 16**, achats intégrés, Android + Windows (Intel), **mise à jour du 02/08/2026** (A16).
- **Partenariat saoudien (14/07/2026)** : GOSU × **الامتياز العصرية** (Al-Imtiaz Al-Asriya) pour lancer le jeu en **Arabie saoudite et MENA**, événement de lancement à **Djeddah** devant presse et créateurs de contenu ; slogan : *« Le patrimoine ouvre la voie, l'hospitalité guide le voyage »* (A25).
- **Écosystème officiel arabe** : site [sromarabia.com](https://sromarabia.com/home) avec **wiki officiel en arabe** ([sromarabia.com/wiki](https://sromarabia.com/wiki)), page [Facebook sromarabia](https://www.facebook.com/sromarabia) (« droits IP réservés à WEMADE MAX »), groupe/discord dédiés (A16, A24).
- **La boucle historique est bouclée** : 18 ans après les cybercafés égyptiens de 2006, le Silkroad officiel existe **en arabe** — mais uniquement sur mobile.

---

## 🗣️ 7. Glossaire arabe → français (72 termes, avec translittération)

Sources : A5 (fil « symboles et abréviations du chat », 2013), A1 (Wikipédia arabe), A14 (documentaire égyptien), A3/A4 (guides). Les prononciations suivent l'usage égyptien.

### Le jeu et les bases
| Arabe | Translit. | Français |
|---|---|---|
| سيلك رود / سيلكرود | saylkrōd | Silkroad |
| الطريق الحريري | al-ṭarīq al-ḥarīrī | la Route de la Soie |
| لفل | level | niveau |
| اكس بي | XP | expérience |
| سبي / نقاط المهارة | SP / nuqaṭ al-mahāra | points de compétence |
| نقاط الصحة / الدم | HP / dam | points de vie |
| نقاط السحر | MP | mana |
| كويست | quest | quête |
| دروب | drop | butin / drop |
| ريت / راتات | rate(s) | taux (EXP/drop) du serveur |
| فتحة | fatḥa | ouverture (grand opening) d'un serveur |
| السايبر | al-sāyber | cybercafé |
| شحن / كرت شحن | shaḥn / kart | recharge de silk (carte) |

### Personnages, classes, maîtrises
| Arabe | Translit. | Français |
|---|---|---|
| ستر / ستات | stat | caractéristiques |
| سترنث / انت | STR / INT | force / intelligence |
| نيوكير | nūker | nuker (mage CH dégâts purs) |
| ويزرد | wizard | sorcier (EU) — surnommé « المفتري » (l'hyperpuissant) |
| وارلوك | warlock | occultiste — surnommé « الغلس » (le fourbe) |
| كليرك | cleric | clerc — surnommé « دكتور ربيع » (le soigneur) |
| بارد | bard | barde |
| روج | rogue | roublard |
| ووريور | warrior | guerrier |
| الجليد / الثلج | al-jalīd | glace (Cold) |
| نار | nār | feu (Fire) |
| صاعقة / ضوء | ṣāʿiqa / ḍawʾ | foudre (Lightning) |
| فورس / قوة | force | Force (soins/buffs CH) |
| الماستري / القوى | mastery | maîtrise |
| الجاب | gap | écart niveau/maîtrise (pour le SP farming) |
| الدرع الثلجي | al-dirʿ al-thaljī | Bouclier de neige (Snow Shield) |

### Armes et équipement
| Arabe | Translit. | Français |
|---|---|---|
| السيف والدرع | sword + shield | épée + bouclier |
| بليد | blade | lame |
| الحربة | al-ḥarba | glaive |
| الرمح | al-ramḥ | lance |
| القوس / البو | bow | arc |
| القيثارة | qīthāra | harpe (barde) |
| الايتم | item | objet |
| الدرع | dirʿ | armure/bouclier |
| البلو / البلوس | blues | options magiques (blues) |
| الصن | ṣan | Seal of **Sun** |
| المون | mūn | Seal of **Moon** |
| الاستار / السوس | star / sōs | Seal of **Star** / Seal-of générique |
| الافاتار | avatar | tenue cosmétique |
| البريميوم | premium | abonnement premium |
| الديفل سبيرت | Devil Spirit | esprit démoniaque (pick-up/buff pet) |
| الريفرس | reverse | Reverse Scroll (retour en ville) |
| الارانب والقرود | lapins et singes | pets ramasseurs |

### Alchimie
| Arabe | Translit. | Français |
|---|---|---|
| الكيمياء | al-kīmiyāʾ | alchimie |
| الالكسير | elixir | élixir |
| بودرة الحظ | būdra al-ḥaẓẓ | Poudre de la Chance |
| التابلت / اللوح | tablet | tablette d'attribut |
| الحجر | ḥajar | pierre d'attribut |
| العنصر / الالمنت | element | élément (terre/feu/eau/vent) |
| رندو | rondo | Rondo (Destroyer/Void) |
| الانشر | enhance | renforcement (+1, +2…) |
| فتحة كيميائية | — | session d'alchimie (pour **enchaîner les réussites**) |
| بلس 12 / +12 | plus 12 | niveau de renforcement |

### Monstres et combat
| Arabe | Translit. | Français |
|---|---|---|
| البوس / البوسات | bōs / bōsāt | boss / uniques (emprunt direct à l'anglais) |
| اليونيك / اليونكس | yūnīk / yūnak (prononciation éG) | unique |
| وحش | waḥsh | monstre |
| العملاق / جاينت | giant | monstre géant |
| الشايتان / الشيطان | shayṭān | démon (Demon Shaitan) |
| تايجر جيرل | Tiger Girl | Tiger Girl (البوسة بتاعة جنجان — « la boss de Jangan ») |
| هورس / أنوبيس / سفينكس | Horus/Anubis/Sphinx | uniques égyptiens d'Alexandrie |
| الضربة القاطعة | ḍarba qāṭiʿa | coup critique |

### Métiers et commerce
| Arabe | Translit. | Français |
|---|---|---|
| التاجر | tājir | marchand (Trader) |
| الصياد | ṣayyād | chasseur (Hunter) |
| الحرامي / اللص | ḥarāmī / liṣṣ | voleur (Thief) |
| القافلة / الكارفان | caravane | convoi commercial |
| النجوم / الستارز | étoiles | charge de trade (1-5★) |
| الجولد / الذهب | gold | pièces d'or |
| السيلك / الحرير | silk | soies (monnaie premium) |
| الايتم مول | Item Mall | boutique premium |
| التاكسي | tāksī | service payant de power-leveling |
| الديل | deal | transaction entre joueurs |
| ادد | add | ajout (en transaction) |
| النصابين | al-nasābīn | les arnaqueurs |
| البيع والشراء | vente/achat | commerce (section du forum) |

### Guilde / PvP / structures
| Arabe | Translit. | Français |
|---|---|---|
| الجيلد / الجويلد | guild | guilde |
| اليونيون | union | union de guildes |
| حرب الجيلد | guerre de guilde | guild war |
| حرب الحصون / الحصن | Fortress War / forteresse | Fortress War |
| قلعة الحرامية | qalʿat al-ḥarāmiya | Forteresse des Bandits (Bandit Fortress) |
| الوش / وشوش | wash/wushūsh | duels PvP (« faces ») |
| البوت | bot | bot |
| السبوت / الامبوت / الفيبوت | SBot/mBot/PhBot | bots du marché |
| سبيد 12 | — | serveur rapide (fun) |
| الهيرو | hero | héros (top unique killer) |
| قفل / فتح | !lock/!unlock | verrouillage de compte (custom serveurs) |

---

## ⚠️ 8. Incertitudes et limites

1. **Localisation PC 2010** : le « Arabic language service » (02/02/2010) est documenté pour le **site/portail** (IGN, ArabMMO) ; **rien ne prouve une traduction du client PC** (textdata arabe). Les fils s4a sur l'écriture de l'arabe dans le chat et le projet « تعريب » suggèrent un client resté anglais. → à formuler prudemment dans la KB.
2. **Date de fondation de silkroad4arab** : première capture Wayback **24/05/2007** ; IDs de membres (#609 en 07/2007, #922 en 08/2007) et threads précoces (t=14069) suggèrent une création fin 2006-début 2007 — **date exacte non établie**.
3. **Statistiques du forum** : les captures 2008/2015 présentent des colonnes possiblement inversées/encodage corrompu ; le total 2026 (199 025 membres) vient d'un snippet d'index Google (non re-fetchable directement — accès 403). Ordres de grandeur fiables, chiffres exacts ±.
4. **Liste 2015 des ~120 serveurs** (Wayback) : reconstruite depuis des identifiants techniques malgré l'encodage corrompu — **noms à re-vérifier un par un** avant usage canonique.
5. **Populations des serveurs privés** : toutes auto-déclarées (Red Sea « 2 000 online en 9 jours », Discord SRO Times 24 954 membres) ; aucun compteur indépendant.
6. **Anoha** : le sous-forum s'appelle « Anoha **140** PVE » mais le fil d'annonce dit « Cap **130** » — soit rebrand, soit montée de cap ultérieure.
7. **Maghreb** : les requêtes « سيلكرود الجزائر / المغرب » n'ont rien produit d'indexé (retours hors-sujet football) — la communauté maghrébine existe (dialecte visible sur les fils) mais **n'a pas de portail propre documenté en ligne**.
8. **Elamidas** : équipe non arabe à l'origine (Skalidor), incluse ici pour son audience arabe massive (sous-forum s4a) — ne pas l'étiqueter « serveur arabe » sans nuance.
9. **Folklore de la fuite vSRO** (licenciements Joymax → fuite par vengeance, A14) : **récit communautaire**, contredit par l'historiographie EN (fuite ~2011-2012) et par ProBasha (2009) — à citer comme mémoire collective uniquement.
10. **Accès** : silkroad4arab renvoie **403** aux fetchs standards (contenu obtenu via lecteur MCP et snippets) ; sous-forums sensibles (f=632 Egypt SRO) réservés aux inscrits ; RaGEZONE 403 ; les « stats live » des Discord/FB datent du 01/10/2026.

---

## 🏁 9. Synthèse pour la base de connaissances

- **Écosystème arabe = le 2e pilier historique du monde SRO privé** après la Turquie : un forum de **313 k membres au pic (2015), 17 621 connectés simultanés (16/07/2014)**, ~120 serveurs hébergeant un sous-forum en 2015, et aujourd'hui une migration vers Discord/TikTok/Facebook pilotée par des Égyptiens.
- **Le PC officiel n'a jamais eu de client arabe** (service web arabe 02/02/2010 seulement) ; **la localisation arabe officielle complète existe depuis 2024-2026 sur mobile** (Silkroad Origin Mobile Arabia, WeMade Max × GOSU × partenaire saoudien).
- **Données chiffrées arabes réutilisables** : répartition EXP/SP par gap (500/415/250 au lvl 16), 400 skill exp = 1 SP, HP des 5 uniques (confirmés), économie trade 5★ (120 M→300 M), horaires/loots des serveurs modernes (Anoha), Egy Coin → armes D11 Egy A/B.
- **Dev arabe vivant** : ProBasha (tutos complets vSRO en arabe, releases DB/web, VPS), sections s4a (PK2, DB, ST-Filter), chaînes YouTube de setup — mais **aucune traduction arabe communautaire du client PC** identifiée, et aucune release arabe majeure isolée sur RaGEZONE.

*Chaque affirmation de ce rapport renvoie à l'URL de sa source ; les traductions de l'arabe sont fidèles au texte original (dialecte égyptien signalé quand pertinent).*
