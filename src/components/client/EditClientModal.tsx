import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { ClientData } from "../../pages/Client";

interface EditClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingClient: ClientData | null;
}

export default function EditClientModal({ isOpen, onClose, editingClient }: EditClientModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Editar Cliente" 
      actions={<ActionButton type="edit" />}
    >
      {editingClient && (
        <form className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              name="names" 
              label="Nombres:" 
              type="text" 
              defaultValue={editingClient.name} 
            />
            <Input 
              name="lastnames" 
              label="Apellidos:" 
              type="text" 
              defaultValue={editingClient.lastname} 
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              name="ci" 
              label="Cédula / RIF:" 
              type="text" 
              defaultValue={editingClient.ci} 
            />
            <Input 
              name="numberPhone" 
              label="Teléfono:" 
              type="tel" 
              defaultValue={editingClient.numberPhone} 
            />
          </div>
        </form>
      )}
    </Modal>
  );
}