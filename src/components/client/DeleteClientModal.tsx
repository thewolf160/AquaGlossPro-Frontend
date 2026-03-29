import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { ClientMapped } from "../../types/clients.types";

interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletingClient: ClientMapped | null;
  onDelete: (id: number) => Promise<boolean>; // Función inyectada
  isLoading: boolean;
}

export default function DeleteClientModal({ 
  isOpen, 
  onClose, 
  deletingClient, 
  onDelete, 
  isLoading 
}: DeleteClientModalProps) {
  
  const handleDelete = async () => {
    if (!deletingClient) return;
    
    // Llamamos a la API con el ID real de la base de datos
    const success = await onDelete(deletingClient.clientId);
    if (success) {
      onClose();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Confirmar Eliminación" 
      actions={<ActionButton type="delete" onClick={handleDelete} isLoading={isLoading} />}
    >
      <div className="py-4">
        <p className="text-slate-600 text-lg">
          ¿Estás seguro que deseas eliminar al cliente <br />
          <span className="font-bold text-slate-800">
            {deletingClient?.name} {deletingClient?.lastname}
          </span>?
        </p>
        <p className="text-sm text-red-500 mt-4 bg-red-50 p-3 rounded-md border border-red-100">
          <i className="bi bi-exclamation-circle-fill mr-2"></i>
          Esta acción no se puede deshacer. Se mantendrá un registro histórico en la base de datos, pero el cliente ya no será visible en el directorio.
        </p>
      </div>
    </Modal>
  );
}