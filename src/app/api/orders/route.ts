import { NextRequest, NextResponse } from 'next/server';
import { products } from '@/lib/products';
import { randomBytes } from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const { customer, items } = await req.json();

    if (!customer || !customer.name || !customer.email) {
      return NextResponse.json({ success: false, error: 'Customer name and email are required.' }, { status: 400 });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ success: false, error: 'Cart cannot be empty.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customer.email)) {
      return NextResponse.json({ success: false, error: 'Invalid email address.' }, { status: 400 });
    }

    const orderId = 'SG-' + randomBytes(4).toString('hex').toUpperCase();
    const lineItems = items
      .map((item: { id: string; qty: number }) => {
        const product = products.find((p) => p.id === item.id);
        if (!product) return null;
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          qty: Math.max(1, parseInt(String(item.qty)) || 1),
          ecoScore: product.ecoScore,
        };
      })
      .filter(Boolean);

    if (lineItems.length === 0) {
      return NextResponse.json({ success: false, error: 'No valid products in cart.' }, { status: 400 });
    }

    const subtotal = lineItems.reduce((s: number, i: { price: number; qty: number }) => s + i.price * i.qty, 0);
    const co2Offset = Math.round(subtotal * 0.5);

    const order = {
      orderId,
      customer: { name: customer.name, email: customer.email, address: customer.address || '' },
      items: lineItems,
      subtotal: Math.round(subtotal * 100) / 100,
      shipping: 0,
      total: Math.round(subtotal * 100) / 100,
      co2Offset,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, order }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to create order' }, { status: 500 });
  }
}