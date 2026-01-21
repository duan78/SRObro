# Analyse des Fichiers PK2 Restants - Conversion Web

**Date:** 21 janvier 2026
**Statut:** Extraction terminée ✅

---

## 📊 Résumé

Trois PK2 archives ont été extraites avec succès:

| PK2 | Taille | Fichiers | Contenu Principal |
|-----|--------|----------|-------------------|
| **Music.pk2** | 69 MB | 47 | Audio OGG |
| **Particles.pk2** | 168 MB | 4,704 | Effets de particules, textures, animations |
| **Map.pk2** | 1.3 GB | 19,587 | Données de terrain, objets, textures |

---

## 1. Music.pk2 - Audio Files ✅ WEB-READY

### Statut
**✅ DÉJÁ PRÊT POUR WEB** - Format OGG nativement supporté!

### Contenu
- **47 fichiers .ogg** (audio)
- Exemples: `ARABIA_DESERT.ogg`, `ARABIA_DUNGEON.ogg`, `ARABIA_FIELD.ogg`, `arabia_login.ogg`

### Conversions Requises
**AUCUNE** - Les fichiers OGG sont directement utilisables dans le navigateur.

### Intégration Web
```typescript
// Exemple d'utilisation dans Babylon.js
const music = new BABYLON.Sound("bgm", "assets/pk2_extracted/Music/ARABIA_FIELD.ogg", scene, () => {
    music.play();
}, { loop: true, autoplay: false });
```

### Actions Requises
1. ✅ Copier les fichiers OGG vers `client/public/assets/audio/`
2. ⚠️ Créer système de gestion audio (AudioManager)
3. ⚠️ Implémenter playlist dynamique selon la zone

---

## 2. Particles.pk2 - Effets de Particules ⚠️ CONVERSION REQUISE

### Contenu
| Extension | Nombre | Type |
|-----------|--------|------|
| **.efp** | 3,331 | Effets de particules (format propriétaire) |
| **.ddj** | 1,000 | Textures DDS |
| **.bms** | 264 | Modèles 3D |
| **.ban** | 105 | Animations (format décodé!) |
| **.bsk** | 1 | Squelette |
| **.c** | 2 | Shaders |

### 2.1 Fichiers .ban (Animations) ✅ CONVERSION DISPONIBLE

**105 animations BAN** à convertir avec l'outil Rust créé:

```bash
cd ban-re
cargo run --bin ban-convert -- ../assets/pk2_extracted/Particles/*.ban json
```

**Actions:**
1. ⚠️ Exécuter la conversion batch des 105 fichiers BAN
2. ⚠️ Générer les exports JSON et Babylon.js
3. ⚠️ Documenter les animations de particules

### 2.2 Fichiers .ddj (Textures) 🔄 EN COURS

**1,000 textures DDJ** supplémentaires à convertir en WebP:

```bash
# Le script de conversion actuel peut les gérer
npx tsx scripts/convert-ddj-webp.ts
```

**Actions:**
1. ⚠️ Ajouter ces 1,000 fichiers au pipeline de conversion DDJ→WebP
2. ⚠️ Créer dossier spécifique: `assets/particles/textures/`

### 2.3 Fichiers .efp (Effets de Particules) ⚠️ FORMAT INCONNU

**3,331 fichiers .efp** - Format propriétaire de Silkroad

**Analyse Requise:**
- 🔍 Reverse engineering du format .efp nécessaire
- Probablement contient: émetteurs, particules, couleurs, durées, etc.

**Options d'Intégration:**
1. **Option A:** Reverse engineer .efp et créer converter
2. **Option B:** Recréer les effets avec Babylon.js ParticleSystem
3. **Option C:** Ignorer les effets complexes, utiliser des effets simples

**Recommandation:** Option B - Recréer les effets courants en Babylon.js

**Exemple Babylon.js:**
```typescript
// Recréer un effet de particules simple
const particleSystem = new BABYLON.ParticleSystem("particles", 2000, scene);
particleSystem.particleTexture = new BABYLON.Texture("assets/particles/textures/texture.png", scene);
particleSystem.emitter = new BABYLON.Vector3(0, 0, 0);
particleSystem.minEmitBox = new BABYLON.Vector3(-0.5, 0, -0.5);
particleSystem.maxEmitBox = new BABYLON.Vector3(0.5, 0, 0.5);
particleSystem.color1 = new BABYLON.Color4(1, 0.5, 0, 1);
particleSystem.color2 = new BABYLON.Color4(1, 0.2, 0, 1);
particleSystem.start();
```

