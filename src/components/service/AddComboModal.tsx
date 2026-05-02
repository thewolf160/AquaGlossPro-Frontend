import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { ComboFormState, CatalogService } from "../../types/catalog.types";

interface AddComboModalProps {
  isOpen: boolean;
  onClose: () => void;
  formState: ComboFormState;
  services: CatalogService[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleService: (serviceId: number) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export default function AddComboModal({ 
  isOpen, onClose, formState, services, onChange, onToggleService, onSubmit, isLoading 
}: AddComboModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Crear Nuevo Combo"
      actions={<ActionButton type="register" form="add-combo-form" isLoading={isLoading} />}
    >
      <form id="add-combo-form" onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          name="name"
          label="Nombre del Paquete/Combo:"
          type="text"
          placeholder="Ej: Combo Full Limpieza"
          value={formState.name}
          onChange={onChange}
          required
        />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="discountPercentage"
            label="Porcentaje de Descuento:"
            type="number"
            placeholder="Ej: 15"
            value={String(formState.discountPercentage)}
            onChange={onChange}
            icon={<i className="bi bi-percent"></i>}
            required
            min={0}
            max={100}
          />
          
          <div className="flex items-center gap-2 mt-6">
            <input
              type="checkbox"
              id="isPromotion"
              name="isPromotion"
              checked={formState.isPromotion}
              onChange={onChange}
              className="w-5 h-5 cursor-pointer accent-blue-600"
            />
            <label htmlFor="isPromotion" className="text-sm font-medium text-slate-700 cursor-pointer">
              ¿Es Promoción Especial?
            </label>
          </div>
        </div>

        <div className="mt-2">
          <p className="text-sm font-medium text-slate-700 mb-2">Selecciona los servicios que incluye:</p>
          <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-md p-2 flex flex-col gap-2 custom-scrollbar bg-slate-50">
            {services.map(service => (
              <label key={service.id} className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded cursor-pointer transition-colors border border-transparent hover:border-slate-200">
              
                <input
                  type="checkbox"
                  checked={formState.selectedServiceIds.includes(service.id)}
                  onChange={() => onToggleService(service.id)}
                  className="w-4 h-4 cursor-pointer accent-blue-600"
                />
                <span className="text-sm font-medium text-slate-700">{service.name}</span>
                <span className="text-xs text-slate-400 ml-auto">{service.category}</span>
              </label>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}