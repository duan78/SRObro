/*!
 * BAN Format Detector - Détecte automatiquement le format des keyframes
 */

use ban_re::BanParser;
use std::env;

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 2 {
        eprintln!("Usage: {} <ban_file>", args[0]);
        std::process::exit(1);
    }

    let path = &args[1];

    println!("╔══════════════════════════════════════════════════════════╗");
    println!("║     BAN Format Auto-Detection                            ║");
    println!("╚══════════════════════════════════════════════════════════╝\n");

    let parser = match BanParser::from_file(path) {
        Ok(p) => p,
        Err(e) => {
            eprintln!("❌ Error loading file: {}", e);
            std::process::exit(1);
        }
    };

    let data = parser.data();

    // Trouver Bone10_00 qui a des données plus claires
    // Le nom commence à 0x153, donc les données commencent vers 0x160
    println!("=== AUTO-DETECTING KEYFRAME FORMAT ===\n");

    let bone_start = 0x160; // Après "Bone10_00" + 0x08 + 0x00
    let bone_end = find_next_bone(data, 0x160);

    println!("Bone10_00 data: 0x{:04X} to 0x{:04X} ({} bytes)", bone_start, bone_end, bone_end - bone_start);
    println!();

    // Tester différentes tailles de keyframes
    let keyframe_sizes = vec![8, 12, 16, 20, 24, 32, 64];

    for &size in &keyframe_sizes {
        let count = (bone_end - bone_start) / size;
        let remainder = (bone_end - bone_start) % size;

        println!("Testing {}-byte keyframes:", size);
        println!("  Would give {} keyframes, {} bytes remainder", count, remainder);

        if remainder == 0 {
            println!("  ✅ Perfect fit!");
            analyze_keyframes_of_size(data, bone_start, bone_end, size);
        } else if count < 500 {
            println!("  ⚠️  Possible (small remainder)");
        } else {
            println!("  ❌ Unlikely");
        }
        println!();
    }
}

fn find_next_bone(data: &[u8], start: usize) -> usize {
    // Chercher "Bone" après start
    for offset in start..data.len() {
        if offset + 4 <= data.len() {
            if &data[offset..offset+4] == b"Bone" {
                return offset;
            }
        }
    }

    data.len()
}

fn analyze_keyframes_of_size(data: &[u8], start: usize, end: usize, keyframe_size: usize) {
    println!("  Analysis:");

    let num_kfs = (end - start) / keyframe_size;
    let to_show = num_kfs.min(5);

    for i in 0..to_show {
        let offset = start + (i * keyframe_size);
        print!("    KF[{}]: ", i);

        // Afficher les bytes
        for j in 0..std::cmp::min(keyframe_size, 32) {
            print!("{:02X} ", data[offset + j]);
            if j == 7 || j == 15 || j == 23 {
                print!(" ");
            }
        }

        // Interpréter comme floats
        let num_floats = std::cmp::min(keyframe_size / 4, 8);
        print!("| ");

        for j in 0..num_floats {
            let byte_offset = offset + (j * 4);
            if byte_offset + 4 <= data.len() {
                let f = f32::from_le_bytes(data[byte_offset..byte_offset+4].try_into().unwrap());

                // Vérifier si c'est un float raisonnable
                if f.is_finite() && f.abs() < 1000.0 {
                    print!("{:8.3} ", f);
                } else if f.is_finite() {
                    print!("{:8.3e} ", f);
                } else {
                    print!("   ---   ");
                }
            }
        }

        println!();
    }

    // Vérifier les patterns
    println!("  Pattern detection:");
    detect_patterns(data, start, end, keyframe_size);
}

fn detect_patterns(data: &[u8], start: usize, end: usize, keyframe_size: usize) {
    let num_kfs = (end - start) / keyframe_size;

    if num_kfs < 2 {
        println!("    Not enough keyframes for pattern detection");
        return;
    }

    // Analyser les variations entre keyframes consécutives
    let mut exact_matches = 0;
    let mut all_zero = 0;
    let mut has_quaternions = 0;

    for i in 0..std::cmp::min(num_kfs, 100) {
        let offset = start + (i * keyframe_size);

        // Vérifier si tous les bytes sont à zéro
        let all_zeros = data[offset..offset+keyframe_size].iter().all(|&b| b == 0);

        if all_zeros {
            all_zero += 1;
        }

        // Vérifier si ça ressemble à des quaternions (magnitude ~1.0)
        if keyframe_size >= 16 {
            for j in 0..std::cmp::min(keyframe_size / 16, 4) {
                let kf_offset = offset + (j * 16);

                if kf_offset + 16 <= data.len() {
                    let quat = [
                        f32::from_le_bytes(data[kf_offset..kf_offset+4].try_into().unwrap()),
                        f32::from_le_bytes(data[kf_offset+4..kf_offset+8].try_into().unwrap()),
                        f32::from_le_bytes(data[kf_offset+8..kf_offset+12].try_into().unwrap()),
                        f32::from_le_bytes(data[kf_offset+12..kf_offset+16].try_into().unwrap()),
                    ];

                    let mag = (quat[0]*quat[0] + quat[1]*quat[1] + quat[2]*quat[2] + quat[3]*quat[3]).sqrt();

                    if mag > 0.5 && mag < 2.0 {
                        has_quaternions += 1;
                    }
                }
            }
        }

        // Comparer avec la keyframe précédente
        if i > 0 {
            let prev_offset = start + ((i - 1) * keyframe_size);
            let curr_slice = &data[offset..offset+keyframe_size];
            let prev_slice = &data[prev_offset..prev_offset+keyframe_size];

            if curr_slice == prev_slice {
                exact_matches += 1;
            }
        }
    }

    println!("    Zero keyframes: {} / {}", all_zero, std::cmp::min(num_kfs, 100));
    println!("    Consecutive duplicates: {} / {}", exact_matches, std::cmp::min(num_kfs, 100) - 1);

    if keyframe_size >= 16 {
        println!("    Quaternion-like patterns: {}", has_quaternions);
    }

    // Chercher le nombre de keyframes jusqu'au prochain os
    println!("    Total keyframes until next bone: {}", num_kfs);

    // Estimation du nombre de frames si c'est une animation
    if num_kfs > 30 && num_kfs < 10000 {
        println!("    Possibly an animation with {} keyframes", num_kfs);
    }
}
