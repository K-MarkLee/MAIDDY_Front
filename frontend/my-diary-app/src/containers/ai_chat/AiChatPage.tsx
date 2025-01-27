'use client';

import { useState, useEffect, useRef } from 'react';
// router import 제거
import SharedLayout from '@/components/layout/SharedLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  content: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function AiChatPage() {
  // router 제거
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: '안녕하세요 전 MAIDDY에요! 반가워요^^',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [currentImage, setCurrentImage] = useState('/Images/maiddy.png');

  // ... 나머지 로직은 동일

  return (
    <SharedLayout>
      <motion.div
        className="flex flex-col h-full relative"
        initial={{ y: 0, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: 'spring',
          damping: 20,
          stiffness: 100,
        }}
      >
        <div className="py-2 px-4 flex items-center justify-center gap-2 border-b bg-transparent">
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
              className="object-contain -mb-4"
            />
          </motion.div>
          <motion.div
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
              src="/Images/chat.png"
              alt="Login Title"
              width={120}
              height={160}
              priority
              className="object-contain signup-header flex justify-center"
            />
          </motion.div>
        </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto px-4 py-2">
            <div className="flex flex-col space-y-4">
              <AnimatePresence>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.2 }}
                      style={{ color: message.sender === 'ai' ? '#5C5C5C' : 'white' }}
                      className={`
                        max-w-[80%] p-3 rounded-xl
                        ${message.sender === 'user' ? 'bg-[#8b7ff9]' : 'bg-white shadow-sm'}
                      `}
                    >
                      <p
                        style={{ color: message.sender === 'ai' ? '#5C5C5C' : 'inherit' }}
                        className="text-sm leading-relaxed"
                      >
                        {message.content}
                      </p>
                      <span
                        style={{ color: message.sender === 'ai' ? '#5C5C5C' : 'inherit' }}
                        className="text-xs opacity-70 mt-1 block"
                      >
                        {message.timestamp.toLocaleTimeString('ko-KR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </motion.div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <div ref={messagesEndRef} className="pt-3" />
            </div>
          </div>

          {/* Input Container */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, type: 'spring' }}
            className="px-8 pb-10"
          >
            <form onSubmit={sendMessage}>
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex items-center p-2"
              >
                <Input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 bg-transparent border-0 focus:ring-1 focus:ring-[#8b7ff9]"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  disabled={!newMessage.trim() || isLoading}
                  className="bg-[#8b7ff9] text-white hover:bg-[#7a6ff8] ml-2 w-10 h-10 p-0"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </motion.div>
            </form>
          </motion.div>
        </motion.div>
      </SharedLayout>
    );
  }
