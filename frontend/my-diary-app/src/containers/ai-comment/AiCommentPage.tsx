'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { ArrowLeft } from 'lucide-react'
import SharedLayout from '@/components/layout/SharedLayout'
import { DiaryData, AiCommentProps } from './types'
import { fetchDiaryContent, generateAiResponse } from './utils'
import './styles.css'

const AiCommentPage = ({ params }: AiCommentProps) => {
  const router = useRouter()
  const [diaryData, setDiaryData] = useState<DiaryData | null>(null)
  const [aiResponse, setAiResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const loadDiaryAndGenerateResponse = async () => {
      try {
        const diary = await fetchDiaryContent(params.date)
        if (diary) {
          setDiaryData(diary)
          setIsLoading(true)
          try {
            const response = await generateAiResponse(diary)
            setAiResponse(response)
          } catch (error) {
            console.error('AI 응답 생성 실패:', error)
            setAiResponse('죄송합니다. 지금은 응답을 생성할 수 없습니다.')
          }
        }
      } catch (error) {
        console.error('다이어리 로딩 실패:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadDiaryAndGenerateResponse()
  }, [params.date])

  return (
    <SharedLayout>
      <div className="ai-comment-header">
        <div className="flex items-center justify-between mb-6">
          <Button 
            variant="ghost"
            onClick={() => router.back()}
            className="ai-comment-button"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="ai-comment-title">
            MAIDDY'S Comment
          </h1>
          <div className="w-[64px]" />
        </div>
      </div>
    <div className="px-2">
      <div className="ai-comment-content">
        {isLoading ? (
          <div className="ai-comment-loading">
            <div className="ai-comment-loading-text">응답을 생성하고 있습니다...</div>
          </div>
        ) : (
          <div className="ai-comment-response">
            <p className="whitespace-pre-wrap">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
    </SharedLayout>
  )
}

export default AiCommentPage;
