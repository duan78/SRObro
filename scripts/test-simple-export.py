#!/usr/bin/env python3
"""
Simple test - create cube and export to GLB
"""

import subprocess
import sys
from pathlib import Path

BLENDER_PATH = r"C:\Program Files\Blender Foundation\Blender 5.0\blender.exe"
OUTPUT_DIR = Path(r"C:/Users/duan7/Desktop/SRObro/assets/test_output")
OUTPUT_FILE = OUTPUT_DIR / "test_cube.glb"
OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

# Convert to forward slashes for Blender Python
output_forward = str(OUTPUT_FILE).replace('\\', '/')

# Simple Blender script - just create a cube and export
blender_script = f'''
import bpy
import sys
import os

print("[*] Creating test cube...")

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Create cube
bpy.ops.mesh.primitive_cube_add()
obj = bpy.context.object
print(f"[+] Created: {{obj.name}}")

# Export
output_path = r"{output_forward}"
print(f"[*] Exporting to: {{output_path}}")

bpy.ops.export_scene.gltf(
    filepath=output_path,
    export_format='GLB',
    use_selection=False,  # Blender 5.0 uses different param names
    export_skins=True,
)

# Verify
if os.path.exists(output_path):
    size = os.path.getsize(output_path)
    print(f"[SUCCESS] Exported! Size: {{size}} bytes")
else:
    print(f"[ERROR] File not created!")

sys.exit(0)
'''

print("="*70)
print("SIMPLE TEST - Cube to GLB")
print("="*70)
print(f"Output: {OUTPUT_FILE}")
print(f"Forward slash: {output_forward}")
print()

cmd = [
    str(BLENDER_PATH),
    '-b',
    '--python-expr',
    blender_script
]

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

if OUTPUT_FILE.exists():
    print(f"\n[SUCCESS] File created!")
    print(f"   Size: {OUTPUT_FILE.stat().st_size} bytes")
else:
    print(f"\n[FAILED] File not created")
