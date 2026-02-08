'use client';

import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import { getCoverUrl, getLyrics } from '@/lib/api';
import { type LyricLine, formatTime, parseLrc } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Disc3,
  Loader2,
  Music2,
  Pause,
  Play,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface FullScreenPlayerProps {
  onClose: () => void;
}

export function FullScreenPlayer({ onClose }: FullScreenPlayerProps) {
  const {
    currentTrack,
    isPlaying,
    togglePlay,
    next,
    prev,
    currentTime,
    duration,
    seek,
    isLoading,
  } = usePlayer();

  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [lyricLoading, setLyricLoading] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [scrubTime, setScrubTime] = useState(0);
  const [coverUrl, setCoverUrl] = useState<string>('');

  const activeLineRef = useRef<HTMLButtonElement>(null);
  const lyricsContainerRef = useRef<HTMLDivElement>(null);
  const swipeStartRef = useRef<{ x: number; y: number; allowClose: boolean } | null>(null);

  useEffect(() => {
    if (!isScrubbing) {
      setScrubTime(currentTime);
    }
  }, [currentTime, isScrubbing]);

  useEffect(() => {
    if (!currentTrack) {
      setCoverUrl('');
      return;
    }

    if (currentTrack.cover) {
      setCoverUrl(currentTrack.cover);
      return;
    }

    getCoverUrl(currentTrack.id, currentTrack.platform)
      .then((url) => setCoverUrl(url))
      .catch(() => setCoverUrl(''));
  }, [currentTrack]);

  useEffect(() => {
    if (!currentTrack) return;

    const track = currentTrack;

    async function fetchLyrics() {
      setLyricLoading(true);
      try {
        const lrcText = await getLyrics(track.id, track.platform);
        const parsed = parseLrc(lrcText);
        setLyrics(parsed);
      } catch {
        setLyrics([]);
      } finally {
        setLyricLoading(false);
      }
    }

    setLyrics([]);
    fetchLyrics();
  }, [currentTrack]);

  const activeLineIndex = lyrics.findIndex((line, index) => {
    const nextLine = lyrics[index + 1];
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
  });

  useEffect(() => {
    if (activeLineIndex < 0) return;
    if (activeLineRef.current && lyricsContainerRef.current) {
      activeLineRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeLineIndex]);

  const progressPercent =
    duration > 0 ? ((isScrubbing ? scrubTime : currentTime) / duration) * 100 : 0;

  if (!currentTrack) return null;

  return (
    <div
      className="fixed inset-0 z-50 grid h-screen w-screen grid-rows-[auto_1fr_auto] overflow-hidden bg-background text-foreground pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]"
      onTouchStart={(event) => {
        const target = event.target as HTMLElement | null;
        if (target?.closest('[data-swipe-ignore="true"]')) {
          swipeStartRef.current = null;
          return;
        }
        const touch = event.touches[0];
        const allowClose = touch.clientY <= 120;
        swipeStartRef.current = { x: touch.clientX, y: touch.clientY, allowClose };
      }}
      onTouchEnd={(event) => {
        if (!swipeStartRef.current || !swipeStartRef.current.allowClose) {
          swipeStartRef.current = null;
          return;
        }
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - swipeStartRef.current.x;
        const deltaY = touch.clientY - swipeStartRef.current.y;
        swipeStartRef.current = null;
        if (deltaY > 70 && Math.abs(deltaX) < 60) {
          onClose();
        }
      }}
    >
      <div className="relative z-10 flex items-center justify-between border-b border-border/60 px-5 py-4 md:px-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Disc3 size={16} className={cn(isPlaying && 'animate-spin')} />
          全屏播放
        </div>
        <Button variant="outline" size="icon" onClick={onClose}>
          <ChevronDown size={18} />
        </Button>
      </div>

      <div className="relative z-10 grid min-h-0 grid-cols-1 gap-6 px-5 py-5 lg:grid-cols-[minmax(340px,460px)_minmax(0,1fr)] lg:gap-8 lg:px-8">
        <section className="flex min-h-0 flex-col items-center justify-center gap-5">
          <div className="relative aspect-square w-[min(72vw,430px)]">
            <div className="absolute inset-[8%] rounded-full bg-black/40 blur-2xl" />

            <div
              className={cn(
                'relative h-full w-full overflow-hidden rounded-full border border-border/60 bg-[radial-gradient(circle_at_50%_45%,#3f3440_0%,#241d25_48%,#161216_78%,#0f0b0f_100%)] shadow-[0_24px_60px_rgba(0,0,0,0.45)]',
                isPlaying && !isLoading && 'animate-[spin_8s_linear_infinite]'
              )}
            >
              <div
                className="absolute inset-0 rounded-full opacity-35"
                style={{
                  background:
                    'repeating-radial-gradient(circle at center, rgba(255,255,255,0.08) 0, rgba(255,255,255,0.08) 1px, transparent 2px, transparent 7px)',
                }}
              />

              <div className="absolute inset-[22%] overflow-hidden rounded-full border border-border/40 bg-card/90">
                {coverUrl ? (
                  <img
                    src={coverUrl}
                    alt={currentTrack.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-muted-foreground">
                    <Music2 size={40} />
                  </div>
                )}
              </div>

              <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-zinc-100 shadow-[0_0_0_2px_rgba(0,0,0,0.35)]" />
            </div>

            <div
              className={cn(
                'absolute right-[9%] top-[10%] h-2 w-[38%] origin-right rounded-full bg-gradient-to-r from-zinc-300 to-zinc-500 shadow-md transition-transform duration-300',
                isPlaying ? '-rotate-[18deg]' : '-rotate-[31deg]'
              )}
            >
              <span className="absolute -left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 rounded-sm bg-zinc-200" />
            </div>
          </div>

          <div className="w-full max-w-[430px] space-y-1.5 text-center">
            <h2 className="truncate text-xl font-semibold md:text-2xl">{currentTrack.name}</h2>
            <p className="truncate text-sm text-muted-foreground">{currentTrack.artist}</p>
            <p className="truncate text-xs text-muted-foreground">
              {currentTrack.album || '未标注专辑'}
            </p>
          </div>
        </section>

        <section className="flex min-h-0 flex-col">
          <div
            ref={lyricsContainerRef}
            data-swipe-ignore="true"
            className="min-h-0 flex-1 space-y-4 overflow-y-auto rounded-xl border border-border/70 bg-card/90 p-5"
          >
            {lyricLoading ? (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                <Loader2 size={28} className="animate-spin" />
              </div>
            ) : lyrics.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
                <Music2 size={22} />
                这首歌暂时没有歌词，先听旋律吧。
              </div>
            ) : (
              lyrics.map((line, index) => (
                <button
                  type="button"
                  key={`${line.time}-${line.text}`}
                  ref={index === activeLineIndex ? activeLineRef : null}
                  className={cn(
                    'w-full border-l-2 border-transparent pl-2 text-left text-sm text-muted-foreground transition',
                    index === activeLineIndex &&
                      'border-primary text-base font-semibold text-foreground'
                  )}
                  onClick={() => seek(line.time)}
                >
                  {line.text}
                </button>
              ))
            )}
          </div>
        </section>
      </div>

      <div className="relative z-10 border-t border-border/60 bg-card/90 px-5 py-4 md:px-6">
        <div className="mb-3 flex items-center justify-between text-xs text-muted-foreground">
          <span>{formatTime(isScrubbing ? scrubTime : currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
        <input
          data-swipe-ignore="true"
          type="range"
          min={0}
          max={duration || 100}
          value={isScrubbing ? scrubTime : currentTime}
          onChange={(e) => setScrubTime(Number(e.target.value))}
          onMouseDown={() => setIsScrubbing(true)}
          onMouseUp={(e) => {
            setIsScrubbing(false);
            seek(Number(e.currentTarget.value));
          }}
          onTouchStart={() => setIsScrubbing(true)}
          onTouchEnd={(e) => {
            setIsScrubbing(false);
            seek(Number(e.currentTarget.value));
          }}
          className="w-full accent-primary"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progressPercent}%, hsl(var(--secondary)) ${progressPercent}%, hsl(var(--secondary)) 100%)`,
          }}
        />
        <div className="mt-4 flex items-center justify-center gap-5">
          <Button variant="ghost" size="icon" onClick={prev} title="上一首">
            <SkipBack size={22} />
          </Button>
          <Button variant="accent" size="icon" className="h-12 w-12" onClick={togglePlay}>
            {isLoading ? (
              <Loader2 size={22} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={22} fill="currentColor" strokeWidth={0} />
            ) : (
              <Play size={22} fill="currentColor" strokeWidth={0} className="ml-0.5" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={next} title="下一首">
            <SkipForward size={22} />
          </Button>
        </div>
      </div>
    </div>
  );
}
