// src/containers/diary/DiaryPage.tsx
'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Crown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import SharedLayout from '@/components/layout/SharedLayout'
import TabNavigation from '@/components/TabNavigation'
import { DiaryData } from './types'
import { fetchDiaryContent, saveDiary } from './utils'
import './styles.css'
import PageTitle from '@/components/common/PageTitle'

const DiaryPage = ({ date }: { date: string }) => {
  const router = useRouter()
  const [diaryData, setDiaryData] = useState({
    content: '',
    select_date: date
  })

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
    try {
      await saveDiary(diaryData)
    } catch (error) {
      console.error('저장 실패:', error)
      if (error instanceof Error) {
        alert(`저장에 실패했습니다: ${error.message}`)
      } else {
        alert('저장에 실패했습니다.')
      }
    }
  }

  return (
    <SharedLayout>
      <div className="p-8 pt-16 pb-0">
        <PageTitle 
          date={date}
          rightElement={
            <Button
              onClick={handleSave}
              className="bg-[#8b7ff9] text-white hover:bg-[#7a6ff8]"
            >
              Save
            </Button>
          }
        />
        <TabNavigation date={date} activeTab="diary" />
      </div>

      <div className="px-8 overflow-y-auto h-[calc(100%-200px)] pt-0 pb-24 relative z-10">
        <div className="space-y-4">
          <motion.textarea
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            value={diaryData.content}
            onChange={(e) => 
              setDiaryData(prev => ({ ...prev, content: e.target.value }))
            }
            className="w-full bg-white/80 backdrop-blur-xl rounded-2xl p-4 border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] focus:ring-1 focus:ring-[#8b7ff9] focus:border-[#8b7ff9]"
            style={{ color: '#5C5C5C' }}
            placeholder="오늘의 일기를 기록해보세요..."
            rows={15}
          />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          >
            <Button
              onClick={() => router.push(`/ai_comment/${date}`)}
              className="w-full bg-[#8b7ff9] backdrop-blur-xl rounded-2xl p-4 border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 group flex items-center justify-center"
            >
              <Crown className="h-5 w-5 mr-2 text-white group-hover:scale-110 transition-transform duration-300" />
              <span className="text-white">
                MAIDDY&apos;S comment
              </span>
            </Button>
          </motion.div>
        </div>
      </div>  
    </SharedLayout>
  )
}

export default DiaryPage;


