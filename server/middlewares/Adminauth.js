import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Demo admin credentials - In production, these should be in database
const ADMIN_CREDENTIALS = {
  email: 'admin@shoestore.com',
  password: 'admin123', // This should be hashed in production
  name: 'Admin User'
};

// Admin login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== ADMIN_CREDENTIALS.email || password !== ADMIN_CREDENTIALS.password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { 
        id: 'admin-001', 
        email: ADMIN_CREDENTIALS.email, 
        role: 'admin',
        name: ADMIN_CREDENTIALS.name
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: 'admin-001',
        email: ADMIN_CREDENTIALS.email,
        name: ADMIN_CREDENTIALS.name,
        role: 'admin'
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get dashboard stats
router.get('/dashboard-stats', (req, res) => {
  // Mock data - replace with actual database queries
  res.json({
    totalProducts: 156,
    totalUsers: 1203,
    totalOrders: 89,
    totalRevenue: 45670,
    recentActivity: [
      { type: 'order', message: 'New order #1234', time: '2 minutes ago' },
      { type: 'user', message: 'New user registered', time: '5 minutes ago' },
      { type: 'product', message: 'Product updated: Nike Air Max', time: '10 minutes ago' }
    ]
  });
});

export default router;