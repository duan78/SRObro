#!/usr/bin/env python3
"""
Extract ALL PK2 files from Silkroad directory
100% CLI automation using pk2_mate
"""

import subprocess
import sys
from pathlib import Path
import time

# Configuration
SILKROAD_DIR = r"C:\Program Files (x86)\Silkroad"
ASSETS_DIR = r"C:\Users\duan7\Desktop\SRObro\assets\pk2_all"
PK2_MATE = r"C:\Users\duan7\Desktop\SRObro\tools\veykril-pk2\target\release\pk2_mate.exe"

# All PK2 files to extract
PK2_FILES = [
    # ("Data.pk2", 3.0),  # Already extracted
    ("Map.pk2", 1.3),
    ("Media.pk2", 0.884),
    ("Music.pk2", 0.069),
    ("Particles.pk2", 0.168),
]

def extract_pk2(pk2_name, size_gb):
    """Extract a single PK2 file"""
    pk2_path = Path(SILKROAD_DIR) / pk2_name
    output_dir = Path(ASSETS_DIR) / pk2_name.replace('.pk2', '')

    if not pk2_path.exists():
        print(f"[!] File not found: {pk2_path}")
        return False

    print(f"\n{'='*70}")
    print(f"EXTRACTING: {pk2_name} ({size_gb} GB)")
    print(f"{'='*70}")
    print(f"Source: {pk2_path}")
    print(f"Output: {output_dir}")
    print(f"[*] Starting extraction...")

    start_time = time.time()

    try:
        result = subprocess.run(
            [PK2_MATE, 'extract',
             '--archive', str(pk2_path),
             '--out', str(output_dir)],
            capture_output=True,
            text=True,
            timeout=7200  # 2 hours timeout
        )

        elapsed = time.time() - start_time

        if result.returncode == 0:
            print(f"[+] Extraction completed in {elapsed/60:.1f} minutes")

            # Count extracted files
            if output_dir.exists():
                file_count = sum(1 for _ in output_dir.rglob('*') if _.is_file())
                print(f"[+] Files extracted: {file_count:,}")

            return True
        else:
            print(f"[!] Extraction failed!")
            print(f"    Error: {result.stderr}")
            return False

    except subprocess.TimeoutExpired:
        print(f"[!] Extraction timed out after 2 hours")
        return False
    except Exception as e:
        print(f"[!] Error: {e}")
        return False

def main():
    print("="*70)
    print("COMPLETE PK2 EXTRACTION - ALL FILES")
    print("="*70)
    print(f"Silkroad Directory: {SILKROAD_DIR}")
    print(f"Output Directory: {ASSETS_DIR}")
    print(f"PK2 Mate: {PK2_MATE}")
    print()

    # Create output directory
    Path(ASSETS_DIR).mkdir(parents=True, exist_ok=True)

    # Check pk2_mate exists
    if not Path(PK2_MATE).exists():
        print(f"[!] pk2_mate not found: {PK2_MATE}")
        print("[!] Please build it first:")
        print("    cd tools/veykril-pk2")
        print("    cargo build --release -p pk2_mate")
        return 1

    # Extract each PK2
    results = {}
    total_size = 0

    for pk2_name, size_gb in PK2_FILES:
        success = extract_pk2(pk2_name, size_gb)
        results[pk2_name] = success
        total_size += size_gb

        if not success:
            print(f"\n[!] Stopping due to error")
            break

    # Summary
    print(f"\n{'='*70}")
    print("EXTRACTION SUMMARY")
    print(f"{'='*70}")

    for pk2_name, success in results.items():
        status = "[+]" if success else "[!]"
        print(f"{status} {pk2_name}")

    extracted = sum(1 for v in results.values() if v)
    total = len(results)

    print(f"\nTotal: {extracted}/{total} files extracted")
    print(f"Total size: {total_size:.2f} GB")

    if extracted == total:
        print("\n[+] ALL EXTRACTIONS SUCCESSFUL!")
        return 0
    else:
        print(f"\n[!] {total - extracted} extraction(s) failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())
