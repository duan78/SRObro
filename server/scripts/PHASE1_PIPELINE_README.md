# Phase 1: Assets 3D Extraction and Conversion Pipeline

## Overview

This pipeline extracts and converts Silkroad Online PK2 assets to GLB format with **complete skinning weights** for proper skeletal animation in Babylon.js.

**Key Difference from Previous Pipeline:**
- **Old:** Python converter exported static meshes without JOINTS/WEIGHTS
- **New:** Blender-based pipeline extracts complete skeleton and skinning data

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│  Pipeline de Conversion Assets 3D - Phase 1                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  1. EXTRACTION PK2                                              │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Input: media.pk2 (~15GB)                                │  │
│  │ Tool: pk2-extractor (Rust)                              │  │
│  │ Output: assets/extracted/ (BSR, BMS, DDJ, etc.)        │  │
│  │ Script: server/scripts/extract-pk2.ts                  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                       │
│                          ▼                                       │
│  2. INVENTORY GENERATION                                       │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Input: assets/extracted/                                │  │
│  │ Tool: inventory-assets.ts                              │  │
│  │ Output: assets/manifest.json                           │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                       │
│                          ▼                                       │
│  3. CONVERSION BSR → GLB (CRITICAL - WITH SKINNING)           │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Input: assets/extracted/**/*.bsr                        │  │
│  │ Tool: Blender + custom importer                        │  │
│  │ Process: Import BSR → Extract weights → Export glTF    │  │
│  │ Output: GLB avec JOINTS/WEIGHTS                         │  │
│  │ Script: server/scripts/convert-blender.ts               │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                       │
│                          ▼                                       │
│  4. TEXTURES & MATERIALS                                        │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Input: DDJ (textures)                                   │  │
│  │ Tool: convert-textures.ts                              │  │
│  │ Process: DDJ → WebP/DDS optimization                    │  │
│  │ Output: Textures WebP pour web                         │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                       │
│                          ▼                                       │
│  5. VALIDATION                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Script: server/scripts/validate-assets.ts               │  │
│  │ Checks: JOINTS présents? WEIGHTS valides?               │  │
│  │ Output: Rapport de validation + Liste des problèmes    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                          │                                       │
│                          ▼                                       │
│  6. INTÉGRATION BABYLON.JS                                      │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Update: client/src/core/AssetLoader.ts                  │  │
│  │ Update: client/src/animation/AnimationManager.ts        │  │
│  │ Test: Mesh animation avec skinning fonctionnel          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Prerequisites

### Required Software

1. **Rust toolchain** (for PK2 extractor)
   ```bash
   # Windows: Download from https://rustup.rs/
   # Linux/Mac: curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

2. **Blender 3.6+** (for BSR import and GLB export)
   - Download: https://www.blender.org/download/
   - Install to default location or custom path

3. **Node.js 20+** (for scripts)
   ```bash
   node --version  # Should be v20 or higher
   ```

4. **ImageMagick or FFmpeg** (for texture conversion)
   - ImageMagick: https://imagemagick.org/script/download.php
   - FFmpeg: https://ffmpeg.org/download.html

### Optional Tools

- **sharp** (Node.js library for image processing)
  ```bash
  npm install sharp
  ```

---

## Pipeline Steps

### Step 1: Build PK2 Extractor

```bash
cd tools/pk2-extractor
cargo build --release
```

The compiled binary will be at `tools/pk2-extractor/target/release/pk2-extractor.exe`.

### Step 2: Extract PK2 Archive

```bash
# From server directory
ts-node scripts/extract-pk2.ts --archive /path/to/Media.pk2 --output assets/extracted
```

**What it does:**
- Extracts all files from Media.pk2
- Organizes by type (models, textures, animations, etc.)
- Generates inventory JSON

**Output:**
```
assets/extracted/
├── Character/
├── Item/
├── Monster/
├── NPC/
├── models/
├── textures/
├── animations/
└── inventory.json
```

### Step 3: Generate Asset Manifest

```bash
ts-node scripts/inventory-assets.ts --input assets/extracted --output assets/manifest.json
```

**What it does:**
- Scans all extracted assets
- Generates comprehensive manifest for AssetLoader
- Counts models, textures, animations, skeletons

**Output:**
```json
{
  "version": "1.0",
  "characters": { "char_name": { "model": "models/characters/char_name.glb" } },
  "monsters": { "mob_name": { "model": "models/monsters/mob_name.glb" } },
  "textures": { "texture_name": { "diffuse": "textures/texture_name.webp" } },
  ...
}
```

### Step 4: Convert BSR to GLB (CRITICAL STEP)

This is the **most important step** that enables animation.

```bash
ts-node scripts/convert-blender.ts \
  --input assets/extracted \
  --output assets/converted \
  --workers 4 \
  --blender-path "C:\Program Files\Blender Foundation\Blender 3.6\blender.exe"
