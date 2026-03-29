import type { Item } from "./models";

// Cliente
export interface Client extends Item {
  ci: string;
  names: string;
  lastnames: string;
  numberPhone: string;
  vehicles?: ClientVehicle[]; 
}

export interface ClientVehicle {
  plate: string;
  model?: { name: string };
  typeVehicle?: { name: string };
}

// Valor inicial de Cliente
export const InitialClient: Client = {
  id: null,
  ci: "",
  names: "",
  lastnames: "",
  numberPhone: "",
  vehicles: [],
};

// Formulario para agregar cliente
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

// Guardar registros de la API
export interface ClientsData {
  data: Item[];
  totalClients: number | null;
  error: boolean;
  errorMsg: string;
}

export const InitialClientsData: ClientsData = {
  data: [] as Item[],
  totalClients: null,
  error: false,
  errorMsg: "",
};

// Como llegan los datos de la API
export interface ClientApi {
  clientId: number;
  names: string;
  lastnames: string;
  numberPhone: string;
  ci: string;
  active: boolean;
  vehicles?: ClientVehicle[];
}