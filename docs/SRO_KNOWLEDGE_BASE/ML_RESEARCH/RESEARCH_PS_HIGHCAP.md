# 🏰 Recherche Web Exhaustive — Serveurs Privés High-Cap (120-140) & Outillage d'Extraction de Données

> **Mission :** recensement exhaustif EN ANGLAIS de la scène des serveurs privés Silkroad high-cap (cap 120-140, contenu DG12-DG13+), des données chiffrées publiées par leurs sites/wikis/trackers, et de l'outillage d'extraction de données du client (PK2, parseurs, bots, API).
> **Date :** 2026-10-01 · **Langue de recherche :** anglais · **Rapport :** français
> **Méthode :** ~30 requêtes web (WebSearch) + ~18 lectures directes de pages (WebFetch / lecteur web). Chaque donnée cite son URL. Aucune donnée inventée.
> **Règle de traçabilité :** chaque chiffre porte un marqueur **[OFFICIEL]** (donnée du jeu officiel Joymax/Wemade, mesurée ou publiée sur un canal officiel), **[OFFICIEL-DÉRIVÉ]** (donnée officielle réutilisée/republish par un tiers : tracker, PS, wiki) ou **[CUSTOM]** (contenu inventé/modifié par un serveur privé).

---

## 📋 Sommaire

