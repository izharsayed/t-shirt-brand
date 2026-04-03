const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'drpd_secret_key_2026';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, SECRET);
    req.user = decoded; // { id, email }
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

function requireAdmin(req, res, next) {
  // In a real database, you'd check if req.user.role === 'admin'
  // For this project, let's hardcode an admin email for demonstration
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@qadrstudio.com';
  
  if (req.user && req.user.email === adminEmail) {
    next();
  } else {
    return res.status(403).json({ error: 'Forbidden: Admin access required' });
  }
}

module.exports = { requireAuth, requireAdmin, SECRET };
