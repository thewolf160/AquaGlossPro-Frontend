
type ClientCardsProps = {
   stats: {
    totalClients: number;
    totalVehicles: number;
    avgVehicles: string;
    fleets: number;
   }
}


export default function ClientCards({stats}: ClientCardsProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl shadow-sm border border-blue-200 flex items-center  gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xl">
            <i className="bi bi-people-fill"></i>
          </div>
          <div>
            <p className="text-sm text-blue-700 font-medium">Total Clientes</p>
            <p className="text-2xl font-black text-blue-800">
              {stats.totalClients}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl">
            <i className="bi bi-car-front-fill"></i>
          </div>
          <div>
            <p className="text-sm text-red-700 font-medium">
              Vehículos Registrados
            </p>
            <p className="text-2xl font-black text-red-700">
              {stats.totalVehicles}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl">
            <i className="bi bi-bar-chart-fill"></i>
          </div>
          <div>
            <p className="text-sm text-yellow-700 font-medium">Promedio por cliente</p>
            <p className="text-2xl font-black text-yellow-700">
              {stats.avgVehicles}
            </p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
            <i className="bi bi-building"></i>
          </div>
          <div>
            <p className="text-sm text-indigo-700 font-medium">Flotas (3+ Autos)</p>
            <p className="text-2xl font-black text-indigo-700">
              {stats.fleets}
            </p>
          </div>
        </div>
      </div>
    )
} 