"""
Conversion massive de BMS/BSK en GLB avec Blender
Utilise le plugin silkroad-blender-importer avec Pillow installé
"""

import bpy
import os
import sys
from pathlib import Path
import struct
import time

# Configuration
SOURCE_DIR = Path("C:/Users/duan7/Desktop/SRObro/assets/pk2_data")
OUTPUT_DIR = Path("C:/Users/duan7/Desktop/SRObro/assets/glb_all")
BLENDER_ADDON = Path("C:/Users/duan7/AppData/Roaming/Blender Foundation/Blender 5.0/scripts/addons/silkroad-blender-importer.py")

# Mapping des squelettes
SKELETON_MAP = {
    "avatar_m": "prim/skel/char/europe/europeman_skel.bsk",
    "avatar_w": "prim/skel/char/europe/europewoman_skel.bsk",
    "chinaman": "prim/skel/char/china/chinaman_skel.bsk",
    "chinawoman": "prim/skel/char/china/chinawoman_skel.bsk",
    "mob": "prim/skel/mob/standard_skel.bsk",
    "npc": "prim/skel/npc/standard_skel.bsk",
}

def find_skeleton_for_bms(bms_path: Path) -> Path:
    """Trouve le squelette approprié pour un fichier BMS"""
    bms_name = bms_path.stem.lower()

    for pattern, skel_path in SKELETON_MAP.items():
        if pattern in bms_name:
            return SOURCE_DIR / skel_path

    # Défaut: squelette européen homme
    return SOURCE_DIR / SKELETON_MAP["avatar_m"]

def find_all_bms(directory: Path) -> list[Path]:
    """Trouve tous les fichiers BMS récursivement"""
    bms_files = []

    for ext in ['*.bms', '*.BMS']:
        bms_files.extend(directory.rglob(ext))

    return sorted(bms_files)

def convert_single_file(bms_path: Path, output_path: Path) -> tuple[bool, str]:
    """Convertit un seul fichier BMS en GLB"""
    try:
        # Nettoyer la scène
        bpy.ops.object.select_all(action='SELECT')
        bpy.ops.object.delete()

        # Trouver le squelette
        bsk_path = find_skeleton_for_bms(bms_path)

        # Configurer les chemins dans la scène
        bpy.context.scene.sro_props.import_bms_filepath = str(bms_path)
        bpy.context.scene.sro_props.import_bsk_filepath = str(bsk_path)

        # Exécuter l'import
        result = bpy.ops.silkroad.import_bms()

        if result != {'FINISHED'}:
            return False, "Import failed"

        # Créer le dossier de sortie
        output_path.parent.mkdir(parents=True, exist_ok=True)

        # Sélectionner tous les objets
        bpy.ops.object.select_all(action='SELECT')

        # Exporter en GLB
        bpy.ops.export_scene.gltf(
            filepath=str(output_path),
            export_format='GLB',
            export_skins=True,
            export_texcoords=True,
            export_normals=True,
            export_tangents=False
        )

        # Vérifier la sortie
        if output_path.exists() and output_path.stat().st_size > 1000:
            return True, ""
        else:
            return False, "Output file too small"

    except Exception as e:
        return False, str(e)

def main():
    print("\n" + "=" * 60)
    print("SRObro - Conversion Massive BMS → GLB")
    print("=" * 60)
    print(f"\nSource: {SOURCE_DIR}")
    print(f"Output: {OUTPUT_DIR}")
    print()

    # Trouver tous les fichiers BMS
    print("🔍 Recherche des fichiers BMS...")
    bms_files = find_all_bms(SOURCE_DIR)

    if not bms_files:
        print("❌ Aucun fichier BMS trouvé !")
        print(f"   Vérifiez que Data.pk2 a été extrait dans: {SOURCE_DIR}")
        return

    print(f"✅ {len(bms_files)} fichiers BMS trouvés")
    print()

    # Créer le dossier de sortie
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Statistiques
    success_count = 0
    fail_count = 0
    skipped_count = 0
    start_time = time.time()

    # Convertir les fichiers
    for i, bms_path in enumerate(bms_files):
        relative_path = bms_path.relative_to(SOURCE_DIR)
        output_path = OUTPUT_DIR / relative_path.with_suffix('.glb')

        # Skip si déjà converti
        if output_path.exists() and output_path.stat().st_size > 1000:
            skipped_count += 1
            if skipped_count <= 10 or i % 1000 == 0:
                print(f"[{i+1}/{len(bms_files)}] {bms_path.name} - ⏭️  Skip")
            continue

        print(f"\n[{i+1}/{len(bms_files)}] {bms_path.name}")
        print(f"   Skeleton: {find_skeleton_for_bms(bms_path).name}")

        success, error = convert_single_file(bms_path, output_path)

        if success:
            success_count += 1
            print(f"   ✅ Success")
        else:
            fail_count += 1
            print(f"   ❌ Failed: {error}")

    # Rapport final
    duration = time.time() - start_time

    print("\n" + "=" * 60)
    print("RAPPORT DE CONVERSION")
    print("=" * 60)
    print(f"Total:      {len(bms_files)}")
    print(f"⏭️  Skipped:   {skipped_count}")
    print(f"✅ Success:   {success_count}")
    print(f"❌ Failed:    {fail_count}")
    print(f"⏱️  Duration:  {duration:.1f}s ({duration/60:.1f} minutes)")
    print(f"\n📁 Output: {OUTPUT_DIR}\n")

if __name__ == "__main__":
    main()
