import type { Item } from "./models";

export interface Commission extends Item {
  names: string;
  lastnames: string;
  ci: string;
  conmissionTotal: string;
  statusPaymentConmission: string;
  paymentDate: string;
}

export const InitialCommission: Commission = {
  names: "",
  lastnames: "",
  ci: "",
  conmissionTotal: "",
  statusPaymentConmission: "",
  paymentDate: "",
};

export interface CommissionsData {
  data: Item[];
  totalPaid: number;
  totalCancelled: number;
  totalPending: number;
  error: boolean;
  errorMsg: string;
}

export const InitialCommissionsData: CommissionsData = {
  data: [] as Item[],
  error: false,
  totalPaid: 0,
  totalCancelled: 0,
  totalPending: 0,
  errorMsg: "",
};

export interface CommissionApi {
  employeeId: number;
  names: string;
  lastnames: string;
  ci: string;
  conmissionTotal: string;
  statusPaymentConmission: string;
  paymentDate: string;
}
