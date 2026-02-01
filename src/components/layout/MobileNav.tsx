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
    <nav className="fixed bottom-0 left-0 right-0 z-40 flex h-16 items-center justify-around border-t border-border/60 bg-background/90 backdrop-blur lg:hidden">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 text-[11px] text-muted-foreground transition-colors',
              isActive && 'text-primary'
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
