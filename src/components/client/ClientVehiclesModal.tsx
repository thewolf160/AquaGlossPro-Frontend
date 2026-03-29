import Modal from "../Modal/Modal";
import type { ClientMapped } from "../../types/clients.types";

interface ClientVehiclesModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ClientMapped | null;
  onDeleteVehicle: (plate: string) => void;
}

export default function ClientVehiclesModal({ isOpen, onClose, client, onDeleteVehicle }: ClientVehiclesModalProps) {

  const safeVehicles = client?.vehicles || [];

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Vehículos de ${client?.name || ""}`}
      actions={
        <button className="btn bg-slate-800 hover:bg-slate-900 text-white flex items-center gap-2 border-none">
          <i className="bi bi-plus-lg"></i> Añadir Vehículo
        </button>
      }
    >
      <div className="flex flex-col gap-3 pt-2 max-h-100 overflow-y-auto">
        {safeVehicles.map((vehiculo, index) => (
          <div key={index} className="flex justify-between items-center bg-slate-50 border border-slate-200 p-4 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl shadow-sm">
                <i className="bi bi-car-front"></i>
              </div>
              <div>
                <p className="font-black text-slate-800 text-lg leading-none">{vehiculo.plate}</p>
                <p className="text-sm text-slate-500 font-medium mt-1">{vehiculo.model}</p>
              </div>
            </div>
            <button 
              type="button"
              onClick={() => onDeleteVehicle(vehiculo.plate)}
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
      </div>
    </Modal>
  );
}