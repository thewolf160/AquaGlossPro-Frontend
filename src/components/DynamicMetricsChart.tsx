import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import Modal from "./Modal/Modal";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

type TabType = "vehiculos" | "productos" | "empleados";
type TimeFilterType = "hoy" | "semana" | "mes" | "custom";

export default function DynamicMetricsChart() {
  const [activeTab, setActiveTab] = useState<TabType>("vehiculos");

  // Estados para el Modal y los Filtros
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("hoy");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const chartDataSets = {
    vehiculos: {
      title: "Resumen de Vehículos Frecuentes",
      labels: ["Sedan", "SUV", "Camioneta", "Moto", "Compacto"],
      data: [150, 120, 85, 60, 45],
      color: "#3b82f6",
      labelName: "Cantidad Atendida",
    },
    productos: {
      title: "Top 5 Productos más Utilizados",
      labels: ["Champú", "Cera", "Desengrasante", "Silicona", "Ambientador"],
      data: [320, 210, 180, 150, 90],
      color: "#10b981",
      labelName: "Unidades (Litros/Galones)",
    },
    empleados: {
      title: "Top 5 Empleados por Comisiones",
      labels: [
        "Yonathan N.",
        "Jesus C.",
        "Mauricio V.",
        "Fabian D.",
        "Jose V.",
      ],
      data: [450, 380, 320, 290, 210],
      color: "#8b5cf6",
      labelName: "Comisiones Generadas ($)",
    },
  };

  const currentData = chartDataSets[activeTab];

  const data = {
    labels: currentData.labels,
    datasets: [
      {
        label: currentData.labelName,
        data: currentData.data,
        backgroundColor: currentData.color,
        borderRadius: 6,
        barThickness: 40,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: true } },
    scales: {
      x: {
        grid: { display: false },
        ticks: {
          color: "#64748b",
          font: { weight: "bold" as const, size: 12 },
        },
      },
      y: {
        border: { display: false },
        grid: { color: "#f1f5f9", drawTicks: false },
        ticks: { color: "#94a3b8" },
      },
    },
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              {currentData.title}
            </h3>
            <p className="text-xs text-slate-400">
              Haz clic en las opciones para cambiar de vista
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab("vehiculos")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === "vehiculos"
                    ? "bg-white shadow-sm text-blue-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Vehículos
              </button>
              <button
                onClick={() => setActiveTab("productos")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === "productos"
                    ? "bg-white shadow-sm text-emerald-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Productos
              </button>
              <button
                onClick={() => setActiveTab("empleados")}
                className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                  activeTab === "empleados"
                    ? "bg-white shadow-sm text-violet-600"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Empleados
              </button>
            </div>

            {/* BOTÓN DE 3 PUNTOS - Ahora abre el modal */}
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors flex items-center justify-center h-9 w-9"
            >
              <i className="bi bi-three-dots-vertical text-lg"></i>
            </button>
          </div>
        </div>

        <div className="h-72 w-full mt-4">
          <Bar data={data} options={options} />
        </div>
      </div>

      {/* MODAL DE FILTROS */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Filtros del Gráfico"
        actions={
          <button
            className="btn bg-blue-600 hover:bg-blue-700 text-white border-none"
            onClick={() => {
              // Aquí luego puedes enviar dateFrom y dateTo a tu backend
              console.log("Aplicando filtros:", {
                timeFilter,
                dateFrom,
                dateTo,
              });
              setIsModalOpen(false);
            }}
          >
            Aplicar Filtros
          </button>
        }
      >
        <div className="flex flex-col gap-6 py-2">
          {/* Botones de Selección Rápida */}
          <div>
            <p className="text-slate-700 font-medium mb-3">
              Desea ver el gráfico de:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setTimeFilter("hoy")}
                className={`py-2 px-4 rounded-md border font-medium transition-colors ${
                  timeFilter === "hoy"
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                }`}
              >
                Hoy
              </button>
              <button
                onClick={() => setTimeFilter("semana")}
                className={`py-2 px-4 rounded-md border font-medium transition-colors ${
                  timeFilter === "semana"
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setTimeFilter("mes")}
                className={`py-2 px-4 rounded-md border font-medium transition-colors ${
                  timeFilter === "mes"
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "bg-blue-50 border-blue-200 text-blue-600 hover:bg-blue-100"
                }`}
              >
                Mes
              </button>
            </div>
          </div>

          <div className="divider my-0">Ó</div>

          {/* Selector de Rango de Fechas Personalizado */}
          <div>
            <p className="text-slate-700 font-medium mb-3">
              Rango específico de fechas:
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="w-full">
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Desde
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => {
                    setDateFrom(e.target.value);
                    setTimeFilter("custom");
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
              <div className="w-full">
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Hasta
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => {
                    setDateTo(e.target.value);
                    setTimeFilter("custom");
                  }}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
