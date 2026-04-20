import api from "../config/api";
import type { Vehicle } from "../types/vehicles.types";

interface VehicleFilters {
  active?: string;
  page?: string;
  limit?: string;
  param?: string;
}

const URL = "/vehicles";

export const VehicleService = {
  new: async (vehicle: Vehicle) => {
    await api.post(URL, vehicle);
  },

  getAll: async (filters: VehicleFilters) => {
    const { data } = await api.get(URL, {
      params: {
        limit: 5,
        ...filters,
      },
    });

    return data;
  },
};
