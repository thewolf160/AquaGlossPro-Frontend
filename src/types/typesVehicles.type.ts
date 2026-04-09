import type { Item } from "./models";

export interface TypeVehicle extends Item {
  name: string;
}

export const InitialTypeVehicle: TypeVehicle = {
  id: null,
  name: "",
};

export interface TypesVehiclesData {
  data: Item[];
}

export const InitialTypesVehiclesData: TypesVehiclesData = {
  data: [] as Item[],
};

export interface InactiveTypesVehiclesData {
  data: Item[];
}

export const InitialInactiveTypesVehiclesData: InactiveTypesVehiclesData = {
  data: [] as Item[],
};

export interface TypesVehiclesApi {
  typeVehicleId: string;
  name: string;
}

export interface NewTypeVehicleForm {
  name: string;
}

export const InitialNewTypeVehicleForm: NewTypeVehicleForm = {
  name: "",
};
