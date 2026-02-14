// src/lib/auth.ts
// 토큰 관리의 단일 진입점 (Single Source of Truth)
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  exp: number;
  user_id?: number;
}

// === Token Storage ===

export const setTokens = (access: string, refresh: string): void => {
  localStorage.setItem('accessToken', access);
  localStorage.setItem('refreshToken', refresh);
  // 쿠키에도 저장 (middleware에서 사용)
  document.cookie = `accessToken=${access}; path=/`;
  document.cookie = `refreshToken=${refresh}; path=/`;
};

export const getTokens = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return { accessToken, refreshToken };
};

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
  document.cookie = 'refreshToken=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
};

// === Token Utilities ===

export const isTokenExpiring = (token: string): boolean => {
  try {
    const decoded = jwtDecode<DecodedToken>(token);
    const currentTime = Math.floor(Date.now() / 1000);
    // 만료 30초 전부터 갱신 시도
    return decoded.exp - currentTime <= 30;
  } catch {
    return true;
  }
};

export const getUserIdFromToken = (): number | null => {
  const { accessToken } = getTokens();
  if (!accessToken) return null;

  try {
    const decoded = jwtDecode<DecodedToken>(accessToken);
    return decoded.user_id ?? null;
  } catch {
    return null;
  }
};

// === Token Refresh ===

export const refreshAccessToken = async (): Promise<string> => {
  const { refreshToken } = getTokens();
  if (!refreshToken) throw new Error('No refresh token available');

  // apiClient를 import하면 순환 참조가 생기므로 직접 fetch 사용
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/token/refresh/`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    }
  );

  if (!response.ok) {
    removeTokens();
    throw new Error('Token refresh failed');
  }

  const data = await response.json();
  // access 토큰만 갱신
  localStorage.setItem('accessToken', data.access);
  document.cookie = `accessToken=${data.access}; path=/`;
  return data.access;
};
