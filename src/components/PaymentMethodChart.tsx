import { useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import Modal from "./Modal/Modal"; // Asegúrate de que la ruta sea la correcta

ChartJS.register(ArcElement, Tooltip, Legend);

type TimeFilterType = "hoy" | "semana" | "mes" | "custom";

interface PaymentMethodChartProps {
  efectivoAmount: number;
  pagoMovilAmount: number;
  divisaAmount: number;
  puntoAmount: number;
}

export default function PaymentMethodChart({
  efectivoAmount,
  pagoMovilAmount,
  divisaAmount,
  puntoAmount,
}: PaymentMethodChartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilterType>("hoy");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const total = efectivoAmount + pagoMovilAmount + divisaAmount + puntoAmount;

  const getPercentage = (amount: number) => {
    if (total === 0) return 0;
    return Math.round((amount / total) * 100);
  };

  const percentEfectivo = getPercentage(efectivoAmount);
  const percentPagoMovil = getPercentage(pagoMovilAmount);
  const percentDivisa = getPercentage(divisaAmount);
  const percentPunto = getPercentage(puntoAmount);

  const formattedTotal =
    total >= 1000 ? `${(total / 1000).toFixed(1)}k` : `$${total}`;

  const data = {
    labels: ["Efectivo", "Pago Móvil", "Divisa", "Punto"],
    datasets: [
      {
        data: [efectivoAmount, pagoMovilAmount, divisaAmount, puntoAmount],
        backgroundColor: ["#3b82f6", "#8b5cf6", "#a16207", "#06b6d4"],
        borderWidth: 0,
        cutout: "80%",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (context: any) => {
            const label = context.label || "";
            const value = context.parsed || 0;
            return `${label}: $${value} (${getPercentage(value)}%)`;
          },
        },
      },
    },
  };

  return (
    <>
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-50 h-full">
        {/* Cabecera de la carta */}
        <div className="flex justify-between items-start mb-6">
          <h3 className="font-bold text-slate-800 text-lg">
            Ventas por Método de Pago
          </h3>

          {/* BOTÓN DE 3 PUNTOS - Abre el Modal */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-2 rounded-full transition-colors flex items-center justify-center h-9 w-9 -mt-1 -mr-2"
          >
            <i className="bi bi-three-dots-vertical text-lg"></i>
          </button>
        </div>

        {/* Contenedor del Gráfico y Texto Central */}
        <div className="relative h-60 w-60 mx-auto mb-8">
          <Doughnut data={data} options={options} />

          {/* Texto en el centro absoluto del doughnut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-3xl font-black text-slate-900 leading-none">
              {formattedTotal}
            </p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
              Total Hoy
            </p>
          </div>
        </div>

        {/* Leyenda Personalizada */}
        <div className="space-y-3 pt-4 border-t border-slate-100">
          {/* Item: Efectivo */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="font-medium text-slate-700">Efectivo</span>
            </div>
            <span className="font-bold text-slate-900">{percentEfectivo}%</span>
          </div>

          {/* Item: Pago Móvil */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-violet-500"></span>
              <span className="font-medium text-slate-700">Pago Móvil</span>
            </div>
            <span className="font-bold text-slate-900">
              {percentPagoMovil}%
            </span>
          </div>

          {/* Item: Divisa */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-yellow-700"></span>
              <span className="font-medium text-slate-700">Divisa</span>
            </div>
            <span className="font-bold text-slate-900">{percentDivisa}%</span>
          </div>

          {/* NUEVO Item: Punto */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-cyan-500"></span>
              <span className="font-medium text-slate-700">Punto</span>
            </div>
            <span className="font-bold text-slate-900">{percentPunto}%</span>
          </div>
        </div>
      </div>

      {/* MODAL DE FILTROS - IDÉNTICO AL ANTERIOR */}
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
