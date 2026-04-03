'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ShoppingBag, Menu, X, User, LogOut } from 'lucide-react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [showUserMenu, setShowUserMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const updateCount = () => {
      const cart = JSON.parse(localStorage.getItem('drpd_cart') || '[]');
      setCartCount(cart.reduce((s: number, i: { quantity: number }) => s + i.quantity, 0));
    };
    updateCount();
    window.addEventListener('cart_updated', updateCount);
    return () => window.removeEventListener('cart_updated', updateCount);
  }, []);

  // Load user from localStorage
  useEffect(() => {
    const loadUser = () => {
      const stored = localStorage.getItem('qadr_user');
      if (stored) {
        try { setUser(JSON.parse(stored)); } catch { setUser(null); }
      } else {
        setUser(null);
      }
    };
    loadUser();
    window.addEventListener('auth_updated', loadUser);
    return () => window.removeEventListener('auth_updated', loadUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('qadr_token');
    localStorage.removeItem('qadr_user');
    setUser(null);
    setShowUserMenu(false);
    window.dispatchEvent(new Event('auth_updated'));
  };

  return (
    <>
      <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ''}`}>
        <div className={styles.inner}>
          <button className={styles.hamburger} onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Menu size={22} />
          </button>
          <Link href="/" className={styles.logo}>QADR STUDIO</Link>
          <div className={styles.links}>
            <Link href="/shop" className={styles.link}>Shop</Link>
            <Link href="/shop?category=new" className={styles.link}>Drops</Link>
            <Link href="/about" className={styles.link}>About</Link>
          </div>
          <div className={styles.actions}>
            {/* User Auth */}
            {user ? (
              <div className={styles.userArea}>
                <button
                  className={styles.userBtn}
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  aria-label="User menu"
                >
                  <User size={18} />
                  <span className={styles.userName}>{user.name.split(' ')[0]}</span>
                </button>
                {showUserMenu && (
                  <div className={styles.userDropdown}>
                    <div className={styles.dropdownHeader}>
                      <p className={styles.dropdownName}>{user.name}</p>
                      <p className={styles.dropdownEmail}>{user.email}</p>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <button className={styles.dropdownItem} onClick={handleLogout}>
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className={styles.authLink} aria-label="Sign in">
                <User size={18} />
              </Link>
            )}
            {/* Cart */}
            <Link href="/cart" className={styles.cartBtn} aria-label="Cart">
              <ShoppingBag size={20} />
              {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`${styles.drawer} ${menuOpen ? styles.drawerOpen : ''}`}>
        <button className={styles.closeBtn} onClick={() => setMenuOpen(false)}><X size={24} /></button>
        <nav className={styles.drawerNav}>
          <Link href="/shop" onClick={() => setMenuOpen(false)}>SHOP</Link>
          <Link href="/shop?category=oversized" onClick={() => setMenuOpen(false)}>OVERSIZED</Link>
          <Link href="/shop?category=graphic" onClick={() => setMenuOpen(false)}>GRAPHIC</Link>
          <Link href="/shop?category=essential" onClick={() => setMenuOpen(false)}>ESSENTIALS</Link>
          <Link href="/about" onClick={() => setMenuOpen(false)}>ABOUT</Link>
          {user ? (
            <button onClick={() => { handleLogout(); setMenuOpen(false); }} className={styles.drawerLogout}>
              SIGN OUT
            </button>
          ) : (
            <Link href="/login" onClick={() => setMenuOpen(false)}>SIGN IN</Link>
          )}
        </nav>
        {user && (
          <p className={styles.drawerUser}>Signed in as {user.name}</p>
        )}
        <p className={styles.drawerTagline}>Wear less. Say more.</p>
      </div>
      {menuOpen && <div className={styles.overlay} onClick={() => setMenuOpen(false)} />}
      {showUserMenu && <div className={styles.overlayLight} onClick={() => setShowUserMenu(false)} />}
    </>
  );
}
