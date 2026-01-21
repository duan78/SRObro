#!/usr/bin/env python3
"""
Find Character and Mob directories in PK2 extraction
"""

import os
import time
from pathlib import Path

def find_target_dirs(base_path):
    """Find Character and Mob directories"""
    base = Path(base_path)

    print(f"Searching in: {base}")
    print("=" * 70)

    character_dirs = []
    mob_dirs = []

    for root, dirs, files in os.walk(base):
        for d in dirs:
            if 'haracter' in d.lower():
                full_path = Path(root) / d
                character_dirs.append(full_path)
                print(f"[+] Found: {full_path.relative_to(base)}")

            if 'ob' in d.lower() and 'obile' not in d.lower():
                # Avoid "mobile" etc, want "Mob"
                full_path = Path(root) / d
                mob_dirs.append(full_path)
                print(f"[+] Found: {full_path.relative_to(base)}")

    print("\n" + "=" * 70)
    print(f"Character directories found: {len(character_dirs)}")
    print(f"Mob directories found: {len(mob_dirs)}")

    if character_dirs:
        print("\n[*] Character paths:")
        for d in character_dirs[:5]:  # Show first 5
            print(f"  - {d.relative_to(base)}")

    if mob_dirs:
        print("\n[*] Mob paths:")
        for d in mob_dirs[:5]:  # Show first 5
            print(f"  - {d.relative_to(base)}")

    return character_dirs, mob_dirs

if __name__ == "__main__":
    base_path = "C:/Users/duan7/Desktop/SRObro/assets/pk2_full_extract"

    # Wait a bit for extraction to start
    print("Waiting for extraction to create files...")
    time.sleep(5)

    find_target_dirs(base_path)
