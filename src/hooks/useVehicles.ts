import React, { useEffect, useState, useRef } from "react";
import {
  InitialNewVehicleForm,
  InitialVehiclesData,
  type VehiclesData,
  type NewVehicleForm,
  type Vehicle,
  InitialVehicle,
} from "../types/vehicles.types";
import { VehicleService } from "../services/vehicles.services";
import axios from "axios";
import { transformData } from "../utils/vehicles.utils";

export const useVehicles = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newVehicleForm, setNewVehicleForm] = useState<NewVehicleForm>(
    InitialNewVehicleForm,
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [error, setError] = useState<{ active: boolean; msg: string }>({
    active: false,
    msg: "",
  });
  const [isActiveVehicles, setIsActiveVehicles] = useState<boolean>(true);
  const [searchParameter, setSearchParameter] = useState<string>("");
  const [vehiclesData, setVehiclesData] =
    useState<VehiclesData>(InitialVehiclesData);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [currentVehicle, setCurrentVehicle] = useState<Vehicle>(InitialVehicle);
  const [editVehicleState, setEditVehicleState] = useState<
    Vehicle & { error?: boolean; errorMsg?: string }
  >(InitialVehicle);
  const [changedFields, setChangedFields] = useState<Partial<Vehicle>>({});

  const getVehicles = async (page: number = 1, activeOverride?: boolean) => {
    setIsLoading(true);

    try {
      const isTargetActive =
        activeOverride !== undefined ? activeOverride : isActiveVehicles;

      const response = await VehicleService.getAll({
        page: page.toString(),
        param: searchParameter,
        active: isTargetActive ? "true" : "false",
      });

      if (response.data.meta.totalPages) {
        setTotalPages(response.data.meta.totalPages);
      }

      const formattedData = transformData(response.data.data);

      setVehiclesData((prev) => ({
        ...prev,
        data: formattedData,
        totalVehicles: response.data.meta.totals?.active || 0,
        totalInactiveVehicles: response.data.meta.totals?.inactive || 0,
      }));

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
      getVehicles(currentPage);
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      getVehicles(currentPage);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPage, searchParameter, isActiveVehicles]);

  const registerVehicle = async () => {
    setIsSubmitting(true);

    if (
      !newVehicleForm.ownerId ||
      !newVehicleForm.plate ||
      !newVehicleForm.typeVehicleId
    ) {
      setError({ active: true, msg: "Todos los campos son obligatorios" });
      setIsSubmitting(false);
      return false;
    }

    try {
      await VehicleService.new({
        typeVehicleId: newVehicleForm.typeVehicleId,
        ownerId: newVehicleForm.ownerId,
        plate: newVehicleForm.plate,
        id: null,
      });
      await getVehicles();
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError({ active: true, msg: error.response?.data.message });
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteVehicle = async (id: string) => {
    setIsSubmitting(true);
    try {
      await VehicleService.delete(id);
      await getVehicles();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const restoreVehicle = async (id: string) => {
    setIsSubmitting(true);
    try {
      await VehicleService.restore(id);
      await getVehicles();
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const editVehicle = async () => {
    setIsSubmitting(true);

    setEditVehicleState((prev) => ({
      ...prev,
      error: false,
      errorMsg: "",
    }));

    if (Object.keys(changedFields).length === 0) {
      setEditVehicleState((prev) => ({
        ...prev,
        error: true,
        errorMsg: "No se han detectado cambios",
      }));
      setIsSubmitting(false);
      return false;
    }

    try {
      await VehicleService.edit(String(editVehicleState.id), changedFields);
      await getVehicles();
      setChangedFields({});
      setEditVehicleState((prev) => ({
        ...prev,
        error: false,
        errorMsg: "",
      }));
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setEditVehicleState((prev) => ({
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

    setEditVehicleState((prev) => ({
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

  const handleSelectChangeEdit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setEditVehicleState((prev) => ({
      ...prev,
      [name]: Number(value),
      error: false,
      errorMsg: "",
    }));

    setChangedFields((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewVehicleForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setNewVehicleForm((prev) => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleSearchChange = (value: string) => {
    setSearchParameter(value);
    setCurrentPage(1);
  };

  return {
    registerVehicle,
    setError,
    error,
    successMessage,
    setSuccessMessage,
    isSubmitting,
    handleChange,
    handleSelectChange,
    newVehicleForm,
    vehiclesData,
    isLoading,
    totalPages,
    currentPage,
    setCurrentPage,
    currentVehicle,
    setCurrentVehicle,
    editVehicleState,
    setEditVehicleState,
    handleEditChange,
    deleteVehicle,
    editVehicle,
    handleSelectChangeEdit,
    handleSearchChange,
    searchParameter,
    isActiveVehicles,
    setIsActiveVehicles,
    getVehicles,
    restoreVehicle,
    setNewVehicleForm,
  };
};
