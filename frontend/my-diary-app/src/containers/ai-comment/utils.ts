import { DiaryData } from './types';
import { API_URL, API_ENDPOINTS } from './constants';

export const fetchDiaryContent = async (date: string): Promise<DiaryData | null> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = '/login';
    throw new Error('인증이 필요합니다');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const listResponse = await fetch(`${API_URL}${API_ENDPOINTS.DIARIES}`, {
    headers: headers
  });

  if (!listResponse.ok) {
    throw new Error('일기 목록을 가져오는데 실패했습니다');
  }

  const diaries = await listResponse.json();
  const todayDiary = diaries.find(
    (diary: DiaryData) => diary.select_date === date
  );

  if (!todayDiary) return null;

  const detailResponse = await fetch(`${API_URL}${API_ENDPOINTS.DIARIES}${todayDiary.id}/`, {
    headers: headers
  });

  if (!detailResponse.ok) {
    throw new Error('일기 상세 정보를 가져오는데 실패했습니다');
  }

  return detailResponse.json();
};

export const generateAiResponse = async (diary: DiaryData): Promise<string> => {
  const response = await fetch(API_ENDPOINTS.AI_COMMENT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: diary.title,
      content: diary.content,
      date: diary.select_date,
    }),
  });

  if (!response.ok) {
    throw new Error('AI 응답을 가져오는데 실패했습니다');
  }

  const data = await response.json();
  return data.message;
};