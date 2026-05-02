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
      restoreText="Restaurar Cliente" 
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
      <div className="pt-4">
        <p className="text-slate-700 text-center">
          ¿Estás seguro que deseas reactivar a {""}
          <span className="font-semibold text-slate-800">
            {restoringClient?.names} {restoringClient?.lastnames}
          </span>?
        </p>
      </div>
    </Modal>
  );
}


