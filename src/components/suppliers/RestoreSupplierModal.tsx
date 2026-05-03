import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { Supplier } from "../../types/suppliers.types";

interface RestoreSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  restoringSupplier: Supplier | null;
  onRestore: () => Promise<void>;
  isLoading: boolean;
}

export default function RestoreSupplierModal({ isOpen, onClose, restoringSupplier, onRestore, isLoading }: RestoreSupplierModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      restoreText="Reactivar Proveedor"
      actions={<ActionButton type="restore" onClick={onRestore} isLoading={isLoading} />}
    >
      <div className="pt-4">
        <p className="text-center text-slate-700">
          ¿Estás seguro de que deseas reactivar al proveedor{" "}
          <span className="font-semibold text-slate-800">{restoringSupplier?.companyName}</span>?
        </p>
      </div>
    </Modal>
  );
}