# ============================================
# Copy Blender Assets to Client Public Folder
# ============================================
#
# This script copies the Blender-converted GLB files
# from assets/glb_blender/ to client/public/assets/glb_blender/
#
# Usage: .\scripts\copy-blender-assets.ps1
#
# Author: SRObro Team
# Date: 21 January 2026
# ============================================

$ErrorActionPreference = "Stop"

# Configuration
$SOURCE_DIR = "C:\Users\duan7\Desktop\SRObro\assets\glb_blender"
$DEST_DIR = "C:\Users\duan7\Desktop\SRObro\client\public\assets\glb_blender"
$LOG_FILE = "C:\Users\duan7\Desktop\SRObro\asset_copy_log.txt"

# Counter
$TOTAL_FILES = 0
$COPIED_FILES = 0
$SKIPPED_FILES = 0
$ERRORS = 0

Write-Host "========================================" -ForegroundColor Cyan
Write-Host " SRObro - Asset Copy Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Log start time
$START_TIME = Get-Date
"=== Asset Copy Log ===" | Out-File -FilePath $LOG_FILE
"Started: $START_TIME" | Out-File -FilePath $LOG_FILE -Append
"" | Out-File -FilePath $LOG_FILE -Append

# Check if source directory exists
if (-not (Test-Path $SOURCE_DIR)) {
    Write-Host "❌ ERROR: Source directory not found: $SOURCE_DIR" -ForegroundColor Red
    Write-Host "   Make sure the Blender conversion has completed!" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Source directory found: $SOURCE_DIR" -ForegroundColor Green
Write-Host ""

# Create destination directory if it doesn't exist
if (-not (Test-Path $DEST_DIR)) {
    Write-Host "📁 Creating destination directory: $DEST_DIR" -ForegroundColor Yellow
    New-Item -ItemType Directory -Path $DEST_DIR -Force | Out-Null
    "Created destination directory: $DEST_DIR" | Out-File -FilePath $LOG_FILE -Append
}

Write-Host "📁 Destination directory: $DEST_DIR" -ForegroundColor Cyan
Write-Host ""

# Count total files
Write-Host "📊 Counting files in source directory..." -ForegroundColor Yellow
$TOTAL_FILES = (Get-ChildItem -Path $SOURCE_DIR -Recurse -Filter "*.glb" -File).Count
Write-Host "   Found $TOTAL_FILES GLB files" -ForegroundColor Green
"Total GLB files: $TOTAL_FILES" | Out-File -FilePath $LOG_FILE -Append
"" | Out-File -FilePath $LOG_FILE -Append

# Start copying
Write-Host ""
Write-Host "🚀 Starting copy operation..." -ForegroundColor Cyan
Write-Host ""

$PROGRESS = 0
$LAST_UPDATE = 0

# Get all GLB files recursively
Get-ChildItem -Path $SOURCE_DIR -Recurse -Filter "*.glb" -File | ForEach-Object {
    $PROGRESS++
    $sourceFile = $_.FullName
    $relativePath = $sourceFile.Replace($SOURCE_DIR, "").TrimStart("\")
    $destFile = Join-Path $DEST_DIR $relativePath

    # Update progress every 100 files or every 10%
    $currentPercent = [math]::Round(($PROGRESS / $TOTAL_FILES) * 100)
    if ($PROGRESS - $LAST_UPDATE -ge 100 -or $currentPercent -ne $LAST_UPDATE) {
        Write-Host "   Progress: [$PROGRESS/$TOTAL_FILES] ($currentPercent%)" -ForegroundColor Cyan
        $LAST_UPDATE = $PROGRESS
    }

    # Create destination subdirectory if needed
    $destDir = Split-Path $destFile -Parent
    if (-not (Test-Path $destDir)) {
        try {
            New-Item -ItemType Directory -Path $destDir -Force | Out-Null
        } catch {
            Write-Host "   ⚠️  Failed to create directory: $destDir" -ForegroundColor Yellow
            $ERRORS++
            return
        }
    }

    # Check if file exists and is identical
    if (Test-Path $destFile) {
        $sourceHash = (Get-FileHash -Path $sourceFile -Algorithm MD5).Hash
        $destHash = (Get-FileHash -Path $destFile -Algorithm MD5).Hash

        if ($sourceHash -eq $destHash) {
            # File already exists and is identical
            $SKIPPED_FILES++
            return
        }
    }

    # Copy file
    try {
        Copy-Item -Path $sourceFile -Destination $destFile -Force
        $COPIED_FILES++
    } catch {
        Write-Host "   ❌ Failed to copy: $relativePath" -ForegroundColor Red
        "ERROR: Failed to copy $relativePath - $_" | Out-File -FilePath $LOG_FILE -Append
        $ERRORS++
    }
}

# Summary
$END_TIME = Get-Date
$DURATION = $END_TIME - $START_TIME

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host " Copy Summary" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Copied:     $COPIED_FILES files" -ForegroundColor Green
Write-Host "⏭️  Skipped:    $SKIPPED_FILES files" -ForegroundColor Yellow
Write-Host "❌ Errors:     $ERRORS files" -ForegroundColor Red
Write-Host "📊 Total:      $TOTAL_FILES files" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏱️  Duration:   $DURATION" -ForegroundColor Cyan
Write-Host ""

# Log summary
"" | Out-File -FilePath $LOG_FILE -Append
"=== Summary ===" | Out-File -FilePath $LOG_FILE -Append
"Copied: $COPIED_FILES" | Out-File -FilePath $LOG_FILE -Append
"Skipped: $SKIPPED_FILES" | Out-File -FilePath $LOG_FILE -Append
"Errors: $ERRORS" | Out-File -FilePath $LOG_FILE -Append
"Total: $TOTAL_FILES" | Out-File -FilePath $LOG_FILE -Append
"Duration: $DURATION" | Out-File -FilePath $LOG_FILE -Append
"Completed: $END_TIME" | Out-File -FilePath $LOG_FILE -Append

if ($ERRORS -eq 0) {
    Write-Host "🎉 SUCCESS! All assets copied successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Start the Vite dev server: cd client && npm run dev" -ForegroundColor White
    Write-Host "2. Enable Blender assets in AssetLoader:" -ForegroundColor White
    Write-Host "   AssetConfigManager.enableBlenderAssets();" -ForegroundColor Yellow
    Write-Host "3. Test character loading in browser" -ForegroundColor White
} else {
    Write-Host "⚠️  Completed with $ERRORS errors. Check log: $LOG_FILE" -ForegroundColor Yellow
}

Write-Host ""
