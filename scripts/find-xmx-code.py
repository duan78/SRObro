#!/usr/bin/env python3
"""
Find and extract XMX decompression code from Silkroad emulators
"""

import subprocess
import sys
import re
from pathlib import Path

def search_github_for_xmx():
    """Search GitHub for XMX decompression code"""

    print("="*70)
    print("RECHERCHE CODE XMX - GITHUB")
    print("="*70)

    # Search queries
    queries = [
        "silkroad xmx decompression",
        "silkroad JMXV format",
        "bms file xmx compression",
    ]

    # For now, let's try to clone and search specific repos
    repos_to_search = [
        "https://github.com/CarlosX/DarkEmu",
        "https://github.com/mtkedr/sro-client",
        "https://github.com/axdn/sro-client",
    ]

    base_dir = Path("C:/Users/duan7/Desktop/SRObro/temp")
    base_dir.mkdir(parents=True, exist_ok=True)

    search_terms = [
        r"XMX",
        r"JMXV",
        r"decompress.*bms",
        r"bms.*format",
        r"JoyMax.*compress",
    ]

    results = {}

    for repo_url in repos_to_search:
        repo_name = repo_url.split("/")[-1].replace(".git", "")
        repo_path = base_dir / repo_name

        print(f"\n[*] Clonning {repo_name}...")

        try:
            if not repo_path.exists():
                subprocess.run(
                    ["git", "clone", "--depth", "1", repo_url, str(repo_path)],
                    check=True,
                    capture_output=True,
                    timeout=180000,
                    cwd=str(base_dir)
                )
                print(f"[+] Cloned")
            else:
                print(f"[+] Already exists")

            # Search for XMX decompression code
            print(f"[*] Searching for XMX/JMXV/decompression code...")

            found_something = False

            # Search in C# files
            for cs_file in repo_path.rglob("*.cs"):
                try:
                    with open(cs_file, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()

                        for term in search_terms:
                            if re.search(term, content, re.IGNORECASE):
                                # Extract surrounding context
                                lines = content.split('\n')
                                for i, line in enumerate(lines):
                                    if re.search(term, line, re.IGNORECASE):
                                        context_start = max(0, i-2)
                                        context_end = min(len(lines), i+3)
                                        print(f"\n[+] Found in {cs_file.relative_to(repo_path)}:")
                                        print(f"    Line {i}: {line.strip()}")
                                        print(f"    Context:")
                                        for j in range(context_start, context_end):
                                            print(f"      {lines[j][:100]}")
                                        found_something = True
                                        break
                                if found_something:
                                    break
                except:
                    pass

            if found_something:
                results[repo_name] = True

        except Exception as e:
            print(f"[!] Error with {repo_name}: {e}")

    # Print summary
    print(f"\n{'='*70}")
    print("RÉSUMÉ RECHERCHE")
    print(f"{'='*70}")

    if results:
        print("[+] Code XMX trouvé dans:")
        for repo_name in results.keys():
            print(f"  - {repo_name}")
    else:
        print("[!] Aucun code XMX trouvé")
        print("\n[*] Alternatives:")
        print("    1. Utiliser IDA/Ghidra pour reverse engineer sro_client.exe")
        print("    2. Chercher dans la documentation Silkroad")
        print("    3. Contacter la communauté Silkroad (elitepvpers, ragezone)")

    return len(results) > 0

def check_emulator_formats():
    """Check what formats emulators support"""
    print(f"\n{'='*70}")
    print("FORMATS SUPPORTÉS PAR ÉMULATEURS")
    print(f"{'='*70}")

    print("[*] Recherche documentation...")

    # Check if there are any BMS parsers in the extracted code
    temp_dir = Path("C:/Users/duan7/Desktop/SRObro/temp/emulator_sources")

    if temp_dir.exists():
        print(f"\n[*] Checking cloned repos for BMS parsers...")

        for repo_dir in temp_dir.iterdir():
            if not repo_dir.is_dir():
                continue

            print(f"\n[*] Checking {repo_dir.name}...")

            # Look for BMS-related code
            for file in repo_dir.rglob("*"):
                if file.suffix in ['.cs', '.cpp', '.h']:
                    try:
                        with open(file, 'r', encoding='utf-8', errors='ignore') as f:
                            content = f.read()

                            if 'bms' in content.lower() or 'mesh' in content.lower():
                                print(f"    {file.relative_to(repo_dir)}")
                    except:
                        pass

if __name__ == "__main__":
    success = search_github_for_xmx()
    check_emulator_formats()

    print("\n" + "="*70)
    print("PROCHAINES ÉTAPES")
    print("="*70)

    if success:
        print("1. Extraire et analyser le code XMX trouvé")
        "2. Créer un wrapper Python/CLI")
        "3. Décompresser les fichiers BMS"
    else:
        print("1. Reverse engineer sro_client.exe avec Ghidra")
        "2. Identifier la routine de décompression XMX")
        "3. Créer décompresseur Python")
