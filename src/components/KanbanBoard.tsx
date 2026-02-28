import { useState } from "react";

type EstadoLavado = "EN_ESPERA" | "EN_PROCESO" | "COMPLETADO";
type TamanoVehiculo = "Pequeño" | "Mediano" | "Grande";

interface SubServicio {
  nombre: string;
  completado: boolean;
}

interface TicketLavado {
  id: string;
  placa: string;
  vehiculo: string;
  tamano: TamanoVehiculo;
  servicioPrincipal: string;
  esCombo: boolean;
  subServicios: SubServicio[];
  empleados: string[];
  estado: EstadoLavado;
  horaIngreso: string;
}

const initialTickets: TicketLavado[] = [
  { 
    id: "t1", 
    placa: "AB-123-CD", 
    vehiculo: "Toyota Yaris", 
    tamano: "Pequeño",
    servicioPrincipal: "Lavado Sencillo", 
    esCombo: false,
    subServicios: [],
    empleados: ["Carlos M."],
    estado: "EN_ESPERA", 
    horaIngreso: "08:30 AM" 
  },
  { 
    id: "t2", 
    placa: "XYZ-987", 
    vehiculo: "Ford Explorer", 
    tamano: "Grande",
    servicioPrincipal: "Combo VIP", 
    esCombo: true,
    subServicios: [
      { nombre: "Lavado Exterior", completado: true },
      { nombre: "Aspirado Profundo", completado: false },
      { nombre: "Encerado", completado: false }
    ],
    empleados: ["Luis P.", "Ana G."],
    estado: "EN_PROCESO", 
    horaIngreso: "08:15 AM" 
  },
  { 
    id: "t3", 
    placa: "LMN-456", 
    vehiculo: "Honda CR-V", 
    tamano: "Mediano",
    servicioPrincipal: "Limpieza Interior", 
    esCombo: false,
    subServicios: [],
    empleados: ["Pedro R."],
    estado: "COMPLETADO", 
    horaIngreso: "07:45 AM" 
  },
  { 
    id: "t4", 
    placa: "QQQ-111", 
    vehiculo: "Chevrolet Spark", 
    tamano: "Pequeño",
    servicioPrincipal: "Combo Express", 
    esCombo: true,
    subServicios: [
      { nombre: "Lavado", completado: false },
      { nombre: "Aspirado", completado: false }
    ],
    empleados: ["Carlos M."],
    estado: "EN_ESPERA", 
    horaIngreso: "09:00 AM" 
  },
];

