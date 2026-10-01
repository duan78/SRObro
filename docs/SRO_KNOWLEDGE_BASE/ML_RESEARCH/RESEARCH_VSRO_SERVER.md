# 🖥️ Recherche EN — Le CÔTÉ SERVEUR de Silkroad en profondeur (config, SMC, GM, DB, modding, BlackRogue, émulateurs, anti-cheat, bots)

> **Rapport de recherche web (sources EN/forums)** — 2026-10-01 · SRObro Knowledge Base
> **Périmètre** : APPROFONDISSEMENT du côté serveur au-delà de [RESEARCH_PS_FILES.md](RESEARCH_PS_FILES.md) (qui couvrait l'inventaire des fuites, l'architecture en 9 modules et les tables `_Ref*`) : configuration serveur clé par clé (`server.cfg`, `srNodeType.ini`, `srShard.ini`), SMC (Server Management Console), certification, commandes GM complètes, procédures stockées métier, modding communautaire vSRO, BlackRogue en détail, clients KSRO vs vSRO, émulateurs open source (dont **opensro**, déjà source du projet), anti-cheat officiel, et les bots comme documentation du jeu.
> **Méthode** : ~26 requêtes web + 16 pages récupérées (RaGEZONE via lecteur web, GitHub/GitLab, phBot Guide officiel, r10dev, vsro.org, TopS4A, blogs). Les documents lus au préalable pour éviter la duplication : [39_PRIVATE_SERVERS.md](../39_PRIVATE_SERVERS.md) et [ML_RESEARCH/RESEARCH_PS_FILES.md](RESEARCH_PS_FILES.md).
> ⚖️ **Note légale** : ce document **recense et documente uniquement** (URLs, clés de config, structure). Il ne fournit ni n'héberge aucun fichier. Les fichiers de serveur Silkroad appartiennent à Joymax/Wemade Max.

---

