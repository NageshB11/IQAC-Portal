#!/bin/bash

echo "================================"
echo "IQAC Portal - Setup Script"
echo "================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "Checking prerequisites..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js is not installed. Please install Node.js first.${NC}"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo -e "${RED}npm is not installed. Please install npm first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js and npm found${NC}"
echo ""

# Setup Backend
echo "================================"
echo "Setting up Backend..."
echo "================================"
cd server

if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
PORT=5000
MONGODB_URI=mongodb://localhost:27017/iqac-portal
JWT_SECRET=your-secret-key-here-change-this-in-production
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin@123
EOF
    echo -e "${GREEN}✓ .env file created${NC}"
else
    echo -e "${YELLOW}ℹ .env already exists, skipping${NC}"
fi

echo "Installing backend dependencies..."
npm install
echo -e "${GREEN}✓ Backend dependencies installed${NC}"
echo ""

# Setup Frontend
echo "================================"
echo "Setting up Frontend..."
echo "================================"
cd ../client

if [ ! -f ".env.local" ]; then
    echo "Creating .env.local file..."
    cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:5000
EOF
    echo -e "${GREEN}✓ .env.local file created${NC}"
else
    echo -e "${YELLOW}ℹ .env.local already exists, skipping${NC}"
fi

echo "Installing frontend dependencies..."
npm install
echo -e "${GREEN}✓ Frontend dependencies installed${NC}"
echo ""

# Setup complete
echo "================================"
echo -e "${GREEN}Setup Complete!${NC}"
echo "================================"
echo ""
echo "Next steps:"
echo "1. Ensure MongoDB is running"
echo "2. Open two terminals"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd server"
echo "  npm start"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd client"
echo "  npm run dev"
echo ""
echo "Then open: http://localhost:3000"
echo ""
echo "Admin Credentials:"
echo "  Username: admin"
echo "  Password: admin@123"
