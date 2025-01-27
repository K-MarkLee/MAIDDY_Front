import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pin, Trash2 } from 'lucide-react';
import ScheduleDetail from './ScheduleDetail';

interface ScheduleData {
  id: number;
  title: string;
  description?: string;
  date: string;
  time: string;
  pinned: boolean;
  is_completed: boolean;
  index?: number;
  category?: string;
  priority?: 'high' | 'medium' | 'low';
  duration?: number;
  location?: string;
}

interface ScheduleCardProps {
  schedule: ScheduleData;
  onDelete: (id: number) => void;
  onTogglePin: (id: number) => void;
  onUpdate: (id: number, data: Partial<ScheduleData>) => void;
}

export default function ScheduleCard({
  schedule,
  onDelete,
  onTogglePin,
  onUpdate,
}: ScheduleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return time;
    }
  };

  const handleDetailExpandChange = useCallback((expanded: boolean) => {
    setIsExpanded(expanded);
  }, []);

  return (
    <motion.div
      layout
      style={{ marginBottom: '1rem' }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{
        duration: 0.3,
        ease: 'easeOut',
        delay: schedule.index ? schedule.index * 0.1 : 0,
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="mb-6 relative"
    >
      <motion.div
        className={`
         relative overflow-hidden
         flex items-center justify-between p-9
         w-full
         bg-white/80 backdrop-blur-xl
         rounded-xl
         border border-white/40
         transition-all duration-300 ease-in-out
         shadow-[0_4px_8px_rgba(0,0,0,0.04)]
         hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)]
         text-[#5C5C5C]
         ${schedule.pinned ? 'border-l-4 border-l-violet-400' : ''}
         ${isHovered && !isExpanded ? 'scale-[1.02]' : 'scale-100'}
       `}
      >
        <div
          className={`absolute top-0 left-0 w-1 h-full ${schedule.pinned ? 'bg-violet-400' : 'bg-gray-200'}`}
        />

        <div className="flex items-center gap-1 w-full">
          <AnimatePresence>
            {!isExpanded && (
              <motion.button
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`
                 group
                 relative flex flex-col items-center justify-center 
                 min-w-[40px] p-3 rounded-xl
                 bg-white/90 backdrop-blur-xl
                 border border-white/40
                 shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                 transition-all duration-200
                 hover:bg-violet-50/80
                 ${
                   schedule.pinned ? 'bg-violet-50/80 border-violet-200' : 'hover:border-violet-200'
                 }
               `}
                style={{ color: schedule.pinned ? '#FF77C2' : '#5C5C5C' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onTogglePin(schedule.id);
                }}
              >
                <Pin
                  className={`h-4 w-4 mb-1 transition-all duration-300 ${
                    schedule.pinned ? 'text-[#FF77C2] rotate-45 transform' : ''
                  }`}
                  style={{ color: schedule.pinned ? '#FA9FFF' : '#5C5C5C' }}
                />
                <div
                  className={`text-sm font-bold transition-colors duration-200`}
                  style={{ color: schedule.pinned ? '#FA9FFF' : '#5C5C5C' }}
                >
                  {formatTime(schedule.time)}
                </div>
              </motion.button>
            )}
          </AnimatePresence>

          <div
            className={`flex-1 ${isExpanded ? 'w-full' : 'max-w-2xl'} overflow-hidden text-ellipsis truncate`}
          >
            <ScheduleDetail
              schedule={schedule}
              onUpdate={onUpdate}
              onExpandedChange={handleDetailExpandChange}
            />
          </div>

          <AnimatePresence>
            {!isExpanded && (
              <motion.button
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => onDelete(schedule.id)}
                className={`
                 group
                 relative flex flex-col items-center justify-center 
                 min-w-[40px] h-[68px] p-4 rounded-xl
                 bg-white/90 backdrop-blur-xl
                 border border-white/40
                 shadow-[0_2px_8px_rgba(0,0,0,0.04)]
                 transition-all duration-200
                 hover:bg-violet-50/80
               `}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors duration-200" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
