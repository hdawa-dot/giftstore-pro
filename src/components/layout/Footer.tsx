'use client';
import Link from 'next/link';
import { useLang } from '../LangProvider';

export default function Footer() {
  const { t } = useLang();
  return (
    <footer className="bg-dark-950 border-t border-dark-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
                <span className="text-dark-900 font-bold text-sm">G</span>
              </div>
              <span className="font-display font-bold text-lg text-white">
                Gift<span className="text-gold-400">Store</span> Pro
              </span>
            </div>
            <p className="text-dark-400 text-sm leading-relaxed">
              {t('nav.home') === 'الرئيسية'
                ? 'منصتك الموثوقة لشراء USDT وبطاقات الهدايا بأفضل الأسعار وتسليم فوري.'
                : 'Your trusted platform for buying USDT & Gift Cards at the best prices with instant delivery.'}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('nav.products')}</h3>
            <ul className="space-y-2">
              {['USDT', 'Binance Gift Card', 'Steam', 'iTunes', 'Google Play'].map(item => (
                <li key={item}>
                  <Link href={`/#products`} className="text-dark-400 hover:text-gold-400 text-sm transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">{t('nav.contact')}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-dark-400 text-sm">
                <span>📱</span> Telegram: @GiftStorePro
              </li>
              <li className="flex items-center gap-2 text-dark-400 text-sm">
                <span>✉️</span> support@giftstore.pro
              </li>
              <li className="flex items-center gap-2 text-dark-400 text-sm">
                <span>⏰</span> {t('nav.home') === 'الرئيسية' ? 'متاح 24/7' : 'Available 24/7'}
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-dark-500 text-xs">
            © {new Date().getFullYear()} GiftStore Pro. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {['🔒 Secure', '⚡ Instant', '✅ Trusted'].map(badge => (
              <span key={badge} className="text-xs text-dark-500 bg-dark-800 px-2 py-1 rounded-full">
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
