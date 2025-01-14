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
      window.location.href = '/calendar'
    } catch (error) {
      console.error('로그인 실패:', error)
      setError('이메일 또는 비밀번호가 올바르지 않습니다')
    }
  }

  return (
    <SharedLayout>
      <div className="login-container">
        <div className="login-content">
          <div className="login-header">
            <div className="login-logo">
              <Image
                src="/images/logo.png"
                alt="Login Logo"
                width={160}
                height={160}
                className="rounded-full object-cover"
                priority
              />
            </div>
            <h1 className="login-title">Welcome</h1>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
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

            <div className="text-center mt-4">
              <button 
                type="button"
                onClick={() => router.push('/signup')}
                className="login-link"
              >
                Create an account
              </button>
              <div className="mt-2">
                <button 
                  type="button"
                  className="login-link"
                >
                  Social login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SharedLayout>
  )
}
