import { LoginFormData, LoginResponse } from './types'
import { API_URL } from './constants'

export const handleLogin = async (formData: LoginFormData): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/users/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  })

  if (!response.ok) {
    throw new Error('로그인에 실패했습니다')
  }

  const data = await response.json()
  
  if (!data.access) {
    throw new Error('토큰이 없습니다')
  }

  return data
}

export const setAuthToken = (token: string): void => {
  localStorage.setItem('accessToken', token)
}