# Systèmes de Sécurité - Silkroad Online

## Vue d'ensemble

Silkroad Online utilise plusieurs couches de sécurité pour protéger le client et le serveur contre les triches, le hacking et les attaques. Ce document détaille ces systèmes.

**Version:** VSRO 1.188
**Anti-Cheat:** nProtect GameGuard
**Encryption:** Blowfish

---

## 1. Anti-Cheat: nProtect GameGuard

### Description

**GameGuard** est un anti-cheat développé par INCA Internet. Il est injecté dans le processus du jeu pour détecter et prévenir les logiciels de triche.

**Fonctionnalités:**
- Scan de la mémoire pour détecter les cheats
- Blocage des processus suspects
- Protection contre le debugging
- Détection de modifications du client

---

### Installation de GameGuard

**Fichiers:**
```
Silkroot Online/
├── GameGuard/
│   ├── GameGuard.des      // Configuration
│   ├── GameMon.des        // Processus de monitoring
│   ├── npptnt2.dll        // DLL principale
│   ├── nppt9x.vms         // Signatures de cheats
│   └── nppt94.dll         // DLL auxiliaire
└── GameGuard.crt         // Certificat
```

**Processus de lancement:**
1. Lancement de `SR_Client.exe`
2. Chargement de `npptnt2.dll`
3. Téléchargement des mises à jour GameGuard
4. Lancement de `GameMon.des`
5. Vérification de l'intégrité du client
6. Lancement du jeu

---

### Fonctionnement

#### Memory Scanning

**Scan périodique:**
- Toutes les 30-60 secondes
- Scan de la mémoire du processus
- Recherche de patterns connus de cheats
- Détection de modifications

**Détection:**
- ReadProcessMemory sur le jeu
- Cheat Engine
- Trainers
- Bots
- Packet sniffers

**Réaction:**
- Fermeture du jeu
- Bannissement temporaire
- Report au serveur
- Ban du compte

---

#### Process Blocking

**Processus bloqués:**
```
- CheatEngine.exe
- OllyDbg.exe
- WPE Pro.exe
- Wireshark.exe
- etc.
```

**Méthode:**
- Énumération des processus Windows
- Comparaison avec une liste noire
- Terminaison des processus suspects

---

#### Anti-Debugging

**Techniques:**
1. **IsDebuggerPresent API**
   ```cpp
   if (IsDebuggerPresent()) {
       // Debugger détecté
       ExitProcess(0);
   }
   ```

2. **CheckRemoteDebuggerPresent**
   ```cpp
   BOOL isDebuggerPresent;
   CheckRemoteDebuggerPresent(GetCurrentProcess(), &isDebuggerPresent);
   if (isDebuggerPresent) {
       ExitProcess(0);
   }
   ```

3. **Timing Checks**
   ```cpp
   DWORD start = GetTickCount();
   // Code suspect
   DWORD end = GetTickCount();
   if (end - start > threshold) {
       // Debugger détecté (slowdown)
       ExitProcess(0);
   }
   ```

4. **Hardware Breakpoints**
   - Vérification des Debug Registers

5. **Software Breakpoints**
   - Scan du code pour INT3 (0xCC)

---

#### Integrity Checks

**Vérification du code:**
- CRC32 du code du client
- Hash des DLLs chargées
- Vérification des imports

**Vérification des fichiers:**
- CRC32 de `SR_Client.exe`
- CRC32 de `media.pk2`
- Détection de modifications

---

### Contournements (Théorique)

**Note:** Ces informations sont fournies à des fins éducatives uniquement.

#### Désactiver GameGuard

**Méthodes:**
1. **Remplacer les fichiers**
   - Remplacer `GameGuard.des` par une version vide
   - Supprimer `npptnt2.dll`

2. **Bypasser le chargement**
   - Modifier le client pour ne pas charger GameGuard
   - Patch de l'import table

3. **Emuler GameGuard**
   - Créer une fausse DLL qui répond aux requêtes
   - Simuler la présence de GameGuard

**Risques:**
- Bannissement du compte
- Détection par le serveur
- Instabilité du client

---

### Impact sur le Développement

**Pour SRObro:**
- GameGuard n'est pas nécessaire (pas de client à protéger)
- Les packets doivent être validés côté serveur
- L'anti-cheat doit être réimplémenté différemment

**Solutions alternatives:**
- Validation serveur de tous les packets
- Rate limiting
- Détection de comportements anormaux
- Système de report joueurs

---

## 2. Encryption Réseau: Blowfish

### Description

**Blowfish** est un algorithme de chiffrement symétrique par blocs. Silkroad l'utilise pour chiffrer les packets réseau.

**Propriétés:**
- Block size: 8 bytes
- Key size: 32-448 bits (typiquement 128 bits)
- Mode: ECB (Electronic Codebook) ou CBC

---

### Clé d'Encryption

**Génération de la clé:**

**Option 1: Clé Pré-partagée**
```
Hardcodée dans le client et le serveur
```

