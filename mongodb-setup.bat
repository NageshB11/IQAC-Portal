@echo off
setlocal enabledelayedexpansion

echo ════════════════════════════════════════
echo   IQAC Portal - MongoDB Setup
echo ════════════════════════════════════════
echo.

REM Check if MongoDB is installed
echo Checking MongoDB installation...
mongosh --version >nul 2>&1

if %errorlevel% equ 0 (
    echo ✓ MongoDB is installed
) else (
    echo ✗ MongoDB not found. Please install MongoDB first.
    echo.
    echo Download from: https://www.mongodb.com/try/download/community
    echo.
    pause
    exit /b 1
)

REM Check Node modules
echo.
echo Checking Node.js dependencies...
if not exist "node_modules" (
    echo Installing dependencies...
    call npm install
) else (
    echo ✓ Dependencies already installed
)

REM Create .env file
echo.
if not exist ".env" (
    echo Creating .env file...
    (
        echo MONGODB_URI=mongodb://localhost:27017/iqac-portal
        echo JWT_SECRET=your-secret-key-change-in-production
        echo PORT=5000
        echo NODE_ENV=development
        echo ADMIN_USERNAME=admin
        echo ADMIN_PASSWORD=Admin@123
    ) > .env
    echo ✓ .env file created
) else (
    echo ✓ .env file already exists
)

REM Test MongoDB connection
echo.
echo Testing MongoDB connection...
mongosh --eval "db.version()" >nul 2>&1

if %errorlevel% equ 0 (
    echo ✓ MongoDB is running and accessible
) else (
    echo ✗ Cannot connect to MongoDB
    echo.
    echo Ensure MongoDB is running:
    echo - Check Services app and start MongoDB
    echo - Or run: "C:\Program Files\MongoDB\Server\[version]\bin\mongod.exe"
    echo.
    pause
    exit /b 1
)

REM Run initialization script
echo.
echo Initializing database...
call node scripts/init-db.js

if %errorlevel% equ 0 (
    echo.
    echo ════════════════════════════════════════
    echo ✓ MongoDB Setup Complete!
    echo ════════════════════════════════════════
    echo.
    echo Next steps:
    echo 1. Start the backend: npm start
    echo 2. Open new terminal for frontend
    echo 3. Open http://localhost:3000
    echo.
    echo Admin credentials:
    echo   Username: admin
    echo   Password: Admin@123
) else (
    echo ✗ Database initialization failed
    pause
    exit /b 1
)

pause
