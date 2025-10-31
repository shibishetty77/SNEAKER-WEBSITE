@echo off
echo.
echo ========================================
echo   SOLESPHERE - COMPLETE STATUS CHECK
echo ========================================
echo.

echo [1/5] Checking Backend Server...
powershell -Command "Test-NetConnection localhost -Port 5000 -InformationLevel Quiet" >nul 2>&1
if %errorlevel% equ 0 (
    echo      ✓ Backend is RUNNING on port 5000
) else (
    echo      ✗ Backend is NOT running
    echo        Start with: cd backend ^&^& npm run dev
)

echo.
echo [2/5] Checking Frontend Server...
powershell -Command "Test-NetConnection localhost -Port 5173 -InformationLevel Quiet" >nul 2>&1
if %errorlevel% equ 0 (
    echo      ✓ Frontend is RUNNING on port 5173
) else (
    echo      ✗ Frontend is NOT running
    echo        Start with: cd frontend ^&^& npm run dev
)

echo.
echo [3/5] Testing Backend API...
curl -s http://localhost:5000/api/health >nul 2>&1
if %errorlevel% equ 0 (
    echo      ✓ Backend API is responding
) else (
    echo      ✗ Backend API not accessible
)

echo.
echo [4/5] Testing Frontend...
curl -s http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo      ✓ Frontend is accessible
) else (
    echo      ✗ Frontend not accessible
)

echo.
echo [5/5] Checking Database...
curl -s http://localhost:5000/api/products >nul 2>&1
if %errorlevel% equ 0 (
    echo      ✓ Database has products
) else (
    echo      ✗ No products in database
    echo        Seed with: cd backend ^&^& npm run seed
)

echo.
echo ========================================
echo   OPEN APP IN BROWSER
echo ========================================
echo.
echo   URL: http://localhost:5173
echo.
echo   What you should see:
echo   - Dark theme with green accents
echo   - 3D rotating shoe animation
echo   - SOLESPHERE navbar
echo   - 12 product cards
echo   - Filter controls
echo.
echo ========================================
echo.
echo Press O to open in browser, or any other key to exit...
echo.

choice /c ON /n /m ""
if errorlevel 2 goto end
if errorlevel 1 start http://localhost:5173

:end
echo.
echo Goodbye!
timeout /t 2 /nobreak >nul
