import { type NextRequest, NextResponse } from 'next/server';

const CACHE_RULES: { pattern: RegExp; ttl: number }[] = [
  { pattern: /\/toplist|toplists|rank|榜/i, ttl: 600 },
  { pattern: /search|keyword|query/i, ttl: 60 },
  { pattern: /playlist/i, ttl: 300 },
  { pattern: /lyric|lrc|lyrics/i, ttl: 86400 },
  { pattern: /song|detail|info/i, ttl: 3600 },
];

function stableStringify(value: unknown): string {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`)
    .join(',')}}`;
}

function hashString(input: string): string {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0).toString(36);
}

function getCacheTtl(url: string): number {
  for (const rule of CACHE_RULES) {
    if (rule.pattern.test(url)) return rule.ttl;
  }
  return 0;
}

async function getDefaultCache(): Promise<Cache | null> {
  if (!('caches' in globalThis)) return null;
  if ('open' in caches && typeof caches.open === 'function') {
    return caches.open('default');
  }
  return null;
}

export async function POST(request: NextRequest) {
  try {
    const { url, method, headers, body } = await request.json();
    console.log('[Proxy] Request:', { url, method });

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // 合并请求头，如果有 body 则需要设置 Content-Type
    const requestHeaders: Record<string, string> = { ...headers };
    if (body && !requestHeaders['Content-Type']) {
      requestHeaders['Content-Type'] = 'application/json';
    }

    console.log('[Proxy] Body:', body ? JSON.stringify(body).substring(0, 200) : 'none');

    const isSensitive = Object.keys(requestHeaders).some((key) =>
      /authorization|cookie|x-api-key/i.test(key)
    );
    const ttl = isSensitive ? 0 : getCacheTtl(url);
    const cache = ttl > 0 ? await getDefaultCache() : null;
    let cacheKeyRequest: Request | null = null;

    if (cache) {
      const cacheKey = hashString(
        `${method || 'GET'}|${url}|${body ? stableStringify(body) : ''}`
      );
      cacheKeyRequest = new Request(`https://cache.yymusic.local/proxy/${cacheKey}`);
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

    const response = await fetch(url, {
      method: method || 'GET',
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    // 获取原始文本
    const text = await response.text();

    // 尝试解析为 JSON
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      // 如果解析失败，返回原始文本
      data = text;
    }

    console.log('[Proxy] Response status:', response.status);
    console.log('[Proxy] Response data type:', typeof data);
    console.log('[Proxy] Response data (first 300 chars):', JSON.stringify(data).substring(0, 300));

    const jsonResponse = NextResponse.json(data, { status: response.status });
    const shouldCache =
      response.ok &&
      ttl > 0 &&
      !(typeof data === 'object' &&
        data &&
        'code' in data &&
        typeof (data as { code?: number }).code === 'number' &&
        (data as { code?: number }).code !== 0);

    if (shouldCache) {
      jsonResponse.headers.set('Cache-Control', `public, max-age=${ttl}`);
    }

    if (cache && cacheKeyRequest && shouldCache) {
      jsonResponse.headers.set('x-cache', 'MISS');
      cache
        .put(cacheKeyRequest, jsonResponse.clone())
        .catch((error) => console.error('[Proxy] Cache put failed:', error));
    }

    return jsonResponse;
  } catch (error) {
    console.error('[Proxy] Error:', error);
    return NextResponse.json({ error: 'Proxy request failed' }, { status: 500 });
  }
}
