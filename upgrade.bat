@echo off
REM Expo 54 Upgrade Script for Windows
REM This script automates the upgrade process

echo.
echo ========================================
echo    Expo 54 Upgrade Process
echo ========================================
echo.

REM Step 1: Clean
echo [Step 1/4] Cleaning old dependencies...
echo.
if exist node_modules (
    echo Removing node_modules...
    rmdir /s /q node_modules
)
if exist package-lock.json (
    echo Removing package-lock.json...
    del /f /q package-lock.json
)
if exist .expo (
    echo Removing .expo cache...
    rmdir /s /q .expo
)
echo ✓ Cleanup complete
echo.

REM Step 2: Install
echo [Step 2/4] Installing Expo 54 dependencies...
echo.
call npm install
if errorlevel 1 (
    echo ✗ Installation failed!
    pause
    exit /b 1
)
echo ✓ Dependencies installed
echo.

REM Step 3: Verify
echo [Step 3/4] Verifying installation...
echo.
node -e "console.log('Node version:', process.version)"
call npx expo --version
echo.

REM Step 4: Instructions
echo [Step 4/4] Upgrade Complete!
echo.
echo ========================================
echo    Next Steps:
echo ========================================
echo.
echo 1. Run: npx expo start --clear
echo 2. Scan QR code or run: npx expo run:ios
echo 3. Test all features
echo.
echo ========================================
echo    Documentation:
echo ========================================
echo.
echo - UPGRADE_SUMMARY.md - Quick overview
echo - EXPO_54_MIGRATION.md - Detailed guide
echo - DEBUG.md - Troubleshooting
echo.
echo Happy coding with Expo 54! 🎉
echo.
pause
