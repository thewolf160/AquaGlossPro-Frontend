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

export interface NewVehicleForm {
  typeVehicleId: number | null;
  ownerId: number | null;
  plate: string;
}

export const InitialNewVehicleForm: NewVehicleForm = {
  typeVehicleId: null,
  ownerId: null,
  plate: "",
};

export interface VehiclesData {
  data: Item[];
}

export const InitialVehiclesData: VehiclesData = {
  data: [] as Item[],
};

export interface VehicleApi {
  clientId: number;
  names: string;
  lastnames: string;
  numberPhone: string;
  ci: string;
  vehicles: [
    {
      vehicleId: number;
      plate: string;
      typeVehicle: {
        typeVehicleId: number;
        name: string;
      };
    },
  ];
}
