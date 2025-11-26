import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// 配置后端API地址
// 🔧 重要：根据你的环境修改这里的 IP 地址
const getApiBaseUrl = () => {
  // 如果后端运行在 localhost:8080
  if (__DEV__) {
    // iOS 模拟器/真机可以直接用 localhost
    if (Platform.OS === 'ios') {
      return 'http://localhost:8080/api';
    }
    // Android 模拟器需要用 10.0.2.2
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:8080/api';
    }
  }
  
  // 生产环境或真机测试
  // 🚨 替换为你电脑的实际 IP 地址（运行 ipconfig 或 ifconfig 查看）
  return 'http://10.0.2.15:8080/api'; // 示例：http://192.168.1.100:8080/api
};

const API_BASE_URL = getApiBaseUrl();

console.log('📡 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器 - 自动添加token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器 - 处理错误
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token过期，清除本地存储
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
    }
    return Promise.reject(error);
  }
);

export default api;
