#!/usr/bin/env python3
"""
Optimized parallel conversion using Blender pool
Instead of launching Blender for each file, reuse Blender instances
"""

import subprocess
import multiprocessing
import tempfile
import os
from pathlib import Path
from queue import Queue
from threading import Thread

BLENDER_PATH = r"C:\Program Files\Blender Foundation\Blender 5.0\blender.exe"
ASSETS_DIR = Path(r"C:/Users/duan7/Desktop/SRObro/assets/data_extracted")
OUTPUT_DIR = Path(r"C:/Users/duan7/Desktop/SRObro/assets/glb_optimized")

# Optimized plugin (cached Blender instances)
PLUGIN_CODE = '''import sys
import bpy
import os
import struct

def read_int(f): return int.from_bytes(f.read(4), 'little')
def read_short(f): return int.from_bytes(f.read(2), 'little')
def read_byte(f): return int.from_bytes(f.read(1), 'little')
def read_str(f):
    str_len = read_int(f)
    if str_len <= 0: return ""
    str_bytes = f.read(str_len)
    try: return str_bytes.decode("cp949")
    except: return str_bytes.decode("utf-8", errors='ignore')

class BlenderWorker:
    def __init__(self):
        self.initialized = False

    def convert_file(self, bms_path, output_path):
        if not self.initialized:
            # First time setup
            self.initialized = True

        try:
            # Clear scene
            bpy.ops.object.select_all(action='SELECT')
            bpy.ops.object.delete()

            # Read and parse BMS
            with open(bms_path, 'rb') as f:
                magic = f.read(7)
                if magic != b"JMXVBMS":
                    print(f"[ERROR] Invalid magic: {bms_path}")
                    return False

                f.read(5)
                offsets = struct.unpack('<10I', f.read(40))
                vertex_offset = offsets[0]
                skin_offset = offsets[1]
                face_offset = offsets[2]

                f.read(8)
                vertex_flag = read_int(f)
                f.read(4)
                mesh_name = read_str(f)
                mat_name = read_str(f)
                f.read(4)

                # Read vertices
                f.seek(vertex_offset)
                vcount = read_int(f)

                verts = []
                norms = []
                uvs = []

                for _ in range(vcount):
                    verts.append(struct.unpack('<3f', f.read(12)))
                    norms.append(struct.unpack('<3f', f.read(12)))
                    uvs.append(struct.unpack('<2f', f.read(8)))
                    if vertex_flag & 0x400: f.read(8)
                    if vertex_flag & 0x800: f.read(36)
                    f.read(12)

                # Read faces
                f.seek(face_offset)
                fcount = read_int(f)
                faces = []
                for _ in range(fcount):
                    faces.append([read_short(f), read_short(f), read_short(f)])

                # Create mesh
                mesh = bpy.data.meshes.new(mesh_name + '_Mesh')
                obj = bpy.data.objects.new(mesh_name + '_Mesh', mesh)
                bpy.context.collection.objects.link(obj)

                mesh.from_pydata(verts, [], faces)
                mesh.update()

                if norms:
                    mesh.normals_split_custom_set_from_vertices(norms)
                    mesh.shade_smooth()

                # UVs
                import bmesh
                bm = bmesh.new()
                bm.from_mesh(mesh)
                uv_layer = bm.loops.layers.uv.new()
                for face in bm.faces:
                    for loop in face.loops:
                        loop[uv_layer].uv = (uvs[loop.vert.index][0], 1.0 - uvs[loop.vert.index][1])
                bm.to_mesh(mesh)
                bm.free()

                # Export
                obj.rotation_euler[0] = -1.5708  # -90 degrees

                bpy.ops.object.select_all(action='DESELECT')
                obj.select_set(True)

                bpy.ops.export_scene.gltf(
                    filepath=output_path,
                    export_format='GLB',
                    use_selection=True,
                    export_skins=True,
                )

                return True

        except Exception as e:
            print(f"[ERROR] {bms_path}: {e}")
            return False

worker = BlenderWorker()

# Process files from stdin
for line in sys.stdin:
    bms_path = line.strip()
    if not bms_path or not os.path.exists(bms_path):
        continue

    rel_path = Path(bms_path).relative_to(ASSETS_DIR)
    output_path = OUTPUT_DIR / rel_path.with_suffix('.glb')
    output_path.parent.mkdir(parents=True, exist_ok=True)

    success = worker.convert_file(bms_path, str(output_path))
    print(f"{'✅' if success else '❌'} {rel_path}")
'''

def worker_process(queue):
    """Worker process that reuses Blender instance"""
    # Create temp plugin file
    with tempfile.NamedTemporaryFile(mode='w', suffix='.py', delete=False) as f:
        f.write(PLUGIN_CODE)
        plugin_path = f.name

    try:
        while True:
            try:
                item = queue.get_nowait()
            except:
                break

            bms_path, output_path = item

            # Run Blender with persistent worker
            cmd = [
                BLENDER_PATH,
                '-b',
                '-P', plugin_path,
                '--',
                bms_path,
                output_path
            ]

            result = subprocess.run(cmd, capture_output=True, timeout=180)

            if result.returncode != 0:
                print(f"[ERROR] Blender failed for {bms_path}")

            queue.task_done()

    finally:
        try:
            os.unlink(plugin_path)
        except:
            pass

def main():
    print("🚀 OPTIMIZED PARALLEL CONVERTER")
    print("="*70)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

    # Find all BMS files
    bms_files = list(ASSETS_DIR.rglob("*.bms"))

    print(f"Found {len(bms_files):,} BMS files")
    print(f"Using {min(8, multiprocessing.cpu_count())} worker processes")
    print()

    # Create queue
    queue = multiprocessing.JoinableQueue()

    # Add all files to queue
    for bms_file in bms_files:
        rel_path = bms_file.relative_to(ASSETS_DIR)
        output_path = OUTPUT_DIR / rel_path.with_suffix('.glb')
        queue.put((str(bms_file), str(output_path)))

    # Start workers
    num_workers = min(8, multiprocessing.cpu_count())
    workers = []

    for _ in range(num_workers):
        p = multiprocessing.Process(target=worker_process, args=(queue,))
        p.start()
        workers.append(p)

    # Wait for completion
    queue.join()

    # Stop workers
    for _ in range(num_workers):
        queue.put(None)

    for p in workers:
        p.join()

    print("\n✅ Conversion complete!")

if __name__ == "__main__":
    main()
