'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
// zodResolver loaded at runtime — install @hookform/resolvers alongside react-hook-form
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { zodResolver } = require('@hookform/resolvers/zod');
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useLang } from '../LangProvider';
import { Button } from '../ui/Button';
import { formatEGP } from '@/lib/utils';

const schema = z.object({
  customerName:  z.string().min(2, 'الاسم مطلوب'),
  customerEmail: z.string().email('بريد إلكتروني غير صالح'),
  customerPhone: z.string().min(10, 'رقم الهاتف غير صالح'),
  paymentMethod: z.enum(['vodafone_cash', 'bank_transfer', 'crypto']),
  couponCode: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface CheckoutFormProps {
  productId: string;
  productName: string;
  denominationValue: number;
  priceEGP: number;
}

const PAYMENT_METHODS = [
  { value: 'vodafone_cash', icon: '📱', en: 'Vodafone Cash', ar: 'فودافون كاش',
    details: { ar: 'أرسل المبلغ على: 01XXXXXXXXX', en: 'Send to: 01XXXXXXXXX' } },
  { value: 'bank_transfer', icon: '🏦', en: 'Bank Transfer', ar: 'تحويل بنكي',
    details: { ar: 'رقم الحساب: XXXX-XXXX-XXXX', en: 'Account: XXXX-XXXX-XXXX' } },
  { value: 'crypto', icon: '₿', en: 'Crypto (USDT)', ar: 'كريبتو (USDT)',
    details: { ar: 'عنوان TRC20: TxxxxXXXXX...', en: 'TRC20 Address: TxxxxXXXXX...' } },
];

export default function CheckoutForm({ productId, productName, denominationValue, priceEGP }: CheckoutFormProps) {
  const { lang, t } = useLang();
  const router = useRouter();
  const [discount, setDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const { register, handleSubmit, watch, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { paymentMethod: 'vodafone_cash' },
  });

  const selectedMethod = watch('paymentMethod');
  const methodInfo = PAYMENT_METHODS.find(m => m.value === selectedMethod);
  const finalPrice = Math.max(0, priceEGP - discount);

  const applyCoupon = async () => {
    const code = getValues('couponCode');
    if (!code) return;
    setCouponLoading(true);
    try {
      const res = await fetch('/api/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount: priceEGP }),
      });
      const data = await res.json();
      if (data.valid) {
        setDiscount(data.discountAmount);
        setCouponMsg(lang === 'ar' ? `✅ خصم ${formatEGP(data.discountAmount)} تم تطبيقه!` : `✅ Discount ${formatEGP(data.discountAmount)} applied!`);
      } else {
        setDiscount(0);
        setCouponMsg(`❌ ${data.error}`);
      }
    } finally {
      setCouponLoading(false);
    }
  };

  const onSubmit = async (data: FormData) => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          productId,
          denominationValue,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(lang === 'ar' ? 'تم إرسال الطلب بنجاح!' : 'Order placed successfully!');
        router.push(`/order-success?order=${result.data.orderNumber}&code=${result.data.deliveryCode || ''}`);
      } else {
        toast.error(result.error || (lang === 'ar' ? 'حدث خطأ' : 'An error occurred'));
      }
    } catch {
      toast.error(lang === 'ar' ? 'خطأ في الاتصال' : 'Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Customer Info */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5 space-y-4">
        <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
          {lang === 'ar' ? 'بياناتك' : 'Your Info'}
        </h3>
        {[
          { name: 'customerName' as const, label: t('checkout.name'), type: 'text', placeholder: lang === 'ar' ? 'أحمد محمد' : 'John Doe' },
          { name: 'customerEmail' as const, label: t('checkout.email'), type: 'email', placeholder: 'example@email.com' },
          { name: 'customerPhone' as const, label: t('checkout.phone'), type: 'tel', placeholder: '01XXXXXXXXX' },
        ].map(field => (
          <div key={field.name}>
            <label className="block text-dark-300 text-xs mb-1.5">{field.label}</label>
            <input
              {...register(field.name)}
              type={field.type}
              placeholder={field.placeholder}
              className="w-full bg-dark-700 border border-dark-600 text-white placeholder-dark-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gold-500 transition-colors"
            />
            {errors[field.name] && (
              <p className="text-red-400 text-xs mt-1">{errors[field.name]?.message}</p>
            )}
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5">
        <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
          {t('checkout.paymentMethod')}
        </h3>
        <div className="space-y-3">
          {PAYMENT_METHODS.map(m => (
            <label key={m.value} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all duration-200 ${
              selectedMethod === m.value
                ? 'border-gold-500 bg-gold-500/5'
                : 'border-dark-700 hover:border-dark-600'
            }`}>
              <input {...register('paymentMethod')} type="radio" value={m.value} className="mt-0.5 accent-yellow-400" />
              <div>
                <div className="flex items-center gap-2">
                  <span>{m.icon}</span>
                  <span className="text-white text-sm font-medium">{lang === 'ar' ? m.ar : m.en}</span>
                </div>
                {selectedMethod === m.value && (
                  <p className="text-dark-400 text-xs mt-1">{lang === 'ar' ? m.details.ar : m.details.en}</p>
                )}
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Coupon */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5">
        <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-3">
          {t('checkout.coupon')}
        </h3>
        <div className="flex gap-2">
          <input
            {...register('couponCode')}
            placeholder={lang === 'ar' ? 'أدخل كود الخصم' : 'Enter coupon code'}
            className="flex-1 bg-dark-700 border border-dark-600 text-white placeholder-dark-500 px-4 py-2.5 rounded-xl text-sm uppercase focus:outline-none focus:border-gold-500 transition-colors"
          />
          <Button type="button" variant="outline" size="sm" loading={couponLoading} onClick={applyCoupon}>
            {t('checkout.apply')}
          </Button>
        </div>
        {couponMsg && <p className="text-xs mt-2 text-dark-300">{couponMsg}</p>}
      </div>

      {/* Order Summary */}
      <div className="bg-dark-800 rounded-2xl border border-dark-700 p-5">
        <h3 className="font-semibold text-white text-sm uppercase tracking-wider mb-4">
          {lang === 'ar' ? 'ملخص الطلب' : 'Order Summary'}
        </h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-dark-300">
            <span>{productName}</span>
            <span>${denominationValue}</span>
          </div>
          <div className="flex justify-between text-dark-300">
            <span>{lang === 'ar' ? 'السعر' : 'Price'}</span>
            <span>{formatEGP(priceEGP)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-400">
              <span>{lang === 'ar' ? 'خصم الكوبون' : 'Coupon Discount'}</span>
              <span>-{formatEGP(discount)}</span>
            </div>
          )}
          <div className="flex justify-between text-white font-bold text-base pt-2 border-t border-dark-700">
            <span>{t('checkout.total')}</span>
            <span className="text-gold-400">{formatEGP(finalPrice)}</span>
          </div>
        </div>
      </div>

      <Button type="submit" size="lg" loading={submitting} className="w-full">
        {t('checkout.submit')} ⚡
      </Button>

      <p className="text-dark-500 text-xs text-center">
        {lang === 'ar'
          ? '🔒 بياناتك محمية ومشفرة. لن نشارك معلوماتك مع أي طرف ثالث.'
          : '🔒 Your data is encrypted and secure. We never share your info.'}
      </p>
    </form>
  );
}
