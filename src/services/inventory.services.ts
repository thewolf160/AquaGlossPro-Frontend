import api from "../config/api";
import type { Product } from "../types/inventory.types";

interface ProductFilters {
  active?: string;
  page?: string;
  limit?: string;
  param?: string; 
}

export const ProductService = {
  new: async (product: Omit<Product, "id" | "categoryName">): Promise<Product> => {
    const { data } = await api.post("/products", product);
    return data;
  },

  getAll: async (filters: ProductFilters) => {
    const { data } = await api.get("/products", {
      params: {
        limit: "5",  
        active: "true",
        ...filters,
      },
    });
    return data;
  },

  delete: async (id: string | number) => {
    const { data } = await api.delete(`/products/${id}`);
    return data;
  },

  edit: async (id: string | number, edited: Partial<Product>) => {
    const { data } = await api.patch(`/products/${id}`, edited);
    return data;
  },
};