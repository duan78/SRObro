#!/usr/bin/env python3
"""
Check batch conversion progress
"""

import os
import sys
from pathlib import Path

PROJECT_DIR = Path(r"C:/Users/duan7/Desktop/SRObro")
OUTPUT_DIR = PROJECT_DIR / "assets/glb Converted"
LOG_FILE = PROJECT_DIR / "logs/conversion.log"

def count_glb_files():
    """Count converted GLB files"""
    if not OUTPUT_DIR.exists():
        return 0
    return len(list(OUTPUT_DIR.rglob("*.glb")))

def get_log_tail(lines=50):
    """Get last N lines from log"""
    if not LOG_FILE.exists():
        return ["Log file not found yet"]

    try:
        with open(LOG_FILE, 'r', encoding='utf-8', errors='ignore') as f:
            all_lines = f.readlines()
            return all_lines[-lines:] if len(all_lines) > lines else all_lines
    except Exception as e:
        return [f"Error reading log: {e}"]

def main():
    print("="*70)
    print("CONVERSION PROGRESS CHECK")
    print("="*70)

    # Count GLB files
    glb_count = count_glb_files()

    print(f"\n[*] GLB files converted: {glb_count:,}")
    print(f"[*] Output directory: {OUTPUT_DIR}")
    print(f"[*] Total BMS files: 17,599")
    print(f"[*] Progress: {glb_count/17599*100:.2f}%")

    # Show log tail
    print(f"\n[*] Recent log output:")
    print("-"*70)

    log_lines = get_log_tail(20)
    for line in log_lines:
        print(line.rstrip())

    print("-"*70)
    print(f"\n[*] Full log: {LOG_FILE}")
    print("[*] Monitor with: tail -f logs/conversion.log (Linux/Git Bash)")
    print("[*] Or: python scripts/check-progress.py")

if __name__ == "__main__":
    main()
