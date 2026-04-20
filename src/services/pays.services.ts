import api from "../config/api";
import type { PayMethod } from "../types/pays.types";

interface PaysMethodsFilters {
  page?: string;
  limit?: string;
  active?: string;
  param?: string;
}

const URL = "/payments-methods";

export const PayMethodService = {
  new: async (pay: PayMethod) => {
    await api.post(URL, pay);
  },

  getAll: async (filters: PaysMethodsFilters) => {
    const { data } = await api.get(URL, {
      params: {
        limit: "20",
        ...filters,
      },
    });

    return data;
  },

  delete: async (id: string) => {
    await api.delete(`${URL}/${id}`);
  },

  edit: async (id: string, edited: Partial<PayMethod>) => {
    await api.patch(`${URL}/${id}`, edited);
  },

  restore: async (id: string) => {
    await api.patch(`${URL}/restore/${id}`);
  },
};
