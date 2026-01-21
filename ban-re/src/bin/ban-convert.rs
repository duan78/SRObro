/*!
 * BAN Converter - Convertit les fichiers BAN en JSON/Babylon.js
 *
 * FORMAT DÉCOUVERT:
 * - Keyframe size: 12 bytes
 * - Structure: 3 x 32-bit floats (little endian)
 * - Content: Probablement X, Y, Z (rotation Euler ou position)
 */

use ban_re::BanParser;
use serde::Serialize;
use std::env;
use std::fs::write;
use std::path::PathBuf;

#[derive(Debug, Serialize)]
struct BoneKeyframe {
    frame: usize,
    values: [f32; 3], // x, y, z
}

#[derive(Debug, Serialize)]
struct BoneAnimation {
    name: String,
    keyframes: Vec<BoneKeyframe>,
}

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("Usage: {} <ban_file> [output_format]", args[0]);
        eprintln!("  output_format: json (default), babylon, ron");
        std::process::exit(1);
    }

    let path = &args[1];
    let output_format = args.get(2).map(|s| s.as_str()).unwrap_or("json");

    println!("╔══════════════════════════════════════════════════════════╗");
    println!("║     BAN Converter                                        ║");
    println!("╚══════════════════════════════════════════════════════════╝\n");

    let parser = match BanParser::from_file(path) {
        Ok(p) => p,
        Err(e) => {
            eprintln!("❌ Error loading file: {}", e);
            std::process::exit(1);
        }
    };

    let data = parser.data();

    // Parser tous les os
    let bones = parse_all_bones(data);

    println!("Found {} bones\n", bones.len());

    // Afficher un résumé
    for bone in &bones {
        println!("  Bone '{}': {} keyframes", bone.name, bone.keyframes.len());
    }

    // Exporter selon le format demandé
    match output_format {
        "json" => export_json(&bones, path),
        "babylon" => export_babylon(&bones, path),
        "ron" => export_ron(&bones, path),
        _ => eprintln!("Unknown format: {}", output_format),
    }

    println!("\n✅ Conversion complete!");
}

fn parse_all_bones(data: &[u8]) -> Vec<BoneAnimation> {
    let mut bones = Vec::new();

    let mut offset = 0x30; // Commencer après le header

    while offset < std::cmp::min(data.len(), 0x2000) {
        // Chercher un nom d'os
        if !looks_like_bone_name(data, offset) {
            offset += 1;
            continue;
        }

        // Lire le nom
        let name_end = find_bone_name_end(data, offset);
        let name = String::from_utf8_lossy(&data[offset..name_end])
            .replace("\x08", "")
            .to_string();

        if name.len() <= 3 || !name.contains("Bone") {
            offset = name_end + 1;
            continue;
        }

        // Trouver la fin des données (prochain os ou fin du fichier)
        let data_start = name_end + 1;
        let data_end = find_next_bone(data, data_start);

        // Parser les keyframes (12 bytes chacune)
        let keyframes = parse_keyframes_12byte(data, data_start, data_end);

        if !keyframes.is_empty() {
            bones.push(BoneAnimation {
                name,
                keyframes,
            });
        }

        offset = data_end;
    }

    bones
}

fn looks_like_bone_name(data: &[u8], offset: usize) -> bool {
    if offset >= data.len() {
        return false;
    }

    let first = data[offset];
    if !first.is_ascii_alphabetic() {
        return false;
    }

    // Vérifier qu'on a un nom valide
    let mut i = 0;
    while offset + i < data.len() && i < 50 {
        let byte = data[offset + i];

        if byte == 0 {
            return true; // Null terminator
        }

        if !byte.is_ascii_alphanumeric() && byte != b'_' && byte != 0x08 {
            return false;
        }

        i += 1;
    }

    false
}

fn find_bone_name_end(data: &[u8], offset: usize) -> usize {
    let mut end = offset;
    while end < data.len() && data[end] != 0 {
        end += 1;
    }
    end
}

fn find_next_bone(data: &[u8], start: usize) -> usize {
    // Chercher "Bone" après start
    for offset in start..data.len() {
        if offset + 4 <= data.len() && &data[offset..offset+4] == b"Bone" {
            return offset;
        }
    }

    data.len()
}

