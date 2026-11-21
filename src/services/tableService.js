import api from './api';

export const tableService = {
  // Получение статусов столов на определенную дату и время
  getTables: async ({ date, time, duration_minutes = 120 }) => {
    const params = new URLSearchParams({
      date,
      time,
      duration_minutes,
    });
    return await api.get(`staff/tables/?${params.toString()}`);
  },

  // Получение списка всех столов зала (статическая схема)
  getAllTablesConfig: async () => {
    return await api.get('staff/tables/config/');
  }
};