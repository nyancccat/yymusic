'use client';

import { SongList } from '@/components/business';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/context/FavoritesContext';
import { Heart } from 'lucide-react';
import Link from 'next/link';

export default function FavoritesPage() {
  const { favorites } = useFavorites();

  const songs = favorites.map((track) => ({
    id: track.id,
    name: track.name,
    artist: track.artist,
    album: track.album,
    platform: track.platform,
    cover: track.cover,
  }));

  return (
    <div className="space-y-6">
      {favorites.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card/70 p-10 text-center text-muted-foreground">
          <Heart size={40} />
          <p className="text-sm">暂无收藏</p>
          <p className="text-xs">点击歌曲旁边的 ♡ 按钮将歌曲添加到收藏</p>
          <Button variant="outline" asChild>
            <Link href="/search">去搜索歌曲</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-xs text-muted-foreground">{favorites.length} 首收藏歌曲</p>
          <SongList songs={songs} showAlbum />
        </div>
      )}
    </div>
  );
}
