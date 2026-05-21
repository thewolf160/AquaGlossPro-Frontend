import { useState, useEffect } from "react";
import PaymentMethodChart from "../components/PaymentMethodChart";
import MostRequestedServices from "../components/MostRequestedServices";
import DynamicMetricsChart from "../components/DynamicMetricsChart";
import WashedVehiclesChart from "../components/WashedVehiclesChart";
import TopEmployeesChart from "../components/TopEmployeesChart";
import OperationalCloseChart from "../components/OperationalCloseChart";
import Modal from "../components/Modal/Modal";
import { hasPermission } from "../utils/checkPermissions.utils";

import { useReports } from "../hooks/useReports";

import {
  exportReportsToExcel,
  exportReportsToPDF,
} from "../utils/exportReports";

export default function Reports() {
  const { fetchAllReports, metrics, isLoading } = useReports();

  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "excel" | null>(null);

  const [activeTab, setActiveTab] = useState<"generales" | "operativos">(
    "generales",
  );
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  useEffect(() => {
    fetchAllReports({ period: "today" });
  }, [fetchAllReports]);

  const reportesGenerales = [
    { id: "ventas_metodo", name: "Ventas por Método de Pago" },
    { id: "servicios_solicitados", name: "Servicios más Solicitados" },
    {
      id: "metricas_dinamicas",
      name: "Resumen de Vehículos, Productos y Empleados",
    },
  ];

  const reportesOperativos = [
    { id: "vehiculos_lavados", name: "Total de Vehículos Lavados" },
    { id: "top_empleados", name: "Top Empleados (Vehículos Lavados)" },
    {
      id: "cierre_operativo",
      name: "Cierre Operativo (Ingresos vs Comisiones)",
    },
  ];

  const currentAvailableReports =
    activeTab === "generales" ? reportesGenerales : reportesOperativos;

  const handleOpenExportModal = (type: "pdf" | "excel") => {
    setExportType(type);
    setSelectedReports(currentAvailableReports.map((report) => report.id));
    setIsExportModalOpen(true);
  };

  const toggleReportSelection = (id: string) => {
    setSelectedReports((prev) =>
      prev.includes(id)
        ? prev.filter((reportId) => reportId !== id)
        : [...prev, id],
    );
  };

  const handleConfirmExport = () => {
    const tabLabel = activeTab === "generales" ? "Generales" : "Operativos";

    if (exportType === "excel") {
      exportReportsToExcel(selectedReports, metrics, tabLabel);
    } else if (exportType === "pdf") {
      exportReportsToPDF(selectedReports, metrics, tabLabel);
    }

    setIsExportModalOpen(false);
    setExportType(null);
  };

  return (
    <div className="p-6">
      {isLoading && (
        <div className="fixed top-4 right-4 bg-white px-4 py-2 rounded-lg shadow-md border border-slate-100 flex items-center gap-3 z-50 animate-fade-in">
          <span className="loading loading-spinner loading-sm text-blue-600"></span>
          <span className="text-sm font-bold text-slate-700">
            Actualizando métricas...
          </span>
        </div>
      )}

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* PRODUCTOS MÁS UTILIZADOS */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-rose-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-rose-100 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              className="text-rose-800"
            >
              <path
                fill="currentColor"
                d="M22 3H2v6h1v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V9h1zM4 5h16v2H4zm15 15H5V9h14zM9 11h6a2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2"
              />
            </svg>
          </div>
          <div>
            <p className="font-medium text-sm text-rose-700 leading-tight">
              Producto Más Utilizado
            </p>
            <p className="text-2xl font-bold text-rose-900 capitalize">
              {metrics.topProducts[0]?.name?.toLowerCase() || "Sin datos"}
            </p>
          </div>
        </div>

        {/* SERVICIOS DEL DÍA */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-orange-100">
            <i className="bi bi-car-front text-orange-800 text-xl flex items-center justify-center w-5 h-5"></i>
          </div>
          <div>
            <p className="font-medium text-sm text-orange-500 leading-tight">
              Total Servicios del Día
            </p>
            <p className="text-2xl font-bold text-orange-900">
              {metrics.totalServicesToday}
            </p>
          </div>
        </div>

        {/* MÉTODO DE PAGO */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-100">
            <i className="bi bi-credit-card-2-back text-blue-800 text-xl flex items-center justify-center w-5 h-5"></i>
          </div>
          <div>
            <p className="font-medium text-sm text-blue-500 leading-tight">
              Método Más Usado
            </p>
            <p className="text-2xl font-bold text-blue-900 capitalize">
              {metrics.mostUsedPayment?.name?.toLowerCase() || "Sin datos"}
            </p>
          </div>
        </div>

        {/* VEHÍCULO FRECUENTE */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-purple-100">
            <i className="bi bi-truck text-purple-800 text-xl flex items-center justify-center w-5 h-5"></i>
          </div>
          <div>
            <p className="font-medium text-sm text-purple-500 leading-tight">
              Vehículo Frecuente
            </p>
            <p className="text-xl font-bold text-purple-900 capitalize truncate w-32">
              {metrics.mostFrequentVehicle?.name?.toLowerCase() || "Sin datos"}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-8 mb-6 flex justify-center">
        <div className="inline-flex bg-slate-200/60 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab("generales")}
            className={`px-8 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 flex items-center gap-2 ${
              activeTab === "generales"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
            }`}
          >
            <i className="bi bi-bar-chart-fill"></i> Reportes Gerenciales
          </button>
          <button
            onClick={() => setActiveTab("operativos")}
            className={`px-8 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 flex items-center gap-2 ${
              activeTab === "operativos"
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-500 hover:text-slate-700 hover:bg-slate-200"
            }`}
          >
            <i className="bi bi-gear-fill"></i> Reportes Operativos
          </button>
        </div>
      </section>

      {/* VISTA: REPORTES GENERALES */}
      {activeTab === "generales" && (
        <div className="animate-fade-in">
          <section className="grid grid-cols-1 xl:grid-cols-[1.2fr,2fr] gap-6 items-start">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-4">
                <PaymentMethodChart salesData={metrics.salesByPayment} />
              </div>
              <div className="lg:col-span-8">
                <MostRequestedServices servicesData={metrics.topServices} />
              </div>
            </div>
            <section className="mt-6 mb-10">
              <DynamicMetricsChart
                vehiclesData={metrics.vehiclesByType}
                productsData={metrics.topProducts}
                employeesData={metrics.topEmployeesCommission}
              />
            </section>
          </section>
        </div>
      )}

      {/* VISTA: REPORTES OPERATIVOS */}
      {activeTab === "operativos" && (
        <div className="animate-fade-in">
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
            <div className="lg:col-span-4">
              <WashedVehiclesChart vehiclesData={metrics.vehiclesByType} />
            </div>
            <div className="lg:col-span-8">
              <TopEmployeesChart employeesData={metrics.topEmployeesVehicles} />
            </div>
          </section>

          <section className="mt-6 mb-10">
            <OperationalCloseChart closureData={metrics.operationalClosure} />
          </section>
        </div>
      )}

      {hasPermission("COMISSIONS", "R") && (
        <section className="mt-8 flex flex-col sm:flex-row justify-end items-center gap-4 border-t border-slate-200 pt-6">
          <button
            onClick={() => handleOpenExportModal("pdf")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-red-50 border border-red-400 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
          >
            <i className="bi bi-file-earmark-pdf text-lg"></i> Exportar a PDF
          </button>
          <button
            onClick={() => handleOpenExportModal("excel")}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-green-50 border border-green-400 text-green-600 font-semibold rounded-lg hover:bg-green-100 transition-colors"
          >
            <i className="bi bi-file-earmark-excel text-lg"></i> Exportar a
            EXCEL
          </button>
        </section>
      )}

      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title={`Exportar Reportes ${activeTab === "generales" ? "Generales" : "Operativos"}`}
        actions={
          <button
            onClick={handleConfirmExport}
            disabled={selectedReports.length === 0}
            className={`px-4 py-2 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
              selectedReports.length === 0
                ? "bg-slate-300 cursor-not-allowed"
                : exportType === "pdf"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {exportType === "pdf" ? (
              <i className="bi bi-file-earmark-pdf"></i>
            ) : (
              <i className="bi bi-file-earmark-excel"></i>
            )}
            Exportar a {exportType?.toUpperCase()} ({selectedReports.length})
          </button>
        }
      >
        <div className="py-2">
          <p className="text-slate-600 text-sm mb-4">
            Selecciona los módulos que deseas incluir en tu archivo{" "}
            <span className="font-bold text-slate-800">
              {exportType?.toUpperCase()}
            </span>
            :
          </p>
          <div className="space-y-2.5">
            {currentAvailableReports.map((report) => {
              const isSelected = selectedReports.includes(report.id);
              return (
                <div
                  key={report.id}
                  onClick={() => toggleReportSelection(report.id)}
                  className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? "border-blue-500 bg-blue-50/50" : "border-slate-100 hover:border-slate-200 hover:bg-slate-50"}`}
                >
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${isSelected ? "bg-blue-600 border-blue-600 text-white" : "border-2 border-slate-300 bg-white"}`}
                  >
                    {isSelected && (
                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <span
                    className={`text-sm font-semibold ${isSelected ? "text-blue-900" : "text-slate-700"}`}
                  >
                    {report.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
