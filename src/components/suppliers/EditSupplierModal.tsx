import React from "react";
import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { Supplier } from "../../types/suppliers.types";

interface EditSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingSupplier: Supplier & { error?: boolean; errorMsg?: string };
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
}

export default function EditSupplierModal({ isOpen, onClose, editingSupplier, onChange, onSubmit, isLoading }: EditSupplierModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Proveedor"
      actions={<ActionButton type="edit" form="edit-supplier-form" isLoading={isLoading} />}
    >
      <form id="edit-supplier-form" onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          name="companyName"
          label="Nombre de la Empresa:"
          type="text"
          value={editingSupplier.companyName}
          onChange={onChange}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="rif"
            label="RIF:"
            type="text"
            value={editingSupplier.rif}
            onChange={onChange}
            required
          />
          <Input
            name="numberPhone"
            label="Teléfono:"
            type="text"
            value={editingSupplier.numberPhone}
            onChange={onChange}
            icon={<i className="bi bi-telephone"></i>}
            required
          />
        </div>
        <Input
          name="email"
          label="Correo Electrónico:"
          type="email"
          value={editingSupplier.email}
          onChange={onChange}
          icon={<i className="bi bi-envelope"></i>}
          required
        />
        <div className="flex justify-center items-center h-6">
          {editingSupplier.error && (
            <span className="text-red-400 text-sm font-medium bg-red-400/10 px-3 py-1 rounded-md">
              {editingSupplier.errorMsg}
            </span>
          )}
        </div>
      </form>
    </Modal>
  );
}