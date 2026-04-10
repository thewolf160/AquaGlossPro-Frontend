import api from "../config/api";
import type { Vehicle } from "../types/vehicles.types";

export const VehicleService = {
  new: async (vehicle: Vehicle) => {
    await api.post("/vehicles", vehicle);
  },
};
