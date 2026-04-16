'use client';
import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/layout/Navbar';
import { useLang } from '@/components/LangProvider';

function SuccessContent() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order') || '';
  const code = searchParams.get('code') || '';

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Animated checkmark */}
        <div className="w-24 h-24 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-gold">
          <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>

        <h1 className="text-3xl font-display font-black text-white mb-2">
          {lang === 'ar' ? '🎉 تم الطلب!' : '🎉 Order Placed!'}
        </h1>
        <p className="text-dark-400 mb-6">
          {lang === 'ar'
            ? 'شكراً لطلبك! تم استلام طلبك وسيتم معالجته قريباً.'
            : 'Thank you! Your order has been received and will be processed shortly.'}
        </p>

        {/* Order number */}
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 mb-4 text-start">
          <div className="flex justify-between items-center text-sm">
            <span className="text-dark-400">{lang === 'ar' ? 'رقم الطلب' : 'Order Number'}</span>
            <span className="text-white font-mono font-bold">{orderNumber}</span>
          </div>
        </div>

        {/* Delivery code (if instant) */}
        {code && (
          <div className="bg-gold-500/10 border border-gold-500/40 rounded-2xl p-5 mb-6">
            <p className="text-gold-400 text-xs uppercase tracking-wider mb-2">
              {lang === 'ar' ? '⚡ كودك جاهز!' : '⚡ Your Code is Ready!'}
            </p>
            <p className="font-mono text-2xl font-black text-white tracking-widest break-all">{code}</p>
            <button
              onClick={() => navigator.clipboard.writeText(code)}
              className="mt-3 text-xs text-gold-400 hover:underline"
            >
              {lang === 'ar' ? '📋 نسخ الكود' : '📋 Copy Code'}
            </button>
          </div>
        )}

        {!code && (
          <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5 mb-6 text-sm text-dark-400">
            <p className="text-yellow-400 font-semibold mb-1">
              {lang === 'ar' ? '⏳ في انتظار تأكيد الدفع' : '⏳ Awaiting Payment Confirmation'}
            </p>
            <p>
              {lang === 'ar'
                ? 'بعد تأكيد دفعك سيتم إرسال الكود على بريدك الإلكتروني فوراً.'
                : 'After payment is confirmed, your code will be sent to your email instantly.'}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <Link
            href={`/track?order=${orderNumber}`}
            className="bg-gold-gradient text-dark-900 font-bold py-3 rounded-2xl hover:shadow-gold transition-all"
          >
            {lang === 'ar' ? '🔍 تتبع طلبك' : '🔍 Track Order'}
          </Link>
          <Link href="/" className="border border-dark-700 text-dark-300 hover:text-white py-3 rounded-2xl transition-colors text-sm">
            {lang === 'ar' ? 'العودة للرئيسية' : 'Back to Home'}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense>
        <SuccessContent />
      </Suspense>
    </>
  );
}
