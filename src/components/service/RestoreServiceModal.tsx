import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { CatalogService } from "../../types/catalog.types"; 

interface RestoreServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  restoringService: CatalogService | null;
  onRestore: (id: number) => void;
  isLoading: boolean;
}

export default function RestoreServiceModal({ isOpen, onClose, restoringService, onRestore, isLoading }: RestoreServiceModalProps) {
  return (
    <Modal
       isOpen={isOpen}
       onClose={onClose}
       restoreText="Restaurar Servicio"
       actions={<ActionButton type="restore" onClick={() => restoringService && onRestore(restoringService.id)} isLoading={isLoading} />}
    >
      <div className="pt-4">
        <p className="text-center text-slate-700">
          ¿Estás seguro de que deseas reactivar el servicio{" "}
          <span className="font-bold text-slate-800">
            {restoringService?.name}
          </span>?
        </p>
      </div>
    </Modal>
  );
}
