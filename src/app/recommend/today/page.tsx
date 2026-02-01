'use client';

import { SongList } from '@/components/business';
import { Button } from '@/components/ui/button';
import { getTopLists, getTopListSongs } from '@/lib/api';
import type { MusicPlatform, Track } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

const PLATFORMS: { id: MusicPlatform; name: string }[] = [
  { id: 'netease', name: '网易云音乐' },
  { id: 'qq', name: 'QQ音乐' },
];

export default function RecommendTodayPage() {
  const [songs, setSongs] = useState<Track[]>([]);
  const [sourceName, setSourceName] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);

    async function loadOnce() {
      const listsByPlatform = await Promise.all(
        PLATFORMS.map(async (platform) => {
          const data = await getTopLists(platform.id);
          const lists = data.list || [];
          const preferred =
            lists.find((list) => /热歌|热曲|热榜|飙升|新歌/.test(list.name)) || lists[0];
          return { platform, preferred };
        })
      );

      const validLists = listsByPlatform.filter((item) => item.preferred);
      if (validLists.length === 0) {
        throw new Error('no list');
      }

      const songsByPlatform = await Promise.all(
        validLists.map(async ({ platform, preferred }) => {
          const songsRes = await getTopListSongs(preferred!.id, platform.id);
          return {
            platform,
            listName: preferred!.name,
            songs: songsRes.list,
          };
        })
      );

      const sourceLabel = songsByPlatform
        .map((item) => `${item.platform.name}·${item.listName}`)
        .join(' / ');

      const seen = new Set<string>();
      const merged: Track[] = [];
      for (const item of songsByPlatform) {
        for (const song of item.songs) {
          const artist = song.artist || '未知艺术家';
          const key = `${song.name}__${artist}`.toLowerCase();
          if (seen.has(key)) continue;
          seen.add(key);
          merged.push({
            id: song.id,
            name: song.name,
            artist,
            platform: item.platform.id,
          });
          if (merged.length >= 12) break;
        }
        if (merged.length >= 12) break;
      }

      if (merged.length === 0) {
        throw new Error('empty songs');
      }

      return { songs: merged, sourceLabel };
    }

    try {
      let result: { songs: Track[]; sourceLabel: string } | null = null;
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          result = await loadOnce();
          break;
        } catch (err) {
          if (attempt === 0) {
            await new Promise((resolve) => setTimeout(resolve, 600));
            continue;
          }
          throw err;
        }
      }

      if (!result) {
        throw new Error('empty result');
      }

      setSourceName(result.sourceLabel);
      setSongs(result.songs);
    } catch (err) {
      setSongs([]);
      setSourceName('');
      setError('加载推荐歌曲失败，请稍后重试');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          来源 · {sourceName || '网易云音乐 / QQ音乐'}
        </p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : error ? (
        <div className="rounded-3xl border border-border bg-card/70 p-6 text-center text-sm text-muted-foreground">
          <p>{error}</p>
          <Button variant="outline" className="mt-4" onClick={fetchRecommendations}>
            重试
          </Button>
        </div>
      ) : (
        <SongList
          songs={songs}
          showAlbum={false}
          showDuration={false}
        />
      )}
    </div>
  );
}
