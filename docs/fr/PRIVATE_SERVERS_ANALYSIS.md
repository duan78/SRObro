# Analyse des Serveurs Privés - Silkroad Online

## Vue d'ensemble

Les serveurs privés de Silkroad Online sont principalement basés sur les fichiers **VSRO** (Vietnam Silkroad Online) qui auraient fuité en 2010-2012.

**Clarification importante:**
- **Les serveurs de jeu privés** utilisent des binaires VSRO (C++ compilé)
- **ASP/ASP.NET** est utilisé pour les **interfaces web uniquement**
- Les "émulateurs" sont écrits en C#, Rust, Node.js, ou Java
- Il n'y a **pas de serveurs de jeu ASP.NET** pour Silkroad

---

## 1. Historique des Serveurs Privés

### Origine (2005-2010)

**Début:**
- 2005: Sortie de Silkroad Online
- 2005-2007: Premières tentatives d'émulation
- 2007: Premiers émulateurs fonctionnels (sremu, csremu)

**Projets pionniers:**
- **sremu** (Source Remake) - Java
- **csremu** (C# Source Remake) - C#
- **sro-emulator** - C/C++

Ces projets étaient des **réécritures complètes** du serveur, basées sur le reverse engineering.

---

### Fuite des Fichiers VSRO (2010-2012)

**Événement clé:**
- Fuite des fichiers serveur officiels VSRO v1.188
- Inclut les binaires compilés, la base de données, et les outils

**Contenu de la fuite:**
```
VSRO Files v1.188/
├── Server/
│   ├── SR_Shard/           // Game Server (C++ binary)
│   ├── SRO_Shard/          // World Server (C++ binary)
│   ├── SRO_Client/         // Gateway (C++ binary)
│   ├── MachineManager/     // Load Balancer (C++ binary)
│   ├── FarmServer/         // Job Server (C++ binary)
│   └── CastleServer/       // Fortress War (C++ binary)
├── Database/
│   ├── SRO_VT_ACCOUNT.bak  // SQL Backup
│   ├── SRO_VT_SHARD.bak    // SQL Backup
│   └── SRO_VT_LOG.bak      // SQL Backup
├── Tools/
│   ├── Shard Manager.exe   // Gestion des shards
│   ├── GM Tools.exe        // Outils GM
│   └── PK2 Editor.exe      // Édition des assets
└── Config/
    ├── Server.cfg          // Configuration
    └── Div.txt             // Client config
```

**Impact:**
- Explosion du nombre de serveurs privés
- Plus besoin d'émuler complètement
- Utilisation directe des fichiers officiels

---

### Évolution Post-Fuite (2012-Présent)

**Période:**
- 2012-2015: Âge d'or des serveurs privés
- 2015-2020: Déclin progressif
- 2020-présent: Projets open source modernes

**Technologies:**
- **Majorité:** Fichiers VSRO (binaires C++)
- **Émulateurs modernes:** C#/.NET, Rust, Node.js
- **Interfaces web:** ASP.NET, PHP, Node.js

---

## 2. Architecture des Fichiers VSRO

### Composants Principaux

#### Binaires Serveur

**Langage:** C++ (compilé avec Visual Studio 2005-2008)

**Architecture:**
```
┌─────────────────────────────────────────────────────────────────┐
│  VSRO Server Architecture                                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐      ┌──────────────────┐                  │
│  │ SRO_Client.exe │──────>│ Machine Manager │                  │
│  │ (Gateway)      │       │ (Load Balancer) │                  │
│  └────────────────┘      └────────┬─────────┘                  │
│                                    │                            │
│                   ┌─────────────────┼─────────────────┐         │
│                   ▼                 ▼                 ▼         │
│          ┌─────────────┐  ┌─────────────┐  ┌─────────────┐   │
│          │ SR_Shard #1 │  │ SR_Shard #2 │  │ SR_Shard #N │   │
│          │ (Game)      │  │ (Game)      │  │ (Game)      │   │
│          └──────┬──────┘  └──────┬──────┘  └──────┬──────┘   │
│                 │                │                │           │
│                 └────────────────┼────────────────┘           │
│                                  ▼                            │
│                    ┌──────────────────────┐                   │
│                    │ SRO_VT_SHARD (SQL)  │                   │
│                    │ (Database)           │                   │
│                    └──────────────────────┘                   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

#### Communication Inter-Serveur

**Protocole:** TCP propriétaire

**Ports par défaut:**
```
Gateway/Agent:     15779
Shard/Game:        15879
Machine Manager:   15880
Farm Server:       15881
Castle Server:     15882
```

**Handshake:**
```
1. Gateway → Machine Manager: Register
2. Machine Manager → Gateway: Acknowledge
3. Shard → Machine Manager: Register
4. Machine Manager → Shard: List of Gateways
```

---

### Configuration

#### Server.cfg

**Localisation:** Chaque dossier serveur

**Exemple:**
```ini
[Global]
Count=1

[Entry0]
Operation=1
Name=GatewayServer
Load=0
GlobalCount=1
...
```

#### Div.txt

**Localisation:** Dossier client

**Contenu:**
```
server_ip "192.168.1.100"
server_port 15779
patch_server "updates.silkroad.com"
patch_port 80
version "1.188"
```

---

## 3. Émulateurs Open Source

### Projets C# / .NET

#### 1. Phoenix - C#/.NET Core

**Repository:** [RageZone](https://forum.ragezone.com/threads/phoenix-open-source-silkroad-online-emulator-c-net-core.1159736/)

**Caractéristiques:**
- Langage: C# avec .NET Core
- Cible: VSRO v188
- Statut: Open source
- Année: 2019

**Architecture:**
```
Phoenix/
├── Phoenix.Server/          // Core server
├── Phoenix.Database/        // Database layer
├── Phoenix.Network/         // Packet handling
└── Phoenix.Game/            // Game logic
```

---

#### 2. SilkroadProject

**Repository:** [GitHub - tanisman/SilkroadProject](https://github.com/tanisman/SilkroadProject)

**Caractéristiques:**
- Langage: C#
- Cible: Open Beta Client
- Documentation: Setup guide inclus

**Code Example:**
```csharp
public class PacketHandler
{
    public void HandleMovement(Client client, Packet packet)
    {
        float x = packet.ReadFloat();
        float y = packet.ReadFloat();
        float z = packet.ReadFloat();
        ushort region = packet.ReadUShort();

        // Validation
        if (!IsValidPosition(x, y, z, region))
        {
            Disconnect(client);
            return;
        }

        // Update position
        client.Character.Position = new Vector3(x, y, z);
        client.Character.Region = region;

        // Broadcast to nearby players
        BroadcastPacket(client, packet);
    }
}
```

---

#### 3. DarkEmu

**Repository:** [GitHub - CarlosX/DarkEmu](https://github.com/CarlosX/DarkEmu)

**Caractéristiques:**
- Basé sur: csremu, sremu, sro-emulator
- Framework: Massive Network Game Object Server
- Langage: C#

---

### Projets Rust

#### skrillax

**Repository:** [GitHub - kumpelblase2/skrillax](https://github.com/kumpelblase2/skrillax)

**Caractéristiques:**
- Langage: Rust
- Architecture: ECS (Entity Component System)
- Statut: Actif (mis à jour il y a 3 jours)
- But: Projet d'apprentissage

**Avantages Rust:**
- Performance native
- Memory safety
- Concurrency sans data races

**Exemple de code:**
```rust
pub struct PacketHandler {
    database: Arc<Database>,
    world: Arc<World>,
}

impl PacketHandler {
    pub fn handle_login(&self, packet: &[u8]) -> Result<LoginResponse> {
        let username = parse_string(&packet[6..])?;
        let password = parse_hash(&packet[6 + username.len()..])?;

        let account = self.database.get_account(&username)?;

        if account.verify_password(&password) {
            Ok(LoginResponse::Success(account))
        } else {
            Ok(LoginResponse::Failed)
        }
    }
}
```

---

### Projets Node.js / JavaScript

#### Serveur Node.js

**GitHub Topics:** [silkroad-online (JavaScript)](https://github.com/topics/silkroad-online?l=javascript)

**Caractéristiques:**
- Langage: JavaScript/Node.js
- Framework: Express, Socket.io
- Database: MongoDB ou PostgreSQL

**Exemple d'implémentation:**
```javascript
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    ws.on('message', (data) => {
        const packet = parsePacket(data);

        switch (packet.opcode) {
            case 0x7000:
                handleLogin(ws, packet);
                break;
            case 0x2000:
                handleMovement(ws, packet);
                break;
            // ...
        }
    });
});

