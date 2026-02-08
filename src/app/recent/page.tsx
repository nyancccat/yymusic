'use client';

import { SongList } from '@/components/business';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import { Clock3, Eraser } from 'lucide-react';

export default function RecentPage() {
  const { playlist, clearQueue } = usePlayer();

  const recentSongs = playlist.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artist,
    album: track.album,
    platform: track.platform,
    cover: track.cover,
  }));

  return (
    <div className="space-y-6 pt-1 md:pt-0">
      {recentSongs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/90 p-6 text-center text-muted-foreground md:p-10">
          <Clock3 size={40} />
          <p className="text-sm">最近播放还是空白</p>
          <p className="text-xs">当你按下播放，这里会留下一条条回声。</p>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">刚刚听过的旋律，都会在这里短暂停留。</p>
          <SongList songs={recentSongs} showAlbum showDuration={false} />
          <Button variant="outline" onClick={clearQueue}>
            <Eraser size={14} className="mr-2" />
            清空回声
          </Button>
        </div>
      )}
    </div>
  );
}
