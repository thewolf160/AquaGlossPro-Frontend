import { useState } from "react";
import PaymentMethodChart from "../components/PaymentMethodChart";
import MostRequestedServices from "../components/MostRequestedServices";
import DynamicMetricsChart from "../components/DynamicMetricsChart";
import Modal from "../components/Modal/Modal";

function Reports() {
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportType, setExportType] = useState<"pdf" | "excel" | null>(null);

  const handleOpenExportModal = (type: "pdf" | "excel") => {
    setExportType(type);
    setIsExportModalOpen(true);
  };

  const handleConfirmExport = () => {
    console.log(`Exportando datos en formato: ${exportType?.toUpperCase()}`);
    alert(`¡Reporte exportado exitosamente a ${exportType?.toUpperCase()}!`);
    setIsExportModalOpen(false);
    setExportType(null);
  };

  return (
    <div className="p-6">
      {/* SECCIÓN DE CARTAS DE ESTADÍSTICAS */}
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
              Productos Más Utilizados
            </p>
            <p className="text-2xl font-bold text-rose-900">Champú</p>
          </div>
        </div>

        {/* SERVICIOS DEL DÍA */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-orange-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-orange-100">
            <i className="bi bi-car-front text-orange-800 text-xl flex items-center justify-center w-5 h-5"></i>
          </div>
          <div>
            <p className="font-medium text-sm text-orange-500 leading-tight">
              Total Servicios del Dia
            </p>
            <p className="text-2xl font-bold text-orange-900">45</p>
          </div>
        </div>

        {/* MÉTODO DE PAGO */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-blue-100">
            <i className="bi bi-credit-card-2-back text-blue-800 text-xl flex items-center justify-center w-5 h-5"></i>
          </div>
          <div>
            <p className="font-medium text-sm text-blue-500 leading-tight">
              Metodo de Pago Más usado
            </p>
            <p className="text-2xl font-bold text-blue-900">Efectivo</p>
          </div>
        </div>

        {/* VEHÍCULO FRECUENTE */}
        <div className="bg-white p-4 rounded-xl shadow-sm border border-purple-200 hover:shadow-md transition-shadow flex items-center gap-4">
          <div className="p-3 rounded-full bg-purple-100">
            <i className="bi bi-truck text-purple-800 text-xl flex items-center justify-center w-5 h-5"></i>
          </div>
          <div>
            <p className="font-medium text-sm text-purple-500 leading-tight">
              Vehiculo Más Frecuente
            </p>
            <p className="text-2xl font-bold text-purple-900">MED/Sedan</p>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE GRÁFICOS */}
      <section className="mt-10 grid grid-cols-1 xl:grid-cols-[1.2fr,2fr] gap-6 items-start">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-4">
            <PaymentMethodChart
              efectivoAmount={720}
              pagoMovilAmount={300}
              divisaAmount={180}
              puntoAmount={450}
            />
          </div>
          <div className="lg:col-span-8">
            <MostRequestedServices />
          </div>
        </div>
        <section className="mt-6 mb-10">
          <DynamicMetricsChart />
        </section>
      </section>

      {/* --- BOTONES DE EXPORTACIÓN --- */}
      <section className="mt-8 flex flex-col sm:flex-row justify-end items-center gap-4 border-t border-slate-200 pt-6">
        <button
          onClick={() => handleOpenExportModal("pdf")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-red-50 border border-red-400 text-red-600 font-semibold rounded-lg hover:bg-red-100 transition-colors"
        >
          <i className="bi bi-file-earmark-pdf text-lg"></i>
          Exportar a PDF
        </button>

        <button
          onClick={() => handleOpenExportModal("excel")}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-2.5 bg-green-50 border border-green-400 text-green-600 font-semibold rounded-lg hover:bg-green-100 transition-colors"
        >
          <i className="bi bi-file-earmark-excel text-lg"></i>
          Exportar a EXCEL
        </button>
      </section>

      {/* MODAL DE CONFIRMACIÓN */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Confirmar Exportación"
        actions={
          <div className="flex gap-3 justify-end">
            {/* Solo dejamos el botón de confirmar; el de "Cerrar" lo pone el componente automáticamente */}
            <button
              onClick={handleConfirmExport}
              className={`px-4 py-2 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
                exportType === "pdf"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {exportType === "pdf" ? (
                <i className="bi bi-file-earmark-pdf"></i>
              ) : (
                <i className="bi bi-file-earmark-excel"></i>
              )}
              Sí, exportar a {exportType?.toUpperCase()}
            </button>
          </div>
        }
      >
        <div className="py-4">
          <p className="text-slate-600 text-base">
            ¿Estás seguro de que deseas exportar todos los reportes actuales a
            un formato{" "}
            <span className="font-bold text-slate-800">
              {exportType?.toUpperCase()}
            </span>
            ? Esta acción compilará los datos mostrados en pantalla.
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default Reports;
