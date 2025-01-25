import { ReactNode } from 'react'
import { SharedLayoutProps } from './types'
import BottomNavigation from './BottomNavigation'
import Sidebar from '@/containers/calendar/Sidebar'

const SharedLayout = ({ children }: SharedLayoutProps) => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="relative w-[374px] h-[810px] min-w-[374px] min-h-[810px]">
        <div className="absolute -inset-3 bg-white rounded-[65px]" />
        <div className="absolute -inset-2 bg-neutral-800 rounded-[62px]" />
        
        <div className="relative w-full h-full bg-gradient-to-br from-rose-100 via-violet-100 to-cyan-100 backdrop-blur-xl overflow-hidden rounded-[55px] shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
          <div className="h-full relative overflow-hidden">
            {/* Sidebar */}
            <div className="absolute inset-x-0 top-0 h-40 bg-transparent z-30">
              <div className="h-7 flex items-center justify-center">
                <div className="w-[120px] h-[24px] bg-black rounded-full" />
              </div>
              <Sidebar />
            </div>
            
            {/* Content */}
            <div className="h-full pt-10 bg-white/20 z-40">
              <div className="h-full pb-24 overflow-y-auto relative">
                {children}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0">
                <BottomNavigation />
              </div>
            </div>
          </div>
        </div>
        
        <div className="absolute -right-1 top-24 w-1 h-16 bg-neutral-800 rounded-r-lg" />
        <div className="absolute -left-1 top-20 w-1 h-24 bg-neutral-800 rounded-l-lg" />
        <div className="absolute -left-1 top-60 w-1 h-24 bg-neutral-800 rounded-l-lg" />
      </div>
    </div>
  )
}

export default SharedLayout