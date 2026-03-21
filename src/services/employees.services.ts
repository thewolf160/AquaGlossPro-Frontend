import api from "../config/api";
import type { Employee } from "../types/employees.types";

interface EmployeeFilters {
  active?: string;
  page?: string;
  limit?: string;
}

export const EmployeeService = {
  new: async (employee: Employee) => {
    const { data } = await api.post("/employees", employee);

    return data;
  },

  getAll: async (filters: EmployeeFilters) => {
    const { data } = await api.get("/employees", {
      params: {
        page: "1",
        limit: "5",
        active: "true",
        ...filters,
      },
    });

    return data;
  },

  delete: async (id: any) => {
    const { data } = await api.delete(`/employees/${id}`);

    return data;
  },

  edit: async (id: any) => {
    const { data } = await api.patch(`/employees/${id}`);

    return data;
  },
};
