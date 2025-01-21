'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import SharedLayout from '@/components/layout/SharedLayout'
import { AiCommentProps } from './types'
import { Skeleton } from "@/components/ui/skeleton"
import './styles.css'

const AiCommentPage = ({ params }: AiCommentProps) => {
  const router = useRouter()
  const [feedback, setFeedback] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true)
        const token = localStorage.getItem('accessToken')
        const userId = localStorage.getItem('userId')

        if (!token) {
          router.push('/login')
          return
        }

        const response = await fetch('http://localhost:8000/ai/feedback/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId ? parseInt(userId) : 2,  // userId가 없으면 기본값 2 사용
            select_date: params.date
          })
        })

        if (!response.ok) {
          throw new Error('피드백을 가져오는데 실패했습니다')
        }

        const data = await response.json()
        setFeedback(data.data.feedback)
      } catch (error) {
        console.error('피드백 로딩 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (params.date) {
      fetchFeedback()
    }
  }, [params.date, router])

  const LoadingSkeleton = () => (
    <div className="space-y-3">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[230px]" />
      <Skeleton className="h-4 w-[180px]" />
      <Skeleton className="h-4 w-[220px]" />
    </div>
  )

  return (
    <SharedLayout>
      <div className="ai-comment-header">
        <div className="flex items-center mb-6 relative">
          <div className="w-[70px] relative z-50">
            <Button 
              variant="ghost"
              onClick={() => router.back()}
              className="ai-comment-button pointer-events-auto"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex-grow flex justify-center">
            <h1 className="ai-comment-title">
              MAIDDY'S Comment
            </h1>
          </div>
          <div className="w-[110px]" />
        </div>
      </div>
      <div className="px-2">
        <div className="ai-comment-content">
          {isLoading ? (
            <div className="chatbot-card bg-pink-50 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-4"></h2>
              <div className="text-center text-gray-600 mb-4">
                피드백을 불러오고 있습니다...
              </div>
              <LoadingSkeleton />
            </div>
          ) : (
            <div className="chatbot-card bg-pink-50 rounded-lg p-4 shadow-sm">
              <h2 className="text-lg font-semibold mb-4"></h2>
              <div className="ai-comment-response">
                {feedback.split('\n').map((line, index) => (
                  <div key={index} className="mb-4">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </SharedLayout>
  )
}

export default AiCommentPage