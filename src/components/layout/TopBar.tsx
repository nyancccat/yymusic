'use client';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useLyrics } from '@/context/LyricsContext';
import { cn } from '@/lib/utils';
import { PanelRightClose, PanelRightOpen, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

const TITLE_MAP: Record<string, { title: string; subtitle: string }> = {
  '/': { title: '现在就听', subtitle: '热门排行榜与精选歌单' },
  '/search': { title: '搜索', subtitle: '全网音乐一键直达' },
  '/favorites': { title: '我喜欢', subtitle: '收藏的声音都在这里' },
  '/queue': { title: '播放列表', subtitle: '即将播放的内容' },
  '/recent': { title: '最近播放', subtitle: '回到刚刚听的旋律' },
  '/about': { title: '关于', subtitle: 'yyMusic · 余韵音乐' },
};

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showLyrics, toggleLyrics } = useLyrics();

  const header = useMemo(() => {
    if (pathname.startsWith('/toplist')) {
      return { title: '排行榜', subtitle: '榜单详情与热歌' };
    }
    return TITLE_MAP[pathname] || { title: '探索', subtitle: '发现新的旋律' };
  }, [pathname]);

  return (
    <header className="flex flex-col gap-3 border-b border-border/60 bg-background/80 px-4 py-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between md:gap-4 md:px-8 md:py-5">
      <div>
        <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground md:text-xs">
          yyMusic
        </p>
        <h1 className="mt-2 truncate font-display text-xl font-semibold leading-tight text-foreground md:text-3xl">
          {header.title}
        </h1>
        <p className="mt-1 truncate text-xs text-muted-foreground md:text-sm">
          {header.subtitle}
        </p>
      </div>

      <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row md:items-center">
        {pathname !== '/search' && (
          <button
            type="button"
            className={cn(
              'group hidden items-center gap-3 rounded-full border border-border bg-card/80 px-4 py-2 text-xs text-muted-foreground transition hover:border-primary/60 hover:text-foreground md:flex md:w-72 md:text-sm',
              pathname === '/search' && 'border-primary/70 text-foreground'
            )}
            onClick={() => router.push('/search')}
          >
            <Search size={16} />
            <span className="min-w-0 truncate text-xs md:text-sm">搜索歌曲、艺人、专辑</span>
          </button>
        )}

        <div className="flex items-center gap-2">
          <Button
            variant={showLyrics ? 'accent' : 'outline'}
            size="icon"
            className="hidden md:inline-flex"
            onClick={toggleLyrics}
            aria-label="切换歌词面板"
          >
            {showLyrics ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
