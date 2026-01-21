use anyhow::{anyhow, Result};
use byteorder::{LittleEndian, ReadBytesExt};
use std::io::Read;

#[derive(Debug)]
pub struct BMSFile {
    pub magic: String,
    pub vertices: Vec<Vertex>,
    pub normals: Vec<[f32; 3]>,
    pub uvs: Vec<[f32; 2]>,
    pub faces: Vec<[u16; 3]>,
    pub bones: Vec<String>,
    pub weights: Vec<(u8, u16, u8, u16)>, // (bone_idx1, weight1, bone_idx2, weight2)
    pub mesh_name: String,
    pub material_name: String,
}

#[derive(Debug, Clone)]
pub struct Vertex {
    pub position: [f32; 3],
    pub normal: [f32; 3],
    pub uv: [f32; 2],
}

impl BMSFile {
    pub fn parse(data: &[u8]) -> Result<Self> {
        let mut cursor = std::io::Cursor::new(data);

        // Read and verify magic
        let mut magic = [0u8; 7];
        cursor.read_exact(&mut magic)?;
        if &magic != b"JMXVBMS" {
            return Err(anyhow!("Invalid BMS magic: {:?}", magic));
        }

        // Skip version bytes
        cursor.read_u8()?;
        cursor.read_u8()?;
        cursor.read_u8()?;
        cursor.read_u8()?;
        cursor.read_u8()?;

        // Read header offsets
        let mut offsets = [0u32; 10];
        for i in 0..10 {
            offsets[i] = cursor.read_u32::<LittleEndian>()?;
        }

        let vertex_offset = offsets[0] as usize;
        let skin_offset = offsets[1] as usize;
        let face_offset = offsets[2] as usize;

        // Skip some bytes
        cursor.read_u32::<LittleEndian>()?;
        cursor.read_u32::<LittleEndian>()?;

        // Read flags
        let vertex_flag = cursor.read_u32::<LittleEndian>()?;

        // Skip 4 bytes
        cursor.read_u32::<LittleEndian>()?;

        // Read mesh name and material name
        let mesh_name = read_string(&mut cursor)?;
        let material_name = read_string(&mut cursor)?;

        // Skip 4 bytes
        cursor.read_u32::<LittleEndian>()?;

        // Seek to vertex data
        cursor.set_position(vertex_offset as u64);

        // Read vertices
        let vertex_count = cursor.read_u32::<LittleEndian>()? as usize;
        let mut vertices = Vec::with_capacity(vertex_count);
        let mut normals = Vec::with_capacity(vertex_count);
        let mut uvs = Vec::with_capacity(vertex_count);

        for _ in 0..vertex_count {
            let position = [
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
            ];

            let normal = [
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
            ];

            let uv = [
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
            ];

            vertices.push(Vertex { position, normal, uv });
            normals.push(normal);
            uvs.push(uv);

            // Optional lightmap UV
            if vertex_flag & 0x400 != 0 {
                cursor.read_f32::<LittleEndian>()?;
                cursor.read_f32::<LittleEndian>()?;
            }

            // Extra data
            if vertex_flag & 0x800 != 0 {
                cursor.read_exact(&mut [0u8; 36])?;
            }

            // Skip 12 bytes
            cursor.read_exact(&mut [0u8; 12])?;
        }

        // Seek to face data
        cursor.set_position(face_offset as u64);

        // Read faces
        let face_count = cursor.read_u32::<LittleEndian>()? as usize;
        let mut faces = Vec::with_capacity(face_count);

        for _ in 0..face_count {
            let i0 = cursor.read_u16::<LittleEndian>()?;
            let i1 = cursor.read_u16::<LittleEndian>()?;
            let i2 = cursor.read_u16::<LittleEndian>()?;
            faces.push([i0, i1, i2]);
        }

        // Read skinning data if available
        let mut bones = Vec::new();
        let mut weights = Vec::new();

        if skin_offset > 0 && skin_offset < data.len() {
            cursor.set_position(skin_offset as u64);

            let bone_count = cursor.read_u32::<LittleEndian>()? as usize;
            if bone_count > 0 && bone_count < 256 {
                // Read bone names
                for _ in 0..bone_count {
                    bones.push(read_string(&mut cursor)?);
                }

                // Read weights per vertex
                for _ in 0..vertex_count {
                    let bi1 = cursor.read_u8()?;
                    let bw1 = cursor.read_u16::<LittleEndian>()?;
                    let bi2 = cursor.read_u8()?;
                    let bw2 = cursor.read_u16::<LittleEndian>()?;
                    weights.push((bi1, bw1, bi2, bw2));
                }
            }
        }

        Ok(BMSFile {
            magic: String::from_utf8(magic.to_vec())?,
            vertices,
            normals,
            uvs,
            faces,
            bones,
            weights,
            mesh_name,
            material_name,
        })
    }
}

fn read_string<R: std::io::Read>(cursor: &mut R) -> Result<String> {
    let length = cursor.read_u32::<LittleEndian>()? as usize;
    if length == 0 {
        return Ok(String::new());
    }

    let mut buffer = vec![0u8; length];
    cursor.read_exact(&mut buffer)?;

    // Try CP949 (Korean) encoding first, fallback to UTF-8
    String::from_utf8(buffer.clone())
        .map_err(|_| anyhow!("Invalid UTF-8 string"))
        .or_else(|_| {
            // Fallback: replace invalid bytes
            Ok(String::from_utf8_lossy(&buffer).to_string())
        })
}
