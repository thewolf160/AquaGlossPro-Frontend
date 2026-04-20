import api from "../config/api";
import type { TypeVehicle } from "../types/typesVehicles.type";

interface TypesVehiclesFilters {
  page?: string;
  limit?: string;
  active?: string;
  param?: string;
}

const URL = "/type-vehicle";

export const TypeVehicleService = {
  new: async (type: TypeVehicle) => {
    await api.post(URL, type);
  },

  getAll: async (filters: TypesVehiclesFilters) => {
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

  edit: async (id: string, edited: Partial<TypeVehicle>) => {
    await api.patch(`${URL}/${id}`, edited);
  },

  restore: async (id: string) => {
    await api.patch(`${URL}/restore/${id}`);
  },
};
