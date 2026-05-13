
export type StatusWashing = 'W' | 'I' | 'D' | 'C';

interface Employee {
  names: string;
  lastnames: string;
  numberPhone: string;
  ci: string;
}

interface ServiceDetail {
  serviceName: string;
  typeVehicle: string;
  employee: Employee; 
}

export interface SaleItem {
  sale: {
    saleId: number;
    saleDate: string;
    statusWashing: StatusWashing;
  };
  client: {
    names: string;
    lastnames: string;
  };
  vehicle: {
    vehicleId: number;
    plate: string;
    typeVehicle: string;
  };
  details: {
    comboServices: ServiceDetail[];
    independentServices: ServiceDetail[];
    totalAmount: number;
  };
}

export interface PaginatedSalesResponse {
  message: string;
  data: {
    data: SaleItem[];
  };
}