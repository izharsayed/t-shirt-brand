import Link from 'next/link';
import styles from './page.module.css';

export const metadata = {
  title: 'About — Qadr Studio',
  description: 'The story behind Qadr Studio. Minimal streetwear. Made in India.',
};

export default function AboutPage() {
  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.header}>
          <p className={styles.label}>EST. 2026 — INDIA</p>
          <h1 className={styles.heading}>WE DON&apos;T MAKE CLOTHES.<br />WE MAKE STATEMENTS.</h1>
        </div>

        <div className={styles.body}>
          <div className={styles.text}>
            <p>
              Qadr Studio was born in a small room in Mumbai. No investors, no runway, no safety net. 
              Just an obsession with minimal design and zero patience for brands that say too much.
            </p>
            <p>
              We believe the best fashion is the kind that disappears. Where the garment stops being 
              a garment and becomes a second skin. Where you stop dressing for others and start 
              dressing for the version of yourself you want to become.
            </p>
            <p>
              Every tee is cut from 240–260gsm pre-washed cotton. No plastic. No compromises.
              Produced in small, intentional batches — so when it&apos;s gone, it&apos;s gone.
            </p>
            <p className={styles.signature}>
              — Wear less. Say more.
            </p>

            <div className={styles.pillars}>
              {[
                { title: 'MATERIAL', desc: '240–260gsm pre-washed combed cotton. Heavyweight, pre-shrunk.' },
                { title: 'FIT', desc: 'Oversized silhouette. Drop shoulder. Relaxed length.' },
                { title: 'RUNS', desc: 'Limited drops only. Each collection retires permanently.' },
                { title: 'ORIGIN', desc: 'Designed and produced in India. 100%.' },
              ].map(p => (
                <div key={p.title} className={styles.pillar}>
                  <h3>{p.title}</h3>
                  <p>{p.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.cta}>
          <Link href="/shop" className="btn-primary">SHOP THE COLLECTION →</Link>
        </div>
      </div>
    </div>
  );
}
