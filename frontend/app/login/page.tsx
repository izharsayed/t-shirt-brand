'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, register } from '@/lib/api';
import { FadeUp, FadeIn } from '@/components/Motion';
import styles from './page.module.css';

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      if (mode === 'register') {
        if (!name.trim()) {
          setError('Please enter your name');
          setLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }
        const data = await register(name, email, password);
        localStorage.setItem('qadr_token', data.token);
        localStorage.setItem('qadr_user', JSON.stringify(data.user));
        setSuccess('Account created successfully! Redirecting...');
        window.dispatchEvent(new Event('auth_updated'));
        setTimeout(() => router.push('/'), 1200);
      } else {
        const data = await login(email, password);
        localStorage.setItem('qadr_token', data.token);
        localStorage.setItem('qadr_user', JSON.stringify(data.user));
        window.dispatchEvent(new Event('auth_updated'));
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <FadeUp>
          <div className={styles.header}>
            <h1 className={styles.brand}>QADR STUDIO</h1>
            <p className={styles.subtitle}>
              {mode === 'login' ? 'Welcome back' : 'Join the movement'}
            </p>
          </div>
        </FadeUp>

        <FadeUp delay={0.1}>
          <div className={styles.tabs}>
            <button
              className={`${styles.tab} ${mode === 'login' ? styles.tabActive : ''}`}
              onClick={() => switchMode('login')}
            >
              Sign In
            </button>
            <button
              className={`${styles.tab} ${mode === 'register' ? styles.tabActive : ''}`}
              onClick={() => switchMode('register')}
            >
              Create Account
            </button>
          </div>
        </FadeUp>

        <FadeUp delay={0.2}>
          <div className={styles.card}>
            {error && (
              <div className={styles.error}>
                <span className={styles.errorIcon}>✕</span>
                {error}
              </div>
            )}

            {success && (
              <div className={styles.success}>{success}</div>
            )}

            <form onSubmit={handleSubmit}>
              {mode === 'register' && (
                <div className={styles.inputGroup}>
                  <label className={styles.label} htmlFor="name">Full Name</label>
                  <input
                    id="name"
                    className={styles.input}
                    type="text"
                    placeholder="Your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                  />
                </div>
              )}

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="email">Email Address</label>
                <input
                  id="email"
                  className={styles.input}
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label} htmlFor="password">Password</label>
                <div className={styles.passwordWrapper}>
                  <input
                    id="password"
                    className={styles.input}
                    type={showPassword ? 'text' : 'password'}
                    placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  />
                  <button
                    type="button"
                    className={styles.togglePassword}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className={styles.submitBtn}
                disabled={loading}
              >
                {loading && <span className={styles.spinner} />}
                {loading
                  ? 'Please wait...'
                  : mode === 'login'
                    ? 'SIGN IN →'
                    : 'CREATE ACCOUNT →'
                }
              </button>
            </form>

            <div className={styles.divider}>or</div>

            <p className={styles.footerText}>
              {mode === 'login' ? (
                <>
                  Don&apos;t have an account?{' '}
                  <button className={styles.footerLink} onClick={() => switchMode('register')}>
                    Create one
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{' '}
                  <button className={styles.footerLink} onClick={() => switchMode('login')}>
                    Sign in
                  </button>
                </>
              )}
            </p>
          </div>
        </FadeUp>

        <FadeIn delay={0.5}>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🔒</div>
              <div className={styles.featureText}>Secure</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <div className={styles.featureText}>Fast Checkout</div>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📦</div>
              <div className={styles.featureText}>Order Tracking</div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
