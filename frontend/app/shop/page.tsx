'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { getProducts } from '@/lib/api';
import styles from './page.module.css';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  images: string | string[];
}

const FILTERS = [
  { label: 'ALL', value: 'all' },
  { label: 'OVERSIZED', value: 'oversized' },
  { label: 'GRAPHIC', value: 'graphic' },
  { label: 'ESSENTIALS', value: 'essential' },
];

const SORTS = [
  { label: 'NEWEST', value: 'newest' },
  { label: 'PRICE ↑', value: 'price_asc' },
  { label: 'PRICE ↓', value: 'price_desc' },
];

function ShopInner() {
  const searchParams = useSearchParams();
  const initCategory = searchParams.get('category') || 'all';
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState(initCategory);
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, string> = { sort };
    if (category !== 'all') params.category = category;
    getProducts(params)
      .then(d => setProducts((d.products || []).map((p: Product) => ({
        ...p,
        images: typeof p.images === 'string' ? JSON.parse(p.images) : p.images,
      }))))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [category, sort]);

  return (
    <div className={styles.page}>
      <div className="container">
        <h1 className={styles.heading}>ALL DROPS</h1>

        <div className={styles.toolbar}>
          {/* Filters */}
          <div className={styles.filters}>
            {FILTERS.map(f => (
              <button
                key={f.value}
                className={`${styles.filter} ${category === f.value ? styles.active : ''}`}
                onClick={() => setCategory(f.value)}
              >{f.label}</button>
            ))}
          </div>
          {/* Sort */}
          <div className={styles.sortGroup}>
            {SORTS.map(s => (
              <button
                key={s.value}
                className={`${styles.sortBtn} ${sort === s.value ? styles.sortActive : ''}`}
                onClick={() => setSort(s.value)}
              >{s.label}</button>
            ))}
          </div>
        </div>

        <p className={styles.count}>
          {loading ? '—' : `${products.length} PRODUCTS`}
        </p>

        {loading ? (
          <div className={styles.loading}>
            {[1,2,3,4,5,6].map(i => <div key={i} className={styles.skeleton} />)}
          </div>
        ) : (
          <div className={styles.grid}>
            {products.map(p => (
              <ProductCard key={p.id} product={{ ...p, images: p.images as string[] }} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <ShopInner />
    </Suspense>
  );
}
