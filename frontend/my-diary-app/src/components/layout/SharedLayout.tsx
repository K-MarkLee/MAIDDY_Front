'use client'

import { ReactNode } from 'react'
import { SharedLayoutProps } from './types'
import BottomNavigation from './BottomNavigation'

const SharedLayout = ({ children, contentClass = "w-[402px] h-[872px]" }: SharedLayoutProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-100 via-violet-100 to-cyan-100 flex items-center justify-center p-4">
      <div className={`${contentClass} relative bg-white/20 backdrop-blur-xl overflow-hidden rounded-[72px] shadow-[0_8px_32px_rgba(0,0,0,0.12)] border border-white/20 
        before:content-[''] before:absolute before:inset-0 before:rounded-[72px] before:border-[14px] before:border-white/90 before:pointer-events-none
        after:content-[''] after:absolute after:inset-0 after:rounded-[72px] after:border-[1px] after:border-white/40 after:pointer-events-none`}>
        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-center pointer-events-none">
          <div className="w-[120px] h-[24px] bg-black rounded-full" />
        </div>
  
        {/* Content Container */}
        <div className="h-full pt-7 bg-white/20 relative">
          {children}
          <BottomNavigation />
        </div>
      </div>
    </div>
  );
};

export default SharedLayout;