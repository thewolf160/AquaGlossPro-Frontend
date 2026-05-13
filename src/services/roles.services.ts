import api from "../config/api";
import type {
  AssignPermissionsPayload,
  RoleCreatePayload,
  RoleCreateResponse,
  RoleFilters,
  RolesResponse,
} from "../types/roles.types";

export const RoleService = {
  getAll: async (filters?: RoleFilters) => {
    const { data } = await api.get<RolesResponse>("/roles", {
      params: filters,
    });
    return data;
  },

  
  create: async (payload: RoleCreatePayload) => {
    const { data } = await api.post<RoleCreateResponse>("/roles", payload);
    return data.data;
  },

  
  assignPermissions: async (payload: AssignPermissionsPayload) => {
    const { data } = await api.post("/role/permissions", payload);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete(`/roles/${id}`);
    return data;
  },

  restore: async (id: number) => {
    const { data } = await api.patch(`/roles/restore/${id}`);
    return data;
  },

  
  removePermission: async (rolePermissionId: number) => {
    const { data } = await api.delete(`/role/permissions/${rolePermissionId}`);
    return data;
  },

  restorePermission: async (rolePermissionId: number) => {
    const { data } = await api.patch(
      `/role/permissions/restore/${rolePermissionId}`,
    );
    return data;
  },
};
