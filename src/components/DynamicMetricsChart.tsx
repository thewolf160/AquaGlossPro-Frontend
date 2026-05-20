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
import Modal from "../components/Modal/Modal";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);


type TabType = "vehiculos" | "productos" | "empleados";
type TimeFilterType = "hoy" | "semana" | "mes" | "custom";

export default function DynamicMetricsChart() {
  const [activeTab, setActiveTab] = useState<TabType>("vehiculos");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTimeFilter, setActiveTimeFilter] =
    useState<TimeFilterType>("hoy");
  const [activeDateFrom, setActiveDateFrom] = useState("");
  const [activeDateTo, setActiveDateTo] = useState("");

  const [tempTimeFilter, setTempTimeFilter] = useState<TimeFilterType>("hoy");
  const [tempDateFrom, setTempDateFrom] = useState("");
  const [tempDateTo, setTempDateTo] = useState("");

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
      labelName: "Unidades",
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
      labelName: "Comisiones ($)",
    },
  };

  const timeFilterText = {
    hoy: "del día",
    semana: "de la semana",
    mes: "del mes",
    custom: "rango de fechas específico",
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
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
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
        grid: { color: "#cbd5e1", drawTicks: false },
        ticks: { color: "#94a3b8", stepSize: 100 },
      },
    },
  };

  const handleOpenModal = () => {
    setTempTimeFilter(activeTimeFilter);
    setTempDateFrom(activeDateFrom);
    setTempDateTo(activeDateTo);
    setIsModalOpen(true);
  };

  const handleApplyFilters = () => {
    setActiveTimeFilter(tempTimeFilter);
    setActiveDateFrom(tempDateFrom);
    setActiveDateTo(tempDateTo);
    setIsModalOpen(false);
    console.log("Filtros aplicados:", {
      tempTimeFilter,
      tempDateFrom,
      tempDateTo,
    });
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 w-full">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-6 gap-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">
              {currentData.title}
            </h3>
            <div className="mt-1">
              <span className="text-[15px] font-bold text-slate-400 uppercase tracking-widest">
                {timeFilterText[activeTimeFilter]}{" "}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full xl:w-auto justify-between xl:justify-end overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            <div className="flex bg-slate-100 p-1 rounded-lg whitespace-nowrap">
              {/* Revertido a las 3 pestañas iniciales */}
              {(["vehiculos", "productos", "empleados"] as TabType[]).map(
                (tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all capitalize ${
                      activeTab === tab
                        ? "bg-white shadow-sm text-blue-600"
                        : "text-slate-500 hover:text-slate-700"
                    }`}
                  >
                    {tab}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={handleOpenModal}
              className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors shrink-0 h-9 w-9 -mt-1 -mr-2"
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
        title="Filtros de Métricas"
        actions={
          <button
            className="btn bg-blue-600 hover:bg-blue-700 text-white border-none"
            onClick={handleApplyFilters}
          >
            Aplicar Filtros
          </button>
        }
      >
        <div className="flex flex-col gap-6 py-2">
          <div>
            <p className="text-slate-700 font-medium mb-3">
              Cambiar periodo a:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                onClick={() => setTempTimeFilter("hoy")}
                className={`py-2 px-4 rounded-md border font-medium transition-colors ${
                  tempTimeFilter === "hoy"
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "bg-blue-50 border-blue-200 text-blue-600"
                }`}
              >
                Hoy
              </button>
              <button
                onClick={() => setTempTimeFilter("semana")}
                className={`py-2 px-4 rounded-md border font-medium transition-colors ${
                  tempTimeFilter === "semana"
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "bg-blue-50 border-blue-200 text-blue-600"
                }`}
              >
                Semana
              </button>
              <button
                onClick={() => setTempTimeFilter("mes")}
                className={`py-2 px-4 rounded-md border font-medium transition-colors ${
                  tempTimeFilter === "mes"
                    ? "bg-blue-100 border-blue-400 text-blue-700"
                    : "bg-blue-50 border-blue-200 text-blue-600"
                }`}
              >
                Mes
              </button>
            </div>
          </div>
          <div className="divider my-0">Ó</div>
          <div>
            <p className="text-slate-700 font-medium mb-3">Elegir fechas:</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="date"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                value={tempDateFrom}
                onChange={(e) => {
                  setTempDateFrom(e.target.value);
                  setTempTimeFilter("custom");
                }}
              />
              <input
                type="date"
                className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                value={tempDateTo}
                onChange={(e) => {
                  setTempDateTo(e.target.value);
                  setTempTimeFilter("custom");
                }}
              />
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
