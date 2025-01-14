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
      <div className="signup-container">
        <div className="signup-content">
          <div className="signup-header">
            <div className="signup-logo">
              <Image
                src="/images/logo.png"
                alt="Signup Logo"
                width={160}
                height={160}
                className="rounded-full object-cover"
                priority
              />
            </div>
            <h1 className="signup-title">Create Account</h1>
          </div>

          <form onSubmit={handleSubmit} className="signup-form">
            {error && <div className="signup-error">{error}</div>}

            <div className="space-y-2">
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
                className="signup-input"
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

            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => router.push('/login')}
                className="signup-link"
              >
                Already have an account?
              </button>
            </div>
          </form>
        </div>
      </div>
    </SharedLayout>
  )
}