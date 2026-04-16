import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Order from '@/models/Order';

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get('order');
    const email = searchParams.get('email');

    if (!orderNumber) return NextResponse.json({ error: 'Order number required' }, { status: 400 });

    const query: Record<string, string> = { orderNumber };
    if (email) query.customerEmail = email.toLowerCase();

    const order = await Order.findOne(query)
      .select('orderNumber productName productNameAr denominationValue denominationCurrency totalPriceEGP paymentMethod orderStatus paymentStatus deliveryCode createdAt')
      .lean();

    if (!order) return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });

    return NextResponse.json({ success: true, data: order });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
