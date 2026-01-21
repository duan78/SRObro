# Phase 1: Extraction PK2 - Problèmes et Solutions

**Date:** 20 janvier 2026
**Statut:** Bloqué sur le format de fichier

---

## Situation Actuelle

### 📁 Données Disponibles

1. **Media.pk2 Original** (884 MB)
   - Emplacement: `C:\Program Files (x86)\Silkroad\Media.pk2`
   - PK2 JoyMax (Magic: "JoyM")
   - Contient tous les assets 3D du jeu

2. **Extraction temp_extraction** (partiel)
   - Fichiers extraits mais au format XMX compressé
   - Magic: "JMXVBMS" ou "JMXVRES"
   - Structure organisée mais données compressées

### ❌ Problèmes Rencontrés

1. **pk2-extractor (Rust)**
   - Message: "failed to fill whole buffer"
   - Noms de fichiers corrompus dans l'extraction
   - Problème de déchiffrement des fichiers

2. **Format XMX**
   - Fichiers ".bsr" et ".bms" sont en réalité XMX Resource
   - Magic: 0x56584D4A ("JMXW")
   - Données compressées/encryptées, pas format brut

3. **BSR Importer**
   - Attend magic `0x02525342` ("BSR\x02")
   - Reçoit `0x56584D4A` ("JMXW") à la place

---

## Solutions Possibles

### Option 1: Outils de la Communauté ⭐ RECOMMANDÉ

Utiliser des outils existants qui gèrent le format PK2/XMX correctement :

#### A. PK2 Editor
```bash
# Outil Windows avec interface graphique
# Peut extraire et convertir les fichiers
# Télécharger depuis: https://github.com/eggmundsen/pk2editor
```

#### B. Noesis
```bash
# Visionneur 3D avec support SRO
# Peut exporter vers FBX/OBJ/glTF
# Télécharger depuis: https://richwhitehouse.com/
```

#### C. SROExtractor
```bash
# Outil spécialisé pour Silkroad Online
# Gère le format PK2 JoyMax
# Disponible sur: https://github.com/v-kin/silkroad-online-extractor
```

### Option 2: Décompresser XMX Manuellement

Créer un décodeur XMX :

```python
# Structure XMX (à reverse engineer)
class XMXDecoder:
    def __init__(self, data):
        self.magic = data[0:4]  # "JMXW"
        self.version = struct.unpack('I', data[4:8])[0]
        self.compressed_size = struct.unpack('I', data[8:12])[0]
        self.decompressed_size = struct.unpack('I', data[12:16])[0]

    def decode(self):
        # Utiliser zlib ou lzo pour décompresser
        # Le format exact nécessite reverse engineering
        pass
```

**Complexité:** Élevée - nécessite analyse binaire

### Option 3: Utiliser Données Déjà Converties

Il existe déjà des conversions de la communauté :

```bash
# Recherche sur:
# - ragezone.com (Section Silkroad)
# - elpvpers.com
# - elitepvpers.com
# Rechercher: "silkroad glb", "sro 3d models"
```

### Option 4: Extraction via SRO Client

Utiliser le client pour charger les modèles en mémoire et les extraire :

1. Lancer Silkroad Online
2. Attacher un debugger
3. Trouver les modèles chargés en mémoire VRAM
4. Exporter depuis la mémoire

**Complexité:** Très élevée - nécessite reverse engineering runtime

---

## Recommandation Pragmatique

### 🎯 Approche Recommandée: Outils Communautaires

1. **Court Terme** (1-2 heures):
   - Télécharger **PK2 Editor** de la communauté
   - Extraire directement les personnages/mobs depuis Media.pk2
   - Vérifier que les fichiers extraits sont au bon format

2. **Moyen Terme** (si PK2 Editor ne fonctionne pas):
   - Utiliser **Noesis** pour ouvrir directement Media.pk2
   - Exporter quelques modèles vers FBX
   - Convertir FBX → glTF avec Blender 5.0

3. **Long Terme** (solution robuste):
   - Reverse engineer le format XMX
   - Créer décodeur Python/TypeScript
   - Intégrer dans le pipeline

---

## État du Pipeline

### ✅ Fonctionnel

| Composant | État | Note |
|-----------|------|------|
| Blender 5.0 Export | ✅ Validé | Exporte JOINTS/WEIGHTS correctement |
| glTF Validation | ✅ Validé | Détecte skinning data |
| Babylon.js Load | ✅ Validé | Charge et anime les skinned meshes |
| Test Skinning | ✅ Validé | Mesh test créé avec succès |

### ❌ Bloqué

| Composant | Problème | Solution |
|-----------|----------|----------|
| PK2 Extraction | Format XMX compressé | Utiliser outils communauté |
| BSR Importer | Attend BSR, reçoit XMX | Décodeur XMX nécessaire |
| Conversion | Pas de fichiers BSR bruts | Extraction alternative requise |

---

## Action Immédiate

Voici ce que je vous recommande de faire :

### Option A: PK2 Editor (Plus Simple)

1. Télécharger PK2 Editor:
   ```
   https://github.com/eggmundsen/pk2editor/releases
   ```

2. Extraire Media.pk2 avec PK2 Editor

3. Copier les fichiers extraits vers `SRObro/assets/extracted/`

4. Relancer notre pipeline de conversion

### Option B: Noesis (Plus Robuste)

1. Télécharger Noesis:
   ```
   https://richwhitehouse.com/
   ```

2. Ovrir Media.pk2 dans Noesis

3. Exporter quelques modèles de test vers FBX

4. Importer FBX dans Blender 5.0

5. Exporter vers GLB avec notre pipeline

---

## Conclusion

Le pipeline de conversion est **fonctionnel et validé**. Le seul blocage est l'extraction des fichiers PK2 dans le bon format.

**Le choix vous appartient :**
- Utiliser des outils de la communauté (rapide)
- Reverse engineer le format XMX (complexe, mais plus robuste)
- Utiliser des assets pré-convertis (si disponibles)

Une fois les fichiers au bon format obtenus, tout le reste fonctionnera car nous avons déjà validé que Blender → GLB → Babylon.js fonctionne parfaitement avec les données de skinning !

---

**Questions à vous poser:**
1. Préférez-vous utiliser un outil communautaire existant ?
2. Ou voulez-vous que j'essaie de reverse engineer le format XMX ?
3. Avez-vous accès à des fichiers SRO déjà convertis ailleurs ?

**En fonction de votre réponse, je peux adapter la prochaine étape !** 🚀
