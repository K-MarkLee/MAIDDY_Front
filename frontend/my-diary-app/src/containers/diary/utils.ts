import { DiaryData } from './types';
import { API_URL, API_ENDPOINTS } from './constants';

export const fetchDiaryContent = async (date: string): Promise<DiaryData> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = '/login';
    throw new Error('인증이 필요합니다');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.GET}?date=${date}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (response.status === 404) {
    return {
      content: '',
      select_date: date
    };
  }

  if (!response.ok) {
    throw new Error('일기를 가져오는데 실패했습니다');
  }

  const data = await response.json();
  return {
    content: data.content,
    select_date: date
  };
};

export const saveDiary = async (diaryData: DiaryData): Promise<void> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = '/login';
    throw new Error('인증이 필요합니다');
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const formattedDate = diaryData.select_date.split('T')[0];
  
  if (!dateRegex.test(formattedDate)) {
    throw new Error('날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식이어야 합니다.');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.UPDATE}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify({
      content: diaryData.content,
      select_date: formattedDate,
      title: ''
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || errorData.detail || '다이어리 저장에 실패했습니다');
  }

  return response.status === 201 ? 
    alert('새로운 일기가 작성되었습니다!') : 
    alert('일기가 수정되었습니다!');
};