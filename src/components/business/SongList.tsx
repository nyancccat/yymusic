'use client';

import { useFavorites } from '@/context/FavoritesContext';
import { usePlayer } from '@/context/PlayerContext';
import type { MusicPlatform, Track } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Disc3, Heart, Music2, Play, Volume2 } from 'lucide-react';
import type { CSSProperties } from 'react';

interface SongListItem {
  id: string;
  name: string;
  artist?: string;
  album?: string;
  duration?: number;
  platform: MusicPlatform;
  cover?: string;
}

interface SongListProps {
  songs: SongListItem[];
  showHeader?: boolean;
  showCover?: boolean;
  showAlbum?: boolean;
  showDuration?: boolean;
}

export function SongList({
  songs,
  showHeader = true,
  showCover = true,
  showAlbum = true,
  showDuration = true,
}: SongListProps) {
  const { currentTrack, isPlaying, setPlaylist } = usePlayer();
  const { isFavorite, toggleFavorite } = useFavorites();

  const mobileColumns = ['32px', 'minmax(0,1fr)', '48px'].join(' ');
  const desktopColumns = [
    '32px',
    'minmax(0,1fr)',
    showAlbum ? '200px' : null,
    '56px',
    showDuration ? '64px' : null,
  ]
    .filter(Boolean)
    .join(' ');

  const gridStyle = {
    '--grid-cols-mobile': mobileColumns,
    '--grid-cols-desktop': desktopColumns,
  } as CSSProperties;

  const handleSongClick = (index: number) => {
    const tracks: Track[] = songs.map((song) => ({
      id: song.id,
      name: song.name,
      artist: song.artist || '未知艺术家',
      album: song.album,
      platform: song.platform,
      cover: song.cover,
      duration: song.duration,
    }));
    setPlaylist(tracks, index);
  };

  const isCurrentSong = (song: SongListItem) =>
    currentTrack?.id === song.id && currentTrack?.platform === song.platform;

  return (
    <div className="space-y-3">
      {showHeader && (
        <div
          className="hidden items-center gap-2 pb-2 text-xs uppercase tracking-[0.18em] text-muted-foreground md:grid md:gap-3 [grid-template-columns:var(--grid-cols-mobile)] md:[grid-template-columns:var(--grid-cols-desktop)]"
          style={gridStyle}
        >
          <span>#</span>
          <span>标题</span>
          {showAlbum && <span className="hidden md:block">专辑</span>}
          <span className="text-center">收藏</span>
          {showDuration && <span className="hidden text-right md:block">时长</span>}
        </div>
      )}

      <div className="space-y-1 pt-1">
        {songs.map((song, index) => (
          <div
            key={`${song.platform}-${song.id}`}
            className={cn(
              'group grid items-center gap-2 rounded-lg border border-transparent px-2 py-2 transition hover:bg-secondary/40 hover:shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.45)] md:gap-3 md:py-2 [grid-template-columns:var(--grid-cols-mobile)] md:[grid-template-columns:var(--grid-cols-desktop)]',
              isCurrentSong(song) &&
                'bg-primary/10 shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.45)]'
            )}
            style={gridStyle}
            onDoubleClick={() => handleSongClick(index)}
          >
            <div className="flex items-center justify-center text-xs text-muted-foreground">
              {isCurrentSong(song) ? (
                isPlaying ? (
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/15 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.28)]">
                    <Volume2 size={14} />
                  </span>
                ) : (
                  <span className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.24)]">
                    {index + 1}
                  </span>
                )
              ) : (
                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-secondary/55 text-xs text-muted-foreground transition hover:bg-secondary/85 hover:text-foreground"
                  onClick={() => handleSongClick(index)}
                  aria-label={`播放 ${song.name}`}
                >
                  <span className="group-hover:hidden">{index + 1}</span>
                  <Play size={12} className="hidden group-hover:block" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {showCover && (
                <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-md bg-secondary md:h-10 md:w-10">
                  {song.cover ? (
                    <img
                      src={song.cover}
                      alt={song.name}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : (
                    <Music2 size={16} className="text-muted-foreground" />
                  )}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{song.name}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {song.artist || '未知艺术家'}
                  <span className="ml-2 inline-flex items-center gap-1 rounded-sm border border-border/60 px-1.5 py-0.5 text-[10px] uppercase">
                    <Disc3 size={10} />
                    {song.platform}
                  </span>
                </p>
              </div>
            </div>

            {showAlbum && (
              <div className="hidden truncate text-xs text-muted-foreground md:block">
                {song.album || '-'}
              </div>
            )}

            <div className="flex items-center justify-center">
              <button
                type="button"
                className={cn(
                  'flex h-8 w-8 items-center justify-center rounded-md transition hover:bg-secondary',
                  isFavorite(song.id, song.platform) && 'text-primary'
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleFavorite({
                    id: song.id,
                    name: song.name,
                    artist: song.artist || '未知艺术家',
                    album: song.album,
                    platform: song.platform,
                    cover: song.cover,
                  });
                }}
                aria-label={isFavorite(song.id, song.platform) ? '取消收藏' : '收藏'}
              >
                <Heart
                  size={16}
                  strokeWidth={1.5}
                  fill={isFavorite(song.id, song.platform) ? 'currentColor' : 'none'}
                />
              </button>
            </div>

            {showDuration && (
              <div className="hidden text-right text-xs text-muted-foreground md:block">
                {song.duration ? formatDuration(song.duration) : '-'}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
