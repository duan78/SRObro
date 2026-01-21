#!/usr/bin/env python3
"""
Complete Pipeline: PK2 Extraction → BSR/BMS → GLB with Skinning

This script orchestrates:
1. PK2 extraction using pk2_mate (Rust)
2. Find Character and Mob folders
3. Convert BSR to GLB using Blender with skinning
4. Validate GLB has JOINTS and WEIGHTS
"""

import subprocess
import sys
import time
from pathlib import Path
import json

# Configuration
MEDIA_PK2 = r"C:\Program Files (x86)\Silkroad\Media.pk2"
PK2_MATE = r"C:\Users\duan7\Desktop\SRObro\tools\veykril-pk2\target\release\pk2_mate.exe"
EXTRACTION_OUTPUT = r"C:\Users\duan7\Desktop\SRObro\assets\pk2_complete"
GLB_OUTPUT = r"C:\Users\duan7\Desktop\SRObro\client\assets\models"
BLENDER = r"C:\Program Files\Blender Foundation\Blender 5.0\blender.exe"

def step1_extract_pk2():
    """Step 1: Extract Media.pk2 using pk2_mate"""
    print("\n" + "=" * 70)
    print("STEP 1: PK2 Extraction")
    print("=" * 70)

    if Path(EXTRACTION_OUTPUT).exists():
        print(f"[!] Extraction directory already exists: {EXTRACTION_OUTPUT}")
        response = input("    Re-extract? (y/N): ")
        if response.lower() != 'y':
            print("[*] Skipping extraction")
            return True

    print(f"[*] Extracting: {MEDIA_PK2}")
    print(f"[*] Output: {EXTRACTION_OUTPUT}")
    print("[*] This will take 10-15 minutes for 15GB...")

    try:
        result = subprocess.run(
            [PK2_MATE, 'extract', '--archive', MEDIA_PK2, '--out', EXTRACTION_OUTPUT],
            capture_output=True,
            text=True,
            timeout=3600  # 1 hour timeout
        )

        if result.returncode == 0:
            print("[+] Extraction completed successfully!")
            return True
        else:
            print(f"[!] Extraction failed: {result.stderr}")
            return False

    except subprocess.TimeoutExpired:
        print("[!] Extraction timed out")
        return False
    except Exception as e:
        print(f"[!] Error: {e}")
        return False

def step2_find_assets():
    """Step 2: Find Character and Mob folders with BSR/BMS files"""
    print("\n" + "=" * 70)
    print("STEP 2: Finding Character and Mob Assets")
    print("=" * 70)

    base_path = Path(EXTRACTION_OUTPUT)
    if not base_path.exists():
        print(f"[!] Extraction directory not found: {EXTRACTION_OUTPUT}")
        return None, None

    character_paths = []
    mob_paths = []

    print("[*] Scanning for BSR/BMS files...")

    for root, dirs, files in os.walk(base_path):
        has_bsr = any(f.endswith(('.BSR', '.bsr')) for f in files)
        has_bms = any(f.endswith(('.BMS', '.bms')) for f in files)

        if has_bsr or has_bms:
            rel_path = Path(root).relative_to(base_path)
            path_str = str(rel_path).lower()

            # Character indicators
            if any(k in path_str for k in ['character', 'char', 'ch_man', 'ch_woman']):
                file_count = len([f for f in files if f.endswith(('.BSR', '.bsr', '.BMS', '.bms'))])
                character_paths.append((rel_path, file_count))

            # Mob indicators
            if any(k in path_str for k in ['mob', 'monster', 'npc']):
                file_count = len([f for f in files if f.endswith(('.BSR', '.bsr', '.BMS', '.bms'))])
                mob_paths.append((rel_path, file_count))

    print(f"\n[+] Found {len(character_paths)} Character directories")
    for path, count in sorted(character_paths)[:10]:
        print(f"    - {path} ({count} files)")

    print(f"\n[+] Found {len(mob_paths)} Mob directories")
    for path, count in sorted(mob_paths)[:10]:
        print(f"    - {path} ({count} files)")

    return character_paths, mob_paths

