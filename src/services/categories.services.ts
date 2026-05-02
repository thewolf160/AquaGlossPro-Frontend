import api from "../config/api";
import type { Categorie } from "../types/categories.types";

interface CategoriesFilters {
  page?: string;
  limit?: string;
  active?: string;
  param?: string;
}

const URL = "/categories";

export const CategorieService = {
  new: async (categorie: Omit<Categorie, "id">) => {
    await api.post(URL, categorie);
  },

  getAll: async (filters: CategoriesFilters) => {
    const { data } = await api.get(URL, {
      params: {
        limit: "20",
        ...filters,
      },
    });

    return data;
  },

  delete: async (id: string) => {
    await api.delete(`${URL}/${id}`);
  },

  edit: async (id: string, edited: Partial<Categorie>) => {
    await api.patch(`${URL}/${id}`, edited);
  },

  restore: async (id: string) => {
    await api.patch(`${URL}/restore/${id}`);
  },
};
