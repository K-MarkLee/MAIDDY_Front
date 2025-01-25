'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { LogOut, UserX } from 'lucide-react';
import {
AlertDialog,
AlertDialogAction,
AlertDialogCancel,
AlertDialogContent,
AlertDialogDescription,
AlertDialogFooter,
AlertDialogHeader,
AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { API_URL } from './constants';
import Image from 'next/image'


export default function CustomSidebar() {
const router = useRouter();
const [isOpen, setIsOpen] = useState(false);
const [showLogoutAlert, setShowLogoutAlert] = useState(false);
const [showDeleteAlert, setShowDeleteAlert] = useState(false);

const handleLogout = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/api/logout/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      localStorage.removeItem('accessToken');
      router.push('/login');
    }
  } catch (error) {
    console.error('Logout error:', error);
  }
};

const handleDeleteAccount = async () => {
  try {
    const token = localStorage.getItem('accessToken');
    const response = await fetch(`${API_URL}/api/delete/`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (response.ok) {
      localStorage.removeItem('accessToken');
      router.push('/signup');
    }
  } catch (error) {
    console.error('Account deletion error:', error);
  }
};

return (
  <>
    <Button 
      variant="ghost" 
      size="icon"
      className="absolute top-4 right-4 z-[999]"
      onClick={() => setIsOpen(!isOpen)}
    >
      <Image 
        src="/Images/cat.png" 
        alt="Menu" 
        width={100}
        height={100}
        className="object-contain"
        priority
        loading="eager"
      />
    </Button>

    {isOpen && (
      <div className="fixed inset-0 z-[1000]">
        <motion.div 
          className="absolute inset-0 flex items-center justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
        >
          <motion.div 
            className="w-[280px] h-[120px] bg-white/80 backdrop-blur-xl rounded-xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"            
            initial={{ x: 280 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ isolation: 'isolate' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col gap-2 p-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center w-full px-3 py-2 rounded-xl text-gray-400 hover:bg-violet-50/80 hover:text-violet-600 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowLogoutAlert(true);
                  setIsOpen(false);
                }}
              >
                <LogOut className="mr-2 h-5 w-5" />
                <span className="text-sm font-medium">로그아웃</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center w-full px-3 py-2 rounded-xl text-gray-400 hover:bg-violet-50/80 hover:text-violet-600 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteAlert(true);
                  setIsOpen(false);
                }}
              >
                <UserX className="mr-2 h-5 w-5" />
                <span className="text-sm font-medium">회원탈퇴</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    )}

    <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
      <AlertDialogContent className="w-[280px] mx-auto rounded-xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <AlertDialogHeader>
          <AlertDialogTitle>로그아웃</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 로그아웃 하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl hover:bg-violet-50/80 hover:text-violet-600 transition-all duration-300">취소</AlertDialogCancel>
          <AlertDialogAction 
            className="rounded-xl bg-violet-600 hover:bg-violet-700 transition-all duration-300" 
            onClick={handleLogout}
          >
            로그아웃
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
      <AlertDialogContent className="w-[280px] mx-auto rounded-xl bg-white/80 backdrop-blur-xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
        <AlertDialogHeader>
          <AlertDialogTitle>회원탈퇴</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="rounded-xl hover:bg-violet-50/80 hover:text-violet-600 transition-all duration-300">취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            className="rounded-xl bg-red-600 hover:bg-red-700 transition-all duration-300"
          >
            회원탈퇴
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
);
}