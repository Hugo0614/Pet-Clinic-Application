import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface LoginResponse {
  token: string;
  username: string;
  role: 'OWNER' | 'DOCTOR';
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  phone: string;
  role: 'OWNER' | 'DOCTOR';
}

export const login = async (username: string, password: string): Promise<LoginResponse> => {
  const response = await api.post('/auth/login', { username, password });
  const { token, username: user, role } = response.data;
  
  // 保存token和用户信息
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify({ username: user, role }));
  
  return response.data;
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
  const response = await api.post('/auth/register', data);
  const { token, username: user, role } = response.data;
  
  // 保存token和用户信息
  await AsyncStorage.setItem('token', token);
  await AsyncStorage.setItem('user', JSON.stringify({ username: user, role }));
  
  return response.data;
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.removeItem('token');
  await AsyncStorage.removeItem('user');
};

export const getCurrentUser = async () => {
  const userStr = await AsyncStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};
