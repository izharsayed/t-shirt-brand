'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

function ConfirmationInner() {
  const params = useSearchParams();
  const orderId = params.get('id');

  return (
    <div className={styles.page}>
      <div className="container">
        <div className={styles.inner}>
          <p className={styles.icon}>✓</p>
          <h1 className={styles.heading}>ORDER CONFIRMED</h1>
          <p className={styles.subheading}>You&apos;re locked in.</p>
          {orderId && <p className={styles.orderId}>ORDER #{String(orderId).padStart(4, '0')}</p>}
          <p className={styles.message}>
            We&apos;ve received your order and will dispatch within 24 hours.
            You&apos;ll get a confirmation soon.
          </p>
          <div className={styles.actions}>
            <Link href="/shop" className="btn-primary">KEEP SHOPPING →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <ConfirmationInner />
    </Suspense>
  );
}
