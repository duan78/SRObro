# Protocole Réseau - Silkroad Online

## Vue d'ensemble

Le protocole réseau de Silkroad Online est basé sur **TCP** avec une couche d'encryption personnalisée. Ce document détaille la séquence de connexion, la gestion des sessions, et les mécanismes de sécurité.

**Version:** VSRO 1.188
**Transport:** TCP
**Encryption:** Blowfish
**Authentication:** Handshake avec échange de clés

---

## Séquence de Connexion Complète

### Diagramme de Séquence

```
┌─────────┐    ┌──────────┐    ┌──────────┐    ┌─────────┐
│ Client  │    │ Gateway  │    │MachineMgr│    │ Shard   │
└────┬────┘    └────┬─────┘    └────┬─────┘    └────┬────┘
     │              │              │               │
     │              │              │               │
     │  1. TCP CONNECT            │               │
     │─────────────>              │               │
     │  Port: 15779              │               │
     │                             │               │
     │  2. HANDSHAKE                │               │
     │<─────────────               │               │
     │  Server Challenge           │               │
     │                             │               │
     │  3. CLIENT RESPONSE          │               │
     │─────────────>               │               │
     │  Encryption Key              │               │
     │                             │               │
     │  4. ENCRYPTION ESTABLISHED   │               │
     │<─────────────               │               │
     │  Security Bytes              │               │
     │                             │               │
     │  5. LOGIN REQUEST (0x7000)   │               │
     │─────────────>               │               │
     │  Username + Password         │               │
     │                             │               │
     │              6. DB CHECK    │               │
     │              ─────────────> │               │
     │                             │               │
     │              <───────────── │               │
     │              Account OK     │               │
     │                             │               │
     │  7. LOGIN RESPONSE (0x7001)  │               │
     │<─────────────               │               │
     │  Success + Session ID        │               │
     │                             │               │
     │  8. CHARACTER LIST (0x3010)  │               │
     │<─────────────               │               │
     │  Characters available        │               │
     │                             │               │
     │  9. SELECT CHAR (0x3000)     │               │
     │─────────────>               │               │
     │  Character ID                │               │
     │                             │               │
     │              10. GET SHARD  │               │
     │              ─────────────> │               │
     │  Request available shard    │               │
     │                             │               │
     │              <───────────── │               │
     │  Shard IP:Port              │               │
     │                             │               │
     │  11. REDIRECT (0x7100)      │               │
     │<─────────────               │               │
     │  Shard IP:Port              │               │
     │                             │               │
     │  12. TCP DISCONNECT         │               │
     │<─────────────               │               │
     │                             │               │
     │  13. TCP CONNECT                            │
     │────────────────────────────────────────> │
     │  Port: 15879                             │
     │                                             │
     │  14. HANDSHAKE                              │
     │<───────────────────────────────────────── │
     │  New Challenge                              │
     │                                             │
     │  15. CLIENT RESPONSE                        │
     │────────────────────────────────────────> │
     │  New Encryption Key                         │
     │                                             │
     │  16. SECURITY BYTES                         │
     │<───────────────────────────────────────── │
     │  Session ID + Security Bytes                │
     │                                             │
     │  17. JOIN REQUEST (0x3000)                  │
     │────────────────────────────────────────> │
     │  Character ID                               │
     │                                             │
     │              18. LOAD CHARACTER             │
     │              ──────────────────────────> │
     │  Query character data                       │
     │                                             │
     │              <──────────────────────────── │
     │  Return data                                │
     │                                             │
     │  19. CHARACTER DATA (0xB020)                │
     │<───────────────────────────────────────── │
     │  Spawn in world                             │
     │                                             │
     │  20. GAMEPLAY STARTS                        │
     │<═════════════════════════════════════════│
     │  Movement, Combat, Chat...                  │
```

---

## Étape 1: Connexion TCP

### Initial Connection (Gateway)

**Client → Gateway**

