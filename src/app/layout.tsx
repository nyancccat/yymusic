import type { Metadata } from 'next';
import RootLayoutClient from './RootLayoutClient';

export const metadata: Metadata = {
  title: {
    default: '余韵音乐',
    template: '%s · 余韵音乐',
  },
  description: '轻声入耳，余韵常在。',
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
    title: '余韵音乐',
    description: '轻声入耳，余韵常在。',
    siteName: '余韵音乐',
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
    title: '余韵音乐',
    description: '轻声入耳，余韵常在。',
    images: ['https://music.byebug.cn/logo.svg'],
  },
  icons: {
    icon: '/favicon.svg',
    shortcut: '/favicon.svg',
    apple: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-background text-foreground">
        <RootLayoutClient>{children}</RootLayoutClient>
      </body>
    </html>
  );
}
