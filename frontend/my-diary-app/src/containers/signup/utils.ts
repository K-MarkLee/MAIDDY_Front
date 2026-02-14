import apiClient from '@/lib/apiClient';
import { API_ENDPOINTS } from './constants';
import { SignUpFormData } from './types';

export const validatePasswords = (password: string, password2: string): string => {
  if (password !== password2) {
    return '비밀번호가 일치하지 않습니다.';
  }
  return '';
};

export const handleSignUp = async (formData: SignUpFormData) => {
  try {
    const { data } = await apiClient.post(API_ENDPOINTS.SIGNUP, formData);
    return data;
  } catch (error: any) {
    if (error.response?.data) {
      const errorData = error.response.data;
      const errorMessage =
        typeof errorData === 'object'
          ? Object.values(errorData).flat().join('\n')
          : '회원가입에 실패했습니다.';
      throw new Error(errorMessage);
    }
    throw error;
  }
};