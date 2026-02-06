'use client';

import { MediaCard, MediaGrid } from '@/components/business';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTopLists } from '@/lib/api';
import type { MusicPlatform, TopListItem } from '@/lib/types';
import { storage } from '@/lib/utils';
import { Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PLATFORMS: { id: MusicPlatform; name: string }[] = [
  { id: 'netease', name: '网易云' },
  { id: 'qq', name: 'QQ音乐' },
  { id: 'kuwo', name: '酷我' },
];

const TOPLIST_CACHE_PREFIX = 'toplists_cache:';
const TOPLIST_TIMEOUT_MS = 10_000;

type TopListCache = {
  list: TopListItem[];
  ts: number;
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export default function HomePage() {
  const [platform, setPlatform] = useState<MusicPlatform>('netease');
  const [topLists, setTopLists] = useState<TopListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleExplore = () => {
    const target = document.getElementById('toplists');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `${TOPLIST_CACHE_PREFIX}${platform}`;
    const cached = storage.get<TopListCache | null>(cacheKey, null);
    if (cached?.list?.length) {
      setTopLists(cached.list);
      setLoading(false);
    } else {
      setTopLists([]);
      setLoading(true);
    }

    async function fetchTopLists() {
      setError(null);
      try {
        const data = await withTimeout(getTopLists(platform), TOPLIST_TIMEOUT_MS);
        let list = data.list || [];
        if (list.length === 0) {
          const retry = await withTimeout(getTopLists(platform), TOPLIST_TIMEOUT_MS);
          list = retry.list || [];
        }

        if (list.length === 0) {
          throw new Error('Empty toplist');
        }

        if (cancelled) return;
        setTopLists(list);
        storage.set(cacheKey, { list, ts: Date.now() });
      } catch (err) {
        console.error(err);
        if (cancelled) return;
        if (!cached?.list?.length) {
          setError('加载排行榜失败，请稍后重试');
        } else {
          setError('网络波动，已显示缓存数据');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchTopLists();
    return () => {
      cancelled = true;
    };
  }, [platform]);

  return (
    <div className="space-y-8 md:space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-6 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">沉浸式精选</p>
            <h2 className="font-display text-2xl font-semibold md:text-4xl">
              黑金听境 · 余韵女神的祝福
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              三大平台热榜在此汇流，歌词随声而至，音质温润，留住今日最动人的回响。
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="accent" onClick={handleExplore}>
              <Sparkles size={16} className="mr-2" />
              开始探索
            </Button>
            <Button variant="outline" asChild>
              <Link href="/search">快速搜索</Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="toplists" className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="text-xl font-semibold">排行榜</h3>
            <p className="text-sm text-muted-foreground">热门榜单与精选歌单</p>
          </div>
          <Tabs value={platform} onValueChange={(value) => setPlatform(value as MusicPlatform)}>
            <TabsList>
              {PLATFORMS.map((p) => (
                <TabsTrigger key={p.id} value={p.id}>
                  {p.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {loading && topLists.length === 0 ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : null}

        {error && topLists.length === 0 ? (
          <div className="rounded-2xl border border-border bg-card/70 p-6 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => setPlatform(platform)}>
              重试
            </Button>
          </div>
        ) : null}

        {topLists.length > 0 ? (
          <div className="space-y-3">
            {error && (
              <p className="text-xs text-muted-foreground">{error}</p>
            )}
            <MediaGrid>
              {topLists.slice(0, 12).map((list) => (
                <Link key={list.id} href={`/toplist/${platform}/${list.id}`}>
                  <MediaCard
                    id={list.id}
                    title={list.name}
                    subtitle={list.updateFrequency}
                    imageUrl={list.pic || ''}
                  />
                </Link>
              ))}
            </MediaGrid>
          </div>
        ) : null}
      </section>
    </div>
  );
}
