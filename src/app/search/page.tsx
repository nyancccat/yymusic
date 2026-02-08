'use client';

import { SongList } from '@/components/business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { aggregateSearch } from '@/lib/api';
import type { SearchResult } from '@/lib/types';
import { debounce } from '@/lib/utils';
import { Compass, Loader2, Music2, Search as SearchIcon, Sparkles } from 'lucide-react';
import { useCallback, useState } from 'react';

const SUGGESTIONS = ['周杰伦', '林俊杰', '邓紫棋', '薛之谦', 'Taylor Swift'];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const performSearch = useCallback(
    debounce(async (keyword: string) => {
      if (!keyword.trim()) {
        setResults([]);
        setSearched(false);
        return;
      }

      setLoading(true);
      setSearched(true);

      try {
        const data = await aggregateSearch(keyword);
        setResults(data.results || []);
      } catch (err) {
        console.error('Search failed:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    }, 500),
    []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    performSearch(value);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    performSearch(suggestion);
  };

  return (
    <div className="space-y-6">
      <div className="sticky top-0 z-20 -mx-3 bg-background/90 px-3 pb-3 pt-2 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:pb-0 md:pt-0 md:backdrop-blur-0">
        <div className="flex flex-col gap-3 rounded-xl border border-border/70 bg-card/90 p-5 md:p-6">
          <p className="flex items-center gap-1.5 text-xs uppercase tracking-[0.22em] text-muted-foreground">
            <Compass size={13} className="text-primary" />
            搜索旅程
          </p>
          <div className="relative">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              type="text"
              className="pl-10"
              placeholder="写下歌名、歌手或专辑"
              value={query}
              onChange={handleInputChange}
              inputMode="search"
              enterKeyHint="search"
            />
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          <Loader2 size={32} className="animate-spin" />
        </div>
      ) : searched && results.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-card/90 p-6 text-center text-muted-foreground md:p-10">
          <Music2 size={40} />
          <p className="text-sm">这次没有遇见结果</p>
          <p className="text-xs">换个关键词，再敲一次回车吧。</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <Sparkles size={16} className="text-primary" />
              搜索结果
            </h3>
            <span className="text-xs text-muted-foreground">{results.length} 首歌曲</span>
          </div>
          <SongList
            songs={results.map((r) => ({
              id: r.id,
              name: r.name,
              artist: r.artist,
              album: r.album,
              platform: r.platform,
            }))}
            showCover
            showAlbum
            showDuration={false}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-border bg-card/90 p-6 text-center text-muted-foreground md:p-10">
          <Music2 size={40} />
          <p className="text-sm">让我们从一句歌名开始。</p>
          <div className="flex flex-wrap justify-center gap-2">
            {SUGGESTIONS.map((s) => (
              <Button key={s} variant="outline" size="sm" onClick={() => handleSuggestionClick(s)}>
                {s}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
