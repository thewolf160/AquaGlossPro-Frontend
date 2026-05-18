import { useState, useEffect } from 'react';
import { SalesService } from '../services/sales.services';
import type { SaleItem } from '../types/kanban.types';

export const useServiceHistory = () => {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchParam, setSearchParam] = useState("");
  const [dateFilter, setDateFilter] = useState({ startDate: "", endDate: "" });
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(searchParam);
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchParam]);

  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage.toString(),
        limit: "10",
      };

      if (debouncedSearch) {
        params.param = debouncedSearch;
      }
      if (dateFilter.startDate) {
        params.startDate = dateFilter.startDate;
      }
      if (dateFilter.endDate) {
        params.endDate = `${dateFilter.endDate}T23:59:59`;
      }

      const response = await SalesService.getAll(params);
      
      setSales(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSales();
  }, [currentPage, debouncedSearch, dateFilter]);

  const changeStatus = async (id: number, newStatus: "P" | "C") => {
    setIsSubmitting(true);
    try {
      await SalesService.updateStatusPayment(id, newStatus);
      await fetchSales(); 
      return true;
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    sales,
    isLoading,
    isSubmitting,
    currentPage,
    setCurrentPage,
    totalPages,
    searchParam,
    setSearchParam,
    dateFilter,
    setDateFilter,
    changeStatus
  };
};