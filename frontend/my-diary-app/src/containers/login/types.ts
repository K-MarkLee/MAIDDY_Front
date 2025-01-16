export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;  // refresh 토큰 추가
}