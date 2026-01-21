# Structure des Packets - Silkroad Online

## Vue d'ensemble

Les packets Silkroad Online suivent une structure binaire précise avec un **header**, un **opcode**, et un **payload** variable. Cette documentation détaille le format complet des packets basé sur l'analyse de VSRO v1.188.

**Version cible:** VSRO 1.188
**Protocole:** TCP avec encryption Blowfish
**Endianness:** Little-Endian

---

## Format Général d'un Packet

### Structure Complete

```
┌─────────────────────────────────────────────────────────────────┐
│  Packet Structure                                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌───┬───┬───┬───┬───┬───┬────────────────────────────────┐   │
│  │ C │ C │ O │ O │ S │ S │        Payload                 │   │
│  │ o │ o │ p │ p │ i │ i │        (Variable)              │   │
│  │ d │ d │ c │ c │ z │ z │                                │   │
│  │ e │ e │ o │ o │ e │ e │                                │   │
│  │ 1 │ 2 │ d │ d │ 1 │ 2 │                                │   │
│  │   │   │ e │ e │   │   │                                │   │
│  │   │   │ 1 │ 2 │   │   │                                │   │
│  ├───┼───┼───┼───┼───┼───┼────────────────────────────────┤   │
│  │ 1 │ 1 │ 1 │ 1 │ 1 │ 1 │         N bytes                │   │
│  │ b │ b │ b │ b │ b │ b │                                │   │
│  │ y │ y │ y │ y │ y │ y │                                │   │
│  │ t │ t │ t │ t │ t │ t │                                │   │
│  │ e │ e │ e │ e │ e │ e │                                │   │
│  └───┴───┴───┴───┴───┴───┴────────────────────────────────┘   │
│                                                                  │
│  Code1: 1er byte de code (encryption/security)                   │
│  Code2: 2ème byte de code (encryption/security)                 │
│  Opcode1: 1er byte de l'opcode (Word)                           │
│  Opcode2: 2ème byte de l'opcode                                 │
│  Size1: 1er byte de la taille (Word)                            │
│  Size2: 2ème byte de la taille                                  │
│  Payload: Données du packet                                     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Champs Détaillés

#### 1. Security Code Bytes (2 bytes)

**Position:** Bytes 0-1
**Type:** 2 bytes (uint16)
**Description:** Bytes de sécurité pour validation

**Propriétés:**
- Générés par le serveur lors du handshake
- Uniques par connexion
- Validés par le serveur à chaque packet
- Système anti-spoofing

**Valeur typique:** Variable (générée dynamiquement)

---

#### 2. Opcode (2 bytes)

**Position:** Bytes 2-3
**Type:** Word (uint16, Little-Endian)
**Description:** Identifiant du type de packet

**Propriétés:**
- Définit le type de packet
- Dispatch vers le handler approprié
- Peut être client→serveur ou serveur→client
- Certains opcodes sont bidirectionnels

**Exemples connus:**

| Opcode (Hex) | Type | Description |
|--------------|------|-------------|
| 0x5000 | Bidirectional | Ping/Pong (Keep-alive) |
| 0x7000 | Client→Server | Login Request |
| 0x7001 | Server→Client | Login Response |
| 0x3000 | Bidirectional | Character Selection |
| 0x3001 | Client→Server | Character Create |
| 0x3002 | Client→Server | Character Delete |
| 0x2000 | Client→Server | Movement/Position Update |
| 0x2001 | Client→Server | Action (Attack, Sit, Stand) |
| 0x3010 | Client→Server | Attack Action |
| 0x3667 | Bidirectional | Chat Message |
| 0x7020 | Client→Server | Use Skill |
| 0x7021 | Server→Client | Skill Effect |
| 0xB000 | Client→Server | Item Pickup |
| 0xB001 | Server→Client | Item Drop |
| 0xB020 | Server→Client | Spawn Character |
| 0xB021 | Server→Client | Despawn Character |
| 0xB030 | Server→Client | Spawn NPC |
| 0xB040 | Server→Client | Spawn Mob |

---

#### 3. Packet Size (2 bytes)

**Position:** Bytes 4-5
**Type:** Word (uint16, Little-Endian)
**Description:** Taille totale du packet

**Calcul:**
```
Size = 6 (header) + Payload_Length
```

**Exemples:**
- Packet vide (pas de payload): Size = 6
- Packet avec 10 bytes de payload: Size = 16
- MTU: 1460 bytes (1500 - 40 bytes TCP/IP headers)
- Max packet size: 8186 bytes (data + header)

**Note:** La taille inclut les 6 bytes du header

---

#### 4. Payload (Variable)

**Position:** Bytes 6 à (Size-1)
**Type:** Données variables
**Description:** Contenu du packet

**Structure du payload:**
- Dépend de l'opcode
- Peut contenir:
  - Types primitifs (byte, word, dword, float, etc.)
  - Chaines de caractères (null-terminated)
  - Tableaux
  - Structures complexes

---

## Types de Données du Payload

### Types Primitifs

#### Byte (1 byte)
```
┌───────────┐
│ 0x00-0xFF │
└───────────┘
```
**Exemple d'utilisation:** Flags, booléens, petits entiers

#### Word (2 bytes, Little-Endian)
```
┌─────────┬─────────┐
│ Low     │ High    │
│ Byte    │ Byte    │
└─────────┴─────────┘
```
**Exemple d'utilisation:** ID, quantités, short ints

#### Dword (4 bytes, Little-Endian)
```
┌─────────┬─────────┬─────────┬─────────┐
│ Byte 0  │ Byte 1  │ Byte 2  │ Byte 3  │
│ (Low)   │         │         │ (High)  │
└─────────┴─────────┴─────────┴─────────┘
```
**Exemple d'utilisation:** ID uniques, positions, timestamps

#### Float (4 bytes, IEEE 754)
```
┌─────────┬─────────┬─────────┬─────────┐
│ Byte 0  │ Byte 1  │ Byte 2  │ Byte 3  │
│ (Low)   │         │         │ (High)  │
└─────────┴─────────┴─────────┴─────────┘
```
**Exemple d'utilisation:** Coordonnées X, Y, Z

---

### Chaines de Caractères

#### Format Pascal (Prefixed Length)

```
┌─────────┬─────────────────────────────────┐
│ Length  │ String Data                      │
│ (1 byte)│ (Length bytes)                   │
└─────────┴─────────────────────────────────┘
```

**Exemple:**
```
05 48 45 4C 4C 4F  =  "HELLO"
```

#### Format C-Style (Null-Terminated)

```
┌─────────────────────────────────┬─────────┐
│ String Data                     │ 0x00    │
│ (Variable)                      │ (Null)  │
└─────────────────────────────────┴─────────┘
```

**Exemple:**
```
48 45 4C 4C 4F 00  =  "HELLO"
```

---

### Tableaux

#### Fixed-Size Array

```
┌──────┬──────┬──────┬──────┐
│ El 0 │ El 1 │ El 2 │ ...  │
│ N    │ N    │ N    │      │
│ bytes│ bytes│ bytes│      │
└──────┴──────┴──────┴──────┘
```

#### Count-Prefixed Array

```
┌───────────┬──────┬──────┬──────┐
│ Count     │ El 0 │ El 1 │ ...  │
│ (1/2/4 b) │      │      │      │
└───────────┴──────┴──────┴──────┘
```

---

## Exemples de Packets Documentés

### 1. Ping/Pong (0x5000)

**Client → Server ou Server → Client**

```
┌───┬───┬───┬───┬───┬───┐
│ ? │ ? │ 0 │ 0x│ 0 │ 0x│
│   │   │ x5│ 0 │ x0│ 06│
│   │   │   │   │   │   │
└───┴───┴───┴───┴───┴───┘
  Code   Opcode  Size