1. [Index des sources](#-index-des-sources)
2. [Chronologie officielle — le socle pour distinguer officiel vs custom](#-chronologie-officielle--le-socle-pour-distinguer-officiel-vs-custom)
3. [Panorama de la scène high-cap 2011-2026](#-panorama-de-la-scène-high-cap-2011-2026)
4. [Panorama par serveur](#-panorama-par-serveur)
5. [Données chiffrées récupérées](#-données-chiffrées-récupérées)
6. [Bases d'items online](#-bases-ditems-online)
7. [Outils d'extraction de données](#-outils-dextraction-de-données)
8. [Bots, API et logs de données](#-bots-api-et-logs-de-données)
9. [Rôle des serveurs privés dans la conservation du jeu](#-rôle-des-serveurs-privés-dans-la-conservation-du-jeu)
10. [Incertitudes et pistes non résolues](#-incertitudes-et-pistes-non-résolues)
11. [Top 5 trouvailles](#-top-5-trouvailles)

---

## 🗂️ Index des sources

> Fiabilité : 1 (bruit/speculation) → 5 (donnée primaire recoupée)

### 🏆 Tier S — données primaires (canaux officiels + trackers de données)

| # | URL | Sujet | Fiabilité |
|---|-----|-------|-----------|
| S1 | https://www.m3stat.com/uniques (+ https://www.m3stat.com, /server/Minerva, /server/Palmyra) | **M3 Stats** : tracker de stats iSRO (serveurs officiels Minerva, Palmyra, etc.) — table HP/niveau des uniques y compris Kidemonas 120, Karkadann 123, Merikh 125 | **5** [OFFICIEL-DÉRIVÉ] |
| S2 | https://stats.projecthax.com | **ProjectHax Stats** : population/capacité/guildes/kills d'uniques/chat global en direct sur **26 serveurs, 8 régions** (kSRO, iSRO ×7 : Artemis, Brontes, Hebe, Hyperion, Pontus, Thanatos, Theia ; jSRO, cSROR ×7, DIGEAM, TRSRO ×4, ruSRO ×2, VTC ×3) | **5** [OFFICIEL-DÉRIVÉ] |
| S3 | https://www.facebook.com/officialsilkroad | Page Facebook **officielle** Silkroad Online : annonces de caps (« Lv.140 is coming soon (Hebe only)… Sep 15th », « Lv.140 … Mar 27th », « 120 Update – Kratos only … Temple of Jupiter … 13th degree ») | **5** [OFFICIEL] |
| S4 | https://sromobile.com/en/news/news/level-cap-unlock-roadmap + /adjustment-unlocking-level-cap | **Silkroad Origin Mobile** (relance officielle mobile) — roadmap de déblocage de caps (40 au lancement, 60 à J+7, 70 à J+21, 80 à J+42 ; article du 30/06/2024) ; le jeu a ensuite atteint **cap 140 / DG14** (posts officiels 2024-2025) | **5** [OFFICIEL] |
| S5 | https://www.elitepvpers.com/forum/silkroad-online/4785835-looking-release-date-every-legends.html | Fil « Looking for the release date of every Legend » — chronologie des Legends iSRO/KSRO par des vétérans (Legend IX Arabian Nights janvier 2015, 2e histoire mai 2016, cap 140 mars 2018) | **4** |
| S6 | https://www.elitepvpers.com/forum/silkroad-online/4454105-140-cap-update-silkroad-global.html | « 140 CAP Update @ Silkroad Global » — reprise de l'annonce officielle iSRO (update 15 septembre, Hebe) | **4** |
| S7 | https://www.elitepvpers.com/forum/silkroad-online/3565598-silkroad-online-legend-ix-arabian-nights-update.html + /forum/sro-private-server/3568854-silkroad-online-has-officially-updated-legend-ix-arabian-nights-2.html | Threads « Legend IX: Arabian Nights » — lancement officiel janvier 2015, cap 125, D14 | **4** |
| S8 | https://forum.playorigin.com + https://playorigin.com (+ /ranking/unique/top-unique.html, /detail-guides.html) | **Origin Online** : site + forum officiels du serveur (cap actuel 120, EXP/SP 3x solo / 5x party, classements uniques/guildes/traders) — derrière Cloudflare, partiellement lisible | **4-5** (pour ce que le serveur EST) |

### 🌐 Tier A — données publiées par les serveurs privés (fiables pour leur propre configuration, tout est [CUSTOM] sauf mention contraire)

| # | URL | Sujet | Fiabilité |
|---|-----|-------|-----------|
| A1 | https://srocave.com/konular/sensation-isro-140-cap-no-p2w-100-play-to-earn-unique-job-based-join-the-adventure.3252 | **SENSATION-iSRO** (cap 140, GO 28/02/2026) : LA fiche technique la plus riche trouvée — rates, uniques 120-130, emplacements d'élixirs D12→D17, donjons, tables de drops, path d'upgrade DG16 | **4** [CUSTOM documenté] |
| A2 | https://sro.cypergames.com/news/newsview/id/40 | **Cyper Online** patch notes (02/06/2023) : système d'upgrade D12 — items d'upgrade obtenus auprès des mobs et **uniques niveau 111+** (description du système officiel réimplémenté) | **4** |
| A3 | https://www.elitepvpers.com/forum/sro-pserver-advertising/5328378-demonroad-reborn-cap-140-pve-pvp-unique-modifications.html + https://playdemonroad.com | **DemonRoad-Reborn** (cap 140) — historique (créé en 2012 par Konsti), rates 300x/350x d'origine, ~200x en Reborn | **4** [CUSTOM] |
| A4 | https://www.elitepvpers.com/forum/sro-pserver-advertising/4397913-legionsro-140cap-140skills-styriaevent-vote4silks-upgradesystem-achievements.html (+ #4100851, #4076268) | **LegionSRO** (cap 140, skills 140, depuis ~2017) : Styria Event, Vote4Silks, Upgrade System, Achievements | **3-4** [CUSTOM] |
| A5 | https://gsro.fun + https://topg.org/silkroad-private-servers/server-634171 + https://www.elitepvpers.com/forum/sro-pserver-advertising/5058540-gsro-fun-pvp-server-d14-cap-130-ch-eu-everything-free-100-a.html | **GSRO** (cap 130, D14, ouvert 07/09/2021) | **3** [CUSTOM] |
| A6 | https://hype-r.online + https://sro.gg/en/server/hype-r-online-130-cap-eu-ch-isro-files-quality | **Hype-R Online** (cap 130, « iSRO-R Files Quality », ~3,6k en ligne selon sro.gg) | **3** |
| A7 | https://www.elitepvpers.com/forum/sro-pserver-advertising/4016229-chillout-community-silkroad-cap-130-dg-14-coin-system-play2win-silk-h-fgw-old-job.html | **Chillout Community** (cap 130 / DG14) : **taux d'alchimie explicites** (+1~+5 = 100 %, +6 = 90 %, +7 augmenté, élixirs avancés jusqu'à +5, ML 390/260) | **4** [CUSTOM] |
| A8 | https://silkroadtopservers.com/sitedetails.php?id=107 | **GreatestSRO** (cap 120) : 5x solo / 10x party, alchimie améliorée, max +15 | **3** [CUSTOM] |
| A9 | https://forum.exaysro.com/printthread.php?tid=689 | **ExaySRO** : guide « How to get 13D weapon, armor & accessory » — système **Awaken Card** (2013) : cartes sur mobs 120+, machine Awaken, manufacture | **4** [CUSTOM] |
| A10 | https://www.silkr.online/history/unique | **SilkR Online** (PS) : tracker de kills d'uniques (Tiger Girl, Roc) avec zones | **3** |
| A11 | https://silkroadgenesis.com/player/M3/unique-info | **Silkroad Genesis** (PS) : page stats uniques par joueur (vide au moment de la lecture — synchro DB dynamique) | **2** |
| A12 | https://elefor.eu/en/wiki-en | Wiki du serveur **Elefor** | 2 |

### 📊 Tier B — annuaires et classements de serveurs (photographie de la scène)

| # | URL | Sujet | Fiabilité |
|---|-----|-------|-----------|
| B1 | https://topg.org/silkroad-private-servers (+ /type/Cap-140, /type/D14, /type/High-Rate) | **TopG** : annuaire voté — Legion 140 D15, Dark World Online 140 D15, Legendary-road 140 D15, GSRO 130 D14, PureSRO 130 D14, Legend-Sro 130 D14, GreatestSRO 120, NewEvolust 120 DG13, Origin Online n°1 « NO BOTS, 8 years online » | **3** |
| B2 | https://sro.gg/en (+ /en/140-cap-silkroad-servers, /en/130-cap-silkroad-servers) | **SRO.GG** : fiches avec comptage « online » lu sur les sites des serveurs — 140 cap : Iron SRO-R, Astyra (1,4k online) ; 130 cap : Arixa (D13), Pyledes (D13), Hype-R (3,6k online), Victoria Rohan | **3-4** |
| B3 | https://nostalgic.gg/en/blog/best-silkroad-online-private-servers-en | **Nostalgic.gg** : top 94 serveurs actifs classés par population **Discord réelle** (anti-fraude de votes) — Golden SRO 2 707 online/24 988 Discord, Retro Network (110, vSRO, D11), Legion SRO 754/11 821, ESRO Macro (100)… **aucun high-cap dans le top 10** | **4** |
| B4 | https://www.xtremetop100.com/silkroad-online | XtremeTop100 : Origin Online « The Original Experience », Legion 140, CyronSRO (120 cap, iSRO-R, beta 12/06/2026) | **3** |
| B5 | https://silkroad-servers.com (+ /category/Cap-140, /details/originonline, /details/gsro) | Silkroad-Servers.com : annuaire avec stats population (~500+ pour Origin) | **3** |
| B6 | https://silkroadtopservers.com (+ /best-silkroad-private-servers.php, /server.php?id=114) | SilkroadTopServers : Aries Silkroad (cap 80 puis 100, CH only, macro bot) ; note « cap 120/140 les plus populaires en PvP » | **3** |
| B7 | https://silkroad.bestgames.to (+ /cap-140, /rate) | BestGames.to : catalogue par cap (60-140) — ex. « Cap 130, EXP 999x, Easy Alchemy, +15 items at NPC » | **2-3** |
| B8 | https://srodb.com | **SRO DB** : annuaire de serveurs (PAS une base d'items malgré le nom) | 2 |
| B9 | https://www.arena-top100.com/rank/3/in/silkroad-private-servers (+ /details/gsro2021) | Arena-Top100 | 2-3 |
| B10 | https://gametop.gg/blog/top-10-best-silkroad-online-private-servers-in-2026 | GameTop top 10 2026 | 2 |

### 🧰 Tier C — outillage d'extraction / développement (GitHub, GitLab, forums dev)

| # | URL | Sujet | Fiabilité |
|---|-----|-------|-----------|
| C1 | https://github.com/DummkopfOfHachtenduden/SilkroadDoc (+ wiki « Silkroad Security » : https://github-wiki-see.page/m/DummkopfOfHachtenduden/SilkroadDoc/wiki/Silkroad-Security) | **SilkroadDoc** — documentation historique dev (formats de fichiers, packets, sécurité), basée vSRO 1.188 ; **archivé en lecture seule le 01/06/2025**, tout est migré vers le wiki | **5** |
| C2 | https://github.com/Ex-o/Silkroad-Database-Documentation | Documentation de la structure de la base de données Silkroad (liens entre tables) | **4** |
| C3 | https://github.com/JellyBitz/SRO.PK2API | **SRO.PK2API** — bibliothèque C#/.NET de lecture/écriture PK2, recherche O(1), création de PK2 | **4** |
| C4 | https://github.com/veykril/pk2 | **pk2** (Rust) — crate lecture/écriture PK2 + binaire **pk2_mate** (`extract` / `pack` / `list`) | **4** |
| C5 | https://github.com/kahme247/SRO-PK2-Workbench | Rebuild Windows natif du workflow éditeur/extracteur PK2 historique (Joymax/ZeraPain), sources incluses | **3-4** |
| C6 | https://github.com/JellyBitz/SR_Db2Media | **SR_Db2Media** — extrait `_RefObjItem`/`_RefSkill` d'une base SQL et les réimporte dans les fichiers media du client | **4** |
| C7 | https://github.com/i3dprogrammer/SilkroadInformationAPI | Collecteur d'informations Silkroad en C# — parse les données du client via packets (`SroClient.cs`) | **3-4** |
| C8 | https://github.com/SDClowen/RSBot (+ miroirs https://github.com/myildirimofficial/RSBot, https://github.com/Silkroad-Developer-Community/RSBot) | **RSBot** — bot open source C# (GPLv3/AGPL-3), architecture par packets, v2.10.0 ; support iSRO, TRSRO, cSRO (ICCGame), JSRO, **KSRO**, vSRO 188/193/274, VTC, Digeam/TSRO 110, ruSRO, **BlackRogue 100/110** | **5** (pour les structures) |
| C9 | https://plugins.phbot.org/phbot-api (+ /drops, /inventory, /log) | **API plugins phBot** — `get_drops()`, `get_inventory()`, `log()` : dump programmatique des objets au sol/inventaire | **4** |
| C10 | https://github.com/JellyBitz/phBot-xPlugins | Collection de plugins phBot (exemples de code de référence) | **3-4** |
| C11 | https://forum.projecthax.com/t/unique-spawn-logging/5280 | Plugin phBot « Unique Spawn Logging » (opcode 0x300C) | **3-4** |
| C12 | https://github.com/Dentrax/EasySSA | **EasySSA** — proxy qui loggue tout le traffic de packets via SilkroadSecurityApi | **4** |
| C13 | https://context7.com/projecthax/pysilkroadsecurity (projet projecthax) | **pySilkroadSecurity** — port Python 3.2+ de la SilkroadSecurityApi de Drew | **4** |
| C14 | https://github.com/halimsamy/Silkroad.Net | **Silkroad.Net** — wrapper .NET 6 non officiel (bots, émulateurs, anti-cheat) | **3-4** |
| C15 | https://github.com/kumpelblase2/skrillax (+ crates/silkroad-protocol) | **skrillax** (Rust) — émulateur ECS + crate `silkroad-protocol` (définitions d'opérations packets client/serveur) | **3-4** |
| C16 | https://github.com/kahme247/ISRORCertBill | Serveur de **certification** iSRO-R (préserve le protocole, l'API sécurité, handlers et sérialiseurs) | **3-4** |
| C17 | https://gitlab.com/sroparadise/sro-suite | **sro-suite** (GitLab) — suite NodeJS de modules serveur + DataServer avec API swagger | **3** |
| C18 | https://github.com/Demircivi/silkroad-emulator · https://github.com/tanisman/SilkroadProject · https://github.com/OmarKholyo/SilkroadEmulator | Émulateurs C# (SilkroadProject = client Open Beta ; OmarKholyo = clients 2015 v1.315+) | **3** |
| C19 | https://github.com/topics/silkroad-online · https://github.com/topics/silkroadpk2 | Pages de topics GitHub (~25 repos : C#, Rust, Python, C++, JS/TS, serveurs NodeJS, outil de stats gateway en PHP) | **3** |
| C20 | https://gitlab.com/explore/projects/topics/Silkroad+Online | Topic GitLab « Silkroad Online » — y compris **Archive Explorer** | **3** |
| C21 | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5364960-release-sro-archive-explorer-pk2-browser-3d-model-map-effect-viewer-skill-brows.html | **SRO Archive Explorer** (publié 06/12/2025, actif en 2026) — navigateur PK2 + viewer 3D modèles/cartes/effets + navigateur de skills : l'outil d'inspection client le plus complet actuel | **4** |
| C22 | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4127868-share-pk2-editor-extractor-working-08-2016-a.html | **Pk2 Editor & Extractor** (Drew, 2016) — les classiques | **4** |
| C23 | https://forum.projecthax.com/t/english-pk2/24720 | Outil « English PK2 » (Extractor.exe + Editor.exe) — traduction de PK2 entre clients | **3-4** |
| C24 | https://forum.ragezone.com/threads/tool-pk2-tools-net.921502 | **Pk2 Tools .NET** (RaGEZONE) — extracteur/éditeur C# | **3-4** |
| C25 | https://www.elitepvpers.com/forum/sro-hacks-bots-cheats-exploits/690658-pk2tools-5-1-bundle.html | **PK2Tools 5-in-1** (Builder, Defragmenter, Editor, Extractor, Lister) | **3-4** |
| C26 | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4460302-release-easy-pk2-patcher.html | **Easy PK2 Patcher** — import 1-clic dans Data/Media/Particles/Music/Map .pk2 | **3** |
| C27 | https://progamercity.net/game-gfx/1545-silkroad-pk2-extractor-editor-texture-converter-max-importer.html | PK2 Extractor/Editor + Texture Converter + Max Importer | **3** |
| C28 | https://github.com/JellyBitz/xSROMap (https://jellybitz.github.io/xSROMap) + https://github.com/Egezenn/OpenSilkroadMap | Cartes web (déjà connues de la KB) ; OpenSilkroadMap documente l'usage de **pk2_mate** pour extraire les assets | **4** |
| C29 | https://github.com/JellyBitz/vSRO-ServerAddon | **vSRO-ServerAddon** — personnalisation du comportement vSRO 1.188 par injection DLL | **4** |
| C30 | https://github.com/devtekve/blackcatproject/blob/master/Proxy/SilkroadProxyWithForms/SilkroadSecurityApi/Security.cs | Implémentation C# de SilkroadSecurityApi (chiffrement, handshake, tailles de packets) | **3-4** |
| C31 | https://gitee.com/wangshuip/sro-security-api | Miroir de la Silkroad Security API 1.4 de pushedx (C#) | **3** |
| C32 | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4420228-release-silkroad-stats-checker.html | **Silkroad Stats Checker** — données SRODB.db/SRORDB.db nettoyées (items, cSRO-R) | **3-4** |
| C33 | https://dev-yurika.com | Développeur PS — dév custom sur fichiers **vSRO et iSRO-R** | **2-3** |
| C34 | https://florian0.wordpress.com + https://gitlab.com/florian0/sro_devkit | Blog + **SRO_DevKit** (C++) de florian0, reverse-engineer de la scène (mouvement des personnages, etc.) | **3-4** |

### 📚 Tier D — conservation / archives

| # | URL | Sujet | Fiabilité |
|---|-----|-------|-----------|
| D1 | https://www.elitepvpers.com/forum/sro-hacks-bots-cheats-exploits/4308987-silkroad-online-client-archive.html (+ pages 2-3) | **Silkroad Online Client Archive** (florian0) — collection de 4 ans de clients + fichiers serveur en torrents ; **torrents majoritairement morts** aujourd'hui | **4** (liste) / 2 (liens) |
| D2 | https://forum.ragezone.com/threads/vsro-server-files-v188.779870 (+ section https://forum.ragezone.com/community/silkroad-releases.722) | RaGEZONE : release originale des **fichiers serveur vSRO v1.188 (juillet 2011)** + packs v188, **v193**, **v10.0** | **5** (fait historique) |
| D3 | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5244813-sro-game-files-v1-188-a.html | « SRO Game Files (v1.188) » — compilation propre préconfigurée | **3-4** |
| D4 | https://www.elitepvpers.com/forum/silkroad-online-trading/5329817-silkroad-database-v1-188-v2-original-clean-all-official-areas-dungeons.html | **Silkroad Database v1.188 (V2)** — base originale « propre », toutes zones/donjons officiels | **4** |
| D5 | https://www.elitepvpers.com/forum/sro-private-server/1913855-database-sro_vt_shard-_refobjcommon-_refobjitem-refskill-_refobjcommon.html | Base **SRO_VT_SHARD** avec `_RefObjCommon`, `_RefObjItem`, `_RefSkill` | **4** |
| D6 | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/5236228-release-complete-silkroad-unbranded-files-database-client-easy-install.html | Pack complet fichiers serveur + base + client « unbranded » | **3-4** |
| D7 | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4667336-release-shambhala-map-full-files.html | **Release « Shambhala Map (Full Files) »** — fichiers complets de la carte officielle du cap 140 | **4** |
| D8 | https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4327801-arabian-petra-maze-devils-garden-fixed-maps.html | **Arabian Petra Maze + Devil's Garden « fixed maps »** — cartes arabes officielles avec bugs de synchronisation corrigés par la communauté | **4** |
| D9 | http://www.silkroadforums.com/viewtopic.php?f=1&t=133478 | Client complet officiel **v1.400 (2013)** + patches | **3-4** |
| D10 | https://www.elitepvpers.com/forum/silkroad-online/5175016-silkroad-online-legend-3-rock-mountain-client-v1-150-a.html | Demande du client Legend 3 **v1.150** — confirme les torrents morts de D1 | 2 |
| D11 | https://sourceforge.net/projects/srodb · https://sourceforge.net/projects/sro-server-emu | Projets SourceForge historiques (fichiers serveur / émulateur) | 2-3 |
| D12 | https://www.srolobby.com/konular/silkroad-online-turkey-ancient-witch-venefica.4514 | Srolobby (TR) : guide de l'unique Venefica (ticket, Oasis/Tarim Basin) | **3** |

### ❌ Constats négatifs (pour ne pas re-chercher)

- **« Ethos Silkroad »** : aucun résultat — serveur inexistant, renommé ou disparu.
- **« Aries Silkroad » n'est PAS high-cap** : cap 80 puis cap 100, CH only, macro-bot autorisé (elitepvpers #5296165, silkroadtopservers id=114).
- **Pas de base d'items dédiée sur playorigin.com** : le site a des classements (Top Unique/Guild/Trader/Hunter) et des guides, mais pas d'item DB publique.
- **Pas de collection archive.org des clients Silkroad Online (MMO)** — les entrées « Silkroad » sur archive.org sont des jeux d'arcade des années 90 (MAME, Sharp X68000). La conservation passe par elitepvpers/RaGEZONE (liens souvent morts).
- **srodb.com n'est PAS une base d'items** : c'est un annuaire de serveurs privés.

---

## 📜 Chronologie officielle — le socle pour distinguer officiel vs custom

> Fondamental pour la KB : la plupart des contenus « DG12/DG13/DG14 » des serveurs privés ne sont PAS inventés — ils réutilisent des données officielles KSRO/iSRO. Ci-dessous la trame officielle établie par les threads S5/S6/S7 et la page Facebook officielle S3.

| Période | Contenu officiel | Degré | Source |
|---|---|---|---|
| 2011 (juil.) | **Fuite des fichiers serveur vSRO v1.188** (base de ~tous les PS ultérieurs) ; v1.193 et v10.0 fuiteront plus tard | D11 max dans les files | D2 |
| ~2013 | Cap **120** + **Temple of Jupiter** — la page officielle annonce (par vagues serveur par serveur : Kratos, Hebe, Kali) : « Maximum level increase up to level 120 - New Dungeon: Temple of Jupiter - **New item (13th degree)** and skills » | **D12 puis D13 activés dans l'ère cap 120** | S3 |
| 2015 (janv.) | **Legend IX : Arabian Nights, 1ʳᵉ histoire** — cap **125**, nouvelles zones arabes, nouvelle ville ; introduction du **D14** (selon le vétéran notHype : « 13d was released on the 120 Cap (Jupiter/Const FW)… 14d was released on the first Arabian Story (125 increase) ») | D14 | S5, S7 |
| 2016 (mai) | **Arabian Nights, 2ᵉ histoire** — cap **130**, nouveaux skills/monstres/zones, **D15** | D15 | S5 |
| 2018 (27 mars) | **Cap 140** — région **Shambhala/Shambhala Shore** (pas de nouveau degré selon les threads) ; puis **15 sept.** : cap 140 sur **Hebe** uniquement avec **Ice Temple (Lv. 131~135)** + **Extended Skill Lv. 2** ; **23 nov.** : **Fire Temple** pour les autres serveurs | — | S3, S6 |
| 2024 (3 juil.) | **Silkroad Origin Mobile** (officiel, mobile) : lancement avec cap 100/D10, roadmap 40→60 (J+7)→70 (J+21)→80 (J+42), montée progressive jusqu'à **cap 140 / DG14** (2024-2025) | D14 officiel mobile | S4 |
| 2026 (19 mai) | iSRO rouvre un **nouveau serveur officiel** repartant sur cap 120 / Temple of Jupiter / 13th degree | D13 | S3 |

**Conséquences pratiques pour SRObro :**
- **[OFFICIEL]** D12 et D13 = contenu officiel de l'ère cap 120 (Jupiter). Les stats DG12/DG13 extraites d'un client officiel (ou du jeu mobile officiel) sont fiables.
- **[OFFICIEL]** D14 (cap 125, 2015) et D15 (cap 130, 2016) = officiels aussi — d'où les « D14/D15 » de Legion/GSRO etc., qui sont des réutilisations, pas des inventions.
- **[OFFICIEL]** Les uniques **111+** : le système officiel d'upgrade D12 dit que les items d'upgrade tombent sur les « mobs et uniques puissants niveau 111 et au-dessus » (S2/A2) — Kidemonas (120), Karkadann (123), Merikh (125) sont des uniques officiels.
- **[CUSTOM]** Tout degré **> D15** (D16, D17… ex. SENSATION) et les « skills 140 » custom, Styria Event, etc. = inventions de serveurs.
- **Zone grise documentée** : **Devil's Garden** et **Petra Maze** — des fichiers de cartes existent dans le client et la communauté les a « fixés » (D8) ; leur statut d'activation officielle est débattu (le fil S5 indique que seul « Arabian Garden » (flame tree) est officiellement sorti, Devil's Garden et Petra étant des contenus de fichiers jamais activés par Joymax — mais réutilisés massivement par les PS).

---

## 🗺️ Panorama de la scène high-cap 2011-2026

### Les ères techniques

1. **Ère vSRO 1.188 (2011-2015)** — la fuite de juillet 2011 (D2) fournit `SR_GlobalManager`/`SR_ShardManager`/`SR_GameServer` + base SQL (SRO_VT_SHARD). Première vague de serveurs : la base du contenu = cap 120/Jupiter/D12. **BlackRogue** tourne sur ces files (ProjectHax : https://forum.projecthax.com/t/private-server-list/1940 — « play-blackrogue runs on vSRO 1.188 files »), caps 100/110 encore supportés par RSBot aujourd'hui (C8). silkroad.lt utilisait des files cSRO/SilkroadR.
2. **Ère customs D13+ (2013-2016)** — les serveurs devancent ou copient KSRO : ExaySRO bricole déjà un système D13 par « Awaken Cards » en 2013 (A9) ; Chillout Community tourne en 130/DG14 ; DemonRoad (créé 2012) monte à 140.
3. **Ère post-fuites élargies (2016-2020)** — files v1.193 puis v10.0 sur RaGEZONE (D2) ; addons DLL (JellyBitz vSRO-ServerAddon C29) permettent D13/D14/D15 custom sur base 1.188 ; LegionSRO (140) ouvre ~2017.
4. **Ère actuelle (2021-2026)** — bipartition nette :
   - **Low/mid-cap « old school » domine en population réelle** : le top Nostalgic.gg (B3, population Discord réelle) n'a **aucun serveur 120+ dans son top 10** (Golden SRO, Retro Network 110/D11, DUCKROAD, Old Silkroad, ESRO Macro 100…).
   - **Le high-cap survit en PvP/endgame** : Legion SRO (754 online/11 821 Discord), GSRO (130/D14, 2021), Hype-R (130, ~3,6k annoncé), SENSATION-iSRO (140, GO 28/02/2026), Astyra Silkroad-R (140, réouverture 24/07/2026), Iron SRO-R (140), DemonRoad-Reborn (140).
   - **Le contenu cap 140/D14 officiel est revenu en force côté officiel** avec Silkroad Origin Mobile (2024-2026), ce qui valide rétroactivement les données D14 utilisées depuis des années par les PS.

### Répartition par cap (photographie 2025-2026)

| Cap | Serveurs identifiés | Degrés | Sources |
|---|---|---|---|
| **140** | LegionSRO (depuis ~2017), DemonRoad/DemonRoad-Reborn (2012→), SENSATION-iSRO (2026), Iron SRO-R, Astyra Silkroad-R (réouverture 24/07/2026), Dark World Online, Legendary-road, RWB Online (D16 !), Roots SRO, ArcaneMax (GO 09/2026), Anoha (instant 130), SROOLD | D15 (custom au-delà) | B1, B2, B3, A1, A3, A4 |
| **130** | GSRO (2021), Hype-R Online, PureSRO, Legend-Sro, Rising Online, Pyledes Online (D13), Arixa Online (D13), Victoria Rohan (iSRO-R), Chillout Community (DG14), NewRoaD (D14), Ex-Online | D13/D14 | B1, B2, A5, A6, A7 |
| **120** | **Origin Online** (référence low-rate), GreatestSRO, NewEvolust (DG13), UniqSRO, Nemesis SRO, CyronSRO (beta 06/2026, iSRO-R), serveurs FB (Eles Online, Antusa Online) | D12/D13 | B1, B2, B4, S8 |

---

## 🏰 Panorama par serveur

### ⭐ Origin Online — la référence « officiel-like » cap 120

- **Site** : https://playorigin.com · **Forum** : https://forum.playorigin.com · Classements : https://playorigin.com/ranking/unique/top-unique.html
- **Positionnement** : « The Original Experience », **NO BOTS**, 8+ ans en ligne (B1, B4). Classé n°1 TopG (sans cap affiché).
- **Config publiée** [CUSTOM mais copie officielle] : **cap actuel 120** (accueil du site, vérifié via snippets 2026) ; EXP/SP **3x solo / 5x party** ; maîtrises **360 CH / 240 EU** ; progression historique 90 → 100 → 110 → 120.
- **Contenu** : réutilisation du contenu officiel (dérivé KSRO via files), pas de D13+ inventé ; le forum héberge des tier lists par cap et des guides (ex. « 80 Cap Tier List » : https://forum.playorigin.com/showthread.php?1050).
- **Données publiées** : classements publics (unique/guilde/trader/hunter) ; guides par classes (https://playorigin.com/detail-guides.html) ; liste des quêtes par région (https://forum.playorigin.com/showthread.php?33). **Pas d'item DB publique.**
- **Accès** : Cloudflare sur le site (403 pour les robots) ; le forum est partiellement lisible par les moteurs.
- ⚠️ Une mention Reddit évoque du « late-game level 140 cap content » sur Origin — non confirmée par le site (cap 120 affiché) → voir Incertitudes.

### ⚔️ SENSATION-iSRO — la fiche technique la plus riche (cap 140, 2026)

Voir section [Données chiffrées](#-données-chiffrées-récupérées) — c'est la source A1, quasi exhaustive.

### 🐺 DemonRoad / DemonRoad-Reborn (140, depuis 2012)

- Créé par **Konstantin « Konsti »** en **2012**, ~10 ans de vie continue (A3).
- Rates d'origine **300x EXP / 350x party** ; Reborn ~**200x** [CUSTOM].
- Gameplays : Fortress War, Job Temple, Survival Arena, Shambhala, CTF ; quêtes quotidiennes « Garden Defenders » + 3 uniques dans Devil's Garden.
- Site : https://playdemonroad.com · PUB : https://www.elitepvpers.com/forum/sro-pserver-advertising/5328378

### 🦅 LegionSRO (140, depuis ~2017)

- « 140 CAP | 140 skills | Styria Event | Vote4Silks | Upgrade System | Achievements », long-term, low rates — 3 fils d'annonce : https://www.elitepvpers.com/forum/sro-pserver-advertising/4076268 (avec « 138/140 monsters/uniques »), #4100851, #4397913 (A4).
- Population réelle mesurée par Nostalgic.gg : **754 online / 11 821 Discord** — le plus gros high-cap en communauté (B3).
- Les « skills 140 » et le Styria Event sont **[CUSTOM]** ; le contenu monde 120-140 est dérivé officiel.

### 🎯 GSRO (130/D14, depuis 07/09/2021)

- https://gsro.fun — « Everything Free 100% » (A5) ; tags TopG : Balanced, Battle Arena, Job Based, Job Temple.

### 🚀 Hype-R Online (130, files iSRO-R)

- https://hype-r.online — « iSRO-R Files Quality », EU & CH, Play-to-Win, no P2W ; **~3,6k online** affichés sur sro.gg (B2, à prendre avec prudence : comptage automatique des sites des serveurs). Victoria Rohan (130, iSRO-R) affiche 4,3k.

### 🕹️ Autres 140 notables

- **Iron SRO-R** & **Astyra Silkroad-R** (réouverture 24/07/2026, « Old & New Both Job System », 1,4k online sro.gg) — files **Silkroad-R** plutôt que vSRO (B2, FB : https://www.facebook.com/groups/srotop/posts/1392362016127801).
- **RWB Online** : cap 140, **D16**, Mastery 390 — contenu [CUSTOM] pur (résultat de recherche LegionSRO A4, lien 4).
- **DemonRoad-Reborn**, **Dark World Online**, **Legendary-road** (D15), **Anoha** (PVE, instant 130, quêtes journalières), **ArcaneMax** (GO 11/09/2026, open market).

### 🧓 Serveurs historiques cités (contexte)

- **BlackRogue** (play-blackrogue) : PS emblématique des files vSRO 1.188, caps 100/110 — encore supporté par RSBot (C8, https://forum.projecthax.com/t/private-server-list/1940).
- **ZSZC** : serveur old-school dont le wiki Fandom (https://zszc.fandom.com/wiki/Unique_Hunting) publie niveaux et **coordonnées de spawn des uniques** (Tiger Girl 20, Cerberus, Ivy, Uruchi, Isyutaru, Lord Yarkan 80…) — utile pour les spawn locations.
- **Arius Reborn** (60 cap, style 2005 progressif), **Aries** (80/100 CH only — pas high-cap), **Legends Online** (vSRO no-bot), **Xian Silkroad Season III** (90).

---

## 🔢 Données chiffrées récupérées

### 💀 1. HP des uniques — la table M3 Stats (serveurs officiels iSRO)

> Source unique : https://www.m3stat.com/uniques (S1), lue en direct. M3 Stats collecte les infos **en jeu** sur les serveurs officiels (Minerva, Palmyra…). C'est la **première table HP consolidée incluant les boss 111+** trouvée en anglais. Marqueur **[OFFICIEL-DÉRIVÉ]** (valeurs officielles, mesure tierce).

| Unique | Niveau | HP | Marqueur |
|---|---|---|---|
| Tiger Girl | 20 | 598 720 | OFFICIEL-DÉRIVÉ |
| Cerberus | 24 | 693 072 | OFFICIEL-DÉRIVÉ |
| Captain Ivy | 30 | 1 094 835 | OFFICIEL-DÉRIVÉ |
| Uruchi | 40 | 1 779 528 | OFFICIEL-DÉRIVÉ |
| Isyutaru | 60 | 4 324 612 | OFFICIEL-DÉRIVÉ |
| Lord Yarkan | 80 | 9 353 045 | OFFICIEL-DÉRIVÉ |
| Demon Shaitan | 90 | 12 732 060 | OFFICIEL-DÉRIVÉ |
| Roc | 100 | **1 451 891 045** ⚠️ | OFFICIEL-DÉRIVÉ (à vérifier : ordre de grandeur atypique — possiblement la version raid/événement ou un agregat) |
| Medusa | 100 | 183 535 199 | OFFICIEL-DÉRIVÉ |
| **Kidemonas** | **120** | **13 851 102** | OFFICIEL-DÉRIVÉ |
| **Karkadann** | **123** | **15 023 129** | OFFICIEL-DÉRIVÉ |
| **Merikh** | **125** | **18 372 504** | OFFICIEL-DÉRIVÉ |

- Recoupement partiel : un thread srocave (A1) confirme Karkadann/Kidemonas/Merikh comme uniques « 12-13D » de la tranche 120-130 ; MMORPG.com (https://www.silkroadonline.wiki / https://www.mmorpg.com/guides/unique-monsters-part-two-2000116869) documente Medusa comme plus haut unique classique (niv. 105 à l'origine, 100 sur les trackers).
- ⚠️ **Aucune donnée HP pour Benephika / Giant Overlord / Thief Boss Kalia (uniques 130+ officiels)** — le tracker s'arrête à Merikh 125.

### 📋 2. SENSATION-iSRO — fiche technique complète (cap 140) [CUSTOM sauf contenu monde]

Source : https://srocave.com/konular/sensation-isro-140-cap-no-p2w-100-play-to-earn-unique-job-based-join-the-adventure.3252 (A1), GO 28/02/2026.

- **Config** : cap 140 EU/CH, maîtrises **280 EU / 560 CH** [CUSTOM], rates **200x** EXP/SP [CUSTOM], limite 8 PC/IP, alchimie max **+15** (sauf ADV) [CUSTOM], degrés **15D à l'ouverture → 17D par updates** [CUSTOM].
- **Silk / Play-to-earn** : uniques bas niveaux (18-90) → **1 Silver Silk** ; gros uniques **120-130 (Merikh, Benephika) → 50 Silver Silk** ; **2 silk/heure** dès le niveau 110 [CUSTOM].
- **Emplacements des élixirs** (réutilisation des zones officielles) :
  - Élixirs normaux : mobs 1-110 ; **12D : Alexandrie (mobs 101-114)** ; **13D : Mirror Dimension & Baghdad Kirk-Petra (120-125)** ; **14D : Arabia Coast, Phantom Desert, Shambala Ice Temple (125-130)** ; **15D : Shambala Ice & Fire Temple (130-140)** ; 16-17D : Benephika, Giant Overlord, Thief Boss Kalia.
  - Pierres : Lv 8-9 Hotan (65-87) ; 10-11 Alexandrie (100-110) ; 12 Mirror Dimension (111-117) ; 13 Mirror/Baghdad (120-124) ; 14-15 Shambala Fire/Ice + uniques de carte.
- **Proof Stones & drops d'uniques** : 12-13D proofs → Karkadann, Kidemonas, Merikh (+ drops 12-13D Sox) ; 14-15D proofs → Benephika, Giant Overlord, Kalia (+ Sox) ; Wheel of Fate & Fortune → chance moyenne sur Merikh/Benephika/Giant Overlord ; Zeromus 2 proofs, Valkyrie 2 proofs, ROC/Bone ROC 4 proofs + items DG16 ; uniques d'événement (respawn 6 h) EVENT DEATH BONE et SPECIAL ROC → 5 proofs + DG16 + scroll rare ; **Medusa ajoutée en salle B2** (récompense : proof), salle B5 retirée.
- **Donjons & taux de drop** : FGW/Serenes 4★ → **0,2 %** accessoire magic DG16, **40 %** set/accessoire DG16, HP d'Undine augmentés ; Petra (Hirisun) → **100 %** proof DG16 ; Devil Garden (Launatun & Benephika) → 100 % proof, **0,5 %** accessoire DG16 ; Baghdad → Giant Overlord (proof + items), Abshad Force High General (100 % proof) ; quête « 10 000 mobs Molten ×4 » → Magic Upgrade Scroll DG16.
- **Path d'upgrade DG16** (liés au compte) : DG15 Legend (+12) → DG16 Magic (+11) → DG16 Rare (+0) → (+8) → DG16 Legend (+0).
- **Évolution** : EGY A/B → 12D via Awaken Stones ; économie job : « Shining Stones » + caravanes → Arena Coins.
- **Bots officiellement tolérés** : PhBot, SBot (payant), RSBot (gratuit) — confirmé par le staff.

### 🧪 3. Taux d'alchimie publiés par des serveurs [CUSTOM]

| Serveur | Taux publiés | Source |
|---|---|---|
| **Chillout Community** (130/DG14) | **+1~+5 = 100 %, +6 = 90 %, +7 = augmenté**, élixirs avancés jusqu'à +5, Mastery Level 390/260 | https://www.elitepvpers.com/forum/sro-pserver-advertising/4016229 (A7) |
| **GreatestSRO** (120) | Alchimie « améliorée », **max +15**, 5x solo/10x party | https://silkroadtopservers.com/sitedetails.php?id=107 (A8) |
| **SENSATION-iSRO** (140) | Max **+15** (sauf ADV) | A1 |
| **BestGames (annuaire)** | Exemple typique high-rate : « Cap 130, EXP 999x, **Easy Alchemy, +15 items at NPC** » | https://silkroad.bestgames.to/rate (B7) |

> Comparaison : sur iSRO officiel, l'alchimie au-delà de +10 est notoirement < 10 % (KB 05_ALCHEMY_SYSTEM). Les taux ci-dessus sont des **boosts custom** caractéristiques du high-cap.

### ⚔️ 4. D13 — obtention et contexte

- **Cyper Online** (patch 02/06/2023, décrivant le système officiel D12) : items d'upgrade D12 obtenus sur « mobs et uniques **niveau 111+** » + Item Mall ; « Homeless Genie » échange des items D9→D12 (dont EGY) (A2). [OFFICIEL-DÉRIVÉ]
- **ExaySRO** (2013) : D13 par **Awaken Cards** — cartes sur mobs **120+** (« not rare drops »), machine Awaken (jeu gagnant/perdant), achat auprès du NPC « D13 Items by Awaken System », craft via l'onglet Manufacture (A9). [CUSTOM]
- **Guide elitepvpers** « Lv 120 (13 DG) iSRO Full STR Blader Guide » : maximisation d'un set D13 sur **iSRO officiel** (preuve que le D13 a existé côté officiel à cap 120) : https://www.elitepvpers.com/forum/sro-guides-templates/2669448-guide-lv-120-13-dg-isro-full-str-blader.html
- **Showcases KSRO** (visuels, sans chiffres) : « SRO - Degree 13 Weapons and Gear » https://www.youtube.com/watch?v=q8wDtDGeXYA (note : CH et EU partagent les mêmes sets D13) ; armes 13D CH : https://www.youtube.com/watch?v=FLU84cLy104 ; sets 13D CH : https://www.youtube.com/watch?v=ZdhIeq-wr50 ; fuites TR 2011 : https://forum.donanimhaber.com/silkroad-13-degree-wepons-13-degree-set-ksro--55733217 et https://www.extraloob.com/threads/13-degree-weapons-267584 (« items niveau 101, tier 12DG+6 »).

### 🌍 5. Contenu 130-140 officiel — zones et calendars

- Cap 125 (Legend IX, janv. 2015) puis 130 (2ᵉ histoire, mai 2016) : zones arabes — **Baghdad (Kirk-Petra), Petra Maze, Devil's Garden, Arabia Coast, Phantom Desert** ; **Mirror Dimension** (111-117). Cartes « fixed » par la communauté : D8. [OFFICIEL pour la majorité, zone grise pour Devil's Garden/Petra — cf. chronologie]
- Cap 140 (2018) : **Shambhala Shore** (27 mars), **Ice Temple Lv 131-135 + Extended Skill Lv. 2** (15 sept., Hebe), **Fire Temple** (23 nov.). Fichiers complets de Shambhala relâchés : D7. [OFFICIEL]
- Uniques officiels de haut niveau documentés : **Kidemonas (120), Karkadann (123), Merikh (125), Benephika/Benepika/Venefica (ancienne sorcière, Donwhang/Tarim Basin — Oasis, Srolobby D12), Devil Benepika, Giant Overlord, Thief Boss Kalia, Zeromus, Valkyrie, ROC/Bone ROC, Seth, Haroeris** (kills visibles en direct sur stats.projecthax.com). Vidéos : Devil Benepika https://www.youtube.com/watch?v=2VZgxLA7Dqg, Benepika https://www.youtube.com/watch?v=L_IiNcdtPzA, Kidemonas https://www.youtube.com/watch?v=ybmhUmitrx4, Karkadann https://www.youtube.com/watch?v=uPQv7BA6pbs.

### 📊 6. Populations estimées de la scène (2025-2026)

- **Nostalgic.gg** (B3, méthode Discord, 94 serveurs, 257 791+ membres cumulés) : Golden SRO 2 707 online / 24 988 Discord ; Retro Network (110 vSRO D11) 1 090/26 739 ; DUCKROAD 1 287/24 588 ; Old Silkroad 1 847/17 250 ; P SRO (custom) 411/17 416 ; **Legion SRO 754/11 821** ; Rageon 760/9 118 ; ESRO Macro (100) 1 461/5 913 ; Cerberus Online 634/8 883 ; Elite Silkroad (100) 1 131/6 439.
- **sro.gg** (B2, comptage auto des sites) : Astyra (140) 1,4k ; Hype-R (130) 3,6k ; Victoria Rohan (130) 4,3k.
- **silkroad-servers.com** : Origin Online ~500+ (B5).
- **stats.projecthax.com** (S2) : 26 serveurs OFFICIELS suivis en direct (7 iSRO : Artemis, Brontes, Hebe, Hyperion, Pontus, Thanatos, Theia ; 4 TRSRO ; kSRO 초원길…).
- Lecture : les chiffres « online » auto-déclarés des high-caps (3-4k) sont invérifiables ; la méthode Discord de Nostalgic.gg est la plus fiable et montre que **le high-cap est une niche** (un seul 120+ dans le top 10).

---

## 🗃️ Bases d'items online

| Base | URL | Couverture | Fiabilité |
|---|---|---|---|
| **Silkroad Online Database** | https://silkroadonline.wiki (+ /items) | **21 490 items** (par degré/seal/plus), **7 313 skills** (CH+EU), **8 387 monstres** (uniques flaggés), 600 NPCs, 332 téléports, 4 410 zones ; outils : simulateur d'alchimie, planner mastery/SP, calculateur de routes de commerce, carte interactive. Données extraites du **client build v1.657**, crédit Joymax/Wemade Max | **4** — la plus complète trouvée, mais degré max non confirmé (v1.657 ≈ ère D12/D13, à vérifier si besoin du D14+) |
| **Silkroad Origin Mobile wiki officiel** | https://www.sromobile.com/en/wiki | Jeu officiel mobile cap 140/DG14 — guides gameplay, builds, routes de trade | **4-5** (officiel mais format guide, pas une item DB structurée) |
| **ZSZC Wiki (Fandom)** | https://zszc.fandom.com/wiki/Unique_Hunting | Niveaux + **coordonnées de spawn** des uniques classiques (serveur old-school) | 3 |
| **Elefor Wiki** | https://elefor.eu/en/wiki-en | Wiki d'un PS moderne | 2 |
| **Silkroad Online Wiki (Fandom)** | https://silkroadonline.fandom.com/wiki/Main_Page (+ /wiki/Armor_(Equipment), /wiki/Boss) | Généraliste officiel | 3 |
| **StrategyWiki** | https://strategywiki.org/wiki/Silkroad_Online/Bosses (+ /Items) | Boss/items officiel | 3 |
| srodb.com | https://srodb.com | ❌ annuaire de serveurs, pas d'items | 2 |
| Anciens (morts/partiels) | http://nightmareofworld.free.fr/srodb (base alchimie/tablettes, pré-cap 90 — signalé via http://www.silkroadforums.com/viewtopic.php?f=5&t=30406) ; sro.db.mmosite.com (DB stats d'époque, signalée via http://ww1000w.silkroadforums.com/viewtopic.php?f=29&t=112976) | Alchimie pré-90 ; DB mmosite hors ligne | 1-2 |

> **Conclusion bases d'items** : il n'existe **pas de base d'items online dédiée aux serveurs privés high-cap** (pas d'« Origin item db »). Les PS publient leurs données dans leurs forums/annonces, pas dans des DB structurées. La voie fiable pour les stats DG12/DG13/DG14 reste : (a) silkroadonline.wiki (client v1.657), (b) extraction directe du client via les outils ci-dessous, (c) le jeu mobile officiel.

---

## 🧰 Outils d'extraction de données

### 📦 Outils PK2 (archives du client : Media.pk2 / Data.pk2)

| Outil | Où | Langue/Type | Notes |
|---|---|---|---|
| **Pk2 Editor & Extractor** (Drew) | elitepvpers C22 (2016) | Win binaire | Les classiques historiques |
| **PK2Tools 5-in-1** (Builder/Defrag/Editor/Extractor/Lister) | elitepvpers C25 | Win binaire | Bundle complet |
| **Pk2 Tools .NET** | RaGEZONE C24 | C# | Extracteur/éditeur |
| **SRO.PK2API** (JellyBitz) | GitHub C3 | C#/.NET | **Lib** lecture/écriture, recherche O(1) — recommandé pour scripter l'extraction |
| **pk2 + pk2_mate** (Veykril) | GitHub C4 | **Rust** | Crate + CLI `extract`/`pack`/`list` — recommandé moderne, utilisé par OpenSilkroadMap |
| **SRO-PK2-Workbench** (kahme247) | GitHub C5 | Win/C# | Rebuild sourcé du workflow Joymax/ZeraPain |
| **English PK2 tool** (Extractor.exe+Editor.exe) | ProjectHax C23 | Win binaire | Transferts de traduction entre clients |
| **Easy PK2 Patcher** | elitepvpers C26 | Win | Import 1-clic dans les .pk2 |
| **SRO Archive Explorer** (2025-2026) | elitepvpers C21 + GitLab C20 | Desktop | **Navigateur PK2 + viewer 3D modèles/cartes/effets + navigateur de skills** — le plus complet pour explorer un client sans tout extraire |
| **Silkroad Stats Checker** | elitepvpers C32 | Win | Lit des SRODB.db/SRORDB.db nettoyées (items cSRO-R) |
| Media.pk2 Templates (SilkroadMAX) | https://media-pk2-templates.software.informer.com | Templates | Templates d'édition Media.pk2 |

### 🔧 Parseurs de données (items/skills/monstres)

| Outil | Où | Rôle |
|---|---|---|
| **SR_Db2Media** (JellyBitz) | GitHub C6 | Convertit `_RefObjCommon`/`_RefObjItem`/`_RefSkill` (SQL) ↔ fichiers media du client — la passerelle DB↔client |
| **SilkroadInformationAPI** (i3dprogrammer) | GitHub C7 | Parse les données du client **via les packets du jeu** (`SroClient.cs`) — collecte d'info en temps réel |
| **SilkroadDoc** (DummkopfOfHachtenduden) | GitHub C1 + wiki | **LA documentation de référence** des formats de fichiers et packets (vSRO 1.188). Archivé 01/06/2025 — le contenu vit dans le wiki |
| **Silkroad-Database-Documentation** (Ex-o) | GitHub C2 | Structure et liens des tables de la base Silkroad |
| Bases SQL publiques | elitepvpers D4/D5/D6, RaGEZONE D2 | Bases complètes `_RefObjCommon`/`_RefObjItem`/`_RefSkill` (v1.188 « propre » V2, packs v188/v193/v10.0) |
| `skills.txt` parsé (tarekwiz/SilkroadBot) | GitHub (résultat recherche C7) | Exemple de sortie de parsing skilldata |

> **Méthode documentée pour extraire les données KSRO nous-mêmes** : client → `pk2_mate extract Media.pk2` (C4) → parse `itemdata.txt`/`skilldata.txt`/`characterdata.txt` (format documenté dans SilkroadDoc C1) → ou passer par la base SQL v1.188 (D4/D5) avec SR_Db2Media (C6). L'inspection visuelle passe par SRO Archive Explorer (C21).

### 🖥️ Émulateurs serveur (réimplémentations = documentation vivante des mécaniques)

- **Demircivi/silkroad-emulator** (C#), **tanisman/SilkroadProject** (client Open Beta), **OmarKholyo/SilkroadEmulator** (clients 2015 v1.315+), **kumpelblase2/skrillax** (Rust, + crate `silkroad-protocol`), **sro-suite** (GitLab, NodeJS + DataServer/swagger), SourceForge `sro-server-emu` (C18, C17).
- **vSRO-ServerAddon** (C29) : patche les binaires officiels 1.188 par DLL — c'est ainsi que les PS ajoutent D13/D14+ custom.
- **ISRORCertBill** (C16) : réimplémente le serveur de certification iSRO-R (protocole complet).

---

## 🤖 Bots, API et logs de données

### RSBot (open source) — la référence pour les structures de données

- **Repos** : https://github.com/SDClowen/RSBot (miroirs myildirimofficial, Silkroad-Developer-Community ; releases jusqu'à **v2.10.0**, activité 2025+). Licence copyleft (GPLv3/AGPL-3). 195★/791 commits (C8).
- Architecture pilotée par les **packets du jeu** ; système de plugins C#/VB.NET/F# ; pathfinding NavMesh.
- **Clients supportés** (liste du README = carte des versions/serveurs existants) : iSRO, TRSRO, cSRO (ICCGame), JSRO, **KSRO**, **vSRO 188/193/274**, VTC Game, Digeam/TSRO 110, ruSRO, **BlackRogue 100/110**.
- Historique : annoncé sur elitepvpers (« RSBot open source Silkroad Online bot has been released », https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4974197-rsbot-open-source-silkroad-online-bot-has-been-released-3.html).
- **Usage extraction** : les handlers de packets (spawn de monstres, stats d'items, drops) constituent des **structures de données prêtes à l'emploi** pour récolter HP/niveaux/drops sur n'importe quel serveur, y compris KSRO.

### phBot (propriétaire, API publique)

- **API plugins** : https://plugins.phbot.org/phbot-api — `get_drops()` (items au sol), `get_inventory()`, `log()` ; guide : https://guide.phbot.org ; plugins exemples : JellyBitz/phBot-xPlugins (C10).
- **Unique Spawn Logging** (plugin communautaire, opcode 0x300C) : https://forum.projecthax.com/t/unique-spawn-logging/5280 — détection des spawns d'uniques en temps réel (base des trackers comme M3 Stats/stats.projecthax).
- Guide officiel : alchimie, démontage en éléments, onglet Inventory détaillé (https://guide.phbot.org/phbot/inventory).
- Tolerance officielle des bots sur certains PS (SENSATION staff : « PhBot, SBot, RSBot » — A1).

### Trackers de stats (données massives en continu)

- **stats.projecthax.com** (S2) : 26 serveurs officiels, feed kills d'uniques + chat global + population/capacité.
- **m3stat.com** (S1) : stats iSRO (serveurs, guildes, uniques) → source de la table HP ci-dessus.
- **silkr.online/history/unique** (A10), **silkroadgenesis.com/player/M3/unique-info** (A11) : trackers de PS.

### Sécurité / protocole (pour l'écriture d'outils)

- **SilkroadSecurityApi** (pushedx/Drew) — ports : **pySilkroadSecurity** (Python, ProjectHax C13), **EasySSA** (proxy logger, Dentrax C12), **Silkroad.Net** (.NET 6, C14), implémentation C# dans blackcatproject (C30), miroir Gitee (C31). Doc : wiki SilkroadDoc « Silkroad Security » (handshake, chiffrement).

---

## 🏛️ Rôle des serveurs privés dans la conservation du jeu

1. **Archives de clients** : le fil « Silkroad Online Client Archive » (D1, florian0, 4 ans de collecte clients + files serveur) est LE projet d'archéologie — mais les **torrents sont morts** (confirmé par D10) ; les mirrors restants sont sur RaGEZONE (v188/v193/v10.0, D2) et silkroadforums (client officiel v1.400 de 2013, D9). Aucune collection archive.org du MMO.
2. **Conservation des données officielles** : les bases SQL v1.188 « originales, propres, toutes zones et donjons officiels » (D4) et les releases de tables `_RefObj*` (D5) figent l'état officiel du jeu — c'est **la** source secondaire pour restaurer des données officielles disparues.
3. **Restauration de contenus jamais activés** : Devil's Garden et Petra Maze existaient dans les fichiers du client sans activation officielle avérée ; la communauté les a « fixés » (bugs de synchronisation de mouvement corrigés, D8) et Shambhala (officiel 2018) a vu ses fichiers complets relâchés (D7) — les PS font de l'**archéologie de contenu** en avance ou en marge de l'officiel (le fil S5 note que le PS Myth avait du contenu Arabia dès 2012, avant l'officiel de 2015).
4. **Mémoire technique** : SilkroadDoc (C1), Silkroad-Database-Documentation (C2), RSBot (C8) et les émulateurs (C17-C19) documentent formats, packets et mécaniques — indispensables après l'archivage du repo SilkroadDoc (juin 2025).
5. **Relais de population** : avec le déclin iSRO (le « deep dive » Reddit https://www.reddit.com/r/silkroadonline/comments/1ub2aiq/ documente l'exode vers les PS et le mobile), les PS et Origin Mobile sont désormais les principaux lieux où le contenu 120-140 vit encore.

---

## ❓ Incertitudes et pistes non résolues

1. **Cap exact et roadmap d'Origin Online** : le site affiche « Current Cap Level 120 » (2026) mais une mention Reddit évoque du contenu 140 et le fil tier-list parle de l'expérience du joueur « jusqu'au 140 cap » (sur d'autres serveurs). Cloudflare bloque la vérification profonde du forum. → À re-vérifier manuellement (forum.playorigin.com, section News).
2. **HP de Roc (1 451 891 045 selon M3 Stats)** : ordre de grandeur très atypique vs Medusa (183 M). Possible version raid/événement, agrégat de resets, ou artefact du tracker. À recouper avec un dump client (`characterdata.txt`).
3. **Absence de HP pour les uniques 130+** (Benephika, Giant Overlord, Kalia, ROC) : M3 Stats s'arrête à Merikh 125. Les PS ne publient pas leurs HP modifiés. → Extraction client nécessaire.
4. **Stats chiffrées DG12/DG13/DG14** : aucune table de stats complète trouvée en ligne (les YouTube showcases sont visuels ; le guide blader D13 elitepvpers est derrière Cloudflare et n'a pas pu être lu intégralement). Le degré max couvert par silkroadonline.wiki (client v1.657) n'est pas confirmé — si v1.657 < D14, il faudra extraire un client plus récent.
5. **Statut officiel exact de Devil's Garden / Petra Maze** : « fichiers officiels, activation débattue » selon les vétérans d'elitepvpers (S5). Les PS les utilisent comme contenu standard ; l'officiel n'en fait (à notre connaissance) pas de donjon public documenté.
6. **Dates précises des caps iSRO par serveur** (Kratos/Hebe/Kali/Hebe-only 140) : les posts Facebook officiels sont datés de manière ambiguë par les moteurs ; la chronologie Legend I→IX est solide mais les jours exacts des vagues 120/140 varient par serveur.
7. **Populations high-cap** : les compteurs sro.gg (3,6k Hype-R, 4,3k Victoria Rohan) sont auto-lus sur les sites des serveurs (non audités) ; seule la méthode Discord (Nostalgic.gg) est fiable, et elle ne couvre pas tous les high-caps.
8. **Silkroad Origin Mobile item DB structurée** : le wiki officiel est en format guide ; aucune API/db d'items publique identifiée malgré le cap 140/DG14 officiel — piste à creuser (appli mobile + wikis communautaires mobile).
9. **Contenu du topic GitHub « silkroadpk2 »** (C19) : un « GFXFileManager.dll reimplementation + PK2 toolkit » y est listé mais le repo exact n'a pas été isolé — à explorer directement sur GitHub.

---

## 🏆 Top 5 trouvailles

1. **La table HP des uniques officiels 111+ (M3 Stats)** — Kidemonas 120 : 13 851 102 HP ; Karkadann 123 : 15 023 129 ; Merikh 125 : 18 372 504 ; Medusa 100 : 183 535 199 (plus toute la chaîne TG→Shaitan). https://www.m3stat.com/uniques — comble la lacune « HP des boss 111+ » de la KB avec des valeurs mesurées sur serveurs officiels iSRO.
2. **SENSATION-iSRO (srocave)** — une fiche technique complète de serveur cap 140 : répartition des élixirs/pierres par zone et par degré (D12 Alexandrie 101-114 → D15 Shambala 130-140), drops par unique (proof stones, taux 0,2 %/0,5 %/40 %/100 %), path d'upgrade DG16, silk/heure. https://srocave.com/konular/sensation-isro-140-cap-no-p2w-100-play-to-earn-unique-job-based-join-the-adventure.3252
3. **La clarification officiel vs custom des degrés** — D12/D13 = officiels (cap 120, Temple of Jupiter, confirmé par la page Facebook officielle), D14 = officiel cap 125 (Legend IX Arabian Nights, janv. 2015), D15 = officiel cap 130 (mai 2016), cap 140 = 2018 (Shambhala/Ice Temple/Fire Temple) ; seul le >D15 est custom. Sources : Facebook officiel + threads elitepvpers 4785835 / 4454105 / 3565598. **Cela valide la majorité des données « DG12-DG15 » des PS comme dérivées officielles.**
4. **L'écosystème d'extraction moderne et sourcé** — pk2_mate (Rust), SRO.PK2API (C#), SR_Db2Media, SilkroadInformationAPI, SRO Archive Explorer (PK2 + viewer 3D + skills, 2025) + SilkroadDoc (archivé mais wiki vivant) + bases SQL v1.188 complètes : tout ce qu'il faut pour extraire nous-mêmes les données KSRO.
5. **stats.projecthax.com** — suivi LIVE de 26 serveurs officiels (7 iSRO, kSRO, cSRO-R, TRSRO…) : population, capacité, kills d'uniques, chat global. Outil de veille unique sur la santé du jeu officiel (et modèle d'architecture pour un tracker SRObro).

---

*Fin du rapport — généré le 2026-10-01 après ~30 requêtes web EN et ~18 lectures de pages. Aucune donnée sans URL. Marqueurs [OFFICIEL] / [OFFICIEL-DÉRIVÉ] / [CUSTOM] appliqués à chaque donnée chiffrée.*
