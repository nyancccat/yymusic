'use client';

import { getSystemStatus } from '@/lib/api';
import type { SystemStatus } from '@/lib/types';
import { Activity, Code2, Github, Heart, LayoutGrid, Braces, Wind, Sparkles } from 'lucide-react';
import { useEffect, useState } from 'react';

const STACK = [
  { label: 'Next.js', icon: LayoutGrid },
  { label: 'TypeScript', icon: Braces },
  { label: 'Tailwind CSS', icon: Wind },
  { label: 'shadcn/ui', icon: Sparkles },
];

export default function AboutPage() {
  const [status, setStatus] = useState<SystemStatus | null>(null);

  useEffect(() => {
    getSystemStatus().then(setStatus).catch(console.error);
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-border bg-card/70 p-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">余韵音乐</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Version 0.1.12（疯狂迭代修 bug 中）
          {status && (
            <span className="ml-2 text-xs text-muted-foreground">
              • Based on TuneHub API v{status.version}
            </span>
          )}
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          一个极简、优雅的在线音乐播放器。专注于纯粹的听歌体验，为您带来身临其境的视听享受。
        </p>
      </section>

      {status && (
        <section className="rounded-3xl border border-border bg-card/70 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Activity size={18} className="text-primary" />
            服务状态
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
              <p className="text-xs text-muted-foreground">运行状态</p>
              <p className="mt-2 flex items-center gap-2 text-sm">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                {status.status}
              </p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
              <p className="text-xs text-muted-foreground">已运行</p>
              <p className="mt-2 text-sm font-semibold">{Math.floor(status.uptime / 3600)} 小时</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-background/60 p-4">
              <p className="text-xs text-muted-foreground">支持平台</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs">
                {status.platforms
                  .filter((platform) => platform.enabled)
                  .map((platform) => (
                    <span
                      key={platform.name}
                      className="rounded-full border border-border/60 px-2 py-1"
                    >
                      {platform.name}
                    </span>
                  ))}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-3xl border border-border bg-card/70 p-6 text-center">
        <div className="flex items-center justify-center gap-2 text-sm font-semibold">
          <Code2 size={18} className="text-primary" />
          技术栈
        </div>
        <div className="mt-6 grid w-full max-w-xl grid-cols-2 gap-7 text-sm sm:grid-cols-4 mx-auto">
          {STACK.map((item) => {
            const Icon = item.icon;
            return (
              <span
                key={item.label}
                className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/50 text-xs font-medium"
              >
                <Icon size={16} className="text-primary" />
                {item.label}
              </span>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-border bg-card/70 p-6 text-center text-xs text-muted-foreground">
        <p className="flex flex-wrap items-center justify-center gap-1">
          Made with
          <Heart size={12} fill="currentColor" className="text-primary" />
          yyMusic
        </p>
      </section>
    </div>
  );
}
