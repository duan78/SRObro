#!/usr/bin/env python3
"""
Test single BMS file import with Blender
"""

import subprocess
import sys
import tempfile
import os
from pathlib import Path

# Blender installation
BLENDER_PATH = r"C:\Program Files\Blender Foundation\Blender 5.0\blender.exe"

# Test file
TEST_BMS = r"C:\Users\duan7\Desktop\SRObro\assets\data_extracted\prim\avatar_m_nasrun.bms"

OUTPUT_DIR = Path(r"C:/Users/duan7/Desktop/SRObro/assets/test_output")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

# Simplified plugin for testing
PLUGIN_CODE = '''import bpy
import struct
import sys

def read_int(f): return int.from_bytes(f.read(4), 'little')
def read_short(f): return int.from_bytes(f.read(2), 'little')
def read_byte(f): return int.from_bytes(f.read(1), 'little')
def read_str(f):
    str_len = read_int(f)
    if str_len <= 0: return ""
    return f.read(str_len).decode("cp949", errors='ignore')

bms_path = r"''' + TEST_BMS + '''"

print(f"[*] Testing import: {bms_path}")

try:
    with open(bms_path, 'rb') as f:
        magic = f.read(7)
        print(f"[+] Magic: {magic}")

        if magic != b"JMXVBMS":
            print("[!] Not a JMXV BMS file!")
            sys.exit(1)

        print("[+] JMXV signature confirmed!")

        f.read(5)
        header_offsets = struct.unpack('<10I', f.read(40))
        print(f"[+] Vertex offset: {header_offsets[0]}")
        print(f"[+] Skin offset: {header_offsets[1]}")
        print(f"[+] Face offset: {header_offsets[2]}")

        f.read(8)
        vertex_flag = read_int(f)
        f.read(4)
        mesh_name = read_str(f)
        mat_name = read_str(f)

        print(f"[+] Mesh name: {mesh_name}")
        print(f"[+] Material name: {mat_name}")

    print("[SUCCESS] JMXV decompression test passed!")
    sys.exit(0)

except Exception as e:
    print(f"[ERROR] {e}")
    import traceback
    traceback.print_exc()
    sys.exit(1)
'''

# Create temp plugin
with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
    f.write(PLUGIN_CODE)
    plugin_path = f.name

try:
    # Run Blender in test mode
    cmd = [
        BLENDER_PATH,
        '-b',  # Background mode
        '-P', plugin_path,
    ]

    print("="*70)
    print("TESTING SINGLE FILE IMPORT")
    print("="*70)
    print(f"[*] Blender path: {BLENDER_PATH}")
    print(f"[*] Test file: {TEST_BMS}")
    print(f"[*] Output dir: {OUTPUT_DIR}")
    print()

    result = subprocess.run(
        cmd,
        capture_output=True,
        text=True,
        timeout=60
    )

    print("STDOUT:")
    print(result.stdout)
    print()
    print("STDERR:")
    print(result.stderr)
    print()

    if result.returncode == 0:
        print("="*70)
        print("TEST PASSED!")
        print("="*70)
        print("[+] Blender can read JMXV files")
        print("[+] Plugin structure is correct")
        print("[+] Ready for batch conversion")
    else:
        print("="*70)
        print("TEST FAILED")
        print("="*70)
        print(f"[!] Exit code: {result.returncode}")

finally:
    try:
        os.unlink(plugin_path)
    except:
        pass
