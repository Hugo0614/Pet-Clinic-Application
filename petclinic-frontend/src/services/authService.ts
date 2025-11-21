import api from './api';

export const login = async (username: string, password: string) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const register = async (
  username: string, 
  password: string, 
  role: string,
  identityCode: string,
  phoneNumber: string
) => {
  const response = await api.post('/auth/register', { 
    username, 
    password, 
    role, 
    identityCode, 
    phoneNumber 
  });
  return response.data;
};
