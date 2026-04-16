'use client';
import Link from 'next/link';
import { useLang } from '../LangProvider';

export default function Hero({ usdtPrice }: { usdtPrice: number }) {
  const { t, lang } = useLang();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-dark-950">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 start-1/4 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 end-1/4 w-64 h-64 bg-gold-600/8 rounded-full blur-3xl" />
        {/* Grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#f59e0b 1px, transparent 1px), linear-gradient(90deg, #f59e0b 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
        {/* Live price ticker */}
        <div className="inline-flex items-center gap-2 bg-dark-800/80 border border-dark-700 rounded-full px-4 py-2 mb-8 text-sm">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-dark-300">
            {lang === 'ar' ? 'سعر USDT الآن:' : 'USDT Live Price:'}
          </span>
          <span className="text-gold-400 font-bold">{usdtPrice} {lang === 'ar' ? 'ج.م' : 'EGP'}</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-display font-black text-white leading-tight mb-6">
          {lang === 'ar' ? (
            <>
              اشترِ <span className="text-transparent bg-clip-text bg-gold-gradient">USDT</span>
              <br />
              وبطاقات{' '}
              <span className="text-transparent bg-clip-text bg-gold-gradient">Gift Card</span>
            </>
          ) : (
            <>
              Buy <span className="text-transparent bg-clip-text bg-gold-gradient">USDT</span>
              <br />& <span className="text-transparent bg-clip-text bg-gold-gradient">Gift Cards</span>
            </>
          )}
        </h1>

        <p className="text-dark-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
          {lang === 'ar'
            ? 'تسليم فوري • أسعار تنافسية • دفع آمن عبر فودافون كاش أو تحويل بنكي'
            : 'Instant Delivery • Competitive Prices • Secure Payment via Vodafone Cash or Bank Transfer'}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/#products"
            className="bg-gold-gradient text-dark-900 font-black text-lg px-8 py-4 rounded-2xl hover:shadow-gold-lg hover:scale-105 transition-all duration-200 animate-pulse-gold"
          >
            {t('hero.cta')} ⚡
          </Link>
          <Link
            href="/track"
            className="border border-dark-600 text-dark-200 font-semibold text-lg px-8 py-4 rounded-2xl hover:border-gold-500/50 hover:text-gold-400 transition-all duration-200"
          >
            {lang === 'ar' ? 'تتبع طلبك' : 'Track Order'}
          </Link>
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-14">
          {[
            { icon: '⚡', en: 'Instant Delivery', ar: 'تسليم فوري' },
            { icon: '🔒', en: 'Secure Payment', ar: 'دفع آمن' },
            { icon: '🎯', en: '99.9% Success Rate', ar: 'نسبة نجاح 99.9%' },
            { icon: '💬', en: '24/7 Support', ar: 'دعم 24/7' },
          ].map(b => (
            <div key={b.en} className="flex items-center gap-2 text-dark-400 text-sm">
              <span>{b.icon}</span>
              <span>{lang === 'ar' ? b.ar : b.en}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-5 text-dark-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </section>
  );
}
