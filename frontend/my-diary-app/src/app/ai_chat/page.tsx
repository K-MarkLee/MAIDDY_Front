'use client'

import AiChatPage from '@/containers/ai_chat/AiChatPage'

export default function Page({ params }: { params: { date: string } }) {
  return <AiChatPage params={params} />
}