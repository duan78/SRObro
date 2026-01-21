#!/usr/bin/env python3
"""
Create complete inventory of all extracted PK2 files
"""

import os
import sys
from pathlib import Path
from collections import defaultdict

def scan_directory(base_path):
    """Scan directory and count files by type"""
    stats = defaultdict(lambda: {'count': 0, 'size': 0})

    base = Path(base_path)
    if not base.exists():
        return {}

    for root, dirs, files in os.walk(base_path):
        for file in files:
            filepath = Path(root) / file
            try:
                ext = filepath.suffix.lower()
                size = filepath.stat().st_size

                stats[ext]['count'] += 1
                stats[ext]['size'] += size
            except:
                pass

    return dict(stats)

def main():
    print("="*70)
    print("INVENTAIRE COMPLET - EXTRACTIONS PK2")
    print("="*70)

    # All extraction directories
    extractions = [
        ("Data.pk2", r"C:\Users\duan7\Desktop\SRObro\assets\data_extracted"),
        ("Map.pk2", r"C:\Users\duan7\Desktop\SRObro\assets\pk2_all\Map"),
        ("Media.pk2", r"C:\Users\duan7\Desktop\SRObro\assets\pk2_all\Media"),
        ("Music.pk2", r"C:\Users\duan7\Desktop\SRObro\assets\pk2_all\Music"),
        ("Particles.pk2", r"C:\Users\duan7\Desktop\SRObro\assets\pk2_all\Particles"),
    ]

    grand_total = 0
    grand_size = 0

    for pk2_name, path in extractions:
        if not Path(path).exists():
            print(f"\n[!] {pk2_name}: Non extrait")
            continue

        print(f"\n{'='*70}")
        print(f"{pk2_name}")
        print(f"{'='*70}")

        stats = scan_directory(path)

        if not stats:
            print("Vide")
            continue

        # Sort by count
        sorted_exts = sorted(stats.items(), key=lambda x: x[1]['count'], reverse=True)

        total_files = sum(s['count'] for s in stats.values())
        total_size = sum(s['size'] for s in stats.values())

        grand_total += total_files
        grand_size += total_size

        print(f"\nTotal fichiers: {total_files:,}")
        print(f"Taille totale: {total_size/1024/1024:.1f} MB\n")

        print("Top 20 extensions:")
        for i, (ext, data) in enumerate(sorted_exts[:20], 1):
            print(f"  {i:2d}. {ext or '(sans ext)':12s} {data['count']:6,} fichiers  {data['size']/1024:8.1f} MB")

    print(f"\n{'='*70}")
    print(f"GRAND TOTAL: {grand_total:,} fichiers")
    print(f"GRAND TOTAL: {grand_size/1024/1024/1024:.2f} GB")
    print(f"{'='*70}")

if __name__ == "__main__":
    main()
