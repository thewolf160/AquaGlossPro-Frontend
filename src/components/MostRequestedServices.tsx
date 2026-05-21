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


interface TopServiceData {
  serviceId: number;
  name: string;
  count: number;
}


interface MostRequestedServicesProps {
  servicesData?: TopServiceData[];
}

export default function MostRequestedServices({
  servicesData = [],
}: MostRequestedServicesProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTimeFilter, setActiveTimeFilter] =
    useState<TimeFilterType>("hoy");
  const [activeDateFrom, setActiveDateFrom] = useState("");
  const [activeDateTo, setActiveDateTo] = useState("");

  const [tempTimeFilter, setTempTimeFilter] = useState<TimeFilterType>("hoy");
  const [tempDateFrom, setTempDateFrom] = useState("");
  const [tempDateTo, setTempDateTo] = useState("");

  const timeFilterText = {
    hoy: "del día",
    semana: "de la semana",
    mes: "del mes",
    custom: "rango de fechas especificas",
  };

  
  const chartInfo = useMemo(() => {
    
    if (!servicesData || servicesData.length === 0) {
      return { labels: [], dataCounts: [] };
    }

    
    const labels = servicesData.map((s) => s.name.toLowerCase());
    const dataCounts = servicesData.map((s) => Number(s.count));

    return { labels, dataCounts };
  }, [servicesData]);

  const data = {
    labels: chartInfo.labels,
    datasets: [
      {
        label: "Servicios",
        data: chartInfo.dataCounts,
        backgroundColor: "#3b82f6",
        borderRadius: 20,
        barThickness: 15,
        categoryPercentage: 0.8,
        barPercentage: 0.9,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        enabled: true,
        callbacks: {
          label: (context: any) => ` Cantidad: ${context.raw} servicios`,
        },
      },
    },
    scales: {
      x: {
        display: true,
        border: { display: false },
        grid: {
          display: true,
          color: "#cbd5e1",
          drawTicks: false,
        },
        ticks: {
          color: "#94a3b8",
          font: { size: 12 },
          stepSize: 10,
        },
        
        max: chartInfo.dataCounts.length === 0 ? 10 : undefined,
      },
      y: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          color: "#64748b",
          font: { weight: "bold" as const, size: 12 },
          // Esto capitaliza la primera letra de cada servicio en la etiqueta Y
          callback: function (value: any, index: number, values: any) {
            const labelStr = data.labels[index] || "";
            return labelStr.charAt(0).toUpperCase() + labelStr.slice(1);
          },
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
      <div className="bg-white p-6 pb-2 rounded-2xl shadow-sm border border-slate-50 h-[520px] flex flex-col">
        <div className="flex justify-between items-start mb-6">
          {/* CABECERA LIMPIA: Título y Franja de tiempo */}
          <div>
            <h3 className="font-bold text-slate-800 text-lg leading-tight">
              Servicios más Solicitados
            </h3>
            <div className="mt-1">
              <span className="text-[15px] font-bold text-slate-400 uppercase tracking-widest">
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

        {/* CONTENEDOR DEL GRÁFICO */}
        <div className="flex-grow h-full w-full relative">
          {/* Si no hay datos, mostramos un mensaje amistoso en medio del contenedor */}
          {chartInfo.dataCounts.length === 0 ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-slate-400 font-medium">
                No hay servicios registrados en este periodo
              </p>
            </div>
          ) : (
            <Bar data={data} options={options} />
          )}
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
        </div>
      </Modal>
    </>
  );
}