export default function KanbanBoard() {
  const [tickets, setTickets] = useState<TicketLavado[]>(initialTickets);

  const moverTicket = (id: string, nuevoEstado: EstadoLavado) => {
    setTickets(tickets.map(ticket => 
      ticket.id === id ? { ...ticket, estado: nuevoEstado } : ticket
    ));
  };

  const cancelarTicket = (id: string) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
  };

  const toggleSubServicio = (ticketId: string, indexSubServicio: number) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const nuevosSubServicios = [...ticket.subServicios];
        nuevosSubServicios[indexSubServicio] = {
          ...nuevosSubServicios[indexSubServicio],
          completado: !nuevosSubServicios[indexSubServicio].completado
        };
        
        const nuevoEstado = ticket.estado === "EN_ESPERA" ? "EN_PROCESO" : ticket.estado;
        
        return { ...ticket, subServicios: nuevosSubServicios, estado: nuevoEstado };
      }
      return ticket;
    }));
  };

  const getIconoVehiculo = (tamano: TamanoVehiculo) => {
    switch (tamano) {
      case "Pequeño": return "bi-car-front";
      case "Mediano": return "bi-car-front-fill";
      case "Grande": return "bi-truck-front";
      default: return "bi-car-front";
    }
  };

  const enEspera = tickets.filter(t => t.estado === "EN_ESPERA");
  const enProceso = tickets.filter(t => t.estado === "EN_PROCESO");
  const completados = tickets.filter(t => t.estado === "COMPLETADO");

  const RenderTicket = ({ ticket }: { ticket: TicketLavado }) => (
    <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-shadow flex flex-col ${
      ticket.estado === 'EN_ESPERA' ? 'border-l-orange-500' : 
      ticket.estado === 'EN_PROCESO' ? 'border-l-blue-500' : 
      'border-l-green-500 opacity-75'
    }`}>
      
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <i className={`bi ${getIconoVehiculo(ticket.tamano)} text-gray-500 text-lg`}></i>
          <span className={`font-black text-lg text-gray-800 ${ticket.estado === 'COMPLETADO' ? 'line-through decoration-gray-300' : ''}`}>
            {ticket.placa}
          </span>
        </div>
        <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded">
          {ticket.horaIngreso}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-1">{ticket.vehiculo}</p>
      <p className="text-sm font-bold text-blue-600 mb-3">{ticket.servicioPrincipal}</p>

      {ticket.esCombo && ticket.subServicios.length > 0 && (
        <div className="mb-4 bg-slate-50 p-3 rounded-md border border-slate-100">
          <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Progreso del Combo</p>
          <div className="space-y-2">
            {ticket.subServicios.map((sub, index) => (
              <label key={index} className="flex items-center gap-2 text-sm cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={sub.completado} 
                  onChange={() => toggleSubServicio(ticket.id, index)}
                  disabled={ticket.estado === 'COMPLETADO'}
                  className="rounded border-gray-300 text-blue-600 w-4 h-4 cursor-pointer disabled:opacity-50"
                />
                <span className={`transition-all ${sub.completado ? "text-gray-400 line-through" : "text-gray-700 group-hover:text-black"}`}>
                  {sub.nombre}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
        <div className="flex flex-wrap gap-1">
          {ticket.empleados.map((emp, idx) => (
            <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-100">
              <i className="bi bi-person-fill mr-1"></i>{emp}
            </span>
          ))}
        </div>

        <div className="flex gap-2 shrink-0 ml-2 items-center">
          {ticket.estado === "EN_PROCESO" && (
            <button onClick={() => moverTicket(ticket.id, "EN_ESPERA")} className="text-gray-400 hover:text-gray-600 px-2">
              <i className="bi bi-arrow-left-short text-xl"></i>
            </button>
          )}
          
          {ticket.estado === "EN_ESPERA" && (
            <button onClick={() => cancelarTicket(ticket.id)} className="text-xs text-red-500 hover:text-red-700 px-2 py-1.5 font-bold transition-colors">
              Cancelar
            </button>
          )}

          {ticket.estado === "EN_ESPERA" && (
            <button onClick={() => moverTicket(ticket.id, "EN_PROCESO")} className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded font-bold hover:bg-orange-200">
              Iniciar <i className="bi bi-play-fill"></i>
            </button>
          )}

          {ticket.estado === "EN_PROCESO" && (
            <button onClick={() => moverTicket(ticket.id, "COMPLETADO")} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded font-bold hover:bg-green-200">
              Finalizar <i className="bi bi-check2-all"></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="animate-fade-in h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 shrink-0">
        <h2 className="text-xl font-bold text-gray-800">Lavados del Día</h2>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2">
          <i className="bi bi-plus-lg"></i> Nuevo Ingreso
        </button>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
        
        <div className="bg-gray-100 rounded-xl p-4 flex flex-col h-[calc(100vh-16rem)]">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 shrink-0">
            <h3 className="font-bold text-gray-700"><i className="bi bi-clock-history text-orange-500 mr-2"></i>En Espera</h3>
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{enEspera.length}</span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-4">
            {enEspera.map(t => <RenderTicket key={t.id} ticket={t} />)}
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 flex flex-col h-[calc(100vh-16rem)]">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 shrink-0">
            <h3 className="font-bold text-gray-700"><i className="bi bi-droplet-fill text-blue-500 mr-2"></i>En Proceso</h3>
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{enProceso.length}</span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-4">
            {enProceso.map(t => <RenderTicket key={t.id} ticket={t} />)}
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 flex flex-col h-[calc(100vh-16rem)]">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 shrink-0">
            <h3 className="font-bold text-gray-700"><i className="bi bi-check-circle-fill text-green-500 mr-2"></i>Completados</h3>
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{completados.length}</span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-4">
            {completados.map(t => <RenderTicket key={t.id} ticket={t} />)}
          </div>
        </div>

      </div>
    </div>
  );
}