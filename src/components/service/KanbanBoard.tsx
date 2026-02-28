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

const initialTickets: WashTickets[] = [
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
}
