import React, { useState, useEffect, useRef } from "react";
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
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [searchParameter, setSearchParameter] = useState<string>("");

  const getEmployees = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await EmployeeService.getAll({
        page: page.toString(),
        param: searchParameter,
      });

      const data = transformData(response.data.data);

      setEmployeesData((prev) => ({
        ...prev,
        data: data,
        totalEmployees: response.data.meta.totalItems,
      }));

      if (response.data.meta.totalPages) {
        setTotalPages(response.data.meta.totalPages);
      }

      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      getEmployees(currentPage);
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      getEmployees(currentPage);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchParameter]);

  const deleteEmployee = async (id: string) => {
    setIsSubmitting(true);
    try {
      await EmployeeService.delete(id);
      await getEmployees();
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerEmployee = async () => {
    setIsSubmitting(true);

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
      setIsSubmitting(false);
      return;
    }

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
        setNewEmployeeForm((prev) => ({
          ...prev,
          error: true,
          errorMsg: error.response?.data.message,
        }));
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const editEmployee = async () => {
    setIsSubmitting(true);

    if (Object.keys(changedFields).length === 0) {
      setEditEmployeeState((prev) => ({
        ...prev,
        error: true,
        errorMsg: "No se han detectado cambios",
      }));
      setIsSubmitting(false);
      return false;
    }

    if (changedFields.ci && changedFields.ci.length < 7) {
      setEditEmployeeState((prev) => ({
        ...prev,
        error: true,
        errorMsg: "La cédula debe tener por lo menos 7 digitos",
      }));
      setIsSubmitting(false);
      return false;
    }

    try {
      await EmployeeService.edit(String(editEmployeeState.id), changedFields);
      getEmployees();
      setChangedFields({});
      setEditEmployeeState((prev) => ({
        ...prev,
        error: false,
        errorMsg: "",
      }));
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setEditEmployeeState((prev) => ({
          ...prev,
          error: true,
          errorMsg: error.response?.data.message,
        }));
        return false;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setEditEmployeeState((prev) => ({
      ...prev,
      [name]: value,
      error: false,
      errorMsg: "",
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

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setNewEmployeeForm((prev) => ({
      ...prev,
      form: {
        ...prev.form,
        jobId: Number(value),
      },
    }));
  };

  const handleSelectChangeEdit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value } = e.target;

    setEditEmployeeState((prev) => ({
      ...prev,
      jobId: Number(value),
    }));

    setChangedFields((prev) => ({
      ...prev,
      jobId: Number(value),
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchParameter(value);
    setCurrentPage(1);
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
    changedFields,
    newEmployeeForm,
    setNewEmployeeForm,
    handleChange,
    registerEmployee,
    successMessage,
    setSuccessMessage,
    handleSelectChange,
    currentPage,
    setCurrentPage,
    totalPages,
    editEmployee,
    handleSelectChangeEdit,
    handleSearchChange,
    searchParameter,
    isSubmitting,
  };
};
