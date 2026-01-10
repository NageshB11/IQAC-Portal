import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import departmentRoutes from './routes/departments.js';
import feedbackRoutes from './routes/feedback.js';
import userRoutes from './routes/users.js';
import documentRoutes from './routes/documents.js';
import announcementRoutes from './routes/announcements.js';
import facultyActivityRoutes from './routes/faculty-activities.js';
import reportRoutes from './routes/reports.js';
import excelReportRoutes from './routes/excel-reports.js';
import timetableRoutes from './routes/timetable.js';
import activityLogRoutes from './routes/activity-logs.js';
import downloadRoutes from './routes/downloads.js';
import debugRoutes from './routes/debug.js';
import sportsRoutes from './routes/sports.js';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from uploads directory
// Serve static files from uploads directory
import fs from 'fs';
import path from 'path';

// Ensure upload directories exist
const uploadDirs = [
  'uploads',
  'uploads/documents',
  'uploads/faculty-activities'
];

uploadDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`✓ Created directory: ${dir}`);
  }
});

app.use('/uploads', express.static('uploads'));

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;

    if (!uri) {
      console.error('✗ MONGODB_URI not set in .env file');
      console.log('Please add MONGODB_URI to your .env file');
      process.exit(1);
    }

    const conn = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('✓ MongoDB connected successfully');
    console.log(`  Host: ${conn.connection.host}`);
    console.log(`  Database: ${conn.connection.name}`);

    return conn;
  } catch (error) {
    console.error('✗ MongoDB connection error:', error.message);
    console.log('\nTroubleshooting steps:');
    console.log('1. Check if MongoDB is running');
    console.log('2. Verify MONGODB_URI in .env file');
    console.log('3. For local: mongodb://localhost:27017/iqac-portal');
    console.log('4. For Atlas: mongodb+srv://user:pass@cluster.mongodb.net/iqac-portal');
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/departments', departmentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api/faculty-activities', facultyActivityRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/excel-reports', excelReportRoutes);
app.use('/api/timetable', timetableRoutes);
app.use('/api/activity-logs', activityLogRoutes);
app.use('/api/downloads', downloadRoutes);
app.use('/api/debug', debugRoutes);
app.use('/api/sports', sportsRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'Backend running',
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Database status endpoint
app.get('/api/db-status', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting'
  };

  res.json({
    database: states[dbStatus],
    status: dbStatus === 1 ? 'ready' : 'not ready'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✓ Server running on http://localhost:${PORT}`);
  console.log(`✓ Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('\nAPI Endpoints:');
  console.log(`  Health: GET http://localhost:${PORT}/api/health`);
  console.log(`  DB Status: GET http://localhost:${PORT}/api/db-status`);
  console.log(`  Auth: POST http://localhost:${PORT}/api/auth/...`);
  console.log(`  Departments: GET/POST http://localhost:${PORT}/api/departments/...`);
  console.log(`  Feedback: GET/POST http://localhost:${PORT}/api/feedback/...`); // Added feedback endpoint to logs
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\nShutting down gracefully...');
  await mongoose.disconnect();
  console.log('✓ MongoDB disconnected');
  process.exit(0);
});
