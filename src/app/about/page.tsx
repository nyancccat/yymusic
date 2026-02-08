'use client';

import { cn } from '@/lib/utils';
import {
  Braces,
  Cloud,
  Code2,
  LayoutGrid,
  type LucideIcon,
  Package,
  Sparkles,
  Wind,
  Wrench,
} from 'lucide-react';
import { useState } from 'react';

const APP_VERSION = '0.1.93';
const SI_BASE = 'https://cdn.simpleicons.org';

const si = (slug: string, color: string) => `${SI_BASE}/${slug}/${color}`;

interface TechLogo {
  light: string;
  dark?: string;
}

interface TechItem {
  name: string;
  detail: string;
  badge: string;
  fallbackIcon: LucideIcon;
  logo: TechLogo;
}

const TECH_STACK: TechItem[] = [
  {
    name: 'Next.js 16',
    detail: 'App Router 架构，页面与布局组织清晰。',
    badge: 'Framework',
    fallbackIcon: LayoutGrid,
    logo: {
      light: si('nextdotjs', '111111'),
      dark: si('nextdotjs', 'ffffff'),
    },
  },
  {
    name: 'React 19',
    detail: '组件化开发，交互状态在上下文中统一管理。',
    badge: 'UI Runtime',
    fallbackIcon: Sparkles,
    logo: {
      light: si('react', '61DAFB'),
    },
  },
  {
    name: 'TypeScript',
    detail: '类型约束提升稳定性与可维护性。',
    badge: 'Language',
    fallbackIcon: Braces,
    logo: {
      light: si('typescript', '3178C6'),
    },
  },
  {
    name: 'Tailwind CSS',
    detail: '原子化样式体系，便于统一视觉规范。',
    badge: 'Styling',
    fallbackIcon: Wind,
    logo: {
      light: si('tailwindcss', '06B6D4'),
    },
  },
  {
    name: 'Radix UI + shadcn/ui',
    detail: '基础交互组件可靠，支持一致的状态反馈。',
    badge: 'Component',
    fallbackIcon: Code2,
    logo: {
      light: si('radixui', '161618'),
      dark: si('radixui', 'ffffff'),
    },
  },
  {
    name: 'Lucide Icons',
    detail: '图标语言统一，细节表达更完整。',
    badge: 'Iconography',
    fallbackIcon: Package,
    logo: {
      light: si('lucide', '111827'),
      dark: si('lucide', 'ffffff'),
    },
  },
];

const TOOLING: TechItem[] = [
  {
    name: 'VS Code',
    detail: '主要开发编辑器，用于代码编写与调试。',
    badge: 'Editor',
    fallbackIcon: Code2,
    logo: {
      light: si('visualstudiocode', '007ACC'),
    },
  },
  {
    name: 'Warp',
    detail: '现代终端工具，用于本地命令行工作流。',
    badge: 'Terminal',
    fallbackIcon: Code2,
    logo: {
      light: si('warp', '01A4FF'),
    },
  },
  {
    name: 'pnpm',
    detail: '依赖与脚本管理，安装与构建效率高。',
    badge: 'Package',
    fallbackIcon: Package,
    logo: {
      light: si('pnpm', 'F69220'),
    },
  },
  {
    name: 'Biome',
    detail: '格式化与静态检查，保证代码风格统一。',
    badge: 'Lint/Format',
    fallbackIcon: Wrench,
    logo: {
      light: si('biome', '60A5FA'),
    },
  },
  {
    name: 'OpenNext',
    detail: 'Next.js 到 Cloudflare 的构建与适配。',
    badge: 'Build',
    fallbackIcon: Cloud,
    logo: {
      light: '/tech-icons/opennext.svg',
    },
  },
  {
    name: 'Wrangler',
    detail: 'Cloudflare Workers 的预览与部署工具。',
    badge: 'Deploy',
    fallbackIcon: Cloud,
    logo: {
      light: si('cloudflare', 'F38020'),
    },
  },
];

function BrandIcon({ item }: { item: TechItem }) {
  const [failed, setFailed] = useState(false);
  const FallbackIcon = item.fallbackIcon;

  if (failed) {
    return <FallbackIcon size={17} className="text-primary" />;
  }

  return (
    <>
      <img
        src={item.logo.light}
        alt={`${item.name} logo`}
        className={cn('h-5 w-5 object-contain', item.logo.dark && 'dark:hidden')}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
      {item.logo.dark && (
        <img
          src={item.logo.dark}
          alt={`${item.name} logo`}
          className="hidden h-5 w-5 object-contain dark:block"
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </>
  );
}

function TechGrid({ title, items }: { title: string; items: TechItem[] }) {
  return (
    <section className="rounded-2xl border border-border/80 bg-card/88 p-4 md:p-5">
      <div className="mb-4 flex items-center justify-between border-b border-border/50 pb-3">
        <h2 className="text-[13px] font-semibold tracking-[0.12em] text-foreground/95 md:text-sm">
          {title}
        </h2>
        <span className="rounded-full border border-border/60 bg-background/75 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground/90">
          {items.length} 项
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.name}
            className="group rounded-xl border border-border/70 bg-background/75 p-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/35 hover:bg-background/95 hover:shadow-[0_8px_24px_hsl(var(--foreground)/0.06),inset_0_0_0_1px_hsl(var(--primary)/0.24)]"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-border/55 bg-gradient-to-b from-primary/14 to-primary/8">
                <BrandIcon item={item} />
              </div>
              <span className="rounded-full border border-border/60 bg-card/90 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                {item.badge}
              </span>
            </div>
            <h3 className="mt-3 text-sm font-semibold leading-5 text-foreground">{item.name}</h3>
            <p className="mt-1.5 text-[12px] leading-[1.65] text-muted-foreground">{item.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <div className="space-y-5 md:space-y-6">
      <section className="rounded-2xl border border-border/80 bg-card/90 p-5 md:p-7">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <img src="/logo.svg" alt="Logo" className="h-7 w-7" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-[0.01em] md:text-[28px]">余韵音乐</h1>
              <p className="mt-1 text-xs tracking-[0.08em] text-muted-foreground">
                当前版本 v{APP_VERSION}
              </p>
            </div>
          </div>
        </div>

        <p className="mt-4 max-w-full truncate text-sm text-muted-foreground md:text-[15px]">
          留白有序，旋律有光；每一次播放，都是情绪的优雅落位。
        </p>
      </section>

      <TechGrid title="技术栈" items={TECH_STACK} />
      <TechGrid title="工程工具" items={TOOLING} />
    </div>
  );
}
