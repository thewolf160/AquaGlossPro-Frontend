import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { ComboFormState, CatalogService, ComboApi } from "../../types/catalog.types";

interface EditComboModalProps {
  isOpen: boolean;
  onClose: () => void;
  combo: ComboApi | null;
  services: CatalogService[];
  onEdit: (id: number, formData: ComboFormState) => Promise<boolean>;
  isLoading: boolean;
}

export default function EditComboModal({ isOpen, onClose, combo, services, onEdit, isLoading }: EditComboModalProps) {
  const [formData, setFormData] = useState<ComboFormState>({ name: "", discountPercentage: "", isPromotion: false, expirationDate: "", selectedServiceIds: [] });

  useEffect(() => {
    if (isOpen && combo) {
      const uniqueServiceIds = Array.from(new Set(combo.combosServices?.map(cs => cs.servicesTypeVehicle.service.serviceId) || []));
      
      const formattedDate = combo.expirationDate ? new Date(combo.expirationDate).toISOString().slice(0, 16) : "";
      
      setFormData({
        name: combo.name,
        discountPercentage: String(combo.discountPercentage),
        isPromotion: combo.isPromotion,
        expirationDate: formattedDate,
        selectedServiceIds: uniqueServiceIds
      });
    }
  }, [isOpen, combo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleService = (serviceId: number) => {
    setFormData(prev => ({
      ...prev,
      selectedServiceIds: prev.selectedServiceIds.includes(serviceId)
        ? prev.selectedServiceIds.filter(id => id !== serviceId)
        : [...prev.selectedServiceIds, serviceId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (combo) {
      const success = await onEdit(combo.comboId, formData);
      if (success) onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Combo" actions={<ActionButton type="edit" form="edit-combo-form" isLoading={isLoading} />}>
      <form id="edit-combo-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input name="name" label="Nombre del Paquete/Combo:" type="text" value={formData.name} onChange={handleChange} required />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input name="discountPercentage" label="Descuento:" type="number" value={formData.discountPercentage} onChange={handleChange} icon={<i className="bi bi-percent"></i>} required min={0} max={100} />
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 mt-6">
              <input type="checkbox" id="edit_isPromotion" name="isPromotion" checked={formData.isPromotion} onChange={handleChange} className="w-5 h-5 cursor-pointer accent-blue-600" />
              <label htmlFor="edit_isPromotion" className="text-sm font-medium text-slate-700 cursor-pointer">¿Es Promoción Especial?</label>
            </div>
          </div>
        </div>
        {formData.isPromotion && (
          <Input name="expirationDate" label="Fecha de Expiración:" type="datetime-local" value={formData.expirationDate} onChange={handleChange} required />
        )}
        <div className="mt-2">
          <p className="text-sm font-medium text-slate-700 mb-2">Servicios que incluye:</p>
          <div className="max-h-40 overflow-y-auto border border-slate-200 rounded-md p-2 flex flex-col gap-2 custom-scrollbar bg-slate-50">
            {services.map(service => (
              <label key={service.id} className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded cursor-pointer">
                <input type="checkbox" checked={formData.selectedServiceIds.includes(service.id)} onChange={() => toggleService(service.id)} className="w-4 h-4 cursor-pointer accent-blue-600" />
                <span className="text-sm font-medium text-slate-700">{service.name}</span>
              </label>
            ))}
          </div>
        </div>
      </form>
    </Modal>
  );
}