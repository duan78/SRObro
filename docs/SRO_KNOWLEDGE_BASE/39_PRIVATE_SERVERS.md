# Serveurs Privés — Écosystème, Fichiers Fuités et Archéologie du Contenu

> 📍 **Vous êtes ici :** [Accueil](README.md) → [Hub Technique](HUB_TECHNIQUE.md) → [Serveurs Privés](39_PRIVATE_SERVERS.md)

---

## 📋 Table des Matières
- [Vue d'Ensemble](#-vue-densemble)
- [Histoire de la Scène (2007-2022+)](#-histoire-de-la-scène-2007-2022)
- [Inventaire des Fuites de Fichiers](#-inventaire-des-fuites-de-fichiers)
- [Architecture Serveur Officielle](#-architecture-serveur-officielle)
- [Tables SQL et Données Exploitables](#-tables-sql-et-données-exploitables)
- [Données Officielles Récupérées via les Privés](#-données-officielles-récupérées-via-les-privés)
- [La Scène Arabe](#-la-scène-arabe)
- [Outils d'Extraction de Données](#-outils-dextraction-de-données)
- [Ce que les Privés ne Peuvent PAS Fournir](#-ce-que-les-privés-ne-peuvent-pas-fournir)
- [FAQ](#-faq)
- [Resources](#-resources)

---

## 🌍 Vue d'Ensemble

Ce document est **la référence unique de la base sur l'écosystème des serveurs privés** : histoire des fuites, inventaire des fichiers, architecture serveur officielle qu'ils documentent, tables SQL exploitables, données officielles récupérables, scène arabe et outillage d'extraction. Il consolide quatre rapports de recherche (voir [Resources](#-resources)).

### Rôle historique des serveurs privés

- ✅ **Conservation du jeu** : les bases SQL vSRO 1.188 « originales, propres, toutes zones et donjons officiels » ([elitepvpers 5329817](https://www.elitepvpers.com/forum/silkroad-online-trading/5329817-silkroad-database-v1-188-v2-original-clean-all-official-areas-dungeons.html)) figent l'état officiel du jeu — c'est **la** source secondaire pour restaurer des données officielles disparues. L'archive de clients de florian0 (4 ans de collecte) fut le grand projet d'archéologie, mais ses torrents sont morts.
- ✅ **Archéologie du contenu** : **Devil's Garden** et **Petra Maze** existaient dans les fichiers du client sans activation officielle avérée ; la communauté les a « fixés » (bugs de synchronisation de mouvement corrigés — [elitepvpers 4327801](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4327801-arabian-petra-maze-devils-garden-fixed-maps.html)). Les fichiers complets de **Shambhala** (officiel 2018) ont été relâchés ([elitepvpers 4667336](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4667336-release-shambhala-map-full-files.html)). Le PS Myth avait du contenu Arabia dès **2012**, avant l'officiel de 2015.
- ✅ **Mémoire technique** : SilkroadDoc, RSBot, les émulateurs et les schémas SQL publics documentent formats, packets et mécaniques — indispensables maintenant que SilkroadDoc est archivé (juin 2025).
- ✅ **Relais de population** : avec le déclin d'iSRO, les privés et le mobile officiel sont les principaux lieux où le contenu cap 120-140 vit encore.

### ⚖️ Note légale

> Ce document **recense et documente uniquement** (URLs, contenu, structure). Il ne fournit **ni n'héberge aucun fichier**. Les fichiers de serveur Silkroad sont la propriété de **Joymax / Wemade Max** — leur téléchargement/usage est légalement risqué (précédent Joymax c. ECSRO, 2009 : ~48 chefs d'accusation, ~2,5 M$ de dommages réclamés — voir [Histoire](#-histoire-de-la-scène-2007-2022)).

---

## 📜 Histoire de la Scène (2007-2022+)

### 🐣 Première génération (2007-2010) : avant les files officielles

- **MHTC** = le **premier serveur privé Silkroad** : fondé par un admin chinois avec « ocean » comme co-admin, tournant sur des **files hackées du jeu original cSRO** ([elitepvpers — history of silkroad](https://www.elitepvpers.com/forum/sro-private-server/4701666-history-silkroad.html)).
- **ECSRO** (Elite Chaos Silkroad Online), **SWSRO**, **SJSRO** suivent (fin 2000s) — l'âge d'or nostalgique des vétérans.

> ⚠️ **Correction d'hypothèse (majeure)** : ECSRO n'était **PAS un émulateur développé from scratch**. Les files « ECSRO » qui circulent sont des **files de test cSRO fuitées** (« Both of these files are leaked cSRO testing server files which were used by ECSRO/ZSZC » — [RaGEZONE 830540](https://forum.ragezone.com/threads/ecsro-server-files.830540)). Le déclencheur : un certain **KingLi** aurait obtenu les files et menacé de les publier sans un poste GM ([elitepvpers 4402579](https://www.elitepvpers.com/forum/sro-private-server/4402579-rare-lawsuit-case-ecsro.html)). Des projets d'émulateurs (sremu, csremu…) ont existé dès 2007-2008, mais **aucun code source de serveur Silkroad n'a jamais fuité** : tout le modding se fait par reverse engineering des binaires (patch hex/OllyDbg, injection DLL, édition SQL) — consensus explicite ([elitepvpers 5375146](https://www.elitepvpers.com/forum/sro-coding-corner/5375146-where-source-code-how-do-people-modify-customize-private-servers.html)).

### 💥 La plainte Joymax (2009) et la fin de la première génération

- **2009** : Joymax porte plainte contre **ECSRO** (associé à ZSZC) pour violation de copyright et vol de files — documents d'époque rediffusés évoquant **~48 chefs** et **~2,5 M$** de dommages réclamés (fiabilité 3 : sources forum uniquement).
- ECSRO ferme ~2009-2010 sans retour. La fuite vSRO 2011 relance la scène **malgré** ce précédent ; Joymax n'a visiblement pas renouvelé d'action publique d'ampleur contre les milliers de privés suivants.

### 🌊 La fuite fondatrice : vSRO 1.188 (2011)

- Le leaker **« Chernobyl »** partage les files du **service officiel vietnamien** (vSRO, opéré par VTC Game) : « i've shared files i leaked from Vietnam Silkroad official servers » — son guide de setup est daté du **13/09/2011** ([RaGEZONE 780273](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273), fiabilité 5 : écrit par le leaker lui-même).
- Chronologie communautaire : « Server files leaked in november 2011 from the Vietnamese version… and later many more files got leaked from Thailand, Taiwan and Japan » ([elitepvpers 4715286](https://www.elitepvpers.com/forum/silkroad-online/4715286-origin-private-servers.html)) — la date exacte (juillet/sept./nov. 2011 selon les sources) **reste non tranchée**.
- La 1.188 = fichiers de l'ère **Legend V « Heroes of Alexandria »** : **cap 110, D11**, Alexandrie + Job Temple ([GamesIndustry.biz](https://www.gamesindustry.biz/silkroad-online-level-cap-hits-110-with-legend-v-heroes-of-alexandria-update)). Changeset interne cité par le leaker : « vsro obt v247-v249 ».

### 🗓️ Les ères suivantes

| Période | Événement | Détail |
|---|---|---|
| ~2011-2012 | **vSRO 1.193** | « New job system » ; skilldatas 120 incluant les **skills des mobs Jupiter 110-120** |
| **juin-juil. 2012** | **vSRO 1.274** | Fuite par **Syloox** ; utilisée par « Pioneer » ; DB re-release 2023 |
| ~2012 | **BlackRogue** (BR100/BR110) | Service officiel **thaïlandais** (ini3, site `blackrogue.in`, ~2010-2012) |
| **07/2016** | **BlackRogue BR120** | Release MeGaMaX « before the official server got shutdown » — package `SRO_Thailand_CS_106`, cap 120, D12 |
| ~2013-2014 | **tSRO v1.258 (Eroad)** | Vraies files taïwanaises + DB |
| ~2013 | **jSRO** | Files japonaises fuitées, long effort de fixation communautaire (38+ pages) |
| ~2014-2015 | **cSRO-R** | Service chinois Silkroad R (silkroad.lt tournait dessus) |
| 2015 files / ~2021 release | **iSRO-R « Rigid Online »** | Files officielles du Silkroad R de 2015, repackées (serveurs type CyronSRO en cap 120) |
| ~2022+ | **iSRO et KSRO fuitées** | Le serveur **Zyain** (BlazeGN) tourne sur les « ISRO Latest Files », **cap 125, 14 degrés** — les files les plus complètes en circulation |

> ⚠️ **Correction d'hypothèse n°2** : BlackRogue n'est **PAS** issu du service russe. Le package BR120 s'appelle littéralement `SRO_Thailand_CS_106.zip` — c'est le **service officiel thaïlandais (ini3)**. Les files « russes » correspondent au service **Silkroad R (RSRO)** — les « iSRO-R / Rigid 2015 » en proviennent ; RSBot liste « RuSRO » séparément.

**Conséquence structurelle** : la division historique « vSRO vs ECSRO » correspond à deux époques — **files cSRO de test (2007-2010)** puis **fuite vietnamienne officielle (2011+)**. La scène actuelle repose sur les builds **v188, v193, v274, BR120 et les files Silkroad-R/iSRO**.

---

## 🗃️ Inventaire des Fuites de Fichiers

Fiabilité : 5 = leaker/dump inspecté · 4 = forum de référence multi-sources · 3 = témoignage unique.

| Fuite | Origine (service officiel) | Version / Cap | Degrés | Contenu clé | Dumps publics | Fiab. |
|-------|---------------------------|---------------|--------|-------------|---------------|-------|
| **MHTC files** | Hack des serveurs **cSRO** | ~2007-2008 · cap 60-90 | — | Premier serveur privé de l'histoire | — | 3 |
| **ECSRO/ZSZC files** | **Files de TEST cSRO fuitées** | cap 90 (ECSRO) | ≤ 9D | Utilisées par ECSRO et ZSZC — **pas un émulateur** | [RaGEZONE 830540](https://forum.ragezone.com/threads/ecsro-server-files.830540) | 4 |
| **SWSRO files** | ? (« super old », pré-vSRO) | bas | — | Ancienne génération historique | — | 3 |
| **vSRO 1.188** | **Vietnam** (VTC Game) | **cap 110** | **D11** | Base de ~90 % des privés : monde complet jusqu'à Alexandrie/Job Temple, FGW, Qin-Shi Tomb | [RZ 779870](https://forum.ragezone.com/threads/vsro-server-files-v188.779870) · [RZ 780427](https://forum.ragezone.com/threads/vsro-server-files-client-v1-188.780427) · [epvp 5244813 (clean)](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5244813-sro-game-files-v1-188-a.html) | 5 |
| **vSRO 1.188 + D12 Jupiter** (rétrofit) | Vietnam + contenu KSRO réinjecté | cap 120 | D12 | « Fixed Items Normal D12, Fixed Drop D12, Fixed Jupiter Unique, Fixed Skill 120 » | [epvp 4624379](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4624379-vsro-1-188-server-files-client-d12-jupiter-orginal.html) · DB 120 : [epvp 1571121](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1571121-fixed-database-vsro-files-cap120-skil-sql-server-2005-a-2.html) / [1710097](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1710097-reuploaded-database-120-cap-skill-jupiter-map-running-sql-server-2005-a.html) | 4 |
| **vSRO 1.193** | Vietnam | cap 120 (skills 120) | D12 (via skilldatas) | « New job system » ; skilldatas 120 avec **skills des mobs Jupiter 110-120** | [RZ 816344](https://forum.ragezone.com/threads/vsro-files-v193-new-job-system.816344/) · skilldatas : [epvp 1869889](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1869889-release-new-vsro-files-1-193-skilldatas-120-skills.html) | 4 |
| **vSRO 1.274** | Vietnam | cap 120 | D12+ | Fuite **Syloox** (juin-juil. 2012) ; utilisée par « Pioneer » | files : [epvp 4993522](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4993522-release-vsro-274-files.html) · **database** : [epvp 5277574](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5277574-release-vsro-v1-274-database.html) · devkit : [SroCave 1805](https://srocave.com/konular/release-vsro-v1-274-devkit-filter.1805) | 4 |
| **BlackRogue BR100/BR110** | **Thaïlande (ini3)** | 100 / 110 | D10/D11 | Files du service officiel thaï ; RSBot liste « Blackrogue 100/110 » | [epvp 1590952](https://www.elitepvpers.com/forum/sro-private-server/1590952-release-blackrogue-server-files.html) · [RZ 847379](https://forum.ragezone.com/threads/black-rouge-files-database-patch-how-to-setup-it.847379) | 4 |
| **BlackRogue BR120** | **Thaïlande (ini3)** — réfute l'hypothèse RSRO | **cap 120** | **D12** | Package `SRO_Thailand_CS_106` : Config/InitialDB/Query/ServerBinary/SMC, 4 exes + DLL, client BR v1.040 | [RZ 1107257](https://forum.ragezone.com/threads/blackrouge-official-cap-120-server-files.1107257) | 5 |
| **tSRO v1.258 (Eroad)** | Taïwan | ~120-130 | D12/D13 | « Real Taiwan server files » + DB | [RZ 1020724](https://forum.ragezone.com/threads/release-the-real-taiwan-sro-server-files.1020724) | 4 |
| **jSRO** | Japon | ? | ? | Files japonaises fuitées, effort de fixation communautaire | [epvp 1252511](https://www.elitepvpers.com/forum/sro-private-server/1252511-fixing-japanese-silkroad-leaked-files-38.html) | 4 |
| **cSRO-R** | Chine (Silkroad R) | cap 120 | D13 | Files du service chinois Silkroad R | hub [ProjectHax 1940](https://forum.projecthax.com/t/private-server-list/1940) | 3 |
| **iSRO-R « Rigid » 2015** | International (Silkroad R, incl. RSRO) | 110-120 (base) | D11-D13 | Files officielles Silkroad R 2015, release ~2021 | [epvp 5068290](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5068290-release-isror-2015-server-files-rigid-online.html) · repack [RZ 1208329](https://forum.ragezone.com/threads/repack-isro-r-2015-rigid-files.1208329) | 4 |
| **iSRO / KSRO** | International / Corée | **cap 125+** | **14DG** | Les plus complètes — serveur **Zyain** (BlazeGN) en CBT cap 125 / 14 degrés | [RZ 1087030](https://forum.ragezone.com/threads/isro-ksro-leaked.1087030) | 3 |

**Lecture pour la base SRObro** : les HP/niveaux des monstres sont dans la table `_RefObjChar` de chaque DB. La **1.188 s'arrête au contenu cap 110** (Job Temple/Seth 110) → **elle ne contient PAS les boss 111+** (Jupiter 111-118, Kidemonas 120, Bagdad 121+, Shambhala 131+). Ceux-ci existent dans : **vSRO 1.193/1.274** (Jupiter 110-120), **BR120**, **tSRO 1.258**, **cSRO-R/iSRO-R** (D13), et **iSRO/KSRO leakées** (cap 125+, 14DG — les plus complètes).

### 🐯 BlackRogue en détail (✅ recherche VSRO 2026-10)

**Contenu exact du package BR120** ([RZ 1107257 — release MeGaMaX, 07/2016](https://forum.ragezone.com/threads/blackrouge-official-cap-120-server-files.1107257), fiabilité 5) :
- Archive `SRO_Thailand_CS_106.zip` de **42 136 640 octets** — `MD5 A2FF18A325A55527533B8B72B1C6630D`, `SHA-1 F8D1FB26A11EE8B9BC7482CCFEDEA284D39E78C6` (« check before you extract »).
- « **The update package was the latest that was sent to Thailand publisher** » : c'est un **package de mise à jour officiel** (pas les files complètes) — dossiers `Config/`, `InitialDB/` (shard DB initiale), `Query/`, `ServerBinary/`, `SMC/` ; binaires AgentServer.exe, GlobalManager.exe, SR_GameServer.exe, SR_ShardManager.exe + `SRCommonDataLoader.dll` (ni MachineManager ni FarmManager dans ce package update) ; **cap 120, D12** (Jupiter).
- ⚠️ **État brut incomplet** : DB de comptes **à reconstruire**, **procédures stockées manquantes** dans la shard DB (le releaseur liste le travail restant) ; **client BR v1.040 « packed »** — workaround documenté : client vSRO 120 cap clean + dossier `server_dep` + exes sro_client BR (archive.org ~8 Mo). Commentaire de SnapPop dans le thread : « **hacked ini3 before they closed** » — cohérent avec l'origine ini3.
- **Rates hardcodés dans les binaires** : « Blackrogue rates hidden in **ShardManager and Gameserver**. On vsro only in gameserver. But the way is the same, edit the 100 » ([epvp — BR 110 Rates fix](https://www.elitepvpers.com/forum/sro-private-server/3308860-blackrogue-110-rates-fix.html)) ; des SR_ShardManager BR **pré-patchés** circulent (Exp Rate / Party Exp / Extra Exp — [RZ 1068146](https://forum.ragezone.com/threads/blackrogue-110lv-shard-rate-fix.1068146)).
- **Offsets incompatibles** : les offsets BR diffèrent de vSRO → « almost all offsets of the regular vSRO files have been listed [mais pas BR] » — tout l'outillage (patchers, filtres, mods hexa) est à refaire ([RZ 1054626](https://forum.ragezone.com/threads/list-of-all-offsets-of-110cap-blackrogue-serverfiles-and-client.1054626)).

**Pourquoi la scène préfère massivement la 1.188 malgré le contenu natif de BR** ([débat epvp — vSRO 1.188 vs BR 110](https://www.elitepvpers.com/forum/sro-private-server/2510919-do-you-prefer-vsro-1-188-blackrogue-110-cap-files-2.html) · [epvp — what server files to choose](https://www.elitepvpers.com/forum/sro-pserver-questions-answers/5174796-what-server-files-choose.html)) : vSRO 1.188 = « **clean, bugless** », exchange/avatars/pets OK, **90 % des outils/guides ciblent 1.188** ; BR garde une niche (« original BlackRogue files », contenu 110/120 **natif** sans rétrofit, systèmes de l'ère 2012) au prix de l'adaptation de tout l'outillage vSRO et de l'état incomplet du package (DB comptes, procédures). Question ouverte du thread : « 11D BR client have new job? » (système de job de l'ère BR — non confirmé).

---

## 🏗️ Architecture Serveur Officielle

> Source de valeur inestimable : le **guide du leaker lui-même** ([RaGEZONE 780273](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273), Chernobyl, 13/09/2011) — c'est la description du fonctionnement officiel la plus fiable disponible.

### 🧩 Les 9 modules et l'ordre de démarrage (vSRO 1.188)

```
Ordre de démarrage (vSRO 1.188) :
 1. Custom certification server  (port 32000 — « Certifier »/IIS, interface SMC)
 2. SR_GlobalManager             (coordination globale ; port 15880)
 3. SR_MachineManager            (enregistrement/certification des machines)
 4. DownloadServer               (patchs client)
 5. GatewayServer                (liste de serveurs affichée au client)
 6. SR_FarmManager               (gestion de ferme de shards)
 7. AgentServer                  (relais clients → monde ; LIMITE OFFICIELLE : 1000 utilisateurs)
 8. SR_ShardManager              (gère un « shard » = un monde, connexions DB)
 9. SR_GameServer                (le monde de jeu lui-même)
```

- **3 bases MSSQL** : `SRO_VT_ACCOUNT` (comptes, `TB_User`, niveaux GM `sec_primary`/`sec_content`), `SRO_VT_SHARD` (toutes les données du monde, ~200 tables), `SRO_VT_SHARDLOG` (logs). Certaines versions (BR/tSRO, Pioneer) embarquent une DB « SKILL » séparée.
- **Certification** : serveur d'authentification maison sur le **port 32000** + scripts ASP/IIS pour le billing ; le **SMC (Server Management Console)** pilote l'ensemble.
- **Répartition du monde** : la table `_RefRegionBindAssocServer` assigne chaque région à un GameServer (0 = désactivée, 1/2/3 = GS1/2/3) — **un seul GameServer ne peut pas charger toutes les régions** : le monde officiel tournait en grille de plusieurs gameservers.
- **Package BlackRogue** : dossiers `Config/`, `InitialDB/`, `Query/`, `ServerBinary/`, `SMC/` ; binaires AgentServer.exe, GlobalManager.exe, SR_GameServer.exe, SR_ShardManager.exe + SRCommonDataLoader.dll.

### ⚙️ Configuration des rates (server.cfg) — les files = les taux officiels

Les valeurs sont stockées en **millièmes** (taux réel = valeur / 1000) :

```
ExpRatio 1000        = x1   ← VALEUR PAR DÉFAUT des files = TAUX OFFICIELS
ExpRatio 35000       = x35
ExpRatioParty        = multiplicateur de party (ex 4500 = x4.5)
ExpRatioPartyBonus   = bonus par membre supplémentaire
DropItemRatio        = fréquence de drop d'items (même formule /1000)
DropGoldAmountCoef   = or par monstre (2 = double)
HwanGainFactor       = vitesse de gain des stacks de Zerk
SilkOwnTime / SilkPerHour / SilkDropRate = paramètres silk
```

- Les valeurs se chargent en mémoire au démarrage → **restart complet du GameServer requis** pour tout changement.
- ⚠️ **Unités contradictoires (✅ recherche VSRO 2026-10)** : le modèle /1000 ci-dessus vient des **guides** ; or le **dump réel d'une config 1.188** (page 33 du thread du leaker) montre `ExpRatio 100` / `DropItemRatio 0,1` — lisible comme « **100 = ×1** », et le fix des rates BlackRogue dit « edit the 100 ». Les deux conventions coexistent dans les sources (possiblement selon les générations de files) — **non tranché, à trancher par mesure en jeu**. Détail complet : [TECHNICAL_SPECIFICATIONS.md — Configuration serveur officielle §4](TECHNICAL_SPECIFICATIONS.md).
- ⚠️ **Corrigé pour les privés eux-mêmes** : un privé type affiche 3x-999x (Origin Online 3x solo/5x party ; DemonRoad 200-300x ; Venus 350x ; annuaire « EXP 999x »). Les files **non modifiées** reproduisent les taux officiels 1x.

### 🐉 Spawns champion/giant — hardcodé dans le binaire

- `GiantMonster_SpawnRatio` = **14 % par défaut**, hardcodé dans `sr_gameserver.exe` (patchable OllyDbg) — **le taux giant n'est PAS dans la DB** (corrige les estimations « ~1 % » : faux d'un ordre de grandeur).
- La DB (`Tab_RefNest`) ne contrôle que **quels** monstres et **combien**, pas le pourcentage champion/giant (fonction RNG interne du gameserver).
- Le **type** d'un monstre = colonne **`Rarity`** de `_RefObjCommon` : **0 = normal, 1 = Champion, 2 = Giant, 3 = unique avec notice globale, 8 = unique sans notice**.

---

## 🗄️ Tables SQL et Données Exploitables

### 📐 Les ~200 tables de la SHARD (schémas publics)

Le repo **ducksoup** ([GitHub — Database/VSRO188](https://github.com/ducksoup-sro/ducksoup/tree/main/Database/VSRO188)) expose les schémas C# de chaque table — **le meilleur point d'entrée public pour la structure de la DB** (inventaire vérifié via API GitHub). Complément : [Ex-o/Silkroad-Database-Documentation](https://github.com/Ex-o/Silkroad-Database-Documentation) (liens entre tables).

### 🎯 Tables utiles à SRObro (focus)

| Table | Contenu | Intérêt SRObro |
|-------|---------|----------------|
| **`_RefObjCommon`** | ID, CodeName128 (`MOB_CH_TIGERWOMAN`…), type, **Rarity 0/1/2/3/8**, Link vers `_RefObjChar`/`_RefObjItem` | Type de monstre + identification |
| **`_RefObjChar`** | **HP/MaxHP, niveau, dégâts, défenses des monstres** | LA table des HP — remplie jusqu'au cap de chaque version (110 en 1.188 → 125+ dans les files iSRO/KSRO) |
| **`_RefObjItem`** | Données des items (params, taux alchimie des élixirs dans `Param`) | Stats items + taux officiels |
| **`_RefSkill`** | Puissance, cooldowns, effets — jusqu'au cap de la version (skills 120 + **mobs Jupiter** via skilldatas 1.193) | Base skills |
| **`_RefMagicOpt`** | Définition des blues (groupes MATTR_*) avec plages de valeurs | Alchimie/blues |
| **`_RefMagicOptByItemOptLevel`** | **Mapping des plages de blues PAR DEGRÉ d'item** — ⚠️ la table existe publiquement (schéma ducksoup, données dans chaque dump de DB publique) | Comble la lacune « plages de blues par degré » de [05_ALCHEMY_SYSTEM.md](05_ALCHEMY_SYSTEM.md) |
| `_RefDropClassSel_Equip` / `_RareEquip` | Probability groups « PobGroup » (contrôle SoX ; facteur de base **14,99** en RareEquip) | Drops par niveau |
| `_RefMonster_AssignedItemDrop` | **Couche de drops bonus assignés par monstre** | Drops par unique |
| **`Tab_RefHive` → `Tab_RefTactic` → `Tab_RefNest`** | Groupes de spawn → comportement → **nids : région, X/Y/Z, effectif, `dwDelayTimeMin/Max` en secondes** | Spawns + timers de respawn |
| `_RefRegionBindAssocServer` | Régions ↔ gameservers (0/1/2/3) | Architecture monde officiel |
| **`_RefLevel`** | **Table officielle des XP par niveau** | Leveling |
| **`_RefQuest` / `_RefQuestReward(+Item)` / `_CharQuest`** | Quêtes complètes — **280+ quêtes de la 1.188 déjà documentées** dans le repo [SROquests](https://github.com/AlighieriDemiurgs/SROquests) (NPC, niveaux, récompenses, répétitions, coordonnées) | [16_QUEST_SYSTEM.md](16_QUEST_SYSTEM.md) |
| `_RefPricePolicyOfItem` | **Prix de vente NPC** de tous les items | Économie |
| `_RefShop*` / `_RefPackageItem` | Boutiques NPC, Item Mall | Économie |
| `_RefSiegeFortress*` (12+ tables) | Fortress War complète | [19_FORTRESS_WAR.md](19_FORTRESS_WAR.md) |
| `_RefGame_World(+_Config)` | Donjons instanciés type FGW | [29_FORGOTTEN_WORLD.md](29_FORGOTTEN_WORLD.md) |
| `_RefEvent*(+Reward)` / `_Schedule` | Événements programmés | [27_EVENTS.md](27_EVENTS.md) |
| `_RefGacha*` | Magic Pop | [21_CONSUMABLES.md](21_CONSUMABLES.md) |
| `_RefClimate` / `_RefCollectionBook_*` | Météo / Collection Book | Divers |

**Autres familles** : items live (`_Item`, `_ItemPool`, `_BindingOptionWithItem`), personnages (`_Char`, `_CharSkill`, `_Inventory*`, `_CharTrijob`), guildes/academy/jobs (`_Guild*`, `_TrainingCamp*`, `_TrijobReward`, `Tab_RefRanking_*`), skills d'IA des monstres (`Tab_RefAISkill`), téléports (`_RefTeleport`/`_RefTeleLink`).

### 🔍 Jusqu'à quel cap chaque table est-elle remplie ?

| Table | vSRO 1.188 | vSRO 1.193/1.274 | BR120 | tSRO 1.258 / cSRO-R / iSRO-R | iSRO/KSRO |
|-------|-----------|-------------------|-------|------------------------------|-----------|
| `_RefObjCommon`/`_RefObjChar` (HP monstres) | **jusqu'à 110** | + Jupiter **110-120** | Jupiter cap 120 | jusqu'à ~120-130 (D13) | **cap 125+, 14DG** |
| `_RefSkill` | skills ≤ 110 | skills 120 + mobs Jupiter | 120 | 120+ | 125+ |
| `_RefMagicOpt*` (blues) | D1-D11 | D12 (patchs) | D12 | D13 | D14 |
| `Tab_RefNest` (spawns) | monde complet ≤ Alexandrie/FGW | + Jupiter | monde identique (Thaïlande) | + contenu local | le plus complet |

### 📦 Dumps publics exploitables supplémentaires (✅ recherche VSRO 2026-10)

| Repo GitHub | Contenu | Exploitabilité |
|---|---|---|
| **[joaodematejr/private_server](https://github.com/joaodematejr/private_server)** (31 Mo) | `Tools/DB/SRO_VT_SHARD.bak` — **74 291 712 octets**, backup MSSQL **non compressé** (format MTF) d'une **1.188 rétrofitée D12/cap 120** (items D12 + contenu Jupiter `MOB_JUPITER_*` présents, rows Jupiter `Service=0` comme dans tout rétrofit « Jupiter Fixed ») ; fichiers frères `SRO_VT_ACCOUNT.bak` (14 Mo), `SRO_VT_LOG.bak` (4 Mo), `SRO_CERTIFICATION.bak` (0,5 Mo) | **Parsé en binaire avec succès** (pages MDF quasi brutes, enregistrements SQL Server auto-descriptifs décodés empiriquement) : HP/EXP extraits de `_RefObjChar` — les 8 uniques classiques **validés identiques** aux valeurs officielles recoupées par la KB ; source des **EXP officielles 1x** (`ExpToGive`, jusqu'ici absentes de toute source publique). Rapport : [ML_RESEARCH/RESEARCH_VSRO_DB_MONSTERS.md](ML_RESEARCH/RESEARCH_VSRO_DB_MONSTERS.md) |
| **[joaodematejr/server_files_sro](https://github.com/joaodematejr/server_files_sro)** (1,1 Go) | Binaires serveur complets **+ `SMC/SR_GameRefData/skilldata_*.txt`** : les **skilldatas côté SERVEUR déjà en clair** (8 shards `skilldata_5000.txt`…`skilldata_40000.txt`, ~32 700 lignes, UTF-16LE, TSV, 118 colonnes) — inventaire du tree vérifié : **aucun** `.sql`/`.bak` | Meilleure source publique de `_RefSkill` complet sans extraction PK2. Rapport : [ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md](ML_RESEARCH/RESEARCH_SKILLDATA_EXTRACT.md) |

> Ces deux repos confirment la règle structurelle : **la DB circule uniquement en `.bak` MSSQL, jamais en `.sql` versionné** (recherche de code GitHub exhaustive : aucun dump INSERT public de la shard n'existe).

---

## 💎 Données Officielles Récupérées via les Privés

> Marqueurs : **[OFFICIEL-DÉRIVÉ]** = valeurs officielles mesurées/republishées par un tiers · **[CUSTOM]** = invention/modification de serveur privé.

### 💀 1. Table HP des uniques 111+ (M3 Stats — serveurs officiels iSRO)

Source : [m3stat.com/uniques](https://www.m3stat.com/uniques) — collecte **en jeu** sur les serveurs officiels (Minerva, Palmyra…). Première table HP consolidée incluant les boss 111+.

| Unique | Niveau | HP | Marqueur |
|---|---|---|---|
| Tiger Girl | 20 | 598 720 | OFFICIEL-DÉRIVÉ |
| Cerberus | 24 | 693 072 | OFFICIEL-DÉRIVÉ |
| Captain Ivy | 30 | 1 094 835 | OFFICIEL-DÉRIVÉ |
| Uruchi | 40 | 1 779 528 | OFFICIEL-DÉRIVÉ |
| Isyutaru | 60 | 4 324 612 | OFFICIEL-DÉRIVÉ |
| Lord Yarkan | 80 | 9 353 045 | OFFICIEL-DÉRIVÉ |
| Demon Shaitan | 90 | 12 732 060 | OFFICIEL-DÉRIVÉ |
| Roc | 100 | **1 451 891 045** ⚠️ | OFFICIEL-DÉRIVÉ (ordre de grandeur atypique — version raid/événement ou artefact tracker, à recouper avec `characterdata.txt`) |
| Medusa (BeakYung) | 100 (105 client) | 183 535 199 | OFFICIEL-DÉRIVÉ |
| **Kidemonas** | **120** | **13 851 102** | OFFICIEL-DÉRIVÉ |
| **Karkadann** | **123** | **15 023 129** | OFFICIEL-DÉRIVÉ |
| **Merikh** | **125** | **18 372 504** | OFFICIEL-DÉRIVÉ |

⚠️ **Validation croisée** : le wiki du privé [ExaySRO](https://wiki.exaysro.com/books/guides/page/unique-locations) **republie à l'identique** les HP du client officiel (TG → Shaitan + Apis 21 068 995) — les HP des uniques classiques sont donc stables même dans l'écosystème privé. Certains guides arabes citent des variantes de privés (ex. Origin : Uruchi 1 780 285, Yarkan 24 297 547 — [CUSTOM]).

### ⏱️ 2. Timers de respawn par défaut de la vSRO (Tab_RefNest.dwDelayTimeMin/Max, en secondes)

| Unique | dwDelayTimeMin/Max | = Durée |
|--------|--------------------|---------|
| Tiger Girl, Cerberus, Captain Ivy, Isyutaru, Lord Yarkan, Demon Shaitan | 3600×6 | **6 h** |
| Uruchi | 3600×3 | **3 h** |
| Medusa/BeakYung | 3600×4 | **4 h** |
| Evil Order (unique event) | 3600×2 | **2 h** |
| David / Jupiter (BR) | 3600×4 | **4 h** |

> 📌 **Affinement de la KB** : [15_UNIQUE_BOSSES.md](15_UNIQUE_BOSSES.md) indiquait « 4 h par défaut dans les fichiers vSRO ». Les valeurs réelles : **6 h pour la plupart, 3 h pour Uruchi, 4 h pour Medusa/Jupiter** — un unique respawn **à un point aléatoire** après un délai min/max tiré au hasard (d'où les fenêtres ressenties « 3-6 h » de l'iSRO). Source : [RZ — Unique Spawn Time](https://forum.ragezone.com/threads/dev-unique-spawn-time.820175) (admin de privé, fiabilité 3-4) + [guide SQL epvp](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1773490-guide-how-change-unique-spawn-time.html).

### 🧬 3. Constantes et mécaniques extraites des files

| Donnée | Valeur | Où |
|--------|--------|-----|
| Taux de spawn des **Giant** | **14 %** par défaut, hardcodé | `sr_gameserver.exe` (GiantMonster_SpawnRatio) |
| Type de monstre | Rarity 0/1/2/3/8 | `_RefObjCommon` |
| Taux officiels par défaut | **1x** (`ExpRatio 1000`) | server.cfg |
| Limite joueurs par AgentServer | **1000** | architecture officielle |
| Taux d'alchimie | élixirs 50/40/30/19/17/12 + powder +50/30/20/8/8 (confirmés DB vSRO) | `_RefObjItem.Param` |
| Dégât à l'échec | dès +5 : 50 % destruction / 50 % malus durabilité | logique décompilée |

### 🌍 4. Clarification D12-D15 = OFFICIELS (seuls D16+ sont custom)

| Degré | Statut | Contenu officiel |
|-------|--------|------------------|
| **D12** | ✅ OFFICIEL | Temple of Jupiter, **cap 120** (~2013 iSRO ; l'ère du rétrofit « 1.188 + D12 Jupiter ») |
| **D13** | ✅ OFFICIEL | « Maximum level increase up to level 120 - New Dungeon: Temple of Jupiter - **New item (13th degree)** » (annonce officielle) |
| **D14** | ✅ OFFICIEL | **Cap 125, Legend IX « Arabian Nights »** — iSRO **janvier 2015** / KR 2014 (update Bagdad mai 2014) |
| **D15** | ✅ OFFICIEL | **Cap 130**, 2ᵉ histoire Arabian Nights, **mai 2016** |
| Cap 140 | ✅ OFFICIEL | Shambhala Shore (27/03/2018), Ice Temple 131-135 + Extended Skill Lv.2 (15/09/2018, Hebe), Fire Temple (23/11/2018) — pas de nouveau degré |
| **D16+** | ❌ CUSTOM | Inventions de serveurs (Viking SRO D16, ErTuGrul D16, RWB D16, SENSATION 17D) — **le client officiel ne dépasse pas D15** |

> Conséquence : la majorité des données « DG12-DG15 » des privés sont des **réutilisations officielles**, pas des inventions. Le mobile officiel (Silkroad Origin Mobile, 2024) est monté jusqu'à cap 140/DG14, validant rétroactivement ces données. Voir [07_ITEM_DEGREES.md](07_ITEM_DEGREES.md).

### 🐫 5. Cross-références de contenu KSRO dans les DB privées

- **Abshad Force High General** (99 000 000 HP sur ExaySRO [CUSTOM]) = **얍샤드 대장군** (« Grand Général Yapshad »), boss de l'update **Bagdad KSRO** (mai 2014, cap 125 KR) — présent dans les DB vSRO-188 étendues sous ce nom EN. Bagdad = zone de farm mobs **121+** chez Fighter SRO.
- **« Kadminous »** (Fighter SRO, JC Coins) = translittération arabe de **Kidemonas**, l'unique officiel KSRO lvl 120 de la Dimension Miroir.
- **Egy Coin** : monnaie droppée par les uniques égyptiens (Sphinx, Anubis) à Alexandrie, contre armes **D11 Egy A/B** (mémoire égyptienne du documentaire [Archer Tales](https://www.youtube.com/watch?v=OtZDIhMmxBE)).
- **Devil's Garden / Petra Maze** : fichiers officiels jamais activés par Joymax, « fixés » et massivement réutilisés par les privés (zone grise documentée).

---

## 🕌 La Scène Arabe

### 📊 silkroad4arab.com — le forum-monument (chiffres Wayback)

[« الموقع العربي الاول للعبة Silkroad Online »](https://www.silkroad4arab.com/vb) (« le 1er site arabe dédié à Silkroad ») — forum vBulletin fondé ~2006-2007 :

| Date | Membres | Sujets | Messages | Connectés |
|------|---------|--------|----------|-----------|
| 30/01/2008 | **9 251** | ~91 795 | ~11 660 | 58 en ligne |
| 13/06/2012 | **241 806** | 101 186 | 2 975 391 | record 3 271 |
| 29/12/2015 | **313 016** | 128 211 | **3 636 027** | **record 17 621 le 16/07/2014** |
| 2026 (snippet) | 199 025 | 407 969 | 3 645 747 | — |

Lecture : boom 2008-2012 (×26 membres), **~120 sous-forums de serveurs privés** en 2015, pic 2014-2015, puis déclin/purge — l'activité arabe a migré vers **Facebook, TikTok et Discord**. Le dev arabe s'est concentré sur [ProBasha](https://probasha.com) (XenForo, 3 099 membres, 10 576 messages) — « le plus grand site arabe des serveurs privés Silkroad (vSRO et iSRO) ».

### 🇪🇬 L'Égypte, centre de gravité

- **Mémoire orale** (documentaire égyptien [Archer Tales, 06/02/2026](https://www.youtube.com/watch?v=OtZDIhMmxBE)) : l'ère des **cybercafés** (السايبرات — « on jouait au cyber jusqu'au matin »), files d'attente, arrivée du **DSL en 2007** ; serveurs officiels de rassemblement **Alexander, Gaia, Sparta** (« tout le quartier d'Al-Omraniya était sur Sparta ») ; Alexandrie vécue comme « ton pays est dans ton jeu préféré » ; **Egy Coin → armes D11 Egy A/B** ; fermes de gold à 100 comptes bottés.
- **Poids démographique** : « These servers are usually run by 'Egyptian' people… it's just the truth » ([Reddit](https://www.reddit.com/r/silkroadonline/comments/1kdopp1/about_private_servers)). Le Maghreb est discret en ligne ; le Golfe apparaît via « United Arab Emirates Cap 140 » et le partenariat saoudien de 2026.
- **Folklore de la fuite** : version communautaire égyptienne (Joymax licencie ses programmeurs → fuite par vengeance) — **récit oral contredit par l'historiographie EN** (fuite vietnamienne 2011) ; à citer comme mémoire collective uniquement.

### 🗣️ Vocabulaire communautaire égyptien (sélection)

| Arabe | Translit. | Signification |
|---|---|---|
| **التاكسي** | tāksī | « taxi » = **service payant de power-leveling (plvl)** |
| **اليونيك / اليونكس** | yūnīk (prononciation éG) | **uniques** |
| **الميدوسا** | al-mīdūsa | ⚠️ **PIÈGE : « Medusa » désigne BeakYung the White Viper** (Qin-Shi Tomb B6) dans le lexique arabe — pas un boss séparé |
| السايبر | al-sāyber | cybercafé |
| فتحة | fatḥa | ouverture (grand opening) d'un serveur |
| ريت / راتات | rate(s) | taux du serveur |
| شحن | shaḥn | recharge de silk |
| الايجي كوين | — | Egy Coin (monnaie d'Alexandrie) |
| البلو / البلوس | blues | options magiques |
| الصن / المون / الاستار | ṣan / mūn / star | Seal of Sun / Moon / Star |
| الديفل سبيرت | Devil Spirit | esprit démoniaque |
| الجاب | gap | écart niveau/maîtrise (SP farming) |

Glossaire complet (72 termes) : [ML_RESEARCH/RESEARCH_AR_DEV.md](ML_RESEARCH/RESEARCH_AR_DEV.md) §7 · voir aussi [38_GLOSSARY.md](38_GLOSSARY.md).

### 📋 Tableau des 18 serveurs arabes / à public arabe (caps 120-140)

Toutes specs = publiées par le serveur lui-même. **« cap 140 arabe » = moteur vSRO 1.188 + DB étendue par contenu KSRO réutilisé (D13/D14/D15, Bagdad, Jupiter, HWT) + items/uniques customs.**

| # | Serveur | Cap / Degré | Contenu / particularités | Statut |
|---|---------|-------------|--------------------------|--------|
| 1 | **Egypt SRO** | 120 / D13 | « avec Sbot », annuaire GTop100 Égypte | Annonce |
| 2 | **Egyptsro** | 120 / D13 | DB partagée sur s4a (« data base egyptsro d13 cap 120 ») | Mort |
| 3 | **RoninSro** | 120 / D13 | Coin System, Play2Win (annoncé en arabe, 11 451 vues s4a) | Fermé |
| 4 | **Anoha Online** | 130 → 140 PVE | Instant 130, silk/h, Reborn, FW, Sky Temple 126-130 (GO 07/04) — sponsor actuel de s4a | Actif |
| 5 | **Legend-Sro** | 130 / D14 | Free silk, vieilles maîtrises nouvelles, auto-events | Actif |
| 6 | **Venus SRO** (playvenus.online) | 130 / D14 | Exp 350x/Party 400x/Drop 50x, 10k silks+10k SP gratuits ; éd. 2014 : **Bagdad**, Holy Water Temple, Titan uniques ; quêtes D12 A&B et arme D13 en vidéo | Actif (nouvelle édition) |
| 7 | **GSRO** (gsro.fun) | 130 / D14 | PvP « everything free », max +20 avec adv, uptime 96,5 %, ouvert 07/09/2021 | Actif |
| 8 | **Fighter SRO** | 130 / **D15** | Exp 65x, Max Plus +27 ; D14 or NPC / D15 Medals Coins ; monnaies Arena/Magico/Medals/JC Coins — **DB publique** (71 128 vues) | DB publique |
| 9 | **Play SRO** | 130 / D14 | « سيرفر عربي » (vidéo YouTube) | 2020s |
| 10 | **Vaora Online** | 130-140 | Events et grosses récompenses (2026) | Actif |
| 11 | **United Arab Emirates** | 140 | « silk gratuit, PVE/PVP » (fiche annuaire — Golfe) | Annonce |
| 12 | **SRO OLD** (Nasser Gaming) | 140 | « ambiances haut level CH & EU », PvP, events quotidiens | Actif 2025-2026 |
| 13 | **Viking SRO** | 140 / **D16** ❌custom | Mobs **lvl 150**, mastery CH 420, skills 130/140, drop D15 sun/moon/star (annoncé en arabe sur s4a) | Actif 2025 |
| 14 | **ErTuGrul SRO** | 140 / **D16** ❌custom | Mastery 440/280, Max Plus 20, **Alchemy Rate 3x**, IP limit 3 (annoncé s4a 09/2025) | Actif 2025 |
| 15 | **IronSro** (DB v3.1) | 140 **[Vsro.188]** | LA DB cap 140 de référence du milieu arabe ; existe en cap 150 (IronSro 9.2) — 30 421 vues | DB publique |
| 16 | **Legendary-road** | 140 / D15 | Mastery 280/560, max +15 no ADV, 8 ans en ligne | Actif |
| 17 | **Origin Online** | 120 (mention 140 non confirmée) / D13 | International n°1 des toplists, « NO BOTS », 8+ ans — **diaspora arabe très active** (guides arabe Medusa filmés dessus) | Actif |
| 18 | **DemonRoad-Reborn** | 140 | International (créé 2012 par Konsti) — 37+ uniques retravaillés, tables de drops complètes publiées | Actif |

**Serveurs arabes low/mid-cap** (contexte) : Elamidas (100 CH-only, audience arabe massive), Classic Silkroad EG (110/D11, « EGY A/B shops »), Red Sea (110, « 2 000 online en 9 jours » autodéclaré), 7Kingdom (110/D11 vSRO), Zenger Online (110 progressif, **files iSRO-R** — rare), ERIOS (105, beta), QIAN (GO 27/02/2026), SRO Times (saison 80, Discord Partner 24 954 membres), OASIS 2005 (cap 50 CH-only nostalgie).

### 💰 Monétisation égyptienne

- **Paiements mobiles** pour le silk **officiel** Joymax via [ep4n.net](https://www.ep4n.net/ar/online-games/silkroad-100-silk-card/vodafone-cash) — **Vodafone Cash / OPay** : 10 silk = **55,96 EGP**, 50 = 275,94, 300 = 1 650,80, 500 (+25) = 2 750,65, 1 000 (+100) = 5 501,30 — **+2 EGP de frais de service**.
- Silkroad Origin Mobile Arabia dispose d'une boutique de recharge intégrée (« دليل الشحن »).
- Fil épinglé historique « تنبيه بخصوص التبرعات » (avertissement dons aux privés, 27 239 vues, 2014) — arnaques récurrentes documentées ; sections « scammers » (النصابين) sur s4a.

### 🏛️ Officiel arabe : du portail 2010 au mobile 2024-2026

- **02/02/2010** : Joymax lance le **service linguistique arabe** ([annonce IGN 22/01/2010](https://www.ign.com/articles/2010/01/22/joymax-announces-the-launch-of-arabic-language-service-for-fantasy-mmorpg-silkroad-online)) — 2e de 4 extensions multilingues après le turc ; événements mondiaux en jeu ([Engadget/Massively](https://www.engadget.com/2010-02-03-silkroad-online-celebrates-their-new-arabic-language-service-wit.html)). ⚠️ **Nuance** : documenté pour le **site/portail** (joymax.com/silkroad, [ArabMMO 05/2010](https://www.arabmmo.com/content/2010-05-18/20100518224914238.html)) ; **aucune preuve que le client PC lui-même fut traduit en arabe** (les fils s4a sur « écrire l'arabe dans le chat » suggèrent l'inverse).
- **2024-2026** : **Silkroad Origin Mobile Arabia** = la VRAIE localisation arabe officielle complète — licenciée **WeMade Max (ex-Joymax)**, développée par **GOSU ONLINE** (Hanoï) « spécifiquement pour la communauté arabe », PEGI 16 ([Google Play](https://play.google.com/store/apps/details?id=com.silkroad.arab&hl=ar)) ; site [sromarabia.com](https://sromarabia.com/home) + **wiki officiel arabe** ([sromarabia.com/wiki](https://sromarabia.com/wiki)) ; partenariat saoudien GOSU × Al-Imtiaz Al-Asriya pour MENA, lancement à Djeddah (14/07/2026). Cap mobile v2.1 : 100/D10, mastery 300. **La boucle est bouclée : 18 ans après les cybercafés, le Silkroad officiel existe en arabe — sur mobile uniquement.**

### 🧰 L'arsenal dev arabe

- **DB partagées** (section Data Base de s4a, chaque DB devient un moule de serveur) : VSRO 1.188 Clean (9 589 vues), **C-Sro Files/DB/Client English (53 737 vues)**, **Fighters SRO DG15 (71 128 vues)**, Phantom Online Files (68 297), D13 « ملهاش حل » (36 807), IronSro v3.1 cap 140 (30 421), Moka V2, Jungle-R…
- **Protections** (ProBasha) : STFilter-Devkit (47 K vues), **wFilter** (supporte vsro188, CSRO-R, TW 258 — 37 K), JGuard (22 K), Zune, DuckSoup, Bit-Filter, Kalkan Encryption. Périmètre 2025 : filtres packets + firewall + patch SQL, aucun kernel-driver.
- **Tuto type** ([probasha.com/threads/73](https://probasha.com/threads/73)) : SQL Server 2014+, port 15779, SR_ShardManager → SR_GameServer, AgentServer, machine.ini, SMC — le pipeline vSRO classique entièrement documenté en arabe.
- **Chaîne de contamination documentaire** : une DB (ex. IronSro v3.1) → des dizaines de serveurs arabes/turcs → leurs wikis publient des HP officiels mélangés à des customs.

---

## 🧰 Outils d'Extraction de Données

### 📦 Outils PK2 (archives du client : Media.pk2 / Data.pk2)

| Outil | Type / Où | Notes |
|-------|-----------|-------|
| **pk2_mate** (crate `pk2`) | **Rust** — https://github.com/veykril/pk2 | CLI `extract`/`pack`/`list` — le moderne, utilisé par OpenSilkroadMap |
| **SRO.PK2API** (JellyBitz) | C#/.NET — https://github.com/JellyBitz/SRO.PK2API | Lib lecture/écriture, recherche O(1) — recommandé pour scripter |
| **SRO Archive Explorer** (2025) | Desktop — https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5364960-release-sro-archive-explorer-pk2-browser-3d-model-map-effect-viewer-skill-brows.html | **Navigateur PK2 + viewer 3D modèles/cartes/effets + navigateur de skills** — le plus complet pour explorer un client sans tout extraire |
| **Pk2 Editor & Extractor** (Drew) | Win binaire — https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4127868-share-pk2-editor-extractor-working-08-2016-a.html | Les classiques historiques |
| PK2Tools 5-in-1 | Win — [epvp 690658](https://www.elitepvpers.com/forum/sro-hacks-bots-cheats-exploits/690658-pk2tools-5-1-bundle.html) | Builder/Defrag/Editor/Extractor/Lister |
| Pk2 Tools .NET | C# — [RZ 921502](https://forum.ragezone.com/threads/tool-pk2-tools-net.921502) | Extracteur/éditeur |
| SRO-PK2-Workbench (kahme247) | Win/C# — https://github.com/kahme247/SRO-PK2-Workbench | Rebuild sourcé du workflow Joymax/ZeraPain |
| English PK2 tool | Win — [ProjectHax 24720](https://forum.projecthax.com/t/english-pk2/24720) | Traduction entre clients |
| Easy PK2 Patcher | Win — [epvp 4460302](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4460302-release-easy-pk2-patcher.html) | Import 1-clic |

### 🔧 Parseurs et documentation

| Outil | Où | Rôle |
|-------|-----|------|
| **SilkroadDoc** | https://github.com/DummkopfOfHachtenduden/SilkroadDoc (+ [wiki sécurité](https://github-wiki-see.page/m/DummkopfOfHachtenduden/SilkroadDoc/wiki/Silkroad-Security)) | **LA doc de référence** formats/packets/sécurité (vSRO 1.188) — archivé 01/06/2025, contenu migré vers le wiki |
| **SR_Db2Media** (JellyBitz) | https://github.com/JellyBitz/SR_Db2Media | Convertit `_RefObjItem`/`_RefSkill` (SQL) ↔ fichiers media du client |
| SilkroadInformationAPI | https://github.com/i3dprogrammer/SilkroadInformationAPI | Parse les données du client **via les packets** (`SroClient.cs`) |
| **ducksoup** | https://github.com/ducksoup-sro/ducksoup | Packet filter C# .NET10 + **schémas DB complets v188** |
| TopS4A Query Collection | https://www.tops4a.com/2019/08/query.html | Requêtes SQL vSRO prêtes (`_RefSkill`, `Tab_RefNest`, `_Items`↔`_RefObjCommon`…) |
| SROquests | https://github.com/AlighieriDemiurgs/SROquests | **280+ quêtes extraites de la 1.188** (rates 1x) |
| vSRO-ServerAddon | https://github.com/JellyBitz/vSRO-ServerAddon | Injection DLL SR_GameServer/ShardManager 1.188 |
| SRO_DevKit (florian0) | https://gitlab.com/florian0/sro_devkit (+ miroir iSRO-R : [artuuro/ISRO-R-DEVKIT](https://github.com/artuuro/ISRO-R-DEVKIT)) | Framework C++ vers les composants du jeu |

### 🧭 Émulateurs open source — inventaire 2026 (✅ recherche VSRO 2026-10)

> État vérifié sur GitHub/GitLab. Complément de [../fr/PRIVATE_SERVERS_ANALYSIS.md](../fr/PRIVATE_SERVERS_ANALYSIS.md) (Phoenix, comparatif files vs émulateurs).

| Projet | Langue / Plateforme | Cible | Implémenté (documenté) | Licence | Statut 2026 |
|---|---|---|---|---|---|
| **[opensro](https://github.com/opensro-dev/opensro)** ⭐ | **Go** + client navigateur **WebGPU** (TypeScript/Vite) | **v1.150 (Legend III)** | Packages game : `abnormal`, `action` (dont **potionrecovery/potionamount** — formules officielles décompilées, déjà intégrées à [05_ALCHEMY_SYSTEM.md](05_ALCHEMY_SYSTEM.md) et [21_CONSUMABLES.md](21_CONSUMABLES.md)), `combat`, `enterworld`, **`gmcommand`** (commandes GM réimplémentées), `item` (**alchemy**), `linkedpulse`, `paramkeeper`, `progression`, `quest`, `restriction`, **`siege`**, `social`, `world` + asset pipeline et observatoire d'ops | **AGPL-3.0-or-later** (NOTICE.md : aucun média du jeu commité) | actif — **la meilleure source de formules serveur open source** (portage décompilé du comportement) |
| [go-sro-agent-server](https://github.com/ferdoran/go-sro-agent-server) (+ go-sro-framework, go-sro-fileutils) | Go | **files vSRO 1.88** | lobby perso, mouvement click + collision terrain (« object collision almost perfect »), **spawn/despawn par range** (objets/joueurs/monstres/NPC), chat + notices + commandes GM custom, party + **party matching**, inventaire, **stalls** ; navmesh + viewer raylib | DBAD (« Don't Be A Dick ») | **archivé 10/2022** |
| [SilkroadProject](https://github.com/tanisman/SilkroadProject) | C# (VS2015, Asio 1.10.6, MSSQL 2008+) | client **Open Beta** | GatewayServer/SR_GameServer/SCore/SCommon ; DB `_ServerConfig` ; client piloté via GATEIP.txt/DIVISIONINFO.txt du Media.pk2 | non spécifiée | dormant (6 commits) |
| [DarkEmu](https://github.com/CarlosX/DarkEmu) | C++ | — | lignée **csremu/sremu/sro-emulator/srevolution**, base **MaNGOS** (« Massive Network Game Object Server ») | **GPLv2** | dormant |
| [skrillax](https://github.com/kumpelblase2/skrillax) | **Rust/ECS** | — | projet d'apprentissage (exploration Rust/ECS/lifetimes) ; écosystème skrillax-dev (patch server iSRO) | — | learning project |
| Phoenix ([RZ 1159736](https://forum.ragezone.com/threads/phoenix-open-source-silkroad-online-emulator-c-net-core.1159736/)) | C#/.NET Core | — | déjà documenté dans [../fr/PRIVATE_SERVERS_ANALYSIS.md](../fr/PRIVATE_SERVERS_ANALYSIS.md) | — | — |

> ⚠️ **« cfemu » introuvable** : aucune trace d'un émulateur Silkroad nommé « cfemu » (recherches dédiées vides) — probablement confusion ou projet privé/disparu. Le nom n'apparaissait dans aucun fichier de la KB avant ce constat : rien à corriger.

### 🤖 Bots, API et trackers

| Outil | Où | Usage extraction |
|-------|-----|------------------|
| **RSBot** (open source, GPLv3/AGPL) | https://github.com/SDClowen/RSBot | Bot clientless ; **supporte vSRO 188/193/274, BlackRogue 100/110**, KSRO, TRSRO, cSRO, jSRO, VTC, Digeam/TSRO, RuSRO — les handlers de packets = **structures de données prêtes à l'emploi** (spawns, stats, drops) |
| **phBot API plugins** | https://plugins.phbot.org/phbot-api | `get_drops()`, `get_inventory()`, `log()` — dump programmatique |
| Unique Spawn Logging | https://forum.projecthax.com/t/unique-spawn-logging/5280 | Plugin phBot (opcode 0x300C) — base des trackers |
| **SilkroadSecurityApi** + ports | pySilkroadSecurity ([ProjectHax](https://context7.com/projecthax/pysilkroadsecurity)), EasySSA ([Dentrax](https://github.com/Dentrax/EasySSA)), skrillax ([Rust](https://github.com/kumpelblase2/skrillax)), Silkroad.Net ([.NET 6](https://github.com/halimsamy/Silkroad.Net)) | Handshake/chiffrement pour écrire ses outils |
| **m3stat.com** | https://www.m3stat.com/uniques | Table HP uniques officiels iSRO (111+ inclus) |
| **stats.projecthax.com** | https://stats.projecthax.com | **26 serveurs officiels, 8 régions** — population, capacité, kills d'uniques, chat global en direct |
| **sro.gg** | https://sro.gg/en | Fiches serveurs avec comptage online auto |
| **Nostalgic.gg** | https://nostalgic.gg/en/blog/best-silkroad-online-private-servers-en | Top 94 par population **Discord réelle** (anti-fraude) — méthode la plus fiable |
| ISRORCertBill | https://github.com/kahme247/ISRORCertBill | Réimplémente le serveur de certification iSRO-R |

**Méthode documentée pour extraire les données soi-même** : client → `pk2_mate extract Media.pk2` → parser `itemdata.txt` / `skilldata.txt` / `characterdata.txt` (formats documentés dans SilkroadDoc) — ou passer par une base SQL publique avec SR_Db2Media ; l'inspection visuelle passe par SRO Archive Explorer.

### 📚 Bots comme documentation (✅ recherche VSRO 2026-10)

Les grands bots sont des **bases de connaissances vérifiées du jeu officiel** — leurs configs et scripts encodent des données mesurées :

| Bot | Connaissances encodées |
|---|---|
| **phBot** ([doc officielle des commandes script](https://guide.phbot.org/phbot/script-commands) · [onglet Trade](https://guide.phbot.org/phbot/trade)) | **~35 commandes documentées** : `walk,[region,]x,y,z` (le paramètre région n'est requis **que dans les grottes** → documente le système de coordonnées des donjons), `teleport,source,destination` = **le graphe officiel des téléports NPC**, `DoBlacksmith/DoHerbalist/DoStable/DoStorage/DoGuildStorage/DoGroceryTrader/DoProtectorTrader/`**`DoJupiter`** (le Jupiter Temple a un **NPC combiné forgeron+herboriste** — détail d'architecture du contenu), `DoConsignment/DoStall`, `quest,npc,quest name,[safe|danger]` (noms exacts des NPC + quêtes ; `safe/danger` = variantes des quêtes de job), **`oldtrade,buy,star|quantity`** (ancien système vSRO : 0 = remplir le transport, 1-5 = nombre d'étoiles, >5 = quantité exacte) vs `begintargettrading/settletargettrading` (nouveau système cible iSRO/SilkroadR) — **les deux généalogies des systèmes de job co-documentées dans un seul bot**, `mount`, `recall` (rappel du pick pet), `disconnect` (utile pour **rafraîchir le classement de trade** — mécanique officielle) |
| **SBot** ([Bot-Cave — changelog officiel](https://www.bot-cave.net/index.php?articles/page-7) · [SRO Info — tutorial](https://sroinfo.forumotion.com/t10-bot-sbot-tutorial)) | **alarme de spawn des uniques** (« Never miss a unique again » — le bot joue une alarme au spawn → détection réseau de l'event, opcode 0x300C côté phBot), auto-party (accept/join), auto-res, auto-lure warrior, **Auto Stall** |
| **mBot** ([wiki Silkroad Latino](https://wiki.silkroadlatino.com/en/faq/mbot-guia) · [tuto trade](https://www.elitepvpers.com/forum/sro-guides-templates/4105202-tutorial-setting-up-mbot-trade-automaticly-video-tutorial-voice.html)) | **mode clientless** (bot sans client = la stack réseau complète du jeu réimplémentée), leveling/gold/quêtes automatiques, **trade automatisé** |
| **RSBot / Lobot** | RSBot (déjà KB ci-dessus) ; **Lobot** ([GitLab — topic Silkroad Online](https://gitlab.com/explore/projects/topics/Silkroad+Online)) = bot « light » pour privés **VSRO 1.188** — lecture utile des packets 1.188 |

**Valeur documentaire** : les scripts/coords de walk = données de monde ; les téléports source→destination = graphe officiel ; les noms NPC/quêtes = contenu ; les commandes `oldtrade`/`targettrading` = généalogie des systèmes de job ; les alarmes d'uniques = opcodes de spawn. La boucle Trade phBot (enregistrer un script → spawn du transport → achat → marche vers l'autre ville → vente → `killhorse` → return scroll) = **une route de trade officielle complète encodée en coordonnées**.

---

## 🚫 Ce que les Privés ne Peuvent PAS Fournir

| Lacune | Détail | Voie restante |
|--------|--------|----------------|
| **HP des boss 130+** | Aucun chiffre public pour **Benephika, Giant Overlord, Thief Boss Kalia** (M3 Stats s'arrête à Merikh 125) ; les privés ne publient pas leurs HP modifiés | Extraction client (`characterdata.txt`) ou DB (`_RefObjChar`) |
| **Stats items D13-D15 en texte** | Aucune table lisible publiée (wikis en images, showcases YouTube visuels) ; degré max de silkroadonline.wiki (client v1.657 ≈ ère D12/D13) non confirmé | Extraction client |
| **Constantes de la formule de dégâts** | Jamais extraites publiquement des binaires — les constantes 1.2767/1.2870 de [28_ADVANCED_MECHANICS.md](28_ADVANCED_MECHANICS.md) restent des reconstructions elitepvpers | Reverse engineering gameserver (non réalisé à ce jour) |
| **Taux de proc des imbues** | Aucune table trouvée dans les files ou le web | Reverse engineering |
| **HP boss 111+ depuis la 1.188** | La 1.188 (cap 110) ne les contient pas — il faut les DB 1.274/BR120/iSRO-R/iSRO-KSRO | Extraction `_RefObjChar` |
| **Taux 12D+ du service KR vivant** | Le service KR moderne n'a jamais fuité | — |
| **Facteur ×1000 HP FGW** | Aucune source comparant `characterdata` client vs `_RefObjChar` serveur pour les monstres d'instance | Extraction comparative |

---

## ❓ FAQ

### Q: ECSRO était-il un émulateur indépendant ?
**R:** **Non** — correction majeure. Les files ECSRO/ZSZC sont des **files de test cSRO fuitées**. Aucun émulateur from scratch n'a jamais tourné en production à grande échelle ; aucun code source de serveur Silkroad n'a jamais fuité (tout passe par patch binaire/DLL/SQL).

### Q: BlackRogue vient de Russie ?
**R:** **Non** — c'est le **service officiel thaïlandais** (opérateur ini3, package `SRO_Thailand_CS_106`). Les files « russes » = Silkroad R (RSRO/iSRO-R « Rigid 2015 »).

### Q: Les serveurs privés ont-ils les taux officiels ?
**R:** Les **files brutes oui** (`ExpRatio 1000` = 1x par défaut). Chaque privé les modifie ensuite (3x chez Origin, 200-350x chez DemonRoad/Venus, 999x dans l'extrême). Les taux affichés par un privé sont toujours [CUSTOM].

### Q: Où sont les HP de Kidemonas, Karkadann, Merikh ?
**R:** **m3stat.com/uniques** (mesure en jeu sur serveurs officiels iSRO) : Kidemonas 120 = 13 851 102 · Karkadann 123 = 15 023 129 · Merikh 125 = 18 372 504. Pour les boss 130+ : aucune valeur publique, extraction requise.

### Q: Le D14/D15 des serveurs privés est-il inventé ?
**R:** **Non** — D12/D13 = officiels (cap 120, Jupiter), D14 = officiel cap 125 (Legend IX, iSRO 01/2015, KR 2014), D15 = officiel cap 130 (2016). **Seuls les D16+ sont custom** (le client officiel s'arrête à D15).

### Q: Quelle est la différence entre « Medusa » arabe et Medusa ?
**R:** **Piège du lexique arabe** : « الميدوسا » désigne **BeakYung the White Viper** (Qin-Shi Tomb B6, HP officiel 183 535 199). Certains privés la déplacent (ex. SENSATION : « salle B2 ») ou doublent son HP (InPanic : 367 070 398 [CUSTOM]).

### Q: Les uniques respawn-ils à heure fixe dans les files ?
**R:** Non — **X heures après leur mort** (6 h par défaut pour la plupart, 3 h Uruchi, 4 h Medusa/Jupiter dans la vSRO), **à un point aléatoire**, délai tiré entre dwDelayTimeMin et dwDelayTimeMax (`Tab_RefNest`, en secondes).

### Q: Les géants (Giant) apparaissent à quel taux ?
**R:** **14 %** (`GiantMonster_SpawnRatio`, hardcodé dans sr_gameserver.exe) — pas stocké en DB. Le type Champion/Giant/unique est la colonne `Rarity` de `_RefObjCommon` (1=Champion, 2=Giant, 3=unique+notice, 8=unique silencieux).

### Q: Existe-t-il un dump public des plages de blues par degré ?
**R:** **Oui** — la table `_RefMagicOptByItemOptLevel` existe dans toutes les DB vSRO (schéma public via le repo ducksoup, données dans chaque dump de DB publique). Cela corrige l'ancien constat « dump public non disponible » de [05_ALCHEMY_SYSTEM.md](05_ALCHEMY_SYSTEM.md).

### Q: Le jeu officiel a-t-il existé en arabe ?
**R:** Un **service web/portail arabe officiel** : oui (02/02/2010). Un **client PC traduit en arabe** : non documenté/improbable. La **localisation arabe complète officielle** n'existe que sur mobile : Silkroad Origin Mobile Arabia (2024-2026, WeMade Max × GOSU, wiki sromarabia.com).

### Q: La scène des serveurs privés est-elle légale ?
**R:** Non — consensus communautaire explicite : faire tourner un serveur sur des files fuitées est une violation (files propriétaires Joymax/Wemade). Précédent : plainte Joymax c. ECSRO (2009, ~48 chefs, ~2,5 M$). Cette KB documente, n'héberge rien.

### Q: Quel est le meilleur point d'entrée public pour la structure de la DB ?
**R:** Le repo **ducksoup** (schémas C# des ~200 tables SHARD/ACCOUNT/LOG de la v1.188), complété par Ex-o/Silkroad-Database-Documentation et les requêtes TopS4A.

---

## 🔗 Resources

### Rapports de recherche consolidés dans ce document
- [ML_RESEARCH/RESEARCH_PS_FILES.md](ML_RESEARCH/RESEARCH_PS_FILES.md) — fichiers fuités, architecture, tables SQL (~35 requêtes)
- [ML_RESEARCH/RESEARCH_PS_HIGHCAP.md](ML_RESEARCH/RESEARCH_PS_HIGHCAP.md) — scène high-cap 120-140, chronologie officielle, outillage (~30 requêtes)
- [ML_RESEARCH/RESEARCH_AR_DEV.md](ML_RESEARCH/RESEARCH_AR_DEV.md) — communauté/dev arabes, glossaire 72 termes (~50 requêtes)
- [ML_RESEARCH/RESEARCH_AR_SERVERS.md](ML_RESEARCH/RESEARCH_AR_SERVERS.md) — serveurs privés arabes, HP/boss, monétisation (~40 requêtes)
- [ML_RESEARCH/RESEARCH_VSRO_SERVER.md](ML_RESEARCH/RESEARCH_VSRO_SERVER.md) — config serveur clé par clé, SMC, ~40 commandes GM, procédures DB, BlackRogue détaillé, émulateurs 2026, anti-cheat, bots comme documentation (~26 requêtes)

### Histoire et fuites (forums fondateurs)
- [RaGEZONE — Guide du leaker Chernobyl (13/09/2011)](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273) — architecture officielle, fiabilité 5
- [RaGEZONE — VSRO v188 (thread principal)](https://forum.ragezone.com/threads/vsro-server-files-v188.779870) · [files+client](https://forum.ragezone.com/threads/vsro-server-files-client-v1-188.780427)
- [elitepvpers — Origin of Private Servers](https://www.elitepvpers.com/forum/silkroad-online/4715286-origin-private-servers.html) · [history of silkroad](https://www.elitepvpers.com/forum/sro-private-server/4701666-history-silkroad.html)
- [RaGEZONE — ECSRO Server Files (files cSRO de test)](https://forum.ragezone.com/threads/ecsro-server-files.830540)
- [RaGEZONE — BlackRouge BR120 `SRO_Thailand_CS_106`](https://forum.ragezone.com/threads/blackrouge-official-cap-120-server-files.1107257)
- [elitepvpers — Release vSRO 1.274 Database](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5277574-release-vsro-v1-274-database.html)
- [elitepvpers — ISROR 2015 (Rigid)](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5068290-release-isror-2015-server-files-rigid-online.html) · [RaGEZONE — iSRO & KSRO leaked](https://forum.ragezone.com/threads/isro-ksro-leaked.1087030)
- [elitepvpers — Résumé de la plainte Joymax c. ECSRO](https://www.elitepvpers.com/forum/sro-private-server/1292481-info-summary-lawsuit-joymax-against-poor-ecsro-aka-zszc-slave-3.html) · [documents](https://www.elitepvpers.com/forum/sro-private-server/4402579-rare-lawsuit-case-ecsro.html)
- Hub : [RaGEZONE Silkroad Releases](https://forum.ragezone.com/community/silkroad-releases.722) · [ProjectHax Private Server List](https://forum.projecthax.com/t/private-server-list/1940)

### Structure de DB et données
- [GitHub — ducksoup (schémas SQL VSRO188)](https://github.com/ducksoup-sro/ducksoup/tree/main/Database/VSRO188) · [Ex-o/Silkroad-Database-Documentation](https://github.com/Ex-o/Silkroad-Database-Documentation)
- [GitHub — SROquests (280+ quêtes v1.188)](https://github.com/AlighieriDemiurgs/SROquests)
- [TopS4A — Query Collection](https://www.tops4a.com/2019/08/query.html)
- [RZ — Unique Spawn Time (timers vSRO)](https://forum.ragezone.com/threads/dev-unique-spawn-time.820175) · [epvp — changer les timers](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1773490-guide-how-change-unique-spawn-time.html)
- [epvp — GiantMonster_SpawnRatio 14 %](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4231757-release-modify-vsro-188-party-monster-spawn-limitation-sr_gameserver.html)
- [TopGameServer — sémantique des rates](https://topgameserver.net/drop)

### Trackers et données officielles
- [m3stat.com/uniques — HP uniques officiels](https://www.m3stat.com/uniques)
- [stats.projecthax.com — 26 serveurs officiels en direct](https://stats.projecthax.com)
- [silkroadonline.wiki — 42 532 records / 8 387 monstres / 21 490 items (client v1_657)](https://silkroadonline.wiki/)
- [Facebook officiel Silkroad](https://www.facebook.com/officialsilkroad) — annonces caps/D14
- [sro.gg](https://sro.gg/en) · [Nostalgic.gg top 94](https://nostalgic.gg/en/blog/best-silkroad-online-private-servers-en)

### Scène arabe
- [silkroad4arab.com/vb](https://www.silkroad4arab.com/vb) — le forum-monument · captures : [2008](https://web.archive.org/web/20080101/http://www.silkroad4arab.com/vb/) · [2012](https://web.archive.org/web/20120601/http://www.silkroad4arab.com/vb/) · [2015](https://web.archive.org/web/20160101/http://www.silkroad4arab.com/vb/)
- [ProBasha — dev arabe vSRO/iSRO](https://probasha.com) · [guide création serveur](https://probasha.com/threads/73) · [protections](https://probasha.com/forums/24)
- [Documentaire Archer Tales (mémoire égyptienne)](https://www.youtube.com/watch?v=OtZDIhMmxBE)
- [IGN — service arabe Joymax 2010](https://www.ign.com/articles/2010/01/22/joymax-announces-the-launch-of-arabic-language-service-for-fantasy-mmorpg-silkroad-online) · [Engadget](https://www.engadget.com/2010-02-03-silkroad-online-celebrates-their-new-arabic-language-service-wit.html)
- [Silkroad Origin Mobile Arabia](https://sromarabia.com/home) · [wiki officiel arabe](https://sromarabia.com/wiki) · [Google Play](https://play.google.com/store/apps/details?id=com.silkroad.arab&hl=ar)
- [ep4n.net — silk officiel via Vodafone Cash (EGP)](https://www.ep4n.net/ar/online-games/silkroad-100-silk-card/vodafone-cash)
- [ExaySRO Wiki — Unique Locations (HP officiels republiés)](https://wiki.exaysro.com/books/guides/page/unique-locations) · [Job Temple guide corrigé GM](https://forum.exaysro.com/showthread.php?tid=3875)
- [DemonRoad-Reborn — Unique Info (37+ uniques cap 140)](https://playdemonroad.com/unique-info)
- [SENSATION-iSRO — fiche technique cap 140](https://srocave.com/konular/sensation-isro-140-cap-no-p2w-100-play-to-earn-unique-job-based-join-the-adventure.3252)

### Outils (voir [§ Outils](#-outils-dextraction-de-données))
PK2 : [pk2_mate (Rust)](https://github.com/veykril/pk2) · [SRO.PK2API](https://github.com/JellyBitz/SRO.PK2API) · [SRO Archive Explorer](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5364960-release-sro-archive-explorer-pk2-browser-3d-model-map-effect-viewer-skill-brows.html) — Doc : [SilkroadDoc](https://github.com/DummkopfOfHachtenduden/SilkroadDoc) · [SR_Db2Media](https://github.com/JellyBitz/SR_Db2Media) — Bots : [RSBot](https://github.com/SDClowen/RSBot) · [phBot API](https://plugins.phbot.org/phbot-api) — Sécurité : [pySilkroadSecurity](https://context7.com/projecthax/pysilkroadsecurity) · [skrillax](https://github.com/kumpelblase2/skrillax)

### Renvois croisés (base SRObro)
- [28_ADVANCED_MECHANICS.md](28_ADVANCED_MECHANICS.md) — formules de dégâts (les constantes 1.2767/1.2870 restent des reconstructions, jamais extraites des files)
- [15_UNIQUE_BOSSES.md](15_UNIQUE_BOSSES.md) — HP/niveaux vérifiés des uniques (les timers « 4 h » y sont corrigés par la présente : 6 h/3 h/4 h)
- [07_ITEM_DEGREES.md](07_ITEM_DEGREES.md) — degrés D1-D13 (D14/D15 officiels documentés ici § Clarification)
- [05_ALCHEMY_SYSTEM.md](05_ALCHEMY_SYSTEM.md) — plages de blues : la table `_RefMagicOptByItemOptLevel` est publique
- [MONSTERS_SPAWN_LOCATIONS.md](MONSTERS_SPAWN_LOCATIONS.md) — nids `Tab_RefHive/Tactic/Nest`, taux giant 14 %
- [16_QUEST_SYSTEM.md](16_QUEST_SYSTEM.md) — 280+ quêtes v1.188 documentées (repo SROquests)
- [TECHNICAL_SPECIFICATIONS.md](TECHNICAL_SPECIFICATIONS.md) — spécifications SRObro (l'architecture officielle §4 du présent document complète ce dossier)
- [36_USEFUL_LINKS.md](36_USEFUL_LINKS.md) · [38_GLOSSARY.md](38_GLOSSARY.md) — liens et glossaire généralistes
- **[../fr/PRIVATE_SERVERS_ANALYSIS.md](../fr/PRIVATE_SERVERS_ANALYSIS.md)** — analyse technique d'implémentation côté SRObro (émulateurs open source Phoenix/SilkroadProject/skrillax, interfaces web ASP.NET, comparaison files vs émulateurs, exemples de code) — **complémentaire** : le présent document couvre l'écosystème et les données, l'autre l'ingénierie logicielle

---

*Dernière mise à jour : 2026-10-01 — consolidation de 5 rapports ML_RESEARCH (~181 requêtes web cumulées)*
*Rapports sources : [RESEARCH_PS_FILES.md](ML_RESEARCH/RESEARCH_PS_FILES.md) · [RESEARCH_PS_HIGHCAP.md](ML_RESEARCH/RESEARCH_PS_HIGHCAP.md) · [RESEARCH_AR_DEV.md](ML_RESEARCH/RESEARCH_AR_DEV.md) · [RESEARCH_AR_SERVERS.md](ML_RESEARCH/RESEARCH_AR_SERVERS.md) · [RESEARCH_VSRO_SERVER.md](ML_RESEARCH/RESEARCH_VSRO_SERVER.md)*
*Corrections apportées à la KB via cette recherche : ECSRO = files cSRO de test (pas un émulateur) · BlackRogue = Thaïlande/ini3 (pas RSRO) · timers uniques 6 h/3 h/4 h (pas « 4 h ») · taux Giant = 14 % hardcodé (pas « ~1 % ») · `_RefMagicOptByItemOptLevel` = dump public disponible · D12-D15 = officiels, D16+ = custom · BR120 = package update thaï incomplet, rates hardcodés dans SR_ShardManager ET SR_GameServer (pourquoi la scène préfère 1.188) · émulateurs 2026 : opensro (AGPL) = meilleure source open source · dumps publics joaodematejr (.bak 74 Mo parsé en binaire + skilldatas serveur) · contradiction des unités de rates (100 vs 1000) documentée*
