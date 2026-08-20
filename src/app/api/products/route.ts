import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/products';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category');
    const sort = searchParams.get('sort');
    const search = searchParams.get('search');

    let list = [...products];

    if (category && category !== 'all') {
      list = list.filter((p) => p.category === category);
    }
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
      );
    }

    switch (sort) {
      case 'price-low':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'eco':
        list.sort((a, b) => (a.ecoScore < b.ecoScore ? -1 : a.ecoScore > b.ecoScore ? 1 : 0));
        break;
      case 'rating':
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort((a, b) => (a.badge ? -1 : 1) - (b.badge ? -1 : 1));
    }

    return NextResponse.json({ success: true, count: list.length, products: list });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to fetch products' }, { status: 500 });
  }
}