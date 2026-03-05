// Generico
export interface Item {
  id: number | null;
  [key: string]: any;
}

//Empleado
export interface Employee extends Item {
  ci: string;
  name: string;
  lastname: string;
  email: string;
  phone_number: string;
  salary: string;
}

//Valor inical de Empleado
export const InitialEmployee: Employee = {
  id: null,
  ci: "",
  name: "",
  lastname: "",
  email: "",
  phone_number: "",
  salary: "",
};

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
