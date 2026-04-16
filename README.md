# 🎁 GiftStore Pro

منصة بيع USDT وبطاقات Gift Card احترافية — مبنية بـ Next.js 14 + Tailwind CSS + MongoDB

![GiftStore Pro](https://placehold.co/1200x400/0a0a0a/f59e0b?text=GiftStore+Pro+%E2%80%94+USDT+%26+Gift+Cards)

---

## ✨ المميزات

- 🌙 Dark Theme احترافي (أسود + ذهبي)
- 🌍 دعم اللغة العربية والإنجليزية (RTL/LTR)
- 📱 Responsive — موبايل + ديسكتوب
- ⚡ Instant Delivery — تسليم فوري عند توفر الأكواد
- 🏷️ نظام كوبونات خصم متكامل
- 📊 لوحة تحكم Admin كاملة
- 🔔 إشعارات Telegram + Email
- 🔒 JWT Auth للأدمن
- 💱 سعر USDT من Binance P2P مباشرة
- ⚡ Skeleton Loading + Toast Notifications
- 🔍 SEO جاهز

---

## 🛠️ التقنيات

| التقنية | الاستخدام |
|---------|-----------|
| Next.js 14 | Framework |
| Tailwind CSS | Styling |
| MongoDB + Mongoose | Database |
| JWT | Authentication |
| React Hook Form + Zod | Forms & Validation |
| Framer Motion | Animations |
| React Hot Toast | Notifications |
| Nodemailer | Email |
| Telegram Bot API | Push Notifications |

---

## 🚀 تشغيل المشروع محلياً

### 1. المتطلبات
- Node.js >= 18
- MongoDB (محلي أو Atlas)

### 2. تثبيت المشروع

```bash
git clone https://github.com/YOUR_USERNAME/giftstore-pro
cd giftstore-pro
npm install
```

### 3. إعداد المتغيرات البيئية

```bash
cp .env.example .env.local
```

ثم عدّل `.env.local`:

```env
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/giftstore
JWT_SECRET=your-super-secret-key-min-32-chars
ADMIN_EMAIL=admin@giftstore.com
ADMIN_PASSWORD=Admin@123456
NEXT_PUBLIC_APP_URL=http://localhost:3000

# اختياري - إشعارات تيليجرام
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# اختياري - إيميل
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@gmail.com
SMTP_PASS=your-app-password
```

### 4. تشغيل التطوير

```bash
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000)

---

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── page.tsx                 # الصفحة الرئيسية
│   ├── products/[id]/page.tsx   # صفحة المنتج
│   ├── checkout/page.tsx        # صفحة الدفع
│   ├── order-success/page.tsx   # صفحة نجاح الطلب
│   ├── track/page.tsx           # تتبع الطلب
│   ├── admin/
│   │   ├── page.tsx             # لوحة التحكم
│   │   └── login/page.tsx       # تسجيل دخول الأدمن
│   └── api/
│       ├── products/            # API المنتجات
│       ├── orders/              # API الطلبات
│       ├── auth/                # API المصادقة
│       ├── price/usdt/          # سعر USDT
│       ├── coupons/             # الكوبونات
│       └── admin/               # إحصائيات + كوبونات
├── components/
│   ├── layout/                  # Navbar + Footer
│   ├── home/                    # Hero + Products
│   ├── checkout/                # CheckoutForm
│   ├── ui/                      # Skeleton, Button, Badge, StarRating
│   └── LangProvider.tsx         # Language Context
├── models/                      # MongoDB Models
├── lib/                         # DB, Auth, Utils, Notify
├── i18n/                        # ترجمات عربي/إنجليزي
└── types/                       # TypeScript Types
```

---

## 🔐 لوحة التحكم

الرابط: `/admin`

**بيانات الدخول الافتراضية:**
- Email: `admin@giftstore.com`
- Password: `Admin@123456`

> ⚠️ غيّر كلمة المرور فور النشر!

**المميزات:**
- 📊 إحصائيات (طلبات، إيرادات، منتجات)
- 📦 إدارة الطلبات (تغيير الحالة، إرسال الأكواد)
- 🎁 إضافة/تعديل/حذف المنتجات مع الأسعار
- 🏷️ إنشاء كوبونات خصم

---

## 💳 طرق الدفع المدعومة

| الطريقة | التفعيل |
|---------|---------|
| فودافون كاش | تعديل رقم الهاتف في `CheckoutForm.tsx` |
| تحويل بنكي | تعديل بيانات الحساب في `CheckoutForm.tsx` |
| Crypto USDT | تعديل عنوان المحفظة في `CheckoutForm.tsx` |

---

## 🌐 النشر على Vercel

```bash
# ثبّت Vercel CLI
npm i -g vercel

# انشر
vercel --prod
```

أضف المتغيرات البيئية في Vercel Dashboard > Settings > Environment Variables.

---

## 🔧 التخصيص السريع

### تغيير الأسعار
المنتجات التجريبية موجودة في `src/app/page.tsx` (DEMO_PRODUCTS).  
للأسعار الحقيقية، أضف المنتجات من لوحة التحكم وسيتم جلبها تلقائياً.

### إضافة طريقة دفع
في `src/components/checkout/CheckoutForm.tsx`، أضف عنصر جديد في `PAYMENT_METHODS`.

### تغيير اللغة الافتراضية
في `src/components/LangProvider.tsx`، غيّر `useState<Language>('ar')` إلى `'en'`.

### إضافة ترجمات
في `src/i18n/ar.ts` و `src/i18n/en.ts`.

---

## 📞 الدعم

- Telegram: @GiftStorePro
- Email: support@giftstore.pro

---

## 📄 الترخيص

MIT License — استخدم حر ✅
