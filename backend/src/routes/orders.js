const express = require('express');
const router = express.Router();
const DB = require('../db');
const { requireAuth } = require('../middleware/auth');
const crypto = require('crypto');

// POST /api/orders
router.post('/', (req, res) => {
  const { name, email, phone, address, items, subtotal, total, payment_method, session_id } = req.body;
  if (!name || !email || !address || !items || !total) {
    return res.status(400).json({ error: 'Missing required order fields' });
  }
  
  const order = DB.createOrder({ name, email, phone, address, items, subtotal, total, payment_method });
  if (session_id) DB.clearCart(session_id);
  
  // MOCK PAYMENT INTEGRATION (Razorpay / Stripe ready structure)
  let payment_response = null;
  if (payment_method === 'UPI' || payment_method === 'CARD') {
    payment_response = {
      gateway: 'Razorpay',
      order_id: `order_${crypto.randomBytes(8).toString('hex')}`,
      amount: total * 100, // Razorpay uses minimum currency unit
      currency: 'INR',
      status: 'created'
    };
  }

  res.json({ success: true, order_id: order.id, payment_intent: payment_response });
});

// GET /api/orders/:id  (Added requireAuth to protect user's order history)
router.get('/:id', requireAuth, (req, res) => {
  const order = DB.getOrder(req.params.id);
  if (!order) return res.status(404).json({ error: 'Order not found' });
  
  // Basic security: only allow the user to view their own order
  if (order.email !== req.user.email) {
     return res.status(403).json({ error: 'Forbidden: Cannot view other users orders' });
  }
  
  res.json({ order });
});

module.exports = router;
