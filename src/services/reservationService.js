import api from './api';

export const reservationService = {
  // Публичное бронирование для гостей (без JWT) -> POST /api/v1/reservations/public/
  createPublic: async (bookingData) => {
    const response = await api.post('reservations/public/', bookingData);
    return response.data || response;
  },

  // Список бронирований для персонала (поддерживает строку запроса или объект params)
  getAll: async (queryOrParams = '') => {
    if (typeof queryOrParams === 'string') {
      const url = `staff/reservations/${queryOrParams ? `?${queryOrParams}` : ''}`;
      const response = await api.get(url);
      return response.data || response;
    }

    const response = await api.get('staff/reservations/', {
      params: queryOrParams || {},
    });
    return response.data || response;
  },

  // Детали конкретной брони
  getById: async (reservationId) => {
    const response = await api.get(`staff/reservations/${reservationId}/`);
    return response.data || response;
  },

  // Создание бронирования сотрудником
  createStaff: async (data) => {
    const response = await api.post('staff/reservations/', data);
    return response.data || response;
  },

  // Назначение стола на бронь
  assignTable: async (reservationId, tableId) => {
    const response = await api.post(`staff/reservations/${reservationId}/assign-table/`, {
      table_id: tableId,
    });
    return response.data || response;
  },

  // Подтверждение бронирования
  confirm: async (reservationId) => {
    const response = await api.post(`staff/reservations/${reservationId}/confirm/`, {});
    return response.data || response;
  },

  // Отметка прибытия гостя
  arrive: async (reservationId) => {
    const response = await api.post(`staff/reservations/${reservationId}/arrive/`, {});
    return response.data || response;
  },

  // Отмена бронирования
  cancel: async (reservationId) => {
    const response = await api.post(`staff/reservations/${reservationId}/cancel/`, {});
    return response.data || response;
  },
};