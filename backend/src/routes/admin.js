const express = require('express');
const router = express.Router();
const DB = require('../db');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'drpd_secret_key_2026';

// Simple middleware to verify "admin" status. 
// For this demo, we'll just check if they are logged in since it's a mock admin dashboard.
// In a real app, you'd check `user.role === 'admin'`.
const adminAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

router.use(adminAuth);

router.get('/stats', (req, res) => {
  res.json(DB.getDashboardStats());
});

router.get('/orders', (req, res) => {
  res.json(DB.getAllOrders());
});

router.patch('/orders/:id/status', (req, res) => {
  const { status } = req.body;
  if (!status) return res.status(400).json({ error: 'Status is required' });
  const updatedOrder = DB.updateOrderStatus(req.params.id, status);
  if (!updatedOrder) return res.status(404).json({ error: 'Order not found' });
  res.json(updatedOrder);
});

router.get('/users', (req, res) => {
  res.json(DB.getAllUsers());
});

module.exports = router;
