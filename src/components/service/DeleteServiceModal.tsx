import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { CatalogService } from "./ServiceCatalog";

interface DeleteServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletingService: CatalogService | null;
}

export default function DeleteServiceModal({ isOpen, onClose, deletingService }: DeleteServiceModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      deleteText="Eliminar Servicio" 
      actions={<ActionButton type="delete" />}
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