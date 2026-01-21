# 🚀 Guide d'Utilisation - Assets Blender SRObro

**Dernière mise à jour :** 21 janvier 2026

---

## ⚡ Démarrage Rapide

### 1. Lancer le Serveur de Développement

```bash
cd client
npm run dev
```

Le serveur démarre sur `http://localhost:3000`

### 2. Tester les Assets Blender

**Option A - Page de test interactive :**
```
http://localhost:3000/test_blender_integration.html
```

**Option B - Test automatique dans la console :**
```javascript
// F12 → Console
await fetch('./assets/glb_blender/prim/avatar_m_nasrun.glb')
// Devrait retourner 200 OK avec le fichier GLB
```

---

## 💻 Intégration dans le Code

### Exemple 1 : Charger un Personnage

```typescript
import { AssetLoader } from '@srobro/client/core/AssetLoader';
import { initializeBlenderAssets } from '@srobro/client/config/BlenderAssetInit';

// Initialiser
await initializeBlenderAssets();

// Créer le loader
const assetLoader = new AssetLoader(scene);
await assetLoader.initialize();

// Charger un avatar européen
const character = await assetLoader.loadCharacterModel(
    'glb_blender/prim/avatar_m_nasrun.glb'
);

// Vérifier le skinning
if (character.validation.hasSkinningData) {
    console.log('✅ Personnage animé prêt !');
}
```

### Exemple 2 : Mode Hybride

```typescript
import { AssetConfigManager } from '@srobro/client/config/AssetConfig';

// Activer mode hybride
AssetConfigManager.enableHybridMode();

// Résultat :
// - Personnages/Monsters/NPCs → Blender (avec skinning)
// - Objets/Armes → Standard (statiques)
```

### Exemple 3 : Chargement depuis Code d'Item

```typescript
// Charger par code d'item
const sword = await assetLoader.loadItemByCode('ITEM_CH_SWORD_01_A');

if (sword) {
    sword.root.position = new Vector3(0, 0, 0);
    sword.root.rotation = new Vector3(0, Math.PI, 0);
}
```

---

## 🎮 Chemins des Assets

### Structure des Fichiers GLB

```
assets/glb_blender/
├── prim/
│   ├── avatar_m_nasrun.glb           # Avatar Européen Homme
│   ├── avatar_w_nasrun.glb           # Avatar Européen Femme
│   ├── mob_tiger.glb                  # Monstre Tigre
│   ├── npc_guard.glb                  # NPC Garde
│   └── ...
├── item/
│   ├── china/
│   │   ├── weapon/
│   │   └── armor/
│   └── europe/
│       ├── weapon/
│       └── armor/
└── ...
```

### Convention de Nommage

**Personnages :**
- `avatar_m_*` - Européen homme
- `avatar_w_*` - Européen femme
- `chinaman_*` - Chinois homme
- `chinawoman_*` - Chinoise femme

**Monstres :**
- `mob_*` - Monstres communs
- `boss_*` - Boss

**Objets :**
- `w_*` - Armes (weapons)
- `shield_*` - Boucliers

---

## 🔧 Dépannage

### Problème : "Aucun squelette trouvé"

**Cause :** Mauvais chemin ou fichier sans squelette

**Solution :**
```typescript
// Vérifier le fichier
const mesh = await scene.importMeshAsync(
    null,
    './assets/glb_blender/prim/',  // Note le '/' final !
    'avatar_m_nasrun.glb'
);

// Vérifier le squelette
if (!mesh.skeletons[0]) {
    console.error('Pas de squelette - utiliser un autre fichier');
}
```

### Problème : "Mesh statique sans animation"

**Cause :** JOINTS_0 ou WEIGHTS_0 manquant

**Solution :**
```typescript
const validation = mesh.validateSkinnedMesh(mesh);

if (!validation.hasSkinningData) {
    console.error('Skinning manquant - réexporter depuis Blender');
}
```

### Problème : "Performance faible avec beaucoup de personnages"

**Cause :** Trop de squelettes chargés

**Solution :**
```typescript
// Utiliser AssetContainer pour le partage
const container = await SceneLoader.LoadAssetContainerAsync(
    './assets/glb_blender/prim/',
    'avatar_m_nasrun.glb',
    scene
);

// Instancier plusieurs fois
for (let i = 0; i < 10; i++) {
    container.instantiateModelsToScene();
}
```

---

