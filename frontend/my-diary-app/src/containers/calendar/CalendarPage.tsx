'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Pin, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import SharedLayout from '@/components/layout/SharedLayout';
import { DAY_NAMES, API_ENDPOINTS } from './constants';
import { generateCalendarDays, formatDate } from './utils';
import './styles.css';
import Image from 'next/image';
import apiClient from '@/lib/apiClient';

interface PinnedSchedule {
  id: number;
  title: string;
  is_completed: boolean;
  date: string;
  pinned: boolean;
  time?: string;
}

interface DiaryEntry {
  select_date: string;
}

export default function Calendar() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [pinnedSchedules, setPinnedSchedules] = useState<PinnedSchedule[]>([]);
  const [currentImage, setCurrentImage] = useState('/Images/maiddy.png');
  const [diaryDates, setDiaryDates] = useState<Set<string>>(new Set());

  const allDays = generateCalendarDays(currentDate);

  // 오늘 날짜 캐싱 (렌더링 루프에서 반복 생성 방지)
  const today = useMemo(() => new Date(), []);
  const isCurrentMonthView =
    today.getMonth() === currentDate.getMonth() &&
    today.getFullYear() === currentDate.getFullYear();

  useEffect(() => {
    const loadDiaryDates = async () => {
      try {
        // N+1 해결: 전체 일기 목록을 한 번에 가져와서 해당 월의 날짜만 필터링
        const { data: diaries } = await apiClient.get('/api/diaries/');

        const monthStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`;
        const datesWithDiary = new Set<string>(
          diaries
            .filter((d: DiaryEntry) => d.select_date?.startsWith(monthStr))
            .map((d: DiaryEntry) => d.select_date)
        );
        setDiaryDates(datesWithDiary);
      } catch {
        setDiaryDates(new Set());
      }
    };

    const loadPinnedSchedules = async () => {
      try {
        const todayDate = new Date();
        const dateStr = formatDate(todayDate.getFullYear(), todayDate.getMonth(), todayDate.getDate());

        const { data } = await apiClient.get(`${API_ENDPOINTS.SCHEDULES}/`, {
          params: { date: dateStr },
        });

        const pinnedOnly = data.filter((schedule: PinnedSchedule) => schedule.pinned === true);
        setPinnedSchedules(pinnedOnly);
      } catch {
        setPinnedSchedules([]);
      }
    };

    loadDiaryDates();
    loadPinnedSchedules();
  }, [currentDate]);

  useEffect(() => {
    const imageInterval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === '/Images/maiddy.png' ? '/Images/smile_maiddy.png' : '/Images/maiddy.png'
      );
    }, 3000);

    return () => clearInterval(imageInterval);
  }, []);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const handleDateClick = (day: number, isCurrentMonth: boolean) => {
    if (!isCurrentMonth) return;

    setSelectedDate(day);
    const selectedDateFormatted = formatDate(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    router.push(`/schedule/${selectedDateFormatted}`);
  };

  const handleMaiddy = () => {
    router.push('/chatbot');
  };

  return (
    <SharedLayout>
      <motion.div
        className="w-full space-y-2 relative z-[1]"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: -90, opacity: 1 }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 100,
        }}
      >
        <div className="calendar-header space-y-1 mt-8">
          <div className="calendar-title flex justify-center items-center gap-2 mb-1 pt-2">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{
                type: 'spring',
                damping: 20,
                stiffness: 100,
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
                type: 'spring',
                damping: 20,
                stiffness: 100,
              }}
              className="text-[#8b7ff9] font-bold text-2xl self-end mt-8"
            >
              <Image
                src="/Images/calendar.png"
                alt="Calendar Title"
                width={170}
                height={160}
                priority
                className="object-contain signup-header flex justify-center"
              />
            </motion.span>
          </div>

          <motion.div
            className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-4 space-y-2 mt-8"
            initial={{ y: -150, opacity: 0 }}
            animate={{ y: -5, opacity: 1 }}
            transition={{
              type: 'spring',
              damping: 20,
              stiffness: 100,
              delay: 0.2,
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <Pin className="w-5 h-5 text-violet-600" />
              <span className="font-medium text-sm" style={{ color: '#5C5C5C' }}>
                중요 일정
              </span>
            </div>
            {pinnedSchedules.length > 0 ? (
              <div className="space-y-0.5">
                {pinnedSchedules.map((schedule) => (
                  <div
                    key={schedule.id}
                    className="flex items-center gap-2 py-0.5 px-1.5 rounded-xl bg-violet-50/80"
                  >
                    <div className="text-sm font-bold text-[#7c3aed] transition-colors duration-200">
                      {schedule.time ? schedule.time.slice(0, 5) : ''}
                    </div>
                    <span
                      className={`text-sm ${schedule.is_completed ? 'text-gray-400' : 'text-gray-700'}`}
                    >
                      {schedule.title}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">고정된 오늘 일정이 없습니다</p>
            )}
          </motion.div>
        </div>

        <motion.div
          className="calendar-container bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-4 pt-1 pb-4"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 3, opacity: 1 }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 120,
            delay: 0.2,
          }}
        >
          <div className="calendar-nav flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={handlePrevMonth}
              className="hover:bg-violet-50/80 rounded-xl"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Button>
            <div
              className="calendar-month text-sm font-medium flex-1 text-center"
              style={{ color: '#5C5C5C' }}
            >
              {currentDate.getFullYear()}년 {currentDate.toLocaleString('ko-KR', { month: 'long' })}
            </div>
            <Button variant="ghost" onClick={handleNextMonth} className="hover:bg-violet-50/80">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
              <div
                key={day}
                className="calendar-day-name text-xs font-medium text-gray-400 text-center py-2"
              >
                {day}
              </div>
            ))}
            {allDays.map((date, index) => {
              const formattedDate = formatDate(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                date.day
              );

              const hasDiary = date.isCurrentMonth && diaryDates.has(formattedDate);
              const isToday =
                date.isCurrentMonth &&
                isCurrentMonthView &&
                today.getDate() === date.day;

              return (
                <motion.div
                  key={`${date.isCurrentMonth ? 'current' : 'other'}-${date.day}-${index}`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleDateClick(date.day, date.isCurrentMonth)}
                  className={`
                    calendar-day p-2 text-sm rounded-xl text-center cursor-pointer transition-all duration-300
                    ${date.isCurrentMonth ? 'hover:bg-violet-50/80' : 'text-gray-400'}
                    ${selectedDate === date.day && date.isCurrentMonth ? 'bg-violet-100/80 text-violet-600' : ''}
                  `}
                  style={date.isCurrentMonth ? { color: '#5C5C5C' } : {}}
                >
                  <div className={isToday ? 'text-pink-500 font-bold' : ''}>
                    <div className={`
                      h-full w-full 
                      ${isToday ? 'calendar-day-today' : ''}
                      ${hasDiary ? 'diary-exists' : ''}
                    `}>
                      {date.day}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 10, opacity: 1 }}
          transition={{
            type: 'spring',
            damping: 20,
            stiffness: 100,
            delay: 0.3,
          }}
          className="w-full mt-2 px-8"
        >
          <Button
            onClick={handleMaiddy}
            className="w-full bg-[#8b7ff9] backdrop-blur-xl rounded-xl p-4 border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300 group flex items-center justify-center"
          >
            <Crown className="h-5 w-5 mr-2 text-white group-hover:scale-110 transition-transform duration-300" />
            <span className="text-white">MAIDDY와 대화하기</span>
          </Button>
        </motion.div>
      </motion.div>
    </SharedLayout>
  );
}