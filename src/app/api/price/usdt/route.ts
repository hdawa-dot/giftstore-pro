import { NextResponse } from 'next/server';

export const revalidate = 60; // cache 60 seconds

export async function GET() {
  try {
    // Try Binance P2P price for USDT/EGP
    const res = await fetch(
      'https://p2p.binance.com/bapi/c2c/v2/friendly/c2c/adv/search',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          asset: 'USDT',
          fiat: 'EGP',
          merchantCheck: false,
          page: 1,
          payTypes: [],
          publisherType: null,
          rows: 5,
          tradeType: 'BUY',
        }),
        next: { revalidate: 60 },
      },
    );

    if (res.ok) {
      const data = await res.json();
      const prices: number[] = data?.data
        ?.slice(0, 5)
        .map((item: { adv: { price: string } }) => parseFloat(item.adv.price))
        .filter((p: number) => !isNaN(p));

      if (prices.length > 0) {
        const avg = prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
        return NextResponse.json({ success: true, price: Math.round(avg * 100) / 100, source: 'binance_p2p' });
      }
    }

    // Fallback: static approximate price
    return NextResponse.json({ success: true, price: 48.5, source: 'fallback' });
  } catch {
    return NextResponse.json({ success: true, price: 48.5, source: 'fallback' });
  }
}
