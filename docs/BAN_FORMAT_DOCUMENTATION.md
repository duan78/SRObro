# 📖 Format BAN - Documentation Technique

**Date :** 21 janvier 2026
**Format :** Animation Silkroad Online (BAN/BAF)

---

## 🎯 Vue d'Ensemble

Le format BAN (Binary Animation) stocke les animations squelettiques pour Silkroad Online. Il contient les keyframes de transformation pour chaque os d'un squelette.

---

## 📋 Structure du Fichier

### Header Fixe (32+ bytes)

```
Offset   Taille   Type        Description
0x00     8 bytes  String      Signature "JMXVBAN "
0x08     1 byte   UInt8       Version (01, 02, etc.)
0x09     3 bytes  Padding      Zéros (réservé)
0x0C     4 bytes  UInt32      Flags
0x10     4 bytes  UInt32      Frame Count
0x14     4 bytes  UInt32      Bone Count
0x18     10+     String      Animation Name (null-terminated)
```

**Exemple :**
```
00000000: 4a4d 5856 4241 4e20 3031 3032   JMXVBAN 0102
00000010: 0000 0000 0f00 0000               Frame Count = 15
00000018: 666c 616d 655f 6c72 6f6f 6d       Nom = "flame_lroom"
00000027: 5f 6d69 64775 24 00 1e 00 ...        Continuation
```

---

## 🔍 Table des Offsets

**Position :** 0x28 (juste après le header)

**Structure :**
```
Offset   Taille   Description
0x28     2 bytes  UInt16      Offset 1 (vers données os 1)
0x2A     2 bytes  UInt16      Offset 2 (vers données os 2)
...
0xXX     2 bytes  UInt16      0x0000 (fin de la table)
```

**Exemple :**
```
0x0028: 0x0024  → Offset vers données os #1
0x002A: 0x1E00  → Offset vers données os #2
```

---

## 🦴 Données d'Os par Os

Chaque section d'os a la structure suivante :

### Structure d'un Os

```
Offset   Taille     Type
0x00     Variable  String      Bone Name (null-terminated)
+X       4 bytes  UInt32      Keyframe Count
+X+4     32*N   Keyframes   Tableau de keyframes
```

**Exemple concret (Bone10_LRoom) :**
```
0x5F:    "Bone10_LRoom\0"           (nom)
0x6D:    0x0134 (308 keyframes)     (count)
0x71:    [Données keyframe 1]       (32 bytes)
0x91:    [Données keyframe 2]       (32 bytes)
...
```

---

## 🎬 Structure d'une Keyframe

**Taille fixe :** 32 bytes

```
Offset   Taille   Type          Description
0x00     4 bytes  UInt32        Frame Index
0x04     4 bytes  Float         Position X
0x08     4 bytes  Float         Position Y
0x0C     4 bytes  Float         Position Z
0x10     4 bytes  Float         Quaternion X
0x14     4 bytes  Float         Quaternion Y
0x18     4 bytes  Float         Quaternion Z
0x1C     4 bytes  Float         Quaternion W
0x20     4 bytes  Float         Scale X (optionnel)
0x24     4 bytes  Float         Scale Y (optionnel)
0x28     4 bytes  Float         Scale Z (optionnel)
```

**Note :** Les quaternions doivent avoir une magnitude ≈ 1.0

**Exemple :**
```
Position: (0.00, -0.00, -1.98)
Rotation: (-0.000, 0.000, 0.000, 1.000)
Scale:    (1.00, 1.00, 1.00)
```

---

## 📊 Conventions de Nommage d'Os

### Préfixes Communs

- **BoneXX_** : Os de structure de l'objet
- **Bip01_** : Os de base du squelette Biped
- **oneXX_** : Os nommés numériquement
- **cloakXX_** : Os de cape/vêtement

### Noms Typiques

```
Personnages :
  - Bip01_Pelvis
  - Bip01_Spine
  - Bip01_Head
  - Bip01_L_UpperArm
  - etc.

Objets :
  - Bone01, Bone02, etc.
  - cloak01, cloak02, etc.
```

