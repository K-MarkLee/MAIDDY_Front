'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SharedLayout from '@/components/layout/SharedLayout'
import { LoginFormData } from './types'
import { handleLogin, setAuthToken } from './utils'
import './styles.css'
import { motion } from 'framer-motion'

export default function LoginForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
  
    try {
      const data = await handleLogin(formData)
      setAuthToken(data.access)
      // refresh 토큰은 handleLogin 내부에서 자동으로 저장됩니다
      window.location.href = '/calendar'
    } catch (error) {
      console.error('로그인 실패:', error)
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
    }
  }

  return (
    <SharedLayout>
      <motion.div 
        className="login-container"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100
        }}
      >
        <div className="login-content">
          <motion.div 
            className="login-header"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.2
            }}
          >
            <motion.div 
              className="login-logo"
              initial={{ y: -100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                type: "spring",
                damping: 20,
                stiffness: 100,
                delay: 0.3
              }}
            >
              <Image
                src="/Images/1.png"
                alt="Login Logo"
                width={160} 
                height={160}
                className="rounded-full object-cover"
                priority
              />
            </motion.div>
            
            <Image
              src="/Images/logo1.png"
              alt="Login Title"
              width={10000}
              height={1000}
              priority
              className="object-contain"
            />
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="login-form"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.4
            }}
          >
            {error && <div className="login-error">{error}</div>}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="login-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="login-input"
              />
            </div>

            <Button type="submit" className="login-button">
              Log in
            </Button>

            <div className="text-center mt-2">
              <button 
                type="button"
                onClick={() => router.push('/signup')}
                className="login-link"
              >
                Create an account
              </button>
              <div className="mt-3">
                <button 
                  type="button"
                  className="login-link"
                >
                  Social login
                </button>
              </div>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </SharedLayout>
  )
}