```

**What it does:**
- Launches Blender in headless mode for each BSR file
- Imports BSR with our custom importer
- **Extracts skeleton and skinning weights (JOINTS/WEIGHTS)**
- Exports to GLB with complete animation data

**Key Features:**
- ✅ Reads bone hierarchy from BSR
- ✅ Extracts vertex weights (which bones influence which vertices)
- ✅ Creates proper vertex groups in Blender
- ✅ Exports with `export_skins=True` flag

**Output:**
```
assets/converted/
├── Character/
│   └── CH_W_01.glb  # Contains JOINTS_0 and WEIGHTS_0 accessors
├── Monster/
│   └── MOB_TIGER.glb
└── ...
```

### Step 5: Convert Textures to WebP

```bash
ts-node scripts/convert-textures.ts \
  --input assets/extracted \
  --output assets/converted \
  --quality 85
```

**What it does:**
- Converts DDJ (DDS) textures to WebP format
- Achieves 70-90% size reduction
- Maintains visual quality with 85% quality setting

**Output:**
```
assets/converted/
└── textures/
    └── texture_name.webp
```

### Step 6: Validate GLB Files

```bash
ts-node scripts/validate-assets.ts \
  --input assets/converted \
  --detailed \
  --export validation-report.json
```

**What it validates:**
- ✅ GLB files contain JOINTS_0 accessor
- ✅ GLB files contain WEIGHTS_0 accessor
- ✅ Skeleton definitions are present
- ✅ Bone hierarchy is valid
- ✅ Inverse bind matrices exist

**Sample Output:**
```
============================================================
Validation Summary
============================================================
Total files:           82563
Valid files:           82115 ✅
Invalid files:         448 ❌

Files with JOINTS:     82115
Files with WEIGHTS:    82115
Files with SKELETON:   82115
Total bones:           4123890
Average bones/model:   50.2
============================================================
```

---

## Integration with Babylon.js

### Loading Character Models

```typescript
import { AssetLoader } from './core/AssetLoader';

// Initialize asset loader
const assetLoader = new AssetLoader(scene);
await assetLoader.initialize();

// Load character model with validation
const { mesh, validation } = await assetLoader.loadCharacterModel('models/characters/CH_W_01.glb');

// Check validation results
if (validation.hasSkeleton && validation.isSkinnedMesh) {
  console.log(`✅ Character has ${validation.boneCount} bones and is ready for animation`);
} else {
  console.error('❌ Character cannot be animated:', validation.issues);
}
```

### Setting Up Animation Manager

```typescript
import { AnimationManager } from './animation/AnimationManager';

// Create animation manager
const animManager = new AnimationManager(scene);

// Validate mesh can be animated
const meshValidation = animManager.validateMeshForAnimation(mesh);

if (meshValidation.canAnimate) {
  // Initialize with skeleton
  await animManager.initialize(mesh.skeleton);

  // Play idle animation
  animManager.play(AnimationState.IDLE);
}
```

---

## Troubleshooting

### Issue: "Blender not found"

**Solution:**
```bash
# Specify Blender path explicitly
ts-node scripts/convert-blender.ts --blender-path "C:\Path\To\blender.exe" ...
```

### Issue: "No JOINTS/WEIGHTS in exported GLB"

**Solution:**
1. Check that Blender importer is installed correctly
2. Verify BSR file contains skinning data (not all do)
3. Check Blender console output for errors
4. Ensure `export_skins=True` flag is set

### Issue: "Mesh doesn't animate"

**Debug steps:**
```typescript
// 1. Check skeleton is present
console.log('Skeleton:', mesh.skeleton);
console.log('Bones:', mesh.skeleton?.bones.length);

// 2. Check if skinned mesh
console.log('Is skinned:', (mesh as any).isSkinnedMesh);

// 3. Check bone influencers
console.log('Bone influencers:', (mesh as any).numBoneInfluencers);

// 4. Validate with asset loader
const validation = assetLoader.validateSkinnedMesh(mesh);
console.log('Validation:', validation);
```

### Issue: "Conversion too slow"

**Solutions:**
1. Increase worker count: `--workers 8`
2. Convert only priority assets first
3. Use faster storage (SSD vs HDD)

---

## Success Criteria

✅ **Extraction:** media.pk2 completely extracted
✅ **Conversion:** GLB files contain JOINTS_0 and WEIGHTS_0 accessors
✅ **Skeletons:** Correctly imported with bone hierarchy
✅ **Vertex Groups:** Valid bone influences per vertex
✅ **Animation:** Mesh can be animated via Skeleton
✅ **Performance:** < 2s load time, 60 FPS with 50 animated characters
✅ **File Size:** < 5MB per character GLB

---

## Next Steps (Phase 2)

Once Phase 1 is complete and validated:

1. **Implement gameplay systems** with animated characters
2. **Add skill animations** from BAN files
3. **Test combat with animations**
4. **Implement character equipment** system
5. **Optimize asset streaming** for open world

---

**Date:** 20 January 2026
**Phase:** 1 - Assets 3D Extraction
**Status:** Pipeline Implemented
**Priority:** CRITIQUE (bloqueur pour toute animation)
