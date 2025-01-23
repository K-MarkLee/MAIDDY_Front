import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  required?: boolean;
}

interface TimePickerColumnProps {
  items: string[];
  value: string;
  onChange: (value: string) => void;
}

const TimePickerColumn = ({ items, value, onChange }: TimePickerColumnProps) => {
  const ITEM_HEIGHT = 32;
  const centerOffset = (128 - ITEM_HEIGHT) / 2;
  const selectedIndex = items.indexOf(value);
  const [offset, setOffset] = useState(-selectedIndex * ITEM_HEIGHT);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      const targetOffset = -items.indexOf(value) * ITEM_HEIGHT;
      setOffset(targetOffset);
    }
  }, [value, items, isDragging]);

  const handleDragEnd = (_: any, info: PanInfo) => {
    setIsDragging(false);
    const newOffset = offset + info.offset.y;
    const rawIndex = -Math.round(newOffset / ITEM_HEIGHT);
    const boundedIndex = Math.max(0, Math.min(items.length - 1, rawIndex));
    const finalOffset = -boundedIndex * ITEM_HEIGHT;
    setOffset(finalOffset);
    onChange(items[boundedIndex]);
  };

  return (
    <div className="flex-1 relative h-[128px] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white via-transparent to-white z-10" />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="h-8 w-full bg-violet-50/50 rounded-lg" />
      </div>
      <motion.div
        drag="y"
        dragConstraints={{ top: -((items.length - 1) * ITEM_HEIGHT), bottom: 0 }}
        dragElastic={0.3}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={handleDragEnd}
        animate={{ y: offset + centerOffset }}
        className="absolute w-full touch-none"
      >
        {items.map((item) => (
          <div
            key={item}
            className={`h-8 flex items-center justify-center text-sm transition-colors
              ${value === item ? 'text-violet-600 font-medium' : 'text-gray-600'}
            `}
          >
            {item}
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function TimePicker({ value, onChange, required = false }: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(() => {
    if (!value) return { hours: '12', minutes: '00', period: 'AM' };
    const [h, m] = value.split(':');
    const hours = parseInt(h);
    return {
      hours: String(hours > 12 ? hours - 12 : hours || 12).padStart(2, '0'),
      minutes: m,
      period: hours >= 12 ? 'PM' : 'AM'
    };
  });

  const hourNumbers = Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0'));
  const minuteNumbers = Array.from({ length: 60 }, (_, i) => String(i).padStart(2, '0'));

  const handleTimeConfirm = () => {
    let hours = parseInt(internalValue.hours);
    if (internalValue.period === 'PM' && hours !== 12) hours += 12;
    if (internalValue.period === 'AM' && hours === 12) hours = 0;
    const timeString = `${String(hours).padStart(2, '0')}:${internalValue.minutes}`;
    onChange(timeString);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2 bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 focus:ring-1 focus:ring-[#8b7ff9] focus:border-[#8b7ff9] cursor-pointer flex items-center gap-2"
      >
        <Clock className="h-4 w-4 text-violet-600" />
        <span className="text-gray-600 text-sm">
          {value ? `${internalValue.hours}:${internalValue.minutes} ${internalValue.period}` : '시간 선택'}
        </span>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 10, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -1 }}
            className="absolute mb-1 p-3 bg-white/95 backdrop-blur-xl rounded-xl border border-white/40 shadow-lg z-50"
            style={{ width: '200px', bottom: '-200%' }}
          >
            <div className="text-center mb-3 text-lg text-violet-600 font-medium">
              {`${internalValue.hours}:${internalValue.minutes} ${internalValue.period}`}
            </div>

            <div className="flex space-x-2 mb-3">
              <TimePickerColumn
                items={hourNumbers}
                value={internalValue.hours}
                onChange={(hours) => setInternalValue(prev => ({ ...prev, hours }))}
              />
              <TimePickerColumn
                items={minuteNumbers}
                value={internalValue.minutes}
                onChange={(minutes) => setInternalValue(prev => ({ ...prev, minutes }))}
              />
              <div className="flex-1">
                <div className="space-y-2">
                  {['AM', 'PM'].map((period) => (
                    <div
                      key={period}
                      onClick={() => setInternalValue(prev => ({ ...prev, period }))}
                      className={`h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer
                        ${internalValue.period === period 
                          ? 'bg-violet-100 text-violet-600 font-medium' 
                          : 'text-gray-600 hover:bg-gray-100'}
                      `}
                    >
                      {period}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-1">
              <Button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-100 text-gray-700 hover:bg-gray-200 h-7 text-xs px-2"
              >
                취소
              </Button>
              <Button
                type="button"
                onClick={handleTimeConfirm}
                className="bg-violet-100 text-violet-600 hover:bg-violet-200 h-7 text-xs px-2"
              >
                확인
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}