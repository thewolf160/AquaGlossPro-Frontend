import api from '../config/api';
import type { SaleItem, StatusWashing } from '../types/kanban.types';

export const getDailySales = async (date: string): Promise<SaleItem[]> => {
  const endDate = `${date}T23:59:59`;
  const response = await api.get(`/sales?startDate=${date}&endDate=${endDate}&limit=100`);
  return response.data.data.data; 
};

export const updateWashingStatus = async (id: number, statusWashing: StatusWashing): Promise<void> => {
  await api.patch(`/sales/status/washing/${id}`, { statusWashing });
};