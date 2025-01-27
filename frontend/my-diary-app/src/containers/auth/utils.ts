export const checkAuth = (): boolean => {
  const token = localStorage.getItem('accessToken');
  return !!token;
};
