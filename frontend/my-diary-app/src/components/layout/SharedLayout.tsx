'use client'

import { ReactNode } from 'react'
import { SharedLayoutProps } from './types'
import BottomNavigation from './BottomNavigation'

const SharedLayout = ({ children, contentClass = "w-[374px] h-[810px]" }: SharedLayoutProps) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* 가장 바깥쪽 흰색 테두리 */}
      <div className="relative">
        {/* 흰색 외곽 테두리 */}
        <div className="absolute -inset-3 bg-white rounded-[65px]"></div>
        
        {/* 검은색 내부 테두리 */}
        <div className="absolute -inset-2 bg-neutral-800 rounded-[62px]"></div>

        {/* 메인 컨테이너 */}
        <div className={`${contentClass} relative bg-gradient-to-br from-rose-100 via-violet-100 to-cyan-100 backdrop-blur-xl overflow-hidden rounded-[55px] shadow-[0_8px_32px_rgba(0,0,0,0.12)]
          before:content-[''] before:absolute before:inset-0 before:rounded-[55px] before:pointer-events-none
          after:content-[''] after:absolute after:inset-0 after:rounded-[55px] after:pointer-events-none`}>
          
          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 h-7 flex items-center justify-center pointer-events-none">
            <div className="w-[120px] h-[24px] bg-black rounded-full" />
          </div>
    
          {/* Content Container */}
          <div className="h-full pt-10 bg-white/20 relative">
            {children}
            <BottomNavigation />
          </div>
        </div>

        {/* 측면 버튼들 */}
        <div className="absolute -right-1 top-24 w-1 h-16 bg-neutral-800 rounded-r-lg"></div>
        <div className="absolute -left-1 top-20 w-1 h-24 bg-neutral-800 rounded-l-lg"></div>
        <div className="absolute -left-1 top-60 w-1 h-24 bg-neutral-800 rounded-l-lg"></div>
      </div>
    </div>
  );
};

export default SharedLayout;