'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Pin } from 'lucide-react'
import { motion } from 'framer-motion'
import SharedLayout from '@/components/layout/SharedLayout'
import { DAY_NAMES } from './constants'
import { 
  generateCalendarDays, 
  formatDate, 
  fetchCalendarData
} from './utils'
import { API_URL } from './constants'
import './styles.css'
import Image from 'next/image'

interface PinnedSchedule {
  id: number;
  title: string;
  is_completed: boolean;
  date: string;
  pinned: boolean;
}

export default function Calendar() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [pinnedSchedules, setPinnedSchedules] = useState<PinnedSchedule[]>([])
  const [isFirstMount, setIsFirstMount] = useState(true)
  
  const allDays = generateCalendarDays(currentDate)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstMount(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        const data = await fetchCalendarData()
      } catch (error) {
        console.error('캘린더 데이터 로딩 실패:', error)
      }
    }

    const loadPinnedSchedules = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return
    
        const today = new Date()
        const formattedDate = formatDate(
          today.getFullYear(),
          today.getMonth(),
          today.getDate()
        )
    
        const response = await fetch(`${API_URL}/api/schedules/?date=${formattedDate}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch pinned schedules')
        }
        
        const data = await response.json()
        const pinnedOnly = data.filter((schedule: PinnedSchedule) => schedule.pinned === true)
        setPinnedSchedules(pinnedOnly)
      } catch (error) {
        console.error('핀 된 일정 로딩 실패:', error)
        setPinnedSchedules([])
      }
    }

    loadCalendarData()
    loadPinnedSchedules()
  }, [currentDate])

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))
  }

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))
  }

  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return
    
    setSelectedDate(day)
    const selectedDateFormatted = formatDate(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    )
    router.push(`/schedule/${selectedDateFormatted}`)
  }

  return (
    <SharedLayout>
      <motion.div
        className="w-full space-y-0"  // 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100
        }}
      > 
        <div className="calendar-header space-y-0">
          <div className="calendar-title flex justify-center items-center gap-2 mt-0 pt-0">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100
              }}
              className="flex items-center"
            >
              <Image
                src="/Images/maiddy.png"
                alt="MAIDDY"
                width={100}
                height={100}
                priority
                className="object-contain"
              />
            </motion.div>
            <motion.span
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100
              }}
              className="text-[#8b7ff9] font-bold text-2xl self-end mt-12"
            >
              's CALENDAR
            </motion.span>
          </div>
          <motion.div 
            className="bg-white/80 backdrop-blur-xl rounded-[32px] shadow-sm p-4 space-y-2"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.2
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Pin className="w-5 h-5 text-[#8b7ff9]" />
              <span className="font-medium text-gray-700">핀 된 오늘 일정</span>
            </div>
            {pinnedSchedules.length > 0 ? (
              <div className="space-y-2">
                {pinnedSchedules.map((schedule) => (
                  <div 
                    key={schedule.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-gray-50"
                  >
                    <span className={`${schedule.is_completed ? 'text-gray-400' : 'text-gray-700'}`}>
                      {schedule.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">오늘 핀 된 일정이 없습니다</p>
            )}
          </motion.div>
        </div>

        <motion.div 
          className="calendar-container"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 100,
            delay: 0.4
          }}
        >
        <div className="calendar-nav mb-0">
          <Button
            variant="ghost"
            onClick={handlePrevMonth}
            className="calendar-nav-button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Button>
          <div className="calendar-month">
            {currentDate.getFullYear()}년 {currentDate.toLocaleString('ko-KR', { month: 'long' })}
          </div>
          <Button
            variant="ghost"
            onClick={handleNextMonth}
            className="calendar-nav-button"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Button>
        </div>

          <div className="calendar-grid">
            {DAY_NAMES.map((day) => (
              <div key={day} className="calendar-day-name">
                {day}
              </div>
            ))}
            {allDays.map((date, index) => (
              <div
                key={`${date.isCurrentMonth ? 'current' : 'other'}-${date.day}-${index}`}
                onClick={() => handleDateClick(date.day, date.isCurrentMonth)}
                className={`
                  calendar-day
                  ${date.isCurrentMonth ? 'calendar-day-current-month' : 'calendar-day-other-month'}
                  ${selectedDate === date.day && date.isCurrentMonth ? 'calendar-day-selected' : ''}
                `}
              >
                {date.day}
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </SharedLayout>
  )
}