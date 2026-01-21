"""
Test single BMS → GLB conversion with Blender
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

# Test with a single BMS file
test_bms = Path("C:/Users/duan7/Desktop/SRObro/assets/data_extracted/character/ch_.bs")

if not test_bms.exists():
    print(f"❌ Test file not found: {test_bms}")
    # Find any BMS file
    bms_files = list(Path("C:/Users/duan7/Desktop/SRObro/assets/data_extracted").rglob("*.bms"))
    if bms_files:
        test_bms = bms_files[0]
        print(f"Using: {test_bms}")
    else:
        print("❌ No BMS files found!")
        sys.exit(1)

# Set file path in scene properties
bpy.context.scene.sro_props.import_bms_filepath = str(test_bms)

# Look for matching BSK
test_bsk = test_bms.with_suffix('.bsk')
if test_bsk.exists():
    bpy.context.scene.sro_props.import_bsk_filepath = str(test_bsk)
    print(f"✅ Found BSK: {test_bsk.name}")

# Import
print(f"\n📥 Importing {test_bms.name}...")
result = bpy.ops.silkroad.import_bms()

if result == {'FINISHED'}:
    print("✅ Import successful!")
else:
    print("❌ Import failed!")
    sys.exit(1)

# Export to GLB
output_path = Path("C:/Users/duan7/Desktop/SRObro/test_output.glb")

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
    print("\n🎉 Test complete! You can now load this GLB in Babylon.js to verify skinning works.")
else:
    print("❌ Export failed - no file created")
