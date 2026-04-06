const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const DB_FILE = path.join(__dirname, '..', 'data.json');

// Initialize DB file
function loadDB() {
  if (!fs.existsSync(DB_FILE)) {
    const init = { users: [], products: [], cart_items: [], orders: [], _seq: { users: 0, products: 0, cart_items: 0, orders: 0 } };
    fs.writeFileSync(DB_FILE, JSON.stringify(init, null, 2));
    return init;
  }
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  if (!data.settings) {
    data.settings = {
      heroText1: 'WEAR LESS.',
      heroText2: 'SAY MORE.',
      heroCta: 'ENTER THE ARCHIVE →',
      marqueeText: 'SS26 ARCHIVE LIVE ✦ LIMITED RUNS ONLY ✦ NO RESTOCKS ✦ INTERNATIONAL SHIPPING'
    };
    saveDB(data);
  }
  return data;
}

function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

function nextId(db, table) {
  db._seq[table] = (db._seq[table] || 0) + 1;
  return db._seq[table];
}

// Seed products
function seedProducts(db) {
  if (db.products.length > 0) return;
  const products = [
    { name: 'SABR HEAVYWEIGHT TEE', description: 'Patience and endurance. Dark charcoal cotton featuring subtle monochrome Persian rug patterns and modern Arabic calligraphy on the chest.', price: 1899, category: 'oversized', sizes: ['XS','S','M','L','XL','XXL'], images: ['/products/sabr.png'], stock: 80 },
    { name: 'DESERT WARRIOR GRAPHIC', description: 'A moody, cinematic homage to historical warriors. High contrast ethereal aura print on pure black 240gsm cotton.', price: 2199, category: 'graphic', sizes: ['S','M','L','XL','XXL'], images: ['/products/qadr_warrior.png'], stock: 60 },
    { name: 'YOU VS YOU VINTAGE WASH', description: 'Discipline graphic mixing athletic silhouettes and Islamic geometric patterns. Muted cold tones on vintage grey.', price: 1999, category: 'graphic', sizes: ['XS','S','M','L','XL'], images: ['/products/you_vs_you.png'], stock: 45 },
    { name: 'QADR LOGO TEE', description: 'Minimal brand typography. Chest print on 200gsm combed cotton. Destiny mapped out. Unisex fit.', price: 1299, category: 'essential', sizes: ['XS','S','M','L','XL'], images: ['/products/qadr_logo.png'], stock: 100 },
    { name: 'UMAR R.A. TRIBUTE HOODIE', description: 'Desert silhouettes and bold golden typography over premium black fleece. Designed for winter drops.', price: 3499, category: 'outerwear', sizes: ['S','M','L','XL'], images: ['/products/umar_hoodie.png'], stock: 40 },
    { name: 'PERSIAN WEAVE LONG SLEEVE', description: 'Intricate tapestry artwork fused with dark grunge aesthetics. Printed sleeves and back.', price: 1699, category: 'graphic', sizes: ['XS','S','M','L','XL','XXL'], images: ['/products/persian_ls.png'], stock: 90 },
    { name: 'TAWAKKUL ESSENTIAL TEE', description: 'Trust the process. Drop shoulder relaxed fit with minimalist white typographic hit.', price: 1499, category: 'essential', sizes: ['S','M','L','XL'], images: ['/products/tawakkul.png'], stock: 30 },
    { name: 'MIDNIGHT MOSQUE TEE', description: 'Architectural streetwear. Dark monochromatic print of classic domes. Boxy crop cut.', price: 1799, category: 'graphic', sizes: ['XS','S','M','L','XL','XXL'], images: ['/products/midnight_mosque.png'], stock: 70 },
  ];
  const now = new Date().toISOString();
  products.forEach(p => {
    db.products.push({ id: nextId(db, 'products'), ...p, created_at: now });
  });
  saveDB(db);
}

// Initialize
const db = loadDB();
seedProducts(db);

