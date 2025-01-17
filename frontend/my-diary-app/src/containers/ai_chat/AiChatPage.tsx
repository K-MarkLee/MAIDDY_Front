'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import SharedLayout from '@/components/layout/SharedLayout'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send } from 'lucide-react'
import { motion } from 'framer-motion'
import Image from 'next/image'

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AiChatPage({ params }: { params: { date: string } }) {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "과거데이터 알아야하고 감성적인 멘트? >",
      sender: 'ai',
      timestamp: new Date()
    },
    {
      id: 2,
      content: "나 시험공부에 집중이 안돼",
      sender: 'user',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [currentImage, setCurrentImage] = useState('/Images/maiddy.png')

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage(prev =>
        prev === '/Images/maiddy.png'
          ? '/Images/smile_maiddy.png'
          : '/Images/maiddy.png'
      )
    }, 3000)

    return () => clearInterval(imageInterval)
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || isLoading) return

    try {
      setIsLoading(true)
      const userMessage: Message = {
        id: Date.now(),
        content: newMessage,
        sender: 'user',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, userMessage])
      setNewMessage('')

      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
        },
        body: JSON.stringify({ message: newMessage })
      })

      if (!response.ok) {
        throw new Error('AI 응답 실패')
      }

      const data = await response.json()
      
      const aiMessage: Message = {
        id: Date.now() + 1,
        content: data.message,
        sender: 'ai',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiMessage])
    } catch (error) {
      console.error('메시지 전송 실패:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <SharedLayout>
      <div className="flex flex-col h-full relative">
        {/* Header */}
        <div className="py-2 px-4 flex items-center justify-center gap-2 border-b bg-transparent">
          <Image
            src={currentImage}
            alt="MAIDDY"
            width={100}
            height={100}
            priority
            className="object-contain -mb-4"
          />
          <span className="text-[#8b7ff9] font-bold text-xl">
            's CHAT
          </span>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto px-4 py-2 pb-24">
          <div className="flex flex-col-reverse">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                } mb-4`}
              >
                <div className={`
                  max-w-[80%] p-3 rounded-xl
                  ${message.sender === 'user'
                    ? 'bg-[#8b7ff9] text-white'
                    : 'bg-white shadow-sm'
                  }
                `}>
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div ref={messagesEndRef} />
        </div>

        {/* Fixed Input Container */}
        <div className="fixed bottom-[82px] left-0 right-0 px-8 pb-4">
          <form onSubmit={sendMessage}>
            <div className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-center p-2">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="메시지를 입력하세요..."
                className="flex-1 bg-transparent border-0 focus:ring-1 focus:ring-[#8b7ff9]"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={!newMessage.trim() || isLoading}
                className="bg-[#8b7ff9] text-white hover:bg-[#7a6ff8] ml-2 w-10 h-10 p-0"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </div>
      </div>
    </SharedLayout>
  )
}