'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import SharedLayout from '@/components/layout/SharedLayout'
import { fetchInitialMessage } from './utils'
import { ChatMessage } from './types'
import './styles.css'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Skeleton } from "@/components/ui/skeleton"

interface RecommendationData {
  recommendation: string;
}

export default function ChatbotPage() {
  const router = useRouter()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadInitialMessage = async () => {
      try {
        setIsLoading(true)
        const accessToken = localStorage.getItem('accessToken')
        if (!accessToken) {
          throw new Error('액세스 토큰이 없습니다.')
        }

        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]))
        const userId = tokenPayload.user_id

        const response = await fetch('http://43.200.166.176:8000/ai/recommend/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId })
        });

        if (!response.ok) {
          throw new Error('Failed to fetch recommendations');
        }

        const data = await response.json();
        const recommendationList = data.data.recommendation.split('\n');
        setRecommendations(recommendationList);

        const initialMessage = await fetchInitialMessage();
        setMessages([initialMessage]);
      } catch (error) {
        console.error('챗봇 로딩 실패:', error);
        if (error instanceof Error && error.message.includes('token')) {
          window.location.href = '/login';
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadInitialMessage();
  }, []);

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[230px]" />
      <Skeleton className="h-4 w-[180px]" />
      <Skeleton className="h-4 w-[220px]" />
    </div>
  );

  return (
    <SharedLayout>
      <div className="px-2">
        <div className="chatbot-container">
          <div className="chatbot-header">
            <div className="h-8 relative -mt-1">
              <Image
                src="/Images/logo2.png"
                alt="Maiddy Logo"
                width={12000}
                height={10}
                className="object-contain"
                priority
              />
            </div>
            <div className="w-[100px]" />
          </div>
        </div>

        <div className="chatbot-image">
          <div className="w-32 h-32 relative">
            <Image
              src="/Images/1.png"
              alt="Maiddy character"
              width={160}
              height={160}
              className="rounded-full"
            />
          </div>
        </div>

        <div className="chatbot-analysis">
          <div className="chatbot-card">
            <h2 className="text-lg text-[#5C5C5C] font-semibold">일정 추천</h2>
            
            <div className="chatbot-recommendation">
              {isLoading ? (
                <div className="flex flex-col items-center space-y-4 py-4">
                  <p className="text-sm text-[#5C5C5C]">추천 일정을 불러오는 중입니다...</p>
                  <LoadingSkeleton />
                </div>
              ) : (
                <div className="text-sm text-[#5C5C5C]">
                  {recommendations.map((recommendation, index) => (
                    <div key={index} className="mb-2">
                      ✨ {recommendation}
                    </div>
                  ))}
                </div>
              )}
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