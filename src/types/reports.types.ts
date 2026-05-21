export type ReportPeriod = "today" | "week" | "month" | "custom";

export interface ReportFilterParams {
  period: ReportPeriod;
  startDate?: string;
  endDate?: string;
}

export interface TotalServicesToday {
  count: number;
}

export interface MostUsedPaymentMethod {
  paymentMethodId: number;
  name: string;
  count: number;
}

export interface MostFrequentVehicle {
  typeVehicleId: number;
  name: string;
  count: number;
}

export interface TopProduct {
  productId: number;
  name: string;
  totalUsed: number;
}

export interface SalesByPaymentMethod {
  paymentMethodId: number;
  name: string;
  total: number;
}

export interface TopService {
  serviceId: number;
  name: string;
  count: number;
}

export interface VehiclesByType {
  typeVehicleId: number;
  name: string;
  count: number;
  percentage: number;
}

export interface TopEmployeeCommission {
  employeeId: number;
  fullName: string;
  totalCommission: number;
}

export interface TopEmployeeVehicles {
  employeeId: number;
  fullName: string;
  vehiclesWashed: number;
}

export interface OperationalClosure {
  date: string;
  grossIncome: number;
  commissionsPaid: number;
  expenses: number;
  netIncome: number;
}