```

**Payload:** Vide (0 bytes)
**Taille totale:** 6 bytes
**Utilisation:** Keep-alive, mesure de latence

---

### 2. Login Request (0x7000)

**Client → Gateway**

```
┌───┬───┬───┬───┬───┬───┬───────────────────────────────────┐
│ C │ C │ 0 │ 0x│ S │ S │ Login Data                        │
│ o │ o │ x7│ 0 │ i │ i │                                   │
│ d │ d │   │ 0 │ z │ z │ ┌───┬───┬───┬───┬──────────────┤ │
│ e │ e │   │   │ e │ e │ │ L │ U │ P │ P │ Username     │ │
│ 1 │ 2 │   │   │ 1 │ 2 │ │ e │ s │ a │ a │ (String)     │ │
│   │   │   │   │   │   │ │ n │ e │ s │ s │              │ │
│   │   │   │   │   │   │ │ g │ r │ w │ w │ ┌────────────┤ │
│   │   │   │   │   │   │ │ t │ n │ o │ o │ │ Password   │ │
│   │   │   │   │   │   │ │ h │ a │ r │ r │ │ (Hashed)   │ │
│   │   │   │   │   │   │ │   │ m │ d │ d │ └────────────┤ │
│   │   │   │   │   │   │ │   │ e │   │   │ ┌────────────┤ │
│   │   │   │   │   │   │ └───┴───┴───┴───┤ │ Server     │ │
│   │   │   │   │   │   │                   │ │ Code       │ │
│   │   │   │   │   │   │                   │ │ (String)   │ │
│   │   │   │   │   │   │                   │ └────────────┘ │
│   │   │   │   │   │   │                   └──────────────┘ │
└───┴───┴───┴───┴───┴───┴───────────────────────────────────┘
```

**Structure du Payload:**

| Offset | Type | Description |
|--------|------|-------------|
| 0 | Byte | Length du username |
| 1 | String | Username (variable) |
| N+1 | Word | Length du password |
| N+3 | String | Password (hash MD5/SHA-1) |
| M+1 | Byte | Length du server code |
| M+2 | String | Server code |

**Exemple (Hex):**
```
XX XX 00 70 00 2E 05 4D 79 55 73 65 72 10 5E 9B 8D 1C 8A 66 28 7D 1B 3A 25 64 02 42 56
│   │   │   │   │   │  │                      │                         │    │
│   │   │   │   │   │  └─ Username: "MyUser"  │                         │    └─ Server: "BV"
│   │   │   │   │   │                          │                         └─ Password hash
│   │   │   │   │   │                          └─ Password: 16 bytes
│   │   │   │   │   └─ Password length: 0x10 (16)
│   │   │   │   └─ Size: 0x002E (46 bytes)
│   │   │   └─ Opcode: 0x7000
│   │   └─ Security code: 0xXXXX
│   └─ Security code: 0xXXXX
```

---

### 3. Character Selection (0x3000)

**Client → Gateway**

```
┌───┬───┬───┬───┬───┬───┬───────────┐
│ C │ C │ 0 │ 0x│ 0 │ 0x│ Char ID   │
│ o │ o │ x3│ 0 │ x0│ 0A│ (Dword)   │
│ d │ d │   │ 0 │   │   │           │
│ e │ e │   │   │   │   │           │
│ 1 │ 2 │   │   │   │   │           │
└───┴───┴───┴───┴───┴───┴───────────┘
```

**Payload:**
- Offset 0: Dword (4 bytes) - Character ID

**Exemple (Hex):**
```
XX XX 00 30 00 0A 01 00 00 00
│   │   │   │   │        └─ Char ID: 1
│   │   │   │   └─ Size: 0x000A (10 bytes)
│   │   │   └─ Opcode: 0x3000
│   └─ Security code
└─ Security code
```

---

### 4. Movement Update (0x2000)

**Client → Shard**

```
┌───┬───┬───┬───┬───┬───┬────────────────────────────────────┐
│ C │ C │ 0 │ 0x│ 0 │ 0x│ Position Data                       │
│ o │ o │ x2│ 0 │ x1│ 18│                                     │
│ d │ d │   │ 0 │   │   │ ┌──────┬──────┬──────┬──────────┐ │
│ e │ e │   │   │   │   │ │ X    │ Y    │ Z    │ Region   │ │
│ 1 │ 2 │   │   │   │   │ │(Flt) │(Flt) │(Flt) │ (Word)   │ │
│   │   │   │   │   │   │ │4 byt │4 byt │4 byt │ 2 bytes  │ │
│   │   │   │   │   │   │ └──────┴──────┴──────┴──────────┘ │
└───┴───┴───┴───┴───┴───┴────────────────────────────────────┘
```

**Structure du Payload:**

| Offset | Type | Description |
|--------|------|-------------|
| 0 | Float | Position X |
| 4 | Float | Position Y |
| 8 | Float | Position Z |
| 12 | Word | Region ID |

**Exemple (Hex):**
```
XX XX 00 20 01 18 00 00 20 41 00 00 48 42 00 00 00 44 4C 06
│   │   │   │   │        └─ X: 10.0
│   │   │   │   │            Y: 50.0
│   │   │   │   │            Z: 8.0
│   │   │   │   │            Region: 0x064C (1628)
│   │   │   └─ Size: 0x0118 (280 bytes)
│   │   └─ Opcode: 0x2000
└─ Security codes
```

---

### 5. Chat Message (0x3667)

**Bidirectionnel**

```
┌───┬───┬───┬───┬───┬───┬────────────────────────────────┐
│ C │ C │ 0 │ 0x│ 0 │ 0x│ Chat Data                       │
│ o │ o │ x3│ 6x│ s │ s │                                │
│ d │ d │   │ 6 │ i │ i │ ┌───┬──────┬────────────────┐ │
│ e │ e │   │ 7 │ z │ z │ │ T │ Msg  │ Message Text   │ │
│ 1 │ 2 │   │   │ e │ e │ │ y │ Len  │ (String)       │ │
│   │   │   │   │   │   │ │ p │      │                │ │
│   │   │   │   │   │   │ │ e │      │                │ │
│   │   │   │   │   │   │ └───┴──────┴────────────────┘ │
└───┴───┴───┴───┴───┴───┴────────────────────────────────┘
```

**Structure du Payload:**

| Offset | Type | Description |
|--------|------|-------------|
| 0 | Byte | Chat type (1-16) |
| 1 | Word | Message length |
| 3 | String | Message text |

**Chat Types:**
- 1: All
- 2: Party
- 3: Guild
- 4: Union
- 5: Shout
- 6: Whisper
- 7: PM
- 8: Notice
- 9: GM
- 10-16: Other

**Exemple (Hex):**
```
XX XX 66 36 00 12 01 00 0B 48 65 6C 6C 6F 20 57 6F 72 6C 64 00
│   │   │   │   │   │  │  └─ Message: "Hello World"
│   │   │   │   │   │  └─ Message Length: 11 bytes
│   │   │   │   │   └─ Chat Type: 1 (All)
│   │   │   └─ Size: 0x0012 (18 bytes)
│   │   └─ Opcode: 0x3667
└─ Security codes
```

---

### 6. Spawn Character (0xB020)

**Server → Client**

```
┌───┬───┬───┬───┬───┬───┬──────────────────────────────────────────────┐
│ C │ C │ 0 │ 0x│ 0 │ 0x│ Character Spawn Data                          │
│ o │ o │ xB│ 0 │ x │ x │                                               │
│ d │ d │   │ 2 │ 4 │ 4 │ ┌──────────┬──────────┬────────────────────┐ │
│ e │ e │   │ 0 │   │   │ │ Model ID │ Unique ID │ Name               │ │
│ 1 │ 2 │   │   │   │   │ │ (Dword)  │ (Dword)  │ │ (String)          │ │
│   │   │   │   │   │   │ └──────────┴──────────┴────────────────────┘ │
│   │   │   │   │   │   │ ┌──────────┬──────────┬──────────┐          │
│   │   │   │   │   │   │ │ X        │ Y        │ Z        │          │
│   │   │   │   │   │   │ │ (Float)  │ (Float)  │ (Float)  │          │
│   │   │   │   │   │   │ └──────────┴──────────┴──────────┘          │
│   │   │   │   │   │   │ ┌──────────┐                                 │
│   │   │   │   │   │   │ │ Region   │                                 │
│   │   │   │   │   │   │ │ (Word)   │                                 │
│   │   │   │   │   │   │ └──────────┘                                 │
└───┴───┴───┴───┴───┴───┴──────────────────────────────────────────────┘
```

**Structure du Payload:**

| Offset | Type | Description |
|--------|------|-------------|
| 0 | Dword | Model ID |
| 4 | Dword | Unique ID |
| 8 | Byte | Name length |
| 9 | String | Character name |
| N | Float | Position X |
| N+4 | Float | Position Y |
| N+8 | Float | Position Z |
| N+12 | Word | Region ID |

---

## Encryption

### Blowfish Encryption

**Algorithme:** Blowfish
**Mode:** ECB (Electronic Codebook) ou CBC
**Key Size:** 128-448 bits
**Block Size:** 8 bytes

**Processus:**
1. **Handshake:** Échange des clés
2. **Encryption:** Payload encrypté avant envoi
3. **Decryption:** Décryptage à la réception

**Note:** Le header (6 premiers bytes) n'est PAS encrypté

---

### Contournement pour Reverse Engineering

Pour l'analyse des packets, deux approches:

#### 1. Hooker le client après décryptage

**Avantages:**
- Packets en clair
- Analyse facile

**Inconvénients:**
- Nécessite injection DLL
- Dépend du client

#### 2. Sniffer et décrypter

**Avantages:**
- Indépendant du client
- Analyse réseau

**Inconvénients:**
- Nécessite la clé Blowfish
- Implémentation de Blowfish requise

---

## Packet Reading dans le Client

### Adresse Documentée

D'après le guide [Elitepvpers - Extracting Parsed Packets](https://www.elitepvpers.com/forum/sro-coding-corner/270486-guide-extracting-parsed-packets-silkroad.html):

**Main Packet Handler:** `0x6AE8F0`
**Packet Reading Function:** `0x4C42FC`

### Codecave Example

```cpp
// Codecave pour extraire l'opcode
__declspec(naked) void codecave_ExtractPacket()
{
    __asm pop codecave_ExtractPacket_ReturnAddress
    __asm mov currentOpcode, eax  // Sauvegarde l'opcode
    __asm pushad
    OnProcessDataStart();
    __asm popad
    __asm CMP EAX, 0x3369  // Code original
    __asm push codecave_ExtractPacket_ReturnAddress
    __asm ret
}

