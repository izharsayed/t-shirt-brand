require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/settings', require('./routes/settings'));

const path = require('path');
app.use(express.static(path.join(__dirname, '../public')));

app.get('/api/health', (req, res) => res.json({ status: 'ok', brand: 'Qadr Studio' }));

app.listen(PORT, () => {
  console.log(`🖤 Qadr Studio API running at http://localhost:${PORT}`);
});
