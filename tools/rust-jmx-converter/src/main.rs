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

    // Convert files in parallel
    let results: Vec<Result<()>> = bms_files
        .into_par_iter()
        .map(|bms_path| {
            pb.inc(1);
            let filename = bms_path.file_name()
                .and_then(|n| n.to_str())
                .unwrap_or("?");

            pb.set_message(filename.to_string());

            convert_single_file(&bms_path, &args.output)
        })
        .collect();

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

fn convert_single_file(bms_path: &PathBuf, output_dir: &PathBuf) -> Result<()> {
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
    } else {
        None
    };

    let bmt_path = base_dir.join(format!("{}.bmt", base_name));
    let bmt = if bmt_path.exists() {
        let bmt_data = std::fs::read(&bmt_path)?;
        Some(BMTFile::parse(&bmt_data)?)
    } else {
        None
    };

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
