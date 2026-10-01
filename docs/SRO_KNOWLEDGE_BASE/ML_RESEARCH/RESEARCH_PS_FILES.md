# 🔐 Recherche EN — Les fichiers de serveur Silkroad fuités (vSRO, BlackRogue, etc.)

> **Rapport de recherche web (anglais)** — 2026-10-01 · SRObro Knowledge Base
> **Périmètre** : inventaire des fuites de fichiers de serveur officiels (vSRO 1.188/1.193/1.274, BlackRogue, tSRO, jSRO, cSRO, SWSRO, iSRO-R, iSRO/KSRO), architecture des serveurs, tables SQL et données exploitables pour la base SRObro, dumps publics, rétrofits communautaires, histoire et conséquences légales de la scène des serveurs privés.
> **Méthode** : ~35 requêtes web EN + récupération des threads fondateurs (RaGEZONE, elitepvpers, ProjectHax) + inspection d'API GitHub (schémas de DB). Lacunes ciblées lues au préalable dans `28_ADVANCED_MECHANICS.md` (§Incertitudes), `15_UNIQUE_BOSSES.md` (HP boss 111+), `05_ALCHEMY_SYSTEM.md` (plages de blues par degré), `MONSTERS_SPAWN_LOCATIONS.md` (spawns).
> ⚖️ **Note légale** : ce document **recense et documente uniquement** (URLs, contenu, structure). Il ne fournit ni n'héberge aucun fichier. Les fichiers de serveur Silkroad sont la propriété de Joymax/Wemade — leur téléchargement/usage est légalement risqué (précédent Joymax c. ECSRO, cf. §9).

---

