import { useState, useEffect } from 'react';
import type { SaleItem, StatusWashing } from '../types/sales.types';
import { getDailySales, updateWashingStatus } from '../services/sales.services';

export const useKanban = () => {
  const [tickets, setTickets] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTodayWashes = async (isBackground = false) => {
    if (!isBackground) setLoading(true); 
    
    try {
      const today = new Date().toISOString().split('T')[0];
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