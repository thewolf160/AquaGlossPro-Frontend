import { useState, useMemo } from "react";
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

type TimeFilterType = "hoy" | "semana" | "mes" | "custom";


interface OperationalClosureData {
  date: string;
  grossIncome: number;
  commissionsPaid: number;
  expenses: number;
  netIncome: number;
}

interface OperationalCloseChartProps {
  closureData?: OperationalClosureData[];
}

export default function OperationalCloseChart({
  closureData = [],
}: OperationalCloseChartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTimeFilter, setActiveTimeFilter] =
    useState<TimeFilterType>("semana");
  const [activeDateFrom, setActiveDateFrom] = useState("");
  const [activeDateTo, setActiveDateTo] = useState("");

  const [tempTimeFilter, setTempTimeFilter] =
    useState<TimeFilterType>("semana");
  const [tempDateFrom, setTempDateFrom] = useState("");
  const [tempDateTo, setTempDateTo] = useState("");

  const timeFilterText = {
    hoy: "del día",
    semana: "de la semana",
    mes: "del mes",
    custom: "rango específico",
  };

  
  const chartInfo = useMemo(() => {
    if (!closureData || closureData.length === 0) {
      return { labels: [], netIncome: [], commissions: [], expenses: [] };
    }

    const labels = closureData.map((d) => {
      
      const parts = d.date.split("-");
      if (parts.length === 3) return `${parts[2]}/${parts[1]}`;
      return d.date;
    });

    const netIncome = closureData.map((d) => Number(d.netIncome.toFixed(2)));
    const commissions = closureData.map((d) =>
      Number(d.commissionsPaid.toFixed(2)),
    );
    const expenses = closureData.map((d) => Number(d.expenses.toFixed(2)));

    return { labels, netIncome, commissions, expenses };
  }, [closureData]);

  const data = {
    labels: chartInfo.labels,
    datasets: [
      {
        label: "Ingreso Neto (Local)",
        data: chartInfo.netIncome,
        backgroundColor: "#10b981", // Esmeralda
        stack: "Stack 1",
        borderRadius: {
          topLeft: 0,
          topRight: 0,
          bottomLeft: 6,
          bottomRight: 6,
        },
        barThickness: 25,
      },
      {
        label: "Comisiones Pagadas",
        data: chartInfo.commissions,
        backgroundColor: "#f59e0b", // Ámbar
        stack: "Stack 1",
        borderRadius: {
          topLeft: 6,
          topRight: 6,
          bottomLeft: 0,
          bottomRight: 0,
        },
        barThickness: 25,
      },
      {
        label: "Egresos / Inventario",
        data: chartInfo.expenses,
        backgroundColor: "#ef4444", // Rojo
        stack: "Stack 2",
        borderRadius: 6,
        barThickness: 25,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        align: "end" as const,
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { size: 12, weight: "bold" as const },
          color: "#64748b",
        },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (context: any) => ` ${context.dataset.label}: $${context.raw}`,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        grid: { display: false },
        ticks: {
          color: "#64748b",
          font: { weight: "bold" as const, size: 12 },
        },
      },
      y: {
        stacked: true,
        grid: { color: "#e2e8f0", drawTicks: false },
        border: { display: false },
        ticks: {
          color: "#94a3b8",
          stepSize: 50,
          callback: (value: any) => `$${value}`,
        },
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
  };

  return (
    <>
      <div className="bg-white p-6 pb-2 rounded-2xl shadow-sm border border-slate-50 h-full flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">
              Cierre Operativo (Ingresos vs Egresos)
            </h3>
            <div className="mt-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                {timeFilterText[activeTimeFilter]}
              </span>
            </div>
          </div>

          <button
            onClick={handleOpenModal}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors h-9 w-9 -mt-1 -mr-2"
          >
            <i className="bi bi-three-dots-vertical text-lg"></i>
          </button>
        </div>

        <div className="flex-grow h-[320px] w-full mt-2 relative">
          {chartInfo.labels.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-slate-400 font-medium">
                No hay cierres operativos registrados en este periodo
              </p>
            </div>
          ) : (
            <Bar data={data} options={options} />
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Filtros del Cierre Operativo"
        actions={
          <button
            className="btn bg-blue-600 hover:bg-blue-700 text-white border-none px-4 py-2 rounded-lg font-medium"
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
