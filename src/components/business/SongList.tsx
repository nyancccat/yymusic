'use client';

import { useFavorites } from '@/context/FavoritesContext';
import { usePlayer } from '@/context/PlayerContext';
import type { MusicPlatform, Track } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Heart, Music2, Play, Volume2 } from 'lucide-react';

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

  const gridTemplateColumns = [
    '32px',
    'minmax(0,1fr)',
    showAlbum ? '200px' : null,
    '56px',
    showDuration ? '64px' : null,
  ]
    .filter(Boolean)
    .join(' ');

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
    <div className="space-y-2">
      {showHeader && (
        <div
          className="grid items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground md:gap-3"
          style={{ gridTemplateColumns }}
        >
          <span>#</span>
          <span>标题</span>
          {showAlbum && <span>专辑</span>}
          <span className="text-center">收藏</span>
          {showDuration && <span className="text-right">时长</span>}
        </div>
      )}

      {songs.map((song, index) => (
        <div
          key={`${song.platform}-${song.id}`}
          className={cn(
            'group grid items-center gap-2 rounded-xl border border-transparent px-2 py-3 transition hover:border-primary/60 hover:bg-secondary/40 md:gap-3 md:py-2',
            isCurrentSong(song) && 'border-primary/60 bg-secondary/60'
          )}
          style={{ gridTemplateColumns }}
        >
          <div className="flex items-center justify-center text-xs text-muted-foreground">
            {isCurrentSong(song) && isPlaying ? (
              <Volume2 size={14} className="text-primary" />
            ) : (
              <button
                type="button"
                className="flex h-7 w-7 items-center justify-center rounded-full border border-border/60 text-xs text-muted-foreground transition hover:bg-secondary hover:text-foreground"
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
              <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-secondary md:h-10 md:w-10">
                {song.cover ? (
                  <img src={song.cover} alt={song.name} className="h-full w-full object-cover" />
                ) : (
                  <Music2 size={16} className="text-muted-foreground" />
                )}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{song.name}</p>
              <p className="truncate text-xs text-muted-foreground">
                {song.artist || '未知艺术家'}
                <span className="ml-2 rounded-full border border-border/60 px-2 py-0.5 text-[10px] uppercase">
                  {song.platform}
                </span>
              </p>
            </div>
          </div>

          {showAlbum && (
            <div className="truncate text-xs text-muted-foreground">{song.album || '-'}</div>
          )}

          <div className="flex items-center justify-center">
            <button
              type="button"
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full transition hover:bg-secondary',
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
            <div className="text-right text-xs text-muted-foreground">
              {song.duration ? formatDuration(song.duration) : '-'}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
