'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Clock, Heart, Home, Info, ListMusic, Moon, Search, Sun } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const mainNav: NavItem[] = [
  { label: '现在就听', href: '/', icon: Home },
  { label: '最近播放', href: '/recent', icon: Clock },
  { label: '我喜欢', href: '/favorites', icon: Heart },
];

const libraryNav: NavItem[] = [
  { label: '搜索', href: '/search', icon: Search },
  { label: '播放列表', href: '/queue', icon: ListMusic },
  { label: '关于', href: '/about', icon: Info },
];

const recommendNav: NavItem[] = [
  { label: '今日推荐', href: '/recommend/today', icon: Sun },
  { label: '车载电台', href: '/recommend/drive', icon: Moon },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-border/60 bg-background/80 backdrop-blur-xl lg:flex">
      <div className="flex items-center gap-3 px-6 py-6">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-primary text-primary-foreground shadow-glow">
          <img src="/logo.svg" alt="Logo" className="h-7 w-7" />
        </div>
        <div>
          <p className="font-display text-lg font-semibold text-foreground">余韵音乐</p>
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">yyMusic</p>
        </div>
      </div>

      <ScrollArea className="flex-1 px-4 pb-6">
        <nav className="space-y-6">
          <div>
            <p className="px-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">发现</p>
            <ul className="mt-3 space-y-1">
              {mainNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground',
                      isActive(item.href) && 'bg-primary text-primary-foreground shadow-glow'
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="px-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">
              歌单推荐
            </p>
            <ul className="mt-3 space-y-1">
              {recommendNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground',
                      isActive(item.href) && 'bg-secondary text-foreground'
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="px-2 text-xs uppercase tracking-[0.28em] text-muted-foreground">资料库</p>
            <ul className="mt-3 space-y-1">
              {libraryNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground',
                      isActive(item.href) && 'bg-secondary text-foreground'
                    )}
                  >
                    <item.icon size={18} />
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

        </nav>
      </ScrollArea>
    </aside>
  );
}
