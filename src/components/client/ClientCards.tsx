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
        <div className={`grid grid-cols-1 ${isActiveView ? 'md:grid-cols-4' : ''} gap-4`}>
        
        <div className={`bg-white p-4 rounded-xl shadow-sm border flex items-center gap-4 ${isActiveView ? 'border-blue-200' : 'border-slate-300'}`}>
          <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${isActiveView ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-600'}`}>
            <i className={`bi ${isActiveView ? 'bi-people-fill' : 'bi-person-x-fill'}`}></i>
          </div>
          <div>
            <p className={`text-sm font-medium ${isActiveView ? 'text-blue-700' : 'text-slate-600'}`}>
                {isActiveView ? 'Total Clientes' : 'Total Inactivos'}
            </p>
            <p className={`text-2xl font-black ${isActiveView ? 'text-blue-800' : 'text-slate-800'}`}>
              {stats.totalClients}
            </p>
          </div>
        </div>

        {isActiveView && (
            <>
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
            </>
        )}
      </div>
    )
}