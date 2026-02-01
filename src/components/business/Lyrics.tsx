'use client';

import { usePlayer } from '@/context/PlayerContext';
import { getLyrics } from '@/lib/api';
import { type LyricLine, parseLrc } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Loader2, Music2, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

interface LyricsProps {
  onClose?: () => void;
  isModal?: boolean;
  showHeader?: boolean;
}

export function Lyrics({ onClose, isModal = false, showHeader = true }: LyricsProps) {
  const { currentTrack, currentTime, seek } = usePlayer();
  const [lyrics, setLyrics] = useState<LyricLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const activeLineRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!currentTrack) {
      setLyrics([]);
      return;
    }

    const track = currentTrack;

    async function fetchLyrics() {
      setLoading(true);
      setError(false);
      try {
        const lrcText = await getLyrics(track.id, track.platform);
        const parsed = parseLrc(lrcText);
        setLyrics(parsed);
      } catch {
        setError(true);
        setLyrics([]);
      } finally {
        setLoading(false);
      }
    }

    fetchLyrics();
  }, [currentTrack]);

  const activeLine = lyrics.findIndex((line, index) => {
    const nextLine = lyrics[index + 1];
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
  });

  useEffect(() => {
    if (activeLine < 0) return;
    if (activeLineRef.current && contentRef.current) {
      const container = contentRef.current;
      const element = activeLineRef.current;
      const containerHeight = container.clientHeight;
      const elementTop = element.offsetTop;
      const elementHeight = element.clientHeight;

      container.scrollTo({
        top: elementTop - containerHeight / 2 + elementHeight / 2,
        behavior: 'smooth',
      });
    }
  }, [activeLine]);

  const handleLineClick = useCallback(
    (time: number) => {
      seek(time);
    },
    [seek]
  );

  const content = (
    <div className="space-y-4">
      {showHeader && (
        <div className="flex items-start justify-between gap-3 rounded-2xl border border-border/60 bg-background/60 p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-secondary">
              {currentTrack?.cover ? (
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Music2 size={20} className="text-muted-foreground" />
              )}
            </div>
            <div>
              <p className="text-sm font-semibold">
                {currentTrack ? currentTrack.name : '暂无播放内容'}
              </p>
              <p className="text-xs text-muted-foreground">
                {currentTrack ? currentTrack.artist : '选择一首歌开始'}
              </p>
            </div>
          </div>
          {onClose && (
            <button
              type="button"
              className="rounded-full border border-border/60 p-1 text-muted-foreground hover:text-foreground"
              onClick={onClose}
              aria-label="关闭"
            >
              <X size={16} />
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 size={28} className="animate-spin" />
        </div>
      ) : !currentTrack ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
          <Music2 size={32} />
          <p className="text-sm">暂无播放内容</p>
        </div>
      ) : lyrics.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10 text-center text-muted-foreground">
          <Music2 size={32} />
          <p className="text-sm">{error ? '歌词加载失败' : '暂无歌词'}</p>
        </div>
      ) : (
        <div ref={contentRef} className="max-h-[420px] space-y-3 overflow-y-auto pr-2">
          {lyrics.map((line, index) => (
            <button
              type="button"
              key={`${line.time}-${index}`}
              ref={index === activeLine ? activeLineRef : null}
              className={cn(
                'w-full text-left text-sm text-muted-foreground transition hover:text-foreground',
                index === activeLine && 'text-lg font-semibold text-foreground text-glow',
                index < activeLine && 'text-muted-foreground/70'
              )}
              onClick={() => handleLineClick(line.time)}
            >
              {line.text}
            </button>
          ))}
        </div>
      )}
    </div>
  );

  if (isModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur">
        <div className="w-full max-w-3xl rounded-2xl border border-border bg-card p-6">
          {content}
        </div>
      </div>
    );
  }

  return content;
}
