import api from "../config/api"; 
import type {
  ReportFilterParams,
  TotalServicesToday,
  MostUsedPaymentMethod,
  MostFrequentVehicle,
  TopProduct,
  SalesByPaymentMethod,
  TopService,
  VehiclesByType,
  TopEmployeeCommission,
  TopEmployeeVehicles,
  OperationalClosure,
} from "../types/reports.types";

export const ReportsService = {
  // Este no recibe parámetros porque es estrictamente del día actual
  getTotalServicesToday: async () => {
    const response = await api.get<TotalServicesToday>(
      "/reports/total-services-today",
    );
    return response.data;
  },

  getMostUsedPaymentMethod: async (params: ReportFilterParams) => {
    const response = await api.get<MostUsedPaymentMethod>(
      "/reports/most-used-payment-method",
      { params },
    );
    return response.data;
  },

  getMostFrequentVehicleType: async (params: ReportFilterParams) => {
    const response = await api.get<MostFrequentVehicle>(
      "/reports/most-frequent-vehicle-type",
      { params },
    );
    return response.data;
  },

  getMostUsedProducts: async (params: ReportFilterParams) => {
    const response = await api.get<TopProduct[]>(
      "/reports/most-used-products",
      { params },
    );
    return response.data;
  },

  getSalesByPaymentMethod: async (params: ReportFilterParams) => {
    const response = await api.get<SalesByPaymentMethod[]>(
      "/reports/sales-by-payment-method",
      { params },
    );
    return response.data;
  },

  getTopServices: async (params: ReportFilterParams) => {
    const response = await api.get<TopService[]>("/reports/top-services", {
      params,
    });
    return response.data;
  },

  getTotalVehiclesByType: async (params: ReportFilterParams) => {
    const response = await api.get<VehiclesByType[]>(
      "/reports/total-vehicles-by-type",
      { params },
    );
    return response.data;
  },

  getTopEmployeesByCommission: async (params: ReportFilterParams) => {
    const response = await api.get<TopEmployeeCommission[]>(
      "/reports/top-employees-by-commission",
      { params },
    );
    return response.data;
  },

  getTopEmployeesByVehiclesWashed: async (params: ReportFilterParams) => {
    const response = await api.get<TopEmployeeVehicles[]>(
      "/reports/top-employees-by-vehicles-washed",
      { params },
    );
    return response.data;
  },

  getOperationalClosure: async (params: ReportFilterParams) => {
    const response = await api.get<OperationalClosure[]>(
      "/reports/operational-closure",
      { params },
    );
    return response.data;
  },
};
