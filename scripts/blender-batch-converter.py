#!/usr/bin/env python3
"""
Blender Batch Converter for SRObro
Converts all BMS files to GLB using Blender Python API with szabo176 plugin

Requires:
- Blender 5.0+ installed
- szabo176/Silkroad-Online-Tools plugin installed
- Python 3.8+
"""

import os
import sys
import subprocess
from pathlib import Path
from datetime import datetime

# Configuration
DATA_DIR = Path("assets/data_extracted")
OUTPUT_DIR = Path("assets/glb_blender")
BLENDER_PATH = r"C:\Program Files\Blender Foundation\Blender 5.0\blender.exe"

# Portable fallback
if not Path(BLENDER_PATH).exists():
    BLENDER_PATH = Path("tools/blender/blender.exe")

def find_bms_files():
    """Find all BMS files to convert"""
    bms_files = list(DATA_DIR.rglob("*.bms"))
    print(f"Found {len(bms_files)} BMS files")
    return bms_files

def convert_with_blender(bms_path: Path, output_path: Path):
    """Convert a single BMS file to GLB using Blender"""
    try:
        # Python script for Blender
        blender_script = f'''
import bpy
import sys
import os

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Import BMS file
bpy.ops.import_scene.gltf(
    filepath=r"{bms_path}",
    use_selection=True
)

# Export to GLB with SKINNING
bpy.ops.export_scene.gltf(
    filepath=r"{output_path}",
    export_format='GLB',
    use_selection=True,  # CRITICAL for Blender 5.0
    export_skins=True,  # CRITICAL - include skinning data!
    export_texcoords=True,
    export_normals=True,
    export_tangents=False
)
'''

        # Create output directory
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Run Blender in background mode
        result = subprocess.run(
            [BLENDER_PATH, "-b", "-P", "-"],
            input=blender_script,
            capture_output=True,
            text=True,
            timeout=300  # 5 minutes max per file
        )

        if result.returncode != 0:
            print(f"ERROR converting {bms_path.name}")
            print(f"stderr: {result.stderr}")
            return False

        # Verify output file exists and is not empty
        if output_path.exists() and output_path.stat().st_size > 1000:
            return True
        else:
            print(f"WARNING: Output file missing or too small: {output_path}")
            return False

    except subprocess.TimeoutExpired:
        print(f"TIMEOUT: {bms_path.name}")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

def main():
    """Main conversion function"""
    print("="*60)
    print("Blender Batch Converter for SRObro")
    print("="*60)
    print()

    # Check Blender installation
    if not Path(BLENDER_PATH).exists():
        print(f"ERROR: Blender not found at: {BLENDER_PATH}")
        print()
        print("Please install Blender first:")
        print("1. Download: https://www.blender.org/download/")
        print("2. Install Blender 5.0")
        print("3. Install szabo176 plugin from:")
        print("   https://github.com/szabo176/Silkroad-Online-Tools")
        return

    print(f"Blender found: {BLENDER_PATH}")
    print(f"Data directory: {DATA_DIR.absolute()}")
    print(f"Output directory: {OUTPUT_DIR.absolute()}")
    print()

    # Create output directory
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all BMS files
    bms_files = find_bms_files()

    if not bms_files:
        print("No BMS files found!")
        return

    # Estimate time
    estimated_time = len(bms_files) * 2  # ~2 seconds per file
    print(f"Estimated time: {estimated_time // 60} minutes")
    print()

    # Ask for confirmation
    response = input(f"Convert {len(bms_files)} files? (y/n): ")
    if response.lower() != 'y':
        print("Cancelled")
        return

    print()
    print(f"Starting conversion at {datetime.now().strftime('%H:%M:%S')}")
    print("="*60)

    # Convert files
    success_count = 0
    fail_count = 0

    for i, bms_path in enumerate(bms_files):
        # Calculate relative path for output
        relative_path = bms_path.relative_to(DATA_DIR)
        output_path = OUTPUT_DIR / relative_path.with_suffix('.glb')

        # Progress
        if (i + 1) % 100 == 0 or i == 0:
            print(f"[{i+1}/{len(bms_files)}] Processing...")

        # Convert
        if convert_with_blender(bms_path, output_path):
            success_count += 1
        else:
            fail_count += 1

    # Final report
    print("="*60)
    print(f"Conversion complete at {datetime.now().strftime('%H:%M:%S')}")
    print(f"Success: {success_count}")
    print(f"Failed:  {fail_count}")
    print()
    print(f"Output: {OUTPUT_DIR.absolute()}")
    print()

if __name__ == "__main__":
    main()
