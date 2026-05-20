import api from "../config/api";
import type { Commission } from "../types/commissions.types";

interface CommissionsFilters {
  active?: string;
  page?: string;
  limit?: string;
  param?: string;
}

export const CommissionsService = {
  getCommissions: async (filters: CommissionsFilters) => {
    const { data } = await api.get("/commissions", {
      params: {
        limit: 5,
        ...filters,
      },
    });
    return data;
  },

  changeStatus: async (id: string, edited: any) => {
    await api.patch(`/commissions/${id}/status`, edited);
  },
};
