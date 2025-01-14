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
      className="relative flex items-center justify-between w-full mb-8"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        type: "spring",
        damping: 20,
        stiffness: 100
      }}
    >
      <Button
        variant="ghost"
        onClick={() => router.push('/calendar')}
        className="bg-[#8b7ff9] hover:bg-[#7a6ff8] text-white rounded-xl"
      >
        Back
      </Button>
      <motion.div 
        className="flex-1 text-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-xl font-semibold text-pink-400">
          {date}
        </h1>
      </motion.div>
      {rightElement ? (
        <div className="w-[70px]">{rightElement}</div>
      ) : (
        <div className="w-[70px]" />
      )}
    </motion.div>
  );
}