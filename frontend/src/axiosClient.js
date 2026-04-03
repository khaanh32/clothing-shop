// frontend/src/axiosClient.js
import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://nhom1be.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Thêm token vào mỗi request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Bắt lỗi toàn cục
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token hết hạn hoặc chưa đăng nhập
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login'; // Ép văng ra trang login
    }
    return Promise.reject(error);
  }
);

export default axiosClient;