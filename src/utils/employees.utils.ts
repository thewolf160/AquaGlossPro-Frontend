import type { EmployeeApi } from "../types/employees.types";

export const capitalizeFull = (text: string) => {
  if (!text) return "";
  return text
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

export const statusPayment = (text: string) => {
  if (!text) return "";

  switch (text) {
    case "W":
      return "Pendiente";
      break;
    case "P":
      return "Pagado";
      break;
    case "C":
      return "Cancelado";
      break;
  }
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
