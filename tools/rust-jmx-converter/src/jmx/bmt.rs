use anyhow::{anyhow, Result};
use byteorder::{LittleEndian, ReadBytesExt};
use std::io::Read;

#[derive(Debug)]
pub struct BMTFile {
    pub magic: String,
    pub materials: Vec<Material>,
}

#[derive(Debug, Clone)]
pub struct Material {
    pub name: String,
    pub diffuse: [f32; 4],
    pub ambient: [f32; 4],
    pub specular: [f32; 4],
    pub emissive: [f32; 4],
    pub shininess: f32,
    pub flags: u32,
    pub texture: Option<String>,
    pub normal_map: Option<String>,
}

impl BMTFile {
    pub fn parse(data: &[u8]) -> Result<Self> {
        let mut cursor = std::io::Cursor::new(data);

        // Read and verify magic
        let mut magic = [0u8; 7];
        cursor.read_exact(&mut magic)?;
        if &magic != b"JMXVBMT" {
            return Err(anyhow!("Invalid BMT magic: {:?}", magic));
        }

        // Skip version bytes
        cursor.read_u8()?;
        cursor.read_u8()?;
        cursor.read_u8()?;
        cursor.read_u8()?;
        cursor.read_u8()?;

        // Read material count
        let count = cursor.read_u32::<LittleEndian>()? as usize;
        let mut materials = Vec::with_capacity(count);

        for _ in 0..count {
            let name = read_string(&mut cursor)?;

            // Read material properties
            let diffuse = [
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
            ];

            let ambient = [
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
            ];

            let specular = [
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
            ];

            let emissive = [
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
                cursor.read_f32::<LittleEndian>()?,
            ];

            let shininess = cursor.read_f32::<LittleEndian>()?;
            let flags = cursor.read_u32::<LittleEndian>()?;

            // Check for texture
            let texture = if flags & 0x100 != 0 {
                Some(read_string(&mut cursor)?)
            } else {
                None
            };

            // Skip some bytes if texture present
            if texture.is_some() {
                cursor.read_exact(&mut [0u8; 7])?;
            }

            // Check for normal map
            let normal_map = if flags & 0x2000 != 0 {
                Some(read_string(&mut cursor)?)
            } else {
                None
            };

            // Skip 4 bytes if normal map present
            if normal_map.is_some() {
                cursor.read_exact(&mut [0u8; 4])?;
            }

            materials.push(Material {
                name,
                diffuse,
                ambient,
                specular,
                emissive,
                shininess,
                flags,
                texture,
                normal_map,
            });
        }

        Ok(BMTFile {
            magic: String::from_utf8(magic.to_vec())?,
            materials,
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
