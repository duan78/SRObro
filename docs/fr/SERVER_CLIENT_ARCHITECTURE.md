# Architecture Client/Serveur - Silkroad Online

## Vue d'ensemble

Silkroad Online utilise une **architecture client-serveur distribuée** avec un cluster de serveurs spécialisés pour gérer différents aspects du jeu. Cette architecture a été conçue pour supporter un MMORPG massivement multijoueur avec des milliers de joueurs simultanés.

**Version documentée:** VSRO 1.188 (Vietnam Silkroad Online)
**Architecture:** Client lourd → Cluster de serveurs spécialisés
**Protocole:** TCP avec encryption personnalisée

---

## Architecture Globale

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (SR_Client)                      │
│                    (Machine du joueur)                          │
│  - Rendu 3D (Direct3D)                                          │
│  - Interface utilisateur                                       │
│  - Gestion des inputs                                           │
│  - Logique de jeu locale                                       │
└──────────────────────┬──────────────────────────────────────────┘
                       │ TCP (15779)
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              GATEWAY / AGENT SERVER (SRO_Client)                │
│                   (Login Server)                                │
│  - Authentification des joueurs                                │
│  - Sélection des personnages                                    │
│  - Redirection vers le Shard approprié                          │
│  - Gestion de la connexion initiale                             │
└──────────────────────┬──────────────────────────────────────────┘
                       │ Redirection
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│              MACHINE MANAGER (Load Balancer)                    │
│                                                                  │
│  - Équilibrage de charge entre les Shards                       │
│  - Surveillance de l'état des serveurs                          │
│  - Gestion des connexions serveur→serveur                       │
└──────────────────────┬──────────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ SR_Shard #1 │ │ SR_Shard #2 │ │ SR_Shard #N │
│ (Game)      │ │ (Game)      │ │ (Game)      │
└─────────────┘ └─────────────┘ └─────────────┘
       │               │               │
       └───────────────┴───────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│            SHARD / WORLD SERVER (SRO_Shard)                     │
│                    (Game Server)                                │
│  - Gestion du monde virtuel                                     │
│  - Positions des joueurs                                        │
│  - Système de combat                                            │
│  - Économie et trading                                          │
│  - Gestion des mobs et NPCs                                     │
└─────────────────────────────────────────────────────────────────┘
       │               │               │
       ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│ FARM SERVER │ │ CASTLE SVR  │ │  OTHER SVR  │
