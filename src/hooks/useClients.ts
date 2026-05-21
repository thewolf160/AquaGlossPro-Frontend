import React, { useState, useEffect, useRef } from "react";
import { ClientService } from "../services/clients.services";
import {
  type Client,
  type ClientsData,
  type NewClientForm,
  InitialNewClientForm,
  InitialClient,
  InitialClientsData,
} from "../types/clients.types";
import { transformData } from "../utils/clients.utils";
import axios from "axios";

export const useClients = () => {
  const [clientsData, setClientsData] = useState<ClientsData>(InitialClientsData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  

  const [currentClient, setCurrentClient] = useState<Client>(InitialClient);
  const [editClientState, setEditClientState] = useState<Client & { error?: boolean; errorMsg?: string }>(InitialClient);
  const [changedFields, setChangedFields] = useState<Partial<Client>>({});
  const [newClientForm, setNewClientForm] = useState<NewClientForm>(InitialNewClientForm);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const [searchParameter, setSearchParameter] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isActiveView, setIsActiveView] = useState<boolean>(true);

  const getClients = async (page: number = 1, currentSearch: string = "", activeStatus: boolean = true) => {
    setIsLoading(true);
    try {
      const response = await ClientService.getAll({
        page: page.toString(),
        param: currentSearch,
        active: activeStatus.toString(), 
      });

     const data = transformData(response.data.data);
      let totalToDisplay = response.data.meta.totals.general;
      
      if (response.data.meta.totals.active !== undefined) {
         totalToDisplay = activeStatus
             ? response.data.meta.totals.active
             : response.data.meta.totals.inactive;
      }

      setClientsData((prev) => ({
        ...prev,
        data: data,
        totalClients: totalToDisplay,
        totals: response.data.meta.totals 
      }));
      
      if (response.data.meta.totals.totalPages) { 
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
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchParameter);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchParameter]);

  useEffect(() => {
    if (isFirstRender.current) {
      getClients(currentPage, debouncedSearch, isActiveView);
      isFirstRender.current = false;
      return;
    }
    getClients(currentPage, debouncedSearch, isActiveView);
  }, [currentPage, debouncedSearch, isActiveView]);

 const toggleActiveView = (view: boolean) => {
    setIsActiveView(view);
    setCurrentPage(1); 
    
    setClientsData((prev) => ({ ...prev, data: [] }));
  };

  const restoreClient = async (id: string) => {
    setIsSubmitting(true);
    try {
      await ClientService.restore(id);
      await getClients(currentPage, debouncedSearch, isActiveView); 
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteClient = async (id: string) => {
    setIsSubmitting(true);
    try {
      await ClientService.delete(id);
      await getClients(currentPage, debouncedSearch);
      return true;
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerClient = async () => {
    setIsSubmitting(true);
    if (!newClientForm.form.ci || !newClientForm.form.lastnames || !newClientForm.form.names || !newClientForm.form.numberPhone || !newClientForm.form.email) {
      setNewClientForm((prev) => ({ ...prev, error: true, errorMsg: "Todos los campos son obligatorios" }));
      setIsSubmitting(false);
      return;
    }

    try {
      await ClientService.new({
        names: newClientForm.form.names,
        lastnames: newClientForm.form.lastnames,
        ci: newClientForm.form.ci,
        numberPhone: newClientForm.form.numberPhone,
        email: newClientForm.form.email,
      });
      getClients(currentPage, debouncedSearch);
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setNewClientForm((prev) => ({ ...prev, error: true, errorMsg: error.response?.data.message }));
        return;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const editClient = async () => {
    setIsSubmitting(true);
    if (Object.keys(changedFields).length === 0) {
      setEditClientState((prev) => ({ ...prev, error: true, errorMsg: "No se han detectado cambios" }));
      setIsSubmitting(false);
      return false;
    }
    if (changedFields.ci && changedFields.ci.length < 7) {
      setEditClientState((prev) => ({ ...prev, error: true, errorMsg: "La cédula o RIF debe tener por lo menos 7 digitos" }));
      setIsSubmitting(false);
      return false;
    }

    try {
      await ClientService.edit(String(editClientState.id), changedFields);
      getClients(currentPage, debouncedSearch);
      setChangedFields({});
      setEditClientState((prev) => ({ ...prev, error: false, errorMsg: "" }));
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setEditClientState((prev) => ({ ...prev, error: true, errorMsg: error.response?.data.message }));
        return false;
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditClientState((prev) => ({ ...prev, [name]: value, error: false, errorMsg: "" }));
    setChangedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewClientForm((prev) => ({ ...prev, form: { ...prev.form, [name]: value }, error: false, errorMsg: "" }));
  };

  const handleSearchChange = (value: string) => {
    setSearchParameter(value);
    setCurrentPage(1); 
  };

  return {
    clientsData,
    isLoading,
    isSubmitting,
    currentClient,
    setCurrentClient,
    editClientState,
    setEditClientState,
    handleEditChange,
    deleteClient,
    changedFields,
    newClientForm,
    setNewClientForm,
    handleChange,
    registerClient,
    successMessage,
    setSuccessMessage,
    currentPage,
    setCurrentPage,
    totalPages,
    editClient,
    handleSearchChange,
    searchParameter,
    isActiveView,
    toggleActiveView,
    restoreClient,
    setClientsData
  };
};