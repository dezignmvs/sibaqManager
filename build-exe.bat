@echo off
echo ========================================================
echo         Building Sibaq Desktop Application (.exe)
echo ========================================================
echo.

IF NOT EXIST "node_modules" (
    echo [1/2] Installing dependencies (first time only)...
    call npm install
    IF ERRORLEVEL 1 (
        echo [ERROR] npm install failed. Please ensure Node.js is installed.
        pause
        exit /b 1
    )
) ELSE (
    echo [1/2] Dependencies already installed.
)

echo.
echo [2/2] Packaging Windows Executable (.exe)...
call npm run dist

IF ERRORLEVEL 1 (
    echo [ERROR] Packaging failed.
    pause
    exit /b 1
)

echo.
echo ========================================================
echo [SUCCESS] Windows .exe generated successfully!
echo Look in the "dist" folder for:
echo   - Sibaq-Portal-Portable.exe (Portable executable)
echo   - Sibaq Portal Setup 1.0.0.exe (Installer)
echo ========================================================
pause
