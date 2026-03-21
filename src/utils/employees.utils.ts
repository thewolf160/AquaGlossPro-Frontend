import type { EmployeeApi } from "../types/employees.types";

const capitalizeFull = (text: string) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const transformData = (data: EmployeeApi[]) => {
  return data.map((employee) => {
    return {
      id: employee.employeeId,
      ci: employee.ci,
      names: capitalizeFull(employee.names),
      lastnames: capitalizeFull(employee.lastnames),
      email: employee.email,
      numberPhone: employee.numberPhone,
      jobId: employee.job.jobId,
      nameJob: capitalizeFull(employee.job.name),
      baseSalary: employee.job.baseSalary,
    };
  });
};
