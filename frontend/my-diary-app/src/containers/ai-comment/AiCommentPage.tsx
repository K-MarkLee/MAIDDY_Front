'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from 'lucide-react'
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
        const accessToken = localStorage.getItem('accessToken')
        
        if (!accessToken) {
          router.push('/login')
          return
        }

        const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]))
        const userId = tokenPayload.user_id

        const response = await fetch('http://43.200.166.176.8000/ai/feedback/', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
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
      <div className="px-8">
        <div className="ai-comment-header">
        <div className="mb-6 flex items-center"> {/* flex와 items-center 추가 */}
         <div className="w-[70px] relative z-50">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="ai-comment-button pointer-events-auto ml-0"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </div>
            <div className="flex-grow flex justify-center">
              <h1 className="ai-comment-title whitespace-nowrap">
             MAIDDY'S Comment
              </h1>
            </div>
            <div className="w-[100px]" />
          </div>
        </div>

        <div className="ai-comment-analysis">
          <div className="ai-comment-card rounded-lg bg-white shadow-md ">
            <h2 className="text-lg text-[#5C5C5C] font-semibold">일일 피드백</h2>
            
            <div className="ai-comment-content">
              {isLoading ? (
                <div className="flex flex-col items-center space-y-4 py-4">
                  <p className="text-sm text-[#5C5C5C]">피드백을 불러오고 있습니다...</p>
                  <LoadingSkeleton />
                </div>
              ) : (
                <div className="text-sm text-[#5C5C5C] space-y-2">
                  {feedback.split('\n').map((line, index) => (
                    <div key={index} className="mb-2">
                      ✨ {line}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SharedLayout>
  )
}

export default AiCommentPage