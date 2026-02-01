'use client';

import { Lyrics } from '@/components/business';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useLyrics } from '@/context/LyricsContext';
import { usePlayer } from '@/context/PlayerContext';
import { cn } from '@/lib/utils';
import { ChevronRight, Music2 } from 'lucide-react';

export function RightPanel() {
  const { currentTrack, isPlaying } = usePlayer();
  const { setShowLyrics } = useLyrics();

  return (
    <aside className="hidden w-80 flex-col border-l border-border/60 bg-card/50 backdrop-blur-xl lg:flex xl:w-96">
      <div className="flex items-center justify-between border-b border-border/60 px-5 py-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">正在播放</p>
          <p className="mt-2 text-sm font-semibold text-foreground">
            {currentTrack ? currentTrack.name : '尚未播放'}
          </p>
          <p className="text-xs text-muted-foreground">
            {currentTrack ? currentTrack.artist : '选择一首歌开始'}
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

      <ScrollArea className="flex-1 px-5 py-4">
        {currentTrack ? (
          <div className="space-y-6">
            <div className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background/60 p-3">
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-secondary">
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
                  'ml-auto rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em]',
                  isPlaying
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground'
                )}
              >
                {isPlaying ? '播放中' : '暂停'}
              </span>
            </div>
            <Lyrics showHeader={false} />
          </div>
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
            <Music2 size={32} />
            <p className="text-sm">播放一首歌来查看歌词与详情</p>
          </div>
        )}
      </ScrollArea>
    </aside>
  );
}
