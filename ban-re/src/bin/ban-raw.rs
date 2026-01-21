/*!
 * BAN Raw Extractor - Extrait les données brutes pour analyse
 */

use ban_re::BanParser;
use std::env;
use std::fs::write;
use std::path::PathBuf;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("Usage: {} <ban_file> [output_dir]", args[0]);
        std::process::exit(1);
    }

    let path = &args[1];
    let output_dir = args.get(2).map(|s| s.as_str()).unwrap_or("./ban_analysis");

    println!("╔══════════════════════════════════════════════════════════╗");
    println!("║     BAN Raw Data Extractor                              ║");
    println!("╚══════════════════════════════════════════════════════════╝\n");

    println!("Analyzing: {}\n", path);

    let parser = match BanParser::from_file(path) {
        Ok(p) => p,
        Err(e) => {
            eprintln!("❌ Error loading file: {}", e);
            std::process::exit(1);
        }
    };

    // Scanner pour trouver tous les noms d'os
    println!("=== SCANNING FOR BONES ===\n");

    let data = parser.data();
    let mut bones_found = Vec::new();

    let mut offset = 0x30;
    while offset < std::cmp::min(data.len(), 0x2000) {
        // Chercher un début de nom
        let first = data[offset];
        if !first.is_ascii_alphabetic() {
            offset += 1;
            continue;
        }

        // Trouver la fin du nom
        let mut end = offset;
        while end < data.len() && data[end] != 0 {
            // Ignorer les backspaces (0x08)
            if data[end] == 0x08 {
                end += 1;
                if end < data.len() && data[end] == 0 {
                    break;
                }
                continue;
            }

            if !data[end].is_ascii_alphanumeric() && data[end] != b'_' {
                break;
            }
            end += 1;
        }

        if end > offset + 3 { // Au moins 3 caractères
            let name = String::from_utf8_lossy(&data[offset..end])
                .replace("\x08", "")
                .to_string();

            if name.contains("Bone") || name.contains("Bip") || name.contains("one") {
                println!("Found bone at 0x{:04X}: \"{}\"", offset, name);

                // Extraire les 512 bytes suivants pour analyse
                let start = end + 1;
                let end_data = std::cmp::min(start + 512, data.len());
                let bone_data = &data[start..end_data];

                bones_found.push((name.clone(), offset, bone_data.to_vec()));

                // Afficher le dump hex
                println!("  Raw data (first 128 bytes):");
                for line_offset in (0..bone_data.len()).step_by(16).take(8) {
                    print!("    {:04X}: ", line_offset);
                    for i in 0..16 {
                        if line_offset + i < bone_data.len() {
                            print!("{:02X} ", bone_data[line_offset + i]);
                        } else {
                            print!("   ");
                        }
                        if i == 7 { print!(" "); }
                    }
                    print!(" |");
                    for i in 0..16 {
                        if line_offset + i < bone_data.len() {
                            let byte = bone_data[line_offset + i];
                            if byte.is_ascii() && !byte.is_ascii_control() {
                                print!("{}", byte as char);
                            } else {
                                print!(".");
                            }
                        }
                    }
                    println!("|");
                }
                println!();
            }
        }

        offset = end + 1;
    }

    println!("Total bones found: {}", bones_found.len());

    // Exporter les données brutes
    println!("\n=== EXPORTING RAW DATA ===\n");

    let output_path = PathBuf::from(output_dir);
    std::fs::create_dir_all(&output_path).unwrap();

    for (name, _offset, data) in &bones_found {
        let filename = format!("{}_raw.bin", name.replace("/", "_"));
        let filepath = output_path.join(&filename);

        match write(&filepath, data) {
            Ok(_) => println!("✅ Exported: {}", filepath.display()),
            Err(e) => eprintln!("❌ Failed to write {}: {}", filepath.display(), e),
        }
    }

    // Créer un rapport d'analyse
    let report_path = output_path.join("analysis_report.txt");
    let mut report = String::new();

    report.push_str("BAN FILE RAW ANALYSIS REPORT\n");
    report.push_str("===========================\n\n");

    for (name, offset, data) in &bones_found {
        report.push_str(&format!("Bone: {}\n", name));
        report.push_str(&format!("Offset: 0x{:04X}\n", offset));
        report.push_str(&format!("Data size: {} bytes\n\n", data.len()));

        // Analyser les patterns
        report.push_str("First 64 bytes (hex):\n");
        for line_offset in (0..data.len()).step_by(16).take(4) {
            report.push_str(&format!("  "));
            for i in 0..16 {
                if line_offset + i < data.len() {
                    report.push_str(&format!("{:02X} ", data[line_offset + i]));
                }
            }
            report.push_str("\n");
        }
        report.push_str("\n");
    }

    match write(&report_path, report) {
        Ok(_) => println!("✅ Report saved: {}", report_path.display()),
        Err(e) => eprintln!("❌ Failed to write report: {}", e),
    }

    println!("\n✅ Extraction complete!");
}
