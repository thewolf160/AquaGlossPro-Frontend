import Modal from "../Modal/Modal";
import ActionButton from "../Modal/ActionButton";
import type { ClientData } from "../../pages/Client";

interface DeleteClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  deletingClient: ClientData | null; 
}

export default function DeleteClientModal({ isOpen, onClose, deletingClient }: DeleteClientModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      deleteText="Eliminar Cliente" 
      actions={<ActionButton type="delete" />}
    >
      <div className="pt-4">
        <p className="text-center text-slate-700">
          ¿Estás seguro de que deseas eliminar a{" "}
          <span className="font-bold text-slate-800">
            {deletingClient?.name} {deletingClient?.lastname}
          </span>?
        </p>
      </div>
    </Modal>
  );
}