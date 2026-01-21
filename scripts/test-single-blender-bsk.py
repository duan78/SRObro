"""
Test single BMS+BSK → GLB conversion with Blender
"""
import bpy
import sys
from pathlib import Path

# Clear scene
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete()

# Import the plugin
addon_path = Path("C:/Users/duan7/AppData/Roaming/Blender Foundation/Blender 5.0/scripts/addons/silkroad-blender-importer.py")

try:
    import importlib.util
    spec = importlib.util.spec_from_file_location("silkroad_importer", addon_path)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    module.register()
    print("✅ Plugin loaded successfully")
except Exception as e:
    print(f"❌ Plugin loading failed: {e}")
    sys.exit(1)

# Test files
test_bms = Path("C:/Users/duan7/Desktop/SRObro/assets/data_extracted/prim/avatar_m_nasrun.bms")
test_bsk = Path("C:/Users/duan7/Desktop/SRObro/assets/data_extracted/prim/skel/char/europe/europeman_skel.bsk")

if not test_bms.exists():
    print(f"❌ BMS file not found: {test_bms}")
    sys.exit(1)

if not test_bsk.exists():
    print(f"❌ BSK file not found: {test_bsk}")
    sys.exit(1)

print(f"✅ BMS: {test_bms.name}")
print(f"✅ BSK: {test_bsk.name}")

# Set file path in scene properties
bpy.context.scene.sro_props.import_bms_filepath = str(test_bms)
bpy.context.scene.sro_props.import_bsk_filepath = str(test_bsk)

# Import
print(f"\n📥 Importing {test_bms.name} + {test_bsk.name}...")
result = bpy.ops.silkroad.import_bms()

if result == {'FINISHED'}:
    print("✅ Import successful!")
else:
    print("❌ Import failed!")
    sys.exit(1)

# Export to GLB
output_path = Path("C:/Users/duan7/Desktop/SRObro/test_output_with_skeleton.glb")

print(f"\n📤 Exporting to {output_path}...")
bpy.ops.export_scene.gltf(
    filepath=str(output_path),
    export_format='GLB',
    export_skins=True,
    export_texcoords=True,
    export_normals=True
)

if output_path.exists():
    size = output_path.stat().st_size
    print(f"✅ Export successful! File size: {size} bytes")
    print(f"\n📁 Output: {output_path}")

    # Check for skinning attributes
    import json
    with open(output_path, 'rb') as f:
        f.read(12)  # header
        json_len = int.from_bytes(f.read(4), 'little')
        f.read(4)  # 'JSON'
        json_data = json.loads(f.read(json_len).decode('utf-8'))

        for mesh in json_data.get('meshes', []):
            for prim in mesh.get('primitives', []):
                attrs = prim.get('attributes', {})
                has_joints = 'JOINTS_0' in attrs
                has_weights = 'WEIGHTS_0' in attrs
                print(f"\n🦴 Skinning Check:")
                print(f"   JOINTS_0 present: {has_joints}")
                print(f"   WEIGHTS_0 present: {has_weights}")

                if has_joints and has_weights:
                    print(f"\n🎉 SUCCESS! GLB has complete skinning data!")
                else:
                    print(f"\n❌ FAIL: Missing skinning data")
else:
    print("❌ Export failed - no file created")
