import api from '../config/api';
import type { SaleItem, StatusWashing } from '../types/kanban.types';

export const getDailySales = async (date: string): Promise<SaleItem[]> => {
  const [year, month, day] = date.split('-');

  const startLocal = new Date(Number(year), Number(month) - 1, Number(day), 0, 0, 0);
  const endLocal = new Date(Number(year), Number(month) - 1, Number(day), 23, 59, 59, 999);

  const startDate = startLocal.toISOString();
  const endDate = endLocal.toISOString();

  const response = await api.get(`/sales?startDate=${startDate}&endDate=${endDate}&limit=100`);
  return response.data.data.data;
};

export const updateWashingStatus = async (id: number, statusWashing: StatusWashing): Promise<void> => {
  await api.patch(`/sales/status/washing/${id}`, { statusWashing });
};