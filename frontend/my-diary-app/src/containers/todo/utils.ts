import apiClient from '@/lib/apiClient';
import { TodoItem } from './types';
import { API_URL, API_ENDPOINTS } from './constants';

// Todo 목록 조회
export const fetchTodos = async (date: string): Promise<TodoItem[]> => {
  try {
    const response = await apiClient.get(`${API_ENDPOINTS.LIST}?date=${date}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      window.location.href = '/login';
      throw new Error('인증이 필요합니다');
    }
    console.error('할일 목록 조회 실패:', error);
    throw new Error('할일 목록을 가져오는데 실패했습니다');
  }
};

// Todo 추가
export const addTodo = async (content: string, date: string): Promise<TodoItem> => {
  try {
    const response = await apiClient.post(API_ENDPOINTS.CREATE, {
      content,
      select_date: date
    });
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      window.location.href = '/login';
      throw new Error('인증이 필요합니다');
    }
    console.error('할일 추가 실패:', error);
    throw new Error('할일 추가에 실패했습니다');
  }
};

// Todo 삭제
export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await apiClient.delete(`${API_ENDPOINTS.DELETE}${id}/`);
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('인증이 필요합니다');
    }
    console.error('할일 삭제 실패:', error);
    throw new Error('할일 삭제에 실패했습니다');
  }
};

// Todo 상태 토글 (완료/미완료)
export const toggleTodo = async (id: number, date: string): Promise<TodoItem> => {
  try {
    const response = await apiClient.patch(
      `${API_ENDPOINTS.CHECKBOX}?date=${date}&todo_id=${id}`
    );
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error('인증이 필요합니다');
    }
    console.error('할일 상태 변경 실패:', error);
    throw new Error('할일 상태 변경에 실패했습니다');
  }
};

// API 응답 에러 처리
export const handleApiError = (error: any) => {
  if (error.response?.status === 401) {
    window.location.href = '/login';
    throw new Error('인증이 필요합니다');
  }
  throw error;
};