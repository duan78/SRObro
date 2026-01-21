#!/usr/bin/env python3
"""
Test single file conversion to debug the issue
"""

import subprocess
import tempfile
import sys
from pathlib import Path

BLENDER_PATH = r"C:\Program Files\Blender Foundation\Blender 5.0\blender.exe"
TEST_BMS = r"C:\Users\duan7\Desktop\SRObro\assets\data_extracted\prim\avatar_m_nasrun.bms"
OUTPUT_DIR = Path(r"C:/Users/duan7/Desktop/SRObro/assets/test_output")

# Use forward slashes for Blender (convert Windows path)
OUTPUT_FILE = OUTPUT_DIR / "test_avatar.glb"
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

# Convert paths to use forward slashes for Blender
test_bms_forward = TEST_BMS.replace('\\', '/')
output_forward = str(OUTPUT_FILE).replace('\\', '/')

# Test command with explicit output path
cmd = [
    str(BLENDER_PATH),
    '-b',  # Background
    '--python-expr',
    f'''
import bpy
import sys

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

print("[*] Attempting to import: {test_bms_forward}")

# Test if file exists
import os
if not os.path.exists("{TEST_BMS}"):
    print(f"[ERROR] BMS file not found: {{TEST_BMS}}")
    sys.exit(1)

# Try to import
try:
    # Just create a simple cube for testing
    bpy.ops.mesh.primitive_cube_add()
    obj = bpy.context.object
    print(f"[+] Created test object: {{obj.name}}")

    # Export
    bpy.ops.export_scene.gltf(
        filepath=r"{output_forward}",
        export_format='GLB',
        export_selected=True,
        export_skins=True,
    )
    print(f"[+] Exported to: {output_forward}")

    # Verify file exists
    if os.path.exists(r"{output_forward}"):
        size = os.path.getsize(r"{output_forward}")
        print(f"[SUCCESS] File created! Size: {{size}} bytes")
        sys.exit(0)
    else:
        print(f"[ERROR] File not found after export!")
        sys.exit(1)

except Exception as e:
    print(f"[ERROR] {{e}}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
'''
]

print("="*70)
print("TESTING SINGLE FILE CONVERSION")
print("="*70)
print(f"Blender: {BLENDER_PATH}")
print(f"Output: {OUTPUT_FILE}")
print()

result = subprocess.run(
    cmd,
    capture_output=True,
    text=True,
    timeout=60
)

print("STDOUT:")
print(result.stdout)
print("\nSTDERR:")
print(result.stderr)
print(f"\nExit code: {result.returncode}")

# Check if file was created
if OUTPUT_FILE.exists():
    print(f"\n[SUCCESS] File created at {OUTPUT_FILE}")
    print(f"   Size: {OUTPUT_FILE.stat().st_size} bytes")
else:
    print(f"\n[FAILED] File not created at {OUTPUT_FILE}")
