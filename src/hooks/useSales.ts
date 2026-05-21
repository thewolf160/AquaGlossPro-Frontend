import React, { useState } from "react";
import { useVehicles } from "./useVehicles";
import { InitialNewSale, type NewSale } from "../types/sales.types";
import { useCatalog } from "./useCatalog";
import { SalesServices } from "../services/sales.services";
import axios from "axios";

export const useSales = () => {
  const { vehiclesData } = useVehicles();
  const { services, combos } = useCatalog();
  const [error, setError] = useState<{ active: boolean; msg: string }>({
    active: false,
    msg: "",
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [newSale, setNewSale] = useState<NewSale>(InitialNewSale);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const customerVehicle = vehiclesData.data.filter(
    (v) => v.ownerId === newSale.clientId,
  );

  const selectedVehicle = customerVehicle.find(
    (v) => v.id === newSale.vehicleId,
  );
  const currentTypeVehicleId = selectedVehicle
    ? selectedVehicle.typeVehicleId
    : null;

  const availableServices = services
    .filter((s) =>
      s.prices.some((p) => p.typeVehicleId === currentTypeVehicleId),
    )
    .map((s) => ({
      ...s,
      prices: s.prices.filter((p) => p.typeVehicleId === currentTypeVehicleId),
    }));

  const availableCombos = combos
    .map((c) => {
      const validServices = (c.combosServices ?? []).filter((cs) =>
        availableServices.some((avail) => avail.id === cs.serviceId),
      );
      return { ...c, combosServices: validServices };
    })
    .filter((c) => c.combosServices.length > 0);

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({
      ...prev,
      [name]: value ? parseInt(value) : "",
      ...(name === "vehicleId" ? { services: [] } : {}),
    }));
  };

  const handleTextTareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewSale((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (relationId: number) => {
    setNewSale((prev) => {
      const isAlreadySelected = prev.services.some(
        (s) => s.serviceId === relationId,
      );

      if (isAlreadySelected) {
        return {
          ...prev,
          services: prev.services.filter(
            (s) => s.serviceId !== relationId,
          ),
        };
      } else {
        return {
          ...prev,
          services: [
            ...prev.services,
            { employeeId: "" as const, serviceId: relationId },
          ],
        };
      }
    });
  };

  const toggleCombo = (
    comboId: number,
    comboServicesData: any[],
    discountPercentage: string,
  ) => {
    setNewSale((prev) => {
      const isComboSelected = prev.services.some(
        (s) => s.comboOriginId === comboId,
      );

      if (isComboSelected) {
        return {
          ...prev,
          services: prev.services.filter((s) => s.comboOriginId !== comboId),
        };
      } else {
        // Si no está seleccionado, preparamos todos los servicios de este combo
        const newServicesFromCombo = comboServicesData.map((cs) => {
          return {
            employeeId: "" as const,
            serviceId: cs.serviceId,
            comboOriginId: comboId,
          };
        });

        const newServiceIds = newServicesFromCombo.map(
          (s) => s.serviceId,
        );
        const cleanPrevServices = prev.services.filter(
          (s) => !newServiceIds.includes(s.serviceId),
        );

        return {
          ...prev,
          services: [...cleanPrevServices, ...newServicesFromCombo],
        };
      }
    });
  };

  const handleEmployeeChange = (relationId: number, employeeId: number) => {
    setNewSale((prev) => ({
      ...prev,
      services: prev.services.map((s) =>
        s.serviceId === relationId ? { ...s, employeeId } : s,
      ),
    }));
  };

  const handleGeneralDiscountChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const value = e.target.value;
    setNewSale((prev) => ({
      ...prev,
      discount: value ? Number(value) : "",
    }));
  };

  const totalAmount = newSale.services.reduce((acumulado, currentService) => {
    const serviceDetail = availableServices.find(
      (s) => s.id === currentService.serviceId,
    );

    const price = serviceDetail?.prices[0]?.price || 0;

    return acumulado + price;
  }, 0);

  const registerSale = async () => {
    setIsSubmitting(true);
    setError({ active: false, msg: "" });

    if (
      !newSale.clientId ||
      !newSale.initialState ||
      !newSale.paymentMethodId ||
      !newSale.vehicleId ||
      !newSale.services
    ) {
      setError({ active: true, msg: "Todos los campos son obligatorios" });
      setTimeout(() => {
        setError({ active: false, msg: "" });
      }, 3000);
      setIsSubmitting(false);
      return;
    }

    console.log(newSale);

    try {
      await SalesServices.new(newSale);
      setSuccessMessage("Registrado con Éxito");
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      setNewSale(InitialNewSale);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError({
          active: true,
          msg: error.response?.data.message || "Algo salio mal",
        });
        setTimeout(() => {
          setError({ active: false, msg: "" });
        }, 3000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    customerVehicle,
    handleSelectChange,
    newSale,
    availableServices,
    availableCombos,
    handleTextTareaChange,
    toggleService,
    toggleCombo,
    handleEmployeeChange,
    handleGeneralDiscountChange,
    totalAmount,
    registerSale,
    isSubmitting,
    error,
    successMessage,
  };
};
