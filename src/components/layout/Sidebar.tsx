'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Clock, Heart, Home, Info, ListMusic, Search } from 'lucide-react';
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


export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden h-screen w-20 flex-col border-r border-border/60 bg-background/80 backdrop-blur-xl lg:flex">
      <div className="flex h-16 items-center justify-center">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-glow">
          <img src="/logo.svg" alt="Logo" className="h-7 w-7" />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 pb-6">
        <nav className="space-y-5">
          <ul className="space-y-2">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground',
                    isActive(item.href) && 'bg-primary text-primary-foreground shadow-glow'
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="px-2">
            <div className="h-px bg-border/60" />
          </div>

          <ul className="space-y-2">
            {libraryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium text-muted-foreground transition hover:bg-secondary/70 hover:text-foreground',
                    isActive(item.href) && 'bg-secondary text-foreground'
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
    </aside>
  );
}
