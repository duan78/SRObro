use anyhow::{anyhow, Result};
use byteorder::{LittleEndian, ReadBytesExt};
use std::io::Read;

#[derive(Debug)]
pub struct BSKFile {
    pub magic: String,
    pub bones: Vec<Bone>,
}

#[derive(Debug, Clone)]
pub struct Bone {
    pub name: String,
    pub parent: String,
    pub position: [f32; 3],
    pub rotation: [f32; 4], // Quaternion
}

impl BSKFile {
    pub fn parse(data: &[u8]) -> Result<Self> {
        let mut cursor = std::io::Cursor::new(data);

        // Read and verify magic
        let mut magic = [0u8; 7];
        cursor.read_exact(&mut magic)?;
        if &magic != b"JMXVBSK" {
            return Err(anyhow!("Invalid BSK magic: {:?}", magic));
        }

        // Skip version bytes
        cursor.read_u8()?;
        cursor.read_u8()?;
        cursor.read_u8()?;
        cursor.read_u8()?;
        cursor.read_u8()?;

        // Read bone count
        let bone_count = cursor.read_u32::<LittleEndian>()? as usize;
        let mut bones = Vec::with_capacity(bone_count);

        for _ in 0..bone_count {
            // Skip unknown byte
            cursor.read_u8()?;

            let name = read_string(&mut cursor)?;
            let parent = read_string(&mut cursor)?;

            // Skip 16 + 12 bytes (transform data we'll parse properly)
            cursor.read_exact(&mut [0u8; 28])?;

            // Read absolute rotation (quaternion)
            let rotation = [
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
            ];

            // Read absolute position
            let position = [
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
            ];

            // Skip unknown transform (16 + 12 bytes)
            cursor.read_exact(&mut [0u8; 28])?;

            // Read child count
            let child_count = cursor.read_u32::<LittleEndian>()? as usize;

            // Skip child names
            for _ in 0..child_count {
                read_string(&mut cursor)?;
            }

            bones.push(Bone {
                name,
                parent,
                position,
                rotation,
            });
        }

        Ok(BSKFile {
            magic: String::from_utf8(magic.to_vec())?,
            bones,
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

    String::from_utf8(buffer.clone())
        .map_err(|_| anyhow!("Invalid UTF-8 string"))
        .or_else(|_| Ok(String::from_utf8_lossy(&buffer).to_string()))
}