function handleLogin(ws, packet) {
    const username = packet.payload.username;
    const password = packet.payload.password;

    database.authenticate(username, password)
        .then(account => {
            if (account) {
                ws.send(buildPacket(0x7001, { success: true }));
            } else {
                ws.send(buildPacket(0x7001, { success: false }));
            }
        });
}

server.listen(15879, () => {
    console.log('Silkroad Server running on port 15879');
});
```

---

## 4. Interfaces Web avec ASP.NET

### Rôle d'ASP.NET

**Important:** ASP.NET est utilisé pour les **interfaces web**, PAS pour le serveur de jeu.

**Utilisations typiques:**
1. Site web du serveur privé
2. Panneau de contrôle (Admin panel)
3. Inscription en ligne
4. Statistiques et classements
5. Boutique en ligne (Item Mall)
6. Support et tickets

---

### Exemple d'Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Architecture Complète d'un Serveur Privé                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Clients (SR_Client.exe)                               │     │
│  └──────────────────────┬─────────────────────────────────┘     │
│                         │ TCP                                  │
│                         ▼                                      │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Game Server (VSRO Files - C++)                        │     │
│  │ ┌──────────┐  ┌──────────┐  ┌──────────┐             │     │
│  │ │ Gateway  │  │ Shard    │  │ Farm     │             │     │
│  │ └──────────┘  └──────────┘  └──────────┘             │     │
│  └──────────────────────┬─────────────────────────────────┘     │
│                         │ SQL                                  │
│                         ▼                                      │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Database (SQL Server)                                 │     │
│  │ SRO_VT_ACCOUNT, SRO_VT_SHARD, SRO_VT_LOG              │     │
│  └──────────────────────┬─────────────────────────────────┘     │
│                         │                                      │
│                         │ HTTP/HTTPS                           │
│                         ▼                                      │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Web Server (ASP.NET / IIS)                            │     │
│  │ ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │     │
│  │ │ Website     │  │ Admin Panel │  │ Item Mall    │   │     │
│  │ │ (ASP.NET)   │  │ (ASP.NET)   │  │ (ASP.NET)    │   │     │
│  │ └─────────────┘  └─────────────┘  └──────────────┘   │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Exemple: Inscription en Ligne

**ASP.NET MVC:**

```csharp
// Controller: AccountController.cs
public class AccountController : Controller
{
    private SilkroadDbContext db = new SilkroadDbContext();

