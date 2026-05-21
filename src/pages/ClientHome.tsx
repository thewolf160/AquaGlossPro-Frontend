import Table from "../components/Table/Table";
import type { Item } from "../types/models";
import { useClientDashboard } from "../hooks/useClientDashboard";
import type { WashHistory } from "../hooks/useClientDashboard";
import ClientHeader from "../components/ClientHeader"; 
import { NotificationListener } from "../components/NotificationListener";

export default function ClientDashboard() {
  const {
    userName,
    vehiclesCount,
    vehicles, 
    totalWashes,
    history,
    activeWashes, 
    isLoading
  } = useClientDashboard();

  const historyColumns = [
    { header: "FECHA", key: "date", render: (item: Item) => <span className="text-gray-600 font-medium">{(item as unknown as WashHistory).date}</span> },
    { header: "VEHÍCULO", key: "vehicle", render: (item: Item) => <span className="text-gray-800">{(item as unknown as WashHistory).vehicle}</span> },
    { 
      header: "PAQUETE DE SERVICIO", 
      key: "package", 
      render: (item: Item) => (
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="font-medium text-gray-800">{(item as unknown as WashHistory).package}</span>
        </div>
      ) 
    },
    { 
      header: "ESTADO", 
      key: "status", 
      render: (item: Item) => {
        const status = (item as unknown as WashHistory).status;
        let colorClass = "bg-gray-100 text-gray-700";
        if (status === "Completado") colorClass = "bg-green-100 text-green-700";
        else if (status === "En Progreso" || status === "En Espera") colorClass = "bg-blue-100 text-blue-700";
        else if (status === "Cancelado") colorClass = "bg-red-100 text-red-700";
        
        return (
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorClass}`}>
            {status}
          </span>
        )
      }
    },
    { header: "PRECIO", key: "price", render: (item: Item) => <span className="font-bold text-gray-900">${(item as unknown as WashHistory).price.toFixed(2)}</span> }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg text-blue-600"></span>
      </div>
    );
  }

  let loyaltyLevel = "Cliente Nuevo";
  let loyaltyColor = "from-slate-400 to-slate-500";
  if (totalWashes >= 10) {
    loyaltyLevel = "Cliente Oro";
    loyaltyColor = "from-yellow-500 to-amber-600";
  } else if (totalWashes >= 5) {
    loyaltyLevel = "Cliente Plata";
    loyaltyColor = "from-gray-400 to-slate-500";
  } else if (totalWashes >= 1) {
    loyaltyLevel = "Cliente Bronce";
    loyaltyColor = "from-orange-400 to-amber-700";
  }

  return (
    <>
      <ClientHeader vehicles={vehicles} isLoadingVehicles={isLoading} />
      {/* <NotificationListener /> */}

      <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in font-sans">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Bienvenido de nuevo, {userName.split(" ")[0]}</h1>
            <p className="text-gray-500 mt-1">
              {activeWashes.length > 0 
                ? `Tienes ${activeWashes.length} servicio(s) en curso actualmente.` 
                : "Aquí puedes ver el resumen de tus servicios."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="text-blue-500 mb-4"><i className="bi bi-car-front text-2xl"></i></div>
            <p className="text-sm text-gray-500 font-medium">Vehículos Registrados</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{vehiclesCount}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className="text-blue-500 mb-4"><i className="bi bi-droplet text-2xl"></i></div>
            <p className="text-sm text-gray-500 font-medium">Lavados Completados (Histórico)</p>
            <p className="text-3xl font-black text-gray-900 mt-1">{totalWashes}</p>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
            <div className={`mb-4 bg-clip-text text-transparent bg-linear-to-r ${loyaltyColor}`}>
              <i className="bi bi-star-fill text-2xl drop-shadow-sm"></i>
            </div>
            <p className="text-sm text-gray-500 font-medium">Estado de Fidelidad</p>
            <p className={`text-3xl font-black mt-1 text-transparent bg-clip-text bg-linear-to-r ${loyaltyColor}`}>
              {loyaltyLevel}
            </p>
          </div>
        </div>

        {activeWashes.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 px-1">Estados Actuales de tus Vehículos</h2>
            <div className="grid grid-cols-1 gap-6">
              
              {activeWashes.map((activeWash) => (
                <div key={activeWash.id} className="bg-white rounded-2xl shadow-sm border border-blue-100 p-8 border-l-4 border-l-blue-500 animate-fade-in">
                  <div className="flex justify-between items-center mb-8">
                    <h3 className="text-lg font-bold text-gray-800">Vehículo: <span className="text-blue-600">{activeWash.vehicle}</span></h3>
                    <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> {activeWash.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50 rounded-xl p-6">
                    <div className="rounded-xl bg-slate-800 h-44 lg:h-full min-h-40 relative overflow-hidden flex items-end p-6 shadow-inner">
                      <img src="/login.webp" alt="Vehículo" className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-overlay" />
                      <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10"></div>
                      <div className="relative z-20">
                        <h4 className="text-white font-black text-xl">{activeWash.package}</h4>
                        <p className="text-gray-300 text-sm">Venta: #{activeWash.id}</p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-center space-y-6 py-4 px-2">
                      <div className="flex gap-4 items-start">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activeWash.statusWashing === 'W' ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-50' : 'bg-green-100 text-green-600'}`}>
                          <i className={activeWash.statusWashing === 'W' ? 'bi bi-hourglass-split text-xl' : 'bi bi-check-lg text-xl'}></i>
                        </div>
                        <div className="text-left">
                          <p className={`font-bold text-lg ${activeWash.statusWashing === 'W' ? 'text-blue-700' : 'text-gray-900'}`}>En Fila / Espera</p>
                          <p className="text-sm text-gray-500">{activeWash.statusWashing === 'W' ? 'Tu vehículo está esperando su turno' : 'Turno completado'}</p>
                        </div>
                      </div>

                      {/* Estado 2: Proceso de Lavado */}
                      <div className={`flex gap-4 items-start ${activeWash.statusWashing === 'W' ? 'opacity-50' : ''}`}>
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${activeWash.statusWashing === 'I' ? 'bg-blue-100 text-blue-600 ring-4 ring-blue-50' : activeWash.statusWashing === 'D' ? 'bg-green-100 text-green-600' : 'bg-gray-200 text-gray-500'}`}>
                          <i className={activeWash.statusWashing === 'D' ? 'bi bi-check-lg text-xl' : 'bi bi-droplet-half text-xl'}></i>
                        </div>
                        <div className="text-left">
                          <p className={`font-bold text-lg ${activeWash.statusWashing === 'I' ? 'text-blue-700' : 'text-gray-500'}`}>En Proceso de Lavado</p>
                          <p className="text-sm text-gray-400">{activeWash.statusWashing === 'I' ? 'Los operarios están trabajando en tu vehículo' : activeWash.statusWashing === 'D' ? 'Lavado completado' : 'Pendiente'}</p>
                        </div>
                      </div>
                      
                      {/* Estado 3: Entrega */}
                      <div className="flex gap-4 items-start opacity-50">
                        <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0">
                          <i className="bi bi-stars text-xl"></i>
                        </div>
                        <div className="text-left">
                          <p className="font-bold text-lg text-gray-500">Listo para Entrega</p>
                          <p className="text-sm text-gray-400">Te avisaremos cuando termine</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-4">
              <i className="bi bi-emoji-smile text-3xl"></i>
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">No tienes servicios activos en este momento</h2>
            <p className="text-gray-500 max-w-md">Cuando traigas un vehículo a lavar, podrás ver su estado en tiempo real en esta sección.</p>
          </div>
        )}

        {/* 4. HISTORIAL DE LAVADOS */}
        <div className="pt-4">
          <div className="flex justify-between items-end mb-4 px-1">
            <h2 className="text-xl font-bold text-gray-900">Mi Historial de Lavados</h2>

          </div>
          
          <Table 
            columns={historyColumns as any} 
            data={history as unknown as Item[]} 
            emptyMessage="Aún no tienes lavados registrados. ¡Anímate a agendar uno!"
          />
        </div>

      </div>
    </>
  );
}