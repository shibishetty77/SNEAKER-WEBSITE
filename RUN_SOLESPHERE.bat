@echo off
title SoleSphere - Starting Application
color 0A

echo.
echo ========================================
echo    SOLESPHERE - SNEAKER PLATFORM
echo ========================================
echo.
echo [INFO] Starting servers...
echo.

:: Kill any existing node processes
taskkill /F /IM node.exe >nul 2>&1

:: Wait a moment
timeout /t 2 /nobreak >nul

:: Start backend in new window
echo [1/2] Starting Backend Server (Port 5000)...
start "SoleSphere Backend" cmd /k "cd backend && npm run dev"
timeout /t 4 /nobreak >nul

:: Start frontend in new window  
echo [2/2] Starting Frontend Server (Port 5173)...
start "SoleSphere Frontend" cmd /k "cd frontend && npm run dev"
timeout /t 5 /nobreak >nul

:: Open browser
echo.
echo [INFO] Opening browser...
timeout /t 3 /nobreak >nul
start http://localhost:5173

echo.
echo ========================================
echo   SOLESPHERE IS NOW RUNNING!
echo ========================================
echo.
echo   Backend:  http://localhost:5000
echo   Frontend: http://localhost:5173
echo.
echo   Two terminal windows have opened:
echo   1. Backend Terminal (keep running)
echo   2. Frontend Terminal (keep running)
echo.
echo   Press any key to close this window
echo   (servers will continue running)
echo ========================================
pause >nul
