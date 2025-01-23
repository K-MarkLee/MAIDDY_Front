'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import SharedLayout from '@/components/layout/SharedLayout'
import { SignUpFormData } from './types'
import { validatePasswords, handleSignUp } from './utils'
import './styles.css'
import { motion } from 'framer-motion'

export default function SignUpForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<SignUpFormData>({
    email: '',
    username: '',
    password: '',
    password2: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => { 
    e.preventDefault()
    setError('')

    const passwordError = validatePasswords(formData.password, formData.password2)
    if (passwordError) {
      setError(passwordError)
      return
    }

    try {
      const data = await handleSignUp(formData)
      console.log('회원가입 성공:', data)
      router.push('/login')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('An unexpected error occurred')
      }
      console.error('회원가입 에러:', err)
    }
  }

  return (
    <SharedLayout>
      <motion.div 
        className="signup-container"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100
        }}
      >
        <div className="signup-content">
          <motion.div 
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
              className="signup-logo"
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
                alt="Signup Logo"
                width={160}
                height={160}
                className="rounded-full object-cover"
                priority
              />
            </motion.div>

            <Image
              className="signup-header flex justify-center"
              src="/Images/create.png"
              alt="Login Title"
              width={320}
              height={160}
              priority
              className="object-contain"
            />
          </motion.div>

          <motion.form 
            onSubmit={handleSubmit} 
            className="signup-form"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              type: "spring",
              damping: 20,
              stiffness: 100,
              delay: 0.4
            }}
          >
            {error && <div className="signup-error">{error}</div>}

            <div className="space-y-6">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="signup-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
                className="signup-input focus:ring-0 focus:border-gray-200"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                className="signup-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password2">Confirm Password</Label>
              <Input
                id="password2"
                type="password"
                placeholder="Confirm your password"
                value={formData.password2}
                onChange={(e) => setFormData({ ...formData, password2: e.target.value })}
                required
                className="signup-input"
              />
            </div>

            <Button type="submit" className="signup-button">
              Sign up
            </Button>

            <div className="text-center mt-2">
              <button 
                type="button"
                onClick={() => router.push('/login')}
                className="signup-link"
              >
                Already have an account?
              </button>
            </div>
          </motion.form>
        </div>
      </motion.div>
    </SharedLayout>
  )
}