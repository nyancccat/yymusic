'use client';

import { SongList } from '@/components/business';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { aggregateSearch } from '@/lib/api';
import type { SearchResult } from '@/lib/types';
import { debounce } from '@/lib/utils';
import { Loader2, Music2, Search as SearchIcon } from 'lucide-react';
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
      <div className="sticky top-0 z-20 -mx-4 bg-background/90 px-4 pt-2 pb-4 backdrop-blur md:static md:mx-0 md:bg-transparent md:px-0 md:pt-0 md:pb-0 md:backdrop-blur-0">
        <div className="flex flex-col gap-4 rounded-3xl border border-border bg-card/70 p-5 md:p-6">
          <div className="relative">
            <SearchIcon
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              size={18}
            />
            <Input
              type="text"
              className="pl-10"
              placeholder="搜索歌曲、艺人、专辑"
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
        <div className="flex flex-col items-center gap-3 rounded-3xl border border-border bg-card/70 p-10 text-center text-muted-foreground">
          <Music2 size={40} />
          <p className="text-sm">未找到相关结果</p>
          <p className="text-xs">试试其他关键词？</p>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">搜索结果</h3>
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
        <div className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-card/70 p-10 text-center text-muted-foreground">
          <Music2 size={40} />
          <p className="text-sm">输入关键词开始搜索</p>
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
