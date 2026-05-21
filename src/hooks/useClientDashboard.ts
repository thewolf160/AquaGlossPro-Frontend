import { useState, useEffect } from "react";
import { SalesService } from "../services/sales.services";
import { VehicleService } from "../services/vehicles.services";
import type { ClientVehicle } from "../types/clients.types"; 

export interface WashHistory {
  id: number;
  date: string;
  vehicle: string;
  package: string;
  status: string;
  price: number;
  statusWashing: string;
}

export interface ClientDashboardData {
  userName: string;
  userEmail: string;
  vehiclesCount: number;
  vehicles: ClientVehicle[]; 
  totalWashes: number;
  history: WashHistory[];
  activeWashes: WashHistory[]; 
  isLoading: boolean;
}

export const useClientDashboard = () => {
  const [data, setData] = useState<ClientDashboardData>({
    userName: localStorage.getItem("user_name") || "Cliente",
    userEmail: localStorage.getItem("user_email") || "",
    vehiclesCount: 0,
    vehicles: [],
    totalWashes: 0,
    history: [],
    activeWashes: [],
    isLoading: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userEmail = localStorage.getItem("user_email") || "";
        if (!userEmail) {
          setData((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        let vehiclesCount = 0;
        let vehiclesList: ClientVehicle[] = [];
        try {
          const vehiclesRes = await VehicleService.getAll({ param: userEmail });
          vehiclesList = vehiclesRes?.data?.data || [];
          vehiclesCount = vehiclesList.length;
        } catch (error) {
          console.warn("Could not fetch vehicles:", error);
        }

        let history: WashHistory[] = [];
        let totalWashes = 0;
        try {
          const salesRes = await SalesService.getAll({ param: userEmail });
          const salesData = salesRes?.data || [];
          
          totalWashes = salesData.length;

          history = salesData.map((item: any) => {
            const { sale, vehicle, details } = item;

            let packageName = "Servicios Individuales";
            if (details?.comboServices && details.comboServices.length > 0) {
              packageName = details.comboServices[0].comboName;
            } else if (details?.independentServices && details.independentServices.length > 0) {
              packageName = details.independentServices[0].serviceName + (details.independentServices.length > 1 ? " y más" : "");
            }

            let readableStatus = "Pendiente";
            if (sale?.statusSale === 'C') readableStatus = "Cancelado";
            else if (sale?.statusWashing === 'W') readableStatus = "En Espera";
            else if (sale?.statusWashing === 'I') readableStatus = "En Progreso";
            else if (sale?.statusWashing === 'D') readableStatus = "Completado";

            let dateStr = "Fecha desconocida";
            if (sale?.saleDate) {
              // Backend returns "DD-MM-YYYY HH:mm" (in UTC timezone)
              const parts = sale.saleDate.split(' ');
              if (parts.length > 0) {
                const dateParts = parts[0].split('-');
                if (dateParts.length === 3) {
                  const day = dateParts[0];
                  const month = dateParts[1];
                  const year = dateParts[2];
                  // Append Z so JS knows this is UTC time, then it converts to Local Time!
                  const timeStr = parts[1] ? parts[1] + ":00Z" : "00:00:00Z";
                  const isoString = `${year}-${month}-${day}T${timeStr}`;
                  const d = new Date(isoString);
                  if (!isNaN(d.getTime())) {
                    dateStr = d.toLocaleDateString("es-ES", {
                      year: 'numeric', month: 'short', day: 'numeric'
                    });
                  }
                }
              }
            }

            return {
              id: sale?.saleId,
              date: dateStr,
              vehicle: vehicle?.plate || "Vehículo",
              package: packageName,
              status: readableStatus,
              price: parseFloat(details?.totalAmount || 0),
              statusWashing: sale?.statusSale === 'C' ? 'C' : sale?.statusWashing,
            };
          });
        } catch (error) {
          console.warn("Could not fetch sales:", error);
        }

        const activeWashes = history.filter(h => h.statusWashing === 'W' || h.statusWashing === 'I');

        setData((prev) => ({
          ...prev,
          vehiclesCount,
          vehicles: vehiclesList, 
          totalWashes,
          history,
          activeWashes,
          isLoading: false,
        }));
      } catch (error) {
        console.error("Error fetching client dashboard data:", error);
        setData((prev) => ({ ...prev, isLoading: false }));
      }
    };

    fetchData();
  }, []);

  return data;
};