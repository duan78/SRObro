use anyhow::Result;
use clap::Parser;
use indicatif::{ProgressBar, ProgressStyle};
use rayon::prelude::*;
use std::borrow::Cow;
use std::path::PathBuf;

mod jmx;
mod gltf_exporter;

use jmx::bms::BMSFile;
use jmx::bsk::BSKFile;
use jmx::bmt::BMTFile;

#[derive(Parser, Debug)]
#[command(author, version, about, long_about = None)]
struct Args {
    /// Input directory containing BMS files
    #[arg(short, long)]
    input: PathBuf,

    /// Output directory for GLB files
    #[arg(short, long)]
    output: PathBuf,

    /// Number of parallel threads (0 = auto)
    #[arg(short, long, default_value_t = 0)]
    threads: usize,

    /// Only convert files matching this pattern (e.g., "**/avatar_*.bms")
    #[arg(short, long)]
    filter: Option<String>,

    /// Conversion mode: bms (models -> GLB) or ddj (textures -> PNG)
    #[arg(short, long, default_value = "bms")]
    mode: String,
}

fn main() -> Result<()> {
    let args = Args::parse();

    // Set up Rayon thread pool
    if args.threads > 0 {
        rayon::ThreadPoolBuilder::new()
            .num_threads(args.threads)
            .build_global()
            .unwrap();
    }

    println!("🚀 JMX to GLB Converter (Rust)");
    println!("📂 Input: {}", args.input.display());
    println!("📁 Output: {}", args.output.display());
    println!("⚡ Threads: {}", if args.threads == 0 { "auto".to_string() } else { args.threads.to_string() });

    if args.mode == "ddj" {
        return run_ddj_mode(&args);
    }

    // Find all BMS files
    let search_pattern = args.filter.as_deref()
        .map(|p| format!("{}{}", args.input.display(), p))
        .unwrap_or_else(|| format!("{}/**/*.bms", args.input.display()));

    let bms_files: Vec<PathBuf> = glob::glob(&search_pattern)
        .unwrap()
        .filter_map(|p| p.ok())
        .collect();

    println!("\n✅ Found {} BMS files to convert\n", bms_files.len());

    if bms_files.is_empty() {
        println!("⚠️  No BMS files found!");
        return Ok(());
    }

    // Create progress bar
    let pb = ProgressBar::new(bms_files.len() as u64);
    pb.set_style(
        ProgressStyle::default_bar()
            .template("⏳ [{elapsed_precise}] [{bar:40.cyan/blue}] {pos}/{len} ({eta}) {msg}")
            .unwrap()
    );

    let start = std::time::Instant::now();

    // Convert files in parallel, collecting the BMS -> textures mapping
    use std::sync::Mutex;
    let texture_map: Mutex<std::collections::HashMap<String, Vec<String>>> =
        Mutex::new(std::collections::HashMap::new());

    let results: Vec<Result<()>> = bms_files
        .into_par_iter()
        .map(|bms_path| {
            pb.inc(1);
            let filename = bms_path.file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("?");

            pb.set_message(filename.to_string());

            convert_single_file(&bms_path, &args.output, &texture_map, &args.input)
        })
        .collect();

    // Write the texture mapping sidecar for the client
    let map = texture_map.lock().unwrap();
    let map_json = serde_json::to_string(&*map)?;
    std::fs::write(args.output.join("texture-map.json"), map_json)?;
    println!("\n🗺  Texture map: {} entrées -> texture-map.json", map.len());
    drop(map);

    let success_count = results.iter().filter(|r| r.is_ok()).count();
    let fail_count = results.iter().filter(|r| r.is_err()).count();

    let elapsed = start.elapsed();

    pb.finish_with_message(format!("done in {:.2}s", elapsed.as_secs_f64()));

    println!("\n📊 Results:");
    println!("   ✅ Success: {}", success_count);
    println!("   ❌ Failed:  {}", fail_count);
    println!("   ⏱️  Time:    {:.2}s ({:.2} files/sec)",
        elapsed.as_secs_f64(),
        success_count as f64 / elapsed.as_secs_f64()
    );
    println!("   📁 Output:  {}", args.output.display());

    Ok(())
}

/** Nom de fichier sans extension (minuscules possible) d'un chemin. */
fn stem_of(p: &PathBuf) -> String {
    p.file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("unknown")
        .to_string()
}

