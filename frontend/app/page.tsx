import Link from 'next/link';
import { getProducts } from '@/lib/api';
import ProductCard from '@/components/ProductCard';
import { FadeUp, FadeIn } from '@/components/Motion';
import styles from './page.module.css';

export const revalidate = 60;

const reviews = [
  { text: 'Best tee I own — clean, minimal, fits like a dream', handle: '@rawstyle_ayan' },
  { text: 'Bought 3 already. Never going back.', handle: '@itsdevansh' },
  { text: 'Finally an Indian brand that gets it', handle: '@streetwear.kid' },
  { text: 'The monolith tee hits different', handle: '@ruchika.drpd' },
  { text: 'Worth every rupee', handle: '@thehoodguy_' },
];

export default async function Home() {
  let featured: { id: number; name: string; price: number; category: string; images: string[] }[] = [];
  try {
    const data = await getProducts({ sort: 'newest' });
    featured = (data.products || []).slice(0, 3).map((p: any) => ({
      ...p,
      images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
    }));
  } catch {}

  const ticker = [...reviews, ...reviews, ...reviews]; // Tripled to ensure long marquee

  return (
    <>
      {/* HERO */}
      <section className={styles.hero}>
        <div className={styles.heroBg} />
        <div className={styles.heroOverlay} />
        <div className={styles.heroContent}>
          <FadeUp delay={0.2}>
            <p className={styles.heroLabel}>SS26 COLLECTION — NEW DROP</p>
          </FadeUp>
          <FadeUp delay={0.4}>
            <h1 className={styles.heroTitle}>
              WEAR<br />LESS.<br />SAY<br />MORE.
            </h1>
          </FadeUp>
          <FadeIn delay={0.8}>
            <Link href="/shop" className="btn-primary">SHOP THE DROP →</Link>
          </FadeIn>
        </div>
        <FadeIn delay={1.2} duration={2}>
          <div className={styles.heroScroll}>↓ SCROLL TO EXPLORE</div>
        </FadeIn>
      </section>

      {/* FEATURED DROPS */}
      <section className={styles.section}>
        <div className="container">
          <FadeUp>
            <div className={styles.sectionHead}>
              <h2 className={styles.sectionTitle}>LATEST DROPS</h2>
              <Link href="/shop" className={styles.viewAll}>EXPLORE COLLECTION →</Link>
            </div>
          </FadeUp>
          <div className={styles.grid3}>
            {featured.length > 0 ? (
              featured.map((p, i) => (
                <FadeUp key={p.id} delay={i * 0.1}>
                  <ProductCard product={p} />
                </FadeUp>
              ))
            ) : (
              [1, 2, 3].map((i) => (
                <FadeUp key={i} delay={i * 0.1}>
                  <ProductCard product={{ id: i, name: `QADR TEE 0${i}`, price: 1499 + i * 200, category: 'all', images: [] }} />
                </FadeUp>
              ))
            )}
          </div>
        </div>
      </section>

      {/* MARQUEE REVIEWS - High Contrast */}
      <section className={styles.marqSection}>
        <div className="marquee-wrapper">
          <div className="marquee-track">
            {ticker.map((r, i) => (
              <span key={i} className={styles.marqItem}>
                ★★★★★ &ldquo;{r.text}&rdquo; — {r.handle}
                <span className={styles.marqDot}>◆</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES - Visual Grids */}
      <section className={styles.categories}>
        <div className="container">
          <div className={styles.catGrid}>
            <FadeUp delay={0.1}>
              <Link href="/shop?category=oversized" className={styles.catCard}>
                <div className={styles.catBg} />
                <div className={styles.catPlaceholder}>
                  <span>●</span>
                </div>
                <div className={styles.catText}>
                  <p className={styles.catLabel}>ESSENTIALS</p>
                  <h3>OVERSIZED FIT</h3>
                  <span className={styles.catArrow}>→</span>
                </div>
              </Link>
            </FadeUp>
            <FadeUp delay={0.2}>
              <Link href="/shop?category=graphic" className={styles.catCard}>
                <div className={styles.catBg} />
                <div className={styles.catPlaceholder}>
                  <span>◆</span>
                </div>
                <div className={styles.catText}>
                  <p className={styles.catLabel}>CRAFTED</p>
                  <h3>GRAPHIC SERIES</h3>
                  <span className={styles.catArrow}>→</span>
                </div>
              </Link>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* CTA BAND */}
      <section className={styles.ctaBand}>
        <div className="container">
          <FadeUp>
            <h2 className={styles.ctaTitle}>THE DROP<br />IS LIVE.</h2>
          </FadeUp>
          <FadeUp delay={0.2}>
            <Link href="/shop" className="btn-primary">SHOP ALL DROPS</Link>
          </FadeUp>
        </div>
      </section>
    </>
  );
}
