import { useState } from "react";

type WashStatus = "EN ESPERA" | "EN PROCESO" | "COMPLETADO";
type VehicleSize = "PEQUEÑO" | "MEDIANO" | "GRANDE";

interface Vehicle {
  name: string;
  size: VehicleSize;
  licensePlate: string;
}

interface SubService {
  name: string;
  isCompleted: boolean;
}

interface WashTicket {
  id: number;
  vehicle: Vehicle;
  mainService: string;
  isCombo: boolean;
  subServices: SubService[];
  employees: string[];
  status: WashStatus;
  entryTime: string;
}

const initialTickets: WashTicket[] = [
  {
    id: 1,
    vehicle: {
      name: "Toyota Corolla",
      size: "MEDIANO",
      licensePlate: "ABC-1234",
    },
    mainService: "Lavado Completo",
    isCombo: true,
    subServices: [
      { name: "Lavado Exterior", isCompleted: false },
      { name: "Lavado Interior", isCompleted: false },
      { name: "Encerado", isCompleted: false },
    ],
    employees: ["Susana", "Jose"],
    status: "EN ESPERA",
    entryTime: "08:30 AM",
  },
  {
    id: 2,
    vehicle: {
      name: "Ford F-150",
      size: "GRANDE",
      licensePlate: "XYZ-7890",
    },
    mainService: "Combo VIP",
    isCombo: true,
    subServices: [
      { name: "Lavado Exterior", isCompleted: true },
      { name: "Aspirado Profundo", isCompleted: false },
      { name: "Encerado", isCompleted: false },
    ],
    employees: ["Luis P.", "Ana G."],
    status: "EN ESPERA",
    entryTime: "08:15 AM",
  },
  {
    id: 3,
    vehicle: {
      name: "Honda CR-V",
      size: "MEDIANO",
      licensePlate: "LMN-456",
    },
    mainService: "Limpieza Interior",
    isCombo: false,
    subServices: [],
    employees: ["Pedro R."],
    status: "COMPLETADO",
    entryTime: "07:45 AM",
  },
  {
    id: 4,
    vehicle: {
      name: "Chevrolet Spark",
      size: "PEQUEÑO",
      licensePlate: "QQQ-111",
    },
    mainService: "Combo Express",
    isCombo: true,
    subServices: [
      { name: "Lavado", isCompleted: false },
      { name: "Aspirado", isCompleted: false },
    ],
    employees: ["Carlos M."],
    status: "EN PROCESO",
    entryTime: "09:00 AM",
  },
];

