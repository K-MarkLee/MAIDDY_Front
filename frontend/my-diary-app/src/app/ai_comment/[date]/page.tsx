'use client'

import AiCommentPage from '@/containers/ai-comment/AiCommentPage'

export default function Page({ params }: { params: { date: string } }) {
  return <AiCommentPage params={params} />
}