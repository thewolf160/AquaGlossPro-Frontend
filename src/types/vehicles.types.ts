import type { Item } from "./models";

export interface Vehicle extends Item {
  plate: string;
  typeVehicleId: number | null;
  ownerId: number | null;
  typeVehicleName?: string;
  ownerName?: string;
  ownerLastName?: string;
  ownerNumberPhone?: string;
  ownerCi?: string;
}

export const InitialVehicle: Vehicle = {
  id: null,
  plate: "",
  typeVehicleId: null,
  ownerId: null,
  typeVehicleName: "",
  ownerName: "",
  ownerCi: "",
  ownerLastName: "",
  ownerNumberPhone: "",
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
  totalVehicles?: number;
  totalInactiveVehicles?: number;
}

export const InitialVehiclesData: VehiclesData = {
  data: [] as Item[],
  totalVehicles: 0,
  totalInactiveVehicles: 0,
};

export interface VehicleApi {
  vehicleId: number;
  plate: string;
  typeVehicle: {
    typeVehicleId: number;
    name: string;
  };
  owner: {
    clientId: number;
    names: string;
    lastnames: string;
    numberPhone: string;
    ci: string;
  };
}
