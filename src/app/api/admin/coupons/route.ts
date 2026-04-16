import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import { Coupon } from '@/models/Admin';

export async function POST(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const body = await req.json();

    if (!body.code || !body.expiresAt) {
      return NextResponse.json({ error: 'Code and expiry date are required' }, { status: 400 });
    }

    const coupon = await Coupon.create({
      ...body,
      code: body.code.toUpperCase().trim(),
    });

    return NextResponse.json({ success: true, data: coupon }, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error && err.message.includes('duplicate key')) {
      return NextResponse.json({ error: 'هذا الكود موجود بالفعل' }, { status: 409 });
    }
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

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

export async function DELETE(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { id } = await req.json();
    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
