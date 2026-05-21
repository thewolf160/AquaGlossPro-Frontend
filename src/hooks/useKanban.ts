import { useState, useEffect } from 'react';
import type { SaleItem, StatusWashing } from '../types/kanban.types';
import { getDailySales, updateWashingStatus } from '../services/kanban.services';

export const useKanban = () => {
  const [tickets, setTickets] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayWashes = async (isBackground = false) => {
    if (!isBackground) setLoading(true); 
    
    try {
      const date = new Date();
      
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      
      const today = `${year}-${month}-${day}`;
      
      const data = await getDailySales(today);
      
      setTickets(data.filter(t => t.sale.statusWashing !== 'C'));
    } catch (error) {
      console.error("Error cargando lavados:", error);
    } finally {
      if (!isBackground) setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayWashes();
    const interval = setInterval(() => fetchTodayWashes(true), 15000);

    return () => clearInterval(interval);
  }, []);

  const changeTicketStatus = async (id: number, newStatus: StatusWashing) => {
    try {
      setTickets(prev => 
        newStatus === 'C' 
          ? prev.filter(t => t.sale.saleId !== id) 
          : prev.map(t => t.sale.saleId === id ? { ...t, sale: { ...t.sale, statusWashing: newStatus } } : t)
      );
      await updateWashingStatus(id, newStatus);
      return { success: true }; 
    } catch (error) {
      console.error("Error actualizando estado:", error);
      fetchTodayWashes(true); 
      return { success: false }; 
    }
  };

  return { tickets, loading, changeTicketStatus };
};