import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { ServiceFormState, CategoryApi } from "../../types/catalog.types";

interface AddServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  formState: ServiceFormState;
  categories: CategoryApi[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function AddServiceModal({ isOpen, onClose, formState, categories, onChange, onSubmit, isLoading }: AddServiceModalProps) {
  return (
    <Modal
       isOpen={isOpen}
       onClose={onClose}
       title="Registrar Nuevo Servicio"
       actions={<ActionButton type="register" form="add-service-form" isLoading={isLoading} />}
    >
      <form id="add-service-form" onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input 
          name="name" 
          label="Nombre del Servicio:" 
          type="text" 
          placeholder="Ej: Lavado de Motor" 
          value={formState.name}
          onChange={onChange}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700">Categoría:</label>
            <select 
              id="categoryId" 
              name="categoryId" 
              value={String(formState.categoryId)}
              onChange={onChange}
              required
              className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
            >
              <option value="" disabled>-- Selecciona una --</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <Input
             name="comissionPercentage"
             label="Porcentaje de Ganancia:"
             type="number"
             placeholder="Ej: 20"
             value={String(formState.comissionPercentage)}
             onChange={onChange}
             icon={<i className="bi bi-percent"></i>}
             required
             min={0}
             max={100}
           />
        </div>
      </form>
    </Modal>
  );
}