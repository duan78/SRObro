/**
 * Texture Conversion Script
 *
 * Converts Silkroad Online DDJ textures to WebP format for web optimization.
 * DDJ files are essentially DDS (DirectDraw Surface) format with custom headers.
 *
 * Usage:
 *   ts-node scripts/convert-textures.ts --input assets/extracted --output assets/converted
 *   ts-node scripts/convert-textures.ts --input assets/extracted --output assets/converted --quality 85
 */

import path from 'path';
import fs from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

interface TextureConversionOptions {
    input: string;
    output: string;
    quality?: number;
    format?: 'webp' | 'png' | 'jpg';
    resize?: number;
    verbose?: boolean;
    dryRun?: boolean;
}

interface ConversionStats {
    total: number;
    converted: number;
    errors: number;
    skipped: number;
    totalOriginalSize: number;
    totalConvertedSize: number;
}

/**
 * Main texture conversion function
 */
async function convertTextures(options: TextureConversionOptions): Promise<void> {
    console.log('='.repeat(60));
    console.log('Texture Conversion Tool - DDJ to WebP');
    console.log('='.repeat(60));

    const inputDir = path.resolve(options.input);
    const outputDir = path.resolve(options.output);

    // Validate inputs
    try {
        const stats = await fs.stat(inputDir);
        if (!stats.isDirectory()) {
            throw new Error(`Input path is not a directory: ${inputDir}`);
        }
    } catch (error) {
        throw new Error(`Input directory not found: ${inputDir}`);
    }

    // Create output directory
    await fs.mkdir(outputDir, { recursive: true });

    console.log(`\nInput:     ${inputDir}`);
    console.log(`Output:    ${outputDir}`);
    console.log(`Format:    ${options.format || 'webp'}`);
    console.log(`Quality:   ${options.quality || 85}`);

    // Find all texture files
    console.log('\nScanning for texture files...');
    const textureFiles = await findTextureFiles(inputDir);
    console.log(`Found ${textureFiles.length} texture files`);

    if (textureFiles.length === 0) {
        console.log('No texture files found to convert.');
        return;
    }

    // Initialize statistics
    const stats: ConversionStats = {
        total: textureFiles.length,
        converted: 0,
        errors: 0,
        skipped: 0,
        totalOriginalSize: 0,
        totalConvertedSize: 0
    };

    // Convert files
    await convertTextureFiles(textureFiles, inputDir, outputDir, options, stats);

    // Print statistics
    printTextureStats(stats);
}

/**
 * Convert texture files
 */
async function convertTextureFiles(
    textureFiles: string[],
    inputDir: string,
    outputDir: string,
    options: TextureConversionOptions,
    stats: ConversionStats
): Promise<void> {
    console.log('\nConverting textures...');

    for (let i = 0; i < textureFiles.length; i++) {
        const textureFile = textureFiles[i];
        const relativePath = path.relative(inputDir, textureFile);
        const outputPath = path.join(
            outputDir,
            relativePath.replace(/\.(ddj|dds|tga|bmp)$/i, `.${options.format || 'webp'}`)
        );

        console.log(`\n[${i + 1}/${stats.total}] ${relativePath}`);

        // Get original file size
        const originalStat = await fs.stat(textureFile);
        const originalSize = originalStat.size;
        stats.totalOriginalSize += originalSize;

        // Skip if already converted
        try {
            await fs.access(outputPath);
            const convertedStat = await fs.stat(outputPath);
            stats.totalConvertedSize += convertedStat.size;
            console.log('  ⏭️  Already exists, skipping');
            stats.skipped++;
            continue;
        } catch {
            // File doesn't exist, proceed with conversion
        }

        // Dry run mode
        if (options.dryRun) {
            console.log(`  📝 Would convert to: ${outputPath}`);
            stats.converted++;
            continue;
        }

        // Convert
        try {
            await convertSingleTexture(textureFile, outputPath, options);
            stats.converted++;

            // Get converted file size
            const convertedStat = await fs.stat(outputPath);
            stats.totalConvertedSize += convertedStat.size;

            const reduction = (1 - convertedStat.size / originalSize) * 100;
            console.log(`  ✅ Converted ${(originalSize / 1024).toFixed(1)}KB -> ${(convertedStat.size / 1024).toFixed(1)}KB (${reduction.toFixed(1)}% reduction)`);
        } catch (error: any) {
            stats.errors++;
            console.error(`  ❌ Error: ${error.message}`);
        }
    }
}

