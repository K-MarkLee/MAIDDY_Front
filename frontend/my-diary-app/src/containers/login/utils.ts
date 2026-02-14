import { jwtDecode } from 'jwt-decode';
import apiClient from '@/lib/apiClient';
import { setTokens, removeTokens, getTokens } from '@/lib/auth';
import { LoginFormData, LoginResponse } from './types';
import { API_ENDPOINTS } from './constants';

export { setTokens, removeTokens, getTokens };

export const setAuthToken = (token: string): void => {
  localStorage.setItem('accessToken', token);
  document.cookie = `accessToken=${token}; path=/`;
};

export const handleLogin = async (formData: LoginFormData): Promise<LoginResponse> => {
  const { data } = await apiClient.post(API_ENDPOINTS.LOGIN, formData);

  if (!data.access || !data.refresh) {
    throw new Error('토큰이 없습니다');
  }

  // 토큰 저장
  setTokens(data.access, data.refresh);

  return data;
};
