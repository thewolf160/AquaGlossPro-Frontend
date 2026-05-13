import api from "../config/api";
import type {
  UserFilters,
  UserPayload,
  UsersResponse,
} from "../types/users.types";

export const UserService = {
  getAll: async (filters?: UserFilters) => {
    const { data } = await api.get<UsersResponse>("/users", {
      params: filters,
    });
    return data;
  },

  create: async (payload: UserPayload) => {
    const { data } = await api.post("/users", payload);
    return data;
  },

  update: async (id: number, payload: Partial<UserPayload>) => {
    const { data } = await api.patch(`/users/${id}`, payload);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/users/${id}`);
    return data;
  },

  restore: async (id: number) => {
    const { data } = await api.patch(`/users/restore/${id}`);
    return data;
  },
};
