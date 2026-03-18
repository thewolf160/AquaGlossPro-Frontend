import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { CatalogService } from "./ServiceCatalog";

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingService: CatalogService | null;
}

export default function EditServiceModal({ isOpen, onClose, editingService }: EditServiceModalProps) {
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Editar Servicio" 
      actions={<ActionButton type="edit" />}
    >
      {editingService && (
        <form className="flex flex-col gap-4">
          <Input 
            name="name" 
            label="Nombre del Servicio:" 
            type="text" 
            defaultValue={editingService.name} 
          />
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="edit_category" className="block text-sm font-medium text-slate-700">Categoría:</label>
              <select 
                id="edit_category" 
                name="category" 
                defaultValue={editingService.category} 
                className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
              >
                <option value="Exterior">Exterior</option>
                <option value="Interior">Interior</option>
                <option value="Acabado">Acabado</option>
                <option value="Mantenimiento">Mantenimiento</option>
              </select>
            </div>
          </div>
        </form>
      )}
    </Modal>
  );
}