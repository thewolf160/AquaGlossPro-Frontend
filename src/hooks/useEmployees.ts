import { useState, useEffect } from "react";
import { EmployeeService } from "../services/employees.services";
import {
  type Employee,
  type EmployeesData,
  type NewEmployeeForm,
  InitialNewEmployeeForm,
  InitialEmployee,
  InitialEmployeesData,
} from "../types/employees.types";
import { transformData } from "../utils/employees.utils";
import axios from "axios";

export const useEmployees = () => {
  const [employeesData, setEmployeesData] =
    useState<EmployeesData>(InitialEmployeesData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentEmployee, setCurrentEmployee] =
    useState<Employee>(InitialEmployee);
  const [editEmployeeState, setEditEmployeeState] = useState<
    Employee & { error?: boolean; errorMsg?: string }
  >(InitialEmployee);
  const [changedFields, setChangedFields] = useState<Partial<Employee>>({});
  const [newEmployeeForm, setNewEmployeeForm] = useState<NewEmployeeForm>(
    InitialNewEmployeeForm,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const getEmployees = async () => {
    setIsLoading(true);
    try {
      const response = await EmployeeService.getAll({});
      const data = transformData(response.data.data);
      setEmployeesData((prev) => ({
        ...prev,
        data: data,
      }));
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getEmployees();
  }, []);

  const deleteEmployee = async (id: any) => {
    setIsLoading(true);
    try {
      await EmployeeService.delete(id);
      await getEmployees();
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const registerEmployee = async () => {
    if (
      !newEmployeeForm.form.ci ||
      !newEmployeeForm.form.email ||
      !newEmployeeForm.form.jobId ||
      !newEmployeeForm.form.lastnames ||
      !newEmployeeForm.form.names ||
      !newEmployeeForm.form.numberPhone
    ) {
      setNewEmployeeForm((prev) => ({
        ...prev,
        error: true,
        errorMsg: "Todos los campos son obligatorios",
      }));
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      await EmployeeService.new({
        names: newEmployeeForm.form.names,
        lastnames: newEmployeeForm.form.lastnames,
        jobId: newEmployeeForm.form.jobId,
        email: newEmployeeForm.form.email,
        ci: newEmployeeForm.form.ci,
        numberPhone: newEmployeeForm.form.numberPhone,
      });
      getEmployees();
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.log("error: ", error.response?.data);
        setNewEmployeeForm((prev) => ({
          ...prev,
          error: true,
          errorMsg: error.response?.data.message,
        }));
        return;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditEmployeeState((prev) => ({
      ...prev,
      [name]: value,
      error: false,
    }));
    setChangedFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewEmployeeForm((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        [name]: value,
      },
      error: false,
      errorMsg: "",
    }));
  };

  return {
    employeesData,
    isLoading,
    currentEmployee,
    setCurrentEmployee,
    editEmployeeState,
    setEditEmployeeState,
    handleEditChange,
    deleteEmployee,
    getEmployees,
    changedFields,
    newEmployeeForm,
    setNewEmployeeForm,
    handleChange,
    registerEmployee,
    successMessage,
    setSuccessMessage,
  };
};
