import React from "react";
import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import ActionButton from "../Modal/ActionButton";
import type { NewSupplierForm } from "../../types/suppliers.types";

interface AddSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  formState: NewSupplierForm;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  isLoading: boolean;
}

export default function AddSupplierModal({ isOpen, onClose, formState, onChange, onSubmit, isLoading }: AddSupplierModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Nuevo Proveedor"
      actions={<ActionButton type="register" form="add-supplier-form" isLoading={isLoading} />}
    >
      <form id="add-supplier-form" onSubmit={onSubmit} className="flex flex-col gap-4">
        <Input
          name="companyName"
          label="Nombre de la Empresa:"
          type="text"
          placeholder="Ej: Distribuidora Aqua C.A."
          value={formState.form.companyName}
          onChange={onChange}
          required
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            name="rif"
            label="RIF:"
            type="text"
            placeholder="Ej: J123456789"
            value={formState.form.rif}
            onChange={onChange}
            required
          />
          <Input
            name="numberPhone"
            label="Teléfono:"
            type="text"
            placeholder="Ej: +58-4121234567"
            value={formState.form.numberPhone}
            onChange={onChange}
            icon={<i className="bi bi-telephone"></i>}
            required
          />
        </div>
        <Input
          name="email"
          label="Correo Electrónico:"
          type="email"
          placeholder="Ej: contacto@empresa.com"
          value={formState.form.email}
          onChange={onChange}
          icon={<i className="bi bi-envelope"></i>}
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