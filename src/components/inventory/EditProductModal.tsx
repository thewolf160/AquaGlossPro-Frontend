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
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

export default function EditProductModal({
  isOpen,
  onClose,
  editingProduct,
  categories,
  onChange,
  onSubmit,
  isLoading,
}: EditProductModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Producto"
      actions={<ActionButton type="edit" form="edit-product-form" isLoading={isLoading} />}
    >
      <form id="edit-product-form" onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          name="name"
          label="Nombre del Producto:"
          type="text"
          value={editingProduct.name}
          onChange={onChange}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <label className="block text-sm font-medium text-slate-700">Categoría:</label>
            <select
              name="categoryId"
              value={editingProduct.categoryId !== null ? String(editingProduct.categoryId) : ""}
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
              value={editingProduct.unitType}
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
          min={0}
          value={String(editingProduct.minStock)}
          onChange={onChange}
          required
        />

        <div className="flex justify-center items-center h-6">
          {editingProduct.error && (
            <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
              {editingProduct.errorMsg}
            </span>
          )}
        </div>
      </form>
    </Modal>
  );
}