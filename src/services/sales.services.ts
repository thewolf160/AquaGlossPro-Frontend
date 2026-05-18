import api from '../config/api';

export const SalesService = {
  getAll: async (params: {
    page?: string;
    limit?: string;
    startDate?: string;
    endDate?: string;
    statusSale?: string;
    param?: string; 
  }) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== "" && value !== undefined)
    );

    const response = await api.get(`/sales`, { params: cleanParams });
    return response.data.data; 
  },

  getById: async (id: number) => {
    const response = await api.get(`/sales/${id}`);
    return response.data.data;
  },

  updateStatusPayment: async (id: number, statusPayment: string) => {
    const response = await api.patch(`/sales/status/payment/${id}`, { statusPayment });
    return response.data.data;
  }
};