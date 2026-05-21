import { useState, useEffect } from "react";
import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { CatalogService, CategoryApi, ServiceFormState, CreateServicePayload } from "../../types/catalog.types";

interface EditServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingService: CatalogService | null;
  categories: CategoryApi[];
  onEdit: (id: number, data: Partial<CreateServicePayload>) => void;
  isLoading: boolean;
}

export default function EditServiceModal({ isOpen, onClose, editingService, categories, onEdit, isLoading }: EditServiceModalProps) {
  const [formData, setFormData] = useState<ServiceFormState>({ name: "", categoryId: "", comissionPercentage: "" });

  // Inicializar el formulario cuando abre el modal o cambian las categorías (que pueden llegar después)
  useEffect(() => {
    if (isOpen && editingService) {
      const categoryObj = categories.find(c => c.name === editingService.category);
      setFormData({
        name: editingService.name,
        categoryId: categoryObj ? categoryObj.categoryId : "",
        comissionPercentage: editingService.comissionPercentage.toString()
      });
    } else if (!isOpen) {
      setFormData({ name: "", categoryId: "", comissionPercentage: "" });
    }
  }, [isOpen, editingService, categories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
       await onEdit(editingService.id, {
         name: formData.name,
         categoryId: Number(formData.categoryId),
         comissionPercentage: Number(formData.comissionPercentage)
       });
    }
  };

  return (
    <Modal
       isOpen={isOpen}
       onClose={onClose}
       title="Editar Servicio"
       actions={<ActionButton type="edit" form="edit-service-form" isLoading={isLoading} />}
    >
      {editingService && (
        <form id="edit-service-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
             name="name"
             label="Nombre del Servicio:"
             type="text"
             value={formData.name}
             onChange={handleChange}
             required
           />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="edit_categoryId" className="block text-sm font-medium text-slate-700">Categoría:</label>
              <select
                 id="edit_categoryId"
                 name="categoryId"
                 value={String(formData.categoryId)}
                 onChange={handleChange}
                 required
                 className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
              >
                <option value="" disabled>-- Selecciona una --</option>
                {categories.map(c => <option key={c.categoryId} value={c.categoryId}>{c.name}</option>)}
              </select>
            </div>
            <Input
               name="comissionPercentage"
               label="Porcentaje de Ganancia:"
               type="number"
               value={String(formData.comissionPercentage)}
               onChange={handleChange}
               icon={<i className="bi bi-percent"></i>}
               required
               min={0}
               max={100}
             />
          </div>
        </form>
      )}
    </Modal>
  );
}