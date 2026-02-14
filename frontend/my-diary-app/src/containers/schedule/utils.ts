import apiClient from '@/lib/apiClient';
import { Schedule } from './types';
import { API_ENDPOINTS } from './constants';

export const fetchSchedules = async (date: string): Promise<Schedule[]> => {
  const { data } = await apiClient.get(API_ENDPOINTS.LIST, {
    params: { date },
  });

  return data.sort((a: Schedule, b: Schedule) => a.time.localeCompare(b.time));
};

export const handleDeleteSchedule = async (id: number): Promise<void> => {
  await apiClient.delete(`${API_ENDPOINTS.DELETE}${id}/`);
};

export const handleAddSchedule = async (
  scheduleData: Omit<Schedule, 'id' | 'pinned' | 'user'>
): Promise<Schedule> => {
  const { data } = await apiClient.post(API_ENDPOINTS.CREATE, scheduleData);
  return data;
};

export const handleTogglePin = async (scheduleId: number, date: string): Promise<Schedule> => {
  const { data } = await apiClient.patch(API_ENDPOINTS.PINNED, null, {
    params: { date, id: scheduleId },
  });
  return data;
};

export const handleUpdateSchedule = async (
  id: number,
  updatedData: Partial<Schedule>
): Promise<Schedule> => {
  const { data } = await apiClient.patch(`${API_ENDPOINTS.UPDATE}${id}/`, updatedData);
  return data;
};
