const express = require('express');
const router = express.Router();
const DB = require('../db');

router.get('/', (req, res) => {
  const { session_id } = req.query;
  if (!session_id) return res.status(400).json({ error: 'session_id required' });
  const items = DB.getCart(session_id);
  res.json({ items });
});

router.post('/', (req, res) => {
  const { session_id, product_id, size, quantity = 1 } = req.body;
  if (!session_id || !product_id || !size) return res.status(400).json({ error: 'Missing fields' });
  DB.addToCart(session_id, product_id, size, quantity);
  res.json({ success: true });
});

router.patch('/:id', (req, res) => {
  const { quantity } = req.body;
  DB.updateCartItem(req.params.id, quantity);
  res.json({ success: true });
});

router.delete('/:id', (req, res) => {
  DB.removeCartItem(req.params.id);
  res.json({ success: true });
});

module.exports = router;
