'use client';

import { SongList } from '@/components/business';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import { Clock } from 'lucide-react';

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
    <div className="space-y-6">
      {recentSongs.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card/70 p-10 text-center text-muted-foreground">
          <Clock size={40} />
          <p className="text-sm">暂无播放记录</p>
          <p className="text-xs">开始播放歌曲后，它们将显示在这里</p>
        </div>
      ) : (
        <div className="space-y-4">
          <SongList songs={recentSongs} showAlbum showDuration={false} />
          <Button variant="outline" onClick={clearQueue}>
            清空播放记录
          </Button>
        </div>
      )}
    </div>
  );
}
