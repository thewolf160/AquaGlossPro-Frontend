import { useState } from "react";
import {
  InitialNewVehicleForm,
  type NewVehicleForm,
} from "../types/vehicles.types";
import { VehicleService } from "../services/vehicles.services";
import { isAxiosError } from "axios";

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

  const registerVehicle = async () => {
    setIsSubmitting(true);

    if (
      !newVehicleForm.ownerId ||
      !newVehicleForm.plate ||
      !newVehicleForm.typeVehicleId
    ) {
      setError({ active: true, msg: "Todos los campos son obligatorios" });
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

  return {
    registerVehicle,
    error,
    successMessage,
    setSuccessMessage,
  };
};
