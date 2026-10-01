# Technical Specifications - Silkroad Online (Spécifications du Jeu Officiel)

> ⚠️ **Révision majeure (2026-10)** : ajout des **spécifications du jeu officiel** extraites de [SilkroadDoc (DummkopfOfHachtenduden)](https://github.com/DummkopfOfHachtenduden/SilkroadDoc/wiki) — protocole client-serveur, handshake de sécurité, opcodes, architecture serveur vSRO, formats de fichiers client (pk2) et structures `_RefSkill`. Les sections « stack navigateur / React » (dupliquées du Development Technical Guide) ont été retirées → voir [DEVELOPMENT_TECHNICAL_GUIDE.md](DEVELOPMENT_TECHNICAL_GUIDE.md) pour l'architecture SRObro.
> ✅ **Ajout (recherche VSRO 2026-10)** : nouvelle section **« Configuration serveur officielle (vSRO 1.188) »** — `server.cfg` clé par clé (IBUV/CAPTCHA, AutomatedPunisher, fee rates, flags d'événements, LOCALE), `srNodeType.ini`/`srShard.ini`, contradiction des unités de rates documentée, ~40 commandes GM, procédures stockées métier, anti-cheat reconstitué (GameGuard → HackShield → XTrap + défenses serveur). Source : [ML_RESEARCH/RESEARCH_VSRO_SERVER.md](ML_RESEARCH/RESEARCH_VSRO_SERVER.md).

## 📋 Table des Matières
- [Overview](#-overview)
- [Architecture Officielle du Jeu](#-architecture-officielle-du-jeu)
- [Fichiers Serveur Officiels (Fuités) — Recherche PS 2026-10](#-fichiers-serveur-officiels-fuités--recherche-ps-2026-10)
- [Configuration serveur officielle (vSRO 1.188) — Recherche VSRO 2026-10](#-configuration-serveur-officielle-vsro-1188--recherche-vsro-2026-10)
- [Protocole Réseau Officiel (TCP)](#-protocole-réseau-officiel-tcp)
- [Core Systems](#-core-systems)
- [Formulas and Calculations](#-formulas-and-calculations)
- [Database Specifications](#-database-specifications)
- [Structures Officielles _RefSkill / _RefObjCommon](#-structures-officielles-_refskill--_refobjcommon)
- [Référence d'Implémentation Serveur](#-référence-dimplémentation-serveur)
- [Balance Constants](#-balance-constants)
- [Timings Officiels Récapitulatifs](#-timings-officiels-récapitulatifs)
- [References](#-references)

---

## 🎯 Overview

Ce document regroupe les **spécifications techniques du jeu officiel Silkroad Online** utiles au clone navigateur SRObro :

- **Protocole client-serveur officiel** (format des packets, sécurité, opcodes) — documenté par la communauté (SilkroadDoc, pushedx, florian0) à partir de vSRO 1.188
- **Architecture serveur officielle** (Gateway/Agent, ports, modules)
- **Formats de fichiers client** (.pk2 et formats internes « JMX »)
- **Formules et constantes du jeu** (XP/SP, GAP, dégâts, drops) — vérifiées communauté
- **Schémas BDD SRObro** (adaptation SQL des données du jeu) + structures officielles `_RefSkill`

**Disclaimer :**
- Les packets/formats analysés proviennent de **vSRO 1.188** ; une autre version du client peut présenter des différences (source : SilkroadDoc).
- Les formules de dégâts/XP officielles de Joymax ne sont pas publiques : celles ci-dessous sont des **approximations vérifiées par la communauté**.

---

## 🏛️ Architecture Officielle du Jeu

### 1. Client

```
sro_client.exe     : client de jeu (DirectX, moteur maison "BS" de Joymax)
silkroad.exe       : launcher (vérification de version + patch)
.pk2               : archives de données (voir formats ci-dessous)
```

**Fichiers de configuration client (extraits du dossier d'installation) :**

| Fichier | Rôle |
|---|---|
| `DIVISIONINFO.TXT` | Liste des « farms »/divisions et des **IP des Gateway servers** (struct : ContentID/locale, divisionCount, {nom, gatewayCount, IP[]}) |
| `GATEPORT.TXT` | **Port du Gateway : 15779** |
| `SV.T` | Serveurs/voisins |
| `SilkCfg.dat` / `SROptionSet.dat` / `wndpos.dat` | Config client (options UI, positions) |

### 2. Archives .pk2 (format JMXPACK)

```
Header  : 30 octets "JoyMax File Manager!" + version (0x02000001) + flag Encrypted + Verify[16] (test de clé Blowfish) + reserved[205]
Blocks  : chaînes d'entrées de 128 octets (20 entrées par bloc)
Entrée  : Type (0=vide, 1=dossier, 2=fichier) · Name[89] · CreateTime/ModifyTime (FILETIME Windows)
          · Position · Size · NextChain (répertoire suivant) · Padding[2]
```
- Les entrées sont **chiffrées Blowfish** (clé statique embarquée dans le client — voir « More about PK2 Internals », pushedx).
- Un même format `.pk2` contient media (items/skills/quests en .txt), particules, modèles, map data.

**Formats internes « JMX » documentés (moteur BS) :**

| Extension | Format | Contenu |
|---|---|---|
| `.pk2` | JMXPACK | Archive de données |
| `.nvm` | JMXVNVM | Nav mesh (navigation IA) |
| `.dof` | JMXVDOF | Données de donjon |
| `.bsr` | JMXVRES | Ressource composée (référence mesh/mat/anim) |
| `.cpd` | JMXVCPD | Compound |
| `.bms` | JMXVBMS | Mesh |
| `.bmt` | JMXVBMT | Matériaux |
| `.ddj` | — | Textures (DDJ) |
| `.bsk` | JMXVBSK | Squelettes |
| `.ban` | JMXVBAN | Animations |
| `.efp` | JMXVEFF | Particules/effets |
| `.o2` `.m` `.t` `.mfo` `.ifo` | JMXVMAP* / JMXVOBJI / JMXV2DTI | Objets de carte, meshes/textures de map, index |
| `.2dt` | NewInterface | UI |

**Spécifications du moteur (SR engine, utiles pour un rendu WebGL fidèle) :**
- Repère **main gauche, Y vers le haut** (left-handed, Y up)
- **Vertex winding clockwise** (critical pour le face culling)
- UV : U gauche→droite, V bas→haut

### 3. Architecture serveur officielle (vSRO 1.188)

```
[CERTIFICATION] ← authentification inter-processus
      ↓ ordre de démarrage :
SR_MachineManager → SR_GlobalManager → SR_GatewayServer → SR_AgentServer → SR_ShardManager → SR_GameServer
```

| Module | Rôle | Port usuel |
|---|---|---|
| **SR_GatewayServer** | 1ᵉʳ point d'entrée client : patch/notice/shard list/login → délivre le **token + IP/port de l'Agent** | **15779** (TCP, `GATEPORT.TXT`) |
| **SR_AgentServer** | Connexion de jeu (auth par token, personnages, monde) | **15884** (TCP) |
| SR_MachineManager / SR_GlobalManager / SR_ShardManager / SR_GameServer | Orchestration interne, logique de monde | internes (non exposés) |

- **Base de données : MSSQL** — bases `SRO_VT_ACCOUNT`, `SRO_VT_SHARD`, `SRO_VT_LOG` ; billing via IIS.
- Le **client ne parle jamais directement** au GameServer : tout passe par Gateway (login) puis Agent (jeu) — d'où le flux « token » décrit ci-dessous.
- 🛠️ Détail de l'architecture **SRObro** (Node/WebSocket) → [DEVELOPMENT_TECHNICAL_GUIDE.md](DEVELOPMENT_TECHNICAL_GUIDE.md).

---

## 📂 Fichiers Serveur Officiels (Fuités) — Recherche PS 2026-10

> ✅ **Ajout (recherche PS 2026-10)** : les **fichiers serveur officiels fuités** fournissent la description du **fonctionnement officiel** la plus fiable disponible — écrite par le leaker lui-même (« Chernobyl », guide du **13/09/2011**, fuite du service officiel vietnamien vSRO). Inventaire des fuites : vSRO 1.188 (Vietnam, sept. 2011, cap 110/D11) · 1.193/1.274 (2012, + Jupiter 110-120) · BlackRogue = service officiel **thaïlandais** (ini3, package `SRO_Thailand_CS_106`) · tSRO 1.258 (Taïwan) · jSRO · cSRO-R · iSRO-R « Rigid » 2015 · iSRO/KSRO (cap 125+, 14DG). Rapport complet : [ML_RESEARCH/RESEARCH_PS_FILES.md](ML_RESEARCH/RESEARCH_PS_FILES.md) · panorama des serveurs : [39_PRIVATE_SERVERS.md](39_PRIVATE_SERVERS.md)

### Ordre de démarrage officiel des 9 modules (vSRO 1.188)

```
1. Custom certification server  (port 32000 — « Certifier » + scripts ASP/IIS, interface SMC)
2. SR_GlobalManager             (coordination globale)
3. SR_MachineManager            (enregistrement/certification des machines)
4. DownloadServer               (patchs client)
5. GatewayServer                (liste de serveurs affichée au client)
6. SR_FarmManager               (gestion de ferme de shards)
7. AgentServer                  (relais clients → world — LIMITE OFFICIELLE : 1000 joueurs/AgentServer)
8. SR_ShardManager              (un « shard » = un monde, connexions DB)
9. SR_GameServer                (le monde de jeu lui-même)
```

- Cette liste **complète** la vue simplifiée ci-dessus (certification + DownloadServer + FarmManager en étaient absents) et **inverse** l'ordre GlobalManager/MachineManager. Source : [RaGEZONE — Setting up a server based on VSRO server files (Chernobyl, 13/09/2011)](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273) — fiabilité 5 (le leaker lui-même).
- **3 bases MSSQL** : `SRO_VT_ACCOUNT`, `SRO_VT_SHARD`, `SRO_VT_SHARDLOG` (+ DB « SKILL » séparée dans certaines versions BR/tSRO). **Schémas publics des ~200 tables de la shard** : [ducksoup — Database/VSRO188](https://github.com/ducksoup-sro/ducksoup/tree/main/Database/VSRO188).
- **Certification** : serveur d'authentification maison sur le **port 32000** + scripts **ASP/IIS** pour le billing ; le **SMC (Server Management Console)** pilote l'ensemble (AUTO START : Gateway/Agent/GlobalManager/GameServer).
- **Répartition du monde** : la table **`_RefRegionBindAssocServer`** assigne chaque région à un GameServer (**0 = désactivée, 1/2/3 = GS1/2/3**) — **un seul GameServer ne peut pas charger toutes les régions** : le monde officiel tournait en **grille de plusieurs gameservers par régions**.

### Rates serveur (server.cfg) — ⚠️ deux conventions contradictoires documentées

```
Modèle A (guides de rates) : taux réel = valeur / 1000
ExpRatio 1000        = ×1 · ExpRatio 35000 = ×35
ExpRatioParty        = multiplicateur de party (ex 4500 = ×4.5) · ExpRatioPartyBonus (ex 3000 = ×3)
DropItemRatio        = fréquence de drop (même formule /1000)
DropGoldAmountCoef   = or par monstre (2 = double) · HwanGainFactor = vitesse de gain du Zerk

Modèle B (dump réel d'une config 1.188 — RaGEZONE 780273 page 33) :
ExpRatio 100 · ExpRatioParty 100 · DropItemRatio 0,1 · DropGoldAmountCoef 0,1
← lisible comme ×1 / ×1 / 0,1 / 0,1 (le fix BlackRogue dit « edit the 100 »)
```

- ⚠️ **Contradiction non tranchée (✅ recherche VSRO 2026-10)** : les **guides** ([TopGameServer](https://topgameserver.net/drop) : « 1000 = x1, 5000 = x5, 35000 = x35 » ; guide elitepvpers) utilisent massivement l'échelle /1000, mais le **dump réel d'une config 1.188 saine** ([RaGEZONE 780273, page 33](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273/page-33)) montre `ExpRatio 100` / `DropItemRatio 0,1` — lisible comme « 100 = ×1 » ; et le fix des rates BlackRogue dit « edit the 100 » ([epvp](https://www.elitepvpers.com/forum/sro-private-server/3308860-blackrogue-110-rates-fix.html)). Possibles conventions différentes selon les générations de files (1.188 vs 1.274 vs BR) ou confusion récurrente des guides. **À trancher par mesure en jeu** (`/mobkill 0` sur un mob de référence + comparaison de l'EXP). Le dump (coefficients décimaux 0,1) plaide pour le modèle « pourcentage/décimal » sur 1.188 — non confirmé.
- Les rates se chargent **en mémoire au démarrage** → **restart complet du GameServer** requis pour tout changement. Sources : [TopGameServer — How to Change vSRO EXP and Silk Rates](https://topgameserver.net/drop) · [miroir elitepvpers du guide du leaker](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1433603-guide-setting-up-server-based-vsro-server-files.html) · [dump page 33](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273/page-33).
- **EXP et SP sont liés en vanilla** — le patcher « EXP/SP Rates splitter » les découple en patchant les floats de `SR_GameServer.exe` ([RaGEZONE — EXP/SP Rates splitter](https://forum.ragezone.com/threads/exp-sp-rates-splitter.870955)).
- Autres clés de rates documentées : `SilkOwnTime` (délai avant qu'un silk acheté soit « possédé »), `SilkPerHour`, `SilkDropRate`.
- ⚖️ Rappel : ces files restent la propriété de Joymax/Wemade — recensées ici **à des fins de documentation uniquement** (précédent Joymax c. ECSRO, cf. rapport PS §9).

---

## ⚙️ Configuration serveur officielle (vSRO 1.188) — Recherche VSRO 2026-10

> ✅ **(recherche VSRO 2026-10)** : la **configuration officielle clé par clé**, documentée à partir du dump complet d'une config 1.188 en production posté par l'utilisateur **stefsika** dans le thread du leaker ([RaGEZONE 780273, page 33](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273/page-33) — le document de config le plus complet disponible publiquement), complété par le post principal du guide ([page 1](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273)), la page 4 (SMC/capacité — [RZ page 4](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273/page-4)) et le [Official-vSRO Error Thread](https://forum.ragezone.com/threads/official-vsro-error-thread-solution-collection-please-contribute.812346/). Rapport intégral : [ML_RESEARCH/RESEARCH_VSRO_SERVER.md](ML_RESEARCH/RESEARCH_VSRO_SERVER.md) · écosystème : [39_PRIVATE_SERVERS.md](39_PRIVATE_SERVERS.md).

### 1. `server.cfg` — un bloc par module (lu au démarrage, restart requis)

Valeurs littérales du dump (les virgules décimales `0,1` viennent d'un collage par un utilisateur francophone) :

```ini
Common {
    debug_option_debugger_present false            ← flags de debug par module
    debug_option_console_present false
}

GlobalManager {
    Certification "10.67.15.85", 32001              ← IP + port du serveur de certification
    LoginFailureTolerance 3                        ← échecs de login tolérés avant punition
    IBUVFailureTolerance 3                         ← échecs de CAPTCHA (image) tolérés
    LoginFailureBlockTimeMin 10                    ← durée de blocage (min) après échecs login
    IBUVFailureBlockTimeMin 10                     ← idem après échecs CAPTCHA
    AutomatedPunisher "AutomatedPunisher"          ← module de punition automatique (le blocage était
                                                    ← autrefois fait par commande GM — commentaire coréen d'origine)
    LoginPunishmentGuide "Illegal logging detected"        ← messages affichés au joueur
    IBUVPunishmentGuide "Illegal code string detected"     (+ Login/IBUVPunishmentDescription)
}

GatewayServer {
    LastFullVersion_SR_Client 130                  ← version minimale du client acceptée
    Certification "", 32000
    IBUVQueueReserveCount 20000                    ← nb d'images de CAPTCHA pré-générées (commentaire coréen d'origine)
    IBUVQueuePrepareRatio 0.05                     ← ratio de régénération des images en temps d'idle
    IBUVFailureIPTolerance 0                       ← échecs CAPTCHA tolérés PAR IP (0 = aucun blocage)
    IBUVStringSize 6                               ← taille du code : 3 si jeu de caractères coréen, 6 si latin
    IBUVCharacterSet "ABCDEFGHLMNQRTabdehimn2345678"   ← alphabet du CAPTCHA
}

DownloadServer { Certification "", 32000 }
FarmManager     { Certification "", 32000 }
MachineManager  { Certification "", 32000 }

AgentServer {
    Certification "", 32004                        ← certifié en premier, relais clients
}                                                 ← LIMITE OFFICIELLE : 1000 utilisateurs/AgentServer

SR_GameServer {
    Certification "", 32004
    ExpRatio 100                                   ← taux EXP (⚠️ unités contestées, cf. §4)
    ExpRatioParty 100                              ← taux EXP en groupe
    DropItemRatio 0,1                              ← fréquence de drop d'items
    DropGoldAmountCoef 0,1                         ← coefficient d'or par monstre
    WINTER_EVENT_2009 0                            ← flags d'événements historiques Joymax (EVENT_ON/EVENT_OFF)
    EUBUSINESS_EVENT 0
    GOLDEN_PIG_FEBRUARY_EVENT 0
    THANKS_GIVING_EVENT 0
    LIBERATION_EVENT 0
    LOCALE LOCALE_VIETNAM                          ← locale régionale du service (« for Helper mark »)
    SET_FEE_RATE "0,5,5,5"                         ← frais de pose (stall), 3 paliers — ifdef OPEN_MARKET_SYSTEM
    SELL_FEE_RATE "0,10,10,10"                     ← frais de vente en consignation, 3 paliers
}

SR_ShardManager {
    UserID "sa" / Password "..."                   ← identifiants MSSQL
    GlobalManager "IP", 32001 · MachineManager "IP", 32000 · Certificate "IP", 32004
    BILLING_SERVER_URL "http://<IP>:1337/"         ← billing ASP/IIS (DBConnect.asp)
    CREST_FTP_URL "ftp://crest:<pass>@<IP>"        ← FTP des crest de guilde
    ExtraExpRatio 0,1                              ← bonus EXP global du shard
    ChristmasEvent2007 0                           ← flag événement historique
    SERVER_EVENT_SYSTEM ON                         ← système d'événements serveur
    FlagEvent 0/1                                  ← event flags par serveur
    HourForMeterRateLevelFirst 22 / Second 23      ← « heures pleines » (interprétation plausible non attestée)
    BattleArenaRandom 1 · BattleArenaParty 1 · BattleArenaGuild 1 · BattleArenaJob 1
    ArenaMatchOccupy 1 · ArenaMatchFlag 1 · ArenaMatchPoint 1
}
```

**Lecture pour SRObro** (✅ recherche VSRO 2026-10) :
- **`IBUV*` = le CAPTCHA officiel de login** (« Image-Based User Verification » — opcodes 0x2322/0x6323/0xA323 documentés dans la section Protocole) : **20 000 images pré-générées** (régénérées en tâche de fond à hauteur de `IBUVQueuePrepareRatio 0,05`), code de **6 caractères** (3 si jeu de caractères coréen) sur l'alphabet restreint `ABCDEFGHLMNQRTabdehimn2345678`, tolérance d'échecs par IP configurable (0 = pas de blocage), punition automatique — **le système anti-bot de login du jeu officiel, documenté dans ses moindres paramètres**, y compris les commentaires coréens d'origine des ingénieurs Joymax conservés dans les files.
- **`AutomatedPunisher`** : composant nommé du GlobalManager qui applique les blocages (3 échecs login ou CAPTCHA → 10 min) — preuve d'une architecture punitive officielle anti-abus.
- **`SET_FEE_RATE "0,5,5,5"` / `SELL_FEE_RATE "0,10,10,10"`** = les frais de l'économie joueur : **5 % de frais de stall (pose), 10 % de frais de consignation** par défaut (3 paliers) — constantes économiques officielles.
- **Flags d'événements** (Winter 2009, Golden Pig février, Thanksgiving, Liberation, Christmas 2007) : le calendrier événementiel officiel passé est **pilotable par config** (EVENT_ON/EVENT_OFF).
- **`LOCALE LOCALE_VIETNAM`** gravé dans la config : preuve interne de l'origine vietnamienne du service (cf. fuite vSRO 2011).

### 2. `srNodeType.ini` — la topologie officielle : 48 nœuds, 6 machines × 3 Agents × 2-3 Gateways

| Fichier | Rôle | Clés documentées |
|---|---|---|
| **`srNodeType.ini`** | Inventaire des nœuds de la ferme — **48 entrées** | `[entry] id, operation_type, name` — `operation_type 22` = machine physique, `17` = processus serveur, `0` = Certification Manager (`id=133`) ; ids jusqu'à 831 ; `machine_manager_node_id` 1901-1919 pour la 6ᵉ machine |
| **`srGlobalService.ini`** | Déclare le GlobalManager | `[global] count=1` ; `[entry0] operation_type=22, name="SRO_Vietnam_TestLocal"` (⚠️ 2ᵉ preuve interne d'origine vietnamienne), query ODBC, `global_manager_node_id=697` |
| **`srShard.ini`** | Déclare un shard | `id=64`, `name=Server1`, `global_operation_id=20`, **`capacity` 2300 dans le dump officiel** (1000 chez stefsika — la capacité est modifiable, [RZ page 4](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273/page-4)), `shard_manager_node_id=705`, `query`/`query_log` (DSN ODBC vers SHARD/LOG), `u1=240 u2=208 u3=17 u4=1 u5=0 u6=0 u7=0` (slots/ratios internes **non documentés**) |
| **`machine.ini`** | Déclare une machine au MachineManager | nom de machine + IP réseau devant matcher la première carte réseau ([r10dev — MachineManager config](https://r10dev.net/konular/vsro-machinemanager-configuration-guide.16078)) |
| `cert.ini` (repacks récents) | Config du serveur de certification custom | [r10dev — installation guide](https://r10dev.net/konular/vsro-server-files-installation-guide-full-setup.5504) |
| `DBConnect.asp` | Script ASP/IIS du billing | chaîne SQL + vérification compte/silk (guide du leaker) |

**🏆 La pépite topologique (S2)** : le dump déclare la **topologie officielle du service vietnamien** — le paquet original porte les machines `Main_machine` et `2nd_machine` (GlobalManager `GWS1`, FarmManager+GameServer `FMGS1`), et la section complétée déclare **6 machines SD (`SDMGS1`..`SDMGS6`)** portant chacune **3 AgentServers (`SDnAGS1-3`)** et **2-3 GatewayServers (`SDnGAS1-3`)**. La base 1.188 était donc un **environnement de test à 6 machines** — cohérent avec la limite « un seul GameServer ne peut pas charger toutes les régions » (`_RefRegionBindAssocServer`).

### 3. Certification — comment un module s'enregistre (rappel opérationnel)

1. Le Certification Manager (nœud `id=133`, `operation_type 0`) écoute sur le **port 32000** ; chaque module déclare `Certification "<IP>", <port>` : **32001** GlobalManager, **32000** Gateway/Download/Farm/MachineManager, **32004** AgentServer/SR_GameServer/SR_ShardManager.
2. Un module **non déclaré dans `srNodeType.ini` ne peut pas se certifier** (erreur type « Cannot certify server body [IP] ») ; la certification **lit l'IP de la première carte réseau** — les adaptateurs virtuels (Hamachi/VMware) la cassent (outil communautaire `srPatcher_1.0.6` « spoof ip »).
3. Le GlobalManager affiche « **Max User Count Restriction Per IP : system default(infinite)** » — la limite de connexions par IP est un **réglage officiel du GlobalManager**.
Sources : guide du leaker (S1) · dump (S2) · [Error Thread](https://forum.ragezone.com/threads/official-vsro-error-thread-solution-collection-please-contribute.812346/) (S6).

### 4. Rates : contradiction des unités documentée (non tranché)

| Modèle | Sources | Détail |
|---|---|---|
| **« valeur = pourcentage, 100 = ×1 »** | **Dump réel 1.188** (S2) : `ExpRatio 100`, `ExpRatioParty 100`, `DropItemRatio 0,1`, `DropGoldAmountCoef 0,1` ; fix BlackRogue « edit the 100 » ([epvp — BR 110 Rates fix](https://www.elitepvpers.com/forum/sro-private-server/3308860-blackrogue-110-rates-fix.html)) ; SR_ShardManager BR pré-patchés ([RZ 1068146](https://forum.ragezone.com/threads/blackrogue-110lv-shard-rate-fix.1068146)) | Valeurs par défaut d'une config 1.188 saine lisibles comme ×1/×1/0,1/0,1 |
| **« valeur = millièmes, 1000 = ×1 »** | [TopGameServer](https://topgameserver.net/drop) (« values stored as integers multiplied by 1000 ; 1000 = x1, 5000 = x5, 35000 = x35 ») + guide elitepvpers ; exemple `ExpRatioPartyBonus 3000` = ×3 | Les guides de rates utilisent massivement l'échelle /1000 |

→ Possibles conventions différentes selon les générations de files (1.188 vs 1.274 vs BR) ou confusion récurrente des guides. **À trancher par mesure en jeu** (`/mobkill 0` sur un mob de référence, comparer l'EXP). Le dump (coefficients décimaux 0,1) plaide pour « pourcentage/décimal » sur 1.188 — non confirmé (cf. §Rates de la section « Fichiers Serveur Officiels » ci-dessus).

### 5. Commandes GM (~40 documentées, syntaxe exacte)

> 📌 Sources : thread RaGEZONE « GM Commands » ([781576](https://forum.ragezone.com/threads/gm-commands.781576) + [page 2](https://forum.ragezone.com/threads/gm-commands.781576/page-2)) — dont plusieurs posts de **Chern0byl, le leaker lui-même** (fiabilité 5) — complété par [r10dev — GM Commands](https://r10dev.net/konular/vsro-gm-commands-list-silkroad-online-gm-codes-guide.5380) et [r10dev — GM Console F1](https://r10dev.net/konular/vsro-gm-console-f1-commands-list-silkroad-gm-command-guide.5384).

**Accès** : niveau GM = colonnes **`sec_primary`/`sec_content` de `TB_User`** (`SRO_VT_ACCOUNT`) — « if you don't set this, no GM features » (leaker). Dans le client GM : **F1 = liste des commandes, F2 = liste des monstres, F3 = liste des items**.

| Commande | Effet documenté |
|---|---|
| `/makeitem <ITEM> <plus> <nombre>` | créer un item (ex `/makeitem ITEM_CH_BOW_11_A_RARE 10 1`) ; équivalent SQL `EXEC _ADD_ITEM_EXTERN` |
| `/loadmonster <MOB> <nombre>` | spawner N monstres (ex `MOB_RM_ROC` — le Roc) |
| `/zoe <MOB> <nombre>` | **spawner ET tuer N fois** le monstre → drops + EXP + SP (« pure GM greed plugin » — posté par le leaker lui-même, ex `/zoe MOB_RM_ROC 50`) |
| `/zoe2 <MOB> <nombre>` | variante : **drops seulement**, sans EXP |
| `/mobkill [0]` | tue le mob sélectionné ; `/mobkill 0` = le tuer **avec EXP et récompenses** |
| `/recalluser <joueur>` · `/movetouser <joueur>` | téléporte le joueur vers le GM / le GM vers le joueur |
| `/gotown` | téléporte au retour de ville le plus proche |
| `/warp <X> <Y>` | téléport visuel aux coordonnées |
| `/ban <char>` · `/bansel` | ⚠️ **ne fait que kicker/déconnecter** (« /ban just kicks » — [epvp](https://www.elitepvpers.com/forum/sro-private-server/4211945-vsro-make-client-disconnect-without-ban.html)) — pas un vrai ban |
| `/invisible` · `/invincible` | mode GM invisible / invincible |
| `/snow` · `/rain` · `/sky <mode>` | déclenchent neige, pluie, changement de ciel |
| `/day` · `/night` | forcent jour/nuit |
| `/gachastart` | démarre le système Magic POP |
| `/spawnunique_all` | fait spawner tous les uniques |
| `/addwp` · `/showwp` · `/delwp` · `/wp <id>` | ajoute/affiche/supprime un waypoint / s'y téléporte |
| `/liner_draw` | dessin de ligne (debug/édit) |
| `/gmskill 0` | retire les skills GM |
| `/setspeed <valeur>` | vitesse de déplacement |
| `/hwanmode` | mode Zerk forcé |
| `/zoom` · `/camera` · `/frame` | zoom caméra illimité / caméra libre / affichage FPS |
| `/ground` · `/mapobj` · `/window` | état du sol / objets de la carte / fenêtre de debug |
| `/char` · `/getcurpos` · `/chatclear` | infos perso / position actuelle (région + X/Y/Z — utilisé pour créer des spawns) / vide le chat |
| `/worldstatus` · `/setoptimizecloth` · `/recallguild` · `/screenshotfull` · `/cursor` | statut monde / optimisation des habits GM / rappel de guilde / capture plein écran / curseur |

- **Vrai ban** : SMC → module dédié **`SR_UserPunishment`** (⚠️ exige le **nom de compte**, pas le nom du perso) ou SQL (`_Punishment` + `_BlockedUser`) ; blocage d'IP : module SMC **IPBlock** (dll `ipblock.dll`). Le ban SQL par nom de personnage est « easier than SMC » ([epvp](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1876233-release-how-ban-player-character-name-database.html)).
- **Silk** : aucune commande GM — par SQL uniquement, table **`SK_Silk`** (`SRO_VT_ACCOUNT`, clé = JID de `TB_User`).
- **Actions temps réel sans commande** : [vSRO-ServerAddon (JellyBitz, MIT)](https://github.com/JellyBitz/vSRO-ServerAddon) — DLL injectée via Stud_PE dans SR_GameServer.exe/SR_ShardManager.exe, **19 actions documentées** (give item avec plus aléatoires, ±gold, set Hwan, téléport, drop près du joueur, spawn mob, body state Berserk/Untouchable/GM Invisible/Stealth, +SP/+EXP, cape PvP, réduction HP/MP…) déclenchées par INSERT SQL dans `_ExeGameServer` (table auto-créée) — l'architecture officielle détournée en file de commandes SQL.

### 6. DB métier — procédures stockées notables (le contrat GameServer ↔ DB)

| Procédure | Base | Rôle documenté |
|---|---|---|
| **`_AddLogItem`** | SRO_VT_SHARDLOG | **hook universel des événements d'items** — signature `(CharID int, ItemRefID int, ItemSerial bigint, dwData int, strSecNo varchar(1)…)` ; ⚠️ **`@Operation = 41` = consommation d'item** = le déclencheur standard des scrolls customs (Mercenary Scroll : `@ItemRefID between 47023 and 47037` — [vsro.org](https://www.vsro.org/konular/mercenary-scroll-cozumu.2621)), du model switcher (`EXEC SRO_VT_SHARDLOG.dbo._NOVA_SWITCHER`) et du mod « Plus Auto Notice ». Condition : le GameServer doit réellement écrire dans SHARDLOG, sinon rien ne se déclenche |
| **`_AddTimedJob`** | SRO_VT_SHARD | écrit les **effets temporisés** (buffs, penalties) — table `_TimedJob` (aussi garbage des buffs premium) ; **JobID 1 = penalty de guilde, JobID 2 = penalty de job** — les privés patchent `if (@JobID=1 or @JobID=2) return -1` pour supprimer les délais de sortie de guilde/job |
| `_AddTimedJobForPet` | SRO_VT_SHARD | variante COS/pets (ex d'inventaire étendu : 112 ou 196 slots) |
| **`_AddNewCOS`** | SRO_VT_SHARD | création de pet/COS — modifiée pour l'inventaire 5/7 pages (`@MaxInventorySize`) |
| `_ADD_ITEM_EXTERN` | SRO_VT_SHARD | donner un item par nom de perso + CodeName + quantité + durabilité (ex avatar GM `ITEM_ETC_AVATAR_M_GM_UNIFORM`) |
| `_SEEK_N_DESTROY_ITEM` | SRO_VT_SHARD | détruire un item chez tous les joueurs (`_RefObjCommon` ↔ `_Items`) |
| **`_Guild_Create` / `_Guild_FnAddMember`** | SRO_VT_SHARD | création/ajout membre de guilde — patchées par les privés : guilde niveau 5 d'office, `@LiMiT 24` membres, union élargie (5 guildes factices `guildname_ULimit_1..5`) |
| `_ManageShardCharName` | SRO_VT_SHARD | **jobs 0/1/2 = ajout/suppression/renommage** de perso — s'appuie sur la table **`SR_CharAppoint`** (absente de la DB par défaut → erreur au premier renommage, fix documenté) |
| `_TRAINING_CAMP_UPDATEHONORRANK` | SRO_VT_SHARD | recalcule les **honor ranks** d'académie (rangs 1-50 de `_TrainingCampHonorRank`) |
| `_GetMediaLines` (créée par la communauté) | SRO_VT_SHARD | **exporte les lignes DB au format textdata client** (Type 1 = items, Type 2 = characters) — l'outil maison de synchro DB→PK2 |

**Constantes live documentées** ([TopS4A — VSRO Query Collection](https://www.tops4a.com/2019/08/query.html)) : `_Char.InventorySize` **max 109 slots** · `DailyPK/TotalPK/PKPenaltyPoint` (remise à zéro PK) · `RemainHwanCount` (5 charges Zerk) · `_ItemQuotation` (`BaseQuot`, `Quot_LB/UB`) = **cotations de l'économie de trade** (« job gold rate ») · `_Punishment`/`_BlockedUser` = ban SQL · `_RefGachaItemSet.Ratio` = taux Magic Pop.

### 7. Anti-cheat officiel reconstitué — GameGuard → HackShield → XTrap + défenses serveur

**Chronologie des protections client** (✅ recherche VSRO 2026-10) :

| Période | Protection | Preuves |
|---|---|---|
| **2005-2007** | **nProtect GameGuard** (INCA Internet) — dossier `GameGuard/` dans `C:/Program Files/Silkroad/` du client officiel ; codes d'erreur 340/350/360/361 = échecs de mise à jour | [nProtect — FAQ officielle](https://gameguardfaq.nprotect.com/eng/con_02.html) · [Silkroad Forums — erreur 340](http://www.silkroadforums.com/viewtopic.php?f=3&t=3859) · contournements d'époque [epvp](https://www.elitepvpers.com/forum/silkroad-online/53522-gameguard-workaround-how-bypass.html) · [ProjectHax](https://forum.projecthax.com/t/removing-gameguard-from-sro-client/23030) |
| **~2008-2009 →** | **HackShield** (AhnLab) remplace GameGuard sur iSRO — **mise à jour officielle annoncée avec Legend V Plus Battle Arena (08/2010)** : « a new update to the game's HackShield anti-cheat system » | [GamesIndustry.biz — annonce officielle](https://www.gamesindustry.biz/silkroad-online-legend-v-plus-battle-arena-update-launched-with-prizes-to-be-won) |
| **2011 (vSRO 1.188)** | **XTrap** — le leaker a publié les « Xtrap update files » avec la fuite ; le client 1.188 demande XTrap au lancement (« using agent server no xtrap » = loader sans XTrap) ; bypass documentés : outil « select 1.188 → remove XTrap » ou **serveur XTrap custom via `silkload.dat`** (IP + chiffrement à reverser) | [epvp — disable x-trap](https://www.elitepvpers.com/forum/sro-private-server/2737981-how-disable-x-trap-1-188-vsro-server-files-client.html) · [vsro.org](https://www.vsro.org/konular/how-to-remove-xtrap-from-sro_client-testin-in-obdg-does-anyone-here-know.4675) · [epvp — XTrap bypass](https://www.elitepvpers.com/forum/sro-coding-corner/1432421-way-create-vsro-xtrap-bypass.html) |
| Toutes époques | **Couche réseau** (header 6 octets, handshake 0x5000 à 5 seeds, security bytes count/CRC, Blowfish sélectif bit 0x8000) — indépendante du choix GameGuard/HackShield/XTrap | [SilkroadDoc — Silkroad-Security](https://github.com/DummkopfOfHachtenduden/SilkroadDoc/wiki/Silkroad-Security) (cf. section Protocole) |

**Défenses côté serveur révélées par les files** :
- **`AgentServer` log « WARNING! A SUSPECT DETECTED!!! MsgID[0x6102] »** : le serveur **détecte et rejette un client suspect par MsgID** — une sonde d'intégrité côté serveur, pas seulement client (mécanisme interne exact non documenté) — [Error Thread](https://forum.ragezone.com/threads/official-vsro-error-thread-solution-collection-please-contribute.812346/).
- **`AutomatedPunisher`** (blocage auto 10 min après 3 échecs login/CAPTCHA) + **CAPTCHA IBUV** (file de 20 000 images, codes 6 caractères, tolérance par IP 0) — cf. §1.
- **Limite d'utilisateurs par IP** du GlobalManager (« Max User Count Restriction Per IP ») + module SMC **IPBlock** + ban `SR_UserPunishment`/`_Punishment` (cf. §5).

---

## 📡 Protocole Réseau Officiel (TCP)

### 1. Format d'un packet (universel Gateway/Agent)

```c
struct Packet {
    WORD size;              // taille de la charge utile (SANS le header de 6 octets)
    WORD opcode;            // identifiant du packet
    BYTE securityCount;     // octet de compteur (client→serveur uniquement ; 0 sinon)
    BYTE securityCRC;       // octet de CRC (client→serveur uniquement ; 0 sinon)
    BYTE data[0..8186];     // charge utile (paquets groupés dans un même recv)
};
```

Règles essentielles (Guide to Silkroad's Security, pushededx) :
- Header de **6 octets** ; un `recv()` peut contenir **plusieurs packets concaténés** → buffer + parse.
- Un packet chiffré est marqué par le bit **`size & 0x8000`** ; la vraie taille = `size & 0x7FF`.
- Chiffrés en **Blowfish** (blocs de 8 octets) : les 2 octets de taille ne sont jamais chiffrés ; opcode + 2 octets de sécurité + payload le sont.
- Les **octets de sécurité** (count + CRC) ne sont générés que par le client ; le serveur les vérifie et **déconnecte** en cas d'échec.

### 2. Handshake de sécurité (connexion)

```
S → C  0x5000  flag 0x0E : { blowfish[8], seedCount(DW), seedCRC(DW), seeds[5](DW) }  (size 0x25)
C → S  0x5000           : { val_A(DW), val_B(DW) }  (réponse challenge, calculée via Func_X_2/Func_X_4)
S → C  0x5000  flag 0x10 : { nouvelle clé blowfish[8] }  (size 0x09) — le client la dérive avec sa clé privée
C → S  0x9000           : {}  (handshake accepté)
```

- **Count byte** : généré par un PRNG seedé avec `seedCount` (algo jMerlin/clearscreen : `GenerateValue` → `SetupCountByte` → `GenerateCountByte`), change à chaque packet envoyé.
- **CRC byte** : `GenerateCheckByte(packet, length, seedCRC)` — checksum type CRC8 sur table, calculé **après** construction du packet (bit 0x8000 déjà posé si chiffré).
- Après le handshake, le Blowfish final chiffre sélectivement les packets « sensibles » (login, etc.).
- 📖 Références : « A Guide to Silkroad's Security » (Drew 'pushedx' Benton, retranscrit dans SilkroadDoc) · articles florian0 (swiftness wiki) : Handshake & Session Control / CRC / Blowfish.

### 3. Flux Gateway (port 15779)

| Opcode | Direction | Nom / contenu |
|---|---|---|
| 0x2001 | C → S | FRAMEWORKMSG_IDENTIFY (identification/version, ex. `SR_Client` + opcode version) |
| 0x2002 | C → S | **KEEP_ALIVE** — envoyé automatiquement par le client après **5000 ms de silence** (packet vide) |
| 0x600D | S → C | **MASSIVE** — conteneur de packets groupés (voir split packets) |
| 0x6100 / 0xA100 | C→S / S→C | GATEWAY_PATCH (patch request / response, massive) |
| 0x6104 / 0xA104 | C→S / S→C | GATEWAY_NOTICE (news) |
| 0x6101 / 0xA101 | C→S / S→C | **SHARD_LIST** — liste des farms puis des shards : `{id, name, onlineCount, capacity, isOperating, farmID}` |
| 0x6106 / 0xA106 | C→S / S→C | SHARD_LIST_PING (résultat + Farm.ID + IP) |
| 0x6102 / 0xA102 | C→S / S→C | **LOGIN** (chiffré) — username/password/shard.ID → si OK : **`{ AgentServer.Token (uint), AgentServer.IP, AgentServer.Port }`** |
| 0x2322 / 0x6323 / 0xA323 | S→C / C→S / S→C | **IBUV** (Image-Based User Verification, captcha image 200×64 + code) |

Codes d'erreur login (0xA102) : `result 0x02` → errorCode (tentatives max/courantes ; `BlockType.Punishment` avec raison + date de fin).

### 4. Flux Agent (port 15884)

| Opcode | Direction | Nom / contenu |
|---|---|---|
| 0x6103 / 0xA103 | C→S / S→C | **AGENT_AUTH** (chiffré) : `{Token (du 0xA102), Username, Password, Content.ID, MAC[6]}` → result |
| 0x7007 / 0xB007 | C→S / S→C | CHARACTER_SELECTION_ACTION (création/suppression) |
| 0x7001 / 0xB001 | C→S / S→C | CHARACTER_SELECTION_JOIN (nom du perso → entrée en jeu) |
| 0x34A5 / 0x3013 / 0x34A6 | S→C | **CHARACTER_INFO** en 3 packets (BEGIN/DATA/END — split) |
| 0x3017 / **0x3019** / 0x3018 | S→C | **ENTITY_GROUPSPAWN** BEGIN/**DATA**/END — spawn des entités voisines (joueurs, monstres, NPC) |
| **0x7021 / 0xB021** | C→S / S→C | **ENTITY_MOVEMENT** (voir détail ci-dessous) |
| 0xB070 | S→C | ENTITY_SKILL_CAST_BEGIN : castType, Skill.ID, source/destination UID, puis par cible `{UID, flags, hitCount, damage…}` |
| 0xB071 | S→C | ENTITY_SKILL_CAST_END |
| 0xB0BD / 0xB072 | S→C | SKILL_BUFF_ADD / BUFF_REMOVE |
| **0x30BF** | S→C | ENTITY_STATE_UPDATE : LifeState / MotionState / BodyState / CombatState / InCombat / Scrolling |
| 0x7074-family | C→S | Action (attaque de base / interaction — section « Action » de SilkroadDoc, WIP) |
| 0x7081-0x7084 / 0x3085-0x308C | C→S / S→C | EXCHANGE (trade inter-joueurs) |
| 0x7150 / 0xB150… | C→S / S→C | ALCHEMY (reinforce/enchant/manufacture/dismantle/socket) |
| 0x7519 / 0xB519 … 0x351E | C→S / S→C | **FGW (Forgotten World)** : RECALL_LIST / RECALL_MEMBER / RECALL_REQUEST / RECALL_RESPONSE / EXIT / UPDATE — voir [29_FORGOTTEN_WORLD.md](29_FORGOTTEN_WORLD.md) |
| 0x3809 | S→C | ENVIRONMENT_WEATHER_UPDATE |
| 0x3020 / 0x3027 | S→C | ENVIRONMENT_CELESTIAL (position soleil/lune, heure du monde) |

**Détail mouvement (0x7021 / 0xB021)** — important pour les donjons :

```csharp
// Requête client
1  byte   hasMovement (toujours 1)
2  ushort RegionID
if (RegionID & 0x8000)  // ← flag IsDungeon !
    4 x int    PosX/PosY/PosZ     // donjons : coordonnées 32 bits
else
    2 x short  PosX/PosY/PosZ     // monde ouvert : 16 bits
// Réponse serveur (0xB021) : UID + destination (mêmes règles) + source éventuelle
// (PosX/Z multipliés par 10 ; PosY en float)
```

### 5. Massive / split packets (0x600D)

Les données dépassant **4090 octets** sont découpées : conteneur **0x600D** + fragments. Paires BEGIN/DATA/END connues :

| BEGIN | DATA | END | Contenu |
|---|---|---|---|
| 0x34A5 | 0x3013 | 0x34A6 | Character info |
| 0x3017 | 0x3019 | 0x3018 | Group spawn |
| 0x34B3 | 0x3101 | 0x34B4 | Guild info |
| 0x3253 | 0x3255 | 0x3254 | Guild storage |
| 0x3047 | 0x3049 | 0x3048 | Inventory storage |

> 🛠️ **Pour SRObro** : le clone navigateur n'a pas à répliquer ce protocole (voir le protocole WebSocket du [Development Technical Guide](DEVELOPMENT_TECHNICAL_GUIDE.md)), mais **conserver la sémantique** (token Gateway→Agent, group spawn, split des gros payloads, keep-alive ~5 s) facilite le portage des données et des comportements.

---

## ⚙️ Core Systems

### 1. Character System

**Level System:**
```
Max Level: 90 (Legend III) → 110 (iSRO classique) → 120/130 (cap étendus)
XP Curve: croissance exponentielle
Level 1-20: rapide · 20-60: moyen · 60-100: lent · 100-110: très lent
```

**Attribute Points (STR/INT):**
```
Par niveau : 5 points
Auto-alloués : 2 (1 STR, 1 INT)
Allouables par le joueur : 3
```

**HP/MP per Level:** base 50/50, gains croissants par niveau (varient par race/build STR-INT).

### 2. Mastery System (Chinois uniquement)

```
Total Mastery Points : 300 (historique cap 80 : 80 × 3 = 240 + 60)
Max par arbre : = cap serveur (80 à l'époque cap 80 ; 90/110/120 ensuite)
Époque cap 80 : 3 masteries pleines (240) + 1 partielle (60)
```

**Skill Point Cost:**
```
Mastery 1-10   : coût cumulé = 55 SP
Mastery 11-20  : ~200+ SP cumulés
Mastery 70-80  : ~2 500+ SP cumulés par mastery
400 SXP (skill exp) = 1 SP  (constante, tous niveaux)
Paliers de skill CH : +2 niveaux de maîtrise par niveau de skill (skills.txt)
```

**SP Farming Formula:**
```
SP par niveau = (XP requise) × (ratio SP/XP selon GAP) ÷ 400
```

**GAP Ratios (vérifiés):**
```
GAP = niveau du perso − maîtrise la plus haute (max utile : 9)

GAP 0 : 19.36 (ratio relatif XP:SP)
GAP 3 : 10.41
GAP 6 : 4.89
GAP 9 : 1.00  (maximum de SP)

Règle : +3 GAP ≈ ×2 de SP (et ÷2 d'XP)
```

### 3. Combat System

**Damage Formula (structure vérifiée):**
```
Total Damage = Physical Damage + Magical Damage

Physical = (Arme PHY ATK + bonus STR + skill PHY dmg) × multiplicateur skill × multiplicateur imbue
           − (réduction via Parry Ratio / DEF PHY adverse)
Magical  = (Arme MAG ATK + bonus INT + skill MAG dmg) × multiplicateur skill − DEF MAG adverse
```

**Critical Hit:**
```
Coup normal    : PHY + MAG
Coup critique  : 2 × PHY + MAG
Ex. 1000 PHY + 200 MAG → normal 1200, critique 2200 (×1.83)
```

**Attack Rating vs Parry Ratio:**
```
AR élevé → touche plus souvent le MAX de la plage d'arme
PR élevé → force l'attaquant vers le MIN
Arme 800-1000 : High AR vs Low PR ≈ 1000 · Low AR vs High PR ≈ 800 · les deux élevés ≈ 900
Parry sources : Garment 40-50 % PR · Protector 30-40 % · Armor 20-30 % · buffs Lightning (Concentration, Heaven's Force)
```

### 4. Party System

```
Bonus : +3 % EXP/SP par membre supplémentaire (party 4 = +9 %)
Distribution : (Base EXP ÷ membres) × (1 + bonus party)
Auto-share EXP/SP activable ; 8/8 = bonus supplémentaires (non chiffrés officiellement)
```

---

## 📐 Formulas and Calculations

### Level XP Requirements (approximation)

```
XP requis niveau N ≈ Base × (facteur de croissance)^N
1-20 : ~5 000/niv · 20-40 : ~20 000 · 40-60 : ~100 000
60-80 : ~500 000 · 80-100 : ~2 000 000 · 100-110 : ~5 000 000
```

### SP Gains Per Level (données vérifiées)

**Level 30:** GAP 0 : 3 911 SP · GAP 3 : 5 845 (+49 %) · GAP 6 : 11 660 (+198 %) · GAP 9 : 34 759 (+788 %)
**Level 45:** GAP 0 : 15 141 · GAP 3 : 28 330 (+87 %) · GAP 6 : 45 362 (+200 %) · GAP 9 : 135 779 (+797 %)
**Level 60:** GAP 0 : 38 789 · GAP 3 : 72 602 (+87 %) · GAP 6 : 118 579 (+206 %) · GAP 9 : 355 245 (+816 %)

*(Variante guide UnKnoWnCheaTs « total cumulé » : lvl 30 → 3 911 SP (GAP 0) à 75 074 (GAP 9) ; lvl 60 → 9 884 à 189 675 — deux métriques différentes, citées toutes deux par les bases skills.)*

### Drop Rates (données vérifiées)

```
Drop d'item normal : ~0,001 % (1 pour ~150 monstres)
Drop SoX           : ~0,00001 % (1 pour ~20 000)

Rareté SoX : SOS ~60 % des SoX · SOM ~30 % · SOSun ~10 %
```

### Gold Drops (par niveau de monstre)

```
1-20 : 1-100 · 20-40 : 100-1 000 · 40-60 : 1k-10k · 60-80 : 10k-100k · 80-100 : 100k-1M · 100+ : 1M+
```

### Monster Spawning

```
Normaux : 1-5 min · Champions : 5-15 min (aléatoire) · Giants : ~5 min (spots rapides, ex. Ong)
Uniques : défauts vSRO (Tab_RefNest) — 6 h (TG/Cerberus/Ivy/Isyutaru/Yarkan/Shaitan), 3 h (Uruchi), 4 h (Medusa) · ✅ recherche PS 2026-10
Zones fast-spawn : −50 % de respawn ; donjons : +50 %
```

---

## 🗄️ Database Specifications

> Schémas **SQL SRObro** (adaptation simplifiée des données du jeu). Les structures officielles Joymax sont SQL Server avec préfixe `_Ref` (voir section suivante).

### Items Table Structure

```sql
CREATE TABLE items (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  degree TINYINT NOT NULL,               -- 1-13
  type ENUM('weapon','armor','accessory','consumable','material') NOT NULL,
  subtype VARCHAR(50),                   -- sword, blade, spear, garment, protector...
  rarity ENUM('normal','SOS','SOM','SOSun','NOVA_A','NOVA_B') DEFAULT 'normal',

  phy_attack_min INT DEFAULT 0, phy_attack_max INT DEFAULT 0,
  mag_attack_min INT DEFAULT 0, mag_attack_max INT DEFAULT 0,
  phy_def INT DEFAULT 0, mag_def INT DEFAULT 0,

  required_level TINYINT, required_str INT DEFAULT 0, required_int INT DEFAULT 0,
  durability INT DEFAULT 0, max_durability INT DEFAULT 0,
  price INT DEFAULT 0, sell_price INT DEFAULT 0,
  socket_count TINYINT DEFAULT 0,
  plus_level TINYINT DEFAULT 0,          -- +0 à +12/+15

  INDEX (degree), INDEX (type), INDEX (required_level)
);
```

### Monsters Table Structure

```sql
CREATE TABLE monsters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  level TINYINT NOT NULL,
  type ENUM('normal','champion','giant','elite','unique') NOT NULL,
  hp INT NOT NULL,
  phy_attack_min INT NOT NULL, phy_attack_max INT NOT NULL,
  mag_attack_min INT DEFAULT 0, mag_attack_max INT DEFAULT 0,
  phy_def INT NOT NULL, mag_def INT NOT NULL,
  exp INT NOT NULL, sp INT NOT NULL,
  gold_min INT DEFAULT 0, gold_max INT DEFAULT 0,
  spawn_time_min INT DEFAULT 300, spawn_time_max INT DEFAULT 600,
  spawn_area_id INT,
  drop_table_id INT,
  INDEX (level), INDEX (type)
);
```

### Skills Table Structure

```sql
CREATE TABLE skills (
  id INT PRIMARY KEY,                    -- ID client (ex. 3-39 Bicheon...) ou clé SRObro
  codename VARCHAR(100),                 -- SKILL_CH_SWORD_CHAIN_C_2S_04 (clé universelle CH)
  name VARCHAR(100) NOT NULL,            -- nom affiché iSRO
  mastery VARCHAR(50) NOT NULL,          -- bicheon...force | warrior...cleric
  race ENUM('chinese','european') NOT NULL DEFAULT 'chinese',
  mastery_level_required TINYINT NOT NULL,
  skill_level TINYINT DEFAULT 1,
  book VARCHAR(2),                       -- A-H (CH) | 1-2 (EU)

  phy_damage_min INT DEFAULT 0, phy_damage_max INT DEFAULT 0,
  mag_damage_min INT DEFAULT 0, mag_damage_max INT DEFAULT 0,
  damage_multiplier DECIMAL(5,2) DEFAULT 1.00,

  mp_cost INT NOT NULL,
  sp_cost INT NOT NULL,
  cast_time DECIMAL(4,2) DEFAULT 0.0,
  cooldown DECIMAL(4,2) DEFAULT 0.0,
  animation_time DECIMAL(4,2) DEFAULT 0.0,

  effect_type ENUM('none','kd','stun','burn','freeze','frostbite','shock','poison','bleed','buff','debuff') DEFAULT 'none',
  effect_duration INT DEFAULT 0,
  effect_value INT DEFAULT 0,

  INDEX (mastery), INDEX (mastery_level_required)
);
```

### Characters Table Structure

```sql
CREATE TABLE characters (
  id INT PRIMARY KEY AUTO_INCREMENT,
  account_id INT NOT NULL,
  name VARCHAR(50) NOT NULL UNIQUE,
  race ENUM('chinese','european') NOT NULL,
  level TINYINT DEFAULT 1,
  xp BIGINT DEFAULT 0,
  sp INT DEFAULT 0,
  str INT DEFAULT 20, int INT DEFAULT 20,
  hp INT DEFAULT 50, mp INT DEFAULT 50,
  map_id INT NOT NULL, x FLOAT NOT NULL, y FLOAT NOT NULL,

  -- Masteries (Chinese)
  mastery_bicheon TINYINT DEFAULT 0, mastery_heuksal TINYINT DEFAULT 0, mastery_pacheon TINYINT DEFAULT 0,
  mastery_cold TINYINT DEFAULT 0, mastery_fire TINYINT DEFAULT 0,
  mastery_lightning TINYINT DEFAULT 0, mastery_force TINYINT DEFAULT 0,
  -- Masteries (European)
  mastery_warrior TINYINT DEFAULT 0, mastery_rogue TINYINT DEFAULT 0, mastery_wizard TINYINT DEFAULT 0,
  mastery_warlock TINYINT DEFAULT 0, mastery_bard TINYINT DEFAULT 0, mastery_cleric TINYINT DEFAULT 0,

  weapon_id INT, armor_head_id INT, armor_chest_id INT, armor_legs_id INT,
  armor_shoulders_id INT, armor_boots_id INT,
  accessory_ring1_id INT, accessory_ring2_id INT,
  accessory_necklace_id INT, accessory_earring_id INT,

  gender ENUM('male','female'), hair_style TINYINT, hair_color TINYINT, face_type TINYINT,
  online BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP,
  FOREIGN KEY (account_id) REFERENCES accounts(id),
  INDEX (name), INDEX (level)
);
```

---

## 🔬 Structures Officielles _RefSkill / _RefObjCommon

Les serveurs vSRO stockent les données de jeu dans des tables SQL `_Ref*`. Les fichiers texte du client (`skilldata_5000.txt`, `characterdata_5000.txt`, `itemdata_5000.txt`) en sont des **exports** — extraits des .pk2 (media).

### _RefSkill (skills)

Colonnes clés utiles pour SRObro :

| Colonne / famille | Rôle |
|---|---|
| `ID` | ID numérique du skill (match les IDs de `skills.txt` : Bicheon 3-39…) |
| `Service` | Flag d'activation (0/1) |
| `CodeName128` | **Identifiant universel** — `SKILL_CH_SWORD_CHAIN_C_2S_04`, `SKILL_EU_W_…` |
| `Basic_Code` | Gabarit de comportement du skill |
| `Param1..Param12` + `Param1Desc..` | **Codes d'effets** — cf. table ci-dessous |
| Colonnes de cast/CD (`ActionPeriod`/`CastTime` côté client) | Timing (source des valeurs Cast/CD des bases skills) |

**Codes Param documentés (vSRO, guide srocave)** — chaque code identifie un effet :

| Effet | Code | Effet | Code |
|---|---|---|---|
| Burn | 25205 | Fear | 26213 |
| Poison | 28787 | Sleep | 29541 |
| Bleed | 25196 | Stun | 29556 |
| Frostbite | 26210 | Blind | 29300 |
| Critical + | 25458 | Hit ratio + | 26738 |
| Knock-back / Knock-down | 27490 / 27503 | Damage absorb % | 1868849522 |
| Life steal | 1818653556 | Damage reflect | (famille reflect) |
| Increase STR | 1937011305 | Taunt | 1952542324 |
| Teleport | 1952803890 | Resurrection | 1919251317 |
| Absolute damage | 1885629799 | Max HP % damage | 1885629746 |
| Dégâts % / ATK % | 6582901 / 6386804 | Disable buff-cancel | 1851946342 |

> Structure type d'un param : `Effet | Probabilité | Niveau | Inconnu` (détails complets dans le guide srocave, lien en References).

### _RefObjCommon / _RefItem (objets & monstres)

- `_RefObjCommon` : entrée générique (objets **et** monstres/NPC) — `ID`, `CodeName128` (ex. `MOB_TOGUI_GENERAL`…), `ObjState`, liaison vers `_RefObjItem` (items) ou `_RefObjChar` (monstres : HP/level/dégâts).
- `_RefItem` : stats d'items (degré, rareté, valeurs min/max, `Rarity`/`SoX`), Consignation/`_RefShop` pour les marchands.
- Pipeline recommandé pour extraire les données : **BDD `_Ref*` → SR_Db2Media (JellyBitz) → media.pk2 (txt)**, ou lire directement les `*data_5000.txt` du client. Voir aussi [Silkroad-Database-Documentation (Ex-o)](https://github.com/Ex-o/Silkroad-Database-Documentation).
- ⚠️ Les **dégâts/coûts MP par niveau de skill** manquent à `skills.txt` (qui ne porte que séries/cast/CD) : ils vivent dans `_RefSkill`/`skilldata_5000.txt` — c'est la source à brancher sur [SKILLS_DATABASE_CHINESE.md](SKILLS_DATABASE_CHINESE.md).

---

## 🖥️ Référence d'Implémentation Serveur

> Implémentation JavaScript **côté SRObro** des formules ci-dessus (à garder synchronisées avec les constantes officielles). L'architecture complète (Node/Express/Socket.io) est dans le [Development Technical Guide](DEVELOPMENT_TECHNICAL_GUIDE.md).

### Calcul de dégâts

```javascript
function calculateDamage(attacker, defender, skill) {
  // Physique
  const weaponDamage = randomRange(attacker.weapon.phy_attack_min, attacker.weapon.phy_attack_max);
  const strBonus = attacker.str * 0.5;
  const basePhy = weaponDamage + strBonus + skill.phy_damage_max;
  const imbueMultiplier = attacker.imbue ? attacker.imbue.multiplier : 1.0;
  const parryReduction = 1 - (defender.parry_ratio / 100);
  const phyDamage = (basePhy * skill.damage_multiplier * imbueMultiplier) * parryReduction;

  // Magique
  let magDamage = 0;
  if (skill.mag_damage_max > 0) {
    const baseMag = (attacker.weapon.mag_attack_max || 0) + attacker.int * 1.0 + skill.mag_damage_max;
    magDamage = baseMag * skill.damage_multiplier - (defender.mag_def * 0.5);
  }

  // Critique : 2 × PHY + MAG
  const isCrit = Math.random() < attacker.crit_rate;
  const totalDamage = isCrit ? (2 * phyDamage) + magDamage : phyDamage + magDamage;

  return { damage: Math.max(1, Math.floor(totalDamage)), is_crit: isCrit,
           phy_damage: phyDamage, mag_damage: magDamage };
}
```

### Attribution XP/SP selon le GAP

```javascript
const GAP_RATIOS = { 0: 19.36, 1: 15.87, 2: 13.01, 3: 10.41, 4: 8.33,
                     5: 6.50, 6: 4.89, 7: 3.46, 8: 2.17, 9: 1.00 };

function awardXP(character, baseXP) {
  const gap = Math.min(character.level - character.highestMastery, 9);
  const ratio = GAP_RATIOS[gap];
  const xpShare = baseXP / (ratio + 1);
  const spShare = xpShare * ratio;
  const sp = Math.floor(spShare / 400);          // 400 SXP = 1 SP
  character.xp += Math.floor(xpShare);
  character.sp += sp;
  return { xp_gained: Math.floor(xpShare), sp_gained: sp };
}
```

### IA de monstre (machine à états minimale)

```javascript
class MonsterAI {
  constructor(monster) {
    this.monster = monster; this.state = 'idle'; this.target = null;
    this.lastAttack = 0; this.cooldown = 2000;   // attaque toutes les 2 s
  }
  update(now, players) {
    switch (this.state) {
      case 'idle':    if (p = this.aggroWithin(10, players)) { this.target = p; this.state = 'chase'; } break;
      case 'chase':   if (this.dist(this.target) > 30) { this.state = 'idle'; this.target = null; }
                      else { this.moveTowards(this.target); if (this.dist(this.target) < 2) this.state = 'attack'; } break;
      case 'attack':  if (this.dist(this.target) > 3) { this.state = 'chase'; return; }
                      if (now - this.lastAttack >= this.cooldown) { this.strike(); this.lastAttack = now; } break;
    }
  }
}
```

---

## ⚖️ Balance Constants

### Economy Balance (gold sinks)

```
Potions : 50-2 000 gold · Réparations : 10-50 % de la valeur item
Téléport : 500-5 000 · Stall : 1 000 · Création de guilde : 500 000
Respecialization : coût croissant selon SP retirés
```

### Drop Rates (rareté)

```
Items normaux : 99 % des drops
SOS  : ~0,9 %  (~1/110) · SOM : ~0,09 % (~1/1 100) · SOSun : ~0,01 % (~1/11 000)
Progression : 1D-3D communs · 4D-6D peu communs · 7D-9D rares · 10D-11D très rares · 12D-13D extrêmement rares
```

### PVP Balance

```
Chinois : Full STR (burst/tanky) · Full INT (nuker/kite) · Hybride (polyvalent)
Européens : Warrior tank · Rogue burst/stealth · Wizard AoE · Warlock debuffs/DoT · Bard support/mana · Cleric heal/support
```

---

## ⏱️ Timings Officiels Récapitulatifs

| Système | Valeur | Source |
|---|---|---|
| Keep-alive client | **0x2002 toutes les 5 000 ms de silence** | SilkroadDoc |
| Limite d'un packet / buffer recv | 8192 octets (payload max ~8186) | pushedx |
| Split de payload | > 4090 octets → massive 0x600D + BEGIN/DATA/END | SilkroadDoc |
| Délai potion EU | **15 s** entre potions | guides EU |
| Tick Heal Cycle/Orbit (Cleric) | **3 s** (zéro aggro) | elitepvpers |
| Recovery Division | 300 s de durée | guides |
| Screens / Earth Barrier | 1 min / 20 s (CD 60 s) | guides |
| FGW : timer instance | 2 h (boss à tuer) | wiki Fandom |
| FGW : ré-entrée | 3 h (bypass : ticket Item Mall) | wiki Fandom + ✅ confirmé wiki officiel ZH DiGeam (recherche ZH 2026-10) |
| FGW : Dimension Hole | item 24 h · 30 min entre activations · 15 min de retour après sortie | wiki Fandom |
| FGW : drop | aucun drop si le joueur dépasse les monstres de **7+ niveaux** (règle anti-carry) | wiki officiel ZH DiGeam (recherche ZH 2026-10) |
| Job Temple | cycles d'ouverture 12 h (avertissements 10/5 min avant) | guides |
| Anti-abus login (vSRO 1.188) | blocage **10 min** après **3 échecs** login ou CAPTCHA (`AutomatedPunisher` du GlobalManager) | dump server.cfg — ✅ recherche VSRO 2026-10 |
| Respawn normaux / champions / uniques | 1-5 min / 5-15 min / 3-24 h | communauté |

---

## 📚 References

### Protocole & sécurité (officiel)
- [SilkroadDoc — wiki GitHub (DummkopfOfHachtenduden / DaxterSoul)](https://github.com/DummkopfOfHachtenduden/SilkroadDoc/wiki) — packets vSRO 1.188, formats de fichiers, opcodes Gateway/Agent, split packets, FGW
- [Silkroad-Security (page SilkroadDoc)](https://github.com/DummkopfOfHachtenduden/SilkroadDoc/wiki/Silkroad-Security) — « A Guide to Silkroad's Security » (Drew 'pushedx' Benton) : handshake 0x5000, count/CRC bytes, Blowfish
- [florian0 — swiftness wiki : Handshake & Session Control](https://github.com/florian0/swiftness/wiki/Handshake%20&%20Session%20Control) · [Cyclic redundancy check](https://github.com/florian0/swiftness/wiki/Cyclic-redundancy-check) · [Blowfish Encryption/Decryption](https://github.com/florian0/swiftness/wiki/Encryption-and-Decryption-using-Blowfish)
- [Server Side Handshake Packet — elitepvpers](https://www.elitepvpers.com/forum/sro-coding-corner/2056066-server-side-handshake-packet.html) · [Getting Blowfish key — elitepvpers](https://www.elitepvpers.com/forum/sro-coding-corner/934399-getting-blowfish-key-using-algorithm.html)
- [C# SilkroadSecurity API — elitepvpers](http://www.elitepvpers.com/forum/sro-coding-corner/1063078-c-silkroadsecurity.html)

### Architecture serveur / ports
- [vSRO Ports configure — RaGEZONE](https://forum.ragezone.com/threads/vsro-ports-configure.1050702) — Gateway 15779, Agent 15884
- [Setting up a server based on VSRO server files — RaGEZONE](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273) — modules, MSSQL, IIS
- [Guide Most of vsro files problem solved — elitepvpers](https://www.elitepvpers.com/forum/sro-private-server/) — ordre de démarrage des services

### Fichiers serveur fuités & rates (recherche PS 2026-10)
- [TopGameServer — How to Change vSRO EXP and Silk Rates (sémantique /1000)](https://topgameserver.net/drop) · [miroir elitepvpers du guide du leaker](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/1433603-guide-setting-up-server-based-vsro-server-files.html)
- [Dev: Unique Spawn Time — RaGEZONE](https://forum.ragezone.com/threads/dev-unique-spawn-time.820175) — timers par défaut des uniques (`Tab_RefNest`)
- [ducksoup — schémas SQL des ~200 tables de la shard vSRO 1.188](https://github.com/ducksoup-sro/ducksoup/tree/main/Database/VSRO188)
- Panorama des serveurs privés : [39_PRIVATE_SERVERS.md](39_PRIVATE_SERVERS.md) · rapports [ML_RESEARCH/RESEARCH_PS_FILES.md](ML_RESEARCH/RESEARCH_PS_FILES.md) / [RESEARCH_PS_HIGHCAP.md](ML_RESEARCH/RESEARCH_PS_HIGHCAP.md)

### Configuration serveur, GM, DB, anti-cheat (✅ recherche VSRO 2026-10)
- [RaGEZONE — dump complet server.cfg/srNodeType.ini/srShard.ini/srGlobalService.ini (stefsika, page 33 du thread du leaker)](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273/page-33) — IBUV (CAPTCHA 20 000 images), AutomatedPunisher, fee rates 5 %/10 %, topologie 48 nœuds, capacity 2300
- [RaGEZONE — SMC/capacité du shard (page 4)](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273/page-4) · [Official-vSRO Error Thread](https://forum.ragezone.com/threads/official-vsro-error-thread-solution-collection-please-contribute.812346/) — MsgID 0x6102, srPatcher, SR_CharAppoint, CLAMP 2 Md
- [RaGEZONE — GM Commands (+ page 2, posts du leaker)](https://forum.ragezone.com/threads/gm-commands.781576) · [r10dev — GM Commands](https://r10dev.net/konular/vsro-gm-commands-list-silkroad-online-gm-codes-guide.5380) · [r10dev — GM Console F1](https://r10dev.net/konular/vsro-gm-console-f1-commands-list-silkroad-gm-command-guide.5384) — ~40 commandes, `/zoe`, `/ban` = simple kick
- [TopS4A — VSRO Query Collection](https://www.tops4a.com/2019/08/query.html) — procédures `_AddLogItem`/`_AddTimedJob`/`_AddNewCOS`/`_Guild_Create`, `InventorySize` max 109, `_ItemQuotation`
- [vsro.org — Mercenary Scroll (hook `_AddLogItem` Operation 41)](https://www.vsro.org/konular/mercenary-scroll-cozumu.2621) · [JellyBitz — vSRO-ServerAddon](https://github.com/JellyBitz/vSRO-ServerAddon) — 19 actions temps réel via `_ExeGameServer`
- [GamesIndustry.biz — Legend V Plus Battle Arena (08/2010, HackShield)](https://www.gamesindustry.biz/silkroad-online-legend-v-plus-battle-arena-update-launched-with-prizes-to-be-won) · [nProtect — FAQ GameGuard officielle](https://gameguardfaq.nprotect.com/eng/con_02.html) · [epvp — disable XTrap 1.188](https://www.elitepvpers.com/forum/sro-private-server/2737981-how-disable-x-trap-1-188-vsro-server-files-client.html) — chronologie anti-cheat
- [opensro — package gmcommand (code décompilé)](https://github.com/opensro-dev/opensro/tree/main/apps/server/internal/game) — contrepoint implémentation des commandes GM
- Rapport intégral : [ML_RESEARCH/RESEARCH_VSRO_SERVER.md](ML_RESEARCH/RESEARCH_VSRO_SERVER.md) (77 sources indexées avec fiabilité)

### Client / pk2 / formats
- [PK2 Internals — Drew 'pushedx' Benton](http://www.stealthex.org/site/showthread.php?5440-More-about-PK2-Internals)
- [Silkroad file formats (bsr/bms/bmt/bsk/ban) — elitepvpers](http://www.elitepvpers.com/forum/sro-coding-corner/1992824-wip-silkroad-file-formats-bsr-bms-bmt-bsk-ban.html)

### Données de jeu (BDD)
- [vSRO Skill Params (codes Param de _RefSkill) — srocave](https://srocave.com/konular/vsro-tum-skill-paramlari-detayli.18/)
- [All questions answered (colonnes _Ref*) — elitepvpers](https://www.elitepvpers.com/forum/sro-private-server/2164591-all-questions-answered-here-ask-any-sro-related-doubt-no-support-12.html)
- [Ex-o — Silkroad-Database-Documentation](https://github.com/Ex-o/Silkroad-Database-Documentation) · [JellyBitz — SR_Db2Media](https://github.com/JellyBitz/SR_Db2Media)

### Formules & mécaniques
- [Masteries, SP Farming Guide — SilkroadForums](http://www.silkroadforums.com/viewtopic.php?t=1243) · [Complete Guide to Skill Points — UnKnoWnCheaTs](https://www.unknowncheats.me/wiki/Silkroad:Complete_Guide_to_Skill_Points)
- [Technical details on Skills System — SilkroadForums](http://www.silkroadforums.com/viewtopic.php?f=4&t=2030) · [Silkroad Damage Formulas — elitepvpers](https://www.elitepvpers.com/forum/silkroad-online/412387-silkroad-damage-formulas.html)
- [Attack Rating vs Parry Ratio — SilkroadForums](http://ww1000w.silkroadforums.com/viewtopic.php?f=4&t=10997)
- [SOX Drop Rate Research — RaGEZONE](https://forum.ragezone.com/threads/research-about-sox-drop-rate-how-does-this-thing-works.1040977/) · [GP and SP Distribution — SilkroadForums](http://www.silkroadforums.com/viewtopic.php?f=29&t=34491)
- [Silkroad Online Wiki (Fandom)](https://silkroadonline.fandom.com/wiki/Silkroad_Online_Wiki)

### Community Contributions
Merci à la communauté Silkroad (SilkroadDoc, pushedx, florian0, jMerlin, elitepvpers, RaGEZONE, SilkroadForums, UnKnoWnCheaTs) pour le reverse engineering et la documentation de ces systèmes.

---

**Version :** 2.2 (recherche VSRO 2026-10 : section « Configuration serveur officielle vSRO 1.188 » — `server.cfg` complet avec IBUV/CAPTCHA + AutomatedPunisher + fee rates + flags d'événements + LOCALE, `srNodeType.ini` topologie 48 nœuds/6 machines, `srShard.ini` capacity 2300, contradiction des unités de rates documentée, ~40 commandes GM avec syntaxe, procédures stockées métier (`_AddLogItem` Op.41…), anti-cheat GameGuard→HackShield→XTrap + défenses serveur MsgID 0x6102)
**Last Updated :** 2026-10-01
**Maintained By :** SRObro Development Team
