@echo off
echo ========================================
echo  SOLESPHERE - Stopping Application
echo ========================================
echo.

echo [1/2] Stopping Backend (port 5000)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5000') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo [2/2] Stopping Frontend (port 5173)...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :5173') do (
    taskkill /F /PID %%a >nul 2>&1
)

echo.
echo ========================================
echo  All servers stopped!
echo ========================================
echo.
pause
