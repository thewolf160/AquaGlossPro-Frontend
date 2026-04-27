import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";

interface DeleteVehicleConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void> | void;
  plate: string;
  isLoading: boolean;
}

export default function DeleteVehicleConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  plate,
  isLoading
}: DeleteVehicleConfirmModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Eliminación"
      actions={
        <>
          
          
          <ActionButton
            type="delete"
            onClick={onConfirm}
            isLoading={isLoading}
          />
        </>
      }
    >
      <div className="flex flex-col items-center py-4 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-3xl mb-4">
          <i className="bi bi-exclamation-triangle"></i>
        </div>
        <p className="text-slate-600">
          ¿Estás seguro de eliminar el vehículo con placa <span className="font-bold text-slate-800">{plate}</span>?
        </p>
        <p className="text-sm text-slate-800 mt-2 font-bold">
          Esta acción no se puede deshacer desde este panel.
        </p>
      </div>
    </Modal>
  );
}