---

## 🔬 Points d'Entrée

### Bonnes Pratiques pour le Parsing

1. **Vérifier la signature** avant tout traitement
2. **Lire les strings** jusqu'à null terminator
3. **Valider les quaternions** (magnitude ≈ 1.0)
4. **Gérer les types non-signés** (little-endian)
5. **Sauter les octets de padding** si nécessaire

### Points d'Attention

- **Frame Count** peut être 0 dans certains fichiers
- **Les offsets** peuvent pointer vers des données non contiguës
- **Le nombre d'os** peut varier énormément (2 à 100+)
- **Keyframe Count** peut inclure des données invalides

---

## 💻 Implémentation Suggérée

### Parseur TypeScript Pseudo-code

```typescript
class BANReader {
    parse(buffer: Buffer): BANAnimation {
        // 1. Lire le header
        const signature = buffer.slice(0, 8).toString('ascii');
        const frameCount = buffer.readUInt32LE(0x10);
        const boneCount = buffer.readUInt32(0x14);

        // 2. Lire la table des offsets
        const offsets = this.readOffsetTable(buffer, 0x28);

        // 3. Pour chaque os
        const bones = [];
        for (let i = 0; i < boneCount; i++) {
            const bone = this.readBone(buffer, offsets[i]);
            bones.push(bone);
        }

        return { bones, frameCount };
    }

    readBone(buffer: Buffer, offset: number): Bone {
        // Lire le nom
        const name = this.readString(buffer, offset);

        // Lire le nombre de keyframes
        const count = buffer.readUInt32LE(offset + name.length + 1);

        // Lire les keyframes
        const keyframes = [];
        let kfOffset = offset + name.length + 5;

        for (let k = 0; k < count; k++) {
            const keyframe = this.readKeyframe(buffer, kfOffset);
            keyframes.push(keyframe);
            kfOffset += 32;
        }

        return { name, keyframes };
    }

    readKeyframe(buffer: Buffer, offset: number): Keyframe {
        return {
            frame: buffer.readUInt32LE(offset),
            position: {
                x: buffer.readFloatLE(offset + 4),
                y: buffer.readFloatLE(offset + 8),
                z: buffer.readFloatLE(offset + 12)
            },
            rotation: {
                x: buffer.readFloatLE(offset + 16),
                y: buffer.readFloatLE(offset + 20),
                z: buffer.readFloatLE(offset + 24),
                w: buffer.readFloatLE(offset + 28)
            }
        };
    }
}
```

---

## 🎯 Prochaines Étapes

### 1. Convertisseur BAN → Babylon.js

Créer un convertisseur qui :
- Lit les fichiers BAN
- Extrait les keyframes par os
- Crée des animations Babylon.js
- Applique aux squelettes GLB

### 2. Support BAF

Le format BAF (Binary Animation Format) est similaire mais peut contenir :
- Plusieurs animations dans un seul fichier
- Metadata supplémentaires
- Compression des données

### 3. Intégration Client

```typescript
// Exemple d'utilisation future
const banLoader = await loadBANAnimation('flame_lroom_mid.ban');
skeleton.animations = banLoader.toBabylonAnimations();
scene.beginAnimation(skeleton, 0, 60, true);
```

---

## 📈 Exemples de Fichiers

### Fichiers Analysés

1. **flame_lroom_mid.ban**
   - Taille : 10,216 bytes
   - Os : 5 (Bone10_*)
   - Keyframes par os : ~300
   - Usage : Animation de flamme

2. **ruin_takla_edimmu1.ban**
   - Taille : 36,348 bytes
   - Os : 2 (Bone07, Bone08)
   - Keyframes par os : ~1,100
   - Usage : Animation d'objet

---

## 🔗 Ressources Connexes

- **BMS Files** : Modèles 3D (mesh + squelette)
- **BSK Files** : Squelettes séparés
- **BAN Files** : Animations keyframes
- **BAF Files** : Animations multiples (à explorer)

---

**Documentation créée le 21 janvier 2026**
**Basé sur l'analyse réelle de fichiers BAN Silkroad Online**
