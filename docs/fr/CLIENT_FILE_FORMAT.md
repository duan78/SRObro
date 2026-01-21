# Format des Fichiers Client - Silkroad Online

## Vue d'ensemble

Le client Silkroad Online utilise plusieurs formats de fichiers propriétaires pour stocker les assets du jeu. Ce document détaille ces formats et comment les utiliser.

**Version:** VSRO 1.188
**Langage:** C++ (propriétaire)
**Compression:** zlib, formats personnalisés

---

## Fichiers Principaux

```
Silkroot Online/
├── SR_Client.exe          // Exécutable principal
├── media.pk2              // Archive principale des assets
├── Data.pk2               // Données de configuration
├── div.txt                // Configuration serveur
├── locale.pk2             // Traductions
├── particle.pk2           // Effets de particules
├── sound.pk2              // Sons et musiques
└── silkroad.ico           // Icône de l'application
```

---

## 1. Format PK2

### Description

Le format **PK2** est une archive propriétaire similaire à ZIP, utilisée pour stocker tous les assets du jeu (modèles 3D, textures, sons, etc.).

**Avantages:**
- Compression efficace
- Organisation hiérarchique
- Protection des assets

**Outils:**
- PK2 Editor
- PK2 Extractor
- [Basic PK2 Tutorials](https://www.elitepvpers.com/forum/sro-guides-templates/284247-basic-pk2-tutorials-crystal.html)

---

### Structure du Fichier PK2

```
┌─────────────────────────────────────────────────────────────────┐
│  PK2 File Structure                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐                                             │
│  │ PK2 Header     │                                             │
│  ├────────────────┤                                             │
│  │ Magic: "PK2"   │  // Signature (3 bytes)                     │
│  │ Version: 1     │  // Version (1 byte)                        │
│  │ Encryption: 0  │  // Flag (1 byte)                           │
│  │ Reserved       │  // (8 bytes)                               │
│  └────────────────┘                                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ File Entry Table (FET)                                 │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │ ┌──────────────────────────────────────────────┐       │     │
│  │ │ Entry 1                                        │       │     │
│  │ ├──────────────────────────────────────────────┤       │     │
│  │ │ Name: "Character\Sword Woman\bsr file.bsr"   │       │     │
│  │ │ Offset: 0x00010000                            │       │     │
│  │ │ Size: 0x00008000 (32 KB)                     │       │     │
│  │ │ Compressed Size: 0x00002000 (8 KB)           │       │     │
│  │ │ CRC32: 0x12345678                            │       │     │
│  │ └──────────────────────────────────────────────┘       │     │
│  │ ┌──────────────────────────────────────────────┐       │     │
│  │ │ Entry 2                                        │      │     │
│  │ ├──────────────────────────────────────────────┤       │     │
│  │ │ Name: "Character\Sword Woman\xxx file.ddj"   │       │     │
│  │ │ Offset: 0x00018000                            │       │     │
│  │ │ ...                                           │       │     │
│  │ └──────────────────────────────────────────────┘       │     │
│  │ ...                                                  │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ File Data Area (Compressed)                            │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │ [Compressed Data 1] [Compressed Data 2] ...            │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Header PK2

**Taille:** 13 bytes

**Structure:**
```cpp
struct PK2Header {
    char Magic[3];      // "PK2"
    uint8_t Version;    // Toujours 1
    uint8_t Encryption; // 0 = aucune
    uint8_t Reserved[8];
};
```

**Exemple Hex:**
```
50 4B 32 01 00 00 00 00 00 00 00 00 00
│  │  │  │  └─ Reserved (8 bytes)
│  │  │  └─ Encryption: 0 (aucune)
│  │  └─ Version: 1
│  └─ Magic: "PK2"
```

---

### File Entry Table (FET)

**Description:** Table des matières du PK2

**Structure d'une entrée:**
```cpp
struct PK2Entry {
    char Name[256];      // Chemin relatif
    uint32_t Offset;     // Position dans le fichier
    uint32_t Size;       // Taille décompressée
    uint32_t CompSize;   // Taille compressée
    uint32_t CRC32;      // Checksum
    uint32_t Reserved;   // Réservé
};
```

**Taille d'une entrée:** ~272 bytes

**Format du nom:**
- Chemin relatif
- Séparateur: `\` (backslash)
- Sensible à la casse
- Max 256 caractères

**Exemples:**
```
Character\Sword Woman\bsr file.bsr
Character\Sword Woman\xxx file.ddj
Item\Weapon\Sword_CH_01.ddj
Media\sound\xxx file.mp3
```

---

### Compression

**Algorithme:** zlib (RFC 1950)

**Processus de compression:**
```
Original File (100 KB)
       ↓
   Compress (zlib, level 6)
       ↓
Compressed Data (30 KB)
       ↓
   Write to PK2 at Offset
       ↓
   Update Entry Table
```

**Processus de décompression:**
```
1. Read Entry from FET
2. Seek to Offset
3. Read CompSize bytes
4. Decompress (zlib)
5. Verify CRC32
6. Return decompressed data
```

---

### Contenu de media.pk2

**Structure interne:**
```
media.pk2
├── Character/
│   ├── Sword Man/
│   │   ├── bsr file.bsr      // Modèle 3D (squelette)
│   │   └── xxx file.ddj      // Texture
│   ├── Spear Man/
│   ├── Blade Man/
│   ├── Bow Man/
│   └── ...
├── Item/
│   ├── Weapon/
│   ├── Armor/
│   ├── Accessory/
│   └── ...
├── Mob/
│   ├── CH_Mob/
│   ├── EU_Mob/
│   └── ...
├── NPC/
│   ├── CH_NPC/
│   ├── EU_NPC/
│   └── ...
├── World/
│   ├── China/
│   │   ├── 1_1.ddj          // Heightmap
│   │   └── ...
│   └── Europe/
├── Media/
│   ├── sound/
│   └── ...
└── server_dep/
    ├── silkroad/
    │   └── server.txt       // Configuration serveur
    └── ...
```

---

### Édition de media.pk2

#### Changer l'IP du Serveur

**Méthode:**

1. **Ouvrir avec PK2 Editor**
   - Lancer `PK2_Editor.exe`
   - Ouvrir `media.pk2`

2. **Naviguer vers:**
   ```
   server_dep/silkroad/server.txt
   ```

3. **Modifier le fichier:**
   ```
   // Avant
   server_ip "192.168.1.100"
   port 15779

   // Après
   server_ip "XXX.XXX.XXX.XXX"
   port 15779
   ```

4. **Sauvegarder**
   - Le PK2 Editor compresse et met à jour automatiquement

**Note:** La modification du PK2 peut nécessiter de recalculer le CRC.

---

#### Ajouter des Fichiers

**Processus:**
1. Lancer PK2 Editor
2. Ouvrir `media.pk2`
3. Naviguer vers le dossier cible
4. Drag & Drop les fichiers
5. Sauvegarder

**Important:**
- Respecter la structure des dossiers
- Utiliser les mêmes formats de fichiers
- Ne pas dépasser 2 GB par PK2

---

## 2. Format X_TBL

### Description

Les fichiers **X_TBL** (Table) contiennent les données du jeu (items, skills, mobs, etc.). Ils sont formatés en texte avec un format spécifique.

**Localisation:** `media.pk2/server_dep/silkroad/`

**Principaux fichiers:**
- `CharacterData.txt` - Données des personnages
- `SkillData.txt` - Skills
- `ItemData.txt` - Items
- `MobData.txt` - Mobs
- `NPCData.txt` - NPCs
- `ShopData.txt` - Boutiques

---

### Structure Générale X_TBL

**Format:**
```
1    // Numéro de ligne
Group_XXX    // Groupe de données
{
    Field1    Value1
    Field2    Value2
    Field3    Value3
    ...
}
```

**Règles:**
- Une entrée par ligne numérotée
- Groupes définis par `{` et `}`
- Champs séparés par tabulations
- Commentaires avec `//`

---

### CharacterData.txt

**Description:** Données des personnages joueurs

**Exemple:**
```
1
Group_Chinese
{
    // Chinese Male
    RefObjID    1
    Country     1
    Race        1
    Class       1
    Level       1
    MaxLevel    110
    HP          200
    MP          200
    Strength    20
    Intellect   20
}

2
Group_European
{
    // European Male
    RefObjID    2
    Country     2
    Race        2
    Class       1
    Level       1
    MaxLevel    110
    HP          200
    MP          200
    Strength    20
    Intellect   20
}
```

---

### SkillData.txt

**Description:** Skills

**Exemple:**
```
1
Group_Skill
{
    SkillID     8421
    Name        "Fire Shield"
    Type        1
    Level       1
    MaxLevel    10
    MP          50
    HP          0
    Duration    60
    Cooldown    30
    Range       0
    Radius      10
}

2
Group_Skill
{
    SkillID     8422
    Name        "Fire Blast"
    Type        2
    Level       1
    MaxLevel    10
    MP          100
    HP          0
    Damage      500
    Cooldown    5
    Range       15
    Radius      0
}
```

---

### ItemData.txt

**Description:** Items

**Exemple:**
```
1
Group_Weapon_CH
{
    RefObjID    1001
    CodeName    "ITEM_CH_SWORD_01_SET_A_RARE"
    Name        "Sword China Lv1"
    Type        1
    SubType     1
    Level       1
    ReqLevel    1
    Damage      15
    AttackRate  10
    Critical    5
    Price       100
    Weight      10
}

2
Group_Armor_CH
{
    RefObjID    2001
    CodeName    "ITEM_CH_CLOTH_ARMOR_A_01"
    Name        "Cloth Armor Lv1"
    Type        2
    SubType     1
    Level       1
    ReqLevel    1
    Defense     5
    Price       200
    Weight      20
}
```

---

### MobData.txt

**Description:** Mobs (monstres)

**Exemple:**
```
1
Group_Mob_CH
{
    RefObjID    3001
    CodeName    "MOB_CH_MANGNYANG_01"
    Name        "Mangnyang"
    Level       1
    HP          50
    MP          20
    Attack      10
    Defense     5
    Exp         10
    SP          1
    Gold        5
    DamageMin   8
    DamageMax   12
    AttackRate  5
    ParryRate   5
}

2
Group_Mob_EU
{
    RefObjID    4001
    CodeName    "MOB_EU_MANGNYANG_01"
    Name        "Mangnyang (EU)"
    Level       1
    HP          50
    MP          20
    Attack      10
    Defense     5
    Exp         10
    SP          1
    Gold        5
    DamageMin   8
    DamageMax   12
}
```

---

### Parsing X_TBL

**Algorithme:**
```python
def parse_x_tbl(file_path):
    entries = []
    current_entry = None

    with open(file_path, 'r', encoding='utf-8') as f:
        for line in f:
            line = line.strip()

            # Ignorer les lignes vides
            if not line:
                continue

            # Numéro de ligne
            if line.isdigit():
                if current_entry:
                    entries.append(current_entry)
                current_entry = {'id': int(line)}

            # Début de groupe
            elif line.startswith('Group_'):
                current_entry['group'] = line

            # Fin de groupe
            elif line == '}':
                if current_entry:
                    entries.append(current_entry)
                    current_entry = None

            # Champ
            elif '\t' in line:
                parts = line.split('\t')
                if len(parts) >= 2:
                    field = parts[0].strip()
                    value = parts[1].strip()
                    if current_entry:
                        current_entry[field] = value

    return entries
```

---

## 3. Format DDJ

### Description

**DDJ** (DirectX Texture) est le format des textures dans Silkroad. Il s'agit de textures DDS (DirectDraw Surface) avec un header personnalisé.

**Extension:** `.ddj`

---

### Structure DDJ

```
┌─────────────────────────────────────────────────────────────────┐
│  DDJ File Structure                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐                                             │
│  │ DDJ Header     │                                             │
│  ├────────────────┤                                             │
│  │ Magic: "DDS"   │  // Signature (3 bytes)                     │
│  │ Version: 1     │  // Version (1 byte)                        │
│  │ Format: DXT1   │  // Compression (4 bytes)                   │
│  │ Width: 512     │  // Largeur (4 bytes)                       │
│  │ Height: 512    │  // Hauteur (4 bytes)                      │
│  │ MipMaps: 10    │  // Nombre de mipmaps (4 bytes)            │
│  └────────────────┘                                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Texture Data (DXT1/DXT5 Compressed)                    │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │ [Mipmap 0] [Mipmap 1] ... [Mipmap N]                  │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Header DDJ

```cpp
struct DDJHeader {
    char Magic[3];      // "DDS" ou "DDJ"
    uint8_t Version;    // Version
    char Format[4];     // DXT1, DXT5, ARGB, etc.
    uint32_t Width;     // Largeur
    uint32_t Height;    // Hauteur
    uint32_t MipMaps;   // Nombre de mipmaps
};
```

---

### Formats de Compression

| Format | Description | Bits/Pixel |
|--------|-------------|------------|
| DXT1 | RGB sans alpha | 4 |
| DXT5 | RGB avec alpha | 8 |
| ARGB | Non-compressé | 32 |
| RGB | Non-compressé | 24 |

---

### Conversion DDJ ↔ DDS/PNG

**Outils:**
- NVIDIA Texture Tools (DDS)
- ImageMagick (PNG)
- Noesis (Conversion)

**Commande ImageMagick:**
```bash
# DDJ → PNG
convert texture.ddj texture.png

# PNG → DDJ (conversion manuelle requise)
convert texture.png -define dds:compression=dxt5 texture.dds
# Ajouter header DDJ manuellement
```

---

## 4. Format BSR

### Description

**BSR** (Binary Skeletal Model) est le format des modèles 3D animés (personnages, mobs, etc.).

**Extension:** `.bsr`

**Contient:**
- Squelette (bones)
- Mesh (géométrie)
- Weight maps (poids des vertices par bone)
- Animations

---

### Structure BSR (Simplifiée)

```
┌─────────────────────────────────────────────────────────────────┐
│  BSR File Structure                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌────────────────┐                                             │
│  │ BSR Header     │                                             │
│  ├────────────────┤                                             │
│  │ Magic: "BSR"   │  // Signature                               │
│  │ Version: 1     │  // Version                                │
│  │ BoneCount: N   │  // Nombre d'os                           │
│  │ MeshCount: M   │  // Nombre de meshes                      │
│  │ AnimCount: A   │  // Nombre d'animations                   │
│  └────────────────┘                                             │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Skeleton Data                                          │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │ ┌──────────────────────────────────────────────┐       │     │
│  │ │ Bone 0                                         │       │     │
│  │ ├──────────────────────────────────────────────┤       │     │
│  │ │ Name: "Bip01_Pelvis"                         │       │     │
│  │ │ Parent: -1 (racine)                          │       │     │
│  │ │ Position: (0, 0, 0)                          │       │     │
│  │ │ Rotation: Quaternion                          │       │     │
│  │ └──────────────────────────────────────────────┘       │     │
│  │ ┌──────────────────────────────────────────────┐       │     │
│  │ │ Bone 1 (Bip01_Spine)                         │       │     │
│  │ │ Parent: 0 (Pelvis)                           │       │     │
│  │ │ ...                                           │       │     │
│  │ └──────────────────────────────────────────────┘       │     │
│  │ ...                                                  │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Mesh Data                                               │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │ Vertices, Faces, UVs, Normals, Weights                 │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │ Animation Data                                          │     │
│  ├────────────────────────────────────────────────────────┤     │
│  │ Keyframes, Timestamps, Bone Transforms                  │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

### Parsing BSR (Résumé)

Le format BSR est complexe et nécessite:
1. Reverse engineering du moteur de jeu
2. Compréhension des formats de meshes
3. Connaissance des systèmes d'animation

**Outils suggérés:**
- [Noesis](https://richwhitehouse.com/) - Visionneuse 3D avec plugins
- 3D Studio Max - Export/Import avec plugins
- Blender - Avec scripts Python

---

## 5. Autres Formats

### BMS (Basic Model)
- Modèles statiques (objets, décors)
- Géométrie simple
- Pas d'animation

### BMT (Basic Material)
- Matériaux (shaders, textures)
- Propriétés de rendu

### BSK (Basic Skeleton)
- Données de squelette
- Hiérarchie des os

### BAN (Basic Animation)
- Animations
- Keyframes
- Interpolation

---

## 6. Relation Hiérarchique BSR/DDJ

### Structure des Ressources 3D

Les fichiers BSR contiennent ou référencent plusieurs types de données:

```
BSR (Resource File Container)
│
├── BMS (Mesh/Geometry)
│   ├── Vertices
│   ├── Faces
│   ├── UVs
│   └── Normals
│
├── BMT (Material)
│   ├── Shader Parameters
│   └── Material Properties
│       └── DDJ (Textures/Images)
│           ├── DXT1/DXT5 Compressed
│           └── Mipmaps
│
├── BSK (Skeleton)
│   ├── Bones Hierarchy
│   ├── Bind Pose
│   └── Bone Transforms
│
└── BAN (Animations)
    ├── Keyframes
    ├── Timestamps
    └── Bone Animations
```

**Explications:**
- **BSR** est le conteneur principal qui référence les autres fichiers
- **BMS** contient la géométrie du mesh (vertices, faces)
- **BMT** définit le matériau et référencie les textures DDJ
- **DDJ** sont les fichiers de texture (compression DXT1/DXT5)
- **BSK** contient le squelette pour les animations
- **BAN** contient les données d'animation keyframe

**Exemple de hiérarchie:**
```
Character/Sword Woman/bsr file.bsr
├── Référence BMS: géométrie du personnage
├── Référence BMT: matériau du personnage
│   └── Référence DDJ: texture du personnage (xxx file.ddj)
├── Référence BSK: squelette du personnage
└── Référence BAN: animations (idle, walk, attack, etc.)
```

**Sources:**
- [BSR files and model textures - RaGEZONE](https://forum.ragezone.com/threads/bsr-files-and-model-textures.814761/)
- [Silkroad File Formats WIP](https://forum.ragezone.com/threads/wip-silkroad-file-formats-bsr-bms-bmt-bsk-ban.860286/)
- [Blender Import Plugin](https://forum.ragezone.com/threads/release-update-bms-bsk-bmt-ddj-import-blender-plugin.1250607/)

---

## 7. Configuration Files

### div.txt

**Description:** Configuration de connexion

**Exemple:**
```
// Silkroad Online Configuration
// Version 1.188

// Server Info
server_ip "192.168.1.100"
server_port 15779
patch_server "updates.silkroad.com"
patch_port 80

// Client Info
version "1.188"
locale "LOCALE"

// Options
fullscreen 0
resolution 1024 768
sound 1
music 1
```

**Champs:**
- `server_ip`: IP du Gateway
- `server_port`: Port (15779)
- `version`: Version du client
- `locale`: Langue

---

### server.txt (dans PK2)

**Description:** Configuration serveur

**Localisation:**
```
media.pk2/server_dep/silkroad/server.txt
```

**Contenu:**
```
// Server Configuration
gateway_ip "192.168.1.100"
gateway_port 15779

shards
{
    shard_1
    {
        name "Alex"
        ip "192.168.1.101"
        port 15879
        max_players 1500
    }

    shard_2
    {
        name "Babel"
        ip "192.168.1.102"
        port 15879
        max_players 1500
    }
}
```

---

## Outils de Modification

### PK2 Editor
**Fonctionnalités:**
- Ouvrir/Éditer PK2
- Extraire des fichiers
- Ajouter des fichiers
- Compression automatique

**Téléchargement:** [Elitepvpers - PK2 Editor](https://www.elitepvpers.com/forum/sro-pserver-guides-releases/4127868-share-pk2-editor-extractor-working-08-2016-a.html)

---

### X_TBL Editor
**Fonctionnalités:**
- Éditer les fichiers X_TBL
- Syntax highlighting
- Validation

---

### DDJ Converter
**Fonctionnalités:**
- DDJ → DDS
- DDJ → PNG
- PNG → DDJ

---

## Extraction d'Assets pour SRObro

### Processus pour Babylon.js

1. **Extraire les fichiers BSR**
   ```
   PK2 Editor → media.pk2 → Character/
   Exporter → bsr file.bsr
   ```

2. **Convertir BSR vers format standard**
   ```
   Noesis → Import BSR → Export FBX/OBJ
   ```

3. **Extraire les textures DDJ**
   ```
   PK2 Editor → media.pk2 → Character/
   Exporter → xxx file.ddj
   ```

4. **Convertir DDJ vers PNG/JPG**
   ```
   DDJ Converter → PNG
   ```

5. **Importer dans Babylon.js**
   ```typescript
   BABYLON.SceneLoader.ImportMesh(
       "",
       "./models/",
       "character.fbx",
       scene,
       (meshes) => {
           // meshes[0] est le personnage
       }
   );
   ```

---

## Références

- [Basic PK2 Tutorials](https://www.elitepvpers.com/forum/sro-guides-templates/284247-basic-pk2-tutorials-crystal.html)
- [Proper way to edit IP for Media.pk2](https://forum.ragezone.com/threads/proper-way-to-edit-ip-for-media-pk2.788604/)
- [Silkroad File Formats](https://forum.ragezone.com/threads/wip-silkroad-file-formats-bsr-bms-bmt-bsk-ban.860286/)
- [PK2 Tools 5-in-1 Bundle](https://www.elitepvpers.com/forum/sro-hacks-bots-cheats-exploits/690658-pk2tools-5-1-bundle.html)

---

**Document version:** 1.0
**Date:** 20 janvier 2026
**Basé sur:** VSRO 1.188
**Status:** ✅ Documenté
