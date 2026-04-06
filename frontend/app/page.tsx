'use client';
import Link from 'next/link';
import { FadeUp, FadeIn, StaggerText } from '@/components/Motion';
import ProductCard from '@/components/ProductCard';
import styles from './page.module.css';
import { useEffect, useState, Fragment } from 'react';
import { getProducts, getSettings } from '@/lib/api';

export default function Home() {
  const [products, setProducts] = useState<any[]>([]);
  const [settings, setSettings] = useState<any>({
    heroText1: "WEAR LESS.", 
    heroText2: "SAY MORE.", 
    heroCta: "ENTER THE ARCHIVE →",
    marqueeText: "SS26 ARCHIVE LIVE ✦ LIMITED RUNS ONLY ✦ NO RESTOCKS ✦ INTERNATIONAL SHIPPING"
  });

  useEffect(() => {
    getProducts().then(res => setProducts(res.products?.slice(0, 4) || []));
    getSettings().then(res => {
      if (res && res.heroText1) setSettings(res);
    }).catch(console.error);
  }, []);

  return (
    <div className={styles.page}>
      
      {/* COLLAGE HERO SECTION */}
      <section className={styles.heroCollage}>
        <div className={styles.collageContainer}>
          {/* Central massive typography */}
          <div className={styles.heroTextCenter}>
            <StaggerText text={settings.heroText1} className={styles.heroTitle} />
            <StaggerText text={settings.heroText2} className={styles.heroTitleSpan} delay={0.3} />
            <FadeUp delay={0.8}>
              <Link href="/shop" className={styles.heroCta}>
                {settings.heroCta}
              </Link>
            </FadeUp>
          </div>

          {/* Floating Collage Images */}
          <FadeIn delay={0.4}>
            <div className={`${styles.floatingImg} ${styles.float1}`}>
              <img src="/products/sabr.png" alt="Sabr Tee" />
            </div>
          </FadeIn>
          <FadeIn delay={0.6}>
            <div className={`${styles.floatingImg} ${styles.float2}`}>
              <img src="/products/qadr_warrior.png" alt="Warrior Graphic" />
            </div>
          </FadeIn>
          <FadeIn delay={0.5}>
            <div className={`${styles.floatingImg} ${styles.float3}`}>
              <img src="/products/umar_hoodie.png" alt="Umar Hoodie" />
            </div>
          </FadeIn>
          <FadeIn delay={0.7}>
            <div className={`${styles.floatingImg} ${styles.float4}`}>
              <img src="/products/midnight_mosque.png" alt="Midnight Mosque" />
            </div>
          </FadeIn>
        </div>
      </section>

      {/* MARQUEE */}
      <div className={styles.marqueeContainer}>
        <div className={styles.marquee}>
          {[1, 2, 3].map(group => (
            <Fragment key={group}>
              {settings.marqueeText.split('✦').map((text: string, i: number, arr: any[]) => (
                <Fragment key={i}>
                  <span>{text.trim()}</span>
                  <span className={styles.star}>✦</span>
                </Fragment>
              ))}
            </Fragment>
          ))}
        </div>
      </div>

      {/* LATEST DROPS */}
      <section className="container section">
        <FadeUp>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>LATEST DROPS</h2>
            <Link href="/shop" className={styles.viewAll}>VIEW ALL</Link>
          </div>
        </FadeUp>
        
        <div className={styles.grid}>
          {products.map((product, i) => (
            <FadeUp key={product.id} delay={i * 0.1}>
              <ProductCard product={product} />
            </FadeUp>
          ))}
        </div>
      </section>

      {/* CATEGORY COLLAGE / BENTO GRID */}
      <section className={styles.categorySection}>
        <div className={styles.bentoGrid}>
          <Link href="/shop?category=oversized" className={`${styles.bentoItem} ${styles.bentoLarge}`}>
            <div className={styles.bentoOverlay} />
            <h3 className={styles.bentoTitle}>HEAVYWEIGHT OVERSIZED</h3>
            <p className={styles.bentoSubtitle}>240GSM COMBED COTTON</p>
          </Link>
          
          <div className={styles.bentoCol}>
            <Link href="/shop?category=graphic" className={`${styles.bentoItem} ${styles.bentoSmall}`}>
              <div className={styles.bentoOverlay} />
              <h3 className={styles.bentoTitle}>GRAPHIC PIECES</h3>
              <p className={styles.bentoSubtitle}>CINEMATIC PRINTS</p>
            </Link>
            <Link href="/shop" className={`${styles.bentoItem} ${styles.bentoSmall} ${styles.bentoAccent}`}>
              <h3 className={styles.bentoTitleDark}>ACCESSORIES</h3>
              <p className={styles.bentoSubtitleDark}>COMING SOON</p>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
