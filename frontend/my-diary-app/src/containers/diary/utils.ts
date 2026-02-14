import apiClient from '@/lib/apiClient';
import { DiaryData } from './types';
import { API_ENDPOINTS } from './constants';

export const fetchDiaryContent = async (date: string): Promise<DiaryData> => {
  try {
    const { data } = await apiClient.get(API_ENDPOINTS.GET, {
      params: { date },
    });

    return {
      content: data.content,
      select_date: date,
    };
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {
        content: '',
        select_date: date,
      };
    }
    throw new Error('일기를 가져오는데 실패했습니다');
  }
};

export const saveDiary = async (diaryData: DiaryData): Promise<void> => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  const formattedDate = diaryData.select_date.split('T')[0];

  if (!dateRegex.test(formattedDate)) {
    throw new Error('날짜 형식이 올바르지 않습니다. YYYY-MM-DD 형식이어야 합니다.');
  }

  try {
    await apiClient.post(API_ENDPOINTS.UPDATE, {
      content: diaryData.content,
      select_date: formattedDate,
      title: '',
    });
  } catch (error: any) {
    const errorMsg =
      error.response?.data?.error ||
      error.response?.data?.detail ||
      '다이어리 저장에 실패했습니다';
    throw new Error(errorMsg);
  }
};
