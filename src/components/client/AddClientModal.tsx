import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddClientModal({ isOpen, onClose }: AddClientModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Registro de Nuevo Cliente" 
      actions={<ActionButton type="register" />}
    >
      <form className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="names" label="Nombres:" type="text" placeholder="Ej: Juan Pablo" />
          <Input name="lastnames" label="Apellidos:" type="text" placeholder="Ej: Pérez Gómez" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="ci" label="Cédula / RIF:" type="text" placeholder="V-12345678" />
          <Input name="numberPhone" label="Teléfono:" type="tel" placeholder="04120000000" />
        </div>
      </form>
    </Modal>
  );
}