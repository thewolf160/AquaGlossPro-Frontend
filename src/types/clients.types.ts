
export interface Client {
  clientId: number;
  names: string;
  lastnames: string;
  ci: string;
  numberPhone: string;
  active: boolean;
  vehicles?: any[]; 
}

export interface ClientMapped extends Client {
  name: string;
  lastname: string;
}

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

export interface ClientsData {
  data: ClientMapped[];
  meta?: {
    totalItems: number;
    itemCount: number;
    itemPerPage: number;
    currentPage: number;
    totalPages: number;
  };
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

export const InitialClient: Client = {
  clientId: 0,
  names: "",
  lastnames: "",
  ci: "",
  numberPhone: "",
  active: true,
};

export const InitialClientsData: ClientsData = {
  data: [],
};