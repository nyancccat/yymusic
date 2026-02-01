'use client';

import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import { getCoverUrl, getLyrics } from '@/lib/api';
import { type LyricLine, formatTime, parseLrc } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { ChevronDown, Loader2, Music2, Pause, Play, SkipBack, SkipForward } from 'lucide-react';
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
      className="fixed inset-0 z-50 flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground"
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
      <div className="absolute inset-0">
        {coverUrl ? (
          <img src={coverUrl} alt="" className="h-full w-full object-cover opacity-40 blur-3xl" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-primary/30 via-background to-background" />
        )}
      </div>

      <div className="relative flex items-center justify-between px-6 py-6">
        <div className="absolute inset-x-0 top-2 flex justify-center md:hidden">
          <div className="h-1.5 w-12 rounded-full bg-border/80" />
        </div>
        <Button variant="outline" size="icon" onClick={onClose}>
          <ChevronDown size={18} />
        </Button>
      </div>

      <div className="relative flex flex-1 flex-col gap-10 px-6 pb-8 lg:flex-row lg:items-center lg:justify-center">
        <div className="flex flex-1 flex-col items-center gap-6 lg:items-start">
          <div className="flex h-64 w-64 items-center justify-center overflow-hidden rounded-3xl border border-border/60 bg-secondary shadow-2xl">
            {coverUrl ? (
              <img src={coverUrl} alt={currentTrack.name} className="h-full w-full object-cover" />
            ) : (
              <Music2 size={48} className="text-muted-foreground" />
            )}
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-semibold">{currentTrack.name}</h2>
            <p className="text-sm text-muted-foreground">{currentTrack.artist}</p>
            <p className="text-xs text-muted-foreground">{currentTrack.album || '未知专辑'}</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col">
          <div
            ref={lyricsContainerRef}
            data-swipe-ignore="true"
            className="max-h-[360px] space-y-4 overflow-y-auto rounded-3xl border border-border/60 bg-card/80 p-6"
          >
            {lyricLoading ? (
              <div className="flex items-center justify-center text-muted-foreground">
                <Loader2 size={28} className="animate-spin" />
              </div>
            ) : lyrics.length === 0 ? (
              <div className="text-center text-sm text-muted-foreground">暂无歌词</div>
            ) : (
              lyrics.map((line, index) => (
                <button
                  type="button"
                  key={`${line.time}-${line.text}`}
                  ref={index === activeLineIndex ? activeLineRef : null}
                  className={cn(
                    'w-full text-left text-sm text-muted-foreground transition',
                    index === activeLineIndex && 'text-lg font-semibold text-foreground text-glow'
                  )}
                  onClick={() => seek(line.time)}
                >
                  {line.text}
                </button>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="relative border-t border-border/60 bg-card/80 px-6 py-6">
        <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
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
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${progressPercent}%, rgba(255,255,255,0.2) ${progressPercent}%, rgba(255,255,255,0.2) 100%)`,
          }}
        />
        <div className="mt-6 flex items-center justify-center gap-6">
          <Button variant="ghost" size="icon" onClick={prev} title="上一首">
            <SkipBack size={24} />
          </Button>
          <Button variant="accent" size="icon" className="h-14 w-14" onClick={togglePlay}>
            {isLoading ? (
              <Loader2 size={24} className="animate-spin" />
            ) : isPlaying ? (
              <Pause size={24} fill="currentColor" strokeWidth={0} />
            ) : (
              <Play size={24} fill="currentColor" strokeWidth={0} className="ml-1" />
            )}
          </Button>
          <Button variant="ghost" size="icon" onClick={next} title="下一首">
            <SkipForward size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}
