import api from "../config/api";
import type { Client } from "../types/clients.types";

interface ClientFilters {
  page?: string;
  limit?: string;
  active?: string;
  param?: string; 
}

export const ClientService = {
  new: async (client: Omit<Client, "clientId" | "active">) => {
    const { data } = await api.post("/clients", client);
    return data;
  },

  getAll: async (filters: ClientFilters) => {
    const { data } = await api.get("/clients", {
      params: {
        page: "1",
        limit: "10",
        active: "true",
        ...filters,
      },
    });
    return data;
  },

  edit: async (id: number, client: Partial<Client>) => {
    const { data } = await api.patch(`/clients/${id}`, client);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/clients/${id}`);
    return data;
  },

  restore: async (id: number) => {
    const { data } = await api.patch(`/clients/restore/${id}`);
    return data;
  }
};