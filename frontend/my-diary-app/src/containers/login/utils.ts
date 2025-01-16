import { jwtDecode } from 'jwt-decode';
import { LoginFormData, LoginResponse } from './types';
import { API_URL } from './constants';

export const setAuthToken = (token: string): void => {
  // localStorage에 저장
  localStorage.setItem('accessToken', token);
  // 쿠키에도 저장
  document.cookie = `accessToken=${token}; path=/`;
};

export const setRefreshToken = (token: string): void => {
  // localStorage에 저장
  localStorage.setItem('refreshToken', token);
  // 쿠키에도 저장
  document.cookie = `refreshToken=${token}; path=/`;
};

export const getTokens = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return { accessToken, refreshToken };
};

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  // 쿠키도 제거
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
};

export const isTokenExpiring = (token: string): boolean => {
  try {
    const decoded = jwtDecode<{ exp: number }>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp - currentTime <= 30;
  } catch {
    return true;
  }
};

export const handleLogin = async (formData: LoginFormData): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/api/users/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData)
  });

  if (!response.ok) {
    throw new Error('로그인에 실패했습니다');
  }

  const data = await response.json();
  
  if (!data.access || !data.refresh) {
    throw new Error('토큰이 없습니다');
  }

  // refresh 토큰도 저장
  setRefreshToken(data.refresh);
  
  return data;
};

export const refreshAccessToken = async (): Promise<string> => {
  const { refreshToken } = getTokens();
  if (!refreshToken) throw new Error('No refresh token available');

  const response = await fetch(`${API_URL}/api/users/token/refresh/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    removeTokens();
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  setAuthToken(data.access);
  return data.access;
};