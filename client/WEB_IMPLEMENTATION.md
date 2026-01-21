# SRObro - Web Implementation Guide

## Overview

This guide explains the web implementation for viewing and using converted Silkroad Online assets in Babylon.js.

## Quick Start

### 1. Start the Asset Viewer Server

```bash
cd client
python start-viewer.py
```

This will:
- Start an HTTP server on `http://localhost:8080`
- Automatically open the Asset Viewer in your browser
- Serve all converted assets

### 2. Using the Asset Viewer

Once the server is running, navigate to:
```
http://localhost:8080/asset-viewer.html
```

**Features:**
- **Browse Assets**: Select from 20,859 converted 3D models
- **Search**: Filter assets by name
- **Categories**: Filter by type (Characters, Weapons, Objects, Environment)
- **Visual Controls**:
  - Mouse drag: Rotate camera
  - Scroll: Zoom in/out
  - Wireframe toggle: See mesh structure
  - Auto-rotate: Automatically spin the model
  - Random asset: Load random model

## File Structure

```
client/
├── assets/                      # All converted game assets
│   ├── models/                  # 20,859 GLB files (149.1 MB)
│   │   ├── avatar_*.glb         # Character models
│   │   ├── chair_*.glb          # Furniture
│   │   ├── rock_*.glb           # Environment objects
│   │   └── ...
│   ├── textures/                # 38,918 WebP files (474.0 MB)
│   ├── effects/                 # 3,252 JSON files (0.6 MB)
│   ├── animations/              # 4,284 JSON files (2.4 MB)
│   ├── mesh_metadata/           # 3,751 JSON files (0.7 MB)
│   ├── manifest.json            # Asset manifest
│   └── models.json              # Model listing for viewer
├── src/
│   ├── game/
│   │   └── AssetLoader.ts       # Asset loading system
│   ├── core/
│   │   ├── Engine.ts            # Babylon.js engine wrapper
│   │   └── Game.ts              # Main game class
│   └── demo/
│       ├── AssetViewer.ts       # TypeScript asset viewer
│       └── asset-viewer.js      # JavaScript viewer (standalone)
├── asset-viewer.html            # Asset viewer web page
├── start-viewer.py              # HTTP server script
└── index.html                   # Main game entry point
```

## Implementation Details

### Asset Loading System

The `AssetLoader` class (`src/game/AssetLoader.ts`) provides:

```typescript
// Initialize the loader
const assetLoader = new AssetLoader(scene, './assets');
await assetLoader.initialize();

// Load a character
const character = await assetLoader.loadCharacter('avatar_m_amalun');

// Load a weapon
const weapon = await assetLoader.loadWeapon('sword_01');

// Load a texture
const texture = await assetLoader.loadTexture('texture_name');

// Preload assets for efficiency
await assetLoader.preloadCharacters(
    ['avatar_01', 'avatar_02', 'avatar_03'],
    (loaded, total, current) => {
        console.log(`Loading ${loaded}/${total}: ${current}`);
    }
);
```

### Asset Manifest

The `manifest.json` file contains:
- Character definitions
- Weapon models
- Monster models
- Texture references
- Animation data
- Asset groups for batch loading

### Model Categories

Models are categorized by naming patterns:

| Category | Pattern | Example |
|----------|---------|---------|
| Characters | `avatar_*` | `avatar_m_amalun.glb` |
| Weapons | `sword`, `spear`, `bow` | `sword_iron01.glb` |
| Objects | `chair`, `table`, `chest` | `chair_wood01.glb` |
| Environment | `rock`, `tree`, `grass` | `rock_mt01.glb` |

## API Integration

### Loading Assets in Your Code

```typescript
import { AssetLoader } from './game/AssetLoader';

// Create asset loader
const loader = new AssetLoader(scene, './assets');
await loader.initialize();

// Load and display a character
const character = await loader.loadCharacter('avatar_m_amalun');

// Add to scene
character.mesh.position = new Vector3(0, 0, 0);
scene.addMesh(character.mesh);

// Apply animation
if (character.skeleton) {
    scene.beginAnimation(character.skeleton, 0, 100, true);
}
```

### Asset Browser Integration

The asset viewer provides a complete UI for browsing assets:

**Search:**
```javascript
// Filter by search term
filterAssets('sword', 'all');  // Show all assets containing 'sword'
```

**Category Filter:**
```javascript
// Filter by category
filterAssets('', 'weapons');  // Show all weapons
```

**Load Specific Asset:**
```javascript
// Load by filename
loadAsset('avatar_m_amalun.glb');
```

## Performance Considerations

### Asset Caching

Assets are automatically cached after first load:
```typescript
// First load: downloads and caches
const mesh1 = await loader.loadCharacter('avatar_01');

// Second load: uses cache (instant)
const mesh2 = await loader.loadCharacter('avatar_01');
```

### Preloading

Preload frequently used assets:
```typescript
await loader.loadAssetGroup('demo', (loaded, total, asset) => {
    updateProgressBar(loaded / total * 100);
});
```

### Memory Management

Clear cache when switching scenes:
```typescript
loader.clearCache();
```

## Troubleshooting

### Server Won't Start

**Problem:** Port 8080 already in use

**Solution:** Change port in `start-viewer.py`:
```python
PORT = 8081  # Use different port
```

### Assets Not Loading

**Problem:** CORS errors or 404s

**Solution:**
- Ensure you're using `http://localhost:8080` (not `file://`)
- Check browser console for errors
- Verify `assets/manifest.json` exists

### Models Not Visible

**Problem:** Model loads but doesn't appear

**Solution:**
- Check camera position
- Use "Reset Camera" button
- Verify model has meshes (check console)
- Try "Toggle Wireframe" to see mesh structure

## Next Steps

### Phase 2: Game Integration

1. **Character System**
   - Implement character controller
   - Add movement animations
   - Camera follow system

2. **World Loading**
   - Load zone/area data
   - Spawn game objects
   - Implement collision system

3. **UI System**
   - Skill bar
   - Inventory panel
   - Character stats

4. **Network Integration**
   - Connect to game server
   - Sync player positions
   - Handle game events

## Development Commands

```bash
# Start asset viewer
python start-viewer.py

# Generate manifest (after adding new assets)
python ../tools/generate_manifest.py assets --output assets/manifest.json

# Update model list
python -c "
from pathlib import Path
import json

models = [str(f.relative_to('assets/models')) for f in Path('assets/models').glob('**/*.glb')]
with open('assets/models.json', 'w') as f:
    json.dump({'count': len(models), 'files': models}, f)
"
```

## Performance Benchmarks

**Asset Loading (First Load):**
- Small model (< 100KB): ~100-200ms
- Medium model (100-500KB): ~200-500ms
- Large model (> 500KB): ~500-1000ms

**Cached Loading:**
- All models: < 10ms (instant)

**Memory Usage:**
- Scene with 10 models: ~50-100MB
- Scene with 100 models: ~200-500MB

## Browser Compatibility

Tested on:
- Chrome 120+ ✅
- Firefox 120+ ✅
- Edge 120+ ✅

Requirements:
- WebGL 2.0 support
- ES6+ JavaScript
- 2GB+ RAM recommended

## Contributing

When adding new assets:

1. Convert using the conversion tools
2. Update manifest: `python tools/generate_manifest.py assets`
3. Update model list: See "Development Commands" above
4. Test in asset viewer
5. Document new asset categories

## License

This is a Silkroad Online fan project. All assets are property of Joymax.

---

**Questions?** Check the main README or open an issue.
