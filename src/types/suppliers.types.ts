import type { Item } from "./models";

export interface SupplierTotals {
  general: number;
  active: number;
  inactive: number;
}

export interface SuppliersData {
  data: Item[];
  totals?: SupplierTotals;
  error: boolean;
  errorMsg: string;
}

export interface Supplier extends Item {
  companyName: string;
  email: string;
  numberPhone: string;
  rif: string;
}

export const InitialSupplier: Supplier = {
  id: null,
  companyName: "",
  email: "",
  numberPhone: "",
  rif: "",
};

export interface NewSupplierForm {
  form: {
    companyName: string;
    email: string;
    numberPhone: string;
    rif: string;
  };
  error: boolean;
  errorMsg: string;
}

export const InitialNewSupplierForm: NewSupplierForm = {
  form: {
    companyName: "",
    email: "",
    numberPhone: "",
    rif: "",
  },
  error: false,
  errorMsg: "",
};