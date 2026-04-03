import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <span className={styles.logo}>QADR STUDIO</span>
            <p className={styles.tagline}>Wear less. Say more.</p>
          </div>
          <div className={styles.cols}>
            <div className={styles.col}>
              <h4>Shop</h4>
              <Link href="/shop">All Drops</Link>
              <Link href="/shop?category=oversized">Oversized</Link>
              <Link href="/shop?category=graphic">Graphic</Link>
              <Link href="/shop?category=essential">Essentials</Link>
            </div>
            <div className={styles.col}>
              <h4>Info</h4>
              <Link href="/about">About</Link>
              <Link href="#">Size Guide</Link>
              <Link href="#">Shipping</Link>
              <Link href="#">Returns</Link>
            </div>
            <div className={styles.col}>
              <h4>Connect</h4>
              <a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram</a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer">X / Twitter</a>
              <a href="mailto:hello@drpd.in">hello@drpd.in</a>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>© 2026 Qadr Studio. All rights reserved.</p>
          <p>Made in India. 🖤</p>
        </div>
      </div>
    </footer>
  );
}