**Option 2: Échange Diffie-Hellman**
```
1. Client et serveur génèrent chacun une paire de clés
2. Échange des clés publiques
3. Calcul de la clé partagée
```

**Option 3: Challenge-Response**
```
1. Serveur envoie un challenge
2. Client répond avec la clé dérivée du challenge
```

---

### Processus d'Encryption

#### Packet Client → Serveur

```
┌─────────────────────────────────────────────────────────────────┐
│  Encryption Process                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. Construire le packet                                       │
│     ┌────┬────┬────┬────┬────┬────┬──────────┐               │
│     │ SB │ SB │ Op │ Op │ Sz │ Sz │ Payload  │               │
│     └────┴────┴────┴────┴────┴────┴──────────┘               │
│                                                                  │
│  2. Séparer header et payload                                  │
│     Header: 6 bytes (NON encrypté)                             │
│     Payload: N bytes (À encrypter)                             │
│                                                                  │
│  3. Padding                                                    │
│     Ajouter du padding pour atteindre un multiple de 8 bytes   │
│     PKCS#5 ou PKCS#7                                           │
│                                                                  │
│  4. Encrypter le payload                                       │
│     Blowfish_Encrypt(Payload, Key)                             │
│                                                                  │
│  5. Envoyer le packet                                          │
│     [Header] + [Payload_Encrypté]                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

#### Packet Serveur → Client

**Identique au Client → Serveur**

---

### Implémentation Blowfish

#### En C#

```csharp
using System;
using System.Security.Cryptography;
using System.IO;

public class SilkroadEncryption
{
    private BlowfishECB _blowfish;
    private byte[] _key;

    public SilkroadEncryption(byte[] key)
    {
        _key = key;
        _blowfish = new BlowfishECB(key);
    }

    public byte[] Encrypt(byte[] data)
    {
        // Padding PKCS#7
        int padding = 8 - (data.Length % 8);
        byte[] padded = new byte[data.Length + padding];
        Array.Copy(data, padded, data.Length);
        for (int i = data.Length; i < padded.Length; i++)
        {
            padded[i] = (byte)padding;
        }

        // Encrypt
        return _blowfish.Encrypt(padded);
    }

    public byte[] Decrypt(byte[] data)
    {
        // Decrypt
        byte[] decrypted = _blowfish.Decrypt(data);

        // Remove padding
        int padding = decrypted[decrypted.Length - 1];
        byte[] result = new byte[decrypted.Length - padding];
        Array.Copy(decrypted, result, result.Length);

        return result;
    }
}
```

#### En TypeScript (Node.js)

```typescript
import * as crypto from 'crypto';

export class SilkroadEncryption {
    private key: Buffer;
    private algorithm = 'bf-ecb';

    constructor(key: Buffer) {
        this.key = key;
    }

    public encrypt(data: Buffer): Buffer {
        const cipher = crypto.createCipheriv(this.algorithm, this.key, null);
        const padded = this.pkcs7Pad(data);
        return Buffer.concat([cipher.update(padded), cipher.final()]);
    }

    public decrypt(data: Buffer): Buffer {
        const decipher = crypto.createDecipheriv(this.algorithm, this.key, null);
        const decrypted = Buffer.concat([decipher.update(data), decipher.final()]);
        return this.pkcs7Unpad(decrypted);
    }

    private pkcs7Pad(data: Buffer): Buffer {
        const padding = 8 - (data.length % 8);
        const padded = Buffer.alloc(data.length + padding);
        data.copy(padded);
        padded.fill(padding, data.length);
        return padded;
    }

    private pkcs7Unpad(data: Buffer): Buffer {
        const padding = data[data.length - 1];
        return data.slice(0, data.length - padding);
    }
}
```

---

## 3. Validation des Packets

### Security Bytes

**Description:** 4 bytes uniques par connexion

**Génération:**
```cpp
// Serveur
srand(time(NULL));
securityByte1 = rand() % 256;
securityByte2 = rand() % 256;
```

**Validation:**
```cpp
// Serveur - À la réception d'un packet
if (packet[0] != securityByte1 || packet[1] != securityByte2) {
    // Packet invalide
    DisconnectClient();
}
```

---

### Checksum

**Calcul:**
```cpp
uint8_t CalculateChecksum(uint8_t* data, int length) {
    uint8_t checksum = 0;
    for (int i = 0; i < length; i++) {
        checksum ^= data[i];
    }
    return checksum;
}
```

**Validation:**
```cpp
uint8_t receivedChecksum = packet[packetSize - 1];
uint8_t calculatedChecksum = CalculateChecksum(packet, packetSize - 1);

if (receivedChecksum != calculatedChecksum) {
    // Packet corrompu
    return;
}
```

---

### Packet Counting

**But:** Détection de packets perdus

**Client:**
```cpp
uint16_t packetCount = 0;

void SendPacket(Packet* packet) {
    packet->count = packetCount++;
    socket.Send(packet);
}
```

**Serveur:**
```cpp
uint16_t expectedCount = 0;

