'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface PageTitleProps {
  date: string;
  rightElement?: React.ReactNode;
}

export default function PageTitle({ date, rightElement }: PageTitleProps) {
  const router = useRouter()
  const [isFirstVisit, setIsFirstVisit] = useState(true)
  
  useEffect(() => {
    if (isFirstVisit) {
      const timer = setTimeout(() => {
        setIsFirstVisit(false)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [])
  
  return (
    <motion.div
      className="grid grid-cols-[auto_1fr_auto] gap-4 items-center w-full mb-8 h-10 relative z-50"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100
      }}
    >
      {/* Back button */}
      <div className="justify-self-start z-50 pointer-events-auto">
        <Button
          variant="ghost"
          onClick={() => router.push('/calendar')}
          className="bg-[#8b7ff9] hover:bg-[#7a6ff8] text-white rounded-xl pointer-events-auto relative z-50"
        >
          Back
        </Button>
      </div>
      
      {/* Centered date */}
      <motion.div
        className="justify-self-center z-50"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-xl font-semibold text-[#FF77C2]">
          {date}
        </h1>
      </motion.div>
      
      {/* Right element */}
      <div className="justify-self-end z-50 pointer-events-auto">
        {rightElement ? (
          <div className="relative z-50 pointer-events-auto">
            {rightElement}
          </div>
        ) : (
          <div className="w-[70px]" />
        )}
      </div>
    </motion.div>
  );
}