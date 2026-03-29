import { useState,useCallback } from "react";
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

  // 2. Obtener clientes
  const getClients = useCallback(async (page: number = 1, param: string = "") => {
    setIsLoading(true);
    try {
      const response = await ClientService.getAll({
        page: page.toString(),
        limit: "5",
        param: param,
      });
      
      const formattedData = transformClientData(response.data.data);
      
      setClientsData({
        data: formattedData,
        meta: response.data.meta,
      });
    } catch (error) {
      console.error("Error al cargar clientes:", error);
    } finally {
      setIsLoading(false);
    }
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

  const editClient = async (
    id: number, 
    data: { names: string; lastnames: string; ci: string; numberPhone: string }
  ) => {
    setIsLoading(true);
    try {
      const cleanedCi = formatCiForBackend(data.ci);
      const cleanedPhone = formatPhoneForBackend(data.numberPhone);

      await ClientService.edit(id, {
        names: data.names,
        lastnames: data.lastnames,
        ci: cleanedCi,
        numberPhone: cleanedPhone,
      });

      await getClients(); 
      return { success: true }; 

    } catch (error: unknown) {
      let msg = "Ocurrió un error al actualizar el cliente";
      if (axios.isAxiosError(error)) {
        msg = error.response?.data?.message || msg;
      }
      return { success: false, msg };
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
    editClient,
    deleteClient,
    getClients,
  };
};