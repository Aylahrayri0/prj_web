@echo off
echo ================================================
echo    Gaza Support - Start Backend and Frontend
echo ================================================
echo.

REM Start Laravel Backend
echo [1/2] Starting Laravel Backend Server...
cd /d "%~dp0gaza-support-backend"
start "Laravel Backend" cmd /k "php artisan serve --host=127.0.0.1 --port=8000"
echo Backend will run on http://127.0.0.1:8000
echo.

REM Wait 3 seconds
timeout /t 3 /nobreak > nul

REM Start React Frontend
echo [2/2] Starting React Frontend Server...
cd /d "%~dp0"
start "React Frontend" cmd /k "npm start"
echo Frontend will run on http://localhost:3000
echo.

echo ================================================
echo Both servers are starting!
echo.
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:3000
echo.
echo Press any key to close this window...
echo ================================================
pause > nul
