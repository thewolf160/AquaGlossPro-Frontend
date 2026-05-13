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
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function AddProductModal({
  isOpen,
  onClose,
  formState,
  categories,
  onChange,
  onSubmit,
  isLoading,
}: AddProductModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Nuevo Producto"
      actions={<ActionButton type="register" form="add-product-form" isLoading={isLoading} />}
    >
      <form id="add-product-form" onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          name="name"
          label="Nombre del Producto:"
          type="text"
          placeholder="Ej: Champú Cera Especial"
          value={formState.form.name}
          onChange={onChange}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-slate-700">Categoría:</label>
            <select
              name="categoryId"
              value={formState.form.categoryId !== null ? String(formState.form.categoryId) : ""}
              onChange={onChange}
              className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
              required
            >
              <option value="" disabled>-- Seleccione una --</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={String(cat.categoryId)}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-slate-700">Tipo de Unidad:</label>
            <select
              name="unitType"
              value={formState.form.unitType}
              onChange={onChange}
              className="w-full p-3 border border-slate-300 rounded-sm shadow-sm bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-300 transition-all ease-in"
              required
            >
              <option value="" disabled>-- Seleccione una --</option>
              <option value="L">Litros (L)</option>
              <option value="G">Galones (G)</option>
              <option value="U">Unidades (U)</option>
            </select>
          </div>
        </div>
        
        <Input
          name="minStock"
          label="Stock Mínimo Permitido:"
          type="number"
          placeholder="Ej: 5"
          min={0}
          /* Convertimos el número a string */
          value={String(formState.form.minStock)}
          onChange={onChange}
          required
        />

        <div className="flex justify-center items-center h-6">
          {formState.error && (
            <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
              {formState.errorMsg}
            </span>
          )}
        </div>
      </form>
    </Modal>
  );
}