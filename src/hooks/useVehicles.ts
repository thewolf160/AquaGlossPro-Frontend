import React, { useEffect, useState } from "react";
import {
  InitialNewVehicleForm,
  InitialVehiclesData,
  type VehiclesData,
  type NewVehicleForm,
  type VehicleApi,
} from "../types/vehicles.types";
import { VehicleService } from "../services/vehicles.services";
import { isAxiosError } from "axios";
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

      const data = response.data.data;

      const formattedData = transformData(data);

      console.log(formattedData);

      setVehiclesData((prev) => ({
        ...prev,
        data: data,
      }));

      if (response.results.meta.totalPages) {
        setTotalPages(response.results.meta.totalPages);
      }
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getVehicles();
  }, []);

  const registerVehicle = async () => {
    setIsSubmitting(true);

    console.table(newVehicleForm);

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
      });

      return true;
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        setError({ active: true, msg: error.response?.data.message });
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
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

  return {
    registerVehicle,
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
  };
};
