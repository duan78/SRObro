#!/usr/bin/env python3
"""
Aggressively search for XMX decompression code in Silkroad emulators
Extract and build a CLI decompression tool
"""

import subprocess
import sys
import os
import re
from pathlib import Path

def clone_repos():
    """Clone emulator repositories"""
    print("="*70)
    print("CLONE ÉMULATEURS SILKROAD")
    print("="*70)

    repos = [
        ("https://github.com/mtkedr/sro-client", "sro-client"),
        ("https://github.com/axdn/sro-client", "sro-client-axdn"),
        ("https://github.com/Dexuron/sro-client", "sro-client-dexuron"),
    ]

    base_dir = Path("C:/Users/duan7/Desktop/SRObro/temp/emulator_sources")
    base_dir.mkdir(parents=True, exist_ok=True)

    cloned = []

    for url, name in repos:
        repo_path = base_dir / name
        if repo_path.exists():
            print(f"[✓] {name}: déjà cloné")
            cloned.append(repo_path)
            continue

        print(f"[*] Clonage de {name}...")
        try:
            subprocess.run(
                ["git", "clone", "--depth", "1", url, str(repo_path)],
                check=True,
                capture_output=True,
                timeout=300000,
                cwd=str(base_dir)
            )
            print(f"[+] {name}: cloné avec succès")
            cloned.append(repo_path)
        except Exception as e:
            print(f"[!] {name}: échec - {e}")

    return cloned

def search_for_xmx_code(repos):
    """Search for XMX/JMXV decompression code"""
    print(f"\n{'='*70}")
    print("RECHERCHE ACTIVE CODE XMX")
    print(f"{'='*70}")

    search_terms = {
        'JMXV': r'JMXV|0x564D584A',  # Magic number
        'XMX': r'XMX|xmx',
        'decompression': r'decompress|Decode.*BMS|BMS.*Decode',
        'compression': r'compression|compress.*bms',
    }

    found_files = []

    for repo_path in repos:
        repo_name = repo_path.name
        print(f"\n[*] Recherche dans {repo_name}...")

        # Search in all source files
        patterns = ['*.cs', '*.cpp', '*.h', '*.c']

        for pattern in patterns:
            for file_path in repo_path.rglob(pattern):
                try:
                    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                        content = f.read()

                        # Search for each term
                        for term_name, term_pattern in search_terms.items():
                            if re.search(term_pattern, content, re.IGNORECASE):
                                if file_path not in found_files:
                                    found_files.append(file_path)

                                    # Extract relevant code snippet
                                    lines = content.split('\n')
                                    for i, line in enumerate(lines):
                                        if re.search(term_pattern, line, re.IGNORECASE):
                                            # Get context
                                            start = max(0, i-3)
                                            end = min(len(lines), i+4)

                                            print(f"\n[+] TROUVÉ: {file_path.relative_to(repo_path)}")
                                            print(f"    Terme: {term_name}")
                                            print(f"    Ligne {i}:")
                                            for j in range(start, end):
                                                print(f"      {j}: {lines[j][:100]}")
                                            break
                except:
                    pass

    return found_files

def extract_decompression_function(file_path):
    """Extract the decompression function from source file"""
    print(f"\n[*] Analyse détaillée de: {file_path}")

    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()

        # Look for decompression functions
        patterns = [
            r'(public|private|internal).*static.*\(.*BMS|.*XMX|.*JMXV',
            r'(void|function).*Decompress.*\(.*\)',
            r'class.*XMX|class.*JMXV',
        ]

        for pattern in patterns:
            matches = re.finditer(pattern, content, re.IGNORECASE)
            for match in matches:
                print(f"\n[+] Fonction trouvée: {match.group()}")
                # Get surrounding context
                start = max(0, match.start() - 200)
                end = min(len(content), match.end() + 200)
                context = content[start:end]
                print("    Context:")
                print(context)

    except Exception as e:
        print(f"[!] Erreur: {e}")

def main():
    # Clone repositories
    repos = clone_repos()

    if not repos:
        print("\n[!] Aucun dépôt cloné")
        return 1

    # Search for XMX code
    found_files = search_for_xmx_code(repos)

    if found_files:
        print(f"\n{'='*70}")
        print(f"RÉSULTAT: {len(found_files)} fichiers trouvés")
        print(f"{'='*70}")

        # Extract decompression function from first file
        for file_path in found_files[:3]:  # First 3 files
            extract_decompression_function(file_path)
    else:
        print("\n[!] Aucun code XMX trouvé")

    print(f"\n{'='*70}")
    print("PROCHAINES ÉTAPES")
    print(f"{'='*70}")

    if found_files:
        print("1. Analyser les fonctions trouvées")
        print("2. Créer un script Python standalone")
        print("3. Tester décompression sur fichier BMS")
        print("4. Intégrer dans pipeline complet")
    else:
        print("1. Essayer dépôts: https://github.com/sro-client")
        print("2. Utiliser Ghidra sur sro_client.exe")
        print("3. Chercher documentation XMX/Blowfish")

    return 0

if __name__ == "__main__":
    main()
