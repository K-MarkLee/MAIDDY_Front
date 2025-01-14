import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trash2, Clock } from 'lucide-react';
import ScheduleDetail from './ScheduleDetail';

interface Schedule {
  id: number;
  time: string;
  pinned: boolean;
  index?: number;
}

interface ScheduleCardProps {
  schedule: Schedule;
  onDelete: (id: number) => void;
  onTogglePin: (id: number) => void;
  onUpdate: (id: number, data: any) => void;
}

export default function ScheduleCard({
  schedule,
  onDelete,
  onTogglePin,
  onUpdate
}: ScheduleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const formatTime = (time) => {
    try {
      const [hours, minutes] = time.split(':');
      return `${hours}:${minutes}`;
    } catch {
      return time;
    }
  };

  const handleDetailExpandChange = useCallback((expanded) => {
    setIsExpanded(expanded);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ 
        duration: 0.3,
        ease: "easeOut",
        delay: schedule.index ? schedule.index * 0.1 : 0
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="mb-6 relative"
    >
      <motion.div 
        className={`
          relative overflow-hidden
          flex items-center justify-between p-16 
          w-full
          bg-white/80 backdrop-blur-xl
          rounded-2xl
          border border-white/40
          transition-all duration-300 ease-in-out
          shadow-[0_4px_8px_rgba(0,0,0,0.04)]
          hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)]
          ${schedule.pinned ? 'border-l-4 border-l-violet-400' : ''}
          ${isHovered && !isExpanded ? 'scale-[1.02]' : 'scale-100'}
        `}
      >
        <div className={`absolute top-0 left-0 w-1 h-full ${schedule.pinned ? 'bg-violet-400' : 'bg-gray-200'}`} />
        
        <div className="flex items-center gap-12 flex-1">
          <motion.div 
            className={`
              relative flex flex-col items-center justify-center 
              min-w-[40px] p-3 rounded-xl
              bg-white/90 backdrop-blur-xl
              border border-white/40
              shadow-[0_2px_8px_rgba(0,0,0,0.04)]
            `}
            whileHover={{ scale: 1.05 }}
          >
            <Clock className="h-4 w-4 mb-1 text-violet-600" />
            <div className="text-sm font-bold text-violet-600">
              {formatTime(schedule.time)}
            </div>
          </motion.div>
          
          <div className="flex-1 max-w-2xl overflow-hidden text-ellipsis truncate">
            <ScheduleDetail
              schedule={schedule}
              onUpdate={onUpdate}
              onExpandedChange={handleDetailExpandChange}
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <AnimatePresence>
            {!isExpanded && isHovered && (
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onDelete(schedule.id)}
                className="p-1 rounded-xl bg-white/80 backdrop-blur-xl border border-white/40 hover:bg-violet-50/80 transition-colors duration-200"
              >
                <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors duration-200" />
              </motion.button>
            )}
          </AnimatePresence>
          
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin(schedule.id);
            }}
            className={`
              p-1 rounded-xl bg-white/80 backdrop-blur-xl border border-white/40
              transition-colors duration-200
              ${schedule.pinned ? 'bg-violet-100/80' : 'hover:bg-violet-50/80'}
            `}
          >
            <Star 
              className={`h-5 w-5 transition-all duration-300 ${
                schedule.pinned 
                  ? 'fill-violet-400 text-violet-400 drop-shadow-md' 
                  : 'text-gray-400 hover:text-violet-400'
              }`}
            />
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}