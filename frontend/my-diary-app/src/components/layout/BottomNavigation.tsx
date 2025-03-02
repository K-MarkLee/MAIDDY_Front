'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Calendar, ListTodo, Clock, MessageCircle } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';

// 날짜 포맷 함수
const formatDate = (year: number, month: number, day: number): string => {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
};

export default function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  // 현재 날짜를 가져오는 함수
  const getCurrentDate = () => {
    const today = new Date();
    return formatDate(today.getFullYear(), today.getMonth(), today.getDate());
  };

  const [currentDate, setCurrentDate] = useState(getCurrentDate());

  // 네비게이션 아이템을 useMemo로 최적화
  const NAVIGATION_ITEMS = useMemo(
    () => [
      {
        label: '달력',
        icon: Calendar,
        path: '/calendar',
      },
      {
        label: '오늘 일정',
        icon: Clock,
        path: '/schedule',
      },
      {
        label: '오늘 할일',
        icon: ListTodo,
        path: '/todo',
      },
      {
        label: '오늘 일기',
        icon: MessageCircle,
        path: '/diary',
      },
    ],
    [] // 의존성 제거
  );

  // 날짜 업데이트를 위한 useEffect
  useEffect(() => {
    // 1분마다 날짜 체크
    const intervalId = setInterval(() => {
      const newDate = getCurrentDate();
      if (newDate !== currentDate) {
        setCurrentDate(newDate);
      }
    }, 60000); // 1분마다 체크

    return () => clearInterval(intervalId);
  }, [currentDate]);

  useEffect(() => {
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setIsFirstVisit(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]);

  const handleNavigation = (path: string) => {
    // 네비게이션 시 현재 날짜로 경로 업데이트
    let updatedPath = path;
    if (path.includes('/schedule') || path.includes('/todo') || path.includes('/diary')) {
      const currentDate = getCurrentDate();
      updatedPath = `${path}/${currentDate}`;
    }

    setIsFirstVisit(false);
    router.push(updatedPath);
  };

  return (
    <motion.div
      className="fixed bottom-1 left-0 right-0 h-[82px] flex items-center justify-center px-8 z-[51]"
      initial={isFirstVisit ? { y: 100 } : { y: 0 }}
      animate={{ y: 0 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 100,
      }}
    >
      <div className="max-w-screen-xl mx-auto w-full h-16 bg-white/80 backdrop-blur-xl flex justify-around items-center rounded-xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] px-3">
        {NAVIGATION_ITEMS.map((item, index) => {
          const basePath = item.path.split('/')[1]; // 기본 경로 추출

          // 활성화 상태 로직 수정
          let isActive = pathname.startsWith(`/${basePath}`);

          // schedule, todo, diary 경로일 경우 날짜도 체크
          if (basePath === 'schedule' || basePath === 'todo' || basePath === 'diary') {
            const pathDate = pathname.split('/')[2]; // URL에서 날짜 부분 추출
            const today = getCurrentDate();
            isActive = pathname.startsWith(`/${basePath}`) && pathDate === today;
          }

          return (
            <motion.div
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className="relative"
            >
              <Button
                variant="ghost"
                onClick={() => handleNavigation(item.path)}
                className={`relative flex flex-col gap-1 items-center py-3 px-3 hover:bg-transparent group ${isActive ? 'text-[#7c3aed]' : 'text-gray-400'
                  }`}
              >
                <div
                  className={`flex items-center justify-center ${isActive ? 'bg-[#7c3aed]/10' : 'bg-transparent'
                    } rounded-xl p-2 transition-colors duration-300 group-hover:bg-[#7c3aed]/10`}
                >
                  <item.icon
                    className={`h-[18px] w-[18px] transition-transform duration-300 ${isActive ? 'scale-110' : 'scale-100'
                      } group-hover:scale-110 group-hover:text-[#7c3aed]`}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium transition-colors duration-300 whitespace-nowrap ${isActive ? 'text-[#7c3aed]' : 'text-gray-400'
                    } group-hover:text-[#7c3aed]`}
                >
                  {item.label}
                </span>
              </Button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}