/** Racine du pack (parent du dossier «prim» ancêtre du BMS): les chemins
 *  candidats «prim/...» y sont résolus quel que soit l'input CLI. */
fn pack_root(bms_path: &PathBuf) -> Option<PathBuf> {
    let mut dir = bms_path.parent()?;
    loop {
        if dir.file_name().and_then(|n| n.to_str()) == Some("prim") {
            return dir.parent().map(|p| p.to_path_buf());
        }
        dir = dir.parent()?;
    }
}

/**
 * Résout le squelette .bsk d'un mesh .bms:
 * convention du pack: prim/mesh/<cat>/mode le.bms ↔ prim/skel/<cat>/modele.bsk
 * (le squelette est partagé entre les parties `_partN`).
 */
fn find_skeleton(bms_path: &PathBuf, input_root: &PathBuf) -> Option<PathBuf> {
    // Chemin relatif SIGNIFICATIF: depuis la racine du pack (contient
    // «prim/mesh/...») — l'input CLI peut être un sous-dossier profond.
    let root = pack_root(bms_path).unwrap_or_else(|| input_root.clone());
    let rel = bms_path.strip_prefix(&root).ok()?;
    let rel_str = rel.to_string_lossy().replace('\\', "/");
    let stem = rel.file_stem()?.to_string_lossy().to_string();
    // Retirer un suffixe _partN / _partNN
    let base = stem.split("_part").next().unwrap_or(&stem).to_string();
    let with_skel = rel_str.replace("/mesh/", "/skel/");
    let mut candidates = vec![
        with_skel.replace(&format!("{}.bms", stem), &format!("{}.bsk", base)),
        with_skel.replace(&format!("{}.bms", stem), &format!("{}.bsk", stem)),
    ];
    // Personnages: squelette unique partagé par région/genre
    // (mesh/char/china/man/x.bms -> skel/char/china/chinaman_skel.bsk)
    if rel_str.contains("/mesh/char/") {
        for (dir, skel) in [
            ("china/man", "chinaman_skel.bsk"),
            ("china/woman", "chinawoman_skel.bsk"),
            ("europe/man", "europeman_skel.bsk"),
            ("europe/woman", "europewoman_skel.bsk"),
        ] {
            if rel_str.contains(&format!("/mesh/char/{}/", dir)) {
                let region = dir.split('/').next().unwrap_or(dir);
                candidates.push(format!("prim/skel/char/{}/{}", region, skel));
            }
        }
    }
    // Armures d'item: BMS skinnés au rig du PORTEUR (pièces _ha/_ba/_la/_sa/
    // _aa/_fa sans BSR de squelette propre) → squelette du personnage de la
    // même région/genre (mesh/item/china/man_item/x.bms → chinaman_skel).
    if rel_str.contains("/mesh/item/") {
        for (dir, skel) in [
            ("china/man_item", "chinaman_skel.bsk"),
            ("china/woman_item", "chinawoman_skel.bsk"),
            ("europe/man_item", "europeman_skel.bsk"),
            ("europe/woman_item", "europewoman_skel.bsk"),
        ] {
            if rel_str.contains(&format!("/mesh/item/{}/", dir)) {
                let region = dir.split('/').next().unwrap_or(dir);
                candidates.push(format!("prim/skel/char/{}/{}", region, skel));
            }
        }
    }
    for c in candidates {
        // Résoudre contre la racine CLI (input=pack) ET contre la racine du
        // pack détectée (input=un sous-dossier profond) — le premier qui
        // existe gagne.
        if let Some(pk) = pack_root(bms_path) {
            let p = pk.join(&c);
            if p.exists() {
                return Some(p);
            }
        }
        let p = input_root.join(&c);
        if p.exists() {
            return Some(p);
        }
    }
    None
}

