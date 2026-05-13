// src/pages/KanbanBoard.tsx
import { useState } from "react";
import { useKanban } from "../hooks/useKanban";
import { useModals } from "../hooks/useModals";
import Modal from "../components/Modal/Modal";
import Alert from "../components/Alert";
import type { SaleItem } from "../types/sales.types";

export default function KanbanBoard() {
  const { tickets, loading, changeTicketStatus } = useKanban();
  const { modals, toggleModal } = useModals();

  const [ticketToCancel, setTicketToCancel] = useState<number | null>(null);
  const [alertInfo, setAlertInfo] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showAlert = (message: string, type: "success" | "error") => {
    setAlertInfo({ message, type });
    setTimeout(() => setAlertInfo(null), 3000);
  };

  const handleConfirmCancel = async () => {
    if (!ticketToCancel) return;
    
    toggleModal("delete", false);
    
    const result = await changeTicketStatus(ticketToCancel, "C");
    setTicketToCancel(null);

    if (result?.success) {
      showAlert("El lavado fue cancelado.", "success");
    } else {
      showAlert("Ocurrió un error al intentar cancelar el lavado.", "error");
    }
  };

  const formatTime = (dateStr: string) => {
    if (!dateStr) return "--:--";
    const parts = dateStr.split(" ");
    return parts.length === 2 ? parts[1] : dateStr;
  };

  const getVehicleIcon = (typeVehicle?: string) => {
    const type = typeVehicle?.toLowerCase() || "";
    if (type.includes("camioneta") || type.includes("pickup")) return "bi-truck-front";
    if (type.includes("sedán") || type.includes("sedan")) return "bi-car-front-fill";
    return "bi-car-front";
  };

  const waitingTickets = tickets.filter((t) => t.sale.statusWashing === "W"); 
  const inProgressTickets = tickets.filter((t) => t.sale.statusWashing === "I"); 
  const completedTickets = tickets.filter((t) => t.sale.statusWashing === "D"); 

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">
        <div className="animate-pulse">Cargando lavados del día...</div>
      </div>
    );
  }

  const TicketCard = ({ ticket }: { ticket: SaleItem }) => {
    const placa = ticket.vehicle?.plate || "Sin Placa";
    const modelo = ticket.vehicle?.typeVehicle || "Vehículo";
    
    const allServices = [
      ...(ticket.details?.comboServices || []),
      ...(ticket.details?.independentServices || [])
    ];

    const employeeNames = Array.from(
      new Set(allServices.map(s => `${s.employee.names} ${s.employee.lastnames}`))
    );

    return (
      <div className={`bg-white p-4 rounded-lg shadow-sm border-l-4 hover:shadow-md transition-shadow flex flex-col ${ticket.sale.statusWashing === "W" ? "border-l-orange-500" : ticket.sale.statusWashing === "I" ? "border-l-blue-500" : "border-l-green-500 opacity-75"}`}>
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <i className={`bi ${getVehicleIcon(modelo)} text-gray-500 text-lg`}></i>
            <span className={`font-black text-lg text-gray-800 ${ticket.sale.statusWashing === "D" ? "line-through decoration-gray-300" : ""}`}>
              {placa}
            </span>
          </div>
          <span className="text-xs font-medium bg-gray-100 text-gray-500 px-2 py-1 rounded">
            {formatTime(ticket.sale.saleDate)}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-1">{modelo}</p>

        {allServices.length > 0 && (
          <div className="mb-4 bg-slate-50 p-3 rounded-md border border-slate-100 mt-2">
            <div className="space-y-2">
              {allServices.map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                  <i className="bi bi-droplet-half text-blue-400"></i>
                  <span>{item.serviceName}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-auto pt-3 border-t border-gray-100 flex flex-col gap-3">
          {employeeNames.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {employeeNames.map((empName, index) => (
                <span key={index} className="bg-blue-50 text-blue-700 text-[10px] px-2 py-1 rounded-full border border-blue-100 font-medium">
                  <i className="bi-person-fill mr-1"></i> {empName}
                </span>  
              ))}
            </div>
          )}

          <div className="flex gap-2 shrink-0 items-center justify-end">
            {ticket.sale.statusWashing === "I" && (
              <button
                type="button"
                onClick={() => changeTicketStatus(ticket.sale.saleId, "W")}
                className="text-gray-400 hover:text-gray-600 px-2"
                title="Volver a En Espera"
              >
                <i className="bi-arrow-left-short text-xl"></i>
              </button>
            )}

            {(ticket.sale.statusWashing === "W" || ticket.sale.statusWashing === "I") && (
              <button
                type="button"
                onClick={() => {
                  setTicketToCancel(ticket.sale.saleId);
                  toggleModal("delete", true); 
                }}
                className="text-xs text-red-500 hover:text-red-700 px-2 py-1.5 font-bold transition-colors"
              >
                Cancelar
              </button>
            )}

            {ticket.sale.statusWashing === "W" && (
              <button
                type="button"
                onClick={() => changeTicketStatus(ticket.sale.saleId, "I")}
                className="text-xs bg-orange-100 text-orange-700 px-3 py-1.5 rounded font-bold hover:bg-orange-200"
              >
                Iniciar <i className="bi bi-play-fill"></i>
              </button>
            )}

            {ticket.sale.statusWashing === "I" && (
              <button
                type="button"
                onClick={() => changeTicketStatus(ticket.sale.saleId, "D")}
                className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded font-bold hover:bg-green-200"
              >
                Finalizar <i className="bi bi-check2-all"></i>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {alertInfo && <Alert message={alertInfo.message} type={alertInfo.type} />}
      
      <div className="animate-fade-in h-full flex flex-col">
        <div className="flex justify-between items-center mb-6 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">Lavados del Día</h2>
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 min-h-0">
          <div className="bg-gray-100 rounded-xl p-4 flex flex-col h-[calc(100vh-16rem)]">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 shrink-0">
              <h3 className="font-bold text-gray-700">
                <i className="bi bi-clock-history text-orange-500 mr-2"></i>En Espera
              </h3>
              <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{waitingTickets.length}</span>
            </div>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-4">
              {waitingTickets.map((t) => <TicketCard key={t.sale.saleId} ticket={t} />)}
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 flex flex-col h-[calc(100vh-16rem)]">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 shrink-0">
              <h3 className="font-bold text-gray-700">
                <i className="bi bi-droplet-fill text-blue-500 mr-2"></i>En Proceso
              </h3>
              <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{inProgressTickets.length}</span>
            </div>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-4">
              {inProgressTickets.map((t) => <TicketCard key={t.sale.saleId} ticket={t} />)}
            </div>
          </div>

          <div className="bg-gray-100 rounded-xl p-4 flex flex-col h-[calc(100vh-16rem)]">
            <div className="flex items-center justify-between mb-4 border-b border-gray-200 pb-2 shrink-0">
              <h3 className="font-bold text-gray-700">
                <i className="bi bi-check-circle-fill text-green-500 mr-2"></i> Completados
              </h3>
              <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">{completedTickets.length}</span>
            </div>
            <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2 custom-scrollbar pb-4">
              {completedTickets.map((t) => <TicketCard key={t.sale.saleId} ticket={t} />)}
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={modals.delete}
        onClose={() => {
          toggleModal("delete", false);
          setTicketToCancel(null);
        }}
        deleteText="¿Cancelar Lavado?"
        actions={
          <button
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors shadow-sm"
            onClick={handleConfirmCancel}
          >
            Cancelar
          </button>
        }
      >
        <p className="text-center text-slate-600 mt-2 font-medium">
          ¿Estás seguro de que deseas cancelar este servicio?
        </p>
        <p className="text-center text-sm text-slate-500 mt-1">
          Esta acción no se puede deshacer y el registro desaparecerá del tablero activo.
        </p>
      </Modal>
    </>
  );
}