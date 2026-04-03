'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAdminStats, getAdminOrders, getAdminUsers, updateOrderStatusAdmin } from '@/lib/api';
import { FadeUp, FadeIn } from '@/components/Motion';
import styles from './page.module.css';
import { Package, Users, DollarSign, Activity, RefreshCw } from 'lucide-react';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [s, o, u] = await Promise.all([
        getAdminStats(),
        getAdminOrders(),
        getAdminUsers()
      ]);
      setStats(s);
      setOrders(o);
      setUsers(u);
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
                <button className={styles.actionBtnSecondary} onClick={() => alert('Product editor coming soon')}>Add New Drop</button>
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
                          <td style={{ fontWeight: 600, color: '#F5F0EA' }}>{u.name}</td>
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
      </div>
    </div>
  );
}
