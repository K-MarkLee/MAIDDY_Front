// src/lib/auth.ts
import { jwtDecode } from 'jwt-decode';

interface TokenResponse {
  access: string;
  refresh: string;
}

interface DecodedToken {
  exp: number;
  // 기타 필요한 토큰 페이로드 타입 정의
}

export const setTokens = (tokens: TokenResponse) => {
  localStorage.setItem('accessToken', tokens.access);
  localStorage.setItem('refreshToken', tokens.refresh);
};

export const getTokens = () => {
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  return { accessToken, refreshToken };
};

export const removeTokens = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
};

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

export const refreshAccessToken = async () => {
  const { refreshToken } = getTokens();
  if (!refreshToken) throw new Error('No refresh token available');

  try {
    const response = await fetch('http://your-api/users/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: refreshToken }),
    });

    if (!response.ok) throw new Error('Token refresh failed');

    const data = await response.json();
    localStorage.setItem('accessToken', data.access);
    return data.access;
  } catch (error) {
    removeTokens();
    throw error;
  }
};
