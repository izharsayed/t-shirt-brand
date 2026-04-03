'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/lib/api';
import { Lock, RotateCcw, Zap } from 'lucide-react';
import styles from './page.module.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
}

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [payment, setPayment] = useState('UPI');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '', pincode: '' });

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem('drpd_cart') || '[]'));
  }, []);

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);
    try {
      const sessionId = localStorage.getItem('drpd_session') || '';
      const result = await createOrder({
        ...form,
        address: `${form.address}, ${form.pincode}`,
        items: cart,
        subtotal,
        total,
        payment_method: payment,
        session_id: sessionId,
      });
      localStorage.removeItem('drpd_cart');
      window.dispatchEvent(new Event('cart_updated'));
      router.push(`/order-confirmation?id=${result.order_id}`);
    } catch {
      alert('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.heading}>CHECKOUT</h1>
        <div className={styles.layout}>
          <form onSubmit={handleSubmit} className={styles.form}>
            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>DELIVERY INFO</h2>
              {[
                { name: 'name', label: 'Full Name', type: 'text' },
                { name: 'email', label: 'Email', type: 'email' },
                { name: 'phone', label: 'Phone', type: 'tel' },
                { name: 'address', label: 'Address', type: 'text' },
                { name: 'pincode', label: 'Pincode', type: 'text' },
              ].map(f => (
                <div key={f.name} className={styles.field}>
                  <label className={styles.label}>{f.label}</label>
                  <input
                    name={f.name} type={f.type} required
                    value={form[f.name as keyof typeof form]}
                    onChange={handleChange}
                    className={styles.input}
                    placeholder={f.label}
                  />
                </div>
              ))}
            </section>

            <section className={styles.section}>
              <h2 className={styles.sectionTitle}>PAYMENT</h2>
              <div className={styles.paymentGroup}>
                {['UPI', 'CARD', 'COD'].map(m => (
                  <button
                    key={m} type="button"
                    className={`${styles.payBtn} ${payment === m ? styles.payActive : ''}`}
                    onClick={() => setPayment(m)}
                  >{m}</button>
                ))}
              </div>
            </section>

            {/* Trust badges */}
            <div className={styles.trust}>
              <div className={styles.badge}><Lock size={14} /><span>Secure Checkout</span></div>
              <div className={styles.badge}><RotateCcw size={14} /><span>Free Returns</span></div>
              <div className={styles.badge}><Zap size={14} /><span>Express Delivery</span></div>
            </div>

            <button type="submit" className={styles.placeOrderBtn} disabled={loading || cart.length === 0}>
              {loading ? 'PLACING ORDER...' : `PLACE ORDER — ₹${total.toLocaleString('en-IN')}`}
            </button>
          </form>

          {/* Order summary sidebar */}
          <div className={styles.sidebar}>
            <h2 className={styles.sectionTitle}>YOUR ORDER</h2>
            {cart.map(item => (
              <div key={`${item.id}-${item.size}`} className={styles.orderItem}>
                <div className={styles.orderItemInfo}>
                  <p className={styles.orderItemName}>{item.name}</p>
                  <p className={styles.orderItemMeta}>Size: {item.size} × {item.quantity}</p>
                </div>
                <p className={styles.orderItemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
              </div>
            ))}
            <div className={styles.divider} />
            <div className={styles.summaryRow}><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
            <div className={styles.summaryRow}><span>Shipping</span><span style={{ color: shipping === 0 ? '#E8FF00' : '#F5F0EA' }}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span></div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}><span>TOTAL</span><span>₹{total.toLocaleString('en-IN')}</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
