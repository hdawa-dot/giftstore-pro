import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Order from '@/models/Order';
import { sendEmail } from '@/lib/notify';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    const order = await Order.findById(params.id).lean();
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ success: true, data: order });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    await dbConnect();
    const body = await req.json();
    const order = await Order.findByIdAndUpdate(params.id, body, { new: true });
    if (!order) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    // If code just assigned and order completed, email the customer
    if (body.deliveryCode && body.orderStatus === 'completed') {
      await sendEmail(
        order.customerEmail,
        `🎉 كودك جاهز! طلب #${order.orderNumber}`,
        `<div dir="rtl" style="font-family:Arial;background:#0a0a0a;color:#fff;padding:24px;border-radius:12px;">
          <h2 style="color:#f59e0b;">🎉 كودك جاهز!</h2>
          <p>مرحباً ${order.customerName}، تم تأكيد دفعك.</p>
          <p style="font-size:24px;font-family:monospace;background:#1a1a1a;padding:16px;border-radius:8px;text-align:center;color:#fbbf24;">${body.deliveryCode}</p>
          <p style="color:#888;">طلب رقم: ${order.orderNumber}</p>
        </div>`,
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