    [HttpGet]
    public ActionResult Register()
    {
        return View();
    }

    [HttpPost]
    public ActionResult Register(RegisterViewModel model)
    {
        if (ModelState.IsValid)
        {
            // Vérifier si le compte existe déjà
            if (db.TB_User.Any(u => u.StrUserID == model.Username))
            {
                ModelState.AddModelError("", "Username already exists");
                return View(model);
            }

            // Créer le compte
            var user = new TB_User
            {
                StrUserID = model.Username,
                password = HashPassword(model.Password),
                Email = model.Email,
                Status = 1,
                sec_primary = 1
            };

            db.TB_User.Add(user);
            db.SaveChanges();

            // Créer un slot de personnage
            // ...

            return RedirectToAction("Login");
        }

        return View(model);
    }

    private string HashPassword(string password)
    {
        // Hash MD5 (comme Silkroad original)
        using (var md5 = System.Security.Cryptography.MD5.Create())
        {
            byte[] inputBytes = Encoding.ASCII.GetBytes(password);
            byte[] hashBytes = md5.ComputeHash(inputBytes);

            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < hashBytes.Length; i++)
            {
                sb.Append(hashBytes[i].ToString("X2"));
            }
            return sb.ToString();
        }
    }
}
```

**View: Register.cshtml**
```html
@model RegisterViewModel

<h2>Create Account</h2>

