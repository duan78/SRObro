$url = "https://github.com/szabo176/Silkroad-Online-Tools/archive/master.zip"
$output = "silkroad-tools.zip"

Write-Host "Downloading Silkroad-Online-Tools plugin..."
Invoke-WebRequest -Uri $url -OutFile $output

Write-Host "Download complete!"
Write-Host "File location: $output"
Write-Host "File size: $((Get-Item $output).Length) bytes"