export default function KanbanBoard() {
    const [tickets, setTickets] = useState<WashTicket[]>(initialTickets);

    const moveTicket = (id: number, newStatus: WashStatus) => {
        setTickets(tickets.map(ticket =>
            ticket.id === id ? { ...ticket, status: newStatus} : ticket
        ));
    };

    const cancelTicket = (id:number) => {
        setTickets(tickets.filter(ticket => ticket.id !== id));
    };

    const toggleSubService = (ticketId: number, subServiceIndex: number) => {
    setTickets(tickets.map(ticket => {
      if (ticket.id === ticketId) {
        const newSubServices = [...ticket.subServices];
        newSubServices[subServiceIndex] = {
          ...newSubServices[subServiceIndex],
          isCompleted: !newSubServices[subServiceIndex].isCompleted
        };
        
        const newStatus = ticket.status === "EN ESPERA" ? "EN PROCESO" : ticket.status;
        
        return { ...ticket, subServices: newSubServices, status: newStatus };
      }
      return ticket;
    }));
  };

  const getVehicleIcon = (size: VehicleSize) => {
    switch (size) {
      case "PEQUEÑO": return "bi-car-front";
      case "MEDIANO": return "bi-car-front-fill";
      case "GRANDE": return "bi-truck-front";
      default: return "bi-car-front";
    }
        };

    const waitingTickets = tickets.filter(t => t.status === "EN ESPERA");
    const inProgressTickets = tickets.filter(t => t.status === "EN PROCESO");
    const completedTickets = tickets.filter(t => t.status === "COMPLETADO"); 
    
    const TicketCard = ({ticket}: {ticket: WashTicket}) => (
        <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-shadow flex flex-col ${
            ticket.status === "EN ESPERA" ? 'border-l-orange-500' :
            ticket.status === "EN PROCESO" ? 'border-l-blue-500' :
            'border-l-green-500 opacity-75'
        }`}>

             <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                    <i className={`bi ${getVehicleIcon(ticket.vehicle.size)} text-gray-500 text-lg`}></i>
                    <span className={`font-black text-lg text-gray-800 ${ticket.status === "COMPLETADO" ? 'line-through decoration-gray-300' : ''}`}>{ticket.vehicle.licensePlate}</span>
                </div>
                <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded">
                    {ticket.entryTime}
                </span>
             </div>

             <p className="text-sm text-gray-600 mb-1">{ticket.vehicle.name}</p>
             <p className="text-sm font-bold text-blue-600 mb-3">{ticket.mainService}</p>

             {ticket.isCombo && ticket.subServices.length > 0 && (
                <div className="mb-4 bg-slate-50 p-3 rounded-md border border-slate-100">
                    <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">Progreso del Combo</p>
                    <div className="space-y-2">
                        {ticket.subServices.map((sub,index) => (
                            <label key={index} className="flex items-center gap-2 text-sm cursor-pointer group">
                              <input type="checkbox" checked={sub.isCompleted} onChange={() => toggleSubService(ticket.id, index)} disabled={ticket.status === 'COMPLETADO'} className="rounded border-gray-300 text-blue-600 w-4 h-4 cursor-pointer disabled:opacity-50"/>
                              <span className={`transition-all ${sub.isCompleted ? "text-gray-400 line-through" : "text-gray-700 group-hover:text-black"}`}>
                                {sub.name}
                              </span>
                            </label>
                        ))}
                    </div>
                </div>
             )}
             
             <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center">
                <div className="flex flex-wrap gap-1">
                    {ticket.employees.map((emp, index) => (
                     <span key={index} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full border border-blue-100">
                        <i className="bi-person-fill  mr-1"></i> {emp}
                     </span>  
                    ))}
                </div>

                <div className="flex gap-2 shrink-0 ml-2 items-center">
                    {ticket.status === "EN PROCESO" && (
                        <button onClick={() => moveTicket(ticket.id, "EN ESPERA")} className="text-gray-400 hover:text-gray-600 px-2">
                            <i className="bi-arrow-left-short text-xl"></i>
                        </button>
                    )}

            {ticket.status === "EN ESPERA" && (
            <button onClick={() => cancelTicket(ticket.id)} className="text-xs text-red-500 hover:text-red-700 px-2 py-1.5 font-bold transition-colors">
              Cancelar
            </button>
          )}

          {ticket.status === "EN ESPERA" && (
            <button onClick={() => moveTicket(ticket.id, "EN PROCESO")} className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded font-bold hover:bg-orange-200">
              Iniciar <i className="bi bi-play-fill"></i>
            </button>
          )}

          {ticket.status === "EN PROCESO" && (
            <button onClick={() => moveTicket(ticket.id, "COMPLETADO")} className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded font-bold hover:bg-green-200">
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
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{waitingTickets.length}</span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-4">
            {waitingTickets.map(t => <TicketCard key={t.id} ticket={t} />)}
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 flex flex-col h-[calc(100vh-16rem)]">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 shrink-0">
            <h3 className="font-bold text-gray-700"><i className="bi bi-droplet-fill text-blue-500 mr-2"></i>En Proceso</h3>
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{inProgressTickets.length}</span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-4">
            {inProgressTickets.map(t => <TicketCard key={t.id} ticket={t} />)}
          </div>
        </div>

        <div className="bg-gray-100 rounded-xl p-4 flex flex-col h-[calc(100vh-16rem)]">
          <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 shrink-0">
            <h3 className="font-bold text-gray-700"><i className="bi bi-check-circle-fill text-green-500 mr-2"></i>Completados</h3>
            <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{completedTickets.length}</span>
          </div>
          <div className="flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-4">
            {completedTickets.map(t => <TicketCard key={t.id} ticket={t} />)}
          </div>
        </div>

      </div>
    </div>
    );

}