// Simple query helpers
const DB = {
  // Settings
  getSettings() {
    return loadDB().settings;
  },
  updateSettings(updates) {
    const data = loadDB();
    data.settings = { ...data.settings, ...updates };
    saveDB(data);
    return data.settings;
  },

  // Products
  getAllProducts(filters = {}) {
    let data = loadDB();
    let products = [...data.products];
    if (filters.category && filters.category !== 'all') {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters.sort === 'price_asc') products.sort((a, b) => a.price - b.price);
    else if (filters.sort === 'price_desc') products.sort((a, b) => b.price - a.price);
    else products.sort((a, b) => b.id - a.id);
    return products;
  },
  getProduct(id) {
    return loadDB().products.find(p => p.id === parseInt(id));
  },
  createProduct(productParams) {
    const data = loadDB();
    const product = { 
      id: nextId(data, 'products'), 
      ...productParams, 
      created_at: new Date().toISOString() 
    };
    data.products.push(product);
    saveDB(data);
    return product;
  },
  updateProduct(id, updates) {
    const data = loadDB();
    const index = data.products.findIndex(p => p.id === parseInt(id));
    if (index === -1) return null;
    data.products[index] = { ...data.products[index], ...updates };
    saveDB(data);
    return data.products[index];
  },
  deleteProduct(id) {
    const data = loadDB();
    data.products = data.products.filter(p => p.id !== parseInt(id));
    saveDB(data);
    return true;
  },

  // Users
  getUserByEmail(email) { return loadDB().users.find(u => u.email === email); },
  createUser(name, email, password_hash) {
    const data = loadDB();
    const user = { id: nextId(data, 'users'), name, email, password_hash, created_at: new Date().toISOString() };
    data.users.push(user);
    saveDB(data);
    return user;
  },

  // Cart
  getCart(session_id) {
    const data = loadDB();
    const items = data.cart_items.filter(i => i.session_id === session_id);
    return items.map(i => {
      const p = data.products.find(p => p.id === i.product_id);
      return { ...i, name: p?.name, price: p?.price, images: p?.images || [] };
    });
  },
  addToCart(session_id, product_id, size, quantity) {
    const data = loadDB();
    const existing = data.cart_items.find(i => i.session_id === session_id && i.product_id === parseInt(product_id) && i.size === size);
    if (existing) {
      existing.quantity += quantity;
    } else {
      data.cart_items.push({ id: nextId(data, 'cart_items'), session_id, product_id: parseInt(product_id), size, quantity });
    }
    saveDB(data);
  },
  updateCartItem(id, quantity) {
    const data = loadDB();
    const item = data.cart_items.find(i => i.id === parseInt(id));
    if (item) {
      if (quantity < 1) data.cart_items = data.cart_items.filter(i => i.id !== parseInt(id));
      else item.quantity = quantity;
      saveDB(data);
    }
  },
  removeCartItem(id) {
    const data = loadDB();
    data.cart_items = data.cart_items.filter(i => i.id !== parseInt(id));
    saveDB(data);
  },
  clearCart(session_id) {
    const data = loadDB();
    data.cart_items = data.cart_items.filter(i => i.session_id !== session_id);
    saveDB(data);
  },

  // Orders
  createOrder({ name, email, phone, address, items, subtotal, total, payment_method }) {
    const data = loadDB();
    const order = {
      id: nextId(data, 'orders'), name, email, phone, address,
      items, subtotal, total, payment_method: payment_method || 'COD',
      status: 'pending', created_at: new Date().toISOString()
    };
    data.orders.push(order);
    saveDB(data);
    return order;
  },
  getOrder(id) {
    return loadDB().orders.find(o => o.id === parseInt(id));
  },
  getAllOrders() {
    return loadDB().orders.sort((a, b) => b.id - a.id);
  },
  updateOrderStatus(id, status) {
    const data = loadDB();
    const order = data.orders.find(o => o.id === parseInt(id));
    if (order) {
      order.status = status;
      saveDB(data);
      return order;
    }
    return null;
  },
  getAllUsers() {
    return loadDB().users.map(u => ({ id: u.id, name: u.name, email: u.email, created_at: u.created_at })).sort((a, b) => b.id - a.id);
  },
  getDashboardStats() {
    const data = loadDB();
    const totalRevenue = data.orders.reduce((sum, order) => sum + (order.total || 0), 0);
    return {
      totalRevenue,
      totalOrders: data.orders.length,
      totalProducts: data.products.length,
      totalUsers: data.users.length
    };
  },
};

module.exports = DB;
