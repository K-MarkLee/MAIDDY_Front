'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import SharedLayout from '@/components/layout/SharedLayout'
import { Skeleton } from "@/components/ui/skeleton"
import { generateAiResponse } from './utils'
import './styles.css'

interface AiCommentProps {
  params: {
    date: string;
  };
}

const AiCommentPage = ({ params }: AiCommentProps) => {
  const router = useRouter()
  const [feedback, setFeedback] = useState<string>('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const accessToken = localStorage.getItem('accessToken')
        
        if (!accessToken) {
          router.push('/login')
          return
        }

        const response = await generateAiResponse({ select_date: params.date });
        setFeedback(response)
      } catch (error) {
        console.error('피드백 로딩 실패:', error)
        setError('피드백을 불러오는데 실패했습니다. 다시 시도해주세요.')
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
    </div>
  )

  return (
    <SharedLayout>
      <div className="px-8">
        <div className="ai-comment-header">
          <div className="mb-6 flex items-center">
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
          <div className="ai-comment-card rounded-lg bg-white shadow-md p-6">
            <h2 className="text-lg text-[#5C5C5C] font-semibold mb-4">일일 피드백</h2>
            
            <div className="ai-comment-content">
              {isLoading ? (
                <div className="flex flex-col items-center space-y-4 py-4">
                  <p className="text-sm text-[#5C5C5C]">피드백을 불러오고 있습니다...</p>
                  <LoadingSkeleton />
                </div>
              ) : error ? (
                <div className="text-red-500 text-sm">{error}</div>
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