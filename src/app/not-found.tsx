import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <p className="text-lg font-semibold">页面不存在</p>
      <p className="text-sm text-muted-foreground">可能是链接错误或页面已被移除。</p>
      <Button variant="outline" asChild>
        <Link href="/">返回首页</Link>
      </Button>
    </div>
  );
}
