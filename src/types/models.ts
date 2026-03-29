// Generico
export interface Item {
  id?: number | null;
  [key: string]: any;
}

export interface Vehicle extends Item {
  plate: string;
  vehicle_type: string;
  owner: string;
}

export const InitialVehicle: Vehicle = {
  id: null,
  plate: "",
  vehicle_type: "",
  owner: "",
};
