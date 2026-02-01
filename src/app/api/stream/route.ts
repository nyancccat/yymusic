import type { NextRequest } from 'next/server';

function isPrivateHost(hostname: string): boolean {
  if (hostname === 'localhost' || hostname.endsWith('.local')) return true;
  if (hostname.includes(':')) return true;

  const parts = hostname.split('.').map((part) => Number.parseInt(part, 10));
  if (parts.length !== 4 || parts.some((part) => Number.isNaN(part))) return false;

  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 127) return true;
  if (a === 169 && b === 254) return true;
  if (a === 192 && b === 168) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  return false;
}

export async function GET(request: NextRequest) {
  const target = request.nextUrl.searchParams.get('url');
  if (!target) {
    return new Response('Missing url', { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(target);
  } catch {
    return new Response('Invalid url', { status: 400 });
  }

  if (!['http:', 'https:'].includes(parsed.protocol) || isPrivateHost(parsed.hostname)) {
    return new Response('Blocked url', { status: 400 });
  }

  const headers: HeadersInit = {};
  const range = request.headers.get('range');
  if (range) {
    headers.Range = range;
  }

  const response = await fetch(parsed.toString(), { headers });
  const resHeaders = new Headers(response.headers);
  resHeaders.set('Access-Control-Allow-Origin', '*');

  return new Response(response.body, {
    status: response.status,
    headers: resHeaders,
  });
}
