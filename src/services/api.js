import axios from 'axios';

const API_BASE_URL = 'https://maison-restaurant.duckdns.org/api/v1/';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const clearStaffSessionAndRedirect = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('staff_profile');

  if (
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/admin') &&
    window.location.pathname !== '/staff/login'
  ) {
    window.location.replace('/staff/login');
  } else if (
    typeof window !== 'undefined' &&
    window.location.pathname.startsWith('/staff/') &&
    window.location.pathname !== '/staff/login'
  ) {
    window.location.replace('/staff/login');
  }
};

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && !config.headers.Authorization) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('staff/auth/refresh/') &&
      !originalRequest.url?.includes('staff/auth/login/')
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refresh_token');

      if (!refreshToken) {
        clearStaffSessionAndRedirect();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${API_BASE_URL}staff/auth/refresh/`, {
          refresh: refreshToken,
        });

        const newAccessToken = response.data?.access;
        if (!newAccessToken) {
          throw new Error('Missing access token in refresh response');
        }

        localStorage.setItem('access_token', newAccessToken);
        if (response.data?.refresh) {
          localStorage.setItem('refresh_token', response.data.refresh);
        }

        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearStaffSessionAndRedirect();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;