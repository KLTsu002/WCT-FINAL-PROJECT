import { NextResponse } from 'next/server';
import { products } from '@/lib/products';

export async function GET() {
  try {
    const featured = products.filter((p) => p.badge);
    return NextResponse.json({ success: true, count: featured.length, products: featured });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch featured products' }, { status: 500 });
  }
}