'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Trash2 } from 'lucide-react';
import styles from './page.module.css';

interface CartItem {
  id: number;
  name: string;
  price: number;
  size: string;
  quantity: number;
}

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const load = () => setCart(JSON.parse(localStorage.getItem('drpd_cart') || '[]'));
    load();
    window.addEventListener('cart_updated', load);
    return () => window.removeEventListener('cart_updated', load);
  }, []);

  const update = (id: number, size: string, delta: number) => {
    const updated = cart.map(i =>
      i.id === id && i.size === size ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ).filter(i => i.quantity > 0);
    setCart(updated);
    localStorage.setItem('drpd_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart_updated'));
  };

  const remove = (id: number, size: string) => {
    const updated = cart.filter(i => !(i.id === id && i.size === size));
    setCart(updated);
    localStorage.setItem('drpd_cart', JSON.stringify(updated));
    window.dispatchEvent(new Event('cart_updated'));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 2000 ? 0 : 99;
  const total = subtotal + shipping;

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.heading}>MY BAG <span className={styles.count}>({cart.length})</span></h1>

        {cart.length === 0 ? (
          <div className={styles.empty}>
            <p>Your bag is empty.</p>
            <Link href="/shop" className="btn-primary" style={{ marginTop: 32 }}>SHOP NOW</Link>
          </div>
        ) : (
          <div className={styles.layout}>
            {/* Items */}
            <div className={styles.items}>
              {cart.map(item => (
                <div key={`${item.id}-${item.size}`} className={styles.item}>
                  <div className={styles.itemImg}>
                    <span>QADR</span>
                  </div>
                  <div className={styles.itemInfo}>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemMeta}>SIZE: {item.size}</p>
                    <div className={styles.itemActions}>
                      <div className={styles.qty}>
                        <button onClick={() => update(item.id, item.size, -1)}>−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => update(item.id, item.size, 1)}>+</button>
                      </div>
                      <button className={styles.removeBtn} onClick={() => remove(item.id, item.size)}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className={styles.itemPrice}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className={styles.summary}>
              <h2 className={styles.summaryTitle}>ORDER SUMMARY</h2>
              <div className={styles.summaryRow}>
                <span>Subtotal</span>
                <span>₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Shipping</span>
                <span style={{ color: shipping === 0 ? '#E8FF00' : '#F5F0EA' }}>
                  {shipping === 0 ? 'FREE' : `₹${shipping}`}
                </span>
              </div>
              {shipping > 0 && (
                <p className={styles.freeShipHint}>Add ₹{(2000 - subtotal).toLocaleString('en-IN')} more for free shipping</p>
              )}
              <div className={styles.divider} />
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>TOTAL</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <Link href="/checkout" className={styles.checkoutBtn}>CHECKOUT →</Link>
              <Link href="/shop" className={styles.keepShopping}>← Continue shopping</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
