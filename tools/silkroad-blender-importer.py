bl_info = {
    "name": "Silkroad JMX Importer (Community Final)",
    "author": "szabo176",
    "version": (4, 5, 3),
    "blender": (4, 1, 0),
    "location": "View3D Sidebar > Silkroad",
    "description": "Imports BMS models with BMT/DDJ support, and BSK skeletons with automatic rigging.",
    "category": "Import-Export"
}

import bpy
import os
import bmesh
import struct
import tempfile
import io
import math

try:
    from PIL import Image
    PILLOW_OK = True
except ImportError:
    PILLOW_OK = False

from bpy.props import StringProperty, PointerProperty
from bpy.types import Operator, Panel, PropertyGroup
from mathutils import Matrix, Quaternion, Vector

# --- Helper functions ---
def read_int(f):
    return int.from_bytes(f.read(4), 'little')

def read_short(f):
    return int.from_bytes(f.read(2), 'little')

def read_byte(f):
    return int.from_bytes(f.read(1), 'little')

def read_float(f):
    return struct.unpack('<f', f.read(4))[0]

def read_color4(f):
    return struct.unpack('<4f', f.read(16))

def read_str(f):
    str_len = read_int(f)
    if str_len <= 0:
        return ""
    str_bytes = f.read(str_len)
    try:
        return str_bytes.decode("cp949")
    except UnicodeDecodeError:
        return str_bytes.decode("utf-8", errors='ignore')

# --- Image processing ---
def convert_ddj_to_png(ddj_path):
    if not PILLOW_OK:
        raise ImportError("Pillow (PIL) library is required for DDJ conversion.")
    try:
        with open(ddj_path, 'rb') as f:
            f.seek(20)
            dds_data = f.read()
            image = Image.open(io.BytesIO(dds_data))
            temp_png_path = os.path.join(tempfile.gettempdir(), os.path.basename(ddj_path) + ".png")
            image.save(temp_png_path, 'PNG')
            return temp_png_path
    except Exception as e:
        print(f"DDJ -> PNG conversion error: {e}")
        return None

# --- BMT Parser ---
def read_bmt_file(bmt_filepath):
    if not bmt_filepath or not os.path.exists(bmt_filepath):
        return {}
    materials = {}
    print(f"[LOG] Opening BMT file: {os.path.basename(bmt_filepath)}")
    try:
        with open(bmt_filepath, 'rb') as f:
            if f.read(7) != b"JMXVBMT":
                print(" [ERROR] Invalid BMT signature.")
                return {}
            f.read(5)
            count = read_int(f)
            print(f" -> Materials in BMT: {count}")
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
                    f.read(4)
                    f.read(1)
                    f.read(1)
                    f.read(1)
                if props['flags'] & 0x2000:
                    props['normal_map'] = read_str(f)
                    f.read(4)
                materials[mat_name] = props
                print(f" -> '{mat_name}' material loaded.")
    except Exception as e:
        print(f"Error reading BMT file: {e}")
    return materials

# --- BSK Parser ---
def read_bsk_file(bsk_filepath):
    if not bsk_filepath or not os.path.exists(bsk_filepath):
        return None
    bones_data = []
    print(f"[LOG] Opening BSK file: {os.path.basename(bsk_filepath)}")
    try:
        with open(bsk_filepath, 'rb') as f:
            if f.read(7) != b"JMXVBSK":
                print(" [ERROR] Invalid BSK signature.")
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
                bones_data.append({
                    "name": bone_name,
                    "parent": parent_name,
                    "pos": pos_abs,
                    "rot": rot_abs
                })
                print(f" -> Bone loaded ({i+1}/{bone_count}): {bone_name} (Parent: {parent_name or 'None'})")
    except Exception as e:
        print(f"Error reading BSK file: {e}")
        return None
    return bones_data

