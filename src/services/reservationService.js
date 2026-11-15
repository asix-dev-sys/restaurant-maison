import api from './api';

export const reservationService = {
  // 1. Публичное бронирование (для гостей, без JWT)
  createPublic: async (bookingData) => {
    // ОБЯЗАТЕЛЬНО добавь 'public/' в конце!
    return await api.post('reservations/public/', bookingData);
  },

  // Остальные методы оставляешь как есть...
  getAll: async (queryString = '') => {
    return await api.get(`staff/reservations/${queryString ? `?${queryString}` : ''}`);
  },
  createStaff: async (data) => {
    return await api.post('staff/reservations/', data);
  },
  // ... остальные функции сервиса
};