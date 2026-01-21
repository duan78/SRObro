# ASSET SYSTEM DOCUMENTATION

**Last Updated:** 2026-01-20

## Overview

SRObro uses a custom asset pipeline to convert Silkroad Online's proprietary formats (`.bms`, `.bsk`, `.bsr`, `.ban`, `.ddj`, `.efp`) into web-standard formats (`.glb`, `.json`, `.webp`).

The client loads these assets via the `AssetLoader` class, which acts as a bridge between the generated `manifest.json` and the Babylon.js scene.

## File Structure

- **Tools (`tools/model-converter/`)**: Python scripts that perform the binary extraction and conversion.
- **Client Assets (`client/assets/`)**: The output directory served to the browser.
    - `manifest.json`: The master index of all available assets.
    - `characters/`, `monsters/`, `weapons/`: Contains `.glb` mesh files.
    - `skeletons/`: Contains `.json` files defining bone hierarchy and bind poses.
    - `animations/`: Contains `.json` keyframe data.
    - `resources/`: Contains `.json` files derived from `.bsr`, linking meshes to skeletons and materials.
    - `textures/`: Contains `.webp` textures.

## The Asset Loader (`AssetLoader.ts`)

Located in `client/src/core/AssetLoader.ts`.

### Key Features

1.  **Manifest Loading**: Fetches the huge `manifest.json` on initialization.
2.  **Resource ID Resolution**: The game uses logical names (e.g., "mangnyang") to refer to entities. The loader uses the `resources` section of the manifest to find which Mesh and Skeleton to load for a given ID.
3.  **Skeleton Reconstruction**: Rebuilds `BABYLON.Skeleton` objects from our custom JSON format, calculating the correct bind pose matrices.
4.  **Path Normalization**: Handles the conversion between Windows backslash paths (from the original game files) and Web forward slash paths.

### Usage Example

```typescript
// In your Game or Scene class
const loader = new AssetLoader(scene);
await loader.initialize(); // Loads manifest

// Load an entity (Mesh + Skeleton)
const entity = await loader.loadGameObject('mangnyang');

if (entity) {
    const rootMesh = entity.root; // The main AbstractMesh
    const skeleton = entity.skeleton; // The Babylon Skeleton (if exists)
    
    rootMesh.position.set(0, 0, 0);
}
```

## Adding New Assets

1.  Place extracted PK2 files in `temp_extraction`.
2.  Run the conversion pipeline:
    ```bash
    python tools/model-converter/convert_assets.py --source "temp_extraction" --output "client/assets"
    ```
    *Use flags like `--no-models` to skip specific steps if re-running.*
3.  The `manifest.json` is automatically updated.
4.  The new assets are immediately available via `AssetLoader`.

## Technical Details

### Skeleton Format (JSON)
The `.bsk` files are converted to JSON with the following structure:
```json
{
  "bones": [
    {
      "name": "Bip01",
      "parent_index": -1,
      "position": [x, y, z],
      "rotation": [x, y, z, w],
      "scale": [x, y, z]
    },
    ...
  ]
}
```
The loader converts these PRS (Position, Rotation, Scale) values into a Babylon `Matrix` for the bone's bind pose.

### Resource Linking
A `.bsr` file (now JSON) tells the loader:
*   "I am object X"
*   "I use Mesh Y"
*   "I use Material Z"

The loader reads this, looks up Mesh Y in the `manifest.monsters` (or characters/weapons), and loads that GLB.
