import apiClient from '@/lib/apiClient';
import { TodoItem } from './types';
import { API_ENDPOINTS } from './constants';

// Todo 목록 조회
export const fetchTodos = async (date: string): Promise<TodoItem[]> => {
  const { data } = await apiClient.get(API_ENDPOINTS.LIST, {
    params: { date },
  });
  return data;
};

// Todo 추가
export const addTodo = async (content: string, date: string): Promise<TodoItem> => {
  const { data } = await apiClient.post(API_ENDPOINTS.CREATE, {
    content,
    select_date: date,
  });
  return data;
};

// Todo 삭제
export const deleteTodo = async (id: number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.DELETE}${id}/`);
};

// Todo 상태 토글 (완료/미완료)
export const toggleTodo = async (id: number, date: string): Promise<TodoItem> => {
  const { data } = await apiClient.patch(API_ENDPOINTS.CHECKBOX, null, {
    params: { date, todo_id: id },
  });
  return data;
};
