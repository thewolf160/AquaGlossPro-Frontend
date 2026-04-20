import api from "../config/api";
import type { CreatePurchasePayload } from "../types/purchases.types";

export const PurchaseService = {
  create: async (payload: CreatePurchasePayload) => {
    const { data } = await api.post("/purchases", payload);
    return data;
  },
  
};