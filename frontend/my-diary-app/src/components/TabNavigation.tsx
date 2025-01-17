'use client'

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CalendarDays, ListTodo, BookText } from 'lucide-react';

interface TabNavigationProps {
  date: string;
  activeTab: 'schedule' | 'todo' | 'diary';
}

const TabNavigation = ({ date, activeTab }: TabNavigationProps) => {
  const router = useRouter();

  const tabs = [
    { id: 'schedule', label: '일정', icon: CalendarDays },
    { id: 'todo', label: 'TO DO', icon: ListTodo },
    { id: 'diary', label: '일기', icon: BookText },
  ];

  return (
    <motion.div 
      className="w-full bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] p-1 mx-auto mb-2"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.3,
        ease: "easeOut"
      }}
    >
      <div className="flex justify-around items-center px-2">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTab;
          const Icon = tab.icon;
          
          return (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/${tab.id}/${date}`)}
              className={`flex flex-col items-center gap-1 py-1.5 px-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'bg-violet-100/80 text-violet-600'
                  : 'text-gray-400 hover:bg-violet-50/80 hover:text-violet-600'
              }`}
            >
              <div className={`flex items-center justify-center transition-transform duration-300 ${
                isActive ? 'scale-110' : 'scale-100'
              }`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className="text-xs font-medium">
                {tab.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

export default TabNavigation;