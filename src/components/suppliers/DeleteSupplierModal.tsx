import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { Supplier } from "../../types/suppliers.types";

interface DeleteSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletingSupplier: Supplier | null;
  onDelete: () => Promise<void>;
  isLoading: boolean;
}

export default function DeleteSupplierModal({ isOpen, onClose, deletingSupplier, onDelete, isLoading }: DeleteSupplierModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      deleteText="Eliminar Proveedor"
      actions={<ActionButton type="delete" onClick={onDelete} isLoading={isLoading} />}
    >
      <div className="pt-4">
        <p className="text-center text-slate-700">
          ¿Estás seguro de que deseas eliminar al proveedor{" "}
          <span className="font-semibold text-slate-800">{deletingSupplier?.companyName}</span>?
        </p>
      </div>
    </Modal>
  );
}