│ (Jobs)      │ │ (Fortress)  │ │             │
└─────────────┘ └─────────────┘ └─────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                  DATABASE (SQL Server)                          │
│  - SRO_VT_ACCOUNT (Comptes)                                    │
│  - SRO_VT_SHARD (Données de jeu)                               │
│  - SRO_VT_LOG (Logs)                                            │
└─────────────────────────────────────────────────────────────────┘
```

---

## Composants du Client

### SR_Client (Client de Jeu)

**Rôle:** Application exécutée sur la machine du joueur

**Responsabilités:**
- Rendu 3D du monde de jeu (Direct3D 8/9)
- Gestion des inputs utilisateur (clavier, souris)
- Affichage de l'interface utilisateur (UI)
- Prédictiction des mouvements locaux
- Gestion du cache local (textures, modèles, sons)
- Communication avec le Gateway Server

**Fichiers principaux:**
- `SR_Client.exe` - Exécutable principal
- `media.pk2` - Archive contenant tous les assets du jeu
- `Data.pk2` - Données de configuration
- `div.txt` - Configuration de diversion (IP serveur)

**Fonctionnalités techniques:**
- **Graphics Engine:** Moteur 3D propriétaire basé sur Direct3D
- **Audio Engine:** Gestion des sons et musiques
- **Physics Engine:** Physique basique (collisions, gravité)
- **Packet Handler:** Envoi/réception des packets réseau
- **Encryption Layer:** Blowfish pour les communications réseau

---

## Composants des Serveurs

### 1. Gateway / Agent Server (SRO_Client)

**Port:** 15779 (standard)
**Rôle:** Point d'entrée et authentication

**Responsabilités:**
- Authentification des comptes (login/mot de passe)
- Validation du mot de passe (hash MD5/SHA-1)
- Liste des personnages du compte
- Création/suppression de personnages
- Redirection vers le Shard approprié
- Gestion de la connexion sécurisée

**Packets gérés:**
- `0x7000` - Login Request
- `0x7001` - Login Response
- `0x3000` - Character Selection
- `0x3001` - Character Create
- `0x3002` - Character Delete
- `0x5000` - Ping/Pong

**Base de données:** SRO_VT_ACCOUNT

---

### 2. Machine Manager

**Rôle:** Load balancer et orchestrateur

**Responsabilités:**
- Surveillance de l'état de tous les serveurs
- Équilibrage de charge entre les Shards
- Gestion des connexions inter-serveurs
- Redirection des nouveaux connectés
- Monitoring des performances

**Configuration:**
```ini
[Global]
Count=1
[Entry0]
Operation=1
Name=MachineManager
Load=0
GlobalCount=1
...
```

---

### 3. Shard / World Server (SRO_Shard / SR_Shard)

**Port:** 15879 (standard)
**Rôle:** Cœur du jeu - Gestion du monde virtuel

**Responsabilités:**
- Gestion des positions des joueurs (X, Y, Z, Region)
- Système de combat (PvE et PvP)
- Gestion des mobs (spawn, IA, loot)
- Économie (boutiques, trading, stalls)
- Système de quêtes
- Gestion des guildes et unions
- Système de jobs (Hunter, Thief, Trader)
- Système d'events (Fortress War, CTF, etc.)
- Synchronisation de l'état du monde

**Fonctionnalités clés:**
- **Position Sync:** Mise à jour en temps réel des positions
- **Combat System:** Calcul des dégâts, skills, buffs
- **Drop System:** Génération des loot drops
- **Party System:** Gestion des groupes
- **Guild System:** Wars, unions, alliances
- **Chat System:** Diffusion des messages
- **Teleportation:** Changement de région

**Packets gérés:**
- `0x2000` - Movement/Position Update
- `0x2001` - Action (attack, sit, stand)
- `0x3000` - Spawn Character
- `0x3001` - Despawn Character
- `0x3010` - Attack
- `0x3667` - Chat Message
- `0x7000` - Use Skill
- `0xB000` - Item Pickup
- `0xB001` - Item Drop

**Base de données:** SRO_VT_SHARD

---

### 4. Farm Server

**Rôle:** Gestion du système de Jobs

**Responsabilités:**
- Gestion des caravanes de traders
- Spawn des thieves hunters
- Gestion du PvP job-based
- Système de rewards job
- Transport des goods

**Caractéristiques:**
- Indépendant du Shard principal
- Synchronisation avec le Shard
- Gestion des spawns spéciaux

---

### 5. Castle Server

**Rôle:** Gestion du Fortress War

**Responsabilités:**
- Gestion des forteresses
- Système de capture de châteaux
- Points de contrôle
- Rewards de guerre
- Schedule des fortress wars

---

## Flux de Connexion Complet

```
1. CLIENT → GATEWAY (Port 15779)
   ├─ Handshake TCP
   ├─ Échange des clés d'encryption (Blowfish)
   └─ Authentification (Login Request: 0x7000)

2. GATEWAY → DATABASE (SRO_VT_ACCOUNT)
   ├─ Vérification compte/mot de passe
   ├─ Récupération liste des personnages
   └─ Validation des droits

3. GATEWAY → CLIENT
   ├─ Login Response (0x7001)
   ├─ Liste des personnages
   └─ Session ID + Security Bytes

4. CLIENT → GATEWAY
   ├─ Sélection du personnage (0x3000)
   └─ Request connexion Shard

5. GATEWAY → MACHINE MANAGER
   ├─ Request Shard disponible
   └─ Récupération IP:Port du Shard

6. GATEWAY → CLIENT
   ├─ Redirection vers Shard (IP:Port)
   └─ Nouvelle session ID

