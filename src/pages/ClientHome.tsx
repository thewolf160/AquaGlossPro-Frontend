import Table from "../components/Table/Table";
import type { Item } from "../types/models";

interface WashHistory {
  id: number;
  date: string;
  vehicle: string;
  package: string;
  status: string;
  price: number;
}

const mockHistory: WashHistory[] = [
  { id: 1, date: "Oct 24, 2025", vehicle: "Toyota Corolla", package: "Combo VIP Brillante", status: "Completado", price: 18.00 },
  { id: 2, date: "Oct 10, 2025", vehicle: "Toyota Corolla", package: "Lavado Sencillo", status: "Completado", price: 5.00 },
  { id: 3, date: "Sep 28, 2025", vehicle: "Ford Fiesta", package: "Lavado + Aspirado", status: "Completado", price: 12.00 },
];

export default function ClientDashboard() {
  const historyColumns = [
    { header: "FECHA", key: "date", render: (item: Item) => <span className="text-gray-600 font-medium">{(item as unknown as WashHistory).date}</span> },
    { header: "VEHÍCULO", key: "vehicle", render: (item: Item) => <span className="text-gray-800">{(item as unknown as WashHistory).vehicle}</span> },
    { 
      header: "PAQUETE DE SERVICIO", 
      key: "package", 
      render: (item: Item) => (
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div>
          <span className="font-medium text-gray-800">{(item as unknown as WashHistory).package}</span>
        </div>
      ) 
    },
    { 
      header: "ESTADO", 
      key: "status", 
      render: (item: Item) => (
        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
          {(item as unknown as WashHistory).status}
        </span>
      ) 
    },
    { header: "PRECIO", key: "price", render: (item: Item) => <span className="font-bold text-gray-900">${(item as unknown as WashHistory).price.toFixed(2)}</span> },
    { 
      header: "", 
      key: "download", 
      render: () => (
        <button className="text-gray-400 hover:text-blue-600 transition-colors">
          <i className="bi bi-download text-lg"></i>
        </button>
      ) 
    }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 animate-fade-in font-sans">
      
      {/* 1. SECCIÓN DE BIENVENIDA */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Bienvenido de nuevo, Fabián</h1>
          <p className="text-gray-500 mt-1">Este es el estado en vivo de tu Toyota Corolla 2018.</p>
        </div>
        <button className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-sm">
          <i className="bi bi-plus-lg"></i> Agendar Nuevo Lavado
        </button>
      </div>

      {/* 2. TARJETAS DE KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
          <div className="text-blue-500 mb-4"><i className="bi bi-stopwatch text-2xl"></i></div>
          <p className="text-sm text-gray-500 font-medium">Tiempo de Espera Estimado</p>
          <p className="text-3xl font-black text-gray-900 mt-1">12 mins</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-blue-500 mb-4"><i className="bi bi-list-ol text-2xl"></i></div>
          <p className="text-sm text-gray-500 font-medium">Posición en la Fila</p>
          <p className="text-3xl font-black text-gray-900 mt-1">2do</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="text-blue-500 mb-4"><i className="bi bi-droplet text-2xl"></i></div>
          <p className="text-sm text-gray-500 font-medium">Lavados Completados (Histórico)</p>
          <p className="text-3xl font-black text-gray-900 mt-1">14</p>
        </div>
      </div>

      {/* 3. SECCIÓN DE ESTADO ACTUAL */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-bold text-gray-900">Estado Actual</h2>
          <span className="bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span> Lavado en Progreso
          </span>
        </div>

        {/* Barra de Progreso */}
        <div className="mb-10">
          <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
            <span className="text-blue-600">En Fila</span>
            <span className="text-blue-600">Lavado</span>
            <span>Secado</span>
            <span>Listo</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden flex">
            <div className="h-full bg-blue-600 w-1/2 rounded-full"></div>
          </div>
          <div className="flex justify-between text-sm text-gray-500 mt-3 font-medium">
            <span>Inicio: 10:45 AM</span>
            <span className="text-gray-900 font-bold">Paso 2 de 4: Aplicación de Espuma</span>
            <span>Est. Fin: 11:05 AM</span>
          </div>
        </div>

        {/* Detalles del Progreso (Imagen + Pasos) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 bg-gray-50 rounded-xl p-6">
          
          <div className="rounded-xl bg-slate-800 h-48 md:h-full min-h-50 relative overflow-hidden flex items-end p-6 shadow-inner">
            <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent z-10"></div>
            <div className="relative z-20">
              <h3 className="text-white font-black text-xl">Combo VIP Brillante</h3>
              <p className="text-gray-300 text-sm">Paquete Actual</p>
            </div>
          </div>

          {/* Lista Vertical de Pasos */}
          <div className="space-y-6 py-2 pr-2 max-h-75 overflow-y-auto custom-scrollbar">
            
            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <i className="bi bi-check-lg"></i>
              </div>
              <div>
                <p className="font-bold text-gray-900">Enjuague Pre-Lavado</p>
                <p className="text-xs text-gray-500">Completado a las 10:48 AM</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                <i className="bi bi-check-lg"></i>
              </div>
              <div>
                <p className="font-bold text-gray-900">Espuma y Fregado</p>
                <p className="text-xs text-gray-500">Completado a las 11:02 AM</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0 border-2 border-white shadow-sm ring-2 ring-blue-100">
                <i className="bi bi-droplet-half"></i>
              </div>
              <div>
                <p className="font-bold text-blue-700">Enjuague de Alta Presión</p>
                <p className="text-xs text-blue-500 font-medium">En Progreso...</p>
              </div>
            </div>

            <div className="flex gap-4 items-start opacity-50">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0">
                <i className="bi bi-stars"></i>
              </div>
              <div>
                <p className="font-bold text-gray-500">Aplicación de Cera</p>
                <p className="text-xs text-gray-400">Pendiente</p>
              </div>
            </div>

            <div className="flex gap-4 items-start opacity-50">
              <div className="w-8 h-8 rounded-full bg-gray-200 text-gray-500 flex items-center justify-center shrink-0">
                <i className="bi bi-wind"></i>
              </div>
              <div>
                <p className="font-bold text-gray-500">Secado de Turbina</p>
                <p className="text-xs text-gray-400">Pendiente</p>
              </div>
            </div>

          </div>
          
      </div>
      </div>
      {/* 4. HISTORIAL DE LAVADOS */}
      <div className="pt-4">
        <div className="flex justify-between items-end mb-4 px-1">
          <h2 className="text-xl font-bold text-gray-900">Mi Historial de Lavados</h2>
          <button className="text-blue-600 font-medium text-sm hover:underline flex items-center gap-1">
            Ver Historial Completo <i className="bi bi-arrow-right"></i>
          </button>
        </div>
        
        <Table 
          columns={historyColumns as any} 
          data={mockHistory as unknown as Item[]} 
          emptyMessage="Aún no tienes lavados registrados."
        />
      </div>

    </div>
  );
}