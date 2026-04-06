import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: 'Qadr Studio — Wear Less. Say More.',
  description: 'Premium minimalist streetwear. Designed for the ones who say it without saying it. Shop the SS26 collection.',
  keywords: ['streetwear', 'oversized tee', 'minimalist fashion', 'India streetwear', 'Qadr Studio'],
  openGraph: {
    title: 'Qadr Studio — Wear Less. Say More.',
    description: 'Premium minimalist streetwear from India.',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="data-theme" defaultTheme="dark">
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