/**
 * Convert a single texture file
 */
async function convertSingleTexture(
    inputPath: string,
    outputPath: string,
    options: TextureConversionOptions
): Promise<void> {
    // Create output directory
    await fs.mkdir(path.dirname(outputPath), { recursive: true });

    const ext = path.extname(inputPath).toLowerCase();
    const format = options.format || 'webp';
    const quality = options.quality || 85;

    // DDJ files are essentially DDS with a custom header
    // We need to strip the DDJ header to get the DDS data
    if (ext === '.ddj') {
        await convertDDJToFormat(inputPath, outputPath, format, quality, options);
    } else if (ext === '.dds') {
        await convertDDSToFormat(inputPath, outputPath, format, quality, options);
    } else {
        // For other formats (TGA, BMP), use ImageMagick or sharp
        await convertImageToFormat(inputPath, outputPath, format, quality, options);
    }
}

/**
 * Convert DDJ file (DDS with custom header)
 */
async function convertDDJToFormat(
    inputPath: string,
    outputPath: string,
    format: string,
    quality: number,
    options: TextureConversionOptions
): Promise<void> {
    // DDJ files have a 20-byte header before the DDS data
    // We need to skip it to get the raw DDS data

    const inputBuffer = await fs.readFile(inputPath);

    // Skip 20-byte DDJ header
    const ddsData = inputBuffer.slice(20);

    // Write temporary DDS file
    const tempDDS = outputPath + '.temp.dds';
    await fs.writeFile(tempDDS, ddsData);

    try {
        // Convert DDS to target format
        await convertDDSToFormat(tempDDS, outputPath, format, quality, options);
    } finally {
        // Clean up temp file
        try {
            await fs.unlink(tempDDS);
        } catch {
            // Ignore cleanup errors
        }
    }
}

/**
 * Convert DDS file using ImageMagick or FFmpeg
 */
async function convertDDSToFormat(
    inputPath: string,
    outputPath: string,
    format: string,
    quality: number,
    options: TextureConversionOptions
): Promise<void> {
    // Try ImageMagick first
    try {
        const magickCommand = `magick convert "${inputPath}" -quality ${quality} "${outputPath}"`;
        await execAsync(magickCommand);
        return;
    } catch (error) {
        // ImageMagick not available, try FFmpeg
    }

    try {
        const ffmpegCommand = `ffmpeg -y -i "${inputPath}" -q:v ${Math.floor((100 - quality) / 10)} "${outputPath}"`;
        await execAsync(ffmpegCommand);
        return;
    } catch (error) {
        throw new Error('Both ImageMagick and FFmpeg failed. Please install one of them.');
    }
}

/**
 * Convert image file using sharp or ImageMagick
 */
async function convertImageToFormat(
    inputPath: string,
    outputPath: string,
    format: string,
    quality: number,
    options: TextureConversionOptions
): Promise<void> {
    // Try using sharp (Node.js library)
    try {
        const sharp = require('sharp');

        let pipeline = sharp(inputPath);

        // Apply resize if requested
        if (options.resize) {
            pipeline = pipeline.resize(options.resize);
        }

        // Convert to target format
        if (format === 'webp') {
            pipeline = pipeline.webp({ quality });
        } else if (format === 'png') {
            pipeline = pipeline.png();
        } else if (format === 'jpg') {
            pipeline = pipeline.jpeg({ quality });
        }

        await pipeline.toFile(outputPath);
        return;
    } catch (error) {
        // sharp not available, try ImageMagick
    }

    // Fallback to ImageMagick
    try {
        const magickCommand = `magick convert "${inputPath}" -quality ${quality} "${outputPath}"`;
        await execAsync(magickCommand);
        return;
    } catch (error) {
        throw new Error('Both sharp and ImageMagick failed.');
    }
}

/**
 * Find all texture files in directory
 */
async function findTextureFiles(dir: string): Promise<string[]> {
    const textureExtensions = ['.ddj', '.dds', '.tga', '.bmp', '.jpg', '.png', '.tif'];
    const textureFiles: string[] = [];

    async function scan(currentDir: string): Promise<void> {
        const entries = await fs.readdir(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                await scan(fullPath);
            } else {
                const ext = path.extname(entry.name).toLowerCase();
                if (textureExtensions.includes(ext)) {
                    textureFiles.push(fullPath);
                }
            }
        }
    }

    await scan(dir);
    return textureFiles;
}

