'use client';

import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button';
import { useLyrics } from '@/context/LyricsContext';
import { cn } from '@/lib/utils';
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
    title: '关于 余韵音乐',
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
  const isAboutPage = pathname === '/about';

  return (
    <header className="z-40 border-b border-border/70 bg-background/95 backdrop-blur-md md:sticky md:top-0">
      <div
        className={cn(
          'flex items-center justify-between gap-3 px-3.5 py-2.5 md:gap-4 md:px-8 md:py-5',
          isAboutPage && 'py-2.5'
        )}
      >
        <div className="min-w-0">
          <p
            className={cn(
              'text-[10px] uppercase tracking-[0.32em] text-muted-foreground md:text-xs',
              isAboutPage && 'tracking-[0.28em] text-muted-foreground/90'
            )}
          >
            yyMusic
          </p>
          <div className={cn('mt-2 flex items-center gap-2', isAboutPage && 'mt-1.5 gap-1.5')}>
            <HeaderIcon size={isAboutPage ? 16 : 18} className="shrink-0 text-primary" />
            <h1
              className={cn(
                'truncate font-display text-xl font-semibold leading-[1.2] md:text-3xl',
                isAboutPage && 'text-[19px] leading-[1.25]'
              )}
            >
              {header.title}
            </h1>
          </div>
          <p
            className={cn(
              'mt-1 truncate text-[11px] text-muted-foreground md:text-sm',
              isAboutPage && 'mt-1.5 text-[10.5px] tracking-[0.02em] text-muted-foreground/90'
            )}
          >
            {header.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-1.5 md:gap-2">
          {pathname !== '/search' && (
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push('/search')}
              aria-label="搜索"
              title="搜索"
              className="h-9 w-9 md:h-10 md:w-10"
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
          <div className="scale-95 md:scale-100">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
