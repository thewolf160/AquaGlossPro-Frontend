export interface UserRole {
  roleId: number;
  name: string;
}

export interface User {
  userId: number;
  name: string;
  email: string;
  active: boolean;
  role: UserRole;

  ci?: string;
  phone?: string;
}

export interface UsersTotals {
  general: number;
  active: number;
  inactive: number;
}

export interface UsersResponse {
  message: string;
  data: {
    data: User[];
    meta: {
      itemPerPage: number;
      currentPage: number;
      totalPages: number;
      totals: UsersTotals;
    };
  };
}

export interface UserFilters {
  active?: string;
  page?: string;
  limit?: string;
}

export interface UserPayload {
  roleId: number;
  name: string;
  email: string;
  password?: string;
}
