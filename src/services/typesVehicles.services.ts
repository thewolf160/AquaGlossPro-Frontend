import api from "../config/api";
import type { TypeVehicle } from "../types/typesVehicles.type";

interface TypesVehiclesFilters {
  page?: string;
  limit?: string;
  active?: string;
  param?: string;
}

export const TypeVehicleService = {
  new: async (type: TypeVehicle) => {
    await api.post("/type-vehicle", type);
  },

  getAll: async (filters: TypesVehiclesFilters) => {
    const { data } = await api.get("/type-vehicle", {
      params: {
        limit: "20",
        ...filters,
      },
    });

    return data;
  },

  delete: async (id: string) => {
    await api.delete(`/type-vehicle/${id}`);
  },

  edit: async (id: string, edited: Partial<TypeVehicle>) => {
    await api.patch(`/type-vehicle/${id}`, edited);
  },

  restore: async (id: string) => {
    await api.patch(`/type-vehicle/restore/${id}`);
  },
};
