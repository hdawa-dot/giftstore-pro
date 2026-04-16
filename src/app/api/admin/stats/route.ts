import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { requireAdmin } from '@/lib/auth';
import Order from '@/models/Order';
import Product from '@/models/Product';

export async function GET(req: NextRequest) {
  const admin = requireAdmin(req);
  if (!admin) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    await dbConnect();

    const [
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue,
      totalProducts,
      recentOrders,
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: 'pending' }),
      Order.countDocuments({ orderStatus: 'completed' }),
      Order.aggregate([
        { $match: { orderStatus: 'completed' } },
        { $group: { _id: null, total: { $sum: '$totalPriceEGP' } } },
      ]),
      Product.countDocuments({ isActive: true }),
      Order.find().sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        completedOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        totalProducts,
        recentOrders,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
