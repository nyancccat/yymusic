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
    <nav className="fixed bottom-[calc(var(--mobile-player-height)+env(safe-area-inset-bottom))] left-0 right-0 z-40 flex h-[var(--mobile-nav-height)] items-center justify-around border-t border-border/70 bg-background/95 backdrop-blur-md lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex h-full min-w-0 flex-1 flex-col items-center justify-center gap-1 pt-1 text-[10px] font-medium text-muted-foreground transition-colors',
              isActive && 'bg-secondary/60 text-primary'
            )}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
