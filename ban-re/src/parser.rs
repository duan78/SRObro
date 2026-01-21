/*!
 * Parser pour les fichiers BAN
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
        // Parser le header
        let header = self.parse_header()?;

        // Parser la table des offsets
        let offset_table = self.parse_offset_table()?;

        // Parser les données d'os
        let bones = self.parse_bones(&offset_table)?;

        Ok(BanFile {
            header,
            offset_table,
            bones,
        })
    }

    /// Retourne une référence aux données brutes
    pub fn data(&self) -> &[u8] {
        &self.data
    }

    /// Parse le header du fichier BAN
    fn parse_header(&self) -> BanResult<BanHeader> {
        if self.data.len() < 32 {
            return Err(BanError::UnexpectedEof {
                offset: 0,
                expected: 32,
            });
        }

        // Lire la signature
        let mut signature = [0u8; 8];
        signature.copy_from_slice(&self.data[0..8]);

        // Vérifier la signature
        if &signature != b"JMXVBAN " {
            return Err(BanError::InvalidSignature {
                found: signature.to_vec(),
            });
        }

        // Version
        let version = self.data[8];

        // Flags (4 bytes à l'offset 12)
        let flags = u32::from_le_bytes(self.data[12..16].try_into().unwrap());

        // Frame count (4 bytes à l'offset 16)
        let frame_count = u32::from_le_bytes(self.data[16..20].try_into().unwrap());

        // Bone count (4 bytes à l'offset 20)
        let bone_count = u32::from_le_bytes(self.data[20..24].try_into().unwrap());

        // Animation name (string null-terminated à partir de l'offset 24)
        let name_start = 24;
        let name_end = self.data[name_start..]
            .iter()
            .position(|&b| b == 0)
            .ok_or_else(|| BanError::ParseError {
                message: "No null terminator found for animation name".to_string(),
            })? + name_start;

        let animation_name = String::from_utf8(self.data[name_start..name_end].to_vec())?;

        Ok(BanHeader {
            signature,
            version,
            flags,
            frame_count,
            bone_count,
            animation_name,
        })
    }

    /// Parse la table des offsets (commence à 0x28)
    fn parse_offset_table(&self) -> BanResult<Vec<OffsetEntry>> {
        let mut offsets = Vec::new();
        let mut offset = 0x28;

        while offset + 2 <= self.data.len() {
            let value = u16::from_le_bytes(self.data[offset..offset + 2].try_into().unwrap());

            // 0x0000 marque la fin de la table
            if value == 0 {
                break;
            }

            offsets.push(OffsetEntry { offset: value });

            // Limite de sécurité pour éviter boucle infinie
            if offsets.len() > 1000 {
                return Err(BanError::ParseError {
                    message: "Offset table too large, possible corrupted data".to_string(),
                });
            }

            offset += 2;
        }

        Ok(offsets)
    }

    /// Parse les données d'os
    fn parse_bones(&self, _offset_table: &[OffsetEntry]) -> BanResult<Vec<BoneData>> {
        let mut bones = Vec::new();

        // Scanner pour trouver les noms d'os
        let mut search_offset = 0x30;

        while search_offset < std::cmp::min(self.data.len(), 0x2000) {
            // Chercher un début de nom d'os
            if self.looks_like_bone_name(search_offset) {
                let bone_name = self.read_bone_name(search_offset)?;

                if bone_name.len() <= 3 {
                    search_offset += 1;
                    continue;
                }

                // Lire les keyframes
                let data_offset = search_offset + bone_name.len() + 1;
                let keyframes = self.parse_keyframes(data_offset, 1000);

                if !keyframes.is_empty() {
                    let estimated_size = keyframes.len() * 32;

                    bones.push(BoneData {
                        name: bone_name.clone(),
                        data_offset: search_offset,
                        keyframes,
                    });

                    // Avancer à la fin des données
                    search_offset = data_offset + estimated_size;
                } else {
                    search_offset += 1;
                }
            } else {
                search_offset += 1;
            }
        }

        Ok(bones)
    }

    /// Vérifie si une position ressemble à un nom d'os
    fn looks_like_bone_name(&self, offset: usize) -> bool {
        if offset >= self.data.len() {
            return false;
        }

        let first = self.data[offset];
        if !first.is_ascii_alphabetic() {
            return false;
        }

        // Vérifier les 20 prochains caractères
        for i in 0..std::cmp::min(20, self.data.len() - offset) {
            let byte = self.data[offset + i];

            if byte == 0 {
                return true; // Null terminator trouvé
            }

            if !byte.is_ascii_alphanumeric() && byte != b'_' {
                return false;
            }
        }

        false
    }

    /// Lit un nom d'os jusqu'au null terminator
    fn read_bone_name(&self, offset: usize) -> BanResult<String> {
        let end = self.data[offset..]
            .iter()
            .position(|&b| b == 0)
            .ok_or_else(|| BanError::ParseError {
                message: format!("No null terminator found at offset 0x{:04X}", offset),
            })?;

        String::from_utf8(self.data[offset..offset + end].to_vec()).map_err(Into::into)
    }

    /// Parse les keyframes pour un os
    fn parse_keyframes(&self, start_offset: usize, max_count: usize) -> Vec<KeyFrame> {
        let mut keyframes = Vec::new();

        for i in 0..max_count {
            let offset = start_offset + (i * 32);

            if offset + 32 > self.data.len() {
                break;
            }

            // Essayer de lire une keyframe
            match self.try_parse_keyframe(offset) {
                Some(kf) => {
                    keyframes.push(kf);
                }
                None => {
                    // Si on a déjà trouvé des keyframes valides, on arrête
                    if !keyframes.is_empty() {
                        break;
                    }
                }
            }
        }

        keyframes
    }

    /// Tente de parser une keyframe à un offset donné
    fn try_parse_keyframe(&self, offset: usize) -> Option<KeyFrame> {
        let raw_data = self.data[offset..offset + 32].to_vec();

        // Lire le frame index
        let frame_index = u32::from_le_bytes(raw_data[0..4].try_into().ok()?);

        // Validation basique: frame index doit être raisonnable
        if frame_index > 100000 {
            return None;
        }

        // Lire les données comme floats
        let p0 = f32::from_le_bytes(raw_data[4..8].try_into().ok()?);
        let p1 = f32::from_le_bytes(raw_data[8..12].try_into().ok()?);
        let p2 = f32::from_le_bytes(raw_data[12..16].try_into().ok()?);

        // Vérifier si ce sont des valeurs valides
        if !p0.is_finite() || !p1.is_finite() || !p2.is_finite() {
            return None;
        }

        // Lire la rotation (quaternion)
        let r0 = f32::from_le_bytes(raw_data[16..20].try_into().ok()?);
        let r1 = f32::from_le_bytes(raw_data[20..24].try_into().ok()?);
        let r2 = f32::from_le_bytes(raw_data[24..28].try_into().ok()?);
        let r3 = f32::from_le_bytes(raw_data[28..32].try_into().ok()?);

        // Vérifier la magnitude du quaternion
        let quat_mag = (r0 * r0 + r1 * r1 + r2 * r2 + r3 * r3).sqrt();

        // Un quaternion valide devrait avoir une magnitude proche de 1.0
        if quat_mag < 0.1 || quat_mag > 10.0 {
            return None;
        }

        Some(KeyFrame {
            frame_index,
            position: Some([p0, p1, p2]),
            rotation: Some([r0, r1, r2, r3]),
            scale: None,
            raw_data,
        })
    }

    /// Analyse les patterns dans les données brutes
    pub fn analyze_patterns(&self) -> Vec<PatternInfo> {
        let mut patterns = Vec::new();

        // Chercher les patterns répétitifs après les noms d'os
        let search_starts = vec![0x6D, 0x153, 0x244]; // Exemples de offsets connus

        for start in search_starts {
            if start + 100 > self.data.len() {
                continue;
            }

            // Chercher un pattern de 16 bytes qui se répète
            let pattern_size = 16;
            let pattern = &self.data[start..start + pattern_size];

            // Compter les occurrences
            let mut occurrences = 0;
            let mut offset = start;
            while offset + pattern_size <= self.data.len() && offset < start + 500 {
                if &self.data[offset..offset + pattern_size] == pattern {
                    occurrences += 1;
                }
                offset += pattern_size;
            }

            if occurrences > 2 {
                patterns.push(PatternInfo {
                    offset: start,
                    size: pattern_size,
                    occurrences,
                    description: format!("Repeating pattern starting at 0x{:04X}", start),
                });
            }
        }

        patterns
    }

    /// Exporte les données en hexadécimal pour analyse
    pub fn dump_hex(&self, start: usize, end: usize) -> String {
        let mut output = String::new();

        for offset in (start..end).step_by(16) {
            if offset + 16 > self.data.len() {
                break;
            }

            // Offset en hex
            output.push_str(&format!("{:04X}: ", offset));

            // Bytes en hex
            for i in 0..16 {
                output.push_str(&format!("{:02X} ", self.data[offset + i]));
                if i == 7 {
                    output.push_str(" ");
                }
            }

            // Représentation ASCII
            output.push_str(" |");
            for i in 0..16 {
                let byte = self.data[offset + i];
                if byte.is_ascii() && !byte.is_ascii_control() {
                    output.push(byte as char);
                } else {
                    output.push('.');
                }
            }
            output.push_str("|\n");
        }

        output
    }
}