## 📋 Table des Matières
- [📚 Index des sources (URL + fiabilité)](#-index-des-sources-url--fiabilité)
- [1. Configuration serveur — toutes les clés documentées](#-1-configuration-serveur--toutes-les-clés-documentées)
- [2. SMC (Server Management Console) et certification](#-2-smc-server-management-console-et-certification)
- [3. Ports réseau complets](#-3-ports-réseau-complets)
- [4. Gestion en jeu — commandes GM complètes](#-4-gestion-en-jeu--commandes-gm-complètes)
- [5. Outils d'administration tiers et panels web](#-5-outils-dadministration-tiers-et-panels-web)
- [6. DB métier — procédures stockées, tables live, logs](#-6-db-métier--procédures-stockées-tables-live-logs)
- [7. Alchimie et drops : servis côté serveur](#-7-alchimie-et-drops--servis-côté-serveur)
- [8. Modding communautaire vSRO (rétrofits, zones, uniques, limites)](#-8-modding-communautaire-vsro-rétrofits-zones-uniques-limites)
- [9. Bugs connus de la 1.188 et leurs fixes](#-9-bugs-connus-de-la-1188-et-leurs-fixes)
- [10. BlackRogue en détail (BR110/BR120)](#-10-blackrogue-en-détail-br110br120)
- [11. Clients KSRO vs vSRO — la Corée comme pipeline de données](#-11-clients-ksro-vs-vsro--la-corée-comme-pipeline-de-données)
- [12. Émulateurs open source — inventaire et apport pour SRObro](#-12-émulateurs-open-source--inventaire-et-apport-pour-srobro)
- [13. Anti-cheat officiel — historique et modèle de sécurité](#-13-anti-cheat-officiel--historique-et-modèle-de-sécurité)
- [14. Les bots comme documentation du jeu](#-14-les-bots-comme-documentation-du-jeu)
- [15. Incertitudes restantes](#-15-incertitudes-restantes)
- [16. Recommandations pour SRObro](#-16-recommandations-pour-srobro)
- [📌 Synthèse — Top 5 découvertes](#-synthèse--top-5-découvertes)

---

## 📚 Index des sources (URL + fiabilité)

Fiabilité : 5 = source primaire (leaker, doc officielle d'un outil, annonce officielle) · 4 = forum de référence multi-sources / dump de config réel · 3 = témoignage/guide unique fiable · 2 = secondaire · 1 = non vérifié.

| # | Source | URL | Fiab. | Apport |
|---|--------|-----|-------|--------|
| S1 | **RaGEZONE — Guide Chernobyl (post principal, 13/09/2011)** | https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273 | **5** | Guide du leaker : prérequis, XTrap update files dans la release, certification port 32000, `_PrivilegedIP`, MD5, `sec_primary/sec_content`, limites (1000 joueurs/agent) |
| S2 | **RaGEZONE — même guide, page 33 (dump complet `server.cfg` + `srNodeType.ini` + `srShard.ini` + `srGlobalService.ini` par stefsika)** | https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273/page-33 | **4** | LA référence config : chaque bloc `GlobalManager{}`, `GatewayServer{}`, `SR_GameServer{}`, `SR_ShardManager{}` avec toutes les clés (IBUV, AutomatedPunisher, SET_FEE_RATE…) + topologie officielle 48 nœuds |
| S3 | **RaGEZONE — même guide, page 4 (SMC, srShard capacity, erreurs)** | https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273/page-4 | 4 | `capacity` modifiable (1000 → 2300), erreurs BillingServer/Temple Anubis, « ShardManager is blind : 0 users are banned » |
| S4 | **RaGEZONE — GM Commands (thread 781576 + page 2, posts de Chern0byl lui-même)** | https://forum.ragezone.com/threads/gm-commands.781576 · /page-2 | **5** | Liste de ~30 commandes GM vSRO avec syntaxe exacte + posts du leaker (`/zoe MOB_RM_ROC 50`, F1/F2/F3) |
| S5 | **r10dev — VSRO GM Commands List + GM Console F1 Commands** | https://r10dev.net/konular/vsro-gm-commands-list-silkroad-online-gm-codes-guide.5380 · https://r10dev.net/konular/vsro-gm-console-f1-commands-list-silkroad-gm-command-guide.5384 | 3-4 | 15 commandes F1 documentées (`/gachastart`, `/mobkill 0`, `/warp`, `/gotown`…) |
| S6 | **RaGEZONE — [Official-vSRO] Error Thread + Solution Collection** | https://forum.ragezone.com/threads/official-vsro-error-thread-solution-collection-please-contribute.812346/ | 4 | Bugs 1.188 + fixes : QTUTORIAL, `SR_CharAppoint`, `_ManageShardCharName`, CLAMP 2 Md trade, `srPatcher` spoof IP, limites IP GlobalManager, MsgID 0x6102, XTrap loader |
| S7 | **r10dev — vSRO MachineManager Configuration Guide** | https://r10dev.net/konular/vsro-machinemanager-configuration-guide.16078 | 3 | Config MachineManager (nom de machine, IP réseau) |
| S8 | **TopGameServer — How to Change vSRO EXP and Silk Rates** | https://topgameserver.net/drop | 3-4 | Sémantique des rates (modèle « valeur/1000 »), clés Silk* |
| S9 | **elitepvpers — How to change vSRO rate exp/gold/sp** | https://www.elitepvpers.com/forum/sro-private-server/1483665-help-how-change-vsro-rate-exp-gold-sp.html | 3 | Édition des rates dans server.cfg |
| S10 | **RaGEZONE — EXP/SP Rates splitter (patcher SR_GameServer 1.188)** | https://forum.ragezone.com/threads/exp-sp-rates-splitter.870955 | 4 | EXP et SP liés en vanilla → patch binaire pour les séparer |
| S11 | **RaGEZONE — vSRO Ports configure!** | https://forum.ragezone.com/threads/vsro-ports-configure.1050702 | 3-4 | Ports à ouvrir : agent (login), gateway (identification), download — TCP uniquement |
| S12 | **elitepvpers — About firewall settings** | https://www.elitepvpers.com/forum/sro-private-server/3924513-about-firewall-settings.html | 3 | Liste étendue : 15880/82/83/85, 32000, 15779, 8080, 1433, 3306, 445, 8010, 80 |
| S13 | **elitepvpers — Help open port** | https://www.elitepvpers.com/forum/sro-private-server/3701633-help-open-port.html | 3 | Cœur : 15779, 15880, 32000 |
| S14 | **vsro.org — Firewall ayarları (durcissement)** | https://www.vsro.org/konular/server-acikken-sorun-yasayan-vsro-org-kullanicilar-icin-firewall-ayarlar.5328 | 3 | Ouverts : 15884, 15779 ; fermés : 15880, 25880, 32000, 15882 |
| S15 | **elitepvpers — BlackRogue 110 Rates fix** | https://www.elitepvpers.com/forum/sro-private-server/3308860-blackrogue-110-rates-fix.html | 4 | **Rates BR hardcodés dans SR_ShardManager ET SR_GameServer** (vs server.cfg seul en vSRO) |
| S16 | **RaGEZONE — Blackrogue 110lv Shard Rate Fix** | https://forum.ragezone.com/threads/blackrogue-110lv-shard-rate-fix.1068146 | 4 | Binaires SR_ShardManager pré-patchés : Exp Rate / Party Exp / Extra Exp |
| S17 | **elitepvpers — Do you prefer VSRO 1.188 or BlackRogue 110 cap files?** | https://www.elitepvpers.com/forum/sro-private-server/2510919-do-you-prefer-vsro-1-188-blackrogue-110-cap-files-2.html | 3 | Débat communautaire BR vs vSRO |
| S18 | **elitepvpers — What server files to choose?** | https://www.elitepvpers.com/forum/sro-pserver-questions-answers/5174796-what-server-files-choose.html | 3 | Consensus : vSRO « clean, bugless », échange/avatars/pets OK, meilleur support outils |
| S19 | **RaGEZONE — List of all offsets of 110CAP Blackrogue Serverfiles and Client** | https://forum.ragezone.com/threads/list-of-all-offsets-of-110cap-blackrogue-serverfiles-and-client.1054626 | 4 | Les offsets BR diffèrent de vSRO → outillage à refaire |
| S20 | **RaGEZONE — BlackRouge Official CAP 120 Server Files (MeGaMaX 07/2016)** | https://forum.ragezone.com/threads/blackrouge-official-cap-120-server-files.1107257 | **5** | Package `SRO_Thailand_CS_106` : hash MD5/SHA-1, dossiers, 4 exes + SRCommonDataLoader.dll, état incomplet (DB account à reconstruire, procédures manquantes), client BR v1.040 packed, commentaire « hacked ini3 before they closed » |
| S21 | **GitHub — opensro-dev/opensro** | https://github.com/opensro-dev/opensro | **5** | Émulateur Go + client WebGPU, **v1.150 (Legend III)**, **AGPL-3.0-or-later** — déjà utilisé par la KB (alchimie, potions) |
| S22 | **GitHub — opensro/apps/server/internal/game (arborescence)** | https://github.com/opensro-dev/opensro/tree/main/apps/server/internal/game | **5** | Packages implémentés : abnormal, action, combat, enterworld, **gmcommand**, item, linkedpulse, paramkeeper, progression, quest, restriction, siege, social, world |
| S23 | **GitHub — ferdoran/go-sro-agent-server** | https://github.com/ferdoran/go-sro-agent-server | 4 | Agent server Go basé files vSRO 1.88 : lobby, mouvement + collision, spawns par range, chat, party matching, inventaire, stalls ; navmesh raylib ; archivé 10/2022 |
| S24 | **GitHub — tanisman/SilkroadProject** | https://github.com/tanisman/SilkroadProject | 4 | Émulateur C# (VS2015, Asio, MSSQL 2008+) pour client **Open Beta** ; GatewayServer/SR_GameServer/SCore/SCommon ; DB `_ServerConfig` |
| S25 | **GitHub — CarlosX/DarkEmu** | https://github.com/CarlosX/DarkEmu | 4 | Émulateur C++ lignée csremu/sremu/sro-emulator/srevolution, base **MaNGOS**, **GPLv2** |
| S26 | **GitHub — kumpelblase2/skrillax** | https://github.com/kumpelblase2/skrillax | 3 | Émulateur Rust/ECS (projet d'apprentissage) |
| S27 | **RaGEZONE — Phoenix open source emulator (C#/.NET Core)** (cité via [fr/PRIVATE_SERVERS_ANALYSIS.md](../../fr/PRIVATE_SERVERS_ANALYSIS.md)) | https://forum.ragezone.com/threads/phoenix-open-source-silkroad-online-emulator-c-net-core.1159736/ | 3 | Émulateur C# moderne (déjà documenté côté FR) |
| S28 | **SourceForge — Silkroad Online Server Emulator** | https://sourceforge.net/projects/sro-server-emu | 2 | Projet historique SourceForge |
| S29 | **GitLab — topic Silkroad Online** | https://gitlab.com/explore/projects/topics/Silkroad+Online | 3 | Lobot (bot VSRO 1.188), SRO Archive Explorer, Rust Silkroad Security |
| S30 | **SilkroadDoc wiki — Silkroad Security (pushedx, archivé)** | https://github.com/DummkopfOfHachtenduden/SilkroadDoc/wiki/Silkroad-Security | **5** | Modèle réseau : header 6 octets, security bytes count/CRC, handshake 0x5000 (flag 0x0E/0x10, 5 seeds), Blowfish (bit 0x8000 dans Size) |
| S31 | **phBot Guide — Script Commands (doc officielle)** | https://guide.phbot.org/phbot/script-commands | **5** | Liste complète des commandes de script (walk/teleport/quest/oldtrade…) = mécaniques documentées |
| S32 | **phBot Guide — Trade (onglet)** | https://guide.phbot.org/phbot/trade | 4 | Boucle de trade automatisée |
| S33 | **ProjectHax — Removing GameGuard from sro_client** | https://forum.projecthax.com/t/removing-gameguard-from-sro-client/23030 | 3 | GameGuard présent dans le client officiel + contournement |
| S34 | **elitepvpers — GameGuard Workaround (ère 2006-2007)** | https://www.elitepvpers.com/forum/silkroad-online/53522-gameguard-workaround-how-bypass.html | 3 | GameGuard = protection de la première heure iSRO |
| S35 | **Silkroad Forums — GameGuard error 340** | http://www.silkroadforums.com/viewtopic.php?f=3&t=3859 | 3 | Dossier `GameGuard/` dans `C:/Program Files/Silkroad/` (client officiel) |
| S36 | **nProtect — FAQ officielle GameGuard** | https://gameguardfaq.nprotect.com/eng/con_02.html | 5 | Sémantique codes 340/350/360/361/380 (échec de mise à jour) |
| S37 | **GamesIndustry.biz — Legend V Plus Battle Arena (08/2010)** | https://www.gamesindustry.biz/silkroad-online-legend-v-plus-battle-arena-update-launched-with-prizes-to-be-won | **5** | Annonce officielle : « a new update to the game's **HackShield** anti-cheat system » |
| S38 | **elitepvpers — How to disable x-trap for 1.188 vsro** | https://www.elitepvpers.com/forum/sro-private-server/2737981-how-disable-x-trap-1-188-vsro-server-files-client.html | 3 | Le client vSRO 1.188 embarque XTrap |
| S39 | **vsro.org — How to remove XTrap from sro_client** | https://www.vsro.org/konular/how-to-remove-xtrap-from-sro_client-testin-in-obdg-does-anyone-here-know.4675 | 3 | Outil « select 1.188 → remove XTrap » |
| S40 | **elitepvpers — Way to create VSRO XTrap bypass?** | https://www.elitepvpers.com/forum/sro-coding-corner/1432421-way-create-vsro-xtrap-bypass.html | 3 | `silkload.dat` : IP d'un serveur XTrap custom + chiffrement à reverser |
| S41 | **TopS4A — VSRO Query Collection (analysée intégralement)** | https://www.tops4a.com/2019/08/query.html | 3-4 | ~50 requêtes : `_ADD_ITEM_EXTERN`, `_SEEK_N_DESTROY_ITEM`, `_AddNewCOS`, `_Guild_Create`, `_GetMediaLines`, InventorySize max 109, JobID 1/2, rates via `_RefObjItem` |
| S42 | **elitepvpers — Plus Auto Notice (Sample + Source)** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/2656080-release-plus-auto-notice-sample-source.html · miroir RZ : https://forum.ragezone.com/threads/plus-auto-notice-sample-source.937859 | 4 | Mod `_AddLogItem` → notice globale alchimie |
| S43 | **elitepvpers — procédure `_AddLogItem` buggy (code complet posté)** | https://www.elitepvpers.com/forum/sro-private-server/4718679-hello-i-need-some-help-procedure-someone-can-help-me.html | 4 | Signature : `@CharID int, @ItemRefID int, @ItemSerial bigint, @dwData int…` |
| S44 | **vsro.org — Mercenary Scroll çözümü (exemple `_AddLogItem`)** | https://www.vsro.org/konular/mercenary-scroll-cozumu.2621 | 3 | Hook `if (@Operation = 41 and @ItemRefID between 47023 and 47037)` |
| S45 | **elitepvpers — Exclusive Mastery lvlup Scroll** | https://www.elitepvpers.com/forum/sro-private-server/3566886-problem-exclusive-mastery-lvlup-scroll.html | 3 | **Le GameServer doit réellement écrire dans SHARDLOG** pour que `_AddLogItem` se déclenche |
| S46 | **elitepvpers — _AddTimedJob Procedure (lottery item)** | https://www.elitepvpers.com/forum/sro-private-server/4017366-_addtimedjob-procedure-help-me-fix.html | 3 | `_AddTimedJob` (SHARD) utilisé pour items à effet temporisé |
| S47 | **Silkroad4Arab — Queries Collection** | https://silkroad4arab.com/vb/showthread.php?t=607358 | 3 | Chemin documenté : `SRO_VT_SHARD → Programmability → Stored Procedures → _AddTimedJob (ALTER)` |
| S48 | **Silkroad4Arab — Skill & State Reset Scroll** | https://silkroad4arab.com/vb/showthread.php?t=615861 | 3 | Procédure `_AddLogItem` complète pour scrolls de reset |
| S49 | **elitepvpers — Model Switcher** | https://www.elitepvpers.com/forum/sro-pserver-questions-answers/4246661-model-switcher.html | 3 | Pattern `EXEC SRO_VT_SHARDLOG.dbo._NOVA_SWITCHER @CharID…` |
| S50 | **GitHub — JellyBitz/vSRO-ServerAddon** | https://github.com/JellyBitz/vSRO-ServerAddon | **5** | Injection DLL (Stud_PE) SR_GameServer/SR_ShardManager 1.188 ; **19 actions temps réel** via INSERT `_ExeGameServer` ; codes résultat documentés |
| S51 | **GitHub — JellyBitz/SR_Db2Media** | https://github.com/JellyBitz/SR_Db2Media | 4 | DB SQL → fichiers media client (chiffrage .enc auto, import direct Media.pk2) ; crédits Syloxx/drew benton |
| S52 | **RaGEZONE — New room (area) to open** | https://forum.ragezone.com/threads/new-room-area-to-open.930548 | 3-4 | Ajout de zone : extraire `server_dep` d'un client iSRO + `RefRegion.txt` + `_RefRegion` |
| S53 | **elitepvpers — Etherial Editor (Full SRO Map Editor)** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5347764-release-etherial-editor-full-sro-map-editor.html | 3 | Éditeur de cartes : créer/cloner régions, minimaps, activer `_RefRegion` client+DB |
| S54 | **elitepvpers — Select LatestRegion from _Char** | https://www.elitepvpers.com/forum/sro-pserver-questions-answers/4862041-select-latestregion-_char.html | 3 | World ID 1 = carte non instanciée ; AreaName via `_RefRegion` |
| S55 | **elitepvpers — Assembly guides to improve your VSRO Server** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1734793-guide-assembly-guides-improve-your-vsro-server.html | 3 | Patchs OllyDbg : caps mastery/level, anti-crash > lvl 110 |
| S56 | **elitepvpers — Vsro v1.88 bugs / PvP bug / Most of vsro files problem solved** | https://www.elitepvpers.com/forum/sro-private-server/4384466-vsro-v1-88-bugs.html · https://www.elitepvpers.com/forum/sro-pserver-questions-answers/5083649-pvp-bug-vsro-1-188-a.html · https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1431961-guide-most-vsro-files-problem-solved-here-184.html | 3 | Recueils de bugs 1.188 |
| S57 | **RaGEZONE — MiniTools v10 (outil tiers vSRO)** | https://forum.ragezone.com/threads/minitools-v10-0-0-0-unlimited-features-vsro.1067527 | 3 | Suite d'admin : Account Silk Adder par JID, correctif « Couldn't connect to SMC » |
| S58 | **vsro.org — MGProjects vSRO GM Tool v4.1** | https://www.vsro.org/konular/release-mgprojects-vsro-gm-tool-v4-1-complete-event-spawn-manager-by-mgprojects-released-by-dev-s3ody.17179 | 3 | Outil GM GUI : téléport (region,X,Y,Z), spawn d'items, event manager |
| S59 | **elitepvpers — SilkPanel CMS (iSRO & VSRO)** + doc officielle | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4815738-release-fully-working-website-isro-vsro-silkpanel-cms.html · https://documentation.devso.me | 3 | Panel web complet |
| S60 | **GitHub — Gano2k6/isro-cms** | https://github.com/Gano2k6/isro-cms | 3 | CMS open source iSRO & vSRO |
| S61 | **RaGEZONE downloads — PurePanel Free (PHP, 8 thèmes)** | https://forum.ragezone.com/downloads/vsro-php-panel-purepanel-free-8-different-themes.4 | 2-3 | Panel PHP vSRO |
| S62 | **vsro.org — SRO Web Panel (Blazor .NET 8)** | https://www.vsro.org/konular/silkroad-website.11813 | 3 | Panel Blazor : add silk, ban users |
| S63 | **elitepvpers — patch client module version without SMC** | https://www.elitepvpers.com/forum/sro-pserver-questions-answers/5183994-vsro-patch-client-module-version-without-smc.html | 3 | Le SMC sert aussi à pousser les versions/modules du client |
| S64 | **RaGEZONE downloads — Official vSRO Files 110 Cap 11DG 2022** | https://forum.ragezone.com/downloads/silkroad-vsro.5 | 3 | « SMC → Server Control → clic droit **Start All Service** » |
| S65 | **elitepvpers — How to Ban Player by Character Name [Database]** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1876233-release-how-ban-player-character-name-database.html | 3 | Ban SQL « easier than SMC » : nom + durée |
| S66 | **elitepvpers — make client disconnect without /ban** | https://www.elitepvpers.com/forum/sro-private-server/4211945-vsro-make-client-disconnect-without-ban.html | 3 | `/ban <char>` en vSRO = simple kick (déconnexion) |
| S67 | **SRO Info Forum — SBot Tutorial (unique alarms)** | https://sroinfo.forumotion.com/t10-bot-sbot-tutorial | 3 | « Never miss a unique again » : alarmes de spawn |
| S68 | **Bot-Cave — articles/changelog SBot officiels** | https://www.bot-cave.net/index.php?articles/page-7 | 4 | Auto Stall et autres features officielles SBot |
| S69 | **Silkroad Latino Wiki — mBot Complete Guide (free)** | https://wiki.silkroadlatino.com/en/faq/mbot-guia | 3 | mBot : leveling, gold farm, quêtes, **clientless** |
| S70 | **elitepvpers — Setting up mBot to Trade Automatically** | https://www.elitepvpers.com/forum/sro-guides-templates/4105202-tutorial-setting-up-mbot-trade-automaticly-video-tutorial-voice.html | 3 | Trade automatisé mBot |
| S71 | **elitepvpers — Silkroad Online Client Archive** | https://www.elitepvpers.com/forum/sro-hacks-bots-cheats-exploits/4308987-silkroad-online-client-archive.html | 3 | ~4 ans de clients historiques collectés |
| S72 | **elitepvpers — official Korean Silkroad** | https://www.elitepvpers.com/forum/silkroad-online/2396266-official-korean-silkroad.html | 3 | KSRO = pipeline « Revolution » plus avancé qu'iSRO-R |
| S73 | **SRO Valkyria (blog JP) — historique mises à jour jSRO** | https://srovalkyria.blog.fc2.com/blog-entry-63.html | 3 | 26/02/2014 : plans 2014, équipements D14 (Asie avant iSRO) |
| S74 | **elitepvpers — KSRO VS ISRO DIFFERENT** | https://www.elitepvpers.com/forum/silkroad-online/205069-ksro-vs-isro-different.html | 3 | Comparaison KR/international |
| S75 | **r10dev — vSRO Server Files Installation Guide (cert.ini)** | https://r10dev.net/konular/vsro-server-files-installation-guide-full-setup.5504 | 3 | cert.ini, prérequis matériels |
| S76 | **elitepvpers — VSRO 1.188 Multilingual/English Patch** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5174426-vsro-1-188-multilingual-english-patch.html | 3 | Patch multilingue des files 1.188 |
| S77 | **elitepvpers — Fellows + Pet Update (vSRO 1.188)** | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5159698-fellows-pet-update-vsro-1-188-a.html | 3 | Retroport des fellows/debuffs iSRO vers 1.188 |

Sources réutilisées de [RESEARCH_PS_FILES.md](RESEARCH_PS_FILES.md) sans re-détail : guide elitepvpers miroir (S25 de ce rapport = `1433603`), BR110/BR120 threads, ducksoup (schémas SQL), SROquests, r10dev GM listes (S5 ci-dessus).

---

## ⚙️ 1. Configuration serveur — toutes les clés documentées

> 📌 **Source principale** : le dump complet d'une config 1.188 en production posté par l'utilisateur **stefsika** dans le guide du leaker (S2, page 33 du thread) — le document de config le plus complet disponible publiquement. Complété par le post principal du guide (S1).

### 🗝️ 1.1 `server.cfg` (lu par les modules, lu au démarrage — restart requis)

Le fichier contient **un bloc par module**. Clés documentées, bloc par bloc :

```
Common {
    debug_option_debugger_present false     ← flags de debug par module
    debug_option_console_present false
}

GlobalManager {
    Certification "10.67.15.85", 32001      ← IP + port du serveur de certification
    LoginFailureTolerance 3                 ← échecs de login tolérés avant punition (commentaire coréen d'origine : tolérance max d'erreurs de mot de passe)
    IBUVFailureTolerance 3                  ← échecs de CAPTCHA (image) tolérés
    LoginFailureBlockTimeMin 10             ← durée de blocage (min) après échecs login
    IBUVFailureBlockTimeMin 10              ← idem après échecs CAPTCHA
    AutomatedPunisher "AutomatedPunisher"   ← NOM DU MODULE DE PUNITION AUTOMATIQUE (commentaire coréen : « entité qui bloque — le blocage était auparavant fait par commande GM »)
    LoginPunishmentGuide "Illegal logging detected"        ← messages affichés
    IBUVPunishmentGuide "Illegal code string detected"
    LoginPunishmentDescription "..."
    IBUVPunishmentDescription "..."
}

GatewayServer {
    LastFullVersion_SR_Client 130           ← version minimale du client acceptée
    Certification "", 32000
    IBUVQueueReserveCount 20000             ← nb d'images de CAPTCHA pré-générées (commentaire coréen d'origine)
    IBUVQueuePrepareRatio 0.05              ← ratio de génération d'images en temps d'idle
    IBUVFailureIPTolerance 0                ← échecs CAPTCHA tolérés PAR IP (0 = aucun blocage)
    IBUVStringSize 6                        ← taille du code : 3 si jeu de caractères coréen, 6 si alphabet latin
    IBUVCharacterSet "ABCDEFGHLMNQRTabdehimn2345678"  ← alphabet du CAPTCHA
}

DownloadServer { Certification "", 32000 }
FarmManager     { Certification "", 32000 }
MachineManager  { Certification "", 32000 }

AgentServer {
    Certification "", 32004
    (code "5" : certifié en premier, relais clients ; limite officielle 1000 utilisateurs — S1)
}

SR_GameServer {
    Certification "", 32004
    ExpRatio 100                            ← taux EXP (voir §1.3 : unités contestées)
    ExpRatioParty 100                       ← taux EXP en groupe
    DropItemRatio 0,1                       ← fréquence de drop d'items
    DropGoldAmountCoef 0,1                  ← coefficient d'or par monstre
    WINTER_EVENT_2009 0                     ← flags d'événements historiques Joymax (EVENT_ON/EVENT_OFF)
    EUBUSINESS_EVENT 0
    GOLDEN_PIG_FEBRUARY_EVENT 0
    THANKS_GIVING_EVENT 0
    LIBERATION_EVENT 0
    LOCALE LOCALE_VIETNAM                   ← locale régionale du service (vSRO !, « for Helper mark »)
    SET_FEE_RATE "0,5,5,5"                  ← frais de pose (stall), 3 paliers — sous-bloc ifdef OPEN_MARKET_SYSTEM
    SELL_FEE_RATE "0,10,10,10"              ← frais de vente consignation, 3 paliers — sous-bloc ifdef OPEN_MARKET_SYSTEM
}

SR_ShardManager {
    UserID "sa" / Password "..."            ← identifiants MSSQL
    GlobalManager "IP", 32001 / MachineManager "IP", 32000
    Certificate "IP", 32004
    BILLING_SERVER_URL "http://<IP>:1337/"  ← URL du billing ASP/IIS (DBConnect.asp)
    CREST_FTP_URL "ftp://crest:<pass>@<IP>" ← FTP des crest de guilde
    ExtraExpRatio 0,1                       ← bonus EXP global du shard
    ChristmasEvent2007 0                    ← flag événement historique
    SERVER_EVENT_SYSTEM ON                  ← système d'événements serveur
    LOCALE LOCALE_VIETNAM
    FlagEvent 0/1                           ← event flags par serveur
    HourForMeterRateLevelFirst 22           ← heures « pleines » (meter rate)
    HourForMeterRateLevelSecond 23
    BattleArenaRandom 1 / BattleArenaParty 1 / BattleArenaGuild 1 / BattleArenaJob 1
    ArenaMatchOccupy 1 / ArenaMatchFlag 1 / ArenaMatchPoint 1
}
```

*(Valeurs littérales du dump S2 ; les virgules décimales viennent d'un collage par un utilisateur francophone. S1 confirme BILLING_SERVER_URL/CREST_FTP_URL et le port 32000.)*

**Lecture pour SRObro** :
- **`IBUV*` = le CAPTCHA officiel de login** (« Image-Based User Verification ») : **20 000 images pré-générées** (régénérées en tâche de fond à hauteur de `IBUVQueuePrepareRatio`), code de **6 caractères** (3 si jeu de caractères coréen) sur alphabet restreint, tolérance d'échecs par IP configurable (0 = pas de blocage), punition automatique. C'est **le système anti-bot de login du jeu officiel**, documenté dans ses moindres paramètres — y compris les commentaires coréens d'origine des ingénieurs Joymax, conservés dans les files.
- **`AutomatedPunisher`** : un composant nommé du GlobalManager applique les blocages — preuve d'une punitive architecture anti-abus côté officiel.
- **`SET_FEE_RATE`/`SELL_FEE_RATE`** = les frais de l'économie joueur (stall/consignation) : **5 % / 10 %** par défaut — constantes économiques officielles.
- **`LOCALE LOCALE_VIETNAM`** gravé dans la config = preuve interne de l'origine du service (cf. fuite vietnamienne).
- Les **flags d'événements** (Winter 2009, Golden Pig février, Thanksgiving, Liberation, Christmas 2007) documentent le calendrier événementiel officiel passé, pilotable par config.

### 🗺️ 1.2 Les autres fichiers de config (package certification)

D'après S1 + S2 :

| Fichier | Rôle | Clés documentées |
|---|---|---|
| **`srGlobalService.ini`** | Déclare le GlobalManager | `[global] count=1` ; `[entry0] operation_type=22, name="**SRO_Vietnam_TestLocal**" (⚠️ le nom de machine d'origine est une 2ᵉ preuve interne de l'origine vietnamienne), query ODBC (source SQL), **`global_manager_node_id=697`** |
| **`srNodeType.ini`** | **Inventaire des nœuds de la ferme** : 48 entrées | `[entry] id, operation_type, name` — `operation_type 22` = machine physique, `17` = processus serveur, `0` = Certification Manager (`id=133`) ; ids jusqu'à 831, `machine_manager_node_id` 1901-1919 pour la 6ᵉ machine |
| **`srShard.ini`** | Déclare un shard | `id=64`, `name=Server1`, `global_operation_id=20`, **`capacity` (2300 dans le dump officiel, 1000 chez stefsika — S3 prouve qu'on peut la modifier)**, `shard_manager_node_id=705`, `query`/`query_log` (chaînes ODBC DSN vers SHARD/LOG), `u1=240 u2=208 u3=17 u4=1 u5=0 u6=0 u7=0` (slots/ratios internes non documentés) |
| **`machine.ini`** | Déclare une machine au MachineManager (rôle, IP réseau — S7) | nom de machine + IP devant matcher la carte réseau |
| **`cert.ini`** (repacks récents) | Config du serveur de certification custom (S75) | — |
| **`DBConnect.asp`** | Script ASP/IIS du billing (S1) | chaîne SQL + méthode de vérification compte/silk |

**🏆 La pépite `srNodeType.ini`** (S2) : le dump contient la **topologie officielle du service vietnamien** — le paquet original déclare les machines `Main_machine` et `2nd_machine` (GlobalManager `GWS1`, FarmManager+GameServer `FMGS1`), et la section complétée déclare **6 machines SD (`SDMGS1`..`SDMGS6`)** portant chacune **3 AgentServers (`SDnAGS1-3`)** et **2-3 GatewayServers (`SDnGAS1-3`, la 3ᵉ ajoutée par une vague d'entrées supplémentaires ids 35-47)**. Cela confirme l'architecture « ferme » officielle : la base 1.188 était un **environnement de test à 6 machines**, cohérent avec le fait qu'un seul GameServer ne peut pas charger toutes les régions (S1, déjà documenté dans la KB).

### 🔢 1.3 Rates : deux conventions contradictoires documentées (non tranché)

| Modèle | Sources | Détail |
|---|---|---|
| **« valeur = pourcentage, 100 = x1 »** | Dump réel 1.188 (S2) : `ExpRatio 100`, `ExpRatioParty 100`, `DropItemRatio 0,1`, `DropGoldAmountCoef 0,1` ; fix BlackRogue « edit the 100 » (S15) ; pack RZ 1068146 (S16) | Les valeurs par défaut d'une config 1.188 saine sont 100/100/0,1/0,1 — lisible comme x1/x1/0,1/0,1 |
| **« valeur = millièmes, 1000 = x1 »** | TopGameServer (S8) : « values stored as integers multiplied by 1000 ; 1000 = x1, 5000 = x5, 35000 = x35 » + guide epvp (S9, S25-PS_FILES) ; exemple `ExpRatioPartyBonus 3000 = x3` | Les guides de Rates utilisent massivement l'échelle /1000 |

⚠️ **Statut** : les deux échelles coexistent dans la documentation communautaire — possiblement des conventions différentes selon les générations de files (1.188 vs 1.274 vs BR) ou une confusion récurrente des guides. **À trancher par inspection directe d'une config 1.188 + mesure en jeu** (faire `/mobkill 0` sur un mob de référence et comparer l'EXP). Autres clés de rates documentées (S8, S24-PS_FILES) : `ExpRatioPartyBonus`, `HwanGainFactor` (vitesse Zerk), `SilkOwnTime` (délai avant qu'un silk acheté soit « possédé »), `SilkPerHour`, `SilkDropRate`. **EXP et SP sont liés en vanilla** — le splitter (S10, GitHub ahmedkassem56) patch les floats de `SR_GameServer.exe` pour les découpler.

---

## 🖥️ 2. SMC (Server Management Console) et certification

### 2.1 Le SMC — fonctionnalités documentées

Le **SMC est l'outil officiel de Joymax** embarqué dans les files (dossier `SMC/` du package BR120 — S20 ; « Latest SMC Build » téléchargeable séparément selon le leaker — S1).

| Capacité | Détail | Source |
|---|---|---|
| **Démarrage/arrêt des modules** | « SMC → **Server Control** → clic droit **Start All Service** » ; AUTO START possible (Gateway/Agent/GlobalManager/GameServer) | S64, S1(PS_FILES S1) |
| **Bannir un joueur** | Bouton « Ban!! » ; **le module dédié est `SR_UserPunishment`** ; SMC → UserControl (dll `usercontrol.dll`) ; ⚠️ exige le **nom de compte** (pas le nom du perso) | S4 (page 2 du thread GM, réponse à un utilisateur) |
| **Blocage d'IP** | Module **IPBlock** (dll `ipblock.dll`) | S4 |
| **Monitoring utilisateurs** | UserControl liste les joueurs ; le log « 705:SR_ShardManager is blind : 0 users are banned » montre la circulation des états de ban | S4, S3 |
| **Pousser version/module du client** | Le SMC met à jour le `LastFullVersion_SR_Client` et distribue les patchs (d'où le thread « patch client module version without SMC » pour automatiser) | S63, S2 |
| **Création des comptes** | Le SMC crée les comptes dans `SRO_VT_ACCOUNT` (S1-PS_FILES) ; sinon SQL direct (`TB_User` + `SK_Silk`) | S1, S4 |

**Limites documentées** : la commande GM `/ban` **ne fait que déconnecter** le joueur (« /ban just kicks » — S66) ; le vrai ban passe par **SMC → SR_UserPunishment** (nom de compte requis — S4) ou par SQL (`_Punishment` + `_BlockedUser` — S41). Le ban SQL par nom de personnage est « easier than SMC » (S65).

### 2.2 Certification — comment un module s'enregistre

D'après S1 (le leaker) + S2 + S6 :

1. Le **Custom Certification Server** (remplacement communautaire par **pushedx/Drew Benton** du serveur de certification Joymax ; « Certification Manager » = nœud `id=133`, `operation_type 0` dans `srNodeType.ini`) écoute sur le **port 32000**.
2. Chaque module déclare dans `server.cfg` une ligne `Certification "<IP>", <port>` : **32001** pour GlobalManager (cert entrante), **32000** pour Gateway/Download/Farm/MachineManager, **32004** pour AgentServer/SR_GameServer/SR_ShardManager (S2).
3. Le MachineManager enregistre les **machines** (`operation_type 22`) et rattache les **processus** (`operation_type 17`) — un module non déclaré dans `srNodeType.ini` ne peut pas se certifier ; erreur type : « **Cannot certify server body [IP]** » (S6).
4. La certification **lit l'IP de la première carte réseau** — les adaptateurs virtuels (Hamachi/VMware) la cassent (S1, S6) ; l'outil **`srPatcher_1.0.6`** (« wrote spoof ip ») réécrit les IP des modules (S6).
5. Le GlobalManager affiche « **Max User Count Restriction Per IP : system default(infinite)** » — la limite de connexions par IP est un réglage officiel du GlobalManager (S6).

---

## 🔌 3. Ports réseau complets

Synthèse croisée S11-S14 + S2 + S6 (rôles confirmés par les logs d'erreurs) :

| Port | Rôle | Source du rôle |
|---|---|---|
| **15779** | **GatewayServer** — premier point d'entrée client (« identification ») | S11, S13, S14 |
| **15880** | **AgentServer** — traffic de jeu (« login » ; erreurs keepalive « cannot establish keep alive session: IP:15880 ») | S11, S6 |
| **15884** | port de jeu recommandé ouvert en durcissement vsro.org (rôle exact : selon repacks, AgentServer/DownloadServer) | S14 |
| **15882 / 15883 / 15885** | services additionnels (modules internes selon repacks) | S12 |
| **25880** | **MachineManager** (log « server cord established : 10 (IP:25880) ») | S6 |
| **32000** | **Certification Manager** (+ Gateway/Download/Farm/Machine certifications) | S1, S2 |
| **32001 / 32004** | ports de certification GlobalManager / Agent+GameServer+ShardManager | S2 |
| **8080 / 80 / 1337** | serveur web/billing (BILLING_SERVER_URL) | S2, S1 |
| **1433 (MSSQL), 3306, 445, 8010** | base de données / interne — **à fermer au public** | S12 |
| **21 (FTP crest)** | CREST_FTP_URL (blasons de guildes) | S2 |

Conseil de durcissement communautaire (S14) : n'exposer publiquement que **15779 + 15884**, tout le reste en interne. Les DownloadServer/Gateway/Agent doivent être ouverts en TCP uniquement (S11).

---

## 🎮 4. Gestion en jeu — commandes GM complètes

> 📌 Sources : thread RaGEZONE « GM Commands » (S4) — dont plusieurs posts de **Chern0byl, le leaker lui-même** (fiabilité 5) — complété par r10dev (S5) et elitepvpers (S7).

### 4.1 Accès GM

- Niveau GM = colonnes **`sec_primary`/`sec_content` de `TB_User`** (`SRO_VT_ACCOUNT`) — « if you don't set this, no GM features » (S1). Le GM active la console en jeu via la touche entrée + commandes `/`.
- **F1 = liste des commandes, F2 = liste des monstres, F3 = liste des items** dans le client GM (S4).

### 4.2 La liste (syntaxe exacte des sources)

| Commande | Effet documenté | Source |
|---|---|---|
| `/makeitem <ITEM> <plus> <nombre>` | créer un item (ex `/makeitem ITEM_CH_BOW_11_A_RARE 10 1`) ; aussi via SQL `EXEC _ADD_ITEM_EXTERN @CharName,'ITEM_ETC_AVATAR_M_GM_UNIFORM',1,250` | S4, S41 |
| `/loadmonster <MOB> <nombre>` | spawner N monstres (ex `MOB_RM_ROC` — le Roc !) | S4 |
| `/zoe <MOB> <nombre>` | spawner **et tuer** N fois le monstre → drop items + EXP + SP (« pure GM greed plugin » — Chern0byl) | S4 |
| `/zoe2 <MOB> <nombre>` | variante : **drops seulement**, sans EXP | S4 |
| `/mobkill [0]` | tue le mob sélectionné ; `/mobkill 0` = le tuer **avec EXP et récompenses** | S4, S5 |
| `/recalluser <joueur>` | téléporte le joueur vers le GM | S5, S7 |
| `/movetouser <joueur>` | téléporte le GM vers le joueur | S5 |
| `/gotown` | téléporte au retour ville le plus proche | S5, S7 |
| `/warp <X> <Y>` | téléport visuel aux coordonnées | S5 |
| `/ban <char>` | **⚠️ ne fait que kicker/déconnecter** (pas un vrai ban) | S4, S66 |
| `/bansel` | ban de la cible sélectionnée (comportement réel = kick, cf. ci-dessus) | S4 |
| `/invisible` | mode GM invisible | S5 |
| `/invincible` | mode invincible | S5 |
| `/snow` | déclenche la neige | S4, S5 |
| `/rain` | déclenche la pluie | S4, S5 |
| `/sky <mode>` | change le ciel | S4 |
| `/gachastart` | démarre le système Magic POP | S5 |
| `/spawnunique_all` | fait spawner tous les uniques (liste « Titan uniques ») | S5, S7 |
| `/addwp`, `/showwp`, `/delwp` | ajoute/affiche/supprime un waypoint | S4 |
| `/wp <id>` | va au waypoint | S4 |
| `/liner_draw` | dessin de ligne (debug/édit) | S4 |
| `/gmskill 0` | retire les skills GM | S4 |
| `/setspeed <valeur>` | vitesse de déplacement | S4 |
| `/hwanmode` | mode Zerk forcé | S4 |
| `/day` / `/night` | force le jour/la nuit | S4 |
| `/zoom` | zoom caméra illimité | S4, S5 |
| `/ground` | change l'état du sol (debug) | S4, S7 |
| `/camera` | mode caméra libre | S4 |
| `/frame` | affiche les FPS/frames | S4 |
| `/char` | infos personnage | S4, S7 |
| `/chatclear` | vide le chat | S4 |
| `/window` | ? (fenêtre de debug) | S4 |
| `/mapobj` | affiche les objets de la carte (debug) | S4 |
| `/getcurpos` | renvoie la position actuelle (région + X/Y/Z) — utilisé pour créer des spawns | S4 |
| `/setspeed`, `/worldstatus`, `/setoptimizecloth`, `/recallguild`, `/screenshotfull`, `/cursor` | divers (vitesse, statut monde, optimisation des habits GM, rappel de guilde, capture plein écran, curseur) | S4, S5 |
| `/disconnect` (phBot n'est pas GM) — côté GM : kick via `/ban` | — | S66 |

**Silk/notes** : donner du silk ne passe PAS par une commande GM mais par SQL — **`SK_Silk` dans `SRO_VT_ACCOUNT`** (JID = ID de compte de `TB_User`) (S4). C'est ce que font tous les panels web (S57, S62).

### 4.3 Actions temps réel sans commande : `vSRO-ServerAddon` (S50)

DLL MIT injectée via **Stud_PE** (import DLL dans SR_GameServer.exe/SR_ShardManager.exe) — **19 actions documentées**, déclenchées par INSERT SQL dans `SRO_VT_SHARD.dbo._ExeGameServer` (table auto-créée) : give item (stats aléatoires, plus), ±gold, set Hwan, téléport (position/gameworld), drop près du joueur, transformer un slot d'inventaire, forcer reload joueur, buff persistant (survit aux téléports), spawn mob, body state (Berserk/Untouchable/GM Invisible/Stealth), +SP, grant name de guilde, life state, +EXP, +SP EXP, cape PVP (None/Red/Gray/Blue/White/Yellow), réduire HP/MP. Codes résultat : `SUCCESS=1`, `CHARNAME_NOT_FOUND=5`… — **architecture officielle détournée en file de commandes SQL**.

---

## 🧰 5. Outils d'administration tiers et panels web

| Outil | Nature | Fonctions | Source |
|---|---|---|---|
| **MiniTools v10** | suite Windows vSRO | Account Silk Adder par JID, correctif « Couldn't connect to SMC », utilitaires SQL | S57 |
| **MGProjects vSRO GM Tool v4.1** | GUI GM | téléport (region,X,Y,Z), spawn d'items sans commande, event/spawn manager | S58 |
| **SilkPanel CMS** | site + panel (iSRO & vSRO) | centre de contrôle modulaire ; doc officielle | S59 |
| **isro-cms** (GitHub, open source) | CMS PHP | rankings, panel admin (dark mode) | S60 |
| **PurePanel Free** | panel PHP, 8 thèmes | panel vSRO standard (utilisé par Archera Online, ExSRO) | S61 |
| **SRO Web Panel (Blazor .NET 8)** | panel web | **add silk, ban users** via interfaces | S62 |
| **iSRO Portal CMS v2** | CMS | « 300 % faster, fully cached, no direct DB requests », rankings étendus | recherche §5 (epvp 5174363) |

---

## 🗄️ 6. DB métier — procédures stockées, tables live, logs

### 6.1 Procédures stockées notables (rôles documentés)

| Procédure | Base | Rôle | Usages communautaires documentés |
|---|---|---|---|
| **`_AddLogItem`** | **SRO_VT_SHARDLOG** | **hook universel des événements d'items** — appelée par le GameServer à chaque événement d'item ; signature `(CharID int, ItemRefID int, ItemSerial bigint, dwData int, strSecNo varchar(1)…)`. ⚠️ `@Operation = 41` = **consommation d'item** — c'est le déclencheur standard des scrolls customs. **Condition : le GameServer doit écrire dans SHARDLOG** sinon rien ne se déclenche | Mercenary Scroll (`ItemRefID between 47023-47037`), skill/stat reset scrolls, model switcher (`EXEC SRO_VT_SHARDLOG.dbo._NOVA_SWITCHER`), **Plus Auto Notice** (notice globale lors d'un +N réussi) | S43, S44, S45, S48, S49, S42 |
| **`_AddTimedJob`** | SRO_VT_SHARD | écrit les **effets temporisés** (buffs, penalties, jobs) — table `_TimedJob`. La table sert aussi de **garbage des buffs premium** : « remove premium : DELETE FROM _TimedJob WHERE CharID=… ». **JobID 1 = penalty de guilde, JobID 2 = penalty de job** — les privés la patchent (`if (@JobID=1 or @JobID=2) return -1`) pour supprimer les délais de sortie | S46, S41, S47 |
| **`_AddTimedJobForPet`** | SRO_VT_SHARD | variante pour COS/pets — ex d'inv étendue : `_AddTimedJobForPet @COS_ID,5,22926,1992999999…` (112 ou 196 slots) | S41 |
| **`_AddNewCOS`** | SRO_VT_SHARD | création de pet/COS — modifiée pour l'inventaire 5/7 pages (`@MaxInventorySize`) | S41 |
| **`_ADD_ITEM_EXTERN`** | SRO_VT_SHARD | donner un item à un perso par nom + CodeName + quantité + durabilité (ex avatar GM) | S41 |
| **`_SEEK_N_DESTROY_ITEM`** | SRO_VT_SHARD | détruire un item chez tous les joueurs (`_RefObjCommon`↔`_Items`) | S41 |
| **`_Guild_Create`** / **`_Guild_FnAddMember`** | SRO_VT_SHARD | création/ajout membre de guilde — patchées pour guilde niveau 5 d'office, limite de membres (`@LiMiT 24`), union élargie (5 guildes factices `guildname_ULimit_1..5`) | S41 |
| **`_ManageShardCharName`** | SRO_VT_SHARD | gestion des noms de persos — **jobs 0/1/2 = ajout/suppression/renommage** ; s'appuie sur **`SR_CharAppoint`** (table manquante dans la DB par défaut → erreur au premier renommage) | S6 |
| **`_TRAINING_CAMP_UPDATEHONORRANK`** | SRO_VT_SHARD | recalcule les **honor ranks** d'académie (rangs 1-50 de `_TrainingCampHonorRank`) | S41 |
| **`_GetMediaLines`** (créée par la communauté) | SRO_VT_SHARD | **exporte les lignes DB au format textdata client** (Type 1 = items, Type 2 = characters) — l'outil maison de synchro DB→PK2 | S41 |

### 6.2 Tables live et constantes métier (via requêtes documentées S41)

- **`_Char`** : `InventorySize` **max 109** slots ; `DailyPK/TotalPK/PKPenaltyPoint` (remise à zéro = « remove PK ») ; `RemainHwanCount` (5 charges Zerk) ; `HWANLevel` (titre) ; `PosX/PosY/PosZ/LatestRegion/WorldID` (téléport de masse).
- **`SK_Silk`** (ACCOUNT) : silk par compte (JID) ; `silk_own`.
- **`_Punishment` + `_BlockedUser`** : le ban SQL (via `_Char → _User → TB_User`).
- **`_CharSkillMastery`** (mastery à 120) / **`_CharSkill`** (skills GM CH = série d'INSERT hardcodés).
- **`_ItemQuotation`** (`BaseQuot`, `Quot_LB/UB`) : **les cotations de l'économie de trade** — modifiables pour « job gold rate ».
- **`_TrainingCamp`/`_TrainingCampMember`** : buffs d'académie (HonorPoint = diplômés × 39).
- **`_RefGachaItemSet`** (`Ratio`) : taux Magic Pop.
- **SHARD_LOG (purge)** : `_LogCashItem`, `_LogEventChar`, `_LogEventItem`… — la famille des tables de logs d'événements (S41, cf. schémas ducksoup déjà dans la KB).

---

## ⚗️ 7. Alchimie et drops : servis côté serveur

- **Alchimie** : les taux ne sont PAS côté client — ils vivent dans **`_RefObjItem.Param2/3/4`** (octets unpackés : élixirs 50/40/30/19/17/12, powder +50/30/20/8/8 — déjà KB, confirmé par la pratique : « Alchemy rate 1.5x = UPDATE Param2/3/4 pour les IDs 2033-2044 ; Lucky powder = IDs 2033-2054 ; pierres d'attr = Param4, IDs 4630-5013 » — S41). **Le roll d'alchimie est donc serveur**, piloté par la DB ; le client n'affiche que le résultat (la logique décompilée du gameserver est documentée dans **opensro**, déjà sourcé par la KB).
- **Drops** : couches serveur — `_RefDropClassSel_Equip/_RareEquip` (probability groups « ProbGroup1-31 » ; le facteur SoX de base **14,99** en RareEquip, déjà KB) × `_RefDropItemAssign`/`_RefDropItemGroup` × **`_RefMonster_AssignedItemDrop`** (couche bonus par monstre — « add drop to unique » = INSERT avec ratio). Le taux global reste `DropItemRatio` (config) — S41 + PS_FILES.
- **Uniques customs** : « mob → unique » = `UPDATE _RefObjCommon SET Rarity = 3` ; déplacer un spawn d'unique = `UPDATE Tab_RefTactics SET dwObjID` ; ajouter un spot = INSERT `Tab_RefTactics`/`Tab_RefHive`/`Tab_RefNest` aux coordonnées du GM (`/getcurpos`) ; timer = `dwDelayTimeMin/Max` (S41 — cohérent avec la KB).
- **Niveau/HP des mobs** : `UPDATE _RefObjChar SET Lvl, ExpToGive, MaxHP` — **« capped at 120 »** (S41) : autre manifestation de la limite 120 de la 1.188.

---

## 🔧 8. Modding communautaire vSRO (rétrofits, zones, uniques, limites)

### 8.1 Le rétrofit « 1.188 plus » (contenu KSRO/D12 réinjecté)

Déjà couvert dans [RESEARCH_PS_FILES.md §7](RESEARCH_PS_FILES.md) (méthode PK2 Extractor → itemdata/skilldata → SQL → server_dep ; packs D12 Jupiter). **Compléments nouveaux** :
- **Skill 120 + mobs Jupiter** : « Enable 120 skills » = longues séries `UPDATE _RefSkill SET Service=1` sur plages d'IDs ; « Enable Dg12/Dg13 items » = UPDATE des flags `Service` d'`_RefObjCommon` en déselectionnant des plages (S41).
- **Retroport de mécaniques iSRO récentes vers 1.188** : « Fellows + Pet Update (vSRO 1.188) » = fellows/debuffs iSRO portés (S77) ; patch multilingue/anglais des files (S76).
- **Limites « Joymax » contournées par patch binaire** (S10, S55, S23-PS_FILES) : séparation EXP/SP (floats de SR_GameServer.exe), caps mastery/level (OllyDbg), anti-crash > lvl 110, `GiantMonster_SpawnRatio` 14 %.

### 8.2 Nouvelles zones via `_RefRegion` (workflow documenté)

1. Extraire le dossier **`server_dep`** d'un client iSRO (ou tout client ayant la zone) ;
2. Ouvrir **`RefRegion.txt`** (textdata) et recopier les lignes des régions ;
3. INSERT correspondant dans **`_RefRegion`** (DB) + `_RefRegionBindAssocServer` (activer sur un GS) ;
4. **World ID 1 = carte non instanciée** ; `AreaName` de `_RefRegion` contrôle le nom affiché ;
5. Outil moderne : **Etherial Editor** (S53) — crée/clone des régions, génère les minimaps, active `_RefRegion` côté client+DB.
   Sources : S52, S54, S53.

### 8.3 NPC/boutiques/téléports customs (S41)

- **Nouveau NPC marchand** : INSERT dans `_RefObjCommon`, `_RefObjChar`, `_RefShop`, `_RefShopGroup`, `_RefShopItemGroup`, `_RefShopTab`, `_RefShopTabGroup`, `_RefMappingShopGroup`, `_RefMappingShopWithTab`, `Tab_RefTactics/Hive/Nest` **+ lignes à ajouter dans characterdata_45000 & refshop*.txt du client** (la requête SQL « imprime » les lignes à copier).
- **Téléport custom** : INSERT `_RefObjCommon`, `_RefObjStruct`, `_RefTeleport`, `_RefTeleLink` + teleportbuilding.txt / teleportdata.txt / teleportlink.txt côté client.
- **Synchro DB↔client** : **SR_Db2Media** (S51) extrait les données DB, chiffre les .enc (skilldata) et importe directement dans Media.pk2 — l'outil qui matérialise le principe « le client doit refléter la DB ».

---

## 🐞 9. Bugs connus de la 1.188 et leurs fixes

Du **Error Thread + Solution Collection** (S6) et des recueils (S41, S56) — sélection des plus significatifs :

| Bug/symptôme | Cause | Fix documenté |
|---|---|---|
| « servers are offline » au login depuis la même machine que le serveur | la stack complète sur une seule machine + client sans loader | utiliser un **loader client sans XTrap** (« make sure you are using agent server no xtrap ») |
| GameServer « Cannot certify server body [IP] » | certification lit la mauvaise carte réseau (virtuelle) | `srPatcher_1.0.6` (spoof IP) / désactiver les adaptateurs virtuels |
| Premier renommage/création de perso en erreur | **table `SR_CharAppoint` absente** de la DB par défaut + procédure `_ManageShardCharName` | créer la table / vérifier la procédure |
| Crash « Quest:RaiseEvent » au premier login | quête tutorielle `QTUTORIAL_CH` mal initialisée | `UPDATE _RefCharDefault_Quest SET Service=1 WHERE ID=14` ; ou alternative `UPDATE _RefQuest SET Service=0 WHERE CodeName='QTUTORIAL_CH'` (S41 : fix F1 = DELETE/re-INSERT QuestID 1 dans `_CharQuest`) |
| « CLAMP() ==> mine(###) exceeded max (###) » sur le shard | **paie hebdo de trade > 2,1 Md** (dépassement int) | « redesign » de la table → les privés plafonnent les gains |
| « Temple : Reputation Check Faild ! - CShardSJ_TempleOfAnubisAndIsisGate » | Gate du Temple Anubis/Isis (Job Temple) | erreur récurrente documentée, contournée par config/régions |
| « BillingServer is Dead!! » → ShardManager ferme | billing ASP/IIS injoignable (URL de `server.cfg`) | corriger `BILLING_SERVER_URL` / héberger les scripts ASP |
| AgentServer « WARNING! A SUSPECT DETECTED!!! MsgID[0x6102] » | **détection interne de client suspect** (contrôle d'intégrité du flux client) | rejeté par les privés comme faux positif des bots/loaders |
| GlobalManager « Max User Count Restriction Per IP : system default(infinite) » | limite IP non configurée | règle officielle du GlobalManager (S6) |
| « ShardManager is blind : 0 users are banned » | états de ban non synchronisés | cosmétique |
| FarmManager faux positifs / « Token Timeout » | timings de certification | réordonner le démarrage (S6) |
| Attaque/pick pet qui ne réagit pas | bug 1.188 classique | guide « How to Fix Attack/Pick Pet Bug » (index epvp — S56) |

---

## 🐯 10. BlackRogue en détail (BR110/BR120)

> Origine (rappel, déjà établi dans la KB) : service officiel **thaïlandais ini3** (`blackrogue.in`) — le package BR120 = `SRO_Thailand_CS_106.zip`.

### 10.1 Contenu exact du package BR120 (S20 — release MeGaMaX 07/2016)

- Archive **42 136 640 octets**, `MD5 A2FF18A325A55527533B8B72B1C6630D`, `SHA-1 F8D1FB26A11EE8B9BC7482CCFEDEA284D39E78C6` (« check before you extract »).
- **« The update package was the latest that was sent to Thailand publisher »** : c'est un **package de mise à jour officiel** (pas les files complètes) — dossiers **`Config/`, `InitialDB/` (shard DB initiale), `Query/`, `ServerBinary/`, `SMC/`** ; binaires **AgentServer.exe, GlobalManager.exe, SR_GameServer.exe, SR_ShardManager.exe + SRCommonDataLoader.dll** (ni MachineManager ni FarmManager dans ce package update) ; **cap 120, D12** (Jupiter).
- **État brut** : DB de comptes **à reconstruire**, **procédures stockées manquantes** dans la shard DB (le releaseur liste le travail restant).
- **Client** : `blackrogue_thailand_official_v1.040.exe` (existe aussi en v1.027) ; le client BR est « packed » ; workaround documenté : **client vSRO 120 cap clean + dossier `server_dep` + exes sro_client BR** (archive.org ~8 Mo) ; question ouverte dans le thread : « 11D BR client have new job? » (système de job de l'ère BR = à confirmer).
- Commentaire de SnapPop : « **hacked ini3 before they closed** » — cohérent avec l'origine ini3.

### 10.2 Différences structurelles BR vs vSRO 1.188

| Aspect | vSRO 1.188 | BlackRogue | Source |
|---|---|---|---|
| **Où sont les rates** | `server.cfg` (SR_GameServer) | **hardcodés dans les binaires SR_ShardManager ET SR_GameServer** — « Blackrogue rates hidden in shardmanager and gameserver. On vsro only in gameserver. But the way is the same, edit the 100 » ; des SR_ShardManager pré-patchés circulent (Exp Rate / Party Exp / Extra Exp) | S15, S16 |
| **Offsets binaires** | recensés par des années d'outillage | **différents** → « almost all offsets of the regular vSRO files have been listed [mais pas BR] » — tout est à refaire | S19 |
| **Contenu natif** | cap 110/D11 (Alexandrie/Job Temple) ; D12 = rétrofit | **BR110 : cap 110 natif ; BR120 : cap 120/D12 natif** (Jupiter inclus) | S17, S20 |
| **Stabilité/écosystème** | « clean, bugless », exchange/avatars/pets OK, 90 % des outils/guides ciblent 1.188 | moins supporté, plus de bugs, scripts vSRO à adapter | S17, S18 |
| **Préférence communautaire** | majoritaire | « original BlackRogue files » appréciés quand bien faits (lag-free, silk rates propres) — niche | S17 |

**Pourquoi certains le préfèrent** : contenu 110/120 **natif** (pas de bricolage de rétrofit), systèmes de l'ère 2012 (question du « new job system »), et l'authenticité « files officielles thaï ». **Coût** : tout l'outillage vSRO (offsets, filtres, mods SQL écrits pour 1.188) doit être adapté (S17-S19).

---

## 🇰🇷 11. Clients KSRO vs vSRO — la Corée comme pipeline de données

- **KSRO en avance** : Joymax teste et déploie d'abord en Corée — « KSRO has run the full Revolution update line like iSRO-R, but more advanced » (S72) ; D14 annoncé dans les « 2014 update plans » côté asiatique (26/02/2014, S73) pendant qu'iSRO suit avec des semaines à des mois de retard (S72, S74). La KB a déjà établi la chronologie D12→D15 (voir [39_PRIVATE_SERVERS.md](../39_PRIVATE_SERVERS.md)) : c'est **ce décalage qui rend le client KSRO précieux**.
- **Le client KSRO comme banque de données** : la méthode de rétrofit (extraire `itemdata.txt`/`skilldata*.txt`/`characterdata.txt` du Media.pk2 KR, format stable « ~2 colonnes d'écart » entre versions, INSERT SQL côté 1.188, recâbler les drops) est documentée dans [RESEARCH_PS_FILES.md §7](RESEARCH_PS_FILES.md) (S28/S27 de ce rapport). Les skilldatas 1.193 contenaient déjà les **skills des mobs Jupiter 110-120** (S16-PS_FILES).
- **Archives de clients** : l'elitepvpers **Silkroad Online Client Archive** (~4 ans de clients historiques — S71) et le fan-wiki silkroadonline.wiki (client v1_657 : 42 532 records / 8 387 monstres / 21 490 items) fournissent les snapshots de données par époque.
- **iSRO/KSRO fuitées** (cap 125/14DG, serveur Zyain) = l'aboutissement de ce pipeline : les files elles-mêmes, plus seulement les clients (déjà documenté KB).

---

## 🧭 12. Émulateurs open source — inventaire et apport pour SRObro

> Contexte déjà couvert : histoire sremu/csremu et comparatif files-vs-émulateurs dans [fr/PRIVATE_SERVERS_ANALYSIS.md](../../fr/PRIVATE_SERVERS_ANALYSIS.md) (Phoenix, SilkroadProject, DarkEmu, interfaces web). Ce rapport apporte l'état 2026 vérifié sur GitHub/GitLab + opensro.

| Projet | Langue/Plateforme | Cible | Ce qui est implémenté (documenté) | Licence | Statut 2026 |
|---|---|---|---|---|---|
| **[opensro](https://github.com/opensro-dev/opensro)** ⭐ | **Go + client navigateur WebGPU (TypeScript/Vite)** | **v1.150 (Legend III)** | Packages game : `abnormal` (buffs/debuffs), `action` (dont **potionrecovery/potionamount** — formules officielles décompilées, déjà utilisées par la KB), `combat`, `enterworld`, **`gmcommand`** (commandes GM réimplémentées !), `item` (**alchemy/** — logique d'alchimie, déjà KB), `linkedpulse`, `paramkeeper`, `progression`, `quest`, `restriction`, `siege`, `social`, `world` ; + **asset pipeline** (client licencié → données), observatoire d'ops, Nomad jobs | **AGPL-3.0-or-later** (NOTICE.md : aucun média du jeu commité) | actif, 94 commits |
| **go-sro-agent-server** (+ go-sro-framework, go-sro-fileutils) | Go | **files vSRO 1.88** | lobby perso (création/suppression/entrée), mouvement click + collision terrain (« object collision almost perfect »), **spawn/despawn par range** (objets/joueurs/monstres/NPC), chat complet + notices + commandes GM custom, party + **party matching**, inventaire (équiper/déplacer), **stalls** ; navmesh + viewer raylib ; Docker | DBAD (« Don't Be A Dick ») | **archivé 10/2022** |
| **SilkroadProject** (tanisman) | C# (VS2015, Asio 1.10.6, MSSQL 2008+) | client **Open Beta** | GatewayServer/SR_GameServer/SCore/SCommon ; DB `_ServerConfig` ; client via GATEIP.txt/DIVISIONINFO.txt dans Media.pk2 ; contribution guide (async Tasks, Interlocked, « prevent deadlocks ») | non spécifiée | 6 commits, dormant |
| **DarkEmu** (CarlosX) | C++ | — | lignée **csremu/sremu/sro-emulator/srevolution**, base **MaNGOS** (« Massive Network Game Object Server ») | **GPLv2** | dormant |
| **skrillax** (kumpelblase2) | **Rust/ECS** | — | émulateur d'apprentissage ( exploration Rust/ECS/lifetimes) ; écosystème skrillax-dev (patch server iSRO) | — | learning project |
| **Phoenix** (RaGEZONE 1159736) | C#/.NET Core | — | (déjà documenté dans fr/PRIVATE_SERVERS_ANALYSIS.md) | — | — |
| **SilkroadEmulator** (OmarKholyo) / **ClowenEmulationOpenSourceProject** (Sinien) | — | **v1.315-v1.323 (2015)** | files serveur de cette ère | — | dépôts communautaires |
| **sro-server-emu** (SourceForge) | — | — | projet historique | open source | ancien |
| **JaveQ** | — | — | émulateur open source historique (thread 2009 silkroadforums) | — | mort |
| **silkroad-emulator** (Demircivi) | C# | — | listener + packet reader/writer | — | ébauche |

### Pourquoi c'est utile pour SRObro

1. **opensro est LA meilleure source de formules serveur open source** : c'est un portage **décompilé** du comportement serveur (alchimie : destruction dès +5 = 50/50 ; potions : formule de récupération exacte — déjà intégrés à [05_ALCHEMY_SYSTEM.md](../05_ALCHEMY_SYSTEM.md) et [21_CONSUMABLES.md](../21_CONSUMABLES.md)). Les packages `gmcommand`, `combat`, `progression`, `siege`, `quest` sont des candidats directs pour documenter ces systèmes côté SRObro.
2. **AGPL-3.0** (opensro) : compatible avec un usage **référence/lecture** ; toute réutilisation de code impose les termes AGPL — la KB n'utilise que des valeurs/faits, pas du code.
3. **go-sro-agent-server** documente le **spawn par range** et la **party matching** vSRO en code lisible ; **SilkroadProject** documente la séparation Gateway/Game et l'édition client (GATEIP/DIVISIONINFO) ; **DarkEmu** prouve la filiation MaNGOS de toute la première génération.
4. ⚠️ **« cfemu » introuvable** : aucune trace d'un émulateur Silkroad nommé « cfemu » (recherches dédiées vides) — probablement confusion ou projet privé/disparu (voir §15).

---

## 🛡️ 13. Anti-cheat officiel — historique et modèle de sécurité

### 13.1 Chronologie des protections client (iSRO + vSRO)

| Période | Protection | Preuves |
|---|---|---|
| **2005-2007** | **nProtect GameGuard** (INCA Internet) — dossier `GameGuard/` dans `C:/Program Files/Silkroad/`, erreurs 340/350/360 au lancement, contournements « renommer GameGuard en GameGuar2 » | S33, S34, S35, S36 |
| **~2008-2009 →** | **HackShield** (AhnLab) remplace GameGuard sur iSRO ; **mise à jour officielle annoncée avec Legend V Plus Battle Arena (08/2010)** : « introduces a new update to the game's HackShield anti-cheat system » | S37 (annonce officielle GamesIndustry.biz) |
| **2011 (vSRO 1.188)** | **XTrap** — le leaker a publié avec les files les **« Xtrap update files »** ; le client 1.188 demande XTrap au lancement (« using agent server no xtrap » = loader sans XTrap) ; bypass documentés : outil « select 1.188 → remove XTrap », ou **serveur XTrap custom via `silkload.dat`** (IP + chiffrement à reverser) | S1, S38, S39, S40 |
| Layer réseau (toutes époques) | **Handshake + security bytes + Blowfish** (voir 13.2) — indépendant du choix GameGuard/HackShield/XTrap | S30 |

### 13.2 Le modèle de sécurité réseau (SilkroadDoc — S30)

- **Header fixe de 6 octets** : Size (2) · Opcode (2) · **SecurityCount (1)** · **SecurityCRC (1)** ; jusqu'à 8 186 octets de données ; count/CRC ne sont posés **que par le client** et vérifiés par le serveur (mismatch = déconnexion).
- **Handshake opcode 0x5000** : 4 paquets ; le setup serveur (flag **0x0E** = sécurité complète : Blowfish + handshake + count + security bytes) contient clé Blowfish initiale, seeds count/CRC et **5 seeds de handshake** ; le client dérive sa clé via un XOR + une transform modulaire 64 bits ; échec client = « **Handshake ServerSignature Error** » ; acceptation = paquet 0x9000.
- **Chiffrement Blowfish sélectif** : un paquet chiffré porte le **bit 0x8000 dans le champ Size** (jamais chiffré lui-même) ; déchiffrement à partir de l'octet 2, sur Size+4 octets ; padding possible (blocs de 8).
- **Security bytes** : le byte de count (empêche l'injection/suppression de paquets) et le byte de CRC (table de lookup + seedCRC, empêche la falsification) — travaux jMerlin/clearscreen, articles florian0.

### 13.3 Ce que les files serveur révèlent de la défense officielle

- **`AgentServer` log « WARNING! A SUSPECT DETECTED!!! MsgID[0x6102] »** : le serveur **détecte et rejette un client suspect** par MsgID — une sonde d'intégrité côté serveur, pas seulement client (S6).
- **`AutomatedPunisher`** (GlobalManager) : blocage automatique après N échecs de login/CAPTCHA (`LoginFailureTolerance 3`, `IBUVFailureTolerance 3`, `BlockTimeMin 10`, messages d'avertissement configurés) (S2).
- **CAPTCHA IBUV** : file de 20 000 images, codes de 6 caractères, tolérance par IP = 0 par défaut, alphabet « ABCDEFGHLMNQRTabdehimn2345678 » (S2) — le mur anti-bot du login officiel.
- **Ban/punition** : tables `_Punishment`/`_BlockedUser`, module SMC `SR_UserPunishment`, IPBlock (`ipblock.dll`), limite de users par IP du GlobalManager (S2, S4, S41, S6).

---

## 🤖 14. Les bots comme documentation du jeu

Les grands bots sont des **bases de connaissances vérifiées** sur le jeu officiel — leurs configs/scripts encodent des données mesurées :

### phBot (doc officielle guide.phbot.org — S31, S32)
- **~35 commandes de script documentées** (case-sensitive, paramètres séparés par virgules) : `walk,[region,]x,y,z` (le paramètre région n'est requis **que dans les grottes** — documente le système de coordonnées des donjons), `teleport,source,destination` (ex `teleport,Jangan,Donwhang` = **le graphe officiel des téléports NPC**), `cast,skill` (matching exact puis flou), `use,returnscroll`, `DoBlacksmith/DoHerbalist/DoStable/DoStorage/DoGuildStorage/DoGroceryTrader/DoProtectorTrader/**DoJupiter**` (le Jupiter Temple a un **NPC combiné forgeron+herboriste** — détail d'architecture du contenu !), `DoConsignment/DoStall` (consignation/stalls), `mount,fellow|transport`, `killhorse`, `terminate`, `dismount`, `recall` (rappel du pick pet), `quest,npc,quest name,[safe|danger]` (noms exacts des NPC + quêtes répétables ; `safe/danger` = variantes de quêtes de job), `begintargettrading`/`settletargettrading` (**nouveau système de trade cible iSRO/SilkroadR**), **`oldtrade,spawn|buy|sell`** (**ancien système vSRO** : `oldtrade,buy,star|quantity` — 0 = remplir le transport, 1-5 = nombre d'étoiles, >5 = quantité exacte → **les deux systèmes de job co-documentés dans un seul bot**), `styria` (inscription Styria), `stop`, `disconnect` (utile pour **rafraîchir le classement de trade** — mécanique officielle), `profile,name`.
- La **boucle Trade** (S32) : enregistrer un script → spawn du transport → achat → marche vers l'autre ville → vente → `killhorse` → return scroll — **une route de trade officielle complète encodée en coordonnées**.

### SBot (S67, S68) — alarmes de spawn d'uniques (« Never miss a unique again » : le bot **joue une alarme** au spawn — implique une détection réseau du spawn, opcode 0x300C côté phBot), auto-party (accept/join), auto-res, auto-lure warrior, Auto Stall (changelog officiel bot-cave).

### mBot (S69, S70) — **mode clientless** (bot sans client = la stack réseau complète du jeu réimplémentée), leveling/gold/quests automatiques, trade automatisé (tuto vidéo officiel).

### RSBot (déjà KB) et **Lobot** (S29, GitLab) — bot « light » pour privés **VSRO 1.188**, portage du projet Windows d'opport — utile comme code de lecture des packets 1.188.

**Valeur documentaire** : les scripts/coords de walk = données de monde ; les téléports source→destination = graphe officiel ; les noms NPC/quests = contenu ; les commandes oldtrade/targettrading = **généalogie des systèmes de job** ; les alarmes d'uniques = opcodes de spawn.

---

## ⚠️ 15. Incertitudes restantes

1. **Unités des rates (`ExpRatio` 100 vs 1000)** : les deux conventions coexistent dans les sources (dump réel vs guides) — à trancher par mesure. Les clés `DropItemRatio`/`DropGoldAmountCoef` apparaissent comme des coefficients décimaux (0,1) dans le dump, ce qui plaide pour le modèle « pourcentage/décimal » sur 1.188 — non confirmé.
2. **`cfemu`** : aucun projet de ce nom trouvé — probablement une confusion (cf. §12).
3. **Rôles exacts des ports 15882/15883/15884/15885** : rôles variables selon les repacks ; seuls 15779 (gateway), 15880 (agent), 25880 (machinemanager), 32000 (certification) sont fermement attestés.
4. **Contenu BR110 exact** (« new job system » inclus ou non) : question posée dans le thread BR120 sans réponse définitive.
5. **SMC exhaustif** : aucune capture/galerie publique des écrans SMC (fees par serveur, monitoring détaillé) — les modules connus sont UserControl/IPBlock/SR_UserPunishment + Server Control ; d'autres onglets existent probablement.
6. **`u1`-`u7` de `srShard.ini`** : sémantique inconnue (valeurs 240/208/17/1/0/0/0).
7. **Ce que détecte exactement MsgID 0x6102** (AgentServer « SUSPECT DETECTED ») : mécanisme interne non documenté.
8. **`HourForMeterRateLevelFirst/Second`** : interprétation « heures pleines » plausible mais non attestée.

---

## 🎯 16. Recommandations pour SRObro

1. **Intégrer le `server.cfg` complet (§1.1) à la spec technique** : c'est la matrice de configuration officielle du jeu — IBUV (CAPTCHA), AutomatedPunisher, fee rates 5 %/10 %, flags d'événements, Battle Arena — directement transposable en paramètres serveur SRObro.
2. **Consulter le package `gmcommand` d'opensro** pour l'implémentation des commandes GM (le thread RaGEzone S4 + opensro couvrent le même domaine de deux côtés : usage réel et code décompilé).
3. **Documenter l'architecture « IBUV CAPTCHA + AutomatedPunisher + MsgID 0x6102 »** comme modèle anti-abus de référence (le trio config/serveur/réseau des §13).
4. **Pour les données 111+ et BR** : la KB a déjà la hiérarchie des DB ; le présent rapport ajoute que **BR120 est un package d'update incomplet** (DB comptes à reconstruire, procédures manquantes) — privilégier les DB vSRO 1.274/iSRO-R pour l'extraction.
5. **Les procédures `_AddLogItem` (Operation 41) / `_AddTimedJob` (JobID 1/2)** décrivent le **contrat d'interface entre le gameserver et la DB** — un pattern directement réutilisable par SRObro (hooks d'événements côté persistance).

---

## 📌 Synthèse — Top 5 découvertes

1. **Le `server.cfg` complet de la 1.188, clé par clé** (S2 — dump réel dans le thread du leaker) : Certification par module (32000/32001/32004), **IBUV = le CAPTCHA officiel de login** (file 20 000 images, codes 6 chars, tolérance par IP), **`AutomatedPunisher`** (blocage auto 10 min après 3 échecs), **`SET_FEE_RATE "0,5,5,5"` / `SELL_FEE_RATE "0,10,10,10"`** (frais d'économie officiels), flags d'événements historiques, `LOCALE LOCALE_VIETNAM`, Battle Arena/HourForMeterRate — plus `srNodeType.ini` (48 nœuds = **topologie officielle : 6 machines × 3 AgentServers × 2-3 Gateways**) et `srShard.ini` (`capacity 2300`).
2. **~40 commandes GM documentées avec leur syntaxe** (S4 — dont `/zoe <MOB> <N>` par le leaker lui-même : spawn+kill massif avec drops/EXP ; `/makeitem`, `/loadmonster MOB_RM_ROC`, F1/F2/F3 = listes) + la révélation que **`/ban` ne fait que kicker** (vrai ban = SMC `SR_UserPunishment` ou SQL `_Punishment`/`_BlockedUser`) et que le silk passe par `SK_Silk` (ACCOUNT).
3. **Le contrat DB du gameserver par les procédures stockées** (S41-S49) : **`_AddLogItem`** (SHARDLOG ; `@Operation = 41` = consommation d'item → hook universel des scrolls customs et du mod Plus Auto Notice), **`_AddTimedJob`** (effets temporisés ; JobID 1/2 = penalties guilde/job), `_AddNewCOS`/`_AddTimedJobForPet` (pets), `_Guild_Create`/`_Guild_FnAddMember` (limites), `_ADD_ITEM_EXTERN`, `_SEEK_N_DESTROY_ITEM`, `_ManageShardCharName` (jobs 0/1/2), `_GetMediaLines` (export DB→textdata client) — plus les constantes live (`InventorySize` max 109, honor rank = diplômés × 39, `_ItemQuotation` = cotations de trade).
4. **BlackRogue clarifié structurellement** (S15, S16, S19, S20) : BR120 = **package d'update officiel thaï incomplet** (hashes MD5/SHA-1 publiés ; DB comptes à reconstruire, procédures manquantes, client v1.040 packed) ; **les rates BR sont hardcodés dans SR_ShardManager ET SR_GameServer** (vs server.cfg en vSRO) ; offsets incompatibles avec l'outillage vSRO → voilà pourquoi la communauté préfère massivement la 1.188 malgré le contenu natif 110/120 de BR.
5. **L'anti-cheat officiel reconstitué de bout en bout** : GameGuard (2005-2007, dossier dans Program Files) → **HackShield dès ~2008-2009, officiellement « updated » avec Legend V Plus (08/2010)** (S37) → **XTrap dans le client vSRO 1.188** (leaker lui-même : « Xtrap update files » ; serveur custom via `silkload.dat`) — le tout adossé au modèle réseau SilkroadDoc (handshake 0x5000 à 5 seeds, security bytes count/CRC, Blowfish sélectif bit 0x8000) et aux défenses serveur des files (**MsgID 0x6102 « SUSPECT DETECTED »**, IBUV, AutomatedPunisher, limite IP du GlobalManager).

**Lacunes** : unités des rates (100 vs 1000) non tranchées ; émulateur « cfemu » introuvable ; captures complètes du SMC indisponibles ; rôles de certains ports (15882-85) variables ; sémantique de `u1-u4` (srShard.ini) et du MsgID 0x6102 inconnue ; contenu BR110 (« new job ») non confirmé.

---

*Rapport : `ML_RESEARCH/RESEARCH_VSRO_SERVER.md` · 2026-10-01 · ~26 requêtes web + 16 pages récupérées (RaGEZONE, GitHub/GitLab, guide.phbot.org, r10dev, vsro.org, TopS4A, GamesIndustry.biz, nProtect, SilkroadDoc wiki)*
*Compléments apportés à la KB via ce rapport : config serveur clé par clé (server.cfg/srNodeType.ini/srShard.ini) · SMC et certification détaillés · ports réseau · ~40 commandes GM · procédures stockées métier · modding zones/uniques · bugs 1.188 + fixes · BlackRogue structurel · émulateurs 2026 (dont opensro AGPL) · historique anti-cheat (GameGuard→HackShield→XTrap) · bots comme documentation*
