// src/hooks/useServiceHistory.ts
import { useState, useEffect } from 'react';
import { SalesService } from '../services/sales.services';
import type { SaleItem } from '../types/kanban.types';

export const useServiceHistory = () => {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Filtros
  const [searchParam, setSearchParam] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); 
  const [dateFilter, setDateFilter] = useState(""); 
  const fetchSales = async () => {
    setIsLoading(true);
    try {
      const response = await SalesService.getAll({
        page: currentPage.toString(),
        limit: "10",
        param: searchParam,
        statusWashing: statusFilter,
        date: dateFilter
      });
      setSales(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error("Error al cargar historial:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchSales(), 500); 
    return () => clearTimeout(timer);
  }, [currentPage, searchParam, statusFilter, dateFilter]);

  return {
    sales,
    isLoading,
    currentPage,
    setCurrentPage,
    totalPages,
    searchParam,
    setSearchParam,
    statusFilter,
    setStatusFilter,
    dateFilter,
    setDateFilter
  };
};