import React, { useEffect, useRef, useState } from "react";
import {
  InitialNewTypeVehicleForm,
  InitialTypesVehiclesData,
  InitialTypeVehicle,
  type TypeVehicle,
  type NewTypeVehicleForm,
  type TypesVehiclesApi,
  type TypesVehiclesData,
  type InactiveTypesVehiclesData,
  InitialInactiveTypesVehiclesData,
} from "../types/typesVehicles.type";
import { TypeVehicleService } from "../services/typesVehicles.services";
import axios from "axios";

export const useTypesVehicles = () => {
  const [typesVehiclesData, setTypesVehiclesData] = useState<TypesVehiclesData>(
    InitialTypesVehiclesData,
  );

  const [inactiveTypesVehicleData, setInactiveTypesVehicleData] =
    useState<InactiveTypesVehiclesData>(InitialInactiveTypesVehiclesData);
  const [newTypeVehicleForm, setNewTypeVehicleForm] =
    useState<NewTypeVehicleForm>(InitialNewTypeVehicleForm);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentTypeVehicle, setCurrentTypeVehicle] =
    useState<TypeVehicle>(InitialTypeVehicle);
  const [changedFields, setChangedFields] = useState<Partial<TypeVehicle>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<{ active: boolean; msg: string }>({
    active: false,
    msg: "",
  });

  const getTypesVehicles = async () => {
    setIsLoading(true);
    try {
      const response = await TypeVehicleService.getAll({
        active: "true",
        page: "1",
      });
      const data = response.data.data;

      const formattedData = data.map((typeVehicle: TypesVehiclesApi) => ({
        id: typeVehicle.typeVehicleId,
        name: typeVehicle.name,
      }));

      setTypesVehiclesData((prev) => ({
        ...prev,
        data: formattedData,
      }));
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInactiveTypesVehicles = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await TypeVehicleService.getAll({
        limit: "3",
        active: "false",
        page: page.toString(),
      });

      const data = response.data.data;

      const formattedData = data.map((typeVehicle: TypesVehiclesApi) => ({
        ...typeVehicle,
        id: typeVehicle.typeVehicleId,
      }));

      setInactiveTypesVehicleData((prev) => ({
        ...prev,
        data: formattedData,
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

  useEffect(() => {
    getTypesVehicles();
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      getInactiveTypesVehicles(currentPage);
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      getInactiveTypesVehicles(currentPage);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPage]);

  const registerTypeVehicle = async () => {
    setIsSubmitting(true);
    setError({ active: false, msg: "" });

    if (!newTypeVehicleForm.name) {
      setError({ active: true, msg: "El nombre es obligatorio" });
      setIsSubmitting(false);
      return false;
    }

    try {
      await TypeVehicleService.new({ name: newTypeVehicleForm.name });
      getTypesVehicles();
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError({
          active: true,
          msg: error.response?.data.message || "Algo salio mal",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteTypeVehicle = async () => {
    setIsSubmitting(true);
    try {
      await TypeVehicleService.delete(String(currentTypeVehicle.id));
      getTypesVehicles();
      getInactiveTypesVehicles();
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editTypeVehicle = async () => {
    setError({ active: false, msg: "" });

    if (Object.keys(changedFields).length === 0) {
      setError({ active: true, msg: "No se han detectado cambios" });
      return false;
    }

    setIsSubmitting(true);

    try {
      await TypeVehicleService.edit(
        String(currentTypeVehicle.id),
        changedFields,
      );
      await getTypesVehicles();
      setChangedFields({});
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError({
          active: true,
          msg: error.response?.data.message || "Error al editar",
        });
        return false;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const restoreTypeVehicle = async () => {
    setIsSubmitting(true);
    try {
      await TypeVehicleService.restore(String(currentTypeVehicle.id));
      getTypesVehicles();
      getInactiveTypesVehicles();
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewTypeVehicleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setChangedFields((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return {
    typesVehiclesData,
    handleChange,
    registerTypeVehicle,
    isSubmitting,
    isLoading,
    setNewTypeVehicleForm,
    newTypeVehicleForm,
    successMessage,
    setSuccessMessage,
    error,
    setError,
    deleteTypeVehicle,
    currentTypeVehicle,
    setCurrentTypeVehicle,
    handleEditChange,
    changedFields,
    editTypeVehicle,
    setChangedFields,
    inactiveTypesVehicleData,
    restoreTypeVehicle,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};
