import api from '../config/api';
import type { SaleItem, StatusWashing } from '../types/kanban.types';

export const getDailySales = async (date: string): Promise<SaleItem[]> => {
  // ISO 8601 completo con Z para pasar el @IsDateString del backend
  const startDate = `${date}T00:00:00.000Z`;
  const endDate = `${date}T23:59:59.999Z`;
  const response = await api.get(`/sales?startDate=${startDate}&endDate=${endDate}&limit=100`);
  // La respuesta es: { message, data: { data: [...], meta: {...}, statusCounts: {...} } }
  return response.data.data.data;
};

export const updateWashingStatus = async (id: number, statusWashing: StatusWashing): Promise<void> => {
  await api.patch(`/sales/status/washing/${id}`, { statusWashing });
};