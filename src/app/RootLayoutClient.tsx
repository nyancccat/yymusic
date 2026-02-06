'use client';

import './globals.css';
import {
  FullScreenPlayer,
  MobileNav,
  PlayerBar,
  RightPanel,
  Sidebar,
  TopBar,
} from '@/components/layout';
import { FavoritesProvider } from '@/context/FavoritesContext';
import { LyricsProvider, useLyrics } from '@/context/LyricsContext';
import { PlayerProvider } from '@/context/PlayerContext';
import { ThemeProvider } from '@/context/ThemeContext';
import { ChevronLeft } from 'lucide-react';

function AppContent({ children }: { children: React.ReactNode }) {
  const { showLyrics, showFullScreen, setShowFullScreen, setShowLyrics } = useLyrics();

  return (
    <div className="relative flex h-screen h-[100dvh] w-screen overflow-hidden bg-background text-foreground">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />
        <div className="flex min-h-0 flex-1">
          <main className="relative flex-1 overflow-y-auto px-4 pb-[calc(var(--bottom-space)+env(safe-area-inset-bottom))] pt-4 md:px-8 md:pt-6">
            <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-primary/15 via-transparent to-transparent md:h-40" />
            <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />
            <div className="relative">{children}</div>
          </main>
          {showLyrics && <RightPanel />}
        </div>
      </div>
      <PlayerBar />
      <MobileNav />
      {!showLyrics && (
        <button
          type="button"
          className="absolute right-0 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-l-full border border-border bg-card/90 text-primary shadow-glow transition hover:bg-card lg:flex"
          onClick={() => setShowLyrics(true)}
          aria-label="显示正在播放面板"
        >
          <ChevronLeft size={18} />
        </button>
      )}
      {showFullScreen && <FullScreenPlayer onClose={() => setShowFullScreen(false)} />}
    </div>
  );
}

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider>
      <PlayerProvider>
        <FavoritesProvider>
          <LyricsProvider>
            <AppContent>{children}</AppContent>
          </LyricsProvider>
        </FavoritesProvider>
      </PlayerProvider>
    </ThemeProvider>
  );
}
