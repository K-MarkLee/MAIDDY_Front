'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SharedLayout from '@/components/layout/SharedLayout';
import TabNavigation from '@/components/TabNavigation';
import { TodoItem } from './types';
import { fetchTodos, addTodo, deleteTodo, toggleTodo } from './utils';
import TodoCard from './TodoCard';
import './styles.css';
import PageTitle from '@/components/common/PageTitle';

interface TodoPageProps {
  params: {
    date: string;
  };
}

const TodoPage = ({ params }: TodoPageProps) => {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [isAddingTodo, setIsAddingTodo] = useState(false);

  const loadTodos = useCallback(async () => {
    try {
      const data = await fetchTodos(params.date);
      setTodos(data);
    } catch (error) {
      console.error('할일 목록 로딩 실패:', error);
      if (error instanceof Error && error.message.includes('token')) {
        window.location.href = '/login';
      }
    }
  }, [params.date]);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    try {
      const savedTodo = await addTodo(newTodo, params.date);
      setTodos([...todos, savedTodo]);
      setNewTodo('');
      setIsAddingTodo(false);
    } catch (error) {
      console.error('할일 추가 실패:', error);
      alert('할일 추가에 실패했습니다');
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      await deleteTodo(id);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error('할일 삭제 실패:', error);
      alert('할일 삭제에 실패했습니다');
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      const updatedTodo = await toggleTodo(id, params.date);
      setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === id ? updatedTodo : todo)));
    } catch (error) {
      console.error('할일 상태 변경 실패:', error);
      alert('할일 상태 변경에 실패했습니다');
    }
  };

  return (
    <SharedLayout>
      <div className="p-8 pt-16 pb-0">
        <PageTitle date={params.date} />
        <TabNavigation date={params.date} activeTab="todo" />
      </div>

      <div className="px-8 overflow-y-auto h-[calc(100%-200px)] pt-4 pb-24 relative z-10">
        <div className="space-y-4 transform -translate-y-8">
          <AnimatePresence>
            {todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onDelete={handleDeleteTodo}
                onToggle={handleToggleTodo}
              />
            ))}
          </AnimatePresence>

          <AnimatePresence>
            {isAddingTodo && (
              <motion.form
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                onSubmit={handleAddTodo}
                className="w-full bg-white/80 backdrop-blur-xl rounded-xl p-4 border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
              >
                <div className="space-y-4">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="새로운 할일을 입력하세요..."
                    className="w-full p-3 bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 focus:ring-1 focus:ring-[#8b7ff9] focus:border-[#8b7ff9]"
                    style={{ color: '#5C5C5C' }}
                    autoFocus
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
                        setIsAddingTodo(false);
                        setNewTodo('');
                      }}
                      className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-200 hover:border-gray-300"
                    >
                      취소
                    </Button>
                  </div>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>

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
          onClick={() => setIsAddingTodo(true)}
          style={{ bottom: '105px', left: '285px' }}
          className="fixed bg-[#8b7ff9] text-white p-4 rounded-full shadow-lg flex items-center justify-center z-50 border-2 border-white hover:border-[#7a6ff8] transition-colors"
        >
          <Plus className="h-6 w-6" />
        </motion.button>
      </div>
    </SharedLayout>
  );
};

export default TodoPage;