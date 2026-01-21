#!/usr/bin/env python3
"""
Monitor PK2 extraction progress and find Character/Mob files
"""

import os
import time
from pathlib import Path

def count_files_and_size(base_path):
    """Count files and total size"""
    total_files = 0
    total_size = 0
    bsr_count = 0
    bms_count = 0

    try:
        for root, dirs, files in os.walk(base_path):
            for file in files:
                filepath = Path(root) / file
                try:
                    size = filepath.stat().st_size
                    total_files += 1
                    total_size += size

                    if file.endswith('.BSR') or file.endswith('.bsr'):
                        bsr_count += 1
                    elif file.endswith('.BMS') or file.endswith('.bms'):
                        bms_count += 1
                except:
                    pass
    except Exception as e:
        print(f"Error counting: {e}")

    return total_files, total_size, bsr_count, bms_count

def find_character_mob(base_path):
    """Find Character and Mob directories with BSR/BMS files"""
    character_paths = []
    mob_paths = []

    for root, dirs, files in os.walk(base_path):
        # Check if directory has BSR/BMS files
        has_bsr = any(f.endswith('.BSR') or f.endswith('.bsr') for f in files)
        has_bms = any(f.endswith('.BMS') or f.endswith('.bms') for f in files)

        if has_bsr or has_bms:
            rel_path = Path(root).relative_to(base_path)

            # Check for Character indicators
            if any(keyword in str(rel_path).lower() for keyword in ['character', 'char', 'ch_', 'man', 'woman']):
                character_paths.append((rel_path, len([f for f in files if f.endswith(('.BSR', '.bsr', '.BMS', '.bms'))])))

            # Check for Mob indicators
            if any(keyword in str(rel_path).lower() for keyword in ['mob', 'monster', 'npc']):
                mob_paths.append((rel_path, len([f for f in files if f.endswith(('.BSR', '.bsr', '.BMS', '.bms'))])))

    return character_paths, mob_paths

def monitor_progress():
    base_path = "C:/Users/duan7/Desktop/SRObro/assets/pk2_complete"

    print("=" * 70)
    print("PK2 Extraction Monitor")
    print("=" * 70)
    print(f"Target: {base_path}")
    print()

    iteration = 0
    last_file_count = 0

    while True:
        iteration += 1

        if not os.path.exists(base_path):
            print(f"[{iteration}] Waiting for extraction directory to be created...")
            time.sleep(5)
            continue

        total_files, total_size, bsr_count, bms_count = count_files_and_size(base_path)

        size_mb = total_size / (1024 * 1024)
        size_gb = size_mb / 1024

        print(f"\r[{iteration}] Files: {total_files:,} | Size: {size_mb:.1f} MB ({size_gb:.2f} GB) | BSR: {bsr_count:,} | BMS: {bms_count:,}", end="")

        # Check if extraction is still running (file count increasing)
        if total_files == last_file_count and total_files > 0:
            # No change for 5 seconds, might be done
            print("\n\nExtraction appears complete. Searching for Character/Mob...")

            character_paths, mob_paths = find_character_mob(base_path)

            print("\n" + "=" * 70)
            print("CHARACTER DIRECTORIES (with BSR/BMS files):")
            print("=" * 70)
            if character_paths:
                for path, count in sorted(character_paths)[:20]:
                    print(f"  {path} ({count} files)")
                if len(character_paths) > 20:
                    print(f"  ... and {len(character_paths) - 20} more")
            else:
                print("  None found")

            print("\n" + "=" * 70)
            print("MOB DIRECTORIES (with BSR/BMS files):")
            print("=" * 70)
            if mob_paths:
                for path, count in sorted(mob_paths)[:20]:
                    print(f"  {path} ({count} files)")
                if len(mob_paths) > 20:
                    print(f"  ... and {len(mob_paths) - 20} more")
            else:
                print("  None found")

            print("\n" + "=" * 70)
            print("SUMMARY:")
            print("=" * 70)
            print(f"Total files extracted: {total_files:,}")
            print(f"Total size: {size_gb:.2f} GB")
            print(f"BSR files: {bsr_count:,}")
            print(f"BMS files: {bms_count:,}")
            print(f"Character directories: {len(character_paths)}")
            print(f"Mob directories: {len(mob_paths)}")
            print("\n[+] Extraction complete!")
            break

        last_file_count = total_files
        time.sleep(5)

if __name__ == "__main__":
    try:
        monitor_progress()
    except KeyboardInterrupt:
        print("\n\n[!] Monitoring stopped by user")
