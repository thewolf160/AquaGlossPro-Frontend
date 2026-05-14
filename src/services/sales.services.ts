import api from "../config/api";

export const SalesService = {
  getAll: async (params: {
    page?: string;
    limit?: string;
    date?: string;
    statusWashing?: string;
    param?: string;
  }) => {
    const response = await api.get(`/sales`, { params });
    return response.data.data;
  },

  getById: async (id: number) => {
    const response = await api.get(`/sales/${id}`);
    return response.data.data;
  },
};

import type { NewSale } from "../types/sales.types";

const URL = "/sales";

export const SalesServices = {
  new: async (sale: NewSale) => {
    await api.post(URL, sale);
  },
};
