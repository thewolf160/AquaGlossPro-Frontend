import Modal from "../Modal/Modal";
import Input from "../Modal/Input";
import type { Supplier } from "../../types/suppliers.types";

interface ViewSupplierModalProps {
  isOpen: boolean;
  onClose: () => void;
  supplier: Supplier | null;
}

export default function ViewSupplierModal({ isOpen, onClose, supplier }: ViewSupplierModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Proveedor">
      {supplier && (
        <div className="flex flex-col gap-4">
          <Input
            name="companyName"
            label="Nombre de la Empresa:"
            type="text"
            value={supplier.companyName}
            readOnly
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              name="rif"
              label="RIF:"
              type="text"
              value={supplier.rif}
              readOnly
            />
            <Input
              name="numberPhone"
              label="Teléfono:"
              type="text"
              value={supplier.numberPhone}
              icon={<i className="bi bi-telephone"></i>}
              readOnly
            />
          </div>
          <Input
            name="email"
            label="Correo Electrónico:"
            type="email"
            value={supplier.email}
            icon={<i className="bi bi-envelope"></i>}
            readOnly
          />
        </div>
      )}
    </Modal>
  );
}