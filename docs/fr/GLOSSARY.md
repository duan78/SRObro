# Glossaire Technique - Silkroad Online / SRObro

## Vue d'ensemble

Ce glossaire définit les termes techniques utilisés dans la documentation de Silkroad Online et le développement de SRObro.

---

## Termes Généraux

### SRO (Silkroad Online)
- **Définition:** Jeu MMORPG développé par Joymax (2005)
- **Contexte:** Jeu original dont SRObro est un portage

### VSRO (Vietnam Silkroad Online)
- **Définition:** Version vietnamienne de Silkroad Online (v1.188)
- **Contexte:** Les fichiers VSRO ont fuité et sont la base des serveurs privés

### SRObro
- **Définition:** Portage de Silkroad Online vers le web avec Babylon.js
- **Architecture:** Frontend (Babylon.js) + Backend (Node.js) + WebSocket

### ISRO (International Silkroad Online)
- **Définition:** Version internationale du jeu original
- **Contexte:** Officiel, géré par Joymax

---

## Architecture Client/Serveur

### Gateway Server / Agent Server
- **Fichier:** SRO_Client.exe
- **Port:** 15779 (standard)
- **Rôle:** Authentification, sélection de personnage, redirection
- **Base de données:** SRO_VT_ACCOUNT

### Shard Server / Game Server
- **Fichier:** SR_Shard.exe, SRO_Shard.exe
- **Port:** 15879 (standard)
- **Rôle:** Gestion du monde, combat, économie
- **Base de données:** SRO_VT_SHARD

### Machine Manager
- **Rôle:** Load balancer, orchestration des serveurs
- **Fonction:** Répartition des joueurs entre les shards

### Farm Server
- **Rôle:** Gestion du système de jobs (Trader, Thief, Hunter)

### Castle Server
- **Rôle:** Gestion du Fortress War

---

## Réseau et Packets

### Opcode
- **Définition:** Identifiant 2 bytes (Word) du type de packet
- **Exemples:**
  - `0x5000`: Ping/Pong
  - `0x7000`: Login Request (Gateway)
  - `0x7001`: Login Response
  - `0x7020`: Use Skill (Shard) ← **Opcode CORRECT pour skills**
  - `0x7021`: Skill Effect
  - `0x2000`: Movement
  - `0x3667`: Chat Message

### Packet
- **Définition:** Unité de données échangée entre client et serveur
- **Structure:**
  ```
  [Packet Size: 2 bytes][Security Bytes: 2 bytes][Opcode: 2 bytes][Checksum: 2 bytes][Payload: variable]
  ```

### Security Bytes
- **Taille:** 2 bytes (uint16)
- **Position:** Bytes 2-3 du packet
- **Rôle:** Validation anti-spoofing

### Session ID
- **Taille:** 4 bytes (uint32)
- **Rôle:** Identification unique de la connexion

### Blowfish
- **Algorithme:** Encryption symétrique
- **Key size:** 128-448 bits
- **Block size:** 8 bytes
- **Utilisation:** Encryption des packets Silkroad

### MTU (Maximum Transmission Unit)
- **Ethernet standard:** 1500 bytes
- **TCP/IP headers:** 40 bytes
- **Payload MTU:** 1460 bytes
- **Max packet SRO:** 8186 bytes

---

## Formats de Fichiers

### PK2
- **Extension:** .pk2
- **Type:** Archive propriétaire
- **Contenu:** Tous les assets du jeu (modèles, textures, sons)
- **Compression:** zlib

### BSR (Binary Skeletal Model)
- **Extension:** .bsr
- **Type:** Modèle 3D avec squelette
- **Contient:** Géométrie, squelette, animations

### DDJ (DirectX Texture)
- **Extension:** .ddj
- **Type:** Texture compressée
- **Format:** DXT1, DXT5, ARGB

### X_TBL (Table)
- **Extension:** .txt
- **Type:** Données du jeu
- **Contenu:** Items, skills, mobs, NPCs

### BMS (Basic Model)
- **Type:** Modèle statique
- **Contient:** Géométrie simple sans animation

### BMT (Basic Material)
- **Type:** Matériau
- **Contient:** Shaders, propriétés de rendu

### BSK (Basic Skeleton)
- **Type:** Squelette
- **Contient:** Hiérarchie des os

### BAN (Basic Animation)
- **Type:** Animation
- **Contient:** Keyframes, interpolation

---

## Base de Données

### SRO_VT_ACCOUNT
- **Type:** Base de données
- **Tables:** TB_User, SK_Char, SK_Item
- **Utilisation:** Comptes, création de personnages

### SRO_VT_SHARD
- **Type:** Base de données
- **Tables:** _Char, _CharSkill, _Inventory, _Guild, _RefObjCommon
- **Utilisation:** Données de gameplay

