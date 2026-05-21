// src/components/client/AddClientModal.tsx
import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { NewClientForm } from "../../types/clients.types";

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  formState: NewClientForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: () => Promise<boolean>;
  isLoading: boolean;
}

export default function AddClientModal({ 
  isOpen, 
  onClose, 
  formState, 
  onChange, 
  onSubmit,
  isLoading 
}: AddClientModalProps) {
  
 const handleSubmit = async (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    const success = await onSubmit();
    if (success) {
      onClose(); 
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Registro de Nuevo Cliente" 
      actions={<ActionButton type="register" onClick={() => handleSubmit()} isLoading={isLoading} />}
    >
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {formState.error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
            <i className="bi bi-exclamation-triangle-fill mr-2"></i>
            {formState.errorMsg}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input 
            name="names" 
            label="Nombres:" 
            type="text" 
            placeholder="Ej: Juan Pablo" 
            value={formState.form.names}
            onChange={onChange}
          />
          <Input 
            name="lastnames" 
            label="Apellidos:" 
            type="text" 
            placeholder="Ej: Pérez Gómez" 
            value={formState.form.lastnames}
            onChange={onChange}
          />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input 
            name="ci" 
            label="Cédula / RIF:" 
            type="text" 
            placeholder="V12345678" 
            value={formState.form.ci}
            onChange={onChange}
          />
          <Input 
            name="numberPhone" 
            label="Teléfono:" 
            type="tel" 
            placeholder="+58-4120000000" 
            value={formState.form.numberPhone}
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Input 
            name="email" 
            label="Correo Electrónico:" 
            type="email" 
            placeholder="cliente@correo.com" 
            value={formState.form.email}
            onChange={onChange}
          />
        </div>
      </form>
    </Modal>
  );
}