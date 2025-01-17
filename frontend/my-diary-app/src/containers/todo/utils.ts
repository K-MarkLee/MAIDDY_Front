// utils.ts
import { TodoItem } from './types';
import { API_URL, API_ENDPOINTS } from './constants';

// Todo 목록 조회
export const fetchTodos = async (date: string): Promise<TodoItem[]> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = '/login';
    throw new Error('인증이 필요합니다');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.LIST}?date=${date}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('할일 목록을 가져오는데 실패했습니다');
  }

  return response.json();
};

// Todo 추가
export const addTodo = async (content: string, date: string): Promise<TodoItem> => {
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
    body: JSON.stringify({
      content,
      select_date: date
    })
  });

  if (!response.ok) {
    throw new Error('할일 추가에 실패했습니다');
  }

  return response.json();
};

// Todo 삭제
export const deleteTodo = async (id: number): Promise<void> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = '/login';
    throw new Error('인증이 필요합니다');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.DELETE}${id}/`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('할일 삭제에 실패했습니다');
  }
};

// Todo 상태 토글 (완료/미완료)
export const toggleTodo = async (id: number, date: string): Promise<TodoItem> => {
  const token = localStorage.getItem('accessToken');
  if (!token) {
    window.location.href = '/login';
    throw new Error('인증이 필요합니다');
  }

  const response = await fetch(`${API_URL}${API_ENDPOINTS.CHECKBOX}?date=${date}&todo_id=${id}`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    }
  });

  if (!response.ok) {
    throw new Error('할일 상태 변경에 실패했습니다');
  }

  return response.json();
};

// API 응답 에러 처리
export const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    window.location.href = '/login';
    throw new Error('인증이 필요합니다');
  }
  throw error;
};