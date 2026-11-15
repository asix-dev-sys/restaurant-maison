import api from './api';

export const tableService = {
  getTables: async ({ date, time, duration_minutes = 120 }) => {
    const params = new URLSearchParams({
      date,
      time,
      duration_minutes,
    });
    return await api.get(`staff/tables/?${params.toString()}`);
  }
};