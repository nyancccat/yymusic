'use client';

import { cn } from '@/lib/utils';
import { Heart, Home, Info, ListMusic, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { label: '首页', href: '/', icon: Home },
  { label: '搜索', href: '/search', icon: Search },
  { label: '收藏', href: '/favorites', icon: Heart },
  { label: '队列', href: '/queue', icon: ListMusic },
  { label: '关于', href: '/about', icon: Info },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-[calc(var(--mobile-player-height)+env(safe-area-inset-bottom)+4px)] left-0 right-0 z-40 px-2 pb-1 lg:hidden">
      <div className="flex h-[var(--mobile-nav-height)] items-center justify-around rounded-xl border border-border/70 bg-background/95 shadow-[0_-8px_20px_rgba(15,23,42,0.06)] backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'mx-0.5 flex h-[calc(100%-8px)] min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg text-[10px] font-medium text-muted-foreground transition-colors',
                isActive &&
                  'bg-secondary/70 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.28)]'
              )}
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
