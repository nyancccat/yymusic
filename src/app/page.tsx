'use client';

import { MediaCard, MediaGrid } from '@/components/business';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getTopLists } from '@/lib/api';
import type { MusicPlatform, TopListItem } from '@/lib/types';
import { Loader2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

const PLATFORMS: { id: MusicPlatform; name: string }[] = [
  { id: 'netease', name: '网易云' },
  { id: 'qq', name: 'QQ音乐' },
  { id: 'kuwo', name: '酷我' },
];

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
    async function fetchTopLists() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTopLists(platform);
        setTopLists(data.list || []);
      } catch (err) {
        setError('加载排行榜失败，请稍后重试');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchTopLists();
  }, [platform]);

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl border border-border bg-card/70 p-8">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-transparent" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.32em] text-muted-foreground">沉浸式精选</p>
            <h2 className="font-display text-3xl font-semibold md:text-4xl">
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

        {loading ? (
          <div className="flex items-center justify-center py-16 text-muted-foreground">
            <Loader2 size={32} className="animate-spin" />
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-border bg-card/70 p-6 text-center">
            <p className="text-sm text-muted-foreground">{error}</p>
            <Button variant="outline" className="mt-4" onClick={() => setPlatform(platform)}>
              重试
            </Button>
          </div>
        ) : (
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
        )}
      </section>
    </div>
  );
}
