#!/bin/bash

echo "════════════════════════════════════════"
echo "  IQAC Portal - MongoDB Setup"
echo "════════════════════════════════════════"
echo ""

# Detect OS
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
else
    OS="windows"
fi

echo "Detected OS: $OS"
echo ""

# Check if MongoDB is installed
echo "Checking MongoDB installation..."
if command -v mongosh &> /dev/null; then
    MONGO_VERSION=$(mongosh --version 2>/dev/null | head -1)
    echo "✓ MongoDB is installed: $MONGO_VERSION"
else
    echo "✗ MongoDB not found. Please install MongoDB first."
    echo ""
    echo "Installation guides:"
    echo "  Linux: https://docs.mongodb.com/manual/administration/install-on-linux/"
    echo "  macOS: brew install mongodb-community"
    echo "  Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/"
    exit 1
fi

# Check if Node modules are installed
echo ""
echo "Checking Node.js dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install
else
    echo "✓ Dependencies already installed"
fi

# Create .env if it doesn't exist
echo ""
if [ ! -f ".env" ]; then
    echo "Creating .env file..."
    cat > .env << EOF
MONGODB_URI=mongodb://localhost:27017/iqac-portal
JWT_SECRET=your-secret-key-change-in-production
PORT=5000
NODE_ENV=development
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Admin@123
EOF
    echo "✓ .env file created"
else
    echo "✓ .env file already exists"
fi

# Start MongoDB based on OS
echo ""
echo "Starting MongoDB..."

if [ "$OS" = "linux" ]; then
    sudo systemctl start mongod
    sleep 2
    if sudo systemctl is-active --quiet mongod; then
        echo "✓ MongoDB started successfully"
    else
        echo "✗ Failed to start MongoDB"
        exit 1
    fi
elif [ "$OS" = "macos" ]; then
    brew services start mongodb-community
    sleep 2
    echo "✓ MongoDB service started"
else
    echo "✓ Please ensure MongoDB is running on Windows"
fi

# Test MongoDB connection
echo ""
echo "Testing MongoDB connection..."
if mongosh --eval "db.version()" &> /dev/null; then
    echo "✓ MongoDB is running and accessible"
else
    echo "✗ Cannot connect to MongoDB"
    echo "Please ensure MongoDB is running: mongod or mongosh"
    exit 1
fi

# Run initialization script
echo ""
echo "Initializing database..."
node scripts/init-db.js

if [ $? -eq 0 ]; then
    echo ""
    echo "════════════════════════════════════════"
    echo "✓ MongoDB Setup Complete!"
    echo "════════════════════════════════════════"
    echo ""
    echo "Next steps:"
    echo "1. Start the backend: npm start"
    echo "2. In another terminal, start frontend"
    echo "3. Open http://localhost:3000"
    echo ""
    echo "Admin credentials:"
    echo "  Username: admin"
    echo "  Password: Admin@123"
else
    echo "✗ Database initialization failed"
    exit 1
fi
