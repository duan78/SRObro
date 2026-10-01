use anyhow::Result;
use std::fs::File;
use std::path::Path;
use serde_json::json;

use crate::jmx::{bms::BMSFile, bsk::BSKFile, bmt::BMTFile};

pub fn export_to_glb(
    bms: &BMSFile,
    bsk: Option<&BSKFile>,
    _bmt: Option<&BMTFile>,
    output_path: &Path,
) -> Result<()> {
    // Create minimal glTF JSON structure
    let mut gltf_json = json!({
        "asset": {
            "version": "2.0",
            "generator": "JMX Converter"
        },
        "scene": 0,
        "scenes": [{
            "nodes": [0]
        }],
        "nodes": [{
            "name": bms.mesh_name.clone(),
            "mesh": 0
        }],
        "meshes": [{
            "name": bms.mesh_name.clone(),
            "primitives": [{
                "attributes": {
                    "POSITION": 0,
                    "NORMAL": 1,
                    "TEXCOORD_0": 2
                },
                "indices": 3
            }]
        }],
        "buffers": [{
            "byteLength": 0 // Will be calculated
        }],
        "bufferViews": [],
        "accessors": [],
        "samplers": [{
            "magFilter": 9729,
            "minFilter": 9729,
            "wrapS": 33071,
            "wrapT": 33071
        }]
    });

    // Calculate binary data size and create buffers
    // Helper function to convert slice of T to bytes
    fn cast_to_bytes<T: bytemuck::Pod>(slice: &[T]) -> &[u8] {
        unsafe {
            std::slice::from_raw_parts(
                slice.as_ptr() as *const u8,
                slice.len() * std::mem::size_of::<T>(),
            )
        }
    }

    // Create position data
    let positions_data: Vec<f32> = bms.vertices.iter()
        .flat_map(|v| v.position.to_vec())
        .collect();
    let positions_bytes = cast_to_bytes(&positions_data);

    // Create normal data
    let normals_data: Vec<f32> = bms.normals.iter()
        .flat_map(|v| v.to_vec())
        .collect();
    let normals_bytes = cast_to_bytes(&normals_data);

    // Create UV data (flip Y coordinate)
    let uvs_data: Vec<f32> = bms.uvs.iter()
        .flat_map(|uv| [uv[0], 1.0 - uv[1]])
        .collect();
    let uvs_bytes = cast_to_bytes(&uvs_data);

    // Create index data
    let indices_data: Vec<u16> = bms.faces.iter()
        .flat_map(|f| f.to_vec())
        .collect();
    let indices_bytes = cast_to_bytes(&indices_data);

    // Pad all data to 4-byte alignment
    let pad_to_4 = |len: usize| -> usize { (4 - (len % 4)) % 4 };

    let positions_len = positions_bytes.len();
    let normals_len = normals_bytes.len();
    let uvs_len = uvs_bytes.len();
    let indices_len = indices_bytes.len();

    let mut buffer_data = Vec::new();
    let mut buffer_offset = 0usize;

    // Helper to add data to buffer
    let mut add_to_buffer = |data: &[u8]| -> usize {
        let offset = buffer_offset;
        buffer_data.extend_from_slice(data);
        // Pad to 4-byte alignment
        for _ in 0..pad_to_4(data.len()) {
            buffer_data.push(0);
        }
        buffer_offset += data.len() + pad_to_4(data.len());
        offset
    };

    let positions_offset = add_to_buffer(positions_bytes);
    let normals_offset = add_to_buffer(normals_bytes);
    let uvs_offset = add_to_buffer(uvs_bytes);
    let indices_offset = add_to_buffer(indices_bytes);

    // Add skinning data if available
    let mut joints_offset = None;
    let mut weights_offset = None;

    if !bms.bones.is_empty() && !bms.weights.is_empty() {
        // Create joints data (u16)
        let joints_data: Vec<u16> = bms.weights.iter()
            .flat_map(|w| [w.0 as u16, w.2 as u16, 0, 0])
            .collect();
        let joints_bytes = cast_to_bytes(&joints_data);
        joints_offset = Some(add_to_buffer(joints_bytes));

        // Create weights data (f32)
        let weights_data: Vec<f32> = bms.weights.iter()
            .flat_map(|w| {
                let w1 = w.1 as f32 / 65535.0;
                let w2 = w.3 as f32 / 65535.0;
                [w1, w2, 0.0, 0.0]
            })
            .collect();
        let weights_bytes = cast_to_bytes(&weights_data);
        weights_offset = Some(add_to_buffer(weights_bytes));

        // Update primitive with skinning
        if let Some(primitives) = gltf_json.pointer_mut("/meshes/0/primitives/0/attributes") {
            if let Some(obj) = primitives.as_object_mut() {
                obj.insert("JOINTS_0".to_string(), json!(4));
                obj.insert("WEIGHTS_0".to_string(), json!(5));
            }
        }
    }

    // Update buffer byte length (use padded size)
    if let Some(buffer) = gltf_json.pointer_mut("/buffers/0/byteLength") {
        *buffer = json!(buffer_offset);  // buffer_offset tracks the actual padded size
    }

    // Create buffer views
    let mut buffer_views = Vec::new();

    buffer_views.push(json!({
        "buffer": 0,
        "byteOffset": positions_offset,
        "byteLength": positions_len,
    }));

    buffer_views.push(json!({
        "buffer": 0,
        "byteOffset": normals_offset,
        "byteLength": normals_len,
    }));

    buffer_views.push(json!({
        "buffer": 0,
        "byteOffset": uvs_offset,
        "byteLength": uvs_len,
    }));

    buffer_views.push(json!({
        "buffer": 0,
        "byteOffset": indices_offset,
        "byteLength": indices_len,
    }));

    if let (Some(joints), Some(weights)) = (joints_offset, weights_offset) {
        let joints_len = bms.weights.len() * 2 * 4;
        let weights_len = bms.weights.len() * 4 * 4;

        buffer_views.push(json!({
            "buffer": 0,
            "byteOffset": joints,
            "byteLength": joints_len,
        }));

        buffer_views.push(json!({
            "buffer": 0,
            "byteOffset": weights,
            "byteLength": weights_len,
        }));
    }

    // Create accessors
    let mut accessors = Vec::new();

    accessors.push(json!({
        "bufferView": 0,
        "componentType": 5126, // FLOAT
        "count": bms.vertices.len(),
        "type": "VEC3"
    }));

    accessors.push(json!({
        "bufferView": 1,
        "componentType": 5126,
        "count": bms.normals.len(),
        "type": "VEC3"
    }));

    accessors.push(json!({
        "bufferView": 2,
        "componentType": 5126,
        "count": bms.uvs.len(),
        "type": "VEC2"
    }));

    accessors.push(json!({
        "bufferView": 3,
        "componentType": 5123, // UNSIGNED_SHORT
        "count": bms.faces.len() * 3,
        "type": "SCALAR"
    }));

    if let (Some(joints), Some(weights)) = (joints_offset, weights_offset) {
        // Une influence (JOINTS_0/WEIGHTS_0) par sommet: count = nb de VEC4,
        // pas le nombre de composants sous-jacents.
        accessors.push(json!({
            "bufferView": 4,
            "componentType": 5123,
            "count": bms.weights.len(),
            "type": "VEC4"
        }));

        accessors.push(json!({
            "bufferView": 5,
            "componentType": 5126,
            "count": bms.weights.len(),
            "type": "VEC4"
        }));
    }

    // Update JSON with bufferViews and accessors
    if let Some(buffer_views_arr) = gltf_json.pointer_mut("/bufferViews") {
        *buffer_views_arr = json!(buffer_views);
    }

    if let Some(accessors_arr) = gltf_json.pointer_mut("/accessors") {
        *accessors_arr = json!(accessors);
    }

    // Update primitive attributes
    if let Some(attributes) = gltf_json.pointer_mut("/meshes/0/primitives/0/attributes") {
        if let Some(obj) = attributes.as_object_mut() {
            obj.insert("POSITION".to_string(), json!(0));
            obj.insert("NORMAL".to_string(), json!(1));
            obj.insert("TEXCOORD_0".to_string(), json!(2));
        }
    }

    // ---- Squelette (BSK -> nodes + skin + inverse bind matrices) ----
    let has_skin_data = !bms.bones.is_empty() && !bms.weights.is_empty();
    if let (Some(bsk), true) = (bsk, has_skin_data) {
        export_skeleton(&mut gltf_json, &mut buffer_data, &mut buffer_offset, bms, bsk)?;
    }

    // Write GLB file
    write_glb_file(&gltf_json, &buffer_data, output_path)?;

    Ok(())
}

