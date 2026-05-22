import { useState, useMemo } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Modal from "../components/Modal/Modal";

ChartJS.register(ArcElement, Tooltip, Legend);

type TimeFilterType = "hoy" | "semana" | "mes" | "custom";

interface SalesData {
  paymentMethodId: number;
  name: string;
  total: number;
}

interface PaymentMethodChartProps {
  salesData?: SalesData[];
}


const PALETTE_HEX = [
  "#3b82f6",
  "#8b5cf6",
  "#a16207",
  "#06b6d4",
  "#10b981",
  "#f43f5e",
];
const PALETTE_TW = [
  "bg-blue-500",
  "bg-violet-500",
  "bg-yellow-700",
  "bg-cyan-500",
  "bg-emerald-500",
  "bg-rose-500",
];

export default function PaymentMethodChart({
  salesData = [],
}: PaymentMethodChartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [activeTimeFilter, setActiveTimeFilter] =
    useState<TimeFilterType>("hoy");
  const [activeDateFrom, setActiveDateFrom] = useState("");
  const [activeDateTo, setActiveDateTo] = useState("");

  const [tempTimeFilter, setTempTimeFilter] = useState<TimeFilterType>("hoy");
  const [tempDateFrom, setTempDateFrom] = useState("");
  const [tempDateTo, setTempDateTo] = useState("");

  const centerLabelText = {
    hoy: "total hoy",
    semana: "total sem",
    mes: "total mes",
    custom: "total esp",
  };

  
  const chartInfo = useMemo(() => {
    
    const labels = salesData.map((s) => {
      const lower = s.name.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
    });

    
    const dataCounts = salesData.map((s) => Number(s.total));

    
    const total = dataCounts.reduce((acc, curr) => acc + curr, 0);

    return { labels, dataCounts, total };
  }, [salesData]);

  const currentTotal = chartInfo.total;

  const getPercentage = (amount: number) => {
    if (currentTotal === 0) return 0;
    return Math.round((amount / currentTotal) * 100);
  };

  const formattedTotal =
    currentTotal >= 1000
      ? `${(currentTotal / 1000).toFixed(1)}k`
      : `$${currentTotal.toFixed(2)}`;

  
  const displayData = currentTotal === 0 ? [1] : chartInfo.dataCounts;
  const displayColors =
    currentTotal === 0
      ? ["#f1f5f9"]
      : PALETTE_HEX.slice(0, chartInfo.dataCounts.length);

  const data = {
    labels: chartInfo.labels,
    datasets: [
      {
        data: displayData,
        backgroundColor: displayColors,
        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            if (currentTotal === 0) return " Sin datos en este periodo";
            const label = context.label || "";
            const value = context.parsed || 0;
            return ` ${label}: $${value.toFixed(2)} (${getPercentage(value)}%)`;
          },
        },
      },
    },
  };

  const handleApplyFilters = () => {
    setActiveTimeFilter(tempTimeFilter);
    setActiveDateFrom(tempDateFrom);
    setActiveDateTo(tempDateTo);
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 h-[520px] flex flex-col transition-all">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-slate-800 text-lg">
              Flujo de Ingresos
            </h3>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full h-9 w-9 -mt-1"
          >
            <i className="bi bi-three-dots-vertical text-lg"></i>
          </button>
        </div>

        <div className="relative h-60 w-60 mx-auto flex items-center justify-center">
          <Doughnut data={data} options={options} />
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-3xl font-black leading-none text-slate-900">
              {formattedTotal}
            </p>
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">
              {centerLabelText[activeTimeFilter]}
            </p>
          </div>
        </div>

        {/* 3. Leyenda Dinámica (Solo mostrará los métodos que realmente llegaron) */}
        <div className="pt-6 border-t border-slate-100 mt-auto h-[160px] flex flex-col justify-start gap-4 overflow-y-auto [&::-webkit-scrollbar]:hidden">
          {chartInfo.labels.map((label, index) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm"
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    currentTotal === 0
                      ? "bg-slate-200"
                      : PALETTE_TW[index % PALETTE_TW.length]
                  }`}
                ></span>
                <span className="font-medium text-slate-700 truncate w-32">
                  {label}
                </span>
              </div>
              <span className="font-bold text-slate-900">
                {getPercentage(chartInfo.dataCounts[index])}%
              </span>
            </div>
          ))}

          {/* Mensaje si no hay registros */}
          {currentTotal === 0 && (
            <p className="text-sm text-slate-400 text-center font-medium mt-2">
              No hay ventas registradas
            </p>
          )}
        </div>
      </div>

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
              {["hoy", "semana", "mes"].map((type) => (
                <button
                  key={type}
                  onClick={() => setTempTimeFilter(type as TimeFilterType)}
                  className={`py-2 px-4 rounded-md border font-medium transition-colors capitalize ${
                    tempTimeFilter === type
                      ? "bg-blue-100 border-blue-400 text-blue-700"
                      : "bg-blue-50 border-blue-200 text-blue-600"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}
