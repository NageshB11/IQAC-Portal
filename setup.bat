@echo off
echo ================================
echo IQAC Portal - Setup Script
echo ================================
echo.

REM Check if Node.js is installed
echo Checking prerequisites...
node -v >nul 2>&1
if errorlevel 1 (
    echo Node.js is not installed. Please install Node.js first.
    pause
    exit /b 1
)

echo ✓ Node.js and npm found
echo.

REM Setup Backend
echo ================================
echo Setting up Backend...
echo ================================
cd server

if not exist ".env" (
    echo Creating .env file...
    (
        echo PORT=5000
        echo MONGODB_URI=mongodb://localhost:27017/iqac-portal
        echo JWT_SECRET=your-secret-key-here-change-this-in-production
        echo NODE_ENV=development
        echo ADMIN_USERNAME=admin
        echo ADMIN_PASSWORD=admin@123
    ) > .env
    echo ✓ .env file created
) else (
    echo ℹ .env already exists, skipping
)

echo Installing backend dependencies...
call npm install
echo ✓ Backend dependencies installed
echo.

REM Setup Frontend
echo ================================
echo Setting up Frontend...
echo ================================
cd ..\client

if not exist ".env.local" (
    echo Creating .env.local file...
    (
        echo NEXT_PUBLIC_API_URL=http://localhost:5000
    ) > .env.local
    echo ✓ .env.local file created
) else (
    echo ℹ .env.local already exists, skipping
)

echo Installing frontend dependencies...
call npm install
echo ✓ Frontend dependencies installed
echo.

REM Setup complete
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo 1. Ensure MongoDB is running
echo 2. Open two terminals
echo.
echo Terminal 1 (Backend):
echo   cd server
echo   npm start
echo.
echo Terminal 2 (Frontend):
echo   cd client
echo   npm run dev
echo.
echo Then open: http://localhost:3000
echo.
echo Admin Credentials:
echo   Username: admin
echo   Password: admin@123
echo.
pause
