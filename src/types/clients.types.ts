import type { Item } from "./models";

// Cliente
export interface Client extends Item {
  ci: string;
  names: string;
  lastnames: string;
  numberPhone: string;
  countVehicles?: number; 
  vehicles?: ClientVehicle[]; 
}

export interface ClientVehicle {
  id?: number;
  plate: string;
  typeVehicle?: { name: string };
}

export const InitialClient: Client = {
  id: null,
  ci: "",
  names: "",
  lastnames: "",
  numberPhone: "",
  countVehicles: 0, 
  vehicles: [],
};

export interface NewClientForm {
  form: {
    names: string;
    lastnames: string;
    ci: string;
    numberPhone: string;
  };
  error: boolean;
  errorMsg: string;
}

export const InitialNewClientForm: NewClientForm = {
  form: {
    names: "",
    lastnames: "",
    ci: "",
    numberPhone: "",
  },
  error: false,
  errorMsg: "",
};

export interface ClientTotals {
  general: number;
  active: number;
  inactive: number;
  vehicleAverage: number;
  clientsWith3PlusVehicles: number;
  totalVehicles: number;
}

export interface ClientsData {
  data: Item[];
  totalClients: number | null;
  totals?: ClientTotals; 
  error: boolean;
  errorMsg: string;
}

export const InitialClientsData: ClientsData = {
  data: [] as Item[],
  totalClients: null,
  error: false,
  errorMsg: "",
};

export interface ClientApi {
  clientId: number;
  names: string;
  lastnames: string;
  numberPhone: string;
  ci: string;
  active: boolean;
  countVehicles?: number; 
  vehicles?: ClientVehicle[];
}


export interface BackendGroupedClient {
  clientId: number;
  names: string;
  lastnames: string;
  ci: string;
  numberPhone: string;
  active: boolean;
  vehicles: BackendVehicle[];
}

export interface BackendVehicle {
  vehicleId: number;
  plate: string;
  active: boolean;
  owner: {
    clientId: number;
    names: string;
    lastnames: string;
    numberPhone: string;
    ci: string;
  };
  typeVehicle: {
    typeVehicleId: number;
    name: string;
  };
}

export interface PaginatedVehiclesResponse {
  message: string;
  data: {
    data: BackendVehicle[];
    meta: {
      itemPerPage: number;
      currentPage: number;
      totalPages: number;
      totals: any;
    };
  };
}