# --- Armature Builder ---
def create_armature(name, bones_data, context):
    print("[LOG] Creating armature...")
    armature_data = bpy.data.armatures.new(name=name + "_Armature")
    armature_obj = bpy.data.objects.new(armature_data.name, armature_data)
    context.collection.objects.link(armature_obj)
    context.view_layer.objects.active = armature_obj
    bpy.ops.object.mode_set(mode='EDIT')

    blender_bones = {}
    for bone_info in bones_data:
        bl_bone = armature_data.edit_bones.new(name=bone_info['name'])
        blender_bones[bone_info['name']] = bl_bone

    for bone_info in bones_data:
        bl_bone = blender_bones[bone_info['name']]
        if bone_info['parent'] and bone_info['parent'] in blender_bones:
            bl_bone.parent = blender_bones[bone_info['parent']]
        sro_quat = Quaternion((
            bone_info['rot'][3],
            bone_info['rot'][0],
            bone_info['rot'][1],
            bone_info['rot'][2]
        ))
        sro_pos = Vector(bone_info['pos'])
        bl_bone.matrix = Matrix.Translation(sro_pos) @ sro_quat.to_matrix().to_4x4()

    bpy.ops.object.mode_set(mode='OBJECT')
    print(f" [LOG] Armature created: {armature_obj.name}")
    return armature_obj

# --- UI and Operators ---
class SROProperties(PropertyGroup):
    def _autofind_worker(self, active_path):
        if getattr(self, "is_autofinding", False) or not active_path or not os.path.exists(active_path):
            return

        try:
            setattr(self, "is_autofinding", True)
            directory = os.path.dirname(active_path)
            base_name = os.path.splitext(os.path.basename(active_path))[0]

            bmt_path = os.path.join(directory, base_name + '.bmt')
            if not self.import_bmt_filepath and os.path.exists(bmt_path):
                self.import_bmt_filepath = bmt_path

            bsk_path = os.path.join(directory, base_name + '.bsk')
            if not self.import_bsk_filepath and os.path.exists(bsk_path):
                self.import_bsk_filepath = bsk_path

            bms_path = os.path.join(directory, base_name + '.bms')
            if not self.import_bms_filepath and os.path.exists(bms_path):
                self.import_bms_filepath = bms_path

            ddj_path = os.path.join(directory, base_name + '.ddj')
            if not self.import_texture_filepath and os.path.exists(ddj_path):
                self.import_texture_filepath = ddj_path
        finally:
            setattr(self, "is_autofinding", False)

    def bms_update(self, context):
        self._autofind_worker(self.import_bms_filepath)

    def bmt_update(self, context):
        self._autofind_worker(self.import_bmt_filepath)

    def bsk_update(self, context):
        self._autofind_worker(self.import_bsk_filepath)

    def texture_update(self, context):
        self._autofind_worker(self.import_texture_filepath)

    import_bms_filepath: StringProperty(
        name=".BMS File",
        subtype='FILE_PATH',
        description="Select a .bms model file",
        update=bms_update
    )
    import_bmt_filepath: StringProperty(
        name=".BMT File",
        subtype='FILE_PATH',
        description="Select a .bmt material file",
        update=bmt_update
    )
    import_bsk_filepath: StringProperty(
        name=".BSK File",
        subtype='FILE_PATH',
        description="Select a .bsk skeleton file",
        update=bsk_update
    )
    import_texture_filepath: StringProperty(
        name="Texture File",
        subtype='FILE_PATH',
        description="Default texture if BMT is not used or texture is missing (.ddj only)",
        update=texture_update
    )

