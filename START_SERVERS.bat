@echo off
REM ============================================================================
REM Gaza Support Project - Start Both Servers
REM ============================================================================
REM This script starts both the Laravel backend and React frontend servers
REM Keep both terminal windows open while developing!

cls
echo.
echo ============================================================================
echo  GAZA SUPPORT - Starting Servers
echo ============================================================================
echo.
echo [1/2] Starting Laravel Backend Server...
echo       URL: http://127.0.0.1:8000
echo.

REM Start Laravel Backend in a new window
cd /d "%~dp0gaza-support-backend"
start "Laravel Backend Server" cmd /k "php artisan serve --host=127.0.0.1 --port=8000"

REM Wait 4 seconds for Laravel to fully start
timeout /t 4 /nobreak > nul

echo [2/2] Starting React Frontend Server...
echo       URL: http://localhost:3000
echo.

REM Start React Frontend in a new window
cd /d "%~dp0"
start "React Frontend Server" cmd /k "npm start"

echo.
echo ============================================================================
echo  SERVERS STARTING...
echo ============================================================================
echo.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo IMPORTANT: Keep BOTH terminal windows open while developing!
echo.
echo To stop the servers:
echo  - Close each terminal window, OR
echo  - Press Ctrl+C in each terminal
echo.
echo If you need to restart:
echo  - Close both terminals
echo  - Run this script again
echo.
echo ============================================================================
echo.
pause
