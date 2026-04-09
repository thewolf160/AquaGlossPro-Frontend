import Modal from "../Modal/Modal";
import type { Client } from "../../types/clients.types";

interface RestoreClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  restoringClient: Client | null;
  onRestore: (id: string) => Promise<boolean>;
  isLoading: boolean;
}

export default function RestoreClientModal({ 
  isOpen, 
  onClose, 
  restoringClient, 
  onRestore, 
  isLoading 
}: RestoreClientModalProps) {
  
  const handleRestore = async () => {
    if (!restoringClient?.id) return;
    
    const success = await onRestore(String(restoringClient.id));
    if (success) {
      onClose();
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Restaurar Cliente" 
      actions={
        <button 
          onClick={handleRestore}
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-colors flex items-center gap-2"
        >
          {isLoading ? <span className="loading loading-spinner loading-sm"></span> : <i className="bi bi-arrow-clockwise"></i>}
          Restaurar
        </button>
      }
    >
      <div className="py-4">
        <p className="text-slate-600 text-lg">
          ¿Estás seguro que deseas reactivar al cliente <br />
          <span className="font-bold text-slate-800">
            {restoringClient?.names} {restoringClient?.lastnames}
          </span>?
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Este cliente volverá a aparecer en las listas principales y podrá realizar operaciones.
        </p>
      </div>
    </Modal>
  );
}