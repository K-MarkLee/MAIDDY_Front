import { Schedule } from './types';
import { API_URL, API_ENDPOINTS } from './constants';

// utils.ts
export const fetchSchedules = async (date: string): Promise<Schedule[]> => {
  const token = localStorage.getItem('accessToken');
  
  if (!token) {
    console.log('토큰이 없습니다');
    window.location.href = '/login';
    throw new Error('인증이 필요합니다');
  }

  try {
    console.log('API 요청 시작:', `${API_URL}${API_ENDPOINTS.LIST}?date=${date}`);
    
    const response = await fetch(`${API_URL}${API_ENDPOINTS.LIST}?date=${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('서버 응답:', errorData);
      throw new Error(errorData.message || '일정 목록을 가져오는데 실패했습니다');
    }

    const data = await response.json();
    console.log('받은 데이터:', data);
    return data.sort((a: Schedule, b: Schedule) => a.time.localeCompare(b.time));
  } catch (error) {
    console.error('데이터 가져오기 에러:', error);
    throw error;
  }
};

export const handleDeleteSchedule = async (id: number): Promise<void> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('인증이 필요합니다');

  const response = await fetch(`${API_URL}${API_ENDPOINTS.DELETE}${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('일정 삭제에 실패했습니다');
  }
};

export const handleAddSchedule = async (scheduleData: Omit<Schedule, 'id' | 'pinned' | 'user'>): Promise<Schedule> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = '/login';
    throw new Error('인증이 필요합니다');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.CREATE}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(scheduleData)
  });

  if (!response.ok) {
    throw new Error('일정 추가에 실패했습니다');
  }

  return response.json();
};

export const handleTogglePin = async (scheduleId: number, date: string): Promise<Schedule> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('인증이 필요합니다');

  const response = await fetch(`${API_URL}${API_ENDPOINTS.PINNED}?date=${date}&id=${scheduleId}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || '일정 핀 설정에 실패했습니다');
  }

  return response.json();
};