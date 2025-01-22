import { ChatMessage } from './types';
import { API_URL, API_ENDPOINTS } from './constants';

export const fetchInitialMessage = async (): Promise<ChatMessage> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = '/login';
    throw new Error('인증이 필요합니다');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.CHATBOT}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch chatbot data');
  }

  const data = await response.json();
  return {
    message: data.initial_message || '안녕하세요! 메이디예요 🌟',
    isBot: true
  };
};