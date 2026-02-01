import { NextResponse } from 'next/server';

const TUNEHUB_API_URL = 'https://tunehub.sayqz.com/api';

export async function GET() {
  try {
    const response = await fetch(`${TUNEHUB_API_URL}/status`, {
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Status API error:', error);
    return NextResponse.json({ code: -1, message: 'Internal server error' }, { status: 500 });
  }
}
