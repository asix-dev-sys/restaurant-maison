import axios from 'axios';

const api = axios.create({
  baseURL: 'https://maison-restaurant.duckdns.org/api/v1/', 
  // withCredentials: true,  <-- Убери или закомментируй эту строку
  headers: {
    'Content-Type': 'application/json',
  },
});

// Автоматически добавляем JWT-токен к запросам
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn('Сессия истекла или токен недействителен (401)');
    }
    return Promise.reject(error);
  }
);

export default api;