import type { Metadata, Viewport } from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const grotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-display', display: 'swap' });

export const metadata: Metadata = {
  title: {
    default: 'TIGERFX Academy — From Zero Knowledge to Independent Trading Mastery',
    template: '%s · TIGERFX Academy',
  },
  description:
    'Interactive bilingual trading education: animated lessons, professional chart simulator, practice arena and risk-first training in Bahasa Melayu & English. Learn Forex, gold (XAUUSD) and Smart Money Concepts from zero.',
  keywords: [
    'trading education',
    'forex course',
    'XAUUSD',
    'smart money concepts',
    'price action',
    'chart simulator',
    'Bahasa Melayu',
    'TIGERFX',
  ],
  openGraph: {
    title: 'TIGERFX Academy',
    description: 'From Zero Knowledge to Independent Trading Mastery — interactive bilingual trading education.',
    type: 'website',
    locale: 'en_MY',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#05080F',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${grotesk.variable}`}>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
