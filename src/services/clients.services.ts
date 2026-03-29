import api from "../config/api";
import type { Client } from "../types/clients.types";

interface ClientFilters {
  active?: string;
  page?: string;
  limit?: string;
  param?: string;
}

export const ClientService = {
  new: async (client: Omit<Client, "id" | "vehicles">): Promise<Client> => {
    const { data } = await api.post("/clients", client);
    return data;
  },

  getAll: async (filters: ClientFilters) => {
    const { data } = await api.get("/clients", {
      params: {
        limit: "5",
        active: "true",
        ...filters,
      },
    });
    return data;
  },

  delete: async (id: string | number) => {
    const { data } = await api.delete(`/clients/${id}`);
    return data;
  },

  edit: async (id: string, edited: Partial<Client>) => {
    const { data } = await api.patch(`/clients/${id}`, edited);
    return data;
  },
};