import type { VehicleApi } from "../types/vehicles.types";

export const transformData = (data: VehicleApi[]) => {
  return data.map((vehicle) => {
    return {
      ...vehicle,
      id: vehicle.vehicles.map,
    };
  });
};
