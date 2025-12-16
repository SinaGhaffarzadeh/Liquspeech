@echo off
echo ====================================
echo Starting Avatar Agent Frontend...
echo ====================================
echo.

REM بررسی نصب node_modules
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

REM اجرای سرور Vite
echo Starting Vite dev server on http://localhost:3000
echo.
call npm run dev

pause


