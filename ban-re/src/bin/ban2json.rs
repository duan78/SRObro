/*!
 * ban2json - Convertit les animations officielles .ban en JSON compact
 * pour le client SRObro, via le parseur complet de la bibliothèque.
 *
 * Usage: ban2json <fichier.ban> [sortie.json]
 *        ban2json --dir <dossier> <dossier_sortie>   (conversion en masse)
 *
 * Sortie: { duration_s, bones: [{ name, times: [s...],
 *           rotations: [x,y,z,w,...], positions?: [x,y,z,...] }] }
 */

use ban_re::BanParser;
use std::env;
use std::fs;
use std::path::{Path, PathBuf};
use std::process;

fn main() {
    let args: Vec<String> = env::args().collect();
    if args.len() < 2 {
        eprintln!("Usage: ban2json <fichier.ban> [sortie.json] | ban2json --dir <in> <out>");
        process::exit(1);
    }

    if args[1] == "--dir" {
        if args.len() < 4 {
            eprintln!("--dir requiert <dossier_entree> <dossier_sortie>");
            process::exit(1);
        }
        let (ok, fail) = convert_dir(Path::new(&args[2]), Path::new(&args[3]));
        println!("ban2json: {ok} convertis, {fail} échoués");
        return;
    }

    let input = PathBuf::from(&args[1]);
    let output = args
        .get(2)
        .map(PathBuf::from)
        .unwrap_or_else(|| input.with_extension("json"));
    match convert_one(&input, &output) {
        Ok(n) => println!("{} os animés -> {}", n, output.display()),
        Err(e) => {
            eprintln!("erreur {}: {}", input.display(), e);
            process::exit(1);
        }
    }
}

fn convert_dir(in_dir: &Path, out_dir: &Path) -> (usize, usize) {
    let mut ok = 0;
    let mut fail = 0;
    let entries = match fs::read_dir(in_dir) {
        Ok(e) => e,
        Err(_) => return (0, 0),
    };
    for entry in entries.flatten() {
        let p = entry.path();
        if p.is_dir() {
            let sub_out = out_dir.join(entry.file_name());
            let (a, b) = convert_dir(&p, &sub_out);
            ok += a;
            fail += b;
        } else if p.extension().and_then(|e| e.to_str()) == Some("ban") {
            let rel = p.strip_prefix(in_dir).unwrap_or(&p);
            let out = out_dir.join(rel).with_extension("json");
            if let Some(parent) = out.parent() {
                let _ = fs::create_dir_all(parent);
            }
            match convert_one(&p, &out) {
                Ok(_) => ok += 1,
                Err(_) => fail += 1,
            }
        }
    }
    (ok, fail)
}

fn convert_one(input: &Path, output: &Path) -> Result<usize, String> {
    let data = fs::read(input).map_err(|e| e.to_string())?;
    let ban = BanParser::from_buffer(data)
        .parse()
        .map_err(|e| format!("parse: {e}"))?;

    let duration = ban.header.duration_ms as f64 / 1000.0;

    let mut bones_json: Vec<serde_json::Value> = Vec::new();
    let mut bone_count = 0;
    for bone in &ban.bones {
        if bone.keyframes.is_empty() {
            continue;
        }
        let mut times: Vec<f64> = Vec::new();
        let mut rotations: Vec<f32> = Vec::new();
        let mut positions: Vec<f32> = Vec::new();
        let mut has_pos = false;
        for kf in &bone.keyframes {
            // frame_index est un temps en millisecondes (table des temps BAN)
            times.push(kf.frame_index as f64 / 1000.0);
            if let Some(r) = kf.rotation {
                rotations.extend_from_slice(&r);
            }
            if let Some(p) = kf.position {
                has_pos = true;
                positions.extend_from_slice(&p);
            }
        }
        if rotations.is_empty() {
            continue;
        }
        let mut obj = serde_json::json!({
            "name": bone.name,
            "times": times,
            "rotations": rotations,
        });
        if has_pos {
            obj["positions"] = serde_json::json!(positions);
        }
        bones_json.push(obj);
        bone_count += 1;
    }

    let out = serde_json::json!({
        "file": input.file_stem().and_then(|s| s.to_str()).unwrap_or(""),
        "duration": duration,
        "bones": bones_json,
    });
    if let Some(parent) = output.parent() {
        let _ = fs::create_dir_all(parent);
    }
    fs::write(output, serde_json::to_string(&out).map_err(|e| e.to_string())?)
        .map_err(|e| e.to_string())?;
    Ok(bone_count)
}
