'use client';

import { SongList } from '@/components/business';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import { getTopListSongs } from '@/lib/api';
import type { MusicPlatform, PlaylistSong, Track } from '@/lib/types';
import { ChevronLeft, Loader2, Music2, Play } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

interface TopListPageProps {
  params: Promise<{
    platform: MusicPlatform;
    id: string;
  }>;
}

export default function TopListPage({ params }: TopListPageProps) {
  const { platform, id } = use(params);
  const { setPlaylist } = usePlayer();

  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSongs() {
      setLoading(true);
      setError(null);
      try {
        const data = await getTopListSongs(id, platform);
        setSongs(data.list || []);
      } catch (err) {
        setError('加载歌曲列表失败');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchSongs();
  }, [id, platform]);

  const handlePlayAll = () => {
    if (songs.length === 0) return;
    const tracks: Track[] = songs.map((song) => ({
      id: song.id,
      name: song.name,
      artist: song.artist || '未知艺术家',
      platform,
    }));
    setPlaylist(tracks, 0);
  };

  const platformNames: Record<MusicPlatform, string> = {
    netease: '网易云音乐',
    qq: 'QQ音乐',
    kugou: '酷狗音乐',
    kuwo: '酷我音乐',
    migu: '咪咕音乐',
  };

  return (
    <div className="space-y-6">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ChevronLeft size={16} />
        返回
      </Link>

      <header className="flex flex-col gap-4 rounded-3xl border border-border bg-card/70 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary text-muted-foreground">
            <Music2 size={32} />
          </div>
          <div>
            <h1 className="text-2xl font-semibold">{platformNames[platform]}热榜</h1>
            <p className="text-sm text-muted-foreground">
              {platformNames[platform]} • {songs.length} 首歌曲
            </p>
          </div>
        </div>
        <Button variant="accent" onClick={handlePlayAll} disabled={songs.length === 0}>
          <Play size={16} className="mr-2" />
          播放全部
        </Button>
      </header>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-border bg-card/70 p-6 text-center text-sm text-muted-foreground">
          {error}
        </div>
      ) : (
        <SongList
          songs={songs.map((song) => ({
            id: song.id,
            name: song.name,
            artist: song.artist,
            platform,
          }))}
          showAlbum={false}
        />
      )}
    </div>
  );
}
