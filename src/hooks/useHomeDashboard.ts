import { useState, useEffect } from 'react';
import { getDailySales } from '../services/kanban.services';
import type { SaleItem } from '../types/kanban.types';

export interface DashboardStats {
  waiting: number;
  inProgress: number;
  done: number;
}

export const useHomeDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({ waiting: 0, inProgress: 0, done: 0 });
  const [recentSales, setRecentSales] = useState<SaleItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      const today = new Date().toISOString().split('T')[0];
      const data = await getDailySales(today);
      
      // Calculate stats based on statusWashing
      let waiting = 0;
      let inProgress = 0;
      let done = 0;

      data.forEach(item => {
        if (item.sale.statusWashing === 'W') waiting++;
        else if (item.sale.statusWashing === 'I') inProgress++;
        else if (item.sale.statusWashing === 'D') done++;
      });

      setStats({ waiting, inProgress, done });

      // Get 5 most recent sales (assuming backend returns them sorted desc by date, or we sort them)
      // Kanban query limits to 100 and sorts by saleDate DESC
      setRecentSales(data.slice(0, 5));
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return { stats, recentSales, isLoading };
};
