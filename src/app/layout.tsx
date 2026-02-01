import type { Metadata } from 'next';
import { Noto_Sans_SC, Space_Grotesk } from 'next/font/google';
import RootLayoutClient from './RootLayoutClient';

const notoSans = Noto_Sans_SC({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: '余韵音乐 (yyMusic) - 极简、优雅的在线音乐播放器',
    template: '%s | 余韵音乐 (yyMusic)',
  },
  description:
    '余韵音乐 (yyMusic) 是一款现代化在线音乐播放器，拥有极简的 Apple Music 交互风格。支持多平台搜索、实时歌词显示、沉浸式播放体验，为您带来身临其境的视听享受。',
  keywords: [
    '余韵音乐',
    'yyMusic',
    '在线音乐播放器',
    'Apple Music 风格',
    '网页音乐播放器',
    '免费音乐',
    '无损音乐',
    '音乐搜索',
    '实时歌词',
  ],
  authors: [{ name: 'QingJ' }],
  creator: 'QingJ',
  publisher: 'QingJ',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'zh_CN',
    url: 'https://music.byebug.cn',
    title: '余韵音乐 (yyMusic) - 极简、优雅的在线音乐播放器',
    description: '一个沉浸式在线音乐播放器，支持全网搜索与实时歌词。',
    siteName: '余韵音乐 (yyMusic)',
    images: [
      {
        url: 'https://music.byebug.cn/logo.svg',
        width: 120,
        height: 120,
        alt: 'yyMusic Logo',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '余韵音乐 (yyMusic) - 极简、优雅的在线音乐播放器',
    description: '一个仿 Apple Music 风格的沉浸式在线音乐播放器，支持全网搜索与实时歌词。',
    images: ['https://music.byebug.cn/logo.svg'],
  },
  icons: {
    icon: '/logo.svg',
    shortcut: '/logo.svg',
    apple: '/logo.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${notoSans.variable} ${spaceGrotesk.variable}`}>
      <body className="min-h-screen bg-background text-foreground">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
