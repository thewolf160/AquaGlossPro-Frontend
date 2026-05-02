import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { ComboApi } from "../../types/catalog.types";

interface DeleteComboModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletingCombo: ComboApi | null;
  onDelete: (id: number) => Promise<boolean>;
  isLoading: boolean;
}

export default function DeleteComboModal({ isOpen, onClose, deletingCombo, onDelete, isLoading }: DeleteComboModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      deleteText="Eliminar Combo"
      actions={<ActionButton type="delete" onClick={async () => {
        if (deletingCombo) {
          const success = await onDelete(deletingCombo.comboId);
          if (success) onClose();
        }
      }} isLoading={isLoading} />}
    >
      <div className="pt-4">
        <p className="text-center text-slate-700">
           ¿Estás seguro de que deseas eliminar el combo <span className="font-bold text-slate-800">{deletingCombo?.name}</span>?
        </p>
      </div>
    </Modal>
  );
}