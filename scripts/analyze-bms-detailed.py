#!/usr/bin/env python3
"""
Analyze BMS file format to understand structure
"""

import struct
import sys
from pathlib import Path

def analyze_bms(filepath):
    print(f"{'='*70}")
    print(f"BMS File Analysis: {Path(filepath).name}")
    print(f"{'='*70}\n")

    with open(filepath, 'rb') as f:
        data = f.read()

    file_size = len(data)
    print(f"File Size: {file_size:,} bytes ({file_size/1024:.1f} KB)\n")

    # Read header
    print("HEADER (first 64 bytes):")
    print("-" * 70)

    # Check magic number
    magic = data[0:4]
    print(f"Magic (0-3):   {magic} ({repr(magic)})")

    # Try different interpretations
    if len(data) >= 16:
        version = struct.unpack('<I', data[4:8])[0]
        print(f"Version (4-7): {version}")

        bone_count = struct.unpack('<I', data[8:12])[0]
        print(f"Bone Count (8-11): {bone_count}")

        mesh_count = struct.unpack('<I', data[12:16])[0]
        print(f"Mesh Count (12-15): {mesh_count}")

    print("\n" + "="*70)
    print("SEARCHING FOR PATTERNS")
    print("="*70)

    # Search for common patterns
    patterns = {
        b'BSR\x00': 'BSR magic (mesh format)',
        b'BMS\x00': 'BMS magic (animation format)',
        b'JMXV': 'JMXV compression',
        b'JMXW': 'JMXW compression',
    }

    for pattern, name in patterns.items():
        if pattern in data:
            pos = data.find(pattern)
            print(f"[+] Found {name} at position {pos}")

    # Check for float arrays (vertices)
    print("\n" + "="*70)
    print("FLOAT ARRAYS (Potential vertices)")
    print("="*70)

    float_count = 0
    for i in range(0, min(len(data) - 12, 1000), 4):
        try:
            val = struct.unpack('<f', data[i:i+4])[0]
            # Check if it's a reasonable vertex coordinate
            if -100 < val < 100 and val != 0:
                float_count += 1
        except:
            pass

    print(f"Floats in range [-100, 100] in first 1KB: {float_count}")

    # Look for repeating patterns (bones/joints)
    print("\n" + "="*70)
    print("STRUCTURE ANALYSIS")
    print("="*70)

    # Check for 32-bit indices
    print("\n32-bit Integers (first 20):")
    for i in range(min(20, len(data) // 4)):
        val = struct.unpack('<I', data[i*4:i*4+4])[0]
        if val < 10000:  # Reasonable value
            print(f"  [{i*4:4d}]: {val}")

    # Check for 16-bit indices
    print("\n16-bit Integers (first 20):")
    for i in range(min(20, len(data) // 2)):
        val = struct.unpack('<H', data[i*2:i*2+2])[0]
        if val < 1000:  # Reasonable value
            print(f"  [{i*2:4d}]: {val}")

    print("\n" + "="*70)
    print("RECOMMENDED NEXT STEPS")
    print("="*70)
    print("1. Compare with known BMS documentation")
    print("2. Check if Noesis can open this file")
    print("3. Look for skeleton data (bone names, matrices)")
    print("4. Search for vertex buffer patterns")
    print("5. Extract and inspect with hex editor")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        # Use a sample file
        sample = "C:/Users/duan7/Desktop/SRObro/assets/data_extracted/prim/avatar_m_nasrun.bms"
        if Path(sample).exists():
            analyze_bms(sample)
        else:
            print(f"Sample file not found: {sample}")
            print("Usage: python analyze_bms_detailed.py <file.bms>")
    else:
        analyze_bms(sys.argv[1])
