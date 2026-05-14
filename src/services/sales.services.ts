import api from "../config/api";
import type { NewSale } from "../types/sales.types";

const URL = "/sales";

export const SalesServices = {
  new: async (sale: NewSale) => {
    await api.post(URL, sale);
  },
};
