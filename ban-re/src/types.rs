/*!
 * Types et structures pour les fichiers BAN
 */

use serde::{Deserialize, Serialize};
use std::fmt;

/// Header d'un fichier BAN
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BanHeader {
    /// Signature du fichier (doit être "JMXVBAN ")
    pub signature: [u8; 8],

    /// Version du format
    pub version: u8,

    /// Flags (inconnus pour le moment)
    pub flags: u32,

    /// Nombre de frames dans l'animation
    pub frame_count: u32,

    /// Nombre d'os
    pub bone_count: u32,

    /// Nom de l'animation
    pub animation_name: String,
}

impl fmt::Display for BanHeader {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "BanHeader(signature={:?}, version={}, frames={}, bones={}, name=\"{}\")",
            String::from_utf8_lossy(&self.signature),
            self.version,
            self.frame_count,
            self.bone_count,
            self.animation_name
        )
    }
}

/// Entrée dans la table des offsets
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct OffsetEntry {
    /// Offset vers les données de l'os
    pub offset: u16,
}

/// Données d'animation pour un os
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BoneData {
    /// Nom de l'os
    pub name: String,

    /// Offset dans le fichier où commencent les données
    pub data_offset: usize,

    /// Keyframes pour cet os
    pub keyframes: Vec<KeyFrame>,
}

impl fmt::Display for BoneData {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "BoneData(name=\"{}\", offset=0x{:04X}, {} keyframes)",
            self.name, self.data_offset, self.keyframes.len()
        )
    }
}

/// Une keyframe d'animation
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct KeyFrame {
    /// Index de la frame
    pub frame_index: u32,

    /// Position (optionnel, peut ne pas être présent)
    pub position: Option<[f32; 3]>,

    /// Rotation (quaternion)
    pub rotation: Option<[f32; 4]>,

    /// Scale (optionnel)
    pub scale: Option<[f32; 3]>,

    /// Données brutes pour analyse
    #[serde(skip)]
    pub raw_data: Vec<u8>,
}

impl fmt::Display for KeyFrame {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(f, "KF[{}]", self.frame_index)?;
        if let Some(pos) = &self.position {
            write!(f, " pos=({:.2},{:.2},{:.2})", pos[0], pos[1], pos[2])?;
        }
        if let Some(rot) = &self.rotation {
            write!(f, " rot=({:.3},{:.3},{:.3},{:.3})", rot[0], rot[1], rot[2], rot[3])?;
        }
        if let Some(scale) = &self.scale {
            write!(f, " scale=({:.2},{:.2},{:.2})", scale[0], scale[1], scale[2])?;
        }
        Ok(())
    }
}

/// Fichier BAN complet
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct BanFile {
    /// Header du fichier
    pub header: BanHeader,

    /// Table des offsets
    pub offset_table: Vec<OffsetEntry>,

    /// Données d'animation par os
    pub bones: Vec<BoneData>,
}

impl fmt::Display for BanFile {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        writeln!(f, "=== BAN File ===")?;
        writeln!(f, "{}", self.header)?;
        writeln!(f, "Offsets: {}", self.offset_table.len())?;
        writeln!(f, "Bones: {}", self.bones.len())?;
        for bone in &self.bones {
            writeln!(f, "  {}", bone)?;
        }
        Ok(())
    }
}

/// Informations de pattern détecté dans les données
#[derive(Debug, Clone)]
pub struct PatternInfo {
    /// Offset où le pattern commence
    pub offset: usize,

    /// Taille du pattern en bytes
    pub size: usize,

    /// Nombre d'occurrences
    pub occurrences: usize,

    /// Description du pattern
    pub description: String,
}

impl fmt::Display for PatternInfo {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        write!(
            f,
            "Pattern at 0x{:04X}: {} bytes, {}x - {}",
            self.offset, self.size, self.occurrences, self.description
        )
    }
}
