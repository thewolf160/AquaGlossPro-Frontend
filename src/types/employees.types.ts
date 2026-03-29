import type { Item } from "./models";

//Empleado
export interface Employee extends Item {
  ci: string;
  names: string;
  lastnames: string;
  email: string;
  numberPhone: string;
  jobId: number | null;
  baseSalary?: string;
  nameJob?: string;
}

//Valor inical de Empleado
export const InitialEmployee: Employee = {
  id: null,
  ci: "",
  names: "",
  lastnames: "",
  email: "",
  numberPhone: "",
  jobId: null,
  baseSalary: "",
  nameJob: "",
};

//Formulario para agregar empleado
export interface NewEmployeeForm {
  form: {
    email: string;
    numberPhone: string;
    names: string;
    lastnames: string;
    jobId: number | null;
    ci: string;
  };
  error: boolean;
  errorMsg: string;
}

export const InitialNewEmployeeForm: NewEmployeeForm = {
  form: {
    email: "",
    numberPhone: "",
    names: "",
    lastnames: "",
    jobId: null,
    ci: "",
  },
  error: false,
  errorMsg: "",
};

//Guradar registros
export interface EmployeesData {
  data: Item[];
  totalEmployees: number | null;
  error: boolean;
  errorMsg: string;
}

export const InitialEmployeesData: EmployeesData = {
  data: [] as Item[],
  totalEmployees: null,
  error: false,
  errorMsg: "",
};

//Como llegan los datos de la api
export interface EmployeeApi {
  employeeId: number;
  names: string;
  lastnames: string;
  email: string;
  numberPhone: string;
  ci: string;
  active: boolean;
  job: {
    jobId: number;
    name: string;
    baseSalary: string;
  };
}
