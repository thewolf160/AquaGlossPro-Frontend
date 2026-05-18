import React, { useState } from "react";
import { useVehicles } from "./useVehicles";
import { InitialNewSale, type NewSale } from "../types/sales.types";
import { useCatalog } from "./useCatalog";
import { SalesServices } from "../services/sales.services";
import axios from "axios";

export const useSales = () => {
  const { vehiclesData } = useVehicles();
  // Traemos combos del hook de catálogo
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

  // 1. Filtrar Servicios Individuales
  const availableServices = services
    .filter((s) =>
      s.prices.some((p) => p.typeVehicleId === currentTypeVehicleId),
    )
    .map((s) => ({
      ...s,
      prices: s.prices.filter((p) => p.typeVehicleId === currentTypeVehicleId),
    }));

  // 2. NUEVO: Filtrar Combos Disponibles
  const availableCombos = combos
    .map((c) => {
      // Filtramos los servicios internos del combo que apliquen a este vehículo
      const validServices = (c.combosServices ?? []).filter(
        (cs) =>
          cs.servicesTypeVehicle?.typeVehicle?.typeVehicleId ===
            currentTypeVehicleId ||
          cs.servicesTypeVehicle?.typeVehicleId === currentTypeVehicleId,
      );
      return { ...c, combosServices: validServices };
    })
    // Solo mantenemos los combos que tengan al menos 1 servicio válido para este vehículo
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
        (s) => s.serviceTypeVehicleId === relationId,
      );

      if (isAlreadySelected) {
        return {
          ...prev,
          services: prev.services.filter(
            (s) => s.serviceTypeVehicleId !== relationId,
          ),
        };
      } else {
        return {
          ...prev,
          services: [
            ...prev.services,
            { employeeId: "" as const, serviceTypeVehicleId: relationId },
          ],
        };
      }
    });
  };

  // 3. NUEVO: Función para alternar Combos enteros
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
            employeeId: "" as const, // Vacío por defecto
            serviceTypeVehicleId:
              cs.servicesTypeVehicleId ||
              cs.servicesTypeVehicle?.serviceTypeVehicleId ||
              0,
            comboOriginId: comboId,
          };
        });

        // Limpiamos si el usuario había seleccionado uno de estos servicios individualmente antes
        const newServiceIds = newServicesFromCombo.map(
          (s) => s.serviceTypeVehicleId,
        );
        const cleanPrevServices = prev.services.filter(
          (s) => !newServiceIds.includes(s.serviceTypeVehicleId),
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
        s.serviceTypeVehicleId === relationId ? { ...s, employeeId } : s,
      ),
    }));
  };

  const handleGeneralDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setNewSale((prev) => ({
      ...prev,
      discount: value ? Number(value) : "",
    }));
  };

  const totalAmount = newSale.services.reduce((acumulado, currentService) => {
    const serviceDetail = availableServices.find(
      (s) =>
        (s.prices[0]?.relationId ?? 0) === currentService.serviceTypeVehicleId,
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
    availableCombos, // Lo exportamos
    handleTextTareaChange,
    toggleService,
    toggleCombo, // Lo exportamos
    handleEmployeeChange,
    handleGeneralDiscountChange,
    totalAmount,
    registerSale,
    isSubmitting,
    error,
    successMessage,
  };
};