7. CLIENT → SHARD (Port 15879)
   ├─ Nouveau Handshake TCP
   ├─ Nouvelle échange de clés
   └─ Connection Request

8. SHARD → DATABASE (SRO_VT_SHARD)
   ├─ Chargement données personnage
   ├─ Position, inventaire, skills
   └─ Informations guildes

9. SHARD → CLIENT
   ├─ Character Data (0x3000)
   ├─ Inventory Data
   ├─ Skill Data
   └─ Spawn dans le monde

10. CLIENT → SHARD (Gameplay)
    ├─ Movement (0x2000)
    ├─ Actions (0x2001)
    ├─ Chat (0x3667)
    └─ Skills (0x7000)

11. SHARD → CLIENT (World Updates)
    ├─ Spawn des joueurs/mobs (0x3000)
    ├─ Movement updates
    ├─ Combat results
    └─ Chat messages
```

---

## Communication Réseau

### Protocole

**Type:** TCP (Transmission Control Protocol)
**Ports:**
- Gateway: 15779 (configurable)
- Shard: 15879 (configurable)
- Agent Server: 15779 (même que Gateway)

### Ports Secondaires

- **Download Server:** 15880 (Mises à jour)
- **Chat Server:** (Intégré au Shard)
- **Farm Server:** (Variable)
- **Castle Server:** (Variable)

---

## Gestion des Sessions

### Session ID

Chaque connexion possède un **Session ID** unique:

- **Type:** 4 bytes (uint32)
- **Génération:** Serveur-side
- **Utilité:**
  - Identification unique du client
  - Validation des packets
  - Tracking des connexions multiples

### Security Bytes

Système de validation anti-spoofing:

- **4 bytes** générés par le serveur
- Envoyés au client lors du handshake
- Présents dans chaque packet
- Validés par le serveur
- Renouvelés périodiquement

### Packet Counting

Système anti-packet loss:

- Compteur de packets incrémental
- Détection de packets manquants
- Resynchronisation automatique
- Prévention des replay attacks

---

## Gestion de la Charge

### Sharding

Le monde est divisé en **Shards** (serveurs indépendants):

- Chaque Shard = une instance du monde
- 1500-2000 joueurs par Shard (environ)
- Les joueurs ne peuvent pas interagir entre Shards
- Nommés: "Alex", "Babel", "Egypt", etc.

### Channels

Chaque Shard peut avoir des **Channels**:

- Copies du même monde
- Permet plus de joueurs sur le même "serveur"
- Choisissables dans la liste des serveurs
- Économie partagée entre channels

### Load Balancing

**Machine Manager** gère la charge:

- Surveille CPU/Mémoire de chaque Shard
- Redirige nouveaux connectés vers Shard moins chargé
- Peut désactiver un Shard plein
- Affiche statut (Low, Medium, High, Full)

---

## Base de Données

### SRO_VT_ACCOUNT

**Tables principales:**
- `TB_User` - Comptes utilisateurs
- `SK_Char` - Données de base des personnages
- `SK_Item` - Items globaux

**Utilisation:**
- Login server
- Character creation
- Character selection

### SRO_VT_SHARD

**Tables principales:**
- `_Char` - Données personnages
- `_CharSkill` - Skills personnages
- `_CharQuest` - Quêtes
- `_Item` - Items individuels
- `_Inventory` - Inventaires
- `_Guild` - Guildes
- `_RefObjCommon` - Référence objets
- `_RefSkill` - Référence skills

**Utilisation:**
- Game server
- État du monde
- Données temps réel

### SRO_VT_LOG

**Tables principales:**
- `_LogEvent` - Événements de jeu
- `_LogCashItem` - Transactions item mall
- `_LogGMCommand` - Commandes GM

**Utilisation:**
- Audit trail
- Analytics
- Support

---

## Diagramme de Séquence: Connexion Complète

``┌─────────┐    ┌──────────┐    ┌─────┐    ┌──────┐    ┌──────┐
│ Client  │    │ Gateway  │    │  MM │    │ DB   │    │ Shard │
└────┬────┘    └────┬─────┘    └──┬──┘    └──┬───┘    └───┬──┘
     │              │              │          │           │
     │────TCP──────>│              │          │           │
     │  Connect     │              │          │           │
     │<─────────────│              │          │           │
     │  Handshake   │              │          │           │
     │              │              │          │           │
     │────0x7000───>│              │          │           │
     │  Login       │              │          │           │
     │              │──Query──────>│          │           │
     │              │              │          │           │
     │              │              │────Check─>│           │
     │              │              │  Account │           │
     │              │              │<─────OK───│           │
     │              │<─Response────│          │           │
     │<────0x7001───│              │          │           │
     │  Success     │              │          │           │
     │              │              │          │           │
     │────0x3000───>│              │          │           │
     │  Select Char │              │          │           │
     │              │──Get Shard──>│          │           │
     │              │<─IP:Port────│          │           │
     │<─Redirect───│              │          │           │
     │              │              │          │           │
     │────TCP────────────────────────────────────────────>│
     │  Connect     │              │          │           │
     │<───────────────────────────────────────────────────│
     │  Handshake   │              │          │           │
     │              │              │          │           │
     │────Join Req────────────────────────────────────────>│
     │              │              │          │──LoadChar─>│
     │              │              │          │  Data     │
     │<───────────────────────────────────────────────────│
     │  Char Data   │              │          │           │
     │              │              │          │           │
     │────0x2000─────────────────────────────────────────>│
     │  Move        │              │          │           │
     │<───────────────────────────────────────────────────│
     │  Spawned     │              │          │           │
```