fn convert_single_file(
    bms_path: &PathBuf,
    output_dir: &PathBuf,
    texture_map: &std::sync::Mutex<std::collections::HashMap<String, Vec<String>>>,
    input_root: &PathBuf,
) -> Result<()> {
    // Read BMS file
    let bms_data = std::fs::read(bms_path)?;
    let bms = BMSFile::parse(&bms_data)?;

    // Get base directory and filename
    let base_dir = bms_path.parent().unwrap_or_else(|| std::path::Path::new("."));
    let base_name = bms_path.file_stem()
        .and_then(|s| s.to_str())
        .unwrap_or("unknown");

    // Try to find related files
    let bsk_path = base_dir.join(format!("{}.bsk", base_name));
    let bsk = if bsk_path.exists() {
        let bsk_data = std::fs::read(&bsk_path)?;
        Some(BSKFile::parse(&bsk_data)?)
    } else if let Some(p) = find_skeleton(bms_path, input_root) {
        let bsk_data = std::fs::read(&p)?;
        Some(BSKFile::parse(&bsk_data)?)
    } else {
        None
    };

    let bmt_path = base_dir.join(format!("{}.bmt", base_name));
    // Items: le BMT vit dans prim/mtrl (pas à côté du BMS) — convention
    // mesh→mtrl, avec le nom de SET pour les armures (heavy_02_ba.bms →
    // heavy_02.bmt: le suffixe de pièce _ha/_ba/_la/_sa/_aa/_fa se retire).
    let bmt_candidates = {
        // Relatif depuis la racine du pack (même logique que find_skeleton)
        let root = pack_root(&bms_path).unwrap_or_else(|| input_root.clone());
        let rel = bms_path.strip_prefix(&root)
            .unwrap_or_else(|_| bms_path.as_path());
        let rel_mtrl = rel.to_string_lossy().replace('\\', "/").replace("/mesh/", "/mtrl/");
        let stem_str = stem_of(bms_path);
        let set_name = {
            let mut s = base_name.to_string();
            for piece in ["_ha", "_ba", "_la", "_sa", "_aa", "_fa"] {
                if s.ends_with(piece) {
                    s = s.trim_end_matches(piece).to_string();
                    break;
                }
            }
            s
        };
        let mut v = vec![bmt_path.clone()];
        let mtrl_candidates = [
            rel_mtrl.replace(&format!("{}.bms", stem_str), &format!("{}.bmt", base_name)),
            rel_mtrl.replace(&format!("{}.bms", stem_str), &format!("{}.bmt", set_name)),
        ];
        for c in mtrl_candidates {
            if let Some(pk) = pack_root(&bms_path) {
                v.push(pk.join(&c));
            }
            v.push(input_root.join(&c));
        }
        v
    };
    let bmt = bmt_candidates.iter()
        .find(|p| p.exists())
        .map(|p| {
            let bmt_data = std::fs::read(p)?;
            let parsed = BMTFile::parse(&bmt_data)?;
            // Références de textures pour le client (chemins ddj tels que dans le pack)
            if !parsed.materials.is_empty() {
                let texs: Vec<String> = parsed.materials.iter()
                    .filter_map(|m| m.texture.as_ref())
                    .cloned()
                    .collect();
                if !texs.is_empty() {
                    texture_map.lock().unwrap()
                        .insert(base_name.to_lowercase(), texs);
                }
            }
            Ok::<BMTFile, anyhow::Error>(parsed)
        })
        .transpose()?;

    // Calculate output path (preserve directory structure)
    let relative_path = bms_path.strip_prefix(base_dir)
        .unwrap_or_else(|_| bms_path.as_path());
    let output_path = output_dir.join(relative_path)
        .with_extension("glb");

    // Create output directory
    if let Some(parent) = output_path.parent() {
        std::fs::create_dir_all(parent)?;
    }

    // Export to GLB
    gltf_exporter::export_to_glb(
        &bms,
        bsk.as_ref(),
        bmt.as_ref(),
        &output_path,
    )?;

    Ok(())
}

/// Convertit les textures .ddj (JMXVDDJ: 20 octets d'en-tête + DDS standard)
/// en PNG lisibles par le navigateur, en préservant l'arborescence relative.
fn run_ddj_mode(args: &Args) -> Result<()> {
    let search_pattern = format!("{}/**/*.ddj", args.input.display());
    let ddj_files: Vec<PathBuf> = glob::glob(&search_pattern)
        .unwrap()
        .filter_map(|p| p.ok())
        .collect();

    println!("\n✅ Found {} DDJ textures to convert\n", ddj_files.len());
    if ddj_files.is_empty() {
        return Ok(());
    }

    let pb = ProgressBar::new(ddj_files.len() as u64);
    pb.set_style(
        ProgressStyle::default_bar()
            .template("⏳ [{elapsed_precise}] [{bar:40.cyan/blue}] {pos}/{len} ({eta}) {msg}")
            .unwrap()
    );

    let start = std::time::Instant::now();
    let results: Vec<Result<()>> = ddj_files
        .into_par_iter()
        .map(|ddj_path| {
            pb.inc(1);
            let filename = ddj_path.file_name().and_then(|n| n.to_str()).unwrap_or("?");
            pb.set_message(filename.to_string());
            convert_ddj(&ddj_path, &args.input, &args.output)
        })
        .collect();

    pb.finish_with_message(format!("done in {:.2}s", start.elapsed().as_secs_f32()));
    let ok = results.iter().filter(|r| r.is_ok()).count();
    let fail = results.iter().filter(|r| r.is_err()).count();
    println!("\n📊 Results (DDJ→PNG):");
    println!("   ✅ Success: {}", ok);
    println!("   ❌ Failed:  {}", fail);
    println!("   📁 Output:  {}", args.output.display());
    Ok(())
}