```cpp
// Pseudo-code
socket = TCP_connect("gateway.server.com", 15779);
```

**Paramètres:**
- **Host:** Depuis `div.txt` ou `media.pk2`
- **Port:** 15779 (standard, configurable)
- **Timeout:** 10-30 seconds

**État:** `CONNECTING`

---

## Étape 2: Handshake Initial

### Server Challenge

**Gateway → Client**

**Format:**
```
┌───────────┬───────────┬───────────┐
│ Opcode    │ Size      │ Challenge │
│ 0x6000    │ 0x0008    │ (8 bytes) │
│ 2 bytes   │ 2 bytes   │           │
└───────────┴───────────┴───────────┘
```

**Challenge:**
- 8 bytes aléatoires
- Généré par le serveur
- Unique par connexion

**But:**
- Initialiser l'encryption
- Établir la clé de session

---

## Étape 3: Échange des Clés d'Encryption

### Client Response

**Client → Gateway**

**Processus:**
1. Client reçoit le challenge (8 bytes)
2. Client génère ou obtient la clé Blowfish
3. Client encrypte le challenge avec la clé
4. Client envoie la réponse

**Format:**
```
┌───────────┬───────────┬───────────┐
│ Opcode    │ Size      │ Response  │
│ 0x6001    │ Variable  │ Encrypted │
│ 2 bytes   │ 2 bytes   │ Challenge │
└───────────┴───────────┴───────────┘
```

**Clé Blowfish:**
- **Size:** 128-448 bits
- **Source:** Pré-partagée ou générée
- **Utilisation:** Encryption de tous les futurs packets

**État:** `AUTHENTICATING`

---

## Étape 4: Security Bytes

### Server Confirmation

**Gateway → Client**

Une l'encryption établie, le serveur envoie:

**Security Bytes (2 bytes):**
- Générés aléatoirement par le serveur
- Uniques par session
- Présents dans chaque packet client
- Validés par le serveur

**Format:**
```
┌───────────┬───────────┬───────────┐
│ Opcode    │ Size      │ Security   │
│ 0x6002    │ 0x0006    │ 2 bytes   │
└───────────┴───────────┴───────────┘
```

**Structure du packet:**
- Position Bytes 0-1: Packet Size (2 bytes) - TOUJOURS non encrypté
- Position Bytes 2-3: Security Bytes (2 bytes) - client→server
- Position Bytes 4-5: Opcode (2 bytes)
- Position Bytes 6-7: Checksum (2 bytes)
- Position Bytes 8+: Payload

**Utilisation:**
```cpp
// Dans chaque packet client
packet[0] = securityByte1;
packet[1] = securityByte2;
```

