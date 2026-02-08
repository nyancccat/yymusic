'use client';

import { SongList } from '@/components/business';
import { Button } from '@/components/ui/button';
import { useFavorites } from '@/context/FavoritesContext';
import { Heart, Sparkles } from 'lucide-react';
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
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/90 p-6 text-center text-muted-foreground md:p-10">
          <Heart size={40} />
          <p className="text-sm">你的收藏夹还空着</p>
          <p className="text-xs">遇见心动旋律时，点一下爱心就好。</p>
          <Button variant="outline" asChild>
            <Link href="/search">去找一首歌</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Sparkles size={14} className="text-primary" />
            共收藏 {favorites.length} 首喜欢的歌
          </p>
          <SongList songs={songs} showAlbum />
        </div>
      )}
    </div>
  );
}
