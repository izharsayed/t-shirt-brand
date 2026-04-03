const express = require('express');
const router = express.Router();
const DB = require('../db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// GET all products
router.get('/', (req, res) => {
  const { category, sort } = req.query;
  const products = DB.getAllProducts({ category, sort });
  res.json({ products });
});

// GET single product
router.get('/:id', (req, res) => {
  const product = DB.getProduct(req.params.id);
  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json({ product });
});

// ADMIN: Create Product
router.post('/', requireAuth, requireAdmin, (req, res) => {
  const product = DB.createProduct(req.body);
  res.status(201).json({ success: true, product });
});

// ADMIN: Update Product
router.put('/:id', requireAuth, requireAdmin, (req, res) => {
  const updated = DB.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ error: 'Product not found' });
  res.json({ success: true, product: updated });
});

// ADMIN: Delete Product
router.delete('/:id', requireAuth, requireAdmin, (req, res) => {
  const success = DB.deleteProduct(req.params.id);
  if (!success) return res.status(500).json({ error: 'Failed to delete product' });
  res.json({ success: true });
});

module.exports = router;
