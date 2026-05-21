import api from "../config/api";
import type { 
  ServiceApi, ComboApi, CategoryApi, TypeVehicleApi, ServicePriceApi,
  CreateServicePayload, CreateServicePricePayload, UpdateServicePricePayload, 
  CreateComboPayload
} from "../types/catalog.types";

interface PaginationParams {
  page?: string;
  limit?: string;
  active?: string;
  param?: string;
}

interface PaginatedResponse<T> {
  data: {
    data: T[];
    meta: unknown; 
  };
}

export const CatalogServiceApi = {
  getServices: async (params?: PaginationParams) => {
    const { data } = await api.get<PaginatedResponse<ServiceApi>>("/services", { params });
    return data;
  },
 
  getCategories: async (params?: PaginationParams) => {
    const { data } = await api.get<PaginatedResponse<CategoryApi>>("/categories", { params });
    return data;
  },
  getTypesVehicles: async (params?: PaginationParams) => {
    const { data } = await api.get<PaginatedResponse<TypeVehicleApi>>("/type-vehicle", { params });
    return data;
  },
  getServicesPrices: async (params?: PaginationParams) => {
    const { data } = await api.get<PaginatedResponse<ServicePriceApi>>("/services-type-vehicle", { params });
    return data;
  },
  createService: async (payload: CreateServicePayload) => {
    const { data } = await api.post("/services", payload);
    return data;
  },
  deleteService: async (id: number) => {
    const { data } = await api.delete(`/services/${id}`);
    return data;
  },
  restoreService: async (id: number) => {
    const { data } = await api.patch(`/services/restore/${id}`);
    return data;
  },
  updateService: async (id: number, payload: Partial<CreateServicePayload>) => {
    const { data } = await api.patch(`/services/${id}`, payload);
    return data;
  },
  createServicePrice: async (payload: CreateServicePricePayload) => {
    const { data } = await api.post("/services-type-vehicle", payload);
    return data;
  },
  updateServicePrice: async (id: number, payload: UpdateServicePricePayload) => {
    const { data } = await api.patch(`/services-type-vehicle/${id}`, payload);
    return data;
  },
   getCombos: async (params?: PaginationParams) => {
    const { data } = await api.get<PaginatedResponse<ComboApi>>("/combos", { params });
    return data;
  },

  createCombo: async (payload: CreateComboPayload) => {
    const { data } = await api.post("/combos", payload);
    return data;
  },
  
  updateCombo: async (id: number, payload: Partial<CreateComboPayload>) => {
    const { data } = await api.patch(`/combos/${id}`, payload);
    return data;
  },
  
  deleteCombo: async (id: number) => {
    const { data } = await api.delete(`/combos/${id}`);
    return data;
  },

  restoreCombo: async (id: number) => {
    const { data } = await api.patch(`/combos/restore/${id}`);
    return data;
  },

};