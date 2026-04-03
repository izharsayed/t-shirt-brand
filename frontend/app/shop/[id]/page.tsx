'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProduct, addToCart } from '@/lib/api';
import { FadeUp, FadeIn } from '@/components/Motion';
import styles from './page.module.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  sizes: string[];
  images: string[];
  category: string;
  stock: number;
}

function getOrCreateSession() {
  if (typeof window === 'undefined') return '';
  let id = localStorage.getItem('drpd_session');
  if (!id) { id = crypto.randomUUID(); localStorage.setItem('drpd_session', id); }
  return id;
}

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(true); // Open by default
  const [scrolledPast, setScrolledPast] = useState(false);

  useEffect(() => {
    getProduct(id).then(d => {
      const p = d.product;
      p.sizes = typeof p.sizes === 'string' ? JSON.parse(p.sizes) : p.sizes;
      p.images = typeof p.images === 'string' ? JSON.parse(p.images) : p.images;
      setProduct(p);
    }).catch(() => router.push('/shop'));
  }, [id, router]);

  // Handle sticky bottom bar visibility
  useEffect(() => {
    const handleScroll = () => {
      // Show sticky CTA if user scrolls down roughly 600px
      if (window.scrollY > 600) setScrolledPast(true);
      else setScrolledPast(false);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = async () => {
    if (!selectedSize || !product) return;
    setAdding(true);
    try {
      const sessionId = getOrCreateSession();
      // Optimistic local cart update
      const cart = JSON.parse(localStorage.getItem('drpd_cart') || '[]');
      const existing = cart.find((i: { id: number; size: string }) => i.id === product.id && i.size === selectedSize);
      if (existing) existing.quantity++;
      else cart.push({ id: product.id, name: product.name, price: product.price, size: selectedSize, quantity: 1, images: product.images });
      localStorage.setItem('drpd_cart', JSON.stringify(cart));
      
      // Dispatch event to update navbar instantly
      window.dispatchEvent(new Event('cart_updated'));
      
      await addToCart(sessionId, product.id, selectedSize);
      setAdded(true);
      
      // Navigate to cart for highly accelerated checkout flow
      setTimeout(() => router.push('/cart'), 400); 
    } catch { /* silent */ }
    setAdding(false);
  };

  const handleBuyNow = async () => {
    if (!selectedSize || !product) return;
    await handleAddToCart();
  };

  if (!product) return (
    <div className={styles.loading}>
      <div className={styles.imgSkel} />
      <div className={styles.infoSkel} />
    </div>
  );

  const comparePrice = Math.round(product.price * 1.3); // Fake 30% markup for price anchoring

  return (
    <>
      <div className={styles.page}>
        <div className="container">
          <div className={styles.layout}>
            
            {/* Image panel - Left Side (Scrollable if multiple images) */}
            <div className={styles.imgPanel}>
              <FadeUp>
                {product.images.length > 0 ? (
                  <div className={styles.imageGrid}>
                    {product.images.map((img, i) => (
                      <img key={i} src={img} alt={`${product.name} - View ${i+1}`} className={styles.img} />
                    ))}
                    {/* Add a duplicated image just to show scrolling capability if only 1 exists */}
                    {product.images.length === 1 && (
                       <img src={product.images[0]} alt={`${product.name} - Detail`} className={styles.imgDetail} />
                    )}
                  </div>
                ) : (
                  <div className={styles.imgPlaceholder}>
                    <span>QADR</span>
                  </div>
                )}
              </FadeUp>
            </div>

            {/* Info panel - Right Side (Sticky) */}
            <div className={styles.infoWrapper}>
              <div className={styles.info}>
                <FadeUp delay={0.1}>
                  <p className={styles.category}>
                    <span className={styles.pulseDot}></span>
                    {product.category.toUpperCase()} FIT
                  </p>
                  <h1 className={styles.name}>{product.name}</h1>
                  
                  {/* Reviews anchor */}
                  <a href="#reviews" className={styles.rating}>
                    ★★★★★ <span>4.8 (231 reviews)</span>
                  </a>

                  {/* Price Anchoring */}
                  <div className={styles.priceRow}>
                    <p className={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
                    <p className={styles.comparePrice}>₹{comparePrice.toLocaleString('en-IN')}</p>
                    <span className={styles.saveBadge}>SAVE 30%</span>
                  </div>
                </FadeUp>

                {/* Size selector */}
                <FadeUp delay={0.2}>
                  <div className={styles.sizeSection}>
                    <div className={styles.sizeHeader}>
                      <span>SELECT YOUR FIT</span>
                      <button className={styles.sizeGuide}>Size Guide →</button>
                    </div>

                    {/* Fake Urgency Badge */}
                    <div className={styles.urgencyBadge}>
                      🔥 High Demand — Only {product.stock < 15 ? product.stock : 8} left in stock.
                    </div>

                    <div className={styles.sizes}>
                      {product.sizes.map(sz => (
                        <button
                          key={sz}
                          className={`${styles.sizeChip} ${selectedSize === sz ? styles.sizeActive : ''}`}
                          onClick={() => setSelectedSize(sz)}
                        >
                          {sz}
                        </button>
                      ))}
                    </div>
                    {!selectedSize ? (
                      <p className={styles.sizeHint}>Select your fit to claim it.</p>
                    ) : (
                      <p className={styles.sizeHintSuccess}>Great choice.</p>
                    )}
                  </div>
                </FadeUp>

                {/* Action Buttons */}
                <FadeUp delay={0.3}>
                  <div className={styles.actionGroup}>
                    <button
                      className={`${styles.addBtn} ${added ? styles.addedBtn : ''}`}
                      onClick={handleAddToCart}
                      disabled={adding}
                    >
                      {added ? '✓ ADDED' : adding ? 'ADDING...' : 'ADD TO BAG'}
                    </button>
                    <button
                      className={styles.buyNowBtn}
                      onClick={handleBuyNow}
                      disabled={adding}
                    >
                      BUY IT NOW
                    </button>
                  </div>
                  <p className={styles.microCopy}>Dispatches in 24 hours. Limited run.</p>
                </FadeUp>

                {/* Trust Badges */}
                <FadeIn delay={0.4}>
                  <div className={styles.trustBadges}>
                    <div className={styles.trustItem}>
                      <span className={styles.trustIcon}>📦</span> Free Shipping across India
                    </div>
                    <div className={styles.trustItem}>
                      <span className={styles.trustIcon}>🔄</span> 7-Day Easy Returns
                    </div>
                    <div className={styles.trustItem}>
                      <span className={styles.trustIcon}>🔒</span> Secure 256-bit Checkout
                    </div>
                  </div>
                </FadeIn>

                {/* Description accordion */}
                <FadeUp delay={0.5}>
                  <div className={styles.accordion}>
                    <button className={styles.accordionBtn} onClick={() => setDetailsOpen(!detailsOpen)}>
                      <span>THE BLUEPRINT</span>
                      <span className={detailsOpen ? styles.accIconOpen : styles.accIcon}>+</span>
                    </button>
                    <div className={`${styles.accordionBody} ${detailsOpen ? styles.accordionBodyOpen : ''}`}>
                      <p className={styles.descText}>{product.description}</p>
                      <ul className={styles.featureList}>
                        <li>240gsm heavyweight combed cotton</li>
                        <li>Brutalist oversized / boxed fit</li>
                        <li>Drop shoulder construction</li>
                        <li>High-density premium print</li>
                        <li>Pre-washed for zero shrink</li>
                        <li>Crafted meticulously in India 🖤</li>
                      </ul>
                    </div>
                  </div>
                </FadeUp>

              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Add-to-Cart Bar */}
      <div className={`${styles.stickyBar} ${scrolledPast ? styles.stickyBarVisible : ''}`}>
        <div className={styles.stickyInner}>
          <div className={styles.stickyInfo}>
            <p className={styles.stickyName}>{product.name}</p>
            <p className={styles.stickyPrice}>₹{product.price.toLocaleString('en-IN')}</p>
          </div>
          <button
            className={`${styles.stickyBtn} ${!selectedSize ? styles.stickyBtnDisabled : ''}`}
            onClick={handleBuyNow}
            disabled={adding}
          >
            {selectedSize ? `BUY ${selectedSize}` : 'SELECT SIZE'}
          </button>
        </div>
      </div>
    </>
  );
}