## 📊 Gestion des Modes d'Assets

### Activer les Assets Blender

```typescript
import { AssetConfigManager } from '@srobro/client/config/AssetConfig';

// Tout utiliser depuis Blender
AssetConfigManager.enableBlenderAssets();
```

### Mode Hybride (Recommandé)

```typescript
// Blender pour animés, Standard pour statiques
AssetConfigManager.enableHybridMode();
```

### Vérifier la Configuration

```typescript
const config = AssetConfigManager.getConfig();

console.log('Source:', config.source);
console.log('Personnages:', config.useBlenderForCharacters ? 'Blender' : 'Standard');
console.log('Monstres:', config.useBlenderForMonsters ? 'Blender' : 'Standard');
```

---

## 🎨 Utilisation des Textures

### Activer le Support des Textures

Les textures DDJ sont en cours de conversion en WebP.

```typescript
// Une fois terminé, les textures se chargeront automatiquement
// Les GLB incluront les références aux textures WebP

const material = new StandardMaterial("charMat", scene);
material.diffuseTexture = new Texture(
    "./assets/textures_webp/prim/avatar_m_nasrun.webp",
    scene
);
```

### Vérifier les Textures

```javascript
// Dans la console navigateur (F12)
const meshes = scene.meshes;
meshes.forEach(mesh => {
    if (mesh.material) {
        console.log('Texture:', mesh.material.diffuseTexture?.name);
    }
});
```

---

## ⚡ Performance

### Recommandations

1. **Utiliser AssetContainer pour les instanciations multiples**
2. **Activer le mode hybride** (Blender que pour animés)
3. **Charger à la demande** (streaming)
4. **Utiliser le caching** (babylonjs cache)

### Exemple Optimisé

```typescript
class CharacterManager {
    private containerCache = new Map<string, AssetContainer>();

    async getCharacter(modelPath: string) {
        // Vérifier le cache
        if (this.containerCache.has(modelPath)) {
            return this.containerCache.get(modelPath);
        }

        // Charger et mettre en cache
        const container = await SceneLoader.LoadAssetContainerAsync(
            './assets/glb_blender/',
            modelPath,
            scene
        );

        this.containerCache.set(modelPath, container);
        return container;
    }

    instantiateCharacter(modelPath: string, position: Vector3) {
        const container = await this.getCharacter(modelPath);
        const instance = container.instantiateModelsToScene();

        instance.rootNodes[0].position = position;
        return instance;
    }
}
```

---

## 📚 Références Rapides

### Fichiers de Configuration

| Fichier | Description |
|---------|-------------|
| `AssetConfig.ts` | Configuration des sources d'assets |
| `BlenderAssetInit.ts` | Fonctions d'initialisation |
| `AssetLoader.ts` | Loader principal avec validation |

### Scripts de Conversion

| Script | Description |
|--------|-------------|
| `blender-batch-production.py` | Conversion BMS→GLB massive |
| `convert-ddj-webp.ts` | Conversion DDJ→WebP |
| `copy-blender-assets.ts` | Copie vers client |

### Documentation

| Document | Description |
|----------|-------------|
| `BLENDER_INTEGRATION_COMPLETE.md` | Documentation complète |
| `BLENDER_INSTALLATION.md` | Installation de Blender |
| `BLENDER_CONVERSION_SUCCESS.md` | Rapport de conversion |

---

## 🆘 Support

### Problèmes Courants

**Q : Les GLB ne se chargent pas**
- Vérifier que le serveur Vite est démarré
- Vérifier les chemins relatifs (`assets/glb_blender/...`)
- Vérifier la console (F12) pour les erreurs

**Q : Les personnages ne s'animent pas**
- Vérifier que `AssetConfigManager.enableBlenderAssets()` est appelé
- Vérifier la présence du squelette (`mesh.skeleton`)
- Tester sur la page `test_blender_integration.html`

**Q : Performance faible**
- Utiliser le mode hybride (`enableHybridMode()`)
- Implémenter le caching avec AssetContainer
- Limiter le nombre de personnages affichés

---

## 🎯 Prochaines Étapes

1. ✅ Assets Blender intégrés
2. 🔄 Textures DDJ → WebP (en cours)
3. ⏳ Animations BAN/BAF
4. ⏳ Gameplay complet
5. ⏳ Multijoueur

---

**Guide créé le 21 janvier 2026**
**Version :** 1.0
**Statut :** ✅ À jour
