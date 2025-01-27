// src/app/diary/[date]/page.tsx
'use client';

import DiaryPage from '@/containers/diary/DiaryPage';

export default function Page({ params }: { params: { date: string } }) {
  return <DiaryPage date={params.date} />;
} // 여기 닫는 중괄호 추가
