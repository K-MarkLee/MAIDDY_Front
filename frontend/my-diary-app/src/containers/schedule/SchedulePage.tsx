'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SharedLayout from '@/components/layout/SharedLayout';
import TabNavigation from '@/components/TabNavigation';
import PageTitle from '@/components/common/PageTitle';
import { Schedule } from './types';
import { fetchSchedules, handleDeleteSchedule, handleAddSchedule, handleTogglePin, handleUpdateSchedule } from './utils';
import ScheduleCard from './ScheduleCard';
import TimePicker from '@/components/TimePicker';

interface SchedulePageProps {
  params: {
    date: string;
  };
}

const SchedulePage = ({ params }: SchedulePageProps) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isAddingSchedule, setIsAddingSchedule] = useState(false);
  const [newSchedule, setNewSchedule] = useState({
    title: '',
    content: '',
    time: '',
    select_date: params.date,
  });

  const scheduleContainerStyle = {
    padding: '2rem',
    paddingTop: '0rem',
  };

  const loadSchedules = useCallback(async () => {
    try {
      const data = await fetchSchedules(params.date);
      setSchedules(data);
    } catch (error) {
      console.error('일정 목록 로딩 실패:', error);

      if (error instanceof Error && error.message.includes('인증')) {
        window.location.href = '/login';
        return;
      }

      alert('일정을 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.');
    }
  }, [params.date]);

  useEffect(() => {
    loadSchedules();
  }, [loadSchedules]);

  const handleDelete = async (id: number) => {
    try {
      await handleDeleteSchedule(id);
      setSchedules((prevSchedules) => prevSchedules.filter((schedule) => schedule.id !== id));
    } catch (error) {
      alert('일정 삭제에 실패했습니다');
    }
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await handleAddSchedule(newSchedule);
      await loadSchedules();
      setNewSchedule({
        title: '',
        content: '',
        time: '',
        select_date: params.date,
      });
      setIsAddingSchedule(false);
    } catch (error) {
      alert('일정 추가에 실패했습니다');
    }
  };

  const handleUpdate = async (id: number, updatedData: Partial<Schedule>) => {
    try {
      const updated = await handleUpdateSchedule(id, updatedData);
      setSchedules((prevSchedules) =>
        prevSchedules.map((schedule) =>
          schedule.id === id ? { ...schedule, ...updated } : schedule
        )
      );
    } catch (error) {
      alert('일정 업데이트에 실패했습니다');
    }
  };

  const onTogglePin = async (scheduleId: number) => {
    try {
      const updatedSchedule = await handleTogglePin(scheduleId, params.date);
      setSchedules((prevSchedules) =>
        prevSchedules.map((schedule) => (schedule.id === scheduleId ? updatedSchedule : schedule))
      );
    } catch (error) {
      console.error('핀 설정 실패:', error);
      alert('일정 핀 설정에 실패했습니다');
    }
  };

  return (
    <SharedLayout>
      <div className="p-8 pt-16 pb-0">
        <PageTitle date={params.date} />
        <TabNavigation date={params.date} activeTab="schedule" />
      </div>

      <div
        className="overflow-y-auto h-[calc(100%-200px)] pt-4 pb-24 relative z-10"
        style={scheduleContainerStyle}
      >
        <AnimatePresence mode="wait">
          {isAddingSchedule ? (
            <motion.div
              key="add-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] mb-4"
            >
              <form onSubmit={handleAdd} className="space-y-4">
                <Input
                  placeholder="제목"
                  value={newSchedule.title}
                  onChange={(e) => setNewSchedule((prev) => ({ ...prev, title: e.target.value }))}
                  className="w-full p-3 bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 focus:ring-1 focus:ring-[#8b7ff9] focus:border-[#8b7ff9] text-[#5C5C5C]"
                  style={{ color: '#5C5C5C' }}
                  required
                  autoFocus
                />
                <Input
                  placeholder="내용"
                  value={newSchedule.content}
                  onChange={(e) => setNewSchedule((prev) => ({ ...prev, content: e.target.value }))}
                  className="w-full p-3 bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 focus:ring-1 focus:ring-[#8b7ff9] focus:border-[#8b7ff9]"
                  style={{ color: '#5C5C5C' }}
                />
                <TimePicker
                  value={newSchedule.time}
                  onChange={(time) => setNewSchedule((prev) => ({ ...prev, time }))}
                  required
                  style={{ color: '#5C5C5C' }}
                />
                <div className="flex gap-2">
                  <Button
                    type="submit"
                    className="flex-1 bg-[#8b7ff9] text-white hover:bg-[#7a6ff8] border border-[#8b7ff9]"
                  >
                    추가
                  </Button>
                  <Button
                    type="button"
                    onClick={() => {
                      setIsAddingSchedule(false);
                      setNewSchedule({
                        title: '',
                        content: '',
                        time: '',
                        select_date: params.date,
                      });
                    }}
                    className="flex-1 bg-gray-100 text-[#5C5C5C] hover:bg-gray-200 border border-gray-200 hover:border-gray-300"
                  >
                    취소
                  </Button>
                </div>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="schedule-list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatePresence initial={false}>
                {schedules.map((schedule, index) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    onDelete={handleDelete}
                    onTogglePin={onTogglePin}
                    onUpdate={handleUpdate}
                    index={index}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isAddingSchedule && (
        <motion.button
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{
            type: 'spring',
            duration: 0.5,
            bounce: 0.3,
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsAddingSchedule(true)}
          style={{ bottom: '105px', right: '2rem' }}
          className="fixed bg-[#8b7ff9] text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50 border-2 border-white hover:border-[#7a6ff8] transition-colors"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      )}
    </SharedLayout>
  );
};

export default SchedulePage;