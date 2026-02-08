'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Clock3, Heart, Home, Info, ListMusic, Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

const mainNav: NavItem[] = [
  { label: '首页', href: '/', icon: Home },
  { label: '最近', href: '/recent', icon: Clock3 },
  { label: '喜欢', href: '/favorites', icon: Heart },
];

const libraryNav: NavItem[] = [
  { label: '搜索', href: '/search', icon: Search },
  { label: '队列', href: '/queue', icon: ListMusic },
  { label: '关于', href: '/about', icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <aside className="hidden h-screen w-20 flex-col border-r border-border/70 bg-background/92 lg:flex">
      <div className="flex h-16 items-center justify-center border-b border-border/50">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-md bg-primary text-primary-foreground">
          <img src="/logo.svg" alt="Logo" className="h-6 w-6" />
        </div>
      </div>

      <ScrollArea className="flex-1 px-2 py-4">
        <nav className="space-y-4">
          <ul className="space-y-1.5">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-md border border-transparent px-2 py-2 text-[10px] font-medium text-muted-foreground transition hover:border-border hover:bg-secondary/50 hover:text-foreground',
                    isActive(item.href) &&
                      'border-primary/40 bg-primary/12 text-foreground shadow-[inset_2px_0_0_0_hsl(var(--primary))]'
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

          <ul className="space-y-1.5">
            {libraryNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-md border border-transparent px-2 py-2 text-[10px] font-medium text-muted-foreground transition hover:border-border hover:bg-secondary/50 hover:text-foreground',
                    isActive(item.href) && 'border-primary/40 bg-secondary/80 text-foreground'
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
