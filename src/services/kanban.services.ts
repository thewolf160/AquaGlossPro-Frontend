import api from '../config/api';
import type { SaleItem, StatusWashing } from '../types/kanban.types';

export const getDailySales = async (date: string): Promise<SaleItem[]> => {
  const response = await api.get(`/sales?date=${date}`);
  return response.data.data.data; 
};

export const updateWashingStatus = async (id: number, statusWashing: StatusWashing): Promise<void> => {
  await api.patch(`/sales/status/washing/${id}`, { statusWashing });
};