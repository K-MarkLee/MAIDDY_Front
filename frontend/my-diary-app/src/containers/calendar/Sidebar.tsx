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
      className="absolute top-4 right-4 z-50"
      onClick={() => setIsOpen(!isOpen)}
    >
      <img src="/Images/cat.png" alt="Menu" className="h-6 w-6 object-contain" />
    </Button>

    {isOpen && (
      <>
        <motion.div 
          className="fixed right-0 bottom-4 w-[280px] h-[120px] z-[100] bg-white/80 backdrop-blur-xl rounded-l-2xl border border-white/40 shadow-[0_4px_24px_rgba(0,0,0,0.04)]"
          initial={{ x: 280 }}
          animate={{ x: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <div className="flex flex-col gap-2 mt-4 p-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center w-full px-3 py-2 rounded-xl text-gray-400 hover:bg-violet-50/80 hover:text-violet-600 transition-all duration-300"
              onClick={() => {
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
              className="flex items-center w-full px-3 py-2 rounded-xl text-red-600 hover:bg-red-50/80 transition-all duration-300"
              onClick={() => {
                setShowDeleteAlert(true);
                setIsOpen(false);
              }}
            >
              <UserX className="mr-2 h-5 w-5" />
              <span className="text-sm font-medium">회원탈퇴</span>
            </motion.button>
          </div>
        </motion.div>
        <motion.div 
         className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[90]"
         initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
          onClick={() => setIsOpen(false)}
        />
      </>
    )}

    <AlertDialog open={showLogoutAlert} onOpenChange={setShowLogoutAlert}>
      <AlertDialogContent className="w-[280px] mx-auto rounded-lg bg-white/80 backdrop-blur-xl border border-white/40">
        <AlertDialogHeader>
          <AlertDialogTitle>로그아웃</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 로그아웃 하시겠습니까?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-violet-50/80 hover:text-violet-600">취소</AlertDialogCancel>
          <AlertDialogAction 
            className="bg-violet-600 hover:bg-violet-700" 
            onClick={handleLogout}
          >
            로그아웃
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>

    <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
      <AlertDialogContent className="w-[280px] mx-auto rounded-lg bg-white/80 backdrop-blur-xl border border-white/40">
        <AlertDialogHeader>
          <AlertDialogTitle>회원탈퇴</AlertDialogTitle>
          <AlertDialogDescription>
            정말로 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="hover:bg-violet-50/80 hover:text-violet-600">취소</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700"
          >
            회원탈퇴
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </>
);
}