#!/usr/bin/env python3
"""
Batch import Silkroad JMXV files and export to GLB
Uses szabo176's Silkroad JMX Importer plugin (version 4.5.3)
Full CLI solution for converting BMS+BSK+BMT+DDJ to GLB with skinning
"""

import subprocess
import sys
import os
import tempfile
from pathlib import Path

# Blender installation
BLENDER_PATH = r"C:\Program Files\Blender Foundation\Blender 5.0\blender.exe"

# Project paths
PROJECT_DIR = Path(r"C:/Users/duan7/Desktop/SRObro")
ASSETS_DIR = PROJECT_DIR / "assets/data_extracted"
OUTPUT_DIR = PROJECT_DIR / "assets/glb Converted"

# Complete plugin code (szabo176 v4.5.3 adapted for CLI)
PLUGIN_CODE = '''bl_info = {
    "name": "Silkroad JMX Importer (CLI Batch)",
    "author": "szabo176 (adapted for CLI by Claude)",
    "version": (4, 5, 3),
    "blender": (4, 1, 0),
    "location": "View3D Sidebar > Silkroad",
    "description": "Imports BMS models with BMT/DDJ support, and BSK skeletons with automatic rigging.",
    "category": "Import-Export"
}

import bpy
import os
import struct
import tempfile
import io
import math
import bmesh

try:
    from PIL import Image
    PILLOW_OK = True
except ImportError:
    PILLOW_OK = False

from mathutils import Matrix, Quaternion, Vector

# Helper functions
def read_int(f): return int.from_bytes(f.read(4), 'little')
def read_short(f): return int.from_bytes(f.read(2), 'little')
def read_byte(f): return int.from_bytes(f.read(1), 'little')
def read_float(f): return struct.unpack('<f', f.read(4))[0]
def read_color4(f): return struct.unpack('<4f', f.read(16))
def read_str(f):
    str_len = read_int(f)
    if str_len <= 0: return ""
    str_bytes = f.read(str_len)
    try: return str_bytes.decode("cp949")
    except UnicodeDecodeError: return str_bytes.decode("utf-8", errors='ignore')

# DDJ to PNG conversion
def convert_ddj_to_png(ddj_path):
    if not PILLOW_OK:
        print("[WARNING] Pillow not installed, skipping DDJ conversion")
        return None
    try:
        with open(ddj_path, 'rb') as f:
            f.seek(20)
            dds_data = f.read()
        image = Image.open(io.BytesIO(dds_data))
        temp_png_path = os.path.join(tempfile.gettempdir(), os.path.basename(ddj_path) + ".png")
        image.save(temp_png_path, 'PNG')
        return temp_png_path
    except Exception as e:
        print(f"[ERROR] DDJ conversion failed: {e}")
        return None

# BMT Parser
def read_bmt_file(bmt_filepath):
    if not bmt_filepath or not os.path.exists(bmt_filepath):
        return {}
    materials = {}
    print(f"[LOG] Reading BMT: {os.path.basename(bmt_filepath)}")
    try:
        with open(bmt_filepath, 'rb') as f:
            if f.read(7) != b"JMXVBMT":
                print("[ERROR] Invalid BMT signature")
                return {}
            f.read(5)
            count = read_int(f)
            print(f" -> {count} materials in BMT")
            for _ in range(count):
                mat_name = read_str(f)
                props = {
                    'name': mat_name,
                    'diffuse': read_color4(f),
                    'ambient': read_color4(f),
                    'specular': read_color4(f),
                    'emissive': read_color4(f),
                    'shininess': read_float(f),
                    'flags': read_int(f),
                    'texture': None,
                    'normal_map': None
                }
                if props['flags'] & 0x100:
                    props['texture'] = read_str(f)
                    f.read(4); f.read(1); f.read(1); f.read(1)
                if props['flags'] & 0x2000:
                    props['normal_map'] = read_str(f)
                    f.read(4)
                materials[mat_name] = props
                print(f" -> Material '{mat_name}' loaded")
    except Exception as e:
        print(f"[ERROR] BMT read error: {e}")
    return materials

# BSK Parser
def read_bsk_file(bsk_filepath):
    if not bsk_filepath or not os.path.exists(bsk_filepath):
        return None
    bones_data = []
    print(f"[LOG] Reading BSK: {os.path.basename(bsk_filepath)}")
    try:
        with open(bsk_filepath, 'rb') as f:
            if f.read(7) != b"JMXVBSK":
                print("[ERROR] Invalid BSK signature")
                return None
            f.read(5)
            bone_count = read_int(f)
            print(f" [LOG] Reading {bone_count} bones...")
            for i in range(bone_count):
                f.read(1)
                bone_name = read_str(f)
                parent_name = read_str(f)
                f.read(16 + 12)
                rot_abs = struct.unpack('<4f', f.read(16))
                pos_abs = struct.unpack('<3f', f.read(12))
                f.seek(16 + 12, 1)
                child_count = read_int(f)
                for _ in range(child_count):
                    read_str(f)
                bones_data.append({"name": bone_name, "parent": parent_name, "pos": pos_abs, "rot": rot_abs})
                print(f" -> Bone {i+1}/{bone_count}: {bone_name} (Parent: {parent_name or 'None'})")
    except Exception as e:
        print(f"[ERROR] BSK read error: {e}")
    return bones_data

# Create Armature
def create_armature(name, bones_data):
    print("[LOG] Creating armature...")
    armature_data = bpy.data.armatures.new(name=name + "_Armature")
    armature_obj = bpy.data.objects.new(armature_data.name, armature_data)
    bpy.context.collection.objects.link(armature_obj)
    bpy.context.view_layer.objects.active = armature_obj
    bpy.ops.object.mode_set(mode='EDIT')

    blender_bones = {}
    for bone_info in bones_data:
        bl_bone = armature_data.edit_bones.new(name=bone_info['name'])
        blender_bones[bone_info['name']] = bl_bone

    for bone_info in bones_data:
        bl_bone = blender_bones[bone_info['name']]
        if bone_info['parent'] and bone_info['parent'] in blender_bones:
            bl_bone.parent = blender_bones[bone_info['parent']]

        sro_quat = Quaternion((bone_info['rot'][3], bone_info['rot'][0], bone_info['rot'][1], bone_info['rot'][2]))
        sro_pos = Vector(bone_info['pos'])
        bl_bone.matrix = Matrix.Translation(sro_pos) @ sro_quat.to_matrix().to_4x4()

    bpy.ops.object.mode_set(mode='OBJECT')
    print(f" [LOG] Armature created: {armature_obj.name}")
    return armature_obj

# Main import function
def import_silkroad_model(bms_path, bmt_path=None, bsk_path=None, texture_path_default=None):
    print(f"\\n{'='*70}")
    print(f"Importing: {os.path.basename(bms_path)}")
    print(f"{'='*70}")

    if not os.path.exists(bms_path):
        print(f"[ERROR] BMS file not found: {bms_path}")
        return False

    # Find related files
    base_dir = os.path.dirname(bms_path)
    base_name = os.path.splitext(os.path.basename(bms_path))[0]

    if not bmt_path:
        bmt_candidate = os.path.join(base_dir, base_name + '.bmt')
        bmt_path = bmt_candidate if os.path.exists(bmt_candidate) else None

    if not bsk_path:
        bsk_candidate = os.path.join(base_dir, base_name + '.bsk')
        bsk_path = bsk_candidate if os.path.exists(bsk_candidate) else None

    if not texture_path_default:
        ddj_candidate = os.path.join(base_dir, base_name + '.ddj')
        texture_path_default = ddj_candidate if os.path.exists(ddj_candidate) else None

    try:
        bmt_data = read_bmt_file(bmt_path) if bmt_path else {}
        bones_data = read_bsk_file(bsk_path) if bsk_path else None

        verts, normals, uvs, faces, bones, weights = [], [], [], [], [], []
        mesh_name_from_bms, mat_name_from_bms = "", ""

        print(f"[LOG] Reading BMS: {os.path.basename(bms_path)}")
        with open(bms_path, 'rb') as f:
            if f.read(7) != b"JMXVBMS":
                raise ValueError("Invalid BMS signature (not JMXVBMS)")
            f.read(5)
            header_offsets = struct.unpack('<10I', f.read(40))
            header = {
                "vertex_offset": header_offsets[0],
                "skin_offset": header_offsets[1],
                "face_offset": header_offsets[2]
            }
            print(f" -> Vertex offset: {header['vertex_offset']}, Skin offset: {header['skin_offset']}, Face offset: {header['face_offset']}")

            f.read(8)
            vertex_flag = read_int(f)
            f.read(4)
            mesh_name_from_bms, mat_name_from_bms = read_str(f), read_str(f)
            f.read(4)

            f.seek(header["vertex_offset"])
            vcount = read_int(f)
            print(f" [LOG] Reading {vcount} vertices...")
            for _ in range(vcount):
                verts.append(struct.unpack('<3f', f.read(12)))
                normals.append(struct.unpack('<3f', f.read(12)))
                uvs.append(struct.unpack('<2f', f.read(8)))
                if vertex_flag & 0x400: f.read(8)
                if vertex_flag & 0x800: f.read(36)
                f.read(12)
            print(f" -> {len(verts)} positions, {len(normals)} normals, {len(uvs)} UVs")

            f.seek(header["face_offset"])
            fcount = read_int(f)
            print(f" [LOG] Reading {fcount} faces...")
            faces = [tuple(reversed(tuple(read_short(f) for _ in range(3)))) for _ in range(fcount)]
            print(f" -> {len(faces)} faces")

            if header["skin_offset"] > 0:
                f.seek(header["skin_offset"])
                bcount = read_int(f)
                if bcount > 0:
                    print(f" [LOG] Reading {bcount} bones and weights...")
                    bones = [read_str(f) for _ in range(bcount)]
                    print(f" -> Mesh bones: {', '.join(bones)}")
                    for _ in range(vcount):
                        bi1, bw1, bi2, bw2 = read_byte(f), read_short(f), read_byte(f), read_short(f)
                        total = bw1 + bw2 if (bw1 + bw2) > 0 else 1.0
                        weights.append((bi1, bw1/total, bi2, bw2/total))
                    print(f" -> Weights for {len(weights)} vertices")

        # Create mesh
        base_name = mesh_name_from_bms or base_name
        mesh = bpy.data.meshes.new(base_name + '_Mesh')
        mesh_obj = bpy.data.objects.new(base_name + "_Mesh", mesh)
        bpy.context.collection.objects.link(mesh_obj)

        mesh.from_pydata(verts, [], faces)
        mesh.update()

        if normals:
            mesh.normals_split_custom_set_from_vertices(normals)
            mesh.shade_smooth()
            print(" [LOG] Custom normals applied")

        # UVs
        bm = bmesh.new()
        bm.from_mesh(mesh)
        uv_layer = bm.loops.layers.uv.verify()
        for face in bm.faces:
            for loop in face.loops:
                loop[uv_layer].uv = (uvs[loop.vert.index][0], 1.0 - uvs[loop.vert.index][1])
        bm.to_mesh(mesh)
        bm.free()
        print(" [LOG] UV map created")

        # Armature
        armature_obj = None
        if bones_data:
            armature_obj = create_armature(base_name, bones_data)

        bpy.context.view_layer.objects.active = mesh_obj

        # Vertex groups / Skinning
        if bones and weights:
            print(f" [LOG] Creating vertex groups and weights...")
            for b_name in bones:
                mesh_obj.vertex_groups.new(name=b_name)
            for i, w in enumerate(weights):
                bi1, bw1, bi2, bw2 = w
                if bw1 > 0.001 and bi1 < len(bones):
                    mesh_obj.vertex_groups[bones[bi1]].add([i], bw1, 'REPLACE')
                if bw2 > 0.001 and bi2 < len(bones):
                    mesh_obj.vertex_groups[bones[bi2]].add([i], bw2, 'ADD')

            if armature_obj:
                modifier = mesh_obj.modifiers.new(name='Armature', type='ARMATURE')
                modifier.object = armature_obj
                print(f" [LOG] Skinning applied successfully")

        # Materials
        print("[LOG] Creating material...")
        mat_props = bmt_data.get(mat_name_from_bms) if bmt_data else None
        final_mat_name = (mat_props.get('name') if mat_props else mat_name_from_bms) or "Material"
        mat = bpy.data.materials.new(name=final_mat_name)
        mat.use_nodes = True
        mesh_obj.data.materials.append(mat)

        nodes, links = mat.node_tree.nodes, mat.node_tree.links
        bsdf = nodes.get("Principled BSDF")
        if not bsdf:
            bsdf = nodes.new("ShaderNodeBsdfPrincipled")
        output = nodes.new("ShaderNodeOutputMaterial")
        links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

        # Textures
        def find_texture(texture_name, default_path):
            if not texture_name:
                return default_path
            candidate = os.path.join(os.path.dirname(bmt_path), texture_name) if bmt_path else None
            if candidate and os.path.exists(candidate):
                return candidate
            candidate = os.path.join(base_dir, texture_name)
            if os.path.exists(candidate):
                return candidate
            return default_path

        diffuse_tex_name = mat_props.get('texture') if mat_props else None
        diffuse_path = find_texture(diffuse_tex_name, texture_path_default)

        if diffuse_path and os.path.exists(diffuse_path) and diffuse_path.lower().endswith('.ddj'):
            png_path = convert_ddj_to_png(diffuse_path)
            if png_path:
                tex_node = nodes.new("ShaderNodeTexImage")
                tex_node.image = bpy.data.images.load(png_path)
                links.new(bsdf.inputs['Base Color'], tex_node.outputs['Color'])
                if mat_props and mat_props['flags'] & 0x200:
                    mat.blend_method = 'BLEND'
                    if hasattr(mat, "eevee"):
                        mat.eevee.shadow_method = 'HASHED'
                print(f" -> Diffuse texture loaded: {os.path.basename(png_path)}")

        # Rotation
        mesh_obj.rotation_euler[0] = math.radians(-90)

        print(f"[SUCCESS] Imported: {base_name}")
        return True

    except Exception as e:
        print(f"[ERROR] Import failed: {e}")
        import traceback
        traceback.print_exc()
        return False

# Export to GLB
def export_to_glb(output_path):
    print(f"[LOG] Exporting to GLB: {output_path}")
    try:
        bpy.ops.export_scene.gltf(
            filepath=output_path,
            export_format='GLB',
            use_selection=True,  # Blender 5.0: use_selection instead of export_selected
            export_texcoords=True,
            export_normals=True,
            export_tangents=True,
            export_skins=True,  # CRITICAL: Include skinning!
            export_morph=False,
        )
        print(f"[SUCCESS] Exported: {output_path}")
        return True
    except Exception as e:
        print(f"[ERROR] Export failed: {e}")
        return False

# CLI Handler
if __name__ == "__main__":
    import sys

    # Expect args: bms_path [bmt_path] [bsk_path] [texture_path] [output_glb]
    if len(sys.argv) < 2:
        print("Usage: blender -b -P this_script.py -- bms_path [bmt_path] [bsk_path] [texture_path] [output_glb]")
        sys.exit(1)

    # Parse args (skip blender args)
    try:
        dash_idx = sys.argv.index("--")
    except ValueError:
        print("[ERROR] No '--' separator found in arguments")
        sys.exit(1)

    args = sys.argv[dash_idx + 1:]

    bms_path = args[0] if len(args) > 0 else None
    bmt_path = args[1] if len(args) > 1 else None
    bsk_path = args[2] if len(args) > 2 else None
    texture_path = args[3] if len(args) > 3 else None
    output_glb = args[4] if len(args) > 4 else None

    if not bms_path:
        print("[ERROR] No BMS path provided")
        sys.exit(1)

    # Clear scene
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete()

    # Import
    if import_silkroad_model(bms_path, bmt_path, bsk_path, texture_path):
        if output_glb:
            # Select imported objects
            bpy.ops.object.select_all(action='DESELECT')
            for obj in bpy.context.scene.objects:
                obj.select_set(True)
            export_to_glb(output_glb)
            sys.exit(0)
        else:
            print("[INFO] No output path specified, skipping export")
            sys.exit(0)
    else:
        sys.exit(1)
'''

