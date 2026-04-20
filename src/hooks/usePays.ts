import { useEffect, useRef, useState } from "react";
import {
  InitialNewPayMethod,
  InitialPaysMethodsData,
  type PaysMethodsData,
  type NewPayMethod,
  type PaysMethodsApi,
  type PayMethod,
  InitialPayMethod,
  type InactivePaysMethodsData,
  InitialInactivePaysMethodsData,
} from "../types/pays.types";
import { PayMethodService } from "../services/pays.services";
import axios from "axios";

export const usePays = () => {
  const [paysMethodsData, setPaysMethodsData] = useState<PaysMethodsData>(
    InitialPaysMethodsData,
  );

  const [inactivePaysMethodsData, setInactivePaysMethodsData] =
    useState<InactivePaysMethodsData>(InitialInactivePaysMethodsData);

  const [newPayMethodForm, setNewPayMethodForm] =
    useState<NewPayMethod>(InitialNewPayMethod);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [currentPayMethod, setCurrentPayMethod] =
    useState<PayMethod>(InitialPayMethod);
  const [changedFields, setChangedFields] = useState<Partial<PayMethod>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState<{ active: boolean; msg: string }>({
    active: false,
    msg: "",
  });

  const getPaysMethods = async () => {
    setIsLoading(true);
    try {
      const response = await PayMethodService.getAll({
        active: "true",
        page: "1",
      });
      const data = response.data.data;

      const formattedData = data.map((payMethod: PaysMethodsApi) => ({
        id: payMethod.paymentMethodId,
        name: payMethod.name,
      }));

      setPaysMethodsData((prev) => ({
        ...prev,
        data: formattedData,
      }));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getInactivePaysMethods = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await PayMethodService.getAll({
        active: "false",
        page: page.toString(),
        limit: "3",
      });

      const data = response.data.data;

      const formattedData = data.map((payMethod: PaysMethodsApi) => ({
        id: payMethod.paymentMethodId,
        name: payMethod.name,
      }));

      setInactivePaysMethodsData((prev) => ({
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
    getPaysMethods();
  }, []);

  const isFirstRender = useRef(true);

  useEffect(() => {
    if (isFirstRender.current) {
      getInactivePaysMethods(currentPage);
      isFirstRender.current = false;
      return;
    }

    const timeoutId = setTimeout(() => {
      getInactivePaysMethods(currentPage);
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [currentPage]);

  const registerPayMethod = async () => {
    setIsSubmitting(true);
    setError({ active: false, msg: "" });

    if (!newPayMethodForm.name) {
      setError({ active: true, msg: "El nombre es obligatorio" });
      setIsSubmitting(false);
      return false;
    }

    try {
      await PayMethodService.new({ name: newPayMethodForm.name });
      getPaysMethods();
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

  const deletePayMethod = async () => {
    setIsSubmitting(true);
    try {
      await PayMethodService.delete(String(currentPayMethod.id));
      getPaysMethods();
      getInactivePaysMethods();
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const editPayMethod = async () => {
    setError({ active: false, msg: "" });

    if (Object.keys(changedFields).length === 0) {
      setError({ active: true, msg: "No se han detectado cambios" });
      return false;
    }

    setIsSubmitting(true);

    try {
      await PayMethodService.edit(String(currentPayMethod.id), changedFields);
      await getPaysMethods();
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

  const restorePayMethod = async () => {
    setIsSubmitting(true);
    try {
      await PayMethodService.restore(String(currentPayMethod.id));
      getPaysMethods();
      getInactivePaysMethods();
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewPayMethodForm((prev) => ({
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
    paysMethodsData,
    handleChange,
    registerPayMethod,
    isSubmitting,
    isLoading,
    setNewPayMethodForm,
    newPayMethodForm,
    successMessage,
    setSuccessMessage,
    error,
    setError,
    deletePayMethod,
    currentPayMethod,
    setCurrentPayMethod,
    handleEditChange,
    changedFields,
    editPayMethod,
    setChangedFields,
    inactivePaysMethodsData,
    restorePayMethod,
    currentPage,
    setCurrentPage,
    totalPages,
  };
};
