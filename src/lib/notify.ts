import nodemailer from 'nodemailer';

// ── Telegram ──────────────────────────────────────────────────────────────────
export async function sendTelegramNotification(message: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;

  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: 'HTML' }),
    });
  } catch (err) {
    console.error('Telegram notification error:', err);
  }
}

// ── Email ─────────────────────────────────────────────────────────────────────
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: Number(process.env.SMTP_PORT) || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  if (!process.env.SMTP_USER) return;
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'GiftStore Pro <noreply@giftstore.com>',
      to,
      subject,
      html,
    });
  } catch (err) {
    console.error('Email error:', err);
  }
}

export async function sendOrderConfirmationEmail(
  email: string,
  orderNumber: string,
  productName: string,
  totalPrice: number,
  code?: string,
): Promise<void> {
  const subject = `✅ تأكيد طلبك #${orderNumber} - GiftStore Pro`;
  const html = `
    <div dir="rtl" style="font-family: Arial, sans-serif; background:#0a0a0a; color:#fff; padding:24px; border-radius:12px; max-width:600px;">
      <div style="text-align:center; margin-bottom:24px;">
        <h1 style="color:#f59e0b;">🎁 GiftStore Pro</h1>
      </div>
      <h2 style="color:#f59e0b;">تأكيد الطلب #${orderNumber}</h2>
      <p>شكراً لتسوقك معنا!</p>
      <table style="width:100%; border-collapse:collapse; margin:16px 0;">
        <tr><td style="padding:8px; color:#aaa;">المنتج:</td><td style="padding:8px;">${productName}</td></tr>
        <tr><td style="padding:8px; color:#aaa;">المبلغ:</td><td style="padding:8px; color:#f59e0b; font-weight:bold;">${totalPrice} ج.م</td></tr>
        ${code ? `<tr><td style="padding:8px; color:#aaa;">الكود:</td><td style="padding:8px; font-family:monospace; background:#1a1a1a; border-radius:4px;">${code}</td></tr>` : ''}
      </table>
      ${!code ? '<p style="color:#fbbf24;">⏳ سيتم معالجة طلبك وإرسال الكود قريباً</p>' : ''}
      <p style="color:#888; font-size:12px; margin-top:24px;">GiftStore Pro • خدمة العملاء 24/7</p>
    </div>
  `;
  await sendEmail(email, subject, html);
}

export async function notifyNewOrder(orderNumber: string, productName: string, totalPrice: number, paymentMethod: string): Promise<void> {
  const message = `
🛒 <b>طلب جديد!</b>
📦 رقم الطلب: <code>${orderNumber}</code>
🎁 المنتج: ${productName}
💰 المبلغ: ${totalPrice} ج.م
💳 طريقة الدفع: ${paymentMethod}
⏰ الوقت: ${new Date().toLocaleString('ar-EG')}
  `.trim();
  await sendTelegramNotification(message);
}
