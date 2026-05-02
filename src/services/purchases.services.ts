import api from "../config/api";
import type { CreatePurchasePayload } from "../types/purchases.types";

export const PurchaseService = {
  create: async (payload: CreatePurchasePayload) => {
    const { data } = await api.post("/purchases", payload);
    return data;
  },

  getAll: async (params?: any) => {
    const { data } = await api.get("/purchases", { params });
    return data;
  },

  updateStatus: async (id: number, status: string) => {
    const { data } = await api.patch(`/purchases/${id}`, { status });
    return data;
  }
  
};