def import_single_file(bms_path: Path):
    """Import a single BMS file and export to GLB"""
    rel_path = bms_path.relative_to(ASSETS_DIR)
    output_path = OUTPUT_DIR / rel_path.with_suffix('.glb')
    output_path.parent.mkdir(parents=True, exist_ok=True)

    # Find related files
    base_dir = bms_path.parent
    base_name = bms_path.stem
    bmt_path = base_dir / f"{base_name}.bmt"
    bsk_path = base_dir / f"{base_name}.bsk"
    ddj_path = base_dir / f"{base_name}.ddj"

    bmt_arg = str(bmt_path) if bmt_path.exists() else ""
    bsk_arg = str(bsk_path) if bsk_path.exists() else ""
    ddj_arg = str(ddj_path) if ddj_path.exists() else ""

    # Create temp plugin file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(PLUGIN_CODE)
        plugin_path = f.name

    try:
        # Run Blender with plugin
        cmd = [
            BLENDER_PATH,
            '-b',  # Background mode
            '-P', plugin_path,
            '--',
            str(bms_path),
            bmt_arg,
            bsk_arg,
            ddj_arg,
            str(output_path)
        ]

        print(f"[*] Processing: {rel_path}")
        result = subprocess.run(
            cmd,
            capture_output=True,
            text=True,
            timeout=120
        )

        if result.returncode == 0:
            print(f"[+] Success: {output_path.relative_to(PROJECT_DIR)}")
            return True
        else:
            print(f"[-] Failed: {rel_path}")
            if result.stdout:
                print("STDOUT:", result.stdout[-500:] if len(result.stdout) > 500 else result.stdout)
            if result.stderr:
                print("STDERR:", result.stderr[-500:] if len(result.stderr) > 500 else result.stderr)
            return False

    except subprocess.TimeoutExpired:
        print(f"[!] Timeout: {rel_path}")
        return False
    except Exception as e:
        print(f"[!] Error: {e}")
        return False
    finally:
        try:
            os.unlink(plugin_path)
        except:
            pass