class SRO_OT_ImportUI(Operator):
    bl_idname = "silkroad.import_bms"
    bl_label = "Import Model"

    def execute(self, context):
        print(f"\n--- Starting Import Process (v{bl_info['version'][0]}.{bl_info['version'][1]}.{bl_info['version'][2]}) ---")
        if not PILLOW_OK:
            self.report({'ERROR'}, "Pillow library (PIL) is not installed. DDJ conversion will fail.")
            return {'CANCELLED'}

        props = context.scene.sro_props
        bms_path = props.import_bms_filepath
        bmt_path = props.import_bmt_filepath
        bsk_path = props.import_bsk_filepath
        texture_path_default = props.import_texture_filepath

        if not bms_path or not os.path.exists(bms_path):
            print("[ERROR] No .bms file selected or file does not exist.")
            self.report({'ERROR'}, "BMS file not selected or does not exist.")
            return {'CANCELLED'}

        if not bms_path.lower().endswith('.bms'):
            print(f"[ERROR] Invalid BMS file: '{os.path.basename(bms_path)}'. Please select a .bms file.")
            self.report({'ERROR'}, "Invalid file for BMS. Please select a .bms file.")
            return {'CANCELLED'}

        if bmt_path and not bmt_path.lower().endswith('.bmt'):
            print(f"[ERROR] Invalid BMT file: '{os.path.basename(bmt_path)}'. Please select a .bmt file.")
            self.report({'ERROR'}, "Invalid file for BMT. Please select a .bmt file.")
            return {'CANCELLED'}

        if bsk_path and not bsk_path.lower().endswith('.bsk'):
            print(f"[ERROR] Invalid BSK file: '{os.path.basename(bsk_path)}'. Please select a .bsk file.")
            self.report({'ERROR'}, "Invalid file for BSK. Please select a .bsk file.")
            return {'CANCELLED'}

        if texture_path_default and not texture_path_default.lower().endswith('.ddj'):
            print(f"[ERROR] Invalid texture file: '{os.path.basename(texture_path_default)}'. Please select a .ddj file.")
            self.report({'ERROR'}, "Invalid default texture. Please select a .ddj file.")
            return {'CANCELLED'}

        try:
            bmt_data = read_bmt_file(bmt_path)
            bones_data = read_bsk_file(bsk_path)

            verts = []
            normals = []
            uvs = []
            faces = []
            bones = []
            weights = []
            mesh_name_from_bms = ""
            mat_name_from_bms = ""

            print(f"[LOG] Opening BMS file: {os.path.basename(bms_path)}")
            with open(bms_path, 'rb') as f:
                if f.read(7) != b"JMXVBMS":
                    raise ValueError("Not a valid BMS file signature.")
                f.read(5)
                header_offsets = struct.unpack('<10I', f.read(40))
                header = {
                    "vertex_offset": header_offsets[0],
                    "skin_offset": header_offsets[1],
                    "face_offset": header_offsets[2]
                }
                print(f" -> Header read. Vertex offset: {header['vertex_offset']}, Skin offset: {header['skin_offset']}, Face offset: {header['face_offset']}")
                f.read(8)
                vertex_flag = read_int(f)
                f.read(4)
                mesh_name_from_bms = read_str(f)
                mat_name_from_bms = read_str(f)
                f.read(4)

                f.seek(header["vertex_offset"])
                vcount = read_int(f)
                print(f" [LOG] Reading {vcount} vertices...")
                for _ in range(vcount):
                    verts.append(struct.unpack('<3f', f.read(12)))
                    normals.append(struct.unpack('<3f', f.read(12)))
                    uvs.append(struct.unpack('<2f', f.read(8)))
                    if vertex_flag & 0x400:
                        f.read(8)
                    if vertex_flag & 0x800:
                        f.read(36)
                    f.read(12)
                print(f" -> Vertex data read: {len(verts)} positions, {len(normals)} normals, {len(uvs)} UVs.")

                f.seek(header["face_offset"])
                fcount = read_int(f)
                print(f" [LOG] Reading {fcount} faces...")
                faces = [tuple(reversed(tuple(read_short(f) for _ in range(3)))) for _ in range(fcount)]
                print(f" -> Face data read: {len(faces)} faces.")

                if header["skin_offset"] > 0:
                    f.seek(header["skin_offset"])
                    bcount = read_int(f)
                    if bcount > 0:
                        print(f" [LOG] Reading {bcount} bones and weights...")
                        bones = [read_str(f) for _ in range(bcount)]
                        print(f" -> Bones for mesh: {', '.join(bones)}")
                        for _ in range(vcount):
                            bi1 = read_byte(f)
                            bw1 = read_short(f)
                            bi2 = read_byte(f)
                            bw2 = read_short(f)
                            total = bw1 + bw2 if (bw1 + bw2) > 0 else 1.0
                            weights.append((bi1, bw1/total, bi2, bw2/total))
                        print(f" -> Weight data read for {len(weights)} vertices.")

            base_name = mesh_name_from_bms or os.path.splitext(os.path.basename(bms_path))[0]
            container_obj = bpy.data.objects.new(base_name, None)
            context.collection.objects.link(container_obj)

            print("[LOG] Creating Blender object...")
            mesh = bpy.data.meshes.new(base_name + '_Mesh')
            mesh_obj = bpy.data.objects.new(base_name + "_Mesh", mesh)
            mesh_obj.parent = container_obj
            context.collection.objects.link(mesh_obj)

            mesh.from_pydata(verts, [], faces)
            mesh.update()

            # DISABLED: Custom normals cause Blender 5.0 to crash
            # The crash occurs in mesh_normals_corner_custom_set function
            # if normals:
            #     mesh.normals_split_custom_set_from_vertices(normals)
            #     mesh.shade_smooth()
            #     print(" [LOG] Custom normals applied successfully.")

            # Use flat shading instead to avoid crash
            mesh.shade_smooth()
            print(" [LOG] Smooth shading applied (custom normals disabled to avoid crash).")

            bm = bmesh.new()
            bm.from_mesh(mesh)
            uv_layer = bm.loops.layers.uv.new("UVMap")
            for face in bm.faces:
                for loop in face.loops:
                    loop[uv_layer].uv = (uvs[loop.vert.index][0], 1.0 - uvs[loop.vert.index][1])
            bm.to_mesh(mesh)
            bm.free()
            print(" [LOG] UV map created successfully.")

            armature_obj = None
            if bones_data:
                armature_obj = create_armature(base_name, bones_data, context)
                armature_obj.parent = container_obj

            # Make mesh object active again before material assignment
            context.view_layer.objects.active = mesh_obj

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
                print(f" [LOG] Weights applied successfully.")

            print("[LOG] Creating material...")
            mat_props = bmt_data.get(mat_name_from_bms)
            final_mat_name = (mat_props.get('name') if mat_props else mat_name_from_bms) or "Material"
            mat = bpy.data.materials.new(name=final_mat_name)
            mat.use_nodes = True
            mesh_obj.data.materials.append(mat)

            nodes = mat.node_tree.nodes
            links = mat.node_tree.links
            bsdf = nodes.get("Principled BSDF")
            if not bsdf:
                bsdf = nodes.new("ShaderNodeBsdfPrincipled")
                output = nodes.new("ShaderNodeOutputMaterial")
                links.new(bsdf.outputs['BSDF'], output.inputs['Surface'])

            bms_dir = os.path.dirname(bms_path)
            bmt_dir = os.path.dirname(bmt_path) if bmt_path else ""

            def find_texture(texture_name, default_path):
                if not texture_name:
                    return default_path
                candidate = os.path.join(bmt_dir, texture_name)
                if os.path.exists(candidate):
                    return candidate
                candidate_bms = os.path.join(bms_dir, texture_name)
                if os.path.exists(candidate_bms):
                    return candidate_bms
                print(f" [WARNING] '{texture_name}' texture not found in BMT/BMS folder.")
                return default_path

            def process_texture(texture_path, texture_type="Diffuse"):
                if not texture_path or not os.path.exists(texture_path) or not texture_path.lower().endswith('.ddj'):
                    return None

                print(f" [LOG] Processing {texture_type} texture: {os.path.basename(texture_path)}")
                try:
                    png_path = convert_ddj_to_png(texture_path)
                    print(f" -> Successfully converted to: {png_path}")
                    return png_path
                except Exception as e:
                    print(f" [ERROR] Failed to convert {texture_type} texture: {e}")
                    return None

            diffuse_tex_name = mat_props.get('texture') if mat_props else None
            diffuse_path = find_texture(diffuse_tex_name, texture_path_default)
            png_path_diffuse = process_texture(diffuse_path, "Diffuse")

            if png_path_diffuse:
                tex_node = nodes.new("ShaderNodeTexImage")
                tex_node.image = bpy.data.images.load(png_path_diffuse)
                print(f" -> Image loaded into Blender: {os.path.basename(png_path_diffuse)}")
                mat.node_tree.nodes.active = tex_node
                links.new(bsdf.inputs['Base Color'], tex_node.outputs['Color'])
                if mat_props and mat_props['flags'] & 0x200:
                    mat.blend_method = 'BLEND'
                    if hasattr(mat, "eevee"):
                        mat.eevee.shadow_method = 'HASHED'
                print(f" -> Diffuse texture assigned to shader successfully.")

            normal_tex_name = mat_props.get('normal_map') if mat_props else None
            if normal_tex_name:
                normal_path = find_texture(normal_tex_name, "")
                png_path_normal = process_texture(normal_path, "Normal Map")
                if png_path_normal:
                    norm_tex_node = nodes.new("ShaderNodeTexImage")
                    norm_tex_node.image = bpy.data.images.load(png_path_normal)
                    norm_tex_node.image.colorspace_settings.name = 'Non-Color'
                    norm_map_node = nodes.new("ShaderNodeNormalMap")
                    links.new(norm_tex_node.outputs['Color'], norm_map_node.inputs['Color'])
                    links.new(norm_map_node.outputs['Normal'], bsdf.inputs['Normal'])
                    print(f" -> Normal Map assigned to shader successfully.")

            if mat_props:
                bsdf.inputs['Base Color'].default_value = mat_props['diffuse']
                bsdf.inputs['Specular IOR Level'].default_value = mat_props['specular'][0]
                bsdf.inputs['Roughness'].default_value = max(0.0, min(1.0, 1.0 - (mat_props['shininess'] / 128.0)))

            print("[LOG] Import finished, rotating object...")
            container_obj.rotation_euler[0] = math.radians(-90)

            self.report({'INFO'}, f"Successfully imported: {container_obj.name}")
            print("--- Import Process Completed ---")
            return {'FINISHED'}
        except Exception as e:
            self.report({'ERROR'}, f"Import failed: {e}")
            import traceback
            traceback.print_exc()
            return {'CANCELLED'}

