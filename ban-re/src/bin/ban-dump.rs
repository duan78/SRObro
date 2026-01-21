/*!
 * BAN Dump - Affiche les informations d'un fichier BAN
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
    println!("║     BAN File Dump                                        ║");
    println!("╚══════════════════════════════════════════════════════════╝\n");

    println!("Loading: {}\n", path);

    // Parser le fichier
    let parser = match BanParser::from_file(path) {
        Ok(p) => p,
        Err(e) => {
            eprintln!("❌ Error loading file: {}", e);
            std::process::exit(1);
        }
    };

    // Dump le header
    match parser.parse() {
        Ok(ban_file) => {
            println!("{}", ban_file);
        }
        Err(e) => {
            eprintln!("❌ Error parsing file: {}", e);

            // Même en cas d'erreur, afficher un dump hex
            println!("\n=== HEX DUMP (first 512 bytes) ===\n");
            println!("{}", parser.dump_hex(0, 512));
        }
    }
}
