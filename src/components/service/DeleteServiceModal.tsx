import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { CatalogService } from "../../types/catalog.types"; 

interface DeleteServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletingService: CatalogService | null;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export default function DeleteServiceModal({ isOpen, onClose, deletingService, onDelete, isLoading }: DeleteServiceModalProps) {
  return (
    <Modal
       isOpen={isOpen}
       onClose={onClose}
       deleteText="Eliminar Servicio"
       actions={<ActionButton type="delete" onClick={() => deletingService && onDelete(deletingService.id)} isLoading={isLoading} />}
    >
      <div className="pt-4">
        <p className="text-center text-slate-700">
          ¿Estás seguro de que deseas eliminar el servicio{" "}
          <span className="font-bold text-slate-800">
            {deletingService?.name}
          </span>?
        </p>
      </div>
    </Modal>
  );
}