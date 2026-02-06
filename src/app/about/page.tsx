'use client';

import { Code2, Heart, LayoutGrid, Braces, Wind, Sparkles, ShieldCheck } from 'lucide-react';

const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0';

const STACK = [
  { label: 'Next.js', icon: LayoutGrid },
  { label: 'TypeScript', icon: Braces },
  { label: 'Tailwind CSS', icon: Wind },
  { label: 'shadcn/ui', icon: Sparkles },
];

export default function AboutPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-border bg-card/70 p-7 text-center md:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-glow">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">余韵音乐</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Version {APP_VERSION}（疯狂迭代修 bug 中）
        </p>
        <p className="mt-3 text-sm text-muted-foreground">
          轻声入耳，余韵常在。
        </p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/70 p-6 text-center">
          <ShieldCheck
            size={150}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/10"
          />
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <ShieldCheck size={18} className="text-primary" />
            服务状态
          </div>
          <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="text-sm font-medium text-foreground">运行十分健康</div>
            <p>响应稳定 · 低延迟</p>
            <p>服务状态 · 满格</p>
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

        <section className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-card/70 p-6 text-center text-xs text-muted-foreground">
          <Heart
            size={140}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/10"
            fill="currentColor"
          />
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles size={18} className="text-primary" />
            为你而作
          </div>
          <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-3">
            <div className="text-sm font-medium text-foreground">Made with yyMusic</div>
            <p className="text-xs text-muted-foreground">谢谢你，让音乐更有温度。</p>
          </div>
        </section>
      </div>
    </div>
  );
}
