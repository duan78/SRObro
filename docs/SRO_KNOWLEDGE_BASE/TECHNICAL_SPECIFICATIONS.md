# Technical Specifications - Silkroad Online (Spécifications du Jeu Officiel)

> ⚠️ **Révision majeure (2026-10)** : ajout des **spécifications du jeu officiel** extraites de [SilkroadDoc (DummkopfOfHachtenduden)](https://github.com/DummkopfOfHachtenduden/SilkroadDoc/wiki) — protocole client-serveur, handshake de sécurité, opcodes, architecture serveur vSRO, formats de fichiers client (pk2) et structures `_RefSkill`. Les sections « stack navigateur / React » (dupliquées du Development Technical Guide) ont été retirées → voir [DEVELOPMENT_TECHNICAL_GUIDE.md](DEVELOPMENT_TECHNICAL_GUIDE.md) pour l'architecture SRObro.

## 📋 Table des Matières
- [Overview](#-overview)
- [Architecture Officielle du Jeu](#-architecture-officielle-du-jeu)
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
Uniques : 3-24 h selon l'unique (Tiger Girl, Isyutaru, etc.)
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

**Version :** 2.0
**Last Updated :** 2026-10-01
**Maintained By :** SRObro Development Team
