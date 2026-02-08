'use client';

import { Braces, Code2, Heart, LayoutGrid, ShieldCheck, Sparkles, Wind } from 'lucide-react';

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
      <section className="rounded-xl border border-border bg-card/90 p-6 text-center md:p-8">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
        </div>
        <h1 className="mt-4 text-2xl font-semibold">余韵音乐</h1>
        <p className="mt-2 text-sm text-muted-foreground">Version {APP_VERSION}</p>
        <p className="mt-3 text-sm text-muted-foreground">愿每一次按下播放，都恰好对上你的情绪。</p>
      </section>

      <div className="grid gap-4 md:grid-cols-3">
        <section className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/90 p-6 text-center">
          <ShieldCheck
            size={150}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/10"
          />
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <ShieldCheck size={18} className="text-primary" />
            服务状态
          </div>
          <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-2 text-xs text-muted-foreground">
            <div className="text-sm font-medium text-foreground">稳稳在线</div>
            <p>响应顺滑 · 延迟轻盈</p>
            <p>可随时开唱</p>
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card/90 p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-sm font-semibold">
            <Code2 size={18} className="text-primary" />
            技术骨架
          </div>
          <div className="mt-5 grid grid-cols-2 gap-4 text-xs">
            {STACK.map((item) => {
              const Icon = item.icon;
              return (
                <span
                  key={item.label}
                  className="flex aspect-square w-full flex-col items-center justify-center gap-2 rounded-md border border-border/60 bg-background/50 font-medium"
                >
                  <Icon size={16} className="text-primary" />
                  {item.label}
                </span>
              );
            })}
          </div>
        </section>

        <section className="relative flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card/90 p-6 text-center text-xs text-muted-foreground">
          <Heart
            size={140}
            className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-primary/10"
            fill="currentColor"
          />
          <div className="flex items-center justify-center gap-2 text-sm font-semibold text-foreground">
            <Sparkles size={18} className="text-primary" />
            写给热爱音乐的人
          </div>
          <div className="mt-4 flex flex-1 flex-col items-center justify-center gap-3">
            <div className="text-sm font-medium text-foreground">Made with yyMusic</div>
            <p className="text-xs text-muted-foreground">谢谢你，让每个夜晚都更有光。</p>
          </div>
        </section>
      </div>
    </div>
  );
}
