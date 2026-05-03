import api from "../config/api";
import type { Supplier } from "../types/suppliers.types";

interface SupplierFilters {
  active?: string;
  page?: string;
  limit?: string;
  param?: string;
}

export const SupplierService = {
  new: async (supplier: Omit<Supplier, "id">): Promise<Supplier> => {
    const { data } = await api.post("/suppliers", supplier);
    return data;
  },
  getAll: async (filters: SupplierFilters) => {
    const { data } = await api.get("/suppliers", {
      params: {
        limit: "5",
        active: "true",
        ...filters,
      },
    });
    return data;
  },
  delete: async (id: string | number) => {
    const { data } = await api.delete(`/suppliers/${id}`);
    return data;
  },
  edit: async (id: string | number, edited: Partial<Supplier>) => {
    const { data } = await api.patch(`/suppliers/${id}`, edited);
    return data;
  },
  restore: async (id: string | number) => {
    const { data } = await api.patch(`/suppliers/restore/${id}`);
    return data;
  },
};