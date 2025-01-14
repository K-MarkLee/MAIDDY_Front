
import { TodoItem } from './types';
import { API_URL, API_ENDPOINTS } from './constants';

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

  return await response.json();
};

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

  return await response.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
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
    throw new Error('할일 삭제에 실패했습니다');
  }
};

export const toggleTodo = async (id: number, date: string): Promise<TodoItem> => {
  const token = localStorage.getItem('accessToken');
  if (!token) throw new Error('인증이 필요합니다');

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

  return await response.json();
};
