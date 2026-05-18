import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { ComboApi } from "../../types/catalog.types";

interface RestoreComboModalProps {
  isOpen: boolean;
  onClose: () => void;
  restoringCombo: ComboApi | null;
  onRestore: (id: number) => Promise<boolean>;
  isLoading: boolean;
}

export default function RestoreComboModal({
  isOpen,
  onClose,
  restoringCombo,
  onRestore,
  isLoading,
}: RestoreComboModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      restoreText="Restaurar Combo"
      actions={
        <ActionButton
          type="restore"
          onClick={async () => {
            if (restoringCombo) {
              const success = await onRestore(restoringCombo.comboId);
              if (success) onClose();
            }
          }}
          isLoading={isLoading}
        />
      }
    >
      <div className="pt-4">
        <p className="text-center text-slate-700">
          ¿Estás seguro de que deseas reactivar el combo{" "}
          <span className="font-bold text-slate-800">
            {restoringCombo?.name}
          </span>
          ?
        </p>
      </div>
    </Modal>
  );
}
