import apiClient from '@/lib/apiClient';
import { ChatMessage } from './types';
import { API_ENDPOINTS } from './constants';

export const fetchInitialMessage = async (): Promise<ChatMessage> => {
  const { data } = await apiClient.get(API_ENDPOINTS.RECOMMEND);
  return {
    message: data.initial_message || '안녕하세요! 메이디예요',
    isBot: true,
  };
};
