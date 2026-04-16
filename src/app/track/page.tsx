'use client';
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { useLang } from '@/components/LangProvider';
import { formatEGP } from '@/lib/utils';

const STATUS_MAP: Record<string, { ar: string; en: string; color: 'gold' | 'green' | 'red' | 'gray' }> = {
  pending:    { ar: 'قيد الانتظار',  en: 'Pending',    color: 'gold'  },
  processing: { ar: 'جارٍ المعالجة', en: 'Processing', color: 'gold'  },
  completed:  { ar: 'مكتمل',         en: 'Completed',  color: 'green' },
  cancelled:  { ar: 'ملغي',          en: 'Cancelled',  color: 'red'   },
  refunded:   { ar: 'مسترجع',        en: 'Refunded',   color: 'gray'  },
};

function TrackContent() {
  const { lang } = useLang();
  const searchParams = useSearchParams();
  const [orderNum, setOrderNum] = useState(searchParams.get('order') || '');
  const [email, setEmail] = useState('');
  const [order, setOrder] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const search = async () => {
    if (!orderNum) return;
    setLoading(true);
    setError('');
    setOrder(null);
    try {
      const res = await fetch(`/api/orders/track?order=${orderNum}&email=${email}`);
      const data = await res.json();
      if (data.success) setOrder(data.data);
      else setError(lang === 'ar' ? 'الطلب غير موجود. تأكد من رقم الطلب والبريد الإلكتروني.' : 'Order not found. Check your order number and email.');
    } catch {
      setError(lang === 'ar' ? 'خطأ في الاتصال' : 'Connection error');
    } finally {
      setLoading(false);
    }
  };

  const status = order ? STATUS_MAP[order.orderStatus as string] || STATUS_MAP.pending : null;

  return (
    <div className="max-w-lg mx-auto">
      {/* Search form */}
      <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
          {lang === 'ar' ? 'ابحث عن طلبك' : 'Find Your Order'}
        </h2>
        <div className="space-y-3">
          <input
            value={orderNum}
            onChange={e => setOrderNum(e.target.value)}
            placeholder={lang === 'ar' ? 'رقم الطلب (مثال: GS-XXXX-XXXX)' : 'Order Number (e.g. GS-XXXX-XXXX)'}
            className="w-full bg-dark-700 border border-dark-600 text-white placeholder-dark-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gold-500"
          />
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            placeholder={lang === 'ar' ? 'بريدك الإلكتروني للتحقق' : 'Your email for verification'}
            className="w-full bg-dark-700 border border-dark-600 text-white placeholder-dark-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gold-500"
          />
          <Button onClick={search} loading={loading} className="w-full">
            {lang === 'ar' ? '🔍 بحث' : '🔍 Search'}
          </Button>
        </div>
        {error && <p className="text-red-400 text-xs mt-3">{error}</p>}
      </div>

      {/* Order result */}
      {order && status && (
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-white font-bold">{lang === 'ar' ? 'تفاصيل الطلب' : 'Order Details'}</h3>
            <Badge variant={status.color}>{lang === 'ar' ? status.ar : status.en}</Badge>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: { ar: 'رقم الطلب', en: 'Order #' }, value: order.orderNumber as string },
              { label: { ar: 'المنتج', en: 'Product' }, value: (lang === 'ar' ? order.productNameAr : order.productName) as string },
              { label: { ar: 'القيمة', en: 'Value' }, value: `$${order.denominationValue} ${order.denominationCurrency}` },
              { label: { ar: 'المبلغ المدفوع', en: 'Amount Paid' }, value: formatEGP(order.totalPriceEGP as number) },
              { label: { ar: 'طريقة الدفع', en: 'Payment' }, value: order.paymentMethod as string },
            ].map(row => (
              <div key={row.label.en} className="flex justify-between">
                <span className="text-dark-400">{lang === 'ar' ? row.label.ar : row.label.en}</span>
                <span className="text-white">{row.value}</span>
              </div>
            ))}
          </div>
          {order.deliveryCode && (
            <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-4 text-center">
              <p className="text-gold-400 text-xs mb-2">{lang === 'ar' ? '🎁 كودك' : '🎁 Your Code'}</p>
              <p className="font-mono text-xl font-black text-white">{order.deliveryCode as string}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function TrackPage() {
  const { lang } = useLang();
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-dark-950 pt-24 pb-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h1 className="text-3xl font-display font-black text-white mb-2">
              {lang === 'ar' ? '🔍 تتبع طلبك' : '🔍 Track Your Order'}
            </h1>
            <p className="text-dark-400 text-sm">
              {lang === 'ar' ? 'أدخل رقم طلبك وبريدك الإلكتروني للبحث' : 'Enter your order number and email to search'}
            </p>
          </div>
          <Suspense>
            <TrackContent />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
