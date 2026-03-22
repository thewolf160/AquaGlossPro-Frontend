import { useState, useEffect } from "react";
import axios from "axios";
import { ClientService } from "../services/clients.services";
import { formatCiForBackend, formatPhoneForBackend, transformClientData } from "../utils/clients.utils";
import { 
  type ClientsData, 
  type NewClientForm, 
  InitialClientsData, 
  InitialNewClientForm 
} from "../types/clients.types";

export const useClients = () => {
  const [clientsData, setClientsData] = useState<ClientsData>(InitialClientsData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newClientForm, setNewClientForm] = useState<NewClientForm>(InitialNewClientForm);

  const getClients = async () => {
    setIsLoading(true);
    try {
      const response = await ClientService.getAll({});
      const formattedData = transformClientData(response.data);
      
      setClientsData({
        data: formattedData,
        meta: response.meta,
      });
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getClients();
  }, []);

  const registerClient = async () => {
    const { names, lastnames, ci, numberPhone } = newClientForm.form;

    if (!names || !lastnames || !ci || !numberPhone) {
      setNewClientForm((prev) => ({
        ...prev,
        error: true,
        errorMsg: "Todos los campos son obligatorios",
      }));
      return false; 
    }

    setIsLoading(true);
    try {
      const cleanedCi = formatCiForBackend(ci);
      const cleanedPhone = formatPhoneForBackend(numberPhone);

      await ClientService.new({
        names,
        lastnames,
        ci: cleanedCi,
        numberPhone: cleanedPhone,
      });

      await getClients();
      setNewClientForm(InitialNewClientForm);
      return true; 

    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setNewClientForm((prev) => ({
          ...prev,
          error: true,
          errorMsg: error.response?.data?.message || "Ocurrió un error al registrar el cliente",
        }));
      }
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (id: number) => {
    setIsLoading(true);
    try {
      await ClientService.delete(id);
      await getClients(); 
      return true;
    } catch (error) {
      console.error("Error al eliminar cliente:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setNewClientForm((prev) => ({
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
    clientsData,
    isLoading,
    newClientForm,
    setNewClientForm,
    handleChange,
    registerClient,
    deleteClient,
    getClients,
  };
};