/*!
 * BAN Keyframe Analyzer - Analyse détaillée du format des keyframes
 */

use ban_re::BanParser;
use std::env;
use std::fs::write;
use std::path::PathBuf;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("Usage: {} <ban_file>", args[0]);
        std::process::exit(1);
    }

    let path = &args[1];

    println!("╔══════════════════════════════════════════════════════════╗");
    println!("║     BAN Keyframe Deep Analysis                          ║");
    println!("╚══════════════════════════════════════════════════════════╝\n");

    let parser = match BanParser::from_file(path) {
        Ok(p) => p,
        Err(e) => {
            eprintln!("❌ Error loading file: {}", e);
            std::process::exit(1);
        }
    };

    let data = parser.data();

    // Trouver Bone10_LRoom et analyser ses keyframes
    println!("=== ANALYZING Bone10_LRoom KEYFRAMES ===\n");

    // Bone10_LRoom commence à 0x5F, le nom se termine à 0x6C
    let bone_data_start = 0x6D; // Après le null terminator

    println!("Bone data starts at: 0x{:04X}\n", bone_data_start);

    // Analyser comme keyframes de 16 bytes
    println!("=== 16-BYTE KEYFRAME HYPOTHESIS ===\n");

    let mut keyframe_16_count = 0;
    let mut offset = bone_data_start;

    while offset + 16 <= data.len() && keyframe_16_count < 20 {
        print!("KF[{:2}] @0x{:04X}: ", keyframe_16_count, offset);

        // Afficher les 16 bytes
        for i in 0..16 {
            print!("{:02X} ", data[offset + i]);
            if i == 7 || i == 15 {
                print!(" ");
            }
        }

        // Interpréter comme 4 floats (4 bytes chacun)
        let f0 = f32::from_le_bytes(data[offset..offset+4].try_into().unwrap());
        let f1 = f32::from_le_bytes(data[offset+4..offset+8].try_into().unwrap());
        let f2 = f32::from_le_bytes(data[offset+8..offset+12].try_into().unwrap());
        let f3 = f32::from_le_bytes(data[offset+12..offset+16].try_into().unwrap());

        print!("| ");
        if f0.is_finite() && f0.abs() < 1000.0 {
            print!("{:8.3} ", f0);
        } else {
            print!("   ---   ");
        }

        if f1.is_finite() && f1.abs() < 1000.0 {
            print!("{:8.3} ", f1);
        } else {
            print!("   ---   ");
        }

        if f2.is_finite() && f2.abs() < 1000.0 {
            print!("{:8.3} ", f2);
        } else {
            print!("   ---   ");
        }

        if f3.is_finite() && f3.abs() < 1000.0 {
            print!("{:8.3} ", f3);
        } else {
            print!("   ---   ");
        }

        println!();

        keyframe_16_count += 1;
        offset += 16;

        // Limite pour éviter trop d'affichage
        if keyframe_16_count >= 20 {
            break;
        }
    }

    println!("\n=== 32-BYTE KEYFRAME HYPOTHESIS ===\n");

    let mut keyframe_32_count = 0;
    let mut offset = bone_data_start;

    while offset + 32 <= data.len() && keyframe_32_count < 10 {
        print!("KF[{:2}] @0x{:04X}: ", keyframe_32_count, offset);

        // Interpréter comme 8 floats (4 bytes chacun)
        let floats: Vec<f32> = (0..8)
            .map(|i| {
                let start = offset + (i * 4);
                f32::from_le_bytes(data[start..start+4].try_into().unwrap())
            })
            .collect();

        // Afficher les floats valides
        for (i, &f) in floats.iter().enumerate() {
            if f.is_finite() && f.abs() < 1000.0 {
                print!("{:8.3} ", f);
            } else {
                print!("   ---   ");
            }

            if i == 3 {
                print!("| ");
            }
        }

        println!();

        keyframe_32_count += 1;
        offset += 32;

        // Limite pour éviter trop d'affichage
        if keyframe_32_count >= 10 {
            break;
        }
    }

    println!("\n=== PATTERN DETECTION ===\n");

    // Chercher des patterns dans les données
    let pattern_size = 16;
    let first_pattern = &data[bone_data_start..bone_data_start + pattern_size];

    println!("First 16-byte pattern:");
    for i in 0..pattern_size {
        print!("{:02X} ", first_pattern[i]);
        if (i + 1) % 8 == 0 {
            print!(" ");
        }
    }
    println!("\n");

    // Compter les répétitions exactes
    let mut exact_repeats = 0;
    let mut offset = bone_data_start;
    while offset + pattern_size <= data.len() && offset < bone_data_start + 500 {
        if &data[offset..offset + pattern_size] == first_pattern {
            exact_repeats += 1;
        }
        offset += pattern_size;
    }

    println!("Exact pattern repetitions: {}", exact_repeats);

    // Chercher les variations
    println!("\nPattern variations (first 10):");
    let mut variations: Vec<Vec<u8>> = Vec::new();

    offset = bone_data_start;
    while offset + pattern_size <= data.len() && variations.len() < 10 {
        let pattern = data[offset..offset + pattern_size].to_vec();

        // Vérifier si c'est une nouvelle variation
        if !variations.iter().any(|v| v.as_slice() == pattern.as_slice()) {
            variations.push(pattern);
        }

        offset += pattern_size;
    }

    for (i, pattern) in variations.iter().enumerate() {
        print!("  Var[{}]: ", i);
        for (j, byte) in pattern.iter().enumerate() {
            if *byte != first_pattern[j] {
                print!("{:02X}[@{}] ", byte, j);
            }
        }
        println!();
    }

    // Analyser Bone10_00 pour comparer
    println!("\n=== COMPARING WITH Bone10_00 ===\n");

    // Bone10_00 est à 0x153, nom se termine à 0x15F
    let bone2_start = 0x160; // Après "Bone10_00" + 0x08 + 0x00

    println!("Bone10_00 data starts at: 0x{:04X}\n", bone2_start);

    println!("First 10 keyframes (16-byte):");
    for i in 0..10 {
        let offset = bone2_start + (i * 16);
        if offset + 16 > data.len() {
            break;
        }

        print!("KF[{:2}] @0x{:04X}: ", i, offset);

        let floats: Vec<f32> = (0..4)
            .map(|j| {
                let start = offset + (j * 4);
                f32::from_le_bytes(data[start..start+4].try_into().unwrap())
            })
            .collect();

        for (j, &f) in floats.iter().enumerate() {
            if f.is_finite() && f.abs() < 1000.0 {
                print!("{:8.3} ", f);
            } else {
                print!("   ---   ");
            }
        }

        println!();
    }

    // Créer un rapport détaillé
    let report = generate_detailed_report(&data, bone_data_start, bone2_start);

    let report_path = PathBuf::from("keyframe_analysis.txt");
    match write(&report_path, report) {
        Ok(_) => println!("\n✅ Detailed report saved: {}", report_path.display()),
        Err(e) => eprintln!("❌ Failed to write report: {}", e),
    }

    println!("\n✅ Analysis complete!");
}

