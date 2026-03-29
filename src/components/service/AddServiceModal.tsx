import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddServiceModal({ isOpen, onClose }: AddServiceModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Registrar Nuevo Servicio" 
      actions={<ActionButton type="register" />}
    >
      <form className="flex flex-col gap-4">
        <Input name="name" label="Nombre del Servicio:" type="text" placeholder="Ej: Lavado de Motor" />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="category" className="block text-sm font-medium text-slate-700">Categoría:</label>
            <select id="category" name="category" defaultValue="" className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in">
              <option value="" disabled>-- Selecciona una --</option>
              <option value="Exterior">Exterior</option>
              <option value="Interior">Interior</option>
              <option value="Acabado">Acabado</option>
              <option value="Mantenimiento">Mantenimiento</option>
            </select>
          </div>
          <Input 
            name="percentage" 
            label="Porcentaje de Ganancia:" 
            type="number" 
            placeholder="Ej: 20" 
            icon={<i className="bi bi-percent"></i>} 
          />
        </div>
      </form>
    </Modal>
  );
}