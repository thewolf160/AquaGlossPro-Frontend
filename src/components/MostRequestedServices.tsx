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

type TimeFilterType = "hoy" | "semana" | "mes" | "custom";

export default function MostRequestedServices() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("semana");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const data = {
    labels: [
      "Lavado Express",
      "Pulitura",
      "Lavado de Motor",
      "Detallado",
      "Aspirado Interno",
      "Aplicación de Cera",
      "Descontaminación",
    ],
    datasets: [
      {
        label: "Servicios",
        data: [35, 28, 22, 18, 15, 10, 6],
        backgroundColor: "#3b82f6",
        categoryPercentage: 0.9,
        borderRadius: 20,
        barThickness: 15,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { enabled: true },
    },
    scales: {
      x: { display: false, grid: { display: false } },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: { weight: "bold" as const, size: 12 },
        },
      },
    },
  };

  return (
    <>
      <div className="bg-white p-6 pb-2 rounded-2xl shadow-sm border border-slate-50 h-full flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-bold text-slate-800 text-lg">
            Servicios más Solicitados
          </h3>

          {/* BOTÓN DE 3 PUNTOS - Reemplaza al badge de "Esta Semana" */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors flex items-center justify-center h-9 w-9 -mt-1 -mr-2"
          >
            <i className="bi bi-three-dots-vertical text-lg"></i>
          </button>
        </div>

        {/* Contenedor del gráfico (aumenté un poco a h-72 para acomodar 7 barras cómodamente) */}
        <div className="flex-grow h-[340px] w-full">
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