/// Math 4x4 column-major (convention glTF) minimale pour l'export squelette.
mod mat4 {
    pub type M = [f32; 16];

    pub fn from_quat_pos(q: [f32; 4], t: [f32; 3]) -> M {
        let [x, y, z, w] = q;
        let x2 = x + x; let y2 = y + y; let z2 = z + z;
        let xx = x * x2; let xy = x * y2; let xz = x * z2;
        let yy = y * y2; let yz = y * z2; let zz = z * z2;
        let wx = w * x2; let wy = w * y2; let wz = w * z2;
        // column-major
        [
            1.0 - (yy + zz), xy + wz, xz - wy, 0.0,
            xy - wz, 1.0 - (xx + zz), yz + wx, 0.0,
            xz + wy, yz - wx, 1.0 - (xx + yy), 0.0,
            t[0], t[1], t[2], 1.0,
        ]
    }

    pub fn identity() -> M {
        [1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0]
    }

    pub fn mul(a: &M, b: &M) -> M {
        let mut o = [0.0f32; 16];
        for c in 0..4 {
            for r in 0..4 {
                let mut s = 0.0;
                for k in 0..4 {
                    s += a[k * 4 + r] * b[c * 4 + k];
                }
                o[c * 4 + r] = s;
            }
        }
        o
    }