### SRO_VT_LOG
- **Type:** Base de données
- **Tables:** _LogEvent, _LogCashItem, _LogGMCommand
- **Utilisation:** Logs, audit

---

## Babylon.js et WebGL

### Scene
- **Définition:** Conteneur principal du monde 3D
- **Équivalent SRO:** World

### Mesh
- **Définition:** Objet 3D (géométrie)
- **Équivalent SRO:** Modèle 3D

### Skeleton
- **Définition:** Structure hiérarchique d'os
- **Équivalent SRO:** BSK

### AnimationGroup
- **Définition:** Animation d'un mesh squelettal
- **Équivalent SRO:** BAN

### Texture
- **Définition:** Image appliquée à un mesh
- **Équivalent SRO:** DDJ

### Material
- **Définition:** Propriétés de rendu (couleur, réflexion)
- **Équivalent SRO:** BMT

### ParticleSystem
- **Définition:** Système de particules (effets visuels)
- **Équivalent SRO:** Skill effects

---

## Socket.io et WebSocket

### WebSocket
- **Définition:** Protocole de communication bidirectionnel
- **Avantage:** Remplace TCP pour SRObro (navigateur)

### Socket.io
- **Définition:** Bibliothèque WebSocket pour Node.js
- **Rôle dans SRObro:** Communication client/serveur

### Event
- **Définition:** Message échangé via Socket.io
- **Exemples:** `login`, `movement`, `attack`

---

## Opcodes Courants

### Login Server (Gateway)
| Opcode | Direction | Description |
|--------|-----------|-------------|
| 0x5000 | ↔ | Ping/Pong (Keep-alive) |
| 0x7000 | → | Login Request |
| 0x7001 | ← | Login Response |
| 0x3000 | → | Character Selection |
| 0x3001 | → | Character Create |
| 0x3002 | → | Character Delete |
| 0x3010 | ← | Character List |

### Game Server (Shard)
| Opcode | Direction | Description |
|--------|-----------|-------------|
| 0x5000 | ↔ | Ping/Pong |
| 0x2000 | → | Movement/Position Update |
| 0x2001 | → | Action (Attack, Sit, Stand) |
| 0x3010 | → | Attack |
| 0x3011 | ← | Attack Result |
| 0x3667 | ↔ | Chat Message |
| 0x7020 | → | Use Skill (**Opcode CORRECT**) |
| 0x7021 | ← | Skill Effect |
| 0xB000 | → | Item Pickup |
| 0xB001 | ← | Item Drop |
| 0xB020 | ← | Spawn Character |

---

## Abréviations

| Abréviation | Signification |
|-------------|---------------|
| TCP | Transmission Control Protocol |
| UDP | User Datagram Protocol |
| MTU | Maximum Transmission Unit |
| CRC32 | Cyclic Redundancy Check 32-bit |
| MD5 | Message Digest 5 (hash) |
| SHA-1 | Secure Hash Algorithm 1 |
| MMO | Massively Multiplayer Online |
| RPG | Role-Playing Game |
| PvP | Player vs Player |
| PvE | Player vs Environment |
| GM | Game Master |
| API | Application Programming Interface |
| URL | Uniform Resource Locator |
| IP | Internet Protocol |
| SQL | Structured Query Language |
| DB | Database |
| UI | User Interface |
| HUD | Heads-Up Display |
| LOD | Level of Detail |

---

## Termes Spécifiques à SRObro

### Prédiction Client-side
- **Définition:** Estimation locale du mouvement avant confirmation serveur
- **But:** Réduire la latence perçue

### Interpolation
- **Définition:** Lissage des mouvements des autres joueurs
- **But:** Compensation des délais réseau

### State Sync
- **Définition:** Synchronisation de l'état du monde entre client et serveur
- **Fréquence:** ~10Hz dans SRO original

### Anti-Speedhack
- **Définition:** Validation de la vitesse de déplacement
- **Méthode:** Comparaison distance/temps

---

## Conversions d'Unités

### Temporelles
| SRO | SRObro |
|-----|--------|
| Ticks | Millisecondes |
| 10 Hz | 60 FPS (render) |

### Distances
| SRO | Babylon.js |
|-----|-------------|
| Unités arbitraires | World Units |
| X, Y, Z | Vector3 |

### Rotations
| SRO | Babylon.js |
|-----|-------------|
| Degrees (0-360) | Radians (0-2π) |

---

## Sources de Référence

- [SilkroadDoc GitHub](https://github.com/DummkopfOfHachtenduden/SilkroadDoc)
- [Elitepvpers - SRO Coding Corner](https://www.elitepvpers.com/forum/sro-coding-corner/)
- [Babylon.js Documentation](https://doc.babylonjs.com/)
- [Socket.io Documentation](https://socket.io/docs/)

---

**Document version:** 1.0
**Date:** 20 janvier 2026
**Statut:** ✅ Documenté
