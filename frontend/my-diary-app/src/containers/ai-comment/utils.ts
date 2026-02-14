import apiClient from '@/lib/apiClient';
import { getUserIdFromToken } from '@/lib/auth';
import { DiaryData } from './types';
import { API_ENDPOINTS } from './constants';

export const fetchDiaryContent = async (date: string): Promise<DiaryData | null> => {
  const { data: diaries } = await apiClient.get(API_ENDPOINTS.DIARIES);

  const todayDiary = diaries.find((diary: DiaryData) => diary.select_date === date);
  if (!todayDiary) return null;

  const { data } = await apiClient.get(`${API_ENDPOINTS.DIARIES}${todayDiary.id}/`);
  return data;
};

interface AiFeedbackRequest {
  select_date: string;
}

interface FeedbackResponse {
  data: {
    feedback: string;
  };
}

export const generateAiResponse = async (params: AiFeedbackRequest): Promise<string> => {
  const userId = getUserIdFromToken();

  if (!userId) {
    throw new Error('사용자 정보를 찾을 수 없습니다');
  }

  const { data } = await apiClient.post<FeedbackResponse>(API_ENDPOINTS.AI_FEEDBACK, {
    user_id: userId,
    select_date: params.select_date,
  });

  return data.data.feedback;
};
