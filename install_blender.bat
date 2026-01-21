@echo off
echo ========================================
echo Installing Blender 5.0 + Silkroad Tools
echo ========================================

set BLENDER_VERSION=5.0.0
set BLENDER_DIR=%USERPROFILE%\Blender Foundation\Blender %BLENDER_VERSION%

REM Check if already installed
if exist "%BLENDER_DIR%\blender.exe" (
    echo Blender already installed at %BLENDER_DIR%
    set /P INSTALL_NEW="Overwrite? (y/n): "
    if /i not "%INSTALL_NEW%"=="y" goto :end
)

echo.
echo Downloading Blender %BLENDER_VERSION%...
echo.

REM Create temp directory
set TEMP_DIR=%TEMP%\blender_install
mkdir "%TEMP_DIR%" 2>nul

REM Download Blender
set BLENDER_URL=https://download.blender.org/release/Blender%BLENDER_VERSION%/blender-%BLENDER_VERSION%-windows-x64.zip
echo Downloading from: %BLENDER_URL%

curl -L "%BLENDER_URL%" -o "%TEMP_DIR%\blender.zip" || (
    echo ERROR: Failed to download Blender
    pause
    exit /b 1
)

REM Extract
echo.
echo Extracting Blender...
powershell -Command "Expand-Archive '%TEMP_DIR%\blender.zip' -DestinationPath '$env:TEMP_DIR'"

REM Install to Program Files
set INSTALL_DIR=C:\Program Files\Blender Foundation\Blender %BLENDER_VERSION%
echo Installing to: %INSTALL_DIR%

if exist "%INSTALL_DIR%" rd /s /q "%INSTALL_DIR%"
mkdir "%INSTALL_DIR%"
xcopy "%TEMP_DIR%\blender-%BLENDER_VERSION%-windows-x64" "%INSTALL%DIR%\" /E /I /H /Y

REM Cleanup
rd /s /q "%TEMP_DIR%"

echo.
echo Blender installed successfully!
echo Location: %INSTALL_DIR%\blender.exe
echo.

:add_to_path
set /P ADD_PATH="Add Blender to PATH? (y/n): "
if /i "%ADD_PATH%"=="y" (
    setx PATH "%PATH%;%INSTALL_DIR%" /M
    echo Added to PATH (may require restart)
)

:end
echo.
echo Installation complete!
pause
