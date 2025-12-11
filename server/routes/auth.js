import express from 'express';
import User from '../models/User.js';
import Department from '../models/Department.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

async function generateCoordinatorCredentials(departmentId) {
  const dept = await Department.findById(departmentId);
  if (!dept) throw new Error('Department not found');

  // Generate username: COORD_DEPTNAME_001, COORD_DEPTNAME_002, etc.
  const deptPrefix = dept.code || dept.name.toUpperCase().slice(0, 3);
  let username = '';
  let counter = 1;
  let isUnique = false;

  while (!isUnique) {
    username = `COORD_${deptPrefix}_${String(counter).padStart(3, '0')}`;
    const existingUser = await User.findOne({ username });
    if (!existingUser) {
      isUnique = true;
    } else {
      counter++;
    }
  }

  return { username };
}

// Admin Login
router.post('/admin-login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log('=== ADMIN LOGIN ATTEMPT ===');
    console.log('Username:', username);
    console.log('Password length:', password?.length);

    if (!username || !password) {
      console.log('Missing credentials');
      return res.status(400).json({ message: 'Username and password required' });
    }

    const admin = await User.findOne({ role: 'admin', username });
    console.log('Admin found:', !!admin);

    if (!admin) {
      console.log('Admin not found in database');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    console.log('Comparing password...');
    const isPasswordValid = await admin.comparePassword(password);
    console.log('Password valid:', isPasswordValid);

    if (!isPasswordValid) {
      console.log('Password comparison failed');
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    console.log('Login successful!');
    res.json({
      token,
      user: {
        id: admin._id,
        role: admin.role,
        username: admin.username,
        firstName: admin.firstName,
        lastName: admin.lastName,
        email: admin.email
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Signup for Coordinator, Faculty, Student
router.post('/signup', async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, department, phoneNumber, designation, enrollmentNumber } = req.body;

    if (!['coordinator', 'faculty', 'student'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if ((role === 'coordinator' || role === 'faculty' || role === 'student') && !department) {
      return res.status(400).json({ message: 'Department is required for this role' });
    }

    let coordinatorUsername = null;

    if (role === 'coordinator') {
      const creds = await generateCoordinatorCredentials(department);
      coordinatorUsername = creds.username;
    }

    const user = new User({
      firstName,
      lastName,
      email,
      password, // Use user-selected password instead of auto-generated
      role,
      ...(coordinatorUsername && { username: coordinatorUsername }),
      ...(role !== 'student' ? { department } : { department }), // Save department for all roles including student
      phoneNumber,
      designation,
      enrollmentNumber,
      isApproved: true // Auto-approve all new users (remove pending approval)
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    const response = {
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        department: user.department,
        isApproved: user.isApproved
      }
    };

    if (role === 'coordinator') {
      response.coordinatorCredentials = {
        username: coordinatorUsername,
        message: 'Your department-wise unique username has been generated. Use your email and chosen password to login, or use the username with your password.'
      };
    }

    res.status(201).json(response);
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: error.message });
  }
});

// Login for Coordinator, Faculty, Student
router.post('/login', async (req, res) => {
  try {
    const { email, password, username, role } = req.body;

    if (!password || !role) {
      return res.status(400).json({ message: 'Password and role required' });
    }

    let user;
    if (role === 'coordinator' && username) {
      user = await User.findOne({ username, role });
    } else if (email) {
      user = await User.findOne({ email, role });
    } else {
      return res.status(400).json({ message: 'Email or username required' });
    }

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
        role: user.role,
        department: user.department,
        isApproved: user.isApproved
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
