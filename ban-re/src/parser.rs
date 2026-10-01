/*!
 * Parser pour les fichiers BAN (format JMXVBAN documenté)
 *
 * Layout:
 *   12 B  signature "JMXVBAN 0102"
 *   u32   Int0 (0)
 *   u32   Int1 (0)
 *   u32   nameLength + name
 *   u32   durationMs, u32 fps, u32 type (0=OneShot, 1=Cyclic)
 *   u32   keyframeTimeCount + times[] (ms)
 *   u32   animatedBoneCount
 *   par os: u32 nameLength + name, u32 keyframeCount,
 *           keyframes × 28 B (quaternion xyzw + translation xyz)
 */

use crate::error::{BanError, BanResult};
use crate::types::*;
use std::fs::File;
use std::io::{BufReader, Read};
use std::path::Path;

pub struct BanParser {
    pub(crate) data: Vec<u8>,
}

impl BanParser {
    /// Crée un nouveau parser à partir d'un fichier
    pub fn from_file<P: AsRef<Path>>(path: P) -> BanResult<Self> {
        let file = File::open(path)?;
        let mut reader = BufReader::new(file);
        let mut data = Vec::new();
        reader.read_to_end(&mut data)?;
        Ok(BanParser { data })
    }

    /// Crée un nouveau parser à partir d'un buffer
    pub fn from_buffer(data: Vec<u8>) -> Self {
        BanParser { data }
    }

    /// Parse le fichier BAN complet
    pub fn parse(&self) -> BanResult<BanFile> {
        let d = &self.data;
        let mut c = Cursor { data: d, pos: 0 };

        // Signature (12 B)
        if d.len() < 12 || &d[0..8] != b"JMXVBAN " {
            return Err(BanError::InvalidSignature { found: d[..8.min(d.len())].to_vec() });
        }
        let mut signature = [0u8; 8];
        signature.copy_from_slice(&d[0..8]);
        let version = d[8];
        c.pos = 12;

        let flags = c.u32()?; // Int0 (toujours 0)
        let _int1 = c.u32()?; // Int1 (toujours 0)

        // Nom de l'animation
        let name_len = c.u32()? as usize;
        let animation_name = c.string(name_len)?;

        // Durée / fps / type
        let duration_ms = c.u32()?;
        let fps = c.u32()?;
        let cyclic = c.u32()?;

        // Table des temps de keyframes (ms)
        let time_count = c.u32()? as usize;
        let mut times = Vec::with_capacity(time_count);
        for _ in 0..time_count {
            times.push(c.u32()?);
        }

        // Os animés (liste séquentielle variable)
        let bone_count = c.u32()? as usize;
        let mut bones = Vec::with_capacity(bone_count);
        for _ in 0..bone_count {
            let bname_len = c.u32()? as usize;
            let bname = c.string(bname_len)?;
            let kf_count = c.u32()? as usize;
            let data_offset = c.pos;
            let mut keyframes = Vec::with_capacity(kf_count);
            for i in 0..kf_count {
                let rot = [c.f32()?, c.f32()?, c.f32()?, c.f32()?];
                let pos = [c.f32()?, c.f32()?, c.f32()?];
                let frame_index = times.get(i).copied().unwrap_or((i as u32) * (duration_ms / fps.max(1)));
                keyframes.push(KeyFrame {
                    frame_index,
                    position: Some(pos),
                    rotation: Some(rot),
                    scale: None,
                    raw_data: Vec::new(),
                });
            }
            bones.push(BoneData {
                name: bname,
                data_offset,
                keyframes,
            });
        }

        let frame_count = times.last().copied().unwrap_or(duration_ms) / fps.max(1);
        Ok(BanFile {
            header: BanHeader {
                signature,
                version,
                flags,
                frame_count,
                bone_count: bone_count as u32,
                animation_name,
                duration_ms,
                fps,
                cyclic,
            },
            offset_table: Vec::new(),
            bones,
        })
    }

    /// Retourne une référence aux données brutes
    pub fn data(&self) -> &[u8] {
        &self.data
    }

    /// Dump hexadécimal pour le débogage
    pub fn dump_hex(&self, start: usize, end: usize) -> String {
        let end = end.min(self.data.len());
        let mut out = String::new();
        for (i, b) in self.data[start..end].iter().enumerate() {
            if i % 16 == 0 {
                out.push_str(&format!("\n{:08X}: ", start + i));
            }
            out.push_str(&format!("{:02X} ", b));
        }
        out
    }
}

/// Curseur de lecture little-endian
struct Cursor<'a> {
    data: &'a [u8],
    pos: usize,
}

impl<'a> Cursor<'a> {
    fn u32(&mut self) -> BanResult<u32> {
        if self.pos + 4 > self.data.len() {
            return Err(BanError::UnexpectedEof { offset: self.pos, expected: 4 });
        }
        let v = u32::from_le_bytes(self.data[self.pos..self.pos + 4].try_into().unwrap());
        self.pos += 4;
        Ok(v)
    }

    fn f32(&mut self) -> BanResult<f32> {
        Ok(f32::from_bits(self.u32()?))
    }

    fn string(&mut self, len: usize) -> BanResult<String> {
        if self.pos + len > self.data.len() {
            return Err(BanError::UnexpectedEof { offset: self.pos, expected: len });
        }
        let s = String::from_utf8_lossy(&self.data[self.pos..self.pos + len]).to_string();
        self.pos += len;
        Ok(s)
    }
}
