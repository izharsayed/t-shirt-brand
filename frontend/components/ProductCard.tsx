import Link from 'next/link';
import styles from './ProductCard.module.css';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  images: string[];
}

export default function ProductCard({ product }: { product: Product }) {
  const placeholderColors: Record<string, string> = {
    oversized: '#1A1A1A',
    graphic: '#141414',
    essential: '#111111',
    all: '#1A1A1A',
  };
  const bg = placeholderColors[product.category] || '#1A1A1A';

  return (
    <Link href={`/shop/${product.id}`} className={styles.card}>
      <div className={styles.imageWrap} style={{ background: bg }}>
        {product.images?.[0] ? (
          <img src={product.images[0]} alt={product.name} className={styles.image} />
        ) : (
          <div className={styles.placeholder}>
            <span className={styles.placeholderLogo}>QADR</span>
          </div>
        )}
        <div className={styles.overlay}>
          <span className={styles.quickAdd}>QUICK ADD +</span>
        </div>
      </div>
      <div className={styles.info}>
        <p className={styles.name}>{product.name}</p>
        <p className={styles.price}>₹{product.price.toLocaleString('en-IN')}</p>
      </div>
    </Link>
  );
}
