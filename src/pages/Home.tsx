
interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  trend?: string; //opcional para mostrar tendencia (ej. "+5%")
}

interface VehicleService {
  id: number;
  plate: string;
  model: string;
  serviceType: string;
  status: "En proceso" | "Completado" | "Pendiente";
  time: string;
}

const statsData: StatCardProps[] = [
  {
    title: "Ventas de Hoy",
    value: "$450.00",
    icon: "bi bi-currency-dollar",
    color: "bg-green-100 text-green-600",
    trend: "12% vs ayer"
  },
  { 
    title: "Lavados Listos", 
    value: "24", 
    icon: "bi bi-check-circle-fill", 
    color: "bg-blue-100 text-blue-600" 
  },
  { 
    title: "En Cola", 
    value: "5", 
    icon: "bi bi-hourglass-split", 
    color: "bg-orange-100 text-orange-600" 
  },
  { 
    title: "Ingreso Mensual", 
    value: "$3,250.00", 
    icon: "bi bi-graph-up-arrow", 
    color: "bg-purple-100 text-purple-600" 
  },
];

const recentServices: VehicleService[] = [
  { id: 1, plate: "AB-123-CD", model: "Toyota Corolla", serviceType: "Lavado Completo", status: "Completado", time: "10:30 AM" },
  { id: 2, plate: "XY-999-ZZ", model: "Ford Fiesta", serviceType: "Aspirado", status: "En proceso", time: "11:15 AM" },
  { id: 3, plate: "VE-555-LA", model: "Jeep Cherokee", serviceType: "Lavado Motor", status: "En proceso", time: "11:45 AM" },
  { id: 4, plate: "LA-101-BB", model: "Chevrolet Aveo", serviceType: "Lavado Simple", status: "Completado", time: "09:00 AM" },
  { id: 5, plate: "ZZ-000-XX", model: "Honda Civic", serviceType: "Pulido", status: "En proceso", time: "12:00 PM" },
]


export default function Home() {
  return (
    <div className="space-y-8 animate-fade-in">
              {/*HEADER DE LA SECCION */}
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Panel de control</h1>
                <p className="text-slate-500 mt-2">Resumen del dia</p>
              </div>

              {/* 3. GRID DE TARJETAS */}
              <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statsData.map((stat,index) => (
                  <div 
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow "
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                        <h3 className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</h3>
                        {stat.trend && (
                          <p className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                            <i className="bi bi-arrow-up-right">{stat.trend}</i>
                          </p>
                        )}
                        </div>
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                          <i className={`${stat.icon} text-2xl`}></i>
                        </div>
                    </div>
                  </div>
                ))}
              </section>

              {/* 4. TABLA DE SERVICIOS RECIENTES */}
              <section className="bg-white rounded-xl shadow-sm border border-slate-800 overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                   <h2 className="text-lg font-bold text-slate-800">Ultimos Vehiculos</h2>
                   <button className="text-sm text-blue-600 font-medium hover:underline">Ver todos</button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-slate-50">
                      <tr>
                       <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Placa / Modelo</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Servicio</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Hora</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentServices.map((car) => (
                        <tr key={car.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-slate-800">{car.plate}</div>
                            <div className="text-sm text-slate-500">{car.model}</div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">{car.serviceType}</td>
                          <td className="px-6 py-4">
                              <StatusBadge status={car.status} />
                          </td>
                          <td className="px-6 py-4 text-slate-500 font-mono text-sm">{car.time}</td>
                        </tr>
                      ))}
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
  };

  const defaultStyle = "bg-gray-100 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${styles[status] || defaultStyle}`}>
      {status}
    </span>
  );
}