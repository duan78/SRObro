#!/usr/bin/env python3
"""
Production Blender Batch Converter for SRObro
Converts BMS+BSK files to GLB with complete skinning data

Key features:
- Automatic BSK skeleton detection
- Progress tracking
- Error handling
- Validation
"""

import bpy
import os
import sys
from pathlib import Path
import json

# Configuration
BMS_DIR = Path("C:/Users/duan7/Desktop/SRObro/assets/data_extracted")
OUTPUT_DIR = Path("C:/Users/duan7/Desktop/SRObro/assets/glb_blender")
BLENDER_ADDON = Path("C:/Users/duan7/AppData/Roaming/Blender Foundation/Blender 5.0/scripts/addons/silkroad-blender-importer.py")

# Skeleton mapping: BMS patterns -> BSK files
SKELETON_MAP = {
    # European characters
    "avatar_m": "prim/skel/char/europe/europeman_skel.bsk",
    "avatar_w": "prim/skel/char/europe/europewoman_skel.bsk",
    # Chinese characters
    "chinaman": "prim/skel/char/china/chinaman_skel.bsk",
    "chinawoman": "prim/skel/char/china/chinawoman_skel.bsk",
    # Default fallback
    "default": "prim/skel/char/europe/europeman_skel.bsk"
}

def find_skeleton_for_bms(bms_path):
    """Find the appropriate BSK skeleton for a BMS file"""
    name = bms_path.stem.lower()

    # Check all patterns
    for pattern, skel_rel_path in SKELETON_MAP.items():
        if pattern == "default":
            continue
        if pattern in name:
            skel_path = BMS_DIR / skel_rel_path
            if skel_path.exists():
                return skel_path

    # Fallback to default
    return BMS_DIR / SKELETON_MAP["default"]

def find_bms_files(limit=None):
    """Find all BMS files, optionally limited"""
    bms_files = list(BMS_DIR.rglob("*.bms"))
    print(f"Found {len(bms_files)} BMS files total")
    if limit:
        bms_files = bms_files[:limit]
        print(f"Limited to {limit} files for testing")
    return bms_files

def convert_single_file(bms_path, output_path):
    """Convert a single BMS file to GLB with skeleton"""
    try:
        # Clear scene
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete()

        # Find matching skeleton
        bsk_path = find_skeleton_for_bms(bms_path)

        # Set file paths in scene properties
        bpy.context.scene.sro_props.import_bms_filepath = str(bms_path)
        bpy.context.scene.sro_props.import_bsk_filepath = str(bsk_path)

        # Execute import
        result = bpy.ops.silkroad.import_bms()
        if result != {'FINISHED'}:
            return False, "Import failed"

        # Create output directory
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Select all objects for export
        bpy.ops.object.select_all(action='SELECT')

        # Export to GLB with skinning
        bpy.ops.export_scene.gltf(
            filepath=str(output_path),
            export_format='GLB',
            export_skins=True,
            export_texcoords=True,
            export_normals=True,
            export_tangents=False
        )

        # Verify output
        if output_path.exists() and output_path.stat().st_size > 1000:
            return True, None
        else:
            return False, "Output file too small"

    except Exception as e:
        return False, str(e)

def validate_glb_skinning(glb_path):
    """Check if GLB has JOINTS_0 and WEIGHTS_0"""
    try:
        with open(glb_path, 'rb') as f:
            f.read(12)  # header
            json_len = int.from_bytes(f.read(4), 'little')
            f.read(4)  # 'JSON'
            json_data = json.loads(f.read(json_len).decode('utf-8'))

            for mesh in json_data.get('meshes', []):
                for prim in mesh.get('primitives', []):
                    attrs = prim.get('attributes', {})
                    has_joints = 'JOINTS_0' in attrs
                    has_weights = 'WEIGHTS_0' in attrs
                    return has_joints and has_weights
            return False
    except:
        return False

def main():
    """Main conversion function"""
    print("=" * 60)
    print("Production Blender Batch Converter for SRObro")
    print("=" * 60)
    print()

    # Check addon
    if not BLENDER_ADDON.exists():
        print(f"ERROR: Plugin not found at {BLENDER_ADDON}")
        return

    # Register plugin
    try:
        import importlib.util
        spec = importlib.util.spec_from_file_location("silkroad_importer", BLENDER_ADDON)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        module.register()
        print("✅ Plugin registered")
    except Exception as e:
        print(f"❌ Plugin loading failed: {e}")
        return

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Input directory: {BMS_DIR}")
    print(f"Output directory: {OUTPUT_DIR}")
    print()

    # Find ALL BMS files
    bms_files = find_bms_files()

    if not bms_files:
        print("No BMS files found!")
        return

    print(f"\n📋 Conversion Summary:")
    print(f"   Files to convert: {len(bms_files)}")
    print(f"   Output: {OUTPUT_DIR}")
    print()

    # Convert files
    success_count = 0
    fail_count = 0
    skinning_count = 0
    errors = []
    skipped_count = 0

    for i, bms_path in enumerate(bms_files):
        # Calculate relative path for output
        try:
            relative_path = bms_path.relative_to(BMS_DIR)
        except ValueError:
            # File is not under BMS_DIR
            relative_path = bms_path.name

        output_path = OUTPUT_DIR / relative_path.with_suffix('.glb')

        # Skip if file already exists (resume from where we stopped)
        if output_path.exists() and output_path.stat().st_size > 1000:
            skipped_count += 1
            if skipped_count <= 10 or i % 100 == 0:  # Show first 10 and every 100th
                print(f"\n[{i+1}/{len(bms_files)}] {bms_path.name} - ⏭️  Already exists, skipping")
            continue

        # Progress
        print(f"\n[{i+1}/{len(bms_files)}] {bms_path.name}")
        print(f"   Skeleton: {find_skeleton_for_bms(bms_path).name}")

        # Convert
        success, error = convert_single_file(bms_path, output_path)

        if success:
            success_count += 1

            # Validate skinning
            if validate_glb_skinning(output_path):
                skinning_count += 1
                print(f"   ✅ Success with skinning")
            else:
                print(f"   ⚠️  Success but missing skinning data")
        else:
            fail_count += 1
            errors.append((bms_path.name, error))
            print(f"   ❌ Failed: {error}")

    # Final report
    print("\n" + "=" * 60)
    print("CONVERSION REPORT")
    print("=" * 60)
    print(f"Total files:    {len(bms_files)}")
    print(f"⏭️  Skipped:     {skipped_count}")
    print(f"✅ Successful:  {success_count}")
    print(f"❌ Failed:      {fail_count}")
    print(f"🦴 With Skinning: {skinning_count}")
    print()

    if errors:
        print("Failed files:")
        for name, error in errors:
            print(f"  - {name}: {error}")
        print()

    print(f"Output directory: {OUTPUT_DIR}")
    print()

if __name__ == "__main__":
    main()
