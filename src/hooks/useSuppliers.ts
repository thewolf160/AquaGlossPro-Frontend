import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { SupplierService } from "../services/supliers.services";
import {
  type Supplier,
  type SuppliersData,
  type NewSupplierForm,
  InitialNewSupplierForm,
  InitialSupplier,
} from "../types/suppliers.types";

export const useSuppliers = () => {
  const [suppliersData, setSuppliersData] = useState<SuppliersData>({ data: [], error: false, errorMsg: "" });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [currentSupplier, setCurrentSupplier] = useState<Supplier>(InitialSupplier);
  const [editSupplierState, setEditSupplierState] = useState<Supplier & { error?: boolean; errorMsg?: string }>(InitialSupplier);
  const [changedFields, setChangedFields] = useState<Partial<Supplier>>({});
  const [newSupplierForm, setNewSupplierForm] = useState<NewSupplierForm>(InitialNewSupplierForm);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParameter, setSearchParameter] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isActiveView, setIsActiveView] = useState<boolean>(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedSearch(searchParameter), 500);
    return () => clearTimeout(timeoutId);
  }, [searchParameter]);

  const getSuppliers = async (page: number = 1, currentSearch: string = "", activeStatus: boolean = true) => {
    setIsLoading(true);
    try {
      const response = await SupplierService.getAll({
        page: page.toString(),
        param: currentSearch,
        active: activeStatus.toString(),
      });
      
      const rawSuppliers = response.data.data;
      const meta = response.data.meta;

      const mappedData = rawSuppliers.map((s: any) => ({
        id: s.supplierId,
        companyName: s.companyName,
        email: s.email,
        numberPhone: s.numberPhone,
        rif: s.rif,
        active: s.active,
      }));

      setSuppliersData({
        data: mappedData,
        totals: meta.totals, 
        error: false,
        errorMsg: "",
      });

      if (meta.totalPages) setTotalPages(meta.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) {
      getSuppliers(currentPage, debouncedSearch, isActiveView);
      isFirstRender.current = false;
      return;
    }
    getSuppliers(currentPage, debouncedSearch, isActiveView);
  }, [currentPage, debouncedSearch, isActiveView]);

  const toggleActiveView = (view: boolean) => {
    setIsActiveView(view);
    setCurrentPage(1);
  };

  const deleteSupplier = async (id: string | number) => {
    setIsSubmitting(true);
    try {
      await SupplierService.delete(id);
      await getSuppliers(currentPage, debouncedSearch, isActiveView);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const restoreSupplier = async (id: string | number) => {
    setIsSubmitting(true);
    try {
      await SupplierService.restore(id);
      await getSuppliers(currentPage, debouncedSearch, isActiveView);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const registerSupplier = async () => {
    setIsSubmitting(true);
    if (!newSupplierForm.form.companyName || !newSupplierForm.form.email || !newSupplierForm.form.numberPhone || !newSupplierForm.form.rif) {
      setNewSupplierForm((prev) => ({ ...prev, error: true, errorMsg: "Todos los campos son obligatorios" }));
      setIsSubmitting(false);
      return false;
    }
    try {
      await SupplierService.new(newSupplierForm.form);
      await getSuppliers(currentPage, debouncedSearch, isActiveView);
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setNewSupplierForm((prev) => ({ ...prev, error: true, errorMsg: error.response?.data.message }));
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const editSupplier = async () => {
    setIsSubmitting(true);
    if (Object.keys(changedFields).length === 0) {
      setEditSupplierState((prev) => ({ ...prev, error: true, errorMsg: "No se han detectado cambios" }));
      setIsSubmitting(false);
      return false;
    }
    try {
      await SupplierService.edit(String(editSupplierState.id), changedFields);
      await getSuppliers(currentPage, debouncedSearch, isActiveView);
      setChangedFields({});
      setEditSupplierState((prev) => ({ ...prev, error: false, errorMsg: "" }));
      return true;
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setEditSupplierState((prev) => ({ ...prev, error: true, errorMsg: error.response?.data.message }));
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditSupplierState((prev) => ({ ...prev, [name]: value, error: false, errorMsg: "" }));
    setChangedFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSupplierForm((prev) => ({ ...prev, form: { ...prev.form, [name]: value }, error: false, errorMsg: "" }));
  };

  const handleSearchChange = (value: string) => {
    setSearchParameter(value);
    setCurrentPage(1);
  };

  return {
    suppliersData, isLoading, isSubmitting,
    currentSupplier, setCurrentSupplier,
    editSupplierState, setEditSupplierState, handleEditChange,
    deleteSupplier, restoreSupplier, changedFields,
    newSupplierForm, setNewSupplierForm, handleChange,
    registerSupplier, editSupplier,
    successMessage, setSuccessMessage,
    currentPage, setCurrentPage, totalPages,
    searchParameter, handleSearchChange,
    isActiveView, toggleActiveView
  };
};