'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface PageTitleProps {
  date: string;
  rightElement?: React.ReactNode;
  dateClassName?: string;
}

export default function PageTitle({ date, rightElement, dateClassName }: PageTitleProps) {
  const router = useRouter();
  const [isFirstVisit, setIsFirstVisit] = useState(true);

  useEffect(() => {
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setIsFirstVisit(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isFirstVisit]); // isFirstVisit 의존성 추가

  return (
    <motion.div
      className="grid grid-cols-[auto_1fr_auto] gap-4 items-center w-full mb-8 h-10 relative z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: 'spring',
        damping: 20,
        stiffness: 100,
      }}
    >
      <div className="justify-self-start z-50 pointer-events-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/calendar')}
          className="bg-[#8b7ff9] hover:bg-[#7a6ff8] text-white rounded-xl pointer-events-auto relative z-50"
        >
          Back
        </Button>
      </div>

      <motion.div
        className="justify-self-center z-50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className={`text-xl font-semibold text-[#FF77C2] ${dateClassName || 'ml-3'}`}>
          {date}
        </h1>
      </motion.div>

      <div className="justify-self-end z-50 pointer-events-auto">
        {rightElement ? (
          <div className="relative z-50 pointer-events-auto">{rightElement}</div>
        ) : (
          <div className="w-[70px]" />
        )}
      </div>
    </motion.div>
  );
}