'use client';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useLyrics } from '@/context/LyricsContext';
import {
  Compass,
  Disc3,
  Heart,
  LibraryBig,
  type LucideIcon,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Sparkles,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useMemo } from 'react';

const TITLE_MAP: Record<string, { title: string; subtitle: string; icon: LucideIcon }> = {
  '/': {
    title: '夜色留声',
    subtitle: '把今天的心事，交给旋律慢慢说。',
    icon: Sparkles,
  },
  '/search': {
    title: '拾音漫游',
    subtitle: '输入一段名字，遇见久别重逢的那首歌。',
    icon: Compass,
  },
  '/favorites': {
    title: '心动收藏',
    subtitle: '你按下喜欢的每一次，都是情绪的注脚。',
    icon: Heart,
  },
  '/queue': {
    title: '下一程旋律',
    subtitle: '让播放顺序像夜晚散步一样从容。',
    icon: Disc3,
  },
  '/recent': {
    title: '回声轨迹',
    subtitle: '那些刚听过的片刻，仍在耳边回响。',
    icon: LibraryBig,
  },
  '/about': {
    title: '关于余韵',
    subtitle: '一座温柔的在线唱片馆。',
    icon: Sparkles,
  },
};

export function TopBar() {
  const pathname = usePathname();
  const router = useRouter();
  const { showLyrics, toggleLyrics } = useLyrics();

  const header = useMemo(() => {
    if (pathname.startsWith('/toplist')) {
      return {
        title: '榜单诗页',
        subtitle: '把城市热歌，翻成一行一行。',
        icon: Disc3,
      };
    }

    return (
      TITLE_MAP[pathname] || {
        title: '旋律漫游',
        subtitle: '愿你在每一次点击里，听见自己。',
        icon: Sparkles,
      }
    );
  }, [pathname]);

  const HeaderIcon = header.icon;

  return (
    <header className="z-40 border-b border-border/70 bg-background/95 backdrop-blur-md md:sticky md:top-0">
      <div className="flex items-center justify-between gap-3 px-3 py-3 md:gap-4 md:px-8 md:py-5">
        <div className="min-w-0">
          <p className="text-[10px] uppercase tracking-[0.32em] text-muted-foreground md:text-xs">
            yyMusic
          </p>
          <div className="mt-2 flex items-center gap-2">
            <HeaderIcon size={18} className="shrink-0 text-primary" />
            <h1 className="truncate font-display text-xl font-semibold leading-[1.2] md:text-3xl">
              {header.title}
            </h1>
          </div>
          <p className="mt-1 truncate text-[11px] text-muted-foreground md:text-sm">
            {header.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {pathname !== '/search' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/search')}
              aria-label="搜索"
              title="搜索"
            >
              <Search size={16} />
            </Button>
          )}
          <Button
            variant={showLyrics ? 'accent' : 'outline'}
            size="icon"
            className="hidden md:inline-flex"
            onClick={toggleLyrics}
            aria-label="切换歌词面板"
            title="切换歌词面板"
          >
            {showLyrics ? <PanelRightClose size={16} /> : <PanelRightOpen size={16} />}
          </Button>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
