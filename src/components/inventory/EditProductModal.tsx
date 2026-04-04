import React from "react";
import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { Product } from "../../types/inventory.types";

interface EditProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProduct: Product & { error?: boolean; errorMsg?: string };
  categories: { categoryId: number; name: string }[];
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.SyntheticEvent<HTMLFormElement>) => Promise<void> | void;
  isLoading: boolean;
}

export default function EditProductModal({
  isOpen,
  onClose,
  editingProduct,
  categories,
  onChange,
  onSubmit,
  isLoading
}: EditProductModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Producto"
      actions={<ActionButton type="edit" isLoading={isLoading} form="EditForm" />}
    >
      <form id="EditForm" className="flex flex-col gap-3" onSubmit={onSubmit}>
        <Input 
          name="name" 
          label="Nombre del Producto:" 
          type="text" 
          onChange={onChange} 
          value={editingProduct.name} 
        />
        
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label htmlFor="edit_categoryId" className="block text-sm font-medium text-slate-700">Categoría:</label>
            <select 
              id="edit_categoryId" 
              name="categoryId" 
              onChange={onChange} 
              value={editingProduct.categoryId || ""} 
              className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
            >
              <option value="" disabled>-- Selecciona una --</option>
              {categories.map(c => (
                <option key={c.categoryId} value={c.categoryId}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="edit_unitType" className="block text-sm font-medium text-slate-700">Unidad de Medida:</label>
            <select 
              id="edit_unitType" 
              name="unitType" 
              onChange={onChange} 
              value={editingProduct.unitType} 
              className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
            >
              <option value="" disabled>-- Selecciona una --</option>
              <option value="L">Litros (L)</option>
              <option value="G">Galones (G)</option>
              <option value="U">Unidades (U)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Input 
            name="currentStock" 
            label="Stock Actual:" 
            type="number" 
            onChange={onChange} 
            value={String(editingProduct.currentStock)} 
          />
          <Input 
            name="minStock" 
            label="Stock Mínimo:" 
            type="number" 
            onChange={onChange} 
            value={String(editingProduct.minStock)} 
          />
          <Input 
            name="unitCostLiter" 
            label="Costo/Precio:" 
            type="number" 
            onChange={onChange} 
            value={String(editingProduct.unitCostLiter)} 
            icon={<i className="bi bi-currency-dollar"></i>} 
          />
        </div>

        <div className="flex justify-center items-center h-8">
          {editingProduct.error && <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">{editingProduct.errorMsg}</span>}
        </div>
      </form>
    </Modal>
  );
}