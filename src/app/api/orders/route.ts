import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Order from '@/models/Order';
import Product from '@/models/Product';
import { Coupon } from '@/models/Admin';
import { generateOrderNumber } from '@/lib/utils';
import { sendOrderConfirmationEmail, notifyNewOrder } from '@/lib/notify';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');

    const query: Record<string, unknown> = {};
    if (status && status !== 'all') query.orderStatus = status;

    const [orders, total] = await Promise.all([
      Order.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(query),
    ]);

    return NextResponse.json({ success: true, data: orders, total, page, totalPages: Math.ceil(total / limit) });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();
    const { productId, denominationValue, customerName, customerEmail, customerPhone, paymentMethod, couponCode } = body;

    // Validate product + denomination
    const product = await Product.findById(productId);
    if (!product || !product.isActive)
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    const denom = product.denominations.find(d => d.value === denominationValue && d.inStock);
    if (!denom)
      return NextResponse.json({ error: 'Denomination not available' }, { status: 400 });

    // Handle coupon
    let discountAmount = 0;
    let validCoupon = null;
    if (couponCode) {
      validCoupon = await Coupon.findOne({
        code: couponCode.toUpperCase(),
        isActive: true,
        expiresAt: { $gt: new Date() },
        $expr: { $lt: ['$usedCount', '$maxUses'] },
      });
      if (validCoupon) {
        if (validCoupon.discountType === 'percentage') {
          discountAmount = (denom.priceEGP * validCoupon.discountValue) / 100;
        } else {
          discountAmount = validCoupon.discountValue;
        }
        discountAmount = Math.min(discountAmount, denom.priceEGP);
      }
    }

    const totalPriceEGP = Math.max(0, denom.priceEGP - discountAmount);
    const orderNumber = generateOrderNumber();

    // Auto-assign code if available
    let deliveryCode: string | undefined;
    if (denom.codes && denom.codes.length > 0) {
      deliveryCode = denom.codes[0];
      await Product.updateOne(
        { _id: productId, 'denominations.value': denominationValue },
        { $pop: { 'denominations.$.codes': -1 } },
      );
    }

    const order = await Order.create({
      orderNumber,
      customerName,
      customerEmail,
      customerPhone,
      productId: product._id,
      productName: product.name,
      productNameAr: product.nameAr,
      denominationValue,
      denominationCurrency: denom.currency,
      totalPriceEGP,
      paymentMethod,
      couponCode: validCoupon?.code,
      discountAmount,
      deliveryCode,
      orderStatus: deliveryCode ? 'completed' : 'pending',
      paymentStatus: 'pending',
      ipAddress: req.headers.get('x-forwarded-for') || '',
    });

    if (validCoupon) {
      await Coupon.findByIdAndUpdate(validCoupon._id, { $inc: { usedCount: 1 } });
    }

    // Notifications
    await Promise.all([
      sendOrderConfirmationEmail(customerEmail, orderNumber, product.name, totalPriceEGP, deliveryCode),
      notifyNewOrder(orderNumber, product.name, totalPriceEGP, paymentMethod),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        orderNumber: order.orderNumber,
        totalPriceEGP: order.totalPriceEGP,
        paymentMethod: order.paymentMethod,
        orderStatus: order.orderStatus,
        deliveryCode: order.deliveryCode,
      },
    }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
