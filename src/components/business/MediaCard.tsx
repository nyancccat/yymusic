'use client';

import { cn } from '@/lib/utils';
import { Music2, Play, Sparkles } from 'lucide-react';

interface MediaCardProps {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl?: string;
  onPlay?: () => void;
}

export function MediaCard({ title, subtitle, imageUrl, onPlay }: MediaCardProps) {
  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onPlay?.();
  };

  return (
    <div className="group flex flex-col gap-2 rounded-xl border border-border/70 bg-card/90 p-2.5 transition hover:border-primary/70 md:gap-3 md:p-3">
      <div className="relative overflow-hidden rounded-md bg-secondary">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="h-36 w-full object-cover transition group-hover:scale-105 md:h-40"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="flex h-40 items-center justify-center text-muted-foreground">
            <Music2 size={32} />
          </div>
        )}
        <button
          type="button"
          className={cn(
            'absolute inset-0 flex items-center justify-center opacity-0 transition group-hover:opacity-100'
          )}
          onClick={handlePlayClick}
          aria-label={`播放 ${title}`}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-[0_6px_20px_rgba(222,87,143,0.45)]">
            <Play size={18} className="ml-0.5" fill="currentColor" strokeWidth={0} />
          </span>
        </button>
      </div>
      <div className="space-y-1">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        {subtitle && (
          <p className="flex items-center gap-1 truncate text-xs text-muted-foreground">
            <Sparkles size={12} className="shrink-0 text-primary" />
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

interface MediaGridProps {
  children: React.ReactNode;
}

export function MediaGrid({ children }: MediaGridProps) {
  return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{children}</div>;
}