    pub fn invert(m: &M) -> M {
        // Adjugate pour matrices affines (la ligne du bas est 0,0,0,1)
        let a = m[0]; let b = m[1]; let c = m[2];
        let d = m[4]; let e = m[5]; let f = m[6];
        let g = m[8]; let h = m[9]; let i = m[10];
        let tx = m[12]; let ty = m[13]; let tz = m[14];
        let det = a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
        if det == 0.0 {
            return identity();
        }
        let inv_det = 1.0 / det;
        let mut o = [0.0f32; 16];
        o[0] = (e * i - f * h) * inv_det;
        o[1] = (c * h - b * i) * inv_det;
        o[2] = (b * f - c * e) * inv_det;
        o[4] = (f * g - d * i) * inv_det;
        o[5] = (a * i - c * g) * inv_det;
        o[6] = (c * d - a * f) * inv_det;
        o[8] = (d * h - e * g) * inv_det;
        o[9] = (b * g - a * h) * inv_det;
        o[10] = (a * e - b * d) * inv_det;
        // -R^T * t
        o[12] = -(o[0] * tx + o[4] * ty + o[8] * tz);
        o[13] = -(o[1] * tx + o[5] * ty + o[9] * tz);
        o[14] = -(o[2] * tx + o[6] * ty + o[10] * tz);
        o[15] = 1.0;
        o
    }
}