---

## Scalabilité

### Architecture Scalable

L'architecture permet de scaler horizontalement:

1. **Ajouter des Shards:** Plus de joueurs totaux
2. **Ajouter des Channels:** Plus de joueurs par "serveur"
3. **Distribuer les serveurs:** Machine Manager gère la charge
4. **Database Sharding:** Diviser SRO_VT_SHARD

### Limitations Connues

- **1500-2000 joueurs par Shard** (performance réseau)
- **1 région par player** (limitation moteur)
- **Update rate:** ~10Hz (10 updates/second)
- **Packet size:** Maximum ~1400 bytes (MTU)

---

## Sécurité

### Encryption

- **Algorithme:** Blowfish
- **Key size:** 128-448 bits
- **Key exchange:** Diffie-Hellman (?) ou prédéfini
- **Per-connection:** Nouvelle clé par connexion

### Validation

- **Checksum:** Validation de l'intégrité des packets
- **Security Bytes:** Anti-spoofing
- **Packet Counting:** Anti-replay
- **Session ID:** Authentification continue

### Anti-Cheat

- **nProtect GameGuard:** Protection client-side
- **Memory Scanning:** Détection de cheats
- **Packet Validation:** Vérification serveur-side
- **Speed Hack Detection:** Monitoring du mouvement

---

## Technologies Utilisées

### Client

- **Graphics:** Direct3D 8/9
- **Audio:** DirectSound
- **Network:** Winsock (TCP/IP)
- **Input:** DirectInput
- **Compression:** zlib (?)

### Serveur

- **Language:** C++ (推测)
- **Database:** Microsoft SQL Server
- **Network:** Winsock IOCP (I/O Completion Ports)
- **Threading:** Thread pool per server

---

## Références

- [SilkroadDoc GitHub](https://github.com/DummkopfOfHachtenduden/SilkroadDoc)
- [Elitepvpers - Packet Extraction Guide](https://www.elitepvpers.com/forum/sro-coding-corner/270486-guide-extracting-parsed-packets-silkroad.html)
- [VSRO Database Documentation](https://www.tops4a.com/2019/08/query.html)
- [RaGEZONE - VSRO Setup Guide](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273/)

---

**Document version:** 1.0
**Date:** 20 janvier 2026
**Basé sur:** VSRO 1.188
**Status:** ✅ Documenté
