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
      content: "안녕하세요! 무엇을 도와드릴까요?",
      sender: 'ai',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [currentImage, setCurrentImage] = useState('/Images/maiddy.png')

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = 0
    }
  }, [messages])

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
      <div className="flex flex-col h-[calc(100vh-64px)] relative">
        <motion.div 
          className="p-4 pt-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 100
          }}
        >
          <div className="flex justify-center items-center gap-2">
            <motion.div
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100
              }}
            >
              <Image
                src={currentImage}
                alt="MAIDDY"
                width={100}
                height={100}
                priority
                className="object-contain transition-opacity duration-300"
              />
            </motion.div>
            <motion.span
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100
              }}
              className="text-[#8b7ff9] font-bold text-2xl"
            >
              's CHAT
            </motion.span>
          </div>
        </motion.div>

        <motion.div
          className="flex-1 overflow-y-auto px-4 pb-32"
          ref={chatContainerRef}
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex flex-col-reverse space-y-reverse space-y-4">
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex items-start gap-3 ${
                  message.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className={`
                  max-w-[80%] p-3 rounded-2xl
                  ${message.sender === 'user'
                    ? 'bg-[#8b7ff9] text-white'
                    : 'bg-white/80 backdrop-blur-xl border border-white/40 text-[#5C5C5C]'
                  }
                  shadow-[0_4px_24px_rgba(0,0,0,0.04)]
                `}>
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {message.timestamp.toLocaleTimeString('ko-KR', {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="fixed bottom-[82px] left-0 right-0 px-8 pb-4"
        >
          <form onSubmit={sendMessage} className="mx-auto max-w-3xl">
            <div className="bg-white/80 backdrop-blur-xl rounded-2xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-center p-2">
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
        </motion.div>
      </div>
    </SharedLayout>
  )
}