/*!
 * BAN Analyze - Analyse approfondie des fichiers BAN pour reverse engineering
 */

use ban_re::BanParser;
use std::env;

fn main() {
    env_logger::init();

    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("Usage: {} <ban_file>", args[0]);
        eprintln!("Example: {} data/flame_lroom_mid.ban", args[0]);
        std::process::exit(1);
    }

    let path = &args[1];

    println!("╔══════════════════════════════════════════════════════════╗");
    println!("║     BAN Deep Analysis                                    ║");
    println!("╚══════════════════════════════════════════════════════════╝\n");

    println!("Analyzing: {}\n", path);

    // Parser le fichier
    let parser = match BanParser::from_file(path) {
        Ok(p) => p,
        Err(e) => {
            eprintln!("❌ Error loading file: {}", e);
            std::process::exit(1);
        }
    };

    // Afficher le dump hex du header
    println!("=== HEADER HEX DUMP ===\n");
    println!("{}", parser.dump_hex(0x00, 0x40));

    // Afficher la table des offsets
    println!("\n=== OFFSET TABLE (starting at 0x28) ===\n");
    println!("{}", parser.dump_hex(0x28, 0x50));

    // Analyser les patterns
    println!("\n=== PATTERN ANALYSIS ===\n");
    let patterns = parser.analyze_patterns();
    if patterns.is_empty() {
        println!("No obvious repeating patterns found.");
    } else {
        for pattern in &patterns {
            println!("🔍 {}", pattern);
        }
    }

    // Afficher les données d'os
    println!("\n=== BONE DATA REGIONS ===\n");
    println!("Searching for bone names in the file...\n");

    let known_offsets = vec![
        (0x5F, "Bone10_LRoom"),
        (0x153, "Bone10_00"),
        (0x244, "Bone10_03"),
    ];

    for (offset, expected_name) in known_offsets {
        println!("Expected '{}' at 0x{:04X}:", expected_name, offset);
        println!("{}", parser.dump_hex(offset, offset + 64));
        println!();
    }

    // Analyse complète
    println!("=== FULL PARSING ATTEMPT ===\n");
    match parser.parse() {
        Ok(ban_file) => {
            println!("✅ Successfully parsed!");
            println!("{}", ban_file);

            // Exporter en JSON
            if let Ok(json) = serde_json::to_string_pretty(&ban_file) {
                println!("\n=== JSON OUTPUT ===\n");
                println!("{}", json);
            }
        }
        Err(e) => {
            println!("⚠️  Partial parsing error: {}", e);
            println!("This is expected - the format is still being reverse engineered.");
        }
    }
}
