import React from "react";
import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { NewProductForm } from "../../types/inventory.types";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  formState: NewProductForm;
  categories: { categoryId: number; name: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => Promise<void> | void;
  isLoading: boolean;
}

export default function AddProductModal({
  isOpen,
  onClose,
  formState,
  categories,
  onChange,
  onSubmit,
  isLoading
}: AddProductModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registro de Nuevo Producto"
      actions={<ActionButton type="register" isLoading={isLoading} form="RegisterForm" />}
    >
      <form id="RegisterForm" className="flex flex-col gap-3" onSubmit={onSubmit}>
        <Input 
          name="name" 
          label="Nombre del Producto:" 
          type="text" 
          onChange={onChange} 
          value={formState.form.name} 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="categoryId" className="block text-sm font-medium text-slate-700">Categoría:</label>
            <select 
              id="categoryId" 
              name="categoryId" 
              onChange={onChange} 
              value={formState.form.categoryId || ""} 
              className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
            >
              <option value="" disabled>-- Selecciona una --</option>
              {categories.map(c => (
                <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="unitType" className="block text-sm font-medium text-slate-700">Unidad de Medida:</label>
            <select 
              id="unitType" 
              name="unitType" 
              onChange={onChange} 
              value={formState.form.unitType} 
              className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
            >
              <option value="" disabled>-- Selecciona una --</option>
              <option value="L">Litros (L)</option>
              <option value="G">Galones (G)</option>
              <option value="U">Unidades (U)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input name="minStock" label="Stock Mínimo:" type="number" onChange={onChange} value={String(formState.form.minStock)} />
          <Input 
            name="unitCostLiter" 
            label="Costo/Precio:" 
            type="number" 
            onChange={onChange} 
            value={String(formState.form.unitCostLiter)} 
            icon={<i className="bi bi-currency-dollar"></i>} 
          />
        </div>
        
        <div className="flex justify-center items-center h-8">
          {formState.error && <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">{formState.errorMsg}</span>}
        </div>
      </form>
    </Modal>
  );
}