import api from "../config/api";
import type { Supplier } from "../types/purchases.types";

export const SupplierService = {
  getAll: async (): Promise<Supplier[]> => {
    const { data } = await api.get("/suppliers", {
      params: { active: "true", limit: "100" } 
    });

    return data.data.data.map((s: any) => ({
      id: s.supplierId,
      name: s.companyName
    }));
  },
};