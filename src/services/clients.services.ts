import api from "../config/api";
import type { BackendVehicle, Client, ClientVehicle, PaginatedVehiclesResponse } from "../types/clients.types";

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

  restore: async (id: string | number) => {
    const { data } = await api.patch(`/clients/restore/${id}`);
    return data;
  },

    async getClientVehicles(ci: string): Promise<ClientVehicle[]> {
    try {
      const response = await api.get<PaginatedVehiclesResponse>(`/vehicles`, {
        params: { param: ci, active: "true", limit: "100" } 
      });

      const vehiclesList: BackendVehicle[] = response.data?.data?.data || [];

      const mappedVehicles: ClientVehicle[] = vehiclesList
        .filter((v: BackendVehicle) => v.owner?.ci === ci && v.active === true)
        .map((v: BackendVehicle) => ({
          id: v.vehicleId, 
          plate: v.plate,
          model: { name: v.typeVehicle?.name || "Desconocido" },
        }));

      return mappedVehicles;
    } catch (error) {
      console.error("Error obteniendo los vehículos del cliente:", error);
      return []; 
    }
  }

  
}

  