def main():
    print("="*70)
    print("BATCH IMPORT SILKROAD MODELS - CLI")
    print("="*70)

    # Check Blender exists
    if not Path(BLENDER_PATH).exists():
        print(f"[!] Blender not found at: {BLENDER_PATH}")
        print("[?] Please install Blender or update BLENDER_PATH in script")
        return 1

    print(f"[+] Blender found: {BLENDER_PATH}")
    print(f"[+] Assets directory: {ASSETS_DIR}")
    print(f"[+] Output directory: {OUTPUT_DIR}")

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all BMS files
    bms_files = list(ASSETS_DIR.rglob("*.bms"))

    print(f"\\n[*] Found {len(bms_files):,} BMS files")
    print("[*] Starting batch import...\\n")

    success_count = 0
    fail_count = 0

    for i, bms_file in enumerate(bms_files, 1):
        if import_single_file(bms_file):
            success_count += 1
        else:
            fail_count += 1

        # Progress
        if i % 10 == 0:
            print(f"\\n[*] Progress: {i}/{len(bms_files)} ({success_count} success, {fail_count} failed)\\n")

    print(f"\\n{'='*70}")
    print(f"BATCH COMPLETE")
    print(f"{'='*70}")
    print(f"Total: {len(bms_files):,}")
    print(f"Success: {success_count:,}")
    print(f"Failed: {fail_count:,}")
    print(f"Output: {OUTPUT_DIR}")

    return 0

if __name__ == "__main__":
    sys.exit(main())