@using (Html.BeginForm())
{
    @Html.AntiForgeryToken()

    <div class="form-group">
        @Html.LabelFor(m => m.Username)
        @Html.TextBoxFor(m => m.Username, new { @class = "form-control" })
    </div>

    <div class="form-group">
        @Html.LabelFor(m => m.Email)
        @Html.TextBoxFor(m => m.Email, new { @class = "form-control" })
    </div>

    <div class="form-group">
        @Html.LabelFor(m => m.Password)
        @Html.PasswordFor(m => m.Password, new { @class = "form-control" })
    </div>

    <div class="form-group">
        @Html.LabelFor(m => m.ConfirmPassword)
        @Html.PasswordFor(m => m.ConfirmPassword, new { @class = "form-control" })
    </div>

    <button type="submit" class="btn btn-primary">Register</button>
}
```

---

## 5. Comparaison: VSRO Files vs Émulateurs

### VSRO Files (Binaires Officiels)

**Avantages:**
- ✅ 100% compatible avec le client officiel
- ✅ Toutes les fonctionnalités implémentées
- ✅ Performance optimale
- ✅ Stabilité éprouvée

**Inconvénients:**
- ❌ Code source non disponible
- ❌ Difficile à modifier
- ❌ Dépendance à Windows
- ❌ Violation de copyright (fuite)
- ❌ Pas de support officiel

---

### Émulateurs (Source Ouverte)

**Avantages:**
- ✅ Code source disponible
- ✅ Facile à modifier et étendre
- ✅ Multi-plateforme (potentiellement)
- ✅ Légal (réécriture complète)
- ✅ Communauté active

**Inconvénients:**
- ❌ Implémentation incomplète
- ❌ Bugs et incompatibilités
- ❌ Performance inférieure
- ❌ Fonctionnalités manquantes

---

## 6. Outils de Développement

### Serveur

**VSRO Server Manager:**
- Gestion des shards
- Monitoring des performances
- Logs en temps réel

**GM Tools:**
- Création d'items
- Téléportation
- Gestion des événements

---

### Base de Données

**SQL Server Management Studio:**
- Gestion des bases
- Édition des tables
- Exécution des queries

**Outils de requête:**
- [TopS4a VSRO Query Collection](https://www.tops4a.com/2019/08/query.html)
- [Elitepvpers Query Collections](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/3114784-largest-collection-queries-psro-development-updated.html)

---

### Client

**PK2 Editor:**
- Modification des assets
- Édition de server.txt

**Model Tools:**
- Export/Import de modèles 3D
- Modification des skills

---

## 7. Recommandations pour SRObro

### Architecture Suggérée

**Backend:**
- **Langage:** TypeScript/Node.js
- **Framework:** Express + Socket.io
- **Database:** PostgreSQL ou MongoDB
- **Architecture:** Microservices

**Avantages pour SRObro:**
- ✅ Multi-plateforme (Windows, Linux, Mac)
- ✅ Écosystème JavaScript riche
- ✅ Facile à intégrer avec Babylon.js
- ✅ Scalabilité horizontale
- ✅ Pas de dépendance à Windows

---

### Plan d'Implémentation

1. **Phase 1: Backend Core**
   - Implémenter le packet handler
   - Créer la base de données
   - Gérer l'authentification

2. **Phase 2: Game Logic**
   - Système de mouvement
   - Combat basique
   - Gestion des spawns

3. **Phase 3: Frontend**
   - Intégration Babylon.js
   - Import des assets 3D
   - Interface utilisateur

4. **Phase 4: Features Avancées**
   - Système de skills
   - Économie et trading
   - Guildes et PvP

---

## Références

- [Phoenix - C#/.NET Core Emulator](https://forum.ragezone.com/threads/phoenix-open-source-silkroad-online-emulator-c-net-core.1159736/)
- [SilkroadProject - GitHub](https://github.com/tanisman/SilkroadProject)
- [DarkEmu - GitHub](https://github.com/CarlosX/DarkEmu)
- [skrillax - Rust Emulator](https://github.com/kumpelblase2/skrillax)
- [RageZone - VSRO Setup Guide](https://forum.ragezone.com/threads/setting-up-a-server-based-on-vsro-server-files.780273/)

---

**Document version:** 1.0
**Date:** 20 janvier 2026
**Basé sur:** VSRO 1.188
**Status:** ✅ Documenté
