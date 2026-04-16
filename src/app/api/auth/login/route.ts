import { NextRequest, NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import { signToken } from '@/lib/auth';
import { Admin } from '@/models/Admin';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    let admin = await Admin.findOne({ email: email.toLowerCase() });

    // Seed first admin if none exist
    if (!admin) {
      const adminCount = await Admin.countDocuments();
      if (adminCount === 0) {
        const seedEmail = process.env.ADMIN_EMAIL || 'admin@giftstore.com';
        const seedPass  = process.env.ADMIN_PASSWORD || 'Admin@123456';
        if (email.toLowerCase() === seedEmail && password === seedPass) {
          admin = await Admin.create({
            email: seedEmail,
            password: seedPass,
            name: 'Super Admin',
            role: 'superadmin',
          });
        }
      }
    }

    if (!admin) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    const token = signToken({ id: admin._id.toString(), email: admin.email, role: 'admin' });

    const response = NextResponse.json({
      success: true,
      token,
      admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
    });

    response.cookies.set('admin_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
