#!/usr/bin/env python3
"""
Alternative Solution: Direct XMX Decompression
Try multiple approaches to decompress JMXV files
"""

import sys
import subprocess
from pathlib import Path
import struct

def approach_1_check_noesis():
    """Check if Noesis can be used via CLI"""
    print("="*70)
    print("APPROCHE 1: Noesis CLI")
    print("="*70)

    # Check if Noesis is installed
    noesis_paths = [
        r"C:\Program Files\Noesis\noesis.exe",
        r"C:\Program Files (x86)\Noesis\noesis.exe",
    ]

    for path in noesis_paths:
        if Path(path).exists():
            print(f"[+] Noesis trouvé: {path}")
            print("\n[*] Noesis a une interface CLI limitée")
            print("[*] Téléchargez: https://richwhitehouse.com/")
            print("[*] Utilisation:")
            print("    noesiscli.exe input.bms --export output.fbx")
            return True

    print("[!] Noesis non trouvé")
    return False

def approach_2_simple_xor():
    """Test simple XOR decompression"""
    print("\n" + "="*70)
    print("APPROCHE 2: Test Décompression Simple")
    print("="*70)

    # Read a compressed BMS file
    bms_file = Path(r"C:\Users\duan7\Desktop\SRObro\assets\data_extracted\prim\avatar_m_nasrun.bms")

    if not bms_file.exists():
        print(f"[!] Fichier non trouvé: {bms_file}")
        return False

    print(f"[*] Analyse: {bms_file.name}")

    with open(bms_file, 'rb') as f:
        data = f.read()

    print(f"[*] Taille: {len(data):,} bytes")

    # Check magic
    magic = data[0:4]
    print(f"[*] Magic: {magic}")

    if magic != b'JMXV':
        print("[!] Pas un fichier JMXV!")
        return False

    # Try simple XOR with common keys
    print("\n[*] Test XOR décompression...")

    possible_keys = [
        b'\x00' * 4,
        b'\xFF' * 4,
        b'JMXV',
        b'JoyM',
    ]

    for key in possible_keys:
        try:
            # XOR first 1KB
            test_data = bytearray(data[:1024])
            key_bytes = bytearray(key)

            result = bytearray()
            for i, byte in enumerate(test_data):
                result.append(byte ^ key_bytes[i % len(key_bytes)])

            # Check if result looks like valid data
            # Valid BMS/BSR should have recognizable patterns
            if b'BSR\x02' in result or b'BMS\x00' in result:
                print(f"\n[+] POSSIBLE DÉCOMPRESSION AVEC CLÉ: {key}")
                print(f"    Trouvé: {result[:100]}")

                # Save decompressed test
                output = Path("C:/Users/duan7/Desktop/SRObro/test_decompressed.bin")
                output.write_bytes(result)
                print(f"    Sauvegardé: {output}")
                return True
        except:
            pass

    print("[!] XOR simple sans résultat")
    return False

def approach_3_ghidra_script():
    """Create Ghidra automation script"""
    print("\n" + "="*70)
    print("APPROCHE 3: Préparation Ghidra")
    print("="*70)

    ghidra_script = """# Ghidra Script - Search XMX Decompression
#
# Instructions:
# 1. File → Import File → sro_client.exe
# 2. Analysis → Search → For Strings → "JMXV"
# 3. Search → For Strings → "decompress"
# 4. Search → For Strings → "BMS"
# 5. Note functions found
# 6. Right-click → Decompile function
# 7. Copy decompiled code to Python

# Search strings:
# - "JMXV"
# - "XMX"
# - "decompress"
# - "Blowfish"
"""

    script_path = Path("C:/Users/duan7/Desktop/SRObro/docs/ghidra_script.txt")
    script_path.write_text(ghidra_script)

    print("[*] Script Ghidra créé")
    print(f"    Location: {script_path}")
    print("\n[*] Étapes:")
    print("    1. Télécharger Ghidra: https://ghidra-sre.org/")
    print("    2. Ouvrir: C:/Program Files (x86)/Silkroad/sro_client.exe")
    print("    3. Suivre les instructions dans le script")
    print("    4. Extraire code de décompression")
    print("    5. Me fournir le code pour création wrapper Python")

    return True

def approach_4_documentation():
    """Search for XMX format documentation"""
    print("\n" + "="*70)
    print("APPROCHE 4: Documentation Recherche")
    print("="*70)

    docs = [
        "silkroad xmx file format reverse engineering",
        "jmxv decompression algorithm source code",
        "joymax xmx bms compression format",
    ]

    print("[*] Termes de recherche:")
    for doc in docs:
        print(f"    - {doc}")

    print("\n[*] Sites à consulter:")
    print("    - elitepvpers.com (Silkroad section)")
    print("    - ragezone.com (Silkroad Online)")
    print("    - unknowncheats.ru (file formats)")
    print("    - fileformats.archivedmirror.info")

    return True

def main():
    print("="*70)
    print("SOLUTIONS ALTERNATIVES - DÉCOMPRESSION XMX")
    print("="*70)
    print("\n[*] Tous les modèles 3D sont compressés JMXV")
    print("[*] 24,880 fichiers BMS/BSR à décompresser")
    print("[*] Tests approches alternatives en cours...\n")

    approaches = [
        ("Noesis CLI", approach_1_check_noesis),
        ("XOR Simple", approach_2_simple_xor),
        ("Ghidra", approach_3_ghidra_script),
        ("Documentation", approach_4_documentation),
    ]

    results = {}
    for name, func in approaches:
        try:
            results[name] = func()
        except Exception as e:
            print(f"\n[!] {name}: Erreur - {e}")
            results[name] = False

    print("\n" + "="*70)
    print("RÉSUMÉ")
    print("="*70)

    for name, success in results.items():
        status = "[+]" if success else "[!]"
        print(f"{status} {name}")

    print("\n" + "="*70)
    print("RECOMMANDATION IMMÉDIATE")
    print("="*70)

    print("[*] OPTION 1 (Plus rapide):")
    print("    1. Télécharger Noesis: https://richwhitehouse.com/")
    print("    2. Installer et ouvrir un fichier BMS")
    print("    3. Exporter vers FBX/OBJ")
    print("    4. Importer dans Blender")
    print("    5. Exporter GLB avec skinning")

    print("\n[*] OPTION 2 (Plus robuste):")
    print("    1. Suivre script Ghidra créé")
    print("    2. Extraire code décompression XMX")
    print("    3. Créer décompresseur Python standalone")
    print("    4. Intégrer dans pipeline")

    print("\n[*] OPTION 3 (Alternative):")
    print("    Utiliser modèles 3D alternatifs (Mixamo, Sketchfab)")
    print("    Convertir déjà en format standard avec skinning")

    return 0

if __name__ == "__main__":
    sys.exit(main())
