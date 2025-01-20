'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import SharedLayout from '@/components/layout/SharedLayout'
import { fetchInitialMessage } from './utils'
import { ChatMessage } from './types'
import './styles.css'

export default function ChatbotPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])

  useEffect(() => {
    const loadInitialMessage = async () => {
      try {
        const initialMessage = await fetchInitialMessage()
        setMessages([initialMessage])
      } catch (error) {
        console.error('챗봇 로딩 실패:', error)
        if (error instanceof Error && error.message.includes('token')) {
          window.location.href = '/login'
        }
      }
    }

    loadInitialMessage()
  }, [])

  return (
    <SharedLayout>
    <div className="px-2">
      <div className="chatbot-container">
        
        <div className="chatbot-header">
          <Button 
            variant="ghost"
            onClick={() => router.back()}
            className="chatbot-button"
          >
            Back
          </Button>
          <h1 className="chatbot-title">MAIDDY</h1>
          <div className="w-[100px]" />
        </div>
      </div>

      <div className="chatbot-image">
        <div className="w-32 h-32 relative">
          <Image
            src="/images/logo.png"
            alt="Maiddy character"
            width={128}
            height={128}
            className="rounded-full"
          />
        </div>
      </div>

      <div className="chatbot-analysis">
        <div className="chatbot-card">
          <h2 className="text-lg font-semibold">AI 맞춤 일정 추천</h2>
          
          <div className="chatbot-recommendation">
            <div className="text-sm text-gray-600">
              
            </div>
            <div className="text-sm">
              ✨ 추천 일정:<br />
             
            </div>
          </div>

          <div className="chatbot-recommendation">
            <div className="text-sm text-gray-600">
          
            </div>
            <div className="text-sm">
              ✨ 추천 일정:<br />
       
            </div>
          </div>
        </div>
      </div>

      <div className="chatbot-chat">
        <Button
          onClick={() => router.push('/ai_chat')}
          className="chatbot-chat-button"
        >
          <span>Maiddy에게 메시지를 보내보세요</span>
          <span>→</span>
        </Button>
      </div>
    </div>
    </SharedLayout>
  );
}
