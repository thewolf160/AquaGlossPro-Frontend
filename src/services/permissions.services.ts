import api from "../config/api";
import type { PermissionFilters, PermissionsResponse } from "../types/permissions.types";

export const PermissionService = {
  getAll: async (filters?: PermissionFilters) => {
    const { data } = await api.get<PermissionsResponse>("/permissions", {
      params: filters,
    });

    return data;
  },
};