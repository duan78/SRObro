#!/usr/bin/env python3
"""
Blender Batch Converter for SRObro (Simplified)
Converts BMS+BSK files to GLB using szabo176 plugin
"""

import bpy
import os
import sys
from pathlib import Path

# Configuration
BMS_DIR = Path("C:/Users/duan7/Desktop/SRObro/assets/data_extracted")
OUTPUT_DIR = Path("C:/Users/duan7/Desktop/SRObro/assets/glb_blender")
BLENDER_ADDON = Path("C:/Users/duan7/AppData/Roaming/Blender Foundation/Blender 5.0/scripts/addons/silkroad-blender-importer.py")

def find_bms_files():
    """Find all BMS files"""
    bms_files = list(BMS_DIR.rglob("*.bms"))
    print(f"Found {len(bms_files)} BMS files")
    return bms_files

def find_matching_files(bms_path):
    """Find matching BSK and BMT files"""
    directory = bms_path.parent
    base_name = bms_path.stem

    bsk_path = directory / f"{base_name}.bsk"
    bmt_path = directory / f"{base_name}.bmt"

    return {
        'bsk': bsk_path if bsk_path.exists() else None,
        'bmt': bmt_path if bmt_path.exists() else None
    }

def convert_single_file(bms_path, output_path):
    """Convert a single BMS file to GLB"""
    try:
        # Clear scene
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete()

        # Find matching files
        matching = find_matching_files(bms_path)

        print(f"\n[CONVERT] {bms_path.name}")
        if matching['bsk']:
            print(f"  + BSK: {matching['bsk'].name}")
        else:
            print(f"  - No BSK file found (no skeleton)")

        # Import using szabo176 plugin
        # We need to call the operator directly
        from bpy.props import StringProperty
        context = bpy.context

        # Set properties
        scene = context.scene
        if not hasattr(scene, 'sro_props'):
            print("ERROR: Plugin not loaded!")
            return False

        scene.sro_props.import_bms_filepath = str(bms_path)
        if matching['bsk']:
            scene.sro_props.import_bsk_filepath = str(matching['bsk'])
        if matching['bmt']:
            scene.sro_props.import_bmt_filepath = str(matching['bmt'])

        # Execute import
        result = bpy.ops.silkroad.import_bms()
        if result != {'FINISHED'}:
            print(f"  ERROR: Import failed")
            return False

        # Create output directory
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Export to GLB with skinning
        # Select all objects
        bpy.ops.object.select_all(action='SELECT')

        bpy.ops.export_scene.gltf(
            filepath=str(output_path),
            export_format='GLB',
            use_selected=False,  # Export all
            export_skins=True,   # CRITICAL - include skinning!
            export_texcoords=True,
            export_normals=True,
            export_tangents=False
        )

        # Verify output
        if output_path.exists() and output_path.stat().st_size > 1000:
            print(f"  SUCCESS: {output_path.stat().st_size} bytes")
            return True
        else:
            print(f"  WARNING: Output file too small")
            return False

    except Exception as e:
        print(f"  ERROR: {e}")
        import traceback
        traceback.print_exc()
        return False

def main():
    """Main conversion function"""
    print("=" * 60)
    print("Blender Batch Converter for SRObro (Simplified)")
    print("=" * 60)
    print()

    # Install plugin if not already installed
    if not BLENDER_ADDON.exists():
        print(f"ERROR: Plugin not found at {BLENDER_ADDON}")
        print("Please install silkroad-blender-importer.py first")
        return

    # Register plugin
    try:
        # Import and register the plugin
        import importlib.util
        spec = importlib.util.spec_from_file_location("silkroad_importer", BLENDER_ADDON)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        module.register()
        print("Plugin registered successfully")
    except Exception as e:
        print(f"ERROR loading plugin: {e}")
        return

    print(f"Input directory: {BMS_DIR}")
    print(f"Output directory: {OUTPUT_DIR}")
    print()

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all BMS files
    bms_files = find_bms_files()

    if not bms_files:
        print("No BMS files found!")
        return

    # Ask for confirmation
    print(f"\nReady to convert {len(bms_files)} files")
    print("Press Enter to continue or Ctrl+C to cancel...")
    input()

    # Convert files
    success_count = 0
    fail_count = 0

    for i, bms_path in enumerate(bms_files):
        # Calculate relative path for output
        relative_path = bms_path.relative_to(BMS_DIR)
        output_path = OUTPUT_DIR / relative_path.with_suffix('.glb')

        # Progress
        if (i + 1) % 100 == 0 or i == 0:
            print(f"\n[{i+1}/{len(bms_files)}] Processing...")

        # Convert
        if convert_single_file(bms_path, output_path):
            success_count += 1
        else:
            fail_count += 1

    # Final report
    print("\n" + "=" * 60)
    print(f"Conversion complete")
    print(f"Success: {success_count}")
    print(f"Failed:  {fail_count}")
    print(f"\nOutput: {OUTPUT_DIR}")
    print()

if __name__ == "__main__":
    main()
