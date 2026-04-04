import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { Client } from "../../types/clients.types";

interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletingClient: Client | null; 
  onDelete: (id: number) => Promise<boolean>; 
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
    if (!deletingClient?.id) return;
    
    const success = await onDelete(Number(deletingClient.id));
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
            {deletingClient?.names} {deletingClient?.lastnames}
          </span>?
        </p>
        <p className="text-sm text-red-500 mt-2">
          Esta acción enviará al cliente a la papelera.
        </p>
      </div>
    </Modal>
  );
}