/**
 * Print texture conversion statistics
 */
function printTextureStats(stats: ConversionStats): void {
    const reduction = stats.totalOriginalSize > 0
        ? (1 - stats.totalConvertedSize / stats.totalOriginalSize) * 100
        : 0;

    console.log('\n' + '='.repeat(60));
    console.log('Texture Conversion Statistics');
    console.log('='.repeat(60));
    console.log(`Total files:         ${stats.total}`);
    console.log(`Converted:           ${stats.converted}`);
    console.log(`Errors:              ${stats.errors}`);
    console.log(`Skipped:             ${stats.skipped}`);
    console.log(`Original size:       ${(stats.totalOriginalSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Converted size:      ${(stats.totalConvertedSize / (1024 * 1024)).toFixed(2)} MB`);
    console.log(`Size reduction:      ${reduction.toFixed(2)}%`);
    console.log('='.repeat(60));
}

/**
 * CLI entry point
 */
async function main(): Promise<void> {
    const args = process.argv.slice(2);

    const options: TextureConversionOptions = {
        input: 'assets/extracted',
        output: 'assets/converted',
        quality: 85,
        format: 'webp',
        verbose: false,
        dryRun: false
    };

    // Parse command line arguments
    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        switch (arg) {
            case '--input':
            case '-i':
                options.input = args[++i];
                break;
            case '--output':
            case '-o':
                options.output = args[++i];
                break;
            case '--quality':
            case '-q':
                options.quality = parseInt(args[++i], 10);
                break;
            case '--format':
            case '-f':
                options.format = args[++i] as 'webp' | 'png' | 'jpg';
                break;
            case '--resize':
            case '-r':
                options.resize = parseInt(args[++i], 10);
                break;
            case '--verbose':
            case '-v':
                options.verbose = true;
                break;
            case '--dry-run':
            case '-n':
                options.dryRun = true;
                break;
            case '--help':
            case '-h':
                printHelp();
                process.exit(0);
                break;
            default:
                console.error(`Unknown option: ${arg}`);
                printHelp();
                process.exit(1);
        }
    }

    try {
        await convertTextures(options);
    } catch (error) {
        console.error('Fatal error:', error);
        process.exit(1);
    }
}

/**
 * Print help message
 */
function printHelp(): void {
    console.log(`
Texture Conversion Tool - DDJ to WebP

USAGE:
  ts-node scripts/convert-textures.ts [OPTIONS]

OPTIONS:
  --input, -i <path>        Input directory with texture files (default: assets/extracted)
  --output, -o <path>       Output directory for converted textures (default: assets/converted)
  --quality, -q <number>    Output quality 1-100 (default: 85)
  --format, -f <format>     Output format: webp, png, or jpg (default: webp)
  --resize, -r <size>       Resize to maximum dimension (default: no resize)
  --verbose, -v             Enable verbose logging
  --dry-run, -n             Show what would be converted without actually converting
  --help, -h                Show this help message

EXAMPLES:
  # Convert all textures to WebP with 85% quality
  ts-node scripts/convert-textures.ts -i assets/extracted -o assets/converted

  # Convert to PNG with highest quality
  ts-node scripts/convert-textures.ts -i assets/extracted -o assets/converted -f png -q 100

  # Resize textures to max 512px and convert to WebP
  ts-node scripts/convert-textures.ts -i assets/extracted -o assets/converted -r 512

  # Dry run to see what would be converted
  ts-node scripts/convert-textures.ts -i assets/extracted -o assets/converted --dry-run

DESCRIPTION:
  This tool converts Silkroad Online DDJ textures to modern web formats.

  DDJ files are essentially DDS (DirectDraw Surface) format with a custom
  20-byte header. This tool strips the header and converts the DDS data
  to WebP, PNG, or JPEG format.

  WebP is recommended for web deployment because:
  - Better compression than JPEG and PNG
  - Supports transparency like PNG
  - Supported by all modern browsers
  - Significantly smaller file sizes

  Typical compression ratios:
  - DDJ to WebP (85% quality): 70-90% size reduction
  - DDJ to PNG: Lossless but 2-3x larger than WebP
  - DDJ to JPEG (85% quality): 80-90% size reduction, but no transparency

  For best results, use WebP with quality 85-90.
`);
}

// Run if executed directly
if (require.main === module) {
    main().catch(console.error);
}

export { convertTextures, TextureConversionOptions, ConversionStats };
