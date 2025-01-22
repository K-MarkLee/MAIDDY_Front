'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ProtectedRouteProps } from './types'
import { checkAuth } from './utils'

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter()

  useEffect(() => {
    if (!checkAuth()) {
      router.push('/login')
    }
  }, [router])

  return <>{children}</>
}