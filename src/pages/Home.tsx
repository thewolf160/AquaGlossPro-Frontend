import { useNavigate } from "react-router-dom";
import { useHomeDashboard } from "../hooks/useHomeDashboard";

export default function Home() {
  const navigate = useNavigate();
  const { stats, recentSales, isLoading } = useHomeDashboard();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  const statsData = [
    { 
      title: "Vehículos en espera", 
      value: stats.waiting, 
      icon: "bi bi-hourglass-split", 
      color: "bg-orange-100 text-orange-600" 
    },
    { 
      title: "Vehículos en proceso", 
      value: stats.inProgress, 
      icon: "bi bi-gear-wide-connected", 
      color: "bg-blue-100 text-blue-600" 
    },
    { 
      title: "Vehículos listos", 
      value: stats.done, 
      icon: "bi bi-check-circle-fill", 
      color: "bg-green-100 text-green-600" 
    }
  ];

  const getPackageName = (details: any) => {
    if (details?.comboServices && details.comboServices.length > 0) {
      return details.comboServices[0].comboName;
    } else if (details?.independentServices && details.independentServices.length > 0) {
      return details.independentServices[0].serviceName + (details.independentServices.length > 1 ? " y más" : "");
    }
    return "Servicios Individuales";
  };

  const getReadableStatus = (status: string) => {
    if (status === 'C') return "Cancelado";
    if (status === 'D') return "Completado";
    if (status === 'I') return "En proceso";
    if (status === 'W') return "Pendiente";
    return status;
  };

  const formatTime = (dateString: string) => {
    // String typically "DD-MM-YYYY HH:mm"
    const parts = dateString.split(' ');
    return parts[1] ? parts[1] : "00:00";
  };

  return (
    <div className="space-y-8 animate-fade-in w-full">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800">Panel de control</h1>
        <p className="text-sm md:text-base text-slate-500 mt-2">Resumen del día</p>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {statsData.map((stat, index) => (
          <div 
            key={index}
            className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-xs md:text-sm font-medium text-slate-500 truncate">{stat.title}</p>
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mt-1 md:mt-2 truncate">{stat.value}</h3>
              </div>
              <div className={`p-2 md:p-3 rounded-lg shrink-0 ${stat.color}`}>
                <i className={`${stat.icon} text-xl md:text-2xl`}></i>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="bg-white rounded-xl shadow-sm border border-slate-300 overflow-hidden w-full">
        <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center">
           <h2 className="text-base md:text-lg font-bold text-slate-800">Últimos Vehículos</h2>
           <button 
             onClick={() => navigate('/washes')}
             className="text-sm text-blue-600 font-medium hover:underline cursor-pointer"
           >
             Ver todos
           </button>
        </div>

        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Placa / Modelo</th>
                <th className="hidden md:table-cell px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Servicio</th>
                <th className="px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                <th className="hidden sm:table-cell px-4 md:px-6 py-3 md:py-4 text-[10px] md:text-xs font-semibold text-slate-500 uppercase tracking-wider">Hora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentSales.map((car) => (
                <tr key={car.sale.saleId} className="hover:bg-slate-50 transition-colors">
                  <td className="px-4 md:px-6 py-3 md:py-4">
                    <div className="font-medium text-slate-800 text-xs md:text-sm">{car.vehicle.plate}</div>
                    <div className="text-[10px] md:text-xs text-slate-500 truncate max-w-[100px] md:max-w-none">{car.vehicle.typeVehicle}</div>
                  </td>
                  <td className="hidden md:table-cell px-4 md:px-6 py-3 md:py-4 text-slate-600 text-xs md:text-sm">
                    {getPackageName(car.details)}
                  </td>
                  <td className="px-4 md:px-6 py-3 md:py-4">
                      <StatusBadge status={getReadableStatus(car.sale.statusWashing)} />
                  </td>
                  <td className="hidden sm:table-cell px-4 md:px-6 py-3 md:py-4 text-slate-500 font-mono text-xs md:text-sm">
                    {formatTime(car.sale.saleDate)}
                  </td>
                </tr>
              ))}
              {recentSales.length === 0 && (
                <tr>
                  <td colSpan={4} className="text-center py-6 text-slate-500">No hay vehículos registrados hoy.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    "Completado": "bg-green-100 text-green-700 border-green-200",
    "En proceso": "bg-blue-100 text-blue-700 border-blue-200",
    "Pendiente": "bg-orange-100 text-orange-700 border-orange-200",
    "Cancelado": "bg-red-100 text-red-700 border-red-200",
  };

  const defaultStyle = "bg-gray-100 text-gray-700";

  return (
    <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-medium border ${styles[status] || defaultStyle}`}>
      {status}
    </span>
  );
}