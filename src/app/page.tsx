'use client';

import { MediaCard, MediaGrid } from '@/components/business';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTopLists } from '@/lib/api';
import type { MusicPlatform, TopListItem } from '@/lib/types';
import { storage } from '@/lib/utils';
import { Compass, Loader2, Sparkles, Waves } from 'lucide-react';
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
          setError('风声太大，榜单暂时没有传来。');
        } else {
          setError('网络有些摇晃，先听缓存里的温柔。');
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
    <div className="space-y-6 md:space-y-10">
      <section className="relative overflow-hidden rounded-xl border border-border/70 bg-card/90 p-5 md:p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/15 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.24em] text-muted-foreground">
              <Sparkles size={13} className="text-primary" />
              今日序曲
            </p>
            <h2 className="font-display text-2xl font-semibold md:text-4xl">
              把夜晚交给耳机，把心事交给旋律。
            </h2>
            <p className="max-w-xl text-sm text-muted-foreground">
              三个平台的热门榜单在这里相逢。你只管点开，故事会自己流动。
            </p>
          </div>
          <div className="flex w-full items-center gap-2 sm:w-auto sm:gap-3">
            <Button variant="accent" className="flex-1 sm:flex-none" onClick={handleExplore}>
              <Waves size={16} className="mr-2" />
              开始聆听
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none" asChild>
              <Link href="/search">
                <Compass size={15} className="mr-2" />
                去找一首歌
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section id="toplists" className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h3 className="flex items-center gap-2 text-xl font-semibold">
              <Sparkles size={17} className="text-primary" />
              榜单画廊
            </h3>
            <p className="text-sm text-muted-foreground">从热歌到长尾，让每一次下滑都有惊喜。</p>
          </div>
          <Tabs value={platform} onValueChange={(value) => setPlatform(value as MusicPlatform)}>
            <TabsList className="mx-auto w-full max-w-[340px] justify-between sm:w-auto sm:max-w-none sm:justify-center">
              {PLATFORMS.map((p) => (
                <TabsTrigger key={p.id} value={p.id} className="flex-1 sm:flex-none">
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
          <div className="rounded-xl border border-border bg-card/90 p-6 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => setPlatform(platform)}>
              再试一次
            </Button>
          </div>
        ) : null}

        {topLists.length > 0 ? (
          <div className="space-y-3">
            {error && <p className="text-xs text-muted-foreground">{error}</p>}
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
