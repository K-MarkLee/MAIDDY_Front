import { SignUpFormData } from './types';

export const validatePasswords = (password: string, password2: string): string => {
  if (password !== password2) {
    return '비밀번호가 일치하지 않습니다.';
  }
  return '';
};

export const handleSignUp = async (formData: SignUpFormData) => {
  const response = await fetch('http://43.200.166.176:8000/api/users/create/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    const errorMessage =
      typeof errorData === 'object'
        ? Object.values(errorData).flat().join('\n')
        : '회원가입에 실패했습니다.';
    throw new Error(errorMessage);
  }

  return await response.json();
};
