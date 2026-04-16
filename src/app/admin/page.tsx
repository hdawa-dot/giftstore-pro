'use client';
import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatEGP } from '@/lib/utils';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Stats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalRevenue: number;
  totalProducts: number;
  recentOrders: Order[];
}
interface Order {
  _id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  productName: string;
  denominationValue: number;
  denominationCurrency: string;
  totalPriceEGP: number;
  paymentMethod: string;
  orderStatus: string;
  paymentStatus: string;
  deliveryCode?: string;
  createdAt: string;
}
interface Product {
  _id: string;
  name: string;
  nameAr: string;
  category: string;
  brand?: string;
  imageUrl: string;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  featured: boolean;
  denominations: { value: number; currency: string; priceEGP: number; originalPriceEGP: number; discount: number; inStock: boolean }[];
}

type Tab = 'dashboard' | 'orders' | 'products' | 'coupons';

const STATUS_COLORS: Record<string, 'gold' | 'green' | 'red' | 'gray'> = {
  pending: 'gold', processing: 'gold', completed: 'green', cancelled: 'red', refunded: 'gray',
};

export default function AdminDashboard() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('dashboard');
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [codeInput, setCodeInput] = useState('');
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orderFilter, setOrderFilter] = useState('all');

  const getToken = () => typeof window !== 'undefined' ? localStorage.getItem('admin_token') || '' : '';

  const authHeaders = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` });

  const authFetch = useCallback(async (url: string, opts?: RequestInit) => {
    const res = await fetch(url, { ...opts, headers: { ...authHeaders(), ...(opts?.headers || {}) } });
    if (res.status === 401) { router.push('/admin/login'); throw new Error('Unauthorized'); }
    return res;
  }, [router]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Load data ─────────────────────────────────────────────────────────────
  const loadStats = useCallback(async () => {
    try {
      const res = await authFetch('/api/admin/stats');
      const d = await res.json();
      if (d.success) setStats(d.data);
    } catch {}
  }, [authFetch]);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch(`/api/orders?status=${orderFilter}&limit=50`);
      const d = await res.json();
      if (d.success) setOrders(d.data);
    } catch {} finally { setLoading(false); }
  }, [authFetch, orderFilter]);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await authFetch('/api/products?limit=100');
      const d = await res.json();
      if (d.success) setProducts(d.data);
    } catch {} finally { setLoading(false); }
  }, [authFetch]);

  useEffect(() => {
    if (!getToken()) { router.push('/admin/login'); return; }
    loadStats();
  }, [loadStats, router]);

  useEffect(() => {
    if (tab === 'orders') loadOrders();
    if (tab === 'products') loadProducts();
  }, [tab, loadOrders, loadProducts]);

  // ── Actions ───────────────────────────────────────────────────────────────
  const updateOrderStatus = async (orderId: string, updates: Record<string, string>) => {
    try {
      const res = await authFetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
      });
      const d = await res.json();
      if (d.success) {
        toast.success('تم التحديث!');
        loadOrders();
        setSelectedOrder(null);
        setCodeInput('');
      }
    } catch { toast.error('خطأ!'); }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('حذف المنتج نهائياً؟')) return;
    try {
      await authFetch(`/api/products/${id}`, { method: 'DELETE' });
      toast.success('تم الحذف');
      loadProducts();
    } catch {}
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  // ── Sidebar tabs ──────────────────────────────────────────────────────────
  const TABS: { id: Tab; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'الرئيسية', icon: '📊' },
    { id: 'orders',    label: 'الطلبات',   icon: '📦' },
    { id: 'products',  label: 'المنتجات',  icon: '🎁' },
    { id: 'coupons',   label: 'الكوبونات', icon: '🏷️' },
  ];

  // ── Product form modal ────────────────────────────────────────────────────
  const ProductModal = () => {
    const [form, setForm] = useState(
      editingProduct || {
        name: '', nameAr: '', description: '', descriptionAr: '',
        category: 'giftcard', brand: '', imageUrl: '', isActive: true, featured: false,
        denominations: [{ value: 10, currency: 'USD', priceEGP: 500, originalPriceEGP: 550, discount: 9, inStock: true }],
      }
    );
    const [saving, setSaving] = useState(false);

    const save = async () => {
      setSaving(true);
      try {
        const url = editingProduct ? `/api/products/${editingProduct._id}` : '/api/products';
        const method = editingProduct ? 'PUT' : 'POST';
        const res = await authFetch(url, { method, body: JSON.stringify(form) });
        const d = await res.json();
        if (d.success) { toast.success('تم الحفظ!'); setShowProductForm(false); setEditingProduct(null); loadProducts(); }
        else toast.error('خطأ في الحفظ');
      } finally { setSaving(false); }
    };

    const addDenom = () => setForm(f => ({
      ...f,
      denominations: [...(f.denominations || []), { value: 25, currency: 'USD', priceEGP: 1250, originalPriceEGP: 1375, discount: 9, inStock: true }],
    }));

    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 w-full max-w-2xl my-4">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-white font-bold text-lg">{editingProduct ? 'تعديل المنتج' : 'إضافة منتج'}</h3>
            <button onClick={() => { setShowProductForm(false); setEditingProduct(null); }} className="text-dark-400 hover:text-white text-xl">✕</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { key: 'name', label: 'الاسم بالإنجليزية', type: 'text' },
              { key: 'nameAr', label: 'الاسم بالعربية', type: 'text' },
              { key: 'brand', label: 'الماركة', type: 'text' },
              { key: 'imageUrl', label: 'رابط الصورة', type: 'url' },
            ].map(f => (
              <div key={f.key}>
                <label className="block text-dark-400 text-xs mb-1">{f.label}</label>
                <input
                  type={f.type}
                  value={(form as Record<string, unknown>)[f.key] as string || ''}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="w-full bg-dark-700 border border-dark-600 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-gold-500"
                />
              </div>
            ))}
            <div>
              <label className="block text-dark-400 text-xs mb-1">الفئة</label>
              <select
                value={(form as Record<string, unknown>).category as string}
                onChange={e => setForm(prev => ({ ...prev, category: e.target.value }))}
                className="w-full bg-dark-700 border border-dark-600 text-white text-sm px-3 py-2 rounded-lg focus:outline-none"
              >
                <option value="giftcard">Gift Card</option>
                <option value="usdt">USDT</option>
              </select>
            </div>
            <div className="flex gap-4 items-end pb-1">
              <label className="flex items-center gap-2 text-dark-300 text-sm cursor-pointer">
                <input type="checkbox" checked={(form as Record<string, unknown>).isActive as boolean} onChange={e => setForm(p => ({ ...p, isActive: e.target.checked }))} className="accent-yellow-400" />
                مفعّل
              </label>
              <label className="flex items-center gap-2 text-dark-300 text-sm cursor-pointer">
                <input type="checkbox" checked={(form as Record<string, unknown>).featured as boolean} onChange={e => setForm(p => ({ ...p, featured: e.target.checked }))} className="accent-yellow-400" />
                مميز
              </label>
            </div>
          </div>
          {/* Denominations */}
          <div className="mt-5">
            <div className="flex justify-between items-center mb-2">
              <label className="text-dark-400 text-xs uppercase tracking-wider">الأسعار والقيم</label>
              <button onClick={addDenom} className="text-gold-400 text-xs hover:underline">+ إضافة</button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {((form as Record<string, unknown>).denominations as Product['denominations'] || []).map((d, i) => (
                <div key={i} className="flex gap-2 items-center bg-dark-900 rounded-lg p-2">
                  <input type="number" value={d.value} onChange={e => {
                    const dens = [...((form as Record<string, unknown>).denominations as Product['denominations'])];
                    dens[i] = { ...dens[i], value: +e.target.value };
                    setForm(p => ({ ...p, denominations: dens }));
                  }} className="w-16 bg-dark-700 border border-dark-600 text-white text-xs px-2 py-1.5 rounded" placeholder="Value" />
                  <input type="number" value={d.priceEGP} onChange={e => {
                    const dens = [...((form as Record<string, unknown>).denominations as Product['denominations'])];
                    dens[i] = { ...dens[i], priceEGP: +e.target.value };
                    setForm(p => ({ ...p, denominations: dens }));
                  }} className="flex-1 bg-dark-700 border border-dark-600 text-white text-xs px-2 py-1.5 rounded" placeholder="Price EGP" />
                  <input type="number" value={d.discount} onChange={e => {
                    const dens = [...((form as Record<string, unknown>).denominations as Product['denominations'])];
                    dens[i] = { ...dens[i], discount: +e.target.value };
                    setForm(p => ({ ...p, denominations: dens }));
                  }} className="w-16 bg-dark-700 border border-dark-600 text-white text-xs px-2 py-1.5 rounded" placeholder="Disc%" />
                  <label className="flex items-center gap-1 text-dark-400 text-xs cursor-pointer">
                    <input type="checkbox" checked={d.inStock} onChange={e => {
                      const dens = [...((form as Record<string, unknown>).denominations as Product['denominations'])];
                      dens[i] = { ...dens[i], inStock: e.target.checked };
                      setForm(p => ({ ...p, denominations: dens }));
                    }} className="accent-green-500" />
                    متوفر
                  </label>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 mt-6">
            <Button onClick={save} loading={saving} className="flex-1">حفظ</Button>
            <Button variant="outline" onClick={() => { setShowProductForm(false); setEditingProduct(null); }}>إلغاء</Button>
          </div>
        </div>
      </div>
    );
  };

  // ── Order detail modal ────────────────────────────────────────────────────
  const OrderModal = () => {
    if (!selectedOrder) return null;
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-5">
            <h3 className="text-white font-bold">طلب #{selectedOrder.orderNumber}</h3>
            <button onClick={() => setSelectedOrder(null)} className="text-dark-400 hover:text-white">✕</button>
          </div>
          <div className="space-y-2 text-sm mb-4">
            {[
              ['العميل', selectedOrder.customerName],
              ['الإيميل', selectedOrder.customerEmail],
              ['المنتج', selectedOrder.productName],
              ['القيمة', `$${selectedOrder.denominationValue} ${selectedOrder.denominationCurrency}`],
              ['المبلغ', formatEGP(selectedOrder.totalPriceEGP)],
              ['الدفع', selectedOrder.paymentMethod],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-dark-400">{k}</span>
                <span className="text-white">{v}</span>
              </div>
            ))}
          </div>

          {/* Assign code */}
          {!selectedOrder.deliveryCode && (
            <div className="mb-4">
              <label className="block text-dark-400 text-xs mb-1.5">إرسال الكود للعميل</label>
              <div className="flex gap-2">
                <input
                  value={codeInput}
                  onChange={e => setCodeInput(e.target.value)}
                  placeholder="أدخل الكود"
                  className="flex-1 bg-dark-700 border border-dark-600 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-gold-500"
                />
                <Button
                  size="sm"
                  onClick={() => updateOrderStatus(selectedOrder._id, { deliveryCode: codeInput, orderStatus: 'completed', paymentStatus: 'paid' })}
                  disabled={!codeInput}
                >
                  إرسال
                </Button>
              </div>
            </div>
          )}

          {selectedOrder.deliveryCode && (
            <div className="bg-gold-500/10 border border-gold-500/30 rounded-xl p-3 mb-4 text-center">
              <p className="text-gold-400 text-xs mb-1">الكود المُرسل</p>
              <p className="font-mono text-white font-bold">{selectedOrder.deliveryCode}</p>
            </div>
          )}

          {/* Status controls */}
          <div className="flex flex-wrap gap-2">
            {['pending', 'processing', 'completed', 'cancelled'].map(s => (
              <button
                key={s}
                onClick={() => updateOrderStatus(selectedOrder._id, { orderStatus: s })}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                  selectedOrder.orderStatus === s ? 'bg-gold-500 border-gold-500 text-dark-900 font-bold' : 'border-dark-600 text-dark-400 hover:border-dark-500'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-dark-950 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-56 bg-dark-900 border-l border-dark-800 flex flex-col">
        <div className="p-5 border-b border-dark-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center">
              <span className="text-dark-900 font-bold text-sm">G</span>
            </div>
            <span className="font-display font-bold text-white text-sm">GiftStore Admin</span>
          </div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all ${
                tab === t.id ? 'bg-gold-500/15 text-gold-400 font-semibold' : 'text-dark-400 hover:text-white hover:bg-dark-800'
              }`}
            >
              <span>{t.icon}</span>
              <span>{t.label}</span>
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-dark-800">
          <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-dark-500 hover:text-red-400 text-sm transition-colors">
            <span>🚪</span><span>تسجيل خروج</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* ── Dashboard ── */}
        {tab === 'dashboard' && (
          <div>
            <h1 className="text-2xl font-display font-black text-white mb-6">لوحة التحكم</h1>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                { label: 'إجمالي الطلبات', value: stats?.totalOrders ?? '—', icon: '📦', color: 'text-blue-400' },
                { label: 'طلبات معلقة',    value: stats?.pendingOrders ?? '—', icon: '⏳', color: 'text-gold-400' },
                { label: 'طلبات مكتملة',   value: stats?.completedOrders ?? '—', icon: '✅', color: 'text-green-400' },
                { label: 'الإيرادات',      value: stats ? formatEGP(stats.totalRevenue) : '—', icon: '💰', color: 'text-gold-400' },
              ].map(card => (
                <div key={card.label} className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
                  <div className="text-2xl mb-2">{card.icon}</div>
                  <div className={`text-2xl font-display font-black ${card.color}`}>{card.value}</div>
                  <div className="text-dark-400 text-xs mt-1">{card.label}</div>
                </div>
              ))}
            </div>
            {/* Recent orders */}
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-5">
              <h2 className="text-white font-bold mb-4 text-sm">آخر الطلبات</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-dark-500 text-xs border-b border-dark-700">
                      <th className="text-start pb-2">رقم الطلب</th>
                      <th className="text-start pb-2">العميل</th>
                      <th className="text-start pb-2">المنتج</th>
                      <th className="text-start pb-2">المبلغ</th>
                      <th className="text-start pb-2">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-1">
                    {(stats?.recentOrders || []).map(order => (
                      <tr key={order._id} className="border-b border-dark-800/50 hover:bg-dark-700/30 transition-colors">
                        <td className="py-2 font-mono text-xs text-gold-400">{order.orderNumber}</td>
                        <td className="py-2 text-white">{order.customerName}</td>
                        <td className="py-2 text-dark-300 truncate max-w-[120px]">{order.productName}</td>
                        <td className="py-2 text-gold-400">{formatEGP(order.totalPriceEGP)}</td>
                        <td className="py-2">
                          <Badge variant={STATUS_COLORS[order.orderStatus] || 'gray'}>{order.orderStatus}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Orders ── */}
        {tab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-display font-black text-white">إدارة الطلبات</h1>
              <div className="flex gap-2">
                {['all', 'pending', 'completed', 'cancelled'].map(f => (
                  <button key={f} onClick={() => setOrderFilter(f)} className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${orderFilter === f ? 'bg-gold-500 border-gold-500 text-dark-900 font-bold' : 'border-dark-700 text-dark-400 hover:border-dark-600'}`}>
                    {f === 'all' ? 'الكل' : f}
                  </button>
                ))}
              </div>
            </div>
            <div className="bg-dark-800 border border-dark-700 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-dark-900 border-b border-dark-700">
                    <tr className="text-dark-500 text-xs">
                      {['رقم الطلب', 'العميل', 'المنتج', 'المبلغ', 'الدفع', 'الحالة', 'إجراء'].map(h => (
                        <th key={h} className="text-start px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr><td colSpan={7} className="text-center py-10 text-dark-500">جارٍ التحميل...</td></tr>
                    ) : orders.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-10 text-dark-500">لا توجد طلبات</td></tr>
                    ) : orders.map(order => (
                      <tr key={order._id} className="border-b border-dark-800/50 hover:bg-dark-700/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-gold-400">{order.orderNumber}</td>
                        <td className="px-4 py-3 text-white">{order.customerName}</td>
                        <td className="px-4 py-3 text-dark-300 max-w-[140px] truncate">{order.productName}</td>
                        <td className="px-4 py-3 text-gold-400 font-semibold">{formatEGP(order.totalPriceEGP)}</td>
                        <td className="px-4 py-3 text-dark-300 text-xs">{order.paymentMethod}</td>
                        <td className="px-4 py-3">
                          <Badge variant={STATUS_COLORS[order.orderStatus] || 'gray'}>{order.orderStatus}</Badge>
                        </td>
                        <td className="px-4 py-3">
                          <button onClick={() => { setSelectedOrder(order); setCodeInput(''); }} className="text-xs text-gold-400 hover:underline">
                            تفاصيل
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Products ── */}
        {tab === 'products' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-display font-black text-white">إدارة المنتجات</h1>
              <Button onClick={() => { setEditingProduct(null); setShowProductForm(true); }}>+ إضافة منتج</Button>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loading ? (
                <p className="text-dark-500 col-span-3">جارٍ التحميل...</p>
              ) : products.length === 0 ? (
                <div className="col-span-3 text-center py-16 text-dark-500">
                  <div className="text-4xl mb-3">📦</div>
                  <p>لا توجد منتجات. أضف منتجاً الآن!</p>
                </div>
              ) : products.map(p => (
                <div key={p._id} className="bg-dark-800 border border-dark-700 rounded-2xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold text-sm">{p.nameAr}</h3>
                      <p className="text-dark-500 text-xs">{p.name}</p>
                    </div>
                    <div className="flex gap-1.5">
                      {p.featured && <span className="text-gold-400 text-xs">⭐</span>}
                      <Badge variant={p.isActive ? 'green' : 'red'}>{p.isActive ? 'مفعّل' : 'معطّل'}</Badge>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {p.denominations.slice(0, 4).map((d, i) => (
                      <span key={i} className={`text-xs px-2 py-0.5 rounded-full border ${d.inStock ? 'border-dark-600 text-dark-300' : 'border-dark-800 text-dark-600 line-through'}`}>
                        ${d.value}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-2 border-t border-dark-700">
                    <button onClick={() => { setEditingProduct(p); setShowProductForm(true); }} className="flex-1 text-xs text-gold-400 hover:underline">تعديل</button>
                    <button onClick={() => deleteProduct(p._id)} className="flex-1 text-xs text-red-400 hover:underline">حذف</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Coupons ── */}
        {tab === 'coupons' && (
          <div>
            <h1 className="text-2xl font-display font-black text-white mb-6">إدارة الكوبونات</h1>
            <div className="bg-dark-800 border border-dark-700 rounded-2xl p-6 max-w-lg">
              <h3 className="text-white font-semibold mb-4">إضافة كوبون جديد</h3>
              <CouponForm authFetch={authFetch} />
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedOrder && <OrderModal />}
      {showProductForm && <ProductModal />}
    </div>
  );
}

// ── Coupon Form ───────────────────────────────────────────────────────────────
function CouponForm({ authFetch }: { authFetch: (url: string, opts?: RequestInit) => Promise<Response> }) {
  const [form, setForm] = useState({
    code: '', discountType: 'percentage', discountValue: 10,
    minOrderAmount: 0, maxUses: 100, expiresAt: '',
  });
  const [saving, setSaving] = useState(false);

  const save = async () => {
    setSaving(true);
    try {
      const res = await authFetch('/api/admin/coupons', {
        method: 'POST',
        body: JSON.stringify(form),
      });
      const d = await res.json();
      if (d.success) { toast.success('تم إنشاء الكوبون!'); setForm({ code: '', discountType: 'percentage', discountValue: 10, minOrderAmount: 0, maxUses: 100, expiresAt: '' }); }
      else toast.error(d.error || 'خطأ');
    } finally { setSaving(false); }
  };

  return (
    <div className="space-y-3">
      {[
        { key: 'code', label: 'كود الخصم', type: 'text', placeholder: 'SAVE20' },
        { key: 'discountValue', label: 'قيمة الخصم', type: 'number', placeholder: '10' },
        { key: 'minOrderAmount', label: 'الحد الأدنى للطلب', type: 'number', placeholder: '0' },
        { key: 'maxUses', label: 'عدد الاستخدامات', type: 'number', placeholder: '100' },
        { key: 'expiresAt', label: 'تاريخ الانتهاء', type: 'date', placeholder: '' },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-dark-400 text-xs mb-1">{f.label}</label>
          <input
            type={f.type}
            value={(form as Record<string, unknown>)[f.key] as string}
            placeholder={f.placeholder}
            onChange={e => setForm(p => ({ ...p, [f.key]: f.type === 'number' ? +e.target.value : e.target.value }))}
            className="w-full bg-dark-700 border border-dark-600 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:border-gold-500 uppercase"
          />
        </div>
      ))}
      <div>
        <label className="block text-dark-400 text-xs mb-1">نوع الخصم</label>
        <select
          value={form.discountType}
          onChange={e => setForm(p => ({ ...p, discountType: e.target.value }))}
          className="w-full bg-dark-700 border border-dark-600 text-white text-sm px-3 py-2 rounded-lg"
        >
          <option value="percentage">نسبة مئوية (%)</option>
          <option value="fixed">مبلغ ثابت (ج.م)</option>
        </select>
      </div>
      <Button onClick={save} loading={saving} className="w-full">إنشاء الكوبون</Button>
    </div>
  );
}


