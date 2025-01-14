'use client'

import DiaryPage from '@/containers/diary/DiaryPage'

export default function Page({ params }: { params: { date: string } }) {
  return <DiaryPage params={params} />
}