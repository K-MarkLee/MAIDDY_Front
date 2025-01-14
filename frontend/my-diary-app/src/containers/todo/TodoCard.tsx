'use client'

import { motion } from 'framer-motion';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface TodoProps {
  todo: {
    id: number;
    content: string;
    is_completed: boolean;
  };
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

export default function TodoCard({ todo, onDelete, onToggle }: TodoProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="mb-4"
    >
      <motion.div 
        className={`
          relative overflow-hidden
          flex items-center justify-between p-4
          w-full
          bg-white/80 backdrop-blur-xl
          rounded-2xl
          border border-white/40
          transition-all duration-300 ease-in-out
          shadow-[0_4px_8px_rgba(0,0,0,0.04)]
          hover:shadow-[0_8px_16px_rgba(0,0,0,0.08)]
          ${isHovered ? 'scale-[1.02]' : ''}
        `}
      >
        <div className="flex items-center flex-1">
          <input
            type="checkbox"
            checked={todo.is_completed}
            onChange={() => onToggle(todo.id)}
            className="todo-checkbox"
          />
          <span className={`ml-8 ${todo.is_completed ? 'line-through text-gray-400' : 'text-gray-900'}`}>
            {todo.content}
          </span>
        </div>

        <motion.button
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : 20 }}
          onClick={() => onDelete(todo.id)}
          className="p-1 rounded-xl bg-white/80 backdrop-blur-xl border border-white/40 hover:bg-violet-50/80 transition-colors duration-200"
        >
          <Trash2 className="h-5 w-5 text-gray-400 hover:text-red-500 transition-colors duration-200" />
        </motion.button>
      </motion.div>
    </motion.div>
  );
}