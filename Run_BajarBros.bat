@echo off
TITLE BajarBros - Mess Expense Tracker
color 0b

echo.
echo  ==============================================================
echo            BAJARBROS - MESS EXPENSE TRACKER
echo  ==============================================================
echo.

:: Check for node_modules
IF NOT EXIST "node_modules\" (
    echo  [!] node_modules not found. 
    echo  [!] First time setup: Installing dependencies...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo  [X] Error: npm install failed. Make sure Node.js is installed.
        pause
        exit /b %errorlevel%
    )
    echo.
    echo  [OK] Dependencies installed successfully.
)

echo.
echo  [+] Starting the application server...
echo.

:: Start the project
call npm start

if %errorlevel% neq 0 (
    echo.
    echo  [X] The app stopped unexpectedly.
    pause
)
