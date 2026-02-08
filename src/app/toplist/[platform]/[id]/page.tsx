'use client';

import { SongList } from '@/components/business';
import { Button } from '@/components/ui/button';
import { usePlayer } from '@/context/PlayerContext';
import { getTopListSongs } from '@/lib/api';
import type { MusicPlatform, PlaylistSong, Track } from '@/lib/types';
import { storage } from '@/lib/utils';
import { ChevronLeft, Disc3, Loader2, Music2, Play, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { use, useEffect, useState } from 'react';

interface TopListPageProps {
  params: Promise<{
    platform: MusicPlatform;
    id: string;
  }>;
}

const TOPLIST_SONGS_CACHE_PREFIX = 'toplist_songs_cache:';
const TOPLIST_TIMEOUT_MS = 10_000;

type TopListSongsCache = {
  list: PlaylistSong[];
  ts: number;
};

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Timeout')), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((error) => {
        clearTimeout(timer);
        reject(error);
      });
  });
}

export default function TopListPage({ params }: TopListPageProps) {
  const { platform, id } = use(params);
  const { setPlaylist } = usePlayer();

  const [songs, setSongs] = useState<PlaylistSong[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const cacheKey = `${TOPLIST_SONGS_CACHE_PREFIX}${platform}:${id}`;
    const cached = storage.get<TopListSongsCache | null>(cacheKey, null);
    if (cached?.list?.length) {
      setSongs(cached.list);
      setLoading(false);
    } else {
      setSongs([]);
      setLoading(true);
    }

    async function fetchSongs() {
      setError(null);
      try {
        const data = await withTimeout(getTopListSongs(id, platform), TOPLIST_TIMEOUT_MS);
        let list = data.list || [];
        if (list.length === 0) {
          const retry = await withTimeout(getTopListSongs(id, platform), TOPLIST_TIMEOUT_MS);
          list = retry.list || [];
        }

        if (list.length === 0) {
          throw new Error('Empty toplist songs');
        }

        if (cancelled) return;
        setSongs(list);
        storage.set(cacheKey, { list, ts: Date.now() });
      } catch (err) {
        console.error(err);
        if (cancelled) return;
        if (!cached?.list?.length) {
          setError('榜单暂时失联，请稍后再来。');
        } else {
          setError('网络摇晃，先展示缓存内容。');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSongs();
    return () => {
      cancelled = true;
    };
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
        返回首页
      </Link>

      <header className="flex flex-col gap-4 rounded-xl border border-border bg-card/90 p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-md bg-secondary text-muted-foreground">
            <Music2 size={32} />
          </div>
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold">
              <Sparkles size={18} className="text-primary" />
              {platformNames[platform]} 热榜
            </h1>
            <p className="text-sm text-muted-foreground">
              {platformNames[platform]} · {songs.length} 首歌
            </p>
          </div>
        </div>
        <Button variant="accent" onClick={handlePlayAll} disabled={songs.length === 0}>
          <Play size={16} className="mr-2" />
          从第一首开始
        </Button>
      </header>

      {loading && songs.length === 0 ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : null}

      {error && songs.length === 0 ? (
        <div className="rounded-xl border border-border bg-card/90 p-6 text-center text-sm text-muted-foreground">
          {error}
        </div>
      ) : null}

      {songs.length > 0 ? (
        <div className="space-y-3">
          {error && <p className="text-xs text-muted-foreground">{error}</p>}
          <p className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <Disc3 size={13} className="text-primary" />
            双击任意一行可立即播放
          </p>
          <SongList
            songs={songs.map((song) => ({
              id: song.id,
              name: song.name,
              artist: song.artist,
              platform,
            }))}
            showAlbum={false}
          />
        </div>
      ) : null}
    </div>
  );
}
