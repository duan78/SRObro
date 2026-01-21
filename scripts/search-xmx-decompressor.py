#!/usr/bin/env python3
"""
Search for XMX/JMXV decompression code in Silkroad emulators
"""

import subprocess
import sys
import os
from pathlib import Path
import re

def clone_and_search_repos():
    """Clone and search Silkroad emulator repositories"""

    repos = [
        "https://github.com/CarlosX/DarkEmu",
        "https://github.com/tanisman/SilkroadProject",
    ]

    base_dir = Path("C:/Users/duan7/Desktop/SRObro/temp/emulator_sources")
    base_dir.mkdir(parents=True, exist_ok=True)

    search_terms = [
        r"JMXV",
        r"XMX",
        r"decompress",
        r"compression",
        r"BMS.*read|read.*BMS",
        r"blowfish",
        r"joymax",
    ]

    results = {}

    for repo_url in repos:
        repo_name = repo_url.split("/")[-1]
        repo_path = base_dir / repo_name

        print(f"\n{'='*70}")
        print(f"Processing: {repo_name}")
        print(f"{'='*70}")

        # Clone repository
        if not repo_path.exists():
            print(f"[*] Cloning {repo_url}...")
            try:
                subprocess.run(
                    ["git", "clone", repo_url, str(repo_path)],
                    check=True,
                    capture_output=True,
                    timeout=300
                )
                print(f"[+] Cloned successfully")
            except Exception as e:
                print(f"[!] Clone failed: {e}")
                continue
        else:
            print(f"[*] Repository already exists")

        # Search for decompression code
        print(f"[*] Searching for XMX/JMXV decompression...")

        for root, dirs, files in os.walk(repo_path):
            # Skip binary and build directories
            dirs[:] = [d for d in dirs if d not in ['.git', 'bin', 'obj', 'Debug', 'Release', 'node_modules']]

            for file in files:
                if not file.endswith(('.cs', '.cpp', '.h', '.c', '.py')):
                    continue

                filepath = Path(root) / file
                try:
                    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()
                        line_num = 0

                        for line in content.split('\n'):
                            line_num += 1

                            # Check for search terms
                            for term in search_terms:
                                if re.search(term, content, re.IGNORECASE):
                                    if term not in results:
                                        results[term] = []

                                    results[term].append({
                                        'repo': repo_name,
                                        'file': str(filepath.relative_to(repo_path)),
                                        'line': line_num,
                                        'content': line.strip()
                                    })
                                    break
                except Exception as e:
                    pass

    # Print results
    print(f"\n{'='*70}")
    print("SEARCH RESULTS")
    print(f"{'='*70}")

    for term, matches in results.items():
        if matches:
            print(f"\n[{term}]")
            for match in matches[:10]:  # Show first 10
                print(f"  {match['repo']}/{match['file']}:{match['line']}")
                print(f"    {match['content'][:80]}")
            if len(matches) > 10:
                print(f"  ... and {len(matches) - 10} more")

    return results

def check_noesis():
    """Check if Noesis can be installed/used"""
    print(f"\n{'='*70}")
    print("NOESIS CHECK")
    print(f"{'='*70}")

    noesis_url = "https://richwhitehouse.com/"

    print("[*] Noesis is a 3D format tool that might support BMS files")
    print(f"[*] Download: {noesis_url}")
    print("[*] If you can install Noesis, try opening:")
    print("    - avatar_m_nasrun.bms")
    print("    - avata_m_amalrun.bms")
    print("[*] Then export to OBJ or FBX format")

    print("\n[+] Noesis supports many game formats")
    print("[+] Might have XMX decompression built-in")

if __name__ == "__main__":
    print("="*70)
    print("XMX DECOMPRESSION SOURCE SEARCH")
    print("="*70)

    try:
        results = clone_and_search_repos()
    except Exception as e:
        print(f"[!] Error: {e}")

    check_noesis()

    print("\n" + "="*70)
    print("NEXT STEPS")
    print("="*70)
    print("1. Review search results above")
    print("2. Download Noesis from richwhitehouse.com")
    print("3. Try opening BMS files with Noesis")
    print("4. If Noesis works, export to OBJ/FBX")
    print("5. Import OBJ/FBX into Blender")
    print("6. Export GLB with skinning")
