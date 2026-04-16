import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { Coupon } from '@/models/Admin';

// POST /api/coupons/validate — public
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { code, orderAmount } = await req.json();
    const coupon = await Coupon.findOne({
      code: code?.toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() },
      $expr: { $lt: ['$usedCount', '$maxUses'] },
    });

    if (!coupon) return NextResponse.json({ valid: false, error: 'كود غير صالح أو منتهي الصلاحية' });
    if (coupon.minOrderAmount > 0 && orderAmount < coupon.minOrderAmount)
      return NextResponse.json({ valid: false, error: `الحد الأدنى للطلب ${coupon.minOrderAmount} ج.م` });

    const discount =
      coupon.discountType === 'percentage'
        ? (orderAmount * coupon.discountValue) / 100
        : coupon.discountValue;

    return NextResponse.json({
      valid: true,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount: Math.min(discount, orderAmount),
    });
  } catch {
    return NextResponse.json({ valid: false, error: 'Server error' }, { status: 500 });
  }
}

// GET /api/coupons — admin
export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: coupons });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST /api/coupons — admin create
// (same route but different logic handled above; for admin create use /api/admin/coupons)