class VIEW3D_PT_sro_panel(Panel):
    bl_label = "Silkroad Tools"
    bl_idname = "VIEW3D_PT_silkroad_panel"
    bl_space_type = 'VIEW_3D'
    bl_region_type = 'UI'
    bl_category = 'Silkroad'

    def draw(self, context):
        props = context.scene.sro_props
        box = self.layout.box()
        box.label(text="Model & Skeleton Import", icon='IMPORT')
        box.prop(props, "import_bms_filepath")
        box.prop(props, "import_bsk_filepath")
        box.prop(props, "import_bmt_filepath")
        box.prop(props, "import_texture_filepath", text=".DDJ File")
        box.operator(SRO_OT_ImportUI.bl_idname)

# --- Registration ---
classes = (SROProperties, SRO_OT_ImportUI, VIEW3D_PT_sro_panel)

def register():
    if not PILLOW_OK:
        print("WARNING: 'Pillow' Python library not installed. DDJ textures cannot be loaded.")
    for cls in classes:
        bpy.utils.register_class(cls)
    bpy.types.Scene.sro_props = PointerProperty(type=SROProperties)

def unregister():
    for cls in reversed(classes):
        bpy.utils.unregister_class(cls)
    del bpy.types.Scene.sro_props

if __name__ == "__main__":
    register()
