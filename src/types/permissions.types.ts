export interface Module {
  moduleId: number;
  name: string;
}

export interface Permission {
  permissionId: number;
  typePermission: string;
  active: boolean;
  modul: Module;
}

export interface PermissionsResponse {
  message: string;
  data: {
    data: Permission[];
    meta: {
      itemPerPage: number;
      currentPage: number;
      totalPages: number;
      totals: {
        general: number;
        active: number;
        inactive: number;
      };
    };
  };
}

export interface PermissionFilters {
  active?: string;
  page?: string;
  limit?: string;
}