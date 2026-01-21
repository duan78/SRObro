# Monitor Blender Conversion Progress
# Shows real-time conversion status

$logFile = "C:\Users\duan7\Desktop\SRObro\conversion_log.txt"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   SRObro - Blender Conversion Monitor" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Blender is running
$blender = Get-Process blender -ErrorAction SilentlyContinue
if ($blender) {
    Write-Host "✅ Status: CONVERTING" -ForegroundColor Green
    Write-Host "   PID: $($blender.Id)"
    Write-Host "   Memory: $([math]::Round($blender.WorkingSet64/1MB, 2)) MB"
    Write-Host "   Runtime: $($blender.CPU)"
} else {
    Write-Host "❌ Status: NOT RUNNING" -ForegroundColor Red
    Write-Host ""
    Write-Host "The conversion may have completed or failed."
    Write-Host "Check the log file for details."
    exit
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Progress Log (Last 20 lines)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

if (Test-Path $logFile) {
    $lines = Get-Content $logFile -Tail 20

    # Show progress
    foreach ($line in $lines) {
        if ($line -match '\[(\d+)/(\d+)\]') {
            Write-Host $line -ForegroundColor Yellow
        } elseif ($line -match '✅|Success') {
            Write-Host $line -ForegroundColor Green
        } elseif ($line -match '❌|Failed|Error') {
            Write-Host $line -ForegroundColor Red
        } elseif ($line -match '🦴|Skinning') {
            Write-Host $line -ForegroundColor Cyan
        } else {
            Write-Host $line
        }
    }

    # Try to extract current progress
    $content = Get-Content $logFile -Raw
    if ($content -match 'CONVERSION REPORT[\s\S]*Total files:\s+(\d+)') {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Cyan
        Write-Host "   Summary" -ForegroundColor Cyan
        Write-Host "========================================" -ForegroundColor Cyan

        if ($content -match 'Successful:\s+(\d+)') {
            Write-Host "✅ Converted: $($matches[1])" -ForegroundColor Green
        }
        if ($content -match 'Failed:\s+(\d+)') {
            Write-Host "❌ Failed: $($matches[1])" -ForegroundColor Red
        }
        if ($content -match 'With Skinning:\s+(\d+)') {
            Write-Host "🦴 With Skinning: $($matches[1])" -ForegroundColor Cyan
        }
    }
} else {
    Write-Host "⏳ Log file not found yet. Waiting for Blender to start..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "   Output Directory" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📁 C:\Users\duan7\Desktop\SRObro\assets\glb_blender"
Write-Host ""

# Count converted files
if (Test-Path "C:\Users\duan7\Desktop\SRObro\assets\glb_blender") {
    $glbCount = (Get-ChildItem "C:\Users\duan7\Desktop\SRObro\assets\glb_blender" -Recurse -Filter "*.glb" -ErrorAction SilentlyContinue).Count
    Write-Host "GLB files created: $glbCount" -ForegroundColor Green
}

Write-Host ""
Write-Host "Press Ctrl+C to stop monitoring" -ForegroundColor DarkGray
Write-Host "Run this script again to refresh" -ForegroundColor DarkGray
Write-Host ""
