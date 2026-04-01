import api from "../config/api";
import type { Employee } from "../types/employees.types";

interface EmployeeFilters {
  active?: string;
  page?: string;
  limit?: string;
  param?: string;
}

export const EmployeeService = {
  new: async (employee: Employee): Promise<Employee> => {
    const { data } = await api.post("/employees", employee);

    return data;
  },

  getAll: async (filters: EmployeeFilters) => {
    const { data } = await api.get("/employees", {
      params: {
        limit: "5",
        active: "true",
        ...filters,
      },
    });
    console.log(data);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/employees/${id}`);

    return data;
  },

  edit: async (id: string, edited: Partial<Employee>) => {
    const { data } = await api.patch(`/employees/${id}`, edited);

    return data;
  },
};