/// Construit nodes/skin/IBM glTF depuis le squelette BSK et l'attache au mesh.
fn export_skeleton(
    gltf_json: &mut serde_json::Value,
    buffer_data: &mut Vec<u8>,
    buffer_offset: &mut usize,
    bms: &BMSFile,
    bsk: &BSKFile,
) -> Result<()> {
    use serde_json::json;

    // Index des os BSK par nom
    let bsk_index: std::collections::HashMap<&str, usize> =
        bsk.bones.iter().enumerate().map(|(i, b)| (b.name.as_str(), i)).collect();

    // Matrices monde des os BSK (transformations absolues)
    let mut world: Vec<mat4::M> = Vec::with_capacity(bsk.bones.len());
    for bone in &bsk.bones {
        let local = mat4::from_quat_pos(bone.rotation, bone.position);
        let parent_world = bone.parent.is_empty()
            .then(mat4::identity)
            .or_else(|| bsk_index.get(bone.parent.as_str()).and_then(|&pi| world.get(pi).cloned()));
        match parent_world {
            Some(pw) => world.push(mat4::mul(&pw, &local)),
            None => world.push(local), // parent inconnu: traité comme racine
        }
    }

    // Le skin suit l'ordre des os du BMS (les indices JOINTS_0 restent valides)
    let joints: Vec<usize> = bms.bones.iter()
        .map(|name| bsk_index.get(name.as_str()).copied().unwrap_or(0))
        .collect();

    // Nodes: le node 0 est le mesh; les os commencent à 1
    let mesh_node_count = 1usize;
    let bone_node_of: Vec<usize> = (0..bsk.bones.len())
        .map(|i| mesh_node_count + i)
        .collect();

    let mut nodes = vec![json!({ "mesh": 0, "skin": 0, "name": bms.mesh_name.clone() })];
    for (i, bone) in bsk.bones.iter().enumerate() {
        let local = mat4::from_quat_pos(bone.rotation, bone.position);
        let parent_world = bone.parent.is_empty()
            .then(mat4::identity)
            .or_else(|| bsk_index.get(bone.parent.as_str()).and_then(|&pi| world.get(pi).cloned()));
        let local_m = match parent_world {
            Some(pw) => mat4::mul(&mat4::invert(&pw), &world[i]),
            None => local,
        };
        let mut node = json!({ "name": bone.name.clone() });
        node["matrix"] = json!(local_m.to_vec());
        if let Some(&pi) = bsk_index.get(bone.parent.as_str()) {
            node["children"] = json!([]); // rempli au tour suivant
            let _ = pi;
        }
        nodes.push(node);
    }
    // Hiérarchie: rattacher chaque os à son parent, les racines au node mesh? Non:
    // les os racines restent au niveau scène pour un skin classique.
    // On reconstruit les children après coup.
    let mut children_map: std::collections::HashMap<usize, Vec<usize>> = std::collections::HashMap::new();
    let mut root_bones: Vec<usize> = Vec::new();
    for (i, bone) in bsk.bones.iter().enumerate() {
        match bsk_index.get(bone.parent.as_str()) {
            Some(&pi) => children_map.entry(pi).or_default().push(bone_node_of[i]),
            None => root_bones.push(bone_node_of[i]),
        }
    }
    for (pi, kids) in children_map {
        nodes[bone_node_of[pi]]["children"] = json!(kids);
    }
    // Les os racines deviennent enfants du node racine de scène
    if let Some(scenes) = gltf_json.pointer_mut("/scenes/0/nodes") {
        if let Some(arr) = scenes.as_array_mut() {
            for r in root_bones {
                arr.push(json!(r));
            }
        }
    }

    // Inverse bind matrices: IBM = inverse(world(bone)), pour les joints du skin
    let mut ibm_data: Vec<f32> = Vec::with_capacity(joints.len() * 16);
    for &bi in &joints {
        let inv = mat4::invert(&world[bi]);
        ibm_data.extend_from_slice(&inv);
    }
    let ibm_bytes_len = ibm_data.len() * 4;
    let ibm_bytes = unsafe {
        std::slice::from_raw_parts(ibm_data.as_ptr() as *const u8, ibm_bytes_len)
    };
    let ibm_offset = *buffer_offset;
    buffer_data.extend_from_slice(ibm_bytes);
    let pad = (4 - (ibm_bytes_len % 4)) % 4;
    for _ in 0..pad { buffer_data.push(0); }
    *buffer_offset += ibm_bytes_len + pad;

    let ibm_bv_index = gltf_json["bufferViews"].as_array().map(|a| a.len()).unwrap_or(0);
    let ibm_acc_index = gltf_json["accessors"].as_array().map(|a| a.len()).unwrap_or(0);

    if let Some(bvs) = gltf_json.pointer_mut("/bufferViews") {
        if let Some(arr) = bvs.as_array_mut() {
            arr.push(json!({
                "buffer": 0,
                "byteOffset": ibm_offset,
                "byteLength": ibm_bytes_len,
            }));
        }
    }
    if let Some(accs) = gltf_json.pointer_mut("/accessors") {
        if let Some(arr) = accs.as_array_mut() {
            arr.push(json!({
                "bufferView": ibm_bv_index,
                "componentType": 5126,
                "count": joints.len(),
                "type": "MAT4",
            }));
        }
    }
    if let Some(buf) = gltf_json.pointer_mut("/buffers/0/byteLength") {
        *buf = json!(*buffer_offset);
    }

    gltf_json["nodes"] = json!(nodes);
    gltf_json["skins"] = json!([{
        "joints": joints.iter().map(|&bi| bone_node_of[bi]).collect::<Vec<_>>(),
        "inverseBindMatrices": ibm_acc_index,
    }]);

    Ok(())
}

fn write_glb_file(gltf_json: &serde_json::Value, buffer_data: &[u8], output_path: &Path) -> Result<()> {
    use std::io::Write;

    let gltf_str = gltf_json.to_string();
    let gltf_bytes = gltf_str.as_bytes();

    // Align JSON to 4-byte boundary
    let json_len = gltf_bytes.len();
    let json_padding = (4 - (json_len % 4)) % 4;

    let total_len = 12 + 8 + json_len + json_padding + 8 + buffer_data.len();

    let mut file = File::create(output_path)?;

    // Write GLB header
    file.write_all(b"glTF")?;
    file.write_all(&(2u32).to_le_bytes())?; // version
    file.write_all(&(total_len as u32).to_le_bytes())?;

    // Write JSON chunk. La longueur INCLUT le padding d'alignement: certains
    // lecteurs (Babylon GLTFFileLoader) placent le chunk binaire à
    // 12+8+chunkLength sans réaligner, et des espaces en fin de JSON sont valides.
    file.write_all(&((json_len + json_padding) as u32).to_le_bytes())?;
    file.write_all(b"JSON")?;
    file.write_all(gltf_bytes)?;

    // Pad JSON chunk
    for _ in 0..json_padding {
        file.write_all(&[0x20])?;
    }

    // Write binary chunk
    file.write_all(&(buffer_data.len() as u32).to_le_bytes())?;
    file.write_all(b"BIN\0")?;
    file.write_all(buffer_data)?;

    // Pad binary chunk to 4-byte boundary
    let bin_padding = (4 - (buffer_data.len() % 4)) % 4;
    for _ in 0..bin_padding {
        file.write_all(&[0x00])?;
    }

    Ok(())
}
