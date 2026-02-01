'use client';

import { getSystemStatus } from '@/lib/api';
import type { SystemStatus } from '@/lib/types';
import { Activity, Code2, Heart, LayoutGrid, Braces, Wind, Sparkles } from 'lucide-react';
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
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card/70 p-7 text-center md:p-8">
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
        <p className="mt-3 text-sm text-muted-foreground">
          极简、优雅的在线音乐播放器，专注于纯粹的听歌体验。
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="rounded-3xl border border-border bg-card/70 p-6">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Activity size={18} className="text-primary" />
            服务状态
          </div>
          <div className="mt-4 space-y-3 text-sm text-muted-foreground">
            {status ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {status.status}
                </div>
                <p>已运行 {Math.floor(status.uptime / 3600)} 小时</p>
                <p>
                  支持 {status.platforms.filter((platform) => platform.enabled).length} 个平台
                </p>
              </>
            ) : (
              <>
                <p>状态加载中…</p>
                <p>正在获取服务信息</p>
              </>
            )}
          </div>
        </section>

        <section className="rounded-3xl border border-border bg-card/70 p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <Code2 size={18} className="text-primary" />
            技术栈
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
            {STACK.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-2xl border border-border/60 bg-background/50 font-medium"
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
          <p className="mt-2 text-xs text-muted-foreground">感谢每一位正在使用它的你</p>
        </section>
      </div>
    </div>
  );
}