void OnPacketReceived(Packet* packet) {
    if (packet->count != expectedCount) {
        // Packet manquant détecté
        RequestResend(expectedCount);
    }
    expectedCount = packet->count + 1;
}
```

---

## 4. Protection du Client

### Memory Protection

**Protection de la mémoire:**
```cpp
// Read-only memory pour les données critiques
VirtualProtect(
    criticalData,
    size,
    PAGE_READONLY,
    &oldProtect
);
```

**Détection de modifications:**
```cpp
uint32_t CalculateCRC(void* data, int size) {
    // Calculer le CRC32
}

void CheckIntegrity() {
    uint32_t currentCRC = CalculateCRC(criticalData, size);
    if (currentCRC != originalCRC) {
        // Mémoire modifiée
        ExitProcess(0);
    }
}
```

---

### Anti-Tampering

**Vérification des DLLs:**
```cpp
BOOL VerifyDLL(HMODULE hModule) {
    // Calculer le hash de la DLL
    // Comparer avec le hash attendu
    return TRUE;
}
```

**Vérification des imports:**
```cpp
BOOL VerifyImports() {
    // Vérifier que les imports attendus sont présents
    // Détecter les hooks
    return TRUE;
}
```

---

### Code Obfuscation

**Techniques:**
1. **String Encryption**
   - Chiffrer les chaînes de caractères
   - Déchiffrer à l'exécution

2. **Control Flow Obfuscation**
   - Ajouter des sauts inutiles
   - Découper les fonctions

3. **Virtualization**
   - Exécuter le code dans une VM
   - Obscurcir la logique

---

## 5. Sécurité Côté Serveur

### Validation des Données

**Règle de base:**
> Never trust the client

**Exemples:**
```cpp
// Movement validation
void OnMovementPacket(Client* client, float x, float y, float z) {
    // Vérifier que la nouvelle position est valide
    if (x < 0 || x > MAP_WIDTH ||
        y < 0 || y > MAP_HEIGHT ||
        z < 0 || z > MAX_HEIGHT) {
        // Position invalide
        DisconnectClient(client);
        return;
    }

    // Vérifier la vitesse (anti-speedhack)
    float distance = CalculateDistance(client->position, x, y, z);
    float maxDistance = client->speed * deltaTime;

    if (distance > maxDistance * 2.0f) {  // Tolérance 2x
        // Speed hack détecté
        LogSuspiciousActivity(client, "Speed hack");
        // Ne pas mettre à jour la position
        return;
    }

    // Mettre à jour la position
    client->position = {x, y, z};
}
```

---

### Rate Limiting

**Anti-spam:**
```cpp
struct ClientRateLimit {
    time_t lastChatTime;
    int chatCount;
};

bool CanSendChat(Client* client) {
    time_t now = time(NULL);

    if (now - client->rateLimit.lastChatTime >= 1) {
        // Reset le compteur chaque seconde
        client->rateLimit.lastChatTime = now;
        client->rateLimit.chatCount = 0;
    }

    if (client->rateLimit.chatCount >= 10) {
        // Trop de messages en 1 seconde
        return FALSE;
    }

    client->rateLimit.chatCount++;
    return TRUE;
}
```

---

### Détection d'Anomalies

**Comportements suspects:**
1. Vitesse de déplacement excessive
2. Attaques trop rapides
3. Pickup d'items à distance
4. Téléportation
5. Dégâts anormaux

**Réponse:**
- Avertissement
- Kick
- Ban temporaire
- Ban permanent

---

## 6. Sécurité pour SRObro

### Recommandations

**Côté Backend (Node.js/TypeScript):**

1. **Validation stricte**
   - Valider toutes les données du client
   - Ne jamais faire confiance au client

2. **Rate limiting**
   - Limiter le nombre de packets par seconde
   - Limiter les actions (chat, attaque, mouvement)

3. **Authentification**
   - JWT (JSON Web Tokens)
   - Refresh tokens
   - HTTPS/TLS obligatoire

4. **Encryption WebSocket**
   - WSS (WebSocket Secure)
   - Chiffrement de bout en bout

**Côté Frontend (Babylon.js):**

1. **Obfuscation du code**
   - Minification
   - Obscurcissement

2. **Pas de logique critique**
   - Tout se passe côté serveur
   - Le client n'est qu'une interface

3. **Anti-debug**
   - Difficile dans un navigateur
   - Peut être partiellement implémenté

---

## Références

- [Silk Road Security PDF](https://pdfcoffee.com/silk-road-security-pdf-free.html)
- [nProtect GameGuard](https://en.wikipedia.org/wiki/GameGuard)
- [Blowfish Encryption](https://en.wikipedia.org/wiki/Blowfish_(cipher))

---

**Document version:** 1.0
**Date:** 20 janvier 2026
**Basé sur:** VSRO 1.188
**Status:** ✅ Documenté