**Source:** [Silk Road Security PDF](https://pdfcoffee.com/silk-road-security-pdf-free.html)

**État:** `AUTHENTICATED` (Gateway)

---

## Étape 5: Login Request

### Packet 0x7000

**Client → Gateway**

**Structure détaillée:**
```
┌────┬────┬────┬────┬────┬────┬─────────────────────────┐
│ SB │ SB │ 0x │ 0x │ Siz│ Siz│ Login Data              │
│ 1  │ 2  │ 70 │ 00 │ e  │ e  │                         │
│    │    │    │    │ 1  │ 2  │ ┌───┬───┬───┬───┬───┐  │
│    │    │    │    │    │    │ │Len│Usr│Pwd│Pwd│Srv│  │
│    │    │    │    │    │    │ │   │er │Len│Pwd│Len│  │
│    │    │    │    │    │    │ │   │   │   │Hsh│   │  │
│    │    │    │    │    │    │ └───┴───┴───┴───┴───┘  │
└────┴────┴────┴────┴────┴────┴─────────────────────────┘
```

**Détails:**
- **SB1, SB2:** Security Bytes (étape 4)
- **Opcode:** 0x7000
- **Username:** String null-terminated
- **Password:** Hash MD5 ou SHA-1 (16 ou 20 bytes)
- **Server Code:** String (ex: "BV", "GR")

---

## Étape 6: Vérification Base de Données

### Gateway → Database

**Query:**
```sql
SELECT * FROM TB_User
WHERE StrUserID = 'username' AND password = 'password_hash'
```

**Database:** SRO_VT_ACCOUNT

**Retour:**
- Account exists
- Account status (banned, etc.)
- Shard list access

---

## Étape 7: Login Response

### Packet 0x7001

**Gateway → Client**

**Réussite:**
```
┌────┬────┬────┬────┬────┬────┬─────────┐
│ SB │ SB │ 0x │ 0x │ Siz│ Siz│ Result  │
│ 1  │ 2  │ 70 │ 01 │ e  │ e  │ = 1     │
└────┴────┴────┴────┴────┴────┴─────────┘
```

**Échec:**
```
Result = Error Code
- 1: Success
- 2: Invalid password
- 3: Account not found
- 4: Account banned
- 5: Already logged in
- 6: Server full
```

---

## Étape 8: Liste des Personnages

### Packet 0x3010

**Gateway → Client**

**Structure:**
```
┌────┬────┬────┬────┬────┬────┬─────────────────────────┐
│ SB │ SB │ 0x │ 0x │ Siz│ Siz│ Characters List         │
│ 1  │ 2  │ 30 │ 10 │ e  │ e  │                         │
│    │    │    │    │ 1  │ 2  │ ┌─────────────────────┐ │
│    │    │    │    │    │    │ │ Count (Byte)        │ │
│    │    │    │    │    │    │ ├─────────────────────┤ │
│    │    │    │    │    │    │ │ For each character: │ │
│    │    │    │    │    │    │ │ ┌─────────────────┐ │ │
│    │    │    │    │    │    │ │ │ Char ID (Dword) │ │ │
│    │    │    │    │    │    │ │ ├─────────────────┤ │ │
│    │    │    │    │    │    │ │ │ Name (String)   │ │ │
│    │    │    │    │    │    │ │ ├─────────────────┤ │ │
│    │    │    │    │    │    │ │ │ Level (Byte)    │ │ │
│    │    │    │    │    │    │ │ ├─────────────────┤ │ │
│    │    │    │    │    │    │ │ │ Model ID (Dword)│ │ │
│    │    │    │    │    │    │ │ └─────────────────┘ │ │
│    │    │    │    │    │    │ └─────────────────────┘ │
└────┴────┴────┴────┴────┴────┴─────────────────────────┘
```

---

## Étape 9: Sélection du Personnage

### Packet 0x3000

**Client → Gateway**

```
┌────┬────┬────┬────┬────┬────┬──────────┐
│ SB │ SB │ 0x │ 0x │ Siz│ Siz│ Char ID  │
│ 1  │ 2  │ 30 │ 00 │ e  │ e  │ (Dword)  │
└────┴────┴────┴────┴────┴────┴──────────┘
```

---

## Étape 10: Requête de Shard

### Gateway → Machine Manager

Le Gateway demande au Machine Manager quel Shard est disponible:

**Query:**
```
GET_SHARD_STATUS
├─ Request available shard
└─ Return least loaded shard
```

**Réponse du Machine Manager:**
```
SHARD_INFO
├─ IP: xxx.xxx.xxx.xxx
├─ Port: 15879
└─ Load: Medium
```

---

## Étape 11: Redirection vers Shard

### Packet 0x7100 (Redirect)

**Gateway → Client**

```
┌────┬────┬────┬────┬────┬────┬───────────────────────┐
│ SB │ SB │ 0x │ 0x │ Siz│ Siz│ Redirect Data         │
│ 1  │ 2  │ 71 │ 00 │ e  │ e  │                       │
│    │    │    │    │ 1  │ 2  │ ┌───┬───┬───────────┐ │
│    │    │    │    │    │    │ │Len│ IP│ Port      │ │
│    │    │    │    │    │    │ │   │   │ (Word)    │ │
│    │    │    │    │    │    │ └───┴───┴───────────┘ │
└────┴────┴────┴────┴────┴────┴───────────────────────┘
```

**Exemple:**
```
IP: "192.168.1.100"
Port: 15879
```

**État:** `REDIRECTING`

---

## Étape 12: Déconnexion Gateway

### TCP Disconnect

**Gateway → Client**

Le Gateway ferme la connexion TCP.

**Client Action:**
1. Sauvegarde les infos de redirection
2. Ferme le socket
3. Prépare nouvelle connexion

---

## Étape 13: Connexion au Shard

### TCP Connect (Shard)

**Client → Shard**

```cpp
socket = TCP_connect(shardIP, shardPort);
// shardIP et shardPort proviennent du packet 0x7100
```

**Paramètres:**
- **IP:** Depuis packet 0x7100
- **Port:** 15879 (standard)
- **Timeout:** 10-30 seconds

---

## Étape 14-16: Handshake Shard

**Identique au Gateway (étapes 2-4)**

Nouveau challenge, nouvelle clé Blowfish, nouveaux Security Bytes.

---

## Étape 17: Join Request

### Packet 0x3000 (Join World)

**Client → Shard**

```
┌────┬────┬────┬────┬────┬────┬──────────┐
│ SB │ SB │ 0x │ 0x │ Siz│ Siz│ Char ID  │
│ 1  │ 2  │ 30 │ 00 │ e  │ e  │ (Dword)  │
└────┴────┴────┴────┴────┴────┴──────────┘
```

**État:** `LOADING`

---

## Étape 18: Chargement des Données

### Shard → Database

**Query:**
```sql
-- Character basic data
SELECT * FROM _Char WHERE CharID = @CharID

-- Character skills
SELECT * FROM _CharSkill WHERE CharID = @CharID

-- Character inventory
SELECT * FROM _Inventory WHERE CharID = @CharID

-- Character items
SELECT * FROM _Item WHERE OwnerID = @CharID

-- Character guild info
SELECT * FROM _GuildMember WHERE CharID = @CharID
```

**Database:** SRO_VT_SHARD

---

## Étape 19: Character Data

### Packet 0xB020 (Spawn)

**Shard → Client**

Le serveur envoie toutes les données du personnage:
- Position (X, Y, Z, Region)
- Inventaire
- Skills
- Équipement
- Guild info
- Stats

**État:** `IN_WORLD`

---

## Étape 20: Gameplay

### Communication Pendant le Jeu

**Client → Shard (Movement, Actions, Chat)**
```
┌─────────────────────────────────────────┐
│ 0x2000: Movement Update                 │
│ 0x2001: Action (Sit, Stand, Attack)     │
│ 0x3667: Chat Message                    │
│ 0x7000: Use Skill                       │
│ 0xB000: Item Pickup                     │
└─────────────────────────────────────────┘
```

**Shard → Client (World Updates)**
```
┌─────────────────────────────────────────┐
│ 0xB020: Spawn Character/Mob/NPC         │
│ 0xB021: Despawn                         │
│ 0x2002: Movement Update (others)        │
│ 0x3011: Attack Result                   │
│ 0x3667: Chat Message (others)           │
│ 0x7001: Skill Effect                    │
└─────────────────────────────────────────┘
```

**Keep-Alive:**
```
┌─────────────────────────────────────────┐
│ 0x5000: Ping (every 5-10 seconds)       │
│ 0x5000: Pong (response)                 │
└─────────────────────────────────────────┘
```

---

## Gestion des Sessions

### Session ID

**Format:** 4 bytes (uint32)
**Génération:** Serveur-side
**Utilisation:**
- Identifiant unique de la connexion
- Tracking du joueur dans le serveur
- Validation des packets

### Security Bytes

**Format:** 2 bytes (uint16)
**Génération:** Aléatoire, renouvelé périodiquement
**Utilisation:**
- Présent dans chaque packet client
- Validation serveur
- Anti-spoofing

**Position dans le packet:**
- Bytes 2-3 (après Packet Size)

**Rotation:**
- Renouvelés toutes les X minutes
- Notification du client via packet spécifique
- Anciens bytes acceptés pendant transition

---

## Gestion des Pertes de Packets

### Packet Counting

**Système:**
- Compteur incrémental dans chaque packet
- Détection de packets manquants
- Resynchronisation automatique

**Détéction:**
```
If (packet.count != expected_count) {
    // Packet manquant détecté
    RequestResend(expected_count);
}
```

### Replay Attack Prevention

**Système:**
- Timestamp dans chaque packet
- Validation serveur
- Rejet des packets dupliqués

---

## Compression

### Zlib Compression

**Condition:** Payload > ~100 bytes

**Indicateur:** Flag dans le packet (probablement bit dans l'opcode)

**Processus:**
```
Original Payload (150 bytes)
       ↓
   Compress (zlib)
       ↓
Compressed Payload (80 bytes)
       ↓
   Encrypt (Blowfish)
       ↓
Send to Server
```

**Décompression:**
```
Receive Packet
       ↓
   Decrypt (Blowfish)
       ↓
Check Compression Flag
       ↓
   Decompress (zlib)
       ↓
Parse Payload
```

---

## Timeout et Déconnexion

### Keep-Alive (0x5000)

**Client → Server (Ping)**
```
Intervalle: 5-10 secondes
```

**Server → Client (Pong)**
```
Response immédiate
```

### Timeout Detection

**Client:**
- Pas de réponse > 30 seconds → Déconnexion
- 3 pings sans réponse → Déconnexion

**Server:**
- Pas de ping > 60 seconds → Déconnexion
- Socket error → Déconnexion

### Graceful Disconnect

**Client Initiated:**
```
1. Envoi packet 0x7000 (Logout Request)
2. Attendre confirmation
3. Fermer socket
```

**Server Initiated:**
```
1. Notification packet (0x7XXX)
2. Fermeture socket
```

---

## Codes d'Erreur

### Login Errors

| Code | Description |
|------|-------------|
| 1 | Success |
| 2 | Invalid password |
| 3 | Account not found |
| 4 | Account banned |
| 5 | Already logged in |
| 6 | Server full |
| 7 | Wrong version |
| 8 | Server maintenance |
| 9 | Account suspended |

### Game Errors

| Code | Description |
|------|-------------|
| 0x01 | Invalid opcode |
| 0x02 | Packet too large |
| 0x03 | Checksum error |
| 0x04 | Invalid security bytes |
| 0x05 | Not authenticated |
| 0x06 | Region change failed |
| 0x07 | Invalid position |
| 0x08 | Character not found |

---

## Sécurité du Protocole

### Encryption Blowfish

**Propriétés:**
- Algorithme symétrique
- Block size: 8 bytes
- Key size: 128-448 bits
- Mode: ECB ou CBC

**Fonctionnement:**
```
Plain Packet
     ↓
Add Security Bytes
     ↓
Encrypt Payload (Blowfish)
     ↓
Send via TCP
```

### Checksum

**Validation:**
- Checksum dans le dernier byte
- Calcul: XOR de tous les bytes du payload
- Rejet si invalide

### Anti-Spoofing

**Security Bytes:**
- Uniques par session
- Validés pour chaque packet
- Rotation périodique

### Anti-Replay

**Timestamps:**
- Timestamp dans chaque packet
- Validation serveur
- Rejet des packets anciens

---

## Optimisations

### Packet Batching

**Regroupement:**
- Plusieurs actions dans un seul packet
- Réduit le nombre de packets
- Améliore les performances

**Exemple:**
```
Packet: Movement + Action
├─ Movement (X, Y, Z)
└─ Action (Attack)
```

### Delta Encoding

**Compression des positions:**
- Envoyer uniquement le delta
- Réduit la taille des packets de mouvement

**Exemple:**
```
Position actuelle: (100, 200, 50)
Nouvelle position: (105, 205, 50)
Delta: (+5, +5, 0)  ← Plus petit que position absolue
```

---

## Ports Utilisés

### Standard Ports

| Service | Port | Protocol |
|---------|------|----------|
| Gateway / Agent | 15779 | TCP |
| Shard / Game | 15879 | TCP |
| Download | 15880 | TCP |
| Farm Server | Variable | TCP |
| Castle Server | Variable | TCP |

### Configuration

**Fichier:** `div.txt` ou `media.pk2`

**Exemple:**
```
IP "192.168.1.100"
PORT 15779
```

---

## 💻 Exemples de Code

### Exemple 1: Connexion TCP Basique (C#)

```csharp
// Exemple de connexion TCP au serveur Silkroad
using System;
using System.Net.Sockets;

class SilkroadClient
{
    static void Main()
    {
        try
        {
            // Configuration de la connexion
            string serverIp = "127.0.0.1";
            int serverPort = 15779;
            
            // Création du socket TCP
            TcpClient client = new TcpClient(serverIp, serverPort);
            NetworkStream stream = client.GetStream();
            
            Console.WriteLine("Connecté au serveur Silkroad!");
            
            // Envoi d'un packet de handshake simplifié
            byte[] handshake = new byte[] { 0xA4, 0xB1, 0x00, 0x01 };
            stream.Write(handshake, 0, handshake.Length);
            
            // Lecture de la réponse
            byte[] buffer = new byte[1024];
            int bytesRead = stream.Read(buffer, 0, buffer.Length);
            
            Console.WriteLine("Réponse du serveur: " + BitConverter.ToString(buffer, 0, bytesRead));
            
            // Fermeture de la connexion
            stream.Close();
            client.Close();
        }
        catch (Exception e)
        {
            Console.WriteLine("Erreur: " + e.Message);
        }
    }
}
```

### Exemple 2: Chiffrement Blowfish (Python)

```python
# Exemple d'implémentation du chiffrement Blowfish
from Crypto.Cipher import Blowfish
from Crypto import Random

class SilkroadCrypto:
    def __init__(self, key):
        self.key = key
        self.iv = Random.new().read(Blowfish.block_size)
        
    def encrypt(self, data):
        cipher = Blowfish.new(self.key, Blowfish.MODE_CBC, self.iv)
        encrypted = cipher.encrypt(data)
        return self.iv + encrypted
        
    def decrypt(self, data):
        iv = data[:Blowfish.block_size]
        cipher = Blowfish.new(self.key, Blowfish.MODE_CBC, iv)
        decrypted = cipher.decrypt(data[Blowfish.block_size:])
        return decrypted

# Utilisation
key = b'MySecretKey123'  # Clé de 16 octets
crypto = SilkroadCrypto(key)

plaintext = b'Hello Silkroad!'
encrypted = crypto.encrypt(plaintext)
decrypted = crypto.decrypt(encrypted)

print(f"Original: {plaintext}")
print(f"Chiffré: {encrypted.hex()}")
print(f"Déchiffré: {decrypted}")
```

### Exemple 3: Parsing de Packet (JavaScript)

```javascript
// Exemple de parsing d'un packet Silkroad en Node.js
class SilkroadPacket {
    constructor(buffer) {
        this.buffer = buffer;
        this.offset = 0;
    }
    
    readByte() {
        const value = this.buffer.readUInt8(this.offset);
        this.offset += 1;
        return value;
    }
    
    readUInt16() {
        const value = this.buffer.readUInt16LE(this.offset);
        this.offset += 2;
        return value;
    }
    
    readUInt32() {
        const value = this.buffer.readUInt32LE(this.offset);
        this.offset += 4;
        return value;
    }
    
    readString(length) {
        const value = this.buffer.toString('utf8', this.offset, this.offset + length);
        this.offset += length;
        return value.trim();
    }
    
    parse() {
        const codeByte = this.readByte();
        const securityByte = this.readByte();
        const opcode = this.readUInt16();
        const size = this.readUInt16();
        
        return {
            codeByte,
            securityByte,
            opcode,
            size,
            payload: this.buffer.slice(this.offset)
        };
    }
}

// Utilisation
const packetData = Buffer.from('A4B120001800', 'hex');
const packet = new SilkroadPacket(packetData);
const parsed = packet.parse();

console.log('Packet parsé:', parsed);
```

### Exemple 4: Gestion des Connexions (TypeScript)

```typescript
// Exemple de gestion de connexion avec gestion d'erreurs
import { Socket } from 'net';

class SilkroadConnection {
    private socket: Socket;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    
    constructor(host: string, port: number) {
        this.socket = new Socket();
        this.connect(host, port);
    }
    
    private connect(host: string, port: number) {
        this.socket.connect(port, host, () => {
            console.log('Connecté au serveur Silkroad');
            this.reconnectAttempts = 0;
            this.setupHandlers();
        });
        
        this.socket.on('error', (error) => {
            console.error('Erreur de connexion:', error.message);
            this.handleReconnect(host, port);
        });
        
        this.socket.on('close', () => {
            console.log('Connexion fermée');
            this.handleReconnect(host, port);
        });
    }
    
    private handleReconnect(host: string, port: number) {
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
            this.reconnectAttempts++;
            const delay = Math.pow(2, this.reconnectAttempts) * 1000;
            console.log(`Tentative de reconnexion ${this.reconnectAttempts}/${this.maxReconnectAttempts} dans ${delay}ms...`);
            
            setTimeout(() => {
                console.log('Tentative de reconnexion...');
                this.socket = new Socket();
                this.connect(host, port);
            }, delay);
        } else {
            console.error('Nombre maximum de tentatives de reconnexion atteint');
        }
    }
    
    private setupHandlers() {
        this.socket.on('data', (data) => {
            console.log('Données reçues:', data.length, 'octets');
            // Traiter les données ici
        });
        
        // Envoyer un ping périodique
        setInterval(() => {
            const pingPacket = Buffer.from('A4B10000', 'hex');
            this.socket.write(pingPacket);
        }, 30000);
    }
    
    public sendPacket(packet: Buffer) {
        if (this.socket.writable) {
            this.socket.write(packet);
        } else {
            console.error('Socket non disponible pour l'écriture');
        }
    }
    
    public close() {
        this.socket.end();
    }
}

// Utilisation
const connection = new SilkroadConnection('127.0.0.1', 15779);
```

---

## ❓ FAQ - Protocole Réseau

### Questions Fréquentes sur le Protocole Réseau

**Q: Quel est le port par défaut pour la connexion au serveur ?**
R: Le port par défaut est **15779** pour la connexion initiale au Gateway Server. Les ports pour les shards peuvent varier mais sont généralement dans la plage 15779-15785.

**Q: Comment fonctionne le système de handshake et d'authentification ?**
R: Le processus de handshake implique :
1. **Connexion TCP** initiale au Gateway
2. **Échange de clés** pour établir une session sécurisée
3. **Challenge du serveur** que le client doit résoudre
4. **Authentification** avec les informations de compte
5. **Redirection** vers le shard approprié

**Q: Quels sont les principaux défis de sécurité du protocole ?**
R: **Défis de sécurité** :
- **Packet sniffing** : Interception des données non chiffrées
- **Replay attacks** : Réutilisation de packets valides
- **Man-in-the-middle** : Interception et modification des communications
- **DDoS attacks** : Surcharge du serveur avec des connexions

**Q: Comment déboguer les problèmes de connexion ?**
R: **Méthodes de débogage** :
1. **Vérifiez la connectivité** avec ping et traceroute
2. **Analysez les logs** côté client et serveur
3. **Utilisez Wireshark** pour capturer le trafic réseau
4. **Testez avec des outils** comme TCPView
5. **Vérifiez les pare-feux** et les règles de sécurité

**Q: Quelles sont les bonnes pratiques pour implémenter le protocole ?**
R: **Bonnes pratiques** :
- **Chiffrement** : Utilisez toujours Blowfish pour les données sensibles
- **Validation** : Validez tous les packets entrants
- **Timeouts** : Implémentez des timeouts pour les connexions
- **Journalisation** : Loggez les activités suspectes
- **Mises à jour** : Maintenez le protocole à jour

---

## 🔗 Voir aussi

### Documentation Technique Connexe
- [Database Structure](DATABASE_STRUCTURE.md) - Structure de la base de données
- [Packet Structure](PACKET_STRUCTURE.md) - Structure détaillée des paquets
- [Server Client Architecture](SERVER_CLIENT_ARCHITECTURE.md) - Architecture globale
- [Security Systems](SECURITY_SYSTEMS.md) - Systèmes de sécurité

### Guides de Développement
- [Development Technical Guide](../SRO_KNOWLEDGE_BASE/DEVELOPMENT_TECHNICAL_GUIDE.md) - Guide technique complet
- [BabylonJS Integration](BABYLONJS_INTEGRATION.md) - Intégration client WebGL
- [Technical Specifications](../SRO_KNOWLEDGE_BASE/TECHNICAL_SPECIFICATIONS.md) - Spécifications techniques

### Ressources Externes
- **TCP/IP Guide** : [tcpipguide.com](http://www.tcpipguide.com)
- **Network Security** : [sans.org](https://www.sans.org)
- **Cryptography** : [cryptography.com](https://www.cryptography.com)

---

## 📊 Statistiques du Protocole

### Performances Typiques

```
Latence moyenne: 50-150ms
Bande passante: 5-20 KB/s par client
Connexions simultanées: 1000-5000
Packets par seconde: 50-200
Taille moyenne des packets: 50-200 bytes
```

### Sécurité

```
Chiffrement: Blowfish (128-bit)
Authentification: Challenge-Response
Integrité: CRC32 checksums
Sessions: Jetons temporaires
Timeouts: 30-60 secondes
```

### Bonnes Pratiques

```
Validation: 100% des packets validés
Chiffrement: Toutes les données sensibles
Logging: Toutes les activités critiques
Monitoring: Surveillance en temps réel
Mises à jour: Correctifs mensuels
```

---

## 🎓 Conseils Avancés

### Optimisation des Performances

**Techniques d'optimisation** :
1. **Compression** : Compressez les données pour réduire la bande passante
2. **Batching** : Regroupez les packets pour réduire les overheads
3. **Caching** : Cachez les données fréquemment utilisées
4. **Priorisation** : Priorisez les packets critiques

### Gestion des Connexions

**Stratégies de gestion** :
1. **Pool de connexions** pour réduire les overheads
2. **Keep-alive** pour maintenir les connexions actives
3. **Reconnexion automatique** en cas d'échec
4. **Load balancing** pour distribuer la charge

### Sécurité Avancée

**Mesures de sécurité avancées** :
1. **Détection d'intrusion** pour identifier les attaques
2. **Prévention DDoS** avec des limites de taux
3. **Chiffrement de bout en bout** pour toutes les communications
4. **Authentification multi-facteurs** pour les comptes sensibles

---

## Références

- [SilkroadDoc GitHub](https://github.com/DummkopfOfHachtenduden/SilkroadDoc)
- [Elitepvpers - Packet Extraction](https://www.elitepvpers.com/forum/sro-coding-corner/270486-guide-extracting-parsed-packets-silkroad.html)
- [Silk Road Security PDF](https://pdfcoffee.com/silk-road-security-pdf-free.html)

---

**Document version:** 1.1
**Date:** 20 janvier 2026
**Basé sur:** VSRO 1.188
**Status:** ✅ Documenté et enrichi
**Améliorations:** Ajout de FAQ, Voir aussi, Statistiques et Conseils avancés
