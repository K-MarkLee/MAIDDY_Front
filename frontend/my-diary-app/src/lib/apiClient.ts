import axios from 'axios';
import { getTokens, isTokenExpiring, refreshAccessToken } from '@/containers/login/utils';
import { API_URL } from '@/containers/login/constants';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(async (config) => {
  const { accessToken } = getTokens();
  
  if (accessToken) {
    if (isTokenExpiring(accessToken)) {
      try {
        const newAccessToken = await refreshAccessToken();
        config.headers.Authorization = `Bearer ${newAccessToken}`;
      } catch (error) {
        window.location.href = '/login';
        return Promise.reject(error);
      }
    } else {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
  }
  
  return config;
});

export default apiClient;