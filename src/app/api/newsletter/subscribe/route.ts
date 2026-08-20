import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ success: false, error: 'Email is required.' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Please enter a valid email address.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Subscribed successfully! Welcome to SolterraGreen.' }, { status: 201 });
  } catch {
    return NextResponse.json({ success: false, error: 'Subscription failed' }, { status: 500 });
  }
}
