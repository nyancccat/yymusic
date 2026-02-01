'use client';

import { SongList } from '@/components/business';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import { shuffle } from '@/lib/utils';
import { ListMusic, Music2, Play, Shuffle } from 'lucide-react';
import Link from 'next/link';

export default function QueuePage() {
  const { playlist, currentTrack, currentIndex, isPlaying, setPlaylist, togglePlay } = usePlayer();

  const upNext = playlist.slice(currentIndex + 1);

  const handleShuffle = () => {
    if (playlist.length <= 1) return;
    const shuffled = shuffle(playlist);
    setPlaylist(shuffled, 0);
  };

  const handlePlayAll = () => {
    if (playlist.length === 0) return;
    if (isPlaying) {
      togglePlay();
    } else {
      setPlaylist(playlist, 0);
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 rounded-3xl border border-border bg-card/70 p-6 md:flex-row md:items-center md:justify-between">
        <p className="text-sm text-muted-foreground">{playlist.length} 首歌曲</p>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleShuffle}>
            <Shuffle size={16} className="mr-2" />
            随机播放
          </Button>
          <Button variant="accent" onClick={handlePlayAll}>
            <Play size={16} className="mr-2" />
            {isPlaying ? '暂停' : '播放'}
          </Button>
        </div>
      </header>

      {currentTrack && (
        <div className="flex items-center gap-4 rounded-3xl border border-border bg-card/70 p-4">
          <div className="flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-secondary">
            {currentTrack.cover ? (
              <img
                src={currentTrack.cover}
                alt={currentTrack.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Music2 size={24} className="text-muted-foreground" />
            )}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{currentTrack.name}</p>
            <p className="truncate text-xs text-muted-foreground">{currentTrack.artist}</p>
          </div>
        </div>
      )}

      {playlist.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card/70 p-10 text-center text-muted-foreground">
          <ListMusic size={40} />
          <p className="text-sm">播放列表为空</p>
          <p className="text-xs">从搜索或排行榜中添加歌曲</p>
          <Button variant="outline" asChild>
            <Link href="/search">去搜索</Link>
          </Button>
        </div>
      ) : upNext.length > 0 ? (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">接下来播放</h2>
          <SongList
            songs={upNext.map((track) => ({
              id: track.id,
              name: track.name,
              artist: track.artist,
              album: track.album,
              platform: track.platform,
              cover: track.cover,
            }))}
            showAlbum={false}
          />
        </div>
      ) : null}
    </div>
  );
}
