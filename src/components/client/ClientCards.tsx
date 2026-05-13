type ClientCardsProps = {
   stats: {
    totalClients: number;
    totalVehicles: number;
    avgVehicles: string | number;
    fleets: number;
   };
   isActiveView: boolean; 
}

export default function ClientCards({stats, isActiveView}: ClientCardsProps) {
    return (
       
        <section className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className={`bg-white p-4 rounded-xl shadow-sm border hover:shadow-md transition-shadow flex items-center gap-4 ${isActiveView ? 'border-blue-200' : 'border-slate-300'}`}>
          <div className={`p-3 rounded-full flex items-center justify-center text-xl ${isActiveView ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-600'}`}>
            <i className={`bi ${isActiveView ? 'bi-people-fill' : 'bi-person-x-fill'}`}></i>
          </div>
          <div className="min-w-0">
            <p className={`font-medium text-sm truncate ${isActiveView ? 'text-blue-700' : 'text-slate-600'}`}>
                {isActiveView ? 'Total Clientes' : 'Total Inactivos'}
            </p>
            <p className={`text-2xl font-bold truncate ${isActiveView ? 'text-blue-900' : 'text-slate-800'}`}>
              {stats.totalClients}
            </p>
          </div>
        </div>

        {isActiveView && (
            <>
                <div className="bg-white p-4 rounded-xl shadow-sm border border-red-200 hover:shadow-md transition-shadow flex items-center gap-4">
                  <div className="p-3 rounded-full bg-red-100 text-red-600 flex items-center justify-center text-xl">
                    <i className="bi bi-car-front-fill"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-red-700 truncate">Vehículos</p>
                    <p className="text-2xl font-bold text-red-900 truncate">
                      {stats.totalVehicles}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-yellow-200 hover:shadow-md transition-shadow flex items-center gap-4">
                  <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 flex items-center justify-center text-xl">
                    <i className="bi bi-bar-chart-fill"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-yellow-700 truncate">Promedio</p>
                    <p className="text-2xl font-bold text-yellow-900 truncate">
                      {stats.avgVehicles}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-indigo-200 hover:shadow-md transition-shadow flex items-center gap-4">
                  <div className="p-3 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xl">
                    <i className="bi bi-building"></i>
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm text-indigo-700 truncate">Flotas (3+)</p>
                    <p className="text-2xl font-bold text-indigo-900 truncate">
                      {stats.fleets}
                    </p>
                  </div>
                </div>
            </>
        )}
      </section>
    )
}