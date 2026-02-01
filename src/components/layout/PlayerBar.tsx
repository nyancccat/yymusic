'use client';

import { Button } from '@/components/ui/button';
import { useLyrics } from '@/context/LyricsContext';
import { usePlayer } from '@/context/PlayerContext';
import { getSongUrl } from '@/lib/api';
import type { AudioQuality } from '@/lib/types';
import { formatTime } from '@/lib/utils';
import { cn } from '@/lib/utils';
import {
  ChevronDown,
  Download,
  ListOrdered,
  Loader2,
  Music,
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronUp,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';

const QUALITY_OPTIONS: { value: AudioQuality; label: string }[] = [
  { value: '128k', label: '标准 128k' },
  { value: '320k', label: '高品质 320k' },
  { value: 'flac', label: '无损 FLAC' },
];

export function PlayerBar() {
  const {
    isPlaying,
    currentTrack,
    volume,
    currentTime,
    duration,
    isLoading,
    audioQuality,
    playMode,
    togglePlay,
    next,
    prev,
    seek,
    setVolume,
    setAudioQuality,
    cyclePlayMode,
  } = usePlayer();

  const { toggleFullScreen, setShowFullScreen } = useLyrics();

  const progressRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);
  const [prevVolume, setPrevVolume] = useState(1);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const swipeStartRef = useRef<{ x: number; y: number } | null>(null);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return;
      const rect = progressRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      seek(percent * duration);
    },
    [duration, seek]
  );

  const handleVolumeClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!volumeRef.current) return;
      const rect = volumeRef.current.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      setVolume(Math.max(0, Math.min(1, percent)));
    },
    [setVolume]
  );

  const toggleMute = useCallback(() => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
    } else {
      setVolume(prevVolume || 0.5);
    }
  }, [volume, prevVolume, setVolume]);

  const handleDownload = useCallback(async () => {
    if (!currentTrack) return;
    try {
      const url = await getSongUrl(currentTrack.id, currentTrack.platform, audioQuality);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentTrack.name} - ${currentTrack.artist}.mp3`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [currentTrack, audioQuality]);

  const handleQualityChange = useCallback(
    (quality: AudioQuality) => {
      setAudioQuality(quality);
      setShowQualityMenu(false);
    },
    [setAudioQuality]
  );

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleTouchStart = (event: React.TouchEvent) => {
    const touch = event.touches[0];
    swipeStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (event: React.TouchEvent) => {
    if (!swipeStartRef.current || !currentTrack) return;
    const touch = event.changedTouches[0];
    const deltaX = touch.clientX - swipeStartRef.current.x;
    const deltaY = swipeStartRef.current.y - touch.clientY;
    swipeStartRef.current = null;

    if (deltaY > 50 && Math.abs(deltaX) < 60) {
      setShowFullScreen(true);
    }
  };

  return (
    <div
      className="fixed bottom-[calc(var(--mobile-nav-height)+env(safe-area-inset-bottom))] left-0 right-0 z-50 border-t border-border/60 bg-card/90 backdrop-blur-xl lg:bottom-0"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="px-4 py-2 md:px-8 md:py-3">
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-2 py-2 text-left transition hover:border-primary/60"
            onClick={toggleFullScreen}
            title="进入全屏模式"
          >
            <div className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-secondary">
              <span className="pointer-events-none absolute -inset-1 rounded-2xl border border-primary/30 opacity-70 animate-pulse md:hidden" />
              <span className="pointer-events-none absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-glow md:hidden">
                <ChevronUp size={10} />
              </span>
              {currentTrack?.cover ? (
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Music size={18} className="text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {currentTrack ? currentTrack.name : '选择一首歌开始播放'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentTrack ? currentTrack.artist : 'yyMusic'}
              </p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={prev} disabled={!currentTrack}>
              <SkipBack size={18} />
            </Button>
            <Button
              variant="accent"
              size="icon"
              className={cn('h-10 w-10', isLoading && 'opacity-70')}
              onClick={togglePlay}
              disabled={!currentTrack}
              aria-label={isPlaying ? '暂停' : '播放'}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : isPlaying ? (
                <Pause size={18} fill="currentColor" strokeWidth={0} />
              ) : (
                <Play size={18} fill="currentColor" strokeWidth={0} className="ml-0.5" />
              )}
            </Button>
            <Button variant="ghost" size="icon" onClick={next} disabled={!currentTrack}>
              <SkipForward size={18} />
            </Button>
          </div>
        </div>

        <div className="hidden md:flex md:items-center md:gap-6">
          <button
            type="button"
            className="flex min-w-0 items-center gap-3 rounded-2xl border border-border/60 bg-background/60 px-3 py-2 text-left transition hover:border-primary/60"
            onClick={toggleFullScreen}
            title="进入全屏模式"
          >
            <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-secondary">
              {currentTrack?.cover ? (
                <img
                  src={currentTrack.cover}
                  alt={currentTrack.name}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Music size={20} className="text-muted-foreground" />
              )}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {currentTrack ? currentTrack.name : '选择一首歌开始播放'}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {currentTrack ? currentTrack.artist : 'yyMusic'}
              </p>
            </div>
          </button>

          <div className="flex flex-1 flex-col gap-2 items-center">
            <div className="flex items-center justify-center gap-3">
              <Button variant="ghost" size="icon" onClick={prev} disabled={!currentTrack}>
                <SkipBack size={18} />
              </Button>
              <Button
                variant="accent"
                size="icon"
                className={cn('h-11 w-11', isLoading && 'opacity-70')}
                onClick={togglePlay}
                disabled={!currentTrack}
                aria-label={isPlaying ? '暂停' : '播放'}
              >
                {isLoading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : isPlaying ? (
                  <Pause size={18} fill="currentColor" strokeWidth={0} />
                ) : (
                  <Play size={18} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                )}
              </Button>
              <Button variant="ghost" size="icon" onClick={next} disabled={!currentTrack}>
                <SkipForward size={18} />
              </Button>
            </div>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <div
                ref={progressRef}
                className="relative h-1.5 w-full max-w-xl cursor-pointer overflow-hidden rounded-full bg-secondary"
                onClick={handleProgressClick}
                onKeyDown={(event) => {
                  if (!duration) return;
                  if (event.key === 'ArrowRight') {
                    seek(Math.min(duration, currentTime + 5));
                  }
                  if (event.key === 'ArrowLeft') {
                    seek(Math.max(0, currentTime - 5));
                  }
                  if (event.key === 'Home') {
                    seek(0);
                  }
                  if (event.key === 'End') {
                    seek(duration);
                  }
                }}
                role="slider"
                tabIndex={0}
                aria-label="播放进度"
                aria-valuemin={0}
                aria-valuemax={duration || 0}
                aria-valuenow={currentTime}
              >
                <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }} />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <div className="flex items-center justify-between gap-3 md:justify-end">
          <Button
            variant={playMode !== 'sequential' ? 'accent' : 'outline'}
            size="icon"
            onClick={cyclePlayMode}
            aria-label="切换播放模式"
            title={
              {
                sequential: '顺序播放',
                loop: '列表循环',
                loopOne: '单曲循环',
                shuffle: '随机播放',
              }[playMode]
            }
          >
            {playMode === 'shuffle' && <Shuffle size={16} />}
            {playMode === 'loopOne' && <Repeat1 size={16} />}
            {playMode === 'loop' && <Repeat size={16} />}
            {playMode === 'sequential' && <ListOrdered size={16} />}
          </Button>

          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" size="icon" onClick={toggleMute}>
              {volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
            </Button>
            <div
              ref={volumeRef}
              className="relative h-1.5 w-24 cursor-pointer overflow-hidden rounded-full bg-secondary"
              onClick={handleVolumeClick}
              onKeyDown={(event) => {
                if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
                  setVolume(Math.min(1, volume + 0.05));
                }
                if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
                  setVolume(Math.max(0, volume - 0.05));
                }
                if (event.key === 'Home') {
                  setVolume(0);
                }
                if (event.key === 'End') {
                  setVolume(1);
                }
              }}
              role="slider"
              tabIndex={0}
              aria-label="音量"
              aria-valuemin={0}
              aria-valuemax={1}
              aria-valuenow={volume}
            >
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>

          <div className="relative">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowQualityMenu(!showQualityMenu)}
            >
              <span className="text-xs">{audioQuality}</span>
              <ChevronDown size={14} className="ml-1" />
            </Button>
            {showQualityMenu && (
              <div className="absolute right-0 z-50 mt-2 w-36 rounded-lg border border-border bg-card p-1 shadow-lg">
                {QUALITY_OPTIONS.map((opt) => (
                  <button
                    type="button"
                    key={opt.value}
                    className={cn(
                      'flex w-full items-center rounded-md px-2 py-1 text-xs transition hover:bg-secondary',
                      audioQuality === opt.value && 'bg-primary text-primary-foreground'
                    )}
                    onClick={() => handleQualityChange(opt.value)}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button variant="ghost" size="icon" onClick={handleDownload} disabled={!currentTrack}>
            <Download size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
