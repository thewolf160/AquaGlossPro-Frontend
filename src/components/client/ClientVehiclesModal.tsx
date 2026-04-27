import Modal from "../Modal/Modal";
import { useNavigate } from "react-router-dom"; 
import type { Client, ClientVehicle } from "../../types/clients.types";

interface ClientVehiclesModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: Client | null; 
  onDeleteVehicle: (id: string, plate: string) => void;
  isLoading?: boolean; 
}

export default function ClientVehiclesModal({ 
  isOpen, 
  onClose, 
  client, 
  onDeleteVehicle,
  isLoading 
}: ClientVehiclesModalProps) {

  const safeVehicles = client?.vehicles || [];
  const navigate = useNavigate(); 

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Vehículos de ${client?.names || ""}`} 
      actions={
        <button 
          type="button"
          onClick={() => {
            onClose(); 
            navigate("/vehicles"); 
          }}
          className="btn bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-2 border-none cursor-pointer"
        >
          <i className="bi bi-plus-lg"></i> Añadir Vehículo
        </button>
      }
    >
      <div className="flex flex-col gap-3 pt-2 max-h-100 overflow-y-auto">
        
        {isLoading ? (
          <div className="flex justify-center items-center py-10">
            <span className="loading loading-spinner loading-lg text-blue-600"></span>
          </div>
        ) : (
          <>
            {safeVehicles.map((vehiculo: ClientVehicle, index: number) => (
              <div key={index} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl shadow-sm">
                    <i className="bi bi-car-front"></i>
                  </div>
                  <div>
                    <p className="font-black text-slate-800 text-lg leading-none">{vehiculo.plate}</p>
                    <p className="text-sm text-slate-500 font-medium mt-1">
                      {vehiculo.typeVehicle?.name || "Desconocido"}
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => vehiculo.id && onDeleteVehicle(String(vehiculo.id), vehiculo.plate)}
                  className="text-red-400 hover:text-red-600 p-2 transition-colors cursor-pointer" 
                  title="Eliminar vehículo"
                >
                  <i className="bi bi-trash text-lg"></i>
                </button>
              </div>
            ))}

            {safeVehicles.length === 0 && (
              <p className="text-center text-slate-500 py-4 italic">Este cliente no tiene vehículos registrados.</p>
            )}
          </>
        )}
      </div>
    </Modal>
  );
}