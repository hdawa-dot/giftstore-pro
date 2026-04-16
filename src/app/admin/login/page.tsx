'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('admin_token', data.token);
        toast.success('مرحباً بك!');
        router.push('/admin');
      } else {
        toast.error(data.error || 'بيانات خاطئة');
      }
    } catch {
      toast.error('خطأ في الاتصال');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gold-gradient flex items-center justify-center mx-auto mb-4 shadow-gold-lg">
            <span className="text-dark-900 font-black text-2xl">G</span>
          </div>
          <h1 className="text-2xl font-display font-black text-white">
            Gift<span className="text-gold-400">Store</span> Admin
          </h1>
          <p className="text-dark-400 text-sm mt-1">لوحة التحكم الإدارية</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="bg-dark-800 border border-dark-700 rounded-2xl p-6 space-y-4">
          <div>
            <label className="block text-dark-300 text-xs mb-1.5">البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@giftstore.com"
              className="w-full bg-dark-700 border border-dark-600 text-white placeholder-dark-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gold-500"
            />
          </div>
          <div>
            <label className="block text-dark-300 text-xs mb-1.5">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full bg-dark-700 border border-dark-600 text-white placeholder-dark-500 px-4 py-2.5 rounded-xl text-sm focus:outline-none focus:border-gold-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold-gradient text-dark-900 font-bold py-3 rounded-xl hover:shadow-gold transition-all disabled:opacity-50"
          >
            {loading ? '...' : 'تسجيل الدخول'}
          </button>
        </form>

        <p className="text-center text-dark-600 text-xs mt-6">
          Default: admin@giftstore.com / Admin@123456
        </p>
      </div>
    </div>
  );
}
