'use client';

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Pin, Crown } from 'lucide-react'
import { motion } from 'framer-motion'
import SharedLayout from '@/components/layout/SharedLayout'
import { DAY_NAMES } from './constants'
import {
  generateCalendarDays,
  formatDate,
//  fetchCalendarData
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

interface DiaryEntry {
  date: string;
  has_diary: boolean;
}

export default function Calendar() {
  const router = useRouter()
  const [currentDate, setCurrentDate] = useState(new Date(2025, 0, 1))
  const [selectedDate, setSelectedDate] = useState<number | null>(null)
  const [pinnedSchedules, setPinnedSchedules] = useState<PinnedSchedule[]>([])
  const [isFirstMount, setIsFirstMount] = useState(true)
  const [currentImage, setCurrentImage] = useState('/Images/maiddy.png')
  const [diaryDates, setDiaryDates] = useState<DiaryEntry[]>([])

  const allDays = generateCalendarDays(currentDate)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFirstMount(false)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
  //   const loadCalendarData = async () => {
  //     try {
  //       const data = await fetchCalendarData()
  //     } catch (error) {
  //       console.error('캘린더 데이터 로딩 실패:', error)
  //     }
  //   }

    const loadDiaryDates = async () => {
      try {
        const token = localStorage.getItem('accessToken')
        if (!token) return

        const daysInMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        ).getDate()

        const diaryPromises = Array.from({ length: daysInMonth }, (_, i) => {
          const date = formatDate(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            i + 1
          )
          
          return fetch(`${API_URL}/api/diaries/?date=${date}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }).then(response => {
            if (response.status === 200) {
              return { date, has_diary: true }
            }
            return { date, has_diary: false }
          }).catch(() => {
            return { date, has_diary: false }
          })
        })

        const results = await Promise.all(diaryPromises)
        const diariesWithEntries = results.filter(result => result.has_diary)
        setDiaryDates(diariesWithEntries)
      } catch (error) {
        console.error('일기 데이터 로딩 실패:', error)
        setDiaryDates([])
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

//   loadCalendarData()
    loadDiaryDates()
    loadPinnedSchedules()
  }, [currentDate])

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

  const handleMaiddy = () => {
    const today = new Date()
    const formattedDate = formatDate(
      today.getFullYear(),
      today.getMonth() + 1,
      today.getDate()
    )
    router.push(`/chatbot`)
  }

  const renderCell = (date: Date, isCurrentMonth: boolean) => {
    const today = new Date();
    const isToday = 
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();
      
    const formattedDate = formatDate(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );
    
    const hasDiary = isCurrentMonth && diaryDates.some(
      entry => entry.date === formattedDate && entry.has_diary
    );
    
    return (
      <div
        className={`h-full w-full ${
          isToday ? 'calendar-day-today' : ''
        } ${
          hasDiary ? 'diary-exists' : ''
        }`}
      >
        {date.getDate()}
      </div>
    );
  };

  return (
    <SharedLayout>
      <motion.div
        className="w-full space-y-2"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: -90, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100
        }}
      >
        <div className="calendar-header space-y-1 mt-8">
          <div className="calendar-title flex justify-center items-center gap-2 mb-1 pt-2">
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
                src={currentImage}
                alt="MAIDDY"  
                width={100}
                height={100}
                priority
                className="object-contain transition-opacity duration-300"
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
              className="text-[#8b7ff9] font-bold text-2xl self-end mt-8"
            >
              <Image
              className="signup-header flex justify-center"
              src="/Images/calendar.png"
              alt="Login Title"
              width={170}
              height={160}
              priority
              className="object-contain"
            />

            </motion.span>
          </div>
  
          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-4 space-y-2 mt-8"
            initial={{ y: -150, opacity: 0 }}
            animate={{ y: -5, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.2
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Pin className="w-5 h-5 text-violet-600" />
              <span className="font-medium text-sm" style={{ color: '#5C5C5C' }}>Pinned Today</span>
            </div>
            {pinnedSchedules.length > 0 ? (
              <div className="space-y-1.5">
                {pinnedSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center gap-2 p-2 rounded-xl bg-violet-50/80"
                  >
                    <span className={`text-sm ${schedule.is_completed ? 'text-gray-400' : 'text-gray-700'}`}>
                      {schedule.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No pinned for today</p>
            )}
          </motion.div>
        </div>
  
        <motion.div
          className="calendar-container bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-4 pt-1 pb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 3, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 25,
            stiffness: 120,
            delay: 0.2
          }}
        >
          <div className="calendar-nav flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={handlePrevMonth}
              className="hover:bg-violet-50/80 rounded-xl"
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
            <div className="calendar-month text-sm font-medium flex-1 text-center" style={{ color: '#5C5C5C' }}>
              {currentDate.getFullYear()}년 {currentDate.toLocaleString('ko-KR', { month: 'long' })}
            </div>
            <Button
              variant="ghost"
              onClick={handleNextMonth}
              className="hover:bg-violet-50/80"
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
  
          <div className="calendar-grid grid grid-cols-7 gap-1">
            {DAY_NAMES.map((day) => (
              <div key={day} className="calendar-day-name text-xs font-medium text-gray-400 text-center py-2">
                {day}
              </div>
            ))}
            {allDays.map((date, index) => (
              <motion.div
                key={`${date.isCurrentMonth ? 'current' : 'other'}-${date.day}-${index}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateClick(date.day, date.isCurrentMonth)}
                className={`
                calendar-day p-2 text-sm rounded-xl text-center cursor-pointer transition-all duration-300
                ${date.isCurrentMonth
                    ? 'hover:bg-violet-50/80'
                    : 'text-gray-400'
                  }
                ${selectedDate === date.day && date.isCurrentMonth
                    ? 'bg-violet-100/80 text-violet-600'
                    : ''
                  }
              `}
                style={date.isCurrentMonth ? { color: '#5C5C5C' } : {}}
                data-highlighted={[].includes(date.day)}
              >
                {renderCell(
                  new Date(currentDate.getFullYear(), currentDate.getMonth(), date.day),
                  date.isCurrentMonth
                )}
              </motion.div>
            ))}
          </div>
        </motion.div>
  
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 10, opacity: 1 }}
          transition={{
            type: "spring",
            damping: 20,
            stiffness: 100,
            delay: 0.3
          }}
          className="w-full mt-2 px-8"
        >
          <Button
            onClick={handleMaiddy}
            className="w-full bg-[#8b7ff9] backdrop-blur-xl rounded-xl p-4 border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 group flex items-center justify-center"
          >
            <Crown className="h-5 w-5 mr-2 text-white group-hover:scale-110 transition-transform duration-300" />
            <span className="text-white">
              MAIDDY와 대화하기
            </span>
          </Button>
        </motion.div>
      </motion.div>
    </SharedLayout>
  ) 
}