fn parse_keyframes_12byte(data: &[u8], start: usize, end: usize) -> Vec<BoneKeyframe> {
    let mut keyframes = Vec::new();

    let mut offset = start;
    let mut frame_index = 0;

    while offset + 12 <= end {
        // Lire les 3 floats
        let f0 = f32::from_le_bytes(data[offset..offset+4].try_into().unwrap());
        let f1 = f32::from_le_bytes(data[offset+4..offset+8].try_into().unwrap());
        let f2 = f32::from_le_bytes(data[offset+8..offset+12].try_into().unwrap());

        // Vérifier si ce sont des valeurs valides
        if f0.is_finite() && f1.is_finite() && f2.is_finite() {
            keyframes.push(BoneKeyframe {
                frame: frame_index,
                values: [f0, f1, f2],
            });
            frame_index += 1;
        }

        offset += 12;

        // Limite de sécurité
        if keyframes.len() > 10000 {
            break;
        }
    }

    keyframes
}

fn export_json(bones: &[BoneAnimation], input_path: &str) {
    let json_output = serde_json::to_string_pretty(bones).unwrap();

    let output_path = PathBuf::from(input_path)
        .with_extension("json");

    match write(&output_path, json_output) {
        Ok(_) => println!("✅ Exported to JSON: {}", output_path.display()),
        Err(e) => eprintln!("❌ Failed to write JSON: {}", e),
    }
}

fn export_ron(bones: &[BoneAnimation], input_path: &str) {
    let ron_output = ron::ser::to_string_pretty(bones, ron::ser::PrettyConfig::default()).unwrap();

    let output_path = PathBuf::from(input_path)
        .with_extension("ron");

    match write(&output_path, ron_output) {
        Ok(_) => println!("✅ Exported to RON: {}", output_path.display()),
        Err(e) => eprintln!("❌ Failed to write RON: {}", e),
    }
}

fn export_babylon(bones: &[BoneAnimation], input_path: &str) {
    let mut output = String::new();

    output.push_str("// Auto-generated from BAN file\n");
    output.push_str("// Format: 12-byte keyframes (3 floats)\n\n");
    output.push_str("import { Animation } from \"@babylonjs/core\";\n\n");

    output.push_str("export function createBANAnimations() {\n");
    output.push_str("    const animations = [];\n\n");

    for bone in bones {
        if bone.keyframes.is_empty() {
            continue;
        }

        output.push_str(&format!("    // Bone: {} ({} keyframes)\n", bone.name, bone.keyframes.len()));
        output.push_str(&format!("    const {}_anim = new Animation(\n", sanitize_name(&bone.name)));
        output.push_str("        \"rotation\",\n");
        output.push_str("        30,\n");
        output.push_str("        Animation.ANIMATIONTYPE_VECTOR3,\n");
        output.push_str("        Animation.ANIMATIONLOOPMODE_CYCLE\n");
        output.push_str("    );\n\n");

        output.push_str("    const keys = [\n");

        for kf in bone.keyframes.iter().take(10) { // Limiter à 10 pour l'affichage
            output.push_str(&format!("        {{ frame: {}, value: new Vector3({}, {}, {}) }},\n",
                kf.frame, kf.values[0], kf.values[1], kf.values[2]));
        }

        output.push_str("    ];\n\n");
        output.push_str(&format!("    {}_anim.setKeys(keys);\n", sanitize_name(&bone.name)));
        output.push_str(&format!("    animations.push({}_anim);\n\n", sanitize_name(&bone.name)));
    }

    output.push_str("    return animations;\n");
    output.push_str("}\n");

    let output_path = PathBuf::from(input_path)
        .with_extension("babylon.ts");

    match write(&output_path, output) {
        Ok(_) => println!("✅ Exported to Babylon.js: {}", output_path.display()),
        Err(e) => eprintln!("❌ Failed to write Babylon: {}", e),
    }
}

fn sanitize_name(name: &str) -> String {
    name.replace(|c: char| !c.is_alphanumeric() && c != '_', "_")
}