## 📋 Table des Matières
- [Index des sources (URL + fiabilité)](#-index-des-sources-url--fiabilité)
- [1. Inventaire des fuites — tableau général](#-1-inventaire-des-fuites--tableau-général)
- [2. Histoire de la scène des serveurs privés (2007-2016)](#-2-histoire-de-la-scène-des-serveurs-privés-2007-2016)
- [3. Architecture des fichiers serveur (modules, configs, rates)](#-3-architecture-des-fichiers-serveur-modules-configs-rates)
- [4. Les bases de données SQL — tables et contenu exploitable](#-4-les-bases-de-données-sql--tables-et-contenu-exploitable)
- [5. Dumps publics accessibles (liens)](#-5-dumps-publics-accessibles-liens)
- [6. Ce que les fichiers révèlent du jeu officiel (chiffres extractibles)](#-6-ce-que-les-fichiers-révèlent-du-jeu-officiel-chiffres-extractibles)
- [7. Moddings communautaires : rétrofits DG12/13 sur 1.188](#-7-moddings-communautaires--rétrofits-dg1213-sur-1188)
- [8. Réponses aux lacunes de notre base (avec confiance)](#-8-réponses-aux-lacunes-de-notre-base-avec-confiance)
- [9. Conséquences légales — Joymax c. ECSRO](#-9-conséquences-légales--joymax-c-ecsro)
- [10. Incertitudes restantes](#-10-incertitudes-restantes)
- [11. Recommandations pour SRObro](#-11-recommandations-pour-srobro)

---

## 📚 Index des sources (URL + fiabilité)

Fiabilité : 5 = source primaire/leaker lui-même ou dump inspecté directement · 4 = forum de référence confirmé multi-sources · 3 = témoignage unique fiable · 2 = annonce/secondaire · 1 = non vérifié.

| # | Source | URL | Fiabilité | Ce qu'elle apporte |
|---|--------|-----|-----------|---------------------|
| S1 | **RaGEZONE — Guide « Setting up a server based on VSRO server files » (Chernobyl, 13/09/2011)** | https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273 | **5** | Guide écrit par **le leaker lui-même** : origine Vietnam, ordre de démarrage des 9 modules, 3 DB MSSQL, limites officielles (1000 joueurs/AgentServer, régions par gamesserver) |
| S2 | **RaGEZONE — VSRO Server Files v188 (thread principal)** | https://forum.ragezone.com/threads/vsro-server-files-v188.779870 | 4 | Thread de distribution original (52+ pages), fichiers du service vietnamien partagés par « Chernobyl » |
| S3 | **elitepvpers — Origin of Private Servers** | https://www.elitepvpers.com/forum/silkroad-online/4715286-origin-private-servers.html | 4 | Chronologie des fuites : vSRO 2011 (Vietnam) puis Thaïlande, Taïwan, Japon |
| S4 | **elitepvpers — history of silkroad** | https://www.elitepvpers.com/forum/sro-private-server/4701666-history-silkroad.html | 3 | MHTC = premier serveur privé (fichiers hackés cSRO) |
| S5 | **RaGEZONE — BlackRouge Official CAP 120 Server Files (MeGaMaX, 07/2016)** | https://forum.ragezone.com/threads/blackrouge-official-cap-120-server-files.1107257 | **5** | Release des files BR120 : package « SRO_Thailand_CS_106 », contenu (Config/InitialDB/Query/ServerBinary/SMC), 4 exes + DLL, cap 120, client v1.040, origine Thaïlande/ini3 |
| S6 | **elitepvpers — [Release] BlackRogue server files (BR 110)** | https://www.elitepvpers.com/forum/sro-private-server/1590952-release-blackrogue-server-files.html | 4 | Release des files BlackRogue 110 |
| S7 | **RaGEZONE — Black Rouge files + DataBase + Patch + How To Setup** | https://forum.ragezone.com/threads/black-rouge-files-database-patch-how-to-setup-it.847379 | 4 | BR files + DB + patch + guide |
| S8 | **RaGEZONE — Release the real Taiwan SRO server files (Eroad v1.258)** | https://forum.ragezone.com/threads/release-the-real-taiwan-sro-server-files.1020724 | 4 | Vraies files taïwanaises v1.258 + DB |
| S9 | **elitepvpers — Fixing Japanese Silkroad leaked files (38+ pages)** | https://www.elitepvpers.com/forum/sro-private-server/1252511-fixing-japanese-silkroad-leaked-files-38.html | 4 | Files japonaises (jSRO) fuitées + travail communautaire de fixation |
| S10 | **RaGEZONE — ECSRO Server Files (Dr.AbdelFattah)** | https://forum.ragezone.com/threads/ecsro-server-files.830540 | 4 | Les « files ECSRO » = **files de test cSRO fuitées**, utilisées par ECSRO/ZSZC |
| S11 | **elitepvpers — Release VSRO 274 Files** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4993522-release-vsro-274-files.html | 4 | Files vSRO 1.274 (fuite Syloox ~juin-juillet 2012) |
| S12 | **elitepvpers — Release vSRO v1.274 Database** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5277574-release-vsro-v1-274-database.html | 4 | **Database** de la 1.274 (fuite originelle Syloox juin-juillet 2012) |
| S13 | **elitepvpers — Release ISROR 2015 Server Files (RIGID Online)** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5068290-release-isror-2015-server-files-rigid-online.html | 4 | Files iSRO-R « Rigid » 2015 (Silkroad R officiel) |
| S14 | **RaGEZONE — ISRO & KSRO Leaked?** | https://forum.ragezone.com/threads/isro-ksro-leaked.1087030 | 3 | Confirmation : files **iSRO et KSRO également fuitées** ; serveur Zyain (BlazeGN) sur files iSRO, cap 125 / 14DG |
| S15 | **RaGEZONE — VSRO Files v193 (new job system)** | https://forum.ragezone.com/threads/vsro-files-v193-new-job-system.816344/ | 4 | Files vSRO 1.193 (nouveau système de job) |
| S16 | **elitepvpers — New vSRO Files 1.193 Skilldatas for 120 Skills** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1869889-release-new-vsro-files-1-193-skilldatas-120-skills.html | 4 | Skilldatas 120 pour 1.193 (skills CH/EU + **skills des mobs Jupiter 110-120**) |
| S17 | **GitHub — ducksoup-sro/ducksoup (Database/VSRO188)** | https://github.com/ducksoup-sro/ducksoup/tree/main/Database/VSRO188 | **5** | **Schémas SQL complets** des DB vSRO 1.188 (SRO_VT_SHARD/ACCOUNT/LOG) — ~200 tables listées (inspecté via API GitHub) |
| S18 | **GitHub — Ex-o/Silkroad-Database-Documentation** | https://github.com/Ex-o/Silkroad-Database-Documentation | 4 | Documentation de structure de la DB VSRO188 (ACCOUNT/LOG/SHARD + wiki) |
| S19 | **GitHub — JellyBitz/vSRO-ServerAddon** | https://github.com/JellyBitz/vSRO-ServerAddon | 5 | DLL d'injection pour customiser SR_GameServer/SR_ShardManager 1.188 ; documente les entrailles |
| S20 | **GitLab — florian0/sro_devkit** | https://gitlab.com/florian0/sro_devkit | 5 | Framework C++ pour interagir avec les composants du jeu (filter/module) |
| S21 | **GitHub — AlighieriDemiurgs/SROquests** | https://github.com/AlighieriDemiurgs/SROquests | 4 | Guide de **280+ quêtes extrait des files vSRO v1.188** (rates 1x), assemblé 2026 |
| S22 | **RaGEZONE — [Dev] Unique Spawn Time** | https://forum.ragezone.com/threads/dev-unique-spawn-time.820175 | 3-4 | **Timers de spawn par défaut des uniques dans la vSRO** (dwDelayTimeMin/Max en secondes) + mécanique Tab_RefNest/Tab_RefTactics |
| S23 | **elitepvpers — Modify VSRO 188 Party Monster Spawn Limitation (SR_GameServer)** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4231757-release-modify-vsro-188-party-monster-spawn-limitation-sr_gameserver.html | 3-4 | **GiantMonster_SpawnRatio par défaut = 14 %**, hardcodé dans sr_gameserver.exe (patch OllyDbg) |
| S24 | **TopGameServer — How to Change vSRO EXP and Silk Rates** | https://topgameserver.net/drop | 4 | Sémantique exacte des rates : `ExpRatio` = multiplicateur ×1000 (1000 = x1), ExpRatioParty, DropItemRatio, DropGoldAmountCoef, HwanGainFactor, Silk* |
| S25 | **elitepvpers — Guide: Setting up a server based on VSRO server files (mirror epvp du guide Chernobyl)** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1433603-guide-setting-up-server-based-vsro-server-files.html | 5 | « Gameserver lit les rates comme (taux réel × 1000) » — 35000 = 35x ; configs SR_ShardManager/SR_GameServer |
| S26 | **elitepvpers — SRO Game Files (v1.188) (clean compilation)** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5244813-sro-game-files-v1-188-a.html | 4 | Pack propre préconfiguré 1.188 (base de travail standard 2020s) |
| S27 | **elitepvpers — vSRO 1.188 Server Files + Client D12 Jupiter Original** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4624379-vsro-1-188-server-files-client-d12-jupiter-orginal.html | 4 | 1.188 **rétrofitée D12/Jupiter** : « Fixed Items Normal D12, Fixed Drop D12, Fixed Jupiter Unique, Fixed Skill 120, Avatar additions » |
| S28 | **elitepvpers — Upgrade DB & Client from D11 → D12 → D13 how-to** | https://www.elitepvpers.com/forum/sro-private-server/3951939-upgrade_db_and_client_from_d11-d12-d13-how.html | 4 | Méthodologie du retrofit : PK2 Extractor sur client KSRO, comparaison itemdata, import SQL |
| S29 | **elitepvpers — Fixed Database vSRO Files Cap 120 + Skills** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1571121-fixed-database-vsro-files-cap120-skil-sql-server-2005-a-2.html | 4 | DB vSRO cap 120 + skills 120 + armes D12 fixées |
| S30 | **elitepvpers — [ReUploaded] Database 120 Cap and Skill + Jupiter Map** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1710097-reuploaded-database-120-cap-skill-jupiter-map-running-sql-server-2005-a.html | 4 | DB 120 avec carte Jupiter, item mall et régions fonctionnels |
| S31 | **RaGEZONE — Leaving SRO folder, enjoy (Goofie/Gooby, 2025)** | https://forum.ragezone.com/threads/leaving-sro-folder-enjoy-3.1129585 | 3 | Archive de départ : « Pioneer advanced SHARD, LOG, SKILL database », packet filter supportant **vSRO 188, 274, BR et jSRO** |
| S32 | **elitepvpers — [INFO] Summary of the Lawsuit — Joymax against ECSRO** | https://www.elitepvpers.com/forum/sro-private-server/1292481-info-summary-lawsuit-joymax-against-poor-ecsro-aka-zszc-slave-3.html | 3 | Plainte Joymax : ~48 chefs, ~2,5 M$ de dommages réclamés |
| S33 | **elitepvpers — Rare: Lawsuit case ECSRO** | https://www.elitepvpers.com/forum/sro-private-server/4402579-rare-lawsuit-case-ecsro.html | 3 | Documents de l'affaire ; rôle de « KingLi » dans la fuite des files |
| S34 | **ProjectHax — forum + Private Server List** | https://forum.projecthax.com/t/private-server-list/1940 | 3 | Écosystème bot/RE ; inventaire des types de files en circulation (vSRO 193/274, cSROR, BR, thSRO, jSRO) |
| S35 | **RaGEZONE — iSRO opcodes + structures** | https://forum.ragezone.com/threads/isro-opcodes-structures.843585 | 4 | « BlackRogue files leaked, super old SWSRO files leaked, VSRO… » — recense les familles de fuites |
| S36 | **RSBot (GitHub) — régions supportées** | https://github.com/myildirimofficial/RSBot | 4 | Liste les versions vivantes : KSRO, vSRO 188/193/274, TSRO 110/Digeam, RuSRO, **Blackrogue 100/110** |
| S37 | **silkroadonline.wiki** | https://silkroadonline.wiki/ | 5 | DB fan « client build v1_657 » : 42 532 records, **8 387 monstres**, 21 490 items (déjà utilisée par notre KB) |
| S38 | **SroCave — Release vSRO v1.274 Devkit & Filter** | https://srocave.com/konular/release-vsro-v1-274-devkit-filter.1805 | 3 | Sources/devkit 1.274 (hub turc) |
| S39 | **RaGEZONE — Research about SoX drop rate** | https://forum.ragezone.com/threads/research-about-sox-drop-rate-how-does-this-thing-works.1040977 | 3 | Mécanique des drops SoX : `_RefMonster_AssignedItemDrop` = couche bonus par mob |
| S40 | **elitepvpers — Where is the source code?** | https://www.elitepvpers.com/forum/sro-coding-corner/5375146-where-source-code-how-do-people-modify-customize-private-servers.html | 4 | **Aucun code source des files n'existe publiquement** — tout passe par patch binaire/DLL/SQL |
| S41 | **nostalgic.gg — The History of Silkroad Online: A Complete Timeline** | https://nostalgic.gg/en/blog/silkroad-online-history-en | 2 | Chronologie générale (2008 : apparition des émulateurs privés) |
| S42 | **GamesIndustry.biz — Legend V: Heroes of Alexandria** | https://www.gamesindustry.biz/silkroad-online-level-cap-hits-110-with-legend-v-heroes-of-alexandria-update | 5 | Confirmation officielle : **cap 110 = Legend V (Alexandrie)** — l'ère de la 1.188 |
| S43 | **GitHub — artuuro/ISRO-R-DEVKIT (miroir SRO_DevKit)** | https://github.com/artuuro/ISRO-R-DEVKIT | 4 | DevKit C++ (iSRO-R) : interfaces vers les composants du jeu |
| S44 | **Reddit r/silkroadonline — What happened to ECSRO** | https://www.reddit.com/r/silkroadonline/comments/1ewt0rf/what_happened_to_ecsro | 2 | Témoignages : ECSRO « first gen », fermeture ~2010 |
| S45 | **Silkroad4Arab — Official vSRO Files, Tools, Guides & Queries** | https://www.silkroad4arab.com/vb/showthread.php?t=507777 | 3 | Hub arabe : files vSRO cap 110 D11, cartes (Alexandrie, Samarkand, Constantinople, Donwhang Cave, Jangan) |
| S46 | **elitepvpers — How to change unique spawn time** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1773490-guide-how-change-unique-spawn-time.html | 4 | SQL des timers : `UPDATE Tab_RefNest SET dwDelayTimeMin=…, dwDelayTimeMax=…` (valeurs en secondes) |
| S47 | **elitepvpers — Upgrade DB and Client D11→D12→D13 (contenu du thread, via recherche)** | https://www.elitepvpers.com/forum/sro-private-server/3951939-upgrade_db_and_client_from_d11-d12-d13-how.html | 4 | Outils : PK2 Extractor (media.pk2 → itemdata.txt), comparaison colonnes (écart typique ~2 colonnes entre versions), portail Depian pour itemdata |
| S48 | **RaGEZONE — VSRO server files v188 files + client** | https://forum.ragezone.com/threads/vsro-server-files-client-v1-188.780427 | 4 | Files 1.188 + client original |
| S49 | **RaGEZONE — [REPACK] ISRO-R 2015 (Rigid Files)** | https://forum.ragezone.com/threads/repack-isro-r-2015-rigid-files.1208329 | 3 | Repack des files Rigid 2015 |
| S50 | **TopS4A — VSRO Query Collection** | https://www.tops4a.com/2019/08/query.html | 3 | Collection de requêtes SQL vSRO (_RefSkill, Tab_RefNest, _Items↔_RefObjCommon…) |

---

## 🗃️ 1. Inventaire des fuites — tableau général

> ⚠️ **Correction majeure d'hypothèse** : BlackRogue n'est **PAS** issu du service russe. C'est le **service officiel thaïlandais** (« Silkroad Black Rogue », opéré par **ini3**, site `blackrogue.in`, actif ~2010-2012, vidéos de Fortress War de Jangan datées 2010-2011). Le package de la release BR120 s'appelle littéralement **`SRO_Thailand_CS_106.zip`** (S5, S35, elitepvpers 2977838). Les files « russes » correspondent au service Silkroad R (RSRO) — les « iSRO-R / Rigid 2015 » en proviennent (S13/S49), et RSBot liste « RuSRO » séparément (S36).

| Fuite | Origine (service officiel) | Date de fuite/release | Cap niveaux | Degrés | Contenu clé | Sources |
|-------|---------------------------|------------------------|-------------|--------|-------------|---------|
| **MHTC files** | Hack des serveurs cSRO (Chine) | ~2007-2008 (premier PS) | bas (époque 60-90) | — | Premier serveur privé de l'histoire (admin chinois, co-admin « ocean ») | S4 |
| **ECSRO/ZSZC files** | **Files de TEST cSRO** (Chine) | fuite après la fermeture d'ECSRO (~2009-2010) | 90 (ECSRO) | ≤ 9D | Servaient à faire tourner ECSRO et ZSZC — **pas un émulateur indépendant** | S10, S33 |
| **SWSRO files** | ? (« super old », pré-vSRO) | avant 2011 | bas | — | Ancienne génération, mentionnée comme historique | S35 |
| **vSRO 1.188** | **Vietnam** (service VTC Game) | **sept. 2011** (guide du leaker daté 13/09/2011) ; « novembre 2011 » cité aussi (non tranché) | **110** | **11 (D11)** | Base de ~90 % des privés : monde complet jusqu'à Alexandrie/Job Temple, FGW, Qin-Shi Tomb | S1, S2, S3, S42, S45 |
| **vSRO 1.193** | Vietnam | ~2011-2012 | 120 (skills 120 dispo) | D12 (via skilldatas) | « New job system » ; skilldatas 120 avec **skills des mobs Jupiter 110-120** | S15, S16 |
| **vSRO 1.274** | Vietnam | **juin-juillet 2012** (fuite par **Syloox**) | 120 | D12+ | Utilisée par le serveur « Pioneer » ; DB re-release en 2023 | S11, S12, S38 |
| **BlackRogue BR100/BR110** | **Thaïlande (ini3)** | ~2012 | 100 / **110** | D10/D11 | Files du service officiel thaï ; RSBot liste « Blackrogue 100/110 » | S6, S36 |
| **BlackRogue BR120** | Thaïlande (ini3) | **release 07/2016 par MeGaMaX** (« before the official server got shutdown ») | **120** | **D12** | Package `SRO_Thailand_CS_106` : mise à jour officielle du service thaï, client BR v1.040 | S5, S7 |
| **tSRO v1.258 (Eroad)** | Taïwan | ~2013-2014 | ~120-130 | D12/D13 | « Real Taiwan server files » + DB | S8 |
| **jSRO** | Japon | ~2013 | ? | ? | Files japonaises fuitées, long effort de fixation communautaire (38+ pages) | S9, S31 |
| **cSRO-R** | Chine (Silkroad R) | ~2014-2015 | 120 | D13 | Files du service chinois « Silkroad R » (silkroad.lt tournait dessus) | S34 |
| **iSRO-R « Rigid » 2015** | International (Silkroad R, incl. RSRO) | release ~2021 (files de 2015) | 110-120 (base) | D11-D13 (patchs 120/D13 courants) | Files officielles Silkroad R 2015 | S13, S49, S14 |
| **iSRO / KSRO** | International / Corée | confirmé fuitées (~2022+) | **125+** | **14DG** | « Zyain » (BlazeGN) a tourné dessus en CBT — cap 125, 14 degrés | S14 |

**Lecture pour notre base** : les HP/niveaux des monstres et boss sont dans la table `_RefObjChar` de chaque DB. La **1.188 s'arrête au contenu cap 110** (Job Temple/Seth 110) → **elle ne contient PAS les boss 111+** (Jupiter 111-118, Kidemonas 120, Bagdad 121+, Shambhala 131+). Ceux-ci existent dans : **vSRO 1.193/1.274** (Jupiter, 110-120), **BR120** (Jupiter D12, cap 120), **tSRO 1.258**, **cSRO-R/iSRO-R** (D13), et **iSRO/KSRO leakées** (cap 125+, 14DG — les plus complètes). Aucune source web ne publie ces HP en clair : **l'extraction de `_RefObjChar` de ces files reste la seule voie** (confirme le constat de `15_UNIQUE_BOSSES.md`).

---

## 📜 2. Histoire de la scène des serveurs privés (2007-2016)

### 🐣 Première génération (2007-2010) : avant les files

- **MHTC** est le **premier serveur privé Silkroad** : fondé par un admin chinois avec « ocean » comme co-admin, tournant sur des **files hackées du jeu original (cSRO)** (S4). Le nom est encore réutilisé aujourd'hui pour des projets nostalgiques « 2005 files, 60 cap » (vsro.org).
- **ECSRO (Elite Chaos Silkroad Online)**, **SWSRO**, **SJSRO** suivent (fin 2000s) — l'âge d'or nostalgique décrit par les vétérans (S44).
- **Correction importante (pour notre KB)** : ECSRO n'était **pas un émulateur développé from scratch**. Les files « ECSRO » qui circulent sont des **files de test cSRO fuitées** (« Both of these files are leaked cSRO testing server files which were used by ECSRO/ZSZC », S10). Le déclencheur de la fuite : un certain **KingLi** aurait obtenu les files et menacé de les publier sans un poste GM (S33). Après la fermeture (~2009-2010) et la plainte Joymax, les files ont été publiées.
- La scène « émulateurs » a existé (2008, S41) mais **aucun code source de serveur Silkroad n'a jamais fuité** : tout le modding se fait par reverse engineering des binaires (patch hex/OllyDbg, injection DLL, édition SQL) — consensus explicite (S40).

### 💥 La fuite fondatrice : vSRO 1.188 (sept. 2011)

- **Chernobyl** (pseudo) a partagé les files du **service officiel vietnamien** (vSRO, opéré par VTC Game) : « As you might already know, i've shared files i leaked from Vietnam Silkroad official servers » (S1, guide daté **13/09/2011** — thread miroir elitepvpers 1430066).
- Chronologie communautaire : « Server files leaked in november 2011 from the Vietnamese version of the game and later many more files got leaked from Thailand, Taiwan and Japan » (S3). **La date exacte (sept. vs nov. 2011) reste non tranchée** — le guide du leaker est daté de septembre.
- La 1.188 = fichiers de l'ère **Legend V « Heroes of Alexandria »** : cap 110, D11, Alexandrie + Job Temple (S42, S45).
- Version courante des changements internes citée par le leaker : « Changeset vsro obt v247-v249 » (S1).

### 🌊 Les vagues suivantes (2012-2022)

1. **2012** : vSRO 1.193 (nouveau job system) puis **vSRO 1.274** (fuite Syloox, juin-juillet 2012 ; utilisée par « Pioneer ») (S11-S16).
2. **~2012** : fuites **BlackRogue** (Thaïlande/ini3) — BR100/BR110 ; le service officiel thaï ferme, et en **juillet 2016** MeGaMaX publie la mise à jour **BR120 cap 120** (`SRO_Thailand_CS_106`) « before the official server got shutdown » (S5).
3. **~2013-2015** : **tSRO v1.258** (Taïwan, Eroad), **jSRO** (Japon), **cSRO-R** (S8, S9, S34).
4. **2015 files / ~2021 release** : **iSRO-R « Rigid Online »** — les files officielles du Silkroad R de 2015, repackées et redistribuées (S13, S49). Des serveurs comme CyronSRO tournent dessus en cap 120.
5. **~2022+** : **iSRO et KSRO elles-mêmes fuitées** — le serveur **Zyain** (Blaze Gaming Network) tourne sur les « ISRO Latest Files », **cap 125, 14 degrés** (CBT très critiquée par la communauté) (S14).

### 🧭 Conséquence structurelle

RaGEZONE résume : la scène des privés Silkroad repose sur les files vSRO « leaked from Vietnam Silkroad official servers », builds courantes **v188, v193, 274 et 120 cap** (forum Silkroad Releases). La division historique « vSRO vs ECSRO » correspond donc à deux époques : **files cSRO de test (2007-2010)** puis **fuite vietnamienne officielle (2011+)**.

---

## 🏗️ 3. Architecture des fichiers serveur (modules, configs, rates)

### 🧩 Les modules (vSRO 1.188) et l'ordre de démarrage officiel

D'après le guide du leaker lui-même (S1) — c'est **la description du fonctionnement officiel** la plus fiable disponible :

```
Ordre de démarrage (vSRO 1.188) :
 1. Custom certification server  (port 32000 — « Certifier »/IIS, interface SMC)
 2. SR_GlobalManager             (coordination globale ; port 15880 cité par MiniTools)
 3. SR_MachineManager            (enregistrement/certification des machines)
 4. DownloadServer               (patchs client)
 5. GatewayServer                (liste de serveurs affichée au client)
 6. SR_FarmManager               (gestion de ferme de shards)
 7. AgentServer                  (relais clients → world ; LIMITE OFFICIELLE : 1000 utilisateurs par AgentServer)
 8. SR_ShardManager              (gère un « shard » = un monde, connexions DB)
 9. SR_GameServer                (le monde de jeu lui-même)
```

- **3 bases MSSQL** : `SRO_VT_ACCOUNT`, `SRO_VT_SHARD`, `SRO_VT_SHARDLOG` (S1, S17).
- La **certification** se fait via un serveur d'authentification maison (port **32000**) + scripts **ASP/IIS** pour le billing ; le **SMC (Server Management Console)** pilote l'ensemble (S1 ; AUTO START SMC : Gateway/Agent/GlobalManager/GameServer).
- **Répartition des régions** : la table `_RefRegionBindAssocServer` assigne chaque région à un GameServer (0 = désactivée, 1/2/3 = GS1/2/3) — **un seul GameServer ne peut pas charger toutes les régions** : le monde officiel était réparti sur plusieurs GS (S1). → Donnée officielle précieuse : le monde Silkroad tourne en **grille de plusieurs gameservers par régions**.
- **Package BlackRogue** (S5) : dossiers `Config/`, `InitialDB/`, `Query/`, `ServerBinary/`, `SMC/` ; binaires = **AgentServer.exe, GlobalManager.exe, SR_GameServer.exe, SR_ShardManager.exe + SRCommonDataLoader.dll** (pas de FarmManager/MachineManager dans ce package update). Ajout noté par la release : le test normal (Acceptance Test) a échoué côté service officiel thaï.

### ⚙️ Configuration des rates (server.cfg) — sémantique exacte

Le fichier de config des rates lu par SR_GameServer est **`server.cfg`** (pas un .ini). Les valeurs sont stockées en **millièmes** (S24, S25) :

```
Taux réel = valeur / 1000
  ExpRatio 1000        = x1   ← VALEUR PAR DÉFAUT des files = taux officiels
  ExpRatio 5000        = x5
  ExpRatio 35000       = x35
  ExpRatio 100000      = x100
  ExpRatioParty        = multiplicateur de party (ex 4500 = x4.5)
  ExpRatioPartyBonus 3000 = bonus par membre supplémentaire
  DropItemRatio        = fréquence de drop d'items (même formule /1000)
  DropGoldAmountCoef   = or par monstre (2 = double)
  HwanGainFactor       = vitesse de gain des stacks de Zerk
  SilkOwnTime / SilkPerHour / SilkDropRate = paramètres silk
```

- Les valeurs se chargent en mémoire au démarrage → **restart complet du GameServer requis** pour tout changement (S24).
- La communauté a produit des outils pour contourner les limites de la 1.188 : **VSRO-EXP-SP-Rates-splitter** (séparer EXP et SP, liés en vanilla — GitHub ahmedkassem56), patchs hex des floats dans srGameServer.exe (elitepvpers 1734793).
- **Convention lue en BCD dans certains patchs** (repère technique) : pour éditer un taux en hex, la valeur est écrite en little-endian ×1000 (35000 → `0x88B8`).

### 🐉 Rates de spawn champion/giant — hardcodés dans le binaire

- Le taux d'apparition des **Giant** est un **paramètre global hardcodé dans sr_gameserver.exe**, pas dans la DB : `GiantMonster_SpawnRatio` — **valeur par défaut = 14 %** ; modifiable par patch OllyDbg (S23, miroir RaGEZONE 1125206).
- Le spawn champion/giant repose sur une **fonction RNG interne au module gameserver** (S23, thread 4448975) — la DB (`Tab_RefNest`) ne contrôle que **quels** monstres et **combien**, pas le pourcentage champion/giant.
- Le **type** d'un monstre est la colonne **`Rarity` de `_RefObjCommon`** : **0 = normal, 1 = Champion, 2 = Giant, 3 = unique avec notice globale, 8 = unique sans notice** (RaGEZONE « Unique Summon Scrolls » 838305 ; elitepvpers « Change MOB type General to Unique »).

### ⏱️ Timers de respawn des uniques — valeurs par défaut de la vSRO

Les timers sont dans **`Tab_RefNest`**, colonnes **`dwDelayTimeMin`/`dwDelayTimeMax` en secondes**, résolues via `Tab_RefTactics.dwObjID` (S22, S46). Valeurs par défaut citées pour la vSRO (post d'admin de privé « aokaday », serveur Cairo — fiabilité 3-4) :

| Unique | dwDelayTimeMin,Max (secondes) | = heures |
|--------|-------------------------------|----------|
| Tiger Girl | 3600*6, 3600*6 | **6 h** |
| Cerberus | 3600*6, 3600*6 | **6 h** |
| Captain Ivy | 3600*6, 3600*6 | **6 h** |
| Uruchi | 3600*3, 3600*3 | **3 h** |
| Isyutaru | 3600*6, 3600*6 | **6 h** |
| Lord Yarkan | 3600*6, 3600*6 | **6 h** |
| Demon Shaitan | 3600*6, 3600*6 | **6 h** |
| BeakYung « Medusa » | 3600*4, 3600*4 | **4 h** |
| Evil Order (unique event) | 3600*2, 3600*2 | **2 h** |
| David / Jupiter (BR) | 3600*4, 3600*4 | **4 h** |

> 📌 **Affinement de notre KB** : `15_UNIQUE_BOSSES.md` indique « 4 h par défaut dans les fichiers vSRO ». Les valeurs réelles par type d'unique sont plutôt **6 h pour la plupart, 3 h pour Uruchi, 4 h pour Medusa/Jupiter** — un unique re-spawn **à un point aléatoire** après un délai min/max tiré au hasard (d'où les fenêtres ressenties « 3-6 h » de l'iSRO).

### 🔧 Outillage communautaire (comprendre les entrailles sans code source)

| Outil | Nature | Cible |
|-------|--------|-------|
| **vSRO-ServerAddon** (JellyBitz, GitHub) | DLL injectée dans SR_GameServer/SR_ShardManager ; actions en temps réel via INSERT SQL dans `_ExeGameServer` | 1.188 (S19) |
| **SRO_DevKit** (florian0, GitLab) | Framework C++ d'interfaces vers les composants du jeu | v188 → iSRO-R (S20, S43) |
| **DuckSoup** (ducksoup-sro) | Packet filter C# .NET10 pour v188 ; embarque les **schémas DB complets** | 1.188 (S17, S31) |
| **RSBot** | Framework de bot clientless — supporte KSRO, vSRO 188/193/274, TSRO/Digeam, RuSRO, BR 100/110 (S36) | multi |
| **PK2 Extractor / _DBtoMedia** | Extraction media.pk2 ↔ tables SQL ; conversion DB → fichiers server_dep du client | tous clients (S47, RaGEZONE 980376) |
| **SMC** | Console officielle de management incluse dans les files (S5, S1) | tous |

---

## 🗄️ 4. Les bases de données SQL — tables et contenu exploitable

### 📐 Les 3 bases

| Base | Contenu | Notes |
|------|---------|-------|
| `SRO_VT_ACCOUNT` | Comptes : `TB_User` (colonnes `sec_primary`/`sec_content` = niveaux GM), `_PrivilegedIP`… | Le SMC crée les comptes ici (S1, S17) |
| `SRO_VT_SHARD` | **Toutes les données du monde** (~200 tables, cf. ci-dessous) | C'est LA source de données de jeu |
| `SRO_VT_SHARDLOG` | Logs (items, exploits…) | (S17) |
| (BR/tSRO : DB « SKILL » séparée) | Données de skills dans certaines versions | « SHARD, LOG, SKILL database » chez Pioneer (S31) |

### 🧾 Inventaire complet des tables SHARD (vSRO 1.188 — schémas publics, S17)

Le repo **ducksoup** expose les schémas C# de chaque table. Inventaire vérifié via API GitHub (2026-10-01) — **~200 tables**, dont :

**Objects & monstres** :
- `_RefObjCommon` — ID, CodeName128 (`MOB_CH_TIGERWOMAN`…), type, **Rarity (0/1/2/3/8)**, `Link` vers `_RefObjChar`/`_RefObjItem`
- `_RefObjChar` — **HP/MaxHP, niveau, dégâts, défenses des monstres** ← la table qui manque à notre KB pour les 111+ (dans les versions plus récentes des files)
- `_RefObjCharExtraSkill`, `_RefCharGen` (génération de personnages), `_RefObjStruct`, `_RefObjItem` (données des items), `_RefObjStruct`
- **Raretés d'items** : `_RefSetItemGroup` ; items : `_Item`, `_ItemPool`, `_LatestItemSerial`, `_BindingOptionWithItem`

**Skills** :
- `_RefSkill` (données complètes de skills — puissance, cooldowns, effets — **jusqu'au cap de la version de files : 110 en 1.188, 120 en 1.193/1.274 avec les skilldatas Jupiter, cf. S16**), `_RefSkillByItemOptLevel`, `_RefSkillGroup`, `_RefSkillMastery`, `_RefCharDefault_Skill(+Mastery)` (skills de départ), `Tab_RefAISkill` (skills d'IA des monstres)

**Alchimie / blues** (⚠️ comble directement nos lacunes `05_ALCHEMY_SYSTEM.md`) :
- `_RefMagicOpt` — définition des blues (groupes MATTR_*) avec **plages de valeurs**
- **`_RefMagicOptByItemOptLevel`** — **mapping des plages de blues par degré d'item** (la table que notre KB croyait « dump public non disponible » — elle est dans toutes les DB vSRO, schéma public S17, données dans les dumps S26/S27/S29/S30)
- `_RefMagicOptAssign`, `_RefMagicOptGroup`, `_RefAbilityByItemOptLevel`, `_RefAlchemyMerit`

**Drops** :
- `_RefDropClassSel_Equip` / `_RefDropClassSel_RareEquip` (probability groups « PobGroup » — contrôle SoX ; le facteur de base cité est **14,99** en RareEquip, S-elitepvpers 2573946), `_RefDropClassSel_Alchemy_ATTRStone/MagicStone/Tablet`, `_RefDropClassSel_Ammo/Cure/Recover/Scroll/Reinforce`
- `_RefDropGold`, `_RefDropItemAssign`, `_RefDropItemGroup`, `_RefDropOptLvlSel`
- `_RefMonster_AssignedItemDrop` (+`_RndDrop`) — **couche de drops bonus assignés par monstre** (S39) ; `_RefCustomizingReservedItemDropForMonster`

**Spawns** (⚠️ comble nos lacunes `MONSTERS_SPAWN_LOCATIONS.md`) :
- **`Tab_RefHive`** (groupes de spawn) → **`Tab_RefTactic`** (comportement ; liaison via `dwObjID`) → **`Tab_RefNest`** (**nids : région, coordonnées X/Y/Z, effectif, `dwDelayTimeMin/Max` en secondes**)
- `_RefRegion`, `_RefRegionBindAssocServer` (régions ↔ gameservers), `_RefTeleport`/`_RefTeleLink` (portes de téléport), `_RefOptionalTeleport`

**Quêtes** :
- `_RefQuest`, `_RefQuestReward`, `_RefQuestRewardItem`, `_RefCharDefault_Quest`, `_CharQuest` — **280+ quêtes de la 1.188 déjà documentées** dans le repo public SROquests (S21), avec NPC, niveaux, récompenses, répétitions, coordonnées

**Progression / leveling** :
- **`_RefLevel`** — table des **XP par niveau** (leveldata officielle) ; `_RefHWANLevel` (paliers Zerk) ; `_RefCharGen` ; `_Char`/`_CharSkill(+Mastery)`/`_Inventory(+Avatar/LinkedStorage)`/`_CharTrijob` (jobs)

**Économie / NPC** :
- `_RefShop`, `_RefShopGroup`, `_RefShopTab(+Group)`, `_RefShopGood`, `_RefShopItemGroup`, `_RefShopItemStockPeriod`, `_RefMappingShopGroup/WithTab`, `_RefPackageItem`, `_RefPricePolicyOfItem` (**prix de vente des NPC**), `_RefScrapOfPackageItem`, `_RefConditionToSellScrapItem`… ; `_OpenMarket`/`_FleaMarketNetwork` (stalls), `_ItemQuotation`

**Forteresse / guildes / academy / jobs** :
- `_RefSiegeFortress(+BattleRank/Guard/ItemForge/Reward)`, `_RefSiegeDungeon`, `_RefSiegeQuest(+Reward)`, `_RefSiegeStructUpgrade`, `_RefSiegeLvlSummonMonster`, `_RefSiegeBlessBuff`, `_SiegeFortress*` (7 tables live)
- `_Guild`, `_GuildMember`, `_GuildChest`, `_GuildWar`, `_AlliedClan`, `_GPHistory`
- `_TrainingCamp*` (5 tables — academy), `_TrijobReward`, `_TrijobRanking4WEB`, `Tab_RefRanking_{Hunter,Robber,Trader}{Activity,Contribution}` (classements de job)

**Instances / FGW / events** :
- `_RefGame_World(+_Config)`, `_RefGameWorldGroup(+_Config)`, `_RefGameWorldNPC`, `_RefInstance_World_Region`, `_RefInstance_World_Start_Po`, `_RefGameWorldBindGameWorldGroup` (donjons type FGW)
- `_RefEvent`, `_RefEventReward(+Item)`, `_RefEventZone`, `_RefServerEvent(+Reward/_ExpUPForPlayer/_SpawnMonster)`, `_RefScheduleDefine`, `_Schedule`

**Divers** : `_RefClimate` (météo), `_RefCollectionBook_(Theme/Item)` + `_CharCollectionBook` (collection), `_RefGacha*` (Magic Pop), `_RefUIString_Mt` (textes), `_RefShardContentConfig`, `_RefAccessPermissionOfShop`, `_RefDummySlot`, `_RefTrainingCampBuffStatus`…

### 🔍 Jusqu'à quel cap chaque table est-elle remplie ?

| Table | vSRO 1.188 | vSRO 1.193/1.274 | BR120 | tSRO 1.258 / cSRO-R / iSRO-R | iSRO/KSRO |
|-------|-----------|-------------------|-------|------------------------------|-----------|
| `_RefObjCommon`/`_RefObjChar` (HP monstres) | **jusqu'à 110** (Seth 110, FGW 101-110) | + Jupiter **110-120** (S16) | Jupiter cap 120 (S5) | jusqu'à ~120-130 (D13) | **cap 125+, 14DG** (S14) |
| `_RefSkill` | skills jusqu'au lvl 110 | skills 120 + mobs Jupiter (S16) | 120 | 120+ | 125+ |
| `_RefMagicOpt*` (blues) | D1-D11 | D12 (patchs) | D12 | D13 | D14 |
| `Tab_RefNest` (spawns) | monde complet jusqu'à Alexandrie/FGW | + Jupiter | Thaïlande (monde identique) | + contenu local | le plus complet |

---

## 🔗 5. Dumps publics accessibles (liens)

> ⚠️ Rappel : liens documentés à titre de recensement. Téléchargement/usage = risque légal (cf. §9). Certains liens requièrent un compte forum et certains hébergeurs sont morts (S31 signale son lien mort).

### Forums (files complètes + DB)
- **vSRO 1.188 files** : RaGEZONE 779870 (S2) · RaGEZONE 780427 files+client (S48) · elitepvpers 1430066 (release originale, Cloudflare) · elitepvpers 3451859 (re-upload « no Ramnits ») · elitepvpers 5244813 (clean compilation, S26) · guide 1x : elitepvpers 4419811
- **vSRO 1.188 + D12 Jupiter (rétrofit)** : elitepvpers 4624379 (S27) + miroirs RaGEZONE 1162499 / silkroadlobby 31923
- **vSRO 1.193** : RaGEZONE 816344 (S15) · skilldatas 120 : elitepvpers 1869889 (S16) · TopS4A VSRO-R v193 (S-50bis)
- **vSRO 1.274** : files elitepvpers 4993522 (S11) · **database** elitepvpers 5277574 (S12) · devkit/filter SroCave 1805 (S38)
- **DB cap 120 prêtes** : elitepvpers 1571121 (S29) · elitepvpers 1710097 Jupiter (S30) · vsro.org « 120 Cap Client – Database (Jupiter Fixed) » 10388
- **BlackRogue** : BR120 RaGEZONE 1107257 (S5) · BR110 elitepvpers 1590952 (S6) · files+DB+patch RaGEZONE 847379 (S7)
- **tSRO v1.258 (Eroad, Taïwan)** : RaGEZONE 1020724 (S8)
- **jSRO** : elitepvpers 1252511 (fixing, S9)
- **cSRO/ECSRO** : RaGEZONE 830540 (S10)
- **iSRO-R Rigid 2015** : elitepvpers 5068290 (S13) · repack RaGEZONE 1208329 (S49)
- **Hub RaGEZONE Silkroad Releases** : https://forum.ragezone.com/community/silkroad-releases.722

### GitHub / GitLab (documentation, schémas, données dérivées)
- **ducksoup** — schémas SQL VSRO188 (SHARD/ACCOUNT/LOG) : https://github.com/ducksoup-sro/ducksoup/tree/main/Database/VSRO188 (S17) ← **le meilleur point d'entrée public pour la structure de la DB**
- **Ex-o/Silkroad-Database-Documentation** : https://github.com/Ex-o/Silkroad-Database-Documentation (S18)
- **AlighieriDemiurgs/SROquests** — 280+ quêtes extraites de la 1.188 : https://github.com/AlighieriDemiurgs/SROquests (S21)
- **JellyBitz/vSRO-ServerAddon** : https://github.com/JellyBitz/vSRO-ServerAddon (S19)
- **florian0/sro_devkit** (GitLab) : https://gitlab.com/florian0/sro_devkit (S20) · miroir iSRO-R : artuuro/ISRO-R-DEVKIT (S43)
- **VSRO-EXP-SP-Rates-splitter** : https://github.com/ahmedkassem56/VSRO-EXP-SP-Rates-splitter
- **RSBot** (régions supportées) : https://github.com/myildirimofficial/RSBot (S36)
- **HyperbotDoc** (RE des taux d'alchimie, déjà dans notre KB) : https://sandsnip3r.github.io/HyperbotDoc/

### Données déjà extraites (pas de files nécessaires)
- **silkroadonline.wiki** — client build **v1_657** : 42 532 records, **8 387 monstres/uniques**, 21 490 items (S37) — notre KB l'utilise déjà
- **TopS4A Query Collection** (SQL vSRO) : https://www.tops4a.com/2019/08/query.html (S50)
- **Silkroad4Arab hub** : https://www.silkroad4arab.com/vb/showthread.php?t=507777 (S45)

---

## 💎 6. Ce que les fichiers révèlent du jeu officiel (chiffres extractibles)

Tout ce qui suit est **contenu dans les files fuitées** = données officielles Joymax (par opposition aux reconstructions communautaires) :

| Donnée | Valeur | Où (file/table) | Confiance |
|--------|--------|------------------|-----------|
| Rates officiels par défaut | **1x** (`ExpRatio 1000`, etc. — les files tournent en 1x par défaut) | server.cfg | 5 |
| Sémantique des rates | taux = valeur/1000 ; party bonus ; HwanGainFactor | server.cfg (S24/S25) | 5 |
| Limite joueurs par AgentServer | **1000** | architecture (S1) | 5 |
| Répartition du monde | plusieurs GameServers par régions (`_RefRegionBindAssocServer` 0/1/2/3) | SHARD (S1) | 5 |
| Taux de spawn des **Giant** | **14 %** par défaut (hardcodé sr_gameserver) | binaire (S23) | 3-4 |
| Type de monstre | `Rarity` : 0 normal / 1 Champion / 2 Giant / 3 unique+notice / 8 unique silencieux | `_RefObjCommon` (RZ 838305) | 4 |
| Timers uniques par défaut | TG/Cerberus/Ivy/Isyutaru/Yarkan/Shaitan **6 h**, Uruchi **3 h**, Medusa **4 h**, Evil Order 2 h, Jupiter-side 4 h (min/max en secondes) | `Tab_RefNest.dwDelayTimeMin/Max` (S22) | 3-4 |
| Taux d'alchimie | élixirs 50/40/30/19/17/12 + powder +50/30/20/8/8 (déjà dans notre KB — confirmé DB vSRO) | `_RefObjItem.Param` (HyperbotDoc/SroCave) | 5 |
| Dégât à l'échec d'alchimie | dès +5 : 50 % destruction / 50 % malus durabilité (déjà KB) | logique décompilée (opensro) | 5 |
| Plages de blues par degré | paires min/max par degré et par groupe MATTR | **`_RefMagicOptByItemOptLevel`** | 5 (existence) — données à extraire |
| Prix NPC de tous les items | gold par item | `_RefPricePolicyOfItem` | 5 (existence) |
| XP par niveau | table officielle complète | **`_RefLevel`** | 5 (existence) |
| Drops par monstre/niveau | probability groups + couches bonus | `_RefDropClassSel_*`, `_RefMonster_AssignedItemDrop` | 5 (existence) |
| Quêtes | ~280+ (1.188) avec récompenses exactes | `_RefQuest*` (S21) | 5 |
| HP/niveaux monstres | jusqu'au cap de chaque version (110 / 120 / 125+) | `_RefObjChar` | 5 (existence) |

**Ce que les files ne révèlent PAS (constat négatif)** : aucune extraction publique de la **formule de dégâts** depuis les binaires (les constantes 1.2767/1.2870 de notre KB restent des reconstructions joueurs — S-recherche dédiée sans résultat) ; pas de table de **proc d'imbues** trouvée ; les **taux 12D+ (인핸서)** du service coréen vivant restent absents de toutes les files fuitées (le service KR moderne n'a jamais fuité).

---

## 🔨 7. Moddings communautaires : rétrofits DG12/13 sur 1.188

### La méthode (thread S28 — « Upgrade DB and Client from D11 → D12 → D13 »)

1. Télécharger un **client KSRO récent** (contient les données D12/D13 dans `media.pk2`).
2. Extraire avec **PK2 Extractor** : `itemdata.txt`, `characterdata.txt`, `skilldata*.txt` (fichiers découpés par tranches d'IDs — `skilldata_5000`…`skilldata_30000` ; colonnes : Number of Attacks, Cast Time, Attack Distance — RZ 624221).
3. **Comparer les colonnes** entre la version 1.188 et la version récente : « the file format differs by only ~2 columns » — le format est resté stable, d'où la faisabilité du port.
4. Insérer les lignes D12 dans les tables SQL (`_RefObjItem`, `_RefObjCommon`, `_RefSkill`…) et ré-importer côté client via `server_dep` (portail **Depian** cité pour les itemdata).
5. Recâbler les drops : `_RefDropClassSel_Equip` avec des **tranches de niveaux alignées au niveau des items D12** (elitepvpers 2164591 : « choose the right level according to the item »).

### Les packs prêts à l'emploi

- **« vSRO 1.188 Server Files + Client D12 Jupiter Original »** (S27) : 1.188 + « **Fixed Items Normal D12, Fixed Drop D12, Fixed Jupiter Unique, Fixed Skill 120, Avatar additions** » — le rétrofit type « KSRO→1.188 » le plus diffusé.
- **DB cap 120 fixes** (S29/S30) : cap 120 joueur + skills 120 + armes D12 + carte Jupiter + item mall/régions fonctionnels.
- **Skilldatas 1.193** (S16) : montées de skills CH/EU jusqu'à 120 **et skills des mobs Jupiter 110-120** — prouve que le contenu 111+ est bien présent dans les versions 1.193+.

### Le Patching sans code source

Toute la customisation avancée passe par : **patch binaire** (OllyDbg/ASM — ex. changer GiantMonster_SpawnRatio, floats de rates, S23), **injection DLL** (vSRO-ServerAddon, SRO_DevKit, DuckSoup), **édition SQL**. Aucun code source des files n'existe publiquement (S40).

---

## ✅ 8. Réponses aux lacunes de notre base (avec confiance)

| Lacune (fichier KB) | Réponse trouvée | Confiance |
|---------------------|-----------------|-----------|
| **HP des boss 111+** (`15_UNIQUE_BOSSES.md`) | **La vSRO 1.188 ne les contient pas** (cap 110). Ils existent dans `_RefObjChar` des **vSRO 1.193/1.274, BR120, tSRO 1.258, iSRO-R, et les files iSRO/KSRO fuitées** (Zyain : cap 125, 14DG). Aucune valeur publiée en clair sur le web → l'extraction de ces DB reste la voie (dumps publics listés §5). | 4 (inventaire) / HP : à extraire |
| **Timers uniques « 4 h par défaut vSRO »** (`15_UNIQUE_BOSSES.md`) | Valeurs par défaut réelles : **6 h** (TG, Cerberus, Ivy, Isyutaru, Yarkan, Shaitan), **3 h** (Uruchi), **4 h** (Medusa), 2 h (Evil Order), 4 h (Jupiter-side) — dans `Tab_RefNest.dwDelayTimeMin/Max` (secondes), spawn à point aléatoire après tirage min/max. | 3-4 |
| **Plages de blues par degré** (`05_ALCHEMY_SYSTEM.md` : « dump public non disponible ») | **La table existe et est publique en structure** : `_RefMagicOptByItemOptLevel` (+ `_RefMagicOpt`, `_RefMagicOptAssign`, `_RefMagicOptGroup`) — schémas dans ducksoup (S17), données dans chaque dump de DB publique (§5). Encodage des MagParam expliqué par SroCave (« MagicParam – Blue values », déjà sourcé dans notre KB). → mettre à jour la KB : le dump EST disponible via les DB publiques. | 4 |
| **Taux de spawn Champion/Giant** (`MONSTERS_SPAWN_LOCATIONS.md` : « ~5 %/~1 % rapporté, non vérifié ») | **Hardcodé dans sr_gameserver.exe, pas en DB** : `GiantMonster_SpawnRatio` **défaut 14 %** (patchable OllyDbg) ; champion/giant = RNG interne du gameserver. Le type est `Rarity` (1=Champion, 2=Giant) dans `_RefObjCommon`. → corrige nos estimations « ~1 % » (giant) : **14 % selon les files**. | 3-4 |
| **Nids de spawn / coordonnées** (`MONSTERS_SPAWN_LOCATIONS.md`) | `Tab_RefHive → Tab_RefTactic → Tab_RefNest` : région + X/Y/Z + effectif + délais de respawn par monstre — extraction possible des DB publiques ; guides SQL « Increase inactive monster spawn count » (copier des lignes de nids). | 4 |
| **Constantes de la formule de dégâts** (`28_ADVANCED_MECHANICS.md` §Incertitudes) | **Toujours non résolues** : aucune extraction publique du calcul de dégâts du gameserver ; les constantes 1.2767…/1.2870… restent des reconstructions elitepvpers (recherche dédiée : aucun résultat RE). | — (constat négatif) |
| **Formule HP (exponentielle 2006 vs linéaire)** (`28_ADVANCED_MECHANICS.md`) | Piste non tranchée : la table `_RefLevel` des files contient la table d'XP officielle par niveau ; les HP dérivés par stat restent à extraire (pas de publication trouvée). | — (piste) |
| **Rates officiels du jeu** | `ExpRatio 1000` = **1x par défaut dans les files** → les files fuities reproduisent les taux officiels ; DropGoldAmountCoef = coefficient d'or ; HwanGainFactor = Zerk. | 5 |
| **Hypoothèse « BlackRogue = RSRO russe »** (mission) | **Réfuté** : BlackRogue = service officiel **thaïlandais** (ini3, `blackrogue.in`, package `SRO_Thailand_CS_106`). Les files « russes » = Silkroad R (iSRO-R/RSRO, « Rigid 2015 »). | 4 |
| **ECSRO = émulateur indépendant ?** (mission) | **Réfuté** : les files ECSRO/ZSZC = **files de test cSRO fuitées** (RaGEZONE 830540) ; aucun émulateur from scratch n'a jamais tourné en production. | 4 |
| **Architecture officielle** (doc technique SRObro) | 9 modules dans l'ordre (certification→GlobalManager→MachineManager→DownloadServer→GatewayServer→FarmManager→AgentServer→ShardManager→GameServer) ; 3 DB MSSQL ; 1000 joueurs/Agent ; régions réparties sur plusieurs GS. | 5 |

---

## ⚖️ 9. Conséquences légales — Joymax c. ECSRO

- **2009** : Joymax porte plainte contre **ECSRO** (associé à ZSZC) pour violation de copyright et vol de files — documents communautaires évoquant **~48 chefs** d'accusation et **~2,5 M$ de dommages réclamés** (S32, S33 — fiabilité 3 : forum, documents d'époque rediffusés).
- ECSRO ferme ~2009-2010 sans retour (S44) — fin de la « première génération ».
- La fuite vSRO 2011 relance la scène **malgré** ce précédent ; Joymax n'a visiblement pas renouvelé d'action publique d'ampleur contre les milliers de privés suivants (constat communautaire).
- Le consensus communautaire explicite : faire tourner un serveur Silkroad sur des files fuitées **est illégal** (files propriétaires Joymax/Wemade).

---

## ⚠️ 10. Incertitudes restantes

1. **Date exacte de la fuite 1.188** : guide du leaker daté **13/09/2011** (S1) vs « novembre 2011 » (S3) — non tranché.
2. **Contenu exact des BR100/BR110** (degrés, cartes) — releases anciennes peu documentées ; seul BR120 est décrit précisément (S5).
3. **Facteur ×1000 des HP FGW** (conflit relevé dans `15_UNIQUE_BOSSES.md`) : aucune source trouvée comparant `characterdata` client vs `_RefObjChar` serveur pour les monstres d'instance — l'hypothèse « HP des guides TR issus des files ×1000 » reste à vérifier par extraction.
4. **Constantes de la formule de dégâts** et **taux de proc des imbues** : jamais extraits publiquement des binaires (constat négatif multi-requêtes).
5. **Version client exacte de la 1.188** : souvent appariée au client v1.188 (ou rétrofit D12 client v1.040 BR) — le numéro de build client iSRO correspondant (type v1.657 de silkroadonline.wiki) n'est pas établi formellement.
6. **Timers uniques par défaut** : source unique d'admin de privé (S22) citant les defaults vSRO — à recouper par extraction directe d'une DB 1.188 propre.
7. **Chiffres de la plainte Joymax** (48 chefs / 2,5 M$) : uniquement via rediffusions forum des documents, pas de source judiciaire primaire accessible.

---

## 🎯 11. Recommandations pour SRObro

1. **Ne pas chercher les boss 111+ dans la 1.188** — viser les DB **vSRO 1.274** (S12), **BR120** (S5) ou **iSRO-R** (S13), toutes publiques côté forums : leur `_RefObjChar` contient Jupiter/Kidemonas/etc.
2. **Extraire `_RefMagicOptByItemOptLevel`** d'un dump public (S26/S27/S29) pour clore la lacune « plages de blues par degré » de `05_ALCHEMY_SYSTEM.md`.
3. **Corriger la KB** : timers uniques par défaut (6 h/3 h/4 h au lieu de « 4 h »), taux giant (14 % hardcodé vs « ~1 % »), hypothèse BlackRogue (Thaïlande, pas Russie), ECSRO (files cSRO, pas émulateur).
4. **Documenter l'architecture officielle** (§3) dans `TECHNICAL_SPECIFICATIONS.md` — c'est la seule description du fonctionnement serveur officiel disponible (source = le leaker lui-même).
5. Rester en **mode documentation uniquement** : URLs et structure, jamais d'hébergement de files (précédent Joymax c. ECSRO).

---

## 📌 Synthèse — Top 5 trouvailles

1. **`GiantMonster_SpawnRatio` = 14 % par défaut, hardcodé dans sr_gameserver.exe** (S23) → comble la lacune « taux champion/giant non vérifiés » de `MONSTERS_SPAWN_LOCATIONS.md` (nos « ~1 % » pour les giants étaient faux d'un ordre de grandeur).
2. **Timers de respawn par défaut des uniques dans la vSRO** (TG/Cerberus/Ivy/Isyutaru/Yarkan/Shaitan = 6 h, Uruchi = 3 h, Medusa = 4 h — en secondes dans `Tab_RefNest.dwDelayTimeMin/Max`, S22/S46) → remplace le « 4 h par défaut » approximatif de `15_UNIQUE_BOSSES.md`.
3. **Schémas SQL publics des ~200 tables de la shard vSRO 1.188** (repo ducksoup, S17 — inventaire complet listé §4) : `_RefMagicOptByItemOptLevel` (plages de blues), `Tab_RefNest` (nids de spawn), `_RefLevel` (XP/niveau), `_RefQuest*` (280+ quêtes déjà documentées via SROquests), `_RefPricePolicyOfItem` (prix NPC) → chemin d'accès documenté pour presque toutes nos lacunes de données.
4. **Inventaire complet des fuites avec caps** : vSRO 1.188 = **cap 110/D11** (donc PAS de boss 111+) ; vSRO 1.193/1.274 = 120/Jupiter ; **BlackRogue = service thaïlandais ini3** (package `SRO_Thailand_CS_106`, réfute l'hypothèse « RSRO russe ») ; iSRO-R « Rigid » 2015 ; **iSRO/KSRO fuitées** (Zyain, cap 125/14DG) → la hiérarchie des sources pour les données 111+ est désormais établie.
5. **Architecture officielle + rates par le leaker lui-même** (guide Chernobyl du 13/09/2011, S1) : ordre de démarrage des 9 modules, 3 DB MSSQL, certification port 32000, 1000 joueurs/AgentServer, régions réparties par `_RefRegionBindAssocServer`, `ExpRatio 1000` = 1x (les files = les taux officiels) + correction historique ECSRO (files cSRO de test, plainte Joymax ~48 chefs/2,5 M$).

**Lacunes restantes** : HP chiffrés des boss 111+ (extraction de DB requise — aucune valeur publiée en clair), constantes de la formule de dégâts et taux de proc d'imbues (jamais extraits publiquement), facteur ×1000 des HP FGW, date exacte de la fuite 1.188 (sept. vs nov. 2011), contenu détaillé des BR100/110.

---

*Rapport : `ML_RESEARCH/RESEARCH_PS_FILES.md` · 2026-10-01 · ~35 requêtes EN + inspection API GitHub · Sources : RaGEZONE, elitepvpers, ProjectHax, Reddit, GitHub/GitLab (ducksoup, Ex-o, JellyBitz, florian0, SROquests, RSBot), silkroadonline.wiki, nostalgic.gg, GamesIndustry.biz, TopGameServer*
