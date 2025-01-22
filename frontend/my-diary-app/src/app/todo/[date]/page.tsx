'use client'

import TodoPage from '@/containers/todo/TodoPage'

export default function Page({ params }: { params: { date: string } }) {
  return <TodoPage params={params} />
}