fn convert_ddj(ddj_path: &PathBuf, input_root: &PathBuf, output_root: &PathBuf) -> Result<()> {
    let data = std::fs::read(ddj_path)?;
    if data.len() < 24 || &data[0..7] != b"JMXVDDJ" {
        return Err(anyhow::anyhow!("not a DDJ file"));
    }
    // 12 bytes magic+version, u32 taille DDS, u32 type, puis flux DDS
    let dds = &data[20..];
    if dds.len() < 4 || &dds[0..4] != b"DDS " {
        return Err(anyhow::anyhow!("DDS payload introuvable"));
    }
    let rel = ddj_path.strip_prefix(input_root)
        .unwrap_or_else(|_| ddj_path.as_path());
    let out_path = output_root.join(rel).with_extension("png");
    if let Some(parent) = out_path.parent() {
        std::fs::create_dir_all(parent)?;
    }

    // Icônes SRO: DDS NON compressé 16 bpp (A1R5G5B5 / R5G6B5) — le décodeur
    // DDS de la crate `image` ne gère que DXT, on décode manuellement via les
    // masques du pixel format.
    let u32le = |o: usize| u32::from_le_bytes([dds[o], dds[o + 1], dds[o + 2], dds[o + 3]]);
    if dds.len() >= 128 {
        let pf_flags = u32le(80);
        let bit_count = u32le(88);
        if pf_flags & 0x40 != 0 && (bit_count == 16 || bit_count == 32) {
            let width = u32le(16);
            let height = u32le(12);
            let mask_r = u32le(92);
            let mask_g = u32le(96);
            let mask_b = u32le(100);
            let mask_a = u32le(104);
            let shift = |mask: u32| -> (u32, u32) {
                if mask == 0 { return (0, 0); }
                let mut s = 0u32;
                while (mask >> s) & 1 == 0 { s += 1; }
                let bits = (mask >> s).count_ones();
                (s, bits)
            };
            let (sr, br) = shift(mask_r);
            let (sg, bg) = shift(mask_g);
            let (sb, bb) = shift(mask_b);
            let (sa, ba) = shift(mask_a);
            let upscale = |v: u32, bits: u32| -> u8 {
                if bits == 0 { return 0; }
                let maxv = (1u32 << bits) - 1;
                (v * 255 / maxv) as u8
            };
            let px_count = (width as usize) * (height as usize);
            let bpp_bytes = (bit_count / 8) as usize;
            if dds.len() >= 128 + px_count * bpp_bytes {
                let mut imgbuf = image::RgbaImage::new(width, height);
                for i in 0..px_count {
                    let raw: u32 = if bpp_bytes == 2 {
                        u16::from_le_bytes([dds[128 + i * 2], dds[129 + i * 2]]) as u32
                    } else {
                        // 32 bpp: éventuellement A8R8G8B8 — masques génériques
                        u32::from_le_bytes([dds[128 + i * 4], dds[129 + i * 4], dds[130 + i * 4], dds[131 + i * 4]])
                    };
                    let r = upscale((raw & mask_r) >> sr, br);
                    let g = upscale((raw & mask_g) >> sg, bg);
                    let b = upscale((raw & mask_b) >> sb, bb);
                    let a = if mask_a == 0 { 255 } else { upscale((raw & mask_a) >> sa, ba.max(1)) };
                    imgbuf.put_pixel((i as u32) % width, (i as u32) / width, image::Rgba([r, g, b, a]));
                }
                imgbuf.save_with_format(&out_path, image::ImageFormat::Png)?;
                return Ok(());
            }
        }
    }

    let img = image::load_from_memory_with_format(dds, image::ImageFormat::Dds)?;
    img.save_with_format(&out_path, image::ImageFormat::Png)?;
    Ok(())
}
