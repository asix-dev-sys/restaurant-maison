import api from './api';

// Вход сотрудника
export const loginStaff = async (work_email, password, remember_me = false) => {
  const response = await api.post('staff/auth/login/', {
    work_email,
    password,
    remember_me,
  });

  const { access, refresh, profile } = response.data || {};

  if (access) localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
  if (profile) {
    localStorage.setItem('staff_profile', JSON.stringify(profile));
  }

  return profile;
};

// Выход сотрудника
export const logoutStaff = async () => {
  try {
    const refresh = localStorage.getItem('refresh_token');
    if (refresh) {
      await api.post('staff/auth/logout/', { refresh });
    }
  } catch (error) {
    console.error('Ошибка при выходе:', error);
  } finally {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('staff_profile');
    if (typeof window !== 'undefined') {
      window.location.replace('/staff/login');
    }
  }
};

// Получение данных текущего сотрудника
export const getCurrentStaffProfile = async () => {
  const response = await api.get('staff/auth/me/');
  return response.data;
};

// Получение сохранённого профиля локально (без запроса на сервер)
export const getLocalProfile = () => {
  try {
    const profile = localStorage.getItem('staff_profile');
    return profile ? JSON.parse(profile) : null;
  } catch {
    return null;
  }
};