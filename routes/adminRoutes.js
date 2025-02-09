import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin credentials
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123'
};

// JWT secret
const JWT_SECRET = 'your-secret-key';

// Admin login route
router.post('/login', (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login attempt:', { username, password }); // Debug log

    // Check credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Generate JWT token
      const token = jwt.sign(
        { username, role: 'admin' },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Send success response
      res.json({
        success: true,
        token,
        message: 'Login successful'
      });
    } else {
      // Send error response
      res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// Middleware to verify admin token
export const verifyAdminToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(401).json({ message: 'Invalid or expired token' });
  }
};

// Test route to verify admin authentication
router.get('/verify', verifyAdminToken, (req, res) => {
  res.json({ message: 'Admin authenticated', user: req.admin });
});

export default router; 