'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Crown } from 'lucide-react'
import { motion } from 'framer-motion'
import SharedLayout from '@/components/layout/SharedLayout'
import TabNavigation from '@/components/TabNavigation'
import { DiaryData } from './types'
import { fetchDiaryContent, saveDiary } from './utils'
import './styles.css'
import PageTitle from '@/components/common/PageTitle'

const DiaryPage = ({ date }: { date: string }) => {
  const router = useRouter()
  const [diaryData, setDiaryData] = useState<DiaryData>({
    content: '',
    select_date: date
  })
  const [isSaving, setIsSaving] = useState(false)

  const loadDiaryContent = useCallback(async () => {
    try {
      const data = await fetchDiaryContent(date)
      setDiaryData(data)
    } catch (error) {
      console.error('다이어리 로딩 실패:', error)
      if (error instanceof Error && error.message.includes('token')) {
        window.location.href = '/login'
      }
    }
  }, [date])

  useEffect(() => {
    loadDiaryContent()
  }, [loadDiaryContent])

  const handleSave = async () => {
    if (isSaving) return; // Prevent double clicks
    
    try {
      setIsSaving(true)
      console.log('Saving diary:', diaryData) // Debug log
      await saveDiary(diaryData)
       alert('저장되었습니다.')
    } catch (error) {
      console.error('저장 실패:', error)
      if (error instanceof Error) {
        alert(`저장에 실패했습니다: ${error.message}`)
      } else {
        alert('저장에 실패했습니다.')
      }
    } finally {
      setIsSaving(false)
    }
  }

  const handleMaiddyComment = async () => {
    try {
      // 먼저 현재 일기 내용을 저장
      await saveDiary(diaryData);
      // 저장 성공 후 AI 코멘트 페이지로 이동
      router.push(`/ai_comment/${date}`);
    } catch (error) {
      console.error('저장 실패:', error);
      if (error instanceof Error) {
        alert(`저장에 실패했습니다: ${error.message}`);
      } else {
        alert('저장에 실패했습니다.');
      }
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDiaryData(prev => ({ ...prev, content: e.target.value }))
  }

  return (
    <SharedLayout>
      {/* Header 부분의 z-index를 높이고 pointer-events-auto 추가 */}
      <div className="p-8 pt-16 pb-0 relative z-50 pointer-events-auto">
      <PageTitle
        date={date}
        dateClassName="ml-8"
        rightElement={
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#8b7ff9] text-white hover:bg-[#7a6ff8] rounded-xl disabled:opacity-50 pointer-events-auto"
          >
            {isSaving ? 'Save' : 'Save'}
          </Button>
        }
      />
        <TabNavigation date={date} activeTab="diary" />
      </div>
  
      {/* Content 영역 */}
      <div className="px-8 overflow-y-auto h-[calc(100%-200px)] pt-0 pb-24 relative z-10">
        <div className="space-y-4">
          <motion.textarea
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            value={diaryData.content}
            onChange={handleContentChange}
            className="w-full bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] focus:ring-1 focus:ring-[#8b7ff9] focus:border-[#8b7ff9]"
            style={{ color: '#5C5C5C' }}
            placeholder="오늘의 일기를 기록해보세요..."
            rows={15}
          />
  
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="pointer-events-auto"
          >
            <Button
              onClick={handleMaiddyComment}
              className="w-full bg-[#8b7ff9] backdrop-blur-xl rounded-xl p-4 border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 group flex items-center justify-center"
            >
              <Crown className="h-5 w-5 mr-2 text-white group-hover:scale-110 transition-transform duration-300" />
              <span className="text-white">
                MAIDDY&apos;s comment
              </span>
            </Button>
          </motion.div>
        </div>
      </div>
    </SharedLayout>
  )
}

export default DiaryPage