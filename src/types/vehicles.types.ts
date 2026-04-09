import type { Item } from "./models";

export interface Vehicle extends Item {
  plate: string;
  typeVehicleId: number | null;
  ownerId: number | null;
}

export const InitialVehicle: Vehicle = {
  id: null,
  plate: "",
  typeVehicleId: null,
  ownerId: null,
};
