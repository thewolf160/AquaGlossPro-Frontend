import { useState, useCallback } from "react";
import { ReportsService } from "../services/reports.services";
import type { ReportFilterParams } from "../types/reports.types";

export function useReports() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Estados individuales para cada gráfico/métrica
  const [totalServicesToday, setTotalServicesToday] = useState(0);
  const [mostUsedPayment, setMostUsedPayment] = useState<any>(null);
  const [mostFrequentVehicle, setMostFrequentVehicle] = useState<any>(null);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [salesByPayment, setSalesByPayment] = useState<any[]>([]);
  const [topServices, setTopServices] = useState<any[]>([]);
  const [vehiclesByType, setVehiclesByType] = useState<any[]>([]);
  const [topEmployeesCommission, setTopEmployeesCommission] = useState<any[]>(
    [],
  );
  const [topEmployeesVehicles, setTopEmployeesVehicles] = useState<any[]>([]);
  const [operationalClosure, setOperationalClosure] = useState<any[]>([]);

  const fetchAllReports = useCallback(async (params: ReportFilterParams) => {
    setIsLoading(true);
    setError(null);

    try {
      // Promise.allSettled permite que si un endpoint falla, los demás sigan cargando
      const results = await Promise.allSettled([
        ReportsService.getTotalServicesToday(),
        ReportsService.getMostUsedPaymentMethod(params),
        ReportsService.getMostFrequentVehicleType(params),
        ReportsService.getMostUsedProducts(params),
        ReportsService.getSalesByPaymentMethod(params),
        ReportsService.getTopServices(params),
        ReportsService.getTotalVehiclesByType(params),
        ReportsService.getTopEmployeesByCommission(params),
        ReportsService.getTopEmployeesByVehiclesWashed(params),
        ReportsService.getOperationalClosure(params),
      ]);

      // Mapeo de resultados
      if (results[0].status === "fulfilled")
        setTotalServicesToday(results[0].value.count || 0);
      if (results[1].status === "fulfilled")
        setMostUsedPayment(results[1].value);
      if (results[2].status === "fulfilled")
        setMostFrequentVehicle(results[2].value);
      if (results[3].status === "fulfilled")
        setTopProducts(results[3].value || []);
      if (results[4].status === "fulfilled")
        setSalesByPayment(results[4].value || []);
      if (results[5].status === "fulfilled")
        setTopServices(results[5].value || []);
      if (results[6].status === "fulfilled")
        setVehiclesByType(results[6].value || []);
      if (results[7].status === "fulfilled")
        setTopEmployeesCommission(results[7].value || []);
      if (results[8].status === "fulfilled")
        setTopEmployeesVehicles(results[8].value || []);
      if (results[9].status === "fulfilled")
        setOperationalClosure(results[9].value || []);
    } catch (err: any) {
      console.error("Error al obtener los reportes:", err);
      setError("No se pudieron cargar algunas métricas. Verifica tu conexión.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    fetchAllReports,
    metrics: {
      totalServicesToday,
      mostUsedPayment,
      mostFrequentVehicle,
      topProducts,
      salesByPayment,
      topServices,
      vehiclesByType,
      topEmployeesCommission,
      topEmployeesVehicles,
      operationalClosure,
    },
  };
}