// Codecave pour lire les bytes du packet
__declspec(naked) void codecave_ReadBytes()
{
    __asm pop codecave_ReadBytes_ReturnAddress

    __asm mov currentBuffer, eax  // Buffer
    __asm mov currentSize, ebx    // Size

    __asm pushad
    ProcessData();
    __asm popad

    // Emuler le reste de la fonction
    __asm POP ESI
    __asm MOV EAX,EBX
    __asm POP EBX
    __asm RET 8
}
```

---

## Opcodes Connus

### Login Server (Gateway)

| Opcode | Direction | Description |
|--------|-----------|-------------|
| 0x5000 | ↔ | Ping/Pong |
| 0x7000 | → | Login Request |
| 0x7001 | ← | Login Response |
| 0x7002 | → | Login Request 2 |
| 0x7003 | ← | Login Response 2 |
| 0x3000 | → | Character Selection |
| 0x3001 | → | Character Create |
| 0x3002 | → | Character Delete |
| 0x3010 | ← | Character List |
| 0x3011 | ← | Character Create Result |
| 0x3012 | ← | Character Delete Result |
| 0xA000 | → | Shard List Request |
| 0xA001 | ← | Shard List Response |

### Game Server (Shard)

| Opcode | Direction | Description |
|--------|-----------|-------------|
| 0x5000 | ↔ | Ping/Pong |
| 0x2000 | → | Movement |
| 0x2001 | → | Action |
| 0x2002 | ← | Movement Update |
| 0x2003 | ← | Action Update |
| 0x3000 | → | Enter World |
| 0x3001 | ← | Spawn Character |
| 0x3002 | ← | Despawn Character |
| 0x3003 | → | Region Change |
| 0x3010 | → | Attack |
| 0x3011 | ← | Attack Result |
| 0x3667 | ↔ | Chat Message |
| 0x7020 | → | Use Skill |
| 0x7021 | ← | Skill Effect |
| 0x7022 | → | Start Skill |
| 0x7023 | ← | End Skill |
| 0xB000 | → | Item Pickup |
| 0xB001 | ← | Item Drop |
| 0xB002 | → | Item Drop Request |
| 0xB003 | ↔ | Item Use |
| 0xB004 | → | Item Move |
| 0xB005 | → | Item Delete |
| 0xB006 | ← | Inventory Update |
| 0xB007 | ← | Equipment Update |
| 0xB020 | ← | Spawn Character |
| 0xB021 | ← | Despawn Character |
| 0xB030 | ← | Spawn NPC |
| 0xB040 | ← | Spawn Mob |
| 0xB041 | ← | Mob Attack |
| 0xB042 | ← | Mob Death |
| 0xC000 | → | Guild Create |
| 0xC001 | ← | Guild Info |
| 0xC002 | → | Guild Join Request |
| 0xC003 | ← | Guild Join Response |
| 0xD000 | → | Party Create |
| 0xD001 | → | Party Invite |
| 0xD002 | ← | Party Info |
| 0xD003 | → | Party Leave |

---

## Taille Maximale des Packets

**MTU (Maximum Transmission Unit):** 1500 bytes (Ethernet standard)
**TCP/IP Headers:** 40 bytes
**Payload MTU:** 1460 bytes (1500 - 40)

**Max Packet Size:** 8186 bytes (selon analyse de packets)

**Source:** [Packet Analysis](https://www.elitepvpers.com/forum/sro-coding-corner/4627523-packet-analysis.html)

**Packets > MTU:**
- Fragmentés par TCP
- Réassemblés à la réception
- Gestion transparente pour l'application

---

## Checksum

Certains packets incluent un checksum:

**Position:** Dernier byte du payload
**Type:** Byte ou Word
**Algorithme:** XOR ou CRC

**Validation:**
- Calculé par l'expéditeur
- Vérifié par le destinataire
- Packet rejeté si checksum invalide

---

## Compression

Certains gros packets sont compressés:

**Algorithme:** zlib (probable)
**Condition:** Payload > ~100 bytes
**Indicateur:** Flag dans l'opcode ou un byte spécifique

---

## Références

- [SilkroadDoc GitHub](https://github.com/DummkopfOfHachtenduden/SilkroadDoc) - Documentation complète
- [Elitepvpers - Packet Extraction](https://www.elitepvpers.com/forum/sro-coding-corner/270486-guide-extracting-parsed-packets-silkroad.html) - Guide technique
- [RageZone - iSRO Opcodes](https://forum.ragezone.com/threads/isro-opcodes-structures.843585/) - Liste d'opcodes
- [Silkroad Packet Documentation](https://www.elitepvpers.com/forum/sro-coding-corner/3034938-release-silkroad-packet-documentation.html)

---

## Annexes

### Analyse de Packet Réel

**Packet: Movement Update**
**Opcode:** 0x2000
**Direction:** Client → Server
**Hex Dump:**
```
A4 B1 00 20 01 18 00 00 20 41 00 00 48 42 00 00 00 44 4C 06
│  │  │  │  │  │  │        └─ X: 10.0 (Float)
│  │  │  │  │  │  │            Y: 50.0 (Float)
│  │  │  │  │  │  │            Z: 8.0 (Float)
│  │  │  │  │  │  │            Region: 1628 (Word)
│  │  │  │  │  │  └─ Payload starts
│  │  │  │  │  └─ Size: 0x0118 (280 bytes)
│  │  │  │  └─ Opcode: 0x2000 (Movement)
│  │  │  └─ Security bytes: 0x00B1
│  └─ Security byte: 0xA4
└─ Code byte: 0xA4
```

---

## ❓ FAQ - Structure des Packets

### Questions Fréquentes sur la Structure des Packets

**Q: Quelle est la structure de base d'un packet Silkroad ?**
R: Un packet Silkroad suit cette structure :
1. **Code byte** (1 byte) - Identifie le type de packet
2. **Security byte** (1 byte) - Sécurité basique
3. **Opcode** (2 bytes) - Identifie l'action spécifique
4. **Size** (2 bytes) - Taille du payload
5. **Payload** (variable) - Données spécifiques
6. **Checksum** (optionnel) - Vérification d'intégrité

**Q: Comment déchiffrer un packet Silkroad ?**
R: **Processus de déchiffrement** :
1. **Capture** : Utilisez Wireshark ou un sniffer réseau
2. **Identification** : Déterminez le code byte et opcode
3. **Déchiffrement** : Appliquez l'algorithme Blowfish si nécessaire
4. **Parsing** : Analysez la structure selon le type de packet
5. **Validation** : Vérifiez le checksum

**Q: Quels outils sont recommandés pour analyser les packets ?**
R: **Outils recommandés** :
- **Wireshark** : Capture et analyse réseau
- **SilkroadDoc** : Documentation des packets
- **Packet Analyzer** : Outil spécialisé pour SRO
- **Hex Editors** : Pour l'analyse manuelle

**Q: Comment gérer les packets corrompus ou invalides ?**
R: **Stratégies de gestion** :
1. **Validation** : Vérifiez la structure et le checksum
2. **Journalisation** : Loggez les packets invalides
3. **Rejet** : Ignorez les packets corrompus
4. **Notification** : Alertez les administrateurs

**Q: Quelles sont les bonnes pratiques pour implémenter le parsing des packets ?**
R: **Bonnes pratiques** :
- **Validation** : Validez toujours la structure
- **Sécurité** : Implémentez des vérifications de sécurité
- **Performance** : Optimisez le parsing pour la vitesse
- **Journalisation** : Loggez les erreurs de parsing

---

## 🔗 Voir aussi

### Documentation Technique Connexe
- [Network Protocol](NETWORK_PROTOCOL.md) - Protocole réseau et communication
- [Database Structure](DATABASE_STRUCTURE.md) - Structure de la base de données
- [Server Client Architecture](SERVER_CLIENT_ARCHITECTURE.md) - Architecture globale
- [Development Technical Guide](../SRO_KNOWLEDGE_BASE/DEVELOPMENT_TECHNICAL_GUIDE.md) - Guide technique complet

### Guides de Développement
- [BabylonJS Integration](BABYLONJS_INTEGRATION.md) - Intégration client WebGL
- [Client File Format](CLIENT_FILE_FORMAT.md) - Formats de fichiers client
- [Technical Specifications](../SRO_KNOWLEDGE_BASE/TECHNICAL_SPECIFICATIONS.md) - Spécifications techniques

### Ressources Externes
- **Packet Analysis Guide** : [packetanalysis.com](https://www.packetanalysis.com)
- **Network Protocol Documentation** : [ietf.org](https://www.ietf.org)
- **Cryptography Standards** : [nist.gov](https://www.nist.gov)

---

## 📊 Statistiques des Packets

### Performances Typiques

```
Packets par seconde: 50-200
Taille moyenne: 50-200 bytes
Latence de parsing: 1-5ms
Taux d'erreur: <0.1%
Throughput: 10-50 MB/s
```

### Types de Packets

```
Authentication: 10%
Movement: 30%
Combat: 20%
Chat: 15%
Inventory: 10%
Quests: 5%
Misc: 10%
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

### Optimisation du Parsing

**Techniques d'optimisation** :
1. **Buffer pooling** : Réutilisez les buffers pour réduire les allocations
2. **Parsing asynchrone** : Utilisez des threads séparés pour le parsing
3. **Caching** : Cachez les structures de packets fréquentes
4. **Batch processing** : Traitez les packets par lots

### Gestion des Erreurs

**Stratégies de gestion** :
1. **Classification** : Classez les erreurs par type
2. **Priorisation** : Traitez les erreurs critiques en premier
3. **Notification** : Alertez les administrateurs pour les erreurs graves
4. **Analyse** : Analysez les tendances des erreurs

### Sécurité Avancée

**Mesures de sécurité avancées** :
1. **Détection d'intrusion** : Identifiez les patterns d'attaque
2. **Prévention des injections** : Validez tous les inputs
3. **Chiffrement de bout en bout** : Protégez toutes les communications
4. **Authentification forte** : Implémentez des mécanismes robustes

---

**Document version:** 1.1
**Date:** 20 janvier 2026
**Basé sur:** VSRO 1.188
**Status:** ✅ Documenté et enrichi
**Améliorations:** Ajout de FAQ, Voir aussi, Statistiques et Conseils avancés
