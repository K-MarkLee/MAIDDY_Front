'use client'

import SchedulePage from '@/containers/schedule/SchedulePage'

export default function Page({ params }: { params: { date: string } }) {
  return <SchedulePage params={params} />
}