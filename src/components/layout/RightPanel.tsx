'use client';

import { Lyrics } from '@/components/business';
import { Button } from '@/components/ui/button';
import { useLyrics } from '@/context/LyricsContext';
import { usePlayer } from '@/context/PlayerContext';
import { cn } from '@/lib/utils';
import { ChevronRight, Disc3, Music2, Waves } from 'lucide-react';

export function RightPanel() {
  const { currentTrack, isPlaying } = usePlayer();
  const { setShowLyrics } = useLyrics();

  return (
    <aside className="hidden w-80 flex-col px-4 py-6 lg:flex xl:w-96">
      <div className="sticky top-6 space-y-4">
        <div className="flex items-center justify-between rounded-xl border border-border/70 bg-card/90 p-4">
          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground">Now Playing</p>
            <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-foreground">
              <Waves size={14} className="text-primary" />
              {currentTrack ? currentTrack.name : '此刻仍安静'}
            </p>
            <p className="text-xs text-muted-foreground">
              {currentTrack ? currentTrack.artist : '点一首歌，故事就开始了'}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowLyrics(false)}
            aria-label="隐藏正在播放面板"
          >
            <ChevronRight size={16} />
          </Button>
        </div>

        <div className="rounded-xl border border-border/70 bg-card/90 p-4">
          {currentTrack ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-background/60 p-3">
                <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-md bg-secondary">
                  {currentTrack.cover ? (
                    <img
                      src={currentTrack.cover}
                      alt={currentTrack.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Music2 size={20} className="text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{currentTrack.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{currentTrack.artist}</p>
                </div>
                <span
                  className={cn(
                    'ml-auto inline-flex items-center gap-1 rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em]',
                    isPlaying ? 'bg-primary/16 text-primary' : 'bg-secondary text-muted-foreground'
                  )}
                >
                  <Disc3 size={12} className={cn(isPlaying && 'animate-spin')} />
                  {isPlaying ? '播放中' : '暂停'}
                </span>
              </div>
              <Lyrics showHeader={false} />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center gap-3 text-center text-muted-foreground">
              <Music2 size={32} />
              <p className="text-sm">播放一首歌，歌词与故事会在这里展开</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
