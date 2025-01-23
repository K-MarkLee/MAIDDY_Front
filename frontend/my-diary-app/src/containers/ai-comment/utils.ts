import { DiaryData, AiCommentProps } from './types';
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

interface AiFeedbackRequest {
  select_date: string;
}

export const generateAiResponse = async (params: AiFeedbackRequest): Promise<string> => {
  const token = localStorage.getItem('accessToken');
  const tokenPayload = token ? JSON.parse(atob(token.split('.')[1])) : null;
  const userId = tokenPayload?.user_id;

  if (!token) {
    throw new Error('인증이 필요합니다');
  }

  if (!userId) {
    throw new Error('사용자 정보를 찾을 수 없습니다');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.AI_FEEDBACK}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      user_id: userId,
      select_date: params.select_date  // diary.select_date를 params.select_date로 수정
    }),
  });

  if (!response.ok) {
    throw new Error('AI 피드백을 가져오는데 실패했습니다');
  }

  const data: FeedbackResponse = await response.json();
  return data.data.feedback;
};