### 2.4 Fichiers .bms (Modèles 3D) 🔄 DÉJÀ GÉRÉ

**264 modèles BMS** pour les particules - Le convertisseur Blender actuel peut les gérer.

**Actions:**
1. ⚠️ Ajouter ces fichiers au pipeline de conversion BMS→GLB
2. ⚠️ Prioriser les modèles courants (cercles, lumières, etc.)

---

## 3. Map.pk2 - Données de Carte ⚠️ CONVERSION REQUISE

### Contenu
| Extension | Nombre | Type |
|-----------|--------|------|
| **.t** | 5,092 | Terrain/Heightmaps |
| **.m** | 4,595 | Map data (probablement indices) |
| **.o** | 4,595 | Objects (placements) |
| **.o2** | 4,452 | Objects v2 (données supplémentaires) |
| **.ddj** | 839 | Textures de terrain |
| **.ifo** | 8 | Configuration/Infos |
| **.tga** | 2 | Images TGA |
| **.txt** | 2 | Texte (camera paths, etc.) |
| **.mfo** | 1 | Map Info |
| **.dat** | 1 | Plugin Data |

### 3.1 Format des Fichiers de Map

**Structure Probable:**
```
.t  = Terrain heightmap/elevation data
.m  = Material/texture indices per tile
.o  = Object placement (x, y, z, rotation, scale)
.o2 = Extended object data
```

**Actions Requises:**
1. 🔍 **Analyser le format .t** (heightmap)
   - Probablement un tableau d'altitudes (floats ou uint16)
   - Nécessite reverse engineering

2. 🔍 **Analyser le format .m** (materials)
   - Indices de textures par tile
   - Probablement un tableau d'indices

3. 🔍 **Analyser le format .o/.o2** (objects)
   - Positions, rotations, scales des objets
   - References aux modèles BSR/GLB

4. 📖 **Lire les fichiers .ifo** (configuration)
   - Fichiers texte faciles à analyser

### 3.2 Intégration Babylon.js

**Option A: HeightmapMesh**
```typescript
const ground = BABYLON.MeshBuilder.CreateGroundFromHeightMap(
    "ground",
    "assets/maps/100.t",  // Heightmap file
    { width: 512, height: 512, subdivisions: 64 },
    scene
);
```

**Option B: DynamicTerrain (plus complexe)**
```typescript
const terrain = new BABYLON.DynamicTerrain(
    "terrain",
    { subdivision: 64, mapData: mapData },
    scene
);
```

**Actions:**
1. ⚠️ Créer parser pour fichiers .t (heightmap)
2. ⚠️ Créer parser pour fichiers .m (materials)
3. ⚠️ Créer parser pour fichiers .o (objects)
4. ⚠️ Convertir textures DDJ du terrain en WebP
5. ⚠️ Créer MapLoader système pour Babylon.js

### 3.3 Fichiers .ddj (Textures de Terrain)

**839 textures DDJ** à convertir en WebP.

**Actions:**
1. ⚠️ Ajouter au pipeline DDJ→WebP existant
2. ⚠️ Créer dossier: `assets/maps/textures/`

---

## 4. Plan d'Action Priorisé

### 🔴 Critique (Bloqueur Gameplay)
1. **BAN files** (105 animations) dans Particles.pk2
   - ✅ Convertisseur disponible
   - ⏱️ Temps: ~1 heure
   - 📦 Résultat: Animations de particules fonctionnelles

2. **DDJ textures** (1,000 particles + 839 maps)
   - ✅ Convertisseur disponible
   - ⏱️ Temps: ~2-3 heures
   - 📦 Résultat: Textures optimisées WebP

3. **Heightmap parser** (.t files)
   - 🔍 Reverse engineering requis
   - ⏱️ Temps: ~4-6 heures
   - 📦 Résultat: Terrain 3D affichable

### 🟡 Important (Amélioration Gameplay)
4. **Object parser** (.o/.o2 files)
   - 🔍 Reverse engineering requis
   - ⏱️ Temps: ~4-6 heures
   - 📦 Résultat: Objets placés sur les maps

