// frontend/src/axiosClient.js
import axios from 'axios';

// Tiện ích làm sạch URL (xóa xém dư thừa)
const sanitizeURL = (url) => {
  if (!url) return '';
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const USER_API_BASE = sanitizeURL(import.meta.env.VITE_API_USER_URL || 'https://nhom1be.onrender.com/api');
const ADMIN_API_BASE = sanitizeURL(import.meta.env.VITE_API_ADMIN_URL || 'https://webchieut6.onrender.com/api');

console.log('[API CONFIG] User Base:', USER_API_BASE);
console.log('[API CONFIG] Admin Base:', ADMIN_API_BASE);

// 1. Instance cho Storefront (Laravel)
export const axiosUser = axios.create({
  baseURL: USER_API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
});

// 2. Instance cho Admin (Spring Boot)
export const axiosAdmin = axios.create({
  baseURL: ADMIN_API_BASE,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Logger helper
const logRequest = (config, name) => {
  const fullUrl = `${config.baseURL || ''}${config.url}`;
  console.log(`%c[API REQUEST - ${name}] %c${config.method?.toUpperCase()} %c${fullUrl}`, 
    'color: #3b82f6; font-weight: bold', 'color: #10b981', 'color: #6b7280');
  return config;
};

const logError = (error, name) => {
  const status = error.response?.status || 'NETWORK ERROR';
  const url = error.config?.url ? `${error.config.baseURL}${error.config.url}` : 'Unknown URL';
  
  console.error(`%c[API ERROR - ${name}] %cStatus: ${status} %cURL: ${url}`, 
    'color: #ef4444; font-weight: bold', 'color: #f59e0b', 'color: #9ca3af');
    
  if (error.response?.data) {
    console.log('[API ERROR DATA]', error.response.data);
  }
  
  // Xử lý 401 Unauthorized
  if (status === 401) {
    if (!url.endsWith('/login') && !url.endsWith('/register')) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }
  
  return Promise.reject(error);
};

// Setup Interceptors
axiosUser.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return logRequest(config, 'USER');
});

axiosAdmin.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return logRequest(config, 'ADMIN');
});

axiosUser.interceptors.response.use(res => res, (err) => logError(err, 'USER'));
axiosAdmin.interceptors.response.use(res => res, (err) => logError(err, 'ADMIN'));

export default axiosUser;
