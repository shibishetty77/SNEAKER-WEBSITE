@echo off
echo ========================================
echo  SOLESPHERE - Starting Application
echo ========================================
echo.

:: Check if backend is running
echo [1/4] Checking Backend Server...
powershell -Command "Get-NetTCPConnection -LocalPort 5000 -State Listen -ErrorAction SilentlyContinue" >nul 2>&1
if %errorlevel% equ 0 (
    echo      Backend is ALREADY RUNNING on port 5000
) else (
    echo      Starting Backend Server...
    start "SoleSphere Backend" cmd /k "cd backend && npm run dev"
    timeout /t 3 /nobreak >nul
)

echo.
echo [2/4] Checking Frontend Server...
powershell -Command "Get-NetTCPConnection -LocalPort 5173 -State Listen -ErrorAction SilentlyContinue" >nul 2>&1
if %errorlevel% equ 0 (
    echo      Frontend is ALREADY RUNNING on port 5173
) else (
    echo      Starting Frontend Server...
    start "SoleSphere Frontend" cmd /k "cd frontend && npm run dev"
    timeout /t 3 /nobreak >nul
)

echo.
echo [3/4] Waiting for servers to start...
timeout /t 5 /nobreak >nul

echo.
echo [4/4] Opening Browser...
start http://localhost:5173

echo.
echo ========================================
echo  SOLESPHERE IS RUNNING!
echo ========================================
echo.
echo  Backend:  http://localhost:5000
echo  Frontend: http://localhost:5173
echo.
echo  Press any key to close this window...
echo  (Servers will continue running)
echo ========================================
pause >nul
