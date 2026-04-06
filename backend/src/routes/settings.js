const express = require('express');
const router = express.Router();
const DB = require('../db');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'drpd_secret_key_2026';

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

router.get('/', (req, res) => {
  res.json(DB.getSettings());
});

router.put('/', adminAuth, (req, res) => {
  const updated = DB.updateSettings(req.body);
  res.json(updated);
});

module.exports = router;