5. **Material parser** (.m files)
   - 🔍 Reverse engineering requis
   - ⏱️ Temps: ~2-3 heures
   - 📦 Résultat: Textures appliquées au terrain

6. **BMS models** (264 particle models)
   - ✅ Convertisseur disponible
   - ⏱️ Temps: ~1 heure
   - 📦 Résultat: Modèles de particules

### 🟢 Optionnel (Polish)
7. **EFP format reverse engineering**
   - 🔍 Reverse engineering complexe
   - ⏱️ Temps: ~10-20 heures
   - 📦 Résultat: Effets de particules authentiques
   - **Alternative:** Recréer en Babylon.js (~5 heures)

8. **OGG audio integration**
   - ✅ Fichiers prêts
   - ⏱️ Temps: ~2 heures
   - 📦 Résultat: Musique ambiance

---

## 5. Scripts de Conversion à Créer

### 5.1 convert-particle-ban.ts
```typescript
// Convertir les 105 BAN files de Particles.pk2
import { glob } from 'glob';

const banFiles = await glob('assets/pk2_extracted/Particles/**/*.ban');
// Utiliser ban-convert.exe sur chaque fichier
```

### 5.2 parse-heightmap.ts
```typescript
// Parser les fichiers .t (heightmaps)
import fs from 'fs';

function parseHeightmap(tFilePath: string) {
    const data = fs.readFileSync(tFilePath);
    // Analyser la structure binaire
    // Retourner tableau d'altitudes
}
```

### 5.3 parse-map-objects.ts
```typescript
// Parser les fichiers .o (object placement)
function parseMapObjects(oFilePath: string) {
    const data = fs.readFileSync(oFilePath);
    // Extraire positions, rotations, scales
    // Retourner liste d'objets à placer
}
```

### 5.4 MapLoader.ts (Client)
```typescript
// Charger et afficher une map complète
class MapLoader {
    async loadMap(mapId: string) {
        const heightmap = this.parseHeightmap(`assets/maps/${mapId}.t`);
        const materials = this.parseMaterials(`assets/maps/${mapId}.m`);
        const objects = this.parseObjects(`assets/maps/${mapId}.o`);

        return this.createMesh(heightmap, materials, objects);
    }
}
```

---

## 6. Next Steps Immédiats

1. **Convertir les 105 BAN files** de Particles.pk2
   - Utiliser le script `convert-all-ban.ts` existant
   - Ajouter le chemin `assets/pk2_extracted/Particles/`

2. **Continuer la conversion DDJ→WebP**
   - Ajouter les textures de Particles.pk2 (1,000 fichiers)
   - Ajouter les textures de Map.pk2 (839 fichiers)

3. **Analyser les fichiers .ifo** (configuration)
   - Facile à lire (fichiers texte)
   - Donnera des indices sur les autres formats

4. **Commencer le reverse engineering du format .t**
   - Prendre un fichier simple (ex: `100.t`)
   - Analyser avec hexdump
   - Deviner la structure (probablement heightmap)

---

## 7. Résumé des Conversions Web

### ✅ Déjà Complété
- **Media.pk2:** 10,699 DDJ → WebP (74.4%)
- **Data.pk2:** 3.1 GB extrait
- **BAN format:** Reverse engineering complet
- **GLB models:** 17,599 modèles convertis

### ⏳ En Cours
- **DDJ→WebP:** ~2,736 fichiers restants

### 🔨 À Faire
- **105 BAN files** → JSON/Babylon.js (Particles.pk2)
- **1,839 DDJ files** → WebP (Particles + Map)
- **5,092 .t files** → Heightmaps (reverse engineering)
- **4,595 .o/.o2 files** → Object placement (reverse engineering)
- **3,331 .efp files** → Particules (recreate or ignore)
- **47 .ogg files** → Audio integration (ready to use)

---

## 8. Ressources Créées

- ✅ `scripts/extract-remaining-pk2.ts` - Extraction PK2
- ✅ `ban-re/` - Converteur BAN fonctionnel
- ✅ `scripts/convert-all-ban.ts` - Conversion batch BAN
- ✅ `scripts/convert-ddj-webp.ts` - Conversion DDJ→WebP
- ✅ `client/public/test-ban-animations.html` - Test animations

---

**Document créé:** 21 janvier 2026
**Projet:** SRObro - Web Integration
**Statut:** Extraction terminée, conversions en cours