def step3_convert_sample(character_paths, mob_paths, max_files=5):
    """Step 3: Convert sample files to GLB with Blender"""
    print("\n" + "=" * 70)
    print("STEP 3: Converting Sample BSR to GLB")
    print("=" * 70)

    # Get sample BSR files
    sample_files = []

    if character_paths:
        char_path = Path(EXTRACTION_OUTPUT) / character_paths[0][0]
        sample_files.extend(list(char_path.glob('*.BSR'))[:max_files])
        sample_files.extend(list(char_path.glob('*.bsr'))[:max_files])

    if mob_paths and len(sample_files) < max_files:
        mob_path = Path(EXTRACTION_OUTPUT) / mob_paths[0][0]
        sample_files.extend(list(mob_path.glob('*.BSR'))[:max_files])
        sample_files.extend(list(mob_path.glob('*.bsr'))[:max_files])

    sample_files = sample_files[:max_files]

    if not sample_files:
        print("[!] No BSR files found to convert")
        return False

    print(f"[*] Converting {len(sample_files)} sample files...")
    print(f"[*] Output: {GLB_OUTPUT}")

    success = 0
    for i, bsr_file in enumerate(sample_files, 1):
        print(f"\n[{i}/{len(sample_files)}] {bsr_file.name}")

        # Run Blender conversion
        result = subprocess.run(
            [sys.executable, 'scripts/convert-batch-blender.py', '1'],
            capture_output=True,
            text=True,
            timeout=180
        )

        if "SUCCESS" in result.stdout:
            print(f"    ✓ Converted successfully")
            success += 1
        else:
            print(f"    ✗ Failed: {result.stderr[-200:]}")

    print(f"\n[+] {success}/{len(sample_files)} files converted")
    return success > 0

def step4_validate_glb():
    """Step 4: Validate GLB has JOINTS and WEIGHTS"""
    print("\n" + "=" * 70)
    print("STEP 4: Validating GLB Skinning Data")
    print("=" * 70)

    # Find GLB files
    glb_files = list(Path(GLB_OUTPUT).rglob('*.glb'))

    if not glb_files:
        print(f"[!] No GLB files found in {GLB_OUTPUT}")
        return False

    print(f"[*] Validating {len(glb_files)} GLB files...")

    all_valid = True
    for glb_file in glb_files[:5]:  # Validate first 5
        result = subprocess.run(
            [sys.executable, 'scripts/check-glb-skinning.js', str(glb_file)],
            capture_output=True,
            text=True,
            timeout=30
        )

        if "SUCCESS: GLB contains skinning data" in result.stdout:
            print(f"    ✓ {glb_file.name}")
        else:
            print(f"    ✗ {glb_file.name} - NO SKINNING DATA")
            all_valid = False

    if all_valid:
        print("\n[+] All validated GLB files have skinning data!")
    else:
        print("\n[!] Some GLB files are missing skinning data")

    return all_valid

def main():
    """Main pipeline execution"""

    print("=" * 70)
    print("PK2 → GLB Pipeline with Skinning Support")
    print("=" * 70)
    print(f"Media.pk2: {MEDIA_PK2}")
    print(f"pk2_mate: {PK2_MATE}")
    print(f"Output: {GLB_OUTPUT}")
    print(f"Blender: {BLENDER}")
    print("=" * 70)

    # Step 1: Extract PK2
    if not step1_extract_pk2():
        print("\n[!] Pipeline failed at Step 1: Extraction")
        return 1

    # Step 2: Find assets
    character_paths, mob_paths = step2_find_assets()
    if not character_paths and not mob_paths:
        print("\n[!] Pipeline failed at Step 2: No assets found")
        return 2

    # Step 3: Convert sample
    if not step3_convert_sample(character_paths, mob_paths):
        print("\n[!] Pipeline failed at Step 3: Conversion")
        return 3

    # Step 4: Validate
    if not step4_validate_glb():
        print("\n[!] Pipeline completed with validation issues")
        return 4

    print("\n" + "=" * 70)
    print("PIPELINE COMPLETE!")
    print("=" * 70)
    print("[+] PK2 extracted")
    print("[+] Assets found and converted")
    print("[+] GLB files have skinning data")
    print("[+] Ready for Babylon.js integration")
    print("=" * 70)

    return 0

if __name__ == "__main__":
    import os  # Add at top of function
    sys.exit(main())
