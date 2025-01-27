import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8 gap-4">
      <h1 className="text-2xl font-bold text-center mb-8">My AI Diary</h1>
      <div className="w-full max-w-sm space-y-4">
        <Button asChild className="w-full rounded-full">
          <Link href="/login">로그인</Link>
        </Button>
        <Button asChild variant="outline" className="w-full rounded-full">
          <Link href="/signup">회원가입</Link>
        </Button>
      </div>
    </main>
  );
}