fn generate_detailed_report(data: &[u8], bone1_start: usize, _bone2_start: usize) -> String {
    let mut report = String::new();

    report.push_str("BAN KEYFRAME FORMAT ANALYSIS REPORT\n");
    report.push_str("====================================\n\n");

    // Analyser Bone10_LRoom
    report.push_str("## Bone10_LRoom Analysis\n\n");

    report.push_str("### Raw Data (first 320 bytes)\n\n");
    let end = std::cmp::min(bone1_start + 320, data.len());

    for offset in (bone1_start..end).step_by(16) {
        report.push_str(&format!("{:04X}: ", offset));

        for i in 0..16 {
            if offset + i < data.len() {
                report.push_str(&format!("{:02X} ", data[offset + i]));
            }
            if i == 7 {
                report.push_str(" ");
            }
        }

        report.push_str(" | ");

        // Interprétation comme floats
        for i in 0..4 {
            let start = offset + (i * 4);
            if start + 4 <= data.len() {
                let f = f32::from_le_bytes(data[start..start+4].try_into().unwrap());
                if f.is_finite() && f.abs() < 10000.0 {
                    report.push_str(&format!("{:10.4}", f));
                } else {
                    report.push_str("   -----   ");
                }
            }
        }

        report.push_str("\n");
    }

    report.push_str("\n## Hypothesis\n\n");
    report.push_str("Based on the analysis, the keyframe format appears to be:\n");
    report.push_str("- Size: 16 bytes per keyframe (not 32 as initially thought)\n");
    report.push_str("- Structure: 4 x 32-bit floats (little endian)\n");
    report.push_str("- Possible layout: X, Y, Z, W (position or quaternion)\n\n");

    report.push_str("## Next Steps\n\n");
    report.push_str("1. Verify if these are position or rotation values\n");
    report.push_str("2. Check for compression or encoding\n");
    report.push_str("3. Compare with other bone data to find patterns\n");

    report
}
