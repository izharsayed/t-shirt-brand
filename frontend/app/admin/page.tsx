'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminStats, getAdminOrders, getAdminUsers, updateOrderStatusAdmin, getProducts, createProductAdmin, updateProductAdmin, deleteProductAdmin, uploadImageAdmin, getSettings, updateSettingsAdmin } from '@/lib/api';
import { FadeUp, FadeIn } from '@/components/Motion';
import styles from './page.module.css';
import { Package, Users, DollarSign, Activity, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users' | 'products' | 'home'>('overview');
  const [homeSettings, setHomeSettings] = useState<any>({ heroText1: '', heroText2: '', heroCta: '', marqueeText: '' });
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  
  const [showForm, setShowForm] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<any>({ name: '', price: '', category: '', image: '', desc: '' });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [s, o, u, p, settingsData] = await Promise.all([
        getAdminStats(),
        getAdminOrders(),
        getAdminUsers(),
        getProducts(),
        getSettings()
      ]);
      setStats(s);
      setOrders(o);
      setUsers(u);
      setProducts(p.products || []);
      setHomeSettings(settingsData);
    } catch (err) {
      console.error(err);
      // Unauthorized, redirect to login
      router.push('/login');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDashboardData();
  }, [router]);

  const handleStatusChange = async (orderId: number, status: string) => {
    try {
      await updateOrderStatusAdmin(orderId, status);
      fetchDashboardData(); // Refresh list to get updated orders
    } catch (err) {
      console.error('Failed to update order status');
    }
  };

  const handleHomeSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettingsAdmin(homeSettings);
      alert('Home page updated successfully!');
      fetchDashboardData();
    } catch (err) {
      alert('Error updating home page');
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const res = await uploadImageAdmin(file);
      setCurrentProduct({...currentProduct, image: res.url});
    } catch(err) {
      alert('Failed to upload image');
    }
    setUploading(false);
  };

  const openForm = (prod: any = { name: '', price: '', category: '', image: '', desc: '' }) => {
    setCurrentProduct(prod);
    setShowForm(true);
  };

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentProduct.id) {
        await updateProductAdmin(currentProduct.id, currentProduct);
      } else {
        await createProductAdmin(currentProduct);
      }
      setShowForm(false);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Error saving product');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if(!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteProductAdmin(id);
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      alert('Error deleting product');
    }
  };

  if (loading) return (
    <div className={styles.loadingContainer}>
      <RefreshCw className={styles.spinner} size={32} />
    </div>
  );

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <FadeUp>
          <div className={styles.header}>
            <h1 className={styles.title}>QADR COMMAND</h1>
            <p className={styles.subtitle}>System Overview & Management</p>
          </div>
        </FadeUp>

        {/* Navigation Tabs */}
        <FadeUp delay={0.1}>
          <div className={styles.tabs}>
            <button 
              className={`${styles.tab} ${activeTab === 'overview' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'orders' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'users' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('users')}
            >
              Users
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'products' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Products
            </button>
            <button 
              className={`${styles.tab} ${activeTab === 'home' ? styles.tabActive : ''}`}
              onClick={() => setActiveTab('home')}
            >
              Home Layout
            </button>
          </div>
        </FadeUp>

        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' && (
          <FadeIn delay={0.2}>
            <div className={styles.grid}>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <p className={styles.statLabel}>Total Revenue</p>
                  <DollarSign size={18} className={styles.statIcon} />
                </div>
                <h3 className={styles.statValue}>₹{stats?.totalRevenue.toLocaleString() || '0'}</h3>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <p className={styles.statLabel}>Total Orders</p>
                  <Package size={18} className={styles.statIcon} />
                </div>
                <h3 className={styles.statValue}>{stats?.totalOrders || '0'}</h3>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <p className={styles.statLabel}>Total Customers</p>
                  <Users size={18} className={styles.statIcon} />
                </div>
                <h3 className={styles.statValue}>{stats?.totalUsers || '0'}</h3>
              </div>
              <div className={styles.statCard}>
                <div className={styles.statHeader}>
                  <p className={styles.statLabel}>Live Products</p>
                  <Activity size={18} className={styles.statIcon} />
                </div>
                <h3 className={styles.statValue}>{stats?.totalProducts || '0'}</h3>
              </div>
            </div>
            
            <div className={styles.quickActions}>
              <h3 className={styles.sectionTitle}>Quick Actions</h3>
              <div className={styles.actionGrid}>
                <button className={styles.actionBtn} onClick={() => setActiveTab('orders')}>Process Pending Orders</button>
                <button className={styles.actionBtnSecondary} onClick={() => { setActiveTab('products'); openForm(); }}>Add New Drop</button>
              </div>
            </div>
          </FadeIn>
        )}

        {/* ORDERS PANEL */}
        {activeTab === 'orders' && (
          <FadeIn delay={0.2}>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Recent Orders</h2>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length === 0 ? (
                      <tr><td colSpan={7} className={styles.emptyRow}>No orders found.</td></tr>
                    ) : (
                      orders.map((o: any) => (
                        <tr key={o.id}>
                          <td>#{o.id}</td>
                          <td>
                            <div className={styles.customerInfo}>
                              <span>{o.name}</span>
                              <span className={styles.customerEmail}>{o.email}</span>
                            </div>
                          </td>
                          <td>{(o.items || []).reduce((sum: number, i: any) => sum + i.quantity, 0)} items</td>
                          <td>₹{o.total?.toLocaleString() || o.total_price?.toLocaleString()}</td>
                          <td>{new Date(o.created_at).toLocaleDateString()}</td>
                          <td>
                            <span className={`${styles.statusBadge} ${styles['status' + o.status]}`}>
                              {o.status.toUpperCase()}
                            </span>
                          </td>
                          <td>
                            <select 
                              className={styles.statusSelect}
                              value={o.status}
                              onChange={(e) => handleStatusChange(o.id, e.target.value)}
                            >
                              <option value="pending">Pending</option>
                              <option value="processing">Processing</option>
                              <option value="shipped">Shipped</option>
                              <option value="delivered">Delivered</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        )}

        {/* USERS PANEL */}
        {activeTab === 'users' && (
          <FadeIn delay={0.2}>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Customer Registry</h2>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Registered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={4} className={styles.emptyRow}>No users found.</td></tr>
                    ) : (
                      users.map((u: any) => (
                        <tr key={u.id}>
                          <td>#{u.id}</td>
                          <td style={{ fontWeight: 600, color: 'var(--text)' }}>{u.name}</td>
                          <td>{u.email}</td>
                          <td>{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        )}

        {/* HOMEPAGE LAYOUT PANEL */}
        {activeTab === 'home' && (
          <FadeIn delay={0.2}>
            <div className={styles.panel}>
              <h2 className={styles.panelTitle}>Home Page Customize</h2>
              <form onSubmit={handleHomeSettingsSubmit} style={{ maxWidth: '600px' }}>
                <div className={styles.formGroup}>
                  <label>Hero Text Line 1</label>
                  <input required className={styles.formInput} value={homeSettings.heroText1} onChange={e => setHomeSettings({...homeSettings, heroText1: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Hero Text Line 2</label>
                  <input required className={styles.formInput} value={homeSettings.heroText2} onChange={e => setHomeSettings({...homeSettings, heroText2: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Hero CTA Button</label>
                  <input required className={styles.formInput} value={homeSettings.heroCta} onChange={e => setHomeSettings({...homeSettings, heroCta: e.target.value})} />
                </div>
                <div className={styles.formGroup}>
                  <label>Marquee Text</label>
                  <textarea required className={styles.formInput} rows={3} value={homeSettings.marqueeText} onChange={e => setHomeSettings({...homeSettings, marqueeText: e.target.value})}></textarea>
                </div>
                <button type="submit" className={styles.actionBtn}>Save Changes</button>
              </form>
            </div>
          </FadeIn>
        )}
      </div>

        {/* PRODUCTS PANEL */}
        {activeTab === 'products' && (
          <FadeIn delay={0.2}>
            <div className={styles.panel}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h2 className={styles.panelTitle} style={{ marginBottom: 0 }}>Product Inventory</h2>
                <button className={styles.actionBtn} onClick={() => openForm()}>+ Add Product</button>
              </div>
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Image</th>
                      <th>ID / Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length === 0 ? (
                      <tr><td colSpan={5} className={styles.emptyRow}>No products found.</td></tr>
                    ) : (
                      products.map((p: any) => (
                        <tr key={p.id}>
                          <td>
                            <img src={p.image} alt={p.name} className={styles.productImageThumb} />
                          </td>
                          <td>
                            <div className={styles.customerInfo}>
                              <span style={{ fontWeight: 600, color: 'var(--text)' }}>{p.name}</span>
                              <span className={styles.customerEmail}>#{p.id}</span>
                            </div>
                          </td>
                          <td style={{ textTransform: 'capitalize' }}>{p.category}</td>
                          <td>₹{p.price}</td>
                          <td>
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button className={styles.editBtn} onClick={() => openForm(p)}>Edit</button>
                              <button className={styles.dangerBtn} onClick={() => handleDeleteProduct(p.id)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </FadeIn>
        )}

      {showForm && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <h2 className={styles.panelTitle}>{currentProduct.id ? 'Edit Product' : 'Add Product'}</h2>
            <form onSubmit={handleProductSubmit}>
              <div className={styles.formGroup}>
                <label>Name</label>
                <input required className={styles.formInput} value={currentProduct.name} onChange={e => setCurrentProduct({...currentProduct, name: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Price (₹)</label>
                <input required type="number" className={styles.formInput} value={currentProduct.price || ''} onChange={e => setCurrentProduct({...currentProduct, price: Number(e.target.value)})} />
              </div>
              <div className={styles.formGroup}>
                <label>Category</label>
                <input required className={styles.formInput} value={currentProduct.category} onChange={e => setCurrentProduct({...currentProduct, category: e.target.value})} />
              </div>
              <div className={styles.formGroup}>
                <label>Product Photo</label>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  {currentProduct.image && <img src={currentProduct.image} alt="preview" style={{width: 48, height: 48, objectFit: 'cover', borderRadius: 4, flexShrink: 0}} />}
                  <div style={{flex: 1}}>
                    <input type="file" accept="image/*" className={styles.formInput} onChange={handleImageUpload} style={{padding: '8px'}} />
                    <input required placeholder="Or enter image URL" className={styles.formInput} style={{marginTop: '8px'}} value={currentProduct.image} onChange={e => setCurrentProduct({...currentProduct, image: e.target.value})} />
                  </div>
                </div>
                {uploading && <span style={{fontSize: 12, color: '#E8FF00', marginTop: '4px', display: 'block'}}>Uploading...</span>}
              </div>
              <div className={styles.formGroup}>
                <label>Description (Optional)</label>
                <textarea className={styles.formInput} rows={3} value={currentProduct.desc || ''} onChange={e => setCurrentProduct({...currentProduct, desc: e.target.value})}></textarea>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.actionBtnSecondary} onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className={styles.actionBtn}>Save Product</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

