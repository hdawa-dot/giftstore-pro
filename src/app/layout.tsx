import type { Metadata } from 'next';
import { Cairo, Sora } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import { LangProvider } from '@/components/LangProvider';
import './globals.css';

const cairo = Cairo({
  subsets: ['arabic', 'latin'],
  variable: '--font-arabic',
  display: 'swap',
});
const sora = Sora({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'GiftStore Pro — اشترِ USDT وبطاقات Gift Card',
  description: 'منصة موثوقة لشراء USDT وبطاقات الهدايا (Binance, Steam, iTunes, Google Play) بأفضل الأسعار وتسليم فوري.',
  keywords: ['USDT', 'Gift Card', 'بطاقات هدايا', 'شراء USDT', 'Binance Gift Card', 'Egypt'],
  openGraph: {
    title: 'GiftStore Pro',
    description: 'Buy USDT & Gift Cards instantly at the best prices',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className={`${cairo.variable} ${sora.variable} font-arabic bg-dark-950 text-white antialiased`}>
        <LangProvider>
          {children}
          <Toaster
            position="top-center"
            toastOptions={{
              style: { background: '#1e1e1e', color: '#fff', border: '1px solid #303030' },
              success: { iconTheme: { primary: '#f59e0b', secondary: '#0a0a0a' } },
            }}
          />
        </LangProvider>
      </body>
    </html>
  );
}
