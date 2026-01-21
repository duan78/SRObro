#!/usr/bin/env python3
"""
Batch convert BSR files to GLB with Blender 5.0
Uses the custom BSR importer with skinning support
"""

import subprocess
import sys
from pathlib import Path
import time

def find_bsr_files(base_path):
    """Find all BSR files in extraction"""
    bsr_files = []
    base = Path(base_path)

    print(f"Scanning {base_path} for BSR files...")

    for ext in ['*.BSR', '*.bsr']:
        bsr_files.extend(base.rglob(ext))

    print(f"Found {len(bsr_files)} BSR files")
    return bsr_files

def convert_bsr_to_glb(bsr_file, output_dir, blender_path):
    """Convert a single BSR file to GLB using Blender"""

    # Create output path
    rel_path = bsr_file.relative_to(bsr_file.parents[3])  # Adjust depth as needed
    output_path = Path(output_dir) / rel_path.with_suffix('.glb')
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Create Blender Python script
    blender_script = f'''
import bpy
import sys
import os

# Clear existing scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)

# Add importer path
importer_path = r"{Path(__file__).parent / '..' / 'tools' / 'blender-bsr-importer'}"
if importer_path not in sys.path:
    sys.path.insert(0, importer_path)

# Import BSR file
try:
    from bsr_importer import import_bsr

    result = import_bsr(
        filepath=r"{bsr_file}",
        scale=0.01
    )

    if result and len(result) > 0:
        # Export to GLB with skinning
        bpy.ops.export_scene.gltf(
            filepath=r"{output_path}",
            export_format='GLB',
            export_selected=True,
            export_texcoords=True,
            export_normals=True,
            export_tangents=True,
            export_skins=True,  # CRITICAL - enable skinning export
            export_morph=False,
            export_cameras=False,
            export_lights=False
        )
        print(f"SUCCESS: Converted {{'{bsr_file.name}'}} to GLB")
    else:
        print(f"ERROR: Import failed for {{'{bsr_file}'}}")

except Exception as e:
    print(f"ERROR: {{str(e)}}")
    import traceback
    traceback.print_exc()
'''

    # Write script to temp file
    script_file = Path(f"/tmp/convert_{int(time.time())}_{bsr_file.stem}.py")
    try:
        script_file.write_text(blender_script)
    except Exception as e:
        # Fallback for Windows
        import tempfile
        with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
            f.write(blender_script)
            script_file = Path(f.name)

    # Run Blender
    try:
        result = subprocess.run(
            [blender_path, '--background', '--python', str(script_file)],
            capture_output=True,
            text=True,
            timeout=120  # 2 minutes per file
        )

        if result.returncode == 0:
            return True, output_path
        else:
            return False, result.stderr

    except subprocess.TimeoutExpired:
        return False, "Timeout"
    except Exception as e:
        return False, str(e)
    finally:
        try:
            script_file.unlink()
        except:
            pass

def batch_convert(base_path, output_dir, blender_path, max_files=None):
    """Batch convert BSR files to GLB"""

    # Find all BSR files
    bsr_files = find_bsr_files(base_path)

    if max_files:
        bsr_files = bsr_files[:max_files]

    print(f"\n{'=' * 70}")
    print(f"BATCH CONVERSION: BSR to GLB with Skinning")
    print(f"{'=' * 70}")
    print(f"Source: {base_path}")
    print(f"Output: {output_dir}")
    print(f"Blender: {blender_path}")
    print(f"Files to convert: {len(bsr_files)}")
    print(f"{'=' * 70}\n")

    output_base = Path(output_dir)
    output_base.mkdir(parents=True, exist_ok=True)

    success_count = 0
    fail_count = 0

    for i, bsr_file in enumerate(bsr_files, 1):
        print(f"[{i}/{len(bsr_files)}] Converting: {bsr_file.name}", end=" ")

        success, result = convert_bsr_to_glb(bsr_file, output_dir, blender_path)

        if success:
            print(f"✓ OK")
            success_count += 1
        else:
            print(f"✗ FAIL: {result}")
            fail_count += 1

    print(f"\n{'=' * 70}")
    print(f"CONVERSION COMPLETE")
    print(f"{'=' * 70}")
    print(f"Successful: {success_count}")
    print(f"Failed: {fail_count}")
    print(f"Total: {len(bsr_files)}")
    print(f"{'=' * 70}\n")

    return success_count, fail_count

if __name__ == "__main__":
    # Configuration
    extraction_path = "C:/Users/duan7/Desktop/SRObro/assets/pk2_complete"
    output_path = "C:/Users/duan7/Desktop/SRObro/client/assets/models"
    blender_path = r"C:\Program Files\Blender Foundation\Blender 5.0\blender.exe"

    # Convert (limit to 10 files for testing)
    if len(sys.argv) > 1:
        max_files = int(sys.argv[1])
    else:
        max_files = 10  # Default: test with 10 files first

    batch_convert(extraction_path, output_path, blender_path, max_files)
