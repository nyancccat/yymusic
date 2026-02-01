import { NextResponse } from 'next/server';

const TUNEHUB_API_URL = 'https://tunehub.sayqz.com/api';
const CACHE_TTL = 60;

async function getDefaultCache(): Promise<Cache | null> {
  if (!('caches' in globalThis)) return null;
  if ('open' in caches && typeof caches.open === 'function') {
    return caches.open('default');
  }
  return null;
}

function hashString(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

export async function GET() {
  try {
    const cache = await getDefaultCache();
    let cacheKeyRequest: Request | null = null;

    if (cache) {
      const cacheKey = hashString('status');
      cacheKeyRequest = new Request(`https://cache.yymusic.local/status/${cacheKey}`);
      const cached = await cache.match(cacheKeyRequest);
      if (cached) {
        const headers = new Headers(cached.headers);
        headers.set('x-cache', 'HIT');
        return new Response(cached.body, {
          status: cached.status,
          headers,
        });
      }
    }

    const response = await fetch(`${TUNEHUB_API_URL}/status`, {
      headers: {
        Accept: 'application/json',
      },
    });

    const data = await response.json();
    const jsonResponse = NextResponse.json(data, { status: response.status });
    jsonResponse.headers.set('Cache-Control', `public, max-age=${CACHE_TTL}`);

    if (cache && cacheKeyRequest && response.ok) {
      jsonResponse.headers.set('x-cache', 'MISS');
      cache
        .put(cacheKeyRequest, jsonResponse.clone())
        .catch((error) => console.error('Status cache put failed:', error));
    }

    return jsonResponse;
  } catch (error) {
    console.error('Status API error:', error);
    return NextResponse.json({ code: -1, message: 'Internal server error' }, { status: 500 });
  }
}
