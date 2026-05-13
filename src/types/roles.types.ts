export interface Permission {
  permissionId: number;
  type: string;
  active: boolean;
}

export interface ModuleAccess {
  moduleId: number;
  moduleName: string;
  permissions: Permission[];
}

export interface Role {
  roleId: number;
  name: string;
  active: boolean;
  modules: ModuleAccess[];
}

export interface RoleTotals {
  general: number;
  active: number;
  inactive: number;
}

export interface RolesResponse {
  message: string;
  data: {
    data: Role[];
    totals: RoleTotals;
  };
}

export interface RoleFilters {
  active?: string;
  page?: string;
  limit?: string;
  param?: string;
}

export interface RoleCreatePayload {
  name: string;
}

export interface RoleCreateResponse {
  message: string;
  data: {
    roleId: number;
    name: string;
    active: boolean;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
  };
}

export interface AssignPermissionsPayload {
  roleId: number;
  permissions: number[];
}
